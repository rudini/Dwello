# Code-Review Slice 1266, Runde 2 (Delta 93796c4..4867c88)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1, C-2

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (der Worktree hat kein `node_modules`):
  - mit `messages/*.json` auf dem Stand von 10e0c78: 3 Fehlschläge in `contract-edit.feature -g Aufhebungsvereinbarung` und 8 in `i18n.test.ts`
  - mit den neuen Texten: `contract-edit.feature` 76 grün, `i18n.test.ts` 73 grün, ESLint auf `contract-form.steps.ts` sauber
  - auf 93796c4: lint, check, fitness, backend type-check und vitest 4575 grün
- Den roten Lauf habe ich nur durch Lesen beurteilt. Die neuen Schritte (`contract-form.steps.ts:465-480`) verlangen die Teilsätze «… oder wenn Sie mit den Erben eine Aufhebungsvereinbarung getroffen haben», «Wählen Sie für das Vertragsende «Aufhebungsvereinbarung».» und «Eine unterschriebene Vereinbarung braucht es dafür nicht …». Die neue Zeile in `i18n.test.ts` verlangt «… beendet (Aufhebungsvereinbarung)» ohne Datum. Keiner dieser Texte stand auf 10e0c78 in den Sprachdateien. Das passt zu der Meldung des Aufrufers.
- Lint und check auf 4867c88 hat der Aufrufer nicht gemeldet, nur ESLint auf der Steps-Datei.

Geprüft: Die beiden neuen Szenarien laufen über die Grundlage (Bearbeitungsseite eines ungekündigten Vertrags). Dort rendert `ContractForm.svelte:298-299` beide Hilfetexte bedingungslos in `contract-parties-help`. Die Schritte nutzen nur die Question `partiesHelpText`. Die Features beschreiben, was der Liegenschaftsverwalter wissen will, und keine UI. Die geprüften Teilsätze stimmen mit `messages/de.json:804-805` überein. Die vier Werte von `contracts_duration_agreement` in `i18n.test.ts` stimmen mit den Sprachdateien überein. Der Diff ändert keine bestehende Szenariozeile. `docs/archive/sessions/1266.md` gibt Fachreview, Spec-Freigaben, Texte, Checks, C-1/C-2 samt rotem Lauf und den Archiv- und PR-Schritt richtig wieder.
