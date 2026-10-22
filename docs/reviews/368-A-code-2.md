# Code-Review #368, Slice A, Runde 2 (Abschlussrunde)

Bereich: `git diff c46c71e5 e945706f -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/design/personas'`, Worktree `review-368-A-2` (e945706f). Vorbericht: `docs/reviews/368-A-code-1.md`, Persona: `docs/design/personas/368-A-helga.md` P-1.

## Status der offenen IDs

| ID | Status |
|----|--------|
| C-1 (Major) | Behoben. `restoreDraft` legt `agreed` über die Werte des Entwurfs (`ContractWizard.svelte:139-140`). Der neue DOM-Test (Entwurf mit `['k2']`, `agreed: ['k1']`) wäre ohne die Änderung rot, weil k2 angehakt und k1 leer wäre. |
| C-2 (Major) | Behoben. `NextSteps.svelte:41` hängt `&from={contractId}` an, `+page.svelte:149` übergibt die Id. `contract-detail-page.dom.test.ts:150` prüft den href. Die Komponente wird nur dort verwendet. |
| C-3 (Major) | Behoben, mit Einschränkung C-6 (Minor). Der Zustand steht in `screens.json` (Bedeutung, Liste, Abfrage), in beiden Features und in `tasks/accessibility.ts`. |
| C-4 (Minor) | Offen, nicht Teil des Deltas. `UBIQUITOUS_LANGUAGE.md` ist unverändert. |
| P-1 (Persona, Major) | Behoben. Der Text nennt kein amtliches Formular mehr und verlangt den Vergleich mit dem unterschriebenen neuen Mietvertrag. Der Satz «Nur angekreuzte …» steht wieder drin (das deckt auch P-2 zur Hälfte ab). Alle vier Sprachen sind angepasst, und der DOM-Test prüft den deutschen Text. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Minor | tests/e2e/tasks/accessibility.ts:385-387 | Der neue Eintrag steht zwischen dem Kommentar von `flat-rate-warning` («a Nebenkostenpauschale without Akonto …», #429) und dessen Eintrag. Dadurch beschreibt dieser Kommentar jetzt `rent-follow-up`, und `flat-rate-warning` hat keinen Kommentar mehr. |
| C-6 | Minor | tests/e2e/tasks/accessibility.ts:387 | `'rent-follow-up': () => toRentStep` wartet nur auf die Kästchen (`agreedCategoryBoxes`), nicht auf den Zustand, den die Bedeutung nennt («the help saying so»). Liefert `from` kein `agreed` (z. B. bei einer Fehlerantwort, siehe `agreedOf`), zeigt der Schritt die gewöhnliche Hilfe. Die axe- und Sprachzeile bleiben dann grün, ohne den Folgevertrags-Text je geprüft zu haben. Abhilfe: ein `Wait.until` auf den Folgevertrags-Text oder auf ein Merkmal davon. |

## Nicht bestätigt

- `bun run lint`, `bun run check`, `contract-edit.dom` und `contract-new-load`: vom Aufrufer gemeldet. Ebenfalls vom Aufrufer gemeldet sind die E2E-Läufe in Chromium (das Szenario, B-16, die Zeilen `rent-follow-up` für axe und Sprachen). Ob Emils Mietvertrag in `fixtures/screens.ts` vereinbarte Kategorien hat und ob der Zustand die Folgevertrags-Hilfe wirklich zeigt, habe ich nur über die Abfrage gelesen, nicht im Browser gesehen (siehe C-6).
- Selbst nachgeprüft: `bunx vitest run src/__tests__/contract-wizard.dom.test.ts src/__tests__/contract-detail-page.dom.test.ts`, 113 bestanden. Die Rot-Läufe ohne die Änderung habe ich nur durch Lesen beurteilt.

Geprüft: Der Wortlaut in fr, it und en ist inhaltlich gleich wie im Deutschen und verwendet die förmliche Anrede (Sie, vous, Lei). Die Begriffe stimmen mit dem übrigen Abschnitt überein (frais accessoires, contrat de bail, spese accessorie, contratto di locazione, utility costs, rental contract). In fr steht vor «:» ein U+00A0. Der Diff enthält nichts, was nicht zur Anforderung gehört. Die Screenplay-Schichten sind eingehalten.
