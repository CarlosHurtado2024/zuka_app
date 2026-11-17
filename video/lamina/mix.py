"""Sonido de una película lámina -> out/<f>/mix.wav (48 kHz estéreo).   python mix.py <nombre>
Sin voz. Colchón de vibráfono con arco y pulso suave de arpa o marimba (muestras CC0) en la tonalidad del mundo (FILM.key),
efectos mínimos ligados a lo que se dibuja. Escribe también <nombre>.srt y <nombre>_narracion.txt (el video no lleva voz)."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ['LIB']
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, whoosh, lp, t_, brown, click, clack, env_exp

NAME = sys.argv[1]; O = os.path.join(HERE, 'out', NAME)
S.seed(sum(map(ord, NAME)))
EV = json.load(open(os.path.join(O, 'events.json')))
DUR = EV['dur']; ev = EV['ev']; N = int(round(DUR * SR))
of = lambda k: [e for e in ev if e['type'] == k]
meta = of('meta')[0]; KEY = meta.get('key', 'D')
fx, mus = (np.zeros((N, 2), np.float32) for _ in range(2))
BEAT = 60 / 78

def nt(t, inst, p, dur, v, pan=0, g=1.0):
    if 0 <= t < DUR - .05: add(mus, S.note(inst, p, dur, v), t, g, pan)
def blip(f, d=.07, v=.25):
    tt = t_(d); return (np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / .004) * env_exp(d, d / 3) * v).astype(np.float32)
def thump(f=70, d=.35, v=.5):
    return (np.sin(2 * np.pi * f * t_(d)) * env_exp(d, d / 5) * v).astype(np.float32)
def sweep(d, f0, f1, v=.05):
    tt = t_(d); f = f0 + (f1 - f0) * tt / d
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) ** .7 * v).astype(np.float32)
def tr(p, k): return S.name(S.midi(p) + k)

# tonalidad del mundo: la progresión I–vi–IV–V escrita en re y transpuesta
SEMI = {'C': -2, 'D': 0, 'E': 2, 'F': 3, 'G': 5, 'A': -5, 'B': -3, 'Bb': -4, 'Eb': 1}[KEY]
CH = [('D2', ['D3', 'A3', 'F#4', 'E4']), ('B1', ['B2', 'F#3', 'D4', 'A4']), ('G2', ['G3', 'D4', 'B3', 'A4']), ('A2', ['A3', 'E4', 'C#4', 'B4'])]
CH = [(tr(b, SEMI), [tr(p, SEMI) for p in ns]) for b, ns in CH]
SC = [tr(p, SEMI) for p in ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6', 'E6']]

room = lp(brown(DUR), 400) * .003; fx[:, 0] += room[:N]; fx[:, 1] += np.roll(room, 911)[:N]
for e in of('scene'): add(fx, whoosh(.9, .6) * .22, e['t'] - .1, 1.0, 0); add(fx, sweep(.8, 300, 900, .025), e['t'], 1.0, 0)
for e in of('dive'): d = e['v'] or 1.2; add(fx, whoosh(d, .8) * .35, e['t'], 1.0, 0); add(fx, sweep(d, 180, 700, .04), e['t'], 1.0, 0)
for e in of('pops'):
    for k in range(int(e['v'] or 3)): add(fx, blip(520 + 60 * k, .07, .12), e['t'] + k * .14, 1.0, -.4 + .8 * k / max(1, (e['v'] or 3) - 1))
for e in of('pop'): add(fx, blip(620 + 40 * (e['v'] or 0), .07, .13), e['t'], 1.0, 0)
for e in of('draw'): d = e['v'] or 1.0; add(fx, sweep(d, 420, 760, .03), e['t'], 1.0, 0); add(fx, click(1.2, .5), e['t'] + d, .5, 0)
for e in of('rise'): add(fx, whoosh(.25, .5) * .13, e['t'], 1.0, 0)
for e in of('tag'): add(fx, click(1.0, .45), e['t'], .5, .2)
for e in of('yes'): nt(e['t'], 'glockenspiel', SC[3], 1.4, .42, .1, .32); nt(e['t'] + .1, 'glockenspiel', SC[5], 1.4, .42, .1, .28)
for e in of('no'): add(fx, blip(196, .2, .15), e['t'], 1.0, .1); add(fx, clack(.9, .5), e['t'], .5, .1)
for e in of('doubt'): add(fx, sweep(.6, 300, 200, .05), e['t'], 1.0, 0)
for e in of('fly'): add(fx, whoosh(e['v'] or 1.0, .5) * .14, e['t'], 1.0, 0)
for e in of('brace'): add(fx, clack(.8, .6), e['t'], .6, -.3); add(fx, clack(.8, .6), e['t'] + .05, .6, .3)
for e in of('cut'): add(fx, whoosh(.3, .8) * .2, e['t'], 1.0, 0)
for e in of('shuffle'): add(fx, whoosh(e['v'] or 1.5, .5) * .18, e['t'], 1.0, 0)
for e in of('count'): add(fx, click(1.0, .5), e['t'], .55, 0); nt(e['t'], 'marimba', SC[int(e['v']) % len(SC)], .6, .55, 0, .45)
for e in of('card'):
    add(fx, thump(60, .5, .4), e['t'], 1.0, 0)
    for p, pan in zip(CH[0][1], [-.2, .2, 0, .1]): nt(e['t'], 'vibraphone', tr(p, 12), 3.5, .45, pan, .38)
for e in of('sum'): add(fx, click(1.1, .45), e['t'], .5, 0)

BAR = BEAT * 8
t = .3; i = 0
while t < DUR - 6:
    b, notes = CH[i % 4]
    for k, p in enumerate(notes[:3]): nt(t, 'vibraphone_bowed', p, BAR + .8, .3, -.3 + .3 * k, .23)
    t += BAR; i += 1
scenes = sorted([e['t'] for e in of('scene')])
end = of('end')[0]['t']
for j, a in enumerate(scenes):
    b = scenes[j + 1] if j + 1 < len(scenes) else end
    inst = ['harp', 'marimba'][j % 2]; tt = a + .4; q = 0
    while tt < b - .6:
        bar = int((tt - .3) // BAR) % 4; bs, notes = CH[bar]; step = q % 8
        nt(tt, inst, notes[[0, 2, 1, 3, 2, 1, 3, 2][step]], .6, .34 if q % 2 else .44, -.25 + .5 * (q % 2), .24 if inst == 'marimba' else .28)
        if step == 0: nt(tt, 'contrabass_pizz', bs, .9, .45, 0, .48)
        tt += BEAT; q += 1
base = CH[0][0]
for k, p in enumerate([base, tr(base, 7), tr(base, 12), tr(base, 16), tr(base, 19), tr(base, 24)]): nt(end + k * .16, 'harp', p, 3.5, .5, -.3 + .12 * k, .5)
for p, pan in zip(CH[0][1][:3], [-.2, .2, 0]): nt(end + 1.0, 'vibraphone', tr(p, 12), 4.0, .4, pan, .4)

mus = S.room(mus, size=.55, mix=.24)
mix = fx * .7 + mus * .95
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
fo = int(1.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
mix = mix[:N].astype(np.float32)
if len(mix) < N: mix = np.pad(mix, ((0, N - len(mix)), (0, 0)))
sf.write(os.path.join(O, 'mix.wav'), mix, SR, subtype='PCM_24')
print(f'mix.wav  {DUR:.2f} s  {lufs(mix):.1f} LUFS  tonalidad {KEY}')

def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
lines = of('narr')[0]['lines']
open(os.path.join(O, NAME + '.srt'), 'w', encoding='utf-8', newline='\n').write(''.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n\n' for i, (a, b, txt) in enumerate(lines)))
open(os.path.join(O, NAME + '_narracion.txt'), 'w', encoding='utf-8', newline='\n').write('\n'.join(f'[{a:6.1f} s] {txt}' for a, b, txt in lines) + '\n')
print('srt', len(lines), 'líneas')
