"""
Álgebra V3 · Operaciones entre conjuntos (lección alg-0c, 9:16, fondo morado vivo).

Desde lo más básico, sin números de conjuntos ni desigualdades, sin zoom ni 3D. Un salón de siete estudiantes
(Ana, Beto, Carla, Dani, Eva, Fabio, Gina): A juegan fútbol, B tocan un instrumento. Se ubican en el diagrama de
Venn empezando por lo común; luego unión («o»), intersección («y»), diferencia («pero no», y que el orden importa),
complemento («no»), diferencia simétrica («en uno solo»), cómo traducir frases a símbolos y cómo contar la unión
sin contar dos veces a nadie. Sombreado con Union / Intersection / Difference / Exclusion de manimgl.
Spec 2026-11-11-conjuntos-desde-cero.

    manimgl operaciones.py S02_Union -w -l
"""
from alg_fx import *

NAMES = ["Ana", "Beto", "Carla", "Dani", "Eva", "Fabio", "Gina"]


class Salon(MBScene):
    """Escena con el diagrama del salón ya dibujado (para las operaciones)."""

    def build_venn(self, animate=True):
        self.uni = RoundedRectangle(7.0, 4.2, corner_radius=0.25).set_stroke(MUTED, 2).set_fill(CARD, 0.55).move_to(1.4 * UP)
        self.a = Circle(radius=1.5).set_stroke(SKY, 4).move_to(self.uni.get_center() + 0.95 * LEFT)
        self.b = Circle(radius=1.5).set_stroke(CORAL, 4).move_to(self.uni.get_center() + 0.95 * RIGHT)
        self.la = VGroup(M("A", size=36, color=SKY), T("fútbol", size=22, color=SKY)).arrange(RIGHT, buff=0.12).move_to(self.a.get_center() + 1.0 * UL + 0.45 * UP)
        self.lb = VGroup(M("B", size=36, color=CORAL), T("instrumento", size=22, color=CORAL)).arrange(RIGHT, buff=0.12).move_to(self.b.get_center() + 1.0 * UR + 0.45 * UP)
        self.lu = M("U", size=34, color=MUTED).next_to(self.uni.get_corner(UL), DR, buff=0.12)
        ca, cb, mid = self.a.get_center(), self.b.get_center(), (self.a.get_center() + self.b.get_center()) / 2
        spots = {
            "Carla": mid + 0.35 * UP, "Dani": mid + 0.35 * DOWN,
            "Ana": ca + 0.85 * LEFT + 0.35 * UP, "Beto": ca + 0.85 * LEFT + 0.4 * DOWN,
            "Eva": cb + 0.85 * RIGHT,
            "Fabio": self.uni.get_corner(DL) + 0.75 * RIGHT + 0.35 * UP, "Gina": self.uni.get_corner(DR) + 0.7 * LEFT + 0.35 * UP,
        }
        self.people = {n: T(n, size=26, color=INK).move_to(spots[n]) for n in NAMES}
        if animate:
            self.play(FadeIn(self.uni), FadeIn(self.lu))
            self.play(ShowCreation(self.a), ShowCreation(self.b), FadeIn(self.la), FadeIn(self.lb))
        else:
            self.add(self.uni, self.lu, self.a, self.b, self.la, self.lb)

    def shade(self, mob, color):
        region = mob.set_fill(color, 0.45).set_stroke(width=0)
        self.add(region)
        self.bring_to_front(self.a, self.b, *self.people.values())
        return region

    def data(self):
        g = VGroup(
            M(R"A = \{\text{Ana},\ \text{Beto},\ \text{Carla},\ \text{Dani}\}", size=32, color=SKY),
            M(R"B = \{\text{Carla},\ \text{Dani},\ \text{Eva}\}", size=32, color=CORAL),
        ).arrange(DOWN, buff=0.12).move_to(4.45 * UP)
        g.set_max_width(7.2)
        return g

    def operation(self, mark, header, tex_header, color, says, region_fn, result_tex, words, highlight):
        self.mark(mark)
        self.set_header(tex_header, header, color, PEACH)
        self.add(self.data())
        self.build_venn(animate=False)
        self.add(*self.people.values())
        self.say(says[0], fox=True)
        q = note(words, color=color, size=26).move_to(1.6 * DOWN)
        self.play(FadeIn(q, shift=0.2 * UP))
        self.hold()
        if len(says) > 1:
            self.say(says[1])
        region = self.shade(region_fn(), color)
        self.play(FadeIn(region), *[Indicate(self.people[n], color=color) for n in highlight], run_time=1.2)
        res = M(result_tex, size=42, color=INK).move_to(3.3 * DOWN)
        res.set_max_width(7.2)
        self.play(Write(res))
        self.hold()
        return region, res


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Unidad 0 · Parte 3"
    title = "Operaciones\nentre conjuntos"
    subtitle = "Unión, intersección, diferencia y complemento"


class S01_Salon(Salon):
    def construct(self):
        self.mark("El salón de clase")
        self.set_header(R"U", "El diagrama de Venn", LAV, P_LAV)
        self.say("En un salón hay siete estudiantes: Ana, Beto, Carla, Dani, Eva, Fabio y Gina. Ese es nuestro universal: todo lo que vamos a estudiar.", fox=True)
        U = M(R"U = \{\text{Ana, Beto, Carla, Dani, Eva, Fabio, Gina}\}", size=30, color=MUTED).move_to(4.5 * UP)
        U.set_max_width(7.2)
        self.play(Write(U))
        self.hold()
        self.say("A son los que juegan fútbol: Ana, Beto, Carla y Dani. B son los que tocan un instrumento: Carla, Dani y Eva.")
        d = self.data().move_to(3.5 * UP)
        self.play(FadeIn(d, shift=0.2 * DOWN))
        self.hold()
        self.play(FadeOut(U), d.animate.move_to(4.45 * UP))
        self.build_venn()
        self.say("Para dibujarlos, los círculos se cruzan, porque algunos estudiantes están en los dos. Siempre se empieza por la parte del medio: ¿quiénes están en A y también en B? Carla y Dani.")
        self.play(FadeIn(self.people["Carla"], scale=1.3), FadeIn(self.people["Dani"], scale=1.3))
        self.hold()
        self.say("Después los que están solo en A: Ana y Beto. Luego los que están solo en B: Eva.")
        self.play(FadeIn(self.people["Ana"], shift=0.2 * RIGHT), FadeIn(self.people["Beto"], shift=0.2 * RIGHT))
        self.play(FadeIn(self.people["Eva"], shift=0.2 * LEFT))
        self.hold()
        self.say("Y los que no están en ninguno de los dos, Fabio y Gina, quedan afuera de los círculos, pero dentro del rectángulo del salón.")
        self.play(FadeIn(self.people["Fabio"]), FadeIn(self.people["Gina"]))
        zones = VGroup(
            T("centro: en los dos", size=24, color=INK), T("lunas: en uno solo", size=24, color=INK), T("afuera: en ninguno", size=24, color=INK),
        ).arrange(DOWN, buff=0.15, aligned_edge=LEFT)
        card = boxed(zones, color=LAV).move_to(2.6 * DOWN)
        self.play(FadeIn(card, shift=0.2 * UP))
        self.hold(0.6)
        self.end_section()


class S02_Union(Salon):
    def construct(self):
        self.operation(
            "Unión: «o»", "Unión", R"A \cup B", SKY,
            ["La unión responde a la pregunta: ¿quiénes juegan fútbol o tocan un instrumento? Basta con estar en uno de los dos, o en los dos.",
             "Se pintan los dos círculos completos. Carla y Dani se escriben una sola vez, aunque estén en los dos."],
            lambda: Union(self.a, self.b),
            R"A \cup B = \{\text{Ana, Beto, Carla, Dani, Eva}\}",
            "¿Quiénes juegan fútbol o tocan un instrumento?",
            ["Ana", "Beto", "Carla", "Dani", "Eva"],
        )
        self.say("El símbolo de la unión es como una u: A unión B.")
        self.hold(0.5)
        self.end_section()


class S03_Interseccion(Salon):
    def construct(self):
        self.operation(
            "Intersección: «y»", "Intersección", R"A \cap B", MINT,
            ["La intersección responde a: ¿quiénes juegan fútbol y además tocan un instrumento? Hay que estar en los dos a la vez.",
             "Es solo la parte donde los círculos se cruzan: Carla y Dani."],
            lambda: Intersection(self.a, self.b),
            R"A \cap B = \{\text{Carla, Dani}\}",
            "¿Quiénes juegan fútbol y tocan un instrumento?",
            ["Carla", "Dani"],
        )
        self.say("Su símbolo es una u al revés: A intersección B. Si la intersección es vacía, los conjuntos son disjuntos.")
        self.hold(0.5)
        self.end_section()


class S04_Diferencia(Salon):
    def construct(self):
        region, res = self.operation(
            "Diferencia: «pero no»", "Diferencia", R"A - B", HONEY,
            ["La diferencia A menos B responde a: ¿quiénes juegan fútbol pero no tocan un instrumento?",
             "De A se quitan los que también están en B. Quedan Ana y Beto."],
            lambda: Difference(self.a, self.b),
            R"A - B = \{\text{Ana, Beto}\}",
            "¿Quiénes juegan fútbol pero no tocan instrumento?",
            ["Ana", "Beto"],
        )
        self.say("Cuidado: el orden importa. B menos A son los que tocan un instrumento pero no juegan fútbol: solo Eva.")
        r2 = self.shade(Difference(self.b, self.a), CORAL)
        res2 = M(R"B - A = \{\text{Eva}\}", size=42, color=INK).move_to(4.3 * DOWN)
        self.play(FadeOut(region), FadeIn(r2), Write(res2), Indicate(self.people["Eva"], color=CORAL))
        self.hold(0.6)
        self.end_section()


class S05_Complemento(Salon):
    def construct(self):
        self.operation(
            "Complemento: «no»", "Complemento", R"A^c", PINK,
            ["El complemento de A responde a: ¿quiénes no juegan fútbol? Se mira todo el salón, el universal, y se quita A.",
             "Queda todo lo que está fuera del círculo A: Eva, Fabio y Gina."],
            lambda: Difference(self.uni, self.a),
            R"A^c = \{\text{Eva, Fabio, Gina}\}",
            "¿Quiénes no juegan fútbol?",
            ["Eva", "Fabio", "Gina"],
        )
        self.say("Se escribe con una ce pequeña arriba: A complemento. Siempre depende del universal: sin el salón, no sabríamos de quiénes hablar.")
        self.hold(0.5)
        self.end_section()


class S06_Simetrica(Salon):
    def construct(self):
        self.operation(
            "Diferencia simétrica: «en uno solo»", "Diferencia simétrica", R"A \,\triangle\, B", CORAL,
            ["La diferencia simétrica responde a: ¿quiénes hacen solo una de las dos actividades, no las dos?",
             "Son las dos lunas: Ana, Beto y Eva. Es la unión sin la intersección."],
            lambda: Exclusion(self.a, self.b),
            R"A \,\triangle\, B = \{\text{Ana, Beto, Eva}\}",
            "¿Quiénes hacen solo una de las dos cosas?",
            ["Ana", "Beto", "Eva"],
        )
        self.hold(0.5)
        self.end_section()


class S07_Traducir(MBScene):
    def construct(self):
        self.mark("Del español a los símbolos")
        self.set_header(R"\text{o, y, no}", "Traducir", LAV, P_LAV)
        self.say("Las operaciones son traducciones de palabras que usamos todos los días. Este es el diccionario.", fox=True)
        rows = [
            ("«o»", R"\cup", "unión", SKY),
            ("«y»", R"\cap", "intersección", MINT),
            ("«pero no»", R"-", "diferencia", HONEY),
            ("«no»", R"{}^c", "complemento", PINK),
            ("«solo uno de los dos»", R"\triangle", "diferencia simétrica", CORAL),
        ]
        table = VGroup()
        for w, sym, name, col in rows:
            r = VGroup(T(w, size=28, color=INK), M(sym, size=50, color=col), T(name, size=24, color=col))
            r[0].set_width(min(r[0].get_width(), 2.8))
            table.add(r)
        for k, r in enumerate(table):
            r[0].move_to(np.array([-2.2, 3.0 - k * 1.0, 0]))
            r[1].move_to(np.array([0.3, 3.0 - k * 1.0, 0]))
            r[2].move_to(np.array([2.3, 3.0 - k * 1.0, 0]))
        for r in table:
            self.play(FadeIn(r, shift=0.2 * RIGHT), run_time=0.7)
        self.hold()
        self.say("Por ejemplo: los que tocan un instrumento pero no juegan fútbol. «Pero no» es una diferencia: B menos A.")
        ex = VGroup(T("«tocan instrumento pero no juegan fútbol»", size=26, color=INK), M(R"B - A", size=56, color=HONEY)).arrange(DOWN, buff=0.3).move_to(2.9 * DOWN)
        ex[0].set_max_width(7.2)
        self.play(FadeIn(ex[0]))
        self.play(Write(ex[1]))
        self.hold(0.6)
        self.end_section()


class S08_Contar(Salon):
    def construct(self):
        self.mark("Contar sin repetir")
        self.set_header(R"n(A \cup B)", "Contar", MINT, P_MINT)
        self.add(self.data())
        self.build_venn(animate=False)
        self.add(*self.people.values())
        self.say("¿Cuántos estudiantes juegan fútbol o tocan un instrumento? Si sumamos los de A, cuatro, y los de B, tres, nos da siete. Pero eso está mal.", fox=True)
        wrong = VGroup(M(R"4 + 3 = 7", size=48, color=CORAL), ex_mark(CORAL, 44)).arrange(RIGHT, buff=0.3).move_to(1.4 * DOWN)
        self.play(FadeIn(wrong))
        self.hold()
        self.say("Carla y Dani se contaron dos veces: una en A y otra en B. Hay que restarlos una vez.")
        self.play(Indicate(self.people["Carla"], color=MINT), Indicate(self.people["Dani"], color=MINT))
        right = M(R"n(A \cup B) = 4 + 3 - 2 = 5", size=46, color=MINT).move_to(2.6 * DOWN)
        self.play(Write(right))
        rule = formula_card(R"n(A \cup B) = n(A) + n(B) - n(A \cap B)", color=MINT, size=38).move_to(4.1 * DOWN)
        self.play(FadeIn(rule, shift=0.2 * UP))
        self.say("Esa es la regla: se suman los dos conjuntos y se resta lo común, para no contar a nadie dos veces.")
        self.hold(0.6)
        self.end_section()


class S09_Cierre(AlgCierre):
    recap = [
        ("Venn", "primero lo común, luego cada luna, luego lo de afuera", LAV),
        ("Unión  ∪  «o»", "Ana, Beto, Carla, Dani, Eva", SKY),
        ("Intersección  ∩  «y»", "Carla, Dani", MINT),
        ("Diferencia  −  «pero no»", "A − B = {Ana, Beto};  B − A = {Eva}", HONEY),
        ("Complemento  ᶜ  «no»", "Aᶜ = {Eva, Fabio, Gina}", PINK),
        ("Simétrica  △", "en uno solo: Ana, Beto, Eva", CORAL),
        ("Contar", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", MINT),
    ]
    recap_say = "Cada operación traduce una palabra: o, y, pero no, no. Y en el diagrama de Venn se ve de un vistazo quién está en cada parte."
    practice = "Reparte en el Venn, pinta zonas y opera"
