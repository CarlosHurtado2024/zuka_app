// Lista todos los problemas de una película antes de renderizar: ritmo de narración, rótulos que no alcanzan a leerse o se salen.
//   node video/lamina/tools/check.js tipos [otra …]
const { loadScripts, get } = require('../../../tests/load');
const { timeline, plain } = require('../timeline.js');
const need = s => Math.max(1.5, [...plain(s)].filter(c => !/\s/.test(c)).length / 15 + 1.5);
const words = s => plain(s).split(/\s+/).filter(Boolean).length;
let bad = 0;
for (const name of process.argv.slice(2)) {
  const F = get(loadScripts(['video/lamina/plates.js', 'video/lamina/timeline.js', 'video/lamina/kit.js', `video/lamina/films/${name}.js`]), 'FILM'), TL = timeline(F);
  const say = m => { bad++; console.log(`${name}: ${m}`); };
  for (const s of F.scenes) {
    s.caps.forEach(([a, b, k, l1, l2], i) => {
      for (const x of [k, l1, l2].filter(Boolean)) if (b - a - 0.5 < need(x)) say(`${s.id} rótulo corto (${(b - a).toFixed(1)} s, pide ${need(x).toFixed(1)}): ${x}`);
      for (const x of [l1, l2].filter(Boolean)) if (plain(x).length > 31) say(`${s.id} renglón de ${plain(x).length}: ${x}`);
      for (const x of [l1, l2].filter(Boolean)) x.split('$').forEach((q, j) => { if (j % 2 && /(^|[^\\a-zA-Z^_}\]])\{/.test(q)) say(`${s.id} llave sin barra en un rótulo (¿falta R\`\`?): ${x}`); });
      if (a < 0.4 || b > s.dur - 0.4) say(`${s.id} rótulo fuera de la escena: ${l1}`);
      if (i && a < s.caps[i - 1][1] + 0.3) say(`${s.id} rótulos encimados: ${l1}`);
    });
    (s.narr || []).forEach(([a, b, x]) => { const r = words(x) / (b - a); if (r > 3.25) say(`${s.id} narración ${words(x)} palabras en ${(b - a).toFixed(1)} s (máx ${Math.floor(3.25 * (b - a))}): ${x.slice(0, 60)}…`); if (b > s.dur) say(`${s.id} narración pasa el final`); });
  }
  TL.NARR.filter(n => n[1] - n[0] < 1.8 || words(n[2]) / (n[1] - n[0]) > 3.25).forEach(n => { if (n[0] < TL.INTRO || n[0] > TL.SC.at(-1).t0) say(`portada/resumen: ${words(n[2])} palabras en ${(n[1] - n[0]).toFixed(1)} s`); });
  console.log(`${name}: ${TL.DUR} s, ${F.scenes.length} escenas`);
}
process.exit(bad ? 1 : 0);
