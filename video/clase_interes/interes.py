"""
Clase 3 · Parte 2: Aumentos, descuentos e interés (vertical 9:16, tema Zuka).

Escenas de manimgl (3b1b) sobre las utilidades compartidas de mb_common.py. El video va sin
voz ni subtítulos: cada say() deja en pantalla la pausa que esa frase necesita y la guarda en el
guion. Contenido: ejercicios propuestos 1.6, 1.10 y 1.12 del texto guía Ude@ «Elementos de
aritmética» y el interés simple y compuesto del programa (2 000 000 al 1,5 % mensual).

    manimgl interes.py S02_Sucesivos -w       # una escena
    python build.py                           # todas, y arma dist/
"""
from mb_common import *

TOPIC_TITLE = "Aumentos, descuentos e interés"


# ---------------------------------------------------------------------------
# Piezas que se repiten
# ---------------------------------------------------------------------------
def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)   # solo el ancho: la altura sigue a la del texto
    return VGroup(card, text)


def get_price_tag(price, old=None, color=ORANGE, width=3.4, size=40, old_size=26):
    """Etiqueta de precio: el precio actual grande y, si lo hay, el anterior tachado."""
    lines = VGroup()
    if old is not None:
        struck = T(old, size=old_size, color=MUTED)
        strike = Line(struck.get_left(), struck.get_right()).set_stroke(C_I, 3)
        lines.add(VGroup(struck, strike))
    lines.add(TB(price, size=size, color=INK))
    lines.arrange(DOWN, buff=0.15)
    card = get_card(lines, color=color, fill=PEACH, buff=0.35, stroke_width=2.5)
    card.stretch_to_fit_width(max(width, card.get_width()))
    hole = Circle(radius=0.09).set_fill(BG_COLOR, 1).set_stroke(color, 2).move_to(card.get_top() + 0.22 * DOWN)
    return VGroup(card, hole, lines)


def get_bar(value, color, label, unit=0.032, width=1.1):
    """Barra vertical con su valor arriba y su rótulo debajo (las tres barras comparten la base)."""
    bar = Rectangle(width, value * unit).set_fill(color, 0.9).set_stroke(width=0)
    bar.move_to(ORIGIN, aligned_edge=DOWN)
    top = TB(str(value), size=26, color=INK).next_to(bar, UP, buff=0.12)
    cap = T(label, size=22, color=MUTED).next_to(bar, DOWN, buff=0.14)
    return VGroup(bar, top, cap)


def get_coin(text="30.000", radius=0.33, color=C_N):
    coin = Circle(radius=radius).set_fill(color, 1).set_stroke(ORANGE_SOFT, 2)
    label = T(text, size=15, color=P_N)
    label.set_max_width(radius * 1.7)
    return VGroup(coin, label.move_to(coin))


# ---------------------------------------------------------------------------
# Portada
# ---------------------------------------------------------------------------
class S00_Portada(MBScene):
    part_tag = "Clase 3 · Parte 2"
    part_subtitle = "Cambios porcentuales y el dinero que crece"
    slide_title = "Portada · Parte 2"

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


# ---------------------------------------------------------------------------
# 1. El factor de un cambio porcentual
# ---------------------------------------------------------------------------
class S01_Factor(MBScene):
    def construct(self):
        self.mark("El factor")
        self.set_header(R"\times", "El factor", ORANGE, PEACH)
        self.say("Cuando un precio sube un 20 por ciento, el nuevo precio es el 120 por ciento del "
                 "anterior: se multiplica por 1,2.", fox=True)
        up = M(R"+20\% \;\Rightarrow\; \times\, 1{,}2", size=60, t2c={"1{,}2": C_Q}).move_to(4.0 * UP)
        self.play(FadeIn(up, shift=0.2 * UP))
        self.hold()
        self.say("Y cuando baja un 15 por ciento, queda el 85 por ciento: se multiplica por 0,85.")
        down = M(R"-15\% \;\Rightarrow\; \times\, 0{,}85", size=60, t2c={"0{,}85": C_I}).move_to(2.8 * UP)
        self.play(FadeIn(down, shift=0.2 * UP))
        self.hold()
        self.say("En general, aumentar es multiplicar por uno más la tasa, y descontar es multiplicar "
                 "por uno menos la tasa. Cualquier cambio porcentual es una sola multiplicación.")
        cards = VGroup(
            get_card_text(["Aumentar r %", "× (1 + r)"], size=28, fill=P_Q, border=C_Q, width=3.3),
            get_card_text(["Descontar r %", "× (1 − r)"], size=28, fill=P_I, border=C_I, width=3.3),
        ).arrange(RIGHT, buff=0.4).move_to(1.1 * UP)
        cards[0][1][1].set_color(C_Q); cards[1][1][1].set_color(C_I)
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Un pantalón de 50.000 pesos sube un 20 por ciento: 50.000 por 1,2 son 60.000 pesos.")
        tag_old = get_price_tag("$ 50.000", width=2.4).move_to(np.array([-2.3, -1.4, 0]))
        tag_new = get_price_tag("$ 60.000", old="$ 50.000", color=C_Q, width=2.4).move_to(np.array([2.3, -1.4, 0]))
        arrow = Arrow(tag_old.get_right(), tag_new.get_left(), buff=0.15, thickness=3).set_color(C_Q)
        times = M(R"\times 1{,}2", size=40, color=C_Q).next_to(arrow, UP, buff=0.1)
        self.play(FadeIn(tag_old))
        self.play(GrowArrow(arrow), FadeIn(times))
        self.play(FadeIn(tag_new, shift=0.2 * UP))
        calc = M(R"50\,000 \cdot 1{,}2 = 60\,000", size=48, t2c={"60\\,000": C_Q}).move_to(3.3 * DOWN)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Guarda esta idea: cada cambio tiene su factor. Con factores, los cambios encadenados "
                 "se vuelven fáciles.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 2. Descuentos sucesivos
# ---------------------------------------------------------------------------
class S02_Sucesivos(MBScene):
    def construct(self):
        self.mark("Dos descuentos")
        self.set_header(R"\times\times", "Descuentos sucesivos", C_I, P_I)
        self.say("Una tienda anuncia un 30 por ciento de descuento, y en caja aplican otro 20 por "
                 "ciento sobre el precio ya rebajado. ¿Es un 50 por ciento de descuento?", fox=True)
        prob = get_card_text(["Descuento del 30 % y luego del 20 %.", "¿Cuál es el descuento único?"], size=26, width=7.0).move_to(4.1 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.hold()
        self.say("Sobre 100.000 pesos: el primer descuento deja 70.000. El segundo se calcula sobre "
                 "70.000, y deja 56.000.")
        tags = VGroup(
            get_price_tag("$ 100.000", width=2.2, size=30, old_size=18),
            get_price_tag("$ 70.000", old="$ 100.000", color=C_I, width=2.2, size=30, old_size=18),
            get_price_tag("$ 56.000", old="$ 70.000", color=C_I, width=2.2, size=30, old_size=18),
        ).arrange(RIGHT, buff=0.4, aligned_edge=DOWN).move_to(2.2 * UP)
        tags.set_max_width(LINE_WIDTH)
        # Los factores van debajo del hueco entre etiquetas, como paso de una a la siguiente.
        gap = lambda i: np.array([(tags[i].get_right()[0] + tags[i + 1].get_left()[0]) / 2, tags.get_bottom()[1] - 0.35, 0])
        f1 = M(R"\times 0{,}7", size=34, color=C_I).move_to(gap(0))
        f2 = M(R"\times 0{,}8", size=34, color=C_I).move_to(gap(1))
        self.play(FadeIn(tags[0]))
        self.play(FadeIn(f1), FadeIn(tags[1], shift=0.2 * RIGHT))
        self.play(FadeIn(f2), FadeIn(tags[2], shift=0.2 * RIGHT))
        self.hold()
        self.say("El factor total es 0,7 por 0,8: 0,56. Pagas el 56 por ciento, así que el descuento "
                 "único es del 44 por ciento, no del 50.")
        calc = M(R"0{,}7 \cdot 0{,}8 = 0{,}56 \;\Rightarrow\; 44\%", size=56, t2c={"44\\%": C_Q}).move_to(0.2 * UP)
        self.play(FadeIn(calc, shift=0.2 * UP))
        nope = get_card_text(["30 % + 20 % ≠ 50 %"], size=28, fill=P_I, border=C_I, width=4.6).move_to(1.0 * DOWN)
        self.play(FadeIn(nope, shift=0.2 * UP))
        self.hold()
        self.say("Los porcentajes sucesivos no se suman: se multiplican sus factores. Y como la "
                 "multiplicación conmuta, el orden de los descuentos no importa.", wait=True)

        self.mark("Dos aumentos")
        self.say("Lo mismo con aumentos: dos incrementos del 20 y del 25 por ciento son 1,2 por 1,25, "
                 "es decir 1,5: un 50 por ciento en total, no un 45.")
        inc = M(R"1{,}2 \cdot 1{,}25 = 1{,}5 \;\Rightarrow\; +50\%", size=52, t2c={"+50\\%": C_Q}).move_to(2.5 * DOWN)
        self.play(FadeIn(inc, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 3. Volver al precio original
# ---------------------------------------------------------------------------
class S03_Volver(MBScene):
    def construct(self):
        self.mark("Volver al precio")
        self.set_header(R"\circlearrowleft", "Volver al precio", C_Z, P_Z)
        self.say("Si un precio baja un 10 por ciento, ¿cuánto hay que subirlo para volver al original? "
                 "La intuición dice 10 por ciento. Veamos.", fox=True)
        bars = VGroup(get_bar(100, MUTED, "original"), get_bar(90, C_I, "−10 %"), get_bar(99, C_N, "+10 %"))
        bars.arrange(RIGHT, buff=0.7, aligned_edge=DOWN).move_to(2.0 * UP)
        line = DashedLine(bars.get_left() + 0.5 * LEFT, bars.get_right() + 0.5 * RIGHT).set_stroke(C_Q, 2.5)
        line.move_to(bars[0][0].get_top(), coor_mask=np.array([0, 1, 0]))
        self.play(FadeIn(bars[0]), ShowCreation(line))
        self.play(FadeIn(bars[1], shift=0.2 * UP))
        self.hold()
        self.say("De 100 pasa a 90. Subir un 10 por ciento de 90 son 9: llegamos a 99, no a 100.")
        self.play(FadeIn(bars[2], shift=0.2 * UP))
        self.hold()
        self.say("Para recuperar los 10 que faltan sobre una base de 90 hace falta 10 entre 90: "
                 "un 11,1 por ciento.")
        calc = M(R"\frac{10}{90} = 11{,}1\%", size=60, t2c={"11{,}1\\%": C_Q}).move_to(1.0 * DOWN)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Bajar y subir el mismo porcentaje no se cancela, porque la base cambió. "
                 "El factor de vuelta es uno sobre 0,9, que vale 1,111.")
        back = M(R"0{,}9 \cdot \frac{1}{0{,}9} = 1", size=50, color=INK).move_to(2.6 * DOWN)
        self.play(FadeIn(back, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 4. Interés simple
# ---------------------------------------------------------------------------
class S04_Simple(MBScene):
    def construct(self):
        self.mark("Interés simple")
        self.set_header(R"\$", "Interés simple", C_N, P_N)
        self.say("Prestas 2 millones de pesos al 1,5 por ciento mensual durante 12 meses. Con interés "
                 "simple, cada mes ganas lo mismo: el 1,5 por ciento del capital inicial.", fox=True)
        prob = get_card_text(["C = 2.000.000 · r = 1,5 % mensual · t = 12 meses"], size=24, width=7.2).move_to(4.1 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.hold()
        self.say("El 1,5 por ciento de 2 millones son 30.000 pesos. Mes a mes, doce monedas iguales: "
                 "360.000 pesos de interés.")
        coins = VGroup(*(get_coin() for _ in range(12))).arrange_in_grid(2, 6, buff=0.18).move_to(2.4 * UP)
        months = T("mes 1 … mes 12", size=22, color=MUTED).next_to(coins, DOWN, buff=0.15)
        self.play(LaggedStartMap(FadeIn, coins, scale=0.6, lag_ratio=0.1), run_time=2)
        self.play(FadeIn(months))
        total = M(R"12 \cdot 30\,000 = 360\,000", size=46, t2c={"360\\,000": C_N}).next_to(months, DOWN, buff=0.35)
        self.play(FadeIn(total, shift=0.2 * UP))
        self.hold()
        self.say("La fórmula: el monto final M es el capital por uno más la tasa por el tiempo.")
        formula = M(R"M = C\,(1 + r\,t)", size=66).move_to(0.9 * DOWN)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()
        self.say("Dos millones por uno más 0,015 por 12, o sea por 1,18: 2.360.000 pesos.")
        calc = M(R"M = 2\,000\,000\,(1 + 0{,}015 \cdot 12) = 2\,360\,000", size=42, t2c={"2\\,360\\,000": C_Q}).move_to(2.5 * DOWN)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("El interés simple crece en línea recta: siempre la misma moneda, porque la base "
                 "nunca cambia.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 5. Interés compuesto
# ---------------------------------------------------------------------------
class S05_Compuesto(MBScene):
    def construct(self):
        self.mark("Interés compuesto")
        self.set_header(R"\$", "Interés compuesto", C_Q, P_Q)
        self.say("Con interés compuesto, el interés de cada mes se suma al capital y también gana "
                 "interés. Cada mes, el dinero se multiplica por 1,015.", fox=True)
        formula = M(R"M = C\,(1 + r)^{n}", size=66).move_to(4.1 * UP)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()
        self.say("Doce meses son doce multiplicaciones por 1,015: 1,015 elevado a 12 es 1,1956. "
                 "El monto llega a 2.391.236 pesos.")
        calc = M(R"M = 2\,000\,000\,(1{,}015)^{12} \approx 2\,391\,236", size=42, t2c={"2\\,391\\,236": C_Q}).move_to(2.9 * UP)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Son 31.236 pesos más que con interés simple. Parece poco, pero mira la gráfica: la "
                 "recta es el simple y la curva el compuesto, y la diferencia crece cada mes.")
        # El eje y de manimgl siempre incluye el 0, así que se grafica el interés ganado (en miles).
        axes = Axes(x_range=(0, 24, 6), y_range=(0, 900, 300), width=6.0, height=4.2,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
        axes.move_to(0.4 * DOWN)
        axes.add_coordinate_labels(font_size=22, num_decimal_places=0)
        simple = axes.get_graph(lambda t: 30 * t, color=C_N, stroke_width=5)
        compound = axes.get_graph(lambda t: 2000 * (1.015 ** t - 1), color=C_Q, stroke_width=5)
        xl = T("meses", size=22, color=MUTED).next_to(axes.x_axis, DOWN, buff=0.1).shift(2.4 * RIGHT)
        yl = T("interés ganado (miles de $)", size=22, color=MUTED).next_to(axes.y_axis, UP, buff=0.15).shift(1.6 * RIGHT)
        self.play(ShowCreation(axes), FadeIn(xl), FadeIn(yl))
        self.play(ShowCreation(simple), run_time=1.5)
        self.play(ShowCreation(compound), run_time=1.5)
        legend = VGroup(
            get_pill("simple", C_N, P_N, size=24),
            get_pill("compuesto", C_Q, P_Q, size=24),
        ).arrange(RIGHT, buff=0.3).next_to(axes, DOWN, buff=0.5)
        self.play(FadeIn(legend, shift=0.2 * UP))
        self.hold()
        self.say("A 24 meses, el compuesto ya le saca casi 140.000 pesos al simple. "
                 "El tiempo es el aliado del interés compuesto.")
        d1 = DashedLine(axes.c2p(24, 30 * 24), axes.c2p(24, 2000 * (1.015 ** 24 - 1))).set_stroke(C_I, 3)
        d_label = T("≈ 140.000", size=22, color=C_I).next_to(d1, LEFT, buff=0.12)
        self.play(ShowCreation(d1), FadeIn(d_label))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 6. Cierre
# ---------------------------------------------------------------------------
class S06_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["El factor", "aumento × (1 + r) · descuento × (1 − r)"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["Sucesivos", "se multiplican los factores, no se suman"], size=26, fill=P_I, border=C_I, width=6.8),
            get_card_text(["Interés", "simple C(1 + rt) · compuesto C(1 + r)ⁿ"], size=26, fill=P_Q, border=C_Q, width=6.8),
        ).arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        badges[0][1][0].set_color(C_N); badges[1][1][0].set_color(C_I); badges[2][1][0].set_color(C_Q)
        self.say("Repasemos: cada cambio porcentual es un factor; los cambios sucesivos multiplican sus "
                 "factores; el interés simple crece en recta y el compuesto, en curva.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)

        self.mark("Ponte a prueba")
        self.clear_scene()
        self.set_header(R"?", "Ponte a prueba", ORANGE, PEACH)
        self.say("Una pregunta rápida. Pausa el video si necesitas más tiempo: ¿cuál es el descuento "
                 "único equivalente a un 40 por ciento y luego un 25 por ciento?", wait=True)
        question = T("Descuentos del 40 % y luego del 25 %.\n¿Descuento único?", size=38, alignment="CENTER").move_to(2.6 * UP)
        timer = Integer(5, font_size=88).set_color(ORANGE).move_to(0.1 * DOWN)
        ring = Circle(radius=0.75).set_stroke(ORANGE, 6).move_to(timer)
        self.play(Write(question))
        self.play(FadeIn(timer), ShowCreation(ring))
        self.play(ChangeDecimalToValue(timer, 0), Uncreate(ring), run_time=5, rate_func=linear)
        answer = M(R"0{,}6 \cdot 0{,}75 = 0{,}45 \;\Rightarrow\; 55\%", size=52, color=C_Q)
        answer_box = get_card(answer, color=C_Q, fill=P_Q, buff=0.35, stroke_width=2.5)
        answer_group = VGroup(answer_box, answer).move_to(1.6 * DOWN)
        self.play(FadeOut(timer), FadeIn(answer_group, scale=0.9))
        self.say("Los factores son 0,6 y 0,75; su producto, 0,45. Pagas el 45 por ciento: el descuento "
                 "único es del 55 por ciento, no del 65.", wait=True)
        self.end_section()

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\nla cascada de descuentos, la máquina\ny la carrera del interés", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
