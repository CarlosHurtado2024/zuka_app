"""
Clase C4 · La recta: pendiente, paralelas y perpendiculares (Cálculo diferencial, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. La pendiente como inclinación de una rampa (subida
sobre avance, una rampa que se empina en vivo), la pendiente por (−1, 3) y (2, −3) (zoom al escalón),
las formas punto-pendiente, pendiente-intercepto y general, la paralela y la perpendicular por (0, 4)
(el escalón que gira 90°, zoom al ángulo recto) y las rectas horizontal y vertical. Del Valle,
módulo 2 (§2.3–2.5); cronograma de Cálculo, clase 3.

    manimgl recta.py S05_Perpendiculares -w -l
"""
from trig_scenes import *


def boxed(mob, color=BORDER, fill=PEACH, **kw):
    """Tarjeta con su contenido (get_card solo dibuja el fondo)."""
    return VGroup(get_card(mob, color=color, fill=fill, **kw), mob)


def get_plane(x_range, y_range, unit):
    axes = Axes(x_range=x_range, y_range=y_range, width=(x_range[1] - x_range[0]) * unit, height=(y_range[1] - y_range[0]) * unit,
                 axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
    grid = VGroup()
    for x in range(int(x_range[0]), int(x_range[1]) + 1):
        grid.add(Line(axes.c2p(x, y_range[0]), axes.c2p(x, y_range[1])).set_stroke(BORDER, 1))
    for y in range(int(y_range[0]), int(y_range[1]) + 1):
        grid.add(Line(axes.c2p(x_range[0], y), axes.c2p(x_range[1], y)).set_stroke(BORDER, 1))
    return VGroup(grid, axes)


def line_through(axes, m, x1, y1, color, xr):
    """Recta de pendiente m por (x1, y1), recortada a la ventana de y."""
    y0, y1r = axes.y_range[0], axes.y_range[1]
    xs = [xr[0], xr[1]]
    pts = []
    for x in xs:
        y = y1 + m * (x - x1)
        if y < y0:
            x = x1 + (y0 - y1) / m; y = y0
        elif y > y1r:
            x = x1 + (y1r - y1) / m; y = y1r
        pts.append(axes.c2p(x, y))
    return Line(*pts).set_stroke(color, 5)


def step(axes, x1, y1, run, rise, c_run=C_COS, c_rise=C_SEN):
    h = DashedLine(axes.c2p(x1, y1), axes.c2p(x1 + run, y1), dash_length=0.1).set_stroke(c_run, 4)
    v = DashedLine(axes.c2p(x1 + run, y1), axes.c2p(x1 + run, y1 + rise), dash_length=0.1).set_stroke(c_rise, 4)
    return VGroup(h, v)


class S00_Portada(TrigPortada):
    part_tag = "Cálculo · Clase C4"
    title = "La recta: pendiente,\nparalelas y perpendiculares"
    subtitle = "Rampas, rieles y ángulos rectos"


class S01_Rampa(MBScene):
    def construct(self):
        self.mark("La pendiente de una rampa")
        self.set_header(R"m", "La rampa", C_TAN, P_TAN)
        self.say("Una rampa para patinetas: lo que importa es qué tan empinada es. Eso se mide con la pendiente: cuánto sube por cada paso que avanza.", fox=True)
        plane = get_plane((0, 6, 1), (0, 6, 1), 0.95).move_to(1.6 * UP)
        axes = plane[1]
        self.play(ShowCreation(plane), run_time=1.2)
        m = ValueTracker(0.75)

        def ramp():
            mv = m.get_value()
            top = min(6, 4 * mv)
            run = top / mv if mv > 0 else 4
            tri = Polygon(axes.c2p(0, 0), axes.c2p(run, 0), axes.c2p(run, top)).set_fill(C_TAN, 0.25).set_stroke(C_TAN, 5)
            read = T(f"sube {top:.1f}  ·  avanza {run:.1f}  ·  m = {mv:.2f}", size=26, color=INK).move_to(1.9 * DOWN)
            return VGroup(tri, read)

        r = always_redraw(ramp)
        self.add(r)
        self.hold()
        self.say("Esta sube tres por cada cuatro que avanza: pendiente tres cuartos. Si la empinamos, la pendiente crece; si la aplanamos, se acerca a cero.")
        self.play(m.animate.set_value(1.5), run_time=2)
        self.play(m.animate.set_value(0.25), run_time=2)
        self.play(m.animate.set_value(0.75), run_time=1.2)
        r.clear_updaters()
        formula = boxed(M(R"m = \frac{\text{subida}}{\text{avance}} = \frac{y_2 - y_1}{x_2 - x_1}", size=40, color=C_TAN), color=C_TAN, fill=PEACH).move_to(3.4 * DOWN)
        self.say("Una rampa de bajada tiene pendiente negativa: al avanzar, baja. Y el piso plano tiene pendiente cero.")
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S02_DosPuntos(MBScene):
    def construct(self):
        self.mark("La pendiente con dos puntos")
        self.set_header(R"\frac{\Delta y}{\Delta x}", "Dos puntos", C_COS, P_COS)
        self.say("Dos puntos bastan para una recta: menos uno, tres y dos, menos tres. Para la pendiente, armamos el escalón de uno a otro.", fox=True)
        plane = get_plane((-3, 4, 1), (-4, 5, 1), 0.66).move_to(1.4 * UP)
        axes = plane[1]
        P = Dot(axes.c2p(-1, 3), radius=0.1).set_fill(C_ANG, 1)
        Q = Dot(axes.c2p(2, -3), radius=0.1).set_fill(C_ANG, 1)
        lp = M(R"(-1, 3)", size=28, color=C_ANG).next_to(P, UR, buff=0.08)
        lq = M(R"(2, -3)", size=28, color=C_ANG).next_to(Q, LEFT, buff=0.12)
        self.play(ShowCreation(plane), run_time=1.2)
        self.play(FadeIn(P, scale=0.5), FadeIn(Q, scale=0.5), FadeIn(lp), FadeIn(lq))
        line = line_through(axes, -2, -1, 3, C_TAN, (-3, 4))
        self.play(ShowCreation(line))
        st = step(axes, -1, 3, 3, -6)
        self.play(ShowCreation(st[0]))
        self.play(ShowCreation(st[1]))
        lrun = M(R"\text{avanza } 3", size=26, color=C_COS).next_to(st[0], DOWN, buff=0.1).shift(0.5 * RIGHT)
        lrise = M(R"\text{baja } 6", size=26, color=C_SEN).next_to(st[1], RIGHT, buff=0.1)
        self.play(FadeIn(lrun), FadeIn(lrise))
        self.mark("Zoom al escalón")
        calc = M(R"m = \frac{-3 - 3}{2 - (-1)} = \frac{-6}{3} = -2", size=30, color=C_TAN).move_to(axes.c2p(0.5, -3.6))
        self.zoom_to(VGroup(st, lrun, lrise, P, Q, calc), scale=0.6)
        self.say("Avanza tres y baja seis: por cada paso que avanza, baja dos. La pendiente es menos seis sobre tres, menos dos.")
        self.play(Write(calc))
        self.hold()
        self.zoom_reset()
        self.say("Siempre se resta en el mismo orden arriba y abajo: el segundo punto menos el primero, en las y y en las x.")
        self.hold(0.3)
        self.end_section()


class S03_Formas(MBScene):
    def construct(self):
        self.mark("Las formas de la ecuación")
        self.set_header(R"y = mx + b", "La ecuación", C_ANG, P_ANG)
        self.say("Con la pendiente y un punto ya se escribe la recta. La forma punto-pendiente dice: lo que sube y es m veces lo que avanza x desde el punto.", fox=True)
        steps = VGroup(
            M(R"y - y_1 = m(x - x_1)", size=44, color=MUTED),
            M(R"y - 3 = -2(x + 1)", size=46),
            M(R"y = -2x + 1", size=50, color=C_TAN),
            M(R"2x + y - 1 = 0", size=46, color=C_COS),
        ).arrange(DOWN, buff=0.35).move_to(3.3 * UP)
        self.play(FadeIn(steps[0]))
        self.play(FadeIn(steps[1], shift=0.2 * DOWN))
        self.hold()
        self.say("Despejando y sale la forma pendiente-intercepto: y igual a menos dos x más uno. El menos dos es la pendiente y el uno es donde la recta corta el eje y.")
        self.play(FadeIn(steps[2], shift=0.2 * DOWN))
        plane = get_plane((-3, 3, 1), (-3, 5, 1), 0.5).next_to(steps, DOWN, buff=0.5)
        axes = plane[1]
        line = line_through(axes, -2, 0, 1, C_TAN, (-3, 3))
        b = Dot(axes.c2p(0, 1), radius=0.11).set_fill(C_ANG, 1)
        bl = M(R"b = 1", size=28, color=C_ANG).next_to(b, RIGHT, buff=0.15)
        self.play(ShowCreation(plane), ShowCreation(line))
        self.play(FadeIn(b, scale=0.5), FadeIn(bl))
        self.hold()
        self.say("Pasando todo a un lado queda la forma general: dos x más y menos uno igual a cero. Las tres formas describen la misma recta.")
        self.play(FadeIn(steps[3], shift=0.2 * DOWN))
        self.hold(0.5)
        self.end_section()


class S04_Paralelas(MBScene):
    def construct(self):
        self.mark("Rectas paralelas")
        self.set_header(R"m_1 = m_2", "Paralelas", C_COS, P_COS)
        self.say("Dos rieles de tren nunca se cruzan porque suben al mismo ritmo: rectas paralelas, misma pendiente.", fox=True)
        plane = get_plane((-3, 4, 1), (-3, 6, 1), 0.66).move_to(1.6 * UP)
        axes = plane[1]
        l1 = line_through(axes, -2, 0, 1, C_TAN, (-3, 4))
        self.play(ShowCreation(plane), ShowCreation(l1), run_time=1.4)
        l2 = l1.copy().set_stroke(C_COS)
        P = Dot(axes.c2p(0, 4), radius=0.11).set_fill(C_ANG, 1)
        lp = M(R"(0, 4)", size=28, color=C_ANG).next_to(P, RIGHT, buff=0.15)
        self.play(FadeIn(P, scale=0.5), FadeIn(lp))
        self.say("Para la paralela que pasa por cero, cuatro, deslizamos la misma recta hacia arriba sin girarla.")
        target = line_through(axes, -2, 0, 4, C_COS, (-3, 4))
        self.play(Transform(l2, target), run_time=2)
        s1, s2 = step(axes, 0, 1, 1, -2), step(axes, 0, 4, 1, -2)
        self.play(ShowCreation(s1), ShowCreation(s2))
        self.hold()
        eqs = VGroup(M(R"y = -2x + 1", size=40, color=C_TAN), M(R"y = -2x + 4", size=40, color=C_COS)).arrange(RIGHT, buff=0.6).move_to(2.6 * DOWN)
        self.say("El mismo escalón en las dos: avanza uno, baja dos. Solo cambia el corte: y igual a menos dos x más cuatro.")
        self.play(FadeIn(eqs, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_Perpendiculares(MBScene):
    def construct(self):
        self.mark("Rectas perpendiculares")
        self.set_header(R"m_1 m_2 = -1", "Perpendiculares", C_SEN, P_SEN)
        self.say("Ahora giremos la recta un cuarto de vuelta alrededor de cero, cuatro. Miremos qué le pasa al escalón.", fox=True)
        plane = get_plane((-3, 4, 1), (0, 7, 1), 0.82).move_to(1.6 * UP)
        axes = plane[1]
        piv = axes.c2p(0, 4)
        l1 = line_through(axes, -2, 0, 4, C_COS, (-3, 4))
        st = step(axes, 0, 4, 1, -2)
        P = Dot(piv, radius=0.11).set_fill(C_ANG, 1)
        self.play(ShowCreation(plane), ShowCreation(l1), FadeIn(P), run_time=1.4)
        self.play(ShowCreation(st))
        lab = VGroup(M(R"\text{avanza } 1", size=24, color=C_COS).next_to(st[0], UP, buff=0.08), M(R"\text{baja } 2", size=24, color=C_SEN).next_to(st[1], RIGHT, buff=0.08))
        self.play(FadeIn(lab))
        self.hold()
        self.say("Al girar noventa grados, el avance se vuelve subida y la bajada se vuelve avance: ahora avanza dos y sube uno.")
        group = VGroup(l1.copy().set_stroke(C_SEN), st.copy())
        self.play(FadeOut(lab))
        self.play(Rotate(group, PI / 2, about_point=piv), run_time=2.4)
        l2 = line_through(axes, 0.5, 0, 4, C_SEN, (-3, 4))
        st2 = step(axes, 0, 4, 2, 1, c_run=C_SEN, c_rise=C_COS)
        self.play(FadeOut(group), ShowCreation(l2), ShowCreation(st2))
        self.mark("Zoom al ángulo recto")
        u1 = normalize(np.array(axes.c2p(1, -2)) - np.array(axes.c2p(0, 0)))   # dirección de la recta original
        u2 = normalize(np.array(axes.c2p(2, 1)) - np.array(axes.c2p(0, 0)))    # dirección de la perpendicular
        corner = Polygon(piv, piv + 0.35 * u1, piv + 0.35 * (u1 + u2), piv + 0.35 * u2).set_stroke(C_ANG, 3)
        self.zoom_to(VGroup(P, corner, st2), scale=0.4)
        self.play(ShowCreation(corner))
        self.say("La pendiente nueva es un medio: el recíproco de dos, con el signo cambiado. Por eso el producto de las pendientes es menos uno.")
        self.hold()
        self.zoom_reset()
        res = VGroup(
            M(R"m_\perp = -\frac{1}{m} = -\frac{1}{-2} = \frac12", size=38, color=C_SEN),
            M(R"(-2) \cdot \tfrac12 = -1 \qquad y = \tfrac12 x + 4", size=36),
        ).arrange(DOWN, buff=0.3).move_to(2.5 * DOWN)
        self.play(FadeIn(res[0], shift=0.2 * UP))
        self.play(FadeIn(res[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S06_HorizVert(MBScene):
    def construct(self):
        self.mark("Horizontales y verticales")
        self.set_header(R"x = a", "Casos especiales", C_ANG, P_ANG)
        self.say("Dos casos especiales. Una recta horizontal no sube nada: pendiente cero, y su ecuación es y igual a un número.", fox=True)
        plane = get_plane((-3, 3, 1), (-2, 4, 1), 0.9).move_to(1.8 * UP)
        axes = plane[1]
        h = Line(axes.c2p(-3, 2), axes.c2p(3, 2)).set_stroke(C_TAN, 5)
        hl = M(R"y = 2 \quad (m = 0)", size=32, color=C_TAN).next_to(axes.c2p(1.5, 2), UP, buff=0.12)
        self.play(ShowCreation(plane), run_time=1.2)
        self.play(ShowCreation(h), FadeIn(hl))
        self.hold()
        self.say("Una vertical no avanza nada: en la pendiente habría que dividir entre cero, así que no tiene pendiente. Su ecuación es x igual a un número.")
        v = Line(axes.c2p(-1, -2), axes.c2p(-1, 4)).set_stroke(C_SEN, 5)
        vl = M(R"x = -1", size=32, color=C_SEN).next_to(axes.c2p(-1, -1.2), LEFT, buff=0.15)
        self.play(ShowCreation(v), FadeIn(vl))
        corner = Square(0.3).set_stroke(C_ANG, 3).move_to(axes.c2p(-1, 2) + 0.15 * (RIGHT + DOWN))
        self.play(ShowCreation(corner))
        self.say("Y son perpendiculares entre sí: la regla de menos uno no aplica aquí, pero el ángulo recto está ahí.")
        note = boxed(T("horizontal ⟂ vertical", size=30, color=C_ANG), color=C_ANG, fill=PEACH).move_to(2.4 * DOWN)
        self.play(FadeIn(note, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S07_Cierre(TrigCierre):
    recap = [
        ("Pendiente", "m = (y₂ − y₁)/(x₂ − x₁): sube sobre avanza", C_TAN),
        ("Ecuaciones", "y − y₁ = m(x − x₁) · y = mx + b · Ax + By + C = 0", C_ANG),
        ("Paralelas", "misma pendiente", C_COS),
        ("Perpendiculares", "m₁ · m₂ = −1 · horizontal ⟂ vertical", C_SEN),
    ]
    recap_say = ("Repasemos: la pendiente es lo que sube sobre lo que avanza; la recta se escribe en forma punto-pendiente, "
                 "pendiente-intercepto o general; las paralelas comparten pendiente y las perpendiculares tienen pendientes de producto menos uno.")
    practice = "Ahora: apunta el láser,\ngira los rieles\ny ordena los pasos"
