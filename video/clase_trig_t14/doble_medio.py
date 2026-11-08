"""
Clase T14 · Ángulo doble y ángulo medio (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Dos corredores en una pista, uno al doble del otro; la
suma con y = x da sen 2x y las tres caras de cos 2x; con cos θ = 4/5 se sacan sen 2θ y cos 2θ; reducir
potencias con la gráfica de sen²x; y cos 15° como ángulo medio, con zoom a la decisión del signo.
Manual de la UdeA §13.8.

    manimgl doble_medio.py S01_Corredores -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T14"
    title = "Ángulo doble\ny ángulo medio"
    subtitle = "Duplicar y partir sin calculadora"


class S01_Corredores(MBScene):
    def construct(self):
        self.mark("La carrera")
        self.set_header(R"\theta,\;2\theta", "Dos corredores", C_ANG, P_ANG)
        c, R1, R2 = 1.8 * UP, 1.9, 2.7
        lanes = VGroup(Circle(radius=R1).move_to(c).set_stroke(C_COS, 10, opacity=0.35),
                       Circle(radius=R2).move_to(c).set_stroke(C_SEN, 10, opacity=0.35))
        start = Line(c + (R1 - 0.3) * RIGHT, c + (R2 + 0.3) * RIGHT).set_stroke(INK, 4)
        t = ValueTracker(0)
        slow = always_redraw(lambda: Dot(point_on(t.get_value(), R1, c), radius=0.2).set_color(C_COS))
        fast = always_redraw(lambda: Dot(point_on(2 * t.get_value(), R2, c), radius=0.2).set_color(C_SEN))
        trail1 = always_redraw(lambda: Arc(start_angle=0, angle=max(t.get_value(), 1e-3), radius=R1, arc_center=c).set_stroke(C_COS, 5))
        trail2 = always_redraw(lambda: Arc(start_angle=0, angle=max(2 * t.get_value(), 1e-3), radius=R2, arc_center=c).set_stroke(C_SEN, 5))
        self.say("Dos atletas salen juntos. El azul corre a su ritmo y el rosa siempre va al doble: cuando el azul recorre theta, "
                 "el rosa recorre dos theta.", fox=True)
        self.play(ShowCreation(lanes), ShowCreation(start))
        self.add(trail1, trail2, slow, fast)
        lab = always_redraw(lambda: M(R"\theta = " + f"{round(t.get_value() / DEGREES)}" + R"^\circ \qquad 2\theta = " + f"{round(2 * t.get_value() / DEGREES)}" + R"^\circ", size=40).move_to(2.0 * DOWN))
        self.add(lab)
        self.play(t.animate.set_value(30 * DEGREES), run_time=2)
        self.hold()
        self.say("Cuando el azul llega a treinta grados, el rosa ya va en sesenta. La pregunta de esta clase: si conozco el seno y el "
                 "coseno del azul, ¿puedo saber dónde está el rosa sin medir?")
        self.play(t.animate.set_value(75 * DEGREES), run_time=2.5)
        self.hold()
        for m in (slow, fast, trail1, trail2, lab):
            m.clear_updaters()
        self.end_section()


class S02_Formulas(MBScene):
    def construct(self):
        self.mark("Sumar un ángulo consigo mismo")
        self.set_header(R"x + x", "Del doble a la fórmula", C_SEN, P_SEN)
        s = VGroup(
            M(SEN + R"(x + y) = " + SEN + R" x\cos y + \cos x\," + SEN + R" y", size=40, color=MUTED),
            M(SEN + R"(x + x) = " + SEN + R" x\cos x + \cos x\," + SEN + R" x", size=40),
            M(SEN + R" 2x = 2\," + SEN + R" x\cos x", size=58, color=C_SEN),
        ).arrange(DOWN, buff=0.5).move_to(3.4 * UP)
        self.say("El truco es la fórmula de suma con los dos ángulos iguales. Cambia y por x.", fox=True)
        self.play(FadeIn(s[0]))
        self.play(TransformFromCopy(s[0], s[1]), run_time=1.6)
        self.say("Los dos términos son el mismo: se juntan. Seno de dos x es dos seno de x coseno de x.")
        self.play(Write(s[2]))
        self.play(ShowCreation(SurroundingRectangle(s[2], buff=0.15).set_stroke(C_SEN, 3)))
        self.hold()
        self.mark("Tres caras del coseno")
        c = VGroup(
            M(R"\cos 2x = \cos^2 x - " + SEN + R"^2 x", size=48, color=C_COS),
            M(R"= 1 - 2\," + SEN + R"^2 x", size=48, color=C_COS),
            M(R"= 2\cos^2 x - 1", size=48, color=C_COS),
        ).arrange(DOWN, buff=0.4, aligned_edge=LEFT).next_to(s, DOWN, buff=0.8)
        self.say("Con el coseno sale coseno al cuadrado menos seno al cuadrado.")
        self.play(Write(c[0]))
        self.hold()
        self.say("Y como coseno al cuadrado es uno menos seno al cuadrado, se puede escribir solo con senos, o solo con cosenos. "
                 "Tres caras de la misma fórmula: escoges la que te convenga.")
        self.play(Write(c[1]))
        self.play(Write(c[2]))
        self.hold(0.5)
        self.end_section()


class S03_Ejemplo(MBScene):
    def construct(self):
        self.mark("Con un dato")
        self.set_header(R"\cos\theta = \tfrac45", "Duplicar sin medir", C_COS, P_COS)
        R_, c = 2.3, 3.0 * UP + 1.2 * LEFT
        k = R_ / 5
        P = c + k * np.array([4, 3, 0])
        tri = VGroup(Line(c, [P[0], c[1], 0]).set_stroke(C_COS, 6), Line([P[0], c[1], 0], P).set_stroke(C_SEN, 6), Line(c, P).set_stroke(INK, 4))
        labs = VGroup(M("4", size=32, color=C_COS).next_to(tri[0], DOWN, buff=0.1), M("3", size=32, color=C_SEN).next_to(tri[1], RIGHT, buff=0.1),
                      M("5", size=32).move_to(tri[2].get_center() + 0.3 * UL))
        self.say("Si coseno de theta es cuatro quintos, con theta agudo, el triángulo es el famoso tres, cuatro, cinco: seno de theta es tres quintos.", fox=True)
        self.play(ShowCreation(tri), FadeIn(labs))
        self.hold()
        s = VGroup(
            M(SEN + R" 2\theta = 2\cdot\tfrac35\cdot\tfrac45 = \tfrac{24}{25}", size=46, color=C_SEN),
            M(R"\cos 2\theta = 2\left(\tfrac45\right)^2 - 1 = \tfrac{32}{25} - 1 = \tfrac{7}{25}", size=44, color=C_COS),
        ).arrange(DOWN, buff=0.5).move_to(0.6 * DOWN)
        self.say("Seno del doble: dos por tres quintos por cuatro quintos, veinticuatro veinticincoavos.")
        self.play(Write(s[0]))
        self.hold()
        self.say("Coseno del doble con la cara que solo usa cosenos: dos por dieciséis veinticincoavos menos uno, siete veinticincoavos.")
        self.play(Write(s[1]))
        self.hold()
        check = M(R"\left(\tfrac{24}{25}\right)^2 + \left(\tfrac{7}{25}\right)^2 = \tfrac{576 + 49}{625} = 1 \;\checkmark", size=38, color=C_Q).move_to(3.2 * DOWN)
        self.say("Comprobación de detective: sus cuadrados suman uno. El punto dos theta sí está en la circunferencia.")
        self.play(Write(check))
        self.hold(0.5)
        self.end_section()


class S04_Potencias(MBScene):
    def construct(self):
        self.mark("Reducir potencias")
        self.set_header(SEN + R"^2 x", "Bajar el cuadrado", C_TAN, P_TAN)
        s = VGroup(
            M(R"\cos 2x = 1 - 2\," + SEN + R"^2 x", size=44, color=MUTED),
            M(SEN + R"^2 x = \frac{1 - \cos 2x}{2}", size=54, color=C_SEN),
            M(R"\cos^2 x = \frac{1 + \cos 2x}{2}", size=54, color=C_COS),
        ).arrange(DOWN, buff=0.5).move_to(3.6 * UP)
        self.say("Despejando de las caras del coseno se cambia un cuadrado por un ángulo doble sin cuadrado. En cálculo esto es oro.", fox=True)
        self.play(FadeIn(s[0]))
        self.play(TransformFromCopy(s[0], s[1]), run_time=1.6)
        self.play(Write(s[2]))
        self.hold()
        ax = Axes(x_range=(0, 2 * PI, PI / 2), y_range=(-0.2, 1.2, 0.5), width=7.0, height=3.0,
                  axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False)).move_to(2.6 * DOWN)
        g = ax.get_graph(lambda x: np.sin(x) ** 2).set_stroke(C_SEN, 6)
        mid = DashedLine(ax.c2p(0, 0.5), ax.c2p(2 * PI, 0.5)).set_stroke(C_ANG, 2)
        self.say("Mira la gráfica de seno al cuadrado: es una onda de periodo pi que oscila alrededor de un medio, con amplitud un medio. "
                 "Justo lo que dice la fórmula: un medio menos un medio coseno de dos x.")
        self.play(ShowCreation(ax))
        self.play(ShowCreation(g), run_time=2)
        self.play(ShowCreation(mid))
        self.hold(0.5)
        self.end_section()


class S05_Medio(MBScene):
    def construct(self):
        self.mark("El ángulo medio")
        self.set_header(R"\tfrac{u}{2}", "Partir a la mitad", C_ANG, P_ANG)
        f = M(R"\cos\frac{u}{2} = \pm\sqrt{\frac{1 + \cos u}{2}}", size=54, color=C_COS).move_to(4.0 * UP)
        self.say("Si en la fórmula del coseno al cuadrado el ángulo se llama u sobre dos, aparece el ángulo medio. Fíjate en el más o menos.", fox=True)
        self.play(Write(f))
        self.hold()
        s = VGroup(
            M(R"\cos 15^\circ = \cos\frac{30^\circ}{2}", size=46, color=C_ANG),
            M(R"= \pm\sqrt{\frac{1 + \frac{\sqrt3}{2}}{2}} = \pm\sqrt{\frac{2 + \sqrt3}{4}}", size=44),
            M(R"= \pm\frac{\sqrt{2 + \sqrt3}}{2}", size=46),
        ).arrange(DOWN, buff=0.45).next_to(f, DOWN, buff=0.7)
        self.say("Coseno de quince grados es coseno de la mitad de treinta.")
        self.play(Write(s[0]))
        self.say("Reemplazamos coseno de treinta, raíz de tres medios, y ordenamos la fracción.")
        self.play(Write(s[1]), run_time=2)
        self.play(Write(s[2]))
        self.hold()
        self.mark("Zoom al signo")
        sign = s[2][1]
        self.zoom_to(s[2], scale=0.35)
        ring = Circle(radius=0.22).move_to(sign).set_stroke(C_I, 4)
        self.play(ShowCreation(ring))
        self.say("¿Más o menos? La fórmula no decide: decide el cuadrante del ángulo medio. Quince grados está en el primero, donde el coseno es positivo.")
        self.hold()
        self.zoom_reset()
        res = M(R"\cos 15^\circ = \frac{\sqrt{2 + \sqrt3}}{2} \approx 0.966", size=48, color=C_COS).move_to(3.4 * DOWN)
        self.play(FadeOut(ring), Write(res))
        self.say("Resultado: unos cero coma nueve seis seis. El mismo número de la clase pasada, escrito de otra forma. Dos caminos, la misma cima.")
        self.hold(0.5)
        self.end_section()


class S06_Cierre(TrigCierre):
    recap = [
        ("Seno doble", "sen 2x = 2 sen x cos x", C_SEN),
        ("Coseno doble", "cos²x − sen²x = 1 − 2sen²x = 2cos²x − 1", C_COS),
        ("Reducir potencias", "sen²x = (1 − cos 2x) / 2", C_TAN),
        ("Ángulo medio", "el signo ± lo decide el cuadrante de u/2", C_ANG),
    ]
    recap_say = ("Repasemos: el seno del doble es dos seno coseno; el coseno del doble tiene tres caras; despejando se reducen "
                 "potencias; y en el ángulo medio el cuadrante decide el signo.")
    practice = "Ahora, el juego:\nfrena a los corredores\njusto a tiempo"
