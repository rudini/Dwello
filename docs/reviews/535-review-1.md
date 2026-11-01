# Code-Review #535, Slice 1, Runde 1

Worktree `/tmp/scratchpad/review-535-code-reviewer` @ eab2329, Bereich `e05be2a..eab2329`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/invoices/UploadResult.svelte:25 | Der neue Link «Rechnung erfassen» steht allein auf seiner Zeile, ist aber niedriger als 48 px (`class="underline"`). Die Design-Regel verlangt mindestens 48 px hohe Bedienelemente. Andere eigenständige Textlinks im selben Bereich erfüllen das mit `inline-flex min-h-12 items-center` (`src/routes/invoices/MissedWarning.svelte:24`, `src/routes/invoices/[id]/InvoiceFacts.svelte:56`). Axe meldet nichts, weil seine Regel für die Zielgrösse nur 24 px verlangt. |
| C-2 | Minor | tests/e2e/tasks/accessibility.ts:226-227 | Der Kommentar sagt «ticked once its amount is the allocable part», aber `createMixed` trägt keinen Betrag ein. Die Rechnung wird mit dem vollen Betrag aus der KI-Attrappe erstellt (1250, `backend/scripts/llm-stub.ts:140`). Damit zeigt der Bildschirmzustand genau den Ablauf, den der Fachreview in V-2 für das Szenario beanstandet hat. Abhilfe: zuerst `enterAmount` aufrufen oder den Kommentar korrigieren. |

Keine Blocker, keine Major.

Geprüft: alle 19 geänderten Dateien.
- Das Flag `rest` wird nur bei `mixedCosts` gesetzt, also bei `nonAllocableItems` und einer umlagefähigen Kategorie (V-8). Bei der Kategorie Reparaturen fehlt der Satz.
- Die Ergebnisliste zeigt `rest` in beiden Fällen an: im Dialog und auf der Listenseite (`+page.svelte:68` reicht `Created` durch).
- Der V-1-Text steht wörtlich in allen vier `messages/*.json`. Der Link verwendet `dashboard_add_invoice` («Rechnung erfassen») und zeigt auf `/invoices/new`.
- Das Szenario trägt den umlagefähigen Betrag ein (V-2). Laut `llm-stub.ts:125` erkennt die KI-Attrappe «Reparatur» im Dateinamen als gemischte Rechnung.
- Der DOM-Test prüft, dass der Satz nur bei der gemischten Rechnung steht und es genau einen Rest-Link gibt (V-4).
- Szenario und DOM-Test scheitern ohne die Änderung, weil der Text und `invoice-upload-record-rest` dann fehlen.
- `createdInvoiceLinks` erfasst mit der neuen testid weiterhin nur die Links der erstellten Rechnungen.
- `upload-mixed-rest` steht in `screens.json` (stateMeanings und Liste), in `accessibility.feature`, in `sprachen-bildschirme.feature` und im Seed von `fixtures/screens.ts`.
- Die Screenplay-Schichten sind eingehalten: Steps rufen nur Tasks und Questions auf. `enterAmount` folgt dem Muster von `chooseKey`.
- Die Szenario-Schritte enthalten keine UI-Wörter. Bestehende Szenarien bleiben unverändert.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet, ich habe sie nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (710 bestanden), die Tests, die geänderte Dateien als Text lesen (1074 bestanden), E2E chromium für das ganze `invoices.feature` (35 bestanden) sowie die Axe- und Sprachzeilen `upload-partial` und `upload-mixed-rest`. Ebenfalls vom Aufrufer gemeldet: die roten Läufe des Szenarios und des DOM-Tests.
- Ob in fr/it/en im Zustand `upload-mixed-rest` kein deutscher Text erscheint, habe ich nicht im Browser gesehen. Der Rechnungsname kommt aus dem Dateinamen («Elektro Blitz Reparatur …»), wie schon bei `upload-partial`.
