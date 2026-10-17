# Fachreview W11, Runde 2: Rechnungszeilen nennen ihre Rechnung (#236)

Geprüfter Stand: Worktree `review-w11-fach2`, Commit c453a49, Delta `git diff 498381d c453a49`. Gegenstand: `backend/src/services/pdf.service.ts` (`partNamed`, `nameOf`, `partLines`), `backend/src/services/statement-pdf.service.ts:92-93`, `tests/e2e/features/statement-detail.feature:423-444`, `backend/src/__tests__/statement-pdf.pg.test.ts:262-280`, `backend/src/__tests__/statement-pdf-render.test.ts:345-357`, `docs/nebenkostenabrechnung-anforderungen.md:145`.

## Status der offenen Befunde aus Runde 1

| ID | Rolle | Schwere (R1) | Status | Kurz |
|----|-------|--------------|--------|------|
| V-1 | Verwalter | Major | **erledigt** | Eine Zeile «Ohne Leistungszeitraum» nennt jetzt immer ihre Rechnung. Der Fall von Dr. Weber ist abgedeckt. |
| V-2 | Verwalter | Major | **akzeptiert als Produktentscheid** (an #256 übergeben) | #236 hat «its description or Rechnungssteller» entschieden. Der Wechsel zu Rechnungsdatum/Rechnungsnummer ist Sache des Product Owners. Das Vorgehen ist korrekt. |
| V-3 | Verwalter | Minor | **erledigt** | Der Name steht als Klammerzusatz am Ende. Es gibt keinen Gedankenstrich und keinen Grossbuchstaben mitten in der Zeile mehr, in allen vier Sprachen. |
| V-4 | Verwalter | Minor | **erledigt** (mit Rest zu V-2) | Das Szenario prüft jetzt die einzelne Zeile ohne Leistungszeitraum, zwei gleiche Zeilen und eine eindeutige Zeile. Den Fall gleicher Beschreibungen kann es weiterhin nicht zeigen. Das gehört aber zu V-2/#256. |
| M-1 | Mietrecht | Nit | unverändert | Kein Rechtsmangel, siehe Runde 1. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-5 | Verwalter | Minor | Haben zwei gleiche Zeilen auch dieselbe Beschreibung, bleiben sie nach dem Namen gleich. #236 erlaubt als Ausweg schon heute den Rechnungssteller («description or Rechnungssteller»), der Code nutzt ihn aber nicht. |
| V-6 | Verwalter | Nit | Die Anforderung in `nebenkostenabrechnung-anforderungen.md:145` sagt nicht, dass die Zeile «Veränderung Tankbestand» nie einen Namen bekommt. |

### V-1: erledigt

**Beleg.**
- `pdf.service.ts:701`: `const nameOf = (part: Part, same: number) => (!part.fuelStock && (part.noPeriod || same > 1) ? part.description : undefined);`
- `pdf.service.ts:685-689`: `same` zählt die gleichen Texte **vor** dem Namen innerhalb derselben Position. Das ist richtig: Massgebend ist, ob Daten und Betrag allein unterscheiden.
- Zuordnung Teil zu Rechnung: `statement-pdf.service.ts:93` verbindet `invoiceParts[i]` mit `invoices[i]`. Beide entstehen aus demselben `group.invoices` in derselben Reihenfolge (`calculation.service.ts:156` und `:382`), und jsonb-Arrays behalten ihre Reihenfolge. Auch der Teil des Tankbestands steht in beiden Listen an derselben Stelle (`fuelStock` in beiden `map`). Die Indizes passen also, auch mit Tankbestand.
- Abrechnungen vor #96 haben keine `invoices`. Dort gilt `description` = undefined, es gibt keinen Namen, und die Zeile bleibt wie bisher. Das ist richtig.
- Eine Beschreibung `''` ergibt keinen Namen, statt «Rechnung «»» zu drucken. Das ist richtig.

**Nachgerechnet** (Szenario `statement-detail.feature:427-444`, Einzug 15.08.2025, Periode 2025):
- Ohne Leistungszeitraum: 17 + 30 + 31 + 30 + 31 = 139 von 365 Tagen, richtig.
- 01.04.–30.06.2025: 30 + 31 + 30 = 91 Tage, gemietet 0, also «0 von 91», richtig. Die Zeile ist eindeutig und bekommt keinen Namen, richtig (`:443-444`).
- 01.07.–30.09.2025: 31 + 31 + 30 = 92 Tage, gemietet 17 + 30 = 47, zweimal CHF 900.00. Beide Zeilen haben denselben Text, also bekommt jede ihren Namen (`:441-442`), richtig.
- Zeitanteil der Position zur Kontrolle: (765 × 139/365 + 600 × 0/91 + 2 × 900 × 47/92) / 3'165 = (291.33 + 0 + 919.57) / 3'165 = 38.26 %.
- Randfall Mieter über die ganze Periode: `daysOf` liefert `noDays` (`calculation.service.ts:155`). Es gibt keine Zeilen und keine Namen, richtig.
- Randfall Summe 0 (Gutschrift): ebenso keine Zeilen (`:155`, pg-Test «druckt keine Rechnungen …»).

### V-2: Übergabe an #256 akzeptiert

**Beleg.**
- #236, «Done means»: «a line names the invoice (its description or Rechnungssteller) where the dates and amount alone do not tell it from another.»
- #256 ist offen und trägt die Labels `fachlich` und `entscheiden`. Der Kommentar https://github.com/rudini/Dwello/issues/256#issuecomment-6229160585 gibt den Vorschlag (Rechnungsdatum, dann Rechnungsnummer) mit Begründung und Fundstellen wieder, als «Proposed (confirm before starting)».

**Bewertung.** Die Beschreibung als Merkmal folgt dem entschiedenen Text des Issues. Ihn zu ändern, ist nach CLAUDE.md («When to ask», «Coding guidelines») der Entscheid des Product Owners. Die Übergabe ist also richtig und blockiert #236 nicht. Mein fachlicher Einwand bleibt in #256 sichtbar: Die Beschreibung ist Freitext und oft ein Vorschlag der KI. Das Rechnungsdatum steht dagegen auf jedem Beleg. Die Änderung macht gegenüber dem Basis-Commit nichts schlechter: Vorher hatte keine Zeile einen Namen.

### V-3: erledigt

**Beleg.** `pdf.service.ts:82, 160, 238, 316`:
- DE `'{line} (Rechnung «{description}»)'`
- FR `'{line} (facture « {description} »)'`, mit geschütztem Leerzeichen U+00A0 innen (geprüft mit `od -c`: `302 253 302 240` … `302 240 302 273`), wie es `docs/design/i18n-begriffe.md:5` vorgibt
- IT `'{line} (fattura «{description}»)'`
- EN `'{line} (invoice ‘{description}’)'`, mit denselben einfachen typografischen Anführungszeichen wie die übrigen englischen PDF-Texte (`pdf.service.ts:301`, `:334`, `:338`)

Die Begriffe facture, fattura und invoice entsprechen `i18n-begriffe.md`. Die Zeile beginnt weiter mit dem grossgeschriebenen Anfang der Vorlage («Ohne Leistungszeitraum», «Leistungszeitraum …»). Das ist jetzt korrekt, weil nichts mehr davor steht. Die Zeichen ‘ ’ « » liegen in WinAnsi beziehungsweise Latin-1 (`pdf.service.ts:447-449`). Freitext in der Beschreibung geht wie aller PDF-Text durch `winAnsi()` (`pdf.service.ts:963-964`). Damit ist auch mein Punkt «Zeichen im PDF» aus Runde 1 bestätigt: Zeichen ohne Glyphe werden ersetzt, nicht falsch gedruckt.

### V-4: erledigt

**Beleg.** `statement-detail.feature:423-444`: eine Rechnung ohne Leistungszeitraum, eine eindeutige über April bis Juni und zwei über Juli bis September mit gleichem Betrag. Das `@wip` ist entfernt. Der pg-Test (`statement-pdf.pg.test.ts:262-280`) prüft dasselbe mit realistischen Beschreibungen ohne Datum («Hauswartung Q3», «Gartenpflege», «Treppenhausreinigung»). Der Render-Test (`statement-pdf-render.test.ts:345-357`) prüft alle vier Sprachen. Ein Rest bleibt: Die E2E-Beschreibungen enthalten weiter das Datum (Fixture `${categoryName} ${date}`). Für die geprüfte Regel ist das unschädlich, weil sie nur prüft, *ob* ein Name steht. Ob er unterscheidet, ist V-2/V-5.

### V-5 (Minor): Gleiche Beschreibung, gleiche Zeile

**Beleg.**
- `pdf.service.ts:701` nimmt nur `part.description`. `statement-pdf.service.ts:93` übergibt nur die Beschreibung, und die gespeicherten `invoices` haben keinen Rechnungssteller (`calculation.service.ts:382-389`: id, description, amount, start, end, fuelStock).
- #236: «its description **or** Rechnungssteller».
- Dr. Webers Fall (`docs/design/personas/dr-weber-241.md:11`): vier Hauswart-Rechnungen zu je CHF 765.00. Beschreibt der Liegenschaftsverwalter zwei Quartalsrechnungen desselben Leistungszeitraums beide mit «Hauswartung», steht zweimal «… (Rechnung «Hauswartung»)».

**Warum falsch.** Das Ziel von #236, «A tenant can match each invoice line … to its receipt», ist in diesem Fall nicht erreicht. Der Rechnungssteller ist im entschiedenen Text als Alternative schon erlaubt. Er würde mindestens Rechnungen verschiedener Lieferanten trennen, zum Beispiel Hauswart und Reinigungsfirma in derselben Kategorie. Gleiche Lieferanten trennt er nicht. Dafür bräuchte es das Rechnungsdatum oder die Rechnungsnummer, also #256.

**Korrektur.** Das ist kein Blocker für #236, weil die Regel dem Issue entspricht. Ich schlage vor, den Fall in #256 aufzunehmen, damit er zusammen mit V-2 entschieden wird: «Sind zwei benannte Zeilen einer Position noch gleich, kommt ein weiteres Merkmal dazu.» Welches Merkmal das ist (Rechnungssteller, Rechnungsdatum, Rechnungsnummer), entscheidet der Product Owner in #256. Wenn das Merkmal ohnehin dort neu gefasst wird, braucht es kein eigenes Issue.

### V-6 (Nit): Ausnahme Tankbestand in der Anforderung

**Beleg.** `docs/nebenkostenabrechnung-anforderungen.md:145`: «wo Daten und Betrag einer Zeile keinem Beleg entsprechen, also ohne Leistungszeitraum oder bei gleicher Zeile wie eine andere, nennt sie die Beschreibung der Rechnung». Im Code gilt dagegen `!part.fuelStock` (`pdf.service.ts:701`).

**Warum.** Die Zeile des Tankbestands ist keine Rechnung (#239). Die Regel greift bei ihr also sinngemäss nicht. Gleiche Daten wie eine andere Zeile hat sie in der Praxis auch kaum. Für Leser der Anforderung wäre «(nicht die Veränderung des Tankbestands, sie ist keine Rechnung)» trotzdem eindeutiger.

**Korrektur.** Den Halbsatz ergänzen, wenn die Datei ohnehin angefasst wird.

## Fehlende Begriffe

Keine. Verwendet werden «Rechnung», «Beschreibung» (`UBIQUITOUS_LANGUAGE.md:68`), «Leistungszeitraum» und «Abrechnungsperiode», alle im Glossar. Die Übersetzungen stehen in `docs/design/i18n-begriffe.md`.

## Nicht bestätigt

- **Sehr lange Beschreibungen:** `positionHeight` misst die Zeilen mit `heightOfString` (`pdf.service.ts:646-650`), Umbrüche sind also eingerechnet. Ob eine sehr lange Beschreibung (mehrere Absätze, Zeilenumbrüche aus der KI-Auslesung) eine Position über eine ganze Seite hinaus wachsen lässt und `room()` das korrekt behandelt, habe ich nicht ausprobiert. Die Beschreibung wird nicht gekürzt.
- **PDF einer versendeten Abrechnung:** `generateStatementPdf` erzeugt das PDF auch für eine versendete Abrechnung neu (`statement-pdf.service.ts:248-263`, nur Entwürfe werden neu datiert). Ein neu erzeugtes PDF einer schon versendeten Abrechnung (seit #96) bekommt also die Namen dazu. Beträge und Berechnung ändern sich nicht, nur der Klammerzusatz kommt dazu. Das galt schon für #226 und #241 und ist kein neues Verhalten dieser Änderung. Ob der Liegenschaftsverwalter das PDF einer versendeten Abrechnung im UI überhaupt neu erzeugen kann, habe ich nicht geprüft.
- **Art. 257b Abs. 2 OR:** Der Wortlaut ist in Runde 1 auf Fedlex zitiert: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» In dieser Runde habe ich ihn nicht erneut abgerufen, weil sich die Rechtslage für das Delta nicht ändert.
- **Lauf von E2E und Tests:** Ich habe nur den Code gelesen und nachgerechnet, keine Tests ausgeführt. Ob das Szenario und die Tests grün sind, belegt der Aufrufer.
