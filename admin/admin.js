// Panel de administración de Zuka (/admin). Todo lo que muestra o cambia pasa por funciones de la
// base que comprueban es_admin(): esta página no guarda nada y sin rol admin no recibe datos.
// Vistas por ancla: #resumen, #usuarios, #usuario/<id>, #codigos, #planes.

const sb = window.supabase ? window.supabase.createClient(SUPA_URL, SUPA_KEY) : null;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const view = $('#ad-view');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const CURSOS = { algebra: 'Álgebra', trig: 'Trigonometría', calc: 'Cálculo Diferencial', geo: 'Geometría', fis: 'Física Mecánica', int: 'Cálculo Integral', lin: 'Álgebra Lineal' };
const ESTADO = { activo: ['ok', 'Activo'], vencido: ['bad', 'Vencido'], sin_plan: ['', 'Sin plan'] };
const pill = est => `<span class="pill ${ESTADO[est][0]}">${ESTADO[est][1]}</span>`;
const opts = (list, names, sel) => list.map(v => `<option value="${v}"${v === sel ? ' selected' : ''}>${names[v]}</option>`).join('');
const NIV = NIVELES.slice(1);

let toastT = null;
function toast(msg) {
  const t = $('#ad-toast'); t.textContent = msg; t.hidden = false;
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
const cargando = (txt = 'Cargando…') => { view.innerHTML = `<p class="ad-state">${txt}</p>`; };
function fallo(err, reintentar) {
  const sinPermiso = err && (err.code === '42501' || /administrador/i.test(err.message || ''));
  view.innerHTML = `<p class="ad-state bad">${sinPermiso ? 'Esta cuenta no tiene permiso de administración.' : 'No se pudo cargar. Revisa tu conexión.'}
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
  if (!sb) { view.innerHTML = '<p class="ad-state bad">No se pudo cargar el panel. Revisa tu conexión y recarga.</p>'; return; }
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return login();
  let admin = false;
  try { admin = await rpc('es_admin'); } catch (e) { return fallo(e, entrar); }
  $('.ad-user').hidden = false; $('.ad-mail').textContent = session.user.email;
  if (!admin) {
    view.innerHTML = '<p class="ad-state bad">Esta cuenta no tiene permiso de administración.<br>Cierra sesión y entra con la cuenta administradora.</p>';
    return;
  }
  $('.ad-nav').hidden = false;
  addEventListener('hashchange', ruta);
  ruta();
}

function login() {
  $('.ad-nav').hidden = true; $('.ad-user').hidden = true;
  view.innerHTML = `<form class="ad-card ad-login acct-form" novalidate><h1>Entrar al panel</h1>
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
  $$('.ad-nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${name === 'usuario' ? 'usuarios' : name}`));
  ({ resumen: vResumen, usuarios: vUsuarios, usuario: () => vUsuario(arg), codigos: vCodigos, planes: vPlanes }[name] || vResumen)();
  scrollTo(0, 0);
}

// ---------- 1. resumen ----------
async function vResumen() {
  cargando();
  let r; try { r = await rpc('admin_resumen'); } catch (e) { return fallo(e, vResumen); }
  const tile = (n, label, cls = '') => `<div class="ad-tile ${cls}"><b>${n}</b><span>${label}</span></div>`;
  view.innerHTML = `<h1>Resumen</h1>
    <section class="ad-tiles">${tile(r.activos, 'Usuarios activos', 'ok')}${tile(r.vencidos, 'Vencidos', 'bad')}${tile(r.sin_plan, 'Sin plan')}
      ${tile(r.codigos_disponibles, 'Códigos disponibles')}${tile(r.codigos_usados, 'Códigos usados')}</section>
    <section class="ad-card"><h2>Activos por nivel</h2>
      <div class="ad-tiles">${NIV.map(n => tile(r.por_nivel[n] || 0, NIVEL_NOMBRE[n])).join('')}</div></section>
    <section class="ad-card"><h2>Vencen en los próximos 7 días</h2>
      ${r.vencen_7.length ? `<table class="ad-table"><thead><tr><th>Usuario</th><th>Nivel</th><th>Vence</th><th class="num">Quedan</th></tr></thead><tbody>
        ${r.vencen_7.map(u => `<tr data-id="${u.id}"><td class="main">${esc(u.nombre || 'Sin nombre')}<span class="sub">${esc(u.correo)}</span></td>
          <td data-l="Nivel">${NIVEL_NOMBRE[u.nivel]}</td><td data-l="Vence">${fechaCorta(u.acceso_hasta)}</td>
          <td class="num" data-l="Quedan">${diasTexto(estadoPlan(u).dias)}</td></tr>`).join('')}</tbody></table>`
      : '<p class="ad-state">Ningún plan vence esta semana.</p>'}</section>`;
  filasUsuario();
}
const filasUsuario = () => $$('tr[data-id]', view).forEach(tr => { tr.onclick = () => { location.hash = `usuario/${tr.dataset.id}`; }; });

// ---------- 2. usuarios ----------
const filtro = { q: '', estado: '', nivel: '', orden: 'asc' };
async function vUsuarios() {
  cargando();
  let us; try { us = await rpc('admin_usuarios'); } catch (e) { return fallo(e, vUsuarios); }
  us.forEach(u => { u.e = estadoPlan(u); });
  view.innerHTML = `<div class="ad-head"><h1>Usuarios</h1><span class="ad-count"></span></div>
    <div class="ad-filters">
      <label class="fld"><span>Buscar</span><input type="search" name="q" placeholder="Nombre, correo o teléfono" value="${esc(filtro.q)}"></label>
      <label class="fld"><span>Estado</span><select name="estado"><option value="">Todos</option>${opts(['activo', 'vencido', 'sin_plan'], { activo: 'Activo', vencido: 'Vencido', sin_plan: 'Sin plan' }, filtro.estado)}</select></label>
      <label class="fld"><span>Nivel</span><select name="nivel"><option value="">Todos</option>${opts(NIV, NIVEL_NOMBRE, filtro.nivel)}</select></label>
      <label class="fld"><span>Vencimiento</span><select name="orden">${opts(['asc', 'desc'], { asc: 'Vence antes primero', desc: 'Vence después primero' }, filtro.orden)}</select></label>
    </div><div class="ad-list"></div>`;
  const pinta = () => {
    const q = filtro.q.trim().toLowerCase();
    const t = u => (u.acceso_hasta ? new Date(u.acceso_hasta).getTime() : null);
    const rows = us.filter(u => (!q || `${u.nombre} ${u.correo} ${u.telefono}`.toLowerCase().includes(q))
      && (!filtro.estado || u.e.estado === filtro.estado) && (!filtro.nivel || u.nivel === filtro.nivel))
      .sort((a, b) => (t(a) == null) - (t(b) == null) || (filtro.orden === 'asc' ? t(a) - t(b) : t(b) - t(a)));   // sin fecha, al final
    $('.ad-count', view).textContent = `${rows.length} de ${us.length}`;
    $('.ad-list', view).innerHTML = !us.length ? '<p class="ad-state">Aún no hay usuarios registrados.</p>'
      : !rows.length ? '<p class="ad-state">Ningún usuario coincide con el filtro.</p>'
      : `<table class="ad-table"><thead><tr><th>Usuario</th><th>Teléfono</th><th>Estado</th><th>Nivel</th><th>Duración</th><th>Inicio</th><th>Fin</th><th class="num">Quedan</th></tr></thead><tbody>
        ${rows.map(u => `<tr data-id="${u.id}"><td class="main">${esc(u.nombre || 'Sin nombre')}${u.rol === 'admin' ? ' <span class="pill warn">Admin</span>' : ''}<span class="sub">${esc(u.correo)}</span></td>
          <td data-l="Teléfono">${esc(u.telefono || '—')}</td><td data-l="Estado">${pill(u.e.estado)}</td>
          <td data-l="Nivel">${NIVEL_NOMBRE[u.nivel] || '—'}</td><td data-l="Duración">${DURACION_NOMBRE[u.duracion] || '—'}</td>
          <td data-l="Inicio">${fechaCorta(u.acceso_desde)}</td><td data-l="Fin">${fechaCorta(u.acceso_hasta)}</td>
          <td class="num" data-l="Quedan">${u.e.estado === 'activo' ? diasTexto(u.e.dias) : '—'}</td></tr>`).join('')}</tbody></table>`;
    filasUsuario();
  };
  $$('.ad-filters [name]', view).forEach(el => { el.oninput = () => { filtro[el.name] = el.value; pinta(); }; });
  pinta();
}

// ---------- 3. detalle de usuario ----------
let lecciones = null;   // catálogo (tabla `lecciones`): para el avance por curso
async function vUsuario(id) {
  cargando();
  let d;
  try {
    d = await rpc('admin_usuario', { p_id: id });
    if (!lecciones) { const r = await sb.from('lecciones').select('id,tipo,curso,titulo'); if (r.error) throw r.error; lecciones = r.data; }
  } catch (e) { return fallo(e, () => vUsuario(id)); }
  if (!d) { view.innerHTML = '<a class="ad-back" href="#usuarios">← Usuarios</a><p class="ad-state">No existe ese usuario.</p>'; return; }
  const p = d.perfil, e = estadoPlan(p);
  const hechas = new Set(d.progreso.filter(g => g.completada).map(g => g.leccion));
  const segundos = d.progreso.reduce((t, g) => t + (g.segundos_vistos || 0), 0);
  const cursos = Object.keys(CURSOS).map(c => {
    const ls = lecciones.filter(l => l.curso === c && l.tipo === 'leccion');
    return { c, total: ls.length, n: ls.filter(l => hechas.has(l.id)).length };
  }).filter(x => x.total);
  view.innerHTML = `<a class="ad-back" href="#usuarios">← Usuarios</a>
    <div class="ad-head"><h1>${esc(p.nombre || 'Sin nombre')}</h1>${pill(e.estado)}</div>
    <section class="ad-card"><dl class="ad-facts">
      <div><dt>Correo</dt><dd>${esc(p.correo)}</dd></div><div><dt>Teléfono</dt><dd>${esc(p.telefono || '—')}</dd></div>
      <div><dt>Nivel</dt><dd>${NIVEL_NOMBRE[p.nivel] || '—'}</dd></div><div><dt>Duración</dt><dd>${DURACION_NOMBRE[p.duracion] || '—'}</dd></div>
      <div><dt>Inicio</dt><dd>${fechaCorta(p.acceso_desde)}</dd></div><div><dt>Fin</dt><dd>${fechaCorta(p.acceso_hasta)}</dd></div>
      <div><dt>Días restantes</dt><dd>${e.estado === 'activo' ? e.dias : 0}</dd></div><div><dt>Registro</dt><dd>${fechaCorta(p.creado_en)}</dd></div></dl></section>
    <section class="ad-card"><h2>Acceso manual</h2><div class="ad-actions">
      <form data-a="extender"><label class="fld"><span>Extender (días)</span><input name="dias" type="number" min="1" max="3650" value="30" required></label>
        <button class="btn main" type="submit"${p.nivel ? '' : ' disabled title="Primero asígnale un plan"'}>Extender</button></form>
      <form data-a="cambiar"><label class="fld"><span>Nivel</span><select name="nivel">${opts(NIV, NIVEL_NOMBRE, p.nivel || 'basico')}</select></label>
        <label class="fld"><span>Duración</span><select name="duracion">${opts(DURACIONES, DURACION_NOMBRE, p.duracion || 'mensual')}</select></label>
        <button class="btn main" type="submit">${p.nivel ? 'Cambiar plan (desde hoy)' : 'Asignar plan'}</button></form>
      <form data-a="revocar"><button class="btn ghost danger" type="submit"${p.nivel ? '' : ' disabled'}>Revocar acceso</button></form>
    </div></section>
    <section class="ad-card"><h2>Progreso por curso</h2>
      ${hechas.size || segundos ? `<div class="ad-prog">${cursos.map(x => `<div><span>${CURSOS[x.c]}</span><span>${x.n}/${x.total}</span>
        <span class="mini-bar"><i style="width:${(100 * x.n) / x.total}%"></i></span></div>`).join('')}</div>
        <p class="ad-count">${hechas.size} lecciones completadas · ${Math.round(segundos / 60)} min de video vistos</p>`
      : '<p class="ad-state">Aún no ha completado lecciones.</p>'}</section>
    <section class="ad-card"><h2>Códigos canjeados</h2>
      ${d.codigos.length ? `<table class="ad-table"><thead><tr><th>Código</th><th>Plan</th><th>Días</th><th>Canjeado</th><th>Nota</th></tr></thead><tbody>
        ${d.codigos.map(c => `<tr><td class="main ad-code">${muestraCodigo(c.codigo)}</td><td data-l="Plan">${NIVEL_NOMBRE[c.nivel]} · ${DURACION_NOMBRE[c.duracion]}</td>
          <td data-l="Días">${c.dias}</td><td data-l="Canjeado">${fechaCorta(c.usado_en)}</td><td data-l="Nota">${esc(c.nota || '—')}</td></tr>`).join('')}</tbody></table>`
      : '<p class="ad-state">No ha canjeado códigos.</p>'}</section>`;
  $$('.ad-actions form', view).forEach(f => {
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
    <section class="ad-card"><h2>Generar códigos</h2>
      <form class="ad-form" data-gen><label class="fld"><span>Cantidad</span><input name="cantidad" type="number" min="1" max="200" value="1" required></label>
        <label class="fld"><span>Nivel</span><select name="nivel">${opts(NIV, NIVEL_NOMBRE, 'basico')}</select></label>
        <label class="fld"><span>Duración</span><select name="duracion">${opts(DURACIONES, DURACION_NOMBRE, 'mensual')}</select></label>
        <label class="fld"><span>Nota (a quién se vendió)</span><input name="nota" maxlength="200" placeholder="Opcional"></label>
        <button class="btn main" type="submit">Generar</button></form>
      ${nuevos.length ? `<div class="ad-new"><b>${nuevos.length === 1 ? 'Código nuevo' : `${nuevos.length} códigos nuevos`}: ${NIVEL_NOMBRE[nuevos[0].nivel]} · ${DURACION_NOMBRE[nuevos[0].duracion]}</b>
        <ul>${nuevos.map(c => `<li class="ad-code">${muestraCodigo(c.codigo)}</li>`).join('')}</ul>
        <button class="btn small ghost" type="button" data-copy-all>Copiar ${nuevos.length === 1 ? 'el código' : 'todos'}</button></div>` : ''}</section>
    <section class="ad-card flat"><div class="ad-head"><h2>Lista</h2>
      <label class="fld"><select name="estado" aria-label="Filtrar por estado"><option value="">Todos</option>${opts(['libre', 'usado'], { libre: 'Disponibles', usado: 'Usados' }, filtroCod)}</select></label></div>
      <div class="ad-list"></div></section>`;
  const pinta = () => {
    const rows = cs.filter(c => !filtroCod || (filtroCod === 'usado') === !!c.usado_por);
    $('.ad-list', view).innerHTML = !cs.length ? '<p class="ad-state">Aún no hay códigos. Genera el primero arriba.</p>'
      : !rows.length ? '<p class="ad-state">Ningún código con ese estado.</p>'
      : `<table class="ad-table"><thead><tr><th>Código</th><th>Plan</th><th>Estado</th><th>Usado por</th><th>Nota</th><th>Creado</th><th></th></tr></thead><tbody>
        ${rows.map(c => `<tr><td class="main ad-code">${muestraCodigo(c.codigo)}</td>
          <td data-l="Plan">${NIVEL_NOMBRE[c.nivel]} · ${DURACION_NOMBRE[c.duracion]} (${c.dias} d)</td>
          <td data-l="Estado">${c.usado_por ? '<span class="pill">Usado</span>' : '<span class="pill ok">Disponible</span>'}</td>
          <td data-l="Usado por">${c.usado_por ? `<a href="#usuario/${c.usado_por}">${esc(c.usado_nombre || c.usado_correo || 'Usuario')}</a><span class="sub">${fechaCorta(c.usado_en)}</span>` : '—'}</td>
          <td data-l="Nota">${esc(c.nota || '—')}</td><td data-l="Creado">${fechaCorta(c.creado_en)}</td>
          <td class="num">${c.usado_por ? '' : `<button class="btn small ghost" type="button" data-copy="${c.codigo}">Copiar</button>`}</td></tr>`).join('')}</tbody></table>`;
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

// ---------- 5. planes ----------
async function vPlanes() {
  cargando();
  const { data, error } = await sb.from('planes').select('*');
  if (error) return fallo(error, vPlanes);
  const de = (n, d) => data.find(p => p.nivel === n && p.duracion === d) || {};
  view.innerHTML = `<h1>Planes y precios</h1>
    ${NIV.map(n => `<form class="ad-card" data-nivel="${n}"><h2>${NIVEL_NOMBRE[n]}</h2><p class="ad-count">${NIVEL_INCLUYE[n]}</p>
      <div class="ad-form">${DURACIONES.map(d => `<label class="fld"><span>${DURACION_NOMBRE[d]} (${de(n, d).dias} días) · COP</span>
        <input name="${d}" type="number" min="0" step="1000" value="${de(n, d).precio}" required></label>`).join('')}
        <button class="btn main" type="submit">Guardar</button></div></form>`).join('')}
    <p class="ad-count">Los precios nuevos se ven en la app al instante. Los códigos ya generados no cambian.</p>`;
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
