"""
Álgebra R2 · Proporciones y magnitudes proporcionales (lección alg-12e, parte 2 de razones, 9:16).

Desde lo básico y sin zoom ni 3D: proporción como igualdad de razones (recetas 4 : 6 y 10 : 15), «a es a b como c es
a d», extremos y medios; productos cruzados y por qué (multiplicar por bd, el recíproco de los axiomas); 2/3 y 5/7 no;
término desconocido x/8 = 9/12; media proporcional 4/x = x/9 y 2/x = x/3 → √6 (irracional); directa con cuadernos
(k = y/x, recta por el origen); inversa con 24 caramelos (xy = 24, curva); ninguna: el taxi con tarifa fija;
reparto de 45 000 en 2 : 3 : 4. Spec 2026-11-11-razones-desde-cero.

    manimgl proporciones.py S04_Directa -w -l
"""
from alg_fx import *


def icons(n, kind, cols=5):
    if kind == "egg":
        g = VGroup(*[Ellipse(width=0.26, height=0.34).set_fill("#FFF6E0", 1).set_stroke(width=0) for _ in range(n)])
    else:
        g = VGroup(*[RoundedRectangle(0.26, 0.3, corner_radius=0.05).set_fill(HONEY, 1).set_stroke(width=0) for _ in range(n)])
    g.arrange_in_grid(n_cols=min(cols, n), buff=0.1)
    return g


def table(rows, colors, first_w=1.9, cell_w=1.25, size=26):
    """Tabla de dos filas: rows = [[etiqueta, v1, v2, ...], ...]."""
    out = VGroup()
    for r, row in enumerate(rows):
        cells = VGroup()
        for c, v in enumerate(row):
            w = first_w if c == 0 else cell_w
            box = Rectangle(w, 0.62).set_fill(PEACH if c == 0 else CARD, 1).set_stroke(BORDER, 1.5)
            t = T(v, size=size if c else size - 2, color=colors[r] if c else INK)
            t.set_max_width(w - 0.16)
            cells.add(VGroup(box, t.move_to(box)))
        cells.arrange(RIGHT, buff=0)
        out.add(cells)
    out.arrange(DOWN, buff=0)
    return out


def hop(a, b, label, color, up=True):
    """Flechita curva de la celda a a la celda b con su etiqueta."""
    d = UP if up else DOWN
    arc = CurvedArrow(a.get_edge_center(d) + 0.05 * d, b.get_edge_center(d) + 0.05 * d, angle=-TAU / 5 if up else TAU / 5)
    arc.set_color(color)
    t = T(label, size=22, color=color).next_to(arc, d, buff=0.05)
    return VGroup(arc, t)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Razones · Parte 2"
    title = "Proporciones y\nmagnitudes"
    subtitle = "Directa, inversa o ninguna"


class S01_Proporcion(MBScene):
    def construct(self):
        self.mark("Qué es una proporción")
        self.set_header(R"\tfrac{a}{b} = \tfrac{c}{d}", "Proporción", LAV, P_LAV)
        self.say("Una receta de pan lleva cuatro huevos por cada seis tazas de harina. Otra receta, más grande, lleva diez huevos por quince tazas.", fox=True)
        cards = VGroup()
        for eggs, cups, name in [(4, 6, "Receta pequeña"), (10, 15, "Receta grande")]:
            e, c = icons(eggs, "egg"), icons(cups, "cup")
            body = VGroup(TB(name, size=24, color=LAV),
                          VGroup(e, T(f"{eggs} huevos", size=22, color=INK)).arrange(DOWN, buff=0.12),
                          VGroup(c, T(f"{cups} tazas", size=22, color=HONEY)).arrange(DOWN, buff=0.12)).arrange(DOWN, buff=0.25)
            cards.add(body)
        cards[1].align_to(cards[0], UP)
        cards.arrange(RIGHT, buff=1.2, aligned_edge=UP).move_to(3.4 * UP)
        boxes = VGroup(*[get_card(c, color=LAV, fill=PEACH, buff=0.22) for c in cards])
        self.play(FadeIn(boxes), LaggedStartMap(FadeIn, cards, lag_ratio=0.3), run_time=1.6)
        self.hold()
        self.say("Las dos razones valen lo mismo: cuatro sextos y diez quinceavos se simplifican a dos tercios. Por eso los dos panes saben igual.")
        f = M(R"\frac{4}{6} = \frac{2}{3} = \frac{10}{15}", size=56).move_to(0.5 * UP)
        self.play(Write(f))
        self.hold()
        self.say("Cuando escribimos que dos razones son iguales, tenemos una proporción.")
        p = formula_card(R"\frac{4}{6} = \frac{10}{15}", color=LAV, size=52).move_to(1.4 * DOWN)
        lab = T("proporción: dos razones iguales", size=26, color=LAV).next_to(p, DOWN, buff=0.25)
        self.play(FadeIn(p, shift=0.2 * UP), FadeIn(lab))
        self.hold(0.6)
        self.end_section()

        self.mark("Extremos y medios")
        self.say("En general se escribe a es a b como c es a d. Los de afuera, a y d, se llaman extremos. Los de adentro, b y c, se llaman medios.")
        parts = VGroup(*[M(s, size=80, color=c) for s, c in
                         [("a", HONEY), (":", INK), ("b", SKY), ("=", INK), ("c", SKY), (":", INK), ("d", HONEY)]]).arrange(RIGHT, buff=0.3)
        parts.move_to(2.0 * UP)
        read = T("«a es a b como c es a d»", size=28, color=MUTED).move_to(3.9 * UP)
        self.play(Write(parts), FadeIn(read))
        top = ArcBetweenPoints(parts[0].get_top() + 0.15 * UP, parts[6].get_top() + 0.15 * UP, angle=-PI / 3).set_stroke(HONEY, 4)
        tl = T("extremos", size=26, color=HONEY).next_to(top, UP, buff=0.1)
        bot = ArcBetweenPoints(parts[2].get_bottom() + 0.15 * DOWN, parts[4].get_bottom() + 0.15 * DOWN, angle=PI / 2).set_stroke(SKY, 4)
        bl = T("medios", size=26, color=SKY).next_to(bot, DOWN, buff=0.1)
        self.play(FadeOut(read), ShowCreation(top), FadeIn(tl))
        self.play(ShowCreation(bot), FadeIn(bl))
        self.hold()
        frac = M(R"\frac{a}{b} = \frac{c}{d}", size=64).move_to(1.8 * DOWN)
        nb = T("también se escribe así", size=24, color=MUTED).next_to(frac, DOWN, buff=0.25)
        self.play(Write(frac), FadeIn(nb))
        self.hold(0.6)
        self.end_section()


class S02_Cruzados(MBScene):
    def construct(self):
        self.mark("Productos cruzados")
        self.set_header(R"ad = bc", "Productos cruzados", MINT, P_MINT)
        self.say("Las proporciones tienen una propiedad que las vuelve muy útiles: el producto de los extremos es igual al producto de los medios.", fox=True)
        f = M(R"\frac{4}{6} = \frac{10}{15}", size=80, t2c={"4": HONEY, "15": HONEY, "6": SKY, "10": SKY}).move_to(3.5 * UP)
        self.play(Write(f))
        lx, lm = T("extremos: 4 y 15", size=26, color=HONEY), T("medios: 6 y 10", size=26, color=SKY)
        VGroup(lx, lm).arrange(RIGHT, buff=0.8).next_to(f, DOWN, buff=0.35)
        self.play(FadeIn(lx), FadeIn(lm))
        p = VGroup(M(R"4 \cdot 15 = 60", size=46, color=HONEY), M(R"6 \cdot 10 = 60", size=46, color=SKY)).arrange(RIGHT, buff=0.9).move_to(1.0 * UP)
        self.play(Write(p[0]))
        self.play(Write(p[1]))
        self.hold()
        self.say("Por eso, para saber si dos razones forman proporción, basta multiplicar en cruz. Dos tercios y cinco séptimos no la forman: dos por siete es catorce, y tres por cinco es quince.")
        g = M(R"\frac{2}{3} \;\text{y}\; \frac{5}{7}: \quad 2 \cdot 7 = 14 \neq 15 = 3 \cdot 5", size=42).move_to(0.6 * DOWN)
        g.set_max_width(7.2)
        x = ex_mark(CORAL, size=60).next_to(g, DOWN, buff=0.25)
        self.play(Write(g))
        self.play(FadeIn(x, scale=0.6))
        self.hold(0.6)
        self.end_section()

        self.mark("¿Por qué funciona?")
        self.say("La razón está en una propiedad de la igualdad: si dos números son iguales y los multiplicamos por el mismo número, siguen siendo iguales. Multipliquemos los dos lados por b por d.")
        s1 = M(R"\frac{a}{b} = \frac{c}{d}", size=56).move_to(3.7 * UP)
        self.play(Write(s1))
        s2 = M(R"\frac{a}{b} \cdot b\,d = \frac{c}{d} \cdot b\,d", size=50).move_to(2.2 * UP)
        w2 = why_pill("multiplico los dos lados por lo mismo", MUTED).next_to(s2, DOWN, buff=0.15)
        self.play(Write(s2), FadeIn(w2))
        self.hold()
        self.say("Como vimos con los axiomas, dividir entre b es multiplicar por su recíproco, uno sobre b. Lo mismo con d.")
        sm = M(R"a \cdot \frac{1}{b} \cdot b\,d = c \cdot \frac{1}{d} \cdot b\,d", size=46).move_to(0.55 * UP)
        self.play(Write(sm))
        self.hold()
        self.say("A la izquierda, uno sobre b por b da uno y queda a por d. A la derecha, uno sobre d por d da uno y queda c por b.")
        s3 = M(R"a\,d = c\,b", size=60, color=MINT).move_to(0.9 * DOWN)
        w3 = why_pill("b · (1/b) = 1  y  d · (1/d) = 1", MUTED).next_to(s3, DOWN, buff=0.15)
        self.play(Write(s3), FadeIn(w3))
        self.hold()
        self.say("Ese es el resultado: en una proporción, a por d es igual a b por c. Y al revés también vale, siempre que b y d no sean cero.")
        r = formula_card(R"\frac{a}{b} = \frac{c}{d} \iff a\,d = b\,c", color=MINT, size=48).move_to(3.1 * DOWN)
        self.play(FadeIn(r, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S03_Desconocido(MBScene):
    def construct(self):
        self.mark("El término que falta")
        self.set_header(R"x", "Término desconocido", HONEY, P_HONEY)
        self.say("Con los productos cruzados se encuentra un término que falta. Por ejemplo: equis es a ocho como nueve es a doce.", fox=True)
        s1 = M(R"\frac{x}{8} = \frac{9}{12}", size=60).move_to(3.6 * UP)
        self.play(Write(s1))
        self.hold()
        self.say("Multiplicamos en cruz: doce por equis es igual a ocho por nueve, que es setenta y dos.")
        s2 = M(R"12\,x = 8 \cdot 9 = 72", size=52).move_to(2.0 * UP)
        self.play(Write(s2))
        self.hold()
        self.say("Para dejar sola la equis, dividimos los dos lados entre doce: equis vale seis.")
        s3 = M(R"x = \frac{72}{12} = 6", size=56, color=HONEY).move_to(0.5 * UP)
        self.play(Write(s3))
        self.hold()
        self.say("Siempre conviene comprobar: seis octavos y nueve doceavos se simplifican a tres cuartos. Sí es una proporción.")
        s4 = M(R"\frac{6}{8} = \frac{3}{4} = \frac{9}{12}", size=50).move_to(1.2 * DOWN)
        ok = check_mark(MINT, size=56).next_to(s4, RIGHT, buff=0.3)
        self.play(Write(s4), FadeIn(ok, scale=0.6))
        self.hold(0.6)
        self.end_section()

        self.mark("Media proporcional")
        self.say("A veces el número que falta aparece dos veces, en los dos medios: cuatro es a equis como equis es a nueve. Ese número se llama media proporcional.")
        m1 = M(R"\frac{4}{x} = \frac{x}{9}", size=60).move_to(3.6 * UP)
        self.play(Write(m1))
        self.hold()
        self.say("Multiplicando en cruz, equis por equis es cuatro por nueve: equis al cuadrado es treinta y seis. Menos seis también cumple eso, pero la media proporcional entre dos números positivos se toma positiva: equis es seis.")
        m2 = M(R"x \cdot x = 4 \cdot 9", size=50).move_to(2.1 * UP)
        m3 = M(R"x^2 = 36 \;\Rightarrow\; x = 6", size=52, color=HONEY).move_to(0.9 * UP)
        self.play(Write(m2))
        self.play(Write(m3))
        self.hold()
        self.say("Y no siempre sale un entero. La media proporcional entre dos y tres es raíz de seis, un número irracional, como los que conocimos con los números reales.")
        m4 = M(R"\frac{2}{x} = \frac{x}{3} \;\Rightarrow\; x^2 = 6", size=48).move_to(0.8 * DOWN)
        m5 = M(R"x = \sqrt{6} \approx 2.449", size=52, color=CORAL).move_to(2.1 * DOWN)
        self.play(Write(m4))
        self.play(Write(m5))
        n = note("Media proporcional: el número que va en los dos medios", color=HONEY, size=26).move_to(3.6 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S04_Directa(MBScene):
    def construct(self):
        self.mark("Directamente proporcionales")
        self.set_header(R"y = kx", "Directa", MINT, P_MINT)
        self.say("Ahora miremos cantidades que cambian juntas. Cada cuaderno cuesta dos mil quinientos pesos. Si compras más cuadernos, pagas más.", fox=True)
        tb = table([["cuadernos", "1", "2", "3", "4"], ["pesos", "2 500", "5 000", "7 500", "10 000"]], [SKY, MINT]).move_to(3.6 * UP)
        self.play(FadeIn(tb, lag_ratio=0.05), run_time=1.4)
        self.hold()
        self.say("Si los cuadernos se duplican, el precio se duplica. Si se triplican, el precio se triplica. Por eso se llaman directamente proporcionales.")
        h1 = hop(tb[0][1], tb[0][2], "× 2", SKY, up=True)
        h2 = hop(tb[1][1], tb[1][2], "× 2", MINT, up=False)
        self.play(FadeIn(h1), FadeIn(h2))
        self.hold()
        self.say("Lo que no cambia es el cociente. El precio entre los cuadernos da siempre dos mil quinientos. Esa es la constante de proporcionalidad, que se llama k.")
        q = M(R"\frac{2500}{1} = \frac{5000}{2} = \frac{7500}{3} = 2500", size=40).move_to(1.4 * UP)
        q.set_max_width(7.2)
        k = M(R"\frac{y}{x} = k \quad\Rightarrow\quad y = k\,x", size=46, color=MINT).move_to(0.1 * UP)
        self.play(FadeOut(h1), FadeOut(h2), Write(q))
        self.play(Write(k))
        self.hold()
        self.say("En una gráfica, los puntos quedan sobre una recta que pasa por el origen: cero cuadernos, cero pesos.")
        plane = get_plane((0, 5), (0, 11), 1.0, numbers=False, unit_y=0.27).move_to(2.6 * DOWN)
        ax = plane.axes
        xl = VGroup(*[T(str(i), size=20, color=MUTED).next_to(ax.c2p(i, 0), DOWN, buff=0.08) for i in range(1, 5)])
        yl = VGroup(*[T(f"{v} mil", size=18, color=MUTED).next_to(ax.c2p(0, v), LEFT, buff=0.08) for v in (5, 10)])
        self.play(FadeIn(plane), FadeIn(xl), FadeIn(yl))
        pts = VGroup(*[dot(ax, i, 2.5 * i, MINT) for i in range(1, 5)])
        self.play(LaggedStartMap(GrowFromCenter, pts, lag_ratio=0.2))
        ln = Line(ax.c2p(0, 0), ax.c2p(4.4, 11)).set_stroke(MINT, 4)
        self.play(ShowCreation(ln))
        self.hold(0.6)
        self.end_section()


class S05_Inversa(MBScene):
    def construct(self):
        self.mark("Inversamente proporcionales")
        self.set_header(R"x\,y = k", "Inversa", CORAL, P_CORAL)
        self.say("Otras cantidades van al revés. Hay veinticuatro caramelos para repartir en partes iguales. Entre más niños, menos caramelos le tocan a cada uno.", fox=True)
        cand = VGroup(*[Dot(radius=0.12).set_fill(PINK, 1) for _ in range(24)])
        layouts = [(2, 12), (3, 8), (4, 6), (6, 4)]
        cand.arrange_in_grid(n_rows=2, n_cols=12, buff=0.14).move_to(3.9 * UP)
        lab = T("2 niños: 12 cada uno", size=26, color=INK).move_to(2.35 * UP)
        self.play(LaggedStartMap(GrowFromCenter, cand, lag_ratio=0.03), FadeIn(lab))
        for rws, cols in layouts[1:]:
            tgt = cand.copy().arrange_in_grid(n_rows=rws, n_cols=cols, buff=0.14).move_to(3.9 * UP)
            nl = T(f"{rws} niños: {cols} cada uno", size=26, color=INK).move_to(2.35 * UP)
            self.play(Transform(cand, tgt), FadeTransform(lab, nl), run_time=1.0)
            lab = nl
            self.wait(0.4)
        self.hold()
        self.say("Cada fila es un niño. Si los niños se duplican, a cada uno le toca la mitad. Por eso se llaman inversamente proporcionales.")
        tb = table([["niños", "2", "3", "4", "6"], ["caramelos", "12", "8", "6", "4"]], [SKY, CORAL]).move_to(1.25 * UP)
        self.play(FadeOut(lab), FadeIn(tb, lag_ratio=0.05))
        self.hold()
        self.say("Lo que no cambia ahora es el producto: niños por caramelos da siempre veinticuatro, los caramelos que había.")
        k = M(R"2 \cdot 12 = 3 \cdot 8 = 4 \cdot 6 = 24 \quad\Rightarrow\quad x\,y = k", size=38, color=CORAL).move_to(0.6 * DOWN)
        k.set_max_width(7.2)
        self.play(Write(k))
        self.hold()
        self.say("Su gráfica ya no es una recta: es una curva que baja cada vez más despacio, y nunca toca los ejes.")
        plane = get_plane((0, 7), (0, 14), 0.95, numbers=False, unit_y=0.17).move_to(3.2 * DOWN)
        ax = plane.axes
        xl = VGroup(*[T(str(i), size=18, color=MUTED).next_to(ax.c2p(i, 0), DOWN, buff=0.06) for i in (2, 3, 4, 6)])
        yl = VGroup(*[T(str(v), size=18, color=MUTED).next_to(ax.c2p(0, v), LEFT, buff=0.06) for v in (4, 8, 12)])
        self.play(FadeIn(plane), FadeIn(xl), FadeIn(yl))
        cv = curve(ax, lambda x: 24 / x, 1.72, 7, CORAL)
        pts = VGroup(*[dot(ax, a, 24 / a, CORAL) for a in (2, 3, 4, 6)])
        self.play(ShowCreation(cv), LaggedStartMap(GrowFromCenter, pts, lag_ratio=0.2), run_time=1.6)
        self.hold(0.6)
        self.end_section()


class S06_Ninguna(MBScene):
    def construct(self):
        self.mark("Ni directa ni inversa")
        self.set_header(R"?", "Ni una ni otra", PINK, P_PINK)
        self.say("Cuidado: que dos cantidades crezcan juntas no basta para que sean directamente proporcionales. Un taxi cobra cuatro mil pesos por subirse, más dos mil por cada kilómetro.", fox=True)
        tb = table([["km", "1", "2", "4"], ["pesos", "6 000", "8 000", "12 000"]], [SKY, PINK], cell_w=1.55).move_to(3.6 * UP)
        self.play(FadeIn(tb, lag_ratio=0.05), run_time=1.2)
        self.hold()
        self.say("Un kilómetro cuesta seis mil y dos kilómetros cuestan ocho mil. La distancia se duplicó, pero el precio no: el doble de seis mil sería doce mil.")
        h1 = hop(tb[0][1], tb[0][2], "× 2", SKY, up=True)
        self.play(FadeIn(h1))
        no = M(R"2 \cdot 6000 = 12\,000 \neq 8000", size=42, color=PINK).move_to(1.6 * UP)
        self.play(Write(no))
        self.hold()
        self.say("El cociente tampoco se mantiene: seis mil entre uno no es lo mismo que ocho mil entre dos. No hay una constante k.")
        q = M(R"\frac{6000}{1} \neq \frac{8000}{2}", size=46).move_to(0.2 * UP)
        self.play(Write(q))
        self.hold()
        self.say("Su gráfica es una recta, pero no pasa por el origen: arranca en cuatro mil, lo que cuesta subirse.")
        plane = get_plane((0, 5), (0, 14), 1.0, numbers=False, unit_y=0.2).move_to(2.4 * DOWN)
        ax = plane.axes
        xl = VGroup(*[T(str(i), size=20, color=MUTED).next_to(ax.c2p(i, 0), DOWN, buff=0.08) for i in (1, 2, 4)])
        yl = VGroup(*[T(f"{v} mil", size=18, color=MUTED).next_to(ax.c2p(0, v), LEFT, buff=0.08) for v in (4, 8, 12)])
        self.play(FadeIn(plane), FadeIn(xl), FadeIn(yl))
        ln = Line(ax.c2p(0, 4), ax.c2p(5, 14)).set_stroke(PINK, 4)
        start = dot(ax, 0, 4, HONEY)
        self.play(ShowCreation(ln), GrowFromCenter(start))
        self.hold()
        self.say("La regla para decidir: si el cociente se mantiene, es directa; si el producto se mantiene, es inversa; si ninguno, no es ninguna de las dos.")
        self.play(FadeOut(VGroup(plane, xl, yl, ln, start, q, no, h1)))
        rule = VGroup(
            note("cociente y/x constante → directa", color=MINT, size=28),
            note("producto x·y constante → inversa", color=CORAL, size=28),
            note("ninguno constante → ninguna", color=PINK, size=28),
        ).arrange(DOWN, buff=0.3).move_to(0.6 * DOWN)
        self.play(LaggedStartMap(FadeIn, rule, shift=0.2 * UP, lag_ratio=0.3), run_time=1.4)
        self.hold(0.6)
        self.end_section()


class S07_Reparto(MBScene):
    def construct(self):
        self.mark("Reparto proporcional")
        self.set_header(R"2 : 3 : 4", "Reparto", HONEY, P_HONEY)
        self.say("Las proporciones también sirven para repartir con justicia. Ana, Beto y Caro pusieron dos mil, tres mil y cuatro mil pesos para un boleto, y ganaron un premio de cuarenta y cinco mil.", fox=True)
        people = VGroup(*[VGroup(TB(n, size=28, color=c), T(f"puso {v} mil", size=22, color=MUTED)).arrange(DOWN, buff=0.1)
                          for n, v, c in [("Ana", 2, PINK), ("Beto", 3, SKY), ("Caro", 4, HONEY)]]).arrange(RIGHT, buff=0.9).move_to(3.8 * UP)
        self.play(LaggedStartMap(FadeIn, people, lag_ratio=0.2))
        self.hold()
        self.say("Lo justo es repartir en la razón dos a tres a cuatro. Juntas son nueve partes iguales.")
        cols = [PINK] * 2 + [SKY] * 3 + [HONEY] * 4
        bar = VGroup(*[Rectangle(0.76, 0.7).set_fill(c, 0.85).set_stroke(BG_COLOR, 2) for c in cols]).arrange(RIGHT, buff=0).move_to(2.2 * UP)
        tot = T("premio: 45 000", size=26, color=INK).next_to(bar, UP, buff=0.15)
        self.play(FadeIn(bar, lag_ratio=0.1), FadeIn(tot), run_time=1.4)
        s = M(R"2 + 3 + 4 = 9 \text{ partes}", size=44).move_to(0.9 * UP)
        self.play(Write(s))
        self.hold()
        self.say("Cada parte vale cuarenta y cinco mil entre nueve: cinco mil pesos.")
        e = M(R"45\,000 \div 9 = 5\,000", size=46, color=HONEY).move_to(0.3 * DOWN)
        lbl = VGroup(*[T("5 000", size=16, color=BG_COLOR).move_to(b) for b in bar])
        self.play(Write(e), FadeIn(lbl))
        self.hold()
        self.say("Ana se lleva dos partes, diez mil. Beto, tres partes, quince mil. Y Caro, cuatro partes, veinte mil. Entre los tres suman los cuarenta y cinco mil.")
        res = VGroup(
            M(R"\text{Ana: } 2 \cdot 5000 = 10\,000", size=38, color=PINK),
            M(R"\text{Beto: } 3 \cdot 5000 = 15\,000", size=38, color=SKY),
            M(R"\text{Caro: } 4 \cdot 5000 = 20\,000", size=38, color=HONEY),
        ).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to(2.3 * DOWN)
        self.play(LaggedStartMap(Write, res, lag_ratio=0.4), run_time=2.4)
        self.hold(0.6)
        self.end_section()


class S08_Cierre(AlgCierre):
    recap = [
        ("Proporción", "dos razones iguales: a/b = c/d", LAV),
        ("Productos cruzados", "a/b = c/d  ⟺  a·d = b·c", MINT),
        ("Término que falta", "x/8 = 9/12 → 12x = 72 → x = 6", HONEY),
        ("Media proporcional", "4/x = x/9 → x = 6  ·  entre 2 y 3: √6", HONEY),
        ("Directa", "y/x = k constante, recta por el origen", MINT),
        ("Inversa", "x·y = k constante, curva", CORAL),
        ("Reparto", "suma las partes y reparte: 2 : 3 : 4", PINK),
    ]
    recap_say = "Una proporción iguala dos razones, y los productos cruzados la resuelven. Directa si el cociente se mantiene, inversa si se mantiene el producto."
    practice = "Equilibra balanzas, mide árboles con su sombra y reparte premios"
