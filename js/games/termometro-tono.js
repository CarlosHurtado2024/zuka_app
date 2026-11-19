// El termómetro del tono (lectura, kit LEC): un fragmento del texto y un dial con los tonos posibles (irónico, crítico, neutral,
// nostálgico, entusiasta…). Se arrastra la aguja hasta el tono que tiene el fragmento; la aguja se queda donde se suelta.
// Entrena «el tono del texto es…» y la intención del autor.
// params = { doc?, rounds: [{ frag, scale: [3 a 5 tonos], answer, ask? }] }
// state = { rounds: [{ at: índice del tono o -1 }] }
GAMES['termometro-tono'] = (() => {
  let made = 0;
  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state?.rounds?.[i]?.at === r.answer);
    return { ok, solution: params.rounds.map(r => r.scale[r.answer]).join(' · ') };
  }
  function create(host, params, api) {
    const rs = params.rounds, uid = ++made, st = { rounds: rs.map(() => ({ at: -1 })) };
    let at = 0, locked = false, okAll = null, drag = null;
    const box = document.createElement('div');
    box.className = 'lec lec-tono';
    box.innerHTML = `${LEC.docs(params)}<div class="lec-play"></div>`;
    host.appendChild(box);
    const play = box.querySelector('.lec-play');
    const CX = 160, CY = 116, R = 84;   // las etiquetas van por fuera del arco, para que quepan los nombres largos
    const ang = (i, n) => Math.PI - (i + 0.5) * Math.PI / n;   // centro del sector i, de izquierda a derecha
    function render() {
      const r = rs[at], n = r.scale.length, cur = st.rounds[at].at, ord = LEC.mix(r.scale), pos = cur < 0 ? -1 : ord.indexOf(cur);
      const tabs = rs.length > 1 ? `<div class="lec-tabs" role="tablist">${rs.map((_, i) => `<span role="tab" class="lec-tab${i === at ? ' on' : ''}${st.rounds[i].at >= 0 ? ' has' : ''}" data-tab="${i}" id="lec-tab-t${uid}-${i}" aria-selected="${i === at}" tabindex="${i === at ? 0 : -1}">${i + 1}</span>`).join('')}</div>` : '';
      const sectors = ord.map((si, i) => {
        const t = r.scale[si];
        const a0 = Math.PI - i * Math.PI / n, a1 = Math.PI - (i + 1) * Math.PI / n, p = (a, rr) => `${CX + rr * Math.cos(a)} ${CY - rr * Math.sin(a)}`;
        const mid = ang(i, n), cls = locked ? (si === r.answer ? ' good' : si === cur ? ' bad' : '') : si === cur ? ' on' : '';
        const c = Math.cos(mid), lx = CX + (R + 9) * c, ly = CY - (R + 9) * Math.sin(mid), anchor = c > 0.25 ? 'start' : c < -0.25 ? 'end' : 'middle';
        return `<path class="lec-sec${cls}" data-i="${i}" d="M ${p(a0, R)} A ${R} ${R} 0 0 1 ${p(a1, R)} L ${p(a1, R - 40)} A ${R - 40} ${R - 40} 0 0 0 ${p(a0, R - 40)} Z"/>`
          + `<text class="lec-sec-t" x="${lx}" y="${ly + (anchor === 'middle' ? -2 : 4)}" text-anchor="${anchor}">${LEC.esc(t)}</text>`;
      }).join('');
      const a = pos >= 0 ? ang(pos, n) : Math.PI / 2, show = cur >= 0 || drag;
      const needle = `<g class="lec-needle${show ? '' : ' idle'}"><line x1="${CX}" y1="${CY}" x2="${CX + (R - 10) * Math.cos(drag?.a ?? a)}" y2="${CY - (R - 10) * Math.sin(drag?.a ?? a)}"/><circle cx="${CX}" cy="${CY}" r="7"/></g>`;
      play.innerHTML = `${tabs}<p class="lec-ask">${LEC.fmt(r.ask || '¿Qué tono tiene este fragmento? Lleva la aguja.')}</p>`
        + `<blockquote class="lec-frag">${LEC.fmt(r.frag)}</blockquote>`
        + `<svg class="lec-dial" viewBox="0 0 320 128" role="slider" tabindex="${locked ? -1 : 0}" aria-label="Tono" aria-valuemin="0" aria-valuemax="${n - 1}" aria-valuenow="${Math.max(0, pos)}" aria-valuetext="${cur >= 0 ? LEC.esc(r.scale[cur]) : 'sin elegir'}">${sectors}${needle}</svg>`
        + `<p class="lec-foot">${locked ? (okAll ? 'Bien leído.' : `El tono es: ${LEC.esc(r.scale[r.answer])}.`) : cur >= 0 ? `Elegiste: ${LEC.esc(r.scale[cur])}.` : 'Arrastra la aguja o toca un tono. Con el teclado, flechas.'}</p>`;
    }
    // i es la posición en el dial; el estado guarda el índice del tono en la lista original.
    const pick = i => { st.rounds[at].at = LEC.mix(rs[at].scale)[i]; api.sfx?.tap?.(); render(); api.ready(st.rounds.every(s => s.at >= 0)); };
    const sectorAt = e => {
      const svg = play.querySelector('.lec-dial'), B = svg.getBoundingClientRect(), k = 320 / B.width;
      const x = (e.clientX - B.left) * k - CX, y = CY - (e.clientY - B.top) * k;
      const a = Math.max(0.02, Math.min(Math.PI - 0.02, Math.atan2(Math.max(y, 0), x)));
      const n = rs[at].scale.length;
      return { a, i: Math.min(n - 1, Math.floor((Math.PI - a) / (Math.PI / n))) };
    };
    // Durante el arrastre solo se mueve la aguja (sin rehacer el dial, que perdería la captura del puntero).
    const moveNeedle = () => {
      const ln = play.querySelector('.lec-needle line');
      if (!ln) return;
      ln.setAttribute('x2', CX + (R - 10) * Math.cos(drag.a)); ln.setAttribute('y2', CY - (R - 10) * Math.sin(drag.a));
      play.querySelector('.lec-needle').classList.remove('idle');
      play.querySelectorAll('.lec-sec').forEach(s => s.classList.toggle('on', +s.dataset.i === drag.i));
    };
    play.addEventListener('pointerdown', e => {
      const dial = e.target.closest('.lec-dial');
      if (locked || !dial) return;
      drag = { id: e.pointerId, ...sectorAt(e) }; (() => { try { dial.setPointerCapture(e.pointerId); } catch { /* puntero sintético */ } })(); e.preventDefault(); moveNeedle();
    });
    play.addEventListener('pointermove', e => { if (drag && e.pointerId === drag.id) { Object.assign(drag, sectorAt(e)); moveNeedle(); } });
    const end = e => { if (!drag || e.pointerId !== drag.id) return; const i = drag.i; drag = null; if (e.type === 'pointerup') pick(i); else render(); };
    play.addEventListener('pointerup', end);
    play.addEventListener('pointercancel', end);
    play.addEventListener('click', e => { const tab = e.target.closest('.lec-tab'); if (tab) { at = +tab.dataset.tab; render(); } });
    play.addEventListener('keydown', e => {
      const tab = e.target.closest('.lec-tab');
      if (tab) {
        const to = typeof rovingIndex === 'function' ? rovingIndex(e.key, at, rs.length) : -1;
        if (to < 0) { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); return; }
        e.preventDefault(); e.stopPropagation(); at = to; render(); play.querySelector(`.lec-tab[data-tab="${at}"]`)?.focus();
        return;
      }
      if (!e.target.closest('.lec-dial') || locked) return;
      const n = rs[at].scale.length, cur = LEC.mix(rs[at].scale).indexOf(st.rounds[at].at), d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (!d) { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); return; }
      e.preventDefault(); e.stopPropagation();
      pick(Math.max(0, Math.min(n - 1, (cur < 0 ? (d > 0 ? -1 : n) : cur) + d)));
      play.querySelector('.lec-dial')?.focus();
    });
    LEC.guardKeys(box);
    render();
    return {
      loaded: Promise.resolve(),
      getState: () => JSON.parse(JSON.stringify(st)),
      lock(ok) { locked = true; okAll = ok; drag = null; render(); },
      destroy() { box.remove(); },
      peek: () => ({ at, state: st, solve: rs.map(r => r.answer) }),
    };
  }
  return { grade, create };
})();
