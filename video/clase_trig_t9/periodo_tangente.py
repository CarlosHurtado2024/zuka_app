"""
Clase T9 · Periodo, desfase y tangente (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. b comprime la onda (periodo 2π/b), el desfase c/b la
corre, se arma y = 2 sen(3x − π) + 1 paso a paso y la tangente crece sin límite junto a su asíntota
(zoom). Manual de la UdeA §13.5 (teoremas 13.8–13.10).

    manimgl periodo_tangente.py S04_Tangente -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def make_axes(x_range=(0, 2 * PI, PI / 2), y=(-1.5, 1.5, 1), width=7.0, height=3.0, center=ORIGIN):
    ax = Axes(x_range=x_range, y_range=y, width=width, height=height,
              axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
    ax.move_to(center)
    return ax


def pi_ticks(ax, ks, size=24):
    names = {-1: R"-\tfrac{\pi}{2}", 1: R"\tfrac{\pi}{2}", 2: R"\pi", 3: R"\tfrac{3\pi}{2}", 4: R"2\pi"}
    return VGroup(*(M(names[k], size=size, color=MUTED).next_to(ax.c2p(k * PI / 2, 0), DOWN, buff=0.18) for k in ks))


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T9"
    title = "Periodo, desfase\ny tangente"
    subtitle = "Ondas más rápidas, corridas y sin techo"


class S01_Periodo(MBScene):
    def construct(self):
        self.mark("Comprimir la onda")
        self.set_header(R"\tfrac{2\pi}{b}", "El periodo", C_COS, P_COS)
        ax = make_axes(center=2.4 * UP, height=3.2)
        b = ValueTracker(1)
        g = always_redraw(lambda: ax.get_graph(lambda x: np.sin(b.get_value() * x)).set_stroke(C_SEN, 5))
        brace = always_redraw(lambda: VGroup(
            Line(ax.c2p(0, -1.35), ax.c2p(2 * PI / b.get_value(), -1.35)).set_stroke(C_ANG, 5),
            Dot(ax.c2p(2 * PI / b.get_value(), -1.35), radius=0.07).set_color(C_ANG),
        ))
        lab = always_redraw(lambda: M(f"b = {round(b.get_value(), 1):g}" + R"\quad\Rightarrow\quad \text{periodo} = " + f"{round(2 / b.get_value(), 2):g}" + R"\pi", size=40, color=C_ANG).move_to(0.0 * UP))
        self.say("Un número b dentro del seno cambia qué tan rápido se repite la onda. Con b igual a 1, una onda completa ocupa dos pi.", fox=True)
        self.play(ShowCreation(ax), FadeIn(pi_ticks(ax, (1, 2, 3, 4))))
        self.add(g, brace, lab)
        self.hold()
        self.say("Con b igual a 2, el ángulo corre el doble de rápido: caben dos ondas, cada una de largo pi.")
        self.play(b.animate.set_value(2), run_time=2.5)
        self.hold()
        self.say("Con b igual a un medio, va más despacio: una onda mide cuatro pi y no alcanza a terminar.")
        self.play(b.animate.set_value(0.5), run_time=2.5)
        rule = M(R"y = " + SEN + R"(bx) \;\Rightarrow\; \text{periodo} = \frac{2\pi}{b}", size=46, color=C_COS).move_to(2.2 * DOWN)
        self.play(Write(rule))
        self.hold(0.5)
        for m in (g, brace, lab):
            m.clear_updaters()
        self.end_section()


class S02_Desfase(MBScene):
    def construct(self):
        self.mark("Correr la onda")
        self.set_header(R"\tfrac{c}{b}", "El desfase", C_SEN, P_SEN)
        ax = make_axes(center=2.4 * UP, height=3.2)
        c = ValueTracker(0)
        base = ax.get_graph(np.sin).set_stroke(MUTED, 3, opacity=0.6)
        g = always_redraw(lambda: ax.get_graph(lambda x: np.sin(x - c.get_value())).set_stroke(C_SEN, 5))
        self.say("Restar un número dentro del seno corre la onda a la derecha. Con seno de x menos pi medios, la onda "
                 "empieza pi medios más tarde.", fox=True)
        self.play(ShowCreation(ax), FadeIn(pi_ticks(ax, (1, 2, 3, 4))), ShowCreation(base))
        self.add(g)
        self.play(c.animate.set_value(PI / 2), run_time=2.5)
        arrow = Arrow(ax.c2p(0, 0.2), ax.c2p(PI / 2, 0.2), buff=0, thickness=4).set_color(C_ANG)
        self.play(GrowArrow(arrow))
        self.hold()
        self.mark("Con b, se divide")
        g.clear_updaters()
        self.play(FadeOut(VGroup(g, arrow)))
        g2 = ax.get_graph(lambda x: np.sin(2 * x - PI / 2)).set_stroke(C_COS, 5)
        steps = VGroup(
            M(SEN + R"\left(2x - \tfrac{\pi}{2}\right) = " + SEN + R"\left(2\left(x - \tfrac{\pi}{4}\right)\right)", size=38),
            M(R"\text{desfase} = \frac{c}{b} = \frac{\pi/2}{2} = \frac{\pi}{4}", size=42, color=C_ANG),
        ).arrange(DOWN, buff=0.35).move_to(0.6 * DOWN)
        self.say("Cuidado cuando hay un b. En seno de dos x menos pi medios, saca el 2 como factor: la onda se corre "
                 "pi cuartos, no pi medios. El desfase es c sobre b.")
        self.play(ShowCreation(g2), run_time=2)
        self.play(Write(steps[0]))
        self.play(Write(steps[1]))
        self.hold(0.5)
        self.end_section()


class S03_Armar(MBScene):
    def construct(self):
        self.mark("Armar una onda")
        self.set_header(R"a,\,b,\,c,\,d", "Todo junto", C_ANG, P_ANG)
        ax = make_axes(y=(-1.6, 3.6, 1), center=2.0 * UP, height=4.6)
        stages = [
            (lambda x: np.sin(x), SEN + R" x", "Partimos del seno de siempre."),
            (lambda x: np.sin(3 * x), SEN + R" 3x", "Con b igual a 3, el periodo es dos pi tercios: caben tres ondas."),
            (lambda x: np.sin(3 * x - PI), SEN + R"(3x - \pi)", "Restar pi y dividir entre 3: se corre pi tercios a la derecha."),
            (lambda x: 2 * np.sin(3 * x - PI), R"2\," + SEN + R"(3x - \pi)", "El 2 de afuera la estira: amplitud 2."),
            (lambda x: 2 * np.sin(3 * x - PI) + 1, R"2\," + SEN + R"(3x - \pi) + 1", "Y el más 1 la sube: el rango va de menos 1 a 3."),
        ]
        self.say("Armemos y igual a 2 seno de 3x menos pi, más 1, pieza por pieza.", fox=True)
        self.play(ShowCreation(ax), FadeIn(pi_ticks(ax, (1, 2, 3, 4))))
        graph = ax.get_graph(stages[0][0]).set_stroke(C_SEN, 5)
        label = M("y = " + stages[0][1], size=48, color=C_SEN).move_to(1.4 * DOWN)
        self.play(ShowCreation(graph), Write(label))
        self.say(stages[0][2])
        self.hold()
        for f, tex, s in stages[1:]:
            new = ax.get_graph(f).set_stroke(C_SEN, 5)
            new_label = M("y = " + tex, size=48, color=C_SEN).move_to(label)
            self.say(s)
            self.play(Transform(graph, new), FadeTransform(label, new_label), run_time=1.8)
            label = new_label
            self.hold()
        summary = M(R"\text{amplitud } 2 \cdot \text{periodo } \tfrac{2\pi}{3} \cdot \text{desfase } \tfrac{\pi}{3} \cdot \text{rango } [-1, 3]", size=32, color=C_ANG).next_to(label, DOWN, buff=0.45)
        self.play(FadeIn(summary))
        self.hold(0.5)
        self.end_section()


class S04_Tangente(MBScene):
    def construct(self):
        self.mark("La tangente")
        self.set_header(R"\tan x", "La tangente y sus asíntotas", C_TAN, P_TAN)
        ax = make_axes(x_range=(-PI / 2, 3 * PI / 2, PI / 2), y=(-4, 4, 1), width=7.0, height=6.0, center=1.2 * UP)
        self.say("La tangente es seno entre coseno. Cuando el coseno se acerca a cero, la división se dispara.", fox=True)
        self.play(ShowCreation(ax), FadeIn(pi_ticks(ax, (-1, 1, 2, 3))))
        w = np.arctan(4)                # cada rama se corta donde |tan x| = 4, el borde de los ejes
        branches = VGroup(*(
            ax.get_graph(np.tan, x_range=(k * PI - w, k * PI + w)).set_stroke(C_TAN, 5)
            for k in (0, 1)
        ))
        asym = VGroup(*(DashedLine(ax.c2p(x, -4), ax.c2p(x, 4)).set_stroke(C_I, 3) for x in (-PI / 2, PI / 2, 3 * PI / 2)))
        self.play(ShowCreation(branches[0]), run_time=2)
        self.play(ShowCreation(asym))
        self.play(ShowCreation(branches[1]), run_time=2)
        self.hold()
        self.mark("Zoom a la asíntota")
        self.say("Acerquémonos a pi medios. Mientras más nos acercamos, más grande se hace la tangente, sin tope.")
        self.zoom_to(ax.c2p(PI / 2 - 0.25, 2.6), scale=0.4, run_time=2)
        table = VGroup(
            M(R"\tan 80^\circ \approx 5.7", size=22),
            M(R"\tan 89^\circ \approx 57.3", size=22),
            M(R"\tan 89.9^\circ \approx 573", size=22),
        ).arrange(DOWN, buff=0.12, aligned_edge=LEFT).move_to(ax.c2p(PI / 2 - 0.85, 2.4))
        self.play(LaggedStartMap(FadeIn, table, lag_ratio=0.4), run_time=1.8)
        self.hold()
        self.zoom_reset(run_time=1.6)
        facts = VGroup(
            M(R"\text{as\'intotas: } x = \tfrac{\pi}{2} + k\pi", size=40, color=C_I),
            M(R"\text{periodo: } \pi \qquad \text{rango: } \mathbb{R}", size=40, color=C_TAN),
        ).arrange(DOWN, buff=0.3).move_to(3.5 * DOWN)
        self.say("Esas rectas que la gráfica nunca toca son las asíntotas. Y la tangente se repite cada pi, la mitad que el seno.")
        self.play(Write(facts[0]))
        self.play(Write(facts[1]))
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Periodo", "y = sen(bx): periodo 2π / b", C_COS),
        ("Desfase", "sen(bx − c): se corre c / b a la derecha", C_SEN),
        ("Todo junto", "y = a sen(bx − c) + d", C_ANG),
        ("Tangente", "periodo π · asíntotas en π/2 + kπ", C_TAN),
    ]
    recap_say = ("Repasemos: b decide el periodo, dos pi sobre b; el desfase es c sobre b; con a, b, c y d armas "
                 "cualquier onda; y la tangente se repite cada pi y tiene asíntotas.")
    practice = "Ahora, el juego:\nsintoniza ondas con periodo\ny desfase justos"
