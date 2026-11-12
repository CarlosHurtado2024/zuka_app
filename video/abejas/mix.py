"""Sonido de «Matemáticas de abeja» -> out/mix.wav y abejas.srt (la narración, con los tiempos de la imagen).
- El lápiz sale de la página (events.json: un suceso por marca): grafito sobre papel, más agudo para las líneas de
  construcción, entrecortado para la letra, ancho y grave para el color; un toque al apoyar; el papel al mover el lienzo.
  La síntesis del lápiz sigue la de la demo «Tablet Sketch Explainer» de Lemo-Opuscar (MIT).
- Música pequeña y cálida en re mayor, 96 pulsos por minuto: arpa (en lugar de guitarra), contrabajo en pizzicato,
  un sacudidor suave sintetizado y una nota de vibráfono por idea nueva. Casi silencio antes del título.
- Sin voz: la mezcla deja el centro libre para una narración."""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ['LIB']; sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json')))
DUR = float(D['dur']); EV = D['ev']; N = int(round(DUR * SR)); FULL = DUR
tt = np.arange(N) / SR
rng = np.random.default_rng(7)

# ---------------- el lápiz ----------------
def activity(kinds):
    a = np.zeros(N); pw = np.zeros(N)
    for e in EV:
        if e['type'] not in kinds: continue
        i0 = int(e['t'] * SR); i1 = min(N, int((e['t'] + max(e['d'], 0.035)) * SR))
        if i1 <= i0: continue
        n = i1 - i0; env = np.ones(n); r = min(n // 3, int(0.01 * SR))
        if r > 0: env[:r] = np.linspace(0, 1, r); env[-r:] = np.linspace(1, 0, r)
        a[i0:i1] += env; pw[i0:i1] += env * e.get('pan', 0)
    pan = np.where(a > 1e-6, pw / np.maximum(a, 1e-6), 0)
    level = 1 - np.exp(-a * 1.1); k = int(0.015 * SR); ker = np.ones(k) / k
    return np.convolve(level, ker, 'same'), np.convolve(pan, ker, 'same')
def tooth_noise(lo, hi, grain_hz, depth, seed):
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
lv, pn = activity(['pencil']); fol += pan_st(tooth_noise(700, 4200, 380, 0.9, 1) * hand(5, 2) * lv, pn * 0.55) * 0.28
lv, pn = activity(['light']); fol += pan_st(tooth_noise(1400, 5200, 500, 0.9, 3) * hand(7, 4) * lv, pn * 0.55) * 0.11
lv, pn = activity(['write']); fol += pan_st(tooth_noise(900, 4800, 450, 0.92, 5) * hand(10, 6, 1.6) * lv, pn * 0.55) * 0.27
lv, pn = activity(['color']); fol += pan_st(tooth_noise(320, 2600, 220, 0.75, 7) * hand(13, 8, 2.0) * lv, pn * 0.55) * 0.23
for e in EV:
    t, d, p = e['t'], e['d'], e.get('pan', 0)
    if e['type'] == 'tap':
        add(fol, hp(click(pitch=0.7 + rng.random() * 0.25, v=1.0), 1800) * 0.035, t, 1.0, p * 0.5)
    elif e['type'] == 'gesture':
        n = int(d * SR); x = lp(hp(rng.standard_normal(n), 150), 1300, 2); u = np.linspace(0, 1, n); env = np.sin(np.pi * u) ** 1.5
        g = np.stack([x * env, np.roll(x, 211) * env], 1) * 0.05
        i0 = int(t * SR); i1 = min(N, i0 + n); fol[i0:i1] += g[:i1 - i0]
room = lp(rng.standard_normal(N), 420, 2) * 0.003
fol += np.stack([room, np.roll(room, 1013)], 1)

# ---------------- música ----------------
BEAT = 60 / 96; BAR = 4 * BEAT
CH = {'D': ([50, 57, 62, 66], 38), 'Bm': ([47, 54, 59, 62], 35), 'G': ([55, 59, 62, 67], 31), 'A': ([57, 61, 64, 69], 33), 'Em': ([52, 55, 59, 64], 40), 'F#m': ([54, 57, 61, 66], 42)}
CHART = ['D', 'Bm', 'G', 'A', 'D', 'F#m', 'G', 'A', 'Bm', 'G', 'Em', 'A']
title = next(e['t'] for e in EV if e['type'] == 'title'); done = next(e['t'] for e in EV if e['type'] == 'done')
QUIET = [(title - 1.25, title)]
quiet = lambda t: any(a <= t < b for a, b in QUIET)
ev = []
pat = [[0, 1.5, 2, 3.5], [0, 1, 2.5, 3]]
for b in range(int(FULL / BAR) + 1):
    t0 = b * BAR; vo, root = CH[CHART[b % len(CHART)]]
    if t0 > done: break
    sparse = b < 2
    if not sparse and not quiet(t0): ev.append((t0, 'contrabass_pizz', root if root >= 28 else root + 12, BEAT * 1.6, 0.6, -0.05, 0.9))
    if not sparse and not quiet(t0 + 2 * BEAT): ev.append((t0 + 2 * BEAT, 'contrabass_pizz', root + 7, BEAT * 1.4, 0.5, -0.05, 0.8))
    for i, beat in enumerate(pat[b % 2]):
        t = t0 + beat * BEAT
        if t < 0.6 or quiet(t) or t > done or (sparse and i % 2): continue
        ev.append((t, 'harp', vo[i % 4] + 12, 0.9, 0.36 + 0.06 * (i % 2), -0.2 + 0.13 * (i % 4), 0.6))
for e in EV:                                     # una nota suave por idea nueva
    if e['type'] == 'idea': ev.append((e['t'], 'vibraphone', 78 if int(e['t']) % 2 else 74, 1.6, 0.36, 0.25, 0.55))
for j, p in enumerate([38 + 12, 57, 62, 66, 69, 74]):   # el título: el acorde de llegada
    ev.append((title + j * 0.035, 'harp', p, 2.4, 0.5, -0.25 + j * 0.1, 0.7))
ev.append((title, 'contrabass_pizz', 38, 2.0, 0.7, 0, 1.0)); ev.append((title + 0.02, 'vibraphone', 78, 2.5, 0.4, 0.2, 0.55))
for j, p in enumerate([50, 57, 62, 66, 74]): ev.append((done + j * 0.05, 'harp', p, 3.0, 0.46, -0.2 + j * 0.1, 0.65))
ev.append((done, 'vibraphone', 81, 3.0, 0.36, 0.2, 0.5))
S.seed(11)
music = S.render(ev, dur=FULL + 2.5, master=False)
music = S.room(music, size=0.3, mix=0.16)[:N]
if len(music) < N: music = np.vstack([music, np.zeros((N - len(music), 2))])
shk = np.zeros(N)                                # sacudidor suave, en corcheas
for i in range(int(FULL / (BEAT / 2))):
    t = i * BEAT / 2
    if t < 2 * BAR or quiet(t) or t > done: continue
    n = int(0.07 * SR); x = hp(rng.standard_normal(n), 4500) * np.exp(-np.arange(n) / (0.016 * SR)) * (0.012 + 0.006 * (i % 2))
    i0 = int(t * SR); shk[i0:i0 + n] += x[:max(0, min(n, N - i0))]
music += np.stack([shk * 0.8, shk], 1)
music *= np.clip((FULL - tt) / 1.6, 0, 1)[:, None] ** 1.3

mix = music * 1.0 + fol * 0.9
mix = np.stack([compress(mix[:, 0], thr=0.35, ratio=2.2), compress(mix[:, 1], thr=0.35, ratio=2.2)], 1)
mix = np.stack([limit(mix[:, 0]), limit(mix[:, 1])], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
print('mix', mix.shape, 'pico', round(float(np.abs(mix).max()), 3))
print(S.credits(['harp', 'contrabass_pizz', 'vibraphone']))

# la narración como .srt
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
lines = next(e for e in EV if e['type'] == 'narr')['lines']
open(os.path.join(HERE, 'abejas.srt'), 'w', encoding='utf-8', newline='\n').write(
    ''.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n\n' for i, (a, b, txt) in enumerate(lines)))
print('srt', len(lines), 'líneas')
