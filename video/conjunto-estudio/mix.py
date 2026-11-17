"""Sonido de «¿Qué es un conjunto?» (versión estudio) -> out/mix.wav (48 kHz estéreo, DUR segundos exactos).
Sin voz. Música sobria: colchón de vibráfono con arco, pulso de marimba y contrabajo pulsado (muestras CC0), en la menor.
Efectos de interfaz: teclas al escribir, clic al fijar, soplo en cada zambullida, golpe seco cuando Eco rebota en la llave.
Escribe también la narración como conjunto-estudio.srt y narracion.txt (el video no la lleva)."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ['LIB']
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, whoosh, bp, lp, t_, brown, click, clack, env_exp

S.seed(23)
EV = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EV['dur']; ev = EV['ev']; N = int(round(DUR * SR))
of = lambda k: [e for e in ev if e['type'] == k]
fx, mus = (np.zeros((N, 2), np.float32) for _ in range(2))
BEAT = 60 / 92
rg = np.random.default_rng(5)

def nt(t, inst, p, dur, v, pan=0, g=1.0):
    if 0 <= t < DUR - .05: add(mus, S.note(inst, p, dur, v), t, g, pan)
def blip(f, d=.07, v=.25):
    tt = t_(d); return (np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / .004) * env_exp(d, d / 3) * v).astype(np.float32)
def thump(f=70, d=.35, v=.5):
    return (np.sin(2 * np.pi * f * t_(d)) * env_exp(d, d / 5) * v).astype(np.float32)
def sweep(d, f0, f1, v=.05):
    tt = t_(d); f = f0 + (f1 - f0) * tt / d
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) ** .7 * v).astype(np.float32)

# ---------------------------------------------------------------- efectos
room = lp(brown(DUR), 400) * .004; fx[:, 0] += room[:N]; fx[:, 1] += np.roll(room, 911)[:N]
for e in of('rise'): add(fx, whoosh(.25, .5) * .2, e['t'], 1.0, 0)
for e in of('keys'):
    for k in range(e['n']): add(fx, click(.9 + rg.random() * .5, .35 + rg.random() * .2), e['t'] + e['d'] * k / e['n'] + rg.random() * .02, .5, -.2 + rg.random() * .4)
for e in of('tiles'):
    for k in range(e['n']): add(fx, click(.7 + .04 * k, .4), e['t'] + k * .08, .45, -.4 + .8 * k / max(1, e['n'] - 1))
for e in of('vote'):
    for k in range(3): add(fx, blip(420 - 40 * e['i'] + 30 * k, .06, .14), e['t'] + k * .08, 1.0, -.3 + .3 * k)
for e in of('doubt'): add(fx, sweep(.7, 300, 180, .08), e['t'], 1.0, 0); add(fx, thump(90, .3, .3), e['t'], 1.0, 0)
for e in of('cut'): add(fx, whoosh(.2, .9) * .3, e['t'], 1.0, 0); add(fx, clack(1.2, .6), e['t'] + .2, .6, 0)
for e in of('scan'): add(fx, sweep(e['d'], 500, 1100, .035), e['t'], 1.0, 0)
for e in of('lock'): add(fx, click(1.3, .7), e['t'], .7, -.3 + .2 * e['i']); nt(e['t'], 'glockenspiel', ['E6', 'A6', 'C7', 'E7'][e['i']], 1.0, .4, -.2 + .13 * e['i'], .32)
for e in of('fly'): add(fx, whoosh(e['d'], .5) * .2, e['t'], 1.0, 0)
for e in of('ring'): add(fx, sweep(e['d'], 700, 1300, .04), e['t'], 1.0, 0); add(fx, click(1.3, .7), e['t'] + e['d'], .7, 0)
for e in of('glint'): nt(e['t'], 'glockenspiel', 'E7', 1.2, .4, .3, .3); nt(e['t'] + .12, 'glockenspiel', 'A7', 1.2, .35, .3, .26)
for e in of('dive'):
    d = e['d']; w = whoosh(d, .8); tt = t_(d); w = w[:len(tt)] * (.25 + .75 * (tt / d) ** 2)
    add(fx, (w * .5).astype(np.float32), e['t'], 1.0, 0); add(fx, sweep(d, 160, 640, .04), e['t'], 1.0, 0)
for e in of('pull'):
    d = e['d']; w = whoosh(d, .8); tt = t_(d); w = w[:len(tt)] * (1 - .7 * (tt / d))
    add(fx, (w * .5).astype(np.float32), e['t'], 1.0, 0); add(fx, sweep(d, 640, 140, .04), e['t'], 1.0, 0)
for e in of('arrive'): add(fx, thump(62, .45, .5), e['t'], 1.0, 0)
for e in of('brace'): add(fx, clack(.8, .7), e['t'], .7, -.35); add(fx, clack(.8, .7), e['t'] + .05, .7, .35)
for e in of('yes'): nt(e['t'], 'glockenspiel', 'A6', 1.4, .45, .1, .4); nt(e['t'] + .1, 'glockenspiel', 'E7', 1.4, .45, .1, .36)
for e in of('slide'): add(fx, whoosh(e['d'], .5) * .2, e['t'], 1.0, .4)
for e in of('hit'): add(fx, thump(95, .3, .6), e['t'], 1.0, .4); add(fx, clack(1.1, .9), e['t'], .9, .4)
for e in of('no'): add(fx, blip(196, .22, .2), e['t'], 1.0, .2)
for e in of('pass'): add(fx, click(1.2, .5), e['t'], .6, .2); nt(e['t'], 'glockenspiel', ['A6', 'C7', 'E7', 'A7'][e['i']], .9, .35, .25, .26)
for e in of('stop'): add(fx, thump(110, .2, .3), e['t'], 1.0, -.1); add(fx, clack(.9, .5), e['t'], .5, -.1)
for e in of('shuffle'): add(fx, whoosh(e['d'], .5) * .22, e['t'], 1.0, 0); [add(fx, click(1.0 + .1 * k, .5), e['t'] + .9 + k * .1, .5, -.3 + .2 * k) for k in range(4)]
for e in of('toast'): add(fx, blip(660, .09, .16), e['t'], 1.0, 0); add(fx, blip(880, .12, .14), e['t'] + .1, 1.0, 0)
for e in of('merge'): add(fx, whoosh(.6, .5) * .2, e['t'], 1.0, 0); add(fx, click(1.1, .7), e['t'] + .7, .7, 0)
for e in of('count'): add(fx, click(1.0 + .08 * e['i'], .6), e['t'], .6, -.3 + .2 * e['i']); nt(e['t'], 'marimba', ['A4', 'C5', 'E5', 'A5'][e['i']], .6, .6, -.3 + .2 * e['i'], .5)
for e in of('card'): add(fx, thump(58, .6, .55), e['t'], 1.0, 0)
for e in of('sum'): add(fx, click(1.1, .5), e['t'], .55, 0)

# ---------------------------------------------------------------- música (la menor; acordes de cuatro tiempos lentos)
CH = [('A2', ['A3', 'C4', 'E4', 'B4']), ('F2', ['F3', 'A3', 'C4', 'G4']), ('C3', ['G3', 'C4', 'E4', 'D5']), ('G2', ['G3', 'B3', 'D4', 'A4'])]
BAR = BEAT * 8
def pad(t0, t1, g=.26):
    t = t0; i = 0
    while t < t1 - .5:
        b, notes = CH[i % 4]
        for k, p in enumerate(notes[:3]): nt(t, 'vibraphone_bowed', p, BAR + .6, .3, -.3 + .3 * k, g)
        t += BAR; i += 1
def pulse(t0, t1, g=.34, every=1, bass=True, inst='marimba'):
    t = t0; i = 0
    while t < t1 - .05:
        bar = int((t - t0) // BAR) % 4; b, notes = CH[bar]; step = i % 8
        nt(t, inst, notes[[0, 2, 1, 3, 2, 1, 3, 2][step]], .5, .38 if i % 2 else .5, -.25 + .5 * (i % 2), g)
        if bass and step in (0, 5): nt(t, 'contrabass_pizz', b, .8, .5, 0, .55)
        t += BEAT / 2 * every; i += 1
dv = {e['i']: e['t'] for e in of('dive')}; ar = {e['i']: e['t'] for e in of('arrive')}
pull = of('pull')[0]['t']
pad(.3, DUR - 5)
pulse(2.7, 12.2, .28, every=2, bass=False, inst='harp')        # la búsqueda
pulse(19.0, dv[0], .32, every=2)                                # ya está bien definida (antes, solo el colchón: la duda)
pulse(ar[0] + .1, 51.6, .34)                                    # elementos y notación; silencio antes de que llegue Eco
pulse(53.6, dv[1], .32)
pulse(ar[1] + .1, dv[2], .32)
pulse(ar[2] + .1, 104.8, .34)                                   # aleatorio y repetidos; se vacía antes del cardinal
for e in of('card'):
    for p, pan in [('A3', -.2), ('E4', .2), ('A4', 0), ('C5', .1), ('E5', -.1)]: nt(e['t'], 'vibraphone', p, 4, .5, pan, .45)
    nt(e['t'], 'contrabass_pizz', 'A2', 2, .65, 0, .8)
pulse(107.8, pull, .28, every=2)
pulse(ar[3] + .1, of('end')[0]['t'], .3, every=2)
te = of('end')[0]['t']
for k, p in enumerate(['A2', 'E3', 'A3', 'C4', 'E4', 'A4']): nt(te + k * .16, 'harp', p, 3.5, .5, -.3 + .12 * k, .5)
for p, pan in [('A4', -.2), ('C5', .2), ('E5', 0)]: nt(te + 1.0, 'vibraphone', p, 3.6, .4, pan, .45)
nt(te + 1.0, 'contrabass_pizz', 'A2', 2, .6, 0, .75)

mus = S.room(mus, size=.55, mix=.24)
mix = fx * .75 + mus * .95

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
for _ in range(4):
    mix *= 10 ** ((-16 - lufs(mix)) / 20); mix = limit2(mix, .6)
fo = int(1.2 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
mix = mix[:N].astype(np.float32)
if len(mix) < N: mix = np.pad(mix, ((0, N - len(mix)), (0, 0)))
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR, subtype='PCM_24')
print(f'mix.wav  {DUR:.2f} s  {lufs(mix):.1f} LUFS')
print(S.credits(['marimba', 'contrabass_pizz', 'vibraphone', 'vibraphone_bowed', 'glockenspiel', 'harp']))

def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
lines = of('narr')[0]['lines']
open(os.path.join(HERE, 'conjunto-estudio.srt'), 'w', encoding='utf-8', newline='\n').write(
    ''.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n\n' for i, (a, b, txt) in enumerate(lines)))
open(os.path.join(HERE, 'narracion.txt'), 'w', encoding='utf-8', newline='\n').write('\n'.join(f'[{a:6.1f} s] {txt}' for a, b, txt in lines) + '\n')
print('srt', len(lines), 'líneas')
