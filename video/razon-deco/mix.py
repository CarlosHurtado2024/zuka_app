"""Sonido de «La razón que no cambia» (Art Deco): foxtrot sinfónico y efectos, todo sintetizado con numpy.

Lee events.json (exportado de index.html). Fa mayor, 120 ppm (pulso 0.5 s, compás 2 s): piano de zancada, contrabajo
pizzicato caminante, escobillas, clarinete (el tema se planta por fragmentos y suena entero en la jeringa) y campanas
tubulares para la luz contada. Silencio de 60 a 64.6 s: solo reloj y una gota. No lleva voz.
Escribe out/mix.wav (48 kHz estéreo) y razon-deco.srt con la narración (los rótulos).
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, limit, click, clack, whoosh, thump, step, pop, crash, brown

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
FULL = float(D['dur']); EV = D['ev']; N = int(FULL * SR) + SR
rng = np.random.default_rng(5)
BEAT, BAR = 0.5, 2.0
def evs(k): return [e for e in EV if e['type'] == k]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR

# ---------------- instrumentos ----------------
def piano(m, d=1.2, v=1.0):
    t = tt(d); f = hz(m); x = 0
    for k, a in [(1, 1), (2, .45), (3, .22), (4, .12), (5, .06)]:
        x = x + a * np.sin(2 * np.pi * f * k * (1 + .0004 * k * k) * t) * np.exp(-t * (1.6 + k * .9))
    return x * np.minimum(1, t / .003) * v
def pizz(m, d=.55, v=1.0):
    t = tt(d); f = hz(m)
    x = (np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) + .25 * np.sin(6 * np.pi * f * t)) * np.exp(-t / .2)
    return x * np.minimum(1, t / .006) * v
def clar(freq, v=1.0):                       # freq: arreglo de frecuencias (permite glissando)
    n = len(freq); t = np.arange(n) / SR
    vib = 1 + .004 * np.sin(2 * np.pi * 5.3 * t) * np.minimum(1, t / .3)
    ph = 2 * np.pi * np.cumsum(freq * vib) / SR
    x = np.sin(ph) + .38 * np.sin(3 * ph) + .17 * np.sin(5 * ph) + .07 * np.sin(7 * ph)
    env = np.minimum(1, t / .05) * np.minimum(1, (n / SR - t) / .08)
    return lp(x * env, 3800) * v
def note_clar(m, d, v=1.0): return clar(np.full(int(d * SR), hz(m)), v)
def bell(m, d=3.0, v=1.0):
    t = tt(d); f = hz(m); x = 0
    for r, a, tau in [(1, 1, 1.6), (2.76, .5, .8), (5.4, .3, .4), (8.93, .15, .2), (.5, .25, 2.2)]:
        x = x + a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / tau)
    return x * np.minimum(1, t / .002) * v
def harp(m, v=1.0):
    t = tt(1.2); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / .35) * np.minimum(1, t / .002) * v
def brush(d=.22, v=1.0):
    n = int(d * SR); x = bp(rng.standard_normal(n), 2500, 9000, 2)
    return x * np.sin(np.pi * np.arange(n) / n) ** 2 * v

# ---------------- armonía y tema ----------------
F4, A4, B4b, C5, D5, E5, F5, G5 = 65, 69, 70, 72, 74, 76, 77, 79
CH = {'F6': (41, [57, 60, 62, 65]), 'Dm7': (38, [57, 60, 62, 65]), 'Gm7': (43, [58, 62, 65, 67]), 'C7': (36, [58, 60, 64, 67])}
PROG = ['F6', 'Dm7', 'Gm7', 'C7']
WALK = {'F6': [41, 45, 48, 50], 'Dm7': [38, 41, 45, 43], 'Gm7': [43, 46, 50, 47], 'C7': [36, 40, 43, 40]}
THEME = [[(A4, 0, 1), (C5, 1, .5), (D5, 1.5, .5), (F5, 2, 1.5)],
         [(E5, 0, .5), (D5, .5, .5), (C5, 1, 1), (A4, 2, 2)],
         [(B4b, 0, 1), (D5, 1, 1), (F5, 2, .5), (E5, 2.5, .5), (D5, 3, 1)],
         [(C5, 0, 1), (E5, 1, 1), (G5, 2, 2)]]
MUTE = [(e['t'], e['t'] + e['d']) for e in evs('mute')]
def muted(t): return any(a - .02 <= t < b for a, b in MUTE)

mu = np.zeros((N, 2))
for b in range(int(FULL // BAR)):
    t0 = b * BAR; c = PROG[b % 4]; root, tones = CH[c]
    if t0 < 2.0 or t0 >= 88: continue
    hosp = 64.6 <= t0 < 74         # regla de tres: solo contrabajo y escobillas
    coda = t0 >= 82
    for i in range(4):
        t = t0 + i * BEAT
        if muted(t): continue
        add(mu, pizz(WALK[c][i]), t, .34 if not coda else .22, -.15)
        add(mu, brush(v=1.0 if i % 2 else .55), t, .05, .35)
        if hosp or coda: continue
        if i % 2 == 0: add(mu, piano(root + 12, .6), t, .16, -.25)
        else:
            for k, p in enumerate(tones): add(mu, piano(p, .4), t + k * .004, .065, .1 + .05 * k)
    if coda and t0 < 86:
        for k, p in enumerate(tones): add(mu, piano(p + 12, 2.0), t0 + k * .03, .06, .2)
def theme(t0, bars, gain):
    for bi in range(bars):
        for m, a, d in THEME[bi]: add(mu, note_clar(m, d * BEAT * .96), t0 + bi * BAR + a * BEAT, gain, .15)
theme(14.0, 2, .10); theme(26.0, 3, .11); theme(50.0, 4, .11)
# la jeringa: glissando de clarinete con el émbolo (fa3 → fa5) y el tema entero al llegar
pl = evs('plunger')[0]; n = int(pl['d'] * SR); k = np.linspace(0, 1, n)
add(mu, clar(hz(53) * 2 ** (24 / 12 * (k ** 1.6))), pl['t'], .12, .1)
theme(78.0, 4, .15)
add(mu, note_clar(F5, 3.0), 86.0, .10, .1)
for e in evs('bulb'): add(mu, bell([77, 79, 81, 84, 86, 89, 91][min(6, e['n'])], 2.4), e['t'], .10, -.2 + .1 * e['n'])
for e in evs('bell'): add(mu, bell([65, 69, 72, 74, 77, 81][e['n']], 3.5), e['t'], .12, 0)
for e in evs('gliss'):
    sc = [53, 57, 60, 62, 65, 69, 72, 74, 77, 81]
    for i, m in enumerate(sc): add(mu, harp(m), e['t'] + i * e['d'] / len(sc), .07, -.4 + .08 * i)
for e in evs('rise'):
    for i, m in enumerate([65, 69, 72, 77, 81]): add(mu, harp(m), e['t'] + i * .06, .06, 0)
for e in evs('hit'):
    for k, p in enumerate([53, 65, 69, 72, 77]): add(mu, piano(p, 2.5), e['t'] + k * .01, .12, 0)
for e in evs('clang'):
    add(mu, bell(53, 4.0), e['t'], .2, 0); add(mu, piano(41, 2.5), e['t'], .25, 0)
# el final: la música se va con las luces
fade = np.ones(N); n0 = int(87.5 * SR); fade[n0:] = np.maximum(0, 1 - np.arange(N - n0) / (2.2 * SR)) ** 1.4
mu *= fade[:, None]

# ---------------- efectos ----------------
fx = np.zeros((N, 2))
def hiss(d, lo=3000, hi=8000):
    n = int(d * SR); x = bp(rng.standard_normal(n), lo, hi, 2)
    return x * np.sin(np.pi * np.arange(n) / n) ** 1.5
def scrape(d):
    n = int(d * SR); x = lp(bp(rng.standard_normal(n), 300, 2400, 2), 1800)
    return x * np.sin(np.pi * np.arange(n) / n) * (.7 + .3 * np.sin(np.arange(n) / SR * 2 * np.pi * 23))
for e in evs('draw'): add(fx, hiss(e['d']) * .05, e['t'], 1, 0)
for e in evs('clang'): add(fx, crash() * .12, e['t'], 1, 0)
for e in evs('bulb'): add(fx, hp(click(pitch=.7), 900) * .10, e['t'], 1, -.2 + .1 * e['n']); add(fx, thump(f=90) * .06, e['t'], 1, 0)
for e in evs('swoosh'): add(fx, lp(whoosh(.5), 2200) * .16, e['t'], 1, 0)
for e in evs('chunk'): add(fx, thump(f=58) * .45, e['t'], 1, 0); add(fx, clack(pitch=.45) * .22, e['t'], 1, 0)
for e in evs('swell'): add(fx, hiss(e['d'], 800, 4000) * np.linspace(.2, 1.2, int(e['d'] * SR)) ** 2 * .08, e['t'], 1, 0)
for e in evs('flash'): add(fx, crash() * .10, e['t'], 1, 0)
for e in evs('slide'): add(fx, scrape(e['d']) * .07, e['t'], 1, 0)
for e in evs('click'): add(fx, click(pitch=1.1) * .14, e['t'], 1, e['pan'])
for e in evs('settle'): add(fx, clack(pitch=1.4) * .08, e['t'], 1, 0)
for e in evs('tick'): add(fx, hp(clack(pitch=1.6), 1800) * .13, e['t'], 1, e['pan'])
for e in evs('page'): add(fx, hiss(.45, 900, 6000) * .10, e['t'], 1, .2)
for e in evs('pen'): add(fx, hiss(.25, 4000, 10000) * .03, e['t'], 1, e['pan'])
for e in evs('badge'): add(fx, crash() * .05, e['t'], 1, 0); add(fx, clack(pitch=.8) * .10, e['t'], 1, 0)
for e in evs('roll'): add(fx, lp(scrape(.7), 900) * .10, e['t'] - .2, 1, e['pan']); add(fx, clack(pitch=.7) * .14, e['t'] + .55, 1, e['pan'])
for e in evs('step'): add(fx, step() * .35, e['t'], 1, -.2 + .2 * e['n']); add(fx, hp(clack(pitch=1.2), 1500) * .05, e['t'], 1, 0)
for e in evs('drop'): add(fx, pop(1.0) * .22, e['t'] + .2, 1, 0)
for e in evs('clack'): add(fx, clack(pitch=.9) * .18, e['t'], 1, e['pan'])
for e in evs('plunger'): add(fx, lp(scrape(e['d']), 1200) * .05, e['t'], 1, 0)
for e in evs('hit'): add(fx, crash() * .10, e['t'], 1, 0); add(fx, thump(f=65) * .3, e['t'], 1, 0)
for e in evs('off'): add(fx, click(pitch=.5 + .1 * e['n']) * .14, e['t'], 1, 0); add(fx, thump(f=50) * .08, e['t'], 1, 0)
for e in evs('last'): add(fx, bell(53, 4.0) * .12, e['t'], 1, 0)
# sala: un ruido grave casi inaudible (en el silencio es lo único que queda junto al reloj)
bed = lp(brown(FULL + 1), 300) * .012; fx[:len(bed), 0] += bed[:N]; fx[:len(bed), 1] += bed[:N]

out = (mu + fx)[:int(FULL * SR)]
out[:, 0] = limit(out[:, 0], .9); out[:, 1] = limit(out[:, 1], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)

def stamp(s): ms = int(round(s * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(os.path.join(HERE, 'razon-deco.srt'), 'w', encoding='utf-8', newline='\n') as f:
    for i, e in enumerate(evs('narr'), 1): f.write('%d\n%s --> %s\n%s\n\n' % (i, stamp(e['t']), stamp(e['t'] + e['d']), e['text']))
with open(os.path.join(HERE, 'narracion.txt'), 'w', encoding='utf-8', newline='\n') as f:
    for e in evs('narr'): f.write(e['text'] + '\n')
print('mix.wav %.1f s · %d eventos · %d líneas' % (FULL, len(EV), len(evs('narr'))))
