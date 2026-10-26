# Review #778, Slice 1 (97b86f7e), zugleich Abschlussrunde

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Ursache und Timing stimmen. Nach dem Reload setzt `onMount` (StatementWizard.svelte:113-128) den Schritt aus dem Entwurf auf 2. BuildingStep wird mit der wiederhergestellten Periode gemountet, und sein `$effect` (BuildingStep.svelte:28-65) setzt `invoiceCounts` und `loading = false` im selben `then`. `step-loading` ist bis zum ersten Flush `invisible`, deshalb kann `Wait.forCount(agreementsLoading, 0)` vor dem Laden schon erfüllt sein. Die Zeile `generate-building-invoices-{id}` (BuildingChoice.svelte:96-99) erscheint erst mit beiden Antworten. Die Scroll-Korrektur (#470, `tick().then`) läuft vor dem nächsten Playwright-Roundtrip, und die beibehaltene `agreementsLoading`-Wartezeit bleibt bestehen. Ein Hängen ist nicht möglich: Ein Entwurf wird immer in Schritt 2 gespeichert, denn `startDraft` haken dort ein Gebäude an. Für `draft-restored` und `draft-discard-dialog` setzt das Seeding ein Gebäude (fixtures/screens.ts:78). Bei `/contracts/new` gibt es keinen `settled`-Eintrag. Nur eine fehlgeschlagene `/invoices`-Antwort würde in den Timeout laufen, gleich wie bei `tickBuilding`. Der Check prüft nicht weniger, die Änderung fügt nur eine Wartezeit vor axe hinzu. Die Screenplay-Schichten bleiben eingehalten (Task mit `Wait.until(target)`, wie `tickBuilding`). Die Kommentare stimmen, und ponytail-review ergibt nichts Unbenutztes. Firefox-Teil: #832 (Fix von #754) liegt auf dem geprüften Commit (1456a3a7). Kein Szenario nötig, weil nur Tests geändert sind (`No scenario` steht im Plan).

## Nicht bestätigt

- Ein Rot-Lauf vor dem Fix: Der Flake ist selten und lokal nie reproduziert worden. Die Ursache ist nur durch Lesen des Codes belegt, nicht durch einen Lauf, der ohne die Wartezeit fehlschlägt.
- lint und check: vom Aufrufer gemeldet.
- axe- und Sprachzeilen `draft-restored`, 8 Läufe in Chromium: vom Aufrufer gemeldet. Den Mobile-Dark-Durchgang habe ich nicht gesondert nachvollzogen, ebenso wenig Firefox und WebKit. E2E habe ich nicht selbst gestartet.
