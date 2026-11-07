"""
Clase 8: Potencias y exponentes (vertical 9:16, tema Zuka).

Escenas de manimgl sobre mb_common.py. Sin voz ni subtítulos. Intuición primero (doblar una hoja,
contar factores, el patrón hacia abajo) y la fórmula después; ejemplos resueltos con detalle y sin
preguntas al espectador. Contenido: Manual de la UdeA, §1.4 (definiciones 1.3 y 1.4).

    manimgl potencias.py S03_Patron -w
    python build.py
"""
from mb_common import *

TOPIC_TITLE = "Potencias y exponentes"


def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_sheet(layers, width=2.4, height=0.32, color=C_N):
    """Pila de hojas (capas) vista de lado."""
    group = VGroup()
    for k in range(layers):
        r = Rectangle(width, height).set_fill(color, 0.85).set_stroke(BG_COLOR, 2)
        r.move_to(k * height * 0.9 * UP)
        group.add(r)
    return group


def get_factor_boxes(base, n, color=C_Z, size=36):
    """n cajitas con la base, separadas por puntos de multiplicar."""
    items = []
    for k in range(n):
        box = RoundedRectangle(width=0.72, height=0.72, corner_radius=0.14).set_fill(CARD, 1).set_stroke(color, 2.5)
        lab = M(str(base), size=size, color=INK).move_to(box)
        items.append(VGroup(box, lab))
        if k < n - 1:
            items.append(M(R"\cdot", size=size, color=MUTED))
    return VGroup(*items).arrange(RIGHT, buff=0.14)


class S00_Portada(MBScene):
    part_tag = "Clase 8"
    part_subtitle = "Multiplicar muchas veces, escrito en corto"
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
        title = TB(TOPIC_TITLE, size=52, color=INK, alignment="CENTER")
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


class S01_DoblarHoja(MBScene):
    def construct(self):
        self.mark("Doblar una hoja")
        self.set_header(R"2^n", "Doblar una hoja", ORANGE, PEACH)
        self.say("Toma una hoja de papel y dóblala por la mitad. Ahora tiene 2 capas. Dóblala otra "
                 "vez: 4 capas. Otra vez: 8. Cada doblez multiplica por 2.", fox=True)
        sheets = VGroup(*(get_sheet(2 ** k) for k in range(4)))
        labels = VGroup(*(T(f"{k} {'doblez' if k == 1 else 'dobleces'}", size=22, color=MUTED) for k in range(4)))
        counts = VGroup(*(TB(str(2 ** k), size=30, color=C_N) for k in range(4)))
        for k in range(4):
            sheets[k].move_to(np.array([-2.7 + 1.8 * k, 3.4, 0]), aligned_edge=DOWN)
            counts[k].next_to(sheets[k], UP, buff=0.15)
            labels[k].next_to(sheets[k], DOWN, buff=0.15)
        for k in range(4):
            self.play(FadeIn(sheets[k], shift=0.2 * UP), FadeIn(counts[k]), FadeIn(labels[k]), run_time=0.5)
        self.hold()
        self.say("Después de 5 dobleces son 2 por 2 por 2 por 2 por 2: 32 capas. Escribir cinco "
                 "doses es largo. Por eso existe la potencia: 2 elevado a la 5.")
        chain = get_factor_boxes(2, 5, color=C_N).move_to(1.6 * UP)
        self.play(LaggedStartMap(FadeIn, chain, lag_ratio=0.1))
        pw = M(R"2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 2^{5} = 32", size=46, t2c={"2^{5}": C_N, "32": C_Q}).next_to(chain, DOWN, buff=0.5)
        self.play(FadeIn(pw, shift=0.2 * UP))
        self.hold()
        self.say("El número que se repite es la base; el pequeñito arriba, el exponente, cuenta "
                 "cuántas veces aparece la base como factor.")
        defn = VGroup(
            M(R"a^{n} = \underbrace{a \cdot a \cdots a}_{n \text{ veces}}", size=50),
            get_card_text(["a: la base, lo que se repite", "n: el exponente, cuántas veces"], size=26, fill=P_N, border=C_N, width=6.4),
        ).arrange(DOWN, buff=0.45).move_to(1.3 * DOWN)
        self.play(FadeIn(defn[0], shift=0.2 * UP))
        self.play(FadeIn(defn[1], shift=0.2 * UP))
        self.hold()
        self.say("Y crece rapidísimo: con 10 dobleces ya serían 1.024 capas, más que un libro. "
                 "Eso es lo exponencial.", wait=True)
        self.end_section()


class S02_BaseExponente(MBScene):
    def construct(self):
        self.mark("Base y exponente")
        self.set_header(R"a^n", "Base y exponente", C_Z, P_Z)
        self.say("Primer ejemplo: 3 a la cuarta. Son cuatro factores 3: 3 por 3 es 9, por 3 es 27, "
                 "por 3 es 81.", fox=True)
        ex1 = get_factor_boxes(3, 4, color=C_Z).move_to(4.0 * UP)
        r1 = M(R"3^{4} = 81", size=46, t2c={"81": C_Q}).next_to(ex1, DOWN, buff=0.35)
        self.play(LaggedStartMap(FadeIn, ex1, lag_ratio=0.1))
        self.play(FadeIn(r1, shift=0.2 * UP))
        self.hold()
        self.say("Segundo: un medio a la quinta. Cinco factores de un medio: un medio por un medio "
                 "es un cuarto, luego un octavo, un dieciseisavo, un treintaidosavo. La base chica hace que el resultado se encoja.")
        ex2 = M(R"\left(\tfrac12\right)^{5} = \tfrac12 \cdot \tfrac12 \cdot \tfrac12 \cdot \tfrac12 \cdot \tfrac12 = \tfrac{1}{32}", size=40, t2c={"\\tfrac{1}{32}": C_Q}).next_to(r1, DOWN, buff=0.55)
        self.play(FadeIn(ex2, shift=0.2 * UP))
        self.hold()
        self.say("Tercero, con signo: menos 5 al cubo. Tres factores menos 5: menos 5 por menos 5 "
                 "es 25, positivo; por menos 5 es menos 125. Exponente impar, el signo se queda.")
        ex3 = VGroup(
            M(R"(-5)^{3} = (-5)(-5)(-5)", size=40),
            M(R"= 25 \cdot (-5) = -125", size=40, t2c={"-125": C_I}),
        ).arrange(DOWN, buff=0.25).next_to(ex2, DOWN, buff=0.55)
        self.play(FadeIn(ex3[0], shift=0.2 * UP))
        self.play(FadeIn(ex3[1], shift=0.2 * UP))
        self.hold()
        self.say("Con exponente par los negativos desaparecen: menos 3 a la cuarta es 81, igual "
                 "que 3 a la cuarta. Pero cuidado con dónde está el paréntesis.")
        ex4 = VGroup(
            M(R"(-3)^{4} = (-3)(-3)(-3)(-3) = 81", size=36, t2c={"81": C_Q}),
            M(R"-3^{4} = -(3 \cdot 3 \cdot 3 \cdot 3) = -81", size=36, t2c={"-81": C_I}),
        ).arrange(DOWN, buff=0.25).next_to(ex3, DOWN, buff=0.55)
        self.play(FadeIn(ex4[0], shift=0.2 * UP))
        self.play(FadeIn(ex4[1], shift=0.2 * UP))
        self.hold()
        self.say("Sin paréntesis, el exponente solo toca al 3; el signo menos espera afuera y se "
                 "aplica al final. Esa es la diferencia entre 81 y menos 81.", wait=True)
        self.end_section()


class S03_Patron(MBScene):
    def construct(self):
        self.mark("El patrón hacia abajo")
        self.set_header(R"a^0", "El patrón hacia abajo", C_Q, P_Q)
        self.say("¿Qué es 2 elevado a la cero? ¿Y a la menos 1? No lo inventamos: lo descubrimos "
                 "siguiendo el patrón. Mira las potencias de 2 bajando.", fox=True)
        rows = VGroup(
            M(R"2^{3} = 8", size=40), M(R"2^{2} = 4", size=40), M(R"2^{1} = 2", size=40),
        ).arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to(3.6 * UP)
        arrows = VGroup(*(T("÷ 2", size=22, color=C_Q).next_to(rows[i], RIGHT, buff=0.6) for i in range(1, 3)))
        self.play(LaggedStartMap(FadeIn, rows, shift=0.2 * UP, lag_ratio=0.3))
        self.play(FadeIn(arrows))
        self.hold()
        self.say("Cada vez que el exponente baja en uno, el resultado se divide entre 2. Si el "
                 "patrón sigue, 2 a la cero tiene que ser 2 entre 2: uno.")
        r0 = M(R"2^{0} = 1", size=40, color=C_Q).next_to(rows, DOWN, buff=0.22, aligned_edge=LEFT)
        a0 = T("÷ 2", size=22, color=C_Q).next_to(r0, RIGHT, buff=0.6)
        self.play(FadeIn(r0, shift=0.2 * UP), FadeIn(a0))
        self.hold()
        self.say("Y seguimos bajando: 2 a la menos 1 es 1 entre 2, un medio; 2 a la menos 2 es un "
                 "cuarto; 2 a la menos 3 es un octavo. Los exponentes negativos son divisiones.")
        rneg = VGroup(
            M(R"2^{-1} = \tfrac12", size=40, color=C_Q), M(R"2^{-2} = \tfrac14", size=40, color=C_Q), M(R"2^{-3} = \tfrac18", size=40, color=C_Q),
        ).arrange(DOWN, buff=0.22, aligned_edge=LEFT).next_to(r0, DOWN, buff=0.22, aligned_edge=LEFT)
        self.play(LaggedStartMap(FadeIn, rneg, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("De ahí salen dos definiciones que valen para cualquier base distinta de cero: "
                 "a la cero es 1, y a la menos n es 1 sobre a a la n.")
        defs = VGroup(
            get_card_text(["a⁰ = 1", "(a ≠ 0)"], size=30, fill=P_Q, border=C_Q, width=3.2),
            get_card_text(["a⁻ⁿ = 1 / aⁿ", "el negativo manda abajo"], size=28, fill=P_Q, border=C_Q, width=3.6),
        ).arrange(RIGHT, buff=0.25).move_to(2.3 * DOWN)
        self.play(LaggedStartMap(FadeIn, defs, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Ojo con un error común: 2 a la menos 3 no es menos 8. El exponente negativo no "
                 "pone un signo menos: pone una fracción.")
        warn = M(R"2^{-3} = \tfrac{1}{8} \quad\text{y no}\quad -8", size=40, t2c={"-8": C_I}).move_to(3.8 * DOWN)
        self.play(FadeIn(warn, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Ejemplos(MBScene):
    def construct(self):
        self.mark("Ejemplo 1: 4 a la menos 3")
        self.set_header(R"\checkmark", "Ejemplos resueltos", ORANGE, PEACH)
        self.say("Ejemplo uno: 4 a la menos 3. El exponente negativo manda la potencia abajo: 1 "
                 "sobre 4 al cubo. Y 4 al cubo es 4 por 4 por 4, 64. Resultado: un sesentaicuatroavo.", fox=True)
        e1 = VGroup(
            M(R"4^{-3} = \dfrac{1}{4^{3}}", size=46),
            M(R"= \dfrac{1}{4 \cdot 4 \cdot 4} = \dfrac{1}{64}", size=46, t2c={"\\dfrac{1}{64}": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(3.3 * UP)
        self.play(FadeIn(e1[0], shift=0.2 * UP))
        self.play(FadeIn(e1[1], shift=0.2 * UP))
        self.hold()
        self.end_section()

        self.mark("Ejemplo 2: base negativa y exponente negativo")
        self.say("Ejemplo dos: menos 3 a la menos 4. Primero, el exponente negativo: 1 sobre menos "
                 "3 a la cuarta. Luego, menos 3 a la cuarta: exponente par, da 81 positivo. Resultado: un ochentaiunavo.")
        e2 = VGroup(
            M(R"(-3)^{-4} = \dfrac{1}{(-3)^{4}}", size=44),
            M(R"= \dfrac{1}{(-3)(-3)(-3)(-3)} = \dfrac{1}{81}", size=40, t2c={"\\dfrac{1}{81}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(e1, DOWN, buff=0.6)
        self.play(FadeIn(e2[0], shift=0.2 * UP))
        self.play(FadeIn(e2[1], shift=0.2 * UP))
        self.hold()
        self.end_section()

        self.mark("Ejemplo 3: una fracción a la menos 2")
        self.say("Ejemplo tres: dos tercios a la menos 2. Elevar una fracción a un exponente "
                 "negativo la voltea: tres medios al cuadrado. Y eso es 9 cuartos.")
        e3 = VGroup(
            M(R"\left(\tfrac23\right)^{-2} = \left(\tfrac32\right)^{2}", size=44),
            M(R"= \tfrac{3 \cdot 3}{2 \cdot 2} = \tfrac{9}{4}", size=44, t2c={"\\tfrac{9}{4}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(e2, DOWN, buff=0.6)
        self.play(FadeIn(e3[0], shift=0.2 * UP))
        self.play(FadeIn(e3[1], shift=0.2 * UP))
        self.hold()
        self.say("¿Por qué se voltea? Porque 1 sobre dos tercios es tres medios: dividir entre una "
                 "fracción es multiplicar por la fracción invertida.")
        why = M(R"\left(\tfrac23\right)^{-2} = \dfrac{1}{\left(\tfrac23\right)^{2}} = \dfrac{1}{\tfrac49} = \tfrac94", size=34, color=MUTED).next_to(e3, DOWN, buff=0.5)
        self.play(FadeIn(why, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()

        self.mark("Ejemplo 4: 5 a la cero y 0 a la 5")
        self.clear_scene()
        self.say("Ejemplo cuatro, dos que se confunden: 5 a la cero es 1, por el patrón que vimos. "
                 "Pero 0 a la quinta es 0 por 0 por 0 por 0 por 0: cero. Base y exponente no son intercambiables.")
        e4 = VGroup(
            M(R"5^{0} = 1", size=50, t2c={"1": C_Q}),
            M(R"0^{5} = 0 \cdot 0 \cdot 0 \cdot 0 \cdot 0 = 0", size=44, t2c={"= 0": C_I}),
        ).arrange(DOWN, buff=0.5).move_to(3.2 * UP)
        self.play(FadeIn(e4[0], shift=0.2 * UP))
        self.play(FadeIn(e4[1], shift=0.2 * UP))
        self.hold()
        self.say("Y una pareja más para fijar el signo: menos 2 a la cuarta con paréntesis es 16; "
                 "sin paréntesis es menos 16. Léelo siempre como «el opuesto de 2 a la cuarta».")
        e5 = VGroup(
            M(R"(-2)^{4} = 16", size=46, t2c={"16": C_Q}),
            M(R"-2^{4} = -(2^{4}) = -16", size=46, t2c={"-16": C_I}),
        ).arrange(DOWN, buff=0.4).next_to(e4, DOWN, buff=0.8)
        self.play(FadeIn(e5[0], shift=0.2 * UP))
        self.play(FadeIn(e5[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_Crecimiento(MBScene):
    def construct(self):
        self.mark("Crecimiento exponencial")
        self.set_header(R"\nearrow", "Crece y crece", C_N, P_N)
        self.say("Volvamos a la hoja. Si la gráfica muestra las capas según los dobleces, los "
                 "puntos no suben en línea recta: cada paso sube el doble que el anterior.", fox=True)
        axes = Axes(x_range=(0, 6, 1), y_range=(0, 64, 16), width=6.0, height=4.2,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False)).move_to(2.0 * UP)
        axes.add_coordinate_labels(font_size=22, num_decimal_places=0)
        xl = T("dobleces", size=22, color=MUTED).next_to(axes.x_axis, DOWN, buff=0.1).shift(2.4 * RIGHT)
        yl = T("capas", size=22, color=MUTED).next_to(axes.y_axis, UP, buff=0.15).shift(0.6 * RIGHT)
        curve = axes.get_graph(lambda x: 2 ** x, x_range=(0, 6), color=C_N, stroke_width=4)
        dots = VGroup(*(Dot(axes.c2p(k, 2 ** k), radius=0.08).set_fill(C_Q, 1) for k in range(0, 7)))
        self.play(ShowCreation(axes), FadeIn(xl), FadeIn(yl))
        self.play(ShowCreation(curve), LaggedStartMap(FadeIn, dots, scale=0.5, lag_ratio=0.15), run_time=2)
        self.hold()
        self.say("A la izquierda del cero, con exponentes negativos, la curva se acerca al eje pero "
                 "nunca lo toca: un medio, un cuarto, un octavo… siempre positivo.")
        tab = get_card_text(["2⁻³ = 0,125 · 2⁻² = 0,25 · 2⁻¹ = 0,5", "2⁰ = 1 · 2¹ = 2 · 2² = 4 · 2³ = 8"], size=24, fill=P_N, border=C_N, width=7.0).move_to(1.4 * DOWN)
        self.play(FadeIn(tab, shift=0.2 * UP))
        self.hold()
        self.say("Esta forma de crecer aparece en poblaciones, en intereses compuestos y en todo "
                 "lo que se multiplica por lo mismo una y otra vez.", wait=True)
        self.end_section()


class S06_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["Potencia", "aⁿ = a · a · … · a (n factores)"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["Signos", "(−a)ⁿ par → +, impar → −  ·  −aⁿ = −(aⁿ)"], size=26, fill=P_I, border=C_I, width=6.8),
            get_card_text(["Cero y negativos", "a⁰ = 1 · a⁻ⁿ = 1/aⁿ · (a/b)⁻ⁿ = (b/a)ⁿ"], size=26, fill=P_Q, border=C_Q, width=6.8),
        ).arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        badges[0][1][0].set_color(C_N); badges[1][1][0].set_color(C_I); badges[2][1][0].set_color(C_Q)
        self.say("Repasemos: una potencia es una multiplicación repetida; el paréntesis decide si "
                 "el signo entra; el exponente cero da 1 y el negativo manda la potencia al denominador.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)
        self.say("En los ejercicios vas a doblar hojas, predecir signos y bajar por la escalera de "
                 "las potencias.", wait=True)
        self.end_section()

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\nla hoja doblada, los signos\ny la escalera de potencias", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
