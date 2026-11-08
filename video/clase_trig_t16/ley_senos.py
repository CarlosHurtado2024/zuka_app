"""
Clase T16 · Ley de senos (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Un triángulo oblicuo, la altura que lo parte en dos
rectángulos y de ahí la ley; un AAL (A = 35°, B = 80°, a = 9) resuelto; y el compás del caso ambiguo
que barre la base: cero, uno o dos triángulos, con zoom al corte. Manual de la UdeA §14.1.

    manimgl ley_senos.py S04_Ambiguo -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def tri_points(A, b, c, origin):
    """Vértices A (origen), B (sobre la base, a distancia c) y C (lado b con ángulo A)."""
    o = np.array(origin)
    return o, o + c * RIGHT, o + b * np.array([np.cos(A), np.sin(A), 0])


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T16"
    title = "Ley de senos"
    subtitle = "Triángulos sin ángulo recto"


class S01_Oblicuo(MBScene):
    def construct(self):
        self.mark("Sin ángulo recto")
        self.set_header(R"\triangle", "Triángulos oblicuos", C_ANG, P_ANG)
        A, B, Cc = tri_points(55 * DEGREES, 4.2, 6.0, 3.1 * LEFT + 0.6 * UP)
        tri = Polygon(A, B, Cc).set_stroke(INK, 4).set_fill(C_COS, 0.08)
        names = VGroup(M("A", size=40).next_to(A, DL, buff=0.1), M("B", size=40).next_to(B, DR, buff=0.1), M("C", size=40).next_to(Cc, UP, buff=0.12))
        sides = VGroup(M("a", size=40, color=C_SEN).next_to(Line(B, Cc).get_center(), UR, buff=0.12),
                       M("b", size=40, color=C_COS).next_to(Line(A, Cc).get_center(), UL, buff=0.12),
                       M("c", size=40, color=C_TAN).next_to(Line(A, B).get_center(), DOWN, buff=0.15))
        self.say("Hasta ahora las razones vivían en triángulos rectángulos. Pero la mayoría de triángulos del mundo, el de una vela o el de un terreno, no tiene ángulo recto.", fox=True)
        self.play(ShowCreation(tri), FadeIn(names))
        self.say("Convención: cada lado se llama con la minúscula del vértice que tiene enfrente. El lado a está frente al ángulo A.")
        self.play(FadeIn(sides))
        self.hold()
        self.mark("La altura que lo parte")
        foot = np.array([Cc[0], A[1], 0])
        h = DashedLine(Cc, foot).set_stroke(C_ANG, 4)
        hl = M("h", size=40, color=C_ANG).next_to(h, RIGHT, buff=0.12)
        self.say("El truco: baja una altura desde C. El triángulo se parte en dos triángulos rectángulos, y ahí sí sabemos trabajar.")
        self.play(ShowCreation(h), FadeIn(hl))
        eqs = VGroup(
            M(R"h = b\," + SEN + R" A", size=46, color=C_COS),
            M(R"h = a\," + SEN + R" B", size=46, color=C_SEN),
            M(R"b\," + SEN + R" A = a\," + SEN + R" B", size=50, color=C_ANG),
        ).arrange(DOWN, buff=0.4).move_to(3.0 * DOWN)
        self.say("En el de la izquierda, la altura es b por seno de A. En el de la derecha, a por seno de B. Es la misma altura.")
        self.play(Write(eqs[0]))
        self.play(Write(eqs[1]))
        self.play(Write(eqs[2]))
        self.hold(0.5)
        self.end_section()


class S02_Ley(MBScene):
    def construct(self):
        self.mark("La ley")
        self.set_header(R"\tfrac{" + SEN + R" A}{a}", "La ley de senos", C_SEN, P_SEN)
        s = VGroup(
            M(R"b\," + SEN + R" A = a\," + SEN + R" B", size=48, color=MUTED),
            M(R"\frac{" + SEN + R" A}{a} = \frac{" + SEN + R" B}{b}", size=56),
            M(R"\frac{" + SEN + R" A}{a} = \frac{" + SEN + R" B}{b} = \frac{" + SEN + R" C}{c}", size=60, color=C_SEN),
        ).arrange(DOWN, buff=0.7).move_to(2.6 * UP)
        self.say("Dividiendo entre a por b queda una proporción bonita: seno de A sobre a igual a seno de B sobre b.", fox=True)
        self.play(FadeIn(s[0]))
        self.play(TransformFromCopy(s[0], s[1]), run_time=1.6)
        self.hold()
        self.say("Con otra altura entra el tercer par. El seno de cada ángulo, dividido entre su lado de enfrente, da siempre lo mismo.")
        card = get_card(s[2], color=C_SEN, fill=PEACH)
        self.play(FadeIn(card))
        self.play(Write(s[2]))
        self.hold()
        use = VGroup(
            T("Úsala cuando tengas una pareja completa:", size=28),
            T("un lado y el ángulo que tiene enfrente.", size=28, color=C_ANG),
        ).arrange(DOWN, buff=0.2).move_to(2.6 * DOWN)
        self.say("La condición para usarla: tener una pareja completa, un lado con su ángulo opuesto. Con ella despejas lo demás.")
        self.play(FadeIn(use, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_AAL(MBScene):
    def construct(self):
        self.mark("Resolver un AAL")
        self.set_header(R"A,\,B,\,a", "Dos ángulos y un lado", C_COS, P_COS)
        data = M(R"A = 35^\circ,\quad B = 80^\circ,\quad a = 9", size=44, color=C_ANG).move_to(4.3 * UP)
        k = 0.24
        P_A = 2.8 * LEFT + 4.4 * DOWN
        P_B = P_A + 14.2 * k * RIGHT
        P_C = P_A + 15.5 * k * np.array([np.cos(35 * DEGREES), np.sin(35 * DEGREES), 0])
        fig = VGroup(
            Polygon(P_A, P_B, P_C).set_stroke(INK, 3).set_fill(C_COS, 0.08),
            Line(P_B, P_C).set_stroke(C_SEN, 6),
            Arc(start_angle=0, angle=35 * DEGREES, radius=0.6, arc_center=P_A).set_stroke(C_ANG, 4),
            M("A", size=32).next_to(P_A, LEFT, buff=0.12), M("B", size=32).next_to(P_B, RIGHT, buff=0.12),
            M("C", size=32).next_to(P_C, UP, buff=0.12), M("a = 9", size=30, color=C_SEN).next_to(Line(P_B, P_C).get_center(), RIGHT, buff=0.12),
        )
        self.say("Resolvamos este triángulo: el ángulo A mide treinta y cinco grados, el B ochenta, y el lado a, frente a A, mide nueve.", fox=True)
        self.play(Write(data), FadeIn(fig))
        steps = VGroup(
            M(R"C = 180^\circ - 35^\circ - 80^\circ = 65^\circ", size=42),
            M(R"\frac{b}{" + SEN + R" 80^\circ} = \frac{9}{" + SEN + R" 35^\circ}", size=46),
            M(R"b = \frac{9\," + SEN + R" 80^\circ}{" + SEN + R" 35^\circ} \approx \frac{9(0.985)}{0.574} \approx 15.5", size=40, color=C_COS),
            M(R"c = \frac{9\," + SEN + R" 65^\circ}{" + SEN + R" 35^\circ} \approx \frac{9(0.906)}{0.574} \approx 14.2", size=40, color=C_TAN),
        ).arrange(DOWN, buff=0.5).next_to(data, DOWN, buff=0.7)
        self.say("Primero el ángulo que falta: los tres suman ciento ochenta, así que C mide sesenta y cinco.")
        self.play(Write(steps[0]))
        self.hold()
        self.say("La pareja completa es a con A. Planteamos la proporción para b y despejamos.")
        self.play(Write(steps[1]))
        self.play(Write(steps[2]), run_time=2)
        self.hold()
        self.say("Igual para c, con seno de sesenta y cinco.")
        self.play(Write(steps[3]), run_time=2)
        self.hold()
        self.say("Revisión rápida: el lado más largo, b, queda frente al ángulo más grande, B. Tiene sentido.")
        self.play(Indicate(steps[2], color=C_Q))
        self.hold(0.5)
        self.end_section()


class S04_Ambiguo(MBScene):
    def construct(self):
        self.mark("El caso ambiguo")
        self.set_header(R"\text{LLA}", "El compás tramposo", C_I, P_I)
        Adeg, b = 40, 3.6
        A = 3.0 * LEFT + 0.2 * UP
        Cc = A + b * np.array([np.cos(Adeg * DEGREES), np.sin(Adeg * DEGREES), 0])
        base = Line(3.9 * LEFT + A[1] * UP, 3.9 * RIGHT + A[1] * UP).set_stroke(INK, 3)
        side_b = Line(A, Cc).set_stroke(C_COS, 6)
        arcA = Arc(start_angle=0, angle=Adeg * DEGREES, radius=0.7, arc_center=A).set_stroke(C_ANG, 5)
        self.say("Ahora conocemos dos lados y un ángulo que no está entre ellos. Ángulo A de cuarenta grados, lado b de tres coma seis, y el lado a, frente a A.", fox=True)
        self.play(ShowCreation(base), ShowCreation(side_b), ShowCreation(arcA))
        h = b * np.sin(Adeg * DEGREES)
        a_t = ValueTracker(2.0)
        phi = ValueTracker(-30 * DEGREES)
        arm = always_redraw(lambda: Line(Cc, Cc + a_t.get_value() * np.array([np.cos(phi.get_value()), np.sin(phi.get_value()), 0])).set_stroke(C_SEN, 6))
        ring = always_redraw(lambda: DashedVMobject(Arc(start_angle=PI, angle=PI, radius=a_t.get_value(), arc_center=Cc), num_dashes=30).set_stroke(C_SEN, 2, opacity=0.6))
        pin = Dot(Cc, radius=0.1).set_color(INK)
        lab = always_redraw(lambda: M(f"a = {a_t.get_value():.1f}", size=40, color=C_SEN).move_to(3.4 * DOWN))
        self.say("El lado a es como el brazo de un compás clavado en C. Al girarlo, ¿toca la base?")
        self.add(ring, arm, pin, lab)
        self.play(phi.animate.set_value(-150 * DEGREES), run_time=2.5)
        self.play(phi.animate.set_value(-90 * DEGREES), run_time=1.2)
        zero = get_pill("cero triángulos: no alcanza", C_I, PEACH, size=26).move_to(4.2 * DOWN)
        hline = DashedLine(Cc, [Cc[0], A[1], 0]).set_stroke(C_ANG, 3)
        hlab = M(R"h = b\," + SEN + R" A \approx 2.31", size=34, color=C_ANG).next_to(hline, RIGHT, buff=0.15).shift(0.4 * UP)
        self.say("Si a es más corto que la altura, que aquí es dos coma treinta y uno, el brazo no llega: no hay triángulo.")
        self.play(ShowCreation(hline), FadeIn(hlab), FadeIn(zero))
        self.hold()
        self.mark("Uno o dos")
        self.play(FadeOut(zero), a_t.animate.set_value(h), run_time=1.5)
        one = get_pill("igual a h: uno, rectángulo", C_ANG, PEACH, size=26).move_to(4.2 * DOWN)
        self.say("Si a es justo la altura, toca en un solo punto: un triángulo rectángulo.")
        self.play(FadeIn(one))
        self.hold()
        self.play(FadeOut(one), a_t.animate.set_value(2.9), run_time=1.5)
        d = np.sqrt(2.9 ** 2 - h ** 2)
        xs = [Cc[0] - d, Cc[0] + d]
        cuts = VGroup(*(Dot([x, A[1], 0], radius=0.12).set_color(C_ANG) for x in xs))
        self.say("Si a está entre la altura y b, el compás corta la base dos veces. Dos triángulos distintos con los mismos datos.")
        self.play(phi.animate.set_value(-np.pi + np.arcsin(h / 2.9)), run_time=1.5)
        self.play(GrowFromCenter(cuts[0]))
        self.play(phi.animate.set_value(-np.arcsin(h / 2.9)), run_time=1.8)
        self.play(GrowFromCenter(cuts[1]))
        tris = VGroup(*(Polygon(A, [x, A[1], 0], Cc).set_stroke(width=0).set_fill(col, 0.25) for x, col in zip(xs, (C_TAN, C_SEN))))
        self.play(FadeIn(tris))
        self.zoom_to(VGroup(cuts, side_b), scale=0.55)
        two = get_pill("dos triángulos", C_Q, PEACH, size=26).next_to(cuts, DOWN, buff=0.4)
        self.play(FadeIn(two))
        self.hold()
        self.zoom_reset()
        self.play(FadeOut(two), FadeOut(tris), FadeOut(cuts))
        self.play(a_t.animate.set_value(4.0), run_time=1.5)
        x2 = Cc[0] + np.sqrt(16 - h ** 2)
        x1 = Cc[0] - np.sqrt(16 - h ** 2)
        self.play(phi.animate.set_value(-np.arcsin(h / 4.0)), run_time=1.5)
        good = Dot([x2, A[1], 0], radius=0.12).set_color(C_Q)
        bad = Dot([x1, A[1], 0], radius=0.12).set_color(MUTED)
        self.say("Y si a es igual o más largo que b, el segundo corte cae detrás de A, fuera del triángulo. Vuelve a haber uno solo.")
        self.play(GrowFromCenter(good), GrowFromCenter(bad))
        self.play(FadeIn(ex_mark(size=44).next_to(bad, UP, buff=0.15)))
        self.hold()
        summary = VGroup(
            M(R"a < h:\; 0", size=36, color=C_I), M(R"a = h:\; 1", size=36, color=C_ANG),
            M(R"h < a < b:\; 2", size=36, color=C_Q), M(R"a \ge b:\; 1", size=36, color=C_COS),
        ).arrange_in_grid(2, 2, h_buff=0.9, v_buff=0.3).move_to(3.8 * DOWN)
        self.play(FadeOut(lab), FadeIn(summary))
        self.say("Resumen del compás: más corto que la altura, ninguno; igual, uno; entre la altura y b, dos; desde b en adelante, uno.")
        self.hold(0.5)
        for m in (arm, ring, lab):
            m.clear_updaters()
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("La altura", "parte el oblicuo en dos rectángulos", C_ANG),
        ("Ley de senos", "sen A / a = sen B / b = sen C / c", C_SEN),
        ("Cuándo", "con una pareja lado–ángulo opuesto (AAL, ALA)", C_COS),
        ("Caso ambiguo", "LLA: 0, 1 o 2 triángulos", C_I),
    ]
    recap_say = ("Repasemos: la altura convierte el oblicuo en dos rectángulos; de ahí sale la ley de senos; se usa con una pareja "
                 "lado ángulo opuesto; y con LLA puede haber cero, uno o dos triángulos.")
    practice = "Ahora, el juego:\nel compás del caso ambiguo"
