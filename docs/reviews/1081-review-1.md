# Code-Review #1081, Runde 1 (efe446f78)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/lib/ui/ToastRegion.svelte:42-51, src/lib/ui/Dialog.svelte:128, 69 | Ein Dialog, der geöffnet wird, während eine Erfolgsmeldung steht, wird auf dem Telefon weiterhin von ihr verdeckt, und mit ihm das fokussierte «Abbrechen». `scroll-padding-bottom` auf `<html>` und der Abstandhalter bewegen ein festes Panel nicht, und der Effekt läuft nur, wenn sich die Meldungen ändern, nicht beim Wechsel des Fokus. |
| C-2 | Minor | src/lib/ui/ToastRegion.svelte:44-46, 68 | Kein Test zeigt, dass `scroll-padding-bottom` und der Abstandhalter wieder auf 0 gehen, wenn die letzte Erfolgsmeldung verschwindet, oder dass eine Fehlermeldung allein keinen Platz freihält. Die Zweige `''` bzw. `room = 0` kann man brechen, ohne dass ein Test rot wird (DOM-Test: `addToast('success')` → Stil gesetzt, `dismissToast` → `''`; `addToast('error')` allein → `''`). |

## C-1 (Major): Ein Dialog, der während einer Erfolgsmeldung offen ist, wird verdeckt

Die Anforderung lautet: «at every width it never covers the focused content». `Dialog.svelte:128` legt das Panel unter `sm` an den unteren Rand (`fixed inset-0 … items-end p-4`). `Dialog.svelte:69` setzt den Fokus auf `dialog-cancel`. Wegen `flex-col-reverse` (Zeile 140) ist das auf dem Telefon der unterste Button. Er endet also etwa 40 px über dem unteren Rand. Die Meldungen stehen in `fixed bottom-4 z-50`, kommen später im DOM und decken damit die Zone von 16 px bis etwa 100 px über dem Rand ab. Das ist genau «Abbrechen». `makeInert` nimmt `[data-toast-region]` ausdrücklich aus (Zeile 58), die Meldung bleibt also oben liegen. Das neue `scroll-padding-bottom` wirkt nur auf das Scrollen des Dokuments. Das Panel hat `max-h-full overflow-y-auto` und scrollt bei kurzem Inhalt gar nicht. Ausserdem läuft der Effekt in Zeile 42 nur, wenn `confirmations` oder `region` sich ändern, nicht beim Öffnen des Dialogs.

Der Ablauf ist realistisch, denn eine Meldung steht 8 s (`src/lib/stores.ts:38`). Genau so sieht der Fall «gelöscht» aus #658 aus: Der Liegenschaftsverwalter löscht eine Kategorie (Meldung «… gelöscht») und öffnet sofort den Löschdialog der nächsten.

**So zeigt man den Fehler:** Ein Szenario bei 390 × 844 löscht einen Eintrag über `DeleteDialog` und öffnet innerhalb von 8 s den Löschdialog eines zweiten. Danach prüft es `roomAboveConfirmation` (≥ 8). Erwartet wird ein negativer Wert. Diesen Ablauf deckt das neue Szenario nicht ab, weil es nur das Kopieren ohne Dialog prüft.

Der Mangel war auf dem Basis-Commit schon da. Er ist aber genau die Klasse, die #1081 beheben soll. Eine mögliche Lösung: Der Platz wird als CSS-Variable auf `<html>` gesetzt, z. B. `--toast-room`, und das Dialog-Overlay nutzt sie als Innenabstand unten.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (44 bestanden). Das Outline war vor der Änderung bei allen drei Grössen rot (−96 px) und danach grün.
- Die volle Chromium-E2E-Suite: Das Ergebnis lag beim Review noch nicht vor. Firefox und WebKit (Projekte in `playwright.config.ts:279, 286`, laufen auf `main` in CI) hat laut Aufrufer niemand ausgeführt. Ob ein Klick in Playwright-WebKit den Button fokussiert, habe ich nicht geprüft. Ohne `:focus` gibt `Gap` `null` zurück (`tests/e2e/screenplay/questions.ts:192-198`), und der Schritt schlägt fehl.
- Fokus, der später wechselt (Tab), während die Meldung steht: Der Effekt läuft dann nicht. Es hängt allein davon ab, ob der Browser beim Fokussieren mit der Tastatur `scroll-padding-bottom` berücksichtigt. Kein Szenario prüft das. Ich habe nur den Code gelesen.
- Die Fälle aus #658 (Vertragsbeginn nach dem Speichern bei 150 %, Filter nach «gelöscht» bei 200 %) prüft kein Szenario. Wenn der Fokus dort erst nach dem 500-ms-Timer gesetzt wird (`ToastRegion.svelte:23-32`), scrollt der Effekt nicht. Die Seiten selbst habe ich nicht gelesen.
- Bei 1024 px: Ob der Kopier-Button waagrecht überhaupt unter der Meldung liegt (die Meldung steht rechts, `sm:w-96`), habe ich nicht gemessen. Die Prüfung misst nur senkrecht. Sie ist damit strenger als nötig, aber nicht falsch.

Geprüft: dass Fehlermeldungen ausserhalb der Anforderung bleiben; Screenplay-Schichten (die Schritte rufen nur Tasks und Questions auf); die Question antwortet mit dem Wert in px; keine neuen Texte, Bildschirme oder Verträge; Tokens und `style:height` (Muster wie in `ProgressBar.svelte`); der Abstandhalter, der beim offenen Dialog inert wird, ist harmlos; ponytail-review ohne Befund.
