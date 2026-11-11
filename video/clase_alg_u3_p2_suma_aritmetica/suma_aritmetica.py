"""
Álgebra P2 · La suma de una progresión aritmética (lección alg-14b, parte 2 de progresiones, 9:16).

Desde lo básico y sin zoom ni 3D: Gauss suma 1 + … + 100 escribiendo la fila al revés (cada columna suma 101);
dos escaleras de cuadritos (3, 5, 7, 9, 11) forman un rectángulo 5 × 14: Sₙ = n(a₁ + aₙ)/2; con la distributiva,
Sₙ = n(2a₁ + (n − 1)d)/2 (12 términos de 3, 5, 7: 168); los impares forman cuadrados: 1 + 3 + … + (2n − 1) = n²;
ejemplo resuelto del estadio (15 filas, 20 sillas y 4 más por fila: 720). Spec 2026-11-11-progresiones-desde-cero.

    manimgl suma_aritmetica.py S02_Escaleras -w -l
"""
from alg_fx import *


def stair(heights, color, s=0.3, gap=0.06, opacity=0.9):
    """Columnas de cuadritos, alineadas abajo."""
    cols = VGroup()
    for h in heights:
        col = VGroup(*[Square(s).set_fill(color, opacity).set_stroke(BG_COLOR, 1.5) for _ in range(h)]).arrange(UP, buff=0)
        cols.add(col)
    cols.arrange(RIGHT, buff=gap, aligned_edge=DOWN)
    return cols


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Progresiones · Parte 2"
    title = "La suma de una\nprogresión aritmética"
    subtitle = "El truco de Gauss"


class S01_Gauss(MBScene):
    def construct(self):
        self.mark("El truco de Gauss")
        self.set_header(R"1 + \cdots + 100", "Gauss", HONEY, P_HONEY)
        self.say("Cuenta la historia que a un niño de nueve años, Carl Friedrich Gauss, el maestro le pidió sumar todos los números del uno al cien. Gauss terminó en un minuto.", fox=True)
        top = ["1", "2", "3", R"\cdots", "99", "100"]
        bot = ["100", "99", "98", R"\cdots", "2", "1"]
        cw = 1.05

        def row(items, color, lab):
            g = VGroup(M(lab, size=32, color=MUTED))
            cells = VGroup(*[M(t, size=32, color=color) for t in items])
            for k, c in enumerate(cells):
                c.move_to(RIGHT * k * cw)
            plus = VGroup(*[M("+", size=26, color=MUTED).move_to(RIGHT * (k + 0.5) * cw) for k in range(len(items) - 1)])
            g.add(cells, plus)
            g[0].next_to(cells, LEFT, buff=0.35)
            return g, cells

        r1, c1 = row(top, INK, "S =")
        r2, c2 = row(bot, SKY, "S =")
        r2.next_to(r1, DOWN, buff=0.45).align_to(r1, LEFT)
        rows = VGroup(r1, r2).move_to(3.4 * UP)
        self.play(Write(r1))
        self.hold()
        self.say("Su idea fue escribir la misma suma al revés, debajo. Ahora cada columna suma lo mismo: uno más cien, dos más noventa y nueve, tres más noventa y ocho. Siempre ciento uno.")
        self.play(Write(r2))
        sums = VGroup()
        for a, b in zip(c1, c2):
            t = M(R"\cdots" if a.get_tex() == R"\cdots" else "101", size=30, color=HONEY).next_to(b, DOWN, buff=0.35)
            sums.add(t)
        sums.align_to(sums[0], DOWN)
        boxes = VGroup(*[SurroundingRectangle(VGroup(a, b), buff=0.06).set_stroke(HONEY, 2) for a, b, s in zip(c1, c2, sums) if s.get_tex() != R"\cdots"])
        self.play(LaggedStartMap(ShowCreation, boxes, lag_ratio=0.15), FadeIn(sums, lag_ratio=0.1), run_time=1.6)
        self.hold()
        self.say("Hay cien columnas de ciento uno: diez mil cien. Pero así se sumó todo dos veces, una arriba y otra abajo. La suma que se pedía es la mitad: cinco mil cincuenta.")
        s1 = M(R"2S = 100 \cdot 101 = 10\,100", size=46).move_to(0.6 * DOWN)
        s2 = formula_card(R"S = \frac{100 \cdot 101}{2} = 5050", color=HONEY, size=48).move_to(2.2 * DOWN)
        self.play(Write(s1))
        self.play(FadeIn(s2, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S02_Escaleras(MBScene):
    def construct(self):
        self.mark("Dos escaleras")
        self.set_header(R"S_n", "Dos escaleras", MINT, P_MINT)
        self.say("El truco sirve para cualquier progresión aritmética. Sumemos tres, cinco, siete, nueve y once, hechos de cuadritos: forman una escalera.", fox=True)
        q = M(R"3 + 5 + 7 + 9 + 11", size=46).move_to(4.3 * UP)
        self.play(Write(q))
        st = stair([3, 5, 7, 9, 11], MINT).move_to([0, -1.6, 0], aligned_edge=DOWN)
        self.play(LaggedStartMap(FadeIn, st, shift=0.2 * UP, lag_ratio=0.15), run_time=1.6)
        self.hold()
        self.say("Ahora una copia de la escalera, volteada, encima. Encajan perfecto: forman un rectángulo.")
        cp = stair([11, 9, 7, 5, 3], SKY, opacity=0.75)
        # Cada columna de la copia cuelga de la tapa (altura 14 cuadritos)
        s = 0.3
        for col, base_col in zip(cp, st):
            col.move_to(base_col.get_bottom() + 14 * s * UP, aligned_edge=UP).set_x(base_col.get_x())
        self.play(LaggedStartMap(FadeIn, cp, shift=0.3 * DOWN, lag_ratio=0.15), run_time=1.6)
        rect = SurroundingRectangle(VGroup(st, cp), buff=0.04).set_stroke(HONEY, 3)
        self.play(ShowCreation(rect))
        wl = T("5 columnas", size=24, color=HONEY).next_to(rect, DOWN, buff=0.2)
        hl = T("3 + 11 = 14", size=24, color=HONEY).next_to(rect, RIGHT, buff=0.2)
        self.play(FadeIn(wl), FadeIn(hl))
        self.hold()
        self.say("El rectángulo mide cinco columnas por catorce: setenta cuadritos. Cada escalera es la mitad: treinta y cinco.")
        r = M(R"\frac{5 \cdot 14}{2} = 35", size=48, color=MINT).next_to(rect, LEFT, buff=0.3)
        self.play(Write(r))
        self.hold()
        self.say("En general: son n columnas, y cada columna mide el primero más el último. Esa es la fórmula de la suma.")
        self.play(FadeOut(VGroup(st, cp, rect, wl, hl, r, q)))
        f = formula_card(R"S_n = \frac{n\,(a_1 + a_n)}{2}", color=MINT, size=56).move_to(3.4 * UP)
        self.play(FadeIn(f, shift=0.2 * UP))
        self.hold(0.6)
        self.say("Si no se conoce el último término, se reemplaza: a sub n es a sub uno más n menos uno por d. Con la distributiva queda otra versión de la fórmula.")
        g = M(R"S_n = \frac{n\,\big(2a_1 + (n - 1)\,d\big)}{2}", size=48).move_to(1.6 * UP)
        self.play(Write(g))
        self.hold()
        self.say("Por ejemplo, los doce primeros términos de tres, cinco, siete suman doce por, seis más veintidós, entre dos: ciento sesenta y ocho.")
        e = M(R"S_{12} = \frac{12\,(6 + 11 \cdot 2)}{2} = 6 \cdot 28 = 168", size=42, color=MINT).move_to(0.1 * DOWN)
        e.set_max_width(7.2)
        self.play(Write(e))
        self.hold(0.6)
        self.end_section()


class S03_Impares(MBScene):
    def construct(self):
        self.mark("Los impares forman cuadrados")
        self.set_header(R"n^2", "Impares", PINK, P_PINK)
        self.say("Una suma famosa: la de los números impares. Uno, más tres, más cinco, más siete. Mira lo que pasa al dibujarlos como escuadras.", fox=True)
        s = 0.5
        layers = VGroup()
        colors = [PINK, HONEY, MINT, SKY]
        for k in range(4):
            cells = VGroup()
            for i in range(k + 1):
                for j in range(k + 1):
                    if i == k or j == k:
                        cells.add(Square(s).set_fill(colors[k], 0.9).set_stroke(BG_COLOR, 2).move_to([j * s, -i * s, 0]))
            layers.add(cells)
        layers.move_to(2.6 * UP)
        sums = [R"1 = 1^2", R"1 + 3 = 4 = 2^2", R"1 + 3 + 5 = 9 = 3^2", R"1 + 3 + 5 + 7 = 16 = 4^2"]
        prev = None
        for k in range(4):
            t = M(sums[k], size=42, color=colors[k]).move_to(0.0 * UP)
            anims = [FadeIn(layers[k], scale=0.9)]
            anims.append(FadeTransform(prev, t) if prev is not None else Write(t))
            self.play(*anims, run_time=1.0)
            prev = t
            self.wait(0.8)
        self.hold()
        self.say("Cada escuadra agrega el siguiente impar y el cuadrado crece un lado. La suma de los n primeros impares es n al cuadrado, como los cuadrados de las potencias.")
        f = formula_card(R"1 + 3 + 5 + \dots + (2n - 1) = n^2", color=PINK, size=46).move_to(1.4 * DOWN)
        self.play(FadeIn(f, shift=0.2 * UP))
        self.hold()
        self.say("La fórmula de Gauss lo confirma: n términos, el primero es uno y el último dos n menos uno.")
        g = M(R"\frac{n\,\big(1 + (2n - 1)\big)}{2} = \frac{n \cdot 2n}{2} = n^2", size=42).move_to(3.0 * DOWN)
        g.set_max_width(7.2)
        self.play(Write(g))
        self.hold(0.6)
        self.end_section()


class S04_Estadio(ExScene):
    def construct(self):
        self.mark("Ejemplo: un estadio")
        self.set_header(R"S_{15}", "Un estadio", SKY, P_SKY)
        self.say("Un ejemplo completo. Un estadio tiene quince filas. La primera tiene veinte sillas y cada fila tiene cuatro más que la anterior.", fox=True)
        self.problem(1, "Un estadio tiene 15 filas. La primera tiene 20 sillas y cada fila tiene 4 más que la anterior. ¿Cuántas sillas hay en total?", color=SKY)
        self.hold()
        self.say("Las sillas por fila forman una progresión aritmética: veinte, veinticuatro, veintiocho. Primero, la última fila: veinte más catorce saltos de cuatro, setenta y seis.")
        self.step(R"a_{15} = 20 + 14 \cdot 4 = 76", why="término general", why_color=HONEY)
        self.hold()
        self.say("Ahora la suma: quince filas por, veinte más setenta y seis, entre dos. Quince por cuarenta y ocho: setecientas veinte sillas.")
        self.step(R"S_{15} = \frac{15\,(20 + 76)}{2} = 15 \cdot 48", why="suma de Gauss", why_color=MINT)
        self.answer(R"S_{15} = 720 \text{ sillas}", color=SKY)
        self.hold(0.6)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("Gauss", "la suma al derecho y al revés: 1 + … + 100 = 5050", HONEY),
        ("Dos escaleras", "un rectángulo n × (a₁ + aₙ); la suma es la mitad", MINT),
        ("Fórmula", "Sₙ = n(a₁ + aₙ)/2", MINT),
        ("Sin el último", "Sₙ = n(2a₁ + (n − 1)d)/2", SKY),
        ("Impares", "1 + 3 + 5 + … + (2n − 1) = n²", PINK),
        ("Estadio", "aₙ y luego Sₙ: 720 sillas", SKY),
    ]
    recap_say = "Para sumar una progresión aritmética se empareja el primero con el último: n veces esa pareja, entre dos."
    practice = "Encaja escaleras, une las parejas de Gauss y llena el teatro"
