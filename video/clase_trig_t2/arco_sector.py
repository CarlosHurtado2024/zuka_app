"""
Clase T2 · Arco, sector y movimiento circular (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. La longitud de arco como «cuántos radios caben»
(r = 5, θ = 2.4), el área del sector como tajada de pizza (r = 6, θ = π/3) y una noria de 10 m a
2 vueltas por minuto, con la cámara siguiendo una cabina. Manual de la UdeA §13.1 (teorema 13.1).

    manimgl arco_sector.py S03_Noria -w
"""
from trig_scenes import *


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T2"
    title = "Arco, sector\ny movimiento circular"
    subtitle = "La cuerda, la pizza y la noria"


class S01_Arco(MBScene):
    def construct(self):
        self.mark("Longitud de arco")
        self.set_header(R"s = r\theta", "Longitud de arco", C_COS, P_COS)
        R, c = 2.2, 1.6 * UP
        circle = Circle(radius=R).move_to(c).set_stroke(INK, 3, opacity=0.5)
        radius = Line(c, point_on(0, R, c)).set_stroke(C_COS, 6)
        r_lab = M("r = 5 \\text{ cm}", size=36, color=C_COS).next_to(radius, DOWN, buff=0.15)
        self.say("Ya sabemos que un radián es el ángulo cuyo arco mide un radio. Entonces, los radianes cuentan "
                 "cuántos radios caben en el arco.", fox=True)
        self.play(ShowCreation(circle), ShowCreation(radius), FadeIn(r_lab))
        self.hold()
        self.say("Tomemos un ángulo de 2.4 radianes en un círculo de radio 5 centímetros. En el arco caben "
                 "dos radios completos y cuatro décimas de otro.")
        pieces = VGroup(
            Arc(0, 1, radius=R, arc_center=c).set_stroke(C_COS, 9),
            Arc(1, 1, radius=R, arc_center=c).set_stroke(C_SEN, 9),
            Arc(2, 0.4, radius=R, arc_center=c).set_stroke(C_ANG, 9),
        )
        labels = VGroup(
            T("1 radio", size=24, color=C_COS).move_to(point_on(0.5, R + 0.45, c)),
            T("1 radio", size=24, color=C_SEN).move_to(point_on(1.5, R + 0.45, c)),
            T("0.4", size=24, color=C_ANG).move_to(point_on(2.2, R + 0.4, c)),
        )
        for p, l in zip(pieces, labels):
            self.play(ShowCreation(p), FadeIn(l), run_time=0.9)
        side = Line(c, point_on(2.4, R, c)).set_stroke(INK, 4)
        ang = get_angle_arc(2.4, 0.55, c)
        th = M(R"\theta = 2.4", size=34, color=C_ANG).move_to(c + 0.6 * UP + 0.7 * RIGHT)
        self.play(ShowCreation(side), ShowCreation(ang), FadeIn(th))
        self.hold()
        steps = VGroup(
            M(R"s = 2.4 \text{ radios} = 2.4 \cdot 5", size=46),
            M(R"s = 12 \text{ cm}", size=58, color=C_ANG),
            M(R"s = r\,\theta \quad (\theta \text{ en radianes})", size=44, color=C_COS),
        ).arrange(DOWN, buff=0.35).move_to(2.6 * DOWN)
        self.say("Por eso el arco es 2.4 veces 5: doce centímetros. En fórmula, s igual a r por theta, con el "
                 "ángulo en radianes; en grados no funciona, porque los grados no cuentan radios.")
        for s in steps:
            self.play(Write(s), run_time=1)
        self.hold(0.5)
        self.end_section()


class S02_Sector(MBScene):
    def construct(self):
        self.mark("La tajada de pizza")
        self.set_header(R"A = \tfrac12 r^2 \theta", "Área del sector", C_SEN, P_SEN)
        R, c = 2.3, 1.7 * UP
        crust = Circle(radius=R).move_to(c).set_fill("#F6B26B", 1).set_stroke("#C97B3C", 6)
        cheese = Circle(radius=R - 0.18).move_to(c).set_fill("#FCE3A4", 1).set_stroke(width=0)
        cuts = VGroup(*(Line(c, point_on(k * TAU / 6, R, c)).set_stroke("#C97B3C", 4) for k in range(6)))
        pepperoni = VGroup(*(
            Dot(point_on(a, rr, c), radius=0.16).set_fill("#D64545", 1)
            for a, rr in [(0.4, 1.3), (1.3, 1.6), (2.2, 1.0), (3.3, 1.5), (4.1, 0.9), (5.2, 1.4), (5.8, 1.8), (0.9, 0.6)]
        ))
        pizza = VGroup(crust, cheese, cuts, pepperoni)
        self.say("Un sector es una tajada de pizza. Si la pizza entera tiene área pi r cuadrado, una tajada es "
                 "solo una fracción de ella.", fox=True)
        self.play(FadeIn(pizza, scale=0.9))
        self.hold()
        whole = M(R"\text{pizza entera: } \pi r^2 \;\leftrightarrow\; 2\pi \text{ rad}", size=40).move_to(c + 3.2 * DOWN)
        self.say("La pizza entera corresponde a una vuelta, dos pi radianes. Una tajada de theta radianes es "
                 "theta sobre dos pi de la pizza.")
        self.play(Write(whole))
        slice_ = Polygon(np.array(c), *[point_on(a, R, c) for a in np.linspace(0, TAU / 6, 20)])
        slice_.set_fill("#F6B26B", 1).set_stroke(C_ANG, 4)
        self.play(slice_.animate.shift(0.5 * point_on(TAU / 12, 1, ORIGIN)), pizza.animate.set_opacity(0.45), run_time=1.2)
        self.hold()
        steps = VGroup(
            M(R"A = \frac{\theta}{2\pi} \cdot \pi r^2", size=48),
            M(R"A = \tfrac12\, r^2\, \theta", size=58, color=C_SEN),
        ).arrange(DOWN, buff=0.35).next_to(whole, DOWN, buff=0.4)
        self.play(Write(steps[0]))
        self.say("Se cancela el pi y queda una fórmula muy limpia: un medio de r cuadrado por theta.")
        self.play(TransformFromCopy(steps[0], steps[1]))
        self.hold()

        self.mark("Ejemplo: una sexta parte")
        self.play(FadeOut(VGroup(whole, steps)))
        ex = VGroup(
            M(R"r = 6 \text{ cm}, \quad \theta = \frac{\pi}{3}", size=44),
            M(R"A = \tfrac12 \cdot 36 \cdot \frac{\pi}{3} = 6\pi", size=48),
            M(R"6\pi \approx 18.85 \text{ cm}^2", size=52, color=C_ANG),
        ).arrange(DOWN, buff=0.35).move_to(2.7 * DOWN)
        self.say("Ejemplo: una pizza de radio 6 centímetros partida en 6 tajadas. Cada tajada mide pi tercios. "
                 "Su área es un medio por 36 por pi tercios: seis pi, casi 19 centímetros cuadrados.")
        for s in ex:
            self.play(Write(s), run_time=1)
        check = T("Comprueba: la pizza mide 36π y es 6 tajadas de 6π", size=26, color=MUTED).next_to(ex, DOWN, buff=0.35)
        self.play(FadeIn(check))
        self.hold(0.5)
        self.end_section()


class S03_Noria(MBScene):
    def construct(self):
        self.mark("La noria")
        self.set_header(R"v = r\omega", "Ruedas que giran", C_TAN, P_TAN)
        R, c = 2.4, 1.5 * UP
        turn = ValueTracker(0)

        def wheel():
            a = turn.get_value()
            rim = Circle(radius=R).move_to(c).set_stroke(INK, 4)
            spokes = VGroup(*(Line(c, point_on(a + k * TAU / 8, R, c)).set_stroke(MUTED, 2) for k in range(8)))
            cabins = VGroup(*(
                RoundedRectangle(0.42, 0.34, corner_radius=0.08).set_fill(C_COS if k else C_ANG, 1).set_stroke(width=0)
                .move_to(point_on(a + k * TAU / 8, R, c) + 0.2 * DOWN)
                for k in range(8)
            ))
            return VGroup(spokes, rim, cabins)

        stand = VGroup(Line(c, c + 3.2 * DOWN + 1.4 * LEFT), Line(c, c + 3.2 * DOWN + 1.4 * RIGHT)).set_stroke(MUTED, 5)
        w = always_redraw(wheel)
        self.say("Una noria de 10 metros de radio da 2 vueltas cada minuto. ¿Qué tan rápido viaja una cabina?", fox=True)
        self.add(stand, w)
        self.play(turn.animate.set_value(TAU / 2), run_time=3, rate_func=linear)
        omega = M(R"\omega = 2 \cdot 2\pi = 4\pi \;\tfrac{\text{rad}}{\text{min}}", size=44, color=C_ANG).move_to(2.6 * DOWN)
        self.say("Primero el giro: dos vueltas por minuto son cuatro pi radianes por minuto. A eso se le llama rapidez angular, omega.")
        self.play(Write(omega))
        self.hold()

        self.mark("Seguir a la cabina")
        self.say("Ahora sigamos a la cabina amarilla. En cada minuto recorre un arco de 4 pi radianes en una "
                 "rueda de radio 10.")
        cab = lambda: point_on(turn.get_value(), R, c) + 0.2 * DOWN
        self.zoom_to(cab(), scale=0.45, run_time=1.5)
        follow = lambda f: f.move_to(cab())
        self.frame.add_updater(follow)
        self.play(turn.animate.set_value(TAU / 2 + 2.5), run_time=5, rate_func=linear)
        self.frame.remove_updater(follow)
        self.zoom_reset(run_time=1.5)
        v = VGroup(
            M(R"v = r\,\omega = 10 \cdot 4\pi", size=46),
            M(R"v = 40\pi \approx 125.7 \;\tfrac{\text{m}}{\text{min}}", size=48, color=C_TAN),
        ).arrange(DOWN, buff=0.3).next_to(omega, DOWN, buff=0.4)
        self.say("Su rapidez lineal es el radio por la rapidez angular: 40 pi, unos 126 metros por minuto.")
        self.play(Write(v[0]))
        self.play(Write(v[1]))
        self.hold()

        self.mark("Más lejos, más rápido")
        self.clear_scene(keep=[stand, w])
        near = always_redraw(lambda: Dot(point_on(turn.get_value(), R * 0.4, c), radius=0.12).set_color(C_SEN))
        far = always_redraw(lambda: Dot(point_on(turn.get_value(), R, c), radius=0.12).set_color(C_ANG))
        self.add(near, far)
        self.say("Mira dos puntos del mismo rayo: los dos giran el mismo ángulo, pero el de afuera recorre más "
                 "camino. Por eso v es r por omega: a más radio, más velocidad.")
        self.play(turn.animate.set_value(turn.get_value() + TAU), run_time=6, rate_func=linear)
        note = T("mismo ω · el de afuera tiene más r, va más rápido", size=26, color=C_TAN).move_to(2.8 * DOWN)
        self.play(FadeIn(note))
        self.hold(0.5)
        w.clear_updaters(); near.clear_updaters(); far.clear_updaters()
        self.end_section()


class S04_Cierre(TrigCierre):
    recap = [
        ("Arco", "s = rθ, con θ en radianes (cuántos radios caben)", C_COS),
        ("Sector", "A = ½ r²θ: una tajada de la pizza", C_SEN),
        ("Movimiento circular", "ω = θ / t  ·  v = r ω", C_TAN),
    ]
    recap_say = ("Repasemos: el arco es el radio por el ángulo en radianes; el sector, un medio de r cuadrado por "
                 "theta; y en una rueda, la velocidad de un punto es el radio por la rapidez angular.")
    practice = "Ahora, el juego:\ncorta porciones de pizza\ncon el arco y el área justos"
