# Code-Review 1096-4 (Re-Review von 1096-3), `d44e3dd5a..83f2f4e89`

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde. |

## Nicht bestätigt

- Lint, Prettier, `vitest run` der Fokus-, Layout- und Abrechnungs-DOM-Tests (259 bestanden), Chromium-E2E der Toast-/Fokus-Szenarien sowie der Szenarien zum Löschen von Kategorien und zum Übertrag (21 bestanden), Rotlauf des C-1-Tests und der beiden C-2-Tests ohne ihren Code: vom Aufrufer gemeldet.
- Der eigentliche Ablauf von C-1 in der App (FormDialog → Panel fokussiert → Auslöser `statement-carry-settle` entfernt → Fokus auf «Zahlung») ist nur aus Teilen belegt: Der DOM-Test für C-1 nutzt einen Auslöser in einer Listenzeile, der Test zur Abschnittsüberschrift einen ohne Dialog. Kein E2E-Schritt prüft den Fokus nach «Übertrag ausgleichen». Nach dem Lesen stimmt die Kette: `PaymentPanel.svelte:57` (Panel = `section` mit der Überschrift «Zahlung» als erster `h2/h3`), `Dialog.svelte:78-79`, `focus-after-action.ts:18`.
- Neu entsteht: Ein Fokus innerhalb eines Dialogs wird nicht mehr gemerkt. Wenn in einem offenen Dialog ein Bedienelement verschwindet, der Fokus auf `body` fällt und gleichzeitig eine Bestätigung erscheint, würde `refocus` den Auslöser hinter dem inerten Dialog ansteuern und dort nichts fokussieren. Einen solchen Ablauf habe ich nicht gefunden. `InvoiceUploadDialog.svelte:193-229` setzt den Fokus beim Entfernen und Anlegen selbst. Verschachtelte Dialoge (Verwerfen-Dialog `:311`) schliessen über `finish()` beide, sodass der Fokus über den `opener` auf die Seite zurückgeht. Die Navigation in `MobileNav` (`role="dialog"`) wechselt den Pfad, also gilt der Seitentitel. Nicht durchsucht habe ich `DraftNotice.svelte` und `FuelStockList.svelte` (beide mit `{#each}` und Dialog) sowie die übrigen Dialoge der App.

Geprüft: Verschieben der Toast-Prüfung von ToastRegion in `noteFocus` (wirkt gleich, `place()` behält eine eigene `region.contains`-Prüfung), Rotlauf durch Lesen (der C-1-Test ist rot ohne die Dialog- und ohne die Toast-Prüfung, die beiden C-2-Tests sind rot ohne `headingOf(at.section)` bzw. ohne die Pfadprüfung), `pushState` im letzten Test wirkt sich auf keinen anderen Test aus, die neuen Titel aus C-3 entsprechen der Assertion `activeElement` ist nicht `h1`, keine neuen Texte oder Bildschirme, nichts ohne Bezug zur Anforderung.
