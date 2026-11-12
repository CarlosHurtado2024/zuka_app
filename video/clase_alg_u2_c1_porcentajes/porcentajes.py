"""
Álgebra C1 · Porcentajes: qué son y cómo se calculan (lección alg-13, parte 1 de porcentajes, 9:16).

Desde lo básico y sin zoom ni 3D: «por ciento» = de cada 100 (cuadrícula con 35 de 100 pintadas = 35/100 = 0.35, como
los racionales); equivalencias 1/2, 1/4, 3/4, 1/5, 1/10, 1; razón parte : todo escalada a 100 (9 de 25 con gafas: cuatro
cuadrículas de 25 forman 100, 36 %); la proporción parte/todo = p/100 (regla de tres) para las tres preguntas: 15 % de 80
(y 10 % + 5 % de cabeza), qué % es 18 de 72, 30 es el 40 % de 75; más de 100 % (150 % de 40) y menos de 1 % (0.5 % de 2 000).
Spec 2026-11-11-porcentajes-desde-cero.

    manimgl porcentajes.py S03_TresPreguntas -w -l
"""
from alg_fx import *


def grid100(painted, color, s=0.4, gap=0.04):
    cells = VGroup(*[Square(s).set_fill(color if k < painted else CARD, 0.95 if k < painted else 1).set_stroke(BORDER, 1)
                     for k in range(100)])
    cells.arrange_in_grid(n_rows=10, n_cols=10, buff=gap)
    return cells


def people25(marked, color, r=0.085, buff=0.09):
    g = VGroup(*[Dot(radius=r).set_fill(color if k < marked else MUTED, 1) for k in range(25)])
    g.arrange_in_grid(n_rows=5, n_cols=5, buff=buff)
    return g


def bar(value, unit, color, h=0.6):
    return Rectangle(value * unit, h).set_fill(color, 0.9).set_stroke(width=0)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Porcentajes · Parte 1"
    title = "Porcentajes:\nqué son y cómo se calculan"
    subtitle = "De cada cien"


class S01_DeCada100(MBScene):
    def construct(self):
        self.mark("De cada cien")
        self.set_header(R"\%", "Por ciento", HONEY, P_HONEY)
        self.say("La expresión por ciento quiere decir de cada cien. Mira esta cuadrícula de cien casillas.", fox=True)
        g = grid100(0, HONEY).move_to(2.5 * UP)
        self.play(FadeIn(g, lag_ratio=0.005), run_time=1.2)
        self.say("Si se pintan treinta y cinco de las cien, se pintó el treinta y cinco por ciento.")
        self.play(LaggedStart(*[c.animate.set_fill(HONEY, 0.95) for c in g[:35]], lag_ratio=0.03), run_time=2)
        self.hold()
        self.say("Un porcentaje es una fracción con denominador cien. Y como aprendiste con los racionales, también se escribe como decimal: cero punto treinta y cinco.")
        f = M(R"35\% = \frac{35}{100} = 0.35", size=52, color=HONEY).move_to(1.1 * DOWN)
        self.play(Write(f))
        self.hold(0.6)
        self.end_section()

        self.mark("Porcentajes que conviene reconocer")
        self.say("Algunos porcentajes conviene reconocerlos al instante, porque son fracciones muy conocidas.")
        items = [(R"\tfrac12 = 50\%", MINT), (R"\tfrac14 = 25\%", SKY), (R"\tfrac34 = 75\%", PINK),
                 (R"\tfrac15 = 20\%", HONEY), (R"\tfrac1{10} = 10\%", LAV), (R"1 = 100\%", CORAL)]
        cards = VGroup()
        for tex, col in items:
            cards.add(formula_card(tex, color=col, size=44))
        cards.arrange_in_grid(n_rows=3, n_cols=2, buff=0.32).move_to(2.2 * UP)
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.2), run_time=2)
        self.hold()
        self.say("Por ejemplo, la mitad de algo es su cincuenta por ciento, y el todo completo es el cien por ciento.")
        mini = VGroup(grid100(50, MINT, s=0.16, gap=0.02), grid100(25, SKY, s=0.16, gap=0.02), grid100(100, CORAL, s=0.16, gap=0.02))
        mini.arrange(RIGHT, buff=0.5).move_to(2.0 * DOWN)
        labs = VGroup(*[T(t, size=22, color=c).next_to(m, DOWN, buff=0.15) for t, c, m in zip(["50 %", "25 %", "100 %"], [MINT, SKY, CORAL], mini)])
        self.play(FadeIn(mini), FadeIn(labs))
        self.hold(0.6)
        self.end_section()


class S02_Razon(MBScene):
    def construct(self):
        self.mark("Un porcentaje es una razón")
        self.set_header(R"\tfrac{9}{25} = \tfrac{36}{100}", "Parte y todo", PINK, P_PINK)
        self.say("En un curso de veinticinco estudiantes, nueve usan gafas. Como en las razones, la parte es al todo como nueve es a veinticinco.", fox=True)
        one = people25(9, PINK).move_to(3.4 * UP)
        lab = T("9 de 25 usan gafas", size=26, color=PINK).next_to(one, DOWN, buff=0.25)
        self.play(FadeIn(one, lag_ratio=0.03), FadeIn(lab))
        self.hold()
        self.say("Para hablar en porcentaje, el todo tiene que ser cien. Cuatro cursos iguales suman cien estudiantes, y en ellos hay treinta y seis con gafas.")
        four = VGroup(*[people25(9, PINK) for _ in range(4)]).arrange(RIGHT, buff=0.35).move_to(3.4 * UP)
        self.play(FadeOut(lab), ReplacementTransform(one, four[0]))
        self.play(LaggedStartMap(FadeIn, four[1:], shift=0.2 * LEFT, lag_ratio=0.3))
        lab4 = T("36 de 100", size=26, color=PINK).next_to(four, DOWN, buff=0.25)
        self.play(FadeIn(lab4))
        self.hold()
        self.say("Es la misma razón, escalada: se multiplica arriba y abajo por cuatro, igual que con las razones equivalentes.")
        f = M(R"\frac{9}{25} = \frac{9 \cdot 4}{25 \cdot 4} = \frac{36}{100} = 36\%", size=48).move_to(0.9 * UP)
        f.set_max_width(7.2)
        self.play(Write(f))
        self.hold()
        self.say("También se puede dividir: nueve entre veinticinco es cero punto treinta y seis, y en centésimas eso es treinta y seis por ciento.")
        d = M(R"9 \div 25 = 0.36 = 36\%", size=46, color=PINK).move_to(0.6 * DOWN)
        self.play(Write(d))
        n = note("Porcentaje = razón parte : todo con el todo igual a 100", color=PINK, size=26).move_to(2.2 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S03_TresPreguntas(MBScene):
    def card(self):
        c = formula_card(R"\frac{\text{parte}}{\text{todo}} = \frac{p}{100}", color=SKY, size=48).move_to(3.9 * UP)
        self.play(FadeIn(c, shift=0.2 * DOWN))
        return c

    def construct(self):
        self.mark("La parte de un todo")
        self.set_header(R"\tfrac{B}{C} = \tfrac{p}{100}", "La proporción", SKY, P_SKY)
        self.say("Todo problema de porcentajes es una proporción: la parte es al todo como el porcentaje es a cien. Es la regla de tres que ya conoces.", fox=True)
        self.card()
        self.hold()
        self.say("Primera pregunta: cuánto es el quince por ciento de ochenta. El todo es ochenta y falta la parte.")
        q = note("El 15 % de 80", color=SKY, size=30).move_to(2.3 * UP)
        self.play(FadeIn(q))
        s1 = M(R"\frac{x}{80} = \frac{15}{100} \;\Rightarrow\; x = 80 \cdot 0.15 = 12", size=44).move_to(1.0 * UP)
        s1.set_max_width(7.2)
        self.play(Write(s1))
        self.hold()
        self.say("De cabeza también sale: el diez por ciento de ochenta es ocho, el cinco por ciento es la mitad, cuatro. Juntos, doce.")
        s2 = M(R"10\% \to 8 \qquad 5\% \to 4 \qquad 15\% \to 12", size=42, color=MINT).move_to(0.2 * DOWN)
        self.play(Write(s2))
        self.hold(0.6)
        self.end_section()

        self.mark("Qué porcentaje es")
        self.say("Segunda pregunta: qué porcentaje es dieciocho de setenta y dos. Ahora se conocen la parte y el todo, y falta p.")
        self.card()
        q = note("Qué % es 18 de 72", color=SKY, size=30).move_to(2.3 * UP)
        self.play(FadeIn(q))
        s1 = M(R"\frac{18}{72} = \frac{p}{100} \;\Rightarrow\; p = \frac{18}{72} \cdot 100 = 25", size=44).move_to(1.0 * UP)
        s1.set_max_width(7.2)
        self.play(Write(s1))
        self.hold()
        self.say("Dieciocho es la cuarta parte de setenta y dos: el veinticinco por ciento.")
        a = M(R"18 = \tfrac14 \text{ de } 72 = 25\%", size=44, color=MINT).move_to(0.2 * DOWN)
        self.play(Write(a))
        self.hold(0.6)
        self.end_section()

        self.mark("El todo a partir de una parte")
        self.say("Tercera pregunta: treinta es el cuarenta por ciento de un número. Ahora falta el todo.")
        self.card()
        q = note("30 es el 40 % de un número", color=SKY, size=30).move_to(2.3 * UP)
        self.play(FadeIn(q))
        s1 = M(R"\frac{30}{x} = \frac{40}{100} \;\Rightarrow\; x = \frac{30}{0.4} = 75", size=44).move_to(1.0 * UP)
        s1.set_max_width(7.2)
        self.play(Write(s1))
        self.hold()
        self.say("Comprobación: el cuarenta por ciento de setenta y cinco es setenta y cinco por cero punto cuatro, treinta. Sí cuadra.")
        c = M(R"75 \cdot 0.4 = 30", size=44, color=MINT).move_to(0.2 * DOWN)
        ok = check_mark(MINT, size=50).next_to(c, RIGHT, buff=0.3)
        self.play(Write(c), FadeIn(ok, scale=0.6))
        self.hold(0.6)
        self.end_section()


class S04_Mas100(MBScene):
    def construct(self):
        self.mark("Más de cien y menos de uno")
        self.set_header(R"150\%", "Más de 100", CORAL, P_CORAL)
        self.say("Un porcentaje puede pasar de cien. El cien por ciento de cuarenta es cuarenta, y el ciento cincuenta por ciento es eso más la mitad: sesenta.", fox=True)
        u = 0.075
        b1 = bar(40, u, SKY)
        b2 = bar(60, u, CORAL)
        rows = VGroup(b1, b2).arrange(DOWN, buff=0.7, aligned_edge=LEFT).move_to(3.2 * UP).shift(0.6 * LEFT)
        l1 = T("100 % = 40", size=26, color=SKY).next_to(b1, RIGHT, buff=0.25)
        l2 = T("150 % = 60", size=26, color=CORAL).next_to(b2, RIGHT, buff=0.25)
        mark = DashedLine(b1.get_corner(UR) + 0.2 * UP, b1.get_corner(DR) + 1.5 * DOWN).set_stroke(MUTED, 2)
        self.play(GrowFromEdge(b1, LEFT), FadeIn(l1))
        self.play(GrowFromEdge(b2, LEFT), FadeIn(l2), ShowCreation(mark))
        f = M(R"40 \cdot 1.5 = 60", size=46).move_to(1.0 * UP)
        self.play(Write(f))
        self.hold()
        self.say("Y puede ser menor que uno. El uno por ciento de dos mil es veinte; el cero punto cinco por ciento es la mitad de eso: diez.")
        g = VGroup(
            M(R"1\% \text{ de } 2000 = 20", size=42),
            M(R"0.5\% \text{ de } 2000 = 2000 \cdot 0.005 = 10", size=42, color=HONEY),
        ).arrange(DOWN, buff=0.35).move_to(1.1 * DOWN)
        g.set_max_width(7.2)
        self.play(Write(g[0]))
        self.play(Write(g[1]))
        self.hold()
        n = note("Para sacar el p % de algo, multiplícalo por p ÷ 100", color=CORAL, size=28).move_to(3.0 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("Por ciento", "de cada 100: 35 % = 35/100 = 0.35", HONEY),
        ("Para reconocer", "1/2 = 50 %, 1/4 = 25 %, 1/5 = 20 %, 1/10 = 10 %", HONEY),
        ("Es una razón", "parte : todo con el todo igual a 100 (9 de 25 = 36 %)", PINK),
        ("La proporción", "parte / todo = p / 100", SKY),
        ("Tres preguntas", "15 % de 80 = 12 · 18 de 72 = 25 % · 30 es el 40 % de 75", SKY),
        ("Más y menos", "150 % de 40 = 60 · 0.5 % de 2 000 = 10", CORAL),
    ]
    recap_say = "Un porcentaje es una razón con el todo igual a cien, y la proporción parte entre todo igual a p entre cien resuelve cualquier pregunta."
    practice = "Pinta personas, llena cuadrículas y gira la rueda del porcentaje"
