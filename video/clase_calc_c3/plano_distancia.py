"""
Clase C3 · Plano cartesiano, distancia y punto medio (Cálculo diferencial, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. El plano como mapa del tesoro (cuadrantes), la
distancia de A(−1, 2) a B(5, 10) con Pitágoras (zoom al triángulo), el punto medio como promedio, el
balancín con pesos 2 y 1 entre A(1, 1) y B(7, 4) (punto que divide en una razón) y el punto del eje y
equidistante de (−3, 0) y (1, 4). Del Valle, módulo 2 (§2.1–2.2); cronograma de Cálculo, clase 3.

    manimgl plano_distancia.py S02_Distancia -w -l
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


def pt(axes, x, y, color, label=None, direction=UR, size=28):
    d = Dot(axes.c2p(x, y), radius=0.1).set_fill(color, 1)
    if label is None:
        return d
    return VGroup(d, M(label, size=size, color=color).next_to(d, direction, buff=0.1))


class S00_Portada(TrigPortada):
    part_tag = "Cálculo · Clase C3"
    title = "Plano cartesiano,\ndistancia y punto medio"
    subtitle = "Mapas, tirolesas y balancines"


class S01_Mapa(MBScene):
    def construct(self):
        self.mark("El mapa del tesoro")
        self.set_header(R"(x, y)", "El plano", C_COS, P_COS)
        self.say("El plano cartesiano es un mapa. Para llegar al tesoro en tres, dos: salimos del origen, caminamos tres a la derecha y subimos dos.", fox=True)
        plane = get_plane((-5, 5, 1), (-5, 5, 1), 0.68).move_to(1.4 * UP)
        axes = plane[1]
        self.play(ShowCreation(plane), run_time=1.5)
        walker = Dot(axes.c2p(0, 0), radius=0.13).set_fill(C_ANG, 1)
        chest = Square(0.36).set_fill(ORANGE, 1).set_stroke(INK, 2).move_to(axes.c2p(3, 2))
        self.play(FadeIn(chest, scale=0.5), FadeIn(walker))
        path1 = Line(axes.c2p(0, 0), axes.c2p(3, 0)).set_stroke(C_COS, 5)
        path2 = Line(axes.c2p(3, 0), axes.c2p(3, 2)).set_stroke(C_TAN, 5)
        self.play(ShowCreation(path1), walker.animate.move_to(axes.c2p(3, 0)), run_time=1.2)
        self.play(ShowCreation(path2), walker.animate.move_to(axes.c2p(3, 2)), run_time=1)
        lab = M(R"(3, 2)", size=34, color=ORANGE).next_to(chest, UR, buff=0.08)
        self.play(Write(lab))
        self.hold()
        self.say("El primer número siempre es el horizontal y el segundo el vertical. Los ejes parten el mapa en cuatro cuadrantes, cada uno con su combinación de signos.")
        quads = VGroup(*(M(t, size=30, color=c).move_to(axes.c2p(*p)) for t, c, p in [
            (R"\text{I}\;(+,+)", C_TAN, (2.6, 4.2)), (R"\text{II}\;(-,+)", C_COS, (-2.6, 4.2)),
            (R"\text{III}\;(-,-)", C_SEN, (-2.6, -4.2)), (R"\text{IV}\;(+,-)", C_ANG, (2.6, -4.2))]))
        self.play(LaggedStartMap(FadeIn, quads, scale=0.8, lag_ratio=0.25), run_time=1.6)
        self.hold(0.5)
        self.end_section()


class S02_Distancia(MBScene):
    def construct(self):
        self.mark("La distancia")
        self.set_header(R"d", "La tirolesa", C_TAN, P_TAN)
        self.say("Queremos tender una tirolesa entre dos torres: una en menos uno, dos y otra en cinco, diez. ¿Cuánto cable hace falta en línea recta?", fox=True)
        plane = get_plane((-2, 6, 1), (0, 11, 1), 0.55).move_to(1.4 * UP)
        axes = plane[1]
        A = pt(axes, -1, 2, C_COS, "A(-1, 2)", LEFT)
        B = pt(axes, 5, 10, C_SEN, "B(5, 10)", LEFT)
        self.play(ShowCreation(plane), run_time=1.2)
        self.play(FadeIn(A, scale=0.6), FadeIn(B, scale=0.6))
        cable = Line(axes.c2p(-1, 2), axes.c2p(5, 10)).set_stroke(C_TAN, 5)
        self.play(ShowCreation(cable))
        self.hold()
        self.say("El truco: armar un triángulo rectángulo. Avanzamos en horizontal hasta quedar debajo de B, y subimos. El cable es la hipotenusa.")
        legx = DashedLine(axes.c2p(-1, 2), axes.c2p(5, 2), dash_length=0.12).set_stroke(C_COS, 4)
        legy = DashedLine(axes.c2p(5, 2), axes.c2p(5, 10), dash_length=0.12).set_stroke(C_SEN, 4)
        corner = Square(0.22).set_stroke(INK, 2).move_to(axes.c2p(5, 2) + 0.11 * (UL))
        bx = Brace(legx, DOWN, buff=0.1).set_color(C_COS)
        by = Brace(legy, RIGHT, buff=0.1).set_color(C_SEN)
        lx = M(R"\Delta x = 6", size=28, color=C_COS).next_to(bx, DOWN, buff=0.05)
        ly = M(R"\Delta y = 8", size=28, color=C_SEN).next_to(by, RIGHT, buff=0.05)
        self.play(ShowCreation(legx), ShowCreation(legy), FadeIn(corner))
        self.play(GrowFromCenter(bx), GrowFromCenter(by), FadeIn(lx), FadeIn(ly))
        self.mark("Zoom al triángulo")
        calc = M(R"d = \sqrt{6^2 + 8^2} = \sqrt{100} = 10", size=30, color=C_TAN).move_to(axes.c2p(-0.3, 8.5))
        self.zoom_to(VGroup(legx, legy, cable, lx, ly, calc), scale=0.6)
        self.say("Los catetos miden seis y ocho: cinco menos menos uno, y diez menos dos. Pitágoras: seis al cuadrado más ocho al cuadrado es cien, y la raíz de cien es diez.")
        self.play(Write(calc))
        self.hold()
        self.zoom_reset()
        formula = boxed(M(R"d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}", size=40, color=C_TAN), color=C_TAN, fill=PEACH).move_to(3.6 * DOWN)
        self.say("Haciendo lo mismo con dos puntos cualesquiera sale la fórmula de la distancia. El orden en que se restan no importa, porque todo queda al cuadrado.")
        self.play(FadeIn(formula, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_PuntoMedio(MBScene):
    def construct(self):
        self.mark("El punto medio")
        self.set_header(R"M", "El punto medio", C_ANG, P_ANG)
        self.say("A mitad del cable va la plataforma de descanso. Para llegar a la mitad del camino, basta caminar la mitad en horizontal y la mitad en vertical.", fox=True)
        plane = get_plane((-2, 6, 1), (0, 11, 1), 0.55).move_to(1.4 * UP)
        axes = plane[1]
        A = pt(axes, -1, 2, C_COS, "A(-1, 2)", LEFT)
        B = pt(axes, 5, 10, C_SEN, "B(5, 10)", LEFT)
        cable = Line(axes.c2p(-1, 2), axes.c2p(5, 10)).set_stroke(C_TAN, 5)
        self.add(plane, A, B, cable)
        walker = Dot(axes.c2p(-1, 2), radius=0.12).set_fill(C_ANG, 1)
        self.play(FadeIn(walker))
        h1 = Line(axes.c2p(-1, 2), axes.c2p(2, 2)).set_stroke(C_COS, 5)
        v1 = Line(axes.c2p(2, 2), axes.c2p(2, 6)).set_stroke(C_SEN, 5)
        self.play(ShowCreation(h1), walker.animate.move_to(axes.c2p(2, 2)))
        t1 = M(R"\tfrac{6}{2} = 3", size=26, color=C_COS).next_to(h1, DOWN, buff=0.1)
        self.play(FadeIn(t1))
        self.play(ShowCreation(v1), walker.animate.move_to(axes.c2p(2, 6)))
        t2 = M(R"\tfrac{8}{2} = 4", size=26, color=C_SEN).next_to(v1, RIGHT, buff=0.1)
        self.play(FadeIn(t2))
        mlab = M(R"M(2, 6)", size=34, color=C_ANG).next_to(walker, LEFT, buff=0.15)
        self.play(Write(mlab), Flash(walker.get_center(), color=C_ANG))
        self.hold()
        self.say("Hay un atajo: cada coordenada del punto medio es el promedio de las coordenadas. Menos uno más cinco, entre dos, da dos; dos más diez, entre dos, da seis.")
        formula = VGroup(
            M(R"M = \left(\frac{x_1 + x_2}{2},\ \frac{y_1 + y_2}{2}\right)", size=40, color=C_ANG),
            M(R"\left(\frac{-1 + 5}{2},\ \frac{2 + 10}{2}\right) = (2, 6)", size=36),
        ).arrange(DOWN, buff=0.3).move_to(3.4 * DOWN)
        self.play(FadeIn(formula[0], shift=0.2 * UP))
        self.play(FadeIn(formula[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Balancin(MBScene):
    def construct(self):
        self.mark("El balancín")
        self.set_header(R"\frac{2A + B}{3}", "El balancín", C_SEN, P_SEN)
        self.say("Ahora un balancín entre A, uno, uno, y B, siete, cuatro. En A se sienta alguien que pesa el doble que el de B. ¿Dónde va el apoyo para que no se ladee?", fox=True)
        plane = get_plane((0, 8, 1), (0, 6, 1), 0.82).move_to(1.6 * UP)
        axes = plane[1]
        self.play(ShowCreation(plane), run_time=1.2)
        t = ValueTracker(0.5)
        A, B = np.array(axes.c2p(1, 1)), np.array(axes.c2p(7, 4))

        def scene_mobs():
            tv = t.get_value()
            G = A + tv * (B - A)
            torque = 2 * tv - 1 * (1 - tv)
            ang = np.clip(torque * 0.5, -0.3, 0.3)   # A está a la izquierda: si pesa más, baja
            rot = lambda P: G + rotate_vector(P - G, ang)
            a2, b2 = rot(A), rot(B)
            plank = Line(a2, b2).set_stroke(ORANGE, 8)
            wa = Square(0.62).set_fill(C_COS, 1).set_stroke(INK, 2).move_to(a2 + 0.36 * UP)
            wb = Square(0.42).set_fill(C_SEN, 1).set_stroke(INK, 2).move_to(b2 + 0.26 * UP)
            la, lb = M(R"\times 2", size=24, color=BG_COLOR).move_to(wa), M(R"\times 1", size=20, color=BG_COLOR).move_to(wb)
            fulcrum = Triangle().scale(0.22).set_fill(C_TAN if abs(torque) < 0.02 else C_ANG, 1).set_stroke(INK, 2).move_to(G + 0.2 * DOWN)
            return VGroup(plank, wa, wb, la, lb, fulcrum)

        mobs = always_redraw(scene_mobs)
        self.add(mobs)
        self.hold()
        self.say("Si el apoyo va en la mitad, gana el lado pesado y el balancín se va hacia A. Hay que acercar el apoyo al pesado.")
        self.play(t.animate.set_value(0.42), run_time=1.5)
        self.play(t.animate.set_value(1 / 3), run_time=1.5)
        self.say("Se equilibra a un tercio del camino desde A: el pesado queda a la mitad de la distancia que el liviano. Es un promedio con pesos.")
        mobs.clear_updaters()
        G = pt(axes, 3, 2, C_TAN, "G(3, 2)", DR, size=30)
        self.play(FadeIn(G, scale=0.6))
        self.mark("Zoom al punto de equilibrio")
        self.zoom_to(G, scale=0.45)
        self.hold()
        self.zoom_reset()
        formula = VGroup(
            M(R"G = \frac{2A + B}{2 + 1} = \left(\frac{2 \cdot 1 + 7}{3},\ \frac{2 \cdot 1 + 4}{3}\right) = (3, 2)", size=30),
            T("con pesos iguales, G es el punto medio", size=24, color=MUTED),
        ).arrange(DOWN, buff=0.3).move_to(2.6 * DOWN)
        self.say("La fórmula: cada punto multiplicado por su peso, todo dividido entre la suma de los pesos. Con pesos iguales sale otra vez el punto medio.")
        self.play(FadeIn(formula[0], shift=0.2 * UP))
        self.play(FadeIn(formula[1]))
        self.hold(0.5)
        self.end_section()


class S05_Equidistante(MBScene):
    def construct(self):
        self.mark("A la misma distancia")
        self.set_header(R"|PA| = |PB|", "Equidistante", C_COS, P_COS)
        self.say("Último reto: un anillo se desliza por el eje y, amarrado con dos cuerdas a menos tres, cero y a uno, cuatro. ¿Dónde quedan las dos cuerdas del mismo largo?", fox=True)
        plane = get_plane((-4, 3, 1), (-2, 6, 1), 0.78).move_to(1.6 * UP)
        axes = plane[1]
        A = pt(axes, -3, 0, C_COS, "A(-3, 0)", DOWN)
        B = pt(axes, 1, 4, C_SEN, "B(1, 4)", RIGHT)
        rail = Line(axes.c2p(0, -2), axes.c2p(0, 6)).set_stroke(C_R, 7)
        self.play(ShowCreation(plane), run_time=1.2)
        self.play(ShowCreation(rail), FadeIn(A, scale=0.6), FadeIn(B, scale=0.6))
        y = ValueTracker(4.5)

        def ropes():
            P = axes.c2p(0, y.get_value())
            la = np.hypot(3, y.get_value()); lb = np.hypot(1, y.get_value() - 4)
            same = abs(la - lb) < 0.02
            g = VGroup(Line(P, axes.c2p(-3, 0)).set_stroke(C_TAN if same else C_COS, 4),
                       Line(P, axes.c2p(1, 4)).set_stroke(C_TAN if same else C_SEN, 4),
                       Dot(P, radius=0.14).set_fill(C_ANG, 1))
            read = T(f"|PA| = {la:.2f}    |PB| = {lb:.2f}", size=28, color=C_TAN if same else INK).move_to(2.4 * DOWN)
            return VGroup(g, read)

        mob = always_redraw(ropes)
        self.add(mob)
        self.play(y.animate.set_value(-1), run_time=3)
        self.play(y.animate.set_value(1), run_time=1.6)
        self.hold()
        mob.clear_updaters()
        self.say("Se igualan en cero, uno. Para hallarlo sin probar: el punto es cero, y; igualamos los cuadrados de las dos distancias y la y al cuadrado se cancela.")
        steps = VGroup(
            M(R"9 + y^2 = 1 + (y - 4)^2", size=38),
            M(R"9 + y^2 = 1 + y^2 - 8y + 16", size=36),
            M(R"8y = 8 \;\Rightarrow\; y = 1", size=40, color=C_TAN),
        ).arrange(DOWN, buff=0.28).move_to(3.6 * DOWN)
        self.play(FadeOut(mob[1]))
        for s in steps:
            self.play(FadeIn(s, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S06_Cierre(TrigCierre):
    recap = [
        ("El mapa", "(x, y): primero el horizontal, luego el vertical", C_COS),
        ("Distancia", "√((x₂ − x₁)² + (y₂ − y₁)²): Pitágoras", C_TAN),
        ("Punto medio", "el promedio de las coordenadas", C_ANG),
        ("Con pesos", "G = (m₁A + m₂B)/(m₁ + m₂): divide el segmento", C_SEN),
    ]
    recap_say = ("Repasemos: cada punto es un par ordenado; la distancia sale de Pitágoras; el punto medio es el promedio; "
                 "y con pesos distintos, el promedio ponderado divide el segmento en la razón de los pesos.")
    practice = "Ahora: tiende la tirolesa,\nequilibra el balancín\ny empata las cuerdas"
