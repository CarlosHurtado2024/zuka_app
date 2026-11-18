// Los cuadrados de Pitágoras (Preuniversitario UdeA, pu-ge-2; spec 2026-11-18-preuda-geometria): un triángulo
// rectángulo en una cuadrícula con sus catetos sueltos (se arrastran sus puntas, de 1 en 1). Sobre cada cateto crece
// su cuadrado entero (con sus casillas), y abajo una tira junta las casillas de los dos: esa es el área del cuadrado de la hipotenusa. Hay que
// lograr que esa área sea la pedida (25 → la hipotenusa mide 5). Así aparecen las ternas 3-4-5, 6-8-10 y 5-12-13.
// params = { rounds: [{ c2 }], max? }   state = { rounds: [{ a, b }] }   (a: cateto horizontal; b: vertical)
GAMES['cuadrados-pitagoras'] = (() => {
  const root = n => (Number.isInteger(Math.sqrt(n)) ? String(Math.sqrt(n)) : `√${n}`);
  const game = roundsGame({
    aspect: 1.42,
    init: () => ({ a: 2, b: 1 }),
    ok: (s, r) => s.a * s.a + s.b * s.b === r.c2,
    solution: (r, P) => { const m = game.size(r, P); for (let a = 1; a <= m; a++) for (let b = a; b <= m; b++) if (a * a + b * b === r.c2) return `${a}² + ${b}² = ${r.c2}: catetos ${a} y ${b}, hipotenusa ${root(r.c2)}`; return ''; },
    prompt: r => `Arma un triángulo rectángulo con hipotenusa ${root(r.c2)}`,
    foot: (r, s) => (s.a * s.a + s.b * s.b === r.c2 ? 'El cuadrado de la hipotenusa es la suma de los otros dos' : `El cuadrado de la hipotenusa debe tener ${r.c2} casillas`),
    // La cuadrícula se ajusta a la ronda: el triángulo va arriba a la derecha del ángulo recto y cada cuadrado crece
    // entero hacia afuera (el del cateto horizontal hacia abajo, el del vertical hacia la izquierda).
    layout(G) { G.oxy = () => { const m = game.size(G.r, G.params), top = 104, bot = G.H - 84, u = Math.min((G.W - 24) / (2 * m), (bot - top) / (2 * m)); return { m, u, ox: G.W / 2, oy: top + m * u + (bot - top - 2 * m * u) / 2 }; }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r, s } = G, { m, u, ox, oy } = G.oxy(), c2 = s.a * s.a + s.b * s.b, ok = c2 === r.c2;
      G.u = u; G.ox = ox; G.oy = oy; G.m = m;
      // Cuadrícula tenue en la zona del triángulo.
      p.stroke(C.line); p.strokeWeight(1); for (let i = 0; i <= m; i++) { p.line(ox + i * u, oy, ox + i * u, oy - m * u); p.line(ox, oy - i * u, ox + m * u, oy - i * u); }
      // Los dos cuadrados, con sus casillas.
      const sq = (x, y, n, col, txt) => {
        const c = p.color(col); c.setAlpha(110); p.noStroke(); p.fill(c); p.rect(x, y, n * u, n * u);
        p.stroke(col); p.strokeWeight(1); for (let i = 0; i <= n; i++) { p.line(x + i * u, y, x + i * u, y + n * u); p.line(x, y + i * u, x + n * u, y + i * u); }
        p.strokeWeight(2.5); p.noFill(); p.rect(x, y, n * u, n * u);
        if (n * u >= 34) TK.label(p, C, txt, x + n * u / 2, y + n * u / 2, C.ink, 13, n * u - 4);
      };
      sq(ox, oy, s.a, C.sky, `${s.a * s.a}`); sq(ox - s.b * u, oy - s.b * u, s.b, C.coral, `${s.b * s.b}`);
      // El triángulo.
      const col = G.locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.ink, t = p.color(C.sun); t.setAlpha(70);
      p.fill(t); p.stroke(col); p.strokeWeight(3); p.triangle(ox, oy, ox + s.a * u, oy, ox, oy - s.b * u);
      p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.rect(ox, oy - 8, 8, 8);
      TK.label(p, C, ok ? root(c2) : `√${c2}`, ox + s.a * u / 2 + 22, oy - s.b * u / 2 - 14, ok ? C.ok : C.N, 14, 70);
      G.ka = { x: ox + s.a * u, y: oy }; G.kb = { x: ox, y: oy - s.b * u };
      GEO.knob(p, C, G.ka.x, G.ka.y, C.sky); GEO.knob(p, C, G.kb.x, G.kb.y, C.coral);
      // La tira: las casillas de los dos cuadrados, juntas, frente a las que se piden.
      const y = G.H - 64, w = G.W - 40, k = w / Math.max(r.c2, c2, 1);
      p.noStroke(); p.fill(C.sky); p.rect(20, y, s.a * s.a * k, 16, 3); p.fill(C.coral); p.rect(20 + s.a * s.a * k, y, s.b * s.b * k, 16, 3);
      p.noFill(); p.stroke(ok ? C.ok : C.ink); p.strokeWeight(2); p.rect(20, y - 3, r.c2 * k, 22, 4);
      TK.label(p, C, `${s.a}² + ${s.b}² = ${s.a * s.a} + ${s.b * s.b} = ${c2}`, G.W / 2, y + 32, ok ? C.ok : C.mute, 13, w);
    },
    press(G, x, y) { const near = k => Math.hypot(x - k.x, y - k.y) < 26; G.grab = near(G.ka) ? 'a' : near(G.kb) ? 'b' : null; return !!G.grab; },
    drag(G, x, y) {
      if (!G.grab) return false;
      const m = G.m, v = Math.max(1, Math.min(m, Math.round(G.grab === 'a' ? (x - G.ox) / G.u : (G.oy - y) / G.u)));
      if (v !== G.s[G.grab]) { G.s[G.grab] = v; G.touch(); }
      return true;
    },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.ka.x, y: G.ka.y }, to: { x: G.ka.x + 3 * G.u, y: G.ka.y }, text: 'Arrastra las puntas de los catetos', ty: 106 }),
    peek: G => ({ ka: G.ka, kb: G.kb, u: G.u }),
  });
  // Lado de la cuadrícula de una ronda: lo justo para que quepan sus catetos (y uno más, para pasarse).
  game.size = (r, P) => Math.min(P.max || 12, Math.ceil(Math.sqrt(r.c2)) + 1);
  return game;
})();
