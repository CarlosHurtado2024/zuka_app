"""
Álgebra N3 · Los irracionales y los números reales (lección alg-11c, parte 3 de sistemas numéricos, 9:16).

Desde lo más básico y conectado con la unidad de conjuntos; sin zoom ni 3D. El lado del cuadrado de área 2: se
acorrala con 1.4² = 1.96 y 1.42² = 2.0164 pero nunca es exacto: √2; decimales sin fin ni período; π con una rueda
que rueda una vuelta (2D); 𝕀; ℝ = ℚ ∪ 𝕀 y ℚ ∩ 𝕀 = ∅ con un Venn (unión e intersección de la unidad 0); el mapa
completo con ℕ ⊆ ℤ ⊆ ℚ dentro de ℝ; la recta real y, sin zoom, reglas apiladas que muestran que entre dos números
siempre hay otro; y cómo clasificar un número con tres preguntas. Spec 2026-11-11-sistemas-numericos-desde-cero.

    manimgl reales.py S03_Reales -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Sistemas numéricos · Parte 3"
    title = "Los irracionales\ny los reales"
    subtitle = "Números que no son fracciones"


class S01_Cuadrado(MBScene):
    def construct(self):
        self.mark("¿Todo número es una fracción?")
        self.set_header(R"\sqrt{2}", "Irracionales", CORAL, P_CORAL)
        self.say("Hasta ahora, cada número que hemos visto se puede escribir como fracción. Pero, ¿todos los números son así? Hagamos un experimento con un cuadrado.", fox=True)
        u = 1.15
        unit_sq = VGroup(*[Square(u).set_fill(LAV, 0.5).set_stroke(INK, 2) for _ in range(2)]).arrange(RIGHT, buff=0).move_to(3.2 * UP)
        lab = T("dos cuadritos de área 1", size=24, color=MUTED).next_to(unit_sq, DOWN, buff=0.15)
        self.play(FadeIn(unit_sq), FadeIn(lab))
        self.say("Tenemos dos cuadritos de área uno. Queremos un solo cuadrado con la misma área: dos. ¿Cuánto debe medir su lado?")
        big = Square(u * np.sqrt(2)).set_fill(CORAL, 0.35).set_stroke(CORAL, 3).move_to(0.8 * UP)
        q = M(R"\text{lado}^2 = 2", size=44).next_to(big, RIGHT, buff=0.4)
        self.play(TransformFromCopy(unit_sq, big), FadeIn(q))
        self.hold()
        self.end_section()
        self.mark("Acorralar el lado")
        self.say("Probemos números. Uno por uno da uno: muy poco. Dos por dos da cuatro: demasiado. El lado está entre uno y dos.", fox=True)
        tries = [
            (R"1^2 = 1", "muy poco", SKY), (R"2^2 = 4", "demasiado", CORAL),
            (R"1.4^2 = 1.96", "un poco menos de 2", SKY), (R"1.5^2 = 2.25", "un poco más de 2", CORAL),
            (R"1.41^2 = 1.9881", "casi…", SKY), (R"1.42^2 = 2.0164", "se pasa", CORAL),
        ]
        rows = VGroup()
        for tex, why, col in tries:
            rows.add(VGroup(M(tex, size=48, color=col), T(why, size=30, color=MUTED)).arrange(RIGHT, buff=0.3))
        rows.arrange(DOWN, buff=0.28, aligned_edge=LEFT).move_to(2.3 * UP)
        rows.set_max_width(7.2)
        says = ["", "", "Con un decimal: uno punto cuatro al cuadrado da uno punto noventa y seis, y uno punto cinco se pasa.", "", "Con dos decimales se acerca más, pero uno punto cuarenta y dos ya se pasa de dos.", ""]
        for r, s in zip(rows, says):
            if s:
                self.say(s)
            self.play(FadeIn(r, shift=0.15 * UP), run_time=0.6)
            self.hold()
        self.say("Podemos seguir agregando cifras toda la vida y nunca da exactamente dos. Los matemáticos demostraron que no es mala suerte: ninguna fracción al cuadrado da dos. Ese lado es un número nuevo, la raíz cuadrada de dos.")
        r2 = M(R"\sqrt{2} = 1.41421356\ldots", size=56, color=CORAL).move_to(1.3 * DOWN)
        self.play(Write(r2))
        self.hold()
        self.say("Como no es una fracción, su decimal nunca termina y nunca repite un período: recuerda que el de las fracciones siempre termina o se repite. Es un número irracional.")
        rule = note("Irracional: decimal infinito y sin período.\nNo se puede escribir como fracción.", color=CORAL, size=26).move_to(3.0 * DOWN)
        self.play(FadeIn(rule, shift=0.2 * UP))
        I = M(R"\mathbb{I} = \{\text{n\'umeros que no son fracciones de enteros}\}", size=40, color=CORAL).move_to(4.6 * DOWN)
        I.set_max_width(7.2)
        self.play(Write(I))
        self.hold(0.6)
        self.end_section()


class S02_Pi(MBScene):
    def construct(self):
        self.mark("Otro irracional famoso: pi")
        self.set_header(R"\pi", "Pi", HONEY, P_HONEY)
        self.say("Otro irracional muy famoso es pi. Toma una rueda de un metro de ancho, márcale un punto y hazla rodar una vuelta completa.", fox=True)
        line = get_number_line((0, 4, 1), unit_size=1.6, numbers=False).move_to(0.6 * DOWN)
        labs = VGroup(*[T(f"{k} m", size=22, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(0, 5)])
        r = 0.8
        wheel = VGroup(Circle(radius=r).set_stroke(HONEY, 5), Line(ORIGIN, r * DOWN).set_stroke(CORAL, 4), Dot(radius=0.06).set_fill(INK, 1))
        wheel.move_to(line.n2p(0) + r * UP)
        c0 = wheel.get_center()
        diam = VGroup(Arrow(c0, wheel.get_left(), buff=0), Arrow(c0, wheel.get_right(), buff=0)).set_color(SKY)
        dl = T("1 m", size=22, color=SKY).next_to(diam, UP, buff=0.05)
        self.play(ShowCreation(line), FadeIn(labs), FadeIn(wheel))
        self.play(GrowFromCenter(diam), FadeIn(dl))
        self.play(FadeOut(diam), FadeOut(dl))
        trail = TracedPath(lambda: wheel[1].get_end(), stroke_color=CORAL, stroke_width=3)
        self.add(trail)
        base = wheel.copy()
        t = ValueTracker(0)
        dist = 2 * PI * r
        wheel.add_updater(lambda m: m.become(base.copy().rotate(-TAU * t.get_value()).shift(dist * t.get_value() * RIGHT)))
        self.play(t.animate.set_value(1), run_time=4, rate_func=smooth)
        wheel.clear_updaters()
        trail.clear_updaters()
        pdot = Dot(line.n2p(PI), radius=0.12).set_fill(CORAL, 1)
        self.play(GrowFromCenter(pdot))
        self.say("La rueda avanzó un poco más de tres metros. Esa distancia exacta es pi, y su decimal tampoco termina ni se repite nunca.")
        pi = M(R"\pi = 3.14159265\ldots \in \mathbb{I}", size=50, color=HONEY).move_to(2.4 * DOWN)
        self.play(Write(pi))
        self.hold()
        self.say("Hay infinitos irracionales: la raíz de tres, la raíz de diecinueve, y muchísimos más. Aparecen cada vez que medimos longitudes como diagonales o curvas.")
        others = M(R"\sqrt{3},\ \sqrt{19},\ \sqrt{30},\ \dots \in \mathbb{I}", size=44, color=CORAL).move_to(3.8 * DOWN)
        self.play(FadeIn(others, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S03_Reales(MBScene):
    def construct(self):
        self.mark("Unión: los números reales")
        self.set_header(R"\mathbb{R} = \mathbb{Q} \cup \mathbb{I}", "Reales", LAV, P_LAV)
        self.say("Ahora juntemos todo con las operaciones de la unidad de conjuntos. Si unimos los racionales y los irracionales, obtenemos todos los números que usamos para medir: los números reales.", fox=True)
        R = RoundedRectangle(7.0, 4.4, corner_radius=0.3).set_stroke(LAV, 4).set_fill(LAV, 0.08).move_to(1.4 * UP)
        divider = Line(R.get_top() + 1.0 * RIGHT, R.get_bottom() + 1.0 * RIGHT).set_stroke(MUTED, 3)
        lr = M(R"\mathbb{R}", size=48, color=LAV).next_to(R.get_corner(UL), DR, buff=0.15)
        lq = M(R"\mathbb{Q}", size=44, color=MINT).move_to(R.get_center() + 1.4 * LEFT + 1.5 * UP)
        li = M(R"\mathbb{I}", size=44, color=CORAL).move_to(R.get_center() + 2.4 * RIGHT + 1.5 * UP)
        qnums = VGroup(M(R"-3", size=36), M(R"\tfrac34", size=36), M(R"0.\overline{18}", size=36), M(R"7", size=36)).arrange_in_grid(2, 2, buff=0.4).move_to(R.get_center() + 1.4 * LEFT + 0.1 * DOWN)
        inums = VGroup(M(R"\sqrt2", size=36), M(R"\pi", size=36), M(R"\sqrt3", size=36)).arrange(DOWN, buff=0.35).move_to(R.get_center() + 2.4 * RIGHT + 0.1 * DOWN)
        self.play(ShowCreation(R), FadeIn(lr))
        self.play(ShowCreation(divider), FadeIn(lq), FadeIn(li))
        self.play(LaggedStartMap(FadeIn, qnums, lag_ratio=0.2), LaggedStartMap(FadeIn, inums, lag_ratio=0.2))
        u = M(R"\mathbb{R} = \mathbb{Q} \cup \mathbb{I}", size=56).move_to(1.6 * DOWN)
        self.play(Write(u))
        self.say("Los reales son la unión: todo número que es racional o irracional.")
        self.hold()
        self.say("Y, ¿qué tienen en común los racionales y los irracionales? Nada. Un número es fracción o no lo es: no puede ser las dos cosas. Su intersección es vacía: son disjuntos.")
        n = M(R"\mathbb{Q} \cap \mathbb{I} = \varnothing", size=56, color=CORAL).move_to(3.0 * DOWN)
        self.play(Write(n), Indicate(divider, color=CORAL))
        self.hold(0.6)
        self.end_section()


class S04_Mapa(MBScene):
    def construct(self):
        self.mark("El mapa de los números")
        self.set_header(R"\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}", "El mapa completo", LAV, P_LAV)
        self.say("Este es el mapa completo de los números, armado con diagramas de Venn. Los reales lo contienen todo.", fox=True)
        R = RoundedRectangle(7.2, 7.0, corner_radius=0.3).set_stroke(LAV, 4).set_fill(LAV, 0.06).move_to(0.6 * UP)
        divider = Line(R.get_top() + 1.6 * RIGHT, R.get_bottom() + 1.6 * RIGHT).set_stroke(MUTED, 3)
        Q = RoundedRectangle(4.6, 6.4, corner_radius=0.3).set_stroke(MINT, 3).set_fill(MINT, 0.06).move_to(R.get_center() + 1.15 * LEFT)
        Z = Ellipse(width=3.8, height=4.0).set_stroke(SKY, 3).set_fill(SKY, 0.08).move_to(Q.get_center() + 0.6 * DOWN)
        N = Ellipse(width=2.2, height=2.0).set_stroke(HONEY, 3).set_fill(HONEY, 0.1).move_to(Z.get_center() + 0.7 * DOWN)
        labels = VGroup(
            M(R"\mathbb{R}", size=44, color=LAV).next_to(R.get_corner(UR), DL, buff=0.15),
            M(R"\mathbb{Q}", size=40, color=MINT).next_to(Q.get_corner(UL), DR, buff=0.15),
            M(R"\mathbb{Z}", size=36, color=SKY).move_to(Z.get_top() + 0.35 * DOWN),
            M(R"\mathbb{N}", size=32, color=HONEY).move_to(N.get_top() + 0.3 * DOWN),
            M(R"\mathbb{I}", size=40, color=CORAL).move_to(R.get_center() + 2.6 * RIGHT + 2.9 * UP),
        )
        self.play(ShowCreation(R), FadeIn(labels[0]))
        self.play(ShowCreation(divider), FadeIn(labels[4]))
        self.play(ShowCreation(Q), FadeIn(labels[1]))
        self.play(ShowCreation(Z), FadeIn(labels[2]))
        self.play(ShowCreation(N), FadeIn(labels[3]))
        pts = [
            (R"8", N.get_center() + 0.2 * DOWN, HONEY, "Ocho sirve para contar: va en el centro, en los naturales, y por eso está también en los enteros, los racionales y los reales."),
            (R"-6", Z.get_center() + 1.2 * UP, SKY, "Menos seis es entero pero no natural: va en los enteros, afuera de los naturales."),
            (R"\tfrac25", Q.get_center() + 2.3 * UP, MINT, "Dos quintos es racional pero no entero: va en los racionales, afuera de los enteros."),
            (R"\sqrt3", R.get_center() + 2.6 * RIGHT + 0.6 * UP, CORAL, "Raíz de tres no es fracción: va del lado de los irracionales."),
        ]
        for tex, at, col, s in pts:
            self.say(s)
            self.play(FadeIn(M(tex, size=40, color=col).move_to(at), scale=1.4))
            self.hold()
        self.say("Cada número tiene una sola casa, la más pequeña donde cabe, pero también vive en todas las bolsas que la contienen.")
        chain = M(R"\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R} \qquad \mathbb{I} \subseteq \mathbb{R}", size=40).move_to(3.9 * DOWN)
        chain.set_max_width(7.2)
        self.play(Write(chain))
        self.hold(0.6)
        self.end_section()


class S05_Recta(MBScene):
    def construct(self):
        self.mark("La recta real")
        self.set_header(R"\mathbb{R}", "La recta real", SKY, P_SKY)
        self.say("Los números reales llenan por completo la recta: a cada punto le corresponde un número real, y a cada número real, un punto. Por eso se llama la recta real.", fox=True)
        line = get_number_line((-3, 4, 1), width=7.2, numbers=False).move_to(3.0 * UP)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=22, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.18) for k in range(-3, 5)])
        self.play(ShowCreation(line), FadeIn(labs))
        pts = [(-2.5, R"-\tfrac52", SKY), (0.75, R"\tfrac34", MINT), (np.sqrt(2), R"\sqrt2", CORAL), (PI, R"\pi", HONEY)]
        for v, tex, col in pts:
            d = Dot(line.n2p(v), radius=0.1).set_fill(col, 1)
            l = M(tex, size=34, color=col).next_to(d, UP, buff=0.2)
            self.play(GrowFromCenter(d), FadeIn(l), run_time=0.6)
        self.hold()
        self.end_section()
        self.mark("Siempre hay otro en medio")
        self.say("¿Hay huecos en la recta? No. Entre dos números reales distintos siempre cabe otro, por ejemplo el que está justo en la mitad. Miremos entre uno y dos, cada vez más de cerca, con reglas apiladas.", fox=True)
        levels = [(1, 2, 0), (1.4, 1.5, 1), (1.41, 1.42, 2)]
        ys = [3.0, 0.8, -1.4]
        prev = None
        for (a, b, dec), y in zip(levels, ys):
            ln = Line(3.4 * LEFT, 3.4 * RIGHT).set_stroke(INK, 3).move_to(y * UP)
            ticks = VGroup(*[Line(ln.get_left() + j * 0.68 * RIGHT + 0.1 * DOWN, ln.get_left() + j * 0.68 * RIGHT + 0.1 * UP).set_stroke(MUTED, 2) for j in range(11)])
            la = T(f"{a:.{dec}f}", size=22, color=MUTED).next_to(ln.get_left(), DOWN, buff=0.2)
            lb = T(f"{b:.{dec}f}", size=22, color=MUTED).next_to(ln.get_right(), DOWN, buff=0.2)
            px = ln.get_left() + (np.sqrt(2) - a) / (b - a) * ln.get_length() * RIGHT
            dot = Dot(px, radius=0.09).set_fill(CORAL, 1)
            grp = VGroup(ln, ticks, la, lb, dot)
            if prev is not None:
                pa, pb = prev
                grp.add(DashedLine(pa, ln.get_left() + 0.15 * UP).set_stroke(PINK, 2), DashedLine(pb, ln.get_right() + 0.15 * UP).set_stroke(PINK, 2))
            self.play(FadeIn(grp, shift=0.3 * DOWN), run_time=1.2)
            if dec < 2:
                na, nb = levels[dec + 1][0], levels[dec + 1][1]
                xa = ln.get_left() + (na - a) / (b - a) * ln.get_length() * RIGHT
                xb = ln.get_left() + (nb - a) / (b - a) * ln.get_length() * RIGHT
                self.play(ShowCreation(Line(xa, xb).set_stroke(PINK, 8)))
                prev = (xa + 0.1 * DOWN, xb + 0.1 * DOWN)
            self.hold()
        self.say("Cada regla nueva tiene diez marcas más, y podríamos seguir para siempre. Los reales no dejan ningún hueco: por eso sirven para medir cualquier cosa.")
        mid = formula_card(R"\text{entre } a \text{ y } b \text{ est\'a } \frac{a + b}{2}", color=PINK, size=40).move_to(3.4 * DOWN)
        self.play(FadeIn(mid, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S06_Clasificar(MBScene):
    def construct(self):
        self.mark("Clasificar un número en tres preguntas")
        self.set_header(R"?", "Clasificar", MINT, P_MINT)
        self.say("Para saber a qué conjuntos pertenece un número, hazle tres preguntas, en este orden. Antes, simplifícalo: raíz de dieciséis es cuatro, y diez quintos es dos.", fox=True)
        qs = [
            ("1. ¿Se puede escribir como fracción?", "No → irracional (𝕀)", CORAL),
            ("2. Si es fracción, ¿es un número sin partes?", "Sí → entero (ℤ)  ·  No → solo racional (ℚ)", SKY),
            ("3. Si es entero, ¿es positivo?", "Sí → natural (ℕ)", HONEY),
        ]
        rows = VGroup()
        for q, a, col in qs:
            rows.add(VGroup(TB(q, size=34, color=INK), T(a, size=30, color=col)).arrange(DOWN, buff=0.12, aligned_edge=LEFT))
        rows.arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to(3.0 * UP)
        rows.set_max_width(7.2)
        for r in rows:
            self.play(FadeIn(r, shift=0.2 * RIGHT), run_time=0.8)
            self.hold()
        self.say("Por ejemplo, raíz de dieciséis: simplificada es cuatro. Es fracción, cuatro sobre uno; no tiene partes, así que es entero; y es positivo, así que es natural. Pertenece a cuatro conjuntos: naturales, enteros, racionales y reales.")
        ex = VGroup(
            M(R"\sqrt{16} = 4 \in \mathbb{N},\ \mathbb{Z},\ \mathbb{Q},\ \mathbb{R}", size=46, color=HONEY),
            M(R"-\tfrac{10}{5} = -2 \in \mathbb{Z},\ \mathbb{Q},\ \mathbb{R}", size=46, color=SKY),
            M(R"0.25 = \tfrac14 \in \mathbb{Q},\ \mathbb{R}", size=46, color=MINT),
            M(R"\sqrt{11} \in \mathbb{I},\ \mathbb{R}", size=46, color=CORAL),
        ).arrange(DOWN, buff=0.38).move_to(2.3 * DOWN)
        for m in ex:
            m.set_max_width(7.2)
        self.play(FadeIn(ex[0], shift=0.2 * UP))
        self.hold()
        self.say("Menos diez quintos es menos dos: entero, pero no natural. Cero punto veinticinco es un cuarto: racional. Y raíz de once no es exacta: irracional. Todos son reales.")
        self.play(LaggedStartMap(FadeIn, ex[1:], shift=0.2 * UP, lag_ratio=0.4), run_time=1.6)
        self.hold(0.6)
        self.end_section()


class S07_Cierre(AlgCierre):
    recap = [
        ("Irracionales", "decimal infinito sin período: √2, π", CORAL),
        ("√2", "1.4² = 1.96 < 2 < 2.0164 = 1.42²: nunca exacto", CORAL),
        ("Reales", "ℝ = ℚ ∪ 𝕀", LAV),
        ("Disjuntos", "ℚ ∩ 𝕀 = ∅: o es fracción o no lo es", LAV),
        ("El mapa", "ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ  y  𝕀 ⊆ ℝ", MINT),
        ("La recta real", "sin huecos: entre dos números siempre hay otro", SKY),
        ("Clasificar", "simplificar y preguntar: ¿fracción? ¿entero? ¿positivo?", MINT),
    ]
    recap_say = "Los reales son la unión de racionales e irracionales, que no comparten ningún número. Juntos llenan toda la recta."
    practice = "Acorrala raíces, usa el compás y la lupa"
