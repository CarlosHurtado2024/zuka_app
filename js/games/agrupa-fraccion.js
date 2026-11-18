// Agrupa la barra (Álgebra, alg-11b; spec 2026-11-18-algebra-revision): simplificar es agrupar partes. Una barra partida
// en `den` partes iguales con `num` pintadas. Se arrastra la manija para juntar las partes de a k: si k no reparte
// justo la barra o corta un pedazo pintado, el grupo sale en rojo. La fracción más simple sale con el grupo más grande
// que sirve (el máximo común divisor).
// params = { rounds: [{ num, den }] }   state = { rounds: [{ k }] }
GAMES['agrupa-fraccion'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const fits = (k, r) => r.den % k === 0 && r.num % k === 0;
  const game = roundsGame({
    aspect: 0.95,
    init: () => ({ k: 1 }),
    ok: (s, r) => s.k === gcd(r.num, r.den),
    solution: r => { const g = gcd(r.num, r.den); return `de a ${g}: ${r.num}/${r.den} = ${r.num / g}/${r.den / g}`; },
    prompt: r => `Simplifica $\\tfrac{${r.num}}{${r.den}}$ agrupando partes`,
    foot: (r, s) => (fits(s.k, r) ? 'Busca el grupo más grande que sirva' : `De a ${s.k} no sirve: algún grupo queda cortado`),
    layout(G) { G.bar = { x: 16, y: G.H * 0.36, w: G.W - 32, h: 54 }; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r, bar } = G, g = gcd(r.num, r.den), k = G.locked && G.s.k !== g ? g : G.s.k, u = bar.w / r.den, good = fits(k, r);
      for (let i = 0; i < r.den; i++) {
        const on = i < r.num;
        p.stroke(C.line); p.strokeWeight(1); p.fill(on ? C.sky : C.card); p.rect(bar.x + i * u, bar.y, u, bar.h);
      }
      // Los grupos de a k, con su borde grueso.
      for (let j = 0; j * k < r.den; j++) {
        const x = bar.x + j * k * u, w = Math.min(k, r.den - j * k) * u, cut = (j * k < r.num && (j + 1) * k > r.num) || w < k * u - 0.5;
        p.noFill(); p.stroke(G.locked ? C.ok : cut ? C.bad : C.ink); p.strokeWeight(3); p.rect(x + 1.5, bar.y - 6, w - 3, bar.h + 12, 6);
      }
      const hx = bar.x + k * u;
      RK.knob(p, C, hx, bar.y + bar.h + 30, good ? C.brand : C.bad);
      TK.label(p, C, `de a ${k}`, hx, bar.y + bar.h + 54, C.mute, 11, 60);
      G.hx = hx;
      const tex = good ? `$\\tfrac{${r.num}}{${r.den}} = \\tfrac{${r.num / k}}{${r.den / k}}$` : `$\\text{de a } ${k}\\text{: no se puede}$`;
      RK.strip(p, C, G.fb, tex, { kicker: good ? `Grupos de ${k} partes` : 'Algún grupo queda cortado', col: G.locked ? C.ok : good ? C.mint : C.bad, size: 20 });
    },
    press(G, x, y) { if (Math.abs(y - (G.bar.y + G.bar.h + 30)) > 30 && !(y > G.bar.y && y < G.bar.y + G.bar.h)) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.hx, y: G.bar.y + G.bar.h + 30 }, to: { x: G.hx + 2 * G.bar.w / G.r.den, y: G.bar.y + G.bar.h + 30 }, text: 'Arrastra para agrupar', ty: G.bar.y - 26 }),
    peek: G => ({ bar: G.bar }),
  });
  game.move = (G, x) => { const r = G.r, k = Math.max(1, Math.min(r.den, Math.round((x - G.bar.x) / (G.bar.w / r.den)))); if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { gcd });
})();
