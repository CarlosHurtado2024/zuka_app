"""
Clase 11: Simplificar y racionalizar (vertical 9:16, tema Zuka).

Sin voz ni subtítulos ni preguntas al espectador. Propiedades de los radicales, sacar factores
por parejas de primos, radicales semejantes y racionalización (monomio, conjugado, raíz cúbica),
con ejemplos resueltos con detalle. Contenido: Manual de la UdeA, §1.5 y problemas 1.7–1.12, 4.1–4.12.

    manimgl radicales.py S05_Conjugado -w
    python build.py
"""
from mb_common import *

TOPIC_TITLE = "Simplificar y racionalizar"


def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_prime_tiles(primes, color=C_Z, size=0.6):
    tiles = VGroup()
    for p in primes:
        box = RoundedRectangle(width=size, height=size, corner_radius=0.12).set_fill(CARD, 1).set_stroke(color, 2.5)
        tiles.add(VGroup(box, M(str(p), size=34, color=INK).move_to(box)))
    return tiles.arrange(RIGHT, buff=0.12)


class S00_Portada(MBScene):
    part_tag = "Clase 11"
    part_subtitle = "Radicales más simples y sin raíces abajo"
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


class S01_Propiedades(MBScene):
    def construct(self):
        self.mark("Las propiedades")
        self.set_header(R"\sqrt{ab}", "Las propiedades", C_Q, P_Q)
        self.say("Un radical se puede partir en productos y cocientes, nunca en sumas. Raíz de 4 "
                 "por 9 es raíz de 4 por raíz de 9: 2 por 3, 6. Y raíz de 36 es 6: coincide.", fox=True)
        props = VGroup(
            M(R"\sqrt[n]{ab} = \sqrt[n]{a}\,\sqrt[n]{b} \qquad \sqrt[n]{\dfrac{a}{b}} = \dfrac{\sqrt[n]{a}}{\sqrt[n]{b}}", size=38),
            M(R"\sqrt{4 \cdot 9} = \sqrt4 \cdot \sqrt9 = 2 \cdot 3 = 6", size=40, t2c={"6": C_Q}),
        ).arrange(DOWN, buff=0.4).move_to(3.7 * UP)
        self.play(FadeIn(props[0], shift=0.2 * UP))
        self.play(FadeIn(props[1], shift=0.2 * UP))
        self.hold()
        self.say("Esa es la clave para simplificar: si dentro de la raíz hay un cuadrado perfecto "
                 "multiplicando, sale afuera. Raíz de 50 es raíz de 25 por 2: 5 raíz de 2.")
        ex = VGroup(
            M(R"\sqrt{50} = \sqrt{25 \cdot 2} = \sqrt{25}\,\sqrt{2} = 5\sqrt{2}", size=40, t2c={"5\\sqrt{2}": C_Q}),
            M(R"\sqrt{50} \approx 7{,}07 \qquad 5\sqrt2 \approx 5 \cdot 1{,}414 = 7{,}07 \;\checkmark", size=30, color=MUTED),
        ).arrange(DOWN, buff=0.3).next_to(props, DOWN, buff=0.6)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.play(FadeIn(ex[1], shift=0.2 * UP))
        self.hold()
        self.say("Con cocientes igual: raíz de 9 dieciseisavos es raíz de 9 sobre raíz de 16, tres "
                 "cuartos. Pero raíz de 9 más 16 no se parte: es raíz de 25, cinco.")
        ex2 = VGroup(
            M(R"\sqrt{\dfrac{9}{16}} = \dfrac{\sqrt9}{\sqrt{16}} = \dfrac34", size=40, t2c={"\\dfrac34": C_Q}),
            M(R"\sqrt{9 + 16} = \sqrt{25} = 5 \;\ne\; 3 + 4", size=36, color=C_I),
        ).arrange(DOWN, buff=0.35).next_to(ex, DOWN, buff=0.6)
        self.play(FadeIn(ex2[0], shift=0.2 * UP))
        self.play(FadeIn(ex2[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S02_SacarFactores(MBScene):
    def construct(self):
        self.mark("Sacar factores")
        self.set_header(R"\sqrt{72}", "Sacar factores", C_N, P_N)
        self.say("Método seguro para simplificar: descompón el radicando en primos y saca de la raíz "
                 "cuadrada cada pareja de primos iguales como un solo factor. Raíz de 72: 72 es 2 por 2 por 2 por 3 por 3.", fox=True)
        tiles = get_prime_tiles([2, 2, 2, 3, 3], color=C_N).move_to(4.0 * UP)
        root = M(R"\sqrt{72} = \sqrt{2 \cdot 2 \cdot 2 \cdot 3 \cdot 3}", size=40).next_to(tiles, DOWN, buff=0.35)
        self.play(LaggedStartMap(FadeIn, tiles, lag_ratio=0.15), FadeIn(root, shift=0.2 * UP))
        self.hold()
        self.say("Una pareja de doses sale como un 2; la pareja de treses sale como un 3. Queda un "
                 "2 solo adentro. Afuera: 2 por 3, seis. Raíz de 72 es 6 raíz de 2.")
        pair1 = SurroundingRectangle(VGroup(tiles[0], tiles[1]), color=C_Q, buff=0.06)
        pair2 = SurroundingRectangle(VGroup(tiles[3], tiles[4]), color=C_Q, buff=0.06)
        self.play(ShowCreation(pair1), ShowCreation(pair2))
        steps = VGroup(
            M(R"= \sqrt{2^{2}} \cdot \sqrt{3^{2}} \cdot \sqrt{2} = 2 \cdot 3 \cdot \sqrt2", size=38),
            M(R"\sqrt{72} = 6\sqrt{2}", size=46, t2c={"6\\sqrt{2}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(root, DOWN, buff=0.5)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold()
        self.say("Con raíz cúbica salen los tríos. Raíz cúbica de 54: 54 es 2 por 3 por 3 por 3. El "
                 "trío de treses sale como un 3, y el 2 se queda: 3 raíz cúbica de 2.")
        self.clear_scene()
        t2 = get_prime_tiles([2, 3, 3, 3], color=C_Z).move_to(4.0 * UP)
        trio = SurroundingRectangle(VGroup(t2[1], t2[2], t2[3]), color=C_Q, buff=0.06)
        cube = VGroup(
            M(R"\sqrt[3]{54} = \sqrt[3]{2 \cdot 3 \cdot 3 \cdot 3} = \sqrt[3]{3^{3}} \cdot \sqrt[3]{2}", size=36),
            M(R"\sqrt[3]{54} = 3\sqrt[3]{2}", size=46, t2c={"3\\sqrt[3]{2}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(t2, DOWN, buff=0.5)
        self.play(LaggedStartMap(FadeIn, t2, lag_ratio=0.15))
        self.play(ShowCreation(trio))
        self.play(FadeIn(cube[0], shift=0.2 * UP))
        self.play(FadeIn(cube[1], shift=0.2 * UP))
        self.hold()
        self.say("Con letras es igual: raíz de x a la quinta. Cinco equis: dos parejas salen, una "
                 "x por pareja, y una x se queda. x al cuadrado raíz de x, si x es positivo.")
        lit = M(R"\sqrt{x^{5}} = \sqrt{x^{2} \cdot x^{2} \cdot x} = x \cdot x \cdot \sqrt{x} = x^{2}\sqrt{x} \quad (x \ge 0)", size=34, t2c={"x^{2}\\sqrt{x}": C_Q}).next_to(cube, DOWN, buff=0.6)
        self.play(FadeIn(lit, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_Semejantes(MBScene):
    def construct(self):
        self.mark("Radicales semejantes")
        self.set_header(R"+", "Radicales semejantes", C_R, P_R)
        self.say("Los radicales se suman como las manzanas: solo si son de la misma clase, mismo "
                 "índice y mismo radicando. 3 raíz de 2 más 5 raíz de 2 son 8 raíz de 2. Pero raíz de 2 más raíz de 3 se queda así.", fox=True)
        ex = VGroup(
            M(R"3\sqrt2 + 5\sqrt2 = 8\sqrt2", size=42, t2c={"8\\sqrt2": C_Q}),
            M(R"\sqrt2 + \sqrt3 \;\text{ no se simplifica}", size=36, color=MUTED),
        ).arrange(DOWN, buff=0.3).move_to(3.8 * UP)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.play(FadeIn(ex[1], shift=0.2 * UP))
        self.hold()
        self.say("Muchas veces no parecen semejantes hasta que simplificas. Raíz de 72 más 3 raíz "
                 "de 50 menos raíz de 18: los tres esconden una raíz de 2.")
        big = VGroup(
            M(R"\sqrt{72} + 3\sqrt{50} - \sqrt{18}", size=42),
            M(R"= 6\sqrt2 + 3 \cdot 5\sqrt2 - 3\sqrt2", size=38),
            M(R"= 6\sqrt2 + 15\sqrt2 - 3\sqrt2 = 18\sqrt2", size=40, t2c={"18\\sqrt2": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(ex, DOWN, buff=0.65)
        self.play(FadeIn(big[0], shift=0.2 * UP))
        self.say("Raíz de 72 es 6 raíz de 2; raíz de 50 es 5 raíz de 2, por 3 son 15 raíz de 2; "
                 "raíz de 18 es 3 raíz de 2. Ahora sí: 6 más 15 menos 3, 18 raíz de 2.")
        self.play(FadeIn(big[1], shift=0.2 * UP))
        self.play(FadeIn(big[2], shift=0.2 * UP))
        self.hold()
        self.say("Ojo con la trampa de sumar adentro: raíz de 72 más raíz de 18 no es raíz de 90. Es "
                 "6 raíz de 2 más 3 raíz de 2, 9 raíz de 2.")
        trap = M(R"\sqrt{72} + \sqrt{18} = 9\sqrt2 \quad\ne\quad \sqrt{90}", size=38, t2c={"\\sqrt{90}": C_I}).next_to(big, DOWN, buff=0.6)
        self.play(FadeIn(trap, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Monomio(MBScene):
    def construct(self):
        self.mark("Racionalizar: un radical solo")
        self.set_header(R"\tfrac{1}{\sqrt{\ }}", "Racionalizar", C_Z, P_Z)
        self.say("Racionalizar es quitar la raíz del denominador. ¿Por qué? Para que los "
                 "resultados sean comparables y fáciles de estimar: 1 sobre raíz de 3 y raíz de 3 sobre 3 son el mismo número, pero el segundo se lee mejor.", fox=True)
        idea = M(R"\dfrac{1}{\sqrt3} = \dfrac{1}{\sqrt3} \cdot \dfrac{\sqrt3}{\sqrt3} = \dfrac{\sqrt3}{3}", size=44, t2c={"\\dfrac{\\sqrt3}{3}": C_Q}).move_to(3.8 * UP)
        self.play(FadeIn(idea, shift=0.2 * UP))
        self.say("El truco: multiplicar arriba y abajo por la misma raíz. Eso es multiplicar por "
                 "1, no cambia el valor, y abajo raíz de 3 por raíz de 3 es 3.")
        self.hold()
        self.say("Ejemplo: 7 sobre 3 raíz de 2. Multiplico por raíz de 2 sobre raíz de 2: arriba 7 "
                 "raíz de 2, abajo 3 por 2, seis.")
        e1 = M(R"\dfrac{7}{3\sqrt2} = \dfrac{7}{3\sqrt2} \cdot \dfrac{\sqrt2}{\sqrt2} = \dfrac{7\sqrt2}{3 \cdot 2} = \dfrac{7\sqrt2}{6}", size=38, t2c={"\\dfrac{7\\sqrt2}{6}": C_Q}).next_to(idea, DOWN, buff=0.7)
        self.play(FadeIn(e1, shift=0.2 * UP))
        self.hold()
        self.say("Con raíz cúbica hay que completar el cubo: 1 sobre raíz cúbica de 4. Como 4 es 2 "
                 "al cuadrado, falta un 2 para tener 2 al cubo: multiplico por raíz cúbica de 2.")
        e2 = M(R"\dfrac{1}{\sqrt[3]{4}} = \dfrac{1}{\sqrt[3]{2^{2}}} \cdot \dfrac{\sqrt[3]{2}}{\sqrt[3]{2}} = \dfrac{\sqrt[3]{2}}{\sqrt[3]{2^{3}}} = \dfrac{\sqrt[3]{2}}{2}", size=36, t2c={"\\dfrac{\\sqrt[3]{2}}{2}": C_Q}).next_to(e1, DOWN, buff=0.7)
        self.play(FadeIn(e2, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_Conjugado(MBScene):
    def construct(self):
        self.mark("Racionalizar con el conjugado")
        self.set_header(R"a^2 - b^2", "El conjugado", C_I, P_I)
        self.say("Si abajo hay una suma o resta con raíz, multiplicar por la misma raíz no basta. "
                 "Se usa el conjugado: la misma expresión con el signo cambiado, porque suma por diferencia da diferencia de cuadrados y las raíces desaparecen.", fox=True)
        rule = M(R"(a + b)(a - b) = a^{2} - b^{2} \qquad (4 + \sqrt5)(4 - \sqrt5) = 16 - 5 = 11", size=34).move_to(4.0 * UP)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold()
        self.say("Ejemplo: 9 sobre 4 más raíz de 5. Multiplico arriba y abajo por 4 menos raíz de "
                 "5. Abajo: 16 menos 5, once. Arriba queda 9 por 4 menos raíz de 5.")
        e1 = VGroup(
            M(R"\dfrac{9}{4 + \sqrt5} \cdot \dfrac{4 - \sqrt5}{4 - \sqrt5} = \dfrac{9(4 - \sqrt5)}{16 - 5}", size=38),
            M(R"= \dfrac{9(4 - \sqrt5)}{11}", size=44, t2c={"\\dfrac{9(4 - \\sqrt5)}{11}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(rule, DOWN, buff=0.6)
        self.play(FadeIn(e1[0], shift=0.2 * UP))
        self.play(FadeIn(e1[1], shift=0.2 * UP))
        self.hold()
        self.say("Otro, con letras: 3 sobre raíz de 2x más 3, menos raíz de 2x. El conjugado es la "
                 "suma. Abajo: 2x más 3, menos 2x: ¡tres! Se cancela con el 3 de arriba.")
        e2 = VGroup(
            M(R"\dfrac{3}{\sqrt{2x + 3} - \sqrt{2x}} \cdot \dfrac{\sqrt{2x + 3} + \sqrt{2x}}{\sqrt{2x + 3} + \sqrt{2x}}", size=34),
            M(R"= \dfrac{3(\sqrt{2x + 3} + \sqrt{2x})}{(2x + 3) - 2x} = \dfrac{3(\sqrt{2x + 3} + \sqrt{2x})}{3}", size=32),
            M(R"= \sqrt{2x + 3} + \sqrt{2x}", size=42, t2c={"\\sqrt{2x + 3} + \\sqrt{2x}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(e1, DOWN, buff=0.65)
        self.play(FadeIn(e2[0], shift=0.2 * UP))
        self.play(FadeIn(e2[1], shift=0.2 * UP))
        self.play(FadeIn(e2[2], shift=0.2 * UP))
        self.hold()
        self.say("Fíjate: el resultado ya no tiene denominador. Racionalizar a veces simplifica "
                 "mucho más de lo que parece.", wait=True)
        self.end_section()


class S06_Cubica(MBScene):
    def construct(self):
        self.mark("Raíz cúbica en el denominador")
        self.set_header(R"a^3 - b^3", "Diferencia de cubos", ORANGE, PEACH)
        self.say("¿Y si abajo hay raíz cúbica de 2 menos 1? El conjugado no sirve, porque "
                 "necesitamos cubos, no cuadrados. Usamos la diferencia de cubos: a menos b, por a al cuadrado más ab más b al cuadrado, es a al cubo menos b al cubo.", fox=True)
        rule = M(R"(a - b)(a^{2} + ab + b^{2}) = a^{3} - b^{3}", size=40).move_to(4.0 * UP)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold()
        self.say("Con a igual a raíz cúbica de 2 y b igual a 1: multiplico arriba y abajo por raíz "
                 "cúbica de 4 más raíz cúbica de 2 más 1. Abajo queda 2 menos 1: uno.")
        e = VGroup(
            M(R"\dfrac{1}{\sqrt[3]{2} - 1} \cdot \dfrac{\sqrt[3]{4} + \sqrt[3]{2} + 1}{\sqrt[3]{4} + \sqrt[3]{2} + 1}", size=36),
            M(R"= \dfrac{\sqrt[3]{4} + \sqrt[3]{2} + 1}{(\sqrt[3]{2})^{3} - 1^{3}} = \dfrac{\sqrt[3]{4} + \sqrt[3]{2} + 1}{2 - 1}", size=32),
            M(R"= \sqrt[3]{4} + \sqrt[3]{2} + 1", size=42, t2c={"\\sqrt[3]{4} + \\sqrt[3]{2} + 1": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(rule, DOWN, buff=0.6)
        self.play(FadeIn(e[0], shift=0.2 * UP))
        self.play(FadeIn(e[1], shift=0.2 * UP))
        self.play(FadeIn(e[2], shift=0.2 * UP))
        self.hold()
        self.say("Resumen de racionalizar: un radical solo, multiplica por lo que complete la "
                 "potencia; una suma con raíz cuadrada, por el conjugado; una resta con raíz cúbica, por el trinomio de la diferencia de cubos.")
        summary = VGroup(
            get_card_text(["√a solo", "× √a / √a"], size=24, fill=P_Z, border=C_Z, width=2.2),
            get_card_text(["a ± √b", "× conjugado"], size=24, fill=P_I, border=C_I, width=2.2),
            get_card_text(["∛a − b", "× (a² + ab + b²)"], size=24, fill=PEACH, border=ORANGE, width=2.2),
        ).arrange(RIGHT, buff=0.15).next_to(e, DOWN, buff=0.6)
        summary.set_max_width(LINE_WIDTH)
        self.play(LaggedStartMap(FadeIn, summary, shift=0.2 * UP, lag_ratio=0.25))
        self.hold(0.5)
        self.end_section()


class S07_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["Partir", "√(ab) = √a √b, nunca en sumas"], size=26, fill=P_Q, border=C_Q, width=6.8),
            get_card_text(["Simplificar", "primos por parejas (o tríos) salen del radical"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["Sumar", "solo radicales semejantes: 6√2 + 15√2 − 3√2"], size=26, fill=P_R, border=C_R, width=6.8),
            get_card_text(["Racionalizar", "× la raíz · × el conjugado · × el trinomio de cubos"], size=26, fill=P_I, border=C_I, width=6.8),
        ).arrange(DOWN, buff=0.35).move_to(1.5 * UP)
        badges[0][1][0].set_color(C_Q); badges[1][1][0].set_color(C_N); badges[2][1][0].set_color(C_R); badges[3][1][0].set_color(C_I)
        self.say("Repasemos: los radicales se parten en productos; se simplifican sacando parejas "
                 "de primos; se suman solo si son semejantes; y se racionaliza multiplicando por la raíz, el conjugado o el trinomio de cubos.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2.2)
        self.hold(0.5)
        self.say("En los ejercicios vas a sacar fichas del radical, unir cada fracción con su forma "
                 "racionalizada y ordenar los pasos.", wait=True)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\nsaca factores del radical,\nune las parejas y ordena los pasos", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
