# Code-Review #135, Runde 3 (Delta)

Geprüft wurde `1dcc988..4931f65` im Worktree `review-135-code3` (detached auf 4931f65), dazu die offenen Befunde aus `docs/reviews/issue-135-review-2.md`. Alle 18 geänderten Dateien habe ich gelesen. Von den vier Persona-Berichten der Runde 2 nur die Befundtabellen, abgeglichen mit den Planzeilen. Zusätzlich gelesen: `src/lib/wizard-draft.ts`, der Script-Teil von `BuildingChoice.svelte`, `statements_step_*` in `messages/*.json` und die Schrittliste in `src/lib/statement-wizard.ts:23-29`. C-9 (fach-reviewer) bewerte ich auftragsgemäss nicht.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | – | tests/e2e/tasks/accessibility.ts:246-251, 297-302 | Behoben. Der Zustand `draft-dropped` schreibt den Entwurf mit `writeDraft` in einen `Storage`-Ersatz. `keepInLocalStorage` übernimmt Schlüssel und Wert unverändert. `wizard-draft.ts` hat keine Importe, deshalb lässt sich die Datei aus dem E2E-Code laden. `keepInLocalStorage` hat nur diesen einen Aufrufer (grep). |
| C-8 | – | src/__tests__/statement-endpoints.test.ts:173 | Behoben. `git diff 9952d96..4931f65` zeigt an dieser Stelle keine Änderung mehr. Übrig bleiben nur der neue Import und das neue `describe('GET /api/statements/billed')`. |
| C-10 | – | src/routes/statements/generate/BuildingChoice.svelte:48-86 | Behoben. Die ganze Karte ist wieder das `label` (`p-4`, `min-h-12`). Der Hinweis steht darin als `span` mit `basis-full`, also ohne Einzug über die volle Breite (Marco P-1). Der DOM-Test tippt auf den Hinweis und erwartet ein angekreuztes Kästchen (Marco P-3). |
| C-11 | – | implementation_plan.md:18-28 | Behoben. Für die Runde 2 gibt es Zeilen für den code-reviewer und alle vier Personas. Zu C-10 ist ein «DOM test red» notiert, zu Anna P-5 «DOM tests red on the old text». Der Status von C-7 ist in der Zeile von Runde 1 nachgeführt. |
| C-12 | – | src/lib/statement-wizard.ts:272-282 | Behoben. Die Schrittnamen kommen aus `statements_step_buildings` und `statements_step_settings` und werden als `{step}` eingesetzt, in allen vier Sprachen. Szenario (`statement-generate.feature:156`) und DOM-Asserts verlangen den neuen Text. |
| C-13 | Nit | messages/de.json:964-966 (fr/it/en gleich) | Die Schrittnummern «2» und «3» stehen fest im Text. Die Namen kommen dagegen aus der Schrittliste. Ändert sich die Reihenfolge in `statement-wizard.ts:23-29`, stimmt der Name, die Nummer aber nicht mehr. Das ist derselbe Grund wie bei C-12, nur halb behoben. Die Nummer könnte ebenfalls als Parameter kommen, etwa als Index der Liste + 1. |
| C-14 | Nit | src/__tests__/statement-wizard.dom.test.ts:996-1001 | Der Test prüft nicht mehr, dass der Name der Checkbox den Hinweis nicht enthält. Er prüft nur noch `aria-hidden="true"`. Das genügt, solange `aria-hidden` und `aria-describedby` zusammen bleiben. Ein Assert auf den berechneten Namen würde aber direkt zeigen, was Sven P-1 verlangt. Ausserdem fehlt vor dem Tipp ein Assert, dass das Kästchen leer ist. Wäre `b1` vorausgewählt, würde der Tipp es abwählen und der Test schlüge fehl. Mit einem leeren Kästchen als Ausgangslage hängt das Ergebnis also nicht an einer stillen Annahme. |
| C-15 | Nit | implementation_plan.md:29 | Der Workflow-Review ist abgehakt, aber code-reviewer, fach-reviewer (C-9) und PR sind noch offen. CLAUDE.md, Workflow 7, sieht ihn «at the end of the task» vor. Was diese Runden noch ergeben, fehlt darin, etwa die drei Persona-Runden für Textkorrekturen, die W-3 schon anspricht. Das Häkchen erst am Ende setzen oder die Datei dann nachführen. |

Kein neuer Blocker und kein neuer Major. C-9 (Major aus Runde 2) bleibt offen, bis der fach-reviewer in Runde 2 berichtet. Das liegt ausserhalb dieses Reviews.

## Bestätigt

- **Name und Beschreibung (Sven P-1 bleibt behoben).** Der Hinweis hat `aria-hidden="true"` und gehört deshalb nicht zum Namen, den das `label` liefert (accname, Schritt 2A). Weil er direkt über `aria-describedby` referenziert ist, bleibt er Teil der Beschreibung. `describedBy` setzt weiterhin `buildings-error` und `building-billed-<id>` zusammen (Script-Teil, unverändert).
- **Design.** `basis-full`, `flex-wrap`, `font-semibold` und `text-ink` sind Standard- bzw. Token-Klassen ohne beliebige Werte. `design-guard.test.ts` ist grün (siehe unten).
- **Texte.** Die drei geänderten Schlüssel sind in de, fr, it und en gleich gebaut: «Schritt/étape/passo/step» + Nummer + Name aus `{step}`. Die eingesetzten Namen stimmen mit `statements_step_*` überein (`messages/*.json:819-820`).
- **Abgrenzung.** Das Delta enthält keine fremde Umformatierung mehr, und unter `backend/` ist nichts geändert.
- **Selbst ausgeführt:** `bunx vitest run src/__tests__/statement-wizard.dom.test.ts src/__tests__/statement-wizard.test.ts src/__tests__/statement-endpoints.test.ts src/__tests__/design-guard.test.ts`: 4 Dateien, 458 Tests grün.

## Nicht bestätigt

- Diese Ergebnisse hat der Aufrufer auf 4931f65 gemeldet. Ich habe sie nicht wiederholt (vom Aufrufer gemeldet):
  - lint 0, check 0, `deepcheck:audit` ohne Ausgabe, fallow audit sauber;
  - test:coverage: 2430 passed, ohne unbehandelte Fehler;
  - E2E `statement-generate.feature` in chromium und api: 30 passed;
  - E2E a11y- und Sprachzeilen von statement-generate und contract-new draft-restored: 24 passed. Darunter ist auch der neue Weg über `writeDraft` im Zustand `draft-dropped` und der axe-Lauf auf dem `label` mit `aria-hidden`-Hinweis.
- Die roten Läufe zu C-10/Marco P-3 und Anna P-5 habe ich nicht nachgestellt, weil ich dafür Code ändern müsste. Plausibel sind sie trotzdem: Mit dem Hinweis ausserhalb des `label` (Stand 1dcc988) kreuzt ein Klick auf ihn nichts an, und die alten Texte enthalten kein «Schritt 2».
- Breite und Höhe der Karte bei 390 px (Marco P-1) habe ich nur aus den Klassen abgeleitet und nicht im Browser gemessen.
- C-9: auftragsgemäss nicht bewertet. Der fach-reviewer läuft in Runde 2.
- Die Persona-Berichte der Runde 2 habe ich nur in ihren Befundtabellen gelesen, nicht die Abschnitte «Beobachtungen».
