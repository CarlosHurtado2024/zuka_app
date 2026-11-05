"""
Clase 2 · Razones, proporciones y proporcionalidad  (vertical 9:16, un solo video, tema morado de Zuka)

Todo se apila de arriba abajo para pantalla de teléfono; nada importante baja de
CONTENT_BOTTOM, donde la app pone sus botones. El video va sin marca, sin
subtítulos y sin voz: cada frase del guion deja una pausa de su mismo largo para
grabar la locución encima.

Renderizar una escena:      manimgl razones_proporciones.py S01_Razon -w
Renderizar todo:            python build.py

Contenido basado en: texto guía Ude@ «Elementos de aritmética», §1.1
(definiciones 1.1 a 1.3, magnitudes proporcionales y reparto proporcional).
"""
from mb_common import *

TOPIC_TITLE = "Razones y\nproporciones"


# ---------------------------------------------------------------------------
# Dibujos sencillos que se repiten
# ---------------------------------------------------------------------------
def get_lemon(size=0.5):
    body = Circle(radius=size / 2).set_fill(C_N, 1).set_stroke("#B8860B", 2)
    shine = Circle(radius=size / 9).set_fill(WHITE, 0.55).set_stroke(width=0)
    shine.move_to(body.get_center() + size * np.array([-0.17, 0.15, 0]))
    return VGroup(body, shine)


def get_glass(size=0.5):
    glass = Rectangle(size * 0.7, size).set_fill(P_Z, 1).set_stroke(C_Z, 2)
    water = Rectangle(size * 0.6, size * 0.6).set_fill(C_Z, 0.8).set_stroke(width=0)
    water.align_to(glass, DOWN).shift(0.04 * UP)
    return VGroup(glass, water)


def get_recipe(lemons: int, glasses: int, size=0.5) -> VGroup:
    """Fila de limones y fila de vasos, una encima de la otra."""
    row_l = VGroup(*(get_lemon(size) for _ in range(lemons))).arrange(RIGHT, buff=0.1)
    row_g = VGroup(*(get_glass(size) for _ in range(glasses))).arrange(RIGHT, buff=0.1)
    return VGroup(row_l, row_g).arrange(DOWN, buff=0.25)


def get_worker(color=C_Z, height=0.6):
    head = Circle(radius=height * 0.18).set_fill(color, 1).set_stroke(width=0)
    body = RoundedRectangle(height * 0.42, height * 0.55, corner_radius=0.08).set_fill(color, 0.8).set_stroke(width=0)
    return VGroup(head, body).arrange(DOWN, buff=0.04)


def get_table(headers, rows, col_width=1.6, color=INK, accent=ORANGE) -> VGroup:
    """Tabla sencilla: encabezados en acento y una línea bajo ellos."""
    cells = VGroup()
    head = VGroup(*(TB(h, size=28, color=accent) for h in headers)).arrange(RIGHT, buff=0)
    for k, cell in enumerate(head):
        cell.move_to(np.array([k * col_width, 0, 0]))
    cells.add(head)
    for r, row in enumerate(rows, start=1):
        line = VGroup(*(T(str(v), size=30, color=color) for v in row))
        for k, cell in enumerate(line):
            cell.move_to(np.array([k * col_width, -0.62 * r, 0]))
        cells.add(line)
    rule = Line(LEFT, RIGHT).set_width(col_width * len(headers)).set_stroke(BORDER, 2)
    rule.move_to(np.array([col_width * (len(headers) - 1) / 2, -0.32, 0]))
    return VGroup(cells, rule)


def get_axes(x_range, y_range, width=6.2, height=4.6) -> Axes:
    axes = Axes(x_range=x_range, y_range=y_range, width=width, height=height,
                axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=True, tip_config=dict(width=0.2, length=0.2)))
    axes.add_coordinate_labels(font_size=22)
    for label in axes.coordinate_labels:
        label.set_color(MUTED)
    return axes


# ---------------------------------------------------------------------------
# Portada
# ---------------------------------------------------------------------------
class S00_Portada(MBScene):
    part_tag = "Clase 2"
    part_subtitle = "Razones, proporciones y proporcionalidad"
    slide_title = "Portada"

    def construct(self):
        self.remove(self.watermark)
        self.mark(self.slide_title)
        blob = Circle(radius=2.75).set_fill(PEACH, 1).set_stroke(width=0).move_to(3.1 * UP)
        halo = Circle(radius=2.25).set_fill("#3B336F", 1).set_stroke(width=0).move_to(blob)
        fox = ImageMobject("zuka_mascota.png", height=3.6).move_to(blob)
        self.play(GrowFromCenter(blob), GrowFromCenter(halo), run_time=1.0)
        self.play(FadeIn(fox, scale=0.85), run_time=1.0)

        tag = get_pill(self.part_tag, ORANGE, PEACH, size=28)
        title = TB(TOPIC_TITLE, size=58, color=INK, alignment="CENTER")
        rule = Line(LEFT, RIGHT).set_width(1.8).set_stroke(ORANGE, 5)
        sub = T(self.part_subtitle, size=30, color=MUTED)
        sub.set_max_width(LINE_WIDTH)
        block = VGroup(tag, title, rule, sub).arrange(DOWN, buff=0.42)
        block.move_to(1.6 * DOWN)
        self.play(FadeIn(tag, shift=0.2 * UP), Write(title, run_time=1.6))
        self.play(ShowCreation(rule), FadeIn(sub, shift=0.2 * UP))
        self.wait(2.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, halo, fox, block)), run_time=0.8)


# ---------------------------------------------------------------------------
# 1. Razón
# ---------------------------------------------------------------------------
class S01_Razon(MBScene):
    def construct(self):
        self.mark("Comparar dividiendo")
        self.set_header(R"a : b", "Razones", C_N, P_N)
        self.say("¡Hola de nuevo! Hoy aprendemos a comparar cantidades. Una razón compara dos "
                 "cantidades dividiendo la primera entre la segunda.", fox=True)
        pair = VGroup(TB("15", size=72, color=C_N), T("a", size=40, color=MUTED), TB("5", size=72, color=C_Z))
        pair.arrange(RIGHT, buff=0.35).move_to(3.4 * UP)
        self.play(FadeIn(pair, shift=0.2 * UP))
        self.hold()

        ratio = M(R"\frac{15}{5} = 3", size=76, t2c={"15": C_N, "5": C_Z}).move_to(1.4 * UP)
        self.say("Quince a cinco es quince sobre cinco, que da tres: la primera cantidad es tres veces la segunda.")
        self.play(FadeTransform(pair.copy(), ratio))
        self.hold()

        ratio2 = M(R"\frac{4}{20} = \frac{1}{4}", size=76, t2c={"4": C_N, "20": C_Z}).move_to(1.1 * DOWN)
        self.say("Cuatro a veinte es un cuarto: la primera cantidad es la cuarta parte de la segunda.")
        self.play(FadeIn(ratio2, shift=0.2 * UP))
        self.hold()

        self.mark("Antecedente y consecuente")
        ante = get_pill("antecedente", C_N, P_N, size=26).next_to(ratio, LEFT, buff=0.5).shift(0.45 * UP)
        cons = get_pill("consecuente", C_Z, P_Z, size=26).next_to(ratio, LEFT, buff=0.5).shift(0.45 * DOWN)
        a_arrow = Arrow(ante.get_right(), ratio.get_left() + 0.35 * UP, buff=0.08, thickness=3).set_color(C_N)
        c_arrow = Arrow(cons.get_right(), ratio.get_left() + 0.35 * DOWN, buff=0.08, thickness=3).set_color(C_Z)
        self.say("El número de arriba se llama antecedente, y el de abajo, consecuente.")
        self.play(FadeIn(ante, shift=0.2 * RIGHT), GrowArrow(a_arrow))
        self.play(FadeIn(cons, shift=0.2 * RIGHT), GrowArrow(c_arrow))
        self.hold(0.3)
        self.end_section()

        self.mark("Una receta que se agranda")
        self.say("Piensa en una limonada: dos limones por cada tres vasos de agua. "
                 "Esa es una razón de dos a tres.", fox=True)
        r1 = get_recipe(2, 3, size=0.6).move_to(3.4 * UP)
        lab1 = M(R"2 : 3", size=56, t2c={"2": C_N, "3": C_Z}).next_to(r1, DOWN, buff=0.35)
        self.play(FadeIn(r1, lag_ratio=0.1), FadeIn(lab1))
        self.hold()
        r2 = get_recipe(4, 6, size=0.5).next_to(lab1, DOWN, buff=0.7)
        lab2 = M(R"4 : 6 = 2 : 3", size=50, t2c={"4": C_N, "6": C_Z}).next_to(r2, DOWN, buff=0.3)
        self.say("Con cuatro limones y seis vasos la limonada sabe igual: es la misma razón, "
                 "porque cuatro sextos es igual a dos tercios.")
        self.play(FadeIn(r2, lag_ratio=0.08), FadeIn(lab2, shift=0.2 * UP))
        self.hold(0.3)
        self.end_section()

        self.mark("Razones famosas")
        self.say("Hay razones famosas. Pi es la razón entre el perímetro de un círculo y su diámetro.")
        circle = Circle(radius=1.3).set_stroke(C_I, 5).move_to(2.9 * UP + 1.7 * LEFT)
        diam = Line(circle.get_left(), circle.get_right()).set_stroke(C_N, 5)
        pi_tex = M(R"\pi = \frac{C}{d} \approx 3.1416", size=52, t2c={"C": C_I, "d": C_N})
        pi_tex.next_to(circle, RIGHT, buff=0.4)
        self.play(ShowCreation(circle), ShowCreation(diam))
        self.play(FadeIn(pi_tex, shift=0.2 * UP))
        self.hold()
        self.say("Y fi, la razón áurea: aparece en las proporciones del Hombre de Vitruvio de Leonardo.")
        phi_rect = Rectangle(2.6, 1.6).set_stroke(C_R, 4).set_fill(P_R, 1).move_to(0.1 * DOWN + 1.5 * LEFT)
        phi_sq = Square(1.6).set_stroke(C_R, 4).set_fill(P_R, 1).align_to(phi_rect, LEFT).align_to(phi_rect, UP)
        a_lab = M("a", size=36, color=C_R).next_to(phi_sq, DOWN, buff=0.15)
        b_lab = M("b", size=36, color=C_R).next_to(phi_rect, DOWN, buff=0.15).shift(1.1 * RIGHT)
        phi_tex = M(R"\varphi = \frac{a + b}{a} \approx 1.618", size=48, color=INK).next_to(phi_rect, RIGHT, buff=0.4)
        self.play(FadeIn(phi_rect), FadeIn(phi_sq), FadeIn(a_lab), FadeIn(b_lab))
        self.play(FadeIn(phi_tex, shift=0.2 * UP))
        self.hold(0.3)
        self.end_section()

        self.mark("Razones inversas")
        self.say("Dos razones son inversas cuando una es la otra al revés: cinco cuartos y cuatro quintos. "
                 "Su producto siempre es uno.")
        inv = M(R"\frac{5}{4} \quad \text{y} \quad \frac{4}{5}", size=70, color=INK).move_to(2.6 * UP)
        prod = M(R"\frac{5}{4} \cdot \frac{4}{5} = 1", size=64, color=C_Q).move_to(0.2 * UP)
        self.play(FadeIn(inv, shift=0.2 * UP))
        self.play(FadeIn(prod, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 2. Proporción
# ---------------------------------------------------------------------------
class S02_Proporcion(MBScene):
    def construct(self):
        self.mark("Dos razones iguales")
        self.set_header(R"\tfrac{a}{b} = \tfrac{c}{d}", "Proporciones", C_Q, P_Q)
        self.say("Quince sobre tres es cinco. Y veinte sobre cuatro también es cinco. "
                 "Cuando dos razones son iguales, forman una proporción.")
        left = M(R"\frac{15}{3} = 5", size=60, color=INK).move_to(3.6 * UP + 1.8 * LEFT)
        right = M(R"\frac{20}{4} = 5", size=60, color=INK).move_to(3.6 * UP + 1.8 * RIGHT)
        self.play(FadeIn(left, shift=0.2 * UP))
        self.play(FadeIn(right, shift=0.2 * UP))
        prop = M(R"\frac{15}{3} = \frac{20}{4}", size=80, color=C_Q).move_to(1.3 * UP)
        self.play(FadeTransform(VGroup(left, right).copy(), prop))
        self.hold()

        self.mark("Cómo se lee")
        read = T("«15 es a 3 como 20 es a 4»", size=34, color=ORANGE).next_to(prop, DOWN, buff=0.6)
        self.say("Se lee: quince es a tres como veinte es a cuatro.")
        self.play(Write(read))
        self.hold(0.3)
        self.play(FadeOut(left), FadeOut(right))

        self.mark("Extremos y medios")
        general = M(R"\frac{a}{b} = \frac{c}{d}", size=84, t2c={"a": C_I, "d": C_I, "b": C_Z, "c": C_Z})
        general.move_to(1.6 * DOWN)
        ext = get_pill("extremos: a y d", C_I, P_I, size=26)
        med = get_pill("medios: b y c", C_Z, P_Z, size=26)
        pills = VGroup(ext, med).arrange(RIGHT, buff=0.4).next_to(general, DOWN, buff=0.6)
        self.say("En general, a es a b como c es a d. Los términos de afuera, a y d, son los extremos; "
                 "los de adentro, b y c, son los medios.")
        self.play(FadeIn(general, shift=0.2 * UP))
        self.play(FadeIn(ext, shift=0.2 * UP), FadeIn(med, shift=0.2 * UP))
        self.hold(0.3)
        self.end_section()

        self.mark("La propiedad fundamental")
        self.say("Propiedad fundamental: en toda proporción, el producto de los extremos es igual "
                 "al producto de los medios. Multiplicamos en cruz.")
        prop = Tex(R"\frac{15}{3} = \frac{20}{4}", font_size=84, isolate=["15", "3", "20", "4"]).set_color(INK)
        prop.move_to(3.3 * UP)
        # Flechas en cruz: 15 con 4 (extremos) y 3 con 20 (medios)
        n15, n3, n20, n4 = (prop.select_part(s) for s in ("15", "3", "20", "4"))
        cross1 = Arrow(n15.get_bottom(), n4.get_top(), buff=0.12, thickness=3).set_color(C_I)
        cross2 = Arrow(n3.get_top(), n20.get_bottom(), buff=0.12, thickness=3).set_color(C_Z)
        self.play(FadeIn(prop))
        self.play(GrowArrow(cross1), GrowArrow(cross2))
        rule = M(R"a \cdot d = b \cdot c", size=64, t2c={"a": C_I, "d": C_I, "b": C_Z, "c": C_Z}).move_to(0.9 * UP)
        nums = M(R"15 \cdot 4 = 60 = 3 \cdot 20", size=56, color=C_Q).next_to(rule, DOWN, buff=0.5)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold()
        self.say("Quince por cuatro es sesenta, y tres por veinte también es sesenta. La proporción está bien.")
        self.play(FadeIn(nums, shift=0.2 * UP))
        self.hold(0.3)
        self.end_section()

        self.mark("¿Forman proporción?")
        self.say("Con esta propiedad decides si dos razones forman proporción. Seis octavos y nueve doceavos: "
                 "seis por doce es setenta y dos, y ocho por nueve también. Sí forman proporción.")
        q1 = M(R"\frac{6}{8} \overset{?}{=} \frac{9}{12}", size=66, color=INK).move_to(3.4 * UP)
        a1 = M(R"6 \cdot 12 = 72 = 8 \cdot 9", size=48, color=C_Q).next_to(q1, DOWN, buff=0.4)
        ok1 = check_mark(C_Q, 60).next_to(a1, RIGHT, buff=0.3)
        self.play(FadeIn(q1, shift=0.2 * UP))
        self.play(FadeIn(a1), FadeIn(ok1, scale=1.4))
        self.hold()
        self.say("Tres cuartos y cinco séptimos: tres por siete es veintiuno, y cuatro por cinco es veinte. "
                 "No son iguales: no forman proporción.")
        q2 = M(R"\frac{3}{4} \overset{?}{=} \frac{5}{7}", size=66, color=INK).move_to(0.4 * DOWN)
        a2 = M(R"3 \cdot 7 = 21 \neq 20 = 4 \cdot 5", size=48, color=C_I).next_to(q2, DOWN, buff=0.4)
        no2 = ex_mark(C_I, 60).next_to(a2, RIGHT, buff=0.3)
        self.play(FadeIn(q2, shift=0.2 * UP))
        self.play(FadeIn(a2), FadeIn(no2, scale=1.4))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 3. Cuarta y media proporcional
# ---------------------------------------------------------------------------
class S03_CuartaMedia(MBScene):
    def construct(self):
        self.mark("Cuarta proporcional")
        self.set_header(R"x", "Cuarta y media proporcional", C_I, P_I)
        self.say("Si en una proporción falta un término, ese término es la cuarta proporcional. "
                 "Tres quintos es igual a doce sobre x.")
        eq = M(R"\frac{3}{5} = \frac{12}{x}", size=80, t2c={"x": C_I}).move_to(3.4 * UP)
        self.play(FadeIn(eq, shift=0.2 * UP))
        self.hold()
        self.say("Multiplicamos en cruz: tres por x es cinco por doce, sesenta. Entonces x es veinte.")
        steps = VGroup(
            M(R"3 \cdot x = 5 \cdot 12", size=56, t2c={"x": C_I}),
            M(R"3x = 60", size=56, t2c={"x": C_I}),
            M(R"x = 20", size=64, color=C_Q),
        ).arrange(DOWN, buff=0.45).next_to(eq, DOWN, buff=0.8)
        for step in steps:
            self.play(FadeIn(step, shift=0.2 * UP), run_time=0.6)
        self.hold(0.3)
        self.end_section()

        self.mark("Media proporcional")
        self.say("Cuando los dos medios son iguales, x es la media proporcional: "
                 "cuatro sobre x igual a x sobre veinticinco.")
        eq2 = M(R"\frac{4}{x} = \frac{x}{25}", size=80, t2c={"x": C_I}).move_to(3.6 * UP)
        sol = M(R"x^2 = 4 \cdot 25 = 100 \ \Rightarrow\ x = 10", size=46, t2c={"x": C_I}).next_to(eq2, DOWN, buff=0.5)
        self.play(FadeIn(eq2, shift=0.2 * UP))
        self.hold()
        self.say("x al cuadrado es cuatro por veinticinco, cien. Así que x es diez.")
        self.play(FadeIn(sol, shift=0.2 * UP))
        self.hold()
        # Rectángulo 4 × 25 (de pie) y cuadrado 10 × 10 con la misma área, a la misma escala
        s = 0.17
        rect = Rectangle(4 * s, 25 * s).set_fill(P_R, 1).set_stroke(C_R, 3)
        sq = Square(10 * s).set_fill(P_Q, 1).set_stroke(C_Q, 3)
        figs = VGroup(rect, sq).arrange(RIGHT, buff=1.2, aligned_edge=DOWN).move_to(1.5 * DOWN)
        rect_lab = T("4 × 25 = 100", size=26, color=C_R).next_to(rect, DOWN, buff=0.2)
        sq_lab = T("10 × 10 = 100", size=26, color=C_Q).next_to(sq, DOWN, buff=0.2)
        self.say("Diez es el lado del cuadrado que tiene la misma área que el rectángulo de cuatro por veinticinco.")
        self.play(FadeIn(rect), FadeIn(rect_lab))
        self.play(GrowFromCenter(sq), FadeIn(sq_lab))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 4. Proporcionalidad directa
# ---------------------------------------------------------------------------
class S04_Directa(MBScene):
    def construct(self):
        self.mark("El ciclista")
        self.set_header(R"y = kx", "Proporcionalidad directa", C_Q, P_Q)
        self.say("Un ciclista recorre 150 kilómetros en 5 horas, siempre al mismo ritmo. "
                 "Veamos cuánto avanza cada hora.", fox=True)
        road = get_number_line((0, 150, 30), width=LINE_WIDTH, font_size=26)
        road.move_to(3.9 * UP)
        km = T("km", size=24, color=MUTED).next_to(road.numbers[-1], RIGHT, buff=0.12)
        rider = Dot(radius=0.16).set_fill(C_Q, 1).set_stroke(WHITE, 3).move_to(road.n2p(0))
        self.play(ShowCreation(road), FadeIn(km), FadeIn(rider))
        self.hold()

        table = get_table(["horas", "km"], [[1, 30], [2, 60], [3, 90], [4, 120], [5, 150]], col_width=2.2)
        table.move_to(1.0 * UP + 1.9 * LEFT)
        self.say("En una hora recorre 30; en dos, 60; en tres, 90. Si el tiempo se duplica, "
                 "la distancia también se duplica.")
        self.play(FadeIn(table[0][0]), ShowCreation(table[1]))
        for r, row in enumerate(table[0][1:], start=1):
            self.play(FadeIn(row, shift=0.1 * RIGHT), rider.animate.move_to(road.n2p(30 * r)), run_time=0.55)
        self.hold()

        self.mark("La constante k")
        self.say("Divide la distancia entre el tiempo: siempre da 30. Esa es la constante de "
                 "proporcionalidad, k. Dos magnitudes son directamente proporcionales cuando su cociente es constante.")
        k_eq = M(R"\frac{30}{1} = \frac{60}{2} = \frac{150}{5} = 30", size=44, color=INK).move_to(2.3 * DOWN)
        k_tag = M(R"k = 30", size=56, color=C_Q).next_to(k_eq, DOWN, buff=0.35)
        self.play(FadeIn(k_eq, shift=0.2 * UP))
        self.play(FadeIn(k_tag, scale=0.9))
        self.hold(0.3)
        self.end_section()

        self.mark("La gráfica: una recta por el origen")
        self.say("En la gráfica, los puntos quedan sobre una recta que pasa por el origen: "
                 "y es igual a k por x.")
        axes = get_axes((0, 6, 1), (0, 180, 30), width=6.0, height=5.2).move_to(0.9 * UP)
        x_lab = T("horas", size=24, color=MUTED).next_to(axes.x_axis, DOWN, buff=0.1).shift(2.4 * RIGHT)
        y_lab = T("km", size=24, color=MUTED).next_to(axes.y_axis, UP, buff=0.1)
        graph = axes.get_graph(lambda x: 30 * x, x_range=(0, 5.6)).set_stroke(C_Q, 4)
        dots = VGroup(*(Dot(axes.c2p(h, 30 * h), radius=0.1).set_fill(C_N, 1) for h in range(1, 6)))
        formula = M(R"y = 30\,x", size=56, color=C_Q).next_to(axes, DOWN, buff=0.5)
        self.play(ShowCreation(axes), FadeIn(x_lab), FadeIn(y_lab))
        self.play(LaggedStartMap(FadeIn, dots, scale=0.5, lag_ratio=0.2))
        self.play(ShowCreation(graph), FadeIn(formula, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 5. Proporcionalidad inversa
# ---------------------------------------------------------------------------
class S05_Inversa(MBScene):
    def construct(self):
        self.mark("Los obreros")
        self.set_header(R"xy = k", "Proporcionalidad inversa", C_Z, P_Z)
        self.say("Doce obreros terminan una obra en 30 días. Con el doble de obreros, 24, "
                 "tardan la mitad: 15 días. Si una magnitud se duplica, la otra se reduce a la mitad.", fox=True)
        crew = VGroup(*(get_worker(C_Z, 0.55) for _ in range(12))).arrange_in_grid(2, 6, buff=0.12).move_to(3.9 * UP)
        crew_lab = T("12 obreros → 30 días", size=30, color=INK).next_to(crew, DOWN, buff=0.3)
        self.play(LaggedStartMap(FadeIn, crew, shift=0.2 * UP, lag_ratio=0.05), FadeIn(crew_lab))
        table = get_table(["obreros", "días"], [[6, 60], [12, 30], [24, 15]], col_width=2.4)
        table.move_to(0.9 * UP + 1.9 * LEFT)
        self.play(FadeIn(table[0][0]), ShowCreation(table[1]))
        for row in table[0][1:]:
            self.play(FadeIn(row, shift=0.1 * RIGHT), run_time=0.55)
        self.hold()

        self.mark("El producto constante")
        self.say("Obreros por días siempre da 360: el producto es constante. "
                 "Eso es proporcionalidad inversa.")
        prod = M(R"6 \cdot 60 = 12 \cdot 30 = 24 \cdot 15 = 360", size=42, color=INK).move_to(1.5 * DOWN)
        k_tag = M(R"x \cdot y = 360", size=54, color=C_Z).next_to(prod, DOWN, buff=0.35)
        self.play(FadeIn(prod, shift=0.2 * UP))
        self.play(FadeIn(k_tag, scale=0.9))
        self.hold()
        self.say("¿Cuántos obreros hacen falta para terminar en 24 días? x por 24 es 360: x es 15.")
        q = M(R"x \cdot 24 = 360 \ \Rightarrow\ x = 15", size=46, color=C_Q).next_to(k_tag, DOWN, buff=0.45)
        self.play(FadeIn(q, shift=0.2 * UP))
        self.hold(0.3)
        self.end_section()

        self.mark("La gráfica: una curva")
        self.say("La gráfica ya no es una recta: es una curva que baja, la hipérbola x por y igual a k.")
        axes = get_axes((0, 30, 6), (0, 70, 10), width=6.0, height=5.2).move_to(0.9 * UP)
        x_lab = T("obreros", size=24, color=MUTED).next_to(axes.x_axis, DOWN, buff=0.1).shift(2.4 * RIGHT)
        y_lab = T("días", size=24, color=MUTED).next_to(axes.y_axis, UP, buff=0.1)
        graph = axes.get_graph(lambda x: 360 / x, x_range=(5.5, 29)).set_stroke(C_Z, 4)
        dots = VGroup(*(Dot(axes.c2p(x, 360 / x), radius=0.1).set_fill(C_N, 1) for x in (6, 12, 24)))
        formula = M(R"y = \frac{360}{x}", size=52, color=C_Z).next_to(axes, DOWN, buff=0.4)
        self.play(ShowCreation(axes), FadeIn(x_lab), FadeIn(y_lab))
        self.play(LaggedStartMap(FadeIn, dots, scale=0.5, lag_ratio=0.2))
        self.play(ShowCreation(graph), FadeIn(formula, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 6. Reparto proporcional y cierre
# ---------------------------------------------------------------------------
class S06_RepartoCierre(MBScene):
    def construct(self):
        self.mark("Reparto proporcional")
        self.set_header(R"2 : 3 : 5", "Reparto proporcional", ORANGE, PEACH)
        self.say("Tres socios reparten 1.200.000 pesos en partes proporcionales a 2, 3 y 5. "
                 "Primero sumamos las partes: diez.", fox=True)
        total = TB("1.200.000", size=54, color=INK).move_to(3.9 * UP)
        parts = M(R"2 + 3 + 5 = 10", size=52, color=ORANGE).next_to(total, DOWN, buff=0.4)
        self.play(FadeIn(total, shift=0.2 * UP))
        self.play(FadeIn(parts, shift=0.2 * UP))
        self.hold()
        self.say("Cada parte vale 1.200.000 dividido entre diez: 120.000.")
        each = M(R"\frac{1\,200\,000}{10} = 120\,000", size=48, color=INK).next_to(parts, DOWN, buff=0.45)
        self.play(FadeIn(each, shift=0.2 * UP))
        self.hold()
        # Barra con los tres tramos
        widths = [2, 3, 5]
        colors = [(C_Q, P_Q), (C_N, P_N), (C_R, P_R)]
        segs = VGroup()
        for w, (c, f) in zip(widths, colors):
            seg = Rectangle(LINE_WIDTH * w / 10, 0.9).set_fill(f, 1).set_stroke(c, 3)
            segs.add(seg)
        segs.arrange(RIGHT, buff=0).move_to(0.7 * DOWN)
        amounts = ["240.000", "360.000", "600.000"]
        labels = VGroup(*(
            VGroup(TB(f"{w}", size=30, color=c), T(a, size=26, color=INK)).arrange(DOWN, buff=0.12).next_to(seg, DOWN, buff=0.25)
            for w, a, seg, (c, _) in zip(widths, amounts, segs, colors)
        ))
        self.say("Dos partes son 240.000; tres partes, 360.000; y cinco partes, 600.000. "
                 "Suman el total: 1.200.000.")
        self.play(LaggedStartMap(GrowFromEdge, segs, edge=LEFT, lag_ratio=0.3), run_time=1.5)
        self.play(LaggedStartMap(FadeIn, labels, shift=0.2 * UP, lag_ratio=0.3))
        check = M(R"240\,000 + 360\,000 + 600\,000 = 1\,200\,000", size=36, color=C_Q).next_to(labels, DOWN, buff=0.5)
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold(0.3)
        self.end_section()

        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_set_badge(R"a : b", "razón", C_N, P_N, width=3.4),
            get_set_badge(R"\tfrac{a}{b} = \tfrac{c}{d}", "proporción", C_Q, P_Q, width=3.4),
            get_set_badge(R"y = kx", "directa", C_Q, P_Q, width=3.4),
            get_set_badge(R"xy = k", "inversa", C_Z, P_Z, width=3.4),
        ).arrange_in_grid(2, 2, h_buff=0.35, v_buff=0.5).move_to(2.0 * UP)
        self.say("Repasemos: una razón compara dos cantidades dividiendo. Una proporción iguala dos razones, "
                 "y los productos cruzados coinciden.")
        self.play(LaggedStartMap(FadeIn, badges[:2], shift=0.3 * UP, lag_ratio=0.3), run_time=1.5)
        self.hold()
        self.say("En la proporcionalidad directa el cociente es constante y la gráfica es una recta; "
                 "en la inversa el producto es constante y la gráfica es una curva.")
        self.play(LaggedStartMap(FadeIn, badges[2:], shift=0.3 * UP, lag_ratio=0.3), run_time=1.5)
        self.hold(0.3)

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\nlimonada, balanza y gráficas", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
