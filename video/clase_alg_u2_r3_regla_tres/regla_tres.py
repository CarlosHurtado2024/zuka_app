"""
Álgebra R3 · Regla de tres simple y compuesta (lección alg-12f, parte 3 de razones, 9:16).

Desde lo básico y sin zoom ni 3D: la tabla (una columna por magnitud y una fila por situación); directa con 4 kg de
arroz por 10 000 → 7 kg (reducción a la unidad y proporción); inversa con comida para 8 personas 15 días → 12 personas
(se conserva el producto; el error de hacerla directa da 22.5 días); la receta en cuatro pasos; compuesta con
3 impresoras, 900 hojas y 5 min → 5 impresoras y 1 800 hojas (una magnitud a la vez). Spec 2026-11-11-razones-desde-cero.

    manimgl regla_tres.py S03_Inversa -w -l
"""
from alg_fx import *


def grid(headers, rows, colors, w=2.2, size=30):
    """Tabla con encabezado (magnitudes) y filas (situaciones). Devuelve (tabla, celdas[fila][col])."""
    cells = []
    out = VGroup()
    for r, row in enumerate([headers] + rows):
        line = VGroup()
        for c, v in enumerate(row):
            box = Rectangle(w, 0.7).set_fill(PEACH if r == 0 else CARD, 1).set_stroke(BORDER, 1.5)
            t = (TB if r == 0 else T)(v, size=size - 4 if r == 0 else size, color=colors[c] if (r == 0 or v != "x") else HONEY)
            t.set_max_width(w - 0.2)
            line.add(VGroup(box, t.move_to(box)))
        line.arrange(RIGHT, buff=0)
        out.add(line)
        cells.append(line)
    out.arrange(DOWN, buff=0)
    return out, cells


def side_arrow(col_cells, side, up, color, label):
    """Flecha a un lado de una columna (de la fila 1 a la fila 2, hacia abajo o hacia arriba)."""
    a, b = col_cells[0], col_cells[1]
    x = (a.get_left() if side < 0 else a.get_right())[0] + side * 0.35
    p, q = np.array([x, a.get_y(), 0]), np.array([x, b.get_y(), 0])
    arr = Arrow(q, p, buff=0) if up else Arrow(p, q, buff=0)
    arr.set_color(color)
    t = T(label, size=20, color=color)
    t.next_to(arr, RIGHT if side > 0 else LEFT, buff=0.1)
    return VGroup(arr, t)


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Razones · Parte 3"
    title = "Regla de tres"
    subtitle = "Simple y compuesta"


class S01_Tabla(MBScene):
    def construct(self):
        self.mark("La regla de tres")
        self.set_header(R"\tfrac{a}{b} = \tfrac{c}{x}", "Regla de tres", LAV, P_LAV)
        self.say("La regla de tres es una forma ordenada de resolver problemas de proporciones: conocemos tres datos y buscamos el cuarto.", fox=True)
        prob = note("4 kg de arroz cuestan 10 000 pesos.\n¿Cuánto cuestan 7 kg?", color=LAV, size=30).move_to(3.8 * UP)
        self.play(FadeIn(prob, shift=0.2 * DOWN))
        self.hold()
        self.say("Primer paso: una tabla. Cada columna es una magnitud, aquí kilos y pesos. Cada fila es una situación: la que conocemos y la que preguntan.")
        tb, cells = grid(["kilos", "pesos"], [["4", "10 000"], ["7", "x"]], [SKY, MINT])
        tb.move_to(1.2 * UP)
        self.play(FadeIn(tb[0]))
        self.play(FadeIn(tb[1], shift=0.2 * RIGHT))
        self.play(FadeIn(tb[2], shift=0.2 * RIGHT))
        f1 = T("sabemos", size=22, color=MUTED).next_to(tb[1], LEFT, buff=0.2)
        f2 = T("buscamos", size=22, color=HONEY).next_to(tb[2], LEFT, buff=0.2)
        self.play(FadeIn(f1), FadeIn(f2))
        self.hold()
        self.say("Las magnitudes son las cosas que se miden. Kilos con kilos, pesos con pesos: nunca se mezclan en una misma columna.")
        n = note("columnas = magnitudes  ·  filas = situaciones", color=LAV, size=28).move_to(1.8 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S02_Directa(MBScene):
    def construct(self):
        self.mark("Regla de tres directa")
        self.set_header(R"\downarrow\;\downarrow", "Directa", MINT, P_MINT)
        self.say("Segundo paso: decidir si es directa o inversa. Si compro el doble de kilos, pago el doble: las dos se multiplican por el mismo número. Es directa.", fox=True)
        tb, cells = grid(["kilos", "pesos"], [["4", "10 000"], ["7", "x"]], [SKY, MINT])
        tb.move_to(3.5 * UP)
        self.play(FadeIn(tb))
        col0, col1 = [cells[1][0], cells[2][0]], [cells[1][1], cells[2][1]]
        a0 = side_arrow(col0, -1, False, SKY, "más")
        a1 = side_arrow(col1, 1, False, MINT, "más")
        self.play(GrowArrow(a0[0]), FadeIn(a0[1]), GrowArrow(a1[0]), FadeIn(a1[1]))
        tag = T("flechas en el mismo sentido: directa", size=24, color=MINT).next_to(tb, DOWN, buff=0.25)
        self.play(FadeIn(tag))
        self.hold()
        self.say("Una forma de resolverla es reducir a la unidad. Si cuatro kilos cuestan diez mil, un kilo cuesta diez mil entre cuatro: dos mil quinientos.")
        s1 = M(R"1\ \text{kg}:\quad 10\,000 \div 4 = 2\,500", size=42).move_to(1.0 * UP)
        self.play(Write(s1))
        self.hold()
        self.say("Y siete kilos cuestan siete veces eso: diecisiete mil quinientos pesos.")
        s2 = M(R"7\ \text{kg}:\quad 7 \cdot 2\,500 = 17\,500", size=42).move_to(0.1 * DOWN)
        self.play(Write(s2))
        self.hold()
        self.say("La otra forma es con una proporción. En una directa, la razón de los kilos es igual a la razón de los pesos: cuatro es a siete como diez mil es a equis. Multiplicando en cruz sale lo mismo.")
        s3 = M(R"\frac{4}{7} = \frac{10\,000}{x} \;\Rightarrow\; 4\,x = 70\,000", size=42).move_to(1.6 * DOWN)
        s3.set_max_width(7.2)
        self.play(Write(s3))
        ans = formula_card(R"x = 17\,500 \text{ pesos}", color=MINT, size=46).move_to(3.2 * DOWN)
        self.play(FadeIn(ans, scale=0.9))
        self.hold(0.6)
        self.end_section()


class S03_Inversa(MBScene):
    def construct(self):
        self.mark("Regla de tres inversa")
        self.set_header(R"\downarrow\;\uparrow", "Inversa", CORAL, P_CORAL)
        self.say("Otro problema. Un grupo de ocho personas lleva comida para quince días. Si llegan cuatro personas más y son doce, ¿para cuántos días alcanza la comida?", fox=True)
        prob = note("8 personas: comida para 15 días.\nCon 12 personas, ¿cuántos días?", color=CORAL, size=28).move_to(4.0 * UP)
        self.play(FadeIn(prob, shift=0.2 * DOWN))
        tb, cells = grid(["personas", "días"], [["8", "15"], ["12", "x"]], [SKY, CORAL])
        tb.move_to(1.85 * UP)
        self.play(FadeIn(tb))
        self.hold()
        self.say("Con el doble de personas, la comida dura la mitad de los días: una se multiplica y la otra se divide por el mismo número. Es inversa.")
        col0, col1 = [cells[1][0], cells[2][0]], [cells[1][1], cells[2][1]]
        a0 = side_arrow(col0, -1, False, SKY, "más")
        a1 = side_arrow(col1, 1, True, CORAL, "menos")
        self.play(GrowArrow(a0[0]), FadeIn(a0[1]), GrowArrow(a1[0]), FadeIn(a1[1]))
        self.hold()
        self.say("En una inversa lo que se conserva es el producto. Ocho personas durante quince días son ciento veinte raciones. Doce personas se comen esas mismas ciento veinte raciones.")
        s1 = M(R"8 \cdot 15 = 120 \text{ raciones}", size=44).move_to(0.2 * DOWN)
        self.play(Write(s1))
        s2 = M(R"12\,x = 120 \;\Rightarrow\; x = 10 \text{ d\'ias}", size=44, color=CORAL).move_to(1.3 * DOWN)
        self.play(Write(s2))
        self.hold()
        self.say("Mira el error más común: hacerla como si fuera directa. Saldrían veintidós días y medio, como si con más gente la comida durara más. No tiene sentido.")
        w = M(R"\frac{8}{12} = \frac{15}{x} \;\Rightarrow\; x = 22.5", size=40, color=MUTED).move_to(2.6 * DOWN)
        x = ex_mark(CORAL, size=50).next_to(w, RIGHT, buff=0.3)
        self.play(Write(w), FadeIn(x, scale=0.6))
        n = note("Antes de calcular: ¿directa o inversa?", color=CORAL, size=28).move_to(3.8 * DOWN)
        self.play(FadeIn(n, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S04_Receta(MBScene):
    def construct(self):
        self.mark("La receta en cuatro pasos")
        self.set_header(R"1\,2\,3\,4", "La receta", HONEY, P_HONEY)
        self.say("Resumamos la receta de la regla de tres en cuatro pasos.", fox=True)
        steps = [
            ("1", "Arma la tabla: una columna por magnitud,\nuna fila por situación.", LAV),
            ("2", "Decide: si una se duplica, la otra se duplica\n(directa) o se reduce a la mitad (inversa).", SKY),
            ("3", "Directa: iguala las razones.\nInversa: iguala los productos.", MINT),
            ("4", "Despeja x y revisa que el resultado\ntenga sentido.", CORAL),
        ]
        cards = VGroup()
        for n, txt, col in steps:
            badge = Circle(radius=0.34).set_fill(col, 1).set_stroke(width=0)
            num = TB(n, size=30, color=BG_COLOR).move_to(badge)
            body = T(txt, size=26, color=INK)
            body.set_max_width(5.6)
            row = VGroup(VGroup(badge, num), body).arrange(RIGHT, buff=0.3)
            box = get_card(row, color=col, fill=PEACH, buff=0.22)
            box.stretch_to_fit_width(7.0)
            cards.add(VGroup(box, row.move_to(box).align_to(box, LEFT).shift(0.22 * RIGHT)))
        cards.arrange(DOWN, buff=0.3).move_to(0.7 * UP)
        for c, (_, txt, _) in zip(cards, steps):
            self.play(FadeIn(c, shift=0.2 * UP), run_time=0.8)
            self.say(txt.replace("\n", " "))
            self.hold()
        self.hold(0.6)
        self.end_section()


class S05_Compuesta(MBScene):
    def construct(self):
        self.mark("Regla de tres compuesta")
        self.set_header(R"\times\;\times", "Compuesta", PINK, P_PINK)
        self.say("A veces intervienen más de dos magnitudes: es una regla de tres compuesta. Tres impresoras imprimen novecientas hojas en cinco minutos. ¿Cuánto tardan cinco impresoras en imprimir mil ochocientas hojas?", fox=True)
        prob = note("3 impresoras: 900 hojas en 5 min.\n5 impresoras, 1 800 hojas: ¿cuántos min?", color=PINK, size=26).move_to(4.0 * UP)
        self.play(FadeIn(prob, shift=0.2 * DOWN))
        tb, cells = grid(["impresoras", "hojas", "minutos"], [["3", "900", "5"], ["5", "1 800", "x"]], [SKY, MINT, PINK], w=2.25, size=28)
        tb.move_to(2.0 * UP)
        self.play(FadeIn(tb))
        self.hold()
        self.say("El truco es cambiar una magnitud a la vez, dejando quietas las demás, y preguntar cada vez si es directa o inversa.")
        self.hold()
        self.say("Primero cambiamos las impresoras, con las mismas novecientas hojas. El doble de impresoras termina en la mitad del tiempo: es inversa. Tres impresoras por cinco minutos dan quince; con cinco impresoras, quince entre cinco: tres minutos.")
        s1 = M(R"3 \cdot 5 = 5\,t \;\Rightarrow\; t = 3 \text{ min}", size=42).move_to(0.2 * DOWN)
        p1 = why_pill("impresoras 3 → 5: inversa", SKY).next_to(s1, DOWN, buff=0.15)
        self.play(Write(s1), FadeIn(p1))
        self.hold()
        self.say("Ahora cambiamos las hojas, ya con cinco impresoras. El doble de hojas toma el doble de tiempo: es directa. Tres minutos por dos: seis minutos.")
        s2 = M(R"3 \cdot 2 = 6 \text{ min}", size=42).move_to(1.8 * DOWN)
        p2 = why_pill("hojas 900 → 1 800: directa, × 2", MINT).next_to(s2, DOWN, buff=0.15)
        self.play(Write(s2), FadeIn(p2))
        self.hold()
        self.say("En una sola cuenta: cinco minutos, por tres quintos, por dos. Cada razón va al derecho si la magnitud es directa y volteada si es inversa.")
        ans = formula_card(R"x = 5 \cdot \frac{3}{5} \cdot \frac{1800}{900} = 6 \text{ min}", color=PINK, size=42).move_to(3.6 * DOWN)
        self.play(FadeIn(ans, scale=0.9))
        self.hold(0.6)
        self.end_section()


class S06_Cierre(AlgCierre):
    recap = [
        ("Tabla", "columnas = magnitudes, filas = situaciones", LAV),
        ("Directa", "doble y doble: iguala razones · 4 kg → 7 kg", MINT),
        ("Reducir a la unidad", "1 kg = 2 500 → 7 kg = 17 500", MINT),
        ("Inversa", "doble y mitad: se conserva el producto · 8 · 15 = 12 · 10", CORAL),
        ("Cuidado", "decide el tipo antes de calcular", HONEY),
        ("Compuesta", "una magnitud a la vez: 5 · 3/5 · 2 = 6 min", PINK),
    ]
    recap_say = "La regla de tres arma una tabla, decide si es directa o inversa y resuelve la proporción. La compuesta cambia una magnitud a la vez."
    practice = "Arma reglas de tres, pesa manzanas, organiza obras y mueve engranajes"
