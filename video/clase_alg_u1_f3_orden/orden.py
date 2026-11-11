"""
Álgebra F3 · Axiomas de orden y valor absoluto (lección alg-12d, parte 3 de axiomas, 9:16).

Desde lo básico y sin zoom ni 3D: los positivos ℝ⁺ (a la derecha del cero, cerrados para + y ·); tricotomía
(positivo, cero o negativo); a < b si b − a es positivo (−5 < −2; 1.4 < √2 de la parte de irracionales); los signos
<, >, ≤, ≥; transitiva (estaturas); sumar conserva el orden, multiplicar por positivo también y por negativo lo
voltea (1 < 4 → 3 < 6 → 3 < 12 → −1 > −4, espejo del cero); valor absoluto como distancia al cero (|−6|, |4|, |0|,
|√2 − 1.5|); distancia |b − a| (entre −4 y 3); |x − 1| ≤ 2 = [−1, 3]. Spec 2026-11-11-axiomas-desde-cero.

    manimgl orden.py S03_Operar -w -l
"""
from alg_fx import *


def stack(*mobs, buff=0.4):
    return VGroup(*mobs).arrange(DOWN, buff=buff)


def pt(line, v, color, r=0.13):
    return Dot(line.n2p(v), radius=r).set_fill(color, 1)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Axiomas · Parte 3"
    title = "El orden y el\nvalor absoluto"
    subtitle = "Axiomas de orden"


class S01_Positivos(MBScene):
    def construct(self):
        self.mark("Los positivos")
        self.set_header(R"\mathbb{R}^+", "Positivos", HONEY, P_HONEY)
        self.say("Los números reales, además de sumarse y multiplicarse, se pueden ordenar. Todo empieza con los positivos: los que están a la derecha del cero en la recta.", fox=True)
        line = get_number_line((-5, 5, 1), width=7.0).move_to(3.6 * UP)
        self.play(ShowCreation(line))
        pos = Line(line.n2p(0), line.n2p(5)).set_stroke(MINT, 10, opacity=0.7)
        neg = Line(line.n2p(-5), line.n2p(0)).set_stroke(CORAL, 10, opacity=0.7)
        lp = T("positivos  ℝ⁺", size=26, color=MINT).next_to(pos, UP, buff=0.35)
        ln = T("negativos", size=26, color=CORAL).next_to(neg, UP, buff=0.35)
        self.play(ShowCreation(pos), FadeIn(lp))
        self.play(ShowCreation(neg), FadeIn(ln))
        self.hold()
        self.say("Primera regla de orden: si sumas o multiplicas dos positivos, el resultado también es positivo. Los positivos son cerrados.")
        r = M(R"a, b \in \mathbb{R}^+ \;\Rightarrow\; a + b \in \mathbb{R}^+,\ \ ab \in \mathbb{R}^+", size=40, color=MINT).move_to(1.8 * UP)
        r.set_max_width(7.2)
        self.play(Write(r))
        self.hold()
        self.say("Segunda regla, la tricotomía, que quiere decir «dividido en tres»: todo número real es positivo, o es cero, o es negativo. Exactamente una de las tres, nunca dos a la vez.")
        cards = VGroup(
            get_set_badge(R"\sqrt{2}", "positivo", MINT, P_MINT, width=2.2),
            get_set_badge(R"0", "cero", INK, PEACH, width=2.2),
            get_set_badge(R"-\tfrac{3}{4}", "negativo", CORAL, P_CORAL, width=2.2),
        ).arrange(RIGHT, buff=0.25).move_to(0.6 * DOWN)
        cards.set_max_width(7.2)
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.3), run_time=1.4)
        tri = note("Tricotomía: a > 0,  a = 0  o  a < 0\n(una y solo una)", color=HONEY, size=28).move_to(3.0 * DOWN)
        self.play(FadeIn(tri, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S02_Menor(MBScene):
    def construct(self):
        self.mark("Qué significa menor que")
        self.set_header(R"a<b", "Menor que", SKY, P_SKY)
        self.say("¿Qué significa que un número sea menor que otro? Decimos que a es menor que b cuando b menos a da un número positivo.", fox=True)
        d = M(R"a < b \iff b - a > 0", size=60, color=SKY).move_to(4.0 * UP)
        self.play(Write(d))
        self.hold()
        self.say("Por ejemplo, menos cinco es menor que menos dos, porque menos dos menos menos cinco da tres, que es positivo. En la recta, el menor siempre queda a la izquierda.")
        line = get_number_line((-6, 1, 1), width=7.0).move_to(2.2 * UP)
        a, b = pt(line, -5, CORAL), pt(line, -2, SKY)
        self.play(ShowCreation(line), GrowFromCenter(a), GrowFromCenter(b))
        br = Brace(Line(line.n2p(-5), line.n2p(-2)), DOWN, buff=0.45).set_color(MINT)
        bt = M("3", size=36, color=MINT).next_to(br, DOWN, buff=0.1)
        self.play(GrowFromCenter(br), FadeIn(bt))
        e = M(R"-2 - (-5) = 3 > 0 \;\Rightarrow\; -5 < -2", size=44).move_to(0.2 * UP)
        e.set_max_width(7.2)
        self.play(Write(e))
        self.hold()
        self.say("Sirve también con irracionales. En la parte de irracionales vimos que raíz de dos es uno punto cuatro uno cuatro, y algo más. Su diferencia con uno punto cuatro es positiva: uno punto cuatro es menor que raíz de dos.")
        e2 = M(R"\sqrt2 - 1.4 = 0.0142\ldots > 0 \;\Rightarrow\; 1.4 < \sqrt2", size=42, color=CORAL).move_to(1.3 * DOWN)
        e2.set_max_width(7.2)
        self.play(Write(e2))
        self.hold()
        self.end_section()
        self.clear_scene()
        self.mark("Los cuatro signos")
        self.say("Hay cuatro signos para comparar. La boca abierta siempre mira al número más grande.", fox=True)
        signs = [
            (R"a < b", "a es menor que b", SKY),
            (R"a > b", "a es mayor que b", SKY),
            (R"a \le b", "a es menor o igual que b", MINT),
            (R"a \ge b", "a es mayor o igual que b", MINT),
        ]
        rows = VGroup(*[VGroup(M(t, size=50, color=c), T(s, size=28, color=INK)).arrange(RIGHT, buff=0.5) for t, s, c in signs])
        rows.arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to(2.6 * UP)
        rows.set_max_width(7.2)
        for r in rows:
            self.play(FadeIn(r, shift=0.2 * RIGHT), run_time=0.7)
        self.hold()
        self.say("El signo con rayita lleva una «o»: basta con que se cumpla una de las dos. Cuatro es menor o igual que cuatro es verdad, porque son iguales.")
        t = M(R"4 \le 4 \quad \checkmark", size=52, color=MINT).move_to(0.2 * DOWN)
        self.play(Write(t))
        self.hold()
        self.say("Y una regla más, la transitiva: si a es menor que b, y b es menor que c, entonces a es menor que c. Como en una fila por estaturas: si Ana es más baja que Beto y Beto más bajo que Caro, Ana es más baja que Caro.")
        bars = VGroup(*[Rectangle(0.7, h).set_fill(c, 0.7).set_stroke(INK, 1.5) for h, c in [(1.0, SKY), (1.5, MINT), (2.0, HONEY)]])
        bars.arrange(RIGHT, buff=0.6, aligned_edge=DOWN).move_to(2.4 * DOWN)
        names = VGroup(*[T(n, size=24, color=MUTED).next_to(b, DOWN, buff=0.12) for n, b in zip(["Ana", "Beto", "Caro"], bars)])
        self.play(LaggedStart(*[GrowFromEdge(x, DOWN) for x in bars], lag_ratio=0.3), FadeIn(names))
        tr = M(R"a < b,\ b < c \;\Rightarrow\; a < c", size=46, color=HONEY).move_to(4.6 * DOWN)
        self.play(Write(tr))
        self.hold(0.6)
        self.end_section()


class S03_Operar(MBScene):
    def construct(self):
        self.mark("Operar con desigualdades")
        self.set_header(R"a<b", "Operar", MINT, P_MINT)
        self.say("¿Qué le pasa a una desigualdad si hacemos lo mismo a los dos lados? Empecemos con uno menor que cuatro.", fox=True)
        line = get_number_line((-13, 13, 1), width=7.2, numbers=False).move_to(3.4 * UP)
        nums = VGroup(*[M(str(k).replace("-", "-"), size=24, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-12, 13, 4)])
        a, b = pt(line, 1, SKY), pt(line, 4, HONEY)
        la = M("a", size=34, color=SKY).next_to(a, UP, buff=0.15)
        lb = M("b", size=34, color=HONEY).next_to(b, UP, buff=0.15)
        la.add_updater(lambda m: m.next_to(a, UP, buff=0.15))
        lb.add_updater(lambda m: m.next_to(b, UP, buff=0.15))
        self.play(ShowCreation(line), FadeIn(nums), GrowFromCenter(a), GrowFromCenter(b), FadeIn(la), FadeIn(lb))
        state = M(R"1 < 4", size=54).move_to(1.8 * UP)
        self.play(Write(state))
        self.hold()
        self.say("Si sumamos dos a los dos, los dos puntos se corren lo mismo hacia la derecha: tres es menor que seis. Sumar conserva el orden.")
        self.play(a.animate.move_to(line.n2p(3)), b.animate.move_to(line.n2p(6)), Transform(state, M(R"1 + 2 < 4 + 2:\quad 3 < 6", size=50).move_to(1.8 * UP)), run_time=1.4)
        r1 = M(R"a < b \;\Rightarrow\; a + c < b + c", size=42, color=MINT).move_to(0.6 * UP)
        self.play(FadeIn(r1))
        self.hold()
        self.say("Volvamos a uno y cuatro, y ahora multipliquemos por tres, un positivo: la recta se estira desde el cero y queda tres menor que doce. Multiplicar por un positivo también conserva el orden.")
        self.play(a.animate.move_to(line.n2p(1)), b.animate.move_to(line.n2p(4)), Transform(state, M(R"1 < 4", size=54).move_to(1.8 * UP)), run_time=1.0)
        self.play(a.animate.move_to(line.n2p(3)), b.animate.move_to(line.n2p(12)), Transform(state, M(R"3 \cdot 1 < 3 \cdot 4:\quad 3 < 12", size=50).move_to(1.8 * UP)), run_time=1.4)
        r2 = M(R"a < b,\ c > 0 \;\Rightarrow\; ac < bc", size=42, color=MINT).move_to(0.5 * DOWN)
        self.play(FadeIn(r2))
        self.unsay()
        self.mark("Por un negativo: se voltea")
        self.say("Pero si multiplicamos por menos uno, cada punto salta a su reflejo en el espejo del cero. Volvamos a uno y cuatro: quedan menos uno y menos cuatro. Ahora el que estaba a la izquierda quedó a la derecha.", fox=True)
        mirror = DashedLine(line.n2p(0) + 1.0 * UP, line.n2p(0) + 0.5 * DOWN).set_stroke(CORAL, 3)
        self.play(a.animate.move_to(line.n2p(1)), b.animate.move_to(line.n2p(4)), Transform(state, M(R"1 < 4", size=54).move_to(1.8 * UP)), FadeOut(r1), FadeOut(r2))
        self.play(ShowCreation(mirror))
        self.play(a.animate.move_to(line.n2p(-1)), b.animate.move_to(line.n2p(-4)), Transform(state, M(R"(-1) \cdot 1 > (-1) \cdot 4:\quad -1 > -4", size=46, color=CORAL).move_to(1.8 * UP)), run_time=1.6)
        self.hold()
        self.say("Por eso, al multiplicar por un negativo, la desigualdad se voltea: el signo menor que se convierte en mayor que.")
        r3 = M(R"a < b,\ c < 0 \;\Rightarrow\; ac > bc", size=48, color=CORAL).move_to(0.4 * UP)
        self.play(Write(r3))
        card = note("Sumar o restar: el signo se queda.\nMultiplicar o dividir por un positivo: se queda.\nPor un negativo: se voltea.", color=MINT, size=26).move_to(2.0 * DOWN)
        self.play(FadeIn(card, shift=0.2 * UP))
        la.clear_updaters(); lb.clear_updaters()
        self.hold(0.6)
        self.end_section()


class S04_Absoluto(MBScene):
    def construct(self):
        self.mark("Valor absoluto: la distancia al cero")
        self.set_header(R"|a|", "Valor absoluto", MINT, P_MINT)
        self.say("El valor absoluto de un número es su distancia al cero. Una distancia nunca es negativa: seis pasos hacia la izquierda siguen siendo seis pasos.", fox=True)
        line = get_number_line((-7, 7, 1), width=7.2, numbers=False).move_to(3.6 * UP)
        nums = VGroup(*[M(str(k), size=24, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-6, 7, 2)])
        self.play(ShowCreation(line), FadeIn(nums))
        a, b = pt(line, -6, CORAL), pt(line, 4, SKY)
        self.play(GrowFromCenter(a), GrowFromCenter(b))
        ba = Brace(Line(line.n2p(-6), line.n2p(0)), UP, buff=0.25).set_color(CORAL)
        bb = Brace(Line(line.n2p(0), line.n2p(4)), UP, buff=0.25).set_color(SKY)
        ta = M("6", size=34, color=CORAL).next_to(ba, UP, buff=0.1)
        tb = M("4", size=34, color=SKY).next_to(bb, UP, buff=0.1)
        self.play(GrowFromCenter(ba), FadeIn(ta), GrowFromCenter(bb), FadeIn(tb))
        e = M(R"|-6| = 6 \qquad |4| = 4 \qquad |0| = 0", size=46).move_to(1.9 * UP)
        self.play(Write(e))
        self.hold()
        self.say("En fórmula: si el número es positivo o cero, se queda igual. Si es negativo, se toma su opuesto.")
        defi = M(R"|a| = \begin{cases} a & \text{si } a \ge 0 \\ -a & \text{si } a < 0 \end{cases}", size=46, color=MINT).move_to(0.0 * UP)
        self.play(Write(defi))
        self.hold()
        self.say("Ojo con ese menos a: en ese renglón a es negativo, así que menos a es positivo. Si a es menos seis, menos a es menos menos seis, que es seis. Es el opuesto, del otro lado del espejo.")
        o = M(R"a = -6 \;\Rightarrow\; -a = -(-6) = 6", size=44, color=HONEY).move_to(1.9 * DOWN)
        self.play(Write(o))
        self.hold()
        self.end_section()
        self.clear_scene()
        self.mark("Con un irracional adentro")
        self.say("¿Cuánto es el valor absoluto de raíz de dos menos uno punto cinco? Primero miramos el signo de lo de adentro. Raíz de dos es uno punto cuatro uno, menor que uno punto cinco: la resta es negativa.", fox=True)
        s = stack(
            M(R"|\sqrt2 - 1.5|", size=54),
            M(R"\sqrt2 \approx 1.414 < 1.5 \;\Rightarrow\; \sqrt2 - 1.5 < 0", size=42, color=CORAL),
            M(R"|\sqrt2 - 1.5| = -(\sqrt2 - 1.5) = 1.5 - \sqrt2", size=42, color=MINT),
        ).move_to(2.2 * UP)
        s.set_max_width(7.2)
        for x in s:
            self.play(FadeIn(x, shift=0.2 * DOWN), run_time=0.8)
            self.hold()
        self.say("Como es negativa, tomamos su opuesto: uno punto cinco menos raíz de dos, que es positivo, más o menos cero punto cero ocho seis.")
        r = M(R"1.5 - \sqrt2 \approx 0.086 > 0", size=46, color=MINT).move_to(1.4 * DOWN)
        self.play(Write(r))
        self.hold(0.6)
        self.end_section()


class S05_Distancia(MBScene):
    def construct(self):
        self.mark("La distancia entre dos números")
        self.set_header(R"|b-a|", "Distancia", HONEY, P_HONEY)
        self.say("La distancia entre dos números de la recta es el valor absoluto de su resta. Entre menos cuatro y tres hay siete pasos.", fox=True)
        line = get_number_line((-5, 5, 1), width=7.0).move_to(3.8 * UP)
        a, b = pt(line, -4, SKY), pt(line, 3, HONEY)
        self.play(ShowCreation(line), GrowFromCenter(a), GrowFromCenter(b))
        br = Brace(Line(line.n2p(-4), line.n2p(3)), UP, buff=0.3).set_color(MINT)
        bt = M("7", size=36, color=MINT).next_to(br, UP, buff=0.1)
        self.play(GrowFromCenter(br), FadeIn(bt))
        e = stack(
            M(R"|3 - (-4)| = |7| = 7", size=46),
            M(R"|-4 - 3| = |-7| = 7", size=46),
        ).move_to(1.8 * UP)
        self.play(Write(e))
        self.say("No importa el orden en que se resten: el valor absoluto quita el signo. Por eso la distancia entre a y b se escribe así.")
        gen = M(R"d(a, b) = |b - a|", size=56, color=HONEY).move_to(0.0 * UP)
        self.play(Write(gen))
        self.hold()
        self.end_section()
        self.clear_scene()
        self.mark("Los que están cerca: intervalos")
        self.say("Ahora al revés: ¿qué números están a distancia de a lo sumo dos del número uno? Eso se escribe: valor absoluto de x menos uno, menor o igual que dos.", fox=True)
        q = M(R"|x - 1| \le 2", size=60, color=HONEY).move_to(4.2 * UP)
        self.play(Write(q))
        line = get_number_line((-3, 5, 1), width=7.0).move_to(2.4 * UP)
        c = pt(line, 1, HONEY)
        self.play(ShowCreation(line), GrowFromCenter(c))
        self.say("Desde el uno caminamos dos pasos hacia cada lado: llegamos al menos uno y al tres. Todos los números de en medio cumplen, y los extremos también, porque el signo permite la igualdad.")
        seg = Line(line.n2p(-1), line.n2p(3)).set_stroke(MINT, 10, opacity=0.8)
        ends = VGroup(pt(line, -1, MINT, 0.15), pt(line, 3, MINT, 0.15))
        self.play(ShowCreation(seg), FadeIn(ends))
        r = M(R"-1 \le x \le 3", size=52).move_to(0.9 * UP)
        self.play(Write(r))
        self.hold()
        self.say("Ese tramo de la recta se llama intervalo, y se escribe con corchetes cuando los extremos entran. Si el signo fuera menor estricto, los extremos no entrarían, y se usan paréntesis.")
        iv = VGroup(
            VGroup(M(R"[-1,\ 3]", size=52, color=MINT), T("extremos incluidos (≤)", size=26)).arrange(DOWN, buff=0.15),
            VGroup(M(R"(-1,\ 3)", size=52, color=SKY), T("extremos fuera (<)", size=26)).arrange(DOWN, buff=0.15),
        ).arrange(RIGHT, buff=0.8).move_to(1.2 * DOWN)
        iv.set_max_width(7.2)
        self.play(LaggedStartMap(FadeIn, iv, shift=0.2 * UP, lag_ratio=0.4), run_time=1.4)
        self.hold(0.6)
        self.end_section()


class S06_Cierre(AlgCierre):
    recap = [
        ("Positivos", "ℝ⁺: cerrados para la suma y el producto", MINT),
        ("Tricotomía", "positivo, cero o negativo: solo uno", HONEY),
        ("Menor que", "a < b  ⟺  b − a > 0", SKY),
        ("Transitiva", "a < b y b < c ⇒ a < c", SKY),
        ("Operar", "por un negativo, la desigualdad se voltea", CORAL),
        ("Valor absoluto", "|a| = distancia al cero, nunca negativo", MINT),
        ("Distancia", "|b − a|  ·  |x − 1| ≤ 2 ⟺ [−1, 3]", HONEY),
    ]
    recap_say = "Los reales se ordenan con los positivos: a es menor que b cuando b menos a es positivo. Y el valor absoluto mide distancias."
    practice = "Ordena trenes, voltea desigualdades y dobla la recta por el cero"
