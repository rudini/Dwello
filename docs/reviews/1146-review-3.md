# Code-Review #1146, Runde 3 / Abschlussrunde (Delta 1968f5cc2..3d87398ae)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-4 (Auf Schritt 5 und nach dem Zurückgehen auf Schritt 3 stehen jetzt zuerst positive Anker: «zeigt die Schrittanzeige beim aktuellen Schritt den Namen …» (statement-generate.steps.ts:793, wartet per `sees` auf den Namen und eine Breite > 1) und «nennt der erledigte Schritt "Gebäude" die Wahl "Lindenhof"» (Text von `finishedStep`, wartet auf die Angabe). Damit laufen die Negativprüfungen erst, wenn der erwartete Schritt und die Angaben da sind.)

## Nicht bestätigt

- Vom Aufrufer gemeldet:
  - Szenariogrundriss «Die Schrittanzeige trennt keinen Namen eines Schritts» auf 3d87398ae (4 Beispiele bestanden);
  - Rot von «nennt der erledigte Schritt "Gebäude" die Wahl "Lindenhof"» bei allen vier Breiten, wenn `values` nicht an `<Stepper>` übergeben wird;
  - auf 1968f5cc2: statement-generate.feature und contract-new.feature (158 bestanden), a11y- und Sprachzeilen (96 bestanden), `bun run lint`, `bun run check`.
- Aus Runde 2 offen und weiterhin nicht bestätigt: seitliches Scrollen bei fr, it und en mit Angaben; ohne Angaben (Mietvertrags-Assistent) bei md. Seitliches Scrollen bei 768 px auf Schritt 5 prüft das Szenario jetzt (Zeile 918); den Lauf habe ich nicht selbst gesehen.

Geprüft: Delta (nur statement-generate.feature:913-922 und der Bericht von Runde 2); Schritte vorhanden und nach Screenplay (Ziel `finishedStep`, Fragen `finishedStepText`, `currentStepNameText`); Fachsprache ohne UI-Wörter; keine neuen Texte oder Bildschirme; nichts Fremdes im Delta.
