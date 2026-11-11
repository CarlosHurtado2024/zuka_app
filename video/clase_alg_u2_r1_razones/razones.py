"""
Álgebra R1 · Razones: comparar dividiendo (lección alg-12, parte 1 de razones y proporciones, 9:16).

Desde lo básico y sin zoom ni 3D: comparar restando o dividiendo (12 y 4 cromos; dos árboles que crecen 2 m);
notación a : b = a/b, antecedente y consecuente, el orden importa y b ≠ 0 (axiomas); simplificar 18 : 12 = 3 : 2 como
las fracciones equivalentes; sumar lo mismo deforma (foto 3 × 2 → 6 × 4 bien, 6 × 5 estirada); parte a parte y parte
al todo (3/5 = 0.6); razones con unidades (180 km en 3 h, jugos) y escala 1 : 100 000.
Spec 2026-11-11-razones-desde-cero.

    manimgl razones.py S03_Equivalentes -w -l
"""
from alg_fx import *

BROWN = "#8A5A2B"
FOX = "#F08A3C"


def squares(n, color, size=0.42, buff=0.08, per_row=12):
    g = VGroup(*[Square(size).set_fill(color, 0.9).set_stroke(INK, 1.2) for _ in range(n)])
    g.arrange_in_grid(n_cols=min(n, per_row), buff=buff)
    return g


def dots(n, color, cols, r=0.15, buff=0.12):
    g = VGroup(*[Dot(radius=r).set_fill(color, 1) for _ in range(n)])
    g.arrange_in_grid(n_cols=cols, buff=buff)
    return g


def tree(h_m, u, color=MINT, opacity=1.0):
    """Árbol de h_m metros a escala u (unidades por metro), con la base en el origen."""
    h = h_m * u
    c = min(max(0.22, h * 0.24), 0.75)
    trunk = Rectangle(0.16, h - c).set_fill(BROWN, opacity).set_stroke(width=0)
    trunk.move_to(ORIGIN, aligned_edge=DOWN)
    crown = Circle(radius=c).set_fill(color, opacity).set_stroke(width=0)
    crown.move_to(trunk.get_top() + 0.15 * c * DOWN)
    return VGroup(trunk, crown)


def photo(w0, h0, w, h, u):
    """Foto de w0 × h0 (un zorrito) estirada a w × h; u = unidades de pantalla por unidad de la foto."""
    frame = Rectangle(w0, h0).set_fill(SKY, 0.45).set_stroke(INK, 2)
    ground = Rectangle(w0, h0 * 0.22).set_fill(MINT, 0.8).set_stroke(width=0).align_to(frame, DOWN)
    r = 0.33 * min(w0, h0)
    c = frame.get_center() + 0.04 * h0 * UP
    ears = VGroup(
        Polygon(c + r * (-0.95 * RIGHT - 0.3 * UP), c + r * (-0.7 * RIGHT + 1.35 * UP), c + r * (-0.15 * RIGHT + 0.85 * UP)),
        Polygon(c + r * (0.95 * RIGHT - 0.3 * UP), c + r * (0.7 * RIGHT + 1.35 * UP), c + r * (0.15 * RIGHT + 0.85 * UP)),
    ).set_fill(FOX, 1).set_stroke(width=0)
    face = Circle(radius=r).set_fill(FOX, 1).set_stroke(width=0).move_to(c)
    snout = Ellipse(width=1.1 * r, height=0.75 * r).set_fill("#FFF3E6", 1).set_stroke(width=0).move_to(c + 0.4 * r * DOWN)
    eyes = VGroup(*[Dot(radius=0.13 * r).set_fill("#1B1B2B", 1).move_to(c + r * (s * 0.38 * RIGHT + 0.12 * UP)) for s in (-1, 1)])
    nose = Dot(radius=0.11 * r).set_fill("#1B1B2B", 1).move_to(c + 0.22 * r * DOWN)
    g = VGroup(frame, ground, ears, face, snout, eyes, nose)
    g.stretch(w / w0 * u, 0).stretch(h / h0 * u, 1)
    return g


def bus():
    body = RoundedRectangle(1.1, 0.5, corner_radius=0.12).set_fill(HONEY, 1).set_stroke(width=0)
    wins = VGroup(*[RoundedRectangle(0.2, 0.16, corner_radius=0.04).set_fill(SKY, 1).set_stroke(width=0) for _ in range(4)])
    wins.arrange(RIGHT, buff=0.05).move_to(body.get_center() + 0.08 * UP)
    wheels = VGroup(*[Circle(radius=0.1).set_fill(INK, 1).set_stroke(BG_COLOR, 2) for _ in range(2)])
    wheels[0].move_to(body.get_corner(DL) + 0.25 * RIGHT)
    wheels[1].move_to(body.get_corner(DR) + 0.25 * LEFT)
    return VGroup(body, wins, wheels)


def juice_pack(n, color):
    boxes = VGroup()
    for _ in range(n):
        b = Rectangle(0.3, 0.5).set_fill(color, 1).set_stroke(BG_COLOR, 1.5)
        straw = Line(b.get_top(), b.get_top() + 0.18 * UP + 0.06 * RIGHT).set_stroke(INK, 2)
        boxes.add(VGroup(b, straw))
    boxes.arrange_in_grid(n_rows=2, buff=0.06)
    wrap = SurroundingRectangle(boxes, buff=0.1).set_stroke(MUTED, 1.5)
    return VGroup(wrap, boxes)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Razones · Parte 1"
    title = "Razones:\ncomparar dividiendo"
    subtitle = "Razones y proporciones"


class S01_Comparar(MBScene):
    def construct(self):
        self.mark("Dos formas de comparar")
        self.set_header(R"a : b", "Comparar", MINT, P_MINT)
        self.say("Ana tiene doce cromos y Beto tiene cuatro. Esas dos cantidades se pueden comparar de dos formas.", fox=True)
        ana, beto = squares(12, PINK), squares(4, SKY)
        la, lb = TB("Ana", size=28, color=PINK), TB("Beto", size=28, color=SKY)
        rows = VGroup(VGroup(la, ana).arrange(RIGHT, buff=0.3), VGroup(lb, beto).arrange(RIGHT, buff=0.3))
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.35)
        ana.align_to(beto, LEFT)
        rows.move_to(3.9 * UP)
        self.play(FadeIn(rows[0], lag_ratio=0.1), FadeIn(rows[1], lag_ratio=0.1), run_time=1.4)
        self.hold()
        self.say("Primera forma, restando: Ana tiene ocho cromos más que Beto. La resta dice cuánto más hay.")
        extra = ana[4:]
        self.play(extra.animate.set_fill(CORAL, 0.9), run_time=0.8)
        rest = VGroup(M(R"12 - 4 = 8", size=50), T("8 cromos más", size=28, color=CORAL)).arrange(RIGHT, buff=0.5).move_to(1.7 * UP)
        self.play(Write(rest[0]), FadeIn(rest[1]))
        self.hold()
        self.say("Segunda forma, dividiendo: los cuatro cromos de Beto caben tres veces en los de Ana. Ana tiene el triple.")
        self.play(ana.animate.set_fill(PINK, 0.9), run_time=0.5)
        groups = VGroup(*[SurroundingRectangle(ana[4 * k:4 * k + 4], buff=0.05).set_stroke(HONEY, 3) for k in range(3)])
        self.play(LaggedStartMap(ShowCreation, groups, lag_ratio=0.4), run_time=1.4)
        div = VGroup(M(R"\frac{12}{4} = 3", size=50), T("3 veces", size=28, color=HONEY)).arrange(RIGHT, buff=0.5).move_to(0.1 * UP)
        self.play(Write(div[0]), FadeIn(div[1]))
        self.hold()
        self.say("Comparar dividiendo tiene un nombre: es una razón. Dice cuántas veces cabe una cantidad en la otra.")
        n = note("Comparar dividiendo = razón", color=MINT, size=32).move_to(2.0 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()

        self.mark("¿Por qué dividir?")
        self.say("Dividir dice algo que la resta no dice. Mira estos dos árboles. Hace un año uno medía dos metros y el otro diez.")
        u, ground_y = 0.4, -3.4
        ground = Line(3.6 * LEFT, 3.6 * RIGHT).set_stroke(MUTED, 3).move_to(ground_y * UP)
        a0 = tree(2, u, opacity=0.35).move_to([-1.9, ground_y, 0], aligned_edge=DOWN)
        b0 = tree(10, u, opacity=0.35).move_to([1.9, ground_y, 0], aligned_edge=DOWN)
        self.play(ShowCreation(ground), FadeIn(a0), FadeIn(b0))
        self.hold()
        self.say("Este año los dos crecieron dos metros. Restando, crecieron igual.")
        a1 = tree(4, u).move_to([-1.9, ground_y, 0], aligned_edge=DOWN)
        b1 = tree(12, u).move_to([1.9, ground_y, 0], aligned_edge=DOWN)
        self.play(FadeIn(a1), FadeIn(b1), run_time=1.2)
        la = T("2 m → 4 m", size=28, color=INK).next_to(ground, DOWN, buff=0.3).set_x(-1.9)
        lb = T("10 m → 12 m", size=28, color=INK).next_to(ground, DOWN, buff=0.3).set_x(1.9)
        self.play(FadeIn(la), FadeIn(lb))
        self.hold()
        self.say("Pero el pequeño duplicó su tamaño: cuatro entre dos da dos. El grande casi no cambió: doce entre diez es uno punto dos.")
        fa = M(R"\frac{4}{2} = 2", size=46, color=MINT).move_to([-1.9, 3.7, 0])
        fb = M(R"\frac{12}{10} = 1.2", size=46, color=HONEY).move_to([1.9, 3.7, 0])
        self.play(Write(fa), Write(fb))
        self.hold()
        self.say("La resta dice cuánto creció. La razón dice cuántas veces creció: compara tamaños relativos.")
        self.hold(0.6)
        self.end_section()


class S02_Notacion(MBScene):
    def construct(self):
        self.mark("Cómo se escribe una razón")
        self.set_header(R"a : b", "Razón", MINT, P_MINT)
        self.say("En un salón hay dieciocho niñas y doce niños. La razón de niñas a niños se escribe dieciocho, dos puntos, doce, o como una fracción.", fox=True)
        girls, boys = dots(18, PINK, 6), dots(12, SKY, 6)
        lg, lb = T("18 niñas", size=26, color=PINK), T("12 niños", size=26, color=SKY)
        cg, cb = VGroup(lg, girls).arrange(DOWN, buff=0.25), VGroup(lb, boys).arrange(DOWN, buff=0.25)
        cb.align_to(cg, UP)
        kids = VGroup(cg, cb).arrange(RIGHT, buff=0.9, aligned_edge=UP).move_to(3.6 * UP)
        self.play(FadeIn(kids, lag_ratio=0.05), run_time=1.4)
        left = VGroup(M("18", size=60, color=PINK), M(":", size=60), M("12", size=60, color=SKY)).arrange(RIGHT, buff=0.2)
        row = VGroup(left, M("=", size=60), M(R"\frac{18}{12}", size=60)).arrange(RIGHT, buff=0.35).move_to(1.4 * UP)
        self.play(Write(row))
        read = T("se lee «18 es a 12»", size=28, color=MUTED).next_to(row, DOWN, buff=0.3)
        self.play(FadeIn(read))
        self.hold()
        self.say("El primer número se llama antecedente y el segundo, consecuente.")
        ant = T("antecedente", size=26, color=PINK).move_to([left[0].get_x() - 1.1, -0.35, 0])
        con = T("consecuente", size=26, color=SKY).move_to([left[2].get_x() + 1.1, -0.35, 0])
        aa = Arrow(ant.get_top(), left[0].get_bottom(), buff=0.1, stroke_width=3).set_color(PINK)
        ac = Arrow(con.get_top(), left[2].get_bottom(), buff=0.1, stroke_width=3).set_color(SKY)
        self.play(FadeOut(read), FadeIn(ant), FadeIn(con))
        self.play(GrowArrow(aa), GrowArrow(ac))
        self.hold()
        self.say("Cuidado con dos cosas. La primera: el orden importa. Niños a niñas es doce a dieciocho, otra razón. Pasa lo mismo que con la división, que no es conmutativa.")
        o = M(R"12 : 18 \neq 18 : 12", size=46, color=INK).move_to(1.7 * DOWN)
        self.play(Write(o))
        self.hold()
        self.say("La segunda: el consecuente nunca es cero, porque no se puede dividir entre cero. Lo vimos con los axiomas.")
        z = formula_card(R"a : b = \frac{a}{b}, \quad b \neq 0", color=CORAL, size=44).move_to(3.2 * DOWN)
        self.play(FadeIn(z, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S03_Equivalentes(MBScene):
    def construct(self):
        self.mark("Simplificar una razón")
        self.set_header(R"\tfrac{18}{12} = \tfrac{3}{2}", "Equivalentes", HONEY, P_HONEY)
        self.say("Dieciocho a doce se puede simplificar como una fracción. Si formamos grupos iguales, salen seis grupos, cada uno con tres niñas y dos niños.", fox=True)
        groups = VGroup()
        for _ in range(6):
            g = VGroup(*[Dot(radius=0.15).set_fill(PINK, 1) for _ in range(3)], *[Dot(radius=0.15).set_fill(SKY, 1) for _ in range(2)])
            g.arrange(RIGHT, buff=0.1)
            box = SurroundingRectangle(g, buff=0.12).set_stroke(HONEY, 2)
            groups.add(VGroup(box, g))
        groups.arrange_in_grid(n_rows=2, buff=0.3).move_to(3.6 * UP)
        self.play(LaggedStartMap(FadeIn, groups, shift=0.2 * DOWN, lag_ratio=0.15), run_time=1.6)
        self.hold()
        self.say("Por eso dieciocho a doce es lo mismo que tres a dos: se dividieron los dos números entre seis.")
        f = M(R"\frac{18}{12} = \frac{18 \div 6}{12 \div 6} = \frac{3}{2}", size=50).move_to(1.3 * UP)
        self.play(Write(f))
        n = note("Por cada 3 niñas hay 2 niños", color=HONEY, size=30).move_to(0.3 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold()
        self.say("Es la misma regla de las fracciones equivalentes: multiplicar o dividir los dos términos por el mismo número, distinto de cero, no cambia la razón.")
        r = formula_card(R"\frac{a}{b} = \frac{a \cdot k}{b \cdot k}, \quad k \neq 0", color=HONEY, size=46).move_to(2.3 * DOWN)
        self.play(FadeIn(r, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()

        self.mark("Sumar no sirve")
        self.say("Pero sumar lo mismo a los dos términos sí cambia la razón. Mira esta foto de tres de ancho por dos de alto.")
        u = 0.42
        orig = photo(3, 2, 3, 2, u).move_to(3.7 * UP)
        lo = T("3 × 2", size=26, color=MUTED).next_to(orig, DOWN, buff=0.15)
        self.play(FadeIn(orig), FadeIn(lo))
        self.hold()
        self.say("Si multiplicamos los dos lados por dos, queda de seis por cuatro: la foto se ve igual, solo que más grande.")
        good = photo(3, 2, 6, 4, u).move_to([-1.75, -0.8, 0], aligned_edge=DOWN)
        lg = M(R"3 : 2 = 6 : 4", size=36, color=MINT).next_to(good, DOWN, buff=0.25)
        tg = T("× 2  a los dos", size=24, color=MINT).next_to(lg, DOWN, buff=0.12)
        self.play(TransformFromCopy(orig, good), run_time=1.2)
        self.play(FadeIn(lg), FadeIn(tg))
        self.hold()
        self.say("Si en cambio sumamos tres a los dos lados, queda de seis por cinco, y el zorrito se estira: la razón ya no es la misma.")
        bad = photo(3, 2, 6, 5, u).move_to([1.75, -0.8, 0], aligned_edge=DOWN)
        lb = M(R"3 : 2 \neq 6 : 5", size=36, color=CORAL).next_to(bad, DOWN, buff=0.25)
        tb = T("+ 3  a los dos", size=24, color=CORAL).next_to(lb, DOWN, buff=0.12)
        self.play(TransformFromCopy(orig, bad), run_time=1.2)
        self.play(FadeIn(lb), FadeIn(tb))
        self.hold()
        self.say("Por eso una razón se agranda o se achica multiplicando, nunca sumando.")
        k = note("Las razones se escalan multiplicando", color=LAV, size=30).move_to(3.6 * DOWN)
        self.play(FadeIn(k, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S04_ParteTodo(MBScene):
    def construct(self):
        self.mark("Parte a parte y parte al todo")
        self.set_header(R"\tfrac{3}{5}", "Parte y todo", PINK, P_PINK)
        self.say("Volvamos al salón. Tres a dos compara una parte con la otra parte: niñas con niños. También se puede comparar una parte con el todo.", fox=True)
        g = VGroup(*[Dot(radius=0.3).set_fill(PINK, 1) for _ in range(3)], *[Dot(radius=0.3).set_fill(SKY, 1) for _ in range(2)])
        g.arrange(RIGHT, buff=0.3).move_to(3.9 * UP)
        self.play(LaggedStartMap(GrowFromCenter, g, lag_ratio=0.15))
        b1 = Brace(Line(g[0].get_corner(DL), g[2].get_corner(DR)), DOWN, buff=0.12).set_color(PINK)
        t1 = T("3 niñas", size=24, color=PINK).next_to(b1, DOWN, buff=0.08)
        b2 = Brace(Line(g[3].get_corner(DL), g[4].get_corner(DR)), DOWN, buff=0.12).set_color(SKY)
        t2 = T("2 niños", size=24, color=SKY).next_to(b2, DOWN, buff=0.08)
        b3 = Brace(Line(g[0].get_corner(UL), g[4].get_corner(UR)), UP, buff=0.12).set_color(HONEY)
        t3 = T("5 en total", size=24, color=HONEY).next_to(b3, UP, buff=0.08)
        self.play(GrowFromCenter(b1), FadeIn(t1), GrowFromCenter(b2), FadeIn(t2))
        pp = T("parte a parte:   niñas : niños = 3 : 2", size=30, color=INK).move_to(2.0 * UP)
        self.play(FadeIn(pp))
        self.hold()
        self.say("Por cada grupo de cinco estudiantes, tres son niñas. La razón de niñas al total es tres a cinco.")
        self.play(GrowFromCenter(b3), FadeIn(t3))
        pt = T("parte al todo:   niñas : total = 3 : 5", size=30, color=INK).move_to(1.2 * UP)
        self.play(FadeIn(pt))
        self.hold()
        self.say("Tres quintos es una fracción del grupo y, como aprendiste con los racionales, en decimal es cero punto seis.")
        f = M(R"\frac{3}{5} = 0.6", size=56, color=PINK).move_to(0.6 * DOWN)
        self.play(Write(f))
        self.hold()
        self.say("Así, en un salón de treinta estudiantes con esa razón hay tres quintos de treinta: dieciocho niñas, justo las del ejemplo.")
        c = M(R"\frac{3}{5} \cdot 30 = 18", size=50).move_to(2.1 * DOWN)
        self.play(Write(c))
        self.hold()
        n = note("Parte a parte 3 : 2  ·  parte al todo 3 : 5", color=PINK, size=28).move_to(3.6 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S05_Unidades(MBScene):
    def construct(self):
        self.mark("Razones con unidades")
        self.set_header(R"\text{km/h}", "Con unidades", SKY, P_SKY)
        self.say("Cuando las dos cantidades miden cosas distintas, la razón lleva unidades. Un bus recorre ciento ochenta kilómetros en tres horas.", fox=True)
        road = Line(3.0 * LEFT, 3.0 * RIGHT).set_stroke(MUTED, 6).move_to(3.4 * UP)
        ticks = VGroup(*[Line(0.15 * UP, 0.15 * DOWN).set_stroke(INK, 3).move_to(road.point_from_proportion(k / 3)) for k in range(4)])
        kms = VGroup(*[T(f"{60 * k} km", size=22, color=MUTED).next_to(ticks[k], DOWN, buff=0.15) for k in range(4)])
        hrs = VGroup(*[T(f"{k} h", size=22, color=SKY).next_to(ticks[k], DOWN, buff=0.55) for k in range(4)])
        b = bus().next_to(road.get_start(), UP, buff=0.05).shift(0.55 * RIGHT)
        self.play(ShowCreation(road), FadeIn(ticks), FadeIn(kms), FadeIn(hrs), FadeIn(b))
        self.play(b.animate.next_to(road.get_end(), UP, buff=0.05).shift(0.55 * LEFT), run_time=3, rate_func=linear)
        self.hold()
        self.say("Si dividimos los kilómetros entre las horas, sale la rapidez: sesenta kilómetros por cada hora.")
        f = M(R"\frac{180\ \text{km}}{3\ \text{h}} = 60\ \text{km/h}", size=50, color=SKY).move_to(1.2 * UP)
        self.play(Write(f))
        self.hold(0.5)
        self.end_section()

        self.mark("Precio por unidad")
        self.say("Con la misma idea se descubre qué sale más barato. Un paquete de seis jugos cuesta siete mil doscientos pesos y uno de ocho jugos cuesta nueve mil doscientos.")
        pa, pb = juice_pack(6, HONEY), juice_pack(8, PINK)
        ca = VGroup(pa, T("6 jugos", size=24, color=INK), T("$7 200", size=28, color=HONEY)).arrange(DOWN, buff=0.18)
        cb = VGroup(pb, T("8 jugos", size=24, color=INK), T("$9 200", size=28, color=PINK)).arrange(DOWN, buff=0.18)
        cb.align_to(ca, DOWN)
        packs = VGroup(ca, cb).arrange(RIGHT, buff=1.4, aligned_edge=DOWN).move_to(3.3 * UP)
        self.play(FadeIn(packs, shift=0.2 * DOWN))
        self.hold()
        self.say("No sirve comparar los precios así nomás, porque los paquetes traen distinto número de jugos. Hay que comparar el precio de un solo jugo: dividir el precio entre los jugos.")
        fa = M(R"\frac{7200}{6} = 1200", size=40, color=HONEY).move_to([ca.get_x(), 0.9, 0])
        fb = M(R"\frac{9200}{8} = 1150", size=40, color=PINK).move_to([cb.get_x(), 0.9, 0])
        self.play(Write(fa), Write(fb))
        self.hold()
        self.hold()
        self.say("Mil ciento cincuenta pesos por jugo contra mil doscientos: el paquete de ocho sale más barato, aunque cueste más en total.")
        ok = check_mark(MINT, size=56).next_to(fb, DOWN, buff=0.3)
        n = note("Por jugo, el paquete de 8 sale más barato", color=MINT, size=28).move_to(1.6 * DOWN)
        self.play(FadeIn(ok, scale=0.6), FadeIn(n, shift=0.2 * UP))
        self.hold()
        self.say("Estas razones con unidades se llaman tasas unitarias: dicen cuánto corresponde a una sola unidad, como el precio unitario o la rapidez.")
        u = M(R"\text{pesos por jugo} \qquad \text{km por hora}", size=38, color=MUTED).move_to(3.0 * DOWN)
        self.play(FadeIn(u))
        self.hold(0.6)
        self.end_section()


class S06_Escala(MBScene):
    def construct(self):
        self.mark("La escala de un mapa")
        self.set_header(R"1 : 100\,000", "Escala", HONEY, P_HONEY)
        self.say("Los mapas también usan razones. La escala uno a cien mil quiere decir que cada centímetro del mapa son cien mil centímetros de la realidad.", fox=True)
        card = RoundedRectangle(6.6, 3.4, corner_radius=0.25).set_fill(PEACH, 1).set_stroke(HONEY, 2).move_to(3.0 * UP)
        land = VGroup(
            Ellipse(width=2.2, height=0.8).set_fill(MINT, 0.35).set_stroke(width=0).move_to(card.get_center() + 0.2 * LEFT + 0.95 * UP),
            Ellipse(width=1.2, height=0.6).set_fill(MINT, 0.35).set_stroke(width=0).move_to(card.get_center() + 2.3 * RIGHT + 1.05 * UP),
        )
        A = card.get_center() + 2.25 * LEFT + 0.2 * DOWN
        B = card.get_center() + 2.25 * RIGHT + 0.2 * DOWN
        roadm = Line(A, B).set_stroke(INK, 3)
        towns = VGroup(Dot(A, radius=0.14).set_fill(PINK, 1), Dot(B, radius=0.14).set_fill(SKY, 1))
        na = T("Pueblo A", size=22, color=PINK).next_to(towns[0], UP, buff=0.15)
        nb = T("Pueblo B", size=22, color=SKY).next_to(towns[1], UP, buff=0.15)
        sc = T("escala 1 : 100 000", size=20, color=MUTED).move_to(card.get_corner(DR) + 1.25 * LEFT + 0.3 * UP)
        self.play(FadeIn(card), FadeIn(land), FadeIn(sc))
        self.play(ShowCreation(roadm), FadeIn(towns), FadeIn(na), FadeIn(nb))
        self.hold()
        self.say("Con una regla medimos la distancia entre los dos pueblos en el mapa: cuatro punto cinco centímetros.")
        ruler = Line(A, B).set_stroke(HONEY, 6).shift(0.75 * DOWN)
        rl = T("4.5 cm", size=26, color=HONEY).next_to(ruler, DOWN, buff=0.12)
        self.play(ShowCreation(ruler), FadeIn(rl))
        self.hold()
        self.say("Cien mil centímetros son mil metros, es decir, un kilómetro. Así que cada centímetro del mapa es un kilómetro de verdad.")
        s1 = M(R"100\,000\ \text{cm} = 1\,000\ \text{m} = 1\ \text{km}", size=42).move_to(0.4 * DOWN)
        s1.set_max_width(7.0)
        self.play(Write(s1))
        self.hold()
        self.say("Entonces los pueblos están a cuatro punto cinco kilómetros en la realidad.")
        s2 = M(R"4.5\ \text{cm del mapa} \;\to\; 4.5\ \text{km}", size=44, color=HONEY).move_to(1.6 * DOWN)
        s2.set_max_width(7.0)
        self.play(Write(s2))
        self.hold()
        self.say("Fíjate en que la escala compara dos longitudes en la misma unidad, centímetros con centímetros. Por eso no lleva unidades: es solo un número.")
        n = note("Misma unidad arriba y abajo: la razón no lleva unidades", color=HONEY, size=26).move_to(3.2 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S07_Cierre(AlgCierre):
    recap = [
        ("Razón", "a : b = a/b compara dividiendo (b ≠ 0)", MINT),
        ("El orden importa", "18 : 12 no es lo mismo que 12 : 18", SKY),
        ("Equivalentes", "multiplica o divide los dos: 18 : 12 = 3 : 2", HONEY),
        ("Sumar no sirve", "3 : 2 ≠ 6 : 5, la foto se deforma", CORAL),
        ("Parte y todo", "3 de cada 5 = 3/5 = 0.6", PINK),
        ("Con unidades", "180 km en 3 h = 60 km/h", SKY),
        ("Escala", "1 : 100 000 → 1 cm del mapa es 1 km", HONEY),
    ]
    recap_say = "Una razón compara dos cantidades dividiéndolas, y se agranda o se achica multiplicando los dos términos por el mismo número."
    practice = "Mezcla limonada, llena bolsas y amplía fotos sin deformarlas"
