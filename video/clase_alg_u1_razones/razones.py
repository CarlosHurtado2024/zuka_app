"""
Álgebra A3 · Razones, proporciones y regla de tres (lección alg-12, un solo video, 9:16, fondo morado vivo).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Pintura verde 3 : 2 (la misma razón da el
mismo color), proporción y producto cruzado (zoom), directa con la impresora (recta por el origen), inversa con
rectángulos de área 18 que se deforman (hipérbola), «ninguna» con un cubo 3D que duplica el lado (volumen × 8),
reparto de un premio, regla de tres directa (cuadernos), inversa (pintores) y compuesta (máquinas).
Spec 2026-11-09-algebra-unidad-1-videos-y-juegos.

    manimgl razones.py S04_Inversa -w -l
"""
from alg_fx import *

BLUE_PAINT, YELLOW_PAINT = "#3B82F6", "#FACC15"


def mix_color(blue, yellow):
    """Color de la mezcla según la proporción de azul."""
    t = blue / (blue + yellow)
    # Verde más oscuro cuanto más azul lleve (en RGB, azul + amarillo daría gris).
    k = min(max((t - 0.4) * 2.4, 0), 1)
    return interpolate_color("#BEF264", "#0F5132", k)


def can(color, h=0.9):
    body = RoundedRectangle(0.7, h, corner_radius=0.12).set_fill(color, 1).set_stroke(INK, 2)
    lid = Rectangle(0.76, 0.12).set_fill(MUTED, 1).set_stroke(width=0).next_to(body, UP, buff=0)
    return VGroup(body, lid)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 1"
    title = "Razones, proporciones\ny regla de tres"
    subtitle = "Comparar, escalar y predecir"


class S01_Razon(MBScene):
    def construct(self):
        self.mark("La razón: una receta")
        self.set_header(R"a : b", "Razón", MINT, P_MINT)
        self.say("Para pintar una pared de verde se mezclan tres tarros de azul con dos de amarillo. Esa receta es una razón: tres a dos.", fox=True)
        blues = VGroup(*[can(BLUE_PAINT) for _ in range(3)]).arrange(RIGHT, buff=0.15)
        yell = VGroup(*[can(YELLOW_PAINT) for _ in range(2)]).arrange(RIGHT, buff=0.15)
        recipe = VGroup(blues, M("+", size=48), yell).arrange(RIGHT, buff=0.3).move_to(3.6 * UP)
        self.play(LaggedStartMap(FadeIn, recipe, shift=0.2 * DOWN, lag_ratio=0.2))
        bucket = VGroup(
            Polygon(LEFT * 1.1 + UP * 0.8, RIGHT * 1.1 + UP * 0.8, RIGHT * 0.85 + DOWN * 0.8, LEFT * 0.85 + DOWN * 0.8).set_fill(CARD, 1).set_stroke(INK, 3),
        ).move_to(1.2 * UP)
        paint = Polygon(LEFT * 1.0 + UP * 0.5, RIGHT * 1.0 + UP * 0.5, RIGHT * 0.83 + DOWN * 0.75, LEFT * 0.83 + DOWN * 0.75).set_fill(mix_color(3, 2), 1).set_stroke(width=0).move_to(bucket.get_center() + 0.1 * DOWN)
        self.play(FadeIn(bucket))
        self.play(*[c.animate.scale(0.3).move_to(bucket.get_center()).set_opacity(0) for c in [*blues, *yell]], FadeIn(paint), run_time=1.6)
        r = formula_card(R"\frac{3}{2} = 1.5", color=MINT).move_to(1.2 * DOWN)
        self.play(FadeIn(r, shift=0.2 * UP))
        self.say("Una razón compara dos cantidades dividiéndolas: hay uno punto cinco tarros de azul por cada tarro de amarillo.")
        self.hold()
        self.end_section()
        self.mark("Razones equivalentes")
        self.say("Para una pared más grande se duplica todo: seis de azul y cuatro de amarillo. El verde sale idéntico, porque seis cuartos también es uno punto cinco.")
        mixes = [(3, 2, R"\frac{3}{2}"), (6, 4, R"\frac{6}{4}"), (4, 2, R"\frac{4}{2}")]
        cols = VGroup()
        for b, y, tex in mixes:
            sw = Square(1.6).set_fill(mix_color(b, y), 1).set_stroke(INK, 2)
            lab = M(tex, size=44).next_to(sw, DOWN, buff=0.25)
            val = M(f"= {b / y:g}", size=36, color=MUTED).next_to(lab, DOWN, buff=0.15)
            cols.add(VGroup(sw, lab, val))
        cols.arrange(RIGHT, buff=0.55).move_to(1.6 * UP)
        self.play(FadeIn(cols[0]), FadeIn(cols[1]))
        same = T("mismo verde", size=26, color=MINT).next_to(VGroup(cols[0][0], cols[1][0]), UP, buff=0.3)
        self.play(FadeIn(same))
        self.hold()
        self.say("En cambio, cuatro de azul con dos de amarillo es otra razón, dos, y el verde se oscurece.")
        self.play(FadeIn(cols[2], shift=0.2 * LEFT))
        diff = T("otro color", size=26, color=CORAL).next_to(cols[2][0], UP, buff=0.3)
        self.play(FadeIn(diff))
        self.zoom_to(VGroup(cols[1][0], cols[2][0]), scale=0.45)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S02_Proporcion(MBScene):
    def construct(self):
        self.mark("Proporción y producto cruzado")
        self.set_header(R"\frac{a}{b} = \frac{c}{d}", "Proporción", PINK, P_PINK)
        self.say("Una proporción es la igualdad de dos razones. Hay una prueba rápida: los productos cruzados son iguales.", fox=True)
        prop = M(R"\frac{3}{2} = \frac{6}{4}", size=80).move_to(3.0 * UP)
        self.play(Write(prop))
        a1 = Arrow(prop.get_corner(UL) + 0.2 * DOWN + 0.2 * RIGHT, prop.get_corner(DR) + 0.2 * UP + 0.2 * LEFT, buff=0.1).set_color(SKY)
        a2 = Arrow(prop.get_corner(UR) + 0.2 * DOWN + 0.2 * LEFT, prop.get_corner(DL) + 0.2 * UP + 0.2 * RIGHT, buff=0.1).set_color(HONEY)
        self.play(GrowArrow(a1), GrowArrow(a2))
        cross = M(R"3 \cdot 4 = 2 \cdot 6 = 12", size=50).move_to(1.2 * UP)
        self.play(FadeIn(cross, shift=0.2 * UP))
        self.hold()
        self.say("Esto sirve para encontrar un dato que falta. Si con tres de azul van dos de amarillo, ¿con cuánto azul van diez de amarillo? Lo llamamos x.")
        find = M(R"\frac{3}{2} = \frac{x}{10}", size=70).move_to(1.0 * DOWN)
        self.play(FadeOut(cross), Write(find))
        self.zoom_to(find, scale=0.4)
        self.hold()
        self.zoom_reset()
        steps = VGroup(M(R"2x = 3 \cdot 10", size=50), M(R"x = 15", size=60, color=PINK)).arrange(DOWN, buff=0.4).move_to(3.6 * DOWN)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.say("Quince tarros de azul con diez de amarillo: el mismo verde para una pared cinco veces más grande.")
        self.hold(0.5)
        self.end_section()


class S03_Directa(MBScene):
    def construct(self):
        self.mark("Directamente proporcionales")
        self.set_header(R"y = kx", "Directa", SKY, P_SKY)
        self.say("Una impresora saca ocho hojas por minuto. En dos minutos, dieciséis; en tres, veinticuatro. Si el tiempo se duplica, las hojas también.", fox=True)
        rows = [(1, 8), (2, 16), (3, 24), (4, 32)]
        table = VGroup()
        head = VGroup(T("minutos", size=24, color=MUTED), T("hojas", size=24, color=MUTED), T("hojas / min", size=24, color=MUTED)).arrange(RIGHT, buff=0.6)
        table.add(head)
        for x, y in rows:
            r = VGroup(M(str(x), size=36, color=SKY), M(str(y), size=36, color=HONEY), M(R"%d \div %d = 8" % (y, x), size=32, color=MINT))
            for m, h in zip(r, head):
                m.move_to(h.get_center())
            table.add(r)
        for k in range(1, len(table)):
            table[k].shift(0.75 * k * DOWN)
        table.move_to(3.0 * UP)
        self.play(FadeIn(head))
        for k in range(1, len(table)):
            self.play(FadeIn(table[k][:2], shift=0.15 * LEFT), run_time=0.5)
        self.hold()
        self.say("Lo que no cambia es el cociente: hojas entre minutos da siempre ocho. Esa es la constante de proporcionalidad.")
        self.play(LaggedStart(*[FadeIn(table[k][2]) for k in range(1, len(table))], lag_ratio=0.2))
        col = SurroundingRectangle(VGroup(*[table[k][2] for k in range(1, len(table))]), buff=0.12).set_stroke(MINT, 3)
        self.play(ShowCreation(col))
        self.hold()
        self.say("En el plano, los puntos quedan alineados en una recta que pasa por el origen: si no imprimes nada de tiempo, no sale ninguna hoja.")
        plane = get_plane((0, 5), (0, 4), 1.1, numbers=False, unit_y=1.1).move_to(2.8 * DOWN)
        ax = plane.axes
        self.play(FadeIn(plane))
        dots = VGroup(*[dot(ax, x, y / 10, HONEY) for x, y in rows])
        self.play(LaggedStart(*[TransformFromCopy(table[k + 1][1], dots[k]) for k in range(4)], lag_ratio=0.2), run_time=1.6)
        ln = curve(ax, lambda x: 0.8 * x, 0, 4.9, SKY)
        self.play(ShowCreation(ln))
        lab = M(R"y = 8x", size=40, color=SKY).next_to(ax.c2p(4, 3.2), LEFT, buff=0.4)
        self.play(FadeIn(lab))
        self.hold(0.5)
        self.end_section()


class S04_Inversa(MBScene):
    def construct(self):
        self.mark("Inversamente proporcionales")
        self.set_header(R"xy = k", "Inversa", HONEY, P_HONEY)
        self.say("Ahora un rectángulo que siempre tiene dieciocho cuadritos de área. Si se hace el doble de ancho, tiene que quedar con la mitad de alto.", fox=True)
        plane = get_plane((0, 10), (0, 10), 0.68, numbers=True, size=18).move_to(0.9 * UP)
        ax = plane.axes
        self.play(FadeIn(plane))
        w = ValueTracker(2)

        def rect():
            x = w.get_value()
            y = 18 / x
            return Rectangle(ax.c2p(x, 0)[0] - ax.c2p(0, 0)[0], ax.c2p(0, y)[1] - ax.c2p(0, 0)[1]).set_fill(HONEY, 0.35).set_stroke(HONEY, 3).move_to(ax.c2p(x / 2, y / 2))

        r = always_redraw(rect)
        corner = always_redraw(lambda: Dot(ax.c2p(w.get_value(), 18 / w.get_value()), radius=0.09).set_fill(PINK, 1))
        trail = TracedPath(corner.get_center, stroke_color=PINK, stroke_width=4)
        lab = always_redraw(lambda: M(R"\text{ancho } %s \;\to\; \text{alto } \tfrac{18}{%s}" % ((f"{w.get_value():.1f}".rstrip("0").rstrip("."),) * 2), size=40).move_to(4.3 * DOWN))
        self.add(r, trail, corner, lab)
        self.play(w.animate.set_value(3), run_time=1.2)
        self.play(w.animate.set_value(6), run_time=1.6)
        self.play(w.animate.set_value(9), run_time=1.4)
        self.play(w.animate.set_value(1.8), run_time=2.6)
        trail.clear_updaters()
        self.hold()
        self.say("Lo que se conserva ahora es el producto: ancho por alto, siempre dieciocho. La esquina dibuja una curva que se llama hipérbola.")
        hyp = curve(ax, lambda x: 18 / x, 1.8, 10, PINK, width=4)
        self.play(ShowCreation(hyp))
        self.zoom_to(VGroup(r, corner), scale=0.6)
        self.hold()
        self.zoom_reset()
        lab.clear_updaters()
        form = formula_card(R"x \cdot y = 18 \qquad y = \frac{18}{x}", color=HONEY, size=42).move_to(5.4 * DOWN)
        self.play(FadeOut(lab), FadeIn(form, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_Ninguna(MBScene):
    def construct(self):
        self.mark("Ni directa ni inversa")
        self.set_header(R"V = l^3", "Ni una ni otra", CORAL, P_CORAL)
        self.say("Cuidado: que dos cosas crezcan juntas no las hace directamente proporcionales. Un cubo de lado uno ocupa un cubito.", fox=True)
        s = 0.9
        small = unit_cubes(1, 1, 1, size=s, color=SKY).move_to(2.2 * LEFT + 0.5 * UP)
        self.play(self.frame.animate.reorient(-30, 65), run_time=1.4)
        self.play(FadeIn(small, shift=0.3 * OUT))
        self.hold()
        self.say("Si el lado se duplica, el volumen no se duplica: se necesitan ocho cubitos. Dos por dos por dos.")
        big = unit_cubes(2, 2, 2, size=s, color=PINK).move_to(1.6 * RIGHT + 0.5 * UP)
        self.play(LaggedStart(*[FadeIn(c, shift=0.4 * OUT) for c in big], lag_ratio=0.15), run_time=2.4)
        self.frame.add_updater(lambda f, dt: f.increment_theta(0.25 * dt))
        tab = flat(VGroup(
            M(R"\text{lado} \times 2", size=40, color=SKY),
            M(R"\text{volumen} \times 8", size=40, color=PINK),
        ).arrange(DOWN, buff=0.3).move_to(3.6 * DOWN))
        for m in tab:
            m.fix_in_frame()
        self.play(FadeIn(tab))
        self.hold()
        self.say("No es directa, porque el cociente cambia, ni inversa, porque el volumen crece. Antes de usar una proporción, hay que preguntarse cómo cambian las cosas.")
        self.hold(0.6)
        self.frame.clear_updaters()
        self.play(self.frame.animate.reorient(0, 0), run_time=1.2)
        self.end_section()


class S06_Reparto(MBScene):
    def construct(self):
        self.mark("Reparto proporcional")
        self.set_header(R"2 : 3 : 4", "Reparto", MINT, P_MINT)
        self.say("Tres amigos compran una boleta: uno pone dos mil, otro tres mil y otro cuatro mil. Ganan cuarenta y cinco mil. Es justo repartir según lo que puso cada uno.", fox=True)
        prize = Rectangle(7.0, 0.9).set_fill(HONEY, 1).set_stroke(INK, 2).move_to(3.6 * UP)
        pl = TB("45.000", size=34, color=BG_COLOR).move_to(prize)
        self.play(FadeIn(prize), FadeIn(pl))
        self.hold()
        self.say("Las partes suman dos más tres más cuatro: nueve. Se corta el premio en nueve pedazos iguales de cinco mil.")
        pieces = VGroup(*[Rectangle(7.0 / 9, 0.9).set_fill(HONEY, 1).set_stroke(BG_COLOR, 3) for _ in range(9)]).arrange(RIGHT, buff=0).move_to(prize)
        labels = VGroup(*[T("5.000", size=14, color=BG_COLOR).move_to(p) for p in pieces])
        self.play(FadeOut(pl), FadeIn(pieces), FadeOut(prize))
        self.play(LaggedStartMap(FadeIn, labels, lag_ratio=0.08))
        self.hold()
        self.say("Cada uno se lleva tantos pedazos como partes puso: diez mil, quince mil y veinte mil.")
        cols = [SKY, PINK, MINT]
        groups = [VGroup(*pieces[0:2], *labels[0:2]), VGroup(*pieces[2:5], *labels[2:5]), VGroup(*pieces[5:9], *labels[5:9])]
        targets = [2.5 * LEFT + 0.8 * UP, 0.8 * UP, 2.5 * RIGHT + 0.8 * UP]
        anims = []
        for g, t, c in zip(groups, targets, cols):
            anims.append(g.animate.arrange(DOWN, buff=0.05).move_to(t))
        self.play(*anims, run_time=1.8)
        for g, c in zip(groups, cols):
            g.set_color(c)
        names = VGroup(*[M(t, size=40, color=c) for t, c in zip(["2", "3", "4"], cols)])
        res = VGroup(*[TB(t, size=28, color=c) for t, c in zip(["10.000", "15.000", "20.000"], cols)])
        for n, r, t in zip(names, res, targets):
            n.move_to(t + 2.6 * DOWN)
            r.next_to(n, DOWN, buff=0.2)
        self.play(FadeIn(names), FadeIn(res))
        form = formula_card(R"\frac{45\,000}{2 + 3 + 4} = 5\,000 \text{ por parte}", color=MINT, size=38).move_to(4.4 * DOWN)
        self.play(FadeIn(form, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


def rule_table(a, b, c, x, direct=True, ca=SKY, cb=HONEY):
    """Tabla de la regla de tres: dos columnas (magnitudes) y dos filas (situaciones), con sus flechas."""
    top = VGroup(T(a[0], size=26, color=ca), T(b[0], size=26, color=cb)).arrange(RIGHT, buff=1.8)
    r1 = VGroup(M(a[1], size=46), M(b[1], size=46))
    r2 = VGroup(M(c, size=46), M(x, size=46, color=PINK))
    for r in (r1, r2):
        for m, h in zip(r, top):
            m.move_to(h.get_center())
    r1.shift(0.9 * DOWN)
    r2.shift(1.9 * DOWN)
    arrows = VGroup()
    for col, k in ((0, ca), (1, cb)):
        up = direct or col == 0
        s, e = (r2[col], r1[col]) if up else (r1[col], r2[col])
        arrows.add(Arrow(s.get_right() + 0.15 * RIGHT, e.get_right() + 0.15 * RIGHT, buff=0.05).set_color(k))
    return VGroup(top, r1, r2, arrows)


class S07_ReglaDirecta(MBScene):
    def construct(self):
        self.mark("Regla de tres directa")
        self.set_header(R"\frac{a}{x} = \frac{b}{c}", "Regla de tres", SKY, P_SKY)
        self.say("La regla de tres busca el cuarto dato de una proporción. Cinco cuadernos cuestan quince mil pesos. ¿Cuánto cuestan ocho?", fox=True)
        books = VGroup(*[RoundedRectangle(0.5, 0.7, corner_radius=0.06).set_fill(c, 1).set_stroke(INK, 1.5) for c in [SKY, PINK, MINT, HONEY, LAV]]).arrange(RIGHT, buff=0.12).move_to(4.0 * UP)
        self.play(LaggedStartMap(FadeIn, books, shift=0.2 * DOWN, lag_ratio=0.15))
        tab = rule_table(("cuadernos", "5"), ("pesos", "15\\,000"), "8", "x").move_to(1.6 * UP)
        self.play(FadeIn(tab[:3]))
        self.hold()
        self.say("Primero se pregunta: si compro más cuadernos, ¿pago más o menos? Más. Las dos magnitudes van en el mismo sentido: es directa, las flechas van paralelas.")
        self.play(GrowArrow(tab[3][0]), GrowArrow(tab[3][1]))
        self.hold()
        self.say("Entonces se arma la proporción tal como está en la tabla y se despeja.")
        steps = VGroup(
            M(R"\frac{5}{8} = \frac{15\,000}{x}", size=50),
            M(R"x = \frac{15\,000 \cdot 8}{5} = 24\,000", size=46, color=PINK),
        ).arrange(DOWN, buff=0.45).move_to(2.4 * DOWN)
        self.play(Write(steps[0]))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.zoom_to(steps[1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S08_ReglaInversa(MBScene):
    def construct(self):
        self.mark("Regla de tres inversa")
        self.set_header(R"a \cdot b = c \cdot x", "Regla de tres inversa", HONEY, P_HONEY)
        self.say("Seis pintores pintan un muro en diez horas. ¿Cuánto tardan cuatro pintores? Con menos manos, se tarda más: es inversa.", fox=True)
        def painter(col):
            return VGroup(Circle(radius=0.18).set_fill(col, 1).set_stroke(width=0), RoundedRectangle(0.42, 0.5, corner_radius=0.1).set_fill(col, 1).set_stroke(width=0).shift(0.42 * DOWN))
        crew = VGroup(*[painter(HONEY) for _ in range(6)]).arrange(RIGHT, buff=0.3).move_to(4.0 * UP)
        self.play(LaggedStartMap(FadeIn, crew, shift=0.2 * UP, lag_ratio=0.1))
        tab = rule_table(("pintores", "6"), ("horas", "10"), "4", "x", direct=False, ca=HONEY, cb=SKY).move_to(1.6 * UP)
        self.play(FadeIn(tab[:3]))
        self.play(GrowArrow(tab[3][0]), GrowArrow(tab[3][1]))
        self.hold()
        self.say("En la inversa lo que se conserva es el producto: el muro entero son sesenta horas de trabajo de un pintor, se repartan como se repartan.")
        self.play(FadeOut(crew[4:]), crew[:4].animate.arrange(RIGHT, buff=0.3).move_to(4.0 * UP))
        steps = VGroup(
            M(R"6 \cdot 10 = 4 \cdot x", size=50),
            M(R"x = \frac{60}{4} = 15 \text{ horas}", size=48, color=PINK),
        ).arrange(DOWN, buff=0.45).move_to(2.4 * DOWN)
        self.play(Write(steps[0]))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S09_Compuesta(MBScene):
    def construct(self):
        self.mark("Regla de tres compuesta")
        self.set_header(R"\times \tfrac{a}{b}", "Compuesta", PINK, P_PINK)
        self.say("Cuando cambian varias cosas a la vez, se ajusta una por una. Cuatro máquinas en seis días hacen ciento veinte piezas. ¿Cuántas hacen seis máquinas en cinco días?", fox=True)
        start = M(R"120", size=64, color=INK).move_to(3.4 * UP)
        self.play(FadeIn(start))
        self.say("Más máquinas, más piezas: se multiplica por seis cuartos. Menos días, menos piezas: se multiplica por cinco sextos.")
        f1 = VGroup(M(R"\times \frac{6}{4}", size=52, color=SKY), T("de 4 a 6 máquinas: más piezas", size=24, color=SKY)).arrange(DOWN, buff=0.15).move_to(1.4 * UP)
        f2 = VGroup(M(R"\times \frac{5}{6}", size=52, color=HONEY), T("de 6 a 5 días: menos piezas", size=24, color=HONEY)).arrange(DOWN, buff=0.15).move_to(0.6 * DOWN)
        self.play(FadeIn(f1, shift=0.2 * UP))
        self.play(FadeIn(f2, shift=0.2 * UP))
        res = formula_card(R"120 \cdot \frac{6}{4} \cdot \frac{5}{6} = 150 \text{ piezas}", color=PINK, size=44).move_to(3.0 * DOWN)
        self.play(FadeIn(res, scale=0.9))
        self.hold()
        self.say("Cada factor se pone a favor o en contra según la magnitud haga crecer o decrecer el resultado.")
        self.hold(0.5)
        self.end_section()


class S10_Cierre(AlgCierre):
    recap = [
        ("Razón", "compara dividiendo: 3 : 2 = 1.5", MINT),
        ("Proporción", "a/b = c/d  ⇔  ad = bc", PINK),
        ("Directa", "y/x constante: recta por el origen", SKY),
        ("Inversa", "x · y constante: hipérbola", HONEY),
        ("Ninguna", "lado × 2 da volumen × 8", CORAL),
        ("Reparto", "total ÷ suma de partes, y cada uno sus partes", MINT),
        ("Regla de tres", "paralelas si es directa, cruzadas si es inversa", LAV),
    ]
    recap_say = "Antes de cualquier cuenta, pregunta: si una magnitud crece, ¿la otra crece o decrece? Esa pregunta decide todo."
    practice = "Limonada, barras, engranajes y obras te esperan"
