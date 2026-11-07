"""
Clase 6: Sumatoria y productoria (vertical 9:16, tema Zuka).

Escenas de manimgl (3b1b) sobre las utilidades compartidas de mb_common.py. El video va sin
voz ni subtítulos: cada say() deja en pantalla la pausa que esa frase necesita y la guarda en el
guion. Los ejemplos resueltos aquí (Σ 2k, Σ (3k + 1), Σ k² hasta 10, la telescópica con n = 4,
Π 2k, Σ (k² − k)) no se repiten en los ejercicios de la lección.

    manimgl sumatoria.py S04_Telescopica -w    # una escena
    python build.py                            # todas, y arma dist/
"""
from mb_common import *

TOPIC_TITLE = "Sumatoria y productoria"


# ---------------------------------------------------------------------------
# Piezas que se repiten
# ---------------------------------------------------------------------------
def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_label_arrow(target, text, direction, color, size=22, buff=0.55):
    """Rótulo con flecha corta hacia una parte de una fórmula."""
    lab = T(text, size=size, color=color).next_to(target, direction, buff=buff)
    arrow = Arrow(lab.get_edge_center(-direction), target.get_edge_center(direction), buff=0.08, thickness=2.5).set_color(color)
    return VGroup(lab, arrow)


def get_dominoes(pairs, color=C_R, width=1.45):
    """Fichas de dominó con un término telescópico cada una: (1/k − 1/(k+1))."""
    group = VGroup()
    for a, b in pairs:
        left = M(a, size=30, color=INK)
        right = M(b, size=30, color=INK)
        row = VGroup(left, M("-", size=30, color=MUTED), right).arrange(RIGHT, buff=0.12)
        box = RoundedRectangle(width=width, height=0.95, corner_radius=0.14).set_fill(CARD, 1).set_stroke(color, 2.5)
        group.add(VGroup(box, row.move_to(box)))
    return group.arrange(RIGHT, buff=0.14)


# ---------------------------------------------------------------------------
# Portada
# ---------------------------------------------------------------------------
class S00_Portada(MBScene):
    part_tag = "Clase 6"
    part_subtitle = "Sumas y productos largos, escritos en corto"
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
# 1. La sigma
# ---------------------------------------------------------------------------
class S01_Sigma(MBScene):
    def construct(self):
        self.mark("La sigma")
        self.set_header(R"\Sigma", "La sigma", ORANGE, PEACH)
        self.say("Sumar 2 más 4 más 6 y así hasta 10 se escribe corto con la letra griega sigma: "
                 "«suma de 2k, para k desde 1 hasta 5».", fox=True)
        sigma = M(R"\sum_{k=1}^{5} 2k", size=80, t2c={"k=1": C_N, "5": C_Q, "2k": C_Z}).move_to(3.6 * UP)
        self.play(FadeIn(sigma, shift=0.2 * UP))
        self.hold()
        self.say("Tres piezas: abajo, el índice y dónde empieza; arriba, dónde termina; y al lado, "
                 "el término general, la fórmula de cada sumando.")
        labels = VGroup(
            get_label_arrow(sigma[0][-3:], "índice: empieza en k = 1", DOWN + LEFT, C_N, buff=0.8),
            get_label_arrow(sigma[0][0:1], "termina en k = 5", UP + RIGHT, C_Q, buff=0.7),
            get_label_arrow(sigma[0][-2:], "término general", RIGHT, C_Z, buff=0.9),
        )
        # Las flechas apuntan a la fórmula entera: basta con rótulos cerca.
        cards = VGroup(
            get_card_text(["abajo", "índice y valor inicial"], size=24, fill=P_N, border=C_N, width=3.3),
            get_card_text(["arriba", "valor final"], size=24, fill=P_Q, border=C_Q, width=3.3),
            get_card_text(["al lado", "término general"], size=24, fill=P_Z, border=C_Z, width=3.3),
        ).arrange(RIGHT, buff=0.2).move_to(1.7 * UP)
        cards.set_max_width(LINE_WIDTH)
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Para desplegarla, k toma cada valor de 1 a 5 y se suman los resultados: "
                 "2, 4, 6, 8 y 10, que dan 30.")
        expand = VGroup(
            M(R"k = 1, 2, 3, 4, 5", size=36, color=MUTED),
            M(R"2(1) + 2(2) + 2(3) + 2(4) + 2(5)", size=38),
            M(R"= 2 + 4 + 6 + 8 + 10 = 30", size=42, t2c={"30": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(0.4 * DOWN)
        self.play(LaggedStartMap(FadeIn, expand, shift=0.2 * UP, lag_ratio=0.35))
        self.hold()
        self.say("Al revés también: 1 más 4 más 9 hasta 36 son los cuadrados de 1 a 6, o sea, "
                 "suma de k al cuadrado para k de 1 a 6.")
        back = M(R"1 + 4 + 9 + 16 + 25 + 36 = \sum_{k=1}^{6} k^{2}", size=40, t2c={"k^{2}": C_Z}).move_to(2.9 * DOWN)
        self.play(FadeIn(back, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 2. Propiedades
# ---------------------------------------------------------------------------
class S02_Propiedades(MBScene):
    def construct(self):
        self.mark("Propiedades")
        self.set_header(R"\Sigma", "Propiedades", C_Q, P_Q)
        self.say("La sigma es lineal: una constante que multiplica sale afuera, y la suma de dos "
                 "cosas se separa en dos sumas.", fox=True)
        props = VGroup(
            M(R"\sum c\,a_k = c \sum a_k", size=44),
            M(R"\sum (a_k + b_k) = \sum a_k + \sum b_k", size=44),
            M(R"\sum_{k=1}^{n} c = n\,c", size=44),
        ).arrange(DOWN, buff=0.4).move_to(3.3 * UP)
        self.play(LaggedStartMap(FadeIn, props[:2], shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Y sumar una constante n veces es n por la constante: la suma de 7, para k de 1 a "
                 "4, es 7 más 7 más 7 más 7, 28.")
        self.play(FadeIn(props[2], shift=0.2 * UP))
        const = M(R"\sum_{k=1}^{4} 7 = 7 + 7 + 7 + 7 = 28", size=36, color=MUTED).move_to(1.0 * UP)
        self.play(FadeIn(const, shift=0.2 * UP))
        self.hold()
        self.say("Con eso, la suma de 3k más 1, para k de 1 a 4, se parte: 3 por la suma de k, "
                 "más la suma de 1.")
        ex = VGroup(
            M(R"\sum_{k=1}^{4} (3k + 1) = 3 \sum_{k=1}^{4} k + \sum_{k=1}^{4} 1", size=38),
            M(R"= 3\,(1 + 2 + 3 + 4) + 4 \cdot 1 = 3 \cdot 10 + 4 = 34", size=38, t2c={"34": C_Q}),
        ).arrange(DOWN, buff=0.35).move_to(0.6 * DOWN)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.hold()
        self.say("3 por 10 más 4: 34. Compruébalo desplegando: 4 más 7 más 10 más 13 también da 34.")
        self.play(FadeIn(ex[1], shift=0.2 * UP))
        check = M(R"4 + 7 + 10 + 13 = 34", size=34, color=MUTED).move_to(2.3 * DOWN)
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold()
        self.say("Ojo: lo que no se puede es separar un producto. La suma de a por b no es la suma "
                 "de a por la suma de b.")
        warn = get_card_text(["Σ (aₖ · bₖ)  ≠  Σ aₖ · Σ bₖ"], size=28, fill=P_I, border=C_I, width=6.4).move_to(3.5 * DOWN)
        self.play(FadeIn(warn, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 3. Sumas notables
# ---------------------------------------------------------------------------
class S03_Notables(MBScene):
    def construct(self):
        self.mark("Sumas notables")
        self.set_header(R"\Sigma", "Sumas notables", C_Z, P_Z)
        self.say("Dos sumas aparecen tanto que conviene saberlas de memoria: la de los primeros n "
                 "enteros y la de sus cuadrados.", fox=True)
        f1 = M(R"\sum_{k=1}^{n} k = \dfrac{n\,(n + 1)}{2}", size=46).move_to(3.9 * UP)
        f2 = M(R"\sum_{k=1}^{n} k^{2} = \dfrac{n\,(n + 1)(2n + 1)}{6}", size=46).move_to(2.5 * UP)
        self.play(FadeIn(f1, shift=0.2 * UP))
        self.play(FadeIn(f2, shift=0.2 * UP))
        self.hold()
        self.say("La primera es la suma de Gauss: para n igual a 10, 10 por 11 entre 2, 55.")
        g = M(R"\sum_{k=1}^{10} k = \dfrac{10 \cdot 11}{2} = 55", size=40, t2c={"55": C_N}).move_to(1.1 * UP)
        self.play(FadeIn(g, shift=0.2 * UP))
        self.hold()
        self.say("Y los cuadrados de 1 a 10: 10 por 11 por 21, entre 6. 2.310 entre 6: 385.")
        sq = VGroup(
            M(R"\sum_{k=1}^{10} k^{2} = \dfrac{10 \cdot 11 \cdot 21}{6} = \dfrac{2\,310}{6}", size=40),
            M(R"= 385", size=44, color=C_Q),
        ).arrange(DOWN, buff=0.25).move_to(0.5 * DOWN)
        self.play(FadeIn(sq[0], shift=0.2 * UP))
        self.play(FadeIn(sq[1], shift=0.2 * UP))
        self.hold()
        self.say("Compruébalo con los primeros: 1 más 4 más 9 son 14, y la fórmula con n igual a 3 "
                 "da 3 por 4 por 7 entre 6: 14.")
        check = M(R"1 + 4 + 9 = 14 = \dfrac{3 \cdot 4 \cdot 7}{6}", size=36, color=MUTED).move_to(2.3 * DOWN)
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold()
        self.say("Con las propiedades y estas dos fórmulas se calculan sumas largas sin sumar "
                 "término a término.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 4. Suma telescópica
# ---------------------------------------------------------------------------
class S04_Telescopica(MBScene):
    def construct(self):
        self.mark("Suma telescópica")
        self.set_header(R"\Sigma", "Telescópica", C_R, P_R)
        self.say("Hay sumas que se pliegan como un telescopio. Mira 1 entre k por k más 1: cada "
                 "término es una resta de dos fracciones.", fox=True)
        idea = M(R"\dfrac{1}{k\,(k + 1)} = \dfrac{1}{k} - \dfrac{1}{k + 1}", size=46).move_to(4.0 * UP)
        self.play(FadeIn(idea, shift=0.2 * UP))
        self.hold()
        self.say("Sumemos de k igual 1 a 4. Escribe las cuatro restas en fila.")
        target = M(R"\sum_{k=1}^{4} \dfrac{1}{k\,(k + 1)}", size=44).move_to(2.5 * UP)
        self.play(FadeIn(target, shift=0.2 * UP))
        dom = get_dominoes([(R"1", R"\tfrac12"), (R"\tfrac12", R"\tfrac13"), (R"\tfrac13", R"\tfrac14"), (R"\tfrac14", R"\tfrac15")], color=C_R, width=1.55)
        dom.set_max_width(LINE_WIDTH).move_to(1.0 * UP)
        self.play(LaggedStartMap(FadeIn, dom, shift=0.2 * UP, lag_ratio=0.25))
        self.hold()
        self.say("Menos un medio y más un medio se cancelan; menos un tercio y más un tercio también; "
                 "y los cuartos. Solo sobreviven el primero y el último.")
        strikes = VGroup()
        for i in range(3):
            a = dom[i][1][2]
            b = dom[i + 1][1][0]
            strikes.add(Line(a.get_corner(DL), a.get_corner(UR)).set_stroke(C_I, 4))
            strikes.add(Line(b.get_corner(DL), b.get_corner(UR)).set_stroke(C_I, 4))
        self.play(LaggedStartMap(ShowCreation, strikes, lag_ratio=0.15), run_time=1.8)
        self.hold()
        self.say("Queda 1 menos un quinto: cuatro quintos.")
        result = M(R"= 1 - \dfrac{1}{5} = \dfrac{4}{5}", size=48, t2c={R"\dfrac{4}{5}": C_Q}).move_to(0.7 * DOWN)
        self.play(FadeIn(result, shift=0.2 * UP))
        self.hold()
        self.say("En general, hasta n queda 1 menos 1 entre n más 1. Y como ese resto se hace "
                 "pequeñísimo, la suma infinita vale exactamente 1.")
        general = VGroup(
            M(R"\sum_{k=1}^{n} \dfrac{1}{k\,(k + 1)} = 1 - \dfrac{1}{n + 1}", size=40),
            M(R"\sum_{k=1}^{\infty} \dfrac{1}{k\,(k + 1)} = 1", size=40, color=C_Q),
        ).arrange(DOWN, buff=0.35).move_to(2.6 * DOWN)
        self.play(FadeIn(general[0], shift=0.2 * UP))
        self.play(FadeIn(general[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 5. Productoria y factorial
# ---------------------------------------------------------------------------
class S05_Productoria(MBScene):
    def construct(self):
        self.mark("Productoria")
        self.set_header(R"\Pi", "Productoria", C_N, P_N)
        self.say("Para productos largos se usa la pi mayúscula: las mismas tres piezas, pero "
                 "multiplicando en vez de sumar.", fox=True)
        pi = M(R"\prod_{k=1}^{4} 2k = 2 \cdot 4 \cdot 6 \cdot 8", size=52).move_to(3.9 * UP)
        self.play(FadeIn(pi, shift=0.2 * UP))
        self.hold()
        self.say("2 por 4 por 6 por 8: 384. Fíjate que cada factor tiene un 2: es 2 a la cuarta por "
                 "1 por 2 por 3 por 4.")
        calc = VGroup(
            M(R"2 \cdot 4 \cdot 6 \cdot 8 = 384", size=42, t2c={"384": C_Q}),
            M(R"= 2^{4} \cdot (1 \cdot 2 \cdot 3 \cdot 4) = 16 \cdot 24", size=38, color=MUTED),
        ).arrange(DOWN, buff=0.3).move_to(2.3 * UP)
        self.play(FadeIn(calc[0], shift=0.2 * UP))
        self.play(FadeIn(calc[1], shift=0.2 * UP))
        self.hold()
        self.say("Ese producto 1 por 2 por 3 por 4 es tan famoso que tiene nombre y símbolo: "
                 "el factorial, 4 factorial, que vale 24.")
        fact = M(R"n! = \prod_{k=1}^{n} k = 1 \cdot 2 \cdot 3 \cdots n", size=46).move_to(0.7 * UP)
        self.play(FadeIn(fact, shift=0.2 * UP))
        self.hold()
        self.say("Los factoriales crecen rapidísimo: 4 factorial es 24, 5 factorial 120, 6 factorial "
                 "720, y 10 factorial ya pasa de tres millones.")
        table = VGroup(
            get_card_text(["4!", "24"], size=26, fill=P_N, border=C_N, width=1.55),
            get_card_text(["5!", "120"], size=26, fill=P_N, border=C_N, width=1.55),
            get_card_text(["6!", "720"], size=26, fill=P_N, border=C_N, width=1.55),
            get_card_text(["10!", "3 628 800"], size=22, fill=P_Q, border=C_Q, width=2.1),
        ).arrange(RIGHT, buff=0.18).move_to(0.9 * DOWN)
        table.set_max_width(LINE_WIDTH)
        self.play(LaggedStartMap(FadeIn, table, shift=0.2 * UP, lag_ratio=0.2))
        self.hold()
        self.say("Un truco: cada factorial es el anterior por el siguiente número. 6 factorial es "
                 "6 por 5 factorial, 6 por 120. Y por convenio, 0 factorial vale 1.")
        trick = VGroup(
            M(R"n! = n \cdot (n - 1)!", size=42),
            M(R"6! = 6 \cdot 5! = 6 \cdot 120 = 720 \qquad 0! = 1", size=36, color=MUTED),
        ).arrange(DOWN, buff=0.3).move_to(2.7 * DOWN)
        self.play(FadeIn(trick[0], shift=0.2 * UP))
        self.play(FadeIn(trick[1], shift=0.2 * UP))
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
            get_card_text(["Sigma", "índice, límites y término general"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["Propiedades", "lineal · Σ c = nc · Σ k = n(n + 1)/2"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["Pi y factorial", "Π multiplica · n! = 1 · 2 · … · n"], size=26, fill=P_Q, border=C_Q, width=6.8),
        ).arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        badges[0][1][0].set_color(C_N); badges[1][1][0].set_color(C_Z); badges[2][1][0].set_color(C_Q)
        self.say("Repasemos: la sigma abrevia sumas con índice, límites y término general; es lineal "
                 "y tiene sumas notables; la pi abrevia productos y el factorial es su estrella.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)

        self.mark("Ponte a prueba")
        self.clear_scene()
        self.set_header(R"?", "Ponte a prueba", ORANGE, PEACH)
        self.say("Una pregunta rápida. Pausa el video si necesitas más tiempo: ¿cuánto vale la suma "
                 "de k al cuadrado menos k, para k de 1 a 6?", wait=True)
        question = M(R"\sum_{k=1}^{6} (k^{2} - k) = \;?", size=52).move_to(2.6 * UP)
        timer = Integer(5, font_size=88).set_color(ORANGE).move_to(0.1 * DOWN)
        ring = Circle(radius=0.75).set_stroke(ORANGE, 6).move_to(timer)
        self.play(Write(question))
        self.play(FadeIn(timer), ShowCreation(ring))
        self.play(ChangeDecimalToValue(timer, 0), Uncreate(ring), run_time=5, rate_func=linear)
        answer = M(R"\sum k^{2} - \sum k = 91 - 21 = 70", size=44, color=C_Q)
        answer_box = get_card(answer, color=C_Q, fill=P_Q, buff=0.35, stroke_width=2.5)
        answer_group = VGroup(answer_box, answer).move_to(1.6 * DOWN)
        self.play(FadeOut(timer), FadeIn(answer_group, scale=0.9))
        self.say("Se separa: la suma de los cuadrados hasta 6 es 6 por 7 por 13 entre 6, 91; la de "
                 "los enteros es 21. 91 menos 21: 70.", wait=True)
        self.end_section()

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\narma la sigma, la pirámide\ny la torre del factorial", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
