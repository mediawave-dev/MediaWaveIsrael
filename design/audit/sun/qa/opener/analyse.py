# D297: the opener's sea, judged the way a phone hears it (nobody listens here, so the numbers have to).
# Lessons from the pen film's sound (D232): energy under 400 Hz does not exist on a phone; what grates is a click
# (a level jump of 10 dB within 6 ms), a pitch that sweeps, a knock far above the bed.
#   python analyse.py out/sea.wav
import sys, numpy as np
from scipy.io import wavfile
from scipy import signal

rate, x = wavfile.read(sys.argv[1])
x = x.astype(np.float64) / 32768.0
mono = x.mean(axis=1) if x.ndim > 1 else x
print(f"length {len(mono)/rate:.2f} s, peak {20*np.log10(np.abs(x).max()+1e-12):.1f} dBFS, rms {20*np.log10(np.sqrt((mono**2).mean())+1e-12):.1f} dBFS")

f, P = signal.welch(mono, rate, nperseg=8192)
tot = P.sum()
for lo, hi in [(0, 200), (200, 400), (400, 1000), (1000, 2500), (2500, 5000), (5000, 10000), (10000, 22050)]:
    print(f"  {lo:>5}-{hi:<5} Hz  {100*P[(f>=lo)&(f<hi)].sum()/tot:5.1f}% of the energy")
print(f"  under 400 Hz: {100*P[f<400].sum()/tot:.1f}% (a phone plays none of it)")

# the phone's ear: nothing under 400 Hz, then A-weighting
sos = signal.butter(4, 400, 'hp', fs=rate, output='sos')
ph = signal.sosfilt(sos, mono)
fa = np.array([20.6, 107.7, 737.9, 12194.0])
def aw(fr):
    fr = np.maximum(fr, 1e-6); f2 = fr**2
    return (fa[3]**2 * f2**2) / ((f2 + fa[0]**2) * np.sqrt((f2 + fa[1]**2) * (f2 + fa[2]**2)) * (f2 + fa[3]**2)) * 1.2589
S = np.fft.rfft(ph); ph = np.fft.irfft(S * aw(np.fft.rfftfreq(len(ph), 1/rate)), len(ph))
fp, Pp = signal.welch(ph, rate, nperseg=8192)
print(f"as a phone hears it: centroid {np.sum(fp*Pp)/np.sum(Pp):.0f} Hz, rms {20*np.log10(np.sqrt((ph**2).mean())+1e-12):.1f} dB")

def env(sig, ms):
    n = int(rate * ms / 1000); k = len(sig) // n
    return 20*np.log10(np.sqrt((sig[:k*n].reshape(k, n)**2).mean(axis=1)) + 1e-9)
e250 = env(ph, 250)
print("level every 0.25 s (dB):")
print("  " + " ".join(f"{v:5.0f}" for v in e250))
bar = e250 - e250.max()
print("  " + " ".join(("#" * max(0, int((v + 36) / 6))).rjust(5) for v in bar))

# clicks: a jump of 10 dB or more between neighbouring 6 ms frames, where there is anything to hear
e6 = env(ph, 6)
loud = e6 > (e6.max() - 40)
jumps = np.abs(np.diff(e6))
bad = np.where((jumps >= 10) & loud[1:] )[0]
print(f"clicks (>= 10 dB in 6 ms): {len(bad)}" + ("  at " + ", ".join(f"{i*0.006:.2f}s (+{jumps[i]:.0f})" for i in bad[:8]) if len(bad) else ""))
print(f"  largest jump where audible: {jumps[loud[1:]].max():.1f} dB")

# knocks: the plips against the bed around them (20 ms frames against the median of the second around)
e20 = env(ph, 20); n = len(e20); worst = 0; at = 0
for i in range(n):
    a, b = max(0, i-25), min(n, i+25)
    d = e20[i] - np.median(e20[a:b])
    if e20[i] > e20.max() - 30 and d > worst: worst, at = d, i
print(f"the sharpest thing over its surroundings: +{worst:.1f} dB at {at*0.02:.2f} s (a knock is +20)")

# does the colour move? centroid per half second, phone band
print("centroid every 0.5 s (Hz):")
h = int(rate/2); cs = []
for i in range(0, len(ph)-h, h):
    ff, pp = signal.welch(ph[i:i+h], rate, nperseg=2048); cs.append(np.sum(ff*pp)/np.sum(pp))
print("  " + " ".join(f"{c:5.0f}" for c in cs))
