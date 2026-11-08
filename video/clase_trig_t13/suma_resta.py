"""
Clase T13 · Suma y resta de ángulos (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. sen(30° + 60°) no es sen 30° + sen 60° (las barras lo
muestran); dos giros encadenados en la circunferencia y la fórmula; sen 105° = sen(60° + 45°) con zoom a
la cuenta; cos 15° con la resta y tan 75° con la fórmula de la tangente. Manual de la UdeA §13.8.

    manimgl suma_resta.py S03_Sen105 -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T13"
    title = "Suma y resta\nde ángulos"
    subtitle = "Ángulos raros con valores exactos"


class S01_NoSeReparte(MBScene):
    def construct(self):
        self.mark("La tentación")
        self.set_header(R"\ne", "No se reparte", C_I, P_I)
        q = M(SEN + R"(30^\circ + 60^\circ) \;\overset{?}{=}\; " + SEN + R"30^\circ + " + SEN + R"60^\circ", size=44).move_to(4.2 * UP)
        self.say("Primera tentación de todo estudiante: repartir el seno sobre la suma, como si fuera una multiplicación.", fox=True)
        self.play(Write(q))
        base_y = -2.6
        def bar(x, h, col, label):
            r = Rectangle(1.3, h * 3.2).set_fill(col, 0.85).set_stroke(width=0)
            r.move_to([x, base_y + h * 1.6, 0])
            lab = M(label, size=30, color=col).next_to(r, DOWN, buff=0.2)
            return VGroup(r, lab)
        left = bar(-1.8, 1.0, C_Q, SEN + R"90^\circ = 1")
        b1 = bar(1.6, 0.5, C_SEN, R"0.5")
        b2 = bar(1.6, np.sqrt(3) / 2, C_COS, R"0.87")
        b2.shift((b1[0].get_top()[1] - b2[0].get_bottom()[1]) * UP)
        b2[1].next_to(b2[0], RIGHT, buff=0.15)
        b1[1].next_to(b1[0], RIGHT, buff=0.15)
        sumlab = M(R"1.37", size=36, color=C_I).next_to(b2[0], UP, buff=0.2)
        ground = Line(3.6 * LEFT, 3.6 * RIGHT).move_to([0, base_y, 0]).set_stroke(MUTED, 2)
        self.play(ShowCreation(ground))
        self.say("A la izquierda, seno de noventa grados: uno. A la derecha, apilamos seno de treinta y seno de sesenta.")
        self.play(GrowFromEdge(left[0], DOWN), FadeIn(left[1]))
        self.play(GrowFromEdge(b1[0], DOWN), FadeIn(b1[1]))
        self.play(GrowFromEdge(b2[0], DOWN), FadeIn(b2[1]))
        self.play(FadeIn(sumlab))
        roof = DashedLine([-3.6, base_y + 3.2, 0], [3.6, base_y + 3.2, 0]).set_stroke(C_ANG, 2)
        roof_lab = T("el seno nunca pasa de 1", size=26, color=C_ANG).next_to(roof, UP, buff=0.1).align_to(roof, LEFT)
        self.say("La torre de la derecha mide uno coma treinta y siete y atraviesa el techo: ningún seno pasa de uno. Repartir está mal.")
        self.play(ShowCreation(roof), FadeIn(roof_lab))
        self.play(Indicate(sumlab, color=C_I, scale_factor=1.4))
        self.hold(0.5)
        self.end_section()


class S02_Formula(MBScene):
    def construct(self):
        self.mark("Dos giros encadenados")
        self.set_header(R"\alpha + \beta", "Girar dos veces", C_ANG, P_ANG)
        R_, c = 2.7, 2.0 * UP
        axes = get_trig_axes(R_, c)
        a, b = 35 * DEGREES, 40 * DEGREES
        self.say("Un ángulo suma es girar dos veces: primero alfa, luego beta desde ahí.", fox=True)
        self.play(ShowCreation(axes))
        r1 = Line(c, point_on(a, R_, c)).set_stroke(C_ANG, 6)
        arc1 = get_angle_arc(a, 0.7, c)
        la = M(R"\alpha", size=36, color=C_ANG).move_to(c + 1.0 * np.array([np.cos(a / 2), np.sin(a / 2), 0]))
        self.play(ShowCreation(r1), ShowCreation(arc1), FadeIn(la))
        r2 = Line(c, point_on(a + b, R_, c)).set_stroke(C_SEN, 6)
        arc2 = Arc(start_angle=a, angle=b, radius=1.25, arc_center=c).set_stroke(C_SEN, 5)
        lb = M(R"\beta", size=36, color=C_SEN).move_to(c + 1.55 * np.array([np.cos(a + b / 2), np.sin(a + b / 2), 0]))
        self.play(TransformFromCopy(r1, r2), ShowCreation(arc2), FadeIn(lb), run_time=1.5)
        P = point_on(a + b, R_, c)
        h = Line([P[0], c[1], 0], P).set_stroke(C_SEN, 4)
        hl = M(SEN(R"") if False else SEN + R"(\alpha + \beta)", size=28, color=C_SEN).next_to(h, RIGHT, buff=0.12)
        self.say("La altura del punto final es el seno de alfa más beta. Se puede calcular con los senos y cosenos de cada giro por separado.")
        self.play(ShowCreation(h), FadeIn(hl))
        self.hold()
        self.mark("Las fórmulas")
        f = VGroup(
            M(SEN + R"(\alpha \pm \beta) = " + SEN + R"\alpha\cos\beta \pm \cos\alpha\," + SEN + R"\beta", size=40, color=C_SEN),
            M(R"\cos(\alpha \pm \beta) = \cos\alpha\cos\beta \mp " + SEN + R"\alpha\," + SEN + R"\beta", size=40, color=C_COS),
        ).arrange(DOWN, buff=0.45).move_to(2.3 * DOWN)
        self.say("Este es el resultado. El seno mezcla: seno por coseno más coseno por seno, y conserva el signo.")
        self.play(Write(f[0]), run_time=2)
        self.hold()
        self.say("El coseno junta iguales, coseno con coseno y seno con seno, y le da la vuelta al signo: la suma lleva un menos.")
        self.play(Write(f[1]), run_time=2)
        self.hold(0.5)
        self.end_section()


class S03_Sen105(MBScene):
    def construct(self):
        self.mark("Seno de 105°")
        self.set_header(R"105^\circ", "Un ángulo raro", C_SEN, P_SEN)
        s = VGroup(
            M(R"105^\circ = 60^\circ + 45^\circ", size=50, color=C_ANG),
            M(SEN + R"105^\circ = " + SEN + R"60^\circ\cos45^\circ + \cos60^\circ\," + SEN + R"45^\circ", size=38),
            M(R"= \frac{\sqrt3}{2}\cdot\frac{\sqrt2}{2} + \frac12\cdot\frac{\sqrt2}{2}", size=46),
            M(R"= \frac{\sqrt6}{4} + \frac{\sqrt2}{4}", size=46),
            M(R"= \frac{\sqrt6 + \sqrt2}{4} \approx 0.966", size=52, color=C_SEN),
        ).arrange(DOWN, buff=0.5).move_to(0.9 * UP)
        self.say("Ciento cinco grados no es notable, pero sí es sesenta más cuarenta y cinco, y esos dos sí lo son.", fox=True)
        self.play(Write(s[0]))
        self.hold()
        self.say("Aplicamos la fórmula del seno de una suma.")
        self.play(Write(s[1]), run_time=2)
        self.say("Cambiamos cada razón por su valor conocido.")
        self.play(Write(s[2]), run_time=2)
        self.mark("Zoom a la cuenta")
        self.zoom_to(s[2], scale=0.4)
        mult = VGroup(
            M(R"\sqrt3\cdot\sqrt2 = \sqrt6", size=26, color=C_ANG),
            M(R"2 \cdot 2 = 4", size=26, color=C_ANG),
        ).arrange(RIGHT, buff=0.6).next_to(s[2], DOWN, buff=0.15)
        self.say("Multiplicamos arriba con arriba y abajo con abajo: raíz de tres por raíz de dos es raíz de seis, y dos por dos, cuatro.")
        self.play(FadeIn(mult))
        self.hold()
        self.play(FadeOut(mult))
        self.zoom_reset()
        self.play(Write(s[3]))
        self.say("Mismo denominador: se suman. Y el resultado tiene sentido: casi uno, porque ciento cinco grados está cerca de noventa.")
        self.play(Write(s[4]))
        self.play(ShowCreation(SurroundingRectangle(s[4], buff=0.15).set_stroke(C_SEN, 3)))
        self.hold(0.5)
        self.end_section()


class S04_Cos15Tan(MBScene):
    def construct(self):
        self.mark("Coseno de 15° con una resta")
        self.set_header(R"15^\circ", "Restar también vale", C_COS, P_COS)
        s = VGroup(
            M(R"\cos15^\circ = \cos(45^\circ - 30^\circ)", size=44, color=C_ANG),
            M(R"= \cos45^\circ\cos30^\circ + " + SEN + R"45^\circ\," + SEN + R"30^\circ", size=40),
            M(R"= \frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2} + \frac{\sqrt2}{2}\cdot\frac12 = \frac{\sqrt6 + \sqrt2}{4}", size=40, color=C_COS),
        ).arrange(DOWN, buff=0.45).move_to(3.4 * UP)
        self.say("Quince grados es cuarenta y cinco menos treinta. En la resta, el coseno cambia el signo: aparece un más.", fox=True)
        for m in s:
            self.play(Write(m), run_time=1.6)
        self.hold()
        twin = T("¡igual a sen 105°! Ángulos que suman 90° + algo… se parecen", size=24, color=MUTED)
        twin = M(R"\cos15^\circ = " + SEN + R"105^\circ \;\;(" + SEN + R"(90^\circ + \theta) = \cos\theta)", size=32, color=MUTED).next_to(s, DOWN, buff=0.4)
        self.say("Curioso: da lo mismo que seno de ciento cinco. No es casualidad: ciento cinco es noventa más quince.")
        self.play(FadeIn(twin))
        self.hold()
        self.mark("La tangente")
        t = VGroup(
            M(R"\tan(\alpha + \beta) = \frac{\tan\alpha + \tan\beta}{1 - \tan\alpha\tan\beta}", size=42, color=C_TAN),
            M(R"\tan75^\circ = \frac{1 + \frac{\sqrt3}{3}}{1 - \frac{\sqrt3}{3}} = \frac{3 + \sqrt3}{3 - \sqrt3}", size=40),
            M(R"= \frac{(3 + \sqrt3)^2}{9 - 3} = \frac{12 + 6\sqrt3}{6} = 2 + \sqrt3", size=40, color=C_TAN),
        ).arrange(DOWN, buff=0.45).move_to(2.6 * DOWN)
        self.say("La tangente tiene su propia fórmula: suma arriba y uno menos el producto abajo. Para setenta y cinco usamos cuarenta y cinco más treinta.")
        self.play(Write(t[0]), run_time=2)
        self.hold()
        self.say("Tangente de cuarenta y cinco es uno y de treinta es raíz de tres tercios. Multiplicamos todo por tres.")
        self.play(Write(t[1]), run_time=2)
        self.hold()
        self.say("Racionalizamos con el conjugado y simplificamos: dos más raíz de tres, unos tres coma siete.")
        self.play(Write(t[2]), run_time=2)
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("No se reparte", "sen(α + β) ≠ sen α + sen β", C_I),
        ("Seno", "sen α cos β ± cos α sen β (mismo signo)", C_SEN),
        ("Coseno", "cos α cos β ∓ sen α sen β (signo al revés)", C_COS),
        ("Ángulos raros", "105° = 60° + 45°,  15° = 45° − 30°", C_ANG),
    ]
    recap_say = ("Repasemos: el seno no se reparte; el seno de una suma mezcla y conserva el signo, el coseno junta iguales y lo "
                 "voltea; así los ángulos raros se arman con notables.")
    practice = "Ahora, el juego:\nencadena dos ángulos notables"
