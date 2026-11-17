// Lección alg-1 · Ecuaciones lineales (mundo Parábolas y Complejos).
// La balanza (2 cajas + 5 = 17); la regla: lo mismo a los dos lados; x en los dos lados; paréntesis; fracciones (multiplicar
// por el mínimo común múltiplo); sin solución o con infinitas; un problema de números consecutivos.
const R = String.raw;
const POSTER = 60;
// balanza: izquierda y derecha = { boxes, units }; tilt en radianes
function balance(L, Rt, t, o = {}) {
  const cx = 540, cy = 760, arm = 330, tilt = o.tilt || 0;
  line(cx, cy, cx, cy + 330, { w: 6 }); poly([[cx - 70, cy + 380], [cx + 70, cy + 380], [cx, cy + 320]], { w: 5, fill: .2 });
  X.save(); X.translate(cx, cy); X.rotate(tilt); line(-arm, 0, arm, 0, { w: 6 }); X.restore();
  [[-1, L], [1, Rt]].forEach(([s, side]) => { const px = cx + s * arm * Math.cos(tilt), py = cy + s * arm * Math.sin(tilt);
    line(px, py, px, py + 90, { w: 3 }); line(px - 150, py + 90, px + 150, py + 90, { w: 6 });
    let x = px - 140; for (let i = 0; i < side.boxes; i++) { fade(side.ba ? side.ba(i) : 1, () => { rect(x, py + 10, 64, 76, { r: 8, w: 4, fill: .5 }); M('x', x + 32, py + 60, 36, { pass: true }); }); x += 72; }
    for (let i = 0; i < side.units; i++) { const ux = x + (i % 6) * 34, uy = py + 56 - Math.floor(i / 6) * 34; fade(side.ua ? side.ua(i) : 1, () => rect(ux, uy, 28, 28, { r: 5, w: 2, fill: .8, fc: P.ink })); } });
}
const FILM = {
  lesson: 'alg-1', world: 'cuadraticas', key: 'E', n: [2, 4],
  title: 'Ecuaciones lineales',
  next: 'Polinomio cuadrático y parábola',
  intro: 'Una ecuación es una balanza en equilibrio. Resolverla es dejar una caja sola, sin desequilibrar nunca la balanza.',
  examples: ['2x + 5 = 17', '5x + 2 = 2x + 14', '2(x + 3) = 5x − 9', 'x/3 + 2 = x/2 − 1', 'x + 2 = x + 5', '72'],
  scenes: [
    { id: 'balanza', name: 'Una balanza', dur: 33,
      caps: [[0.5, 9.0, 'EN EQUILIBRIO', '2 cajas iguales y 5 baldosas', 'pesan como 17 baldosas.'], [9.4, 19.0, 'LA ECUACIÓN', '$2x + 5 = 17$: $x$ es lo', 'que trae cada caja.'],
        [19.4, 32.4, 'RESOLVER', 'Encontrar el valor de $x$', 'que equilibra la balanza.']],
      narr: [[0.5, 9.0, 'En una balanza hay dos cajas cerradas iguales y cinco baldosas sueltas. Del otro lado, diecisiete baldosas. Está en equilibrio.'],
        [9.4, 19.0, 'Si cada caja trae x baldosas, la balanza dice: dos x más cinco es igual a diecisiete. Eso es una ecuación.'],
        [19.4, 32.4, 'Resolverla es encontrar el valor de x que la hace cierta, sin abrir las cajas.']],
      ev: [[1.0, 'pops', 7], [3.0, 'pops', 17], [9.8, 'rise']],
      draw(t) {
        balance({ boxes: 2, units: 5, ba: i => A(t, 1.0 + i * .2), ua: i => A(t, 1.6 + i * .1) }, { boxes: 0, units: 17, ua: i => A(t, 3.0 + i * .06) }, t);
        fade(A(t, 9.8), () => M(R`2x + 5 = 17`, 540, 1340, 100, { id: 'e' }));
      } },
    { id: 'regla', name: 'La regla', dur: 33,
      caps: [[0.5, 9.0, 'LA REGLA', 'Lo que se hace en un lado', 'se hace en el otro.'], [9.4, 19.0, 'QUITAR 5', 'De cada lado:', '$2x = 12$.'],
        [19.4, 32.4, 'REPARTIR EN 2', 'Cada caja trae 6:', '$x = 6$.']],
      narr: [[0.5, 9.0, 'La única regla: lo que se haga en un lado se hace en el otro. Así la balanza sigue en equilibrio.'],
        [9.4, 19.0, 'Se quitan cinco baldosas de cada lado. Quedan dos cajas contra doce baldosas.'],
        [19.4, 32.4, 'Las doce se reparten entre las dos cajas: seis cada una. Equis es seis, y se comprueba: dos por seis más cinco es diecisiete.']],
      ev: [[9.8, 'cut'], [19.8, 'shuffle', 1.0], [22.0, 'yes']],
      draw(t) {
        const q = A(t, 9.8, .6), h = A(t, 19.8, .6);
        balance({ boxes: h > .5 ? 1 : 2, units: 5, ua: () => 1 - q }, { boxes: 0, units: h > .5 ? 6 : 17, ua: i => (i >= 12 && h < .5 ? 1 - q : 1) }, t);
        fade(A(t, 1.0) * (1 - A(t, 9.6)), () => M(R`2x + 5 = 17`, 540, 1340, 90, { id: 'a' }));
        fade(A(t, 9.8) * (1 - A(t, 19.6)), () => M(R`2x + 5 \hl{− 5} = 17 \hl{− 5} \;⇒\; 2x = 12`, 540, 1340, 66, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`\frac{2x}{2} = \frac{12}{2} \;⇒\; x = \hl{6}`, 540, 1340, 76, { id: 'c' }));
      } },
    { id: 'doslados', name: 'Cajas en los dos lados', dur: 34,
      caps: [[0.5, 9.0, 'CAJAS A LOS DOS LADOS', '$5x + 2 = 2x + 14$.', ''], [9.4, 19.0, 'PRIMERO LAS CAJAS', 'Se quitan 2 cajas', 'de cada lado: $3x + 2 = 14$.'],
        [19.4, 33.4, 'LUEGO LO DEMÁS', '$3x = 12$, así que', '$x = 4$.']],
      narr: [[0.5, 9.0, 'Si hay cajas en los dos lados, la idea es la misma. Cinco x más dos es igual a dos x más catorce.'],
        [9.4, 19.0, 'Primero se juntan las cajas en un solo lado: se quitan dos cajas de cada lado. Queda tres x más dos igual a catorce.'],
        [19.4, 33.4, 'Luego se quitan las dos baldosas y se reparte: tres x es doce, x es cuatro.']],
      ev: [[1.0, 'rise'], [9.8, 'cut'], [19.8, 'card']],
      draw(t) {
        const rows = [[R`5x + 2 = 2x + 14`, 1.0], [R`5x \hl{− 2x} + 2 = 2x \hl{− 2x} + 14`, 9.8], [R`3x + 2 = 14`, 12.0], [R`3x = 12`, 19.8], [R`x = \hl{4}`, 22.0]];
        rows.forEach(([s, t0], i) => fade(A(t, t0), () => M(s, 540, 620 + i * 140, 68, { id: 'r' + i }), (1 - A(t, t0)) * 14));
      } },
    { id: 'parentesis', name: 'Con paréntesis', dur: 32,
      caps: [[0.5, 9.0, 'PRIMERO REPARTIR', '$2(x + 3) = 5x − 9$:', 'la distributiva.'], [9.4, 19.0, 'SE JUNTAN', '$2x + 6 = 5x − 9$:', 'las $x$ a la derecha.'],
        [19.4, 31.4, 'RESULTADO', '$15 = 3x$, $x = 5$.', 'La $x$ puede quedar a la derecha.']],
      narr: [[0.5, 9.0, 'Con paréntesis, primero se reparte. Dos por x más tres es dos x más seis.'],
        [9.4, 19.0, 'Ahora conviene juntar las x donde hay más: se quitan dos x de cada lado y se suman nueve.'],
        [19.4, 31.4, 'Queda quince igual a tres x: x es cinco. No importa que la x quede a la derecha.']],
      ev: [[1.0, 'rise'], [9.8, 'shuffle', 1.0], [19.8, 'card']],
      draw(t) {
        const rows = [[R`2(x + 3) = 5x − 9`, 1.0], [R`2x + 6 = 5x − 9`, 3.0], [R`6 \hl{+ 9} = 5x \hl{− 2x}`, 9.8], [R`15 = 3x`, 19.8], [R`x = \hl{5}`, 21.6]];
        rows.forEach(([s, t0], i) => fade(A(t, t0), () => M(s, 540, 620 + i * 140, 68, { id: 'r' + i }), (1 - A(t, t0)) * 14));
      } },
    { id: 'fracciones', name: 'Con fracciones', dur: 34,
      caps: [[0.5, 9.0, 'FRACCIONES', R`$\frac{x}{3} + 2 = \frac{x}{2} − 1$.`, ''], [9.4, 19.0, 'MULTIPLICAR POR 6', 'El mínimo común múltiplo', 'de 3 y 2 borra los de abajo.'],
        [19.4, 33.4, 'RESULTADO', '$2x + 12 = 3x − 6$:', '$x = 18$.']],
      narr: [[0.5, 9.0, 'Las fracciones estorban. En x tercios más dos igual a x medios menos uno, hay denominadores tres y dos.'],
        [9.4, 19.0, 'Se multiplican los dos lados, todos los términos, por seis, que es múltiplo de tres y de dos. Los denominadores desaparecen.'],
        [19.4, 33.4, 'Queda dos x más doce igual a tres x menos seis. Pasando, x es dieciocho.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'yes']],
      draw(t) {
        const rows = [[R`\frac{x}{3} + 2 = \frac{x}{2} − 1`, 1.0], [R`\hl{6} · \frac{x}{3} + \hl{6} · 2 = \hl{6} · \frac{x}{2} − \hl{6} · 1`, 9.8], [R`2x + 12 = 3x − 6`, 19.8], [R`x = \hl{18}`, 22.0]];
        rows.forEach(([s, t0], i) => fade(A(t, t0), () => M(s, 540, 640 + i * 170, i === 1 ? 54 : 70, { id: 'r' + i }), (1 - A(t, t0)) * 14));
      } },
    { id: 'casos', name: 'Cuando no hay una sola', dur: 32,
      caps: [[0.5, 9.0, '!SIN SOLUCIÓN', '$x + 2 = x + 5$', 'termina en $2 = 5$.'], [9.4, 19.0, 'NUNCA SE EQUILIBRA', 'Ningún $x$ la hace cierta.', ''],
        [19.4, 31.4, 'INFINITAS', '$2(x + 1) = 2x + 2$ da $0 = 0$:', 'sirve cualquier $x$.']],
      narr: [[0.5, 9.0, 'No toda ecuación tiene solución. En x más dos igual a x más cinco, al quitar la x queda dos igual a cinco.'],
        [9.4, 19.0, 'Eso es falso, y no depende de x. La balanza nunca se equilibra: no hay solución.'],
        [19.4, 31.4, 'Al revés, en dos por x más uno igual a dos x más dos, todo se cancela y queda cero igual a cero. Siempre cierto: cualquier x sirve.']],
      ev: [[1.0, 'rise'], [3.0, 'no'], [19.8, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`x + 2 = x + 5 \;⇒\; \no{2 = 5}`, 540, 760, 76, { id: 'a' }));
        fade(A(t, 9.8), () => label('ninguna solución', 540, 870, P.no, { s: 44 }));
        fade(A(t, 19.8), () => M(R`2(x + 1) = 2x + 2 \;⇒\; \hl{0 = 0}`, 540, 1100, 70, { id: 'b' }));
        fade(A(t, 21.0), () => label('infinitas soluciones', 540, 1210, P.ac, { s: 44 }));
      } },
    { id: 'problema', name: 'Un problema', dur: 33,
      caps: [[0.5, 9.0, 'TRES CONSECUTIVOS', 'Tres números seguidos', 'suman 72.'], [9.4, 19.0, 'SE NOMBRAN', '$x$, $x + 1$ y $x + 2$:', '$3x + 3 = 72$.'],
        [19.4, 32.4, 'RESULTADO', '$x = 23$: los números', 'son 23, 24 y 25.']],
      narr: [[0.5, 9.0, 'Las ecuaciones sirven para resolver problemas. Tres números enteros seguidos suman setenta y dos. Hay que encontrarlos.'],
        [9.4, 19.0, 'Si el primero es x, los siguientes son x más uno y x más dos. Su suma es tres x más tres, igual a setenta y dos.'],
        [19.4, 32.4, 'Tres x es sesenta y nueve, x es veintitrés. Los números son veintitrés, veinticuatro y veinticinco, que suman setenta y dos.']],
      ev: [[1.0, 'pops', 3], [9.8, 'rise'], [19.8, 'card']],
      draw(t) {
        [['x', 1.0], ['x + 1', 1.3], ['x + 2', 1.6]].forEach(([s, t0], i) => fade(A(t, t0), () => { rect(170 + i * 260, 600, 220, 140, { r: 16, w: 4, fill: .2 }); M(t > 19.8 ? String(23 + i) : s, 280 + i * 260, 690, 54, { pass: true }); }));
        fade(A(t, 9.8), () => M(R`x + (x + 1) + (x + 2) = 72`, 540, 940, 66, { id: 'e' }));
        fade(A(t, 12.0), () => M(R`3x + 3 = 72`, 540, 1080, 70, { id: 'f' }));
        fade(A(t, 19.8), () => M(R`3x = 69 \;⇒\; x = \hl{23}`, 540, 1240, 70, { id: 'r' }));
      } },
  ],
  sum: [['La regla', R`\t{lo mismo a los dos lados}`], ['Despejar', R`2x + 5 = 17 \;⇒\; x = 6`], ['Paréntesis y fracciones', R`\t{repartir; multiplicar por el mcm}`], ['Casos especiales', R`2 = 5 \;\t{(ninguna)} \qquad 0 = 0 \;\t{(infinitas)}`], ['Problemas', R`x + (x + 1) + (x + 2) = 72`]],
  end: ['Resolver es dejar la caja sola', 'sin desequilibrar la balanza.'],
  finNarr: [[0.8, 9.0, 'En resumen: en una ecuación se hace lo mismo a los dos lados hasta dejar la x sola.'],
    [9.2, 16.0, 'Se reparten los paréntesis, se borran las fracciones, y a veces no hay solución o las hay infinitas.']],
};
