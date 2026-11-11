"""
Álgebra F1 · Axiomas de campo: las reglas de la suma y el producto (lección alg-12b, parte 1 de axiomas, 9:16).

Desde lo más básico y conectado con sistemas numéricos (N1–N3); sin zoom ni 3D. Qué es un axioma (reglas de un
juego); notación ∀ a, b ∈ ℝ; cerradura (ℕ, ℤ e 𝕀 se escapaban, ℝ no); conmutativa (bolsa de dulces, puntos que
giran; la resta y la división no conmutan); asociativa (38 + 19 + 1, (7·5)·2); neutros 0 y 1; inversos: opuesto en
el espejo del cero y recíproco que voltea la fracción (el 0 no tiene); distributiva con un jardín de 3 × 6 y
6 · 102; tabla de los once axiomas. Spec 2026-11-11-axiomas-desde-cero.

    manimgl campo.py S03_Conmutativa -w -l
"""
from alg_fx import *


def squares(n, color, u=0.5):
    return VGroup(*[Square(u).set_fill(color, 0.75).set_stroke(INK, 1.5) for _ in range(n)]).arrange(RIGHT, buff=0)


def dots(rows, cols, color, gap=0.42):
    g = VGroup(*[Dot(radius=0.11).set_fill(color, 1) for _ in range(rows * cols)])
    return g.arrange_in_grid(rows, cols, buff=gap - 0.22)


def stack(*mobs, buff=0.45):
    return VGroup(*mobs).arrange(DOWN, buff=buff)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Axiomas · Parte 1"
    title = "Las reglas de la\nsuma y el producto"
    subtitle = "Axiomas de campo"


class S01_Reglas(MBScene):
    def construct(self):
        self.mark("Las reglas del juego")
        self.set_header(R"\forall", "Axiomas", LAV, P_LAV)
        self.say("En las partes anteriores armamos los números reales: los naturales, los enteros, los racionales y los irracionales, todos juntos en el conjunto ℝ.", fox=True)
        nest = M(R"\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}", size=54, color=LAV).move_to(4.0 * UP)
        self.play(Write(nest))
        self.hold()
        self.say("Ahora aprenderemos las reglas para operar con ellos. Piensa en un juego de mesa: en el ajedrez, el alfil se mueve en diagonal. Nadie lo demuestra; son las reglas del juego.")
        board = VGroup(*[Square(0.55).set_fill(PEACH_DEEP if (i + j) % 2 else PEACH, 1).set_stroke(BORDER, 1) for i in range(4) for j in range(4)])
        board.arrange_in_grid(4, 4, buff=0).move_to(1.4 * UP)
        bishop = Dot(radius=0.16).set_fill(HONEY, 1).move_to(board[12])
        path = DashedLine(board[12].get_center(), board[3].get_center()).set_stroke(HONEY, 3)
        self.play(FadeIn(board), FadeIn(bishop))
        self.play(ShowCreation(path), bishop.animate.move_to(board[3]), run_time=1.4)
        self.hold()
        self.say("En matemáticas, a esas reglas que se aceptan sin demostrar se les llama axiomas. Los axiomas de campo son las reglas de las dos operaciones básicas: la suma y el producto.")
        card = note("Axioma: una regla que se acepta\nsin demostrar, como las de un juego.", color=LAV, size=28).move_to(1.4 * DOWN)
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold()
        self.end_section()
        self.clear_scene()
        self.mark("La notación: para todo")
        self.say("Como las reglas valen para todos los números, se escriben con letras. Una regla suele empezar así.", fox=True)
        big = M(R"\forall\, a, b \in \mathbb{R}", size=72, color=INK).move_to(3.6 * UP)
        self.play(Write(big))
        self.hold()
        parts = [
            (R"\forall", "se lee «para todo»", HONEY),
            (R"a,\ b", "dos números cualesquiera", SKY),
            (R"\in \mathbb{R}", "que pertenecen a los reales\n(el ∈ de la unidad de conjuntos)", MINT),
        ]
        rows = VGroup()
        for tex, txt, col in parts:
            rows.add(VGroup(M(tex, size=52, color=col), T(txt, size=28, color=INK)).arrange(RIGHT, buff=0.5))
        rows.arrange(DOWN, buff=0.55, aligned_edge=LEFT).move_to(0.6 * UP)
        rows.set_max_width(7.2)
        self.say("La A al revés significa «para todo». Las letras a y b son dos números cualesquiera. Y «pertenece a ℝ» dice que pueden ser cualquier real.")
        for r in rows:
            self.play(FadeIn(r, shift=0.2 * RIGHT), run_time=0.8)
        self.hold()
        self.say("Así, cuando leas «a más b es igual a b más a», significa que funciona con cualquier pareja: enteros, fracciones, decimales o raíces.")
        ex = M(R"a + b = b + a", size=56, color=LAV).move_to(2.6 * DOWN)
        tag = T("para todo a, b ∈ ℝ", size=28, color=MUTED).next_to(ex, DOWN, buff=0.25)
        self.play(Write(ex), FadeIn(tag))
        self.hold(0.6)
        self.end_section()


class S02_Cerradura(MBScene):
    def construct(self):
        self.mark("Cerradura: no hay fuga")
        self.set_header(R"+\ \cdot", "Cerradura", SKY, P_SKY)
        self.say("Primera regla: si sumas o multiplicas dos números reales, el resultado sigue siendo un número real. Se dice que ℝ es cerrado para la suma y el producto.", fox=True)
        rule = M(R"a + b \in \mathbb{R} \qquad a \cdot b \in \mathbb{R}", size=50, color=SKY).move_to(4.0 * UP)
        self.play(Write(rule))
        self.hold()
        self.say("Recuerda que otros conjuntos no eran cerrados. En los naturales, la resta se escapaba. En los enteros, la división. Y en los irracionales, hasta la suma podía escaparse.")
        rows = VGroup(
            VGroup(M(R"\mathbb{N}:", size=40, color=HONEY), M(R"2 - 5 = -3 \notin \mathbb{N}", size=40)).arrange(RIGHT, buff=0.3),
            VGroup(M(R"\mathbb{Z}:", size=40, color=SKY), M(R"3 \div 4 = \tfrac34 \notin \mathbb{Z}", size=40)).arrange(RIGHT, buff=0.3),
            VGroup(M(R"\mathbb{I}:", size=40, color=CORAL), M(R"\sqrt2 + (-\sqrt2) = 0 \notin \mathbb{I}", size=40)).arrange(RIGHT, buff=0.3),
        ).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to(1.2 * UP)
        rows.set_max_width(7.0)
        for r in rows:
            esc = T("se escapa", size=24, color=CORAL).next_to(r, RIGHT, buff=0.25)
            if esc.get_right()[0] > 3.9:
                esc.next_to(r, DOWN, buff=0.08, aligned_edge=RIGHT)
            self.play(FadeIn(r, shift=0.2 * RIGHT), FadeIn(esc), run_time=0.8)
        self.hold()
        self.say("En los reales eso no pasa: sumes o multipliques lo que sea, el resultado se queda adentro. Por ejemplo, raíz de dos más un tercio es un real, y pi por menos dos también.")
        exs = VGroup(
            M(R"\sqrt2 + \tfrac13 \in \mathbb{R}", size=46, color=LAV),
            M(R"\pi \cdot (-2) \in \mathbb{R}", size=46, color=LAV),
        ).arrange(DOWN, buff=0.4).move_to(2.6 * DOWN)
        self.play(LaggedStartMap(FadeIn, exs, shift=0.2 * UP, lag_ratio=0.4), run_time=1.4)
        self.hold(0.6)
        self.end_section()


class S03_Conmutativa(MBScene):
    def construct(self):
        self.mark("Conmutativa: el orden no importa")
        self.set_header(R"a+b=b+a", "Conmutativa", SKY, P_SKY)
        self.say("Si en una bolsa echas dos dulces y luego cinco, o primero cinco y luego dos, al final tienes lo mismo: siete.", fox=True)
        a = VGroup(squares(2, HONEY), squares(5, SKY)).arrange(RIGHT, buff=0).move_to(4.0 * UP)
        b = VGroup(squares(5, SKY), squares(2, HONEY)).arrange(RIGHT, buff=0).move_to(3.1 * UP)
        self.play(FadeIn(a, shift=0.2 * RIGHT))
        self.play(TransformFromCopy(a, b))
        eq = M(R"2 + 5 = 5 + 2 = 7", size=48).move_to(2.0 * UP)
        self.play(Write(eq))
        self.hold()
        self.say("Con el producto pasa igual. Tres filas de cuatro puntos son doce puntos. Si giramos el dibujo, quedan cuatro filas de tres: los mismos doce.")
        g = dots(3, 4, MINT).move_to(0.2 * DOWN)
        self.play(FadeIn(g))
        lab = M(R"3 \cdot 4", size=44, color=MINT).next_to(g, RIGHT, buff=0.5)
        self.play(FadeIn(lab))
        self.hold()
        self.play(Rotate(g, PI / 2), run_time=1.4)
        lab2 = M(R"4 \cdot 3", size=44, color=MINT).next_to(g, RIGHT, buff=0.5)
        self.play(Transform(lab, lab2))
        eq2 = M(R"3 \cdot 4 = 4 \cdot 3 = 12", size=48).move_to(2.3 * DOWN)
        self.play(Write(eq2))
        self.hold()
        self.say("Esta es la propiedad conmutativa: el orden de los sumandos, o de los factores, no cambia el resultado.")
        gen = M(R"a + b = b + a \qquad a \cdot b = b \cdot a", size=48, color=SKY).move_to(3.6 * DOWN)
        self.play(Write(gen))
        self.hold()
        self.end_section()
        self.clear_scene()
        self.mark("Cuidado: la resta no conmuta")
        self.say("Ojo: la resta no es conmutativa. Cinco menos dos da tres, pero dos menos cinco da menos tres, el número que se escapaba de los naturales.", fox=True)
        r1 = M(R"5 - 2 = 3", size=56, color=INK).move_to(3.0 * UP)
        r2 = M(R"2 - 5 = -3", size=56, color=CORAL).move_to(1.8 * UP)
        neq = M(R"5 - 2 \neq 2 - 5", size=56, color=CORAL).move_to(0.4 * UP)
        self.play(Write(r1))
        self.play(Write(r2))
        self.play(Write(neq))
        self.hold()
        self.say("La división tampoco: ocho entre dos es cuatro, pero dos entre ocho es un cuarto. Por eso las reglas se dan solo para la suma y el producto.")
        d = M(R"8 \div 2 = 4 \neq \tfrac14 = 2 \div 8", size=50, color=CORAL).move_to(1.6 * DOWN)
        self.play(Write(d))
        self.hold(0.6)
        self.end_section()


class S04_Asociativa(MBScene):
    def construct(self):
        self.mark("Asociativa: los paréntesis")
        self.set_header(R"(a+b)+c", "Asociativa", MINT, P_MINT)
        self.say("Para sumar tres números hay que sumar de dos en dos. Los paréntesis dicen qué pareja va primero.", fox=True)
        l1 = M(R"(2 + 3) + 7", size=54).move_to(4.0 * UP)
        l1b = M(R"= 5 + 7 = 12", size=54, color=MINT).next_to(l1, DOWN, buff=0.25)
        self.play(Write(l1))
        self.play(ShowCreation(SurroundingRectangle(l1[0:5], buff=0.06).set_stroke(HONEY, 3)))
        self.play(FadeIn(l1b, shift=0.2 * DOWN))
        self.hold()
        self.say("Si agrupamos distinto, primero tres más siete, el resultado es el mismo. La propiedad asociativa dice que no importa cómo se agrupe.")
        l2 = M(R"2 + (3 + 7)", size=54).move_to(1.6 * UP)
        l2b = M(R"= 2 + 10 = 12", size=54, color=MINT).next_to(l2, DOWN, buff=0.25)
        self.play(Write(l2))
        self.play(ShowCreation(SurroundingRectangle(l2[2:7], buff=0.06).set_stroke(HONEY, 3)))
        self.play(FadeIn(l2b, shift=0.2 * DOWN))
        self.hold()
        gen = VGroup(
            M(R"(a + b) + c = a + (b + c)", size=46, color=MINT),
            M(R"(a \cdot b) \cdot c = a \cdot (b \cdot c)", size=46, color=MINT),
        ).arrange(DOWN, buff=0.35).move_to(1.6 * DOWN)
        self.play(Write(gen))
        self.say("Por eso, en una suma o un producto largo, se pueden quitar los paréntesis y escribir a más b más c.")
        self.hold()
        self.end_section()
        self.clear_scene()
        self.mark("Cuentas de cabeza")
        self.say("Combinando la conmutativa y la asociativa se hacen cuentas de cabeza: se juntan primero los números que dan algo redondo.", fox=True)
        s = stack(
            M(R"38 + 19 + 1", size=54),
            M(R"= 38 + (19 + 1)", size=54, color=MINT),
            M(R"= 38 + 20 = 58", size=54, color=MINT),
        ).move_to(2.8 * UP)
        for m in s:
            self.play(FadeIn(m, shift=0.2 * DOWN), run_time=0.8)
            self.hold()
        self.say("Con el producto igual: siete por cinco por dos. Mejor juntar primero cinco por dos, que da diez.")
        p = stack(
            M(R"(7 \cdot 5) \cdot 2", size=54),
            M(R"= 7 \cdot (5 \cdot 2)", size=54, color=MINT),
            M(R"= 7 \cdot 10 = 70", size=54, color=MINT),
        ).move_to(2.2 * DOWN)
        for m in p:
            self.play(FadeIn(m, shift=0.2 * DOWN), run_time=0.8)
        self.hold(0.6)
        self.end_section()


class S05_Neutros(MBScene):
    def construct(self):
        self.mark("Neutros: los que no cambian nada")
        self.set_header(R"0\quad 1", "Neutros", HONEY, P_HONEY)
        self.say("Hay un número que, al sumarlo, no cambia nada: el cero. Sumar cero es como no echar nada a la bolsa.", fox=True)
        bag = VGroup(squares(4, SKY)).move_to(4.0 * UP)
        plus = M(R"+\ 0", size=54, color=HONEY).next_to(bag, RIGHT, buff=0.4)
        self.play(FadeIn(bag), FadeIn(plus))
        n0 = M(R"a + 0 = a", size=60, color=HONEY).move_to(2.6 * UP)
        self.play(Write(n0))
        ex0 = M(R"\sqrt{3} + 0 = \sqrt{3}", size=48).move_to(1.5 * UP)
        self.play(FadeIn(ex0))
        self.hold()
        self.say("En el producto, el número que no cambia nada es el uno: tomar algo una vez es lo mismo que tenerlo.")
        n1 = M(R"a \cdot 1 = a", size=60, color=HONEY).move_to(0.0 * UP)
        ex1 = M(R"-\frac{2}{7} \cdot 1 = -\frac{2}{7}", size=48).move_to(1.3 * DOWN)
        self.play(Write(n1))
        self.play(FadeIn(ex1))
        self.hold()
        self.say("Por eso el cero es el neutro de la suma y el uno es el neutro del producto. No los confundas: multiplicar por cero sí cambia todo, siempre da cero. Lo veremos en la próxima parte.")
        card = note("Neutro de la suma: 0\nNeutro del producto: 1", color=HONEY, size=30).move_to(3.4 * DOWN)
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S06_Inversos(MBScene):
    def construct(self):
        self.mark("El opuesto: volver al cero")
        self.set_header(R"-a", "Inversos", PINK, P_PINK)
        self.say("Cada número tiene una pareja que, al sumarla, lo devuelve al neutro cero. Es su opuesto: el reflejo en el espejo del cero que vimos en la primera parte de sistemas numéricos.", fox=True)
        line = get_number_line((-5, 5, 1), width=7.0).move_to(3.4 * UP)
        mirror = DashedLine(line.n2p(0) + 1.1 * UP, line.n2p(0) + 0.5 * DOWN).set_stroke(CORAL, 3)
        self.play(ShowCreation(line), ShowCreation(mirror))
        p3 = Dot(line.n2p(3), radius=0.13).set_fill(HONEY, 1)
        m3 = Dot(line.n2p(-3), radius=0.13).set_fill(SKY, 1)
        arc = ArcBetweenPoints(line.n2p(3) + 0.15 * UP, line.n2p(-3) + 0.15 * UP, angle=PI / 2).set_stroke(PINK, 3)
        self.play(GrowFromCenter(p3))
        self.play(ShowCreation(arc), TransformFromCopy(p3, m3))
        e1 = M(R"3 + (-3) = 0", size=52).move_to(1.8 * UP)
        self.play(Write(e1))
        self.hold()
        self.say("Con fracciones igual: el opuesto de cuatro novenos es menos cuatro novenos. Solo cambia el signo.")
        e2 = M(R"\frac{4}{9} + \left(-\frac{4}{9}\right) = 0", size=48).move_to(0.4 * UP)
        self.play(Write(e2))
        gen = M(R"a + (-a) = 0", size=60, color=PINK).move_to(1.3 * DOWN)
        self.play(Write(gen))
        self.hold(0.6)
        self.end_section()
        self.clear_scene()
        self.mark("El recíproco: volver al uno")
        self.set_header(R"\frac{1}{a}", "Inversos", PINK, P_PINK)
        self.say("En el producto, la pareja que devuelve al neutro uno se llama recíproco. Para encontrarlo se voltea la fracción, como si diéramos la vuelta a una tarjeta.", fox=True)
        f = M(R"\frac{2}{3}", size=80, color=SKY).move_to(3.6 * UP + 1.4 * LEFT)
        g = M(R"\frac{3}{2}", size=80, color=MINT).move_to(3.6 * UP + 1.4 * RIGHT)
        self.play(Write(f))
        self.play(TransformFromCopy(f, g, path_arc=PI))
        e = M(R"\frac{2}{3} \cdot \frac{3}{2} = \frac{6}{6} = 1", size=50).move_to(1.8 * UP)
        self.play(Write(e))
        self.hold()
        self.say("Un entero se escribe sobre uno: cinco es cinco sobre uno, así que su recíproco es un quinto.")
        e5 = M(R"5 = \frac{5}{1} \quad\Rightarrow\quad 5 \cdot \frac{1}{5} = 1", size=48).move_to(0.3 * UP)
        self.play(Write(e5))
        gen = M(R"a \cdot \frac{1}{a} = 1 \qquad (a \neq 0)", size=54, color=PINK).move_to(1.3 * DOWN)
        self.play(Write(gen))
        self.hold()
        self.say("¿Y el cero? Cero por cualquier número da cero, nunca uno. Por eso el cero no tiene recíproco, y por eso, como vimos en los racionales, el denominador nunca puede ser cero.")
        z = M(R"0 \cdot \;?\; = 1", size=54, color=CORAL).move_to(3.0 * DOWN)
        cross = Cross(z).set_stroke(CORAL, 6)
        self.play(Write(z))
        self.play(ShowCreation(cross))
        self.hold(0.6)
        self.end_section()


class S07_Distributiva(MBScene):
    def construct(self):
        self.mark("Distributiva: repartir el factor")
        self.set_header(R"a(b+c)", "Distributiva", LAV, P_LAV)
        self.say("La última regla une la suma con el producto. Imagina un jardín rectangular de tres metros de ancho y seis de largo, partido en dos zonas: una de cuatro metros de largo y otra de dos.", fox=True)
        u = 0.75
        left = VGroup(*[Square(u).set_fill(MINT, 0.55).set_stroke(INK, 1) for _ in range(12)]).arrange_in_grid(3, 4, buff=0)
        right = VGroup(*[Square(u).set_fill(SKY, 0.55).set_stroke(INK, 1) for _ in range(6)]).arrange_in_grid(3, 2, buff=0)
        garden = VGroup(left, right).arrange(RIGHT, buff=0).move_to(3.0 * UP)
        h = M("3", size=40).next_to(garden, LEFT, buff=0.2)
        w1 = M("4", size=40, color=MINT).next_to(left, UP, buff=0.15)
        w2 = M("2", size=40, color=SKY).next_to(right, UP, buff=0.15)
        self.play(FadeIn(garden), FadeIn(h), FadeIn(w1), FadeIn(w2))
        self.hold()
        self.say("El área de todo el jardín es el ancho por el largo total: tres por cuatro más dos, que es tres por seis, dieciocho.")
        t = M(R"3 \cdot (4 + 2) = 3 \cdot 6 = 18", size=48).move_to(0.6 * UP)
        self.play(Write(t))
        self.hold()
        self.say("Pero también podemos sumar las áreas de las dos zonas: tres por cuatro, doce, más tres por dos, seis. Da lo mismo: dieciocho.")
        self.play(Indicate(left, scale_factor=1.04, color=MINT))
        self.play(Indicate(right, scale_factor=1.04, color=SKY))
        s = M(R"3 \cdot 4 + 3 \cdot 2 = 12 + 6 = 18", size=48).move_to(0.6 * DOWN)
        self.play(Write(s))
        self.hold()
        self.say("Esta es la propiedad distributiva: el factor de afuera se reparte, multiplicando a cada sumando de adentro.")
        gen = M(R"a(b + c) = ab + ac", size=60, color=LAV).move_to(2.3 * DOWN)
        arrows = VGroup(
            CurvedArrow(gen[0].get_top() + 0.1 * UP, gen[2].get_top() + 0.1 * UP, angle=-PI / 2),
            CurvedArrow(gen[0].get_top() + 0.1 * UP, gen[4].get_top() + 0.1 * UP, angle=-PI / 2),
        ).set_color(HONEY)
        self.play(Write(gen))
        self.play(ShowCreation(arrows))
        self.hold()
        self.end_section()
        self.clear_scene()
        self.mark("Para qué sirve")
        self.say("Sirve para cuentas difíciles. Seis por ciento dos: se parte el ciento dos en cien más dos.", fox=True)
        m = stack(
            M(R"6 \cdot 102", size=54),
            M(R"= 6 \cdot (100 + 2)", size=54, color=LAV),
            M(R"= 6 \cdot 100 + 6 \cdot 2", size=54, color=LAV),
            M(R"= 600 + 12 = 612", size=54, color=MINT),
        ).move_to(2.6 * UP)
        for x in m:
            self.play(FadeIn(x, shift=0.2 * DOWN), run_time=0.8)
            self.hold()
        self.say("Y leída al revés sirve para sacar factor común: si los dos términos tienen el mismo factor, se escribe una sola vez afuera del paréntesis.")
        fc = M(R"5x + 5y = 5(x + y)", size=54, color=HONEY).move_to(2.4 * DOWN)
        self.play(Write(fc))
        self.hold(0.6)
        self.end_section()


class S08_Tabla(MBScene):
    def construct(self):
        self.mark("Los axiomas de campo")
        self.set_header(R"\mathbb{R}", "Axiomas de campo", LAV, P_LAV)
        self.say("Juntemos todo. Para todo a, b y c reales, la suma y el producto cumplen estas once reglas. Por cumplirlas, se dice que los reales forman un campo.", fox=True)
        rows = [
            ("Cerradura", R"a + b \in \mathbb{R}", R"ab \in \mathbb{R}", SKY),
            ("Conmutativa", R"a + b = b + a", R"ab = ba", SKY),
            ("Asociativa", R"(a + b) + c = a + (b + c)", R"(ab)c = a(bc)", MINT),
            ("Neutro", R"a + 0 = a", R"a \cdot 1 = a", HONEY),
            ("Inverso", R"a + (-a) = 0", R"a \cdot \tfrac1a = 1,\ a \neq 0", PINK),
        ]
        head = VGroup(T("Suma", size=30, color=MUTED), T("Producto", size=30, color=MUTED)).arrange(RIGHT, buff=2.2)
        table = VGroup()
        for name, s, p, col in rows:
            block = VGroup(
                TB(name, size=32, color=col),
                VGroup(M(s, size=44), M(p, size=44)).arrange(RIGHT, buff=0.6),
            ).arrange(DOWN, buff=0.14, aligned_edge=LEFT)
            table.add(block)
        dist = VGroup(TB("Distributiva", size=32, color=LAV), M(R"a(b + c) = ab + ac", size=44)).arrange(DOWN, buff=0.14, aligned_edge=LEFT)
        table.add(dist)
        table.arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to(0.4 * DOWN)
        table.set_max_width(7.2)
        if table.get_height() > 10.0:
            table.set_height(10.0)
        for b in table:
            self.play(FadeIn(b, shift=0.2 * RIGHT), run_time=0.7)
        self.hold()
        self.say("Cinco parejas, una para la suma y otra para el producto, y la distributiva que las une. De ellas salen todas las propiedades del álgebra, como veremos en la siguiente parte.")
        self.hold(0.8)
        self.end_section()


class S09_Cierre(AlgCierre):
    recap = [
        ("Axioma", "regla que se acepta sin demostrar", LAV),
        ("∀ a, b ∈ ℝ", "para todo par de números reales", LAV),
        ("Cerradura", "a + b y ab siguen siendo reales", SKY),
        ("Conmutativa y asociativa", "el orden y los paréntesis no cambian", MINT),
        ("Neutros", "a + 0 = a  ·  a · 1 = a", HONEY),
        ("Inversos", "a + (−a) = 0  ·  a · (1/a) = 1, a ≠ 0", PINK),
        ("Distributiva", "a(b + c) = ab + ac", LAV),
    ]
    recap_say = "Los axiomas de campo son las reglas de la suma y el producto: cerradura, conmutativa, asociativa, neutros, inversos y distributiva."
    practice = "Arma opuestos y recíprocos, corta rectángulos y usa los axiomas como atajos"
