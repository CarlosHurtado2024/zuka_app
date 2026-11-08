"""
Clase 13: Ecuaciones exponenciales y logarítmicas (vertical 9:16, tema Zuka).

Sin voz ni subtítulos ni preguntas al espectador. Intuición primero (la incógnita en el exponente,
cada potencia se alcanza una sola vez) y método después: igualar bases, tomar logaritmos, juntar
logaritmos y comprobar el dominio. Ejemplos: 2^(x+3) = 4^x, 5^x = 12, log6 x + log6(x + 5) = 2 y
triplicar un capital al 5 % continuo (los ejercicios de la lección alg-73 no los repiten).
Cronograma 2026-2 de Álgebra y Trigonometría, clase 19.

    manimgl ecuaciones_exp_log.py S05_Extranas -w -l
    python build.py
"""
from mb_common import *

TOPIC_TITLE = "Ecuaciones exponenciales y logarítmicas"


def get_card_text(lines, color=INK, size=28, fill=PEACH, border=BORDER, width=None):
    text = VGroup(*(T(ln, size=size, color=color, alignment="CENTER") for ln in lines)).arrange(DOWN, buff=0.18)
    card = get_card(text, color=border, fill=fill, buff=0.35)
    if width:
        card.stretch_to_fit_width(width)
    return VGroup(card, text)


class S00_Portada(MBScene):
    part_tag = "Clase 13"
    part_subtitle = "Cuando la incógnita está en el exponente"
    slide_title = "Portada"

    def construct(self):
        self.remove(self.watermark)
        self.mark(self.slide_title)
        blob = Circle(radius=2.75).set_fill(PEACH, 1).set_stroke(width=0).move_to(3.1 * UP)
        halo = Circle(radius=2.25).set_fill("#3B336F", 1).set_stroke(width=0).move_to(blob)
        fox = ImageMobject("zuka_mascota.png", height=3.6).move_to(blob)
        self.play(GrowFromCenter(blob), GrowFromCenter(halo), run_time=1.0)
        self.play(FadeIn(fox, scale=0.85), run_time=1.0)
        tag = get_pill(self.part_tag, ORANGE, PEACH, size=28)
        title = TB("Ecuaciones exponenciales\ny logarítmicas", size=48, color=INK, alignment="CENTER")
        title.set_max_width(LINE_WIDTH)
        rule = Line(LEFT, RIGHT).set_width(1.8).set_stroke(ORANGE, 5)
        sub = T(self.part_subtitle, size=30, color=MUTED)
        sub.set_max_width(LINE_WIDTH)
        block = VGroup(tag, title, rule, sub).arrange(DOWN, buff=0.42).move_to(1.7 * DOWN)
        self.play(FadeIn(tag, shift=0.2 * UP), Write(title, run_time=1.6))
        self.play(ShowCreation(rule), FadeIn(sub, shift=0.2 * UP))
        self.wait(2.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, halo, fox, block)), run_time=0.8)


class S01_Idea(MBScene):
    def construct(self):
        self.mark("La incógnita arriba")
        self.set_header(R"2^x = 8", "La incógnita arriba", C_N, P_N)
        self.say("Hasta ahora la incógnita estaba abajo, como en x al cuadrado igual a 9. Ahora sube "
                 "al exponente: 2 a la x igual a 8 pregunta cuántas veces hay que duplicar para llegar a 8.", fox=True)
        boxes = VGroup()
        for k in range(4):
            n = 2 ** k
            b = RoundedRectangle(width=1.3, height=1.0, corner_radius=0.15).set_fill(P_N, 1).set_stroke(C_N, 2.5)
            boxes.add(VGroup(b, M(str(n), size=40, color=INK).move_to(b)))
        boxes.arrange(RIGHT, buff=0.55).move_to(3.9 * UP)
        arrows = VGroup(*(Arrow(boxes[k].get_right(), boxes[k + 1].get_left(), buff=0.08, stroke_color=C_Q, stroke_width=4) for k in range(3)))
        tags = VGroup(*(M(R"\times 2", size=26, color=C_Q).next_to(arrows[k], UP, buff=0.05) for k in range(3)))
        self.play(FadeIn(boxes[0]))
        for k in range(3):
            self.play(GrowArrow(arrows[k]), FadeIn(tags[k]), FadeIn(boxes[k + 1], shift=0.2 * RIGHT), run_time=0.8)
        ans = M(R"2^3 = 8 \;\Rightarrow\; x = 3", size=44, t2c={"x = 3": C_Q}).next_to(boxes, DOWN, buff=0.5)
        self.play(FadeIn(ans, shift=0.2 * UP))
        self.hold()
        self.say("¿Por qué la respuesta es única? Mira la gráfica de 2 a la x: siempre sube. Una recta "
                 "horizontal la corta una sola vez, así que cada valor positivo se alcanza con un único exponente.")
        axes = Axes(x_range=(-2, 4, 1), y_range=(0, 12, 2), width=6.0, height=5.0,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False)).next_to(ans, DOWN, buff=0.5)
        axes.add_coordinate_labels(font_size=20, num_decimal_places=0)
        curve = axes.get_graph(lambda x: 2 ** x, x_range=(-2, 3.58), color=C_N, stroke_width=5)
        line = DashedLine(axes.c2p(-2, 8), axes.c2p(4, 8), dash_length=0.15).set_stroke(C_Z, 3)
        hit = Dot(axes.c2p(3, 8), radius=0.12).set_fill(C_Q, 1)
        self.play(ShowCreation(axes), ShowCreation(curve), run_time=1.5)
        self.play(ShowCreation(line), FadeIn(hit, scale=0.5))
        self.hold()
        self.say("Eso da la primera regla: si dos potencias de la misma base son iguales, sus "
                 "exponentes son iguales.")
        rule = get_card_text(["misma base → mismos exponentes", "aᵐ = aⁿ  ⇔  m = n"], size=26, fill=P_Q, border=C_Q, width=6.8)
        rule.next_to(axes, DOWN, buff=0.35)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S02_MismaBase(MBScene):
    def construct(self):
        self.mark("Igualar las bases")
        self.set_header(R"a^p = a^q", "Igualar las bases", C_Z, P_Z)
        self.say("Resolvamos 2 a la x más 3 igual a 4 a la x. Las bases son distintas, pero 4 es 2 al "
                 "cuadrado. Así que 4 a la x es 2 al cuadrado, a la x: 2 a la 2x.", fox=True)
        steps = VGroup(
            M(R"2^{x+3} = 4^{x}", size=48),
            M(R"2^{x+3} = (2^{2})^{x} = 2^{2x}", size=44),
            M(R"x + 3 = 2x", size=44),
            M(R"x = 3", size=52, color=C_Q),
        ).arrange(DOWN, buff=0.4).move_to(2.8 * UP)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold()
        self.say("Con la misma base a los dos lados, igualamos exponentes: x más 3 igual a 2x, y "
                 "despejando, x igual a 3.")
        self.play(FadeIn(steps[2], shift=0.2 * UP))
        self.play(FadeIn(steps[3], shift=0.2 * UP))
        self.hold()
        self.say("Siempre conviene comprobar: 2 a la 6 es 64, y 4 al cubo también es 64. La "
                 "ecuación se cumple.")
        check = M(R"2^{3+3} = 2^{6} = 64 \qquad 4^{3} = 64 \;\checkmark", size=38, color=MUTED).next_to(steps, DOWN, buff=0.6)
        self.play(FadeIn(check, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S03_Logaritmo(MBScene):
    def construct(self):
        self.mark("Cuando no hay base común")
        self.set_header(R"\ln", "Tomar logaritmo", C_R, P_R)
        self.say("¿Y 5 a la x igual a 12? 12 no es una potencia de 5. Pero podemos ubicarla: 5 a la 1 "
                 "es 5 y 5 al cuadrado es 25, así que x está entre 1 y 2, más cerca de 1.", fox=True)
        nl = get_number_line(x_range=(0, 3, 1), width=6.4).move_to(4.0 * UP)
        tick5 = M(R"5^1 = 5", size=28, color=C_Z).next_to(nl.n2p(1), UP, buff=0.35)
        tick25 = M(R"5^2 = 25", size=28, color=C_Z).next_to(nl.n2p(2), UP, buff=0.35)
        zone = Line(nl.n2p(1), nl.n2p(2)).set_stroke(C_N, 8)
        self.play(ShowCreation(nl), FadeIn(tick5), FadeIn(tick25))
        self.play(ShowCreation(zone))
        self.hold()
        self.say("Para el valor exacto se toma logaritmo a los dos lados. La propiedad de la potencia "
                 "baja el exponente como factor, y la x queda libre.")
        steps = VGroup(
            M(R"5^{x} = 12", size=46),
            M(R"\ln 5^{x} = \ln 12", size=44),
            M(R"x \ln 5 = \ln 12", size=44, t2c={"x": C_N}),
            M(R"x = \frac{\ln 12}{\ln 5} \approx \frac{2.4849}{1.6094} \approx 1.544", size=40, t2c={"1.544": C_Q}),
        ).arrange(DOWN, buff=0.38).next_to(nl, DOWN, buff=0.8)
        for s in steps:
            self.play(FadeIn(s, shift=0.2 * UP))
            self.wait(0.5)
        self.hold()
        self.say("1.544 está entre 1 y 2, más cerca de 1: justo lo que esperábamos. Sirve cualquier "
                 "logaritmo, natural o de base 10, siempre que se use el mismo arriba y abajo.")
        dot = Dot(nl.n2p(1.544), radius=0.13).set_fill(C_Q, 1)
        self.play(FadeIn(dot, scale=0.5))
        self.hold(0.5)
        self.end_section()


class S04_Logaritmicas(MBScene):
    def construct(self):
        self.mark("Ecuaciones logarítmicas")
        self.set_header(R"\log_b", "Ecuaciones con logaritmos", C_Q, P_Q)
        self.say("Ahora la incógnita está dentro de logaritmos: logaritmo en base 6 de x, más "
                 "logaritmo en base 6 de x más 5, igual a 2. El plan: juntar todo en un solo logaritmo.", fox=True)
        steps = VGroup(
            M(R"\log_6 x + \log_6(x + 5) = 2", size=42),
            M(R"\log_6\left[x(x + 5)\right] = 2", size=42),
            M(R"x(x + 5) = 6^{2} = 36", size=42),
            M(R"x^{2} + 5x - 36 = 0", size=42),
            M(R"(x + 9)(x - 4) = 0", size=44, t2c={"(x + 9)": C_I, "(x - 4)": C_Q}),
        ).arrange(DOWN, buff=0.38).move_to(2.6 * UP)
        self.play(FadeIn(steps[0], shift=0.2 * UP))
        self.play(FadeIn(steps[1], shift=0.2 * UP))
        self.hold()
        self.say("La suma de logaritmos es el logaritmo del producto. Y logaritmo en base 6 igual a 2 "
                 "significa que 6 al cuadrado es lo de adentro: x por x más 5 es 36.")
        self.play(FadeIn(steps[2], shift=0.2 * UP))
        self.hold()
        self.say("Queda una cuadrática: x al cuadrado más 5x menos 36 igual a cero, que se factoriza "
                 "como x más 9 por x menos 4. Los candidatos son menos 9 y 4.")
        self.play(FadeIn(steps[3], shift=0.2 * UP))
        self.play(FadeIn(steps[4], shift=0.2 * UP))
        cands = M(R"x = -9 \quad \text{o} \quad x = 4", size=42).next_to(steps, DOWN, buff=0.5)
        self.play(FadeIn(cands, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S05_Extranas(MBScene):
    def construct(self):
        self.mark("Soluciones extrañas")
        self.set_header(R"x > 0", "Comprobar siempre", C_I, P_I)
        self.say("Ojo: al juntar logaritmos aparecen candidatos falsos. El logaritmo solo existe para "
                 "números positivos: no hay potencia de 6 que dé cero ni un negativo.", fox=True)
        axes = Axes(x_range=(-2, 8, 1), y_range=(-2, 2, 1), width=6.4, height=2.6,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False)).move_to(3.6 * UP)
        curve = axes.get_graph(lambda x: np.log(x) / np.log(6), x_range=(0.05, 8), color=C_Q, stroke_width=5)
        lab = M(R"y = \log_6 x", size=30, color=C_Q).next_to(axes.c2p(6, 1), UP, buff=0.15)
        shade = Rectangle(width=axes.c2p(0, 0)[0] - axes.c2p(-2, 0)[0], height=2.6).set_fill(C_I, 0.18).set_stroke(width=0)
        shade.move_to(axes.c2p(-1, 0))
        nolab = T("aquí no existe", size=22, color=C_I).move_to(shade).shift(0.7 * UP)
        self.play(ShowCreation(axes), ShowCreation(curve), FadeIn(lab), run_time=1.5)
        self.play(FadeIn(shade), FadeIn(nolab))
        self.hold()
        self.say("Probemos x igual a menos 9 en la ecuación original: aparece logaritmo de menos 9. "
                 "No existe. Menos 9 es una solución extraña: salió del álgebra pero no cumple la ecuación.")
        bad = VGroup(
            M(R"x = -9:\quad \log_6(-9) + \log_6(-4)", size=36),
            T("no existe ✗", size=30, color=C_I),
        ).arrange(DOWN, buff=0.2).next_to(axes, DOWN, buff=0.8)
        self.play(FadeIn(bad, shift=0.2 * UP))
        self.hold()
        self.say("Con x igual a 4: logaritmo de 4 más logaritmo de 9 es logaritmo de 36, y 36 es 6 al "
                 "cuadrado: da 2. La única solución es 4.")
        good = VGroup(
            M(R"x = 4:\quad \log_6 4 + \log_6 9 = \log_6 36 = 2", size=36),
            M(R"x = 4", size=52, color=C_Q),
        ).arrange(DOWN, buff=0.3).next_to(bad, DOWN, buff=0.6)
        good[0][-1].set_color(C_Q)
        self.play(FadeIn(good[0], shift=0.2 * UP))
        self.play(FadeIn(good[1], shift=0.2 * UP))
        self.hold()
        self.say("Regla de oro: en las ecuaciones con logaritmos, cada candidato se prueba en la "
                 "ecuación original, y todo lo que está dentro de un logaritmo tiene que ser positivo.", wait=True)
        self.end_section()


class S06_Aplicacion(MBScene):
    def construct(self):
        self.mark("Una aplicación")
        self.set_header(R"A = Pe^{rt}", "¿Cuándo se triplica?", ORANGE, PEACH)
        self.say("Un capital que crece con interés continuo del 5 por ciento anual sigue la fórmula A "
                 "igual a P por e a la 0.05 t. ¿En cuántos años se triplica?", fox=True)
        axes = Axes(x_range=(0, 30, 5), y_range=(0, 5, 1), width=6.0, height=4.0,
                    axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False)).move_to(3.0 * UP)
        axes.add_coordinate_labels(font_size=20, num_decimal_places=0)
        xl = T("años", size=22, color=MUTED).next_to(axes.x_axis, DOWN, buff=0.35).shift(2.6 * RIGHT)
        yl = T("veces el capital", size=22, color=MUTED).next_to(axes.y_axis, UP, buff=0.15).shift(1.2 * RIGHT)
        curve = axes.get_graph(lambda t: np.exp(0.05 * t), x_range=(0, 30), color=ORANGE, stroke_width=5)
        line = DashedLine(axes.c2p(0, 3), axes.c2p(30, 3), dash_length=0.15).set_stroke(C_Z, 3)
        self.play(ShowCreation(axes), FadeIn(xl), FadeIn(yl))
        self.play(ShowCreation(curve), run_time=1.6)
        self.play(ShowCreation(line))
        self.hold()
        self.say("Triplicarse es A igual a 3P. El capital P se cancela, se toma logaritmo natural y "
                 "el tiempo queda solo: logaritmo de 3 sobre 0.05, casi 22 años.")
        steps = VGroup(
            M(R"Pe^{0.05t} = 3P \;\Rightarrow\; e^{0.05t} = 3", size=40),
            M(R"0.05t = \ln 3", size=42),
            M(R"t = \frac{\ln 3}{0.05} \approx \frac{1.0986}{0.05} \approx 21.97", size=40, t2c={"21.97": C_Q}),
        ).arrange(DOWN, buff=0.35).next_to(axes, DOWN, buff=0.8)
        for s in steps:
            self.play(FadeIn(s, shift=0.2 * UP))
            self.wait(0.5)
        hit = Dot(axes.c2p(21.97, 3), radius=0.12).set_fill(C_Q, 1)
        drop = DashedLine(axes.c2p(21.97, 3), axes.c2p(21.97, 0), dash_length=0.12).set_stroke(C_Q, 3)
        self.play(FadeIn(hit, scale=0.5), ShowCreation(drop))
        self.hold()
        self.say("Fíjate que no importa cuánto dinero sea: cualquier capital al 5 por ciento continuo "
                 "se triplica en unos 22 años.", wait=True)
        self.end_section()


class S07_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_card_text(["Misma base", "aᵐ = aⁿ  ⇒  m = n"], size=26, fill=P_Z, border=C_Z, width=6.8),
            get_card_text(["Sin base común", "toma logaritmo: el exponente baja"], size=26, fill=P_R, border=C_R, width=6.8),
            get_card_text(["Con logaritmos", "junta en uno solo y pasa a forma exponencial"], size=26, fill=P_Q, border=C_Q, width=6.8),
            get_card_text(["Comprueba", "dentro del logaritmo, solo positivos"], size=26, fill=P_I, border=C_I, width=6.8),
        ).arrange(DOWN, buff=0.35).move_to(1.5 * UP)
        badges[0][1][0].set_color(C_Z); badges[1][1][0].set_color(C_R); badges[2][1][0].set_color(C_Q); badges[3][1][0].set_color(C_I)
        self.say("Repasemos: con la misma base se igualan exponentes; si no hay base común, se toma "
                 "logaritmo; con logaritmos, se juntan en uno y se pasa a forma exponencial; y siempre se comprueba el dominio.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2.2)
        self.hold(0.5)
        self.say("En los ejercicios vas a equilibrar una balanza moviendo x, descubrir qué platillo no "
                 "existe y ordenar los pasos de una solución.", wait=True)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T("Ahora, los ejercicios:\nequilibra la balanza\ny ordena los pasos", size=30, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
