// Preuniversitario · mundo 1 «Cálculo mental»: evaluación del mundo (las lecciones ya tienen sus juegos en preuda-razonamiento.js;
// spec 2026-11-18-preuda-mundo-1 y 2026-11-18-preuda-razonamiento-completo).
PU_JUEGOS.push(({ setExam }) => {
  setExam('pu-calculo', 'Cálculo mental', [
    ['pu-cm-1', 'Multiplicar por un negativo refleja la flecha en el 0.',
      play('voltea-flecha', 'Signos', { rounds: [{ a: -3, target: 12 }] }, '$(-3)(-4) = 12$: dos negativos dan positivo.', { hint: 'Voltea.' })],
    ['pu-cm-1', 'Primero paréntesis, luego potencias, luego × y ÷, al final + y −.',
      play('capas-operacion', 'Capas', { rounds: [{ title: 'Jerarquía', items: [{ expr: '8 - 3 * ( 2 - 5 )' }] }] }, '$8 - 3(-3) = 8 + 9 = 17$.', { hint: 'Paréntesis primero.' })],
    ['pu-cm-2', 'Solo se suman pedazos del mismo tamaño.',
      play('corta-igual', 'Fracciones', { rounds: [{ a: [2, 5], b: [1, 2] }] }, '$\\tfrac{4}{10} + \\tfrac{5}{10} = \\tfrac{9}{10}$.', { hint: 'Denominador común.' })],
    ['pu-cm-2', 'Entre dos números distintos siempre cabe otro.',
      play('lupa-densidad', 'Densidad', { rounds: [{ a: { label: '2/5', value: 0.4 }, b: { label: '0.42', value: 0.42 }, view: [0, 1] }] }, 'Entre 0.40 y 0.42 está, por ejemplo, 0.41.', { hint: 'Pasa a decimal.' })],
    ['pu-cm-3', 'Un porcentaje es una parte de cien.',
      play('cuadricula-cien', 'Cuadrícula', { rounds: [{ ask: '3/4', count: 75 }] }, '$\\tfrac34 = \\tfrac{75}{100}$: 75 casillas.', { hint: 'De cien.' })],
    ['pu-cm-3', 'Qué porcentaje es A de B: A ÷ B × 100.',
      play('rueda-porcentaje', 'Rueda', { rounds: [{ part: 27, whole: 90 }], tol: 1 }, '$\\tfrac{27}{90} = 0.3$: el 30 %.', { hint: 'Parte entre todo.' })],
    ['pu-cm-4', 'Una potencia repite la base tantas veces como dice el exponente.',
      play('arbol-potencia', 'Potencia', { rounds: [{ target: 125 }] }, '$125 = 5^3$.', { hint: 'Ramas y niveles.' })],
    ['pu-cm-4', 'La raíz cuadrada es el lado del cuadrado de esa área.',
      play('lado-del-cuadrado', 'Raíz', { rounds: [{ area: 36 }], max: 10, step: 0.05, tol: 0.05 }, '$\\sqrt{36} = 6$.', { hint: 'Lado por lado.' })],
  ]);
});
