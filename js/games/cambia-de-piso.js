// Cambia de piso (Álgebra, exponentes negativos; lección alg-21b): una fracción con potencias arriba y abajo de la
// raya. Tocar una potencia la manda al otro piso y su exponente cambia de signo (a⁻³ arriba es lo mismo que a³ abajo).
// Meta: que no quede ningún exponente negativo. Mover una que ya era positiva la vuelve negativa.
// params = { rounds: [{ top: [{ b, e }], bottom: [{ b, e }] }] }   state = { rounds: [{ up: [bool por ficha] }] }
// Las fichas se numeran primero las de arriba y luego las de abajo.   Spec 2026-11-15-torres-de-potencias.

GAMES['cambia-de-piso'] = (() => {
  const all = r => [...r.top.map(t => ({ ...t, home: true })), ...r.bottom.map(t => ({ ...t, home: false }))];
  // Exponente que muestra cada ficha según el piso en que está.
  const shown = (r, up) => all(r).map((t, i) => ({ b: t.b, up: up[i], e: up[i] === t.home ? t.e : -t.e }));
  const powTxt = t => `${t.b}${t.e === 1 ? '' : sup(t.e)}`;
  const sideTxt = list => (list.length ? list.map(powTxt).join(' ') : '1');
  const fracTxt = list => `${sideTxt(list.filter(t => t.up))} / ${sideTxt(list.filter(t => !t.up))}`;

  const game = roundsGame({
    aspect: 1.1,
    init: r => ({ up: all(r).map(t => t.home) }),
    ok: (s, r) => shown(r, s.up).every(t => t.e > 0),
    solution: r => { const fixed = all(r).map(t => (t.e < 0 ? !t.home : t.home)); return `${fracTxt(shown(r, all(r).map(t => t.home)))} = ${fracTxt(shown(r, fixed))}`; },
    prompt: () => 'Toca una potencia para mandarla al otro piso: deja todos los exponentes positivos',
    foot: (r, s) => (shown(r, s.up).every(t => t.e > 0) ? 'Sin exponentes negativos: así se escribe' : 'Al cruzar la raya, el exponente cambia de signo'),
    draw(G) {
      const { p, C, W, s, r } = G, list = shown(r, s.up), mid = 190, tw = 62;
      G.boxes = [];
      [true, false].forEach(up => {
        const idx = list.map((t, i) => i).filter(i => list[i].up === up), n = idx.length, step = Math.min(tw + 10, (W - 24) / Math.max(1, n));
        idx.forEach((i, k) => { G.boxes[i] = { x: W / 2 - (n * step) / 2 + k * step + (step - Math.min(tw, step - 6)) / 2, y: up ? mid - 62 : mid + 18, w: Math.min(tw, step - 6), h: 44 }; });
        if (!n) { p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(22); p.textAlign(p.CENTER, p.CENTER); p.text('1', W / 2, up ? mid - 40 : mid + 40); }
      });
      p.stroke(C.ink); p.strokeWeight(4); p.line(28, mid, W - 28, mid);
      list.forEach((t, i) => drawTile(p, C, G.boxes[i], powTxt(t), { fill: t.e > 0 ? C.mint : C.coral, size: 20 }));
      p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
      p.text('arriba (numerador)', W / 2, mid - 78); p.text('abajo (denominador)', W / 2, mid + 78);
      const bad = list.filter(t => t.e <= 0).length;
      p.fill(bad ? C.ink : C.ok); p.textSize(14); p.text(bad ? `exponentes negativos: ${bad}` : fracTxt(list), W / 2, mid + 112);
    },
    press(G, x, y) {
      const i = (G.boxes || []).findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      G.s.up[i] = !G.s.up[i]; G.touch();
      return true;
    },
    peek: G => ({ boxes: G.boxes, neg: shown(G.r, G.s.up).map(t => t.e < 0) }),
  });
  return { ...game, shown, fracTxt };
})();
