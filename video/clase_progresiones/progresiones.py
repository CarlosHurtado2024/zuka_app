"""
Clase 5: Progresiones aritméticas (Parte 1) y geométricas (Parte 2), vertical 9:16, tema Zuka.

Escenas de manimgl (3b1b) sobre las utilidades compartidas de mb_common.py. El video va sin
voz ni subtítulos: cada say() deja en pantalla la pausa que esa frase necesita y la guarda en el
guion. Los ejemplos resueltos aquí (4, 9, 14…; 2 + 5 + … + 59; el teatro de 15 filas; 2, 6, 18…;
3 + 6 + … + 384; 8 + 4 + 2 + …; el rumor) no se repiten en los ejercicios de la lección.

    manimgl progresiones.py S03_Gauss -w       # una escena
    python build.py                            # todas, y arma dist/ (parte1 y parte2)
"""
from mb_common import *

TOPIC_TITLE = "Progresiones"


# ---------------------------------------------------------------------------
# Piezas que se repiten
# ---------------------------------------------------------------------------
def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_term_box(text, color=C_N, size=30, width=1.0):
    label = TB(text, size=size, color=INK)
    label.set_max_width(width - 0.25)
    box = RoundedRectangle(width=width, height=0.8, corner_radius=0.16).set_fill(CARD, 1).set_stroke(color, 2.5)
    return VGroup(box, label.move_to(box))


def get_terms_row(values, color=C_N, jump=None, jump_color=None, width=1.0, buff=0.32):
    """Fila de términos en cajas; si se da `jump`, sobre cada hueco va una flecha curva con el salto."""
    boxes = VGroup(*(get_term_box(v, color=color, width=width) for v in values)).arrange(RIGHT, buff=buff)
    group = VGroup(boxes)
    if jump is not None:
        arcs = VGroup()
        for a, b in zip(boxes[:-1], boxes[1:]):
            arc = ArcBetweenPoints(a.get_top() + 0.05 * UP, b.get_top() + 0.05 * UP, angle=-PI / 2).set_stroke(jump_color or color, 3)
            lab = T(jump, size=20, color=jump_color or color).next_to(arc, UP, buff=0.05)
            arcs.add(VGroup(arc, lab))
        group.add(arcs)
    return group


def get_seats(rows, first, d, color=C_Z, dot=0.09, buff=0.07, width=6.6):
    """Filas de un teatro: la fila k tiene first + k·d sillas (puntos), centradas."""
    group = VGroup()
    for k in range(rows):
        n = first + k * d
        row = VGroup(*(Dot(radius=dot).set_fill(color, 1) for _ in range(n))).arrange(RIGHT, buff=buff)
        row.set_max_width(width)
        group.add(row)
    group.arrange(DOWN, buff=0.12)
    return group


# ===========================================================================
# PARTE 1 · ARITMÉTICAS
# ===========================================================================
class S00_Portada(MBScene):
    part_tag = "Clase 5 · Parte 1"
    part_subtitle = "Progresiones aritméticas: sumar siempre lo mismo"
    slide_title = "Portada · Parte 1"
    title_text = "Progresiones aritméticas"

    def construct(self):
        self.remove(self.watermark)
        self.mark(self.slide_title)
        blob = Circle(radius=2.75).set_fill(PEACH, 1).set_stroke(width=0).move_to(3.1 * UP)
        halo = Circle(radius=2.25).set_fill("#3B336F", 1).set_stroke(width=0).move_to(blob)
        fox = ImageMobject("zuka_mascota.png", height=3.6).move_to(blob)
        self.play(GrowFromCenter(blob), GrowFromCenter(halo), run_time=1.0)
        self.play(FadeIn(fox, scale=0.85), run_time=1.0)
        tag = get_pill(self.part_tag, ORANGE, PEACH, size=28)
        title = TB(self.title_text, size=52, color=INK, alignment="CENTER")
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


class S01_Sucesion(MBScene):
    def construct(self):
        self.mark("Sucesiones")
        self.set_header(R"a_n", "Sucesiones", ORANGE, PEACH)
        self.say("Una sucesión es una lista ordenada de números. Cada uno tiene su puesto: el "
                 "primero, el segundo, el tercero… y a ese puesto lo llamamos n.", fox=True)
        row = get_terms_row(["2", "5", "8", "11", "14"], color=ORANGE, width=1.05, buff=0.25).move_to(4.0 * UP)
        idx = VGroup(*(T(f"n = {i + 1}", size=20, color=MUTED).next_to(b, DOWN, buff=0.12) for i, b in enumerate(row[0])))
        self.play(LaggedStartMap(FadeIn, row[0], shift=0.2 * UP, lag_ratio=0.15), FadeIn(idx))
        self.hold()
        self.say("Cuando hay un patrón, se puede escribir el término general: una fórmula que da "
                 "el término del puesto n. Aquí cada término sube de 3 en 3.")
        rule = M(R"a_n = 3n - 1", size=60, color=C_N).move_to(2.2 * UP)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold()
        self.say("Compruébalo: con n igual a 1 da 2; con n igual a 4 da 11. Y sin escribir la lista, "
                 "el término 50 es 3 por 50 menos 1: 149.")
        checks = VGroup(
            M(R"a_1 = 3(1) - 1 = 2", size=40),
            M(R"a_4 = 3(4) - 1 = 11", size=40),
            M(R"a_{50} = 3(50) - 1 = 149", size=40, t2c={"149": C_Q}),
        ).arrange(DOWN, buff=0.35).move_to(0.2 * UP)
        self.play(LaggedStartMap(FadeIn, checks, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("En esta clase vemos dos familias de sucesiones: las que suman siempre lo mismo, "
                 "las aritméticas, y las que multiplican siempre por lo mismo, las geométricas.")
        fam = VGroup(
            get_card_text(["Aritmética", "+ d · + d · + d"], size=28, fill=P_N, border=C_N, width=3.3),
            get_card_text(["Geométrica", "× r · × r · × r"], size=28, fill=P_Q, border=C_Q, width=3.3),
        ).arrange(RIGHT, buff=0.4).move_to(2.6 * DOWN)
        fam[0][1][0].set_color(C_N); fam[1][1][0].set_color(C_Q)
        self.play(LaggedStartMap(FadeIn, fam, shift=0.2 * UP, lag_ratio=0.3))
        self.hold(0.5)
        self.end_section()


class S02_Aritmetica(MBScene):
    def construct(self):
        self.mark("Progresión aritmética")
        self.set_header(R"+d", "Aritmética", C_N, P_N)
        self.say("En una progresión aritmética, cada término es el anterior más una cantidad fija: "
                 "la diferencia d. Mira 4, 9, 14, 19: la diferencia es 5.", fox=True)
        row = get_terms_row(["4", "9", "14", "19", "24"], color=C_N, jump="+5", width=1.05, buff=0.25).move_to(3.9 * UP)
        self.play(LaggedStartMap(FadeIn, row[0], shift=0.2 * UP, lag_ratio=0.15))
        self.play(LaggedStartMap(FadeIn, row[1], lag_ratio=0.2))
        self.hold()
        self.say("Para llegar al término n partimos del primero y damos n menos 1 saltos de d. "
                 "Esa es la fórmula del término general.")
        formula = M(R"a_n = a_1 + (n - 1)\,d", size=60).move_to(2.0 * UP)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()
        self.say("¿Cuánto vale el término 15? Desde el 4 damos 14 saltos de 5: 4 más 70, 74.")
        calc = VGroup(
            M(R"a_{15} = 4 + (15 - 1) \cdot 5", size=44),
            M(R"a_{15} = 4 + 70 = 74", size=44, t2c={"74": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(0.3 * UP)
        self.play(FadeIn(calc[0], shift=0.2 * UP))
        self.play(FadeIn(calc[1], shift=0.2 * UP))
        self.hold()
        self.say("Si la diferencia es negativa, la progresión baja: 50, 47, 44… tiene d igual a "
                 "menos 3. Y su gráfica, en los dos casos, son puntos sobre una recta.")
        down = get_terms_row(["50", "47", "44", "41"], color=C_I, jump="−3", width=1.05, buff=0.25).move_to(1.6 * DOWN)
        self.play(LaggedStartMap(FadeIn, down[0], shift=0.2 * UP, lag_ratio=0.15), FadeIn(down[1]))
        axes = Axes(x_range=(0, 6, 1), y_range=(0, 30, 10), width=4.2, height=1.9,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False)).move_to(3.5 * DOWN)
        dots = VGroup(*(Dot(axes.c2p(n, 4 + (n - 1) * 5), radius=0.08).set_fill(C_N, 1) for n in range(1, 6)))
        line = Line(axes.c2p(0.6, 4 + (0.6 - 1) * 5), axes.c2p(5.4, 4 + (5.4 - 1) * 5)).set_stroke(C_N, 2, opacity=0.5)
        self.play(ShowCreation(axes), FadeIn(line), LaggedStartMap(FadeIn, dots, scale=0.5, lag_ratio=0.15))
        self.hold(0.5)
        self.end_section()


class S03_Gauss(MBScene):
    def construct(self):
        self.mark("La suma de Gauss")
        self.set_header(R"\Sigma", "La suma de Gauss", C_Z, P_Z)
        self.say("Cuenta la leyenda que a Gauss, de niño, le pidieron sumar del 1 al 100. "
                 "Él vio el truco: el primero con el último suman 101, el segundo con el penúltimo también.", fox=True)
        nums = get_terms_row(["1", "2", "3", "…", "98", "99", "100"], color=C_Z, width=0.95, buff=0.12).move_to(4.0 * UP)
        self.play(LaggedStartMap(FadeIn, nums[0], shift=0.2 * UP, lag_ratio=0.1))
        boxes = nums[0]
        pairs = [(0, 6), (1, 5), (2, 4)]
        arcs = VGroup()
        for k, (i, j) in enumerate(pairs):
            arc = ArcBetweenPoints(boxes[i].get_bottom() + 0.05 * DOWN, boxes[j].get_bottom() + 0.05 * DOWN, angle=PI / 2 + 0.3 * k).set_stroke(C_Q, 3)
            lab = T("101", size=20, color=C_Q).next_to(arc, DOWN, buff=0.04)
            arcs.add(VGroup(arc, lab))
        self.play(LaggedStartMap(ShowCreation, arcs, lag_ratio=0.4), run_time=1.6)
        self.hold()
        self.say("Cincuenta parejas de 101: 5.050. La misma idea sirve para cualquier progresión "
                 "aritmética: la suma es el número de términos por la suma de los extremos, entre dos.")
        gauss = M(R"50 \cdot 101 = 5\,050", size=46, t2c={"5\\,050": C_Q}).move_to(1.9 * UP)
        formula = M(R"S_n = \dfrac{n\,(a_1 + a_n)}{2}", size=60).move_to(0.5 * UP)
        self.play(FadeIn(gauss, shift=0.2 * UP))
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()
        self.say("Sumemos 2 más 5 más 8 y así hasta 59. Primero, ¿cuántos términos hay? "
                 "59 es 2 más n menos 1 por 3: n menos 1 es 19, así que n es 20.")
        prob = get_card_text(["2 + 5 + 8 + … + 59 = ?"], size=28, width=6.0).move_to(1.1 * DOWN)
        count = M(R"59 = 2 + (n - 1)\,3 \;\Rightarrow\; n - 1 = 19 \;\Rightarrow\; n = 20", size=34, t2c={"n = 20": C_N}).move_to(2.2 * DOWN)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.play(FadeIn(count, shift=0.2 * UP))
        self.hold()
        self.say("Veinte términos, extremos 2 y 59: 20 por 61 entre 2, 610.")
        total = M(R"S_{20} = \dfrac{20\,(2 + 59)}{2} = 10 \cdot 61 = 610", size=42, t2c={"610": C_Q}).move_to(3.4 * DOWN)
        self.play(FadeIn(total, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Medios(MBScene):
    def construct(self):
        self.mark("Medios aritméticos")
        self.set_header(R"\cdots", "Medios aritméticos", C_R, P_R)
        self.say("Interpolar medios aritméticos es rellenar los huecos entre dos números para que "
                 "todo quede en progresión. Pongamos 4 medios entre 3 y 18.", fox=True)
        row = get_terms_row(["3", "?", "?", "?", "?", "18"], color=C_R, width=0.95, buff=0.18).move_to(4.0 * UP)
        self.play(LaggedStartMap(FadeIn, row[0], shift=0.2 * UP, lag_ratio=0.12))
        self.hold()
        self.say("Con los 4 medios hay 6 términos: 18 es el sexto. Entonces 18 es 3 más 5 veces d, "
                 "y d vale 3.")
        calc = VGroup(
            M(R"a_6 = a_1 + 5d \;\Rightarrow\; 18 = 3 + 5d", size=44),
            M(R"5d = 15 \;\Rightarrow\; d = 3", size=44, t2c={"d = 3": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(2.0 * UP)
        self.play(FadeIn(calc[0], shift=0.2 * UP))
        self.play(FadeIn(calc[1], shift=0.2 * UP))
        self.hold()
        self.say("Los medios son 6, 9, 12 y 15. Cada hueco se llena sumando 3.")
        full = get_terms_row(["3", "6", "9", "12", "15", "18"], color=C_Q, jump="+3", width=0.95, buff=0.18).move_to(0.1 * DOWN)
        self.play(FadeIn(full[0]), FadeIn(full[1]))
        self.hold()
        self.say("La clave está en contar bien: k medios entre dos números dan k más 2 términos, "
                 "y el último es el primero más k más 1 saltos.")
        key = get_card_text(["k medios entre a y b", "b = a + (k + 1)·d"], size=28, fill=P_R, border=C_R, width=6.0).move_to(2.3 * DOWN)
        key[1][1].set_color(C_R)
        self.play(FadeIn(key, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_Teatro(MBScene):
    def construct(self):
        self.mark("El teatro")
        self.set_header(R"\Sigma", "El teatro", C_N, P_N)
        self.say("Un teatro tiene 12 sillas en la primera fila y cada fila tiene 3 sillas más que "
                 "la anterior. Si hay 15 filas, ¿cuántas sillas hay en total?", fox=True)
        seats = get_seats(8, 12, 3, color=C_N, dot=0.065, buff=0.055).move_to(3.6 * UP)
        self.play(LaggedStartMap(FadeIn, seats, shift=0.1 * UP, lag_ratio=0.1), run_time=1.6)
        dots = T("⋮", size=36, color=MUTED).next_to(seats, DOWN, buff=0.1)
        self.play(FadeIn(dots))
        self.hold()
        self.say("Las sillas por fila forman una progresión aritmética: 12, 15, 18… con d igual a 3. "
                 "La fila 15 tiene 12 más 14 por 3: 54 sillas.")
        last = M(R"a_{15} = 12 + 14 \cdot 3 = 54", size=44, t2c={"54": C_Q}).move_to(0.9 * UP)
        self.play(FadeIn(last, shift=0.2 * UP))
        self.hold()
        self.say("Y el total es la suma de Gauss: 15 filas por 12 más 54, entre 2. "
                 "15 por 33: 495 sillas.")
        total = M(R"S_{15} = \dfrac{15\,(12 + 54)}{2} = 15 \cdot 33 = 495", size=42, t2c={"495": C_Q}).move_to(0.4 * DOWN)
        self.play(FadeIn(total, shift=0.2 * UP))
        self.hold()
        self.say("Siempre que algo crezca de a pasos iguales, filas, escalones, ahorros mensuales, "
                 "las dos fórmulas de hoy resuelven el problema: el término n y la suma.")
        pair = VGroup(
            get_card_text(["Término", "aₙ = a₁ + (n − 1)d"], size=26, fill=P_N, border=C_N, width=3.3),
            get_card_text(["Suma", "Sₙ = n(a₁ + aₙ)/2"], size=26, fill=P_Z, border=C_Z, width=3.3),
        ).arrange(RIGHT, buff=0.4).move_to(2.4 * DOWN)
        pair[0][1][0].set_color(C_N); pair[1][1][0].set_color(C_Z)
        self.play(LaggedStartMap(FadeIn, pair, shift=0.2 * UP, lag_ratio=0.3))
        self.hold(0.5)
        self.end_section()


class S06_Cierre(MBScene):
    question_text = "a₁ = 5 y d = 4.\n¿Cuánto vale a₃₀?"
    answer_tex = R"a_{30} = 5 + 29 \cdot 4 = 121"
    answer_say = ("Desde el 5 damos 29 saltos de 4: 5 más 116, 121.")
    question_say = ("Una pregunta rápida. Pausa el video si necesitas más tiempo: en una progresión "
                    "aritmética el primer término es 5 y la diferencia es 4. ¿Cuánto vale el término 30?")
    next_text = "Ahora, los ejercicios:\nla escalera, las parejas de Gauss\ny el teatro"
    badges_spec = [
        (["Aritmética", "sumar siempre d · aₙ = a₁ + (n − 1)d"], P_N, C_N),
        (["Suma de Gauss", "Sₙ = n(a₁ + aₙ)/2"], P_Z, C_Z),
        (["Medios", "k medios ⇒ k + 2 términos"], P_R, C_R),
    ]
    review_say = ("Repasemos: en una aritmética se suma siempre d; el término n se alcanza con n menos 1 "
                  "saltos; la suma es la de Gauss; y para interpolar medios se cuentan bien los términos.")

    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(*(get_card_text(lines, size=26, fill=fill, border=border, width=6.8) for lines, fill, border in self.badges_spec))
        badges.arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        for (_, _, border), b in zip(self.badges_spec, badges):
            b[1][0].set_color(border)
        self.say(self.review_say)
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)

        self.mark("Ponte a prueba")
        self.clear_scene()
        self.set_header(R"?", "Ponte a prueba", ORANGE, PEACH)
        self.say(self.question_say, wait=True)
        question = T(self.question_text, size=38, alignment="CENTER").move_to(2.6 * UP)
        timer = Integer(5, font_size=88).set_color(ORANGE).move_to(0.1 * DOWN)
        ring = Circle(radius=0.75).set_stroke(ORANGE, 6).move_to(timer)
        self.play(Write(question))
        self.play(FadeIn(timer), ShowCreation(ring))
        self.play(ChangeDecimalToValue(timer, 0), Uncreate(ring), run_time=5, rate_func=linear)
        answer = M(self.answer_tex, size=46, color=C_Q)
        answer_box = get_card(answer, color=C_Q, fill=P_Q, buff=0.35, stroke_width=2.5)
        answer_group = VGroup(answer_box, answer).move_to(1.6 * DOWN)
        self.play(FadeOut(timer), FadeIn(answer_group, scale=0.9))
        self.say(self.answer_say, wait=True)
        self.end_section()

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T(self.next_text, size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)


# ===========================================================================
# PARTE 2 · GEOMÉTRICAS
# ===========================================================================
class S10_Portada(S00_Portada):
    part_tag = "Clase 5 · Parte 2"
    part_subtitle = "Progresiones geométricas: multiplicar siempre por lo mismo"
    slide_title = "Portada · Parte 2"
    title_text = "Progresiones geométricas"


class S11_Geometrica(MBScene):
    def construct(self):
        self.mark("Progresión geométrica")
        self.set_header(R"\times r", "Geométrica", C_Q, P_Q)
        self.say("En una progresión geométrica cada término es el anterior multiplicado por un "
                 "número fijo: la razón r. Mira 2, 6, 18, 54: la razón es 3.", fox=True)
        row = get_terms_row(["2", "6", "18", "54", "162"], color=C_Q, jump="×3", width=1.05, buff=0.25).move_to(3.9 * UP)
        self.play(LaggedStartMap(FadeIn, row[0], shift=0.2 * UP, lag_ratio=0.15))
        self.play(LaggedStartMap(FadeIn, row[1], lag_ratio=0.2))
        self.hold()
        self.say("Para llegar al término n, partimos del primero y multiplicamos por r, n menos 1 "
                 "veces: una potencia.")
        formula = M(R"a_n = a_1 \cdot r^{\,n - 1}", size=60).move_to(2.0 * UP)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()
        self.say("¿El término 8? Dos por 3 a la séptima. 3 a la séptima es 2.187, así que "
                 "el término 8 es 4.374.")
        calc = VGroup(
            M(R"a_8 = 2 \cdot 3^{7} = 2 \cdot 2\,187", size=44),
            M(R"a_8 = 4\,374", size=44, t2c={"4\\,374": C_N}),
        ).arrange(DOWN, buff=0.3).move_to(0.3 * UP)
        self.play(FadeIn(calc[0], shift=0.2 * UP))
        self.play(FadeIn(calc[1], shift=0.2 * UP))
        self.hold()
        self.say("Si la razón está entre 0 y 1, la progresión baja: 80, 40, 20, 10 tiene razón un "
                 "medio. Y si es negativa, los signos se alternan: 1, menos 2, 4, menos 8.")
        down = get_terms_row(["80", "40", "20", "10"], color=C_I, jump="×½", width=1.05, buff=0.25).move_to(1.5 * DOWN)
        alt = get_terms_row(["1", "−2", "4", "−8"], color=C_R, jump="×(−2)", width=1.05, buff=0.25).move_to(3.4 * DOWN)
        self.play(FadeIn(down[0]), FadeIn(down[1]))
        self.play(FadeIn(alt[0]), FadeIn(alt[1]))
        self.hold(0.5)
        self.end_section()


class S12_Suma(MBScene):
    def construct(self):
        self.mark("Suma de una geométrica")
        self.set_header(R"\Sigma", "La suma", C_Z, P_Z)
        self.say("Para sumar los n primeros términos de una geométrica hay una fórmula: el primer "
                 "término por r a la n menos 1, dividido entre r menos 1.", fox=True)
        formula = M(R"S_n = a_1\,\dfrac{r^{\,n} - 1}{r - 1}", size=60).move_to(4.0 * UP)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold()
        self.say("Sumemos 3 más 6 más 12 y así hasta 384. ¿Cuántos términos hay? 384 es 3 por 2 a "
                 "la n menos 1, así que 2 a la n menos 1 es 128: n menos 1 es 7 y n es 8.")
        prob = get_card_text(["3 + 6 + 12 + … + 384 = ?"], size=28, width=6.0).move_to(2.4 * UP)
        count = VGroup(
            M(R"384 = 3 \cdot 2^{\,n - 1} \;\Rightarrow\; 2^{\,n - 1} = 128 = 2^{7}", size=36),
            M(R"n - 1 = 7 \;\Rightarrow\; n = 8", size=40, t2c={"n = 8": C_N}),
        ).arrange(DOWN, buff=0.3).move_to(0.9 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.play(FadeIn(count[0], shift=0.2 * UP))
        self.play(FadeIn(count[1], shift=0.2 * UP))
        self.hold()
        self.say("Ocho términos con razón 2: 3 por 2 a la octava menos 1, entre 1. "
                 "2 a la octava es 256, menos 1 son 255, por 3: 765.")
        total = M(R"S_8 = 3\,\dfrac{2^{8} - 1}{2 - 1} = 3 \cdot 255 = 765", size=42, t2c={"765": C_Q}).move_to(1.1 * DOWN)
        self.play(FadeIn(total, shift=0.2 * UP))
        self.hold()
        self.say("Comprueba con los pequeños: 3 más 6 más 12 más 24 son 45, y la fórmula con "
                 "n igual a 4 da 3 por 15: 45. Funciona.")
        check = M(R"3 + 6 + 12 + 24 = 45 = 3\,(2^{4} - 1)", size=36, color=MUTED).move_to(2.6 * DOWN)
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S13_Infinita(MBScene):
    def construct(self):
        self.mark("La suma infinita")
        self.set_header(R"\infty", "La suma infinita", C_R, P_R)
        self.say("¿Se puede sumar una lista que no termina? Si la razón está entre menos 1 y 1, "
                 "los términos se hacen tan pequeños que la suma se acerca a un número fijo.", fox=True)
        series = M(R"8 + 4 + 2 + 1 + \tfrac12 + \tfrac14 + \cdots", size=46).move_to(4.0 * UP)
        self.play(FadeIn(series, shift=0.2 * UP))
        self.hold()
        self.say("Mira un rectángulo de área 16. El 8 ocupa la mitad; el 4, la mitad de lo que "
                 "queda; el 2, la mitad del resto… Nunca se sale del rectángulo: la suma es 16.")
        W, Hh = 6.4, 3.2
        frame = Rectangle(W, Hh).set_stroke(C_R, 3).set_fill(PEACH, 0.5).move_to(1.4 * UP)
        self.play(ShowCreation(frame))
        pieces = VGroup()
        x0, y0, w, h = frame.get_left()[0], frame.get_bottom()[1], W, Hh
        labels = ["8", "4", "2", "1", "½", "¼"]
        vertical = True
        for k, lab in enumerate(labels):
            if vertical:
                piece = Rectangle(w / 2, h).set_fill(C_R, 0.35 + 0.1 * k).set_stroke(C_R, 1.5)
                piece.move_to(np.array([x0 + w / 4, y0 + h / 2, 0]))
                x0 += w / 2; w /= 2
            else:
                piece = Rectangle(w, h / 2).set_fill(C_R, 0.35 + 0.1 * k).set_stroke(C_R, 1.5)
                piece.move_to(np.array([x0 + w / 2, y0 + h / 4, 0]))
                y0 += h / 2; h /= 2
            vertical = not vertical
            text = TB(lab, size=max(14, 30 - 4 * k), color=INK).move_to(piece)
            pieces.add(VGroup(piece, text))
        self.play(LaggedStartMap(FadeIn, pieces, lag_ratio=0.35), run_time=3)
        self.hold()
        self.say("La fórmula: el primer término dividido entre uno menos la razón. 8 entre uno menos "
                 "un medio es 8 entre un medio: 16.")
        formula = M(R"S_\infty = \dfrac{a_1}{1 - r} \quad (|r| < 1)", size=54).move_to(1.1 * DOWN)
        calc = M(R"S_\infty = \dfrac{8}{1 - \tfrac12} = \dfrac{8}{\tfrac12} = 16", size=46, t2c={"16": C_Q}).move_to(2.6 * DOWN)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Si la razón es 1 o más, o menos 1 o menos, la suma no se estabiliza: "
                 "decimos que diverge.", wait=True)
        self.end_section()


class S14_Medios(MBScene):
    def construct(self):
        self.mark("Medios geométricos")
        self.set_header(R"\cdots", "Medios geométricos", C_N, P_N)
        self.say("También se interpolan medios geométricos. Pongamos 2 medios entre 5 y 135.", fox=True)
        row = get_terms_row(["5", "?", "?", "135"], color=C_N, width=1.1, buff=0.3).move_to(4.0 * UP)
        self.play(LaggedStartMap(FadeIn, row[0], shift=0.2 * UP, lag_ratio=0.15))
        self.hold()
        self.say("Con 2 medios hay 4 términos: 135 es 5 por r al cubo. Entonces r al cubo es 27 "
                 "y r vale 3.")
        calc = VGroup(
            M(R"a_4 = a_1 \cdot r^{3} \;\Rightarrow\; 135 = 5\,r^{3}", size=44),
            M(R"r^{3} = 27 \;\Rightarrow\; r = 3", size=44, t2c={"r = 3": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(2.0 * UP)
        self.play(FadeIn(calc[0], shift=0.2 * UP))
        self.play(FadeIn(calc[1], shift=0.2 * UP))
        self.hold()
        self.say("Los medios son 15 y 45: cada hueco se llena multiplicando por 3.")
        full = get_terms_row(["5", "15", "45", "135"], color=C_Q, jump="×3", width=1.1, buff=0.3).move_to(0.0 * UP)
        self.play(FadeIn(full[0]), FadeIn(full[1]))
        self.hold()
        self.say("Compara con los aritméticos: allí el último era el primero más k más 1 saltos; "
                 "aquí es el primero por r elevado a k más 1.")
        key = VGroup(
            get_card_text(["Aritméticos", "b = a + (k + 1)·d"], size=26, fill=P_R, border=C_R, width=3.3),
            get_card_text(["Geométricos", "b = a · r^(k + 1)"], size=26, fill=P_N, border=C_N, width=3.3),
        ).arrange(RIGHT, buff=0.4).move_to(2.3 * DOWN)
        key[0][1][0].set_color(C_R); key[1][1][0].set_color(C_N)
        self.play(LaggedStartMap(FadeIn, key, shift=0.2 * UP, lag_ratio=0.3))
        self.hold(0.5)
        self.end_section()


class S15_Rumor(MBScene):
    def construct(self):
        self.mark("El rumor")
        self.set_header(R"\times 3", "El rumor", C_I, P_I)
        self.say("Dos personas conocen un rumor. Cada hora, cada una se lo cuenta a dos más, así "
                 "que la cantidad de personas se triplica. ¿Cuántas lo saben a las 6 horas?", fox=True)
        prob = get_card_text(["2 personas · se triplica cada hora · ¿a las 6 horas?"], size=24, width=7.2).move_to(4.1 * UP)
        self.play(FadeIn(prob, shift=0.2 * UP))
        self.hold()
        self.say("Hora cero: 2. Hora uno: 6. Hora dos: 18. Es una progresión geométrica con razón 3, "
                 "y a las 6 horas hemos multiplicado seis veces.")
        row = get_terms_row(["2", "6", "18", "54"], color=C_I, jump="×3", width=1.05, buff=0.25).move_to(2.4 * UP)
        hours = VGroup(*(T(f"h = {i}", size=20, color=MUTED).next_to(b, DOWN, buff=0.12) for i, b in enumerate(row[0])))
        self.play(LaggedStartMap(FadeIn, row[0], shift=0.2 * UP, lag_ratio=0.15), FadeIn(row[1]), FadeIn(hours))
        self.hold()
        self.say("Dos por 3 a la sexta: 3 a la sexta es 729, por 2, 1.458 personas.")
        calc = M(R"2 \cdot 3^{6} = 2 \cdot 729 = 1\,458", size=46, t2c={"1\\,458": C_Q}).move_to(0.4 * UP)
        self.play(FadeIn(calc, shift=0.2 * UP))
        self.hold()
        self.say("Ojo con el conteo: a las 6 horas el término es el séptimo de la lista, porque la "
                 "hora cero es el primero. Por eso el exponente es 6 y no 7.")
        note = get_card_text(["hora h → término h + 1", "exponente = número de horas"], size=26, fill=P_I, border=C_I, width=6.2).move_to(1.3 * DOWN)
        self.play(FadeIn(note, shift=0.2 * UP))
        self.hold()
        self.say("Crecimientos que se multiplican, rumores, bacterias, intereses compuestos, son "
                 "progresiones geométricas: suben despacio al principio y luego disparadas.")
        axes = Axes(x_range=(0, 6, 1), y_range=(0, 1500, 500), width=4.6, height=2.2,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False)).move_to(3.3 * DOWN)
        dots = VGroup(*(Dot(axes.c2p(h, 2 * 3 ** h), radius=0.07).set_fill(C_I, 1) for h in range(0, 7)))
        curve = axes.get_graph(lambda h: 2 * 3 ** h, x_range=(0, 6), color=C_I, stroke_width=3)
        self.play(ShowCreation(axes), ShowCreation(curve), LaggedStartMap(FadeIn, dots, scale=0.5, lag_ratio=0.1))
        self.hold(0.5)
        self.end_section()


class S16_Cierre(S06_Cierre):
    question_text = "a₁ = 7 y r = 2.\n¿Cuánto vale S₆?"
    answer_tex = R"S_6 = 7\,\dfrac{2^{6} - 1}{2 - 1} = 7 \cdot 63 = 441"
    answer_say = ("2 a la sexta es 64, menos 1 son 63, por 7: 441.")
    question_say = ("Una pregunta rápida. Pausa el video si necesitas más tiempo: en una progresión "
                    "geométrica el primer término es 7 y la razón es 2. ¿Cuánto suman los 6 primeros términos?")
    next_text = "Ahora, los ejercicios:\nlos medios, la suma infinita\ny las bacterias"
    badges_spec = [
        (["Geométrica", "multiplicar siempre por r · aₙ = a₁·rⁿ⁻¹"], P_Q, C_Q),
        (["Suma", "Sₙ = a₁(rⁿ − 1)/(r − 1)"], P_Z, C_Z),
        (["Infinita", "si |r| < 1, S∞ = a₁/(1 − r)"], P_R, C_R),
    ]
    review_say = ("Repasemos: en una geométrica se multiplica siempre por r; el término n lleva r elevado "
                  "a n menos 1; la suma tiene su fórmula; y si la razón es pequeña, hasta la suma infinita "
                  "tiene un valor.")
