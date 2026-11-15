// Los lirios de la laguna (Álgebra, función exponencial; juego dinámico de alg-71; spec
// 2026-11-21-dinamicos-mundos-altos): como en el video, los lirios se duplican cada día y un día dado cubren toda la
// laguna. La pregunta va hacia atrás: ¿qué día estaba medio llena, o a la cuarta parte, o con tantos lirios? Con
// «◀ día» y «día ▶» se mueve el calendario y la laguna se dibuja como estaba ese día; con «Este día» se responde.
// La sorpresa del video: la mitad no está a medio camino, sino un solo día antes.
// params = { rounds: [{ title, items: [{ full, ask: 'half' | 'quarter' | 'eighth' | número de lirios }] }], lives? }
// state = { done: [n] }      (el día `full` hay 2^full lirios y la laguna está llena)

GAMES['lirios-laguna'] = (() => {
  const back = { half: 1, quarter: 2, eighth: 3 };
  const dayOf = it => (typeof it.ask === 'number' ? Math.round(Math.log2(it.ask)) : it.full - back[it.ask]);
  const askTxt = it => (typeof it.ask === 'number' ? `tenía ${it.ask} lirios` : it.ask === 'half' ? 'estaba medio llena' : it.ask === 'quarter' ? 'estaba a la cuarta parte' : 'estaba a la octava parte');
  return questGame({
    aspect: 1.3,
    init: it => ({ day: it.full }),
    ok: (s, it) => s.day === dayOf(it),
    answer: it => ({ day: dayOf(it) }),
    solution: it => `Llena el día ${it.full}: ${askTxt(it)} el día ${dayOf(it)}`,
    prompt: it => `Se llena el día ${it.full}. ¿Qué día ${askTxt(it)}?`,
    foot: () => 'Cada día hacia atrás hay la mitad de lirios',
    no: (it, s) => (s.day < dayOf(it) ? 'Ese día había menos lirios' : 'Ese día había más lirios'),
    layout(G) {
      const w = (G.W - 24 - 2 * 8) / 3, y = G.bottom - 42; G.btn = [0, 1, 2].map(i => ({ x: 12 + i * (w + 8), y, w, h: 36 }));
      const side = Math.min(G.W - 60, y - G.top - 44); G.pond = { x: G.W / 2 - side / 2, y: G.top + 8, s: side };
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, q = G.pond, cells = 64 * 2 ** (s.day - it.full), n = 8, cs = q.s / n;
      p.noStroke(); p.fill(shade(C.sky, 0.55)); p.rect(q.x, q.y, q.s, q.s, 14);
      // 64 casillas: se llenan por columnas (así la mitad y la cuarta parte se ven de un vistazo).
      for (let i = 0; i < 64; i++) {
        const c = Math.floor(i / n), r = i % n, f = Math.max(0, Math.min(1, cells - i));
        if (f <= 0) break;
        p.fill(G.solved ? C.ok : C.mint); p.circle(q.x + c * cs + cs / 2, q.y + r * cs + cs / 2, (cs - 4) * Math.sqrt(f));
      }
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, `Día ${s.day}`, W / 2, q.y + q.s + 14, W - 20, 16);
      drawBtn(p, C, G.btn[0], '◀ día', false, C.cream); drawBtn(p, C, G.btn[1], 'día ▶', false, C.cream); drawBtn(p, C, G.btn[2], 'Este día', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      if (i === 2) { G.submit(); return true; }
      s.day = Math.max(0, Math.min(it.full, s.day + (i ? 1 : -1))); G.api.sfx?.tap?.();
      return true;
    },
    peek: G => { const n = dayOf(G.item) - G.s.day; return { solve: [...Array(Math.abs(n)).fill(G.btn[n > 0 ? 1 : 0]), G.btn[2]], wrong: n ? G.btn[2] : null }; },
  });
})();
