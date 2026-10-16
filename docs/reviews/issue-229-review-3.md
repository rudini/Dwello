# Code-Review #229, Runde 1 des Fix-Slice (Feature-Review-Befunde)

Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-229-code3`, HEAD `23a94250`, Delta `fc20902b..23a94250` (ein Commit). Ich habe alle 8 geänderten Dateien gelesen. Ausserdem habe ich gelesen: `heatingOf`, `recomputedHeating` und `runDetailsOf` in `statement-pdf.service.ts`, den Heizpfad und `heatingOfRun` in `calculation.service.ts:320-425`, `heatingLines` in `pdf.service.ts:643-656` und die Befunde V-1 und V-2 in `docs/reviews/issue-229-fachreview-2.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-12 | Minor | backend/src/services/pdf.service.ts:276 | Der englische Text «in total» (V-2) ist ein Text, den der Mieter im PDF sieht. Kein Test zeigt ihn: Ein Grep nach «in total» und «billing period total» findet in `backend/src`, `src` und `tests` nur die Definition. Workflow 6 verlangt für einen geänderten Text, den der Nutzer sieht, zuerst einen roten Test. |
| C-13 | Minor | implementation_plan.md:28-29 | Für den Fix-Slice fehlt die Zeile `Skills: tdd, ponytail, ponytail-review`. Die Zeile auf `implementation_plan.md:23` gehört zum vorigen Slice. |
| C-14 | Nit | implementation_plan.md:30 | Das Rot des neuen Tests steht wieder nur im Text der Zeile zum fach-reviewer («red: 70.97 %»). Eine eigene Zeile `Test red: <test> – <message>` fehlt. Das ist dieselbe Art Befund wie C-9. |

Kein Blocker, kein Major.

## Prüfung des Deltas

- **V-1 (Code), `statement-pdf.service.ts:139-141`:** Im gespeicherten Pfad nimmt die Erläuterung jetzt `period_share` der Heizposition, wenn es diesen Wert gibt. Sonst bleibt `stored.percent`.
  - Der Wert passt zum gespeicherten Anteil. Bei `byDays: false` setzt `calculation.service.ts:332-334` das `periodShare` jeder Heizposition aus demselben `handleMidYearMoves` (gleiches Profil, gleiche Vertrags- und Periodendaten wie `heatingOfRun`) und speichert es auf 4 Stellen (`:355`).
  - Für Abrechnungen, die mit diesem Branch erstellt wurden, ist `stored.percent` schon so gerundet (`:419`). An ihnen ändert sich also nichts.
  - `parseFloat("0.7098") * 100` ergibt 70.98, und `heatingLines` rundet ohnehin auf zwei Stellen.
  - Wenn eine Heizposition mit Warmwasser vorkommt, nimmt `runDetailsOf` die erste Heizposition. Alle Heizpositionen haben dasselbe `periodShare`.
  - `periodPercent` fehlt bei Abrechnungen aus der #209-Zeit weiterhin. Dann gibt es keinen Zusatz mit den Summen. Das ist die Lösung, die V-1 selbst als ausreichend nennt («kein falscher Text»).
  - Die gespeicherten Monate bleiben unverändert. Sie sind dieselben gerundeten Monatsanteile wie heute.
- **Test `statement-pdf.pg.test.ts:411-428`:**
  - Der Test setzt `heating_share` auf den Stand von #209: `percent` 70.97, ohne `periodPercent`. Danach erstellt er das PDF neu und prüft den Wert («70.98 % der Heizkosten»).
  - Ohne den Fix stünde dort `stored.percent`, also «70.97 %». Der Test wird damit nachweisbar rot, wie im Plan vermerkt.
  - Die Aufräumarbeiten vor dem `expect` folgen dem Muster der Nachbartests.
- **C-10, Zeile :407:** Die zusätzliche Prüfung, dass der Satz zu den Summen fehlt, steht für das ganze Jahr bei einer älteren Abrechnung. Erledigt.
- **C-9 und C-11, Plan:** Die Zeilen `Scenario red` und `Test red` für die Befunde aus Runde 1 stehen jetzt da. Die Begründung zu C-4 nennt die fehlende Heizkostenrechnung. Erledigt.
- **V-2:** Die Formulierung entspricht dem Vorschlag in V-2. Zum fehlenden Test siehe C-12.
- **Weitere Prüfungen:**
  - Prettier meldet für die drei geänderten Code-Dateien keine Abweichung.
  - Das Delta ändert keine `messages/*.json`, keinen Bildschirm oder Zustand, keinen Vertrag in `tests/contracts`, keine E2E-Datei und keine Sicherheitsprüfung.
  - Nichts im Delta gehört nicht zum Auftrag.
  - Die Berichte unter `docs/reviews/` und `docs/design/personas/weber-issue-229.md` geben die Läufe wieder. Der Persona-Bericht hält offen fest, dass er das PDF nicht bewerten konnte. Der Plan behandelt den Lauf als wiederholungsbedürftig (`implementation_plan.md:32`), und der Punkt «Feature review» ist noch nicht abgehakt.
- **Szenario:** V-1 betrifft nur Abrechnungen, die unter #209 gespeichert wurden. Den E2E-Stack kann diesen Zustand nicht erzeugen, weil er jede Abrechnung mit dem heutigen Code erstellt. Das ist derselbe Fall wie die `No scenario`-Begründung zu F-3. Der pg-Test zeigt das Verhalten. Kein Befund.

## Nicht bestätigt

- Backend `statement-pdf.pg.test.ts` (35 pass), `bun run type-check` und `bunx fallow audit`: vom Aufrufer gemeldet. Ich habe sie nicht erneut ausgeführt, weil sie Backend-Tests gegen PostgreSQL sind und kein `vitest`.
- Dass der neue Test vor dem Fix mit «70.97 %» rot war: vom Aufrufer gemeldet. Nachvollzogen habe ich es nur aus dem Code: Ohne den Fix gibt `heatingOf` `stored.percent` aus.
- `deepcheck:audit`, lint und die Frontend-Tests für diesen Slice: vom Aufrufer nicht gemeldet und von mir nicht ausgeführt. Das Delta ändert keinen Frontend-Code.
- Wie das englische PDF mit «in total» aussieht (Zeilenumbruch): nicht geprüft. Kein Test erzeugt ein englisches PDF mit diesem Satz (siehe C-12).
- Wie viele Abrechnungen in der Produktion unter #209 gespeichert wurden: nicht prüfbar, es gibt keine Produktionsdaten.
