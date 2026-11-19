// La urna (Preuniversitario, pu-pb-1; spec 2026-11-18-preuda-razonamiento-completo): en una urna hay bolas de otros colores y se
// echan bolas del color pedido arrastrándolas desde la bandeja (o se sacan arrastrándolas afuera). El juego escribe en vivo
// P(color) = favorables / posibles; hay que lograr la probabilidad pedida.
// params = { rounds: [{ color, others: [[color, cantidad]], target: [num, den] }] }   state = { rounds: [{ k }] }   (bolas del color pedido)
GAMES['urna-fraccion'] = (() => {
  const tot = r => r.others.reduce((a, o) => a + o[1], 0);
  const need = r => { for (let k = 0; k <= 20; k++) if (k * r.target[1] === r.target[0] * (k + tot(r))) return k; return null; };
  const ok = (s, r) => s.k * r.target[1] === r.target[0] * (s.k + tot(r));
  const NAME = { coral: 'rojas', sky: 'azules', mint: 'verdes', sun: 'amarillas', brand: 'moradas' };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ k: 0 }),
    answered: s => s.k > 0,
    ok,
    solution: r => `${need(r)} ${NAME[r.color]}`,
    prompt: r => `Echa bolas ${NAME[r.color]} hasta que $P = \\tfrac{${r.target[0]}}{${r.target[1]}}$`,
    foot: () => 'Arrastra bolas a la urna (o sácalas)',
    layout(G) { G.urn = { x: G.W / 2 - 90, y: 110, w: 180, h: 170 }; G.tray = { x: G.W / 2, y: G.H - 110 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { k: need(r) } : G.s, good = ok(s, r), u = G.urn;
      p.stroke(C.ink); p.strokeWeight(2); p.fill(RK.al(p, C.card, 160)); p.rect(u.x, u.y, u.w, u.h, 8, 8, 40, 40);
      const balls = [...Array(s.k).fill(r.color), ...r.others.flatMap(([c, n]) => Array(n).fill(c))], per = 6, d = 24;
      G.mine = [];
      balls.forEach((c, i) => { const x = u.x + 18 + (i % per) * 28, y = u.y + u.h - 20 - Math.floor(i / per) * 26; p.stroke(C.ink); p.strokeWeight(1); p.fill(C[c]); p.circle(x, y, d); if (i < s.k) G.mine.push({ x, y }); });
      p.stroke(C.ink); p.strokeWeight(1); p.fill(C[r.color]); p.circle(G.tray.x, G.tray.y, 30);
      TK.label(p, C, 'toma de aquí', G.tray.x, G.tray.y + 26, C.mute, 9, 100);
      if (G.drag) { p.fill(C[r.color]); p.circle(G.drag.x, G.drag.y, 26); }
      const n = s.k + tot(r), g = gcd(s.k, n) || 1;
      RK.strip(p, C, G.fb, `$P = \\tfrac{${s.k}}{${n}}${s.k && g > 1 ? ` = \\tfrac{${s.k / g}}{${n / g}}` : ''}$`, { kicker: good ? 'probabilidad lograda' : 'favorables / posibles', col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) {
      if (Math.hypot(x - G.tray.x, y - G.tray.y) < 24) { G.drag = { x, y, from: 'tray' }; return true; }
      const m = (G.mine || []).find(q => Math.hypot(x - q.x, y - q.y) < 14); if (m) { G.drag = { x, y, from: 'urn' }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      if (!G.drag) return; const u = G.urn, inU = x > u.x && x < u.x + u.w && y > u.y && y < u.y + u.h;
      if (G.drag.from === 'tray' && inU && G.s.k < 20) { G.s.k++; G.touch(); }
      if (G.drag.from === 'urn' && !inU && G.s.k > 0) { G.s.k--; G.touch(); }
      G.drag = null;
    },
    demo: G => ({ from: G.tray, to: { x: G.urn.x + G.urn.w / 2, y: G.urn.y + 60 }, text: 'Arrastra a la urna', ty: G.tray.y - 30 }),
    peek: G => ({ tray: G.tray, urn: G.urn }),
  });
  return Object.assign(game, { answer: r => ({ k: need(r) }) });
})();
