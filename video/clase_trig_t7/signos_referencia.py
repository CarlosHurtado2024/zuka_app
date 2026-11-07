"""
Clase T7 · Signos y ángulo de referencia (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Signos de seno, coseno y tangente por cuadrante, los
tres casos del ángulo de referencia con zoom (π − θ, θ − π, 2π − θ), ejemplos 150°, 240° y 315°, y la
paridad como espejo en el eje x. Manual de la UdeA §13.4 (definición 13.10, teorema 13.6).

    manimgl signos_referencia.py S02_Referencia -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T7"
    title = "Signos y ángulo\nde referencia"
    subtitle = "En qué cuadrante estás y cuánto vale"


class S01_Signos(MBScene):
    def construct(self):
        self.mark("Los cuatro cuadrantes")
        self.set_header(R"\pm", "Signos por cuadrante", C_ANG, P_ANG)
        R, c = 2.3, 1.4 * UP
        axes = get_trig_axes(R, c)
        self.say("El seno es la y del punto y el coseno es la x. Así que su signo depende de en qué cuadrante cae el punto.", fox=True)
        self.play(ShowCreation(axes))
        quads = [
            ("I", 45, "+", "+", "+"),
            ("II", 135, "+", "−", "−"),
            ("III", 225, "−", "−", "+"),
            ("IV", 315, "−", "+", "−"),
        ]
        boxes = VGroup()
        for name, a, s, co, ta in quads:
            P = point_on(a * DEGREES, R, c)
            pos = c + 1.0 * np.array([np.sign(np.cos(a * DEGREES)), np.sign(np.sin(a * DEGREES)), 0])
            txt = VGroup(
                TB(name, size=26, color=C_ANG),
                M(SEN + " " + ("+" if s == "+" else "-"), size=26, color=C_SEN),
                M(R"\cos " + ("+" if co == "+" else "-"), size=26, color=C_COS),
                M(R"\tan " + ("+" if ta == "+" else "-"), size=26, color=C_TAN),
            ).arrange(DOWN, buff=0.06).move_to(pos)
            dot = Dot(P, radius=0.1).set_color(C_ANG)
            self.play(GrowFromCenter(dot), FadeIn(txt), run_time=0.9)
            boxes.add(VGroup(dot, txt))
        self.hold()
        rule = VGroup(
            T("I: todas positivas", size=28, color=C_ANG),
            T("II: solo el seno", size=28, color=C_SEN),
            T("III: solo la tangente", size=28, color=C_TAN),
            T("IV: solo el coseno", size=28, color=C_COS),
        ).arrange(DOWN, buff=0.15, aligned_edge=LEFT).move_to(3.4 * DOWN)
        self.say("Regla para recordarlo: en el primero, todas positivas; en el segundo, el seno; en el tercero, la "
                 "tangente, porque menos entre menos da más; y en el cuarto, el coseno.")
        self.play(LaggedStartMap(FadeIn, rule, lag_ratio=0.3, shift=0.2 * RIGHT), run_time=2)
        self.hold(0.5)
        self.end_section()


class S02_Referencia(MBScene):
    def construct(self):
        self.mark("El ángulo de referencia")
        self.set_header(R"\theta_R", "Ángulo de referencia", C_COS, P_COS)
        R, c = 2.3, 1.6 * UP
        axes = get_trig_axes(R, c)
        self.say("El ángulo de referencia es el ángulo agudo entre el lado terminal y el eje x, el más cercano. "
                 "Siempre está entre 0 y 90 grados.", fox=True)
        self.play(ShowCreation(axes))
        cases = [
            (150, R"\theta_R = 180^\circ - \theta", PI, C_SEN),
            (240, R"\theta_R = \theta - 180^\circ", PI, C_TAN),
            (315, R"\theta_R = 360^\circ - \theta", TAU, C_COS),
        ]
        prev = None
        for a, formula, axis_ang, col in cases:
            t = a * DEGREES
            P = point_on(t, R, c)
            side = Line(c, P).set_stroke(INK, 4)
            big = get_angle_arc(t, 0.45, c, color=MUTED, width=3)
            ref = Arc(min(t, axis_ang), abs(axis_ang - t), radius=0.95, arc_center=c).set_stroke(col, 6)
            f = M(formula, size=44, color=col).move_to(2.6 * DOWN)
            val = M(f"{a}^\\circ \\;\\to\\; \\theta_R = {abs(int(round(np.degrees(axis_ang))) - a)}^\\circ", size=40).next_to(f, DOWN, buff=0.3)
            group = VGroup(side, big, ref, f, val)
            if prev is not None:
                self.play(FadeOut(prev), run_time=0.5)
            self.play(ShowCreation(side), ShowCreation(big))
            self.zoom_to(c + 0.55 * point_on((t + axis_ang) / 2, 1, ORIGIN), scale=0.42, run_time=1.4)
            self.play(ShowCreation(ref))
            self.zoom_reset(run_time=1.2)
            self.play(Write(f), FadeIn(val))
            self.say(f"Para {a} grados, el lado terminal está a {abs(int(round(np.degrees(axis_ang))) - a)} grados del eje x.")
            self.hold()
            prev = group
        self.hold(0.5)
        self.end_section()


class S03_Ejemplos(MBScene):
    def construct(self):
        self.mark("Valor y signo")
        self.set_header(R"\theta_R + \pm", "Valor de la referencia, signo del cuadrante", C_SEN, P_SEN)
        self.say("Con el ángulo de referencia sacas el valor; con el cuadrante, el signo. Tres ejemplos.", fox=True)
        rows = VGroup(
            VGroup(M(R"150^\circ", size=42, color=C_ANG), T("referencia 30°, cuadrante II", size=24, color=MUTED),
                   M(SEN + R" 150^\circ = \tfrac12 \qquad \cos 150^\circ = -\tfrac{\sqrt3}{2}", size=36)).arrange(DOWN, buff=0.12),
            VGroup(M(R"240^\circ", size=42, color=C_ANG), T("referencia 60°, cuadrante III", size=24, color=MUTED),
                   M(SEN + R" 240^\circ = -\tfrac{\sqrt3}{2} \qquad \cos 240^\circ = -\tfrac12", size=36)).arrange(DOWN, buff=0.12),
            VGroup(M(R"315^\circ", size=42, color=C_ANG), T("referencia 45°, cuadrante IV", size=24, color=MUTED),
                   M(SEN + R" 315^\circ = -\tfrac{\sqrt2}{2} \qquad \cos 315^\circ = \tfrac{\sqrt2}{2}", size=36)).arrange(DOWN, buff=0.12),
        ).arrange(DOWN, buff=0.6).move_to(0.4 * UP)
        says = [
            "Ciento cincuenta grados: referencia 30, segundo cuadrante. El seno es positivo, un medio; el coseno, negativo.",
            "Doscientos cuarenta: referencia 60, tercer cuadrante. Seno y coseno negativos.",
            "Trescientos quince: referencia 45, cuarto cuadrante. Solo el coseno es positivo.",
        ]
        for r, s in zip(rows, says):
            self.say(s)
            self.play(FadeIn(r, shift=0.2 * UP))
            self.hold()
        self.hold(0.5)
        self.end_section()


class S04_Paridad(MBScene):
    def construct(self):
        self.mark("El espejo del eje x")
        self.set_header(R"-t", "Ángulos negativos", C_TAN, P_TAN)
        R, c = 2.3, 1.5 * UP
        axes = get_trig_axes(R, c)
        t = 50 * DEGREES
        P, Q = point_on(t, R, c), point_on(-t, R, c)
        self.say("¿Y un ángulo negativo? Girar hacia abajo es como mirar el ángulo en un espejo puesto sobre el eje x.", fox=True)
        self.play(ShowCreation(axes))
        up = VGroup(Line(c, P).set_stroke(INK, 4), Dot(P, radius=0.1).set_color(C_ANG), get_angle_arc(t, 0.6, c))
        down = VGroup(Line(c, Q).set_stroke(C_I, 4), Dot(Q, radius=0.1).set_color(C_I), get_angle_arc(-t, 0.75, c, color=C_I))
        self.play(FadeIn(up))
        self.play(TransformFromCopy(up, down), run_time=1.6)
        mirror = DashedLine(c + 3 * LEFT, c + 3 * RIGHT).set_stroke(C_ANG, 2)
        self.play(ShowCreation(mirror))
        self.hold()
        eqs = VGroup(
            M(R"\cos(-t) = \cos t", size=44, color=C_COS),
            M(SEN + R"(-t) = -" + SEN + R" t", size=44, color=C_SEN),
            M(R"\tan(-t) = -\tan t", size=44, color=C_TAN),
        ).arrange(DOWN, buff=0.3).move_to(2.9 * DOWN)
        self.say("En el espejo, la x no cambia, así que el coseno queda igual: es una función par. La y cambia de signo, "
                 "así que el seno también: es impar. Y la tangente, también impar.")
        for e in eqs:
            self.play(Write(e), run_time=0.9)
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Signos", "I todas · II seno · III tangente · IV coseno", C_ANG),
        ("Ángulo de referencia", "el agudo con el eje x: da el valor", C_COS),
        ("Paridad", "cos(−t) = cos t · sen(−t) = −sen t", C_TAN),
    ]
    recap_say = ("Repasemos: el cuadrante decide el signo; el ángulo de referencia, el valor; y los ángulos negativos "
                 "son un espejo: el coseno no cambia y el seno cambia de signo.")
    practice = "Ahora, los juegos:\nmueve la noria hasta el ángulo pedido\ny atrapa los puntos con signo"
