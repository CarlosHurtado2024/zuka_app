"""
Clase C1 · Orden, intervalos e inecuaciones (Cálculo diferencial, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. La montaña rusa con estatura mínima (desigualdad y
tricotomía), el espejo de la recta (multiplicar por un negativo voltea el orden, con zoom), los
intervalos como puertas, la inecuación 3 − 2x ≤ x + 9 (zoom al paso que voltea el signo) y la tabla de
signos de (x − 2)(x + 1) ≥ 0 y de (x + 3)/(x − 1) < 0. Del Valle, módulo 1; cronograma de Cálculo, clase 1.

    manimgl orden_inecuaciones.py S02_Espejo -w -l
"""
from trig_scenes import *


def boxed(mob, color=BORDER, fill=PEACH, **kw):
    """Tarjeta con su contenido (get_card solo dibuja el fondo)."""
    return VGroup(get_card(mob, color=color, fill=fill, **kw), mob)


def mark_point(line, x, color, filled=True, r=0.11):
    d = Dot(line.n2p(x), radius=r).set_fill(color if filled else BG_COLOR, 1).set_stroke(color, 4)
    return d


def ray(line, x, right=True, color=C_COS, width=10):
    end = line.get_right() if right else line.get_left()
    return Line(line.n2p(x), end).set_stroke(color, width)


def seg(line, a, b, color=C_COS, width=10):
    return Line(line.n2p(a), line.n2p(b)).set_stroke(color, width)


class S00_Portada(TrigPortada):
    part_tag = "Cálculo · Clase C1"
    title = "Orden, intervalos\ne inecuaciones"
    subtitle = "Quién es mayor, y cuándo se voltea el signo"


class S01_Montana(MBScene):
    def construct(self):
        self.mark("La montaña rusa")
        self.set_header(R"x \ge 120", "La montaña rusa", C_ANG, P_ANG)
        self.say("En la fila de la montaña rusa hay un letrero: para subir hay que medir al menos ciento veinte centímetros. Esa regla es una desigualdad.", fox=True)
        line = get_number_line(x_range=(90, 160, 10), width=7.0, font_size=26).move_to(1.5 * UP)
        unit = T("cm", size=22, color=MUTED).next_to(line, RIGHT, buff=0.1).shift(0.25 * DOWN)
        sign = boxed(VGroup(T("para subir:", size=24, color=MUTED), M(R"x \ge 120", size=44, color=C_ANG)).arrange(DOWN, buff=0.12), color=C_ANG, fill=PEACH).move_to(5.0 * UP + 0.0 * RIGHT)
        sign.scale(0.9).move_to(4.6 * UP)
        self.play(FadeIn(sign, shift=0.2 * DOWN), ShowCreation(line), FadeIn(unit))
        heights = [105, 118, 120, 134, 151]
        kids = VGroup()
        for h in heights:
            body = RoundedRectangle(width=0.32, height=0.4 + (h - 90) / 70 * 1.1, corner_radius=0.12).set_fill(C_COS if h >= 120 else C_SEN, 1).set_stroke(width=0)
            head = Circle(radius=0.16).set_fill(C_COS if h >= 120 else C_SEN, 1).set_stroke(width=0).next_to(body, UP, buff=0.04)
            kid = VGroup(body, head)
            kid.next_to(line.n2p(h), UP, buff=0.12)
            kids.add(kid)
        self.play(LaggedStartMap(FadeIn, kids, shift=0.3 * UP, lag_ratio=0.2), run_time=2)
        self.hold()
        self.say("Los que pasan son los de ciento veinte o más: todo el trozo de la recta desde ciento veinte hacia la derecha. El ciento veinte cuenta, por eso el punto va lleno.")
        r = ray(line, 120, color=C_COS).shift(0.7 * DOWN)
        start = mark_point(line, 120, C_COS).shift(0.7 * DOWN)
        arrow = Arrow(r.get_right() + 0.4 * LEFT, r.get_right() + 0.15 * RIGHT, buff=0, stroke_color=C_COS, stroke_width=8)
        self.play(ShowCreation(r), FadeIn(start, scale=0.5), GrowArrow(arrow), run_time=1.4)
        self.play(Indicate(kids[2], color=C_ANG))
        self.hold()
        self.say("Detrás de esto hay una propiedad de los números reales, la tricotomía: dados dos números, pasa exactamente una de tres cosas.")
        tri = VGroup(*(boxed(M(t, size=40), color=c, fill=PEACH) for t, c in [(R"a < b", C_COS), (R"a = b", C_ANG), (R"a > b", C_SEN)])).arrange(RIGHT, buff=0.25).move_to(1.9 * DOWN)
        note = T("exactamente una", size=28, color=MUTED).next_to(tri, DOWN, buff=0.3)
        self.play(LaggedStartMap(FadeIn, tri, shift=0.2 * UP, lag_ratio=0.3), run_time=1.5)
        self.play(FadeIn(note))
        self.hold(0.5)
        self.end_section()


class S02_Espejo(MBScene):
    def construct(self):
        self.mark("El espejo de la recta")
        self.set_header(R"-1 \cdot", "El espejo", C_SEN, P_SEN)
        line = get_number_line(x_range=(-8, 8, 1), width=7.2, font_size=22).move_to(2.2 * UP)
        a, b = mark_point(line, 2, C_COS), mark_point(line, 5, C_TAN)
        la = M("2", size=34, color=C_COS).next_to(a, UP, buff=0.25)
        lb = M("5", size=34, color=C_TAN).next_to(b, UP, buff=0.25)
        self.say("Tomemos dos números, dos y cinco. Dos es menor que cinco porque está a la izquierda.", fox=True)
        self.play(ShowCreation(line))
        self.play(FadeIn(a, scale=0.5), FadeIn(b, scale=0.5), FadeIn(la), FadeIn(lb))
        rel = M(R"2 < 5", size=48).move_to(0.4 * UP)
        self.play(Write(rel))
        self.hold()
        self.say("Si a los dos les sumamos tres, los dos se corren tres pasos a la derecha. El de la izquierda sigue a la izquierda: el orden se conserva.")
        self.play(a.animate.move_to(line.n2p(5)), b.animate.move_to(line.n2p(8)), la.animate.next_to(line.n2p(5), UP, buff=0.36), lb.animate.next_to(line.n2p(8), UP, buff=0.36), run_time=1.6)
        rel2 = M(R"2 + 3 < 5 + 3", size=44).next_to(rel, DOWN, buff=0.35)
        self.play(FadeIn(rel2, shift=0.2 * UP))
        self.hold()
        self.play(a.animate.move_to(line.n2p(2)), b.animate.move_to(line.n2p(5)), la.animate.next_to(line.n2p(2), UP, buff=0.36), lb.animate.next_to(line.n2p(5), UP, buff=0.36), FadeOut(rel2))
        self.say("Ahora multipliquemos los dos por menos uno. Cada número salta a su reflejo al otro lado del cero, como en un espejo.")
        mirror = DashedLine(line.n2p(0) + 1.1 * UP, line.n2p(0) + 1.1 * DOWN, dash_length=0.12).set_stroke(C_ANG, 3)
        self.play(ShowCreation(mirror))
        self.play(a.animate.move_to(line.n2p(-2)), b.animate.move_to(line.n2p(-5)),
                  la.animate.next_to(line.n2p(-2), UP, buff=0.36), lb.animate.next_to(line.n2p(-5), UP, buff=0.36),
                  run_time=2.2)
        self.play(Transform(la, M("-2", size=34, color=C_COS).move_to(la)), Transform(lb, M("-5", size=34, color=C_TAN).move_to(lb)))
        self.mark("Zoom al reflejo")
        self.zoom_to(VGroup(a, b, la, lb), scale=0.45)
        self.say("Miren: el que estaba a la izquierda ahora quedó a la derecha. Menos dos es mayor que menos cinco. El orden se voltea.")
        self.play(Indicate(a, color=C_COS, scale_factor=1.6), Indicate(b, color=C_TAN, scale_factor=1.6))
        self.hold()
        self.zoom_reset()
        rel3 = M(R"-2 > -5", size=48, color=C_SEN).next_to(rel, DOWN, buff=0.35)
        self.play(FadeIn(rel3, shift=0.2 * UP))
        rule = VGroup(
            boxed(T("sumar o restar: el signo se queda", size=26), color=C_COS, fill=PEACH),
            boxed(T("× o ÷ por un negativo: el signo se voltea", size=26, color=C_SEN), color=C_SEN, fill=PEACH),
        ).arrange(DOWN, buff=0.25).next_to(rel3, DOWN, buff=0.6)
        self.say("Esa es la regla de oro: sumar o restar conserva el sentido; multiplicar o dividir por un negativo lo voltea.")
        self.play(LaggedStartMap(FadeIn, rule, shift=0.2 * UP, lag_ratio=0.4), run_time=1.6)
        self.hold(0.5)
        self.end_section()


class S03_Intervalos(MBScene):
    def construct(self):
        self.mark("Los intervalos")
        self.set_header(R"[a, b)", "Intervalos", C_COS, P_COS)
        self.say("Las soluciones de una desigualdad casi nunca son un número: son trozos de la recta, los intervalos. Sus extremos son como puertas.", fox=True)
        rows = [
            (R"[-1, 3]", R"-1 \le x \le 3", (-1, 3), (True, True)),
            (R"(-1, 3]", R"-1 < x \le 3", (-1, 3), (False, True)),
            (R"[2, \infty)", R"x \ge 2", (2, None), (True, False)),
        ]
        groups = VGroup()
        for k, (name, cond, (lo, hi), (cl, ch)) in enumerate(rows):
            line = get_number_line(x_range=(-3, 5, 1), width=6.0, font_size=20)
            band = seg(line, lo, hi) if hi is not None else ray(line, lo)
            dots = VGroup(mark_point(line, lo, C_COS, cl))
            if hi is not None:
                dots.add(mark_point(line, hi, C_COS, ch))
            label = VGroup(M(name, size=40, color=C_ANG), M(cond, size=32, color=MUTED)).arrange(RIGHT, buff=0.5)
            g = VGroup(label, VGroup(line, band, dots)).arrange(DOWN, buff=0.3)
            groups.add(g)
        groups.arrange(DOWN, buff=0.55).move_to(1.2 * UP)
        for g in groups:
            self.play(FadeIn(g[0], shift=0.2 * UP), ShowCreation(g[1][0]), run_time=0.8)
            self.play(ShowCreation(g[1][1]), FadeIn(g[1][2], scale=0.5), run_time=0.9)
        self.hold()
        self.say("El corchete abraza al extremo: la puerta está abierta y el número entra, punto lleno. El paréntesis lo deja afuera, punto vacío. Y el infinito no es un número: siempre lleva paréntesis.")
        self.play(Indicate(groups[0][0][0], color=C_ANG), Indicate(groups[1][0][0], color=C_ANG))
        self.play(Indicate(groups[2][0][0], color=C_ANG))
        self.hold(0.5)
        self.end_section()


class S04_Lineal(MBScene):
    def construct(self):
        self.mark("Una inecuación lineal")
        self.set_header(R"\le", "Despejar con cuidado", C_TAN, P_TAN)
        self.say("Resolvamos tres menos dos x menor o igual que x más nueve. Se despeja como una ecuación, con un solo cuidado.", fox=True)
        steps = VGroup(
            M(R"3 - 2x \le x + 9", size=48),
            M(R"3 - 3x \le 9", size=48),
            M(R"-3x \le 6", size=48),
            M(R"x \ge -2", size=56, color=C_TAN),
        ).arrange(DOWN, buff=0.45).move_to(2.6 * UP + 1.1 * LEFT)
        notes = VGroup(
            T("− x en los dos lados", size=21, color=MUTED),
            T("− 3 en los dos lados", size=21, color=MUTED),
            T("÷ (−3): ¡se voltea!", size=21, color=C_SEN),
        )
        for k in range(3):
            notes[k].move_to(np.array([2.45, (steps[k].get_y() + steps[k + 1].get_y()) / 2, 0]))
        self.play(Write(steps[0]))
        self.hold()
        self.say("Restamos x a los dos lados, y luego tres. El sentido no cambia, porque solo sumamos y restamos.")
        self.play(FadeIn(steps[1], shift=0.2 * DOWN), FadeIn(notes[0]))
        self.play(FadeIn(steps[2], shift=0.2 * DOWN), FadeIn(notes[1]))
        self.hold()
        self.say("Ahora hay que dividir entre menos tres. Es un negativo: el menor o igual se voltea y queda mayor o igual.")
        self.mark("Zoom al paso que voltea")
        self.zoom_to(VGroup(steps[2], steps[3], notes[2]), scale=0.4)
        self.play(FadeIn(steps[3], shift=0.2 * DOWN), FadeIn(notes[2]))
        self.play(Indicate(steps[3], color=C_SEN, scale_factor=1.2))
        self.hold()
        self.zoom_reset()
        self.say("La solución es x mayor o igual que menos dos: el intervalo desde menos dos, incluido, hasta el infinito. Probemos x igual a cero: tres es menor o igual que nueve. Se cumple.")
        line = get_number_line(x_range=(-5, 5, 1), width=7.0, font_size=22).move_to(np.array([0, steps.get_bottom()[1] - 0.9, 0]))
        band, dot = ray(line, -2, color=C_TAN), mark_point(line, -2, C_TAN)
        ans = M(R"[-2, \infty)", size=44, color=C_TAN).next_to(line, DOWN, buff=0.4)
        check = M(R"x = 0:\; 3 \le 9 \;\checkmark", size=34, color=MUTED).next_to(ans, DOWN, buff=0.3)
        self.play(ShowCreation(line))
        self.play(ShowCreation(band), FadeIn(dot, scale=0.5), Write(ans))
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_Signos(MBScene):
    def construct(self):
        self.mark("La tabla de signos")
        self.set_header(R"+\;-\;+", "Tabla de signos", C_COS, P_COS)
        self.say("Con productos el truco es otro. En x menos dos, por x más uno, mayor o igual que cero, cada factor cambia de signo en su cero: menos uno y dos.", fox=True)
        title = M(R"(x - 2)(x + 1) \ge 0", size=46).move_to(4.5 * UP)
        self.play(Write(title))
        cw, rh, x0, y0 = 1.6, 0.75, -1.3, 3.0
        crit = [(-1, x0 + cw), (2, x0 + 2 * cw)]
        top = Line(np.array([x0, y0, 0]), np.array([x0 + 3 * cw, y0, 0])).set_stroke(INK, 3)
        cdots = VGroup(*(Dot(np.array([cx, y0, 0]), radius=0.09).set_fill(INK, 1) for _, cx in crit))
        clabs = VGroup(*(M(str(v), size=30, color=C_ANG).next_to(np.array([cx, y0, 0]), UP, buff=0.15) for v, cx in crit))
        names = VGroup(M(R"x + 1", size=34), M(R"x - 2", size=34), T("producto", size=26, color=C_ANG))
        for k, n in enumerate(names):
            n.move_to(np.array([x0 - 1.15, y0 - (k + 1) * rh, 0]))
        grid = VGroup(*(DashedLine(np.array([cx, y0, 0]), np.array([cx, y0 - 3.4 * rh, 0]), dash_length=0.08).set_stroke(BORDER, 2) for _, cx in crit))
        self.play(ShowCreation(top), FadeIn(cdots), FadeIn(clabs), FadeIn(names), ShowCreation(grid))
        self.hold()
        self.say("En cada tramo el signo no cambia, así que basta probar un número. A la izquierda de su cero, x más uno es negativo; a la derecha, positivo. Igual con x menos dos.")
        signs = [["-", "+", "+"], ["-", "-", "+"], ["+", "-", "+"]]
        cells = VGroup()
        for i, row in enumerate(signs):
            for j, s in enumerate(row):
                col = C_TAN if s == "+" else C_SEN
                cells.add(M(s, size=48, color=col).move_to(np.array([x0 + (j + 0.5) * cw, y0 - (i + 1) * rh, 0])))
        self.play(LaggedStartMap(FadeIn, cells[:6], scale=0.5, lag_ratio=0.15), run_time=2)
        self.hold()
        self.say("El producto se saca con la ley de signos: menos por menos, más; más por menos, menos; más por más, más.")
        self.mark("Zoom a la fila del producto")
        prod_row = VGroup(names[2], cells[6:])
        self.zoom_to(VGroup(prod_row, cells[3:6]), scale=0.45)
        self.play(LaggedStartMap(FadeIn, cells[6:], scale=0.5, lag_ratio=0.3), run_time=1.5)
        self.hold()
        self.zoom_reset()
        self.say("Queremos mayor o igual que cero: los tramos positivos, y también los ceros, porque ahí el producto vale cero. Solución: hasta menos uno, unido con desde dos.")
        line = get_number_line(x_range=(-4, 5, 1), width=6.6, font_size=22).move_to(0.5 * DOWN)
        sol = VGroup(ray(line, -1, right=False, color=C_TAN), ray(line, 2, color=C_TAN), mark_point(line, -1, C_TAN), mark_point(line, 2, C_TAN))
        ans = M(R"(-\infty, -1] \cup [2, \infty)", size=40, color=C_TAN).next_to(line, DOWN, buff=0.35)
        self.play(ShowCreation(line))
        self.play(ShowCreation(sol[0]), ShowCreation(sol[1]), FadeIn(sol[2:], scale=0.5), Write(ans))
        self.hold()
        self.say("Con un cociente es igual, con una advertencia. En x más tres sobre x menos uno, menor que cero, los signos salen igual, pero en uno el denominador vale cero y la expresión no existe: ese punto nunca entra.")
        q = M(R"\frac{x + 3}{x - 1} < 0 \;\Rightarrow\; (-3, 1)", size=40).next_to(ans, DOWN, buff=0.6)
        line2 = get_number_line(x_range=(-4, 5, 1), width=6.6, font_size=22).next_to(q, DOWN, buff=0.4)
        sol2 = VGroup(seg(line2, -3, 1, color=C_SEN), mark_point(line2, -3, C_SEN, False), mark_point(line2, 1, C_SEN, False))
        self.play(Write(q))
        self.play(ShowCreation(line2), ShowCreation(sol2[0]), FadeIn(sol2[1:], scale=0.5))
        self.hold(0.5)
        self.end_section()


class S06_Cierre(TrigCierre):
    recap = [
        ("Tricotomía", "dados a y b: a < b, a = b o a > b (solo una)", C_ANG),
        ("La regla de oro", "× o ÷ por un negativo voltea el signo", C_SEN),
        ("Intervalos", "corchete: entra · paréntesis: no · ∞ siempre con paréntesis", C_COS),
        ("Tabla de signos", "ceros de cada factor → signo por tramos → producto", C_TAN),
    ]
    recap_say = ("Repasemos: entre dos números siempre pasa una sola de tres cosas; multiplicar o dividir por un negativo "
                 "voltea el signo; los intervalos se escriben con corchetes y paréntesis; y los productos se resuelven con una tabla de signos.")
    practice = "Ahora: despeja sin perder la sombra,\nllena la tabla de signos\ny dibuja el intervalo"
