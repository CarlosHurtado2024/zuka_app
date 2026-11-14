"""Sonido de «¿Por qué el 14 de marzo?» (Caption News): música y efectos sintetizados con numpy, sin voz.

Lee events.json. 120 ppm. Gancho y planteamiento en la menor (Am–F–G–Am): bombo en el pulso, platillos a contratiempo, bajo
en corcheas, marimba en semicorcheas. Corte seco al silencio en el congelado (solo un platillo suspendido que crece al
final); el giro (3/14) cae en un acorde de do mayor con metales, platillo y campanitas; luego do mayor (C–G–Am–F) con
vibráfono a contratiempo y palmas. Medio tiempo bajo el documento. Medio segundo de silencio y un acorde de la mayor con
campanas en el veredicto; la tarjeta final sostiene la mayor y se apaga.
Efectos: golpe de cada bloque (clic + golpe grave), traqueteo de contadores, silbidos, obturador, sello, rotulador, papel.
Escribe out/mix.wav, dia-pi.srt y narracion.txt.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, limit, whoosh, pop

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
FULL = float(D['dur']); EV = D['ev']; N = int(FULL * SR) + SR
rng = np.random.default_rng(314)
BEAT = .5; BAR = 2.0
def evs(k): return [e for e in EV if e['type'] == k]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(round(d * SR))) / SR
def noise(d): return rng.standard_normal(int(round(d * SR)))
def env(t, a, d): return np.minimum(1, t / a) * np.exp(-t / d)
def saw(f, t): return 2 * ((f * t) % 1.0) - 1

def kick(v=1.0):
    t = tt(.35); f = 50 + 110 * np.exp(-t / .03); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .12) * v
def hat(v=1.0): t = tt(.05); return hp(noise(.05), 8000) * np.exp(-t / .01) * v
def clap(v=1.0):
    t = tt(.22); e = sum(np.exp(-np.maximum(0, t - k * .01) / .007) * (t >= k * .01) for k in range(3)) + .4 * np.exp(-t / .05)
    return bp(noise(.22), 900, 5000) * e * v
def bass(m, d=.24):
    t = tt(d); f = hz(m); return lp(np.tanh(2 * np.sin(2 * np.pi * f * t)) + .3 * saw(f, t), 900) * env(t, .004, .14)
def marimba(m, d=.3):
    t = tt(d); f = hz(m); return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / .02)) * env(t, .002, .09)
def vib(m, d=.6):
    t = tt(d); f = hz(m); return np.sin(2 * np.pi * f * t) * (1 + .2 * np.sin(2 * np.pi * 6 * t)) * env(t, .004, .35)
def glock(m, d=1.2):
    t = tt(d); f = hz(m); return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / .15)) * env(t, .001, .45)
def brass(ms, d=1.2):
    t = tt(d); x = sum(lp(saw(hz(m), t) + .5 * saw(hz(m) * 1.003, t), 2200) for m in ms) / len(ms)
    return x * np.minimum(1, t / .02) * np.exp(-t / (d * .5))
def pad(ms, d):
    t = tt(d); x = sum(lp(saw(hz(m), t) + saw(hz(m) * 1.004, t), 1200) for m in ms) / (2 * len(ms))
    return x * np.minimum(1, t / .5) * np.minimum(1, (d - t) / .5)
def cymbal(d=1.5, swell=False):
    t = tt(d); x = hp(noise(d), 4000) + .5 * bp(noise(d), 2000, 6000)
    return x * (np.minimum(1, t / d) ** 2 if swell else np.exp(-t / (d * .4)) * np.minimum(1, t / .003))
def timp(m, v=1.0):
    t = tt(1.4); f = hz(m) * (1 + .03 * np.exp(-t / .05)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .45) * v

def stereo(x, pan=0.0): return np.stack([x * np.sqrt((1 - pan) / 2), x * np.sqrt((1 + pan) / 2)], 1)
def put(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR); n = min(len(x), N - i)
    if n > 0 and i >= 0: buf[i:i + n] += stereo(x[:n], pan) * g

SIL = [(e['t'], e['t'] + e['d']) for e in evs('silence')]
def silent(t): return any(a - .01 <= t < b for a, b in SIL)
TURN = next(e['t'] for e in evs('hit'))                    # el giro: 3/14
DOC = next(e['t'] for e in evs('paper'))                   # el documento: medio tiempo
VERD = [e['t'] for e in evs('hit') if e.get('major')][0]   # el veredicto
END = evs('end')[0]['t']
A_MIN = [(45, [57, 60, 64]), (41, [57, 60, 65]), (43, [55, 59, 62]), (45, [57, 60, 64])]
C_MAJ = [(48, [55, 60, 64]), (43, [55, 59, 62]), (45, [57, 60, 64]), (41, [57, 60, 65])]
OST = [0, 7, 12, 7, 3, 7, 12, 15]

mu = np.zeros((N, 2))
for b in range(int(FULL / BAR) + 1):
    t0 = b * BAR
    if t0 >= END: break
    prog = A_MIN if t0 < TURN else C_MAJ
    root, ch = prog[b % 4]
    half = DOC <= t0 < DOC + 5
    for i in range(16):
        t = t0 + i * BEAT / 4
        if silent(t) or t >= END or (VERD - .01 <= t < VERD + 6.5 and t < END): continue
        if i % 4 == 0 and (not half or i % 8 == 0): put(mu, kick(), t, .5, 0)
        if i % 4 == 2: put(mu, hat(), t, .08, .3)
        if i % 2 == 0 and not half: put(mu, bass(root + (12 if i % 8 == 6 else 0), .22), t, .17, 0)
        if half and i % 8 == 0: put(mu, bass(root, .9), t, .2, 0)
        if not half and t > .5: put(mu, marimba(root + 24 + OST[i % 8], .25), t, .06, -.4 if i % 2 else .2)
        if t >= TURN and i in (2, 6, 10, 14) and not half: put(mu, vib(ch[(i // 4) % 3] + 12), t, .05, .4)
        if t >= TURN and i in (4, 12) and not half: put(mu, clap(), t, .08, -.1)
# el gancho: golpe en el cuadro 4
put(mu, kick(1.2), .13, .6, 0); put(mu, timp(45), .13, .6, 0); put(mu, brass([57, 64, 69]), .13, .14, 0); put(mu, cymbal(1.6), .13, .1, .2)
# el congelado: un platillo suspendido que crece al final del silencio
a, b = SIL[0]; put(mu, cymbal(1.2, swell=True), b - 1.2, .07, 0)
# el giro: do mayor con metales, platillo y campanitas
put(mu, brass([48, 55, 60, 64, 67], 1.6), TURN, .2, 0); put(mu, cymbal(2.0), TURN, .14, .2); put(mu, timp(48), TURN, .4, 0)
for i, m in enumerate([72, 76, 79, 84]): put(mu, glock(m), TURN + i * .12, .07, -.3 + .2 * i)
# veredicto: la mayor con metales, timbal y campanas
put(mu, brass([45, 52, 57, 61, 64], 2.4), VERD, .24, 0); put(mu, timp(45), VERD, .45, 0); put(mu, cymbal(2.4), VERD, .12, 0)
for i, m in enumerate([69, 73, 76, 81]): put(mu, glock(m, 2.0), VERD + .5 + i * .5, .07, -.2 + .15 * i)
put(mu, pad([57, 61, 64], VERD + 6.5 - VERD - .5), VERD + .3, .12, 0)
# tarjeta final
put(mu, pad([45, 57, 61, 64], FULL - END + .5), END, .14, 0)
for i, m in enumerate([69, 73, 76, 81]): put(mu, glock(m, 2.4), END + .3 + i * .45, .07, -.3 + .2 * i)

fx = np.zeros((N, 2))
for e in evs('slam'):
    g = e.get('big', 1); c = tt(.03); put(fx, hp(noise(.03), 3000) * np.exp(-c / .004), e['t'], .12 * g, .1); put(fx, kick(.6), e['t'], .18 * g, 0)
for e in evs('rattle'):
    for i in range(int(e['d'] / .045)): put(fx, pop(2.0) * .5, e['t'] + i * .045, .05, .3 if i % 2 else -.3)
for e in evs('whoosh'): put(fx, lp(whoosh(.35), 2500), e['t'] - .1, .12, .2)
for e in evs('sting'): put(fx, lp(whoosh(.5), 3000), e['t'] - .1, .16, 0)
for e in evs('tick'): put(fx, pop(1.5), e['t'], .06, .3)
for e in evs('shutter'):
    c = tt(.08); x = hp(noise(.08), 2000) * (np.exp(-c / .006) + .7 * np.exp(-np.maximum(0, c - .045) / .008) * (c > .045)); put(fx, x, e['t'], .25, 0)
for e in evs('ding'): put(fx, glock(84, .9), e['t'], .06, .3)
for e in evs('pop'): put(fx, pop(1.0), e['t'], .08, -.2)
for e in evs('stamp'): put(fx, kick(1.0), e['t'], .32, 0); put(fx, .4 * lp(noise(.2), 800) * np.exp(-tt(.2) / .03), e['t'], .32, 0)
for e in evs('swipe'): put(fx, bp(noise(e['d'] + .1), 1500, 6000) * np.sin(np.pi * tt(e['d'] + .1) / (e['d'] + .1)), e['t'], .05, .3)
for e in evs('draw'):
    d = e['d']; t = tt(d); put(fx, bp(noise(d), 600, 3000) * (.6 + .4 * np.sin(2 * np.pi * 9 * t)) * np.minimum(1, t / .1) * np.minimum(1, (d - t) / .1), e['t'], .03, 0)
for e in evs('paper'): put(fx, bp(noise(.4), 800, 7000) * np.exp(-tt(.4) / .12), e['t'], .1, -.2)
for e in evs('marker'):
    d = e['d']; t = tt(d); f = 2400 + 400 * np.sin(2 * np.pi * 5 * t); put(fx, (bp(noise(d), 2500, 6000) * .7 + .15 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.sin(np.pi * t / d), e['t'], .05, .2)
for e in evs('end'): put(fx, lp(whoosh(.6), 2000), e['t'] - .1, .12, 0)

out = mu + fx
fade = np.ones(N); n0 = int((FULL - 2.5) * SR); fade[n0:] = np.maximum(0, 1 - np.arange(N - n0) / (2.4 * SR)) ** 1.5
out *= fade[:, None]
for a, b in SIL: out[int(a * SR):int(b * SR)] *= 0
put(out, cymbal(1.2, swell=True), SIL[0][1] - 1.2, .07, 0)          # el platillo que crece sí suena dentro del silencio largo
for e in evs('shutter'):                                              # y el obturador del congelado también
    c = tt(.08); put(out, hp(noise(.08), 2000) * (np.exp(-c / .006) + .7 * np.exp(-np.maximum(0, c - .045) / .008) * (c > .045)), e['t'], .25, 0)
out = out[:int(FULL * SR)]
out[:, 0] = limit(out[:, 0], .9); out[:, 1] = limit(out[:, 1], .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
def stamp(s): ms = int(round(s * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(os.path.join(HERE, 'dia-pi.srt'), 'w', encoding='utf-8', newline='\n') as f:
    for i, e in enumerate(evs('narr'), 1): f.write('%d\n%s --> %s\n%s\n\n' % (i, stamp(e['t']), stamp(e['t'] + e['d']), e['text']))
with open(os.path.join(HERE, 'narracion.txt'), 'w', encoding='utf-8', newline='\n') as f:
    for e in evs('narr'): f.write(e['text'] + '\n')
print('mix.wav %.1f s · %d eventos · %d líneas' % (FULL, len(EV), len(evs('narr'))))
