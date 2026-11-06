// Las bodegas de azúcar (lección 1.3, ejercicio 1.14): 2.000 sacos repartidos entre A y B con un
// divisor; al soltarlo, el 20 % de A viaja a B. Hay que repartirlos de modo que después del viaje
// las dos bodegas queden iguales.
// params = { total, move, step }   state = { a }

GAMES['bodegas'] = (() => {
  const after = (p, a) => ({ a: a - (a * p.move) / 100, b: p.total - a + (a * p.move) / 100 });
  const answerOf = p => p.total / (2 - (2 * p.move) / 100);
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const texNum = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

  function grade(state, params) {
    const r = after(params, state.a);
    const ok = Math.abs(r.a - r.b) < 1e-9;
    const m = params.move / 100;
    return { ok, solution: `$x - ${m}x = ${texNum(params.total)} - x + ${m}x \\Rightarrow x = ${texNum(answerOf(params))}$ sacos en A` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { a: params.total / 2 };
    let locked = false, W = 0, H = 0, bar = null, boxA = null, boxB = null, drag = false, anim = 0, animFrom = 0;

    function layout(w, h) {
      W = w; H = h;
      bar = { x: 24, y: 64, w: w - 48, h: 28 };
      boxA = { x: 16, y: 130, w: w / 2 - 28, h: h * 0.42 };
      boxB = { x: w / 2 + 12, y: 130, w: w / 2 - 28, h: h * 0.42 };
    }
    const snap = v => Math.max(0, Math.min(params.total, Math.round(v / params.step) * params.step));
    function setA(v) {
      st.a = snap(v);
      api.ready(st.a !== params.total / 2);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function sack(x, y, s, col) {
        p.noStroke(); p.fill(col); p.rect(x, y, s, s * 0.9, s * 0.2);
        p.fill(C.bg + '55'); p.rect(x + s * 0.25, y - s * 0.12, s * 0.5, s * 0.18, s * 0.08);
      }
      // Pila de sacos: uno por cada 100 (y uno pequeño por el resto).
      function pile(box, n, col, name) {
        p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 12);
        p.noStroke(); p.fill(C.mute); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP); p.text(name, box.x + box.w / 2, box.y + 8);
        const cols = 4, s = Math.min(22, (box.w - 16) / cols - 4);
        const full = Math.floor(n / 100), rest = n % 100;
        for (let i = 0; i < full; i++) sack(box.x + 8 + (i % cols) * (s + 4), box.y + box.h - 10 - s - Math.floor(i / cols) * (s + 3), s, col);
        if (rest > 0) sack(box.x + 8 + (full % cols) * (s + 4), box.y + box.h - 10 - s * (rest / 100) - Math.floor(full / cols) * (s + 3), s * Math.max(0.5, rest / 100), col + 'AA');
        p.fill(C.ink); p.textSize(14); p.textAlign(p.CENTER, p.TOP); p.text(`${fmt(n)} sacos`, box.x + box.w / 2, box.y + 26);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = after(params, st.a), good = Math.abs(r.a - r.b) < 1e-9;
        const col = locked ? (good ? C.ok : C.bad) : good ? C.ok : C.brand;
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        p.text(`${fmt(params.total)} sacos. Si de A se lleva el ${params.move} % a B, quedan iguales. ¿Cuántos había en cada una?`, W / 2, 6, W - 24, 50);
        // Barra divisoria.
        const xOf = v => bar.x + (v / params.total) * bar.w;
        p.noStroke(); p.fill(C.N + 'AA'); p.rect(bar.x, bar.y, xOf(st.a) - bar.x, bar.h, 8, 0, 0, 8);
        p.fill(C.Z + 'AA'); p.rect(xOf(st.a), bar.y, bar.x + bar.w - xOf(st.a), bar.h, 0, 8, 8, 0);
        p.stroke(C.ink); p.strokeWeight(3); p.line(xOf(st.a), bar.y - 6, xOf(st.a), bar.y + bar.h + 6);
        p.noStroke(); p.fill(C.card); p.stroke(C.brand); p.strokeWeight(2); p.circle(xOf(st.a), bar.y + bar.h / 2, 26);
        p.noStroke(); p.fill(C.ink); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.text(`A: ${fmt(st.a)}`, bar.x + 6, bar.y + bar.h + 16);
        p.textAlign(p.RIGHT, p.CENTER); p.text(`B: ${fmt(params.total - st.a)}`, bar.x + bar.w - 6, bar.y + bar.h + 16);
        // Bodegas con el reparto actual; sacos viajando durante la animación.
        const t = anim > 0 ? 1 - anim / 36 : 1;
        const moving = (st.a * params.move) / 100;
        pile(boxA, Math.round(st.a - moving * t), C.N, 'Bodega A');
        pile(boxB, Math.round(params.total - st.a + moving * t), C.Z, 'Bodega B');
        if (anim > 0) {
          anim--;
          for (let i = 0; i < 3; i++) {
            const k = Math.min(1, Math.max(0, t * 1.4 - i * 0.15));
            sack(boxA.x + boxA.w - 10 + (boxB.x + 10 - boxA.x - boxA.w + 10) * k, boxA.y + boxA.h * 0.5 - Math.sin(k * Math.PI) * 40 + i * 14, 14, C.N);
          }
        }
        p.stroke(C.mute); p.strokeWeight(2); p.line(boxA.x + boxA.w + 4, boxA.y + boxA.h * 0.5, boxB.x - 4, boxA.y + boxA.h * 0.5);
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textAlign(p.CENTER, p.BOTTOM); p.text(`${params.move} %`, W / 2, boxA.y + boxA.h * 0.5 - 4);
        // Totales después del viaje.
        const y0 = boxA.y + boxA.h + 16;
        p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.NORMAL); p.text('después del viaje', W / 2, y0);
        p.fill(col); p.textSize(18); p.textStyle(p.BOLD);
        p.text(`A ${fmt(r.a)}   ${good ? '=' : '≠'}   B ${fmt(r.b)}`, W / 2, y0 + 16);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked && !good ? `Debían ser ${fmt(answerOf(params))} en A y ${fmt(params.total - answerOf(params))} en B` : 'Arrastra el divisor y suelta para ver el viaje', W / 2, H - 12);
      };

      p.mousePressed = () => {
        if (locked) return;
        if (p.mouseY >= bar.y - 16 && p.mouseY <= bar.y + bar.h + 16) { drag = true; setA(((p.mouseX - bar.x) / bar.w) * params.total); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; setA(((p.mouseX - bar.x) / bar.w) * params.total); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; anim = 36; api.sfx?.tap?.(); return false; };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
