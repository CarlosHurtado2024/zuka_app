"""Sonido de «El arroz del rey» (Data Physicalization): música y efectos sintetizados con numpy.

Lee events.json. 96 ppm (pulso 0.625 s, compás 2.5 s), re mayor pentatónico. Cada grano hace un tic seco; los montones
suenan a arena; el aluminio da un tic brillante y la cerámica un toc apagado; cada placa de latón da una nota de marimba
(aluminio) o de campana de vidrio (cerámica) que sube la escala. Marimba en corcheas que pasa a semicorcheas en las
torres; silencios antes del veredicto y de la ficha, que son los golpes más fuertes. Escribe out/mix.wav,
arroz-ajedrez.srt y narracion.txt.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, limit, whoosh, thump, pop

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
FULL = float(D['dur']); EV = D['ev']; N = int(FULL * SR) + SR
rng = np.random.default_rng(64)
BEAT = 60 / 96; BAR = 4 * BEAT
def evs(k): return [e for e in EV if e['type'] == k]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(round(d * SR))) / SR
def noise(d): return rng.standard_normal(int(round(d * SR)))

# ---------------- instrumentos ----------------
def marimba(m, d=1.0, v=1.0):
    t = tt(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / .35) + .3 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / .05) + .1 * np.sin(2 * np.pi * 10 * f * t) * np.exp(-t / .012)
    return x * np.minimum(1, t / .0015) * v
def glass(m, d=2.0, v=1.0):
    t = tt(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / .3) + .2 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t / .1)
    return x * np.exp(-t / .9) * np.minimum(1, t / .003) * v
def bell(m, d=3.0, v=1.0):
    t = tt(d); f = hz(m); x = 0
    for r, a, tau in [(1, 1, 1.6), (2.0, .5, 1.0), (2.4, .35, .7), (3.0, .3, .5), (4.2, .2, .3)]: x = x + a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / tau)
    return x * np.minimum(1, t / .002) * v
def pad(ms, d, v=1.0):
    t = tt(d); x = 0
    for m in ms:
        for det in (-.004, .004): x = x + np.sin(2 * np.pi * hz(m) * (1 + det) * t)
    return lp(x, 1500) * np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.2) * v
def pulse(m, d=.4, v=1.0):
    t = tt(d); f = hz(m); x = np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) + .25 * np.sin(6 * np.pi * f * t)
    return x * np.exp(-t / .16) * np.minimum(1, t / .004) * v
def timp(m, v=1.0):
    t = tt(1.6); f = hz(m) * (1 + .04 * np.exp(-t / .05))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .5) + .3 * lp(noise(1.6), 300) * np.exp(-t / .06)) * v
def punch(v=1.0):
    t = tt(.7); f = 60 + 70 * np.exp(-t / .04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .2) * v
def tick_grain(v=1.0):          # un grano de arroz que cae sobre madera
    t = tt(.05); return bp(noise(.05), 2500, 9000, 2) * np.exp(-t / .006) * v
def tick_alu(v=1.0):
    t = tt(.12); x = 0
    for f in (3100, 4700, 6900): x = x + np.sin(2 * np.pi * f * (1 + rng.uniform(-.03, .03)) * t)
    return (x * .3 + bp(noise(.12), 3000, 9000) * .5) * np.exp(-t / .018) * v
def tok_cer(v=1.0):
    t = tt(.12); x = np.sin(2 * np.pi * 1300 * (1 + rng.uniform(-.05, .05)) * t) + .4 * np.sin(2 * np.pi * 2350 * t)
    return (x * .5 + bp(noise(.12), 800, 3000) * .5) * np.exp(-t / .016) * v

PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86, 88, 90, 93]
CH = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]]   # D – Bm – G – A
MUTE = [(e['t'], e['t'] + e['d']) for e in evs('suck')]
def muted(t): return any(a - .02 <= t < b for a, b in MUTE)
def duck_env():
    g = np.ones(N)
    for a, b in MUTE:
        i0, i1 = int(a * SR), int(b * SR); g[i0:i1] = .03
    return lp(g, 30)

# ---------------- música ----------------
mu = np.zeros((N, 2))
nb = int(FULL / BAR) + 1
for b in range(nb):
    t0 = b * BAR; ch = CH[b % 4]
    if t0 < FULL - 2: add(mu, pad([m + 12 for m in ch[1:]], BAR + 1.2), t0, .035, 0)
    for i in range(16):
        t = t0 + i * BEAT / 4
        if t < 7.5 or t > FULL - 4 or muted(t): continue
        dense = 45.6 <= t < 56.4 or 17.5 <= t < 22.1      # torres y montones: semicorcheas
        if i % 2 and not dense: continue
        m = ch[1:][i % 3] + 12 + (12 if i % 4 == 3 else 0)
        add(mu, marimba(m, .8), t, .06 if i % 2 == 0 else .04, -.3 + .04 * (i % 8))
    for i in range(4):
        t = t0 + i * BEAT
        if t < 17.5 or t > FULL - 5 or muted(t): continue
        add(mu, pulse(ch[0] - 12, .45), t, .16 if i % 2 == 0 else .10, 0)
# arpegio de entrada y de salida
for i, m in enumerate([62, 66, 69, 74, 78, 81]): add(mu, glass(m, 2.5), .3 + i * .18, .05, -.3 + .12 * i)
for i, m in enumerate([62, 66, 69, 74, 78, 81, 86]): add(mu, glass(m, 3.0), FULL - 3.6 + i * .14, .06, -.3 + .1 * i)
mu *= duck_env()[:, None]

# ---------------- efectos ----------------
fx = np.zeros((N, 2))
for e in evs('grain1'):
    add(fx, tick_grain(1.0), e['t'], .5, 0); add(fx, glass(86, 2.0), e['t'], .05, 0)
for e in evs('cascade'):
    n, d = e['n'], e['d']
    for k in range(n):
        tk = e['t'] + d * ((k + 1) / n) ** .85
        add(fx, tick_grain(rng.uniform(.5, 1.0)), tk, .4 / max(1, n ** .35), rng.uniform(-.4, .4))
    add(fx, marimba(PENTA[e['sq'] - 1], 1.0), e['t'] + d, .10, .1)
for e in evs('pour'):
    d = e['d']; n = int(d * SR); t = np.arange(n) / SR
    sand = bp(noise(d), 1500, 8000, 2) * np.minimum(1, t / .15) * np.minimum(1, (d - t) / .4)
    add(fx, sand * .06, e['t'], 1, -.2)
    for k in range(60): add(fx, tick_grain(rng.uniform(.4, 1)), e['t'] + rng.uniform(0, d - .3), .12, rng.uniform(-.5, .5))
for e in evs('stack'):
    nP, d = e['n'], e['d']
    for k in range(0, nP, 3):
        tk = e['t'] + d * ((k + 1) / nP) ** .85
        add(fx, (tick_alu if e['mat'] == 'A' else tok_cer)(rng.uniform(.5, 1)), tk, .07, .25 if e['mat'] == 'B' else -.15)
for e in evs('brass'):
    h = int(e['h']) - 1
    m = PENTA[min(h // 4, len(PENTA) - 1)] + (0 if e['mat'] == 'A' else 12)
    if not muted(e['t']): add(mu, (marimba if e['mat'] == 'A' else glass)(m, 1.2), e['t'], .05, -.2 if e['mat'] == 'A' else .3)
for e in evs('read'): add(fx, pop(1.2) * .05 * e['v'], e['t'], 1, .2)
for e in evs('whoosh'): add(fx, lp(whoosh(e['d']), 2000) * .12 * e['v'], e['t'], 1, 0)
for e in evs('turn'):
    add(fx, punch(), e['t'], .55, 0); add(fx, timp(38), e['t'], .5, 0); add(fx, bell(74, 3.5), e['t'], .14, -.2); add(fx, bell(81, 3.5), e['t'] + .02, .10, .2)
    for m in (50, 54, 57): add(mu, pad([m, m + 12], 3.0), e['t'], .05, 0)
for e in evs('puck'):
    add(fx, punch(1.1), e['t'], .65, 0); add(fx, timp(38, 1.1), e['t'], .55, 0); add(fx, bell(62, 4.0), e['t'], .16, 0); add(fx, bell(69, 4.0), e['t'] + .03, .12, .2)
    for k in range(5): add(fx, tick_alu(.6 / (k + 1)), e['t'] + .09 * (k + 1) ** 1.3, .25, 0)
for e in evs('end'):
    for i, m in enumerate([50, 57, 62, 66, 69]): add(mu, pad([m], 4.5), e['t'] + i * .05, .03, 0)
# aire de estudio, muy por debajo
air = lp(noise(FULL + 1), 600) * .006
fx[:len(air), 0] += air[:N]; fx[:len(air), 1] += air[:N] * .9

fade = np.ones(N); n0 = int((FULL - 3) * SR); fade[n0:] = np.maximum(0, 1 - np.arange(N - n0) / (2.8 * SR)) ** 1.5
out = ((mu + fx) * fade[:, None])[:int(FULL * SR)]
out[:, 0] = limit(out[:, 0], .9); out[:, 1] = limit(out[:, 1], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
def stamp(s): ms = int(round(s * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(os.path.join(HERE, 'arroz-ajedrez.srt'), 'w', encoding='utf-8', newline='\n') as f:
    for i, e in enumerate(evs('narr'), 1): f.write('%d\n%s --> %s\n%s\n\n' % (i, stamp(e['t']), stamp(e['t'] + e['d']), e['text']))
with open(os.path.join(HERE, 'narracion.txt'), 'w', encoding='utf-8', newline='\n') as f:
    for e in evs('narr'): f.write(e['text'] + '\n')
print('mix.wav %.1f s · %d eventos · %d líneas' % (FULL, len(EV), len(evs('narr'))))
