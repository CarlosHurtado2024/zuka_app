"""Sonido de «La IA está hecha de álgebra» (Sci-fi Hologram HUD): música y efectos sintetizados con numpy.

Lee events.json. 120 ppm (compás 2 s), la menor: Am – F – C – G. Colchón de sierras desafinadas, bajo cuadrado en
corcheas, arpegio de sierra en semicorcheas con eco de lado a lado, platillos y palmas sintéticos. Fijar un valor = golpe
grave + clac + doble pitido en la tonalidad; rodar números = un tic por cuadro; escaneo = barrido de luz; cada paso de la
montaña = una nota grave que baja; medio tiempo en la sigmoide; medio segundo de silencio digital antes de la montaña;
caída (808 + acorde ancho) cuando aparece; tono sostenido bajo el 91 %. Zumbido del proyector todo el tiempo.
Escribe out/mix.wav, ia-algebra.srt y narracion.txt.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, limit, whoosh, pop

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
FULL = float(D['dur']); EV = D['ev']; N = int(FULL * SR) + SR
rng = np.random.default_rng(25)
BEAT = .5; BAR = 2.0
def evs(k): return [e for e in EV if e['type'] == k]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(round(d * SR))) / SR
def noise(d): return rng.standard_normal(int(round(d * SR)))
def env(t, a, d): return np.minimum(1, t / a) * np.exp(-t / d)

def saw(f, t):
    ph = (f * t) % 1.0; return 2 * ph - 1
def sq(f, t): return np.sign(np.sin(2 * np.pi * f * t))
def pad(ms, d, v=1.0):
    t = tt(d); x = 0
    for m in ms:
        for det in (-.11, 0, .13): x = x + saw(hz(m) * 2 ** (det / 12), t)
    return lp(x / (3 * len(ms)), 1400) * np.minimum(1, t / .6) * np.minimum(1, (d - t) / .6) * v
def bass(m, d=.24, v=1.0):
    t = tt(d); return lp(sq(hz(m), t) * .6 + saw(hz(m), t) * .4, 700) * env(t, .004, .12) * v
def arp(m, d=.2, v=1.0):
    t = tt(d); x = saw(hz(m), t) + .4 * sq(hz(m) * 2, t)
    return hp(lp(x, 3200), 300) * env(t, .002, .07) * v
def hat(v=1.0):
    t = tt(.06); return hp(noise(.06), 7000) * np.exp(-t / .012) * v
def clap(v=1.0):
    t = tt(.25); x = hp(noise(.25), 900); e = sum(np.exp(-np.maximum(0, t - k * .011) / .008) * (t >= k * .011) for k in range(3)) + .5 * np.exp(-t / .06)
    return lp(x * e, 6000) * v
def sub(f0=55, d=.9, v=1.0):
    t = tt(d); f = f0 + 70 * np.exp(-t / .04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (d * .4)) * v
def glide(d=1.6, v=1.0):                     # 808 que baja
    t = tt(d); f = 110 * 2 ** (-1.0 * np.minimum(1, t / .6))
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t / .9) * v
def blip(m, d=.12, v=1.0):                   # FM en la tonalidad
    t = tt(d); f = hz(m); return np.sin(2 * np.pi * f * t + 2.0 * np.exp(-t / .03) * np.sin(2 * np.pi * f * 2 * t)) * env(t, .002, .05) * v
def sweep(f0, f1, d, v=1.0):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 1.5 * v

def stereo(x, pan=0.0): return np.stack([x * np.sqrt((1 - pan) / 2), x * np.sqrt((1 + pan) / 2)], 1)
def put(buf, x, t, g=1.0, pan=0.0):
    if t < 0: x = x[int(-t * SR):]; t = 0
    i = int(t * SR); n = min(len(x), N - i)
    if n > 0: buf[i:i + n] += stereo(x[:n], pan) * g

CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]      # Am F C G
ROOT = [45, 41, 48, 43]
SC = [69, 72, 74, 76, 79, 81, 84, 86, 88]                          # la menor pentatónica
SIL = [(e['t'], e['t'] + e['d']) for e in evs('silence')]
def silent(t): return any(a - .01 <= t < b for a, b in SIL)
HALF = (36.0, 45.0)                                                 # medio tiempo en la sigmoide

mu = np.zeros((N, 2)); dl = np.zeros((N, 2))
nb = int(FULL / BAR) + 1
for b in range(nb):
    t0 = b * BAR; ch = CH[b % 4]; r = ROOT[b % 4]
    if t0 >= FULL - .5: break
    pv = .10 if t0 < 84 else .07
    put(mu, pad(ch, BAR + .8), t0, pv, -.2); put(mu, pad([m + 12 for m in ch], BAR + .8), t0, pv * .5, .2)
    half = HALF[0] <= t0 < HALF[1]
    for i in range(8):                                              # bajo en corcheas (negras en medio tiempo)
        t = t0 + i * BEAT / 2
        if t < 10 or t > FULL - 6 or silent(t) or (half and i % 2): continue
        if 64 <= t < 67.4: continue
        put(mu, bass(r - 12 + (12 if i % 4 == 3 else 0), .22), t, .16, 0)
    for i in range(16):                                             # arpegio
        t = t0 + i * BEAT / 4
        on = (22 <= t < 36) or (56 <= t < 64) or (67.6 <= t < 84)
        if not on or silent(t): continue
        m = (ch + [m + 12 for m in ch])[[0, 1, 2, 3, 4, 5, 4, 2][i % 8]] + 12
        put(dl, arp(m, .18), t, .05, -.5 if i % 2 else .5)
    for i in range(8):                                              # platillos y palmas
        t = t0 + i * BEAT / 2
        if silent(t): continue
        if (22 <= t < 46) or (50 <= t < 64) or (67.6 <= t < 84): put(mu, hat(), t, .05 if i % 2 else .03, .3)
        if i in (2, 6) and ((28 <= t < 36) or (56 <= t < 64) or (70 <= t < 82)): put(mu, clap(), t, .09, -.1)
# eco de lado a lado (3/16) para el arpegio
dly = int(.375 * SR); echo = np.zeros_like(dl); echo[dly:, 0] = dl[:-dly, 1] * .45; echo[2 * dly:, 1] = dl[:-2 * dly, 0] * .3
mu += dl + echo
# caída: 808 + acorde ancho
for e in evs('drop'):
    put(mu, glide(1.8), e['t'], .5, 0); put(mu, pad([45, 52, 57, 60, 64], 3.0), e['t'], .16, -.3); put(mu, pad([57, 64, 69, 72], 3.0), e['t'], .1, .3)
# tono sostenido bajo el 91 %
for e in evs('lock'):
    if e['k'] == 3 and e['t'] > 65: put(mu, pad([69], 3.6) + .5 * pad([76], 3.6), e['t'] - .4, .12, 0)
# final: acorde que se apaga
for e in evs('outro'): put(mu, pad([45, 52, 57, 60, 64, 69], 3.4), e['t'], .14, 0)

fx = np.zeros((N, 2))
for e in evs('scan'):
    d = e['d']; up = not e.get('down')
    put(fx, sweep(400 if up else 2400, 2400 if up else 300, d), e['t'], .05, 0)
    put(fx, bp(noise(d), 2000, 6000) * np.sin(np.pi * tt(d) / d) ** 2, e['t'], .02, .2)
for e in evs('lock'):
    k = e['k']; t = e['t']
    put(fx, sub(50, .7), t, .32 + .08 * k, 0)
    c = tt(.04); put(fx, hp(noise(.04), 2500) * np.exp(-c / .006), t, .14, .1)
    put(fx, blip(81, .1), t + .02, .06, .2); put(fx, blip(88, .14), t + .1, .06, .25)
    if k >= 2: put(fx, blip(93, .2), t + .19, .05, .3)
    if k >= 3: put(fx, pad([69, 76, 81], 1.6), t, .07, 0)
for e in evs('roll'):
    n = int(e['d'] * 24)
    for i in range(n): put(fx, blip(SC[(i * 3) % len(SC)] + 12, .025), e['t'] + i / 24, .022, .35 if i % 2 else -.35)
for e in evs('whip'): put(fx, lp(whoosh(e['d'] + .3), 2500), e['t'], .22, 0)
for e in evs('open'):
    d = e['d']; t = tt(d); x = bp(saw(180 + (240 if not e.get('close') else -60) * t / d, t), 200, 1800) * np.sin(np.pi * t / d)
    put(fx, x, e['t'], .05, 0); put(fx, bp(noise(.4), 800, 4000) * np.exp(-tt(.4) / .1), e['t'] + d * .8, .05, 0)
for e in evs('ping'): put(fx, blip(SC[e['n'] % len(SC)], .18), e['t'], .07, -.3 + .15 * (e['n'] % 5))
for e in evs('step'):
    k = e['k']; m = 57 - k                                        # cada paso, un semitono más abajo: el error baja
    put(fx, bass(m, .35), e['t'], .2, 0); put(fx, blip(m + 24, .08), e['t'], .04, .3); put(fx, pop(1.2) * .5, e['t'], .08, -.2)
for e in evs('ignite'):
    put(fx, sweep(200, 3200, e['d']), e['t'], .06, 0); put(fx, pad([69, 72, 76, 81], e['d'] + 1), e['t'], .06, 0)
for e in evs('attn'):
    for i in range(6): put(fx, blip(SC[(i * 2) % len(SC)] + 12, .4), e['t'] + i * .5, .035, -.5 + .2 * i)
for e in evs('dock'): put(fx, sweep(1600, 900, .12), e['t'], .05, .2)
for e in evs('end'): put(fx, sweep(1800, 120, 2.0), e['t'] + 1.6, .05, 0)
# zumbido del proyector y aire de sala
t = tt(FULL + 1); hum = (np.sin(2 * np.pi * 40 * t) + .5 * np.sin(2 * np.pi * 80 * t) + .25 * np.sin(2 * np.pi * 120 * t)) * .006
room = lp(noise(FULL + 1), 600) * .004
fx[:, 0] += (hum + room)[:N]; fx[:, 1] += (hum + room * .9)[:N]

out = mu + fx
fade = np.ones(N); n0 = int((FULL - 2.5) * SR); fade[n0:] = np.maximum(0, 1 - np.arange(N - n0) / (2.4 * SR)) ** 1.5
out *= fade[:, None]
for a, b in SIL: out[int(a * SR):int(b * SR)] = 0                # silencio digital de verdad
out = out[:int(FULL * SR)]
out[:, 0] = limit(out[:, 0], .9); out[:, 1] = limit(out[:, 1], .9)
for a, b in SIL: out[int(a * SR):int(b * SR)] = 0
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
def stamp(s): ms = int(round(s * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(os.path.join(HERE, 'ia-algebra.srt'), 'w', encoding='utf-8', newline='\n') as f:
    for i, e in enumerate(evs('narr'), 1): f.write('%d\n%s --> %s\n%s\n\n' % (i, stamp(e['t']), stamp(e['t'] + e['d']), e['text']))
with open(os.path.join(HERE, 'narracion.txt'), 'w', encoding='utf-8', newline='\n') as f:
    for e in evs('narr'): f.write(e['text'] + '\n')
print('mix.wav %.1f s · %d eventos · %d líneas' % (FULL, len(EV), len(evs('narr'))))
