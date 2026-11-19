// Signos que hablan (lectura, kit LEC): en una oración del texto un signo (comillas, rayas, dos puntos, paréntesis, signo de
// pregunta) está agrandado y es una zona: se le arrastra encima su oficio en esa oración (cita a alguien, aclara, anuncia una
// lista, se distancia de una palabra…). Entrena las preguntas por la función de un signo o de un inciso.
// params = { doc?, rounds: [{ p?, text: 'antes|signo|después', options, answer, ask? }] }
GAMES['signos-que-hablan'] = LEC.drop('signos-que-hablan', {
  norm: p => p.rounds.map(r => ({
    ask: r.ask || '¿Qué hace el signo resaltado en esta oración?',
    chips: r.options,
    zones: [{ label: 'el signo', cap: 1 }],
    key: r.options.map((_, c) => c === r.answer ? 0 : null),
    src: r,
  })),
  solution: rs => rs.map(r => `${r.src.text.split('|')[1].trim()} ${r.chips[r.src.answer]}`).join(' · '),
  render: (r, u) => {
    const [a, s, b] = r.src.text.split('|');
    return `<p class="lec-sent">${r.src.p ? `<span class="lec-pn">${r.src.p}</span>` : ''}${u.fmt(a)}<span class="lec-sign">${u.esc(s)}</span>${u.fmt(b)}</p>`
      + `<div class="lec-zones lec-one">${u.zone(0, { noLabel: true, cls: 'lec-signz', before: `<span class="lec-zl">Oficio de <b>${u.esc(s.trim())}</b></span>` })}</div>${u.pool()}`;
  },
});
