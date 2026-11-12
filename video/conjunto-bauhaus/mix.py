"""Sonido de «¿Qué es un conjunto?» (Bauhaus Shapes) -> out/mix.wav, más el guion para grabar la voz encima
(conjunto-bauhaus_guion.md y .srt; los tiempos son los de la imagen, NARR en film.js).
Los efectos siguen la geometría (events.json, barrido de la película): un golpe sordo por cada círculo que cae (más
grave cuanto más grande), un toque de madera por cada cuadrado que encaja o crece, un clic suave por cada pieza que
sube por su ranura, un soplo en cada latigazo. Música ligera de percusión afinada y cuerdas pulsadas sobre una rejilla
fija; un acorde al empezar cada escena. Baja, para dejar sitio a la voz."""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, whoosh, click, clack, env_exp, t_

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
EV = D['ev']; NARR = next(e for e in EV if e['type'] == 'narr')
DUR = float(D['dur']); N = int(round(DUR * SR)); tt = np.arange(N) / SR
LINES, SEC, OUTRO = NARR['lines'], NARR['sec'], NARR['outro']
rng = np.random.default_rng(5)
fx = np.zeros((N, 2), np.float32)

def thud(r):
    d = 0.32; x = t_(d); f = 120 - min(r, 120) * 0.45
    return ((np.sin(2 * np.pi * f * x) * env_exp(d, 0.07) + lp(rng.standard_normal(len(x)), 900) * env_exp(d, 0.012) * 0.4) * 0.5).astype(np.float32)
taken = set()
for e in sorted(EV, key=lambda e: e['t']):
    t = e['t']
    if e['type'] == 'drop': add(fx, thud(e.get('r', 60)), t, 0.55, 0); taken.add(round(t - 0.3, 2))
    elif e['type'] == 'block': add(fx, clack(0.6, 0.8), t, 0.5, 0); taken.add(round(t, 2))
    elif e['type'] == 'whip': add(fx, (lp(whoosh(e['d'], 0.8), 4000) * 0.32).astype(np.float32), t, 1.0, 0)
    elif e['type'] == 'grow': add(fx, (lp(whoosh(e['d'], 0.4), 1500) * 0.4).astype(np.float32), t, 1.0, 0)
for e in EV:                                                   # clic suave para todo lo demás que aparece
    if e['type'] == 'tick' and round(e['t'], 2) not in taken: add(fx, (hp(click(1.1, 1.0), 1500) * 0.05).astype(np.float32), e['t'] + 0.05, 1.0, 0)
room = lp(rng.standard_normal(N), 400, 2) * 0.002; fx[:, 0] += room; fx[:, 1] += np.roll(room, 997)

BEAT = 60 / 96; BAR = 4 * BEAT
CH = {'C': [48, 55, 60, 64], 'Am': [45, 52, 57, 60], 'F': [41, 53, 57, 60], 'G': [43, 55, 59, 62]}
PROG = ['C', 'Am', 'F', 'G']; ev = []
for b in range(int(DUR / BAR) + 1):
    t0 = 1.0 + b * BAR
    if t0 > OUTRO: break
    vo = CH[PROG[b % 4]]
    ev.append((t0, 'contrabass_pizz', vo[0] - 12 if vo[0] > 44 else vo[0], BEAT * 1.4, 0.4, 0, 0.55))
    for i, beat in enumerate([0, 1, 2, 2.5, 3]):
        ev.append((t0 + beat * BEAT, 'marimba', vo[i % 4] + 12, 0.45, 0.24 + 0.05 * (i % 2), -0.3 + 0.15 * i, 0.32))
for k, s in SEC.items():
    for j, p in enumerate([60, 64, 67, 72]): ev.append((s - 0.85 + j * 0.03, 'vibraphone', p, 2.2, 0.3, -0.2 + 0.13 * j, 0.32))
for j, p in enumerate([48, 55, 60, 64, 67, 72]): ev.append((OUTRO + 2.3 + j * 0.06, 'harp', p, 3.5, 0.5, -0.25 + 0.1 * j, 0.6))
for p in (60, 64, 67): ev.append((OUTRO + 2.3, 'vibraphone', p, 3.5, 0.36, 0, 0.5))
S.seed(3)
music = S.render(ev, dur=DUR + 3, master=False); music = S.room(music, size=0.35, mix=0.18)[:N]
if len(music) < N: music = np.vstack([music, np.zeros((N - len(music), 2))])
music *= np.clip((DUR - tt) / 2.0, 0, 1)[:, None]
mix = fx * 1.0 + music * 0.6
mix = np.stack([compress(mix[:, c], thr=0.35, ratio=2.0) for c in (0, 1)], 1)
mix = np.stack([limit(mix[:, c]) for c in (0, 1)], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
print('mix', DUR, 's  pico', round(float(np.abs(mix).max()), 3), ' sucesos', len(EV))
print(S.credits(['marimba', 'contrabass_pizz', 'vibraphone', 'harp']))

def ts(x):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
mmss = lambda x: f'{int(x // 60)}:{int(x % 60):02d}'
open(os.path.join(HERE, 'conjunto-bauhaus_guion.srt'), 'w', encoding='utf-8', newline='\n').write(
    ''.join(f"{i + 1}\n{ts(L['t0'])} --> {ts(L['t1'])}\n{L['text']}\n\n" for i, L in enumerate(LINES)))
md = ['# ¿Qué es un conjunto? Notación y pertenencia', '', '**Álgebra · Unidad 0 · Conjuntos · Lección 1 (alg-0a)** — versión Bauhaus Shapes', '',
      f'Duración: {mmss(DUR)}. El video va sin voz y sin subtítulos: cada frase tiene en la imagen el tiempo de leerla en voz',
      'alta (unas 2.5 palabras por segundo), así que se puede grabar encima siguiendo los tiempos de abajo o el .srt.', '',
      '## 00. Portada  (0:00)', '', '- (cae el cuadrado azul con los tres colores del semáforo y sube el título; sin narración)', '']
n = 1; prev = None
for i, L in enumerate(LINES):
    if L['sec'] != prev: md += [f"## {n:02d}. {L['head']}  ({mmss(L['t0'])})", '']; n += 1; prev = L['sec']
    md.append(f"- [{mmss(L['t0'])}–{mmss(L['t1'])}] {L['text']}")
    if L['sec'] == 'err': md.append('- (la imagen sigue con los tres errores y la forma correcta, unos 8 s sin narración)')
    if i == len(LINES) - 1 or LINES[i + 1]['sec'] != L['sec']: md.append('')
md += [f'## {n:02d}. Cierre  ({mmss(OUTRO)})', '', '- (el cuadrado azul crece hasta salir del cuadro y caen los tres colores; sin narración)', '']
open(os.path.join(HERE, 'conjunto-bauhaus_guion.md'), 'w', encoding='utf-8', newline='\n').write('\n'.join(md))
print('guion', len(LINES), 'frases')
