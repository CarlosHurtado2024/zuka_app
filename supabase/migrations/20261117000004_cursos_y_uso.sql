-- Cursos que habilita el administrador y uso diario de la app (para las estadísticas del panel).
-- Spec: docs/superpowers/specs/2026-11-17-cursos-y-estadisticas.md

-- ---------- cursos ----------
-- Un curso sale en la vista de los estudiantes solo si está publicado. El administrador ve todos.
create table public.cursos (
  id text primary key check (char_length(id) <= 40),
  nombre text not null default '',
  orden integer not null default 0,
  publicado boolean not null default false
);
insert into public.cursos (id, nombre, orden, publicado) values
  ('algebra', 'Álgebra', 1, true), ('trig', 'Trigonometría', 2, true),
  ('calc', 'Cálculo Diferencial', 3, false), ('geo', 'Geometría Vectorial y Analítica', 4, false),
  ('fis', 'Física Mecánica', 5, false), ('int', 'Cálculo Integral', 6, false), ('lin', 'Álgebra Lineal', 7, false);

alter table public.cursos enable row level security;
revoke all on public.cursos from anon, authenticated;
grant select on public.cursos to anon, authenticated;
grant update (publicado) on public.cursos to authenticated;
create policy cursos_ver on public.cursos for select to anon, authenticated using (true);
create policy cursos_editar on public.cursos for update to authenticated
  using ((select public.es_admin())) with check ((select public.es_admin()));

-- ---------- uso diario ----------
-- Una fila por usuario y día (hora de Colombia): tiempo con la app abierta y a la vista, lecciones
-- completadas, ejercicios respondidos y aciertos. Solo la escribe registrar_uso.
create table public.uso_diario (
  usuario uuid not null references auth.users (id) on delete cascade,
  dia date not null,
  segundos integer not null default 0 check (segundos >= 0),
  lecciones integer not null default 0 check (lecciones >= 0),
  ejercicios integer not null default 0 check (ejercicios >= 0),
  aciertos integer not null default 0 check (aciertos >= 0),
  primary key (usuario, dia)
);
create index uso_diario_dia_idx on public.uso_diario (dia);

alter table public.uso_diario enable row level security;
revoke all on public.uso_diario from anon, authenticated;
grant select on public.uso_diario to authenticated;
create policy uso_ver on public.uso_diario for select to authenticated
  using (usuario = (select auth.uid()) or (select public.es_admin()));

alter table public.perfiles
  add column ultima_vez timestamptz,
  add column xp integer not null default 0 check (xp >= 0),
  add column racha integer not null default 0 check (racha >= 0);

create function privado.registrar_uso(p_segundos integer, p_lecciones integer default 0, p_ejercicios integer default 0,
  p_aciertos integer default 0, p_xp integer default null, p_racha integer default null) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_dia date := (now() at time zone 'America/Bogota')::date;
begin
  if v_uid is null then
    raise exception 'Hay que iniciar sesión' using errcode = '42501';
  end if;
  -- Cada envío cubre a lo sumo 5 minutos; un día no pasa de 24 horas.
  insert into public.uso_diario as u (usuario, dia, segundos, lecciones, ejercicios, aciertos)
  values (v_uid, v_dia,
    least(greatest(coalesce(p_segundos, 0), 0), 300), least(greatest(coalesce(p_lecciones, 0), 0), 50),
    least(greatest(coalesce(p_ejercicios, 0), 0), 500),
    least(greatest(coalesce(p_aciertos, 0), 0), least(greatest(coalesce(p_ejercicios, 0), 0), 500)))
  on conflict (usuario, dia) do update
  set segundos = least(u.segundos + excluded.segundos, 86400),
      lecciones = u.lecciones + excluded.lecciones,
      ejercicios = u.ejercicios + excluded.ejercicios,
      aciertos = u.aciertos + excluded.aciertos;
  update public.perfiles
  set ultima_vez = now(),
      xp = coalesce(least(greatest(p_xp, 0), 10000000), xp),
      racha = coalesce(least(greatest(p_racha, 0), 100000), racha)
  where id = v_uid;
end $$;

create function public.registrar_uso(p_segundos integer, p_lecciones integer default 0, p_ejercicios integer default 0,
  p_aciertos integer default 0, p_xp integer default null, p_racha integer default null) returns void
language sql volatile security invoker set search_path = ''
as $$ select privado.registrar_uso(p_segundos, p_lecciones, p_ejercicios, p_aciertos, p_xp, p_racha) $$;

-- ---------- videos: los de un curso sin publicar solo los ve el administrador ----------
create or replace function privado.acceso_video(p_video text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((
    select bool_or(public.tiene_acceso(l.nivel_minimo) and (
      public.es_admin() or not exists (select 1 from public.cursos c where c.id = l.curso and not c.publicado)))
    from public.lecciones l where l.videos @> array[p_video]
  ), false)
$$;

-- ---------- panel: usuarios con su último ingreso y sus minutos de la semana ----------
drop function public.admin_usuarios();
drop function privado.admin_usuarios();

create function privado.admin_usuarios()
returns table (id uuid, nombre text, correo text, telefono text, rol text, nivel text, duracion text,
  acceso_desde timestamptz, acceso_hasta timestamptz, creado_en timestamptz, ultima_vez timestamptz, minutos_7 integer)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo administradores' using errcode = '42501';
  end if;
  return query
    select p.id, p.nombre, u.email::text, p.telefono, p.rol, p.nivel, p.duracion, p.acceso_desde, p.acceso_hasta,
      p.creado_en, p.ultima_vez,
      coalesce((select round(sum(d.segundos) / 60.0)::integer from public.uso_diario d
        where d.usuario = p.id and d.dia > (now() at time zone 'America/Bogota')::date - 7), 0)
    from public.perfiles p join auth.users u on u.id = p.id
    order by p.acceso_hasta asc nulls last, p.creado_en desc;
end $$;

create function public.admin_usuarios()
returns table (id uuid, nombre text, correo text, telefono text, rol text, nivel text, duracion text,
  acceso_desde timestamptz, acceso_hasta timestamptz, creado_en timestamptz, ultima_vez timestamptz, minutos_7 integer)
language sql stable security invoker set search_path = ''
as $$ select * from privado.admin_usuarios() $$;

-- ---------- panel: detalle de un usuario, con su uso de los últimos 30 días ----------
create or replace function privado.admin_usuario(p_id uuid) returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo administradores' using errcode = '42501';
  end if;
  return (
    select jsonb_build_object(
      'perfil', to_jsonb(p) || jsonb_build_object('correo', u.email),
      'hoy', (now() at time zone 'America/Bogota')::date,
      'progreso', (select coalesce(jsonb_agg(jsonb_build_object('leccion', g.leccion, 'completada', g.completada,
          'segundos_vistos', g.segundos_vistos, 'actualizado_en', g.actualizado_en) order by g.actualizado_en desc), '[]'::jsonb)
        from public.progreso g where g.usuario = p.id),
      'uso', (select coalesce(jsonb_agg(jsonb_build_object('dia', d.dia, 'segundos', d.segundos, 'lecciones', d.lecciones,
          'ejercicios', d.ejercicios, 'aciertos', d.aciertos) order by d.dia), '[]'::jsonb)
        from public.uso_diario d where d.usuario = p.id and d.dia > (now() at time zone 'America/Bogota')::date - 30),
      'uso_total', (select jsonb_build_object('segundos', coalesce(sum(d.segundos), 0), 'dias', count(*),
          'ejercicios', coalesce(sum(d.ejercicios), 0), 'aciertos', coalesce(sum(d.aciertos), 0))
        from public.uso_diario d where d.usuario = p.id),
      'codigos', (select coalesce(jsonb_agg(jsonb_build_object('codigo', c.codigo, 'nivel', c.nivel, 'duracion', c.duracion,
          'dias', c.dias, 'nota', c.nota, 'usado_en', c.usado_en) order by c.usado_en desc), '[]'::jsonb)
        from public.codigos c where c.usado_por = p.id))
    from public.perfiles p join auth.users u on u.id = p.id
    where p.id = p_id);
end $$;

-- ---------- panel: métricas generales ----------
create or replace function privado.admin_resumen() returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_hoy date := (now() at time zone 'America/Bogota')::date;
begin
  if not public.es_admin() then
    raise exception 'Solo administradores' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'hoy', v_hoy,
    'usuarios', (select count(*) from public.perfiles where rol = 'estudiante'),
    'nuevos_7', (select count(*) from public.perfiles where rol = 'estudiante' and creado_en > now() - interval '7 days'),
    'activos', (select count(*) from public.perfiles where rol = 'estudiante' and acceso_hasta > now()),
    'vencidos', (select count(*) from public.perfiles where rol = 'estudiante' and acceso_hasta <= now()),
    'sin_plan', (select count(*) from public.perfiles where rol = 'estudiante' and acceso_hasta is null),
    'por_nivel', (select coalesce(jsonb_object_agg(t.nivel, t.n), '{}'::jsonb) from (
      select nivel, count(*) as n from public.perfiles
      where rol = 'estudiante' and acceso_hasta > now() group by nivel) t),
    'vencen_7', (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'nombre', p.nombre, 'correo', u.email,
        'nivel', p.nivel, 'acceso_hasta', p.acceso_hasta) order by p.acceso_hasta), '[]'::jsonb)
      from public.perfiles p join auth.users u on u.id = p.id
      where p.rol = 'estudiante' and p.acceso_hasta > now() and p.acceso_hasta <= now() + interval '7 days'),
    'codigos_disponibles', (select count(*) from public.codigos where usado_por is null),
    'codigos_usados', (select count(*) from public.codigos where usado_por is not null),
    -- uso (solo estudiantes)
    'usan_hoy', (select count(distinct d.usuario) from public.uso_diario d join public.perfiles p on p.id = d.usuario
      where p.rol = 'estudiante' and d.dia = v_hoy),
    'usan_7', (select count(distinct d.usuario) from public.uso_diario d join public.perfiles p on p.id = d.usuario
      where p.rol = 'estudiante' and d.dia > v_hoy - 7),
    'usan_30', (select count(distinct d.usuario) from public.uso_diario d join public.perfiles p on p.id = d.usuario
      where p.rol = 'estudiante' and d.dia > v_hoy - 30),
    'minutos_hoy', (select coalesce(round(sum(d.segundos) / 60.0), 0) from public.uso_diario d join public.perfiles p on p.id = d.usuario
      where p.rol = 'estudiante' and d.dia = v_hoy),
    'minutos_7', (select coalesce(round(sum(d.segundos) / 60.0), 0) from public.uso_diario d join public.perfiles p on p.id = d.usuario
      where p.rol = 'estudiante' and d.dia > v_hoy - 7),
    'minutos_dia_estudiante', (select coalesce(round(avg(d.segundos) / 60.0), 0) from public.uso_diario d join public.perfiles p on p.id = d.usuario
      where p.rol = 'estudiante' and d.dia > v_hoy - 7),
    'ejercicios_7', (select coalesce(sum(d.ejercicios), 0) from public.uso_diario d join public.perfiles p on p.id = d.usuario
      where p.rol = 'estudiante' and d.dia > v_hoy - 7),
    'aciertos_7', (select coalesce(sum(d.aciertos), 0) from public.uso_diario d join public.perfiles p on p.id = d.usuario
      where p.rol = 'estudiante' and d.dia > v_hoy - 7),
    'lecciones_7', (select count(*) from public.progreso g join public.perfiles p on p.id = g.usuario
      where p.rol = 'estudiante' and g.completada and g.actualizado_en > now() - interval '7 days'),
    'serie', (select jsonb_agg(jsonb_build_object('dia', s.dia, 'usuarios', s.usuarios, 'minutos', s.minutos) order by s.dia) from (
      select g.dia::date as dia, count(distinct d.usuario) as usuarios, coalesce(round(sum(d.segundos) / 60.0), 0) as minutos
      from generate_series(v_hoy - 13, v_hoy, interval '1 day') g(dia)
      left join (select d.* from public.uso_diario d join public.perfiles p on p.id = d.usuario where p.rol = 'estudiante') d
        on d.dia = g.dia::date
      group by g.dia) s),
    -- ventas: códigos canjeados en 30 días, al precio actual de su plan
    'canjes_30', (select count(*) from public.codigos where usado_en > now() - interval '30 days'),
    'ventas_30', (select coalesce(sum(pl.precio), 0) from public.codigos c
      join public.planes pl on pl.nivel = c.nivel and pl.duracion = c.duracion
      where c.usado_en > now() - interval '30 days'),
    'por_curso', (select coalesce(jsonb_agg(jsonb_build_object('curso', t.id, 'nombre', t.nombre, 'publicado', t.publicado,
        'estudiantes', t.estudiantes, 'completadas', t.completadas) order by t.orden), '[]'::jsonb) from (
      select c.id, c.nombre, c.publicado, c.orden,
        count(distinct g.usuario) filter (where p.rol = 'estudiante') as estudiantes,
        count(*) filter (where p.rol = 'estudiante' and g.completada) as completadas
      from public.cursos c
      left join public.lecciones l on l.curso = c.id and l.tipo = 'leccion'
      left join public.progreso g on g.leccion = l.id
      left join public.perfiles p on p.id = g.usuario
      group by c.id, c.nombre, c.publicado, c.orden) t),
    'top_lecciones', (select coalesce(jsonb_agg(jsonb_build_object('leccion', t.leccion, 'titulo', t.titulo, 'n', t.n) order by t.n desc, t.leccion), '[]'::jsonb) from (
      select g.leccion, coalesce(l.titulo, g.leccion) as titulo, count(*) as n
      from public.progreso g join public.perfiles p on p.id = g.usuario
      left join public.lecciones l on l.id = g.leccion
      where p.rol = 'estudiante' and g.completada
      group by g.leccion, l.titulo order by count(*) desc, g.leccion limit 8) t));
end $$;

revoke execute on function privado.registrar_uso(integer, integer, integer, integer, integer, integer),
  public.registrar_uso(integer, integer, integer, integer, integer, integer),
  privado.admin_usuarios(), public.admin_usuarios()
  from public, anon, authenticated;
grant execute on function privado.registrar_uso(integer, integer, integer, integer, integer, integer),
  public.registrar_uso(integer, integer, integer, integer, integer, integer),
  privado.admin_usuarios(), public.admin_usuarios() to authenticated;
