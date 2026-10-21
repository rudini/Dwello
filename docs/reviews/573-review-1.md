# Code-Review #573, Runde 1 (1475527..719b509)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

## Gezielte Prüfungen des Aufrufers

- **Andere Fehler in `errors.distributionKeyId`:** keiner. Auf allen drei Nutzern von `InvoiceCategoryFields` (`new/+page.svelte:183`, `[id]/edit/+page.svelte:180`, `UploadRowFields.svelte:112`) kommt `keyError` aus `errors.distributionKeyId`. Dieses Feld setzt nur `validateInvoice` (`src/lib/invoice.ts:58`, `invoices_error_key_required`, nur wenn kein Schlüssel gesetzt ist), im Upload auch über `checkRow` (`src/lib/invoice-upload.ts:300`), das denselben Wert übernimmt. Backend-Ablehnungen landen nie dort: Beim Bearbeiten gehen sie in `saveError` (`edit/+page.svelte:104-109`), bei «Neue Rechnung» in einen Toast (`new/+page.svelte:115-118`), beim Upload in `row.createError`. Ein Fehler wird also nicht ausgeblendet, solange ein Schlüssel gesetzt ist. Leert der Liegenschaftsverwalter den Schlüssel danach wieder, erscheint der Fehler erneut. Das entspricht «nur solange kein Schlüssel gesetzt ist».
- **Szenario gegen `tests/e2e/CLAUDE.md`:** Die Negativprüfung «… nicht mehr» (`common.steps.ts:37`, `Visibility.of(formError)`) hat einen positiven Anker im Schritt davor («ist im Rechnungsformular der Verteilschlüssel "Pro Zimmer" gewählt», `chosenKey`, liefert den Wert). Beide Werte gehen aus demselben reaktiven Zustand hervor, die Negativprüfung kann also nicht vor dem Rendern zu früh grün werden. Davor ist mit «sieht … die Fehlermeldung» belegt, dass der Fehler wirklich angezeigt wurde. Die Schritte rufen nur Tasks und Questions auf. Das Feature beschreibt, was der Liegenschaftsverwalter will, nicht die Bedienung. Ohne die Änderung wäre das Szenario rot: Auf «Neue Rechnung» berechnet nur `save()` die `errors` neu (`new/+page.svelte:92`), der Fehler bliebe also stehen.

Geprüft: alle vier geänderten Dateien. Die Verschiebung der Bedingung ist für den Upload gleichwertig, weil `distributionKeyId` an `row.values.distributionKeyId` gebunden ist. Beide neuen DOM-Tests schlagen ohne die Änderung fehl (der Fehler bleibt bis zum nächsten Speichern). Kein neuer Text, kein neuer Bildschirm oder Zustand, kein API-Vertrag betroffen. Kein fremder Code im Diff. Für die Bearbeitungsseite ist «No scenario» begründet: Sie nutzt dieselbe Feldkomponente, und ihr DOM-Test deckt sie ab.

## Nicht bestätigt

- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/invoice-pages.dom.test.ts src/__tests__/invoice-upload-dialog.dom.test.ts`, 157 bestanden.
- Vom Aufrufer gemeldet: Rot-Lauf der zwei neuen DOM-Tests, `bunx vitest run --changed origin/main`, `bun run lint`, `bun run check`, E2E `invoice-new.feature` (15), `invoices.feature` + `invoice-edit.feature` (46).
- Nicht gelesen: der Commit-Text auf «No scenario» für die Bearbeitungsseite. Das ist Aufgabe des Pull Requests.
