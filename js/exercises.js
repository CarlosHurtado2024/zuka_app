// Tipos de ejercicio: opción múltiple, respuesta numérica, deslizador interactivo y ordenar pasos.
// Cada uno devuelve { check() → { ok, solution }, lock(ok), key?(n), destroy?() }.

function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Acepta "2.5", "2,5", "-3" o fracciones "3/4".
function parseNum(s) {
  s = String(s).trim().replace(/\s/g, '').replace(',', '.');
  if (!s) return NaN;
  const fr = s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
  return fr ? +fr[1] / +fr[2] : Number(s);
}

const EX_KIND = { mc: 'Elige la respuesta', input: 'Escribe la respuesta', slider: 'Experimenta', order: 'Ordena', play: 'Juega' };

const EX = {
  mc(area, ex, ready) {
    const order = shuffle(ex.options.map((_, i) => i));
    let sel = null;
    area.innerHTML = `<div class="opts">${order.map((i, k) =>
      `<button class="opt" data-i="${i}"><span class="key">${k + 1}</span><span>${tex(ex.options[i])}</span></button>`).join('')}</div>`;
    const btns = [...area.querySelectorAll('.opt')];
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.toggle('sel', x === b));
      sel = +b.dataset.i;
      ready(true); Sfx.tap();
    }));
    return {
      check: () => ({ ok: sel === ex.answer, solution: ex.options[ex.answer] }),
      key: k => btns[+k - 1]?.click(),
      lock() {
        btns.forEach(b => {
          b.disabled = true;
          if (+b.dataset.i === ex.answer) b.classList.add('right');
          else if (b.classList.contains('sel')) b.classList.add('wrong');
        });
      },
    };
  },

  input(area, ex, ready) {
    area.innerHTML = `<label class="num">${ex.prefix ? `<span>${tex(ex.prefix)}</span>` : ''}
      <input inputmode="decimal" autocomplete="off" enterkeyhint="done" placeholder="Tu respuesta" aria-label="Respuesta">
      ${ex.suffix ? `<span class="unit">${esc(ex.suffix)}</span>` : ''}</label>
      <p class="hint">Puedes escribir decimales o fracciones (ej. 3/4).</p>`;
    const inp = area.querySelector('input');
    inp.addEventListener('input', () => ready(inp.value.trim() !== ''));
    setTimeout(() => { if (typeof guideOpen === 'undefined' || !guideOpen) inp.focus({ preventScroll: true }); }, 300);   // con la guía abierta, el teclado espera
    return {
      check() {
        // «400.000» con puntos de miles: si la respuesta es un entero grande, los puntos separan miles.
        const raw = inp.value.trim(), miles = Number.isInteger(ex.answer) && Math.abs(ex.answer) >= 1000 && /^-?\d{1,3}(\.\d{3})+$/.test(raw);
        const v = miles ? +raw.replace(/\./g, '') : parseNum(inp.value), tol = ex.tol ?? 0.001 * Math.max(1, Math.abs(ex.answer));
        return { ok: Math.abs(v - ex.answer) <= tol, solution: ex.answerText || `$${ex.answer}$${ex.suffix ? ' ' + ex.suffix : ''}` };
      },
      lock(ok) { inp.disabled = true; inp.parentElement.classList.add(ok ? 'right' : 'wrong'); },
    };
  },

  slider(area, ex, ready) {
    area.innerHTML = `<div class="sim"><canvas></canvas></div><div class="readout"></div>
      <input type="range" class="range" min="${ex.min}" max="${ex.max}" step="${ex.step}" value="${ex.init}" aria-label="Valor">
      <div class="range-ends"><span>${ex.min}</span><span>${ex.max}</span></div>`;
    const cv = area.querySelector('canvas'), ctx = cv.getContext('2d');
    const range = area.querySelector('.range'), readout = area.querySelector('.readout');
    let val = +ex.init;
    const fill = () => range.style.setProperty('--fill', ((val - ex.min) / (ex.max - ex.min)) * 100 + '%');
    const draw = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      if (!r.width) return;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0f1226'; ctx.fillRect(0, 0, r.width, r.height);
      const pad = Math.max(30, r.width * 0.08);
      drawViz(ctx, ex.viz, 1, { x: pad, y: 14, w: r.width - pad - 14, h: r.height - 38 }, val);
    };
    const update = () => { readout.innerHTML = tex(ex.readout ? ex.readout(val) : String(val)); fill(); draw(); };
    range.addEventListener('input', () => { val = +range.value; update(); ready(true); });
    const ro = new ResizeObserver(draw);
    ro.observe(cv);
    update();
    return {
      check: () => ({ ok: ex.check(val), solution: ex.answerText }),
      lock(ok) { range.disabled = true; area.querySelector('.sim').classList.add(ok ? 'right' : 'wrong'); },
      destroy: () => ro.disconnect(),
    };
  },

  order(area, ex, ready) {
    let pool = shuffle(ex.items.map((_, i) => i));
    while (ex.items.length > 1 && pool.every((v, i) => v === i)) pool = shuffle(pool);
    const picked = [];
    let locked = false;
    const tile = (i, from) => `<button class="tile" data-i="${i}" data-from="${from}"${locked ? ' disabled' : ''}>${tex(ex.items[i])}</button>`;
    const render = () => {
      area.innerHTML = `<div class="slots">${picked.length
        ? picked.map((i, k) => `<div class="slot"><span class="slot-n">${k + 1}</span>${tile(i, 'picked')}</div>`).join('')
        : '<span class="slots-hint">Toca las fichas en el orden correcto</span>'}</div>
        <div class="bank">${pool.map(i => tile(i, 'pool')).join('')}</div>`;
      area.querySelectorAll('.tile').forEach(b => b.addEventListener('click', () => {
        const i = +b.dataset.i;
        const [from, to] = b.dataset.from === 'pool' ? [pool, picked] : [picked, pool];
        from.splice(from.indexOf(i), 1); to.push(i);
        Sfx.tap(); render(); ready(pool.length === 0);
      }));
    };
    render();
    return {
      check: () => ({ ok: picked.every((v, i) => v === i), solution: ex.items.join(' → ') }),
      lock(ok) { locked = true; render(); area.querySelector('.slots').classList.add(ok ? 'right' : 'wrong'); },
    };
  },
};

// Minijuego de p5.js: adapta GAMES[ex.game] (js/games/) al contrato de los demás ejercicios.
EX.play = (area, ex, ready) => {
  const game = GAMES[ex.game];
  area.innerHTML = '<div class="play"></div>';
  const box = area.querySelector('.play');
  if (!game) {
    box.innerHTML = `<p class="play-msg">Este ejercicio no está disponible (${esc(ex.game)}).</p>`;
    return { check: () => ({ ok: false, solution: '' }), lock() {}, destroy() {} };
  }
  if (ex.canvasGuide && !game.demo && typeof guideSteps === 'function') {
    const text = guideSteps(ex).find(([scene]) => !['start', 'rounds', 'lives', 'check'].includes(scene))?.[1];
    if (text) box.zukaCanvasGuide = { text, first: !ex.exam, until: 0, locked: false };
  }
  ready(false);
  const inst = game.create(box, ex.params, { ready, sfx: Sfx, palette: PALETTE, tex });
  inst.loaded?.catch(() => {
    box.innerHTML = '<p class="play-msg">Necesitas conexión para este ejercicio.</p>';
    ready(false);
  });
  return {
    check: () => game.grade(inst.getState(), ex.params),
    // El marco del juego se pinta del color del resultado (y se sacude si falló).
    lock: ok => {
      if (box.zukaCanvasGuide) box.zukaCanvasGuide.locked = true;
      inst.lock(ok); box.classList.add(ok ? 'right' : 'wrong'); playFx(box, ok);
    },
    destroy: () => inst.destroy(),
    // «Cómo se juega» en un juego que se explica sobre el lienzo (spec 2026-11-18-demo-en-juego).
    demo: () => inst.demo ? inst.demo() : box.zukaCanvasGuide?.replay?.(),
  };
};

// Pista: un botón bajo el enunciado que, al tocarlo, deja ver un empujón (sin regalar la respuesta).
function hintBlock(ex) {
  const guide = typeof guideButton === 'function' ? guideButton(ex) : '';
  if (!ex.hint && !guide) return '';
  return `<div class="ex-hint"><div class="ex-tools">${guide}${ex.hint ? `<button type="button" class="hint-btn hint-open">${ICON.bulb}<span>Ver pista</span></button>` : ''}</div>`
    + (ex.hint ? `<p class="hint-text" hidden>${ICON.bulb}<span>${tex(ex.hint)}</span></p>` : '') + '</div>';
}

// Bajo el enunciado van los botones «Cómo se juega» (js/guia.js) y «Ver pista». La guía sale sola la primera vez
// que el estudiante ve ese juego o ese tipo de ejercicio.
function renderExercise(el, ex, ready) {
  const algebra = ex.canvasGuide ? ' algebra-practice' : '';
  const kind = !ex.canvasGuide || ex.exam ? `<p class="ex-kind">${EX_KIND[ex.type]}</p>` : '';
  el.innerHTML = `<div class="ex${algebra}"><header class="ex-head">${kind}<h2 class="ex-q">${tex(ex.q)}</h2></header>${hintBlock(ex)}<div class="ex-area"></div></div>`;
  const gb = el.querySelector('.guide-btn');
  const focusInput = () => el.querySelector('.num input:not(:disabled)')?.focus({ preventScroll: true });
  let guide = null;
  if (typeof guideWanted === 'function' && guideWanted(ex)) guide = openGuide(ex, { auto: true, onClose: focusInput });
  const hb = el.querySelector('.hint-open');
  if (hb) hb.onclick = () => { hb.hidden = true; el.querySelector('.hint-text').hidden = false; Sfx.tap(); };
  const h = EX[ex.type](el.querySelector('.ex-area'), ex, ready), destroy = h.destroy;
  // Si el juego se explica sobre el lienzo, el botón repite esa demostración; si no, abre la tarjeta de siempre.
  if (gb) gb.onclick = () => { Sfx.tap(); h.demo && (GAMES[ex.game]?.demo || ex.canvasGuide) ? h.demo() : (guide = openGuide(ex)); el.querySelector('.play')?.scrollIntoView({ block: 'nearest' }); };
  // Al quitar el ejercicio (otra pregunta, salir de la lección) su guía no se queda flotando.
  h.destroy = () => { if (guide && guideOpen === guide) guide.close(true); destroy?.(); };
  return h;
}
