// La regla de cálculo (Álgebra, propiedades de los logaritmos; juego dinámico de alg-72; spec
// 2026-11-21-dinamicos-mundos-altos): dos reglas con las potencias de una base puestas a la misma distancia (cada
// paso es un exponente más). Así se multiplicó durante siglos: sumar distancias es multiplicar números, porque el
// logaritmo de un producto es la suma de los logaritmos. Para a × b se corre la regla de arriba con ◀ ▶ hasta que su 1
// quede sobre a, y se toca en la regla de abajo el número que queda debajo de b. Para dividir se hace al revés.
// params = { rounds: [{ title, items: [{ base, a, b, div?: true }] }], lives? }   (a y b potencias de la base)
// state = { done: [n] }      Las reglas muestran base⁰ … base⁶.

GAMES['regla-de-calculo'] = (() => {
  const lg = (it, v) => Math.round(Math.log(v) / Math.log(it.base));
  // Producto: el 1 de arriba sobre a, y se lee debajo de b. Cociente a ÷ b: b de arriba sobre a, y se lee debajo del 1.
  const shiftOf = it => (it.div ? lg(it, it.a) - lg(it, it.b) : lg(it, it.a));
  const pickOf = it => (it.div ? lg(it, it.a) - lg(it, it.b) : lg(it, it.a) + lg(it, it.b));
  return questGame({
    aspect: 1.15,
    init: () => ({ shift: 0, pick: -1 }),
    ok: (s, it) => s.pick === pickOf(it) && (s.shift === shiftOf(it) || (!it.div && s.shift === lg(it, it.b))),
    answer: it => ({ shift: shiftOf(it), pick: pickOf(it) }),
    solution: it => (it.div ? `$${it.a} \\div ${it.b} = ${it.base ** pickOf(it)}$: exponentes ${lg(it, it.a)} − ${lg(it, it.b)} = ${pickOf(it)}` : `$${it.a} \\times ${it.b} = ${it.base ** pickOf(it)}$: exponentes ${lg(it, it.a)} + ${lg(it, it.b)} = ${pickOf(it)}`),
    prompt: it => (it.div ? `Divide con la regla: $${it.a} \\div ${it.b}$` : `Multiplica con la regla: $${it.a} \\times ${it.b}$`),
    foot: it => (it.div ? `Pon el ${it.b} de arriba sobre el ${it.a} y lee debajo del 1` : `Pon el 1 de arriba sobre un factor y lee debajo del otro`),
    no: (it, s) => (s.shift !== shiftOf(it) && !(!it.div && s.shift === lg(it, it.b)) ? 'La regla de arriba no está en su lugar' : 'Lee el número que queda justo debajo'),
    retry: G => { G.s.pick = -1; },
    layout(G) {
      const y = G.bottom - 42; G.btn = [{ x: 12, y, w: 70, h: 36 }, { x: 90, y, w: 70, h: 36 }];
      const step = (G.W - 40) / 7; G.step = step; G.y0 = G.top + (y - G.top) / 2 - 8;
      G.low = k => ({ x: 20 + k * step, y: G.y0 + 4, w: step, h: 44 });
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, st = G.step, y0 = G.y0;
      p.noStroke(); p.fill(C.card); p.stroke(C.line); p.strokeWeight(1.5); p.rect(14, y0 + 2, W - 28, 48, 8);
      for (let k = 0; k <= 6; k++) {
        const b = G.low(k), on = s.pick === k;
        if (on) { p.noStroke(); p.fill(G.solved ? C.ok : C.sun); p.rect(b.x + 2, b.y, b.w - 4, b.h - 2, 6); }
        p.stroke(C.ink); p.strokeWeight(2); p.line(b.x + b.w / 2, y0 + 2, b.x + b.w / 2, y0 + 12);
        p.noStroke(); p.fill(on ? inkOn(C.sun, C.ink) : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, String(it.base ** k), b.x + b.w / 2, y0 + 26, b.w - 4, 15);
        p.fill(C.mute); p.textSize(9); p.text(k, b.x + b.w / 2, y0 + 62);
      }
      p.fill(C.mute); p.textSize(9); p.textAlign(p.LEFT, p.CENTER); p.text('exponente', 16, y0 + 76);
      // La regla de arriba, corrida `shift` pasos.
      const ux = 14 + s.shift * st;
      p.fill(shade(C.sky, 0.9)); p.noStroke(); p.rect(ux, y0 - 46, W - 28, 46, 8);
      for (let k = 0; k <= 6; k++) {
        const x = ux + 6 + k * st + st / 2; if (x > W - 4) break;
        p.stroke(C.cream); p.strokeWeight(2); p.line(x, y0 - 10, x, y0);
        p.noStroke(); p.fill(C.cream); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, String(it.base ** k), x, y0 - 26, st - 4, 15);
      }
      drawBtn(p, C, G.btn[0], '◀', false, C.cream); drawBtn(p, C, G.btn[1], '▶', false, C.cream);
      p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.LEFT, p.TOP); p.textSize(11); p.text('Corre la regla y toca el resultado abajo', 172, G.btn[0].y + 4, W - 180, 30);   // en caja: en celular angosto va en dos renglones, sin pisar el botón
    },
    press(G, x, y) {
      const s = G.s, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i >= 0) { s.shift = Math.max(0, Math.min(6, s.shift + (i ? 1 : -1))); s.pick = -1; G.api.sfx?.tap?.(); return true; }
      for (let k = 0; k <= 6; k++) if (hitBox(G.low(k), x, y)) { s.pick = k; G.submit(); return true; }
      return false;
    },
    peek: G => { const it = G.item, n = shiftOf(it) - G.s.shift, b = G.low(pickOf(it)), w = G.low((pickOf(it) + 1) % 7); return { solve: [...Array(Math.abs(n)).fill(G.btn[n > 0 ? 1 : 0]), { x: b.x + b.w / 2 - 2, y: b.y + 20, w: 4, h: 4 }], wrong: { x: w.x + w.w / 2 - 2, y: w.y + 20, w: 4, h: 4 } }; },
  });
})();
