"""
Álgebra V1 · ¿Qué es un conjunto? Notación y pertenencia (lección alg-0a, 9:16, fondo morado vivo).

Desde lo más básico, sin números ni desigualdades, sin zoom ni 3D. Agrupar cosas en la vida diaria; conjunto bien
definido (los colores del semáforo sí, «los colores bonitos» no); la notación pieza por pieza
(S = {rojo, amarillo, verde}); ∈ y ∉ y cómo se leen (fin de semana); extensión y comprensión con la máquina que
filtra («x tal que x es una vocal»); el orden y las repeticiones no importan (letras de OSO); el cardinal (letras de
PAPAYA); y cómo se dibuja un conjunto. Spec 2026-11-11-conjuntos-desde-cero.

    manimgl que_es.py S03_Notacion -w -l
"""
from alg_fx import *


def word_card(text, color=INK, fill=CARD, size=30):
    t = TB(text, size=size, color=color)
    box = RoundedRectangle(t.get_width() + 0.5, t.get_height() + 0.36, corner_radius=0.16).set_fill(fill, 1).set_stroke(color, 2)
    box.move_to(t)
    return VGroup(box, t)


def bag(width=5.4, height=3.0, color=LAV):
    return Ellipse(width=width, height=height).set_stroke(color, 4).set_fill(color, 0.12)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 0 · Parte 1"
    title = "¿Qué es\nun conjunto?"
    subtitle = "Notación y pertenencia, desde cero"


class S01_Agrupar(MBScene):
    def construct(self):
        self.mark("Agrupar cosas")
        self.set_header(R"\{\ \}", "Agrupar", LAV, P_LAV)
        self.say("Todos los días agrupamos cosas sin darnos cuenta. Los útiles que van en la maleta, las canciones de una lista, los jugadores de un equipo.", fox=True)
        groups = [
            ("La maleta", ["cuaderno", "lápiz", "borrador"], SKY),
            ("La lista de música", ["canción 1", "canción 2", "canción 3"], PINK),
            ("El equipo", ["portero", "defensa", "delantero"], MINT),
        ]
        cols = VGroup()
        for title, items, col in groups:
            head = TB(title, size=28, color=col)
            body = VGroup(*[T(it, size=24, color=INK) for it in items]).arrange(DOWN, buff=0.16)
            frame = RoundedRectangle(width=4.2, height=body.get_height() + 0.6, corner_radius=0.3).set_stroke(col, 3).set_fill(col, 0.1)
            frame.move_to(body)
            cols.add(VGroup(head, VGroup(frame, body)).arrange(DOWN, buff=0.15))
        cols.arrange(DOWN, buff=0.4).move_to(0.6 * UP)
        for c in cols:
            self.play(FadeIn(c[0], shift=0.2 * DOWN), DrawBorderThenFill(c[1][0]), LaggedStartMap(FadeIn, c[1][1], lag_ratio=0.2), run_time=1.3)
        self.hold()
        self.say("En matemáticas, a una agrupación así se le llama conjunto, y a cada cosa que está adentro se le llama elemento.")
        rule = VGroup(
            VGroup(TB("conjunto", size=34, color=LAV), T("= la agrupación (la maleta)", size=28)).arrange(RIGHT, buff=0.25),
            VGroup(TB("elemento", size=34, color=HONEY), T("= cada cosa de adentro (el lápiz)", size=28)).arrange(RIGHT, buff=0.25),
        ).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        rule.set_max_width(7.2)
        card = boxed(rule, color=LAV).move_to(4.1 * DOWN)
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S02_BienDefinido(MBScene):
    def construct(self):
        self.mark("Bien definido")
        self.set_header(R"\checkmark", "Bien definido", MINT, P_MINT)
        self.say("Pero no cualquier agrupación sirve. Un conjunto tiene que estar bien definido: cualquier persona, mirando un objeto, debe poder decir sin dudar si está o no está.", fox=True)
        good = VGroup(T("Los colores del semáforo", size=32), check_mark(MINT, 54)).arrange(RIGHT, buff=0.4)
        good.move_to(3.4 * UP)
        self.play(FadeIn(good, shift=0.2 * UP))
        lights = VGroup(*[Circle(radius=0.42).set_fill(c, 1).set_stroke(INK, 2) for c in ("#FF5A5A", "#FACC15", "#34D399")]).arrange(DOWN, buff=0.12)
        frame = RoundedRectangle(1.3, lights.get_height() + 0.4, corner_radius=0.25).set_fill("#1B1B2E", 1).set_stroke(MUTED, 2).move_to(lights)
        light = VGroup(frame, lights).move_to(1.3 * UP + 2.4 * LEFT)
        names = VGroup(T("rojo", size=28), T("amarillo", size=28), T("verde", size=28)).arrange(DOWN, buff=0.48).next_to(light, RIGHT, buff=0.4)
        self.play(FadeIn(light), LaggedStartMap(FadeIn, names, lag_ratio=0.3))
        self.say("Los colores del semáforo están bien definidos: son rojo, amarillo y verde, y todo el mundo está de acuerdo. Nadie discute si el morado está o no está: no está.")
        self.hold()
        bad = VGroup(T("Los colores bonitos", size=32), ex_mark(CORAL, 54)).arrange(RIGHT, buff=0.4).move_to(1.0 * DOWN)
        self.play(FadeIn(bad, shift=0.2 * UP))
        self.say("En cambio, «los colores bonitos» no es un conjunto: a una persona le encanta el morado y a otra no. Depende de quién opine, así que no se puede decidir.")
        opinions = VGroup(
            VGroup(T("Ana:", size=26, color=SKY), T("«el morado es bonito»", size=26)).arrange(RIGHT, buff=0.2),
            VGroup(T("Beto:", size=26, color=PINK), T("«el morado no me gusta»", size=26)).arrange(RIGHT, buff=0.2),
        ).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to(2.6 * DOWN)
        self.play(LaggedStartMap(FadeIn, opinions, lag_ratio=0.4))
        self.hold()
        self.say("Una prueba sencilla: si dos personas cualesquiera, revisando el mismo objeto, siempre deciden lo mismo, el conjunto está bien definido.")
        tip = note("Prueba: si dos personas siempre deciden lo mismo,\nestá bien definido.", color=MINT, size=26).move_to(4.4 * DOWN)
        self.play(FadeIn(tip, shift=0.2 * UP))
        self.hold(0.8)
        self.end_section()


class S03_Notacion(MBScene):
    def construct(self):
        self.mark("Cómo se escribe un conjunto")
        self.set_header(R"S = \{\dots\}", "Notación", SKY, P_SKY)
        self.say("Ahora aprendamos a escribirlo. Vamos a armar, pieza por pieza, el conjunto de los colores del semáforo.", fox=True)
        pieces = [
            (R"S", "1. El nombre: una letra mayúscula", LAV),
            (R"=", "2. El signo igual: «es»", MUTED),
            (R"\{", "3. Una llave que abre", HONEY),
            (R"\text{rojo},\ \text{amarillo},\ \text{verde}", "4. Los elementos, separados por comas", MINT),
            (R"\}", "5. Una llave que cierra", HONEY),
        ]
        mobs = VGroup(*[M(tex, size=60, color=col) for tex, _, col in pieces]).arrange(RIGHT, buff=0.15).move_to(3.0 * UP)
        mobs.set_max_width(7.2)
        expl = VGroup()
        for (tex, txt, col), mob in zip(pieces, mobs):
            line = T(txt, size=26, color=col if col != MUTED else INK)
            expl.add(line)
        expl.arrange(DOWN, buff=0.28, aligned_edge=LEFT).move_to(0.2 * DOWN)
        expl.set_max_width(7.0)
        says = [
            "Primero el nombre del conjunto. Se usa una letra mayúscula; aquí, ese de semáforo.",
            "Luego el signo igual, que se lee «es».",
            "Después una llave que abre. Las llaves son la marca de los conjuntos: no se usan paréntesis ni corchetes.",
            "Adentro van los elementos, separados por comas. Los elementos se escriben normalmente en minúscula.",
            "Y al final, la llave que cierra.",
        ]
        for mob, line, s in zip(mobs, expl, says):
            self.say(s)
            arrow = Arrow(line.get_top() + 0.05 * UP, mob.get_bottom() + 0.1 * DOWN, buff=0.1).set_stroke(MUTED, 2, opacity=0.5)
            self.play(Write(mob), FadeIn(line, shift=0.15 * RIGHT), run_time=1.0)
            self.hold()
        self.say("Todo junto se lee así: «ese es el conjunto cuyos elementos son rojo, amarillo y verde».")
        read = note("«S es el conjunto cuyos elementos son\nrojo, amarillo y verde»", color=SKY, size=26).move_to(3.8 * DOWN)
        self.play(FadeIn(read, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()
        self.mark("Errores comunes")
        self.say("Tres errores que hay que evitar al escribir un conjunto.", fox=True)
        errs = [
            (R"S = (\text{rojo},\ \text{verde})", "paréntesis en vez de llaves"),
            (R"S = \{\text{rojo}\ \text{verde}\}", "faltan las comas"),
            (R"s = \{\text{rojo},\ \text{verde}\}", "el nombre va en mayúscula"),
        ]
        rows = VGroup()
        for tex, why in errs:
            rows.add(VGroup(VGroup(M(tex, size=44, color=CORAL), ex_mark(CORAL, 40)).arrange(RIGHT, buff=0.3), T(why, size=24, color=MUTED)).arrange(DOWN, buff=0.12))
        rows.arrange(DOWN, buff=0.5).move_to(0.8 * UP)
        for r in rows:
            self.play(FadeIn(r, shift=0.2 * UP), run_time=0.8)
            self.wait(0.6)
        good = VGroup(M(R"S = \{\text{rojo},\ \text{verde}\}", size=48, color=MINT), check_mark(MINT, 44)).arrange(RIGHT, buff=0.3).move_to(3.4 * DOWN)
        self.play(FadeIn(good, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S04_Pertenencia(MBScene):
    def construct(self):
        self.mark("Pertenece y no pertenece")
        self.set_header(R"\in", "Pertenencia", MINT, P_MINT)
        self.say("Para decir que un objeto está dentro de un conjunto hay un símbolo especial, parecido a una e redondeada. Se lee «pertenece a».", fox=True)
        S = bag(5.0, 2.6, LAV).move_to(2.6 * UP)
        name = M("S", size=56, color=LAV).next_to(S, LEFT, buff=0.2).shift(0.8 * UP)
        inside = VGroup(T("rojo", size=30), T("amarillo", size=30), T("verde", size=30)).arrange(RIGHT, buff=0.4).move_to(S)
        out = T("azul", size=30, color=MUTED).next_to(S, RIGHT, buff=0.3).shift(1.0 * DOWN)
        self.play(DrawBorderThenFill(S), FadeIn(name), FadeIn(inside), FadeIn(out))
        s1 = VGroup(M(R"\text{rojo} \in S", size=56, color=MINT), T("«rojo pertenece a S»", size=28, color=INK)).arrange(DOWN, buff=0.15).move_to(0.3 * DOWN)
        self.play(Write(s1[0]), Indicate(inside[0], color=MINT))
        self.play(FadeIn(s1[1]))
        self.hold()
        self.say("Si el objeto no está, el mismo símbolo se tacha con una rayita: «no pertenece a». El azul no pertenece a ese.")
        s2 = VGroup(M(R"\text{azul} \notin S", size=56, color=CORAL), T("«azul no pertenece a S»", size=28, color=INK)).arrange(DOWN, buff=0.15).move_to(2.3 * DOWN)
        self.play(Write(s2[0]), Indicate(out, color=CORAL))
        self.play(FadeIn(s2[1]))
        self.hold()
        self.say("Fíjate en el orden: a la izquierda del símbolo va el objeto, y a la derecha va el conjunto. Nunca al revés.")
        tip = note("Siempre: elemento  ∈  conjunto\n(a la izquierda el objeto, a la derecha el conjunto)", color=MINT, size=24).move_to(4.3 * DOWN)
        self.play(FadeIn(tip))
        self.hold(0.8)
        self.end_section()
        self.mark("Otro ejemplo: el fin de semana")
        self.say("Otro ejemplo. Sea efe el conjunto de los días del fin de semana: sábado y domingo.", fox=True)
        F = M(R"F = \{\text{s\'abado},\ \text{domingo}\}", size=50).move_to(3.4 * UP)
        self.play(Write(F))
        days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        week = VGroup(*[word_card(d, color=(MINT if d in ("sábado", "domingo") else MUTED), size=24) for d in days])
        week.arrange_in_grid(3, 3, buff=0.2).move_to(1.0 * UP)
        week.set_max_width(7.2)
        self.play(LaggedStartMap(FadeIn, week, lag_ratio=0.1), run_time=1.4)
        self.say("Domingo pertenece a efe. Lunes no pertenece a efe. Y así con cada día: cada uno está o no está, sin dudas.")
        facts = VGroup(M(R"\text{domingo} \in F", size=46, color=MINT), M(R"\text{lunes} \notin F", size=46, color=CORAL)).arrange(RIGHT, buff=0.8).move_to(1.6 * DOWN)
        self.play(LaggedStartMap(Write, facts, lag_ratio=0.5))
        self.hold(0.6)
        self.end_section()


class S05_Describir(MBScene):
    def construct(self):
        self.mark("Por extensión")
        self.set_header(R"\{x : \dots\}", "Extensión y comprensión", HONEY, P_HONEY)
        self.say("Hay dos maneras de describir un conjunto. La primera, por extensión, es escribir la lista completa de sus elementos. Como las vocales.", fox=True)
        ext = M(R"V = \{a,\ e,\ i,\ o,\ u\}", size=60).move_to(3.6 * UP)
        tag1 = why_pill("por extensión: la lista de los elementos", HONEY).next_to(ext, DOWN, buff=0.2)
        self.play(Write(ext), FadeIn(tag1))
        self.hold()
        self.end_section()
        self.mark("Por comprensión: la máquina que filtra")
        self.say("La segunda, por comprensión, es dar la condición que cumplen los elementos. Imagina una máquina que revisa cada objeto y solo deja pasar los que cumplen la condición.", fox=True)
        self.play(FadeIn(ext), FadeIn(tag1))
        machine = RoundedRectangle(3.4, 1.4, corner_radius=0.25).set_fill(CARD, 1).set_stroke(HONEY, 3).move_to(0.6 * UP)
        mlabel = T("¿es una vocal?", size=28, color=HONEY).move_to(machine)
        self.play(FadeIn(machine), FadeIn(mlabel))
        letters = ["m", "a", "s", "e", "o"]
        for k, ch in enumerate(letters):
            l = TB(ch, size=44).move_to(machine.get_left() + 1.0 * LEFT)
            self.play(FadeIn(l, shift=0.3 * RIGHT), run_time=0.35)
            is_v = ch in "aeiou"
            target = machine.get_right() + 1.0 * RIGHT + (0.6 * UP if is_v else 0.9 * DOWN)
            self.play(l.animate.move_to(target).set_color(MINT if is_v else CORAL), run_time=0.6)
            mark = (check_mark(MINT, 30) if is_v else ex_mark(CORAL, 30)).next_to(l, RIGHT, buff=0.12)
            self.add(mark)
            self.play(FadeOut(l), FadeOut(mark), run_time=0.3)
        com = M(R"V = \{x : x \text{ es una vocal}\}", size=54).move_to(1.4 * DOWN)
        self.play(Write(com))
        self.say("Se escribe así. La equis representa a cualquier objeto que estemos revisando, y los dos puntos se leen «tal que».")
        read = note("«V es el conjunto de las x tal que x es una vocal»", color=HONEY, size=26).move_to(3.0 * DOWN)
        self.play(FadeIn(read, shift=0.2 * UP))
        self.hold()
        self.say("La comprensión es muy útil cuando la lista sería larguísima, como los estudiantes de todo un colegio: basta con decir la condición.")
        big = M(R"E = \{x : x \text{ estudia en este colegio}\}", size=40, color=SKY).move_to(4.5 * DOWN)
        big.set_max_width(7.2)
        self.play(FadeIn(big, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S06_OrdenRepeticion(MBScene):
    def construct(self):
        self.mark("El orden no importa")
        self.set_header(R"\{a, b\} = \{b, a\}", "Orden y repetición", PINK, P_PINK)
        self.say("En un conjunto solo importa qué elementos están. El orden en que se escriben no cambia nada.", fox=True)
        a = M(R"\{\text{rojo},\ \text{verde}\}", size=56).move_to(3.2 * UP + 1.8 * LEFT)
        b = M(R"\{\text{verde},\ \text{rojo}\}", size=56).move_to(3.2 * UP + 1.8 * RIGHT)
        eq = M("=", size=56).move_to(3.2 * UP)
        self.play(Write(a))
        self.play(TransformFromCopy(a, b), FadeIn(eq), run_time=1.4)
        self.say("Es como una bolsa: da igual qué metiste primero, lo que hay adentro es lo mismo.")
        self.hold()
        self.end_section()
        self.mark("No se repite")
        self.say("Además, ningún elemento se repite. Mira las letras de la palabra oso.", fox=True)
        word = VGroup(*[word_card(c, color=PINK, size=44) for c in "OSO"]).arrange(RIGHT, buff=0.25).move_to(3.0 * UP)
        self.play(LaggedStartMap(FadeIn, word, lag_ratio=0.3))
        self.say("La palabra tiene tres letras, pero la o aparece dos veces. Como elemento, la o es una sola: estar dos veces no la hace dos elementos.")
        strike = Line(word[2].get_corner(DL), word[2].get_corner(UR)).set_stroke(CORAL, 5)
        self.play(ShowCreation(strike))
        res = M(R"\{O,\ S\}", size=64, color=INK).move_to(0.6 * UP)
        self.play(Write(res))
        also = M(R"\{O,\ S,\ O\} = \{O,\ S\}", size=48, color=MUTED).move_to(1.4 * DOWN)
        self.play(FadeIn(also, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S07_Cardinal(MBScene):
    def construct(self):
        self.mark("El cardinal")
        self.set_header(R"n(A)", "Cardinal", HONEY, P_HONEY)
        self.say("A veces queremos saber cuántos elementos distintos tiene un conjunto. Ese número se llama cardinal, y se escribe ene de A.", fox=True)
        F = M(R"F = \{\text{s\'abado},\ \text{domingo}\}", size=48).move_to(3.6 * UP)
        nF = M(R"n(F) = 2", size=56, color=HONEY).move_to(2.4 * UP)
        self.play(Write(F))
        self.play(FadeIn(nF, shift=0.2 * UP))
        self.say("El fin de semana tiene dos días: ene de efe es dos.")
        self.hold()
        self.say("Con las letras de papaya hay que tener cuidado: la palabra tiene seis letras, pero solo tres letras distintas.")
        word = VGroup(*[word_card(c, color=HONEY, size=40) for c in "PAPAYA"]).arrange(RIGHT, buff=0.15).move_to(0.6 * UP)
        word.set_max_width(7.2)
        self.play(LaggedStartMap(FadeIn, word, lag_ratio=0.15))
        rep = [word[2], word[3], word[5]]
        self.play(*[ShowCreation(Line(w.get_corner(DL), w.get_corner(UR)).set_stroke(CORAL, 5)) for w in rep])
        res = M(R"L = \{P,\ A,\ Y\} \qquad n(L) = 3", size=50).move_to(1.4 * DOWN)
        self.play(Write(res))
        self.hold()
        tip = note("El cardinal cuenta elementos distintos,\nno las veces que se escriben.", color=HONEY, size=26).move_to(3.4 * DOWN)
        self.play(FadeIn(tip, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S08_Dibujar(MBScene):
    def construct(self):
        self.mark("Dibujar un conjunto")
        self.set_header(R"\bigcirc", "Dibujarlo", LAV, P_LAV)
        self.say("Un conjunto también se puede dibujar: una línea cerrada, como una bolsa, con sus elementos adentro. Lo que no pertenece queda afuera.", fox=True)
        S = bag(5.6, 3.4, LAV).move_to(1.4 * UP)
        name = M("S", size=56, color=LAV).next_to(S, LEFT, buff=0.15).shift(1.1 * UP)
        inside = VGroup(T("rojo", size=30), T("amarillo", size=30), T("verde", size=30)).arrange(DOWN, buff=0.3).move_to(S)
        outs = VGroup(T("azul", size=28, color=MUTED), T("morado", size=28, color=MUTED)).arrange(RIGHT, buff=3.4).next_to(S, DOWN, buff=0.4)
        self.play(ShowCreation(S), FadeIn(name))
        self.play(LaggedStartMap(FadeIn, inside, shift=0.2 * DOWN, lag_ratio=0.3))
        self.play(FadeIn(outs))
        self.say("Este dibujo y la escritura con llaves dicen exactamente lo mismo. Más adelante dibujaremos varios conjuntos a la vez para compararlos.")
        same = M(R"S = \{\text{rojo},\ \text{amarillo},\ \text{verde}\}", size=44, color=INK).move_to(3.2 * DOWN)
        same.set_max_width(7.2)
        self.play(Write(same))
        self.hold(0.6)
        self.end_section()


class S09_Cierre(AlgCierre):
    recap = [
        ("Conjunto", "una agrupación bien definida de elementos", LAV),
        ("Notación", "S = {rojo, amarillo, verde}: mayúscula, llaves y comas", SKY),
        ("Pertenencia", "rojo ∈ S (pertenece),  azul ∉ S (no pertenece)", MINT),
        ("Extensión", "la lista: V = {a, e, i, o, u}", HONEY),
        ("Comprensión", "la condición: V = {x : x es una vocal}", HONEY),
        ("Sin orden ni repetición", "{O, S, O} = {S, O}", PINK),
        ("Cardinal", "n(A): cuántos elementos distintos tiene", HONEY),
    ]
    recap_say = "Un conjunto es una agrupación bien definida. Se escribe con mayúscula, llaves y comas, y cada elemento pertenece o no pertenece."
    practice = "Arma la notación, llena bolsas y tacha repetidos"
