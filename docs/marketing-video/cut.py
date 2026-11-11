"""Cuts a marketing video from the clips (#1445): pieces with their speed, crossfades, captions, music.

    python3 docs/marketing-video/cut.py long|short|vertical   → build/marketing-video/dwello-<cut>.mp4
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.environ.get("MV_BUILD") or os.path.join(HERE, "../../build/marketing-video/")
CLIPS, CAPTIONS = os.path.join(BUILD, "clips"), os.path.join(BUILD, "captions")
FADE = 0.4  # crossfade between pieces, seconds


def piece(clip, speed=1.0, start=0.0, end=None, captions=(), group=None):
    """A part of a clip. captions: (name, from, to) in the piece's own seconds, to < 0 counts from its end.
    group: a caption shown over all consecutive pieces of the same group."""
    return dict(clip=clip, speed=speed, start=start, end=end, captions=captions, group=group)


CUTS = {
    # the detailed demo, 2:24
    "long": [
        piece("intro"),
        piece("ch1"),
        piece("terminal"),
        piece("setup", 1.5, captions=[("setup", 0.4, -0.4)]),
        piece("ch2"),
        piece("gwr", 1.6, captions=[("gwr1", 0.5, 5.4), ("gwr2", 5.8, 16.4), ("gwr3", 17.5, -0.3)]),
        piece("ch3"),
        piece("upload-a", 1.25, captions=[("upa", 0.4, -0.2)]),
        piece("upload-b", 1.8, captions=[("upb1", 0.2, 13.8), ("upb2", 15.0, -0.3)]),
        piece("ch4"),
        piece("statements", 1.8, captions=[("st1", 0.3, 4.6), ("st2", 5.2, 14.0), ("st3", 15.2, 18.5), ("st4", 19.8, -0.3)]),
        piece("pdf"),
        piece("ch5"),
        piece("reports", 1.35, captions=[("rep", 0.3, -0.2)]),
        piece("analytics", 1.7, captions=[("ana", 0.2, -0.3)]),
        piece("outro"),
    ],
    # about a minute: the five highlights, 8 to 10 s each
    "short": [
        piece("short-intro"),
        piece("terminal", 1.6, group="s1"),
        piece("setup", 2.4, start=2.0, group="s1"),
        piece("gwr", 2.0, start=2.5, end=10.5, group="s2"),
        piece("gwr", 1.3, start=26.0, end=31.5, group="s2"),
        piece("upload-a", 1.8, start=1.0, end=9.5, group="s3"),
        piece("upload-b", 1.6, start=2.0, end=9.5, group="s3"),
        piece("upload-b", 1.3, start=25.5, group="s3"),
        piece("statements", 2.2, start=8.5, end=21.0, group="s4"),
        piece("statements", 1.4, start=26.0, end=31.5, group="s4"),
        piece("pdf", 1.15),
        piece("analytics", 1.8, start=2.5, group="s5"),
        piece("outro"),
    ],
    # 9:16, one story: an invoice PDF, the KI, the statement, the QR-bill
    "vertical": [
        piece("v-intro"),
        piece("m-upload-a", 1.3, group="v1"),
        piece("m-upload-b", 1.5, group="v2"),
        piece("m-statements", 2.0, captions=[("v3", 0.3, 10.5), ("v4", 11.2, -0.3)]),
        piece("v-pdf"),
        piece("v-outro"),
    ],
}


def duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]))


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def cut(name):
    pieces = CUTS[name]
    work = os.path.join(BUILD, f"pieces-{name}")
    os.makedirs(work, exist_ok=True)
    files, lengths = [], []
    for i, p in enumerate(pieces):
        src = os.path.join(CLIPS, p["clip"] + ".mp4")
        end = p["end"] if p["end"] is not None else duration(src)
        out = os.path.join(work, f"{i:02d}.mp4")
        ffmpeg("-ss", str(p["start"]), "-t", f"{end - p['start']:.3f}", "-i", src,
               "-vf", f"setpts=(PTS-STARTPTS)/{p['speed']},fps=30,format=yuv420p",
               "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-an", out)
        files.append(out)
        lengths.append(duration(out))

    starts, t = [], 0.0
    for length in lengths:
        starts.append(t)
        t += length - FADE
    total = t + FADE

    # captions on the final timeline: a piece's own ones, and a group's over its consecutive pieces
    captions = []
    for i, p in enumerate(pieces):
        for cap, a, b in p["captions"]:
            captions.append((cap, starts[i] + a, starts[i] + (lengths[i] + b if b < 0 else b)))
        if p["group"] and (i == 0 or pieces[i - 1]["group"] != p["group"]):
            last = i
            while last + 1 < len(pieces) and pieces[last + 1]["group"] == p["group"]:
                last += 1
            captions.append((p["group"], starts[i] + 0.3, starts[last] + lengths[last] - FADE - 0.1))

    inputs, chain, prev = [], "", "0:v"
    for f in files:
        inputs += ["-i", f]
    for i in range(1, len(files)):
        chain += f"[{prev}][{i}:v]xfade=transition=fade:duration={FADE}:offset={starts[i]:.3f}[x{i}];"
        prev = f"x{i}"
    for k, (cap, a, b) in enumerate(captions):
        n = len(files) + k
        inputs += ["-loop", "1", "-t", f"{total:.3f}", "-i", os.path.join(CAPTIONS, cap + ".png")]
        chain += (f"[{n}:v]format=rgba,fade=in:st={a:.3f}:d=0.35:alpha=1,fade=out:st={b - 0.35:.3f}:d=0.35:alpha=1[c{k}];"
                  f"[{prev}][c{k}]overlay=0:0:shortest=1[o{k}];")
        prev = f"o{k}"
    chain += f"[{prev}]fade=in:st=0:d=0.5,fade=out:st={total - 0.8:.3f}:d=0.8[v]"
    silent = os.path.join(BUILD, f"silent-{name}.mp4")
    ffmpeg(*inputs, "-filter_complex", chain, "-map", "[v]", "-t", f"{total:.3f}",
           "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", silent)

    timeline = {"total": total, "starts": starts}
    json.dump(timeline, open(os.path.join(BUILD, f"timeline-{name}.json"), "w"))
    music = os.path.join(BUILD, f"music-{name}.wav")
    subprocess.run([sys.executable, os.path.join(HERE, "music.py"), json.dumps(timeline), music], check=True)
    final = os.path.join(BUILD, f"dwello-{name}.mp4")
    ffmpeg("-i", silent, "-i", music, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
           "-af", "loudnorm=I=-18:TP=-1.5", "-shortest", "-movflags", "+faststart", final)
    for i, p in enumerate(pieces):
        print(f"{starts[i]:7.2f}  {p['clip']}")
    print(f"{final}: {duration(final):.1f} s")


cut(sys.argv[1])
