// Mundos con nombres y láminas sobrias (spec 2026-11-24-mundos-sobrios).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const all = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/|data\.js|worlds/.test(f));
const ctx = loadScripts(all), WORLDS = get(ctx, 'WORLDS'), COURSES = get(ctx, 'COURSES');
const CHILDISH = /Pradera|Valle|Mercado|Torres|Escalera|Taller|Fuente|Cordillera|Río|Selva|Mar de|Faro|Galaxia|Sendero|Fábrica|Puente|Cumbre|Mirador|Cruce|Templo|Archipiélago|Forja|Puerto|Órbita|Pista|Rampa|Campos|Plano Transformado/;

test('los mundos tienen nombres de capítulo, sin lugares de cuento', () => {
  const names = Object.values(WORLDS).map(w => w.name);
  assert.equal(names.length, 56);
  assert.equal(new Set(names).size, 56, 'nombres distintos');
  for (const n of names) { assert.ok(!CHILDISH.test(n), n); assert.ok(n.length >= 8 && n.length <= 26, `${n}: largo`); }
  assert.equal(WORLDS.conjuntos.name, 'Teoría de Conjuntos');
  // Lo que dicen los jefes al ganar tampoco nombra lugares.
  for (const g of ['jefe-venn', 'jefe-ruta', 'jefe-rueda']) assert.ok(!/[Pp]radera|[Rr]unas? |Kraken/.test(fs.readFileSync(path.join(ROOT, `js/games/${g}.js`), 'utf8').replace(/^\s*\/\/.*$/gm, '')), g);
  assert.equal(WORLDS.polar.name, 'El Plano Complejo');
});

test('cada mundo es una lámina técnica: fondo de tinta, retícula y diagrama; sin sol, nubes ni banderas', () => {
  for (const [k, w] of Object.entries(WORLDS)) {
    // Estilo neón (2026-11-27): el mismo fondo oscuro para todos, sin cuadrícula ni color propio del mundo, y un solo acento.
    assert.match(w.art, /data-style="neon"/, `${k}: estilo neón`);
    assert.match(w.art, new RegExp(`id="bg-${k}"`), `${k}: fondo propio`);
    assert.match(w.art, new RegExp(`filter="url\\(#glow-${k}\\)"`), `${k}: el diagrama brilla`);
    assert.ok(!/<pattern|id="grid-/.test(w.art), `${k}: sin cuadrícula`);
    assert.equal((w.art.match(/<radialGradient[\s\S]*?<\/radialGradient>/) || [''])[0].replace(/bg-[\w-]+/, ''), '<radialGradient id="" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="var(--plate-bg0, #141A33)"/><stop offset="1" stop-color="var(--plate-bg1, #07080F)"/></radialGradient>', `${k}: mismo degradado`);
    // Cada color es una variable con su valor por defecto: la app pone el acento del curso y el tema claro.
    assert.ok(!/(?<!, )#[0-9A-Fa-f]{6}/.test(w.art), `${k}: color fijo sin variable`);
    assert.match(w.art, /var\(--plate-ac, #6FD3FF\)/, `${k}: acento del curso`);
    const colors = new Set((w.art.match(/#[0-9A-Fa-f]{6}/g) || []).map(c => c.toUpperCase()));
    for (const c of colors) assert.ok(['#141A33', '#07080F', '#E6ECFF', '#6FD3FF'].includes(c), `${k}: color fuera de la paleta ${c}`);
    assert.ok(!/#ffd451|#fff1c9|#3fae72|#58c98a/i.test(w.art), `${k}: sin colores de paisaje pastel`);
    assert.ok(!/ry="4"\/><ellipse/.test(w.art) && !/v-14" stroke="#3b2a1a"/.test(w.art), `${k}: sin nubes ni banderas`);
    assert.ok((w.art.match(/<path|<circle|<line|<rect|<polyline|<ellipse/g) || []).length >= 6, `${k}: diagrama con contenido`);
  }
});

test('los jefes y sus escenas ya no nombran los lugares viejos', () => {
  for (const c of COURSES) for (const u of c.units || []) {
    if (!u.boss) continue;
    const txt = [u.boss.title, ...u.boss.clip.scenes.map(s => s.text), u.boss.ex[0].q, u.boss.ex[0].params.name || ''].join(' ');
    assert.ok(!/Pradera|Valle|Mercado|Torres|Escalera|Taller|Fuente|Cordillera|Selva|Mar de las Ondas|Galaxia|pradera|fuente|cordillera|selva|taller|mercado/.test(txt), `${u.world}: ${txt.slice(0, 120)}`);
  }
});

test('la portada de cada resumen lleva el nombre nuevo del mundo', () => {
  const RES = get(ctx, 'RESUMENES');
  for (const w of RES) {
    const tex = fs.readFileSync(path.join(ROOT, `docs/resumenes/tex/${w}.tex`), 'utf8');
    const m = tex.match(/\\zukamundo\{\d+\}\{([^}]+)\}/);
    assert.ok(m, w); assert.equal(m[1], WORLDS[w].name, `${w}: portada`);
  }
});
