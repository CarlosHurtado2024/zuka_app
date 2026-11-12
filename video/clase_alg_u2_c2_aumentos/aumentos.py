"""
Álgebra C2 · Aumentos y descuentos (lección alg-13c, parte 2 de porcentajes, 9:16).

Desde lo básico y sin zoom ni 3D: una camisa de 60 000 con 25 % de descuento (restar el descuento o pagar el 75 %; la
distributiva lo explica: 60 000 − 0.25 · 60 000 = 60 000(1 − 0.25)); el IVA del 19 % sobre 50 000 (× 1.19 = 59 500);
los factores 1 ± r/100 (+8 %, −8 %, +100 %); el precio sin IVA de 71 400 (÷ 1.19 = 60 000, deshacer una multiplicación
con el recíproco) y el error de restar el 19 %; el cambio porcentual (nuevo − viejo)/viejo: 2 500 → 3 000 es +20 % y de
vuelta −16.7 %. Spec 2026-11-11-porcentajes-desde-cero.

    manimgl aumentos.py S03_Original -w -l
"""
from alg_fx import *


def tag(text, color):
    t = TB(text, size=34, color=INK)
    box = RoundedRectangle(t.get_width() + 0.7, t.get_height() + 0.45, corner_radius=0.18).set_fill(PEACH, 1).set_stroke(color, 3)
    hole = Circle(radius=0.07).set_fill(BG_COLOR, 1).set_stroke(color, 2).move_to(box.get_left() + 0.2 * RIGHT)
    t.move_to(box).shift(0.12 * RIGHT)
    return VGroup(box, hole, t)


def split_bar(parts, width=6.4, h=0.7):
    """Barra partida en trozos [(fracción, color, rótulo)]; los rótulos van debajo."""
    g, labs = VGroup(), VGroup()
    for frac, col, lab in parts:
        r = Rectangle(width * frac, h).set_fill(col, 0.9).set_stroke(BG_COLOR, 2)
        g.add(r)
    g.arrange(RIGHT, buff=0)
    for (frac, col, lab), r in zip(parts, g):
        labs.add(T(lab, size=22, color=col).next_to(r, DOWN, buff=0.15))
    return VGroup(g, labs)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Porcentajes · Parte 2"
    title = "Aumentos y\ndescuentos"
    subtitle = "Multiplicar por un factor"


class S01_Descuento(MBScene):
    def construct(self):
        self.mark("Un descuento")
        self.set_header(R"-25\%", "Descuento", MINT, P_MINT)
        self.say("Una camisa cuesta sesenta mil pesos y tiene un descuento del veinticinco por ciento.", fox=True)
        t = tag("$60 000", MINT).move_to(4.2 * UP)
        self.play(FadeIn(t, shift=0.2 * DOWN))
        b = split_bar([(0.75, MINT, "pagas 75 %"), (0.25, CORAL, "descuento 25 %")]).move_to(2.6 * UP)
        self.play(FadeIn(b[0][0]), FadeIn(b[0][1]), FadeIn(b[1]))
        self.hold()
        self.say("Una forma: calcular el descuento y restarlo. El veinticinco por ciento de sesenta mil es quince mil, y queda por pagar cuarenta y cinco mil.")
        s1 = M(R"60\,000 \cdot 0.25 = 15\,000", size=42).move_to(1.2 * UP)
        s2 = M(R"60\,000 - 15\,000 = 45\,000", size=42).move_to(0.4 * UP)
        self.play(Write(s1))
        self.play(Write(s2))
        self.hold()
        self.say("Otra forma, más rápida: si te quitan el veinticinco por ciento, pagas el setenta y cinco. Basta multiplicar por cero punto setenta y cinco.")
        s3 = M(R"60\,000 \cdot 0.75 = 45\,000", size=46, color=MINT).move_to(0.7 * DOWN)
        self.play(Write(s3))
        self.hold()
        self.say("Las dos formas dan lo mismo por la propiedad distributiva: sacamos el sesenta mil como factor común.")
        s4 = M(R"60\,000 - 0.25 \cdot 60\,000 = 60\,000\,(1 - 0.25)", size=38).move_to(1.8 * DOWN)
        s4.set_max_width(7.2)
        p = why_pill("distributiva", MUTED).next_to(s4, DOWN, buff=0.15)
        self.play(Write(s4), FadeIn(p))
        c = formula_card(R"\text{descuento del } r\%: \ \times \left(1 - \tfrac{r}{100}\right)", color=MINT, size=40).move_to(3.5 * DOWN)
        self.play(FadeIn(c, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S02_Aumento(MBScene):
    def construct(self):
        self.mark("Un aumento")
        self.set_header(R"\times 1.19", "Aumento", HONEY, P_HONEY)
        self.say("Con un aumento pasa lo contrario. Un producto vale cincuenta mil pesos sin impuesto, y el IVA le suma el diecinueve por ciento.", fox=True)
        b = split_bar([(100 / 119, SKY, "precio 100 %"), (19 / 119, HONEY, "IVA 19 %")]).move_to(3.6 * UP)
        self.play(FadeIn(b))
        self.hold()
        self.say("Se paga el ciento diecinueve por ciento del precio: se multiplica por uno punto diecinueve.")
        s = M(R"50\,000 \cdot 1.19 = 59\,500", size=48, color=HONEY).move_to(2.0 * UP)
        self.play(Write(s))
        self.hold()
        self.say("En general, aumentar un r por ciento es multiplicar por uno más r centésimos, y descontarlo es multiplicar por uno menos r centésimos. Ese número se llama factor.")
        c = formula_card(R"\text{aumento: } \times \left(1 + \tfrac{r}{100}\right) \qquad \text{descuento: } \times \left(1 - \tfrac{r}{100}\right)", color=HONEY, size=36).move_to(0.5 * UP)
        self.play(FadeIn(c, shift=0.2 * UP))
        self.hold()
        self.say("Por ejemplo: subir el ocho por ciento es multiplicar por uno punto cero ocho; bajar el ocho por ciento, por cero punto noventa y dos; y subir el cien por ciento es multiplicar por dos, el doble.")
        rows = VGroup(*[M(t, size=40, color=c) for t, c in [
            (R"+8\% \;\to\; \times 1.08", MINT), (R"-8\% \;\to\; \times 0.92", CORAL), (R"+100\% \;\to\; \times 2", SKY)]])
        rows.arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to(1.8 * DOWN)
        self.play(LaggedStartMap(Write, rows, lag_ratio=0.4), run_time=2.2)
        self.hold(0.6)
        self.end_section()


class S03_Original(ExScene):
    def construct(self):
        self.mark("Volver al precio de antes")
        self.set_header(R"\div 1.19", "Precio original", SKY, P_SKY)
        self.say("Ahora al revés. Un televisor cuesta setenta y un mil cuatrocientos pesos con el IVA incluido, y se quiere saber cuánto costaba sin IVA.", fox=True)
        self.problem(1, "Un televisor cuesta 71 400 con el IVA del 19 % incluido. Hallemos su precio sin IVA.", color=SKY)
        self.hold()
        self.say("Un error muy común es quitarle el diecinueve por ciento a setenta y un mil cuatrocientos. Da cincuenta y siete mil ochocientos treinta y cuatro, y está mal: el diecinueve por ciento se calculó sobre el precio sin IVA, que es menor.")
        self.step(R"71\,400 \cdot 0.81 = 57\,834", why="error: el 19 % era de otro precio", why_color=CORAL, color=MUTED)
        self.hold()
        self.say("Lo correcto: el precio sin IVA, multiplicado por uno punto diecinueve, da setenta y un mil cuatrocientos. Para deshacer esa multiplicación se divide entre el mismo factor, que es multiplicar por su recíproco.")
        self.step(R"x \cdot 1.19 = 71\,400", why="con IVA = sin IVA × 1.19", why_color=SKY)
        self.step(R"x = 71\,400 \cdot \frac{1}{1.19} = \frac{71\,400}{1.19} = 60\,000", why="multiplicar por el recíproco deshace", why_color=MINT)
        self.say("Comprobación: sesenta mil por uno punto diecinueve da setenta y un mil cuatrocientos. Sí cuadra.")
        self.answer(R"60\,000 \cdot 1.19 = 71\,400 \ \checkmark", color=MINT)
        self.hold(0.6)
        self.end_section()


class S04_Cambio(MBScene):
    def construct(self):
        self.mark("El cambio porcentual")
        self.set_header(R"\tfrac{\text{nuevo} - \text{viejo}}{\text{viejo}}", "Cambio porcentual", PINK, P_PINK)
        self.say("El pasaje del bus subió de dos mil quinientos a tres mil pesos. Para saber en qué porcentaje subió, se compara la subida con el precio de antes.", fox=True)
        u = 0.0011
        old = Rectangle(1.1, 2500 * u).set_fill(SKY, 0.9).set_stroke(width=0)
        new = Rectangle(1.1, 3000 * u).set_fill(PINK, 0.9).set_stroke(width=0)
        bars = VGroup(old, new).arrange(RIGHT, buff=1.2, aligned_edge=DOWN).move_to(3.1 * UP)
        lo = T("antes: 2 500", size=24, color=SKY).next_to(old, DOWN, buff=0.15)
        ln = T("ahora: 3 000", size=24, color=PINK).next_to(new, DOWN, buff=0.15)
        self.play(GrowFromEdge(old, DOWN), GrowFromEdge(new, DOWN), FadeIn(lo), FadeIn(ln))
        br = Brace(Line(new.get_corner(UR) + 0.0 * UP, new.get_corner(UR) + 500 * u * DOWN), RIGHT, buff=0.1).set_color(HONEY)
        bt = T("+500", size=24, color=HONEY).next_to(br, RIGHT, buff=0.1)
        self.play(GrowFromCenter(br), FadeIn(bt))
        self.hold()
        self.say("La subida fue de quinientos, y se divide entre el precio de antes: quinientos entre dos mil quinientos es cero punto dos. Subió el veinte por ciento.")
        f = M(R"\frac{3000 - 2500}{2500} = \frac{500}{2500} = 0.2 = +20\%", size=42).move_to(0.25 * DOWN)
        f.set_max_width(7.2)
        self.play(Write(f))
        self.hold()
        self.say("Pero si el pasaje volviera a bajar de tres mil a dos mil quinientos, la bajada sería de quinientos sobre tres mil: un dieciséis punto siete por ciento. No es simétrico, porque cambió el precio de antes.")
        g = M(R"\frac{2500 - 3000}{3000} = -\frac{500}{3000} \approx -16.7\%", size=42, color=CORAL).move_to(1.55 * DOWN)
        g.set_max_width(7.2)
        self.play(Write(g))
        c = formula_card(R"\text{cambio} = \frac{\text{nuevo} - \text{viejo}}{\text{viejo}} \cdot 100\%", color=PINK, size=40).move_to(3.2 * DOWN)
        self.play(FadeIn(c, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("Descuento", "pagas lo que queda: × (1 − r/100) · 60 000 · 0.75", MINT),
        ("Distributiva", "60 000 − 0.25 · 60 000 = 60 000(1 − 0.25)", MINT),
        ("Aumento", "× (1 + r/100) · IVA: 50 000 · 1.19 = 59 500", HONEY),
        ("Precio original", "se divide entre el factor: 71 400 ÷ 1.19", SKY),
        ("Cuidado", "no restes el porcentaje al precio final", CORAL),
        ("Cambio porcentual", "(nuevo − viejo)/viejo: +20 % y −16.7 %", PINK),
    ]
    recap_say = "Aumentar o descontar un porcentaje es multiplicar por un factor, y para volver al precio de antes se divide entre ese factor."
    practice = "Mide cambios, estira barras y pega precios en las etiquetas"
