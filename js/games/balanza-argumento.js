// La balanza del argumento (lectura, kit LEC): arriba la tesis; cada oración se pone en el platillo de lo que la apoya o en el de
// lo que la debilita, y la balanza se inclina a la vista. Las que no tienen que ver se quedan en la bandeja. Entrena tesis,
// argumentos y las preguntas «¿qué hallazgo debilitaría…?».
// params = { doc, thesis, cards: [[oración, 0 apoya | 1 debilita | null no tiene que ver]], ask? }
GAMES['balanza-argumento'] = LEC.drop('balanza-argumento', {
  norm: p => [{
    ask: p.ask || 'Pon en cada platillo lo que apoya o debilita la tesis. Lo que no tiene que ver se queda abajo.',
    chips: p.cards.map(c => c[0]),
    zones: [{ label: 'Apoya', cap: 0 }, { label: 'Debilita', cap: 0 }],
    key: p.cards.map(c => c[1]),
    thesis: p.thesis,
  }],
  foot: 'Lo que no apoya ni debilita la tesis se queda en la bandeja.',
  render: (r, u) => {
    const tilt = Math.max(-14, Math.min(14, (u.count(1) - u.count(0)) * 5));
    return `<p class="lec-thesis"><span class="lec-zl">Tesis</span>${u.fmt(r.thesis)}</p>`
      + `<svg class="lec-beam" viewBox="0 0 200 46" aria-hidden="true"><path class="lec-post" d="M100 44 L92 44 L100 14 L108 44 Z"/><g style="transform: rotate(${tilt}deg); transform-origin: 100px 14px; transition: transform .35s"><line x1="22" y1="14" x2="178" y2="14"/><circle cx="22" cy="14" r="4"/><circle cx="178" cy="14" r="4"/></g></svg>`
      + `<div class="lec-zones lec-pans">${u.zone(0, { cls: 'lec-pan' })}${u.zone(1, { cls: 'lec-pan' })}</div>${u.pool()}`;
  },
});
