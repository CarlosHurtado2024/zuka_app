// El hilo del referente (lectura, kit LEC): en una oración del texto, una expresión que apunta a otra parte («este último», «aquella»,
// «la primera», «ellos») tiene un nudo. Se tira el hilo desde el nudo hasta las palabras a las que se refiere y queda tendido
// entre las dos. También se puede tocar el destino. Entrena «la expresión X alude a…».
// params = { doc, rounds: [{ p, text: 'trozo|trozo|…', from, answer, ask? }] }   (los trozos unidos están en el párrafo p)
// state = { rounds: [{ to: índice del trozo de destino o -1 }] }
GAMES['hilo-referente'] = (() => {
  let made = 0;
  const parts = r => r.text.split('|');
  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state?.rounds?.[i]?.to === r.answer);
    const solution = params.rounds.map(r => `«${parts(r)[r.from].trim()}» → «${parts(r)[r.answer].trim()}»`).join(' · ');
    return { ok, solution };
  }
  function create(host, params, api) {
    const rs = params.rounds, uid = ++made, st = { rounds: rs.map(() => ({ to: -1 })) };
    let at = 0, locked = false, okAll = null, drag = null;
    const box = document.createElement('div');
    box.className = 'lec lec-hilo';
    box.innerHTML = `${LEC.docs(params)}<div class="lec-play"></div>`;
    host.appendChild(box);
    const play = box.querySelector('.lec-play');
    const isTarget = t => /\p{L}|\d/u.test(t);
    function render() {
      const r = rs[at], to = st.rounds[at].to, ps = parts(r);
      const tabs = rs.length > 1 ? `<div class="lec-tabs" role="tablist">${rs.map((_, i) => `<span role="tab" class="lec-tab${i === at ? ' on' : ''}${st.rounds[i].to >= 0 ? ' has' : ''}" data-tab="${i}" id="lec-tab-h${uid}-${i}" aria-selected="${i === at}" tabindex="${i === at ? 0 : -1}">${i + 1}</span>`).join('')}</div>` : '';
      const piece = (t, k) => {
        if (k === r.from) return `<span class="lec-from">${LEC.fmt(t)}<span class="lec-knob" role="button" tabindex="-1" aria-hidden="true"></span></span>`;
        if (!isTarget(t)) return LEC.fmt(t);
        const cls = locked ? (k === r.answer ? (k === to ? ' good' : ' good miss') : k === to ? ' bad' : '') : k === to ? ' on' : '';
        return `<span class="lec-tgt${cls}" role="button" tabindex="${locked ? -1 : 0}" data-k="${k}" aria-pressed="${k === to}">${LEC.fmt(t)}</span>`;
      };
      play.innerHTML = `${tabs}<p class="lec-ask">${LEC.fmt(r.ask || `¿A qué se refiere «${ps[r.from].trim()}»? Tira el hilo desde el nudo.`)}</p>`
        + `<div class="lec-thread"><svg class="lec-svg" aria-hidden="true"><path class="lec-line"/></svg><p class="lec-sent"><span class="lec-pn">${r.p}</span>${ps.map(piece).join('')}</p></div>`
        + `<p class="lec-foot">${locked ? (okAll ? 'El hilo llega a su lugar.' : 'En verde el destino correcto.') : to >= 0 ? `El hilo llega a «${ps[to].trim()}». Puedes moverlo.` : 'Arrastra el nudo hasta las palabras a las que se refiere, o tócalas.'}</p>`;
      requestAnimationFrame(() => line(to >= 0 ? play.querySelector(`.lec-tgt[data-k="${to}"]`) : null));
    }
    function line(target, pt) {
      const wrap = play.querySelector('.lec-thread'), knob = play.querySelector('.lec-knob'), path = play.querySelector('.lec-line');
      if (!wrap || !knob || !path) return;
      const W = wrap.getBoundingClientRect(), K = knob.getBoundingClientRect();
      const x0 = K.left + K.width / 2 - W.left, y0 = K.top + K.height / 2 - W.top;
      let x1, y1;
      if (pt) { x1 = pt[0] - W.left; y1 = pt[1] - W.top; } else if (target) { const T = target.getBoundingClientRect(); x1 = T.left + T.width / 2 - W.left; y1 = T.bottom - W.top - 2; } else { path.setAttribute('d', ''); return; }
      const lift = Math.max(26, Math.abs(x1 - x0) * 0.25);
      path.setAttribute('d', `M${x0} ${y0} C ${x0} ${Math.max(y0, y1) + lift}, ${x1} ${Math.max(y0, y1) + lift}, ${x1} ${y1}`);
    }
    function set(k) {
      st.rounds[at].to = k; api.sfx?.tap?.(); render();
      api.ready(st.rounds.every(s => s.to >= 0));
    }
    play.addEventListener('pointerdown', e => {
      if (locked || !e.target.closest('.lec-from')) return;
      drag = { id: e.pointerId }; (() => { try { e.target.setPointerCapture(e.pointerId); } catch { /* puntero sintético */ } })(); e.preventDefault();
    });
    play.addEventListener('pointermove', e => { if (drag && e.pointerId === drag.id) line(null, [e.clientX, e.clientY]); });
    const end = e => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      const t = e.type === 'pointerup' ? document.elementFromPoint(e.clientX, e.clientY)?.closest('.lec-tgt') : null;
      if (t && play.contains(t)) set(+t.dataset.k); else render();
    };
    play.addEventListener('pointerup', end);
    play.addEventListener('pointercancel', end);
    play.addEventListener('click', e => {
      const tab = e.target.closest('.lec-tab');
      if (tab) { at = +tab.dataset.tab; render(); return; }
      const t = e.target.closest('.lec-tgt');
      if (t && !locked) set(+t.dataset.k);
    });
    play.addEventListener('keydown', e => {
      const act = e.key === 'Enter' || e.key === ' ', tab = e.target.closest('.lec-tab');
      if (tab) {
        const to = typeof rovingIndex === 'function' ? rovingIndex(e.key, at, rs.length) : -1;
        if (to < 0) { if (act) e.stopPropagation(); return; }
        e.preventDefault(); e.stopPropagation(); at = to; render(); play.querySelector(`.lec-tab[data-tab="${at}"]`)?.focus();
        return;
      }
      const t = e.target.closest('.lec-tgt');
      if (t && act && !locked) { e.preventDefault(); e.stopPropagation(); const k = +t.dataset.k; set(k); play.querySelector(`.lec-tgt[data-k="${k}"]`)?.focus(); }
    });
    LEC.guardKeys(box);
    const onResize = () => render();
    window.addEventListener('resize', onResize);
    render();
    return {
      loaded: Promise.resolve(),
      getState: () => JSON.parse(JSON.stringify(st)),
      lock(ok) { locked = true; okAll = ok; render(); },
      destroy() { window.removeEventListener('resize', onResize); box.remove(); },
      peek: () => ({ at, state: st, solve: rs.map(r => r.answer) }),
    };
  }
  return { grade, create };
})();
