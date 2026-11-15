"""Sonido de «¿Cómo se mide el universo?» (Radar Sweep Documentary): todo sintetizado con numpy, sin voz.

Lee events.json. 80 ppm, re menor. Contrabajo en re y la sostenido toda la película, vibráfono con arco en quinta abierta
bajo el título, glockenspiel cuando aparecen las estrellas. Cada empujón del barrido = una ráfaga de aire; cada ping = un
sonar limpio con dos ecos. El láser = pitido corto y portadora grave. En el paralaje los chelos aprietan (re → fa → mi♭)
y en el giro (4.2 años luz) suena el único acorde brillante (re mayor). La cefeida late con un pulso de vibráfono; la onda
del corrimiento al rojo es una portadora que baja. Dos casi silencios (antes del giro y en la moneda) son ceros de verdad.
Escribe out/mix.wav, distancias.srt y narracion.txt.
"""
import json, os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, limit

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'events.json'), encoding='utf-8'))
FULL = float(D['dur']); EV = D['ev']; N = int(FULL * SR) + SR
rng = np.random.default_rng(31)
def evs(k): return [e for e in EV if e['type'] == k]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(round(d * SR))) / SR
def noise(d): return rng.standard_normal(int(round(d * SR)))
def stereo(x, pan=0.0): return np.stack([x * np.sqrt((1 - pan) / 2), x * np.sqrt((1 + pan) / 2)], 1)
def put(buf, x, t, g=1.0, pan=0.0):
    if t < 0: x = x[int(-t * SR):]; t = 0
    i = int(t * SR); n = min(len(x), N - i)
    if n > 0: buf[i:i + n] += stereo(x[:n], pan) * g
def swell(d, a=.8, r=1.2):
    t = tt(d); return np.minimum(1, t / a) * np.minimum(1, np.maximum(0, d - t) / r)

def strings(ms, d, v=1.0, bright=1800):        # cuerdas con arco: sierras desafinadas, filtradas, vibrato lento
    t = tt(d); x = 0
    for m in ms:
        for det in (-.07, 0, .08):
            f = hz(m) * 2 ** (det / 12) * (1 + .003 * np.sin(2 * np.pi * 5.1 * t + m))
            ph = np.cumsum(f) / SR; x = x + (2 * (ph % 1) - 1)
    return lp(x / (3 * len(ms)), bright) * swell(d) * v
def vibes(ms, d, v=1.0, bow=True):              # vibráfono: parciales 1, 4, 10 con trémolo
    t = tt(d); x = 0
    for m in ms:
        f = hz(m); x = x + np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / .4) + .08 * np.sin(2 * np.pi * 10 * f * t) * np.exp(-t / .1)
    e = swell(d, .5, 1.0) if bow else np.exp(-t / 1.1) * np.minimum(1, t / .003)
    return x / len(ms) * e * (1 + .25 * np.sin(2 * np.pi * 5.5 * t)) * v
def glock(m, v=1.0):
    t = tt(1.6); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / .15)) * np.exp(-t / .55) * np.minimum(1, t / .002) * v
def sonar(f=1150, v=1.0):                       # ping limpio con dos ecos más suaves
    t = tt(2.0); x = np.zeros(len(t))
    for k, (dt, g) in enumerate([(0, 1), (.36, .35), (.74, .14)]):
        i = int(dt * SR); s = t[:len(t) - i]
        x[i:] += np.sin(2 * np.pi * f * s) * np.exp(-s / .28) * np.minimum(1, s / .004) * g
    return x * v
def air(d=.6, v=1.0):                           # empujón del barrido
    t = tt(d); return bp(noise(d), 300, 2600) * np.sin(np.pi * t / d) ** 2 * v
def ring(v=1.0):                                # golpe metálico cuando una lectura queda fija
    t = tt(1.4); x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / dd) * a for f, dd, a in [(523, .9, 1), (1307, .4, .5), (2210, .2, .3), (3480, .1, .2)])
    return x * np.minimum(1, t / .002) * v
def click(v=1.0):
    t = tt(.03); return hp(noise(.03), 3000) * np.exp(-t / .004) * v
def sub(f0=48, d=1.2, v=1.0):
    t = tt(d); f = f0 + 40 * np.exp(-t / .05); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (d * .4)) * v

SIL = [(e['t'], e['t'] + e['d']) for e in evs('silence')]
mu = np.zeros((N, 2)); fx = np.zeros((N, 2))
narr = evs('narr'); T_TURN = evs('turn')[0]['t']
# lecho: contrabajo D2 + A2 de principio a fin (respira en cada toma)
put(mu, strings([26 + 12, 33 + 12], FULL, 1.0, 600), 0, .10, 0)
# título: vibráfono con arco en quinta abierta; glockenspiel cuando aparecen las estrellas
put(mu, vibes([62, 69], 7.5), 1.0, .07, -.2)
for e in evs('glock'): put(mu, glock([74, 77, 81, 86, 81, 84][e['n'] % 6]), e['t'], .05, -.5 + .2 * e['n'])
# la Luna: un tapete quieto
put(mu, strings([50, 57, 62], 14, 1.0, 1200), 9.2, .05, .1)
# paralaje: los chelos aprietan hasta el giro (re → fa → mi♭), luego el acorde brillante
for m, a, b in [(50, 24.4, 30.4), (53, 30.2, 36.2), (51, 36.0, T_TURN - .1)]:
    put(mu, strings([m, m + 7], b - a + .8, 1.0, 1500), a, .07, -.15)
put(mu, strings([62, 66, 69, 74], 5.5, 1.0, 3200), T_TURN, .08, -.25)
put(mu, strings([38, 50], 5.5, 1.0, 900), T_TURN, .09, 0)
put(mu, vibes([74, 78, 81], 4.5), T_TURN, .08, .25)
for i, m in enumerate([86, 90, 93, 98]): put(mu, glock(m), T_TURN + .15 + i * .12, .05, -.3 + .2 * i)
# velas estándar: cuerdas medias; la cefeida late con un pulso de vibráfono
put(mu, strings([50, 57, 60], 8.5, 1.0, 1400), 50.2, .05, 0)
for e in evs('beat'): put(mu, vibes([62, 69], .9, bow=False), e['t'], .07, .2); put(mu, sub(46, .8), e['t'], .12, 0)
# corrimiento al rojo: la portadora baja mientras la onda se estira; pulso de vibráfono que se vuelve más denso
for e in evs('carrier'):
    d = e['d'] + 1.5; t = tt(d); f = 220 * 2 ** (-.35 * t / d)
    put(fx, np.sin(2 * np.pi * np.cumsum(f) / SR) * swell(d, .4, .8), e['t'], .05, 0)
c5 = [e['t'] for e in evs('ping') if e.get('k') == 'gal'][0]
k = 0; t0 = c5 + 1.5
while t0 < c5 + 14:
    put(mu, vibes([[62, 69], [65, 72], [64, 69]][k % 3], .5, bow=False), t0, .045, .3 if k % 2 else -.3)
    t0 += .75 if t0 < c5 + 6 else .375; k += 1
put(mu, strings([53, 60, 64], 14, 1.0, 1300), c5 + .3, .05, -.1)
# la escalera: una nota de glockenspiel por escalón (sube), y el final: re mayor que respira y resuelve
for e in evs('rung'): put(mu, glock([74, 78, 81, 86][e['n']]), e['t'], .07, -.3 + .2 * e['n'])
for e in evs('end'):
    put(mu, strings([50, 57, 62, 66, 69], FULL - e['t'], 1.0, 2400), e['t'], .07, 0)
    put(mu, vibes([62, 69, 74], FULL - e['t']), e['t'] + .3, .06, .2)

# efectos
for e in evs('surge'): put(fx, air(.6), e['t'] - .1, .12, .3)
for e in evs('wipe'): put(fx, air(e['d'] + .3), e['t'] - .05, .2, 0); put(fx, hp(noise(.4), 4000) * np.exp(-tt(.4) / .12), e['t'] + e['d'] * .7, .03, 0)
pan = {'earth': 0, 'star': .35, 'moon': .3, 'back': -.2, 'src': 0, 'gal': 0}
for e in evs('ping'): put(fx, sonar(1150 if e['k'] != 'star' else 1480), e['t'], .16, pan.get(e['k'], 0))
for e in evs('laser'):
    put(fx, np.sin(2 * np.pi * 2525 * tt(.25)) * np.minimum(1, tt(.25) / .005) * np.minimum(1, (.25 - tt(.25)) / .01), e['t'], .05, .3)
    d = 2.8; t = tt(d); put(fx, np.sin(2 * np.pi * 110 * t) * swell(d, .1, .4), e['t'], .05, 0)
for e in evs('lock'): put(fx, ring(), e['t'], .06, .15); put(fx, sub(52, .9), e['t'], .12, 0)
for e in evs('tick'): put(fx, click(), e['t'], .2, .2)
for e in evs('cut'): put(fx, sub(44, 1.0), e['t'], .25, 0); put(fx, click(1.5), e['t'], .3, 0)
for e in evs('orbit'):
    d = e['d']; t = tt(d); put(fx, bp(noise(d), 200, 900) * np.sin(np.pi * t / d), e['t'], .06, 0)
for e in evs('arrive'): put(fx, ring(), e['t'] + .8, .07, .3); put(fx, glock(81), e['t'] + .8, .05, .3)
# fondo: un siseo de radio muy suave (en el espacio no hay viento)
fx += np.stack([lp(noise(FULL + 1), 1800)[:N], lp(noise(FULL + 1), 1800)[:N]], 1) * .003

out = mu + fx
fade = np.ones(N); n0 = int((FULL - 3.0) * SR); fade[n0:] = np.maximum(0, 1 - np.arange(N - n0) / (2.9 * SR)) ** 1.5
out *= fade[:, None]
for a, b in SIL: out[int(a * SR):int(b * SR)] = 0                # silencio digital de verdad
out = out[:int(FULL * SR)]
out[:, 0] = limit(out[:, 0], .9); out[:, 1] = limit(out[:, 1], .9)
for a, b in SIL: out[int(a * SR):int(b * SR)] = 0
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), out.astype(np.float32), SR)
def stamp(s): ms = int(round(s * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(os.path.join(HERE, 'distancias.srt'), 'w', encoding='utf-8', newline='\n') as f:
    for i, e in enumerate(narr, 1): f.write('%d\n%s --> %s\n%s\n\n' % (i, stamp(e['t']), stamp(e['t'] + e['d']), e['text']))
with open(os.path.join(HERE, 'narracion.txt'), 'w', encoding='utf-8', newline='\n') as f:
    for e in narr: f.write(e['text'] + '\n')
print('mix.wav %.1f s · %d eventos · %d líneas' % (FULL, len(EV), len(narr)))
