"""
Clase T15 · Resolver ecuaciones trigonométricas (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Resolver es buscar dónde la gráfica cruza una recta;
cos x = −√2/2 con sus dos soluciones por vuelta y la solución general; 2sen²x − 3sen x + 1 = 0 como
cuadrática; tan²x = 3 en [0, 2π); y una solución extraña al elevar al cuadrado, con zoom a la
verificación. Manual de la UdeA §13.9.

    manimgl ecuaciones.py S02_General -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def make_axes(center, y=(-1.5, 1.5, 1), height=3.0, x_max=2 * PI):
    ax = Axes(x_range=(0, x_max, PI / 2), y_range=y, width=7.0, height=height,
              axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
    return ax.move_to(center)


def pi_labels(ax, size=24):
    names = {1: R"\tfrac{\pi}{2}", 2: R"\pi", 3: R"\tfrac{3\pi}{2}", 4: R"2\pi"}
    return VGroup(*(M(v, size=size, color=MUTED).next_to(ax.c2p(k * PI / 2, 0), DOWN, buff=0.15) for k, v in names.items()))


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T15"
    title = "Resolver ecuaciones\ntrigonométricas"
    subtitle = "Cazar todos los ángulos"


class S01_Cruces(MBScene):
    def construct(self):
        self.mark("Resolver es buscar cruces")
        self.set_header(R"f(x) = k", "¿Dónde se cruzan?", C_ANG, P_ANG)
        ax = make_axes(2.2 * UP, height=3.6)
        g = ax.get_graph(np.cos).set_stroke(C_COS, 6)
        k = -np.sqrt(2) / 2
        line = ax.get_graph(lambda x: k).set_stroke(C_ANG, 3)
        q = M(R"\cos x = -\tfrac{\sqrt2}{2}", size=52, color=C_COS).next_to(ax, UP, buff=0.2)
        self.say("Resolver coseno de x igual a menos raíz de dos medios es preguntar: ¿en qué x la onda del coseno baja justo hasta esa altura?", fox=True)
        self.play(Write(q))
        self.play(ShowCreation(ax), FadeIn(pi_labels(ax)), ShowCreation(g), run_time=2)
        self.play(ShowCreation(line))
        xs = [3 * PI / 4, 5 * PI / 4]
        dots = VGroup(*(Dot(ax.c2p(x, k), radius=0.11).set_color(C_ANG) for x in xs))
        self.play(LaggedStartMap(GrowFromCenter, dots, lag_ratio=0.4))
        self.say("En una vuelta hay dos cruces. ¿Cuáles son exactamente?")
        self.hold()
        R_, c = 1.7, 2.6 * DOWN
        circ = get_trig_axes(R_, c)
        self.play(ShowCreation(circ))
        vline = DashedLine(c + R_ * (k * RIGHT + 1.2 * DOWN), c + R_ * (k * RIGHT + 1.2 * UP)).set_stroke(C_ANG, 3)
        pts = VGroup(*(Dot(point_on(a, R_, c), radius=0.1).set_color(C_ANG) for a in xs))
        self.say("En la circunferencia: el ángulo de referencia es cuarenta y cinco grados, y el coseno es negativo en el segundo y el tercer cuadrante.")
        self.play(ShowCreation(vline), LaggedStartMap(GrowFromCenter, pts, lag_ratio=0.3))
        labs = VGroup(M(R"\tfrac{3\pi}{4}", size=32, color=C_ANG).next_to(pts[0], UL, buff=0.1),
                      M(R"\tfrac{5\pi}{4}", size=32, color=C_ANG).next_to(pts[1], DL, buff=0.1))
        self.play(FadeIn(labs))
        self.hold(0.5)
        self.end_section()


class S02_General(MBScene):
    def construct(self):
        self.mark("Todas las vueltas")
        self.set_header(R"+\,2n\pi", "Solución general", C_COS, P_COS)
        ax = make_axes(2.8 * UP, height=3.0, x_max=6 * PI)
        ax.stretch_to_fit_width(7.2)
        g = ax.get_graph(np.cos, x_range=(0, 6 * PI)).set_stroke(C_COS, 5)
        k = -np.sqrt(2) / 2
        line = ax.get_graph(lambda x: k, x_range=(0, 6 * PI)).set_stroke(C_ANG, 3)
        self.say("Si la onda sigue, los cruces se repiten cada vuelta completa, dos pi. Hay infinitas soluciones.", fox=True)
        self.play(ShowCreation(ax), ShowCreation(g), run_time=2)
        self.play(ShowCreation(line))
        xs = [3 * PI / 4 + 2 * n * PI for n in range(3)] + [5 * PI / 4 + 2 * n * PI for n in range(3)]
        dots = VGroup(*(Dot(ax.c2p(x, k), radius=0.09).set_color(C_ANG) for x in sorted(xs)))
        self.play(LaggedStartMap(GrowFromCenter, dots, lag_ratio=0.15), run_time=2)
        self.hold()
        gen = VGroup(
            M(R"x = \tfrac{3\pi}{4} + 2n\pi", size=50, color=C_ANG),
            M(R"x = \tfrac{5\pi}{4} + 2n\pi", size=50, color=C_ANG),
            M(R"n \in \mathbb{Z}", size=40, color=MUTED),
        ).arrange(DOWN, buff=0.4).move_to(0.6 * DOWN)
        self.say("Por eso la solución general se escribe con las dos de una vuelta más dos n pi, donde n es cualquier entero.")
        self.play(LaggedStartMap(Write, gen, lag_ratio=0.4), run_time=2.5)
        self.hold()
        tip = VGroup(
            T("Receta", size=30, color=C_ANG),
            T("1. Despeja la función: cos x = número", size=26),
            T("2. Ángulo de referencia", size=26),
            T("3. Cuadrantes según el signo", size=26),
            T("4. Suma las vueltas", size=26),
        ).arrange(DOWN, buff=0.18, aligned_edge=LEFT).move_to(3.3 * DOWN)
        self.say("Esa es la receta para todas: despejar, ángulo de referencia, cuadrantes, y vueltas.")
        self.play(FadeIn(get_card(tip, color=C_ANG, fill=PEACH)), FadeIn(tip))
        self.hold(0.5)
        self.end_section()


class S03_Cuadratica(MBScene):
    def construct(self):
        self.mark("Una cuadrática disfrazada")
        self.set_header(R"u = " + SEN + R" x", "Disfraz de cuadrática", C_SEN, P_SEN)
        s = VGroup(
            M(R"2\," + SEN + R"^2 x - 3\," + SEN + R" x + 1 = 0", size=50),
            M(R"2u^2 - 3u + 1 = 0", size=50, color=C_ANG),
            M(R"(2u - 1)(u - 1) = 0", size=50, color=C_ANG),
            M(SEN + R" x = \tfrac12 \quad\text{o}\quad " + SEN + R" x = 1", size=48, color=C_SEN),
        ).arrange(DOWN, buff=0.5).move_to(2.4 * UP)
        self.say("Esta parece complicada, pero si llamas u al seno de x se convierte en una cuadrática de las de siempre.", fox=True)
        self.play(Write(s[0]))
        self.play(TransformFromCopy(s[0], s[1]), run_time=1.6)
        self.say("Se factoriza: dos u menos uno, por u menos uno.")
        self.play(Write(s[2]))
        self.say("Volvemos a x: seno de x es un medio, o seno de x es uno.")
        self.play(Write(s[3]))
        self.hold()
        sols = VGroup(
            M(SEN + R" x = \tfrac12:\;\; x = \tfrac{\pi}{6},\; \tfrac{5\pi}{6}", size=42),
            M(SEN + R" x = 1:\;\; x = \tfrac{\pi}{2}", size=42),
        ).arrange(DOWN, buff=0.35).next_to(s, DOWN, buff=0.7)
        self.say("Seno un medio da pi sextos y cinco pi sextos. Seno uno da solo pi medios: en la cima la onda apenas toca la recta.")
        self.play(LaggedStartMap(FadeIn, sols, shift=0.2 * UP, lag_ratio=0.4))
        total = get_pill("tres soluciones en [0, 2π)", C_ANG, PEACH, size=28).next_to(sols, DOWN, buff=0.5)
        self.play(FadeIn(total, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Tangente(MBScene):
    def construct(self):
        self.mark("Con raíz")
        self.set_header(R"\tan^2 x = 3", "Dos signos", C_TAN, P_TAN)
        s = VGroup(
            M(R"\tan^2 x = 3", size=52),
            M(R"\tan x = \sqrt3 \quad\text{o}\quad \tan x = -\sqrt3", size=44, color=C_TAN),
        ).arrange(DOWN, buff=0.5).move_to(4.0 * UP)
        self.say("Al sacar raíz cuadrada no olvides el menos: tangente de x puede ser raíz de tres o menos raíz de tres.", fox=True)
        self.play(Write(s[0]))
        self.play(Write(s[1]))
        R_, c = 2.3, 0.4 * DOWN
        circ = get_trig_axes(R_, c)
        self.play(ShowCreation(circ))
        angs = [PI / 3, 4 * PI / 3, 2 * PI / 3, 5 * PI / 3]
        cols = [C_TAN, C_TAN, C_I, C_I]
        rays = VGroup(*(Line(c, point_on(a, R_, c)).set_stroke(col, 5) for a, col in zip(angs, cols)))
        names = [R"\tfrac{\pi}{3}", R"\tfrac{4\pi}{3}", R"\tfrac{2\pi}{3}", R"\tfrac{5\pi}{3}"]
        labs = VGroup(*(M(n, size=34, color=col).move_to(point_on(a, R_ + 0.5, c)) for n, a, col in zip(names, angs, cols)))
        self.say("Tangente positiva en el primero y el tercero, con referencia de sesenta grados. Negativa en el segundo y el cuarto.")
        self.play(LaggedStartMap(ShowCreation, rays, lag_ratio=0.3), LaggedStartMap(FadeIn, labs, lag_ratio=0.3), run_time=2.5)
        self.hold()
        note = M(R"\text{general: } x = \tfrac{\pi}{3} + n\pi,\;\; x = \tfrac{2\pi}{3} + n\pi", size=38, color=C_TAN).move_to(4.0 * DOWN)
        self.say("Como la tangente se repite cada pi, no cada dos pi, cada familia avanza de media vuelta en media vuelta.")
        self.play(Write(note))
        self.hold(0.5)
        self.end_section()


class S05_Extranas(MBScene):
    def construct(self):
        self.mark("Soluciones extrañas")
        self.set_header(R"(\;)^2", "¡Cuidado al elevar!", C_I, P_I)
        s = VGroup(
            M(SEN + R" x + \cos x = 1", size=50),
            M(SEN + R"^2 x + 2\," + SEN + R" x\cos x + \cos^2 x = 1", size=40),
            M(R"1 + " + SEN + R" 2x = 1 \;\Rightarrow\; " + SEN + R" 2x = 0", size=44, color=C_ANG),
            M(R"x = 0,\; \tfrac{\pi}{2},\; \pi,\; \tfrac{3\pi}{2}", size=46, color=C_ANG),
        ).arrange(DOWN, buff=0.45).move_to(3.0 * UP)
        self.say("A veces conviene elevar al cuadrado. Seno más coseno igual a uno: al cuadrado aparece la pitagórica y el ángulo doble.", fox=True)
        self.play(Write(s[0]))
        self.play(Write(s[1]), run_time=1.6)
        self.play(Write(s[2]))
        self.say("Salen cuatro candidatos en una vuelta. Pero elevar al cuadrado puede colar impostores: hay que revisar cada uno en la ecuación original.")
        self.play(Write(s[3]))
        self.hold()
        self.mark("Zoom a la verificación")
        checks = VGroup(
            M(R"x = 0:\; 0 + 1 = 1", size=34), M(R"x = \tfrac{\pi}{2}:\; 1 + 0 = 1", size=34),
            M(R"x = \pi:\; 0 - 1 = -1", size=34), M(R"x = \tfrac{3\pi}{2}:\; -1 + 0 = -1", size=34),
        ).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to(2.4 * DOWN + 0.4 * LEFT)
        marks = VGroup(check_mark(size=48), check_mark(size=48), ex_mark(size=48), ex_mark(size=48))
        for m, row in zip(marks, checks):
            m.next_to(row, RIGHT, buff=0.4)
        self.play(FadeIn(checks))
        self.zoom_to(VGroup(checks, marks), scale=0.5)
        self.say("Cero y pi medios cumplen. Pero en pi y en tres pi medios la suma da menos uno: son soluciones extrañas, nacidas del cuadrado.")
        self.play(LaggedStartMap(FadeIn, marks, scale=1.5, lag_ratio=0.4), run_time=2)
        self.hold()
        self.zoom_reset()
        res = get_pill("solo x = 0 y x = π/2", C_Q, PEACH, size=30).move_to(4.2 * DOWN)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S06_Cierre(TrigCierre):
    recap = [
        ("Despejar", "llegar a sen x = k, cos x = k o tan x = k", C_ANG),
        ("Dos por vuelta", "ángulo de referencia + cuadrantes del signo", C_COS),
        ("General", "+ 2nπ (seno, coseno) o + nπ (tangente)", C_TAN),
        ("Verificar", "elevar al cuadrado puede colar soluciones extrañas", C_I),
    ]
    recap_say = ("Repasemos: despeja la función, usa el ángulo de referencia y los cuadrantes, suma las vueltas y, si elevaste al "
                 "cuadrado, verifica cada candidato.")
    practice = "Ahora, el juego:\npesca todas las raíces"
