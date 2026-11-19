// Resume el párrafo (lectura, kit LEC): para cada párrafo se arrastra la frase que dice su idea central. Sobran resúmenes que se
// quedan en un detalle o que dicen más de lo que el párrafo dice. Entrena la idea central y el «propósito principal».
// params = { doc, paras: [números de párrafo], options: [resúmenes], key: [índice del resumen de cada párrafo listado], ask? }
GAMES['resume-parrafo'] = LEC.drop('resume-parrafo', {
  norm: p => [{
    ask: p.ask || 'Arrastra a cada párrafo la frase que resume su idea central.',
    chips: p.options,
    zones: p.paras.map(n => ({ label: `¶${n}`, cap: 1 })),
    key: p.options.map((_, c) => { const j = p.key.indexOf(c); return j >= 0 ? j : null; }),
  }],
  render: (r, u) => `<div class="lec-zones lec-rows">${r.zones.map((z, zi) => u.zone(zi, { cls: 'lec-row lec-wide', before: `<span class="lec-first">${u.esc(u.first(u.doc.paras[+z.label.slice(1) - 1], 6))}</span>` })).join('')}</div>${u.pool()}`,
});
