"""
Álgebra E2 · Ejemplos resueltos de axiomas de campo y orden (complemento de A2, lección alg-12b, 9:16).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Resolver 3x + 7 = 22 nombrando el axioma de
cada paso (balanza que se equilibra), signos de (−2)(5)(−3)(−1) y de (−1)^2027, la desigualdad −3x + 4 ≤ 13
con el volteo del signo y su conjunto en la recta (zoom), |x + 1| = 4 como distancia y |x − 3| > 1 como dos
semirrectas, y |2 − √7|. Ninguno repite los ejemplos del video A2 ni los ejercicios.

    manimgl ej_axiomas.py S03_Desigualdad -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Ejemplos resueltos"
    title = "Axiomas y orden\npaso a paso"
    subtitle = "Cada paso tiene una regla que lo permite"


class S01_Justificar(ExScene):
    def construct(self):
        self.mark("Ejemplo 1: cada paso con su axioma")
        self.set_header(R"3x + 7 = 22", "Justificar", LAV, P_LAV)
        self.problem(1, "Resuelve 3x + 7 = 22 diciendo qué axioma usas en cada paso", LAV)
        self.say("Despejar no es «pasar al otro lado». Cada movimiento es un axioma aplicado a los dos lados por igual, como en una balanza.", fox=True)
        self.step(R"3x + 7 = 22", None)
        self.say("Para quitar el siete sumamos su opuesto, menos siete, a los dos lados.")
        self.step(R"(3x + 7) + (-7) = 22 + (-7)", "sumar lo mismo a ambos lados", SKY, why_color=SKY)
        self.step(R"3x + \left(7 + (-7)\right) = 15", "asociativa", PINK, why_color=PINK)
        self.step(R"3x + 0 = 15 \;\Rightarrow\; 3x = 15", "inverso aditivo y neutro", MINT, why_color=MINT)
        self.zoom_to(self.steps[-1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.say("Ahora multiplicamos los dos lados por un tercio, el inverso del tres.")
        self.step(R"\tfrac{1}{3}(3x) = \tfrac{1}{3} \cdot 15", "multiplicar por el inverso", HONEY, why_color=HONEY)
        self.step(R"\left(\tfrac{1}{3} \cdot 3\right)x = 5 \;\Rightarrow\; 1 \cdot x = 5", "asociativa e inverso multiplicativo", PINK, why_color=PINK)
        self.answer(R"x = 5 \qquad 3 \cdot 5 + 7 = 22 \;\checkmark")
        self.say("Comprobado: tres por cinco más siete da veintidós. Las reglas de siempre, con su nombre.")
        self.hold(0.5)
        self.end_section()


class S02_Signos(ExScene):
    def construct(self):
        self.mark("Ejemplo 2: el signo de un producto")
        self.set_header(R"(-)(-) = (+)", "Signos", CORAL, P_CORAL)
        self.problem(2, "Calcula (−2)(5)(−3)(−1) y el signo de (−1)²⁰²⁷", CORAL)
        self.say("Primero el signo, después el tamaño. Contamos los factores negativos: menos dos, menos tres y menos uno. Son tres.", fox=True)
        self.step(R"(-2)(5)(-3)(-1)", "3 factores negativos: impar", CORAL, why_color=CORAL)
        self.say("Una cantidad impar de negativos da negativo. El tamaño es dos por cinco por tres por uno, treinta.")
        self.step(R"\text{signo } - \qquad 2 \cdot 5 \cdot 3 \cdot 1 = 30", "valor absoluto del producto", MUTED)
        self.answer(R"(-2)(5)(-3)(-1) = -30", color=CORAL)
        self.hold()
        self.say("Con potencias pasa lo mismo: menos uno elevado a dos mil veintisiete son dos mil veintisiete factores negativos. Es impar.")
        self.step(R"(-1)^{2027}: \ 2027 \text{ es impar}", "impar ⇒ negativo", CORAL, why_color=CORAL)
        self.step(R"(-1)^{2027} = -1 \qquad (-1)^{2026} = 1", "par ⇒ positivo", SKY, why_color=SKY)
        self.zoom_to(self.steps[-1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S03_Desigualdad(ExScene):
    def construct(self):
        self.mark("Ejemplo 3: una desigualdad que se voltea")
        self.set_header(R"-3x + 4 \le 13", "Desigualdad", SKY, P_SKY)
        self.problem(3, "Resuelve −3x + 4 ≤ 13 y dibuja la solución", SKY)
        self.say("Se despeja casi como una ecuación. Restar cuatro a los dos lados no cambia el orden.", fox=True)
        self.step(R"-3x + 4 - 4 \le 13 - 4 \;\Rightarrow\; -3x \le 9", "sumar lo mismo conserva el orden", SKY, why_color=SKY)
        self.say("Ahora hay que dividir entre menos tres. Dividir entre un negativo es multiplicar por un negativo: el espejo voltea el signo.")
        self.step(R"\frac{-3x}{-3} \;\ge\; \frac{9}{-3}", "÷ negativo: ≤ se vuelve ≥", CORAL, why_color=CORAL)
        self.zoom_to(self.steps[-1], scale=0.4)
        self.hold()
        self.zoom_reset()
        self.step(R"x \ge -3", None, color=MINT)
        self.end_section()
        self.mark("La solución en la recta")
        self.say("Son todos los números desde menos tres hacia la derecha, con el menos tres incluido: punto lleno.")
        line = get_number_line((-6, 4, 1), width=7.2, numbers=False).move_to(2.0 * UP)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=22, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-6, 5)])
        self.play(ShowCreation(line), FadeIn(labs))
        dot_ = Dot(line.n2p(-3), radius=0.13).set_fill(MINT, 1)
        ray = Arrow(line.n2p(-3), line.n2p(4) + 0.2 * RIGHT, buff=0).set_color(MINT).set_stroke(width=8)
        self.play(GrowFromCenter(dot_))
        self.play(GrowArrow(ray), run_time=1.4)
        ans = formula_card(R"x \in [-3, \infty)", color=MINT).move_to(0.0)
        self.play(FadeIn(ans, shift=0.2 * UP))
        self.say("Comprobemos con un número de la zona, cero: cuatro es menor o igual que trece. Y con uno de afuera, menos cuatro: dieciséis no lo es.")
        chk = VGroup(
            M(R"x = 0:\ 4 \le 13 \;\checkmark", size=38, color=MINT),
            M(R"x = -4:\ 16 \le 13 \;\times", size=38, color=CORAL),
        ).arrange(DOWN, buff=0.3).move_to(2.4 * DOWN)
        self.play(FadeIn(chk, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Absoluto(ExScene):
    def construct(self):
        self.mark("Ejemplo 4: valor absoluto como distancia")
        self.set_header(R"|x + 1| = 4", "Valor absoluto", PINK, P_PINK)
        self.problem(4, "Resuelve |x + 1| = 4", PINK)
        self.say("Truco: escribir x más uno como x menos menos uno. Así se lee: la distancia de x a menos uno es cuatro.", fox=True)
        self.step(R"|x - (-1)| = 4", "distancia de x a −1", PINK, why_color=PINK)
        line = get_number_line((-7, 5, 1), width=7.2, numbers=False).move_to(0.2 * DOWN)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=20, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.15) for k in range(-7, 6)])
        self.play(ShowCreation(line), FadeIn(labs))
        c = Dot(line.n2p(-1), radius=0.12).set_fill(LAV, 1)
        self.play(GrowFromCenter(c))
        right = VGroup(*[ArcBetweenPoints(line.n2p(k), line.n2p(k + 1), angle=-PI / 2).set_stroke(MINT, 3) for k in range(-1, 3)])
        left = VGroup(*[ArcBetweenPoints(line.n2p(k), line.n2p(k - 1), angle=PI / 2).set_stroke(SKY, 3) for k in range(-1, -5, -1)])
        self.say("Desde menos uno damos cuatro pasos a la derecha y llegamos a tres; cuatro a la izquierda y llegamos a menos cinco.")
        self.play(LaggedStartMap(ShowCreation, right, lag_ratio=0.3), LaggedStartMap(ShowCreation, left, lag_ratio=0.3), run_time=2.0)
        s1 = Dot(line.n2p(3), radius=0.13).set_fill(MINT, 1)
        s2 = Dot(line.n2p(-5), radius=0.13).set_fill(SKY, 1)
        self.play(GrowFromCenter(s1), GrowFromCenter(s2))
        ans = formula_card(R"x = 3 \quad \text{o} \quad x = -5", color=PINK).move_to(2.2 * DOWN)
        self.play(FadeIn(ans, shift=0.2 * UP))
        self.say("Comprobación: tres más uno es cuatro; menos cinco más uno es menos cuatro, y su valor absoluto es cuatro.")
        self.hold()
        self.end_section()
        self.mark("Ejemplo 5: mayor que una distancia")
        self.problem(5, "Resuelve |x − 3| > 1", PINK)
        self.say("Ahora queremos los números a más de un paso del tres. Son los que se alejan: hacia la izquierda de dos o hacia la derecha de cuatro.", fox=True)
        line = get_number_line((-1, 7, 1), width=7.2, numbers=False).move_to(3.4 * DOWN)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=22, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-1, 8)])
        self.play(ShowCreation(line), FadeIn(labs))
        cen = Dot(line.n2p(3), radius=0.1).set_fill(LAV, 1)
        o1 = Circle(radius=0.12).set_fill(BG_COLOR, 1).set_stroke(PINK, 3).move_to(line.n2p(2))
        o2 = o1.copy().move_to(line.n2p(4))
        r1 = Line(line.n2p(2), line.n2p(-1) + 0.2 * LEFT).set_stroke(PINK, 8)
        r2 = Line(line.n2p(4), line.n2p(7) + 0.2 * RIGHT).set_stroke(PINK, 8)
        self.play(GrowFromCenter(cen))
        self.play(ShowCreation(r1), ShowCreation(r2), FadeIn(o1), FadeIn(o2), run_time=1.6)
        self.step(R"x - 3 > 1 \quad \text{o} \quad x - 3 < -1", "lejos por la derecha o por la izquierda", PINK, why_color=PINK)
        self.step(R"x > 4 \quad \text{o} \quad x < 2", "puntos vacíos: el 2 y el 4 no cumplen", MUTED)
        self.answer(R"(-\infty, 2) \cup (4, \infty)", color=PINK)
        self.hold()
        self.end_section()
        self.mark("Ejemplo 6: quitar las barras")
        self.problem(6, "Escribe sin barras |2 − √7|", PINK)
        self.say("Para quitar las barras hay que saber el signo de lo de adentro. Raíz de siete está entre dos y tres, porque cuatro es menor que siete y siete menor que nueve.", fox=True)
        self.step(R"4 < 7 < 9 \;\Rightarrow\; 2 < \sqrt{7} < 3", "comparar cuadrados", SKY, why_color=SKY)
        self.step(R"2 - \sqrt{7} < 0", "adentro es negativo", CORAL, why_color=CORAL)
        self.say("Como es negativo, el valor absoluto le cambia el signo.")
        self.step(R"|2 - \sqrt{7}| = -(2 - \sqrt{7})", "|a| = −a si a < 0", PINK, why_color=PINK)
        self.answer(R"|2 - \sqrt{7}| = \sqrt{7} - 2 \approx 0.65", color=PINK)
        self.hold(0.5)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("Despejar con axiomas", "opuesto, asociativa, neutro, inverso", LAV),
        ("Signos", "cuenta los negativos: impar ⇒ −", CORAL),
        ("Desigualdades", "÷ negativo voltea el signo", SKY),
        ("|x − a| = d", "dos puntos a distancia d de a", PINK),
        ("|x − a| > d", "dos semirrectas que se alejan", PINK),
    ]
    recap_say = "Un paso es correcto cuando una regla lo permite. Con las reglas a la mano, ningún signo se te escapa."
    practice = "Ahora te toca a ti con los juegos"
