"""
Álgebra N1 · Los números naturales y los enteros (lección alg-11, parte 1 de sistemas numéricos, 9:16).

Desde lo más básico y conectado con la unidad de conjuntos; sin zoom ni 3D. Los números también son elementos y
forman conjuntos con letras de doble trazo; ℕ = {1, 2, 3, …} (contar manzanas, los «…» de un conjunto infinito,
5 ∈ ℕ, −2 ∉ ℕ, ½ ∉ ℕ, el siguiente de cada natural); sumar y multiplicar se quedan en ℕ, restar no (2 °C que bajan
5); ℤ = {…, −2, −1, 0, 1, 2, …} con la recta y el cero; opuestos como espejo y a + (−a) = 0; ℕ ⊆ ℤ en Venn y
ℤ − ℕ = {…, −2, −1, 0}. Spec 2026-11-11-sistemas-numericos-desde-cero.

    manimgl naturales.py S04_Enteros -w -l
"""
from alg_fx import *


def apples(n, color="#FF6B6B"):
    g = VGroup()
    for _ in range(n):
        body = Circle(radius=0.28).set_fill(color, 1).set_stroke(width=0)
        leaf = Ellipse(width=0.18, height=0.1).set_fill(MINT, 1).set_stroke(width=0).move_to(body.get_top() + 0.06 * UP + 0.08 * RIGHT)
        g.add(VGroup(body, leaf))
    return g.arrange(RIGHT, buff=0.18)


def blob(width, height, color):
    return Ellipse(width=width, height=height).set_stroke(color, 4).set_fill(color, 0.12)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Sistemas numéricos · Parte 1"
    title = "Los naturales\ny los enteros"
    subtitle = "Los números también son conjuntos"


class S01_NumerosConjuntos(MBScene):
    def construct(self):
        self.mark("Los números forman conjuntos")
        self.set_header(R"\mathbb{N}\ \mathbb{Z}\ \mathbb{Q}\ \mathbb{R}", "Conjuntos de números", LAV, P_LAV)
        self.say("En la unidad anterior aprendimos qué es un conjunto: una agrupación bien definida de elementos. Pues bien: los números también son elementos, y se agrupan en conjuntos.", fox=True)
        recall = M(R"S = \{\text{rojo},\ \text{amarillo},\ \text{verde}\}", size=42, color=MUTED).move_to(3.6 * UP)
        self.play(FadeIn(recall))
        arrow = Arrow(3.0 * UP, 2.2 * UP).set_color(LAV)
        nums = M(R"A = \{1,\ 2,\ 3\}", size=56, color=INK).move_to(1.6 * UP)
        self.play(GrowArrow(arrow), Write(nums))
        self.hold()
        self.say("Algunos conjuntos de números son tan importantes que tienen nombre propio, escrito con letras de doble trazo: una línea extra en la letra. Así no se confunden con cualquier otro conjunto.")
        names = [
            (R"\mathbb{N}", "naturales", HONEY), (R"\mathbb{Z}", "enteros", SKY), (R"\mathbb{Q}", "racionales", MINT),
            (R"\mathbb{I}", "irracionales", CORAL), (R"\mathbb{R}", "reales", LAV),
        ]
        cards = VGroup(*[get_set_badge(tex, name, col, P_LAV, width=2.2) for tex, name, col in names])
        cards.arrange_in_grid(2, 3, buff=0.25).move_to(1.6 * DOWN)
        cards.set_max_width(7.2)
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.2), run_time=2.0)
        self.say("En estas tres partes los conoceremos uno por uno, y veremos cómo cada uno nació para resolver un problema que el anterior no podía.")
        self.hold(0.6)
        self.end_section()


class S02_Naturales(MBScene):
    def construct(self):
        self.mark("Los naturales: para contar")
        self.set_header(R"\mathbb{N}", "Naturales", HONEY, P_HONEY)
        self.say("Los primeros números que aprendemos sirven para contar. Una manzana, dos manzanas, tres manzanas.", fox=True)
        rows = VGroup()
        for n in (1, 2, 3):
            rows.add(VGroup(apples(n), TB(str(n), size=40, color=HONEY)).arrange(RIGHT, buff=0.5))
        rows.arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to(3.0 * UP)
        for r in rows:
            self.play(FadeIn(r[0], lag_ratio=0.3), FadeIn(r[1], scale=1.3), run_time=0.8)
        self.hold()
        self.say("Esos números forman el conjunto de los naturales. Se escribe por extensión con una letra ene de doble trazo.")
        N = M(R"\mathbb{N} = \{1,\ 2,\ 3,\ 4,\ 5,\ \dots\}", size=58).move_to(0.6 * UP)
        self.play(Write(N))
        self.say("Los tres puntos significan que la lista sigue para siempre: a cada natural le sigue otro, sumándole uno. Es un conjunto infinito, como los de la unidad anterior.")
        line = get_number_line((0, 8, 1), width=7.0, numbers=False).move_to(1.4 * DOWN)
        dots = VGroup(*[Dot(line.n2p(k), radius=0.1).set_fill(HONEY, 1) for k in range(1, 8)])
        labs = VGroup(*[T(str(k), size=24, color=HONEY).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(1, 8)])
        hops = VGroup(*[ArcBetweenPoints(line.n2p(k), line.n2p(k + 1), angle=-PI / 2).set_stroke(PINK, 3) for k in range(1, 7)])
        self.play(ShowCreation(line), FadeIn(dots), FadeIn(labs))
        self.play(LaggedStartMap(ShowCreation, hops, lag_ratio=0.25), run_time=2.0)
        plus = T("+1", size=26, color=PINK).next_to(hops[2], UP, buff=0.05)
        self.play(FadeIn(plus))
        self.hold()
        self.end_section()
        self.mark("¿Quién pertenece a ℕ?")
        self.say("Con los símbolos de pertenencia podemos decir quién está y quién no. El cinco pertenece a los naturales.", fox=True)
        facts = [
            (R"5 \in \mathbb{N}", "sirve para contar", MINT),
            (R"-2 \notin \mathbb{N}", "no se cuentan «menos dos» manzanas", CORAL),
            (R"\tfrac12 \notin \mathbb{N}", "media manzana no es un conteo", CORAL),
            (R"0 \notin \mathbb{N}", "en este curso los naturales empiezan en 1", CORAL),
        ]
        says = ["", "Menos dos no pertenece: no se pueden contar menos dos manzanas.", "Un medio tampoco: media manzana es un pedazo, no un conteo.", "Y en este curso, el cero tampoco es natural: los naturales empiezan en uno."]
        rows = VGroup()
        for tex, why, col in facts:
            rows.add(VGroup(M(tex, size=52, color=col), T(why, size=24, color=MUTED)).arrange(DOWN, buff=0.12))
        rows.arrange(DOWN, buff=0.45).move_to(0.6 * UP)
        for r, s in zip(rows, says):
            if s:
                self.say(s)
            self.play(FadeIn(r, shift=0.2 * UP), run_time=0.8)
            self.hold()
        self.end_section()


class S03_SeEscapa(MBScene):
    def construct(self):
        self.mark("Restar puede escaparse de ℕ")
        self.set_header(R"2 - 5 = \,?", "Se escapa", CORAL, P_CORAL)
        self.say("Si sumas dos naturales, obtienes otro natural. Si los multiplicas, también. Se dice que los naturales están cerrados para la suma y la multiplicación.", fox=True)
        ok = VGroup(M(R"4 + 3 = 7 \in \mathbb{N}", size=48, color=MINT), M(R"4 \cdot 3 = 12 \in \mathbb{N}", size=48, color=MINT)).arrange(DOWN, buff=0.3).move_to(3.4 * UP)
        self.play(LaggedStartMap(FadeIn, ok, shift=0.2 * UP, lag_ratio=0.5))
        self.hold()
        self.say("Pero con la resta hay un problema. Un termómetro marca dos grados y la temperatura baja cinco. ¿Dónde termina?")
        tube = RoundedRectangle(0.7, 6.2, corner_radius=0.35).set_fill(CARD, 1).set_stroke(MUTED, 3).move_to(1.4 * DOWN + 1.8 * LEFT)
        bulb = Circle(radius=0.55).set_fill(CORAL, 1).set_stroke(MUTED, 3).next_to(tube, DOWN, buff=-0.25)
        scale = NumberLine((-4, 4, 1), width=5.6, include_tip=False, tick_size=0.1).rotate(PI / 2).set_stroke(MUTED, 2).next_to(tube, RIGHT, buff=0.15)
        marks = VGroup(*[T(str(k).replace("-", "−"), size=22, color=(SKY if k < 0 else HONEY if k > 0 else INK)).next_to(scale.n2p(k), RIGHT, buff=0.15) for k in range(-4, 5)])
        temp = ValueTracker(2)
        merc = always_redraw(lambda: Rectangle(0.34, max(scale.n2p(temp.get_value())[1] - bulb.get_center()[1], 0.01)).set_fill(CORAL, 1).set_stroke(width=0).move_to(np.array([tube.get_center()[0], (scale.n2p(temp.get_value())[1] + bulb.get_center()[1]) / 2, 0])))
        reading = always_redraw(lambda: TB(f"{round(temp.get_value())} °C".replace("-", "−"), size=48, color=SKY if temp.get_value() < -0.5 else HONEY).move_to(1.8 * RIGHT + 0.0 * UP))
        self.play(FadeIn(tube), FadeIn(bulb), ShowCreation(scale), FadeIn(marks))
        self.add(merc, reading)
        self.play(temp.animate.set_value(-3), run_time=3.5, rate_func=linear)
        self.say("Baja de dos a cero, y sigue bajando tres grados más: menos tres. Ese número no está en los naturales. La resta se escapó del conjunto.")
        res = M(R"2 - 5 = -3 \notin \mathbb{N}", size=44, color=CORAL).move_to(1.8 * RIGHT + 1.6 * DOWN)
        res.set_max_width(3.8)
        self.play(Write(res))
        self.hold(0.6)
        self.end_section()


class S04_Enteros(MBScene):
    def construct(self):
        self.mark("Los enteros")
        self.set_header(R"\mathbb{Z}", "Enteros", SKY, P_SKY)
        self.say("Para que la resta siempre tenga respuesta se crearon los números enteros: los naturales, el cero y los negativos. Se escriben con una zeta de doble trazo.", fox=True)
        Z = M(R"\mathbb{Z} = \{\dots,\ -3,\ -2,\ -1,\ 0,\ 1,\ 2,\ 3,\ \dots\}", size=46).move_to(3.6 * UP)
        Z.set_max_width(7.2)
        self.play(Write(Z))
        self.say("Ahora los tres puntos aparecen a los dos lados: la lista sigue para siempre hacia la derecha y también hacia la izquierda.")
        self.hold()
        line = get_number_line((-6, 6, 1), width=7.2, numbers=False).move_to(1.4 * UP)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=22, color=(SKY if k < 0 else HONEY if k > 0 else INK)).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-6, 7)])
        self.say("En la recta, el cero queda en el centro. A la derecha están los positivos, que son los naturales; a la izquierda, los negativos.")
        self.play(ShowCreation(line), FadeIn(labs))
        right = Arrow(line.n2p(0) + 0.6 * UP, line.n2p(5) + 0.6 * UP, buff=0).set_color(HONEY)
        left = Arrow(line.n2p(0) + 0.6 * UP, line.n2p(-5) + 0.6 * UP, buff=0).set_color(SKY)
        tr = T("positivos", size=24, color=HONEY).next_to(right, UP, buff=0.05)
        tl = T("negativos", size=24, color=SKY).next_to(left, UP, buff=0.05)
        self.play(GrowArrow(right), GrowArrow(left), FadeIn(tr), FadeIn(tl))
        self.hold()
        self.say("Los negativos aparecen en la vida diaria: temperaturas bajo cero, los sótanos de un edificio, o una deuda. Si debes tres mil pesos, tu saldo es menos tres mil.")
        uses = VGroup(T("−3 °C: bajo cero", size=26), T("sótano −1", size=26), T("saldo −3.000: una deuda", size=26)).arrange(DOWN, buff=0.25).move_to(1.4 * DOWN)
        self.play(LaggedStartMap(FadeIn, uses, shift=0.2 * RIGHT, lag_ratio=0.3))
        self.hold()
        self.say("Con los enteros, la resta que se escapaba ya tiene respuesta: dos menos cinco es menos tres, y menos tres pertenece a los enteros.")
        res = M(R"2 - 5 = -3 \in \mathbb{Z}", size=48, color=MINT).move_to(3.6 * DOWN)
        self.play(Write(res))
        self.hold(0.6)
        self.end_section()


class S05_Opuestos(MBScene):
    def construct(self):
        self.mark("El opuesto: un espejo en el cero")
        self.set_header(R"-a", "Opuestos", PINK, P_PINK)
        self.say("Cada entero tiene un opuesto. Imagina un espejo parado en el cero: el opuesto es el reflejo, a la misma distancia del cero pero del otro lado.", fox=True)
        line = get_number_line((-6, 6, 1), width=7.2, numbers=False).move_to(2.2 * UP)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=22, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-6, 7)])
        mirror = DashedLine(line.n2p(0) + 1.4 * UP, line.n2p(0) + 0.9 * DOWN).set_stroke(PINK, 3)
        self.play(ShowCreation(line), FadeIn(labs), ShowCreation(mirror))
        p = Dot(line.n2p(4), radius=0.14).set_fill(HONEY, 1)
        q = Dot(line.n2p(-4), radius=0.14).set_fill(SKY, 1)
        lp = M("4", size=40, color=HONEY).next_to(p, UP, buff=0.2)
        lq = M("-4", size=40, color=SKY).next_to(q, UP, buff=0.2)
        self.play(GrowFromCenter(p), FadeIn(lp))
        self.play(TransformFromCopy(p, q, path_arc=PI / 2), TransformFromCopy(lp, lq, path_arc=PI / 2), run_time=1.6)
        b1 = Brace(Line(line.n2p(0), line.n2p(4)), DOWN, buff=0.55).set_color(HONEY)
        b2 = Brace(Line(line.n2p(-4), line.n2p(0)), DOWN, buff=0.55).set_color(SKY)
        self.play(GrowFromCenter(b1), GrowFromCenter(b2))
        self.hold()
        self.say("El opuesto de un número se escribe poniéndole un signo menos adelante. El opuesto de cuatro es menos cuatro, y el opuesto de menos cuatro es cuatro: menos de menos cuatro es cuatro.")
        rules = VGroup(M(R"-(4) = -4", size=46), M(R"-(-4) = 4", size=46)).arrange(RIGHT, buff=1.0).move_to(0.0 * UP)
        self.play(LaggedStartMap(Write, rules, lag_ratio=0.5))
        self.hold()
        self.say("Y un número más su opuesto siempre da cero: avanzar cuatro y retroceder cuatro te deja donde empezaste.")
        hop1 = ArcBetweenPoints(line.n2p(0), line.n2p(4), angle=-PI / 2).set_stroke(HONEY, 4)
        hop2 = ArcBetweenPoints(line.n2p(4), line.n2p(0), angle=-PI / 2).set_stroke(SKY, 4)
        self.play(ShowCreation(hop1))
        self.play(ShowCreation(hop2))
        zero = formula_card(R"a + (-a) = 0 \qquad 4 + (-4) = 0", color=PINK, size=42).move_to(2.2 * DOWN)
        self.play(FadeIn(zero, shift=0.2 * UP))
        self.say("El cero es el único número que es su propio opuesto: su reflejo es él mismo.")
        self.hold(0.6)
        self.end_section()


class S06_Contenidos(MBScene):
    def construct(self):
        self.mark("ℕ está contenido en ℤ")
        self.set_header(R"\mathbb{N} \subseteq \mathbb{Z}", "Uno dentro de otro", LAV, P_LAV)
        self.say("Ahora usemos lo que sabemos de conjuntos. Todo número natural es también entero. Eso quiere decir que los naturales son un subconjunto de los enteros.", fox=True)
        Zb = blob(6.6, 4.4, SKY).move_to(1.6 * UP)
        Nb = blob(3.2, 2.4, HONEY).move_to(1.6 * UP + 1.2 * RIGHT)
        lz = M(R"\mathbb{Z}", size=48, color=SKY).move_to(Zb.get_center() + 2.6 * LEFT + 1.3 * UP)
        ln = M(R"\mathbb{N}", size=44, color=HONEY).move_to(Nb.get_center() + 1.1 * UP + 1.0 * RIGHT)
        nat = VGroup(*[TB(str(k), size=30, color=HONEY) for k in (1, 2, 3)], T("…", size=30, color=HONEY)).arrange(RIGHT, buff=0.3).move_to(Nb)
        rest = VGroup(*[TB(t, size=30, color=SKY) for t in ("0", "−1", "−2", "…")]).arrange(DOWN, buff=0.15).move_to(Zb.get_center() + 1.8 * LEFT + 0.1 * DOWN)
        self.play(DrawBorderThenFill(Zb), FadeIn(lz))
        self.play(DrawBorderThenFill(Nb), FadeIn(ln), FadeIn(nat))
        self.play(FadeIn(rest))
        sub = M(R"\mathbb{N} \subseteq \mathbb{Z}", size=60, color=INK).move_to(1.6 * DOWN)
        self.play(Write(sub))
        self.hold()
        self.say("¿Y qué tienen los enteros que no tengan los naturales? Es la diferencia que vimos en la unidad de conjuntos: zeta menos ene. Quedan el cero y los negativos.")
        diff = M(R"\mathbb{Z} - \mathbb{N} = \{\dots,\ -2,\ -1,\ 0\}", size=46, color=SKY).move_to(3.0 * DOWN)
        diff.set_max_width(7.2)
        self.play(Indicate(rest, color=SKY), Write(diff))
        self.hold()
        self.say("Así crecen los números: cada conjunto nuevo contiene al anterior y agrega lo que faltaba. En la próxima parte veremos qué pasa al dividir.")
        self.hold(0.6)
        self.end_section()


class S07_Cierre(AlgCierre):
    recap = [
        ("Conjuntos de números", "letras de doble trazo: ℕ, ℤ, ℚ, 𝕀, ℝ", LAV),
        ("Naturales", "ℕ = {1, 2, 3, …}: para contar", HONEY),
        ("Pertenencia", "5 ∈ ℕ,  −2 ∉ ℕ,  ½ ∉ ℕ", HONEY),
        ("La resta se escapa", "2 − 5 = −3 ∉ ℕ", CORAL),
        ("Enteros", "ℤ = {…, −2, −1, 0, 1, 2, …}", SKY),
        ("Opuestos", "−(−4) = 4  ·  a + (−a) = 0", PINK),
        ("Contenidos", "ℕ ⊆ ℤ  ·  ℤ − ℕ = {…, −2, −1, 0}", LAV),
    ]
    recap_say = "Los naturales sirven para contar y los enteros resuelven todas las restas. Los naturales viven dentro de los enteros."
    practice = "Opera con ℕ, recorre la recta y busca opuestos"
