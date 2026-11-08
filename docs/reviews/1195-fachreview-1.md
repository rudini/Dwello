# Fach-Review #1195, Runde 1 (Schritt 1, vor der Umsetzung)

Commit a3c6e84 (Worktree review-1195-fach). Gegenstand: @wip-Szenarien «Nicht umlagefähige Kategorie wählen», «Nicht umlagefähige eigene Kategorie wählen» und #687 «Nicht umlagefähige Kategorie ohne Warnung wählen» in `tests/e2e/features/invoice-new.feature`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter / Mietrecht | Minor | Der allgemeine Satz `invoices_category_not_allocable_text` (messages/de.json:1012), den das neue Szenario wörtlich festschreibt (invoice-new.feature, «Nicht umlagefähige eigene Kategorie wählen», Dann-Zeile), passt nicht zu jeder Kategorie ohne Grund der Umlagefähigkeit: «z. B. Reparaturen, Gebäudeversicherung» liest sich, als wären das Kosten *dieser* Kategorie, und «können nicht … umgelegt werden» behauptet ein gesetzliches Verbot. Für eine vordefinierte umlagefähige Kategorie, deren Umlagefähigkeit der Liegenschaftsverwalter auf «nicht umlagefähig» geändert hat (z. B. Heizung; `reasonOf` gibt dann keinen Grund, CategoryReason.svelte:39–42), ist das falsch: Heizkosten sind nach Art. 257b Abs. 1 OR («wie Heizungs-, Warmwasser- und ähnliche Betriebskosten», Stand 1.10.2026) umlagefähig; der Vermieter verzichtet nur darauf. Für eine eigene Kategorie hat der Vermieter die Einstufung selbst getroffen (UBIQUITOUS_LANGUAGE.md:100–101). Fix: Satz durch die Feststellung ersetzen, dass die Kategorie so festgelegt ist und der Vermieter die Kosten trägt (Wortlaut unten). Das Issue sagt «keeps the general sentence»: Der Fix braucht deshalb einen Entscheid des Product Owners; da das Szenario den Satz wörtlich festhält, ist es besser, jetzt zu entscheiden als später einen Spec-Change zu brauchen. |

## Wortlaut (zu V-1, falls der Product Owner zustimmt)

| key | de | fr | it | en |
|---|---|---|---|---|
| invoices_category_not_allocable_text | Diese Kategorie ist als nicht umlagefähig festgelegt. Ihre Kosten tragen Sie als Vermieter. | Cette catégorie est définie comme non répercutable. En tant que bailleur, vous en supportez les coûts. | Questa categoria è definita come non addebitabile. I suoi costi sono a suo carico in quanto locatore. | This category is set as non-allocable. As the landlord, you bear its costs. |

(Begriffe nach docs/design/i18n-begriffe.md:33, 63; Satzbau wie `apartments_vacancy_costs_help`. Die Dann-Zeile des Szenarios «Nicht umlagefähige eigene Kategorie wählen» übernähme den deutschen Satz.)

## Nicht bestätigt

- Die Gesetzeszitate der übrigen nicht umlagefähigen Begründungen (Art. 256b OR, Art. 4 Abs. 3, Art. 5 Abs. 2 lit. h/i, Art. 14 VMWG, Art. 269a lit. b OR) habe ich in dieser Runde nicht erneut gegen Fedlex geprüft; sie stammen aus den Reviews #186/#292 (docs/reviews/186-fachreview-1.md, 292-fachreview-1.md) und ändern sich mit #1195 nicht. Geprüft wurden nur Art. 256 Abs. 1, 257a, 257b OR (Stand 1.10.2026).

Geprüft: Begründung direkt unter dem Titel «Nicht umlagefähige Kategorie» ist fachlich richtig und entspricht dem Begriff «Grund der Umlagefähigkeit» (UBIQUITOUS_LANGUAGE.md:102, entfällt bei geänderter Umlagefähigkeit, wie `reasonOf`); Titel + Begründung + Checkbox-Hilfe «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.» lesen sich widerspruchsfrei (jede nicht umlagefähige Begründung endet mit «also nicht umlagefähig»; Verwaltung, Gebäudeversicherung nennen im Formular nützlich die Ausnahmen Verwaltungspauschale bzw. Heizungsversicherung); Repairs-Satz im Szenario wörtlich gleich messages/de.json:1737, Art. 256 Abs. 1 OR («…in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten», Stand 1.10.2026) trägt ihn; #687-Szenario (keine Warnung) fachlich richtig; keine neuen Fachbegriffe.
