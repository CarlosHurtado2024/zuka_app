"""
Álgebra V2 · Tipos de conjuntos y relaciones entre ellos (lección alg-0b, 9:16, fondo morado vivo).

Desde lo más básico, sin números ni desigualdades, sin zoom ni 3D. Vacío (los días que empiezan por Z) y la trampa
{∅}; unitario (la capital de Colombia); finito e infinito (los días de la semana y los puntos de un segmento);
universal según el contexto (las letras del alfabeto); subconjunto (vocales ⊆ letras), lo que no es subconjunto,
∅ ⊆ A y A ⊆ A; igualdad (letras de AMOR y de ROMA); disjuntos (frutas y herramientas); y el conjunto de partes con
los toppings de un helado (fresa, mora, coco). Spec 2026-11-11-conjuntos-desde-cero.

    manimgl tipos.py S05_Subconjunto -w -l
"""
from alg_fx import *


def word_card(text, color=INK, fill=CARD, size=30):
    t = TB(text, size=size, color=color)
    box = RoundedRectangle(t.get_width() + 0.5, t.get_height() + 0.36, corner_radius=0.16).set_fill(fill, 1).set_stroke(color, 2)
    box.move_to(t)
    return VGroup(box, t)


def blob(width, height, color):
    return Ellipse(width=width, height=height).set_stroke(color, 4).set_fill(color, 0.12)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 0 · Parte 2"
    title = "Tipos de conjuntos\ny relaciones"
    subtitle = "Vacío, subconjunto, iguales y disjuntos"


class S01_Vacio(MBScene):
    def construct(self):
        self.mark("El conjunto vacío")
        self.set_header(R"\varnothing", "Vacío", HONEY, P_HONEY)
        self.say("Busquemos los días de la semana que empiezan por la letra zeta. Revisemos uno por uno.", fox=True)
        q = M(R"Z = \{x : x \text{ es un d\'ia que empieza por } Z\}", size=40).move_to(4.2 * UP)
        q.set_max_width(7.2)
        self.play(Write(q))
        days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        cards = VGroup(*[word_card(d, size=24) for d in days]).arrange_in_grid(3, 3, buff=0.2).move_to(2.2 * UP)
        cards.set_max_width(7.2)
        self.play(LaggedStartMap(FadeIn, cards, lag_ratio=0.1))
        for c in cards:
            x = ex_mark(CORAL, 26).next_to(c, RIGHT, buff=0.05)
            self.play(FadeIn(x, scale=0.5), c.animate.set_opacity(0.4), run_time=0.3)
        self.say("Ninguno cumple la condición. El conjunto existe, pero no tiene elementos: es el conjunto vacío. Se escribe con llaves sin nada adentro, o con este símbolo: un círculo cruzado por una raya.")
        res = M(R"Z = \{\ \} = \varnothing", size=64, color=HONEY).move_to(0.2 * DOWN)
        self.play(Write(res))
        box = RoundedRectangle(2.4, 1.6, corner_radius=0.2).set_stroke(HONEY, 4).move_to(2.2 * DOWN)
        empty = T("vacía", size=26, color=MUTED).move_to(box)
        self.play(ShowCreation(box), FadeIn(empty))
        self.hold()
        self.end_section()
        self.mark("La trampa del vacío")
        self.say("Una trampa muy común: llaves con el símbolo de vacío adentro no es el vacío. Es como una caja que guarda adentro una caja vacía: la caja grande tiene un elemento.", fox=True)
        b1 = RoundedRectangle(2.6, 2.0, corner_radius=0.2).set_stroke(HONEY, 4).move_to(1.6 * LEFT + 2.0 * UP)
        b2 = RoundedRectangle(2.6, 2.0, corner_radius=0.2).set_stroke(HONEY, 4).move_to(1.6 * RIGHT + 2.0 * UP)
        inner = RoundedRectangle(1.2, 0.9, corner_radius=0.12).set_stroke(MUTED, 3).move_to(b2)
        l1 = M(R"\varnothing", size=54, color=HONEY).next_to(b1, DOWN, buff=0.3)
        l2 = M(R"\{\varnothing\}", size=54, color=HONEY).next_to(b2, DOWN, buff=0.3)
        self.play(ShowCreation(b1), ShowCreation(b2), FadeIn(l1), FadeIn(l2))
        self.play(GrowFromCenter(inner))
        n = VGroup(T("ningún elemento", size=28, color=MINT).next_to(l1, DOWN, buff=0.3), T("un elemento: la caja vacía", size=28, color=CORAL).next_to(l2, DOWN, buff=0.3))
        n[1].set_max_width(3.4)
        self.play(FadeIn(n))
        self.hold(0.6)
        self.end_section()


class S02_Unitario(MBScene):
    def construct(self):
        self.mark("El conjunto unitario")
        self.set_header(R"\{a\}", "Unitario", MINT, P_MINT)
        self.say("Un conjunto unitario tiene un solo elemento. Por ejemplo, el conjunto de las capitales de Colombia: solo hay una.", fox=True)
        q = M(R"K = \{x : x \text{ es la capital de Colombia}\}", size=40).move_to(3.4 * UP)
        q.set_max_width(7.2)
        self.play(Write(q))
        S = blob(3.6, 2.2, MINT).move_to(1.0 * UP)
        el = TB("Bogotá", size=36).move_to(S)
        self.play(DrawBorderThenFill(S), FadeIn(el, scale=0.8))
        res = M(R"K = \{\text{Bogot\'a}\}", size=60, color=MINT).move_to(1.4 * DOWN)
        self.play(Write(res))
        self.say("Ojo: el elemento es Bogotá, y el conjunto es Bogotá metida entre llaves. No son lo mismo, igual que un lápiz no es lo mismo que un estuche con un lápiz.")
        diff = VGroup(M(R"\text{Bogot\'a} \in K", size=44, color=INK), M(R"\text{Bogot\'a} \neq \{\text{Bogot\'a}\}", size=44, color=CORAL)).arrange(DOWN, buff=0.3).move_to(3.4 * DOWN)
        self.play(FadeIn(diff, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S03_FinitoInfinito(MBScene):
    def construct(self):
        self.mark("Finito e infinito")
        self.set_header(R"\dots", "Finito e infinito", SKY, P_SKY)
        self.say("Si los elementos de un conjunto se terminan de contar, es finito. Los días de la semana: se cuentan y se acaban.", fox=True)
        days = VGroup(*[word_card(d, color=SKY, size=22) for d in ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]]).arrange(RIGHT, buff=0.08).move_to(3.4 * UP)
        days.set_max_width(7.2)
        self.play(LaggedStartMap(FadeIn, days, lag_ratio=0.12))
        fin = TB("finito: la lista se acaba", size=30, color=SKY).next_to(days, DOWN, buff=0.3)
        self.play(FadeIn(fin))
        self.hold()
        self.say("Pero hay conjuntos que nunca se acaban. Piensa en los puntos de un segmento: entre dos puntos siempre cabe otro en la mitad, y entre esos, otro más, sin fin.")
        seg = Line(3.2 * LEFT, 3.2 * RIGHT).set_stroke(INK, 4).move_to(0.6 * DOWN)
        ends = VGroup(Dot(seg.get_start(), radius=0.1), Dot(seg.get_end(), radius=0.1)).set_fill(PINK, 1)
        self.play(ShowCreation(seg), FadeIn(ends))
        a, b = seg.get_start(), seg.get_end()
        pts = [(a, b)]
        for level in range(4):
            new = []
            dots = VGroup()
            for p0, p1 in pts:
                mid = (p0 + p1) / 2
                dots.add(Dot(mid, radius=0.08 - 0.012 * level).set_fill(PINK, 1))
                new += [(p0, mid), (mid, p1)]
            self.play(LaggedStartMap(GrowFromCenter, dots, lag_ratio=0.05), run_time=0.8)
            pts = new
        inf = TB("infinito: nunca se termina de contar", size=30, color=PINK).move_to(2.0 * DOWN)
        self.play(FadeIn(inf, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S04_Universal(MBScene):
    def construct(self):
        self.mark("El conjunto universal")
        self.set_header(R"U", "Universal", LAV, P_LAV)
        self.say("Cuando hablamos de un tema, todos los objetos de ese tema forman el conjunto universal, que se llama U. Se dibuja como un rectángulo que encierra todo lo demás.", fox=True)
        U = RoundedRectangle(7.0, 4.6, corner_radius=0.3).set_stroke(MUTED, 3).set_fill(CARD, 0.5).move_to(1.0 * UP)
        lu = M("U", size=48, color=MUTED).next_to(U.get_corner(UL), DR, buff=0.15)
        V = blob(3.0, 2.0, LAV).move_to(U.get_center() + 1.2 * LEFT)
        lv = M("V", size=40, color=LAV).next_to(V, UP, buff=-0.1).shift(1.0 * LEFT)
        vow = VGroup(*[TB(c, size=30) for c in "aeiou"]).arrange(RIGHT, buff=0.22).move_to(V)
        cons = VGroup(*[T(c, size=28, color=MUTED) for c in "bcdfgm"])
        for k, c in enumerate(cons):
            c.move_to(U.get_center() + np.array([1.5 + (k % 3) * 0.6, 0.9 - (k // 3) * 1.4, 0]))
        self.play(FadeIn(U), FadeIn(lu))
        self.play(DrawBorderThenFill(V), FadeIn(lv), FadeIn(vow))
        self.play(LaggedStartMap(FadeIn, cons, lag_ratio=0.1))
        self.say("Si el tema son las vocales, el universal son todas las letras del alfabeto: las vocales están adentro y las consonantes quedan afuera de la bolsa, pero dentro del rectángulo.")
        lab = M(R"U = \{\text{letras del alfabeto}\}", size=42, color=MUTED).move_to(2.6 * DOWN)
        self.play(Write(lab))
        self.say("El universal no es siempre el mismo: depende de qué estemos estudiando.")
        self.hold(0.6)
        self.end_section()


class S05_Subconjunto(MBScene):
    def construct(self):
        self.mark("Subconjunto")
        self.set_header(R"B \subseteq A", "Subconjunto", MINT, P_MINT)
        self.say("Ahora comparemos dos conjuntos. Las vocales y las letras del alfabeto. Cada vocal es también una letra: todas las vocales están dentro de las letras.", fox=True)
        L = blob(6.4, 4.2, SKY).move_to(1.4 * UP)
        V = blob(3.0, 1.8, MINT).move_to(1.0 * UP + 0.6 * RIGHT)
        lL = M("L", size=44, color=SKY).move_to(L.get_center() + 2.4 * LEFT + 1.2 * UP)
        lV = M("V", size=40, color=MINT).next_to(V, UP, buff=-0.15).shift(0.9 * RIGHT)
        vow = VGroup(*[TB(c, size=28) for c in "aeiou"]).arrange(RIGHT, buff=0.2).move_to(V)
        cons = VGroup(*[T(c, size=26, color=MUTED) for c in "bcdm"])
        for k, c in enumerate(cons):
            c.move_to(L.get_center() + np.array([-2.2 + (k % 2) * 0.7, -0.4 - (k // 2) * 0.9, 0]))
        self.play(DrawBorderThenFill(L), FadeIn(lL), FadeIn(cons))
        self.play(DrawBorderThenFill(V), FadeIn(lV), FadeIn(vow))
        res = VGroup(M(R"V \subseteq L", size=60, color=MINT), T("«V es subconjunto de L» o «V está contenido en L»", size=26)).arrange(DOWN, buff=0.18).move_to(2.2 * DOWN)
        res[1].set_max_width(7.2)
        self.play(Write(res[0]))
        self.play(FadeIn(res[1]))
        self.say("Se dice que V es subconjunto de L cuando todo elemento de V es también elemento de L. En el dibujo, la bolsa de V queda completamente adentro de la de L.")
        self.hold()
        self.end_section()
        self.mark("Cuando no es subconjunto")
        self.say("Basta un solo elemento afuera para que no sea subconjunto. El conjunto rojo y azul no es subconjunto de los colores del semáforo, porque el azul no está en el semáforo.", fox=True)
        S = M(R"S = \{\text{rojo},\ \text{amarillo},\ \text{verde}\}", size=40).move_to(3.6 * UP)
        C = M(R"C = \{\text{rojo},\ \text{azul}\}", size=40).move_to(2.7 * UP)
        self.play(Write(S), Write(C))
        checks = VGroup(
            VGroup(M(R"\text{rojo} \in S", size=40, color=MINT), check_mark(MINT, 36)).arrange(RIGHT, buff=0.2),
            VGroup(M(R"\text{azul} \notin S", size=40, color=CORAL), ex_mark(CORAL, 36)).arrange(RIGHT, buff=0.2),
        ).arrange(DOWN, buff=0.25).move_to(1.0 * UP)
        self.play(LaggedStartMap(FadeIn, checks, lag_ratio=0.5))
        no = M(R"C \not\subseteq S", size=60, color=CORAL).move_to(0.7 * DOWN)
        self.play(Write(no))
        self.hold()
        self.say("Dos detalles para recordar: el vacío es subconjunto de cualquier conjunto, porque no tiene ningún elemento que pueda quedar afuera. Y todo conjunto es subconjunto de sí mismo.")
        facts = VGroup(M(R"\varnothing \subseteq A", size=50, color=HONEY), M(R"A \subseteq A", size=50, color=HONEY)).arrange(RIGHT, buff=1.2).move_to(2.6 * DOWN)
        self.play(FadeIn(facts, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S06_Igualdad(MBScene):
    def construct(self):
        self.mark("Conjuntos iguales")
        self.set_header(R"A = B", "Iguales", PINK, P_PINK)
        self.say("Las palabras amor y roma son distintas, pero miremos el conjunto de sus letras.", fox=True)
        w1 = VGroup(*[word_card(c, color=PINK, size=40) for c in "AMOR"]).arrange(RIGHT, buff=0.15).move_to(3.6 * UP + 1.9 * LEFT)
        w2 = VGroup(*[word_card(c, color=SKY, size=40) for c in "ROMA"]).arrange(RIGHT, buff=0.15).move_to(3.6 * UP + 1.9 * RIGHT)
        self.play(LaggedStartMap(FadeIn, w1, lag_ratio=0.15), LaggedStartMap(FadeIn, w2, lag_ratio=0.15))
        s1 = M(R"A = \{A, M, O, R\}", size=46, color=PINK).move_to(2.2 * UP)
        s2 = M(R"B = \{R, O, M, A\}", size=46, color=SKY).move_to(1.3 * UP)
        self.play(Write(s1), Write(s2))
        self.say("Tienen exactamente las mismas letras, en otro orden. Como el orden no importa, son el mismo conjunto: A es igual a B.")
        eq = M(R"A = B", size=72, color=INK).move_to(0.0)
        self.play(FadeIn(eq, scale=1.2))
        self.hold()
        self.say("Otra forma de verlo: cada uno es subconjunto del otro. Todo lo de A está en B, y todo lo de B está en A.")
        rule = formula_card(R"A = B \iff A \subseteq B \text{ y } B \subseteq A", color=PINK, size=40).move_to(2.2 * DOWN)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S07_Disjuntos(MBScene):
    def construct(self):
        self.mark("Conjuntos disjuntos")
        self.set_header(R"\text{sin nada en com\'un}", "Disjuntos", CORAL, P_CORAL)
        self.say("Dos conjuntos son disjuntos cuando no tienen ningún elemento en común. Unas frutas y unas herramientas, por ejemplo.", fox=True)
        F = blob(3.2, 2.6, MINT).move_to(1.8 * LEFT + 1.6 * UP)
        H = blob(3.2, 2.6, CORAL).move_to(1.8 * RIGHT + 1.6 * UP)
        fr = VGroup(T("mango", size=28), T("pera", size=28), T("uva", size=28)).arrange(DOWN, buff=0.2).move_to(F)
        he = VGroup(T("martillo", size=28), T("sierra", size=28), T("llave", size=28)).arrange(DOWN, buff=0.2).move_to(H)
        lf = T("frutas", size=28, color=MINT).next_to(F, UP, buff=0.1)
        lh = T("herramientas", size=28, color=CORAL).next_to(H, UP, buff=0.1)
        self.play(DrawBorderThenFill(F), DrawBorderThenFill(H), FadeIn(lf), FadeIn(lh))
        self.play(FadeIn(fr), FadeIn(he))
        self.say("Ninguna fruta es una herramienta y ninguna herramienta es una fruta. En el dibujo, las dos bolsas no se tocan.")
        res = note("Disjuntos: no comparten ningún elemento", color=CORAL, size=28).move_to(1.4 * DOWN)
        self.play(FadeIn(res, shift=0.2 * UP))
        self.hold()
        self.say("En cambio, si compartieran algo, las bolsas se cruzarían, y lo común quedaría en la parte donde se cruzan. Eso lo estudiaremos en la próxima parte.")
        self.hold(0.6)
        self.end_section()


class S08_Partes(MBScene):
    def construct(self):
        self.mark("Todos los subconjuntos")
        self.set_header(R"P(T)", "Conjunto de partes", HONEY, P_HONEY)
        self.say("Una heladería ofrece tres toppings: fresa, mora y coco. ¿De cuántas formas distintas puedes pedir tu helado, contando el helado sin toppings?", fox=True)
        T0 = M(R"T = \{\text{fresa},\ \text{mora},\ \text{coco}\}", size=44).move_to(4.3 * UP)
        self.play(Write(T0))
        self.say("Cada combinación es un subconjunto de T. Ordenémoslas por tamaño para no olvidar ninguna.")
        groups = [
            ("sin toppings", [R"\varnothing"], MUTED),
            ("uno", [R"\{f\}", R"\{m\}", R"\{c\}"], SKY),
            ("dos", [R"\{f, m\}", R"\{f, c\}", R"\{m, c\}"], MINT),
            ("los tres", [R"\{f, m, c\}"], PINK),
        ]
        rows = VGroup()
        for name, items, col in groups:
            lab = T(name, size=26, color=col)
            its = VGroup(*[M(t, size=44, color=col) for t in items]).arrange(RIGHT, buff=0.45)
            row = VGroup(lab, its).arrange(RIGHT, buff=0.5)
            rows.add(row)
        rows.arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to(1.0 * UP)
        rows.set_max_width(7.2)
        key = T("f = fresa, m = mora, c = coco", size=22, color=MUTED).next_to(rows, UP, buff=0.3)
        self.play(FadeIn(key))
        says = ["El helado sin nada: el conjunto vacío.", "Con un solo topping: tres opciones.", "Con dos toppings: otras tres.", "Y con los tres a la vez: una."]
        for r, s in zip(rows, says):
            self.say(s)
            self.play(FadeIn(r[0]), LaggedStartMap(FadeIn, r[1], shift=0.2 * UP, lag_ratio=0.2), run_time=1.0)
            self.hold()
        self.say("En total son ocho. Hay otra forma de verlo: cada topping entra o no entra. Con un solo topping hay dos opciones; cada topping nuevo duplica las combinaciones: dos, cuatro, ocho.")
        total = note("En total, 8 combinaciones: 1 + 3 + 3 + 1.\nCada topping nuevo las duplica: 2, 4, 8.", color=HONEY, size=26).move_to(2.2 * DOWN)
        self.play(FadeIn(total, shift=0.2 * UP))
        self.hold()
        self.say("La colección de todos los subconjuntos se llama conjunto de partes, y se escribe pe de T. Incluye siempre al vacío y al conjunto completo.")
        P = M(R"P(T) = \{\varnothing,\ \{f\},\ \{m\},\ \{c\},\ \{f,m\},\ \{f,c\},\ \{m,c\},\ \{f,m,c\}\}", size=34, color=INK).move_to(3.6 * DOWN)
        P.set_max_width(7.3)
        self.play(Write(P), run_time=2.0)
        self.hold(0.6)
        self.end_section()


class S09_Cierre(AlgCierre):
    recap = [
        ("Vacío", "∅ = { }: sin elementos  ·  {∅} tiene uno", HONEY),
        ("Unitario", "un solo elemento: {Bogotá}", MINT),
        ("Finito e infinito", "la lista se acaba o no se acaba", SKY),
        ("Universal U", "todo lo del tema que se estudia", LAV),
        ("Subconjunto", "V ⊆ L: todo lo de V está en L", MINT),
        ("Iguales", "los mismos elementos: letras de AMOR = de ROMA", PINK),
        ("Disjuntos", "no comparten ningún elemento", CORAL),
        ("Partes", "P(T): todos los subconjuntos", HONEY),
    ]
    recap_say = "Los conjuntos tienen tipos según cuántos elementos tienen, y se relacionan entre sí: uno dentro de otro, iguales o separados."
    practice = "Arma conjuntos, mueve círculos y fabrica subconjuntos"
