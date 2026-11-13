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
  {
    id: 'cur-razon-deco', topic: 'mate',
    title: 'La razón que no cambia',
    fact: 'De Euclides a un hospital: si 80 mg vienen en 2 mL, para 20 mg se cargan 0.5 mL.',
    clip: {
      bunny: '688591e8-3c66-4151-a1b8-f26ef0623bb9', duration: 90,
      scenes: [
        sc(7, 'Hacia el 300 a. C., Euclides buscó el corte perfecto de una línea: la razón áurea.', { title: '$(a+b) : a = a : b$' }),
        sc(6, 'En 1509, Luca Pacioli la llamó «la divina proporción»; Leonardo dibujó las figuras.', { title: '$1.618\\ldots$' }),
        sc(6, 'En 1960 el mundo acordó un solo sistema de medidas: el SI.', { title: '$1\\text{ g} = 1000\\text{ mg}$' }),
        sc(6, 'Le Corbusier midió el cuerpo: cabeza a 183 cm, ombligo a 113 cm.', { title: '$183 \\div 113 \\approx 1.62$' }),
        sc(7, 'Una ámpula trae 80 mg en 2 mL; el médico pide 20 mg.', { title: '$x = \\dfrac{20 \\cdot 2}{80} = 0.5\\text{ mL}$' }),
      ],
    },
  },
  {
    id: 'cur-egipto', topic: 'mate',
    title: 'La cuerda del escriba',
    fact: 'En Egipto, se cree que una cuerda con nudos tensada en 3, 4 y 5 tramos daba un ángulo recto.',
    clip: {
      bunny: '1f59075f-c1ec-411d-907e-750671cccce2', duration: 109.5,
      scenes: [
        sc(6, 'Cada verano, el Nilo crecía y borraba los linderos de los campos.', { title: 'La cuerda del escriba' }),
        sc(7, 'Se cree que una cuerda de 12 nudos, tensada en 3, 4 y 5 tramos, formaba el ángulo recto.', { title: '$3^2 + 4^2 = 5^2$' }),
        sc(7, 'En los graneros, un círculo de diámetro 9 valía como un cuadrado de lado 8.', { title: '$\\pi \\approx \\tfrac{256}{81} \\approx 3.16$' }),
        sc(6, 'Un saco de grano daba 20 panes pequeños o 4 grandes: el pefsu.', { title: '$\\text{pefsu} = \\dfrac{\\text{panes}}{\\text{hekat}}$' }),
        sc(7, 'El seked de la Gran Pirámide: 5½ palmos hacia dentro por cada codo de subida.', { title: '$\\tan\\theta = \\tfrac{7}{5.5} \\Rightarrow \\theta \\approx 51.8^\\circ$' }),
        sc(6, 'Quien sabía contar y medir era de los más respetados de Egipto.', { title: "Ma'at" }),
      ],
    },
  },
  {
    id: 'cur-arroz', topic: 'mate',
    title: 'El arroz del rey',
    fact: 'Un grano que se duplica en las 64 casillas del ajedrez suma más de 18 trillones de granos.',
    clip: {
      bunny: 'f68c6ba7-c0a4-45a7-b265-b8931c49ea4e', duration: 72.5,
      scenes: [
        sc(6, 'Un inventor pidió un grano de arroz en la primera casilla y el doble en cada una de las siguientes.', { title: '$1,\\ 2,\\ 4,\\ 8,\\ \\ldots$' }),
        sc(6, 'En la casilla 10 ya hay 512 granos: el montón no cabe en su casilla.', { title: '$2^{9} = 512$' }),
        sc(6, 'Cada 10 casillas hay unas mil veces más arroz.', { title: '$2^{10} = 1024$' }),
        sc(7, 'En la casilla 64 hay más de 9 trillones de granos.', { title: '$2^{63} \\approx 9.2 \\times 10^{18}$' }),
        sc(7, 'La última casilla tiene un grano más que todas las anteriores juntas.', { title: '$2^{63} = (2^{63} - 1) + 1$' }),
        sc(6, 'Con 25 mg por grano, todo el tablero sería la cosecha mundial de arroz de unos 887 años.', { title: '$2^{64} - 1$' }),
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
