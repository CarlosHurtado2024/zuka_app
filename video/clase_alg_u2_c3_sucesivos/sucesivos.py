"""
Álgebra C3 · Cambios sucesivos (lección alg-13d, parte 3 de porcentajes, 9:16).

Desde lo básico y sin zoom ni 3D: 20 % de descuento y luego 10 % más sobre 100 000 (80 000 → 72 000): los factores se
multiplican, 0.8 · 0.9 = 0.72, descuento único del 28 % y no del 30 %; el orden no importa (conmutativa); subir y
bajar 50 % (100 → 150 → 75) no deja igual; tras bajar 20 % hay que subir 25 % para volver; crecer 10 % tres años es
1.1³ = 1.331 (potencias): +33.1 %, no 30 %. Spec 2026-11-11-porcentajes-desde-cero.

    manimgl sucesivos.py S01_Encadenados -w -l
"""
from alg_fx import *


def stairs(values, colors, labels, unit, w=1.2, gap=0.55):
    bars = VGroup(*[Rectangle(w, v * unit).set_fill(c, 0.9).set_stroke(width=0) for v, c in zip(values, colors)])
    bars.arrange(RIGHT, buff=gap, aligned_edge=DOWN)
    labs = VGroup(*[T(l, size=22, color=INK).next_to(b, DOWN, buff=0.15) for l, b in zip(labels, bars)])
    return bars, labs


def hop(p, q, label, color, size=22):
    arc = ArcBetweenPoints(p, q, angle=-PI / 2.4).set_stroke(color, 3)
    t = T(label, size=size, color=color).next_to(arc, UP, buff=0.06)
    return VGroup(arc, t)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Porcentajes · Parte 3"
    title = "Cambios\nsucesivos"
    subtitle = "Los porcentajes se multiplican"


class S01_Encadenados(MBScene):
    def construct(self):
        self.mark("Dos descuentos seguidos")
        self.set_header(R"0.8 \cdot 0.9", "Dos descuentos", CORAL, P_CORAL)
        self.say("Una bicicleta de cien mil pesos tiene un veinte por ciento de descuento, y en caja te dan un diez por ciento más. Mucha gente piensa que eso es un treinta por ciento. No lo es.", fox=True)
        bars, labs = stairs([100, 80, 72], [SKY, HONEY, CORAL], ["100 000", "80 000", "72 000"], 0.03)
        VGroup(bars, labs).move_to(2.9 * UP)
        self.play(GrowFromEdge(bars[0], DOWN), FadeIn(labs[0]))
        self.hold()
        self.say("Primero el veinte por ciento: queda el ochenta por ciento, ochenta mil.")
        h1 = hop(bars[0].get_top() + 0.1 * UP, bars[1].get_top() + 0.1 * UP, "× 0.8", HONEY)
        self.play(GrowFromEdge(bars[1], DOWN), FadeIn(labs[1]), FadeIn(h1))
        self.hold()
        self.say("Luego el diez por ciento, pero sobre los ochenta mil, no sobre los cien mil: queda el noventa por ciento de ochenta mil, setenta y dos mil.")
        h2 = hop(bars[1].get_top() + 0.1 * UP, bars[2].get_top() + 0.1 * UP, "× 0.9", CORAL)
        self.play(GrowFromEdge(bars[2], DOWN), FadeIn(labs[2]), FadeIn(h2))
        self.hold()
        self.say("Los dos factores se multiplican: cero punto ocho por cero punto nueve es cero punto setenta y dos. Se paga el setenta y dos por ciento: el descuento total es del veintiocho por ciento.")
        f = M(R"0.8 \cdot 0.9 = 0.72 \;\Rightarrow\; \text{descuento } 28\%", size=42).move_to(0.3 * DOWN)
        f.set_max_width(7.2)
        self.play(Write(f))
        w = M(R"\text{no } 30\%:\ 100\,000 \cdot 0.7 = 70\,000", size=38, color=MUTED).move_to(1.3 * DOWN)
        x = ex_mark(CORAL, size=44).next_to(w, RIGHT, buff=0.25)
        self.play(FadeIn(w), FadeIn(x, scale=0.6))
        self.hold()
        self.say("Y el orden no importa: primero el diez y luego el veinte da lo mismo, porque la multiplicación es conmutativa.")
        c = formula_card(R"0.8 \cdot 0.9 = 0.9 \cdot 0.8 = 0.72", color=CORAL, size=42).move_to(2.9 * DOWN)
        self.play(FadeIn(c, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S02_SubeBaja(MBScene):
    def construct(self):
        self.mark("Subir y bajar lo mismo")
        self.set_header(R"1.5 \cdot 0.5", "Subir y bajar", SKY, P_SKY)
        self.say("Una acción vale cien. Sube el cincuenta por ciento y luego baja el cincuenta por ciento. Parece que debería volver a cien, pero no.", fox=True)
        bars, labs = stairs([100, 150, 75], [SKY, MINT, CORAL], ["100", "150", "75"], 0.022)
        VGroup(bars, labs).move_to(2.8 * UP)
        self.play(GrowFromEdge(bars[0], DOWN), FadeIn(labs[0]))
        h1 = hop(bars[0].get_top() + 0.1 * UP, bars[1].get_top() + 0.1 * UP, "× 1.5", MINT)
        self.play(GrowFromEdge(bars[1], DOWN), FadeIn(labs[1]), FadeIn(h1))
        self.hold()
        self.say("La bajada es la mitad de ciento cincuenta, que es más grande que cien: queda en setenta y cinco.")
        h2 = hop(bars[1].get_top() + 0.1 * UP, bars[2].get_top() + 0.1 * UP, "× 0.5", CORAL)
        self.play(GrowFromEdge(bars[2], DOWN), FadeIn(labs[2]), FadeIn(h2))
        f = M(R"1.5 \cdot 0.5 = 0.75", size=46).move_to(0.5 * UP)
        self.play(Write(f))
        self.hold(0.6)
        self.end_section()

        self.mark("Para volver al precio")
        self.say("Por la misma razón, si algo baja el veinte por ciento, para volver al precio de antes no basta subir el veinte. De cien queda en ochenta, y para volver a cien hay que subir veinte sobre ochenta: el veinticinco por ciento.")
        bars, labs = stairs([100, 80, 100], [SKY, CORAL, MINT], ["100", "80", "100"], 0.03)
        VGroup(bars, labs).move_to(2.8 * UP)
        self.play(GrowFromEdge(bars[0], DOWN), FadeIn(labs[0]))
        h1 = hop(bars[0].get_top() + 0.1 * UP, bars[1].get_top() + 0.1 * UP, "−20 %", CORAL)
        self.play(GrowFromEdge(bars[1], DOWN), FadeIn(labs[1]), FadeIn(h1))
        h2 = hop(bars[1].get_top() + 0.1 * UP, bars[2].get_top() + 0.1 * UP, "+25 %", MINT)
        self.play(GrowFromEdge(bars[2], DOWN), FadeIn(labs[2]), FadeIn(h2))
        f = M(R"\frac{20}{80} = 0.25 \qquad 0.8 \cdot 1.25 = 1", size=44).move_to(0.6 * UP)
        self.play(Write(f))
        n = note("La subida se calcula sobre el precio ya rebajado", color=SKY, size=28).move_to(1.0 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S03_Repetido(MBScene):
    def construct(self):
        self.mark("Crecer varias veces")
        self.set_header(R"1.1^3", "Crecer y crecer", MINT, P_MINT)
        self.say("Un pueblo de mil habitantes crece el diez por ciento cada año. Al cabo de tres años no creció el treinta por ciento.", fox=True)
        bars, labs = stairs([1000, 1100, 1210, 1331], [SKY, MINT, MINT, MINT], ["1 000", "1 100", "1 210", "1 331"], 0.0026, w=1.0, gap=0.5)
        VGroup(bars, labs).move_to(2.6 * UP)
        self.play(GrowFromEdge(bars[0], DOWN), FadeIn(labs[0]))
        for k in range(1, 4):
            h = hop(bars[k - 1].get_top() + 0.1 * UP, bars[k].get_top() + 0.1 * UP, "× 1.1", MINT)
            self.play(GrowFromEdge(bars[k], DOWN), FadeIn(labs[k]), FadeIn(h), run_time=0.9)
        self.hold()
        self.say("Cada año se multiplica por uno punto uno, y el diez por ciento de cada año se calcula sobre una población más grande. Uno punto uno multiplicado tres veces por sí mismo se escribe uno punto uno al cubo: es una potencia, que verás en el próximo mundo.")
        f = M(R"1000 \cdot 1.1 \cdot 1.1 \cdot 1.1 = 1000 \cdot 1.1^3 = 1331", size=40).move_to(0.0 * UP)
        f.set_max_width(7.2)
        self.play(Write(f))
        self.hold()
        self.say("El pueblo creció el treinta y tres punto uno por ciento, un poco más que el treinta. Esta idea de multiplicar una y otra vez por el mismo factor volverá con las progresiones geométricas y con el interés compuesto.")
        g = M(R"1.1^3 = 1.331 \;\Rightarrow\; +33.1\%", size=46, color=MINT).move_to(1.3 * DOWN)
        self.play(Write(g))
        n = note("Cambios repetidos: se multiplican los factores", color=MINT, size=28).move_to(2.8 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S04_Cierre(AlgCierre):
    recap = [
        ("Encadenados", "los factores se multiplican: 0.8 · 0.9 = 0.72", CORAL),
        ("Descuento único", "28 %, no 30 %", CORAL),
        ("El orden", "no importa: la multiplicación es conmutativa", HONEY),
        ("Subir y bajar", "+50 % y −50 %: 1.5 · 0.5 = 0.75", SKY),
        ("Volver", "tras −20 % hay que subir 25 %", SKY),
        ("Repetir", "10 % tres veces: 1.1³ = 1.331 → +33.1 %", MINT),
    ]
    recap_say = "Los cambios porcentuales sucesivos no se suman: se multiplican sus factores, y cada uno se aplica sobre lo que va quedando."
    practice = "Encadena descuentos, elige la mejor oferta y pon sellos de cambio"
