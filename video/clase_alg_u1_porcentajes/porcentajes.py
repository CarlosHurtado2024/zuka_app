"""
Álgebra A4 · Porcentajes y descuentos (lección alg-13, un solo video, 9:16, fondo morado vivo).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Una cuadrícula 3D de 100 cubitos donde
suben 18 (18 %) y luego 20 (1/5), el 15 % de 240 con el atajo del 10 %, la cruz para las tres preguntas
(qué porcentaje, de qué número), aumentos y descuentos como factores con una barra que se estira, cambios
sucesivos (+25 % y −20 % devuelven el precio; −40 % y −50 % no son −90 %) y el precio original a partir del
rebajado (zoom al error típico). Spec 2026-11-09-algebra-unidad-1-videos-y-juegos.

    manimgl porcentajes.py S01_Cien -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 1"
    title = "Porcentajes\ny descuentos"
    subtitle = "Todo se mide sobre cien"


class S01_Cien(MBScene):
    def construct(self):
        self.mark("De cada cien")
        self.set_header(R"\%", "Por ciento", MINT, P_MINT)
        self.say("Por ciento quiere decir de cada cien. Aquí hay cien cubitos: el dieciocho por ciento son dieciocho de ellos.", fox=True)
        s = 0.56
        grid = unit_cubes(10, 10, 1, size=s, color=P_LAV).move_to(0.6 * UP)
        self.play(self.frame.animate.reorient(0, 50), run_time=1.2)
        self.play(LaggedStart(*[FadeIn(c) for c in grid], lag_ratio=0.005), run_time=1.6)
        order = sorted(range(100), key=lambda k: (-grid[k].get_center()[1], grid[k].get_center()[0]))
        pick = [grid[k] for k in order[:18]]
        self.play(LaggedStart(*[c.animate.set_color(MINT).shift(0.6 * OUT) for c in pick], lag_ratio=0.06), run_time=2.4)
        lab = flat(M(R"18\% = \frac{18}{100} = 0.18", size=50, color=MINT).move_to(4.2 * DOWN))
        self.play(FadeIn(lab))
        self.hold()
        self.say("Una fracción también se lee en cien. Un quinto es veinte de cada cien: el veinte por ciento.")
        self.play(*[c.animate.set_color(P_LAV).shift(0.6 * IN) for c in pick], FadeOut(lab), run_time=0.8)
        pick2 = [grid[k] for k in order[:20]]
        self.play(LaggedStart(*[c.animate.set_color(HONEY).shift(0.8 * OUT) for c in pick2], lag_ratio=0.05), run_time=2.0)
        lab2 = flat(M(R"\frac{1}{5} = \frac{20}{100} = 20\%", size=50, color=HONEY).move_to(4.2 * DOWN))
        self.play(FadeIn(lab2))
        self.frame.add_updater(lambda f, dt: f.increment_theta(0.2 * dt))
        self.hold(1.0)
        self.frame.clear_updaters()
        self.play(self.frame.animate.reorient(0, 0), run_time=1.2)
        self.end_section()


class S02_Calcular(MBScene):
    def construct(self):
        self.mark("Calcular un porcentaje")
        self.set_header(R"p\% \text{ de } C", "Calcular", SKY, P_SKY)
        self.say("Para sacar el quince por ciento de doscientos cuarenta hay un atajo: el diez por ciento se saca corriendo la coma un lugar.", fox=True)
        bar = Rectangle(7.0, 0.8).set_fill(P_SKY, 1).set_stroke(SKY, 2).move_to(3.4 * UP)
        bl = TB("240 = 100 %", size=28, color=INK).move_to(bar)
        self.play(FadeIn(bar), FadeIn(bl))
        ten = Rectangle(0.7, 0.8).set_fill(SKY, 1).set_stroke(INK, 2).align_to(bar, LEFT).move_to(bar, coor_mask=np.array([0, 1, 0]))
        five = Rectangle(0.35, 0.8).set_fill(MINT, 1).set_stroke(INK, 2).next_to(ten, RIGHT, buff=0)
        t1 = VGroup(T("10 %", size=24, color=SKY), M("24", size=36, color=SKY)).arrange(DOWN, buff=0.1).next_to(ten, DOWN, buff=0.3)
        t2 = VGroup(T("5 %", size=24, color=MINT), M("12", size=36, color=MINT)).arrange(DOWN, buff=0.1).next_to(five, DOWN, buff=0.3).shift(0.7 * RIGHT)
        self.play(FadeIn(ten), FadeIn(t1))
        self.hold()
        self.say("El cinco por ciento es la mitad de eso: doce. Y quince es diez más cinco: veinticuatro más doce, treinta y seis.")
        self.play(FadeIn(five), FadeIn(t2))
        tot = formula_card(R"15\% \text{ de } 240 = 24 + 12 = 36", color=SKY, size=42).move_to(0.6 * UP)
        self.play(FadeIn(tot, shift=0.2 * UP))
        self.hold()
        self.say("En general, se multiplica el total por el porcentaje y se divide entre cien.")
        gen = formula_card(R"\frac{p \cdot C}{100} \qquad \frac{15 \cdot 240}{100} = 36", color=MINT, size=42).move_to(1.8 * DOWN)
        self.play(FadeIn(gen, shift=0.2 * UP))
        self.zoom_to(gen, scale=0.45)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S03_Cruz(MBScene):
    def construct(self):
        self.mark("La cruz del porcentaje")
        self.set_header(R"\frac{100}{C} = \frac{p}{B}", "La cruz", PINK, P_PINK)
        self.say("Todo problema de porcentaje es una regla de tres: el total va con el cien por ciento, y la parte con su porcentaje. Se arma una cruz.", fox=True)
        def cross(tl, tr, bl, br, unknown):
            cells = [M(t, size=50, color=PINK if t == unknown else INK) for t in (tl, tr, bl, br)]
            g = VGroup(*cells)
            cells[0].move_to(1.1 * LEFT + 0.6 * UP); cells[1].move_to(1.1 * RIGHT + 0.6 * UP)
            cells[2].move_to(1.1 * LEFT + 0.6 * DOWN); cells[3].move_to(1.1 * RIGHT + 0.6 * DOWN)
            v = Line(0.9 * UP, 0.9 * DOWN).set_stroke(MUTED, 2)
            h = Line(1.9 * LEFT, 1.9 * RIGHT).set_stroke(MUTED, 2)
            heads = VGroup(T("total", size=22, color=MUTED).next_to(cells[0], LEFT, buff=0.35), T("parte", size=22, color=MUTED).next_to(cells[2], LEFT, buff=0.35))
            return VGroup(g, v, h, heads)
        self.say("Primera pregunta: ¿qué porcentaje es veintisiete de noventa?")
        c1 = cross("90", "100\\%", "27", "p", "p").move_to(2.8 * UP)
        self.play(FadeIn(c1))
        s1 = M(R"p = \frac{27 \cdot 100}{90} = 30\%", size=46, color=PINK).next_to(c1, DOWN, buff=0.4)
        self.play(Write(s1))
        self.hold()
        self.say("Segunda pregunta: ¿de qué número es catorce el treinta y cinco por ciento? Ahora falta el total.")
        c2 = cross("C", "100\\%", "14", "35\\%", "C").move_to(2.2 * DOWN)
        self.play(FadeIn(c2))
        s2 = M(R"C = \frac{14 \cdot 100}{35} = 40", size=46, color=PINK).next_to(c2, DOWN, buff=0.4)
        self.play(Write(s2))
        self.zoom_to(VGroup(c2, s2), scale=0.6)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S04_Factor(MBScene):
    def construct(self):
        self.mark("Aumentos y descuentos son factores")
        self.set_header(R"\times\left(1 \pm \tfrac{r}{100}\right)", "Factores", HONEY, P_HONEY)
        self.say("Un aumento del veinticinco por ciento es quedarse con todo lo que había, el cien por ciento, y sumarle el veinticinco: el ciento veinticinco por ciento.", fox=True)
        u = 0.06
        base = Rectangle(80 * u, 0.7).set_fill(P_HONEY, 1).set_stroke(HONEY, 2)
        base.move_to(3.4 * UP).align_to(3.6 * LEFT, LEFT)
        bl = TB("80", size=28).move_to(base)
        self.play(FadeIn(base), FadeIn(bl))
        w = ValueTracker(80)
        grow = always_redraw(lambda: Rectangle(w.get_value() * u, 0.7).set_fill(HONEY, 0.9).set_stroke(INK, 2).align_to(base, LEFT).move_to(base.get_center() + 1.0 * DOWN, coor_mask=np.array([0, 1, 0])))
        gl = always_redraw(lambda: TB(f"{w.get_value():.0f}", size=28, color=BG_COLOR).move_to(grow))
        self.add(grow, gl)
        self.play(w.animate.set_value(100), run_time=1.8)
        f1 = formula_card(R"+25\% \;\Rightarrow\; \times 1.25 \qquad 80 \cdot 1.25 = 100", color=HONEY, size=38).move_to(1.0 * UP)
        self.play(FadeIn(f1, shift=0.2 * UP))
        self.hold()
        self.say("Un descuento del cuarenta por ciento deja el sesenta por ciento: se multiplica por cero punto seis.")
        w2 = ValueTracker(50)
        base2 = Rectangle(50 * u * 1.4, 0.7).set_fill(P_CORAL, 1).set_stroke(CORAL, 2).move_to(1.2 * DOWN).align_to(3.6 * LEFT, LEFT)
        b2l = TB("50", size=28).move_to(base2)
        shrink = always_redraw(lambda: Rectangle(w2.get_value() * u * 1.4, 0.7).set_fill(CORAL, 0.9).set_stroke(INK, 2).align_to(base2, LEFT).move_to(base2.get_center() + 1.0 * DOWN, coor_mask=np.array([0, 1, 0])))
        sl = always_redraw(lambda: TB(f"{w2.get_value():.0f}", size=28, color=BG_COLOR).move_to(shrink))
        self.play(FadeIn(base2), FadeIn(b2l))
        self.add(shrink, sl)
        self.play(w2.animate.set_value(30), run_time=1.8)
        f2 = formula_card(R"-40\% \;\Rightarrow\; \times 0.6 \qquad 50 \cdot 0.6 = 30", color=CORAL, size=38).move_to(3.6 * DOWN)
        self.play(FadeIn(f2, shift=0.2 * UP))
        self.hold()
        self.say("Así, cualquier cambio porcentual se vuelve una sola multiplicación.")
        self.hold(0.5)
        self.end_section()


class S05_Sucesivos(MBScene):
    def construct(self):
        self.mark("Cambios sucesivos")
        self.set_header(R"\times a \times b", "Uno tras otro", PINK, P_PINK)
        self.say("Una tienda sube un precio veinticinco por ciento y en la temporada lo baja veinte por ciento. Parece que debería quedar cinco por ciento más caro. Veamos.", fox=True)
        tags = VGroup(
            VGroup(TB("100", size=56), T("antes", size=28, color=MUTED)).arrange(DOWN, buff=0.1),
            VGroup(TB("125", size=56, color=SKY), T("+25 %", size=28, color=SKY)).arrange(DOWN, buff=0.1),
            VGroup(TB("100", size=56, color=PINK), T("−20 %", size=28, color=CORAL)).arrange(DOWN, buff=0.1),
        ).arrange(RIGHT, buff=1.0).move_to(3.4 * UP)
        arrows = VGroup(Arrow(tags[0].get_right(), tags[1].get_left(), buff=0.15).set_color(SKY), Arrow(tags[1].get_right(), tags[2].get_left(), buff=0.15).set_color(CORAL))
        self.play(FadeIn(tags[0]))
        self.play(GrowArrow(arrows[0]), FadeIn(tags[1], shift=0.2 * RIGHT))
        self.play(GrowArrow(arrows[1]), FadeIn(tags[2], shift=0.2 * RIGHT))
        self.hold()
        self.say("Volvió exacto a cien. El veinte por ciento se calcula sobre ciento veinticinco, que es más grande: los factores se multiplican.")
        f = formula_card(R"1.25 \cdot 0.8 = 1", color=PINK, size=52).move_to(1.2 * UP)
        self.play(FadeIn(f, scale=0.9))
        self.zoom_to(f, scale=0.4)
        self.hold()
        self.zoom_reset()
        self.end_section()
        self.mark("Los descuentos no se suman")
        self.say("Otra trampa: un cuarenta por ciento y después un cincuenta por ciento no son noventa por ciento de descuento.", fox=True)
        bar = Rectangle(7.0, 0.7).set_fill(P_LAV, 1).set_stroke(LAV, 2).move_to(3.4 * UP)
        l0 = TB("100 %", size=26).move_to(bar)
        self.play(FadeIn(bar), FadeIn(l0))
        b1 = Rectangle(7.0 * 0.6, 0.7).set_fill(LAV, 1).set_stroke(INK, 2).align_to(bar, LEFT).shift(1.0 * DOWN + 3.4 * UP)
        b1.align_to(bar, LEFT)
        l1 = TB("60 %", size=26, color=BG_COLOR).move_to(b1)
        b2 = Rectangle(7.0 * 0.3, 0.7).set_fill(HONEY, 1).set_stroke(INK, 2).move_to(b1.get_center() + 1.0 * DOWN).align_to(bar, LEFT)
        l2 = TB("30 %", size=26, color=BG_COLOR).move_to(b2)
        self.play(TransformFromCopy(bar, b1))
        self.play(FadeIn(l1))
        self.play(TransformFromCopy(b1, b2))
        self.play(FadeIn(l2))
        res = formula_card(R"0.6 \cdot 0.5 = 0.3 \;\Rightarrow\; 70\% \text{ de descuento}", color=HONEY, size=40).move_to(0.6 * DOWN)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.say("Queda el treinta por ciento del precio: el descuento total es del setenta, no del noventa.")
        self.hold(0.5)
        self.end_section()


class S06_Atras(MBScene):
    def construct(self):
        self.mark("Volver al precio original")
        self.set_header(R"\div 0.8", "Hacia atrás", CORAL, P_CORAL)
        self.say("Con el veinte por ciento de descuento, un par de tenis queda en sesenta y cuatro mil. ¿Cuánto costaban antes?", fox=True)
        tag = VGroup(
            Polygon(LEFT * 1.6 + UP * 0.6, RIGHT * 1.2 + UP * 0.6, RIGHT * 1.7, RIGHT * 1.2 + DOWN * 0.6, LEFT * 1.6 + DOWN * 0.6).set_fill(CARD, 1).set_stroke(HONEY, 3),
            TB("64.000", size=40, color=HONEY),
        ).move_to(3.4 * UP)
        self.play(FadeIn(tag, scale=0.9))
        self.hold()
        self.say("La tentación es sumarle el veinte por ciento a sesenta y cuatro mil. Pero ese veinte por ciento era del precio original, no del rebajado.")
        wrong = VGroup(M(R"64\,000 \cdot 1.2 = 76\,800", size=44, color=CORAL), ex_mark(CORAL, 60)).arrange(RIGHT, buff=0.3).move_to(1.4 * UP)
        self.play(FadeIn(wrong, shift=0.2 * UP))
        self.zoom_to(wrong, scale=0.45)
        self.hold()
        self.zoom_reset()
        self.say("El precio rebajado es el ochenta por ciento del original. Entonces se deshace la multiplicación: se divide entre cero punto ocho.")
        right = VGroup(M(R"0.8 \cdot x = 64\,000", size=46), M(R"x = \frac{64\,000}{0.8} = 80\,000", size=50, color=MINT)).arrange(DOWN, buff=0.4).move_to(1.4 * DOWN)
        self.play(Write(right[0]))
        self.play(FadeIn(right[1], shift=0.2 * UP))
        chk = VGroup(T("comprobación:", size=24, color=MUTED), M(R"80\,000 \cdot 0.8 = 64\,000", size=38, color=MINT), check_mark(MINT, 44)).arrange(RIGHT, buff=0.2).move_to(4.0 * DOWN)
        chk.set_max_width(7.2)
        self.play(FadeIn(chk))
        self.hold(0.5)
        self.end_section()


class S07_Cierre(AlgCierre):
    recap = [
        ("Por ciento", "de cada 100: 18 % = 18/100 = 0.18", MINT),
        ("Calcular", "p · C / 100  (o el atajo del 10 %)", SKY),
        ("La cruz", "total con 100 %, parte con p %", PINK),
        ("Factores", "+r % → ×(1 + r/100);  −r % → ×(1 − r/100)", HONEY),
        ("Sucesivos", "se multiplican: 1.25 · 0.8 = 1", PINK),
        ("Hacia atrás", "se divide entre el factor: 64.000 / 0.8", CORAL),
    ]
    recap_say = "Un porcentaje es una razón sobre cien, y cada aumento o descuento es multiplicar por un factor. Los cambios seguidos se multiplican, nunca se suman."
    practice = "Barras, tragamonedas, sellos y etiquetas te esperan"
