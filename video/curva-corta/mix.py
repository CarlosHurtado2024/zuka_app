"""Sonido de «La curva más corta» (3D Map Explainer): música y efectos sintetizados con numpy.

Lee events.json. 96 ppm (compás 2.5 s), re menor pentatónico. Pulso de cuerdas graves pulsadas, vibráfono frotado, arpa,
campanitas por cada punto que se enciende, un brillo eléctrico y un golpe grave cuando se enciende una ruta, un barrido
grave en el corte con un murmullo apagado mientras está abierto, aire de gran altura en el vuelo bajo, un pizzicato por
placa y medio compás de silencio antes del veredicto. Escribe out/mix.wav, curva-corta.srt y narracion.txt.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, limit, whoosh, pop

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
FULL = float(D['dur']); EV = D['ev']; N = int(FULL * SR) + SR
rng = np.random.default_rng(11)
BEAT = 60 / 96; BAR = 4 * BEAT
def evs(k): return [e for e in EV if e['type'] == k]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(round(d * SR))) / SR
def noise(d): return rng.standard_normal(int(round(d * SR)))

def pluck(m, d=1.0, v=1.0):        # cuerda grave pulsada
    t = tt(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) * np.exp(-t / .2) + .25 * np.sin(6 * np.pi * f * t) * np.exp(-t / .08)
    return lp(x * np.exp(-t / .45) * np.minimum(1, t / .003), 2500) * v
def vib(m, d, v=1.0):              # vibráfono frotado
    t = tt(d); f = hz(m)
    x = (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 4 * f * t)) * (1 + .15 * np.sin(2 * np.pi * 5.5 * t))
    return x * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8) * v
def chime(m, d=2.2, v=1.0):
    t = tt(d); f = hz(m); x = 0
    for r, a, tau in [(1, 1, .9), (2.76, .4, .35), (5.4, .2, .15)]: x = x + a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / tau)
    return x * np.minimum(1, t / .002) * v
def harp(m, d=1.6, v=1.0):
    t = tt(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t) * np.exp(-t / .25)) * np.exp(-t / .7) * np.minimum(1, t / .002) * v
def pedal(m, d, v=1.0):
    t = tt(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) + .25 * np.sin(6 * np.pi * f * t)
    return lp(x, 700) * np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 1.5) * v
def sub(v=1.0):
    t = tt(.9); f = 45 + 50 * np.exp(-t / .05)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .3) * v
def shimmer(d, v=1.0):
    t = tt(d); x = 0
    for f in (2100, 3170, 4400, 6300): x = x + np.sin(2 * np.pi * f * t * (1 + .002 * np.sin(2 * np.pi * 7 * t)))
    return x * .25 * np.exp(-t / (d * .5)) * np.minimum(1, t / .05) * v
def timp(m, v=1.0):
    t = tt(1.6); f = hz(m) * (1 + .04 * np.exp(-t / .05))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .5) + .3 * lp(noise(1.6), 300) * np.exp(-t / .06)) * v

SC = [62, 65, 67, 69, 72, 74, 77, 79, 81, 84, 86]          # re menor pentatónico
CH = [[38, 50, 57, 65], [34, 46, 53, 62], [41, 53, 60, 65], [36, 48, 55, 64]]   # Dm – B♭ – F – C
MUTE = [(e['t'], e['t'] + e['d']) for e in evs('suck')]
HUSH = [(e['t'], e['t'] + e['d']) for e in evs('hush')]
def muted(t): return any(a - .02 <= t < b for a, b in MUTE)
def hushed(t): return any(a <= t < b for a, b in HUSH)

mu = np.zeros((N, 2))
for b in range(int(FULL / BAR) + 1):
    t0 = b * BAR; ch = CH[b % 4]
    if t0 > FULL - 1: break
    add(mu, vib(ch[2] + 12, BAR + 1.0) + .7 * vib(ch[3] + 12, BAR + 1.0), t0, .022, 0)
    for i in range(8):
        t = t0 + i * BEAT / 2
        if t < 7.5 or t > FULL - 4 or muted(t) or hushed(t): continue
        add(mu, pluck(ch[0] + (12 if i % 4 == 2 else 0), .7), t, .11 if i % 2 == 0 else .06, -.1)
    if 18 <= t0 < 27 or 48 <= t0 < 57:
        for i in range(4): add(mu, harp(ch[1:][i % 3] + 12, 1.4), t0 + i * BEAT, .05, -.3 + .2 * i)
for a, b in HUSH: add(mu, pedal(38, b - a + 1.5), a, .08, 0)
add(mu, pedal(38, 7.5), 0, .07, 0)
for i, m in enumerate([62, 69, 74, 77, 81]): add(mu, harp(m, 2.5), FULL - 5.5 + i * .16, .06, -.3 + .15 * i)
g = np.ones(N)
for a, b in MUTE: g[int(a * SR):int(b * SR)] = .03
mu *= lp(g, 30)[:, None]

fx = np.zeros((N, 2))
for e in evs('chime'): add(fx, chime(SC[e['n'] % len(SC)] + 12, 2.4), e['t'], .10, .2)
for e in evs('ignite'):
    add(fx, sub(.8), e['t'], .35, 0); add(fx, shimmer(e['d'] + 1.0), e['t'], .06 if e['c'] == 'amber' else .045, .3 if e['c'] == 'amber' else -.3)
    for i in range(5): add(fx, chime(SC[3 + i] + (12 if e['c'] == 'amber' else 0), 1.2), e['t'] + i * e['d'] / 5, .035, -.4 + .2 * i)
for e in evs('whoosh'): add(fx, lp(whoosh(e['d']), 1600) * .14 * e['v'], e['t'], 1, 0)
for e in evs('tear'):
    d = e['d'] + .6; t = tt(d); nz = noise(d); x = (lp(nz, 300) * (1 - t / d) + lp(nz, 1500) * (t / d)) * np.sin(np.pi * t / d) ** .6
    add(fx, x * .30, e['t'], 1, 0); add(fx, sub(1.0), e['t'], .3, 0)
for a, b in HUSH:
    d = b - a; t = tt(d); add(fx, lp(noise(d), 260) * .05 * np.minimum(1, t / 1) * np.minimum(1, (d - t) / 1), a, 1, 0)
for e in evs('tick'): add(fx, pop(1.4) * .06, e['t'], 1, .2)
for e in evs('air'):
    d = e['d']; t = tt(d); x = bp(noise(d), 300, 3000) * (.6 + .4 * np.sin(2 * np.pi * .3 * t)) * np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.2)
    add(fx, x * .045, e['t'], 1, 0)
for e in evs('slab'):
    k = e['k']; m = SC[min(len(SC) - 1, k // 2)] + (0 if e['kind'] == 'gc' else 7)
    add(fx, pluck(m + 12, .6), e['t'], .12, -.35 if e['kind'] == 'gc' else .35)
for e in evs('turn'):
    add(fx, sub(1.1), e['t'], .5, 0); add(fx, timp(38), e['t'], .45, 0); add(fx, chime(74, 3.5), e['t'], .12, -.2); add(fx, chime(81, 3.5), e['t'] + .03, .09, .2)
for e in evs('end'):
    for i, m in enumerate([50, 57, 62, 65, 69]): add(mu, vib(m, 5.0), e['t'] + i * .05, .03, 0)
air = lp(noise(FULL + 1), 500) * .005
fx[:len(air), 0] += air[:N]; fx[:len(air), 1] += air[:N] * .9

fade = np.ones(N); n0 = int((FULL - 3) * SR); fade[n0:] = np.maximum(0, 1 - np.arange(N - n0) / (2.8 * SR)) ** 1.5
out = ((mu + fx) * fade[:, None])[:int(FULL * SR)]
out[:, 0] = limit(out[:, 0], .9); out[:, 1] = limit(out[:, 1], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
def stamp(s): ms = int(round(s * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(os.path.join(HERE, 'curva-corta.srt'), 'w', encoding='utf-8', newline='\n') as f:
    for i, e in enumerate(evs('narr'), 1): f.write('%d\n%s --> %s\n%s\n\n' % (i, stamp(e['t']), stamp(e['t'] + e['d']), e['text']))
with open(os.path.join(HERE, 'narracion.txt'), 'w', encoding='utf-8', newline='\n') as f:
    for e in evs('narr'): f.write(e['text'] + '\n')
print('mix.wav %.1f s · %d eventos · %d líneas' % (FULL, len(EV), len(evs('narr'))))
