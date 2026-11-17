// Copia las láminas de los mundos de Álgebra (js/worlds.js) a video/lamina/plates.js, con su color de acento.
//   node video/lamina/tools/plates.js
const fs = require('fs');
const path = require('path');
const { loadScripts, get } = require('../../../tests/load');
const ROOT = path.join(__dirname, '..', '..', '..');
const src = fs.readFileSync(path.join(ROOT, 'js', 'worlds.js'), 'utf8');
const consts = Object.fromEntries([...src.match(/const INK = [^;]+;/)[0].matchAll(/(\w+) = '(#[0-9A-Fa-f]{6})'/g)].map(m => [m[1], m[2]]));
const acc = Object.fromEntries([...src.matchAll(/'?([\w-]+)'?: \{ name: '[^']+', art: plate\('[\w-]+', (\w+)/g)].map(m => [m[1], consts[m[2]]]));
const ctx = loadScripts(['js/worlds.js']);
const W = get(ctx, 'WORLDS');
const ALG = ['conjuntos', 'numeros', 'razones', 'potencias', 'progresiones', 'polinomios', 'cuadraticas', 'grado-superior', 'racionales', 'exp-log'];
const find = id => { for (const k in W) { if (W[k] && W[k][id]) return W[k][id]; } return W[id]; };
const out = {};
ALG.forEach((id, i) => { const w = find(id); out[id] = { n: i + 1, name: w.name, ac: acc[id], svg: w.art }; });
fs.writeFileSync(path.join(__dirname, '..', 'plates.js'), '// Generado por tools/plates.js a partir de js/worlds.js: no editar a mano.\nconst PLATES = ' + JSON.stringify(out, null, 1) + ';\nif (typeof module !== \'undefined\') module.exports = PLATES;\n');
console.log(Object.entries(out).map(([k, v]) => `${v.n} ${k} ${v.ac} ${v.name}`).join('\n'));
