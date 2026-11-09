"""Crea (o actualiza) la carpeta de una clase de la unidad 1 de Álgebra (spec 2026-11-09): copia la plantilla
con zoom de cámara (mb_common.py de clase_calc_c10) con los colores morados de Álgebra y el fondo vivo
fondo_algebra_vivo.png (`python make_background.py "#8b7bff" fondo_algebra_vivo.png 0.36 0.24`), las ayudas
alg_u1_fx.py (portada, cierre, piezas 3D) y escribe su build.py.

    python mk_alg_class.py clase_alg_u1_numeros numeros "Sistemas numéricos" A1 S00_Portada S01_... S0k_Cierre
"""
import io
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
folder, topic, title, tag, *scenes = sys.argv[1:]
dst = os.path.join(HERE, folder)
tpl = os.path.join(HERE, "clase_calc_c10")
os.makedirs(os.path.join(dst, "assets"), exist_ok=True)

mb = io.open(os.path.join(tpl, "mb_common.py"), encoding="utf-8").read()
mb = mb.replace("clases de TRIGONOMETRÍA", "clases de ÁLGEBRA (unidad 1)")
for old, new in [
    ('BACKGROUND_IMAGE = "fondo_calculo.png"   # assets/, 1080 × 1920 (rosa de Cálculo, como en la app)',
     'BACKGROUND_IMAGE = "fondo_algebra_vivo.png"   # assets/, 1080 × 1920 (morado de Álgebra, como en la app)'),
    ('PEACH = "#3A1838"         # ciruela (tarjetas suaves)', 'PEACH = "#2B2557"         # morado oscuro (tarjetas suaves)'),
    ('PEACH_DEEP = "#4F2149"', 'PEACH_DEEP = "#3B336F"'),
    ('CARD = "#24142E"', 'CARD = "#1E1A40"'),
    ('BORDER = "#5A2D55"', 'BORDER = "#4A4190"'),
]:
    assert old in mb, old
    mb = mb.replace(old, new)
io.open(os.path.join(dst, "mb_common.py"), "w", encoding="utf-8", newline="\n").write(mb)
shutil.copy(os.path.join(HERE, "alg_u1_fx.py"), os.path.join(dst, "alg_fx.py"))
shutil.copy(os.path.join(tpl, "custom_config.yml"), dst)
shutil.copy(os.path.join(HERE, "fondo_algebra_vivo.png"), os.path.join(dst, "assets", "fondo_algebra_vivo.png"))
shutil.copy(os.path.join(tpl, "assets", "zuka_mascota.png"), os.path.join(dst, "assets", "zuka_mascota.png"))

b = io.open(os.path.join(tpl, "build.py"), encoding="utf-8").read()
b = b.replace("Clase C10 de cálculo diferencial (función biyectiva e inversa)", f"clase {tag} de álgebra ({title.lower()})")
b = b.replace("inversa_c10", f"{topic}_{tag.lower()}")
b = re.sub(r'TOPIC = "[^"]*"', f'TOPIC = "{topic}"', b)
b = re.sub(r'TOPIC_TITLE = "[^"]*"', f'TOPIC_TITLE = "{title}"', b)
b = re.sub(r'TOPIC_TAG = "[^"]*"', f'TOPIC_TAG = "Álgebra · {tag}"', b)
b = re.sub(r'SCENE_FILE = "[^"]*"', f'SCENE_FILE = "{topic}.py"', b)
b = b.replace("# Una sola parte de unos 6 minutos.", "# Un solo video por lección.")
parts = ",\n".join(f'        "{s}"' for s in scenes)
b = re.sub(r"PARTS = \[.*?\n\]\n", f'PARTS = [\n    ("{tag.lower()}", "{tag} · {title}", [\n{parts},\n    ]),\n]\n', b, flags=re.S)
io.open(os.path.join(dst, "build.py"), "w", encoding="utf-8", newline="\n").write(b)
print("ok", dst)
