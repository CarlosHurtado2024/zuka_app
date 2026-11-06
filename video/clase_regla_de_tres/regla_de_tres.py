"""
Clase 2 · Parte 2: Regla de tres simple y compuesta  (vertical 9:16, un solo video, tema morado de Zuka)

Continúa la clase de razones y proporciones: se muestra después de los primeros siete
ejercicios de la lección 1.2. Sin marca, sin subtítulos y sin voz: cada frase del guion
deja una pausa de su mismo largo para grabar la locución encima.

Renderizar una escena:      manimgl regla_de_tres.py S02_Directa -w
Renderizar todo:            python build.py

Contenido basado en: texto guía Ude@ «Elementos de aritmética», §1.1 Regla de tres
(definición 1.4 y ejercicios 1.1, 1.2 y 1.6).
"""
from mb_common import *

TOPIC_TITLE = "Regla de tres"


# ---------------------------------------------------------------------------
# Piezas que se repiten
# ---------------------------------------------------------------------------
def get_worker(color=C_Z, height=0.6):
    head = Circle(radius=height * 0.18).set_fill(color, 1).set_stroke(width=0)
    body = RoundedRectangle(height * 0.42, height * 0.55, corner_radius=0.08).set_fill(color, 0.8).set_stroke(width=0)
    return VGroup(head, body).arrange(DOWN, buff=0.04)


def get_rule_table(rows, kind, colors=(C_N, C_Z), col_gap=2.6, row_gap=0.9, size=36):
    """Dos filas de una regla de tres: «a → b» y «c → x», con flechas paralelas (directa)
    o cruzadas (inversa, en coral)."""
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


def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)   # solo el ancho: la altura sigue a la del texto
    return VGroup(card, text)


# ---------------------------------------------------------------------------
# Portada
# ---------------------------------------------------------------------------
class S00_PortadaParte2(MBScene):
    part_tag = "Clase 2 · Parte 2"
    part_subtitle = "Regla de tres simple y compuesta"
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
# 1. ¿Qué es la regla de tres?
# ---------------------------------------------------------------------------
class S01_QueEs(MBScene):
    def construct(self):
        self.mark("El término que falta")
        self.set_header(R"x", "Regla de tres", ORANGE, PEACH)
        self.say("Ya sabes qué es una proporción. La regla de tres sirve para encontrar el término "
                 "que falta cuando conoces los otros tres.", fox=True)
        prop = M(R"\frac{a}{b} = \frac{c}{x}", size=84, t2c={"x": C_I}).move_to(3.4 * UP)
        self.play(FadeIn(prop, shift=0.2 * UP))
        self.hold()
        self.say("Durante siglos los comerciantes la usaron para calcular precios y repartir mercancías; "
                 "hoy la usas igual, en la cocina, en un viaje o en una obra.", wait=True)
        self.say("Con dos magnitudes es una regla de tres simple. Y lo primero, siempre, es decidir cómo se "
                 "relacionan esas dos magnitudes.")
        cards = VGroup(
            get_card_text(["Directa", "si una sube, la otra sube", "el cociente se conserva"], size=26, fill=P_Q, border=C_Q, width=6.6),
            get_card_text(["Inversa", "si una sube, la otra baja", "el producto se conserva"], size=26, fill=P_Z, border=C_Z, width=6.6),
        ).arrange(DOWN, buff=0.5).move_to(0.2 * DOWN)
        cards[0][1][0].set_color(C_Q); cards[1][1][0].set_color(C_Z)
        self.play(FadeIn(cards[0], shift=0.2 * UP))
        self.hold()
        self.say("Si una magnitud sube y la otra también, es directa: el cociente entre ellas se conserva. "
                 "Si una sube y la otra baja, es inversa: lo que se conserva es el producto.")
        self.play(FadeIn(cards[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 2. Regla de tres simple directa
# ---------------------------------------------------------------------------
class S02_Directa(MBScene):
    def construct(self):
        self.mark("El ciclista: directa")
        self.set_header(R"\rightarrow", "Regla de tres directa", C_Q, P_Q)
        self.say("Un ciclista recorre 150 kilómetros en 5 horas, al mismo ritmo. ¿Cuántos recorre en 7 horas?", fox=True)
        prob = get_card_text(["Un ciclista recorre 150 km en 5 h.", "¿Cuántos km recorre en 7 h?"], size=28, width=7.0).move_to(3.9 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.hold()
        self.say("Escribimos los datos en dos filas: kilómetros a la izquierda, horas a la derecha. "
                 "La incógnita x va en la segunda fila.")
        table = get_rule_table([("150 km", "5 h"), ("x km", "7 h")], "directa").move_to(1.4 * UP)
        self.play(FadeIn(table[0][0], shift=0.2 * UP))
        self.play(FadeIn(table[0][1], shift=0.2 * UP))
        self.hold()
        self.say("Más horas, más kilómetros: la relación es directa, y las flechas van paralelas.")
        self.play(GrowArrow(table[1][0]), GrowArrow(table[1][1]))
        self.hold()
        self.say("Las razones se igualan en el mismo orden: 150 sobre x igual a 5 sobre 7. "
                 "Multiplicamos en cruz: x es 150 por 7 sobre 5, es decir 210 kilómetros.")
        steps = VGroup(
            M(R"\frac{150}{x} = \frac{5}{7}", size=60, t2c={"x": C_I}),
            M(R"x = \frac{150 \cdot 7}{5} = 210 \text{ km}", size=52, t2c={"x": C_I}),
        ).arrange(DOWN, buff=0.5).move_to(1.6 * DOWN)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold()
        self.say("Comprobemos: 210 entre 7 es 30 kilómetros por hora, igual que 150 entre 5. "
                 "El cociente se conservó, como debe ser en una relación directa.")
        check = M(R"\frac{210}{7} = 30 = \frac{150}{5}", size=44, color=C_Q).next_to(steps, DOWN, buff=0.5)
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold()
        self.say("Fíjate en el orden: arriba lo conocido, abajo lo que preguntan, y la x siempre en la "
                 "misma columna que su magnitud.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 3. Regla de tres simple inversa
# ---------------------------------------------------------------------------
class S03_Inversa(MBScene):
    def construct(self):
        self.mark("Los obreros: inversa")
        self.set_header(R"\times", "Regla de tres inversa", C_Z, P_Z)
        self.say("12 obreros terminan una obra en 30 días. ¿Cuántos obreros hacen falta para terminarla en 24 días?", fox=True)
        prob = get_card_text(["12 obreros terminan una obra en 30 días.", "¿Cuántos obreros para terminarla en 24 días?"], size=26, width=7.0).move_to(3.9 * UP)
        crew = VGroup(*(get_worker(C_Z, 0.5) for _ in range(12))).arrange_in_grid(2, 6, buff=0.1).next_to(prob, DOWN, buff=0.35)
        self.play(FadeIn(prob, shift=0.2 * UP), LaggedStartMap(FadeIn, crew, shift=0.2 * UP, lag_ratio=0.05))
        self.hold()
        self.say("Menos días para la misma obra significa más obreros: si una magnitud baja, la otra sube. "
                 "Es inversa, y las flechas se cruzan.")
        table = get_rule_table([("12 obreros", "30 días"), ("y obreros", "24 días")], "inversa", col_gap=3.4, size=34).move_to(0.3 * UP)
        self.play(FadeIn(table[0], shift=0.2 * UP))
        self.play(GrowArrow(table[1][0]), GrowArrow(table[1][1]))
        self.hold()
        self.say("Por eso una de las razones se escribe al revés: 12 sobre y igual a 24 sobre 30. "
                 "Entonces y es 12 por 30 sobre 24: 15 obreros.")
        steps = VGroup(
            M(R"\frac{12}{y} = \frac{24}{30}", size=60, t2c={"y": C_I}),
            M(R"y = \frac{12 \cdot 30}{24} = 15 \text{ obreros}", size=50, t2c={"y": C_I}),
        ).arrange(DOWN, buff=0.5).move_to(2.0 * DOWN)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold()
        self.say("Comprobemos con el producto: 15 por 24 es 360, igual que 12 por 30. "
                 "Obreros por días siempre da lo mismo.")
        check = M(R"15 \cdot 24 = 360 = 12 \cdot 30", size=44, color=C_Q).next_to(steps, DOWN, buff=0.4)
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold()
        self.say("Si hubieras puesto las razones en el mismo orden te daría nueve obreros y medio: "
                 "menos obreros para terminar en menos días no tiene sentido.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 4. ¿Sube o baja?
# ---------------------------------------------------------------------------
class S04_SubeOBaja(MBScene):
    def construct(self):
        self.mark("¿Sube o baja?")
        self.set_header(R"?", "¿Directa o inversa?", C_N, P_N)
        self.say("El truco para no equivocarse: pregunta «si esta magnitud sube, ¿la otra sube o baja?»", fox=True)
        q = TB("Si una sube, ¿la otra…?", size=40, color=INK).move_to(3.9 * UP)
        self.play(Write(q))
        self.hold()
        self.say("Más kilos de manzanas, más dinero: sube con ella. Directa, flechas paralelas.")
        c1 = get_card_text(["kilos ↑   →   precio ↑", "directa · flechas paralelas"], size=28, fill=P_Q, border=C_Q, width=7.0).move_to(2.2 * UP)
        c1[1][1].set_color(C_Q)
        self.play(FadeIn(c1, shift=0.2 * UP))
        self.hold()
        self.say("Más velocidad en el mismo trayecto, menos tiempo: baja. Inversa, flechas cruzadas.")
        c2 = get_card_text(["velocidad ↑   →   tiempo ↓", "inversa · flechas cruzadas"], size=28, fill=P_Z, border=C_Z, width=7.0).move_to(0.4 * UP)
        c2[1][1].set_color(C_Z)
        self.play(FadeIn(c2, shift=0.2 * UP))
        self.hold()
        self.say("Uno más: más obreros para la misma obra, menos días. Baja: inversa. "
                 "Hazte la pregunta antes de escribir cualquier número.")
        c3 = get_card_text(["obreros ↑   →   días ↓", "inversa · flechas cruzadas"], size=28, fill=P_Z, border=C_Z, width=7.0).move_to(1.4 * DOWN)
        c3[1][1].set_color(C_Z)
        self.play(FadeIn(c3, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 5. Regla de tres compuesta
# ---------------------------------------------------------------------------
class S05_Compuesta(MBScene):
    def construct(self):
        self.mark("Tres magnitudes")
        self.set_header(R"\times\times", "Regla de tres compuesta", C_R, P_R)
        self.say("Nueve hombres hacen una obra en 28 días trabajando 6 horas diarias. "
                 "¿Cuántos días tardan 7 hombres trabajando 8 horas diarias?", fox=True)
        prob = get_card_text(["9 hombres · 28 días · 6 h/día", "¿7 hombres · x días · 8 h/día?"], size=28, width=7.0).move_to(4.0 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.hold()
        self.say("Hay tres magnitudes: es una regla de tres compuesta. Comparamos cada una con los días, por separado.")
        heads = VGroup(*(TB(h, size=26, color=ORANGE) for h in ["hombres", "h/día", "días"]))
        for k, hd in enumerate(heads):
            hd.move_to(np.array([(k - 1) * 2.4, 2.3, 0]))
        rows = VGroup(
            VGroup(*(TB(v, size=34) for v in ["9", "6", "28"])),
            VGroup(*(TB(v, size=34, color=(C_I if v == "x" else INK)) for v in ["7", "8", "x"])),
        )
        for r, row in enumerate(rows):
            for k, cell in enumerate(row):
                cell.move_to(np.array([(k - 1) * 2.4, 1.6 - r * 0.8, 0]))
        rule = Line(LEFT, RIGHT).set_width(6.8).set_stroke(BORDER, 2).move_to(1.95 * UP)
        self.play(FadeIn(heads), ShowCreation(rule), FadeIn(rows[0]), FadeIn(rows[1]))
        self.hold()

        self.mark("Cada magnitud, una razón")
        self.say("Menos hombres, más días: inversa. Su razón va al revés del cambio: 9 sobre 7.")
        a1 = Arrow(rows[0][0].get_bottom(), rows[1][0].get_top(), buff=0.1, thickness=3).set_color(C_I)
        r1 = M(R"\frac{9}{7}", size=48, color=C_I).move_to(np.array([-2.4, -0.3, 0]))
        self.play(GrowArrow(a1)); self.play(FadeIn(r1, shift=0.2 * UP))
        self.hold()
        self.say("Más horas por día, menos días: también inversa. Su razón va al revés: 6 sobre 8.")
        a2 = Arrow(rows[0][1].get_bottom(), rows[1][1].get_top(), buff=0.1, thickness=3).set_color(C_I)
        r2 = M(R"\frac{6}{8}", size=48, color=C_I).move_to(np.array([0, -0.3, 0]))
        self.play(GrowArrow(a2)); self.play(FadeIn(r2, shift=0.2 * UP))
        self.hold()

        self.mark("La cadena de razones")
        self.say("Los días conocidos se multiplican por la cadena de razones: 28 por 9 séptimos por 6 octavos.")
        chain = M(R"x = 28 \cdot \frac{9}{7} \cdot \frac{6}{8}", size=56, t2c={"x": C_I}).move_to(1.9 * DOWN)
        self.play(FadeIn(chain, shift=0.2 * UP))
        self.hold()
        self.say("28 por 9 por 6 es 1512; entre 7 por 8, 56. Da 27 días.")
        calc = M(R"= \frac{1512}{56} = 27 \text{ d\'ias}", size=52, color=C_Q).next_to(chain, DOWN, buff=0.45)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Tiene sentido: menos hombres suben los días y más horas los bajan; los dos efectos casi se "
                 "cancelan, y de 28 días pasamos a 27.", wait=True)
        self.say("Si alguna magnitud fuera directa, su razón iría en el mismo orden del cambio. "
                 "Aquí las dos eran inversas, por eso las dos fueron al revés.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 6. Cierre
# ---------------------------------------------------------------------------
class S06_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["Directa", "flechas paralelas · mismo orden"], size=26, fill=P_Q, border=C_Q, width=6.8),
            get_card_text(["Inversa", "flechas cruzadas · una razón al revés"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["Compuesta", "una razón por magnitud, en cadena"], size=26, fill=P_R, border=C_R, width=6.8),
        ).arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        badges[0][1][0].set_color(C_Q); badges[1][1][0].set_color(C_Z); badges[2][1][0].set_color(C_R)
        self.say("Repasemos: en la directa las flechas van paralelas y las razones en el mismo orden; "
                 "en la inversa se cruzan y una razón va al revés; en la compuesta, una razón por cada magnitud, en cadena.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)

        self.mark("Ponte a prueba")
        self.clear_scene()
        self.set_header(R"?", "Ponte a prueba", ORANGE, PEACH)
        self.say("Una pregunta rápida. Pausa el video si necesitas más tiempo: ocho obreros tardan 20 días; "
                 "¿cuánto tardan dos obreros?", wait=True)
        question = T("8 obreros tardan 20 días.\n¿Cuánto tardan 2 obreros?", size=40, alignment="CENTER").move_to(2.6 * UP)
        timer = Integer(5, font_size=88).set_color(ORANGE).move_to(0.1 * DOWN)
        ring = Circle(radius=0.75).set_stroke(ORANGE, 6).move_to(timer)
        self.play(Write(question))
        self.play(FadeIn(timer), ShowCreation(ring))
        self.play(ChangeDecimalToValue(timer, 0), Uncreate(ring), run_time=5, rate_func=linear)
        answer = M(R"x = \frac{20 \cdot 8}{2} = 80 \text{ d\'ias}", size=56, color=C_Q)
        answer_box = get_card(answer, color=C_Q, fill=P_Q, buff=0.35, stroke_width=2.5)
        answer_group = VGroup(answer_box, answer).move_to(1.6 * DOWN)
        self.play(FadeOut(timer), FadeIn(answer_group, scale=0.9))
        self.say("Menos obreros, más días: inversa. La razón va al revés: 20 por 8 sobre 2, 80 días.", wait=True)
        self.end_section()

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\narma la regla, la báscula y la obra", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
