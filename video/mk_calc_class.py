"""Crea (o actualiza) la carpeta de una clase de Cálculo diferencial: copia de clase_calc_c1 la plantilla
(mb_common.py con zoom de cámara, trig_scenes.py, fondo rosa de Cálculo fondo_calculo.png hecho con
`python make_background.py "#f472b6" fondo_calculo.png 0.36 0.24`), la configuración y los recursos, y
escribe su build.py a partir del de clase_trig_t17.

    python mk_calc_class.py clase_calc_c1 orden_inecuaciones "Orden, intervalos e inecuaciones" C1 S00_Portada S01_... S0k_Cierre
"""
import io
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
folder, topic, title, tag, *scenes = sys.argv[1:]
dst = os.path.join(HERE, folder)
base = os.path.join(HERE, "clase_trig_t17")
tpl = os.path.join(HERE, "clase_calc_c1")
os.makedirs(dst, exist_ok=True)
shutil.copy(os.path.join(tpl, "mb_common.py"), os.path.join(dst, "mb_common.py"))
shutil.copy(os.path.join(tpl, "trig_scenes.py"), os.path.join(dst, "trig_scenes.py"))
shutil.copy(os.path.join(tpl, "custom_config.yml"), dst)
shutil.copytree(os.path.join(tpl, "assets"), os.path.join(dst, "assets"), dirs_exist_ok=True)

b = io.open(os.path.join(base, "build.py"), encoding="utf-8").read()
b = b.replace("Clase T17 de trigonometría (ley de cosenos y área)", f"Clase {tag} de cálculo diferencial ({title.lower()})")
b = b.replace("ley_cosenos_t17", f"{topic}_{tag.lower()}")
b = re.sub(r'TOPIC = "[^"]*"', f'TOPIC = "{topic}"', b)
b = re.sub(r'TOPIC_TITLE = "[^"]*"', f'TOPIC_TITLE = "{title}"', b)
b = re.sub(r'TOPIC_TAG = "[^"]*"', f'TOPIC_TAG = "Cálculo · Clase {tag}"', b)
b = re.sub(r'SCENE_FILE = "[^"]*"', f'SCENE_FILE = "{topic}.py"', b)
parts = ",\n".join(f'        "{s}"' for s in scenes)
b = re.sub(r"PARTS = \[.*?\n\]\n", f'PARTS = [\n    ("{tag.lower()}", "Clase {tag} · {title}", [\n{parts},\n    ]),\n]\n', b, flags=re.S)
io.open(os.path.join(dst, "build.py"), "w", encoding="utf-8", newline="\n").write(b)
print("ok", dst)
