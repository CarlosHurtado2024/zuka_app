// Criptoaritmética (Preuniversitario, pu-ar-3; spec 2026-11-18-preuda-razonamiento-completo): cada letra es una cifra y letras
// distintas son cifras distintas. Cada letra tiene su rueda (se arrastra arriba o abajo para cambiar la cifra); la cuenta se
// reescribe en vivo con las cifras puestas y dice si se cumple. Un número no puede empezar en 0.
// params = { rounds: [{ letters: 'AB', show: 'AB + BA = 121', f(v) → bool, lead: 'A' }] }   (v: { letra: cifra })   state = { rounds: [{ d: [cifra por letra] }] }
GAMES['cripto-letras'] = (() => {
  const val = (r, d) => Object.fromEntries([...r.letters].map((l, i) => [l, d[i]]));
  const valid = (r, d) => new Set(d).size === d.length && [...(r.lead || '')].every(l => val(r, d)[l] !== 0) && !!r.f(val(r, d));
  const sols = r => { const n = r.letters.length, out = []; const rec = (d) => { if (d.length === n) { if (valid(r, d)) out.push(d.slice()); return; } for (let k = 0; k <= 9; k++) if (!d.includes(k)) { d.push(k); rec(d); d.pop(); } }; rec([]); return out; };
  const ok = (s, r) => valid(r, s.d);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ d: [...r.letters].map((_, i) => (i + 1) % 10) }),
    ok,
    solution: r => { const d = sols(r)[0]; return [...r.letters].map((l, i) => `${l} = ${d[i]}`).join(', '); },
    prompt: r => `Cada letra es una cifra distinta: ${r.show}`,
    foot: () => 'Arrastra cada rueda arriba o abajo',
    layout(G) { G.wy = 230; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { d: sols(r)[0] } : G.s, good = ok(s, r), v = val(r, s.d), n = r.letters.length, w = Math.min(70, (G.W - 30) / n);
      const shown = [...r.show].map(ch => (ch in v ? v[ch] : ch)).join('');
      TK.label(p, C, r.show, G.W / 2, 104, C.mute, 15, G.W - 30);
      TK.label(p, C, shown, G.W / 2, 140, good ? C.ok : C.ink, 22, G.W - 30);
      const dup = s.d.filter((x, i) => s.d.indexOf(x) !== i);
      G.wheels = [...r.letters].map((l, i) => {
        const x = (G.W - n * w) / 2 + (i + 0.5) * w, y = G.wy, bad = dup.includes(s.d[i]) || ((r.lead || '').includes(l) && s.d[i] === 0);
        p.stroke(bad ? C.bad : C.line); p.strokeWeight(bad ? 2 : 1); p.fill(RK.al(p, C.card, 220)); p.rect(x - w * 0.36, y - 46, w * 0.72, 92, 10);
        TK.label(p, C, String((s.d[i] + 9) % 10), x, y - 28, C.mute, 11, w * 0.6);
        TK.label(p, C, String(s.d[i]), x, y, C.ink, 22, w * 0.6);
        TK.label(p, C, String((s.d[i] + 1) % 10), x, y + 28, C.mute, 11, w * 0.6);
        TK.label(p, C, l, x, y - 62, C.brand, 15, w);
        return { x, y, w };
      });
      const eqOk = !!r.f(v);
      RK.strip(p, C, G.fb, good ? '$\\text{se cumple}$' : dup.length ? '$\\text{hay dos letras con la misma cifra}$' : eqOk ? '$\\text{revisa: ¿empieza en 0?}$' : '$\\text{la cuenta no se cumple}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const i = (G.wheels || []).findIndex(q => Math.abs(x - q.x) < q.w * 0.4 && Math.abs(y - q.y) < 52); if (i < 0) return false; G.grab = i; G.y0 = y; G.d0 = G.s.d[i]; return true; },
    drag(G, x, y) { if (G.grab < 0) return false; const d = ((G.d0 + Math.round((G.y0 - y) / 22)) % 10 + 10) % 10; if (d !== G.s.d[G.grab]) { G.s.d[G.grab] = d; G.touch(); } return true; },
    release(G, x, y) { if (G.grab >= 0 && Math.abs(y - G.y0) < 6) { const q = G.wheels[G.grab]; G.s.d[G.grab] = (G.s.d[G.grab] + (y < q.y ? 9 : 1)) % 10; G.touch(); } G.grab = -1; },
    demo: G => { const q = G.wheels?.[0]; return q ? { from: { x: q.x, y: q.y + 20 }, to: { x: q.x, y: q.y - 30 }, text: 'Arrastra la rueda', ty: q.y + 66 } : null; },
    peek: G => ({ wheels: G.wheels }),
  });
  return Object.assign(game, { answer: r => ({ d: sols(r)[0] }), solutions: r => sols(r) });
})();
