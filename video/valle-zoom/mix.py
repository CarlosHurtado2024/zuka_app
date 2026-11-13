"""Sonido de un video zoom de Zuka (Pradera de Venn, Valle de los Números) -> out/mix.wav, y la narración -> <nombre>.srt y narracion.txt.
Sin voz grabada: la mezcla deja sitio para ponerla. Música: percusión afinada y cuerdas pulsadas (muestras CC0),
sol mayor pentatónico, un instrumento guía por nivel (arpa, marimba, xilófono, vibráfono). Los niveles salen de los
sucesos 'arrive' y 'dive'; los silencios, de los sucesos 'hush'. Efectos de «maquinita» como en conjunto-zoom."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ['LIB']; NAME = sys.argv[1]; OUT = os.path.join(HERE, 'out', NAME)
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, whoosh, bp, lp, t_, brown, click, clack, env_exp

S.seed(sum(map(ord, NAME)))
EV = json.load(open(os.path.join(OUT, 'events.json'), encoding='utf-8'))
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
for e in of('rise'): add(fx, whoosh(.22, .5) * .25, e['t'], 1.0, 0)
for e in of('pull'): add(fx, whoosh(e['d'], .6) * .3, e['t'], 1.0, 0)
for e in of('enter'): add(fx, servo(e['d'], 220, 520), e['t'], 1.0, .5)
for e in of('lasso'):
    tt = t_(e['d']); f = 500 + 900 * tt / e['d']
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / e['d']) * .05
    add(fx, (bp(x + np.random.default_rng(3).standard_normal(len(tt)) * .02, 400, 3000)).astype(np.float32), e['t'], 1.0, 0)
for e in of('yes'): nt(e['t'], 'glockenspiel', 'B6', 1.2, .5, .1, .5); nt(e['t'] + .1, 'glockenspiel', 'D7', 1.2, .5, .1, .45)
for e in of('no'): add(fx, thump(110, .25, .35), e['t'], 1.0, -.3); add(fx, clack(.5, .6), e['t'], .5, -.3)
for e in of('line'):
    for k in range(9): add(fx, blip(660 * 2 ** (k / 12), .06, .16), e['t'] + e['d'] * k / 9, 1.0, .4 - .08 * k)
    add(fx, servo(.3, 400, 900, .06), e['t'] - .35, 1.0, .5)
for e in of('lock'):
    add(fx, click(1.3, .8), e['t'], .8, .1)
    nt(e['t'] + .02, 'glockenspiel', ['B6', 'D7', 'E7'][e['i'] % 3], 1.6, .55, .15, .5)
for e in of('dive'):
    d = e['d']; w = whoosh(d, .8); tt = t_(d); w = w[:len(tt)] * (.25 + .75 * (tt / d) ** 2)
    add(fx, (w * .5).astype(np.float32), e['t'], 1.0, 0)
    add(fx, servo(d, 180, 760, .05), e['t'], 1.0, .4)
for e in of('arrive'): add(fx, thump(), e['t'], 1.0, 0)
for e in of('pop'): add(fx, blip(520 + 130 * (e['i'] % 4), .09, .22), e['t'], 1.0, .3)
for e in of('tile'): add(fx, click(.8 + .05 * (e['i'] % 6), .5), e['t'], .6, -.4 + .15 * (e['i'] % 6))
for e in of('fly') + of('slide') + of('away'): add(fx, whoosh(e['d'], .5) * .18, e['t'], 1.0, 0)
for e in of('hit'): add(fx, thump(95, .3, .5), e['t'], 1.0, 0); add(fx, clack(1.1, .8), e['t'], .8, 0)
for e in of('merge'): add(fx, blip(440 + 60 * e['i'], .1, .2), e['t'], 1.0, 0)
for e in of('paint'):
    tt = t_(e['d']); n = np.random.default_rng(int(e['t'] * 10)).standard_normal(len(tt)) * np.sin(np.pi * tt / e['d']) ** .7 * .06
    add(fx, bp(n, 900, 4500).astype(np.float32), e['t'], 1.0, 0)
for e in of('count'): add(fx, blip(660 * 2 ** ((e['i'] % 5) * 4 / 12), .12, .25), e['t'], 1.0, -.3 + .2 * (e['i'] % 4))
for e in of('card'):
    add(fx, thump(65, .5, .5), e['t'], 1.0, 0)
    for p, pan in [('G4', -.2), ('B4', .2), ('D5', 0), ('G5', .1)]: nt(e['t'], 'vibraphone', p, 4, .5, pan, .5)
for e in of('stop'): add(fx, click(1.1, .5), e['t'], .6, 0)

# ---------------------------------------------------------------- música (sol mayor pentatónica)
hush = [(e['t'], e['t'] + e['d']) for e in of('hush')]
def quiet(t): return any(a <= t < b for a, b in hush)
def pulse(inst, t0, t1, seq, g=.5, every=1, bass=None):
    i = 0; t = t0
    while t < t1 - .05:
        if not quiet(t):
            nt(t, inst, seq[i % len(seq)], .5, .4 if i % 2 else .5, -.25 + .5 * (i % 2), g)
            if bass and i % 4 == 0: nt(t, 'contrabass_pizz', bass[(i // 4) % len(bass)], .7, .5, 0, .6)
        t += BEAT / 2 * every; i += 1
dives = sorted(of('dive'), key=lambda e: e['t']); arrs = sorted(of('arrive'), key=lambda e: e['t'])
te = of('end')[0]['t']
starts = [0.2] + [e['t'] + .1 for e in arrs]; ends = [e['t'] for e in dives] + [te - .8]
LEAD = [('harp', ['G4', 'B4', 'D5', 'B4'], .42), ('marimba', ['G4', 'D5', 'B4', 'D5'], .42),
        ('xylophone', ['D5', 'G5', 'E5', 'G5'], .3), ('vibraphone', ['G4', 'D5', 'B4', 'D5', 'E5', 'D5'], .36)]
BASS = [['G2', 'G2', 'C2', 'D2'], ['G2', 'E2', 'C2', 'D2'], ['G2', 'C2', 'E2', 'D2'], ['G2', 'E2', 'C2', 'D2']]
for k, (a, b) in enumerate(zip(starts, ends)):
    inst, seq, gg = LEAD[k % 4]
    pulse(inst, a, b, seq, gg, every=2 if k in (0, 3) else 1, bass=BASS[k % 4])
    if k == 2: pulse('harp', a, b, ['G4', 'B4', 'D5', 'E5', 'D5', 'B4'], .3, every=2)
for t, p in [(0.2, 'G3'), (0.2, 'D4')]: nt(t, 'vibraphone_bowed', p, 6.0, .32, 0, .32)
pulse('marimba', te - .8, te, ['G4', 'D5', 'B4', 'D5'], .4)
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
for _ in range(4):
    mix *= 10 ** ((-16 - lufs(mix)) / 20); mix = limit2(mix, .6)
mix = mix[:N].astype(np.float32)
if len(mix) < N: mix = np.pad(mix, ((0, N - len(mix)), (0, 0)))
sf.write(os.path.join(OUT, 'mix.wav'), mix, SR, subtype='PCM_24')
print(f'mix.wav  {DUR:.2f} s  {lufs(mix):.1f} LUFS')
print(S.credits(['marimba', 'contrabass_pizz', 'vibraphone', 'vibraphone_bowed', 'glockenspiel', 'xylophone', 'harp']))

# ---------------------------------------------------------------- la narración: .srt con los tiempos de la imagen y texto corrido
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
lines = of('narr')[0]['lines']
open(os.path.join(OUT, NAME + '.srt'), 'w', encoding='utf-8', newline='\n').write(
    ''.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n\n' for i, (a, b, txt) in enumerate(lines)))
# texto corrido: un párrafo por nivel (los cortes son las zambullidas)
cuts = [e['t'] for e in dives]; paras = [[] for _ in range(len(cuts) + 1)]
for a, b, txt in lines: paras[sum(a >= c for c in cuts)].append(txt)
open(os.path.join(OUT, NAME + '_narracion.txt'), 'w', encoding='utf-8', newline='\n').write('\n\n'.join(' '.join(p) for p in paras if p) + '\n')
fast = [(txt, round(len(txt.split()) / (b - a), 2)) for a, b, txt in lines if len(txt.split()) / (b - a) > 3.2 or b - a < 1.8]
print('srt', len(lines), 'líneas', ('· rápidas: ' + str(fast)) if fast else '· ritmo ok')
