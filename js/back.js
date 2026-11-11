// Botón «atrás» del celular (y del navegador). La app deja dos entradas en el historial: la base y,
// encima, una «tapa». Cada atrás saca la tapa; aquí se decide qué cerrar y se vuelve a poner la tapa.
// En la pantalla principal (Aprender, mapa de mundos) el primer atrás deja la app en la base y pregunta
// si quieres salir; el segundo atrás ya lo atiende el sistema: cierra la app instalada (o, en el
// navegador, vuelve a la página anterior). «Quedarme» vuelve a poner la tapa.

// Qué hace un atrás según lo que está abierto, de lo más encima a lo más abajo.
function backStep(s) {
  if (s.exitAsk) return 'exit';        // se estaba preguntando si salir: segundo atrás
  if (s.dialog) return 'dialog';       // diálogo abierto: se cancela
  if (s.sheet) return 'sheet';         // hoja inferior: se cierra
  if (s.lesson) return 'lesson';       // lección o evaluación: se sale (pregunta si hay progreso)
  if (s.world) return 'world';         // dentro de un mundo: vuelve al mapa
  if (s.tab !== 'learn') return 'tab'; // Clips o Perfil: vuelve a Aprender
  return 'ask-exit';
}

// Instalada (pantalla completa) la app no puede cerrarse sola: ahí la pregunta solo invita a
// presionar atrás otra vez. En el navegador «Salir» vuelve a la página anterior.
const isInstalledApp = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

function setupBack() {
  if (!history.pushState) return;
  let exitAsk = false;
  const cover = () => history.pushState({ zuka: 'top' }, '');
  // Al recargar (o al actualizar la versión) la tapa ya existe: no se apilan bases nuevas.
  if (history.state?.zuka !== 'top') { history.replaceState({ zuka: 'base' }, ''); cover(); }

  addEventListener('popstate', () => {
    const step = backStep({
      exitAsk, tab, dialog: dialogOpen(), sheet: $('#sheet').classList.contains('open'),
      lesson: !!lessonClose, world: tab === 'learn' && !!openWorld,
    });
    if (step === 'exit') { exitAsk = false; dismissDialog(); history.back(); return; }
    if (step === 'ask-exit') {
      // Sin volver a poner la tapa: el próximo atrás sale de la app.
      exitAsk = true;
      const installed = isInstalledApp();
      ask({ title: '¿Quieres salir de Zuka?',
        text: installed ? 'Tu progreso queda guardado. Presiona atrás otra vez para salir.' : 'Tu progreso queda guardado.',
        ok: installed ? null : 'Salir', cancel: 'Quedarme' })
        .then(yes => {
          if (!exitAsk) return;
          exitAsk = false;
          if (yes) history.back(); else cover();
        });
      return;
    }
    cover();
    if (step === 'dialog') dismissDialog();
    else if (step === 'sheet') closeSheet();
    else if (step === 'lesson') lessonClose();
    else if (step === 'world') { openWorld = null; renderLearn(); }
    else go('learn');
  });
}
