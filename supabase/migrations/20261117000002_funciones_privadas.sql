-- Lo que pidieron los asesores de seguridad de Supabase: las funciones SECURITY DEFINER salen del
-- esquema que expone la API (public) y quedan en `privado`. En public solo quedan envoltorios
-- SECURITY INVOKER con el mismo nombre, que es lo que llama la app.

create schema if not exists privado;
revoke all on schema privado from public;
grant usage on schema privado to anon, authenticated, service_role;

alter function public.es_admin() set schema privado;
alter function public.tiene_acceso(text) set schema privado;
alter function public.acceso_video(text) set schema privado;
alter function public.crear_perfil() set schema privado;
alter function public.promover_admin() set schema privado;
alter function public.canjear_codigo(text) set schema privado;
alter function public.generar_codigos(integer, text, text, text) set schema privado;
alter function public.admin_usuarios() set schema privado;
alter function public.admin_codigos() set schema privado;
alter function public.admin_resumen() set schema privado;
alter function public.admin_usuario(uuid) set schema privado;
alter function public.admin_acceso(uuid, text, text, text, integer) set schema privado;

create function public.es_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$ select privado.es_admin() $$;

create function public.tiene_acceso(p_nivel text default 'basico') returns boolean
language sql stable security invoker set search_path = ''
as $$ select privado.tiene_acceso(p_nivel) $$;

create function public.acceso_video(p_video text) returns boolean
language sql stable security invoker set search_path = ''
as $$ select privado.acceso_video(p_video) $$;

create function public.canjear_codigo(p_codigo text) returns jsonb
language sql volatile security invoker set search_path = ''
as $$ select privado.canjear_codigo(p_codigo) $$;

create function public.generar_codigos(p_cantidad integer, p_nivel text, p_duracion text, p_nota text default '')
returns setof public.codigos
language sql volatile security invoker set search_path = ''
as $$ select * from privado.generar_codigos(p_cantidad, p_nivel, p_duracion, p_nota) $$;

create function public.admin_usuarios()
returns table (id uuid, nombre text, correo text, telefono text, rol text, nivel text, duracion text,
  acceso_desde timestamptz, acceso_hasta timestamptz, creado_en timestamptz)
language sql stable security invoker set search_path = ''
as $$ select * from privado.admin_usuarios() $$;

create function public.admin_codigos()
returns table (codigo text, nivel text, duracion text, dias integer, nota text, creado_en timestamptz,
  usado_por uuid, usado_en timestamptz, usado_nombre text, usado_correo text)
language sql stable security invoker set search_path = ''
as $$ select * from privado.admin_codigos() $$;

create function public.admin_resumen() returns jsonb
language sql stable security invoker set search_path = ''
as $$ select privado.admin_resumen() $$;

create function public.admin_usuario(p_id uuid) returns jsonb
language sql stable security invoker set search_path = ''
as $$ select privado.admin_usuario(p_id) $$;

create function public.admin_acceso(p_id uuid, p_accion text, p_nivel text default null,
  p_duracion text default null, p_dias integer default null) returns jsonb
language sql volatile security invoker set search_path = ''
as $$ select privado.admin_acceso(p_id, p_accion, p_nivel, p_duracion, p_dias) $$;

revoke execute on function public.es_admin(), public.tiene_acceso(text), public.acceso_video(text),
  public.canjear_codigo(text), public.generar_codigos(integer, text, text, text), public.admin_usuarios(),
  public.admin_codigos(), public.admin_resumen(), public.admin_usuario(uuid),
  public.admin_acceso(uuid, text, text, text, integer)
  from public, anon, authenticated;

grant execute on function public.tiene_acceso(text), public.acceso_video(text) to anon, authenticated;
grant execute on function public.es_admin(), public.canjear_codigo(text),
  public.generar_codigos(integer, text, text, text), public.admin_usuarios(), public.admin_codigos(),
  public.admin_resumen(), public.admin_usuario(uuid), public.admin_acceso(uuid, text, text, text, integer)
  to authenticated;

-- Tablas internas: una política explícita (solo administradores, solo lectura) en vez de ninguna.
grant select on public.intentos_canje, public.admin_pendiente to authenticated;
create policy intentos_ver on public.intentos_canje for select to authenticated using ((select public.es_admin()));
create policy admin_pendiente_ver on public.admin_pendiente for select to authenticated using ((select public.es_admin()));
