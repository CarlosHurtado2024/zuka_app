// Pregunta de examen (lectura, kit LEC; spec 2026-11-19-preuda-lectura-textos): el formato real del examen de admisión, con el
// texto arriba en párrafos numerados, el enunciado y cuatro opciones A–D. Se toca una opción. Es el único juego de opción
// múltiple de lectura y va solo en evaluaciones y entrenamiento, nunca en lecciones: el examen es así y hay que practicarlo.
// params = { doc | docs, q, options: [4], answer }
// state = { pick: índice o -1 }
GAMES['pregunta-examen'] = (() => {
  const L = 'ABCD';
  function grade(state, params) {
    return { ok: state?.pick === params.answer, solution: `${L[params.answer]}. ${params.options[params.answer]}` };
  }
  function create(host, params, api) {
    const st = { pick: -1 };
    let locked = false;
    const box = document.createElement('div');
    box.className = 'lec lec-examen';
    box.innerHTML = `${LEC.docs(params)}<div class="lec-play"></div>`;
    host.appendChild(box);
    const play = box.querySelector('.lec-play');
    function render() {
      play.innerHTML = `<p class="lec-q">${LEC.fmt(params.q)}</p><div class="lec-opts" role="radiogroup" aria-label="Opciones">${params.options.map((o, i) => {
        const cls = locked ? (i === params.answer ? ' good' : i === st.pick ? ' bad' : '') : i === st.pick ? ' on' : '';
        return `<span class="lec-opt${cls}" role="radio" tabindex="${locked ? -1 : (st.pick < 0 ? (i === 0 ? 0 : -1) : (i === st.pick ? 0 : -1))}" aria-checked="${i === st.pick}" data-i="${i}"><b>${L[i]}.</b><span>${LEC.fmt(o)}</span></span>`;
      }).join('')}</div>`;
    }
    const pick = i => { st.pick = i; api.sfx?.tap?.(); render(); play.querySelector(`.lec-opt[data-i="${i}"]`)?.focus({ preventScroll: true }); api.ready(true); };
    play.addEventListener('click', e => { const o = e.target.closest('.lec-opt'); if (o && !locked) pick(+o.dataset.i); });
    play.addEventListener('keydown', e => {
      const o = e.target.closest('.lec-opt');
      if (!o || locked) return;
      const i = +o.dataset.i, d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); e.stopPropagation(); pick((i + d + 4) % 4); }
      else if (e.key === ' ') { e.preventDefault(); e.stopPropagation(); pick(i); }
    });
    LEC.guardKeys(box);
    render();
    return {
      loaded: Promise.resolve(),
      getState: () => ({ pick: st.pick }),
      lock() { locked = true; render(); },
      destroy() { box.remove(); },
      peek: () => ({ state: st, solve: params.answer }),
    };
  }
  return { grade, create };
})();
