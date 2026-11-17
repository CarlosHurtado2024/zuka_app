// Lección alg-11c · Los irracionales y los números reales (mundo La Recta Real).
// La diagonal del cuadrado (√2, como en la lámina), por qué no es fracción, su decimal, π con la rueda (también de la lámina),
// 𝕀, ℝ = ℚ ∪ 𝕀, la cadena ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ y la recta llena y densa (con un acercamiento de cámara).
const R = String.raw;
const POSTER = 40;
const LY = 980;
const lineX = (t, k = 1) => axis({ x0: 110, x1: 960, y: LY, v0: -1, v1: 4, ticks: [-1, 0, 1, 2, 3, 4], k });
const FILM = {
  lesson: 'alg-11c', world: 'numeros', key: 'A', n: [3, 6],
  title: 'Los irracionales y los números reales',
  next: 'Axiomas de campo: las reglas de la suma y el producto',
  intro: 'Hay puntos de la recta a los que ninguna fracción llega. El más famoso sale de dibujar un cuadrado y su diagonal.',
  examples: ['0.1010010001', '√3', '1.96', '2.25', '1.9881'],
  scenes: [
    { id: 'diagonal', name: 'La diagonal del cuadrado', dur: 33,
      caps: [[0.5, 9.0, 'UN CUADRADO', 'De lado 1, apoyado', 'sobre la recta.'], [9.4, 18.0, 'SU DIAGONAL', 'Por Pitágoras:', '$d^{2} = 1^{2} + 1^{2} = 2$.'],
        [18.4, 32.4, 'EL COMPÁS', 'Se gira la diagonal hasta', R`la recta: ahí está $\sqrt{2}$.`]],
      narr: [[0.5, 9.0, 'Dibujemos un cuadrado de lado uno, con un lado sobre la recta, entre el cero y el uno.'],
        [9.4, 18.0, 'Su diagonal mide d. Por el teorema de Pitágoras, d al cuadrado es uno más uno, o sea dos. La diagonal es raíz de dos.'],
        [18.4, 32.4, 'Con un compás se gira la diagonal desde el cero hasta acostarla en la recta. El punto donde cae es raíz de dos: un poco más de uno coma cuatro.']],
      ev: [[0.8, 'draw', 1.0], [2.0, 'draw', 1.2], [9.8, 'draw', 1.0], [19.0, 'draw', 2.4], [21.6, 'pop']],
      draw(t) {
        const X_ = lineX(t, draw(t, .8, 1.0)), s = X_(1) - X_(0);
        poly([[X_(0), LY], [X_(1), LY], [X_(1), LY - s], [X_(0), LY - s]], { k: draw(t, 2.0, 1.2), w: 6, fill: .1 });
        line(X_(0), LY, X_(1), LY - s, { k: draw(t, 9.8, 1.0), c: P.ac, w: 8 });
        fade(A(t, 3.0), () => { M('1', X_(.5), LY + 56, 46, { pass: true }); M('1', X_(1) + 30, LY - s / 2 + 14, 46, { a: 'l', pass: true }); });
        fade(A(t, 10.6), () => M('d', X_(.42), LY - s * .62, 52, { c: P.ac, pass: true }));
        const k = draw(t, 19.0, 2.4); if (k > 0) { const a0 = -Math.PI / 4, a = lerp(a0, 0, k), r = s * Math.SQRT2; stroke(P.ac, 4, () => X.arc(X_(0), LY, r, a0, a), { dash: [12, 10] }); dot(X_(0) + Math.cos(a) * r, LY + Math.sin(a) * r, { r: 11, c: P.ac }); }
        fade(A(t, 21.6), () => { dot(X_(Math.SQRT2), LY, { r: 13, c: P.ac, ping: ping(t, 21.6) }); M(R`\sqrt{2}`, X_(Math.SQRT2) + 10, LY + 150, 56, { c: P.ac, pass: true }); });
        fade(A(t, 10.4), () => M(R`d^{2} = 1^{2} + 1^{2} = 2 \quad ⇒ \quad d = \hl{\sqrt{2}}`, 540, 1400, 62, { id: 'pit' }));
        fade(A(t, 24.0), () => M(R`\sqrt{2} ≈ 1.414`, 540, 1550, 72, { id: 'apx' }));
      } },
    { id: 'nofraccion', name: 'No es una fracción', dur: 43,
      caps: [[0.5, 9.0, 'SUPONGAMOS', R`Que $\sqrt{2} = \frac{p}{q}$ ya`, 'simplificada al máximo.'], [9.4, 18.0, 'ENTONCES', '$p^{2} = 2q^{2}$: $p^{2}$ es par,', 'así que $p$ es par.'],
        [18.4, 27.0, 'SI p ES PAR', '$p = 2k$ y queda', '$q^{2} = 2k^{2}$: $q$ también.'], [27.4, 35.0, '!IMPOSIBLE', 'Los dos pares: la fracción', 'aún se podía simplificar.'],
        [35.4, 42.4, 'CONCLUSIÓN', R`$\sqrt{2}$ no es racional:`, 'es irracional.']],
      narr: [[0.5, 9.0, 'Raíz de dos no es ninguna fracción, y se puede demostrar. Supongamos que sí lo es: p sobre q, ya simplificada lo más posible.'],
        [9.4, 18.0, 'Elevando al cuadrado, p al cuadrado es dos por q al cuadrado. Entonces p al cuadrado es par, y eso solo pasa si p es par.'],
        [18.4, 27.0, 'Si p es par, p es dos k. Reemplazando y simplificando, q al cuadrado es dos k al cuadrado. Entonces q también es par.'],
        [27.4, 35.0, 'Pero si p y q son pares, la fracción se podía simplificar entre dos. Eso contradice lo que supusimos al principio.'],
        [35.4, 42.4, 'La suposición era falsa. Raíz de dos no es racional. Es un número irracional.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [12.0, 'tag'], [18.8, 'rise'], [21.0, 'tag'], [28.0, 'no'], [36.0, 'card']],
      draw(t) {
        const st = 1 + (t > 9.8) + (t > 12.0) + (t > 18.8) + (t > 21.0) + (t > 24.0) + (t > 28.0);
        const y0 = 560, gap = 120, rows = [R`\sqrt{2} = \frac{p}{q}`, R`2 = \frac{p^{2}}{q^{2}} \quad ⇒ \quad p^{2} = 2q^{2}`, R`p^{2} \t{ es par} \quad ⇒ \quad \hl{p \t{ es par}}`,
          R`p = 2k \quad ⇒ \quad (2k)^{2} = 2q^{2}`, R`4k^{2} = 2q^{2} \quad ⇒ \quad q^{2} = 2k^{2}`, R`q^{2} \t{ es par} \quad ⇒ \quad \hl{q \t{ es par}}`];
        rows.forEach((r, i) => fade(A(t, [1.0, 9.8, 12.0, 18.8, 21.0, 24.0][i], .5), () => M(r, 540, y0 + i * gap + (i ? 20 : 0), i ? 54 : 84, { id: 'r' + i }), 0));
        fade(A(t, 1.6), () => label('fracción ya simplificada', 540, y0 + 70, P.mute, { s: 34 }));
        fade(A(t, 28.0), () => { M(R`\frac{p}{q} = \frac{\no{2}·…}{\no{2}·…}`, 540, 1380, 80, { id: 'contra' }); label('se podía simplificar: contradicción', 540, 1490, P.no, { s: 40 }); });
        fade(A(t, 36.0), () => M(R`\sqrt{2} ∉ ℚ`, 540, 1680, 110, { id: 'conc' }), (1 - A(t, 36.0)) * 16);
        void st;
      } },
    { id: 'decimal', name: 'Su decimal', dur: 30,
      caps: [[0.5, 9.0, 'ACORRALARLO', '$1.4^{2} = 1.96$ y $1.5^{2} = 2.25$:', R`$\sqrt{2}$ está entre los dos.`], [9.4, 18.0, 'MÁS CIFRAS', 'Cada cifra nueva', 'achica el corral.'],
        [18.4, 29.4, 'NUNCA SE REPITE', '$1.41421356…$ no termina', 'y no tiene período.']],
      narr: [[0.5, 9.0, 'Su decimal se puede buscar acorralándolo. Uno coma cuatro al cuadrado da uno coma noventa y seis, poco; uno coma cinco da dos coma veinticinco, mucho.'],
        [9.4, 18.0, 'Raíz de dos está entre uno coma cuatro y uno coma cinco. Con otra cifra el corral se achica diez veces, y así sin parar.'],
        [18.4, 29.4, 'El decimal nunca termina y nunca entra en un bloque que se repita. Si se repitiera, sería una fracción, y ya vimos que no lo es.']],
      ev: [[1.0, 'draw', 1.0], [4.0, 'tag'], [6.0, 'tag'], [10.0, 'cut'], [13.0, 'cut'], [18.8, 'pops', 8]],
      draw(t) {
        const lv = t < 9.4 ? 0 : t < 13 ? 1 : 2, ranges = [[1, 2], [1.4, 1.5], [1.41, 1.42]], [a, b] = ranges[lv];
        const X_ = axis({ x0: 140, x1: 940, y: 760, v0: a - (b - a) * .1, v1: b + (b - a) * .1, ticks: Array.from({ length: 11 }, (_, i) => +(a + (b - a) * i / 10).toFixed(4)).filter((_, i) => i % 5 === 0), k: draw(t, 1.0, 1.0), ls: 40, fmt: v => String(v) });
        for (let i = 1; i < 10; i++) line(X_(a + (b - a) * i / 10), 748, X_(a + (b - a) * i / 10), 772, { w: 3, c: hexA(P.ink, .6) });
        dot(X_(Math.SQRT2), 760, { r: 13, c: P.ac }); M(R`\sqrt{2}`, X_(Math.SQRT2), 700, 50, { c: P.ac, pass: true });
        fade(A(t, 4.0), () => { const lo = lv === 0 ? 1.4 : lv === 1 ? 1.41 : 1.414, hi = lv === 0 ? 1.5 : lv === 1 ? 1.42 : 1.415; fillP(P.ac, .18, () => X.rect(X_(lo), 720, X_(hi) - X_(lo), 80)); });
        fade(A(t, 1.6) * (1 - A(t, 18.2)), () => { M(R`1.4^{2} = 1.96 \;<\; 2 \;<\; 2.25 = 1.5^{2}`, 540, 1100, 56, { id: 'c1' }); fade(A(t, 10.4), () => M(R`1.41^{2} = 1.9881 \;<\; 2 \;<\; 2.0164 = 1.42^{2}`, 540, 1220, 50, { id: 'c2' })); });
        fade(A(t, 18.8), () => { const ds = '1.41421356237309504880', n = Math.min(ds.length, Math.floor((t - 18.8) / .25) + 4); M(ds.slice(0, n) + (n === ds.length ? '…' : ''), 540, 1150, 70, { id: 'dig', nr: true }); recBox('dig', '1.41421356237309504880…', 100, 1080, 980, 1170, true); });
        fade(A(t, 20.4), () => label('no termina · no se repite', 540, 1290, P.ac, { s: 42 }));
        fade(A(t, 1.2), () => M(R`\sqrt{2} = 1.41421356…`, 540, 1520, 76, { id: 'sq' }));
      } },
    { id: 'pi', name: 'El número π', dur: 31,
      caps: [[0.5, 9.0, 'UNA RUEDA', 'De diámetro 1, que rueda', 'una vuelta completa.'], [9.4, 18.0, 'LO QUE AVANZA', 'Su perímetro: el número', '$π = 3.14159…$'],
        [18.4, 30.4, 'TAMBIÉN IRRACIONAL', 'Su decimal no termina', 'ni se repite.']],
      narr: [[0.5, 9.0, 'Otro punto famoso. Se pone una rueda de diámetro uno sobre el cero, con una marca abajo, y se hace rodar una vuelta completa.'],
        [9.4, 18.0, 'Cuando la marca vuelve a tocar la recta, la rueda avanzó su perímetro: el número pi, tres coma catorce, quince, nueve…'],
        [18.4, 30.4, 'Pi también es irracional: su decimal no termina ni se repite. Demostrarlo es más largo que con raíz de dos, pero se sabe desde el siglo dieciocho.']],
      ev: [[1.0, 'draw', 1.0], [3.0, 'shuffle', 5.0], [8.2, 'pop'], [18.8, 'pops', 6]],
      draw(t) {
        const X_ = lineX(t, 1), r = (X_(1) - X_(0)) / 2, k = eio(seg(t, 3.0, 8.2)), cx = X_(0) + Math.PI * 2 * r * k, cy = LY - r - 3, ang = k * Math.PI * 2;
        circ(cx, cy, r, { k: draw(t, 1.0, 1.0), w: 6, fill: .1 }); line(cx, cy, cx + Math.sin(-ang) * 0, cy, {});
        dot(cx - Math.sin(ang) * r, cy + Math.cos(ang) * r, { r: 12, c: P.ac });
        if (k > 0) line(X_(0), LY, cx, LY, { c: P.ac, w: 9 });
        fade(A(t, 8.2), () => { dot(X_(Math.PI), LY, { r: 13, c: P.ac, ping: ping(t, 8.2) }); M('π', X_(Math.PI), LY + 150, 64, { c: P.ac, pass: true }); });
        fade(A(t, 1.6), () => M('1', cx + 20, cy - r - 20, 40, { pass: true }));
        fade(A(t, 9.8), () => M(R`π = 3.14159265…`, 540, 1420, 84, { id: 'pi' }));
        fade(A(t, 12.0), () => M(R`\t{perímetro} = π · \t{diámetro}`, 540, 1560, 56, { id: 'per' }));
        fade(A(t, 19.0), () => M(R`π ∉ ℚ`, 540, 1720, 90, { id: 'irr' }));
      } },
    { id: 'I', name: 'Los irracionales', dur: 29,
      caps: [[0.5, 9.0, 'IRRACIONALES', 'Los decimales que no terminan', 'ni se repiten: $𝕀$.'], [9.4, 18.0, 'EJEMPLOS', R`$\sqrt{2}$, $\sqrt{3}$, $π$ y`, 'también $0.1010010001…$'],
        [18.4, 28.4, '!CUIDADO', 'Tener un patrón no basta:', 'tiene que repetirse igual.']],
      narr: [[0.5, 9.0, 'Los números cuyo decimal no termina ni se repite se llaman irracionales. Su conjunto se escribe con una I de doble trazo.'],
        [9.4, 18.0, 'Raíz de dos, raíz de tres y pi son irracionales. También este: cero coma uno cero, uno cero cero, uno cero cero cero…'],
        [18.4, 28.4, 'Ese tiene un patrón, pero los ceros van creciendo: nunca se repite el mismo bloque. Por eso no es periódico, y es irracional.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 4], [18.8, 'tag']],
      draw(t) {
        circ(540, 760, 300, { k: draw(t, .8, 1.2), fill: .08 }); fade(A(t, 1.4), () => M('𝕀', 820, 520, 76, { pass: true }));
        [[R`\sqrt{2}`, 420, 680], [R`\sqrt{3}`, 600, 620], ['π', 680, 790], [R`0.1010010001…`, 420, 880]].forEach(([s, x, y], i) => el(s, x, y, { a: A(t, 9.8 + i * .5), s: 52, dy: 0 }));
        fade(A(t, 1.2), () => M(R`𝕀 = \{x : \t{su decimal no termina ni se repite}\}`, 540, 1380, 46, { id: 'def' }));
        fade(A(t, 18.8), () => { M(R`0.1\hl{0}1\hl{00}1\hl{000}1\hl{0000}1…`, 540, 1540, 66, { id: 'pat' }); label('los bloques de ceros crecen', 540, 1640, P.mute, { s: 38 }); });
      } },
    { id: 'R', name: 'Los reales', dur: 30,
      caps: [[0.5, 9.0, 'LOS REALES', 'Racionales e irracionales', 'juntos: $ℝ = ℚ ∪ 𝕀$.'], [9.4, 18.0, 'SIN NADA EN COMÚN', 'Un número no puede ser', 'las dos cosas: $ℚ ∩ 𝕀 = ∅$.'],
        [18.4, 29.4, 'O UNO O EL OTRO', 'Todo real es racional', 'o irracional.']],
      narr: [[0.5, 9.0, 'Los racionales y los irracionales juntos forman los números reales, con una R de doble trazo. Es la unión de los dos.'],
        [9.4, 18.0, 'No comparten ningún número: un decimal o se repite o no se repite. Su intersección es vacía; son disjuntos.'],
        [18.4, 29.4, 'Así que todo número real cae en exactamente uno de los dos lados.']],
      ev: [[0.8, 'draw', 1.2], [2.0, 'draw', 1.0], [9.8, 'cut'], [18.8, 'pops', 6]],
      draw(t) {
        rect(110, 470, 860, 720, { r: 26, k: draw(t, .8, 1.2), w: 7 }); line(540, 470, 540, 1190, { k: draw(t, 2.0, 1.0), w: 5, c: t > 9.8 ? P.ac : P.ink });
        fade(A(t, 1.6), () => { M('ℝ', 150, 545, 70, { a: 'l', pass: true }); label('racionales ℚ', 325, 560, P.ink, { s: 40 }); label('irracionales 𝕀', 755, 560, P.ink, { s: 40 }); });
        [[R`\frac{3}{4}`, 260, 720], ['−5', 400, 820], ['0.25', 280, 930], [R`0.\bar{6}`, 400, 1050]].forEach(([s, x, y], i) => el(s, x, y, { a: A(t, 18.8 + i * .3), s: 50, dy: 0 }));
        [[R`\sqrt{2}`, 690, 720], ['π', 820, 820], [R`\sqrt{3}`, 690, 940], [R`−\sqrt{5}`, 820, 1050]].forEach(([s, x, y], i) => el(s, x, y, { a: A(t, 19.0 + i * .3), s: 50, dy: 0, c: P.ac }));
        fade(A(t, 1.2), () => M(R`ℝ = ℚ ∪ 𝕀`, 540, 1400, 96, { id: 'u' }));
        fade(A(t, 10.0), () => M(R`ℚ ∩ 𝕀 = ∅`, 540, 1560, 84, { id: 'i' }));
      } },
    { id: 'cadena', name: 'Unos dentro de otros', dur: 26,
      caps: [[0.5, 12.0, 'LA CADENA', '$ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ$: cada', 'conjunto cabe en el siguiente.'], [12.4, 25.4, 'Y APARTE', 'Los irracionales también', 'son reales: $𝕀 ⊆ ℝ$.']],
      narr: [[0.5, 12.0, 'Ahora se ve el mapa completo. Los naturales están dentro de los enteros, los enteros dentro de los racionales y los racionales dentro de los reales.'],
        [12.4, 25.4, 'Al lado, sin tocar a los racionales, están los irracionales. Todos juntos llenan los reales.']],
      ev: [[0.8, 'draw', .8], [1.4, 'draw', .8], [2.0, 'draw', .8], [2.6, 'draw', .8], [12.8, 'draw', 1.0]],
      draw(t) {
        rect(100, 470, 880, 760, { r: 26, k: draw(t, .8, .8), w: 7 }); fade(A(t, 1.0), () => M('ℝ', 140, 545, 70, { a: 'l', pass: true }));
        ell(390, 860, 250, 320, { k: draw(t, 1.4, .8), fill: .06 }); ell(410, 900, 180, 240, { k: draw(t, 2.0, .8), fill: .08 }); ell(420, 940, 110, 150, { k: draw(t, 2.6, .8), fill: .12 });
        fade(A(t, 2.4), () => { M('ℚ', 250, 640, 60, { pass: true }); M('ℤ', 300, 760, 56, { pass: true }); M('ℕ', 420, 950, 56, { c: P.ac, pass: true }); });
        ell(800, 860, 140, 300, { k: draw(t, 12.8, 1.0), fill: .16 }); fade(A(t, 13.6), () => M('𝕀', 800, 880, 64, { c: P.ac, pass: true }));
        fade(A(t, 1.2), () => M(R`ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ`, 540, 1400, 92, { id: 'cad' }));
        fade(A(t, 13.0), () => M(R`𝕀 ⊆ ℝ`, 540, 1560, 84, { id: 'I' }));
      } },
    { id: 'recta', name: 'La recta llena', dur: 35,
      caps: [[0.5, 9.0, 'LA RECTA REAL', 'Cada punto es un real, y', 'cada real es un punto.'], [9.4, 20.0, 'DENSOS', 'Entre dos reales distintos', 'siempre hay otro.'],
        [20.4, 34.4, 'MÁS DE CERCA', 'Por más que se acerque,', 'nunca aparece un hueco.']],
      narr: [[0.5, 9.0, 'Con los reales la recta queda llena: a cada punto le corresponde un real, y a cada real, un punto. Es la recta real.'],
        [9.4, 20.0, 'Entre dos reales distintos siempre hay otro, por ejemplo su punto medio. Entre ese y cualquiera de los dos hay otro, y así sin fin.'],
        [20.4, 34.4, 'Si nos acercamos a la recta entre uno coma cuatro y uno coma cinco, aparecen más y más números. Con los racionales solos quedarían huecos, como raíz de dos. Con los reales, ninguno.']],
      ev: [[1.0, 'draw', 1.2], [9.8, 'pop', 0], [11.4, 'pop', 1], [13.0, 'pop', 2], [20.8, 'dive', 3.0]],
      cam: [[0, 540, 1100, 1], [20.6, 540, 1100, 1], [24.0, 540, 1100, 1.0]],
      draw(t) {
        const z = seg(t, 20.8, 26.0), zk = eio(z), lo = lerp(-1, 1.4, zk), hi = lerp(4, 1.5, zk);
        const ticks = z < .5 ? [-1, 0, 1, 2, 3, 4] : [1.4, 1.42, 1.44, 1.46, 1.48, 1.5];
        const X_ = axis({ x0: 110, x1: 960, y: LY, v0: lo, v1: hi, ticks: ticks.filter(v => v >= lo - 1e-9 && v <= hi + 1e-9), k: draw(t, 1.0, 1.2), ls: z < .5 ? 46 : 36, fmt: v => (v < 0 ? '−' + -v : String(v)) });
        fade(A(t, 2.6), () => { stroke(P.ac, 9, () => { X.moveTo(110, LY); X.lineTo(960, LY); }, { glow: 12 }); });
        if (t > 9.4 && t < 20.4) { const pts = [[1, 2], [1, 1.5], [1, 1.25]]; pts.forEach(([a, b], i) => fade(A(t, 9.8 + i * 1.6), () => { const m = (a + b) / 2; dot(X_(m), LY, { r: 11, c: P.ac, ping: ping(t, 9.8 + i * 1.6) }); M(String(m), X_(m), LY - 60 - i * 60, 42, { c: P.ac, pass: true }); })); dot(X_(1), LY, { r: 11 }); dot(X_(2), LY, { r: 11 }); }
        if (z > 0) { for (const v of [Math.SQRT2, 1.43, 1.45, 1.47]) if (v >= lo && v <= hi) dot(X_(v), LY, { r: 11, c: v === Math.SQRT2 ? P.ac : P.ink }); fade(A(t, 25.0), () => M(R`\sqrt{2}`, X_(Math.SQRT2), LY - 70, 50, { c: P.ac, pass: true })); }
        fade(A(t, 1.6) * (1 - A(t, 9.2)), () => label('a cada punto, un real', 540, 1260, P.mute, { s: 44 }));
        fade(A(t, 9.8) * (1 - A(t, 20.2)), () => M(R`a < b \;⇒\; a < \frac{a + b}{2} < b`, 540, 1400, 72, { id: 'den' }));
        fade(A(t, 26.0), () => label('ningún hueco', 540, 1400, P.ac, { s: 54 }));
      } },
  ],
  sum: [['Irracional', R`\sqrt{2} ∉ ℚ`], ['Su decimal', R`\sqrt{2} = 1.41421356… \quad π = 3.14159…`], ['Los reales', R`ℝ = ℚ ∪ 𝕀 \qquad ℚ ∩ 𝕀 = ∅`], ['La cadena', R`ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ`], ['Densos', R`a < \frac{a + b}{2} < b`]],
  end: ['Con los reales, la recta', 'queda llena, sin huecos.'],
  finNarr: [[0.8, 9.0, 'En resumen: raíz de dos y pi no son fracciones; su decimal no termina ni se repite. Son irracionales.'],
    [9.2, 16.0, 'Racionales e irracionales forman los reales, que llenan la recta sin dejar huecos.']],
};
