"""
Clase T12 · Simplificar y demostrar (Trigonometría, 9:16, fondo azul).

Sin voz ni subtítulos ni preguntas al espectador. Identidad contra ecuación con gráficas que coinciden o
se cruzan; demostración de (1 + tan²x) cos²x = 1 y de sec x − cos x = sen x tan x paso a paso (zoom a
cada paso clave); y un contraejemplo que derrumba cos 2x = 2 cos x. Manual de la UdeA §13.7.

    manimgl demostrar.py S02_Demostrar -w
"""
from trig_scenes import *

SEN = R"\operatorname{sen}"


def make_axes(center, height=3.0, y=(-2.5, 2.5, 1)):
    ax = Axes(x_range=(-PI, PI, PI / 2), y_range=y, width=7.0, height=height,
              axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
    return ax.move_to(center)


def proof(lines, size=46, buff=0.42):
    return VGroup(*(M(s, size=size) for s in lines)).arrange(DOWN, buff=buff, aligned_edge=LEFT)


class S00_Portada(TrigPortada):
    part_tag = "Trigonometría · Clase T12"
    title = "Simplificar\ny demostrar"
    subtitle = "Detectives de igualdades"


class S01_IdentidadEcuacion(MBScene):
    def construct(self):
        self.mark("¿Siempre o a veces?")
        self.set_header(R"\equiv", "Identidad o ecuación", C_ANG, P_ANG)
        ax1 = make_axes(3.0 * UP)
        f1 = ax1.get_graph(lambda x: np.sin(x) ** 2 + np.cos(x) ** 2).set_stroke(C_SEN, 8)
        g1 = DashedVMobject(ax1.get_graph(lambda x: 1), num_dashes=40).set_stroke(C_COS, 4)
        lab1 = M(SEN + R"^2x + \cos^2x \;\overset{?}{=}\; 1", size=36).next_to(ax1, UP, buff=0.15)
        self.say("Dibujemos los dos lados de una igualdad. Arriba, seno al cuadrado más coseno al cuadrado contra uno.", fox=True)
        self.play(ShowCreation(ax1), FadeIn(lab1))
        self.play(ShowCreation(f1), ShowCreation(g1), run_time=2)
        tag1 = get_pill("coinciden en todo x: IDENTIDAD", C_Q, PEACH, size=24).next_to(ax1, DOWN, buff=0.2)
        self.say("Las dos curvas quedan una encima de la otra en todo el dibujo. Eso es una identidad: cierta para cualquier x.")
        self.play(FadeIn(tag1, shift=0.2 * UP))
        self.hold()
        ax2 = make_axes(2.4 * DOWN)
        f2 = ax2.get_graph(np.sin).set_stroke(C_SEN, 6)
        g2 = ax2.get_graph(lambda x: 0.5).set_stroke(C_COS, 4)
        lab2 = M(SEN + R" x \;\overset{?}{=}\; \tfrac12", size=36).next_to(ax2, UP, buff=0.15)
        self.say("Abajo, seno de x contra un medio. Aquí las curvas solo se cruzan en algunos puntos.")
        self.play(ShowCreation(ax2), FadeIn(lab2))
        self.play(ShowCreation(f2), ShowCreation(g2), run_time=2)
        dots = VGroup(*(Dot(ax2.c2p(x, 0.5), radius=0.09).set_color(C_ANG) for x in (PI / 6, 5 * PI / 6)))
        self.play(LaggedStartMap(GrowFromCenter, dots, lag_ratio=0.4))
        tag2 = get_pill("solo en algunos x: ECUACIÓN", C_ANG, PEACH, size=24).next_to(ax2, DOWN, buff=0.2)
        self.say("Eso es una ecuación: verdadera solo para ciertos valores, que hay que encontrar.")
        self.play(FadeIn(tag2, shift=0.2 * UP))
        self.hold(0.5)
        self.end_section()


class S02_Demostrar(MBScene):
    def construct(self):
        self.mark("Las reglas del juego")
        self.set_header(R"\Rightarrow", "Cómo se demuestra", C_COS, P_COS)
        rules = VGroup(
            T("1. Empieza por el lado más complicado", size=30),
            T("2. Escribe todo en senos y cosenos", size=30),
            T("3. Usa las identidades que ya conoces", size=30),
            T("4. Llega exactamente al otro lado", size=30),
        ).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to(3.4 * UP)
        self.say("Demostrar una identidad es como resolver un laberinto: sales de un lado y llegas al otro con pasos que ya sabes "
                 "que son ciertos. Cuatro reglas ayudan.", fox=True)
        self.play(LaggedStartMap(FadeIn, rules, shift=0.2 * RIGHT, lag_ratio=0.4), run_time=2.5)
        self.hold()
        self.mark("Primera demostración")
        self.play(FadeOut(rules, shift=0.3 * UP))
        goal = M(R"(1 + \tan^2 x)\cos^2 x = 1", size=50, color=C_ANG).move_to(4.2 * UP)
        self.say("Demostremos que uno más tangente al cuadrado, por coseno al cuadrado, es uno.")
        self.play(Write(goal))
        steps = proof([
            R"(1 + \tan^2 x)\cos^2 x",
            R"= \sec^2 x \cdot \cos^2 x",
            R"= \frac{1}{\cos^2 x}\cdot \cos^2 x",
            R"= 1",
        ]).next_to(goal, DOWN, buff=0.6)
        notes = [None, "1 + tan² = sec²", "sec = 1 / cos", "se cancela"]
        self.play(FadeIn(steps[0]))
        for i in range(1, 4):
            note = T(notes[i], size=24, color=C_COS).next_to(steps[i], RIGHT, buff=0.35)
            if i == 1:
                self.say("El paréntesis es una pitagórica disfrazada: uno más tangente al cuadrado es secante al cuadrado.")
            elif i == 2:
                self.say("La secante es uno entre coseno.")
            else:
                self.say("Y lo de arriba se cancela con lo de abajo. Llegamos a uno.")
            self.play(Write(steps[i]), FadeIn(note))
            if i == 2:
                self.zoom_to(VGroup(steps[2], note), scale=0.45)
                self.hold()
                self.zoom_reset()
            self.hold()
        box = SurroundingRectangle(steps[3], buff=0.15).set_stroke(C_Q, 3)
        self.play(ShowCreation(box))
        self.hold(0.5)
        self.end_section()


class S03_Otra(MBScene):
    def construct(self):
        self.mark("Segunda demostración")
        self.set_header(R"\sec x - \cos x", "Otra más", C_SEN, P_SEN)
        goal = M(R"\sec x - \cos x = " + SEN + R" x \tan x", size=50, color=C_ANG).move_to(4.2 * UP)
        self.say("Ahora una con resta: secante menos coseno es igual a seno por tangente. Empezamos por la izquierda.", fox=True)
        self.play(Write(goal))
        steps = proof([
            R"\sec x - \cos x",
            R"= \frac{1}{\cos x} - \frac{\cos^2 x}{\cos x}",
            R"= \frac{1 - \cos^2 x}{\cos x}",
            R"= \frac{" + SEN + R"^2 x}{\cos x}",
            R"= " + SEN + R" x \cdot \frac{" + SEN + R" x}{\cos x} = " + SEN + R" x \tan x",
        ], size=42, buff=0.4).next_to(goal, DOWN, buff=0.6)
        says = [
            None,
            "Escribimos todo con coseno y le damos a los dos términos el mismo denominador.",
            "Se restan las fracciones.",
            "Arriba aparece la pitagórica: uno menos coseno al cuadrado es seno al cuadrado.",
            "Separamos un seno, y seno entre coseno es la tangente. ¡Llegamos!",
        ]
        self.play(FadeIn(steps[0]))
        for i in range(1, 5):
            self.say(says[i])
            self.play(Write(steps[i]), run_time=1.4)
            if i == 3:
                self.zoom_to(steps[3], scale=0.4)
                ring = SurroundingRectangle(steps[3][1:], buff=0.08).set_stroke(C_SEN, 3)
                self.play(ShowCreation(ring))
                self.hold()
                self.play(FadeOut(ring))
                self.zoom_reset()
            self.hold()
        box = SurroundingRectangle(steps[4], buff=0.12).set_stroke(C_Q, 3)
        self.play(ShowCreation(box))
        self.hold(0.5)
        self.end_section()


class S04_Contraejemplo(MBScene):
    def construct(self):
        self.mark("Un impostor")
        self.set_header(R"\ne", "Un solo contraejemplo", C_I, P_I)
        claim = M(R"\cos 2x \;\overset{?}{=}\; 2\cos x", size=54).move_to(4.0 * UP)
        self.say("Alguien asegura que coseno de dos x es dos coseno de x. Parece razonable: el dos sale para afuera. ¿O no?", fox=True)
        self.play(Write(claim))
        self.hold()
        test = VGroup(
            M(R"x = 0", size=46, color=C_ANG),
            M(R"\cos(2\cdot 0) = \cos 0 = 1", size=44, color=C_SEN),
            M(R"2\cos 0 = 2", size=44, color=C_COS),
            M(R"1 \ne 2", size=60, color=C_I),
        ).arrange(DOWN, buff=0.45).next_to(claim, DOWN, buff=0.8)
        self.say("Para tumbar una identidad basta un solo valor donde falle. Probemos con x igual a cero.")
        self.play(FadeIn(test[0]))
        self.play(Write(test[1]))
        self.play(Write(test[2]))
        self.say("A un lado da uno, al otro da dos. Con eso basta: no es una identidad.")
        self.play(Write(test[3]))
        stamp = TB("FALSA", size=80, color=C_I).rotate(12 * DEGREES).move_to(claim).shift(0.2 * DOWN)
        frame = SurroundingRectangle(stamp, buff=0.15).set_stroke(C_I, 6).rotate(0)
        self.play(FadeIn(VGroup(stamp, frame), scale=1.6), run_time=0.6)
        self.hold()
        self.mark("Ojo con el sentido contrario")
        warn = VGroup(
            T("Un ejemplo que funciona NO demuestra nada:", size=28, color=INK),
            M(SEN + R" 2x \overset{?}{=} 2\," + SEN + R" x:\;\; x = 0 \Rightarrow 0 = 0", size=36, color=MUTED),
            T("…en x = 0 sí coincide, y aun así no es identidad:", size=26, color=MUTED),
            T("hace falta una demostración para todo x.", size=28, color=C_ANG),
        ).arrange(DOWN, buff=0.3).move_to(3.6 * DOWN)
        self.say("Y al revés no funciona: que la igualdad se cumpla en algunos valores no la vuelve identidad. Para afirmar, demuestra; "
                 "para negar, basta un contraejemplo.")
        self.play(LaggedStartMap(FadeIn, warn, lag_ratio=0.35), run_time=2.5)
        self.hold(0.5)
        self.end_section()


class S05_Cierre(TrigCierre):
    recap = [
        ("Identidad", "cierta para todo x (las gráficas coinciden)", C_Q),
        ("Ecuación", "cierta solo para algunos x", C_ANG),
        ("Demostrar", "del lado difícil al fácil, en senos y cosenos", C_COS),
        ("Refutar", "basta un contraejemplo", C_I),
    ]
    recap_say = ("Repasemos: una identidad vale siempre y una ecuación solo a veces; para demostrar se pasa todo a senos y cosenos "
                 "y se usan identidades conocidas; para refutar basta un contraejemplo.")
    practice = "Ahora, el juego:\ndetective de identidades"
