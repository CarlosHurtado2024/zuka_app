-- Ajustes tras la revisión de cursos y uso:
-- 1. `progreso.completada_en`: cuándo se completó la lección (actualizado_en cambia con cada avance del
--    video, así que no sirve para contar «lecciones completadas esta semana»).
-- 2. Topes diarios en uso_diario para lecciones, ejercicios y aciertos.

alter table public.progreso add column completada_en timestamptz;
update public.progreso set completada_en = actualizado_en where completada;
grant update (completada_en) on public.progreso to authenticated;

create or replace function public.guardar_progreso(p_filas jsonb) returns integer
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
  insert into public.progreso as g (usuario, leccion, completada, segundos_vistos, completada_en)
  select auth.uid(), f.leccion, bool_or(f.completada), max(f.segundos), case when bool_or(f.completada) then now() end
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
      completada_en = coalesce(g.completada_en, excluded.completada_en),
      segundos_vistos = greatest(g.segundos_vistos, excluded.segundos_vistos),
      actualizado_en = now();
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- Las dos funciones siguientes solo cambian una línea: se rehacen a partir de su definición actual.
do $$
declare
  v_def text;
  v_new text;
begin
  v_def := pg_get_functiondef('privado.admin_resumen()'::regprocedure);
  v_new := replace(v_def, 'g.completada and g.actualizado_en > now()', 'g.completada and g.completada_en > now()');
  if v_new = v_def then raise exception 'admin_resumen: no se encontró la línea de lecciones_7'; end if;
  execute v_new;

  v_def := pg_get_functiondef('privado.registrar_uso(integer, integer, integer, integer, integer, integer)'::regprocedure);
  v_new := replace(v_def, 'lecciones = u.lecciones + excluded.lecciones', 'lecciones = least(u.lecciones + excluded.lecciones, 500)');
  v_new := replace(v_new, 'ejercicios = u.ejercicios + excluded.ejercicios', 'ejercicios = least(u.ejercicios + excluded.ejercicios, 5000)');
  v_new := replace(v_new, 'aciertos = u.aciertos + excluded.aciertos', 'aciertos = least(u.aciertos + excluded.aciertos, 5000)');
  if v_new = v_def then raise exception 'registrar_uso: no se encontraron las líneas de los contadores'; end if;
  execute v_new;
end $$;
