# Code-Review 743, Runde 1 (origin/main..a3f66fb)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/lib/ui/DateInput.svelte:104, src/lib/ui/focus-error.ts:17 | Nach Enter sagt Dwello den Fehler der Seite immer noch zweimal: die Live-Region sagt ihn, und `focusFirstError` setzt den Fokus neu ins Feld, sodass die Beschreibung ihn noch einmal vorliest. Das ist Sven P-1, nur auf dem Weg mit Enter. Der DOM-Test (date-input.dom.test.ts:315) bildet den Ablauf im Formular nicht ab. |
| C-2 | Minor | src/lib/ui/DateInput.svelte:99–105 | Enter bei einem ungültigen Datum (z. B. «30.02.2025»): Das Feld zeigt seinen eigenen Fehler («Dieses Datum gibt es nicht …»), die Live-Region sagt aber den Fehler der Seite («Bitte geben Sie ein Datum ein.»), weil der Effekt für `error` die eigene Ansage überschreibt. Auf der Basis hatte der eigene Fehler Vorrang (`announced = invalid && left ? wrongDate : error`). Dazu fehlt ein Test. |
| C-3 | Minor | Commit 8515232 (Nachricht) | Den Enter-Test (date-input.dom.test.ts:315) führt der Aufrufer als Pin von beibehaltenem Verhalten ohne Rot-Lauf. Das sagt aber keine Commit-Nachricht (CLAUDE.md, Workflow 2). Es gehört in den Text des Pull Requests oder in die Nachricht des nächsten Commits. |

## C-1 (Major): Doppelte Ansage nach Enter

Ablauf in «Neue Rechnung» und «Rechnung bearbeiten», wenn das Rechnungsdatum leer und das erste ungültige Feld ist (beim Bearbeiten sind alle anderen Felder gefüllt):

1. Enter im Feld setzt `kept = true` (DateInput.svelte:125), und das Formular wird gesendet.
2. `save()` setzt `errors.invoiceDate` und ruft `focusFirstError` auf. Dessen `await tick()` führt den Effekt in Zeile 104 aus, solange `kept` noch `true` ist. Die Live-Region (`aria-live="assertive"`) sagt also «Bitte geben Sie ein Datum ein.».
3. Danach findet `focusFirstError` das Feld als `document.activeElement`. Es ruft `target.blur()` und dann `target.focus()` auf (focus-error.ts:17). Der Kommentar dort sagt selbst, warum: «focus it anew, or nothing is read out». Der Screenreader liest beim neuen Fokus den Namen und die Beschreibung des Feldes vor, und die Beschreibung enthält den Fehler.

Das Ergebnis ist dieselbe Doppelung, die #743 beheben soll («Announce a page error only where the focus does not land»): Der Fokus landet auch nach Enter wieder im Feld. Der Entscheid vom 7.11. («only when the field kept the focus (Enter in the field)») setzt voraus, dass der Fokus nach Enter im Feld bleibt. Diese Formulare setzen ihn aber neu. Der DOM-Test sendet nur ein `keydown` ohne Formular und ohne `focusFirstError`, deshalb sieht er die Doppelung nicht.

So zeigt man es: einen DOM-Test mit `EditInvoicePage` schreiben, das Rechnungsdatum leeren, im Feld Enter drücken und `await settle()` abwarten. Dann ist die Live-Region `'Bitte geben Sie ein Datum ein.'`, und auf dem Feld läuft `blur`, dann `focus` (mit einem Spy auf `focus` prüfen). Der Fehler steht dabei in `aria-describedby`.

Mögliche Lösungen, beide mit Entscheid des Product Owners, weil sie vom Wortlaut seines Entscheids abweichen: In den Formularen mit `focusFirstError` sagt die Live-Region keinen Fehler der Seite mehr. Oder `focusFirstError` setzt den Fokus nicht neu, und die Live-Region übernimmt die Ansage. Gehört unter «Blocked on me», wenn der Aufrufer nicht belegen kann, dass ein Screenreader die Ansage beim neuen Fokus verwirft.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (29 Dateien, 1565 Tests), die Tests backend-codes, i18n, no-german-in-code, design-guard, tokens, open-work und invoices-i18n, E2E chromium für invoice-new.feature, invoice-edit.feature und invoices.feature (70 bestanden), die axe- und Sprachzeilen der Bildschirme invoice-new, invoice-edit und invoices (30 bestanden), testcheck:audit und deepcheck:audit.
- `No scenario:` für die geänderte Ansage im Datumsfeld: Den Grund (die Live-Region leert sich nach 2 s, also besteht eine E2E-Prüfung auf eine leere Region auch auf der Basis) halte ich für tragfähig. Er steht aber in keiner Commit-Nachricht und muss in den Text des Pull Requests. «Spec change approved: #743» steht in 99525e5 und a3f66fb.
- Ob die Sprachprüfung von fr, it und en `invoices_error_too_long` je zeigt: Keine Zeile in `tests/a11y/screens.json` öffnet den Fehler für eine zu lange Eingabe. Nur der Schlüsseltest in i18n deckt den Text ab. Ich sehe keinen eigenen Zustand mit eigenen Bedienelementen (wie beim Aufrufer).
- Ob das Verhalten von DateInput in den übrigen Formularen mit Datumsfeld richtig bleibt (Verträge, Abrechnungen, FuelStocks): Ich habe nur geprüft, dass kein E2E-Schritt die Live-Region liest (`grep aria-live tests/e2e`). In diesen Formularen sagt die Live-Region einen Fehler der Seite jetzt nur noch nach Enter. Wo eine Seite einen Fehler setzt, ohne den Fokus zu bewegen, hört ihn niemand mehr. Diese Fälle habe ich nicht einzeln geprüft.

Geprüft: Die Grenzen 50/255 entsprechen backend/src/db/schema.ts:310–311 und werden auf dem getrimmten Wert geprüft, den alle drei Formulare senden. «Neue Rechnung» hat kein Feld Rechnungsnummer. Der Fehler öffnet die Zeile im Hochladen-Dialog. Alle Texte sind in vier Sprachen vorhanden und stimmen wörtlich mit dem Fachreview 743-1 überein, Nachtrag V-1 eingeschlossen. Die Ansage zur letzten Datei hängt an `rows.length`, wie das Sperren des Gebäudes. Die Disclosure verwendet nur Tokens, ist 48 px hoch und zeigt den globalen Fokusrahmen. Die Schritte halten die Screenplay-Schichten ein, und kein Schritt eines bestehenden Szenarios ist gelockert. Die neuen Tests und Szenarien scheitern auf der Basis. #1201 ist offen.
