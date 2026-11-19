// ¿Quién miente? (Preuniversitario, pu-lo-5; spec 2026-11-18-preuda-razonamiento-completo): cada personaje dice algo. Se toca
// a cada uno para suponer si dice la verdad o miente; el juego revisa cada frase con esa suposición y marca en rojo las que no
// cuadran (un sincero que dice algo falso, o un mentiroso que dice algo verdadero). La suposición buena no choca con nada.
// params = { rounds: [{ people: [{ name, say, f(T) → bool }], cond?(T) → bool, condSay? }] }   (T[i]: true si i dice la verdad)
// state = { rounds: [{ T: [null | true | false] }] }
GAMES['quien-miente'] = (() => {
  const fits = (r, T) => T.every(t => t !== null) && r.people.every((q, i) => !!q.f(T) === T[i]) && (!r.cond || r.cond(T));
  const sols = r => { const n = r.people.length, out = []; for (let m = 0; m < 2 ** n; m++) { const T = Array.from({ length: n }, (_, i) => !!((m >> i) & 1)); if (fits(r, T)) out.push(T); } return out; };
  const ok = (s, r) => fits(r, s.T);
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ T: r.people.map(() => null) }),
    answered: s => s.T.some(t => t !== null),
    ok,
    solution: r => sols(r)[0].map((t, i) => `${r.people[i].name} ${t ? 'dice la verdad' : 'miente'}`).join(', '),
    prompt: r => r.condSay || '¿Quién dice la verdad y quién miente?',
    foot: () => 'Toca a cada uno: verdad o mentira',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { T: sols(r)[0] } : G.s, good = ok(s, r), n = r.people.length, all = s.T.every(t => t !== null), rh = Math.min(72, (G.H - 200) / n);
      G.cards = r.people.map((q, i) => {
        const y = 96 + i * rh, t = s.T[i], said = all ? !!q.f(s.T) : null, clash = all && said !== t;
        p.stroke(clash ? C.bad : C.line); p.strokeWeight(clash ? 2 : 1); p.fill(RK.al(p, C.card, 210)); p.rect(16, y, G.W - 32, rh - 8, 10);
        const bx = 24, bw = 74;
        p.noStroke(); p.fill(t === null ? RK.al(p, C.line, 120) : t ? C.ok : C.coral); p.rect(bx, y + 8, bw, rh - 24, 8);
        TK.label(p, C, q.name, bx + bw / 2, y + 8 + (rh - 24) / 2 - 7, t === null ? C.ink : inkOn(t ? C.ok : C.coral), 12, bw - 6);
        TK.label(p, C, t === null ? '?' : t ? 'verdad' : 'miente', bx + bw / 2, y + 8 + (rh - 24) / 2 + 9, t === null ? C.mute : inkOn(t ? C.ok : C.coral), 9, bw - 6);
        TK.label(p, C, `«${q.say}»`, (bx + bw + G.W - 20) / 2, y + (rh - 8) / 2 - (all ? 7 : 0), C.ink, 11, G.W - bw - 60);
        if (all) TK.label(p, C, `esto sería ${said ? 'verdad' : 'falso'}`, (bx + bw + G.W - 20) / 2, y + (rh - 8) / 2 + 11, clash ? C.bad : C.mute, 9, G.W - bw - 60);
        return { x: 16, y, w: G.W - 32, h: rh - 8, i };
      });
      const condBad = all && r.cond && !r.cond(s.T);
      RK.strip(p, C, G.fb, !all ? '$\\text{supón algo de cada uno}$' : good ? '$\\text{todo cuadra}$' : condBad ? '$\\text{no cumple la condición}$' : '$\\text{hay frases que chocan}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const c = (G.cards || []).find(b => hitBox(b, x, y)); if (!c) return false; const t = G.s.T[c.i]; G.s.T[c.i] = t === null ? true : !t; G.touch(); return true; },
    demo: G => (G.cards ? { from: { x: 60, y: G.cards[0].y + 24 }, to: { x: 60, y: G.cards[0].y + 24 }, text: 'Toca para suponer', ty: G.cards.at(-1).y + G.cards.at(-1).h + 18 } : null),
    peek: G => ({ cards: G.cards }),
  });
  return Object.assign(game, { answer: r => ({ T: sols(r)[0] }), solutions: r => sols(r).map(T => ({ T })) });
})();
