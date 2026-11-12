"""Sonido de «El origen de los números» -> out/mix.wav (48 kHz estéreo, DUR segundos exactos).
    node core/render/events.mjs <proyecto> --size 1080x1920      (events.json sale de la imagen)
    $LIB/.venv/bin/python <proyecto>/audio.py
Tiza: grabaciones reales (CC0) cortadas en granos, un tren de granos por trazo. Música: marimba, vibráfono y
contrabajo en pizzicato (muestras CC0) sobre la rejilla de 90 pulsos por minuto de film.js. Sin voz.
Dos silencios: antes del círculo del cero y durante la pasada del borrador."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ['LIB']
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from core.audio import sampler as S
from core.audio.sfx import SR, add, whoosh, noise, bp, hp, lp, t_, brown

S.seed(11)
rng = np.random.default_rng(7)
EV = json.load(open(os.path.join(HERE, 'events.json')))
DUR = EV['dur']; ev = EV['ev']; N = int(round(DUR * SR))
first = lambda k: next(e for e in ev if e['type'] == k)
T = lambda k: first(k)['t']
G = first('grid'); BAR = G['bar']; B = G['bars']; BEAT = BAR / 4
fx, mus = (np.zeros((N, 2), np.float32) for _ in range(2))

def fade(x, a=.004, b=.03):
    n = len(x); a, b = min(int(a * SR), n // 2), min(int(b * SR), n // 2)
    x = x.copy(); x[:a] *= np.linspace(0, 1, a); x[n - b:] *= np.linspace(1, 0, b); return x

# ---------------------------------------------------------------- tiza
IDX = json.load(open(os.path.join(HERE, 'foley/lib/index.json')))
strokes = [g for g in IDX if g['kind'] == 'stroke']
taps = [g for g in IDX if g['kind'] == 'tap']
cache = {}
def grain(g):
    if g['file'] not in cache:
        x, sr = sf.read(os.path.join(HERE, 'foley/lib', g['file']), dtype='float32')
        if x.ndim > 1: x = x.mean(1)
        if sr != SR: x = soxr.resample(x, sr, SR)
        cache[g['file']] = x / (np.abs(x).max() + 1e-9)
    return cache[g['file']]
def chalk(d, v, orange=False):
    out = np.zeros(int((d + .06) * SR), np.float32); pos = 0
    while pos < len(out) - int(.03 * SR):
        g = grain(strokes[rng.integers(len(strokes))]); n = min(len(g), len(out) - pos)
        out[pos:pos + n] += fade(g[:n], .006, .02); pos += max(int(.6 * n), int(.04 * SR))
    env = np.ones(len(out)); a = int(.012 * SR); env[:a] = np.linspace(.3, 1, a); env[-int(.05 * SR):] *= np.linspace(1, 0, int(.05 * SR))
    out = out * env
    out = lp(out, 3800) if orange else hp(out, 500)
    return (out * v).astype(np.float32)
for e in ev:
    if e['type'] != 'chalk' or e['t'] < 0: continue
    d = max(.04, e['d']); size = min(1.0, e['len'] / 700)
    v = (.12 + .32 * size) * (1.25 if e['big'] else .8)
    add(fx, chalk(d, v, e['color'] == 'orange'), e['t'], 1.0, e['pan'])
    if d > .12 and rng.random() < .55 and taps:
        add(fx, fade(grain(taps[rng.integers(len(taps))]), .002, .03) * .35 * v, e['t'] - .005, 1.0, e['pan'])

# ---------------------------------------------------------------- sala, paneos, latigazos, borrador
room = lp(brown(DUR), 900) * .006; fx[:, 0] += room[:N]; fx[:, 1] += np.roll(room, 997)[:N]
for e in ev:
    if e['type'] == 'pan': add(fx, whoosh(e['d'], .5) * .16, e['t'], 1.0, .25)
    if e['type'] == 'whip': add(fx, whoosh(.36, .7) * .45, e['t'] - .03, 1.0, 0)
e = first('wipe'); d = e['d']
w = bp(noise(d + .1), 280, 2200) * .22; w *= np.sin(np.pi * np.clip(t_(d + .1) / (d + .1), 0, 1)) ** 1.2 * (1 + .35 * np.sin(2 * np.pi * 2.6 * t_(d + .1)))
add(fx, w.astype(np.float32), e['t'], 1.0, 0)

# ---------------------------------------------------------------- música
def nt(t, inst, p, dur, v, pan=0, g=1.0):
    if 0 <= t < DUR: add(mus, S.note(inst, p, dur, v), t, g, pan)
def ostinato(t0, t1, g=1.0, bass=True):
    seq = ['D4', 'A4', 'F4', 'A4', 'E4', 'A4', 'F4', 'A4']; bs = ['D2', 'D2', 'A1', 'A1', 'Bb1', 'Bb1', 'A1', 'A1']
    i = 0; t = t0
    while t < t1 - .05:
        nt(t, 'marimba', seq[i % 8], .4, .34 if i % 2 else .42, -.25 + .5 * (i % 2), .5 * g)
        if bass and i % 4 == 0: nt(t, 'contrabass_pizz', bs[(i // 4) % 8], .6, .5, 0, .65 * g)
        t += BEAT / 2; i += 1
# gancho: solo tiza; una nota grave con la quinta rayita y dos notas con el título
nt(T('accent'), 'contrabass_pizz', 'D2', 1.2, .55, 0, .7)
nt(T('title'), 'marimba', 'D4', 1.5, .5, -.2, .6); nt(T('title') + BEAT, 'marimba', 'A4', 1.5, .45, .2, .55)
# Ishango, Babilonia, Egipto: el pulso; calla un momento en el hueco babilonio
ostinato(B['c1'], T('gap') - BEAT)
nt(T('gap'), 'vibraphone', 'E4', 2.5, .3, 0, .4)
ostinato(T('gap') + 2 * BEAT, T('zero') - 2 * BEAT - .35)
# India: silencio, y el círculo cae con la nota más aguda
tz = T('zero')
nt(tz - .12, 'vibraphone', 'D5', 4.0, .5, .1, .6); nt(tz + .55, 'vibraphone', 'A4', 3.5, .36, -.2, .5); nt(tz + .55, 'contrabass_pizz', 'D2', 1.5, .6, 0, .75)
ostinato(tz + 3 * BEAT, B['back'] + .3, .8)                         # sigue por encima del latigazo (corte en L)
# borrado en silencio; vuelve con el 909 de tres signos
tr = T('rewrite')
nt(tr, 'vibraphone', 'D4', 3, .42, -.2, .55); nt(tr, 'vibraphone', 'F#4', 3, .38, 0, .5); nt(tr, 'vibraphone', 'A4', 3, .38, .2, .5); nt(tr, 'contrabass_pizz', 'D2', 1.5, .6, 0, .75)
ostinato(tr + 2 * BEAT, B['c6'])
nt(T('shell'), 'vibraphone', 'A4', 2.5, .34, .1, .45)
# hoy: cada 1 suena, cada 0 calla
notes = iter(['D4', 'F4', 'A4', 'D5'])
ostinato(B['c6'], T('end') - BEAT, .55, bass=False)
for e in [x for x in ev if x['type'] == 'bit' and x['v'] == 1]:
    nt(e['t'], 'marimba', next(notes), .8, .6, 0, .8)
te = T('end')
for k, p in enumerate(['D3', 'A3', 'D4', 'F#4', 'A4']): nt(te + k * BEAT / 2, 'marimba', p, 1.5, .5 - .03 * k, -.3 + .15 * k, .6)
nt(te + 2.5 * BEAT, 'vibraphone', 'D4', 4, .4, -.2, .5); nt(te + 2.5 * BEAT, 'vibraphone', 'F#4', 4, .36, .2, .45); nt(te + 2.5 * BEAT, 'contrabass_pizz', 'D2', 2, .6, 0, .75)

mus = S.room(mus, size=.45, mix=.2)
mix = fx * .9 + mus * .9

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
raw = {'tiza': lufs((fx * .9).astype(np.float64)), 'musica': lufs((mus * .9).astype(np.float64))}
for _ in range(4):
    mix *= 10 ** ((-16 - lufs(mix)) / 20); mix = limit2(mix, .6)
over = soxr.resample(mix, SR, SR * 4)
tp = 20 * np.log10(np.abs(over).max() + 1e-12)
if tp > -2.0: mix *= 10 ** ((-2.0 - tp) / 20)
mix = mix[:N].astype(np.float32)
if len(mix) < N: mix = np.pad(mix, ((0, N - len(mix)), (0, 0)))
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR, subtype='PCM_24')
print(f'mix.wav  {DUR:.2f} s  {lufs(mix):.1f} LUFS   pistas (LUFS sin nivelar): { {k: round(v, 1) for k, v in raw.items()} }')
print(S.credits(['marimba', 'contrabass_pizz', 'vibraphone']))
