# Code-Review #470, Runde 2 (5b8b183c..494f73af)

## Status der offenen IDs aus Runde 1 und Persona

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | geschlossen | `showErrors()` sucht in `wizard` (StatementWizard.svelte:163-169); der neue DOM-Test «setzt bei «Weiter» mit offenen Fragen den Fokus auf die erste» fällt ohne die Änderung (Fokus bleibt ausserhalb einer `radiogroup`). |
| C-2 | geschlossen | Der Ladesatz ist in Schritt 2 und 3 immer im Fluss und nach dem Laden nur `invisible` (StatementWizard.svelte:279-288), also keine Verschiebung beim Entsperren; vorgelesen über `wizard-status` (`statusText`, :108). Der DOM-Test prüft `invisible` statt `hidden`. Das E2E-Target `agreementsLoading` filtert passend auf `visible: true`. |
| P-1 (Marco 470) | teilweise geschlossen | Für die Hinweise zur Verwaltungspauschale und für Fragen oder nicht vereinbarte Nebenkosten steht die Zeile über «Weiter». Für den Fehlerzustand der Prüfung fehlt sie (C-3). Es gibt kein Szenario (C-4). |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Major | src/routes/statements/generate/AgreedCosts.svelte:58-60 (mit AgreementsCheck.svelte:19-33) | `noted` ignoriert `status === 'failed'`. Konnte Dwello die Vereinbarungen nicht prüfen, stehen die Meldung «Vereinbarte Nebenkosten nicht geprüft» mit «Erneut versuchen» und nach «Weiter» der Satz `agreements-wait` unter «Weiter», ohne Zeile darüber. Am Handy tippt man auf «Weiter», sichtbar passiert nichts, und den Grund sieht man nicht. |
| C-4 | Major | src/routes/statements/generate/StatementWizard.svelte:309-317 | Die neue Zeile «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» ist ein neues sichtbares Verhalten ohne Szenario in `tests/e2e/features`. Der Stack kann den Zustand ohne Zeitsteuerung herstellen (Mietvertrag ohne vereinbarte Verwaltungspauschale, Schritt 3). Das «No scenario» für den Ladezustand (#468) deckt ihn also nicht ab. |
| C-5 | Minor | src/routes/statements/generate/AgreedCosts.svelte:58-60 | `noted` aus Fragen oder nicht vereinbarten Nebenkosten ist ungetestet. Der DOM-Test prüft die Zeile nur über `FeeNotAgreed`, der Test zu C-1 hat offene Fragen, prüft `late-checks-note` aber nicht. |

## C-3 (Major): Fehlerzustand der Prüfung bleibt unter «Weiter» ungesagt

Auf dem Basis-Commit 6eb2b4a6 stand `AgreedCosts` mit `AgreementsCheck` im `section`, also über «Weiter». Seit 5b8b183c stehen beide in `LateChecks` unter «Weiter». P-1 verlangt, dass der Liegenschaftsverwalter erfährt, dass unter «Weiter» etwas steht, bevor er weitergeht. `noted` wird aber nur aus `asked.length || notAgreed.length` gesetzt. Bei `status === 'failed'` bleibt `contracts = []`, also bleibt `late-checks-note` `invisible`. Zwei Folgen:
- Die Meldung «Ohne diese Prüfung geht es nicht weiter. Wählen Sie «Erneut versuchen».» liegt am Handy unter «Weiter» und «Zurück», wo Marco nichts mehr erwartet.
- «Weiter» ist dann nicht gesperrt (`loading` ist false). Ein Tipp setzt `errors.agreements`, und `agreements-wait` (`role="alert"`) erscheint ebenfalls unter «Weiter». `showErrors()` findet kein `aria-invalid`-Element, Fokus und Bild bleiben, wo sie sind. Sehende Nutzer am Handy sehen keine Reaktion.

So zeigt sich der Fehler: Ein DOM-Test in `statement-wizard.dom.test.ts` lässt `fakeBff` für `/statements/agreements` mit `[500, …]` antworten, öffnet Schritt 3, wartet `settle()` ab und prüft `expect(byTestId('late-checks-note')!.classList.contains('invisible')).toBe(false)`. Auf 494f73af ist das rot. Abhilfe: `noted` auch bei `status === 'failed'` setzen.

## C-4 (Major): Kein Szenario für die neue Zeile über «Weiter»

Nach CLAUDE.md, Workflow 1, braucht eine sichtbare Verhaltensänderung ein Szenario ohne `@wip`. Im ganzen Slice (6eb2b4a6..494f73af) ändert sich unter `tests/e2e` nur das Target `agreementsLoading`. Kein Szenario prüft, dass in Schritt 3 mit einem Mietvertrag ohne vereinbarte Verwaltungspauschale der Satz «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» über «Weiter» steht, oder dass er ohne Hinweise fehlt (Negativprüfung). Der DOM-Test deckt die Komponente ab, ersetzt aber das Szenario nicht. Das Zeitproblem aus #468, mit dem das «No scenario» begründet wurde, gibt es hier nicht. So zeigt sich die Lücke: `grep -rn "Hinweise unten\|late-checks" tests/e2e` findet nichts.

## Nicht bestätigt

- bun run lint, bun run check, fallow audit, bunx vitest statement-wizard.dom + agreed-costs.dom + i18n (213) auf 494f73af: vom Aufrufer gemeldet, nicht neu ausgeführt. Die E2E-Läufe auf f7fb01d4 und 494f73af: vom Aufrufer als laufend gemeldet, Ergebnis unbekannt.
- Rot der neuen DOM-Prüfungen (C-1, C-2, P-1): vom Aufrufer gemeldet. Nach dem Lesen fällt jede ohne die jeweilige Änderung (Fokus ausserhalb der `radiogroup`, `hidden` statt `invisible`, kein `late-checks-note`).
- Ob `invisible` in echten Browsern dieselbe Höhe hält wie der sichtbare Satz und ob «Weiter» beim Entsperren auf 390 px wirklich stillsteht: ohne Browser nicht gemessen. Der DOM-Test prüft nur Klassen.
- Ob der Zustand `agreed-costs` (screens.json:76) in `sprachen-bildschirme.feature` steht und so die neue Zeile in fr/it/en prüft: Der Zustand ist in `screens.json` eingetragen, die Sprachzeilen habe ich nicht einzeln nachgesehen.

Geprüft: Neuer Text in allen vier `messages/*.json`. Rücksetzen von `noted` beim erneuten Öffnen von Schritt 3 (Effekt in LateChecks). `late-checks-note` nur in Schritt 3. `aria-hidden` am Ladesatz zusammen mit `wizard-status`. Keine fremden Änderungen im Delta.
