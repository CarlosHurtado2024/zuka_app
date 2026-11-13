// Piezas de PWA que no son el service worker (spec 2026-11-13-revision-pwa; pruebas tests/pwa.test.js).
// - tabFromURL: los atajos del icono instalado (manifest.json → shortcuts) abren index.html?tab=…
// - watchConnection: avisa cuando se va o vuelve la red, en vez de fallar en silencio.
// - keepData: pide al navegador que no borre el progreso (localStorage) cuando falte espacio.

const TABS = ['learn', 'clips', 'tutorias', 'profile'];

function tabFromURL(search) {
  const m = /[?&]tab=([^&#]*)/.exec(search || '');
  return m && TABS.includes(m[1]) ? m[1] : 'learn';
}

function watchConnection(win, body, say) {
  const update = announce => {
    const off = win.navigator.onLine === false;
    body.classList.toggle('offline', off);
    if (!announce) return;
    say(off
      ? 'Sin conexión: las lecciones y los juegos siguen funcionando; los videos esperan la red.'
      : 'Volvió la conexión.');
  };
  win.addEventListener('offline', () => update(true));
  win.addEventListener('online', () => update(true));
  update(win.navigator.onLine === false);
}

async function keepData(nav) {
  const st = nav && nav.storage;
  if (!st || !st.persist) return false;
  try {
    if (st.persisted && await st.persisted()) return true;
    return await st.persist();
  } catch (e) { return false; }
}
