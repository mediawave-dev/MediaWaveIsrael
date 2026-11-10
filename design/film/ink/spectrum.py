# How harsh a pen sound is, in numbers (nobody here can listen to it):
#   python spectrum.py a.wav [b.wav ...]
# Everything is measured the way a phone hears it: A-weighted (the ear's own curve) and with nothing under 400 Hz
# (a small speaker has none). Per file:
#   bands      where the energy that is left sits
#   centroid   the middle of that spectrum while the pen writes, and how far it wanders from moment to moment
#              (a sound whose pitch sweeps with every stroke wanders a lot)
#   crest      the loudest moment against the average (clicks and knocks raise it)
#   jumps      how many times a second the level leaps 10 dB within 6 ms (each one is a click or a knock)
import sys, wave
import numpy as np

BANDS = [(400, 1000), (1000, 2000), (2000, 4000), (4000, 8000), (8000, 24000)]


def a_weight(f):
    f2 = f * f
    ra = (12194 ** 2 * f2 * f2) / ((f2 + 20.6 ** 2) * np.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2)) * (f2 + 12194 ** 2))
    return ra / ra[np.argmin(np.abs(f - 1000))]


for path in sys.argv[1:]:
    w = wave.open(path, 'rb')
    sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
    x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768
    x = x.reshape(-1, ch).mean(1)
    # the phone's ear, applied in the frequency domain to the whole file
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / sr)
    X *= a_weight(np.maximum(f, 1)) * (f >= 400)
    y = np.fft.irfft(X, len(x))
    win, hop = 2048, 512
    frames = np.lib.stride_tricks.sliding_window_view(y, win)[::hop] * np.hanning(win)
    P = np.abs(np.fft.rfft(frames, axis=1)) ** 2
    ff = np.fft.rfftfreq(win, 1 / sr)
    e = P.sum(1)
    loud = e > np.percentile(e, 55)  # the strokes, not the pauses
    S = P[loud].mean(0)
    shares = [S[(ff >= a) & (ff < b)].sum() / S.sum() for a, b in BANDS]
    cent = (P[loud] * ff).sum(1) / P[loud].sum(1)
    rms = np.sqrt((y ** 2).mean())
    peak = np.abs(y).max()
    k = int(sr * 0.003)
    lvl = 10 * np.log10(np.convolve(y ** 2, np.ones(k) / k, 'same')[::k] + 1e-9)
    floor = np.percentile(lvl, 60)
    jumps = int(((lvl[2:] - lvl[:-2] > 10) & (lvl[2:] > floor)).sum())
    print(path)
    print('  ' + '  '.join(f'{a}-{b}: {100 * s:4.1f}%' for (a, b), s in zip(BANDS, shares)))
    print(f'  centroid {cent.mean():5.0f} Hz, wandering {cent.std():4.0f} Hz   level {20 * np.log10(rms):5.1f} dB(A)   peak {20 * np.log10(peak):5.1f}   crest {20 * np.log10(peak / rms):4.1f} dB   jumps {jumps / (len(x) / sr):4.1f} a second')
