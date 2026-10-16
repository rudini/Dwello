# Code-Review #124, #89, #60 (Verwaltungspauschale), Abschluss Runde 3 (Re-Review C-1)

Worktree: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-89-close2` (detached 60727ad). Geprüft habe ich `git diff 7d81829 60727ad` (ein Commit, 60727ad, 17 Dateien) gegen den Vorbericht `docs/reviews/issue-89-review-2.md`. Alle geänderten Dateien habe ich gelesen. Dazu kamen der Stand auf main (`git show 50264e3:src/routes/statements/generate/+page.server.ts`), `backend/src/routes/contracts.ts`, `backend/src/db/schema.ts`, `tests/e2e/fixtures/{backend,screens}.ts`, `tests/a11y/screens.json` und die Features `statement-generate` und `statement-management-fee`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | erledigt | `src/routes/statements/generate/+page.server.ts:44-49,66-82` | Das Heizprofil kommt wieder aus `others[0]` (wie auf main), der Satz nur aus `runRate`. Der Hinweis hat jetzt einen dritten Fall. Die Unit- und DOM-Tests decken das ab und wären vorher rot gewesen. |
| C-11 | Major | `tests/e2e/features/statement-generate.feature:200-205`, `statement-management-fee.feature:75-81` | Es gibt kein Szenario für den Fall, den C-1 betraf: eine Abrechnung der Periode, aber keine zum Satz des Laufs. Der Assistent übernimmt dort das Heizprofil, nimmt den Satz aus den Einstellungen und zeigt den neuen Hinweis. Der Rückschritt aus C-1 war in der vollen E2E-Suite (807 auf f871e58) grün. |
| C-12 | Minor | `tests/e2e/fixtures/screens.ts:50-65`, `tests/a11y/screens.json:388-391` | Den dritten Hinweis (`statements_preset_profile_from_statements`) sehen weder die axe- noch die Sprachzeile von `link-preset`. Anna und Bruno haben im Seed «vereinbart, Satz des Laufs», also zeigt `link-preset` den Text `statements_preset_from_statements`. Ob fr/it/en hier Deutsch zeigen, prüft nur das Lesen der JSON-Dateien. |
| C-13 | Minor | `backend/src/services/contract.service.ts:285-286,307` | `feeRate(data)` in `createContract` setzt den Satz jetzt bei jedem falsy `managementFeeAgreed` auf `null`, auch wenn das Feld fehlt (vorher nur bei `=== false`). Das ist richtig, weil der Spalten-Default `false` ist (`schema.ts:127`). Der neue pg-Test prüft aber nur PUT. Ein `POST` mit `managementFeePercent: '2'` ohne `managementFeeAgreed`, gefolgt von `PUT {managementFeeAgreed: true}`, ist ungetestet. Diesen Weg nannte die alte C-2 ausdrücklich. |
| C-7 | Nit (offen) | `backend/src/__tests__/management-fee.pg.test.ts:219` | Die Einrückung ist nicht korrigiert. `it('lehnt einen eigenen Satz über dem Höchstsatz ab'` steht weiter mit zwei Tabs (geprüft mit `cat -A`). Der Aufrufer meldet C-7 als erledigt, der Diff ändert diese Zeile aber nicht. |
| C-14 | Nit | `backend/src/services/contract.service.ts:288-292` | Nach dem Verschieben von `feeRate` (C-6) steht eine Leerzeile zwischen dem JSDoc «Create a new contract» und `export async function createContract`. Diese Leerzeile ist übrig geblieben. |
| C-15 | Nit | `src/routes/statements/generate/+page.server.ts:42` | Der Kommentar sagt: «the heating profile is the same for every statement of the run». Die Abrechnungen einer Periode können aber aus verschiedenen Läufen mit verschiedenen Profilen stammen. Genauer wäre «any statement of the period tells the profile to reuse (A-10)». |
| C-16 | Nit | `PresetNotice.svelte:16`, `StatementWizard.svelte:43`, `+page.svelte:24` | ponytail `shrink:`: `load` setzt `feeFromSettings` immer, trotzdem ist es optional. Optional ist es nur für Testdaten ohne das Feld. Fehlt das Feld, gilt «Heizprofil und Pauschale aus den Abrechnungen». Harmlos. |

ponytail-review: C-14 (−1 Zeile) und C-16. Sonst ist der Diff knapp. Der dritte Fall als verschachteltes Ternary mit einem einzigen Flag ist die kürzeste Form. `net: -1 line possible.`

## C-11 (Major): Kein Szenario für «Heizprofil aus den Abrechnungen, Pauschale aus den Einstellungen»

**Was fehlt.** Das Szenario A-10 «Neue Abrechnung übernimmt die Einstellungen der Periode» (`statement-generate.feature:200-205`) sät Eva Frei mit dem Seed-Default `managementFeeAgreed: true` (`fixtures/backend.ts:149-150`). Ihre Abrechnung ist also eine Abrechnung zum Satz des Laufs, und `runRate` und `others[0]` sind dieselbe. Ebenso nutzt «Neue Abrechnung übernimmt den Satz des Abrechnungslaufs» (`statement-management-fee.feature:76-81`) eine Abrechnung zum Satz des Laufs. Kein Szenario öffnet den Assistenten für eine Periode, deren Abrechnungen alle zu Mietverträgen ohne vereinbarte Pauschale oder mit eigenem Satz gehören. Genau das ist nach Migration 0009 der Normalfall für jeden bestehenden Mietvertrag (`DEFAULT FALSE`).

**Warum das blockiert.** In diesem Fall verhält sich der Assistent anders als auf main. Der Satz kommt aus den Einstellungen (V-1), und der Landlord sieht einen neuen Hinweis. Das ist eine Verhaltensänderung, die er sieht, ohne Szenario. Dass die Lücke echt ist, zeigt C-1 selbst: Der Rückschritt (Heizprofil aus den Einstellungen) lief auf f871e58 durch alle 807 E2E-Szenarien, gefangen hat ihn nur das Lesen des Codes.

**Wie man es zeigt.** Alle Steps gibt es schon (`contract-detail.steps.ts:210`, `statement-generate.steps.ts:286`):

```gherkin
Szenario: Neue Abrechnung übernimmt das Heizprofil auch ohne vereinbarte Verwaltungspauschale
  Angenommen es gibt das Heizprofil "Winter"
  Und im Mietvertrag von "Eva Frei" ist keine Verwaltungspauschale vereinbart
  Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
  Wenn der Liegenschaftsverwalter den Assistenten für das Gebäude "Lindenhof" und 2024 öffnet
  Dann schlägt der Assistent das Heizprofil "Winter" vor
  Und schlägt der Assistent eine Verwaltungspauschale von "3" % vor
```

Auf 7d81829 wäre der erste `Dann`-Schritt rot, auf 60727ad grün. Eine Frage nach dem Text des Hinweises (`wizard-preset`) würde zusätzlich den dritten Fall zeigen. Prüfen müsste man noch, ob «3» dem Satz der Einstellungen in der E2E-Datenbank entspricht.

## Bestätigt durch Code und Test

- **C-1:** `chosen()` liefert `other: others[0]` und `runRate`. `defaultHeatingProfileId` kommt aus `other` (`+page.server.ts:72-74`), `defaultManagementFeePercent` aus `runRate` (`:66-68`). `fromStatements` hängt an `other`, `feeFromSettings` an `!runRate` (`:80-81`). `PresetNotice.svelte:32-36` wählt daraus einen der drei Texte. `statement-generate-actions.test.ts:146-156` erwartet `hp-nein` und beide Flags. Auf 7d81829 wäre das rot gewesen (`hp1`, `fromStatements: false`). `statement-wizard.dom.test.ts:151-168` ist ebenfalls rot ohne den neuen Zweig, denn mit `fromStatements: true` wurde vorher `statements_preset_from_statements` gezeigt. Die `limit=1000`-Abfrage von `statements` bleibt, weil `runRate` sie braucht.
- **Neuer Text:** Den Schlüssel `statements_preset_profile_from_statements` gibt es in allen vier `messages/*.json`. Die Wörter folgen dem Glossar: Heizprofil, Verwaltungspauschale, Nebenkostenabrechnungen, Abrechnungsperiode, und fr/it/en verwenden dieselben Begriffe wie die beiden bestehenden Schlüssel. Der Text wird mit `m.…()` gezeigt. Kleinigkeit: Deutsch sagt «Prüfen Sie beides», die anderen Sprachen sagen «Check them» bzw. «Vérifiez-les» bzw. «Li verifichi». Das ist sinngleich.
- **C-2:** `feeRate(data, data.managementFeeAgreed ?? current.managementFeeAgreed)` in `updateContract` (`contract.service.ts:389`) behält bei einem PUT nur mit Satz auf einem nicht vereinbarten Vertrag keinen Satz. Der pg-Test `management-fee.pg.test.ts:211-217` wäre vorher rot gewesen, weil der Satz 2 blieb und die Pauschale nach `agree(true)` nicht 7.5 war. Ein vereinbarter Vertrag mit PUT nur des Satzes behält ihn (`current.managementFeeAgreed` ist true). Die Lücke beim POST steht unter C-13.
- **C-6:** `feeRate` ist generisch, der Cast in `createContract` entfällt (`:307`). Der JSDoc steht wieder vor `createContract` (bis auf die Leerzeile C-14).
- **C-4:** `contract-wizard.dom.test.ts:208-211` erwartet bei «12» keinen Hinweis. Rot wäre der Test ohne `isFeeRate(ownRate)` in `RentStep.svelte:91`, denn 12 > 3 zeigt sonst den Richtwert-Hinweis.
- **C-8:** Die Leerzeilen in `contract-edit.feature:110` und `contract-form.steps.ts:340` sind wieder da.
- **C-9:** Der A-10-Kommentar (`+page.server.ts:29-31`) passt nach dem Fix wieder, weil Profil und Satz aus den übrigen Abrechnungen kommen und der Satz nur aus denen zum Satz des Laufs (Zeile 41).
- **C-3, C-5 abgelehnt:** Die Begründungen halten. Das Szenario mit `generateStatements` prüft Anzahlen, nicht Beträge. `edited()` bleibt in beiden Formularen gleich gebaut.
- **Plan:** `docs/archive/implementation-plan-verlauf.md` hat die Runde nachgetragen, der offene Punkt ist «Closing re-review of the C-1 fix, PR». Der Eintrag nennt C-7 als erledigt, das stimmt nicht (siehe C-7).
- **Nichts Fremdes im Diff:** Der Commit enthält nur die Review-Fixes, den Bericht `issue-89-review-2.md` und den Plan.

## Nicht bestätigt

- **Checks des Aufrufers:** Alle sind nur «vom Aufrufer gemeldet»: `bun run lint`, `bunx vitest run` (2677), `cd backend && bun run type-check`, die pg-Tests für die Verwaltungspauschale und die Contract-Routen, die E2E-Features statement-generate, statement-management-fee, contract-edit und contract-detail (94) sowie die axe- und Sprachzeilen von statement-generate (22). `bun run check` meldet der Aufrufer für 60727ad nicht. Ob `feeRate` generisch ohne Cast in svelte-check durchgeht, stützt sich also nur auf den Backend-`type-check`. Selbst ausführen wollte ich `bunx vitest run` mit den drei geänderten Testdateien. Das geht nicht, weil der Zugriff auf `node_modules` gesperrt ist (`ls … node_modules` blocked by a deny rule). Den Worktree habe ich nicht verändert.
- **Rotphasen:** Dass die neuen Tests rot waren, habe ich nur aus dem Code von 7d81829 abgeleitet, nicht durch einen Lauf.
- **Satz der Einstellungen in E2E:** Ob er 3 % ist (für das vorgeschlagene Szenario in C-11), habe ich nicht nachgesehen.
