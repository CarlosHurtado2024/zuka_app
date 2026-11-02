"""
Utilidades para los videos verticales (9:16) de Zuka, con Manim Community
(https://github.com/ManimCommunity/manim).

Adaptado de mb_common.py (escrito para manimgl, https://github.com/3b1b/manim) a
Manim Community, con tres cambios pedidos para la app:
  * Fondo oscuro con el degradado del curso (el mismo de los clips de la app).
  * Subtítulos visibles en el video: cada self.say() muestra su frase abajo
    y además la guarda en un .srt.
  * Un solo video continuo, sin portada.

El lienzo mide 8 × 14.22 unidades (1080 × 1920 px). La app pone su encabezado
arriba (≈ 12 % del alto) y sus botones a la derecha, así que el contenido vive
entre CONTENT_BOTTOM y CONTENT_TOP y los subtítulos van debajo.
"""
from __future__ import annotations

import os
import textwrap

from manim import *

FONT = "Segoe UI"

# Paleta oscura, a juego con la app
INK = "#EEF0FF"          # texto principal
MUTED = "#9AA3C7"        # texto secundario
CARD = "#171C36"         # tarjetas
BRAND = "#8B7BFF"        # color del curso de Álgebra
GOLD = "#FFC531"

# Un color por familia de números: tono fuerte + relleno oscuro
C_N, P_N = "#FFC53D", "#3A2F12"   # naturales: miel
C_Z, P_Z = "#4FA8FF", "#11284A"   # enteros: cielo
C_Q, P_Q = "#34D399", "#0F3328"   # racionales: menta
C_I, P_I = "#FF6B7A", "#3D1520"   # irracionales: coral
C_R, P_R = "#B9A6FF", "#272052"   # reales: lavanda

SET_COLORS = {
    R"\mathbb{N}": C_N, R"\mathbb{Z}": C_Z, R"\mathbb{Q}": C_Q,
    R"\mathbb{I}": C_I, R"\mathbb{R}": C_R,
}

# Zonas del lienzo vertical (x de -4 a 4; y de -7.11 a 7.11)
HEADER_Y = 5.35
CONTENT_TOP = 4.55
CONTENT_BOTTOM = -3.9
LINE_WIDTH = 7.0
CAPTION_BOTTOM = -5.95   # borde inferior de los subtítulos
CAPTION_X = -0.25        # un poco a la izquierda: a la derecha están los botones del feed


def T(text: str, size: float = 30, color=INK, **kwargs) -> Text:
    return Text(text, font=FONT, font_size=size, color=color, **kwargs)


def TB(text: str, size: float = 30, color=INK, **kwargs) -> Text:
    return T(text, size=size, color=color, weight=BOLD, **kwargs)


def M(*tex: str, size: float = 48, color=INK, t2c: dict | None = None) -> MathTex:
    """Fórmula con los colores de las familias de números aplicados."""
    colors = dict(SET_COLORS)
    colors.update(t2c or {})
    joined = " ".join(tex)
    keys = [k for k in colors if k in joined]
    mob = MathTex(*tex, font_size=size, color=color, substrings_to_isolate=keys)
    for key in keys:
        mob.set_color_by_tex(key, colors[key])
    return mob


def reading_time(text: str) -> float:
    """Tiempo tranquilo para leer un subtítulo (≈ 15 caracteres por segundo)."""
    return 1.0 + len(text) / 15.0


def get_card(mob: Mobject, color=MUTED, fill=CARD, buff=0.3, opacity=0.92, radius=0.22, stroke=2.5):
    box = RoundedRectangle(corner_radius=radius, width=mob.width + 2 * buff, height=mob.height + 2 * buff)
    box.set_fill(fill, opacity).set_stroke(color, stroke)
    box.move_to(mob)
    return box


def get_number_line(x_range=(-5, 5, 1), length=LINE_WIDTH, numbers=True, font_size=30, **kwargs) -> NumberLine:
    line = NumberLine(x_range=list(x_range), length=length, include_tip=False, tick_size=0.1,
                      include_numbers=numbers, font_size=font_size, color=INK, stroke_width=3, **kwargs)
    if numbers:
        line.numbers.set_color(MUTED)
    return line


def get_set_badge(tex: str, name: str, color, fill, width=3.3) -> VGroup:
    letter = MathTex(tex, font_size=84, color=color)
    label = TB(name, size=24, color=color)
    content = VGroup(letter, label).arrange(DOWN, buff=0.18)
    box = RoundedRectangle(corner_radius=0.3, width=width, height=content.height + 0.55)
    box.set_fill(fill, 1).set_stroke(color, 2.5).move_to(content)
    return VGroup(box, content)


def get_token(color=GOLD, radius=0.15):
    return Dot(radius=radius, color=color).set_stroke(WHITE, 3)


class ZukaScene(Scene):
    """Escena base: fondo del curso, encabezado y subtítulos que también se guardan en .srt."""

    background = "fondo_algebra.png"
    srt_name = None

    def setup(self):
        bg = ImageMobject(self.background).scale_to_fit_height(config.frame_height)
        bg.set_z_index(-100)
        self.add(bg)
        self.bg = bg
        self.header = None
        self.caption = None
        self.captions: list[dict] = []
        self.deadline = 0.0

    @property
    def now(self) -> float:
        return self.renderer.time

    # -- subtítulos ---------------------------------------------------------
    def get_caption(self, text: str) -> VGroup:
        words = T("\n".join(textwrap.wrap(text, 32)), size=27, color=INK, line_spacing=0.85)
        if words.width > 6.3:
            words.scale_to_fit_width(6.3)
        box = RoundedRectangle(corner_radius=0.2, width=words.width + 0.5, height=words.height + 0.42)
        box.set_fill("#070914", 0.82).set_stroke(BRAND, 1.2, opacity=0.6).move_to(words)
        group = VGroup(box, words)
        group.move_to([CAPTION_X, CAPTION_BOTTOM + group.height / 2, 0])
        group.set_z_index(50)
        return group

    def say(self, text: str, wait: bool = False, extra: float = 0.0):
        """Muestra la frase como subtítulo, la guarda para el .srt y reserva su tiempo de lectura."""
        new = self.get_caption(text)
        anims = [FadeIn(new, shift=0.1 * UP)]
        if self.caption is not None:
            anims.append(FadeOut(self.caption))
            self._close_caption()
        self.play(*anims, run_time=0.35)
        self.caption = new
        self.captions.append(dict(start=self.now - 0.35, end=None, text=text))
        self.deadline = self.now + reading_time(text)
        if wait:
            self.hold(extra)

    def hold(self, extra: float = 0.0):
        remaining = max(self.deadline - self.now, 0) + extra
        if remaining > 0.01:
            self.wait(remaining)

    def _close_caption(self):
        if self.captions and self.captions[-1]["end"] is None:
            self.captions[-1]["end"] = self.now

    # -- encabezado y limpieza ----------------------------------------------
    def get_header(self, symbol_tex: str, name: str, color) -> VGroup:
        symbol = MathTex(symbol_tex, font_size=44, color=color)
        words = TB(name, size=28, color=INK)
        content = VGroup(symbol, words).arrange(RIGHT, buff=0.22)
        pill = RoundedRectangle(corner_radius=0.4, width=content.width + 0.7, height=0.8)
        pill.set_fill(CARD, 0.9).set_stroke(color, 2.2).move_to(content)
        group = VGroup(pill, content).move_to(HEADER_Y * UP)
        if group.width > LINE_WIDTH:
            group.scale_to_fit_width(LINE_WIDTH)
        return group

    def set_header(self, symbol_tex: str, name: str, color):
        new = self.get_header(symbol_tex, name, color)
        if self.header is None:
            self.play(FadeIn(new, shift=0.2 * DOWN), run_time=0.6)
        else:
            self.play(FadeTransform(self.header, new), run_time=0.6)
        self.header = new

    def clear_scene(self, keep=(), run_time=0.5):
        keep = set(keep) | {self.bg, self.header, self.caption}
        mobs = [m for m in self.mobjects if m not in keep]
        if mobs:
            self.play(*(FadeOut(m) for m in mobs), run_time=run_time)

    def end_section(self):
        self.hold(0.3)
        self.clear_scene()

    def finish(self):
        """Cierra el último subtítulo, desvanece todo y escribe el .srt."""
        self.hold(0.4)
        self._close_caption()
        self.play(*(FadeOut(m) for m in self.mobjects if m is not self.bg), run_time=0.8)
        self.write_srt()

    def write_srt(self):
        def fmt(t):
            ms = int(round(t * 1000))
            h, ms = divmod(ms, 3600000)
            m, ms = divmod(ms, 60000)
            s, ms = divmod(ms, 1000)
            return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

        lines = []
        for i, c in enumerate(self.captions, start=1):
            lines += [str(i), f"{fmt(c['start'])} --> {fmt(c['end'] or self.now)}", c["text"], ""]
        name = self.srt_name or type(self).__name__
        os.makedirs("subtitulos", exist_ok=True)
        with open(os.path.join("subtitulos", f"{name}.srt"), "w", encoding="utf-8") as fp:
            fp.write("\n".join(lines))
