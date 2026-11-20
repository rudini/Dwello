# Journey video

A talk as a video about how Dwello came about: «Wie vertraut man Code, den man nicht selbst geschrieben hat?» For developer colleagues, spoken by the product owner in German, with English subtitles. Hand-drawn situations with figures (the product owner and the five personas with egg heads, the agents as robots), and real screenshots pasted in like photos.

| Cut | Scenes | Length | Text |
|---|---|---|---|
| long | `scenes-long.mjs` (one file per act in `scenes/`) | about 15:30 | `sprechtext-long.md` |
| short | `scenes-short.mjs`: eight drawings of the long cut with a shorter text | about 1:10 | `sprechtext-short.md` |

What is rendered here is the animatic: the drawings with the English subtitles burned in, without sound. The product owner records his voice over it, reading `sprechtext-<cut>.md` or the German subtitles `build/journey-video/<cut>.de.srt`; a scene lasts as long as its sentence takes at about 13.5 characters per second.

## Make it

From the repository root. Needs `ffmpeg`, and once the drawing library and the handwriting font in the build folder:

```bash
npm install --prefix build/journey-video roughjs@4.6.6 @fontsource/kalam@5.3.0
node docs/journey-video/render.mjs long             # build/journey-video/long-animatic.mp4 (about 10 minutes)
node docs/journey-video/render.mjs long --stills    # one still per scene in contact sheets of nine, to check the drawings
node docs/journey-video/render.mjs long --only 5-9  # only these scenes
node docs/journey-video/render.mjs long --text      # writes sprechtext-long.md again after a text change
node docs/journey-video/render.mjs short
```

`JV_BUILD` sets another output folder and `JV_MODULES` another `node_modules` (both with a trailing slash).

## The parts

| File | Does |
|---|---|
| `figures.js` | the drawing kit loaded into the page: rough.js strokes that draw themselves, handwriting, pasted photos, props (paper, screen, desk, gate, lock, traffic light …) and the cast: `P` a standing person, `S` a person seated from the side on an office chair, `R` a robot; `ME`, `HELGA`, `MARCO`, `WEBER`, `SVEN`, `ANNA` are their looks |
| `scenes/*.mjs` | the scenes of each act: the German line, its English subtitle and the drawing made while it is spoken; `common.mjs` has the chapter card |
| `render.mjs` | puts the scenes into one page, seeks it frame by frame in Chromium (12 fps) and pipes the frames into ffmpeg; also the stills and the texts |

A scene's `draw(d, T, args, ROOT)` runs in the page, so it may use only its arguments and the page's globals; `T` is the scene's length in seconds, for timing a drawing by the share of the sentence (`q(0.5)`). The numbers in the text come from the repository on 19.11.2026: commits from `git log origin/main`, reports from `docs/reviews` and `docs/design/personas` in the git history, the metrics from `docs/architecture/`.
