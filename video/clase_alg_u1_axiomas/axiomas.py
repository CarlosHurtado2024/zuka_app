"""
Álgebra A2 · Axiomas de campo y orden (lección alg-12b, un solo video, 9:16, fondo morado vivo).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Las reglas del juego de los reales:
conmutativa (barras que se cambian de lugar y un rectángulo 2 × 5 que gira en 3D), asociativa (una caja 3D de
2 × 3 × 4 que se rebana de dos maneras), neutros e inversos (saltos en la recta, la tira 5 × 1/5), distributiva
con áreas, por qué (−1)(−1) = 1 (zoom al paso clave), orden (sumar desliza, multiplicar por un negativo es un
espejo) y valor absoluto (la recta se dobla por el cero en 3D). Spec 2026-11-09-algebra-unidad-1-videos-y-juegos.

    manimgl axiomas.py S03_Asociativa -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 1"
    title = "Axiomas de campo\ny de orden"
    subtitle = "Las reglas del juego de los números reales"


class S01_Reglas(MBScene):
    def construct(self):
        self.mark("Las reglas del juego")
        self.set_header(R"\mathbb{R}", "Reglas del juego", LAV, P_LAV)
        self.say("Todo juego tiene reglas que se aceptan sin discutir: en el ajedrez, el alfil se mueve en diagonal y punto. En los números pasa lo mismo.", fox=True)
        board = VGroup(*[Square(0.62).set_fill(LAV if (i + j) % 2 else P_LAV, 1).set_stroke(width=0).move_to(np.array([(i - 3.5) * 0.62, (j - 3.5) * 0.62, 0])) for i in range(8) for j in range(8)])
        board.move_to(2.2 * UP)
        bishop = Circle(radius=0.22).set_fill(HONEY, 1).set_stroke(INK, 2).move_to(board[0].get_center())
        self.play(LaggedStartMap(FadeIn, board, lag_ratio=0.01), run_time=1.2)
        self.play(FadeIn(bishop, scale=0.5))
        self.play(bishop.animate.move_to(board[0].get_center() + 4 * 0.62 * (UP + RIGHT)), run_time=1.4)
        self.hold()
        self.say("Esas reglas de los números se llaman axiomas. Hay dos operaciones, la suma y la multiplicación, y con unas pocas reglas sale todo el álgebra.")
        ops = VGroup(formula_card(R"a + b", color=SKY), formula_card(R"a \cdot b", color=PINK)).arrange(RIGHT, buff=0.8).move_to(2.6 * DOWN)
        self.play(LaggedStartMap(FadeIn, ops, shift=0.3 * UP, lag_ratio=0.4))
        self.hold(0.5)
        self.end_section()


class S02_Conmutativa(MBScene):
    def construct(self):
        self.mark("Conmutativa")
        self.set_header(R"a + b = b + a", "Conmutativa", SKY, P_SKY)
        self.say("Primera regla: el orden no altera el resultado. Una barra de tres y otra de cuatro miden siete, se pongan como se pongan.", fox=True)
        u = 0.75
        a = Rectangle(3 * u, 0.6).set_fill(SKY, 1).set_stroke(width=0)
        b = Rectangle(4 * u, 0.6).set_fill(HONEY, 1).set_stroke(width=0)
        row = VGroup(a, b).arrange(RIGHT, buff=0).move_to(3.4 * UP)
        la = M("3", size=40).move_to(a)
        lb = M("4", size=40).move_to(b)
        self.play(FadeIn(row), FadeIn(la), FadeIn(lb))
        brace = Brace(row, DOWN).set_color(INK)
        seven = M("7", size=44).next_to(brace, DOWN, buff=0.15)
        self.play(GrowFromCenter(brace), FadeIn(seven))
        self.play(
            VGroup(a, la).animate.shift(4 * u * RIGHT),
            VGroup(b, lb).animate.shift(3 * u * LEFT),
            run_time=1.6,
        )
        eq = formula_card(R"3 + 4 = 4 + 3", color=SKY).move_to(1.0 * UP)
        self.play(FadeIn(eq, shift=0.2 * UP))
        self.hold()
        self.say("Con la multiplicación, piensa en un rectángulo de dos por cinco. Si lo giramos, es el mismo rectángulo visto de lado: cinco por dos.")
        rect = VGroup(*[Square(0.6).set_fill(PINK, 0.85).set_stroke(P_PINK, 2).move_to(np.array([(i - 2) * 0.6, (j - 0.5) * 0.6, 0])) for i in range(5) for j in range(2)])
        rect.move_to(2.2 * DOWN)
        l1 = flat(M(R"2 \cdot 5 = 10", size=44, color=PINK).move_to(4.4 * DOWN))
        self.play(LaggedStartMap(FadeIn, rect, lag_ratio=0.05), FadeIn(l1))
        self.play(Rotate(rect, PI / 2, axis=RIGHT + UP, about_point=rect.get_center()), run_time=1.0)
        self.play(Rotate(rect, PI / 2, axis=RIGHT + UP, about_point=rect.get_center()), run_time=1.0)
        l2 = M(R"5 \cdot 2 = 10", size=44, color=PINK).move_to(4.4 * DOWN)
        self.play(Transform(l1, l2))
        self.hold()
        rule = note("a + b = b + a      ab = ba", color=SKY).move_to(0.9 * UP)
        self.play(FadeOut(eq), FadeIn(rule))
        self.hold(0.5)
        self.end_section()


class S03_Asociativa(MBScene):
    def construct(self):
        self.mark("Asociativa: la caja")
        self.set_header(R"(ab)c = a(bc)", "Asociativa", PINK, P_PINK)
        self.say("Segunda regla: al multiplicar tres números, no importa cuáles se junten primero. Mira esta caja de dos por tres por cuatro cubitos.", fox=True)
        s = 0.55
        cubes = unit_cubes(2, 3, 4, size=s, color=LAV)
        cubes.move_to(0.6 * UP)
        self.play(self.frame.animate.reorient(-35, 65), run_time=1.6)
        self.play(LaggedStart(*[FadeIn(c, shift=0.3 * OUT) for c in cubes], lag_ratio=0.02), run_time=2.4)
        self.hold()
        self.say("Una forma de contar: cada piso tiene dos por tres, seis cubitos, y hay cuatro pisos. Seis por cuatro, veinticuatro.")
        zs = sorted({round(c.get_center()[2], 3) for c in cubes})
        floors = [Group(*[c for c in cubes if abs(c.get_center()[2] - z) < 1e-3]) for z in zs]
        cols = [SKY, MINT, HONEY, PINK]
        for f, col in zip(floors, cols):
            self.play(f.animate.set_color(col).shift(0.25 * OUT * (floors.index(f) + 1)), run_time=0.45)
        f1 = flat(M(R"(2 \cdot 3) \cdot 4 = 6 \cdot 4 = 24", size=44, color=INK).move_to(3.6 * DOWN))
        self.play(FadeIn(f1))
        self.hold()
        for f in floors:
            f.generate_target()
        self.play(*[f.animate.shift(-0.25 * OUT * (k + 1)).set_color(LAV) for k, f in enumerate(floors)], run_time=0.8)
        self.say("Otra forma: rebanadas de tres por cuatro, doce cubitos cada una, y hay dos rebanadas. Dos por doce, también veinticuatro.")
        self.play(self.frame.animate.reorient(40, 70), run_time=1.6)
        xs = sorted({round(c.get_center()[0], 3) for c in cubes})
        slices = [Group(*[c for c in cubes if abs(c.get_center()[0] - x) < 1e-3]) for x in xs]
        self.play(slices[0].animate.set_color(SKY).shift(0.5 * LEFT), slices[1].animate.set_color(HONEY).shift(0.5 * RIGHT), run_time=1.0)
        f2 = flat(M(R"2 \cdot (3 \cdot 4) = 2 \cdot 12 = 24", size=44, color=INK).move_to(4.6 * DOWN))
        self.play(FadeIn(f2))
        self.hold()
        self.frame.add_updater(lambda fr, dt: fr.increment_theta(0.3 * dt))
        self.say("Es la misma caja, contada de dos maneras. Con la suma pasa igual: los paréntesis se pueden mover.")
        self.hold(0.6)
        self.frame.clear_updaters()
        self.play(self.frame.animate.reorient(0, 0), FadeOut(cubes), FadeOut(f1), FadeOut(f2), run_time=1.4)
        rule = VGroup(formula_card(R"(a + b) + c = a + (b + c)", color=PINK, size=42), formula_card(R"(ab)c = a(bc)", color=PINK, size=42)).arrange(DOWN, buff=0.4).move_to(0.5 * UP)
        self.play(LaggedStartMap(FadeIn, rule, shift=0.2 * UP, lag_ratio=0.4))
        self.hold(0.5)
        self.end_section()


class S04_Neutros(MBScene):
    def construct(self):
        self.mark("Neutros")
        self.set_header(R"a + 0 = a", "Neutros e inversos", MINT, P_MINT)
        self.say("Tercera regla: hay números que no cambian nada. Sumar cero te deja en el mismo sitio, y multiplicar por uno también.", fox=True)
        line = get_number_line((-5, 5, 1), width=7.2, numbers=False).move_to(3.0 * UP)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=22, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-5, 6)])
        self.play(ShowCreation(line), FadeIn(labs))
        frog = Dot(line.n2p(3), radius=0.16).set_fill(MINT, 1)
        self.play(GrowFromCenter(frog))
        stay = Arc(start_angle=0, angle=TAU * 0.9, radius=0.35).set_stroke(MINT, 3).next_to(frog, UP, buff=0.05)
        self.play(ShowCreation(stay))
        n1 = VGroup(formula_card(R"3 + 0 = 3", color=MINT, size=40), formula_card(R"3 \cdot 1 = 3", color=MINT, size=40)).arrange(RIGHT, buff=0.4).move_to(1.3 * UP)
        self.play(FadeIn(n1, shift=0.2 * UP))
        self.hold()
        self.end_section()
        self.mark("Inversos")
        self.say("Cuarta regla: cada número tiene un opuesto que lo devuelve a cero. Saltar tres a la derecha y tres a la izquierda es no moverse.")
        self.play(FadeIn(line), FadeIn(labs))
        frog = Dot(line.n2p(0), radius=0.16).set_fill(MINT, 1)
        self.play(GrowFromCenter(frog))
        a1 = ArcBetweenPoints(line.n2p(0), line.n2p(3), angle=-PI / 2).set_stroke(SKY, 4)
        a2 = ArcBetweenPoints(line.n2p(3), line.n2p(0), angle=-PI / 2).set_stroke(CORAL, 4)
        self.play(ShowCreation(a1), frog.animate.move_to(line.n2p(3)), run_time=1.0)
        self.play(ShowCreation(a2), frog.animate.move_to(line.n2p(0)), run_time=1.0)
        inv1 = formula_card(R"3 + (-3) = 0", color=MINT, size=40).move_to(1.3 * UP)
        self.play(FadeIn(inv1, shift=0.2 * UP))
        self.hold()
        self.say("Y cada número distinto de cero tiene un inverso que lo devuelve a uno. Una tira de cinco de largo por un quinto de alto tiene área uno.")
        strip = Rectangle(5 * 1.2, 1.2 / 5).set_fill(MINT, 0.9).set_stroke(INK, 2).move_to(1.4 * DOWN)
        unit = Square(1.2).set_stroke(HONEY, 3, opacity=0.9).move_to(strip.get_left() + 0.6 * RIGHT + (0.6 - 0.12) * UP)
        w = Brace(strip, DOWN).set_color(INK)
        wl = M("5", size=36).next_to(w, DOWN, buff=0.1)
        h = M(R"\tfrac{1}{5}", size=36).next_to(strip, RIGHT, buff=0.2)
        self.play(ShowCreation(strip), GrowFromCenter(w), FadeIn(wl), FadeIn(h))
        pieces = VGroup(*[Rectangle(1.2, 0.24).set_fill(MINT, 0.9).set_stroke(INK, 1).move_to(strip.get_left() + (k + 0.5) * 1.2 * RIGHT) for k in range(5)])
        self.add(pieces)
        self.remove(strip)
        self.play(*[p.animate.move_to(unit.get_bottom() + (k + 0.5) * 0.24 * UP) for k, p in enumerate(pieces)], FadeIn(unit), run_time=1.8)
        inv2 = formula_card(R"5 \cdot \tfrac{1}{5} = 1", color=MINT, size=40).move_to(3.8 * DOWN)
        self.play(FadeIn(inv2, shift=0.2 * UP))
        self.hold()
        self.say("El cero es el único sin inverso: ningún número por cero da uno.")
        self.hold(0.5)
        self.end_section()


class S05_Distributiva(MBScene):
    def construct(self):
        self.mark("Distributiva")
        self.set_header(R"a(b + c)", "Distributiva", HONEY, P_HONEY)
        self.say("La quinta regla une la suma con la multiplicación. Un jardín de cuatro de ancho y tres más dos de largo se puede medir entero o por partes.", fox=True)
        s = 0.62
        A = VGroup(*[Square(s).set_fill(SKY, 0.85).set_stroke(P_SKY, 2).move_to(np.array([(i + 0.5) * s, (j + 0.5) * s, 0])) for i in range(3) for j in range(4)])
        B = VGroup(*[Square(s).set_fill(PINK, 0.85).set_stroke(P_PINK, 2).move_to(np.array([(i + 3.5) * s, (j + 0.5) * s, 0])) for i in range(2) for j in range(4)])
        garden = VGroup(A, B).move_to(2.0 * UP)
        self.play(LaggedStartMap(FadeIn, A, lag_ratio=0.03), LaggedStartMap(FadeIn, B, lag_ratio=0.03), run_time=1.6)
        hb = Brace(garden, LEFT).set_color(INK)
        hl = M("4", size=36).next_to(hb, LEFT, buff=0.1)
        b1 = Brace(A, UP).set_color(SKY)
        b2 = Brace(B, UP).set_color(PINK)
        l1 = M("3", size=36, color=SKY).next_to(b1, UP, buff=0.1)
        l2 = M("2", size=36, color=PINK).next_to(b2, UP, buff=0.1)
        self.play(GrowFromCenter(hb), FadeIn(hl), GrowFromCenter(b1), GrowFromCenter(b2), FadeIn(l1), FadeIn(l2))
        whole = formula_card(R"4 \cdot (3 + 2) = 4 \cdot 5 = 20", color=HONEY, size=40).move_to(1.2 * DOWN)
        self.play(FadeIn(whole, shift=0.2 * UP))
        self.hold()
        self.say("Por partes: cuatro por tres más cuatro por dos. Doce más ocho, otra vez veinte.")
        self.play(A.animate.shift(0.35 * LEFT), B.animate.shift(0.35 * RIGHT), b1.animate.shift(0.35 * LEFT), l1.animate.shift(0.35 * LEFT), b2.animate.shift(0.35 * RIGHT), l2.animate.shift(0.35 * RIGHT))
        parts = formula_card(R"4 \cdot 3 + 4 \cdot 2 = 12 + 8 = 20", color=HONEY, size=40).move_to(2.6 * DOWN)
        self.play(FadeIn(parts, shift=0.2 * UP))
        self.hold()
        self.say("El número de afuera se reparte entre los sumandos de adentro. Funciona igual con letras, y es la regla que más vas a usar.")
        gen = formula_card(R"a(b + c) = ab + ac", color=PINK, size=52).move_to(4.2 * DOWN)
        self.play(FadeIn(gen, scale=0.9))
        self.hold(0.5)
        self.end_section()


class S06_Signos(MBScene):
    def construct(self):
        self.mark("¿Por qué menos por menos es más?")
        self.set_header(R"(-1)(-1)", "Ley de signos", CORAL, P_CORAL)
        self.say("Con solo esas reglas se demuestra algo que parece magia: menos uno por menos uno da uno. Empecemos con algo que vale cero.", fox=True)
        steps = VGroup(
            M(R"(-1)\cdot\left(1 + (-1)\right) = (-1) \cdot 0 = 0", size=40),
            M(R"(-1)\cdot 1 + (-1)(-1) = 0", size=40),
            M(R"-1 + (-1)(-1) = 0", size=40),
            M(R"(-1)(-1) = 1", size=52, color=HONEY),
        ).arrange(DOWN, buff=0.75).move_to(1.0 * UP)
        for m in steps:
            m.set_max_width(7.2)
        why = VGroup(
            T("un número más su opuesto es 0", size=22, color=MUTED),
            T("se reparte el −1 (distributiva)", size=22, color=MUTED),
            T("−1 por 1 es −1 (neutro)", size=22, color=MUTED),
            T("lo que sumado a −1 da 0 es 1", size=22, color=MUTED),
        )
        for w, m in zip(why, steps):
            w.next_to(m, DOWN, buff=0.15)
        self.play(Write(steps[0]), FadeIn(why[0]))
        self.hold()
        self.say("Ahora repartimos el menos uno con la distributiva.")
        self.play(TransformFromCopy(steps[0], steps[1]), FadeIn(why[1]))
        self.zoom_to(VGroup(steps[1], why[1]), scale=0.5)
        self.hold()
        self.zoom_reset()
        self.say("Menos uno por uno es menos uno. Así que menos uno por menos uno es el número que, sumado a menos uno, da cero. Ese número es uno.")
        self.play(TransformFromCopy(steps[1], steps[2]), FadeIn(why[2]))
        self.play(TransformFromCopy(steps[2], steps[3]), FadeIn(why[3]))
        box = SurroundingRectangle(steps[3], buff=0.18).set_stroke(HONEY, 3)
        self.play(ShowCreation(box))
        self.hold()
        self.end_section()
        self.mark("Contar los negativos")
        self.say("De ahí sale la regla práctica: cuenta los factores negativos. Si son pares, el producto es positivo; si son impares, negativo. Y cualquier cosa por cero es cero.")
        ex = VGroup(
            M(R"(-2)(-5) = 10", size=44, color=SKY),
            M(R"(-2)(-5)(-1) = -10", size=44, color=CORAL),
            M(R"(-7) \cdot 0 = 0", size=44, color=MUTED),
        ).arrange(DOWN, buff=0.6).move_to(1.4 * UP)
        tags = VGroup(T("2 negativos: par", size=24, color=SKY), T("3 negativos: impar", size=24, color=CORAL), T("el cero lo anula todo", size=24, color=MUTED))
        for t, m in zip(tags, ex):
            t.next_to(m, DOWN, buff=0.15)
        for m, t in zip(ex, tags):
            self.play(FadeIn(m, shift=0.2 * UP), FadeIn(t), run_time=0.8)
        self.hold(0.5)
        self.end_section()


class S07_Orden(MBScene):
    def construct(self):
        self.mark("El orden")
        self.set_header(R"a < b", "Axiomas de orden", SKY, P_SKY)
        self.say("Los reales también tienen orden. Decir que a es menor que b significa que b menos a es positivo: b está más a la derecha.", fox=True)
        line = get_number_line((-7, 7, 1), width=7.4, numbers=False).move_to(2.6 * UP)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=20, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-7, 8)])
        self.play(ShowCreation(line), FadeIn(labs))
        ta, tb = ValueTracker(1), ValueTracker(3)
        da = always_redraw(lambda: Dot(line.n2p(ta.get_value()), radius=0.14).set_fill(SKY, 1))
        db = always_redraw(lambda: Dot(line.n2p(tb.get_value()), radius=0.14).set_fill(HONEY, 1))
        la = always_redraw(lambda: M("a", size=36, color=SKY).next_to(da, UP, buff=0.15))
        lb = always_redraw(lambda: M("b", size=36, color=HONEY).next_to(db, UP, buff=0.15))
        self.add(da, db, la, lb)
        rel = M(R"1 < 3", size=56).move_to(0.8 * UP)
        self.play(FadeIn(rel))
        self.say("Entre dos números distintos siempre pasa una de dos: uno es menor que el otro. Con el igual, son tres opciones: es la tricotomía.")
        self.hold()
        self.say("Sumar el mismo número a los dos los desliza juntos: el orden no cambia.")
        self.play(ta.animate.set_value(3), tb.animate.set_value(5), run_time=1.4)
        rel2 = M(R"1 + 2 < 3 + 2", size=52).move_to(0.8 * UP)
        self.play(Transform(rel, rel2))
        self.hold()
        self.play(ta.animate.set_value(1), tb.animate.set_value(3), Transform(rel, M(R"1 < 3", size=56).move_to(0.8 * UP)))
        self.say("Multiplicar por un número positivo estira la recta desde el cero: el orden tampoco cambia.")
        self.play(ta.animate.set_value(2), tb.animate.set_value(6), run_time=1.4)
        self.play(Transform(rel, M(R"1 \cdot 2 < 3 \cdot 2", size=52).move_to(0.8 * UP)))
        self.hold()
        self.end_section()
        self.mark("El espejo del negativo")
        self.say("Pero multiplicar por menos dos estira y además refleja la recta en el cero, como un espejo. Lo que estaba a la derecha queda a la izquierda.", fox=True)
        self.play(FadeIn(line), FadeIn(labs))
        ta.set_value(1)
        tb.set_value(3)
        self.add(da, db, la, lb)
        rel = M(R"1 < 3", size=56).move_to(0.8 * UP)
        self.play(FadeIn(rel))
        mirror = DashedLine(line.n2p(0) + 1.3 * UP, line.n2p(0) + 0.9 * DOWN).set_stroke(PINK, 3)
        self.play(ShowCreation(mirror))
        self.play(ta.animate.set_value(-2), tb.animate.set_value(-6), run_time=2.0)
        self.zoom_to(VGroup(da, db, la, lb, mirror), scale=0.55)
        self.hold()
        self.zoom_reset()
        flip = formula_card(R"1 \cdot (-2) > 3 \cdot (-2) \quad\Longrightarrow\quad -2 > -6", color=CORAL, size=38).move_to(0.6 * DOWN)
        self.play(FadeOut(rel), FadeIn(flip, shift=0.2 * UP))
        self.say("Por eso, al multiplicar o dividir una desigualdad por un negativo, el signo se voltea.")
        rules = VGroup(
            M(R"a < b \Rightarrow a + c < b + c", size=36),
            M(R"a < b,\ c > 0 \Rightarrow ac < bc", size=36),
            M(R"a < b,\ c < 0 \Rightarrow ac > bc", size=36, color=CORAL),
        ).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        rules_card = boxed(rules, color=SKY).move_to(3.4 * DOWN)
        self.play(FadeIn(rules_card, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S08_Absoluto(MBScene):
    def construct(self):
        self.mark("Valor absoluto: doblar la recta")
        self.set_header(R"|a|", "Valor absoluto", PINK, P_PINK)
        self.say("El valor absoluto mide la distancia al cero, sin importar el lado. Imagina que doblas la recta por el cero.", fox=True)
        u = 0.6
        right = Line(ORIGIN, 5.5 * u * RIGHT).set_stroke(INK, 4)
        left = Line(ORIGIN, 5.5 * u * LEFT).set_stroke(INK, 4)
        rt = VGroup(*[Line(k * u * RIGHT + 0.1 * DOWN, k * u * RIGHT + 0.1 * UP).set_stroke(MUTED, 2) for k in range(1, 6)])
        lt = VGroup(*[Line(k * u * LEFT + 0.1 * DOWN, k * u * LEFT + 0.1 * UP).set_stroke(MUTED, 2) for k in range(1, 6)])
        pt = Dot(4 * u * LEFT, radius=0.13).set_fill(CORAL, 1)
        left_side = VGroup(left, lt, pt)
        right_side = VGroup(right, rt)
        whole = VGroup(left_side, right_side).move_to(1.6 * UP)
        zero = whole[1][0].get_start()
        nums = VGroup(*[T(str(k), size=22, color=MUTED).next_to(zero + k * u * RIGHT, DOWN, buff=0.2) for k in range(0, 6)])
        neg = flat(M(R"-4", size=36, color=CORAL).next_to(pt, UP, buff=0.2))
        self.play(ShowCreation(whole), FadeIn(nums), FadeIn(neg))
        self.hold()
        self.play(self.frame.animate.reorient(-20, 55), run_time=1.4)
        self.play(FadeOut(neg))
        self.play(Rotate(left_side, PI, axis=UP, about_point=zero), run_time=2.4)
        self.play(self.frame.animate.reorient(0, 0), run_time=1.2)
        four = flat(M(R"|-4| = 4", size=48, color=PINK).move_to(0.0 * UP))
        self.play(FadeIn(four, shift=0.2 * UP), Flash(pt.get_center(), color=PINK))
        self.hold()
        self.say("Si el número es positivo, se queda donde está. Si es negativo, el doblez lo lleva al otro lado: le cambia el signo.")
        defi = formula_card(R"|a| = \begin{cases} a & a \ge 0 \\ -a & a < 0 \end{cases}", color=PINK, size=44).move_to(2.4 * DOWN)
        self.play(FadeIn(defi, shift=0.2 * UP))
        self.hold()
        self.say("Por ejemplo, raíz de dos es uno punto cuatro uno, menor que dos. Raíz de dos menos dos es negativo, así que su valor absoluto es dos menos raíz de dos.")
        ex = M(R"|\sqrt{2} - 2| = 2 - \sqrt{2} \approx 0.59", size=42).move_to(4.4 * DOWN)
        self.play(Write(ex))
        self.hold()
        self.end_section()
        self.mark("Distancia entre dos números")
        self.say("La distancia entre dos números es el valor absoluto de su resta. Entre menos uno y cuatro hay cinco pasos, se cuente desde donde se cuente.", fox=True)
        line = get_number_line((-3, 6, 1), width=7.2, numbers=False).move_to(2.4 * UP)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=22, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-3, 7)])
        A = Dot(line.n2p(-1), radius=0.13).set_fill(SKY, 1)
        B = Dot(line.n2p(4), radius=0.13).set_fill(HONEY, 1)
        self.play(ShowCreation(line), FadeIn(labs), GrowFromCenter(A), GrowFromCenter(B))
        hops = VGroup(*[ArcBetweenPoints(line.n2p(k), line.n2p(k + 1), angle=-PI / 2).set_stroke(PINK, 3) for k in range(-1, 4)])
        self.play(LaggedStartMap(ShowCreation, hops, lag_ratio=0.25), run_time=1.6)
        d = formula_card(R"|4 - (-1)| = |-1 - 4| = 5", color=PINK, size=42).move_to(0.4 * UP)
        self.play(FadeIn(d, shift=0.2 * UP))
        self.hold()
        self.say("Y una desigualdad con valor absoluto es una zona alrededor de un centro: los x a menos de dos pasos del uno van de menos uno a tres.")
        self.play(FadeOut(hops), FadeOut(A), FadeOut(B), FadeOut(d))
        c = Dot(line.n2p(1), radius=0.12).set_fill(LAV, 1)
        seg = Line(line.n2p(-1), line.n2p(3)).set_stroke(LAV, 9)
        o1 = Circle(radius=0.12).set_fill(BG_COLOR, 1).set_stroke(LAV, 3).move_to(line.n2p(-1))
        o2 = o1.copy().move_to(line.n2p(3))
        self.play(GrowFromCenter(c))
        self.play(ShowCreation(seg), FadeIn(o1), FadeIn(o2), run_time=1.4)
        res = formula_card(R"|x - 1| < 2 \iff -1 < x < 3", color=LAV, size=42).move_to(0.4 * UP)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S09_Cierre(AlgCierre):
    recap = [
        ("Conmutativa", "a + b = b + a,  ab = ba", SKY),
        ("Asociativa", "(ab)c = a(bc): la misma caja contada de dos formas", PINK),
        ("Neutros e inversos", "a + 0 = a,  a · 1 = a,  a + (−a) = 0,  a · (1/a) = 1", MINT),
        ("Distributiva", "a(b + c) = ab + ac", HONEY),
        ("Signos", "negativos pares: +;  impares: −", CORAL),
        ("Orden", "por un negativo, la desigualdad se voltea", SKY),
        ("Valor absoluto", "distancia al cero: |a − b| es la distancia", PINK),
    ]
    recap_say = "Con unas pocas reglas se construye todo el álgebra: cambiar el orden, mover paréntesis, repartir, y cuidar el signo al multiplicar por negativos."
    practice = "Atajos, máquinas, espejos y distancias te esperan"
