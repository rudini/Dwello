# Review 4 (Abschlussrunde) – #1146, Bereich 9ea3970f5..933de4f32

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/ui/Stepper.svelte:48-51 | `flex-wrap` hilft nur, solange das längste Wort in eine Zeile passt: das `<li>` hat mit Werten weiterhin kein `min-w-0`, `break-words` (overflow-wrap: break-word) senkt seine Mindestbreite nicht, also bleibt ein einzelnes Wort, das breiter ist als die Liste (Gebäudename bis 255 Zeichen, `backend/src/db/schema.ts:32`), auch allein in seiner Zeile breiter als der Container und die Seite scrollt seitwärts. Der neue Kommentar (Z. 20) verspricht das für jeden langen Gebäudenamen. Realistische Namen (wie «Mehrfamilienhausüberbauung») sind abgedeckt. |

Geprüft: Diff (Stepper.svelte, statement-generate.feature) gelesen; `flex-wrap` nur mit Werten, ohne Werte unverändert (#667); Szenario nutzt bestehende Schritte (`nennt der erledigte Schritt … die Wahl …`, `scrollt die Seite nicht seitwärts` über die Question `pageOverflowsSideways`), passt zur Grundlage (zweites Gebäude neben «Lindenhof»), kein `@wip`, keine neuen Texte, kein neuer Bildschirmzustand; beim Lesen fällt das Szenario ohne den Fix plausibel an der Seitwärts-Prüfung (Mindestbreiten aller fünf Schritte in einer Zeile bei 768 px), Ankerschritt sichert, dass der Name tatsächlich angezeigt wird. Nichts Fremdes im Diff.

## Nicht bestätigt

- Vom Aufrufer gemeldet: E2E chromium statement-generate.feature + contract-new.feature 159 passed; accessibility.feature + sprachen-bildschirme.feature Zeilen statement-generate 54 passed; `bun run lint`, `bun run check` sauber; ui-navigation-parts.dom.test.ts 8 passed.
- Rot vor dem Fix an der Seitwärts-Prüfung: nur durch Lesen beurteilt (Stepper.svelte Z. 21, 29, 48 auf 9ea3970f5), nicht ausgeführt.
- Kein DOM-Test für `flex-wrap`: jsdom rechnet kein Layout, die E2E-Ebene ist die niedrigste, die den Überlauf zeigt.
