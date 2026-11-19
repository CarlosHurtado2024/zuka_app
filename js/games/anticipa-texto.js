// Anticipa el texto (lectura, kit LEC): antes de leer, solo se ve la ficha (título, autor, fuente, fecha). Se arrastra a cada
// casilla lo que se espera del texto: su tema, su propósito, su tipo. Al comprobar, el texto se abre para leerlo con esa
// expectativa. Entrena la prelectura, que en el examen ahorra tiempo y orienta la lectura.
// params = { doc, slots: [[rótulo, [opciones], índice de la correcta]], ask? }
GAMES['anticipa-texto'] = LEC.drop('anticipa-texto', {
  hideBody: true,
  norm: p => {
    const chips = [], key = [];
    p.slots.forEach(([, opts, ok], s) => opts.forEach((t, k) => { chips.push(t); key.push(k === ok ? s : null); }));
    // Las opciones de todas las casillas se mezclan en la bandeja en un orden fijo (no van agrupadas por casilla).
    const order = chips.map((_, i) => i).sort((a, b) => ((a * 7 + 3) % chips.length) - ((b * 7 + 3) % chips.length));
    return [{
      ask: p.ask || 'Antes de leer: ¿qué esperas de este texto? Mira la ficha y llena las casillas.',
      chips: order.map(i => chips[i]),
      zones: p.slots.map(s => ({ label: s[0], cap: 1 })),
      key: order.map(i => key[i]),
    }];
  },
  render: (r, u) => `<div class="lec-zones lec-rows">${r.zones.map((_, zi) => u.zone(zi, { cls: 'lec-row lec-wide' })).join('')}</div>${u.pool()}`,
});
