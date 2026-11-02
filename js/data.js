// Contenido de Zuka: cursos → unidades → lecciones. Cada lección = 1 clip vertical + ejercicios.
// Álgebra y Trigonometría viven en js/courses/; las ayudas para escribir contenido, en js/content.js.

const COURSES = [
  COURSE_ALGEBRA,
  COURSE_TRIG,
  {
    id: 'calc', level: 'Semestre 1', name: 'Cálculo Diferencial', icon: 'dx', color: '#f472b6',
    tagline: 'Límites y derivadas: cómo cambian las cosas.',
    units: [
      {
        title: 'Límites',
        lessons: [
          {
            id: 'calc-1', title: '¿Qué es un límite?',
            clip: { scenes: [
              sc(5, '¿Cuánto vale $f(x) = \\dfrac{x^2 - 1}{x - 1}$ en $x = 1$? ¡División entre cero!', { viz: { type: 'graph', xr: [-1, 3], yr: [-1, 4], f: x => (x * x - 1) / (x - 1), holes: [[1, 2]], draw: true } }),
              sc(6, 'Pero podemos acercarnos tanto como queramos, por la izquierda y por la derecha.', { viz: { type: 'approach', f: x => (x * x - 1) / (x - 1), x0: 1, L: 2, xr: [-1, 3], yr: [-1, 4] } }),
              sc(5, 'Factoriza y simplifica:', { title: '$\\lim_{x \\to 1} \\dfrac{x^2 - 1}{x - 1} = 2$', steps: ['$\\dfrac{x^2 - 1}{x - 1} = \\dfrac{(x - 1)(x + 1)}{x - 1}$', '$= x + 1 \\;\\to\\; 2$'] }),
            ] },
            ex: [
              num('$\\lim_{x \\to 2} (3x + 1) = \\;?$', 7, 'Es continua: sustituye, $3(2) + 1 = 7$.'),
              num('$\\lim_{x \\to 1} \\dfrac{x^2 - 1}{x - 1} = \\;?$', 2, 'Simplifica a $x + 1$ y evalúa en $x = 1$.'),
              mc('$\\lim_{x \\to \\infty} \\dfrac{1}{x} = \\;?$', ['$0$', '$1$', '$\\infty$', 'No existe'], 0, 'Al crecer $x$, $1/x$ se hace tan pequeño como quieras.'),
              mc('El límite describe…', ['A qué valor se acerca $f(x)$ cuando $x$ se acerca a un punto', 'El valor de $f$ exactamente en ese punto', 'La pendiente de una recta', 'El área bajo la curva'], 0, 'El límite no necesita que $f$ esté definida en el punto.'),
            ],
          },
          {
            id: 'calc-2', title: 'Límites al infinito',
            clip: { scenes: [
              sc(5, '¿Qué pasa con $f(x) = \\dfrac{2x + 1}{x}$ cuando $x$ crece sin parar?', { viz: { type: 'graph', xr: [0, 20], yr: [0, 6], fs: [{ f: x => (2 * x + 1) / x }, { f: () => 2, color: 'rgba(255,255,255,.4)', dash: true }], draw: true } }),
              sc(5, 'Divide entre la mayor potencia de $x$:', { steps: ['$\\dfrac{2x + 1}{x} = 2 + \\dfrac{1}{x}$', '$\\dfrac{1}{x} \\to 0$', '$\\Rightarrow \\lim = 2$'] }),
              sc(5, 'La recta $y = 2$ es una **asíntota horizontal**.', { title: '$y = 2$', viz: { type: 'graph', xr: [0, 20], yr: [0, 6], fs: [{ f: x => (2 * x + 1) / x }, { f: () => 2, color: '#facc15', dash: true }] } }),
            ] },
            ex: [
              num('$\\lim_{x \\to \\infty} \\dfrac{3x^2 + 1}{x^2} = \\;?$', 3, '$3 + \\tfrac{1}{x^2} \\to 3$.'),
              mc('$\\lim_{x \\to \\infty} \\dfrac{5x}{x^2 + 1} = \\;?$', ['$0$', '$5$', '$\\infty$', '$1$'], 0, 'El denominador crece más rápido (grado 2 > grado 1).'),
              mc('Una asíntota horizontal $y = L$ significa que…', ['$f(x) \\to L$ cuando $x \\to \\pm\\infty$', '$f(L)$ no existe', '$f$ corta a $y = L$ exactamente una vez', '$f$ es constante'], 0, 'Describe el comportamiento de $f$ lejos del origen.'),
            ],
          },
        ],
      },
      {
        title: 'Derivadas',
        lessons: [
          {
            id: 'calc-3', title: 'La derivada como pendiente',
            clip: { scenes: [
              sc(5, '¿Cuál es la pendiente de una curva en un punto? Empezamos con una **secante**.', { viz: { type: 'tangent', f: sq, x0: 1, xr: [-1, 3], yr: [-1, 6], h0: 1.5, h1: 1.5 } }),
              sc(6, 'Acerca el segundo punto: la secante se convierte en **tangente**.', { viz: { type: 'tangent', f: sq, x0: 1, xr: [-1, 3], yr: [-1, 6], h0: 1.5 } }),
              sc(6, 'Esa pendiente límite es la derivada. Para $x^2$:', { title: "$f'(x) = \\lim_{h \\to 0} \\dfrac{f(x + h) - f(x)}{h}$", steps: ['$\\dfrac{(x + h)^2 - x^2}{h} = \\dfrac{2xh + h^2}{h}$', '$= 2x + h \\;\\to\\; 2x$'] }),
            ] },
            ex: [
              sld('Mueve el punto hasta donde la tangente a $y = x^2$ tenga pendiente $4$', {
                viz: { type: 'tangent', f: sq, xr: [-3, 3], yr: [-2, 9] }, min: -2.5, max: 2.5, step: 0.5, init: -1,
                readout: v => `$x_0 = ${v}$`, check: v => near(v, 2), answerText: '$x_0 = 2$', explain: "$f'(x) = 2x = 4 \\Rightarrow x = 2$.",
              }),
              num('Pendiente de la tangente a $y = x^2$ en $x = 3$', 6, "$f'(x) = 2x$, así que $f'(3) = 6$."),
              mc("La derivada $f'(a)$ representa…", ['La pendiente de la tangente en $x = a$', 'El área bajo $f$', 'El valor de $f$ en $a$', 'La pendiente de la secante entre 0 y $a$'], 0, 'Es la razón de cambio instantánea en $x = a$.'),
            ],
          },
          {
            id: 'calc-4', title: 'Reglas de derivación',
            clip: { scenes: [
              sc(5, 'No necesitas el límite cada vez. **Regla de la potencia**:', { title: '$\\dfrac{d}{dx} x^n = n\\,x^{n-1}$', steps: ['$\\dfrac{d}{dx} x^3 = 3x^2$', '$\\dfrac{d}{dx} x^5 = 5x^4$'] }),
              sc(5, 'Las constantes salen y las sumas se derivan término a término.', { steps: ['$\\dfrac{d}{dx}(3x^2 + 2x) = 6x + 2$'] }),
              sc(4, 'Seno y coseno:', { steps: ["$(\\sin x)' = \\cos x$", "$(\\cos x)' = -\\sin x$"] }),
              sc(6, '**Regla de la cadena**: deriva por fuera y multiplica por la derivada de adentro.', { steps: ['$\\dfrac{d}{dx}(2x + 1)^3$', '$= 3(2x + 1)^2 \\cdot 2$', '$= 6(2x + 1)^2$'] }),
            ] },
            ex: [
              mc('$\\dfrac{d}{dx} x^5$', ['$5x^4$', '$x^4$', '$5x^5$', '$4x^5$'], 0, 'Regla de la potencia: baja el exponente y réstale 1.'),
              num("Si $f(x) = 3x^2 + 2x$, ¿cuánto vale $f'(1)$?", 8, "$f'(x) = 6x + 2 \\Rightarrow f'(1) = 8$."),
              mc('$\\dfrac{d}{dx} \\sin x$', ['$\\cos x$', '$-\\cos x$', '$-\\sin x$', '$\\tan x$'], 0, 'La derivada del seno es el coseno.'),
              mc('$\\dfrac{d}{dx}(2x + 1)^3$', ['$6(2x + 1)^2$', '$3(2x + 1)^2$', '$(2x + 1)^2$', '$6(2x + 1)^3$'], 0, 'Regla de la cadena: $3(2x + 1)^2 \\cdot 2$.'),
            ],
          },
          {
            id: 'calc-5', title: 'Máximos y mínimos',
            clip: { scenes: [
              sc(6, 'En la cima de una montaña, la tangente es **horizontal**.', { viz: { type: 'tangent', f: x => -x * x + 4 * x, x0anim: [0.2, 3.8], xr: [-1, 5], yr: [-2, 6] } }),
              sc(5, 'Busca dónde la derivada vale cero:', { steps: ['$f(x) = -x^2 + 4x$', "$f'(x) = -2x + 4 = 0$", '$x = 2$'] }),
              sc(5, 'Así se optimiza en ingeniería: máxima área, mínimo costo, máxima eficiencia.', { viz: { type: 'graph', f: x => -x * x + 4 * x, xr: [-1, 5], yr: [-2, 6], points: [[2, 4, 'máx (2, 4)']] } }),
            ] },
            ex: [
              sld('Mueve el punto hasta donde la tangente sea horizontal (el máximo de $f(x) = -x^2 + 4x$)', {
                viz: { type: 'tangent', f: x => -x * x + 4 * x, xr: [-1, 5], yr: [-2, 6] }, min: -0.5, max: 4.5, step: 0.5, init: 0.5,
                readout: v => `$x_0 = ${v}$`, check: v => near(v, 2), answerText: '$x = 2$', explain: "$f'(x) = -2x + 4 = 0 \\Rightarrow x = 2$.",
              }),
              num('¿En qué $x$ tiene su mínimo $f(x) = x^2 - 6x + 1$?', 3, "$f'(x) = 2x - 6 = 0 \\Rightarrow x = 3$.", { prefix: '$x =$' }),
              mc("Si $f'(a) = 0$ y $f''(a) < 0$, en $x = a$ hay…", ['Un máximo', 'Un mínimo', 'Siempre un punto de inflexión', 'Una discontinuidad'], 0, 'Concavidad hacia abajo con tangente horizontal → máximo.'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'fis', level: 'Semestre 1', name: 'Física Mecánica', icon: 'F', color: '#facc15',
    tagline: 'Movimiento, fuerzas y energía.',
    units: [
      {
        title: 'Cinemática',
        lessons: [
          {
            id: 'fis-1', title: 'MRU y MRUA',
            clip: { scenes: [
              sc(5, '**MRU**: velocidad constante. La posición crece en línea recta.', { title: '$x = x_0 + v\\,t$', viz: { type: 'graph', xr: [0, 5], yr: [0, 22], f: t => 4 * t, draw: true, ax: ['t (s)', 'x (m)'] } }),
              sc(5, '**MRUA**: la velocidad cambia de forma constante. La gráfica es una parábola.', { title: '$x = x_0 + v_0 t + \\tfrac{1}{2} a t^2$', viz: { type: 'graph', xr: [0, 5], yr: [0, 26], f: t => t * t, draw: true, ax: ['t (s)', 'x (m)'] } }),
              sc(5, 'Y la velocidad crece linealmente con el tiempo.', { title: '$v = v_0 + a\\,t$', viz: { type: 'graph', xr: [0, 5], yr: [0, 12], f: t => 2 * t, draw: true, ax: ['t (s)', 'v (m/s)'] } }),
            ] },
            ex: [
              num('Un auto va a 20 m/s constantes. ¿Qué distancia recorre en 5 s?', 100, '$x = v\\,t = 20 \\cdot 5 = 100$ m.', { suffix: 'm' }),
              num('Parte del reposo con $a = 2$ m/s². ¿Velocidad a los 6 s?', 12, '$v = 0 + 2 \\cdot 6 = 12$ m/s.', { suffix: 'm/s' }),
              num('¿Y qué distancia recorrió en esos 6 s?', 36, '$x = \\tfrac{1}{2} \\cdot 2 \\cdot 6^2 = 36$ m.', { suffix: 'm' }),
              mc('En el MRU la aceleración es…', ['Cero', 'Constante y positiva', 'Igual a la velocidad', 'Igual a $g$'], 0, 'Velocidad constante ⇒ no hay aceleración.'),
            ],
          },
          {
            id: 'fis-2', title: 'Tiro parabólico',
            clip: { scenes: [
              sc(6, 'Un proyectil combina **dos movimientos**: MRU en $x$ y caída libre en $y$.', { viz: { type: 'projectile', v0: 20, ang: 50 } }),
              sc(5, 'Cambia el ángulo y cambia el alcance.', { viz: { type: 'projectile', v0: 20, anim: [15, 75] } }),
              sc(5, 'Sin resistencia del aire, el alcance máximo se logra a 45°.', { title: '$R = \\dfrac{v_0^2 \\sin 2\\theta}{g}$', viz: { type: 'projectile', v0: 20, ang: 45 } }),
            ] },
            ex: [
              sld('Ajusta el ángulo de lanzamiento para lograr el **máximo alcance**', {
                viz: { type: 'projectile', v0: 20 }, min: 10, max: 80, step: 5, init: 20,
                readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 45, answerText: '$\\theta = 45^\\circ$',
                explain: '$\\sin 2\\theta$ es máximo cuando $2\\theta = 90^\\circ$.',
              }),
              mc('En el punto más alto de la trayectoria, la velocidad vertical es…', ['Cero', 'Máxima', 'Igual a $v_0$', 'Igual a $g$'], 0, 'Deja de subir y empieza a bajar: $v_y = 0$.'),
              num('Caída libre desde 20 m con $g = 10$ m/s². ¿Tiempo en llegar al suelo?', 2, '$20 = \\tfrac{1}{2} \\cdot 10\\,t^2 \\Rightarrow t = 2$ s.', { suffix: 's' }),
            ],
          },
        ],
      },
      {
        title: 'Dinámica',
        lessons: [
          {
            id: 'fis-3', title: 'Leyes de Newton',
            clip: { scenes: [
              sc(5, '**1ª ley**: sin fuerza neta, un cuerpo mantiene su velocidad.', { title: '$\\sum \\vec F = 0 \\Rightarrow \\vec v = \\text{cte}$', viz: { type: 'push', F: 0 } }),
              sc(5, '**2ª ley**: la fuerza neta produce aceleración.', { title: '$\\sum \\vec F = m\\,\\vec a$', viz: { type: 'push', F: 10, m: 2 } }),
              sc(5, '**3ª ley**: a toda acción corresponde una reacción igual y opuesta.', { viz: { type: 'push', pair: true } }),
            ] },
            ex: [
              num('Una masa de 5 kg acelera a 3 m/s². ¿Fuerza neta?', 15, '$F = m\\,a = 5 \\cdot 3 = 15$ N.', { suffix: 'N' }),
              sld('Ajusta la fuerza para que el bloque de 4 kg acelere a $2$ m/s²', {
                viz: { type: 'push', m: 4 }, min: 0, max: 20, step: 1, init: 2,
                readout: v => `$F = ${v}$ N`, check: v => v === 8, answerText: '$F = 8$ N', explain: '$F = m\\,a = 4 \\cdot 2 = 8$ N.',
              }),
              num('¿Cuánto pesa un objeto de 10 kg? ($g = 9.8$ m/s²)', 98, '$W = m\\,g = 98$ N.', { suffix: 'N' }),
              mc('Si empujas una pared con 50 N, la pared te empuja con…', ['50 N en sentido contrario', '0 N', 'Más de 50 N', 'Menos de 50 N'], 0, 'Tercera ley de Newton.'),
            ],
          },
          {
            id: 'fis-4', title: 'Plano inclinado',
            clip: { scenes: [
              sc(5, 'Un bloque sobre un plano inclinado. ¿Qué fuerzas actúan?', { viz: { type: 'incline', ang: 30 } }),
              sc(6, 'Descompón el peso en una parte paralela y otra perpendicular al plano.', { title: '$mg\\sin\\theta \\quad mg\\cos\\theta$', viz: { type: 'incline', ang: 30, comps: true } }),
              sc(5, 'Más inclinación → más componente que lo hace deslizar.', { viz: { type: 'incline', anim: [15, 55], comps: true } }),
            ] },
            ex: [
              sld('Ajusta $\\theta$ para que la componente paralela sea **la mitad** del peso', {
                viz: { type: 'incline', comps: true }, min: 5, max: 60, step: 5, init: 15,
                readout: v => `$\\theta = ${v}^\\circ$`, check: v => v === 30, answerText: '$\\theta = 30^\\circ$',
                explain: '$mg\\sin\\theta = \\tfrac{1}{2} mg \\Rightarrow \\sin\\theta = \\tfrac{1}{2} \\Rightarrow \\theta = 30^\\circ$.',
              }),
              num('Un bloque sin fricción baja por un plano de 30°. ¿Su aceleración? ($g = 10$)', 5, '$a = g \\sin 30^\\circ = 5$ m/s².', { suffix: 'm/s²' }),
              mc('La fuerza normal sobre el bloque vale…', ['$mg\\cos\\theta$', '$mg\\sin\\theta$', '$mg$', '$mg\\tan\\theta$'], 0, 'Equilibra la componente perpendicular del peso.'),
            ],
          },
          {
            id: 'fis-5', title: 'Trabajo y energía',
            clip: { scenes: [
              sc(5, 'La energía del movimiento es la **energía cinética**.', { title: '$E_c = \\tfrac{1}{2} m v^2$', viz: { type: 'graph', xr: [0, 5], yr: [0, 26], f: sq, draw: true, ax: ['v', 'Ec'] } }),
              sc(5, 'La energía por estar a cierta altura es la **potencial gravitatoria**.', { title: '$E_p = m\\,g\\,h$', viz: { type: 'energy' } }),
              sc(6, 'Sin fricción, al caer la potencial se convierte en cinética: la total se conserva.', { title: '$E_c + E_p = \\text{cte}$', viz: { type: 'energy' } }),
            ] },
            ex: [
              num('Energía cinética de una masa de 2 kg a 3 m/s', 9, '$\\tfrac{1}{2} \\cdot 2 \\cdot 3^2 = 9$ J.', { suffix: 'J' }),
              num('Energía potencial de 1 kg a 5 m de altura ($g = 10$)', 50, '$m\\,g\\,h = 1 \\cdot 10 \\cdot 5 = 50$ J.', { suffix: 'J' }),
              num('Un objeto cae desde 5 m ($g = 10$). ¿Con qué velocidad llega al suelo?', 10, '$m g h = \\tfrac{1}{2} m v^2 \\Rightarrow v = \\sqrt{2gh} = 10$ m/s.', { suffix: 'm/s' }),
              mc('Si no hay fricción, al caer la energía potencial…', ['Se convierte en cinética', 'Desaparece', 'Se duplica', 'Permanece igual'], 0, 'Conservación de la energía mecánica.'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'int', level: 'Semestre 2', name: 'Cálculo Integral', icon: '∫', color: '#34d399',
    tagline: 'Acumular cambios: áreas e integrales.',
    units: [
      {
        title: 'La integral',
        lessons: [
          {
            id: 'int-1', title: 'Área bajo la curva',
            clip: { scenes: [
              sc(5, '¿Cuál es el área bajo $y = x^2$ entre 0 y 2? Usemos rectángulos.', { viz: { type: 'riemann', f: sq, a: 0, b: 2, n: [4, 4], xr: [-0.3, 2.4], yr: [-0.5, 4.5] } }),
              sc(6, 'Más rectángulos → mejor aproximación.', { viz: { type: 'riemann', f: sq, a: 0, b: 2, n: [4, 80], xr: [-0.3, 2.4], yr: [-0.5, 4.5], exact: '8/3 ≈ 2.667' } }),
              sc(5, 'En el límite, la suma se vuelve una **integral**.', { title: '$\\displaystyle\\int_0^2 x^2\\,dx = \\dfrac{8}{3}$', viz: { type: 'riemann', f: sq, a: 0, b: 2, n: [300, 300], xr: [-0.3, 2.4], yr: [-0.5, 4.5] } }),
            ] },
            ex: [
              num('$\\displaystyle\\int_0^2 2x\\,dx = \\;?$ (pista: es un triángulo)', 4, 'Triángulo de base 2 y altura 4: área $= \\tfrac{1}{2} \\cdot 2 \\cdot 4 = 4$.'),
              mc('Si $n \\to \\infty$, la suma de Riemann…', ['Tiende al área exacta', 'Tiende a cero', 'Siempre diverge', 'No cambia'], 0, 'Esa es justamente la definición de la integral definida.'),
              sld('El área exacta es $\\tfrac{8}{3} \\approx 2.667$. Elige $n$ para que el error sea menor que $0.1$', {
                viz: { type: 'riemann', f: sq, a: 0, b: 2, xr: [-0.3, 2.4], yr: [-0.5, 4.5], exact: '2.667' }, min: 2, max: 60, step: 1, init: 4,
                readout: v => `$n = ${v}$`, check: v => v >= 40, answerText: '$n \\geq 40$',
                explain: 'Con rectángulos izquierdos el error es $\\tfrac{4}{3}\\cdot\\tfrac{3n - 1}{n^2} \\approx \\tfrac{4}{n}$: necesitas $n \\geq 40$.',
              }),
            ],
          },
          {
            id: 'int-2', title: 'Antiderivadas',
            clip: { scenes: [
              sc(5, 'Integrar es el proceso **inverso** de derivar.', { steps: ['$\\dfrac{d}{dx}\\left(\\tfrac{x^3}{3}\\right) = x^2$', '$\\Rightarrow \\displaystyle\\int x^2\\,dx = \\tfrac{x^3}{3} + C$'] }),
              sc(5, 'Regla de la potencia para integrales:', { title: '$\\displaystyle\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C$', steps: ['$\\displaystyle\\int x^4\\,dx = \\tfrac{x^5}{5} + C$'] }),
              sc(6, '**Teorema fundamental**: evalúa la antiderivada en los extremos.', { title: '$\\displaystyle\\int_a^b f(x)\\,dx = F(b) - F(a)$', steps: ['$\\displaystyle\\int_0^3 x^2\\,dx = \\tfrac{27}{3} - 0 = 9$'] }),
            ] },
            ex: [
              mc('$\\displaystyle\\int x^2\\,dx$', ['$\\tfrac{x^3}{3} + C$', '$2x + C$', '$x^3 + C$', '$\\tfrac{x^2}{2} + C$'], 0, 'Sube el exponente y divide entre el nuevo exponente.'),
              num('$\\displaystyle\\int_0^3 x^2\\,dx = \\;?$', 9, '$\\left[\\tfrac{x^3}{3}\\right]_0^3 = 9$.'),
              mc('$\\displaystyle\\int \\cos x\\,dx$', ['$\\sin x + C$', '$-\\sin x + C$', '$\\cos x + C$', '$-\\cos x + C$'], 0, "Porque $(\\sin x)' = \\cos x$."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'lin', level: 'Semestre 2', name: 'Álgebra Lineal', icon: 'M', color: '#fb923c',
    tagline: 'Vectores y matrices que transforman el espacio.',
    units: [
      {
        title: 'Vectores y matrices',
        lessons: [
          {
            id: 'lin-1', title: 'Vectores',
            clip: { scenes: [
              sc(5, 'Un vector tiene **magnitud** y **dirección**.', { viz: { type: 'vectors', A: [3, 1], only: 'A' } }),
              sc(6, 'Para sumar, pon la cola de uno en la punta del otro.', { title: '$\\vec a + \\vec b$', viz: { type: 'vectors', A: [3, 1], B: [1, 2] } }),
              sc(5, 'La magnitud sale de Pitágoras:', { title: '$|\\vec v| = \\sqrt{v_x^2 + v_y^2}$', viz: { type: 'vectors', A: [3, 4], only: 'A', xr: [-1, 5], yr: [-1, 5] } }),
            ] },
            ex: [
              mc('$(1, 2) + (3, 1) = \\;?$', ['$(4, 3)$', '$(3, 2)$', '$(4, 2)$', '$(2, 3)$'], 0, 'Se suma componente a componente.'),
              num('Magnitud de $\\vec v = (3, 4)$', 5, '$\\sqrt{9 + 16} = 5$.'),
              num('Producto punto $(1, 2) \\cdot (3, 4)$', 11, '$1 \\cdot 3 + 2 \\cdot 4 = 11$.'),
            ],
          },
          {
            id: 'lin-2', title: 'Matrices como transformaciones',
            clip: { scenes: [
              sc(4, 'Una matriz $2 \\times 2$ **transforma** el plano entero.', { viz: { type: 'matrix', M: [[1, 0], [0, 1]] } }),
              sc(5, 'Esta estira el eje $x$ al doble.', { title: '$\\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$', viz: { type: 'matrix', M: [[2, 0], [0, 1]] } }),
              sc(5, 'Esta gira el plano 90°.', { title: '$\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$', viz: { type: 'matrix', M: [[0, -1], [1, 0]] } }),
              sc(5, 'El **determinante** mide cuánto escala las áreas.', { title: '$\\det = ad - bc$', viz: { type: 'matrix', M: [[1, 1], [0, 2]] } }),
            ] },
            ex: [
              mc('¿Qué matriz gira el plano $90^\\circ$ en sentido antihorario?', ['$\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$', '$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$', '$\\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$'], 0, 'Envía $\\hat\\imath \\to (0, 1)$ y $\\hat\\jmath \\to (-1, 0)$.'),
              num('$\\det\\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix} = \\;?$', 5, '$2 \\cdot 3 - 1 \\cdot 1 = 5$.'),
              mc('Si $\\det A = 0$, la transformación…', ['Aplasta el plano a una recta o un punto', 'Rota el plano', 'No cambia nada', 'Duplica las áreas'], 0, 'Las áreas se multiplican por 0: se pierde una dimensión.'),
            ],
          },
        ],
      },
    ],
  },
];
