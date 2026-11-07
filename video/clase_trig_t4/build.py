"""
Construye los entregables de la Clase T4 de trigonometría (ángulos notables) a partir de las escenas de manimgl.

    python build.py                 # renderiza en 1080 × 1920 y arma dist/
    python build.py --skip-render   # reutiliza los .mp4 ya renderizados
    python build.py --quality=-l    # borrador rápido en 540 × 960

Salidas (carpeta dist/):
  * notables_t4.mp4        la clase en un solo video vertical 9:16, sin subtítulos
  * notables_t4_guion.srt  subtítulos externos (una entrada por frase del guion)
  * notables_t4_guion.md   guion con tiempos para grabar la locución

En Windows se ejecuta con el entorno aislado de manimgl (ver README):
    set PATH=..\\.venv-gl\\Scripts;%PATH%
    ..\\.venv-gl\\Scripts\\python build.py
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys

TOPIC = "notables"
TOPIC_TITLE = "Ángulos notables"
TOPIC_TAG = "Trigonometría · Clase T4"
SCENE_FILE = "notables.py"
# Una sola parte de unos 6 minutos.
PARTS = [
    ("t4", "Clase T4 · Ángulos notables", [
        "S00_Portada",
        "S01_Cuadrado",
        "S02_Equilatero",
        "S03_Patron",
        "S04_Rampa",
        "S05_Cierre",
    ]),
]
SCENES = [scene for _, _, scenes in PARTS for scene in scenes]
DIST = "dist"


def run(cmd, **kw):
    print("$", " ".join(cmd))
    subprocess.run(cmd, check=True, stdin=subprocess.DEVNULL, **kw)


def render(quality: str):
    env = dict(os.environ, PYTHONPATH=os.path.abspath("."))
    for scene in SCENES:
        run(["manimgl", SCENE_FILE, scene, "-w", quality], env=env)


def probe_duration(path):
    """Duración del video (ffmpeg -i la imprime; no hace falta ffprobe)."""
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", path], capture_output=True, text=True)
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out.stderr).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def load_meta(scenes):
    metas, offset = [], 0.0
    for scene in scenes:
        with open(f"videos/meta/{scene}.json", encoding="utf-8") as fp:
            meta = json.load(fp)
        meta["offset"] = offset
        dur = probe_duration(f"videos/{scene}.mp4")
        meta["video_duration"] = dur
        offset += dur
        metas.append(meta)
    return metas, offset


def concat_video(path, scenes):
    lst = os.path.join(DIST, "concat.txt")
    with open(lst, "w") as fp:
        for scene in scenes:
            fp.write(f"file '{os.path.abspath(f'videos/{scene}.mp4')}'\n")
    run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
         "-c", "copy", "-movflags", "+faststart", path])
    os.remove(lst)


def fmt_srt(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def build_slides(metas):
    """Un bloque del guion por cada marca (self.mark) de las escenas."""
    slides = []
    for meta in metas:
        marks = meta["marks"] or [dict(time=0.0, title=meta["scene"])]
        marks = sorted(marks, key=lambda m: m["time"])
        marks[0] = dict(marks[0], time=0.0)
        for i, mark in enumerate(marks):
            start = mark["time"]
            end = marks[i + 1]["time"] if i + 1 < len(marks) else meta["video_duration"]
            notes = [c["text"] for c in meta["captions"] if start - 0.05 <= c["start"] < end - 0.05]
            slides.append(dict(scene=meta["scene"], title=mark["title"],
                               start=meta["offset"] + start, end=meta["offset"] + end, notes=notes))
    return slides


def write_srt(metas, path):
    lines, n = [], 1
    for meta in metas:
        for cap in meta["captions"]:
            start = meta["offset"] + cap["start"]
            end = meta["offset"] + (cap["end"] or meta["video_duration"])
            lines += [str(n), f"{fmt_srt(start)} --> {fmt_srt(end)}", cap["text"], ""]
            n += 1
    with open(path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(lines))


def write_script(slides, path, total, part_title=""):
    out = [f"# {TOPIC_TITLE}", "", f"**{part_title}**", "",
           f"{TOPIC_TAG} · duración {int(total // 60)}:{int(total % 60):02d}", "",
           "Guion para locución: el video va sin subtítulos y sin voz, con una pausa",
           "del largo de cada frase para grabarla encima.", ""]
    for i, s in enumerate(slides, start=1):
        m, sec = divmod(int(s["start"]), 60)
        out.append(f"## {i:02d}. {s['title']}  ({m}:{sec:02d})")
        out.append("")
        out += [f"- {t}" for t in s["notes"]] or ["- (animación sin texto)"]
        out.append("")
    with open(path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(out))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-render", action="store_true")
    parser.add_argument("--quality", default="--hd")
    args = parser.parse_args()

    if not args.skip_render:
        render(args.quality)
    os.makedirs(DIST, exist_ok=True)
    summary = []
    for key, part_title, scenes in PARTS:
        metas, total = load_meta(scenes)
        concat_video(os.path.join(DIST, f"{TOPIC}_{key}.mp4"), scenes)
        write_srt(metas, os.path.join(DIST, f"{TOPIC}_{key}_guion.srt"))
        slides = build_slides(metas)
        write_script(slides, os.path.join(DIST, f"{TOPIC}_{key}_guion.md"), total, part_title)
        summary.append(f"{key}: {total / 60:.2f} min, {len(slides)} bloques")
    print("Listo: " + " | ".join(summary))


if __name__ == "__main__":
    sys.exit(main())
