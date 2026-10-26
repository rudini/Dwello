# Code-Review #233, a09ae7f6 (1d9d3019..a09ae7f6)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/a11y/screens.json:303 | Neuer UI-Zustand «Hinweise zum Beleg» (`invoice-document-hints`, InvoiceBeleg.svelte:81) und die neue Variante der Löschbestätigung einer abgerechneten Rechnung mit Beleg fehlen in `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature` |
| C-2 | Minor | src/routes/invoices/[id]/edit/+page.svelte:65 | `body` als `$derived` aus `save()` herausgezogen: Umbau von unverändertem Code, für die Rechnungsnummer reicht eine Zeile im bestehenden Objekt |

## C-1 (Major)
CLAUDE.md, Design-Regeln/Process: jeder neue Zustand eines Bildschirms (und jede Variante mit eigenen Inhalten) braucht eine Zeile in `tests/a11y/screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature`. `invoice-detail` hat nur `default` und `delete-dialog`; der Zustand mit Hinweis-Alert (abgezogene Beträge / nicht umlagefähige Kosten) wird weder auf axe (hell/dunkel, drei Viewports) noch auf deutsche Reste in fr/it/en geprüft. Nachweis: `grep -n invoice-document-hints tests/a11y tests/e2e/features/accessibility.feature tests/e2e/features/sprachen-bildschirme.feature` liefert nichts. Ebenso zeigt `delete-dialog` mit dem Testdatensatz nicht zwingend die neue Zeile `invoice-delete-billed-document-note` (abgerechnet + Beleg). Behebung: Zustände `beleg-hints` und `delete-dialog-billed-beleg` ergänzen.

## Nicht bestätigt
- Lint und betroffene Unit-Tests: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- E2E-Szenarien (u. a. neue «Dwello sagt, was nach dem Lesen zu tun ist …», «Eine hochgeladene Datei gross ansehen», die von `@wip` befreiten) und deren Rot vor der Änderung: nur durch Lesen und die Angaben in `implementation_plan.md` beurteilt.
- Backend-Test `invoice-beleg.pg.test.ts` und `api-contracts.pg.test.ts`: nicht ausgeführt (kein Lauf mit Datenbank erlaubt).
- Sichtbares «(öffnet in neuem Tab)» in `Button.svelte` wirkt auch auf Gebäudekarte und Versanddialog; Layout bei 390 px dort nicht geprüft.

Geprüft: Backend-Schema/Migration/Route/Service (Hinweise beim Erstellen gespeichert, beim Ersetzen verworfen, Betragsmuster passt zu `francs`), BFF-Zusammenführung (Datei überschreibt Client-Felder, ohne Datei Abbruch in `belegOf`), Vertrag `tests/contracts/invoice.json`, Texte in allen vier Sprachen (je 12 Zeilen), Screenplay-Schichten der neuen Steps/Tasks/Questions, entfernte `@wip` nur bei auf `main` noch `@wip` stehenden Szenarien.
