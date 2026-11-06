"""
Clase 3 · Parte 1: Porcentajes (vertical 9:16, tema Zuka).

Escenas de manimgl (3b1b) sobre las utilidades compartidas de mb_common.py. El video va sin
voz ni subtítulos: cada say() deja en pantalla la pausa que esa frase necesita y la guarda en el
guion. Contenido: texto guía Ude@ «Elementos de aritmética», §1.1 Cálculo porcentual
(ejercicios resueltos 1.7 a 1.12).

    manimgl porcentajes.py S01_QueEs -w        # una escena
    python build.py                            # todas, y arma dist/
"""
from mb_common import *

TOPIC_TITLE = "Porcentajes"


# ---------------------------------------------------------------------------
# Piezas que se repiten
# ---------------------------------------------------------------------------
def get_grid100(filled=0, side=0.4, color=C_N):
    """Cuadrícula de 10 × 10 casillas; las primeras `filled` (por filas) van pintadas."""
    cells = VGroup()
    for i in range(100):
        sq = Square(side_length=side).set_stroke(BORDER, 1.5)
        sq.set_fill(color if i < filled else CARD, 1 if i < filled else 0.6)
        sq.move_to(np.array([(i % 10 - 4.5) * side, (4.5 - i // 10) * side, 0]))
        cells.add(sq)
    return cells


def get_cross(rows, colors=(C_N, C_Z), unknown="x"):
    """La cruz del porcentaje: dos filas «100 → C» y «p → B» con flechas paralelas (directa)."""
    table = get_rule_table(rows, "directa", colors=colors, col_gap=2.6, row_gap=1.0, size=40)
    for row in table[0]:
        for cell in row:
            if cell.text == unknown:
                cell.set_color(C_I)
    return table


def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)   # solo el ancho: la altura sigue a la del texto
    return VGroup(card, text)


def get_rule_table(rows, kind, colors=(C_N, C_Z), col_gap=2.6, row_gap=0.9, size=36):
    """Dos filas de una regla de tres: «a → b» y «c → x», con flechas paralelas (directa)
    o cruzadas (inversa, en coral). Copia de ../clase_regla_de_tres/regla_de_tres.py."""
    cells = VGroup()
    for r, (left, right) in enumerate(rows):
        l = TB(left, size=size, color=colors[0]).move_to(np.array([-col_gap / 2, -r * row_gap, 0]))
        rt = TB(right, size=size, color=colors[1]).move_to(np.array([col_gap / 2, -r * row_gap, 0]))
        cells.add(VGroup(l, rt))
    arrows = VGroup()
    if kind == "directa":
        for row in cells:
            arrows.add(Arrow(row[0].get_right(), row[1].get_left(), buff=0.18, thickness=3).set_color(C_Q))
    else:
        a, b = cells[0], cells[1]
        arrows.add(Arrow(a[0].get_right() + 0.1 * DOWN, b[1].get_left() + 0.1 * UP, buff=0.18, thickness=3).set_color(C_I))
        arrows.add(Arrow(b[0].get_right() + 0.1 * UP, a[1].get_left() + 0.1 * DOWN, buff=0.18, thickness=3).set_color(C_I))
    return VGroup(cells, arrows)


def get_beaker(alcohol, water, unit=0.012, width=2.4):
    """Vaso de laboratorio con una capa de alcohol (lavanda) y otra de agua (cielo), en gramos."""
    h_a, h_w = alcohol * unit, water * unit
    glass = Rectangle(width, 3.4).set_stroke(INK, 4).set_fill(opacity=0)
    bottom = glass.get_bottom()
    layer_a = Rectangle(width - 0.08, max(h_a, 0.01)).set_fill(C_R, 0.9).set_stroke(width=0)
    layer_a.move_to(bottom + (h_a / 2) * UP)
    layer_w = Rectangle(width - 0.08, max(h_w, 0.01)).set_fill(C_Z, 0.85).set_stroke(width=0)
    layer_w.move_to(bottom + (h_a + h_w / 2) * UP)
    return VGroup(layer_a, layer_w, glass)


# ---------------------------------------------------------------------------
# Portada
# ---------------------------------------------------------------------------
class S00_Portada(MBScene):
    part_tag = "Clase 3 · Parte 1"
    part_subtitle = "Qué es un porcentaje y cómo se calcula"
    slide_title = "Portada · Parte 1"

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
        block = VGroup(tag, title, rule, sub).arrange(DOWN, buff=0.42).move_to(1.6 * DOWN)
        self.play(FadeIn(tag, shift=0.2 * UP), Write(title, run_time=1.6))
        self.play(ShowCreation(rule), FadeIn(sub, shift=0.2 * UP))
        self.wait(2.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, halo, fox, block)), run_time=0.8)


# ---------------------------------------------------------------------------
# 1. ¿Qué es un porcentaje?
# ---------------------------------------------------------------------------
class S01_QueEs(MBScene):
    def construct(self):
        self.mark("De cada cien")
        self.set_header(R"\%", "Por ciento", ORANGE, PEACH)
        self.say("Un porcentaje es una forma de comparar con cien. Treinta y cinco por ciento quiere "
                 "decir treinta y cinco de cada cien.", fox=True)
        grid = get_grid100(0).move_to(2.0 * UP)
        self.play(LaggedStartMap(FadeIn, grid, lag_ratio=0.01), run_time=1.5)
        self.hold()
        self.say("Si pintamos 35 casillas de estas cien, hemos pintado el 35 por ciento: "
                 "la fracción 35 sobre 100, o el decimal 0,35.")
        painted = get_grid100(35).move_to(grid)
        self.play(LaggedStart(*(Transform(grid[i], painted[i]) for i in range(35)), lag_ratio=0.04), run_time=2.2)
        eq = M(R"35\% = \frac{35}{100} = 0{,}35", size=60, t2c={"35": C_N}).move_to(1.0 * DOWN)
        self.play(FadeIn(eq, shift=0.2 * UP))
        self.hold()
        self.say("Por eso el 50 por ciento es la mitad, el 25 por ciento la cuarta parte y el "
                 "10 por ciento es un décimo.")
        pills = VGroup(
            get_card_text(["50 %", "= 1/2"], size=26, fill=P_Q, border=C_Q, width=2.2),
            get_card_text(["25 %", "= 1/4"], size=26, fill=P_Z, border=C_Z, width=2.2),
            get_card_text(["10 %", "= 0,1"], size=26, fill=P_R, border=C_R, width=2.2),
        ).arrange(RIGHT, buff=0.3).move_to(2.9 * DOWN)
        self.play(LaggedStartMap(FadeIn, pills, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Los porcentajes están en todas partes: descuentos, impuestos, la batería del celular, "
                 "la nota de un examen. Y todos se calculan con la misma idea.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 2. La cruz del porcentaje: hallar la parte
# ---------------------------------------------------------------------------
class S02_LaCruz(MBScene):
    def construct(self):
        self.mark("La cruz del porcentaje")
        self.set_header(R"100", "La cruz del porcentaje", C_N, P_N)
        self.say("Todo problema de porcentaje es una regla de tres directa: cien se corresponde con "
                 "el total, que llamamos C, y el porcentaje p con la parte B.", fox=True)
        cross = get_cross([("100", "C"), ("p", "B")]).move_to(3.3 * UP)
        self.play(FadeIn(cross[0][0], shift=0.2 * UP))
        self.play(FadeIn(cross[0][1], shift=0.2 * UP))
        self.play(GrowArrow(cross[1][0]), GrowArrow(cross[1][1]))
        self.hold()
        self.say("Por eso se cumple que cien sobre C es igual a p sobre B. "
                 "Esta cruz resuelve los tres tipos de problema: tapas la incógnita y multiplicas en cruz.")
        formula = M(R"\frac{100}{C} = \frac{p}{B}", size=64).move_to(1.2 * UP)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()

        self.mark("Hallar la parte")
        self.say("Primer caso: hallar el 12 por ciento de 8.000 pesos. Aquí p es 12 y C es 8.000; "
                 "buscamos la parte B.")
        prob = get_card_text(["Halla el 12 % de 8.000 pesos"], size=28, width=6.6).move_to(0.6 * DOWN)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.hold()
        self.say("B es p por C entre cien: 12 por 8.000 entre cien. Son 960 pesos.")
        calc = M(R"B = \frac{12 \cdot 8\,000}{100} = 960", size=56, t2c={"960": C_Q}).move_to(2.2 * DOWN)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Compruébalo de cabeza: el 10 por ciento de 8.000 son 800, y el 2 por ciento son 160. "
                 "Juntos, 960.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 3. Hallar el total
# ---------------------------------------------------------------------------
class S03_HallarBase(MBScene):
    def construct(self):
        self.mark("Hallar el total")
        self.set_header(R"C", "Hallar el total", C_Z, P_Z)
        self.say("Segundo caso: ¿de qué número es 48 el 8 por ciento? Ahora conocemos la parte, 48, "
                 "y el porcentaje, 8. Falta el total C.", fox=True)
        prob = get_card_text(["¿De qué número es 48 el 8 %?"], size=28, width=6.6).move_to(4.0 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        cross = get_cross([("100", "x"), ("8", "48")]).move_to(1.9 * UP)
        self.play(FadeIn(cross[0]), GrowArrow(cross[1][0]), GrowArrow(cross[1][1]))
        self.hold()
        self.say("Tapamos la incógnita y multiplicamos en cruz: C es cien por 48 entre 8, es decir 600.")
        calc = M(R"C = \frac{100 \cdot 48}{8} = 600", size=56, t2c={"600": C_Q}).move_to(0.4 * DOWN)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Tiene sentido: el 8 por ciento de 600 es 48. Siempre que puedas, devuelve el resultado "
                 "al enunciado para comprobarlo.")
        check = get_card_text(["8 % de 600 = 48  ✓"], size=28, fill=P_Q, border=C_Q, width=5.4).move_to(2.2 * DOWN)
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 4. ¿Qué porcentaje es?
# ---------------------------------------------------------------------------
class S04_QuePorcentaje(MBScene):
    def construct(self):
        self.mark("¿Qué porcentaje es?")
        self.set_header(R"p", "¿Qué porcentaje es?", C_Q, P_Q)
        self.say("Tercer caso: ¿qué porcentaje es 51 de 170? Conocemos la parte, 51, y el total, 170. "
                 "Falta p.", fox=True)
        prob = get_card_text(["¿Qué porcentaje es 51 de 170?"], size=28, width=6.6).move_to(4.0 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        cross = get_cross([("100", "170"), ("x", "51")]).move_to(1.9 * UP)
        self.play(FadeIn(cross[0]), GrowArrow(cross[1][0]), GrowArrow(cross[1][1]))
        self.hold()
        self.say("p es cien por 51 entre 170: 30 por ciento.")
        calc = M(R"p = \frac{100 \cdot 51}{170} = 30\%", size=56, t2c={"30": C_Q}).move_to(0.4 * DOWN)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Con la cruz, los tres casos se resuelven igual. Lo único que cambia es qué casilla "
                 "está vacía: la parte, el total o el porcentaje.")
        cards = VGroup(
            get_card_text(["¿cuánto es?", "falta B"], size=24, fill=P_N, border=C_N, width=2.2),
            get_card_text(["¿de qué número?", "falta C"], size=24, fill=P_Z, border=C_Z, width=2.4),
            get_card_text(["¿qué %?", "falta p"], size=24, fill=P_Q, border=C_Q, width=2.0),
        ).arrange(RIGHT, buff=0.25).move_to(2.3 * DOWN)
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.3))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 5. «Más» y «menos»
# ---------------------------------------------------------------------------
class S05_MasYMenos(MBScene):
    def construct(self):
        self.mark("El 70 % más")
        self.set_header(R"+", "Más y menos", ORANGE, PEACH)
        self.say("Cuidado con las frases. «El 70 por ciento más de un número» no es el 70 por ciento: "
                 "es el número completo más su 70 por ciento, o sea el 170 por ciento.", fox=True)
        more = M(R"100\% + 70\% = 170\%", size=60, t2c={"170": C_N}).move_to(4.0 * UP)
        self.play(FadeIn(more, shift=0.2 * UP))
        self.hold()
        self.say("¿De qué número es 408 el 70 por ciento más? Entonces p es 170 y la parte B es 408. "
                 "El total es cien por 408 entre 170: 240.")
        prob = get_card_text(["¿De qué número es 408 el 70 % más?"], size=26, width=6.8).move_to(2.6 * UP)
        calc = M(R"C = \frac{100 \cdot 408}{170} = 240", size=54, t2c={"240": C_Q}).move_to(1.1 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()

        self.mark("El 9 % menos")
        self.say("Y «el 9 por ciento menos» es el 91 por ciento: ¿de qué número es 546 el 9 por ciento "
                 "menos? Cien por 546 entre 91: 600.")
        less = M(R"100\% - 9\% = 91\%", size=60, t2c={"91": C_I}).move_to(0.5 * DOWN)
        prob2 = get_card_text(["¿De qué número es 546 el 9 % menos?"], size=26, width=6.8).move_to(1.9 * DOWN)
        calc2 = M(R"C = \frac{100 \cdot 546}{91} = 600", size=54, t2c={"600": C_Q}).move_to(3.3 * DOWN)
        self.play(FadeIn(less, shift=0.2 * UP))
        self.play(FadeIn(prob2, shift=0.2 * UP))
        self.play(FadeIn(calc2, shift=0.2 * UP))
        self.hold()
        self.say("Compruébalo: el 9 por ciento de 600 es 54, y 600 menos 54 es 546. "
                 "Primero traduce la frase a un porcentaje; después, la cruz.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 6. Mezclas
# ---------------------------------------------------------------------------
class S06_Mezcla(MBScene):
    def construct(self):
        self.mark("El químico")
        self.set_header(R"\%", "Mezclas", C_R, P_R)
        self.say("Un químico mezcla 40 gramos de alcohol con agua, de modo que el alcohol es el "
                 "20 por ciento de la mezcla. ¿Cuánta agua usó?", fox=True)
        prob = get_card_text(["40 g de alcohol son el 20 % de la mezcla.", "¿Cuánta agua hay?"], size=26, width=7.0).move_to(4.0 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        beaker = get_beaker(40, 0).move_to(np.array([-2.0, 1.2, 0]))
        label_a = T("alcohol 40 g", size=24, color=C_R).next_to(beaker, DOWN, buff=0.2)
        self.play(FadeIn(beaker), FadeIn(label_a))
        self.hold()
        self.say("La parte es el alcohol, 40 gramos; el porcentaje, 20. El total de la mezcla es "
                 "cien por 40 entre 20: 200 gramos.")
        cross = get_cross([("100", "x"), ("20", "40")], colors=(C_N, C_R)).scale(0.8).move_to(np.array([1.6, 1.9, 0]))
        self.play(FadeIn(cross[0]), GrowArrow(cross[1][0]), GrowArrow(cross[1][1]))
        calc = M(R"C = \frac{100 \cdot 40}{20} = 200 \text{ g}", size=46, t2c={"200": C_Q}).move_to(np.array([1.6, 0.3, 0]))
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Como la mezcla solo tiene alcohol y agua, el agua es 200 menos 40: 160 gramos.")
        full = get_beaker(40, 160).move_to(beaker)
        label_w = T("agua 160 g", size=24, color=C_Z).next_to(label_a, DOWN, buff=0.1)
        water = M(R"200 - 40 = 160 \text{ g de agua}", size=46, t2c={"160": C_Q}).move_to(2.4 * DOWN)
        self.play(Transform(beaker, full), FadeIn(label_w), run_time=1.5)
        self.play(FadeIn(water, shift=0.2 * UP))
        self.hold()
        self.say("Fíjate: el total no es el agua sola, es todo lo que hay en el vaso. "
                 "Elegir bien el total es la clave de los problemas de mezclas.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 7. Cierre
# ---------------------------------------------------------------------------
class S07_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["¿Cuánto es el p % de C?", "B = p · C / 100"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["¿De qué número es B el p %?", "C = 100 · B / p"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["¿Qué porcentaje es B de C?", "p = 100 · B / C"], size=26, fill=P_Q, border=C_Q, width=6.8),
        ).arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        badges[0][1][0].set_color(C_N); badges[1][1][0].set_color(C_Z); badges[2][1][0].set_color(C_Q)
        self.say("Repasemos: cien va con el total y el porcentaje con la parte. Si falta la parte, p por C "
                 "entre cien; si falta el total, cien por B entre p; si falta el porcentaje, cien por B entre C.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)
        self.say("Y recuerda traducir las frases: «el 70 por ciento más» es el 170 por ciento; "
                 "«el 9 por ciento menos», el 91.", wait=True)

        self.mark("Ponte a prueba")
        self.clear_scene()
        self.set_header(R"?", "Ponte a prueba", ORANGE, PEACH)
        self.say("Una pregunta rápida. Pausa el video si necesitas más tiempo: ¿qué porcentaje es 63 de 180?", wait=True)
        question = T("¿Qué porcentaje es 63 de 180?", size=40, alignment="CENTER").move_to(2.6 * UP)
        timer = Integer(5, font_size=88).set_color(ORANGE).move_to(0.1 * DOWN)
        ring = Circle(radius=0.75).set_stroke(ORANGE, 6).move_to(timer)
        self.play(Write(question))
        self.play(FadeIn(timer), ShowCreation(ring))
        self.play(ChangeDecimalToValue(timer, 0), Uncreate(ring), run_time=5, rate_func=linear)
        answer = M(R"p = \frac{100 \cdot 63}{180} = 35\%", size=56, color=C_Q)
        answer_box = get_card(answer, color=C_Q, fill=P_Q, buff=0.35, stroke_width=2.5)
        answer_group = VGroup(answer_box, answer).move_to(1.6 * DOWN)
        self.play(FadeOut(timer), FadeIn(answer_group, scale=0.9))
        self.say("Falta el porcentaje: cien por 63 entre 180. Es el 35 por ciento.", wait=True)
        self.end_section()

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\npinta la cuadrícula, arma la cruz\ny mezcla en el laboratorio", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
