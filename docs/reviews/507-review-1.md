# Code-Review #507, Runde 1 (b871708..575416f)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde (kein Blocker, Major oder Minor). |

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/statement-pages.dom.test.ts` (181), `bunx vitest run --changed origin/main` (725), die Tests, die `messages/*.json` lesen (633), E2E `statement-detail.feature` chromium + api (100): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rot vor der Änderung: nur durch Lesen geprüft. Beide DOM-Tests und das Szenario erwarten «Anteil nach Heizprofil: … %» und schliessen «Mietstage» aus; auf b871708 rendert `partText` für jede Rechnung «Ihre Mietstage {days} von {total} Tagen» (`src/routes/statements/[id]/LineInvoices.svelte`, alte Zeilen 16–28), sie schlagen dort also fehl.
- Die vier neuen Texte erscheinen auf keinem Bildschirm aus `tests/a11y/screens.json`: `statement-parts-detail` (Greta, `tests/e2e/fixtures/screens.ts:173–184`) wird ohne Heizprofil erstellt, also prüft `sprachen-bildschirme.feature` fr/it/en dieser Texte nicht. Kein Befund: es ist kein neuer Zustand (dieselbe Liste, nur ein anderer Satz je Rechnung), und die Übersetzungen entsprechen wörtlich `partProfileRun` des PDFs (`backend/src/services/pdf.service.ts:108, 227, 346, 465`) und `docs/design/i18n-begriffe.md:70`.

Geprüft: alle 8 geänderten Dateien; Texte wie das PDF (`partLine`, `pdf.service.ts:986–1000`: Kopf bis `{amount}` samt Tankbestand/«davon», dann «Anteil nach Heizprofil: {percent} %»; der Zusatz «(siehe Heiz- und Warmwasserkosten)» fehlt auf der Seite, die Anforderung verlangt mindestens den Anteil); Rückfall auf Tage ohne `part.profile` unverändert; Fachbegriff «Anteil nach Heizprofil» aus `UBIQUITOUS_LANGUAGE.md:148`; alle vier Sprachen; Szenario ohne `@wip`, Negativprüfung «Mietstage» mit positivem Anker davor, neuer Schritt ruft nur die Question `invoicesOfPosition`; Commit-Subject (49 Zeichen); keine unverwandten Änderungen; ponytail-review: nichts Ungenutztes, kein kopierter Helfer.
