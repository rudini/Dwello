"""Cuts a marketing video from the clips (#1445): pieces with their speed, crossfades, captions, voice, music.

    python3 docs/marketing-video/cut.py long|short|vertical   → build/marketing-video/dwello-<cut>.mp4

The vertical cut has a voice: the lines of reel.json, spoken by MiniMax (`mmx speech synthesize`), each starting with
the first piece of its group and shown as that group's caption. Its music is build/marketing-video/music-vertical.mp3
when the product owner supplied one; the other cuts, and the vertical one without that file, get music.py's track.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.environ.get("MV_BUILD") or os.path.join(HERE, "../../build/marketing-video/")
CLIPS, CAPTIONS = os.path.join(BUILD, "clips"), os.path.join(BUILD, "captions")
FADE = 0.4  # crossfade between pieces, seconds
REEL = json.load(open(os.path.join(HERE, "reel.json")))


def piece(clip, speed=1.0, start=0.0, end=None, captions=(), group=None):
    """A part of a clip, or a still of people/ (a .jpg): `end - start` seconds of it with a slow zoom, or those seconds
    of build/marketing-video/people/<name>.mp4 when the product owner made a clip of the still.
    captions: (name, from, to) in seconds of the piece as cut (after its speed), to < 0 counts from its end.
    group: a caption shown over all consecutive pieces of the same group."""
    return dict(clip=clip, speed=speed, start=start, end=end, captions=captions, group=group)


CUTS = {
    # the detailed demo, 2:23
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
    # 9:16 for Instagram, with the voice of reel.json: a landlady photographs an invoice, the KI reads it, the
    # statement goes out by e-mail with its QR-bill. The people are AI-generated (stills, or clips made of them), the
    # app is the real one.
    "vertical": [
        piece("hook.jpg", start=1.0, end=5.6, group="r1"),
        piece("photo.jpg", start=4.4, end=7.0, group="r2"),
        piece("m-upload-a", 2.0, start=1.0, end=7.0, group="r2"),
        piece("m-upload-b", 1.6, start=2.5, end=8.5, group="r2"),
        piece("m-statements", 2.0, start=14.0, end=22.0, group="r3"),
        piece("m-statements", 1.3, start=23.0, end=26.5, group="r3"),
        piece("m-send", 1.4, start=0.5, group="r4"),
        piece("v-pdf", 1.2, group="r4"),
        piece("done.jpg", start=4.6, end=7.8, group="r5"),
        piece("v-outro", group="r6"),
    ],
}


def duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]))


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def render(p, out):
    """One piece as a 30 fps clip"""
    if p["clip"].endswith(".jpg"):
        length = p["end"] - p["start"]
        clip = os.path.join(BUILD, "people", p["clip"][:-4] + ".mp4")
        if os.path.exists(clip):
            # the product owner's clip of this still (720x1280), from its second `start`
            ffmpeg("-ss", str(p["start"]), "-t", f"{length:.3f}", "-i", clip,
                   "-vf", "scale=1080:1920:flags=lanczos,fps=30,format=yuv420p",
                   "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-an", out)
            return
        frames = int(length * 30)
        # scaled up first, so the zoom moves by less than a pixel per frame
        zoom = (f"scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,"
                f"zoompan=z='1+0.07*on/{frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1080x1920:fps=30,format=yuv420p")
        ffmpeg("-i", os.path.join(HERE, "people", p["clip"]), "-vf", zoom, "-frames:v", str(frames),
               "-c:v", "libx264", "-crf", "16", "-preset", "medium", out)
        return
    src = os.path.join(CLIPS, p["clip"] + ".mp4")
    end = p["end"] if p["end"] is not None else duration(src)
    ffmpeg("-ss", str(p["start"]), "-t", f"{end - p['start']:.3f}", "-i", src,
           "-vf", f"setpts=(PTS-STARTPTS)/{p['speed']},fps=30,format=yuv420p",
           "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-an", out)


def groups(pieces, starts, lengths):
    """(group, start, end) of each run of consecutive pieces with one group"""
    for i, p in enumerate(pieces):
        if p["group"] and (i == 0 or pieces[i - 1]["group"] != p["group"]):
            last = i
            while last + 1 < len(pieces) and pieces[last + 1]["group"] == p["group"]:
                last += 1
            yield p["group"], starts[i], starts[last] + lengths[last] - FADE


def speak(work, spoken):
    """The voice track: each line of reel.json at the start of its group"""
    inputs, chain, mix = [], "", ""
    for k, line in enumerate(REEL["lines"]):
        at, until = spoken[line["id"]]
        mp3 = os.path.join(work, line["id"] + ".mp3")
        subprocess.run(["mmx", "speech", "synthesize", "--voice", REEL["voice"], "--emotion", REEL["emotion"],
                        "--speed", str(REEL["speed"]), "--text", line.get("say", line["text"]),
                        "--out", mp3, "--quiet"], check=True, stdout=subprocess.DEVNULL)
        if at + 0.3 + duration(mp3) > until + FADE:
            print(f"warning: line {line['id']} ({duration(mp3):.1f} s) is longer than its pieces ({until - at:.1f} s)")
        inputs += ["-i", mp3]
        chain += f"[{k}:a]adelay={int((at + 0.3) * 1000)}:all=1[a{k}];"
        mix += f"[a{k}]"
    voice = os.path.join(work, "voice.wav")
    ffmpeg(*inputs, "-filter_complex", f"{chain}{mix}amix=inputs={len(REEL['lines'])}:normalize=0[a]", "-map", "[a]", voice)
    return voice


def cut(name):
    pieces = CUTS[name]
    work = os.path.join(BUILD, f"pieces-{name}")
    os.makedirs(work, exist_ok=True)
    files, lengths = [], []
    for i, p in enumerate(pieces):
        files.append(os.path.join(work, f"{i:02d}.mp4"))
        render(p, files[-1])
        lengths.append(duration(files[-1]))

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
    spoken = {}
    for group, a, b in groups(pieces, starts, lengths):
        captions.append((group, a + 0.3, b - 0.1))
        spoken[group] = (a, b)

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
    music = os.path.join(BUILD, f"music-{name}.mp3")
    if not os.path.exists(music):
        music = os.path.join(BUILD, f"music-{name}.wav")
        subprocess.run([sys.executable, os.path.join(HERE, "music.py"), json.dumps(timeline), music], check=True)
    final = os.path.join(BUILD, f"dwello-{name}.mp4")
    encode = ["-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{total:.3f}", "-movflags", "+faststart", final]
    fade = f"afade=in:st=0:d=0.8,afade=out:st={total - 2.0:.3f}:d=2.0"
    if name == "vertical":
        # the music stays under the voice, both levelled first; padded with silence, should the track be shorter
        mix = (f"[1:a]loudnorm=I=-16:TP=-1.5,volume=0.2,{fade},apad[m];[2:a]loudnorm=I=-16:TP=-1.5[s];"
               "[m][s]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.9[a]")
        ffmpeg("-i", silent, "-i", music, "-i", speak(work, spoken), "-filter_complex", mix, *encode)
    else:
        ffmpeg("-i", silent, "-i", music, "-filter_complex", f"[1:a]loudnorm=I=-18:TP=-1.5,{fade}[a]", *encode)
    for i, p in enumerate(pieces):
        print(f"{starts[i]:7.2f}  {p['clip']}")
    print(f"{final}: {duration(final):.1f} s")


cut(sys.argv[1])
