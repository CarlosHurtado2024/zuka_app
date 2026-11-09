"""
Álgebra E1 · Ejemplos resueltos de sistemas numéricos (complemento de A1, lección alg-11, 9:16).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Cinco ejemplos paso a paso, cada paso con
el concepto que lo justifica: clasificar −√25, 14/7, 1.2727… y √8; 0.4666… y 2.1515… como fracción; decidir
sin dividir si 7/40, 5/12 y 21/75 terminan; ordenar 2.6, √7 y 8/3 en la recta (zoom); y la diagonal de
dos cajas en 3D (una racional, otra irracional). Ninguno repite los ejemplos del video A1 ni los ejercicios.

    manimgl ej_numeros.py S02_Periodico -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Ejemplos resueltos"
    title = "Sistemas numéricos\npaso a paso"
    subtitle = "Ejemplos resueltos con cada concepto"


class S01_Familias(ExScene):
    def construct(self):
        self.mark("Ejemplo 1: ¿a qué familias pertenece?")
        self.set_header(R"\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}", "Clasificar", HONEY, P_HONEY)
        self.problem(1, "¿A qué familias pertenecen −√25, 14/7, 1.2727… y √8?", HONEY)
        self.say("Antes de clasificar un número hay que simplificarlo: su apariencia engaña. Empecemos con menos raíz de veinticinco.", fox=True)
        self.step(R"-\sqrt{25} = -5", "raíz exacta: 5 · 5 = 25", HONEY)
        self.say("Menos cinco no sirve para contar, así que no es natural. Pero es un entero, y todo entero es racional: menos cinco sobre uno.")
        self.step(R"-5 \in \mathbb{Z},\ \mathbb{Q},\ \mathbb{R} \qquad -5 \notin \mathbb{N}", "familias anidadas", SKY)
        self.hold()
        self.say("Catorce séptimos parece una fracción, pero la división es exacta: da dos, un número natural. Así que lleva todos los sellos.")
        self.step(R"\frac{14}{7} = 2 \in \mathbb{N},\ \mathbb{Z},\ \mathbb{Q},\ \mathbb{R}", "dividir antes de decidir", MINT)
        self.hold()
        self.end_section()
        self.mark("Ejemplo 1: los decimales")
        self.problem(1, "¿A qué familias pertenecen −√25, 14/7, 1.2727… y √8?", HONEY)
        self.say("Uno punto veintisiete veintisiete repite el bloque veintisiete para siempre. Un decimal periódico siempre viene de una fracción: es racional.")
        self.step(R"1.2727\ldots = 1.\overline{27}", "bloque que se repite: período 27", MINT)
        self.step(R"1.\overline{27} = 1 + \frac{27}{99} = \frac{14}{11} \in \mathbb{Q}", "periódico ⇒ racional", MINT)
        self.hold()
        self.say("Raíz de ocho no es exacta: dos al cuadrado es cuatro y tres al cuadrado es nueve. Se puede sacar un dos, pero queda raíz de dos, que es irracional.")
        self.step(R"\sqrt{8} = \sqrt{4 \cdot 2} = 2\sqrt{2} \in \mathbb{I}", "raíz no exacta ⇒ irracional", CORAL)
        self.zoom_to(self.steps[-1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.say("Regla de oro: primero simplificar, luego preguntar de la familia más pequeña a la más grande.")
        self.hold(0.5)
        self.end_section()


class S02_Periodico(ExScene):
    def construct(self):
        self.mark("Ejemplo 2: periódico mixto a fracción")
        self.set_header(R"0.4\overline{6}", "Periódico a fracción", PINK, P_PINK)
        self.problem(2, "Escribe 0.4666… como fracción", PINK)
        self.say("Aquí el cuatro no se repite, solo el seis. Es un periódico mixto. La idea es la misma: alinear las colas infinitas para restarlas.", fox=True)
        self.step(R"x = 0.4666\ldots", "le ponemos nombre al número", MUTED)
        self.say("Multiplicamos por diez para que el cuatro pase al otro lado de la coma: así la parte que se repite empieza justo después de la coma.")
        self.step(R"10x = 4.666\ldots", "× 10: la coma salta un lugar", SKY)
        self.say("Multiplicamos por cien: la cola sigue siendo seis, seis, seis. Ahora las dos colas son idénticas.")
        self.step(R"100x = 46.666\ldots", "× 100: misma cola", SKY)
        self.zoom_to(VGroup(self.steps[-2], self.steps[-1]), scale=0.45)
        self.hold()
        self.zoom_reset()
        self.say("Restamos la segunda menos la primera. Las colas se cancelan y queda una ecuación sencilla.")
        self.step(R"100x - 10x = 46 - 4 \;\Rightarrow\; 90x = 42", "restar borra la cola infinita", HONEY)
        self.step(R"x = \frac{42}{90} = \frac{7}{15}", "dividir y simplificar entre 6", MINT)
        self.answer(R"0.4\overline{6} = \frac{7}{15}")
        self.say("Comprobación: siete entre quince es cero punto cuatro seis seis seis. ¡Coincide!")
        self.hold()
        self.end_section()
        self.mark("Ejemplo 3: con parte entera")
        self.problem(3, "Escribe 2.1515… como fracción", PINK)
        self.say("Cuando hay parte entera, conviene separarla: dos más cero punto quince quince.", fox=True)
        self.step(R"2.\overline{15} = 2 + 0.\overline{15}", "separar la parte entera", MUTED)
        self.say("El período tiene dos cifras: el quince se escribe sobre noventa y nueve, igual que en la clase.")
        self.step(R"0.\overline{15} = \frac{15}{99} = \frac{5}{33}", "dos cifras de período ⇒ sobre 99", SKY)
        self.say("Por último se suma el dos, escrito con el mismo denominador.")
        self.step(R"2 + \frac{5}{33} = \frac{66}{33} + \frac{5}{33} = \frac{71}{33}", "sumar fracciones", HONEY)
        self.answer(R"2.\overline{15} = \frac{71}{33}")
        self.hold(0.5)
        self.end_section()


class S03_TerminaORepite(ExScene):
    def construct(self):
        self.mark("Ejemplo 4: ¿termina o se repite?")
        self.set_header(R"2^a \cdot 5^b", "Sin dividir", MINT, P_MINT)
        self.problem(4, "Sin dividir: ¿el decimal de 7/40, 5/12 y 21/75 termina o se repite?", MINT)
        self.say("La clave es el denominador, ya simplificado. Si solo tiene doses y cincos, se puede completar una potencia de diez y el decimal termina.", fox=True)
        self.step(R"40 = 2^3 \cdot 5", "solo doses y cincos", MINT)
        self.step(R"\frac{7}{40} = \frac{7 \cdot 25}{1000} = 0.175", "completar a 1000: termina", MINT)
        self.hold()
        self.say("Doce tiene un tres. Ninguna potencia de diez es múltiplo de tres, así que el decimal no puede terminar: se repite.")
        self.step(R"12 = 2^2 \cdot 3", "aparece un 3", CORAL)
        self.step(R"\frac{5}{12} = 0.41\overline{6}", "periódico", CORAL)
        self.hold()
        self.say("Cuidado con veintiún setentaicincoavos: setenta y cinco tiene un tres, pero primero hay que simplificar. Tres divide a los dos.")
        self.step(R"\frac{21}{75} = \frac{7}{25}", "simplificar primero (÷ 3)", HONEY)
        self.zoom_to(self.steps[-1], scale=0.4)
        self.hold()
        self.zoom_reset()
        self.step(R"25 = 5^2 \;\Rightarrow\; \frac{7}{25} = \frac{28}{100} = 0.28", "termina", MINT)
        self.say("Sin hacer ninguna división larga ya sabemos cómo será cada decimal.")
        self.hold(0.5)
        self.end_section()


class S04_Ordenar(ExScene):
    def construct(self):
        self.mark("Ejemplo 5: ordenar en la recta")
        self.set_header(R"a < b", "Ordenar", SKY, P_SKY)
        self.problem(5, "Ordena de menor a mayor: 2.6, √7 y 8/3", SKY)
        self.say("Los tres están cerca de dos punto seis. Un truco para comparar con una raíz: comparar los cuadrados, porque son positivos.", fox=True)
        self.step(R"2.6^2 = 6.76 < 7 \;\Rightarrow\; 2.6 < \sqrt{7}", "si 0 < a y a² < b², entonces a < b", SKY)
        self.step(R"\left(\tfrac{8}{3}\right)^2 = \tfrac{64}{9} \approx 7.11 > 7 \;\Rightarrow\; \sqrt{7} < \tfrac{8}{3}", "mismo truco", SKY)
        self.answer(R"2.6 < \sqrt{7} < \frac{8}{3}", color=SKY)
        self.hold()
        self.end_section()
        self.mark("La recta con lupa")
        self.say("En la recta están muy juntos. Acerquemos la cámara entre dos punto cinco y dos punto siete.")
        line = get_number_line((2.5, 2.7, 0.05), width=7.2, numbers=False).move_to(0.6 * UP)
        labs = VGroup(*[T(f"{v:.2f}", size=22, color=MUTED).next_to(line.n2p(v), DOWN, buff=0.2) for v in (2.5, 2.55, 2.6, 2.65, 2.7)])
        self.play(ShowCreation(line), FadeIn(labs))
        pts = [(2.6, "2.6", HONEY, UP), (np.sqrt(7), R"\sqrt{7}", CORAL, DOWN), (8 / 3, R"\tfrac{8}{3}", MINT, UP)]
        dots = VGroup()
        for v, tex, col, side in pts:
            d = Dot(line.n2p(v), radius=0.1).set_fill(col, 1)
            lab = M(tex, size=40, color=col).next_to(d, side, buff=0.55 if side is DOWN else 0.25)
            dots.add(VGroup(d, lab))
        self.play(LaggedStartMap(FadeIn, dots, shift=0.2 * DOWN, lag_ratio=0.4), run_time=1.6)
        self.zoom_to(VGroup(dots[1], dots[2]), scale=0.4)
        vals = M(R"\sqrt{7} \approx 2.6458 \qquad \tfrac{8}{3} \approx 2.6667", size=20, color=INK).next_to(dots[1], DOWN, buff=0.15)
        self.play(FadeIn(vals))
        self.hold()
        self.zoom_reset()
        self.say("Comparar cuadrados evita calcular la raíz, y la recta confirma el orden.")
        self.hold(0.5)
        self.end_section()


class S05_Caja3D(MBScene):
    def construct(self):
        self.mark("Ejemplo 6: la diagonal de una caja")
        self.set_header(R"\sqrt{a^2 + b^2 + c^2}", "Diagonal en 3D", CORAL, P_CORAL)
        self.say("Último ejemplo, en tres dimensiones. Una caja mide dos por tres por seis. ¿Su diagonal es racional o irracional?", fox=True)
        a, b, c = 2, 3, 6
        k = 0.42
        box = block(a * k, b * k, c * k, color=LAV, opacity=0.25)
        box.move_to(0.8 * UP)
        corners = [np.array([x * a, y * b, z * c]) * k / 2 for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
        edges = VGroup()
        for i, p in enumerate(corners):
            for q in corners[i + 1:]:
                if sum(np.isclose(p, q)) == 2:
                    edges.add(Line(p, q).set_stroke(LAV, 3))
        edges.move_to(box)
        cen = box.get_center()
        A = cen + np.array([-a, -b, -c]) * k / 2
        B = cen + np.array([a, b, -c]) * k / 2
        Cc = cen + np.array([a, b, c]) * k / 2
        self.play(self.frame.animate.reorient(-35, 70), run_time=1.4)
        self.play(FadeIn(box), ShowCreation(edges), run_time=1.6)
        d1 = Line(A, B).set_stroke(SKY, 6)
        d2 = Line(B, Cc).set_stroke(HONEY, 6)
        d3 = Line(A, Cc).set_stroke(CORAL, 7)
        self.play(ShowCreation(d1))
        f1 = flat(M(R"\text{piso: } 2^2 + 3^2 = 13", size=38, color=SKY).move_to(3.4 * DOWN))
        self.play(FadeIn(f1))
        self.say("Primero la diagonal del piso, con Pitágoras: dos al cuadrado más tres al cuadrado, trece. No la necesitamos sacar de la raíz todavía.")
        self.hold()
        self.play(ShowCreation(d2))
        self.play(ShowCreation(d3), run_time=1.4)
        f2 = flat(M(R"d^2 = 13 + 6^2 = 49 \;\Rightarrow\; d = 7", size=40, color=CORAL).move_to(4.3 * DOWN))
        self.play(FadeIn(f2))
        self.say("Luego subimos la altura seis: trece más treinta y seis da cuarenta y nueve. ¡Raíz de cuarenta y nueve es siete! Esta diagonal es racional, aunque haya raíces en el camino.")
        self.frame.add_updater(lambda f, dt: f.increment_theta(0.25 * dt))
        self.hold(1.0)
        self.say("En cambio, una caja de uno por uno por dos tendría diagonal raíz de seis: irracional. Hay que hacer la cuenta antes de juzgar.")
        f3 = flat(M(R"1^2 + 1^2 + 2^2 = 6 \;\Rightarrow\; \sqrt{6} \in \mathbb{I}", size=36, color=MUTED).move_to(5.1 * DOWN))
        self.play(FadeIn(f3))
        self.hold(0.6)
        self.frame.clear_updaters()
        self.play(FadeOut(Group(box, edges, d1, d2, d3)), run_time=0.8)
        self.frame.reorient(0, 0)
        self.end_section()


class S06_Cierre(AlgCierre):
    recap = [
        ("Simplificar primero", "−√25 = −5,  14/7 = 2,  21/75 = 7/25", HONEY),
        ("Periódico a fracción", "alinear colas y restar: 0.4666… = 7/15", PINK),
        ("¿Termina?", "denominador con solo 2 y 5", MINT),
        ("Comparar con raíces", "comparar los cuadrados", SKY),
        ("Racional o irracional", "hacer la cuenta: √49 = 7, √6 no", CORAL),
    ]
    recap_say = "Cada paso tiene su porqué: simplificar, alinear colas, mirar el denominador y comparar cuadrados."
    practice = "Ahora te toca a ti con los juegos"
