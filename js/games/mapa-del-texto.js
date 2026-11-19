// Mapa del texto (lectura, kit LEC): a cada párrafo se le arrastra la etiqueta de lo que hace (plantea, explica, da un ejemplo,
// objeta, concluye…). Abajo se va armando el esqueleto del texto, párrafo por párrafo. Entrena «el párrafo cumple la función de».
// params = { doc, labels: [etiquetas, pueden sobrar], key: [índice de la etiqueta de cada párrafo], ask? }
GAMES['mapa-del-texto'] = LEC.drop('mapa-del-texto', {
  norm: p => {
    const want = p.key.map(k => p.labels[k]);
    return [{
      ask: p.ask || 'Arrastra a cada párrafo lo que hace en el texto.',
      chips: p.labels,
      zones: p.doc.paras.map((_, i) => ({ label: `¶${i + 1}`, cap: 1 })),
      key: p.labels.map(t => { const zs = want.map((w, i) => w === t ? i : -1).filter(i => i >= 0); return zs.length ? zs : null; }),
    }];
  },
  render: (r, u) => {
    const rows = r.zones.map((_, zi) => u.zone(zi, { cls: 'lec-row', before: `<span class="lec-first">${u.esc(u.first(u.doc.paras[zi], 6))}</span>` })).join('');
    const esq = r.zones.map((_, zi) => { const c = u.placed(zi)[0]; return `<span class="lec-bone${c == null ? ' gap' : ''}">${zi + 1} ${c == null ? '…' : u.fmt(r.chips[c])}</span>`; }).join('<span class="lec-arrow">→</span>');
    return `<div class="lec-zones lec-rows">${rows}</div><div class="lec-esq" aria-label="Esqueleto del texto">${esq}</div>${u.pool()}`;
  },
});
