"""
Álgebra E5 · Ejemplos resueltos de interés simple y compuesto (complemento de A5, alg-13b, 9:16).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). 800.000 al 18 % anual simple durante 10 meses
(la trampa de las unidades: 1.5 % mensual), 1.500.000 al 4 % trimestral compuesto durante un año (tabla y
fórmula, zoom), hallar la tasa de un préstamo (2.000.000 → 2.240.000 en 8 meses) y dos bancos en 3D: 2 %
mensual simple contra 1.8 % compuesto, que gana a 12 meses pero pierde a 24. Ninguno repite los ejemplos del
video A5 ni los ejercicios.

    manimgl ej_interes.py S04_Comparar -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Ejemplos resueltos"
    title = "Interés\npaso a paso"
    subtitle = "Tasa, tiempo y fórmula, sin trampas"


class S01_Simple(ExScene):
    def construct(self):
        self.mark("Ejemplo 1: la trampa de las unidades")
        self.set_header(R"I = C\,r\,t", "Simple", SKY, P_SKY)
        self.problem(1, "Se prestan 800.000 al 18 % anual de interés simple durante 10 meses. ¿Cuánto se devuelve?", SKY)
        self.say("Antes de usar la fórmula, revisa que la tasa y el tiempo hablen el mismo idioma. Aquí la tasa es anual y el tiempo está en meses.", fox=True)
        self.step(R"18\% \text{ anual} = \frac{18\%}{12} = 1.5\% \text{ mensual}", "tasa y tiempo en las mismas unidades", HONEY, why_color=HONEY)
        self.zoom_to(self.steps[-1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.say("La tasa se escribe en decimal: uno punto cinco por ciento es cero punto cero uno cinco.")
        self.step(R"r = 0.015 \qquad t = 10", "porcentaje ÷ 100", MUTED)
        self.step(R"I = 800\,000 \cdot 0.015 \cdot 10 = 120\,000", "interés simple", SKY, why_color=SKY)
        self.step(R"M = 800\,000 + 120\,000", "monto = capital + interés", MINT, why_color=MINT)
        self.answer(R"M = 920\,000", color=SKY)
        self.say("Cada mes se pagan doce mil de interés, siempre sobre los ochocientos mil iniciales.")
        self.hold(0.5)
        self.end_section()


class S02_Compuesto(ExScene):
    def construct(self):
        self.mark("Ejemplo 2: trimestre a trimestre")
        self.set_header(R"C\,(1 + r)^n", "Compuesto", LAV, P_LAV)
        self.problem(2, "Se invierten 1.500.000 al 4 % trimestral compuesto durante un año. ¿Cuánto se tiene al final?", LAV)
        self.say("Un año tiene cuatro trimestres: n es cuatro. Veamos trimestre a trimestre cómo el interés se suma al capital.", fox=True)
        self.step(R"n = 4 \text{ trimestres} \qquad 1 + r = 1.04", "contar periodos y armar el factor", MUTED)
        rows = VGroup()
        data = [("1", "1\\,500\\,000 \\cdot 1.04 = 1\\,560\\,000"), ("2", "1\\,560\\,000 \\cdot 1.04 = 1\\,622\\,400"),
                ("3", "1\\,622\\,400 \\cdot 1.04 = 1\\,687\\,296"), ("4", "1\\,687\\,296 \\cdot 1.04 \\approx 1\\,754\\,788")]
        for k, tex in data:
            rows.add(VGroup(T(f"trim. {k}", size=22, color=MUTED), M(tex, size=32, color=INK)).arrange(RIGHT, buff=0.3))
        rows.arrange(DOWN, buff=0.22, aligned_edge=LEFT)
        rows.set_max_width(7.2)
        rows.move_to(self.cursor * UP, aligned_edge=UP)
        for r in rows:
            self.play(FadeIn(r, shift=0.15 * LEFT), run_time=0.7)
        self.steps.append(rows)
        self.cursor = rows.get_bottom()[1] - 0.35
        self.say("Cada trimestre se multiplica por uno punto cero cuatro lo que había, incluido el interés anterior.")
        self.hold()
        self.say("La fórmula hace las cuatro multiplicaciones de una vez: uno punto cero cuatro a la cuarta.")
        self.step(R"M = 1\,500\,000 \cdot 1.04^4 = 1\,500\,000 \cdot 1.16986", "fórmula del compuesto", LAV, why_color=LAV)
        self.answer(R"M \approx 1\,754\,788", color=LAV)
        self.say("Con interés simple serían un millón setecientos cuarenta mil: el compuesto gana catorce mil setecientos ochenta y ocho más.")
        self.zoom_to(self.steps[-1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S03_Tasa(ExScene):
    def construct(self):
        self.mark("Ejemplo 3: encontrar la tasa")
        self.set_header(R"r = \frac{I}{C\,t}", "Hallar la tasa", HONEY, P_HONEY)
        self.problem(3, "Un préstamo de 2.000.000 se pagó con 2.240.000 a los 8 meses, con interés simple. ¿Qué tasa mensual se cobró?", HONEY)
        self.say("Lo que se pagó de más es el interés. Ese dato se despeja de la fórmula.", fox=True)
        self.step(R"I = 2\,240\,000 - 2\,000\,000 = 240\,000", "interés = monto − capital", MUTED)
        self.step(R"240\,000 = 2\,000\,000 \cdot r \cdot 8", "I = C r t", HONEY, why_color=HONEY)
        self.step(R"240\,000 = 16\,000\,000 \cdot r", "multiplicar lo conocido", SKY, why_color=SKY)
        self.step(R"r = \frac{240\,000}{16\,000\,000} = 0.015", "despejar r", MINT, why_color=MINT)
        self.zoom_to(self.steps[-1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.answer(R"r = 1.5\% \text{ mensual}", color=HONEY)
        self.say("Comprobación: el uno punto cinco por ciento de dos millones son treinta mil al mes; en ocho meses, doscientos cuarenta mil.")
        self.hold(0.5)
        self.end_section()


class S04_Comparar(MBScene):
    def construct(self):
        self.mark("Ejemplo 4: ¿qué banco conviene?")
        self.set_header(R"1 + rt \;\text{vs}\; (1 + r)^n", "Dos bancos en 3D", MINT, P_MINT)
        self.say("Con un millón: el banco A paga dos por ciento mensual simple; el B, uno punto ocho por ciento mensual compuesto. ¿Cuál conviene?", fox=True)
        a12, b12 = 1 + 0.02 * 12, 1.018 ** 12
        a24, b24 = 1 + 0.02 * 24, 1.018 ** 24
        u = 1.9
        cols = Group()
        specs = [(a12, SKY, -2.4), (b12, LAV, -1.5), (a24, SKY, 1.3), (b24, LAV, 2.2)]
        for v, col, x in specs:
            c = block(0.7, 0.7, v * u, color=col)
            c.move_to(np.array([x, 0, v * u / 2]))
            cols.add(c)
        cols.shift(0.4 * UP)
        self.play(self.frame.animate.reorient(-20, 68), run_time=1.2)
        self.play(LaggedStart(*[FadeIn(c, shift=0.5 * OUT) for c in cols[:2]], lag_ratio=0.4), run_time=1.6)
        t12 = flat(VGroup(
            T("12 meses", size=26, color=MUTED),
            M(R"A: 1 + 0.02 \cdot 12 = 1.24", size=32, color=SKY),
            M(R"B: 1.018^{12} \approx 1.2387", size=32, color=LAV),
        ).arrange(DOWN, buff=0.15).move_to(3.4 * DOWN))
        for m in t12:
            m.fix_in_frame()
        self.play(FadeIn(t12))
        self.say("A doce meses gana el simple, por muy poco: un millón doscientos cuarenta mil contra un millón doscientos treinta y ocho mil setecientos.")
        self.hold()
        self.say("Pero si el dinero se queda dos años, el compuesto despega: uno punto cuarenta y ocho contra uno punto cincuenta y tres.")
        self.play(LaggedStart(*[FadeIn(c, shift=0.5 * OUT) for c in cols[2:]], lag_ratio=0.4), run_time=1.6)
        t24 = flat(VGroup(
            T("24 meses", size=26, color=MUTED),
            M(R"A: 1 + 0.02 \cdot 24 = 1.48", size=32, color=SKY),
            M(R"B: 1.018^{24} \approx 1.5344", size=32, color=LAV),
        ).arrange(DOWN, buff=0.15).move_to(5.0 * DOWN))
        for m in t24:
            m.fix_in_frame()
        self.play(FadeIn(t24))
        self.frame.add_updater(lambda f, dt: f.increment_theta(0.2 * dt))
        self.hold()
        self.say("La respuesta depende del plazo: con poco tiempo puede ganar una tasa simple más alta; con mucho tiempo, el compuesto termina adelante.")
        self.hold(0.6)
        self.frame.clear_updaters()
        self.play(FadeOut(cols), run_time=0.8)
        self.frame.reorient(0, 0)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("Mismas unidades", "18 % anual = 1.5 % mensual", HONEY),
        ("Simple", "I = C r t:  800.000 · 0.015 · 10", SKY),
        ("Compuesto", "M = C (1 + r)ⁿ:  1.04⁴ ≈ 1.16986", LAV),
        ("Hallar r", "r = I / (C t)", HONEY),
        ("Comparar", "el plazo decide quién gana", MINT),
    ]
    recap_say = "Revisa unidades, escribe la tasa en decimal, elige la fórmula correcta y, al final, compara con sentido común."
    practice = "Ahora te toca a ti con los juegos"
