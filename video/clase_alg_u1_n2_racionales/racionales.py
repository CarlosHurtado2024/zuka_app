"""
Álgebra N2 · Los números racionales (lección alg-11b, parte 2 de sistemas numéricos, 9:16).

Desde lo más básico y conectado con la unidad de conjuntos; sin zoom ni 3D. Repartir 3 panes entre 4 (ℤ no alcanza
para dividir); qué dicen el numerador y el denominador; ℚ por comprensión {m/n : m, n ∈ ℤ, n ≠ 0} y por qué n ≠ 0;
fracciones equivalentes como varios nombres de un mismo elemento (como {O, S, O} = {O, S}); ℤ ⊆ ℚ (−3 = −3/1);
decimales que terminan (3/4 = 0.75) o se repiten (2/11 = 0.1818…) y la rayita; periódico a fracción
(0.777… = 7/9). Spec 2026-11-11-sistemas-numericos-desde-cero.

    manimgl racionales.py S02_Fraccion -w -l
"""
from alg_fx import *

BREAD = "#E0A15A"


def loaf(w=1.6, h=0.7):
    return RoundedRectangle(w, h, corner_radius=0.3).set_fill(BREAD, 1).set_stroke("#8A5A2B", 3)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Sistemas numéricos · Parte 2"
    title = "Los números\nracionales"
    subtitle = "Fracciones y decimales"


class S01_Repartir(MBScene):
    def construct(self):
        self.mark("Repartir: la división se escapa de ℤ")
        self.set_header(R"3 \div 4", "Repartir", MINT, P_MINT)
        self.say("Con los enteros ya podemos sumar, restar y multiplicar sin salirnos. Pero falta dividir. Tres panes para repartir entre cuatro amigos: a cada uno no le toca ni un pan entero.", fox=True)
        loaves = VGroup(*[loaf() for _ in range(3)]).arrange(RIGHT, buff=0.3).move_to(3.6 * UP)
        friends = VGroup(*[Circle(radius=0.35).set_fill(c, 1).set_stroke(width=0) for c in (HONEY, SKY, PINK, LAV)]).arrange(RIGHT, buff=0.9).move_to(1.6 * UP)
        self.play(LaggedStartMap(FadeIn, loaves, shift=0.2 * DOWN, lag_ratio=0.2))
        self.play(LaggedStartMap(GrowFromCenter, friends, lag_ratio=0.2))
        self.hold()
        self.say("La solución: partir cada pan en cuatro pedazos iguales. Salen doce cuartos, y a cada amigo le tocan tres. Tres cuartos de pan.")
        cuts = VGroup()
        for l in loaves:
            for k in (1, 2, 3):
                x = l.get_left()[0] + k * l.get_width() / 4
                cuts.add(Line(np.array([x, l.get_bottom()[1], 0]), np.array([x, l.get_top()[1], 0])).set_stroke("#5A3A1B", 3))
        self.play(LaggedStartMap(ShowCreation, cuts, lag_ratio=0.05), run_time=1.2)
        plates = VGroup()
        for f in friends:
            pieces = VGroup(*[RoundedRectangle(0.36, 0.6, corner_radius=0.08).set_fill(BREAD, 1).set_stroke("#8A5A2B", 2) for _ in range(3)]).arrange(RIGHT, buff=0.04)
            pieces.next_to(f, DOWN, buff=0.35)
            plates.add(pieces)
        self.play(FadeOut(cuts), FadeOut(loaves), LaggedStartMap(FadeIn, plates, shift=0.3 * DOWN, lag_ratio=0.2), run_time=1.6)
        res = M(R"3 \div 4 = \frac{3}{4} \notin \mathbb{Z}", size=56, color=MINT).move_to(1.6 * DOWN)
        self.play(Write(res))
        self.say("Tres cuartos no es un número entero: está entre cero y uno. La división se escapó de los enteros, igual que antes la resta se escapó de los naturales.")
        self.hold(0.6)
        self.end_section()


class S02_Fraccion(MBScene):
    def construct(self):
        self.mark("Qué dice una fracción")
        self.set_header(R"\frac{m}{n}", "Fracción", MINT, P_MINT)
        self.say("Una fracción tiene dos números separados por una raya. El de abajo, el denominador, dice en cuántas partes iguales se partió el entero. El de arriba, el numerador, dice cuántas partes se toman.", fox=True)
        frac = M(R"\frac{3}{4}", size=110).move_to(3.0 * UP + 1.6 * LEFT)
        top = T("numerador: cuántas partes tomo", size=24, color=HONEY).next_to(frac, RIGHT, buff=0.4).shift(0.45 * UP)
        bot = T("denominador: en cuántas partes partí", size=24, color=SKY).next_to(frac, RIGHT, buff=0.4).shift(0.45 * DOWN)
        top.set_max_width(4.2)
        bot.set_max_width(4.2)
        self.play(Write(frac))
        self.play(FadeIn(top, shift=0.2 * LEFT))
        self.play(FadeIn(bot, shift=0.2 * LEFT))
        bar = VGroup(*[Rectangle(1.4, 0.7).set_stroke(INK, 2).set_fill(MINT if k < 3 else CARD, 0.9) for k in range(4)]).arrange(RIGHT, buff=0).move_to(1.0 * UP)
        self.play(LaggedStartMap(FadeIn, bar, lag_ratio=0.2))
        self.hold()
        self.end_section()
        self.mark("ℚ por comprensión")
        self.say("Todas las fracciones de enteros forman el conjunto de los números racionales. Se escribe con una cu de doble trazo, de «cociente», y como son infinitos, se describe por comprensión, como en la unidad de conjuntos.", fox=True)
        Q = M(R"\mathbb{Q} = \left\{ \frac{m}{n} \; : \; m, n \in \mathbb{Z},\ n \neq 0 \right\}", size=52).move_to(2.8 * UP)
        Q.set_max_width(7.2)
        self.play(Write(Q))
        read = note("«Las fracciones eme sobre ene, tal que eme y ene\nson enteros, y ene es distinto de cero»", color=MINT, size=24).move_to(1.0 * UP)
        self.play(FadeIn(read, shift=0.2 * UP))
        self.hold()
        self.say("¿Por qué el de abajo no puede ser cero? Porque dividir entre cero es repartir entre cero amigos: no hay a quién darle, y la pregunta no tiene sentido.")
        nope = VGroup(M(R"\frac{3}{0}", size=80, color=CORAL), ex_mark(CORAL, 64)).arrange(RIGHT, buff=0.4).move_to(1.4 * DOWN)
        self.play(FadeIn(nope, scale=0.9))
        self.say("Ejemplos de racionales: tres cuartos, menos dos quintos, siete medios. Todos son fracciones de enteros.")
        ex = VGroup(M(R"\tfrac34 \in \mathbb{Q}", size=44, color=MINT), M(R"-\tfrac25 \in \mathbb{Q}", size=44, color=MINT), M(R"\tfrac72 \in \mathbb{Q}", size=44, color=MINT)).arrange(RIGHT, buff=0.6).move_to(3.4 * DOWN)
        self.play(LaggedStartMap(FadeIn, ex, shift=0.2 * UP, lag_ratio=0.3))
        self.hold(0.6)
        self.end_section()


class S03_Equivalentes(MBScene):
    def construct(self):
        self.mark("Muchos nombres para un mismo número")
        self.set_header(R"\tfrac12 = \tfrac24", "Equivalentes", HONEY, P_HONEY)
        self.say("Una misma cantidad se puede escribir con distintas fracciones. Medio pan, dos cuartos de pan y tres sextos de pan son exactamente la misma cantidad.", fox=True)
        bars = VGroup()
        for n in (2, 4, 6):
            k = n // 2
            bar = VGroup(*[Rectangle(5.4 / n, 0.6).set_stroke(INK, 2).set_fill(HONEY if j < k else CARD, 0.9) for j in range(n)]).arrange(RIGHT, buff=0)
            lab = M(R"\frac{%d}{%d}" % (k, n), size=44, color=HONEY)
            bars.add(VGroup(lab, bar).arrange(RIGHT, buff=0.4))
        bars.arrange(DOWN, buff=0.4, aligned_edge=RIGHT).move_to(2.6 * UP)
        for b in bars:
            self.play(FadeIn(b, shift=0.2 * RIGHT), run_time=0.8)
        line = DashedLine(bars[0][1].get_center() + 0.6 * UP, bars[2][1].get_center() + 0.6 * DOWN).set_stroke(PINK, 3)
        self.play(ShowCreation(line))
        self.hold()
        self.say("Son fracciones equivalentes: se obtienen multiplicando arriba y abajo por el mismo número. No son tres números distintos, sino tres nombres del mismo número.")
        eq = M(R"\frac12 = \frac{1 \cdot 2}{2 \cdot 2} = \frac{1 \cdot 3}{2 \cdot 3}", size=48).move_to(0.0)
        self.play(Write(eq))
        self.hold()
        self.say("Es como en la unidad de conjuntos, donde escribir una letra dos veces no la convertía en dos elementos. Aquí, escribir el mismo número de dos maneras no lo convierte en dos números.")
        link = note("{O, S, O} = {O, S}   y   {½, 2/4} = {½}", color=HONEY, size=26).move_to(2.2 * DOWN)
        self.play(FadeIn(link, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S04_EnterosSonRacionales(MBScene):
    def construct(self):
        self.mark("ℤ está contenido en ℚ")
        self.set_header(R"\mathbb{Z} \subseteq \mathbb{Q}", "Contenidos", LAV, P_LAV)
        self.say("¿Los enteros son racionales? Sí: cualquier entero se puede escribir como fracción, poniéndole un uno abajo. Menos tres es menos tres sobre uno.", fox=True)
        ex = VGroup(M(R"-3 = \frac{-3}{1}", size=56), M(R"5 = \frac{5}{1} = \frac{10}{2}", size=56)).arrange(DOWN, buff=0.4).move_to(3.0 * UP)
        self.play(LaggedStartMap(Write, ex, lag_ratio=0.6))
        self.hold()
        self.say("Entonces los enteros caben dentro de los racionales, y los naturales dentro de los enteros. Las bolsas quedan una dentro de otra.")
        Q = Ellipse(width=7.0, height=4.6).set_stroke(MINT, 4).set_fill(MINT, 0.1).move_to(1.4 * DOWN)
        Z = Ellipse(width=4.6, height=3.0).set_stroke(SKY, 4).set_fill(SKY, 0.1).move_to(1.6 * DOWN + 0.8 * RIGHT)
        N = Ellipse(width=2.2, height=1.4).set_stroke(HONEY, 4).set_fill(HONEY, 0.12).move_to(1.7 * DOWN + 1.4 * RIGHT)
        lq = M(R"\mathbb{Q}", size=44, color=MINT).move_to(Q.get_center() + 2.9 * LEFT + 1.2 * UP)
        lz = M(R"\mathbb{Z}", size=40, color=SKY).move_to(Z.get_center() + 1.8 * LEFT + 0.8 * UP)
        ln = M(R"\mathbb{N}", size=36, color=HONEY).move_to(N.get_center() + 0.8 * LEFT + 0.6 * UP)
        self.play(DrawBorderThenFill(Q), FadeIn(lq))
        self.play(DrawBorderThenFill(Z), FadeIn(lz))
        self.play(DrawBorderThenFill(N), FadeIn(ln))
        pts = VGroup(TB("2", size=26, color=HONEY).move_to(N.get_center() + 0.3 * RIGHT), TB("−1", size=26, color=SKY).move_to(Z.get_center() + 0.9 * LEFT + 0.3 * DOWN),
                     M(R"\tfrac34", size=34, color=MINT).move_to(Q.get_center() + 2.6 * LEFT + 0.2 * DOWN))
        self.play(LaggedStartMap(FadeIn, pts, lag_ratio=0.3))
        chain = M(R"\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q}", size=52).move_to(4.4 * DOWN)
        self.play(Write(chain))
        self.hold(0.6)
        self.end_section()


class S05_Decimales(MBScene):
    def construct(self):
        self.mark("De fracción a decimal")
        self.set_header(R"0.\overline{18}", "Decimales", SKY, P_SKY)
        self.say("Toda fracción se puede escribir como número decimal: basta con dividir el de arriba entre el de abajo. Tres entre cuatro da cero punto setenta y cinco. El decimal termina.", fox=True)
        a = M(R"\frac34 = 3 \div 4 = 0.75", size=54).move_to(3.4 * UP)
        self.play(Write(a))
        tag = why_pill("termina", MINT).next_to(a, DOWN, buff=0.2)
        self.play(FadeIn(tag))
        self.hold()
        self.say("Otras veces la división nunca termina, pero las cifras empiezan a repetirse en el mismo orden. Dos entre once da cero punto dieciocho, dieciocho, dieciocho, sin parar.")
        b = M(R"\frac{2}{11} = 0.181818\ldots", size=54).move_to(1.4 * UP)
        self.play(Write(b))
        block = SurroundingRectangle(b[-9:-7], buff=0.05).set_stroke(PINK, 3)
        self.play(ShowCreation(block))
        self.say("El grupo de cifras que se repite se llama período. Para no escribir los puntos suspensivos, se pone una rayita encima del período.")
        c = M(R"\frac{2}{11} = 0.\overline{18}", size=60, color=PINK).move_to(0.4 * DOWN)
        self.play(TransformFromCopy(b, c))
        tag2 = why_pill("se repite: periódico", PINK).next_to(c, DOWN, buff=0.2)
        self.play(FadeIn(tag2))
        self.hold()
        self.say("Con las fracciones solo pasan esas dos cosas: el decimal termina, o se repite. Nunca sigue para siempre sin repetirse. Eso será importante en la próxima parte.")
        rule = note("Fracción  →  decimal que termina o se repite", color=SKY, size=28).move_to(3.0 * DOWN)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()
        self.clear_scene()
        self.mark("De decimal que termina a fracción")
        self.say("¿Y al revés? Si el decimal termina, se lee en voz alta. Cero punto ocho se lee ocho décimas: ocho sobre diez.", fox=True)
        d1 = M(R"0.8 = \frac{8}{10}", size=56).move_to(3.0 * UP)
        self.play(Write(d1))
        self.hold()
        self.say("Ocho y diez se pueden dividir entre dos: queda cuatro quintos. Es la misma fracción, con números más pequeños.")
        d1b = M(R"= \frac{4}{5}", size=56, color=MINT).next_to(d1, RIGHT, buff=0.2)
        self.play(FadeIn(d1b, shift=0.2 * LEFT))
        self.play(VGroup(d1, d1b).animate.move_to(3.0 * UP))
        self.hold()
        self.say("Con dos cifras después del punto son centésimas: cero punto quince son quince centésimas, quince sobre cien. Dividiendo ambos entre cinco queda tres veinteavos.")
        d2 = M(R"0.15 = \frac{15}{100} = \frac{3}{20}", size=56).move_to(0.6 * UP)
        self.play(Write(d2))
        self.hold()
        rule2 = note("Una cifra decimal → sobre 10\nDos cifras → sobre 100\nTres cifras → sobre 1000\nY luego se simplifica", color=MINT, size=28).move_to(2.4 * DOWN)
        self.play(FadeIn(rule2, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S06_Periodico(ExScene):
    def construct(self):
        self.mark("De periódico a fracción")
        self.set_header(R"0.\overline{7}", "Periódico a fracción", PINK, P_PINK)
        self.problem(1, "¿Qué fracción es 0.777…?", PINK)
        self.say("Y al revés: todo decimal periódico viene de una fracción. Para encontrarla, le ponemos nombre al número: equis.", fox=True)
        self.step(R"x = 0.777\ldots", "le ponemos nombre", MUTED)
        self.say("El período tiene una sola cifra, así que multiplicamos por diez: el punto salta un lugar y la cola de sietes sigue igual.")
        self.step(R"10x = 7.777\ldots", "× 10: misma cola de sietes", SKY, why_color=SKY)
        self.say("Si restamos, las colas infinitas se cancelan, y queda una ecuación sin infinitos.")
        self.step(R"10x - x = 7.777\ldots - 0.777\ldots", "restar borra la cola", HONEY, why_color=HONEY)
        self.step(R"9x = 7", "lo que queda", HONEY, why_color=HONEY)
        self.step(R"x = \frac{7}{9}", "dividir entre 9", MINT, why_color=MINT)
        self.answer(R"0.\overline{7} = \frac{7}{9} \in \mathbb{Q}")
        self.say("Comprobación: siete entre nueve da cero punto siete, siete, siete. Por eso los decimales periódicos son racionales.")
        self.hold(0.6)
        self.end_section()


class S07_Cierre(AlgCierre):
    recap = [
        ("La división se escapa", "3 ÷ 4 = 3/4 ∉ ℤ", MINT),
        ("Fracción", "denominador: partes; numerador: cuántas tomo", MINT),
        ("Racionales", "ℚ = {m/n : m, n ∈ ℤ, n ≠ 0}", MINT),
        ("Equivalentes", "½ = 2/4 = 3/6: un número, muchos nombres", HONEY),
        ("Contenidos", "ℕ ⊆ ℤ ⊆ ℚ  (−3 = −3/1)", LAV),
        ("Decimales", "terminan (0.75) o se repiten (0.1818…)", SKY),
        ("Periódico", "0.777… = 7/9", PINK),
    ]
    recap_say = "Los racionales son las fracciones de enteros. Su decimal siempre termina o se repite, y los enteros viven dentro de ellos."
    practice = "Corta pizzas, abre candados y pon la rayita"
