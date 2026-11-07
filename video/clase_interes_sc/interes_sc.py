"""
Clase 4: Interés simple y compuesto (vertical 9:16, tema Zuka).

Escenas de manimgl (3b1b) sobre las utilidades compartidas de mb_common.py. El video va sin
voz ni subtítulos: cada say() deja en pantalla la pausa que esa frase necesita y la guarda en el
guion. Los ejemplos resueltos aquí (500.000 al 2 %, el préstamo de 1.200.000, el millón al 10 %
anual, los 300.000 al 5 %) no se repiten en los ejercicios de la lección.

    manimgl interes_sc.py S03_Compuesto -w     # una escena
    python build.py                            # todas, y arma dist/
"""
from mb_common import *

TOPIC_TITLE = "Interés simple y compuesto"


# ---------------------------------------------------------------------------
# Piezas que se repiten
# ---------------------------------------------------------------------------
def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_coin(text="10.000", radius=0.33, color=C_N):
    coin = Circle(radius=radius).set_fill(color, 1).set_stroke(ORANGE_SOFT, 2)
    label = T(text, size=15, color=P_N)
    label.set_max_width(radius * 1.7)
    return VGroup(coin, label.move_to(coin))


def get_bar(value, color, label, unit=0.0000035, width=1.0, text=None):
    """Barra vertical con su valor arriba y su rótulo debajo (todas comparten la base)."""
    bar = Rectangle(width, max(0.05, value * unit)).set_fill(color, 0.9).set_stroke(width=0)
    bar.move_to(ORIGIN, aligned_edge=DOWN)
    top = TB(text or f"{value:,.0f}".replace(",", "."), size=22, color=INK).next_to(bar, UP, buff=0.12)
    cap = T(label, size=22, color=MUTED).next_to(bar, DOWN, buff=0.14)
    return VGroup(bar, top, cap)


def get_money(text, color=C_N, size=34):
    """Billete: tarjeta ancha con el valor."""
    label = TB(text, size=size, color=INK)
    card = get_card(label, color=color, fill=PEACH, buff=0.3, stroke_width=2.5)
    card.stretch_to_fit_width(max(2.6, card.get_width()))
    return VGroup(card, label)


# ---------------------------------------------------------------------------
# Portada
# ---------------------------------------------------------------------------
class S00_Portada(MBScene):
    part_tag = "Clase 4"
    part_subtitle = "Cómo crece el dinero: en recta o en curva"
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


# ---------------------------------------------------------------------------
# 1. Qué es el interés
# ---------------------------------------------------------------------------
class S01_QueEs(MBScene):
    def construct(self):
        self.mark("Qué es el interés")
        self.set_header(R"\$", "Qué es el interés", ORANGE, PEACH)
        self.say("Cuando prestas dinero, o lo guardas en un banco, ese dinero te paga por el tiempo "
                 "que está prestado. Ese pago se llama interés.", fox=True)
        cards = VGroup(
            get_card_text(["Capital C", "lo que prestas"], size=26, fill=P_N, border=C_N, width=3.3),
            get_card_text(["Tasa r", "% por periodo"], size=26, fill=P_Q, border=C_Q, width=3.3),
            get_card_text(["Tiempo t", "periodos"], size=26, fill=P_Z, border=C_Z, width=3.3),
        ).arrange(RIGHT, buff=0.25).move_to(4.0 * UP)
        cards.set_max_width(LINE_WIDTH)
        self.say("Tres datos mandan: el capital, que es lo que prestas; la tasa, el porcentaje que "
                 "paga cada periodo; y el tiempo, cuántos periodos dura.")
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Guardas 500.000 pesos al 2 por ciento mensual. Cada mes, el interés es el 2 por "
                 "ciento de 500.000: 10.000 pesos.")
        prob = get_card_text(["C = 500.000 · r = 2 % mensual · t = 3 meses"], size=25, width=7.2).move_to(2.3 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        calc = M(R"I_{\text{mes}} = 500\,000 \cdot 0{,}02 = 10\,000", size=44, t2c={"10\\,000": C_N}).move_to(1.0 * UP)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("En tres meses, tres monedas de 10.000: 30.000 pesos de interés. Al final tienes el "
                 "capital más el interés, 530.000 pesos: ese total se llama monto.")
        coins = VGroup(*(get_coin() for _ in range(3))).arrange(RIGHT, buff=0.3).move_to(0.6 * DOWN)
        months = VGroup(*(T(f"mes {i + 1}", size=20, color=MUTED).next_to(c, DOWN, buff=0.12) for i, c in enumerate(coins)))
        self.play(LaggedStartMap(FadeIn, coins, scale=0.6, lag_ratio=0.3), FadeIn(months))
        total = M(R"I = 3 \cdot 10\,000 = 30\,000", size=42, t2c={"30\\,000": C_N}).move_to(2.0 * DOWN)
        monto = M(R"M = C + I = 500\,000 + 30\,000 = 530\,000", size=38, t2c={"530\\,000": C_Q}).move_to(3.1 * DOWN)
        self.play(FadeIn(total, shift=0.2 * UP))
        self.play(FadeIn(monto, shift=0.2 * UP))
        self.hold()
        self.say("Interés es lo que gana el dinero; monto es capital más interés. Con esas dos "
                 "palabras entendemos todo lo que sigue.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 2. Interés simple
# ---------------------------------------------------------------------------
class S02_Simple(MBScene):
    def construct(self):
        self.mark("Interés simple")
        self.set_header(R"\$", "Interés simple", C_N, P_N)
        self.say("Interés simple: el interés se calcula siempre sobre el capital inicial. Cada "
                 "periodo paga exactamente lo mismo.", fox=True)
        formula = M(R"I = C\,r\,t \qquad M = C\,(1 + r\,t)", size=52).move_to(4.1 * UP)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()
        self.say("Un préstamo de 1.200.000 pesos al 1,5 por ciento mensual durante 8 meses. "
                 "Cada mes cuesta el 1,5 por ciento de 1.200.000: 18.000 pesos.")
        prob = get_card_text(["C = 1.200.000 · r = 1,5 % mensual · t = 8 meses"], size=24, width=7.2).move_to(2.7 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        coins = VGroup(*(get_coin("18.000") for _ in range(8))).arrange_in_grid(2, 4, buff=0.2).move_to(1.2 * UP)
        self.play(LaggedStartMap(FadeIn, coins, scale=0.6, lag_ratio=0.1), run_time=1.6)
        self.hold()
        self.say("Ocho monedas iguales: 144.000 pesos de interés. Y el monto, capital más interés, "
                 "1.344.000 pesos.")
        interest = M(R"I = 1\,200\,000 \cdot 0{,}015 \cdot 8 = 144\,000", size=40, t2c={"144\\,000": C_N}).move_to(0.5 * DOWN)
        monto = M(R"M = 1\,200\,000\,(1 + 0{,}015 \cdot 8) = 1\,344\,000", size=38, t2c={"1\\,344\\,000": C_Q}).move_to(1.6 * DOWN)
        self.play(FadeIn(interest, shift=0.2 * UP))
        self.play(FadeIn(monto, shift=0.2 * UP))
        self.hold()
        self.say("Mira las barras: el monto sube en línea recta, un escalón igual cada mes. "
                 "Eso es el interés simple: crecimiento lineal.")
        bars = VGroup(*(get_bar(1_200_000 * (1 + 0.015 * k), C_N, f"m{k}", unit=0.0000012, width=0.62,
                                text=f"{1.2 + 0.018 * k:.3f}".replace(".", ",")) for k in range(0, 9, 2)))
        bars.arrange(RIGHT, buff=0.35, aligned_edge=DOWN).move_to(3.3 * DOWN)
        self.play(LaggedStartMap(GrowFromEdge, VGroup(*(b[0] for b in bars)), edge=DOWN, lag_ratio=0.2),
                  FadeIn(VGroup(*(b[1:] for b in bars))), run_time=1.8)
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 3. Interés compuesto
# ---------------------------------------------------------------------------
class S03_Compuesto(MBScene):
    def construct(self):
        self.mark("Interés compuesto")
        self.set_header(R"\$", "Interés compuesto", C_Q, P_Q)
        self.say("Interés compuesto: el interés de cada periodo se suma al capital y, desde "
                 "entonces, también gana interés. El dinero se multiplica, no se suma.", fox=True)
        formula = M(R"M = C\,(1 + r)^{n}", size=66).move_to(4.1 * UP)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()
        self.say("Los mismos 500.000 pesos al 2 por ciento mensual, pero compuesto. El primer mes "
                 "gana 10.000 y queda en 510.000.")
        steps = [
            ("500.000", R"\times 1{,}02", "510.000"),
            ("510.000", R"\times 1{,}02", "520.200"),
            ("520.200", R"\times 1{,}02", "530.604"),
        ]
        rows = VGroup()
        for i, (a, f, b) in enumerate(steps):
            row = VGroup(get_money(a, size=28), M(f, size=36, color=C_Q), get_money(b, color=C_Q, size=28))
            row.arrange(RIGHT, buff=0.3)
            rows.add(row)
        rows.arrange(DOWN, buff=0.35).move_to(1.9 * UP)
        self.play(FadeIn(rows[0], shift=0.2 * UP))
        self.hold()
        self.say("El segundo mes, el 2 por ciento ya es de 510.000: 10.200. Queda en 520.200. "
                 "Y el tercero gana 10.404 y llega a 530.604.")
        self.play(FadeIn(rows[1], shift=0.2 * UP))
        self.play(FadeIn(rows[2], shift=0.2 * UP))
        self.hold()
        self.say("Tres multiplicaciones por 1,02: 500.000 por 1,02 al cubo. Con interés simple "
                 "eran 530.000; con compuesto, 530.604. Esos 604 pesos son el interés del interés.")
        calc = M(R"M = 500\,000\,(1{,}02)^{3} = 530\,604", size=44, t2c={"530\\,604": C_Q}).move_to(1.4 * DOWN)
        comp = VGroup(
            get_card_text(["Simple", "530.000"], size=28, fill=P_N, border=C_N, width=3.0),
            get_card_text(["Compuesto", "530.604"], size=28, fill=P_Q, border=C_Q, width=3.0),
        ).arrange(RIGHT, buff=0.5).move_to(3.0 * DOWN)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.play(LaggedStartMap(FadeIn, comp, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Parece poca diferencia. La diferencia aparece con el tiempo, y por eso vale la "
                 "pena mirar la gráfica.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 4. Recta contra curva
# ---------------------------------------------------------------------------
class S04_Comparar(MBScene):
    def construct(self):
        self.mark("Recta contra curva")
        self.set_header(R"\nearrow", "Recta contra curva", ORANGE, PEACH)
        self.say("Un millón de pesos al 10 por ciento anual durante 10 años. Con simple, cada año "
                 "suma 100.000: al final, 2 millones.", fox=True)
        prob = get_card_text(["C = 1.000.000 · r = 10 % anual · t = 10 años"], size=24, width=7.2).move_to(4.1 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        simple_m = M(R"M_{\text{simple}} = 1\,000\,000\,(1 + 0{,}1 \cdot 10) = 2\,000\,000", size=36, t2c={"2\\,000\\,000": C_N}).move_to(3.0 * UP)
        self.play(FadeIn(simple_m, shift=0.2 * UP))
        self.hold()
        self.say("Con compuesto, cada año multiplica por 1,1. Uno coma uno a la décima es 2,59: "
                 "el monto llega a 2.593.742 pesos.")
        comp_m = M(R"M_{\text{comp}} = 1\,000\,000\,(1{,}1)^{10} \approx 2\,593\,742", size=36, t2c={"2\\,593\\,742": C_Q}).move_to(2.1 * UP)
        self.play(FadeIn(comp_m, shift=0.2 * UP))
        self.hold()
        self.say("En la gráfica del interés ganado, el simple es una recta y el compuesto una "
                 "curva que se despega cada vez más rápido.")
        # El eje y de manimgl siempre incluye el 0: se grafica el interés ganado, en millones.
        axes = Axes(x_range=(0, 10, 2), y_range=(0, 1.8, 0.6), width=6.0, height=4.0,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
        axes.move_to(0.7 * DOWN)
        axes.add_coordinate_labels(font_size=22, num_decimal_places=1)
        simple = axes.get_graph(lambda t: 0.1 * t, color=C_N, stroke_width=5)
        compound = axes.get_graph(lambda t: 1.1 ** t - 1, color=C_Q, stroke_width=5)
        xl = T("años", size=22, color=MUTED).next_to(axes.x_axis, DOWN, buff=0.1).shift(2.4 * RIGHT)
        yl = T("interés ganado (millones)", size=22, color=MUTED).next_to(axes.y_axis, UP, buff=0.15).shift(1.5 * RIGHT)
        self.play(ShowCreation(axes), FadeIn(xl), FadeIn(yl))
        self.play(ShowCreation(simple), run_time=1.5)
        self.play(ShowCreation(compound), run_time=1.5)
        legend = VGroup(get_pill("simple", C_N, P_N, size=24), get_pill("compuesto", C_Q, P_Q, size=24)).arrange(RIGHT, buff=0.3)
        legend.next_to(axes, DOWN, buff=0.45)
        self.play(FadeIn(legend, shift=0.2 * UP))
        self.hold()
        self.say("A los 10 años la brecha es de casi 600.000 pesos. El tiempo es el mejor amigo "
                 "del interés compuesto, y el peor enemigo de una deuda compuesta.")
        d1 = DashedLine(axes.c2p(10, 1.0), axes.c2p(10, 1.1 ** 10 - 1)).set_stroke(C_I, 3)
        d_label = T("≈ 594.000", size=22, color=C_I).next_to(d1, LEFT, buff=0.12)
        self.play(ShowCreation(d1), FadeIn(d_label))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 5. Despejar: capital y tiempo
# ---------------------------------------------------------------------------
class S05_Despejar(MBScene):
    def construct(self):
        self.mark("Despejar")
        self.set_header(R"?", "Despejar", C_Z, P_Z)
        self.say("Las fórmulas también se leen al revés. ¿Cuánto hay que invertir al 1 por ciento "
                 "mensual simple para ganar 200.000 pesos de interés en 10 meses?", fox=True)
        prob = get_card_text(["I = 200.000 · r = 1 % mensual · t = 10 meses · ¿C?"], size=24, width=7.2).move_to(4.1 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.hold()
        self.say("De I igual C por r por t, despejamos C: el interés dividido entre r por t. "
                 "200.000 entre 0,1: dos millones de pesos.")
        steps = VGroup(
            M(R"I = C\,r\,t \;\Rightarrow\; C = \dfrac{I}{r\,t}", size=46),
            M(R"C = \dfrac{200\,000}{0{,}01 \cdot 10} = \dfrac{200\,000}{0{,}1} = 2\,000\,000", size=40, t2c={"2\\,000\\,000": C_Z}),
        ).arrange(DOWN, buff=0.45).move_to(2.2 * UP)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold()
        self.say("Y una pregunta clásica del compuesto: ¿cuánto tarda el dinero en duplicarse? "
                 "Al 10 por ciento anual, 1,1 a la séptima es 1,95 y a la octava es 2,14: entre 7 y 8 años.")
        table = VGroup(
            M(R"(1{,}1)^{7} \approx 1{,}95", size=40),
            M(R"(1{,}1)^{8} \approx 2{,}14", size=40, color=C_Q),
        ).arrange(DOWN, buff=0.3).move_to(0.4 * DOWN)
        self.play(FadeIn(table, shift=0.2 * UP))
        self.hold()
        self.say("Un atajo famoso, la regla del 72: 72 dividido entre la tasa en porcentaje da los "
                 "periodos para duplicar. 72 entre 10 son unos 7 años.")
        rule = get_card_text(["Regla del 72", "periodos para duplicar ≈ 72 ÷ tasa (%)", "72 ÷ 10 ≈ 7,2 años"], size=26, fill=P_Q, border=C_Q, width=6.6).move_to(2.6 * DOWN)
        rule[1][0].set_color(C_Q)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold()
        self.say("Capital, tasa, tiempo, interés: con tres de ellos sale el cuarto.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 6. Cierre
# ---------------------------------------------------------------------------
class S06_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["Interés y monto", "I = lo que gana el dinero · M = C + I"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["Simple", "I = C r t · M = C(1 + rt) · crece en recta"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["Compuesto", "M = C(1 + r)ⁿ · el interés gana interés"], size=26, fill=P_Q, border=C_Q, width=6.8),
        ).arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        badges[0][1][0].set_color(C_N); badges[1][1][0].set_color(C_Z); badges[2][1][0].set_color(C_Q)
        self.say("Repasemos: el interés es lo que gana el dinero y el monto es capital más interés. "
                 "El simple paga siempre lo mismo y crece en recta; el compuesto multiplica y crece en curva.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)

        self.mark("Ponte a prueba")
        self.clear_scene()
        self.set_header(R"?", "Ponte a prueba", ORANGE, PEACH)
        self.say("Una pregunta rápida. Pausa el video si necesitas más tiempo: 300.000 pesos al 5 "
                 "por ciento anual compuesto durante 2 años. ¿Cuál es el monto?", wait=True)
        question = T("300.000 al 5 % anual compuesto, 2 años.\n¿Monto final?", size=36, alignment="CENTER").move_to(2.6 * UP)
        timer = Integer(5, font_size=88).set_color(ORANGE).move_to(0.1 * DOWN)
        ring = Circle(radius=0.75).set_stroke(ORANGE, 6).move_to(timer)
        self.play(Write(question))
        self.play(FadeIn(timer), ShowCreation(ring))
        self.play(ChangeDecimalToValue(timer, 0), Uncreate(ring), run_time=5, rate_func=linear)
        answer = M(R"300\,000\,(1{,}05)^{2} = 300\,000 \cdot 1{,}1025 = 330\,750", size=40, color=C_Q)
        answer_box = get_card(answer, color=C_Q, fill=P_Q, buff=0.35, stroke_width=2.5)
        answer_group = VGroup(answer_box, answer).move_to(1.6 * DOWN)
        self.play(FadeOut(timer), FadeIn(answer_group, scale=0.9))
        self.say("Dos años son dos multiplicaciones por 1,05: 1,1025. El monto es 330.750 pesos; "
                 "con simple habrían sido 330.000.", wait=True)
        self.end_section()

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\ncobra los intereses, ajusta el capital\ny elige el mejor banco", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
