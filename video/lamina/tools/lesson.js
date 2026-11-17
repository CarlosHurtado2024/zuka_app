// Muestra en pocas líneas lo que trae una lección: escenas de respaldo y ejercicios (para no repetir sus ejemplos en el video).
//   node video/lamina/tools/lesson.js alg-11 alg-11b
const { loadScripts, get } = require('../../../tests/load');
const ctx = loadScripts(['js/games/kit.js', 'js/games/arma-la-cuenta.js', 'js/games/escala-solucion.js', 'js/content.js', 'js/courses/algebra.js', 'js/courses/mundos-altos.js']);
const ALG = get(ctx, 'COURSE_ALGEBRA'), all = ALG.units.flatMap(u => u.lessons);
const cut = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
for (const id of process.argv.slice(2)) {
  const l = all.find(x => x.id === id); if (!l) { console.log('no existe', id); continue; }
  console.log(`\n# ${id} ${l.title}`);
  (l.clip.scenes || []).forEach(s => console.log(' S:', cut([s.title, s.text, (s.steps || []).join(' / ')].filter(Boolean).join(' | '), 230)));
  l.ex.forEach(e => console.log(' E:', e.game || e.type, '·', cut(e.q || '', 70), '::', cut(JSON.stringify(e.params || e.options || e.answer || ''), 200)));
}
