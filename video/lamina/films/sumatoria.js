// Lección alg-15 · Sumatoria y productoria (mundo Sucesiones y Series).
// Σ con índice, límites y término general; desplegar (el índice empieza donde sea); linealidad y Σ c = nc; sumas notables
// (k y k²); telescópica; Π y el factorial; 0! = 1 y n! = n · (n − 1)!.
const R = String.raw;
const POSTER = 40;
const FILM = {
  lesson: 'alg-15', world: 'progresiones', key: 'G', n: [5, 5],
  title: 'Sumatoria y productoria',
  next: 'Grado y operaciones',
  intro: 'Una suma muy larga cabe en un símbolo: la sigma griega. Y su prima, la pi mayúscula, abrevia productos largos.',
  examples: ['(2k + 1)', '9 + 16 + 25 + 36', '86', '3k + 2', '38', '(k + 1)² − k²', '1 · 3 · 5'],
  scenes: [
    { id: 'sigma', name: 'La sigma', dur: 35,
      caps: [[0.5, 9.0, 'UNA SUMA LARGA', '$3 + 5 + 7 + 9 + 11$:', 'cada término es $2k + 1$.'], [9.4, 19.0, 'LA SIGMA', 'Abajo, desde dónde va $k$;', 'arriba, hasta dónde.'],
        [19.4, 34.4, 'SE LEE', '«La suma de $2k + 1$,', 'para $k$ de 1 a 5».']],
      narr: [[0.5, 9.0, 'Tres más cinco más siete más nueve más once. Cada término sale de la regla dos k más uno, con k de uno a cinco.'],
        [9.4, 19.0, 'La letra griega sigma mayúscula escribe esa suma en corto. Abajo va el índice k y desde dónde empieza; arriba, hasta dónde llega; a la derecha, el término general.'],
        [19.4, 34.4, 'Se lee: la suma de dos k más uno, para k desde uno hasta cinco. Da treinta y cinco.']],
      ev: [[1.0, 'pops', 5], [9.8, 'rise'], [11.0, 'tag'], [12.4, 'tag'], [13.8, 'tag'], [19.8, 'card']],
      draw(t) {
        [3, 5, 7, 9, 11].forEach((v, i) => fade(A(t, 1.0 + i * .2), () => { M(String(v), 200 + i * 170, 640, 64, { pass: true }); fade(A(t, 3.4 + i * .3), () => M(`k = ${i + 1}`, 200 + i * 170, 720, 32, { c: P.ac, pass: true })); }));
        fade(A(t, 9.8), () => { const r = M(R`\op{Σ}{\id{hi}{5}}{\id{lo}{k = 1}} \id{tg}{(2k + 1)}`, 540, 1020, 110, { id: 's' });
          fade(A(t, 11.0), () => label('desde', r.box.lo.x0 - 30, r.box.lo.cy + 12, P.ac, { s: 34, a: 'r' })); fade(A(t, 12.4), () => label('hasta', r.box.hi.x0 - 30, r.box.hi.cy + 12, P.ac, { s: 34, a: 'r' })); fade(A(t, 13.8), () => label('término general', r.box.tg.cx, r.box.tg.y1 + 60, P.ac, { s: 34 })); });
        fade(A(t, 19.8), () => M(R`\op{Σ}{5}{k = 1} (2k + 1) = 3 + 5 + 7 + 9 + 11 = \hl{35}`, 540, 1440, 58, { id: 'v' }));
      } },
    { id: 'desplegar', name: 'Desplegar una sigma', dur: 30,
      caps: [[0.5, 9.0, 'DESDE CUALQUIER LUGAR', '$k$ puede empezar en 3:', 'la suma de $k^{2}$ de 3 a 6.'], [9.4, 19.0, 'SE DESPLIEGA', '$9 + 16 + 25 + 36 = 86$.', ''],
        [19.4, 29.4, 'CUÁNTOS TÉRMINOS', 'De 3 a 6 hay', '$6 − 3 + 1 = 4$ términos.']],
      narr: [[0.5, 9.0, 'El índice no tiene que empezar en uno. La suma de k al cuadrado para k de tres a seis empieza en tres.'],
        [9.4, 19.0, 'Para desplegarla se reemplaza k por tres, cuatro, cinco y seis: nueve más dieciséis más veinticinco más treinta y seis, ochenta y seis.'],
        [19.4, 29.4, 'De tres a seis hay cuatro términos: el último menos el primero, más uno. Otra vez los postes de la cerca.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 4], [19.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\op{Σ}{6}{k = 3} k^{2}`, 540, 760, 110, { id: 's' }));
        [[3, 9], [4, 16], [5, 25], [6, 36]].forEach(([k, v], i) => fade(A(t, 9.8 + i * .4), () => { rect(150 + i * 200, 960, 180, 120, { r: 12, w: 4, fill: .25 }); M(`${k}^{2} = ${v}`, 240 + i * 200, 1036, 44, { pass: true }); }));
        fade(A(t, 11.6), () => M(R`= 9 + 16 + 25 + 36 = \hl{86}`, 540, 1260, 70, { id: 'v' }));
        fade(A(t, 19.8), () => M(R`\t{términos} = 6 − 3 + 1 = 4`, 540, 1420, 64, { id: 'n' }));
      } },
    { id: 'lineal', name: 'Las propiedades', dur: 37,
      caps: [[0.5, 9.0, 'LAS CONSTANTES SALEN', R`$Σc\,a_{k} = c Σa_{k}$:`, 'es la distributiva.'], [9.4, 19.0, 'LAS SUMAS SE SEPARAN', R`$Σ(a_{k} + b_{k})$`, R`$= Σa_{k} + Σb_{k}$.`],
        [19.4, 27.0, 'UNA CONSTANTE SOLA', R`$Σc = nc$:`, 'se suma $n$ veces.'], [27.4, 36.4, 'EJEMPLO', 'Con $3k + 2$ de 1 a 4:', '$3 · 10 + 4 · 2 = 38$.']],
      narr: [[0.5, 9.0, 'La sigma tiene propiedades que salen de los axiomas. Si todos los términos llevan el mismo factor, el factor sale: es la distributiva.'],
        [9.4, 19.0, 'Si cada término es una suma, la sigma se separa en dos sigmas: es la conmutativa y la asociativa.'],
        [19.4, 27.0, 'Y si el término no depende de k, se suma n veces la misma constante: n por c.'],
        [27.4, 36.4, 'Con eso, la suma de tres k más dos, de uno a cuatro, es tres por diez más cuatro por dos: treinta y ocho.']],
      ev: [[1.0, 'rise'], [9.8, 'cut'], [19.8, 'rise'], [27.8, 'card']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\op{Σ}{n}{k = 1} c\,a_{k} = c \op{Σ}{n}{k = 1} a_{k}`, 540, 640, 64, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\op{Σ}{n}{k = 1} (a_{k} + b_{k}) = \op{Σ}{n}{k = 1} a_{k} + \op{Σ}{n}{k = 1} b_{k}`, 540, 880, 56, { id: 'b' }));
        fade(A(t, 19.8), () => M(R`\op{Σ}{n}{k = 1} c = nc`, 540, 1110, 64, { id: 'c' }));
        fade(A(t, 27.8), () => M(R`\op{Σ}{4}{k = 1} (3k + 2) = 3 · 10 + 4 · 2 = \hl{38}`, 540, 1380, 58, { id: 'e' }));
      } },
    { id: 'notables', name: 'Sumas notables', dur: 34,
      caps: [[0.5, 9.0, 'LA DE GAUSS', R`$Σk = \frac{n(n + 1)}{2}$.`, ''], [9.4, 19.0, 'LA DE LOS CUADRADOS', R`$Σk^{2} = \frac{n(n + 1)(2n + 1)}{6}$.`, ''],
        [19.4, 33.4, 'COMPROBAR', 'Con $n = 4$: $1 + 4 + 9 + 16 = 30$', R`y $\frac{4 · 5 · 9}{6} = 30$.`]],
      narr: [[0.5, 9.0, 'Algunas sumas tienen fórmula propia. La de los primeros n números es la de Gauss: n por n más uno, sobre dos.'],
        [9.4, 19.0, 'La de los primeros n cuadrados es n por n más uno por dos n más uno, sobre seis.'],
        [19.4, 33.4, 'Se comprueba con n igual a cuatro: uno más cuatro más nueve más dieciséis da treinta, y la fórmula, cuatro por cinco por nueve sobre seis, también.']],
      ev: [[1.0, 'rise'], [9.8, 'rise'], [19.8, 'pops', 4], [23.0, 'yes']],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\op{Σ}{n}{k = 1} k = \frac{n(n + 1)}{2}`, 540, 660, 72, { id: 'a' }));
        fade(A(t, 9.8), () => M(R`\op{Σ}{n}{k = 1} k^{2} = \frac{n(n + 1)(2n + 1)}{6}`, 540, 920, 66, { id: 'b' }));
        if (t > 19.4) [1, 2, 3, 4].forEach((n, i) => fade(A(t, 19.8 + i * .4), () => { const s = 26, x = 160 + [0, 50, 140, 270][i]; cells(x, 1250 - n * s, n, n, s, n * n, { a: .5 }); }));
        fade(A(t, 23.0), () => M(R`\frac{4 · 5 · 9}{6} = \hl{30}`, 760, 1200, 60, { id: 'c' }));
      } },
    { id: 'telescopica', name: 'Una suma telescópica', dur: 33,
      caps: [[0.5, 9.0, 'DIFERENCIAS', R`$Σ((k + 1)^{2} − k^{2})$:`, 'cada término es una resta.'], [9.4, 19.0, 'SE CANCELAN', 'Lo que suma uno lo', 'resta el siguiente.'],
        [19.4, 32.4, 'QUEDAN LAS PUNTAS', 'El último menos el primero:', '$25 − 1 = 24$.']],
      narr: [[0.5, 9.0, 'Hay sumas que se derrumban solas. Cada término es una resta: dos al cuadrado menos uno, tres al cuadrado menos dos al cuadrado…'],
        [9.4, 19.0, 'Al escribirlas seguidas, el cuatro que suma el primero lo resta el segundo; el nueve que suma el segundo lo resta el tercero. Todo se cancela en cadena.'],
        [19.4, 32.4, 'Solo quedan las puntas: el último, veinticinco, menos el primero, uno. Veinticuatro. Se llaman telescópicas, como un catalejo que se recoge.']],
      ev: [[1.0, 'pops', 4], [9.8, 'cut'], [19.8, 'card']],
      draw(t) {
        const terms = [['4', '1'], ['9', '4'], ['16', '9'], ['25', '16']];
        terms.forEach(([a, b], i) => fade(A(t, 1.0 + i * .3), () => { const x = 150 + i * 205; rect(x, 640, 190, 110, { r: 12, w: 3, fill: .15 }); M(a, x + 50, 712, 46, { c: i === 3 ? P.ac : t > 9.8 ? P.dim : P.ink, pass: true }); M('−', x + 95, 712, 46, { pass: true }); M(b, x + 145, 712, 46, { c: i === 0 ? P.ac : t > 9.8 ? P.dim : P.ink, pass: true }); }));
        if (t > 9.8) for (let i = 0; i < 3; i++) fade(A(t, 9.8 + i * .5), () => { const x = 150 + i * 205; stroke(P.no, 4, () => { X.moveTo(x + 30, 680); X.lineTo(x + 70, 730); X.moveTo(x + 330, 680); X.lineTo(x + 370, 730); }); hop(x + 50, x + 205 + 145, 640, 1, { c: P.no, h: 60 }); });
        fade(A(t, 19.8), () => M(R`\op{Σ}{4}{k = 1} ((k + 1)^{2} − k^{2}) = 25 − 1 = \hl{24}`, 540, 1100, 58, { id: 'r' }));
      } },
    { id: 'productoria', name: 'La productoria', dur: 31,
      caps: [[0.5, 9.0, 'PI MAYÚSCULA', 'Abrevia productos:', R`$Π(2k − 1) = 1 · 3 · 5$.`], [9.4, 19.0, 'EL FACTORIAL', R`$n! = Πk = 1 · 2 · … · n$.`, ''],
        [19.4, 30.4, 'CRECE MUY RÁPIDO', '$3! = 6$, $5! = 120$,', R`$10! = 3\,628\,800$.`]],
      narr: [[0.5, 9.0, 'La pi mayúscula hace lo mismo que la sigma, pero multiplicando. Dos k menos uno, de uno a tres: uno por tres por cinco.'],
        [9.4, 19.0, 'El producto más famoso es el factorial: n factorial es uno por dos por tres, hasta n. Se escribe n con un signo de admiración.'],
        [19.4, 30.4, 'Crece rapidísimo: tres factorial es seis, cinco factorial es ciento veinte, y diez factorial pasa de tres millones y medio.']],
      ev: [[1.0, 'rise'], [9.8, 'card'], [19.8, 'pops', 3]],
      draw(t) {
        fade(A(t, 1.0), () => M(R`\op{Π}{3}{k = 1} (2k − 1) = 1 · 3 · 5 = 15`, 540, 700, 70, { id: 'p' }));
        fade(A(t, 9.8), () => M(R`n! = \op{Π}{n}{k = 1} k = 1 · 2 · 3 · … · n`, 540, 960, 66, { id: 'f' }));
        [[3, '6'], [5, '120'], [10, '3\\,628\\,800']].forEach(([n, v], i) => fade(A(t, 19.8 + i * .6), () => M(`${n}! = ${v}`, 540, 1180 + i * 100, 60, { pass: true })));
      } },
    { id: 'factorial', name: 'El factorial paso a paso', dur: 27,
      caps: [[0.5, 9.0, 'UNO DE OTRO', '$n! = n · (n − 1)!$:', '$5! = 5 · 4!$.'], [9.4, 18.0, 'HACIA ABAJO', '$1! = 1 · 0!$: para que', 'funcione, $0! = 1$.'],
        [18.4, 26.4, 'COMO $a^{0} = 1$', 'El producto vacío vale 1,', 'el neutro del producto.']],
      narr: [[0.5, 9.0, 'Cada factorial se obtiene del anterior: cinco factorial es cinco por cuatro factorial.'],
        [9.4, 18.0, 'Bajando la escalera, uno factorial es uno por cero factorial. Para que eso funcione, cero factorial tiene que ser uno.'],
        [18.4, 26.4, 'Igual que a a la cero: un producto sin factores vale uno, el neutro del producto.']],
      ev: [[1.0, 'rise'], [9.8, 'pops', 5], [18.8, 'yes']],
      draw(t) {
        [[5, '120'], [4, '24'], [3, '6'], [2, '2'], [1, '1'], [0, '1']].forEach(([n, v], i) => fade(A(t, i < 5 ? 1.0 + i * .3 : 11.4), () => { const x = 140 + i * 150, y = 620 + i * 90; rect(x, y, 140, 80, { r: 10, w: 4, fill: n === 0 ? .6 : .2 }); M(`${n}! = ${v}`, x + 70, y + 54, 36, { pass: true }); if (i) M('÷' + (n + 1), x - 10, y - 4, 28, { c: P.ac, pass: true }); }));
        fade(A(t, 9.8), () => M(R`1! = 1 · 0! \;⇒\; 0! = \hl{1}`, 540, 1380, 72, { id: 'z' }));
      } },
  ],
  sum: [['Sumatoria', R`\op{Σ}{n}{k = 1} a_{k} = a_{1} + a_{2} + … + a_{n}`], ['Propiedades', R`\op{Σ}{}{} (c\,a_{k} + b_{k}) = c\op{Σ}{}{} a_{k} + \op{Σ}{}{} b_{k}`], ['Notables', R`\op{Σ}{n}{k = 1} k = \frac{n(n + 1)}{2}`], ['Telescópica', R`\op{Σ}{n}{k = 1} (a_{k+1} − a_{k}) = a_{n+1} − a_{1}`], ['Factorial', R`n! = \op{Π}{n}{k = 1} k \qquad 0! = 1`]],
  end: ['Una suma larga cabe', 'en un solo símbolo.'],
  finNarr: [[0.8, 9.0, 'En resumen: la sigma abrevia sumas con un índice, sus límites y un término general.'],
    [9.2, 16.0, 'Las constantes salen, las sumas se separan, y la pi mayúscula abrevia productos como el factorial.']],
};
