# Code-Review b665, Runde 1 (origin/main..389fbd2)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/contracts/new/PeriodStep.svelte:90-98 | Die Live-Region beim Vertragsbeginn im Assistenten (389fbd2) ist für einen Fall gebaut, den der Code nicht zulässt. Sie wird zusammen mit ihrem Inhalt eingefügt und sagt deshalb nichts an. Der Kommentar «the request can fail once this step is open» und die Commit-Nachricht («Weiter» while loading) stimmen nicht. Der DOM-Test (contract-wizard.dom.test.ts:441) prüft nur den Vorfahren `role="status"`, eine Ansage zeigt er nicht. |

## C-1 (Begründung)

- `ContractWizard.svelte:112/411`: Solange `contracts` fehlt, ist «Weiter» in Schritt 2 gesperrt (`loading`, `WizardNav` → `Button disabled={busy}`, #468). `loadContracts()` läuft nur in `onMount` (Zeile 176) und bei «Erneut versuchen». `goTo` geht nur Schritt für Schritt vorwärts (Zeilen 242, 248, 260, 310, 408). Schritt 3 öffnet sich also erst, wenn `unknown` schon feststeht.
- Bei «Erneut versuchen» bleibt die alte Map stehen, bis die neue Antwort da ist. Schlägt der Versuch wieder fehl, ändert sich der Inhalt der Region nicht, und die Meldung kommt als Toast (`retried`, ContractsUnknown.svelte:7). Klappt er, verschwindet der Hinweis. Einen Weg, auf dem der Hinweis bei offenem Schritt 3 neu erscheint, gibt es nicht.
- Die Region erscheint also immer schon mit ihrem Inhalt. Eine `role="status"`, die samt Inhalt eingefügt wird, sagen Screenreader in der Regel nicht an. Wenn doch (je nach Screenreader), hört der Nutzer den Hinweis doppelt, weil er seit d970f4d auch als Beschreibung des Vertragsbeginns vorgelesen wird.
- So zeigen: Den neuen Test auf 441 gegen d970f4d laufen lassen. Er wird rot, weil dort der Wrapper fehlt. Es gibt aber keinen Test, in dem `unknown` bei offenem Schritt 3 von falsch auf wahr springt, und `toPeriod` kann diesen Fall nicht herstellen.
- Vorschlag: Den Zweig `{#if onretry}<LiveRegion>` streichen und zu `{#if unknown}<ContractsUnknown {onretry} …>` zurückkehren. Im Pull Request schreiben, dass sich die Zeile «fails only after step 2» von U-16/#665 seit #468 nicht mehr herstellen lässt und Sven 2 mit `describedby` erledigt ist. Die Alternative ist, den Weg mit einem Test zu zeigen, der den Hinweis bei offenem Schritt 3 erscheinen lässt.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint sauber, check 0 Fehler, vitest `--changed` (1104, auf 59f9587, nicht auf 389fbd2), DOM-Tests contract-wizard/contract-edit (118), E2E chromium contract-new, contract-edit, statement-reminder, settings, statement-generate (222), axe und Sprachzeilen (134), Rot-Läufe der 3 Szenarien, der 3 DOM-Tests und des LiveRegion-Tests, Backend unverändert.
- Ob die Zeile «fails only after step 2 (apartment from the address, «Weiter» while loading)» in offene-punkte.md U-16 älter ist als #468: Die History im Worktree ist zusammengeführt. `git log -S` findet beide Stellen nur im Merge ebc0708 und in da07929.
- Ob Screenreader eine Region ansagen, die samt Inhalt eingefügt wird (C-1): Das hängt vom Screenreader ab. Ich habe es nicht ausprobiert.
- «The rest when touching the screens»: H6 (ContractWizard, nicht angefasst), H7/Sven 7 (ContractForm zeigt die Wohnung als `dd`, eine Wohnungsliste gibt es dort nicht), H8 (SaveStatus, nicht angefasst) und Sven 6 (Fokus nach «Bearbeiten») gehören nach der Vorgabe des Aufrufers nicht in diesen Slice. In ContractForm.svelte gibt es keinen Fokus-Code, der Sven 6 behebt.

Geprüft: `describedby` in Field, Select und DateInput (Reihenfolge: Hinweis vor Hilfe), die IDs `{testid}-text` sind eindeutig und existieren nur, solange `unknown` gilt. LiveRegion ersetzt alle fünf genannten Wrapper und den in ContractForm, ist leer `sr-only` und kein `live` am Alert. `empty:-mt-8` in ReminderFeedback fällt zu Recht weg, die Bearbeitungsseite bleibt ohne zweite Ansage (contract-edit.dom.test.ts:512). Die drei neuen Szenarien sind ohne `@wip`, die Schritte rufen nur Tasks und Questions auf (`Accessible.descriptionOf` gibt es schon), und sie sind ohne die Änderung rot. Neue Texte und neue Bildschirmzustände gibt es nicht. Das `@wip`-Szenario zu #666 gehört laut Aufrufer nicht in diesen Slice.
