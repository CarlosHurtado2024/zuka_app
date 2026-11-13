// Jefe final de la Pradera de Venn (spec 2026-11-14-jefe-final-pradera): juego `jefe-venn` y nodo `unit.boss`.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadGame, loadScripts, get, ROOT } = require('./load');

const g = loadGame('js/games/jefe-venn.js')['jefe-venn'];
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => /content|games\/|courses\/algebra/.test(f));
const ctx = loadScripts(files);
const unit = get(ctx, 'COURSE_ALGEBRA').units.find(u => u.world === 'conjuntos'), GAMES = get(ctx, 'GAMES');
const boss = unit.boss, ex = boss.ex[0], P = ex.params;
const Z = { a: [1, 2], ab: [4], b: [3, 6], out: [5] };

test('jefe-venn: conjuntos de un reparto, conjunto pedido y forma de escribirlo', () => {
  const s = g.setsOf(Z);
  assert.equal(s.A.join(), '1,2,4');
  assert.equal(s.B.join(), '3,4,6');
  assert.equal(s.U.join(), '1,2,3,4,5,6');
  assert.equal(g.wantOf({ pick: (x, a, b) => a && !b }, Z).join(), '1,2');
  assert.equal(g.wantOf({ pick: x => x > 9 }, Z).length, 0);
  assert.equal(g.fmtSet([4, 1]), '{1, 4}');
  assert.equal(g.fmtSet([]), '∅');
});

test('jefe-venn: al juzgar dice qué sobra, pero no cuál falta; el vacío se responde sin elegir', () => {
  const o = { pick: (x, a) => a, yes: 'bien' };
  assert.equal(g.judgePick(o, Z, [4, 2, 1]).ok, true);
  const extra = g.judgePick(o, Z, [1, 2, 4, 5]);
  assert.equal(extra.ok, false);
  assert.match(extra.msg, /5/);
  const short = g.judgePick(o, Z, [1, 2]);
  assert.equal(short.ok, false);
  assert.ok(!/4/.test(short.msg), 'no dice cuál falta');
  assert.equal(g.judgePick(o, Z, []).ok, false);
  const none = { pick: () => false };
  assert.equal(g.judgePick(none, Z, []).ok, true);
  assert.equal(g.judgePick(none, Z, [1]).ok, false);
  const sub = { check: (A, B) => A.every(x => B.includes(x)), no: 'falta' };
  assert.equal(g.judgeMove(sub, Z).ok, false);
  assert.equal(g.judgeMove(sub, { a: [], ab: [1, 2, 4], b: [3, 6], out: [5] }).ok, true);
});

test('jefe-venn: si un conjunto quedó vacío, el aviso lo dice (no repite una condición que ya se cumple)', () => {
  const o = P.rounds[1].orders[0], empty = { a: [1, 2], ab: [], b: [], out: [3, 4, 5, 6] };
  assert.equal(g.judgeMove(o, empty).ok, false);
  assert.match(g.judgeMove(o, empty).msg, /vacío/);
  assert.match(g.judgeMove(o, P.rounds[1].zones).msg, /comparten/);
  assert.ok(P.rounds.flatMap(r => r.orders).every(q => !q.say.includes('|')), 'la notación usa «:», como en la lección');
});

test('jefe-venn: zona del diagrama en la que cae un punto', () => {
  assert.equal(g.zoneAt(0, 0, 150, 82), 'ab');
  assert.equal(g.zoneAt(-78, 0, 150, 82), 'a');
  assert.equal(g.zoneAt(78, 0, 150, 82), 'b');
  assert.equal(g.zoneAt(-136, -64, 150, 82), 'out');
  assert.equal(g.zoneAt(0, 120, 150, 82), null, 'fuera del universo no cuenta');
});

test('la Pradera de Venn tiene jefe final: nodo propio, con juego, pista y explicación; no es una lección', () => {
  assert.equal(unit.lessons.length, 3, 'las lecciones no cambian');
  assert.ok(boss.id && boss.title.length > 5 && boss.clip.scenes.length >= 1);
  assert.equal(boss.ex.length, 1);
  assert.equal(ex.game, 'jefe-venn');
  assert.ok(GAMES['jefe-venn']);
  assert.ok(ex.hint.length > 40 && ex.explain.length > 40);
  assert.ok(!unit.lessons.some(l => l.id === boss.id));
  const none = { done: P.rounds.map(() => 0) }, full = { done: P.rounds.map(r => r.orders.length) };
  assert.equal(g.grade(none, P).ok, false);
  assert.equal(g.grade(full, P).ok, true);
  full.done[1]--;
  assert.equal(g.grade(full, P).ok, false);
  assert.ok(g.grade(none, P).solution.length > 40);
});

test('jefe-venn (contenido): tres fases, una por lección; cada orden tiene respuesta y no viene ya resuelta', () => {
  assert.equal(P.rounds.length, 3);
  assert.ok(P.rounds.some(r => r.mode === 'move') && P.rounds.some(r => r.mode === 'pick'));
  let empties = 0;
  for (const r of P.rounds) {
    const all = ['a', 'ab', 'b', 'out'].flatMap(k => r.zones[k]);
    assert.ok(all.length <= 6 && new Set(all).size === all.length, `${r.title}: a lo sumo seis elementos distintos`);
    assert.ok(r.orders.length >= 3);
    for (const o of r.orders) {
      assert.ok(o.say.length > 2 && o.yes.length > 8, o.say);
      if (r.mode === 'pick') {
        const want = g.wantOf(o, r.zones);
        if (!want.length) empties++;
        assert.ok(want.length < all.length, `${o.say}: no es todo el universo`);
        assert.equal(g.judgePick(o, r.zones, want).ok, true);
      } else {
        assert.equal(g.judgeMove(o, r.zones).ok, false, `${o.say}: no viene resuelta`);
        assert.equal(g.judgeMove(o, o.sample).ok, true, `${o.say}: el ejemplo cumple`);
        const sample = ['a', 'ab', 'b', 'out'].flatMap(k => o.sample[k]);
        assert.equal([...sample].sort().join(), [...all].sort().join(), `${o.say}: el ejemplo usa los mismos elementos`);
        assert.ok(['a', 'ab', 'b', 'out'].every(k => o.sample[k].length <= 6), `${o.say}: caben en cada zona`);
        const { A, B, U } = g.setsOf(r.zones), no = typeof o.no === 'function' ? o.no(A, B, U) : o.no;
        assert.ok(no.length > 10);
        assert.equal(g.judgeMove(o, r.zones).msg, no);
      }
    }
  }
  assert.ok(empties >= 1, 'alguna orden se responde con el conjunto vacío');
  const picks = P.rounds.filter(r => r.mode === 'pick').flatMap(r => r.orders.map(o => g.wantOf(o, r.zones).join()));
  assert.ok(new Set(picks).size >= picks.length - 1, 'las respuestas no se repiten');
});

test('el camino del mundo dibuja el nodo del jefe y lo abre con su propia hoja', () => {
  const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  assert.match(app, /data-boss/);
  assert.match(app, /function openBossSheet/);
  assert.match(app, /bossUnlocked = u => S\.unlockAll \|\| u\.lessons\.every\(isDone\)/);
  assert.match(fs.readFileSync(path.join(ROOT, 'js/ui.js'), 'utf8'), /crown:/);
  assert.match(fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8'), /\.node\.boss/);
});
