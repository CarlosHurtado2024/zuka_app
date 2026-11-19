// La bisagra (lectura, kit LEC): dos oraciones del texto y, entre ellas, una bisagra vacía. Al arrastrar un conector a la bisagra
// se dibuja la relación que ese conector crea (contraste, consecuencia, causa, suma, aclaración…), sin decir si es la del texto.
// El estudiante compara el dibujo con lo que de verdad pasa entre las dos ideas. Entrena conectores y relaciones entre ideas.
// params = { doc?, rounds: [{ a, b, options, answer, ask? }] }
GAMES['conector-bisagra'] = LEC.drop('conector-bisagra', {
  norm: p => p.rounds.map(r => ({
    ask: r.ask || '¿Qué conector une estas dos ideas como lo hace el texto?',
    chips: r.options,
    zones: [{ label: 'conector', cap: 1 }],
    key: r.options.map((_, c) => c === r.answer ? 0 : null),
    src: r,
  })),
  solution: rs => rs.map(r => `«${r.chips[r.src.answer]}» (${LEC.rel(r.chips[r.src.answer]).name})`).join(' · '),
  render: (r, u) => {
    const c = u.placed(0)[0], rel = c == null ? null : LEC.rel(r.chips[c]);
    return `<div class="lec-hinge"><p class="lec-card">${u.fmt(r.src.a)}</p>`
      + `<div class="lec-hinge-mid">${u.zone(0, { noLabel: true, cls: 'lec-hz' })}<span class="lec-rel${rel ? ' on' : ''}"><b>${rel ? rel.sym : '?'}</b>${rel ? rel.name : 'relación'}</span></div>`
      + `<p class="lec-card">${u.fmt(r.src.b)}</p></div>${u.pool()}`;
  },
});
