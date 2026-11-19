// Preuniversitario · mundo 13 «Ecuaciones y planteamiento»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo).
// Reutiliza juegos de Álgebra (despeja-x, consecutivos, perimetro-x, edades-barras, dos-rectas, elimina-variable, dos-compras,
// espejo-desigualdad, rectangulo-pa, balanza-cajas) con datos nuevos.
PU_JUEGOS.push(({ setLesson, setExam }) => {
  const X = n => Math.floor(n / 10), Y = n => n % 10;
  setLesson('pu-ec-1', [
    play('arma-negacion', 'Del texto a la expresión', { rounds: [
      { ask: 'Traduce a una expresión', show: 'el triple de un número, disminuido en 4', tray: ['$3x$', '$3(x$', '$- 4$', '$- 4)$', '$x - 3$', '$4x$'], need: [0, 2] },
      { ask: 'Traduce a una expresión', show: 'el triple de la diferencia entre un número y 4', tray: ['$3x$', '$3(x$', '$- 4$', '$- 4)$', '$x - 3$', '$4x$'], need: [1, 3] },
      { ask: 'Traduce a una ecuación', show: 'la mitad de un número excede en 3 a su cuarta parte', tray: ['$\\tfrac{x}{2}$', '$\\tfrac{x}{4}$', '$=$', '$+ 3$', '$- 3$', '$2x$'], need: [0, 2, 1, 3], alt: [[0, 4, 2, 1], [1, 3, 2, 0]] },
    ] }, 'Con coma, primero se triplica y luego se resta: $3x - 4$. «El triple de la diferencia» multiplica todo: $3(x - 4)$. «Excede en 3» dice que la mitad es la cuarta parte más 3.',
      { hint: 'Lee la frase despacio: ¿qué se hace primero? Lo que se hace al final es lo de afuera.' }),
    play('cinta-ecuacion', 'La cinta de la ecuación', { rounds: [
      { say: 'Uno tiene 2 más que otro y un tercero el doble del primero: suman 34', parts: [[1, 0, 'primero'], [1, 2, 'segundo'], [2, 0, 'tercero']], total: 34, lo: 0, hi: 15 },
      { say: 'Un número excede a otro en 7 y suman 31', parts: [[1, 0, 'menor'], [1, 7, 'mayor']], total: 31, lo: 0, hi: 20 },
    ] }, '$x + (x + 2) + 2x = 4x + 2 = 34$ da $x = 8$. $x + (x + 7) = 31$ da $x = 12$: el mayor es 19.',
      { hint: 'Escribe cada cantidad con la misma x y junta todas las x.' }),
    play('consecutivos', 'Números seguidos', { rounds: [{ k: 3, d: 1, S: 96 }, { k: 4, d: 2, S: 100 }] },
      '$3x + 3 = 96$ da $x = 31$. Pares seguidos: $4x + 12 = 100$ da $x = 22$.',
      { hint: 'El primero es x; cada uno suma lo mismo al anterior.' }),
    play('perimetro-x', 'El rectángulo con perímetro', { rounds: [{ m: 4, P: 40 }, { k: 4, P: 50 }] },
      '$2(x + x + 4) = 40$ da $x = 8$. $2(x + 4x) = 50$ da $x = 5$.',
      { hint: 'Escribe el largo con x y suma los cuatro lados.' }),
    play('despeja-x', 'Despeja x', { rounds: [{ a: 5, b: -3, c: 22, cards: [['+', 3], ['+', -3], ['×', 0.2], ['×', 5]] }] },
      'Primero se quita el $-3$: $5x = 25$; luego se divide entre 5: $x = 5$.',
      { hint: 'Deshaz en orden inverso: lo último que le pasó a la x es lo primero que se quita.' }),
    play('tablero-cifras', 'Plantea con las cifras', { rounds: [{ conds: [{ say: 'las decenas exceden en 3 a las unidades', f: n => X(n) === Y(n) + 3 }, { say: 'sus cifras suman 11', f: n => X(n) + Y(n) === 11 }] }] },
      '$X = Y + 3$ y $X + Y = 11$: $2Y + 3 = 11$, $Y = 4$ y $X = 7$: el 74.',
      { hint: 'Escribe las decenas con la cifra de las unidades.' }),
    play('balanza-cajas', 'Despeja en la balanza', { rounds: [{ title: 'Ecuaciones', items: [{ a: 5, b: 2, c: 2, d: 17 }, { a: 3, b: 1, c: 1, d: 9 }] }] },
      '$5x + 2 = 2x + 17$ da $3x = 15$, $x = 5$. $3x + 1 = x + 9$ da $x = 4$.',
      { hint: 'Quita lo mismo de los dos platillos.' }),
  ]);

  setLesson('pu-ec-2', [
    play('edades-barras', 'Problemas de edades', { rounds: [{ k1: 3, L: 8, k2: 2 }, { k1: 4, L: 5, k2: 3 }] },
      '$3x + 8 = 2(x + 8)$ da $x = 8$. $4x + 5 = 3(x + 5)$ da $x = 10$. Todos envejecen lo mismo.',
      { hint: 'Dentro de L años, los dos tienen L años más.' }),
    play('mezcla-precio', 'La mezcla', { rounds: [
      { a: ['café A', 12000], b: ['café B', 8000], total: 10, target: 10000, step: 1 },
      { a: ['arroz', 3000], b: ['lenteja', 6000], total: 12, target: 4000, step: 1 },
    ] }, '$12\\,000a + 8\\,000(10 - a) = 100\\,000$ da $a = 5$. $3\\,000a + 6\\,000(12 - a) = 48\\,000$ da $a = 8$.',
      { hint: 'El valor de la mezcla es la suma de lo que vale cada parte.' }),
    play('alcancia-monedas', 'La alcancía', { rounds: [{ n: 12, v: [500, 200], total: 4200 }, { n: 15, v: [1000, 500], total: 11000 }] },
      '$500k + 200(12 - k) = 4\\,200$ da $k = 6$. $1\\,000k + 500(15 - k) = 11\\,000$ da $k = 7$.',
      { hint: 'Si todas fueran de la menor, ¿cuánto faltaría? Cada moneda grande aporta la diferencia.' }),
    play('balanza-promedio', 'La mezcla como promedio', { rounds: [{ groups: [{ lab: 'jugo de 2 mil', n: 2, mean: 2 }, { lab: 'jugo de 5 mil', n: 4, mean: 5 }], lo: 0, hi: 6 }] },
      'El precio de la mezcla es un promedio ponderado: $\\tfrac{2 \\cdot 2 + 4 \\cdot 5}{6} = 4$ mil el litro.',
      { hint: 'Hay más litros del caro: el precio se acerca a 5.' }),
    play('encuentro-caminantes', 'El encuentro', { rounds: [{ A: [50, 0], B: [30, 120], max: 10 }] },
      '$50t = 30t + 120$ da $20t = 120$: se encuentran a las 6 horas.',
      { hint: 'Se encuentran cuando están en el mismo punto.' }),
    play('cinta-ecuacion', 'Edades en una cinta', { rounds: [{ say: 'Ana tiene el triple de Luis; en 5 años sumarán 38', parts: [[3, 5, 'Ana en 5 años'], [1, 5, 'Luis en 5 años']], total: 38, lo: 0, hi: 15 }] },
      '$(3x + 5) + (x + 5) = 38$ da $4x = 28$: Luis tiene 7 y Ana 21.',
      { hint: 'Los dos suman 5 años.' }),
    play('rompe-cambios', 'Manda la pelota al planteamiento', { miss: 'escribe todo con una sola x', rounds: [{ title: 'Problemas', items: [
      { ask: 'Padre 30, hijo 6: ¿en cuántos años el padre tendrá el triple?', options: ['6', '4', '8'], answer: 0 },
      { ask: '10 monedas de 200 y 500 suman 3 500: de 500 hay…', options: ['5', '3', '7'], answer: 0 },
      { ask: '2 kg a 4 000 y 2 kg a 6 000: el kilo de la mezcla', options: ['5 000', '10 000', '4 500'], answer: 0 },
    ] }] }, '$30 + t = 3(6 + t)$ da $t = 6$. $500k + 200(10 - k) = 3\\,500$ da $k = 5$. Partes iguales: el promedio, 5 000.',
      { hint: 'Plantea antes de lanzar.' }),
  ]);

  setLesson('pu-ec-3', [
    play('dos-rectas', 'El cruce de las dos rectas', { rounds: [{ e1: [1, 1, 7], e2: [1, -1, 1] }, { e1: [2, 1, 8], e2: [1, -1, 1] }] },
      'El punto que cumple las dos está en el cruce: $(4, 3)$ y $(3, 2)$.',
      { hint: 'Desliza el punto por una recta hasta que caiga en la otra.' }),
    play('elimina-variable', 'Elimina una incógnita', { rounds: [{ e1: [4, 3, 18], e2: [1, 1, 5] }] },
      'Con $k = -3$: $4x + 3y - 3(x + y) = 18 - 15$ da $x = 3$, y luego $y = 2$.',
      { hint: 'Busca el número que deja los coeficientes de y opuestos.' }),
    play('dos-compras', 'Dos recibos', { rounds: [{ names: ['pan', 'leche'], e1: [3, 1, 9], e2: [1, 1, 5], max: 8 }] },
      'Del primer recibo al segundo cambian 2 panes y 4 mil: cada pan vale 2 y la leche 3.',
      { hint: 'Compara los dos recibos: ¿qué cambia de uno al otro?' }),
    play('espejo-desigualdad', 'El signo se voltea', { rounds: [{ op: '×', a: 1, b: 4, target: -3 }, { op: '+', a: -2, b: 3, target: 1 }] },
      'Multiplicar por $-3$ voltea el orden: $1 < 4$ pero $-3 > -12$. Sumar 3 no lo cambia.',
      { hint: 'Fíjate en el signo entre las dos imágenes.' }),
    play('intervalo-solucion', 'Pinta la solución', { rounds: [
      { tex: '2x + 1 > 7', f: x => 2 * x + 1 > 7, lo: -5, hi: 6 },
      { tex: '-3x + 2 \\le 8', f: x => -3 * x + 2 <= 8, lo: -5, hi: 5 },
      { tex: '4 - 2x \\ge -2', f: x => 4 - 2 * x >= -2, lo: -2, hi: 8 },
    ] }, '$2x > 6$: $x > 3$. $-3x \\le 6$: al dividir entre $-3$ se voltea, $x \\ge -2$. $-2x \\ge -6$: $x \\le 3$.',
      { hint: 'Despeja como una ecuación; si divides entre un negativo, voltea el signo.' }),
    play('rectangulo-pa', 'Perímetro y área a la vez', { rounds: [{ P: 22, A: 30, max: 11 }] },
      'Ancho más largo es 11 y su producto 30: 5 y 6.',
      { hint: 'Dos números que suman la mitad del perímetro.' }),
    play('vuela-precios', 'Vuela a la solución', { rounds: [{ title: 'Sistemas', items: [
      { ask: 'x + y = 9 y x − y = 3: x vale', options: ['6', '3', '9'], answer: 0 },
      { ask: '−2x < 6, entonces…', options: ['x > −3', 'x < −3', 'x > 3'], answer: 0 },
      { ask: '2 cuadernos + 1 lápiz = 7; 1 cuaderno + 1 lápiz = 4. Cuaderno', options: ['3', '1', '4'], answer: 0 },
    ] }] }, 'Sumando: $2x = 12$. Dividir entre $-2$ voltea: $x > -3$. Restando los recibos, el cuaderno vale 3.',
      { hint: 'Suma o resta las ecuaciones para que se vaya una letra.' }),
  ]);

  setExam('pu-ecuaciones', 'Ecuaciones y planteamiento', [
    ['pu-ec-1', 'Cada cantidad se escribe con la misma x.',
      play('cinta-ecuacion', 'Cinta', { rounds: [{ say: 'Uno tiene 5 más que otro y suman 27', parts: [[1, 0, 'menor'], [1, 5, 'mayor']], total: 27, lo: 0, hi: 20 }] }, '$2x + 5 = 27$: $x = 11$.', { hint: 'Junta las x.' })],
    ['pu-ec-1', 'Seguidos: el primero es x y los demás suman 1.',
      play('consecutivos', 'Seguidos', { rounds: [{ k: 3, d: 1, S: 57 }] }, '$3x + 3 = 57$: $x = 18$.', { hint: 'x, x + 1, x + 2.' })],
    ['pu-ec-2', 'En una mezcla, cantidad × precio de cada parte suma el valor total.',
      play('mezcla-precio', 'Mezcla', { rounds: [{ a: ['té A', 10000], b: ['té B', 4000], total: 6, target: 6000, step: 1 }] }, '$10a + 4(6 - a) = 36$: $a = 2$.', { hint: 'Valor total.' })],
    ['pu-ec-2', 'En monedas, número × valor de cada tipo.',
      play('alcancia-monedas', 'Monedas', { rounds: [{ n: 8, v: [500, 100], total: 2800 }] }, '$500k + 100(8 - k) = 2\\,800$: $k = 5$.', { hint: 'Valor total.' })],
    ['pu-ec-3', 'Al dividir entre un negativo, el signo se voltea.',
      play('intervalo-solucion', 'Desigualdad', { rounds: [{ tex: '-2x + 3 < 9', f: x => -2 * x + 3 < 9, lo: -6, hi: 4 }] }, '$-2x < 6$: $x > -3$.', { hint: 'Voltea.' })],
    ['pu-ec-3', 'La solución de un sistema es el cruce de las dos rectas.',
      play('dos-rectas', 'Cruce', { rounds: [{ e1: [1, 1, 5], e2: [1, -1, 3] }] }, 'El punto $(4, 1)$.', { hint: 'Cruce.' })],
  ]);
});
