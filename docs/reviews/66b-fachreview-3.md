# Fach-Review 66b, Runde 3 (Commit 821717c4, Delta zu 7d8d2796)

Gegenstand: `git diff 7d8d2796 821717c4`, nur `messages/*.json`, `src/lib/statement-wizard.ts`, Tests und Szenarien. Vorherige Berichte: `docs/reviews/66b-fachreview-{1,2}.md`. Persona-Berichte: `docs/design/personas/{helga,weber}-66b.md`. Die Fedlex-Zitate aus Runde 1 gelten weiter. Massgebend ist hier Art. 4 Abs. 2 VMWG: «Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.» Daraus folgt: Eine Pauschale wird nicht abgerechnet. Nach Art. 257a Abs. 2 OR muss auch eine Pauschale besonders vereinbart sein.

## Status der offenen IDs aus Runde 2

| ID | Schwere | Status |
|---|---|---|
| V-8 | Major | **Behoben.** `src/lib/statement-wizard.ts:239` ist jetzt ein gewöhnlicher Kommentar: `// #76, #388: a befristeter Mietvertrag raises only after its end, unless agreed; a raise still needs the form`. Der Kommentar stimmt mit `statements_akonto_raise_fixed_term` überein. Mit `git grep` gibt es in `src`, `backend/src`, `backend/migrations`, `backend/demo` und `tests` keinen Marker `TODO(fachlich prüfen, #388)` mehr. Das sind die Ordner, die `tools/open-work/check-issues.mjs:10` durchsucht. Die Zeichenkette steht nur noch im Plan-Text `implementation_plan.md:12`, und den prüft das Skript nicht. |
| V-9 | Nit | **Behoben.** en `contracts_no_advance_text` schreibt jetzt «Agreed utility costs». |
| M-2, M-4, V-1, V-2 | Minor/Nit | Unverändert offen. M-2 und M-4 stehen in #410. Das Delta betrifft sie nicht. |

Zum Code-Review-Nit (it): «tolga la selezione da tutte le categorie» stimmt mit `contracts_agreed_costs_help` überein («Tolga la selezione da ognuna»). In `it.json` steht «spunta» nur noch in `categories_heating_help:1418`. Das ist ein anderer Bildschirm und nicht Teil dieses Slice. Kein Befund.

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-10 | Verwalter | Minor | Der Satz davor in `contracts_agreed_costs_none_text`, «Stehen im unterschriebenen Mietvertrag Nebenkosten, kreuzen Sie sie an.», trifft wörtlich auch auf einen Mietvertrag mit Pauschale zu (Helga P-2, P-4). Der neue Satz macht davon eine Ausnahme, deshalb ist das Ergebnis richtig. Klarer wäre: «Stehen im unterschriebenen Mietvertrag Nebenkosten mit Akonto oder Abrechnung, kreuzen Sie sie an.» Das gilt auch für fr, it und en. |
| V-11 | Verwalter | Minor (bestand vorher) | Der Titel `contracts_agreed_costs_none_title` heisst «Keine Nebenkosten vereinbart». Darunter steht jetzt der Fall Pauschale. Nach der Glossarzeile (Pauschale = «für im Mietvertrag vereinbarte Nebenkosten») und Art. 257a Abs. 2 OR sind dann aber Nebenkosten vereinbart. Vorschlag: «Keine Nebenkosten zum Abrechnen». Dazu passt auch Helgas Wunsch, statt `tone="caution"` (`AgreedCategories.svelte:51`) eine Information zu zeigen. |
| V-12 | Verwalter | Minor (bestand vorher) | Für den Mischfall fehlt ein Hinweis. Er gehört aber in den Hilfetext bei den Häkchen, nicht in diese Warnung (siehe unten). `contracts_agreed_costs_help` und `_help_edit` sagen nur «Entfernen Sie das Häkchen bei jeder, die im unterschriebenen Mietvertrag nicht steht». Das Risiko: Pauschal bezahlte Posten werden zusätzlich abgerechnet. Vorschlag: «Bezahlt der Mieter einzelne Nebenkosten pauschal, entfernen Sie bei diesen das Häkchen, auch wenn der Mietvertrag sie aufzählt.» Am besten zusammen mit Helga P-4 als Issue erfassen. |
| V-13 | Verwalter | Nit | In allen vier Sprachen kommt das Wort doppelt vor: «Nebenkosten mit einer Nebenkostenpauschale», «frais accessoires par un forfait de frais accessoires», «spese accessorie con un forfait per le spese accessorie». Der Begriff ist so festgelegt (`i18n-begriffe.md:66`), deshalb nur glätten, wenn es einfach geht, etwa «… alle Nebenkosten pauschal, …». |

Keine neuen Blocker oder Majors.

## Antworten auf die Fragen

**1. Ist der neue Satz richtig und passt er zum Glossar und zum Hinweis aus #66?** Ja.
- Glossar `UBIQUITOUS_LANGUAGE.md:51`: «Zahlt der Mieter alle Nebenkosten pauschal, hat sein Mietvertrag in Dwello kein Akonto und kein Häkchen.» Der neue Satz sagt dasselbe, und «alle» entspricht wörtlich dem Glossar.
- `contracts_no_advance_text` («Sonst entfernen Sie … alle Häkchen») widerspricht er nicht mehr. Damit ist Helga P-2 inhaltlich behoben: Die Warnung schickt einen Vermieter mit Pauschale nicht mehr zurück zu den Häkchen.
- Rechtlich ist das richtig. Nach Art. 4 Abs. 2 VMWG wird eine Pauschale nicht abgerechnet, also darf Dwello diese Nebenkosten nicht abrechnen.
- Wortlaut und Titel sind noch nicht ganz stimmig, siehe V-10 und V-11 (beide Minor).

**2. Soll der Mischfall auch in diese Warnung?** Nein.
- Die Warnung erscheint nur, wenn kein Häkchen gesetzt ist (`AgreedCategories.svelte:49`, `agreed?.length === 0`). Im Mischfall bleiben die Akonto-Posten angekreuzt, die Warnung erscheint dort also nie.
- Das «alle» im neuen Satz grenzt den Mischfall richtig ab, so wie das Glossar.
- Der Mischfall gehört in den Hilfetext bei den Häkchen (V-12). Das bestand schon vor diesem Delta, und dieser Slice ändert den Hilfetext nicht.

**3. Stimmen die Übersetzungen?** Ja.
- fr: «forfait de frais accessoires» und it: «forfait per le spese accessorie» entsprechen `i18n-begriffe.md:66` (dort mit ❓ markiert, #342). en: «flat-rate utility charge» stimmt ebenfalls.
- fr «laissez les cases décochées» passt zu «Si aucune case n’est cochée», it «non selezioni alcuna categoria» zu «Se non seleziona alcuna categoria», en «leave the boxes unticked» zu «With no box ticked» und «untick all boxes».
- Die Anrede stimmt: vous, Lei, Imperativ. Auch der Sinn stimmt in allen Sprachen, einschliesslich «tous/tutte/all».

**4. Neue Blocker oder Majors?** Keine.
- Die DOM-Tests (`agreed-categories.dom.test.ts`) und der Step (`contract-edit.feature:172` über `agreed-costs.steps.ts:152`, `toContain`) prüfen den neuen Satz wörtlich. Er steht so in `de.json:759`.
- Der umgebaute Test `contract-edit.dom.test.ts` (`afterEnd`/`afterEndWithForm`) prüft weiter dieselben Texte. Für unbefristet und gekündigt prüft er nur die kürzere Teilzeichenkette als Gegenprobe, fachlich ist das gleichwertig.

## Fehlende Begriffe

Keine neuen.

## Nicht bestätigt

- **unsicher:** Wie häufig der Mischfall in der Praxis ist (Heizung mit Akonto, der Rest pauschal). Dazu gibt es keine Fedlex-Quelle, unverändert seit Runde 1.
- Ob der Product Owner den geänderten Wortlaut der Glossarzeile bestätigt hat. Das ist offen seit Runde 2, gesucht habe ich nicht.
- Ich habe nichts ausgeführt, weder Tests noch Szenarien (read-only). Die Teilzeichenketten habe ich nur mit `messages/*.json` verglichen.
- Fedlex habe ich in dieser Runde nicht neu abgerufen, die Zitate stammen aus Runde 1.
