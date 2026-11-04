# Code-Review 1096-3 (S3: Fokus nach einer Aktion), `149a5fe05..d44e3dd5a`

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/statements/[id]/FormDialog.svelte:51, src/lib/ui/dialog-submit.ts:21-25, src/lib/ui/Dialog.svelte:78-79, src/lib/ui/focus-after-action.ts:44-53 | Bei FormDialog-Aktionen, die ihren Auslöser entfernen, merkt sich `noteFocus` das Dialog-Panel statt des Auslösers: Der Fokus geht auf den Seitentitel statt auf die Überschrift des Abschnitts (z. B. «Übertrag ausgleichen» → Panel «Zahlung»). |
| C-2 | Minor | src/__tests__/focus-after-action.dom.test.ts:1-61, src/lib/ui/ToastRegion.svelte:68-69 | Geänderte Zeilen ohne Test: der Pfad-Schutz (`at.path !== location.pathname` → Seitentitel, das Mittel gegen den Zustand `before` von einer anderen Seite), der Ersatz durch die Abschnittsüberschrift, wenn ein Bedienelement ausserhalb einer Zeile verschwindet, und dass Fokus im Toast-Bereich nicht gemerkt wird. Fällt einer davon weg, bleibt jeder Test grün. |
| C-3 | Minor | src/__tests__/statement-pages.dom.test.ts:969, :1918 | Die Titel «lässt den Fokus nicht zum Seitentitel springen» behaupten etwas, das der Test nicht zeigt: Er bindet ToastRegion nicht ein, also läuft `refocus` nie. In der App geht der Fokus nach «Als bezahlt markieren» wegen C-1 sehr wohl auf den Seitentitel (dort zu Recht, weil StatusActions im PageHeader steht). Geprüft wird nur, dass FormDialog den Titel nicht mehr selbst fokussiert. |

## C-1 (Major): FormDialog-Aktionen, die ihren Auslöser entfernen, landen auf dem Seitentitel

Ablauf bei einer FormDialog-Aktion (dialog-submit.ts:20-25):
1. `busy(true)`, dann fokussiert `Dialog.svelte:79` das Panel (`panel?.focus()`). `focusin` ruft `noteFocus(panel)` auf, also gilt `before.part = panel` (ohne `data-testid`, nicht in `li/tr`, ausserhalb jeder `section`, weil die Dialoge auf oberster Ebene der Seite stehen, z. B. `CarrySettleDialog` an `+page.svelte:350`).
2. `await update()` zeichnet die Seite neu, dabei verschwindet der Auslöser (z. B. `statement-carry-settle` in `PaymentPanel.svelte:62-64`, sobald `openCarry` falsch ist).
3. Erst danach setzt `answered` `open = false` (FormDialog.svelte:51). Die Aufräumfunktion des Dialogs ruft `opener?.focus()` auf einem bereits entfernten Element auf. Das ist wirkungslos, es gibt kein `focusin`, und `before` bleibt das Panel.
4. `refocus`: Es gibt keine Zeile und keine Test-ID, und `headingOf(panel.closest('section'))` ergibt `null`. Damit fällt der Fokus auf `title` (focus-after-action.ts:53).

Laut Entscheid geht der Fokus ohne nächste Zeile «to the heading of the list or section», hier also auf die Überschrift «Zahlung» des Panels, das stehen bleibt. Ankommen sollte er nicht auf dem Seitentitel. Dasselbe gilt für alle FormDialog-Aktionen, deren Auslöser verschwindet, während sein Abschnitt bleibt (z. B. Zahlung zurücksetzen, wenn `partPaid` wegfällt). Bei DeleteDialog tritt das nicht auf, weil `open = false` dort vor `goto` kommt (DeleteDialog.svelte:64-74). Im Vergleich zu vorher ist das nicht schlechter, denn dank `preventScroll` scrollt die Seite nicht mehr. Für eine Tastaturnutzerin springt der nächste Tab-Schritt aber vom Titel aus nach oben, also genau der Sprung, den #1096 beseitigen soll.

So zeigt man den Fehler: im E2E nach `settleCarryOver` mit `focusedText` den Wert «Zahlung» erwarten (geliefert wird der Titel). Oder als DOM-Test: `noteFocus(trigger)`, dann `noteFocus(panelOutsideSection)`, dann den Auslöser und das Panel entfernen und `refocus()` aufrufen. Erwartet wird die Abschnittsüberschrift des Auslösers, geliefert wird `h1`. Mögliche Abhilfe: Ein Element innerhalb von `[role="dialog"]` wird nicht gemerkt, so wie schon der Toast-Bereich (ToastRegion.svelte:68).

## Nicht bestätigt

- Lint, svelte-check, `vitest --changed origin/main` (1125 bestanden), fallow audit, Chromium-E2E von categories, categories-ki, distribution-keys, heating-profiles, zugangsschluessel, statement-detail und statement-send (203 bestanden), axe-/Sprachzeilen `saved-toast` (4 bestanden), Rotlauf beider Szenarien und der DOM-Tests: vom Aufrufer gemeldet.
- Ob es Listen gibt, deren Zeilen bleiben, während ein Bedienelement mit gemeinsamer Test-ID darin verschwindet (der Zweig über die Test-ID in `refocus` fokussiert dann das gleichnamige Element der ersten Zeile, möglicherweise ausserhalb des sichtbaren Bereichs). Gefunden habe ich keine, gesucht habe ich in den vier DeleteDialog-Seiten und auf der Abrechnungsdetailseite, aber nicht in der ganzen App.
- `before` von einer anderen Seite mit demselben Pfad (z. B. in Safari, wo ein Mausklick einen Button nicht fokussiert, und nach einer Weiterleitung zurück auf denselben Pfad ohne Fokuswechsel dazwischen): nur durch Lesen geprüft, keinen konkreten Ablauf gefunden, weil jeder Dialog beim Öffnen `dialog-cancel` fokussiert und damit `before` neu setzt.

Geprüft: DeleteDialog (Reihenfolge Schliessen vor `goto`, Same-Path nur bei categories, distribution-keys, audit-log; heating-profiles/[id] weiterhin `update()`), alle Listen keyed, Kategorien-Szenario und Neuberechnen-Szenario (Rot am Fokus auf dem Titel plausibel), Screenplay-Schichten, keine neuen Texte oder Bildschirme, Anpassung des Vertragstests passt zu S2.
