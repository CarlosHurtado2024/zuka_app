// La rueda de César (Preuniversitario, pu-cd-1 y pu-cd-2; spec 2026-11-18-preuda-razonamiento-completo): dos anillos con el
// alfabeto sin Ñ. El de afuera es la letra original; el de adentro, la cifrada. Se gira el anillo de adentro hasta que la pista
// se cumpla (una letra y su cifrada, o una palabra y su cifrada) y entonces el mensaje secreto se lee solo, descifrado.
// params = { rounds: [{ pair: [original, cifrada], msg: mensaje cifrado }] }   state = { rounds: [{ k }] }   (k de 0 a 25)
GAMES['rueda-cesar'] = (() => {
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', idx = c => ABC.indexOf(c);
  const shift = r => (idx(r.pair[1][0]) - idx(r.pair[0][0]) + 26) % 26;
  const enc = (w, k) => [...w].map(c => (idx(c) < 0 ? c : ABC[(idx(c) + k) % 26])).join('');
  const dec = (w, k) => enc(w, (26 - k) % 26);
  const ok = (s, r) => s.k === shift(r);
  const game = roundsGame({
    aspect: 1.35,
    init: r => ({ k: shift(r) === 0 ? 1 : 0 }),
    ok,
    solution: r => `clave +${shift(r)}: ${r.msg} dice ${dec(r.msg, shift(r))}`,
    prompt: r => `Si ${r.pair[0]} se cifra ${r.pair[1]}, ¿qué dice ${r.msg}?`,
    foot: () => 'Gira el anillo de adentro',
    layout(G) { G.R = Math.min(G.W * 0.42, 150); G.c = { x: G.W / 2, y: 100 + G.R }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { k: shift(r) } : G.s, good = ok(s, r), c = G.c, R = G.R, step = 2 * Math.PI / 26;
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.circle(c.x, c.y, 2 * R);
      p.fill(RK.al(p, C.sky, 40)); p.circle(c.x, c.y, 2 * R * 0.72);
      const hot = new Set([...r.pair[0]].map(idx));
      for (let i = 0; i < 26; i++) {
        const a = -Math.PI / 2 + i * step;
        TK.label(p, C, ABC[i], c.x + R * 0.86 * Math.cos(a), c.y + R * 0.86 * Math.sin(a), hot.has(i) ? C.brand : C.ink, 11, 14);
        TK.label(p, C, ABC[(i + s.k) % 26], c.x + R * 0.6 * Math.cos(a), c.y + R * 0.6 * Math.sin(a), hot.has(i) ? C.coral : C.mute, 10, 14);
      }
      const a0 = -Math.PI / 2; p.stroke(C.brand); p.strokeWeight(2); p.line(c.x + R * 0.68 * Math.cos(a0), c.y + R * 0.68 * Math.sin(a0), c.x + R * 0.78 * Math.cos(a0), c.y + R * 0.78 * Math.sin(a0));
      const now = enc(r.pair[0], s.k), match = now === r.pair[1];
      TK.label(p, C, `${r.pair[0]} → ${now}`, c.x, c.y - 12, match ? C.ok : C.ink, 13, R);
      TK.label(p, C, `clave +${s.k}`, c.x, c.y + 12, C.mute, 10, R);
      RK.strip(p, C, G.fb, `$\\text{${r.msg} → ${dec(r.msg, s.k)}}$`, { kicker: good ? 'mensaje descifrado' : 'el mensaje con esta clave', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const d = Math.hypot(x - G.c.x, y - G.c.y); if (d > G.R + 10) return false; G.grab = true; G.prevA = Math.atan2(y - G.c.y, x - G.c.x); G.acc = 0; return true; },
    drag(G, x, y) {
      if (!G.grab) return false;
      const a = Math.atan2(y - G.c.y, x - G.c.x); let d = a - G.prevA; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; G.prevA = a;
      G.acc += d / (2 * Math.PI / 26); const st = Math.trunc(G.acc);
      if (st) { G.acc -= st; G.s.k = ((G.s.k - st) % 26 + 26) % 26; G.touch(); }
      return true;
    },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.c.x + G.R * 0.6, y: G.c.y }, to: { x: G.c.x, y: G.c.y + G.R * 0.6 }, text: 'Gira el anillo', ty: G.c.y + G.R + 18 }),
    peek: G => ({ c: G.c, R: G.R }),
  });
  return Object.assign(game, { answer: r => ({ k: shift(r) }) });
})();
