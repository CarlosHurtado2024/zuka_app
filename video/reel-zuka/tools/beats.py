"""Rejilla de pulsos de una pista para sincronizar el reel (librosa, en video/.venv-audio).
    video/.venv-audio/Scripts/python.exe -X utf8 video/reel-zuka/tools/beats.py <pista.mp3> [inicio_s]
Ajusta bpm y fase por mínimos cuadrados sobre los pulsos detectados, mide qué fracción de los pulsos de la
rejilla cae a menos de 40 ms de un ataque real (cobertura) y escribe public/audio/beats.json."""
import sys, json, os
import numpy as np, librosa

src = sys.argv[1]; start = float(sys.argv[2]) if len(sys.argv) > 2 else None
y, sr = librosa.load(src, sr=22050, mono=True)
dur = len(y) / sr
env = librosa.onset.onset_strength(y=y, sr=sr)
tempo, beats = librosa.beat.beat_track(onset_envelope=env, sr=sr)
bt = librosa.frames_to_time(beats, sr=sr)
k = np.arange(len(bt)); A = np.vstack([k, np.ones(len(k))]).T
period, phase = np.linalg.lstsq(A, bt, rcond=None)[0]
bpm = 60 / period
on = librosa.onset.onset_detect(onset_envelope=env, sr=sr, units='time')
grid = phase + period * np.arange(int((dur - phase) / period))
cov = float(np.mean([np.min(np.abs(on - g)) < 0.04 for g in grid]))
# energía por compás de 4: dónde entra la pista con todo
rms = librosa.feature.rms(y=y)[0]; rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr)
bars = [(round(float(grid[i]), 2), round(float(rms[(rt >= grid[i]) & (rt < grid[min(i + 4, len(grid) - 1)])].mean()), 4)) for i in range(0, len(grid) - 4, 4)]
print(f'duración {dur:.1f}s  bpm {bpm:.3f}  fase {phase:.3f}s  cobertura {cov:.2f}')
print('compases (inicio, energía):', bars[:28])
if start is not None:
    i0 = int(np.argmin(np.abs(grid - start)))
    out = {'src': os.path.basename(src), 'bpm': round(float(bpm), 4), 'period': round(float(period), 5), 'start': round(float(grid[i0]), 4), 'coverage': round(cov, 3)}
    dst = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'audio'); os.makedirs(dst, exist_ok=True)
    json.dump(out, open(os.path.join(dst, 'beats.json'), 'w'), indent=1); print('beats.json', out)
