"""
Utilidades compartidas para las clases de TRIGONOMETRÍA en vertical (9:16). Generado por
make_trig_common.py a partir de mb_common.py de álgebra: no editar a mano.

El lienzo mide 8 x 14.22 unidades (1080 x 1920 px). Para que la interfaz de la
app no tape nada importante, el contenido vive entre CONTENT_BOTTOM y
CONTENT_TOP, y el encabezado va arriba del todo.

Construido sobre la versión de 3Blue1Brown de Manim (manimgl,
https://github.com/3b1b/manim) y siguiendo las convenciones de código del
repositorio https://github.com/3b1b/videos: escenas que heredan de Scene,
Tex(R"...") para fórmulas, VGroup declarativos, LaggedStart con lag_ratio,
métodos auxiliares con prefijo get_*.

El video no lleva subtítulos quemados ni marca de agua: lo que se dice queda
registrado en el guion (.md y .srt) y en pantalla se reserva el silencio que esa
frase necesita, para grabar la locución encima.

Cada escena registra:
  * marcas de diapositiva (self.mark) -> cortes para las presentaciones HTML/PPTX
  * narración (self.say)              -> archivo .srt, guion y notas del orador
"""
from __future__ import annotations

import json
import os
import textwrap

from manimlib import *

# ---------------------------------------------------------------------------
# Paleta oscura de Zuka: fondo con el degradado morado del curso de Álgebra
# (el mismo de los clips de la app) y un tono por familia de números.
# Los nombres se conservan del tema claro original para no tocar las escenas.
# ---------------------------------------------------------------------------
BACKGROUND_IMAGE = "fondo_trig.png"      # assets/, 1080 × 1920 (azul de trigonometría)
BG_COLOR = "#0D1024"      # fondo base (rellena puntos abiertos)
PEACH = "#12304A"         # azul profundo (tarjetas suaves)
PEACH_DEEP = "#1B4763"
ORANGE = "#FF9F5A"        # acento cálido
ORANGE_SOFT = "#FFC08F"
INK = "#EEF0FF"           # texto principal
MUTED = "#9AA3C7"         # texto secundario
CARD = "#11233B"
BORDER = "#2B5470"
TEAL = "#2DD4BF"          # acento frío para contrastar

# Trigonometría: los mismos colores que la app usa en sus dibujos
C_SEN, P_SEN = "#F472B6", "#3A1530"   # seno: rosa
C_COS, P_COS = "#22D3EE", "#0B3340"   # coseno: cian
C_TAN, P_TAN = "#A3E635", "#24330B"   # tangente: lima
C_ANG, P_ANG = "#FACC15", "#3A3110"   # ángulo: amarillo

# Un color por familia de números: tono fuerte (texto y líneas) + relleno oscuro
C_N, P_N = "#FFC53D", "#3A2F12"   # naturales: miel
C_Z, P_Z = "#4FA8FF", "#11284A"   # enteros: cielo
C_Q, P_Q = "#34D399", "#0F3328"   # racionales: menta
C_I, P_I = "#FF6B7A", "#3D1520"   # irracionales: coral
C_R, P_R = "#B9A6FF", "#272052"   # reales: lavanda
C_C, P_C = ORANGE, PEACH          # complejos

SET_COLORS = {
    R"\mathbb{N}": C_N,
    R"\mathbb{Z}": C_Z,
    R"\mathbb{Q}": C_Q,
    R"\mathbb{I}": C_I,
    R"\mathbb{R}": C_R,
    R"\mathbb{C}": C_C,
}

FONT = "Segoe UI"
META_DIR = "videos/meta"

# Zonas del lienzo vertical (x va de -4 a 4; y de -7.11 a 7.11)
HEADER_Y = 6.15        # encabezado de la sección
CONTENT_TOP = 5.1      # nada importante por encima
CONTENT_BOTTOM = -4.6  # por debajo quedan los botones de la app
CONTENT_MID = (CONTENT_TOP + CONTENT_BOTTOM) / 2
LINE_WIDTH = 7.2       # ancho util para rectas numericas y tablas

# Nota: la versión instalada de manimgl compila cada fórmula en una carpeta
# temporal nueva, así que ya no hace falta borrar un working.dvi viejo.


# ---------------------------------------------------------------------------
# Texto y fórmulas
# ---------------------------------------------------------------------------
def T(text: str, size: float = 36, color=INK, **kwargs) -> Text:
    """Texto en la tipografía de la marca (el color alcanza también a la puntuación)."""
    t2c = kwargs.pop("t2c", {})
    mob = Text(text, font=FONT, font_size=size, t2c=t2c, **kwargs)
    special = {color_to_hex(c).upper() for c in t2c.values()}
    for glyph in mob.family_members_with_points():
        if color_to_hex(glyph.get_fill_color()).upper() not in special:
            glyph.set_fill(color)
    return mob


def TB(text: str, size: float = 36, color=INK, **kwargs) -> Text:
    return T(text, size=size, color=color, weight=BOLD, **kwargs)


def M(tex: str, size: float = 48, color=INK, t2c: dict | None = None, **kwargs) -> Tex:
    """Fórmula con los colores de las familias de números aplicados."""
    colors = dict(SET_COLORS)
    if t2c:
        colors.update(t2c)
    colors = {k: v for k, v in colors.items() if k in tex}
    mob = Tex(tex, font_size=size, isolate=list(colors), **kwargs)
    mob.set_color(color)
    for key, value in colors.items():
        mob.set_color_by_tex(key, value)
    return mob


def check_mark(color=None, size=60):
    return Text("✓", font="DejaVu Sans", font_size=size).set_fill(color or C_Q, 1).set_stroke(width=0)


def ex_mark(color=None, size=60):
    return Text("✗", font="DejaVu Sans", font_size=size).set_fill(color or C_I, 1).set_stroke(width=0)


def reading_time(text: str) -> float:
    """Tiempo tranquilo de lectura de un subtítulo (≈15 caracteres por segundo)."""
    return 1.0 + len(text) / 15.0


# ---------------------------------------------------------------------------
# Piezas visuales
# ---------------------------------------------------------------------------
def get_number_line(x_range=(-5, 5, 1), width=None, numbers=True, font_size=30, **kwargs) -> NumberLine:
    if width is None and "unit_size" not in kwargs:
        width = LINE_WIDTH
    line = NumberLine(x_range, width=width, include_tip=False, tick_size=0.12, **kwargs)
    line.set_stroke(INK, 3)
    if numbers:
        line.add_numbers(font_size=font_size)
        line.numbers.set_color(MUTED)
    return line


def get_card(mob: Mobject, color=BORDER, buff=0.35, fill=CARD, opacity=1.0, radius=0.22,
             stroke_width=2) -> RoundedRectangle:
    card = RoundedRectangle(
        width=mob.get_width() + 2 * buff,
        height=mob.get_height() + 2 * buff,
        corner_radius=radius,
    )
    card.set_fill(fill, opacity)
    card.set_stroke(color, stroke_width)
    card.move_to(mob)
    return card


def get_pill(text: str, color, fill, size=28) -> VGroup:
    words = TB(text, size=size, color=color)
    pill = RoundedRectangle(words.get_width() + 0.5, words.get_height() + 0.3, corner_radius=0.2)
    pill.set_fill(fill, 1).set_stroke(width=0)
    pill.move_to(words)
    return VGroup(pill, words)


def get_set_badge(tex: str, name: str, color, fill, width=2.3) -> VGroup:
    """Tarjeta de una familia: letra grande y nombre."""
    letter = Tex(tex, font_size=90).set_color(color)
    label = TB(name, size=26, color=color)
    content = VGroup(letter, label).arrange(DOWN, buff=0.2)
    box = RoundedRectangle(width, content.get_height() + 0.6, corner_radius=0.3)
    box.set_fill(fill, 1).set_stroke(color, 2.5)
    box.move_to(content)
    return VGroup(box, content)


def get_notation(symbol_tex: str, meaning: str, color=ORANGE, width_chars=30, symbol_size=76) -> VGroup:
    """Tarjeta 'Notación': el símbolo y lo que significa en palabras sencillas.

    En vertical ocupa casi todo el ancho, así que va debajo de lo que explica.
    """
    tag = TB("NOTACIÓN", size=22, color=color)
    symbol = M(symbol_tex, size=symbol_size, color=INK)
    text = T("\n".join(textwrap.wrap(meaning, width_chars)), size=28, color=INK, alignment="CENTER")
    content = VGroup(tag, symbol, text).arrange(DOWN, buff=0.26)
    box = get_card(content, color=color, buff=0.32, fill=PEACH, stroke_width=2.5)
    group = VGroup(box, content)
    if group.get_width() > LINE_WIDTH:
        group.set_width(LINE_WIDTH)
    return group


class MBScene(Scene):
    """Escena base: fondo crema, encabezado, marcas de diapositiva y guion."""

    random_seed = 1

    def setup(self):
        super().setup()
        self.marks: list[dict] = []
        self.captions: list[dict] = []
        self.caption_deadline = 0.0
        self.header: VMobject | None = None
        self.pending_cut: float | None = None
        self._clearing = False
        # Fondo con el degradado morado del curso, a juego con la app
        self.background = ImageMobject(BACKGROUND_IMAGE).set_height(FRAME_HEIGHT)
        self.background.fix_in_frame()      # el zoom de cámara no mueve el fondo
        self.add(self.background)
        # Marcador invisible: la pantalla va limpia, sin marca de agua
        self.watermark = VectorizedPoint()
        self.add(self.watermark)

    # -- presentaciones -----------------------------------------------------
    def mark(self, title: str):
        """Inicio de una nueva diapositiva (segmento) en las presentaciones."""
        self._close_segment()
        self.marks.append(dict(time=round(self.time, 3), title=title))

    def _close_segment(self):
        if self.marks and "hold" not in self.marks[-1]:
            cut = self.pending_cut if self.pending_cut is not None else self.time
            self.marks[-1]["hold"] = round(max(cut, self.marks[-1]["time"]), 3)
        self.pending_cut = None

    def play(self, *args, **kwargs):
        if not self._clearing:
            self.pending_cut = None
        super().play(*args, **kwargs)

    def _begin_clearing(self):
        if self.pending_cut is None:
            self.pending_cut = self.time
        self._clearing = True

    # -- narración (solo tiempos y guion) -----------------------------------
    def get_fox(self, height=1.45) -> ImageMobject:
        return ImageMobject("zuka_mascota.png", height=height)

    def say(self, text: str, wait: bool = False, extra: float = 0.0, run_time: float = 0.6, fox: bool = False):
        """Reserva en pantalla el tiempo de esta frase y la guarda en el guion.

        No dibuja nada: el video queda limpio para narrarlo encima. El texto
        viaja al guion (.md), a los subtítulos externos (.srt) y a las notas del
        orador. fox=True marca las frases del guía (las analogías).
        """
        self._close_caption()
        self.wait(run_time)
        self.captions.append(dict(start=round(self.time - run_time, 3), end=None, text=text, fox=fox))
        self.caption_deadline = self.time + reading_time(text)
        if wait:
            self.hold(extra)

    def hold(self, extra: float = 0.0):
        """Espera lo que falte para alcanzar a narrar la frase actual."""
        remaining = max(self.caption_deadline - self.time, 0)
        if remaining + extra > 0:
            self.wait(remaining + extra)

    def unsay(self, run_time: float = 0.4):
        """Cierra la frase en curso y deja un respiro antes del cambio de tema."""
        self.hold()
        self._close_caption()
        self.wait(run_time)

    def _close_caption(self):
        if self.captions and self.captions[-1]["end"] is None:
            self.captions[-1]["end"] = round(self.time, 3)

    # -- encabezado ---------------------------------------------------------
    def get_header(self, symbol_tex: str, name: str, color, fill) -> VGroup:
        symbol = Tex(symbol_tex, font_size=46).set_color(color)
        words = TB(name, size=32, color=INK)
        content = VGroup(symbol, words).arrange(RIGHT, buff=0.25)
        pill = RoundedRectangle(content.get_width() + 0.7, 0.86, corner_radius=0.43)
        pill.set_fill(fill, 1).set_stroke(color, 2)
        pill.move_to(content)
        group = VGroup(pill, content)
        if group.get_width() > LINE_WIDTH + 0.4:
            group.set_width(LINE_WIDTH + 0.4)
        group.move_to(HEADER_Y * UP)
        group.fix_in_frame()                # el encabezado tampoco se mueve con el zoom
        return group

    def set_header(self, symbol_tex: str, name: str, color, fill):
        new = self.get_header(symbol_tex, name, color, fill)
        if self.header is None:
            self.play(FadeIn(new, shift=0.2 * RIGHT))
        else:
            self.play(FadeTransform(self.header, new))
        self.header = new

    def clear_scene(self, keep=(), run_time=0.6):
        """Desvanece todo salvo encabezado, marca de agua, subtítulo y lo indicado."""
        keep = set(keep) | {self.watermark, self.header, self.background, self.frame}
        mobs = [m for m in self.mobjects if m not in keep]
        if mobs:
            self._begin_clearing()
            self.play(*(FadeOut(m) for m in mobs), run_time=run_time)
            self._clearing = False

    def end_section(self):
        """Cierre tranquilo de una sección: termina la frase y limpia la pantalla."""
        self.unsay()
        self.clear_scene()

    # -- cámara ---------------------------------------------------------------
    def zoom_to(self, target, scale=0.5, run_time=1.6, **kwargs):
        """Acerca la cámara a `target` (mobject o punto): el encuadre se encoge a `scale`, pero nunca tanto
        que el objetivo se salga por los lados. El encabezado se desvanece mientras dura el zoom para que
        no tape el contenido que sube."""
        point = target.get_center() if isinstance(target, Mobject) else np.array(target)
        if isinstance(target, Mobject):
            scale = max(scale, 1.2 * target.get_width() / FRAME_WIDTH, 1.25 * target.get_height() / FRAME_HEIGHT)
        scale = min(scale, 1.0)
        anims = [self.frame.animate.set_height(FRAME_HEIGHT * scale).move_to(point)]
        if self.header is not None:
            anims.append(self.header.animate.set_opacity(0))
        self.play(*anims, run_time=run_time, **kwargs)

    def zoom_reset(self, run_time=1.4, **kwargs):
        """Vuelve al encuadre completo (y trae de vuelta el encabezado)."""
        anims = [self.frame.animate.set_height(FRAME_HEIGHT).move_to(ORIGIN)]
        if self.header is not None:
            anims.append(self.header.animate.set_opacity(1))
        self.play(*anims, run_time=run_time, **kwargs)

    # -- metadatos ----------------------------------------------------------
    def tear_down(self):
        self._close_segment()
        self._close_caption()
        os.makedirs(META_DIR, exist_ok=True)
        data = dict(scene=self.__class__.__name__, duration=round(self.time, 3),
                    marks=self.marks, captions=self.captions)
        with open(os.path.join(META_DIR, f"{self.__class__.__name__}.json"), "w", encoding="utf-8") as fp:
            json.dump(data, fp, ensure_ascii=False, indent=1)
        super().tear_down()


# ---------------------------------------------------------------------------
# Piezas de trigonometría
# ---------------------------------------------------------------------------
def get_trig_axes(radius=2.2, center=ORIGIN, extend=0.6, circle=True, color=MUTED) -> VGroup:
    """Ejes cartesianos con (opcional) la circunferencia de radio `radius` centrada en `center`."""
    c = np.array(center)
    x_axis = Line(c + (radius + extend) * LEFT, c + (radius + extend) * RIGHT).set_stroke(color, 2)
    y_axis = Line(c + (radius + extend) * DOWN, c + (radius + extend) * UP).set_stroke(color, 2)
    group = VGroup(x_axis, y_axis)
    if circle:
        group.add(Circle(radius=radius).move_to(c).set_stroke(INK, 3, opacity=0.55))
    return group


def get_angle_arc(angle, radius=0.55, center=ORIGIN, color=C_ANG, width=5) -> VMobject:
    """Arco desde el eje x positivo hasta `angle` (radianes; negativo = horario)."""
    if abs(angle) < 1e-4:
        return VectorizedPoint(np.array(center))
    return Arc(start_angle=0, angle=angle, radius=radius, arc_center=np.array(center)).set_stroke(color, width)


def point_on(angle, radius=2.2, center=ORIGIN):
    return np.array(center) + radius * np.array([np.cos(angle), np.sin(angle), 0])
