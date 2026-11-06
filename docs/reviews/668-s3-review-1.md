# Code-Review 668-s3, Runde 1 (origin/main..8497f84)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/contracts/new/RentStep.svelte:157-165 | Die LiveRegion sagt das Monatlich total bei jedem Tastendruck an (kein Debounce, keine Ansage erst bei change/blur): der Screenreader wird mit Zwischenbeträgen überflutet |
| C-2 | Minor | src/routes/contracts/new/RentStep.svelte:158 | Kein DOM-Test zeigt, dass das Monatlich total in einer `role="status"`-Region steht. Auch der Assistent (der RentStep mitbenutzt) hat dafür weder Test noch Szenario; nur das E2E-Szenario der Bearbeitungsseite prüft es |

## C-1 (Major): Ansage bei jedem Tastendruck

Warum falsch: `MoneyInput` bindet `bind:value` direkt an `<input>`. Damit ändert jedes `input`-Ereignis `values.baseRent`, und `total` (`$derived.by`, Z. 32) rechnet sofort neu. Der Inhalt von `<LiveRegion shown>` (`role="status"`, also implizit `aria-live="polite"` und `aria-atomic="true"`) ändert sich deshalb bei jeder Ziffer. Wer «1450» tippt, hört nacheinander «Monatlich total CHF 1.00», «CHF 14.00», «CHF 145.00» und «CHF 1’450.00». Diese Ansagen laufen gegen das Tastenecho, und die Beträge davor sind falsch. Der Aufrufer hat genau das zur Prüfung genannt. Weder der Commit noch ein Test geht darauf ein.

Warum kein Test es zeigt: Der Schritt «die Nettomiete … einträgt» nutzt `Enter.theValue` (Playwright `fill`). Das setzt den Wert in einem Zug, also sieht das Szenario nur eine Änderung.

So lässt es sich zeigen: Ein DOM-Test tippt «1450» Zeichen für Zeichen in `contract-base-rent-input` und hält jeden Text der `role="status"`-Region fest (MutationObserver oder ein Snapshot nach jedem `input`). Heute gibt das vier Werte statt einem. Mögliche Lösung: Die Region zeigt einen eigenen `announced`-Wert, der erst bei `blur` (`MoneyInput` hat `onblur`) oder entprellt nachzieht. Das sichtbare Total kann ausserhalb der Region sofort nachziehen.

## Nicht bestätigt

- Das S-3-Szenario ist grün und die 4 übrigen `@wip`-Szenarien sind rot (vom Aufrufer gemeldet). Durch Lesen bestätigt: Ohne die Änderung hat `contract-monthly-total` keinen `role="status"`-Vorfahren, das Szenario fällt also ohne sie. Die `@wip`-Targets (z. B. `contract-notice-hint`, bisher nur in `contract-edit.dom.test.ts`) zielen auf noch fehlendes Verhalten.
- contract-edit.dom und contract-wizard.dom mit 123 bestanden, lint sauber, check mit 0 Fehlern (vom Aufrufer gemeldet).
- axe (light/dark, drei Viewports) lief nicht. Es gibt keinen neuen Bildschirmzustand, daher ist kein Eintrag in `tests/a11y/screens.json` nötig.
- Das tatsächliche Ansageverhalten mit NVDA oder VoiceOver ist nicht geprüft. Die Einschätzung in C-1 stützt sich auf die ARIA-Semantik von `role="status"`.

Geprüft: Texte (keine neuen, `common_monthly_total` gibt es schon), Tokens und Komponenten (`LiveRegion` aus `src/lib/ui`), Screenplay-Schichten der neuen Schritte, Targets, Questions und Task, Formulierung der Features, keine fremden Änderungen im Diff, Ponytail (keine unbenutzten Teile, kein kopierter Helfer).
