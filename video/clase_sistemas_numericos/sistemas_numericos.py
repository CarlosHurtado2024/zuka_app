"""
Clase 1 · Sistemas numéricos y números reales  (vertical 9:16, en 2 partes, tema morado de Zuka)

Mismo contenido que la versión horizontal, recompuesto para pantalla de
teléfono: todo se apila de arriba abajo, las rectas numéricas son más cortas y
nada importante baja de CONTENT_BOTTOM, donde la app pone sus botones.

El video va sin marca, sin subtítulos y sin voz: cada frase del guion deja una
pausa de su mismo largo para grabar la locución encima.

Renderizar una escena:      manimgl sistemas_numericos.py S04_Racionales -w
Renderizar todo:            python build.py

Contenido basado en: texto guía Ude@ (Cap. 1, módulo 1.2), Grupo EMAC
(Tema 1) y Stewart, Precálculo §1.1.
"""
from mb_common import *

TOPIC_TITLE = "Sistemas numéricos\ny números reales"


# ---------------------------------------------------------------------------
# Dibujos sencillos que se repiten
# ---------------------------------------------------------------------------
def get_apple(size=0.75):
    body = Circle(radius=size / 2).set_fill("#F27B6B", 1).set_stroke("#D9574A", 2)
    shine = Circle(radius=size / 9).set_fill(WHITE, 0.6).set_stroke(width=0)
    shine.move_to(body.get_center() + size * np.array([-0.17, 0.15, 0]))
    stem = Line(body.get_top() + 0.05 * DOWN, body.get_top() + 0.18 * UP).set_stroke("#8A5A3B", 4)
    leaf = Ellipse(width=size * 0.38, height=size * 0.18).set_fill("#6DBE73", 1).set_stroke(width=0)
    leaf.rotate(20 * DEGREES).next_to(stem, RIGHT, buff=-0.02).shift(0.06 * UP)
    return VGroup(body, shine, stem, leaf)


def get_pizza(n=4, taken=0, radius=1.2):
    """Pizza dividida en n partes iguales; las primeras `taken` quedan resaltadas."""
    slices = VGroup(*(
        Sector(angle=TAU / n, radius=radius, start_angle=PI / 2 + k * TAU / n)
        for k in range(n)
    ))
    for k, piece in enumerate(slices):
        piece.set_fill("#F6B26B" if k < taken else "#FCE3C4", 1)
        piece.set_stroke("#C97B3C", 3)
    crust = Circle(radius=radius).set_stroke("#C97B3C", 5).set_fill(opacity=0)
    return VGroup(slices, crust)


def get_house(size=0.6, color=ORANGE):
    base = Square(size).set_fill("#FFE3CF", 1).set_stroke(color, 3)
    roof = Polygon(base.get_corner(UL) + 0.12 * LEFT, base.get_corner(UR) + 0.12 * RIGHT,
                   base.get_top() + size * 0.6 * UP)
    roof.set_fill(color, 1).set_stroke(color, 3)
    door = Rectangle(size * 0.28, size * 0.45).set_fill(color, 1).set_stroke(width=0)
    door.align_to(base, DOWN)
    return VGroup(base, roof, door)


def get_token(color=ORANGE, radius=0.16):
    return Dot(radius=radius).set_fill(color, 1).set_stroke(WHITE, 3)


# ---------------------------------------------------------------------------
# Portada (una por parte)
# ---------------------------------------------------------------------------
class S00_Portada(MBScene):
    part_tag = "Clase 1 · Parte 1"
    part_subtitle = "Naturales, enteros y racionales"
    slide_title = "Portada · Parte 1"

    def construct(self):
        self.remove(self.watermark)
        self.mark(self.slide_title)
        blob = Circle(radius=2.75).set_fill(PEACH, 1).set_stroke(width=0).move_to(3.1 * UP)
        halo = Circle(radius=2.25).set_fill("#3B336F", 1).set_stroke(width=0).move_to(blob)
        fox = ImageMobject("zuka_mascota.png", height=3.6).move_to(blob)
        self.play(GrowFromCenter(blob), GrowFromCenter(halo), run_time=1.0)
        self.play(FadeIn(fox, scale=0.85), run_time=1.0)

        tag = get_pill(self.part_tag, ORANGE, PEACH, size=28)
        title = TB(TOPIC_TITLE, size=58, color=INK, alignment="CENTER")
        rule = Line(LEFT, RIGHT).set_width(1.8).set_stroke(ORANGE, 5)
        sub = T(self.part_subtitle, size=32, color=MUTED)
        block = VGroup(tag, title, rule, sub).arrange(DOWN, buff=0.42)
        block.move_to(1.6 * DOWN)
        self.play(FadeIn(tag, shift=0.2 * UP), Write(title, run_time=1.6))
        self.play(ShowCreation(rule), FadeIn(sub, shift=0.2 * UP))
        self.wait(2.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, halo, fox, block)), run_time=0.8)
        self.after_cover()

    def after_cover(self):
        pass

    def get_recap(self, items, caption, extra=None):
        """Recordatorio de lo visto en las partes anteriores."""
        self.mark("Lo que ya conocemos")
        badges = VGroup(*(get_set_badge(tex, name, color, fill) for tex, name, color, fill in items))
        badges.arrange_in_grid(len(items) // 3 + (1 if len(items) % 3 else 0), 3, h_buff=0.3, v_buff=0.4)
        badges.move_to(1.4 * UP)
        self.say(caption, fox=True)
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.25), run_time=1.8)
        self.hold()
        if extra:
            words = T(extra, size=30, color=INK, alignment="CENTER")
            words.set_max_width(LINE_WIDTH)
            words.next_to(badges, DOWN, buff=0.9)
            self.say(extra)
            self.play(FadeIn(words, shift=0.2 * UP))
            self.hold(0.3)
        self.end_section()


class S00_PortadaParte2(S00_Portada):
    part_tag = "Clase 1 · Parte 2"
    part_subtitle = "Irracionales, reales y sus reglas"
    slide_title = "Portada · Parte 2"

    def after_cover(self):
        # Mismo guion que la versión horizontal, apilado para la pantalla vertical
        self.mark("Lo que ya conocemos")
        badges = VGroup(
            get_set_badge(R"\mathbb{N}", "contar", C_N, P_N),
            get_set_badge(R"\mathbb{Z}", "bajo cero", C_Z, P_Z),
            get_set_badge(R"\mathbb{Q}", "repartir", C_Q, P_Q),
        ).arrange(RIGHT, buff=0.3).move_to(2.6 * UP)
        self.say("En la Parte 1 conocimos a tres familias: los naturales para contar, los enteros para ir "
                 "bajo cero y los racionales para repartir.", fox=True)
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=1.8)
        self.hold()
        new = VGroup(
            get_set_badge(R"\mathbb{I}", "medir", C_I, P_I, width=3.2),
            get_set_badge(R"\mathbb{R}", "todos juntos", C_R, P_R, width=3.2),
        ).arrange(RIGHT, buff=0.4).next_to(badges, DOWN, buff=0.9)
        self.say("Hoy completamos la familia, conocemos sus reglas de juego y aprendemos a comparar números.")
        self.play(LaggedStartMap(FadeIn, new, shift=0.3 * UP, lag_ratio=0.3))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 1. La familia de los números
# ---------------------------------------------------------------------------
class S01_Familia(MBScene):
    def construct(self):
        self.mark("La familia de los números")
        self.set_header(R"1,2,3", "La familia de los números", ORANGE, PEACH)
        cloud_data = [
            ("3", C_N, (-2.4, 4.6)), ("-2", C_Z, (0.6, 5.0)), (R"\tfrac{1}{2}", C_Q, (2.6, 4.0)),
            (R"\sqrt{2}", C_I, (-2.7, 2.6)), (R"\pi", C_I, (0.4, 2.2)), ("0.75", C_Q, (2.7, 1.2)),
            ("7", C_N, (-2.4, 0.4)), ("-5", C_Z, (0.8, -0.8)), (R"\tfrac{3}{4}", C_Q, (2.9, -1.9)),
            ("0", INK, (-2.6, -2.6)), ("12", C_N, (0.9, -3.3)), ("-1", C_Z, (-1.4, -4.1)),
        ]
        cloud = VGroup(*(
            M(tex, size=76, color=color).move_to(np.array([x, y, 0]))
            for tex, color, (x, y) in cloud_data
        ))
        for k, mob in enumerate(cloud):
            phase = 0.7 * k
            mob.base_point = mob.get_center().copy()
            mob.add_updater(lambda m, dt, phase=phase: m.move_to(
                m.base_point + 0.12 * np.array([np.sin(self.time * 0.8 + phase), np.cos(self.time * 0.6 + phase), 0])
            ))
        self.add(cloud)
        self.play(LaggedStartMap(FadeIn, cloud, scale=0.6, lag_ratio=0.12), run_time=2.5)
        self.say("¡Hola! Soy tu guía. Hoy vamos a conocer a la familia de los números, "
                 "con calma y sin afán.", fox=True, wait=True)
        self.say("Los números no aparecieron todos de una vez. Cada vez que la gente tuvo "
                 "un problema nuevo, inventó números nuevos para resolverlo.", wait=True)
        self.play(FadeOut(cloud, lag_ratio=0.05), run_time=1.0)
        cloud.clear_updaters()
        self.remove(cloud)

        cards_data = [
            ("Contar", R"\mathbb{N}", C_N, P_N, self.get_count_icon()),
            ("Bajar de cero", R"\mathbb{Z}", C_Z, P_Z, self.get_cold_icon()),
            ("Repartir", R"\mathbb{Q}", C_Q, P_Q, get_pizza(4, 1, radius=0.5)),
            ("Medir con precisión", R"\mathbb{R}", C_R, P_R, self.get_tile_icon()),
        ]
        cards = VGroup()
        for name, letter, color, fill, icon in cards_data:
            label = TB(name, size=24, color=INK)
            icon.set_height(1.1)
            content = VGroup(icon, label).arrange(DOWN, buff=0.25)
            box = RoundedRectangle(3.45, 2.4, corner_radius=0.3).set_fill(fill, 1).set_stroke(color, 2.5)
            content.set_max_width(3.1)
            content.move_to(box)
            badge = Tex(letter, font_size=66).set_color(color)
            arrow = Arrow(UP, DOWN, thickness=3).set_length(0.45).set_color(color)
            column = VGroup(VGroup(box, content), arrow, badge).arrange(DOWN, buff=0.15)
            cards.add(column)
        cards.arrange_in_grid(2, 2, h_buff=0.3, v_buff=0.55).move_to(0.25 * UP)

        self.say("Es como una caja de herramientas: empiezas con un martillo, y cuando "
                 "necesitas apretar un tornillo, agregas un destornillador.", fox=True)
        self.play(LaggedStart(*(FadeIn(c[0], shift=0.3 * UP) for c in cards), lag_ratio=0.4), run_time=2.5)
        self.hold()
        self.say("Primero necesitamos contar. Luego, hablar de cosas bajo cero. "
                 "Después, repartir. Y por último, medir con mucha precisión.")
        for column in cards:
            self.play(GrowArrow(column[1]), FadeIn(column[2], scale=1.4), run_time=0.7)
        self.hold(0.5)

        self.mark("El apodo de cada familia")
        self.clear_scene()
        badges = VGroup(
            get_set_badge(R"\mathbb{N}", "Naturales", C_N, P_N, width=3.4),
            get_set_badge(R"\mathbb{Z}", "Enteros", C_Z, P_Z, width=3.4),
            get_set_badge(R"\mathbb{Q}", "Racionales", C_Q, P_Q, width=3.4),
            get_set_badge(R"\mathbb{R}", "Reales", C_R, P_R, width=3.4),
        ).arrange_in_grid(2, 2, h_buff=0.35, v_buff=0.6).move_to(1.9 * UP)
        self.say("Cada familia tiene un apodo: una letra mayúscula con una rayita doble. "
                 "Así escribimos menos.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.25), run_time=2)
        self.hold()
        origins = VGroup(
            T("ℤ  de Zahlen = «números» en alemán", size=28, color=C_Z),
            T("ℚ  de quotient = «cociente», una división", size=28, color=C_Q),
        ).arrange(DOWN, buff=0.6).next_to(badges, DOWN, buff=1.4)
        self.say("La ℤ viene de Zahlen, que significa «números» en alemán, y la ℚ de quotient, "
                 "que significa «cociente», o sea, una división.")
        self.play(FadeIn(origins[0], shift=0.2 * UP))
        self.play(FadeIn(origins[1], shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()

    def get_count_icon(self):
        return VGroup(*(get_apple(0.5) for _ in range(3))).arrange(RIGHT, buff=0.08)

    def get_cold_icon(self):
        tube = RoundedRectangle(0.28, 1.3, corner_radius=0.14).set_fill(WHITE, 1).set_stroke(C_Z, 3)
        bulb = Circle(radius=0.24).set_fill(C_Z, 1).set_stroke(C_Z, 3).next_to(tube, DOWN, buff=-0.12)
        level = Rectangle(0.14, 0.35).set_fill(C_Z, 1).set_stroke(width=0).move_to(bulb.get_top() + 0.15 * UP)
        zero = Line(LEFT, RIGHT).set_width(0.5).set_stroke(INK, 2).move_to(tube.get_center() + 0.1 * DOWN)
        return VGroup(tube, bulb, level, zero)

    def get_tile_icon(self):
        square = Square(1).set_fill(WHITE, 1).set_stroke(C_R, 3)
        diag = Line(square.get_corner(DL), square.get_corner(UR)).set_stroke(C_I, 5)
        return VGroup(square, diag)


# ---------------------------------------------------------------------------
# 2. Números naturales
# ---------------------------------------------------------------------------
class S02_Naturales(MBScene):
    def construct(self):
        self.mark("Contar")
        self.set_header(R"\mathbb{N}", "Números naturales", C_N, P_N)
        apples = VGroup(*(get_apple(1.05) for _ in range(5))).arrange(RIGHT, buff=0.32)
        apples.move_to(3.3 * UP)
        self.say("Los naturales son los números que usamos para contar: una manzana, dos, tres, cuatro, cinco.")
        self.play(LaggedStartMap(FadeIn, apples, shift=0.3 * DOWN, lag_ratio=0.2))
        counts = VGroup(*(
            TB(str(n), size=46, color=C_N).next_to(apple, UP, buff=0.3)
            for n, apple in enumerate(apples, start=1)
        ))
        for count, apple in zip(counts, apples):
            self.play(FadeIn(count, shift=0.2 * UP), apple.animate.scale(1.08), run_time=0.4)
            self.play(apple.animate.scale(1 / 1.08), run_time=0.15)
        self.hold()

        formula = Tex(R"\mathbb{N} = \{1, 2, 3, 4, \dots\}", font_size=80,
                      isolate=[R"\mathbb{N}", R"\{", R"\}", R"\dots"])
        formula.set_color(INK)
        formula[R"\mathbb{N}"].set_color(C_N)
        formula.move_to(0.1 * DOWN)
        self.say("Así se escribe la familia completa. Vamos a leerla con calma, símbolo por símbolo.")
        self.play(Write(formula))
        self.hold()

        self.mark("Leer los símbolos: llaves y puntos")
        self.play(FadeOut(VGroup(apples, counts)), formula.animate.move_to(4.3 * UP))
        braces = VGroup(formula[R"\{"], formula[R"\}"])
        box_braces = VGroup(*(SurroundingRectangle(b, buff=0.08).set_stroke(ORANGE, 3) for b in braces))
        card_braces = get_notation(R"\{\ \ \}", "Las llaves son como una bolsa: adentro guardamos los números de la familia.")
        card_braces.move_to(1.1 * UP)
        self.say("Las llaves son como una bolsa: todo lo que está adentro pertenece a la familia.", fox=True)
        self.play(ShowCreation(box_braces), FadeIn(card_braces, shift=0.3 * UP))
        self.hold()
        dots_box = SurroundingRectangle(formula[R"\dots"], buff=0.08).set_stroke(ORANGE, 3)
        card_dots = get_notation(R"\dots", "Los tres puntitos significan «y así sigue, para siempre».")
        card_dots.move_to(card_braces)
        self.say("Los tres puntitos significan «y así sigue, para siempre». La lista de los naturales nunca se acaba.")
        self.play(ReplacementTransform(box_braces, dots_box), FadeTransform(card_braces, card_dots))
        self.hold()
        reading = T("«Los naturales son uno, dos, tres,\ncuatro, y así sucesivamente.»", size=32, color=MUTED,
                    alignment="CENTER")
        reading.next_to(card_dots, DOWN, buff=1.3)
        self.say("Entonces se lee: «los naturales son uno, dos, tres, cuatro, y así sucesivamente».")
        self.play(FadeOut(dots_box), FadeIn(reading, shift=0.2 * DOWN))
        self.hold(0.5)

        self.mark("La recta numérica: un camino de baldosas")
        self.clear_scene()
        line = get_number_line((0, 8, 1), width=7.0, font_size=34).move_to(0.9 * UP)
        tiles = VGroup(*(
            RoundedRectangle(0.78, 0.62, corner_radius=0.13).set_fill(P_N, 1).set_stroke(C_N, 1.5)
            .move_to(number)
            for number in line.numbers
        ))
        self.say("Imagina un camino recto con baldosas numeradas. Avanzar hacia la derecha es contar: uno, dos, tres…",
                 fox=True)
        self.play(LaggedStartMap(FadeIn, tiles, lag_ratio=0.05), ShowCreation(line), run_time=1.5)
        token = get_token(ORANGE).move_to(line.n2p(1) + 0.35 * UP)
        self.play(FadeIn(token, scale=2))
        for n in range(2, 6):
            self.play(token.animate(path_arc=-PI / 2).move_to(line.n2p(n) + 0.35 * UP), run_time=0.5)
        self.hold()
        plus = M(R"n \;\to\; n + 1", size=76, t2c={"n": C_N}).move_to(4.2 * UP)
        self.say("Siempre puedes dar un paso más. Después de cualquier número n viene n + 1. "
                 "Por eso no existe un natural «más grande».")
        self.play(Write(plus))
        for n in range(6, 9):
            self.play(token.animate(path_arc=-PI / 2).move_to(line.n2p(n) + 0.35 * UP), run_time=0.4)
        self.hold()
        zero = Dot(line.n2p(0), radius=0.13).set_fill(BG_COLOR, 1).set_stroke(MUTED, 3)
        zero_note = T("¿y el 0?\nsignifica «nada»", size=30, color=MUTED, alignment="CENTER")
        zero_note.next_to(line.n2p(0), DOWN, buff=1.7).shift(0.5 * RIGHT)
        self.say("¿Y el cero? Significa «nada». Algunos libros lo cuentan como natural; "
                 "en este curso, los naturales empiezan en 1.")
        self.play(GrowFromCenter(zero), FadeIn(zero_note, shift=0.2 * DOWN))
        self.hold(0.5)

        self.mark("Pertenece: el símbolo ∈")
        self.clear_scene()
        belongs = M(R"7 \in \mathbb{N}", size=120).move_to(3.9 * UP)
        reading = T("«siete pertenece a los naturales»", size=30, color=MUTED).next_to(belongs, DOWN, buff=0.45)
        card = get_notation(R"\in", "Significa «pertenece a», como decir «vive en esta familia».")
        card.move_to(1.0 * DOWN)
        self.say("Para decir que el 7 es un número natural escribimos 7 ∈ ℕ. "
                 "Se lee: «siete pertenece a los naturales».")
        self.play(Write(belongs), FadeIn(card, shift=0.3 * UP))
        self.play(FadeIn(reading))
        self.hold()
        not_belongs = M(R"\tfrac{1}{2} \notin \mathbb{N}", size=120).move_to(belongs)
        reading2 = T("«un medio no pertenece\na los naturales»", size=30, color=MUTED, alignment="CENTER")
        reading2.next_to(not_belongs, DOWN, buff=0.45)
        card2 = get_notation(R"\notin", "Con una rayita que lo tacha significa lo contrario: «no pertenece».")
        card2.move_to(card)
        self.say("Si tachamos el símbolo, ∉, decimos lo contrario. Media manzana no sirve para contar "
                 "manzanas enteras: un medio no es natural.")
        self.play(FadeTransform(belongs, not_belongs), FadeTransform(reading, reading2), FadeTransform(card, card2))
        self.hold(0.5)

        self.mark("Un problema que ℕ no resuelve")
        self.clear_scene()
        question = M(R"3 - 5 = \;?", size=100).move_to(3.9 * UP)
        line = get_number_line((0, 6, 1), width=6.4, font_size=34).move_to(0.6 * UP)
        self.say("Ahora, un problema: tienes 3 dulces y le debes 5 a un amigo. ¿Cuántos te quedan?")
        self.play(Write(question), ShowCreation(line))
        token = get_token(ORANGE).move_to(line.n2p(3) + 0.35 * UP)
        self.play(FadeIn(token, scale=2))
        for n in range(2, -1, -1):
            self.play(token.animate(path_arc=PI / 2).move_to(line.n2p(n) + 0.35 * UP), run_time=0.45)
        self.play(token.animate(path_arc=PI / 2).move_to(line.n2p(-1) + 0.35 * UP).set_opacity(0.3), run_time=0.6)
        nothing = T("¡aquí ya no hay camino!", size=36, color=C_I)
        nothing.next_to(line, DOWN, buff=1.8)
        self.say("Contamos hacia atrás: 2, 1, 0… y el camino se acaba. Ningún número natural responde. "
                 "¡Necesitamos números nuevos!")
        self.play(FadeIn(nothing, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# 3. Números enteros
# ---------------------------------------------------------------------------
class S03_Enteros(MBScene):
    def construct(self):
        self.mark("Pisos y sótanos")
        self.set_header(R"\mathbb{Z}", "Números enteros", C_Z, P_Z)
        floors = list(range(-3, 5))
        h = 0.62
        building = VGroup()
        for f in floors:
            fill = P_N if f > 0 else (PEACH_DEEP if f == 0 else P_Z)
            room = Rectangle(2.6, h).set_fill(fill, 1).set_stroke(WHITE, 3)
            room.move_to(np.array([0.5, (f - 0.5) * h + 2.3, 0]))
            label = TB(str(f), size=26, color=C_N if f > 0 else (INK if f == 0 else C_Z))
            label.next_to(room, LEFT, buff=0.3)
            building.add(VGroup(room, label))
        ground = Line(LEFT, RIGHT).set_width(4.6).set_stroke("#6DBE73", 6)
        ground.move_to(np.array([0.5, -0.5 * h + 2.3 + h / 2, 0]))
        street = T("calle", size=24, color="#4E9B55").next_to(ground, RIGHT, buff=0.2)
        self.say("Piensa en el ascensor de un edificio: los pisos de arriba son 1, 2, 3…; "
                 "la calle es el 0; y los sótanos están debajo.", fox=True)
        self.play(LaggedStartMap(FadeIn, building, shift=0.1 * UP, lag_ratio=0.1), run_time=2)
        self.play(ShowCreation(ground), FadeIn(street))
        self.hold()

        elevator = RoundedRectangle(1.0, h * 0.8, corner_radius=0.1).set_fill(ORANGE, 1).set_stroke(WHITE, 2)
        elevator.move_to(building[floors.index(3)][0])
        equation = M(R"3 - 5 = -2", size=88).move_to(1.4 * DOWN)
        self.say("Si estás en el piso 3 y bajas 5 pisos, terminas en el sótano 2. "
                 "Lo escribimos así: 3 − 5 = −2.")
        self.play(FadeIn(elevator, scale=1.3))
        self.play(elevator.animate.move_to(building[floors.index(-2)][0]), run_time=2.5, rate_func=smooth)
        self.play(Write(equation))
        self.hold()
        card = get_notation(R"-2", "El signo menos delante del número quiere decir «por debajo del cero».",
                            color=C_Z)
        card.move_to(3.6 * DOWN)
        self.say("El signo menos delante de un número quiere decir «por debajo del cero». Se lee «menos dos».")
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold()
        self.say("Lo mismo pasa con la temperatura en un páramo, o con una deuda de dinero: "
                 "son cantidades por debajo de cero.", wait=True)

        self.mark("La familia ℤ")
        self.clear_scene()
        line = get_number_line((-6, 6, 1), width=7.4, font_size=28).move_to(1.2 * UP)
        pos = VGroup(*(Dot(line.n2p(n), radius=0.1).set_color(C_N) for n in range(1, 7)))
        zero = Dot(line.n2p(0), radius=0.1).set_color(INK)
        self.say("Si acostamos el edificio, tenemos la recta: los negativos a la izquierda del cero "
                 "y los positivos a la derecha.")
        self.play(ShowCreation(line), FadeIn(pos), FadeIn(zero))
        neg = pos.copy()
        self.play(Rotate(neg, PI, axis=UP, about_point=line.n2p(0)), run_time=2)
        self.play(neg.animate.set_color(C_Z))
        self.hold()
        formula = Tex(R"\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}", font_size=56,
                      isolate=[R"\mathbb{Z}", R"\dots"])
        formula.set_color(INK)
        formula[R"\mathbb{Z}"].set_color(C_Z)
        formula.move_to(4.3 * UP)
        self.play(Write(formula))
        dots = formula[R"\dots"]
        boxes = VGroup(*(SurroundingRectangle(d, buff=0.08).set_stroke(ORANGE, 3) for d in dots))
        self.say("Fíjate en los tres puntitos a los dos lados: la lista sigue para siempre "
                 "hacia la derecha y también hacia la izquierda.")
        self.play(ShowCreation(boxes))
        self.hold()
        self.play(FadeOut(boxes))

        self.mark("Opuestos: como en un espejo")
        mirror = DashedLine(line.n2p(0) + 1.1 * DOWN, line.n2p(0) + 1.1 * UP).set_stroke(MUTED, 2)
        a, ma = pos[2], neg[2]
        glow = VGroup(*(Circle(radius=0.26).set_stroke(ORANGE, 4).move_to(d) for d in (a, ma)))
        labs = VGroup(
            M("3", size=44, color=C_N).next_to(a, DOWN, buff=0.5),
            M("-3", size=44, color=C_Z).next_to(ma, DOWN, buff=0.5),
        )
        self.say("Cada número tiene un gemelo al otro lado del cero, como su reflejo en un espejo. "
                 "Se llama su opuesto.", fox=True)
        self.play(ShowCreation(mirror), ShowCreation(glow), FadeIn(labs))
        self.hold()
        sum_eq = M(R"3 + (-3) = 0", size=88).move_to(1.9 * DOWN)
        self.say("Subir 3 pisos y luego bajar 3 te devuelve a la calle: 3 + (−3) = 0.")
        self.play(Write(sum_eq))
        self.hold()
        paren = T("Los paréntesis en (−3) solo evitan\nque el + y el − queden pegados.", size=30,
                  color=MUTED, alignment="CENTER").next_to(sum_eq, DOWN, buff=1.1)
        self.say("Los paréntesis en (−3) solo sirven para que el signo más y el signo menos "
                 "no queden pegados.")
        self.play(FadeIn(paren, shift=0.2 * UP))
        self.hold(0.4)

        self.mark("Un problema que ℤ no resuelve")
        self.clear_scene()
        pizza = get_pizza(2, 0, radius=1.3).move_to(3.1 * UP)
        people = T("1 pizza  ÷  2 personas", size=34, color=INK).next_to(pizza, DOWN, buff=0.5)
        line = get_number_line((-2, 3, 1), width=6.0, font_size=34).move_to(1.8 * DOWN)
        gap = Line(line.n2p(0), line.n2p(1)).set_stroke(C_I, 10, opacity=0.6)
        q = TB("?", size=66, color=C_I).next_to(gap, UP, buff=0.3)
        self.say("Ahora queremos repartir una pizza entre dos personas. A cada una le toca algo "
                 "entre 0 y 1… y ahí no hay ningún entero.")
        self.play(FadeIn(pizza), FadeIn(people), ShowCreation(line))
        self.play(ShowCreation(gap), FadeIn(q, shift=0.3 * DOWN))
        self.hold(0.5)
        self.end_section()


# ---------------------------------------------------------------------------
# Fin de la Parte 1
# ---------------------------------------------------------------------------
class S04b_CierreParte1(MBScene):
    def construct(self):
        self.mark("Repaso de la Parte 1")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_set_badge(R"\mathbb{N}", "contar", C_N, P_N),
            get_set_badge(R"\mathbb{Z}", "bajo cero", C_Z, P_Z),
            get_set_badge(R"\mathbb{Q}", "repartir", C_Q, P_Q),
        ).arrange(RIGHT, buff=0.3).move_to(2.6 * UP)
        chain = M(R"\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}", size=88).next_to(badges, DOWN, buff=0.9)
        self.say("Repasemos: los naturales sirven para contar, los enteros para ir bajo cero y los "
                 "racionales para repartir.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=1.8)
        self.hold()
        self.say("Cada familia guarda a la anterior: todo natural es entero, y todo entero es racional.")
        self.play(Write(chain))
        self.hold(0.5)

        self.mark("En la Parte 2")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡Muy bien!\nToma un respiro.", size=46, color=INK, alignment="CENTER")
        nxt = T("En la Parte 2: irracionales, reales,\nlas reglas del juego y el valor absoluto", size=30,
                color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)


# ---------------------------------------------------------------------------
# 4. Números racionales
# ---------------------------------------------------------------------------
class S04_Racionales(MBScene):
    def construct(self):
        self.mark("Repartir: las fracciones")
        self.set_header(R"\mathbb{Q}", "Números racionales", C_Q, P_Q)
        pizza = get_pizza(2, 0, radius=1.75).move_to(3.3 * UP)
        self.play(FadeIn(pizza))
        half = M(R"\frac{1}{2}", size=130, color=C_Q).move_to(0.6 * DOWN)
        self.say("Partimos la pizza en 2 partes iguales y cada persona toma 1. "
                 "Eso es un medio, y se escribe así: 1/2.")
        self.play(pizza[0][0].animate.set_fill("#F6B26B").shift(0.15 * UP + 0.08 * LEFT))
        self.play(Write(half))
        self.hold()

        pizza4 = get_pizza(4, 3, radius=1.75).move_to(pizza)
        frac = M(R"\frac{3}{4}", size=140, color=C_Q).move_to(0.8 * LEFT + 0.6 * DOWN)
        self.say("Ahora la partimos en 4 partes iguales y tomamos 3. Eso es tres cuartos: 3/4.")
        self.play(FadeTransform(pizza, pizza4), FadeTransform(half, frac))
        self.hold()
        num_label = T("numerador:\ncuántas partes\ntomamos", size=26, color=INK)
        den_label = T("denominador:\nen cuántas partes\niguales partimos", size=26, color=INK)
        num_label.next_to(frac, RIGHT, buff=0.9).align_to(frac, UP)
        den_label.next_to(frac, RIGHT, buff=0.9).align_to(frac, DOWN)
        num_arrow = Arrow(num_label.get_left(), frac.get_corner(UR) + 0.2 * DOWN, buff=0.12, thickness=3).set_color(ORANGE)
        den_arrow = Arrow(den_label.get_left(), frac.get_corner(DR) + 0.2 * UP, buff=0.12, thickness=3).set_color(ORANGE)
        self.say("La raya de la fracción significa «dividido entre». Abajo va el denominador: "
                 "en cuántas partes iguales partimos.")
        self.play(GrowArrow(den_arrow), FadeIn(den_label))
        self.hold()
        self.say("Arriba va el numerador: cuántas de esas partes tomamos. Tres de cuatro: tres cuartos.")
        self.play(GrowArrow(num_arrow), FadeIn(num_label))
        self.hold(0.5)

        self.mark("¿Qué es un número racional?")
        self.clear_scene()
        formula = Tex(R"\mathbb{Q} = \left\{ \frac{m}{n} \;:\; m, n \in \mathbb{Z}, \; n \neq 0 \right\}",
                      font_size=54, isolate=[R"\mathbb{Q}", R"\frac{m}{n}", ":", R"m, n \in \mathbb{Z}", R"n \neq 0"])
        formula.set_color(INK)
        formula[R"\mathbb{Q}"].set_color(C_Q)
        formula.move_to(4.3 * UP)
        self.say("Los racionales son todos los números que se pueden escribir como una fracción. "
                 "Así se escribe la familia; leámosla por partes.")
        self.play(Write(formula, run_time=2))
        self.hold()
        notes = [
            (R"\frac{m}{n}", R"\frac{m}{n}", "Una fracción. Las letras m y n son casillas vacías: ahí puede ir cualquier número."),
            (":", ":", "Se lee «tal que». Después vienen las condiciones que deben cumplirse."),
            (R"m, n \in \mathbb{Z}", R"m, n \in \mathbb{Z}", "Primera condición: arriba y abajo van números enteros."),
            (R"n \neq 0", R"\neq", "El símbolo ≠ significa «distinto de»: abajo nunca puede ir cero."),
        ]
        card = None
        box = None
        for key, symbol, caption in notes:
            part = formula[key]
            new_box = SurroundingRectangle(part, buff=0.07).set_stroke(ORANGE, 3)
            new_card = get_notation(symbol, caption)
            new_card.move_to(0.6 * UP)
            self.say(caption)
            if card is None:
                self.play(ShowCreation(new_box), FadeIn(new_card, shift=0.3 * UP))
            else:
                self.play(ReplacementTransform(box, new_box), FadeTransform(card, new_card))
            card, box = new_card, new_box
            self.hold()
        self.say("¿Por qué no puede ser cero? Porque repartir una pizza entre cero personas no "
                 "tiene sentido: ¡no hay a quién dársela!", fox=True, wait=True)
        self.play(FadeOut(box))
        five = M(R"5 = \frac{5}{1}", size=88).move_to(3.5 * DOWN)
        self.say("Ojo: los enteros también son racionales. El 5 es lo mismo que 5/1: cinco pizzas enteras.")
        self.play(Write(five))
        self.hold(0.5)

        self.mark("Fracciones equivalentes")
        self.clear_scene()
        p1 = get_pizza(2, 1, radius=1.6).move_to(1.8 * LEFT + 2.4 * UP)
        p2 = get_pizza(4, 2, radius=1.6).move_to(1.8 * RIGHT + 2.4 * UP)
        f1 = M(R"\frac{1}{2}", size=100, color=C_Q).next_to(p1, DOWN, buff=0.9)
        f2 = M(R"\frac{2}{4}", size=100, color=C_Q).next_to(p2, DOWN, buff=0.9)
        eq = M("=", size=100).move_to((f1.get_center() + f2.get_center()) / 2)
        self.say("Media pizza es lo mismo que dos cuartos. Son dos nombres distintos para la misma cantidad: "
                 "las llamamos fracciones equivalentes.")
        self.play(FadeIn(p1), FadeIn(p2))
        self.play(Write(f1), Write(f2), Write(eq))
        self.hold(0.5)

        self.mark("Las fracciones en la recta")
        self.clear_scene()
        line = get_number_line((0, 2, 1), width=6.6, font_size=38).move_to(0.9 * UP)
        quarters = VGroup(*(
            Line(0.12 * UP, 0.12 * DOWN).move_to(line.n2p(k / 4)).set_stroke(C_Q, 3)
            for k in range(1, 8) if k % 4
        ))
        self.say("Para ubicar 3/4 en la recta, partimos el tramo de 0 a 1 en 4 partes iguales y avanzamos 3.")
        self.play(ShowCreation(line))
        self.play(LaggedStartMap(ShowCreation, quarters, lag_ratio=0.1))
        token = get_token(C_Q).move_to(line.n2p(0) + 0.35 * UP)
        self.play(FadeIn(token, scale=2))
        for k in range(1, 4):
            self.play(token.animate(path_arc=-PI / 2).move_to(line.n2p(k / 4) + 0.35 * UP), run_time=0.5)
        lab = M(R"\frac{3}{4}", size=64, color=C_Q).next_to(token, UP, buff=0.25)
        self.play(FadeIn(lab, shift=0.2 * DOWN))
        self.hold(0.5)

        self.mark("De fracción a decimal")
        self.clear_scene()
        rows = VGroup(
            M(R"\frac{1}{2} = 0.5", size=64),
            M(R"\frac{3}{4} = 0.75", size=64),
            M(R"\frac{1}{3} = 0.3333\ldots", size=64),
        ).arrange(DOWN, buff=1.05, aligned_edge=LEFT).move_to(1.2 * UP)
        tags = VGroup(
            T("la división termina", size=28, color=C_Q),
            T("la división termina", size=28, color=C_Q),
            T("¡se repite para siempre!", size=28, color=ORANGE),
        )
        for tag, row in zip(tags, rows):
            tag.next_to(row, DOWN, buff=0.18, aligned_edge=LEFT)
        self.say("Si hacemos la división, cada fracción se vuelve un número decimal. "
                 "A veces la división termina: 1/2 = 0.5 y 3/4 = 0.75.")
        self.play(Write(rows[0]), FadeIn(tags[0]))
        self.play(Write(rows[1]), FadeIn(tags[1]))
        self.hold()
        self.say("Otras veces no termina, pero se repite: 1 entre 3 da 0.3333…, con el 3 repitiéndose para siempre.")
        self.play(Write(rows[2]), FadeIn(tags[2]))
        self.hold()

        self.mark("La rayita de los decimales periódicos")
        self.play(FadeOut(VGroup(rows[:2], tags[:2])),
                  VGroup(rows[2], tags[2]).animate.move_to(4.2 * UP))
        bar = M(R"0.3333\ldots = 0.\overline{3}", size=70).move_to(2.6 * UP)
        card = get_notation(R"0.\overline{3}", "La rayita encima significa: esta cifra se repite para siempre.")
        card.move_to(0.4 * DOWN)
        self.say("Para no escribir tantos tres, ponemos una rayita encima de lo que se repite.")
        self.play(Write(bar), FadeIn(card, shift=0.3 * UP))
        self.hold()
        group = M(R"0.181818\ldots = 0.\overline{18}", size=70).move_to(3.4 * DOWN)
        self.say("Si se repite un grupo de cifras, la rayita cubre todo el grupo: 0.181818… se escribe con raya sobre el 18.")
        self.play(Write(group))
        self.hold()
        self.say("Así reconoces a un racional: su decimal termina, o se repite con un patrón.", fox=True, wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 5. Números irracionales
# ---------------------------------------------------------------------------
class S05_Irracionales(MBScene):
    def construct(self):
        self.mark("Cruzar una baldosa")
        self.set_header(R"\mathbb{I}", "Números irracionales", C_I, P_I)
        tile = Square(3.3).set_fill(P_R, 1).set_stroke(C_R, 4).move_to(2.9 * UP)
        tile_in = Square(3.3).set_fill(P_R, 0.6).set_stroke(width=0).move_to(tile)
        sides = VGroup(
            T("1 metro", size=26, color=MUTED).next_to(tile, DOWN, buff=0.2),
            T("1 metro", size=26, color=MUTED).rotate(PI / 2).next_to(tile, LEFT, buff=0.2),
        )
        self.say("Imagina una baldosa cuadrada de 1 metro por lado. Si la cruzas en diagonal, "
                 "de esquina a esquina, ¿cuánto caminaste?", fox=True)
        self.play(FadeIn(tile_in), ShowCreation(tile), FadeIn(sides))
        diag = Line(tile.get_corner(DL), tile.get_corner(UR)).set_stroke(C_I, 7)
        token = get_token(ORANGE).move_to(tile.get_corner(DL))
        self.play(FadeIn(token, scale=2))
        self.play(ShowCreation(diag), token.animate.move_to(tile.get_corner(UR)), run_time=2.5)
        self.hold()

        values = ["1.4", "1.41", "1.414", "1.4142", "1.41421", "1.4142135\\ldots"]
        reading = M(values[0], size=88, color=C_I).move_to(3.5 * LEFT + 1.1 * DOWN, LEFT)
        self.say("Mide un poco más de 1.4. Si medimos con más cuidado: 1.41, luego 1.414, luego 1.4142… "
                 "¡Las cifras nunca se acaban!")
        self.play(FadeIn(reading, shift=0.2 * UP))
        for value in values[1:]:
            new = M(value, size=88, color=C_I).move_to(reading, LEFT)
            self.play(TransformMatchingStrings(reading, new), run_time=0.8)
            reading = new
            self.wait(0.3)
        self.hold()
        sqrt2 = M(R"\sqrt{2}", size=130, color=C_I).move_to(3.4 * DOWN)
        self.say("Y no forman ningún patrón que se repita. A este número lo llamamos raíz de dos.")
        self.play(Write(sqrt2))
        self.hold(0.5)

        self.mark("El símbolo √ y el símbolo ≈")
        self.clear_scene(keep=[sqrt2])
        self.play(sqrt2.animate.move_to(4.3 * UP))
        card = get_notation(R"\sqrt{\ \ }", "Se lee «raíz cuadrada»: el número que, multiplicado por sí mismo, da el de adentro.",
                            color=C_I)
        card.move_to(1.4 * UP)
        self.say("El símbolo √ se lee «raíz cuadrada». Raíz de 2 es el número que, multiplicado "
                 "por sí mismo, da 2.")
        self.play(FadeIn(card, shift=0.3 * UP))
        self.hold()
        check = M(R"1.4142 \times 1.4142 \approx 2", size=64).move_to(2.0 * DOWN)
        approx = T("≈  significa\n«aproximadamente igual»", size=30, color=ORANGE, alignment="CENTER")
        approx.next_to(check, DOWN, buff=0.5)
        self.say("Compruébalo: 1.4142 por 1.4142 da casi 2. El símbolo ≈ significa «aproximadamente»: "
                 "como las cifras no terminan, solo podemos acercarnos.")
        self.play(Write(check))
        self.play(FadeIn(approx, shift=0.2 * UP))
        self.hold(0.5)

        self.mark("¿Qué es un número irracional?")
        self.clear_scene()
        top = VGroup(
            TB("Racional", size=36, color=C_Q),
            M(R"0.333333\ldots", size=64, color=INK),
            T("se repite un patrón", size=28, color=C_Q),
        ).arrange(DOWN, buff=0.3)
        bottom = VGroup(
            TB("Irracional", size=36, color=C_I),
            M(R"1.41421356\ldots", size=64, color=INK),
            T("nunca forma un patrón", size=28, color=C_I),
        ).arrange(DOWN, buff=0.3)
        top_box = get_card(top, color=C_Q, fill=P_Q, buff=0.45, stroke_width=2.5)
        bottom_box = get_card(bottom, color=C_I, fill=P_I, buff=0.45, stroke_width=2.5)
        rows = Group(Group(top_box, top), Group(bottom_box, bottom)).arrange(DOWN, buff=0.9).move_to(1.7 * UP)
        self.say("Un número irracional es uno que NO se puede escribir como fracción. "
                 "Su decimal sigue para siempre, sin repetir ningún patrón.")
        self.play(FadeIn(rows[0], shift=0.2 * UP))
        self.play(FadeIn(rows[1], shift=0.2 * UP))
        self.hold()
        name = M(R"\mathbb{I} \;:\; \text{irracionales}", size=70).move_to(3.5 * DOWN)
        self.say("A esta familia la llamamos con la letra 𝕀, de irracionales.")
        self.play(Write(name))
        self.hold(0.5)

        self.mark("π, el irracional más famoso")
        self.clear_scene()
        line = get_number_line((0, 4, 1), unit_size=1.7, font_size=32).move_to(1.4 * DOWN + 0.2 * RIGHT)
        radius = 0.85
        t_tracker = ValueTracker(0)
        get_t = t_tracker.get_value
        wheel = Circle(radius=radius).set_fill(P_R, 1).set_stroke(C_R, 4)
        wheel.move_to(line.n2p(0), DOWN)
        spoke = Line(wheel.get_center(), wheel.get_bottom()).set_stroke(C_I, 4)
        wheel_group = VGroup(wheel, spoke)

        # La rueda que rueda: idea tomada de 3b1b/videos (_2022/visual_proofs/lies.py)
        def update_group(group):
            group[0].move_to(line.n2p(get_t() * PI), DOWN)
            start = group[0].get_center()
            group[1].put_start_and_end_on(start, start + radius * rotate_vector(DOWN, -get_t() * TAU))
            return group

        wheel_group.add_updater(update_group)
        unrolled = always_redraw(lambda: Line(line.n2p(0), line.n2p(get_t() * PI)).set_stroke(C_I, 8))
        height = Brace(Line(wheel.get_bottom(), wheel.get_top()), LEFT, buff=0.15).set_color(MUTED)
        height_lab = T("1 metro\nde alto", size=26, color=MUTED, alignment="CENTER").next_to(height, LEFT, buff=0.1)
        self.say("Si una rueda de 1 metro de alto da una vuelta completa, ¿cuánto avanza?", fox=True)
        self.play(ShowCreation(line), FadeIn(wheel_group))
        self.add(unrolled)
        self.play(GrowFromCenter(height), FadeIn(height_lab))
        self.hold()
        self.play(FadeOut(height), FadeOut(height_lab))
        self.play(t_tracker.animate.set_value(1), run_time=4, rate_func=linear)
        wheel_group.clear_updaters()
        unrolled.clear_updaters()
        pi_dot = Dot(line.n2p(PI), radius=0.12).set_color(C_I)
        pi_lab = M(R"\pi = 3.14159265\ldots", size=66, color=C_I).move_to(3.4 * UP)
        self.say("Avanza un poco más de 3 metros: exactamente π, que se lee «pi». "
                 "Sus cifras tampoco se repiten nunca.")
        self.play(GrowFromCenter(pi_dot), Write(pi_lab))
        self.hold()
        self.say("Pi aparece en todo lo que es redondo: ruedas, relojes, platos y planetas.", wait=True)
        self.end_section()


# ---------------------------------------------------------------------------
# 6. Números reales
# ---------------------------------------------------------------------------
class S06_Reales(MBScene):
    def construct(self):
        self.mark("Todos juntos: los reales")
        self.set_header(R"\mathbb{R}", "Números reales", C_R, P_R)
        formula = M(R"\mathbb{R} = \mathbb{Q} \cup \mathbb{I}", size=110).move_to(3.6 * UP)
        self.say("Si juntamos a los racionales y a los irracionales en un solo grupo, obtenemos los números reales.")
        self.play(Write(formula))
        self.hold()
        card = get_notation(R"\cup", "Se lee «unión»: juntar dos grupos en uno solo.", color=C_R)
        card.move_to(0.2 * DOWN)
        self.say("El símbolo ∪ se lee «unión». Es como vaciar dos bolsas en una sola bolsa grande.", fox=True)
        self.play(FadeIn(card, shift=0.3 * UP))
        self.hold(0.5)

        self.mark("Cajas dentro de cajas")
        self.clear_scene()
        R_box = RoundedRectangle(7.4, 8.4, corner_radius=0.35).set_fill(P_R, 1).set_stroke(C_R, 3)
        R_box.move_to(0.4 * DOWN)
        Q_box = RoundedRectangle(6.9, 5.0, corner_radius=0.3).set_fill(P_Q, 1).set_stroke(C_Q, 3)
        Q_box.move_to(R_box.get_top() + 0.3 * DOWN, UP)
        Z_box = RoundedRectangle(6.3, 3.3, corner_radius=0.3).set_fill(P_Z, 1).set_stroke(C_Z, 3)
        Z_box.move_to(Q_box.get_top() + 0.3 * DOWN, UP)
        N_box = RoundedRectangle(4.8, 1.7, corner_radius=0.3).set_fill(P_N, 1).set_stroke(C_N, 3)
        N_box.move_to(Z_box.get_top() + 0.3 * DOWN, UP)
        I_box = RoundedRectangle(6.9, 2.5, corner_radius=0.3).set_fill(P_I, 1).set_stroke(C_I, 3)
        I_box.move_to(R_box.get_bottom() + 0.3 * UP, DOWN)
        boxes = [N_box, Z_box, Q_box, I_box, R_box]
        letters = VGroup(*(
            Tex(tex, font_size=46).set_color(color).next_to(box.get_corner(UR), DL, buff=0.14)
            for tex, color, box in zip([R"\mathbb{N}", R"\mathbb{Z}", R"\mathbb{Q}", R"\mathbb{I}", R"\mathbb{R}"],
                                       [C_N, C_Z, C_Q, C_I, C_R], boxes)
        ))
        self.say("Las familias son como cajas dentro de cajas, o como muñecas rusas: "
                 "cada una guarda a la anterior.", fox=True)
        for i in [4, 2, 1, 0, 3]:
            self.play(GrowFromCenter(boxes[i]), FadeIn(letters[i]), run_time=0.7)
        self.hold()
        chain = M(R"\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}", size=58)
        chain.move_to(5.1 * UP)
        self.say("Los naturales están dentro de los enteros; los enteros, dentro de los racionales; "
                 "y todos, dentro de los reales.")
        self.play(Write(chain))
        self.hold()
        self.say("Eso se escribe con el símbolo ⊂, que significa «está dentro de». "
                 "ℕ ⊂ ℤ se lee: los naturales están dentro de los enteros.", wait=True)

        self.mark("¿Dónde vive cada número?")
        spots = {
            "N": [(-1.3, N_box.get_center()[1]), (0.5, N_box.get_center()[1])],
            "Z": [(-1.6, (Z_box.get_bottom()[1] + N_box.get_bottom()[1]) / 2)],
            "Q": [(-1.6, (Q_box.get_bottom()[1] + Z_box.get_bottom()[1]) / 2),
                  (0.6, (Q_box.get_bottom()[1] + Z_box.get_bottom()[1]) / 2)],
            "I": [(0.0, I_box.get_center()[1])],
        }
        used = {k: 0 for k in spots}
        items = [
            ("5", "N", C_N, "El 5 sirve para contar: vive en la caja de los naturales… y, por eso, "
                            "también dentro de todas las cajas que la rodean.", False),
            ("-7", "Z", C_Z, "El −7 está bajo cero: vive con los enteros, pero no con los naturales.", False),
            (R"\tfrac{3}{4}", "Q", C_Q, "3/4 es una fracción: es racional.", False),
            (R"\sqrt{2}", "I", C_I, "√2 no se puede escribir como fracción: va con los irracionales.", False),
            (R"\sqrt{9}", "N", C_N, "¡Cuidado con las trampas! √9 parece raro, pero 3 × 3 = 9: "
                                    "√9 es simplemente 3, un natural.", True),
            (R"0.\overline{6}", "Q", C_Q, "Y 0.666…, que se escribe con rayita sobre el 6, se repite con un patrón: "
                                          "es racional. De hecho, es 2/3.", False),
        ]
        for tex, zone, color, caption, fox in items:
            mob = M(tex, size=48).move_to(5.6 * UP + 2.6 * RIGHT)
            self.say(caption, fox=fox)
            self.play(FadeIn(mob, scale=1.4), run_time=0.4)
            x, y = spots[zone][used[zone]]
            used[zone] += 1
            self.play(mob.animate.move_to(np.array([x, y, 0])).set_color(color), run_time=1.0)
            self.hold(0.2)
        self.hold(0.3)

        self.mark("La recta real: sin huecos")
        self.clear_scene()
        line = get_number_line((-3, 4, 1), width=7.2, font_size=32).move_to(0.6 * UP)
        self.say("Todos los reales juntos llenan la recta por completo: cada punto tiene su número "
                 "y cada número tiene su punto.")
        self.play(ShowCreation(line))
        points = [(-2.5, "-2.5", C_Z), (0.75, R"\tfrac{3}{4}", C_Q), (np.sqrt(2), R"\sqrt{2}", C_I), (PI, R"\pi", C_I)]
        for i, (x, tex, color) in enumerate(points):
            dot = Dot(line.n2p(x), radius=0.12).set_color(color)
            lab = M(tex, size=48, color=color).next_to(dot, UP if i % 2 == 0 else DOWN, buff=0.35 if i % 2 == 0 else 0.8)
            self.play(GrowFromCenter(dot), FadeIn(lab, shift=0.2 * DOWN), run_time=0.6)
        self.hold()
        words = T("La recta real no tiene\nni un solo hueco.", size=34, color=INK, alignment="CENTER")
        words.move_to(3.4 * DOWN)
        self.say("Por eso decimos «la recta real»: no le queda ni un solo hueco.")
        self.play(FadeIn(words, shift=0.2 * UP))
        self.hold(0.4)
        self.end_section()


# ---------------------------------------------------------------------------
# Fin de la Parte 2
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# 7. Las reglas del juego (propiedades de campo)
# ---------------------------------------------------------------------------
class S07_ReglasDelJuego(MBScene):
    def construct(self):
        self.mark("Las reglas del juego")
        self.set_header(R"+\ \times", "Las reglas del juego", ORANGE, PEACH)
        board = self.get_board()
        board.set_width(6.8).move_to(2.4 * UP)
        self.say("Todo juego de mesa tiene reglas que los jugadores respetan. Los números reales también: "
                 "se llaman propiedades o axiomas de campo.", fox=True)
        self.play(FadeIn(board, scale=0.95))
        self.hold()
        self.say("Son las reglas que dicen cómo se portan la suma y la multiplicación. "
                 "Veámoslas una por una, con ejemplos.", wait=True)
        letters = VGroup(
            get_notation(R"a,\ b", "Son casillas vacías: puedes poner ahí el número que quieras."),
            get_notation(R"a \cdot b", "El punto entre dos números significa «por»: multiplicar."),
        ).arrange(DOWN, buff=0.8).move_to(0.4 * UP)
        self.play(FadeOut(board), FadeIn(letters[0], shift=0.2 * UP))
        self.say("En las reglas usamos letras como a y b. Son casillas vacías: puedes poner ahí el número que quieras.")
        self.hold()
        self.say("Y el punto entre dos números significa «por», es decir, multiplicar. 3 · 4 es lo mismo que 3 × 4.")
        self.play(FadeIn(letters[1], shift=0.2 * UP))
        self.hold(0.5)

        # Regla 1: conmutativa
        self.mark("Regla 1: el orden no importa")
        self.clear_scene()
        tag = self.get_rule_tag("1", "Propiedad conmutativa")
        coins_a = VGroup(*(self.get_coin(C_N) for _ in range(2))).arrange(RIGHT, buff=0.14)
        coins_b = VGroup(*(self.get_coin(C_Z) for _ in range(5))).arrange(RIGHT, buff=0.14)
        row = VGroup(coins_a, coins_b).arrange(RIGHT, buff=0.7).move_to(3.1 * UP)
        eq1 = M(R"2 + 5 = 5 + 2 = 7", size=76).next_to(row, DOWN, buff=1.5)
        rule = VGroup(
            M(R"a + b = b + a", size=58, color=ORANGE),
            M(R"a \cdot b = b \cdot a", size=58, color=ORANGE),
        ).arrange(DOWN, buff=0.55).next_to(eq1, DOWN, buff=1.5)
        self.play(FadeIn(tag))
        self.say("Si en tu bolsillo echas 2 monedas y luego 5, o primero 5 y luego 2, al final tienes 7 igual.")
        self.play(FadeIn(coins_a, shift=0.3 * DOWN))
        self.play(FadeIn(coins_b, shift=0.3 * DOWN))
        self.play(Swap(coins_a, coins_b), run_time=1.2)
        self.play(Write(eq1))
        self.hold()
        self.say("Eso dice la propiedad conmutativa: al sumar o al multiplicar, el orden no cambia el resultado.")
        self.play(Write(rule))
        self.hold(0.5)

        # Regla 2: asociativa
        self.mark("Regla 2: agrupar no importa")
        self.clear_scene()
        tag = self.get_rule_tag("2", "Propiedad asociativa")
        top = VGroup(M(R"(2 + 3) + 4", size=66), M(R"5 + 4 = 9", size=60, color=C_Q)).arrange(DOWN, buff=0.4)
        bottom = VGroup(M(R"2 + (3 + 4)", size=66), M(R"2 + 7 = 9", size=60, color=C_Q)).arrange(DOWN, buff=0.4)
        cols = VGroup(top, bottom).arrange(DOWN, buff=1.6).move_to(1.9 * UP)
        self.play(FadeIn(tag))
        self.say("Si sumas tres números, puedes juntar primero los dos que quieras. "
                 "Los paréntesis indican qué haces primero.")
        self.play(Write(top[0]))
        self.play(Write(bottom[0]))
        self.hold()
        self.say("(2 + 3) + 4 da 9, y 2 + (3 + 4) también da 9. Esa es la propiedad asociativa.")
        self.play(TransformFromCopy(top[0], top[1]), TransformFromCopy(bottom[0], bottom[1]))
        rule = M(R"(a + b) + c = a + (b + c)", size=58, color=ORANGE).move_to(3.4 * DOWN)
        self.play(Write(rule))
        self.hold(0.5)

        # Regla 3: neutros
        self.mark("Regla 3: los que no cambian nada")
        self.clear_scene()
        tag = self.get_rule_tag("3", "Elementos neutros")
        eqs = VGroup(M(R"7 + 0 = 7", size=88), M(R"7 \cdot 1 = 7", size=88)).arrange(DOWN, buff=1.3).move_to(2.3 * UP)
        rule = VGroup(
            M(R"a + 0 = a", size=58, color=ORANGE),
            M(R"a \cdot 1 = a", size=58, color=ORANGE),
        ).arrange(DOWN, buff=0.55).next_to(eqs, DOWN, buff=1.6)
        self.play(FadeIn(tag))
        self.say("Sumar cero es como no echar nada a tu bolsillo, y multiplicar por uno es tomar algo una sola vez: "
                 "todo queda igual.", fox=True)
        self.play(LaggedStartMap(Write, eqs, lag_ratio=0.5))
        self.play(Write(rule))
        self.hold(0.5)

        # Regla 4: inversos
        self.mark("Regla 4: todo tiene su «deshacer»")
        self.clear_scene()
        tag = self.get_rule_tag("4", "Inversos")
        e1 = M(R"5 + (-5) = 0", size=74).move_to(3.4 * UP)
        self.play(FadeIn(tag))
        self.say("Subir 5 pisos y bajar 5 te devuelve a la calle. Así, cada número tiene un «deshacer» "
                 "para la suma: 5 + (−5) = 0.")
        self.play(Write(e1))
        self.hold()
        e2 = M(R"4 \cdot \tfrac{1}{4} = 1", size=74).move_to(1.0 * UP)
        pieces = get_pizza(4, 4, radius=1.0).next_to(e2, DOWN, buff=0.5)
        self.say("Partir una pizza en 4 pedazos y juntar los 4 te devuelve la pizza entera: 4 · ¼ = 1. "
                 "Ese es el «deshacer» de la multiplicación.")
        self.play(Write(e2), FadeIn(pieces))
        self.hold()
        zero = M(R"\frac{1}{0}\ \ \text{no existe}", size=66, color=C_I).move_to(3.6 * DOWN)
        self.say("El cero es el único sin «deshacer» para la multiplicación. Por eso, nunca se divide entre cero.")
        self.play(Write(zero))
        self.hold(0.5)

        # Regla 5: distributiva
        self.mark("Regla 5: repartir la multiplicación")
        self.clear_scene()
        tag = self.get_rule_tag("5", "Propiedad distributiva")
        combos = VGroup(*(self.get_combo() for _ in range(3))).arrange(RIGHT, buff=0.25)
        combos.set_width(7.0).move_to(3.3 * UP)
        self.play(FadeIn(tag))
        self.say("Compras 3 combos. Cada combo trae una hamburguesa de 10 mil pesos y un jugo de 2 mil.")
        self.play(LaggedStartMap(FadeIn, combos, shift=0.3 * DOWN, lag_ratio=0.3))
        self.hold()
        eq = VGroup(
            M(R"3 \cdot (10 + 2)", size=62, t2c={"10": C_N}),
            M(R"= 3 \cdot 10 + 3 \cdot 2", size=62, t2c={"10": C_N}),
            M(R"= 30 + 6 = 36", size=62, t2c={"30": C_N}),
        ).arrange(DOWN, buff=0.5, aligned_edge=LEFT).move_to(0.2 * DOWN)
        self.say("Pagas lo mismo si cuentas 3 hamburguesas y luego 3 jugos: 30 mil más 6 mil, 36 mil. "
                 "Esa es la propiedad distributiva.")
        self.play(LaggedStartMap(Write, eq, lag_ratio=0.6), run_time=2.5)
        rule = M(R"a \cdot (b + c) = a \cdot b + a \cdot c", size=54, color=ORANGE).move_to(3.1 * DOWN)
        self.play(Write(rule))
        self.hold(0.5)
        self.end_section()

    def get_rule_tag(self, number, name):
        circle = Circle(radius=0.3).set_fill(ORANGE, 1).set_stroke(width=0)
        num = TB(number, size=30, color=WHITE).move_to(circle)
        text = TB(name, size=30, color=ORANGE)
        tag = VGroup(VGroup(circle, num), text).arrange(RIGHT, buff=0.25)
        tag.next_to(self.header, DOWN, buff=0.4)
        return tag

    def get_coin(self, color):
        coin = Circle(radius=0.3).set_fill(color, 1).set_stroke(WHITE, 3)
        inner = Circle(radius=0.2).set_stroke(WHITE, 2, opacity=0.7)
        return VGroup(coin, inner)

    def get_combo(self):
        burger = RoundedRectangle(1.3, 0.8, corner_radius=0.3).set_fill(P_N, 1).set_stroke(C_N, 3)
        b_lab = TB("10", size=30, color=C_N).move_to(burger)
        juice = RoundedRectangle(0.6, 1.0, corner_radius=0.12).set_fill(P_Z, 1).set_stroke(C_Z, 3)
        j_lab = TB("2", size=30, color=C_Z).move_to(juice)
        items = VGroup(VGroup(burger, b_lab), VGroup(juice, j_lab)).arrange(RIGHT, buff=0.2)
        tray = get_card(items, color=BORDER, buff=0.2, fill=CARD)
        return VGroup(tray, items)

    def get_board(self):
        cells = VGroup(*(
            Square(0.82).set_fill(color, 1).set_stroke(WHITE, 3)
            for color in [P_N, P_Z, P_Q, P_I, P_R, PEACH] * 4
        ))
        cells.arrange_in_grid(4, 6, buff=0)
        pieces = VGroup(
            Dot(radius=0.2).set_fill(ORANGE, 1).set_stroke(WHITE, 3).move_to(cells[7]),
            Dot(radius=0.2).set_fill(C_Z, 1).set_stroke(WHITE, 3).move_to(cells[16]),
        )
        die = RoundedRectangle(0.8, 0.8, corner_radius=0.15).set_fill(WHITE, 1).set_stroke(INK, 3)
        pips = VGroup(*(Dot(radius=0.07).set_fill(INK, 1) for _ in range(3)))
        for pip, shift in zip(pips, [UL, ORIGIN, DR]):
            pip.move_to(die.get_center() + 0.22 * shift)
        die_group = VGroup(die, pips).next_to(cells, DOWN, buff=0.45)
        return VGroup(cells, pieces, die_group)


# ---------------------------------------------------------------------------
# 8. Mayor, menor e intervalos
# ---------------------------------------------------------------------------
class S08_Orden(MBScene):
    def construct(self):
        self.mark("Mayor y menor")
        self.set_header(R"<\ >", "Mayor, menor e intervalos", C_Z, P_Z)
        ineq = M(R"3 < 7", size=160).move_to(3.9 * UP)
        ineq[1].set_color(ORANGE)
        self.say("Un truco: el signo «menor que» es como una boquita abierta que siempre quiere comerse "
                 "al número más grande.", fox=True)
        self.play(Write(ineq))
        self.play(ineq[1].animate.scale(1.35), rate_func=there_and_back, run_time=1.0)
        self.play(ineq[1].animate.scale(1.35), rate_func=there_and_back, run_time=1.0)
        self.hold()
        readings = VGroup(
            T("3 < 7   se lee\n«tres es menor que siete»", size=32, alignment="CENTER"),
            T("7 > 3   se lee\n«siete es mayor que tres»", size=32, alignment="CENTER"),
            T("≤   con rayita debajo:\n«menor o igual que»", size=32, color=ORANGE, alignment="CENTER"),
        ).arrange(DOWN, buff=0.85).next_to(ineq, DOWN, buff=1.2)
        self.say("3 < 7 se lee «tres es menor que siete». Y 7 > 3, «siete es mayor que tres»: "
                 "la misma idea, vista desde el otro lado.")
        self.play(FadeIn(readings[0]))
        self.play(FadeIn(readings[1]))
        self.hold()
        self.say("Si el signo lleva una rayita debajo, ≤, significa «menor o igual que».")
        self.play(FadeIn(readings[2]))
        self.hold(0.5)

        self.mark("En la recta: más a la derecha, más grande")
        self.clear_scene()
        line = get_number_line((-5, 5, 1), width=7.2, font_size=32).move_to(1.9 * UP)
        self.play(ShowCreation(line))
        arrow = Arrow(line.n2p(-4), line.n2p(4), thickness=4).set_color(ORANGE).shift(1.0 * UP)
        grows = T("los números crecen hacia la derecha", size=28, color=ORANGE).next_to(arrow, UP, buff=0.2)
        self.say("En la recta, el número que está más a la derecha siempre es el mayor.")
        self.play(GrowArrow(arrow), FadeIn(grows))
        self.hold()
        d1 = Dot(line.n2p(-3), radius=0.13).set_color(C_Z)
        d2 = Dot(line.n2p(-1), radius=0.13).set_color(C_Z)
        ex = M(R"-3 < -1", size=88).move_to(1.6 * DOWN)
        cold = T("−3 °C es más frío\nque −1 °C", size=34, color=C_Z, alignment="CENTER").next_to(ex, DOWN, buff=0.8)
        self.say("Con negativos, piensa en la temperatura: −3 grados es más frío que −1 grado. "
                 "Por eso −3 < −1.", fox=True)
        self.play(GrowFromCenter(d1), GrowFromCenter(d2))
        self.play(Write(ex), FadeIn(cold))
        self.hold(0.5)

        self.mark("Intervalos: un tramo de la recta")
        self.clear_scene()
        sign = T("Para subir a la atracción\ndebes medir entre 1.20 m y 1.90 m", size=32, color=INK,
                 alignment="CENTER").move_to(4.6 * UP)
        line = get_number_line((1.0, 2.2, 0.1), width=7.0, numbers=False).move_to(2.2 * UP)
        nums = VGroup(*(
            T(f"{x:.2f}".replace(".00", ""), size=26, color=MUTED).next_to(line.n2p(x), DOWN, buff=0.2)
            for x in [1.0, 1.2, 1.4, 1.6, 1.8, 2.0]
        ))
        self.say("Un intervalo es un tramo de la recta, como el tramo de una carretera entre dos pueblos.", fox=True)
        self.play(ShowCreation(line), FadeIn(nums))
        self.hold()
        self.say("Por ejemplo: para subir a una atracción del parque debes medir entre 1.20 m y 1.90 m.")
        self.play(FadeIn(sign, shift=0.2 * DOWN))
        seg = self.get_interval(line, 1.2, 1.9, True, True)
        self.play(ShowCreation(seg[0]), FadeIn(seg[1:]))
        self.hold()
        notation = M(R"[\,1.20,\ 1.90\,]", size=90).move_to(0.1 * DOWN)
        card = get_notation(R"[\ \ ]", "Corchete: el extremo SÍ está incluido. Se dibuja con un punto relleno.",
                            color=C_Z)
        card.move_to(3.0 * DOWN)
        self.say("Se escribe con corchetes. El corchete significa que el extremo SÍ está incluido: "
                 "si mides exactamente 1.20, puedes subir.")
        self.play(Write(notation), FadeIn(card, shift=0.3 * UP))
        self.hold(0.5)

        self.mark("Paréntesis e infinito")
        self.clear_scene()
        sign = T("Solo para mayores de 18 años", size=34, color=INK).move_to(4.6 * UP)
        line = get_number_line((10, 30, 2), width=7.0, font_size=26).move_to(2.2 * UP)
        self.play(FadeIn(sign), ShowCreation(line))
        seg = self.get_interval(line, 18, 30, False, True)
        tip = Arrow(line.n2p(29), line.n2p(30) + 0.5 * RIGHT, buff=0, thickness=6).set_color(C_Z)
        self.say("Si dice «mayores de 18 años», el 18 no cuenta: el tramo empieza justo después. "
                 "Usamos paréntesis y un punto vacío.")
        self.play(ShowCreation(seg[0]), FadeIn(seg[1]), GrowArrow(tip))
        notation = M(R"(\,18,\ \infty\,)", size=90).move_to(0.1 * DOWN)
        self.play(Write(notation))
        self.hold()
        card = get_notation(R"\infty", "Se lee «infinito»: el tramo no tiene final. Con infinito siempre va paréntesis.",
                            color=C_Z)
        card.move_to(3.0 * DOWN)
        self.say("El símbolo ∞ se lee «infinito»: el tramo sigue sin final. Con infinito siempre va paréntesis, "
                 "porque nunca llegamos a él.")
        self.play(FadeIn(card, shift=0.3 * UP))
        self.hold(0.5)
        self.end_section()

    def get_interval(self, line, a, b, closed_left=True, closed_right=True):
        seg = Line(line.n2p(a), line.n2p(b)).set_stroke(C_Z, 10)
        dots = VGroup()
        for x, closed in [(a, closed_left), (b, closed_right)]:
            dot = Dot(line.n2p(x), radius=0.14).set_stroke(C_Z, 4)
            dot.set_fill(C_Z if closed else BG_COLOR, 1)
            dots.add(dot)
        if not closed_right and b == line.x_max:
            dots.remove(dots[1])
        return VGroup(seg, *dots)


# ---------------------------------------------------------------------------
# 9. Valor absoluto
# ---------------------------------------------------------------------------
class S09_ValorAbsoluto(MBScene):
    def construct(self):
        self.mark("¿A cuántos pasos de casa?")
        self.set_header(R"|a|", "Valor absoluto", TEAL, "#0F2F2C")
        line = get_number_line((-6, 6, 1), width=7.4, font_size=28).move_to(2.6 * UP)
        house = get_house(0.7).next_to(line.n2p(0), UP, buff=0.3)
        self.say("Imagina que el cero es tu casa. El valor absoluto te dice a cuántos pasos estás de casa, "
                 "sin importar hacia qué lado caminaste.", fox=True)
        self.play(ShowCreation(line), FadeIn(house, shift=0.2 * DOWN))
        self.hold()
        token = get_token(C_Z).move_to(line.n2p(0) + 0.35 * DOWN)
        self.play(FadeIn(token, scale=2))
        for n in range(-1, -4, -1):
            self.play(token.animate(path_arc=-PI / 2).move_to(line.n2p(n) + 0.35 * DOWN), run_time=0.5)
        brace = Brace(Line(line.n2p(-3), line.n2p(0)), DOWN, buff=0.7).set_color(C_Z)
        lab = M(R"|-3| = 3", size=62, color=C_Z).next_to(brace, DOWN, buff=0.2)
        self.say("Si caminas 3 pasos hacia la izquierda, estás en el −3… pero estás a 3 pasos de casa. "
                 "Por eso |−3| = 3.")
        self.play(GrowFromCenter(brace), Write(lab))
        self.hold()
        token2 = get_token(C_N).move_to(line.n2p(0) + 0.35 * DOWN)
        self.say("Y si caminas 3 pasos hacia la derecha, también estás a 3 pasos: |3| = 3.")
        self.play(FadeIn(token2, scale=2))
        for n in range(1, 4):
            self.play(token2.animate(path_arc=PI / 2).move_to(line.n2p(n) + 0.35 * DOWN), run_time=0.5)
        brace2 = Brace(Line(line.n2p(0), line.n2p(3)), UP, buff=0.75).set_color(C_N)
        lab2 = M(R"|3| = 3", size=62, color=C_N).next_to(brace2, UP, buff=0.2)
        self.play(GrowFromCenter(brace2), Write(lab2))
        self.hold()
        card = get_notation(R"|\ \ |", "Las dos barritas se leen «valor absoluto de». Como es una distancia, nunca es negativo.",
                            color=TEAL)
        card.move_to(3.4 * DOWN)
        self.say("Las dos barritas verticales se leen «valor absoluto de». Como es una distancia, "
                 "el resultado nunca es negativo.")
        self.play(FadeIn(card, shift=0.3 * UP))
        self.hold(0.5)

        self.mark("La distancia entre dos números")
        self.clear_scene()
        line = get_number_line((0, 10, 1), width=7.2, font_size=28).move_to(2.2 * UP)
        a = get_token(C_N).move_to(line.n2p(3) + 0.35 * UP)
        b = get_token(C_Z).move_to(line.n2p(8) + 0.35 * UP)
        names = VGroup(
            T("Ana", size=28, color=C_N).next_to(a, UP, buff=0.2),
            T("Luis", size=28, color=C_Z).next_to(b, UP, buff=0.2),
        )
        self.say("Ana está en el 3 y Luis en el 8. ¿Qué tan lejos están? Restamos y tomamos el valor absoluto.")
        self.play(ShowCreation(line), FadeIn(a, scale=2), FadeIn(b, scale=2), FadeIn(names))
        brace = Brace(Line(line.n2p(3), line.n2p(8)), DOWN, buff=0.6).set_color(TEAL)
        dist = M(R"|8 - 3| = |3 - 8| = 5", size=66, color=TEAL).next_to(brace, DOWN, buff=0.3)
        self.play(GrowFromCenter(brace), Write(dist))
        self.hold()
        words = T("Da igual quién reste a quién:\nentre ellos hay 5 pasos.", size=34, color=INK, alignment="CENTER")
        words.move_to(3.4 * DOWN)
        self.say("Da igual quién reste a quién: entre ellos hay 5 pasos.")
        self.play(FadeIn(words, shift=0.2 * UP))
        self.hold(0.4)
        self.end_section()


# ---------------------------------------------------------------------------
# 10. Repaso, práctica y cierre
# ---------------------------------------------------------------------------
class S10_Cierre(MBScene):
    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", ORANGE, PEACH)
        badges = VGroup(
            get_set_badge(R"\mathbb{N}", "contar", C_N, P_N),
            get_set_badge(R"\mathbb{Z}", "bajo cero", C_Z, P_Z),
            get_set_badge(R"\mathbb{Q}", "repartir", C_Q, P_Q),
            get_set_badge(R"\mathbb{I}", "no es fracción", C_I, P_I),
            get_set_badge(R"\mathbb{R}", "todos juntos", C_R, P_R),
        )
        badges.arrange_in_grid(2, 3, h_buff=0.3, v_buff=0.5)
        badges.set_width(7.3).move_to(2.3 * UP)
        self.say("Repasemos: ℕ para contar, ℤ para ir bajo cero, ℚ para repartir, 𝕀 para lo que no es fracción, "
                 "y ℝ, todos juntos.")
        self.play(LaggedStartMap(FadeIn, badges, shift=0.3 * UP, lag_ratio=0.3), run_time=2.5)
        self.hold(0.5)

        self.mark("Ponte a prueba")
        self.clear_scene()
        self.set_header(R"?", "Ponte a prueba", ORANGE, PEACH)
        questions = [
            ("¿A qué familias\npertenece el −4?",
             R"\mathbb{Z},\ \mathbb{Q}\ \text{y}\ \mathbb{R}",
             "−4 está bajo cero: es entero, también racional y real. Pero no sirve para contar."),
            ("¿El número 0.25 es\nracional o irracional?",
             R"\text{Racional: } 0.25 = \tfrac{1}{4}",
             "Es racional: su decimal termina, y además es un cuarto."),
            ("¿Cuánto vale |−7|?",
             R"|-7| = 7",
             "Vale 7: el −7 está a 7 pasos del cero."),
        ]
        self.say("Tres preguntas cortas. Pausa el video si necesitas más tiempo, y responde con calma.", wait=True)
        for k, (q_text, a_tex, explanation) in enumerate(questions, start=1):
            self.mark(f"Pregunta {k}")
            num = get_pill(f"Pregunta {k}", ORANGE, PEACH, size=28).move_to(4.1 * UP)
            question = T(q_text, size=46, alignment="CENTER").move_to(2.4 * UP)
            timer = Integer(5, font_size=88).set_color(ORANGE).move_to(0.1 * DOWN)
            ring = Circle(radius=0.75).set_stroke(ORANGE, 6).move_to(timer)
            self.play(FadeIn(num), Write(question))
            self.play(FadeIn(timer), ShowCreation(ring))
            self.play(ChangeDecimalToValue(timer, 0), Uncreate(ring), run_time=5, rate_func=linear)
            answer = M(a_tex, size=62, color=C_Q)
            answer.set_max_width(6.4)
            answer_box = get_card(answer, color=C_Q, fill=P_Q, buff=0.35, stroke_width=2.5)
            answer_group = VGroup(answer_box, answer).move_to(1.6 * DOWN)
            self.play(FadeOut(timer), FadeIn(answer_group, scale=0.9))
            self.say(explanation, wait=True)
            self._begin_clearing()
            self.play(FadeOut(VGroup(num, question, answer_group)))
            self._clearing = False

        self.mark("Cierre")
        self.unsay()
        self.clear_scene()
        self.play(FadeOut(self.header))
        self.remove(self.watermark)
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡Lo hiciste muy bien!", size=48, color=INK)
        nxt = T("Próxima clase:\nrazones y proporciones", size=32, color=ORANGE, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
