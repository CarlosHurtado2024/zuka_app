"""
Clase T10 · Seno, coseno y tangente inversos (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Una recta horizontal corta al seno infinitas veces:
para invertirlo se recorta a [−π/2, π/2] y se refleja en y = x. Con la circunferencia se ve el rango de
cada inversa (zoom al punto que gana), la tangente inversa con sus asíntotas horizontales, la trampa de
la cancelación y un tobogán. Manual de la UdeA §13.6.

    manimgl inversas.py S02_Rangos -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def make_axes(x_range, y_range, width, height, center=ORIGIN):
    ax = Axes(x_range=x_range, y_range=y_range, width=width, height=height,
              axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
    ax.move_to(center)
    return ax


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T10"
    title = "Seno, coseno y\ntangente inversos"
    subtitle = "Del número de vuelta al ángulo"


class S01_Invertir(MBScene):
    def construct(self):
        self.mark("Demasiados candidatos")
        self.set_header(R"\operatorname{sen}^{-1}", "Al revés", C_SEN, P_SEN)
        ax = make_axes((-2 * PI, 2 * PI, PI / 2), (-1.5, 1.5, 1), 7.4, 3.0, center=2.6 * UP)
        wave = ax.get_graph(np.sin, x_range=(-2 * PI, 2 * PI)).set_stroke(C_SEN, 5)
        self.say("El seno convierte un ángulo en un número. Pero si te dan el número, digamos un medio, y preguntas de qué "
                 "ángulo salió, hay un problema.", fox=True)
        self.play(ShowCreation(ax), ShowCreation(wave, run_time=2))
        level = ax.get_graph(lambda x: 0.5, x_range=(-2 * PI, 2 * PI)).set_stroke(C_ANG, 3)
        level_lab = M(R"y = \tfrac12", size=34, color=C_ANG).next_to(ax.c2p(2 * PI, 0.5), UP, buff=0.15).shift(0.5 * LEFT)
        self.play(ShowCreation(level), FadeIn(level_lab))
        xs = [PI / 6, 5 * PI / 6, PI / 6 - 2 * PI, 5 * PI / 6 - 2 * PI]
        dots = VGroup(*(Dot(ax.c2p(x, 0.5), radius=0.1).set_color(C_ANG) for x in xs))
        self.play(LaggedStartMap(GrowFromCenter, dots, lag_ratio=0.25))
        many = T("¡y siguen apareciendo en cada vuelta!", size=30, color=C_ANG).move_to(0.4 * UP)
        self.play(FadeIn(many, shift=0.2 * UP))
        self.hold()
        self.say("La recta horizontal choca con la onda una y otra vez: hay infinitos candidatos. Una función inversa tiene "
                 "que dar una sola respuesta.")
        self.hold()

        self.mark("Recortar")
        self.play(FadeOut(many), FadeOut(dots[1:]))
        piece = ax.get_graph(np.sin, x_range=(-PI / 2, PI / 2)).set_stroke(C_SEN, 8)
        band = Rectangle(ax.c2p(PI / 2, 0)[0] - ax.c2p(-PI / 2, 0)[0], 3.2).move_to(ax.c2p(0, 0))
        band.set_fill(C_SEN, 0.12).set_stroke(width=0)
        self.say("La salida: quedarnos con un solo tramo. Entre menos pi medios y pi medios el seno sube sin repetirse y pasa "
                 "por todos los valores de menos uno a uno.")
        self.play(FadeIn(band), wave.animate.set_stroke(opacity=0.25), ShowCreation(piece, run_time=1.5))
        ends = VGroup(M(R"-\tfrac{\pi}{2}", size=30, color=C_SEN).next_to(ax.c2p(-PI / 2, -1.2), DOWN, buff=0.1),
                      M(R"\tfrac{\pi}{2}", size=30, color=C_SEN).next_to(ax.c2p(PI / 2, -1.2), DOWN, buff=0.1))
        self.play(FadeIn(ends))
        self.hold()

        self.mark("Reflejar en y = x")
        self.play(FadeOut(VGroup(wave, level, level_lab, dots[0], band, ends)), FadeOut(ax))
        ax2 = make_axes((-2, 2, 1), (-2, 2, 1), 5.6, 5.6, center=1.6 * UP)
        diag = DashedLine(ax2.c2p(-2, -2), ax2.c2p(2, 2)).set_stroke(MUTED, 2)
        sin_piece = ax2.get_graph(np.sin, x_range=(-PI / 2, PI / 2)).set_stroke(C_SEN, 6)
        self.remove(piece)
        self.play(ShowCreation(ax2), ShowCreation(diag), ShowCreation(sin_piece))
        asin = ax2.get_graph(np.arcsin, x_range=(-1, 1)).set_stroke(C_COS, 6)
        self.say("Ahora se invierte como cualquier función: se refleja la gráfica en la recta y igual a x. Las entradas pasan "
                 "a ser salidas.")
        self.play(TransformFromCopy(sin_piece, asin), run_time=2.2)
        lab = M(R"y = " + SEN + R"^{-1} x", size=44, color=C_COS).move_to(2.6 * DOWN)
        meaning = M(SEN + R"^{-1} x = y \iff " + SEN + R" y = x,\;\; -\tfrac{\pi}{2} \le y \le \tfrac{\pi}{2}", size=34).next_to(lab, DOWN, buff=0.35)
        self.play(Write(lab))
        self.say("Seno inverso de x es el ángulo entre menos pi medios y pi medios cuyo seno es x. También se llama arcoseno.")
        self.play(Write(meaning))
        self.hold(0.5)
        self.end_section()


class S02_Rangos(MBScene):
    def construct(self):
        self.mark("El rango del seno inverso")
        self.set_header(R"\operatorname{sen}^{-1}", "¿Cuál ángulo gana?", C_SEN, P_SEN)
        R_ = 2.8
        c = 1.3 * UP
        axes = get_trig_axes(R_, c)
        self.say("En la circunferencia unitaria el seno es la altura. Busquemos seno inverso de raíz de tres medios.", fox=True)
        self.play(ShowCreation(axes))
        half = AnnularSector(inner_radius=0, outer_radius=R_, angle=PI, start_angle=-PI / 2, arc_center=c)
        half.set_fill(C_SEN, 0.13).set_stroke(width=0)
        y = np.sqrt(3) / 2
        line = DashedLine(c + R_ * (y * UP + 1.25 * LEFT), c + R_ * (y * UP + 1.25 * RIGHT)).set_stroke(C_ANG, 3)
        p1, p2 = point_on(PI / 3, R_, c), point_on(2 * PI / 3, R_, c)
        d1, d2 = Dot(p1, radius=0.12).set_color(C_ANG), Dot(p2, radius=0.12).set_color(C_ANG)
        self.play(ShowCreation(line))
        self.play(GrowFromCenter(d1), GrowFromCenter(d2))
        self.say("La altura raíz de tres medios aparece dos veces: en sesenta grados y en ciento veinte. Pero el seno inverso "
                 "solo mira la mitad derecha, de menos noventa a noventa grados.")
        self.play(FadeIn(half))
        cross = ex_mark(size=56).move_to(p2 + 0.45 * UL)
        self.play(d2.animate.set_color(MUTED), FadeIn(cross))
        self.hold()
        self.mark("Zoom al ganador")
        radius = Line(c, p1).set_stroke(C_SEN, 5)
        arc = get_angle_arc(PI / 3, 0.6, c)
        self.play(ShowCreation(radius), ShowCreation(arc))
        ans = M(SEN + R"^{-1}\tfrac{\sqrt3}{2} = \tfrac{\pi}{3}", size=30, color=C_SEN).next_to(p1, UP, buff=0.3).shift(0.5 * LEFT)
        self.zoom_to(VGroup(radius, d1), scale=0.45)
        self.play(Write(ans))
        self.say("Gana el de la mitad derecha: seno inverso de raíz de tres medios es pi tercios, sesenta grados.")
        self.hold()
        self.zoom_reset()
        self.clear_scene(keep=[axes])

        self.mark("El rango del coseno inverso")
        self.set_header(R"\cos^{-1}", "Ahora el coseno", C_COS, P_COS)
        top = AnnularSector(inner_radius=0, outer_radius=R_, angle=PI, start_angle=0, arc_center=c)
        top.set_fill(C_COS, 0.13).set_stroke(width=0)
        x = -0.5
        vline = DashedLine(c + R_ * (x * RIGHT + 1.25 * DOWN), c + R_ * (x * RIGHT + 1.25 * UP)).set_stroke(C_ANG, 3)
        q1, q2 = point_on(2 * PI / 3, R_, c), point_on(4 * PI / 3, R_, c)
        e1, e2 = Dot(q1, radius=0.12).set_color(C_ANG), Dot(q2, radius=0.12).set_color(C_ANG)
        self.say("El coseno es el avance horizontal. Para coseno inverso de menos un medio, la recta vertical x igual a menos "
                 "un medio corta en dos puntos.", fox=True)
        self.play(ShowCreation(vline))
        self.play(GrowFromCenter(e1), GrowFromCenter(e2))
        self.say("Aquí la mitad que manda es la de arriba, de cero a ciento ochenta grados, porque ahí el coseno recorre "
                 "todos sus valores sin repetir.")
        self.play(FadeIn(top))
        cross2 = ex_mark(size=56).move_to(q2 + 0.45 * DL)
        self.play(e2.animate.set_color(MUTED), FadeIn(cross2))
        r2 = Line(c, q1).set_stroke(C_COS, 5)
        arc2 = get_angle_arc(2 * PI / 3, 0.6, c)
        self.play(ShowCreation(r2), ShowCreation(arc2))
        self.zoom_to(VGroup(r2, arc2), scale=0.5)
        ans2 = M(R"\cos^{-1}\!\left(-\tfrac12\right) = \tfrac{2\pi}{3}", size=28, color=C_COS).next_to(q1, UP, buff=0.15)
        self.play(Write(ans2))
        self.say("El ganador está en el segundo cuadrante: coseno inverso de menos un medio es dos pi tercios, ciento veinte grados.")
        self.hold()
        self.zoom_reset()
        table = VGroup(
            M(SEN + R"^{-1}: \left[-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right]", size=40, color=C_SEN),
            M(R"\cos^{-1}: [0, \pi]", size=40, color=C_COS),
        ).arrange(DOWN, buff=0.3)
        table.move_to(3.4 * DOWN)
        self.play(FadeIn(table, shift=0.2 * UP))
        self.say("Regla de bolsillo: seno inverso vive a la derecha; coseno inverso, arriba.")
        self.hold(0.5)
        self.end_section()


class S03_Tangente(MBScene):
    def construct(self):
        self.mark("La tangente inversa")
        self.set_header(R"\tan^{-1}", "Tangente inversa", C_TAN, P_TAN)
        ax = make_axes((-4, 4, 1), (-4, 4, 1), 6.4, 6.4, center=1.2 * UP)
        w = np.arctan(4)
        tan_piece = ax.get_graph(np.tan, x_range=(-w, w)).set_stroke(C_TAN, 5)
        asy = VGroup(*(DashedLine(ax.c2p(s * PI / 2, -4), ax.c2p(s * PI / 2, 4)).set_stroke(C_I, 2) for s in (-1, 1)))
        self.say("La tangente ya se puede invertir en un solo tramo, entre menos pi medios y pi medios, sin incluir los "
                 "bordes, porque ahí tiene asíntotas.", fox=True)
        self.play(ShowCreation(ax), ShowCreation(asy))
        self.play(ShowCreation(tan_piece), run_time=1.6)
        diag = DashedLine(ax.c2p(-4, -4), ax.c2p(4, 4)).set_stroke(MUTED, 2)
        atan = ax.get_graph(np.arctan, x_range=(-4, 4)).set_stroke(C_COS, 6)
        hasy = VGroup(*(DashedLine(ax.c2p(-4, s * PI / 2), ax.c2p(4, s * PI / 2)).set_stroke(C_I, 2) for s in (-1, 1)))
        self.play(ShowCreation(diag))
        self.say("Al reflejarla, las asíntotas verticales se acuestan: la tangente inversa nunca pasa de pi medios ni baja de "
                 "menos pi medios, por grande que sea el número.")
        self.play(TransformFromCopy(tan_piece, atan), TransformFromCopy(asy, hasy), run_time=2.2)
        lab = M(R"\tan^{-1}: \left(-\tfrac{\pi}{2}, \tfrac{\pi}{2}\right)", size=44, color=C_COS).move_to(3.0 * DOWN)
        self.play(Write(lab))
        self.hold()
        self.mark("La trampa de cancelar")
        self.clear_scene()
        self.set_header(R"\operatorname{sen}^{-1}(\operatorname{sen} x)", "La trampa", C_ANG, P_ANG)
        steps = VGroup(
            M(SEN + R"^{-1}\left(" + SEN + R"\tfrac{3\pi}{4}\right) \;=\; ?", size=50),
            M(SEN + R"\tfrac{3\pi}{4} = \tfrac{\sqrt2}{2}", size=46, color=C_SEN),
            M(SEN + R"^{-1}\tfrac{\sqrt2}{2} = \tfrac{\pi}{4}", size=46, color=C_COS),
            M(R"\tfrac{\pi}{4} \ne \tfrac{3\pi}{4}", size=52, color=C_ANG),
        ).arrange(DOWN, buff=0.55).move_to(1.4 * UP)
        self.say("Una trampa clásica: seno inverso de seno de tres pi cuartos. Tentador decir que se cancelan.", fox=True)
        self.play(Write(steps[0]))
        self.hold()
        self.say("Pero calcula por partes: seno de tres pi cuartos es raíz de dos medios, y el ángulo de la mitad derecha con ese "
                 "seno es pi cuartos.")
        self.play(FadeIn(steps[1], shift=0.2 * DOWN))
        self.play(FadeIn(steps[2], shift=0.2 * DOWN))
        self.hold()
        note = T("Solo se cancelan si el ángulo ya está en el rango", size=30, color=INK).next_to(steps, DOWN, buff=0.6)
        self.say("No volvimos a tres pi cuartos porque ese ángulo está fuera del rango. Solo se cancelan si el ángulo ya vive ahí.")
        self.play(Write(steps[3]), FadeIn(note))
        self.hold(0.5)
        self.end_section()


class S04_Tobogan(MBScene):
    def construct(self):
        self.mark("El tobogán")
        self.set_header(R"\theta = \operatorname{sen}^{-1}\tfrac{op}{hip}", "El tobogán", C_ANG, P_ANG)
        base = 2.2 * DOWN + 3.0 * LEFT
        top = base + 3.0 * UP
        foot = base + np.sqrt(36 - 9) * RIGHT       # tobogán de 6 unidades con 3 de alto (escala 1:1 → 8 m y 4 m)
        ground = Line(base + 0.4 * LEFT, foot + 0.6 * RIGHT).set_stroke(MUTED, 3)
        ladder = Line(base, top).set_stroke(C_COS, 6)
        slide = Line(top, foot).set_stroke(C_SEN, 10)
        self.say("En un parque, un tobogán de ocho metros baja desde una plataforma de cuatro metros de alto. ¿Qué tan empinado es?", fox=True)
        self.play(ShowCreation(ground), ShowCreation(ladder))
        self.play(ShowCreation(slide))
        kid = Dot(top, radius=0.18).set_color(C_ANG)
        self.play(FadeIn(kid, scale=0.5))
        self.play(MoveAlongPath(kid, slide), run_time=1.6, rate_func=rush_into)
        hl = M(R"4\text{ m}", size=36, color=C_COS).next_to(ladder, LEFT, buff=0.2)
        sl = M(R"8\text{ m}", size=36, color=C_SEN).move_to(slide.get_center() + 0.45 * UR)
        ang = Arc(start_angle=PI - np.arctan(3 / np.sqrt(27)), angle=np.arctan(3 / np.sqrt(27)), radius=1.0, arc_center=foot).set_stroke(C_ANG, 5)
        th = M(R"\theta", size=40, color=C_ANG).next_to(ang, LEFT, buff=0.12).shift(0.15 * UP)
        self.play(FadeIn(hl), FadeIn(sl), ShowCreation(ang), FadeIn(th))
        self.say("La altura es el lado opuesto al ángulo del piso y el tobogán es la hipotenusa. Eso es un seno.")
        self.hold()
        steps = VGroup(
            M(SEN + R"\theta = \frac{4}{8} = \frac12", size=46),
            M(R"\theta = " + SEN + R"^{-1}\tfrac12 = 30^\circ", size=50, color=C_ANG),
        ).arrange(DOWN, buff=0.4).move_to(3.6 * UP)
        self.play(Write(steps[0]))
        self.say("Seno de theta es un medio, y el seno inverso nos devuelve el ángulo: treinta grados.")
        self.play(Write(steps[1]))
        self.hold()
        self.mark("Con calculadora")
        calc = VGroup(
            M(R"\text{otro: } 3\text{ m de alto},\; 10\text{ m de largo}", size=34, color=MUTED),
            M(R"\theta = " + SEN + R"^{-1}(0.3) \approx 17.5^\circ", size=46, color=C_COS),
        ).arrange(DOWN, buff=0.35).move_to(3.8 * DOWN)
        self.say("Si los números no son notables, la calculadora hace el trabajo: con tres metros de alto y diez de largo, "
                 "seno inverso de cero coma tres da unos diecisiete grados y medio. Mucho más suave.")
        self.play(FadeIn(calc[0]))
        self.play(Write(calc[1]))
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Recortar", "una sola rama para que haya una sola respuesta", C_SEN),
        ("sen⁻¹", "ángulos de −π/2 a π/2 (mitad derecha)", C_SEN),
        ("cos⁻¹", "ángulos de 0 a π (mitad de arriba)", C_COS),
        ("tan⁻¹", "ángulos entre −π/2 y π/2, sin los bordes", C_TAN),
    ]
    recap_say = ("Repasemos: para invertir, recortamos a una rama; el seno inverso da ángulos de la mitad derecha, el coseno "
                 "inverso de la mitad de arriba y la tangente inversa entre menos pi medios y pi medios.")
    practice = "Ahora, el juego:\napunta el cañón\nal globo del rango"
