# Code-Review #679, Runde 1 (94db4238c..6ea20b140)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/statements/[id]/+page.server.ts:124, src/routes/statements/[id]/+page.svelte:73 | Die gemerkte Listenadresse behält auch `page=`. Löscht der Verwalter den einzigen Entwurf auf der letzten Seite (z. B. `/statements?status=draft&page=2` mit 11 Entwürfen), führt die Weiterleitung auf eine leere Seite 2. Dort steht «Keine Abrechnungen gefunden, Filter anpassen» (`+page.svelte:170-178`), ohne Filter sogar «Noch keine Abrechnungen» (`filtered` in `+page.svelte:39-41` zählt `page` nicht mit), obwohl es auf Seite 1 noch Abrechnungen gibt. Vor der Änderung führte das Löschen immer auf `/statements`. Abhilfe: `page` aus der Adresse entfernen, bevor weitergeleitet wird; dazu ein Unit-Test in `statement-actions.test.ts`. |

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/hooks.server.test.ts src/__tests__/statement-actions.test.ts` (49 bestanden): vom Aufrufer gemeldet.
- Beide neuen Szenarien in `tests/e2e/features/statements.feature`, unter `@wip` an ihren Then-Schritten rot gesehen und nach der Änderung grün: vom Aufrufer gemeldet. Beim Lesen geprüft: Szenario 1 scheitert ohne die Änderung, weil die Liste nach dem Löschen ungefiltert ist (`filter-draft` hat kein `aria-current`). Szenario 2 hängt am Browser-Cache (bfcache) von Chromium. Dass es ohne `no-store` rot wird, lässt sich nur im Browser zeigen, nicht durch Lesen.
- Der vollständige E2E-Lauf (chromium + api) für den Header, der jetzt jede Seite betrifft, läuft noch: vom Aufrufer gemeldet, Ergebnis offen. Nachgesehen: Weder `src` noch eine Route setzt sonst `Cache-Control` (grep). `adapter-node` liefert `/_app/immutable` und `static/` aus, bevor `handle` läuft, also bleiben diese Dateien cachebar.
- Dass die neuen Unit-Tests rot waren (die Guard-Fälle durch Herausnehmen der Prüfung): vom Aufrufer gemeldet. Beim Lesen bestätigt für die gefilterte Weiterleitung, den Fall `/invoices?status=draft` und den Header-Test. `https://example.com/statements` und `//example.com` fängt schon `localPath` ab, sie werden also nur rot, wenn auch `localPath` herausgenommen wird.

Geprüft: alle geänderten Dateien. `FormDialog` übergibt `fields` per `dialogSubmit`. Die Weiterleitung schützt vor fremden Zielen (`localPath` und `/statements?`). Die Step-Definitionen sind wiederverwendet, keine bestehende ist gelockert worden. Die Screenplay-Schichten sind eingehalten (der Then-Schritt fragt nur Questions ab). Keine neuen Texte, Screens oder Backend-Ablehnungen. Beide Szenarien sind ohne `@wip`.
