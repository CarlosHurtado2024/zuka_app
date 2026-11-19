// Un caso nuevo (lectura, kit LEC): arriba la idea del texto; abajo, situaciones que el texto no menciona. Cada una se lleva a
// «Aplica la idea» o a «No la aplica». Entrena las preguntas de aplicación y analogía («un caso semejante sería…»).
// params = { doc, principle, cards: [[situación, true si aplica la idea]], ask? }
GAMES['caso-nuevo'] = LEC.drop('caso-nuevo', {
  norm: p => [{
    ask: p.ask || '¿Cuáles situaciones repiten la idea del texto?',
    chips: p.cards.map(c => c[0]),
    zones: [{ label: 'Aplica la idea', cap: 0 }, { label: 'No la aplica', cap: 0 }],
    key: p.cards.map(c => c[1] ? 0 : 1),
    principle: p.principle,
  }],
  render: (r, u) => `<p class="lec-thesis"><span class="lec-zl">La idea del texto</span>${u.fmt(r.principle)}</p>`
    + `<div class="lec-zones lec-pans">${u.zone(0, { cls: 'lec-dock' })}${u.zone(1, { cls: 'lec-dock lec-dock-no' })}</div>${u.pool()}`,
});
