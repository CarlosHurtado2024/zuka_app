"""Genera trig_common.py (plantilla de las clases de trigonometría) a partir de mb_common.py de álgebra:
fondo azul de trigonometría, tarjetas en azules, colores de seno/coseno/tangente/ángulo, encabezado y
fondo fijos en pantalla y ayudantes de zoom de cámara (self.frame de manimgl, como en 3b1b/videos).

    python make_trig_common.py        # escribe trig_common.py junto a este archivo
"""
import io
import os

HERE = os.path.dirname(os.path.abspath(__file__))
src = io.open(os.path.join(HERE, "clase_radicales", "mb_common.py"), encoding="utf-8").read().replace("\r\n", "\n")


def rep(old, new):
    global src
    assert src.count(old) == 1, old[:60]
    src = src.replace(old, new)


rep('BACKGROUND_IMAGE = "fondo_algebra.png"   # assets/, 1080 × 1920', 'BACKGROUND_IMAGE = "fondo_trig.png"      # assets/, 1080 × 1920 (azul de trigonometría)')
rep('PEACH = "#2B2557"         # morado oscuro (tarjetas suaves)', 'PEACH = "#12304A"         # azul profundo (tarjetas suaves)')
rep('PEACH_DEEP = "#3B336F"', 'PEACH_DEEP = "#1B4763"')
rep('CARD = "#1B2144"', 'CARD = "#11233B"')
rep('BORDER = "#3A4170"', 'BORDER = "#2B5470"')
rep('TEAL = "#2DD4BF"          # acento frío para contrastar',
    'TEAL = "#2DD4BF"          # acento frío para contrastar\n\n'
    '# Trigonometría: los mismos colores que la app usa en sus dibujos\n'
    'C_SEN, P_SEN = "#F472B6", "#3A1530"   # seno: rosa\n'
    'C_COS, P_COS = "#22D3EE", "#0B3340"   # coseno: cian\n'
    'C_TAN, P_TAN = "#A3E635", "#24330B"   # tangente: lima\n'
    'C_ANG, P_ANG = "#FACC15", "#3A3110"   # ángulo: amarillo')
rep('''        self.background = ImageMobject(BACKGROUND_IMAGE).set_height(FRAME_HEIGHT)
        self.add(self.background)''',
    '''        self.background = ImageMobject(BACKGROUND_IMAGE).set_height(FRAME_HEIGHT)
        self.background.fix_in_frame()      # el zoom de cámara no mueve el fondo
        self.add(self.background)''')
rep('''        group.move_to(HEADER_Y * UP)
        return group''', '''        group.move_to(HEADER_Y * UP)
        group.fix_in_frame()                # el encabezado tampoco se mueve con el zoom
        return group''')
rep('''        keep = set(keep) | {self.watermark, self.header, self.background}''',
    '''        keep = set(keep) | {self.watermark, self.header, self.background, self.frame}''')
rep('''    # -- metadatos ----------------------------------------------------------''',
    '''    # -- cámara ---------------------------------------------------------------
    def zoom_to(self, target, scale=0.5, run_time=1.6, **kwargs):
        """Acerca la cámara a `target` (mobject o punto): el encuadre se encoge a `scale`."""
        point = target.get_center() if isinstance(target, Mobject) else np.array(target)
        self.play(self.frame.animate.set_height(FRAME_HEIGHT * scale).move_to(point), run_time=run_time, **kwargs)

    def zoom_reset(self, run_time=1.4, **kwargs):
        """Vuelve al encuadre completo."""
        self.play(self.frame.animate.set_height(FRAME_HEIGHT).move_to(ORIGIN), run_time=run_time, **kwargs)

    # -- metadatos ----------------------------------------------------------''')

src = src.replace('"""\nUtilidades compartidas para las clases animadas en vertical (9:16, tipo TikTok).',
                  '"""\nUtilidades compartidas para las clases de TRIGONOMETRÍA en vertical (9:16). Generado por\nmake_trig_common.py a partir de mb_common.py de álgebra: no editar a mano.', 1)

src += '''

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
'''
io.open(os.path.join(HERE, "trig_common.py"), "w", encoding="utf-8", newline="\n").write(src)
print("ok")
