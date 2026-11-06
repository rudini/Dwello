# Code-Review #1146, Runde 1 (cb86a4ac9~1..cb86a4ac9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/lib/ui/Stepper.svelte:26-27, tests/e2e/features/statement-generate.feature:907-918 | Dass der aktuelle Schritt sein längstes Wort ganz behält (`shrink`/`wrap`), prüft kein Test: das Szenario prüft nur Schritt 5 («Erstellen»), der DOM-Test nur `xl:not-sr-only`/`md:not-sr-only` |
| C-2 | Minor | src/lib/ui/Stepper.svelte:39-44 | Der Blockkommentar stimmt mit Angaben nicht mehr: «Up to xl the numbers without names» gilt jetzt für jede Breite, und «min-w-0 and hyphenation keep long names inside their step» gilt nicht mehr für den aktuellen Schritt |
| C-3 | Minor | src/lib/ui/Stepper.svelte:48, 75, 88 | `shrink`/`wrap` gelten auch ohne Angaben: beim Mietvertrags-Assistenten verliert der aktuelle Schritt `min-w-0` und die Silbentrennung (md bis xl und ab xl). Das widerspricht der Aussage «ohne Angaben unverändert», und kein Test deckt es ab |

## C-1 (Major)

Die Änderung macht zwei Dinge:
- (a) `wide`: mit Angaben werden die Namen der anderen Schritte auch ab xl nur Screenreadern genannt (`sr-only` mit `white-space: nowrap`, darum bricht dort kein Wort um);
- (b) `shrink`/`wrap`: der aktuelle Schritt verliert `min-w-0`, `hyphens-auto` und `break-words`.

Das Szenario prüft nur auf Schritt 5. Der aktuelle Name «Erstellen» ist dort kurz, und alle übrigen Namen sind `sr-only`. Es kann also nur an (a) rot werden. So ist das Rot zu lesen, das der Aufrufer meldet: «Abrechnungsperiode» und «Verwaltungspauschale» brachen als Namen *erledigter* Schritte.

Der DOM-Test (`ui-navigation-parts.dom.test.ts:77-96`) prüft ebenfalls nur die Klassen `xl:not-sr-only`/`md:not-sr-only`.

**So zeigt sich der Fehler:** Die Zeilen 26-27 auf den Stand der Basis zurücksetzen, also `min-w-0` am `li` und `min-w-0 hyphens-auto break-words` am Namen des aktuellen Schritts, `wide` aber behalten. Dann bleiben beide neuen Tests grün. Auf Schritt 3 mit Angaben in Schritt 1 und 2 («Heizprofil und Verwaltungspauschale», bei 1280 px fünf `flex-1`-Spalten) trennt die Anzeige «Verwaltungspauschale» aber wieder mitten im Wort. Genau diesen Fall verlangt die Anforderung: kein Name bricht, auch neben langen Angaben.

**Fix:** Dem Szenariogrundriss eine Zeile oder ein Szenario auf Schritt 3 mit Angaben geben, bei 1280 und 1440 px. Oder im DOM-Test prüfen, dass der Name des aktuellen Schritts weder `hyphens-auto` noch `break-words` trägt und sein `li` kein `min-w-0` hat. Zu prüfen ist, dass der Test rot wird, wenn (b) fehlt.

## Nicht bestätigt

- Vom Aufrufer gemeldet:
  - neues Szenario rot, dann grün;
  - DOM-Test rot, dann grün (8 bestanden);
  - E2E chromium statement-generate.feature und contract-new.feature (156 bestanden);
  - accessibility.feature, Zeilen statement-generate und contract-new (48 bestanden);
  - `bun run lint`, `bun run check`, `bun run fitness`;
  - design-guard.
- Ohne `min-w-0` kann der aktuelle Schritt nicht unter sein längstes Wort schrumpfen. Ob das bei md (768 px) auf Schritt 3 zum seitlichen Scrollen führt, habe ich nicht bestätigt, vor allem auf fr, it und en («d’administration», «amministrative»). Das 768-px-Szenario (statement-generate.feature:17-25) prüft nur Schritt 1, ohne erledigte Schritte. In sprachen-bildschirme.feature fand ich keine Prüfung auf seitliches Scrollen.
- Ich habe nicht geprüft, ob Tailwinds `sr-only` hier `white-space: nowrap` setzt. Davon hängt ab, ob `BrokenWords` (tests/e2e/screenplay/questions.ts:223) die verborgenen Namen als ungebrochen misst. Die gemeldeten Grün-Läufe sprechen dafür.

Geprüft: Klassenlogik `wide`/`named`; DOM-Test rot an der Basis (dort tragen alle Namen `xl:not-sr-only`); Szenario nutzt nur bestehende Schritte und die Grundlage, Fachsprache ohne UI-Wörter; keine neuen Texte oder Bildschirme; Galerie und Mietvertrags-Assistent ohne Angaben behalten `xl:not-sr-only`.
