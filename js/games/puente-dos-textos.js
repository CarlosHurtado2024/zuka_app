// El puente entre dos textos (lectura, kit LEC): dos círculos que se cruzan, uno por texto. Cada idea se arrastra a lo que solo
// dice el texto Uno, a lo que dicen los dos o a lo que solo dice el texto Dos. Entrena las preguntas sobre los dos textos
// («los dos coinciden en…», «es interés del texto Uno más que del Dos»).
// params = { docs: [textoUno, textoDos], cards: [[idea, 0 solo Uno | 1 los dos | 2 solo Dos]], ask? }
GAMES['puente-dos-textos'] = LEC.drop('puente-dos-textos', {
  norm: p => [{
    ask: p.ask || '¿De cuál texto es cada idea? Ponla en su lugar del puente.',
    chips: p.cards.map(c => c[0]),
    zones: [{ label: 'Solo texto Uno', cap: 0 }, { label: 'Los dos', cap: 0 }, { label: 'Solo texto Dos', cap: 0 }],
    key: p.cards.map(c => c[1]),
  }],
  render: (r, u) => `<div class="lec-zones lec-venn">${r.zones.map((_, zi) => u.zone(zi, { cls: `lec-vz lec-vz${zi}` })).join('')}</div>${u.pool()}`,
});
