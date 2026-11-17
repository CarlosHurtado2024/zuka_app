// Panel de administración de Zuka (/admin). Todo lo que muestra o cambia pasa por funciones de la
// base que comprueban es_admin(): esta página no guarda nada y sin rol admin no recibe datos.
// Vistas por ancla: #resumen, #usuarios, #usuario/<id>, #codigos, #planes.

const sb = window.supabase ? window.supabase.createClient(SUPA_URL, SUPA_KEY) : null;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const view = $('#pn-view');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const CURSOS = { algebra: 'Álgebra', trig: 'Trigonometría', calc: 'Cálculo Diferencial', geo: 'Geometría', fis: 'Física Mecánica', int: 'Cálculo Integral', lin: 'Álgebra Lineal' };
const ESTADO = { activo: ['ok', 'Activo'], vencido: ['bad', 'Vencido'], sin_plan: ['', 'Sin plan'] };
const pill = est => `<span class="pill ${ESTADO[est][0]}">${ESTADO[est][1]}</span>`;
const opts = (list, names, sel) => list.map(v => `<option value="${v}"${v === sel ? ' selected' : ''}>${names[v]}</option>`).join('');
const NIV = NIVELES.slice(1);

let toastT = null;
function toast(msg) {
  const t = $('#pn-toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600);
}
async function copiar(texto) {
  try { await navigator.clipboard.writeText(texto); } catch (e) {
    const ta = document.createElement('textarea'); ta.value = texto; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  }
  toast('Copiado');
}

// Estados de cada vista: cargando, error (con reintento) y vacío.
const cargando = (txt = 'Cargando…') => { view.innerHTML = `<p class="pn-state">${txt}</p>`; };
function fallo(err, reintentar) {
  const sinPermiso = err && (err.code === '42501' || /administrador/i.test(err.message || ''));
  view.innerHTML = `<p class="pn-state bad">${sinPermiso ? 'Esta cuenta no tiene permiso de administración.' : 'No se pudo cargar. Revisa tu conexión.'}
    <button class="btn ghost" type="button">Reintentar</button></p>`;
  $('button', view).onclick = reintentar;
}
// Llama a una función de la base; lanza el error para que la vista lo muestre.
async function rpc(fn, args) {
  const { data, error } = await sb.rpc(fn, args);
  if (error) throw error;
  return data;
}
// Botón de un formulario mientras trabaja.
async function ocupado(btn, fn) {
  const txt = btn.textContent; btn.disabled = true; btn.textContent = 'Un momento…';
  try { await fn(); } catch (e) { toast(e.message || 'No se pudo completar'); }
  btn.disabled = false; btn.textContent = txt;
}

// ---------- entrada ----------
async function entrar() {
  if (!sb) { view.innerHTML = '<p class="pn-state bad">No se pudo cargar el panel. Revisa tu conexión y recarga.</p>'; return; }
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return login();
  let admin = false;
  try { admin = await rpc('es_admin'); } catch (e) { return fallo(e, entrar); }
  $('.pn-user').hidden = false; $('.pn-mail').textContent = session.user.email;
  if (!admin) {
    view.innerHTML = '<p class="pn-state bad">Esta cuenta no tiene permiso de administración.<br>Cierra sesión y entra con la cuenta administradora.</p>';
    return;
  }
  $('.pn-nav').hidden = false;
  addEventListener('hashchange', ruta);
  ruta();
}

function login() {
  $('.pn-nav').hidden = true; $('.pn-user').hidden = true;
  view.innerHTML = `<form class="pn-card pn-login acct-form" novalidate><h1>Entrar al panel</h1>
    <label class="fld"><span>Correo</span><input name="correo" type="email" autocomplete="email" required></label>
    <label class="fld"><span>Contraseña</span><input name="clave" type="password" autocomplete="current-password" required></label>
    <p class="form-msg bad" role="alert" hidden></p>
    <button class="btn main" type="submit">Entrar</button></form>`;
  const f = $('form', view), msg = $('.form-msg', view);
  f.onsubmit = e => {
    e.preventDefault();
    ocupado($('button', f), async () => {
      msg.hidden = true;
      const d = Object.fromEntries(new FormData(f));
      const { error } = await sb.auth.signInWithPassword({ email: d.correo.trim(), password: d.clave });
      if (error) { msg.textContent = authError(error); msg.hidden = false; return; }
      entrar();
    });
  };
}
$('[data-salir]').onclick = async () => { await sb.auth.signOut(); removeEventListener('hashchange', ruta); login(); };

function ruta() {
  const [name, arg] = (location.hash.slice(1) || 'resumen').split('/');
  $$('.pn-nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${name === 'usuario' ? 'usuarios' : name}`));
  ({ resumen: vResumen, usuarios: vUsuarios, usuario: () => vUsuario(arg), codigos: vCodigos, cursos: vCursos, planes: vPlanes }[name] || vResumen)();
  scrollTo(0, 0);
}

// ---------- 1. resumen ----------
// Fechas de día ('2026-11-17', hora de Colombia) y tiempos.
const diaCorto = d => `${Number(d.slice(8))} ${MESES[Number(d.slice(5, 7)) - 1]}`;
const diaMenos = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) - n * DIA_MS).toISOString().slice(0, 10);
const mins = seg => Math.round((seg || 0) / 60);
const tiempo = seg => (seg >= 3600 ? `${Math.floor(seg / 3600)} h ${Math.round((seg % 3600) / 60)} min` : `${mins(seg)} min`);
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '—');
function hace(iso) {
  if (!iso) return 'Nunca';
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / DIA_MS);
  return d <= 0 ? 'Hoy' : d === 1 ? 'Ayer' : `Hace ${d} días`;
}
const tile = (n, label, cls = '') => `<div class="pn-tile ${cls}"><b>${n}</b><span>${label}</span></div>`;
// Barras por día: serie = [{ dia, v, nota }]. Cada barra lleva su valor escrito para quien no ve el dibujo.
function barras(serie, unidad) {
  const max = Math.max(1, ...serie.map(x => x.v));
  return `<div class="pn-bars">${serie.map(x => `<div class="pn-bar" title="${diaCorto(x.dia)}: ${x.v} ${unidad}${x.nota ? ` · ${x.nota}` : ''}">
    <b>${x.v || ''}</b><i style="height:${Math.round((100 * x.v) / max)}%"></i><small>${Number(x.dia.slice(8))}</small>
    <span class="pn-sr">${diaCorto(x.dia)}: ${x.v} ${unidad}${x.nota ? `, ${x.nota}` : ''}</span></div>`).join('')}</div>`;
}
async function cargaLecciones() {
  if (lecciones) return lecciones;
  const r = await sb.from('lecciones').select('id,tipo,curso,titulo');
  if (r.error) throw r.error;
  return (lecciones = r.data);
}

async function vResumen() {
  cargando();
  let r; try { r = await rpc('admin_resumen'); } catch (e) { return fallo(e, vResumen); }
  view.innerHTML = `<h1>Resumen</h1>
    <section class="pn-card"><h2>Estudiantes</h2>
      <div class="pn-tiles">${tile(r.usuarios, 'Registrados')}${tile(r.nuevos_7, 'Nuevos en 7 días')}${tile(r.activos, 'Con plan activo', 'ok')}
        ${tile(r.vencidos, 'Plan vencido', 'bad')}${tile(r.sin_plan, 'Sin plan')}</div></section>
    <section class="pn-card"><h2>Uso de la app</h2>
      <div class="pn-tiles">${tile(r.usan_hoy, 'Entraron hoy')}${tile(r.usan_7, 'Entraron en 7 días')}${tile(r.usan_30, 'Entraron en 30 días')}
        ${tile(`${r.minutos_dia_estudiante} min`, 'Por estudiante al día')}${tile(`${r.minutos_7} min`, 'Estudiados en 7 días')}
        ${tile(r.lecciones_7, 'Lecciones completadas en 7 días')}${tile(pct(r.aciertos_7, r.ejercicios_7), 'Aciertos en 7 días')}</div>
      <h3>Minutos de estudio por día (últimos 14 días)</h3>
      ${r.serie.some(x => x.minutos) ? barras(r.serie.map(x => ({ dia: x.dia, v: x.minutos, nota: `${x.usuarios} ${x.usuarios === 1 ? 'estudiante' : 'estudiantes'}` })), 'min')
      : '<p class="pn-state">Aún no hay tiempo de estudio registrado.</p>'}</section>
    <section class="pn-card"><h2>Ventas y códigos</h2>
      <div class="pn-tiles">${tile(r.canjes_30, 'Códigos canjeados en 30 días')}${tile(cop(r.ventas_30), 'Valor de esos planes')}
        ${tile(r.codigos_disponibles, 'Códigos disponibles')}${tile(r.codigos_usados, 'Códigos usados en total')}</div>
      <h3>Planes activos por nivel</h3>
      <div class="pn-tiles">${NIV.map(n => tile(r.por_nivel[n] || 0, NIVEL_NOMBRE[n])).join('')}</div></section>
    <section class="pn-card"><h2>Cursos</h2>
      <table class="pn-table"><thead><tr><th>Curso</th><th>Estado</th><th class="pn-num">Estudiantes</th><th class="pn-num">Lecciones completadas</th></tr></thead><tbody>
        ${r.por_curso.map(c => `<tr><td class="pn-main">${esc(c.nombre)}</td><td data-l="Estado">${c.publicado ? '<span class="pill ok">Habilitado</span>' : '<span class="pill">Borrador</span>'}</td>
          <td class="pn-num" data-l="Estudiantes">${c.estudiantes}</td><td class="pn-num" data-l="Lecciones completadas">${c.completadas}</td></tr>`).join('')}</tbody></table></section>
    <section class="pn-card"><h2>Lecciones más completadas</h2>
      ${r.top_lecciones.length ? `<table class="pn-table"><thead><tr><th>Lección</th><th class="pn-num">Estudiantes</th></tr></thead><tbody>
        ${r.top_lecciones.map(l => `<tr><td class="pn-main">${esc(l.titulo)}</td><td class="pn-num" data-l="Estudiantes">${l.n}</td></tr>`).join('')}</tbody></table>`
      : '<p class="pn-state">Ningún estudiante ha completado lecciones todavía.</p>'}</section>
    <section class="pn-card"><h2>Vencen en los próximos 7 días</h2>
      ${r.vencen_7.length ? `<table class="pn-table"><thead><tr><th>Usuario</th><th>Nivel</th><th>Vence</th><th class="pn-num">Quedan</th></tr></thead><tbody>
        ${r.vencen_7.map(u => `<tr data-id="${u.id}"><td class="pn-main">${esc(u.nombre || 'Sin nombre')}<span class="pn-sub">${esc(u.correo)}</span></td>
          <td data-l="Nivel">${NIVEL_NOMBRE[u.nivel]}</td><td data-l="Vence">${fechaCorta(u.acceso_hasta)}</td>
          <td class="pn-num" data-l="Quedan">${diasTexto(estadoPlan(u).dias)}</td></tr>`).join('')}</tbody></table>`
      : '<p class="pn-state">Ningún plan vence esta semana.</p>'}</section>
    <p class="pn-count">Las cifras cuentan solo estudiantes, no cuentas administradoras. El tiempo es con la app abierta y a la vista.</p>`;
  filasUsuario();
}
const filasUsuario = () => $$('tr[data-id]', view).forEach(tr => { tr.onclick = () => { location.hash = `usuario/${tr.dataset.id}`; }; });

// ---------- 2. usuarios ----------
const filtro = { q: '', estado: '', nivel: '', orden: 'asc' };
async function vUsuarios() {
  cargando();
  let us; try { us = await rpc('admin_usuarios'); } catch (e) { return fallo(e, vUsuarios); }
  us.forEach(u => { u.e = estadoPlan(u); });
  view.innerHTML = `<div class="pn-head"><h1>Usuarios</h1><span class="pn-count"></span></div>
    <div class="pn-filters">
      <label class="fld"><span>Buscar</span><input type="search" name="q" placeholder="Nombre, correo o teléfono" value="${esc(filtro.q)}"></label>
      <label class="fld"><span>Estado</span><select name="estado"><option value="">Todos</option>${opts(['activo', 'vencido', 'sin_plan'], { activo: 'Activo', vencido: 'Vencido', sin_plan: 'Sin plan' }, filtro.estado)}</select></label>
      <label class="fld"><span>Nivel</span><select name="nivel"><option value="">Todos</option>${opts(NIV, NIVEL_NOMBRE, filtro.nivel)}</select></label>
      <label class="fld"><span>Vencimiento</span><select name="orden">${opts(['asc', 'desc'], { asc: 'Vence antes primero', desc: 'Vence después primero' }, filtro.orden)}</select></label>
    </div><div class="pn-list"></div>`;
  const pinta = () => {
    const q = filtro.q.trim().toLowerCase();
    const t = u => (u.acceso_hasta ? new Date(u.acceso_hasta).getTime() : null);
    const rows = us.filter(u => (!q || `${u.nombre} ${u.correo} ${u.telefono}`.toLowerCase().includes(q))
      && (!filtro.estado || u.e.estado === filtro.estado) && (!filtro.nivel || u.nivel === filtro.nivel))
      .sort((a, b) => (t(a) == null) - (t(b) == null) || (filtro.orden === 'asc' ? t(a) - t(b) : t(b) - t(a)));   // sin fecha, al final
    $('.pn-count', view).textContent = `${rows.length} de ${us.length}`;
    $('.pn-list', view).innerHTML = !us.length ? '<p class="pn-state">Aún no hay usuarios registrados.</p>'
      : !rows.length ? '<p class="pn-state">Ningún usuario coincide con el filtro.</p>'
      : `<table class="pn-table"><thead><tr><th>Usuario</th><th>Teléfono</th><th>Estado</th><th>Nivel</th><th>Duración</th><th>Inicio</th><th>Fin</th><th class="pn-num">Quedan</th><th>Último ingreso</th><th class="pn-num">Min en 7 días</th></tr></thead><tbody>
        ${rows.map(u => `<tr data-id="${u.id}"><td class="pn-main">${esc(u.nombre || 'Sin nombre')}${u.rol === 'admin' ? ' <span class="pill warn">Admin</span>' : ''}<span class="pn-sub">${esc(u.correo)}</span></td>
          <td data-l="Teléfono">${esc(u.telefono || '—')}</td><td data-l="Estado">${pill(u.e.estado)}</td>
          <td data-l="Nivel">${NIVEL_NOMBRE[u.nivel] || '—'}</td><td data-l="Duración">${DURACION_NOMBRE[u.duracion] || '—'}</td>
          <td data-l="Inicio">${fechaCorta(u.acceso_desde)}</td><td data-l="Fin">${fechaCorta(u.acceso_hasta)}</td>
          <td class="pn-num" data-l="Quedan">${u.e.estado === 'activo' ? diasTexto(u.e.dias) : '—'}</td>
          <td data-l="Último ingreso">${hace(u.ultima_vez)}</td><td class="pn-num" data-l="Min en 7 días">${u.minutos_7}</td></tr>`).join('')}</tbody></table>`;
    filasUsuario();
  };
  // Si algo falla al pintar la lista, se dice en pantalla (y no queda un hueco en blanco).
  const seguro = () => {
    try { pinta(); } catch (e) {
      $('.pn-list', view).innerHTML = `<p class="pn-state bad">No se pudo mostrar la lista: ${esc(e && e.message)}</p>`;
    }
  };
  $$('.pn-filters [name]', view).forEach(el => { el.oninput = el.onchange = () => { filtro[el.name] = el.value; seguro(); }; });
  seguro();
}

// ---------- 3. detalle de usuario ----------
let lecciones = null;   // catálogo (tabla `lecciones`): para el avance por curso
async function vUsuario(id) {
  cargando();
  let d;
  try {
    d = await rpc('admin_usuario', { p_id: id });
    await cargaLecciones();
  } catch (e) { return fallo(e, () => vUsuario(id)); }
  if (!d) { view.innerHTML = '<a class="pn-back" href="#usuarios">← Usuarios</a><p class="pn-state">No existe ese usuario.</p>'; return; }
  const p = d.perfil, e = estadoPlan(p);
  const hechas = new Set(d.progreso.filter(g => g.completada).map(g => g.leccion));
  const segundos = d.progreso.reduce((t, g) => t + (g.segundos_vistos || 0), 0);
  const cursos = Object.keys(CURSOS).map(c => {
    const ls = lecciones.filter(l => l.curso === c && l.tipo === 'leccion');
    return { c, total: ls.length, n: ls.filter(l => hechas.has(l.id)).length };
  }).filter(x => x.total);
  // Cursos que estudia: los que tienen al menos una lección con avance (vista o completada).
  const tocadas = new Map(d.progreso.map(g => [g.leccion, g.actualizado_en]));
  const estudia = cursos.map(x => {
    const fechas = lecciones.filter(l => l.curso === x.c && l.tipo === 'leccion' && tocadas.has(l.id)).map(l => tocadas.get(l.id)).sort();
    return { ...x, ultima: fechas[fechas.length - 1] };
  }).filter(x => x.ultima);
  // Uso: por día (últimos 30) y acumulado.
  const porDia = new Map(d.uso.map(x => [x.dia, x])), T = d.uso_total;
  const serie = Array.from({ length: 14 }, (_, k) => { const dia = diaMenos(d.hoy, 13 - k), x = porDia.get(dia); return { dia, v: mins(x && x.segundos), nota: x ? `${x.lecciones} lecciones, ${x.ejercicios} ejercicios` : '' }; });
  const seg7 = Array.from({ length: 7 }, (_, k) => (porDia.get(diaMenos(d.hoy, k)) || {}).segundos || 0).reduce((a, b) => a + b, 0);
  const dias7 = Array.from({ length: 7 }, (_, k) => porDia.has(diaMenos(d.hoy, k))).filter(Boolean).length;
  view.innerHTML = `<a class="pn-back" href="#usuarios">← Usuarios</a>
    <div class="pn-head"><h1>${esc(p.nombre || 'Sin nombre')}</h1>${pill(e.estado)}</div>
    <section class="pn-card"><dl class="pn-facts">
      <div><dt>Correo</dt><dd>${esc(p.correo)}</dd></div><div><dt>Teléfono</dt><dd>${esc(p.telefono || '—')}</dd></div>
      <div><dt>Nivel</dt><dd>${NIVEL_NOMBRE[p.nivel] || '—'}</dd></div><div><dt>Duración</dt><dd>${DURACION_NOMBRE[p.duracion] || '—'}</dd></div>
      <div><dt>Inicio</dt><dd>${fechaCorta(p.acceso_desde)}</dd></div><div><dt>Fin</dt><dd>${fechaCorta(p.acceso_hasta)}</dd></div>
      <div><dt>Días restantes</dt><dd>${e.estado === 'activo' ? e.dias : 0}</dd></div><div><dt>Registro</dt><dd>${fechaCorta(p.creado_en)}</dd></div></dl></section>
    <section class="pn-card"><h2>Acceso manual</h2><div class="pn-actions">
      <form data-a="extender"><label class="fld"><span>Extender (días)</span><input name="dias" type="number" min="1" max="3650" value="30" required></label>
        <button class="btn main" type="submit"${p.nivel ? '' : ' disabled title="Primero asígnale un plan"'}>Extender</button></form>
      <form data-a="cambiar"><label class="fld"><span>Nivel</span><select name="nivel">${opts(NIV, NIVEL_NOMBRE, p.nivel || 'basico')}</select></label>
        <label class="fld"><span>Duración</span><select name="duracion">${opts(DURACIONES, DURACION_NOMBRE, p.duracion || 'mensual')}</select></label>
        <button class="btn main" type="submit">${p.nivel ? 'Cambiar plan (desde hoy)' : 'Asignar plan'}</button></form>
      <form data-a="revocar"><button class="btn ghost danger" type="submit"${p.nivel ? '' : ' disabled'}>Revocar acceso</button></form>
    </div></section>
    <section class="pn-card"><h2>Uso de la app</h2>
      <div class="pn-tiles">${tile(hace(p.ultima_vez), 'Último ingreso')}${tile(`${mins((porDia.get(d.hoy) || {}).segundos)} min`, 'Hoy')}
        ${tile(`${Math.round(seg7 / 420)} min`, 'Al día (últimos 7 días)')}${tile(`${dias7} de 7`, 'Días que entró esta semana')}
        ${tile(`${d.uso.length} de 30`, 'Días que entró este mes')}${tile(tiempo(T.segundos), 'Tiempo total')}
        ${tile(hechas.size, 'Lecciones completadas')}${tile(T.ejercicios, 'Ejercicios respondidos')}${tile(pct(T.aciertos, T.ejercicios), 'Aciertos')}
        ${tile(`${Math.round(segundos / 60)} min`, 'De video visto')}${tile(p.xp, 'XP')}${tile(diasTexto(p.racha), 'Racha')}</div>
      <h3>Minutos por día (últimos 14 días)</h3>
      ${T.dias ? barras(serie, 'min') : '<p class="pn-state">Aún no tiene tiempo de uso registrado.</p>'}</section>
    <section class="pn-card"><h2>Cursos que estudia</h2>
      ${estudia.length ? `<div class="pn-prog">${estudia.map(x => `<div><span>${CURSOS[x.c]}<small> · última vez ${fechaCorta(x.ultima)}</small></span><span>${x.n}/${x.total} · ${pct(x.n, x.total)}</span>
        <span class="mini-bar"><i style="width:${(100 * x.n) / x.total}%"></i></span></div>`).join('')}</div>`
      : '<p class="pn-state">Aún no ha empezado ningún curso.</p>'}</section>
    <section class="pn-card"><h2>Códigos canjeados</h2>
      ${d.codigos.length ? `<table class="pn-table"><thead><tr><th>Código</th><th>Plan</th><th>Días</th><th>Canjeado</th><th>Nota</th></tr></thead><tbody>
        ${d.codigos.map(c => `<tr><td class="pn-main pn-code">${muestraCodigo(c.codigo)}</td><td data-l="Plan">${NIVEL_NOMBRE[c.nivel]} · ${DURACION_NOMBRE[c.duracion]}</td>
          <td data-l="Días">${c.dias}</td><td data-l="Canjeado">${fechaCorta(c.usado_en)}</td><td data-l="Nota">${esc(c.nota || '—')}</td></tr>`).join('')}</tbody></table>`
      : '<p class="pn-state">No ha canjeado códigos.</p>'}</section>`;
  $$('.pn-actions form', view).forEach(f => {
    f.onsubmit = ev => {
      ev.preventDefault();
      const a = f.dataset.a, b = $('button', f), v = Object.fromEntries(new FormData(f));
      if (a === 'revocar' && !b.dataset.seguro) {   // dos toques: el primero pide confirmar
        b.dataset.seguro = '1'; b.textContent = '¿Seguro? Toca otra vez para revocar';
        setTimeout(() => { if (b.isConnected) { delete b.dataset.seguro; b.textContent = 'Revocar acceso'; } }, 4000);
        return;
      }
      ocupado(b, async () => {
        await rpc('admin_acceso', { p_id: id, p_accion: a, p_nivel: v.nivel || null, p_duracion: v.duracion || null, p_dias: v.dias ? Number(v.dias) : null });
        toast({ extender: 'Acceso extendido', cambiar: 'Plan actualizado', revocar: 'Acceso revocado' }[a]);
        vUsuario(id);
      });
    };
  });
}

// ---------- 4. códigos ----------
let filtroCod = '', nuevos = [];
async function vCodigos() {
  cargando();
  let cs; try { cs = await rpc('admin_codigos'); } catch (e) { return fallo(e, vCodigos); }
  view.innerHTML = `<h1>Códigos</h1>
    <section class="pn-card"><h2>Generar códigos</h2>
      <form class="pn-form" data-gen><label class="fld"><span>Cantidad</span><input name="cantidad" type="number" min="1" max="200" value="1" required></label>
        <label class="fld"><span>Nivel</span><select name="nivel">${opts(NIV, NIVEL_NOMBRE, 'basico')}</select></label>
        <label class="fld"><span>Duración</span><select name="duracion">${opts(DURACIONES, DURACION_NOMBRE, 'mensual')}</select></label>
        <label class="fld"><span>Nota (a quién se vendió)</span><input name="nota" maxlength="200" placeholder="Opcional"></label>
        <button class="btn main" type="submit">Generar</button></form>
      ${nuevos.length ? `<div class="pn-new"><b>${nuevos.length === 1 ? 'Código nuevo' : `${nuevos.length} códigos nuevos`}: ${NIVEL_NOMBRE[nuevos[0].nivel]} · ${DURACION_NOMBRE[nuevos[0].duracion]}</b>
        <ul>${nuevos.map(c => `<li class="pn-code">${muestraCodigo(c.codigo)}</li>`).join('')}</ul>
        <button class="btn small ghost" type="button" data-copy-all>Copiar ${nuevos.length === 1 ? 'el código' : 'todos'}</button></div>` : ''}</section>
    <section class="pn-card flat"><div class="pn-head"><h2>Lista</h2>
      <label class="fld"><select name="estado" aria-label="Filtrar por estado"><option value="">Todos</option>${opts(['libre', 'usado'], { libre: 'Disponibles', usado: 'Usados' }, filtroCod)}</select></label></div>
      <div class="pn-list"></div></section>`;
  const pinta = () => {
    const rows = cs.filter(c => !filtroCod || (filtroCod === 'usado') === !!c.usado_por);
    $('.pn-list', view).innerHTML = !cs.length ? '<p class="pn-state">Aún no hay códigos. Genera el primero arriba.</p>'
      : !rows.length ? '<p class="pn-state">Ningún código con ese estado.</p>'
      : `<table class="pn-table"><thead><tr><th>Código</th><th>Plan</th><th>Estado</th><th>Usado por</th><th>Nota</th><th>Creado</th><th></th></tr></thead><tbody>
        ${rows.map(c => `<tr><td class="pn-main pn-code">${muestraCodigo(c.codigo)}</td>
          <td data-l="Plan">${NIVEL_NOMBRE[c.nivel]} · ${DURACION_NOMBRE[c.duracion]} (${c.dias} d)</td>
          <td data-l="Estado">${c.usado_por ? '<span class="pill">Usado</span>' : '<span class="pill ok">Disponible</span>'}</td>
          <td data-l="Usado por">${c.usado_por ? `<a href="#usuario/${c.usado_por}">${esc(c.usado_nombre || c.usado_correo || 'Usuario')}</a><span class="pn-sub">${fechaCorta(c.usado_en)}</span>` : '—'}</td>
          <td data-l="Nota">${esc(c.nota || '—')}</td><td data-l="Creado">${fechaCorta(c.creado_en)}</td>
          <td class="pn-num">${c.usado_por ? '' : `<button class="btn small ghost" type="button" data-copy="${c.codigo}">Copiar</button>`}</td></tr>`).join('')}</tbody></table>`;
    $$('[data-copy]', view).forEach(b => { b.onclick = () => copiar(b.dataset.copy); });
  };
  $('[name=estado]', view).onchange = e => { filtroCod = e.target.value; pinta(); };
  $('[data-copy-all]', view)?.addEventListener('click', () => copiar(nuevos.map(c => c.codigo).join('\n')));
  const f = $('[data-gen]', view);
  f.onsubmit = e => {
    e.preventDefault();
    ocupado($('button', f), async () => {
      const v = Object.fromEntries(new FormData(f));
      nuevos = await rpc('generar_codigos', { p_cantidad: Number(v.cantidad), p_nivel: v.nivel, p_duracion: v.duracion, p_nota: v.nota || '' });
      toast(nuevos.length === 1 ? 'Código generado' : `${nuevos.length} códigos generados`);
      vCodigos();
    });
  };
  pinta();
}

// ---------- 5. cursos ----------
// Un curso sale en la app de los estudiantes solo si está habilitado. El administrador los ve todos.
async function vCursos() {
  cargando();
  let r;
  try { r = await rpc('admin_resumen'); await cargaLecciones(); } catch (e) { return fallo(e, vCursos); }
  const nLec = id => lecciones.filter(l => l.curso === id && l.tipo === 'leccion').length;
  view.innerHTML = `<h1>Cursos</h1>
    <p class="pn-count">Los estudiantes solo ven los cursos habilitados. Tú, como administrador, ves todos en la app; los que están en borrador llevan la marca «Borrador».</p>
    ${r.por_curso.length ? `<table class="pn-table"><thead><tr><th>Curso</th><th>Estado</th><th class="pn-num">Lecciones</th><th class="pn-num">Estudiantes</th><th></th></tr></thead><tbody>
      ${r.por_curso.map(c => `<tr><td class="pn-main">${esc(c.nombre)}</td>
        <td data-l="Estado">${c.publicado ? '<span class="pill ok">Habilitado</span>' : '<span class="pill">Borrador</span>'}</td>
        <td class="pn-num" data-l="Lecciones">${nLec(c.curso)}</td><td class="pn-num" data-l="Estudiantes">${c.estudiantes}</td>
        <td class="pn-num"><button class="btn small ${c.publicado ? 'ghost' : 'main'}" type="button" data-curso="${esc(c.curso)}" data-pub="${c.publicado ? 1 : 0}" data-est="${c.estudiantes}">${c.publicado ? 'Ocultar a estudiantes' : 'Habilitar para estudiantes'}</button></td></tr>`).join('')}</tbody></table>`
    : '<p class="pn-state">No hay cursos en la base.</p>'}`;
  $$('[data-curso]', view).forEach(b => {
    b.onclick = () => {
      const publicar = b.dataset.pub === '0';
      if (!publicar && !b.dataset.seguro) {   // ocultar pide un segundo toque
        b.dataset.seguro = '1';
        b.textContent = Number(b.dataset.est) ? `Lo estudian ${b.dataset.est}. Toca otra vez para ocultarlo` : 'Toca otra vez para ocultarlo';
        setTimeout(() => { if (b.isConnected) { delete b.dataset.seguro; b.textContent = 'Ocultar a estudiantes'; } }, 4000);
        return;
      }
      ocupado(b, async () => {
        const u = await sb.from('cursos').update({ publicado: publicar }).eq('id', b.dataset.curso).select();
        if (u.error || !u.data.length) throw new Error('No se pudo cambiar el curso');
        toast(publicar ? 'Curso habilitado: ya lo ven los estudiantes' : 'Curso oculto para los estudiantes');
        vCursos();
      });
    };
  });
}

// ---------- 6. planes ----------
async function vPlanes() {
  cargando();
  const { data, error } = await sb.from('planes').select('*');
  if (error) return fallo(error, vPlanes);
  const de = (n, d) => data.find(p => p.nivel === n && p.duracion === d) || {};
  view.innerHTML = `<h1>Planes y precios</h1>
    ${NIV.map(n => `<form class="pn-card" data-nivel="${n}"><h2>${NIVEL_NOMBRE[n]}</h2><p class="pn-count">${NIVEL_INCLUYE[n]}</p>
      <div class="pn-form">${DURACIONES.map(d => `<label class="fld"><span>${DURACION_NOMBRE[d]} (${de(n, d).dias} días) · COP</span>
        <input name="${d}" type="number" min="0" step="1000" value="${de(n, d).precio}" required></label>`).join('')}
        <button class="btn main" type="submit">Guardar</button></div></form>`).join('')}
    <p class="pn-count">Los precios nuevos se ven en la app al instante. Los códigos ya generados no cambian.</p>`;
  $$('form[data-nivel]', view).forEach(f => {
    f.onsubmit = e => {
      e.preventDefault();
      ocupado($('button', f), async () => {
        const v = Object.fromEntries(new FormData(f));
        for (const d of DURACIONES) {
          const precio = Math.round(Number(v[d]));
          if (!(precio >= 0)) throw new Error('El precio debe ser un número mayor o igual a 0');
          if (precio === de(f.dataset.nivel, d).precio) continue;
          const r = await sb.from('planes').update({ precio }).eq('nivel', f.dataset.nivel).eq('duracion', d).select();
          if (r.error || !r.data.length) throw new Error('No se pudo guardar el precio');
          de(f.dataset.nivel, d).precio = precio;
        }
        toast('Precios guardados');
      });
    };
  });
}

entrar();
