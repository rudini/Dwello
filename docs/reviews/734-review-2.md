# Code-Review #734, Runde 2 (Abschlussrunde, `git diff f3e30b3d1 3b5faf4f9`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/documents/refused/+page.server.ts:12,23 | Der Open Redirect ist weiterhin offen. Der Ursprung von `new URL(back, url)` stimmt, der Pfad kann aber mit `//` beginnen. `back=/.//evil.example` ergibt `pathname` `//evil.example`. Die Seite schreibt diesen Wert in `href`, und der Browser macht daraus `http://evil.example/`. |
| C-5 | Minor | src/routes/documents/refused/+page.server.ts:12 | `new URL` wirft bei einer ungültigen absoluten Adresse (`back=http%3A%2F%2F%5B` ergibt `http://[`). Ein manipulierter Link zeigt dann statt der Ablehnungsseite einen Fehler 500. Kein Test deckt das ab. |

Geschlossen: C-2, C-3, C-4

## C-1 (Major): Rückweg über `//` im aufgelösten Pfad

Der Fix vergleicht den Ursprung der aufgelösten Adresse und gibt dann `pathname + search` zurück. Die WHATWG-URL-Auflösung entfernt die Segmente `.` und `..`, ein leeres Segment behält sie aber. Darum entsteht aus einer Adresse mit gleichem Ursprung ein Pfad, der mit `//` beginnt. Den gibt `load` zurück. `+page.svelte:29` setzt ihn als `href`, und der Browser liest ihn als protokollrelative Adresse auf einen anderen Host.

So lässt es sich zeigen (in Node geprüft, gleiche URL-Implementierung wie im Browser):

```
new URL('/.//evil.example', 'http://dwello.test/documents/refused')
  -> origin http://dwello.test (gleich), pathname '//evil.example'
new URL('//evil.example', 'http://dwello.test/') -> http://evil.example/
```

`/x/..//evil.example` wirkt genauso. Der Link `/documents/refused?back=%2F.%2F%2Fevil.example` führt mit «Zurück» nach evil.example. Die Liste in `pdf-refusal.test.ts:62-68` enthält diesen Fall nicht. Deshalb bleibt der neue Test grün.

Fix: Zusätzlich einen Pfad ablehnen, der mit `//` beginnt (`!back.pathname.startsWith('//')`). Den Fall `%2F.%2F%2Fevil.example` in die Liste des Tests aufnehmen.

## Nicht bestätigt

- Vom Aufrufer gemeldet:
  - Auf 3b5faf4f9: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (17 Dateien, 678 Tests), design-guard- und screens-Tests (479), E2E chromium der axe- und Sprachzeilen der 4 Ablehnungsbildschirme (8)
  - Auf f3e30b3d1: vollständiges vitest (4060), E2E von statements, statement-detail, statement-generate und contract-detail (319)
  - Rot-Lauf des C-1-Tests
- Ob die Zeile `documents-refused-settings` in fr/it/en wirklich ohne Deutsch durchläuft: nur vom Aufrufer gemeldet. Gelesen habe ich nur, dass der Pfad mit `code=IBAN_MISSING` die Variante mit zwei Schaltflächen erreicht (`+page.server.ts:5,25`, `+page.svelte:22-26`).
- PR-Text mit `Spec change approved: #734` / `Fixes #734`: existiert noch nicht (Plan).

Geprüft: C-2 (Bildschirm in screens.json und in beiden Features, Zustand `default`), C-3 (Titel und Satz für `view` werden wörtlich gepinnt; die Tests halten Verhalten aus f3e30b3d1 fest, ein Rot-Lauf ist nicht nötig), C-4 (D7c, D7b als ersetzt markiert, token-referenz ohne `pdfRefusal`). Persona-Berichte, Plan und Bericht 1 sind nur Workflow-Dokumente. Nichts im Delta gehört nicht zur Anforderung.
