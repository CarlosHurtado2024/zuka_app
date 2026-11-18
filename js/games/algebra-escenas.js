(() => {
  const A = ALG_TALLER;
  const { modes, bound, step, eq, same, mix, point, gap, box, inside, center, normal, color, stroke, panel, txt, handle, line, dash, curve, chip } = A;
  const band = G => center(G.b);
  const ends = G => [G.b.x + 23, G.b.x + G.b.w - 23];
  const at = (G, t, y = band(G).y) => point(mix(...ends(G), t), y);
  const moveX = (G, q, set) => set(step(mix(G.r.lo, G.r.hi, bound(normal(q.x, ...ends(G)), 0, 1)), G.r.lo, G.r.hi, G.r.step));
  const measures = (G, y) => {
    const { p, C, r, b, s } = G;
    const a = at(G, 0, y), z = at(G, 1, y);
    line(p, a, z, C.line, 3);
    const n = Math.min(10, Math.round((r.hi - r.lo) / (r.step || 1)));
    for (let i = 0; i <= n; i++) {
      const q = at(G, i / n, y);
      line(p, point(q.x, y - 4), point(q.x, y + 4), C.mute);
    }
    txt(p, r.lo, a.x, y + 21, 41, C.mute, 11);
    txt(p, r.hi, z.x, y + 21, 41, C.mute, 11);
    handle(p, C, G.knob, G.held);
    txt(p, r.input?.(s.v) ?? s.v, G.knob.x, y - 24, Math.min(100, b.w / 2), C.ink);
  };
  const linear = {
    valid: (v, r) => eq(v, r.goal),
    layout(G) {
      G.y = G.b.y + G.b.h - 38;
      G.knob = at(G, normal(G.s.v, G.r.lo, G.r.hi), G.y);
    },
    press(G, q, set) { if (Math.abs(q.y - G.y) > 19 || !inside(q, G.b)) return false; moveX(G, q, set); return true; },
    drag: moveX,
    key(G, dx, dy, set) {
      const { lo, hi, step: d = 1 } = G.r;
      if (dx || dy) set(step(G.s.v + (dx || -dy) * d, lo, hi, d));
    },
    demo: G => ({ from: G.knob, to: at(G, G.knob.x < band(G).x ? .59 : .38, G.y) }),
    solve: G => [G.knob, at(G, normal(G.r.goal, G.r.lo, G.r.hi), G.y)],
  };

  // Comparte la escala de medida. Cada escena conserva el dibujo y la magnitud que se manipula.
  modes.barra = {
    ...linear,
    instruction: 'Desliza la manija y compara las medidas',
    draw(G) {
      const { p, C, r, s, b } = G;
      const a = at(G, 0), z = at(G, 1), w = z.x - a.x;
      const entries = r.bars?.(s.v) ?? [[r.input?.(s.v) ?? s.v, s.v]];
      entries.forEach(([label, value], i) => {
        const y = b.y + 34 + i * 49, col = i ? C.sky : C.brand;
        panel(p, box(a.x, y, w, 13), C.line, C.bg, 4);
        const tail = a.x + w * bound(Math.abs(value) / (r.scale || r.hi), 0, 1);
        if (tail > a.x) panel(p, box(a.x, y, tail - a.x, 13), col, color(p, col, 100), 4);
        txt(p, label, band(G).x, y - 13, w, C.ink, 13);
      });
      measures(G, G.y);
    },
  };

  modes.balanza = {
    ...linear,
    instruction: 'Desliza el contrapeso para mover la balanza',
    draw(G) {
      const { p, C, r, s, b } = G, c = point(band(G).x, b.y + b.h * .41), arm = b.w * .32;
      const [a, z] = r.loads(s.v), difference = bound((z - a) / Math.max(1, Math.abs(a), Math.abs(z)), -1, 1);
      const h = difference * 23, left = point(c.x - arm, c.y - h), right = point(c.x + arm, c.y + h);
      p.noStroke(); p.fill(color(p, C.brand, 55)); p.triangle(c.x, c.y, c.x - 23, c.y + 44, c.x + 23, c.y + 44);
      line(p, left, right, C.brand, 4);
      for (const [i, q] of [left, right].entries()) {
        const co = i ? C.sky : C.brand;
        line(p, q, point(q.x, q.y + 24), co, 1.5);
        p.fill(color(p, co, 80)); p.stroke(co); p.arc(q.x, q.y + 25, 52, 17, 0, Math.PI, p.CHORD);
        txt(p, i ? z : a, q.x, q.y - 16, 60, C.ink, 16);
      }
      measures(G, G.y);
    },
  };

  // Un punto y sus proyecciones comparten una escala con las curvas de cada problema.
  function plotLayout(G) {
    const { b, r } = G, [xl, xr, yl, yr] = r.bounds;
    const a = box(b.x + 27, b.y + 17, b.w - 46, b.h - 37);
    G.plot = {
      a,
      to: (x, y) => point(mix(a.x, a.x + a.w, normal(x, xl, xr)), mix(a.y + a.h, a.y, normal(y, yl, yr))),
      from: q => [step(mix(xl, xr, normal(q.x, a.x, a.x + a.w)), xl, xr, r.dx),
        step(mix(yl, yr, normal(q.y, a.y + a.h, a.y)), yl, yr, r.dy)],
    };
  }
  function axes(G) {
    const { p, C, r, plot } = G, { a, to } = plot, [xl, xr, yl, yr] = r.bounds;
    for (let i = 0; i <= 6; i++) {
      const x = a.x + i * a.w / 6, y = a.y + i * a.h / 6;
      line(p, point(x, a.y), point(x, a.y + a.h), C.line);
      line(p, point(a.x, y), point(a.x + a.w, y), C.line);
    }
    const x0 = bound(0, xl, xr), y0 = bound(0, yl, yr);
    line(p, to(xl, y0), to(xr, y0), C.mute);
    line(p, to(x0, yl), to(x0, yr), C.mute);
    txt(p, xl, a.x + 2, a.y + a.h + 11, 28, C.mute, 10);
    txt(p, xr, a.x + a.w - 2, a.y + a.h + 11, 28, C.mute, 10);
    txt(p, yr, a.x - 12, a.y + 3, 25, C.mute, 10);
    txt(p, yl, a.x - 12, a.y + a.h - 3, 25, C.mute, 10);
    for (const [i, fn] of (r.curves || []).entries()) {
      const pts = Array.from({ length: 89 }, (_, k) => {
        const x = mix(xl, xr, k / 88), y = fn(x);
        return Number.isFinite(y) && y >= yl && y <= yr ? to(x, y) : null;
      });
      curve(p, pts, i ? C.sky : C.brand);
    }
    for (const [x, y] of r.marks || []) {
      const q = to(x, y);
      stroke(p, C.mute, 1.5); p.circle(q.x, q.y, 11);
    }
    for (const [x, y] of r.holes || []) {
      const q = to(x, y);
      p.stroke(C.brand); p.strokeWeight(2); p.fill(C.card); p.circle(q.x, q.y, 10);
    }
  }
  function marks(G, x, y) {
    const { p, C, r, plot, held } = G, { to } = plot, [xl, xr, yl, yr] = r.bounds;
    const q = to(x, y);
    dash(p, q, to(x, bound(0, yl, yr)), C.mute);
    dash(p, q, to(bound(0, xl, xr), y), C.mute);
    handle(p, C, q, held);
  }
  const position = (G, q, set) => set(G.plot.from(q));
  modes.plano = {
    valid: (v, r) => v.every((n, i) => eq(n, r.goal[i])),
    instruction: 'Arrastra el punto en el plano',
    layout: plotLayout,
    draw(G) { axes(G); marks(G, ...G.s.v); },
    press(G, q, set) { if (!inside(q, G.b)) return false; position(G, q, set); return true; },
    drag: position,
    key(G, dx, dy, set) {
      const { bounds: [xl, xr, yl, yr], dx: sx = 1, dy: sy = 1 } = G.r, [x, y] = G.s.v;
      set([step(x + dx * sx, xl, xr, sx), step(y - dy * sy, yl, yr, sy)]);
    },
    demo: G => { const [xl, xr, yl, yr] = G.r.bounds; return { from: G.plot.to(...G.s.v), to: G.plot.to(mix(xl, xr, .39), mix(yl, yr, .34)) }; },
    solve: G => [G.plot.to(...G.s.v), G.plot.to(...G.r.goal)],
    route: G => [G.plot.to(G.r.start[0], G.r.start[1]), G.plot.to(...G.s.v)],
  };

  const scan = (G, q, set) => set(G.plot.from(q)[0]);
  modes.sonda = {
    ...linear,
    instruction: 'Mueve la sonda y observa la altura de la curva',
    layout: plotLayout,
    draw(G) {
      axes(G);
      const { r, s, plot } = G, [,, lo, hi] = r.bounds;
      const y = r.curves[0](s.v);
      if (Number.isFinite(y)) marks(G, s.v, bound(y, lo, hi));
      else {
        const a = plot.to(s.v, lo), b = plot.to(s.v, hi);
        dash(G.p, a, b, G.C.mute);
        handle(G.p, G.C, plot.to(s.v, (lo + hi) / 2), G.held);
      }
    },
    press(G, q, set) { if (!inside(q, G.b)) return false; scan(G, q, set); return true; },
    drag: scan,
    key(G, dx, dy, set) {
      const [lo, hi] = G.r.bounds, d = G.r.dx || 1;
      if (dx || dy) set(step(G.s.v + (dx || -dy) * d, lo, hi, d));
    },
    demo: G => {
      const { r, s, plot } = G, [lo, hi, a, b] = r.bounds, n = step(mix(lo, hi, s.v <= (lo + hi) / 2 ? .63 : .35), lo, hi, r.dx);
      return { from: plot.to(s.v, bound(r.curves[0](s.v), a, b)), to: plot.to(n, bound(r.curves[0](n), a, b)) };
    },
    solve: G => [G.plot.to(G.s.v, G.r.curves[0](G.s.v)), G.plot.to(G.r.goal, G.r.curves[0](G.r.goal))],
    route(G) {
      const { s, r, plot } = G, [,, lo, hi] = r.bounds;
      return Array.from({ length: 33 }, (_, i) => {
        const x = mix(r.start, s.v, i / 32);
        return plot.to(x, bound(r.curves[0](x), lo, hi));
      });
    },
  };

  function areaMove(G, q, set) {
    const { r, uv, f } = G, [xb, yb] = r.max;
    set([step((q.x - f.x) / uv, 1, xb), step((f.y - q.y) / uv, 1, yb)]);
  }
  modes.area = {
    valid: modes.plano.valid,
    instruction: 'Tira de la esquina para construir el área',
    layout(G) {
      const { b, r, s } = G;
      G.uv = Math.min((b.w - 71) / r.max[0], (b.h - 46) / r.max[1]);
      G.f = point(b.x + 34, b.y + b.h - 30);
      G.knob = point(G.f.x + G.uv * s.v[0], G.f.y - G.uv * s.v[1]);
    },
    draw(G) {
      const { p, C, f, knob, uv, s } = G, [w, h] = s.v;
      panel(p, box(f.x, knob.y, uv * w, uv * h), C.brand, color(p, C.brand, 75), 0);
      for (let i = 1; i < w; i++) line(p, point(f.x + i * uv, knob.y), point(f.x + i * uv, f.y), C.line);
      for (let j = 1; j < h; j++) line(p, point(f.x, f.y - j * uv), point(knob.x, f.y - j * uv), C.line);
      txt(p, w, (f.x + knob.x) / 2, f.y + 14, 34, C.ink, 13);
      txt(p, h, f.x - 14, (f.y + knob.y) / 2, 27, C.ink, 13);
      handle(p, C, knob, G.held);
    },
    press(G, q, set) { if (gap(G.knob, q) > 23) return false; areaMove(G, q, set); return true; },
    drag: areaMove,
    key(G, dx, dy, set) {
      const [a, b] = G.s.v, [x, y] = G.r.max;
      set([bound(a + dx, 1, x), bound(b - dy, 1, y)]);
    },
    demo: G => ({ from: G.knob, to: point(G.f.x + G.uv * Math.min(3, G.r.max[0]), G.f.y - G.uv * Math.min(3, G.r.max[1])) }),
    solve: G => [G.knob, point(G.f.x + G.uv * G.r.goal[0], G.f.y - G.uv * G.r.goal[1])],
  };

  const rot = (c, r, t) => point(c.x + r * Math.cos(t), c.y + r * Math.sin(t));
  const angle = (G, i) => -Math.PI / 2 + (i / G.r.values.length) * 2 * Math.PI;
  function turn(G, q, set) {
    const t = Math.atan2(q.y - G.c.y, q.x - G.c.x) + Math.PI / 2, n = G.r.values.length;
    set((Math.round(t * n / (2 * Math.PI)) + n) % n);
  }
  modes.giro = {
    valid: (v, r) => v === r.goal,
    instruction: 'Agarra el brazo y gíralo',
    layout(G) { G.c = band(G); G.rad = Math.min(G.b.h / 2 - 31, G.b.w / 2 - 35); G.knob = rot(G.c, G.rad, angle(G, G.s.v)); },
    draw(G) {
      const { p, C, r, s, c, rad, knob } = G;
      stroke(p, C.line); p.circle(c.x, c.y, rad * 2); p.circle(c.x, c.y, rad * 1.32);
      for (let i = 0; i < r.values.length; i++) {
        const t = angle(G, i), q = rot(c, rad + 19, t);
        line(p, rot(c, rad - 4, t), rot(c, rad + 4, t), i === s.v ? C.brand : C.mute);
        txt(p, r.values[i], q.x, q.y, 40, C.ink, 12);
      }
      line(p, c, knob, C.brand, 2);
      handle(p, C, knob, G.held);
    },
    press(G, q, set) { if (gap(G.knob, q) > 22) return false; turn(G, q, set); return true; },
    drag: turn,
    key(G, dx, dy, set) {
      const n = G.r.values.length;
      set((G.s.v + (dx || -dy) + n) % n);
    },
    demo: G => ({ from: G.knob, to: rot(G.c, G.rad, angle(G, (G.s.v + 1) % G.r.values.length)) }),
    solve: G => [G.knob, rot(G.c, G.rad, angle(G, G.r.goal))],
    route(G) {
      return Array.from({ length: 21 }, (_, i) => rot(G.c, G.rad, mix(angle(G, G.r.start), angle(G, G.s.v), i / 20)));
    },
  };

  // Mosaicos. La línea pintada es la acción de seleccionar y también sirve para quitar celdas.
  function paint(G, q, set, first) {
    const i = G.cells.findIndex(b => inside(q, b));
    if (i < 0 || (!first && i === G.input.lastCell)) return false;
    const cells = G.s.v;
    if (first) G.input.paintOn = !cells.includes(i);
    G.input.lastCell = i;
    set(G.input.paintOn ? [...new Set([...cells, i])].sort((a, b) => a - b) : cells.filter(j => i !== j));
    return true;
  }
  modes.mosaico = {
    valid: (v, r) => same(v, r.goal),
    instruction: 'Pinta al pasar por las celdas; repasa para borrar',
    layout(G) {
      const { b, r } = G, n = r.cols, m = Math.ceil(r.tiles.length / n), c = band(G);
      const u = Math.min((b.w - 28) / n, (b.h - 25) / m, 54);
      G.cells = r.tiles.map((_, i) => box(c.x + (i % n - n / 2) * u + 2, c.y + (Math.floor(i / n) - m / 2) * u + 2, u - 4, u - 4));
    },
    draw(G) {
      const { p, C, r, s } = G;
      G.cells.forEach((b, i) => {
        const on = s.v.includes(i), q = center(b);
        panel(p, b, on ? C.brand : C.line, on ? color(p, C.brand, 110) : C.card, 5);
        if (r.tiles[i]) txt(p, r.tiles[i], q.x, q.y, b.w - 4, C.ink, 14);
      });
    },
    press: (G, q, set) => paint(G, q, set, true),
    drag: paint,
    demo: G => ({ from: center(G.cells[0]), to: center(G.cells[1]) }),
    solve: G => G.r.goal.map(i => center(G.cells[i])),
  };

  // Las piezas se mueven entre compartimentos. Soltar fuera devuelve la pieza al punto de partida.
  modes.membrana = {
    valid: (v, r) => same(v, r.goal),
    complete: v => v.every(i => i >= 0),
    instruction: 'Arrastra cada pieza a su región',
    layout(G) {
      const { b, r, s } = G, n = r.regions.length, w = b.w / n - 10;
      const rowY = b.y + b.h - 37, cap = Math.min(43, (b.w - 12) / r.tiles.length - 3);
      const total = (cap + 3) * r.tiles.length;
      G.regions = r.regions.map((_, i) => box(b.x + i * (w + 10) + 5, b.y + 9, w, b.h - 53));
      G.homes = r.tiles.map((_, i) => box(band(G).x - total / 2 + i * (cap + 3), rowY, cap, 28));
      const count = r.regions.map(() => 0);
      G.tiles = s.v.map((j, i) => {
        if (j < 0) return G.homes[i];
        const a = G.regions[j], k = count[j]++;
        return box(center(a).x - cap / 2, a.y + 36 + k * Math.min(26, (a.h - 49) / Math.max(1, s.v.filter(x => x === j).length)), cap, 24);
      });
    },
    draw(G) {
      const { p, C, r } = G;
      const { grab } = G.input;
      G.regions.forEach((b, i) => {
        const c = i % 2 ? C.sky : C.brand;
        panel(p, b, c, color(p, c, 20), 19);
        txt(p, r.regions[i], center(b).x, b.y + 17, b.w - 6, C.ink, 13);
      });
      G.tiles.forEach((b, i) => { if (!grab || grab.i !== i) chip(p, C, b, r.tiles[i]); });
      if (grab) chip(p, C, box(grab.q.x - 21, grab.q.y - 14, 42, 28), r.tiles[grab.i], C.brand);
    },
    press(G, q) {
      const i = G.tiles.findIndex(b => inside(q, b));
      if (i < 0) return false;
      G.input.grab = { i, q }; return true;
    },
    drag(G, q) { if (G.input.grab) G.input.grab.q = q; },
    release(G, q, set) {
      const { grab } = G.input;
      if (!grab) return;
      const j = G.regions.findIndex(b => inside(q, b)), i = grab.i;
      G.input.grab = null;
      if (j < 0 && !G.homes.some(b => inside(q, b))) return;
      set(G.s.v.map((v, k) => k === i ? j : v));
    },
    cancel(G) { G.input.grab = null; },
    demo: G => ({ from: center(G.tiles[0]), to: center(G.regions[0]) }),
    solve: G => G.tiles.flatMap((b, i) => [center(b), center(G.regions[G.r.goal[i]])]),
  };

  const gridPath = (G, q, set) => {
    const i = G.nodes.findIndex(n => gap(n, q) < 21), route = G.s.v, last = route.at(-1);
    if (i < 0 || i === last) return false;
    if (i === route.at(-2)) { set(route.slice(0, -1)); return true; }
    if (!G.r.edges.some(([a, b]) => a === last && b === i)) return false;
    set([...route, i]); return true;
  };
  modes.trazo = {
    valid: (v, r) => same(v, r.goal),
    complete: (v, r) => GPathEnd(v, r),
    instruction: 'Traza el camino desde el origen',
    layout(G) {
      const { b, r } = G;
      G.nodes = r.nodes.map(([x, y]) => point(b.x + 31 + x * (b.w - 62), b.y + 25 + y * (b.h - 50)));
    },
    draw(G) {
      const { p, C, r, s, nodes } = G;
      r.edges.forEach(([a, b]) => line(p, nodes[a], nodes[b], C.line, 2));
      for (let i = 1; i < s.v.length; i++) line(p, nodes[s.v[i - 1]], nodes[s.v[i]], C.brand, 3);
      nodes.forEach((q, i) => {
        p.stroke(s.v.includes(i) ? C.brand : C.line); p.strokeWeight(1.5); p.fill(C.card); p.circle(q.x, q.y, 36);
        txt(p, r.nodes[i][2], q.x, q.y, 34, C.ink, 12);
      });
    },
    press(G, q, set) { return gap(G.nodes[G.s.v.at(-1)], q) < 22 || gridPath(G, q, set); },
    drag: gridPath,
    demo: G => {
      const i = G.s.v.at(-1), j = G.r.edges.find(([a]) => a === i)?.[1] ?? G.s.v.at(-2);
      return { from: G.nodes[i], to: G.nodes[j] };
    },
    solve: G => G.r.goal.map(i => G.nodes[i]),
    route: G => G.s.v.map(i => G.nodes[i]),
  };
  const GPathEnd = (v, r) => v.length >= r.minLength || v.at(-1) === r.goal.at(-1);

  // Dos fracciones se amplían al construir el mismo denominador en ambas filas.
  modes.puentes = {
    valid: (v, r) => same(v, r.goal),
    complete: v => v.every(i => i >= 0),
    instruction: 'Lleva un factor a cada fracción',
    layout(G) {
      const { b, r } = G, m = r.tiles.length, w = Math.min(53, (b.w - 24) / m - 6);
      G.tray = r.tiles.map((_, i) => box(band(G).x - (w + 6) * m / 2 + i * (w + 6), b.y + b.h - 46, w, 35));
      G.slots = [0, 1].map(i => box(b.x + b.w * .58, b.y + 9 + i * (b.h - 58) / 2, b.w * .36, 44));
    },
    draw(G) {
      const { p, C, r, s, b, input } = G;
      for (const [i, slot] of G.slots.entries()) {
        const q = center(slot), from = b.x + b.w * .26, v = s.v[i];
        line(p, point(from + 24, q.y), point(slot.x - 6, q.y), v < 0 ? C.line : C.brand, 2);
        txt(p, r.fractions[i], from, q.y, b.w * .48, C.ink, 22);
        panel(p, slot, v < 0 ? C.line : C.brand, v < 0 ? C.bg : color(p, C.brand, 48), 8);
        txt(p, v < 0 ? 'Factor' : r.tiles[v], q.x, q.y, slot.w - 8, v < 0 ? C.mute : C.ink, 16);
      }
      G.tray.forEach((a, i) => chip(p, C, a, r.tiles[i]));
      if (input.grab) {
        const { q, i } = input.grab;
        chip(p, C, box(q.x - 23, q.y - 16, 46, 32), r.tiles[i], C.brand);
      }
    },
    press(G, q) {
      const i = G.tray.findIndex(a => inside(q, a));
      if (i < 0) return false;
      G.input.grab = { i, q }; return true;
    },
    drag: modes.membrana.drag,
    cancel: modes.membrana.cancel,
    release(G, q, set) {
      const j = G.slots.findIndex(a => inside(q, a)), { grab } = G.input;
      G.input.grab = null;
      if (grab && j >= 0) set(G.s.v.map((i, k) => k === j ? grab.i : i));
    },
    demo: G => ({ from: center(G.tray[0]), to: center(G.slots[0]) }),
    solve: G => G.r.goal.flatMap((i, j) => [center(G.tray[i]), center(G.slots[j])]),
  };

  // El límite de la banda mueve a la vez la fracción, la parte visible y la medida.
  function ribbon(G, y, total, kept, title, draggable) {
    const { p, C } = G, [a, b] = ends(G), w = b - a, u = w / total;
    txt(p, title, (a + b) / 2, y - 28, w + 15, C.ink, 13);
    panel(p, box(a, y - 13, w, 26), C.line, C.bg, 5);
    if (kept > 0) panel(p, box(a, y - 13, kept * u, 26), C.brand, color(p, C.brand, 100), 5);
    for (let i = 1; i < total; i++) line(p, point(a + i * u, y - 12), point(a + i * u, y + 12), C.line);
    if (draggable) handle(p, C, point(a + kept * u, y), G.held);
  }
  modes.fraccion = {
    ...linear,
    instruction: 'Iguala la longitud de las dos fracciones',
    layout(G) {
      G.y = G.b.y + G.b.h * .69;
      G.knob = at(G, G.s.v / G.r.hi, G.y);
    },
    draw(G) {
      const { r, s, b } = G;
      ribbon(G, b.y + b.h * .3, r.parts, r.filled, r.filled + ' de ' + r.parts, false);
      ribbon(G, G.y, r.hi, s.v, s.v + ' de ' + r.hi, true);
    },
    route(G) { return [at(G, G.r.filled / G.r.parts, G.b.y + G.b.h * .3), G.knob]; },
  };

  modes.recibo = {
    ...linear,
    instruction: 'Tira del borde para recortar el precio',
    layout(G) {
      G.y = G.b.y + G.b.h * .55;
      G.knob = at(G, 1 - G.s.v / G.r.hi, G.y);
    },
    draw(G) {
      const { p, C, r, s, b, knob } = G, [a, z] = ends(G), y = G.y;
      panel(p, box(a - 7, b.y + 19, z - a + 14, b.h - 38), C.line, C.card);
      txt(p, 'Precio original · ' + r.price + ' mil', band(G).x, b.y + 42, b.w - 30, C.ink);
      ribbon(G, y, r.hi, r.hi - s.v, 'Parte que se paga', true);
      dash(p, point(knob.x, y - 37), point(knob.x, y + 33), C.brand);
      txt(p, 'Una división vale ' + r.price / r.hi + ' mil', band(G).x, b.y + b.h - 26, b.w - 28, C.mute, 12);
    },
    press(G, q, set) {
      if (gap(G.knob, q) > 25) return false;
      this.drag(G, q, set); return true;
    },
    drag(G, q, set) {
      set(step((1 - normal(q.x, ...ends(G))) * G.r.hi, 0, G.r.hi));
    },
    demo: G => ({ from: G.knob, to: at(G, .7, G.y) }),
    solve: G => [G.knob, at(G, 1 - G.r.goal / G.r.hi, G.y)],
    route(G) { return [at(G, 1, G.y), G.knob, point(G.knob.x, G.b.y + G.b.h - 25)]; },
  };

  modes.cascada = {
    valid: (v, r) => same(v, r.goal),
    complete: v => v.every(n => n !== 0),
    instruction: 'Ajusta cada manija antes de aplicar los cambios',
    layout(G) {
      const { b, s } = G, [a, z] = ends(G);
      G.tracks = [.34, .7].map((t, i) => {
        const x = mix(a, z, t), y = b.y + 45, h = b.h - 91;
        return { x, y, h, knob: point(x, y + h * (50 - s.v[i]) / 100) };
      });
    },
    draw(G) {
      const { p, C, b, tracks, r, s } = G;
      const middle = r.price * (1 + s.v[0] / 100);
      tracks.forEach(({ x, y, h, knob }, i) => {
        line(p, point(x, y), point(x, y + h), C.line, 4);
        line(p, point(x - 6, y + h / 2), point(x + 6, y + h / 2), C.mute);
        handle(p, C, knob, G.held && G.input.stage === i);
        txt(p, (i + 1) + ' · ' + s.v[i] + ' %', x, y - 23, b.w / 2 - 12, C.ink);
      });
      txt(p, r.price + ' → ' + +middle.toFixed(2) + ' → ' + +(middle * (1 + s.v[1] / 100)).toFixed(2),
        band(G).x, b.y + b.h - 22, b.w - 25, C.ink);
    },
    press(G, q, set) {
      const stage = G.tracks.findIndex(o => Math.abs(q.x - o.x) < 24 && inside(q, G.b));
      if (stage < 0) return false;
      G.input.stage = stage; this.drag(G, q, set); return true;
    },
    drag(G, q, set) {
      const i = G.input.stage, { y, h } = G.tracks[i];
      set(G.s.v.map((v, j) => i === j ? step(50 - (q.y - y) * 100 / h, -50, 50, 5) : v));
    },
    demo: G => ({ from: G.tracks[0].knob, to: point(G.tracks[0].x, G.tracks[0].y + G.tracks[0].h * .67) }),
    solve: G => G.tracks.flatMap(({ x, y, h, knob }, i) => [knob, point(x, y + h * (50 - G.r.goal[i]) / 100)]),
    route: G => [point(G.b.x + 17, band(G).y), ...G.tracks.map(t => t.knob), point(G.b.x + G.b.w - 17, band(G).y)],
  };

  modes.factores = {
    valid: (v, r) => v === r.goal,
    complete: (v, r) => v === r.bottom,
    instruction: 'Arrastra los factores de abajo sobre los de arriba',
    layout(G) {
      const { b, r } = G, w = Math.min(42, (b.w - 22) / r.top - 5);
      const row = (count, y) => Array.from({ length: count }, (_, i) => box(band(G).x - count * (w + 5) / 2 + i * (w + 5), y, w, 32));
      G.top = row(r.top, b.y + b.h * .29 - 16);
      G.bottom = row(r.bottom, b.y + b.h * .73 - 16);
    },
    draw(G) {
      const { p, C, b, input, r, s } = G;
      line(p, at(G, 0), at(G, 1), C.mute, 1.5);
      for (const row of [G.top, G.bottom]) row.forEach((a, i) => {
        const covered = i < s.v;
        if (covered) {
          panel(p, a, C.line, C.bg, 7);
          line(p, point(a.x + 6, a.y + a.h - 6), point(a.x + a.w - 6, a.y + 6), C.mute);
        } else chip(p, C, a, r.factor);
      });
      if (input.grab) chip(p, C, box(input.grab.q.x - 16, input.grab.q.y - 16, 32, 32), r.factor, C.brand);
    },
    press(G, q) {
      if (!G.bottom.some((b, i) => i >= G.s.v && inside(q, b))) return false;
      G.input.grab = { q }; return true;
    },
    drag: modes.membrana.drag,
    cancel: modes.membrana.cancel,
    release(G, q, set) {
      const moved = G.input.grab && G.top.some((b, i) => i >= G.s.v && inside(q, b));
      G.input.grab = null;
      if (moved) set(G.s.v + 1);
    },
    demo: G => {
      const i = Math.min(G.s.v, G.bottom.length - 1);
      return { from: center(G.bottom[i]), to: center(G.top[i]) };
    },
    solve: G => G.bottom.flatMap((b, i) => [center(b), center(G.top[i])]),
    route: G => [center(G.bottom.at(-1)), center(G.top[G.r.bottom - 1]), center(G.top.at(-1))],
  };

  for (const id of Object.keys(modes)) GAMES['taller-' + id] = A.register(id);
})();
