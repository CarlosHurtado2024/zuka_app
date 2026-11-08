"""
Clase T17 · Ley de cosenos y área (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Pitágoras corregido: al abrir el ángulo C el término
−2ab cos C pasa de restar a sumar; LAL con a = 5, b = 8, C = 60° → c = 7; LLL para hallar un ángulo
(4, 5, 6); área ½ab sen C y fórmula de Herón con 5-6-7 (zoom a la raíz). Manual de la UdeA §14.2.

    manimgl ley_cosenos.py S01_Corregido -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T17"
    title = "Ley de cosenos\ny área"
    subtitle = "Pitágoras para todos los triángulos"


class S01_Corregido(MBScene):
    def construct(self):
        self.mark("Abrir el ángulo")
        self.set_header(R"c^2 = a^2 + b^2\;?", "Pitágoras corregido", C_ANG, P_ANG)
        a, b = 2.6, 3.4
        Cpt = 1.4 * LEFT + 0.8 * UP
        ang = ValueTracker(90 * DEGREES)
        Apt = Cpt + b * RIGHT
        Bpt = lambda: Cpt + a * np.array([np.cos(ang.get_value()), np.sin(ang.get_value()), 0])
        tri = always_redraw(lambda: VGroup(
            Line(Cpt, Apt).set_stroke(C_COS, 6), Line(Cpt, Bpt()).set_stroke(C_SEN, 6), Line(Apt, Bpt()).set_stroke(C_TAN, 6),
            Arc(start_angle=0, angle=ang.get_value(), radius=0.6, arc_center=Cpt).set_stroke(C_ANG, 5),
        ))
        labs = VGroup(M("b", size=40, color=C_COS).next_to(Line(Cpt, Apt), DOWN, buff=0.15), M("C", size=40, color=C_ANG).next_to(Cpt, DL, buff=0.1))
        self.say("Pitágoras funciona cuando el ángulo C es recto. ¿Qué pasa con el lado c si abrimos o cerramos ese ángulo?", fox=True)
        side_labs = always_redraw(lambda: VGroup(
            M("a", size=40, color=C_SEN).move_to((Cpt + Bpt()) / 2 + 0.35 * LEFT),
            M("c", size=40, color=C_TAN).move_to((Apt + Bpt()) / 2 + 0.35 * UR),
        ))
        self.add(tri, side_labs)
        self.play(FadeIn(labs))
        def readout():
            C = ang.get_value()
            c2 = a * a + b * b - 2 * a * b * np.cos(C)
            return VGroup(
                M(R"C = " + f"{round(C / DEGREES)}" + R"^\circ", size=40, color=C_ANG),
                M(R"c^2 = a^2 + b^2 " + ("-" if np.cos(C) >= 0 else "+") + f" {abs(round(2 * a * b * np.cos(C)))}", size=40, color=C_TAN),
            ).arrange(DOWN, buff=0.25).move_to(2.0 * DOWN)
        r = always_redraw(readout)
        self.add(r)
        self.say("Si lo cerramos, c se encoge: hay que restarle algo a a cuadrado más b cuadrado.")
        self.play(ang.animate.set_value(45 * DEGREES), run_time=3)
        self.hold()
        self.say("Si lo abrimos, c se estira: hay que sumarle. Ese algo es dos a b coseno de C, que cambia de signo justo en noventa grados.")
        self.play(ang.animate.set_value(140 * DEGREES), run_time=4)
        self.hold()
        self.play(ang.animate.set_value(90 * DEGREES), run_time=2)
        tri.clear_updaters()
        r.clear_updaters()
        side_labs.clear_updaters()
        law = M(R"c^2 = a^2 + b^2 - 2ab\cos C", size=60, color=C_TAN).move_to(3.8 * DOWN)
        card = get_card(law, color=C_TAN, fill=PEACH)
        self.say("Esa es la ley de cosenos. En noventa grados el coseno es cero y vuelve a ser Pitágoras.")
        self.play(FadeIn(card), Write(law))
        self.hold(0.5)
        self.end_section()


class S02_LAL(MBScene):
    def construct(self):
        self.mark("Dos lados y el ángulo entre ellos")
        self.set_header(R"\text{LAL}", "El tercer lado", C_TAN, P_TAN)
        Cpt = 2.8 * LEFT + 2.2 * UP
        k = 0.62
        Apt = Cpt + 8 * k * RIGHT
        Bpt = Cpt + 5 * k * np.array([np.cos(PI / 3), np.sin(PI / 3), 0])
        tri = VGroup(Line(Cpt, Apt).set_stroke(C_COS, 6), Line(Cpt, Bpt).set_stroke(C_SEN, 6), Line(Apt, Bpt).set_stroke(C_TAN, 6, opacity=0.4))
        arc = Arc(start_angle=0, angle=PI / 3, radius=0.6, arc_center=Cpt).set_stroke(C_ANG, 5)
        labs = VGroup(M("8", size=38, color=C_COS).next_to(tri[0], DOWN, buff=0.15), M("5", size=38, color=C_SEN).next_to(tri[1].get_center(), UL, buff=0.1),
                      M(R"60^\circ", size=34, color=C_ANG).next_to(arc, RIGHT, buff=0.1).shift(0.15 * UP), M("c = ?", size=38, color=C_TAN).next_to(tri[2].get_center(), UR, buff=0.1))
        self.say("Un parque tiene dos senderos rectos de cinco y ocho metros que salen del mismo punto formando sesenta grados. ¿Qué tan lejos quedan sus extremos?", fox=True)
        self.play(ShowCreation(tri[0]), ShowCreation(tri[1]), ShowCreation(arc))
        self.play(FadeIn(labs[:3]))
        self.play(ShowCreation(tri[2]), FadeIn(labs[3]))
        s = VGroup(
            M(R"c^2 = 5^2 + 8^2 - 2(5)(8)\cos60^\circ", size=42),
            M(R"= 25 + 64 - 80\cdot\tfrac12", size=46),
            M(R"= 89 - 40 = 49", size=46),
            M(R"c = 7\text{ m}", size=60, color=C_TAN),
        ).arrange(DOWN, buff=0.45).move_to(1.8 * DOWN)
        self.say("Ley de cosenos con a cinco, b ocho y C sesenta.")
        self.play(Write(s[0]), run_time=1.8)
        self.say("Coseno de sesenta es un medio: el término que se resta vale cuarenta.")
        self.play(Write(s[1]))
        self.play(Write(s[2]))
        self.say("c al cuadrado es cuarenta y nueve: los extremos están a siete metros. Un número redondo, de regalo.")
        self.play(Write(s[3]))
        self.play(tri[2].animate.set_stroke(opacity=1), Transform(labs[3], M("c = 7", size=38, color=C_TAN).move_to(labs[3])))
        self.hold(0.5)
        self.end_section()


class S03_LLL(MBScene):
    def construct(self):
        self.mark("Tres lados, un ángulo")
        self.set_header(R"\text{LLL}", "Despejar el ángulo", C_COS, P_COS)
        s = VGroup(
            M(R"\cos C = \frac{a^2 + b^2 - c^2}{2ab}", size=56, color=C_COS),
            M(R"a = 4,\; b = 5,\; c = 6", size=44, color=C_ANG),
            M(R"\cos C = \frac{16 + 25 - 36}{2(4)(5)} = \frac{5}{40} = 0.125", size=42),
            M(R"C = \cos^{-1}(0.125) \approx 82.8^\circ", size=50, color=C_COS),
        ).arrange(DOWN, buff=0.55).move_to(2.2 * UP)
        self.say("Si conoces los tres lados, despeja el coseno del ángulo. Así se sabe qué tan abierto es cada esquina.", fox=True)
        self.play(Write(s[0]))
        self.hold()
        self.say("Con lados cuatro, cinco y seis, buscamos el ángulo frente al lado más largo, el seis.")
        self.play(FadeIn(s[1]))
        self.play(Write(s[2]), run_time=2)
        self.say("Coseno de C es cero coma uno dos cinco, y el coseno inverso de la clase anterior nos da el ángulo: casi ochenta y tres grados.")
        self.play(Write(s[3]))
        self.hold()
        tip = VGroup(
            T("Si el numerador sale negativo,", size=28),
            T("el ángulo es obtuso (más de 90°).", size=28, color=C_ANG),
        ).arrange(DOWN, buff=0.15).move_to(3.6 * DOWN)
        self.say("Un detalle útil: si el numerador sale negativo, el coseno es negativo y el ángulo es obtuso. El coseno inverso lo detecta solito.")
        self.play(FadeIn(tip, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Area(MBScene):
    def construct(self):
        self.mark("Área con un ángulo")
        self.set_header(R"\tfrac12 ab\," + SEN + R" C", "El área", C_SEN, P_SEN)
        A = 3.0 * LEFT + 2.4 * UP
        B = A + 6.0 * RIGHT
        Cc = A + 3.6 * np.array([np.cos(50 * DEGREES), np.sin(50 * DEGREES), 0])
        tri = Polygon(A, B, Cc).set_stroke(INK, 4).set_fill(C_SEN, 0.15)
        foot = np.array([Cc[0], A[1], 0])
        h = DashedLine(Cc, foot).set_stroke(C_ANG, 4)
        self.say("El área de siempre es base por altura sobre dos. Si no conoces la altura, la trigonometría la fabrica.", fox=True)
        names = VGroup(
            M("C", size=36, color=C_ANG).next_to(A, LEFT, buff=0.12),
            M("a", size=36, color=C_COS).next_to(Line(A, B), DOWN, buff=0.15),
            M("b", size=36, color=C_SEN).next_to(Line(A, Cc).get_center(), UL, buff=0.1),
            M("h", size=36, color=C_ANG).next_to(h, RIGHT, buff=0.1),
        )
        ang_c = Arc(start_angle=0, angle=50 * DEGREES, radius=0.6, arc_center=A).set_stroke(C_ANG, 4)
        self.play(DrawBorderThenFill(tri))
        self.play(ShowCreation(h), ShowCreation(ang_c), FadeIn(names))
        s = VGroup(
            M(R"h = b\," + SEN + R" C", size=44, color=C_ANG),
            M(R"\text{Area} = \tfrac12\, a\, b\, " + SEN + R" C", size=56, color=C_SEN),
        ).arrange(DOWN, buff=0.4).move_to(0.6 * DOWN)
        self.say("La altura es el otro lado por el seno del ángulo. Entonces el área es un medio por los dos lados por el seno del ángulo entre ellos.")
        self.play(Write(s[0]))
        self.play(Write(s[1]))
        self.hold()
        self.mark("Herón: solo lados")
        self.clear_scene()
        self.set_header(R"\sqrt{s(s-a)(s-b)(s-c)}", "Fórmula de Herón", C_TAN, P_TAN)
        her = VGroup(
            M(R"s = \frac{a + b + c}{2}", size=46, color=C_ANG),
            M(R"\text{Area} = \sqrt{s(s - a)(s - b)(s - c)}", size=46, color=C_TAN),
        ).arrange(DOWN, buff=0.4).move_to(3.8 * UP)
        self.say("Y si solo tienes los tres lados, hace dos mil años Herón de Alejandría dejó esta joya. Primero el semiperímetro, la mitad del contorno.", fox=True)
        self.play(Write(her[0]))
        self.play(Write(her[1]))
        steps = VGroup(
            M(R"5,\,6,\,7:\quad s = \frac{18}{2} = 9", size=44),
            M(R"\text{Area} = \sqrt{9\cdot 4\cdot 3\cdot 2} = \sqrt{216}", size=44),
            M(R"= \sqrt{36\cdot 6} = 6\sqrt6 \approx 14.7", size=48, color=C_TAN),
        ).arrange(DOWN, buff=0.45).next_to(her, DOWN, buff=0.8)
        self.say("Con lados cinco, seis y siete, el semiperímetro es nueve.")
        self.play(Write(steps[0]))
        self.say("Las restas dan cuatro, tres y dos. Multiplicamos con el nueve: doscientos dieciséis.")
        self.play(Write(steps[1]), run_time=1.8)
        self.mark("Zoom a la raíz")
        self.zoom_to(steps[1], scale=0.4)
        split = M(R"216 = 36\cdot 6", size=26, color=C_ANG).next_to(steps[1], DOWN, buff=0.15)
        self.say("Para simplificar la raíz, buscamos un cuadrado perfecto escondido: treinta y seis por seis.")
        self.play(FadeIn(split))
        self.hold()
        self.zoom_reset()
        self.play(FadeOut(split), Write(steps[2]))
        self.say("Resultado: seis raíz de seis, unos catorce coma siete unidades cuadradas, sin medir ninguna altura.")
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Ley de cosenos", "c² = a² + b² − 2ab cos C", C_TAN),
        ("LAL", "da el tercer lado", C_SEN),
        ("LLL", "cos C = (a² + b² − c²) / 2ab", C_COS),
        ("Área", "½ ab sen C  ·  Herón con los tres lados", C_ANG),
    ]
    recap_say = ("Repasemos: la ley de cosenos es Pitágoras corregido; con dos lados y el ángulo entre ellos da el tercero; con tres "
                 "lados da los ángulos; y el área sale con un medio a b seno de C o con Herón.")
    practice = "Ahora, el juego:\ndobla el brazo robot"
