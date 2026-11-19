// Fórmulas en el lienzo (spec 2026-11-18-formulas-tex): los juegos y las guías dibujan la matemática como en los
// enunciados (KaTeX), no como texto corrido. Un texto de juego puede traer TeX entre signos de pesos,
//   'El lado mide $\\sqrt{12} = 2\\sqrt{3}$'      'Suma: $\\frac{3}{5} + \\frac{4}{5}$'
// y los textos viejos escritos con símbolos (x², 3/4, √12, 2^(x − 1), a₁) se convierten solos con plainToTex.
// Se dibuja en el propio lienzo (no encima): respeta el orden de las capas, se encoge para caber y usa las fuentes
// de KaTeX si ya cargaron (si no, la letra del juego y una cursiva del sistema).
//   formulaWanted(str) → ¿conviene dibujarlo como fórmula?      plainToTex(str) → TeX      texify(str) → texto con $…$ (para tex())
//   drawFormulaCtx(ctx, str, x, y, { size, maxW, align, weight }) → ancho dibujado (y = centro vertical)
//   drawFormula(p, str, x, y, maxW, size) → lo mismo desde p5, con la alineación horizontal que tenga p
// Subconjunto de TeX: { }, ^ _, \frac \tfrac \dfrac, \sqrt[n]{ }, \text \operatorname \mathrm, \left \right, \mathbb,
// espacios (\, \; \quad), letras griegas y los símbolos de TEX_SYM.

const TEX_SYM = {
  cdot: ['·', 'op'], times: ['×', 'op'], div: ['÷', 'op'], pm: ['±', 'op'], mp: ['∓', 'op'], circ: ['∘', 'op'], cup: ['∪', 'op'], cap: ['∩', 'op'], setminus: ['∖', 'op'], triangle: ['△', 'op'],
  le: ['≤', 'rel'], leq: ['≤', 'rel'], ge: ['≥', 'rel'], geq: ['≥', 'rel'], ne: ['≠', 'rel'], neq: ['≠', 'rel'], approx: ['≈', 'rel'], to: ['→', 'rel'], rightarrow: ['→', 'rel'], Rightarrow: ['⇒', 'rel'], Leftrightarrow: ['⇔', 'rel'],
  leftarrow: ['←', 'rel'], iff: ['⟺', 'rel'], in: ['∈', 'rel'], notin: ['∉', 'rel'], subseteq: ['⊆', 'rel'], subset: ['⊂', 'rel'], equiv: ['≡', 'rel'], perp: ['⟂', 'rel'], parallel: ['∥', 'rel'],
  pi: ['π', 'var'], theta: ['θ', 'var'], alpha: ['α', 'var'], beta: ['β', 'var'], gamma: ['γ', 'var'], delta: ['δ', 'var'], lambda: ['λ', 'var'], mu: ['μ', 'var'], phi: ['φ', 'var'], varphi: ['φ', 'var'], rho: ['ρ', 'var'], omega: ['ω', 'var'], epsilon: ['ε', 'var'], sigma: ['σ', 'var'],
  Delta: ['Δ', 'ord'], Sigma: ['Σ', 'ord'], sum: ['Σ', 'ord'], prod: ['Π', 'ord'], infty: ['∞', 'ord'], emptyset: ['∅', 'ord'], varnothing: ['∅', 'ord'], angle: ['∠', 'ord'], degree: ['°', 'ord'], ldots: ['…', 'ord'], dots: ['…', 'ord'], cdots: ['⋯', 'ord'],
  neg: ['¬', 'ord'], lnot: ['¬', 'ord'], vee: ['∨', 'op'], lor: ['∨', 'op'], land: ['∧', 'op'], leftrightarrow: ['↔', 'rel'], star: ['⋆', 'op'], oplus: ['⊕', 'op'], odot: ['⊙', 'op'], otimes: ['⊗', 'op'], diamond: ['⋄', 'op'], ast: ['∗', 'op'], bullet: ['•', 'op'],
  square: ['□', 'ord'], Box: ['□', 'ord'], wedge: ['∧', 'ord'], forall: ['∀', 'ord'], exists: ['∃', 'ord'], partial: ['∂', 'ord'], nabla: ['∇', 'ord'], vert: ['|', 'ord'], Vert: ['‖', 'ord'], lVert: ['‖', 'open'], rVert: ['‖', 'close'], langle: ['⟨', 'open'], rangle: ['⟩', 'close'],
  sin: ['sin', 'fn'], sen: ['sen', 'fn'], cos: ['cos', 'fn'], tan: ['tan', 'fn'], cot: ['cot', 'fn'], sec: ['sec', 'fn'], csc: ['csc', 'fn'], log: ['log', 'fn'], ln: ['ln', 'fn'], det: ['det', 'fn'], lim: ['lím', 'fn'], max: ['máx', 'fn'], min: ['mín', 'fn'],
};
const TEX_SPACE = { ',': 0.17, ':': 0.22, ';': 0.28, '!': 0, ' ': 0.3, quad: 1, qquad: 2 };
const TEX_BB = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', C: 'ℂ', I: '𝕀' };

// ---------- De TeX a un árbol ----------
function parseTex(src) {
  src = String(src);
  let i = 0;
  const sym = (s, cls) => ({ t: 'sym', s, cls });
  const raw = () => {   // contenido de { … } sin interpretar (para \text)
    while (src[i] === ' ') i++;
    if (src[i] !== '{') return src[i++] ?? '';
    let d = 0, a = ++i;
    for (; i < src.length; i++) { if (src[i] === '{') d++; else if (src[i] === '}') { if (!d) break; d--; } }
    return src.slice(a, i++);
  };
  function row(end) {
    const c = [];
    while (i < src.length && src[i] !== end) { const a = item(); if (a) c.push(a); }
    return { t: 'row', c };
  }
  function arg() {
    while (src[i] === ' ') i++;
    if (src[i] === '{') { i++; const r = row('}'); i++; return r; }
    if (/[0-9]/.test(src[i] ?? '')) return { t: 'sym', s: src[i++], cls: 'ord' };   // sin llaves, un solo dígito: \tfrac12
    return atom() || { t: 'row', c: [] };
  }
  function item() {
    let a = src[i] === '^' || src[i] === '_' ? { t: 'row', c: [] } : atom();
    if (!a) return null;
    while (src[i] === '^' || src[i] === '_') {
      const k = src[i++] === '^' ? 'sup' : 'sub', s = arg();
      if (a.t !== 'script') a = { t: 'script', base: a };
      a[k] = s;
    }
    return a;
  }
  function atom() {
    const ch = src[i];
    if (ch === undefined) return null;
    if (ch === ' ' || ch === '\n') { i++; return { t: 'sp' }; }
    if (ch === '{') { i++; const r = row('}'); i++; return r; }
    if (ch === '}') { i++; return null; }
    if (ch === '\\') {
      i++;
      let name = (src.slice(i).match(/^[A-Za-z]+/) || [''])[0];
      if (name) { i += name.length; while (src[i] === ' ') i++; } else name = src[i++] ?? '';
      if (name === 'frac' || name === 'tfrac' || name === 'dfrac') { const n = arg(), d = arg(); return { t: 'frac', n, d }; }
      if (name === 'overline' || name === 'bar') return { t: 'over', b: arg() };
      if (name === 'sqrt') { let idx = null; if (src[i] === '[') { i++; idx = row(']'); i++; } return { t: 'sqrt', b: arg(), idx }; }
      if (name === 'text' || name === 'mathrm' || name === 'textbf' || name === 'mathbf') return sym(raw(), 'text');
      if (name === 'operatorname') return sym(raw(), 'fn');
      if (name === 'mathbb') { const k = raw(); return sym(TEX_BB[k] || k, 'ord'); }
      if (name === 'left' || name === 'right' || name === 'big' || name === 'Big') { if (src[i] === '.') { i++; return null; } return atom(); }
      if (name in TEX_SPACE) return { t: 'space', em: TEX_SPACE[name] };
      if (TEX_SYM[name]) return sym(...TEX_SYM[name]);
      if ('{}%$#&_'.includes(name)) return sym(name, name === '{' ? 'open' : name === '}' ? 'close' : 'ord');
      if (name === '|') return sym('‖', 'ord');
      return sym(name, 'text');
    }
    if (/[0-9]/.test(ch)) { const m = src.slice(i).match(/^\d+(?:[.,]\d+)*/)[0]; i += m.length; return sym(m, 'ord'); }
    i += ch.length;
    if (/[A-Za-zπθαβγδλμφρωεσ]/.test(ch)) return sym(ch, 'var');
    if ('+−-±×·÷∘∪∩∖△*'.includes(ch)) return sym(ch === '-' ? '−' : ch === '*' ? '·' : ch, 'op');
    if ('=<>≤≥≠≈→←⇒∈∉⊆⊂≡'.includes(ch)) return sym(ch, 'rel');
    if (',;:'.includes(ch)) return sym(ch, 'punct');
    if ('([{'.includes(ch)) return sym(ch, 'open');
    if (')]}'.includes(ch)) return sym(ch, 'close');
    // Pares sustitutos (𝕀, emojis): el carácter completo.
    const cp = src.codePointAt(i - 1);
    if (cp > 0xffff) { i++; return sym(String.fromCodePoint(cp), 'ord'); }
    return sym(ch, 'ord');
  }
  return row(undefined);
}

// ---------- Del texto con símbolos a TeX ----------
const SUP_MAP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+', 'ⁿ': 'n', 'ᵀ': 'T', 'ˣ': 'x', 'ᵏ': 'k', 'ᵉ': 'e', 'ᶜ': 'c' };
const SUB_MAP = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n', 'ₖ': 'k', '₊': '+', '₋': '-', 'ₓ': 'x' };
const SUP_RE = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿᵀˣᵏᵉᶜ]+/g, SUB_RE = /[₀₁₂₃₄₅₆₇₈₉ₙₖ₊₋ₓ]+/g;
const VULGAR = { '½': [1, 2], '¼': [1, 4], '¾': [3, 4], '⅓': [1, 3], '⅔': [2, 3], '⅕': [1, 5], '⅛': [1, 8] };
const TEX_FN = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc', 'log', 'ln', 'cis', 'det', 'gr', 'proy', 'lím', 'máx', 'mín'];
const TEX_WORD = ['tu', 'mi', 'ni', 'ha', 'he', 've', 'yo', 'ti', 'de', 'la', 'el', 'en', 'es', 'da', 'no', 'si', 'un', 'al', 'se', 'su', 'lo', 'ya', 'va', 'son', 'por', 'con', 'las', 'los', 'del', 'que', 'una'];

// ¿Tiene algo que un texto corrido dibuja mal (potencias, raíces, fracciones, subíndices)?
function formulaWanted(str) {
  if (typeof str !== 'string' || str.length < 2) return false;
  if (str.includes('$')) return /\$[^$]+\$/.test(str);
  // Sin «lookbehind»: Safari anterior a iOS 16.4 no lo entiende y el archivo entero dejaría de cargar.
  return /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿᵀˣᵏ₀₁₂₃₄₅₆₇₈₉ₙₖ½¼¾⅓⅔]|√|[\w)π]\^[\w(−\-½¼¾⅓⅔]|(?:^|[^\w.,/])\d+\/\d+(?![\w/])|[a-zπ]\/\d/.test(str);
}
// Lee desde `(` en la posición a hasta su pareja: devuelve [contenido, posición después de `)`], o null.
function balanced(s, a) {
  let d = 0;
  for (let j = a; j < s.length; j++) { if (s[j] === '(') d++; else if (s[j] === ')' && !--d) return [s.slice(a + 1, j), j + 1]; }
  return null;
}
function plainToTex(str) {
  let s = String(str).replace(/\\/g, '').replace(/[{}%$#&]/g, m => '\\' + m);
  // Raíces: índice (³√), radicando entre paréntesis o una cifra o letra.
  let out = '';
  for (let i = 0; i < s.length;) {
    const ch = s[i];
    if (ch === '√') {
      const im = out.match(/[²³⁴⁵⁶⁷⁸⁹ⁿ]$/), idx = im ? `[${SUP_MAP[im[0]]}]` : '';
      if (im) out = out.slice(0, -1);
      const b = s[i + 1] === '(' ? balanced(s, i + 1) : null;
      if (b) { out += `\\sqrt${idx}{${plainToTex.inner(b[0])}}`; i = b[1]; continue; }
      const m = s.slice(i + 1).match(/^(\d+(?:\.\d+)?|[A-Za-zπ])/);
      if (m) { out += `\\sqrt${idx}{${m[0]}}`; i += 1 + m[0].length; continue; }
      out += '\\surd '; i++; continue;
    }
    if (ch === '^') {
      const b = s[i + 1] === '(' ? (balanced(s, i + 1) || [s.slice(i + 2), s.length]) : null;
      if (b) { out += `^{${plainToTex.inner(b[0])}}`; i = b[1]; continue; }
      const m = s.slice(i + 1).match(/^([−-]?(?:\d+(?:\.\d+)?|[A-Za-zπ])|[½¼¾⅓⅔⅕⅛])/);
      if (m) { out += `^{${m[0]}}`; i += 1 + m[0].length; continue; }
      out += '\\wedge '; i++; continue;
    }
    out += ch; i++;
  }
  s = out.replace(SUP_RE, m => `^{${[...m].map(c => SUP_MAP[c]).join('')}}`).replace(SUB_RE, m => `_{${[...m].map(c => SUB_MAP[c]).join('')}}`);
  s = s.replace(/[½¼¾⅓⅔⅕⅛]/g, m => `\\tfrac{${VULGAR[m][0]}}{${VULGAR[m][1]}}`);
  // Fracciones sencillas: 3/4, π/6, 1/x² (no fechas ni «km/h»).
  s = s.replace(/(\^\{[^{}]*\})(?=\^)/g, '$1{}');   // dos potencias seguidas: KaTeX no acepta x^{2}^{3}
  s = s.replace(/(^|[^\w.,/}])(\d+(?:\.\d+)?|π)\/(\d+(?:\.\d+)?|[a-zπ](?:\^\{[^{}]*\})?)(?![\w/(])/g, '$1\\frac{$2}{$3}')
    .replace(/(^|[^A-Za-z\d.])(\d+|[a-z])π\/(\d+)(?![\w/])/g, '$1\\frac{$2π}{$3}')
    .replace(/(^|[^\w.,/}])(\d+(?:\^\{[^{}]*\})?|\d*\\sqrt\{[^{}]*\}|[a-z]\^\{[^{}]*\})\/(\d*\\sqrt\{[^{}]*\}|\d+(?:\^\{[^{}]*\})?)(?![\w/(^])/g, '$1\\frac{$2}{$3}')
    .replace(/(\d*\\sqrt\{[^{}]*\})\/(\d+)(?![\w/])/g, '\\frac{$1}{$2}')
    .replace(/(^|[^A-Za-z\d])([a-z]\^\{[^{}]*\})\/(\d+)(?![\w/])/g, '$1\\frac{$2}{$3}')
    .replace(/(^|[^A-Za-z\d])([a-zπ])\/(\d+)(?![\w/])/g, '$1\\frac{$2}{$3}');
  // «y», «o», «a» sueltas entre dos datos («x = 2 o x = 3», «k de 1 a 4») son palabras, no variables.
  s = s.replace(/([\w)°áéíóú}] +)([yoa])(?= +[\w(−√¿\\])/g, '$1\\text{$2}');
  // Unidades tras un número («8 m», «3 cm²») y números romanos de cuadrante: texto, no variables.
  s = s.replace(/([\d}]) (km\/h|m\/s|cm|mm|km|kg|mg|mL|m|s|g|h|N|J|L)(?=$|[\s,.;:)·]|\^\{[23]\}(?:$|[\s,.;:)]))/g, '$1 \\text{$2}');
  // Palabras: las funciones van derechas; las palabras de verdad, como texto.
  s = s.replace(/(\\[A-Za-z]+)|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}/g, (w, cmd) => {
    if (cmd) return w;
    if (TEX_FN.includes(w)) return `\\operatorname{${w}}`;
    if (/^(II|III|IV|VI)$/.test(w)) return `\\text{${w}}`;
    return w.length >= 4 || TEX_WORD.includes(w.toLowerCase()) || (w.length === 3 && /[áéíóúñ]/i.test(w)) ? `\\text{${w}}` : w.length === 3 && /^[A-Za-záéíóúñ][a-záéíóúñ]+$/.test(w) && /[aeiouAEIOU]/.test(w) && !/^[xyzkn]/.test(w) ? `\\text{${w}}` : w;
  });
  return s.replace(/¿|¡/g, m => `\\text{${m}}`).replace(/\?/g, '\\text{?}').replace(/!/g, '\\text{!}').replace(/°/g, '^{\\circ}').replace(/\\surd /g, '\\text{√}')
    // KaTeX no cuenta los espacios dentro de $…$: junto a una palabra se escriben como «\ ».
    .replace(/(\\text\{[^{}]*\}) +/g, '$1\\ ').replace(/([^\\ ]) +(?=\\text\{)/g, '$1\\ ');
}
plainToTex.inner = s => plainToTex(s.replace(/\\([{}%$#&])/g, '$1'));
// Un renglón que es una ecuación o una cuenta, aunque no tenga potencias ni fracciones: «(x − 2)(x − 3) = 0».
const equationLike = str => typeof str === 'string' && !str.includes('$') && /[=<>≤≥+·×÷]|\d\s*[−-]\s*\d|[a-z]\s*[−-]\s*\d/.test(str) && /\d|[a-z]\b/.test(str);
// El paso de una solución como TeX entre $…$ (para dibujar o para tex()); si no es matemática, queda igual.
function mathStep(str) {
  if (typeof str !== 'string' || str.includes('$') || !(formulaWanted(str) || equationLike(str))) return str;
  return `$${plainToTex(str)}$`;
}
// Un paso largo se parte en dos renglones por el corte natural más cercano al centro («: », «. », «  y  », « = »).
function stepLines(str) {
  if (typeof str !== 'string' || str.length <= 24) return [str];
  let best = -1, len = 0;
  for (const m of str.matchAll(/: |\. | {2}y {2}|, | = | sobre /g)) if (best < 0 || Math.abs(m.index + m[0].length / 2 - str.length / 2) < Math.abs(best + len / 2 - str.length / 2)) { best = m.index; len = m[0].length; }
  if (best < 0) return [str];
  const sep = str.slice(best, best + len), keep = sep === ' = ' ? '' : sep.trim() === 'y' || sep === ' sobre ' ? '' : sep.trimEnd();
  return [str.slice(0, best) + keep, (sep === ' = ' ? '= ' : sep.trim() === 'y' ? 'y ' : sep === ' sobre ' ? 'sobre ' : '') + str.slice(best + len)];
}
// Texto listo para tex(): si conviene, lo envuelve en $…$ ya convertido.
function texify(str) {
  if (typeof str !== 'string' || str.includes('$') || !formulaWanted(str)) return str;
  const t = plainToTex(str);
  let d = 0;
  for (const c of t.replace(/\\[{}]/g, '')) { if (c === '{') d++; else if (c === '}' && --d < 0) return str; }
  return d ? str : `$${t}$`;
}

// ---------- Cajas: tamaño y dibujo ----------
let texFontsOk = false, texFontsAsked = false;
const TEX_CACHE = new Map();
function texFonts() {
  if (texFontsAsked || typeof document === 'undefined' || !document.fonts?.load) return;
  texFontsAsked = true;
  Promise.all(['16px KaTeX_Main', '700 16px KaTeX_Main', 'italic 16px KaTeX_Math', 'italic 700 16px KaTeX_Math'].map(f => document.fonts.load(f)))
    .then(r => { texFontsOk = r.every(x => x && x.length); TEX_CACHE.clear(); if (!texFontsOk) setTimeout(() => { texFontsAsked = false; }, 5000); })   // aún sin la hoja de KaTeX: se vuelve a pedir
    .catch(() => { setTimeout(() => { texFontsAsked = false; }, 5000); });
}
const texFont = (cls, size, weight) => {
  const w = weight >= 600 ? '700 ' : '';
  if (cls === 'var') return `italic ${w}${size}px ${texFontsOk ? 'KaTeX_Math' : "Georgia, 'Times New Roman', serif"}`;
  if (cls === 'plain' || cls === 'text') return `${w}${size}px ${typeof gameFont === 'function' ? gameFont() : 'system-ui'}, system-ui, sans-serif`;
  return `${w}${size}px ${texFontsOk ? 'KaTeX_Main' : (typeof gameFont === 'function' ? gameFont() : 'system-ui') + ', system-ui'}, sans-serif`;
};
const PAD = { op: 0.2, rel: 0.26 };

function layoutTex(node, size, ctx, weight = 400) {
  const mk = (w, a, d, draw) => ({ w, a, d, draw });
  if (node.t === 'space') return mk(node.em * size, 0, 0, () => {});
  if (node.t === 'sym') {
    const font = texFont(node.cls, size, weight);
    ctx.font = font;
    const w = ctx.measureText(node.s).width, tall = /[()[\]{}|‖∫ΣΠ]/.test(node.s);
    return mk(w, size * (tall ? 0.76 : 0.7), size * (tall ? 0.26 : 0.2), (c, x, y) => { c.font = font; c.fillText(node.s, x, y); });
  }
  if (node.t === 'row') {
    const kids = [];
    node.c.forEach((n, k) => {
      const prev = node.c[k - 1], next = node.c[k + 1];
      if (n.t === 'sp') {   // el espacio escrito cuenta entre letras, números y palabras; junto a + = , ya hay aire
        const airy = x => !x || x.t === 'sp' || x.t === 'space' || (x.t === 'sym' && ['op', 'rel', 'punct'].includes(x.cls));
        kids.push({ w: !airy(prev) && !airy(next) ? size * 0.28 : 0, a: 0, d: 0, draw() {} });
        return;
      }
      const b = layoutTex(n, size, ctx, weight);
      let l = 0, r = 0;
      if (n.t === 'sym') {
        // Un + o − al principio, o tras otro operador o un paréntesis que abre, es un signo: va pegado.
        const real = node.c.slice(0, k).reverse().find(x => x.t !== 'sp' && x.t !== 'space');
        const unary = n.cls === 'op' && (!real || (real.t === 'sym' && ['op', 'rel', 'open', 'punct'].includes(real.cls)));
        if ((n.cls === 'op' && !unary) || n.cls === 'rel') l = r = PAD[n.cls] * size;
        if (n.cls === 'punct') r = 0.18 * size;
        if (n.cls === 'fn' && next && !(next.t === 'sym' && next.cls === 'open') && next.t !== 'sp') r = 0.14 * size;
      }
      kids.push({ w: b.w + l + r, a: b.a, d: b.d, draw: (c, x, y) => b.draw(c, x + l, y) });
    });
    const w = kids.reduce((t, b) => t + b.w, 0), a = Math.max(size * 0.7 * (kids.length ? 0 : 1), ...kids.map(b => b.a)), d = Math.max(0, ...kids.map(b => b.d));
    return mk(w, a, d, (c, x, y) => { for (const b of kids) { b.draw(c, x, y); x += b.w; } });
  }
  if (node.t === 'frac') {
    const s2 = Math.max(7, size * 0.8), n = layoutTex(node.n, s2, ctx, weight), dn = layoutTex(node.d, s2, ctx, weight);
    const w = Math.max(n.w, dn.w) + size * 0.28, axis = size * 0.27, gap = size * 0.13, lw = Math.max(1, size * 0.065), m = size * 0.06;
    return mk(w + 2 * m, axis + gap + n.a + n.d, dn.a + dn.d + gap - axis, (c, x, y) => {
      c.fillRect(x + m, y - axis - lw / 2, w, lw);
      n.draw(c, x + m + (w - n.w) / 2, y - axis - gap - n.d);
      dn.draw(c, x + m + (w - dn.w) / 2, y - axis + gap + dn.a);
    });
  }
  if (node.t === 'script') {
    const b = layoutTex(node.base, size, ctx, weight), s2 = Math.max(6, size * 0.7);
    const up = node.sup ? layoutTex(node.sup, s2, ctx, weight) : null, dn = node.sub ? layoutTex(node.sub, s2, ctx, weight) : null;
    const rise = Math.max(size * 0.36, b.a - size * 0.4), drop = Math.max(size * 0.18, b.d + size * 0.04), sw = Math.max(up?.w ?? 0, dn?.w ?? 0) + size * 0.04;
    return mk(b.w + sw, Math.max(b.a, up ? rise + up.a : 0), Math.max(b.d, dn ? drop + dn.d : 0), (c, x, y) => {
      b.draw(c, x, y);
      up?.draw(c, x + b.w + size * 0.02, y - rise);
      dn?.draw(c, x + b.w + size * 0.02, y + drop);
    });
  }
  if (node.t === 'over') {   // \overline{…}: raya encima
    const b = layoutTex(node.b, size, ctx, weight), lw = Math.max(1, size * 0.06), a = b.a + size * 0.14;
    return mk(b.w, a + lw, b.d, (c, x, y) => { c.lineWidth = lw; c.strokeStyle = c.fillStyle; c.beginPath(); c.moveTo(x + size * 0.04, y - a); c.lineTo(x + b.w - size * 0.04, y - a); c.stroke(); b.draw(c, x, y); });
  }
  if (node.t === 'sqrt') {
    const b = layoutTex(node.b, size, ctx, weight), pad = size * 0.16, rw = size * 0.52, lw = Math.max(1.1, size * 0.07);
    const ix = node.idx && node.idx.c.length ? layoutTex(node.idx, Math.max(6, size * 0.55), ctx, weight) : null, off = ix ? Math.max(0, ix.w - rw * 0.45) : 0;
    const a = Math.max(b.a, size * 0.62) + pad;
    return mk(off + rw + b.w + size * 0.14, a + lw, b.d, (c, x, y) => {
      const x0 = x + off, top = y - a;
      c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = c.fillStyle;
      c.beginPath(); c.moveTo(x0 + rw * 0.06, y - a * 0.42); c.lineTo(x0 + rw * 0.26, y - a * 0.5); c.lineTo(x0 + rw * 0.56, y + b.d * 0.6);
      c.lineTo(x0 + rw * 0.94, top); c.lineTo(x0 + rw + b.w + size * 0.08, top); c.stroke();
      b.draw(c, x0 + rw, y);
      ix?.draw(c, x, y - a * 0.56);
    });
  }
  return mk(0, 0, 0, () => {});
}

// Texto con trozos $…$ → un solo árbol: lo de afuera va con la letra del juego.
function parseRich(str) {
  const parts = String(str).split(/(\$[^$]+\$)/g), c = [];
  for (const part of parts) {
    if (!part) continue;
    if (part.length > 2 && part[0] === '$' && part[part.length - 1] === '$') c.push(parseTex(part.slice(1, -1)));
    else c.push({ t: 'sym', s: part, cls: 'plain' });
  }
  return { t: 'row', c };
}
function formulaBox(ctx, str, size, weight) {
  texFonts();
  // La clave lleva las letras en uso: al cargar Jost o las de KaTeX, las cajas se rehacen.
  const key = `${str}|${size}|${weight}|${typeof gameFont === 'function' ? gameFont() : ''}|${texFontsOk}`;
  let b = TEX_CACHE.get(key);
  if (!b) {
    const tree = str.includes('$') ? parseRich(str) : parseTex(plainToTex(str));
    b = layoutTex(tree, size, ctx, weight);
    if (TEX_CACHE.size > 600) TEX_CACHE.delete(TEX_CACHE.keys().next().value);
    TEX_CACHE.set(key, b);
  }
  return b;
}
function drawFormulaCtx(ctx, str, x, y, o = {}) {
  let size = o.size ?? 16;
  const weight = o.weight ?? 400, maxW = o.maxW ?? Infinity;
  ctx.save();
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  let b = formulaBox(ctx, str, size, weight);
  // Se encoge a lo ancho (y a lo alto, si se da maxH) hasta caber.
  const k = Math.min(1, maxW / Math.max(1, b.w), (o.maxH ?? Infinity) / Math.max(1, b.a + b.d));
  if (k < 1) { size = Math.max(6, Math.floor(size * k * 10) / 10); b = formulaBox(ctx, str, size, weight); }
  let x0 = o.align === 'left' ? x : o.align === 'right' ? x - b.w : x - b.w / 2;
  // Cerca de un borde se corre hacia adentro (como hace safeText con el texto corrido), no se encoge.
  if (o.clamp && b.w <= o.clamp[1] - o.clamp[0]) x0 = Math.min(Math.max(x0, o.clamp[0]), o.clamp[1] - b.w);
  b.draw(ctx, x0, y + (b.a - b.d) / 2);
  ctx.restore();
  return b.w;
}
// Desde p5: usa el color de relleno, el grosor y la alineación horizontal que tenga el dibujo en ese momento.
function drawFormula(p, str, x, y, maxW, size, maxH) {
  const ctx = p.drawingContext, r = p._renderer || {};
  const weight = /bold|[6-9]00/.test(String(ctx.font)) || r._textStyle === 'bold' ? 700 : 400, align = r._textAlign || 'center';
  // Nunca se sale del lienzo (si el lienzo no está trasladado ni girado).
  const m = ctx.getTransform?.(), flat = !m || (Math.abs(m.b) < 1e-6 && Math.abs(m.c) < 1e-6 && Math.abs(m.e) < 0.5 && Math.abs(m.f) < 0.5);
  return drawFormulaCtx(ctx, str, x, y, { size, weight, align, maxH, maxW: Math.min(maxW ?? Infinity, p.width - 8), clamp: flat ? [4, p.width - 4] : null });
}
