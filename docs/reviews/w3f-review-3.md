# Code-Review W3f-3: Abschlussrunde vor dem ersten Push (#76, #119)

Gegenstand: `git diff eae0602 8a51cfb` im Worktree `/tmp/claude-0/-home-user-Dwello/b764c1fc-ad3b-5410-ae08-ee39473408c9/scratchpad/review-w3f-code3` (detached, 40856d9). Dazu der Merge 40856d9 (8a51cfb + origin/main 93581d9). Alle sechs geänderten Dateien des Deltas gelesen (vier davon Berichte und Plan unter `docs/` bzw. `implementation_plan.md`).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Es gibt keine Blocker, Majors, Minors oder Nits.

## Bestätigt

- **C-10 behoben.** `statement()` in `src/__tests__/statement-generate-actions.test.ts:122-126` nimmt jetzt `heatingProfileId: string | null = 'hp9'`. Der Aufruf in Z. 176 übergibt `null` ohne `as never`. Die Erwartung ist unverändert, der Test prüft also dasselbe wie vorher. Sein Rot ist schon in Runde 2 (C-2) durch Lesen belegt.
- **Plan archiviert.** `implementation_plan.md` enthält keine Session mehr (das verlangt `open-work.test.ts`: höchstens eine). Die Session W3f steht in `docs/archive/implementation-plan-verlauf.md` zwischen W3e und W4e. Bei der Konfliktlösung sind beide Seiten erhalten geblieben, auch die Sessions von main (W2e, #160). Der einzige offene Punkt ist PR/CI/Merge. Dass der Merge auf das Product-Owner-Urteil zu #387 und #388 wartet, steht dort.
- **Persona Weber, P-1 (Major), an #388.** Der Kommentar auf #388 übernimmt P-1, P-2 und die Beobachtung zu Art. 269b/269c OR. #388 ist offen und hat die Labels `fachlich` und `entscheiden`. P-1 greift den in #76 beschlossenen Text selbst an, gehört also zu den Fällen mit Product-Owner-Entscheid. P-3 bis P-5 (Minor/Nit) bleiben im Bericht und gehen nicht auf den Code dieses Branches zurück: Der Akonto-Satz «Kosten … über dem Akonto» und die Ausrichtung des Hinweises sind älter.
- **Workflow-Notiz** `docs/reviews/workflow-notes-issue-76-119.md`: drei Zeilen. Jede nennt eine Regel, was passiert ist und einen Vorschlag. Keine Code-Folgen.
- **Merge mit origin/main.** `git diff -U0 8b2c710 8a51cfb` (Branch gegen Merge-Basis) und `git diff -U0 93581d9 40856d9` (Merge gegen main) unterscheiden sich nur in Blob-IDs und Zeilennummern der Hunks. Dazu kommt in der Archivdatei eine Leerzeile vor statt nach dem eingefügten Block. Damit sind alle Branch-Änderungen unverändert im Merge, auch #76 (`fixedTerm` in `previewStatements` und in der Rechnungszeile von `+page.server.ts`, `statements_akonto_raise_fixed_term`, Szenarien in `statement-generate.feature` Z. 183 ff. und 395 ff.) und #119 (`differing` in `chosen()`, `PresetNotice.svelte`). In den fünf Dateien, die der Aufrufer nennt, hat main nur eigene Hunks beigetragen: #120 `replacedHere` in `contractsOf`, ein entfernter Marker `#120` in `CategoryCheck.svelte`, zwei Tests, ein Szenario und die Texte zur Berichtigung. Sie überschneiden sich nicht mit den Branch-Zeilen.
- **Zusammenspiel #119 mit #120 von main geprüft.** Jetzt bleiben ersetzte Abrechnungen in der Periode stehen und fliessen in `others` von `chosen()` ein. Eine berichtigte Abrechnung übernimmt aber das Heizprofil der ersetzten (`backend/src/services/statement.service.ts:628`). Sie wird über `?/correct` auf der Abrechnung erstellt, nicht über den Assistenten (`src/routes/statements/[id]/Correction.svelte`). Eine Berichtigung erzeugt also kein zusätzliches abweichendes Heizprofil, und `differing` wird nicht fälschlich wahr.

## Nicht bestätigt

- Vom Aufrufer gemeldet auf 40856d9: `bunx vitest run` (2874 bestanden), `bun run lint`, `bun run check`, `cd backend && bun run type-check`. E2E läuft laut Aufrufer separat. Die betroffenen Szenarien in `statement-generate.feature` (#76, #119 und das #120-Szenario von main) sind auf dem Merge also nicht bestätigt.
- Selbst ausgeführt habe ich keinen Test im Worktree: Dort gibt es kein `node_modules`. Ein Lauf von `bunx vitest run src/__tests__/statement-generate-actions.test.ts src/__tests__/open-work.test.ts` lief versehentlich im Arbeitsbaum des Aufrufers (`/home/user/Dwello`, 19 grün). Er belegt den Stand 40856d9 deshalb nicht. Geschrieben hat er höchstens das generierte `src/lib/paraglide/`.
- Ob die Fach-review-2-Befunde V-7 und V-8 (Minor) in einem Issue stehen, habe ich wie in Runde 2 nicht geprüft.
