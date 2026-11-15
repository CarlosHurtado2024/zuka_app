// Llena el estanque (Álgebra, suma de fracciones algebraicas; juego dinámico de alg-25b; spec
// 2026-11-21-dinamicos-mundos-altos): como Ana y Beto en el video, dos llaves llenan un estanque; una sola tarda p
// horas y la otra q. Para sumar lo que llenan por hora (1/p y 1/q) hace falta un denominador común: se parte el
// estanque en n partes iguales con − y +. Si n sirve para las dos llaves, «+ 1 hora» echa lo de las dos juntas. Cuando
// el estanque queda lleno justo, «Listo»: las horas que pasaron son la respuesta. Con un n que no sirve, o si se
// rebosa, se pierde una vida.
// params = { rounds: [{ title, items: [{ p, q }] }], lives? }   state = { done: [n] }

GAMES['llena-estanque'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a), lcm = (a, b) => (a * b) / gcd(a, b);
  const hoursOf = it => { const n = lcm(it.p, it.q); return n / (n / it.p + n / it.q); };
  const fits = (it, n) => n % it.p === 0 && n % it.q === 0;
  return questGame({
    aspect: 1.3,
    init: it => ({ n: Math.min(it.p, it.q), h: 0, fill: 0, end: false }),
    ok: (s, it) => !!s.end && fits(it, s.n) && s.fill === s.n && s.h === hoursOf(it),
    answer: it => ({ n: lcm(it.p, it.q), h: hoursOf(it), fill: lcm(it.p, it.q), end: true }),
    solution: it => `$\\frac{1}{${it.p}} + \\frac{1}{${it.q}} = \\frac{${lcm(it.p, it.q) / it.p + lcm(it.p, it.q) / it.q}}{${lcm(it.p, it.q)}}$ por hora: juntas tardan ${hoursOf(it)} horas`,
    prompt: it => `Una llave tarda ${it.p} horas y la otra ${it.q}. ¿Y juntas?`,
    foot: () => 'Elige en cuántas partes medir el estanque y deja pasar las horas',
    retry: G => { G.s.h = 0; G.s.fill = 0; },
    layout(G) {
      const y = G.bottom - 42, w = (G.W - 36 - 150) / 2;
      G.box = { x: 12, y, w: 150, h: 34 }; G.btn = [{ x: 170, y: y - 2, w, h: 38 }, { x: 178 + w, y: y - 2, w, h: 38 }];
      G.tank = { x: 26, y: G.top + 8, w: 92, h: y - G.top - 40 };
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, t = G.tank, ok = fits(it, s.n), ph = t.h / s.n;
      p.noStroke(); p.fill(G.solved ? C.ok : C.sky); p.rect(t.x, t.y + t.h - Math.min(s.n, s.fill) * ph, t.w, Math.min(s.n, s.fill) * ph);
      p.stroke(C.line); p.strokeWeight(1); for (let i = 1; i < s.n; i++) p.line(t.x, t.y + i * ph, t.x + t.w, t.y + i * ph);
      p.noFill(); p.stroke(C.ink); p.strokeWeight(3); p.line(t.x, t.y, t.x, t.y + t.h); p.line(t.x, t.y + t.h, t.x + t.w, t.y + t.h); p.line(t.x + t.w, t.y + t.h, t.x + t.w, t.y);
      const lx = t.x + t.w + 14, lw = W - lx - 10, row = (txt, y, col) => { p.noStroke(); p.fill(col); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER); fitText(p, txt, lx, y, lw, 13, 30); };
      row(`Estanque en ${s.n} partes`, t.y + 12, C.ink);
      // Lo que llena cada llave en partes del estanque solo se ve después de dejar pasar una hora: así no se
      // encuentra el denominador común subiendo n hasta que el renglón cambie.
      const seen = ok && s.h > 0;
      row(seen ? `Llave 1: $\\frac{${s.n / it.p}}{${s.n}}$ por hora` : `Llave 1: $\\frac{1}{${it.p}}$ por hora`, t.y + 46, seen ? C.Z : C.mute);
      row(seen ? `Llave 2: $\\frac{${s.n / it.q}}{${s.n}}$ por hora` : `Llave 2: $\\frac{1}{${it.q}}$ por hora`, t.y + 84, seen ? C.Z : C.mute);
      row(`Horas: ${s.h}`, t.y + 122, C.ink);
      row(G.solved ? `Juntas: ${s.h} horas` : `Lleno: $\\frac{${s.fill}}{${s.n}}$`, t.y + 152, G.solved ? C.ok : C.N);
      drawStepper(p, C, G.box, s.n, 'partes', C.Z);
      drawBtn(p, C, G.btn[0], '+ 1 hora', false, C.cream); drawBtn(p, C, G.btn[1], 'Listo', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, d = stepHit(G.box, x, y);
      if (d) { s.n = Math.max(2, Math.min(30, s.n + d)); s.h = 0; s.fill = 0; G.api.sfx?.tap?.(); return true; }
      if (hitBox(G.btn[0], x, y)) {
        if (!fits(it, s.n)) { G.bad(`Con ${s.n} partes no se puede medir lo que llena cada llave en una hora`); return true; }
        if (s.fill >= s.n) { G.bad('Ya está lleno: una hora más y se rebosa'); return true; }
        s.h++; s.fill += s.n / it.p + s.n / it.q; G.api.sfx?.tap?.();
        if (s.fill > s.n) G.bad('Se rebosó: sobraba menos de una hora');
        return true;
      }
      if (hitBox(G.btn[1], x, y)) { s.end = true; if (!G.submit(s.fill < s.n ? 'Todavía no está lleno' : 'Revisa las partes del estanque')) s.end = false; return true; }
      return false;
    },
    peek: G => { const it = G.item, s = G.s, n = lcm(it.p, it.q), b = G.box, plus = { x: b.x + b.w - 40, y: b.y, w: 40, h: b.h }, minus = { x: b.x, y: b.y, w: 40, h: b.h }; const steps = s.n === n ? [] : Array(Math.abs(n - s.n)).fill(n > s.n ? plus : minus); return { solve: [...steps, ...Array(hoursOf(it) - (s.n === n ? s.h : 0)).fill(G.btn[0]), G.btn[1]], wrong: G.btn[1] }; },
  });
})();
