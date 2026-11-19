// Kit del cubo (Preuniversitario, mundo «Razonamiento espacial»; spec 2026-11-18-preuda-razonamiento-completo): dobla un
// desarrollo plano y dice qué cara del cubo es cada cuadrado. Se recorre el desarrollo desde un cuadrado (abajo del cubo) y
// cada paso a un vecino «rueda» el cubo: el cuadrado vecino queda abajo. Caras del cubo: 0 y 1 opuestas, 2 y 3, 4 y 5.
// cells = [[col, fila], …]   →   fold(cells) = [id de cara de cada cuadrado] o null si no es un desarrollo válido.
const CUBO = (() => {
  const roll = (s, d) => {
    const { U, D, N, S, E, W } = s;
    if (d === 'E') return { U: W, D: E, N, S, E: U, W: D };
    if (d === 'W') return { U: E, D: W, N, S, E: D, W: U };
    if (d === 'N') return { U: S, D: N, N: U, S: D, E, W };
    return { U: N, D: S, N: D, S: U, E, W };          // 'S'
  };
  function fold(cells) {
    if (cells.length !== 6) return null;
    const key = c => c.join(','), idx = {}; cells.forEach((c, i) => { idx[key(c)] = i; });
    const face = Array(6).fill(null), st = Array(6).fill(null);
    face[0] = 0; st[0] = { D: 0, U: 1, N: 2, S: 3, E: 4, W: 5 };
    const Q = [0], dirs = [['E', 1, 0], ['W', -1, 0], ['N', 0, -1], ['S', 0, 1]];
    while (Q.length) {
      const i = Q.shift(), [x, y] = cells[i];
      for (const [d, dx, dy] of dirs) { const j = idx[key([x + dx, y + dy])]; if (j == null || st[j]) continue; st[j] = roll(st[i], d); face[j] = st[j].D; Q.push(j); }
    }
    if (face.some(f => f == null)) return null;                    // no está todo unido
    return new Set(face).size === 6 ? face : null;                 // dos cuadrados en la misma cara: no cierra
  }
  // Índice del cuadrado opuesto a i en un desarrollo válido.
  const opposite = (cells, i) => { const f = fold(cells); return f ? f.indexOf(f[i] ^ 1) : -1; };
  return { fold, opposite };
})();
