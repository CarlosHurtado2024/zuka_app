// Videos zoom de Trigonometría (video/trig-zoom/films): narración a ritmo legible, sin nombres de personajes, ejemplos que
// no salen en los ejercicios de su lección, cuentas correctas y final que responde la pregunta del principio.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const FILMS = {
  grados: 'trig-41a', arco: 'trig-41b', soh: 'trig-1', notables: 'trig-2', seis: 'trig-42c', unitaria: 'trig-3',
  signos: 'trig-43b', amplitud: 'trig-44a', periodo: 'trig-44b', inversas: 'trig-45', identidades: 'trig-4',
  demostrar: 'trig-47b', suma: 'trig-48a', doble: 'trig-48b', ecuaciones: 'trig-49', senos: 'trig-46a', cosenos: 'trig-46b',
  polar: 'trig-151', demoivre: 'trig-152', raices: 'trig-153',
};
const DIR = path.join(__dirname, '..', 'video', 'trig-zoom', 'films');
const src = f => fs.readFileSync(path.join(DIR, f + '.js'), 'utf8');
const narr = f => eval(src(f).match(/FILM\.NARR = (\[[\s\S]*?\n\]);/)[1]);
const trig = fs.readFileSync(path.join(__dirname, '..', 'js', 'courses', 'trig.js'), 'utf8');
function exOf(id) {
  const i = trig.indexOf(`id: '${id}',`), j = trig.indexOf('ex: [', i), k = trig.indexOf("\n          id: '", j);
  return trig.slice(j, k < 0 ? undefined : k);
}

test('hay un video por lección de Trigonometría', () => {
  const ids = [...trig.matchAll(/id: '(trig-[0-9a-z]+)'/g)].map(m => m[1]);
  for (const id of ids) assert.ok(Object.values(FILMS).includes(id), `falta el video de ${id}`);
  for (const f of Object.keys(FILMS)) assert.ok(fs.existsSync(path.join(DIR, f + '.js')), f);
});

test('cada narración va a menos de 3.2 palabras por segundo y sin pisarse', () => {
  for (const f of Object.keys(FILMS)) {
    const N = narr(f);
    N.forEach(([a, b, s], i) => {
      const w = s.split(/\s+/).length;
      assert.ok(b - a >= 1.8 && w / (b - a) <= 3.2, `${f} ${a}: ${s}`);
      if (i) assert.ok(a >= N[i - 1][1], `${f} ${a}: se pisa con la anterior`);
    });
  }
});

test('ningún video usa los personajes de Álgebra ni empieza presentando a alguien', () => {
  for (const f of Object.keys(FILMS)) {
    const all = narr(f).map(x => x[2]).join(' ') + ' ' + src(f);
    for (const name of ['Ana', 'Beto', 'Caro']) assert.ok(!new RegExp(`\\b${name}\\b`).test(all), `${f} nombra a ${name}`);
  }
});

test('los ejemplos de cada video no salen en los ejercicios de su lección', () => {
  const EXAMPLES = {
    grados: ['72', '420', '114'], arco: ['minutero', '1.2', '3\\pi'], soh: ['17', '0.28', 'cometa'],
    notables: ['tejado', 'escuadra'], seis: ['29', '1366', 'antena'], unitaria: ['150', 'noria'],
    signos: ['240', '320', '150'], amplitud: ['sen x + 3', 'marea', '0.5\\operatorname{sen}'], periodo: ['\\pi}{6}', '2\\pi x'],
    inversas: ['{1}{12}', '120', 'rampa'], identidades: ['8}{17}', '17'], demostrar: ['\\tan x + \\cot x', 'cos(x + y)'],
    suma: ['75'], doble: ['alcance', 'sen 15'], ecuaciones: ['17', 'noria'], senos: ['75', '12.25', '40^'],
    cosenos: ['túnel', '17.32', '38.2'], polar: ['3 + 4i', '53.13', '233'], demoivre: ['(1 + i)^8', '6\\,\\mathrm{cis}\\,75', 'sonda'],
    raices: ['x^3 = 1', '60^\\circ}{3}', 'hexágono', "zLabel: 'cis 120°'", '64, deg: 0'],
  };
  for (const [f, list] of Object.entries(EXAMPLES)) {
    const ex = exOf(FILMS[f]);
    assert.ok(ex.length > 200, `no encontré los ejercicios de ${FILMS[f]}`);
    for (const e of list) assert.ok(!ex.includes(e), `${f}: «${e}» aparece en los ejercicios de ${FILMS[f]}`);
  }
});

test('las cuentas de los videos son correctas', () => {
  const near = (a, b, e = 1e-3) => assert.ok(Math.abs(a - b) < e, `${a} ≠ ${b}`);
  const D = Math.PI / 180, deg = r => r / D;
  near(deg(3), 171.887, 1e-3); near(Math.PI - 3, 0.1416, 1e-4); near(72 * D, 2 * Math.PI / 5); near(deg(4 * Math.PI / 3), 240); near(deg(2), 114.59, .01);
  near(3 * 2 * Math.PI / 3, 2 * Math.PI); near(0.5 * 9 * 2 * Math.PI / 3, 3 * Math.PI); near(0.5 * 25 * 1.2, 15);
  near(50 * 0.28, 14); near(50 * 0.96, 48); assert.strictEqual(14 ** 2 + 48 ** 2, 50 ** 2); assert.strictEqual(8 ** 2 + 15 ** 2, 17 ** 2);
  near(Math.sin(60 * D), Math.sqrt(3) / 2); near(6 * Math.sin(30 * D), 3);
  assert.strictEqual(20 ** 2 + 21 ** 2, 29 ** 2); near(25 * Math.tan(40 * D), 20.98, .01); near(80 / Math.tan(20 * D), 219.8, .1);
  near(1000 * Math.tan(30 * D) / (1 - Math.tan(30 * D)), 1366.03, .01);
  near(Math.cos(150 * D), -Math.sqrt(3) / 2); near(Math.sin(150 * D), .5); near(Math.cos(240 * D), -.5);
  near(3 + 2 * Math.sin(-Math.PI / 2), 1);
  near(deg(Math.atan(1 / 12)), 4.764, 1e-3); near(deg(Math.atan(1 / 8)), 7.125, 1e-3); near(deg(Math.acos(-.5)), 120);
  near(1 - (8 / 17) ** 2, 225 / 289); near(Math.tan(Math.atan2(-15, 8)), -15 / 8);
  near(Math.tan(1) + 1 / Math.tan(1), 1 / (Math.sin(1) * Math.cos(1)));
  near(Math.sin(75 * D), (Math.sqrt(6) + Math.sqrt(2)) / 4); near(Math.cos(75 * D), .2588); near(Math.tan(75 * D), 2 + Math.sqrt(3));
  near(40 * Math.sin(60 * D), 34.64, .01); near(Math.sin(15 * D), Math.sqrt((1 - Math.cos(30 * D)) / 2));
  near(12 + 10 * Math.sin(30 * D), 17); near(12 + 10 * Math.sin(150 * D), 17);
  for (const x of [0, 60, 300]) near(2 * Math.cos(x * D) ** 2 - 3 * Math.cos(x * D) + 1, 0);
  near(1 + Math.sin(0), Math.cos(0)); near(1 + Math.sin(270 * D), Math.cos(270 * D)); assert.ok(Math.abs(1 + Math.sin(Math.PI) - Math.cos(Math.PI)) > 1);
  near(10 * Math.sin(60 * D) / Math.sin(45 * D), 12.247, 1e-3); near(10 * Math.sin(75 * D) / Math.sin(45 * D), 13.660, 1e-3);
  near(deg(Math.asin(12 * Math.sin(40 * D) / 9)), 59.0, .05);
  near(25 + 64 - 2 * 5 * 8 * .5, 49); near(deg(Math.acos(88 / 112)), 38.21, .01); near(.5 * 5 * 8 * Math.sin(60 * D), Math.sqrt(300));
  near(Math.hypot(3, 4), 5); near(deg(Math.atan2(4, 3)), 53.13, .01); near(deg(Math.atan2(-4, -3)) + 360, 233.13, .01);
  near(Math.SQRT2 ** 8, 16); near(2 ** 6, 64); near(Math.cbrt(8), 2); near(64 ** (1 / 6), 2);
});

test('el final de cada narración vuelve a la pregunta del principio', () => {
  const CLOSE = {
    grados: /tres radianes/, arco: /seis punto veintiocho/, soh: /catorce metros/, notables: /raíz de tres sobre dos/,
    seis: /mil trescientos sesenta y seis/, unitaria: /medio radio/, signos: /menos un medio/, amplitud: /un metro/,
    periodo: /infinito/, inversas: /cuatro punto ocho/, identidades: /quince diecisieteavos/, demostrar: /tenían razón/,
    suma: /nueve seis seis/, doble: /cuarenta y cinco/, ecuaciones: /ciento cincuenta/, senos: /13.66/, cosenos: /siete kilómetros/,
    polar: /cincuenta y tres/, demoivre: /dieciséis/, raices: /tres soluciones/,
  };
  for (const [f, re] of Object.entries(CLOSE)) assert.match(narr(f).at(-2)[2] + ' ' + narr(f).at(-1)[2], re, f);
});
