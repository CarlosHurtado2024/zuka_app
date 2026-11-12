// Curiosidades: los videos cortos de la pestaña Clips (datos curiosos de matemáticas y ciencia).
// No son lecciones: no tienen ejercicios ni aparecen en el camino. Diseño:
// docs/superpowers/specs/2026-11-12-clips-curiosidades.md.
//
// `clip` tiene la forma del clip de una lección: { video: 'media/clips/x.mp4' } mientras el video vive en el
// repositorio, o { bunny: '<id>' } cuando ya está en Bunny; `duration` en segundos y `scenes` de respaldo.
const CURIO_TOPICS = [
  { id: 'mate', name: 'Matemáticas', color: '#a78bfa' },
  { id: 'ciencia', name: 'Ciencia', color: '#22d3ee' },
];

const CURIOS = [
  {
    id: 'cur-origen-numeros', topic: 'mate',
    title: 'El origen de los números',
    fact: 'Contamos con rayitas durante miles de años. El cero, el signo para «nada», llegó mucho después.',
    clip: {
      bunny: 'ed3c4328-c24d-4baf-b802-c1338587e1bf', duration: 80,
      scenes: [
        sc(6, 'Hace unos 20 000 años ya se contaba con muescas en un hueso.', { title: '||||' }),
        sc(7, 'En Babilonia contaban de 60 en 60: por eso una hora tiene 60 minutos.', { title: '$1\\text{ h} = 60\\text{ min}$' }),
        sc(7, 'En Egipto cada potencia de 10 tenía su signo: el 909 necesitaba 18.', { title: '$909$' }),
        sc(7, 'En la India el hueco recibió un signo y reglas propias: el cero ya era un número.', { title: '$5 - 5 = 0$' }),
        sc(6, 'Hoy todo lo digital se escribe con dos signos: marca y hueco.', { title: '$1\\;0\\;1\\;1\\;0$' }),
      ],
    },
  },
  {
    id: 'cur-abejas', topic: 'ciencia',
    title: 'Matemáticas de abeja',
    fact: 'Una abeja baila un ángulo y una distancia para decir dónde hay flores: son coordenadas polares.',
    clip: {
      bunny: '22dee0b2-14ba-4b3a-ad2e-fe2b793794a6', duration: 76,
      scenes: [
        sc(6, 'Una abeja encontró flores. Adentro de la colmena está oscuro: no lo dice, lo baila.', { title: 'El baile del ocho' }),
        sc(7, 'El tramo recto es una flecha. Hacia arriba significa hacia el sol.', { title: '$30^\\circ$' }),
        sc(7, 'Un ángulo y una distancia: en matemáticas se llaman coordenadas polares.', { title: '$(r,\\ \\theta)$' }),
        sc(7, 'El hexágono guarda la mayor cantidad de miel con la menor cantidad de cera.', { title: 'Más miel, menos cera' }),
        sc(6, 'Además cuentan hasta cuatro y entienden el cero.', { title: '$0\\;\\;1\\;\\;2\\;\\;3\\;\\;4$' }),
      ],
    },
  },
];

const curioTopic = id => CURIO_TOPICS.find(t => t.id === id);
// Elementos del feed con la misma forma que usa el reproductor: { c: tema (da el color), l: curiosidad }.
const curioFeed = (filter = 'all') => CURIOS.filter(q => filter === 'all' || q.topic === filter).map(l => ({ c: curioTopic(l.topic), l }));
function findCurio(id) {
  const l = CURIOS.find(q => q.id === id);
  return l ? { c: curioTopic(l.topic), l } : undefined;
}
// Temas que ya tienen al menos un clip (los únicos que se ofrecen como filtro).
const curioTopics = () => CURIO_TOPICS.filter(t => CURIOS.some(q => q.topic === t.id));
