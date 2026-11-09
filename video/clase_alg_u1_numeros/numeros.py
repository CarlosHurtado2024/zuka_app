"""
Álgebra A1 · Sistemas numéricos y números reales (lección alg-11, un solo video, 9:16, fondo morado vivo).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Cada familia nace de un problema:
contar (ℕ), restar más de lo que hay (ℤ, termómetro), repartir (ℚ, 7 chocolates entre 4), decimales que
terminan o se repiten (los residuos de 2/7 vuelven: zoom), periódico a fracción (0.8181… = 9/11), medir
(la diagonal del cuadrado, √2, con compás sobre la recta; el cubo en 3D con su diagonal √3; π rodando), el
pastel 3D de las familias y la lupa que muestra que entre dos números siempre hay otro.
Spec 2026-11-09-algebra-unidad-1-videos-y-juegos.

    manimgl numeros.py S05_Medir -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 1"
    title = "Sistemas numéricos\ny números reales"
    subtitle = "Cada problema nuevo inventa números nuevos"


class S01_Contar(MBScene):
    def construct(self):
        self.mark("Contar: los naturales")
        self.set_header(R"\mathbb{N}", "Naturales", HONEY, P_HONEY)
        self.say("Los primeros números nacieron para contar: una oveja, dos ovejas, tres ovejas. Son los números naturales.", fox=True)
        sheep = VGroup(*[Circle(radius=0.32).set_fill(INK, 1).set_stroke(MUTED, 2) for _ in range(5)])
        sheep.arrange(RIGHT, buff=0.35).move_to(3.4 * UP)
        nums = VGroup(*[TB(str(k + 1), size=34, color=HONEY).next_to(s, DOWN, buff=0.25) for k, s in enumerate(sheep)])
        for s, n in zip(sheep, nums):
            self.play(GrowFromCenter(s), FadeIn(n, shift=0.2 * UP), run_time=0.45)
        line = get_number_line((0, 8, 1), width=7.0, numbers=False).move_to(0.6 * DOWN)
        dots = VGroup(*[Dot(line.n2p(k), radius=0.11).set_fill(HONEY, 1) for k in range(1, 8)])
        labels = VGroup(*[TB(str(k), size=28, color=HONEY).next_to(line.n2p(k), DOWN, buff=0.22) for k in range(1, 8)])
        self.play(ShowCreation(line))
        self.play(LaggedStart(*[TransformFromCopy(n, l) for n, l in zip(nums, labels[:5])], lag_ratio=0.15),
                  LaggedStartMap(GrowFromCenter, dots, lag_ratio=0.15), FadeIn(labels[5:]), run_time=1.6)
        self.hold()
        self.say("Empiezan en uno y nunca se acaban: después de cada natural siempre viene otro, sumándole uno.")
        hop = VGroup(*[ArcBetweenPoints(line.n2p(k), line.n2p(k + 1), angle=-PI / 2).set_stroke(PINK, 3) for k in range(1, 7)])
        self.play(LaggedStartMap(ShowCreation, hop, lag_ratio=0.25), run_time=2)
        notation = get_notation(R"\mathbb{N} = \{1, 2, 3, \dots\}", "los números para contar", color=HONEY).move_to(3.3 * DOWN)
        self.play(FadeIn(notation, shift=0.2 * UP))
        self.hold(0.4)
        self.say("Sumar o multiplicar dos naturales siempre da otro natural. Pero restar no: tres menos siete no se puede contar con ovejas.")
        self.play(FadeOut(hop))
        sub = formula_card(R"3 - 7 = \, ?", color=CORAL).move_to(1.8 * UP)
        self.play(FadeIn(sub, scale=0.9))
        self.play(WiggleOutThenIn(sub))
        self.hold(0.4)
        self.end_section()


class S02_Enteros(MBScene):
    def construct(self):
        self.mark("Restar: los enteros")
        self.set_header(R"\mathbb{Z}", "Enteros", SKY, P_SKY)
        self.say("Un termómetro marca cuatro grados y la temperatura baja nueve. Pasa el cero y sigue bajando: termina en menos cinco.", fox=True)
        # Termómetro vertical de -6 a 6
        tube = RoundedRectangle(0.7, 8.4, corner_radius=0.35).set_fill(CARD, 1).set_stroke(MUTED, 3).move_to(0.2 * UP + 1.6 * LEFT)
        bulb = Circle(radius=0.6).set_fill(CORAL, 1).set_stroke(MUTED, 3).next_to(tube, DOWN, buff=-0.25)
        scale_line = NumberLine((-6, 6, 1), width=7.6, include_tip=False, tick_size=0.1).rotate(PI / 2)
        scale_line.set_stroke(MUTED, 2).next_to(tube, RIGHT, buff=0.15)
        ticks = VGroup()
        for k in range(-6, 7):
            col = SKY if k < 0 else HONEY if k > 0 else INK
            ticks.add(T(str(k).replace("-", "−"), size=24, color=col).next_to(scale_line.n2p(k), RIGHT, buff=0.18))
        temp = ValueTracker(4)

        def mercury():
            top = scale_line.n2p(temp.get_value())
            bottom = bulb.get_center()
            return Rectangle(0.36, max(top[1] - bottom[1], 0.01)).set_fill(CORAL, 1).set_stroke(width=0).move_to((top + bottom) / 2 + (tube.get_center()[0] - (top + bottom)[0] / 2) * RIGHT)

        merc = always_redraw(mercury)
        reading = always_redraw(lambda: TB(f"{round(temp.get_value())}°".replace("-", "−"), size=56,
                                           color=SKY if temp.get_value() < -0.5 else HONEY).move_to(2.2 * RIGHT + 2.5 * UP))
        self.play(FadeIn(tube), FadeIn(bulb), ShowCreation(scale_line), FadeIn(ticks))
        self.add(merc, reading)
        self.wait(0.5)
        self.play(temp.animate.set_value(-5), run_time=4, rate_func=linear)
        self.hold()
        res = formula_card(R"4 - 9 = -5", color=SKY).move_to(2.2 * RIGHT + 0.6 * DOWN)
        res.set_max_width(3.6)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.hold()
        self.end_section()
        self.mark("La recta con negativos")
        self.say("Los enteros agregan el cero y los negativos, que son el reflejo de los naturales al otro lado del cero.")
        line = get_number_line((-6, 6, 1), width=7.4, numbers=False).move_to(1.5 * UP)
        pos = VGroup(*[Dot(line.n2p(k), radius=0.1).set_fill(HONEY, 1) for k in range(1, 7)])
        neg = VGroup(*[Dot(line.n2p(-k), radius=0.1).set_fill(SKY, 1) for k in range(1, 7)])
        zero = Dot(line.n2p(0), radius=0.12).set_fill(INK, 1)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=24, color=SKY if k < 0 else HONEY if k else INK).next_to(line.n2p(k), DOWN, buff=0.2) for k in range(-6, 7)])
        self.play(ShowCreation(line), FadeIn(pos), FadeIn(zero), FadeIn(labs[6:]))
        mirror = DashedLine(line.n2p(0) + 1.2 * UP, line.n2p(0) + 1.0 * DOWN).set_stroke(PINK, 3)
        self.play(ShowCreation(mirror))
        self.play(LaggedStart(*[TransformFromCopy(pos[k], neg[k], path_arc=PI / 2) for k in range(6)], lag_ratio=0.12),
                  FadeIn(labs[:6]), run_time=2.2)
        self.hold()
        self.say("Un número y su opuesto quedan a la misma distancia del cero, y juntos suman cero.")
        a, b = line.n2p(3), line.n2p(-3)
        br1 = Brace(Line(line.n2p(0), a), UP).set_color(HONEY)
        br2 = Brace(Line(b, line.n2p(0)), UP).set_color(SKY)
        self.play(GrowFromCenter(br1), GrowFromCenter(br2))
        eq = formula_card(R"3 + (-3) = 0", color=PINK).move_to(1.0 * DOWN)
        self.play(FadeIn(eq, shift=0.2 * UP))
        notation = get_notation(R"\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}", "naturales, el cero y los negativos", color=SKY).move_to(3.6 * DOWN)
        self.play(FadeIn(notation, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_Repartir(MBScene):
    def construct(self):
        self.mark("Repartir: los racionales")
        self.set_header(R"\mathbb{Q}", "Racionales", MINT, P_MINT)
        self.say("Ahora hay que repartir siete chocolates entre cuatro amigos. A cada uno le toca uno entero y sobran tres, que se parten en cuartos.", fox=True)
        bars = VGroup()
        for k in range(7):
            bar = VGroup(*[Rectangle(0.42, 0.9).set_fill("#7A4A2A", 1).set_stroke("#3A2414", 2) for _ in range(4)]).arrange(RIGHT, buff=0)
            bars.add(bar)
        bars.arrange_in_grid(2, 4, buff=0.35).move_to(3.2 * UP)
        self.play(LaggedStartMap(FadeIn, bars, shift=0.2 * DOWN, lag_ratio=0.1), run_time=1.4)
        kids = VGroup(*[Circle(radius=0.4).set_fill(c, 1).set_stroke(width=0) for c in (HONEY, SKY, MINT, PINK)]).arrange(RIGHT, buff=1.2).move_to(0.6 * DOWN)
        plates = VGroup(*[RoundedRectangle(1.5, 1.3, corner_radius=0.2).set_fill(CARD, 1).set_stroke(BORDER, 2).next_to(k, DOWN, buff=0.25) for k in kids])
        self.play(FadeIn(kids), FadeIn(plates))
        self.bring_to_front(bars)
        # Un chocolate entero para cada uno
        moves = []
        for i in range(4):
            moves.append(bars[i].animate.scale(0.55).move_to(plates[i].get_center() + 0.25 * UP))
        self.play(*moves, run_time=1.4)
        self.hold()
        # Los tres que sobran: cada uno se parte en cuartos y cada amigo recibe un cuarto de cada uno
        anims = []
        for j in range(3):
            for i in range(4):
                piece = bars[4 + j][i]
                anims.append(piece.animate.scale(0.55).move_to(plates[i].get_center() + 0.3 * DOWN + (j - 1) * 0.3 * RIGHT))
        self.play(LaggedStart(*anims, lag_ratio=0.05), run_time=2.4)
        share = formula_card(R"7 \div 4 = 1 + \tfrac{3}{4} = \tfrac{7}{4} = 1.75", color=MINT).move_to(3.6 * DOWN)
        self.play(FadeIn(share, shift=0.2 * UP))
        self.hold()
        self.end_section()
        self.mark("Fracciones de enteros")
        self.say("Un número racional es el que se puede escribir como una fracción de dos enteros, con el de abajo distinto de cero.")
        notation = get_notation(R"\mathbb{Q} = \left\{ \tfrac{m}{n} : m, n \in \mathbb{Z},\ n \neq 0 \right\}", "fracciones de enteros", color=MINT).move_to(2.6 * UP)
        self.play(FadeIn(notation, shift=0.2 * UP))
        self.hold()
        self.say("Todo entero también es racional: menos cinco es menos cinco sobre uno. Por eso cada familia queda dentro de la siguiente.")
        ex = M(R"-5 = \frac{-5}{1} = \frac{-10}{2} = \frac{15}{-3}", size=48).move_to(0.1 * DOWN)
        self.play(Write(ex))
        nest = M(R"\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}", size=72).move_to(2.6 * DOWN)
        self.play(FadeIn(nest, scale=1.2))
        self.hold()
        self.say("¿Y dividir entre cero? Repartir siete chocolates entre cero amigos no tiene sentido: por eso el denominador nunca es cero.")
        nope = M(R"\frac{7}{0}", size=80, color=CORAL).move_to(2.6 * DOWN)
        cross = ex_mark(CORAL, 90).next_to(nope, RIGHT, buff=0.4)
        self.play(FadeOut(nest), FadeIn(nope), FadeIn(cross, scale=0.5))
        self.hold(0.5)
        self.end_section()


class S04_Decimales(MBScene):
    def construct(self):
        self.mark("Decimales que terminan")
        self.set_header(R"0.\overline{3}", "Decimales", MINT, P_MINT)
        self.say("Al dividir, el decimal de una fracción hace una de dos cosas: o termina, o empieza a repetirse para siempre.", fox=True)
        t1 = M(R"\frac{7}{4} = 1.75", size=60).move_to(3.6 * UP)
        t2 = M(R"\frac{13}{20} = 0.65", size=60).move_to(2.2 * UP)
        self.play(Write(t1))
        self.play(Write(t2))
        self.hold()
        self.say("Termina cuando el denominador solo tiene doses y cincos, porque entonces se completa una potencia de diez.")
        f1 = M(R"\frac{13}{20} = \frac{13 \cdot 5}{2^2 \cdot 5 \cdot 5} = \frac{65}{100}", size=46, t2c={"100": HONEY}).move_to(0.4 * UP)
        self.play(FadeIn(f1, shift=0.2 * UP))
        self.hold()
        self.end_section()
        self.mark("Los residuos vuelven")
        self.say("Mira la división de dos entre siete. Cada paso deja un residuo, y el residuo siempre es menor que siete.")
        digits = "285714"
        rems = [6, 4, 5, 1, 3, 2]
        head = M(R"\frac{2}{7} = 0.\ldots", size=56).move_to(3.7 * UP)
        self.play(Write(head))
        cells = VGroup()
        for k in range(12):
            d = TB(digits[k % 6], size=44, color=MINT)
            r = T(str(rems[k % 6]), size=26, color=MUTED)
            cells.add(VGroup(d, r).arrange(DOWN, buff=0.22))
        cells.arrange(RIGHT, buff=0.2).set_max_width(7.2).move_to(1.9 * UP)
        caption = T("residuos", size=22, color=MUTED).next_to(cells, DOWN, buff=0.2).align_to(cells, LEFT)
        for k in range(6):
            self.play(FadeIn(cells[k], shift=0.15 * DOWN), run_time=0.45)
        self.play(FadeIn(caption))
        self.hold()
        self.say("Hay solo seis residuos posibles. Al séptimo paso vuelve un residuo que ya salió, y desde ahí las cifras se repiten en el mismo orden.")
        self.play(FadeIn(cells[6], shift=0.15 * DOWN))
        ring1 = SurroundingRectangle(cells[0][1], buff=0.08).set_stroke(PINK, 3)
        ring2 = SurroundingRectangle(cells[6][1], buff=0.08).set_stroke(PINK, 3)
        self.play(ShowCreation(ring1), ShowCreation(ring2))
        self.zoom_to(VGroup(cells[0], cells[6]), scale=0.4)
        self.hold()
        self.play(LaggedStartMap(FadeIn, cells[7:], shift=0.15 * DOWN, lag_ratio=0.2), run_time=1.6)
        self.zoom_reset()
        bar = M(R"\frac{2}{7} = 0.\overline{285714}", size=64, color=INK).move_to(0.4 * DOWN)
        self.play(FadeIn(bar, shift=0.2 * UP))
        self.say("La rayita encima marca el bloque que se repite: se llama período.")
        brace = Brace(bar[-6:], DOWN).set_color(PINK)
        per = T("período", size=28, color=PINK).next_to(brace, DOWN, buff=0.15)
        self.play(GrowFromCenter(brace), FadeIn(per))
        self.hold()
        self.say("A veces el período no empieza enseguida: siete doceavos es cero punto cincuenta y ocho, y luego el tres se repite sin fin.")
        mix = M(R"\frac{7}{12} = 0.58\overline{3}", size=60).move_to(3.4 * DOWN)
        self.play(Write(mix))
        self.hold(0.5)
        self.end_section()


class S05_Periodico(MBScene):
    def construct(self):
        self.mark("De periódico a fracción")
        self.set_header(R"0.\overline{81}", "Periódico a fracción", PINK, P_PINK)
        self.say("Y al revés: todo decimal periódico viene de una fracción. El truco es correr la coma para que las colas infinitas queden alineadas.", fox=True)
        x = M(R"x = 0.818181\ldots", size=54).move_to(3.6 * UP)
        self.play(Write(x))
        self.hold()
        self.say("El período tiene dos cifras, así que multiplicamos por cien: la coma salta dos lugares.")
        x100 = M(R"100x = 81.818181\ldots", size=54).next_to(x, DOWN, buff=0.6)
        x100.align_to(x, RIGHT)
        self.play(TransformFromCopy(x, x100), run_time=1.4)
        tail1 = SurroundingRectangle(x[-9:], buff=0.06).set_stroke(MINT, 3)
        tail2 = SurroundingRectangle(x100[-9:], buff=0.06).set_stroke(MINT, 3)
        self.play(ShowCreation(tail1), ShowCreation(tail2))
        self.hold()
        self.say("Al restar, las colas iguales se borran y queda una ecuación sin infinitos.")
        line = Line(LEFT, RIGHT).set_width(5.5).set_stroke(MUTED, 2).next_to(x100, DOWN, buff=0.3)
        res = M(R"99x = 81", size=58, color=HONEY).next_to(line, DOWN, buff=0.35)
        self.play(ShowCreation(line))
        self.play(FadeOut(tail1), FadeOut(tail2), FadeIn(res, shift=0.2 * UP))
        self.hold()
        final = formula_card(R"x = \frac{81}{99} = \frac{9}{11}", color=PINK, size=60).move_to(1.6 * DOWN)
        self.play(FadeIn(final, scale=0.9))
        self.say("Compruébalo: nueve entre once da exactamente cero punto ochenta y uno, ochenta y uno, ochenta y uno.")
        self.hold()
        rule = note("Período de 1 cifra → ×10\nPeríodo de 2 cifras → ×100", color=HONEY).move_to(4.0 * DOWN)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S06_Medir(MBScene):
    def construct(self):
        self.mark("Medir: la diagonal")
        self.set_header(R"\sqrt{2}", "Irracionales", CORAL, P_CORAL)
        self.say("Los griegos midieron la diagonal de un cuadrado de lado uno. Por Pitágoras, su cuadrado vale uno más uno: dos.", fox=True)
        unit = 2.2
        sq = Square(unit).set_fill(P_LAV, 1).set_stroke(LAV, 3).move_to(2.6 * UP)
        diag = Line(sq.get_corner(DL), sq.get_corner(UR)).set_stroke(CORAL, 6)
        s1 = M("1", size=40, color=LAV).next_to(sq, DOWN, buff=0.15)
        s2 = M("1", size=40, color=LAV).next_to(sq, LEFT, buff=0.15)
        self.play(ShowCreation(sq), FadeIn(s1), FadeIn(s2))
        self.play(ShowCreation(diag))
        eq = M(R"d^2 = 1^2 + 1^2 = 2", size=48).next_to(sq, RIGHT, buff=0.3).shift(0.4 * UP)
        eq.set_max_width(3.4)
        eq.next_to(sq, DOWN, buff=0.7)
        self.play(Write(eq))
        self.hold()
        self.say("Ninguna fracción da dos al elevarla al cuadrado. Siete quintos se queda corto y diecisiete doceavos se pasa por poquito.")
        tries = VGroup(
            M(R"\left(\tfrac{7}{5}\right)^2 = 1.96", size=40, color=SKY),
            M(R"\left(\tfrac{17}{12}\right)^2 = 2.0069\ldots", size=40, color=CORAL),
        ).arrange(DOWN, buff=0.3).next_to(eq, DOWN, buff=0.5)
        self.play(LaggedStartMap(FadeIn, tries, shift=0.2 * UP, lag_ratio=0.5), run_time=1.4)
        self.hold()
        self.say("Por más que se busque, nunca hay una fracción exacta: la diagonal es un número irracional, raíz de dos.")
        self.play(FadeOut(tries), FadeOut(eq))
        line = get_number_line((-1, 3, 1), unit_size=unit, numbers=False).move_to(1.6 * DOWN)
        line.shift((sq.get_corner(DL)[0] - line.n2p(0)[0]) * RIGHT)
        labs = VGroup(*[T(str(k).replace("-", "−"), size=26, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.2) for k in range(-1, 4)])
        self.play(ShowCreation(line), FadeIn(labs))
        self.play(sq.animate.shift((line.n2p(0)[1] - sq.get_bottom()[1]) * UP), diag.animate.shift((line.n2p(0)[1] - sq.get_bottom()[1]) * UP),
                  FadeOut(s1), s2.animate.shift((line.n2p(0)[1] - sq.get_bottom()[1]) * UP))
        self.say("Con un compás clavado en el cero, la diagonal gira hasta acostarse sobre la recta. Cae en un punto exacto: raíz de dos.")
        pivot = line.n2p(0)
        arc = always_redraw(lambda: Arc(start_angle=PI / 4, angle=diag.get_angle() - PI / 4, radius=unit * np.sqrt(2), arc_center=pivot).set_stroke(CORAL, 2, opacity=0.7))
        self.add(arc)
        self.play(Rotate(diag, -PI / 4, about_point=pivot), run_time=2.4)
        arc.clear_updaters()
        mark = Dot(line.n2p(np.sqrt(2)), radius=0.12).set_fill(CORAL, 1)
        lab = M(R"\sqrt{2}", size=44, color=CORAL).next_to(mark, UP, buff=0.25)
        self.play(GrowFromCenter(mark), FadeIn(lab, shift=0.2 * DOWN))
        self.zoom_to(VGroup(mark, lab, labs[2], labs[3]), scale=0.35)
        approx = M(R"\sqrt{2} = 1.41421356\ldots", size=22, color=INK).next_to(mark, DOWN, buff=0.55)
        self.play(FadeIn(approx))
        self.say("Su decimal no termina y nunca repite un bloque. Aun así tiene un lugar exacto en la recta.")
        self.hold()
        self.zoom_reset()
        self.end_section()


class S07_Cubo(MBScene):
    def construct(self):
        self.mark("La diagonal del cubo")
        self.set_header(R"\sqrt{3}", "En 3D", CORAL, P_CORAL)
        self.say("Pasemos a tres dimensiones: un cubo de lado uno. La diagonal de una cara mide raíz de dos.", fox=True)
        s = 3.0
        cube = Cube(side_length=s).set_color(LAV).set_opacity(0.18)
        corners = [np.array([x, y, z]) * s / 2 for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
        edges = VGroup()
        for i, a in enumerate(corners):
            for b in corners[i + 1:]:
                if np.isclose(np.linalg.norm(a - b), s):
                    edges.add(Line(a, b).set_stroke(LAV, 3))
        g = Group(cube, edges).move_to(0.6 * UP)
        c = g.get_center()
        A = c + np.array([-1, -1, -1]) * s / 2
        B = c + np.array([1, 1, -1]) * s / 2
        Cc = c + np.array([1, 1, 1]) * s / 2
        face_d = Line(A, B).set_stroke(PINK, 6)
        edge_up = Line(B, Cc).set_stroke(HONEY, 6)
        space_d = Line(A, Cc).set_stroke(CORAL, 7)
        self.play(FadeIn(cube), ShowCreation(edges), self.frame.animate.reorient(-30, 65), run_time=2.2)
        self.play(ShowCreation(face_d))
        l1 = flat(M(R"\text{cara: } \sqrt{1^2 + 1^2} = \sqrt{2}", size=40, color=PINK).move_to(3.2 * DOWN))
        self.play(FadeIn(l1))
        self.hold()
        self.say("Desde ese extremo se sube una arista de largo uno. La diagonal del cubo es la hipotenusa de ese triángulo.")
        self.play(ShowCreation(edge_up))
        self.play(ShowCreation(space_d), run_time=1.6)
        l2 = flat(M(R"\text{cubo: } \sqrt{\left(\sqrt{2}\right)^2 + 1^2} = \sqrt{3}", size=40, color=CORAL).move_to(4.2 * DOWN))
        self.play(FadeIn(l2))
        self.frame.add_updater(lambda f, dt: f.increment_theta(-0.25 * dt))
        self.hold(1.5)
        self.say("Raíz de tres tampoco es una fracción. Los irracionales aparecen en cuanto uno se pone a medir.")
        self.hold(1.0)
        self.frame.clear_updaters()
        self.play(self.frame.animate.reorient(0, 0), run_time=1.6)
        self.end_section()
        self.mark("Pi rueda")
        self.say("Otro irracional famoso: una rueda de diámetro uno da una vuelta completa y avanza exactamente pi.", fox=True)
        line = get_number_line((0, 4, 1), unit_size=1.6, numbers=False).move_to(1.8 * DOWN)
        labs = VGroup(*[T(str(k), size=26, color=MUTED).next_to(line.n2p(k), DOWN, buff=0.2) for k in range(0, 5)])
        r = 0.8
        wheel = VGroup(Circle(radius=r).set_stroke(HONEY, 5), Line(ORIGIN, r * DOWN).set_stroke(CORAL, 4), Dot(radius=0.06).set_fill(INK, 1))
        wheel.move_to(line.n2p(0) + r * UP)
        self.play(ShowCreation(line), FadeIn(labs), FadeIn(wheel))
        trail = TracedPath(lambda: wheel[1].get_end(), stroke_color=CORAL, stroke_width=3)
        self.add(trail)
        dist = 2 * PI * r
        base = wheel.copy()
        t = ValueTracker(0)
        wheel.add_updater(lambda m: m.become(base.copy().rotate(-TAU * t.get_value()).shift(dist * t.get_value() * RIGHT)))
        self.play(t.animate.set_value(1), run_time=3.2, rate_func=smooth)
        wheel.clear_updaters()
        trail.clear_updaters()
        pdot = Dot(line.n2p(PI), radius=0.12).set_fill(CORAL, 1)
        plab = M(R"\pi = 3.14159\ldots", size=40, color=CORAL).next_to(pdot, DOWN, buff=0.7)
        self.play(GrowFromCenter(pdot), FadeIn(plab))
        self.hold(0.5)
        self.end_section()


class S08_Reales(MBScene):
    def construct(self):
        self.mark("El pastel de los reales")
        self.set_header(R"\mathbb{R}", "Números reales", LAV, P_LAV)
        self.say("Racionales e irracionales juntos forman los números reales. Cada familia queda dentro de la siguiente, como los pisos de un pastel.", fox=True)
        layers = [(3.3, LAV, R"\mathbb{R}"), (2.5, MINT, R"\mathbb{Q}"), (1.7, SKY, R"\mathbb{Z}"), (0.9, HONEY, R"\mathbb{N}")]
        cake = Group()
        h = 0.55
        for k, (rad, col, _) in enumerate(layers):
            cyl = Cylinder(radius=rad, height=h, resolution=(64, 2)).set_color(col)
            top = Disk3D(radius=rad, resolution=(2, 64)).set_color(col).shift(h / 2 * OUT)
            layer = Group(cyl, top).shift((k * h + h / 2) * OUT)
            layer.set_shading(0.3, 0.4, 0.2)
            cake.add(layer)
        cake.move_to(0.4 * DOWN)
        self.frame.reorient(0, 62)
        self.play(LaggedStart(*[FadeIn(l, shift=0.6 * OUT) for l in cake], lag_ratio=0.35), run_time=2.4)
        names = VGroup(*[flat(M(tex, size=44, color=col)) for _, col, tex in layers])
        words = ["reales", "racionales", "enteros", "naturales"]
        legend = VGroup()
        for n, w, (_, col, _) in zip(names, words, layers):
            legend.add(VGroup(n, T(w, size=26, color=col)).arrange(RIGHT, buff=0.25))
        legend.arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to(3.6 * DOWN)
        for m in legend:
            m.fix_in_frame()
        self.play(LaggedStartMap(FadeIn, legend, lag_ratio=0.2))
        self.frame.add_updater(lambda f, dt: f.increment_theta(0.3 * dt))
        self.hold(1.0)
        self.say("Los irracionales viven en el piso de abajo, en la parte de los reales que no es racional.")
        irr = flat(note("𝕀 = ℝ sin ℚ:  √2,  √3,  π", color=CORAL).move_to(4.3 * UP))
        irr.fix_in_frame()
        self.play(FadeIn(irr))
        self.hold(1.0)
        self.frame.clear_updaters()
        self.play(self.frame.animate.reorient(0, 0), FadeOut(cake), run_time=1.4)
        self.end_section()


class S09_Lupa(MBScene):
    def construct(self):
        self.mark("La lupa: siempre hay otro")
        self.set_header(R"\mathbb{R}", "La recta sin huecos", LAV, P_LAV)
        self.say("Los reales llenan la recta sin dejar huecos. Pongamos la lupa sobre raíz de dos y acerquémonos.", fox=True)
        target = np.sqrt(2)
        levels = [(1, 2), (1.4, 1.5), (1.41, 1.42), (1.414, 1.415)]
        ys = [3.6, 1.2, -1.2, -3.6]
        groups = []
        prev = None
        for k, ((a, b), y) in enumerate(zip(levels, ys)):
            line = Line(3.4 * LEFT, 3.4 * RIGHT).set_stroke(INK, 3).move_to(y * UP)
            ticks = VGroup()
            for j in range(11):
                x = line.get_left() + j * line.get_length() / 10 * RIGHT
                ticks.add(Line(x + 0.1 * DOWN, x + 0.1 * UP).set_stroke(MUTED, 2 if j % 5 else 3))
            fmt = f"{{:.{k}f}}" if k else "{:.0f}"
            la = T(fmt.format(a), size=24, color=MUTED).next_to(line.get_left(), DOWN, buff=0.22)
            lb = T(fmt.format(b), size=24, color=MUTED).next_to(line.get_right(), DOWN, buff=0.22)
            px = line.get_left() + (target - a) / (b - a) * line.get_length() * RIGHT
            pt = Dot(px, radius=0.1).set_fill(CORAL, 1)
            grp = VGroup(line, ticks, la, lb, pt)
            if prev is not None:
                pa, pb = prev
                funnel = VGroup(DashedLine(pa, line.get_left() + 0.15 * UP), DashedLine(pb, line.get_right() + 0.15 * UP)).set_stroke(PINK, 2)
                grp.add(funnel)
            # el tramo que se ampliará en el siguiente nivel
            if k + 1 < len(levels):
                na, nb = levels[k + 1]
                xa = line.get_left() + (na - a) / (b - a) * line.get_length() * RIGHT
                xb = line.get_left() + (nb - a) / (b - a) * line.get_length() * RIGHT
                seg = Line(xa, xb).set_stroke(PINK, 8)
                grp.add(seg)
                prev = (xa + 0.1 * DOWN, xb + 0.1 * DOWN)
            groups.append(grp)
        self.play(ShowCreation(groups[0][0]), FadeIn(groups[0][1:]))
        self.hold()
        self.say("Cada vez que se amplía un tramo aparece otra regla completa, con diez marcas nuevas. Y se puede seguir para siempre.")
        for g in groups[1:]:
            self.play(FadeIn(g, shift=0.3 * DOWN), run_time=1.3)
        self.zoom_to(groups[3], scale=0.55)
        self.hold()
        self.zoom_reset()
        self.say("Entre dos números distintos siempre cabe otro: por ejemplo, su promedio. Entre uno punto cuatro uno cuatro y uno punto cuatro uno cinco está uno punto cuatro uno cuatro cinco.")
        mid = formula_card(R"\frac{1.414 + 1.415}{2} = 1.4145", color=PINK, size=40).move_to(5.0 * DOWN)
        mid.set_max_width(7.0)
        self.play(FadeIn(mid, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S10_Cierre(AlgCierre):
    recap = [
        ("ℕ  contar", "1, 2, 3, … sin final", HONEY),
        ("ℤ  restar", "el cero y los negativos: 4 − 9 = −5", SKY),
        ("ℚ  repartir", "fracciones m/n con n ≠ 0: el decimal termina o se repite", MINT),
        ("Periódico → fracción", "0.8181… = 81/99 = 9/11", PINK),
        ("𝕀  medir", "√2, √3, π: decimales sin período", CORAL),
        ("ℝ = ℚ ∪ 𝕀", "llenan la recta sin huecos", LAV),
    ]
    recap_say = "Cada familia nació de un problema: contar, restar, repartir y medir. Juntas forman los reales, que llenan toda la recta."
    practice = "Sellos, candados, compases y lupas te esperan"
