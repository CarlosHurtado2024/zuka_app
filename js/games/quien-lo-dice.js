// ¿Quién lo dice? (lectura, kit LEC): las ideas del texto se arrastran a la voz que las sostiene: el autor, cada experto citado,
// los críticos. En el examen muchas opciones son ideas que sí están en el texto pero puestas en boca de quien no las dijo.
// params = { doc, voices: [nombres], cards: [[idea, índice de la voz]], ask? }
GAMES['quien-lo-dice'] = LEC.drop('quien-lo-dice', {
  norm: p => [{
    ask: p.ask || 'Lleva cada idea a quien la sostiene en el texto.',
    chips: p.cards.map(c => c[0]),
    zones: p.voices.map(v => ({ label: v, cap: 0 })),
    key: p.cards.map(c => c[1]),
  }],
  render: (r, u) => `<div class="lec-zones lec-voices">${r.zones.map((z, zi) => u.zone(zi, { cls: 'lec-voice', before: `<span class="lec-av" aria-hidden="true">${zi + 1}</span>` })).join('')}</div>${u.pool()}`,
});
