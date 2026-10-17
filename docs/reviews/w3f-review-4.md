# Code-Review W3f, Runde 4: Merge-Commit ae926019 (origin/main in claude/w3f-befristet-preset-76-119)

Worktree: `/tmp/claude-0/-home-user-Dwello/b764c1fc-ad3b-5410-ae08-ee39473408c9/scratchpad/review-w3f-merge` (detached, ae926019).
Eltern: cc3c8d7 (Branch, #76/#119), f7681f9d (origin/main, u. a. #91 vereinbarte Nebenkosten, #357 Protokoll). Merge-Basis 93581d9a.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|---------|
| C-1 | Nit | messages/de.json (`statements_finding_new`) | Der zusammengesetzte Text (neuer Einstieg aus #91 + `{fixedTerm}`-Satz aus #76) wurde in dieser Kombination von keinem `fach-reviewer` gelesen. Inhaltlich passt er (der eingefügte Satz hängt nur an der Formvorschrift, die beide Seiten unverändert haben, fach-review V-4); kein Handlungsbedarf, nur Hinweis. |

Keine Blocker, keine Majors.

## Geprüft

- **Konfliktauflösung** (`git show --remerge-diff ae926019`): einziger Konflikt `statements_finding_new` in allen vier `messages/*.json`. Aufgelöst als Text von main, mit `{fixedTerm}` direkt nach «… ist die Änderung nichtig.» / «… la modification est nulle.» / «… la modifica è nulla.» / «… the change is void.» und vor «Waren die Kosten …» bzw. Entsprechung. Sonst nichts verändert. Korrekt.
- Die übrigen Branch-Schlüssel (`statements_akonto_raise_fixed_term`, `statements_finding_new_fixed_term`, `statements_preset_differing`) sind in allen vier Dateien vorhanden (je 4 Treffer inkl. `{fixedTerm}`).
- Alte Formulierung («Ist diese Kategorie im Mietvertrag vereinbart?» usw.) kommt ausserhalb von `docs/` nirgends mehr vor, also auch in keinem Feature und keinem Test.
- **Von beiden Seiten geänderte Dateien**, gegen die Merge-Basis gelesen:
  - `src/lib/server/statement-generation.ts`: `terminated?` am Contract-Typ, `fixedTerm` und `buildingId` im Vorschau-Zeilenobjekt (#76) bleiben. `contractAgreements` (#91) kommt dazu; `contractsInPeriod` nimmt jetzt `Run` (= `Pick<GenerationRequest, …>`), `previewStatements` übergibt weiterhin `GenerationRequest`: das ist typverträglich.
  - `src/__tests__/statement-generation.test.ts`: #76-Test «erkennt einen laufenden befristeten Mietvertrag» und die Erwartungen `fixedTerm`/`buildingId` bleiben; der #91-Block kommt dazu.
  - `src/__tests__/statement-wizard.test.ts`: der #76-Test prüft `ist die Änderung nichtig. ${fixedTerm} Waren die Kosten` und passt damit auch zum neuen Einstieg von main. Der Test von main prüft den ganzen Text ohne `fixedTerm`, also den Fall `''`. Zusammen decken die beiden die Auflösung ab: Ein falsch gesetzter Platzhalter liesse einen der beiden scheitern.
  - `src/__tests__/statement-wizard.dom.test.ts`: #119-Test (verschieden eingestellt) und #76-Test (Befund im Gebäude) bleiben. `toSettings` mit `fakeBff` für `/statements/agreements` (#91) betrifft die Branch-Tests nicht.
  - `tests/e2e/targets/statement-generate.ts`, `tests/e2e/questions/statement-generate.ts`: `previewAkontoHint`/`akontoHintOf` (#76) und die #91-Targets und -Questions stehen sauber nebeneinander.
  - `docs/archive/implementation-plan-verlauf.md`: beide Sessions (W3f, W10c, W7e) sind archiviert.
- **Zusammenspiel #91 mit dem #76-Szenario** (`statement-generate.feature`, «Hinweise zu Akonto und neuen Nebenkosten bei einem befristeten Mietvertrag»): Seit #91 rechnet die Berechnung nur vereinbarte Kategorien ab (`calculation.service.ts`). Der Mietvertrag von «Lea Graf» entsteht über `createContract` ohne Liste, also mit allen umlagefähigen Kategorien vereinbart (`setAgreedCategories(id, undefined)`). Kaltwasser bleibt damit in seinen Kosten, und der Akonto-Hinweis bleibt erreichbar. `openPreview` wartet jetzt über `leaveSettings` auf den Abschluss der Vereinbarungsprüfung. Das Szenario braucht dafür keinen zusätzlichen Schritt.
- Das #119-Szenario und `+page.server.ts`/`PresetNotice.svelte` des Branches hat main nicht berührt.
- Ponytail: Die Auflösung ist die kürzeste mögliche (nur die Konfliktzeile), ohne Reste und ohne fremde Änderungen.
- Nachgeprüft: `bunx vitest run src/__tests__/statement-wizard.test.ts src/__tests__/statement-wizard.dom.test.ts src/__tests__/statement-generation.test.ts src/__tests__/statement-generate-actions.test.ts`: 122 bestanden.

## Nicht bestätigt

- `bunx vitest run` (gesamt, 2928 bestanden), `bun run lint`, `bun run check`, `cd backend && bun run type-check`: vom Aufrufer gemeldet; nur die vier Statement-Testdateien oben habe ich selbst laufen lassen.
- E2E (insbesondere die #76- und #119-Szenarien in `tests/e2e/features/statement-generate.feature` und `statement-agreed-costs.feature` von main): vom Aufrufer als laufend gemeldet, nicht gestartet (Regel). Bestätigt habe ich nur durch Lesen, dass die Vorbedingungen weiter halten (siehe oben).
- Die übrigen, nur von main geänderten Dateien (Backend #91/#357, Protokoll-Seite, Persona- und Review-Berichte) habe ich nicht als neue Änderung geprüft: Sie kamen konfliktfrei von main und überschneiden sich nicht mit Dateien des Branches. Gelesen habe ich nur, was das Zusammenspiel mit #76 betrifft (`calculation.service.ts`, `agreed-category.service.ts`, `contract.service.ts`, `tests/e2e/tasks/statement-generate.ts`, `tests/e2e/fixtures/backend.ts`).
