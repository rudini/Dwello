# Code-Review #690, Runde 3 (Abschluss), 49e4237..8b4baa6

Geschlossen: C-4.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Major | src/routes/config/+page.svelte:45-48, src/lib/statement/CreditorAddressWarning.svelte:17 | Der Weg von H-4 (Link «Zu den Einstellungen» → `/config#sender`, clientseitige Navigation) ist von keinem Test abgedeckt. Beim Lesen sieht es so aus, als würde SvelteKits Fokus-Reset auf das Fragment den Fokus auf «Firmenname» danach wieder wegnehmen. |

## C-5 (Major)

**Warum falsch:** Das Szenario öffnet `/config` per `Navigate.to('/config')`, also mit einem vollständigen Laden ohne Fragment (`tests/e2e/tasks/settings.ts:5`). Der DOM-Test montiert die Seite direkt. Den Weg aus H-4 geht keiner der beiden Tests: Klick auf den Link der Warnung auf der Abrechnung, dann clientseitige Navigation zu `/config#sender`.

Auf diesem Weg läuft SvelteKit 2.70.3 (`bun.lock`, Zeilen 2017-2028 und 3232-3263 in `src/runtime/client/client.js`) in dieser Reihenfolge:
1. `root.$set` montiert die Seite, und `onMount` ruft `focusFirstError` auf.
2. `focusFirstError` wartet auf `tick()` und plant dann einen Timeout A, der das Feld fokussiert.
3. SvelteKit wartet zweimal auf `tick()`. Danach ist `changed_focus` falsch, weil der angeklickte Link nicht mehr im DOM steht und der Fokus auf `body` liegt. Darum ruft SvelteKit `reset_focus(url)` auf. Weil `#sender` jetzt existiert, plant `reset_focus` einen Timeout B mit `location.replace('#sender')`.

A ist vor B eingeplant und läuft darum zuerst: «Firmenname» bekommt den Fokus. Danach navigiert B zum Fragment. Laut HTML-Spezifikation führt das Scrollen zum Fragment die Focusing Steps für `#sender` aus, mit dem Viewport als Rückfall. `#sender` ist ein nicht fokussierbares Panel, also fällt der Fokus vom Feld weg auf den Viewport bzw. `body`.

`focusFirstError` wurde für den umgekehrten Fall gebaut: Nach einer abgelehnten Speicherung ist SvelteKits Timeout schon eingeplant, wenn der Helfer seinen eigenen einplant (Kommentar in `src/lib/ui/focus-error.ts:9-11`). Beim Montieren innerhalb einer Navigation stimmt diese Annahme nicht mehr. Damit fehlt der Fokus genau auf dem Weg, für den H-4 ihn verlangt. Der Link führt nur noch zum Absender, statt auf das erste fehlende Feld.

Konflikt mit dem Root-Layout: keiner. `afterNavigate` in `src/routes/+layout.svelte:62-69` greift nur bei `isListNavigation`, und die verlangt denselben Pfad. Von der Abrechnung nach `/config` ist das nicht der Fall, und `/config` hat kein `[data-results]`.

**Wie zeigen:** Ein Szenario-Schritt nach «Und warnt die Abrechnung …» in der Nachzahlung mit Zahlteil ohne Firmenadresse, mit dem Ablauf: der Liegenschaftsverwalter folgt «Zu den Einstellungen», dann «steht der Fokus in den Einstellungen auf "Firmenname"». Die Aufgabe ist ein Klick auf `statement-creditor-missing-settings` und wartet auf die Einstellungen. Die Frage ist `FocusedLabel`. Ich erwarte, dass dieser Schritt mit `null` rot wird. Mögliche Abhilfe: Fokus erst nach SvelteKits Reset setzen, z. B. in `afterNavigate` der Seite plus einem Timeout. Alternativ den Link direkt auf das Feld zeigen lassen, statt auf `#sender`.

## Nicht bestätigt

- C-5 habe ich nur durch Lesen hergeleitet, nicht in einem Browser gesehen. Gelesen habe ich die SvelteKit-Quelle im Bun-Cache (`/root/.bun/install/cache/@sveltejs/kit@2.70.3@@@1/src/runtime/client/client.js`). Ob Chromium den Fokus bei `location.replace` auf ein nicht fokussierbares Fragment wirklich vom Eingabefeld nimmt und in welcher Reihenfolge A und B tatsächlich laufen, bleibt offen.
- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint, check, Backend-Type-Check, vitest (4350), fitness, fallow, E2E (20 passed).
- Dass der DOM-Test rot war, habe ich nur gelesen. «setzt beim Öffnen den Fokus …» schlägt ohne den `onMount` fehl, «hat den Absender als Sprungziel» ohne `id="sender"`. «… ohne fehlende Felder keinen Fokus» ist auch ohne die Änderung grün: Er hält das Verhalten nur fest. Die Commit-Nachricht nennt das nicht ausdrücklich.

Geprüft: C-4 (JSDoc wieder über `generateQRBillForStatement`). Kein Fokus beim Öffnen ohne fehlende Felder (nur `onMount`, nur bei `data.missing.length`). `Panel` nimmt `id` an. Der neue Szenario-Schritt steht in einem Szenario, das auf `origin/main` noch nicht existiert, braucht also keine Spec-Freigabe. Er ruft nur eine Question auf. Keine neuen Texte, kein neuer Bildschirmzustand.
