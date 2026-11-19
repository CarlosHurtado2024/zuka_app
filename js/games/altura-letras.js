// Las letras valen su lugar (Preuniversitario, pu-cd-1; spec 2026-11-18-preuda-razonamiento-completo): en el código A = 1,
// B = 2, …, Z = 26 (sin Ñ) cada letra de la palabra es una columna. A la izquierda está la regla del alfabeto; se arrastra cada
// columna hasta la altura de su letra y el juego suma lo que vale la palabra.
// params = { rounds: [{ word }] }   state = { rounds: [{ h: [altura por letra] }] }   (de 1 a 26)
GAMES['altura-letras'] = (() => {
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', pos = c => ABC.indexOf(c) + 1;
  const need = r => [...r.word].map(pos);
  const ok = (s, r) => need(r).every((v, i) => s.h[i] === v);
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ h: need(r).map(v => (v === 1 ? 2 : 1)) }),
    ok,
    solution: r => `${r.word} = ${need(r).join(' + ')} = ${need(r).reduce((a, b) => a + b, 0)}`,
    prompt: r => `¿Cuánto vale ${r.word}? (A = 1, …, Z = 26, sin Ñ)`,
    foot: () => 'Sube cada columna hasta la altura de su letra',
    layout(G) { G.b = { x: 46, y: 96, w: G.W - 62, h: G.H - 230 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { h: need(r) } : G.s, good = ok(s, r), b = G.b, n = r.word.length, w = b.w / n, Y = v => b.y + b.h - v / 26 * b.h;
      G.Y = Y;
      for (let v = 1; v <= 26; v++) {
        const y = Y(v), major = v % 5 === 0 || v === 1;
        p.stroke(RK.al(p, C.line, major ? 160 : 60)); p.strokeWeight(1); p.line(b.x, y, b.x + b.w, y);
        if (major || v === 26) TK.label(p, C, `${ABC[v - 1]} ${v}`, 24, y, C.mute, 8, 40);
      }
      G.cols = [...r.word].map((ch, i) => {
        const v = s.h[i], x = b.x + i * w + w * 0.2, cw = w * 0.6, right = v === pos(ch);
        p.noStroke(); p.fill(right && good ? C.ok : C.sky); p.rect(x, Y(v), cw, b.y + b.h - Y(v), 3);
        TK.label(p, C, ABC[v - 1], x + cw / 2, Y(v) - 10, C.ink, 11, cw);
        TK.label(p, C, ch, x + cw / 2, b.y + b.h + 14, C.brand, 14, cw);
        TK.label(p, C, String(v), x + cw / 2, b.y + b.h + 32, C.mute, 10, cw);
        return { x: x + cw / 2, y: Y(v) };
      });
      const sum = s.h.reduce((a, c) => a + c, 0);
      RK.strip(p, C, G.fb, `$${s.h.join(' + ')} = ${sum}$`, { kicker: good ? `${r.word} vale ${sum}` : 'lo que vale con estas alturas', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const n = G.r.word.length, w = G.b.w / n, i = Math.floor((x - G.b.x) / w); if (i < 0 || i >= n || y < G.b.y - 20 || y > G.b.y + G.b.h + 10) return false; G.grab = i; game.move(G, y); return true; },
    drag(G, x, y) { if (G.grab < 0) return false; game.move(G, y); return true; },
    release(G) { G.grab = -1; },
    demo: G => (G.cols ? { from: G.cols[0], to: { x: G.cols[0].x, y: G.cols[0].y - 60 }, text: 'Sube la columna', ty: G.b.y + 10 } : null),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, y) => { const b = G.b, v = Math.max(1, Math.min(26, Math.round((b.y + b.h - y) / b.h * 26))); if (v !== G.s.h[G.grab] || !G.touched[G.cur]) { G.s.h[G.grab] = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ h: need(r) }) });
})();
