"""Sonido de «¿Qué es un conjunto?» (zoom) -> out/mix.wav (48 kHz estéreo, DUR segundos exactos).
Sin voz (video de lección de Zuka). Música: percusión afinada y cuerdas pulsadas (muestras CC0), un instrumento guía
por nivel, siempre en sol mayor pentatónico. Efectos de «maquinita»: pitidos que suben por la línea de mira, clic y
campana al cerrar el anillo, soplo en cada zambullida, rebote seco de «azul». Casi silencio antes del choque y del cardinal."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ['LIB']
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, whoosh, bp, lp, t_, brown, click, clack, env_exp

S.seed(11)
EV = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EV['dur']; ev = EV['ev']; N = int(round(DUR * SR))
of = lambda k: [e for e in ev if e['type'] == k]
fx, mus = (np.zeros((N, 2), np.float32) for _ in range(2))
BEAT = 0.625

def nt(t, inst, p, dur, v, pan=0, g=1.0):
    if 0 <= t < DUR - .05: add(mus, S.note(inst, p, dur, v), t, g, pan)
def blip(f, d=.07, v=.25):
    tt = t_(d); return (np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / .004) * env_exp(d, d / 3) * v).astype(np.float32)
def servo(d, f0, f1, v=.08):
    tt = t_(d); f = f0 + (f1 - f0) * tt / d; ph = 2 * np.pi * np.cumsum(f) / SR
    x = (np.sign(np.sin(ph)) * .4 + np.sin(ph * 2) * .3) * np.sin(np.pi * tt / d) ** .6
    return (lp(bp(x, 300, 2400), 2600) * v).astype(np.float32)
def thump(f=70, d=.35, v=.5):
    return (np.sin(2 * np.pi * f * t_(d)) * env_exp(d, d / 5) * v).astype(np.float32)

# ---------------------------------------------------------------- efectos
room = lp(brown(DUR), 500) * .004; fx[:, 0] += room[:N]; fx[:, 1] += np.roll(room, 911)[:N]
# grillos muy bajos en la pradera (hasta la primera zambullida)
d0 = of('dive')[0]['t'] + 1.0; n0 = int(d0 * SR); tt = np.arange(n0) / SR
cr = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 14 * tt) > .6) * (np.sin(2 * np.pi * .7 * tt) > -.2) * .006 * np.minimum(1, (d0 - tt) / 1.0)
fx[:n0, 0] += cr.astype(np.float32); fx[:n0, 1] += np.roll(cr, 2400).astype(np.float32)
for e in of('rise'): add(fx, whoosh(.22, .5) * .25, e['t'], 1.0, 0)
for e in of('pull'): add(fx, whoosh(e['d'], .6) * .3, e['t'], 1.0, 0)
for e in of('enter'): add(fx, servo(e['d'], 220, 520), e['t'], 1.0, .5)
for e in of('light'): add(fx, click(.9, .6), e['t'], .7, -.1 + .2 * (e['i'] == 2)); nt(e['t'], 'glockenspiel', 'D6' if e['i'] == 0 else 'G6', .8, .4, 0, .35)
for e in of('lasso'):
    tt = t_(e['d']); f = 500 + 900 * tt / e['d']
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / e['d']) * .05
    add(fx, (bp(x + np.random.default_rng(3).standard_normal(len(tt)) * .02, 400, 3000)).astype(np.float32), e['t'], 1.0, 0)
for e in of('yes'): nt(e['t'], 'glockenspiel', 'B6', 1.2, .5, .1, .5); nt(e['t'] + .1, 'glockenspiel', 'D7', 1.2, .5, .1, .45)
for e in of('cloud'): add(fx, whoosh(.4, .5) * .2, e['t'], 1.0, .4)
for e in of('try'):
    for k, dt in enumerate([0, .9, 1.6, 2.4]): add(fx, servo(.5, 300 + 60 * k, 520, .05), e['t'] + dt, 1.0, .4)
for e in of('no'): add(fx, thump(110, .25, .35), e['t'], 1.0, .4); add(fx, clack(.5, .6), e['t'], .5, .4)
for e in of('puff'): add(fx, whoosh(.35, .4) * .2, e['t'], 1.0, .4)
for e in of('line'):
    n = 9
    for k in range(n): add(fx, blip(660 * 2 ** (k / 12), .06, .16), e['t'] + e['d'] * k / n, 1.0, .4 - .08 * k)
    add(fx, servo(.3, 400, 900, .06), e['t'] - .35, 1.0, .5)
for e in of('lock'):
    add(fx, click(1.3, .8), e['t'], .8, .1)
    nt(e['t'] + .02, 'glockenspiel', ['B6', 'D7', 'E7'][e['i']], 1.6, .55, .15, .5)
for e in of('dive'):
    d = e['d']; w = whoosh(d, .8); tt = t_(d); w = w[:len(tt)] * (.25 + .75 * (tt / d) ** 2)
    add(fx, (w * .5).astype(np.float32), e['t'], 1.0, 0)
    add(fx, servo(d, 180, 760, .05), e['t'], 1.0, .4)
for e in of('arrive'): add(fx, thump(), e['t'], 1.0, 0)
for e in of('pop'): add(fx, blip(520 + 130 * e['i'], .09, .22), e['t'], 1.0, .3)
for e in of('fly'): add(fx, whoosh(e['d'], .5) * .22, e['t'], 1.0, 0)
for e in of('brace'): add(fx, clack(.8, .7), e['t'], .7, -.3); add(fx, clack(.8, .7), e['t'] + .05, .7, .3)
for e in of('roll'): add(fx, servo(e['d'], 160, 260, .05), e['t'], 1.0, .6)
for e in of('hit'): add(fx, thump(95, .3, .6), e['t'], 1.0, .4); add(fx, clack(1.1, .9), e['t'], .9, .4)
for e in of('ring'): add(fx, click(1.2, .6), e['t'], .6, 0); nt(e['t'], 'glockenspiel', ['G6', 'E6', 'A6'][e['i']], 1.0, .45, 0, .4)
for e in of('tile'): add(fx, click(.8 + .05 * e['i'], .5), e['t'], .6, -.4 + .2 * e['i'])
for e in of('shake'): add(fx, servo(.4, 600, 500, .04), e['t'], 1.0, 0)
for e in of('away'): add(fx, whoosh(e['d'], .4) * .2, e['t'], 1.0, 0)
for e in of('hop'): add(fx, blip(780 + 90 * e['i'], .05, .12), e['t'], 1.0, -.4 + .2 * e['i'])
for e in of('merge'): add(fx, whoosh(e['d'], .5) * .18, e['t'], 1.0, .2 - .2 * e['i']); add(fx, blip(440, .1, .2), e['t'] + e['d'], 1.0, 0)
for e in of('slide'): add(fx, whoosh(e['d'], .4) * .14, e['t'], 1.0, 0)
for e in of('shuffle'): add(fx, servo(e['d'], 300, 600, .05), e['t'], 1.0, 0); add(fx, whoosh(e['d'], .5) * .16, e['t'], 1.0, 0)
for e in of('count'): add(fx, blip(660 * 2 ** (e['i'] * 4 / 12), .12, .25), e['t'], 1.0, -.3 + .3 * e['i'])
for e in of('card'): add(fx, thump(65, .5, .5), e['t'], 1.0, 0)
for e in of('stop'): add(fx, click(1.1, .5), e['t'], .6, 0)

# ---------------------------------------------------------------- música (sol mayor pentatónica)
def pulse(inst, t0, t1, seq, g=.5, every=1, bass=None):
    i = 0; t = t0
    while t < t1 - .05:
        nt(t, inst, seq[i % len(seq)], .5, .4 if i % 2 else .5, -.25 + .5 * (i % 2), g)
        if bass and i % 4 == 0: nt(t, 'contrabass_pizz', bass[(i // 4) % len(bass)], .7, .5, 0, .6)
        t += BEAT / 2 * every; i += 1
dv = {e['i']: e for e in of('dive')}; arr = {e['i']: e['t'] for e in of('arrive')}
# nivel 0, la pradera: colchón de vibráfono con arco y arpa
for t, p in [(0.2, 'G3'), (0.2, 'D4'), (6.0, 'G3'), (6.0, 'B3'), (12.0, 'C4'), (12.0, 'E4'), (17.0, 'A3'), (17.0, 'E4')]: nt(t, 'vibraphone_bowed', p, 5.8, .32, 0, .32)
pulse('harp', 6.2, 16.4, ['G4', 'B4', 'D5', 'B4'], .42, every=2, bass=['G2', 'G2', 'C2', 'D2'])
pulse('harp', 16.6, 20.6, ['A4', 'E4', 'A4', 'D4'], .32, every=2)               # la nube: se queda sin resolver
pulse('harp', 21.4, dv[0]['t'], ['G4', 'B4', 'D5', 'G5'], .42)
# nivel 1, el semáforo: marimba y contrabajo; casi silencio antes del choque
pulse('marimba', arr[0] + .1, 41.6, ['G4', 'D5', 'B4', 'D5'], .42, bass=['G2', 'E2', 'C2', 'D2'])
pulse('marimba', 43.4, dv[1]['t'], ['G4', 'B4', 'D5', 'B4', 'A4', 'B4'], .4, bass=['G2', 'D2'])
# nivel 2, las letras: xilófono suave y arpa
pulse('xylophone', arr[1] + .1, 64.4, ['D5', 'G5', 'E5', 'G5'], .28, every=2)
pulse('harp', arr[1] + .1, dv[2]['t'], ['G4', 'B4', 'D5', 'E5', 'D5', 'B4'], .38, bass=['G2', 'C2', 'E2', 'D2'])
pulse('xylophone', 64.8, dv[2]['t'], ['E5', 'G5', 'A5', 'G5'], .26, every=2)
# nivel 3, PAPAYA: vibráfono; se vacía antes del cardinal
pulse('vibraphone', arr[2] + .1, 100.8, ['G4', 'D5', 'B4', 'D5', 'E5', 'D5'], .36, every=2, bass=['G2', 'E2', 'C2', 'D2'])
for e in of('card'):
    for p, pan in [('G4', -.2), ('B4', .2), ('D5', 0), ('G5', .1)]: nt(e['t'], 'vibraphone', p, 4, .5, pan, .5)
    nt(e['t'], 'contrabass_pizz', 'G2', 2, .65, 0, .8)
pulse('vibraphone', 103.6, 107.2, ['G4', 'B4', 'D5', 'B4'], .3, every=2)
# cierre: marimba y glockenspiel, acorde final
pulse('marimba', 107.8, 110.6, ['G4', 'D5', 'B4', 'D5', 'E5', 'D5', 'B4', 'D5'], .42, bass=['G2', 'C2', 'D2'])
pulse('glockenspiel', 107.8, 110.6, ['G6', 'D6', 'B6', 'D6'], .14, every=2)
te = of('end')[0]['t']
for k, p in enumerate(['G2', 'D3', 'G3', 'B3', 'D4', 'G4']): nt(te + k * .16, 'harp', p, 3, .5, -.3 + .12 * k, .55)
for p, pan in [('G4', -.2), ('B4', .2), ('D5', 0)]: nt(te + 1.0, 'vibraphone', p, 4.5, .4, pan, .5)
nt(te + 1.0, 'contrabass_pizz', 'G2', 2, .6, 0, .75)

mus = S.room(mus, size=.5, mix=.22)
mix = fx * .8 + mus * .95

def lufs(x):
    from scipy.signal import lfilter
    b1, a1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, .73248077421585]
    b2, a2 = [1, -2, 1], [1, -1.99004745483398, .99007225036621]
    y = lfilter(b2, a2, lfilter(b1, a1, x, axis=0), axis=0); blk = int(.4 * SR); hop = int(.1 * SR)
    ms = np.array([np.mean(np.sum(y[i:i + blk] ** 2, 1)) for i in range(0, len(y) - blk, hop)])
    l = -.691 + 10 * np.log10(ms + 1e-12); ms = ms[l > -70]; l0 = -.691 + 10 * np.log10(ms.mean()) - 10
    ms = ms[-.691 + 10 * np.log10(ms + 1e-12) > l0]; return -.691 + 10 * np.log10(ms.mean())
def limit2(x, ceil, look=.004):
    from scipy.ndimage import maximum_filter1d, uniform_filter1d
    n = int(look * SR); m = maximum_filter1d(np.abs(x).max(1), size=2 * n + 1)
    g = uniform_filter1d(np.minimum(1, ceil / np.maximum(m, 1e-9)), size=n); return x * g[:, None]
raw = {'efectos': round(lufs((fx * .8).astype(np.float64)), 1), 'musica': round(lufs((mus * .95).astype(np.float64)), 1)}
for _ in range(4):
    mix *= 10 ** ((-16 - lufs(mix)) / 20); mix = limit2(mix, .6)
mix = mix[:N].astype(np.float32)
if len(mix) < N: mix = np.pad(mix, ((0, N - len(mix)), (0, 0)))
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR, subtype='PCM_24')
print(f'mix.wav  {DUR:.2f} s  {lufs(mix):.1f} LUFS  pistas {raw}')
print(S.credits(['marimba', 'contrabass_pizz', 'vibraphone', 'vibraphone_bowed', 'glockenspiel', 'xylophone', 'harp']))

# la narración como .srt (los tiempos son los de la imagen; el video no lleva voz)
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
lines = of('narr')[0]['lines']
open(os.path.join(HERE, 'conjunto-zoom.srt'), 'w', encoding='utf-8', newline='\n').write(
    ''.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n\n' for i, (a, b, txt) in enumerate(lines)))
print('srt', len(lines), 'líneas')
