# Fach-Review 66b, Runde 2 (Commit 7d8d2796, Delta zu ac890cc0)

Gegenstand: `git diff ac890cc0 7d8d2796`. Vorheriger Bericht: `docs/reviews/66b-fachreview-1.md`. Entscheide #388 und #410 (Kommentar) über `gh api` gelesen. Die Fedlex-Zitate aus Runde 1 gelten weiter (OR Fassung 1.1.2026, VMWG Fassung 1.10.2025).

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status |
|---|---|---|
| M-1 | Major | **Behoben.** Neu: «Fester Betrag des Mieters für im Mietvertrag vereinbarte Nebenkosten» (das passt zu Art. 257a Abs. 2 OR) und «Nebenkosten, die der Mieter pauschal bezahlt, erhalten … kein Häkchen. Zahlt der Mieter alle Nebenkosten pauschal, hat sein Mietvertrag in Dwello kein Akonto und kein Häkchen.» (`UBIQUITOUS_LANGUAGE.md:51`). Den Mischfall schliesst die Zeile nicht mehr aus: Die Regel gilt pro Nebenkostenart, und «alle» setzt den Teilfall voraus. Mein Satz zum Mischfall fehlt, ist aber nicht nötig. |
| M-2 | Minor | Offen, in #410 festgehalten (Kommentar geprüft). Ändert sich in diesem Slice nicht. |
| M-3 | Minor | **Behoben.** «Für ihre Höhe ist auf Durchschnittswerte dreier Jahre abzustellen (Art. 4 Abs. 2 VMWG)». Das entspricht dem Fedlex-Wortlaut «muss er auf Durchschnittswerte dreier Jahre abstellen». |
| M-4 | Nit | Offen, in #410 festgehalten. |
| V-1 | Minor | Offen. Bestand vorher und ist unverändert. |
| V-2 | Minor | Offen. Bestand vorher und ist unverändert. |
| V-3 | Minor | **Behoben.** Neuer Step `contract-new.feature:179`, prüft `toContain('bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung')` (`contract-form.steps.ts:492–497`). Die Teilzeichenkette steht wörtlich in `de.json:665`. |
| V-4 | Nit | **Behoben.** Neuer Titel «Ohne Akonto erklärt das Formular Nebenkostenpauschale und vereinbarte Nebenkosten». Der Step «dass er sonst alle Häkchen bei «Vereinbarte Nebenkosten» entfernt» prüft «bei «Vereinbarte Nebenkosten» alle Häkchen», das steht in `de.json:665`. |
| V-5 | Nit | **Behoben.** fr «Dwello ne décompte alors aucuns frais accessoires à ce locataire», it «Dwello non conteggia allora spese accessorie a questo inquilino». Das passt zu `pdf.service.ts` und `i18n-begriffe.md`. |
| V-6 | Nit | **Behoben.** en «or the rental contract provides for no utility costs». |
| V-7 | Nit | **Behoben.** Die i18n-Zeile trägt ❓ bei fr und it (`i18n-begriffe.md:66`). Im fr-Text stehen echte U+00A0 (Bytes C2 A0, mit `od -c` geprüft) nach «, vor » und vor « : ». Gefunden habe ich keine ` `-Escapes, wie der Auftrag sagt, sondern die Zeichen selbst. Für die Darstellung macht das keinen Unterschied. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-8 | Verwalter | Major | `src/lib/statement-wizard.ts:239` hat noch `TODO(fachlich prüfen, #388): the befristet text does not name the official form a raise still needs`. Das ist jetzt falsch, denn `statements_akonto_raise_fixed_term` nennt das Formular. Ausserdem blockiert der Marker «Fixes #388». Der Plan (`implementation_plan.md:12`) meldet ihn als entfernt. |
| V-9 | Verwalter | Nit | en `contracts_no_advance_text` setzt “Agreed utility costs” in “ ”. Im gleichen Formular verwendet `contracts_parties_fixed_open` «End contract». In `en.json` kommen beide Formen vor, also nur angleichen, wenn es einfach geht. |

### V-8 (Major): veralteter #388-Marker in `akontoHint`

**Beleg.**
- `src/lib/statement-wizard.ts:239`: `// TODO(fachlich prüfen, #388): the befristet text does not name the official form a raise still needs`.
- In `messages/de.json` endet `statements_akonto_raise_fixed_term` jetzt mit «Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.»
- `tools/open-work/check-issues.mjs:32`: «This pull request closes #${n}, but markers still name it».
- `implementation_plan.md:12`: «`TODO(fachlich prüfen, #388)` removed». Entfernt wurde aber nur der Marker in `ContractForm.svelte`.

**Warum falsch.**
- Der Kommentar behauptet eine fachliche Lücke, die es nicht mehr gibt.
- Der Pull Request soll «Fixes #388» sagen (Plan Z. 15). Solange der Marker steht, schlägt die CI-Prüfung fehl. Nach dem Mergen wäre #388 geschlossen, der Marker zeigte also auf ein geschlossenes Issue.
- Die Done-means-Liste von #388 verlangt: «The related `TODO(fachlich prüfen, #n)` markers point to that issue or are removed».

**Behebung.** Den Marker ersetzen, zum Beispiel durch `// #76, #388: a befristeter Mietvertrag has no Kündigungstermin before its end; a raise it provides for still needs the official form`. Oder den Marker ersatzlos streichen.

## Endtexte in vier Sprachen

**#388-Satz**
- Bestätigt in `contracts_running_text_fixed_term` und `statements_akonto_raise_fixed_term`, in allen vier Sprachen.
- Er stimmt wörtlich mit «Decided (product owner)» in #388 überein: de, fr «Communiquez une augmentation motivée et avec la formule officielle, sinon elle est nulle.», it «Comunichi un aumento motivato e con il modulo ufficiale, altrimenti è nullo.», en «Give notice of an increase with reasons and on the official form, otherwise it is void.»
- Er steht jeweils an der beschlossenen Stelle: nach «ausser der Mietvertrag sieht sie vor» und vor «Tragen Sie … erst ein».
- Rechtsgrundlage ist Art. 269d Abs. 2 lit. a/b OR («Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet»), wie in Runde 1. Die Einschränkungen dazu sind M-2 und M-4.

**`contracts_no_advance_text`**
- de: wie in #66 beschlossen. Die Rechtsprüfung aus Runde 1 gilt weiter (Art. 257a Abs. 2 OR, Art. 4 VMWG, Art. 257c OR).
- fr: Inhaltlich gleich wie de. Die Begriffe passen zu `i18n-begriffe.md`: frais accessoires, décompte des charges, acompte, contrat de bail. Das Label « Frais accessoires convenus » passt wörtlich zu `contracts_agreed_costs_label`. Anrede vous, Typografie richtig.
- it: Inhaltlich gleich wie de. Die Begriffe stimmen: spese accessorie, conteggio spese accessorie, acconto, contratto di locazione, «Spese accessorie pattuite» = Label. Anrede Lei («lo inserisca», «tolga»). Guillemets ohne Leerzeichen, wie es der Stil verlangt. «Se le spese accessorie sono pattuite» ist etwas bestimmter als de «Sind Nebenkosten … vereinbart», ändert den Sinn aber nicht. Kein Befund.
- en: Inhaltlich gleich wie de. Die Begriffe stimmen: utility costs, utility cost statement, advance payment, «Agreed utility costs» = Label. Zu den Anführungszeichen siehe V-9.

**Glossarzeile und i18n-Zeile**
- Rechtlich richtig, siehe M-1 und M-3.
- «Nicht zu verwechseln mit der Verwaltungspauschale» und «Sie wird nicht abgerechnet» sind wie in Runde 1 bestätigt.

**Unit-Tests**
- `contract-wizard.test.ts`, `contracts-i18n.test.ts`, `contract-edit.dom.test.ts` und `statement-wizard.test.ts` erwarten genau die neuen Texte.
- Das `@wip` ist in `contract-new.feature`, `contract-edit.feature` und `statement-generate.feature` entfernt.

## Fehlende Begriffe

Keine neuen. Ein Hinweis bleibt aus Runde 1: Die Glossarzeile «Nebenkostenpauschale» weicht im Wortlaut von dem ab, was in #66 beschlossen wurde. Der Product Owner sollte die korrigierte Fassung bestätigen, zum Beispiel im Pull Request oder in #66. Ein neues Issue braucht es dafür nicht.

## Nicht bestätigt

- Ob der Product Owner die neue Glossarzeile (M-1/M-3) schon bestätigt hat. In #410 steht nur «added on the product owner's instruction». Einen Kommentar zum geänderten Wortlaut habe ich nicht gesucht.
- Die übrigen Punkte aus Runde 1 unter «Nicht bestätigt» sind unverändert **unsicher**: die Mischform in der Praxis; ob eine Akonto-Erhöhung unter Art. 269d Abs. 3 OR fällt; ob ein befristeter Mietvertrag eine Akonto-Erhöhung vorbehalten kann; die Begriffe für fr und it (#342).
- Ausgeführt habe ich nichts, weder Tests noch Szenarien (read-only). Die Teilzeichenketten der Steps und Tests habe ich nur gegen `messages/*.json` geprüft.
