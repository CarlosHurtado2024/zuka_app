"""
Álgebra P4 · Suma geométrica y suma infinita (lección alg-14d, parte 4 de progresiones, 9:16).

Desde lo básico y sin zoom ni 3D: el truco de multiplicar por r y restar (1 + 2 + … + 2⁹ = 2¹⁰ − 1 = 1023) y la fórmula
Sₙ = a₁(rⁿ − 1)/(r − 1); el ajedrez (2⁶⁴ − 1 granos); la barra de chocolate 1/2 + 1/4 + 1/8 + … = 1; converge si
|r| < 1: S∞ = a₁/(1 − r); los decimales periódicos de los racionales: 0.333… = 1/3 y 0.999… = 1; diverge con |r| ≥ 1
(1 + 2 + 4, 1 − 1 + 1, 3 + 3 + 3). Spec 2026-11-11-progresiones-desde-cero.

    manimgl suma_geometrica.py S02_Infinita -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Progresiones · Parte 4"
    title = "Suma geométrica\ny suma infinita"
    subtitle = "Multiplicar, restar y acercarse"


class S01_Truco(MBScene):
    def construct(self):
        self.mark("El truco de multiplicar y restar")
        self.set_header(R"S_n", "Suma geométrica", HONEY, P_HONEY)
        self.say("Para sumar una progresión geométrica hay un truco muy elegante. Sumemos uno, dos, cuatro, y así hasta dos a la nueve.", fox=True)
        cw = 1.0
        top = ["1", "2", "4", R"\cdots", "2^9"]
        bot = ["2", "4", R"\cdots", "2^9", "2^{10}"]

        def row(items, start, color, lab):
            cells = VGroup(*[M(t, size=36, color=color).move_to(RIGHT * (start + k) * cw) for k, t in enumerate(items)])
            plus = VGroup(*[M("+", size=26, color=MUTED).move_to(RIGHT * (start + k + 0.5) * cw) for k in range(len(items) - 1)])
            l = M(lab, size=36, color=MUTED).move_to(LEFT * 1.0 * cw)
            return VGroup(l, cells, plus), cells

        r1, c1 = row(top, 0, INK, "S =")
        r2, c2 = row(bot, 1, SKY, "2S =")
        r2.shift(0.9 * DOWN)
        rows = VGroup(r1, r2)
        rows.move_to(3.4 * UP)
        self.play(Write(r1))
        self.hold()
        self.say("Multipliquemos todo por la razón, dos. Cada término se convierte en el siguiente, así que la fila de abajo es la misma corrida un lugar.")
        self.play(Write(r2))
        self.hold()
        self.say("Ahora restemos: la fila de abajo menos la de arriba. Todos los del medio se cancelan. Solo quedan el último de abajo y el primero de arriba.")
        pairs = [(c1[1], c2[0]), (c1[2], c2[1]), (c1[3], c2[2]), (c1[4], c2[3])]
        self.play(*[m.animate.set_opacity(0.25) for pr in pairs for m in pr], run_time=1.2)
        self.play(Indicate(c2[4], color=HONEY), Indicate(c1[0], color=HONEY))
        s = M(R"2S - S = 2^{10} - 1", size=48).move_to(1.4 * UP)
        s2 = M(R"S = 1024 - 1 = 1023", size=48, color=HONEY).move_to(0.3 * UP)
        self.play(Write(s))
        self.play(Write(s2))
        self.hold()
        self.say("Con cualquier razón pasa lo mismo. Al multiplicar por r y restar, de abajo queda el primer término por r a la n, y de arriba el primer término. Se saca factor común y se divide entre r menos uno.")
        g1 = M(R"r\,S - S = a_1\,r^n - a_1", size=40).move_to(0.75 * DOWN)
        g2 = M(R"(r - 1)\,S = a_1\,(r^n - 1)", size=40).move_to(1.6 * DOWN)
        self.play(FadeOut(VGroup(s, s2)), Write(g1))
        self.play(Write(g2))
        self.hold()
        f = formula_card(R"S_n = a_1\,\frac{r^n - 1}{r - 1}, \quad r \neq 1", color=HONEY, size=46).move_to(1.0 * UP)
        self.play(FadeIn(f, shift=0.2 * UP))
        self.hold()
        self.say("Es la famosa suma del ajedrez: un grano de arroz en la primera casilla y el doble en cada una de las siguientes. Las sesenta y cuatro casillas suman dos a la sesenta y cuatro menos uno: más arroz del que se ha cosechado en toda la historia.")
        a = M(R"1 + 2 + 4 + \dots + 2^{63} = 2^{64} - 1", size=40).move_to(3.0 * DOWN)
        a.set_max_width(7.2)
        self.play(Write(a))
        self.hold(0.6)
        self.end_section()


class S02_Infinita(MBScene):
    def construct(self):
        self.mark("Sumar infinitos números")
        self.set_header(R"S_\infty", "Suma infinita", MINT, P_MINT)
        self.say("Sumar infinitos números puede dar un resultado finito. Mira esta barra de chocolate.", fox=True)
        side = 3.6
        bar = Square(side).set_fill("#5B3A22", 1).set_stroke(INK, 2).move_to(2.6 * UP)
        self.play(FadeIn(bar))
        x0, y0, w, h = bar.get_left()[0], bar.get_bottom()[1], side, side
        pieces, labels = VGroup(), VGroup()
        cols = [MINT, SKY, HONEY, PINK, LAV, MINT, SKY, HONEY]
        names = [R"\tfrac12", R"\tfrac14", R"\tfrac18", R"\tfrac1{16}"]
        for k in range(8):
            if k % 2 == 0:      # se corta a lo ancho: la mitad izquierda
                pw, ph, px, py = w / 2, h, x0, y0
                x0 += w / 2; w /= 2
            else:               # se corta a lo alto: la mitad de abajo
                pw, ph, px, py = w, h / 2, x0, y0
                y0 += h / 2; h /= 2
            r = Rectangle(pw, ph).set_fill(cols[k], 0.9).set_stroke(BG_COLOR, 2).move_to([px + pw / 2, py + ph / 2, 0])
            pieces.add(r)
            if k < 4:
                labels.add(M(names[k], size=40 - 6 * k, color=BG_COLOR).move_to(r))
        self.say("Primero te comes la mitad. Luego la mitad de lo que queda: un cuarto. Luego la mitad de lo que sigue: un octavo. Y así sin parar.")
        for k in range(8):
            anims = [FadeIn(pieces[k])]
            if k < 4:
                anims.append(FadeIn(labels[k]))
            self.play(*anims, run_time=0.8 if k < 4 else 0.4)
        self.hold()
        self.say("Lo que queda es cada vez más pequeño, pero nunca te pasas de la barra entera. La suma infinita se acerca a uno.")
        s = M(R"\tfrac12 + \tfrac14 + \tfrac18 + \tfrac1{16} + \dots = 1", size=46, color=MINT).move_to(0.1 * DOWN)
        self.play(Write(s))
        self.hold(0.6)
        self.end_section()

        self.mark("Cuándo converge")
        self.say("Es una progresión geométrica de razón un medio. Como la razón está entre menos uno y uno, sus potencias se hacen tan pequeñas como se quiera: r a la n se acerca a cero.")
        p = M(R"\left(\tfrac12\right)^{n}:\quad \tfrac12,\ \tfrac14,\ \tfrac18,\ \dots \to 0", size=44).move_to(3.6 * UP)
        self.play(Write(p))
        self.hold()
        self.say("La fórmula de la suma se puede escribir con los signos cambiados arriba y abajo, que es la misma fracción. Así, cuando r a la n desaparece, queda la suma infinita: el primer término entre uno menos la razón.")
        f1 = M(R"S_n = a_1\,\frac{1 - r^n}{1 - r} \;\longrightarrow\; \frac{a_1}{1 - r}", size=44).move_to(2.0 * UP)
        f1.set_max_width(7.2)
        self.play(Write(f1))
        card = formula_card(R"S_\infty = \frac{a_1}{1 - r}, \quad -1 < r < 1", color=MINT, size=48).move_to(0.3 * UP)
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold()
        self.say("Comprobemos con el chocolate: un medio entre, uno menos un medio, da uno.")
        c = M(R"\frac{1/2}{1 - 1/2} = \frac{1/2}{1/2} = 1", size=46, color=MINT).move_to(1.5 * DOWN)
        self.play(Write(c))
        self.hold(0.6)
        self.end_section()


class S03_Periodico(MBScene):
    def construct(self):
        self.mark("Los decimales periódicos")
        self.set_header(R"0.\overline{3}", "Periódicos", PINK, P_PINK)
        self.say("Esto explica algo que vimos con los racionales: un decimal periódico es una fracción. Cero punto tres periódico es una suma infinita.", fox=True)
        parts = VGroup(*[M(t, size=46) for t in ("0.3", "0.03", "0.003", "0.0003")]).arrange(DOWN, buff=0.18, aligned_edge=RIGHT)
        plus = VGroup(*[M("+", size=36, color=MUTED).next_to(p, LEFT, buff=0.3) for p in parts[1:]])
        dots = M(R"\vdots", size=40, color=MUTED).next_to(parts, DOWN, buff=0.1).align_to(parts, RIGHT).shift(0.3 * LEFT)
        col = VGroup(parts, plus, dots).move_to(3.0 * UP + 1.2 * LEFT)
        total = M(R"= 0.333\ldots", size=46, color=PINK).next_to(col, RIGHT, buff=0.5)
        self.play(LaggedStartMap(FadeIn, parts, lag_ratio=0.3), FadeIn(plus), FadeIn(dots), run_time=1.6)
        self.play(Write(total))
        self.hold()
        self.say("Cada término es el anterior dividido entre diez: es geométrica, con primer término tres décimos y razón un décimo.")
        g = M(R"a_1 = \tfrac{3}{10}, \qquad r = \tfrac{1}{10}", size=46).move_to(0.4 * UP)
        self.play(Write(g))
        self.hold()
        self.say("La suma infinita es tres décimos entre nueve décimos: tres novenos, que es un tercio.")
        s = formula_card(R"0.333\ldots = \frac{3/10}{1 - 1/10} = \frac{3}{9} = \frac13", color=PINK, size=44).move_to(1.2 * DOWN)
        self.play(FadeIn(s, shift=0.2 * UP))
        self.hold()
        self.say("Y una sorpresa: cero punto nueve periódico es exactamente uno. Nueve décimos entre nueve décimos.")
        n = M(R"0.999\ldots = \frac{9/10}{1 - 1/10} = 1", size=44, color=HONEY).move_to(3.0 * DOWN)
        self.play(Write(n))
        self.hold(0.6)
        self.end_section()


class S04_Diverge(MBScene):
    def construct(self):
        self.mark("Cuando la suma no se detiene")
        self.set_header(R"|r| \ge 1", "Diverge", CORAL, P_CORAL)
        self.say("Si la razón no está entre menos uno y uno, la suma infinita no se acerca a ningún número: se dice que diverge.", fox=True)
        self.say("Con uno más dos más cuatro, las sumas parciales son uno, tres, siete, quince, treinta y uno: crecen sin parar.")
        ps = [1, 3, 7, 15, 31]
        bars = VGroup(*[Rectangle(0.7, v * 0.1).set_fill(CORAL, 0.85).set_stroke(width=0) for v in ps]).arrange(RIGHT, buff=0.35, aligned_edge=DOWN)
        bars.move_to(1.6 * UP, aligned_edge=DOWN)
        bl = VGroup(*[T(str(v), size=22).next_to(b, DOWN, buff=0.12) for v, b in zip(ps, bars)])
        self.play(LaggedStartMap(GrowFromEdge, bars, edge=DOWN, lag_ratio=0.2), FadeIn(bl), run_time=1.6)
        t1 = M(R"1 + 2 + 4 + 8 + \dots \quad (r = 2)", size=40, color=CORAL).next_to(bl, DOWN, buff=0.3)
        self.play(Write(t1))
        self.hold()
        self.say("Con uno menos uno más uno menos uno, las sumas parciales saltan: uno, cero, uno, cero. Nunca se quedan quietas.")
        t2 = M(R"1 - 1 + 1 - 1 + \dots \;\to\; 1,\ 0,\ 1,\ 0,\ \dots \quad (r = -1)", size=36, color=SKY).move_to(1.1 * DOWN)
        t2.set_max_width(7.2)
        self.play(Write(t2))
        self.hold()
        self.say("Y con razón uno, tres más tres más tres, la suma también crece sin límite.")
        t3 = M(R"3 + 3 + 3 + \dots \;\to\; 3,\ 6,\ 9,\ \dots \quad (r = 1)", size=38, color=HONEY).move_to(2.2 * DOWN)
        t3.set_max_width(7.2)
        self.play(Write(t3))
        n = note("Converge solo si −1 < r < 1", color=MINT, size=30).move_to(3.6 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("El truco", "multiplica por r y resta: casi todo se cancela", HONEY),
        ("Suma finita", "Sₙ = a₁(rⁿ − 1)/(r − 1) · 1 + 2 + … + 2⁹ = 1023", HONEY),
        ("Suma infinita", "si −1 < r < 1: S∞ = a₁/(1 − r)", MINT),
        ("Chocolate", "1/2 + 1/4 + 1/8 + … = 1", MINT),
        ("Periódicos", "0.333… = 1/3 · 0.999… = 1", PINK),
        ("Diverge", "si |r| ≥ 1 la suma no se estabiliza", CORAL),
    ]
    recap_say = "La suma geométrica sale de multiplicar por la razón y restar. Si la razón está entre menos uno y uno, la suma infinita se acerca a a sub uno entre uno menos r."
    practice = "Suma términos, acércate al límite y convierte periódicos en fracciones"
