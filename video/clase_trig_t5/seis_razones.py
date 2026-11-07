"""
Clase T5 · Las seis razones y la medición indirecta (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Las recíprocas (csc, sec, cot) con el triángulo
20-21-29, el ángulo de elevación con la sombra de un árbol (zoom al ángulo) y el de depresión desde un
faro. Manual de la UdeA §13.2 y problema 13.15.

    manimgl seis_razones.py S02_Elevacion -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T5"
    title = "Las seis razones\ny la medición indirecta"
    subtitle = "Medir lo que no se puede alcanzar"


class S01_Reciprocas(MBScene):
    def construct(self):
        self.mark("Dar la vuelta a la fracción")
        self.set_header(R"\csc\ \sec\ \cot", "Las recíprocas", C_SEN, P_SEN)
        k = 0.12
        A = 2.6 * LEFT + 1.6 * UP
        B = A + 21 * k * RIGHT
        Cc = B + 20 * k * UP
        tri = Polygon(A, B, Cc).set_stroke(INK, 3).set_fill(C_COS, 0.08)
        labs = VGroup(
            M("21", size=34, color=C_COS).next_to(Line(A, B), DOWN, buff=0.12),
            M("20", size=34, color=C_SEN).next_to(Line(B, Cc), RIGHT, buff=0.12),
            M("29", size=34, color=C_ANG).move_to((A + Cc) / 2 + 0.4 * UP + 0.3 * LEFT),
        )
        ang = get_angle_arc(np.arctan2(20, 21), 0.6, A)
        self.say("Un triángulo de lados 20, 21 y 29. Ya conoces tres razones de theta. Las otras tres son las "
                 "mismas fracciones, pero dadas vuelta.", fox=True)
        self.play(ShowCreation(tri), ShowCreation(ang), FadeIn(labs))
        self.hold()
        pairs = [
            (SEN + R"\theta = \frac{20}{29}", R"\csc\theta = \frac{29}{20}", C_SEN),
            (R"\cos\theta = \frac{21}{29}", R"\sec\theta = \frac{29}{21}", C_COS),
            (R"\tan\theta = \frac{20}{21}", R"\cot\theta = \frac{21}{20}", C_TAN),
        ]
        rows = VGroup()
        for a, b, col in pairs:
            left = M(a, size=40, color=col)
            right = M(b, size=40, color=col)
            arrow = M(R"\;\longleftrightarrow\;", size=40, color=MUTED)
            rows.add(VGroup(left, arrow, right).arrange(RIGHT, buff=0.25))
        rows.arrange(DOWN, buff=0.45).move_to(1.9 * DOWN)
        names = ["cosecante", "secante", "cotangente"]
        for row, name in zip(rows, names):
            self.say(f"La {name} es la recíproca: la misma fracción con el numerador y el denominador intercambiados.")
            self.play(FadeIn(row[0]))
            self.play(GrowFromCenter(row[1]), TransformFromCopy(row[0], row[2]), run_time=1.2)
            self.hold()
        tip = T("Cada una con su pareja: sen–csc, cos–sec, tan–cot", size=26, color=MUTED).next_to(rows, DOWN, buff=0.4)
        self.play(FadeIn(tip))
        self.hold(0.5)
        self.end_section()


class S02_Elevacion(MBScene):
    def construct(self):
        self.mark("La sombra del árbol")
        self.set_header(R"\tan\theta", "Ángulo de elevación", C_TAN, P_TAN)
        base = 0.6 * DOWN
        k = 0.36
        tree_x = 2.2 * RIGHT
        tip_x = tree_x + 15 * k * LEFT
        h = 15 * np.tan(40 * DEGREES) * k
        ground = Line(base + 3.8 * LEFT, base + 3.8 * RIGHT).set_stroke(MUTED, 3)
        trunk = Rectangle(0.28, h * 0.45).set_fill("#8A5A3B", 1).set_stroke(width=0).move_to(base + tree_x + h * 0.225 * UP)
        crown = Circle(radius=h * 0.38).set_fill("#3FA55B", 1).set_stroke(width=0).move_to(base + tree_x + h * 0.6 * UP)
        tree = VGroup(trunk, crown)
        top = base + tree_x + h * UP
        sun = Circle(radius=0.45).set_fill(C_ANG, 1).set_stroke(width=0).move_to(3.0 * LEFT + 4.3 * UP)
        shadow = Line(base + tip_x, base + tree_x).set_stroke("#000000", 10, opacity=0.55)
        self.say("Queremos saber cuánto mide un árbol sin treparlo. Su sombra mide 15 metros, y desde la punta de "
                 "la sombra vemos la copa con un ángulo de 40 grados.", fox=True)
        self.play(ShowCreation(ground), FadeIn(tree), FadeIn(sun))
        self.play(ShowCreation(shadow))
        ray = Line(base + tip_x, top).set_stroke(C_ANG, 4)
        self.play(ShowCreation(ray))
        s_lab = M(R"15 \text{ m}", size=34, color=C_COS).next_to(shadow, DOWN, buff=0.15)
        h_lab = M("h", size=40, color=C_SEN).next_to(Line(base + tree_x, top), RIGHT, buff=0.25)
        hline = DashedLine(base + tree_x, top).set_stroke(C_SEN, 4)
        self.play(FadeIn(s_lab), ShowCreation(hline), FadeIn(h_lab))
        self.hold()
        self.mark("Zoom al ángulo")
        self.say("Acerquémonos a la punta de la sombra: ese ángulo, medido desde el piso hacia arriba, se llama "
                 "ángulo de elevación.")
        arc = get_angle_arc(40 * DEGREES, 0.8, base + tip_x)
        a_lab = M(R"40^\circ", size=30, color=C_ANG).move_to(base + tip_x + 1.15 * RIGHT + 0.42 * UP)
        self.zoom_to(base + tip_x + 0.8 * RIGHT + 0.4 * UP, scale=0.35, run_time=1.8)
        self.play(ShowCreation(arc), FadeIn(a_lab))
        self.hold()
        self.zoom_reset()
        eqs = VGroup(
            M(R"\tan 40^\circ = \frac{h}{15}", size=48),
            M(R"h = 15 \tan 40^\circ \approx 15 \cdot 0.839", size=42),
            M(R"h \approx 12.6 \text{ m}", size=54, color=C_TAN),
        ).arrange(DOWN, buff=0.3).move_to(3.3 * DOWN)
        self.say("El árbol es el opuesto y la sombra el adyacente: la tangente los une. La altura es 15 por tangente "
                 "de 40, casi 12.6 metros.")
        for e in eqs:
            self.play(Write(e), run_time=1)
        self.hold(0.5)
        self.end_section()


class S03_Depresion(MBScene):
    def construct(self):
        self.mark("Desde el faro")
        self.set_header(R"\downarrow", "Ángulo de depresión", C_COS, P_COS)
        k = 0.052
        sea_y = 2.4 * DOWN
        k = 0.045                       # misma escala en horizontal y vertical: el ángulo dibujado es 20°
        lh_x = 2.8 * LEFT
        H = 50 * k
        sea = Rectangle(8, 2.2).set_fill("#0E4A6B", 1).set_stroke(width=0).move_to(sea_y + 1.1 * DOWN)
        tower = Polygon(lh_x + sea_y + 0.35 * LEFT, lh_x + sea_y + 0.35 * RIGHT, lh_x + sea_y + H * UP + 0.22 * RIGHT, lh_x + sea_y + H * UP + 0.22 * LEFT)
        tower.set_fill(INK, 1).set_stroke(width=0)
        stripes = VGroup(*(Rectangle(0.6 - 0.08 * i, 0.22).set_fill(C_I, 1).set_stroke(width=0).move_to(lh_x + sea_y + (0.45 + i * 0.65) * UP) for i in range(3)))
        light = Circle(radius=0.22).set_fill(C_ANG, 1).set_stroke(width=0).move_to(lh_x + sea_y + H * UP + 0.2 * UP)
        top = lh_x + sea_y + H * UP
        d = 50 / np.tan(20 * DEGREES)
        boat_x = lh_x + d * k * RIGHT
        boat = Polygon(sea_y + boat_x + 0.5 * LEFT, sea_y + boat_x + 0.5 * RIGHT, sea_y + boat_x + 0.35 * RIGHT + 0.25 * DOWN, sea_y + boat_x + 0.35 * LEFT + 0.25 * DOWN)
        boat.set_fill("#E8A33D", 1).set_stroke(width=0)
        self.say("Un vigía está en lo alto de un faro de 50 metros y ve un barco. Para verlo baja la mirada 20 grados "
                 "desde la horizontal: eso es un ángulo de depresión.", fox=True)
        self.play(FadeIn(sea), FadeIn(VGroup(tower, stripes, light)), FadeIn(boat))
        horiz = DashedLine(top, top + 6.4 * RIGHT).set_stroke(MUTED, 3)
        sight = Line(top, sea_y + boat_x).set_stroke(C_ANG, 4)
        self.play(ShowCreation(horiz), ShowCreation(sight))
        dep_ang = np.arctan2((sea_y + boat_x - top)[1], (sea_y + boat_x - top)[0])
        dep = Arc(0, dep_ang, radius=1.2, arc_center=top).set_stroke(C_ANG, 5)
        dep_l = M(R"20^\circ", size=30, color=C_ANG).move_to(top + 1.6 * RIGHT + 0.22 * DOWN)
        self.play(ShowCreation(dep), FadeIn(dep_l))
        self.hold()
        self.mark("El mismo ángulo abajo")
        self.say("Truco: la horizontal de arriba y el mar son paralelos, así que desde el barco el faro se ve con el "
                 "mismo ángulo hacia arriba. Acerquémonos al barco.")
        elev = Arc(PI, dep_ang, radius=1.2, arc_center=sea_y + boat_x).set_stroke(C_COS, 5)
        elev_l = M(R"20^\circ", size=30, color=C_COS).move_to(sea_y + boat_x + 1.6 * LEFT + 0.22 * UP)
        self.zoom_to(sea_y + boat_x + 0.7 * LEFT + 0.3 * UP, scale=0.4, run_time=1.8)
        self.play(ShowCreation(elev), FadeIn(elev_l))
        self.hold()
        self.zoom_reset()
        h_lab = M(R"50 \text{ m}", size=32, color=C_SEN).next_to(tower, LEFT, buff=0.15)
        d_lab = M("d", size=40, color=C_COS).move_to(sea_y + (lh_x + boat_x) / 2 + 0.3 * DOWN)
        self.play(FadeIn(h_lab), FadeIn(d_lab))
        eqs = VGroup(
            M(R"\tan 20^\circ = \frac{50}{d}", size=48),
            M(R"d = \frac{50}{\tan 20^\circ} \approx \frac{50}{0.364} \approx 137.4 \text{ m}", size=40, color=C_COS),
        ).arrange(DOWN, buff=0.35).move_to(5.0 * UP + 0.3 * DOWN)
        eqs.move_to(3.3 * UP)
        self.say("Ahora el faro es el opuesto y la distancia el adyacente. Despejando, el barco está a unos 137 metros.")
        self.play(Write(eqs[0]))
        self.play(Write(eqs[1]))
        self.hold(0.5)
        self.end_section()


class S04_Cierre(TrigCierre):
    recap = [
        ("Recíprocas", "csc = 1/sen · sec = 1/cos · cot = 1/tan", C_SEN),
        ("Elevación", "mirar hacia arriba desde la horizontal", C_TAN),
        ("Depresión", "mirar hacia abajo; es igual a la elevación desde abajo", C_COS),
    ]
    recap_say = ("Repasemos: las tres razones nuevas son las recíprocas de seno, coseno y tangente; y con los ángulos "
                 "de elevación y de depresión se miden alturas y distancias sin subirse a nada.")
    practice = "Ahora, los juegos:\narma triángulos con csc, sec y cot\ny camina hasta ver la cima"
