"""
Clase 7: Axiomas de campo y orden (vertical 9:16, tema Zuka).

Escenas de manimgl sobre las utilidades compartidas de mb_common.py. Sin voz ni subtítulos: cada
say() deja su pausa. Intuición primero (balanzas, áreas, la recta que se refleja) y la fórmula
después; varios ejemplos resueltos con detalle y sin preguntas al espectador (los ejercicios van en
la app). Contenido: Manual de Álgebra y Trigonometría (UdeA), §1.2 y §1.3.

    manimgl axiomas.py S03_Orden -w     # una escena
    python build.py                     # todas, y arma dist/
"""
from mb_common import *

TOPIC_TITLE = "Axiomas de campo y orden"


# ---------------------------------------------------------------------------
# Piezas que se repiten
# ---------------------------------------------------------------------------
def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_scale(left_tex, right_tex, color=C_N, width=6.4):
    """Balanza equilibrada: dos platos con una expresión cada uno."""
    beam = Line(LEFT, RIGHT).set_width(width).set_stroke(color, 6)
    post = Line(ORIGIN, 0.9 * DOWN).set_stroke(MUTED, 6).move_to(beam.get_center() + 0.45 * DOWN)
    base = Line(LEFT, RIGHT).set_width(1.6).set_stroke(MUTED, 8).next_to(post, DOWN, buff=0)
    left_pan = Line(LEFT, RIGHT).set_width(1.9).set_stroke(color, 5).move_to(beam.get_left() + np.array([0.95, -1.0, 0]))
    right_pan = Line(LEFT, RIGHT).set_width(1.9).set_stroke(color, 5).move_to(beam.get_right() + np.array([-0.95, -1.0, 0]))
    strings = VGroup(
        Line(beam.get_left(), left_pan.get_left()).set_stroke(MUTED, 2), Line(beam.get_left(), left_pan.get_right()).set_stroke(MUTED, 2),
        Line(beam.get_right(), right_pan.get_left()).set_stroke(MUTED, 2), Line(beam.get_right(), right_pan.get_right()).set_stroke(MUTED, 2),
    )
    l = M(left_tex, size=44).next_to(left_pan, UP, buff=0.12)
    r = M(right_tex, size=44).next_to(right_pan, UP, buff=0.12)
    return VGroup(base, post, beam, strings, left_pan, right_pan, l, r)


def get_area_rects(a, b, c, unit=0.55, color_b=C_Z, color_c=C_Q):
    """Rectángulo a × (b + c) partido en a × b y a × c, con sus rótulos."""
    rb = Rectangle(b * unit, a * unit).set_fill(color_b, 0.55).set_stroke(INK, 2)
    rc = Rectangle(c * unit, a * unit).set_fill(color_c, 0.55).set_stroke(INK, 2)
    rc.next_to(rb, RIGHT, buff=0)
    group = VGroup(rb, rc)
    lab_a = M(str(a), size=34, color=C_N).next_to(rb, LEFT, buff=0.2)
    lab_b = M(str(b), size=34, color=color_b).next_to(rb, UP, buff=0.15)
    lab_c = M(str(c), size=34, color=color_c).next_to(rc, UP, buff=0.15)
    return VGroup(group, lab_a, lab_b, lab_c)


def brace_between(p1, p2, color=INK):
    """Llave horizontal bajo el segmento p1–p2 (manimgl no trae BraceBetweenPoints)."""
    return Brace(Line(p1, p2), DOWN, buff=0.05).set_color(color)


def get_dot_line(x_range, width=6.8):
    line = get_number_line(x_range, width=width, font_size=26)
    return line


# ---------------------------------------------------------------------------
# Portada
# ---------------------------------------------------------------------------
class S00_Portada(MBScene):
    part_tag = "Clase 7"
    part_subtitle = "Las reglas del juego de los números reales"
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
# 1. Las reglas del juego (axiomas de campo)
# ---------------------------------------------------------------------------
class S01_Reglas(MBScene):
    def construct(self):
        self.mark("Las reglas del juego")
        self.set_header(R"+\,\cdot", "Las reglas del juego", ORANGE, PEACH)
        self.say("Sumar y multiplicar números reales tiene unas pocas reglas básicas que nadie "
                 "demuestra: se aceptan. Se llaman axiomas de campo, y las usas sin darte cuenta.", fox=True)
        self.say("Piensa en una balanza. Si en un plato pongo 3 kilos y luego 5, pesa lo mismo que "
                 "5 y luego 3. El orden no importa: eso es la propiedad conmutativa.")
        scale = get_scale(R"3 + 5", R"5 + 3", color=C_N).move_to(3.0 * UP)
        self.play(FadeIn(scale, shift=0.2 * UP), run_time=1.0)
        conm = M(R"a + b = b + a \qquad a \cdot b = b \cdot a", size=44).next_to(scale, DOWN, buff=0.5)
        self.play(FadeIn(conm, shift=0.2 * UP))
        self.hold()
        self.say("Y si tengo tres pesas, da igual cuáles agrupo primero: 2 más 3, y luego 4, pesa "
                 "lo mismo que 2 más 3 y 4 juntos. Agrupar como quieras es la asociativa.")
        asoc = M(R"(2 + 3) + 4 = 2 + (3 + 4) = 9", size=42, t2c={"9": C_Q}).next_to(conm, DOWN, buff=0.5)
        asoc_g = M(R"(a + b) + c = a + (b + c) \qquad (ab)c = a(bc)", size=38, color=MUTED).next_to(asoc, DOWN, buff=0.25)
        self.play(FadeIn(asoc, shift=0.2 * UP))
        self.play(FadeIn(asoc_g, shift=0.2 * UP))
        self.hold()
        self.say("Hay dos números especiales: el cero no cambia nada al sumar, y el uno no cambia "
                 "nada al multiplicar. Son los neutros.")
        self.clear_scene()
        neutros = VGroup(
            get_card_text(["Neutro de la suma", "a + 0 = a"], size=28, fill=P_Z, border=C_Z, width=3.4),
            get_card_text(["Neutro del producto", "a · 1 = a"], size=28, fill=P_Q, border=C_Q, width=3.4),
        ).arrange(RIGHT, buff=0.3).move_to(4.0 * UP)
        self.play(LaggedStartMap(FadeIn, neutros, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Cada número tiene quien lo deshaga: su opuesto lo lleva al cero al sumar, y su "
                 "recíproco lo lleva al uno al multiplicar. El cero no tiene recíproco: nada por cero da uno.")
        inv = VGroup(
            M(R"a + (-a) = 0 \qquad\quad 7 + (-7) = 0", size=40),
            M(R"a \cdot \dfrac{1}{a} = 1 \quad (a \ne 0) \qquad 7 \cdot \dfrac17 = 1", size=40),
        ).arrange(DOWN, buff=0.4).move_to(2.0 * UP)
        self.play(FadeIn(inv[0], shift=0.2 * UP))
        self.play(FadeIn(inv[1], shift=0.2 * UP))
        self.hold()
        self.say("La última regla conecta las dos operaciones: la distributiva. Un rectángulo de 3 "
                 "por 4 más 2 es lo mismo que un rectángulo de 3 por 4 más otro de 3 por 2.")
        rects = get_area_rects(3, 4, 2).move_to(0.6 * DOWN)
        self.play(FadeIn(rects, shift=0.2 * UP), run_time=1.0)
        self.hold()
        self.say("Cuenta las áreas: 3 por 6 son 18, y 12 más 6 también son 18. Por eso el factor "
                 "se reparte a cada sumando.")
        dist = VGroup(
            M(R"3 \cdot (4 + 2) = 3 \cdot 4 + 3 \cdot 2", size=42),
            M(R"18 = 12 + 6", size=42, t2c={"18": C_Q}),
            M(R"a\,(b + c) = ab + ac", size=48, color=ORANGE),
        ).arrange(DOWN, buff=0.3).move_to(3.0 * DOWN)
        self.play(FadeIn(dist[0], shift=0.2 * UP))
        self.play(FadeIn(dist[1], shift=0.2 * UP))
        self.play(FadeIn(dist[2], shift=0.2 * UP))
        self.hold()
        self.say("Nueve reglas en total. Con ellas se construye todo el álgebra: cada paso que das "
                 "al despejar una ecuación es una de estas reglas disfrazada.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 2. Consecuencias: cancelar, el cero, los signos
# ---------------------------------------------------------------------------
class S02_Consecuencias(MBScene):
    def construct(self):
        self.mark("Lo que se deduce")
        self.set_header(R"\Rightarrow", "Lo que se deduce", C_Q, P_Q)
        self.say("De esas reglas salen propiedades que parecen obvias pero se pueden demostrar. "
                 "La primera: si a dos cosas iguales les quito lo mismo, siguen iguales. Es la ley cancelativa.", fox=True)
        canc = M(R"a + b = a + c \;\Rightarrow\; b = c", size=46).move_to(4.0 * UP)
        self.play(FadeIn(canc, shift=0.2 * UP))
        self.hold()
        self.say("Mira cómo se demuestra: a ambos lados les sumo el opuesto de a. A la izquierda "
                 "queda b, a la derecha queda c. Solo usé el inverso, la asociativa y el neutro.")
        proof = VGroup(
            M(R"(-a) + (a + b) = (-a) + (a + c)", size=36),
            M(R"((-a) + a) + b = ((-a) + a) + c", size=36, color=MUTED),
            M(R"0 + b = 0 + c \;\Rightarrow\; b = c", size=36, t2c={"b = c": C_Q}),
        ).arrange(DOWN, buff=0.28).next_to(canc, DOWN, buff=0.45)
        self.play(LaggedStartMap(FadeIn, proof, shift=0.2 * UP, lag_ratio=0.4), run_time=1.8)
        self.hold()
        self.say("Segunda: cualquier número por cero da cero. Y tercera, la que más confunde: "
                 "¿por qué menos por menos da más? No es un capricho: es un patrón.")
        self.clear_scene()
        zero = M(R"0 \cdot a = 0", size=48).move_to(4.1 * UP)
        self.play(FadeIn(zero, shift=0.2 * UP))
        self.hold()
        self.say("Multiplica menos 2 por 3, por 2, por 1, por 0. Cada vez que el segundo factor "
                 "baja en uno, el resultado sube 2: menos 6, menos 4, menos 2, cero.")
        rows = VGroup(
            M(R"(-2) \cdot 3 = -6", size=40),
            M(R"(-2) \cdot 2 = -4", size=40),
            M(R"(-2) \cdot 1 = -2", size=40),
            M(R"(-2) \cdot 0 = 0", size=40),
        ).arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to(2.3 * UP)
        arrows = VGroup(*(T("+2", size=22, color=C_Q).next_to(rows[i], RIGHT, buff=0.5) for i in range(1, 4)))
        self.play(LaggedStartMap(FadeIn, rows, shift=0.2 * UP, lag_ratio=0.3), run_time=1.6)
        self.play(FadeIn(arrows))
        self.hold()
        self.say("Si el patrón sigue, el siguiente paso es menos 2 por menos 1, y tiene que dar "
                 "2. Y menos 2 por menos 2 da 4. Menos por menos da más porque el patrón no se rompe.")
        more = VGroup(
            M(R"(-2) \cdot (-1) = 2", size=40, color=C_Q),
            M(R"(-2) \cdot (-2) = 4", size=40, color=C_Q),
        ).arrange(DOWN, buff=0.22, aligned_edge=LEFT).next_to(rows, DOWN, buff=0.25, aligned_edge=LEFT)
        self.play(LaggedStartMap(FadeIn, more, shift=0.2 * UP, lag_ratio=0.4))
        self.hold()
        self.say("Resumen de signos: iguales dan positivo, distintos dan negativo. Vale para "
                 "multiplicar y para dividir.")
        signs = VGroup(
            get_card_text(["(+)(+) = +", "(−)(−) = +"], size=28, fill=P_Q, border=C_Q, width=3.2),
            get_card_text(["(+)(−) = −", "(−)(+) = −"], size=28, fill=P_I, border=C_I, width=3.2),
        ).arrange(RIGHT, buff=0.3).move_to(2.3 * DOWN)
        self.play(LaggedStartMap(FadeIn, signs, shift=0.2 * UP, lag_ratio=0.3))
        self.hold()
        self.say("Y de paso: restar es sumar el opuesto. Cinco menos tres es cinco más menos tres. "
                 "Por eso todo lo que vale para la suma vale para la resta.")
        sub = M(R"a - b = a + (-b) \qquad 5 - 3 = 5 + (-3) = 2", size=38, color=MUTED).move_to(3.9 * DOWN)
        self.play(FadeIn(sub, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 3. El orden: la recta, sumar y multiplicar
# ---------------------------------------------------------------------------
class S03_Orden(MBScene):
    def construct(self):
        self.mark("El orden")
        self.set_header(R"<", "El orden", C_Z, P_Z)
        self.say("Los reales están ordenados: en la recta, a es menor que b cuando a está a la "
                 "izquierda. Dicho con números: b menos a es positivo.", fox=True)
        line = get_dot_line((-4, 4, 1)).move_to(3.6 * UP)
        self.play(ShowCreation(line))
        a_dot = Dot(line.n2p(-1), radius=0.11).set_fill(C_N, 1)
        b_dot = Dot(line.n2p(2), radius=0.11).set_fill(C_Z, 1)
        a_lab = M("a", size=36, color=C_N).next_to(a_dot, UP, buff=0.15)
        b_lab = M("b", size=36, color=C_Z).next_to(b_dot, UP, buff=0.15)
        self.play(FadeIn(a_dot), FadeIn(b_dot), FadeIn(a_lab), FadeIn(b_lab))
        defn = M(R"a < b \iff b - a > 0", size=44).next_to(line, DOWN, buff=0.7)
        self.play(FadeIn(defn, shift=0.2 * UP))
        self.hold()
        self.say("Tricotomía: entre dos números pasa exactamente una de tres cosas: a es menor, "
                 "a es igual o a es mayor que b. Nunca dos a la vez, nunca ninguna.")
        tri = get_card_text(["a < b    o    a = b    o    a > b", "una sola de las tres"], size=28, fill=P_Z, border=C_Z, width=6.6).next_to(defn, DOWN, buff=0.45)
        self.play(FadeIn(tri, shift=0.2 * UP))
        self.hold()
        self.say("Sumar lo mismo a los dos los desplaza juntos: siguen en el mismo orden. "
                 "Menos 1 es menor que 2, y sumando 3 a ambos, 2 sigue siendo menor que 5.")
        self.play(a_dot.animate.move_to(line.n2p(2)), b_dot.animate.move_to(line.n2p(5 - 1)), run_time=1.2)
        self.play(a_lab.animate.next_to(a_dot, UP, buff=0.15), b_lab.animate.next_to(b_dot, UP, buff=0.15), run_time=0.3)
        add = M(R"a < b \;\Rightarrow\; a + c < b + c", size=40, color=C_Q).next_to(tri, DOWN, buff=0.45)
        self.play(FadeIn(add, shift=0.2 * UP))
        self.hold()
        self.say("Multiplicar por un positivo estira la recta pero no la voltea: el orden se "
                 "conserva. Multiplicar por un negativo la refleja: ¡el orden se invierte!")
        self.clear_scene(keep=(line,))
        line2 = get_dot_line((-6, 6, 2)).move_to(3.6 * UP)
        self.play(Transform(line, line2))
        p_dot = Dot(line2.n2p(1), radius=0.11).set_fill(C_N, 1)
        q_dot = Dot(line2.n2p(3), radius=0.11).set_fill(C_Z, 1)
        labs = VGroup(M("1", size=30, color=C_N).next_to(p_dot, UP, buff=0.12), M("3", size=30, color=C_Z).next_to(q_dot, UP, buff=0.12))
        self.play(FadeIn(p_dot), FadeIn(q_dot), FadeIn(labs))
        self.say("Toma 1 y 3. Por menos 2: el 1 va a menos 2 y el 3 va a menos 6. Ahora el que era "
                 "menor quedó a la derecha: menos 2 es mayor que menos 6.")
        self.play(p_dot.animate.move_to(line2.n2p(-2)), q_dot.animate.move_to(line2.n2p(-6)), run_time=1.5)
        labs2 = VGroup(M("-2", size=30, color=C_N).next_to(p_dot, UP, buff=0.12), M("-6", size=30, color=C_Z).next_to(q_dot, UP, buff=0.12))
        self.play(Transform(labs, labs2))
        flip = VGroup(
            M(R"1 < 3 \;\Rightarrow\; (-2)\cdot 1 > (-2) \cdot 3", size=38),
            M(R"-2 > -6", size=42, t2c={"-2 > -6": C_I}),
        ).arrange(DOWN, buff=0.3).next_to(line2, DOWN, buff=0.7)
        self.play(FadeIn(flip, shift=0.2 * UP))
        self.hold()
        self.say("Las reglas del orden: sumar cualquier cosa conserva; multiplicar por positivo "
                 "conserva; multiplicar por negativo voltea. Y si a es menor que b y b menor que c, a es menor que c.")
        rules = VGroup(
            get_card_text(["c > 0:  a < b ⇒ ac < bc", "se conserva"], size=26, fill=P_Q, border=C_Q, width=3.3),
            get_card_text(["c < 0:  a < b ⇒ ac > bc", "se voltea"], size=26, fill=P_I, border=C_I, width=3.3),
        ).arrange(RIGHT, buff=0.3).next_to(flip, DOWN, buff=0.5)
        trans = M(R"a < b \;\text{y}\; b < c \;\Rightarrow\; a < c", size=36, color=MUTED).next_to(rules, DOWN, buff=0.4)
        self.play(LaggedStartMap(FadeIn, rules, shift=0.2 * UP, lag_ratio=0.3))
        self.play(FadeIn(trans, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 4. Valor absoluto: distancia
# ---------------------------------------------------------------------------
class S04_ValorAbsoluto(MBScene):
    def construct(self):
        self.mark("Valor absoluto")
        self.set_header(R"|\,|", "Valor absoluto", C_R, P_R)
        self.say("El valor absoluto de un número es su distancia al cero, sin importar el lado. "
                 "Siete y menos siete están a siete pasos del cero.", fox=True)
        line = get_dot_line((-8, 8, 2)).move_to(3.7 * UP)
        self.play(ShowCreation(line))
        d1 = Dot(line.n2p(-7), radius=0.11).set_fill(C_I, 1)
        d2 = Dot(line.n2p(7), radius=0.11).set_fill(C_Q, 1)
        b1 = brace_between(line.n2p(-7), line.n2p(0)).set_color(C_I)
        b2 = brace_between(line.n2p(0), line.n2p(7)).set_color(C_Q)
        t1 = T("7 pasos", size=22, color=C_I).next_to(b1, DOWN, buff=0.08)
        t2 = T("7 pasos", size=22, color=C_Q).next_to(b2, DOWN, buff=0.08)
        self.play(FadeIn(d1), FadeIn(d2))
        self.play(GrowFromCenter(b1), GrowFromCenter(b2), FadeIn(t1), FadeIn(t2))
        ex = M(R"|-7| = 7 \qquad |7| = 7", size=46).next_to(t1, DOWN, buff=0.6).set_x(0)
        self.play(FadeIn(ex, shift=0.2 * UP))
        self.hold()
        self.say("La definición por casos dice lo mismo: si el número es positivo o cero se queda "
                 "igual; si es negativo, se le cambia el signo.")
        defn = M(R"|a| = \begin{cases} a & \text{si } a \ge 0 \\ -a & \text{si } a < 0 \end{cases}", size=42).next_to(ex, DOWN, buff=0.5)
        self.play(FadeIn(defn, shift=0.2 * UP))
        self.hold()
        self.say("Ejemplo con trampa: valor absoluto de raíz de 2 menos 2. Raíz de 2 es 1,41, así "
                 "que adentro hay un negativo: menos 0,59. Se le cambia el signo: 2 menos raíz de 2.")
        trap = VGroup(
            M(R"|\sqrt2 - 2| \quad\text{con}\quad \sqrt2 - 2 \approx -0{,}59 < 0", size=36),
            M(R"|\sqrt2 - 2| = -(\sqrt2 - 2) = 2 - \sqrt2", size=40, t2c={"2 - \\sqrt2": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(defn, DOWN, buff=0.5)
        self.play(FadeIn(trap[0], shift=0.2 * UP))
        self.play(FadeIn(trap[1], shift=0.2 * UP))
        self.hold()
        self.say("Y la distancia entre dos números cualesquiera es el valor absoluto de su "
                 "diferencia. Entre menos 4 y 3 hay 7 pasos, en el orden que los restes.")
        dist = M(R"d(a, b) = |a - b| \qquad |3 - (-4)| = |-4 - 3| = 7", size=36, color=MUTED).next_to(trap, DOWN, buff=0.5)
        self.play(FadeIn(dist, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 5. Ejemplos resueltos con detalle
# ---------------------------------------------------------------------------
class S05_Ejemplos(MBScene):
    def construct(self):
        self.mark("Ejemplo 1: despejar con reglas")
        self.set_header(R"\checkmark", "Ejemplos resueltos", ORANGE, PEACH)
        self.say("Primer ejemplo: resolver 2x más 5 igual a 11, pero diciendo qué regla usa cada "
                 "paso. Así ves que despejar es aplicar axiomas.", fox=True)
        eq = M(R"2x + 5 = 11", size=50).move_to(4.1 * UP)
        self.play(FadeIn(eq, shift=0.2 * UP))
        steps = VGroup(
            VGroup(M(R"(2x + 5) + (-5) = 11 + (-5)", size=34), T("sumo el opuesto de 5 a ambos lados", size=22, color=MUTED)).arrange(DOWN, buff=0.08),
            VGroup(M(R"2x + (5 + (-5)) = 6", size=34), T("asociativa", size=22, color=MUTED)).arrange(DOWN, buff=0.08),
            VGroup(M(R"2x + 0 = 6 \;\Rightarrow\; 2x = 6", size=34), T("inverso y neutro de la suma", size=22, color=MUTED)).arrange(DOWN, buff=0.08),
            VGroup(M(R"\tfrac12 \cdot (2x) = \tfrac12 \cdot 6", size=34), T("multiplico por el recíproco de 2", size=22, color=MUTED)).arrange(DOWN, buff=0.08),
            VGroup(M(R"(\tfrac12 \cdot 2)\,x = 3 \;\Rightarrow\; 1 \cdot x = 3 \;\Rightarrow\; x = 3", size=34, t2c={"x = 3": C_Q}), T("asociativa, inverso y neutro del producto", size=22, color=MUTED)).arrange(DOWN, buff=0.08),
        ).arrange(DOWN, buff=0.3).next_to(eq, DOWN, buff=0.5)
        self.say("Sumo menos 5 a los dos lados: la igualdad se mantiene. Asocio, y 5 más menos 5 es "
                 "cero, el neutro. Queda 2x igual a 6.")
        for k in range(3):
            self.play(FadeIn(steps[k], shift=0.2 * UP))
        self.hold()
        self.say("Multiplico ambos lados por un medio, el recíproco de 2. Asocio: un medio por dos es "
                 "uno, y uno por x es x. Resultado: x igual a 3. Cada paso fue un axioma.")
        for k in range(3, 5):
            self.play(FadeIn(steps[k], shift=0.2 * UP))
        self.hold()
        self.end_section()

        self.mark("Ejemplo 2: una desigualdad que voltea")
        self.clear_scene()
        self.say("Segundo ejemplo: menos 3x es mayor que 12. Hay que dividir entre menos 3, un "
                 "negativo, así que el orden se voltea.")
        ineq = M(R"-3x > 12", size=50).move_to(4.1 * UP)
        self.play(FadeIn(ineq, shift=0.2 * UP))
        self.say("Multiplico ambos lados por menos un tercio. Como es negativo, el «mayor que» "
                 "se convierte en «menor que»: x es menor que menos 4.")
        st2 = VGroup(
            M(R"\left(-\tfrac13\right)(-3x) \;<\; \left(-\tfrac13\right) 12", size=38),
            T("multiplicar por un negativo voltea el signo", size=22, color=C_I),
            M(R"x < -4", size=48, t2c={"x < -4": C_Q}),
        ).arrange(DOWN, buff=0.25).next_to(ineq, DOWN, buff=0.5)
        self.play(LaggedStartMap(FadeIn, st2, shift=0.2 * UP, lag_ratio=0.4), run_time=1.6)
        self.hold()
        self.say("Comprueba con un número: x igual a menos 5 cumple x menor que menos 4, y en la "
                 "original menos 3 por menos 5 es 15, que sí es mayor que 12. Y con x igual a 0 no funciona: 0 no es mayor que 12.")
        check = VGroup(
            M(R"x = -5:\quad (-3)(-5) = 15 > 12 \;\checkmark", size=34, color=C_Q),
            M(R"x = 0:\quad (-3)(0) = 0 \not> 12 \;\times", size=34, color=C_I),
        ).arrange(DOWN, buff=0.25).next_to(st2, DOWN, buff=0.5)
        self.play(FadeIn(check[0], shift=0.2 * UP))
        self.play(FadeIn(check[1], shift=0.2 * UP))
        line = get_dot_line((-8, 2, 2)).next_to(check, DOWN, buff=0.6)
        shade = Line(line.n2p(-8), line.n2p(-4)).set_stroke(C_Q, 8)
        hole = Dot(line.n2p(-4), radius=0.12).set_fill(BG_COLOR, 1).set_stroke(C_Q, 3)
        self.play(ShowCreation(line))
        self.play(ShowCreation(shade), FadeIn(hole))
        self.hold()
        self.end_section()

        self.mark("Ejemplo 3: distancia con valor absoluto")
        self.clear_scene()
        self.say("Tercer ejemplo: ¿qué números están a distancia 3 del 2? Es decir, valor absoluto "
                 "de x menos 2 igual a 3.")
        ab = M(R"|x - 2| = 3", size=50).move_to(4.1 * UP)
        self.play(FadeIn(ab, shift=0.2 * UP))
        self.say("Distancia 3 desde el 2 se logra en dos sitios: tres pasos a la derecha, en 5, y "
                 "tres pasos a la izquierda, en menos 1. Con la definición: x menos 2 es 3 o x menos 2 es menos 3.")
        line = get_dot_line((-3, 7, 1)).next_to(ab, DOWN, buff=0.7)
        c = Dot(line.n2p(2), radius=0.11).set_fill(C_N, 1)
        l = Dot(line.n2p(-1), radius=0.11).set_fill(C_Q, 1)
        r = Dot(line.n2p(5), radius=0.11).set_fill(C_Q, 1)
        bl = brace_between(line.n2p(-1), line.n2p(2)).set_color(C_Q)
        br = brace_between(line.n2p(2), line.n2p(5)).set_color(C_Q)
        tl = T("3", size=22, color=C_Q).next_to(bl, DOWN, buff=0.08)
        tr = T("3", size=22, color=C_Q).next_to(br, DOWN, buff=0.08)
        self.play(ShowCreation(line), FadeIn(c))
        self.play(FadeIn(l), FadeIn(r), GrowFromCenter(bl), GrowFromCenter(br), FadeIn(tl), FadeIn(tr))
        sol = VGroup(
            M(R"x - 2 = 3 \;\Rightarrow\; x = 5", size=40),
            M(R"x - 2 = -3 \;\Rightarrow\; x = -1", size=40),
        ).arrange(DOWN, buff=0.25).next_to(tl, DOWN, buff=0.6).set_x(0)
        self.play(FadeIn(sol[0], shift=0.2 * UP))
        self.play(FadeIn(sol[1], shift=0.2 * UP))
        self.hold()
        self.say("Y si la pregunta fuera «a distancia menor que 3», la respuesta sería todo el tramo "
                 "entre menos 1 y 5: menos 3 es menor que x menos 2, que es menor que 3.")
        less = M(R"|x - 2| < 3 \;\iff\; -3 < x - 2 < 3 \;\iff\; -1 < x < 5", size=34, color=MUTED).next_to(sol, DOWN, buff=0.5)
        shade = Line(line.n2p(-1), line.n2p(5)).set_stroke(C_R, 8)
        self.play(FadeIn(less, shift=0.2 * UP), ShowCreation(shade))
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
            get_card_text(["Axiomas de campo", "conmutar, asociar, neutros, inversos, distribuir"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["Signos", "iguales dan +, distintos dan − (es un patrón)"], size=26, fill=P_Q, border=C_Q, width=6.8),
            get_card_text(["Orden", "sumar conserva · × negativo voltea"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["Valor absoluto", "distancia al cero · |a − b| distancia entre a y b"], size=26, fill=P_R, border=C_R, width=6.8),
        ).arrange(DOWN, buff=0.35).move_to(1.5 * UP)
        badges[0][1][0].set_color(C_N); badges[1][1][0].set_color(C_Q); badges[2][1][0].set_color(C_Z); badges[3][1][0].set_color(C_R)
        self.say("Repasemos: nueve reglas para sumar y multiplicar; de ellas salen la cancelativa y "
                 "los signos; el orden se conserva al sumar y se voltea al multiplicar por negativo; y el "
                 "valor absoluto es una distancia.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2.2)
        self.hold(0.5)
        self.say("Ahora te toca jugar: en los ejercicios vas a nombrar reglas, predecir signos y "
                 "ver cómo se voltea una desigualdad.", wait=True)
        self.end_section()

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\nlas reglas del juego, la máquina de signos\ny la desigualdad que voltea", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
