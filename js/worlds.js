// Mundos del mapa de cada curso (spec 2026-11-11-mapa-de-mundos; nombres de la spec 2026-11-24-mundos-sobrios; estilo
// «neón» de la interfaz red, 2026-11-27): cada unidad es un «mundo» con nombre de capítulo y una lámina (SVG 160×80):
// el mismo fondo para todos (degradado negro azulado, sin cuadrícula ni color propio del mundo) y el diagrama de su idea
// central a línea fina que brilla, en blanco con un solo acento azul hielo. Trae su propio fondo, así se ve igual en los
// dos temas. La idea va en el centro (x entre 44 y 116): en el mapa la lámina se recorta en un círculo.

const WORLDS = (() => {
  // Un solo acento para todos los mundos. Los nombres se conservan porque cada lámina los usa (y video/lamina/tools/plates.js los lee).
  const INK = '#E6ECFF', TEAL = '#6FD3FF', AMBER = '#6FD3FF', ROSE = '#6FD3FF', VIOLET = '#6FD3FF', SKY = '#6FD3FF', CORAL = '#6FD3FF', LIME = '#6FD3FF';
  const r2 = n => Math.round(n * 100) / 100;
  // `ac` ya no tiñe el fondo: todas las láminas comparten degradado. El diagrama lleva un halo suave (filtro glow).
  // Los cuatro colores salen como variables CSS con su valor por defecto: la app (css/styles.css, .world-art y .wnode-art)
  // pone en --plate-ac el color del curso y, en tema claro, cambia fondo y tinta. Sin esas variables se ve en neón hielo.
  const VARS = { '#141A33': '--plate-bg0', '#07080F': '--plate-bg1', '#E6ECFF': '--plate-ink', '#6FD3FF': '--plate-ac' };
  const themed = svg => svg.replace(/#141A33|#07080F|#E6ECFF|#6FD3FF/g, h => `var(${VARS[h]}, ${h})`);
  const plate = (id, ac, body) => themed(plateRaw(id, ac, body));
  const plateRaw = (id, ac, body) => `<svg viewBox="0 0 160 80" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" data-style="neon">
  <defs><radialGradient id="bg-${id}" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#141A33"/><stop offset="1" stop-color="#07080F"/></radialGradient>
  <filter id="glow-${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.1" result="b"/><feColorMatrix in="b" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .7 0" result="h"/><feMerge><feMergeNode in="h"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <rect width="160" height="80" fill="url(#bg-${id})"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow-${id})">${body}</g></svg>`;
  // Trazo, trazo punteado, relleno, círculo, punto, punto hueco, letra en cursiva de libro y flecha.
  const L = (d, c = INK, w = 1.3) => `<path d="${d}" stroke="${c}" stroke-width="${w}"/>`;
  const Ld = (d, c = INK, w = .9) => `<path d="${d}" stroke="${c}" stroke-width="${w}" stroke-dasharray="2.5 2.5" opacity=".75"/>`;
  const F = (d, c, o = .28) => `<path d="${d}" fill="${c}" fill-opacity="${o}" stroke="none"/>`;
  const C = (x, y, r, c = INK, w = 1.2, dash) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" stroke="${c}" stroke-width="${w}"${dash ? ' stroke-dasharray="2.5 2.5" opacity=".75"' : ''}/>`;
  const D = (x, y, r = 2, c = INK) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${c}" stroke="none"/>`;
  const H = (x, y, r = 2.2, c = INK) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="#07080F" stroke="${c}" stroke-width="1.2"/>`;
  const T = (x, y, txt, c = INK, s = 7, a = 'middle') => `<text x="${r2(x)}" y="${r2(y)}" text-anchor="${a}" font-size="${s}" font-style="italic" font-family="Georgia,'Times New Roman',serif" fill="${c}" stroke="#07080F" stroke-width="2.2" stroke-opacity=".85" paint-order="stroke">${txt}</text>`;
  const A = (x1, y1, x2, y2, c = INK, w = 1.2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 3 + w, s = 1.5 + w * .6, bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a);
    return `<path d="M${r2(x1)} ${r2(y1)}L${r2(bx)} ${r2(by)}" stroke="${c}" stroke-width="${w}"/><path d="M${r2(x2)} ${r2(y2)}L${r2(bx - s * Math.sin(a))} ${r2(by + s * Math.cos(a))}L${r2(bx + s * Math.sin(a))} ${r2(by - s * Math.cos(a))}z" fill="${c}" stroke="none"/>`;
  };
  // Curva y = f(x) en coordenadas de la lámina, o una curva paramétrica t → [x, y].
  const fn = (f, x0, x1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return `${i ? 'L' : 'M'}${r2(x)} ${r2(f(x))}`; }).join('');
  const par = (g, t0, t1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const [x, y] = g(t0 + (t1 - t0) * i / n); return `${i ? 'L' : 'M'}${r2(x)} ${r2(y)}`; }).join('');
  const axes = (ox, oy, x0, x1, y0, y1) => L(`M${x0} ${oy}H${x1}M${ox} ${y0}V${y1}`, INK, .7) ;
  const rad = d => d * Math.PI / 180;

  return {
    // ---------- Álgebra ----------
    conjuntos: { name: 'Teoría de Conjuntos', art: plate('conjuntos', TEAL, `
      ${F('M80 20.96A17 17 0 0 1 80 45.04A17 17 0 0 1 80 20.96Z', TEAL, .4)}
      ${C(68, 33, 17)}${C(92, 33, 17)}${C(80, 53, 17, INK, .9, true)}
      ${L('M80 20.96A17 17 0 0 1 80 45.04A17 17 0 0 1 80 20.96Z', TEAL, 1.4)}
      ${D(80, 33, 1.8, TEAL)}${D(59, 29, 1.4)}${D(101, 28, 1.4)}${D(80, 60, 1.4)}
      ${T(52, 18, 'A')}${T(108, 18, 'B')}${T(62, 70, 'C', INK, 6.5)}
      ${T(24, 44, 'A ∩ B', TEAL, 6.5)}${T(137, 44, 'x ∈ A', INK, 6.5)}`) },

    numeros: { name: 'La Recta Real', art: plate('numeros', AMBER, `
      ${L('M16 52H142')}${L('M139 49.5L143 52L139 54.5', INK, 1)}
      ${[-2, -1, 0, 1, 2, 3, 4, 5].map(k => L(`M${56 + 16 * k} 49.5V54.5`, INK, .9) + T(56 + 16 * k, 62, k < 0 ? `−${-k}` : k, INK, 5.5)).join('')}
      ${L('M56 52V36H72V52', INK, .8)}${L('M56 52L72 36', AMBER, 1.3)}
      ${Ld('M72 36A22.63 22.63 0 0 1 78.63 52', AMBER)}${D(78.63, 52, 2.2, AMBER)}${T(84, 46, '√2', AMBER, 6.5)}
      ${C(106.27, 44, 8, INK, .8, true)}${D(106.27, 52, 2.2, AMBER)}${T(106.27, 32, 'π', AMBER, 7)}
      ${T(24, 30, 'ℚ ⊂ ℝ', INK, 6.5)}`) },

    razones: { name: 'Escalas y Proporciones', art: plate('razones', ROSE, `
      ${F('M46 62L80 62L80 43Z', ROSE, .25)}
      ${L('M46 62H114V24Z')}${L('M80 62V43', ROSE, 1.5)}
      ${D(46, 62, 1.8)}${D(80, 43, 1.8, ROSE)}${D(114, 24, 1.8)}
      ${T(63, 70, 'a', ROSE, 6.5)}${T(80, 77, '2a', INK, 6.5)}${T(85, 55, 'h', ROSE, 6.5)}${T(121, 45, '2h', INK, 6.5)}
      ${T(26, 26, 'a : b', INK, 7)}${T(26, 36, '= c : d', INK, 7)}`) },

    potencias: { name: 'Exponentes y Radicales', art: plate('potencias', VIOLET, `
      ${[[48, .1], [24, .18], [12, .3], [6, .5]].map(([s, o]) => F(`M52 ${66 - s}h${s}v${s}h-${s}z`, VIOLET, o) + L(`M52 ${66 - s}h${s}v${s}h-${s}z`, s === 48 ? VIOLET : INK, s === 48 ? 1.3 : .8)).join('')}
      ${[[6, '1'], [12, '2'], [24, '4'], [48, '8']].map(([s, t]) => T(52 + s, 73, t, INK, 5.5)).join('')}
      ${T(128, 26, 'aⁿ', VIOLET, 11)}${L('M112 50l3-1.5l4 9l6-21h17', INK, 1.1)}${T(133, 52, 'x', INK, 7)}
      ${T(28, 30, '2⁰ = 1', INK, 6)}`) },

    progresiones: { name: 'Sucesiones y Series', art: plate('progresiones', SKY, `
      ${[['M56 16h24v48h-24z', .5], ['M80 16h24v24h-24z', .36], ['M80 40h12v24h-12z', .26], ['M92 40h12v12h-12z', .18], ['M92 52h6v12h-6z', .12], ['M98 52h6v6h-6z', .08]].map(([d, o]) => F(d, SKY, o) + L(d, INK, .8)).join('')}
      ${L('M56 16h48v48h-48z', SKY, 1.3)}
      ${T(68, 43, '½', INK, 8)}${T(92, 31, '¼', INK, 7)}${T(86, 55, '⅛', INK, 5.5)}
      ${T(30, 48, 'Σ', INK, 20)}${T(128, 44, '= 1', SKY, 9)}`) },

    polinomios: { name: 'Álgebra de Polinomios', art: plate('polinomios', AMBER, `
      ${F('M58 14h32v32h-32z', AMBER, .3)}${F('M90 14h20v32h-20zM58 46h32v20h-32z', AMBER, .12)}${F('M90 46h20v20h-20z', AMBER, .5)}
      ${L('M58 14h52v52h-52z', AMBER, 1.3)}${L('M90 14V66M58 46H110', INK, .9)}
      ${T(74, 33, 'a²', INK, 8)}${T(100, 59, 'b²', INK, 6.5)}${T(100, 33, 'ab', INK, 6)}${T(74, 59, 'ab', INK, 6)}
      ${T(74, 10, 'a', INK, 6)}${T(100, 10, 'b', INK, 6)}${T(52, 33, 'a', INK, 6)}${T(52, 59, 'b', INK, 6)}
      ${T(136, 44, '(a + b)²', AMBER, 7)}`) },

    cuadraticas: { name: 'Parábolas y Complejos', art: plate('cuadraticas', TEAL, `
      ${axes(40, 56, 26, 136, 8, 74)}
      ${Ld('M84 14V66')}
      ${L(fn(x => 56 - 38 * (1 - ((x - 84) / 24) ** 2), 56, 112), TEAL, 1.5)}
      ${D(84, 18, 2.2, TEAL)}${D(60, 56, 2)}${D(108, 56, 2)}
      ${T(93, 15, 'V', TEAL, 6.5)}${T(60, 65, 'x₁', INK, 5.5)}${T(108, 65, 'x₂', INK, 5.5)}
      ${T(136, 22, 'i² = −1', INK, 6)}`) },

    'grado-superior': { name: 'Raíces de Polinomios', art: plate('grado-superior', CORAL, `
      ${axes(80, 44, 24, 136, 8, 76)}
      ${L(fn(x => 44 - .00266 * (x - 52) * (x - 80) * (x - 112), 48, 116), CORAL, 1.5)}
      ${D(52, 44, 2.3, CORAL)}${D(80, 44, 2.3, CORAL)}${D(112, 44, 2.3, CORAL)}
      ${T(124, 16, 'P(x)', CORAL, 6.5)}${T(30, 30, 'P(r) = 0', INK, 6)}`) },

    racionales: { name: 'Fracciones Algebraicas', art: plate('racionales', VIOLET, `
      ${Ld('M80 6V74')}${Ld('M22 40H138')}
      ${L(fn(x => 40 - 120 / (x - 80), 84.5, 138), VIOLET, 1.5)}${L(fn(x => 40 - 120 / (x - 80), 22, 75.5), VIOLET, 1.5)}
      ${H(110, 36, 2.3, VIOLET)}
      ${T(86, 10, 'x = a', INK, 5.5, 'start')}${T(140, 47, 'y = b', INK, 5.5)}${T(30, 20, 'P / Q', INK, 7)}`) },

    'exp-log': { name: 'Crecimiento Exponencial', art: plate('exp-log', LIME, `
      ${axes(60, 60, 30, 142, 6, 74)}
      ${Ld('M44 76L112 8')}
      ${L(par(u => [60 + 12 * u, 60 - 12 * Math.exp(u)], -2.5, 1.5), LIME, 1.5)}
      ${L(par(u => [60 + 12 * Math.exp(u), 60 - 12 * u], -.9, 1.9), INK, 1.3)}
      ${D(60, 48, 2, LIME)}${D(72, 60, 2)}
      ${T(84, 12, 'eˣ', LIME, 7.5)}${T(130, 32, 'ln x', INK, 6.5)}${T(114, 18, 'y = x', INK, 5)}`) },

    // ---------- Trigonometría ----------
    ondas: { name: 'Funciones Periódicas', art: plate('ondas', SKY, `
      ${L('M38 40H146', INK, .7)}${L('M56 24V56', INK, .7)}
      ${C(56, 40, 13)}${L('M56 40L64.36 30.04', INK, 1.1)}${L('M61 40A5 5 0 0 0 59.21 36.17', INK, .8)}
      ${Ld('M64.36 30.04V40', SKY)}${Ld('M64.36 30.04H81.44', SKY)}
      ${L(fn(x => 40 - 13 * Math.sin((x - 72) / 68 * 2 * Math.PI), 72, 140), SKY, 1.5)}
      ${D(64.36, 30.04, 2, SKY)}${D(81.44, 30.04, 2, SKY)}
      ${T(65, 39.5, 'θ', INK, 4.5)}${T(132, 70, 'T = 2π', INK, 5.5)}`) },

    inversas: { name: 'Identidades y Triángulos', art: plate('inversas', AMBER, `
      ${Ld('M90 14V74')}${L('M34 48H100', INK, .7)}
      ${C(64, 48, 26)}${F('M64 48H85.3V33.09Z', AMBER, .2)}
      ${L('M64 48L90 29.8', INK, 1.2)}${L('M85.3 48V33.09', AMBER, 1.6)}${L('M64 48H85.3', INK, 1.2)}${L('M90 48V29.8', INK, 1.6)}
      ${L('M71 48A7 7 0 0 0 69.73 43.98', INK, .9)}${D(85.3, 33.09, 2, AMBER)}
      ${T(76, 45.5, 'θ', INK, 5.5)}${T(74.6, 54.5, 'cos θ', INK, 5)}${T(96, 41, 'tan θ', INK, 5, 'start')}
      ${T(128, 16, 'sen²θ + cos²θ = 1', AMBER, 5.5)}`) },

    polar: { name: 'El Plano Complejo', art: plate('polar', VIOLET, `
      ${[13, 26, 39].map(r => C(80, 40, r, INK, .5)).join('')}
      ${[0, 30, 60, 90, 120, 150].map(a => L(`M${r2(80 + 34 * Math.cos(rad(a)))} ${r2(40 - 34 * Math.sin(rad(a)))}L${r2(80 - 34 * Math.cos(rad(a)))} ${r2(40 + 34 * Math.sin(rad(a)))}`, INK, a % 90 ? .35 : .8)).join('')}
      ${F(par(t => [80 + 26 * Math.cos(rad(t)), 40 - 26 * Math.sin(rad(t))], 0, 360, 6) + 'Z', VIOLET, .16)}
      ${L(par(t => [80 + 26 * Math.cos(rad(t)), 40 - 26 * Math.sin(rad(t))], 0, 360, 6) + 'Z', VIOLET, 1.3)}
      ${L(`M80 40L${r2(80 + 26 * Math.cos(rad(60)))} ${r2(40 - 26 * Math.sin(rad(60)))}`, INK, 1.1)}
      ${[0, 60, 120, 180, 240, 300].map(a => D(80 + 26 * Math.cos(rad(a)), 40 - 26 * Math.sin(rad(a)), 2, VIOLET)).join('')}
      ${T(118, 37, 'Re', INK, 5)}${T(84, 9, 'Im', INK, 5, 'start')}${T(136, 70, 'z⁶ = 1', VIOLET, 6.5)}`) },

    // ---------- Cálculo ----------
    intervalos: { name: 'Intervalos y Distancias', art: plate('intervalos', SKY, `
      ${L('M18 46H142')}${[32, 44, 56, 68, 80, 92, 104, 116, 128].map(x => L(`M${x} 44V48`, INK, .8)).join('')}
      ${L('M56 46H104', SKY, 3)}${H(56, 46, 2.6, SKY)}${H(104, 46, 2.6, SKY)}
      ${A(80, 33, 58, 33, INK, .9)}${A(80, 33, 102, 33, INK, .9)}${D(80, 46, 1.6)}
      ${T(68, 29, 'r', INK, 6)}${T(92, 29, 'r', INK, 6)}${T(80, 57, 'c', INK, 6)}${T(80, 71, '|x − c| &lt; r', SKY, 7)}`) },

    funciones: { name: 'Lenguaje de Funciones', art: plate('funciones', ROSE, `
      <ellipse cx="56" cy="42" rx="12" ry="24" stroke="${INK}" stroke-width="1.1"/><ellipse cx="104" cy="42" rx="12" ry="24" stroke="${INK}" stroke-width="1.1"/>
      ${[[28, 26], [38, 42], [48, 42], [58, 58]].map(([y1, y2]) => A(59, y1, 99, y2, ROSE, .9) + D(56, y1, 1.8)).join('')}
      ${[26, 42, 58].map(y => D(104, y, 1.8, ROSE)).join('')}${D(108, 50, 1.4)}
      ${T(56, 14, 'A', INK, 6.5)}${T(104, 14, 'B', INK, 6.5)}${T(80, 20, 'f', ROSE, 9)}`) },

    limites: { name: 'Aproximación y Límite', art: plate('limites', TEAL, `
      ${axes(40, 66, 34, 142, 6, 70)}
      ${L(fn(x => 66 - (8 + 44 / (1 + Math.exp(-(x - 80) / 12))), 42, 85.8), TEAL, 1.5)}${L(fn(x => 66 - (8 + 44 / (1 + Math.exp(-(x - 80) / 12))), 90.2, 140), TEAL, 1.5)}
      ${Ld('M88 31V66')}${Ld('M40 28.92H85.8')}${H(88, 28.92, 2.3, TEAL)}
      ${A(66, 73, 82, 73, TEAL, .9)}${A(110, 73, 94, 73, TEAL, .9)}
      ${T(88, 77, 'a', INK, 5.5)}${T(34, 31, 'L', INK, 6.5)}${T(124, 30, 'x → a', INK, 6)}`) },

    derivada: { name: 'Razón de Cambio', art: plate('derivada', AMBER, `
      ${axes(36, 68, 30, 140, 6, 74)}
      ${L(fn(x => 66 - .0055 * (x - 30) ** 2, 36, 128), INK, 1.4)}
      ${L('M58 67.32L122 25.08', AMBER, 1.5)}${Ld('M90 46.2L118 23.41')}
      ${L('M98 40.92H110V33', INK, .8)}${D(90, 46.2, 2.3, AMBER)}${D(118, 23.41, 1.8)}
      ${T(104, 46, 'Δx', INK, 5)}${T(116, 38, 'Δy', INK, 5, 'start')}${T(136, 60, 'f′(x)', AMBER, 7)}`) },

    aplicaciones: { name: 'Optimización', art: plate('aplicaciones', CORAL, `
      ${L('M30 66H140', INK, .7)}
      ${L(fn(x => 64 - 42 * Math.exp(-(((x - 84) / 22) ** 2)), 34, 136), INK, 1.4)}
      ${L('M64 22H104', CORAL, 1.5)}${Ld('M84 22V66')}${D(84, 22, 2.4, CORAL)}
      ${T(84, 14, 'máx', CORAL, 6)}${T(128, 30, 'f′ = 0', INK, 6)}`) },

    // ---------- Geometría vectorial y analítica ----------
    sistemas: { name: 'Álgebra Matricial', art: plate('sistemas', SKY, `
      ${L('M30 60.5H140M61 6V74', INK, .5)}
      ${L('M32 66L132 14', INK, 1.4)}${L('M36 18L128 64', SKY, 1.4)}
      ${C(81.02, 40.51, 4.5, SKY, .8)}${D(81.02, 40.51, 2.2, SKY)}
      ${T(8, 16, 'x − 2y = −2', INK, 5.5, 'start')}${T(8, 25, 'x + 2y = 6', SKY, 5.5, 'start')}`) },

    determinantes: { name: 'Inversión y Determinante', art: plate('determinantes', VIOLET, `
      ${Ld('M58 62H74V46H58Z')}
      ${F('M58 62L94 54L108 20L72 28Z', VIOLET, .22)}${L('M94 54L108 20L72 28', VIOLET, 1.2)}
      ${A(58, 62, 94, 54)}${A(58, 62, 72, 28)}
      ${T(85, 44, 'det', VIOLET, 6.5)}${T(98, 62, 'u', INK, 6.5)}${T(66, 26, 'v', INK, 6.5)}`) },

    vectores: { name: 'Geometría Vectorial', art: plate('vectores', TEAL, `
      ${Ld('M46 62L68 34L108 18')}
      ${A(46, 62, 86, 46)}${A(86, 46, 108, 18)}${A(46, 62, 108, 18, TEAL, 1.5)}
      ${T(66, 61, 'u', INK, 6.5)}${T(102, 38, 'v', INK, 6.5)}${T(94, 13, 'u + v', TEAL, 6.5)}`) },

    productos: { name: 'Productos Vectoriales', art: plate('productos', ROSE, `
      ${L('M72 52L52 66M72 52H130', INK, .6)}${Ld('M72 52V8')}
      ${F('M72 52L100 58L118 44L90 38Z', ROSE, .2)}${L('M100 58L118 44L90 38', ROSE, .9)}
      ${A(72, 52, 100, 58)}${A(72, 52, 90, 38)}${A(72, 52, 68, 16, ROSE, 1.5)}
      ${T(102, 66, 'u', INK, 6.5)}${T(89, 34, 'v', INK, 6.5)}${T(54, 16, 'u × v', ROSE, 6.5)}`) },

    mecanica: { name: 'Fuerza, Trabajo y Momento', art: plate('mecanica', AMBER, `
      ${A(80, 42, 80, 14)}${A(80, 42, 108, 56, AMBER, 1.4)}${A(80, 42, 52, 56, AMBER, 1.4)}${D(80, 42, 2.6)}
      ${A(126, 64, 126, 51.4, INK, .8)}${A(126, 51.4, 138.6, 57.7, AMBER, .8)}${A(138.6, 57.7, 126, 64, AMBER, .8)}
      ${T(86, 18, 'F₁', INK, 6, 'start')}${T(110, 65, 'F₂', AMBER, 6)}${T(50, 65, 'F₃', AMBER, 6)}${T(132, 43, 'ΣF = 0', INK, 5.5)}`) },

    conicas: { name: 'Secciones Cónicas', art: plate('conicas', SKY, `
      <ellipse cx="80" cy="40" rx="34" ry="22" stroke="${INK}" stroke-width="1.3"/>
      ${Ld('M40 40H120')}${L('M54.08 40L97 20.95L105.92 40', SKY, 1.1)}
      ${D(54.08, 40, 2.2, SKY)}${D(105.92, 40, 2.2, SKY)}${D(97, 20.95, 2)}
      ${T(54, 49, 'F₁', INK, 5.5)}${T(106, 49, 'F₂', INK, 5.5)}${T(80, 74, 'd₁ + d₂ = 2a', SKY, 6)}`) },

    // ---------- Física ----------
    cinematica: { name: 'Movimiento en el Plano', art: plate('cinematica', LIME, `
      ${L('M30 62H130', INK, .7)}
      ${Ld(fn(x => 62 - 40 * (1 - ((x - 80) / 40) ** 2), 40, 120))}
      ${A(50, 44.5, 58, 32.5, LIME, 1.3)}${A(80, 22, 88, 22, LIME, 1.3)}${A(110, 44.5, 118, 56.5, LIME, 1.3)}
      ${D(50, 44.5, 2)}${D(80, 22, 2)}${D(110, 44.5, 2)}
      ${A(136, 22, 136, 38, INK, .9)}${T(141, 33, 'g', INK, 6, 'start')}${T(63, 32, 'v', LIME, 6.5)}`) },

    dinamica: { name: 'Leyes de Newton', art: plate('dinamica', CORAL, `
      ${L('M34 66H126V22Z', INK, 1.1)}${L('M46 66A12 12 0 0 0 44.82 60.81', INK, .9)}
      <g transform="translate(86 41.13) rotate(-25.6)"><rect x="-8" y="-16" width="16" height="16" fill="#07080F" stroke="${INK}" stroke-width="1.2"/></g>
      ${A(82.54, 33.91, 82.54, 60, CORAL, 1.4)}${A(82.54, 33.91, 73.04, 14.07)}${A(82.54, 33.91, 96.97, 27, INK, .9)}
      ${T(89, 61, 'mg', CORAL, 5.5, 'start')}${T(68, 12, 'N', INK, 6)}${T(101, 24, 'f', INK, 5.5)}${T(53, 63, 'α', INK, 5)}${T(138, 14, 'F = ma', CORAL, 6.5)}`) },

    // ---------- Cálculo integral ----------
    integral: { name: 'Acumulación y Área', art: plate('integral', TEAL, `
      ${axes(44, 66, 36, 140, 8, 72)}
      ${[48, 56, 64, 72, 80, 88, 96, 104].map(x => { const y = 66 - (14 + 30 * Math.sin((x + 4 - 44) / 72 * Math.PI)); return F(`M${x} 66V${r2(y)}H${x + 8}V66Z`, TEAL, .25) + L(`M${x} 66V${r2(y)}H${x + 8}V66`, TEAL, .7); }).join('')}
      ${L(fn(x => 66 - (14 + 30 * Math.sin((x - 44) / 72 * Math.PI)), 44, 116), INK, 1.5)}
      ${T(48, 74, 'a', INK, 5.5)}${T(112, 74, 'b', INK, 5.5)}${T(28, 40, '∫', INK, 18)}`) },

    // ---------- Álgebra lineal ----------
    lineal: { name: 'Transformaciones Lineales', art: plate('lineal', VIOLET, `
      ${Ld('M30 42H130M80 6V76')}
      ${[-3, -2, -1, 0, 1, 2, 3].map(a => L(`M${r2(80 + 16 * a - 16)} ${r2(42 - 4 * a + 32)}L${r2(80 + 16 * a + 16)} ${r2(42 - 4 * a - 32)}`, VIOLET, .55)).join('')}
      ${[-2, -1, 0, 1, 2].map(b => L(`M${r2(80 - 48 + 8 * b)} ${r2(42 + 12 - 16 * b)}L${r2(80 + 48 + 8 * b)} ${r2(42 - 12 - 16 * b)}`, VIOLET, .55)).join('')}
      ${F('M80 42L96 38L104 22L88 26Z', VIOLET, .28)}
      ${A(80, 42, 96, 38, INK, 1.5)}${A(80, 42, 88, 26, VIOLET, 1.5)}
      ${T(100, 46, 'T(e₁)', INK, 5.5, 'start')}${T(84, 20, 'T(e₂)', VIOLET, 5.5)}`) },

    // ---------- Preuniversitario UdeA · Razonamiento lógico ----------
    'pu-calculo': { name: 'Cálculo Mental', art: plate('pu-calculo', TEAL, `
      ${L('M50 22h60M50 58h60', INK, .8)}${T(80, 34, '8 − 2·(5 − 7)²', INK, 8)}
      ${A(80, 40, 80, 48, TEAL, 1)}${T(80, 55, '= 0', TEAL, 9)}
      ${C(44, 40, 6, INK, .8, true)}${T(44, 42.5, '÷', INK, 7)}${C(116, 40, 6, INK, .8, true)}${T(116, 42.5, '×', INK, 7)}
      ${T(26, 72, '¼ = 0.25', INK, 5.5)}${T(134, 72, '25 %', TEAL, 6)}`) },
    'pu-geometria': { name: 'Geometría Plana y Sólida', art: plate('pu-geometria', TEAL, `
      ${F('M50 60H96V24Z', TEAL, .2)}${L('M50 60H96V24Z')}${L('M90 60v-6h6', INK, .8)}
      ${T(73, 68, 'a', INK, 6.5)}${T(102, 44, 'b', INK, 6.5)}${T(68, 38, 'c', TEAL, 7)}
      ${C(118, 30, 10, INK, .9)}${L('M118 30h10', TEAL, 1)}${D(118, 30, 1.2)}${T(124, 27, 'r', TEAL, 5.5)}
      ${T(30, 24, 'c² = a² + b²', INK, 5.5)}`) },
    'pu-orden': { name: 'Acertijos de Orden', art: plate('pu-orden', TEAL, `
      ${[0, 1, 2, 3, 4].map(i => L(`M${46 + i * 14} 30h12v14h-12z`, i === 2 ? TEAL : INK, i === 2 ? 1.3 : .8) + T(52 + i * 14, 52, i + 1, INK, 5)).join('')}
      ${D(52, 37, 2, TEAL)}${D(66, 37, 2)}${D(94, 37, 2)}${H(108, 37, 2.2, TEAL)}
      ${A(66, 24, 52, 24, TEAL, .9)}${T(80, 20, 'antes de…', INK, 5.5)}
      ${T(80, 66, '¿tiene que · podría · no puede?', INK, 4.8)}`) },
    'pu-proporcion': { name: 'Proporcionalidad', art: plate('pu-proporcion', TEAL, `
      ${F('M48 58h20v-10h-20z', TEAL, .35)}${F('M70 58h30v-15h-30z', TEAL, .35)}${L('M48 58h20v-10h-20zM70 58h30v-15h-30z')}
      ${T(58, 66, '2', INK, 6)}${T(85, 66, '3', INK, 6)}
      ${T(110, 30, '× 1.19', TEAL, 7)}${T(52, 30, 'a : b', INK, 7)}${A(66, 28, 98, 28, INK, .8)}
      ${T(124, 56, '%', TEAL, 12)}`) },
    'pu-conteo': { name: 'Conteo y Combinatoria', art: plate('pu-conteo', TEAL, `
      ${D(56, 40, 2.2, TEAL)}${[24, 40, 56].map(y => L(`M56 40L80 ${y}`, INK, .9) + D(80, y, 1.8)).join('')}
      ${[24, 40, 56].map(y => [-5, 5].map(d => L(`M80 ${y}L104 ${y + d}`, INK, .6) + D(104, y + d, 1.4, TEAL)).join('')).join('')}
      ${T(80, 70, '3 · 2 = 6', TEAL, 7)}${T(126, 30, 'n!', INK, 9)}${T(30, 30, 'C(n, k)', INK, 6)}`) },
    'pu-espacial': { name: 'Razonamiento Espacial', art: plate('pu-espacial', TEAL, `
      ${F('M66 34l14-8 14 8-14 8z', TEAL, .3)}${L('M66 34l14-8 14 8-14 8zM66 34v18l14 8 14-8V34M80 42v18')}
      ${Ld('M66 52l14-8 14 8M80 26v18')}
      ${L('M106 30h8v8h-8zM114 30h8v8h-8zM114 22h8v8h-8zM114 38h8v8h-8z', INK, .7)}${T(118, 56, 'desarrollo', INK, 4.5)}
      ${L('M40 26v28', TEAL, .8)}${T(34, 34, 'F', INK, 9)}${L('M48 26v10M48 26h-5M48 30.5h-4', TEAL, 1.1)}`) },
    'pu-secuencias': { name: 'Secuencias y Patrones', art: plate('pu-secuencias', TEAL, `
      ${[3, 4, 7, 11, 18].map((v, i) => C(46 + i * 17, 40, 6, i === 4 ? TEAL : INK, .9) + T(46 + i * 17, 42.5, v, i === 4 ? TEAL : INK, 6)).join('')}
      ${T(80, 58, 'a + b', TEAL, 5)}
      ${L('M50 33q4-6 8 0M67 33q4-6 8 0M84 33q4-6 8 0M101 33q4-6 8 0', INK, .7)}
      ${T(134, 22, 'n mod 7', INK, 5.5)}`) },
    'pu-codigos': { name: 'Códigos y Claves', art: plate('pu-codigos', TEAL, `
      ${C(80, 40, 22, INK, 1)}${C(80, 40, 14, TEAL, 1)}
      ${['A', 'B', 'C', 'D', 'E', 'F'].map((ch, i) => { const a = rad(i * 60 - 90); return T(80 + 18.5 * Math.cos(a), 42 + 18.5 * Math.sin(a), ch, INK, 5); }).join('')}
      ${['C', 'D', 'E', 'F', 'G', 'H'].map((ch, i) => { const a = rad(i * 60 - 90); return T(80 + 9 * Math.cos(a), 42 + 9 * Math.sin(a), ch, TEAL, 4.5); }).join('')}
      ${L('M80 18v8M80 54v8', TEAL, 1)}${L('M58 40h-6M108 40h-6', INK, .8)}${D(80, 40, 1.6, TEAL)}${L('M120 26h20M120 34h14', INK, .7)}${T(130, 46, 'SOL → VRO', INK, 5)}${T(30, 54, '+2', TEAL, 8)}`) },
    'pu-graficas': { name: 'Tablas y Gráficas', art: plate('pu-graficas', TEAL, `
      ${axes(50, 60, 46, 114, 20, 60)}
      ${[[56, 20], [68, 30], [80, 14], [92, 24]].map(([x, h]) => F(`M${x} 60h8v-${h}h-8z`, TEAL, .35) + L(`M${x} 60h8v-${h}h-8z`, TEAL, .9)).join('')}
      ${L('M100 46L106 34L112 38', INK, 1)}${D(106, 34, 1.6)}
      ${C(128, 34, 10, INK, .9)}${F('M128 34V24A10 10 0 0 1 137.5 37.1Z', TEAL, .45)}`) },
    'pu-logica': { name: 'Lógica Proposicional', art: plate('pu-logica', TEAL, `
      ${L('M48 24h64v32H48zM48 32h64M80 24v32M48 40h64M48 48h64', INK, .7)}
      ${T(64, 30, 'p → q', TEAL, 5)}${T(96, 30, 'valor', INK, 5)}
      ${[['V V', 'V'], ['V F', 'F'], ['F V', 'V']].map(([a, b], i) => T(64, 38 + i * 8, a, INK, 5) + T(96, 38 + i * 8, b, b === 'F' ? TEAL : INK, 5)).join('')}
      ${T(30, 66, '¬(p ∧ q)', INK, 5.5)}${T(132, 66, '¬p ∨ ¬q', TEAL, 5.5)}${D(112, 52, 1.6, TEAL)}${C(136, 30, 6, TEAL, .9)}${Ld('M44 60h72')}${D(48, 52, 1.2)}${D(48, 44, 1.2)}${L('M133 30l2 3 4-6', TEAL, 1)}`) },
    'pu-operadores': { name: 'Operadores Definidos', art: plate('pu-operadores', TEAL, `
      ${L('M60 28h40v24H60z', INK, 1)}${T(80, 44, '★', TEAL, 13)}
      ${A(40, 34, 58, 34, INK, .9)}${A(40, 46, 58, 46, INK, .9)}${T(34, 36, 'a', INK, 7)}${T(34, 48, 'b', INK, 7)}
      ${A(102, 40, 120, 40, TEAL, 1)}${T(136, 42, '2a − b', TEAL, 6)}
      ${T(80, 66, 'a ★ b = 2a − b', INK, 5.5)}`) },
    'pu-aritmetica': { name: 'Aritmética y Promedios', art: plate('pu-aritmetica', TEAL, `
      ${L('M46 50h72', INK, .9)}
      ${[3, 7, 7, 8, 10].map((v, i) => D(46 + v * 7, 46 - i % 2 * 6, 2, i === 2 ? TEAL : INK)).join('')}
      ${L('M95 32V54', TEAL, 1.2)}${T(95, 28, 'x̄ = 7', TEAL, 6)}
      ${F('M50 62h18v-6h-18z', INK, .3)}${F('M70 62h12v-6h-12z', TEAL, .4)}${T(100, 61, '⅓ · ¼', INK, 5.5)}`) },
    'pu-ecuaciones': { name: 'Ecuaciones con Contexto', art: plate('pu-ecuaciones', TEAL, `
      ${L('M80 22v30M54 30h52', INK, 1.1)}${L('M80 52l-6 6h12z', INK, .9)}
      ${L('M54 30l-8 12h16zM106 30l-8 12h16z', INK, .8)}
      ${T(54, 40, 'x + y', TEAL, 5)}${T(106, 40, '10', TEAL, 5)}
      ${T(80, 70, 'x − y = 2', TEAL, 7)}${T(28, 22, 'x = 6', INK, 5)}${D(54, 30, 1.6, TEAL)}${D(106, 30, 1.6, TEAL)}${Ld('M40 62h80')}`) },
    'pu-conjuntos': { name: 'Conjuntos y Encuestas', art: plate('pu-conjuntos', TEAL, `
      ${F('M80 26.8A15 15 0 0 1 80 49.2A15 15 0 0 1 80 26.8Z', TEAL, .4)}
      ${C(70, 38, 15)}${C(90, 38, 15)}${L('M44 18h72v44H44z', INK, .6)}
      ${T(62, 41, 'A', INK, 6)}${T(80, 41, '∩', TEAL, 6)}${T(98, 41, 'B', INK, 6)}${T(52, 58, 'U', INK, 5.5)}
      ${T(136, 30, 'n(A ∪ B)', INK, 5.5)}${D(60, 46, 1.2)}${D(98, 46, 1.2)}${Ld('M118 36h-10')}`) },
    'pu-numeros': { name: 'Teoría de Números', art: plate('pu-numeros', TEAL, `
      ${T(80, 26, '360', INK, 9)}${L('M80 30L68 40M80 30L92 40', INK, .9)}
      ${T(66, 46, '36', INK, 7)}${T(94, 46, '10', INK, 7)}${L('M66 50l-6 8M66 50l6 8M94 50l-5 8M94 50l5 8', INK, .7)}
      ${T(60, 64, '6', TEAL, 5.5)}${T(72, 64, '6', TEAL, 5.5)}${T(89, 64, '2', TEAL, 5.5)}${T(99, 64, '5', TEAL, 5.5)}
      ${T(132, 34, 'MCD', INK, 5.5)}${T(30, 34, 'MCM', INK, 5.5)}${D(80, 30, 1.4, TEAL)}${C(132, 46, 5, TEAL, .8)}${C(30, 46, 5, INK, .8, true)}${Ld('M46 70h68')}`) },
    'pu-probabilidad': { name: 'Azar y Probabilidad', art: plate('pu-probabilidad', TEAL, `
      ${L('M52 30h22v22H52z', INK, 1)}${D(57, 35, 1.6)}${D(63, 41, 1.6)}${D(69, 47, 1.6)}
      ${L('M86 30h22v22H86z', TEAL, 1)}${D(91, 35, 1.6, TEAL)}${D(103, 35, 1.6, TEAL)}${D(91, 47, 1.6, TEAL)}${D(103, 47, 1.6, TEAL)}
      ${T(80, 68, 'P = 6 / 36', TEAL, 6.5)}${T(80, 20, 'favorables / posibles', INK, 4.8)}`) },

    // ---------- Preuniversitario UdeA · Comprensión lectora ----------
    'pu-estrategias': { name: 'Estrategias de Lectura', art: plate('pu-estrategias', TEAL, `
      ${L('M56 18h48v46H56z', INK, 1)}${L('M62 26h24', TEAL, 1.5)}
      ${[34, 40, 46, 52].map(y => L(`M62 ${y}h36`, INK, .6)).join('')}
      ${F('M60 37h40v6H60z', TEAL, .3)}${A(112, 40, 104, 40, TEAL, 1)}${T(126, 42, 'idea', TEAL, 5.5)}
      ${T(32, 26, '15 min', INK, 5.5)}${C(32, 40, 7, INK, .8)}${L('M32 40v-4M32 40l3 2', INK, .8)}`) },
    'pu-tipos': { name: 'Tipos de Texto', art: plate('pu-tipos', TEAL, `
      ${[[46, 'narra'], [66, 'describe'], [86, 'explica'], [106, 'argumenta']].map(([x, t], i) => L(`M${x} 22h14v34h-14z`, i === 3 ? TEAL : INK, i === 3 ? 1.2 : .8) + L(`M${x + 3} 30h8M${x + 3} 36h8M${x + 3} 42h6`, INK, .5) + T(x + 7, 64, t, i === 3 ? TEAL : INK, 3.8)).join('')}
      ${T(80, 16, 'tesis → argumentos', INK, 4.8)}`) },
    'pu-explicita': { name: 'Información Explícita', art: plate('pu-explicita', TEAL, `
      ${[24, 31, 38, 45, 52].map(y => L(`M46 ${y}h56`, INK, .6)).join('')}
      ${F('M60 35h28v6H60z', TEAL, .45)}
      ${C(110, 46, 9, TEAL, 1.2)}${L('M116.5 52.5l7 7', TEAL, 1.6)}
      ${T(80, 66, '«según el texto…»', INK, 5)}`) },
    'pu-inferencia': { name: 'Inferencia', art: plate('pu-inferencia', TEAL, `
      ${[26, 33, 40].map(y => L(`M42 ${y}h40`, INK, .6)).join('')}${D(84, 40, 1.5, TEAL)}
      ${A(88, 34, 104, 34, TEAL, 1)}${C(116, 34, 9, TEAL, 1)}${T(116, 37, '∴', TEAL, 8)}
      ${Ld('M42 50h40')}${T(62, 60, 'pistas del texto', INK, 4.5)}${T(116, 54, 'conclusión', TEAL, 4.5)}`) },
    'pu-vocabulario': { name: 'Vocabulario en Contexto', art: plate('pu-vocabulario', TEAL, `
      ${L('M44 30h22M94 30h22', INK, .6)}${L('M68 24h24v12H68z', TEAL, 1.2)}${T(80, 33, 'sólida', TEAL, 5.5)}
      ${A(80, 38, 80, 48, INK, .8)}${T(80, 56, 'bien fundada', INK, 5.5)}
      ${Ld('M80 38L56 52')}${T(50, 60, 'dura', INK, 5)}${L('M44 58l12 4', INK, .8)}
      ${T(126, 66, 'bio · logía', TEAL, 5)}`) },
    'pu-aplicacion': { name: 'Aplicación y Analogía', art: plate('pu-aplicacion', TEAL, `
      ${T(58, 32, 'A', INK, 9)}${T(74, 32, ':', INK, 9)}${T(90, 32, 'B', INK, 9)}
      ${T(58, 56, 'C', TEAL, 9)}${T(74, 56, ':', TEAL, 9)}${T(90, 56, 'D', TEAL, 9)}
      ${L('M50 40h48', INK, .5)}${T(74, 44, '::', INK, 7)}
      ${A(104, 28, 116, 40, INK, .8)}${A(116, 40, 104, 52, TEAL, .8)}${T(128, 42, 'misma relación', INK, 4.2)}`) },
    'pu-fuentes': { name: 'Voces y Citas', art: plate('pu-fuentes', TEAL, `
      ${L('M48 22h30q4 0 4 4v12q0 4-4 4H60l-6 6v-6h-6q-4 0-4-4V26q0-4 4-4z', INK, 1)}${T(63, 35, '«…»', INK, 7)}
      ${L('M86 34h26q4 0 4 4v10q0 4-4 4h-6v6l-6-6H86q-4 0-4-4V38q0-4 4-4z', TEAL, 1.1)}${T(99, 46, 'según', TEAL, 5)}
      ${T(80, 68, 'autor · citado', INK, 5)}${D(56, 30, 1.3)}${D(70, 30, 1.3)}${D(94, 42, 1.3, TEAL)}${Ld('M44 62h72')}`) },
    'pu-conectores': { name: 'Conectores y Funciones', art: plate('pu-conectores', TEAL, `
      ${L('M42 34h22v12H42zM96 34h22v12H96z', INK, .9)}
      ${L('M64 40h32', TEAL, 1.5)}${C(80, 40, 5, TEAL, 1.1)}
      ${T(80, 28, 'sin embargo', TEAL, 5)}${T(53, 54, 'idea 1', INK, 4.5)}${T(107, 54, 'idea 2', INK, 4.5)}
      ${T(80, 68, '«» · ( ) · — · :', INK, 5.5)}${D(42, 40, 1.4)}${D(118, 40, 1.4)}${Ld('M46 60h68')}`) },
    'pu-argumentacion': { name: 'Argumentación y Tono', art: plate('pu-argumentacion', TEAL, `
      ${L('M64 22h32v10H64z', TEAL, 1.2)}${T(80, 29, 'tesis', TEAL, 5.5)}
      ${L('M70 32V48M80 32V48M90 32V48', INK, .9)}${L('M58 48h44v6H58z', INK, .8)}
      ${T(66, 62, 'datos', INK, 4)}${T(80, 62, 'ejemplo', INK, 4)}${T(95, 62, 'autoridad', INK, 4)}
      ${T(126, 30, 'hecho', INK, 5)}${T(126, 40, 'opinión', TEAL, 5)}${D(70, 48, 1.3)}${D(80, 48, 1.3)}${D(90, 48, 1.3)}${Ld('M116 35h20')}`) },
    'pu-dos-textos': { name: 'Lectura de Dos Textos', art: plate('pu-dos-textos', TEAL, `
      ${L('M46 22h26v36H46z', INK, .9)}${L('M88 22h26v36H88z', TEAL, 1)}
      ${[30, 36, 42, 48].map(y => L(`M50 ${y}h18M92 ${y}h18`, INK, .5)).join('')}
      ${L('M72 34h16M72 46h16', INK, .7)}${D(80, 34, 1.4, TEAL)}${D(80, 46, 1.4, TEAL)}
      ${T(59, 66, 'A', INK, 6)}${T(101, 66, 'B', TEAL, 6)}`) },
    'pu-referencia': { name: 'Referencia y Cohesión', art: plate('pu-referencia', TEAL, `
      ${L('M44 30h18M84 50h18', INK, .6)}${L('M64 26h18v8H64z', INK, 1)}${T(73, 32, 'gato', INK, 4.5)}
      ${L('M104 46h12v8h-12z', TEAL, 1.1)}${T(110, 52, 'felino', TEAL, 4)}
      ${L('M110 46C110 30 90 22 76 26', TEAL, .9)}${D(76, 26, 1.4, TEAL)}
      ${T(60, 64, 'este · aquel · lo cual', INK, 4.6)}`) },
    'pu-figurado': { name: 'Lenguaje Figurado', art: plate('pu-figurado', TEAL, `
      ${T(62, 34, 'calles', INK, 6)}${T(62, 48, '=', INK, 7)}${T(62, 60, 'ríos', TEAL, 7)}
      ${L('M86 50q6-14 12 0t12 0', TEAL, 1.2)}${L('M86 56q6-14 12 0t12 0', INK, .7)}
      ${T(110, 28, 'como', INK, 5)}${T(30, 30, 'ironía', INK, 5)}${C(30, 44, 5, TEAL, .8, true)}${D(86, 50, 1.3, TEAL)}${D(110, 50, 1.3, TEAL)}${Ld('M50 40h24')}`) },
  };
})();

// Trazo del sendero que une niveles o mundos: xs son los desplazamientos horizontales de cada botón
// (centro = 0), step la altura de cada fila y cy el centro vertical del botón dentro de su fila.
function worldTrail(xs, step, cy = 34) {
  if (xs.length < 2) return '';
  const y = i => cy + i * step, h = step / 2;
  return `M${xs[0]} ${y(0)}` + xs.slice(1).map((x, i) => ` C${xs[i]} ${y(i) + h} ${x} ${y(i + 1) - h} ${x} ${y(i + 1)}`).join('');
}

// Resumen en PDF de cada mundo (spec 2026-11-13-resumenes-pdf): fuente LaTeX en docs/resumenes/tex/<mundo>.tex,
// compilado con `sh docs/resumenes/build.sh` en media/resumenes/<mundo>.pdf. Por ahora: Álgebra y Trigonometría.
const RESUMENES = ['conjuntos', 'numeros', 'razones', 'potencias', 'progresiones', 'polinomios', 'cuadraticas',
  'grado-superior', 'racionales', 'exp-log', 'ondas', 'inversas', 'polar'];
function summaryOf(u) {
  return u && RESUMENES.includes(u.world) ? `media/resumenes/${u.world}.pdf` : null;
}
