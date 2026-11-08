# Code-Review 743, Runde 2 (Delta a3f66fb..41fa74a)

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Major | src/lib/ui/DateInput.svelte:105–108, src/routes/invoices/InvoiceUploadDialog.svelte:224–236 | Die Frist von 300 ms beginnt, sobald die Seite den Fehler setzt. Im Hochladen-Dialog setzt `create()` die Fehler aber vor den Anfragen für die vollständigen Dateien, und erst nach allen Anfragen setzt `focusFirstError` den Fokus. Dauern sie zusammen länger als 300 ms, kommt die doppelte Ansage aus #743 (Sven P-1) wieder: zuerst sagt die Live-Region den Fehler, dann liest das Feld ihn noch einmal beim Fokus. |
| C-5 | Major | src/lib/ui/DateInput.svelte:100–108, src/__tests__/date-input.dom.test.ts:328 | Die neue Regel weicht vom Entscheid zu #743 vom 7.11. ab: «says a page error only when the field kept the focus (Enter in the field)». Jetzt sagt das Feld einen Fehler der Seite immer dann, wenn der Fokus nicht hineinkommt. Das gilt auch, wenn der Fokus gar nie im Feld war oder in einem anderen Feld mit Fehler landet. Für diese Abweichung gibt es keinen neuen Entscheid. |
| C-6 | Major | src/routes/invoices/InvoiceUploadDialog.svelte:220–223 | Den Fehler P-1 von Sven sieht jeder Benutzer: Ein Datum wird eingetippt und wieder gelöscht, danach zeigt «Erstellen» nichts mehr an. Für die Behebung gibt es kein Szenario in `tests/e2e/features` und auch kein `No scenario: <Grund>`. Auf main verhält sich `create()` gleich (die Fehler werden neu gesetzt, ohne sie vorher zu leeren), der Fehler besteht dort also auch. Die E2E-Umgebung kann den Ablauf erzeugen. |

## C-4 (Major): Doppelte Ansage im Hochladen-Dialog, wenn vorher Dateien erstellt werden

Der Ablauf mit zwei Dateien: Datei A ist vollständig. Bei Datei B ist das Rechnungsdatum leer, zum Beispiel weil Dwello die Datei nicht lesen konnte.

1. `create()` setzt `errors` für beide Dateien (Zeile 224). Die Zeile von B öffnet sich (`InvoiceUploadRow.svelte:55`), und ihr DateInput wird mit `error` gezeigt. Der Effekt in DateInput.svelte:105 setzt `landed = false` und startet die Frist von 300 ms.
2. Die Schleife wartet auf `createOne(A)`, also auf `POST /invoices` mit der PDF (Zeile 226–229). Mit einer echten Datei oder mehreren vollständigen Dateien nacheinander dauert das leicht länger als 300 ms.
3. Die Frist läuft ab, ohne dass das Feld den Fokus bekommen hat. Die Live-Region (`aria-live="assertive"`) sagt «Bitte geben Sie ein Datum ein.».
4. Danach ruft Zeile 236 `focusFirstError` auf, und der Fokus springt ins Datum von B. Der Screenreader liest die Beschreibung des Feldes vor, und sie enthält denselben Fehler.

Die neue Regel hängt also davon ab, wie schnell das Backend antwortet. Der DOM-Test in date-input.dom.test.ts ruft `focusFirstError` sofort nach dem Fehler auf. Er bildet diesen Ablauf deshalb nicht ab. Sven hat mehrere Dateien nicht geprüft (sven-743.md, «Nicht geprüft»).

So zeigt man es: einen DOM-Test in invoice-upload-dialog.dom.test.ts schreiben. Zwei Dateien hochladen, die erste wird gelesen (`[200, read]`), die zweite nicht (`[502, unreadable]`). Die Antwort auf `POST /invoices` um 400 ms verzögern und «Erstellen» klicken. Vor dem Fokuswechsel ist die Live-Region im Datum der zweiten Datei `'Bitte geben Sie ein Datum ein.'`, danach ist `document.activeElement` dieses Feld.

Abhilfe zum Beispiel: Die Fehler werden erst nach der Schleife gesetzt, oder die Frist beginnt nicht mit `error`, sondern mit dem Fokuswechsel der Seite.

## C-5 (Major): Die Regel für die Ansage weicht vom Entscheid ab

Der Entscheid in #743 vom 2026-11-07 lautet: «the date field's live region says a page error only when the field kept the focus (Enter in the field); where the focus jumps into the field, its description says the error once.» In den Kommentaren von #743 gibt es keinen späteren Entscheid.

So verhält sich der Code jetzt (der Test in date-input.dom.test.ts:328 hält die erste Abweichung fest):
- Die Seite wird mit einem Knopf gesendet und der Fokus bleibt auf dem Knopf (FuelStocks, Abrechnung bearbeiten, Schritt «Periode» beim Erstellen einer Abrechnung): Die Live-Region sagt den Fehler. Der Entscheid sieht hier keine Ansage vor, denn das Feld hatte den Fokus nicht.
- Der Fokus landet in einem anderen Feld mit Fehler, zum Beispiel im Hochladen-Dialog mit zwei nicht gelesenen Dateien: Der Fokus springt ins Datum der ersten Datei. Nach 300 ms sagt die Live-Region des zweiten Datumsfeldes ihren Fehler assertiv und unterbricht damit die Ansage des Feldes, in dem der Fokus steht. So sagt Dwello zwei Fehler gleichzeitig. Das ist auf main auch so, im Code von Runde 1 aber nicht.

Die Begründung des Aufrufers ist nachvollziehbar: Formulare, die den Fokus nicht bewegen, sollen ihre Ansage behalten. Die Zeile «Done means» deckt das auch («only where the focus does not land»). Der spätere und genauere Entscheid sagt aber etwas anderes, und eine Abweichung davon entscheidet der Product Owner (CLAUDE.md, «When to ask»). Bericht 743-1 hat für C-1 genau dazu auf einen Entscheid verwiesen. Das gehört unter «Blocked on me». Eine andere Möglichkeit ist, die Ansage auf den Entscheid zurückzunehmen und die Formulare ohne Fokuswechsel als eigenen Punkt in ein Issue zu schreiben.

## C-6 (Major): Kein Szenario für Sven P-1

`create()` leert die Fehler vor der neuen Prüfung erst seit diesem Delta. Auf main und auf a3f66fb setzt die Funktion die Fehler direkt neu (`git show a3f66fb:src/routes/invoices/InvoiceUploadDialog.svelte`, Zeile 219–220). Ein Fehler, den der Liegenschaftsverwalter durch Tippen und Löschen versteckt hat, bleibt dort auch beim nächsten «Erstellen» versteckt. Auch wer sieht, merkt dann nur, dass nichts passiert. Damit ist das eine sichtbare Fehlerbehebung (CLAUDE.md, Workflow 1). Der DOM-Test (invoice-upload-dialog.dom.test.ts:333) prüft das Verhalten auf der unteren Schicht. Ein Szenario ohne `@wip` in `invoices.feature` fehlt aber, zum Beispiel: Datum eingeben und wieder leeren, erstellen, dann nennt das Rechnungsdatum «Bitte geben Sie ein Datum ein.». Es fehlt auch ein `No scenario:` mit Grund. Der Ablauf braucht nur Eingaben und Klicks, die E2E-Umgebung kann ihn also erzeugen. Weil der DOM-Test rot gesehen wurde, braucht das Szenario keinen eigenen Rot-Lauf.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (42 Dateien, 1846 Tests), `testcheck:audit`; jeder neue Test vor seiner Behebung rot. E2E für invoice-new, invoice-edit, invoices und contract-new (125 bestanden) lief laut Aufrufer auf dem Code für C-1, also vor den Behebungen von P-1 und P-2. Ein Lauf auf 41fa74a steht noch aus.
- Rot-Läufe nur durch Lesen beurteilt: Auf a3f66fb würden der Enter-Test (C-1), «Fokus kommt nicht ins Feld», der C-2-Test, der Test für P-1 im Upload und der Tab-Test für `summary` scheitern. Der erste Test der Gruppe besteht auch auf a3f66fb. Er wurde nur auf den echten `focusFirstError` umgestellt.
- Ob ein Screenreader die assertive Ansage beim neuen Fokus verwirft (das würde C-4 und C-5 abschwächen): nicht prüfbar. Sven hat nur den Accessibility-Baum ausgewertet.
- P-2: `summary` steht ohne Filter in der Fokusfalle, also auch das `summary` eines verschachtelten `details` in einem geschlossenen `details`. Im Diff kommt das nirgends vor, ich habe es nicht weiter verfolgt.
- Ob `bun run fitness`, `cd backend && bun run type-check` und Prettier auf diesem Commit laufen: nicht gemeldet.

Geprüft: Das Leeren der Fehler im Upload passt zu `Field.svelte:50–52`, der Fehler zeigt sich danach wieder. Die Fokusfalle des Dialogs erreicht das `summary` in beide Richtungen. Der eigene Fehler des Feldes hat wieder Vorrang vor dem Fehler der Seite. Die Nachricht von 41fa74a nennt den Enter-Test als Pin. Der Delta ändert keine Texte und keine Szenarien.
