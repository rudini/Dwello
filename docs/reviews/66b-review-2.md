# Code-Review Slice 66b (#66, #388), Runde 2 (abschliessend vor Push)

Geprüft: `git diff 7d8d2796 821717c4` im Worktree `review-66b-code2` (detached auf 821717c4). Gelesen habe ich alle 14 geänderten Dateien: messages (4), drei Tests, `statement-wizard.ts`, zwei Features, die Persona-Berichte helga-66b und weber-66b (Befundtabelle), `66b-fachreview-2.md` und `66b-review-1.md`. Vorheriger Bericht: `docs/reviews/66b-review-1.md`.

## Status der IDs aus Runde 1

| ID | Schwere | Status |
|----|---------|--------|
| C-1 | Major | **Behoben.** `src/lib/statement-wizard.ts:239` ist jetzt ein Kommentar ohne Marker. Eine Suche nach `#66)` und `#388)` über das Repo ohne `docs/` findet keinen `TODO(fachlich prüfen, …)` mehr, nur Kommentare und Plan-Zeilen (`ContractForm.svelte:233`, `agreed-categories.dom.test.ts:47`, `contract-edit.feature:168`, `implementation_plan.md:5,12`, `UBIQUITOUS_LANGUAGE.md:51`). Damit stimmt auch `implementation_plan.md:12`. |
| C-2 | Minor | **Behoben.** `contract-edit.dom.test.ts:161-167`: Die negativen Zeilen prüfen wieder den kurzen Teil `afterEnd`, die positive Zeile «befristet» prüft `afterEndWithForm`. |
| C-3 | Nit | **Behoben.** `bunx prettier` meldet für `contract-edit.dom.test.ts`, `contracts-i18n.test.ts` und `agreed-categories.dom.test.ts` keinen Unterschied. |
| C-4 | Nit | **Behoben.** `contract-new.feature:172-173`: Der Kommentar ist gekürzt, der Titel lautet jetzt «erfährt der Liegenschaftsverwalter». |
| C-5 | Nit | **Behoben.** `messages/en.json:665` setzt das Label jetzt in «Agreed utility costs». |
| C-6 | Nit | **Behoben.** `messages/it.json:665` sagt jetzt «tolga la selezione da tutte le categorie» und passt damit zu `it.json:759-760`. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-7 | Minor | `messages/de.json:759` (und fr/it/en:759) | Der neue Satz zur Nebenkostenpauschale ist ein fachlicher Hinweis und kam nach `66b-fachreview-2.md` (geprüft bis 7d8d2796) dazu. Inhaltlich deckt er sich mit der Glossarzeile, die das Fach-Review schon geprüft hat (`UBIQUITOUS_LANGUAGE.md:51`: «Zahlt der Mieter alle Nebenkosten pauschal, hat sein Mietvertrag in Dwello kein Akonto und kein Häkchen»). Nach Workflow Schritt 5 gehört er trotzdem zum `fach-reviewer`, oder der Aufrufer begründet in der Triage, warum es keinen braucht. |
| C-8 | Nit | `messages/de.json:759` | Die Reihenfolge ist dieselbe wie bei Weber 66b P-1: Zuerst kommt «Stehen im unterschriebenen Mietvertrag Nebenkosten, kreuzen Sie sie an», erst danach die Ausnahme für die Pauschale. Ein Pauschalvertrag nennt aber oft Nebenkosten (Helga P-4). Wer nach dem zweiten Satz aufhört, setzt die Häkchen wieder. Steht die Ausnahme zuerst oder heisst es «… Nebenkosten mit Akonto oder Abrechnung …», ist das klarer. Eine Textänderung braucht einen roten Test (Schritt 6), darum nur ein Nit. |

Keine Blocker und keine Majors.

Ponytail-Review: Das Delta besteht aus einer Textänderung, einer Testzeile, einem Step-Aufruf und einem umgeschriebenen Kommentar. Es nutzt den bestehenden Step `warnt das Formular {string}` (`agreed-costs.steps.ts:152`) mit der Question `noAgreedCostsWarning`. Es gibt keinen neuen Code und nichts, was ungenutzt bleibt. Kürzbar: 0 Zeilen.

## Bestätigt

- **P-2-Satz in vier Sprachen:** de/fr/it/en:759 geben den Satz vollständig wieder. Die Begriffe stimmen mit `i18n-begriffe.md:66` überein (fr «forfait de frais accessoires», it «forfait per le spese accessorie», en «flat-rate utility charge») und mit `contracts_no_advance_text` derselben Sprache (fr:665, it:665). it nutzt «non selezioni alcuna categoria» wie im Satz davor. Die Anrede ist Sie/vous/Lei.
- **Rot ohne Änderung:** `agreed-categories.dom.test.ts:48-50` und `contract-edit.feature:172` prüfen einen Satz, den es in `de.json:759` vor 821717c4 nicht gab. Beide schlagen also ohne die Textänderung fehl. Das Szenario hat kein `@wip`.
- **Niedrigste Schicht:** Der DOM-Test am Bauteil `AgreedCategories` deckt den Text ab. Die E2E-Zeile prüft ihn im echten Formular «Mietvertrag bearbeiten». Neuer Mietvertrag und Bearbeiten nutzen dasselbe Bauteil (`agreed-categories.dom.test.ts:5`).
- **Screenplay:** Der Step ruft nur `verwalter.sees(noAgreedCostsWarning)` auf, eine Question, die den Text liefert. Die Formulierung im Feature ist fachlich, ohne «klickt», «Button» oder «Feld».
- **Kein neuer Bildschirm und kein neuer Zustand:** Es ändert sich nur der Text einer bestehenden Warnung. `screens.json` und die Features für a11y und Sprachen müssen nicht ergänzt werden.
- **Nichts Fremdes im Diff:** Die Umformatierung in `contracts-i18n.test.ts:70-72` betrifft eine Zeile, die Runde 1 eingeführt hat (C-3). Code, Tokens, Sicherheit und Contracts sind nicht betroffen.

## Nicht bestätigt

- vitest (agreed-categories.dom, i18n, contract-edit.dom, contracts-i18n, statement-wizard, open-work), E2E chromium für contract-edit und contract-new (53 bestanden), lint und check auf 057c159c: **vom Aufrufer gemeldet**, nicht neu ausgeführt. Ab 057c159c ändern sich laut Diff nur Tests, messages, Features und Dokumente. Der einzige Code ist der Kommentar in `statement-wizard.ts:239`, der schon in 057c159c kam.
- Dass `agreed-categories.dom.test.ts` vor der Textänderung rot war: **vom Aufrufer gemeldet**. Ich habe es nur am Text nachvollzogen.
- `tools/open-work/check-issues.mjs` habe ich nicht laufen lassen (kein Token). Die Suche nach Markern zu #66 und #388 war leer (siehe C-1).
- Die anderen Befunde der Personas (Helga P-1 Major: wohin der Betrag der Pauschale gehört; P-3, P-4; Weber P-1, P-3 bis P-6) liegen ausserhalb dieses Deltas. Ob die Triage sie behandelt hat, habe ich nicht geprüft. Helga P-2 schlug vor, die Warnung zu einer Information zu machen. Das Delta lässt sie eine Warnung und ergänzt nur den Text.
- Ob ein Fach-Review den neuen Satz abgedeckt hat (siehe C-7): Unter `docs/reviews/` liegen nur `66b-fachreview-1.md` und `66b-fachreview-2.md`. Runde 2 endet bei 7d8d2796.
