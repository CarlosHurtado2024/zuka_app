"""
Álgebra F2 · Consecuencias de los axiomas: restar, dividir y los signos (lección alg-12c, parte 2 de axiomas, 9:16).

Desde lo básico y sin zoom ni 3D: restar es sumar el opuesto (9 − 4 y 3 − (−6) en la recta); dividir es multiplicar
por el recíproco (12 ÷ 3 con puntos, (2/5) ÷ (3/4)); no se divide entre 0 porque 0 no tiene recíproco; a · 0 = 0
(cinco cajas vacías y la prueba con neutro, distributiva e inverso); ley de signos con el patrón de la tabla del 3 y
el espejo del cero; ley cancelativa con una balanza (7 + x = 7 + 2, 4x = 4 · 9; el 0 no se cancela: 0 · 2 = 0 · 5);
producto cero. Spec 2026-11-11-axiomas-desde-cero.

    manimgl consecuencias.py S04_Signos -w -l
"""
from alg_fx import *


def jump(line, a, b, color, up=0.5):
    return CurvedArrow(line.n2p(a) + 0.2 * UP, line.n2p(b) + 0.2 * UP, angle=-PI / 2.4 if b > a else PI / 2.4).set_color(color)


def stack(*mobs, buff=0.4):
    return VGroup(*mobs).arrange(DOWN, buff=buff)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Axiomas · Parte 2"
    title = "Restar, dividir\ny los signos"
    subtitle = "Consecuencias de los axiomas"


class S01_Resta(MBScene):
    def construct(self):
        self.mark("Restar es sumar el opuesto")
        self.set_header(R"a-b", "Restar", SKY, P_SKY)
        self.say("Los axiomas solo hablan de sumar y de multiplicar. ¿Y restar? Restar es sumar el opuesto.", fox=True)
        line = get_number_line((0, 10, 1), width=7.0).move_to(3.8 * UP)
        self.play(ShowCreation(line))
        p = Dot(line.n2p(9), radius=0.13).set_fill(HONEY, 1)
        self.play(GrowFromCenter(p))
        self.say("Nueve menos cuatro: desde el nueve damos cuatro pasos hacia la izquierda, que es lo mismo que sumar menos cuatro. Llegamos al cinco.")
        arr = jump(line, 9, 5, SKY)
        self.play(ShowCreation(arr), p.animate.move_to(line.n2p(5)), run_time=1.4)
        e = M(R"9 - 4 = 9 + (-4) = 5", size=50).move_to(2.2 * UP)
        self.play(Write(e))
        gen = M(R"a - b = a + (-b)", size=60, color=SKY).move_to(0.9 * UP)
        self.play(Write(gen))
        self.hold()
        self.say("Así se entiende restar un número negativo. Tres menos menos seis es tres más el opuesto de menos seis, que es seis. Como en un ascensor: quitar seis pisos de sótano es subir seis.")
        line2 = get_number_line((-2, 10, 1), width=7.0).move_to(1.0 * DOWN)
        q = Dot(line2.n2p(3), radius=0.13).set_fill(HONEY, 1)
        self.play(ShowCreation(line2), GrowFromCenter(q))
        arr2 = jump(line2, 3, 9, MINT)
        self.play(ShowCreation(arr2), q.animate.move_to(line2.n2p(9)), run_time=1.4)
        e2 = M(R"3 - (-6) = 3 + 6 = 9", size=50, color=MINT).move_to(2.6 * DOWN)
        self.play(Write(e2))
        self.hold(0.6)
        self.end_section()


class S02_Division(MBScene):
    def construct(self):
        self.mark("Dividir es multiplicar por el recíproco")
        self.set_header(R"a \div b", "Dividir", MINT, P_MINT)
        self.say("Con la división pasa algo parecido: dividir es multiplicar por el recíproco. Doce entre tres es repartir doce en tres grupos iguales y tomar uno: es doce por un tercio.", fox=True)
        dots = VGroup(*[Dot(radius=0.13).set_fill(HONEY, 1) for _ in range(12)]).arrange(RIGHT, buff=0.2).move_to(4.2 * UP)
        self.play(FadeIn(dots))
        groups = VGroup(*[VGroup(*dots[4 * k:4 * k + 4]) for k in range(3)])
        self.play(groups.animate.arrange(RIGHT, buff=0.6).move_to(4.2 * UP))
        boxes = VGroup(*[SurroundingRectangle(g, buff=0.15).set_stroke(MINT, 2) for g in groups])
        self.play(ShowCreation(boxes))
        self.play(Indicate(groups[0], color=MINT))
        e = M(R"12 \div 3 = 12 \cdot \frac{1}{3} = 4", size=50).move_to(2.6 * UP)
        self.play(Write(e))
        gen = M(R"a \div b = a \cdot \frac{1}{b} \qquad (b \neq 0)", size=50, color=MINT).move_to(1.1 * UP)
        self.play(Write(gen))
        self.hold()
        self.say("Por eso, para dividir fracciones, se voltea la segunda y se multiplica: dos quintos entre tres cuartos es dos quintos por cuatro tercios, ocho quinceavos.")
        f = stack(
            M(R"\frac{2}{5} \div \frac{3}{4}", size=50),
            M(R"= \frac{2}{5} \cdot \frac{4}{3}", size=50, color=MINT),
            M(R"= \frac{8}{15}", size=50, color=MINT),
        ).move_to(1.3 * DOWN)
        for x in f:
            self.play(FadeIn(x, shift=0.2 * DOWN), run_time=0.8)
        self.hold()
        self.say("¿Y por qué no se puede dividir entre cero? Porque sería multiplicar por el recíproco del cero, y el cero no tiene recíproco: no hay número que multiplicado por cero dé uno.")
        z = M(R"7 \div 0 = 7 \cdot \frac{1}{0}", size=48, color=CORAL).move_to(4.4 * DOWN)
        self.play(Write(z))
        self.play(ShowCreation(Cross(z[-3:]).set_stroke(CORAL, 6)))
        self.hold(0.6)
        self.end_section()


class S03_PorCero(MBScene):
    def construct(self):
        self.mark("Todo número por cero da cero")
        self.set_header(R"a \cdot 0", "Por cero", HONEY, P_HONEY)
        self.say("Cinco cajas con cero dulces cada una: en total, cero dulces. Cualquier número multiplicado por cero da cero.", fox=True)
        boxes = VGroup(*[Square(0.9).set_stroke(HONEY, 3) for _ in range(5)]).arrange(RIGHT, buff=0.25).move_to(4.2 * UP)
        self.play(LaggedStartMap(ShowCreation, boxes, lag_ratio=0.2))
        e = M(R"5 \cdot 0 = 0 \qquad a \cdot 0 = 0", size=52, color=HONEY).move_to(2.9 * UP)
        self.play(Write(e))
        self.hold()
        self.say("No hace falta aceptarlo como una regla nueva: sale de los axiomas. Empecemos con el neutro: cero es lo mismo que cero más cero.")
        steps = [
            (R"a \cdot 0 = a \cdot (0 + 0)", "neutro: 0 = 0 + 0", HONEY),
            (R"a \cdot 0 = a \cdot 0 + a \cdot 0", "distributiva", LAV),
            (R"0 = a \cdot 0", "sumamos el opuesto de a · 0\na los dos lados (inverso y neutro)", MINT),
        ]
        says = [
            "",
            "Repartimos la a con la distributiva: queda a por cero, más a por cero.",
            "Ahora sumamos a los dos lados el opuesto de a por cero. A la izquierda queda cero, y a la derecha queda a por cero. Listo: a por cero es cero.",
        ]
        rows = VGroup()
        y = 1.4
        for (tex, why, col), s in zip(steps, says):
            if s:
                self.say(s)
            m = M(tex, size=46, color=INK).move_to(y * UP)
            w = T(why, size=24, color=col, alignment="CENTER").next_to(m, DOWN, buff=0.15)
            self.play(Write(m), FadeIn(w))
            rows.add(VGroup(m, w))
            self.hold()
            y -= 1.75
        box = SurroundingRectangle(rows[-1][0], buff=0.15).set_stroke(MINT, 3)
        self.play(ShowCreation(box))
        self.hold(0.6)
        self.end_section()


class S04_Signos(MBScene):
    def construct(self):
        self.mark("¿Por qué menos por menos da más?")
        self.set_header(R"(-a)(-b)", "Signos", PINK, P_PINK)
        self.say("¿Por qué menos por menos da más? Miremos un patrón con la tabla del tres. Cada vez que el segundo factor baja uno, el resultado baja tres.", fox=True)
        left = VGroup(*[M(t, size=40) for t in [R"3 \cdot 2 = 6", R"3 \cdot 1 = 3", R"3 \cdot 0 = 0", R"3 \cdot (-1) = -3", R"3 \cdot (-2) = -6"]])
        left.arrange(DOWN, buff=0.3, aligned_edge=RIGHT).move_to(2.4 * UP + 1.9 * LEFT)
        for k, m in enumerate(left):
            if k >= 3:
                m.set_color(CORAL)
            self.play(FadeIn(m, shift=0.2 * DOWN), run_time=0.6)
        self.hold()
        self.say("Siguiendo el patrón, tres por menos uno da menos tres: positivo por negativo da negativo.")
        self.hold()
        self.say("Ahora con menos tres. Cada vez que el segundo factor baja uno, el resultado sube tres. Al pasar el cero, menos tres por menos uno da tres: negativo por negativo, positivo.")
        right = VGroup(*[M(t, size=40) for t in [R"(-3) \cdot 2 = -6", R"(-3) \cdot 1 = -3", R"(-3) \cdot 0 = 0", R"(-3)(-1) = 3", R"(-3)(-2) = 6"]])
        right.arrange(DOWN, buff=0.3, aligned_edge=RIGHT).move_to(2.4 * UP + 1.9 * RIGHT)
        VGroup(left, right).set_max_width(7.4)
        for k, m in enumerate(right):
            if k >= 3:
                m.set_color(MINT)
            self.play(FadeIn(m, shift=0.2 * DOWN), run_time=0.6)
        self.hold()
        self.end_section()
        self.clear_scene()
        self.mark("Dos reflejos devuelven al inicio")
        self.say("Otra forma de verlo: multiplicar por menos uno es reflejar en el espejo del cero, porque menos uno por a es el opuesto de a. Y dos reflejos devuelven al lugar del principio.", fox=True)
        line = get_number_line((-5, 5, 1), width=7.0).move_to(3.6 * UP)
        mirror = DashedLine(line.n2p(0) + 1.1 * UP, line.n2p(0) + 0.5 * DOWN).set_stroke(CORAL, 3)
        self.play(ShowCreation(line), ShowCreation(mirror))
        d = Dot(line.n2p(4), radius=0.14).set_fill(HONEY, 1)
        self.play(GrowFromCenter(d))
        self.play(d.animate.move_to(line.n2p(-4)), run_time=1.2)
        t1 = M(R"(-1) \cdot 4 = -4", size=44, color=SKY).move_to(2.2 * UP)
        self.play(FadeIn(t1))
        self.play(d.animate.move_to(line.n2p(4)), run_time=1.2)
        t2 = M(R"(-1)(-1) \cdot 4 = 4", size=44, color=MINT).move_to(1.2 * UP)
        self.play(FadeIn(t2))
        self.hold()
        rules = stack(
            M(R"(-1) \cdot a = -a", size=46, color=PINK),
            M(R"(-a) \cdot b = -(ab)", size=46, color=PINK),
            M(R"(-a)(-b) = ab", size=46, color=PINK),
        ).move_to(1.3 * DOWN)
        self.play(LaggedStartMap(FadeIn, rules, shift=0.2 * UP, lag_ratio=0.3), run_time=1.6)
        self.say("En resumen: cuenta los factores negativos. Si son una cantidad par, el resultado es positivo; si son impar, negativo.")
        card = note("Cantidad par de negativos: positivo\nCantidad impar de negativos: negativo", color=PINK, size=26).move_to(4.4 * DOWN)
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


def tile(txt, color=INK):
    t = M(txt, size=40, color=color)
    box = RoundedRectangle(max(1.0, t.get_width() + 0.4), 0.8, corner_radius=0.15).set_fill(CARD, 1).set_stroke(BORDER, 2)
    return VGroup(box, t.move_to(box))


class S05_Cancelativa(MBScene):
    def construct(self):
        self.mark("La balanza: ley cancelativa")
        self.set_header(R"a+b=a+c", "Cancelativa", LAV, P_LAV)
        self.say("Una igualdad es como una balanza en equilibrio. Si a los dos platillos les quitas lo mismo, sigue en equilibrio.", fox=True)
        beam = Line(3.4 * LEFT, 3.4 * RIGHT).set_stroke(MUTED, 6).move_to(2.6 * UP)
        base = Polygon(2.6 * UP, 2.0 * UP + 0.5 * LEFT, 2.0 * UP + 0.5 * RIGHT).set_fill(MUTED, 1).set_stroke(width=0)
        base.next_to(beam, DOWN, buff=0)
        L = VGroup(tile("7"), tile("x", MINT)).arrange(RIGHT, buff=0.2).next_to(beam.get_left(), UP, buff=0.1, aligned_edge=LEFT)
        R_ = VGroup(tile("7"), tile("2")).arrange(RIGHT, buff=0.2).next_to(beam.get_right(), UP, buff=0.1, aligned_edge=RIGHT)
        self.play(ShowCreation(beam), FadeIn(base), FadeIn(L), FadeIn(R_))
        e = M(R"7 + x = 7 + 2", size=50).move_to(0.9 * UP)
        self.play(Write(e))
        self.hold()
        self.say("Quitamos el siete de los dos lados. La balanza sigue igual, y queda x igual a dos.")
        self.play(L[0].animate.shift(0.8 * UP).set_opacity(0), R_[0].animate.shift(0.8 * UP).set_opacity(0), run_time=1.0)
        e2 = M(R"x = 2", size=56, color=MINT).move_to(0.9 * UP)
        self.play(Transform(e, e2))
        gen = M(R"a + b = a + c \;\Rightarrow\; b = c", size=50, color=LAV).move_to(0.4 * DOWN)
        self.play(Write(gen))
        self.hold()
        self.say("Con el producto igual: si cuatro por x es lo mismo que cuatro por nueve, entonces x es nueve.")
        p = M(R"4x = 4 \cdot 9 \;\Rightarrow\; x = 9", size=48).move_to(1.8 * DOWN)
        gp = M(R"ab = ac,\ a \neq 0 \;\Rightarrow\; b = c", size=48, color=LAV).move_to(3.0 * DOWN)
        self.play(Write(p))
        self.play(Write(gp))
        self.hold()
        self.say("Pero el factor que se cancela no puede ser cero. Cero por dos es igual a cero por cinco, y dos no es igual a cinco.")
        z = M(R"0 \cdot 2 = 0 \cdot 5 \quad \text{pero} \quad 2 \neq 5", size=44, color=CORAL).move_to(4.3 * DOWN)
        self.play(Write(z))
        self.hold(0.6)
        self.end_section()
        self.clear_scene()
        self.mark("Producto cero")
        self.say("Una última consecuencia, muy útil para resolver ecuaciones: si un producto da cero, al menos uno de los factores tiene que ser cero.", fox=True)
        r = M(R"a \cdot b = 0 \;\Rightarrow\; a = 0 \ \text{o}\ b = 0", size=52, color=HONEY).move_to(3.0 * UP)
        self.play(Write(r))
        self.hold()
        self.say("Si a no es cero, tiene recíproco. Multiplicamos los dos lados por uno sobre a, y queda b igual a cero. Por ejemplo, si siete por b da cero, b es cero.")
        s = stack(
            M(R"7 \cdot b = 0", size=50),
            M(R"\frac{1}{7} \cdot 7 \cdot b = \frac{1}{7} \cdot 0", size=50, color=LAV),
            M(R"b = 0", size=50, color=MINT),
        ).move_to(0.2 * DOWN)
        for x in s:
            self.play(FadeIn(x, shift=0.2 * DOWN), run_time=0.8)
        self.hold(0.6)
        self.end_section()


class S06_Cierre(AlgCierre):
    recap = [
        ("Restar", "a − b = a + (−b)", SKY),
        ("Dividir", "a ÷ b = a · (1/b), con b ≠ 0", MINT),
        ("Por cero", "a · 0 = 0: el 0 no tiene recíproco", HONEY),
        ("Signos", "(−a)(−b) = ab  ·  (−a)b = −(ab)", PINK),
        ("Cancelativa", "a + b = a + c ⇒ b = c", LAV),
        ("Con producto", "ab = ac y a ≠ 0 ⇒ b = c", LAV),
        ("Producto cero", "ab = 0 ⇒ a = 0 o b = 0", HONEY),
    ]
    recap_say = "Restar es sumar el opuesto, dividir es multiplicar por el recíproco, y de los axiomas salen la ley de los signos y la ley cancelativa."
    practice = "Arma productos con signo, equilibra balanzas y ordena una demostración"
