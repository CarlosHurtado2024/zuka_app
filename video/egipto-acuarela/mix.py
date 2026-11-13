"""Sonido de «La cuerda del escriba» (Watercolor Brush): música y efectos sintetizados con numpy.

Lee events.json. 84 ppm (pulso 0.714 s, compás 2.857 s), modo frigio dominante en re (re-mib-fa#-sol-la-sib-do):
arpa pulsada, flauta de caña (ney: soplo + seno), tambor de marco (dum/tek), sistro y un dron grave. La noche
(53.8–62 s) es silencio: solo grillos y viento. No lleva voz. Escribe out/mix.wav y egipto-acuarela.srt.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, limit, click, clack, whoosh, thump, pop

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
FULL = float(D['dur']); EV = D['ev']; N = int(FULL * SR) + SR
rng = np.random.default_rng(9)
BEAT = 60 / 84; BAR = 4 * BEAT
def evs(k): return [e for e in EV if e['type'] == k]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))

# ---------------- instrumentos ----------------
def harp(m, d=1.8, v=1.0):
    t = tt(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) * np.exp(-t / .3) + .12 * np.sin(6 * np.pi * f * t) * np.exp(-t / .12)
    return x * np.exp(-t / .7) * np.minimum(1, t / .002) * v
def ney(m, d, v=1.0):
    t = tt(d); f = hz(m) * (1 + .006 * np.sin(2 * np.pi * 5 * t) * np.minimum(1, t / .4))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + .18 * np.sin(2 * ph) + .06 * np.sin(3 * ph)
    breath = bp(noise(d), hz(m) * .8, min(9000, hz(m) * 4), 2) * .35
    env = np.minimum(1, t / .12) * np.minimum(1, (d - t) / .2)
    return (tone + breath) * env * v
def drone(m, d, v=1.0):
    t = tt(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * 2 * f * t + .3) + .25 * np.sin(2 * np.pi * 3 * f * t) * (1 + .3 * np.sin(2 * np.pi * .2 * t))
    return lp(x, 900) * np.minimum(1, t / 2.0) * np.minimum(1, (d - t) / 2.0) * v
def dum(v=1.0):
    t = tt(.5); f = 85 * (1 + .5 * np.exp(-t / .03))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16) + .2 * lp(noise(.5), 600) * np.exp(-t / .03)) * v
def tek(v=1.0):
    t = tt(.15); return bp(noise(.15), 1800, 6000, 2) * np.exp(-t / .025) * v
def sistrum(v=1.0):
    t = tt(.7); x = 0
    for f in [2900, 3700, 4600, 5800]: x = x + np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / .12)
    x = x * (1 + .8 * np.sin(2 * np.pi * 26 * t)) + .4 * hp(noise(.7), 4000) * np.exp(-t / .08)
    return x * .3 * v

# escala: re frigio dominante
SC = [50, 51, 54, 55, 57, 58, 60, 62, 63, 66, 67, 69, 70, 72, 74]
MUTE = [(e['t'], e['t'] + e['d']) for e in evs('mute')]
def muted(t): return any(a - .02 <= t < b for a, b in MUTE)
mu = np.zeros((N, 2))
# dron de fondo (fuera de la noche)
for a, b in [(0, 53.8), (62.0, FULL)]: add(mu, drone(38, b - a + .5) + .6 * drone(45, b - a + .5), a, .07, 0)
ARP = [62, 66, 69, 70, 69, 66, 63, 66]
nb = int(FULL / BAR) + 1
for b in range(nb):
    t0 = b * BAR
    for i in range(8):
        t = t0 + i * BEAT / 2
        if t < 9.4 or t > 101 or muted(t): continue
        sixteen = 70.0 <= t < 79.0
        add(mu, harp(ARP[i] - (12 if i % 4 == 0 else 0), 1.2), t, .07 + .02 * (i % 4 == 0), -.25 + .07 * i)
        if sixteen: add(mu, harp(ARP[(i + 3) % 8] + 12, .6), t + BEAT / 4, .04, .3)
    for i in range(4):
        t = t0 + i * BEAT
        if t < 9.4 or t > 84 or muted(t): continue
        if i in (0, 2): add(mu, dum(), t, .30 if t > 62 else .18, 0)
        if i in (1, 3): add(mu, tek(), t, .06 if t < 62 else .10, .3)
        if t > 66 and i == 3: add(mu, tek(), t + BEAT / 2, .07, -.3)
THEME = [(62, 1), (63, .5), (66, .5), (69, 2), (67, .5), (66, .5), (63, 1), (62, 2)]
def theme(t0, n=len(THEME), slow=1.0, g=.10):
    t = t0
    for m, d in THEME[:n]: add(mu, ney(m, d * BEAT * slow * .97), t, g, .1); t += d * BEAT * slow
theme(34.3, 4); theme(39.9, 4); theme(45.6, 8); theme(86.6, 8, 1.4, .12); theme(95.0, 8, 1.4, .10)
add(mu, ney(62, 4.0), 104.0, .09, 0)
for e in evs('ding'): add(mu, harp(74, 2.5) + .6 * harp(81, 2.5), e['t'], .14, 0)
for e in evs('shimmer'):
    for i, m in enumerate([62, 66, 69, 74, 78, 81, 86]): add(mu, harp(m, 2.0), e['t'] + i * .07, .08, -.3 + .1 * i)
for e in evs('bread'): add(mu, harp(SC[(e['n'] * 3) % len(SC)] + (0 if e.get('big') else 12), .8), e['t'], .05 if not e.get('big') else .10, e['pan'])
for e in evs('stone'): add(mu, harp(SC[min(14, e['n'])], 1.0), e['t'], .06, .2)
fade = np.ones(N); n0 = int((FULL - 3.5) * SR); fade[n0:] = np.maximum(0, 1 - np.arange(N - n0) / (3.2 * SR)) ** 1.4
mu *= fade[:, None]

# ---------------- efectos ----------------
fx = np.zeros((N, 2))
def brushs(d):
    n = int(d * SR); x = bp(noise(d), 1500, 6500, 2) * (.6 + .4 * np.sin(np.arange(n) / SR * 2 * np.pi * 7))
    return x * np.sin(np.pi * np.arange(n) / n) ** 1.2
def water(d, out=0):
    n = int(d * SR); x = lp(noise(d), 1200) + .3 * bp(noise(d), 2000, 5000)
    e = np.sin(np.pi * np.arange(n) / n) ** .8
    return x * e
for e in evs('brush'): add(fx, brushs(e['d']) * .05, e['t'], 1, -.3)
for e in evs('water'): add(fx, water(e['d']) * .10, e['t'], 1, 0)
for e in evs('sistrum'): add(fx, sistrum(), e['t'], .5, .2)
for e in evs('rope'):
    n = int(e['d'] * SR); t = np.arange(n) / SR; f0 = 70 if e.get('low') else 110
    x = np.sin(2 * np.pi * (f0 + 40 * t / e['d']) * t) * np.exp(-t / (e['d'] * .7)) * np.minimum(1, t / .3)
    add(fx, (x * .5 + bp(noise(e['d']), 400, 2000) * .2 * np.exp(-t / .4)) * .14, e['t'], 1, 0)
for e in evs('stake'): add(fx, thump(f=95) * .35, e['t'], 1, e['pan']); add(fx, clack(pitch=.7) * .12, e['t'], 1, e['pan'])
for e in evs('pencil'):
    n = int(.5 * SR); x = bp(noise(.5), 3000, 9000) * (np.sin(np.arange(n) / SR * 2 * np.pi * 11) > 0) * np.sin(np.pi * np.arange(n) / n)
    add(fx, x * .03, e['t'], 1, .3)
for e in evs('grain'): add(fx, bp(noise(.35), 2500, 8000) * np.exp(-tt(.35) / .1) * .07, e['t'], 1, e['pan']); add(fx, thump(f=120) * .08, e['t'] + .1, 1, e['pan'])
for e in evs('swoosh'): add(fx, lp(whoosh(e['d']), 1800) * .10, e['t'], 1, 0)
for e in evs('mist'): add(fx, lp(whoosh(e['d'] + .3), 2400) * .08, e['t'], 1, 0)
for e in evs('bread'): add(fx, pop(1.0) * (.05 if not e.get('big') else .10), e['t'], 1, e['pan'])
for e in evs('night'):       # grillos y viento: lo único que suena de noche
    d = e['d']; n = int(d * SR); t = np.arange(n) / SR
    chirp = np.sin(2 * np.pi * 4400 * t) * ((np.sin(2 * np.pi * 34 * t) > .2) * (np.sin(2 * np.pi * .9 * t) > .3))
    wind = lp(noise(d), 500) * (.7 + .3 * np.sin(2 * np.pi * .15 * t))
    env = np.minimum(1, t / 1.0) * np.minimum(1, (d - t) / 1.0)
    add(fx, (chirp * .012 + wind * .05) * env, e['t'], 1, .2)
for e in evs('drag'): add(fx, lp(bp(noise(e['d']), 200, 1500), 900) * np.sin(np.pi * np.arange(int(e['d'] * SR)) / int(e['d'] * SR)) * .05, e['t'], 1, -.4)
for e in evs('stone'): add(fx, thump(f=70) * .22, e['t'], 1, 0); add(fx, clack(pitch=.5) * .08, e['t'], 1, 0)
for e in evs('burst'): add(fx, sistrum(1.4), e['t'], .7, 0)
for e in evs('papyrus'): add(fx, bp(noise(.8), 900, 6000) * np.sin(np.pi * np.arange(int(.8 * SR)) / int(.8 * SR)) * .05, e['t'], 1, .2)
# el río al principio y una brisa suave en el campo
add(fx, water(10.5) * .04, 0, 1, 0)
add(fx, lp(noise(20), 400) * .02, 10, 1, 0)

out = (mu + fx)[:int(FULL * SR)]
out[:, 0] = limit(out[:, 0], .9); out[:, 1] = limit(out[:, 1], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
def stamp(s): ms = int(round(s * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(os.path.join(HERE, 'egipto-acuarela.srt'), 'w', encoding='utf-8', newline='\n') as f:
    for i, e in enumerate(evs('narr'), 1): f.write('%d\n%s --> %s\n%s\n\n' % (i, stamp(e['t']), stamp(e['t'] + e['d']), e['text']))
with open(os.path.join(HERE, 'narracion.txt'), 'w', encoding='utf-8', newline='\n') as f:
    for e in evs('narr'): f.write(e['text'] + '\n')
print('mix.wav %.1f s · %d eventos · %d líneas' % (FULL, len(EV), len(evs('narr'))))
