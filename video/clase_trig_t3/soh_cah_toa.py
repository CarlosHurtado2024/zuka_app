"""
Clase T3 · SOH · CAH · TOA (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Nombrar los lados respecto al ángulo (al cambiar de
ángulo se intercambian opuesto y adyacente), semejanza con zoom hacia afuera a un triángulo gigante,
las tres razones con el triángulo 8-15-17 y Pitágoras con 7-24-25. Manual de la UdeA §13.2.

    manimgl soh_cah_toa.py S02_Semejanza -w
"""
from trig_scenes import *


def right_triangle(a, b, origin=ORIGIN, scale=1.0):
    """Triángulo con el ángulo θ en `origin`, cateto adyacente a (horizontal) y opuesto b (vertical)."""
    o = np.array(origin)
    A, B, Cc = o, o + scale * a * RIGHT, o + scale * a * RIGHT + scale * b * UP
    tri = Polygon(A, B, Cc).set_stroke(INK, 3).set_fill(C_COS, 0.08)
    sq = Square(0.28).set_stroke(MUTED, 2).move_to(B + 0.14 * (LEFT + UP))
    return VGroup(tri, sq), (A, B, Cc)


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T3"
    title = "SOH · CAH · TOA"
    subtitle = "Las razones de un triángulo rectángulo"


class S01_Lados(MBScene):
    def construct(self):
        self.mark("Los tres lados")
        self.set_header(R"\triangle", "Opuesto, adyacente, hipotenusa", C_COS, P_COS)
        tri, (A, B, Cc) = right_triangle(4, 3, origin=2.6 * LEFT + 0.3 * UP, scale=1.3)
        theta = get_angle_arc(np.arctan2(3, 4), 0.75, A)
        th = M(R"\theta", size=46, color=C_ANG).move_to(A + 1.0 * RIGHT + 0.28 * UP)
        self.say("En un triángulo rectángulo, el lado más largo, frente al ángulo recto, es la hipotenusa. "
                 "Los otros dos se llaman catetos.", fox=True)
        self.play(ShowCreation(tri))
        hip = Line(A, Cc).set_stroke(C_ANG, 7)
        hip_l = TB("hipotenusa", size=28, color=C_ANG).move_to((A + Cc) / 2 + 0.5 * UP + 0.4 * LEFT).rotate(np.arctan2(3, 4))
        self.play(ShowCreation(hip), FadeIn(hip_l))
        self.hold()
        self.say("Los catetos se nombran según el ángulo que miramos. Para theta: el que está enfrente es el "
                 "opuesto, y el que lo toca es el adyacente.")
        self.play(ShowCreation(theta), FadeIn(th))
        op = Line(B, Cc).set_stroke(C_SEN, 7)
        ady = Line(A, B).set_stroke(C_COS, 7)
        op_l = TB("opuesto", size=28, color=C_SEN).next_to(op, RIGHT, buff=0.2)
        ady_l = TB("adyacente", size=28, color=C_COS).next_to(ady, DOWN, buff=0.2)
        self.play(ShowCreation(op), FadeIn(op_l))
        self.play(ShowCreation(ady), FadeIn(ady_l))
        self.hold()

        self.mark("Cambia el ángulo, cambian los nombres")
        alpha = Arc(PI + np.arctan2(3, 4), np.arctan2(4, 3), radius=0.75, arc_center=Cc).set_stroke(C_TAN, 5)
        al = M(R"\alpha", size=46, color=C_TAN).move_to(Cc + 1.0 * DOWN + 0.3 * LEFT)
        self.say("Ahora miremos desde el otro ángulo agudo, alfa. La hipotenusa sigue igual, pero el opuesto "
                 "y el adyacente se intercambian.")
        self.play(FadeOut(theta), FadeOut(th), ShowCreation(alpha), FadeIn(al))
        op2 = TB("adyacente", size=28, color=C_COS).move_to(op_l)
        ady2 = TB("opuesto", size=28, color=C_SEN).move_to(ady_l)
        self.play(op.animate.set_stroke(C_COS), ady.animate.set_stroke(C_SEN),
                  FadeTransform(op_l, op2), FadeTransform(ady_l, ady2), run_time=1.5)
        rule = T("Opuesto y adyacente dependen\ndel ángulo que miras", size=30, color=C_ANG, alignment="CENTER").move_to(3.0 * DOWN)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S02_Semejanza(MBScene):
    def construct(self):
        self.mark("Mismo ángulo, misma forma")
        self.set_header(R"\sim", "Triángulos semejantes", C_COS, P_COS)
        o = 3.3 * LEFT + 1.2 * DOWN
        ang = np.arctan2(3, 4)
        tris = VGroup()
        for k, s in enumerate([0.55, 1.1, 1.65]):
            t, _ = right_triangle(4, 3, origin=o, scale=s)
            t[0].set_fill(C_COS, 0.06 + 0.04 * k)
            tris.add(t)
        arc = get_angle_arc(ang, 0.6, o)
        self.say("Dibuja tres triángulos rectángulos con el mismo ángulo theta, de tamaños distintos. "
                 "Son la misma forma, como una foto ampliada.", fox=True)
        self.play(LaggedStartMap(ShowCreation, tris, lag_ratio=0.4), ShowCreation(arc), run_time=2.5)
        self.hold()
        ratios = VGroup(
            M(R"\frac{1.65}{2.75} = 0.6", size=34),
            M(R"\frac{3.3}{5.5} = 0.6", size=34),
            M(R"\frac{4.95}{8.25} = 0.6", size=34),
        ).arrange(RIGHT, buff=0.4).move_to(3.4 * DOWN)
        lab = T("opuesto ÷ hipotenusa", size=26, color=C_SEN).next_to(ratios, UP, buff=0.3)
        self.say("Dividamos el opuesto entre la hipotenusa en cada uno. ¡Siempre da lo mismo!")
        self.play(FadeIn(lab))
        self.play(LaggedStartMap(FadeIn, ratios, lag_ratio=0.4, shift=0.2 * UP), run_time=2)
        self.hold()

        self.mark("Zoom hacia afuera")
        self.say("Alejemos la cámara y dibujemos uno gigante, del tamaño de un edificio. La razón sigue siendo 0.6.")
        giant, _ = right_triangle(4, 3, origin=o, scale=3.2)
        giant[0].set_fill(C_COS, 0.05).set_stroke(C_COS, 6)
        self.play(self.frame.animate.set_height(FRAME_HEIGHT * 2.0).move_to(o + 6.4 * RIGHT + 5.0 * UP), run_time=2.5)
        self.play(ShowCreation(giant), run_time=2)
        big = M(R"\frac{9.6}{16} = 0.6", size=110, color=C_SEN).move_to(o + 9.0 * RIGHT + 2.6 * UP)
        self.play(Write(big))
        self.hold()
        self.zoom_reset(run_time=2)
        self.play(FadeOut(VGroup(giant, big)))
        key = T("La razón depende solo del ángulo,\nno del tamaño del triángulo", size=30, color=C_ANG, alignment="CENTER").move_to(4.3 * UP)
        self.say("Esa es la gran idea: la razón entre los lados depende solo del ángulo. Por eso podemos ponerle nombre.")
        self.play(FadeIn(key, shift=0.2 * DOWN))
        self.hold(0.5)
        self.end_section()


class S03_Razones(MBScene):
    def construct(self):
        self.mark("SOH CAH TOA")
        self.set_header(R"\text{sen}\ \cos\ \tan", "Las tres razones", C_SEN, P_SEN)
        tri, (A, B, Cc) = right_triangle(15, 8, origin=3.2 * LEFT + 1.4 * UP, scale=0.42)
        ang = get_angle_arc(np.arctan2(8, 15), 0.8, A)
        labs = VGroup(
            M("15", size=40, color=C_COS).next_to(Line(A, B), DOWN, buff=0.15),
            M("8", size=40, color=C_SEN).next_to(Line(B, Cc), RIGHT, buff=0.15),
            M("17", size=40, color=C_ANG).move_to((A + Cc) / 2 + 0.45 * UP + 0.25 * LEFT),
            M(R"\theta", size=40, color=C_ANG).move_to(A + 1.05 * RIGHT + 0.25 * UP),
        )
        self.say("Tomemos un triángulo de lados 8, 15 y 17, con theta frente al lado 8. Cada razón tiene un nombre.", fox=True)
        self.play(ShowCreation(tri), ShowCreation(ang), FadeIn(labs))
        self.hold()
        rows = VGroup(
            VGroup(TB("SOH", size=34, color=C_SEN), M(R"\operatorname{sen}\theta = \frac{\text{op}}{\text{hip}} = \frac{8}{17}", size=42)).arrange(RIGHT, buff=0.4),
            VGroup(TB("CAH", size=34, color=C_COS), M(R"\cos\theta = \frac{\text{ady}}{\text{hip}} = \frac{15}{17}", size=42)).arrange(RIGHT, buff=0.4),
            VGroup(TB("TOA", size=34, color=C_TAN), M(R"\tan\theta = \frac{\text{op}}{\text{ady}} = \frac{8}{15}", size=42)).arrange(RIGHT, buff=0.4),
        ).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to(1.9 * DOWN)
        says = [
            "Seno: opuesto sobre hipotenusa, ocho diecisieteavos. En inglés, SOH: sine, opposite, hypotenuse.",
            "Coseno: adyacente sobre hipotenusa, quince diecisieteavos. CAH.",
            "Tangente: opuesto sobre adyacente, ocho quinceavos. TOA. Sohcahtoa, como un grito de guerra.",
        ]
        for row, s in zip(rows, says):
            self.say(s)
            self.play(FadeIn(row, shift=0.2 * RIGHT))
            self.hold()
        note = T("En inglés se escribe sin θ; en español, sen θ", size=24, color=MUTED).next_to(rows, DOWN, buff=0.4)
        self.play(FadeIn(note))
        self.hold(0.5)
        self.end_section()


class S04_Pitagoras(MBScene):
    def construct(self):
        self.mark("Falta un lado")
        self.set_header(R"a^2 + b^2 = c^2", "Pitágoras al rescate", C_ANG, P_ANG)
        s = 0.11
        o = 2.4 * LEFT + 1.0 * UP
        A, B, Cc = o, o + 24 * s * RIGHT, o + 24 * s * RIGHT + 7 * s * UP
        tri = Polygon(A, B, Cc).set_stroke(INK, 3).set_fill(C_COS, 0.1)
        sq_a = Square(24 * s).next_to(Line(A, B), DOWN, buff=0).set_fill(C_COS, 0.25).set_stroke(C_COS, 2)
        sq_b = Square(7 * s).next_to(Line(B, Cc), RIGHT, buff=0).set_fill(C_SEN, 0.3).set_stroke(C_SEN, 2)
        hyp_len = 25 * s
        sq_c = Square(hyp_len).set_fill(C_ANG, 0.2).set_stroke(C_ANG, 2)
        sq_c.rotate(np.arctan2(7, 24)).move_to((A + Cc) / 2 + (hyp_len / 2) * np.array([-np.sin(np.arctan2(7, 24)), np.cos(np.arctan2(7, 24)), 0]))
        self.say("Para usar las razones necesitas los tres lados. Si conoces dos, el tercero sale con Pitágoras. "
                 "Este triángulo tiene catetos 7 y 24.", fox=True)
        self.play(ShowCreation(tri))
        la = M("24", size=38, color=C_COS).move_to(sq_a)
        lb = M("7", size=34, color=C_SEN).next_to(sq_b, RIGHT, buff=0.1)
        self.play(FadeIn(sq_a), FadeIn(sq_b), FadeIn(la), FadeIn(lb))
        self.hold()
        self.say("Pitágoras dice que el cuadrado sobre la hipotenusa tiene tanta área como los otros dos juntos: "
                 "49 más 576 es 625, y la raíz de 625 es 25.")
        self.play(FadeIn(sq_c))
        eqs = VGroup(
            M(R"7^2 + 24^2 = 49 + 576 = 625", size=40),
            M(R"c = \sqrt{625} = 25", size=50, color=C_ANG),
        ).arrange(DOWN, buff=0.3).move_to(3.2 * DOWN)
        self.play(Write(eqs[0]))
        self.play(Write(eqs[1]))
        self.hold()
        self.mark("Y ahora, las razones")
        self.play(FadeOut(VGroup(sq_a, sq_b, sq_c, la, lb)), FadeOut(eqs))
        labs = VGroup(
            M("24", size=36, color=C_COS).next_to(Line(A, B), DOWN, buff=0.15),
            M("7", size=36, color=C_SEN).next_to(Line(B, Cc), RIGHT, buff=0.15),
            M("25", size=36, color=C_ANG).move_to((A + Cc) / 2 + 0.4 * UP),
        )
        ang = get_angle_arc(np.arctan2(7, 24), 0.9, A)
        rr = VGroup(
            M(R"\operatorname{sen}\theta = \frac{7}{25}", size=44, color=C_SEN),
            M(R"\cos\theta = \frac{24}{25}", size=44, color=C_COS),
            M(R"\tan\theta = \frac{7}{24}", size=44, color=C_TAN),
        ).arrange(DOWN, buff=0.35).move_to(2.3 * DOWN)
        self.say("Con los tres lados, las razones del ángulo theta frente al 7 salen solas.")
        self.play(FadeIn(labs), ShowCreation(ang))
        self.play(LaggedStartMap(FadeIn, rr, lag_ratio=0.35, shift=0.2 * UP), run_time=2)
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Los lados", "hipotenusa frente al recto · opuesto y adyacente según el ángulo", C_ANG),
        ("Semejanza", "mismo ángulo, misma razón, sin importar el tamaño", C_COS),
        ("SOH · CAH · TOA", "sen = op/hip · cos = ady/hip · tan = op/ady", C_SEN),
        ("Pitágoras", "a² + b² = c² para hallar el lado que falta", C_TAN),
    ]
    recap_say = ("Repasemos: los catetos se nombran según el ángulo; la razón entre lados depende solo del ángulo; "
                 "sohcahtoa te dice cuál es cuál; y Pitágoras completa el lado que falte.")
    practice = "Ahora, el juego:\narma triángulos con la razón\nque te piden"
