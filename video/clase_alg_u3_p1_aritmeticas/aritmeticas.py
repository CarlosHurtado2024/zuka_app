"""
Álgebra P1 · Sucesiones y progresiones aritméticas (lección alg-14, parte 1 de progresiones, 9:16).

Desde lo básico y sin zoom ni 3D: sucesión como lista ordenada con puestos naturales (cuadrados de puntos 1, 4, 9, 16;
notación aₙ); término general (aₙ = n²) y regla recursiva (pares); aritmética: misma diferencia d (ahorro 20, 25, 30
mil; vela 30, 28, 26; d = 0); revisar todos los saltos (1, 2, 4, 8 no); término general contando saltos (a₂₀ de 7, 11,
15 = 83) y su gráfica (puntos sobre una recta que no pasa por el origen, como el taxi); dos datos a₃ = 10 y a₈ = 25;
medios aritméticos entre 2 y 18. Spec 2026-11-11-progresiones-desde-cero.

    manimgl aritmeticas.py S03_TerminoGeneral -w -l
"""
from alg_fx import *


def hop(p, q, label, color, up=True, size=24):
    """Salto curvo de p a q con su rótulo encima (o debajo)."""
    arc = ArcBetweenPoints(p, q, angle=-PI / 2.2 if up else PI / 2.2).set_stroke(color, 3)
    t = T(label, size=size, color=color).next_to(arc, UP if up else DOWN, buff=0.06)
    return VGroup(arc, t)


def dot_square(k, color, r=0.07, buff=0.07):
    g = VGroup(*[Dot(radius=r).set_fill(color, 1) for _ in range(k * k)])
    g.arrange_in_grid(n_rows=k, n_cols=k, buff=buff)
    return g


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Progresiones · Parte 1"
    title = "Sucesiones y\nprogresiones aritméticas"
    subtitle = "Sumar siempre lo mismo"


class S01_Sucesion(MBScene):
    def construct(self):
        self.mark("Qué es una sucesión")
        self.set_header(R"a_n", "Sucesión", LAV, P_LAV)
        self.say("Una sucesión es una lista de números puesta en orden: hay un primero, un segundo, un tercero, y así sin parar.", fox=True)
        sq = VGroup(*[dot_square(k, LAV) for k in range(1, 5)]).arrange(RIGHT, buff=0.6, aligned_edge=DOWN).move_to(3.6 * UP)
        nums = VGroup(*[M(str(k * k), size=40) for k in range(1, 5)])
        for n, s in zip(nums, sq):
            n.next_to(s, DOWN, buff=0.25)
        nums.align_to(nums[-1], DOWN)
        dots3 = M(R"\dots", size=40).next_to(nums, RIGHT, buff=0.4)
        self.play(LaggedStartMap(FadeIn, sq, shift=0.2 * UP, lag_ratio=0.3), run_time=1.6)
        self.play(FadeIn(nums), FadeIn(dots3))
        self.hold()
        self.say("Son los números cuadrados que vimos con las potencias. Cada número tiene su puesto, y los puestos son los naturales: uno, dos, tres. El término del puesto n se escribe a sub n.")
        labs = VGroup(*[M(f"a_{k}", size=34, color=SKY).next_to(nums[k - 1], DOWN, buff=0.25) for k in range(1, 5)])
        labs.align_to(labs[-1], UP)
        self.play(FadeIn(labs, lag_ratio=0.2))
        self.hold()
        self.say("Si hay un patrón, una fórmula da cualquier término sin escribir los anteriores: es el término general. Aquí cada término es su puesto al cuadrado.")
        tg = formula_card(R"a_n = n^2 \qquad a_{10} = 10^2 = 100", color=LAV, size=44).move_to(0.6 * UP)
        self.play(FadeIn(tg, shift=0.2 * UP))
        self.hold()
        self.say("Otra forma de describir una sucesión es con una regla que pasa de un término al siguiente. Los pares empiezan en dos y suman dos cada vez.")
        pares = VGroup(*[M(str(v), size=44, color=MINT) for v in (2, 4, 6, 8, 10)]).arrange(RIGHT, buff=0.75).move_to(1.6 * DOWN)
        hops = VGroup(*[hop(pares[i].get_top() + 0.1 * UP, pares[i + 1].get_top() + 0.1 * UP, "+2", MINT) for i in range(4)])
        self.play(FadeIn(pares, lag_ratio=0.2))
        self.play(LaggedStartMap(ShowCreation, VGroup(*[h[0] for h in hops]), lag_ratio=0.2), FadeIn(VGroup(*[h[1] for h in hops])))
        rec = M(R"a_1 = 2, \quad a_{n+1} = a_n + 2 \qquad (a_n = 2n)", size=38).move_to(3.3 * DOWN)
        rec.set_max_width(7.2)
        self.play(Write(rec))
        self.hold(0.6)
        self.end_section()


class S02_Aritmetica(MBScene):
    def construct(self):
        self.mark("Sumar siempre lo mismo")
        self.set_header(R"+d", "Aritmética", MINT, P_MINT)
        self.say("Sara tiene veinte mil pesos ahorrados y cada semana guarda cinco mil más.", fox=True)
        vals = [20, 25, 30, 35, 40]
        bars = VGroup(*[Rectangle(0.8, v * 0.075).set_fill(MINT, 0.8).set_stroke(width=0) for v in vals]).arrange(RIGHT, buff=0.45, aligned_edge=DOWN)
        bars.move_to(1.6 * UP, aligned_edge=DOWN)
        labs = VGroup(*[T(f"{v} mil", size=22, color=INK).next_to(b, DOWN, buff=0.15) for v, b in zip(vals, bars)])
        weeks = VGroup(*[T(f"sem. {k}", size=18, color=MUTED).next_to(l, DOWN, buff=0.08) for k, l in enumerate(labs, 1)])
        self.play(LaggedStartMap(GrowFromEdge, bars, edge=DOWN, lag_ratio=0.2), FadeIn(labs), FadeIn(weeks), run_time=1.8)
        hops = VGroup(*[hop(bars[i].get_top() + 0.1 * UP, bars[i + 1].get_top() + 0.1 * UP, "+5", HONEY, size=22) for i in range(4)])
        self.play(LaggedStartMap(FadeIn, hops, lag_ratio=0.2))
        self.hold()
        self.say("Cuando se suma siempre el mismo número, la sucesión es una progresión aritmética. Ese número fijo se llama diferencia, porque es la resta de un término menos el anterior.")
        d = formula_card(R"d = a_{n+1} - a_n = 5", color=MINT, size=46).move_to(1.0 * DOWN)
        self.play(FadeIn(d, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()

        self.mark("Diferencia negativa o cero")
        self.say("La diferencia también puede ser negativa. Una vela de treinta centímetros se gasta dos centímetros cada hora: treinta, veintiocho, veintiséis, veinticuatro.")
        cv = [30, 28, 26, 24]
        candles = VGroup()
        for v in cv:
            body = Rectangle(0.55, v * 0.09).set_fill("#FFF3E6", 1).set_stroke(width=0)
            flame = Polygon(UP * 0.32, LEFT * 0.12, RIGHT * 0.12).set_fill(HONEY, 1).set_stroke(width=0).next_to(body, UP, buff=0.04)
            candles.add(VGroup(body, flame))
        candles.arrange(RIGHT, buff=0.75, aligned_edge=DOWN).move_to(1.3 * UP, aligned_edge=DOWN)
        cl = VGroup(*[T(f"{v} cm", size=22).next_to(c, DOWN, buff=0.15) for v, c in zip(cv, candles)])
        self.play(LaggedStartMap(FadeIn, candles, lag_ratio=0.2), FadeIn(cl))
        dn = M(R"d = -2", size=50, color=CORAL).move_to(0.2 * DOWN)
        self.play(Write(dn))
        self.hold()
        self.say("Y si la diferencia es cero, la sucesión se queda quieta: siete, siete, siete. También es aritmética.")
        z = M(R"7,\ 7,\ 7,\ 7,\ \dots \qquad d = 0", size=46).move_to(1.5 * DOWN)
        self.play(Write(z))
        self.hold(0.6)
        self.end_section()

        self.mark("Revisar todos los saltos")
        self.say("Cuidado: para decidir hay que revisar todos los saltos, no solo el primero. En uno, dos, cuatro, ocho, el primer salto es uno, pero el siguiente es dos y luego cuatro. No es aritmética.")
        seq = VGroup(*[M(str(v), size=50) for v in (1, 2, 4, 8)]).arrange(RIGHT, buff=1.1).move_to(2.6 * UP)
        hs = VGroup(*[hop(seq[i].get_top() + 0.1 * UP, seq[i + 1].get_top() + 0.1 * UP, f"+{s}", CORAL) for i, s in enumerate((1, 2, 4))])
        self.play(FadeIn(seq, lag_ratio=0.2))
        self.play(LaggedStartMap(FadeIn, hs, lag_ratio=0.3))
        x = ex_mark(CORAL, size=60).next_to(seq, DOWN, buff=0.4)
        self.play(FadeIn(x, scale=0.6))
        n = note("Aritmética: todos los saltos iguales", color=MINT, size=30).move_to(0.8 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S03_TerminoGeneral(MBScene):
    def construct(self):
        self.mark("Contar los saltos")
        self.set_header(R"a_n", "Término general", HONEY, P_HONEY)
        self.say("Para hallar el término veinte de siete, once, quince, no hace falta escribir los veinte. Basta contar saltos.", fox=True)
        line = get_number_line((5, 25, 2), width=7.0, font_size=22).move_to(3.0 * UP)
        vals = [7, 11, 15, 19, 23]
        pts = VGroup(*[Dot(line.n2p(v), radius=0.11).set_fill(HONEY, 1) for v in vals])
        labs = VGroup(*[M(f"a_{k}", size=30, color=HONEY).next_to(p, DOWN, buff=0.55) for k, p in enumerate(pts, 1)])
        self.play(ShowCreation(line))
        self.play(LaggedStartMap(GrowFromCenter, pts, lag_ratio=0.2), FadeIn(labs, lag_ratio=0.2))
        hs = VGroup(*[hop(pts[i].get_center() + 0.15 * UP, pts[i + 1].get_center() + 0.15 * UP, "+4", MINT, size=22) for i in range(4)])
        self.play(LaggedStartMap(FadeIn, hs, lag_ratio=0.2))
        self.hold()
        self.say("Para llegar al término dos se da un salto; al tres, dos saltos; al cinco, cuatro saltos. Siempre un salto menos que el puesto.")
        e = M(R"a_5 = 7 + 4 \cdot 4 = 23", size=46).move_to(1.3 * UP)
        self.play(Write(e))
        self.hold()
        self.say("En general, al término n se llega con n menos uno saltos de tamaño d. Esa es la fórmula del término general.")
        f = formula_card(R"a_n = a_1 + (n - 1)\,d", color=HONEY, size=52).move_to(0.1 * DOWN)
        self.play(FadeIn(f, shift=0.2 * UP))
        self.hold()
        self.say("El término veinte es siete más diecinueve saltos de cuatro: ochenta y tres.")
        a20 = M(R"a_{20} = 7 + 19 \cdot 4 = 83", size=48, color=MINT).move_to(1.6 * DOWN)
        self.play(Write(a20))
        self.hold(0.6)
        self.end_section()

        self.mark("La gráfica")
        self.say("Si se dibuja cada puesto con su término, los puntos quedan sobre una recta: suben lo mismo en cada paso.")
        plane = get_plane((0, 6), (0, 25), 1.05, numbers=False, unit_y=0.2).move_to(1.6 * UP)
        ax = plane.axes
        xl = VGroup(*[T(str(i), size=20, color=MUTED).next_to(ax.c2p(i, 0), DOWN, buff=0.08) for i in range(1, 6)])
        yl = VGroup(*[T(str(v), size=18, color=MUTED).next_to(ax.c2p(0, v), LEFT, buff=0.08) for v in (7, 15, 23)])
        xn = T("puesto n", size=20, color=MUTED).next_to(ax.c2p(6, 0), DOWN, buff=0.35).shift(0.4 * LEFT)
        self.play(FadeIn(plane), FadeIn(xl), FadeIn(yl), FadeIn(xn))
        gp = VGroup(*[dot(ax, k, 3 + 4 * k, HONEY) for k in range(1, 6)])
        self.play(LaggedStartMap(GrowFromCenter, gp, lag_ratio=0.2))
        ln = DashedLine(ax.c2p(0, 3), ax.c2p(5.5, 25)).set_stroke(MUTED, 2)
        self.play(ShowCreation(ln))
        self.hold()
        self.say("Como el taxi de las proporciones, la recta no pasa por el origen. Y solo hay puntos sueltos: los puestos son naturales, no existe el término uno y medio.")
        n = note("Puntos sobre una recta, solo en n = 1, 2, 3, …", color=HONEY, size=26).move_to(2.6 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S04_DosDatos(MBScene):
    def construct(self):
        self.mark("Con dos términos")
        self.set_header(R"a_3,\ a_8", "Dos datos", SKY, P_SKY)
        self.say("A veces solo se conocen dos términos. Si el tercero es diez y el octavo es veinticinco, se puede reconstruir toda la progresión.", fox=True)
        line = get_number_line((0, 26, 5), width=7.0, font_size=22).move_to(3.2 * UP)
        a3, a8 = Dot(line.n2p(10), radius=0.12).set_fill(SKY, 1), Dot(line.n2p(25), radius=0.12).set_fill(SKY, 1)
        l3 = M("a_3", size=32, color=SKY).next_to(a3, UP, buff=0.2)
        l8 = M("a_8", size=32, color=SKY).next_to(a8, UP, buff=0.2)
        self.play(ShowCreation(line), GrowFromCenter(a3), GrowFromCenter(a8), FadeIn(l3), FadeIn(l8))
        br = Brace(Line(line.n2p(10), line.n2p(25)), DOWN, buff=0.55).set_color(MINT)
        bt = T("5 saltos que suman 15", size=24, color=MINT).next_to(br, DOWN, buff=0.1)
        self.play(GrowFromCenter(br), FadeIn(bt))
        self.hold()
        self.say("Del puesto tres al ocho hay cinco saltos, y la distancia entre los dos términos es quince. Cada salto mide tres.")
        s1 = M(R"5\,d = 25 - 10 = 15 \;\Rightarrow\; d = 3", size=44).move_to(0.8 * UP)
        self.play(Write(s1))
        self.hold()
        self.say("Para el primer término se retroceden dos saltos desde el tercero: diez menos seis, cuatro.")
        s2 = M(R"a_1 = 10 - 2 \cdot 3 = 4", size=44).move_to(0.3 * DOWN)
        self.play(Write(s2))
        card = formula_card(R"a_n = 4 + (n - 1) \cdot 3", color=SKY, size=46).move_to(1.7 * DOWN)
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()

        self.mark("Medios aritméticos")
        self.say("Meter números entre otros dos es la misma idea. Entre dos y dieciocho caben tres medios aritméticos. Con tres números adentro quedan cuatro saltos iguales.")
        line = get_number_line((0, 20, 2), width=7.0, font_size=22).move_to(2.8 * UP)
        ends = VGroup(Dot(line.n2p(2), radius=0.12).set_fill(MINT, 1), Dot(line.n2p(18), radius=0.12).set_fill(MINT, 1))
        slots = VGroup(*[Circle(radius=0.13).set_stroke(MUTED, 2).move_to(line.n2p(v) + 0.75 * UP) for v in (6, 10, 14)])
        self.play(ShowCreation(line), FadeIn(ends), FadeIn(slots))
        self.hold()
        self.say("La distancia es dieciséis y se reparte en cuatro saltos: cada salto es cuatro. Los medios son seis, diez y catorce.")
        s = M(R"18 = 2 + 4\,d \;\Rightarrow\; d = 4", size=44).move_to(0.9 * UP)
        self.play(Write(s))
        mids = VGroup(*[Dot(line.n2p(v), radius=0.12).set_fill(HONEY, 1) for v in (6, 10, 14)])
        self.play(*[Transform(c, d) for c, d in zip(slots, mids)])
        hs = VGroup(*[hop(line.n2p(a) + 0.15 * UP, line.n2p(a + 4) + 0.15 * UP, "+4", HONEY, size=20) for a in (2, 6, 10, 14)])
        self.play(LaggedStartMap(FadeIn, hs, lag_ratio=0.2))
        res = M(R"2,\ \mathbf{6},\ \mathbf{10},\ \mathbf{14},\ 18", size=48, color=HONEY).move_to(0.4 * DOWN)
        self.play(Write(res))
        self.hold(0.6)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("Sucesión", "lista ordenada: a₁, a₂, a₃, … con puestos naturales", LAV),
        ("Término general", "una fórmula para el puesto n: aₙ = n²", LAV),
        ("Aritmética", "suma siempre la misma diferencia d", MINT),
        ("d puede ser", "positiva (+5), negativa (−2) o cero", CORAL),
        ("Saltos", "aₙ = a₁ + (n − 1)d · a₂₀ = 7 + 19 · 4 = 83", HONEY),
        ("Dos datos", "a₃ = 10, a₈ = 25 → d = 3, a₁ = 4", SKY),
        ("Medios", "entre 2 y 18: 6, 10, 14", HONEY),
    ]
    recap_say = "Una progresión aritmética suma siempre la misma diferencia, y el término n se alcanza con n menos uno saltos."
    practice = "Pisa huellas, ajusta escaleras y rellena los medios"
