"""
Clase T8 · Seno y coseno: amplitud (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. La onda seno nace al «desenrollar» la circunferencia
(la cámara sigue el lápiz), el coseno es el seno corrido π/2, la amplitud estira y el signo refleja, y el
desplazamiento vertical sube la onda (rango [d − |a|, d + |a|]). Manual de la UdeA §13.5.

    manimgl amplitud.py S01_Desenrollar -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def make_axes(x_max=2 * PI, y=(-1.5, 1.5, 1), width=6.6, height=3.0, center=ORIGIN):
    ax = Axes(x_range=(0, x_max, PI / 2), y_range=y, width=width, height=height,
              axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
    ax.move_to(center)
    return ax


def pi_labels(ax, ks=(1, 2, 3, 4), size=26):
    names = {1: R"\tfrac{\pi}{2}", 2: R"\pi", 3: R"\tfrac{3\pi}{2}", 4: R"2\pi"}
    return VGroup(*(M(names[k], size=size, color=MUTED).next_to(ax.c2p(k * PI / 2, 0), DOWN, buff=0.18) for k in ks))


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T8"
    title = "Seno y coseno:\namplitud"
    subtitle = "De la rueda a la onda"


class S01_Desenrollar(MBScene):
    def construct(self):
        self.mark("Desenrollar la circunferencia")
        self.set_header(SEN + " x", "La onda seno", C_SEN, P_SEN)
        c = 3.05 * LEFT + 2.2 * UP
        R = 0.85
        ax = Axes(x_range=(0, 2 * PI, PI / 2), y_range=(-1.2, 1.2, 1), width=5.4, height=2 * 1.2 * R,
                  axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
        ax.shift(c + 1.5 * RIGHT - ax.c2p(0, 0))
        circle = Circle(radius=R).move_to(c).set_stroke(INK, 3, opacity=0.6)
        t = ValueTracker(0)
        dot = always_redraw(lambda: Dot(point_on(t.get_value(), R, c), radius=0.08).set_color(C_ANG))
        radius = always_redraw(lambda: Line(c, point_on(t.get_value(), R, c)).set_stroke(INK, 3))
        height = always_redraw(lambda: Line(point_on(t.get_value(), R, c), np.array([point_on(t.get_value(), R, c)[0], c[1], 0])).set_stroke(C_SEN, 5))
        bridge = always_redraw(lambda: DashedLine(point_on(t.get_value(), R, c), ax.c2p(t.get_value(), np.sin(t.get_value()))).set_stroke(C_SEN, 2, opacity=0.7))
        graph = always_redraw(lambda: ax.get_graph(np.sin, x_range=(0, max(t.get_value(), 0.01))).set_stroke(C_SEN, 5))
        pen = always_redraw(lambda: Dot(ax.c2p(t.get_value(), np.sin(t.get_value())), radius=0.08).set_color(C_SEN))
        self.say("Pongamos a girar el punto de la circunferencia unitaria y, al lado, anotemos su altura, el seno, "
                 "mientras el ángulo avanza.", fox=True)
        self.play(ShowCreation(circle), ShowCreation(ax), FadeIn(pi_labels(ax, size=22)))
        self.add(radius, height, dot, bridge, graph, pen)
        self.zoom_to(c + 1.2 * RIGHT, scale=0.45, run_time=1.5)
        follow = lambda f: f.move_to(np.array([max(c[0] + 1.2, ax.c2p(t.get_value(), 0)[0] - 0.6), c[1], 0]))
        self.frame.add_updater(follow)
        self.say("La cámara sigue al lápiz: sube a 1 en pi medios, vuelve a 0 en pi, baja a menos 1 en tres pi "
                 "medios y regresa a 0 en dos pi.")
        self.play(t.animate.set_value(2 * PI), run_time=10, rate_func=linear)
        self.frame.remove_updater(follow)
        self.zoom_reset(run_time=1.8)
        self.hold()
        for m in (dot, radius, height, bridge, graph, pen):
            m.clear_updaters()
        facts = VGroup(
            M(R"\text{m\'aximo } 1 \text{ en } \tfrac{\pi}{2}", size=38, color=C_SEN),
            M(R"\text{m\'inimo } -1 \text{ en } \tfrac{3\pi}{2}", size=38, color=C_SEN),
            M(R"\text{rango: } [-1, 1] \quad \text{periodo: } 2\pi", size=38),
        ).arrange(DOWN, buff=0.3).move_to(1.3 * DOWN)
        self.say("Esa es la onda seno: nunca pasa de 1 ni baja de menos 1, y se repite cada dos pi.")
        self.play(LaggedStartMap(FadeIn, facts, lag_ratio=0.3, shift=0.2 * UP), run_time=2)
        self.hold(0.5)
        self.end_section()


class S02_Coseno(MBScene):
    def construct(self):
        self.mark("El coseno es un seno corrido")
        self.set_header(R"\cos x", "La onda coseno", C_COS, P_COS)
        ax = make_axes(x_max=2.5 * PI, width=7.0, height=3.0, center=1.6 * UP)
        shift = ValueTracker(0)
        sin_g = always_redraw(lambda: ax.get_graph(lambda x: np.sin(x + shift.get_value()), x_range=(0, 2.5 * PI)).set_stroke(C_SEN, 5))
        cos_g = ax.get_graph(np.cos, x_range=(0, 2.5 * PI)).set_stroke(C_COS, 6, opacity=0.9)
        self.say("Si en lugar de la altura anotamos cuánto avanza el punto, la x, sale la onda coseno: empieza "
                 "arriba, en 1.", fox=True)
        self.play(ShowCreation(ax), FadeIn(pi_labels(ax, size=24)))
        self.play(ShowCreation(cos_g), run_time=2)
        self.hold()
        self.say("Tiene la misma forma que el seno. Pongamos el seno encima y corrámoslo un cuarto de vuelta, pi medios, "
                 "hacia la izquierda.")
        self.add(sin_g)
        self.play(shift.animate.set_value(PI / 2), run_time=3)
        eq = M(R"\cos x = " + SEN + R"\left(x + \tfrac{\pi}{2}\right)", size=46).move_to(1.4 * DOWN)
        self.play(Write(eq))
        self.say("¡Coinciden! El coseno es el mismo seno, solo que adelantado pi medios.")
        self.hold(0.5)
        sin_g.clear_updaters()
        self.end_section()


class S03_Amplitud(MBScene):
    def construct(self):
        self.mark("Estirar la onda")
        self.set_header(R"a\," + SEN + " x", "Amplitud", C_ANG, P_ANG)
        ax = make_axes(y=(-3.4, 3.4, 1), width=7.0, height=6.0, center=1.0 * UP)
        a = ValueTracker(1)
        g = always_redraw(lambda: ax.get_graph(lambda x: a.get_value() * np.sin(x)).set_stroke(C_SEN, 5))
        top = always_redraw(lambda: DashedLine(ax.c2p(0, abs(a.get_value())), ax.c2p(2 * PI, abs(a.get_value()))).set_stroke(C_ANG, 2))
        bot = always_redraw(lambda: DashedLine(ax.c2p(0, -abs(a.get_value())), ax.c2p(2 * PI, -abs(a.get_value()))).set_stroke(C_ANG, 2))
        lab = always_redraw(lambda: M(f"y = {round(a.get_value(), 1):g}" + R"\," + SEN + " x", size=44, color=C_ANG).move_to(3.3 * DOWN))
        self.say("Multiplicar el seno por un número a lo estira hacia arriba y hacia abajo. A ese número, sin signo, "
                 "se le llama amplitud.", fox=True)
        self.play(ShowCreation(ax), FadeIn(pi_labels(ax, size=24)))
        self.add(g, top, bot, lab)
        self.play(a.animate.set_value(3), run_time=2.5)
        self.hold()
        self.say("Con a igual a 3, la onda sube hasta 3 y baja hasta menos 3. El periodo no cambia: sigue siendo dos pi.")
        self.wait(1.5)
        self.mark("Un signo negativo la voltea")
        self.say("¿Y si a es negativo, como menos 2? La onda se voltea: donde subía, ahora baja. La amplitud es 2.")
        self.play(a.animate.set_value(-2), run_time=3)
        note = M(R"\text{amplitud} = |a| = |-2| = 2", size=42, color=C_ANG).move_to(4.3 * DOWN)
        self.play(FadeIn(note))
        self.hold(0.5)
        for m in (g, top, bot, lab):
            m.clear_updaters()
        self.end_section()


class S04_Vertical(MBScene):
    def construct(self):
        self.mark("Subir la onda")
        self.set_header(R"+\,d", "Desplazamiento vertical", C_TAN, P_TAN)
        ax = make_axes(y=(-2.4, 3.6, 1), width=7.0, height=6.0, center=1.0 * UP)
        d = ValueTracker(0)
        g = always_redraw(lambda: ax.get_graph(lambda x: 2 * np.sin(x) + d.get_value()).set_stroke(C_SEN, 5))
        mid = always_redraw(lambda: DashedLine(ax.c2p(0, d.get_value()), ax.c2p(2 * PI, d.get_value())).set_stroke(C_TAN, 3))
        self.say("Ahora sumemos un número d al final: la onda entera sube o baja, como si moviéramos el piso.", fox=True)
        self.play(ShowCreation(ax), FadeIn(pi_labels(ax, size=24)))
        self.add(g, mid)
        self.play(d.animate.set_value(1), run_time=2.5)
        eq = M(R"y = 2\," + SEN + R" x + 1", size=48, color=C_SEN).move_to(3.0 * DOWN)
        self.play(Write(eq))
        self.hold()
        hi = DashedLine(ax.c2p(0, 3), ax.c2p(2 * PI, 3)).set_stroke(C_ANG, 2)
        lo = DashedLine(ax.c2p(0, -1), ax.c2p(2 * PI, -1)).set_stroke(C_ANG, 2)
        rango = M(R"\text{rango} = [1 - 2,\; 1 + 2] = [-1,\; 3]", size=42, color=C_ANG).next_to(eq, DOWN, buff=0.35)
        self.say("La línea del medio quedó en 1. Con amplitud 2, la onda sube hasta 3 y baja hasta menos 1. El rango "
                 "va de d menos la amplitud a d más la amplitud.")
        self.play(ShowCreation(hi), ShowCreation(lo))
        self.play(Write(rango))
        self.hold(0.5)
        g.clear_updaters(); mid.clear_updaters()
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Onda seno", "la altura del punto que gira · rango [−1, 1]", C_SEN),
        ("Onda coseno", "el seno adelantado π/2 · empieza en 1", C_COS),
        ("Amplitud", "y = a sen x: estira |a|; si a < 0 se voltea", C_ANG),
        ("Subir y bajar", "y = a sen x + d · rango [d − |a|, d + |a|]", C_TAN),
    ]
    recap_say = ("Repasemos: el seno es la altura del punto que gira y el coseno es el mismo seno adelantado; la "
                 "amplitud estira la onda, el signo la voltea y d la sube o la baja.")
    practice = "Ahora, el juego:\nsintoniza la onda con los botones\nhasta que coincida"
