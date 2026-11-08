# Code-Review Slice 1262-close, Runde 1 (b75c3c8)

Bereich: `git diff f0b08ed b75c3c8`, ein Commit. Vorheriger Bericht: docs/reviews/1262-review-1.md.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2

Geprüft: `focusSend()` (TenantDocumentUpload.svelte:87) läuft nach der Grössenprüfung und vor `uploading = true`. Der Knopf bleibt im Zustand busy fokussierbar, weil Button.svelte `aria-disabled` setzt und nicht `disabled` (Z. 114–116). Der Fokus geht also nicht mit dem gesperrten Feld verloren. Beim Abbruch wegen zu grosser Datei bleibt `focusFirstError` unverändert. `notAnswered` nutzt denselben Helfer, das Verhalten bleibt gleich. Der neue DOM-Test (tenant-detail-page.dom.test.ts:253–269) wird ohne `focusSend()` rot (der Fokus bleibt auf dem Titel), ohne `disabled={uploading}` rot (die Felder sind offen) und ohne `uploading = false` rot (die Felder bleiben nach `error` gesperrt). Er nutzt das bestehende `enhance`-Double der Datei. Der Commit enthält keine neuen Texte und nichts, was nicht zur Anforderung gehört (der mitgelieferte Bericht docs/reviews/1262-review-1.md gehört zum Ablauf).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: der neue DOM-Test zweimal rot (die Fokusprüfung vor dem Fix, die Sperrprüfung ohne `disabled={uploading}`), vitest tenant-detail-page.dom.test.ts mit 44 bestandenen Tests, lint sauber, Prettier auf den eigenen Zeilen sauber.
- Den Merge e51a272 mit origin/main und die Persona-Berichte danach habe ich nicht geprüft: Sie liegen ausserhalb des genannten Bereichs. Laut Aufrufer war der Merge ohne Konflikte.
- Aus dem Vorbericht noch offen: die Axe- und Sprachzeilen für den gesperrten FileInput in «Rechnungen hochladen» (src/routes/invoices/UploadFiles.svelte:40). Dieser Commit ändert daran nichts.
