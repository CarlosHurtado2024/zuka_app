// Lupa de evidencia (lectura, kit LEC): cada afirmación va a una de tres cajas: el texto lo dice (con otras palabras o tal cual),
// se deduce de lo que dice, o el texto no lo dice (aunque suene razonable). Las cajas se llenan a la vista. Entrena la diferencia
// entre información explícita, inferencia y lo que el lector añade, que es la trampa más común del examen.
// params = { doc, cards: [[afirmación, 0 lo dice | 1 se deduce | 2 no lo dice]], ask? }
GAMES['lupa-evidencia'] = LEC.drop('lupa-evidencia', {
  norm: p => [{
    ask: p.ask || 'Pon cada afirmación en su caja: ¿lo dice el texto, se deduce o no lo dice?',
    chips: p.cards.map(c => c[0]),
    zones: [{ label: 'Lo dice el texto', cap: 0 }, { label: 'Se deduce', cap: 0 }, { label: 'No lo dice', cap: 0 }],
    key: p.cards.map(c => c[1]),
  }],
  render: (r, u) => {
    const icon = ['<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 L20 20"/>', '<path d="M4 7h14M4 12h10M4 17h6"/><path d="M15 15l3 3 4-6"/>', '<circle cx="12" cy="12" r="8"/><path d="M6 18 L18 6"/>'];
    const n = r.chips.length;
    return `<div class="lec-zones lec-bins">${r.zones.map((_, zi) => u.zone(zi, { cls: 'lec-bin', before: `<svg class="lec-ico" viewBox="0 0 24 24" aria-hidden="true">${icon[zi]}</svg><span class="lec-level" style="--lv:${Math.round(100 * u.count(zi) / n)}%"></span>` })).join('')}</div>${u.pool()}`;
  },
});
