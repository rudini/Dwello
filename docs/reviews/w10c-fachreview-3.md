# Fachreview W10c, Runde 3: Nachprüfung (#363, Entscheid #91)

Gegenstand: Worktree `review-w10c-close`, Commit 675e5c5, Delta `git diff a9bd54a 675e5c5`. Geprüft: `backend/src/services/{statement-pdf,agreed-category,contract}.service.ts`, `src/routes/contracts/AgreedCategories.svelte`, `src/lib/server/category.ts`, `messages/{de,fr,it,en}.json` (neue Schlüssel `contracts_agreed_costs_none_*`, it-Korrektur, Ladefehler), `docs/nebenkostenabrechnung-anforderungen.md` (Commit 67fdd3f), `docs/api-specification.md`. Rechtsquellen wie in Runde 1 und 2: Art. 257a Abs. 2 OR («nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat»), Wortlaut in `docs/reviews/w10c-fachreview-1.md`. Für diese Runde brauchte es keine neue Norm.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | erledigt | Die PDF-Zeile erscheint nur noch, wenn jede Position eine Kategorie hat. Die eigentliche Frage ist #382 |
| V-1 | Verwalter | erledigt | Beim Bearbeiten bleibt eine unbeantwortete Kategorie unbeantwortet |
| V-2 | Verwalter | erledigt | it «per la prossima scadenza di disdetta», keine Stelle mehr mit «il/al/del prossima» |
| V-12 | Verwalter | Minor | Neu durch den V-1-Fix: Speichern im Mietvertrag macht eine vereinbarte Kategorie, die gerade nicht umlagefähig ist, still zu «nicht vereinbart» |
| V-11 | Verwalter | Minor | Die Änderungen am Anforderungsdokument stimmen, aber Z. 101 meldet «Umgesetzt», obwohl die Rechnungen ohne Kategorie (#382) offen sind. Regel 12 und Punkt 7 im PDF-Aufbau fehlen |
| V-13 | Verwalter | Nit | Der neue Hinweis «Keine Nebenkosten vereinbart» erwähnt das Akonto nicht |
| V-14 | Verwalter | Nit | fr/it/en «Sans coche» / «Senza selezione» / «Without a tick» klingen unidiomatisch |

Aus Runde 2 bleiben offen, wie vom Aufrufer entschieden: M-2 (Minor, jetzt in #368), V-3 bis V-7 und M-3 (Minor/Nit, Wortlaut im Bericht von Runde 2).

## Bestätigt

### M-1: PDF-Zeile

`statement-pdf.service.ts:139–142`: `agreedCosts` gibt es nur, wenn `statement.agreedCategoryIds` gesetzt ist und `lineItems.every((item) => item.categoryId)` gilt. Eine Position ohne Kategorie entsteht nur aus der Gruppe `uncategorized` (`calculation.service.ts:119`, `:376`). Die Verwaltungspauschale ist keine Position (`:404`), und der Tankbestand trägt seine Kategorie (`fuel-stock.service.ts:88`, `:94`). Darum unterdrückt die neue Bedingung den Satz genau in dem Fall, in dem er falsch wäre.

Nachgerechnet mit den Flächen 50/150 m² über das ganze Jahr:
- Heizung 1000 und eine Rechnung 120 ohne Kategorie, ohne Verteilschlüssel, also pro Wohnung: Anna hat «Heizung» 250.00 und «Nicht kategorisiert» 60.00. Der Satz fehlt jetzt, das stimmt.
- Nur Heizung: Der Satz lautet «… vereinbarten Nebenkosten: Heizung.», das stimmt.
- Randfall ohne vereinbarte Kategorie, also ohne Position: Die Liste ist leer, und `pdf.service.ts:804` druckt nur bei `length > 0`. Es erscheint kein Satz mit leerer Aufzählung.
- Randfall: Eine Kategorie wird nach der Abrechnung gelöscht. `category_id` wird dann `null` (`schema.ts:477`, `onDelete: 'set null'`), und ein neu erzeugtes PDF zeigt den Satz nicht mehr. Das ist die sichere Seite.

Die Unit-Tests (`statement-pdf-data.test.ts`, neuer `describe`) decken beide Fälle ab und auch die Abrechnung vor #91 (`null`). Die Rechnungen ohne Kategorie selbst bleiben Gegenstand von #382 (`fachlich`, `entscheiden`). Das ist die Lösung 1 aus Runde 2, damit ist der Major geschlossen.

### V-1: Bearbeiten lässt Unbeantwortetes offen

`agreed-category.service.ts:60–76` mit `answeredOnly` wird nur von `updateContract` gesetzt (`contract.service.ts:392`). Geschrieben werden nur die Kategorien, die schon eine Zeile haben, und die angekreuzten. Durchgespielt an einem Mietvertrag mit Heizung = ja, Lift = nein und Treppenhausreinigung ohne Zeile:

| Aktion im Formular | gesendete Liste | Ergebnis |
|---|---|---|
| nur das Akonto ändern | [Heizung] | Heizung ja, Lift nein, Treppenhaus ohne Zeile. Der Assistent fragt weiter |
| Treppenhaus ankreuzen | [Heizung, Treppenhaus] | Treppenhaus ja |
| Heizung abwählen | [] | Heizung nein, Lift nein, Treppenhaus ohne Zeile |

Ein neuer Mietvertrag ohne `answeredOnly` beantwortet weiter jede umlagefähige Kategorie. Der pg-Test (`agreed-categories.pg.test.ts:99–101`) belegt die erste Zeile der Tabelle. Die API-Spezifikation (Z. 96) beschreibt das Verhalten richtig.

### V-2

`messages/it.json:725` und `:1011` lauten jetzt «per la prossima scadenza di disdetta». `grep "il prossima\|al prossima\|del prossima"` findet keine Stelle mehr.

### Neue Texte

- **de** «Keine Nebenkosten vereinbart» / «Ohne Häkchen rechnet Dwello diesem Mieter keine Nebenkosten ab. Stehen im unterschriebenen Mietvertrag Nebenkosten, kreuzen Sie sie an.» Das stimmt mit Art. 257a Abs. 2 OR überein: Ohne Vereinbarung sind die Nebenkosten im Mietzins inbegriffen. Die Begriffe Mieter, Mietvertrag und Nebenkosten stehen im Glossar. Der Hinweis erscheint nur bei `agreed?.length === 0`, also nicht beim neuen Mietvertrag vor der ersten Wahl. Im Bearbeiten-Fall mit unbeantworteten Kategorien kann der Assistent noch nachfragen. Der Satz bleibt trotzdem richtig, denn ohne Antwort rechnet Dwello nichts ab.
- **fr** «Aucuns frais accessoires convenus»: «aucuns» ist richtig, weil «frais» nur im Plural vorkommt. «décompte … à ce locataire» und «contrat de bail» entsprechen `i18n-begriffe.md`.
- **it** «Nessuna spesa accessoria pattuita»: «le selezioni» ist die richtige Höflichkeitsform. «contratto di locazione» und «inquilino» entsprechen `i18n-begriffe.md`.
- **en** «No utility costs agreed»: richtig.
- **Ladefehler** `buildings_categories_load_failed` in allen vier Sprachen (`messages/*.json:349`): sagt, was geschah und was zu tun ist. Er ersetzt `categories_load_failed` («Fehler beim Laden der Kategorien»), das keine Handlung nannte.

## Befunde

### V-12 (Minor): Vereinbarte, derzeit nicht umlagefähige Kategorie wird beim Speichern «nicht vereinbart»

**Beleg.**
- `agreed-category.service.ts:68–70`: `answered` ist bei `answeredOnly` die Bedingung `categories.id IN (SELECT category_id FROM contract_categories WHERE contract_id = …)`, ohne Filter auf `isAllowedUtilityCost`.
- Das Formular zeigt und sendet nur umlagefähige Kategorien: `agreeableCategories` (`src/lib/server/category.ts:41–43`) und `agreedCategoryIds` (`agreed-category.service.ts:20–33`, `eq(categories.isAllowedUtilityCost, true)`).
- `updateCategory` (`category.service.ts:175–187`) lässt den Schalter «umlagefähig» in beide Richtungen ändern.

**Warum falsch.** Ein Beispiel: Anna hat «Hauswart» vereinbart. Der Liegenschaftsverwalter stellt die Kategorie vorübergehend auf «nicht umlagefähig», etwa weil er Rechnungen prüft. In dieser Zeit ändert er bei Anna das Akonto und speichert. Die Zeile «Hauswart» steht in `answered`, aber nicht in der Liste, und wird darum `agreed = false`. Stellt er die Kategorie wieder auf umlagefähig, gilt sie bei Anna als nicht vereinbart. Der Assistent fragt nicht nach, weil eine Antwort gespeichert ist, und der Vermieter trägt die Kosten still. Vor dem Fix (a9bd54a, `WHERE isAllowedUtilityCost OR agreed`) blieb diese Zeile unberührt, der Fehler ist also neu. Rechtlich ist das die sichere Seite, praktisch ist es derselbe stille Verlust, den V-1 schliessen sollte.

**Behebung.** Die Bedingung `answered` auf umlagefähige Kategorien beschränken: `${categories.isAllowedUtilityCost} AND ${categories.id} IN (SELECT …)`. Dazu ein pg-Test: Eine Kategorie ist vereinbart und danach nicht umlagefähig, der PUT sendet eine Liste ohne sie, und die Zeile bleibt `agreed = true`.

### V-11 (Minor): Anforderungsdokument

**Beleg und Prüfung.**
- **Z. 26**: «Umgesetzt (#91, #363): Dwello führt die vereinbarten Kategorien pro Mietvertrag, rechnet nicht vereinbarte nicht ab und nennt im PDF die vereinbarten, die es abrechnet. Ab einem Datum vereinbarte Nebenkosten: #368.» Das stimmt. Kürzer als mein Vorschlag, aber ausreichend.
- **Z. 135**: «vereinbarte Nebenkosten pro Vertrag (#369)». Das stimmt.
- **Z. 101**: «Umgesetzt (#91, #363): Eine Kategorie ohne Angabe beim Mietvertrag fragt der Assistent vor der Vorschau je Mietvertrag nach; nicht vereinbarte Kategorien rechnet Dwello nicht ab und nennt die Mietverträge. …» Die Zeile behandelt den Mangel «Positionen abgerechnet, die nicht im Mietvertrag vereinbart sind». Genau das tut Dwello aber noch mit umlagefähigen Rechnungen ohne Kategorie (`calculation.service.ts:320`, `!group.categoryId ||`). «Umgesetzt» ohne Einschränkung behauptet zu viel, und eine künftige Fachreview liest das Dokument als Quelle 1. Ungenau ist auch «fragt … nach»: Der Assistent fragt nur, wenn die Kategorie in den Mietstagen dieses Mietvertrags Kosten hat (Summe nicht 0).
- **Regel 12 und Punkt 7 im PDF-Aufbau (Z. 119)** fehlen. Für die Verwaltungspauschale steht die analoge Regel als Regel 9. Für die vereinbarten Nebenkosten steht nirgends ausserhalb des Codes:
  - Unbeantwortet wird nicht abgerechnet.
  - Den Anteil trägt der Vermieter.
  - Die Abrechnung speichert die Liste beim Erstellen (`agreed_category_ids`).
  - Migration 0018 hat bestehende Verträge so belegt.
  - Die PDF-Zeile erscheint nur, wenn jede Position eine Kategorie hat.

**Behebung.**
- **Z. 101**: «Offen: Rechnungen ohne Kategorie rechnet Dwello ohne Prüfung der Vereinbarung ab (#382).» anhängen und «fragt der Assistent … nach» ersetzen durch «hat eine Kategorie ohne Angabe beim Mietvertrag Kosten in seinen Mietstagen, fragt der Assistent vor der Vorschau nach».
- **Z. 119, Punkt 7**: nach «**Hinweise**: » einfügen: «die vereinbarten Nebenkosten, die die Abrechnung abrechnet (#91; nur wenn jede Position eine Kategorie hat),».
- **Regel 12**, kürzer als in Runde 2: «12. **Vereinbarte Nebenkosten.** Der Mieter bezahlt nur die Kategorien, die sein Mietvertrag vereinbart (#91; Art. 257a Abs. 2 OR). Pro umlagefähiger Kategorie gilt eine von drei Angaben: vereinbart, nicht vereinbart oder noch nicht angegeben. Ein neuer Mietvertrag beginnt mit allen angekreuzt. Beim Bearbeiten bleibt eine noch nicht angegebene Kategorie offen, solange sie nicht angekreuzt wird. Hat eine offene Kategorie Kosten in den Mietstagen des Mietvertrags (Summe nicht 0), fragt der Assistent vor der Vorschau. Abgerechnet werden nur vereinbarte Kategorien. Den Anteil an den übrigen trägt der Vermieter, wie beim Leerstand (Regel 4), und die Verwaltungspauschale rechnet mit den eigenen Nebenkosten danach (Regel 9). Jede Abrechnung hält ihre Liste beim Erstellen fest. Offen: Vereinbarung ab einem Datum (#368), Begriff (#369), Rechnungen ohne Kategorie (#382).»

Optional, Nit: Unsicherheiten Punkt 1 («Kein Normtext auf Fedlex geprüft») gilt für Art. 257a, 257b und 269d OR sowie Art. 4, 5 Abs. 2 und 7 Abs. 1 VMWG nicht mehr (siehe `docs/reviews/w10c-fachreview-1.md`).

### V-13 (Nit): Hinweis «Keine Nebenkosten vereinbart» ohne Akonto

**Beleg.** `AgreedCategories.svelte:46–56` und `de.json` `contracts_agreed_costs_none_text`. Derselbe Schritt (`RentStep.svelte`) erfasst `monthlyAdvancePayment`.

**Warum.** In der Praxis bedeutet «keine Nebenkosten vereinbart» bei einem Akonto über 0 fast immer einen Erfassungsfehler. Ohne vereinbarte Nebenkosten fehlt auch der Rechtsgrund für Akontobeiträge (Art. 257a Abs. 2 OR), und jede Abrechnung erstattet das ganze Akonto zurück. Der Hinweis würde den Fehler früher zeigen, wenn er das sagt.

**Behebung (optional).** Ein Satz am Ende, nur bei einem Akonto über 0: «Akontobeiträge für Nebenkosten zahlt der Mieter dann nicht; die Abrechnung erstattet sie ganz zurück.» Das ist neuer Text, also braucht es ihn in allen vier Sprachen und einen Test vorher. Sonst so lassen.

### V-14 (Nit): Wortlaut fr/it/en

**Beleg.** `fr.json`: «Sans coche, Dwello ne décompte …», `it.json`: «Senza selezione, Dwello non conteggia …», `en.json`: «Without a tick, Dwello bills …». Verständlich, aber nicht idiomatisch.

**Behebung.** fr: «Si aucune case n’est cochée, Dwello ne décompte aucuns frais accessoires à ce locataire.» it: «Se non seleziona alcuna categoria, Dwello non conteggia spese accessorie a questo inquilino.» en: «With no box ticked, Dwello bills this tenant no utility costs.» Der zweite Satz bleibt jeweils gleich.

## Fehlende Begriffe

Keine neuen. «Vereinbarte Nebenkosten» und «Nicht vereinbart» bleiben in #369.

## Nicht bestätigt

- **#382 und #368**: Den Inhalt der Issues und des Kommentars habe ich nicht gelesen. Ich stütze mich auf die Angaben des Aufrufers.
- **Tests**: Den pg-Test und die Unit- und DOM-Tests habe ich gelesen, aber nicht ausgeführt. Backend-Tests und E2E waren nicht erlaubt.
- **PDF in fr/it/en**: Nicht neu gerendert. Die Bedingung in `toPdfData` hängt nicht von der Sprache ab.
- **Darstellung des Hinweises** bei 390 px und im Dunkelmodus, `screens.json` und `sprachen-bildschirme.feature`: nicht geprüft, das ist Sache von `code-reviewer` und den Personas.
- **Einvernehmliche Einführung neuer Nebenkosten ohne Formular** (M-3 aus Runde 2): weiter **unsicher**, keine Rechtsprechung geprüft.
