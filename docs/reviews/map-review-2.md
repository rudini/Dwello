# Code-Review #129 (Karte entfernen), Runde 2 (Abschluss vor dem Push)

Geprüft wurden `git diff 64c00a1 56c4d47` (Nit-Fixes C-1 bis C-3, Workflow-Notiz, Personas, Review-Bericht, Archivierung der Session) und der Merge-Commit b649e8e (`git diff 56c4d47 b649e8e`). Worktree `review-map-code2` auf b649e8e. Ich habe alle Dateien des Deltas gelesen. Vom Merge habe ich die Liste der geänderten Dateien gelesen, dazu `implementation_plan.md` und `docs/archive/implementation-plan-verlauf.md` ganz.

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-5 | Nit | `docs/archive/implementation-plan-verlauf.md` (Session #129, die letzten beiden Punkte) | «Before marking complete …» und «Pull request (Fixes #129)» sind schon abgehakt, obwohl der Push und der Pull Request noch ausstehen. Der Workflow verlangt die Archivierung vor dem letzten Commit, deshalb geht das nicht anders. Es ist aber vorweggenommen. |

Ponytail-Review: Lean already. Ship. Das Delta ändert drei Testnamen bzw. Titel und sonst nur Doku. Am Code gibt es nichts zu kürzen.

## Bestätigt

- **C-1:** Den Testnamen in `src/__tests__/tokens.test.ts:90` habe ich gelesen: Das Komma ist entfernt.
- **C-2:** Gelesen: `describe` in `src/__tests__/privacy-i18n.dom.test.ts:14` nennt jetzt auch Englisch.
- **C-3:** Gelesen: Der Szenariotitel in `tests/e2e/features/building-detail.feature:16` sagt jetzt «Detailseite», wie die Schritte. Die Schritte selbst sind unverändert, deshalb bleibt die Aussage zum Rot-Sehen aus Runde 1 gültig.
- **Merge b649e8e hat die Kartenentfernung nicht rückgängig gemacht:**
  - Die Merge-Seite von main ändert nur Dateien zu Abrechnungsnummer und PDF-Name (#97, #101), dazu Plan, Archiv und Reviews. In `src/` sind das ausschliesslich `statement*`-Dateien.
  - Ich habe `grep -rniE "leaflet|carto|mini-map|MiniMap|buildings_map|privacy_third_2|latitude|longitude"` über `src`, `messages`, `package.json`, `bun.lock`, `.env.example`, `deploy`, `docker-compose*.yml`, `svelte.config.js`, `vite.config.ts` und `src/styles` laufen lassen. Treffer gibt es nur noch an diesen Stellen:
    - in den Negativtests (`privacy-i18n.dom.test.ts:29–30`, `privacy-page.dom.test.ts:157–159`);
    - im unverwandten «MV leaflet» (`SettingsStep.svelte:28`);
    - in den API-Verträgen `tests/contracts/building*.json` (die DB-Spalten bleiben, richtig);
    - im E2E-Seed `tests/e2e/fixtures/backend.ts:122`;
    - in `privacy.feature:38`.
- **Konflikt in `docs/archive/implementation-plan-verlauf.md`:** Beide Sessions stehen vollständig darin, #97/#101 vor #129. `implementation_plan.md` ist byte-gleich mit origin/main (f562b75) und enthält keine Session. Das passt zu `open-work.test.ts` (höchstens eine Session).
- **Personas, Review-Bericht und Workflow-Notiz** sind reine Doku, das Lesen genügt.
  - In den Personas gibt es keinen Blocker und keinen Major. P-1 bis P-3 (Marco) betreffen den Routenlink und die Gebäudeliste, die schon vor der Änderung bestanden. Sie bleiben im Persona-Bericht.
  - Die Beobachtung von Dr. Weber zu fehlendem `noreferrer` betrifft den Google-Maps-Link der Gebäudeliste und nicht die Änderung. Sie hat keine ID.
- **Nichts Unverwandtes:** Das Delta enthält keine Formatierung und kein Refactoring von unberührtem Code.

## Nicht bestätigt

- Prüfungen auf b649e8e, alle vom Aufrufer gemeldet und nicht selbst wiederholt:
  - `bun run lint`
  - `bun run check`
  - `cd backend && bun run type-check`
  - `bunx vitest run` (157 Dateien, 2658 Tests)
  - E2E chromium+api auf `building-detail.feature` und `privacy.feature` (20 bestanden)

  Das Delta ändert nur Testnamen. Die Merge-Seite von main ist dort schon reviewt (`docs/reviews/w3b-review-*.md`). Deshalb habe ich nichts erneut ausgeführt.
- Die Merge-Seite von main (#97/#101) habe ich inhaltlich nicht erneut reviewt, nur darauf geprüft, ob sie Kartencode zurückbringt (sie tut es nicht).
- Ob der Kommentar zu #82 (R-1) in GitHub tatsächlich steht: nicht geprüft. Der Plan hakt ihn als erledigt ab.
