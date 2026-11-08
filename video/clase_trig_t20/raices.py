"""
Clase T20 · Raíces de un complejo (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. ¿Cuántas raíces cúbicas tiene 8? Tres, en triángulo;
la fórmula w_k con el paso 360°/n; las raíces cuartas de −16 (zoom al cuadrado que forman); y las raíces
sextas de 1 como una flor. Manual de la UdeA §15.3.

    manimgl raices.py S03_Cuartas -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def axes_at(center, half=3.2):
    c = np.array(center)
    return VGroup(Line(c + half * LEFT, c + half * RIGHT).set_stroke(MUTED, 2.5), Line(c + half * DOWN, c + half * UP).set_stroke(MUTED, 2.5))


def pt(center, unit, r, deg):
    return np.array(center) + unit * r * np.array([np.cos(deg * DEGREES), np.sin(deg * DEGREES), 0])


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T20"
    title = "Raíces de un\nnúmero complejo"
    subtitle = "Todas las raíces, en un círculo"


class S01_Cuantas(MBScene):
    def construct(self):
        self.mark("¿Solo una raíz?")
        self.set_header(R"\sqrt[3]{8}", "Más raíces de las que crees", C_ANG, P_ANG)
        q = M(R"w^3 = 8", size=60).move_to(4.2 * UP)
        self.say("La raíz cúbica de ocho es dos: dos al cubo es ocho. Pero en los complejos hay más números que, al cubo, dan ocho.", fox=True)
        self.play(Write(q))
        c, u = 0.6 * UP, 1.15
        ax = axes_at(c, 3.2)
        circ = Circle(radius=2 * u).move_to(c).set_stroke(MUTED, 2, opacity=0.6)
        self.play(ShowCreation(ax), ShowCreation(circ))
        eight = Dot(pt(c, u, 2.7, 0), radius=0.12).set_color(C_I)
        el = M(R"8\;\rightarrow", size=34, color=C_I).next_to(eight, DOWN, buff=0.12)
        self.play(GrowFromCenter(eight), FadeIn(el))
        roots = [0, 120, 240]
        dots = VGroup(*(Dot(pt(c, u, 2, d), radius=0.14).set_color(C_ANG) for d in roots))
        labs = VGroup(M(R"2", size=34, color=C_ANG).next_to(dots[0], UR, buff=0.08),
                      M(R"2\,\mathrm{cis}\,120^\circ", size=32, color=C_ANG).next_to(dots[1], UP, buff=0.12),
                      M(R"2\,\mathrm{cis}\,240^\circ", size=32, color=C_ANG).next_to(dots[2], DOWN, buff=0.12))
        self.play(GrowFromCenter(dots[0]), FadeIn(labs[0]))
        self.hold()
        self.say("Prueba con dos cis ciento veinte. Por De Moivre, al cubo: ocho cis trescientos sesenta. ¡Una vuelta completa, cae en ocho!")
        self.play(GrowFromCenter(dots[1]), FadeIn(labs[1]))
        check = M(R"(2\,\mathrm{cis}\,120^\circ)^3 = 8\,\mathrm{cis}\,360^\circ = 8", size=40, color=C_Q).move_to(3.4 * DOWN)
        self.play(Write(check))
        self.hold()
        self.say("Y dos cis doscientos cuarenta: al cubo da setecientos veinte grados, dos vueltas. También cae en ocho.")
        self.play(GrowFromCenter(dots[2]), FadeIn(labs[2]))
        tri = Polygon(*(pt(c, u, 2, d) for d in roots)).set_stroke(C_ANG, 3).set_fill(C_ANG, 0.12)
        self.play(ShowCreation(tri))
        self.say("Tres raíces cúbicas, repartidas como un triángulo perfecto. Cada una a ciento veinte grados de la siguiente.")
        self.hold(0.5)
        self.end_section()


class S02_Formula(MBScene):
    def construct(self):
        self.mark("La receta")
        self.set_header(R"w_k", "Todas las raíces", C_COS, P_COS)
        s = VGroup(
            M(R"w^n = r\,\mathrm{cis}\,\theta", size=50),
            M(R"w_k = \sqrt[n]{r}\;\mathrm{cis}\!\left(\frac{\theta + 360^\circ k}{n}\right)", size=50, color=C_COS),
            M(R"k = 0,\, 1,\, \dots,\, n - 1", size=40, color=MUTED),
        ).arrange(DOWN, buff=0.55).move_to(3.0 * UP)
        self.say("La receta sale de pensar De Moivre al revés. Si w a la n debe ser r cis theta, el módulo de w es la raíz n-ésima de r.", fox=True)
        self.play(Write(s[0]))
        self.play(Write(s[1]), run_time=2)
        self.say("Y el ángulo: theta dividido entre n. Pero theta, theta más una vuelta, theta más dos vueltas… son el mismo punto. Divididos entre n dan ángulos distintos: cada uno es una raíz.")
        self.play(FadeIn(s[2]))
        self.hold()
        steps = VGroup(
            T("1. Radio: la raíz n-ésima del módulo", size=28),
            T("2. Primera raíz: θ / n", size=28),
            T("3. Las demás: sumar 360° / n", size=28),
            T("4. Hay exactamente n raíces", size=28),
        ).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        card = get_card(steps, color=C_COS, fill=PEACH)
        VGroup(card, steps).move_to(2.4 * DOWN)
        self.say("En la práctica son cuatro pasos: el radio, la primera raíz, sumar el paso de trescientos sesenta entre n, y parar al completar n raíces.")
        self.play(FadeIn(card), LaggedStartMap(FadeIn, steps, shift=0.2 * RIGHT, lag_ratio=0.35), run_time=2.5)
        self.hold(0.5)
        self.end_section()


class S03_Cuartas(MBScene):
    def construct(self):
        self.mark("Raíces cuartas de −16")
        self.set_header(R"\sqrt[4]{-16}", "Un número negativo", C_SEN, P_SEN)
        s = VGroup(
            M(R"-16 = 16\,\mathrm{cis}\,180^\circ", size=46),
            M(R"\sqrt[4]{16} = 2,\qquad \frac{180^\circ}{4} = 45^\circ,\qquad \frac{360^\circ}{4} = 90^\circ", size=38, color=C_SEN),
        ).arrange(DOWN, buff=0.4).move_to(4.1 * UP)
        self.say("En los reales, menos dieciséis no tiene raíz cuarta: ningún real a la cuarta da negativo. En los complejos tiene cuatro.", fox=True)
        self.play(Write(s[0]))
        self.say("Menos dieciséis es dieciséis cis ciento ochenta. Radio dos, primera raíz en cuarenta y cinco grados y paso de noventa.")
        self.play(Write(s[1]), run_time=2)
        c, u = 0.9 * DOWN, 1.15
        ax = axes_at(c, 3.0)
        circ = Circle(radius=2 * u).move_to(c).set_stroke(MUTED, 2, opacity=0.6)
        self.play(ShowCreation(ax), ShowCreation(circ))
        degs = [45, 135, 225, 315]
        dots = VGroup(*(Dot(pt(c, u, 2, d), radius=0.14).set_color(C_SEN) for d in degs))
        for d, dot in zip(degs, dots):
            self.play(GrowFromCenter(dot), run_time=0.5)
        sq = Polygon(*(pt(c, u, 2, d) for d in degs)).set_stroke(C_SEN, 3).set_fill(C_SEN, 0.12)
        self.play(ShowCreation(sq))
        self.hold()
        self.mark("Zoom a una raíz")
        lab = M(R"2\,\mathrm{cis}\,45^\circ = \sqrt2 + \sqrt2\,i", size=24, color=C_SEN).next_to(dots[0], UR, buff=0.05)
        arc = get_angle_arc(45 * DEGREES, 0.5, c)
        self.zoom_to(VGroup(dots[0], arc, lab, Dot(c)), scale=0.45)
        self.play(ShowCreation(arc), FadeIn(lab))
        self.say("La primera es dos cis cuarenta y cinco: raíz de dos más raíz de dos i. Si la elevas a la cuarta, el ángulo da ciento ochenta y el módulo dieciséis.")
        self.hold()
        self.zoom_reset()
        names = M(R"\pm\sqrt2 \pm \sqrt2\,i", size=44, color=C_SEN).move_to(4.0 * DOWN)
        self.say("Las cuatro forman un cuadrado: más menos raíz de dos, más menos raíz de dos i.")
        self.play(Write(names))
        self.hold(0.5)
        self.end_section()


class S04_Flor(MBScene):
    def construct(self):
        self.mark("Las raíces de 1")
        self.set_header(R"w^6 = 1", "La flor de la unidad", C_TAN, P_TAN)
        c, u = 1.0 * UP, 2.6
        ax = axes_at(c, 3.4)
        circ = Circle(radius=u).move_to(c).set_stroke(MUTED, 2, opacity=0.6)
        self.say("El caso más bonito: las raíces de uno. Uno es uno cis cero, así que el radio es uno y la primera raíz está en cero grados.", fox=True)
        self.play(ShowCreation(ax), ShowCreation(circ))
        petals = VGroup()
        for k in range(6):
            d = 60 * k
            e = Ellipse(width=u, height=0.55).set_fill(C_TAN, 0.25).set_stroke(C_TAN, 2)
            e.rotate(d * DEGREES).move_to(pt(c, u / 2, 1, d))
            petals.add(e)
        dots = VGroup(*(Dot(pt(c, u, 1, 60 * k), radius=0.13).set_color(C_TAN) for k in range(6)))
        self.say("Para las raíces sextas, el paso es sesenta grados. Una flor de seis pétalos aparece sola.")
        self.play(LaggedStartMap(GrowFromCenter, petals, lag_ratio=0.2), LaggedStartMap(GrowFromCenter, dots, lag_ratio=0.2), run_time=2.5)
        self.play(Rotate(VGroup(petals, dots), 2 * PI, about_point=c), run_time=3)
        self.hold()
        hexa = Polygon(*(pt(c, u, 1, 60 * k) for k in range(6))).set_stroke(C_ANG, 3)
        self.play(ShowCreation(hexa))
        facts = VGroup(
            M(R"w_k = \mathrm{cis}(60^\circ k),\;\; k = 0, \dots, 5", size=40, color=C_TAN),
            M(R"\mathrm{cis}\,120^\circ = -\tfrac12 + \tfrac{\sqrt3}{2}\,i", size=38),
        ).arrange(DOWN, buff=0.35).move_to(3.4 * DOWN)
        self.say("Son los vértices de un hexágono regular. Entre ellas, cada dos, están las raíces cúbicas de uno; y uno y menos uno son las cuadradas.")
        self.play(Write(facts[0]))
        self.play(LaggedStart(*(Indicate(dots[k], color=C_ANG, scale_factor=1.8) for k in (0, 2, 4)), lag_ratio=0.3), run_time=1.6)
        self.play(LaggedStart(*(Indicate(dots[k], color=C_SEN, scale_factor=1.8) for k in (0, 3)), lag_ratio=0.3), run_time=1.2)
        self.play(Write(facts[1]))
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("n raíces", "todo complejo ≠ 0 tiene exactamente n", C_ANG),
        ("Radio", "la raíz n-ésima del módulo", C_COS),
        ("Ángulos", "θ / n, y luego de 360° / n en 360° / n", C_SEN),
        ("Forma", "un polígono regular (o una flor)", C_TAN),
    ]
    recap_say = ("Repasemos: hay exactamente n raíces; su radio es la raíz n-ésima del módulo; la primera está en theta sobre n "
                 "y las demás cada trescientos sesenta sobre n; y juntas forman un polígono regular.")
    practice = "Ahora, el juego:\ngira la flor de raíces"
