# Code-Review 653, Runde 4 (Delta d2a9396..0a7ca20)

Geschlossen: C-6, C-7

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-8 | Minor | src/routes/statements/[id]/FormDialog.svelte:33 | Der Kommentar zur Prop `success` sagt weiter «the focus then goes to the new status, before $lib/focus-after-action.ts would». Seit 0a7ca20 geht der Fokus nur dann auf die Statuszeile, wenn er nach der Aktion auf `body` liegt. Bleibt der Knopf, behält er den Fokus. Der Kommentar stimmt nur noch für diesen einen Fall (Zeilen 57-60 sagen es richtig). |

## Nicht bestätigt

- E2E `statement-detail.feature`, `invoice-detail.feature`, `contract-detail.feature`, `statements.feature` auf 0a7ca20: läuft noch (vom Aufrufer gemeldet). Insbesondere das Szenario von main «Nach dem Neuberechnen bleibt der Liegenschaftsverwalter, wo er war» (statement-detail.feature:1002-1009). Ich habe nur aus dem Code geschlossen, dass es wieder hält: «Neu berechnen» bleibt im DOM (MoreActions.svelte:45-50, der `{#if}` hängt an `editable`/`correctable`, beide ändern sich beim Entwurf nicht). Dialog.svelte:69 gibt den Fokus an diesen Knopf zurück. Danach greift FormDialog.svelte:59 nicht mehr, und `refocus()` (focus-after-action.ts:44) tut nichts.
- Vom Aufrufer gemeldet: `bunx vitest run src/__tests__/statement-pages.dom.test.ts` auf 0a7ca20 mit 237 bestanden; `bun run lint` und `bun run check` auf d2a9396 grün, auf 0a7ca20 nicht gelaufen.
- Dass der neue Test auf d2a9396 rot war, meldet der Aufrufer. Aus dem Code folgt dasselbe: Ohne die Bedingung setzt FormDialog.svelte:60 den Fokus fest auf `#statement-status-line`. Gelesen habe ich statement-pages.dom.test.ts:1006-1019.

Geprüft: Der Delta-Fix in FormDialog.svelte:56-60 und der Test statement-pages.dom.test.ts:1006-1019. Der Test öffnet den echten Dialog, schliesst ihn über die Action und prüft `document.activeElement`. Der Test für das Ersetzen (Statuszeile, Zeilen 993-1004) bleibt, also gilt #653 weiter für Aktionen, deren Knopf verschwindet. `refocus()` läuft erst 500 ms nach der Meldung (ToastRegion.svelte:24-27) und kommt der Bedingung nicht in die Quere. Erneutes Zustellen behält seinen Knopf, denn `redeliverable` bleibt bei `sent` (statement.service.ts:371). Im Delta gibt es keine unbeteiligten Änderungen.
