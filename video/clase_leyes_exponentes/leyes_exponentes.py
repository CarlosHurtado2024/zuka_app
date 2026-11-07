"""
Clase 9: Leyes de los exponentes, en dos partes (vertical 9:16, tema Zuka).

Parte 1: las leyes contando factores (producto, cociente, potencia de potencia, de un producto y de
un cociente) con ejemplos detallados. Parte 2: exponentes negativos, simplificar expresiones con
literales y con n, y notación científica. Sin voz ni subtítulos ni preguntas al espectador.
Contenido: Manual de la UdeA, §1.4 (proposición 1.5) y problemas tipo 1.9, 1.10, 1.16.

    manimgl leyes_exponentes.py S01_Producto -w
    python build.py
"""
from mb_common import *

TOPIC_TITLE = "Leyes de los exponentes"


def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


def get_factor_boxes(base, n, color=C_Z, size=34, box=0.62):
    items = []
    for k in range(n):
        b = RoundedRectangle(width=box, height=box, corner_radius=0.12).set_fill(CARD, 1).set_stroke(color, 2.5)
        lab = M(str(base), size=size, color=INK).move_to(b)
        items.append(VGroup(b, lab))
        if k < n - 1:
            items.append(M(R"\cdot", size=size, color=MUTED))
    return VGroup(*items).arrange(RIGHT, buff=0.1)


class S00_Portada(MBScene):
    part_tag = "Clase 9 · Parte 1"
    part_subtitle = "Las leyes salen de contar factores"
    slide_title = "Portada · Parte 1"
    title_text = "Leyes de los exponentes"

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


# ===========================================================================
# PARTE 1
# ===========================================================================
class S01_Producto(MBScene):
    def construct(self):
        self.mark("Multiplicar potencias")
        self.set_header(R"a^m a^n", "Multiplicar potencias", C_N, P_N)
        self.say("No hace falta memorizar las leyes de los exponentes: todas salen de contar "
                 "factores. Empecemos multiplicando a al cubo por a a la cuarta.", fox=True)
        left = get_factor_boxes("a", 3, color=C_N).move_to(np.array([-1.9, 3.8, 0]))
        times = M(R"\cdot", size=40, color=MUTED).move_to(np.array([0.0, 3.8, 0]))
        right = get_factor_boxes("a", 4, color=C_Z).move_to(np.array([1.9, 3.8, 0]))
        VGroup(left, times, right).arrange(RIGHT, buff=0.25).move_to(3.8 * UP).set_max_width(LINE_WIDTH)
        labs = VGroup(M(R"a^3", size=34, color=C_N).next_to(left, UP, buff=0.12), M(R"a^4", size=34, color=C_Z).next_to(right, UP, buff=0.12))
        self.play(FadeIn(left), FadeIn(labs[0]))
        self.play(FadeIn(times), FadeIn(right), FadeIn(labs[1]))
        self.hold()
        self.say("A la izquierda hay tres factores a; a la derecha, cuatro. Juntos son siete "
                 "factores a: a a la séptima. Tres más cuatro.")
        total = get_factor_boxes("a", 7, color=C_Q, box=0.56, size=30).move_to(2.2 * UP).set_max_width(LINE_WIDTH)
        self.play(TransformFromCopy(VGroup(left, right), total))
        res = M(R"a^{3} \cdot a^{4} = a^{3 + 4} = a^{7}", size=46, t2c={"a^{7}": C_Q}).next_to(total, DOWN, buff=0.4)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.hold()
        self.say("Primera ley: para multiplicar potencias de la misma base se suman los "
                 "exponentes. La base no cambia: no multiplicamos las bases, contamos factores.")
        law = get_card_text(["aᵐ · aⁿ = aᵐ⁺ⁿ", "misma base: se suman los exponentes"], size=28, fill=P_N, border=C_N, width=6.6).next_to(res, DOWN, buff=0.5)
        self.play(FadeIn(law, shift=0.2 * UP))
        self.hold()
        self.say("Ejemplo con números: 2 al cubo por 2 a la quinta. No es 4 a la octava: es 2 a la "
                 "octava, que vale 256. Compruébalo: 8 por 32 son 256.")
        ex = VGroup(
            M(R"2^{3} \cdot 2^{5} = 2^{8} = 256", size=42, t2c={"2^{8}": C_Q}),
            M(R"8 \cdot 32 = 256 \;\checkmark \qquad\quad 4^{8} = 65\,536 \;\times", size=32, color=MUTED),
        ).arrange(DOWN, buff=0.25).next_to(law, DOWN, buff=0.5)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.play(FadeIn(ex[1], shift=0.2 * UP))
        self.hold()
        self.say("Y con letras y coeficientes: 3x al cuadrado por 2x a la quinta. Los números se "
                 "multiplican, 6, y las x se cuentan: dos más cinco, x a la séptima.")
        ex2 = M(R"(3x^{2})(2x^{5}) = 6x^{2 + 5} = 6x^{7}", size=42, t2c={"6x^{7}": C_Q}).next_to(ex, DOWN, buff=0.5)
        self.play(FadeIn(ex2, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S02_Cociente(MBScene):
    def construct(self):
        self.mark("Dividir potencias")
        self.set_header(R"\tfrac{a^m}{a^n}", "Dividir potencias", C_Z, P_Z)
        self.say("Dividir también se cuenta. y a la séptima entre y al cubo: arriba siete factores, "
                 "abajo tres. Cada y de abajo cancela una de arriba.", fox=True)
        top = get_factor_boxes("y", 7, color=C_Z, box=0.56, size=30).move_to(4.0 * UP).set_max_width(LINE_WIDTH - 0.6)
        bar = Line(LEFT, RIGHT).set_width(top.get_width() + 0.3).set_stroke(INK, 3).next_to(top, DOWN, buff=0.18)
        bot = get_factor_boxes("y", 3, color=C_I, box=0.56, size=30).next_to(bar, DOWN, buff=0.18)
        self.play(FadeIn(top), ShowCreation(bar), FadeIn(bot))
        self.hold()
        self.say("Se cancelan tres parejas y quedan cuatro factores arriba: y a la cuarta. Siete "
                 "menos tres.")
        strikes = VGroup()
        for k in range(3):
            for grp in (top, bot):
                box = grp[2 * k]
                strikes.add(Line(box.get_corner(DL), box.get_corner(UR)).set_stroke(C_I, 4))
        self.play(LaggedStartMap(ShowCreation, strikes, lag_ratio=0.15), run_time=1.5)
        res = M(R"\dfrac{y^{7}}{y^{3}} = y^{7 - 3} = y^{4}", size=46, t2c={"y^{4}": C_Q}).next_to(bot, DOWN, buff=0.5)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.hold()
        self.say("Segunda ley: para dividir potencias de la misma base se restan los exponentes, "
                 "el de arriba menos el de abajo.")
        law = get_card_text(["aᵐ / aⁿ = aᵐ⁻ⁿ", "misma base: se restan los exponentes"], size=28, fill=P_Z, border=C_Z, width=6.6).next_to(res, DOWN, buff=0.45)
        self.play(FadeIn(law, shift=0.2 * UP))
        self.hold()
        self.say("¿Y si abajo hay más? 5 al cuadrado entre 5 a la quinta: se cancelan dos "
                 "parejas y sobran tres factores abajo: 1 sobre 5 al cubo. La ley dice 5 a la menos 3: ¡es lo mismo!")
        ex = VGroup(
            M(R"\dfrac{5^{2}}{5^{5}} = \dfrac{1}{5^{3}} = \dfrac{1}{125}", size=40),
            M(R"\dfrac{5^{2}}{5^{5}} = 5^{2 - 5} = 5^{-3} = \dfrac{1}{125} \;\checkmark", size=40, t2c={"5^{-3}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(law, DOWN, buff=0.5)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.play(FadeIn(ex[1], shift=0.2 * UP))
        self.hold()
        self.say("Los exponentes negativos de la clase pasada son exactamente esto: lo que sobra "
                 "en el denominador.", wait=True)
        self.end_section()


class S03_PotenciaDePotencia(MBScene):
    def construct(self):
        self.mark("Potencia de potencia")
        self.set_header(R"(a^m)^n", "Potencia de potencia", C_Q, P_Q)
        self.say("Tercera ley. a al cuadrado, elevado al cubo. El cubo dice «tres veces a al "
                 "cuadrado»: dos a por dos a por dos a. Seis factores: dos por tres.", fox=True)
        groups = VGroup(*(get_factor_boxes("a", 2, color=C_Q, box=0.56, size=30) for _ in range(3)))
        for g in groups:
            g.add(SurroundingRectangle(g, color=C_Q, buff=0.08, corner_radius=0.1).set_stroke(C_Q, 1.5))
        groups.arrange(RIGHT, buff=0.3).move_to(4.0 * UP).set_max_width(LINE_WIDTH)
        labs = VGroup(*(M(R"a^{2}", size=28, color=C_Q).next_to(g, UP, buff=0.1) for g in groups))
        self.play(LaggedStartMap(FadeIn, groups, lag_ratio=0.3), FadeIn(labs))
        res = M(R"(a^{2})^{3} = a^{2 \cdot 3} = a^{6}", size=46, t2c={"a^{6}": C_Q}).next_to(groups, DOWN, buff=0.55)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.hold()
        self.say("Potencia de una potencia: se multiplican los exponentes. Y si adentro hay un "
                 "producto, el exponente le toca a cada factor; si hay un cociente, a arriba y abajo.")
        laws = VGroup(
            get_card_text(["(aᵐ)ⁿ = aᵐⁿ", "se multiplican"], size=26, fill=P_Q, border=C_Q, width=2.2),
            get_card_text(["(ab)ⁿ = aⁿbⁿ", "a cada factor"], size=26, fill=P_Q, border=C_Q, width=2.2),
            get_card_text(["(a/b)ⁿ = aⁿ/bⁿ", "arriba y abajo"], size=26, fill=P_Q, border=C_Q, width=2.2),
        ).arrange(RIGHT, buff=0.15).next_to(res, DOWN, buff=0.5)
        laws.set_max_width(LINE_WIDTH)
        self.play(LaggedStartMap(FadeIn, laws, shift=0.2 * UP, lag_ratio=0.25))
        self.hold()
        self.say("Ejemplo: 2x al cubo, con paréntesis. El cubo le toca al 2 y a la x: 8 x al "
                 "cubo. Sin paréntesis, 2 x al cubo, el 2 queda solo. ¡Distintos!")
        ex = VGroup(
            M(R"(2x)^{3} = 2^{3} x^{3} = 8x^{3}", size=40, t2c={"8x^{3}": C_Q}),
            M(R"2x^{3} \ne (2x)^{3}", size=36, color=MUTED),
        ).arrange(DOWN, buff=0.25).next_to(laws, DOWN, buff=0.5)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.play(FadeIn(ex[1], shift=0.2 * UP))
        self.hold()
        self.say("Otro: x al cuadrado por y, todo a la cuarta. La x queda a la ocho, dos por "
                 "cuatro, y la y a la cuatro.")
        ex2 = M(R"(x^{2}y)^{4} = x^{8}\,y^{4}", size=42, t2c={"x^{8}\\,y^{4}": C_Q}).next_to(ex, DOWN, buff=0.45)
        self.play(FadeIn(ex2, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_EjemplosParte1(MBScene):
    def construct(self):
        self.mark("Ejemplo: exponentes con n")
        self.set_header(R"\checkmark", "Ejemplos resueltos", ORANGE, PEACH)
        self.say("Ahora las leyes con exponentes que llevan letras. 5 a la n más 1, entre 5 a la "
                 "n menos 1. Misma base: se restan los exponentes.", fox=True)
        e1 = VGroup(
            M(R"\dfrac{5^{\,n + 1}}{5^{\,n - 1}} = 5^{(n + 1) - (n - 1)}", size=42),
            M(R"= 5^{\,n + 1 - n + 1} = 5^{2} = 25", size=42, t2c={"25": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(3.5 * UP)
        self.play(FadeIn(e1[0], shift=0.2 * UP))
        self.say("Cuidado con el paréntesis al restar: n más 1 menos n más 1. Las n se van y "
                 "queda 2: 5 al cuadrado, 25, sea cual sea n.")
        self.play(FadeIn(e1[1], shift=0.2 * UP))
        self.hold()
        self.end_section()

        self.mark("Ejemplo: factor común")
        self.say("Segundo: 3 a la n más 2, menos 3 a la n. No se pueden restar exponentes aquí, "
                 "porque es una resta de potencias, no un cociente. El truco es sacar factor común.")
        e2 = VGroup(
            M(R"3^{\,n + 2} - 3^{\,n} = 3^{\,n} \cdot 3^{2} - 3^{\,n}", size=40),
            M(R"= 3^{\,n}(9 - 1) = 8 \cdot 3^{\,n}", size=40, t2c={"8 \\cdot 3^{\\,n}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(e1, DOWN, buff=0.7)
        self.play(FadeIn(e2[0], shift=0.2 * UP))
        self.say("3 a la n más 2 es 3 a la n por 3 al cuadrado, por la primera ley al revés. "
                 "Sale 3 a la n y adentro queda 9 menos 1: ocho por 3 a la n.")
        self.play(FadeIn(e2[1], shift=0.2 * UP))
        self.hold()
        self.end_section()

        self.mark("Ejemplo: bases distintas que no lo son")
        self.say("Tercero: 4 a la x por 8 entre 2 a la 3x. Parece que las bases son distintas, "
                 "pero 4 y 8 son potencias de 2. Reescribe todo en base 2.")
        e3 = VGroup(
            M(R"\dfrac{4^{x} \cdot 8}{2^{3x}} = \dfrac{(2^{2})^{x} \cdot 2^{3}}{2^{3x}}", size=38),
            M(R"= \dfrac{2^{2x} \cdot 2^{3}}{2^{3x}} = 2^{2x + 3 - 3x} = 2^{3 - x}", size=38, t2c={"2^{3 - x}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(e2, DOWN, buff=0.7)
        self.play(FadeIn(e3[0], shift=0.2 * UP))
        self.say("4 a la x es 2 a la 2x; 8 es 2 al cubo. Arriba se suman: 2x más 3. Abajo 3x se "
                 "resta. Queda 2 a la 3 menos x. Primero mismas bases, después las leyes.")
        self.play(FadeIn(e3[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_CierreParte1(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["Multiplicar", "aᵐ · aⁿ = aᵐ⁺ⁿ  (se cuentan los factores)"], size=26, fill=P_N, border=C_N, width=6.8),
            get_card_text(["Dividir", "aᵐ / aⁿ = aᵐ⁻ⁿ  (se cancelan parejas)"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["Potencia de potencia", "(aᵐ)ⁿ = aᵐⁿ · (ab)ⁿ = aⁿbⁿ · (a/b)ⁿ = aⁿ/bⁿ"], size=24, fill=P_Q, border=C_Q, width=6.8),
        ).arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        badges[0][1][0].set_color(C_N); badges[1][1][0].set_color(C_Z); badges[2][1][0].set_color(C_Q)
        self.say("Repasemos la parte 1: multiplicar suma exponentes, dividir los resta, elevar los "
                 "multiplica, y con bases distintas primero se igualan las bases.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)
        self.say("En la parte 2 vienen los exponentes negativos con letras y la notación científica.", wait=True)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("Sigue la parte 2", size=52, color=INK)
        nxt = T("Exponentes negativos,\nsimplificar con letras\ny notación científica", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)


# ===========================================================================
# PARTE 2
# ===========================================================================
class S10_Portada(S00_Portada):
    part_tag = "Clase 9 · Parte 2"
    part_subtitle = "Exponentes negativos, simplificar y notación científica"
    slide_title = "Portada · Parte 2"


class S11_Negativos(MBScene):
    def construct(self):
        self.mark("Exponentes negativos")
        self.set_header(R"a^{-n}", "Exponentes negativos", C_I, P_I)
        self.say("Un exponente negativo es un cambio de piso: la potencia baja al denominador y se "
                 "vuelve positiva. Y si ya estaba abajo, sube.", fox=True)
        rule = VGroup(
            M(R"a^{-n} = \dfrac{1}{a^{n}} \qquad\quad \dfrac{1}{a^{-n}} = a^{n}", size=44),
            M(R"\dfrac{a^{-m}}{b^{-n}} = \dfrac{b^{n}}{a^{m}}", size=44, color=C_I),
        ).arrange(DOWN, buff=0.4).move_to(3.6 * UP)
        self.play(FadeIn(rule[0], shift=0.2 * UP))
        self.play(FadeIn(rule[1], shift=0.2 * UP))
        self.hold()
        self.say("Ejemplo: x a la menos 2 sobre y a la menos 3. La x baja como x al cuadrado y la y "
                 "sube como y al cubo: y al cubo sobre x al cuadrado. Solo cambian de piso los factores con exponente negativo.")
        ex = M(R"\dfrac{x^{-2}}{y^{-3}} = \dfrac{y^{3}}{x^{2}}", size=46, t2c={"\\dfrac{y^{3}}{x^{2}}": C_Q}).next_to(rule, DOWN, buff=0.6)
        self.play(FadeIn(ex, shift=0.2 * UP))
        self.hold()
        self.say("Una fracción a un exponente negativo se voltea: dos quintos a la menos 3 es "
                 "cinco medios al cubo, 125 octavos.")
        ex2 = M(R"\left(\tfrac25\right)^{-3} = \left(\tfrac52\right)^{3} = \tfrac{125}{8}", size=44, t2c={"\\tfrac{125}{8}": C_Q}).next_to(ex, DOWN, buff=0.55)
        self.play(FadeIn(ex2, shift=0.2 * UP))
        self.hold()
        self.say("Y ojo: el exponente negativo solo toca lo que tiene pegado. En 3 x a la menos 1, "
                 "baja la x, no el 3: tres sobre x.")
        warn = M(R"3x^{-1} = \dfrac{3}{x} \qquad (3x)^{-1} = \dfrac{1}{3x}", size=40, color=MUTED).next_to(ex2, DOWN, buff=0.55)
        self.play(FadeIn(warn, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S12_Simplificar(MBScene):
    def construct(self):
        self.mark("Ejemplo: paréntesis con negativos")
        self.set_header(R"\checkmark", "Simplificar", C_Q, P_Q)
        self.say("Simplifiquemos 3 x a la menos 2 por y, todo a la menos 2. El exponente de afuera "
                 "le toca a cada factor, multiplicando exponentes.", fox=True)
        e1 = VGroup(
            M(R"(3x^{-2}y)^{-2} = 3^{-2} \cdot x^{(-2)(-2)} \cdot y^{-2}", size=36),
            M(R"= 3^{-2}\,x^{4}\,y^{-2} = \dfrac{x^{4}}{3^{2} y^{2}} = \dfrac{x^{4}}{9y^{2}}", size=38, t2c={"\\dfrac{x^{4}}{9y^{2}}": C_Q}),
        ).arrange(DOWN, buff=0.3).move_to(3.4 * UP)
        self.play(FadeIn(e1[0], shift=0.2 * UP))
        self.say("3 a la menos 2, x a la menos 2 por menos 2, que es x a la cuarta, y y a la "
                 "menos 2. Los negativos bajan: x a la cuarta sobre 9 y al cuadrado.")
        self.play(FadeIn(e1[1], shift=0.2 * UP))
        self.hold()
        self.end_section()

        self.mark("Ejemplo: una fracción grande")
        self.say("Segundo, uno de examen: x a la menos 3 por y al cuadrado, a la menos 4, entre y "
                 "a la sexta por x a la menos 4, a la menos 2. Paso a paso: primero los paréntesis.")
        e2 = VGroup(
            M(R"\dfrac{(x^{-3}y^{2})^{-4}}{(y^{6}x^{-4})^{-2}} = \dfrac{x^{12}\,y^{-8}}{y^{-12}\,x^{8}}", size=36),
            M(R"= x^{12 - 8}\, y^{-8 - (-12)} = x^{4}\,y^{4}", size=38, t2c={"x^{4}\\,y^{4}": C_Q}),
        ).arrange(DOWN, buff=0.3).next_to(e1, DOWN, buff=0.7)
        self.play(FadeIn(e2[0], shift=0.2 * UP))
        self.say("Arriba: menos 3 por menos 4 es 12; 2 por menos 4 es menos 8. Abajo: 6 por "
                 "menos 2 es menos 12; menos 4 por menos 2 es 8. Ahora dividimos: se restan exponentes.")
        self.play(FadeIn(e2[1], shift=0.2 * UP))
        self.say("x: 12 menos 8, cuatro. y: menos 8 menos menos 12, que es menos 8 más 12, cuatro. "
                 "Resultado: x a la cuarta por y a la cuarta.")
        self.hold()
        self.end_section()

        self.mark("Ejemplo: 9 y 3")
        self.say("Tercero: 9 a la n entre 3 a la n. Nueve es 3 al cuadrado, así que 9 a la n es 3 "
                 "a la 2n. Y 3 a la 2n entre 3 a la n es 3 a la n.")
        e3 = M(R"\dfrac{9^{\,n}}{3^{\,n}} = \dfrac{(3^{2})^{n}}{3^{\,n}} = \dfrac{3^{2n}}{3^{\,n}} = 3^{\,n}", size=40, t2c={"= 3^{\\,n}": C_Q}).next_to(e2, DOWN, buff=0.7)
        self.play(FadeIn(e3, shift=0.2 * UP))
        self.say("Otra forma de verlo: 9 entre 3 es 3, y eso elevado a la n. Los dos caminos "
                 "llegan al mismo sitio.")
        alt = M(R"\dfrac{9^{\,n}}{3^{\,n}} = \left(\tfrac93\right)^{n} = 3^{\,n} \;\checkmark", size=34, color=MUTED).next_to(e3, DOWN, buff=0.4)
        self.play(FadeIn(alt, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S13_Cientifica(MBScene):
    def construct(self):
        self.mark("Notación científica")
        self.set_header(R"\times 10^{n}", "Notación científica", C_R, P_R)
        self.say("Las potencias de 10 sirven para escribir números enormes o diminutos. La luz "
                 "recorre unos 300.000.000 de metros por segundo: 3 por 10 a la octava.", fox=True)
        big = VGroup(
            M(R"300\,000\,000 = 3 \times 10^{8}", size=42, t2c={"10^{8}": C_R}),
            T("8 lugares: la coma viaja 8 puestos a la izquierda", size=24, color=MUTED),
        ).arrange(DOWN, buff=0.2).move_to(3.9 * UP)
        self.play(FadeIn(big, shift=0.2 * UP))
        self.hold()
        self.say("Un virus mide unos 0,00000012 metros: 1,2 por 10 a la menos 7. El exponente "
                 "negativo dice cuántos lugares corrió la coma hacia la derecha.")
        small = VGroup(
            M(R"0{,}00000012 = 1{,}2 \times 10^{-7}", size=42, t2c={"10^{-7}": C_R}),
            T("7 lugares a la derecha: el exponente es negativo", size=24, color=MUTED),
        ).arrange(DOWN, buff=0.2).next_to(big, DOWN, buff=0.6)
        self.play(FadeIn(small, shift=0.2 * UP))
        self.hold()
        self.say("La forma estándar es un número entre 1 y 10, por una potencia de 10. Y con las "
                 "leyes de hoy se opera fácil: 3 por 10 a la 8, por 2 por 10 a la menos 7.")
        rule = get_card_text(["a × 10ⁿ  con  1 ≤ a < 10", "los exponentes se suman al multiplicar"], size=26, fill=P_R, border=C_R, width=6.6).next_to(small, DOWN, buff=0.55)
        self.play(FadeIn(rule, shift=0.2 * UP))
        ex = VGroup(
            M(R"(3 \times 10^{8})(2 \times 10^{-7}) = 6 \times 10^{8 + (-7)}", size=36),
            M(R"= 6 \times 10^{1} = 60", size=40, t2c={"60": C_Q}),
        ).arrange(DOWN, buff=0.25).next_to(rule, DOWN, buff=0.5)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.play(FadeIn(ex[1], shift=0.2 * UP))
        self.hold()
        self.say("Multiplicas los números de adelante, 6, y sumas los exponentes: 8 menos 7, uno. "
                 "Sesenta.", wait=True)
        self.end_section()


class S14_CierreParte2(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["Negativo = cambio de piso", "a⁻ⁿ = 1/aⁿ · (a/b)⁻ⁿ = (b/a)ⁿ"], size=26, fill=P_I, border=C_I, width=6.8),
            get_card_text(["Simplificar", "paréntesis primero, luego sumar o restar exponentes"], size=26, fill=P_Q, border=C_Q, width=6.8),
            get_card_text(["Notación científica", "a × 10ⁿ con 1 ≤ a < 10"], size=26, fill=P_R, border=C_R, width=6.8),
        ).arrange(DOWN, buff=0.4).move_to(1.8 * UP)
        badges[0][1][0].set_color(C_I); badges[1][1][0].set_color(C_Q); badges[2][1][0].set_color(C_R)
        self.say("Repasemos: el exponente negativo cambia de piso lo que tiene pegado; para "
                 "simplificar, primero los paréntesis y luego las leyes; y la notación científica usa potencias de 10.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2)
        self.hold(0.5)
        self.say("Ahora, a los ejercicios: une cada expresión con su forma simplificada y ordena "
                 "los pasos.", wait=True)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\nune las parejas, ordena los pasos\ny caza las leyes falsas", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
