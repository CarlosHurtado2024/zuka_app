"""
Clase 12: Polinomio cuadrático y parábola (vertical 9:16, tema Zuka).

Sin voz ni subtítulos ni preguntas al espectador. Intuición primero (la forma de la parábola, cómo
se mueve, completar el cuadrado con fichas) y fórmula después (forma canónica, vértice, eje,
h = −b/2a). Ejemplos: x² + 4x, y = x² − 6x + 5, y = −2x² + 4x + 1 (los ejercicios de la lección
alg-4a no los repiten). Cronograma 2026-2 de Álgebra y Trigonometría, clase 10.

    manimgl cuadratico.py S03_Fichas -w -l
    python build.py
"""
from mb_common import *

TOPIC_TITLE = "Polinomio cuadrático y parábola"


def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_plane(x_range=(-4, 4, 1), y_range=(-2, 6, 1), width=6.4, height=6.4, labels=True):
    """Ejes con la misma escala en x y en y (la parábola no se deforma)."""
    axes = Axes(x_range=x_range, y_range=y_range, width=width, height=height,
                axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
    if labels:
        axes.add_coordinate_labels(font_size=20, num_decimal_places=0)
    return axes


def get_tile(w, h, color, fill, label=None, size=30):
    box = Rectangle(width=w, height=h).set_fill(fill, 1).set_stroke(color, 2.5)
    if label is None:
        return box
    return VGroup(box, M(label, size=size, color=color).move_to(box))


class S00_Portada(MBScene):
    part_tag = "Clase 12"
    part_subtitle = "Completar el cuadrado y encontrar el vértice"
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
        title = TB(TOPIC_TITLE, size=50, color=INK, alignment="CENTER")
        title.set_max_width(LINE_WIDTH)
        rule = Line(LEFT, RIGHT).set_width(1.8).set_stroke(ORANGE, 5)
        sub = T(self.part_subtitle, size=30, color=MUTED)
        sub.set_max_width(LINE_WIDTH)
        block = VGroup(tag, title, rule, sub).arrange(DOWN, buff=0.42).move_to(1.6 * DOWN)
        self.play(FadeIn(tag, shift=0.2 * UP), Write(title, run_time=1.6))
        self.play(ShowCreation(rule), FadeIn(sub, shift=0.2 * UP))
        self.wait(2.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, halo, fox, block)), run_time=0.8)


class S01_Parabola(MBScene):
    def construct(self):
        self.mark("La parábola")
        self.set_header(R"y = x^2", "La parábola", C_Z, P_Z)
        self.say("El chorro de una fuente, una pelota lanzada al aire, la antena de un satélite: "
                 "todas tienen la misma forma, la parábola. Es la gráfica de un polinomio cuadrático.", fox=True)
        axes = get_plane().move_to(1.6 * UP)
        self.play(ShowCreation(axes))
        self.hold()
        self.say("Empecemos por el más simple, y igual a x al cuadrado. Si x es 1 o menos 1, y vale "
                 "1. Si x es 2 o menos 2, y vale 4. Los puntos salen por parejas, como en un espejo.")
        pts = [(-2, 4), (-1, 1), (0, 0), (1, 1), (2, 4)]
        dots = VGroup(*(Dot(axes.c2p(x, y), radius=0.09).set_fill(C_N, 1) for x, y in pts))
        self.play(LaggedStartMap(FadeIn, dots, scale=0.5, lag_ratio=0.2), run_time=1.6)
        curve = axes.get_graph(lambda x: x * x, x_range=(-2.45, 2.45), color=C_Z, stroke_width=5)
        self.play(ShowCreation(curve), run_time=1.5)
        self.hold()
        self.say("La recta vertical que hace de espejo es el eje de simetría, y el punto donde la "
                 "curva da la vuelta es el vértice. Aquí el vértice es el origen.")
        axis = DashedLine(axes.c2p(0, -1.8), axes.c2p(0, 6), dash_length=0.15).set_stroke(ORANGE, 3)
        vdot = Dot(axes.c2p(0, 0), radius=0.13).set_fill(ORANGE, 1)
        vlab = T("vértice", size=24, color=ORANGE).move_to(axes.c2p(1.9, -1.2))
        varrow = Arrow(vlab.get_left(), vdot.get_center(), buff=0.15, stroke_color=ORANGE, stroke_width=3)
        self.play(ShowCreation(axis), FadeIn(vdot, scale=0.5), FadeIn(vlab), GrowArrow(varrow))
        self.hold()
        self.say("El número que multiplica a x al cuadrado, la a, decide la abertura. Si a es "
                 "grande, la parábola se cierra; si es pequeño, se abre; y si es negativo, se voltea hacia abajo.")
        a = ValueTracker(1)
        live = always_redraw(lambda: self._clipped(axes, a.get_value()))
        self.play(FadeOut(dots), FadeOut(curve), FadeIn(live))
        labels = [M(R"y = 2x^2", size=40, color=C_I), M(R"y = \tfrac12 x^2", size=40, color=C_I), M(R"y = -x^2", size=40, color=C_I)]
        for v, lab in zip((2, 0.5, -1), labels):
            lab.next_to(axes, DOWN, buff=0.4)
            self.play(a.animate.set_value(v), FadeIn(lab), run_time=1.6)
            self.wait(0.8)
            self.play(FadeOut(lab), run_time=0.4)
        self.say("Con a positivo abre hacia arriba y el vértice es el punto más bajo: un mínimo. Con "
                 "a negativo abre hacia abajo y el vértice es el punto más alto: un máximo.")
        cards = VGroup(
            get_card_text(["a > 0", "abre hacia arriba · mínimo"], size=24, fill=P_Q, border=C_Q, width=3.4),
            get_card_text(["a < 0", "abre hacia abajo · máximo"], size=24, fill=P_I, border=C_I, width=3.4),
        ).arrange(RIGHT, buff=0.3).next_to(axes, DOWN, buff=0.4)
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.3))
        self.hold(0.5)
        self.end_section()

    def _clipped(self, axes, a):
        # Solo el tramo que cabe en la ventana de los ejes.
        if abs(a) < 1e-3:   # al pasar por a = 0 la parábola es la recta y = 0
            r = 3.9
        else:
            lim = 6 / abs(a) if a > 0 else 2 / abs(a)
            r = min(3.9, lim ** 0.5)
        return axes.get_graph(lambda x: a * x * x, x_range=(-r, r), color=C_I, stroke_width=5)


class S02_Mover(MBScene):
    def construct(self):
        self.mark("Mover la parábola")
        self.set_header(R"(x - h)^2 + k", "Mover la parábola", C_R, P_R)
        self.say("Ahora movámosla. Si en vez de x escribimos x menos 3, todo pasa 3 lugares más "
                 "tarde: la parábola se corre 3 unidades a la derecha.", fox=True)
        axes = get_plane(x_range=(-2, 6, 1), y_range=(-5, 3, 1)).move_to(1.4 * UP)
        h, k = ValueTracker(0), ValueTracker(0)

        def graph():
            hv, kv = h.get_value(), k.get_value()
            r = (3 - kv) ** 0.5
            lo, hi = max(-2, hv - r), min(6, hv + r)
            return axes.get_graph(lambda x: (x - hv) ** 2 + kv, x_range=(lo, hi), color=C_R, stroke_width=5)

        curve = always_redraw(graph)
        vdot = always_redraw(lambda: Dot(axes.c2p(h.get_value(), k.get_value()), radius=0.13).set_fill(ORANGE, 1))
        ghost = axes.get_graph(lambda x: x * x, x_range=(-1.73, 1.73), color=MUTED, stroke_width=3)
        ghost.set_stroke(opacity=0.6)
        self.play(ShowCreation(axes), ShowCreation(ghost))
        self.add(curve, vdot)
        f1 = M(R"y = (x - 3)^2", size=42, color=C_R).next_to(axes, DOWN, buff=0.4)
        self.play(h.animate.set_value(3), FadeIn(f1), run_time=2)
        self.hold()
        self.say("Y si al final le restamos 4, toda la curva baja 4 unidades. El vértice queda en el "
                 "punto 3, menos 4.")
        f2 = M(R"y = (x - 3)^2 - 4", size=42, color=C_R).move_to(f1)
        self.play(k.animate.set_value(-4), TransformMatchingTex(f1, f2), run_time=2)
        vlab = M(R"V(3, -4)", size=32, color=ORANGE).next_to(axes.c2p(3, -4), RIGHT, buff=0.25)
        self.play(FadeIn(vlab))
        self.hold()
        self.say("Esta es la forma canónica: y igual a a por x menos h, al cuadrado, más k. Se lee "
                 "el vértice sin hacer cuentas: h dice cuánto se corre y k cuánto sube o baja. Ojo con el signo: x menos 3 es h igual a 3.")
        canon = VGroup(
            M(R"y = a(x - h)^2 + k", size=46, t2c={"h": C_N, "k": C_Q}),
            M(R"\text{vertice } (h, k) \qquad \text{eje } x = h", size=34, color=MUTED),
        ).arrange(DOWN, buff=0.25).next_to(f2, DOWN, buff=0.4)
        self.play(FadeIn(canon, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_Fichas(MBScene):
    def construct(self):
        self.mark("Completar el cuadrado")
        self.set_header(R"x^2 + 4x", "Completar el cuadrado", C_N, P_N)
        self.say("Pero casi nunca nos dan la forma canónica: nos dan algo como x al cuadrado más 4x. "
                 "¿Cómo se convierte? Con fichas. x al cuadrado es un cuadrado de lado x; 4x son cuatro tiras de x por 1.", fox=True)
        u = 0.55
        S = 4 * u
        sq = get_tile(S, S, C_R, P_R, "x^2", size=44)
        strips = VGroup(*(get_tile(u, S, C_Z, P_Z, "x", size=26) for _ in range(4))).arrange(RIGHT, buff=0.15)
        row = VGroup(sq, strips).arrange(RIGHT, buff=0.5).move_to(3.0 * UP)
        expr = M(R"x^2 + 4x", size=46).next_to(row, DOWN, buff=0.5)
        self.play(FadeIn(sq, shift=0.2 * UP), LaggedStartMap(FadeIn, strips, shift=0.2 * UP, lag_ratio=0.15), FadeIn(expr))
        self.hold()
        self.say("Partimos las tiras en dos grupos iguales: dos a la derecha del cuadrado y dos "
                 "abajo. Casi tenemos un cuadrado más grande… pero le falta la esquina.")
        origin = 2.4 * UP + 1.3 * LEFT
        self.play(FadeOut(expr), run_time=0.4)
        self.play(sq.animate.move_to(origin + np.array([S / 2, -S / 2, 0])), run_time=1)
        right = [origin + np.array([S + u / 2 + k * u, -S / 2, 0]) for k in range(2)]
        self.play(*(strips[k].animate.move_to(right[k]) for k in range(2)), run_time=1)
        down = [origin + np.array([S / 2, -S - u / 2 - k * u, 0]) for k in range(2)]
        self.play(*(Rotate(strips[2 + k], PI / 2) for k in range(2)), run_time=0.6)
        for k in range(2):   # la «x» de la tira vuelve a quedar derecha
            strips[2 + k][1].rotate(-PI / 2)
        self.play(*(strips[2 + k].animate.move_to(down[k]) for k in range(2)), run_time=1)
        hole = Square(side_length=2 * u).set_stroke(ORANGE, 3).move_to(origin + np.array([S + u, -S - u, 0]))
        hole.set_fill(opacity=0)
        dashed = DashedVMobject(hole, num_dashes=24)
        self.play(ShowCreation(dashed))
        self.hold()
        self.say("La esquina es un cuadrado de 2 por 2: faltan 4 cuadritos. Los ponemos, y para no "
                 "cambiar la expresión, los quitamos también: sumar 4 y restar 4 no cambia nada.")
        cells = VGroup(*(get_tile(u, u, C_N, P_N) for _ in range(4))).arrange_in_grid(2, 2, buff=0).move_to(hole)
        self.play(LaggedStartMap(FadeIn, cells, scale=0.6, lag_ratio=0.2))
        big = VGroup(sq, strips, cells)
        side = Brace(Line(big.get_corner(UL), big.get_corner(UR)), UP)
        sl = M(R"x + 2", size=34, color=C_Q).next_to(side, UP, buff=0.1)
        self.play(GrowFromCenter(side), FadeIn(sl))
        steps = VGroup(
            M(R"x^2 + 4x = (x^2 + 4x + 4) - 4", size=40),
            M(R"x^2 + 4x = (x + 2)^2 - 4", size=46, t2c={"(x + 2)^2 - 4": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(big, DOWN, buff=0.6)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold()
        self.say("La regla que acabamos de ver: la esquina siempre mide la mitad del coeficiente de "
                 "x, al cuadrado. Se suma y se resta ese número, y el paréntesis queda como un cuadrado perfecto.")
        rule = get_card_text(["se suma y se resta (b/2)²", "x² + bx = (x + b/2)² − (b/2)²"], size=26, fill=P_N, border=C_N, width=6.8)
        rule.next_to(steps, DOWN, buff=0.45)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Canonica(MBScene):
    def construct(self):
        self.mark("Forma canónica y vértice")
        self.set_header(R"V(h, k)", "Encontrar el vértice", C_Q, P_Q)
        self.say("Ahora un polinomio completo: y igual a x al cuadrado menos 6x más 5. La mitad de "
                 "menos 6 es menos 3, y su cuadrado es 9. Sumamos y restamos 9.", fox=True)
        steps = VGroup(
            M(R"y = x^2 - 6x + 5", size=42),
            M(R"y = (x^2 - 6x + 9) - 9 + 5", size=40),
            M(R"y = (x - 3)^2 - 4", size=46, t2c={"3": C_N, "- 4": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(4.0 * UP)
        for s in steps:
            self.play(FadeIn(s, shift=0.2 * UP))
            self.wait(0.6)
        self.hold()
        self.say("En la forma canónica se lee todo: el vértice es 3, menos 4; el eje de simetría es "
                 "x igual a 3; y como a es 1, positivo, la parábola abre hacia arriba: menos 4 es el valor mínimo.")
        axes = get_plane(x_range=(-1, 7, 1), y_range=(-5, 3, 1), width=5.6, height=5.6).next_to(steps, DOWN, buff=0.5)
        curve = axes.get_graph(lambda x: x * x - 6 * x + 5, x_range=(3 - 7 ** 0.5, 3 + 7 ** 0.5), color=C_Q, stroke_width=5)
        axis = DashedLine(axes.c2p(3, -5), axes.c2p(3, 3), dash_length=0.15).set_stroke(ORANGE, 3)
        vdot = Dot(axes.c2p(3, -4), radius=0.13).set_fill(ORANGE, 1)
        vlab = M(R"V(3, -4)", size=30, color=ORANGE).next_to(vdot, RIGHT, buff=0.2)
        self.play(ShowCreation(axes), ShowCreation(curve), run_time=1.6)
        self.play(ShowCreation(axis), FadeIn(vdot, scale=0.5), FadeIn(vlab))
        self.hold()
        self.say("Y de paso salen los cortes con el eje x: x menos 3 al cuadrado igual a 4 da x "
                 "menos 3 igual a 2 o a menos 2. Los cortes son 1 y 5, a la misma distancia del eje.")
        cuts = VGroup(*(Dot(axes.c2p(x, 0), radius=0.11).set_fill(C_N, 1) for x in (1, 5)))
        clabs = VGroup(M("1", size=28, color=C_N).next_to(cuts[0], UL, buff=0.1), M("5", size=28, color=C_N).next_to(cuts[1], UR, buff=0.1))
        self.play(LaggedStartMap(FadeIn, cuts, scale=0.5, lag_ratio=0.3), FadeIn(clabs))
        self.hold(0.5)
        self.end_section()


class S05_Atajo(MBScene):
    def construct(self):
        self.mark("Cuando a no es 1")
        self.set_header(R"h = -\tfrac{b}{2a}", "El atajo", C_I, P_I)
        self.say("¿Y si a no es 1? Por ejemplo, y igual a menos 2x al cuadrado más 4x más 1. Primero "
                 "se saca el menos 2 como factor de los términos con x, y se completa el cuadrado adentro.", fox=True)
        steps = VGroup(
            M(R"y = -2x^2 + 4x + 1", size=42),
            M(R"y = -2(x^2 - 2x) + 1", size=40),
            M(R"y = -2\left[(x - 1)^2 - 1\right] + 1", size=40),
            M(R"y = -2(x - 1)^2 + 3", size=46, t2c={"1": C_N, "+ 3": C_Q}),
        ).arrange(DOWN, buff=0.28).move_to(3.6 * UP)
        for s in steps:
            self.play(FadeIn(s, shift=0.2 * UP))
            self.wait(0.6)
        self.hold()
        self.say("El vértice es 1, 3. Como a es menos 2, negativo, la parábola abre hacia abajo: 3 es "
                 "el valor máximo.")
        axes = get_plane(x_range=(-2, 4, 1), y_range=(-3, 4, 1), width=4.8, height=5.6).next_to(steps, DOWN, buff=0.45)
        curve = axes.get_graph(lambda x: -2 * x * x + 4 * x + 1, x_range=(-0.58, 2.58), color=C_I, stroke_width=5)
        vdot = Dot(axes.c2p(1, 3), radius=0.13).set_fill(ORANGE, 1)
        vlab = M(R"V(1, 3)", size=30, color=ORANGE).next_to(vdot, RIGHT, buff=0.25)
        self.play(ShowCreation(axes), ShowCreation(curve), run_time=1.5)
        self.play(FadeIn(vdot, scale=0.5), FadeIn(vlab))
        self.hold()
        self.say("Haciendo esto en general sale un atajo: la primera coordenada del vértice es menos "
                 "b sobre 2a, y la segunda es el valor del polinomio ahí. Aquí: menos 4 sobre menos 4 da 1, y y de 1 es menos 2 más 4 más 1, tres.")
        self.clear_scene(keep=tuple(steps))
        short = VGroup(
            M(R"h = -\frac{b}{2a} = -\frac{4}{2(-2)} = 1", size=40, t2c={"1": C_N}),
            M(R"k = y(1) = -2 + 4 + 1 = 3", size=40, t2c={"3": C_Q}),
        ).arrange(DOWN, buff=0.35).next_to(steps, DOWN, buff=0.7)
        self.play(FadeIn(short[0], shift=0.2 * UP))
        self.play(FadeIn(short[1], shift=0.2 * UP))
        self.hold()
        self.say("Dos caminos, el mismo vértice. Completar el cuadrado te da la forma canónica entera; "
                 "el atajo es más rápido cuando solo necesitas el vértice, por ejemplo para una altura máxima.", wait=True)
        self.end_section()


class S06_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["La parábola", "simétrica · da la vuelta en el vértice"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["La abertura a", "a > 0 abre arriba (mínimo) · a < 0 abajo (máximo)"], size=26, fill=P_I, border=C_I, width=6.8),
            get_card_text(["Completar el cuadrado", "± (b/2)²  →  y = a(x − h)² + k"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["El atajo", "h = −b/2a · k = y(h)"], size=26, fill=P_Q, border=C_Q, width=6.8),
        ).arrange(DOWN, buff=0.35).move_to(1.5 * UP)
        badges[0][1][0].set_color(C_Z); badges[1][1][0].set_color(C_I); badges[2][1][0].set_color(C_N); badges[3][1][0].set_color(C_Q)
        self.say("Repasemos: la parábola es simétrica y da la vuelta en el vértice; la a decide si "
                 "abre hacia arriba o hacia abajo; completando el cuadrado llegamos a la forma canónica, que muestra el vértice; y el atajo da el vértice directo.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2.2)
        self.hold(0.5)
        self.say("En los ejercicios vas a completar cuadrados con fichas, mover una parábola hasta "
                 "su lugar y unir cada polinomio con su forma canónica.", wait=True)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\ncompleta el cuadrado,\nmueve la parábola y une las formas", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
