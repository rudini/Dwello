# Code-Review #1096, Slice 1 (8d432f131..2abe629db), Runde 1

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/ui/ToastRegion.svelte:45-58, 65 | Bekommt der Schliessen-Knopf der Erfolgsmeldung selbst den Fokus (Tab, laut #669/U-21 der letzte Tab-Halt), zählt `place()` ihn als «fokussierter Teil, wo die Meldung steht». Der Knopf liegt immer im eigenen Rechteck, also wird `atTop` umgeschaltet. Die Meldung springt mit dem fokussierten Knopf an den oberen Rand, und steht sie schon oben, springt sie zurück nach unten. Es fehlt eine Ausnahme `region.contains(focused)`. Kein Test deckt diesen Fall ab. |
| C-2 | Minor | src/lib/ui/ToastRegion.svelte:65 | Die Neuberechnung bei `focusin` ist ungetestet. In beiden Szenarien wird der Fokus gesetzt, bevor die Meldung nach 500 ms erscheint: Kopieren, und Löschdialog direkt nach dem Löschen. Die Neuberechnung über `confirmations` reicht dort schon. Löscht man die Zeile mit `onfocusin`, bleibt vermutlich jeder Test grün. Ein Fokuswechsel, während die Meldung steht (z. B. ein Dialog, der später als 500 ms nach dem Löschen geöffnet wird, auf dem Telefon), bleibt ungeprüft. Ungeprüft bleibt auch die `untrack`-Korrektur, die der Aufrufer beschreibt. |
| C-3 | Minor | tests/e2e/screenplay/interactions.ts:108 | Der Kommentar verweist auf `ThePage.movedSinceWatching`. Die Question heisst aber `ThePage.movedUntilGone` (screenplay/questions.ts). |

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, svelte-check, `vitest --changed origin/main` (1029 bestanden), e2e-screenplay-lint, design-guard; Chromium-E2E: das neue Outline (3 Zeilen, auf der Basis rot mit 112 px), «Die Erfolgsmeldung verdeckt nicht, was den Fokus hat» (3) und «… einen danach geöffneten Dialog nicht» (1), je zweimal.
- Ob das neue Outline auf der Basis in allen drei Zeilen rot war, nicht nur in einer: Gelesen habe ich nur, dass die Basis per `scrollIntoView` und Abstandhalter scrollt. Für jede Zeile ist das plausibel, gesehen habe ich es nicht.
- Ob andere Szenarien, die zweimal kurz nacheinander löschen, jetzt am Klick scheitern, weil eine Meldung unten den Knopf verdeckt. `deleteCategory` (tasks/categories.ts:61) bringt die Zeile im Gegensatz zu `startDeletingCategory` nicht in die Mitte. Gesucht habe ich nur in categories.feature, ausgeführt habe ich nichts.

Geprüft: Diff aller Dateien gegen #1096 «Decided» (kein Scrollen, kein Abstandhalter, kein `--toast-room` mehr, Platzierung oben bei fokussiertem Teil unten, Verdecken von Inhalt ohne Fokus erlaubt). Die gelockerte Prüfung in «verdeckt … nicht» (Abstand auf einer der vier Seiten ≥ 8) ist durch `Spec change approved: #1096` gedeckt. Questions antworten mit Zahlen oder null, Schritte rufen nur Questions und Tasks auf. Keine neuen Texte, Bildschirme oder Verträge, nichts Fremdes im Diff. ponytail-review ohne Befund.
