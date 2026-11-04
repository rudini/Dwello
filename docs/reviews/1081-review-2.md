# Code-Review #1081, Runde 2 (Abschlussrunde, 09d02a063, Delta efe446f78..09d02a063)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | src/lib/ui/ToastRegion.svelte:44-48, 70 | Bleibt offen, wie in Runde 1. Kein Test zeigt, dass der Platz zurückgeht, wenn die letzte Erfolgsmeldung verschwindet, oder dass eine Fehlermeldung allein keinen Platz freihält. Neu gehört auch `--toast-room` → `0px` dazu: Kein Test prüft, dass ein Dialog nach dem Verschwinden der Meldung wieder bei `1rem` sitzt. |

Geschlossen: C-1.

Neue Befunde im Delta: keine. C-1 ist durch Code und Szenario belegt:
- `Dialog.svelte:130` liest `--toast-room` über eine CSS-Variable. Damit spielt keine Rolle, ob die Meldung (sie erscheint 500 ms nach dem Löschen) vor oder nach dem Dialog kommt.
- Das neue Szenario (`categories.feature:208-215`) wird rot, sobald eine der beiden Zeilen fehlt. Ohne `setProperty` greift der Rückfallwert `0px`, also `max(1rem, 0px)`. Ohne `style:padding-bottom` gilt `p-4`. In beiden Fällen liegt «Abbrechen» unter der Meldung.
- Auch ab `sm` ist es richtig, den Dialog nach oben zu schieben: Ein Dialog mit `max-w-lg` überlappt bei 1024 px waagrecht mit der Meldung rechts (`sm:w-96`).
- `startDeletingCategory` ist ein einzelner Klick, dessen Ergebnis (der offene Dialog) synchron erscheint. Die Question fragt so lange nach, bis sie eine Antwort hat. Den vorherigen Klick auf «Löschen bestätigen» wartet Playwright ab, weil der Löschknopf erst klickbar ist, wenn das Overlay weg ist.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (1028 bestanden), Chromium-E2E für categories, zugangsschluessel, tenant-documents und statement-detail (181 bestanden). Das neue Szenario soll vor dem Fix mit −80 px rot gewesen sein. Das habe ich nur beim Lesen nachvollzogen, nicht selbst laufen lassen.
- Firefox und WebKit: Wie in Runde 1 hat sie niemand ausgeführt. Ob dort ein Klick den Button fokussiert (`Gap` braucht `:focus`), habe ich nicht geprüft.
- Die übrigen Punkte aus Runde 1 bleiben ungeprüft. Das sind ein Fokuswechsel per Tab, während die Meldung steht, und die Fälle aus #658 bei 150 % und 200 %. Das Delta berührt sie nicht.

Geprüft: alle Code-Dateien im Delta (Dialog.svelte, ToastRegion.svelte, categories.feature, categories.steps.ts, tasks/categories.ts); Screenplay-Schichten (der Schritt ruft nur einen Task auf); das Feature beschreibt das Fachliche, nicht die Bedienung; keine neuen Texte, Bildschirme oder Verträge; keine fremden Änderungen; ponytail-review ohne Befund.
