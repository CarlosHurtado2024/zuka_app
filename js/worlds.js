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
