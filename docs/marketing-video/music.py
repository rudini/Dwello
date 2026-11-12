"""A calm, optimistic background track synthesized from scratch (no samples, no licence), as long as a cut (#1445).

    python3 music.py '<timeline json from cut.py>' out.wav

Pads and a plucked arpeggio from the start, bass from the second piece, kick and shaker from the third piece until
the end card, whose chord rings out. Needs numpy and scipy.
"""
import json, sys, wave
import numpy as np
from scipy.signal import lfilter

timeline = json.loads(sys.argv[1])
TOTAL = timeline["total"] + 0.5
STARTS = timeline["starts"]
BASS_FROM, DRUMS_FROM, OUTRO = STARTS[1], STARTS[2], STARTS[-1]
SR = 44100
BEAT = 60 / 98
BAR = 4 * BEAT
n = int(TOTAL * SR)
left, right = np.zeros(n), np.zeros(n)

# I – V – vi – IV in D major, one bar each
CHORDS = [[62, 66, 69, 74], [57, 61, 64, 69], [59, 62, 66, 71], [55, 59, 62, 67]]
BASS = [38, 33, 35, 31]
rng = np.random.default_rng(7)


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    return lfilter([1 - a], [1, -a], x)


def add(sound, at, gain_left, gain_right):
    i = int(at * SR)
    if i >= n:
        return
    sound = sound[: n - i]
    left[i : i + len(sound)] += sound * gain_left
    right[i : i + len(sound)] += sound * gain_right


def pad(freqs, length):
    t = np.arange(int(length * SR)) / SR
    saw = sum((2 * ((f * 2 ** (d / 12) * t) % 1) - 1) * 0.25 for f in freqs for d in (-0.12, 0.0, 0.12))
    return lowpass(saw, 900) * np.minimum(1, t / 0.6) * np.minimum(1, (length - t) / 0.5)


def pluck(f, length=0.9):
    t = np.arange(int(length * SR)) / SR
    tone = sum(np.sin(2 * np.pi * f * k * t) / k**1.6 for k in range(1, 6))
    return tone * np.exp(-t * 6) * np.minimum(1, t / 0.004)


def bass(f, length):
    t = np.arange(int(length * SR)) / SR
    tone = np.tanh(1.6 * np.sin(2 * np.pi * f * t)) * 0.8 + 0.2 * np.sin(4 * np.pi * f * t)
    return tone * np.exp(-t * 1.5) * np.minimum(1, t / 0.01)


def kick():
    t = np.arange(int(0.35 * SR)) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def shaker():
    t = np.arange(int(0.08 * SR)) / SR
    return lfilter([1, -1], [1, -0.6], rng.standard_normal(len(t))) * np.exp(-t * 60) * 0.5


for b in range(int(TOTAL / BAR) + 1):
    t0, chord = b * BAR, CHORDS[b % 4]
    if t0 < OUTRO + BAR:
        add(pad([hz(m) for m in chord], BAR + 0.4), t0, 0.05, 0.05)
    for k, note in enumerate([0, 2, 1, 3, 2, 1, 3, 2]):
        at = t0 + k * BEAT / 2
        if at > OUTRO + 2 * BAR:
            break
        pan = 0.35 + 0.3 * (k % 2)
        add(pluck(hz(chord[note] + 12)), at, 0.22 * (1 - pan), 0.22 * pan)
    if BASS_FROM <= t0 < OUTRO + BAR:
        for k in (0, 2.5):
            add(bass(hz(BASS[b % 4]), BEAT * 1.5), t0 + k * BEAT, 0.16, 0.16)
    if DRUMS_FROM <= t0 < OUTRO:
        for k in range(4):
            gain = 0.22 if k in (0, 2) else 0.12
            add(kick(), t0 + k * BEAT, gain, gain)
        for k in range(8):
            add(shaker(), t0 + k * BEAT / 2 + 0.01, 0.06 if k % 2 else 0.035, 0.035 if k % 2 else 0.06)

# the end chord rings out
add(pad([hz(m) for m in CHORDS[0]] + [hz(50)], 4.5), min(OUTRO + BAR, TOTAL - 4.5), 0.06, 0.06)

# a little space: a ping-pong delay
delay = int(BEAT * 0.75 * SR)
mix = np.stack([left.copy(), right.copy()], axis=1)
mix[delay:, 0] += 0.22 * right[:-delay]
mix[delay:, 1] += 0.22 * left[:-delay]
t = np.arange(n) / SR
mix *= (np.minimum(1, t / 1.5) * np.clip((TOTAL - t) / 2.5, 0, 1))[:, None]
mix /= np.max(np.abs(mix)) / 0.89
with wave.open(sys.argv[2], "wb") as out:
    out.setnchannels(2)
    out.setsampwidth(2)
    out.setframerate(SR)
    out.writeframes((mix * 32767).astype(np.int16).tobytes())
