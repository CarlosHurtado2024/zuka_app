"""
Álgebra E4 · Ejemplos resueltos de porcentajes (complemento de A4, lección alg-13, 9:16).

Sin voz ni subtítulos ni preguntas al espectador (guion en dist/). El IVA del 19 % de ida (50.000 → 59.500) y
de vuelta (119.000 → 100.000, con el error de restar el 19 %), la variación porcentual de una camisa
(40.000 → 46.000) y de un pasaje (80.000 → 68.000), un 25 % y luego un 20 % de descuento (40 %, no 45 %) y el
porcentaje de un porcentaje con 100 cubitos en 3D (60 % de mujeres, 25 % de ellas con gafas: 15 %).
Ninguno repite los ejemplos del video A4 ni los ejercicios.

    manimgl ej_porcentajes.py S04_PorcentajeDePorcentaje -w -l
"""
from alg_fx import *


class S00_Portada(AlgPortada):
    part_tag = "Álgebra · Ejemplos resueltos"
    title = "Porcentajes\npaso a paso"
    subtitle = "Del factor a la respuesta"


class S01_IVA(ExScene):
    def construct(self):
        self.mark("Ejemplo 1: sumar el IVA")
        self.set_header(R"\times 1.19", "IVA", HONEY, P_HONEY)
        self.problem(1, "Un audífono vale 50.000 sin IVA. Con el IVA del 19 %, ¿cuánto se paga?", HONEY)
        self.say("Pagar con IVA es pagar el precio entero, el cien por ciento, más el diecinueve por ciento. En total, el ciento diecinueve por ciento.", fox=True)
        self.step(R"100\% + 19\% = 119\% = 1.19", "aumento ⇒ factor 1 + r/100", HONEY, why_color=HONEY)
        self.step(R"50\,000 \cdot 1.19 = 59\,500", "multiplicar por el factor", MINT, why_color=MINT)
        self.answer(R"59\,500", color=HONEY)
        self.hold()
        self.end_section()
        self.mark("Ejemplo 2: quitar el IVA")
        self.problem(2, "Una factura dice 119.000 con IVA incluido. ¿Cuánto era sin IVA?", HONEY)
        self.say("Error frecuente: restarle el diecinueve por ciento a ciento diecinueve mil. Pero ese diecinueve por ciento se calculó sobre el precio sin IVA, que es más pequeño.", fox=True)
        wrong = self.step(R"119\,000 \cdot 0.81 = 96\,390", "✗ el 19 % no es de 119.000", CORAL, why_color=CORAL)
        self.zoom_to(wrong, scale=0.45)
        self.hold()
        self.zoom_reset()
        self.say("Lo correcto: ciento diecinueve mil es el precio sin IVA multiplicado por uno punto diecinueve. Para deshacer una multiplicación, se divide.")
        self.step(R"x \cdot 1.19 = 119\,000", "plantear con el factor", SKY, why_color=SKY)
        self.step(R"x = \frac{119\,000}{1.19} = 100\,000", "dividir deshace multiplicar", MINT, why_color=MINT)
        self.answer(R"100\,000 \quad (100\,000 \cdot 1.19 = 119\,000\;\checkmark)", color=MINT, size=40)
        self.hold(0.5)
        self.end_section()


class S02_Variacion(ExScene):
    def construct(self):
        self.mark("Ejemplo 3: ¿qué porcentaje subió?")
        self.set_header(R"\frac{\text{cambio}}{\text{original}}", "Variación", SKY, P_SKY)
        self.problem(3, "Una camisa pasó de 40.000 a 46.000. ¿Qué porcentaje subió?", SKY)
        self.say("Primero cuánto cambió: seis mil. Luego qué parte es ese cambio del precio original, el de antes.", fox=True)
        self.step(R"46\,000 - 40\,000 = 6\,000", "el cambio", MUTED)
        self.step(R"\frac{6\,000}{40\,000} = 0.15 = 15\%", "cambio sobre el ORIGINAL", SKY, why_color=SKY)
        self.zoom_to(self.steps[-1], scale=0.45)
        self.hold()
        self.zoom_reset()
        self.say("Otra forma: el factor nuevo sobre viejo. Cuarenta y seis mil entre cuarenta mil da uno punto quince: subió el quince por ciento.")
        self.step(R"\frac{46\,000}{40\,000} = 1.15", "factor ⇒ +15 %", MINT, why_color=MINT)
        self.answer(R"\text{sube } 15\%", color=SKY)
        self.hold()
        self.end_section()
        self.mark("Ejemplo 4: ¿qué porcentaje bajó?")
        self.problem(4, "Un pasaje bajó de 80.000 a 68.000. ¿Qué porcentaje bajó?", SKY)
        self.say("Mismo método. El factor sesenta y ocho mil entre ochenta mil es cero punto ochenta y cinco: queda el ochenta y cinco por ciento.", fox=True)
        self.step(R"\frac{68\,000}{80\,000} = 0.85", "queda el 85 %", CORAL, why_color=CORAL)
        self.step(R"1 - 0.85 = 0.15", "lo que se quitó", MUTED)
        self.answer(R"\text{baja } 15\%", color=CORAL)
        self.say("Las dos cambiaron quince por ciento, pero en pesos no es lo mismo: seis mil y doce mil. El porcentaje depende del precio de partida.")
        self.hold(0.5)
        self.end_section()


class S03_Sucesivos(ExScene):
    def construct(self):
        self.mark("Ejemplo 5: dos descuentos seguidos")
        self.set_header(R"0.75 \cdot 0.8", "Encadenados", PINK, P_PINK)
        self.problem(5, "Una tienda rebaja 25 % y en caja descuenta otro 20 %. ¿Cuál es el descuento total?", PINK)
        self.say("Tentación: sumar, veinticinco más veinte, cuarenta y cinco. Pero el segundo descuento se aplica sobre el precio ya rebajado.", fox=True)
        self.step(R"25\% + 20\% = 45\% \;?", "✗ los descuentos no se suman", CORAL, why_color=CORAL)
        self.say("Con factores: quitar el veinticinco deja el setenta y cinco por ciento; quitar el veinte deja el ochenta por ciento de lo que quedaba.")
        self.step(R"\times 0.75 \quad \text{y luego} \quad \times 0.8", "cada descuento es un factor", SKY, why_color=SKY)
        self.step(R"0.75 \cdot 0.8 = 0.6", "los factores se multiplican", HONEY, why_color=HONEY)
        self.step(R"1 - 0.6 = 0.4", "lo que se descontó", MINT, why_color=MINT)
        self.answer(R"\text{descuento total: } 40\%", color=PINK)
        self.say("Con un precio de cien mil: primero setenta y cinco mil, luego sesenta mil. Se pagan sesenta mil: el cuarenta por ciento menos.")
        ex = M(R"100\,000 \to 75\,000 \to 60\,000", size=36, color=MUTED).next_to(self.steps[-1], DOWN, buff=0.35)
        self.play(FadeIn(ex, shift=0.2 * UP))
        self.zoom_to(ex, scale=0.4)
        self.hold()
        self.zoom_reset()
        self.end_section()


class S04_PorcentajeDePorcentaje(MBScene):
    def construct(self):
        self.mark("Ejemplo 6: porcentaje de un porcentaje")
        self.set_header(R"25\% \text{ de } 60\%", "En 3D", MINT, P_MINT)
        self.say("En un colegio, el sesenta por ciento de los estudiantes son mujeres, y el veinticinco por ciento de ellas usa gafas. ¿Qué porcentaje de todo el colegio son mujeres con gafas?", fox=True)
        s = 0.54
        grid = unit_cubes(10, 10, 1, size=s, color=P_LAV).move_to(0.8 * UP)
        self.play(self.frame.animate.reorient(0, 52), run_time=1.2)
        self.play(LaggedStart(*[FadeIn(c) for c in grid], lag_ratio=0.004), run_time=1.4)
        order = sorted(range(100), key=lambda k: (grid[k].get_center()[0], -grid[k].get_center()[1]))
        women = [grid[k] for k in order[:60]]
        self.play(LaggedStart(*[c.animate.set_color(PINK).shift(0.35 * OUT) for c in women], lag_ratio=0.01), run_time=1.8)
        l1 = flat(M(R"60\% \text{ mujeres} = 60 \text{ de } 100", size=40, color=PINK).move_to(3.6 * DOWN))
        self.play(FadeIn(l1))
        self.hold()
        self.say("Un cuarto de esas sesenta: quince. Suben un poco más.")
        glasses = women[:15]
        self.play(LaggedStart(*[c.animate.set_color(HONEY).shift(0.6 * OUT) for c in glasses], lag_ratio=0.05), run_time=1.6)
        l2 = flat(M(R"25\% \text{ de } 60 = 15", size=40, color=HONEY).move_to(4.4 * DOWN))
        self.play(FadeIn(l2))
        self.frame.add_updater(lambda f, dt: f.increment_theta(0.2 * dt))
        self.hold()
        self.say("En factores: cero punto veinticinco por cero punto seis, cero punto quince. El quince por ciento del colegio, sin importar cuántos estudiantes haya.")
        l3 = flat(M(R"0.25 \cdot 0.6 = 0.15 = 15\%", size=46, color=MINT).move_to(5.3 * DOWN))
        self.play(FadeIn(l3))
        self.hold(0.6)
        self.frame.clear_updaters()
        self.play(FadeOut(grid), run_time=0.8)
        self.frame.reorient(0, 0)
        self.end_section()


class S05_Cierre(AlgCierre):
    recap = [
        ("Sumar IVA", "× 1.19", HONEY),
        ("Quitar IVA", "÷ 1.19, nunca × 0.81", HONEY),
        ("Variación", "cambio ÷ original, o nuevo ÷ viejo", SKY),
        ("Encadenados", "0.75 · 0.8 = 0.6 ⇒ 40 % menos", PINK),
        ("% de un %", "se multiplican: 0.25 · 0.6 = 15 %", MINT),
    ]
    recap_say = "Con factores todo se vuelve multiplicar o dividir. Y el porcentaje siempre se calcula sobre la cantidad de partida."
    practice = "Ahora te toca a ti con los juegos"
