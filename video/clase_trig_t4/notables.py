"""
Clase T4 · Ángulos notables (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. 45° sale de cortar un cuadrado por la diagonal; 30°
y 60° de partir un triángulo equilátero (zoom al corte); el patrón √n/2 de la tabla y una rampa de
30° de 8 m. Manual de la UdeA §13.2 (ejercicios 13.1 y 13.2).

    manimgl notables.py S02_Equilatero -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T4"
    title = "Ángulos notables"
    subtitle = "30°, 45° y 60° sin calculadora"


class S01_Cuadrado(MBScene):
    def construct(self):
        self.mark("Cortar un cuadrado")
        self.set_header(R"45^\circ", "El cuadrado partido", C_COS, P_COS)
        s = 3.2
        o = 1.6 * LEFT + 0.6 * DOWN
        sq = Square(s).move_to(o + s / 2 * (RIGHT + UP)).set_stroke(INK, 3).set_fill(C_COS, 0.08)
        ones = VGroup(M("1", size=44, color=C_COS).next_to(sq, DOWN, buff=0.15), M("1", size=44, color=C_SEN).next_to(sq, RIGHT, buff=0.15))
        self.say("Toma un cuadrado de lado 1 y córtalo por la diagonal. Quedan dos triángulos rectángulos con "
                 "dos ángulos iguales: 45 grados cada uno.", fox=True)
        self.play(ShowCreation(sq), FadeIn(ones))
        diag = Line(o, o + s * (RIGHT + UP)).set_stroke(C_ANG, 6)
        self.play(ShowCreation(diag))
        half = Polygon(o, o + s * RIGHT, o + s * (RIGHT + UP)).set_fill(C_COS, 0.3).set_stroke(width=0)
        a45 = get_angle_arc(PI / 4, 0.7, o)
        l45 = M(R"45^\circ", size=34, color=C_ANG).move_to(o + 1.05 * RIGHT + 0.35 * UP)
        self.play(FadeIn(half), ShowCreation(a45), FadeIn(l45))
        self.hold()
        self.say("¿Cuánto mide la diagonal? Pitágoras: uno más uno es dos, así que mide raíz de dos. Acerquémonos.")
        h = M(R"\sqrt{1^2 + 1^2} = \sqrt{2}", size=40, color=C_ANG).move_to(o + s / 2 * (RIGHT + UP) + 0.55 * (LEFT + UP)).rotate(PI / 4)
        self.zoom_to(o + s / 2 * (RIGHT + UP), scale=0.45, run_time=1.8)
        self.play(Write(h))
        self.hold()
        self.zoom_reset()
        vals = VGroup(
            M(SEN + R" 45^\circ = \frac{1}{\sqrt2} = \frac{\sqrt2}{2}", size=42, color=C_SEN),
            M(R"\cos 45^\circ = \frac{\sqrt2}{2}", size=42, color=C_COS),
            M(R"\tan 45^\circ = \frac{1}{1} = 1", size=42, color=C_TAN),
        ).arrange(DOWN, buff=0.3).move_to(4.1 * DOWN)
        self.say("Con los lados 1, 1 y raíz de dos: seno y coseno de 45 valen uno sobre raíz de dos, que es raíz de dos "
                 "sobre dos, y la tangente vale 1 porque los catetos son iguales.")
        self.play(LaggedStartMap(FadeIn, vals, lag_ratio=0.35, shift=0.2 * UP), run_time=2)
        self.hold(0.5)
        self.end_section()


class S02_Equilatero(MBScene):
    def construct(self):
        self.mark("Partir un equilátero")
        self.set_header(R"30^\circ\ 60^\circ", "El equilátero partido", C_SEN, P_SEN)
        s = 3.6
        base_l = 1.8 * LEFT + 0.2 * DOWN
        A, B = base_l, base_l + s * RIGHT
        top = base_l + s / 2 * RIGHT + s * np.sqrt(3) / 2 * UP
        tri = Polygon(A, B, top).set_stroke(INK, 3).set_fill(C_SEN, 0.06)
        twos = VGroup(
            M("2", size=40).next_to(Line(A, B), DOWN, buff=0.15),
            M("2", size=40).move_to((A + top) / 2 + 0.35 * LEFT),
            M("2", size=40).move_to((B + top) / 2 + 0.35 * RIGHT),
        )
        self.say("Ahora un triángulo equilátero de lado 2. Sus tres ángulos miden 60 grados.", fox=True)
        self.play(ShowCreation(tri), FadeIn(twos))
        self.hold()
        mid = (A + B) / 2
        cut = DashedLine(top, mid).set_stroke(C_ANG, 4)
        self.say("Lo partimos por la mitad con su altura. La base se parte en 1 y 1, y arriba el ángulo de 60 se parte en dos de 30.")
        self.play(ShowCreation(cut))
        self.zoom_to(top + 0.9 * DOWN, scale=0.42, run_time=1.8)
        a30 = Arc(-PI / 2 - PI / 6, PI / 6, radius=0.75, arc_center=top).set_stroke(C_ANG, 5)
        l30 = M(R"30^\circ", size=26, color=C_ANG).move_to(top + 1.05 * DOWN + 0.25 * LEFT)
        self.play(ShowCreation(a30), FadeIn(l30))
        self.hold()
        self.zoom_reset()
        right = Polygon(A, mid, top).set_fill(C_SEN, 0.3).set_stroke(width=0)
        one = M("1", size=40, color=C_COS).next_to(Line(A, mid), DOWN, buff=0.15)
        a60 = get_angle_arc(PI / 3, 0.65, A)
        l60 = M(R"60^\circ", size=30, color=C_ANG).move_to(A + 0.95 * RIGHT + 0.4 * UP)
        self.play(FadeIn(right), FadeOut(twos[0]), FadeIn(one), ShowCreation(a60), FadeIn(l60))
        hgt = M(R"h = \sqrt{2^2 - 1^2} = \sqrt3", size=36, color=C_ANG).move_to(mid + 1.0 * DOWN + 0.9 * RIGHT)
        self.say("La altura sale con Pitágoras: dos al cuadrado menos uno al cuadrado es tres, así que mide raíz de tres.")
        self.play(Write(hgt))
        self.hold()
        vals = VGroup(
            M(SEN + R" 30^\circ = \tfrac12 \qquad \cos 30^\circ = \tfrac{\sqrt3}{2}", size=38),
            M(SEN + R" 60^\circ = \tfrac{\sqrt3}{2} \qquad \cos 60^\circ = \tfrac12", size=38),
            M(R"\tan 30^\circ = \tfrac{1}{\sqrt3} = \tfrac{\sqrt3}{3} \qquad \tan 60^\circ = \sqrt3", size=36),
        ).arrange(DOWN, buff=0.3).move_to(4.2 * DOWN)
        self.say("Del triángulo de lados 1, raíz de 3 y 2 salen los valores de 30 y de 60. Fíjate: el seno de 30 "
                 "es el coseno de 60, porque el opuesto de uno es el adyacente del otro.")
        self.play(LaggedStartMap(FadeIn, vals, lag_ratio=0.35, shift=0.2 * UP), run_time=2.2)
        self.hold(0.5)
        self.end_section()


class S03_Patron(MBScene):
    def construct(self):
        self.mark("El patrón de la tabla")
        self.set_header(R"\tfrac{\sqrt{n}}{2}", "Un truco para la tabla", C_ANG, P_ANG)
        angles = [0, 30, 45, 60, 90]
        head = VGroup(*(M(f"{a}^\\circ", size=40, color=C_ANG) for a in angles)).arrange(RIGHT, buff=0.55).move_to(3.6 * UP + 0.6 * RIGHT)
        lab_s = M(SEN, size=40, color=C_SEN).next_to(head, LEFT, buff=0.5).shift(1.4 * DOWN)
        lab_c = M(R"\cos", size=40, color=C_COS).next_to(head, LEFT, buff=0.5).shift(3.0 * DOWN)
        self.say("Hay un truco para no olvidar la tabla. Escribe los ángulos de 0 a 90.", fox=True)
        self.play(LaggedStartMap(FadeIn, head, lag_ratio=0.2), run_time=1.5)
        sq = VGroup(*(M(f"\\frac{{\\sqrt{{{k}}}}}{{2}}", size=40, color=C_SEN).next_to(h, DOWN, buff=1.0) for k, h in zip(range(5), head)))
        self.say("Para el seno, pon raíz de cero, de uno, de dos, de tres y de cuatro, todo sobre dos.")
        self.play(FadeIn(lab_s))
        self.play(LaggedStartMap(FadeIn, sq, lag_ratio=0.3, shift=0.2 * DOWN), run_time=2)
        self.hold()
        simp = VGroup(*(M(t, size=40, color=C_SEN).move_to(m) for t, m in zip(
            ["0", R"\tfrac12", R"\tfrac{\sqrt2}{2}", R"\tfrac{\sqrt3}{2}", "1"], sq)))
        self.say("Y se simplifican solas: raíz de cero es cero, raíz de uno es uno, y raíz de cuatro sobre dos es uno.")
        self.play(*(FadeTransform(a, b) for a, b in zip(sq, simp)), run_time=1.5)
        self.hold()
        cos = VGroup(*(M(t, size=40, color=C_COS).next_to(m, DOWN, buff=0.9) for t, m in zip(
            ["1", R"\tfrac{\sqrt3}{2}", R"\tfrac{\sqrt2}{2}", R"\tfrac12", "0"], simp)))
        self.say("El coseno es la misma fila al revés: lo que el seno sube, el coseno lo baja.")
        self.play(FadeIn(lab_c))
        self.play(LaggedStart(*(TransformFromCopy(simp[4 - k], cos[k]) for k in range(5)), lag_ratio=0.2), run_time=2)
        arrow_s = Arrow(simp[0].get_bottom() + 0.1 * DOWN, simp[4].get_bottom() + 0.1 * DOWN, buff=0.1, thickness=3).set_color(C_SEN).shift(0.35 * DOWN)
        self.hold(0.5)
        self.end_section()


class S04_Rampa(MBScene):
    def construct(self):
        self.mark("Una rampa de 30 grados")
        self.set_header(R"30^\circ", "Para qué sirven", C_TAN, P_TAN)
        k = 0.62
        A = 3.0 * LEFT + 0.6 * DOWN
        B = A + 8 * k * np.cos(PI / 6) * RIGHT
        Cc = B + 8 * k * np.sin(PI / 6) * UP
        ground = Line(A + 0.5 * LEFT, B + 0.8 * RIGHT).set_stroke(MUTED, 3)
        ramp = Polygon(A, B, Cc).set_fill(C_TAN, 0.15).set_stroke(INK, 3)
        self.say("Una rampa para sillas de ruedas mide 8 metros de largo y sube con 30 grados de inclinación. "
                 "¿Qué tan alto llega?", fox=True)
        self.play(ShowCreation(ground), ShowCreation(ramp))
        a = get_angle_arc(PI / 6, 0.9, A)
        l = M(R"30^\circ", size=32, color=C_ANG).move_to(A + 1.25 * RIGHT + 0.3 * UP)
        eight = M(R"8 \text{ m}", size=36, color=C_ANG).move_to((A + Cc) / 2 + 0.4 * UP + 0.2 * LEFT)
        h = M("h", size=40, color=C_SEN).next_to(Line(B, Cc), RIGHT, buff=0.15)
        d = M("d", size=40, color=C_COS).next_to(Line(A, B), DOWN, buff=0.15)
        self.play(ShowCreation(a), FadeIn(l), FadeIn(eight), FadeIn(h), FadeIn(d))
        self.hold()
        eqs = VGroup(
            M(R"h = 8 \cdot " + SEN + R" 30^\circ = 8 \cdot \tfrac12 = 4 \text{ m}", size=40, color=C_SEN),
            M(R"d = 8 \cdot \cos 30^\circ = 8 \cdot \tfrac{\sqrt3}{2} = 4\sqrt3 \approx 6.93 \text{ m}", size=36, color=C_COS),
        ).arrange(DOWN, buff=0.35).move_to(3.2 * DOWN)
        self.say("La altura es el opuesto: 8 por seno de 30, la mitad, 4 metros. Y lo que avanza en el piso es el "
                 "adyacente: 8 por coseno de 30, unos 6.93 metros. Sin calculadora.")
        self.play(Write(eqs[0]))
        self.play(Write(eqs[1]))
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("45°", "del cuadrado: lados 1, 1, √2 · sen = cos = √2/2", C_COS),
        ("30° y 60°", "del equilátero partido: lados 1, √3, 2", C_SEN),
        ("El truco", "sen: √0/2, √1/2, √2/2, √3/2, √4/2 · cos al revés", C_ANG),
    ]
    recap_say = ("Repasemos: el cuadrado da 45 grados con raíz de dos; el equilátero partido da 30 y 60 con raíz de tres; "
                 "y la tabla sale con el truco de raíz de n sobre dos.")
    practice = "Ahora, los juegos:\natrapa los puntos notables\ny une cada ángulo con su valor"
