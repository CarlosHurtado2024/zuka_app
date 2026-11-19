// El intruso de la pregunta EXCEPTO (lectura, kit LEC): las cuatro opciones de una pregunta «EXCEPTO» se llevan al párrafo que las
// respalda. Tres encuentran casa; la que no la encuentra va a «No aparece» y es la respuesta. Enseña el método: verificar cada
// opción contra el texto en vez de elegir la que «suena rara».
// params = { doc, ask, cards: [[opción, [párrafos] | null si es la que no está]] }
GAMES['intruso-excepto'] = LEC.drop('intruso-excepto', {
  norm: p => {
    const zones = [...p.doc.paras.map((_, i) => ({ label: `¶${i + 1}`, cap: 0 })), { label: 'No aparece', cap: 1 }];
    return [{ ask: p.ask, chips: p.cards.map(c => c[0]), zones, key: p.cards.map(c => c[1] ? c[1].map(n => n - 1) : zones.length - 1) }];
  },
  render: (r, u) => {
    const last = r.zones.length - 1;
    return `<div class="lec-zones lec-shelf">${r.zones.slice(0, last).map((_, zi) => u.zone(zi, { cls: 'lec-shelf-z' })).join('')}</div>`
      + `<div class="lec-zones lec-none">${u.zone(last, { cls: 'lec-out' })}</div>${u.pool()}`;
  },
});
