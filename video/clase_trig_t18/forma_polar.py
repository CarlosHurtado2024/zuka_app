"""
Clase T18 · Forma trigonométrica de un complejo (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. El mapa del pirata: √3 + i es «2 pasos a 30°»; módulo
con Pitágoras y argumento con el ángulo de referencia (zoom); −2 − 2√3 i y el gemelo de la misma tangente
(zoom); los ejes; cis θ; y de vuelta: 4 cis 150° = −2√3 + 2i. Manual de la UdeA §15.1.

    manimgl forma_polar.py S01_Mapa -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def make_plane(center, unit=0.8, n=4):
    """Plano complejo con cuadrícula de −n a n, `unit` unidades de pantalla por unidad."""
    c = np.array(center)
    grid = VGroup()
    for k in range(-n, n + 1):
        grid.add(Line(c + unit * np.array([k, -n, 0]), c + unit * np.array([k, n, 0])).set_stroke(BORDER, 1))
        grid.add(Line(c + unit * np.array([-n, k, 0]), c + unit * np.array([n, k, 0])).set_stroke(BORDER, 1))
    axes = VGroup(Line(c + unit * n * LEFT, c + unit * n * RIGHT).set_stroke(MUTED, 3),
                  Line(c + unit * n * DOWN, c + unit * n * UP).set_stroke(MUTED, 3))
    labels = VGroup(T("Re", size=24, color=MUTED).next_to(axes[0], RIGHT, buff=0.08).shift(0.25 * UP + 0.4 * LEFT),
                    T("Im", size=24, color=MUTED).next_to(axes[1], UP, buff=0.08).shift(0.35 * RIGHT + 0.35 * DOWN))
    to = lambda a, b: c + unit * np.array([a, b, 0])
    return VGroup(grid, axes, labels), to


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T18"
    title = "Forma trigonométrica\nde un complejo"
    subtitle = "Rumbo y pasos en el plano"


class S01_Mapa(MBScene):
    def construct(self):
        self.mark("El mapa del pirata")
        self.set_header(R"a + bi", "El mapa del tesoro", C_ANG, P_ANG)
        plane, to = make_plane(2.0 * UP, unit=0.85, n=3)
        a, b = np.sqrt(3), 1
        X = VGroup(Line(to(a, b) + 0.18 * UL, to(a, b) + 0.18 * DR), Line(to(a, b) + 0.18 * DL, to(a, b) + 0.18 * UR)).set_stroke(C_I, 6)
        lab = M(R"z = \sqrt3 + i", size=40, color=C_I).next_to(to(a, b), UR, buff=0.15)
        self.say("Un número complejo es un punto del plano: la parte real hacia la derecha y la imaginaria hacia arriba. Aquí está el "
                 "tesoro: raíz de tres más i.", fox=True)
        self.play(ShowCreation(plane), run_time=1.5)
        self.play(ShowCreation(X), FadeIn(lab))
        walk1 = VGroup(Line(to(0, 0), to(a, 0)).set_stroke(C_COS, 6), Line(to(a, 0), to(a, b)).set_stroke(C_SEN, 6))
        self.say("Un mapa normal diría: camina raíz de tres hacia la derecha y luego uno hacia arriba. Esa es la forma rectangular.")
        self.play(ShowCreation(walk1[0]))
        self.play(ShowCreation(walk1[1]))
        self.hold()
        self.mark("Rumbo y pasos")
        ray = Line(to(0, 0), to(a, b)).set_stroke(C_ANG, 7)
        arc = get_angle_arc(PI / 6, 0.75, to(0, 0))
        th = M(R"\theta", size=36, color=C_ANG).move_to(to(0, 0) + 1.05 * np.array([np.cos(PI / 12), np.sin(PI / 12), 0]))
        self.say("Pero un pirata prefiere otra instrucción: mira en una dirección y camina en línea recta. Eso es la forma polar: un rumbo y una cantidad de pasos.")
        self.play(ShowCreation(ray), ShowCreation(arc), FadeIn(th))
        self.hold()
        s = VGroup(
            M(R"r = \sqrt{a^2 + b^2} = \sqrt{3 + 1} = 2", size=42, color=C_ANG),
            M(R"\tan\theta = \frac{b}{a} = \frac{1}{\sqrt3} \;\Rightarrow\; \theta = 30^\circ", size=42, color=C_ANG),
        ).arrange(DOWN, buff=0.4).move_to(1.6 * DOWN)
        self.say("Los pasos son el módulo, la distancia al origen: por Pitágoras, dos.")
        self.play(Write(s[0]))
        self.mark("Zoom al ángulo")
        self.zoom_to(VGroup(arc, walk1, th), scale=0.45)
        self.say("El rumbo es el argumento. Tangente de theta es uno sobre raíz de tres: treinta grados, el notable de siempre.")
        self.hold()
        self.zoom_reset()
        self.play(Write(s[1]))
        res = get_pill("2 pasos a 30°", C_ANG, PEACH, size=32).move_to(3.8 * DOWN)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.hold()
        f = VGroup(M(R"a = r\cos\theta", size=40, color=C_COS), M(R"b = r\," + SEN + R"\theta", size=40, color=C_SEN)).arrange(RIGHT, buff=0.8).move_to(res.get_center() + 0.0 * UP)
        self.say("Y al revés: la parte real es r por coseno de theta y la imaginaria, r por seno. Es la circunferencia de siempre, pero de radio r.")
        self.play(FadeOut(res), FadeIn(f))
        self.hold(0.5)
        self.end_section()


class S02_Cuadrantes(MBScene):
    def construct(self):
        self.mark("El gemelo tramposo")
        self.set_header(R"-2 - 2\sqrt3\,i", "Cuidado con el cuadrante", C_I, P_I)
        plane, to = make_plane(1.8 * UP, unit=0.65, n=4)
        a, b = -2, -2 * np.sqrt(3)
        P = Dot(to(a, b), radius=0.13).set_color(C_I)
        lab = M(R"-2 - 2\sqrt3\,i", size=34, color=C_I).next_to(P, DOWN, buff=0.15)
        self.say("Ahora el tesoro está en menos dos menos dos raíz de tres i, abajo a la izquierda.", fox=True)
        self.play(ShowCreation(plane), run_time=1.2)
        self.play(GrowFromCenter(P), FadeIn(lab))
        r = M(R"r = \sqrt{4 + 12} = 4", size=42, color=C_ANG).move_to(2.2 * DOWN)
        self.play(Write(r))
        twin = Dot(to(-a, -b), radius=0.13).set_color(MUTED)
        line = DashedLine(to(-a, -b), to(a, b)).set_stroke(MUTED, 2)
        tan = M(R"\tan\theta = \frac{-2\sqrt3}{-2} = \sqrt3", size=40).next_to(r, DOWN, buff=0.4)
        self.say("La tangente da raíz de tres, y la calculadora responde sesenta grados. Pero sesenta grados apunta arriba a la derecha: "
                 "es el gemelo opuesto, con la misma tangente.")
        self.play(Write(tan))
        self.play(GrowFromCenter(twin), ShowCreation(line))
        cross = ex_mark(size=48).next_to(twin, UR, buff=0.05)
        self.play(FadeIn(cross))
        self.hold()
        self.mark("Zoom a la referencia")
        ref = Arc(start_angle=PI, angle=PI / 3, radius=0.9, arc_center=to(0, 0)).set_stroke(C_ANG, 6)
        big = Arc(start_angle=0, angle=4 * PI / 3, radius=0.55, arc_center=to(0, 0)).set_stroke(C_COS, 4)
        ray = Line(to(0, 0), to(a, b)).set_stroke(C_I, 5)
        self.play(ShowCreation(ray), FadeOut(VGroup(r, tan)))
        self.zoom_to(VGroup(ref, ray, Dot(to(0, 0))), scale=0.45)
        self.say("El punto vive en el tercer cuadrante. Desde el eje real negativo hay sesenta grados de referencia; sumados a media vuelta dan doscientos cuarenta.")
        self.play(ShowCreation(ref))
        self.play(ShowCreation(big), run_time=1.5)
        self.hold()
        self.zoom_reset()
        self.play(FadeIn(VGroup(r, tan)))
        ans = M(R"\theta = 180^\circ + 60^\circ = 240^\circ", size=44, color=C_COS).next_to(tan, DOWN, buff=0.4)
        self.play(Write(ans))
        self.hold()
        self.mark("Los ejes")
        self.clear_scene()
        self.set_header(R"0^\circ,\,90^\circ,\,180^\circ,\,270^\circ", "Los fáciles", C_COS, P_COS)
        plane2, to2 = make_plane(1.3 * UP, unit=0.55, n=6)
        pts = VGroup(Dot(to2(-5, 0), radius=0.13).set_color(C_ANG), Dot(to2(0, 6), radius=0.13).set_color(C_SEN))
        labs = VGroup(M(R"-5", size=34, color=C_ANG).next_to(pts[0], DOWN, buff=0.15), M(R"6i", size=34, color=C_SEN).next_to(pts[1], LEFT, buff=0.15))
        pts.set_z_index(2)
        self.say("Los que están sobre un eje no necesitan tangente: se ve el rumbo a simple vista.", fox=True)
        self.play(ShowCreation(plane2))
        self.play(LaggedStartMap(GrowFromCenter, pts, lag_ratio=0.4), FadeIn(labs))
        res = VGroup(M(R"-5:\; r = 5,\; \theta = 180^\circ", size=40, color=C_ANG), M(R"6i:\; r = 6,\; \theta = 90^\circ", size=40, color=C_SEN)).arrange(DOWN, buff=0.35).move_to(3.0 * DOWN)
        self.say("Menos cinco está a media vuelta: ciento ochenta grados. Seis i está a un cuarto de vuelta: noventa grados.")
        self.play(Write(res[0]))
        self.play(Write(res[1]))
        self.hold(0.5)
        self.end_section()


class S03_Cis(MBScene):
    def construct(self):
        self.mark("La forma trigonométrica")
        self.set_header(R"\mathrm{cis}\,\theta", "Una forma corta", C_ANG, P_ANG)
        s = VGroup(
            M(R"z = a + bi", size=50),
            M(R"= r\cos\theta + i\, r\," + SEN + R"\theta", size=50),
            M(R"= r\,(\cos\theta + i\," + SEN + R"\theta)", size=56, color=C_ANG),
        ).arrange(DOWN, buff=0.5, aligned_edge=LEFT).move_to(3.0 * UP)
        self.say("Si reemplazamos a y b por r coseno y r seno, sale la forma trigonométrica: r por, coseno de theta más i seno de theta.", fox=True)
        for m in s:
            self.play(Write(m), run_time=1.3)
        self.hold()
        cis = M(R"\cos\theta + i\," + SEN + R"\theta = \mathrm{cis}\,\theta", size=46, color=C_COS).next_to(s, DOWN, buff=0.7)
        card = get_card(cis, color=C_COS, fill=PEACH)
        self.say("Como se escribe tanto, se abrevia: c, i, s. Coseno, i, seno. Cis theta.")
        self.play(FadeIn(card), Write(cis))
        self.hold()
        ex = VGroup(
            M(R"\sqrt3 + i = 2\,\mathrm{cis}\,30^\circ", size=46, color=C_ANG),
            M(R"-2 - 2\sqrt3\,i = 4\,\mathrm{cis}\,240^\circ", size=46, color=C_I),
            M(R"-5 = 5\,\mathrm{cis}\,180^\circ", size=46, color=C_COS),
        ).arrange(DOWN, buff=0.35).move_to(2.6 * DOWN)
        self.say("Así quedan los tesoros de hoy: raíz de tres más i es dos cis treinta; el del tercer cuadrante, cuatro cis doscientos cuarenta; y menos cinco es cinco cis ciento ochenta.")
        self.play(LaggedStartMap(FadeIn, ex, shift=0.2 * UP, lag_ratio=0.35), run_time=2.2)
        self.hold(0.5)
        self.end_section()


class S04_DeVuelta(MBScene):
    def construct(self):
        self.mark("De polar a rectangular")
        self.set_header(R"4\,\mathrm{cis}\,150^\circ", "De vuelta al mapa", C_COS, P_COS)
        plane, to = make_plane(2.2 * UP, unit=0.62, n=4)
        ang = 150 * DEGREES
        tip = to(4 * np.cos(ang), 4 * np.sin(ang))
        self.say("Ahora al revés: el pirata dice cuatro pasos a ciento cincuenta grados. ¿Dónde queda en el mapa normal?", fox=True)
        self.play(ShowCreation(plane))
        ray = Line(to(0, 0), tip).set_stroke(C_ANG, 6)
        arc = get_angle_arc(ang, 0.6, to(0, 0))
        self.play(ShowCreation(arc), ShowCreation(ray), run_time=1.5)
        drop = DashedLine(tip, to(4 * np.cos(ang), 0)).set_stroke(C_SEN, 4)
        run = Line(to(0, 0), to(4 * np.cos(ang), 0)).set_stroke(C_COS, 6)
        self.play(ShowCreation(run), ShowCreation(drop))
        self.zoom_to(VGroup(run, drop, ray), scale=0.5)
        self.hold(1.0)
        self.zoom_reset()
        s = VGroup(
            M(R"a = 4\cos150^\circ = 4\left(-\tfrac{\sqrt3}{2}\right) = -2\sqrt3", size=40, color=C_COS),
            M(R"b = 4\," + SEN + R"150^\circ = 4\cdot\tfrac12 = 2", size=40, color=C_SEN),
            M(R"4\,\mathrm{cis}\,150^\circ = -2\sqrt3 + 2i", size=50, color=C_ANG),
        ).arrange(DOWN, buff=0.45).move_to(2.1 * DOWN)
        self.say("La sombra horizontal es cuatro coseno de ciento cincuenta: menos dos raíz de tres, unos menos tres coma cuarenta y seis.")
        self.play(Write(s[0]))
        self.say("La altura es cuatro seno de ciento cincuenta: exactamente dos.")
        self.play(Write(s[1]))
        self.hold()
        self.say("El tesoro está en menos dos raíz de tres más dos i. Dos idiomas, el mismo punto.")
        self.play(Write(s[2]))
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Módulo", "r = √(a² + b²): los pasos", C_ANG),
        ("Argumento", "θ con la tangente… y mirando el cuadrante", C_I),
        ("Forma polar", "z = r(cos θ + i sen θ) = r cis θ", C_COS),
        ("De vuelta", "a = r cos θ,  b = r sen θ", C_SEN),
    ]
    recap_say = ("Repasemos: el módulo es la distancia, el argumento es el rumbo y se decide con el cuadrante; z es r cis theta; y "
                 "para volver, a es r coseno y b es r seno.")
    practice = "Ahora, el juego:\nprograma la caminata\ndel pirata"
