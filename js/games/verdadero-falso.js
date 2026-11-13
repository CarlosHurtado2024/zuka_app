// ¿Verdadero o falso? (lección 1.1): un mazo de afirmaciones sobre las familias de números. La tarjeta
// de arriba se desliza a la derecha (verdadero) o a la izquierda (falso); también con los botones.
// Al bloquear se muestran todas con su veredicto y la razón de las falladas.
// params = { cards: [{ text, truth, why }] }   state = { answers: [true | false | null] }

GAMES['verdadero-falso'] = (() => {
  function grade(state, params) {
    const wrong = params.cards.filter((c, i) => state.answers[i] !== c.truth);
    if (!wrong.length) return { ok: true, solution: 'Todas las afirmaciones están bien juzgadas.' };
    return { ok: false, solution: wrong.map(c => `«${c.text}» es ${c.truth ? 'verdadera' : 'falsa'}: ${c.why}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const answers = params.cards.map(() => null);
    let locked = false, W = 0, H = 0, cur = 0, drag = null, dx = 0, flying = null, buttons = [];
    const CARD = { w: 0, h: 0, y: 0 };

    function layout(w, h) {
      W = w; H = h;
      CARD.w = w - 56; CARD.h = h * 0.46; CARD.y = h * 0.14;
      const bw = (w - 36) / 2, by = CARD.y + CARD.h + 26;
      buttons = [
        { v: false, x: 12, y: by, w: bw, h: 44, t: '✘  Falso', col: C.bad },
        { v: true, x: 24 + bw, y: by, w: bw, h: 44, t: '✔  Verdadero', col: C.ok },
      ];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const THRESH = () => W * 0.22;

    function answer(v) {
      if (cur >= params.cards.length) return;
      answers[cur] = v;
      flying = { i: cur, x: dx, vx: (v ? 1 : -1) * Math.max(26, Math.abs(dx) / 4) };
      cur += 1; dx = 0; drag = null;
      api.sfx?.tap?.();
      api.ready(answers.every(a => a !== null));
    }

    // Texto en varias líneas que quepa en la tarjeta.
    function wrap(p, text, maxW) {
      const lines = [''];
      text.split(' ').forEach(w => { const t = (lines[lines.length - 1] + ' ' + w).trim(); if (p.textWidth(t) <= maxW || !lines[lines.length - 1]) lines[lines.length - 1] = t; else lines.push(w); });
      return lines;
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function card(i, x, rot, color = C.line, alpha = 255) {
        const c = params.cards[i];
        p.push(); p.translate(W / 2 + x, CARD.y + CARD.h / 2); p.rotate(rot);
        // Carta crema con relieve (como las fichas de los videos); la tinta es azul noche en los dos temas.
        p.noStroke(); p.fill(C.creamD); p.rect(-CARD.w / 2, -CARD.h / 2 + 5, CARD.w, CARD.h, 18);
        p.stroke(color); p.strokeWeight(2.5); p.fill(C.cream); p.rect(-CARD.w / 2, -CARD.h / 2, CARD.w, CARD.h, 18);
        p.noStroke(); p.fill(shade(C.night, 1.45)); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(12);
        p.text(`${i + 1} / ${params.cards.length}`, 0, -CARD.h / 2 + 12);
        p.fill(C.night); p.textSize(20); p.textAlign(p.CENTER, p.CENTER);
        const lines = wrap(p, c.text, CARD.w - 40);
        lines.forEach((ln, k) => p.text(ln, 0, (k - (lines.length - 1) / 2) * 26 + 6));
        // Sello que aparece según hacia dónde se arrastra.
        if (Math.abs(x) > 12 && i === cur) {
          const v = x > 0; p.fill(shade(v ? C.ok : C.bad, 0.6)); p.textSize(26); p.textAlign(v ? p.LEFT : p.RIGHT, p.TOP);
          p.text(v ? 'VERDADERO' : 'FALSO', v ? -CARD.w / 2 + 16 : CARD.w / 2 - 16, -CARD.h / 2 + 30);
        }
        p.pop();
      }

      p.draw = () => {
        p.background(C.bg);
        if (locked) {
          // Resumen: cada afirmación con su veredicto y la razón de las falladas.
          p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.TOP);
          let y = 12;
          params.cards.forEach((c, i) => {
            const good = answers[i] === c.truth, col = good ? C.ok : C.bad;
            p.fill(col); p.textSize(14); p.text(good ? '✔' : '✘', 12, y);
            p.fill(C.ink); p.textSize(13);
            const lines = wrap(p, `${c.text} — ${c.truth ? 'V' : 'F'}`, W - 44);
            lines.forEach((ln, k) => p.text(ln, 32, y + k * 16));
            y += lines.length * 16;
            if (!good) { p.fill(C.mute); p.textSize(12); const why = wrap(p, c.why, W - 44); why.forEach((ln, k) => p.text(ln, 32, y + k * 15)); y += why.length * 15; }
            y += 10;
          });
          return;
        }
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        p.text('Desliza: ← falso · verdadero →', W / 2, 12);
        // Mazo: las dos siguientes asoman detrás.
        for (let k = Math.min(cur + 2, params.cards.length - 1); k > cur; k--) card(k, 0, 0.03 * (k - cur), C.line + '88');
        if (cur < params.cards.length) card(cur, dx, dx / W * 0.5, drag ? C.brand : C.line);
        else { p.fill(C.ok); p.textSize(18); p.textAlign(p.CENTER, p.CENTER); p.text('¡Listo! Pulsa Comprobar', W / 2, CARD.y + CARD.h / 2); }
        if (flying) {
          flying.x += flying.vx; flying.vx *= 1.08;
          card(flying.i, flying.x, flying.x / W * 0.6, flying.x > 0 ? C.ok : C.bad);
          if (Math.abs(flying.x) > W) flying = null;
        }
        buttons.forEach(b => {
          const dim = cur >= params.cards.length;
          drawTile(p, C, b, b.t, { fill: dim ? C.card : b.col, ink: dim ? C.mute : undefined, r: 12, size: 15, lift: dim ? 1 : 3 });
        });
      };

      p.mousePressed = () => {
        if (locked || cur >= params.cards.length) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) { answer(b.v); return false; }
        const top = { x: W / 2 - CARD.w / 2, y: CARD.y, w: CARD.w, h: CARD.h };
        if (inside(top, p.mouseX, p.mouseY)) { drag = { x0: p.mouseX }; dx = 0; return false; }
      };
      p.mouseDragged = () => { if (!drag) return; dx = p.mouseX - drag.x0; return false; };
      p.mouseReleased = () => {
        if (!drag) return;
        if (Math.abs(dx) > THRESH()) answer(dx > 0);
        else { drag = null; dx = 0; }
        return false;
      };
    }, 1.0);

    return {
      loaded: m.ready,
      getState: () => ({ answers: [...answers] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
