-- Curso Preuniversitario UdeA (spec docs/superpowers/specs/2026-11-18-curso-preuda.md): nace sin publicar, en borrador,
-- hasta la revisión docente de sus textos y ejercicios. El administrador lo publica desde el panel.
insert into public.cursos (id, nombre, orden, publicado) values
  ('preuda', 'Preuniversitario UdeA', 8, false)
on conflict (id) do nothing;
