// Sin escribir (spec 2026-11-17-sin-escribir): ningún ejercicio pide teclear un número. Cada ejercicio `num(...)` de los
// cursos se cambia aquí, al cargar, por un juego: «Arma la cuenta» (el estudiante plantea la operación con fichas y el
// juego la calcula) o «Escala la solución» (elige el paso válido en cada nivel del razonamiento). El enunciado, la
// explicación y la pista del ejercicio original se conservan.
// La tabla va por `lección#posición` (las evaluaciones: `exam-<mundo>#posición`). Si alguien mueve un ejercicio y la
// ficha deja de dar su respuesta, el cambio no se aplica (queda el ejercicio de escribir) y `tests/sin-escribir.test.js` avisa.
//   C('7 * 200000 / 100000', ['1000'])  → Arma la cuenta: una cuenta correcta y las fichas que sobran.
//   E([paso válido, falso, falso], …)   → Escala la solución: un nivel por paso; el válido va primero.

const SIN_ESCRIBIR = (() => {
  const C = (sol, traps = []) => ({ game: 'arma-la-cuenta', sol: sol.split(' '), traps });
  const E = (...levels) => ({ game: 'escala-solucion', levels });
  return {
    // ---------- Álgebra ----------
    'alg-0a#4': C('7 - 2', ['3', '1']),
    'alg-0b#3': C('2 ^ 4', ['1', '6', '8']),
    'exam-conjuntos#3': C('2 ^ 5', ['10', '4']),
    'alg-12b#4': E(['Junta 4 · 25 = 100', 'Junta 4 · 19 = 100', 'Junta 4 · 25 = 29'], ['19 · 100 = 1900', '19 · 100 = 190', '19 + 100 = 119']),
    'alg-12c#3': C('5/6 * 9/10', ['6/5']),
    'exam-numeros#6': C('2.25 - -3.5', ['3.5']),
    'alg-12#3': C('7 * 200000 / 100000', ['1000', '100']),
    'alg-12#4': C('13500 / 5', ['5600', '2']),
    'alg-13c#5': C('476000 / 1.19', ['0.19', '0.81']),
    'exam-razones#6': C('7 * 15 / 2', ['100']),
    'alg-22a#3': C('r ( 64 + 36 )', ['8', '6']),
    'alg-22b#2': C('2 + 4', ['20', '80', '5']),
    'exam-potencias#5': C('( r r 16 ) ^ 3', ['4', '12']),
    'alg-14d#3': C('6 + 2 * 6', ['12', '3']),
    'alg-4a#3': C('-5 * 3 ^ 2 + 30 * 3 + 1', ['6']),
    'alg-4a#4': C('15 * 15', ['30', '2']),
    'alg-73#3': C('ln(30) / ln(4)', ['30', '4']),
    'alg-73#4': C('ln(2) / 0.04', ['2', '4']),
    // ---------- Trigonometría ----------
    'trig-41a#2': C('180 / π', ['360', '2']),
    'trig-41b#2': C('50 * 120 * π / 180', ['360']),
    'trig-1#1': C('10 * 3/5', ['5/3', '4/5']),
    'trig-2#1': C('10 * sen(60°)', ['cos(60°)', 'tan(60°)']),
    'trig-42c#2': C('2000 / sen(30°)', ['cos(30°)', 'tan(30°)']),
    'trig-3#1': C('-12 / r ( 5 ^ 2 + 12 ^ 2 )', ['13', '17']),
    'trig-43b#2': C('360 - 315', ['180', '270']),
    'trig-44a#1': E(['La amplitud es |a|', 'La amplitud es a', 'La amplitud es 2π ÷ |a|'], ['4', '−4', 'π/2']),
    'trig-44b#1': C('π / 4', ['2', '8']),
    'trig-45#2': C('360 - 210', ['180', '30']),
    'trig-45#3': E(['sen θ = 5/6', 'cos θ = 5/6', 'tan θ = 5/6'], ['θ = sen⁻¹(5/6)', 'θ = cos⁻¹(5/6)', 'θ = tan⁻¹(5/6)'], ['θ ≈ 56.4°', 'θ ≈ 33.6°', 'θ ≈ 39.8°']),
    'trig-4#1': C('-1 * r ( 1 + 2 ^ 2 )'),
    'trig-47b#2': E(['1 − cos²x = sen²x', '1 − cos²x = −sen²x'], ['1 + cot²x = csc²x', '1 + cot²x = sec²x'], ['sen²x · csc²x = 1', 'sen²x · csc²x = sen⁴x', 'sen²x · csc²x = 0']),
    'trig-48a#1': C('3/5 * -5/13 + 4/5 * 12/13', ['-4/5', '-12/13']),
    'trig-48b#2': C('2 * 5/13 * -12/13', ['12/13']),
    'trig-49#2': E(['3x = π/4 + kπ', '3x = π/4 + kπ/2'], ['x = π/12 + kπ/3', 'x = π/12 + kπ/6'], ['k = 0, 1, 2: tres soluciones', 'k = 0 a 5: seis soluciones', 'k = 0: una solución']),
    'trig-46a#1': C('10 * sen(45°) / sen(30°)', ['cos(30°)']),
    'trig-46b#1': E(['c² = 5² + 8² − 2·5·8·cos 60°', 'c² = 5² + 8² + 2·5·8·cos 60°', 'c² = 5² + 8² − 2·5·8'], ['c² = 89 − 40 = 49', 'c² = 89 + 40 = 129', 'c² = 89 − 80 = 9'], ['c = √49 = 7', 'c = √129 ≈ 11.36', 'c = √9 = 3']),
    'trig-151#2': C('r ( 6 ^ 2 + 8 ^ 2 )', ['14']),
    'trig-151#3': C('180 + 45', ['360', '90']),
    'trig-152#3': E(['z = √2 cis 135°', 'z = √2 cis 45°', 'z = 2 cis 135°'], ['z⁴ = (√2)⁴ cis (4 · 135°)', 'z⁴ = 4 · √2 cis (135° + 4°)'], ['4 cis 540° = 4 cis 180°', '4 cis 540° = 4 cis 0°'], ['−4', '4']),
    'trig-153#3': C('90 / 3', ['8', '360', '2']),
    // ---------- Cálculo ----------
    'alg-32#4': E(['15 > 5x', '15 < 5x', '−1 > 5x'], ['x < 3', 'x > 3', 'x ≤ 3'], ['mayor entero: 2', 'mayor entero: 3', 'mayor entero: 4']),
    'alg-26c#3': C('75 - 0.4', ['2']),
    'alg-26c#4': C('7 * -2', ['2', '-7', '9', '5']),
    'alg-51#3': C('6 + 8 + r ( 6 * 6 + 8 * 8 )', ['0']),
    'alg-51#4': C('2 * -1 - 4', ['3']),
    'calc-recta#3': C('12 / 3', ['2', '-2']),
    'calc-recta#4': C('-1 / -1/4 + 1', ['1/4']),
    'alg-52#3': C('( -2 ) ^ 2 - 3 * -2'),
    'alg-52#4': C('6 / 2', ['-6', '1']),
    'calc-tipos#3': C('5 - 3', ['11', '1']),
    'calc-tipos#4': C('24 / 2 ^ 3', ['6']),
    'alg-53#3': E(['Primero g: g(1) = 1', 'Primero f: f(1) = 2'], ['Luego f(1) = 1² + 1', 'Luego g(2) = 3 · 2 − 2'], ['2', '4']),
    'alg-53#4': E(['Primero f: f(2) = 5', 'Primero g: g(2) = 4'], ['Luego g(5) = 3 · 5 − 2', 'Luego f(4) = 4² + 1'], ['13', '17']),
    'calc-tramos#3': C('6 + 1.5 * ( 6 - 2 )'),
    'calc-tramos#4': C('5 - 3', ['-5', '7']),
    'alg-61#3': C('3 * 5 - 4', ['2']),
    'alg-61#4': C('1 - 3', ['6']),
    'alg-62#3': C('( 13 + 7 ) / 4'),
    'alg-62#4': C('( 29 - 2 ) ^ 1/3'),
    'calc-1#0': C('3 * 2 + 1'),
    'calc-1#1': E(['(x − 1)(x + 1) ÷ (x − 1)', '(x − 1)² ÷ (x − 1)'], ['x + 1, con x → 1', 'x − 1, con x → 1'], ['2', '0']),
    'calc-2#0': E(['Divide todo entre x²', 'Reemplaza x por ∞ y resta'], ['3 + 1/x²', '3x² + 1'], ['3', '∞']),
    'calc-3#1': C('2 * 3', ['9']),
    'calc-4#1': C('6 * 1 + 2', ['3']),
    'calc-5#1': C('6 / 2', ['-6', '1']),
    // ---------- Geometría vectorial ----------
    'geo-1#1': E(['Suma las dos: 4x = 8', 'Suma las dos: 4x = 16', 'Resta las dos: 2x = 8'], ['x = 2', 'x = 4', 'x = 8']),
    'geo-1#3': E(['z = −1', 'z = 1'], ['2y + 1 = 5, y = 2', '2y − 1 = 5, y = 3'], ['x = 2 − 2 + 1 = 1', 'x = 2 − 2 − 1 = −1', 'x = 2 − 3 + 1 = 0']),
    'geo-2#2': C('1 * 1 + 2 * 4', ['3', '0', '-1']),
    'geo-2#3': C('2 * 4', ['3']),
    'geo-2#4': C('1 * 4 + 3 * 1', ['2', '-1']),
    'geo-3#2': C('-3 + 5', ['8']),
    'geo-3#3': E(['Aᵀ es 2 × 3', 'Aᵀ es 3 × 2'], ['AᵀA: (2 × 3)(3 × 2) = 2 × 2', 'AᵀA: (3 × 2)(2 × 3) = 3 × 3'], ['2 filas', '3 filas']),
    'geo-3#4': E(['(AB)ᵀ(2, 1) = AB(1, 2)', '(AB)ᵀ(2, 1) = AB(2, 1)'], ['fila 1 de A · columna 2 de B', 'fila 2 de A · columna 1 de B'], ['1 · 1 + 2 · 0 = 1', '3 · 0 + 4 · 1 = 4']),
    'geo-4#1': C('-1 * -3', ['1/3', '0']),
    'geo-4#2': C('-1 * 3 / ( 5 * 2 - 3 * 3 )'),
    'geo-4#3': E(['(AB)⁻¹ = B⁻¹A⁻¹', '(AB)⁻¹ = A⁻¹B⁻¹'], ['fila 2 de B⁻¹ · columna 2 de A⁻¹', 'fila 2 de A⁻¹ · columna 2 de B⁻¹'], ['3 · 2 + 1 · 1 = 7', '0 · 0 + 1 · 1 = 1']),
    'geo-5#1': C('-1 * 5 / ( 2 * 3 - 5 * 1 )'),
    'geo-5#3': C('3 * 1 + -5 * 1', ['-1', '2']),
    'geo-6#1': E(['Desarrolla por la fila 1', 'Multiplica la diagonal'], ['2 · (3 − 2) − 0 + 1 · (1 − 0)', '2 · (3 + 2) − 0 + 1 · (1 + 0)', '2 · 3 · 1'], ['3', '11', '6']),
    'geo-6#2': C('3 * -1 * 4', ['7', '-2', '5', '0']),
    'geo-6#3': C('2 ^ 3 * 5'),
    'geo-7#1': E(['0 · (5 − 3) − 2 · (5 − 2) + 4 · (3 − 2)', '0 · (5 − 3) + 2 · (5 − 2) + 4 · (3 − 2)'], ['−6 + 4', '6 + 4'], ['−2', '10']),
    'geo-7#2': C('12 / 3 / -1', ['2']),
    'geo-7#3': E(['Sumar a una fila un múltiplo de otra', 'Multiplicar una fila por 7'], ['no cambia el determinante', 'multiplica el determinante por 7'], ['det = 1', 'det = 7']),
    'geo-8#1': C('2 * -3 - 1 * 1', ['7', '0']),
    'geo-8#2': C('( 7 * -3 - 1 * 0 ) / -7'),
    'geo-8#3': C('-3 / 4', ['3']),
    'geo-8#4': C('8 / 3', ['4', '2']),
    'geo-9#2': C('r ( ( -5 ) ^ 2 + 12 ^ 2 )', ['17', '7']),
    'geo-9#3': E(['El vector es (2t + 1, −t + 4)', 'El vector es (2t + 4, −t + 1)'], ['Anula la y: −t + 4 = 0', 'Anula la x: 2t + 1 = 0'], ['t = 4', 't = −½']),
    'geo-10#2': C('( 2 + 4 + 9 ) / 3', ['1', '7']),
    'geo-10#3': C('14 / 2', ['3']),
    'geo-11#2': C('r ( 2 ^ 2 + 3 ^ 2 + 6 ^ 2 )'),
    'geo-11#3': C('2 / 3', ['-1', '9']),
    'geo-12#1': C('4 / 2', ['1', '3']),
    'geo-12#2': C('1 + 3 * 2', ['-2', '4']),
    'geo-12#3': C('-6 / 3', ['2', '5']),
    'geo-13#2': E(['1 + 2t = 3 + s  y  2 + t = 6 − s', '1 + 2t = 6 − s  y  2 + t = 3 + s'], ['Sumando: 3 + 3t = 9, t = 2', 'Sumando: 3 + 3t = 9, t = 3'], ['x = 1 + 2 · 2 = 5', 'x = 1 + 2 · 3 = 7']),
    'geo-13#3': C('( 9 - 3 ) / 4', ['2', '1']),
    'geo-14#1': E(['u · v = 1', 'u · v = 2'], ['cos θ = 1 ÷ (√2 · √2) = ½', 'cos θ = 1 ÷ (2 · 2) = ¼'], ['θ = 60°', 'θ = 30°', 'θ = 45°']),
    'geo-14#2': C('4 / ( 3 + 2 )', ['-1']),
    'geo-14#3': C('3 ^ 2 + 2 * 6 + 4 ^ 2'),
    'geo-15#2': C('( -1 * 3 + 3 * 4 ) / 5', ['2', '0']),
    'geo-15#3': E(['La proyección es el vector cero', 'La proyección es lo más larga posible'], ['u · v = 0', 'u · v = ‖u‖‖v‖'], ['90°', '0°', '180°']),
    'geo-16#1': C('( 4 * 3 + 3 * -1 - 4 ) / 5'),
    'geo-16#2': C('2 * 1 - 2 + 3 * -1'),
    'geo-16#3': C('( 14 - 2 - 2 - 1 ) / 3'),
    'geo-16#4': E(['Normales: (1, 1, 1) y (1, −1, 0)', 'Normales: (1, 1, 1) y (1, 1, 0)'], ['n₁ · n₂ = 1 − 1 + 0 = 0', 'n₁ · n₂ = 1 + 1 + 0 = 2'], ['90°', '0°', '45°']),
    'geo-17#1': C('2 * 2 - 0 * -1', ['3', '1']),
    'geo-17#2': C('1 * -1 - 2 * 3', ['0']),
    'geo-17#3': C('r ( 8 ^ 2 + 6 ^ 2 ) / 2'),
    'geo-17#4': E(['î × ĵ = k̂', 'î × ĵ = −k̂'], ['Al cambiar el orden cambia el signo', 'El orden no importa'], ['c = −1', 'c = 1']),
    'geo-18#1': C('-1 * 0 - 2 * -1', ['3', '6']),
    'geo-18#2': C('1 * 2 * 4', ['3', '0']),
    'geo-18#3': C('r ( 3 ^ 2 + 4 ^ 2 )', ['1']),
    'geo-18#4': C('1 * -1 - 1 * 1', ['0']),
    'geo-19#2': C('100 / ( 2 * sen(30°) )', ['cos(30°)']),
    'geo-19#3': C('r ( 30 ^ 2 + 40 ^ 2 )', ['70']),
    'geo-19#4': C('20 * cos(60°)', ['sen(60°)']),
    'geo-20#2': C('r ( 8 ^ 2 + 6 ^ 2 ) / 2'),
    'geo-20#3': C('r ( 200 ^ 2 + 50 ^ 2 )', ['250', '150']),
    'geo-21#2': C('50 * 10 * cos(60°)', ['sen(60°)']),
    'geo-21#3': C('40 * 0.25', ['4']),
    'geo-21#4': C('0 * 0 - 3 * 1', ['2']),
    'geo-22#2': C('-12 / 4', ['2', '12']),
    'geo-22#3': C('1 ^ 2 / ( 4 * 0.25 )', ['2']),
    'geo-23#2': C('r ( 169 - 144 )', ['13', '12']),
    'geo-23#3': C('r ( 16 + 9 ) / 4', ['3']),
    'geo-23#4': C('3 * r ( 1 - 4 ^ 2 / 5 ^ 2 )'),
    // ---------- Física, Cálculo integral, Álgebra lineal ----------
    'fis-1#0': C('20 * 5', ['2']),
    'fis-1#1': C('2 * 6', ['0']),
    'fis-1#2': C('2 * 6 ^ 2 / 2'),
    'fis-2#2': C('r ( 2 * 20 / 10 )'),
    'fis-3#0': C('5 * 3', ['2']),
    'fis-3#2': C('10 * 9.8'),
    'fis-4#1': C('10 * sen(30°)', ['cos(30°)']),
    'fis-5#0': C('2 * 3 ^ 2 / 2'),
    'fis-5#1': C('1 * 10 * 5'),
    'fis-5#2': C('r ( 2 * 10 * 5 )'),
    'int-1#0': C('2 * 4 / 2'),
    'int-2#1': C('3 ^ 3 / 3', ['2']),
    'lin-1#1': C('r ( 3 ^ 2 + 4 ^ 2 )', ['7']),
    'lin-1#2': C('1 * 3 + 2 * 4'),
    'lin-2#1': C('2 * 3 - 1 * 1'),
  };
})();

// Cambia en los cursos cada ejercicio de escribir por su juego. Devuelve cuántos cambió y cuáles no pudo.
function sinEscribir(courses, table = SIN_ESCRIBIR) {
  const out = { done: 0, missing: [], mismatch: [], unused: new Set(Object.keys(table)) };
  const swap = (list, id) => (list || []).forEach((ex, i) => {
    if (!ex || ex.type !== 'input') return;
    const key = `${id}#${i}`, t = table[key];
    if (!t) { out.missing.push(key); return; }
    out.unused.delete(key);
    const { type, answer, tol, prefix, suffix, answerText, ...rest } = ex;
    let params;
    if (t.game === 'arma-la-cuenta') {
      const v = GAMES['arma-la-cuenta']?.evaluate(t.sol), lim = tol ?? 1e-6 * Math.max(1, Math.abs(answer));
      if (!(Math.abs(v - answer) <= lim)) { out.mismatch.push(key); return; }   // la ficha ya no es de este ejercicio: se deja como estaba
      // El juego calcula exacto: vale la cuenta de la ficha, no el redondeo que se aceptaba al escribir (con ese margen
      // pasaban cuentas falsas). La tolerancia vieja solo dice cuántos decimales mostrar.
      const round = { sol: t.sol, traps: t.traps, answer: v, tol: 1e-9 * Math.max(1, Math.abs(v)), ...(tol != null ? { digits: tol } : {}), ...(suffix ? { unit: suffix } : {}) };
      params = { rounds: [round] };
    } else params = { rounds: [{ levels: t.levels }] };
    list[i] = { ...rest, type: 'play', game: t.game, params };
    out.done++;
  });
  for (const c of courses) for (const u of c.units || []) {
    for (const l of u.lessons || []) swap(l.ex, l.id);
    if (u.exam) { const exs = u.exam.items.map(it => it.ex); swap(exs, `exam-${u.world}`); exs.forEach((ex, i) => { u.exam.items[i].ex = ex; }); }
    if (u.boss) swap(u.boss.ex, u.boss.id);
  }
  out.unused = [...out.unused];
  return out;
}
if (typeof COURSES !== 'undefined') {
  const r = sinEscribir(COURSES);
  if ((r.missing.length || r.mismatch.length) && typeof console !== 'undefined') console.warn('sin-escribir: quedan ejercicios de escribir', r.missing, r.mismatch);
}
