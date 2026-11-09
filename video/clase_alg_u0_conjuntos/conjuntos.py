"""
Álgebra C0 · Conjuntos: notación, tipos y operaciones (lección alg-0, un solo video, 9:16, fondo morado vivo).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Sin 3D: diagramas de Venn que se sombrean con
operaciones booleanas de manimgl (Union, Intersection, Difference, Exclusion) y zoom de cámara. Qué es un
conjunto (bien definido, ∈ y ∉), extensión y comprensión, cardinal, tipos (vacío y la trampa de {∅}, unitario,
finito, infinito, universal), subconjunto, igualdad, disjuntos, el árbol de P({a, b, c}) con 2³ ramas, las
cinco operaciones con A = {1, 2, 3, 4}, B = {3, 4, 5, 6}, U = {1, …, 8} y la encuesta de café y té.
Spec 2026-11-09-algebra-conjuntos.

    manimgl conjuntos.py S06_Operaciones -w -l
"""
from alg_fx import *

U_COLOR = MUTED


def venn(center=ORIGIN, r=1.45, sep=0.95, width=7.0, height=4.2):
    """Universo (rectángulo) y dos círculos A (cielo) y B (coral)."""
    uni = RoundedRectangle(width, height, corner_radius=0.25).set_stroke(U_COLOR, 2).set_fill(CARD, 0.6).move_to(center)
    a = Circle(radius=r).set_stroke(SKY, 4).move_to(center + sep * LEFT)
    b = Circle(radius=r).set_stroke(CORAL, 4).move_to(center + sep * RIGHT)
    la = M("A", size=40, color=SKY).move_to(a.get_center() + r * 0.78 * (UL))
    lb = M("B", size=40, color=CORAL).move_to(b.get_center() + r * 0.78 * (UR))
    lu = M("U", size=36, color=U_COLOR).next_to(uni.get_corner(UL), DR, buff=0.15)
    return VGroup(uni, a, b, la, lb, lu)


def shade(mob, color=LAV, opacity=0.55):
    return mob.set_fill(color, opacity).set_stroke(width=0)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 0"
    title = "Conjuntos"
    subtitle = "Notación, tipos y operaciones"


class S01_QueEs(MBScene):
    def construct(self):
        self.mark("¿Qué es un conjunto?")
        self.set_header(R"\{\ \}", "Conjunto", LAV, P_LAV)
        self.say("Un conjunto es una colección de objetos que se puede decidir sin dudas: dado cualquier objeto, se sabe si está o no está. A esos objetos se les llama elementos.", fox=True)
        bag = Ellipse(width=5.2, height=3.0).set_stroke(LAV, 4).set_fill(P_LAV, 0.6).move_to(2.6 * UP)
        name = M("V", size=60, color=LAV).next_to(bag, LEFT, buff=0.25).shift(0.9 * UP)
        letters = VGroup(*[TB(c, size=48, color=INK) for c in "aeiou"])
        for l, p in zip(letters, [(-1.6, 0.4), (-0.6, -0.6), (0.3, 0.5), (1.2, -0.5), (1.9, 0.5)]):
            l.move_to(bag.get_center() + np.array([p[0] * 0.95, p[1] * 0.9, 0]))
        self.play(DrawBorderThenFill(bag), FadeIn(name))
        self.play(LaggedStartMap(FadeIn, letters, shift=0.3 * DOWN, lag_ratio=0.15), run_time=1.4)
        self.hold()
        self.say("Las vocales forman un conjunto: la e está adentro, la be no. Se escribe con el símbolo «pertenece» y su versión tachada, «no pertenece».")
        b = TB("b", size=48, color=MUTED).next_to(bag, RIGHT, buff=0.35)
        self.play(FadeIn(b, shift=0.2 * LEFT))
        rel = VGroup(M(R"e \in V", size=60, color=MINT), M(R"b \notin V", size=60, color=CORAL)).arrange(RIGHT, buff=1.2).move_to(0.0)
        self.play(Write(rel[0]))
        self.play(Write(rel[1]))
        self.zoom_to(rel, scale=0.55)
        self.hold()
        self.zoom_reset()
        self.say("En cambio, «los números bonitos» no es un conjunto: cada quien opina distinto y no se puede decidir quién entra.")
        cards = VGroup(
            VGroup(T("las vocales", size=30), check_mark(MINT, 48)).arrange(RIGHT, buff=0.3),
            VGroup(T("los números bonitos", size=30), ex_mark(CORAL, 48)).arrange(RIGHT, buff=0.3),
        ).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to(2.6 * DOWN)
        self.play(LaggedStartMap(FadeIn, cards, shift=0.2 * UP, lag_ratio=0.5))
        notation = T("Conjuntos con mayúscula, elementos entre llaves", size=26, color=MUTED).move_to(4.3 * DOWN)
        self.play(FadeIn(notation))
        self.hold(0.5)
        self.end_section()


class S02_Describir(MBScene):
    def construct(self):
        self.mark("Extensión y comprensión")
        self.set_header(R"\{x : \dots\}", "Describir un conjunto", SKY, P_SKY)
        self.say("Hay dos formas de describir un conjunto. Por extensión, se escriben todos sus elementos. Por comprensión, se da la condición que los define.", fox=True)
        ext = M(R"P = \{2,\ 4,\ 6,\ 8\}", size=60, color=INK).move_to(3.2 * UP)
        tag1 = why_pill("extensión: la lista", SKY).next_to(ext, DOWN, buff=0.2)
        self.play(Write(ext), FadeIn(tag1))
        com = M(R"P = \{x \in \mathbb{N} : x \text{ es par},\ x < 10\}", size=46, color=INK).move_to(0.9 * UP)
        com.set_max_width(7.2)
        tag2 = why_pill("comprensión: la condición", HONEY).next_to(com, DOWN, buff=0.2)
        self.play(Write(com), FadeIn(tag2))
        self.say("Los dos puntos se leen «tales que»: los x naturales, tales que x es par y menor que diez. Los naturales son los números para contar: uno, dos, tres, y así sin fin.")
        nat = M(R"\mathbb{N} = \{1, 2, 3, \dots\}", size=44, color=HONEY).next_to(tag2, DOWN, buff=0.45)
        self.play(FadeIn(nat, shift=0.2 * UP))
        self.zoom_to(VGroup(com, nat), scale=0.55)
        self.hold()
        self.zoom_reset()
        self.end_section()
        self.mark("Orden, repeticiones y cardinal")
        self.say("En un conjunto no importa el orden, y repetir un elemento no lo agrega dos veces. Estos tres son el mismo conjunto.", fox=True)
        eq = M(R"\{1, 2, 3\} = \{3, 1, 2\} = \{1, 2, 2, 3\}", size=48, color=INK).move_to(2.6 * UP)
        eq.set_max_width(7.2)
        self.play(Write(eq))
        self.hold()
        self.say("El cardinal, ene de A, cuenta cuántos elementos distintos tiene el conjunto.")
        card = VGroup(M(R"n(P) = 4", size=56, color=MINT), M(R"n(\{1, 2, 2, 3\}) = 3", size=48, color=MINT)).arrange(DOWN, buff=0.4).move_to(0.2 * DOWN)
        self.play(FadeIn(card[0], shift=0.2 * UP))
        self.play(FadeIn(card[1], shift=0.2 * UP))
        ex = formula_card(R"\{x \in \mathbb{N} : x < 4\} = \{1, 2, 3\}", color=SKY, size=42).move_to(2.9 * DOWN)
        self.say("Otro ejemplo: los naturales menores que cuatro son uno, dos y tres.")
        self.play(FadeIn(ex, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_Tipos(MBScene):
    def construct(self):
        self.mark("Tipos de conjuntos")
        self.set_header(R"\varnothing", "Tipos", HONEY, P_HONEY)
        self.say("Según cuántos elementos tienen, los conjuntos reciben nombres. El vacío no tiene ninguno: se escribe con llaves sin nada, o con este símbolo.", fox=True)
        rows = [
            (R"\varnothing = \{\ \}", "vacío: ningún elemento", HONEY),
            (R"\{7\}", "unitario: un solo elemento", MINT),
            (R"\{a, b, c\}", "finito: se terminan de contar", SKY),
            (R"\mathbb{N} = \{1, 2, 3, \dots\}", "infinito: nunca se acaban", PINK),
            (R"U", "universal: todo lo que se estudia", LAV),
        ]
        cards = VGroup()
        for tex, txt, col in rows:
            content = VGroup(M(tex, size=44, color=col), T(txt, size=24, color=INK)).arrange(RIGHT, buff=0.35)
            content.set_max_width(6.6)
            card = get_card(content, color=col, fill=PEACH, buff=0.22)
            card.stretch_to_fit_width(7.0)
            cards.add(VGroup(card, content.move_to(card)))
        cards.arrange(DOWN, buff=0.25).move_to(1.4 * UP)
        for c in cards:
            self.play(FadeIn(c, shift=0.2 * RIGHT), run_time=0.7)
            self.wait(0.3)
        self.hold()
        self.end_section()
        self.mark("La trampa del vacío")
        self.say("Una trampa: llaves con el símbolo de vacío adentro no es el conjunto vacío. Es una caja que contiene una caja vacía: tiene un elemento.", fox=True)
        box1 = RoundedRectangle(2.6, 2.0, corner_radius=0.2).set_stroke(HONEY, 4).move_to(1.6 * LEFT + 1.6 * UP)
        box2 = RoundedRectangle(2.6, 2.0, corner_radius=0.2).set_stroke(HONEY, 4).move_to(1.6 * RIGHT + 1.6 * UP)
        inner = RoundedRectangle(1.2, 0.9, corner_radius=0.12).set_stroke(MUTED, 3).move_to(box2)
        l1 = M(R"\varnothing", size=50, color=HONEY).next_to(box1, DOWN, buff=0.3)
        l2 = M(R"\{\varnothing\}", size=50, color=HONEY).next_to(box2, DOWN, buff=0.3)
        self.play(ShowCreation(box1), ShowCreation(box2), FadeIn(l1), FadeIn(l2))
        self.play(GrowFromCenter(inner))
        n = VGroup(M(R"n(\varnothing) = 0", size=44, color=MINT), M(R"n(\{\varnothing\}) = 1", size=44, color=CORAL)).arrange(RIGHT, buff=0.8).move_to(1.6 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.zoom_to(VGroup(box2, l2, n[1]), scale=0.5)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S04_Relaciones(MBScene):
    def construct(self):
        self.mark("Subconjunto")
        self.set_header(R"B \subseteq A", "Relaciones", MINT, P_MINT)
        self.say("B es subconjunto de A cuando todo elemento de B también está en A. En el dibujo, el círculo de B queda adentro del de A.", fox=True)
        A = Circle(radius=2.1).set_stroke(SKY, 4).set_fill(SKY, 0.15).move_to(2.2 * UP)
        B = Circle(radius=1.0).set_stroke(CORAL, 4).set_fill(CORAL, 0.2).move_to(2.0 * UP + 0.5 * RIGHT)
        la = M("A", size=40, color=SKY).move_to(A.get_center() + 1.55 * UL)
        lb = M("B", size=36, color=CORAL).move_to(B.get_center() + 0.75 * UR)
        ea = VGroup(*[TB(c, size=36) for c in "ac"])
        ea[0].move_to(A.get_center() + 1.3 * LEFT + 0.3 * UP); ea[1].move_to(A.get_center() + 0.9 * LEFT + 0.9 * DOWN)
        eb = VGroup(*[TB(c, size=36) for c in "bd"]).arrange(RIGHT, buff=0.45).move_to(B)
        self.play(ShowCreation(A), FadeIn(la), FadeIn(ea))
        self.play(ShowCreation(B), FadeIn(lb), FadeIn(eb))
        sub = M(R"\{b, d\} \subseteq \{a, b, c, d\}", size=48, color=INK).move_to(1.0 * DOWN)
        self.play(Write(sub))
        self.hold()
        self.say("El vacío es subconjunto de cualquier conjunto: no tiene ningún elemento que pueda quedar por fuera. Y todo conjunto es subconjunto de sí mismo.")
        facts = VGroup(M(R"\varnothing \subseteq A", size=44, color=HONEY), M(R"A \subseteq A", size=44, color=HONEY)).arrange(RIGHT, buff=1.0).move_to(2.4 * DOWN)
        self.play(FadeIn(facts, shift=0.2 * UP))
        self.hold()
        self.end_section()
        self.mark("Iguales y disjuntos")
        self.say("Dos conjuntos son iguales cuando cada uno es subconjunto del otro: tienen exactamente los mismos elementos.", fox=True)
        e = formula_card(R"A = B \iff A \subseteq B \text{ y } B \subseteq A", color=MINT, size=40).move_to(3.4 * UP)
        self.play(FadeIn(e, shift=0.2 * UP))
        self.hold()
        self.say("Y son disjuntos cuando no comparten ningún elemento: su intersección es vacía. Sus círculos no se tocan.")
        c1 = Circle(radius=1.2).set_stroke(SKY, 4).set_fill(SKY, 0.15).move_to(1.8 * LEFT + 0.4 * DOWN)
        c2 = Circle(radius=1.2).set_stroke(CORAL, 4).set_fill(CORAL, 0.15).move_to(1.8 * RIGHT + 0.4 * DOWN)
        t1 = T("rojo\nazul", size=28, alignment="CENTER").move_to(c1)
        t2 = T("verde", size=28).move_to(c2)
        self.play(ShowCreation(c1), ShowCreation(c2), FadeIn(t1), FadeIn(t2))
        dj = M(R"A \cap B = \varnothing", size=48, color=CORAL).move_to(2.9 * DOWN)
        self.play(Write(dj))
        self.hold(0.5)
        self.end_section()


class S05_Partes(MBScene):
    def construct(self):
        self.mark("El conjunto de partes")
        self.set_header(R"P(A)", "Todos los subconjuntos", PINK, P_PINK)
        self.say("¿Cuántos subconjuntos tiene a, be, ce? Cada elemento decide: entra o no entra. Es un árbol de decisiones.", fox=True)
        root = Dot(4.2 * UP, radius=0.09).set_fill(INK, 1)
        self.play(GrowFromCenter(root))
        levels = [root]
        nodes = [[(root.get_center(), [])]]
        edges = VGroup()
        ys = [4.2, 2.8, 1.4, 0.0]
        for d, el in enumerate("abc"):
            new = []
            width = 6.8 / (2 ** (d + 1))
            anims = []
            for k, (pt, chosen) in enumerate(nodes[-1]):
                for s, (inside, col) in enumerate([(True, MINT), (False, CORAL)]):
                    x = -3.4 + width * (2 * k + s + 0.5)
                    q = np.array([x, ys[d + 1], 0])
                    e = Line(pt, q).set_stroke(col, 3)
                    lab = T(el if inside else "—", size=20, color=col).move_to((pt + q) / 2 + 0.18 * (LEFT if s == 0 else RIGHT))
                    edges.add(e, lab)
                    anims += [ShowCreation(e), FadeIn(lab)]
                    new.append((q, chosen + ([el] if inside else [])))
            self.play(*anims, run_time=1.0)
            nodes.append(new)
        leaves = VGroup()
        for q, chosen in nodes[-1]:
            tex = R"\{" + ",".join(chosen) + R"\}" if chosen else R"\varnothing"
            leaves.add(M(tex, size=26, color=INK).move_to(q + 0.45 * DOWN))
        self.play(LaggedStartMap(FadeIn, leaves, shift=0.15 * DOWN, lag_ratio=0.1), run_time=1.6)
        self.say("Al final hay dos por dos por dos hojas: ocho subconjuntos, desde el vacío hasta el conjunto completo.")
        self.zoom_to(leaves, scale=0.55)
        self.hold()
        self.zoom_reset()
        f = formula_card(R"n(A) = 3 \;\Rightarrow\; n(P(A)) = 2^3 = 8", color=PINK, size=42).move_to(2.6 * DOWN)
        self.play(FadeIn(f, shift=0.2 * UP))
        self.say("En general, un conjunto de n elementos tiene dos a la ene subconjuntos.")
        gen = M(R"n(P(A)) = 2^{\,n(A)}", size=52, color=HONEY).move_to(4.0 * DOWN)
        self.play(Write(gen))
        self.hold(0.5)
        self.end_section()


class S06_Operaciones(MBScene):
    def construct(self):
        self.mark("El diagrama de Venn")
        self.set_header(R"A \cup B", "Operaciones", LAV, P_LAV)
        self.say("Para operar, los conjuntos se dibujan como círculos dentro de un rectángulo, el universo. Aquí A es uno, dos, tres, cuatro; B es tres, cuatro, cinco, seis; y el universo va del uno al ocho.", fox=True)
        data = VGroup(M(R"A = \{1, 2, 3, 4\}", size=36, color=SKY), M(R"B = \{3, 4, 5, 6\}", size=36, color=CORAL),
                      M(R"U = \{1, 2, \dots, 8\}", size=36, color=MUTED)).arrange(DOWN, buff=0.15).move_to(4.3 * UP)
        self.play(FadeIn(data))
        V = venn(center=1.2 * UP)
        uni, a, b = V[0], V[1], V[2]
        self.play(FadeIn(uni), ShowCreation(a), ShowCreation(b), FadeIn(V[3:]))
        ca, cb = a.get_center(), b.get_center()
        pos = {"1": ca + 0.85 * LEFT + 0.45 * UP, "2": ca + 0.8 * LEFT + 0.5 * DOWN, "3": (ca + cb) / 2 + 0.4 * UP, "4": (ca + cb) / 2 + 0.4 * DOWN,
               "5": cb + 0.85 * RIGHT + 0.45 * UP, "6": cb + 0.8 * RIGHT + 0.5 * DOWN, "7": uni.get_corner(DR) + 0.5 * UL, "8": uni.get_corner(DL) + 0.5 * UR}
        nums = VGroup(*[TB(k, size=32).move_to(v) for k, v in pos.items()])
        self.play(LaggedStartMap(FadeIn, nums, lag_ratio=0.1), run_time=1.4)
        self.hold()
        ops = [
            ("Unión", R"A \cup B = \{1, 2, 3, 4, 5, 6\}", "lo que está en A o en B (o en los dos)", lambda: Union(a, b), SKY),
            ("Intersección", R"A \cap B = \{3, 4\}", "lo que está en A y en B a la vez", lambda: Intersection(a, b), MINT),
            ("Diferencia", R"A - B = \{1, 2\}", "lo que está en A pero no en B", lambda: Difference(a, b), HONEY),
            ("Complemento", R"A^c = \{5, 6, 7, 8\}", "lo del universo que no está en A", lambda: Difference(uni, a), PINK),
            ("Diferencia simétrica", R"A \,\triangle\, B = \{1, 2, 5, 6\}", "lo que está en uno solo de los dos", lambda: Exclusion(a, b), CORAL),
        ]
        says = [
            "La unión junta todo: los elementos que están en A, en B o en ambos. Se lee A unión B.",
            "La intersección se queda solo con lo común: tres y cuatro.",
            "La diferencia A menos B quita de A lo que también está en B: quedan uno y dos.",
            "El complemento de A es todo lo del universo que no está en A: cinco, seis, siete y ocho.",
            "La diferencia simétrica son las dos lunas: lo que está en uno solo de los conjuntos.",
        ]
        card = None
        region = None
        for (name, tex, desc, mk, col), s in zip(ops, says):
            self.mark(name)
            self.say(s)
            new_region = shade(mk(), col, 0.5)
            new_card = VGroup(TB(name, size=30, color=col), M(tex, size=44, color=INK), T(desc, size=24, color=MUTED)).arrange(DOWN, buff=0.18).move_to(2.6 * DOWN)
            new_card[1].set_max_width(7.0)
            anims = [FadeIn(new_region)]
            if region is not None:
                anims.append(FadeOut(region))
            if card is not None:
                anims.append(FadeOut(card))
            self.add(new_region)
            self.bring_to_front(a, b, nums)
            self.play(*anims, FadeIn(new_card, shift=0.2 * UP), run_time=1.0)
            if name == "Intersección":
                self.zoom_to(VGroup(new_region, nums[2], nums[3]), scale=0.45)
                self.hold()
                self.zoom_reset()
            else:
                self.hold()
            region, card = new_region, new_card
        self.end_section()


class S07_Contar(MBScene):
    def construct(self):
        self.mark("Contar con Venn")
        self.set_header(R"n(A \cup B)", "Contar", MINT, P_MINT)
        self.say("Se preguntó a treinta y cinco personas: veinte toman café, dieciocho toman té y ocho toman las dos cosas. ¿Cuántas no toman ninguna?", fox=True)
        V = venn(center=1.4 * UP, r=1.5, sep=1.0)
        V[3].become(T("café", size=30, color=SKY).move_to(V[1].get_center() + 1.15 * UL + 0.2 * UP))
        V[4].become(T("té", size=30, color=CORAL).move_to(V[2].get_center() + 1.15 * UR + 0.2 * UP))
        self.play(FadeIn(V))
        ca, cb = V[1].get_center(), V[2].get_center()
        self.say("Siempre se empieza por el centro: los ocho que toman las dos cosas.")
        mid = TB("8", size=44, color=MINT).move_to((ca + cb) / 2)
        self.play(FadeIn(mid, scale=1.4))
        self.say("Solo café: veinte menos ocho, doce. Solo té: dieciocho menos ocho, diez.")
        left = TB("12", size=44, color=SKY).move_to(ca + 0.8 * LEFT)
        right = TB("10", size=44, color=CORAL).move_to(cb + 0.8 * RIGHT)
        self.play(FadeIn(left, shift=0.2 * RIGHT), FadeIn(right, shift=0.2 * LEFT))
        steps = VGroup(M(R"12 + 8 + 10 = 30", size=42), M(R"35 - 30 = 5 \text{ ninguna}", size=42, color=HONEY)).arrange(DOWN, buff=0.3).move_to(2.2 * DOWN)
        self.play(Write(steps[0]))
        out = TB("5", size=44, color=HONEY).move_to(V[0].get_corner(DR) + 0.55 * UL)
        self.play(Write(steps[1]), FadeIn(out, scale=1.4))
        self.hold()
        self.say("Por eso, al contar la unión, a la suma de los dos grupos se le resta la intersección: los del centro se habían contado dos veces.")
        f = formula_card(R"n(A \cup B) = n(A) + n(B) - n(A \cap B)", color=MINT, size=38).move_to(4.0 * DOWN)
        self.play(FadeIn(f, shift=0.2 * UP))
        self.zoom_to(f, scale=0.45)
        self.hold()
        self.zoom_reset()
        ex = M(R"20 + 18 - 8 = 30", size=40, color=MINT).next_to(f, UP, buff=0.25)
        self.play(FadeOut(steps), FadeIn(ex))
        self.hold(0.5)
        self.end_section()


class S08_Cierre(AlgCierre):
    recap = [
        ("Conjunto", "colección bien definida:  e ∈ V,  b ∉ V", LAV),
        ("Describir", "extensión {2, 4, 6, 8}  ·  comprensión {x : condición}", SKY),
        ("Tipos", "vacío ∅, unitario, finito, infinito, universal U", HONEY),
        ("Relaciones", "B ⊆ A,  A = B,  disjuntos: A ∩ B = ∅", MINT),
        ("Partes", "n elementos ⇒ 2ⁿ subconjuntos", PINK),
        ("Operaciones", "A ∪ B,  A ∩ B,  A − B,  Aᶜ,  A △ B", CORAL),
        ("Contar", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", MINT),
    ]
    recap_say = "Los conjuntos son el idioma de toda la matemática: con llaves, círculos y unas pocas operaciones se describe cualquier colección."
    practice = "Atrapa elementos, mueve círculos y pinta diagramas"
