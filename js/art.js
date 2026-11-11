// Ilustraciones de los cursos: formas planas con volumen, en azules de la marca y acento amarillo.

const ART_C = { blue: '#2f5bff', deep: '#1c3dc4', soft: '#6f8fff', pale: '#8aa6ff', sun: '#ffc531', sunDeep: '#d99a00' };
const artSvg = body => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const ART_AXES = `<path d="M9 6v49h50" fill="none" stroke="${ART_C.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 11l4-5 4 5M54 51l5 4-5 4" fill="none" stroke="${ART_C.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
const ART_GRID = `<path d="M21 6v49M33 6v49M45 6v49M9 19h50M9 31h50M9 43h50" stroke="${ART_C.pale}" stroke-width="1.2" opacity=".35"/>`;

const COURSE_ART = {
  // Álgebra: modelo de área de (x + 1)² con fichas.
  algebra: artSvg(`
    <rect x="9" y="15" width="28" height="28" rx="3" fill="${ART_C.deep}"/>
    <rect x="6" y="12" width="28" height="28" rx="3" fill="${ART_C.blue}"/>
    <path d="M11 17h18" stroke="${ART_C.pale}" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
    <rect x="42" y="15" width="12" height="28" rx="2.5" fill="${ART_C.deep}"/>
    <rect x="39" y="12" width="12" height="28" rx="2.5" fill="${ART_C.soft}"/>
    <rect x="9" y="48" width="28" height="12" rx="2.5" fill="${ART_C.deep}"/>
    <rect x="6" y="45" width="28" height="12" rx="2.5" fill="${ART_C.soft}"/>
    <rect x="42" y="48" width="12" height="12" rx="2.5" fill="${ART_C.sunDeep}"/>
    <rect x="39" y="45" width="12" height="12" rx="2.5" fill="${ART_C.sun}"/>`),

  // Trigonometría: triángulo rectángulo dentro de un arco de círculo.
  trig: artSvg(`
    <path d="M54.9 52A46.9 46.9 0 0 0 8 5.1" fill="none" stroke="${ART_C.pale}" stroke-width="2.5" stroke-dasharray="3 4" stroke-linecap="round"/>
    <path d="M11 55h36V25z" fill="${ART_C.deep}"/>
    <path d="M8 52h36V22z" fill="${ART_C.blue}"/>
    <path d="M38 52v-6h6" fill="none" stroke="${ART_C.pale}" stroke-width="2"/>
    <path d="M21 52a13 13 0 0 0-3-8.4" fill="none" stroke="${ART_C.sun}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="44" cy="22" r="5" fill="${ART_C.sun}" stroke="${ART_C.sunDeep}" stroke-width="2"/>`),

  // Cálculo diferencial: curva con su recta tangente en el máximo.
  calc: artSvg(`
    ${ART_GRID}${ART_AXES}
    <path d="M12 47C21 47 23 19 34 19S49 35 58 31" fill="none" stroke="${ART_C.sun}" stroke-width="4" stroke-linecap="round"/>
    <path d="M18 19h33" stroke="${ART_C.blue}" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="34" cy="19" r="5" fill="#fff" stroke="${ART_C.blue}" stroke-width="3"/>`),

  // Geometría vectorial y analítica: un vector desde el origen hasta una elipse, con su componente.
  geo: artSvg(`
    ${ART_AXES}
    <ellipse cx="36" cy="32" rx="20" ry="13" fill="none" stroke="${ART_C.pale}" stroke-width="2.5" stroke-dasharray="3 4" stroke-linecap="round"/>
    <path d="M48.5 24v31" stroke="${ART_C.sun}" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"/>
    <g transform="translate(3 3)">
      <path d="M9 55L41.7 27.2" stroke="${ART_C.deep}" stroke-width="5" stroke-linecap="round"/>
      <path d="M48.5 21.3L44.9 31L38.4 23.4z" fill="${ART_C.deep}" stroke="${ART_C.deep}" stroke-width="2" stroke-linejoin="round"/>
    </g>
    <path d="M9 55L41.7 27.2" stroke="${ART_C.blue}" stroke-width="5" stroke-linecap="round"/>
    <path d="M48.5 21.3L44.9 31L38.4 23.4z" fill="${ART_C.blue}" stroke="${ART_C.blue}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="48.5" cy="55" r="4" fill="${ART_C.sun}" stroke="${ART_C.sunDeep}" stroke-width="2"/>`),

  // Física mecánica: bloque sobre un plano inclinado.
  fis: artSvg(`
    <path d="M6 59h52V25z" fill="${ART_C.deep}"/>
    <path d="M6 56h52V22z" fill="${ART_C.blue}"/>
    <path d="M12 52L52 26" stroke="${ART_C.pale}" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    <g transform="rotate(-33.2 32 39)">
      <rect x="27" y="29" width="15" height="13" rx="2" fill="${ART_C.sunDeep}"/>
      <rect x="25" y="27" width="15" height="12" rx="2" fill="${ART_C.sun}"/>
    </g>
    <path d="M24 22l-12 8" stroke="${ART_C.soft}" stroke-width="3" stroke-linecap="round"/>
    <path d="M11 25.5l1 4.5 4.5-.5" fill="none" stroke="${ART_C.soft}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`),

  // Cálculo integral: rectángulos que llenan el área bajo una curva.
  int: artSvg(`
    ${ART_AXES}
    <rect x="16" y="45" width="8" height="10" fill="${ART_C.deep}"/>
    <rect x="14" y="43" width="8" height="12" fill="${ART_C.soft}"/>
    <rect x="26" y="37" width="8" height="18" fill="${ART_C.deep}"/>
    <rect x="24" y="35" width="8" height="20" fill="${ART_C.blue}"/>
    <rect x="36" y="27" width="8" height="28" fill="${ART_C.deep}"/>
    <rect x="34" y="25" width="8" height="30" fill="${ART_C.soft}"/>
    <rect x="46" y="15" width="8" height="40" fill="${ART_C.deep}"/>
    <rect x="44" y="13" width="8" height="42" fill="${ART_C.blue}"/>
    <path d="M11 46C25 42 38 30 58 8" fill="none" stroke="${ART_C.sun}" stroke-width="4" stroke-linecap="round"/>`),

  // Álgebra lineal: plano deformado por una matriz y dos vectores.
  lin: artSvg(`
    <path d="M10 50h28l16-28H26z" fill="${ART_C.pale}" fill-opacity=".3" stroke="${ART_C.pale}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M19.3 50l16-28M28.7 50l16-28M18 36h28" stroke="${ART_C.pale}" stroke-width="1.5" opacity=".8"/>
    <path d="M10 50l24.9-29.8" stroke="${ART_C.blue}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M40 14l-1.3 9.4-7.6-6.5z" fill="${ART_C.blue}" stroke="${ART_C.blue}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M10 50l38.2-8.3" stroke="${ART_C.sun}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M56 40l-6.8 6.6-2.1-9.8z" fill="${ART_C.sun}" stroke="${ART_C.sun}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="10" cy="50" r="4" fill="${ART_C.deep}"/>`),
};

const courseArt = (c, size = '') => `<span class="cart ${size}" aria-hidden="true">${COURSE_ART[c.id] || ''}</span>`;
