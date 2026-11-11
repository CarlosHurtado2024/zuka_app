"""
Ayudas de las clases de la unidad 1 de Álgebra (spec 2026-11-09): portada y cierre en lavanda y rosa, tarjetas,
plano cartesiano, curvas recortadas y piezas 3D (monedas, cubos, cajas, cuadrícula de cubitos). Se copia a cada
carpeta clase_alg_u1_* como alg_fx.py (mk_alg_class.py).

En 3D: la cámara se inclina con `self.frame.animate.reorient(theta, phi)`; lo que debe leerse siempre de frente
(fórmulas, rótulos) va con `.fix_in_frame()`. El fondo y el encabezado ya vienen fijos.
"""
from mb_common import *

LAV, P_LAV = C_R, P_R            # lavanda: acento principal de Álgebra
PINK, P_PINK = "#F472B6", "#3A1530"
MINT, P_MINT = C_Q, P_Q
SKY, P_SKY = C_Z, P_Z
HONEY, P_HONEY = C_N, P_N
CORAL, P_CORAL = C_I, P_I


class AlgPortada(MBScene):
    part_tag = "Álgebra"
    title = ""
    subtitle = ""

    def construct(self):
        self.remove(self.watermark)
        self.mark("Portada")
        blob = Circle(radius=2.75).set_fill(PEACH, 1).set_stroke(width=0).move_to(3.1 * UP)
        halo = Circle(radius=2.25).set_fill(PEACH_DEEP, 1).set_stroke(width=0).move_to(blob)
        ring = Circle(radius=2.95).set_stroke(LAV, 3, opacity=0.6).move_to(blob)
        fox = ImageMobject("zuka_mascota.png", height=3.6).move_to(blob)
        self.play(GrowFromCenter(blob), GrowFromCenter(halo), ShowCreation(ring), run_time=1.0)
        self.play(FadeIn(fox, scale=0.85), Rotate(ring, PI / 2), run_time=1.0)
        tag = get_pill(self.part_tag, LAV, PEACH, size=28)
        title = TB(self.title, size=54, color=INK, alignment="CENTER")
        title.set_max_width(LINE_WIDTH)
        rule = Line(LEFT, RIGHT).set_width(1.8).set_stroke(PINK, 5)
        sub = T(self.subtitle, size=30, color=MUTED)
        sub.set_max_width(LINE_WIDTH)
        block = VGroup(tag, title, rule, sub).arrange(DOWN, buff=0.42).move_to(1.6 * DOWN)
        self.play(FadeIn(tag, shift=0.2 * UP), Write(title, run_time=1.6))
        self.play(ShowCreation(rule), FadeIn(sub, shift=0.2 * UP))
        self.wait(2.5)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, halo, ring, fox, block)), run_time=0.8)


class AlgCierre(MBScene):
    """Repaso en tarjetas (título, detalle, color) y despedida con lo que se practica."""
    recap = []          # [(título, detalle, color)]
    recap_say = ""
    practice = ""

    def construct(self):
        self.mark("Repasemos")
        self.set_header(R"\checkmark", "Repasemos", LAV, P_LAV)
        rows = VGroup()
        for t, d, col in self.recap:
            content = VGroup(TB(t, size=26, color=col), T(d, size=24, color=INK)).arrange(DOWN, buff=0.12)
            content.set_max_width(6.6)
            card = get_card(content, color=col, fill=PEACH, buff=0.26)
            card.stretch_to_fit_width(7.0)
            rows.add(VGroup(card, content.move_to(card)))
        rows.arrange(DOWN, buff=0.3).move_to(1.0 * UP)
        if rows.get_height() > 9.2:
            rows.set_height(9.2)
        self.say(self.recap_say)
        self.play(LaggedStartMap(FadeIn, rows, shift=0.3 * UP, lag_ratio=0.3), run_time=2.2)
        self.hold(0.5)
        self.end_section()
        self.mark("Cierre")
        self.unsay()
        self.play(FadeOut(self.header))
        blob = Circle(radius=2.3).set_fill(PEACH, 1).set_stroke(width=0).move_to(2.2 * UP)
        fox = ImageMobject("zuka_mascota.png", height=3.0).move_to(blob)
        bye = TB("¡A jugar!", size=52, color=INK)
        nxt = T(self.practice, size=30, color=LAV, alignment="CENTER")
        nxt.set_max_width(LINE_WIDTH)
        words = VGroup(bye, nxt).arrange(DOWN, buff=0.6).next_to(blob, DOWN, buff=0.7)
        self.play(GrowFromCenter(blob), FadeIn(fox, shift=0.3 * UP), run_time=1.2)
        self.play(FadeIn(words, shift=0.2 * UP))
        self.wait(3)
        self._begin_clearing()
        self.play(FadeOut(Group(blob, fox, words)), run_time=1)


# ---------------------------------------------------------------------------
# Piezas 2D
# ---------------------------------------------------------------------------
def boxed(mob, color=BORDER, fill=PEACH, **kw):
    """Tarjeta con su contenido (get_card solo dibuja el fondo)."""
    return VGroup(get_card(mob, color=color, fill=fill, **kw), mob)


def note(text, color=LAV, size=28, width=7.0):
    """Tarjeta de una línea o dos con texto centrado."""
    t = T(text, size=size, color=INK, alignment="CENTER")
    t.set_max_width(width - 0.6)
    return boxed(t, color=color)


def formula_card(tex, color=LAV, size=48):
    m = M(tex, size=size, color=INK)
    m.set_max_width(6.6)
    return boxed(m, color=color, buff=0.3)


def get_plane(x_range, y_range, unit, numbers=True, step=1, size=20, unit_y=None):
    """Plano con cuadrícula, ejes y (opcional) números cada `step`."""
    uy = unit if unit_y is None else unit_y
    axes = Axes(x_range=(x_range[0], x_range[1], 1), y_range=(y_range[0], y_range[1], 1),
                width=(x_range[1] - x_range[0]) * unit, height=(y_range[1] - y_range[0]) * uy,
                axis_config=dict(stroke_color=MUTED, stroke_width=2, include_tip=False))
    grid = VGroup()
    for x in range(int(x_range[0]), int(x_range[1]) + 1):
        grid.add(Line(axes.c2p(x, y_range[0]), axes.c2p(x, y_range[1])).set_stroke(BORDER, 1))
    for y in range(int(y_range[0]), int(y_range[1]) + 1):
        grid.add(Line(axes.c2p(x_range[0], y), axes.c2p(x_range[1], y)).set_stroke(BORDER, 1))
    labels = VGroup()
    if numbers:
        for x in range(int(x_range[0]) + 1, int(x_range[1])):
            if x != 0 and x % step == 0:
                labels.add(T(str(x).replace("-", "−"), size=size, color=MUTED).next_to(axes.c2p(x, 0), DOWN, buff=0.08))
        for y in range(int(y_range[0]) + 1, int(y_range[1])):
            if y != 0 and y % step == 0:
                labels.add(T(str(y).replace("-", "−"), size=size, color=MUTED).next_to(axes.c2p(0, y), LEFT, buff=0.08))
    plane = VGroup(grid, axes, labels)
    plane.axes = axes
    return plane


def curve(axes, f, a, b, color, width=5, n=240):
    """Gráfica de f entre a y b, partida donde sale de la ventana o no existe."""
    lo, hi = axes.y_range[0], axes.y_range[1]
    pieces, cur = VGroup(), []

    def flush():
        if len(cur) >= 2:
            pieces.add(VMobject().set_points_as_corners(cur).set_stroke(color, width))
        cur.clear()

    for k in range(n + 1):
        x = a + (b - a) * k / n
        try:
            y = f(x)
        except (ValueError, ZeroDivisionError, OverflowError):
            y = None
        if y is None or y != y or y < lo - 0.02 or y > hi + 0.02:
            flush()
            continue
        cur.append(axes.c2p(x, y))
    flush()
    return pieces


def dot(axes, x, y, color, filled=True, r=0.1):
    return Dot(axes.c2p(x, y), radius=r).set_fill(color if filled else BG_COLOR, 1).set_stroke(color, 3)


def money(n):
    """1234567 → '1.234.567' (separador de miles con punto, como en la app)."""
    s = f"{abs(round(n)):,}".replace(",", ".")
    return ("−" if n < 0 else "") + s


# ---------------------------------------------------------------------------
# Piezas 3D
# ---------------------------------------------------------------------------
def coin(radius=0.45, height=0.12, color=HONEY):
    """Moneda: cilindro con sus dos tapas (acostada sobre el plano xy, eje z hacia arriba)."""
    side = Cylinder(radius=radius, height=height, resolution=(48, 2)).set_color(color)
    top = Disk3D(radius=radius, resolution=(2, 48)).set_color(color).shift(height / 2 * OUT)
    bot = Disk3D(radius=radius, resolution=(2, 48)).set_color(color).shift(height / 2 * IN)
    g = Group(side, top, bot)
    g.set_shading(0.4, 0.4, 0.2)
    return g


def coin_stack(n, radius=0.45, height=0.12, color=HONEY, base=ORIGIN):
    """Pila de n monedas que crece hacia OUT (eje z) desde `base`."""
    g = Group()
    for k in range(n):
        g.add(coin(radius, height, color).move_to(np.array(base) + (k + 0.5) * height * OUT))
    return g


def block(w=1, h=1, d=1, color=LAV, opacity=1.0):
    """Caja (prisma) de w × h × d, con sombreado suave."""
    b = Prism(width=w, height=h, depth=d)
    b.set_color(color, opacity)
    b.set_shading(0.3, 0.5, 0.2)
    return b


def unit_cubes(nx, ny, nz=1, size=0.3, color=LAV, gap=0.03):
    """Bloque de nx × ny × nz cubitos (para contar unidades de volumen o casillas de 100)."""
    g = Group()
    for i in range(nx):
        for j in range(ny):
            for k in range(nz):
                c = Cube(side_length=size - gap).set_color(color)
                c.set_shading(0.3, 0.5, 0.2)
                c.move_to(np.array([(i - (nx - 1) / 2) * size, (j - (ny - 1) / 2) * size, (k + 0.5) * size]))
                g.add(c)
    return g


def flat(mob):
    """Deja un mobject (texto, fórmula) pegado a la pantalla durante giros de cámara."""
    mob.fix_in_frame()
    return mob


# ---------------------------------------------------------------------------
# Ejemplos resueltos paso a paso (videos complementarios E1–E5)
# ---------------------------------------------------------------------------
STEP_TOP = 2.6          # primera línea de pasos (debajo de la tarjeta del enunciado)


def why_pill(text, color):
    """Etiqueta pequeña con el concepto que justifica un paso."""
    words = T(text, size=22, color=color)
    pill = RoundedRectangle(words.get_width() + 0.36, words.get_height() + 0.2, corner_radius=0.14)
    pill.set_fill(PEACH, 1).set_stroke(color, 1.5)
    pill.move_to(words)
    return VGroup(pill, words)


class ExScene(MBScene):
    """Escena de un ejemplo resuelto: tarjeta con el enunciado arriba y pasos que bajan, cada uno con su
    porqué. Si los pasos llegan al borde inferior, los anteriores suben y los más viejos se desvanecen."""

    def problem(self, n, text, color=LAV, width_chars=34):
        tag = get_pill(f"Ejemplo {n}", color, P_LAV if color == LAV else PEACH, size=24)
        words = T("\n".join(textwrap.wrap(text, width_chars)), size=30, color=INK, alignment="CENTER")
        content = VGroup(tag, words).arrange(DOWN, buff=0.22)
        card = get_card(content, color=color, fill=CARD, buff=0.3)
        self.card = VGroup(card, content)
        if self.card.get_width() > LINE_WIDTH:
            self.card.set_width(LINE_WIDTH)
        self.card.move_to(CONTENT_TOP * UP, aligned_edge=UP)
        self.steps = []
        self.cursor = self.card.get_bottom()[1] - 0.45
        self.play(FadeIn(self.card, shift=0.2 * DOWN))
        return self.card

    def make_room(self, group):
        """Si `group` no cabe abajo, sube los pasos anteriores; los que chocarían con el enunciado se van."""
        overflow = CONTENT_BOTTOM + 0.2 - group.get_bottom()[1]
        if overflow <= 0:
            return
        limit = self.card.get_bottom()[1] - 0.25
        olds = [g for g in self.steps if g.get_top()[1] + overflow > limit]
        anims = [g.animate.shift(overflow * UP) for g in self.steps if g not in olds]
        anims += [FadeOut(g, shift=overflow * UP) for g in olds]
        self.steps = [g for g in self.steps if g not in olds]
        group.shift(overflow * UP)
        self.play(*anims, run_time=0.6)

    def step(self, tex, why=None, color=INK, size=46, why_color=MUTED, anim="write"):
        line = M(tex, size=size, color=color)
        line.set_max_width(7.0)
        group = VGroup(line)
        if why:
            pill = why_pill(why, why_color)
            pill.set_max_width(7.0)
            pill.next_to(line, DOWN, buff=0.14)
            group.add(pill)
        group.move_to(self.cursor * UP, aligned_edge=UP)
        self.make_room(group)
        if anim == "write":
            self.play(Write(line), *(FadeIn(group[1], shift=0.1 * UP),) if why else (), run_time=1.0)
        else:
            self.play(FadeIn(group, shift=0.2 * UP), run_time=0.8)
        self.steps.append(group)
        self.cursor = group.get_bottom()[1] - 0.32
        return group

    def answer(self, tex, color=MINT, size=50):
        card = formula_card(tex, color=color, size=size)
        card.move_to(self.cursor * UP, aligned_edge=UP)
        self.make_room(card)
        self.play(FadeIn(card, scale=0.9), Flash(card.get_corner(UR), color=color))
        self.steps.append(card)
        self.cursor = card.get_bottom()[1] - 0.32
        return card


# ---------------------------------------------------------------------------
# Encabezado que siempre cabe y revisor de solapamientos (spec 2026-11-11-razones-desde-cero)
# ---------------------------------------------------------------------------
HEADER_SYMBOL_MAX_H = 0.58     # una fracción como m/n ya no se sale del óvalo


def _get_header(self, symbol_tex: str, name: str, color, fill) -> VGroup:
    symbol = Tex(symbol_tex, font_size=46).set_color(color)
    if symbol.get_height() > HEADER_SYMBOL_MAX_H:
        symbol.set_height(HEADER_SYMBOL_MAX_H)
    words = TB(name, size=32, color=INK)
    content = VGroup(symbol, words).arrange(RIGHT, buff=0.25)
    h = max(0.86, content.get_height() + 0.34)
    pill = RoundedRectangle(content.get_width() + 0.7, h, corner_radius=min(0.43, h / 2))
    pill.set_fill(fill, 1).set_stroke(color, 2)
    pill.move_to(content)
    group = VGroup(pill, content)
    if group.get_width() > LINE_WIDTH + 0.4:
        group.set_width(LINE_WIDTH + 0.4)
    group.move_to(HEADER_Y * UP)
    group.fix_in_frame()
    return group


MBScene.get_header = _get_header

LAYOUT_LOG = os.path.join("videos", "layout_warnings.txt")


def _visible(m):
    return any(g.get_fill_opacity() > 0.05 or g.get_stroke_opacity() > 0.05 for g in m.family_members_with_points())


def _box(m):
    (x0, y0, _), (x1, y1, _) = m.get_corner(DL), m.get_corner(UR)
    return x0, y0, x1, y1


def _overlap(a, b, tol=0.03):
    return a[0] < b[2] - tol and b[0] < a[2] - tol and a[1] < b[3] - tol and b[1] < a[3] - tol


def _inside(a, b, tol=0.02):
    return a[0] >= b[0] - tol and a[2] <= b[2] + tol and a[1] >= b[1] - tol and a[3] <= b[3] + tol


def check_layout(scene):
    """Anota en videos/layout_warnings.txt lo que se sale del cuadro útil, toca el encabezado, se encima con otro
    texto o queda cortado por el borde de un recuadro."""
    if getattr(scene, "skip_layout_check", False):
        return
    skip = {scene.background, scene.watermark, scene.header, scene.frame}
    mobs = [m for m in scene.mobjects if m not in skip]
    issues = []
    hw = FRAME_WIDTH / 2 - 0.12
    top = HEADER_Y - 0.48 if scene.header is not None else FRAME_HEIGHT / 2 - 0.1
    texts, boxes, shapes, lines = [], [], [], []
    for m in mobs:
        fam = [g for g in m.get_family() if isinstance(g, StringMobject)]
        for t in fam:
            if _visible(t):
                texts.append(t)
        for g in m.get_family():
            if isinstance(g, Rectangle) and g.has_points() and (g.get_fill_opacity() > 0.3 or g.get_stroke_opacity() > 0.3 and g.get_stroke_width() > 0.5):
                boxes.append(g)
            elif isinstance(g, (Circle, Polygon)) and g.get_fill_opacity() > 0.3:
                shapes.append(g)
            elif isinstance(g, Line) and g.has_points() and g.get_stroke_opacity() > 0.3 and g.get_length() > 0.3:
                lines.append(g)
        if isinstance(m, Mobject) and not isinstance(m, ImageMobject) and not _visible(m):
            continue
        x0, y0, x1, y1 = _box(m)
        if x0 < -hw or x1 > hw:
            issues.append(f"se sale por un lado: {type(m).__name__} x=[{x0:.2f}, {x1:.2f}]")
        if y1 > top:
            issues.append(f"toca el encabezado: {type(m).__name__} y_top={y1:.2f}")
        if y0 < CONTENT_BOTTOM - 0.45:
            issues.append(f"baja demasiado: {type(m).__name__} y_bottom={y0:.2f}")
    tb = [(t, _box(t)) for t in texts]
    for i in range(len(tb)):
        for j in range(i + 1, len(tb)):
            if _overlap(tb[i][1], tb[j][1]):
                issues.append(f"textos encimados: «{tb[i][0].get_string()[:24]}» y «{tb[j][0].get_string()[:24]}»")
    for t, b in tb:
        for r in boxes:
            rb = _box(r)
            if _overlap(b, rb) and not _inside(b, rb) and not _inside(rb, b):
                issues.append(f"texto cortado por un recuadro: «{t.get_string()[:24]}»")
    for t, b in tb:
        for g in shapes:
            gb = _box(g)
            if _overlap(b, gb, tol=0.05) and not _inside(b, gb):
                issues.append(f"texto encima de una figura: «{t.get_string()[:24]}» sobre {type(g).__name__}")
    for t, b in tb:
        inner = (b[0] + 0.04, b[1] + 0.04, b[2] - 0.04, b[3] - 0.04)
        for ln in lines:
            a, z = ln.get_start(), ln.get_end()
            for k in range(1, 30):
                x, y = a[:2] + (z[:2] - a[:2]) * k / 30
                if inner[0] < x < inner[2] and inner[1] < y < inner[3]:
                    issues.append(f"línea encima de un texto: «{t.get_string()[:24]}»")
                    break
    seen = scene.__dict__.setdefault("_layout_seen", set())
    new = [s for s in issues if s not in seen]
    if new:
        seen.update(new)
        os.makedirs(os.path.dirname(LAYOUT_LOG), exist_ok=True)
        with open(LAYOUT_LOG, "a", encoding="utf-8") as fp:
            for s in new:
                fp.write(f"{scene.__class__.__name__} t={scene.time:.1f}: {s}\n")


_mb_play = MBScene.play


def _checked_play(self, *args, **kwargs):
    _mb_play(self, *args, **kwargs)
    check_layout(self)


MBScene.play = _checked_play
