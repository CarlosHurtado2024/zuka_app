"""Crea (o actualiza) la carpeta de una clase de trigonometría: copia la plantilla trig_common.py como
mb_common.py, la configuración y los recursos de clase_trig_t1, y escribe su build.py.

    python mk_trig_class.py clase_trig_t2 arco_sector "Arco, sector y movimiento circular" T2 S00_Portada S01_Arco ...
"""
import io
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
folder, topic, title, tag, *scenes = sys.argv[1:]
dst = os.path.join(HERE, folder)
os.makedirs(dst, exist_ok=True)
shutil.copy(os.path.join(HERE, "trig_common.py"), os.path.join(dst, "mb_common.py"))
shutil.copy(os.path.join(HERE, "trig_scenes_common.py"), os.path.join(dst, "trig_scenes.py"))
base = os.path.join(HERE, "clase_trig_t1")
if os.path.abspath(dst) != os.path.abspath(base):
    shutil.copy(os.path.join(base, "custom_config.yml"), dst)
    shutil.copytree(os.path.join(base, "assets"), os.path.join(dst, "assets"), dirs_exist_ok=True)

b = io.open(os.path.join(base, "build.py"), encoding="utf-8").read()
b = b.replace("Clase T1 de trigonometría (grados y radianes)", f"Clase {tag} de trigonometría ({title.lower()})")
b = b.replace("grados_radianes_t1", f"{topic}_{tag.lower()}")
b = re.sub(r'TOPIC = "[^"]*"', f'TOPIC = "{topic}"', b)
b = re.sub(r'TOPIC_TITLE = "[^"]*"', f'TOPIC_TITLE = "{title}"', b)
b = re.sub(r'TOPIC_TAG = "[^"]*"', f'TOPIC_TAG = "Trigonometría · Clase {tag}"', b)
b = re.sub(r'SCENE_FILE = "[^"]*"', f'SCENE_FILE = "{topic}.py"', b)
parts = ",\n".join(f'        "{s}"' for s in scenes)
b = re.sub(r"PARTS = \[.*?\n\]\n", f'PARTS = [\n    ("{tag.lower()}", "Clase {tag} · {title}", [\n{parts},\n    ]),\n]\n', b, flags=re.S)
io.open(os.path.join(dst, "build.py"), "w", encoding="utf-8", newline="\n").write(b)
print("ok", dst)
