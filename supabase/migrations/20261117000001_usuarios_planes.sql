-- Zuka: usuarios, planes, códigos de acceso, progreso y catálogo de contenidos.
-- Spec: docs/superpowers/specs/2026-11-17-usuarios-planes-admin.md

-- ---------- tablas ----------
create table public.planes (
  nivel text not null check (nivel in ('basico', 'medio', 'pro')),
  duracion text not null check (duracion in ('mensual', 'semestral', 'anual')),
  dias integer not null check (dias > 0),
  precio integer not null check (precio >= 0),
  primary key (nivel, duracion)
);

insert into public.planes (nivel, duracion, dias, precio) values
  ('basico', 'mensual', 30, 20000), ('basico', 'semestral', 180, 75000), ('basico', 'anual', 365, 120000),
  ('medio', 'mensual', 30, 30000), ('medio', 'semestral', 180, 109000), ('medio', 'anual', 365, 179000),
  ('pro', 'mensual', 30, 50000), ('pro', 'semestral', 180, 189000), ('pro', 'anual', 365, 299000);

create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default '' check (char_length(nombre) <= 80),
  telefono text not null default '' check (char_length(telefono) <= 30),
  rol text not null default 'estudiante' check (rol in ('estudiante', 'admin')),
  nivel text check (nivel in ('basico', 'medio', 'pro')),
  duracion text check (duracion in ('mensual', 'semestral', 'anual')),
  acceso_desde timestamptz,
  acceso_hasta timestamptz,
  creado_en timestamptz not null default now()
);
create index perfiles_acceso_hasta_idx on public.perfiles (acceso_hasta);

create table public.codigos (
  codigo text primary key check (codigo ~ '^[A-HJ-NP-Z2-9]{10}$'),
  nivel text not null check (nivel in ('basico', 'medio', 'pro')),
  duracion text not null check (duracion in ('mensual', 'semestral', 'anual')),
  dias integer not null check (dias > 0),
  nota text not null default '' check (char_length(nota) <= 200),
  creado_en timestamptz not null default now(),
  creado_por uuid references auth.users (id) on delete set null,
  usado_por uuid references auth.users (id) on delete set null,
  usado_en timestamptz
);
create index codigos_usado_por_idx on public.codigos (usado_por);
create index codigos_creado_por_idx on public.codigos (creado_por);

create table public.progreso (
  usuario uuid not null default auth.uid() references auth.users (id) on delete cascade,
  leccion text not null check (char_length(leccion) <= 80),
  completada boolean not null default false,
  segundos_vistos integer not null default 0 check (segundos_vistos >= 0),
  actualizado_en timestamptz not null default now(),
  primary key (usuario, leccion)
);

create table public.intentos_canje (
  id bigint generated always as identity primary key,
  usuario uuid not null references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);
create index intentos_canje_usuario_idx on public.intentos_canje (usuario, creado_en);

-- Catálogo de lo que se puede abrir: lecciones, jefes, evaluaciones, resúmenes, clips y tutorías.
-- nivel_minimo dice qué plan lo desbloquea ('gratis' = cualquiera). Se llena con tools/sync-lecciones.js.
create table public.lecciones (
  id text primary key check (char_length(id) <= 80),
  tipo text not null default 'leccion' check (tipo in ('leccion', 'jefe', 'evaluacion', 'resumen', 'clip', 'tutorias')),
  curso text not null default '',
  titulo text not null default '',
  orden integer not null default 0,
  nivel_minimo text not null default 'basico' check (nivel_minimo in ('gratis', 'basico', 'medio', 'pro')),
  videos text[] not null default '{}'
);
create index lecciones_videos_idx on public.lecciones using gin (videos);

-- Correos que reciben el rol admin al registrarse (y confirmar el correo). Se borra al usarse.
create table public.admin_pendiente (
  correo text primary key
);

-- ---------- funciones auxiliares ----------
create function public.nivel_rango(p_nivel text) returns integer
language sql immutable set search_path = ''
as $$ select case p_nivel when 'basico' then 1 when 'medio' then 2 when 'pro' then 3 else 0 end $$;

create function public.es_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.perfiles where id = (select auth.uid()) and rol = 'admin') $$;

-- ¿El usuario actual puede abrir algo que pide p_nivel? ('gratis' lo abre cualquiera.)
create function public.tiene_acceso(p_nivel text default 'basico') returns boolean
language sql stable security definer set search_path = ''
as $$
  select p_nivel = 'gratis' or exists (
    select 1 from public.perfiles p
    where p.id = (select auth.uid())
      and (p.rol = 'admin'
        or (p.acceso_hasta > now() and public.nivel_rango(p.nivel) >= public.nivel_rango(p_nivel))))
$$;

-- ¿Puede ver este video de Bunny? Lo usa la función que firma los enlaces. Un video que no está en el
-- catálogo no se entrega.
create function public.acceso_video(p_video text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((
    select bool_or(public.tiene_acceso(l.nivel_minimo)) from public.lecciones l where l.videos @> array[p_video]
  ), false)
$$;

-- ---------- perfil automático al registrarse ----------
create function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre, telefono)
  values (new.id,
    left(coalesce(new.raw_user_meta_data ->> 'nombre', ''), 80),
    left(coalesce(new.raw_user_meta_data ->> 'telefono', ''), 30))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger zuka_crear_perfil after insert on auth.users
  for each row execute function public.crear_perfil();

-- El rol admin solo se entrega cuando el correo ya está confirmado.
create function public.promover_admin() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.email_confirmed_at is not null then
    delete from public.admin_pendiente where lower(correo) = lower(new.email);
    if found then
      update public.perfiles set rol = 'admin' where id = new.id;
    end if;
  end if;
  return new;
end $$;

create trigger zuka_promover_admin after insert or update of email_confirmed_at on auth.users
  for each row execute function public.promover_admin();

insert into public.perfiles (id, nombre, telefono)
select u.id, left(coalesce(u.raw_user_meta_data ->> 'nombre', ''), 80), left(coalesce(u.raw_user_meta_data ->> 'telefono', ''), 30)
from auth.users u on conflict (id) do nothing;

-- ---------- canje de códigos ----------
create function public.canjear_codigo(p_codigo text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_codigo text := upper(regexp_replace(coalesce(p_codigo, ''), '[^A-Za-z0-9]', '', 'g'));
  v_cod public.codigos;
  v_perfil public.perfiles;
  v_desde timestamptz;
  v_hasta timestamptz;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'sin_sesion');
  end if;

  -- El perfil se bloquea primero: dos canjes del mismo usuario no se cruzan.
  select * into v_perfil from public.perfiles where id = v_uid for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'sin_perfil');
  end if;

  if (select count(*) from public.intentos_canje
      where usuario = v_uid and creado_en > now() - interval '15 minutes') >= 5 then
    return jsonb_build_object('ok', false, 'error', 'demasiados_intentos');
  end if;

  -- Marca el código como usado solo si sigue libre (una sola sentencia: nadie más puede ganarlo).
  update public.codigos set usado_por = v_uid, usado_en = now()
  where codigo = v_codigo and usado_por is null
  returning * into v_cod;

  if not found then
    insert into public.intentos_canje (usuario) values (v_uid);
    if exists (select 1 from public.codigos where codigo = v_codigo) then
      return jsonb_build_object('ok', false, 'error', 'ya_usado');
    end if;
    return jsonb_build_object('ok', false, 'error', 'no_existe');
  end if;

  if v_perfil.nivel = v_cod.nivel and v_perfil.acceso_hasta > now() then
    -- Mismo nivel y plan vigente: los días se suman al final.
    v_desde := v_perfil.acceso_desde;
    v_hasta := v_perfil.acceso_hasta + make_interval(days => v_cod.dias);
  else
    -- Otro nivel (o plan vencido): el nivel nuevo reemplaza al anterior y cuenta desde hoy.
    v_desde := now();
    v_hasta := now() + make_interval(days => v_cod.dias);
  end if;

  update public.perfiles
  set nivel = v_cod.nivel, duracion = v_cod.duracion, acceso_desde = v_desde, acceso_hasta = v_hasta
  where id = v_uid;

  return jsonb_build_object('ok', true, 'nivel', v_cod.nivel, 'duracion', v_cod.duracion,
    'dias', v_cod.dias, 'acceso_desde', v_desde, 'acceso_hasta', v_hasta);
end $$;

create function public.generar_codigos(p_cantidad integer, p_nivel text, p_duracion text, p_nota text default '')
returns setof public.codigos
language plpgsql security definer set search_path = ''
as $$
declare
  v_abc constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   -- 32 letras: sin I, O, 0, 1
  v_dias integer;
  v_codigo text;
  v_bytes bytea;
  v_hechos integer := 0;
  v_fila public.codigos;
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede generar códigos' using errcode = '42501';
  end if;
  if p_cantidad is null or p_cantidad < 1 or p_cantidad > 200 then
    raise exception 'La cantidad debe estar entre 1 y 200' using errcode = '22023';
  end if;
  select dias into v_dias from public.planes where nivel = p_nivel and duracion = p_duracion;
  if v_dias is null then
    raise exception 'No existe el plan % %', p_nivel, p_duracion using errcode = '22023';
  end if;

  while v_hechos < p_cantidad loop
    v_bytes := extensions.gen_random_bytes(10);
    v_codigo := '';
    for i in 0..9 loop
      v_codigo := v_codigo || substr(v_abc, (get_byte(v_bytes, i) % 32) + 1, 1);
    end loop;
    begin
      insert into public.codigos (codigo, nivel, duracion, dias, nota, creado_por)
      values (v_codigo, p_nivel, p_duracion, v_dias, left(coalesce(p_nota, ''), 200), auth.uid())
      returning * into v_fila;
      v_hechos := v_hechos + 1;
      return next v_fila;
    exception when unique_violation then
      null;   -- código repetido (casi imposible): se saca otro
    end;
  end loop;
end $$;

-- ---------- progreso ----------
-- Guarda varias lecciones a la vez: [{ "leccion": "alg-11", "completada": true, "segundos": 120 }, …].
-- Nunca desmarca una lección completada ni baja los segundos vistos. Corre con los permisos de quien
-- llama: las políticas de `progreso` siguen valiendo.
create function public.guardar_progreso(p_filas jsonb) returns integer
language plpgsql security invoker set search_path = ''
as $$
declare
  v_n integer;
begin
  if auth.uid() is null then
    raise exception 'Hay que iniciar sesión' using errcode = '42501';
  end if;
  if jsonb_typeof(p_filas) is distinct from 'array' or jsonb_array_length(p_filas) > 500 then
    raise exception 'Se esperaba una lista de hasta 500 lecciones' using errcode = '22023';
  end if;
  insert into public.progreso as g (usuario, leccion, completada, segundos_vistos)
  select auth.uid(), f.leccion, bool_or(f.completada), max(f.segundos)
  from (
    select left(x ->> 'leccion', 80) as leccion,
      coalesce((x ->> 'completada')::boolean, false) as completada,
      least(greatest(coalesce((x ->> 'segundos')::integer, 0), 0), 86400) as segundos
    from jsonb_array_elements(p_filas) x
    where coalesce(x ->> 'leccion', '') <> ''
  ) f
  group by f.leccion
  on conflict (usuario, leccion) do update
  set completada = g.completada or excluded.completada,
      segundos_vistos = greatest(g.segundos_vistos, excluded.segundos_vistos),
      actualizado_en = now();
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- ---------- funciones del panel de administración ----------
create function public.admin_usuarios()
returns table (id uuid, nombre text, correo text, telefono text, rol text, nivel text, duracion text,
  acceso_desde timestamptz, acceso_hasta timestamptz, creado_en timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo administradores' using errcode = '42501';
  end if;
  return query
    select p.id, p.nombre, u.email::text, p.telefono, p.rol, p.nivel, p.duracion, p.acceso_desde, p.acceso_hasta, p.creado_en
    from public.perfiles p join auth.users u on u.id = p.id
    order by p.acceso_hasta asc nulls last, p.creado_en desc;
end $$;

create function public.admin_codigos()
returns table (codigo text, nivel text, duracion text, dias integer, nota text, creado_en timestamptz,
  usado_por uuid, usado_en timestamptz, usado_nombre text, usado_correo text)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo administradores' using errcode = '42501';
  end if;
  return query
    select c.codigo, c.nivel, c.duracion, c.dias, c.nota, c.creado_en, c.usado_por, c.usado_en, p.nombre, u.email::text
    from public.codigos c
    left join public.perfiles p on p.id = c.usado_por
    left join auth.users u on u.id = c.usado_por
    order by c.creado_en desc, c.codigo;
end $$;

create function public.admin_resumen() returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo administradores' using errcode = '42501';
  end if;
  return jsonb_build_object(
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
    'codigos_usados', (select count(*) from public.codigos where usado_por is not null));
end $$;

create function public.admin_usuario(p_id uuid) returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo administradores' using errcode = '42501';
  end if;
  return (
    select jsonb_build_object(
      'perfil', to_jsonb(p) || jsonb_build_object('correo', u.email),
      'progreso', (select coalesce(jsonb_agg(jsonb_build_object('leccion', g.leccion, 'completada', g.completada,
          'segundos_vistos', g.segundos_vistos, 'actualizado_en', g.actualizado_en) order by g.actualizado_en desc), '[]'::jsonb)
        from public.progreso g where g.usuario = p.id),
      'codigos', (select coalesce(jsonb_agg(jsonb_build_object('codigo', c.codigo, 'nivel', c.nivel, 'duracion', c.duracion,
          'dias', c.dias, 'nota', c.nota, 'usado_en', c.usado_en) order by c.usado_en desc), '[]'::jsonb)
        from public.codigos c where c.usado_por = p.id))
    from public.perfiles p join auth.users u on u.id = p.id
    where p.id = p_id);
end $$;

-- Acciones manuales sobre el acceso de un usuario: 'extender' (suma días al final, o desde hoy si
-- ya venció), 'cambiar' (nivel y duración nuevos, desde hoy) y 'revocar' (queda sin plan).
create function public.admin_acceso(p_id uuid, p_accion text, p_nivel text default null,
  p_duracion text default null, p_dias integer default null) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_perfil public.perfiles;
  v_dias integer;
begin
  if not public.es_admin() then
    raise exception 'Solo administradores' using errcode = '42501';
  end if;
  select * into v_perfil from public.perfiles where id = p_id for update;
  if not found then
    raise exception 'No existe ese usuario' using errcode = '22023';
  end if;

  if p_accion = 'extender' then
    if v_perfil.nivel is null then
      raise exception 'El usuario no tiene plan: usa «cambiar» para asignarle uno' using errcode = '22023';
    end if;
    if p_dias is null or p_dias < 1 or p_dias > 3650 then
      raise exception 'Los días deben estar entre 1 y 3650' using errcode = '22023';
    end if;
    update public.perfiles
    set acceso_desde = case when acceso_hasta > now() then acceso_desde else now() end,
        acceso_hasta = greatest(acceso_hasta, now()) + make_interval(days => p_dias)
    where id = p_id;
  elsif p_accion = 'cambiar' then
    select dias into v_dias from public.planes where nivel = p_nivel and duracion = p_duracion;
    if v_dias is null then
      raise exception 'No existe el plan % %', p_nivel, p_duracion using errcode = '22023';
    end if;
    v_dias := coalesce(p_dias, v_dias);
    if v_dias < 1 or v_dias > 3650 then
      raise exception 'Los días deben estar entre 1 y 3650' using errcode = '22023';
    end if;
    update public.perfiles
    set nivel = p_nivel, duracion = p_duracion, acceso_desde = now(), acceso_hasta = now() + make_interval(days => v_dias)
    where id = p_id;
  elsif p_accion = 'revocar' then
    update public.perfiles set nivel = null, duracion = null, acceso_desde = null, acceso_hasta = null where id = p_id;
  else
    raise exception 'Acción desconocida: %', p_accion using errcode = '22023';
  end if;

  return (select to_jsonb(p) from public.perfiles p where p.id = p_id);
end $$;

-- ---------- seguridad: filas ----------
alter table public.planes enable row level security;
alter table public.perfiles enable row level security;
alter table public.codigos enable row level security;
alter table public.progreso enable row level security;
alter table public.intentos_canje enable row level security;
alter table public.lecciones enable row level security;
alter table public.admin_pendiente enable row level security;

-- Privilegios: se quita todo y se da solo lo necesario. Lo que no tiene privilegio ni política
-- (intentos_canje, admin_pendiente) solo se toca desde las funciones.
revoke all on public.planes, public.perfiles, public.codigos, public.progreso, public.intentos_canje,
  public.lecciones, public.admin_pendiente from anon, authenticated;

grant select on public.planes, public.lecciones to anon, authenticated;
grant update (dias, precio) on public.planes to authenticated;
grant update (nivel_minimo) on public.lecciones to authenticated;
grant select on public.perfiles to authenticated;
grant update (nombre, telefono) on public.perfiles to authenticated;   -- nunca rol, nivel ni fechas
grant select on public.codigos to authenticated;
grant select, insert, delete on public.progreso to authenticated;
grant update (completada, segundos_vistos, actualizado_en) on public.progreso to authenticated;

create policy planes_ver on public.planes for select to anon, authenticated using (true);
create policy planes_editar on public.planes for update to authenticated
  using ((select public.es_admin())) with check ((select public.es_admin()));

create policy lecciones_ver on public.lecciones for select to anon, authenticated using (true);
create policy lecciones_editar on public.lecciones for update to authenticated
  using ((select public.es_admin())) with check ((select public.es_admin()));

create policy perfiles_ver on public.perfiles for select to authenticated
  using (id = (select auth.uid()) or (select public.es_admin()));
create policy perfiles_editar on public.perfiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy codigos_ver on public.codigos for select to authenticated using ((select public.es_admin()));

create policy progreso_ver on public.progreso for select to authenticated
  using (usuario = (select auth.uid()) or (select public.es_admin()));
create policy progreso_crear on public.progreso for insert to authenticated
  with check (usuario = (select auth.uid()));
create policy progreso_editar on public.progreso for update to authenticated
  using (usuario = (select auth.uid())) with check (usuario = (select auth.uid()));
create policy progreso_borrar on public.progreso for delete to authenticated
  using (usuario = (select auth.uid()));

-- ---------- seguridad: funciones ----------
revoke execute on function public.nivel_rango(text), public.es_admin(), public.tiene_acceso(text),
  public.acceso_video(text), public.crear_perfil(), public.promover_admin(), public.canjear_codigo(text),
  public.generar_codigos(integer, text, text, text), public.admin_usuarios(), public.admin_codigos(),
  public.admin_resumen(), public.admin_usuario(uuid), public.admin_acceso(uuid, text, text, text, integer),
  public.guardar_progreso(jsonb)
  from public, anon, authenticated;

grant execute on function public.guardar_progreso(jsonb) to authenticated;

grant execute on function public.nivel_rango(text), public.tiene_acceso(text), public.acceso_video(text)
  to anon, authenticated;
grant execute on function public.es_admin(), public.canjear_codigo(text),
  public.generar_codigos(integer, text, text, text), public.admin_usuarios(), public.admin_codigos(),
  public.admin_resumen(), public.admin_usuario(uuid), public.admin_acceso(uuid, text, text, text, integer)
  to authenticated;
