"""
Clase T11 · Identidades fundamentales (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. El triángulo de la circunferencia unitaria pone sus
cuadrados sen² y cos² en una barra que siempre se llena hasta 1 (zoom al triángulo); dividiendo salen
las otras dos pitagóricas; con cos θ = −12/13 en el III se hallan las otras cinco; y el triángulo volteado
explica las cofunciones. Manual de la UdeA §13.7.

    manimgl identidades.py S01_Pitagoras -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T11"
    title = "Identidades\nfundamentales"
    subtitle = "Igualdades que nunca fallan"


class S01_Pitagoras(MBScene):
    def construct(self):
        self.mark("Pitágoras en el círculo")
        self.set_header(SEN + R"^2 + \cos^2 = 1", "La reina de las identidades", C_ANG, P_ANG)
        R_, c = 2.6, 1.9 * UP + 0.9 * LEFT
        axes = get_trig_axes(R_, c, extend=0.3)
        t = ValueTracker(40 * DEGREES)
        P = lambda: point_on(t.get_value(), R_, c)
        tri = always_redraw(lambda: VGroup(
            Line(c, [P()[0], c[1], 0]).set_stroke(C_COS, 6),
            Line([P()[0], c[1], 0], P()).set_stroke(C_SEN, 6),
            Line(c, P()).set_stroke(INK, 4),
            Dot(P(), radius=0.1).set_color(C_ANG),
        ))
        self.say("Toma un punto en la circunferencia de radio uno. Baja una perpendicular: aparece un triángulo rectángulo. "
                 "Su base es el coseno, su altura el seno y su hipotenusa mide uno.", fox=True)
        self.play(ShowCreation(axes))
        self.add(tri)
        labels = VGroup(M(R"\cos\theta", size=30, color=C_COS), M(SEN + R"\theta", size=30, color=C_SEN), M("1", size=32))
        labels[0].next_to(Line(c, [P()[0], c[1], 0]), DOWN, buff=0.12)
        labels[1].next_to(Line([P()[0], c[1], 0], P()), RIGHT, buff=0.12)
        labels[2].move_to((c + P()) / 2 + 0.3 * UL)
        self.play(FadeIn(labels))
        self.hold()
        self.mark("Zoom al triángulo")
        self.zoom_to(VGroup(tri, labels), scale=0.55)
        pyth = M(R"(\cos\theta)^2 + (" + SEN + R"\theta)^2 = 1^2", size=30, color=C_ANG).next_to(tri, DOWN, buff=0.6)
        self.say("Pitágoras dice: cateto al cuadrado más cateto al cuadrado es la hipotenusa al cuadrado.")
        self.play(Write(pyth))
        self.hold()
        self.zoom_reset()
        self.play(FadeOut(labels), FadeOut(pyth))

        self.mark("La barra que siempre se llena")
        bar_x, bar_b, H = 3.1, -0.4, 4.6
        frame_bar = Rectangle(0.8, H).move_to([bar_x, bar_b + H / 2, 0]).set_stroke(INK, 3)
        mark1 = M("1", size=34).next_to(frame_bar, UP, buff=0.12)
        def bars():
            s2, c2 = np.sin(t.get_value()) ** 2, np.cos(t.get_value()) ** 2
            low = Rectangle(0.8, H * s2).set_fill(C_SEN, 0.85).set_stroke(width=0)
            low.move_to([bar_x, bar_b + H * s2 / 2, 0])
            high = Rectangle(0.8, H * c2).set_fill(C_COS, 0.85).set_stroke(width=0)
            high.move_to([bar_x, bar_b + H * s2 + H * c2 / 2, 0])
            return VGroup(low, high)
        stack = always_redraw(bars)
        leg = VGroup(M(SEN + R"^2\theta", size=30, color=C_SEN), M(R"\cos^2\theta", size=30, color=C_COS)).arrange(DOWN, buff=0.15).next_to(frame_bar, DOWN, buff=0.3)
        self.say("Mira los cuadrados como líquidos. El rosa es seno al cuadrado, el cian coseno al cuadrado. Gira el ángulo como quieras: "
                 "uno crece, el otro baja, y juntos siempre llenan exactamente hasta uno.")
        self.play(ShowCreation(frame_bar), FadeIn(mark1), FadeIn(leg))
        self.add(stack)
        self.play(t.animate.set_value(110 * DEGREES), run_time=3)
        self.play(t.animate.set_value(215 * DEGREES), run_time=3)
        self.play(t.animate.set_value(320 * DEGREES), run_time=3)
        self.hold()
        law = M(SEN + R"^2\theta + \cos^2\theta = 1", size=56, color=C_ANG).move_to(3.6 * DOWN)
        card = get_card(law, color=C_ANG, fill=PEACH)
        self.say("Es la identidad pitagórica: vale para cualquier ángulo, sin excepción.")
        self.play(FadeIn(card), Write(law))
        self.hold(0.5)
        tri.clear_updaters()
        stack.clear_updaters()
        self.end_section()


class S02_Familia(MBScene):
    def construct(self):
        self.mark("Dividir entre cos²")
        self.set_header(R"\div \cos^2", "La familia crece", C_COS, P_COS)
        base = M(SEN + R"^2\theta + \cos^2\theta = 1", size=52, color=C_ANG).move_to(4.0 * UP)
        self.say("De la reina salen dos hermanas. Divide toda la igualdad entre coseno al cuadrado.", fox=True)
        self.play(Write(base))
        step1 = M(R"\frac{" + SEN + R"^2\theta}{\cos^2\theta} + \frac{\cos^2\theta}{\cos^2\theta} = \frac{1}{\cos^2\theta}", size=46).next_to(base, DOWN, buff=0.6)
        step2 = M(R"\tan^2\theta + 1 = \sec^2\theta", size=56, color=C_TAN).next_to(step1, DOWN, buff=0.6)
        self.play(TransformFromCopy(base, step1), run_time=1.6)
        self.say("Seno al cuadrado entre coseno al cuadrado es tangente al cuadrado, lo segundo es uno, y uno entre coseno al cuadrado es secante al cuadrado.")
        self.hold()
        self.play(Write(step2))
        self.hold()
        self.mark("Dividir entre sen²")
        step3 = M(R"1 + \cot^2\theta = \csc^2\theta", size=56, color=C_SEN).next_to(step2, DOWN, buff=0.7)
        self.say("Si en cambio divides entre seno al cuadrado, sale la tercera: uno más cotangente al cuadrado es cosecante al cuadrado.")
        self.play(Write(step3))
        self.hold()
        self.mark("Las de siempre")
        extra = VGroup(
            M(R"\tan\theta = \frac{" + SEN + R"\theta}{\cos\theta}", size=40),
            M(R"\csc\theta = \frac{1}{" + SEN + R"\theta},\;\; \sec\theta = \frac{1}{\cos\theta}", size=40),
        ).arrange(DOWN, buff=0.35).next_to(step3, DOWN, buff=0.8)
        self.say("Y junto a ellas, las de cociente y las recíprocas que ya conoces. Con este equipo se reescribe casi todo.")
        self.play(LaggedStartMap(FadeIn, extra, shift=0.2 * UP, lag_ratio=0.4))
        self.hold(0.5)
        self.end_section()


class S03_Cinco(MBScene):
    def construct(self):
        self.mark("Un dato, cinco respuestas")
        self.set_header(R"\cos\theta = -\tfrac{12}{13}", "De una a seis", C_COS, P_COS)
        R_, c = 2.5, 2.2 * UP
        axes = get_trig_axes(R_, c, circle=False)
        quads = VGroup(*(T(q, size=26, color=MUTED).move_to(c + 1.4 * v) for q, v in zip(["I", "II", "III", "IV"], [UR, UL, DL, DR])))
        self.say("Te dicen que coseno de theta es menos doce treceavos y que theta está en el tercer cuadrante. Con eso salen las otras cinco.", fox=True)
        self.play(ShowCreation(axes), FadeIn(quads))
        k = R_ / 13 * 1.0
        P = c + k * np.array([-12, -5, 0])
        tri = VGroup(Line(c, [P[0], c[1], 0]).set_stroke(C_COS, 6), Line([P[0], c[1], 0], P).set_stroke(C_SEN, 6), Line(c, P).set_stroke(INK, 4))
        self.play(quads[2].animate.set_color(C_ANG).scale(1.3))
        self.play(ShowCreation(tri), run_time=1.5)
        labs = VGroup(M("-12", size=30, color=C_COS).next_to(tri[0], UP, buff=0.12), M("13", size=30).move_to(tri[2].get_center() + 0.35 * DR),
                      M("?", size=36, color=C_SEN).next_to(tri[1], LEFT, buff=0.12))
        self.play(FadeIn(labs))
        self.say("El coseno es avance sobre radio: avance menos doce, radio trece. Falta la altura.")
        self.hold()
        self.mark("Zoom a la altura")
        self.zoom_to(tri, scale=0.5)
        calc = M(SEN + R"\theta = -\sqrt{1 - \tfrac{144}{169}} = -\tfrac{5}{13}", size=24, color=C_SEN).next_to(tri, DOWN, buff=0.3)
        self.say("Por la identidad pitagórica, seno al cuadrado es uno menos ciento cuarenta y cuatro sobre ciento sesenta y nueve: "
                 "veinticinco sobre ciento sesenta y nueve. La raíz es cinco treceavos, y en el tercer cuadrante el seno es negativo.")
        self.play(Write(calc))
        self.play(Transform(labs[2], M("-5", size=30, color=C_SEN).move_to(labs[2])))
        self.hold()
        self.zoom_reset()
        self.mark("Las seis")
        table = VGroup(
            M(SEN + R"\theta = -\tfrac{5}{13}", size=40, color=C_SEN), M(R"\csc\theta = -\tfrac{13}{5}", size=40, color=C_SEN),
            M(R"\cos\theta = -\tfrac{12}{13}", size=40, color=C_COS), M(R"\sec\theta = -\tfrac{13}{12}", size=40, color=C_COS),
            M(R"\tan\theta = \tfrac{5}{12}", size=40, color=C_TAN), M(R"\cot\theta = \tfrac{12}{5}", size=40, color=C_TAN),
        ).arrange_in_grid(3, 2, h_buff=0.8, v_buff=0.45).move_to(2.8 * DOWN)
        self.play(FadeOut(calc))
        self.say("Lo demás son divisiones: la tangente, menos cinco entre menos doce, es positiva, como debe ser en el tercer cuadrante. "
                 "Y las recíprocas se voltean.")
        self.play(LaggedStartMap(FadeIn, table, shift=0.2 * UP, lag_ratio=0.25), run_time=2.5)
        self.hold(0.5)
        self.end_section()


class S04_Cofunciones(MBScene):
    def construct(self):
        self.mark("El triángulo volteado")
        self.set_header(R"90^\circ - \theta", "Cofunciones", C_TAN, P_TAN)
        A, B, Cc = 3.4 * LEFT + 0.6 * UP, 1.8 * RIGHT + 0.6 * UP, 1.8 * RIGHT + 3.8 * UP
        tri = Polygon(A, B, Cc).set_stroke(INK, 4)
        sq = Square(0.35).set_stroke(INK, 2).move_to(B + 0.175 * (UL))
        a1 = Arc(start_angle=0, angle=np.arctan2(3.2, 5.2), radius=0.8, arc_center=A).set_stroke(C_ANG, 5)
        a2 = Arc(start_angle=-PI / 2, angle=-(PI / 2 - np.arctan2(3.2, 5.2)), radius=0.6, arc_center=Cc).set_stroke(C_TAN, 5)
        th = M(R"\theta", size=40, color=C_ANG).next_to(a1, RIGHT, buff=0.1).shift(0.12 * UP)
        co = M(R"90^\circ - \theta", size=32, color=C_TAN).next_to(Cc, UP, buff=0.15)
        self.say("En un triángulo rectángulo los dos ángulos agudos suman noventa grados: si uno es theta, el otro es noventa menos theta.", fox=True)
        self.play(ShowCreation(tri), ShowCreation(sq))
        self.play(ShowCreation(a1), FadeIn(th), ShowCreation(a2), FadeIn(co))
        self.hold()
        op = T("opuesto\na θ", size=26, color=C_SEN).next_to(Line(B, Cc), RIGHT, buff=0.15)
        ad = T("adyacente a θ", size=26, color=C_COS).next_to(Line(A, B), DOWN, buff=0.2)
        side_op = Line(B, Cc).set_stroke(C_SEN, 7)
        side_ad = Line(A, B).set_stroke(C_COS, 7)
        self.play(ShowCreation(side_op), ShowCreation(side_ad), FadeIn(op), FadeIn(ad))
        self.say("Para theta, el lado vertical es el opuesto y el de abajo el adyacente.")
        self.hold()
        self.mark("Cambiar de punto de vista")
        op2 = T("adyacente\na 90° − θ", size=26, color=C_SEN).next_to(Line(B, Cc), RIGHT, buff=0.15)
        ad2 = T("opuesto a 90° − θ", size=26, color=C_COS).move_to(ad)
        self.say("Ahora párate en el otro ángulo. El mismo lado vertical ya no está enfrente: es su adyacente. Y el de abajo pasa a ser su opuesto.")
        self.play(Transform(op, op2), Transform(ad, ad2), Indicate(co, color=C_TAN))
        self.hold()
        rules = VGroup(
            M(SEN + R"(90^\circ - \theta) = \cos\theta", size=42),
            M(R"\tan(90^\circ - \theta) = \cot\theta", size=42),
            M(R"\sec(90^\circ - \theta) = \csc\theta", size=42),
        ).arrange(DOWN, buff=0.35).move_to(2.6 * DOWN)
        self.say("Por eso lo que es seno para un ángulo es coseno para su complemento. Así nacieron los nombres: co-seno, co-tangente, co-secante.")
        self.play(LaggedStartMap(Write, rules, lag_ratio=0.5), run_time=3)
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Pitagórica", "sen²θ + cos²θ = 1 para todo θ", C_ANG),
        ("Sus hermanas", "1 + tan²θ = sec²θ  ·  1 + cot²θ = csc²θ", C_TAN),
        ("Un dato basta", "el cuadrante decide cada signo", C_COS),
        ("Cofunciones", "sen(90° − θ) = cos θ, y así con todas", C_SEN),
    ]
    recap_say = ("Repasemos: seno al cuadrado más coseno al cuadrado es uno; dividiendo salen las otras dos; con un dato y el "
                 "cuadrante hallas las seis razones; y cada razón del complemento es su co-razón.")
    practice = "Ahora, el juego:\nllena el tanque pitagórico\njusto hasta la marca"
