// La proporción se ve a la vez en el color, los niveles y la razón escrita.
GAMES.limonada = (() => {
  function grade(state, params) {
    const [bl, bw] = params.base, k = Math.ceil(params.minLemons / bl);
    const ok = state.lemons >= params.minLemons && state.lemons * bw === state.water * bl;
    return { ok, solution: `La razón debe ser $${bl}:${bw}$. Una mezcla que sirve es $${bl * k}:${bw * k}$.` };
  }

  function create(host, params, api) {
    const C = api.palette, st = { lemons: 0, water: 0 }, [bl, bw] = params.base;
    let W, H, controls, jars, map, drag, locked = false, t = 0, reveal = 0, touched = false;
    const m = mountSketch(host, (p, size) => {
      const layout = () => {
        W = size.w; H = size.h;
        const w = W * .26, h = H * .31;
        jars = [{ x: W * .26, w, h }, { x: W * .74, w, h }];
        map = lineMap(0, params.maxEach, 83, W - 29);
        controls = [
          { key: 'lemons', y: H - 95, text: 'Limón', col: 'sun' },
          { key: 'water', y: H - 51, text: 'Agua', col: 'sky' },
        ];
      };
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(); };
      p.onResize = layout;
      const label = (txt, x, y, w, col, sz) => {
        p.noStroke(); p.fill(col); p.textAlign(p.CENTER, p.CENTER); fitText(p, txt, x, y, w, sz);
      };
      function jar(j, l, w, title, capacity) {
        const y = 59, left = j.x - j.w / 2, floor = y + j.h, total = l + w;
        const h = (j.h - 8) * Math.min(1, total / capacity);
        const hue = p.lerpColor(p.color(C.sky), p.color(C.sun), total ? l / total : 0);
        p.stroke(C.line); p.fill(C.card); p.strokeWeight(1.5); p.rect(left, y, j.w, j.h, 10);
        if (h > 5) { p.noStroke(); p.fill(hue); p.rect(left + 4, floor - h - 4, j.w - 8, h, 6); }
        p.stroke(C.mute); p.strokeWeight(1); p.line(left + j.w, y + 15, left + j.w + 9, y + 19);
        p.line(left + j.w + 9, y + 19, left + j.w + 9, y + 43); p.line(left + j.w + 9, y + 43, left + j.w, y + 49);
        label(title, j.x, y - 15, W * .42, C.mute, 13);
        label(`$${l}:${w}$`, j.x, floor + 20, W * .42, C.ink, 19);
      }
      p.draw = () => {
        t += frameDt(p); p.background(C.bg);
        jar(jars[0], bl, bw, 'Receta', Math.max(bl + bw, params.minLemons * 2));
        jar(jars[1], st.lemons, st.water, 'Tu jarra', params.maxEach * 2);
        const equal = st.lemons > 0 && st.lemons * bw === st.water * bl;
        const line = locked ? grade(st, params).solution : equal ? (st.lemons >= params.minLemons ? 'Misma proporción y cantidad suficiente' : 'Misma proporción. Prepara más.') : `Al menos ${params.minLemons} medidas de limón`;
        label(line, W / 2, H - 132, W - 24, equal ? C.ok : C.ink, 14);
        for (const { key, y, text, col } of controls) {
          const x = map.toPx(st[key]);
          p.stroke(C.line); p.strokeWeight(3); p.line(map.toPx(0), y, map.toPx(params.maxEach), y);
          p.stroke(C[col]); p.line(map.toPx(0), y, x, y);
          p.stroke(C[col]); p.strokeWeight(2); p.fill(C.card); p.circle(x, y, 25);
          label(String(st[key]), x, y, 25, C.ink, 13);
          label(text, 39, y, 61, C.ink, 13);
        }
        if (!drag && !locked && ((!touched && api.guideAuto !== false) || t < reveal)) {
          const y = controls[0].y;
          drawDemo(p, C, t < reveal ? t - (reveal - 2 * DEMO_T) : t,
            { from: { x: map.toPx(st.lemons), y }, to: { x: map.toPx(Math.min(3, params.maxEach)), y } });
          label('Desliza para añadir cada ingrediente', W / 2, H - 18, W - 24, C.mute, 12);
        }
      };
      const move = () => {
        st[drag.key] = Math.round(p.constrain(map.toVal(p.mouseX), 0, params.maxEach));
        api.ready(st.lemons > 0 && st.water > 0);
      };
      p.mousePressed = () => {
        if (locked || !inCanvas(p) || p.mouseX < map.toPx(0) - 17) return;
        drag = controls.find(o => Math.abs(p.mouseY - o.y) < 21);
        if (!drag) return;
        touched = true; reveal = 0; move();
        return false;
      };
      p.mouseDragged = () => { if (drag) { move(); return false; } };
      p.mouseReleased = () => { drag = null; };
    }, 1.03);
    return {
      loaded: m.ready, getState: () => ({ ...st }), lock() { locked = true; }, destroy: () => m.remove(),
      demo() { reveal = t + 2 * DEMO_T; },
      peek: () => ({ controls, solve: [{ x: map?.toPx(bl * Math.ceil(params.minLemons / bl)), y: controls?.[0].y },
        { x: map?.toPx(bw * Math.ceil(params.minLemons / bl)), y: controls?.[1].y }] }),
    };
  }
  return { grade, create, demo: true };
})();
