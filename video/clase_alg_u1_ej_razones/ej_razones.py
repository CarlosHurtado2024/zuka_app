"""
Álgebra E3 · Ejemplos resueltos de razones, proporciones y regla de tres (complemento de A3, alg-12, 9:16).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). Harina para arepas (directa, con el valor
unitario como comprobación), velocidad y tiempo (inversa: la distancia se conserva), reparto de 600.000 según
las edades 4, 6 y 10, impresoras y minutos (compuesta) y una maqueta 1 : 50 en 3D donde las longitudes se
dividen entre 50 y el volumen entre 50³. Ninguno repite los ejemplos del video A3 ni los ejercicios.

    manimgl ej_razones.py S05_Escala3D -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Ejemplos resueltos"
    title = "Proporciones\npaso a paso"
    subtitle = "Primero se pregunta: ¿crece o decrece?"


class S01_Directa(ExScene):
    def construct(self):
        self.mark("Ejemplo 1: harina para arepas")
        self.set_header(R"\frac{a}{b} = \frac{c}{x}", "Directa", SKY, P_SKY)
        self.problem(1, "Con 3 tazas de harina salen 8 arepas. ¿Cuánta harina se necesita para 20 arepas?", SKY)
        self.say("Paso uno: identificar las dos magnitudes. Tazas de harina y número de arepas.", fox=True)
        self.step(R"\text{tazas} \quad \text{y} \quad \text{arepas}", "dos magnitudes", MUTED)
        self.say("Paso dos: decidir el tipo. Si quiero más arepas, necesito más harina. Crecen juntas: es directa.")
        self.step(R"\text{arepas} \uparrow \;\Rightarrow\; \text{harina} \uparrow", "crecen juntas: directa", SKY, why_color=SKY)
        self.say("Paso tres: la proporción, con cada magnitud en su lugar.")
        self.step(R"\frac{3}{x} = \frac{8}{20}", "tazas con tazas, arepas con arepas", PINK, why_color=PINK)
        self.step(R"8x = 3 \cdot 20 = 60 \;\Rightarrow\; x = 7.5", "producto cruzado", HONEY, why_color=HONEY)
        self.zoom_to(self.steps[-1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.say("Comprobación con el valor unitario: cada arepa usa tres octavos de taza. Veinte arepas usan veinte por tres octavos: siete y media.")
        self.step(R"\frac{3}{8} \text{ por arepa} \;\Rightarrow\; 20 \cdot \frac{3}{8} = 7.5", "valor unitario", MINT, why_color=MINT)
        self.answer(R"7.5 \text{ tazas}")
        self.hold(0.5)
        self.end_section()


class S02_Inversa(ExScene):
    def construct(self):
        self.mark("Ejemplo 2: velocidad y tiempo")
        self.set_header(R"v \cdot t = d", "Inversa", HONEY, P_HONEY)
        self.problem(2, "A 60 km/h un viaje dura 5 horas. ¿Cuánto dura a 75 km/h?", HONEY)
        self.say("Si voy más rápido, llego antes. Una magnitud sube y la otra baja: es inversa.", fox=True)
        self.step(R"\text{velocidad} \uparrow \;\Rightarrow\; \text{tiempo} \downarrow", "una sube, otra baja: inversa", HONEY, why_color=HONEY)
        self.say("En la inversa se conserva el producto. Aquí tiene sentido: velocidad por tiempo es la distancia, y el camino es el mismo.")
        self.step(R"60 \cdot 5 = 300 \text{ km}", "lo que se conserva: la distancia", SKY, why_color=SKY)
        self.step(R"75 \cdot x = 300", "el mismo producto", PINK, why_color=PINK)
        self.step(R"x = \frac{300}{75} = 4", "despejar", MINT, why_color=MINT)
        self.answer(R"4 \text{ horas}", color=HONEY)
        self.say("Un error común es armar la proporción directa: daría seis horas y un cuarto, ¡más tiempo yendo más rápido! Siempre conviene preguntarse si el resultado tiene sentido.")
        wrong = VGroup(M(R"\frac{60}{75} = \frac{5}{x} \Rightarrow x = 6.25", size=34, color=CORAL), ex_mark(CORAL, 40)).arrange(RIGHT, buff=0.2)
        wrong.next_to(self.steps[-1], DOWN, buff=0.35)
        self.play(FadeIn(wrong, shift=0.2 * UP))
        self.zoom_to(wrong, scale=0.4)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S03_Reparto(ExScene):
    def construct(self):
        self.mark("Ejemplo 3: reparto por edades")
        self.set_header(R"4 : 6 : 10", "Reparto", MINT, P_MINT)
        self.problem(3, "Una abuela reparte 600.000 entre sus nietos de 4, 6 y 10 años, en proporción a sus edades", MINT)
        self.say("Las edades dicen cuántas partes iguales recibe cada uno. Primero contamos todas las partes.", fox=True)
        self.step(R"4 + 6 + 10 = 20 \text{ partes}", "sumar las partes", MINT, why_color=MINT)
        self.step(R"600\,000 \div 20 = 30\,000 \text{ por parte}", "valor de una parte", SKY, why_color=SKY)
        self.say("Cada nieto recibe sus partes: cuatro por treinta mil, seis por treinta mil y diez por treinta mil.")
        cols = [HONEY, PINK, SKY]
        bars = VGroup()
        for n, col in zip([4, 6, 10], cols):
            row = VGroup(*[Square(0.3).set_fill(col, 0.9).set_stroke(BG_COLOR, 1) for _ in range(n)]).arrange(RIGHT, buff=0.03)
            lab = TB(f"{n} años: {n * 30}.000", size=24, color=col)
            bars.add(VGroup(lab, row).arrange(RIGHT, buff=0.3))
        bars.arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        bars.set_max_width(7.0)
        bars.next_to(self.steps[-1], DOWN, buff=0.45)
        for b in bars:
            self.play(FadeIn(b[0]), LaggedStartMap(GrowFromCenter, b[1], lag_ratio=0.08), run_time=1.0)
        self.steps.append(bars)
        self.cursor = bars.get_bottom()[1] - 0.32
        self.say("Comprobación: ciento veinte mil más ciento ochenta mil más trescientos mil son seiscientos mil.")
        self.answer(R"120\,000 + 180\,000 + 300\,000 = 600\,000", color=MINT, size=36)
        self.hold(0.5)
        self.end_section()


class S04_Compuesta(ExScene):
    def construct(self):
        self.mark("Ejemplo 4: regla de tres compuesta")
        self.set_header(R"\times \tfrac{a}{b} \times \tfrac{c}{d}", "Compuesta", PINK, P_PINK)
        self.problem(4, "6 impresoras imprimen 900 hojas en 5 minutos. ¿Cuántas hojas imprimen 4 impresoras en 8 minutos?", PINK)
        self.say("Cambian dos cosas. Se analiza cada una por separado, como si la otra se quedara quieta.", fox=True)
        self.step(R"900", "lo que ya sabemos", MUTED)
        self.say("Impresoras: de seis a cuatro. Menos impresoras, menos hojas: el factor debe ser menor que uno, cuatro sextos.")
        self.step(R"\times \frac{4}{6}", "menos impresoras ⇒ menos hojas (directa)", SKY, why_color=SKY)
        self.say("Minutos: de cinco a ocho. Más tiempo, más hojas: el factor debe ser mayor que uno, ocho quintos.")
        self.step(R"\times \frac{8}{5}", "más minutos ⇒ más hojas (directa)", HONEY, why_color=HONEY)
        self.step(R"900 \cdot \frac{4}{6} \cdot \frac{8}{5} = 600 \cdot \frac{8}{5} = 960", "multiplicar en cadena", PINK, why_color=PINK)
        self.zoom_to(self.steps[-1], scale=0.5)
        self.hold()
        self.zoom_reset()
        self.answer(R"960 \text{ hojas}", color=PINK)
        self.say("Tiene sentido: hay menos impresoras, pero trabajan bastante más tiempo.")
        self.hold(0.5)
        self.end_section()


class S05_Escala3D(MBScene):
    def construct(self):
        self.mark("Ejemplo 5: una maqueta a escala")
        self.set_header(R"1 : 50", "Escala en 3D", LAV, P_LAV)
        self.say("Un arquitecto hace la maqueta de una piscina de veinticinco por diez por dos metros, a escala uno a cincuenta.", fox=True)
        real = block(25 * 0.22, 10 * 0.22, 2 * 0.22, color=SKY, opacity=0.85).move_to(1.2 * UP + 0.4 * LEFT)
        self.play(self.frame.animate.reorient(-30, 62), run_time=1.2)
        self.play(FadeIn(real, shift=0.4 * OUT))
        lab = flat(M(R"25 \times 10 \times 2 \text{ m}", size=40, color=SKY).move_to(3.6 * UP))
        self.play(FadeIn(lab))
        self.hold()
        self.say("Escala uno a cincuenta significa que cada longitud de la maqueta es la quincuagésima parte de la real. Esa razón sí es directa.")
        mini = block(25 * 0.22 / 3, 10 * 0.22 / 3, 2 * 0.22 / 3, color=PINK).move_to(2.2 * DOWN + 1.6 * RIGHT)
        self.play(TransformFromCopy(real, mini), run_time=1.8)
        lab2 = flat(M(R"50 \times 20 \times 4 \text{ cm}", size=40, color=PINK).move_to(3.0 * DOWN))
        self.play(FadeIn(lab2))
        self.hold()
        self.say("Pero el volumen no se divide entre cincuenta. Se divide entre cincuenta por cincuenta por cincuenta, porque hay tres longitudes.")
        f = flat(VGroup(
            M(R"\text{real: } 25 \cdot 10 \cdot 2 = 500 \text{ m}^3", size=34, color=SKY),
            M(R"\text{maqueta: } 0.5 \cdot 0.2 \cdot 0.04 = 0.004 \text{ m}^3", size=34, color=PINK),
            M(R"\frac{500}{0.004} = 125\,000 = 50^3", size=40, color=HONEY),
        ).arrange(DOWN, buff=0.25).move_to(4.4 * DOWN))
        for m in f:
            m.fix_in_frame()
        self.play(FadeOut(lab2), LaggedStartMap(FadeIn, f, lag_ratio=0.4), run_time=1.6)
        self.frame.add_updater(lambda fr, dt: fr.increment_theta(0.22 * dt))
        self.say("La maqueta cabe en cuatro litros de agua; la piscina real necesita quinientos mil litros.")
        self.hold(0.8)
        self.frame.clear_updaters()
        self.play(FadeOut(Group(real, mini)), run_time=0.8)
        self.frame.reorient(0, 0)
        self.end_section()


class S06_Cierre(AlgCierre):
    recap = [
        ("1. ¿Crece o decrece?", "decide si es directa o inversa", SKY),
        ("Directa", "proporción: 3/x = 8/20", SKY),
        ("Inversa", "se conserva el producto: 60 · 5 = 75 · x", HONEY),
        ("Reparto", "total ÷ partes, y cada uno sus partes", MINT),
        ("Compuesta", "un factor por magnitud, a favor o en contra", PINK),
        ("Escala", "longitud ÷ 50, volumen ÷ 50³", LAV),
    ]
    recap_say = "Antes de hacer cuentas, decide cómo se relacionan las magnitudes, y al final pregunta si el resultado tiene sentido."
    practice = "Ahora te toca a ti con los juegos"
