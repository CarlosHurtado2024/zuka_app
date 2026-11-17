-- Canje con confirmación: si el código es de otro nivel y el plan actual sigue vigente, canjearlo
-- reemplaza el plan y se pierden los días que quedaban. La primera llamada no gasta el código: avisa
-- ('reemplaza') y la app pide confirmar; la segunda, con p_confirmar, lo canjea.

drop function public.canjear_codigo(text);
drop function privado.canjear_codigo(text);

create function privado.canjear_codigo(p_codigo text, p_confirmar boolean default false) returns jsonb
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

  select * into v_perfil from public.perfiles where id = v_uid for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'sin_perfil');
  end if;

  if (select count(*) from public.intentos_canje
      where usuario = v_uid and creado_en > now() - interval '15 minutes') >= 5 then
    return jsonb_build_object('ok', false, 'error', 'demasiados_intentos');
  end if;

  if not coalesce(p_confirmar, false) and v_perfil.acceso_hasta > now() then
    select * into v_cod from public.codigos where codigo = v_codigo and usado_por is null;
    if found and v_cod.nivel <> v_perfil.nivel then
      return jsonb_build_object('ok', false, 'error', 'reemplaza', 'nivel', v_cod.nivel, 'dias', v_cod.dias,
        'nivel_actual', v_perfil.nivel, 'acceso_hasta', v_perfil.acceso_hasta);
    end if;
  end if;

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
    v_desde := v_perfil.acceso_desde;
    v_hasta := v_perfil.acceso_hasta + make_interval(days => v_cod.dias);
  else
    v_desde := now();
    v_hasta := now() + make_interval(days => v_cod.dias);
  end if;

  update public.perfiles
  set nivel = v_cod.nivel, duracion = v_cod.duracion, acceso_desde = v_desde, acceso_hasta = v_hasta
  where id = v_uid;

  return jsonb_build_object('ok', true, 'nivel', v_cod.nivel, 'duracion', v_cod.duracion,
    'dias', v_cod.dias, 'acceso_desde', v_desde, 'acceso_hasta', v_hasta);
end $$;

create function public.canjear_codigo(p_codigo text, p_confirmar boolean default false) returns jsonb
language sql volatile security invoker set search_path = ''
as $$ select privado.canjear_codigo(p_codigo, p_confirmar) $$;

revoke execute on function privado.canjear_codigo(text, boolean), public.canjear_codigo(text, boolean)
  from public, anon, authenticated;
grant execute on function privado.canjear_codigo(text, boolean), public.canjear_codigo(text, boolean) to authenticated;
