"""Portada y cierre compartidos por las clases de trigonometría (se copian a cada carpeta como
trig_scenes.py). Cada clase define TOPIC_TITLE, el pie de la portada y lo que se practica."""
from mb_common import *


class TrigPortada(MBScene):
    part_tag = "Trigonometría"
    title = ""
    subtitle = ""

    def construct(self):
        self.remove(self.watermark)
        self.mark("Portada")
        blob = Circle(radius=2.75).set_fill(PEACH, 1).set_stroke(width=0).move_to(3.1 * UP)
        halo = Circle(radius=2.25).set_fill(PEACH_DEEP, 1).set_stroke(width=0).move_to(blob)
        fox = ImageMobject("zuka_mascota.png", height=3.6).move_to(blob)
        self.play(GrowFromCenter(blob), GrowFromCenter(halo), run_time=1.0)
        self.play(FadeIn(fox, scale=0.85), run_time=1.0)
        tag = get_pill(self.part_tag, C_COS, PEACH, size=28)
        title = TB(self.title, size=54, color=INK, alignment="CENTER")
        title.set_max_width(LINE_WIDTH)
        rule = Line(LEFT, RIGHT).set_width(1.8).set_stroke(C_COS, 5)
        sub = T(self.subtitle, size=30, color=MUTED)
        sub.set_max_width(LINE_WIDTH)
        block = VGroup(tag, title, rule, sub).arrange(DOWN, buff=0.42).move_to(1.6 * DOWN)
        self.play(FadeIn(tag, shift=0.2 * UP), Write(title, run_time=1.6))
        self.play(ShowCreation(rule), FadeIn(sub, shift=0.2 * UP))
        self.wait(2.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, halo, fox, block)), run_time=0.8)


class TrigCierre(MBScene):
    """Repaso en tarjetas (título, detalle, color) y despedida con lo que se practica."""
    recap = []          # [(título, detalle, color)]
    recap_say = ""
    practice = ""

    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", C_COS, P_COS)
        rows = VGroup()
        for t, d, col in self.recap:
            content = VGroup(TB(t, size=26, color=col), T(d, size=24, color=INK)).arrange(DOWN, buff=0.12)
            content.set_max_width(6.6)
            card = get_card(content, color=col, fill=PEACH, buff=0.26)
            card.stretch_to_fit_width(7.0)
            rows.add(VGroup(card, content.move_to(card)))
        rows.arrange(DOWN, buff=0.3).move_to(1.4 * UP)
        self.say(self.recap_say)
        self.play(LaggedStartMap(FadeIn, rows, shift=0.3 * UP, lag_ratio=0.3), run_time=2.2)
        self.hold(0.5)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.play(FadeOut(self.header))
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A practicar!", size=52, color=INK)
        nxt = T(self.practice, size=30, color=C_COS, alignment="CENTER")
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)
