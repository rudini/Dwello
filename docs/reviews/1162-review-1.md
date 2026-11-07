# Code-Review #1162, Runde 1 (df1a2fa4a~1..df1a2fa4a)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: alle 7 geänderten Dateien gelesen. Layout-Wächter (`closest('[data-sveltekit-keepfocus]')`) greift nur bei Listen-Navigation und nur für die Statuskacheln (einzige Fundstelle in `src`). Die Kachel bleibt über die Navigation dasselbe DOM-Element (keyed each), deshalb bleibt der Fokus auf ihr. Das Szenario ist ohne die Änderung bei 390×844 (Kachel aus dem Bild) und bei 960×600 (Fokus auf der Überschrift) rot, und zwar bei Wahl und Aufheben je für sich. Der DOM-Test ist ohne den Layout-Wächter rot. Keine neuen Texte, Bildschirme oder Zustände, also bleiben `messages/*.json`, `screens.json` und die a11y- und Sprachen-Features unverändert. Die Screenplay-Schichten sind eingehalten (Steps rufen nur Tasks und Questions auf; die Questions liefern Werte: Anteil im Fenster, `data-testid` des fokussierten Elements). Der Task wartet auf die URL ohne `status`. Kein bestehender Step und kein bestehendes Szenario wurde gelockert. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Vom Aufrufer gemeldet: Szenario «Der gewählte Statusfilter bleibt im Bild» (390×844, 960×600) rot, dann grün; DOM-Test «behält den Fokus auf einem Filter, der ihn behalten will» rot ohne Layout-Änderung, dann grün; E2E chromium `statements.feature` 22 bestanden; accessibility- und sprachen-bildschirme-Zeilen «statements » 14 bestanden; `bun run lint`, `bun run check`, `bun run fitness` sauber; vitest `layout-hydrated` und `statement-pages` 250 bestanden.
- Das `onclick`, das den Link fokussiert (`StatusFilter.svelte:62`, für WebKit), hat nur einen Weg, sich zu zeigen: das neue Szenario im Projekt `webkit` (`playwright.config.ts:286`). Chromium fokussiert Links beim Klick auch ohne `onclick`. Gemeldet ist nur ein Lauf in Chromium, also ist das Szenario in WebKit und Firefox nicht bestätigt, weder grün noch ohne die Zeile rot. CI führt beide Projekte aus.
- Ob ein Screenreader die neue Trefferzahl nach dem Filtern noch ansagt (vorher kam sie über den Fokus auf der Überschrift `list-results`), ist nicht geprüft. Die Anforderung erlaubt ausdrücklich den Fokus auf der Kachel. Eine Live-Region für die Zahl gibt es in `ResultList.svelte` nicht.
