// ¿Dónde lo busco? (lectura, kit LEC): cada pregunta del examen se arrastra al párrafo al que hay que volver para responderla.
// El examen casi siempre se gana volviendo al texto; esto entrena a ubicar rápido sin releerlo entero.
// params = { doc, cards: [[pregunta, [párrafos que sirven]]], ask? }
GAMES['donde-buscar'] = LEC.drop('donde-buscar', {
  norm: p => [{
    ask: p.ask || 'Lleva cada pregunta al párrafo donde está su respuesta.',
    chips: p.cards.map(c => c[0]),
    zones: p.doc.paras.map((_, i) => ({ label: `¶${i + 1}`, cap: 0 })),
    key: p.cards.map(c => c[1].map(n => n - 1)),
  }],
  render: (r, u) => `<div class="lec-zones lec-shelf">${r.zones.map((_, zi) => u.zone(zi, { cls: 'lec-shelf-z', before: `<span class="lec-first">${u.esc(u.first(u.doc.paras[zi], 4))}</span>` })).join('')}</div>${u.pool()}`,
});
