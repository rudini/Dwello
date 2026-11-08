# Fachreview #1160, Runde 1 (Commit 2faebf7)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die Ablehnung im Szenario (Platzhalter, categories.feature:370) sagt nicht, was der Liegenschaftsverwalter tun kann. Der Text unten ersetzt ihn. |
| V-2 | Verwalter | Minor | categories.feature:358: Der Kommentar spricht von einem «Posten» (kein Begriff aus UBIQUITOUS_LANGUAGE.md, dort heisst es «Abrechnungsposition», Z. 177) und begründet mit dem Versand, Z. 366 legt aber einen Entwurf an (`contract-detail.steps.ts:86`). Lösung: Z. 366 «für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Seeblick"» (Step in `contract-detail.steps.ts:93`), Kommentar: «# #1160: eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat; ohne ihre Kategorie stünde eine Abrechnungsposition im neu erstellten PDF anders da». |

## V-1 (Major): Ablehnung ohne nächsten Schritt

- Beleg: categories.feature:370 «Die Kategorie steht in einer Abrechnung und kann nicht gelöscht werden.» CLAUDE.md, Design-Regeln: «errors say what happened and what to do».
- Was die App erlaubt (geprüft):
  - Ein Entwurf lässt sich neu berechnen (`statement.service.ts:596-615`). Die Neuberechnung löscht alle Abrechnungspositionen und setzt sie aus den heutigen Rechnungen neu. Diese Ablehnung erreicht der Liegenschaftsverwalter nur, wenn die Kategorie keine Rechnung mehr hat, denn `CATEGORY_IN_USE(_ONE)` prüft vorher (`category.service.ts:235-258`). Nach der Neuberechnung ist die Abrechnungsposition also weg.
  - Ein Entwurf lässt sich auch löschen. Nur Entwürfe gehen (`statement.service.ts:987-990`, `STATEMENT_NOT_DRAFT`).
  - Versendete, bezahlte und ersetzte Abrechnungen lassen sich weder neu berechnen (`STATEMENT_NOT_RECALCULABLE`) noch löschen. Auch eine berichtigte Abrechnung ändert die ersetzte nicht: «Die bisherige bleibt unverändert erhalten» (`statements_correct_open`). Hier gibt es keinen Weg. Die Kategorie bleibt, und der Text muss das sagen.
- Lösung: den Text der Tabelle «Wortlaut» in alle vier Dateien und in Z. 370 übernehmen. Der Satz «Danach lässt sich die Kategorie löschen» stimmt nur, solange die Rechnungsprüfung vor der Prüfung der Abrechnungen läuft. Diese Reihenfolge mit einem Test festhalten (Kategorie mit Rechnung und Abrechnungsposition ergibt `CATEGORY_IN_USE_ONE`).
- Zählparameter: keiner. Die Zahl hilft beim nächsten Schritt nicht, und Entwürfe und versendete Abrechnungen bräuchten je eine eigene Zahl.

## Wortlaut

| key | de | fr | it | en |
|-----|----|----|----|----|
| backend_category_in_statement | Die Kategorie steht in einer Abrechnung und kann nicht gelöscht werden. Eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat, mit ihren Kategorien. Steht die Kategorie nur in Entwürfen, berechnen Sie diese mit «Neu berechnen» auf ihrer Seite neu oder löschen Sie sie. Danach lässt sich die Kategorie löschen. | La catégorie figure dans un décompte et ne peut pas être supprimée. Un décompte envoyé reste tel que le locataire l’a reçu, avec ses catégories. Si la catégorie ne figure que dans des brouillons, recalculez-les avec « Recalculer » sur leur page ou supprimez-les. La catégorie pourra ensuite être supprimée. | La categoria figura in un conteggio e non può essere eliminata. Un conteggio inviato resta come l’ha ricevuto l’inquilino, con le sue categorie. Se la categoria figura solo in bozze, le ricalcoli con «Ricalcolare» sulla loro pagina o le elimini. Dopo si potrà eliminare la categoria. | The category is in a statement and cannot be deleted. A sent statement stays as the tenant received it, with its categories. If the category is only in drafts, recalculate them with «Recalculate» on their page or delete them. Then the category can be deleted. |

(fr: zwischen den Guillemets und «Recalculer» je ein geschütztes Leerzeichen U+00A0, wie in `invoices_edit_billed_text`.)

`categories_delete_text` bleibt, wie es ist. Er spricht nur von der Auswahl beim Erfassen von Rechnungen und von den Mietverträgen. Da die Ablehnung jede Änderung an Abrechnungen verhindert, bleibt jeder Satz darin wahr.

Geprüft: Begriffe im Szenario (Kategorie, eigene Kategorie, Abrechnung, Liegenschaftsverwalter, Seite «Kategorien») stimmen mit UBIQUITOUS_LANGUAGE.md überein. Die Vorbedingung «Rechnung danach gelöscht» ist der einzige Fall, in dem die neue Ablehnung erscheint, denn eine Rechnung lässt sich auch nach dem Abrechnen löschen (`invoice.service.ts:406-420`). Die Begriffe fr/it/en folgen `docs/design/i18n-begriffe.md` (décompte/conteggio/statement, brouillon/bozza/draft, Recalculer/Ricalcolare/Recalculate, locataire/inquilino/tenant). Die Begründung der Ablehnung stützt sich auf die Praxis der Verwaltung, nicht auf einen Gesetzesartikel, und der Text nennt keinen. Fedlex war deshalb nicht nötig.

## Nicht bestätigt

- Ob der Step von Z. 366 (Entwurf oder versendet) wirklich eine Abrechnungsposition der Kategorie «Treppenhausreinigung» anlegt, habe ich nur aus dem Namen des Steps geschlossen. Die Seed-Implementierung in `tests/e2e/steps/contract-detail.steps.ts:86-100` habe ich nicht gelesen.
- Ausserhalb dieses Auftrags, nicht geprüft: Beim Umbenennen einer Kategorie und beim Löschen eines Verteilschlüssels (`utility_statement_line_items.distribution_key_id`, `onDelete: 'set null'`, `schema.ts:554`) könnte sich ein neu erstelltes PDF einer versendeten Abrechnung auf dieselbe Art ändern.
