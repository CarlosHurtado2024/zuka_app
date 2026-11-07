"""
Clase T1 · Grados y radianes (Trigonometría, vertical 9:16, fondo azul de trigonometría).

Sin voz ni subtítulos ni preguntas al espectador. Posición estándar y signo del giro, el grado (con
zoom a 1°), el radián con la cuerda del radio (zoom al sobrante de 2π), conversión con intuición,
coterminales y complementos. Contenido: Manual de la UdeA §13.1. Zoom con la cámara de manimgl
(self.frame), como en 3b1b/videos.

    manimgl grados_radianes.py S03_Radian -w
    python build.py
"""
from mb_common import *

TOPIC_TITLE = "Grados y radianes"
CENTER = 1.2 * UP


def deg_label(value, size=40, color=C_ANG):
    return M(f"{value}^\\circ", size=size, color=color)


def arm(angle, radius=2.2, center=CENTER, color=INK, width=5):
    return Line(np.array(center), point_on(angle, radius, center)).set_stroke(color, width)


class S00_Portada(MBScene):
    part_tag = "Trigonometría · Clase T1"
    part_subtitle = "Cómo se mide un giro"
    slide_title = "Portada"

    def construct(self):
        self.remove(self.watermark)
        self.mark(self.slide_title)
        blob = Circle(radius=2.75).set_fill(PEACH, 1).set_stroke(width=0).move_to(3.1 * UP)
        halo = Circle(radius=2.25).set_fill(PEACH_DEEP, 1).set_stroke(width=0).move_to(blob)
        fox = ImageMobject("zuka_mascota.png", height=3.6).move_to(blob)
        self.play(GrowFromCenter(blob), GrowFromCenter(halo), run_time=1.0)
        self.play(FadeIn(fox, scale=0.85), run_time=1.0)
        tag = get_pill(self.part_tag, C_COS, PEACH, size=28)
        title = TB(TOPIC_TITLE, size=56, color=INK, alignment="CENTER")
        rule = Line(LEFT, RIGHT).set_width(1.8).set_stroke(C_COS, 5)
        sub = T(self.part_subtitle, size=30, color=MUTED)
        block = VGroup(tag, title, rule, sub).arrange(DOWN, buff=0.42).move_to(1.6 * DOWN)
        self.play(FadeIn(tag, shift=0.2 * UP), Write(title, run_time=1.6))
        self.play(ShowCreation(rule), FadeIn(sub, shift=0.2 * UP))
        self.wait(2.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, halo, fox, block)), run_time=0.8)


class S01_PosicionEstandar(MBScene):
    def construct(self):
        self.mark("Un ángulo es un giro")
        self.set_header(R"\theta", "Posición estándar", C_ANG, P_ANG)
        axes = get_trig_axes(2.2, CENTER, circle=False)
        self.play(ShowCreation(axes), run_time=1.0)
        theta = ValueTracker(0)
        initial = arm(0, 2.6, color=C_COS)
        terminal = always_redraw(lambda: arm(theta.get_value(), 2.6))
        arc = always_redraw(lambda: get_angle_arc(theta.get_value(), 0.7, CENTER))
        tip = always_redraw(lambda: Dot(point_on(theta.get_value(), 2.6, CENTER), radius=0.1).set_color(C_ANG))
        lab_i = T("lado inicial", size=24, color=C_COS).next_to(initial, DOWN, buff=0.15).shift(0.6 * RIGHT)
        self.say("Un ángulo es un giro. Para no enredarnos, siempre lo dibujamos igual: el vértice en el "
                 "origen y el lado inicial acostado sobre el eje x positivo. Eso se llama posición estándar.", fox=True)
        self.play(ShowCreation(initial), FadeIn(lab_i))
        self.add(terminal, arc, tip)
        self.hold()
        self.say("Ahora giramos el otro lado, el lado terminal. Si gira al contrario de las manecillas del "
                 "reloj, el ángulo es positivo.")
        self.play(theta.animate.set_value(130 * DEGREES), run_time=2.5)
        plus = M(R"+130^\circ", size=60, color=C_ANG).move_to(CENTER + 3.6 * DOWN)
        turn = T("↺ contra el reloj: positivo", size=30, color=C_ANG).next_to(plus, DOWN, buff=0.35)
        self.play(FadeIn(plus, shift=0.2 * UP), FadeIn(turn))
        self.hold()
        self.say("Y si gira como las manecillas del reloj, el ángulo es negativo: menos sesenta grados está "
                 "por debajo del eje x.")
        self.play(theta.animate.set_value(-60 * DEGREES), run_time=2.5)
        minus = M(R"-60^\circ", size=60, color=C_I).move_to(plus)
        turn2 = T("↻ con el reloj: negativo", size=30, color=C_I).move_to(turn)
        self.play(FadeTransform(plus, minus), FadeTransform(turn, turn2))
        self.hold(0.5)
        terminal.clear_updaters(); arc.clear_updaters(); tip.clear_updaters()
        self.end_section()


class S02_Grados(MBScene):
    def construct(self):
        self.mark("El grado")
        self.set_header(R"1^\circ", "El grado", C_ANG, P_ANG)
        R = 3.0
        c = 0.6 * UP
        circle = Circle(radius=R).move_to(c).set_stroke(INK, 3, opacity=0.6)
        ticks = VGroup(*(
            Line(point_on(k * DEGREES, R - (0.22 if k % 10 == 0 else 0.1), c), point_on(k * DEGREES, R, c))
            .set_stroke(C_COS if k % 10 == 0 else MUTED, 2 if k % 10 == 0 else 1)
            for k in range(360)
        ))
        self.say("Hace miles de años, los babilonios partieron la vuelta completa en 360 partes iguales. "
                 "Cada una de esas partes es un grado.", fox=True)
        self.play(ShowCreation(circle))
        self.play(LaggedStartMap(ShowCreation, ticks, lag_ratio=0.004), run_time=3)
        full = M(R"1 \text{ vuelta} = 360^\circ", size=52).move_to(c + 4.3 * DOWN)
        self.play(Write(full))
        self.hold()

        self.mark("Zoom a un grado")
        wedge = Sector(angle=1 * DEGREES, radius=R).move_to(c, aligned_edge=ORIGIN)
        wedge = Polygon(np.array(c), point_on(0, R, c), *[point_on(a * DEGREES / 8, R, c) for a in range(1, 9)])
        wedge.set_fill(C_ANG, 0.7).set_stroke(C_ANG, 0.6)
        self.say("Acerquémonos a uno solo de esos grados. Es una tajada finísima: con una vuelta caben trescientas sesenta.")
        self.play(FadeIn(wedge))
        target = point_on(0.5 * DEGREES, R - 0.07, c)
        self.zoom_to(target, scale=0.04, run_time=3)
        one = T("1°", size=3.2, color=C_ANG).move_to(point_on(0.5 * DEGREES, R + 0.05, c) + 0.02 * RIGHT)
        mins = VGroup(*(
            Line(point_on(m * DEGREES / 60, R - 0.05, c), point_on(m * DEGREES / 60, R, c)).set_stroke(INK, 0.4)
            for m in range(0, 61, 5)
        ))
        note = T("1° = 60 minutos\n1 minuto = 60 segundos", size=1.2, color=INK, alignment="CENTER")
        note.move_to(point_on(0.5 * DEGREES, R - 0.1, c) + 0.08 * UP)
        self.play(FadeIn(one), LaggedStartMap(ShowCreation, mins, lag_ratio=0.05), run_time=1.5)
        self.say("De cerca se ve que un grado todavía se puede partir: en 60 minutos, y cada minuto en 60 segundos. "
                 "Así miden los marinos y los astrónomos.")
        self.play(FadeIn(note))
        self.hold()
        self.zoom_reset(run_time=2.5)
        self.play(FadeOut(VGroup(one, mins, note, wedge)))

        self.mark("Los ángulos cómodos")
        self.say("Como 360 se puede dividir de muchas maneras, salen ángulos cómodos: un cuarto de vuelta son "
                 "90 grados, media vuelta 180 y tres cuartos 270.")
        for k, (ang, col) in enumerate([(90, C_COS), (180, C_SEN), (270, C_TAN)]):
            sec = Sector(angle=ang * DEGREES, radius=R * 0.55).move_to(c, aligned_edge=ORIGIN)
            sec = Polygon(np.array(c), *[point_on(a * DEGREES, R * 0.55, c) for a in np.linspace(0, ang, 30)])
            sec.set_fill(col, 0.35).set_stroke(col, 3)
            lab = deg_label(ang, 44, col).move_to(point_on(ang / 2 * DEGREES, R * 0.3, c))
            self.play(FadeIn(sec), FadeIn(lab, scale=1.3), run_time=0.8)
            self.wait(0.5)
            if k < 2:
                self.play(FadeOut(sec), FadeOut(lab), run_time=0.4)
        self.hold(0.5)
        self.end_section()


class S03_Radian(MBScene):
    def construct(self):
        self.mark("La cuerda del radio")
        self.set_header(R"\text{rad}", "El radián", C_COS, P_COS)
        R = 2.0
        c = 1.4 * UP
        circle = Circle(radius=R).move_to(c).set_stroke(INK, 3, opacity=0.6)
        radius = Line(c, point_on(0, R, c)).set_stroke(C_COS, 6)
        r_lab = M("r", size=44, color=C_COS).next_to(radius, DOWN, buff=0.12)
        self.say("Los matemáticos prefieren otra medida que sale del propio círculo, sin inventarse el 360. "
                 "Toma el radio como si fuera un pedazo de cuerda.", fox=True)
        self.play(ShowCreation(circle), ShowCreation(radius), FadeIn(r_lab))
        self.hold()
        rope = radius.copy()
        self.say("Doblamos esa cuerda sobre el borde del círculo. El ángulo que abarca un arco tan largo como "
                 "el radio se llama un radián.")
        arc1 = Arc(0, 1, radius=R, arc_center=c).set_stroke(C_COS, 8)
        self.play(rope.animate.shift(0.4 * RIGHT), run_time=0.6)
        self.play(Transform(rope, arc1), run_time=1.6)
        a1 = arm(1, R, c, color=INK, width=4)
        ang = get_angle_arc(1, 0.5, c)
        lab = M(R"1 \text{ rad} \approx 57.3^\circ", size=46, color=C_ANG).move_to(c + 3.1 * DOWN)
        self.play(ShowCreation(a1), ShowCreation(ang), FadeIn(lab))
        self.hold()

        self.mark("¿Cuántos radios caben?")
        self.say("¿Cuántas cuerdas como esa caben en toda la vuelta? Pongámoslas una detrás de otra.")
        arcs = VGroup(rope)
        nums = VGroup()
        for k in range(1, 7):
            a = Arc(k - 1, 1, radius=R, arc_center=c).set_stroke(C_COS if k % 2 else C_SEN, 8)
            n = T(str(k), size=26, color=C_COS if k % 2 else C_SEN).move_to(point_on(k - 0.5, R + 0.35, c))
            if k > 1:
                self.play(ShowCreation(a), FadeIn(n), run_time=0.55)
                arcs.add(a)
            else:
                self.play(FadeIn(n), run_time=0.3)
            nums.add(n)
        self.play(FadeOut(VGroup(a1, ang)), FadeOut(lab))
        self.hold()
        self.say("Caben seis, y sobra un pedacito. Acerquémonos para medirlo.")
        gap = Arc(6, TAU - 6, radius=R, arc_center=c).set_stroke(C_ANG, 10)
        self.play(ShowCreation(gap))
        self.zoom_to(point_on(6.14, R, c), scale=0.18, run_time=2.5)
        left = T("sobran 0.28 radios", size=7, color=C_ANG).move_to(point_on(6.14, R + 0.35, c))
        self.play(FadeIn(left, shift=0.05 * UP))
        self.say("El sobrante es 0.28 de radio. En total, la vuelta completa mide 6.28 radios: ese número "
                 "famoso es dos veces pi.")
        self.hold()
        self.zoom_reset(run_time=2.2)
        eq = VGroup(
            M(R"360^\circ = 2\pi \text{ rad} \approx 6.28 \text{ rad}", size=46),
            M(R"180^\circ = \pi \text{ rad}", size=58, color=C_ANG),
        ).arrange(DOWN, buff=0.4).move_to(c + 3.6 * DOWN)
        self.play(FadeOut(left), Write(eq[0]))
        self.play(Write(eq[1]))
        self.say("Y media vuelta, 180 grados, es exactamente pi radianes. Esa igualdad es la llave para pasar de una medida a la otra.")
        self.hold(0.5)
        self.end_section()


class S04_Convertir(MBScene):
    def construct(self):
        self.mark("Convertir con intuición")
        self.set_header(R"\pi", "De grados a radianes", C_COS, P_COS)
        key = M(R"180^\circ = \pi", size=64, color=C_ANG).move_to(4.4 * UP)
        self.play(FadeIn(key, shift=0.2 * DOWN))
        R = 1.9
        c = 1.6 * UP
        self.say("Primer ejemplo: ciento veinte grados. Piensa en media vuelta partida en tres tajadas de 60 grados. "
                 "Ciento veinte son dos de esas tres tajadas.", fox=True)
        base = get_trig_axes(R, c, extend=0.3)
        self.play(ShowCreation(base), run_time=0.8)
        slices = VGroup()
        for k in range(3):
            s = Polygon(np.array(c), *[point_on(a * DEGREES, R, c) for a in np.linspace(60 * k, 60 * (k + 1), 16)])
            s.set_fill(C_COS if k < 2 else MUTED, 0.45 if k < 2 else 0.12).set_stroke(C_COS if k < 2 else MUTED, 2)
            slices.add(s)
        self.play(LaggedStartMap(FadeIn, slices, lag_ratio=0.3), run_time=1.5)
        self.hold()
        steps = VGroup(
            M(R"120^\circ = \tfrac{2}{3} \cdot 180^\circ", size=46),
            M(R"= \tfrac{2}{3}\,\pi = \frac{2\pi}{3}", size=50, t2c={R"\frac{2\pi}{3}": C_COS}),
            M(R"120^\circ \cdot \frac{\pi}{180^\circ} = \frac{2\pi}{3}", size=42, color=MUTED),
        ).arrange(DOWN, buff=0.3).move_to(2.1 * DOWN)
        self.say("Entonces ciento veinte grados son dos tercios de pi. La fórmula dice lo mismo: multiplicar por pi sobre 180.")
        self.play(Write(steps[0]))
        self.play(Write(steps[1]))
        self.play(FadeIn(steps[2], shift=0.2 * UP))
        self.hold()

        self.mark("De radianes a grados")
        self.clear_scene(keep=[key])
        self.say("Al revés: cinco pi cuartos. Un pi cuarto es la cuarta parte de 180, o sea 45 grados. "
                 "Cinco de ellos son 225 grados.")
        base = get_trig_axes(R, c, extend=0.3)
        self.play(ShowCreation(base), run_time=0.6)
        wedges = VGroup()
        for k in range(5):
            s = Polygon(np.array(c), *[point_on(a * DEGREES, R, c) for a in np.linspace(45 * k, 45 * (k + 1), 12)])
            s.set_fill(C_SEN if k % 2 else C_COS, 0.4).set_stroke(INK, 1.5)
            n = T(str(k + 1), size=26).move_to(point_on((45 * k + 22.5) * DEGREES, R * 0.65, c))
            wedges.add(VGroup(s, n))
        self.play(LaggedStartMap(FadeIn, wedges, lag_ratio=0.35), run_time=2.5)
        steps = VGroup(
            M(R"\frac{\pi}{4} = 45^\circ", size=46),
            M(R"\frac{5\pi}{4} = 5 \cdot 45^\circ = 225^\circ", size=50, t2c={R"225^\circ": C_ANG}),
            M(R"\frac{5\pi}{4} \cdot \frac{180^\circ}{\pi} = 225^\circ", size=42, color=MUTED),
        ).arrange(DOWN, buff=0.3).move_to(2.1 * DOWN)
        self.play(Write(steps[0]))
        self.play(Write(steps[1]))
        self.play(FadeIn(steps[2], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_Coterminales(MBScene):
    def construct(self):
        self.mark("Seguir girando")
        self.set_header(R"\theta + 360^\circ k", "Ángulos coterminales", C_TAN, P_TAN)
        c = 1.6 * UP
        axes = get_trig_axes(2.2, c, circle=False)
        self.play(ShowCreation(axes), run_time=0.8)
        theta = ValueTracker(0)
        spiral = always_redraw(lambda: ParametricCurve(
            lambda t: point_on(t, 0.7 + 0.18 * t / TAU, c), t_range=(0, max(theta.get_value(), 0.01), 0.05),
        ).set_stroke(C_TAN, 4) if theta.get_value() > 0.02 else VectorizedPoint(c))
        hand = always_redraw(lambda: arm(theta.get_value(), 2.4, c))
        turns = always_redraw(lambda: T(f"vueltas completas: {int(theta.get_value() // TAU)}", size=30, color=C_TAN).move_to(c + 3.2 * DOWN))
        self.say("¿Y si no paramos en una vuelta? El lado terminal sigue girando y vuelve a pasar por los mismos lugares. "
                 "Gira 765 grados.", fox=True)
        self.add(spiral, hand, turns)
        self.play(theta.animate.set_value(765 * DEGREES), run_time=6, rate_func=linear)
        self.hold()
        eq = M(R"765^\circ - 2 \cdot 360^\circ = 45^\circ", size=50, t2c={R"45^\circ": C_ANG}).move_to(c + 4.3 * DOWN)
        self.say("Dos vueltas completas y 45 grados más. El lado terminal queda justo donde quedaría 45 grados: "
                 "por eso 765 y 45 se llaman coterminales.")
        self.play(Write(eq))
        self.hold()
        spiral.clear_updaters(); hand.clear_updaters(); turns.clear_updaters()

        self.mark("También con negativos")
        self.clear_scene()
        axes = get_trig_axes(2.2, c, circle=False)
        self.add(axes)
        neg = ValueTracker(0)
        hand2 = always_redraw(lambda: arm(neg.get_value(), 2.4, c, color=C_I))
        arc2 = always_redraw(lambda: get_angle_arc(neg.get_value(), 0.7, c, color=C_I))
        self.add(hand2, arc2)
        self.say("Con un giro negativo pasa lo mismo: menos noventa grados apunta hacia abajo, igual que 270 grados.")
        self.play(neg.animate.set_value(-90 * DEGREES), run_time=2)
        ghost = get_angle_arc(270 * DEGREES, 1.0, c, color=C_TAN)
        self.play(ShowCreation(ghost), run_time=2)
        eq2 = M(R"-90^\circ + 360^\circ = 270^\circ", size=50).move_to(c + 3.4 * DOWN)
        rule = M(R"\theta \;\text{y}\; \theta + 360^\circ k \;\text{son coterminales}", size=40, color=C_TAN).next_to(eq2, DOWN, buff=0.5)
        self.play(Write(eq2))
        self.say("La regla: sumar o restar vueltas completas, de 360 grados o de dos pi, no cambia el lado terminal.")
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.5)
        hand2.clear_updaters(); arc2.clear_updaters()
        self.end_section()


class S06_Complementos(MBScene):
    def construct(self):
        self.mark("Complementarios")
        self.set_header(R"90^\circ", "Complementos y suplementos", C_SEN, P_SEN)
        c = 2.0 * UP + 1.6 * LEFT
        R = 2.6
        corner = VGroup(Line(c, c + R * RIGHT), Line(c, c + R * UP)).set_stroke(INK, 4)
        sq = Square(0.35).set_stroke(MUTED, 2).move_to(c + 0.175 * (RIGHT + UP))
        ray = arm(25 * DEGREES, R, c, color=C_SEN)
        a = get_angle_arc(25 * DEGREES, 1.2, c, color=C_COS)
        b = Arc(25 * DEGREES, 65 * DEGREES, radius=1.5, arc_center=c).set_stroke(C_ANG, 5)
        la = deg_label(25, 36, C_COS).move_to(point_on(12 * DEGREES, 1.55, c))
        lb = deg_label(65, 36, C_ANG).move_to(point_on(58 * DEGREES, 1.9, c))
        self.say("Dos ángulos son complementarios si juntos forman una esquina, un ángulo recto: suman 90 grados.", fox=True)
        self.play(ShowCreation(corner), ShowCreation(sq))
        self.play(ShowCreation(ray), ShowCreation(a), ShowCreation(b), FadeIn(la), FadeIn(lb))
        eq = M(R"25^\circ + 65^\circ = 90^\circ", size=50).move_to(1.3 * DOWN)
        self.play(Write(eq))
        self.hold()

        self.mark("Suplementarios")
        self.clear_scene()
        c2 = 1.4 * UP
        line = Line(c2 + 3 * LEFT, c2 + 3 * RIGHT).set_stroke(INK, 4)
        ray2 = arm(50 * DEGREES, 2.6, c2, color=C_SEN)
        a2 = get_angle_arc(50 * DEGREES, 1.0, c2, color=C_COS)
        b2 = Arc(50 * DEGREES, 130 * DEGREES, radius=1.3, arc_center=c2).set_stroke(C_ANG, 5)
        la2 = deg_label(50, 36, C_COS).move_to(point_on(22 * DEGREES, 1.45, c2))
        lb2 = deg_label(130, 36, C_ANG).move_to(point_on(118 * DEGREES, 1.8, c2))
        self.say("Y son suplementarios si juntos forman una línea recta, media vuelta: suman 180 grados.")
        self.play(ShowCreation(line))
        self.play(ShowCreation(ray2), ShowCreation(a2), ShowCreation(b2), FadeIn(la2), FadeIn(lb2))
        eq2 = M(R"130^\circ + 50^\circ = 180^\circ", size=50).move_to(1.6 * DOWN)
        self.play(Write(eq2))
        self.hold(0.5)
        self.end_section()


class S07_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", C_COS, P_COS)
        cards = VGroup(*(
            get_card(VGroup(TB(t, size=26, color=col), T(d, size=24, color=INK)).arrange(DOWN, buff=0.12), color=col, fill=PEACH, buff=0.28)
            for t, d, col in [
                ("Posición estándar", "empieza en el eje x · ↺ positivo, ↻ negativo", C_ANG),
                ("Grados y radianes", "180° = π rad · 1 rad ≈ 57.3°", C_COS),
                ("Coterminales", "sumar o restar vueltas: θ + 360° k", C_TAN),
                ("Complemento y suplemento", "suman 90° y 180°", C_SEN),
            ]
        ))
        for card in cards:
            card.stretch_to_fit_width(7.0)
        rows = VGroup(*(VGroup(card, VGroup(TB(t, size=26, color=col), T(d, size=24, color=INK)).arrange(DOWN, buff=0.12).move_to(card))
                        for card, (t, d, col) in zip(cards, [
                            ("Posición estándar", "empieza en el eje x · ↺ positivo, ↻ negativo", C_ANG),
                            ("Grados y radianes", "180° = π rad · 1 rad ≈ 57.3°", C_COS),
                            ("Coterminales", "sumar o restar vueltas: θ + 360° k", C_TAN),
                            ("Complemento y suplemento", "suman 90° y 180°", C_SEN),
                        ]))).arrange(DOWN, buff=0.3).move_to(1.4 * UP)
        self.say("Repasemos: los ángulos se dibujan en posición estándar; media vuelta son 180 grados o pi radianes; "
                 "sumar vueltas da ángulos coterminales; y complementos y suplementos completan 90 y 180.")
        self.play(LaggedStartMap(FadeIn, rows, shift=0.3 * UP, lag_ratio=0.3), run_time=2.2)
        self.hold(0.5)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.play(FadeOut(self.header))
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los juegos:\ngira la rueda del ángulo\ny une grados con radianes", size=30, color=C_COS, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
