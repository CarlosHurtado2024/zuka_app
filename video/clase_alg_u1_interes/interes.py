"""
Álgebra A5 · Interés simple y compuesto (lección alg-13b, un solo video, 9:16, fondo morado vivo).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). El interés como el arriendo del dinero
(pilas de monedas 3D: 200.000 al 5 % mensual), el simple que agrega siempre la misma pila (columnas 3D en
escalera), el compuesto donde el interés también gana interés (zoom a los 500 de más), la carrera de las dos
curvas en 24 meses con el momento en que cada una duplica el dinero, y despejar el capital.
Spec 2026-11-09-algebra-unidad-1-videos-y-juegos.

    manimgl interes.py S03_Compuesto -w -l
"""
from alg_fx import *

C0, RATE = 200000, 0.05


def columns(values, color, unit=0.000012, width=0.55, gap=0.25, top_color=None, base_value=None):
    """Columnas 3D (prismas) de alturas proporcionales a `values`, en fila sobre el eje x."""
    g = Group()
    for k, v in enumerate(values):
        h = v * unit
        col = block(width, width, h, color=color)
        col.move_to(np.array([k * (width + gap), 0, h / 2]))
        if top_color is not None and base_value is not None and v > base_value[k] + 1:
            hb = base_value[k] * unit
            cap = block(width * 1.02, width * 1.02, h - hb, color=top_color)
            cap.move_to(np.array([k * (width + gap), 0, hb + (h - hb) / 2]))
            col = Group(col, cap)
        g.add(col)
    return g


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 1"
    title = "Interés simple\ny compuesto"
    subtitle = "Cuando el dinero trabaja"


class S01_Interes(MBScene):
    def construct(self):
        self.mark("El arriendo del dinero")
        self.set_header(R"I", "Interés", HONEY, P_HONEY)
        self.say("Quien presta dinero cobra por prestarlo, como quien arrienda una casa. Ese cobro es el interés.", fox=True)
        self.play(self.frame.animate.reorient(0, 60), run_time=1.2)
        stack = coin_stack(20, radius=0.6, height=0.11, color=HONEY, base=1.6 * LEFT + 0.4 * UP)
        self.play(LaggedStart(*[FadeIn(c, shift=0.4 * OUT) for c in stack], lag_ratio=0.06), run_time=2.2)
        cap = flat(VGroup(M("C", size=48, color=HONEY), T("capital: 200.000", size=26, color=INK)).arrange(DOWN, buff=0.1).move_to(2.0 * LEFT + 3.4 * DOWN))
        self.play(FadeIn(cap))
        self.hold()
        self.say("Si la tasa es del cinco por ciento mensual, cada mes el préstamo produce el cinco por ciento de doscientos mil: diez mil pesos.")
        inte = coin_stack(1, radius=0.6, height=0.11, color=PINK, base=1.8 * RIGHT + 0.4 * UP)
        self.play(FadeIn(inte, shift=0.6 * OUT))
        il = flat(VGroup(M("I", size=48, color=PINK), T("interés del mes: 10.000", size=26, color=INK)).arrange(DOWN, buff=0.1).move_to(2.0 * RIGHT + 3.4 * DOWN))
        self.play(FadeIn(il))
        self.hold()
        self.play(self.frame.animate.reorient(0, 0), run_time=1.0)
        self.say("Las letras de siempre: C es el capital, r la tasa por periodo, t el número de periodos, I el interés y M el monto, capital más interés.")
        legend = VGroup(
            M(R"C = 200\,000", size=40, color=HONEY),
            M(R"r = 5\% = 0.05", size=40, color=SKY),
            M(R"M = C + I", size=46, color=MINT),
        ).arrange(DOWN, buff=0.3).move_to(4.6 * UP)
        legend.fix_in_frame()
        self.play(FadeOut(stack), FadeOut(inte), FadeOut(cap), FadeOut(il))
        self.play(LaggedStartMap(FadeIn, legend, shift=0.2 * DOWN, lag_ratio=0.3))
        self.hold(0.5)
        self.end_section()


class S02_Simple(MBScene):
    def construct(self):
        self.mark("Interés simple")
        self.set_header(R"I = C\,r\,t", "Simple", SKY, P_SKY)
        self.say("Con interés simple, el interés se calcula siempre sobre el capital inicial. Cada mes llega la misma pila de diez mil.", fox=True)
        vals = [C0 * (1 + RATE * k) for k in range(7)]
        base = [C0] * 7
        cols = columns(vals, SKY, top_color=PINK, base_value=base).move_to(0.6 * UP)
        self.play(self.frame.animate.reorient(-25, 62), run_time=1.2)
        self.play(LaggedStart(*[FadeIn(c, shift=0.5 * OUT) for c in cols], lag_ratio=0.25), run_time=2.6)
        labs = flat(VGroup(*[T(f"mes {k}", size=20, color=MUTED) for k in range(7)]).arrange(RIGHT, buff=0.32).move_to(2.8 * DOWN))
        self.play(FadeIn(labs))
        self.hold()
        self.say("Los pedazos rosados, el interés, crecen de a diez mil: es una escalera pareja. En seis meses se ganan sesenta mil.")
        f = flat(formula_card(R"I = 200\,000 \cdot 0.05 \cdot 6 = 60\,000", color=SKY, size=38).move_to(3.9 * DOWN))
        self.play(FadeIn(f))
        self.hold()
        self.play(self.frame.animate.reorient(0, 0), FadeOut(cols), FadeOut(labs), FadeOut(f), run_time=1.2)
        self.say("El monto crece en línea recta: cada mes suma lo mismo.")
        form = formula_card(R"M = C\,(1 + r\,t) = 200\,000 \cdot 1.3 = 260\,000", color=SKY, size=36).move_to(1.4 * UP)
        self.play(FadeIn(form, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_Compuesto(MBScene):
    def construct(self):
        self.mark("Interés compuesto")
        self.set_header(R"C\,(1 + r)^n", "Compuesto", LAV, P_LAV)
        self.say("Con interés compuesto, el interés de cada mes se suma al capital, y el mes siguiente también gana interés. El dinero trabaja sobre lo que ya ganó.", fox=True)
        rows = VGroup()
        data = [(0, "200.000", ""), (1, "210.000", "+ 10.000"), (2, "220.500", "+ 10.500"), (3, "231.525", "+ 11.025")]
        for k, m, d in data:
            rows.add(VGroup(T(f"mes {k}", size=26, color=MUTED), TB(m, size=34, color=INK), T(d, size=26, color=PINK)).arrange(RIGHT, buff=0.45))
        for r in rows:
            r[0].set_width(r[0].get_width())
        rows.arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to(3.0 * UP)
        for r in rows:
            self.play(FadeIn(r, shift=0.2 * LEFT), run_time=0.7)
        self.hold()
        self.say("Fíjate en el segundo mes: ya no gana diez mil sino diez mil quinientos. Esos quinientos de más son el interés que ganó el interés del primer mes.")
        extra = M(R"5\% \text{ de } 10\,000 = 500", size=36, color=PINK).next_to(rows, DOWN, buff=0.35)
        ring = SurroundingRectangle(rows[2][2], buff=0.1).set_stroke(PINK, 3)
        self.play(ShowCreation(ring), FadeIn(extra))
        self.zoom_to(VGroup(rows[2], extra), scale=0.5)
        self.hold()
        self.zoom_reset()
        self.say("Cada mes se multiplica por uno punto cero cinco. Al cabo de n meses, por uno punto cero cinco elevado a la n.")
        form = formula_card(R"M = C\,(1 + r)^n = 200\,000 \cdot 1.05^n", color=LAV, size=40).move_to(0.0 * UP)
        self.play(FadeIn(form, shift=0.2 * UP))
        self.hold()
        self.end_section()
        self.mark("Simple contra compuesto en 3D")
        self.say("Lado a lado: en azul el simple, en lavanda el compuesto. Al principio casi iguales; después, el compuesto se despega.", fox=True)
        n = 10
        simple = [C0 * (1 + RATE * k) for k in range(0, n + 1, 2)]
        comp = [C0 * (1 + RATE) ** k for k in range(0, n + 1, 2)]
        cs = columns(simple, SKY, width=0.45, gap=0.75).shift(0.3 * UP)
        cc = columns(comp, LAV, width=0.45, gap=0.75, top_color=PINK, base_value=simple).shift(0.3 * UP + 0.5 * RIGHT)
        grp = Group(cs, cc).move_to(0.8 * UP)
        self.play(self.frame.animate.reorient(-30, 65), run_time=1.2)
        self.play(LaggedStart(*[FadeIn(c, shift=0.5 * OUT) for pair in zip(cs, cc) for c in pair], lag_ratio=0.15), run_time=3.0)
        lg = flat(VGroup(
            VGroup(Square(0.25).set_fill(SKY, 1).set_stroke(width=0), T("simple", size=24, color=SKY)).arrange(RIGHT, buff=0.15),
            VGroup(Square(0.25).set_fill(LAV, 1).set_stroke(width=0), T("compuesto", size=24, color=LAV)).arrange(RIGHT, buff=0.15),
            VGroup(Square(0.25).set_fill(PINK, 1).set_stroke(width=0), T("lo que le saca", size=24, color=PINK)).arrange(RIGHT, buff=0.15),
        ).arrange(RIGHT, buff=0.4).move_to(3.8 * DOWN))
        for m in lg:
            m.fix_in_frame()
        self.play(FadeIn(lg))
        self.frame.add_updater(lambda f, dt: f.increment_theta(0.22 * dt))
        self.hold(1.2)
        self.frame.clear_updaters()
        self.play(FadeOut(grp), FadeOut(lg), run_time=0.8)
        self.frame.reorient(0, 0)
        self.end_section()


class S04_Carrera(MBScene):
    def construct(self):
        self.mark("La carrera")
        self.set_header(R"1 + rt \;\text{vs}\; (1 + r)^t", "La carrera", MINT, P_MINT)
        self.say("Sigamos dos años mes a mes, siempre al cinco por ciento. El simple sube en recta; el compuesto en una curva que se empina.", fox=True)
        plane = get_plane((0, 24), (0, 7), 0.29, numbers=False, unit_y=0.95).move_to(1.0 * UP)
        ax = plane.axes
        xl = VGroup(*[T(str(k), size=18, color=MUTED).next_to(ax.c2p(k, 0), DOWN, buff=0.1) for k in range(0, 25, 6)])
        yl = VGroup(*[T(f"{k * 100}k", size=18, color=MUTED).next_to(ax.c2p(0, k), LEFT, buff=0.1) for k in range(1, 7)])
        self.play(FadeIn(plane), FadeIn(xl), FadeIn(yl))
        s = curve(ax, lambda t: 2 * (1 + RATE * t), 0, 24, SKY)
        c = curve(ax, lambda t: 2 * (1 + RATE) ** t, 0, 24, LAV)
        self.play(ShowCreation(s), ShowCreation(c), run_time=3.0)
        tags = VGroup(T("simple", size=24, color=SKY).next_to(ax.c2p(24, 4.4), DOWN, buff=0.1),
                      T("compuesto", size=24, color=LAV).next_to(ax.c2p(22, 5.85), LEFT, buff=0.15))
        self.play(FadeIn(tags))
        self.hold()
        self.say("¿Cuándo se duplica el dinero? Con el compuesto, hacia el mes quince ya pasó de cuatrocientos mil. Con el simple hay que esperar al mes veinte.")
        dline = DashedLine(ax.c2p(0, 4), ax.c2p(24, 4)).set_stroke(HONEY, 2)
        dl = T("el doble", size=22, color=HONEY).next_to(ax.c2p(0, 4), UP, buff=0.08).shift(0.5 * RIGHT)
        self.play(ShowCreation(dline), FadeIn(dl))
        p1 = dot(ax, 15, 2 * 1.05 ** 15, LAV)
        p2 = dot(ax, 20, 4, SKY)
        self.play(GrowFromCenter(p1), GrowFromCenter(p2))
        self.zoom_to(VGroup(p1, p2, dline), scale=0.5)
        self.hold()
        self.zoom_reset()
        nums = VGroup(
            M(R"\text{mes } 15:\ 200\,000 \cdot 1.05^{15} \approx 415\,786", size=32, color=LAV),
            M(R"\text{mes } 20:\ 200\,000 \cdot (1 + 0.05 \cdot 20) = 400\,000", size=32, color=SKY),
        ).arrange(DOWN, buff=0.3).move_to(4.0 * DOWN)
        for m in nums:
            m.set_max_width(7.2)
        self.play(FadeIn(nums, shift=0.2 * UP))
        self.hold()
        self.say("En el primer mes los dos ganan lo mismo. A partir del segundo, el compuesto gana siempre más, y la ventaja crece cada mes.")
        self.hold(0.5)
        self.end_section()


class S05_Despejar(MBScene):
    def construct(self):
        self.mark("¿Cuánto hay que ahorrar hoy?")
        self.set_header(R"C = \frac{M}{(1 + r)^n}", "Despejar", PINK, P_PINK)
        self.say("Al revés: para tener quinientos mil pesos en dos años, al diez por ciento anual compuesto, ¿cuánto hay que guardar hoy?", fox=True)
        goal = formula_card(R"C \cdot 1.1^2 = 500\,000", color=PINK, size=48).move_to(3.0 * UP)
        self.play(FadeIn(goal, shift=0.2 * UP))
        self.hold()
        self.say("Dos años al diez por ciento multiplican por uno punto uno dos veces: uno punto veintiuno. Se deshace dividiendo.")
        steps = VGroup(
            M(R"1.1^2 = 1.21", size=46, color=SKY),
            M(R"C = \frac{500\,000}{1.21} \approx 413\,223", size=50, color=MINT),
        ).arrange(DOWN, buff=0.5).move_to(0.4 * UP)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.zoom_to(steps[1], scale=0.45)
        self.hold()
        self.zoom_reset()
        chk = VGroup(T("comprobación:", size=24, color=MUTED), M(R"413\,223 \cdot 1.21 \approx 500\,000", size=36, color=MINT), check_mark(MINT, 44)).arrange(RIGHT, buff=0.2).move_to(2.6 * DOWN)
        chk.set_max_width(7.2)
        self.play(FadeIn(chk))
        self.say("Con interés simple bastaría cambiar el factor: uno más la tasa por el tiempo, uno punto dos.")
        simp = M(R"\text{simple: } C = \frac{500\,000}{1.2} \approx 416\,667", size=38, color=SKY).move_to(4.0 * DOWN)
        simp.set_max_width(7.2)
        self.play(FadeIn(simp))
        self.hold(0.5)
        self.end_section()


class S06_Cierre(AlgCierre):
    recap = [
        ("Interés", "lo que cobra el dinero prestado: M = C + I", HONEY),
        ("Simple", "I = C r t: siempre sobre el capital, sube en recta", SKY),
        ("Compuesto", "M = C (1 + r)ⁿ: el interés gana interés", LAV),
        ("La carrera", "primer periodo igual; después gana el compuesto", MINT),
        ("Despejar", "C = M / (1 + r)ⁿ", PINK),
    ]
    recap_say = "Simple suma siempre lo mismo; compuesto multiplica siempre por lo mismo. Por eso, con el tiempo, el compuesto gana la carrera."
    practice = "Plantas, alcancías y bancos te esperan"
