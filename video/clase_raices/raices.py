"""
Clase 10: Raíces y exponentes racionales (vertical 9:16, tema Zuka).

Sin voz ni subtítulos ni preguntas al espectador. Intuición primero (el lado del cuadrado, el
cubo), luego la definición; ejemplos resueltos con detalle. Contenido: Manual de la UdeA, §1.5
(definiciones 1.5 y 1.6, proposición 1.6).

    manimgl raices.py S01_LadoDelCuadrado -w
    python build.py
"""
from mb_common import *

TOPIC_TITLE = "Raíces y exponentes racionales"


def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_square(side_units, unit=0.42, color=C_Q, label=None, area=None):
    sq = Square(side_units * unit).set_fill(color, 0.3).set_stroke(color, 3)
    grid = VGroup()
    n = int(round(side_units))
    if abs(side_units - n) < 1e-6:
        for k in range(1, n):
            grid.add(Line(sq.get_corner(DL) + k * unit * RIGHT, sq.get_corner(UL) + k * unit * RIGHT).set_stroke(color, 1, opacity=0.5))
            grid.add(Line(sq.get_corner(DL) + k * unit * UP, sq.get_corner(DR) + k * unit * UP).set_stroke(color, 1, opacity=0.5))
    group = VGroup(sq, grid)
    if area is not None:
        group.add(TB(f"área {area}", size=24, color=INK).move_to(sq))
    if label is not None:
        group.add(T(f"lado {label}", size=22, color=color).next_to(sq, DOWN, buff=0.12))
    return group


class S00_Portada(MBScene):
    part_tag = "Clase 10"
    part_subtitle = "Deshacer una potencia: el lado del cuadrado"
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


class S01_LadoDelCuadrado(MBScene):
    def construct(self):
        self.mark("El lado del cuadrado")
        self.set_header(R"\sqrt{\ }", "El lado del cuadrado", C_Q, P_Q)
        self.say("Elevar al cuadrado es fácil: un cuadrado de lado 7 tiene área 49. La raíz "
                 "cuadrada hace la pregunta al revés: si el área es 49, ¿cuánto mide el lado?", fox=True)
        sq = get_square(7, unit=0.4, color=C_Q, label="7", area=49).move_to(3.0 * UP)
        self.play(FadeIn(sq, shift=0.2 * UP), run_time=1.0)
        self.hold()
        formula = M(R"7^{2} = 49 \qquad\Longleftrightarrow\qquad \sqrt{49} = 7", size=42, t2c={"\\sqrt{49} = 7": C_Q}).next_to(sq, DOWN, buff=0.55)
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.say("Raíz de 49 es 7 porque 7 al cuadrado es 49. La raíz deshace la potencia: es su "
                 "operación inversa.")
        self.hold()
        self.say("¿Y si el área es 2? El lado es un número cuyo cuadrado es 2: raíz de 2. No es "
                 "entero, ni fracción: 1,41421… pero existe, es el lado de este cuadrado.")
        self.clear_scene()
        sq2 = get_square(1.41421, unit=1.4, color=C_I, label="√2 ≈ 1,414", area=2).move_to(3.2 * UP)
        self.play(FadeIn(sq2, shift=0.2 * UP))
        chk = VGroup(
            M(R"1{,}4^{2} = 1{,}96 \quad 1{,}41^{2} = 1{,}9881 \quad 1{,}414^{2} = 1{,}9994", size=28, color=MUTED),
            M(R"(\sqrt2)^{2} = 2", size=44, t2c={"2": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(sq2, DOWN, buff=0.6)
        self.play(FadeIn(chk[0], shift=0.2 * UP))
        self.play(FadeIn(chk[1], shift=0.2 * UP))
        self.hold()
        self.say("Definición general: la raíz n-ésima de a es el número b tal que b a la n es a. "
                 "El índice n dice qué potencia se deshace: raíz cúbica deshace el cubo.")
        defn = VGroup(
            M(R"\sqrt[n]{a} = b \quad\Longleftrightarrow\quad b^{n} = a", size=46),
            M(R"\sqrt[3]{125} = 5 \;\text{ porque }\; 5^{3} = 125", size=36, color=MUTED),
        ).arrange(DOWN, buff=0.3).next_to(chk, DOWN, buff=0.6)
        self.play(FadeIn(defn[0], shift=0.2 * UP))
        self.play(FadeIn(defn[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S02_ParImpar(MBScene):
    def construct(self):
        self.mark("Índice par e impar")
        self.set_header(R"\sqrt[n]{\ }", "Índice par e impar", C_Z, P_Z)
        self.say("Raíz cúbica de menos 8: busco un número que al cubo dé menos 8. Menos 2 por "
                 "menos 2 por menos 2 es menos 8. ¡Funciona! Las raíces de índice impar aceptan negativos.", fox=True)
        odd = VGroup(
            M(R"\sqrt[3]{-8} = -2 \;\text{ porque }\; (-2)^{3} = -8", size=38, t2c={"-2": C_Q}),
            M(R"\sqrt[5]{-32} = -2 \;\text{ porque }\; (-2)^{5} = -32", size=38, t2c={"-2": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(3.7 * UP)
        self.play(FadeIn(odd[0], shift=0.2 * UP))
        self.play(FadeIn(odd[1], shift=0.2 * UP))
        self.hold()
        self.say("Raíz cuadrada de menos 4: busco un número que al cuadrado dé menos 4. Pero todo "
                 "número real al cuadrado es positivo o cero: 2 al cuadrado es 4, y menos 2 al cuadrado también es 4. No hay ninguno.")
        even = VGroup(
            M(R"\sqrt{-4} = \;?\qquad 2^{2} = 4,\;\; (-2)^{2} = 4", size=38),
            M(R"\sqrt{-4} \text{ no es un número real}", size=40, color=C_I),
        ).arrange(DOWN, buff=0.3).next_to(odd, DOWN, buff=0.6)
        self.play(FadeIn(even[0], shift=0.2 * UP))
        self.play(FadeIn(even[1], shift=0.2 * UP))
        self.hold()
        self.say("Regla: índice impar, cualquier radicando; índice par, el radicando no puede "
                 "ser negativo. Y la raíz par de un positivo es, por convenio, la positiva: raíz de 9 es 3, no menos 3.")
        rule = VGroup(
            get_card_text(["índice impar", "cualquier radicando"], size=26, fill=P_Q, border=C_Q, width=3.3),
            get_card_text(["índice par", "radicando ≥ 0 · resultado ≥ 0"], size=26, fill=P_I, border=C_I, width=3.3),
        ).arrange(RIGHT, buff=0.3).next_to(even, DOWN, buff=0.6)
        self.play(LaggedStartMap(FadeIn, rule, shift=0.2 * UP, lag_ratio=0.3))
        conv = M(R"\sqrt{9} = 3 \quad (\text{no } \pm 3) \qquad \sqrt{0} = 0", size=36, color=MUTED).next_to(rule, DOWN, buff=0.45)
        self.play(FadeIn(conv, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_RaizDeCuadrado(MBScene):
    def construct(self):
        self.mark("Raíz de un cuadrado")
        self.set_header(R"|x|", "Raíz de un cuadrado", C_R, P_R)
        self.say("Una trampa famosa: raíz cuadrada de x al cuadrado. Parece que es x, pero prueba "
                 "con x igual a menos 3: el cuadrado es 9 y su raíz es 3, no menos 3.", fox=True)
        ex = VGroup(
            M(R"x = -3:\quad \sqrt{(-3)^{2}} = \sqrt{9} = 3", size=40),
            M(R"3 = |-3|, \;\text{ no } -3", size=40, t2c={"|-3|": C_R}),
        ).arrange(DOWN, buff=0.3).move_to(3.6 * UP)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.play(FadeIn(ex[1], shift=0.2 * UP))
        self.hold()
        self.say("La raíz cuadrada siempre devuelve un número positivo o cero, así que raíz de x al "
                 "cuadrado es el valor absoluto de x. Solo si sabes que x es positivo puedes quitar las barras.")
        rule = M(R"\sqrt{x^{2}} = |x|", size=56, color=C_R).next_to(ex, DOWN, buff=0.6)
        self.play(FadeIn(rule, shift=0.2 * UP))
        axes = Axes(x_range=(-4, 4, 1), y_range=(0, 4, 1), width=5.6, height=2.6,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False)).next_to(rule, DOWN, buff=0.6)
        g = axes.get_graph(lambda x: abs(x), x_range=(-4, 4), color=C_R, stroke_width=4)
        lab = M(R"y = \sqrt{x^{2}}", size=30, color=C_R).next_to(axes, RIGHT, buff=-1.6).shift(0.9 * UP)
        self.play(ShowCreation(axes), ShowCreation(g), FadeIn(lab))
        self.hold()
        self.say("Con índice impar no pasa: raíz cúbica de x al cubo sí es x, porque el cubo "
                 "conserva el signo.")
        odd = M(R"\sqrt[3]{x^{3}} = x \qquad \sqrt[3]{(-2)^{3}} = \sqrt[3]{-8} = -2", size=36, color=MUTED).next_to(axes, DOWN, buff=0.5)
        self.play(FadeIn(odd, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_ExponentesRacionales(MBScene):
    def construct(self):
        self.mark("Exponentes fraccionarios")
        self.set_header(R"a^{m/n}", "Exponentes fraccionarios", C_N, P_N)
        self.say("¿Qué podría ser 9 elevado a un medio? Si las leyes siguen valiendo, 9 a la un "
                 "medio por 9 a la un medio es 9 a la uno: 9. Un número que multiplicado por sí mismo da 9: ¡la raíz de 9!", fox=True)
        idea = VGroup(
            M(R"9^{1/2} \cdot 9^{1/2} = 9^{1/2 + 1/2} = 9^{1} = 9", size=38),
            M(R"\Rightarrow\; 9^{1/2} = \sqrt{9} = 3", size=44, t2c={"\\sqrt{9} = 3": C_N}),
        ).arrange(DOWN, buff=0.3).move_to(3.7 * UP)
        self.play(FadeIn(idea[0], shift=0.2 * UP))
        self.play(FadeIn(idea[1], shift=0.2 * UP))
        self.hold()
        self.say("Definición: a a la uno sobre n es la raíz n-ésima de a. Y a a la m sobre n es la "
                 "raíz n-ésima de a, elevada a m. El denominador es el índice; el numerador, la potencia.")
        defn = VGroup(
            M(R"a^{1/n} = \sqrt[n]{a} \qquad a^{m/n} = \left(\sqrt[n]{a}\right)^{m} = \sqrt[n]{a^{m}}", size=38),
            get_card_text(["abajo: el índice de la raíz", "arriba: la potencia"], size=26, fill=P_N, border=C_N, width=5.6),
        ).arrange(DOWN, buff=0.4).next_to(idea, DOWN, buff=0.55)
        self.play(FadeIn(defn[0], shift=0.2 * UP))
        self.play(FadeIn(defn[1], shift=0.2 * UP))
        self.hold()
        self.end_section()

        self.mark("Ejemplos")
        self.clear_scene()
        self.say("Ejemplo uno: 8 a la dos tercios. Conviene sacar primero la raíz: raíz cúbica de "
                 "8 es 2, y 2 al cuadrado es 4. Al revés también sale, 8 al cuadrado es 64 y su raíz cúbica es 4, pero con números más grandes.")
        e1 = VGroup(
            M(R"8^{2/3} = \left(\sqrt[3]{8}\right)^{2} = 2^{2} = 4", size=42, t2c={"4": C_Q}),
            M(R"8^{2/3} = \sqrt[3]{8^{2}} = \sqrt[3]{64} = 4 \;\checkmark", size=32, color=MUTED),
        ).arrange(DOWN, buff=0.25).move_to(3.8 * UP)
        self.play(FadeIn(e1[0], shift=0.2 * UP))
        self.play(FadeIn(e1[1], shift=0.2 * UP))
        self.hold()
        self.say("Ejemplo dos: 16 a la tres cuartos. Raíz cuarta de 16 es 2, porque 2 a la cuarta es "
                 "16. Y 2 al cubo es 8.")
        e2 = M(R"16^{3/4} = \left(\sqrt[4]{16}\right)^{3} = 2^{3} = 8", size=42, t2c={"8": C_Q}).next_to(e1, DOWN, buff=0.55)
        self.play(FadeIn(e2, shift=0.2 * UP))
        self.hold()
        self.say("Ejemplo tres, con negativo: 25 a la menos un medio. El exponente negativo baja "
                 "la potencia: 1 sobre 25 a la un medio, 1 sobre raíz de 25, un quinto.")
        e3 = M(R"25^{-1/2} = \dfrac{1}{25^{1/2}} = \dfrac{1}{\sqrt{25}} = \dfrac{1}{5}", size=42, t2c={"\\dfrac{1}{5}": C_Q}).next_to(e2, DOWN, buff=0.55)
        self.play(FadeIn(e3, shift=0.2 * UP))
        self.hold()
        self.say("Ejemplo cuatro: menos 27 a la un tercio. Es raíz cúbica de menos 27: índice "
                 "impar, se puede: menos 3, porque menos 3 al cubo es menos 27.")
        e4 = M(R"(-27)^{1/3} = \sqrt[3]{-27} = -3 \;\text{ porque }\; (-3)^{3} = -27", size=36, t2c={"-3": C_Q}).next_to(e3, DOWN, buff=0.55)
        self.play(FadeIn(e4, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_NoSeReparte(MBScene):
    def construct(self):
        self.mark("La raíz no se reparte")
        self.set_header(R"\ne", "La raíz no se reparte", C_I, P_I)
        self.say("Última idea, y es de las que más errores produce: la raíz de una suma no es la "
                 "suma de las raíces. Mira: raíz de 9 más 16 es raíz de 25, que es 5. Pero raíz de 9 más raíz de 16 es 3 más 4, 7.", fox=True)
        ex = VGroup(
            M(R"\sqrt{9 + 16} = \sqrt{25} = 5", size=42, t2c={"5": C_Q}),
            M(R"\sqrt{9} + \sqrt{16} = 3 + 4 = 7", size=42, t2c={"7": C_I}),
            M(R"\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}", size=46, color=C_I),
        ).arrange(DOWN, buff=0.35).move_to(3.4 * UP)
        self.play(LaggedStartMap(FadeIn, ex, shift=0.2 * UP, lag_ratio=0.4), run_time=1.8)
        self.hold()
        self.say("Con productos y cocientes sí se reparte: raíz de 4 por 9 es raíz de 4 por raíz "
                 "de 9, 2 por 3, 6. Y raíz de 36 también es 6. Eso lo usaremos en la próxima clase para simplificar.")
        ok = VGroup(
            M(R"\sqrt{4 \cdot 9} = \sqrt{4}\,\sqrt{9} = 2 \cdot 3 = 6 = \sqrt{36} \;\checkmark", size=34, t2c={"\\checkmark": C_Q}),
            M(R"\sqrt{ab} = \sqrt{a}\,\sqrt{b} \qquad \sqrt{\dfrac{a}{b}} = \dfrac{\sqrt{a}}{\sqrt{b}}", size=40, color=C_Q),
        ).arrange(DOWN, buff=0.4).next_to(ex, DOWN, buff=0.7)
        self.play(FadeIn(ok[0], shift=0.2 * UP))
        self.play(FadeIn(ok[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S06_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["Raíz", "ⁿ√a = b ⇔ bⁿ = a: deshace la potencia"], size=26, fill=P_Q, border=C_Q, width=6.8),
            get_card_text(["Índice", "impar: cualquier radicando · par: radicando ≥ 0"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["Cuidado", "√(x²) = |x|  ·  √(a + b) ≠ √a + √b"], size=26, fill=P_I, border=C_I, width=6.8),
            get_card_text(["Exponente fraccionario", "aᵐ/ⁿ = (ⁿ√a)ᵐ: abajo índice, arriba potencia"], size=26, fill=P_N, border=C_N, width=6.8),
        ).arrange(DOWN, buff=0.35).move_to(1.5 * UP)
        badges[0][1][0].set_color(C_Q); badges[1][1][0].set_color(C_Z); badges[2][1][0].set_color(C_I); badges[3][1][0].set_color(C_N)
        self.say("Repasemos: la raíz deshace la potencia; el índice par exige radicando no negativo; "
                 "raíz de x al cuadrado es el valor absoluto; y un exponente fraccionario es una raíz con una potencia.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2.2)
        self.hold(0.5)
        self.say("En los ejercicios vas a estirar cuadrados hasta el área justa y a decidir qué "
                 "raíces existen.", wait=True)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\nel lado del cuadrado, las parejas\ny ¿real o no real?", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
