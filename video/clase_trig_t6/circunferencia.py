"""
Clase T6 · La circunferencia unitaria (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Del triángulo de hipotenusa 1 al círculo; P(t) =
(cos t, sen t) con zoom al punto y lecturas en vivo; el punto P(−4, −3) del libro (r = 5) y las vueltas
que hacen periódicas a las funciones. Manual de la UdeA §13.3 (definición 13.9, ejercicio 13.3).

    manimgl circunferencia.py S02_CualquierAngulo -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def unit_scene(R, c, theta, show_triangle=True):
    """Punto P(θ), su radio y las proyecciones: coseno (cian, horizontal) y seno (rosa, vertical)."""
    def build():
        t = theta.get_value()
        P = point_on(t, R, c)
        foot = np.array([P[0], c[1], 0])
        g = VGroup(
            Line(c, foot).set_stroke(C_COS, 7),
            Line(foot, P).set_stroke(C_SEN, 7),
            Line(c, P).set_stroke(INK, 4),
            get_angle_arc(t, 0.45, c),
            Dot(P, radius=0.11).set_color(C_ANG),
        )
        return g
    return always_redraw(build)


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T6"
    title = "La circunferencia\nunitaria"
    subtitle = "Seno y coseno para cualquier ángulo"


class S01_DelTriangulo(MBScene):
    def construct(self):
        self.mark("Hipotenusa 1")
        self.set_header(R"r = 1", "Del triángulo al círculo", C_COS, P_COS)
        R, c = 2.6, 1.4 * UP + 0.2 * LEFT
        axes = get_trig_axes(R, c, circle=False)
        theta = ValueTracker(35 * DEGREES)
        pic = unit_scene(R, c, theta)
        self.say("Hasta ahora el seno y el coseno vivían en triángulos rectángulos. Hagamos uno con hipotenusa 1, "
                 "con el ángulo en el origen.", fox=True)
        self.play(ShowCreation(axes))
        self.add(pic)
        self.hold()
        eqs = VGroup(
            M(SEN + R"\theta = \frac{\text{op}}{1} = y", size=46, color=C_SEN),
            M(R"\cos\theta = \frac{\text{ady}}{1} = x", size=46, color=C_COS),
        ).arrange(DOWN, buff=0.35).move_to(2.9 * DOWN)
        self.say("Como la hipotenusa mide 1, dividir entre ella no cambia nada: el seno es la altura del punto y el "
                 "coseno es cuánto avanza a la derecha.")
        self.play(Write(eqs[0]))
        self.play(Write(eqs[1]))
        self.hold()
        circle = Circle(radius=R).move_to(c).set_stroke(INK, 3, opacity=0.55)
        self.say("Si giramos el ángulo, la punta del triángulo recorre un círculo de radio 1: la circunferencia unitaria.")
        self.play(theta.animate.set_value(80 * DEGREES), run_time=1.5)
        self.play(ShowCreation(circle), theta.animate.set_value(10 * DEGREES), run_time=2.5)
        self.play(theta.animate.set_value(50 * DEGREES), run_time=1.2)
        self.hold(0.5)
        pic.clear_updaters()
        self.end_section()


class S02_CualquierAngulo(MBScene):
    def construct(self):
        self.mark("P(t) = (cos t, sen t)")
        self.set_header(R"P(t)", "Cualquier ángulo", C_ANG, P_ANG)
        R, c = 2.4, 1.5 * UP
        axes = get_trig_axes(R, c)
        theta = ValueTracker(50 * DEGREES)
        pic = unit_scene(R, c, theta)
        cos_v = DecimalNumber(0, num_decimal_places=2, include_sign=True, font_size=44).set_color(C_COS)
        sen_v = DecimalNumber(0, num_decimal_places=2, include_sign=True, font_size=44).set_color(C_SEN)
        cos_l = M(R"\cos t =", size=44, color=C_COS)
        sen_l = M(SEN + R" t =", size=44, color=C_SEN)
        row1 = VGroup(cos_l, cos_v).arrange(RIGHT, buff=0.2)
        row2 = VGroup(sen_l, sen_v).arrange(RIGHT, buff=0.2)
        reads = VGroup(row1, row2).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to(2.6 * DOWN)
        reads.fix_in_frame()            # las lecturas no se mueven con el zoom
        cos_v.add_updater(lambda m: m.set_value(np.cos(theta.get_value())))
        sen_v.add_updater(lambda m: m.set_value(np.sin(theta.get_value())))
        self.say("Ahora el ángulo puede ser cualquiera, aunque ya no haya triángulo agudo. Definimos: el punto de la "
                 "circunferencia unitaria en el ángulo t tiene coordenadas coseno de t y seno de t.", fox=True)
        self.play(ShowCreation(axes))
        self.add(pic)
        self.play(FadeIn(reads))
        self.hold()
        self.say("Míralo girar. Pasando los 90 grados el punto queda a la izquierda: el coseno se vuelve negativo. "
                 "Abajo, el seno es negativo.")
        self.play(theta.animate.set_value(150 * DEGREES), run_time=2.5)
        self.play(theta.animate.set_value(240 * DEGREES), run_time=2.5)
        self.hold()
        self.mark("Zoom al punto")
        self.say("Acerquémonos al punto en 240 grados para leer sus coordenadas.")
        P = point_on(240 * DEGREES, R, c)
        coords = M(R"\left(-\tfrac12,\; -\tfrac{\sqrt3}{2}\right)", size=22, color=C_ANG).next_to(P, LEFT, buff=0.12)
        self.zoom_to(P + 0.3 * LEFT, scale=0.3, run_time=1.8)
        self.play(FadeIn(coords, shift=0.05 * LEFT))
        self.hold()
        self.zoom_reset()
        self.say("Y otra idea clave: en el círculo de radio 1, el ángulo en radianes es igual al largo del arco "
                 "recorrido. Por eso t puede ser cualquier número real.")
        arcwalk = always_redraw(lambda: Arc(0, theta.get_value(), radius=R, arc_center=c).set_stroke(C_ANG, 6))
        self.add(arcwalk)
        self.play(theta.animate.set_value(300 * DEGREES), run_time=2)
        self.hold(0.5)
        for m in (pic, cos_v, sen_v, arcwalk):
            m.clear_updaters()
        self.end_section()


class S03_PuntoCualquiera(MBScene):
    def construct(self):
        self.mark("Un punto fuera del círculo")
        self.set_header(R"r = \sqrt{x^2 + y^2}", "Con cualquier punto", C_SEN, P_SEN)
        k = 0.42
        c = 0.9 * RIGHT + 2.6 * UP
        axes = VGroup(Line(c + 4.4 * LEFT, c + 1.5 * RIGHT), Line(c + 2.6 * DOWN, c + 1.4 * UP)).set_stroke(MUTED, 2)
        P = c + k * np.array([-4, -3, 0])
        dot = Dot(P, radius=0.12).set_color(C_ANG)
        lab = M(R"P(-4, -3)", size=36, color=C_ANG).next_to(dot, LEFT, buff=0.15)
        self.say("El libro tiene este ejemplo: el lado terminal pasa por el punto menos 4, menos 3, que no está en "
                 "la circunferencia unitaria.", fox=True)
        self.play(ShowCreation(axes))
        self.play(GrowFromCenter(dot), FadeIn(lab))
        side = Line(c, P).set_stroke(INK, 3)
        horiz = Line(c, c + k * np.array([-4, 0, 0])).set_stroke(C_COS, 6)
        vert = Line(c + k * np.array([-4, 0, 0]), P).set_stroke(C_SEN, 6)
        r_lab = M("r = 5", size=34, color=INK).move_to((c + P) / 2 + 0.35 * RIGHT + 0.25 * DOWN)
        self.say("Su distancia al origen es r, con Pitágoras: raíz de 16 más 9, que da 5.")
        self.play(ShowCreation(side), ShowCreation(horiz), ShowCreation(vert))
        self.play(FadeIn(r_lab))
        self.hold()
        unit = Circle(radius=k * 5).move_to(c).set_stroke(INK, 2, opacity=0.5)
        shrink = Dot(c + k * np.array([-0.8, -0.6, 0]) * 5, radius=0.1).set_color(C_ANG)
        self.say("Si encogemos todo para que el radio sea 1, el punto se vuelve menos cuatro quintos, menos tres "
                 "quintos. Por eso seno es y sobre r y coseno es x sobre r.")
        self.play(ShowCreation(unit))
        vals = VGroup(
            M(SEN + R" t = \frac{y}{r} = -\frac35", size=42, color=C_SEN),
            M(R"\cos t = \frac{x}{r} = -\frac45", size=42, color=C_COS),
            M(R"\tan t = \frac{y}{x} = \frac{-3}{-4} = \frac34", size=42, color=C_TAN),
        ).arrange(DOWN, buff=0.3).move_to(2.8 * DOWN)
        for v in vals:
            self.play(Write(v), run_time=0.9)
        self.hold(0.5)
        self.end_section()


class S04_Vueltas(MBScene):
    def construct(self):
        self.mark("Vueltas y más vueltas")
        self.set_header(R"2\pi", "Funciones periódicas", C_TAN, P_TAN)
        R, c = 2.2, 1.8 * UP
        axes = get_trig_axes(R, c)
        theta = ValueTracker(60 * DEGREES)
        pic = unit_scene(R, c, theta)
        turns = always_redraw(lambda: T(f"t = {theta.get_value() / PI:.2f} π", size=34, color=C_ANG).move_to(c + 3.2 * DOWN))
        self.say("Si a t le sumamos una vuelta completa, dos pi, el punto da la vuelta y cae en el mismo lugar.", fox=True)
        self.play(ShowCreation(axes))
        self.add(pic, turns)
        self.play(theta.animate.set_value(60 * DEGREES + TAU), run_time=4, rate_func=smooth)
        self.hold()
        eqs = VGroup(
            M(SEN + R"(t + 2\pi) = " + SEN + R" t", size=44, color=C_SEN),
            M(R"\cos(t + 2\pi) = \cos t", size=44, color=C_COS),
        ).arrange(DOWN, buff=0.3).move_to(3.8 * DOWN)
        self.say("Por eso el seno y el coseno se repiten cada dos pi: son funciones periódicas, como el ciclo del día o de las estaciones.")
        self.play(Write(eqs[0]))
        self.play(Write(eqs[1]))
        self.hold(0.5)
        pic.clear_updaters(); turns.clear_updaters()
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Circunferencia unitaria", "radio 1 · P(t) = (cos t, sen t)", C_COS),
        ("Cualquier punto", "sen = y / r · cos = x / r · r = √(x² + y²)", C_SEN),
        ("Periodo", "una vuelta más, 2π, deja todo igual", C_TAN),
    ]
    recap_say = ("Repasemos: en la circunferencia unitaria el coseno es la x y el seno es la y del punto; con cualquier "
                 "punto se divide entre r; y una vuelta completa no cambia nada.")
    practice = "Ahora, el juego:\natrapa en la circunferencia\nel punto que te piden"
