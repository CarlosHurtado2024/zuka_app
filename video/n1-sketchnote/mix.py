"""Sonido de «Los naturales y los enteros» (Sketchnote) -> out/mix.wav, más el guion para grabar la voz encima:
n1-sketchnote_guion.md y n1-sketchnote_guion.srt (los tiempos son los de la imagen; NARR en film.js).
- Lápiz: el sonido sale de los trazos de la página (events.json): estilógrafo 2.4–6.5 kHz con grano de papel,
  letra más entrecortada, marcador más suave y grave (0.7–3.2 kHz) con un «fsh» por pasada; nivel según cuántos trazos
  hay a la vez, con techo suave; paneo según dónde está el trazo en pantalla. Soplo de papel en cada movimiento de cámara.
- Música pequeña, de madera y pulsada (marimba, pizzicato, glockenspiel; arpa y vibráfono para el cierre), baja:
  el video no lleva voz y la mezcla deja el centro libre para grabarla encima.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, whoosh

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
EV = D['ev']; NARR = next(e for e in EV if e['type'] == 'narr')
DUR = float(D['dur']); N = int(round(DUR * SR)); tt = np.arange(N) / SR
rng = np.random.default_rng(31)
LINES, SEC = NARR['lines'], NARR['sec']; PULL0, PULL1 = NARR['pull']

# ---------------- lápiz ----------------
def activity(kinds):
    a = np.zeros(N); pw = np.zeros(N)
    for e in EV:
        if e['type'] not in kinds: continue
        i0 = int(e['t'] * SR); i1 = min(N, int((e['t'] + max(e['d'], 0.03)) * SR))
        if i1 <= i0: continue
        n = i1 - i0; env = np.ones(n); r = min(n // 3, int(0.012 * SR))
        if r > 0: env[:r] = np.linspace(0, 1, r); env[-r:] = np.linspace(1, 0, r)
        a[i0:i1] += env; pw[i0:i1] += env * e.get('pan', 0)
    pan = np.where(a > 1e-6, pw / np.maximum(a, 1e-6), 0)
    level = 1 - np.exp(-a * 0.9); k = int(0.015 * SR); ker = np.ones(k) / k
    return np.convolve(level, ker, 'same'), np.convolve(pan, ker, 'same')
def tooth(lo, hi, grain_hz, depth, seed):
    r = np.random.default_rng(seed); x = bp(r.standard_normal(N), lo, hi, 2)
    g = lp(np.abs(r.standard_normal(N)), grain_hz, 1); g = g / (np.percentile(g, 95) + 1e-9)
    return x * ((1 - depth) + depth * np.clip(g, 0, 2.5))
def hand(rate, seed, sharp=1.0):
    r = np.random.default_rng(seed)
    ph = np.cumsum(rate * (1 + 2.5 * lp(r.standard_normal(N), 3, 1)) / SR) * 2 * np.pi
    return (0.5 + 0.5 * np.abs(np.sin(ph))) ** sharp
def pan_st(x, pan):
    th = (pan + 1) * np.pi / 4
    return np.stack([x * np.cos(th), x * np.sin(th)], 1)
fol = np.zeros((N, 2))
lv, pn = activity(['pen']); fol += pan_st(tooth(2400, 6500, 420, 0.9, 1) * hand(6, 2) * lv, pn * 0.5) * 0.22
lv, pn = activity(['write']); fol += pan_st(tooth(2200, 6000, 480, 0.92, 5) * hand(11, 6, 1.6) * lv, pn * 0.5) * 0.24
lv, pn = activity(['marker']); fol += pan_st(tooth(700, 3200, 240, 0.75, 7) * hand(9, 8, 2.2) * lv, pn * 0.5) * 0.2
for e in EV:
    if e['type'] in ('move', 'whip'):
        d = max(0.3, e['d']); w = whoosh(d, 0.7 if e['type'] == 'whip' else 0.4)
        add(fol, (lp(w, 3500) * (0.12 if e['type'] == 'whip' else 0.06)).astype(np.float32), e['t'], 1.0, 0)
room = lp(rng.standard_normal(N), 420, 2) * 0.0025
fol += np.stack([room, np.roll(room, 1013)], 1)

# ---------------- música ----------------
BEAT = 60 / 92; BAR = 4 * BEAT
CH = {'D': [50, 57, 62, 66], 'G': [43, 55, 59, 62], 'Bm': [47, 54, 59, 62], 'A': [45, 57, 61, 64], 'Em': [40, 55, 59, 64]}
PROG = ['D', 'G', 'Bm', 'A', 'D', 'Em', 'G', 'A']
ev = []
for b in range(int(DUR / BAR) + 1):
    t0 = 1.0 + b * BAR
    if t0 > DUR - 2: break
    vo = CH[PROG[b % len(PROG)]]
    if t0 < PULL0:
        ev.append((t0, 'contrabass_pizz', vo[0] - 12 if vo[0] > 46 else vo[0], BEAT * 1.4, 0.42, -0.05, 0.6))
        for i, beat in enumerate([0, 1.5, 2, 3]):
            ev.append((t0 + beat * BEAT, 'marimba', vo[(i + b) % 4] + 12, 0.5, 0.26 + 0.05 * (i % 2), -0.25 + 0.17 * i, 0.38))
for k, s in SEC.items():                                        # una campanita al empezar cada sección
    ev.append((s - 0.15, 'glockenspiel', 86 if k in ('nat', 'rep') else 81, 1.2, 0.3, 0.2, 0.35))
for j, p in enumerate([50, 57, 62, 66, 69, 74]): ev.append((PULL1 + 0.2 + j * 0.08, 'harp', p, 3.5, 0.5, -0.25 + 0.1 * j, 0.6))
for p in (62, 66, 69): ev.append((PULL1 + 0.3, 'vibraphone', p, 4.0, 0.36, 0.1, 0.5))
S.seed(11)
music = S.render(ev, dur=DUR + 3, master=False); music = S.room(music, size=0.35, mix=0.18)[:N]
if len(music) < N: music = np.vstack([music, np.zeros((N - len(music), 2))])
music *= np.clip((DUR - tt) / 2.0, 0, 1)[:, None]

mix = fol * 1.0 + music * 0.55
mix = np.stack([compress(mix[:, c], thr=0.35, ratio=2.0) for c in (0, 1)], 1)
mix = np.stack([limit(mix[:, c]) for c in (0, 1)], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
print('mix', DUR, 's  pico', round(float(np.abs(mix).max()), 3))
print(S.credits(['marimba', 'contrabass_pizz', 'glockenspiel', 'harp', 'vibraphone']))

# ---------------- guion para grabar la voz ----------------
def ts(x, sep=','):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f'{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s - int(s)) * 1000)):03d}'
mmss = lambda x: f'{int(x // 60)}:{int(x % 60):02d}'
open(os.path.join(HERE, 'n1-sketchnote_guion.srt'), 'w', encoding='utf-8', newline='\n').write(
    ''.join(f"{i + 1}\n{ts(L['t0'])} --> {ts(L['t1'])}\n{L['text']}\n\n" for i, L in enumerate(LINES)))
md = ['# Los números naturales y los enteros', '', '**Álgebra · Unidad 1 · Sistemas numéricos · Parte 1 (alg-11)** — versión Sketchnote', '',
      f'Duración: {mmss(DUR)}. El video va sin voz y sin subtítulos: cada frase tiene en la imagen el tiempo de leerla en voz',
      'alta (unas 2.5 palabras por segundo), así que se puede grabar encima siguiendo los tiempos de abajo o el .srt.', '',
      '## 00. Portada  (0:00)', '', '- (la página empieza a escribirse: título, sin narración)', '']
n = 1; prev = None
for L in LINES:
    if L['sec'] != prev:
        md += [f"## {n:02d}. {L['head']}  ({mmss(L['t0'])})", '']; n += 1; prev = L['sec']
    md.append(f"- [{mmss(L['t0'])}–{mmss(L['t1'])}] {L['text']}")
    if L is LINES[-1] or LINES[LINES.index(L) + 1]['sec'] != L['sec']: md.append('')
md += [f'## {n:02d}. Cierre  ({mmss(PULL0)})', '', '- (la cámara se aleja hasta ver la página entera; el marcador rodea «ℕ ⊆ ℤ»; sin narración)', '']
open(os.path.join(HERE, 'n1-sketchnote_guion.md'), 'w', encoding='utf-8', newline='\n').write('\n'.join(md))
print('guion', len(LINES), 'frases')
