// Planes y acceso: lógica pura (sin red ni DOM), compartida por la app y el panel /admin.
// La validación que cuenta está en Supabase (funciones canjear_codigo, tiene_acceso, acceso_video);
// esto solo decide qué se pinta. Spec: docs/superpowers/specs/2026-11-17-usuarios-planes-admin.md

const SUPA_URL = 'https://bzzzufyjhzjqawwrduom.supabase.co';
const SUPA_KEY = 'sb_publishable_g9nE6w3Da54IrmHbeKkXQg_iWR8eiAC';   // llave pública: va en el navegador

const NIVELES = ['gratis', 'basico', 'medio', 'pro'];
const NIVEL_NOMBRE = { gratis: 'Gratis', basico: 'Básico', medio: 'Medio', pro: 'Pro' };
const DURACIONES = ['mensual', 'semestral', 'anual'];
const DURACION_NOMBRE = { mensual: 'Mensual', semestral: 'Semestral', anual: 'Anual' };
const NIVEL_INCLUYE = {
  basico: 'Videos de todos los cursos y seguimiento de tu avance.',
  medio: 'Lo del Básico, más guías, ejercicios resueltos y simulacros con retroalimentación.',
  pro: 'Lo del Medio, más resolución de dudas y plan de estudio personalizado.',
};
const DIA_MS = 86400000;

const nivelRango = n => Math.max(0, NIVELES.indexOf(n));

// Estado del plan de un perfil: 'activo', 'vencido' o 'sin_plan', con los días que le quedan.
function estadoPlan(perfil, now = Date.now()) {
  const hasta = perfil && perfil.acceso_hasta ? new Date(perfil.acceso_hasta).getTime() : NaN;
  if (!perfil || !perfil.nivel || Number.isNaN(hasta)) return { estado: 'sin_plan', dias: 0 };
  if (hasta <= now) return { estado: 'vencido', dias: 0 };
  return { estado: 'activo', dias: Math.ceil((hasta - now) / DIA_MS) };
}

// Por qué no se puede abrir algo que pide `nivelMin`: null (sí se puede), 'sesion', 'sin_plan',
// 'vencido' o 'nivel' (el plan vigente es menor).
function motivoBloqueo(perfil, nivelMin, now = Date.now()) {
  if (nivelRango(nivelMin) === 0) return null;
  if (!perfil) return 'sesion';
  if (perfil.rol === 'admin') return null;
  const { estado } = estadoPlan(perfil, now);
  if (estado !== 'activo') return estado;
  return nivelRango(perfil.nivel) >= nivelRango(nivelMin) ? null : 'nivel';
}

// Nivel mínimo de cada cosa mientras nadie lo cambie en la tabla `lecciones`: la primera lección de
// cada curso y los clips de curiosidades son gratis; videos y jefes, Básico; resúmenes en PDF y
// evaluaciones (guías y simulacros), Medio; tutorías (resolución de dudas), Pro.
const NIVEL_TIPO = { leccion: 'basico', jefe: 'basico', evaluacion: 'medio', resumen: 'medio', clip: 'gratis', tutorias: 'pro' };

// Todo lo que la app puede abrir, como filas de la tabla `lecciones` (tools/sync-lecciones.js).
function catalogo(courses, curios = [], summaryOf = () => null) {
  const rows = [], seen = new Set();
  const add = r => { if (r.id && !seen.has(r.id)) { seen.add(r.id); rows.push(r); } };
  const videos = l => [l.clip, ...(l.more || [])].map(c => c && c.bunny).filter(Boolean);
  courses.forEach(c => {
    let n = 0;
    c.units.forEach((u, ui) => {
      // Con componentes (c.blocks) cada uno se abre por su cuenta: su primera lección también es gratis.
      const blockFirst = !!c.blocks && !!u.block && (ui === 0 || c.units[ui - 1].block !== u.block);
      u.lessons.forEach((l, li) => add({ id: l.id, tipo: 'leccion', curso: c.id, titulo: l.title, orden: n,
        nivel_minimo: n++ === 0 || (blockFirst && li === 0) ? 'gratis' : NIVEL_TIPO.leccion, videos: videos(l) }));
      if (u.boss) add({ id: u.boss.id, tipo: 'jefe', curso: c.id, titulo: u.boss.title, orden: n, nivel_minimo: NIVEL_TIPO.jefe, videos: videos(u.boss) });
      if (u.exam) add({ id: u.exam.id, tipo: 'evaluacion', curso: c.id, titulo: u.exam.title, orden: n, nivel_minimo: NIVEL_TIPO.evaluacion, videos: [] });
      if (summaryOf(u)) add({ id: `resumen-${u.world}`, tipo: 'resumen', curso: c.id, titulo: `Resumen: ${u.title}`, orden: n, nivel_minimo: NIVEL_TIPO.resumen, videos: [] });
    });
  });
  curios.forEach((q, i) => add({ id: q.id, tipo: 'clip', curso: 'clips', titulo: q.title, orden: i, nivel_minimo: NIVEL_TIPO.clip, videos: videos(q) }));
  add({ id: 'tutorias', tipo: 'tutorias', curso: '', titulo: 'Tutorías', orden: 0, nivel_minimo: NIVEL_TIPO.tutorias, videos: [] });
  return rows;
}

// Códigos: 10 letras o números, en mayúsculas, sin I, O, 0 ni 1. Se aceptan con espacios o guiones.
const limpiaCodigo = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const codigoValido = s => /^[A-HJ-NP-Z2-9]{10}$/.test(s);
const muestraCodigo = c => `${c.slice(0, 5)}-${c.slice(5)}`;

const CANJE_ERRORES = {
  formato: 'El código tiene 10 letras y números. Revísalo: no lleva la letra I, la O, el 0 ni el 1.',
  no_existe: 'Ese código no existe. Revisa que esté escrito igual que te lo enviaron.',
  ya_usado: 'Ese código ya fue canjeado. Cada código sirve una sola vez.',
  demasiados_intentos: 'Demasiados intentos fallidos. Espera 15 minutos y vuelve a intentarlo.',
  sin_sesion: 'Inicia sesión para canjear tu código.',
  reemplaza: 'Ese código es de otro nivel y reemplazaría tu plan vigente. Confírmalo para canjearlo.',
  sin_perfil: 'Tu cuenta aún no está lista. Cierra sesión, vuelve a entrar e inténtalo de nuevo.',
  red: 'No hay conexión. Revisa tu internet e inténtalo de nuevo.',
};
const canjeError = e => CANJE_ERRORES[e] || 'No se pudo canjear el código. Inténtalo de nuevo.';

// Mensajes de Supabase Auth en español.
function authError(err) {
  const m = String((err && (err.code || err.message)) || '').toLowerCase();
  if (/invalid login|invalid_credentials/.test(m)) return 'Correo o contraseña incorrectos.';
  if (/not confirmed|email_not_confirmed/.test(m)) return 'Confirma tu correo: te enviamos un enlace al registrarte.';
  if (/already registered|user_already_exists/.test(m)) return 'Ya hay una cuenta con ese correo. Inicia sesión.';
  if (/weak_password|at least|should be/.test(m)) return 'La contraseña es muy corta o débil: usa 8 caracteres o más.';
  if (/rate limit|too many|over_/.test(m)) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  if (/valid email|invalid.*email|email_address_invalid/.test(m)) return 'Ese correo no parece válido.';
  if (/fetch|network/.test(m)) return 'No hay conexión. Revisa tu internet e inténtalo de nuevo.';
  return 'No se pudo completar. Inténtalo de nuevo.';
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function fechaCorta(iso) {
  const d = new Date(iso);
  return iso && !Number.isNaN(d.getTime()) ? `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}` : '—';
}
const cop = n => `$ ${String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
const diasTexto = n => (n === 1 ? '1 día' : `${n} días`);

// Textos de la hoja que sale al tocar algo con candado.
function textoBloqueo(motivo, nivelMin) {
  const plan = `plan ${NIVEL_NOMBRE[nivelMin] || 'Básico'}`;
  return ({
    sesion: { title: 'Inicia sesión para abrirlo', text: `Este contenido es del ${plan}. Entra con tu cuenta o crea una; es gratis y guarda tu avance.` },
    sin_plan: { title: `Disponible con el ${plan}`, text: 'Activa tu plan con un código de acceso y se abre al instante.' },
    vencido: { title: 'Tu plan venció', text: `Renueva con un código nuevo para volver a abrir el contenido del ${plan}. Tu avance sigue guardado.` },
    nivel: { title: `Disponible con el ${plan}`, text: 'Tu plan actual no lo incluye. Puedes mejorarlo con un código del nivel que necesitas.' },
  })[motivo] || null;
}
