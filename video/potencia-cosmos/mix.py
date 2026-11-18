"""Sonido de los videos de Exponentes y Radicales -> out/<película>/mix.wav (48 kHz estéreo, DUR segundos exactos) y el .srt.
Todo sintetizado con numpy, sin muestras: una base grave continua, un pulso cada 0.25 s, cambio de textura en cada
corte de escena (otra nota base, otro dibujo de arpegio, otro timbre), un soplo en cada corte y notas que suben en
el cierre. Sin voz: la narración va en out/<película>/<película>.srt. Volumen normalizado, sin saturar."""
import sys, os, json
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
FILM = sys.argv[1]                                    # el nombre de la película (films/<nombre>.data.js)
OUT = os.path.join(HERE, 'out', FILM)
EV = json.load(open(os.path.join(OUT, 'events.json'), encoding='utf-8'))
SR = 48000; DUR = EV['dur']; N = int(round(DUR * SR)); SC = EV['sc']
rs = np.random.RandomState(7)
mix = np.zeros((N, 2), np.float32)

def add(buf, t, pan=0.0, g=1.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    n = min(len(buf), N - i)
    mix[i:i + n, 0] += buf[:n] * g * (1 - max(0, pan)); mix[i:i + n, 1] += buf[:n] * g * (1 + min(0, pan))

def tt(d): return np.arange(int(d * SR)) / SR
def pluck(f, d=.22, tone=0):
    t = tt(d); env = np.exp(-t / (d * .28)) * np.minimum(1, t / .003)
    w = np.sin(2 * np.pi * f * t)
    if tone == 1: w = w + .35 * np.sin(4 * np.pi * f * t)                      # campanita
    if tone == 2: w = np.sign(np.sin(2 * np.pi * f * t)) * .35 + w * .5         # más áspero
    if tone == 3: w = w * (1 + .5 * np.sin(2 * np.pi * f * 2.01 * t))           # FM suave
    return (w * env).astype(np.float32)
def lowpass(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y

# nota base de cada escena (Hz) y escala pentatónica menor sobre ella
ROOTS = [55.0, 49.0, 65.41, 58.27, 73.42, 65.41, 55.0, 61.74, 49.0, 55.0]
PENT = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22]
PATTERNS = [[0, 2, 4, 2], [0, 4, 3, 5, 2, 4], [0, 2, 3, 5, 4, 2, 3, 1], [5, 4, 2, 0], [0, 3, 5, 7, 5, 3], [0, 2, 4, 6, 4, 2, 5, 3], [0, 4, 2, 5, 3, 6, 4, 7], [0, 2, 4, 5], [4, 2, 0, 2], [0, 2, 4, 5, 7, 5, 4, 2]]

# 1) base grave continua: dos senos y un quinto, con un vaivén lento; cruza de una nota a otra en cada corte
t_all = np.arange(N) / SR
freq = np.zeros(N);
for k, s in enumerate(SC):
    a, b = int(s['t0'] * SR), int(s['t1'] * SR); freq[a:b] = ROOTS[k % len(ROOTS)]
gl = int(.5 * SR); cs = np.cumsum(np.pad(freq, (gl, gl), mode='edge')); freq = (cs[gl:] - cs[:-gl])[gl // 2:gl // 2 + N] / gl   # media móvil de 0.5 s
ph = 2 * np.pi * np.cumsum(freq) / SR
drone = (np.sin(ph) * .5 + np.sin(ph * 2.003) * .22 + np.sin(ph * 1.5) * .16 + np.sin(ph * 3.01) * .05) * (.8 + .2 * np.sin(2 * np.pi * .11 * t_all))
drone = drone.astype(np.float32) * .16
mix[:, 0] += drone; mix[:, 1] += np.roll(drone, 37)

# 2) pulso cada 0.25 s: arpegio con el dibujo y el timbre de la escena
for k, s in enumerate(SC):
    root = ROOTS[k % len(ROOTS)] * 4; pat = PATTERNS[k % len(PATTERNS)]; tone = k % 4; j = 0; t = s['t0'] + .25
    while t < s['t1'] - .05:
        f = root * 2 ** (PENT[pat[j % len(pat)]] / 12)
        strong = j % 4 == 0
        add(pluck(f, .24 if strong else .16, tone), t, pan=(.5 if j % 2 else -.5), g=.085 if strong else .05)
        if j % 8 == 0: add(pluck(root / 2, .5, 0), t, 0, .10)                       # un bajo cada dos segundos
        j += 1; t += .25

# 3) cada corte: un soplo de ruido filtrado y un golpe grave suave
for k, s in enumerate(SC[1:], 1):
    d = .5; t = tt(d); nz = lowpass(rs.randn(len(t)).astype(np.float32), .08) * np.sin(np.pi * t / d) ** 2
    add(nz, s['t0'] - .25, 0, .5)
    add((np.sin(2 * np.pi * 60 * tt(.4) * (1 - tt(.4))) * np.exp(-tt(.4) / .1)).astype(np.float32), s['t0'], 0, .28)

# 4) cierre: notas que suben, cada medio segundo, y un acorde final que se apaga
end0 = SC[-1]['t0'] + 20.2
for i, st in enumerate([0, 3, 7, 10, 12, 15, 19, 22, 24, 27, 31, 34, 36]):
    add(pluck(220 * 2 ** (st / 12), .9, 1), end0 + i * .5, pan=(-.4 if i % 2 else .4), g=.11)
tc = tt(5.5); chord = sum(np.sin(2 * np.pi * 110 * 2 ** (st / 12) * tc) for st in [0, 7, 12, 15, 19, 24]) / 6
add((chord * np.minimum(1, tc / 1.2) * np.exp(-np.maximum(0, tc - 2.5) / 1.2)).astype(np.float32), end0 + 6.6, 0, .22)

# entrada y salida suaves, y volumen: pico a −1.5 dBFS sin saturar
fi, fo = int(1.2 * SR), int(2.5 * SR)
mix[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2; mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2
mix = np.tanh(mix * 1.6) / 1.6
mix *= 10 ** (-1.5 / 20) / max(1e-9, np.abs(mix).max())
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'mix.wav'), mix, SR, subtype='PCM_16')
print('mix', round(len(mix) / SR, 2), 's, pico', round(20 * np.log10(np.abs(mix).max()), 2), 'dBFS')

# la narración, como subtítulos
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
lines = EV['narr']
open(os.path.join(OUT, FILM + '.srt'), 'w', encoding='utf-8', newline='\n').write(
    '\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{txt}\n' for i, (a, b, txt) in enumerate(lines)))
print('srt', len(lines), 'líneas')
