"""
Clase T19 · Producto, cociente y De Moivre (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Multiplicar por i gira un cuarto de vuelta; el producto
multiplica módulos y suma ángulos (2 cis 20° · 3 cis 40°); el cociente divide y resta (8 cis 100° ÷
2 cis 40°); la espiral de potencias de 1 + √3 i con la cámara alejándose (zoom) y (1 + i)¹⁰.
Manual de la UdeA §15.2.

    manimgl de_moivre.py S04_Espiral -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def axes_at(center, half=3.4, color=MUTED):
    c = np.array(center)
    return VGroup(Line(c + half * LEFT, c + half * RIGHT).set_stroke(color, 2.5), Line(c + half * DOWN, c + half * UP).set_stroke(color, 2.5))


def vec(center, unit, r, deg, color, width=7):
    c = np.array(center)
    tip = c + unit * r * np.array([np.cos(deg * DEGREES), np.sin(deg * DEGREES), 0])
    return Arrow(c, tip, buff=0, thickness=width / 1.5).set_color(color)


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T19"
    title = "Producto, cociente\ny De Moivre"
    subtitle = "Multiplicar es girar y estirar"


class S01_GirarConI(MBScene):
    def construct(self):
        self.mark("Multiplicar por i")
        self.set_header(R"\times\, i", "Un cuarto de vuelta", C_SEN, P_SEN)
        c, u = 1.6 * UP, 0.8
        ax = axes_at(c, 3.6)
        to = lambda a, b: c + u * np.array([a, b, 0])
        self.say("Empecemos con un truco de magia. Toma el punto tres más dos i y multiplícalo por i.", fox=True)
        self.play(ShowCreation(ax))
        z = Dot(to(3, 2), radius=0.14).set_color(C_COS)
        zl = M(R"3 + 2i", size=36, color=C_COS).next_to(z, UR, buff=0.1)
        self.play(GrowFromCenter(z), FadeIn(zl))
        calc = M(R"i(3 + 2i) = 3i + 2i^2 = -2 + 3i", size=44).move_to(3.0 * DOWN)
        self.play(Write(calc))
        self.say("Como i al cuadrado es menos uno, sale menos dos más tres i. Míralo en el plano.")
        ghost = z.copy().set_color(C_SEN)
        arc = Arc(start_angle=np.arctan2(2, 3), angle=PI / 2, radius=u * np.sqrt(13), arc_center=c).set_stroke(C_SEN, 3)
        self.play(ShowCreation(arc), Rotate(ghost, PI / 2, about_point=c), run_time=2)
        gl = M(R"-2 + 3i", size=36, color=C_SEN).next_to(ghost, UL, buff=0.1)
        self.play(FadeIn(gl))
        self.say("El punto giró exactamente un cuarto de vuelta alrededor del origen, sin acercarse ni alejarse.")
        self.hold()
        g2 = ghost.copy().set_color(C_ANG)
        arc2 = Arc(start_angle=np.arctan2(2, 3) + PI / 2, angle=PI / 2, radius=u * np.sqrt(13), arc_center=c).set_stroke(C_ANG, 3)
        self.play(ShowCreation(arc2), Rotate(g2, PI / 2, about_point=c), run_time=2)
        g2l = M(R"-3 - 2i", size=36, color=C_ANG).next_to(g2, DL, buff=0.1)
        self.play(FadeIn(g2l))
        moral = M(R"i^2 = -1:\;\text{media vuelta}", size=44, color=C_ANG).next_to(calc, DOWN, buff=0.45)
        self.say("Otra vez por i: media vuelta en total, el punto opuesto. Por eso i al cuadrado es menos uno: girar ciento ochenta grados es cambiar de signo.")
        self.play(Write(moral))
        self.hold(0.5)
        self.end_section()


class S02_Producto(MBScene):
    def construct(self):
        self.mark("Multiplicar en polar")
        self.set_header(R"z_1 z_2", "Girar y estirar", C_ANG, P_ANG)
        c, u = 2.3 * DOWN + 1.8 * LEFT, 0.62
        ax = axes_at(c, 2.2).set_stroke(opacity=0.8)
        self.say("En general, multiplicar por un complejo hace dos cosas: estira por su módulo y gira por su ángulo.", fox=True)
        self.play(ShowCreation(ax))
        z1 = vec(c, u, 2, 20, C_COS)
        z2 = vec(c, u, 3, 40, C_SEN)
        l1 = M(R"2\,\mathrm{cis}\,20^\circ", size=32, color=C_COS).next_to(z1.get_end(), RIGHT, buff=0.1)
        l2 = M(R"3\,\mathrm{cis}\,40^\circ", size=32, color=C_SEN).next_to(z2.get_end(), RIGHT, buff=0.1)
        self.play(GrowArrow(z1), FadeIn(l1))
        self.play(GrowArrow(z2), FadeIn(l2))
        self.hold()
        prod = z1.copy()
        self.say("Toma la flecha de dos cis veinte. Primero gírala cuarenta grados.")
        self.play(Rotate(prod, 40 * DEGREES, about_point=c), run_time=1.6)
        self.say("Luego estírala tres veces. Su ángulo quedó en sesenta y su largo en seis.")
        self.play(prod.animate.put_start_and_end_on(c, c + u * 6 * np.array([np.cos(PI / 3), np.sin(PI / 3), 0])).set_color(C_ANG), run_time=1.6)
        lp = M(R"6\,\mathrm{cis}\,60^\circ", size=34, color=C_ANG).next_to(prod.get_end(), RIGHT, buff=0.12)
        self.play(FadeIn(lp))
        a20 = Arc(start_angle=0, angle=20 * DEGREES, radius=0.7, arc_center=c).set_stroke(C_COS, 5)
        a40 = Arc(start_angle=20 * DEGREES, angle=40 * DEGREES, radius=0.95, arc_center=c).set_stroke(C_SEN, 5)
        self.zoom_to(VGroup(a20, a40, Dot(c)), scale=0.6)
        self.say("De cerca se ve: los veinte grados de la primera flecha más los cuarenta de la segunda forman los sesenta del resultado.")
        self.play(ShowCreation(a20))
        self.play(ShowCreation(a40))
        self.hold()
        self.zoom_reset()
        rule = VGroup(
            M(R"\text{m\'odulos: } 2 \cdot 3 = 6", size=40, color=C_ANG),
            M(R"\text{\'angulos: } 20^\circ + 40^\circ = 60^\circ", size=40, color=C_ANG),
            M(R"r_1\,\mathrm{cis}\,\theta_1 \cdot r_2\,\mathrm{cis}\,\theta_2 = r_1 r_2\,\mathrm{cis}(\theta_1 + \theta_2)", size=38, color=INK),
        ).arrange(DOWN, buff=0.25).move_to(4.0 * UP)
        self.say("La regla: los módulos se multiplican y los ángulos se suman. Es la fórmula de suma de ángulos trabajando por debajo.")
        self.play(LaggedStartMap(Write, rule, lag_ratio=0.5), run_time=3)
        self.hold(0.5)
        self.end_section()


class S03_Cociente(MBScene):
    def construct(self):
        self.mark("Dividir en polar")
        self.set_header(R"\tfrac{z_1}{z_2}", "Desgirar y encoger", C_COS, P_COS)
        c, u = 0.4 * DOWN + 1.6 * LEFT, 0.5
        ax = axes_at(c, 2.6).set_stroke(opacity=0.8)
        self.say("Dividir deshace lo que hace multiplicar: en vez de girar, desgira; en vez de estirar, encoge.", fox=True)
        self.play(ShowCreation(ax))
        z1 = vec(c, u, 8, 100, C_COS)
        l1 = M(R"8\,\mathrm{cis}\,100^\circ", size=32, color=C_COS).next_to(z1.get_end(), LEFT, buff=0.1)
        self.play(GrowArrow(z1), FadeIn(l1))
        q = z1.copy()
        div = M(R"\div\; 2\,\mathrm{cis}\,40^\circ", size=40, color=C_SEN).move_to(3.6 * UP)
        self.play(Write(div))
        self.say("Entre dos cis cuarenta: gira cuarenta grados hacia atrás…")
        self.play(Rotate(q, -40 * DEGREES, about_point=c), run_time=1.6)
        self.say("…y encoge a la mitad. Quedan cuatro cis sesenta.")
        self.play(q.animate.put_start_and_end_on(c, c + u * 4 * np.array([np.cos(PI / 3), np.sin(PI / 3), 0])).set_color(C_ANG), run_time=1.6)
        lq = M(R"4\,\mathrm{cis}\,60^\circ", size=34, color=C_ANG).next_to(q.get_end(), RIGHT, buff=0.12)
        self.play(FadeIn(lq))
        rule = M(R"\frac{r_1\,\mathrm{cis}\,\theta_1}{r_2\,\mathrm{cis}\,\theta_2} = \frac{r_1}{r_2}\,\mathrm{cis}(\theta_1 - \theta_2)", size=38, color=C_COS).move_to(3.6 * DOWN)
        self.say("Los módulos se dividen y los ángulos se restan.")
        self.play(Write(rule))
        self.hold(0.5)
        self.end_section()


class S04_Espiral(MBScene):
    def construct(self):
        self.mark("Potencias en espiral")
        self.set_header(R"z^n", "La espiral de De Moivre", C_SEN, P_SEN)
        z_tex = M(R"z = 1 + \sqrt3\,i = 2\,\mathrm{cis}\,60^\circ", size=40, color=C_ANG).move_to(4.4 * UP).fix_in_frame()
        self.say("Multiplicar varias veces por el mismo número es elevar a una potencia. Tomemos uno más raíz de tres i: módulo dos, ángulo sesenta.", fox=True)
        self.play(Write(z_tex))
        c, u = 0.2 * DOWN, 0.55
        ax = axes_at(c, 80)
        self.add(ax)
        world = VGroup(ax)
        unit_c = Circle(radius=u).move_to(c).set_stroke(MUTED, 2, opacity=0.6)
        self.play(ShowCreation(unit_c))
        world.add(unit_c)
        pts = VGroup(Dot(c + u * RIGHT, radius=0.1).set_color(INK))
        path = VMobject().set_stroke(C_SEN, 5)
        path.set_points_as_corners([c + u * RIGHT])
        label = M(R"z^0 = 1", size=40, color=C_SEN).move_to(3.6 * DOWN).fix_in_frame()
        self.add(pts, path, label)
        world.add(pts, path)
        heights = [1, 1, 1.4, 2.4, 4.4, 8.2, 17.0]
        shrink = 1.0
        for n in range(1, 7):
            new_shrink = min(1.0, 1.4 / (heights[n] * 0.85))
            f = lambda t, n=n, k=new_shrink: c + k * u * (2 ** (n - 1 + t)) * np.array([np.cos(60 * DEGREES * (n - 1 + t)), np.sin(60 * DEGREES * (n - 1 + t)), 0])
            seg = ParametricCurve(f, t_range=(0, 1, 0.02)).set_stroke(C_SEN, 5)
            dot = Dot(f(1), radius=0.1).set_color(C_SEN)
            new_label = M(f"z^{n} = {2 ** n}" + R"\,\mathrm{cis}\," + f"{60 * n}" + R"^\circ", size=40, color=C_SEN).move_to(label).fix_in_frame()
            if n == 1:
                self.say("Cada multiplicación: el doble de largo y sesenta grados más.")
            if n == 3:
                self.say("Mira cómo crece. Al cubo, ocho cis ciento ochenta: el real menos ocho. Nos alejamos para seguirla.")
            if new_shrink < shrink:
                self.play(world.animate.scale(new_shrink / shrink, about_point=c), run_time=1.0)
                shrink = new_shrink
            self.play(ShowCreation(seg), FadeTransform(label, new_label), run_time=1.6)
            self.play(GrowFromCenter(dot), run_time=0.4)
            world.add(seg, dot)
            label = new_label
            self.hold(0.3)
        self.say("A la sexta, sesenta y cuatro cis trescientos sesenta: dio la vuelta completa y cayó en el real positivo sesenta y cuatro.")
        self.hold()
        self.mark("El teorema")
        self.play(FadeOut(z_tex), FadeOut(label), run_time=1.0)
        self.clear_scene()
        s = VGroup(
            M(R"z^n = r^n\,\mathrm{cis}(n\theta)", size=60, color=C_ANG),
            M(R"(1 + i)^{10} = \left(\sqrt2\,\mathrm{cis}\,45^\circ\right)^{10}", size=44),
            M(R"= (\sqrt2)^{10}\,\mathrm{cis}\,450^\circ = 32\,\mathrm{cis}\,90^\circ = 32i", size=42, color=C_SEN),
        ).arrange(DOWN, buff=0.7).move_to(1.0 * UP)
        card = get_card(s[0], color=C_ANG, fill=PEACH)
        self.say("Ese es el teorema de De Moivre: para elevar a la n, eleva el módulo a la n y multiplica el ángulo por n.", fox=True)
        self.play(FadeIn(card), Write(s[0]))
        self.hold()
        self.say("Con él, uno más i a la décima se hace de memoria: raíz de dos a la décima es treinta y dos, y diez por cuarenta y cinco son cuatrocientos cincuenta, una vuelta más noventa. Treinta y dos i.")
        self.play(Write(s[1]))
        self.play(Write(s[2]))
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Por i", "gira 90° sin cambiar el tamaño", C_SEN),
        ("Producto", "módulos × módulos, ángulos + ángulos", C_ANG),
        ("Cociente", "módulos ÷ módulos, ángulos − ángulos", C_COS),
        ("De Moivre", "zⁿ = rⁿ cis(nθ)", C_TAN),
    ]
    recap_say = ("Repasemos: multiplicar por i gira un cuarto de vuelta; el producto multiplica módulos y suma ángulos; el cociente "
                 "divide y resta; y De Moivre eleva el módulo y multiplica el ángulo.")
    practice = "Ahora, los juegos:\nla telaraña polar\ny la espiral de potencias"
