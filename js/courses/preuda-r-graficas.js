// Preuniversitario · mundo 9 «Tablas y gráficas»: lecciones y evaluación (spec 2026-11-18-preuda-razonamiento-completo).
PU_JUEGOS.push(({ setLesson, setExam }) => {
  setLesson('pu-gr-1', [
    play('lee-barras', 'Lee la gráfica con su escala', { rounds: [
      { bars: [['lun', 35], ['mar', 50], ['mié', 20], ['jue', 45]], hi: 60, step: 10, q: 'diff', a: 1, b: 2, max: 60, tstep: 5 },
      { bars: [['A', 120], ['B', 90], ['C', 150]], hi: 160, step: 40, q: 'sum', max: 400, tstep: 20 },
    ] }, 'Martes llega a 50 y miércoles a 20: 30 más. Con rayas de 40 en 40, B queda a un cuarto del camino entre 80 y 120 (90) y C a tres cuartos entre 120 y 160 (150): $120 + 90 + 150 = 360$.',
      { hint: 'Mira cuánto vale cada raya de la escala antes de leer una barra.' }),
    play('arma-barras', 'Pasa la tabla a la gráfica', { rounds: [
      { rows: [['fútbol', 12], ['baloncesto', 7], ['voleibol', 4], ['tenis', 9]], hi: 14, step: 2, snap: 1 },
      { rows: [['2022', 150], ['2023', 225], ['2024', 300]], hi: 350, step: 50, snap: 25 },
    ] }, 'Cada barra llega a su dato: con rayas de 2 en 2, el 7 y el 9 quedan entre dos rayas; con rayas de 50, el 225 queda en la mitad entre 200 y 250.',
      { hint: 'Cuenta cuánto vale cada raya y cuántas necesitas para llegar al dato.' }),
    play('mayor-subida', 'El tramo que más cambia', { rounds: [
      { pts: [['ene', 20], ['feb', 26], ['mar', 24], ['abr', 33], ['may', 35]], hi: 40, step: 10, q: 'up' },
      { pts: [['L', 4], ['M', 10], ['X', 20], ['J', 34]], hi: 40, step: 10, q: 'pct' },
      { pts: [['1', 50], ['2', 44], ['3', 30], ['4', 28], ['5', 20]], hi: 60, step: 10, q: 'down' },
    ] }, 'De marzo a abril sube 9, lo que más. En porcentaje gana el primer tramo: de 4 a 10 es +150 %, aunque de 20 a 34 suba más unidades (+70 %). La mayor bajada es de 44 a 30: −14.',
      { hint: 'Para el porcentaje, compara lo que cambió con el valor de partida de ese tramo.' }),
    play('variacion-barras', 'La variación porcentual', { rounds: [{ from: 40, to: 50, what: 'Visitas' }, { from: 80, to: 60, what: 'Precio' }, { from: 30, to: 75, what: 'Seguidores' }] },
      'El cambio se mide sobre lo de antes: $\\tfrac{10}{40} = 25\\%$ de aumento; $\\tfrac{-20}{80} = -25\\%$; $\\tfrac{45}{30} = 150\\%$ de aumento.',
      { hint: 'La barra de antes es el 100 %: ¿cuántas rayas de 10 % hay que agregar o quitar?' }),
    play('rueda-porcentaje', 'La gráfica circular', { rounds: [{ part: 18, whole: 120 }, { part: 63, whole: 90 }], tol: 1 },
      'Cada sector es su parte del total: $\\tfrac{18}{120} = 15\\%$ y $\\tfrac{63}{90} = 70\\%$.',
      { hint: 'Divide la parte entre el total y multiplica por 100.' }),
    play('cruz-porcentaje', 'De la gráfica a la cantidad', { problems: [
      { text: 'El 30 % de 120 encuestados prefiere rock. ¿Cuántos son?', chips: [{ label: '30', cell: 'p' }, { label: '120', cell: 'C' }, { label: '?', cell: 'B' }, { label: '90', cell: null }] },
      { text: '18 de los 60 estudiantes llegan a pie. ¿Qué porcentaje es?', chips: [{ label: '?', cell: 'p' }, { label: '60', cell: 'C' }, { label: '18', cell: 'B' }, { label: '42', cell: null }] },
    ] }, 'El total va con el 100 % y la parte con su porcentaje: $120 \\cdot 0.30 = 36$ y $\\tfrac{18}{60} = 30\\%$.',
      { hint: 'El total de encuestados es el 100 %; la parte que se pregunta va enfrente de su porcentaje.' }),
    play('vuela-precios', 'Vuela a la lectura correcta', { rounds: [{ title: 'Gráficas', items: [
      { ask: 'En una torta, un sector de 90° es…', options: ['25 %', '90 %', '9 %'], answer: 0 },
      { ask: 'De 200 a 150, el cambio es…', options: ['−25 %', '−50 %', '+25 %'], answer: 0 },
      { ask: 'Barras de 30 y 45: la segunda tiene…', options: ['15 más', '45 más', '75 más'], answer: 0 },
    ] }] }, '$\\tfrac{90}{360} = 25\\%$. $\\tfrac{-50}{200} = -25\\%$. $45 - 30 = 15$.',
      { hint: 'Torta: compara con 360°. Cambio: divide entre lo de antes.' }),
  ]);

  setLesson('pu-gr-2', [
    play('nivela-datos', 'El promedio es nivelar', { rounds: [{ data: [4, 9, 6, 3, 8], hi: 10, step: 2 }, { data: [12, 5, 9, 10], hi: 14, step: 2 }, { data: [7, 2, 5, 4], hi: 8, step: 2 }] },
      'El promedio deja todo parejo: $\\tfrac{30}{5} = 6$, $\\tfrac{36}{4} = 9$ y $\\tfrac{18}{4} = 4.5$. Ahí lo que sobra arriba llena justo lo que falta abajo.',
      { hint: 'Si sobra más de lo que falta, la línea está muy baja.' }),
    play('ordena-mediana', 'La mediana pide orden', { rounds: [{ data: [8, 3, 5, 8, 1, 6, 4] }, { data: [12, 7, 9, 15, 7, 10] }] },
      'Ordenados: 1, 3, 4, **5**, 6, 8, 8 (mediana 5). Con seis datos, 7, 7, **9, 10**, 12, 15: se promedian los dos del medio, 9.5.',
      { hint: 'Escribe cada dato tantas veces como aparece, de menor a mayor.' }),
    play('tres-centros', 'Media, mediana y moda', { rounds: [{ data: [2, 3, 3, 3, 4, 5, 8, 12], lo: 0, hi: 12 }, { data: [1, 5, 6, 6, 7], lo: 0, hi: 8 }] },
      'En la primera: media $\\tfrac{40}{8} = 5$, mediana $\\tfrac{3 + 4}{2} = 3.5$ y moda 3: el 12 jala la media hacia la derecha. En la segunda: media 5, mediana 6, moda 6: el 1 la jala a la izquierda.',
      { hint: 'La moda es la pila más alta; la mediana, el dato del medio; la media, la suma entre la cantidad.' }),
    play('dato-faltante', 'El dato que falta', { rounds: [{ data: [6, 8, null, 7], mean: 8, hi: 12, step: 1 }, { data: [40, null, 55, 45, 50], mean: 50, hi: 80, step: 5 }] },
      'La suma tiene que ser promedio por cantidad: $8 \\cdot 4 = 32$ y faltan $32 - 21 = 11$; $50 \\cdot 5 = 250$ y faltan $250 - 190 = 60$.',
      { hint: 'Multiplica el promedio por la cantidad de datos y resta lo que ya tienes.' }),
    play('balanza-promedio', 'El promedio de todos juntos', { rounds: [
      { groups: [{ lab: 'A', n: 6, mean: 3 }, { lab: 'B', n: 2, mean: 7 }], lo: 0, hi: 10 },
      { groups: [{ lab: 'mañana', n: 2, mean: 9 }, { lab: 'tarde', n: 5, mean: 3 }, { lab: 'noche', n: 1, mean: 7 }], lo: 0, hi: 10 },
    ] }, 'Cada grupo pesa según cuántos son: $\\tfrac{6 \\cdot 3 + 2 \\cdot 7}{8} = 4$, no 5 (el promedio de los promedios). Y $\\tfrac{18 + 15 + 7}{8} = 5$.',
      { hint: 'El grupo con más personas jala más el apoyo hacia su lado.' }),
    play('nivela-barras', 'Nivela una escalera de datos', { rounds: [{ a1: 2, d: 3, n: 5 }] },
      'Datos que suben parejo tienen el promedio en el medio: $\\tfrac{2 + 14}{2} = 8$, y suman $5 \\cdot 8 = 40$.',
      { hint: 'Lo que sobra en la barra más alta llena lo que falta en la más baja.' }),
    play('rompe-cambios', 'Manda la pelota al centro correcto', { miss: 'ordena los datos antes de buscar la mediana', rounds: [{ title: 'Centros', items: [
      { ask: 'Promedio de 4, 6 y 11', options: ['7', '6', '21'], answer: 0 },
      { ask: 'Mediana de 9, 2, 7, 4, 10', options: ['7', '4', '6.4'], answer: 0 },
      { ask: 'Moda de 3, 5, 5, 2, 3, 5', options: ['5', '3', '4'], answer: 0 },
    ] }] }, '$\\tfrac{21}{3} = 7$. Ordenados 2, 4, 7, 9, 10: mediana 7. El 5 aparece tres veces: moda 5.',
      { hint: 'Promedio: suma y divide. Mediana: ordena. Moda: el que más se repite.' }),
  ]);

  const G1 = ['1111110000', '1111100000', '1111110000', '1111000000', '1111100000', '1111110000', '1111100000', '1111000000', '1111100000', '1111110000'];
  const G2 = ['1111111111', '1111111111', '1111111111', '1111111111', '1111100000', '0000000000', '0010000100', '0000000000', '0000010000', '0000000000'];
  setLesson('pu-gr-3', [
    play('muestra-sesgo', 'La muestra que representa', { rounds: [{ grid: G1, w: 4, h: 5, tol: 5 }, { grid: G2, w: 5, h: 4, tol: 5 }] },
      'Una muestra tomada en un solo rincón engaña: en la primera cuadrícula el «sí» está a la izquierda y en la segunda arriba. La muestra se parece al pueblo cuando toma de las dos zonas.',
      { hint: 'Pon el marco donde quede gente de los dos lados de la frontera.' }),
    play('eje-engano', 'El eje que engaña', { rounds: [{ a: ['marca A', 55], b: ['marca B', 50], floor: 45 }, { a: ['2024', 84], b: ['2023', 70], floor: 60 }] },
      'Con el eje cortado, A parece el doble de B, pero $\\tfrac{55 - 50}{50} = 10\\%$ más. Y 84 frente a 70 es $\\tfrac{14}{70} = 20\\%$ más.',
      { hint: 'Baja el piso a 0 para ver las barras de verdad; el porcentaje se calcula con los números, no con el dibujo.' }),
    play('tabla-doble', 'Más gente no es más proporción', { rounds: [
      { rows: [['colegio A', 18, 30], ['colegio B', 28, 70]], what: 'usa bicicleta' },
      { rows: [['barrio norte', 45, 60], ['barrio sur', 33, 55]], what: 'recicla' },
    ] }, 'En B son más (28 frente a 18), pero en proporción gana A: 60 % frente a 40 %. Y en el norte, 75 % frente a 60 % en el sur.',
      { hint: 'Divide cada «sí» entre el total de su grupo, no entre el total de todos.' }),
    play('lee-barras', 'Lee con el eje cortado', { rounds: [{ bars: [['Ana', 82], ['Beto', 78], ['Caro', 86]], lo: 70, hi: 90, step: 5, q: 'diff', a: 2, b: 1, max: 20, tstep: 1 }] },
      'La barra de Caro parece el doble de la de Beto, pero el eje empieza en 70: la diferencia real es $86 - 78 = 8$.',
      { hint: 'Lee los números del eje, no la altura del dibujo.' }),
    play('variacion-barras', '¿Se duplicó o no?', { rounds: [{ from: 120, to: 180, what: 'Ventas' }, { from: 200, to: 50, what: 'Llamadas' }] },
      'De 120 a 180 es +50 %, no el doble (eso sería +100 %). De 200 a 50 es −75 %: quedó la cuarta parte.',
      { hint: 'Duplicar es +100 %; quedar en la mitad es −50 %.' }),
    play('pinta-personas', 'La muestra en porcentaje', { rounds: [{ total: 40, pct: 35, what: 'prefieren la radio' }, { total: 25, pct: 44, what: 'llegan en bus' }] },
      'El porcentaje es de cada 100: $40 \\cdot 0.35 = 14$ y $25 \\cdot 0.44 = 11$.',
      { hint: 'Halla cuánto por ciento vale cada persona del grupo.' }),
    play('tanque-porcentaje', 'Llena el tanque al porcentaje', { rounds: [{ title: 'Litros', items: [{ cap: 120, pct: 25, step: 5 }, { cap: 60, pct: 40, step: 3 }] }] },
      'El 25 % de 120 es 30 litros y el 40 % de 60 es 24.',
      { hint: 'El tanque lleno es el 100 %: parte la capacidad en cien y toma las que pide.' }),
  ]);

  setExam('pu-graficas', 'Tablas y gráficas', [
    ['pu-gr-1', 'Antes de leer una barra, mira cuánto vale cada raya de la escala.',
      play('lee-barras', 'Escala', { rounds: [{ bars: [['X', 60], ['Y', 25], ['Z', 40]], hi: 80, step: 20, q: 'diff', a: 0, b: 1, max: 60, tstep: 5 }] }, '$60 - 25 = 35$.', { hint: 'Rayas.' })],
    ['pu-gr-1', 'El cambio porcentual se mide sobre el valor de partida.',
      play('mayor-subida', 'Tramo', { rounds: [{ pts: [['1', 5], ['2', 12], ['3', 25], ['4', 36]], hi: 40, step: 10, q: 'pct' }] }, 'De 5 a 12 es +140 %, el mayor.', { hint: 'Porcentaje.' })],
    ['pu-gr-2', 'El promedio es el nivel donde sobra lo mismo que falta.',
      play('nivela-datos', 'Promedio', { rounds: [{ data: [3, 10, 7, 4], hi: 12, step: 2 }] }, '$\\tfrac{24}{4} = 6$.', { hint: 'Nivela.' })],
    ['pu-gr-2', 'Con datos cargados a un lado, media, mediana y moda no coinciden.',
      play('tres-centros', 'Centros', { rounds: [{ data: [1, 2, 2, 2, 3, 8], lo: 0, hi: 8 }] }, 'Media 3, mediana 2, moda 2.', { hint: 'Tres.' })],
    ['pu-gr-2', 'La suma de los datos es promedio por cantidad.',
      play('dato-faltante', 'Falta', { rounds: [{ data: [9, null, 6], mean: 7, hi: 12, step: 1 }] }, '$21 - 15 = 6$.', { hint: 'Suma.' })],
    ['pu-gr-3', 'Para comparar grupos de distinto tamaño se usan porcentajes.',
      play('tabla-doble', 'Grupos', { rounds: [{ rows: [['grupo 1', 12, 40], ['grupo 2', 9, 20]], what: 'aprobó' }] }, '30 % frente a 45 %.', { hint: 'Proporción.' })],
    ['pu-gr-3', 'Un eje que no empieza en cero exagera las diferencias.',
      play('eje-engano', 'Eje', { rounds: [{ a: ['A', 63], b: ['B', 60], floor: 55 }] }, '$\\tfrac{3}{60} = 5\\%$.', { hint: 'Números.' })],
  ]);
});
