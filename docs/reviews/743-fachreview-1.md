# Fachreview #743 / #751, Runde 1 (Commit 99525e5)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Die Summary «Mehr dazu» sagt nicht, was dahinter steht. Hinter ihr stehen die Verteilung von Kosten, die nur alle paar Jahre anfallen (`invoices_service_period_years`), und die Bedingung im Mietvertrag für das Entkalken (`invoices_service_period_boiler`, Art. 257a Abs. 2 OR). Wer eine Tankrevision oder ein Entkalken erfasst (Art. 5 Abs. 2 Bst. e VMWG, beides periodische Arbeiten), hat keinen Grund, den Bereich zu öffnen. Er gibt dann keinen Leistungszeitraum ein, und die ganzen Kosten fallen in ein einziges Jahr. Möglicher Fix: eine Summary, die den Inhalt nennt, z. B. «Mehr dazu: Kosten über mehrere Jahre, Entkalken». Das ändert einen Text, den der Product Owner in #751 entschieden hat, also braucht es seine Entscheidung. Der Normtext verlangt die Verteilung über mehrere Jahre nicht wörtlich (siehe «Nicht bestätigt»), deshalb nur Minor. |
| V-2 | Verwalter | Minor | Laut #743 wird «nichts stillschweigend gekürzt», die Regel gilt auch im Dialog «Rechnungen hochladen». Die Szenarien prüfen nur die Fehlermeldung. Es fehlt eine Negativprüfung: die Rechnung ist nicht gespeichert und das Feld zeigt noch den ganzen Text (invoice-new.feature:86–89, invoice-edit.feature:76–79). Für den Upload-Dialog gibt es kein Szenario zur Länge. Fix: je ein «Und …» mit dieser Prüfung und ein Szenario im Upload-Dialog (oder `No scenario: <Grund>`). |

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| invoices_upload_fields_missing | Füllen Sie die Felder mit einer Fehlermeldung aus. | Remplissez les champs qui affichent un message d’erreur. | Compili i campi che mostrano un messaggio di errore. | Fill in the fields that show an error message. |
| invoices_upload_removed_last | {name} entfernt. Sie können das Gebäude wieder wählen. | {name} retiré. Vous pouvez à nouveau choisir l’immeuble. | {name} rimosso. Può di nuovo scegliere l’immobile. | {name} removed. You can choose the building again. |
| ui_error_too_long | Höchstens {max} Zeichen. Kürzen Sie den Text. | {max} caractères au maximum. Raccourcissez le texte. | Al massimo {max} caratteri. Accorci il testo. | At most {max} characters. Shorten the text. |
| invoices_service_period_more | Mehr dazu | En savoir plus | Maggiori informazioni | More about this |

## Beurteilung: nur der erste Absatz am Feld (#751)

- **Kategorie mit Tankbestand:** Am Feld steht `invoices_service_period_fuel`. Er enthält alles, was der Vermieter für die Daten einer Lieferung braucht: Beginn und Ende gleich dem Tag der Lieferung, ohne Leistungszeitraum zählt das Rechnungsdatum, bei einem längeren Zeitraum dessen letzter Tag. Das entspricht dem Verbrauchsprinzip, VMWG Art. 5 Abs. 2 Bst. a (Stand 1. Oktober 2025): «die Brennstoffe und die Energie, die verbraucht wurden». `invoices_service_period_help` hinter «Mehr dazu» braucht es für eine Lieferung nicht.
- **Andere Kategorien:** Am Feld steht `invoices_service_period_help`, mit der Regel zur Abgrenzung nach Tagen (Beispiel Quartal, «nur die Tage, die in die Abrechnungsperiode fallen»). Das genügt für die übliche Rechnung über einen Zeitraum.
- **Hinter «Mehr dazu»:** Die Bedingung für das Entkalken (OR Art. 257a Abs. 2, Stand 1. Oktober 2026: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.») betrifft nur die Frage, ob die Kosten umlagefähig sind, nicht die Daten. Sie bleibt erreichbar. Der Satz «Kommt die Arbeit früher wieder …» ändert nur Folgeabrechnungen; eine versendete Abrechnung behält ihre Anteile. Kein Blocker und kein Major. Was dem Vermieter bei Kosten über mehrere Jahre entgehen kann, steht in V-1.

## Fehlende Begriffe

Keine. Rechnungssteller, Rechnungsnummer, Leistungszeitraum und Gebäude (immeuble, immobile, building) stammen aus `UBIQUITOUS_LANGUAGE.md` und `docs/design/i18n-begriffe.md`.

## Nicht bestätigt

- Ob Kosten für periodische Arbeiten, die alle paar Jahre anfallen (Art. 5 Abs. 2 Bst. e VMWG), über diese Jahre verteilt werden **müssen**: Weder VMWG Art. 4–5 (Stand 1. Oktober 2025) noch OR Art. 257a–257b (Stand 1. Oktober 2026) sagen das wörtlich. In `docs/nebenkostenabrechnung-anforderungen.md` Thema 1 ist die Periodengerechtigkeit als «unsicher-B» vermerkt (Praxis). **unsicher**

Geprüft: Die Grenzen 50 und 255 Zeichen entsprechen `backend/src/db/schema.ts:310–311` (varchar zählt in PostgreSQL Zeichen). Der Testwert in invoice-edit.feature:78 hat 52 Zeichen. Die Schrittänderung in invoices.feature entspricht wörtlich dem Entscheid in #743. Die Szenarien von #751 entsprechen den Entscheiden vom 4. und 7. November 2026. Stil und Begriffe der Übersetzungen folgen den Nachbarn `invoices_upload_removed`, `invoices_upload_building_locked`, `backend_document_title_too_long` und `demo_line_link`.

## Nachtrag V-1

| key | de | fr | it | en |
|---|---|---|---|---|
| invoices_service_period_more | Mehr dazu: Zeiträume, Kosten über mehrere Jahre, Entkalken | En savoir plus : périodes, frais sur plusieurs années, détartrage | Maggiori informazioni: periodi, costi su più anni, decalcificazione | More about this: periods, costs over several years, descaling |

«Zeiträume» deckt in der Kategorie des Tanks `invoices_service_period_help` ab. In den anderen Kategorien steht dieser Absatz am Feld, und «Zeiträume» meint dann den Leistungszeitraum über mehrere Jahre; ein einziger Text gilt so für beide Fälle. Bei 390 px bricht die Summary auf zwei Zeilen um, sie bleibt lesbar. Im fr vor dem Doppelpunkt dasselbe Leerzeichen wie in `invoices_service_period_years` («Un exemple : »). Die Begriffe stammen aus den bestehenden Absätzen: période, frais, détartrage; periodo, costi, decalcificazione; period, costs, descaling.
