"""
Álgebra P3 · Progresiones geométricas (lección alg-14c, parte 3 de progresiones, 9:16).

Desde lo básico y sin zoom ni 3D: un secreto que cada uno cuenta a tres (1, 3, 9, 27); razón r = cociente de dos
términos seguidos (como las razones); r fraccionaria (medicamento 800, 400, 200, 100 mg) y negativa (1, −2, 4, −8, con
la ley de signos); aₙ = a₁ rⁿ⁻¹ contando multiplicaciones (potencias): a₇ de 3, 6, 12 = 192; sumar vs multiplicar
(premio de 100 más cada día contra 1 que se duplica: la duplicación gana desde el día 12); medios geométricos entre 2 y
162: r⁴ = 81, r = 3 o r = −3. Spec 2026-11-11-progresiones-desde-cero.

    manimgl geometricas.py S02_TerminoGeneral -w -l
"""
from alg_fx import *


def hop(p, q, label, color, up=True, size=24):
    arc = ArcBetweenPoints(p, q, angle=-PI / 2.2 if up else PI / 2.2).set_stroke(color, 3)
    t = T(label, size=size, color=color).next_to(arc, UP if up else DOWN, buff=0.06)
    return VGroup(arc, t)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Progresiones · Parte 3"
    title = "Progresiones\ngeométricas"
    subtitle = "Multiplicar siempre por lo mismo"


class S01_Multiplicar(MBScene):
    def construct(self):
        self.mark("Multiplicar siempre por lo mismo")
        self.set_header(R"\times r", "Geométrica", CORAL, P_CORAL)
        self.say("El día cero, Ana sabe un secreto. El día uno se lo cuenta a tres amigos. El día dos, cada uno se lo cuenta a tres personas más, y así cada día.", fox=True)
        rows = VGroup()
        for k, n in enumerate([1, 3, 9, 27]):
            dots = VGroup(*[Dot(radius=0.07).set_fill(CORAL, 1) for _ in range(n)]).arrange(RIGHT, buff=0.08)
            lab = M(str(n), size=34, color=INK)
            rows.add(VGroup(lab, dots))
        for r in rows:
            r[0].move_to(LEFT * 3.4)
        for k, r in enumerate(rows):
            r[1].move_to([0.35, 4.3 - 0.75 * k, 0])
            r[0].set_y(r[1].get_y())
        days = VGroup(*[T(f"día {k}", size=18, color=MUTED).next_to(r[0], DOWN, buff=0.04) for k, r in enumerate(rows)])
        for r, d in zip(rows, days):
            self.play(FadeIn(r[0]), LaggedStartMap(GrowFromCenter, r[1], lag_ratio=0.03), FadeIn(d), run_time=1.0)
        self.hold()
        self.say("Cuando cada término sale de multiplicar el anterior por el mismo número, la sucesión es una progresión geométrica. Ese número fijo es la razón, r.")
        self.hold()
        self.say("Se llama razón porque es el cociente de dos términos seguidos, como las razones que comparan dividiendo.")
        r = M(R"\frac{3}{1} = \frac{9}{3} = \frac{27}{9} = 3 = r", size=50, color=CORAL).move_to(0.6 * UP)
        self.play(Write(r))
        card = formula_card(R"r = \frac{a_{n+1}}{a_n}", color=CORAL, size=50).move_to(1.3 * DOWN)
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()

        self.mark("Razón fraccionaria o negativa")
        self.say("La razón puede ser una fracción. Un medicamento en la sangre baja a la mitad cada seis horas: ochocientos, cuatrocientos, doscientos, cien miligramos.")
        vals = [800, 400, 200, 100]
        bars = VGroup(*[Rectangle(0.9, v * 0.0042).set_fill(SKY, 0.85).set_stroke(width=0) for v in vals]).arrange(RIGHT, buff=0.7, aligned_edge=DOWN)
        bars.move_to(1.0 * UP, aligned_edge=DOWN)
        labs = VGroup(*[T(f"{v} mg", size=22).next_to(b, DOWN, buff=0.15) for v, b in zip(vals, bars)])
        self.play(LaggedStartMap(GrowFromEdge, bars, edge=DOWN, lag_ratio=0.2), FadeIn(labs), run_time=1.6)
        hs = VGroup(*[hop(bars[i].get_top() + 0.1 * UP + 0.25 * RIGHT, bars[i + 1].get_top() + 0.1 * UP - 0.25 * RIGHT, "× ½", HONEY, size=22) for i in range(3)])
        self.play(LaggedStartMap(FadeIn, hs, lag_ratio=0.2))
        self.hold()
        self.say("Y puede ser negativa: uno, menos dos, cuatro, menos ocho. Por la ley de signos, al multiplicar por un negativo el signo cambia cada vez.")
        neg = M(R"1,\ -2,\ 4,\ -8,\ 16,\ \dots \qquad r = -2", size=46).move_to(1.2 * DOWN)
        self.play(Write(neg))
        self.hold(0.6)
        self.end_section()


class S02_TerminoGeneral(MBScene):
    def construct(self):
        self.mark("Contar las multiplicaciones")
        self.set_header(R"a_1\,r^{\,n-1}", "Término general", HONEY, P_HONEY)
        self.say("Para hallar un término lejano de tres, seis, doce no hace falta escribirlos todos: basta contar las multiplicaciones.", fox=True)
        vals = [3, 6, 12, 24, 48]
        seq = VGroup(*[M(str(v), size=44) for v in vals]).arrange(RIGHT, buff=0.85).move_to(3.6 * UP)
        labs = VGroup(*[M(f"a_{k}", size=30, color=HONEY).next_to(s, DOWN, buff=0.3) for k, s in enumerate(seq, 1)])
        labs.align_to(labs[0], UP)
        self.play(FadeIn(seq, lag_ratio=0.2), FadeIn(labs, lag_ratio=0.2))
        hs = VGroup(*[hop(seq[i].get_top() + 0.1 * UP, seq[i + 1].get_top() + 0.1 * UP, "×2", MINT, size=22) for i in range(4)])
        self.play(LaggedStartMap(FadeIn, hs, lag_ratio=0.2))
        self.hold()
        self.say("Al término dos se llega con una multiplicación por dos; al cinco, con cuatro. Multiplicar cuatro veces por dos es dos a la cuarta: una potencia.")
        e = M(R"a_5 = 3 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 3 \cdot 2^4 = 48", size=42).move_to(1.6 * UP)
        e.set_max_width(7.2)
        self.play(Write(e))
        self.hold()
        self.say("Al término n se llega con n menos una multiplicaciones por r. Esa es la fórmula del término general.")
        f = formula_card(R"a_n = a_1\,r^{\,n-1}", color=HONEY, size=56).move_to(0.1 * UP)
        self.play(FadeIn(f, shift=0.2 * UP))
        self.hold()
        self.say("El término siete es tres por dos a la sexta: tres por sesenta y cuatro, ciento noventa y dos.")
        a7 = M(R"a_7 = 3 \cdot 2^6 = 3 \cdot 64 = 192", size=46, color=MINT).move_to(1.5 * DOWN)
        self.play(Write(a7))
        self.hold()
        self.say("Compara con la aritmética: allá los saltos se suman, n menos una veces d. Aquí se multiplican: r elevado a n menos uno.")
        cmp = VGroup(
            M(R"\text{aritm\'etica: } a_1 + (n - 1)\,d", size=36, color=MINT),
            M(R"\text{geom\'etrica: } a_1 \cdot r^{\,n-1}", size=36, color=CORAL),
        ).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to(3.1 * DOWN)
        self.play(FadeIn(cmp, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S03_Crecer(MBScene):
    def construct(self):
        self.mark("Sumar contra multiplicar")
        self.set_header(R"+ \quad \times", "Dos premios", MINT, P_MINT)
        self.say("Dos premios. El primero da cien pesos el primer día y cada día cien más. El segundo da un peso el primer día y cada día el doble.", fox=True)
        a = T("A: 100, 200, 300, 400, …", size=28, color=MINT)
        b = T("B: 1, 2, 4, 8, 16, …", size=28, color=CORAL)
        ab = VGroup(a, b).arrange(DOWN, buff=0.2, aligned_edge=LEFT).move_to(4.2 * UP)
        self.play(FadeIn(ab, lag_ratio=0.3))
        self.hold()
        self.say("Al principio el premio A gana con mucha ventaja. Dibujemos los dos día por día, en cientos de pesos.")
        plane = get_plane((0, 13), (0, 22), 0.52, numbers=False, unit_y=0.19).move_to(0.3 * DOWN)
        ax = plane.axes
        xl = VGroup(*[T(str(d), size=18, color=MUTED).next_to(ax.c2p(d, 0), DOWN, buff=0.06) for d in (2, 4, 6, 8, 10, 12)])
        yl = VGroup(*[T(str(v), size=18, color=MUTED).next_to(ax.c2p(0, v), LEFT, buff=0.06) for v in (5, 10, 15, 20)])
        cap = T("día", size=18, color=MUTED).next_to(ax.c2p(13, 0), DOWN, buff=0.3)
        self.play(FadeIn(plane), FadeIn(xl), FadeIn(yl), FadeIn(cap))
        pa = VGroup(*[dot(ax, d, d, MINT, r=0.07) for d in range(1, 13)])
        pb = VGroup(*[dot(ax, d, 2 ** (d - 1) / 100, CORAL, r=0.07) for d in range(1, 13)])
        self.play(LaggedStartMap(GrowFromCenter, pa, lag_ratio=0.08), run_time=1.4)
        self.play(LaggedStartMap(GrowFromCenter, pb, lag_ratio=0.08), run_time=1.4)
        self.hold()
        self.say("El día diez, el premio A da mil pesos y el B quinientos doce. Pero el día doce el B ya da dos mil cuarenta y ocho, y desde ahí A no lo vuelve a alcanzar.")
        d12 = M(R"\text{d\'ia } 12:\ 1200 \;<\; 2^{11} = 2048", size=38, color=CORAL).move_to(3.4 * DOWN)
        self.play(Write(d12), Indicate(pb[-1], color=CORAL))
        self.hold()
        self.say("Sumar siempre lo mismo crece en línea recta. Multiplicar por lo mismo crece cada vez más rápido. Esa curva volverá con la función exponencial.")
        self.hold(0.6)
        self.end_section()


class S04_Medios(MBScene):
    def construct(self):
        self.mark("Medios geométricos")
        self.set_header(R"r^4 = 81", "Medios", SKY, P_SKY)
        self.say("Entre dos y ciento sesenta y dos se quieren meter tres medios geométricos. Con tres números en medio hay cuatro multiplicaciones por la razón.", fox=True)
        items = VGroup(M("2", size=48, color=SKY), *[Square(0.6).set_stroke(MUTED, 2) for _ in range(3)], M("162", size=48, color=SKY)).arrange(RIGHT, buff=0.75).move_to(3.6 * UP)
        self.play(FadeIn(items, lag_ratio=0.15))
        hs = VGroup(*[hop(items[i].get_top() + 0.1 * UP, items[i + 1].get_top() + 0.1 * UP, "×r", HONEY, size=22) for i in range(4)])
        self.play(LaggedStartMap(FadeIn, hs, lag_ratio=0.2))
        self.hold()
        s1 = M(R"162 = 2 \cdot r^4 \;\Rightarrow\; r^4 = 81", size=46).move_to(1.8 * UP)
        self.play(Write(s1))
        self.hold()
        self.say("Hace falta un número que, multiplicado cuatro veces por sí mismo, dé ochenta y uno. Es la raíz cuarta de ochenta y uno: tres, porque tres por tres por tres por tres es ochenta y uno.")
        s2 = M(R"r = \sqrt[4]{81} = 3", size=48, color=HONEY).move_to(0.6 * UP)
        self.play(Write(s2))
        fills = VGroup(*[M(str(v), size=42, color=HONEY).move_to(sq) for v, sq in zip((6, 18, 54), items[1:4])])
        self.play(*[FadeTransform(sq, f) for sq, f in zip(items[1:4], fills)])
        self.hold()
        self.say("Pero menos tres también sirve, porque un negativo elevado a una potencia par da positivo. Con r igual a menos tres, los medios son menos seis, dieciocho y menos cincuenta y cuatro.")
        s3 = M(R"r = -3:\quad 2,\ -6,\ 18,\ -54,\ 162", size=44, color=CORAL).move_to(1.0 * DOWN)
        s3.set_max_width(7.2)
        self.play(Write(s3))
        n = note("Dos soluciones: r = 3 o r = −3", color=SKY, size=28).move_to(2.6 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("Geométrica", "se multiplica siempre por la misma razón r", CORAL),
        ("Razón", "r = aₙ₊₁ / aₙ, el cociente de dos seguidos", CORAL),
        ("r puede ser", "fracción (× ½) o negativa (signos alternos)", SKY),
        ("Término general", "aₙ = a₁ rⁿ⁻¹ · a₇ = 3 · 2⁶ = 192", HONEY),
        ("Crecer", "sumar: recta · multiplicar: cada vez más rápido", MINT),
        ("Medios", "entre 2 y 162: r⁴ = 81, r = ±3", SKY),
    ]
    recap_say = "Una progresión geométrica multiplica siempre por la misma razón, y el término n se alcanza con n menos una multiplicaciones."
    practice = "Haz rebotar pelotas, duplica bacterias y rellena los medios"
