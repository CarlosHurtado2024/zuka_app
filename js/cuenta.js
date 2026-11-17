// Cuenta del estudiante: registro e inicio de sesión (Supabase Auth), «Mi plan», canje de códigos,
// progreso en la nube, candados por plan y enlaces de video. La lógica pura está en js/acceso.js.
// Sin conexión (o si no carga la librería de Supabase) la app sigue con lo guardado en el celular.

const Cuenta = {
  sb: null,        // cliente de Supabase (null sin conexión)
  user: null,      // usuario con sesión
  perfil: null,    // fila de `perfiles` (se guarda en S.cuenta para abrir sin conexión)
  planes: null,    // filas de `planes`
  niveles: {},     // id de lección o recurso → nivel_minimo
  cursos: null,    // id de curso → publicado (tabla `cursos`); null si aún no se sabe
  bases: new Map() // id de video → { base, hasta }
};

// En el computador de desarrollo no hay candados (para revisar contenido y correr los robots);
// con ?candados en la dirección sí se ven.
const SIN_CANDADOS = typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  && !/[?&]candados\b/.test(location.search);

const nivelDe = id => Cuenta.niveles[id] || 'basico';
// Motivo por el que algo está cerrado para quien usa la app ahora (null = abierto).
function planMotivo(id) {
  if (SIN_CANDADOS) return null;
  return motivoBloqueo(Cuenta.user ? Cuenta.perfil : null, nivelDe(id));
}

function cuentaCache() {
  // uid = cuenta cuyo avance está en este celular; solo cambia cuando la sincronización termina bien.
  S.cuenta = { uid: (S.cuenta || {}).uid || null, perfil: Cuenta.perfil, sesion: !!Cuenta.user };
  save();
}
// Repinta la pestaña abierta (no durante una lección ni sobre el feed de clips, que se reiniciaría).
function cuentaRepinta() {
  if (typeof go !== 'function' || lessonClose || $('#overlay.open')) return;
  if (tab !== 'clips') go(tab);
}

// Niveles por defecto (los de js/acceso.js) y la última copia de la tabla `lecciones`. Va al cargar
// el archivo, antes de que app.js pinte la primera pantalla.
if (typeof COURSES !== 'undefined') {
  catalogo(COURSES, typeof CURIOS === 'undefined' ? [] : CURIOS, typeof summaryOf === 'function' ? summaryOf : undefined)
    .forEach(r => { Cuenta.niveles[r.id] = r.nivel_minimo; });
  try { Object.assign(Cuenta.niveles, JSON.parse(localStorage.getItem('zuka-niveles')) || {}); } catch (e) { /* sin copia */ }
}

// ---------- quién ve todo abierto ----------
const cuentaEsAdmin = () => !!(Cuenta.user && Cuenta.perfil && Cuenta.perfil.rol === 'admin');
// El administrador tiene siempre todo abierto (S.unlockAll: cursos, mundos, lecciones, jefes y
// evaluaciones, sin perder vidas); no se puede apagar. A los demás las lecciones y los mundos se les
// abren uno tras otro, al completar el anterior. En el computador de desarrollo no se toca (allí el
// interruptor «Modo revisión» de Ajustes decide).
function cuentaRol() {
  if (SIN_CANDADOS) return;
  S.unlockAll = cuentaEsAdmin();
  save();
}

// ---------- pantalla de entrada ----------
// Sale al abrir la app sin sesión (y al cerrar sesión). Se puede seguir sin cuenta: queda lo gratis.
function cuentaPideEntrar() {
  if (!Cuenta.sb || Cuenta.user || S.guest) return false;
  authScreen('login');
  return true;
}
function authCerrar() {
  const el = $('#auth');
  if (!el) return;
  el.remove();
  if (typeof tourShouldStart === 'function' && tourShouldStart(S)) startTour();   // el recorrido de bienvenida esperaba
}
function authScreen(modo = 'login', aviso = '') {
  let el = $('#auth');
  if (!el) { el = document.createElement('div'); el.id = 'auth'; document.body.appendChild(el); }
  const reg = modo === 'registro';
  el.innerHTML = `<div class="auth-in">
    <div class="auth-brand">${logoHTML()}</div>
    <h1>${reg ? 'Crea tu cuenta' : 'Entra a tu cuenta'}</h1>
    <p class="muted">${reg ? 'Es gratis. Guarda tu avance y te deja activar tu plan con un código.' : 'Sigue donde ibas: tu avance y tu plan te esperan.'}</p>
    <div class="seg seg-2" role="tablist"><button type="button" role="tab" data-m="login" aria-selected="${!reg}" class="${reg ? '' : 'on'}">Iniciar sesión</button><button type="button" role="tab" data-m="registro" aria-selected="${reg}" class="${reg ? 'on' : ''}">Crear cuenta</button></div>
    <form class="acct-form" novalidate>
      ${reg ? campo('nombre', 'Nombre', 'text', 'autocomplete="name" maxlength="80" required') + campo('telefono', 'Celular (opcional)', 'tel', 'autocomplete="tel" inputmode="tel" maxlength="30"') : ''}
      ${campo('correo', 'Correo', 'email', 'autocomplete="email" inputmode="email" required')}
      ${campo('clave', reg ? 'Contraseña (8 caracteres o más)' : 'Contraseña', 'password', `autocomplete="${reg ? 'new' : 'current'}-password" minlength="8" required`)}
      <p class="form-msg${aviso ? ' ok' : ''}" role="alert"${aviso ? '' : ' hidden'}>${aviso}</p>
      <button class="btn main" type="submit">${reg ? 'Crear mi cuenta' : 'Entrar'}</button>
    </form>
    ${reg ? '' : '<button class="link-btn" type="button" data-olvide>Olvidé mi contraseña</button>'}
    <div class="auth-guest"><button class="btn ghost" type="button" data-guest>Explorar sin cuenta</button>
      <p class="muted">Sin cuenta se abren la primera lección de cada curso y los clips.</p></div>
  </div>`;
  const f = $('form', el), msg = $('.form-msg', el), b = $('button[type=submit]', el);
  el.querySelectorAll('[data-m]').forEach(x => x.onclick = () => { if (x.dataset.m !== modo) authScreen(x.dataset.m); });
  $('[data-olvide]', el)?.addEventListener('click', openOlvide);
  $('[data-guest]', el).onclick = () => { S.guest = true; save(); authCerrar(); };
  const error = t => { msg.textContent = t; msg.className = 'form-msg bad'; msg.hidden = false; };
  f.onsubmit = async e => {
    e.preventDefault();
    if (b.disabled) return;
    const d = Object.fromEntries(new FormData(f)), correo = d.correo.trim();
    if (reg && !d.nombre.trim()) return error('Escribe tu nombre.');
    if (!/^\S+@\S+\.\S+$/.test(correo)) return error('Ese correo no parece válido.');
    if (reg ? d.clave.length < 8 : !d.clave) return error(reg ? 'La contraseña debe tener 8 caracteres o más.' : 'Escribe tu contraseña.');
    msg.hidden = true; b.disabled = true; const txt = b.textContent; b.textContent = 'Un momento…';
    let r;
    try {
      r = reg
        ? await Cuenta.sb.auth.signUp({ email: correo, password: d.clave,
          options: { data: { nombre: d.nombre.trim(), telefono: d.telefono.trim() }, emailRedirectTo: location.origin + location.pathname } })
        : await Cuenta.sb.auth.signInWithPassword({ email: correo, password: d.clave });
    } catch (x) { r = { error: x }; }
    b.disabled = false; b.textContent = txt;
    if (r.error) return error(authError(r.error));
    if (reg && !S.name) { S.name = d.nombre.trim().slice(0, 24); save(); }
    // Con sesión, la pantalla la cierra cuentaSesion. Al registrarse puede faltar confirmar el correo.
    if (!r.data.session) authScreen('login', `Te enviamos un enlace a ${esc(correo)}. Ábrelo para confirmar tu cuenta y luego inicia sesión aquí.`);
  };
}

// ---------- cursos habilitados ----------
// El administrador decide en el panel (/admin → Cursos) qué cursos ven los estudiantes (tabla `cursos`).
// Él los ve todos, con la marca «Borrador» en los que aún no habilita. Sin datos del servidor valen los
// de CURSOS_LISTOS.
const CURSOS_LISTOS = ['algebra', 'trig'];
try { Cuenta.cursos = JSON.parse(localStorage.getItem('zuka-cursos')) || null; } catch (e) { /* sin copia */ }
const cursoBorrador = c => (Cuenta.cursos ? Cuenta.cursos[c.id] !== true : !CURSOS_LISTOS.includes(c.id));
const cursoVisible = c => SIN_CANDADOS || cuentaEsAdmin() || !cursoBorrador(c);
function cursosVisibles() {
  const v = COURSES.filter(cursoVisible);
  return v.length ? v : COURSES.slice(0, 1);
}

// ---------- uso diario ----------
// Tiempo con la app abierta y a la vista, lecciones completadas y ejercicios respondidos: se envían
// cada minuto (registrar_uso) y alimentan las estadísticas del panel. Solo con sesión.
const uso = { seg: 0, t: Date.now(), lec: 0, ans: null, ok: null };
function usoTick(visible = !document.hidden) {
  const now = Date.now(), dt = (now - uso.t) / 1000;
  uso.t = now;
  if (visible && dt > 0 && dt < 40 && Cuenta.user && !Cuenta.user.offline) uso.seg += dt;
  if (uso.seg >= 60) usoEnvia();
}
function usoEnvia() {
  if (!Cuenta.sb || !Cuenta.user || Cuenta.user.offline || typeof S === 'undefined') return;
  if (uso.ans == null) { uso.ans = S.answered; uso.ok = S.correct; }
  const seg = Math.round(uso.seg), ej = Math.max(0, S.answered - uso.ans), ac = Math.max(0, S.correct - uso.ok), lec = uso.lec;
  if (!seg && !ej && !lec) return;
  uso.seg = 0; uso.lec = 0; uso.ans = S.answered; uso.ok = S.correct;
  Cuenta.sb.rpc('registrar_uso', { p_segundos: seg, p_lecciones: lec, p_ejercicios: ej, p_aciertos: Math.min(ac, ej), p_xp: S.xp, p_racha: streakNow() })
    .then(() => {}, () => {});
}
if (typeof document !== 'undefined') {
  setInterval(usoTick, 15000);
  // Al esconder la app se cuenta lo que iba y se envía; al volver, el reloj arranca de nuevo.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { usoTick(true); usoEnvia(); } else uso.t = Date.now();
  });
}

function cuentaInit() {
  if (typeof S === 'undefined') return;
  // Lo último que se supo de la cuenta: sirve para abrir sin conexión.
  if (S.cuenta && S.cuenta.sesion && S.cuenta.perfil) {
    Cuenta.user = { id: S.cuenta.perfil.id, offline: true }; Cuenta.perfil = S.cuenta.perfil;
  }
  cuentaRol();
  if (!window.supabase || !window.supabase.createClient) return;
  Cuenta.sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
  // Dentro del aviso de Supabase no se le puede volver a llamar: se sale primero con setTimeout.
  Cuenta.sb.auth.onAuthStateChange((ev, session) => setTimeout(() => cuentaSesion(ev, session), 0));
  Cuenta.sb.from('lecciones').select('id,nivel_minimo').then(({ data }) => {
    if (!data) return;
    const m = {}; data.forEach(r => { m[r.id] = r.nivel_minimo; });
    Object.assign(Cuenta.niveles, m);
    try { localStorage.setItem('zuka-niveles', JSON.stringify(m)); } catch (e) { /* sin espacio */ }
    cuentaRepinta();
  });
  Cuenta.sb.from('cursos').select('id,publicado').then(({ data }) => {
    if (!data || !data.length) return;
    const m = {}; data.forEach(r => { m[r.id] = r.publicado; });
    const cambio = JSON.stringify(m) !== JSON.stringify(Cuenta.cursos);
    Cuenta.cursos = m;
    try { localStorage.setItem('zuka-cursos', JSON.stringify(m)); } catch (e) { /* sin espacio */ }
    if (cambio) cuentaRepinta();
  });
}

async function cuentaSesion(ev, session) {
  const antes = Cuenta.user && !Cuenta.user.offline ? Cuenta.user.id : null;
  if (!session) {
    if (ev === 'INITIAL_SESSION' && !navigator.onLine) return;   // sin red: vale lo guardado
    Cuenta.user = null; Cuenta.perfil = null; Cuenta.bases.clear(); cuentaCola.clear();
    cuentaCache(); cuentaRol(); cuentaRepinta();
    if (ev === 'SIGNED_OUT') authScreen('login');
    return;
  }
  const uidPrevio = (S.cuenta || {}).uid || null, perfilPrevio = JSON.stringify(Cuenta.perfil);
  Cuenta.user = session.user;
  if (ev === 'PASSWORD_RECOVERY') openNuevaClave();
  if (antes === session.user.id && ev === 'TOKEN_REFRESHED') return;
  await cuentaPerfil();
  cuentaRol();
  if (ev !== 'PASSWORD_RECOVERY' || !$('#sheet.open')) authCerrar(); else $('#auth')?.remove();
  // Supabase repite el aviso de sesión cada vez que se vuelve a la pestaña: solo se repinta si algo cambió.
  if (antes === session.user.id) { if (JSON.stringify(Cuenta.perfil) !== perfilPrevio) cuentaRepinta(); return; }
  Cuenta.bases.clear(); cuentaCola.clear();   // nada pendiente de otra cuenta sube a esta
  uso.seg = 0; uso.lec = 0; uso.ans = S.answered; uso.ok = S.correct; uso.t = Date.now();
  await cuentaSyncProgreso(uidPrevio);
  cuentaRepinta();
}

async function cuentaPerfil() {
  if (!Cuenta.sb || !Cuenta.user) return null;
  const { data } = await Cuenta.sb.from('perfiles').select('*').eq('id', Cuenta.user.id).maybeSingle();
  if (data) {
    Cuenta.perfil = data;
    if (data.nombre && !S.name) S.name = data.nombre.slice(0, 24);
    cuentaCache();
  }
  return data;
}

// Junta el avance del celular con el de la nube. Si en este celular estudiaba otra cuenta, su avance
// local no se le pasa a la nueva: se reemplaza por el de la nube.
async function cuentaSyncProgreso(uidPrevio) {
  if (!Cuenta.sb || !Cuenta.user) return;
  const { data, error } = await Cuenta.sb.from('progreso').select('leccion,completada,segundos_vistos').eq('usuario', Cuenta.user.id);
  if (error || !data) return;
  const otro = uidPrevio && uidPrevio !== Cuenta.user.id;
  if (otro) { S.done = {}; S.secs = {}; S.days = {}; }   // tampoco el calendario de actividad de la cuenta anterior
  S.secs = S.secs || {};
  const nube = new Map(data.map(r => [r.leccion, r]));
  data.forEach(r => {
    if (r.completada) S.done[r.leccion] = true;
    S.secs[r.leccion] = Math.max(S.secs[r.leccion] || 0, r.segundos_vistos || 0);
  });
  const faltan = [...new Set([...Object.keys(S.done).filter(id => S.done[id]), ...Object.keys(S.secs)])]
    .filter(id => { const r = nube.get(id); return !r || (!!S.done[id] && !r.completada) || (S.secs[id] || 0) > (r.segundos_vistos || 0); })
    .map(id => ({ leccion: id, completada: !!S.done[id], segundos: Math.round(S.secs[id] || 0) }));
  S.cuenta = Object.assign(S.cuenta || {}, { uid: Cuenta.user.id });   // desde aquí el avance del celular es de esta cuenta
  save();
  for (let i = 0; i < faltan.length; i += 400) await Cuenta.sb.rpc('guardar_progreso', { p_filas: faltan.slice(i, i + 400) });
}

// Guarda el avance de una lección (al completarla y mientras se ve su video). Lo que no alcanza a
// subir queda en S.done / S.secs y sube en el siguiente inicio de sesión.
const cuentaCola = new Map();
let cuentaTimer = null;
function cuentaProgreso(id, { completada = false, segundos = 0 } = {}) {
  S.secs = S.secs || {};
  if (segundos > (S.secs[id] || 0)) S.secs[id] = Math.round(segundos);
  const q = cuentaCola.get(id) || { leccion: id, completada: false, segundos: 0 };
  if (completada && !q.completada) uso.lec++;
  q.completada = q.completada || completada; q.segundos = Math.max(q.segundos, Math.round(S.secs[id] || 0));
  cuentaCola.set(id, q);
  clearTimeout(cuentaTimer);
  if (completada) cuentaEnvia(); else cuentaTimer = setTimeout(cuentaEnvia, 15000);
}
function cuentaEnvia() {
  clearTimeout(cuentaTimer);
  if (!cuentaCola.size) return;
  save();
  if (!Cuenta.sb || !Cuenta.user || Cuenta.user.offline) return;
  // Solo sube si lo que hay en el celular es de esta cuenta (ya se sincronizó con ella).
  if ((S.cuenta || {}).uid !== Cuenta.user.id) return;
  const filas = [...cuentaCola.values()], uid = Cuenta.user.id; cuentaCola.clear();
  Cuenta.sb.rpc('guardar_progreso', { p_filas: filas }).then(({ error }) => {
    if (error && Cuenta.user && Cuenta.user.id === uid) filas.forEach(f => { if (!cuentaCola.has(f.leccion)) cuentaCola.set(f.leccion, f); });
  }, () => {});
}
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (document.hidden) cuentaEnvia(); });

// Dirección de la carpeta de un video de Bunny (sin la barra final). La firma el servidor y solo si
// la cuenta puede verlo. Si el servidor no contesta se prueba la dirección sin firma, que sirve
// mientras Bunny no exija token.
// La dirección ya pedida y aún vigente, o null: deja adjuntar el video en el mismo toque que abre la lección.
function cuentaVideoBaseYa(id) {
  const hit = Cuenta.bases.get(id);
  return hit && hit.hasta > Date.now() ? hit.base : null;
}
function cuentaVideoBase(id, reintento = false) {
  const libre = `https://${bunnyHost(id)}/${id}`;
  // Biblioteca nueva (sin token): el servidor solo dice si la cuenta puede verlo; la dirección es la libre.
  const vieja = BUNNY_VIEJOS.has(id);
  const ya = cuentaVideoBaseYa(id);
  if (ya) return Promise.resolve(ya);
  if (!Cuenta.sb) return Promise.resolve(libre);
  return Cuenta.sb.functions.invoke('video-url', { body: { video: id } }).then(({ data, error }) => {
    if (data && data.ok && data.base) {
      const base = vieja ? data.base : libre;
      Cuenta.bases.set(id, { base, hasta: vieja && data.expira ? data.expira * 1000 - 600000 : Date.now() + 3600000 });
      return base;
    }
    const status = error && error.context && error.context.status;
    // 401: la sesión venció mientras la app estaba en segundo plano. Se renueva y se pide otra vez.
    if (status === 401 && !reintento) return Cuenta.sb.auth.refreshSession().then(() => cuentaVideoBase(id, true), () => cuentaVideoBase(id, true));
    if ((status === 403 || status === 401) && !SIN_CANDADOS) throw new Error('sin_acceso');
    return libre;
  }, () => libre);
}

// ---------- formularios (hojas inferiores) ----------
const campo = (name, label, type = 'text', extra = '') =>
  `<label class="fld"><span>${label}</span><input name="${name}" type="${type}" ${extra}></label>`;

// Hoja con un formulario: `enviar(datos)` devuelve un texto de error o nada si salió bien.
function hojaForm({ title, intro = '', campos, ok, pie = '', enviar }) {
  openSheet(`<form class="acct-form" novalidate><h3 class="sheet-title">${title}</h3>
    ${intro ? `<p class="muted">${intro}</p>` : ''}${campos}
    <p class="form-msg" role="alert" hidden></p>
    <button class="btn main" type="submit">${ok}</button>${pie}</form>`, sh => {
    const f = $('form', sh), msg = $('.form-msg', sh), b = $('button[type=submit]', sh);
    f.onsubmit = async e => {
      e.preventDefault();
      if (b.disabled) return;
      msg.hidden = true; b.disabled = true; const txt = b.textContent; b.textContent = 'Un momento…';
      let err = null;
      try { err = await enviar(Object.fromEntries(new FormData(f)), sh); } catch (x) { err = authError(x); }
      b.disabled = false; b.textContent = b.dataset.txt || txt;
      if (err) { msg.textContent = err; msg.hidden = false; msg.className = 'form-msg bad'; }
    };
    sh.querySelectorAll('[data-open]').forEach(x => x.onclick = () => ({ login: openLogin, registro: openRegistro, clave: openOlvide, canje: openCanje, planes: openPlanes })[x.dataset.open]());
    setTimeout(() => $('input', f)?.focus({ preventScroll: true }), 250);
  });
}
const sinRed = () => (!Cuenta.sb ? 'No hay conexión. Revisa tu internet e inténtalo de nuevo.' : null);

function openLogin() {
  hojaForm({
    title: 'Iniciar sesión',
    campos: campo('correo', 'Correo', 'email', 'autocomplete="email" inputmode="email" required')
      + campo('clave', 'Contraseña', 'password', 'autocomplete="current-password" required'),
    ok: 'Entrar',
    pie: '<p class="form-links"><button type="button" data-open="clave">Olvidé mi contraseña</button><button type="button" data-open="registro">Crear cuenta</button></p>',
    enviar: async d => {
      if (sinRed()) return sinRed();
      if (!d.correo.trim() || !d.clave) return 'Escribe tu correo y tu contraseña.';
      const { error } = await Cuenta.sb.auth.signInWithPassword({ email: d.correo.trim(), password: d.clave });
      if (error) return authError(error);
      closeSheet(); toast('¡Hola de nuevo!');
    },
  });
}

function openRegistro() {
  hojaForm({
    title: 'Crear cuenta',
    intro: 'Gratis. Guarda tu avance y te deja activar tu plan con un código.',
    campos: campo('nombre', 'Nombre', 'text', 'autocomplete="name" maxlength="80" required')
      + campo('telefono', 'Celular (opcional)', 'tel', 'autocomplete="tel" inputmode="tel" maxlength="30"')
      + campo('correo', 'Correo', 'email', 'autocomplete="email" inputmode="email" required')
      + campo('clave', 'Contraseña (8 caracteres o más)', 'password', 'autocomplete="new-password" minlength="8" required'),
    ok: 'Crear mi cuenta',
    pie: '<p class="form-links"><button type="button" data-open="login">Ya tengo cuenta</button></p>',
    enviar: async (d, sh) => {
      if (sinRed()) return sinRed();
      if (!d.nombre.trim()) return 'Escribe tu nombre.';
      if (!/^\S+@\S+\.\S+$/.test(d.correo.trim())) return 'Ese correo no parece válido.';
      if (d.clave.length < 8) return 'La contraseña debe tener 8 caracteres o más.';
      const { data, error } = await Cuenta.sb.auth.signUp({ email: d.correo.trim(), password: d.clave,
        options: { data: { nombre: d.nombre.trim(), telefono: d.telefono.trim() }, emailRedirectTo: location.origin + location.pathname } });
      if (error) return authError(error);
      if (!S.name) { S.name = d.nombre.trim().slice(0, 24); save(); }
      if (data.session) { closeSheet(); toast('¡Cuenta creada!'); return; }
      $('.sheet-card', sh).innerHTML = `<div class="grabber"></div><div class="acct-form"><h3 class="sheet-title">Revisa tu correo</h3>
        <p class="muted">Te enviamos un enlace a <b>${esc(d.correo.trim())}</b>. Ábrelo para confirmar tu cuenta y luego inicia sesión.</p>
        <button class="btn main" type="button" data-ok>Entendido</button></div>`;
      $('[data-ok]', sh).onclick = closeSheet;
    },
  });
}

function openOlvide() {
  hojaForm({
    title: 'Recuperar contraseña',
    intro: 'Te enviamos un enlace para poner una contraseña nueva.',
    campos: campo('correo', 'Correo', 'email', 'autocomplete="email" inputmode="email" required'),
    ok: 'Enviar enlace',
    pie: '<p class="form-links"><button type="button" data-open="login">Volver</button></p>',
    enviar: async d => {
      if (sinRed()) return sinRed();
      const { error } = await Cuenta.sb.auth.resetPasswordForEmail(d.correo.trim(), { redirectTo: location.origin + location.pathname });
      if (error) return authError(error);
      closeSheet(); toast('Enlace enviado. Revisa tu correo.');
    },
  });
}

function openNuevaClave() {
  hojaForm({
    title: 'Contraseña nueva',
    campos: campo('clave', 'Contraseña nueva (8 caracteres o más)', 'password', 'autocomplete="new-password" minlength="8" required'),
    ok: 'Guardar',
    enviar: async d => {
      if (d.clave.length < 8) return 'La contraseña debe tener 8 caracteres o más.';
      const { error } = await Cuenta.sb.auth.updateUser({ password: d.clave });
      if (error) return authError(error);
      closeSheet(); toast('Contraseña cambiada.');
    },
  });
}

function openDatos() {
  const p = Cuenta.perfil || {};
  hojaForm({
    title: 'Mis datos',
    campos: campo('nombre', 'Nombre', 'text', `autocomplete="name" maxlength="80" value="${esc(p.nombre || '')}" required`)
      + campo('telefono', 'Celular', 'tel', `autocomplete="tel" inputmode="tel" maxlength="30" value="${esc(p.telefono || '')}"`),
    ok: 'Guardar',
    enviar: async d => {
      if (sinRed()) return sinRed();
      if (!d.nombre.trim()) return 'Escribe tu nombre.';
      const { error } = await Cuenta.sb.from('perfiles').update({ nombre: d.nombre.trim(), telefono: d.telefono.trim() }).eq('id', Cuenta.user.id);
      if (error) return 'No se pudo guardar. Inténtalo de nuevo.';
      S.name = d.nombre.trim().slice(0, 24); save();
      await cuentaPerfil(); closeSheet(); toast('Datos guardados.'); cuentaRepinta();
    },
  });
}

function openCanje() {
  if (!Cuenta.user) return openLogin();
  let confirmado = null;   // código que el estudiante ya aceptó canjear aunque reemplace su plan
  hojaForm({
    title: 'Canjear código',
    intro: 'Escribe el código de 10 letras y números que recibiste al pagar. Sirve una sola vez.',
    campos: campo('codigo', 'Código de acceso', 'text', 'autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="14" placeholder="ABCDE-FGH23" required'),
    ok: 'Activar mi plan',
    enviar: async (d, sh) => {
      const c = limpiaCodigo(d.codigo);
      if (!codigoValido(c)) return canjeError('formato');
      if (sinRed()) return canjeError('red');
      const { data, error } = await Cuenta.sb.rpc('canjear_codigo', { p_codigo: c, p_confirmar: confirmado === c });
      if (error) return canjeError(/fetch|network/i.test(error.message || '') ? 'red' : '');
      // Código de otro nivel con plan vigente: el servidor aún no lo gasta; se pide confirmar.
      if (data && data.error === 'reemplaza') {
        confirmado = c;
        $('button[type=submit]', sh).dataset.txt = 'Sí, cambiar mi plan';
        return `Tu plan ${NIVEL_NOMBRE[data.nivel_actual]} sigue vigente (${diasTexto(estadoPlan({ nivel: data.nivel_actual, acceso_hasta: data.acceso_hasta }).dias)}). Este código es del plan ${NIVEL_NOMBRE[data.nivel]} por ${data.dias} días: si lo canjeas, reemplaza tu plan actual desde hoy y los días que te quedan se pierden. Toca «Sí, cambiar mi plan» para confirmar.`;
      }
      if (!data || !data.ok) return canjeError(data && data.error);
      await cuentaPerfil(); Cuenta.bases.clear();
      $('.sheet-card', sh).innerHTML = `<div class="grabber"></div><div class="acct-form canje-ok"><span class="canje-check">${ICON.check}</span>
        <h3 class="sheet-title">Plan ${NIVEL_NOMBRE[data.nivel]} activado</h3>
        <p class="muted">Tienes acceso hasta el <b>${fechaCorta(data.acceso_hasta)}</b> (${diasTexto(estadoPlan(Cuenta.perfil).dias)}).</p>
        <button class="btn main" type="button" data-ok>Empezar a estudiar</button></div>`;
      $('[data-ok]', sh).onclick = () => { closeSheet(); go('learn'); };
      cuentaRepinta();
    },
  });
}

// Planes y precios (tabla `planes`): no se compra aquí; se paga por Nequi y llega un código.
async function openPlanes() {
  openSheet(`<div class="acct-form"><h3 class="sheet-title">Planes</h3><div class="planes" aria-live="polite"><p class="muted">Cargando planes…</p></div></div>`);
  if (!Cuenta.planes && Cuenta.sb) {
    const { data } = await Cuenta.sb.from('planes').select('*');
    if (data && data.length) Cuenta.planes = data;
  }
  const box = $('#sheet .planes');
  if (!box) return;
  if (!Cuenta.planes) { box.innerHTML = '<p class="form-msg bad">No se pudieron cargar los planes. Revisa tu conexión.</p>'; return; }
  const precio = (n, d) => (Cuenta.planes.find(p => p.nivel === n && p.duracion === d) || {}).precio;
  const mio = estadoPlan(Cuenta.perfil).estado === 'activo' ? Cuenta.perfil.nivel : null;
  box.innerHTML = `${NIVELES.slice(1).map(n => `<section class="plan${mio === n ? ' mio' : ''}">
      <header><b>${NIVEL_NOMBRE[n]}</b>${mio === n ? '<span class="pill ok">Tu plan</span>' : ''}</header>
      <p class="muted">${NIVEL_INCLUYE[n]}</p>
      <dl>${DURACIONES.map(d => `<div><dt>${DURACION_NOMBRE[d]}</dt><dd>${precio(n, d) != null ? cop(precio(n, d)) : '—'}</dd></div>`).join('')}</dl>
    </section>`).join('')}
    <p class="muted plan-how">Pagas por Nequi, recibes un código de acceso y lo canjeas aquí. Precios en pesos colombianos.</p>
    <button class="btn main" type="button" data-canje>Ya tengo un código</button>`;
  $('[data-canje]', box).onclick = openCanje;
}

// Hoja que sale al tocar algo con candado: dice por qué y qué hacer.
function openBloqueo(id) {
  const motivo = planMotivo(id), t = textoBloqueo(motivo, nivelDe(id));
  if (!t) return;
  openSheet(`<div class="acct-form lock-sheet"><span class="lock-ico">${ICON.lock}</span>
    <h3 class="sheet-title">${t.title}</h3><p class="muted">${t.text}</p>
    ${motivo === 'sesion'
      ? '<button class="btn main" type="button" data-a="login">Iniciar sesión</button><button class="btn ghost" type="button" data-a="registro">Crear cuenta gratis</button>'
      : '<button class="btn main" type="button" data-a="canje">Canjear código</button>'}
    <button class="btn ghost" type="button" data-a="planes">Ver planes y precios</button></div>`,
  sh => sh.querySelectorAll('[data-a]').forEach(b => b.onclick = () => ({ login: openLogin, registro: openRegistro, canje: openCanje, planes: openPlanes })[b.dataset.a]()));
}

// ---------- tarjeta «Mi plan» del perfil ----------
function cuentaCard() {
  if (!Cuenta.user) {
    return `<section class="card acct-card"><h3>Tu cuenta</h3>
      <p class="muted">Crea tu cuenta para guardar tu avance en la nube y activar tu plan con un código.</p>
      <div class="acct-actions"><button class="btn brand" data-acct="login">Iniciar sesión</button><button class="btn ghost" data-acct="registro">Crear cuenta</button></div>
      <button class="link-btn" data-acct="planes">Ver planes y precios</button></section>`;
  }
  const p = Cuenta.perfil || {}, e = estadoPlan(p);
  const pill = { activo: ['ok', 'Activo'], vencido: ['bad', 'Vencido'], sin_plan: ['', 'Sin plan'] }[e.estado];
  const admin = p.rol === 'admin';
  return `<section class="card acct-card"><div class="acct-head"><h3>Mi plan</h3><span class="pill ${pill[0]}">${pill[1]}</span></div>
    ${e.estado === 'sin_plan'
      ? `<p class="muted">${admin ? 'Cuenta administradora: todo el contenido abierto.' : 'Aún no tienes un plan. Con un código de acceso se activa al instante.'}</p>`
      : `<dl class="plan-facts">
        <div><dt>Nivel</dt><dd>${NIVEL_NOMBRE[p.nivel] || '—'}${p.duracion ? ` · ${DURACION_NOMBRE[p.duracion]}` : ''}</dd></div>
        <div><dt>Inicio</dt><dd>${fechaCorta(p.acceso_desde)}</dd></div>
        <div><dt>Vence</dt><dd>${fechaCorta(p.acceso_hasta)}</dd></div>
        <div><dt>Te quedan</dt><dd class="${e.estado === 'activo' && e.dias <= 7 ? 'warn' : ''}">${e.estado === 'activo' ? diasTexto(e.dias) : '0 días'}</dd></div></dl>
        ${e.estado === 'vencido' ? '<p class="muted">Tu plan venció. Renueva con un código nuevo; tu avance sigue guardado.</p>' : e.dias <= 7 ? '<p class="muted">Tu plan está por vencer. Si canjeas un código del mismo nivel, los días se suman.</p>' : ''}`}
    <div class="acct-actions"><button class="btn brand" data-acct="canje">${e.estado === 'sin_plan' ? 'Canjear código' : e.estado === 'vencido' ? 'Renovar con código' : 'Canjear otro código'}</button><button class="btn ghost" data-acct="planes">Ver planes</button></div>
    ${admin ? '<a class="btn ghost" href="admin/">Panel de administración</a>' : ''}
    <div class="acct-foot"><button class="link-btn" data-acct="datos">Mis datos</button><button class="link-btn" data-acct="salir">Cerrar sesión</button></div></section>`;
}

function cuentaBind(root) {
  const acts = { login: openLogin, registro: openRegistro, planes: openPlanes, canje: openCanje, datos: openDatos,
    salir: async () => {
      cuentaEnvia(); usoEnvia();
      if (Cuenta.sb) await Cuenta.sb.auth.signOut().catch(() => {});
      Cuenta.user = null; Cuenta.perfil = null; cuentaCache(); cuentaRol(); toast('Sesión cerrada.'); cuentaRepinta();
      authScreen('login');
    } };
  root.querySelectorAll('[data-acct]').forEach(b => b.onclick = () => acts[b.dataset.acct]());
}

