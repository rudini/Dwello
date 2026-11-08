# Code-Review 1284-4 (Fallback-Review #1322, Commit 13f7c8b, Bereich 09a0bc6..13f7c8b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/apartments/ApartmentForm.svelte:68 | Der abgebrochene Submit bewegt den Fokus nicht und sagt nichts an. Die Fehlermeldung wird nur beim Verlassen des Felds gesprochen (`say(own)`, 2 s, danach geleert). Wer mit Tab zu «Änderungen speichern» geht und Enter drückt, bleibt auf der Schaltfläche, und kein Screenreader sagt etwas, auch nicht beim zweiten Druck. Andere abgelehnte Saves rufen `focusFirstError(formElement)` auf, das bereits `[aria-invalid="true"]` sucht. Vor `cancel()` aufrufen. |

Geprüft: Der Guard trifft nur den eigenen Prüffehler von DateInput. Die Edit-Seite gibt `DateInput#discontinuedFrom` kein `error`-Prop, und das BFF (`src/lib/server/apartment-form.ts`) setzt kein `errors.discontinuedFrom`. Backend-Ablehnungen landen in `errors.form`. Ein vom Server gesetzter Fehler am Feld kann den Submit darum heute nicht blockieren. Würde später einer übergeben, bliebe `aria-invalid` nach dem Submit-Capture von Field auch nach der Korrektur gesetzt, und der Guard würde jeden Submit sperren. Das ist heute kein Defekt.

Ohne JavaScript hat das Textfeld kein `name`. Das versteckte Feld sendet den serverseitig gerenderten, gespeicherten Tag. Ohne JS wird also nichts gelöscht, ein Ändern ist aber auch nicht möglich. Das gilt für DateInput allgemein und ist älter als dieser Diff.

Ein bewusst geleertes Feld ist nicht ungültig, sendet '' und nimmt die Aufhebung zurück, wie vorgesehen. «1.7» ohne Jahr und «31.13.2025» brechen ab. «01.07.25» wird beim Verlassen ausgeschrieben und gesendet.

Der DOM-Test fällt ohne den Guard: `cancel` wird dann nicht aufgerufen.

Der Wizard-Test bildet beibehaltenes Verhalten ab. Der Basis-Commit zeigt jede codierte Ablehnung über `backendMessage`, der POST-Pfad ist in `backend/src/__tests__/apartment-discontinued.pg.test.ts:159` belegt, und der Vertrag `tests/contracts/contract-apartment-discontinued.json` wird gegen die API geprüft. Ein zusätzliches Wizard-Szenario braucht es nicht: Die Regel ist end-to-end im Szenario «Ein Mietvertrag endet spätestens am Tag vor der Aufhebung» abgedeckt. Der Wizard zeigt die Meldung über denselben generischen Weg, und der DOM-Test ist dafür die tiefste Schicht.

Es gibt keinen neuen Bildschirmzustand: Der Feldfehler von DateInput erschien schon vorher beim Verlassen. Es gibt keine neuen Texte.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint sauber, `bun run check` 0 Fehler, vitest `apartment-form.dom` + `contract-wizard.dom` 74 grün, E2E chromium `-g "Aufgehobene Wohnung|Wohnung bearbeiten|Neue Wohnung"` 24 grün, CI grün auf 09a0bc6.
- Reihenfolge im echten Browser: Der DOM-Test löst Blur und `flushSync` selbst aus und ruft die Submit-Funktion von enhance direkt auf. Ein echtes `submit`-Event mit dem Capture-Listener von DateInput vor dem enhance-Listener durchläuft er nicht. Beim Lesen hält der Ablauf: Ein Klick feuert Blur vor dem Click-Task, Enter ruft `flushSync(onblur)` im keydown auf, und Capture-Listener am Ziel laufen vor dem nicht-capture Listener von enhance. Kein E2E-Schritt tippt einen ungültigen Tag in «Aufgehoben ab» (gesucht in `tests/e2e/features/apartment-discontinued.feature`).
