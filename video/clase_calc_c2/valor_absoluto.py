"""
Clase C2 · Desigualdades con valor absoluto (Cálculo diferencial, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. |x| como distancia; el perro amarrado al poste en 2
con correa 3 (|x − 2| ≤ 3, el perro corre de lado a lado; zoom a las puntas), el gato a salvo
(|x − 2| > 3), sacar el coeficiente en |2x − 6| ≤ 4, la tolerancia de una pieza (zoom a la regla) y la
desigualdad triangular con pasos. Del Valle, módulo 1 (VA1–VA12); cronograma de Cálculo, clase 2.

    manimgl valor_absoluto.py S02_Perro -w -l
"""
from trig_scenes import *


def boxed(mob, color=BORDER, fill=PEACH, **kw):
    """Tarjeta con su contenido (get_card solo dibuja el fondo)."""
    return VGroup(get_card(mob, color=color, fill=fill, **kw), mob)


def mark_point(line, x, color, filled=True, r=0.11):
    return Dot(line.n2p(x), radius=r).set_fill(color if filled else BG_COLOR, 1).set_stroke(color, 4)


def get_dog(color=C_ANG):
    body = RoundedRectangle(width=0.55, height=0.3, corner_radius=0.12).set_fill(color, 1).set_stroke(width=0)
    head = Circle(radius=0.17).set_fill(color, 1).set_stroke(width=0).next_to(body, RIGHT, buff=-0.08).shift(0.14 * UP)
    ear = Triangle().set_fill(ORANGE, 1).set_stroke(width=0).scale(0.09).next_to(head, UP, buff=-0.05)
    legs = VGroup(*(Line(body.get_bottom() + dx * RIGHT, body.get_bottom() + dx * RIGHT + 0.18 * DOWN).set_stroke(color, 5) for dx in (-0.17, 0.17)))
    eye = Dot(head.get_center() + 0.06 * RIGHT + 0.04 * UP, radius=0.03).set_fill(BG_COLOR, 1)
    return VGroup(body, head, ear, legs, eye)


def get_cat(color=C_SEN):
    body = Circle(radius=0.22).set_fill(color, 1).set_stroke(width=0)
    head = Circle(radius=0.15).set_fill(color, 1).set_stroke(width=0).next_to(body, UP, buff=-0.05)
    ears = VGroup(*(Triangle().set_fill(color, 1).set_stroke(width=0).scale(0.07).move_to(head.get_top() + dx * RIGHT) for dx in (-0.09, 0.09)))
    return VGroup(body, head, ears)


class S00_Portada(TrigPortada):
    part_tag = "Cálculo · Clase C2"
    title = "Desigualdades con\nvalor absoluto"
    subtitle = "El perro, la correa y el gato"


class S01_Distancia(MBScene):
    def construct(self):
        self.mark("El valor absoluto es una distancia")
        self.set_header(R"|x|", "Una distancia", C_COS, P_COS)
        self.say("El valor absoluto no es «quitarle el signo»: es una distancia. Valor absoluto de x es cuántos pasos hay de x al cero.", fox=True)
        line = get_number_line(x_range=(-8, 8, 1), width=7.2, font_size=22).move_to(3.0 * UP)
        p = mark_point(line, -7, C_SEN)
        br = Brace(Line(line.n2p(-7), line.n2p(0)), UP, buff=0.25).set_color(C_SEN)
        lab = M(R"|-7| = 7", size=40, color=C_SEN).next_to(br, UP, buff=0.12)
        self.play(ShowCreation(line))
        self.play(FadeIn(p, scale=0.5), GrowFromCenter(br), Write(lab))
        self.hold()
        self.say("Y valor absoluto de a menos b es la distancia entre a y b. Da lo mismo medir de dos a cinco que de cinco a dos: tres pasos.")
        line2 = get_number_line(x_range=(-1, 7, 1), width=6.4, font_size=22).move_to(0.6 * UP)
        a, b = mark_point(line2, 2, C_COS), mark_point(line2, 5, C_TAN)
        br2 = Brace(Line(line2.n2p(2), line2.n2p(5)), UP, buff=0.25).set_color(C_ANG)
        lab2 = M(R"|5 - 2| = |2 - 5| = 3", size=40, color=C_ANG).next_to(br2, UP, buff=0.12)
        self.play(ShowCreation(line2), FadeIn(a, scale=0.5), FadeIn(b, scale=0.5))
        self.play(GrowFromCenter(br2), Write(lab2))
        self.hold()
        self.say("Por eso un valor absoluto nunca es negativo, y solo vale cero cuando los dos puntos coinciden.")
        props = boxed(M(R"|x| \ge 0 \qquad |x - a| = |a - x|", size=38), color=C_COS, fill=PEACH).move_to(2.0 * DOWN)
        self.play(FadeIn(props, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S02_Perro(MBScene):
    def construct(self):
        self.mark("El perro con correa")
        self.set_header(R"|x - 2| \le 3", "El perro", C_ANG, P_ANG)
        self.say("Un perro está amarrado a un poste en el dos con una correa de tres metros. ¿Hasta dónde puede llegar?", fox=True)
        line = get_number_line(x_range=(-3, 7, 1), width=7.0, font_size=24).move_to(1.4 * UP)
        post = VGroup(Line(line.n2p(2), line.n2p(2) + 1.1 * UP).set_stroke(INK, 6), Dot(line.n2p(2) + 1.1 * UP, radius=0.09).set_fill(C_ANG, 1))
        self.play(ShowCreation(line), FadeIn(post, shift=0.3 * DOWN))
        x = ValueTracker(2.0)
        dog = get_dog().scale(1.1)
        dog.add_updater(lambda m: m.move_to(line.n2p(x.get_value()) + 0.32 * UP))
        leash = always_redraw(lambda: Line(post[1].get_center(), dog[1].get_center()).set_stroke(C_ANG, 3))
        self.add(leash, dog)
        self.play(x.animate.set_value(5), run_time=1.4)
        self.play(x.animate.set_value(-1), run_time=2.4)
        self.play(x.animate.set_value(3.5), run_time=1.4)
        self.hold()
        self.say("Llega a todos los puntos que están a lo sumo a tres del poste: desde menos uno hasta cinco. Eso dice valor absoluto de x menos dos, menor o igual que tres.")
        band = Line(line.n2p(-1), line.n2p(5)).set_stroke(C_TAN, 10)
        ends = VGroup(mark_point(line, -1, C_TAN), mark_point(line, 5, C_TAN))
        self.play(ShowCreation(band), FadeIn(ends, scale=0.5))
        self.mark("Zoom a la punta")
        self.zoom_to(VGroup(ends[1], dog), scale=0.4)
        self.say("Con menor o igual la correa llega justo a la punta: el cinco entra, punto lleno. Con menor estricto, el punto quedaría vacío.")
        self.play(x.animate.set_value(5), run_time=1.2)
        self.play(Indicate(ends[1], color=C_TAN, scale_factor=1.8))
        self.hold()
        self.zoom_reset()
        dog.clear_updaters(); leash.clear_updaters()
        self.say("En símbolos: estar a lo sumo a tres del dos es quedar entre dos menos tres y dos más tres.")
        steps = VGroup(
            M(R"|x - 2| \le 3", size=46),
            M(R"-3 \le x - 2 \le 3", size=44),
            M(R"-1 \le x \le 5", size=48, color=C_TAN),
        ).arrange(DOWN, buff=0.35).move_to(1.6 * DOWN)
        for s in steps:
            self.play(FadeIn(s, shift=0.2 * UP))
        rule = boxed(M(R"|x - a| \le r \iff a - r \le x \le a + r", size=34), color=C_TAN, fill=PEACH).next_to(steps, DOWN, buff=0.45)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_Gato(MBScene):
    def construct(self):
        self.mark("El gato a salvo")
        self.set_header(R"|x - 2| > 3", "El gato", C_SEN, P_SEN)
        self.say("Ahora pensemos en el gato. Está a salvo donde el perro no alcanza: a más de tres metros del poste. Eso es valor absoluto de x menos dos mayor que tres.", fox=True)
        line = get_number_line(x_range=(-5, 9, 1), width=7.2, font_size=22).move_to(2.0 * UP)
        post = Line(line.n2p(2), line.n2p(2) + 0.9 * UP).set_stroke(INK, 6)
        reach = Line(line.n2p(-1), line.n2p(5)).set_stroke(C_ANG, 5).set_opacity(0.5)
        dog = get_dog().move_to(line.n2p(2) + 0.32 * UP + 0.5 * RIGHT)
        self.play(ShowCreation(line), FadeIn(post), ShowCreation(reach), FadeIn(dog))
        left = Line(line.n2p(-1), line.get_left()).set_stroke(C_SEN, 10)
        right = Line(line.n2p(5), line.get_right()).set_stroke(C_SEN, 10)
        holes = VGroup(mark_point(line, -1, C_SEN, False), mark_point(line, 5, C_SEN, False))
        cats = VGroup(get_cat().move_to(line.n2p(-3.5) + 0.45 * UP), get_cat().move_to(line.n2p(7) + 0.45 * UP))
        self.play(ShowCreation(left), ShowCreation(right), FadeIn(holes, scale=0.5), LaggedStartMap(FadeIn, cats, shift=0.3 * DOWN, lag_ratio=0.4))
        self.hold()
        self.say("Son dos trozos separados: o se aleja por la izquierda, o por la derecha. Por eso la solución es una unión de dos semirrectas.")
        steps = VGroup(
            M(R"|x - 2| > 3", size=46),
            M(R"x - 2 < -3 \quad \text{o} \quad x - 2 > 3", size=40),
            M(R"x < -1 \quad \text{o} \quad x > 5", size=46, color=C_SEN),
            M(R"(-\infty, -1) \cup (5, \infty)", size=44, color=C_SEN),
        ).arrange(DOWN, buff=0.35).move_to(1.4 * DOWN)
        for s in steps:
            self.play(FadeIn(s, shift=0.2 * UP))
        self.hold()
        self.say("Regla: menor que da un solo intervalo, el del perro; mayor que da dos pedazos, los del gato.")
        rule = boxed(M(R"|x - a| > r \iff x < a - r \;\text{o}\; x > a + r", size=32), color=C_SEN, fill=PEACH).next_to(steps, DOWN, buff=0.4)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S04_Coeficiente(MBScene):
    def construct(self):
        self.mark("Cuando hay un número adelante de x")
        self.set_header(R"|2x - 6|", "Sacar el coeficiente", C_TAN, P_TAN)
        self.say("¿Y si adentro hay dos x menos seis? El dos esconde el poste. Como el valor absoluto de un producto es el producto de los valores absolutos, el dos sale.", fox=True)
        steps = VGroup(
            M(R"|2x - 6| \le 4", size=48),
            M(R"|2(x - 3)| \le 4", size=46),
            M(R"2\,|x - 3| \le 4", size=46),
            M(R"|x - 3| \le 2", size=50, color=C_TAN),
        ).arrange(DOWN, buff=0.4).move_to(2.7 * UP)
        for s in steps[:3]:
            self.play(FadeIn(s, shift=0.2 * DOWN))
        self.hold()
        self.say("Dividimos entre dos, que es positivo, y aparecen el poste y la correa: poste en tres, correa de dos.")
        self.play(FadeIn(steps[3], shift=0.2 * DOWN))
        self.mark("Zoom al poste y la correa")
        self.zoom_to(steps[3], scale=0.35)
        tags = VGroup(T("poste 3", size=16, color=C_ANG), T("correa 2", size=16, color=C_ANG)).arrange(RIGHT, buff=0.6).next_to(steps[3], DOWN, buff=0.12)
        self.play(FadeIn(tags))
        self.hold()
        self.zoom_reset()
        self.play(FadeOut(tags))
        line = get_number_line(x_range=(-1, 7, 1), width=6.6, font_size=22).next_to(steps, DOWN, buff=0.7)
        sol = VGroup(Line(line.n2p(1), line.n2p(5)).set_stroke(C_TAN, 10), mark_point(line, 1, C_TAN), mark_point(line, 5, C_TAN))
        ans = M(R"[1, 5]", size=46, color=C_TAN).next_to(line, DOWN, buff=0.35)
        self.say("La solución va de tres menos dos a tres más dos: el intervalo cerrado de uno a cinco. También se puede resolver directo: menos cuatro, menor o igual que dos x menos seis, menor o igual que cuatro.")
        self.play(ShowCreation(line), ShowCreation(sol[0]), FadeIn(sol[1:], scale=0.5), Write(ans))
        self.hold(0.5)
        self.end_section()


class S05_Tolerancia(MBScene):
    def construct(self):
        self.mark("Tolerancias de fábrica")
        self.set_header(R"\pm", "La tolerancia", C_COS, P_COS)
        self.say("En una fábrica de tornillos, cada pieza debe medir diez centímetros, con una tolerancia de medio centímetro. Se acepta si se aleja de diez a lo sumo medio.", fox=True)
        ruler = Rectangle(width=6.8, height=0.9).set_fill(PEACH_DEEP, 1).set_stroke(C_COS, 2).move_to(2.6 * UP)
        ticks = VGroup()
        for k in range(21):
            x = ruler.get_left()[0] + 0.4 + k * (6.0 / 20)
            ticks.add(Line(np.array([x, ruler.get_top()[1], 0]), np.array([x, ruler.get_top()[1] - (0.4 if k % 5 == 0 else 0.22), 0])).set_stroke(INK, 2))
        nums = VGroup(*(M(f"{9 + k * 0.5:.1f}", size=22, color=MUTED).next_to(ticks[k * 5], DOWN, buff=0.08) for k in range(5)))
        self.play(FadeIn(ruler), LaggedStartMap(ShowCreation, ticks, lag_ratio=0.05), FadeIn(nums))
        X = lambda v: ruler.get_left()[0] + 0.4 + (v - 9) / 2 * 6.0
        ok = Rectangle(width=X(10.5) - X(9.5), height=0.25).set_fill(C_TAN, 0.8).set_stroke(width=0).move_to(np.array([(X(9.5) + X(10.5)) / 2, ruler.get_bottom()[1] - 0.35, 0]))
        center = Triangle().scale(0.12).rotate(PI).set_fill(C_ANG, 1).set_stroke(width=0).move_to(np.array([X(10), ruler.get_top()[1] + 0.15, 0]))
        self.play(FadeIn(center), FadeIn(ok))
        self.hold()
        self.say("Eso es valor absoluto de L menos diez, menor o igual que cero coma cinco: las piezas entre nueve coma cinco y diez coma cinco.")
        steps = VGroup(
            M(R"|L - 10| \le 0.5", size=48),
            M(R"9.5 \le L \le 10.5", size=48, color=C_TAN),
        ).arrange(DOWN, buff=0.35).move_to(0.2 * DOWN)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold()
        self.mark("Zoom a la regla")
        self.say("Una pieza de diez coma tres pasa; una de diez coma seis se rechaza, porque se aleja seis décimas.")
        p1 = Line(np.array([X(10.3), ruler.get_top()[1] + 0.05, 0]), np.array([X(10.3), ruler.get_bottom()[1] - 0.05, 0])).set_stroke(C_TAN, 5)
        p2 = Line(np.array([X(10.6), ruler.get_top()[1] + 0.05, 0]), np.array([X(10.6), ruler.get_bottom()[1] - 0.05, 0])).set_stroke(C_SEN, 5)
        l1 = T("10.3 ✓", size=18, color=C_TAN).next_to(p1, UP, buff=0.05)
        l2 = T("10.6 ✗", size=18, color=C_SEN).next_to(p2, UP, buff=0.05).shift(0.2 * RIGHT)
        self.zoom_to(VGroup(ruler.copy().stretch(0.5, 0).move_to(np.array([X(10.2), ruler.get_y(), 0]))), scale=0.4)
        self.play(ShowCreation(p1), FadeIn(l1))
        self.play(ShowCreation(p2), FadeIn(l2))
        self.hold()
        self.zoom_reset()
        self.hold(0.3)
        self.end_section()


class S06_Triangular(MBScene):
    def construct(self):
        self.mark("La desigualdad triangular")
        self.set_header(R"|a + b|", "Triangular", C_ANG, P_ANG)
        self.say("Una última propiedad. Si caminas tres pasos hacia adelante y luego cinco hacia atrás, terminas a dos pasos del inicio, aunque caminaste ocho en total.", fox=True)
        line = get_number_line(x_range=(-4, 5, 1), width=7.0, font_size=22).move_to(2.2 * UP)
        self.play(ShowCreation(line))
        a1 = Arrow(line.n2p(0) + 0.5 * UP, line.n2p(3) + 0.5 * UP, buff=0, stroke_color=C_COS, stroke_width=6)
        a2 = Arrow(line.n2p(3) + 1.0 * UP, line.n2p(-2) + 1.0 * UP, buff=0, stroke_color=C_SEN, stroke_width=6)
        l1 = M("+3", size=32, color=C_COS).next_to(a1, UP, buff=0.05)
        l2 = M("-5", size=32, color=C_SEN).next_to(a2, UP, buff=0.05)
        self.play(GrowArrow(a1), FadeIn(l1))
        self.play(GrowArrow(a2), FadeIn(l2))
        end = mark_point(line, -2, C_ANG)
        br = Brace(Line(line.n2p(-2), line.n2p(0)), DOWN, buff=0.35).set_color(C_ANG)
        bl = M(R"|3 + (-5)| = 2", size=34, color=C_ANG).next_to(br, DOWN, buff=0.1)
        self.play(FadeIn(end, scale=0.5), GrowFromCenter(br), Write(bl))
        self.hold()
        self.say("El valor absoluto de la suma nunca supera la suma de los valores absolutos. Son iguales solo cuando los dos números tienen el mismo signo.")
        law = boxed(M(R"|a + b| \le |a| + |b|", size=50, color=C_ANG), color=C_ANG, fill=PEACH).move_to(1.4 * DOWN)
        ex = M(R"2 \le 3 + 5 = 8", size=40, color=MUTED).next_to(law, DOWN, buff=0.35)
        self.play(FadeIn(law, shift=0.2 * UP))
        self.play(FadeIn(ex, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S07_Cierre(TrigCierre):
    recap = [
        ("Distancia", "|x − a| es lo que hay de x a a", C_COS),
        ("El perro: menor", "|x − a| ≤ r  →  [a − r, a + r]", C_ANG),
        ("El gato: mayor", "|x − a| > r  →  x < a − r o x > a + r", C_SEN),
        ("Antes, saca el coeficiente", "|2x − 6| ≤ 4  →  |x − 3| ≤ 2", C_TAN),
    ]
    recap_say = ("Repasemos: el valor absoluto es una distancia; menor que es donde llega el perro, un solo intervalo; "
                 "mayor que es donde el gato está a salvo, dos pedazos; y si hay un coeficiente, primero se saca.")
    practice = "Ahora: mueve el poste y la correa,\nabre el candado\ny ubica las dos soluciones"
