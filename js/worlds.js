// Mundos del mapa de cada curso (spec 2026-11-11-mapa-de-mundos): cada unidad es un "mundo" con nombre
// de lugar y una ilustración plana (SVG 160×80) que trae su propio cielo, así se ve igual en ambos temas.

const wSvg = (id, top, bottom, body) => `<svg viewBox="0 0 160 80" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
  <rect width="160" height="80" fill="url(#sky-${id})"/>${body}</svg>`;
const wSun = (x, y, r, c = '#ffd451', halo = .25) => `<circle cx="${x}" cy="${y}" r="${r + 5}" fill="${c}" opacity="${halo}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const wCloud = (x, y, s = 1, o = .85) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${o}"><ellipse cx="0" cy="0" rx="9" ry="4"/><ellipse cx="6" cy="-3" rx="6" ry="5"/><ellipse cx="-5" cy="-2" rx="5" ry="4"/></g>`;
const wStars = (pts, c = '#fff') => pts.map(([x, y, r = .9]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('');
const wHill = (d, c) => `<path d="${d}" fill="${c}"/>`;
const wArrow = (x1, y1, x2, y2, c, w = 3) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = w * 2.4, s = w * 1.5;
  const bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a);
  const r = n => Math.round(n * 10) / 10;
  return `<path d="M${x1} ${y1}L${r(bx)} ${r(by)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>
    <path d="M${x2} ${y2}L${r(bx - s * Math.sin(a))} ${r(by + s * Math.cos(a))}L${r(bx + s * Math.sin(a))} ${r(by - s * Math.cos(a))}z" fill="${c}"/>`;
};
const wFlag = (x, y, c = '#ff5a74') => `<path d="M${x} ${y}v-14" stroke="#3b2a1a" stroke-width="1.6"/><path d="M${x} ${y - 14}l9 3.5-9 3.5z" fill="${c}"/>`;

const WORLDS = {
  // ---------- Álgebra ----------
  conjuntos: { name: 'Pradera de Venn', art: wSvg('conjuntos', '#8fd8ff', '#d9f7ec', `
    ${wSun(136, 16, 8)}${wCloud(30, 16)}${wCloud(98, 12, .8)}
    ${wHill('M0 62Q40 50 80 58T160 56V80H0z', '#58c98a')}${wHill('M0 70Q50 62 100 68T160 66V80H0z', '#3fae72')}
    <circle cx="66" cy="38" r="17" fill="#ff7aa8" opacity=".55"/><circle cx="90" cy="38" r="17" fill="#ffd451" opacity=".55"/>
    <circle cx="78" cy="56" r="17" fill="#6f8fff" opacity=".55"/>
    <g fill="none" stroke="#fff" stroke-width="1.6" opacity=".9"><circle cx="66" cy="38" r="17"/><circle cx="90" cy="38" r="17"/><circle cx="78" cy="56" r="17"/></g>
    ${wStars([[58, 32, 2], [94, 31, 2], [78, 44, 2.2], [72, 62, 2], [99, 46, 1.6], [56, 50, 1.6]], '#fff')}
    <g fill="#fff"><circle cx="20" cy="70" r="2"/><circle cx="140" cy="72" r="2"/><circle cx="122" cy="66" r="1.6"/></g>
    <g fill="#ffd451"><circle cx="20" cy="70" r=".9"/><circle cx="140" cy="72" r=".9"/><circle cx="122" cy="66" r=".8"/></g>`) },

  numeros: { name: 'Valle de los Números', art: wSvg('numeros', '#ffcfa8', '#e9d5ff', `
    <circle cx="128" cy="20" r="11" fill="#ffd451"/><path d="M128 20V9A11 11 0 0 1 139 20z" fill="#ffefb0"/>
    <path d="M128 20V9M128 20h11" stroke="#d99a00" stroke-width="1.2"/>
    ${wHill('M0 56L26 30 46 48 70 24 98 52 120 36 160 58V80H0z', '#8b7bff')}${wHill('M0 60L20 46 40 58 60 42 84 60H0z', '#6d5ce8')}
    ${wHill('M0 60H160V80H0z', '#4fbf86')}
    <path d="M6 70H150" stroke="#f5f0ff" stroke-width="3.2" stroke-linecap="round"/><path d="M148 66l6 4-6 4" fill="none" stroke="#f5f0ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <g stroke="#f5f0ff" stroke-width="1.8">${[18, 38, 58, 78, 98, 118, 138].map(x => `<path d="M${x} 66v8"/>`).join('')}</g>
    ${wFlag(86.3, 68, '#ffd451')}<circle cx="86.3" cy="70" r="2.4" fill="#ff5a74"/>`) },

  potencias: { name: 'Torres de Potencias', art: wSvg('potencias', '#4b2d8f', '#f59ac2', `
    ${wStars([[18, 10], [40, 6], [70, 12], [150, 8], [104, 6]])}
    ${wHill('M0 68H160V80H0z', '#2b1c55')}
    ${[[20, 6, '#a78bfa'], [44, 12, '#8b7bff'], [72, 24, '#7c6cf0'], [108, 48, '#6d5ce8']].map(([x, h, c], i) =>
      `<rect x="${x + 2}" y="${68 - h}" width="20" height="${h}" fill="#2b1c55"/><rect x="${x}" y="${68 - h - 1}" width="20" height="${h}" rx="1.5" fill="${c}"/>
       ${Array.from({ length: Math.max(1, h / 6 | 0) }, (_, k) => `<rect x="${x + 7}" y="${66 - h + k * 6}" width="6" height="3" rx=".8" fill="#ffd451" opacity=".85"/>`).join('')}
       <text x="${x + 10}" y="${64 - h}" text-anchor="middle" font-size="7" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">${2 ** i}</text>`).join('')}
    <path d="M8 30l4-3 5 12 8-24h22" fill="none" stroke="#ffd451" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`) },

  progresiones: { name: 'Escalera de Sigma', art: wSvg('progresiones', '#7cc7ff', '#c8f3ff', `
    ${wSun(26, 18, 7)}${wCloud(104, 14, .9)}
    <path d="M80 8H64l9 10-9 10h16" fill="none" stroke="#ff5a74" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    
    ${wHill('M0 70H160V80H0z', '#3fae72')}
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${20 + i * 18}" y="${62 - i * 8}" width="18" height="${8 + i * 8}" fill="${i % 2 ? '#2ab3a6' : '#35c9bb'}"/><rect x="${20 + i * 18}" y="${62 - i * 8}" width="18" height="2.5" fill="#bff7ef"/>`).join('')}
    ${wFlag(124, 22, '#ffd451')}<circle cx="31" cy="58" r="3.2" fill="#ffd451"/><circle cx="31" cy="53" r="2.4" fill="#ffe3c2"/>`) },

  polinomios: { name: 'Taller de los Bloques', art: wSvg('polinomios', '#ffb86b', '#ffe6c2', `
    ${wCloud(126, 14)}${wCloud(24, 12, .7)}
    ${wHill('M0 66H160V80H0z', '#9a6a3a')}
    <rect x="47" y="23" width="34" height="34" rx="2" fill="#4b3bc4"/><rect x="44" y="20" width="34" height="34" rx="2" fill="#8b7bff"/>
    <rect x="85" y="23" width="14" height="34" rx="2" fill="#4b3bc4"/><rect x="82" y="20" width="14" height="34" rx="2" fill="#b3a8ff"/>
    <rect x="47" y="61" width="34" height="5" fill="#4b3bc4"/><rect x="44" y="57" width="34" height="9" rx="2" fill="#b3a8ff"/>
    <rect x="82" y="57" width="14" height="9" rx="2" fill="#ffd451"/>
    <text x="61" y="41" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">a²</text>
    <path d="M124 66V22h-30" stroke="#ff8a3d" stroke-width="3" fill="none" stroke-linejoin="round"/><path d="M110 22v8" stroke="#3b2a1a" stroke-width="1.2"/>
    <rect x="105" y="30" width="10" height="7" rx="1" fill="#ffd451"/><path d="M118 66l6-8 6 8z" fill="#ff8a3d"/>`) },

  cuadraticas: { name: 'Fuente de la Parábola', art: wSvg('cuadraticas', '#1d2a6b', '#5b7bd6', `
    ${wStars([[14, 12], [36, 22], [60, 8], [110, 14], [150, 24], [132, 6]])}
    <path d="M140 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ffd451"/><text x="140" y="35" text-anchor="middle" font-size="8" font-style="italic" font-weight="700" fill="#ffd451" font-family="Georgia,serif">i</text>
    ${wHill('M0 64H160V80H0z', '#22346e')}<path d="M0 64H160" stroke="#8aa6ff" stroke-width="1.2"/>
    <path d="M36 64Q80 -18 124 64" fill="none" stroke="#7fe3ff" stroke-width="5" stroke-linecap="round" opacity=".45"/>
    <path d="M36 64Q80 -18 124 64" fill="none" stroke="#c9f5ff" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 4"/>
    <rect x="70" y="58" width="20" height="10" rx="2" fill="#6f8fff"/><rect x="66" y="66" width="28" height="6" rx="2" fill="#4b5fc4"/>
    <g fill="#7fe3ff"><circle cx="36" cy="63" r="3"/><circle cx="124" cy="63" r="3"/><circle cx="80" cy="23" r="2.5" fill="#ffd451"/></g>`) },

  'grado-superior': { name: 'Cordillera Cúbica', art: wSvg('grado-superior', '#b8e1ff', '#eaf6ff', `
    ${wSun(30, 16, 6)}${wCloud(120, 12, .9)}
    <path d="M0 80V58H160V80z" fill="#3b8fd9"/><path d="M0 58H160" stroke="#d6efff" stroke-width="1.2"/>
    <path d="M8 76C24 24 48 22 60 58S96 92 104 58S124 14 152 22V58H8z" fill="#5b6b8f"/>
    <path d="M8 76C24 24 48 22 60 58S96 92 104 58S124 14 152 22" fill="none" stroke="#ffd451" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M30 34l5-6 5 6z" fill="#fff"/><path d="M142 20l5-3 5 3v4z" fill="#fff"/>
    ${wFlag(14.6, 58, '#ff5a74')}${wFlag(60, 58, '#ff5a74')}${wFlag(104, 58, '#ff5a74')}`) },

  racionales: { name: 'Río de las Asíntotas', art: wSvg('racionales', '#a7f0d0', '#e8fff6', `
    ${wCloud(28, 14)}${wSun(140, 14, 6)}
    ${wHill('M0 80V30Q60 34 70 80z', '#3fae72')}${wHill('M160 80V24Q100 26 90 80z', '#58c98a')}
    <path d="M70 80Q62 40 0 34M90 80Q98 34 160 28" fill="none" stroke="#ffd451" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="72" y="0" width="16" height="80" fill="#4aa8ff" opacity=".85"/>
    <path d="M80 0V80" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>
    <g fill="#d6f2ff" opacity=".9"><ellipse cx="80" cy="74" rx="11" ry="3"/></g>
    <path d="M0 52H160" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 3" opacity=".8"/>
    <circle cx="36" cy="46" r="4" fill="#2f8a57"/><circle cx="128" cy="44" r="5" fill="#2f8a57"/>`) },

  'exp-log': { name: 'Selva Exponencial', art: wSvg('exp-log', '#c7f08a', '#fff6c2', `
    ${wSun(30, 18, 7)}
    ${wHill('M0 64Q30 54 60 62T120 58T160 60V80H0z', '#2f8a57')}${wHill('M0 72Q40 66 80 72T160 70V80H0z', '#1f6b42')}
    <path d="M10 66C70 64 108 52 132 6" fill="none" stroke="#1f6b42" stroke-width="4" stroke-linecap="round"/>
    <path d="M10 66C70 64 108 52 132 6" fill="none" stroke="#7bd88f" stroke-width="2" stroke-linecap="round"/>
    ${[[60, 60, -20], [92, 52, -35], [114, 36, -55], [126, 20, -65]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="2.6" transform="rotate(${r} ${x} ${y})" fill="#58c98a"/>`).join('')}
    <path d="M40 76C44 60 60 50 96 46" fill="none" stroke="#ff8a3d" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="1 4"/>
    <circle cx="132" cy="6" r="3.5" fill="#ff5a74"/><circle cx="24" cy="60" r="5" fill="#3fae72"/><circle cx="150" cy="56" r="6" fill="#3fae72"/>`) },

  // ---------- Trigonometría ----------
  ondas: { name: 'Mar de las Ondas', art: wSvg('ondas', '#ff9a8b', '#7fe3ff', `
    <circle cx="44" cy="26" r="16" fill="#ffd451" opacity=".95"/><circle cx="44" cy="26" r="16" fill="none" stroke="#fff" stroke-width="1.4"/>
    <path d="M44 26L55.3 14.7" stroke="#ff5a74" stroke-width="2.2" stroke-linecap="round"/><path d="M55.3 14.7V26" stroke="#22d3ee" stroke-width="2" stroke-dasharray="2 2"/>
    <path d="M51 26a7 7 0 0 0-2-5" fill="none" stroke="#fff" stroke-width="1.4"/>
    <path d="M0 52Q10 42 20 52T40 52T60 52T80 52T100 52T120 52T140 52T160 52V80H0z" fill="#22a6c7"/>
    <path d="M0 60Q15 50 30 60T60 60T90 60T120 60T150 60T180 60V80H0z" fill="#168aa8"/>
    <path d="M0 70Q20 62 40 70T80 70T120 70T160 70V80H0z" fill="#0e6d87"/>
    <path d="M0 52Q10 42 20 52T40 52T60 52T80 52T100 52T120 52T140 52T160 52" fill="none" stroke="#e8fbff" stroke-width="1.4"/>
    <path d="M118 40l8 4h-12z" fill="#fff"/><path d="M114 44h14l-2 3h-10z" fill="#ff5a74"/>`) },

  inversas: { name: 'Faro de los Ángulos', art: wSvg('inversas', '#0f1d4a', '#3a5bb8', `
    ${wStars([[20, 10], [50, 6], [90, 14], [150, 10], [70, 22]])}
    <path d="M118 16L30 40L118 30z" fill="#fff6b0" opacity=".25"/>
    ${wHill('M100 80V56Q116 50 160 52V80z', '#2b3a6b')}<path d="M0 66H160V80H0z" fill="#1c4b8f"/>
    <path d="M112 56l3-38h6l3 38z" fill="#f5f7ff"/><path d="M113.3 44h9.4l.5 6h-10.4zM114.3 30h7.4l.4 5h-8.2z" fill="#ff5a74"/>
    <rect x="113" y="12" width="10" height="7" rx="1" fill="#ffd451"/><path d="M112 12l6-5 6 5z" fill="#ff5a74"/>
    <path d="M36 64L118 64L118 16z" fill="none" stroke="#22d3ee" stroke-width="1.6" stroke-dasharray="3 2"/>
    <path d="M52 64a16 16 0 0 0-1.6-7" fill="none" stroke="#ffd451" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M112 64v-5h6" fill="none" stroke="#fff" stroke-width="1.2"/>
    <path d="M26 62h18l-3 5h-12z" fill="#ffd451"/><path d="M34 62V52l7 8z" fill="#fff"/>`) },

  polar: { name: 'Galaxia Polar', art: wSvg('polar', '#0b0a26', '#2a1a5e', `
    ${wStars([[10, 8], [24, 30], [16, 62], [146, 12], [150, 50], [132, 70], [40, 74], [118, 6], [6, 44]])}
    <g fill="none" stroke="#5b6bd6" stroke-width=".8" opacity=".7"><circle cx="80" cy="40" r="12"/><circle cx="80" cy="40" r="24"/><circle cx="80" cy="40" r="36"/>
      <path d="M44 40h72M80 4v72M55 15l50 50M105 15l-50 50"/></g>
    <path d="${Array.from({ length: 73 }, (_, i) => { const t = i * Math.PI / 36, r = 34 * Math.abs(Math.cos(2 * t)); return `${i ? 'L' : 'M'}${(80 + r * Math.cos(t)).toFixed(1)} ${(40 - r * Math.sin(t)).toFixed(1)}`; }).join('')}z"
      fill="#ff7aa8" fill-opacity=".3" stroke="#ff9ec2" stroke-width="1.8" stroke-linejoin="round"/>
    ${wArrow(80, 40, 104, 26, '#22d3ee', 2.2)}<circle cx="80" cy="40" r="2.6" fill="#ffd451"/>`) },

  // ---------- Cálculo diferencial ----------
  intervalos: { name: 'Sendero de los Intervalos', art: wSvg('intervalos', '#ffd1e8', '#fff3f9', `
    ${wSun(136, 16, 7)}${wCloud(36, 14, .9)}
    ${wHill('M0 56Q40 48 80 54T160 52V80H0z', '#7bd88f')}
    <path d="M8 68H152" stroke="#8a4a6a" stroke-width="3" stroke-linecap="round"/>
    <path d="M44 68H116" stroke="#f472b6" stroke-width="6" stroke-linecap="round"/>
    <path d="M48 60h-4v16h4M112 60h4v16h-4" fill="none" stroke="#c0267a" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M80 68V40" stroke="#6b4423" stroke-width="3"/><circle cx="80" cy="40" r="2.4" fill="#6b4423"/>
    <path d="M44 56A36 30 0 0 1 116 56" fill="none" stroke="#c0267a" stroke-width="1.4" stroke-dasharray="3 3"/>
    <path d="M80 42Q92 50 101 58" fill="none" stroke="#c0267a" stroke-width="1.2"/>
    <ellipse cx="104" cy="60" rx="6" ry="4" fill="#d9a066"/><circle cx="110" cy="56" r="3.4" fill="#d9a066"/><circle cx="111" cy="55" r=".8" fill="#3b2a1a"/>`) },

  funciones: { name: 'Fábrica de Funciones', art: wSvg('funciones', '#ffc2dc', '#ffe9f3', `
    ${wCloud(26, 12, .9)}${wCloud(136, 16, .7)}
    ${wHill('M0 66H160V80H0z', '#a35a7f')}
    <rect x="54" y="22" width="52" height="44" rx="5" fill="#c0267a"/><rect x="50" y="19" width="52" height="44" rx="5" fill="#f472b6"/>
    <text x="76" y="48" text-anchor="middle" font-size="18" font-style="italic" font-weight="800" fill="#fff" font-family="Georgia,serif">f</text>
    <rect x="60" y="10" width="7" height="10" fill="#8a3a63"/><g fill="#fff" opacity=".7"><circle cx="64" cy="6" r="3"/><circle cx="70" cy="3" r="2"/></g>
    <path d="M24 30h20l-4 8h-12z" fill="#6f8fff"/><circle cx="34" cy="24" r="4" fill="#ffd451"/>
    ${wArrow(34, 40, 48, 46, '#6f8fff', 2.4)}${wArrow(104, 46, 122, 46, '#22b07a', 2.4)}
    <rect x="124" y="36" width="16" height="16" rx="3" fill="#22b07a"/><path d="M127 49q5-12 10-8" fill="none" stroke="#fff" stroke-width="1.6"/>`) },

  limites: { name: 'Puente del Límite', art: wSvg('limites', '#9fd9ff', '#e3f4ff', `
    ${wSun(26, 16, 6)}${wCloud(120, 12)}
    ${wHill('M0 80V56Q30 50 60 58V80z', '#7d6b5c')}${wHill('M160 80V54Q130 50 100 58V80z', '#7d6b5c')}<path d="M60 80V64H100V80z" fill="#3b8fd9"/>
    <path d="M8 62C36 60 60 50 80 34S118 18 152 16" fill="none" stroke="#f472b6" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="80 0"/>
    <circle cx="80" cy="34" r="4" fill="#e3f4ff" stroke="#f472b6" stroke-width="2.4"/><circle cx="80" cy="56" r="3.4" fill="#c0267a"/>
    <path d="M80 38V52" stroke="#c0267a" stroke-width="1.2" stroke-dasharray="2 2"/>
    ${wArrow(48, 46, 70, 38, '#ffd451', 2)}${wArrow(112, 24, 90, 31, '#ffd451', 2)}`) },

  derivada: { name: 'Cumbre de la Tangente', art: wSvg('derivada', '#b8d7ff', '#f0f6ff', `
    ${wSun(138, 14, 6)}${wCloud(34, 12, .8)}
    <path d="M0 80V70C30 66 44 26 76 22S120 54 160 60V80z" fill="#6b7bb8"/>
    <path d="M60 28C66 24 70 22 76 22S88 25 92 30L86 33 80 28 72 32 66 29z" fill="#fff"/>
    <path d="M0 70C30 66 44 26 76 22S120 54 160 60" fill="none" stroke="#f472b6" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M14 66L74 30" stroke="#ffd451" stroke-width="3" stroke-linecap="round"/>
    <circle cx="44" cy="48" r="3.4" fill="#fff" stroke="#c0267a" stroke-width="2"/>
    <path d="M30 57.6h12v-7.2" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 1.5"/>`) },

  aplicaciones: { name: 'Mirador del Máximo', art: wSvg('aplicaciones', '#ffb3c7', '#ffe9c7', `
    ${wSun(26, 18, 8, '#fff2a8')}
    ${wHill('M0 80V60C30 60 50 18 82 18S130 54 160 58V80z', '#c0267a')}${wHill('M0 80V70C40 66 60 50 90 56S140 72 160 70V80z', '#8a1a57')}
    <path d="M60 18H104" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 2"/>
    ${wFlag(82, 18, '#ffd451')}<circle cx="82" cy="18" r="2.6" fill="#fff"/>
    <rect x="124" y="30" width="18" height="12" rx="1.5" fill="#ffd451"/><path d="M124 30l6-6h18l-6 6zM142 30l6-6v12l-6 6z" fill="#d99a00"/>`) },

  // ---------- Geometría vectorial y analítica ----------
  sistemas: { name: 'Cruce de las Rectas', art: wSvg('sistemas', '#a9cdff', '#e8f2ff', `
    ${wCloud(130, 12)}
    <path d="M0 40H160V80H0z" fill="#d8e4f5"/><g stroke="#b3c6e6" stroke-width=".8">${[20, 40, 60, 80, 100, 120, 140].map(x => `<path d="M${x} 40V80"/>`).join('')}<path d="M0 50H160M0 60H160M0 70H160"/></g>
    <path d="M10 76L150 44" stroke="#2f5bff" stroke-width="4" stroke-linecap="round"/><path d="M14 46L146 74" stroke="#ff8a3d" stroke-width="4" stroke-linecap="round"/>
    <circle cx="80" cy="60" r="5" fill="#ffd451" stroke="#fff" stroke-width="2"/>
    <path d="M24 8h-6v26h6M58 8h6v26h-6" fill="none" stroke="#2f5bff" stroke-width="2.6" stroke-linejoin="round"/>
    <g fill="#1c3dc4" font-size="8" font-weight="800" font-family="system-ui,sans-serif" text-anchor="middle"><text x="32" y="19">2</text><text x="48" y="19">1</text><text x="32" y="30">1</text><text x="48" y="30">3</text></g>`) },

  determinantes: { name: 'Templo del Determinante', art: wSvg('determinantes', '#ffd9a8', '#fff5e6', `
    ${wSun(136, 16, 7)}
    ${wHill('M0 66H160V80H0z', '#c9a67a')}<rect x="30" y="60" width="100" height="6" fill="#e8d3b3"/>
    ${[36, 120].map(x => `<rect x="${x}" y="22" width="8" height="38" fill="#f5e9d6"/><rect x="${x - 2}" y="20" width="12" height="3" fill="#e8d3b3"/>`).join('')}
    <path d="M28 20L80 4 132 20z" fill="#e8d3b3"/>
    <path d="M54 56L84 56 104 30 74 30z" fill="#60a5fa" fill-opacity=".45" stroke="#60a5fa" stroke-width="1.2"/>
    ${wArrow(54, 56, 84, 56, '#2f5bff', 2.6)}${wArrow(54, 56, 74, 30, '#ff8a3d', 2.6)}<circle cx="54" cy="56" r="2.6" fill="#1c3dc4"/>`) },

  vectores: { name: 'Archipiélago Vectorial', art: wSvg('vectores', '#8ad4ff', '#c9efff', `
    ${wCloud(80, 10, .8)}${wSun(146, 12, 5)}
    <path d="M0 44H160V80H0z" fill="#3b9be0"/><path d="M0 44H160" stroke="#d6efff" stroke-width="1.2"/>
    ${[[24, 62, 14], [80, 52, 12], [134, 66, 13]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y + 2}" rx="${r}" ry="${r / 3}" fill="#2b7cc0"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r / 3.2}" fill="#f2d48c"/><circle cx="${x - 2}" cy="${y - 4}" r="${r / 3.4}" fill="#3fae72"/>`).join('')}
    <circle cx="80" cy="52" r="20" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 3"/>
    ${wArrow(28, 56, 74, 44, '#ffd451', 2.6)}${wArrow(84, 46, 128, 60, '#ff5a74', 2.6)}`) },

  productos: { name: 'Forja del Producto', art: wSvg('productos', '#3a2a5e', '#c75a3a', `
    ${wStars([[20, 10], [140, 8], [120, 22]], '#ffb36b')}
    ${wHill('M0 66H160V80H0z', '#2b1f3a')}
    <path d="M44 62L96 62 120 46 68 46z" fill="#ffb36b" fill-opacity=".35" stroke="#ffb36b" stroke-width="1"/>
    ${wArrow(44, 62, 96, 62, '#60a5fa', 3)}${wArrow(44, 62, 68, 46, '#ffd451', 3)}${wArrow(44, 62, 44, 14, '#ff5a74', 3)}
    <path d="M58 62a14 14 0 0 0-2.6-7.2" fill="none" stroke="#fff" stroke-width="1.4"/>
    <path d="M44 56h4v6" fill="none" stroke="#fff" stroke-width="1"/>
    <path d="M118 66v-8h20v8z" fill="#5b4a6b"/><path d="M114 58h28l-4-6h-20z" fill="#7a6a8a"/><g fill="#ffb36b"><circle cx="130" cy="46" r="1.6"/><circle cx="136" cy="42" r="1.2"/><circle cx="124" cy="44" r="1"/></g>`) },

  mecanica: { name: 'Puerto de las Fuerzas', art: wSvg('mecanica', '#ffcf9e', '#bfe6ff', `
    ${wSun(30, 16, 7)}${wCloud(120, 12, .8)}
    <path d="M0 50H160V80H0z" fill="#2f8ad4"/><path d="M0 50Q20 47 40 50T80 50T120 50T160 50" fill="none" stroke="#d6efff" stroke-width="1.2"/>
    <path d="M128 50V30h10v20z" fill="#7d6b5c"/><path d="M134 50V24h10v26z" fill="#6b5a4c"/>
    <path d="M42 58h34l-6 8H48z" fill="#ff5a74"/><path d="M58 58V38l12 18z" fill="#fff"/>
    ${wArrow(76, 58, 118, 40, '#ffd451', 2.2)}${wArrow(76, 58, 118, 72, '#ffd451', 2.2)}${wArrow(76, 58, 130, 56, '#fff', 3)}`) },

  conicas: { name: 'Órbita de las Cónicas', art: wSvg('conicas', '#0a1030', '#24306e', `
    ${wStars([[12, 10], [30, 68], [150, 12], [140, 70], [100, 6], [60, 74], [8, 40]])}
    <ellipse cx="80" cy="40" rx="56" ry="24" fill="none" stroke="#60a5fa" stroke-width="1.6"/>
    <path d="M150 4Q34 40 150 76" fill="none" stroke="#ffd451" stroke-width="1.4" stroke-dasharray="3 3"/>
    ${wSun(58, 40, 9, '#ffb84d', .3)}<circle cx="136" cy="40" r="5" fill="#6f8fff"/><circle cx="134.6" cy="38.6" r="1.6" fill="#b8c8ff"/>
    <circle cx="102" cy="40" r="1.6" fill="#fff"/>`) },

  // ---------- Física mecánica ----------
  cinematica: { name: 'Pista de la Cinemática', art: wSvg('cinematica', '#ffe08a', '#fff7d6', `
    ${wSun(140, 14, 6)}${wCloud(40, 12, .8)}
    ${wHill('M0 58Q40 52 80 56T160 54V80H0z', '#7bd88f')}<path d="M0 64H160V76H0z" fill="#4a4a5a"/>
    <path d="M6 70H154" stroke="#fff" stroke-width="1.6" stroke-dasharray="8 6"/>
    <rect x="22" y="52" width="30" height="10" rx="3" fill="#ff5a74"/><path d="M28 52l4-6h12l4 6z" fill="#ff8a9c"/>
    <circle cx="29" cy="63" r="3.6" fill="#222"/><circle cx="45" cy="63" r="3.6" fill="#222"/>
    ${wArrow(54, 56, 80, 56, '#2f5bff', 2.6)}
    <path d="M90 60Q114 6 140 60" fill="none" stroke="#ff8a3d" stroke-width="1.6" stroke-dasharray="2 3"/>
    <circle cx="115" cy="33" r="3.4" fill="#ffd451" stroke="#d99a00" stroke-width="1"/>`) },

  dinamica: { name: 'Rampa de Newton', art: wSvg('dinamica', '#ffd56b', '#fff2c2', `
    ${wCloud(126, 14)}
    ${wHill('M0 70H160V80H0z', '#9a6a3a')}
    <path d="M14 70H136V24z" fill="#d99a00"/><path d="M14 70H136" stroke="#8a5a1a" stroke-width="2"/>
    <g transform="rotate(-20.65 80 47)"><rect x="70" y="35" width="20" height="13" rx="1.5" fill="#2f5bff"/></g>
    ${wArrow(81, 46, 81, 72, '#ff5a74', 2.4)}${wArrow(79, 40, 72, 21, '#22b07a', 2.4)}${wArrow(76, 44, 54, 52, '#fff', 2.4)}
    <path d="M38 70a24 24 0 0 0-1-6" fill="none" stroke="#fff" stroke-width="1.4"/>`) },

  // ---------- Cálculo integral ----------
  integral: { name: 'Campos del Área', art: wSvg('integral', '#a8f0d0', '#effff7', `
    ${wSun(26, 16, 6)}${wCloud(120, 10, .8)}
    ${wHill('M0 70H160V80H0z', '#7a5a3a')}
    ${[0, 1, 2, 3, 4, 5].map(i => { const x = 30 + i * 18, y = 70 - (6 + 0.004 * (i * 18 + 9) ** 2); return `<rect x="${x}" y="${y.toFixed(1)}" width="18" height="${(70 - y).toFixed(1)}" fill="${i % 2 ? '#2fb37f' : '#34d399'}" stroke="#effff7" stroke-width=".8"/>`; }).join('')}
    <path d="${Array.from({ length: 31 }, (_, i) => { const x = 24 + i * 4, u = x - 30; return `${i ? 'L' : 'M'}${x} ${(70 - 6 - 0.004 * u * u * (u > 0 ? 1 : 0)).toFixed(1)}`; }).join('')}" fill="none" stroke="#ff8a3d" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M30 76V30M138 76V8" stroke="#3b2a1a" stroke-width="1" stroke-dasharray="2 2"/>`) },

  // ---------- Álgebra lineal ----------
  lineal: { name: 'Plano Transformado', art: wSvg('lineal', '#ffc89a', '#fff0e2', `
    ${wSun(140, 14, 6)}
    <g stroke="#fb923c" stroke-width=".9" opacity=".6">${[-3, -2, -1, 0, 1, 2, 3].map(k => `<path d="M${38 + k * 16} 78L${78 + k * 16} 2"/>`).join('')}${[0, 1, 2, 3, 4].map(k => `<path d="M0 ${74 - k * 16}H160"/>`).join('')}</g>
    <path d="M64.5 58H96.5L113.3 26H81.3z" fill="#fb923c" fill-opacity=".35"/>
    ${wArrow(64.5, 58, 96.5, 58, '#2f5bff', 3)}${wArrow(64.5, 58, 81.3, 26, '#ffd451', 3)}<circle cx="64.5" cy="58" r="3" fill="#8a3a0a"/>`) },
};

// Trazo del sendero que une niveles o mundos: xs son los desplazamientos horizontales de cada botón
// (centro = 0), step la altura de cada fila y cy el centro vertical del botón dentro de su fila.
function worldTrail(xs, step, cy = 34) {
  if (xs.length < 2) return '';
  const y = i => cy + i * step, h = step / 2;
  return `M${xs[0]} ${y(0)}` + xs.slice(1).map((x, i) => ` C${xs[i]} ${y(i) + h} ${x} ${y(i + 1) - h} ${x} ${y(i + 1)}`).join('');
}
