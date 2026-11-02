"""
Construye todos los entregables del tema a partir de las escenas de manimgl.

    python build.py                 # renderiza en 1080p y arma todo
    python build.py --skip-render   # reutiliza los .mp4 ya renderizados
    python build.py --quality=-l    # borrador rápido en 480p

Salidas (carpeta dist/):
  * <tema>_parte1.mp4, _parte2.mp4  la clase en dos videos verticales 9:16, sin subtítulos
  * <tema>_parteN_guion.srt / .md   subtítulos y guion para locución de cada parte

En Windows se ejecuta con el entorno aislado de manimgl (ver README de video/):
    set PATH=..\\.venv-gl\\Scripts;%PATH%
    ..\\.venv-gl\\Scripts\\python build.py
"""
from __future__ import annotations

import argparse
import copy
import html
import json
import os
import shutil
import subprocess
import sys

TOPIC = "sistemas_numericos"
TOPIC_TITLE = "Sistemas numéricos y números reales"
TOPIC_TAG = "Clase 1"
SCENE_FILE = "sistemas_numericos.py"
# La clase completa se divide en dos videos (cada uno de menos de 10 minutos).
# La presentación HTML y el PowerPoint recorren la clase entera.
PARTS = [
    ("parte1", "Parte 1 · Naturales, enteros y racionales", [
        "S00_Portada",
        "S01_Familia",
        "S02_Naturales",
        "S03_Enteros",
        "S04_Racionales",
        "S04b_CierreParte1",
    ]),
    ("parte2", "Parte 2 · Irracionales, reales y sus reglas", [
        "S00_PortadaParte2",
        "S05_Irracionales",
        "S06_Reales",
        "S07_ReglasDelJuego",
        "S08_Orden",
        "S09_ValorAbsoluto",
        "S10_Cierre",
    ]),
]
SCENES = [scene for _, _, scenes in PARTS for scene in scenes]
# Nombre de sección y color (de la familia de números) que muestra la presentación
SCENE_INFO = {
    "S00_Portada": ("Portada · Parte 1", "#E2611F"),
    "S04b_CierreParte1": ("Fin de la Parte 1", "#E2611F"),
    "S00_PortadaParte2": ("Portada · Parte 2", "#E2611F"),
    "S01_Familia": ("La familia de los números", "#E2611F"),
    "S02_Naturales": ("Naturales", "#D98A00"),
    "S03_Enteros": ("Enteros", "#2F86D0"),
    "S04_Racionales": ("Racionales", "#2E9E62"),
    "S05_Irracionales": ("Irracionales", "#E0504F"),
    "S06_Reales": ("Reales", "#7E5CD6"),
    "S07_ReglasDelJuego": ("Reglas del juego", "#E2611F"),
    "S08_Orden": ("Orden e intervalos", "#2F86D0"),
    "S09_ValorAbsoluto": ("Valor absoluto", "#1E9E8F"),
    "S10_Cierre": ("Repaso y práctica", "#E2611F"),
}
DIST = "dist"
CLIPS = os.path.join(DIST, "presentacion_html", "clips")


def run(cmd, **kw):
    print("$", " ".join(cmd))
    subprocess.run(cmd, check=True, stdin=subprocess.DEVNULL, **kw)


def render(quality: str):
    env = dict(os.environ, PYTHONPATH=os.path.abspath("."))
    for scene in SCENES:
        run(["manimgl", SCENE_FILE, scene, "-w", quality], env=env)


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


def probe_duration(path):
    """Duración del video (ffmpeg -i la imprime; no hace falta ffprobe)."""
    import re
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", path], capture_output=True, text=True)
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out.stderr).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


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
    slides = []
    for meta in metas:
        marks = meta["marks"] or [dict(time=0.0, title=meta["scene"])]
        marks = sorted(marks, key=lambda m: m["time"])
        marks[0] = dict(marks[0], time=0.0)
        for i, mark in enumerate(marks):
            start = mark["time"]
            end = marks[i + 1]["time"] if i + 1 < len(marks) else meta["video_duration"]
            notes = [c["text"] for c in meta["captions"] if start - 0.05 <= c["start"] < end - 0.05]
            # La diapositiva se detiene donde el contenido aún está completo (antes del desvanecido)
            hold = min(mark.get("hold", end), end)
            if hold - start < 1.0:
                hold = end
            slides.append(dict(
                scene=meta["scene"], title=mark["title"],
                start=meta["offset"] + start, end=meta["offset"] + end,
                local_start=start, local_end=hold, notes=notes,
            ))
    return slides


def cut_clips(slides):
    os.makedirs(CLIPS, exist_ok=True)
    for i, slide in enumerate(slides, start=1):
        name = f"{i:02d}.mp4"
        src = f"videos/{slide['scene']}.mp4"
        run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{slide['local_start']:.3f}",
             "-to", f"{slide['local_end']:.3f}", "-i", src,
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p",
             "-an", "-movflags", "+faststart", os.path.join(CLIPS, name)])
        clip = os.path.join(CLIPS, name)
        run(["ffmpeg", "-loglevel", "error", "-y", "-i", clip, "-frames:v", "1", "-q:v", "3",
             os.path.join(CLIPS, f"{i:02d}.jpg")])
        run(["ffmpeg", "-loglevel", "error", "-y", "-sseof", "-0.2", "-i", clip, "-frames:v", "1",
             "-vf", "scale=480:-1", "-q:v", "4", os.path.join(CLIPS, f"{i:02d}_t.jpg")])
        slide["clip"] = name
        slide["poster"] = f"{i:02d}.jpg"
        slide["thumb"] = f"{i:02d}_t.jpg"


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


# ---------------------------------------------------------------------------
# Presentación HTML
# ---------------------------------------------------------------------------
def write_html(slides, path):
    data = [dict(title=s["title"], clip=f"clips/{s['clip']}", poster=f"clips/{s['poster']}",
                 thumb=f"clips/{s['thumb']}", duration=round(s["local_end"] - s["local_start"], 2),
                 notes=s["notes"], scene=s["scene"], section=SCENE_INFO[s["scene"]][0],
                 color=SCENE_INFO[s["scene"]][1], part=s.get("part", "")) for s in slides]
    out_dir = os.path.dirname(path)
    shutil.copy("assets/euly_fox.png", os.path.join(out_dir, "guia.png"))
    with open("presentation_template.html", encoding="utf-8") as fp:
        template = fp.read()
    page = (template
            .replace("__TITLE__", html.escape(TOPIC_TITLE))
            .replace("__TAG__", html.escape(TOPIC_TAG))
            .replace("__SLIDES__", json.dumps(data, ensure_ascii=False)))
    # Versión para el artefacto publicado (el visor agrega el esqueleto HTML)
    with open(os.path.join(os.path.dirname(path), "artifact_body.html"), "w", encoding="utf-8") as fp:
        fp.write(page)
    # Versión local completa: abrir index.html directamente en el navegador
    full = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + page.replace("<div class=\"app\"", "</head>\n<body>\n<div class=\"app\"", 1)
            + "\n</body>\n</html>\n")
    with open(path, "w", encoding="utf-8") as fp:
        fp.write(full)


# ---------------------------------------------------------------------------
# Presentación PPTX (video que se reproduce solo al entrar en la diapositiva)
# ---------------------------------------------------------------------------
AUTOPLAY_TIMING = """<p:timing xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>
<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>
<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>
<p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>
<p:par><p:cTn id="5" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="afterEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>
<p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="6" dur="{dur}" fill="hold"/><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:cmd>
</p:childTnLst></p:cTn></p:par>
</p:childTnLst></p:cTn></p:par>
</p:childTnLst></p:cTn></p:par>
</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>
<p:video><p:cMediaNode vol="80000"><p:cTn id="7" fill="hold" display="0"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:endCondLst><p:cond evt="onStopAudio" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:endCondLst></p:cTn><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cMediaNode></p:video>
</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>"""


def write_pptx(slides, path):
    from lxml import etree
    from pptx import Presentation
    from pptx.dml.color import RGBColor
    from pptx.util import Emu, Inches, Pt

    prs = Presentation()
    prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
    blank = prs.slide_layouts[6]
    bg = RGBColor(0xFF, 0xF8, 0xF1)

    for i, s in enumerate(slides, start=1):
        slide = prs.slides.add_slide(blank)
        fill = slide.background.fill
        fill.solid()
        fill.fore_color.rgb = bg
        clip = os.path.join(CLIPS, s["clip"])
        poster = os.path.join(CLIPS, f"{i:02d}_first.jpg")
        # Cuadro final como póster: así el clasificador de diapositivas muestra el contenido
        run(["ffmpeg", "-loglevel", "error", "-y", "-sseof", "-0.2", "-i", clip, "-frames:v", "1", "-q:v", "3", poster])
        movie = slide.shapes.add_movie(clip, 0, 0, prs.slide_width, prs.slide_height,
                                       poster_frame_image=poster, mime_type="video/mp4")
        movie.name = f"Animación {i:02d}"
        # Reemplazar la temporización por una de reproducción automática
        dur_ms = int(round((s["local_end"] - s["local_start"]) * 1000))
        timing_xml = AUTOPLAY_TIMING.replace("{spid}", str(movie.shape_id)).replace("{dur}", str(dur_ms))
        sld = slide._element
        for old in sld.findall("{http://schemas.openxmlformats.org/presentationml/2006/main}timing"):
            sld.remove(old)
        new_timing = etree.fromstring(timing_xml)
        # Transición de desvanecido suave entre diapositivas
        transition = etree.fromstring(
            '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med">'
            '<p:fade/></p:transition>')
        clr = sld.find("{http://schemas.openxmlformats.org/presentationml/2006/main}clrMapOvr")
        if clr is not None:
            clr.addnext(transition)
        else:
            sld.append(transition)
        # <p:timing> va después de <p:clrMapOvr> y antes de <p:extLst>
        ext = sld.find("{http://schemas.openxmlformats.org/presentationml/2006/main}extLst")
        if ext is not None:
            ext.addprevious(new_timing)
        else:
            transition.addnext(new_timing)
        # Notas del orador: título + guion de la diapositiva
        notes = slide.notes_slide.notes_text_frame
        notes.text = f"{i:02d}. {s['title']}"
        for line in s["notes"]:
            p = notes.add_paragraph()
            p.text = line
        os.remove(poster)
    prs.core_properties.title = TOPIC_TITLE
    prs.save(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-render", action="store_true")
    parser.add_argument("--quality", default="--hd")
    args = parser.parse_args()

    if not args.skip_render:
        render(args.quality)
    os.makedirs(DIST, exist_ok=True)
    all_slides, summary = [], []
    for key, part_title, scenes in PARTS:
        metas, total = load_meta(scenes)
        concat_video(os.path.join(DIST, f"{TOPIC}_{key}.mp4"), scenes)
        write_srt(metas, os.path.join(DIST, f"{TOPIC}_{key}_guion.srt"))
        slides = build_slides(metas)
        for slide in slides:
            slide["part"] = part_title
        write_script(slides, os.path.join(DIST, f"{TOPIC}_{key}_guion.md"), total, part_title)
        all_slides += slides
        summary.append(f"{key}: {total / 60:.2f} min, {len(slides)} diapositivas")
    # Zuka: solo los videos verticales, los .srt y los guiones (sin presentación HTML ni PPTX)
    with open(os.path.join(DIST, "slides.json"), "w", encoding="utf-8") as fp:
        json.dump(all_slides, fp, ensure_ascii=False, indent=1)
    print("Listo: " + " | ".join(summary))


if __name__ == "__main__":
    sys.exit(main())
