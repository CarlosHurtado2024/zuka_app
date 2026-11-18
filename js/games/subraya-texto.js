// Subraya el texto (preUDA, comprensión lectora; spec 2026-11-18-curso-preuda): el estudiante lee un fragmento y, como
// con un resaltador, toca los trozos que responden la consigna: el dato, la paráfrasis fiel, el referente de un
// pronombre, el conector, la voz de un experto, la frase irónica. Puede pedir uno o varios trozos. No hay reloj ni
// opciones aparte: la respuesta está en el texto y hay que encontrarla. Nada se revela hasta comprobar.
// Es HTML (no lienzo): el texto largo se lee mejor y se adapta solo al ancho y al tema (variables de la app).
// params = { rounds: [{ title?, text: 'trozo|trozo|…', ask, answer: [índices de trozos] }] }
// state = { rounds: [{ sel: [índices subrayados] }] }

GAMES['subraya-texto'] = (() => {
  const pieces = r => r.text.split('|');
  const same = (a, b) => !!a && a.length === b.length && b.every(k => a.includes(k));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state?.rounds?.[i]?.sel, r.answer));
    const solution = params.rounds.map(r => r.answer.map(k => `«${pieces(r)[k].trim()}»`).join(' y ')).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
    const st = { rounds: params.rounds.map(() => ({ sel: [] })) };
    let at = 0, locked = false, okAll = null;
    const box = document.createElement('div');
    box.className = 'subraya';
    host.appendChild(box);
    const done = () => st.rounds.every(r => r.sel.length > 0);

    function render() {
      const r = params.rounds[at], sel = st.rounds[at].sel;
      const tabs = params.rounds.length > 1 ? `<div class="sb-tabs" role="tablist">${params.rounds.map((_, i) =>
        `<button type="button" role="tab" class="sb-tab${i === at ? ' on' : ''}${st.rounds[i].sel.length ? ' has' : ''}" data-tab="${i}" aria-selected="${i === at}">${i + 1}</button>`).join('')}</div>` : '';
      const mark = k => {
        if (!locked) return sel.includes(k) ? ' on' : '';
        const good = r.answer.includes(k), picked = sel.includes(k);
        return good ? (picked ? ' good' : ' good miss') : picked ? ' extra' : '';
      };
      box.innerHTML = `${tabs}
        <p class="sb-ask">${esc(r.ask)}</p>
        ${r.title ? `<p class="sb-title">${esc(r.title)}</p>` : ''}
        <p class="sb-text">${pieces(r).map((t, k) => `<span role="button" tabindex="${locked ? -1 : 0}" class="sb-piece${mark(k)}${locked ? ' off' : ''}" data-k="${k}" aria-pressed="${sel.includes(k)}">${esc(t.trim())}</span>`).join(' ')}</p>
        <p class="sb-foot">${locked ? (okAll ? 'Bien subrayado.' : 'En verde lo que había que subrayar; con borde, lo que faltó; tachado, lo que sobraba.') : sel.length ? `Subrayaste ${sel.length} ${sel.length === 1 ? 'trozo' : 'trozos'}. Toca otra vez para quitar.` : 'Toca los trozos del texto que respondan.'}</p>`;
    }
    // Las clases propias (no [data-tab]): la app pone data-tab en <body> y closest lo encontraría.
    const pick = p => {
      const k = +p.dataset.k, sel = st.rounds[at].sel, j = sel.indexOf(k);
      j >= 0 ? sel.splice(j, 1) : sel.push(k);
      api.sfx?.tap?.();
      render();
      box.querySelector(`.sb-piece[data-k="${k}"]`)?.focus({ preventScroll: true });
      api.ready(done());
    };
    box.addEventListener('keydown', e => {
      const p = e.target.closest('.sb-piece');
      if (p && !locked && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(p); }
    });
    box.addEventListener('click', e => {
      const tab = e.target.closest('.sb-tab');
      if (tab) { at = +tab.dataset.tab; render(); return; }
      const p = e.target.closest('.sb-piece');
      if (!p || locked) return;
      pick(p);
    });
    render();
    return {
      loaded: Promise.resolve(),
      getState: () => JSON.parse(JSON.stringify(st)),
      lock(ok) { locked = true; okAll = ok; render(); },
      destroy() { box.remove(); },
      peek: () => ({ at, state: st }),
    };
  }

  return { grade, create };
})();
