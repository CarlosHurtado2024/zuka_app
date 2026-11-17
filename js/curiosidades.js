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
      bunny: '3917ea63-91c2-4aa6-9e72-be7955884a79', duration: 80,
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
      bunny: '0610dca4-c394-4ee1-9e56-b2f6470375f7', duration: 76,
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
      bunny: '656c797f-bea0-4e6b-8f65-cddce2eaad40', duration: 90,
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
      bunny: '74c5bf6a-e8b5-48d3-9366-00d2ead0b131', duration: 109.5,
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
      bunny: 'f4111e60-5657-43e3-9d1c-5a22e98b7c6a', duration: 72.5,
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
  {
    id: 'cur-curva', topic: 'mate',
    title: 'La curva más corta',
    fact: 'Sobre la Tierra, lo más corto entre dos ciudades es un arco de círculo máximo, no la recta del mapa.',
    clip: {
      bunny: '6d4a960b-de76-4273-b4e4-082c14670b97', duration: 82.5,
      scenes: [
        sc(6, 'Un avión de Nueva York a Tokio sube hasta Alaska. En el mapa parece un rodeo.', { title: 'Nueva York → Tokio' }),
        sc(7, 'Un mapa plano no puede guardar las distancias de una esfera: la línea recta del mapa no es la más corta.', { title: 'Mapa ≠ esfera' }),
        sc(7, 'Un círculo máximo es el corte de la esfera por un plano que pasa por su centro, como el ecuador.', { title: 'Círculo máximo' }),
        sc(7, 'Su arco mide el radio por el ángulo central, en radianes.', { title: '$d = R\\,\\theta$' }),
        sc(7, 'Nueva York–Tokio: θ ≈ 1.6998 rad, así que d ≈ 6 371 × 1.6998 ≈ 10 829 km.', { title: '$d \\approx 10\\,829 \\text{ km}$' }),
        sc(6, 'La línea recta del mapa mide 12 745 km: casi 2 000 km más.', { title: '$12\\,745 - 10\\,829 = 1\\,916$' }),
      ],
    },
  },
  {
    id: 'cur-ia', topic: 'mate',
    title: 'La IA está hecha de álgebra',
    fact: 'Una red neuronal multiplica, suma y aprende bajando la montaña de su error con derivadas.',
    clip: {
      bunny: 'b85ffd25-b3ac-44dc-89aa-17caaa9ad935', duration: 90,
      scenes: [
        sc(6, 'Para una IA, la foto de un gato es una tabla de números: el brillo de cada píxel.', { title: '$0 \\le \\text{píxel} \\le 255$' }),
        sc(7, 'Cada neurona multiplica sus datos por unos pesos y suma un sesgo.', { title: '$z = 2(0.4) + 3(-0.2) + 0.1 = 0.3$' }),
        sc(6, 'La sigmoide convierte cualquier número en uno entre 0 y 1.', { title: '$\\sigma(0.3) = \\dfrac{1}{1 + e^{-0.3}} \\approx 0.574$' }),
        sc(6, 'Debía dar 1: el error mide qué tan lejos quedó.', { title: '$L = (1 - 0.574)^2 \\approx 0.181$' }),
        sc(7, 'La derivada señala hacia dónde sube el error; cada paso va al revés y corrige los pesos.', { title: '$w_{\\text{nuevo}} = w - 0.25\\,\\dfrac{\\partial L}{\\partial w}$' }),
        sc(6, 'Doce pasos después, la misma foto da «gato» al 91 %.', { title: '$L \\approx 0.008$' }),
      ],
    },
  },
  {
    id: 'cur-pi', topic: 'mate',
    title: '¿Por qué el 14 de marzo?',
    fact: 'En EE. UU. el 14 de marzo se escribe 3/14, como pi. La UNESCO lo eligió en 2019 para celebrar las matemáticas.',
    clip: {
      bunny: '1a7bc452-ebca-43b1-96e4-c595768e5dfd', duration: 77,
      scenes: [
        sc(6, 'En Colombia el 14 de marzo se escribe 14/3: primero el día y después el mes.', { title: '14/3' }),
        sc(6, 'En Estados Unidos va primero el mes: 3/14, los primeros dígitos de pi.', { title: '$3/14 \\to 3.14$' }),
        sc(7, 'Pi es el contorno de un círculo dividido entre su diámetro; da lo mismo en todo círculo.', { title: '$\\pi = \\dfrac{C}{d} = 3.14159\\ldots$' }),
        sc(6, 'Una taza: 26.1 cm de contorno y 8.3 cm de diámetro.', { title: '$26.1 \\div 8.3 \\approx 3.14$' }),
        sc(6, '1988: Larry Shaw celebra el primer Día de Pi en un museo de San Francisco.', { title: '1988' }),
        sc(7, 'El 26 de noviembre de 2019 la UNESCO proclamó el Día Internacional de las Matemáticas; la primera fiesta fue en 2020.', { title: '14/3/2020' }),
      ],
    },
  },
  {
    id: 'cur-distancias', topic: 'ciencia',
    title: '¿Cómo se mide el universo?',
    fact: 'Nadie ha ido a una estrella, pero un ángulo diminuto basta para saber a qué distancia está.',
    clip: {
      video: 'media/clips/distancias.mp4', duration: 97,
      scenes: [
        sc(7, 'Un láser rebota en el espejo que dejó el Apolo 11 en la Luna y vuelve en 2.56 segundos.', { title: '$d = \\dfrac{c \\cdot t}{2} \\approx 384\\,000\\text{ km}$' }),
        sc(7, 'En seis meses la Tierra mira desde el otro lado de su órbita: una estrella cercana parece correrse frente a las lejanas.', { title: 'Paralaje' }),
        sc(7, 'La mitad de ese corrimiento es el ángulo p: para Próxima Centauri, 0.768″, menos que una moneda vista a 5 km.', { title: '$d = \\dfrac{1}{p} = \\dfrac{1}{0.768} \\approx 1.30\\text{ pc} \\approx 4.2\\text{ años luz}$' }),
        sc(7, 'Al doble de distancia, la misma luz se reparte en cuatro veces más área: se ve cuatro veces más débil.', { title: '$F = \\dfrac{L}{4\\pi d^2}$' }),
        sc(6, 'Las cefeidas laten a un ritmo que dice cuánta luz dan: así se midió Andrómeda.', { title: '$\\approx 2.5$ millones de años luz' }),
        sc(7, 'La luz de una galaxia llega estirada: con la ley de Hubble y Lemaître se despeja su distancia.', { title: '$d = \\dfrac{v}{H_0} \\approx \\dfrac{6\\,000}{70} \\approx 86\\text{ Mpc}$' }),
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
