# Code-Review #176 Slice 3, Runde 3 (Delta), und Slice 5, Runde 1

Worktree `review-176-s3-r3` auf `194a28a`. Geprüft sind `3f9e780` (Behebungen aus Runde 2) und `194a28a` (Slice 5). Alle geänderten Dateien habe ich gelesen, auch `implementation_plan.md` und die Prosa-Dokumente. `docs/reviews/176-s3-review-2.md` und `176-fachreview-2.md` habe ich nur als Berichte gelesen. `b6fcbe6` ist laut Aufrufer ein Merge ohne Konflikt im App-Code und nicht Teil dieses Reviews. Zusätzlich gelesen: `CategoryForm.svelte` und `SaveForm.svelte` vollständig, `Button.svelte`, `focus-error.ts`, `DistributionKeyForm.svelte`, `HeatingProfileForm.svelte` (beide nutzen `SaveForm`), `new/+page.svelte`, `new/+page.server.ts`, `src/lib/server/category.ts` (`proposeAllocability`), `backend/src/config/llm.ts` (`categoryLines`, beide Prompts), `tests/e2e/steps/app-frame.steps.ts` (Schritt zum Datenschutz) und `enhance` aus `@sveltejs/kit` 2.70.3 (`src/runtime/app/forms.js`).

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| E-19 | Nit | `src/routes/config/categories/CategoryForm.svelte:100-116` | Zwei `{#if action}`-Blöcke folgen direkt aufeinander. Ein einziger Block reicht. |
| E-20 | Nit | `CategoryForm.svelte:90,113` | Die Status-Region ist vor dem ersten Vorschlag leer, bleibt aber ein Flex-Element in `gap-4`. Unter «Von der KI prüfen lassen» stehen deshalb 16 px Abstand zusätzlich zum `gap-8` des Formulars. Wenn die Region in das `<div>` des Knopfs verschoben wird, fällt der Leerraum weg. |
| E-21 | Minor | `implementation_plan.md:31` | Die Zeile `Skills: tdd, ponytail, ponytail-review` nennt nur die Slices 1 bis 3. Für Slice 5 und die Behebungen aus Runde 2 (`3f9e780`) fehlt der Vermerk. Beide Commits ändern Code. |
| E-22 | Nit | `messages/fr.json:132`, `messages/it.json:132` | «pour que l’IA propose si ses frais sont imputables» ist kein idiomatisches Französisch, «proposer si» ist ungewohnt. Besser: «indique si». Im Italienischen ist «affinché l’IA proponga se» ebenso holprig. |

Keine Blocker, keine Majors.

## Frühere Befunde (Runde 2)

| ID | Status | Beleg |
|----|--------|-------|
| E-11 (Major) | behoben | Der Fenster-Listener ist entfernt (`SaveForm.svelte`). Enter löst wieder die implizite Übermittlung des Browsers aus. Ist der Standardknopf deaktiviert, sendet sie nicht, ein zweites POST entsteht also nicht. |
| E-5 | Ablehnung trägt | Enter in einem beliebigen Feld des Formulars «Neue Kategorie» startet jetzt die KI-Prüfung, weil der Prüfknopf der erste Submit-Knopf im Baum ist. Die Prüfung speichert nichts, und während sie läuft, ist der Knopf `busy` und damit deaktiviert. Ein zweites Enter wirkt dann nicht. Das ist dasselbe Muster wie bei «Formel testen». Beim Bearbeiten gibt es keinen Prüfknopf, dort speichert Enter. |
| E-12 | behoben | `SaveForm.svelte:47-55`: Jede Antwort setzt nur ihre eigene Markierung (`check`) zurück. Die Markierung wird beim Absenden festgehalten, sie hängt also nicht an der Antwort. `enhance` bricht eine laufende Anfrage nicht ab, wenn eine zweite startet (`forms.js:152-203`: ein eigener `AbortController` pro Absenden, kein Abbruch der vorigen Anfrage). Darum läuft jeder Callback und kein Flag bleibt hängen. Test «zeigt das Speichern weiter als laufend …» ist grün. |
| E-13 / E-3 | behoben | `CategoryForm.svelte:111-116`: Die Region `role="status"` existiert, sobald `action` gesetzt ist, also vor der ersten Antwort. `CategoryProposal.svelte` hat keine eigene Rolle mehr, Regionen sind nicht mehr verschachtelt. Test «hält den Bereich … bereit» ist grün. |
| E-14 | behoben | Kein Enter-Handler mehr. Im Verteilschlüssel löst Enter in «Formel» wieder «Formel testen» aus, wie vor dem Slice. |
| E-15 | behoben | `SaveForm.svelte:56-58`: `focusFirstError` wartet `tick()` ab, danach ist der Prüfknopf wieder aktiv. Der Fokus geht nur dann auf ihn zurück, wenn er auf `body` gefallen ist. Eine Ablehnung des Namens (400) setzt den Fokus also weiterhin aufs Feld. «Formel testen» ist nie `busy`, verliert den Fokus also nicht und ist nicht betroffen. Test «setzt den Fokus nach der Prüfung …» ist grün. |
| E-16 | Ablehnung trägt | Dieselbe Ablehnung trifft auch beim Speichern ein. |
| E-17 | Ablehnung trägt | Dieser Test schützt vor einer Regression und kann gegen den Code vor E-1 nicht rot gewesen sein. Die Begründung steht im Plan. |
| E-18 | behoben | Mit E-11 entfallen. |

## Slice 5: geprüfte Anforderungen

- Die Texte `privacy_llm_external` und `privacy_llm_local` nennen in allen vier Sprachen die Kategorien, die jede Rechnungskategorisierung mitschickt, und die Daten der KI-Prüfung. Beides stimmt mit dem Code überein. `categoryLines` (`llm.ts:82-89`) schickt Schlüssel, deutschen Namen und Beschreibung jeder Kategorie mit. `buildAllocabilityPrompt` schickt Name und Beschreibung aus dem Formular. Tests in `privacy-page.dom.test.ts:22-46` (grün). Szenario «KI auf dem Server des Betreibers» ist ohne `@wip`, der Schritt (`app-frame.steps.ts:83-89`) passt zum neuen deutschen Text («verlassen dafür den Server nicht», «neue Kategorien»). Im Plan steht «Scenario red».
- Der Hilfesatz zu Wasser und Abwasser steht in allen vier Sprachen. Test `categories-page.dom.test.ts:202` ist grün.
- Die Anweisung im Prompt («Zitiere den Artikel …») und der Satz zur Verwaltungspauschale (nur im Vorschlags-Prompt) sind mit `llm-prompt.test.ts` und `category-allocability.pg.test.ts` abgedeckt. Die alte Anweisung ist ersatzlos entfernt.
- Die Doku stimmt mit `LEGAL_BASIS` überein (`api-specification.md:103`, `nebenkostenabrechnung-anforderungen.md:29`: Art. 4 Abs. 3, 5 Abs. 1–2, 6, 6a, 6b, 6c Abs. 3 VMWG, nachgezählt in `llm.ts:48-70`). Die Begriffszeile in `i18n-begriffe.md:42` passt zu den Hilfetexten in fr («maintenance»), en («servicing») und it («manutenzione»).
- Keine neuen Schlüssel, keine neuen Bildschirme oder Zustände. Die Einträge in `screens.json` und den a11y-Features sind nicht betroffen.

## Nicht bestätigt

- Selbst ausgeführt und grün: `bunx vitest run` für `categories-page.dom.test.ts`, `privacy-page.dom.test.ts`, `distribution-keys-pages.dom.test.ts`, `heating-profiles-pages.dom.test.ts` und `focus-error.dom.test.ts` (5 Dateien, 71 Tests). jsdom meldet dabei «Not implemented: requestSubmit», das stammt von den Klick-Tests.
- Vom Aufrufer gemeldet, nicht von mir wiederholt: lint, `bun run check`, `deepcheck:audit`, das Fallow-Gate, `test:coverage` (151 Dateien / 2370 Tests), Backend-Tests (579) samt `llm-prompt.test.ts` und `category-allocability.pg.test.ts`, `type-check` und die E2E-Läufe auf Chromium (Kategorien, Verteilschlüssel, Datenschutz, Bildschirmzeilen).
- Dass die Tests rot waren, die der Plan aufführt (`implementation_plan.md:24`, Zeilen zu Runde 2 und fach-reviewer Runde 2), habe ich nicht nachvollzogen.
- Für den Text bei externem Anbieter (`privacy_llm_external`) gibt es nur den DOM-Test. Ob die E2E-Umgebung einen externen Anbieter einstellen kann, habe ich nicht geprüft. Fachlich und rechtlich geprüft hat die Texte der fach-reviewer (Runde 2), nicht ich.
- Wie Screenreader die Region ansagen (E-13), habe ich nur aus dem Code abgeleitet und nicht ausprobiert.
- Das noch nicht committete `docs/design/tools/persona-stack.sh` liegt nicht im Worktree und ist nicht geprüft.
