"""Sonido de «Tipos de conjuntos y relaciones» (Bauhaus Shapes): música y efectos para toda la película.

Lee events.json (segundos de película, exportado de index.html). Todo es sintetizado con numpy: marimba, kalimba
y bajo punteado sobre una retícula de 96 pulsos por minuto en re mayor; los efectos siguen la geometría
(tiralíneas, clacs de madera, golpes graves, soplos). No lleva voz: es la cama para una locución futura.
Escribe out/mix.wav (48 kHz estéreo) y la narración como tipos-conjuntos-bauhaus.srt.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, limit, click, clack, whoosh, thump, pop

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
FULL = float(D['dur']); EV = D['ev']; N = int(FULL * SR)
rng = np.random.default_rng(7)
BEAT = 0.625
def evs(kind): return [e for e in EV if e['type'] == kind]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR

# ---------------- instrumentos ----------------
def marimba(m, d=0.9, v=1.0):
    t = tt(d); f = hz(m)
    x = np.sin(2*np.pi*f*t) * np.exp(-t/0.28) + 0.30*np.sin(2*np.pi*4*f*t) * np.exp(-t/0.06) + 0.10*np.sin(2*np.pi*9.2*f*t) * np.exp(-t/0.02)
    return x * np.minimum(1, t/0.002) * v
def kalimba(m, d=1.4, v=1.0):
    t = tt(d); f = hz(m)
    x = np.sin(2*np.pi*f*t) * np.exp(-t/0.45) + 0.22*np.sin(2*np.pi*5.4*f*t) * np.exp(-t/0.05) + 0.12*np.sin(2*np.pi*2*f*t) * np.exp(-t/0.2)
    return x * np.minimum(1, t/0.0015) * v
def vibes(m, d=2.6, v=1.0):
    t = tt(d); f = hz(m)
    x = (np.sin(2*np.pi*f*t) + 0.25*np.sin(2*np.pi*4*f*t) * np.exp(-t/0.25)) * np.exp(-t/0.9) * (1 + 0.12*np.sin(2*np.pi*5.2*t))
    return x * np.minimum(1, t/0.004) * v
def bass(m, d=0.7, v=1.0):
    t = tt(d); f = hz(m)
    x = (np.sin(2*np.pi*f*t) + 0.45*np.sin(2*np.pi*2*f*t) + 0.2*np.sin(2*np.pi*3*f*t)) * np.exp(-t/0.22)
    return x * np.minimum(1, t/0.004) * v

# ---------------- efectos ----------------
fx = np.zeros((N, 2))
def hiss(d):
    n = int(d * SR); x = bp(rng.standard_normal(n), 3000, 7500, 2)
    return x * np.sin(np.pi * np.arange(n) / n) ** 1.5 * (0.7 + 0.3 * np.sin(np.arange(n) / SR * 2 * np.pi * 9))
for e in evs('grid'):
    add(fx, hiss(e['d']) * 0.030, e['t'], 1.0, e['pan'] * 0.8); add(fx, hp(click(pitch=1.4), 2500) * 0.03, e['t'], 1.0, e['pan'] * 0.8)
for e in evs('sweep'):                       # el compás: un tiralíneas más largo y más grave
    add(fx, lp(hiss(e['d']), 5200) * 0.036, e['t'], 1.0, 0.0)
for e in evs('clack'):
    add(fx, clack(pitch=0.6) * 0.20, e['t'], 1.0, e['pan']); add(fx, thump(f=110) * 0.16, e['t'], 1.0, e['pan'])
for e in evs('tap'):                         # un cuadrado toca el borde del conjunto y se devuelve
    add(fx, clack(pitch=0.9) * 0.10, e['t'], 1.0, e['pan'])
for e in evs('tick'):
    add(fx, hp(clack(pitch=1.3), 1500) * 0.05, e['t'], 1.0, e['pan'])
for e in evs('thud'):
    add(fx, thump(f=e.get('f', 70)) * 0.42, e['t'], 1.0, e['pan']); add(fx, clack(pitch=0.4) * 0.08, e['t'], 1.0, e['pan'])
for e in evs('pop'):
    add(fx, pop(1.0) * 0.10, e['t'], 1.0, e['pan'])
for e in evs('rise'):
    add(fx, click(pitch=0.6) * 0.07, e['t'], 1.0, 0.0)
for e in evs('whoosh'):
    add(fx, lp(whoosh(e['d'] + 0.1), 2600) * 0.13, e['t'] - 0.05, 1.0, 0.0)

# ---------------- música: 96 ppm, re mayor, compás de 2.5 s ----------------
CH = {'D': (38, [62, 66, 69]), 'Bm': (35, [62, 66, 71]), 'G': (43, [62, 67, 71]), 'A': (45, [61, 64, 69]), 'Em': (40, [64, 67, 71]), 'F#m': (42, [61, 66, 69])}
PROG = ['D', 'Bm', 'G', 'A', 'D', 'F#m', 'G', 'A', 'Bm', 'G', 'Em', 'A']
MUTES = [(e['t'], e['t'] + e['d']) for e in evs('mute')]
def muted(t): return any(a - 0.05 <= t < b for a, b in MUTES)
mu = np.zeros((N, 2))
nbars = int(np.ceil(FULL / (4 * BEAT)))
def chord_at(t): return CH[PROG[int(t // (4 * BEAT)) % len(PROG)]]
ACT3 = next(e['t'] for e in EV if e['type'] == 'whoosh' and e['t'] > 178)   # el acto final lleva más notas
for b in range(nbars):
    t0 = b * 4 * BEAT; root, tones = chord_at(t0)
    if t0 >= FULL - 6: break
    if t0 >= 2.0 and not muted(t0): add(mu, bass(root + 12, v=1.0), t0, 0.30, -0.1)
    if t0 >= 2.0 and not muted(t0 + 2 * BEAT): add(mu, bass(root + 19, v=1.0), t0 + 2 * BEAT, 0.22, -0.1)
    for i in range(8):
        t = t0 + i * BEAT / 2
        if t < 5.0 or muted(t): continue
        if t < ACT3 and i % 2: continue                     # actos 1 y 2: la mitad de las notas, aire para la explicación
        p = tones[[0, 2, 1, 2, 0, 2, 1, 2][i]] + (12 if i in (3, 7) else 0)
        add(mu, marimba(p), t, 0.085 + 0.02 * (i % 4 == 0), 0.25)
SCALE = [74, 76, 78, 81, 83, 86, 88, 90, 93, 95]
for e in evs('drop'):
    add(mu, kalimba(SCALE[min(9, e.get('n', 0))]), e['t'], 0.26, e['pan'] * 0.7)
for e in evs('chord'):
    root, tones = chord_at(e['t']); big = e.get('big')
    for i, p in enumerate(tones + ([tones[0] + 12] if big else [])):
        add(mu, vibes(p + 12), e['t'] + i * 0.035, 0.11 if big else 0.08, -0.3 + 0.3 * i)
    if big: add(mu, bass(root + 12, d=1.4), e['t'], 0.34, 0.0)
# final: la música se va con el plano que llena el cuadro
fade = np.ones(N); n0 = int((FULL - 5.0) * SR); fade[n0:] = np.linspace(1, 0, N - n0) ** 1.5
mu *= fade[:, None]

out = mu + fx
out[:, 0] = limit(out[:, 0], 0.9); out[:, 1] = limit(out[:, 1], 0.9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)

# ---------------- narración → .srt (no va quemada en el video) ----------------
def stamp(s): ms = int(round(s * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(os.path.join(HERE, 'tipos-conjuntos-bauhaus.srt'), 'w', encoding='utf-8', newline='\n') as f:
    for i, e in enumerate(evs('narr'), 1):
        f.write('%d\n%s --> %s\n%s\n\n' % (i, stamp(e['t']), stamp(e['t'] + e['d']), e['text']))
print('mix.wav %.1f s · %d eventos · %d líneas de narración' % (FULL, len(EV), len(evs('narr'))))
