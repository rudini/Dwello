# Marco – neues Zeichen von Dwello (#730), Tab-Icon und Home-Bildschirm

Persona: Marco, 38, meist am Smartphone, wenig Zeit, viele Tabs offen, Dwello als Verknüpfung auf dem Home-Bildschirm.
Geprüft wurden nur die Dateien, nicht die App: `static/favicon.svg`, `static/apple-touch-icon.png`, `static/icon-192.png`, `static/icon-512.png` (aus `static/manifest.webmanifest`). Gezeichnet mit Playwright/Chromium in `/tmp/claude-0/-home-user-Dwello/a4b0cfef-0ed3-5587-ad4f-4b883cd068fa/scratchpad/marco-730/` (Skripte `render.mjs`, `zoom.mjs`, Bilder `tabs-dpr1.png`, `tabs-dpr2.png`, `zoom16-dpr1.png`, `many-tabs.png`, `homescreen.png`, `raw.png`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Tab-Leiste, 16 px | Das Zeichen ist ein allgemeines Haus-Symbol (weisses Umriss-Haus mit Tür auf petrolfarbenem Quadrat), ohne etwas, das nur Dwello hat. Bei vielen offenen Tabs erkenne ich «ein Haus», aber nicht sicher «Dwello»: ein Immobilienportal oder eine Smart-Home-App mit Haus-Favicon daneben wäre leicht zu verwechseln. Nur die Farbe unterscheidet es dann. |

## Beobachtungen

- **Tab-Icon 16 px, normale Bildschirmdichte (1×):** Das Haus ist als Haus erkennbar, aber die Linien werden zu hellgrauen, verwaschenen Pixeln; die Tür verschmilzt fast mit dem Dach-Umriss (`zoom16-dpr1.png`, 25-fach vergrössert). Auf 2× (Handy, Retina) ist es scharf und sauber (`tabs-dpr2.png`).
- **Tab-Icon 32 px:** auf allen drei Hintergründen klar, Haus und Tür gut lesbar.
- **Helle Tab-Leiste #F1F3F4:** das petrolfarbene Quadrat hebt sich gut ab (Kontrast Quadrat zu Hintergrund etwa 7:1).
- **Dunkle Tab-Leiste #202124 / #35363A:** das Quadrat selbst geht fast im Hintergrund unter (etwa 2,1:1 bzw. 1,6:1), man sieht vor allem das weisse Haus. Das reicht zum Erkennen, die Kachelform ist aber kaum sichtbar.
- **Unter 20 bunten Tab-Icons** (`many-tabs.png`, Platzhalter-Quadrate) finde ich Dwello schnell, weil es als einziges ein weisses Symbol trägt; das sagt aber wenig über echte Favicons anderer Seiten.
- **Home-Bildschirm, 60 px:** `apple-touch-icon.png`, `icon-192.png` und `icon-512.png` sehen gleich aus und sind auf hellem (beige, hellgrau) und dunklem Hintergrund (schwarz, dunkelgrau) klar: grosses weisses Haus, gut zentriert. Mit iOS-Abrundung und auch kreisrund zugeschnitten bleibt das Haus vollständig (`homescreen.png`). Mit dem Namen «Dwello» darunter erkenne ich die Verknüpfung sofort.
- **Dunkelblauer Hintergrund (#1B3A4B):** die Kachel verschwimmt fast mit dem Hintergrund (etwa 1,5:1), das weisse Haus trägt allein. Erkennbar, aber die Kachelkante fehlt.
- Die PNGs sind randlos quadratisch und vollflächig petrol, ohne Transparenz (`raw.png`); iOS rundet sie selbst ab, das passt.
- Im Manifest steht bei den Icons kein `purpose` (z. B. `maskable`). Android könnte das Icon deshalb verkleinert in einen weissen Rahmen setzen statt es zuzuschneiden; im Kreis-Zuschnitt meiner Darstellung läge das Haus aber sicher innerhalb.
- Manifest: `background_color` ist dasselbe Petrol wie die Kachel, `display` ist `browser`.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 6 Schritte (Dateien ansehen, zwei Render-Skripte, fünf Bilder anschauen).

## Ablauf

- Tab-Icon 16 px bei 1×: erwartet ein scharfes weisses Haus; gesehen ein Haus aus grauen, weichen Pixeln, Tür kaum getrennt vom Umriss.
- Dunkle Tab-Leiste und dunkelblaues Hintergrundbild: erwartet eine sichtbare Kachel; gesehen nur das weisse Haus, die Kachel verschwindet fast im Hintergrund.
- Viele Tabs: erwartet ein Zeichen, das «Dwello» sagt; gesehen ein Haus, das auch zu jeder anderen Wohn- oder Immobilienseite passen würde (P-1).

## Vorschläge

- **P-1:** `favicon.svg` neben Favicons anderer Wohn-Seiten (z. B. Immobilienportale, Smart-Home) in einer Tab-Leiste bei 16 px anschauen. Helfen würde ein Merkmal, das nur Dwello hat, z. B. ein «D» in oder statt der Tür, oder eine eigene Form des Hauses; für 16 px dabei dickere Linien bzw. eine vereinfachte Variante ohne feine Tür, damit sie bei 1× nicht verwischt.

## Nicht geprüft

- Echte Tab-Leiste und echter Home-Bildschirm: headless Chromium zeichnet keine Tab-Leiste, und ein echtes iPhone/Android habe ich nicht; ich habe beides mit HTML nachgebaut.
- Vergleich mit echten Favicons anderer Seiten: nur farbige Platzhalter-Quadrate verwendet, keine fremden Favicons geladen.
- Wie Android ein Icon ohne `purpose: maskable` tatsächlich darstellt (weisser Rahmen oder nicht): nur der Kreis-Zuschnitt simuliert.
