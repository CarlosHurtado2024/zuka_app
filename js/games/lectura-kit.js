// Kit LEC de comprensión lectora (spec 2026-11-19-preuda-lectura-textos). Juegos en HTML (el texto largo se lee mejor que en un
// lienzo y se adapta solo al ancho y al tema): un panel con el texto de la lección en párrafos numerados y una fábrica de juegos
// de fichas que se arrastran a zonas. Se arrastra con el dedo o el ratón; también se toca la ficha y luego la zona, y con el
// teclado (Enter o espacio). Nada dice si va bien hasta comprobar; la escena sí reacciona en vivo (la balanza se inclina, el
// esqueleto del texto se arma, la oración se lee con la palabra puesta).
//   LEC.doc(doc, { hideBody })      → HTML del panel. doc = { id, title, ficha?: { autor, fuente, fecha }, paras: [...] }
//   LEC.drop(name, def)             → { grade, create } para GAMES[name]. def.norm(params) da las rondas
//                                     { ask, chips: [texto], zones: [{ label, cap }], key: [zona | [zonas] | null por ficha] }
//                                     y def.render(r, ui) arma la escena con ui.zone(i), ui.chip(c), ui.pool(), ui.placed(i).
//   LEC.rounds(name, params)        → las rondas normalizadas (para las pruebas).
const LEC = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
  // Texto con __subrayado__ (la palabra por la que pregunta el examen) y **negrita**.
  const fmt = s => esc(s).replace(/__(.+?)__/g, '<u>$1</u>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const DEFS = {};
  let made = 0;

  function doc(d, o = {}) {
    if (!d) return '';
    const ficha = d.ficha ? `<p class="lec-ficha">${[d.ficha.autor, d.ficha.fuente, d.ficha.fecha].filter(Boolean).map(esc).join(' · ')}</p>` : '';
    const body = o.hideBody
      ? '<p class="lec-hidden">El texto se abre cuando termines de anticipar.</p>'
      : d.paras.map((p, i) => `<p class="lec-p"><span class="lec-pn" aria-label="párrafo ${i + 1}">${i + 1}</span>${fmt(p)}</p>`).join('');
    return `<details class="lec-doc"${o.closed ? '' : ' open'}><summary><span class="lec-dk">${esc(o.label || 'Texto')}</span><span class="lec-dt">${esc(d.title)}</span></summary>${ficha}<div class="lec-body">${body}</div></details>`;
  }
  const docs = (p, o) => p.docs ? p.docs.map((d, i) => doc(d, { ...o, label: ['Texto Uno', 'Texto Dos'][i], closed: i > 0 })).join('') : doc(p.doc, o);
  const keyOf = k => k == null ? [] : [].concat(k);
  // Orden fijo pero revuelto para mostrar fichas y tonos: los datos ponen la respuesta primero o en el orden de los párrafos, y
  // en pantalla eso no puede notarse. Depende solo del texto, así que no cambia al repintar ni entre sesiones.
  const hash = t => { let h = 2166136261; for (const ch of String(t)) h = Math.imul(h ^ ch.codePointAt(0), 16777619); return h >>> 0; };
  const mix = list => list.map((t, i) => [hash(`${t}·${list.length}`), i]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const first = (s, n = 7) => { const w = s.replace(/__|\*\*/g, '').split(/\s+/); return w.slice(0, n).join(' ') + (w.length > n ? '…' : ''); };

  function rounds(name, params) { return DEFS[name].norm(params); }
  // Enter y las flechas sobre el texto, una ficha o una zona no siguen hasta la lección: allá Enter comprueba la respuesta y
  // ← / → cambian de ejercicio. El <summary> conserva su Enter para plegar el texto.
  function guardKeys(box) {
    box.addEventListener('keydown', e => {
      if (['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && e.target !== box) e.stopPropagation();
    });
  }

  function drop(name, def) {
    DEFS[name] = def;
    function grade(state, params) {
      const rs = def.norm(params);
      const ok = rs.every((r, i) => r.key.every((k, c) => {
        const z = state?.rounds?.[i]?.place?.[c] ?? -1;
        return k == null ? z === -1 : keyOf(k).includes(z);
      }));
      const solution = def.solution ? def.solution(rs, params) : rs.map(r => r.zones.map((z, zi) => {
        const cs = r.chips.filter((_, c) => keyOf(r.key[c])[0] === zi);
        return cs.length ? `${z.label}: ${cs.map(t => `«${t}»`).join(', ')}` : '';
      }).filter(Boolean).join(' · ')).join(' | ');
      return { ok, solution };
    }

    function create(host, params, api) {
      const rs = def.norm(params), uid = ++made;
      const st = { rounds: rs.map(r => ({ place: r.chips.map(() => -1) })) };
      let at = 0, sel = -1, locked = false, okAll = null, drag = null;
      const box = document.createElement('div');
      box.className = `lec lec-${name}`;
      box.innerHTML = `${docs(params, { hideBody: def.hideBody })}<div class="lec-play"></div>`;
      host.appendChild(box);
      const play = box.querySelector('.lec-play');
      const needAll = r => r.key.every(k => k != null);
      const roundReady = i => {
        const r = rs[i], pl = st.rounds[i].place;
        if (needAll(r)) return pl.every(z => z >= 0);
        return pl.some(z => z >= 0) && r.zones.every((z, zi) => z.cap !== 1 || pl.includes(zi));
      };
      const isReady = () => rs.every((_, i) => roundReady(i));

      function ui(i) {
        const r = rs[i], pl = st.rounds[i].place;
        const mark = c => {
          if (!locked) return c === sel ? ' sel' : '';
          const good = r.key[c] == null ? pl[c] === -1 : keyOf(r.key[c]).includes(pl[c]);
          return pl[c] === -1 && r.key[c] == null ? ' off' : good ? ' good' : ' bad';
        };
        const chip = c => `<span class="lec-chip${mark(c)}" role="button" tabindex="${locked ? -1 : 0}" data-c="${c}" aria-pressed="${c === sel}">${fmt(r.chips[c])}</span>`;
        const placed = zi => r.chips.map((_, c) => c).filter(c => pl[c] === zi);
        const zone = (zi, o = {}) => {
          const z = r.zones[zi], tag = o.inline ? 'span' : 'div', inside = placed(zi).map(chip).join('');
          return `<${tag} class="lec-zone${inside ? ' full' : ''}${o.cls ? ` ${o.cls}` : ''}" role="group" tabindex="${locked ? -1 : 0}" data-zi="${zi}" aria-label="${esc(z.label)}${inside ? '' : ', vacía'}">${o.noLabel ? '' : `<span class="lec-zl">${fmt(z.label)}</span>`}${o.before || ''}${inside || (o.inline ? '<span class="lec-gap"> </span>' : '')}${o.after || ''}</${tag}>`;
        };
        const pool = () => {
          const order = mix(r.chips), free = order.filter(c => pl[c] === -1);
          return `<div class="lec-pool" role="group" tabindex="${locked ? -1 : 0}" aria-label="Bandeja de fichas">${free.map(chip).join('') || '<span class="lec-empty">Todas las fichas están puestas.</span>'}</div>`;
        };
        return { r, pl, chip, zone, pool, placed, fmt, esc, first, locked, doc: params.doc, count: zi => placed(zi).length };
      }

      function render() {
        const r = rs[at], n = rs.length;
        const tabs = n > 1 ? `<div class="lec-tabs" role="tablist">${rs.map((_, i) => `<span role="tab" class="lec-tab${i === at ? ' on' : ''}${st.rounds[i].place.some(z => z >= 0) ? ' has' : ''}" data-tab="${i}" id="lec-tab-${uid}-${i}" aria-selected="${i === at}" tabindex="${i === at ? 0 : -1}">${i + 1}</span>`).join('')}</div>` : '';
        const scene = (def.render || defaultRender)(r, ui(at));
        const foot = locked ? (okAll ? 'Muy bien.' : 'En verde lo que quedó bien; en rojo lo que va en otro lugar.')
          : sel >= 0 ? 'Ahora toca la zona donde va (o arrástrala).' : (def.foot || 'Arrastra cada ficha a su lugar, o tócala y luego toca la zona.');
        play.innerHTML = `${tabs}${r.ask ? `<p class="lec-ask">${fmt(r.ask)}</p>` : ''}${scene}<p class="lec-foot">${foot}</p>`;
        if (def.hideBody && locked) box.querySelector('.lec-body').innerHTML = params.doc.paras.map((p, i) => `<p class="lec-p"><span class="lec-pn">${i + 1}</span>${fmt(p)}</p>`).join('');
      }
      function defaultRender(r, u) {
        return `<div class="lec-zones lec-${def.layout || 'bins'}">${r.zones.map((_, zi) => u.zone(zi)).join('')}</div>${u.pool()}`;
      }
      function place(c, zi) {
        const r = rs[at], pl = st.rounds[at].place;
        if (zi >= 0 && r.zones[zi].cap === 1) pl.forEach((z, k) => { if (z === zi && k !== c) pl[k] = -1; });
        pl[c] = zi; sel = -1;
        api.sfx?.tap?.();
        render();
        api.ready(isReady());
      }
      const focusChip = c => play.querySelector(`.lec-chip[data-c="${c}"]`)?.focus({ preventScroll: true });

      play.addEventListener('pointerdown', e => {
        const ch = e.target.closest('.lec-chip');
        if (!ch || locked || e.button > 0 || drag) return;
        drag = { c: +ch.dataset.c, x: e.clientX, y: e.clientY, el: ch, ghost: null, id: e.pointerId };
        (() => { try { ch.setPointerCapture(e.pointerId); } catch { /* puntero sintético */ } })();
        e.preventDefault();
      });
      play.addEventListener('pointermove', e => {
        if (!drag || e.pointerId !== drag.id) return;
        if (!drag.ghost && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) {
          drag.ghost = drag.el.cloneNode(true);
          drag.ghost.classList.add('lec-ghost');
          document.body.appendChild(drag.ghost);
          drag.el.classList.add('lifting');
        }
        if (drag.ghost) {
          drag.ghost.style.left = `${e.clientX}px`; drag.ghost.style.top = `${e.clientY}px`;
          play.querySelectorAll('.lec-zone.over').forEach(z => z.classList.remove('over'));
          drag.ghost.hidden = true;
          document.elementFromPoint(e.clientX, e.clientY)?.closest('.lec-zone')?.classList.add('over');
          drag.ghost.hidden = false;
        }
      });
      const endDrag = e => {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag; drag = null;
        if (d.ghost) {
          d.ghost.remove();
          const t = e.type === 'pointercancel' ? null : document.elementFromPoint(e.clientX, e.clientY);
          const z = t?.closest('.lec-zone'), pool = t?.closest('.lec-pool');
          if (z && play.contains(z)) place(d.c, +z.dataset.zi);
          else if (pool && play.contains(pool)) place(d.c, -1);
          else render();
        } else if (e.type === 'pointerup') {
          const z = d.el.closest('.lec-zone');
          if (z && sel >= 0 && sel !== d.c) { const c = sel; place(c, +z.dataset.zi); focusChip(c); return; }
          sel = sel === d.c ? -1 : d.c; api.sfx?.tap?.(); render(); focusChip(d.c);
        }
      };
      play.addEventListener('pointerup', endDrag);
      play.addEventListener('pointercancel', endDrag);
      play.addEventListener('click', e => {
        const tab = e.target.closest('.lec-tab');
        if (tab) { at = +tab.dataset.tab; sel = -1; render(); return; }
        if (locked || e.target.closest('.lec-chip')) return;
        const z = e.target.closest('.lec-zone');
        if (z && sel >= 0) { place(sel, +z.dataset.zi); return; }
        if (e.target.closest('.lec-pool') && sel >= 0) place(sel, -1);
      });
      // Las teclas que usa el juego no siguen hasta la lección (allá Enter comprueba y las flechas cambian de ejercicio).
      play.addEventListener('keydown', e => {
        const act = e.key === 'Enter' || e.key === ' ';
        const tab = e.target.closest('.lec-tab');
        if (tab) {
          const to = typeof rovingIndex === 'function' ? rovingIndex(e.key, at, rs.length) : -1;
          if (to < 0) { if (act) e.stopPropagation(); return; }
          e.preventDefault(); e.stopPropagation(); at = to; sel = -1; render();
          play.querySelector(`.lec-tab[data-tab="${at}"]`)?.focus();
          return;
        }
        if (!act || locked) return;
        const ch = e.target.closest('.lec-chip'), z = e.target.closest('.lec-zone');
        if (ch && !(z && sel >= 0 && sel !== +ch.dataset.c)) {
          e.preventDefault(); e.stopPropagation();
          const c = +ch.dataset.c; sel = sel === c ? -1 : c; render(); focusChip(c);
        } else if (z && sel >= 0) {
          e.preventDefault(); e.stopPropagation();
          const c = sel; place(c, +z.dataset.zi); focusChip(c);
        } else if (e.target.closest('.lec-pool') && sel >= 0) {
          e.preventDefault(); e.stopPropagation();
          const c = sel; place(c, -1); focusChip(c);
        }
      });
      guardKeys(box);
      render();
      return {
        loaded: Promise.resolve(),
        getState: () => JSON.parse(JSON.stringify(st)),
        lock(ok) { locked = true; okAll = ok; sel = -1; render(); },
        destroy() { drag?.ghost?.remove(); box.remove(); },
        // Para el robot del navegador: la ronda, el estado y la jugada de la clave.
        peek: () => ({ at, state: st, solve: rs.map(r => r.key.map(k => keyOf(k)[0] ?? -1)) }),
      };
    }
    return { grade, create };
  }

  // Relación que dibuja cada conector (conector-bisagra): se ve en vivo, no dice si es la que pide el texto.
  const REL = [
    [/^(pero|sin embargo|no obstante|aunque|en cambio|mientras que|por el contrario)/i, '↔', 'contraste'],
    [/^(por eso|por tanto|por lo tanto|así que|en consecuencia|de modo que|de ahí que)/i, '→', 'consecuencia'],
    [/^(porque|ya que|puesto que|dado que|pues)/i, '←', 'causa'],
    [/^(además|también|asimismo|incluso|más aún)/i, '+', 'suma'],
    [/^(por ejemplo|es decir|o sea|en otras palabras)/i, '=', 'aclara o ejemplifica'],
    [/^(en conclusión|en suma|en resumen|en fin)/i, '∴', 'cierra'],
    [/^(si|siempre que|con tal de que)\b/i, '⇒', 'condición'],
    [/^(después|luego|primero|al final|finalmente|antes|entonces)\b/i, '⇢', 'orden en el tiempo'],
  ];
  const rel = w => { const m = REL.find(([re]) => re.test(String(w).trim())); return m ? { sym: m[1], name: m[2] } : { sym: '·', name: 'otra relación' }; };

  return { esc, fmt, doc, docs, drop, rounds, first, rel, keyOf, guardKeys, mix };
})();
