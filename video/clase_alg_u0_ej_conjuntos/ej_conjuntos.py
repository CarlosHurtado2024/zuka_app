"""
Álgebra EC0 · Ejemplos resueltos de conjuntos (complemento de C0, lección alg-0, 9:16, fondo morado vivo).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Sin 3D; el acercamiento de cámara solo donde
hace falta (la trampa de {2} ⊆ A). Pasar de comprensión a extensión y al revés (incluidas las letras de
MATEMÁTICA), ∈ contra ⊆ con A = {1, {2}, 3}, el conjunto de partes de {x, y} y cuántos elementos tiene A si
n(P(A)) = 64, las seis operaciones con pares y múltiplos de 3 en U = {1, …, 10} sobre un Venn, la ley de De Morgan
comprobada con listas y una encuesta donde la incógnita es la intersección. Ninguno repite los ejemplos del
video C0 ni los ejercicios. Spec 2026-11-09-algebra-conjuntos.

    manimgl ej_conjuntos.py S04_Operaciones -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Ejemplos resueltos"
    title = "Conjuntos\npaso a paso"
    subtitle = "Notación, partes, operaciones y conteo"


class S01_Describir(ExScene):
    def construct(self):
        self.mark("Ejemplo 1: de comprensión a extensión")
        self.set_header(R"\{x : \dots\}", "Describir", SKY, P_SKY)
        self.problem(1, "Escribe por extensión A = {x ∈ ℕ : 3 < x ≤ 8} y halla n(A)", SKY)
        self.say("Se lee la condición como un filtro. Más grande que tres, así que el tres no entra; menor o igual que ocho, así que el ocho sí.", fox=True)
        self.step(R"3 < x \;\Rightarrow\; 3 \notin A", "< deja el borde por fuera", CORAL, why_color=CORAL)
        self.step(R"x \le 8 \;\Rightarrow\; 8 \in A", "≤ incluye el borde", MINT, why_color=MINT)
        self.step(R"A = \{4, 5, 6, 7, 8\}", "extensión: la lista", SKY, why_color=SKY)
        self.answer(R"n(A) = 5", color=SKY)
        self.hold()
        self.end_section()
        self.mark("Ejemplo 2: de extensión a comprensión")
        self.problem(2, "Describe por comprensión B = {1, 4, 9, 16, 25}", SKY)
        self.say("Hay que encontrar el patrón. Uno es uno por uno, cuatro es dos por dos, nueve es tres por tres: son cuadrados.", fox=True)
        self.step(R"1 = 1^2,\ 4 = 2^2,\ 9 = 3^2,\ 16 = 4^2,\ 25 = 5^2", "buscar el patrón", HONEY, why_color=HONEY)
        self.say("La condición dice de qué forma son y hasta dónde llegan: cuadrados de los naturales del uno al cinco.")
        self.answer(R"B = \{n^2 : n \in \mathbb{N},\ n \le 5\}", color=SKY, size=44)
        self.hold()
        self.end_section()
        self.mark("Ejemplo 3: las letras de una palabra")
        self.problem(3, "C = {x : x es una letra de MATEMATICA}. Escríbelo por extensión y halla n(C)", SKY)
        self.say("La palabra tiene diez letras, pero muchas se repiten. En un conjunto cada elemento se escribe una sola vez.", fox=True)
        self.step(R"M, A, T, E, M, A, T, I, C, A", "10 letras en la palabra", MUTED)
        self.step(R"C = \{M, A, T, E, I, C\}", "sin repetir", SKY, why_color=SKY)
        self.answer(R"n(C) = 6", color=SKY)
        self.hold(0.5)
        self.end_section()


class S02_Pertenece(ExScene):
    def construct(self):
        self.mark("Ejemplo 4: ¿pertenece o es subconjunto?")
        self.set_header(R"\in \text{ vs } \subseteq", "Pertenecer", MINT, P_MINT)
        self.problem(4, "Sea A = {1, {2}, 3}. ¿Cuáles son verdaderas: 2 ∈ A, {2} ∈ A, {1, 3} ⊆ A, {2} ⊆ A, ∅ ⊆ A?", MINT)
        self.say("Primero, contar los elementos de A: el uno, la caja que tiene un dos adentro, y el tres. A tiene tres elementos, y el dos suelto no es uno de ellos.", fox=True)
        self.step(R"A = \{\,1,\ \{2\},\ 3\,\} \qquad n(A) = 3", "la caja {2} es UN elemento", MUTED)
        self.say("Pertenecer se pregunta por un elemento: ¿está en la lista? Ser subconjunto se pregunta por un conjunto: ¿todos sus elementos están en la lista?")
        self.step(R"2 \in A \quad \text{falso}", "el 2 suelto no está en la lista", CORAL, why_color=CORAL)
        self.step(R"\{2\} \in A \quad \text{verdadero}", "la caja {2} sí está en la lista", MINT, why_color=MINT)
        self.step(R"\{1, 3\} \subseteq A \quad \text{verdadero}", "el 1 y el 3 están en A", MINT, why_color=MINT)
        trap = self.step(R"\{2\} \subseteq A \quad \text{falso}", "necesitaría que 2 ∈ A, y no lo está", CORAL, why_color=CORAL)
        self.say("Esta es la trampa: para que la cajita con el dos sea subconjunto, su elemento, el dos, tendría que estar en A. No está.")
        self.zoom_to(trap, scale=0.45)
        self.hold()
        self.zoom_reset()
        self.step(R"\varnothing \subseteq A \quad \text{verdadero}", "el vacío es subconjunto de todo", MINT, why_color=MINT)
        self.hold(0.5)
        self.end_section()


class S03_Partes(ExScene):
    def construct(self):
        self.mark("Ejemplo 5: el conjunto de partes")
        self.set_header(R"P(A)", "Partes", PINK, P_PINK)
        self.problem(5, "Escribe P({x, y}). Si P(A) tiene 64 elementos, ¿cuántos tiene A?", PINK)
        self.say("Para listar los subconjuntos conviene ordenarlos por tamaño: el vacío, luego los de un elemento, luego el completo.", fox=True)
        self.step(R"\text{0 elementos: } \varnothing", "el vacío siempre está", MUTED)
        self.step(R"\text{1 elemento: } \{x\},\ \{y\}", "uno por uno", MUTED)
        self.step(R"\text{2 elementos: } \{x, y\}", "el conjunto completo también", MUTED)
        self.step(R"P(\{x, y\}) = \{\varnothing,\ \{x\},\ \{y\},\ \{x, y\}\}", "4 = 2² subconjuntos", PINK, why_color=PINK)
        self.say("Ahora al revés: si hay sesenta y cuatro subconjuntos, buscamos la potencia de dos que da sesenta y cuatro. Dos por sí mismo seis veces.")
        self.step(R"2^{\,n(A)} = 64 = 2^6", "n(P(A)) = 2^n(A)", HONEY, why_color=HONEY)
        self.answer(R"n(A) = 6", color=PINK)
        self.hold(0.5)
        self.end_section()


class S04_Operaciones(MBScene):
    def construct(self):
        self.mark("Ejemplo 6: seis operaciones en un Venn")
        self.set_header(R"A \cup B", "Operaciones", LAV, P_LAV)
        self.say("Sea U los números del uno al diez, A los pares y B los múltiplos de tres. Primero se escriben por extensión y se ubican en el diagrama.", fox=True)
        data = VGroup(
            M(R"U = \{1, 2, \dots, 10\}", size=36, color=MUTED),
            M(R"A = \{2, 4, 6, 8, 10\}", size=36, color=SKY),
            M(R"B = \{3, 6, 9\}", size=36, color=CORAL),
        ).arrange(DOWN, buff=0.14).move_to(4.35 * UP)
        self.play(LaggedStartMap(FadeIn, data, shift=0.2 * DOWN, lag_ratio=0.3))
        uni = RoundedRectangle(7.0, 4.0, corner_radius=0.25).set_stroke(MUTED, 2).set_fill(CARD, 0.6).move_to(1.2 * UP)
        a = Circle(radius=1.45).set_stroke(SKY, 4).move_to(uni.get_center() + 0.9 * LEFT)
        b = Circle(radius=1.45).set_stroke(CORAL, 4).move_to(uni.get_center() + 0.9 * RIGHT)
        la = M("A", size=38, color=SKY).move_to(a.get_center() + 1.15 * UL)
        lb = M("B", size=38, color=CORAL).move_to(b.get_center() + 1.15 * UR)
        self.play(FadeIn(uni), ShowCreation(a), ShowCreation(b), FadeIn(la), FadeIn(lb))
        ca, cb, mid = a.get_center(), b.get_center(), (a.get_center() + b.get_center()) / 2
        spots = {"6": mid, "2": ca + 0.85 * LEFT + 0.6 * UP, "4": ca + 1.0 * LEFT, "8": ca + 0.85 * LEFT + 0.6 * DOWN, "10": ca + 0.3 * LEFT + 0.95 * DOWN,
                 "3": cb + 0.8 * RIGHT + 0.45 * UP, "9": cb + 0.8 * RIGHT + 0.45 * DOWN,
                 "1": uni.get_corner(UL) + 0.45 * DR + 0.25 * DOWN, "5": uni.get_corner(DL) + 0.5 * UR, "7": uni.get_corner(DR) + 0.5 * UL}
        self.say("El seis es par y múltiplo de tres: va en el centro. Los demás pares van en la luna de A, el tres y el nueve en la de B, y el uno, el cinco y el siete quedan afuera.")
        order = ["6", "2", "4", "8", "10", "3", "9", "1", "5", "7"]
        nums = {k: TB(k, size=30).move_to(spots[k]) for k in order}
        self.play(LaggedStart(*[FadeIn(nums[k], scale=1.3) for k in order], lag_ratio=0.15), run_time=2.6)
        self.hold()
        ops = [
            (R"A \cup B = \{2, 3, 4, 6, 8, 9, 10\}", lambda: Union(a, b), SKY, "todo lo que está en A o en B"),
            (R"A \cap B = \{6\}", lambda: Intersection(a, b), MINT, "lo común"),
            (R"A - B = \{2, 4, 8, 10\}", lambda: Difference(a, b), HONEY, "de A se quita lo que está en B"),
            (R"B - A = \{3, 9\}", lambda: Difference(b, a), CORAL, "de B se quita lo que está en A: no es lo mismo"),
            (R"A^c = \{1, 3, 5, 7, 9\}", lambda: Difference(uni, a), PINK, "los impares: lo que no está en A"),
            (R"(A \cup B)^c = \{1, 5, 7\}", lambda: Difference(uni, Union(a, b)), LAV, "fuera de los dos círculos"),
        ]
        says = [
            "La unión reúne las dos listas sin repetir: el seis se escribe una sola vez.",
            "La intersección solo tiene al seis.",
            "A menos B: los pares que no son múltiplos de tres.",
            "B menos A: el tres y el nueve. El orden en la diferencia importa.",
            "El complemento de A son los impares del universo.",
            "Y el complemento de la unión son los que no están en ningún círculo: uno, cinco y siete.",
        ]
        region = card = None
        for (tex, mk, col, desc), s in zip(ops, says):
            self.say(s)
            new_region = mk().set_fill(col, 0.45).set_stroke(width=0)
            new_card = VGroup(M(tex, size=42, color=INK), T(desc, size=24, color=MUTED)).arrange(DOWN, buff=0.15).move_to(2.6 * DOWN)
            new_card[0].set_max_width(7.0)
            self.add(new_region)
            self.bring_to_front(a, b, *nums.values())
            anims = [FadeIn(new_region), FadeIn(new_card, shift=0.2 * UP)]
            if region is not None:
                anims += [FadeOut(region), FadeOut(card)]
            self.play(*anims, run_time=0.9)
            self.hold()
            region, card = new_region, new_card
        self.end_section()


class S05_DeMorgan(ExScene):
    def construct(self):
        self.mark("Ejemplo 7: comprobar una ley")
        self.set_header(R"(A \cup B)^c = A^c \cap B^c", "De Morgan", HONEY, P_HONEY)
        self.problem(7, "Con los mismos U, A y B, comprueba que (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ", HONEY)
        self.say("Una igualdad entre conjuntos se comprueba calculando cada lado por separado y comparando las listas.", fox=True)
        self.step(R"(A \cup B)^c = \{1, 5, 7\}", "lado izquierdo: ya lo calculamos", SKY, why_color=SKY)
        self.say("Para el lado derecho se necesitan los dos complementos y luego lo que tienen en común.")
        self.step(R"A^c = \{1, 3, 5, 7, 9\}", "los impares", PINK, why_color=PINK)
        self.step(R"B^c = \{1, 2, 4, 5, 7, 8, 10\}", "lo que no es múltiplo de 3", PINK, why_color=PINK)
        self.step(R"A^c \cap B^c = \{1, 5, 7\}", "lo común a las dos listas", MINT, why_color=MINT)
        self.answer(R"(A \cup B)^c = A^c \cap B^c = \{1, 5, 7\}", color=HONEY, size=40)
        self.say("Coinciden. En palabras: no estar en la unión es lo mismo que no estar en A y tampoco en B.")
        self.hold(0.5)
        self.end_section()


class S06_Encuesta(MBScene):
    def construct(self):
        self.mark("Ejemplo 8: hallar la intersección")
        self.set_header(R"n(A \cap B)", "Encuesta", MINT, P_MINT)
        self.say("En un grupo de sesenta personas, treinta y cinco leen, veintiocho hacen ejercicio y diez no hacen ninguna de las dos. ¿Cuántas hacen las dos cosas?", fox=True)
        text = T("60 personas · 35 leen · 28 hacen ejercicio · 10 ninguna", size=26, color=INK).move_to(4.4 * UP)
        text.set_max_width(7.2)
        self.play(FadeIn(text))
        uni = RoundedRectangle(7.0, 3.8, corner_radius=0.25).set_stroke(MUTED, 2).set_fill(CARD, 0.6).move_to(1.5 * UP)
        a = Circle(radius=1.4).set_stroke(SKY, 4).move_to(uni.get_center() + 0.85 * LEFT + 0.1 * DOWN)
        b = Circle(radius=1.4).set_stroke(CORAL, 4).move_to(uni.get_center() + 0.85 * RIGHT + 0.1 * DOWN)
        la = T("leen", size=26, color=SKY).next_to(a, UP, buff=-0.05).shift(0.6 * LEFT)
        lb = T("ejercicio", size=26, color=CORAL).next_to(b, UP, buff=-0.05).shift(0.6 * RIGHT)
        self.play(FadeIn(uni), ShowCreation(a), ShowCreation(b), FadeIn(la), FadeIn(lb))
        out = TB("10", size=40, color=HONEY).move_to(uni.get_corner(DR) + 0.55 * UL)
        self.say("Lo que sí sabemos va primero: los diez de ninguna, afuera de los círculos. Entonces dentro de los círculos hay sesenta menos diez: cincuenta.")
        self.play(FadeIn(out, scale=1.4))
        steps = VGroup(
            M(R"n(A \cup B) = 60 - 10 = 50", size=40),
            M(R"n(A \cup B) = n(A) + n(B) - n(A \cap B)", size=36, color=MUTED),
            M(R"50 = 35 + 28 - x \;\Rightarrow\; x = 13", size=42, color=MINT),
        ).arrange(DOWN, buff=0.32).move_to(2.0 * DOWN)
        self.play(Write(steps[0]))
        self.hold()
        self.say("La fórmula de la unión tiene una sola incógnita, la intersección. Treinta y cinco más veintiocho son sesenta y tres; sobran trece, que se contaron dos veces.")
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.play(Write(steps[2]))
        mid = TB("13", size=40, color=MINT).move_to((a.get_center() + b.get_center()) / 2)
        self.play(FadeIn(mid, scale=1.4))
        self.hold()
        self.say("Con el centro listo, se completan las lunas: solo leen veintidós y solo hacen ejercicio quince. Comprobación: veintidós más trece más quince más diez, sesenta.")
        l1 = TB("22", size=40, color=SKY).move_to(a.get_center() + 0.75 * LEFT)
        l2 = TB("15", size=40, color=CORAL).move_to(b.get_center() + 0.75 * RIGHT)
        self.play(FadeIn(l1, shift=0.2 * RIGHT), FadeIn(l2, shift=0.2 * LEFT))
        chk = formula_card(R"22 + 13 + 15 + 10 = 60 \;\checkmark", color=MINT, size=40).move_to(4.4 * DOWN)
        self.play(FadeIn(chk, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S07_Cierre(AlgCierre):
    recap = [
        ("Leer la condición", "< deja el borde fuera, ≤ lo incluye", SKY),
        ("Sin repetir", "MATEMATICA tiene 6 letras distintas", SKY),
        ("∈ y ⊆", "∈ pregunta por un elemento; ⊆, por todos los de un conjunto", MINT),
        ("Partes", "n(P(A)) = 2ⁿ:  64 = 2⁶", PINK),
        ("El orden importa", "A − B no es B − A", HONEY),
        ("Contar", "empezar por lo que se sabe y usar n(A ∪ B)", MINT),
    ]
    recap_say = "Con conjuntos todo se resuelve igual: escribir las listas, ubicarlas en el diagrama y comprobar contando."
    practice = "Ahora te toca a ti con los juegos"
