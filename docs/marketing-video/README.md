# Marketing videos

The tools that film and cut Dwello's marketing videos (#1445). The scenes come from the real app with the demo data: the address search asks the real Gebäuderegister, and a real vision model reads the uploaded invoices. The video files themselves are not in the repository; the product owner uploads them to YouTube and Instagram (texts: `youtube.md`).

| Cut | File | Length | What |
|---|---|---|---|
| short | `dwello-short.mp4` | 0:59, 1920×1080 | the five highlights, 8 to 10 s each; linked from the landing page |
| long | `dwello-long.mp4` | 2:23, 1920×1080 | the detailed demo, a chapter card per highlight |
| vertical | `dwello-vertical.mp4` | 0:37, 1080×1920 | for Instagram, with a voice: a landlady photographs an invoice, the KI reads it, the statement goes out by e-mail with its QR-bill; AI-generated stills of her alternate with the real app in the phone view (390 px) |

Everything goes to `build/marketing-video/` (`MV_BUILD` sets another folder, with a trailing slash): `clips/`, `captions/`, the cuts, their thumbnails `thumbnail-<cut>.png` and timelines `timeline-<cut>.json`.

## Make them again

After a UI change, from the repository root (PostgreSQL running, as for the persona stack). Needs `ffmpeg`, `pdftoppm` (poppler), Python with `numpy` and `scipy`, and for the vertical cut's voice the MiniMax CLI `mmx` with a key.

```bash
node docs/marketing-video/invoices.mjs                     # the three invoices to upload, as PDF and as phone photos
bash docs/marketing-video/stack.sh                         # demo data, a real KI (MV_LLM_URL, MV_LLM_MODEL, MV_LLM_KEY)
node docs/marketing-video/scenes.mjs gwr upload statements reports
bash docs/marketing-video/stack.sh --no-build              # fresh demo data again: the phone makes the same statements
node docs/marketing-video/scenes.mjs mobile
bash docs/marketing-video/stack.sh --fresh --no-build      # a fresh installation for «Dwello einrichten»
node docs/marketing-video/scenes.mjs setup
node docs/marketing-video/html-scenes.mjs                  # title, terminal, PDF and end cards, captions, thumbnails
python3 docs/marketing-video/cut.py short                  # and long, vertical
```

`stack.sh` starts `docs/design/tools/persona-stack.sh` on :3300 and restarts its backend: with a KI that reads images (default `qwen/qwen3-vl-30b-a3b-instruct` through OpenRouter), or with `--fresh` with the Einrichtungscode `K7QM-3XRP` the terminal scene shows. The app scenes need Alpenblick's statements of 2025 not made yet, so restart it before each recording. The KI's reading is not filmed and usually takes 5 to 30 s, through OpenRouter at times several minutes; a scene stops after almost 5 minutes, and then `stack.sh` and that scene run again. `scenes.mjs statements` also saves the statement PDF the PDF scene shows, so film the app scenes before `html-scenes.mjs`.

## The parts

| File | Does |
|---|---|
| `rec.mjs` | a signed-in Chromium with a visible pointer (a fingertip on the phone), and the recorder: every frame Chromium paints, with its time, into a 30 fps clip |
| `scenes.mjs` | the app scenes: GWR, upload, statements (and their PDF), reports, setup, and the phone's |
| `html/scenes.html`, `html-scenes.mjs` | the scenes between them (title, chapter cards, terminal, PDF, end card), the captions and the thumbnails |
| `invoices.mjs` | the invoices of made-up suppliers the KI reads, as PDF and as photos of the sheet on a table |
| `reel.json` | the vertical cut's voice (a MiniMax voice id) and its lines: `cut.py` has them spoken (`mmx speech synthesize`), `html-scenes.mjs` makes them its captions |
| `people/` | the landlady of the vertical cut: three AI-generated stills (MiniMax `image-01`, the second and third with the first as subject reference), which `cut.py` shows with a slow zoom |
| `cut.py` | each cut: its pieces with speed and crop, crossfades, captions on the final timeline, music |
| `music.py` | the background track of the long and short cuts, synthesized for each cut's length: no samples, no licence. The vertical cut plays `build/marketing-video/music-vertical.mp3` under its voice, a track the product owner supplies (not in the repository); without that file it gets the synthesized one |

What the cuts show, decided in #1445: the terminal scene is an animation of the real command and messages of `install/macos.sh` with the download cut short («Download gekürzt»), since filming a real installation needs Docker's images; the app clips run up to 2.4 times as fast, and the KI's reading is cut out. The vertical cut uploads all three invoices and shows one: with only one, the tenants get money back, and a refund has no QR-bill. Its people are stills, not clips: the MiniMax plan of the first run had no video generation; with one, clips of the same woman can take their place in `cut.py`. Instagram wants AI-generated people labelled when uploading (`youtube.md`).
