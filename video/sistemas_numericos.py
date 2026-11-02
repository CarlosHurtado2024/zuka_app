"""
Álgebra · Lección 1.1 · Sistemas numéricos y números reales  (vertical 9:16, un solo video)

Versión corta y continua de la clase de codigo_fuente_vertical/sistemas_numericos.py:
sin portada, con fondo del curso de Álgebra y subtítulos en pantalla.

Renderizar (desde esta carpeta):
    python -m manim sistemas_numericos.py SistemasNumericos                  # 1080 × 1920
    python -m manim -r 540,960 sistemas_numericos.py SistemasNumericos       # borrador rápido
"""
from zuka_common import *


# ---------------------------------------------------------------------------
# Dibujos sencillos
# ---------------------------------------------------------------------------
def get_dots_icon():
    return VGroup(*(Circle(radius=0.17).set_fill(C_N, 1).set_stroke(WHITE, 2) for _ in range(3))).arrange(RIGHT, buff=0.12)


def get_cold_icon():
    tube = RoundedRectangle(corner_radius=0.12, width=0.26, height=1.1).set_fill(WHITE, 1).set_stroke(C_Z, 3)
    bulb = Circle(radius=0.22).set_fill(C_Z, 1).set_stroke(C_Z, 3).next_to(tube, DOWN, buff=-0.1)
    zero = Line(LEFT, RIGHT).set_width(0.5).set_stroke(INK, 2).move_to(tube.get_center() + 0.1 * DOWN)
    return VGroup(tube, bulb, zero)


def get_pizza(n=4, taken=1, radius=0.5):
    slices = VGroup(*(
        Sector(radius=radius, angle=TAU / n, start_angle=PI / 2 + k * TAU / n)
        .set_fill(C_Q if k < taken else P_Q, 1).set_stroke(C_Q, 2)
        for k in range(n)
    ))
    return slices


def get_tile_icon(size=1.0):
    square = Square(side_length=size).set_fill(P_R, 1).set_stroke(C_R, 3)
    diag = Line(square.get_corner(DL), square.get_corner(UR)).set_stroke(C_I, 5)
    return VGroup(square, diag)


class SistemasNumericos(ZukaScene):
    srt_name = "alg-11"

    def construct(self):
        self.familia()
        self.naturales_y_enteros()
        self.racionales()
        self.irracionales()
        self.reales()
        self.valor_absoluto()
        self.cierre()
        self.finish()

    # -----------------------------------------------------------------------
    def familia(self):
        self.set_header(R"\mathbb{R}", "Sistemas numéricos", BRAND)
        data = [
            ("Contar", R"\mathbb{N}", C_N, P_N, get_dots_icon()),
            ("Bajar de cero", R"\mathbb{Z}", C_Z, P_Z, get_cold_icon()),
            ("Repartir", R"\mathbb{Q}", C_Q, P_Q, get_pizza()),
            ("Medir", R"\mathbb{I}", C_I, P_I, get_tile_icon(0.95)),
        ]
        cards = VGroup()
        for name, letter, color, fill, icon in data:
            icon.scale_to_fit_height(0.95)
            if icon.width > 2.4:
                icon.scale_to_fit_width(2.4)
            label = TB(name, size=24, color=INK)
            badge = MathTex(letter, font_size=70, color=color)
            content = VGroup(icon, label, badge).arrange(DOWN, buff=0.22)
            box = RoundedRectangle(corner_radius=0.3, width=3.3, height=3.0).set_fill(fill, 0.95).set_stroke(color, 2.5)
            content.move_to(box)
            cards.add(VGroup(box, content))
        cards.arrange_in_grid(2, 2, buff=(0.35, 0.4)).move_to(0.4 * UP)
        self.say("Los números no aparecieron todos de una vez: cada problema nuevo trajo una familia nueva de números.")
        self.play(LaggedStart(*(FadeIn(c, shift=0.3 * UP) for c in cards), lag_ratio=0.35), run_time=2.4)
        self.hold()
        self.say("Para contar, para bajar de cero, para repartir y para medir con precisión.")
        for card in cards:
            self.play(Indicate(card[1][2], scale_factor=1.35, color=card[0].get_stroke_color()), run_time=0.6)
        self.end_section()

    # -----------------------------------------------------------------------
    def naturales_y_enteros(self):
        self.set_header(R"\mathbb{N}", "Naturales y enteros", C_N)
        nat = M(R"\mathbb{N}", R"= \{1, 2, 3, 4, \dots\}", size=64).move_to(3.7 * UP)
        line = get_number_line((0, 6, 1), length=6.6).move_to(1.4 * UP)
        self.say("Los naturales sirven para contar: uno, dos, tres… y la lista nunca se acaba.")
        self.play(Write(nat), Create(line), run_time=1.4)
        token = get_token(C_N).move_to(line.n2p(1) + 0.35 * UP)
        self.play(FadeIn(token, scale=2), run_time=0.4)
        for n in range(2, 6):
            self.play(token.animate.move_to(line.n2p(n) + 0.35 * UP), run_time=0.35)
        self.hold()

        question = M(R"3 - 5 = \;?", size=72, color=C_I).move_to(0.6 * DOWN)
        self.say("Pero 3 − 5 no tiene respuesta en los naturales: al contar hacia atrás, el camino se acaba en 1.")
        self.play(Write(question), token.animate.move_to(line.n2p(3) + 0.35 * UP), run_time=0.8)
        for n in (2, 1):
            self.play(token.animate.move_to(line.n2p(n) + 0.35 * UP), run_time=0.35)
        self.play(token.animate.set_opacity(0.3), run_time=0.3)
        self.hold()

        self.play(FadeOut(VGroup(nat, line, token, question)), run_time=0.5)
        ent = M(R"\mathbb{Z}", R"= \{\dots, -2, -1, 0, 1, 2, \dots\}", size=56).move_to(3.7 * UP)
        zline = get_number_line((-5, 5, 1), length=7.0, font_size=26).move_to(1.4 * UP)
        dots = VGroup(*(
            Dot(zline.n2p(n), radius=0.09, color=C_N if n > 0 else (INK if n == 0 else C_Z)) for n in range(-5, 6)
        ))
        answer = M(R"3 - 5 = -2", size=72, color=C_Z).move_to(0.6 * DOWN)
        self.say("Los enteros agregan el cero y los negativos, como los sótanos de un edificio. Ahora sí: 3 − 5 = −2.")
        self.play(Write(ent), Create(zline), run_time=1.2)
        self.play(LaggedStart(*(GrowFromCenter(d) for d in dots), lag_ratio=0.06), Write(answer), run_time=1.4)
        self.end_section()

    # -----------------------------------------------------------------------
    def racionales(self):
        self.set_header(R"\mathbb{Q}", "Racionales", C_Q)
        definition = M(R"\mathbb{Q}", R"= \left\{ \frac{m}{n} \;:\; m, n \in \mathbb{Z},\; n \neq 0 \right\}", size=54)
        definition.move_to(3.9 * UP)
        pizza = get_pizza(4, 3, radius=1.05).move_to(1.6 * UP + 1.6 * LEFT)
        frac = M(R"\frac{3}{4}", size=96, color=C_Q).next_to(pizza, RIGHT, buff=1.0)
        self.say("Los racionales son los números que se pueden escribir como una fracción m/n, con n distinto de cero.")
        self.play(Write(definition), run_time=1.4)
        self.play(FadeIn(pizza, scale=0.8), Write(frac), run_time=1.0)
        self.hold()

        rows = VGroup(
            M(R"\frac{1}{2} = 0.5", size=56),
            M(R"\frac{1}{3} = 0.333\ldots = 0.\overline{3}", size=56),
        ).arrange(DOWN, buff=0.55, aligned_edge=LEFT).move_to(1.6 * DOWN)
        tags = VGroup(T("termina", size=24, color=C_Q), T("se repite", size=24, color=GOLD))
        for tag, row in zip(tags, rows):
            tag.next_to(row, DOWN, buff=0.12, aligned_edge=LEFT)
        rows.add(*tags)
        self.say("Su decimal termina, como 0.5, o se repite para siempre. La rayita encima marca lo que se repite.")
        self.play(FadeIn(rows[0], shift=0.2 * UP), FadeIn(tags[0]), run_time=0.8)
        self.play(FadeIn(rows[1], shift=0.2 * UP), FadeIn(tags[1]), run_time=0.8)
        self.end_section()

        # De decimal periódico a fracción
        steps = VGroup(
            M(R"0.\overline{36}", R"= \frac{36}{99}", R"= \frac{4}{11}", size=66),
            M(R"0.1\overline{6}", R"= \frac{16 - 1}{90}", R"= \frac{1}{6}", size=66),
        ).arrange(DOWN, buff=1.4).move_to(1.3 * UP)
        notes = VGroup(
            T("un 9 por cada cifra que se repite", size=24, color=MUTED),
            T("resta lo que no se repite; 9 por cifra\nperiódica y 0 por cifra no periódica", size=24, color=MUTED),
        )
        for note, step in zip(notes, steps):
            note.next_to(step, DOWN, buff=0.3)
        self.say("Todo decimal periódico es una fracción. Si se repite 36, ponemos 36 sobre 99 y simplificamos: 4/11.")
        self.play(Write(steps[0][0]), run_time=0.6)
        self.play(Write(steps[0][1]), FadeIn(notes[0]), run_time=0.9)
        self.play(Write(steps[0][2]), run_time=0.7)
        self.hold()
        self.say("Si hay una cifra antes del periodo, como en 0.1666…, restamos lo que no se repite y obtenemos 1/6.")
        self.play(Write(steps[1][0]), run_time=0.6)
        self.play(Write(steps[1][1]), FadeIn(notes[1]), run_time=0.9)
        self.play(Write(steps[1][2]), run_time=0.7)
        self.end_section()

    # -----------------------------------------------------------------------
    def irracionales(self):
        self.set_header(R"\mathbb{I}", "Irracionales", C_I)
        tile = Square(side_length=2.8).set_fill(P_R, 0.8).set_stroke(C_R, 4).move_to(2.5 * UP)
        sides = VGroup(
            T("1", size=30, color=MUTED).next_to(tile, DOWN, buff=0.2),
            T("1", size=30, color=MUTED).next_to(tile, LEFT, buff=0.2),
        )
        diag = Line(tile.get_corner(DL), tile.get_corner(UR)).set_stroke(C_I, 7)
        self.say("Un cuadrado de lado 1: ¿cuánto mide su diagonal?")
        self.play(FadeIn(tile), FadeIn(sides), run_time=0.8)
        self.play(Create(diag), run_time=1.2)
        self.hold()

        values = ["1.4", "1.41", "1.414", "1.4142", "1.41421", R"1.4142135\ldots"]
        reading = M(values[0], size=72, color=C_I).move_to(0.3 * DOWN)
        self.say("Mide raíz de 2. Sus cifras nunca terminan y nunca forman un patrón que se repita.")
        self.play(FadeIn(reading), run_time=0.4)
        for value in values[1:]:
            new = M(value, size=72, color=C_I).move_to(reading)
            self.play(FadeOut(reading), FadeIn(new), run_time=0.3)
            reading = new
        sqrt2 = M(R"\sqrt{2} \approx 1.41421356\ldots", size=60, color=C_I).move_to(0.3 * DOWN)
        self.play(FadeTransform(reading, sqrt2), run_time=0.6)
        self.hold()

        pi = M(R"\pi = 3.14159265\ldots", size=60, color=C_I).move_to(1.8 * DOWN)
        e = M(R"e = 2.71828182\ldots", size=60, color=C_I).move_to(3.1 * DOWN)
        self.say("Son los irracionales, como raíz de 2, pi o e: no se pueden escribir como una fracción.")
        self.play(FadeIn(pi, shift=0.2 * UP), run_time=0.6)
        self.play(FadeIn(e, shift=0.2 * UP), run_time=0.6)
        self.end_section()

    # -----------------------------------------------------------------------
    def reales(self):
        self.set_header(R"\mathbb{R}", "Números reales", C_R)
        union = M(R"\mathbb{R} = \mathbb{Q} \cup \mathbb{I}", size=76).move_to(4.0 * UP)

        r_box = RoundedRectangle(corner_radius=0.3, width=7.3, height=6.6).set_fill(P_R, 0.9).set_stroke(C_R, 3)
        r_box.move_to(0.45 * DOWN)
        q_box = RoundedRectangle(corner_radius=0.28, width=6.7, height=4.1).set_fill(P_Q, 1).set_stroke(C_Q, 3)
        q_box.move_to(r_box.get_top() + 0.6 * DOWN, aligned_edge=UP)
        z_box = RoundedRectangle(corner_radius=0.26, width=6.1, height=2.6).set_fill(P_Z, 1).set_stroke(C_Z, 3)
        z_box.move_to(q_box.get_top() + 0.6 * DOWN, aligned_edge=UP)
        n_box = RoundedRectangle(corner_radius=0.24, width=5.5, height=1.1).set_fill(P_N, 1).set_stroke(C_N, 3)
        n_box.move_to(z_box.get_top() + 0.6 * DOWN, aligned_edge=UP)
        i_box = RoundedRectangle(corner_radius=0.28, width=6.7, height=1.2).set_fill(P_I, 1).set_stroke(C_I, 3)
        i_box.move_to(r_box.get_bottom() + 0.25 * UP, aligned_edge=DOWN)
        boxes = [r_box, q_box, z_box, n_box, i_box]
        letters = VGroup(*(
            MathTex(tex, font_size=38, color=color).move_to(box.get_corner(UL) + np.array([0.38, -0.3, 0]))
            for tex, color, box in zip([R"\mathbb{R}", R"\mathbb{Q}", R"\mathbb{Z}", R"\mathbb{N}", R"\mathbb{I}"],
                                       [C_R, C_Q, C_Z, C_N, C_I], boxes)
        ))
        examples = VGroup(
            MathTex(R"1 \quad 2 \quad 7", font_size=40, color=INK).move_to(n_box.get_center() + 0.4 * RIGHT),
            MathTex(R"-3 \quad 0", font_size=40, color=INK).move_to(z_box.get_bottom() + 0.4 * UP + 0.4 * RIGHT),
            MathTex(R"\tfrac{3}{4} \quad 0.\overline{3}", font_size=40, color=INK).move_to(q_box.get_bottom() + 0.4 * UP + 0.4 * RIGHT),
            MathTex(R"\sqrt{2} \quad \pi \quad e", font_size=40, color=INK).move_to(i_box.get_center() + 0.4 * RIGHT),
        )
        self.say("Juntos, racionales e irracionales forman los números reales.")
        self.play(Write(union), run_time=1.0)
        self.hold()
        self.say("Cada familia vive dentro de la siguiente, como cajas dentro de cajas: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.")
        for box, letter in zip(boxes, letters):
            self.play(GrowFromCenter(box), FadeIn(letter), run_time=0.5)
        self.play(LaggedStart(*(FadeIn(x, scale=0.6) for x in examples), lag_ratio=0.2), run_time=1.2)
        self.end_section()

        # La recta real e intervalos
        line = get_number_line((-4, 6, 1), length=7.0, font_size=26).move_to(1.6 * UP)
        self.say("Los reales llenan la recta numérica sin dejar huecos: a cada punto le corresponde un número real.")
        self.play(Create(line), run_time=1.0)
        marks = VGroup(
            Dot(line.n2p(-2.5), radius=0.08, color=C_Q), Dot(line.n2p(np.sqrt(2)), radius=0.08, color=C_I),
            Dot(line.n2p(np.pi), radius=0.08, color=C_I),
        )
        labels = VGroup(
            MathTex(R"-\tfrac52", font_size=30, color=C_Q).next_to(marks[0], UP, buff=0.18),
            MathTex(R"\sqrt2", font_size=30, color=C_I).next_to(marks[1], UP, buff=0.18),
            MathTex(R"\pi", font_size=30, color=C_I).next_to(marks[2], UP, buff=0.18),
        )
        self.play(LaggedStart(*(GrowFromCenter(m) for m in marks), lag_ratio=0.2),
                  LaggedStart(*(FadeIn(l) for l in labels), lag_ratio=0.2), run_time=1.0)
        self.hold()

        self.play(FadeOut(VGroup(marks, labels)), run_time=0.4)
        set_tex = M(R"\{x : -2 \le x < 5\}", R"= [-2, 5)", size=60).move_to(3.7 * UP)
        segment = Line(line.n2p(-2), line.n2p(5)).set_stroke(BRAND, 9)
        closed = Dot(line.n2p(-2), radius=0.13, color=BRAND)
        opened = Circle(radius=0.13).set_fill("#0d1024", 1).set_stroke(BRAND, 4).move_to(line.n2p(5))
        legend = VGroup(
            T("[   incluye el extremo", size=30, color=INK),
            T(")   no lo incluye", size=30, color=INK),
        ).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to(0.6 * DOWN)
        self.say("Un conjunto de reales se escribe como intervalo: corchete si el extremo se incluye, paréntesis si no.")
        self.play(Write(set_tex), run_time=1.0)
        self.play(Create(segment), FadeIn(closed, scale=1.5), FadeIn(opened, scale=1.5), run_time=1.0)
        self.play(FadeIn(legend, shift=0.2 * UP), run_time=0.6)
        self.end_section()

    # -----------------------------------------------------------------------
    def valor_absoluto(self):
        self.set_header(R"|x|", "Valor absoluto", GOLD)
        line = get_number_line((-4, 4, 1), length=7.0, font_size=28).move_to(1.9 * UP)
        zero = Dot(line.n2p(0), radius=0.1, color=INK)
        left, right = Dot(line.n2p(-3), radius=0.12, color=C_Z), Dot(line.n2p(3), radius=0.12, color=C_N)
        brace_l = BraceBetweenPoints(line.n2p(-3), line.n2p(0), direction=UP, color=C_Z)
        brace_r = BraceBetweenPoints(line.n2p(0), line.n2p(3), direction=UP, color=C_N)
        lab_l = MathTex("3", font_size=36, color=C_Z).next_to(brace_l, UP, buff=0.1)
        lab_r = MathTex("3", font_size=36, color=C_N).next_to(brace_r, UP, buff=0.1)
        eq = M(R"|-3| = |3| = 3", size=72).move_to(0.2 * DOWN)
        self.say("El valor absoluto es la distancia al cero. Por eso |−3| y |3| valen lo mismo: 3. Nunca es negativo.")
        self.play(Create(line), GrowFromCenter(zero), run_time=0.9)
        self.play(GrowFromCenter(left), GrowFromCenter(right), run_time=0.5)
        self.play(GrowFromCenter(brace_l), GrowFromCenter(brace_r), FadeIn(lab_l), FadeIn(lab_r), run_time=0.8)
        self.play(Write(eq), run_time=0.9)
        self.hold()
        dist = M(R"d(a, b) = |b - a|", size=64).move_to(1.7 * DOWN)
        self.say("La distancia entre dos números a y b es el valor absoluto de su diferencia.")
        self.play(Write(dist), run_time=0.9)
        self.end_section()

        problem = M(R"|3 - \pi| + |\pi - 4|", size=70).move_to(3.6 * UP)
        signs = VGroup(
            M(R"3 - \pi < 0", R"\;\Rightarrow\;", R"|3 - \pi| = \pi - 3", size=48),
            M(R"\pi - 4 < 0", R"\;\Rightarrow\;", R"|\pi - 4| = 4 - \pi", size=48),
        ).arrange(DOWN, buff=0.45).move_to(1.6 * UP)
        result = M(R"(\pi - 3) + (4 - \pi) = 1", size=66, color=GOLD).move_to(0.3 * DOWN)
        box = SurroundingRectangle(result, color=GOLD, buff=0.22, corner_radius=0.15)
        self.say("Un ejemplo: como π es mayor que 3 y menor que 4, las dos restas son negativas.")
        self.play(Write(problem), run_time=0.9)
        self.play(FadeIn(signs[0], shift=0.2 * UP), run_time=0.7)
        self.play(FadeIn(signs[1], shift=0.2 * UP), run_time=0.7)
        self.hold()
        self.say("Al quitar las barras cambiamos el signo, y la suma da exactamente 1. ¡Sin calculadora!")
        self.play(Write(result), run_time=1.0)
        self.play(Create(box), run_time=0.5)
        self.end_section()

    # -----------------------------------------------------------------------
    def cierre(self):
        self.set_header(R"\checkmark", "Repasemos", BRAND)
        badges = VGroup(
            get_set_badge(R"\mathbb{N}", "contar", C_N, P_N, width=2.2),
            get_set_badge(R"\mathbb{Z}", "bajo cero", C_Z, P_Z, width=2.2),
            get_set_badge(R"\mathbb{Q}", "fracciones", C_Q, P_Q, width=2.2),
            get_set_badge(R"\mathbb{I}", "sin patrón", C_I, P_I, width=2.2),
            get_set_badge(R"\mathbb{R}", "toda la recta", C_R, P_R, width=2.2),
        )
        badges[:3].arrange(RIGHT, buff=0.25)
        badges[3:].arrange(RIGHT, buff=0.25)
        VGroup(badges[:3], badges[3:]).arrange(DOWN, buff=0.4).move_to(2.3 * UP)
        chain = M(R"\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}", size=72).move_to(1.4 * DOWN)
        self.say("Ya conoces a toda la familia de los números reales. ¡Ahora vamos a practicar!")
        self.play(LaggedStart(*(FadeIn(b, shift=0.3 * UP) for b in badges), lag_ratio=0.2), run_time=1.8)
        self.play(Write(chain), run_time=1.0)
