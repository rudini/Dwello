# Code-Review W3f-2: #76 und #119, Runde 2

Gegenstand: `git diff c08599e eae0602` im Worktree `/tmp/claude-0/-home-user-Dwello/b764c1fc-ad3b-5410-ae08-ee39473408c9/scratchpad/review-w3f-code2` (detached, eae0602). Alle 12 geänderten Dateien gelesen (davon drei Berichte unter `docs/`).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-10 | Nit | `src/__tests__/statement-generate-actions.test.ts:172` | `null as never` umgeht den Typ des Helfers. `heatingProfileId: string \| null = 'hp9'` in `statement()` (Z. 122) wäre ehrlicher. |

Es gibt keine neuen Blocker oder Majors.

## Offene Befunde aus Runde 1

- **C-1 behoben.** Das Leerzeichen nach `":"` bei `statements_preset_from_settings` ist in allen vier `messages/*.json` zurück. Der Diff gegen die Basis 8b2c710 enthält diese Zeile damit nicht mehr.
- **C-2 behoben.** Der Test «übergeht eine übrige Abrechnung ohne Heizprofil» (`statement-generate-actions.test.ts:170-174`) ist rot, wenn man `profiles` durch `others` ersetzt (nur gelesen, nicht ausgeführt): `null` reicht den Default `'hp9'` nicht durch. `Set{null,'hp9'}` hat dann die Grösse 2, also `differing: true` und `defaultHeatingProfileId: 'hp1'`. Die Erwartung `hp9`/`differing: false` schlägt fehl.
- **C-3 erledigt.** `statements_akonto_raise_fixed_term` ist jetzt in allen vier Sprachen wieder der in #76 beschlossene Text. Er passt in Unit-Test (`statement-wizard.test.ts:422-424`) und Szenario (`statement-generate.feature:182`). Der alte Zusatz «sonst ist sie nichtig» steht nirgends mehr ausserhalb von `docs/reviews` (grep). #388 ist offen und hat die Labels `fachlich` und `entscheiden`. Es nennt beide Optionen mit allen fr/it/en-Fassungen. Der Marker `TODO(fachlich prüfen, #388)` steht in `akontoHint` (`statement-wizard.ts:226`).
- **#387.** Das Issue ist offen und hat die Labels `fachlich` und `entscheiden`. Der Marker steht in `chosen()` (`+page.server.ts:50`).
- **Zurückgewiesen: C-5, C-7, C-9.** Die Begründungen halten. Zu C-5: Die Persona-Datenbank bestätigt, dass ohne Standard-Heizprofil das erste vollständige Profil vorgewählt wird, siehe unten. Eine positive E2E-Prüfung wäre also nicht stabil.
- **C-4, C-6, C-8** bleiben Minor/Nit, wie in Runde 1.

## Bestätigt

- Der Delta ändert nur, was die Befunde verlangen. Die drei Berichte unter `docs/` gehören zum Ablauf.
- Die Texte sind in allen vier Sprachen gleich gekürzt. Die Sätze, die übrig bleiben, sind unverändert gegenüber den Fassungen, die in Fachreview 2 geprüft wurden.
- `bunx vitest run` für `statement-generate-actions.test.ts`, `statement-wizard.test.ts` und `open-work.test.ts` im Worktree selbst ausgeführt: 50 Tests, grün.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run` für `statement-wizard.dom` und `statements-i18n` (der Aufrufer meldet zusammen 122 Tests) und die Commit-Hooks. Lint, `check`, Backend-Typecheck und E2E für eae0602 hat der Aufrufer nicht gemeldet. Das geänderte Szenario `statement-generate.feature:182` ist deshalb auf eae0602 nicht gelaufen, weder bei mir noch laut Meldung.
- Persona-Bericht `docs/design/personas/anna-w3f.md`, P-1 und P-2 (beide Major): Der Aufrufer nennt keine Triage. Das gehört nicht zu diesem Code-Review. Ich habe aber geprüft, ob P-2 einen Fehler im Code von #119 verdeckt. In `dwello_persona` habe ich nur gelesen. Die Entwürfe 2025 von Seepark haben die Heizprofile «Heating + Hot Water» (Weber, Brunner, 3 %) und «Heating Mountain» (Bernasconi, 2.5 % eigener Satz). `differing: true` ist also richtig. Annas Aussage, alle drei Entwürfe zeigten «Heizung + Warmwasser», deckt sich nicht mit der Datenbank. Ob die Entwurfsansicht das Heizprofil falsch zeigt oder Anna sich verlesen hat, habe ich nicht geprüft (Screenshot `persona-anna/anna-w3f/09-draft-weber.png` zeigt nur Weber). P-1 deckt sich mit fach-review V-8.
- Fach-review 2, V-7 und V-8 (Minor): Ob die beiden in einem Issue oder unter «Found» stehen, habe ich nicht geprüft.
