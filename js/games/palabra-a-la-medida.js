// La palabra a la medida (lectura, kit LEC): la oración del texto aparece dos veces: arriba con su palabra subrayada y abajo con un
// hueco. Se arrastra al hueco la palabra que diga lo mismo en esa oración, y la oración se lee con ella puesta. Entrena «la palabra
// subrayada significa»: no vale el sinónimo del diccionario, vale el que conserva el sentido en el contexto.
// params = { doc, rounds: [{ p, before, word, after, options, answer, ask? }] }   (before + word + after está en el párrafo p)
GAMES['palabra-a-la-medida'] = LEC.drop('palabra-a-la-medida', {
  norm: p => p.rounds.map(r => ({
    ask: r.ask || `¿Qué palabra puede reemplazar a «${r.word}» (párrafo ${r.p}) sin cambiar el sentido?`,
    chips: r.options,
    zones: [{ label: `en lugar de «${r.word}»`, cap: 1 }],
    key: r.options.map((_, c) => c === r.answer ? 0 : null),
    src: r,
  })),
  solution: rs => rs.map(r => `«${r.src.word}» = «${r.chips[r.src.answer]}»`).join(' · '),
  render: (r, u) => {
    const s = r.src;
    return `<p class="lec-sent"><span class="lec-pn">${s.p}</span>…${u.fmt(s.before)}<u class="lec-orig">${u.esc(s.word)}</u>${u.fmt(s.after)}…</p>`
      + `<p class="lec-sent lec-try">…${u.fmt(s.before)}${u.zone(0, { inline: true, noLabel: true })}${u.fmt(s.after)}…</p>${u.pool()}`;
  },
});
