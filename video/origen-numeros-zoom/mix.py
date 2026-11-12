"""Sonido de «El origen de los números» (zoom) -> out/mix.wav (48 kHz estéreo, DUR segundos exactos).
Sin voz: el corto deja libre el centro de la mezcla para una narración (origen-numeros-zoom.srt).
Música: percusión afinada y cuerdas pulsadas (muestras CC0), un instrumento guía por nivel, misma tonalidad (re).
Efectos de «maquinita»: toques para las muescas, pitidos que suben por la línea de mira, clic y campana al cerrar
el anillo, soplo en cada zambullida. Casi silencio antes de que aparezca el cero."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ['LIB']
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from core.audio import sampler as S
from core.audio.sfx import SR, add, whoosh, noise, bp, hp, lp, t_, brown, click, clack, env_exp

S.seed(5)
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

# ---------------------------------------------------------------- efectos
room = lp(brown(DUR), 500) * .004; fx[:, 0] += room[:N]; fx[:, 1] += np.roll(room, 911)[:N]
for e in of('tick'): add(fx, click(.55 + .02 * (e['i'] % 5), .5), e['t'], .55, -.3 + .03 * e['i'])
for e in of('rise'): add(fx, whoosh(.22, .5) * .25, e['t'], 1.0, 0)
for e in of('pull'): add(fx, whoosh(e['d'], .6) * .3, e['t'], 1.0, 0)
for e in of('enter'): add(fx, servo(e['d'], 220, 520), e['t'], 1.0, -.5)
for e in of('line'):
    n = 9
    for k in range(n): add(fx, blip(660 * 2 ** (k / 12 * 1.0), .06, .16), e['t'] + e['d'] * k / n, 1.0, -.4 + .08 * k)
    add(fx, servo(.3, 400, 900, .06), e['t'] - .35, 1.0, -.5)
for e in of('lock'):
    add(fx, click(1.3, .8), e['t'], .8, .1)
    nt(e['t'] + .02, 'glockenspiel', ['A6', 'B6', 'D7', 'E7'][e['i']], 1.6, .55, .15, .5)
for e in of('dive'):
    d = e['d']; w = whoosh(d, .8); tt = t_(d); w = w[:len(tt)] * (.25 + .75 * (tt / d) ** 2)
    add(fx, (w * .5).astype(np.float32), e['t'], 1.0, 0)
    add(fx, servo(d, 180, 760, .05), e['t'], 1.0, -.4)
for e in of('arrive'):
    th = np.sin(2 * np.pi * 70 * t_(.35)) * env_exp(.35, .07) * .5
    add(fx, th.astype(np.float32), e['t'], 1.0, 0)
for e in of('pop'): add(fx, blip(520 + 130 * e['i'], .09, .22), e['t'], 1.0, 0)
for e in of('press'): add(fx, clack(.7, .7), e['t'], .7, -.2 + .1 * e['i'])
for e in of('fall'): add(fx, whoosh(e['d'], .5) * .22, e['t'], 1.0, 0)
for e in of('bitrow'):
    for k in range(5): add(fx, blip(880 if (e['i'] + k) % 2 else 1320, .04, .1), e['t'] + k * .05, 1.0, -.3 + .15 * k)

# ---------------------------------------------------------------- música (re mayor pentatónica)
PENT = ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5', 'B5', 'D6']
def pulse(inst, t0, t1, seq, g=.5, every=1, bass=None):
    i = 0; t = t0
    while t < t1 - .05:
        nt(t, inst, seq[i % len(seq)], .5, .4 if i % 2 else .5, -.25 + .5 * (i % 2), g)
        if bass and i % 4 == 0: nt(t, 'contrabass_pizz', bass[(i // 4) % len(bass)], .7, .5, 0, .6)
        t += BEAT / 2 * every; i += 1
d = {e['i']: e for e in of('dive')}; arr = {e['i']: e['t'] for e in of('arrive')}
# nivel 0, el hueso: colchón de vibráfono con arco y dos notas de arpa
for t, p in [(0.2, 'D3'), (0.2, 'A3'), (5.2, 'D3'), (5.2, 'F#4')]: nt(t, 'vibraphone_bowed', p if p[-1] != '3' else p.replace('3', '4'), 5.2, .35, 0, .35)
for t, p in [(3.3, 'A4'), (5.6, 'D5'), (8.1, 'F#5')]: nt(t, 'harp', p, 2.5, .5, .2, .5)
# nivel 1, Egipto: marimba; cada signo del 909 es una nota que sube
pulse('marimba', arr[0] + .1, d[1]['t'], ['D4', 'A4', 'F#4', 'A4'], .42, bass=['D2', 'D2', 'A1', 'B1'])
for e in of('count'): nt(e['t'], 'xylophone', PENT[min(10, e['i'] % 9 + (2 if e['i'] > 8 else 0))], .3, .45, .3, .3)
# nivel 2, Babilonia: arpa y bajo; los doce puntos grandes del reloj son campanitas
pulse('harp', arr[1] + .1, 35.2, ['D4', 'F#4', 'A4', 'B4', 'A4', 'F#4'], .5, bass=['D2', 'B1', 'G1', 'A1'])
for e in of('clock'): nt(e['t'], 'glockenspiel', PENT[5 + e['i'] % 4], .5, .4, -.3 + .05 * e['i'], .3)
pulse('harp', 35.4, 40.4, ['B3', 'D4', 'F#4', 'D4'], .32, every=2)          # se vacía: llega el hueco
# nivel 3, la India: casi silencio, un punto, y el cero
for e in of('dot'): nt(e['t'], 'glockenspiel', 'A6', 2.0, .35, 0, .35)
for e in of('zero'):
    for p, pan in [('D4', -.2), ('A4', .2), ('F#5', 0), ('D3' if False else 'D5', .1)]: nt(e['t'], 'vibraphone', p, 5, .5, pan, .55)
    nt(e['t'], 'contrabass_pizz', 'D2', 2, .65, 0, .8)
pulse('vibraphone', 50.2, 61.0, ['D4', 'A4', 'B4', 'A4', 'F#4', 'A4'], .34, every=2, bass=['D2', 'G1'])
pulse('marimba', 61.4, d[3]['t'], ['D4', 'F#4', 'A4', 'D5'], .4, bass=['D2', 'A1'])
# nivel 4, hoy: todo junto; acorde final
pulse('marimba', arr[3] + .1, 73.4, ['D4', 'A4', 'F#4', 'A4', 'B4', 'A4', 'F#4', 'A4'], .45, bass=['D2', 'B1', 'G1', 'A1'])
pulse('glockenspiel', arr[3] + .1 + BEAT * 4, 73.4, ['D6', 'A5', 'F#6', 'A5'], .16, every=2)
te = of('end')[0]['t']
for k, p in enumerate(['D3', 'A3', 'D4', 'F#4', 'A4', 'D5']): nt(te + k * .16, 'harp', p, 3, .5, -.3 + .12 * k, .55)
for p, pan in [('D4', -.2), ('F#4', .2), ('A4', 0)]: nt(te + 1.0, 'vibraphone', p, 4, .4, pan, .5)
nt(te + 1.0, 'contrabass_pizz', 'D2', 2, .6, 0, .75)

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

# la narración como .srt (los tiempos son los de la imagen)
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
lines = of('narr')[0]['lines']
open(os.path.join(HERE, 'origen-numeros-zoom.srt'), 'w', encoding='utf-8', newline='\n').write(
    ''.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n\n' for i, (a, b, txt) in enumerate(lines)))
print('srt', len(lines), 'líneas')
