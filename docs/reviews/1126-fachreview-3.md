# Fachreview 1126-3 (Kostenabstimmung, Feature-Review Schritt 5, Commit 0e38ec3)

Gegenstand: `git diff bb697b7 0e38ec3 -- messages UBIQUITOUS_LANGUAGE.md docs/design/i18n-begriffe.md` (Worktree `review-1126-fach3`), nur `help_statements_5`, Menüeintrag `reports_title`, Glossarzeile «Kostenabstimmung», i18n-begriffe-Zeile, französische Guillemets; dazu Issue #1138. Vorberichte `docs/reviews/1126-fachreview-1.md`, `-2.md`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-14 | Verwalter | Minor | `messages/fr.json` `reports_note_not_current_one` / `_many`: vor beiden «:» steht ein normales Leerzeichen (U+0020), sonst überall in fr.json ein geschütztes (406 Stellen mit U+00A0, 11 mit U+0020). Der Doppelpunkt kann so an den Zeilenanfang rutschen. Fix: U+00A0 vor beiden Doppelpunkten (Text unten; mein Text aus Runde 2 stand mit normalen Leerzeichen im Bericht) |
| V-15 | Verwalter | Minor | `UBIQUITOUS_LANGUAGE.md:179`: Die Aufzählung der Gründe für die Differenz nennt die Nebenkostenpauschale nicht, `reconciliation_landlord_help` aber schon («Auch Nebenkosten, die ein Mieter pauschal bezahlt, …»). Fix: Zeile unten |

## Texte

`␣` steht für das geschützte Leerzeichen U+00A0; einzusetzen ist das Zeichen selbst. de, it, en bleiben unverändert.

| key | de | fr | it | en |
|---|---|---|---|---|
| reports_note_not_current_one | 1 Abrechnung dieser Abrechnungsperiode ist nicht aktuell: Seit ihrem Erstellen wurden Rechnungen erfasst, geändert oder gelöscht oder der Tankbestand geändert. Öffnen Sie sie, um zu sehen, ob Sie sie neu berechnen oder berichtigen müssen: {statements}. | 1 décompte de cette période de décompte n’est pas à jour␣: depuis sa création, des factures ont été saisies, modifiées ou supprimées, ou le stock de combustible a changé. Ouvrez-le pour voir si vous devez le recalculer ou le rectifier␣: {statements}. | 1 conteggio di questo periodo di conteggio non è aggiornato: dalla sua creazione sono state registrate, modificate o eliminate fatture oppure è cambiata la scorta di combustibile. Lo apra per vedere se deve ricalcolarlo o rettificarlo: {statements}. | 1 statement of this billing period is not up to date: since it was created, invoices were added, changed or deleted, or the fuel stock changed. Open it to see whether you need to recalculate or correct it: {statements}. |
| reports_note_not_current_many | {count} Abrechnungen dieser Abrechnungsperiode sind nicht aktuell: Seit ihrem Erstellen wurden Rechnungen erfasst, geändert oder gelöscht oder der Tankbestand geändert. Öffnen Sie sie, um zu sehen, ob Sie sie neu berechnen oder berichtigen müssen: {statements}. | {count} décomptes de cette période de décompte ne sont pas à jour␣: depuis leur création, des factures ont été saisies, modifiées ou supprimées, ou le stock de combustible a changé. Ouvrez-les pour voir si vous devez les recalculer ou les rectifier␣: {statements}. | {count} conteggi di questo periodo di conteggio non sono aggiornati: dalla loro creazione sono state registrate, modificate o eliminate fatture oppure è cambiata la scorta di combustibile. Li apra per vedere se deve ricalcolarli o rettificarli: {statements}. | {count} statements of this billing period are not up to date: since they were created, invoices were added, changed or deleted, or the fuel stock changed. Open them to see whether you need to recalculate or correct them: {statements}. |

Glossarzeile (V-15), Spalte Definition, ersetzt die heutige:

> Vergleich je Gebäude und Abrechnungsperiode: pro Abrechnungsposition die Kosten des Gebäudes nach den heutigen Rechnungen, was die Abrechnungen der Periode (Entwürfe eingeschlossen, ersetzte nicht) den Mietern belasten, ohne Verwaltungspauschale, und die Differenz, die der Vermieter trägt (Leerstand, nicht oder später vereinbarte Kategorien, Tage ausserhalb von Dwello abgerechnet, Nebenkostenpauschale, Mietverträge ohne Abrechnung, Rundung). Verwaltungspauschale und nicht umlagefähige Rechnungen stehen getrennt darunter. In der Vorschau des Abrechnungslaufs und unter «Berichte».

## Issue #1138

Keiner der vier Punkte ist ein rechtliches Problem. Die Abstimmung ist eine interne Ansicht für den Vermieter und geht nicht an den Mieter. Punkt 1: Dass die Heizposition den Verbrauch aus dem Tank enthält (Anfangsbestand + Einkauf − Endbestand), ist richtig und steht so im Glossar («Kosten des Gebäudes»: «Heizmaterial aus dem Tank mit dem Verbrauch»). Es fehlt nur eine Erklärung. Punkte 2 bis 4: Minor (UX).

## Nicht bestätigt

- Ob die Vorschau und «Berichte» nach dem Erstellen der Entwürfe wirklich die gleichen Zahlen zeigen, wie es `help_statements_5` («Dieselbe Kostenabstimmung zeigt schon die Vorschau») sagt. Gelesen habe ich nur `backend/src/services/cost-reconciliation.service.ts:100–158` (`runReconciliation` = gültige Abrechnungen + die, die der Lauf erstellt; `reportReconciliation` = gültige Abrechnungen + Hinweise). Gerechnet oder getestet habe ich nichts (Auftrag).

Geprüft: `help_statements_5` de/fr/it/en (Begriffe, Sie/vous/Lei, Guillemets wie in den Nachbarsätzen `help_statements_1–4`), Menüeintrag `reports_title` (`src/lib/ui/navigation.ts:85`, Berichte / Rapports / Rapporti / Reports), i18n-begriffe-Zeile (rapprochement des coûts / riconciliazione dei costi / cost reconciliation), geschützte Leerzeichen in den französischen Guillemets aller #1126-Texte.
