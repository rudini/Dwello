# Code-Review #57, Runde 1 (83994214..bd6d3e4e)

Gegenstand: «Entwurf» nur noch als Abrechnungsstatus, die Eingaben im Assistenten heissen «Ihre Angaben». Geprüft im Worktree `review-57-code` (detached bd6d3e4e). Alle 24 geänderten Dateien gelesen.

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `messages/fr.json:163` | `privacy_draft_notice` fr: vor der öffnenden Guillemet fehlt das Leerzeichen, an zwei Stellen: «de« Saisir un contrat de bail »» und «avec« Se déconnecter »» (od: `d e 302 253 302 240`). Der alte Text hatte «de « …». Das verletzt die fr-Typografie (`docs/design/i18n-begriffe.md:5`, Fachreview V-6). Kein Test prüft den fr-Text. Korrektur: `de « Saisir`, `avec « Se déconnecter` (normales Leerzeichen davor, U+00A0 innen bleibt). |
| C-2 | Nit | `docs/design/offene-punkte.md:23`, `:31` | U-25 sagt noch «… «Entwurf gespeichert» in the wizard mistaken for statement drafts is #57 (Helga P-4)», und U-16 nennt «Entwurf gespeichert» (Helga H8). Mit `Fixes #57` ist der Teil in U-25 erledigt, und den Text gibt es nicht mehr: beim Schliessen nachführen. |
| C-3 | Nit | `tests/e2e/features/privacy.feature:26-27`, `tests/e2e/steps/app-frame.steps.ts:109` | Der Step heisst «… bis zum Speichern, Verwerfen oder Abmelden …», prüft aber auch «oder die Abrechnungen erstellen» (R-2). Der Name des Steps nennt nur einen Teil dessen, was er prüft. |
| C-4 | Nit | `tests/e2e/steps/contract-form.steps.ts:31` | Der Step für beide Assistenten «… dass seine Angaben wiederhergestellt sind» importiert `restoredDraftText` aus `questions/statement-generate`. Die Frage gehört zu beiden Assistenten, also eher in ein gemeinsames Modul neben `targets/wizard.ts`. Ponytail: sonst schlank (die doppelte `Visibility`-Frage `draftRestoredShown` ist entfernt, netto keine weitere Kürzung möglich). |

## Blocker/Major

Keine.

## Bestätigt (Anforderung gegen Code und Test)

- «Entwurf» nur noch für den Abrechnungsstatus: `messages/de.json` enthält «Entwurf» nur noch in Status- und Abrechnungstexten (grep über alle Schlüssel). In `src/lib` steht kein fest codiertes «Entwurf». In fr/it/en kommen «brouillon/bozza/draft» in den `ui_draft_*`-Texten nicht mehr vor. Die Tests `ui-feedback.dom.test.ts` (`not.toContain('Entwurf')` für Statusvermerk und Hinweis) und `privacy-page.dom.test.ts` (`not.toContain('Entwurf')`) decken das ab.
- «Angaben wiederhergestellt» / «Angaben verwerfen» in beiden Assistenten: `ui_draft_restored` in allen vier Sprachen geändert, `ui_draft_discard*` war schon richtig. Die gemeinsamen `DraftNotice` und `SaveStatus` stecken in `ContractWizard.svelte` und `StatementWizard.svelte`. Szenarien: `contract-new.feature:91-107`, `statement-generate.feature:378-390`.
- Der Hinweis sagt «nur in diesem Browser, noch nicht gespeichert»: `ui_draft_saved` (während der Eingabe) und `ui_draft_back` (nach dem Wiederöffnen, V-2) in allen vier Sprachen. Neue Szenarien «… noch nicht gespeichert» für beide Assistenten, Step gegen `save-status` (Text-Frage, `expect.poll`). Wiederhergestellt: Step gegen `draft-restored`.
- `help_tenants_3` (V-4: «sie» statt zweimal «Ihre Angaben») und `privacy_draft_notice` (R-1 Zweck, R-2 «Mietvertrag speichern oder Abrechnungen erstellen», R-3 «Beträge, Daten und die Auswahl von Mieter und Wohnung») in allen vier Sprachen. Szenarien: `help.feature:23-24` (ganzer Text), `privacy.feature:26-27` (Teilstring).
- V-1: `SaveStatus.svelte:13` zeigt `info` statt `success`. Der DOM-Test prüft, dass der Pfad des Häkchens fehlt. `icons.success` = CircleCheck, das erste `d` ist der Haken, also fiele der Test mit dem alten Icon.
- V-5 `gallery_toast_info`, V-7 fr/it Zeitangabe, V-8 it «suoi/suo» und «finché non»: übernommen. V-6: U+00A0 innen stimmt, aussen fehlt es (C-1).
- `UBIQUITOUS_LANGUAGE.md` ist nicht geändert. `screens.json`: nur die Bedeutungstexte bestehender Zustände sind angepasst. Es gibt keinen neuen Bildschirm oder Zustand, also braucht es keine neuen Zeilen in `accessibility.feature`/`sprachen-bildschirme.feature`.
- Rote Tests (beim Lesen geprüft): Alle neuen und geänderten Erwartungen (DOM: «Noch nicht gespeichert», «Angaben wiederhergestellt», «Sie sind nur in diesem Browser …», Privacy-Teilstrings, kein Häkchen; E2E: Statusvermerk, wiederhergestellt, Hilfe-Volltext, Privacy) suchen Texte, die es auf 83994214 nicht gibt. Sie schlagen also ohne die Änderung fehl.
- Screenplay: Die Steps rufen nur Fragen und Tasks auf. Die Fragen liefern Text, nicht ja/nein. Die Tasks `reopenNewContract`/`reopenStatementWizard`/`restoreDraft` warten weiter auf den Statusvermerk, bevor sie neu öffnen. Die Features beschreiben, was der Verwalter erfährt, nicht wie er klickt.
- Nichts Fremdes im Diff: Plan, Fachreview-Bericht, Texte, ein Icon, Tests.
- Sicherheit, Design-Tokens, API-Verträge: nicht betroffen (keine neue Klasse, keine Antwort geändert).

## Nicht bestätigt

- Selbst neu ausgeführt: `bunx vitest run src/__tests__/{ui-feedback,privacy-page,contract-wizard,statement-wizard}.dom.test.ts`, 4 Dateien, 152 Tests grün.
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run` (3025 Tests), E2E chromium für contract-new, statement-generate, privacy, help (126), a11y-/Sprachzeilen `draft-restored|draft-discard-dialog|draft-dropped` (16) und Privacy-Sprachzeilen.
- Ob die neuen Tests vor der Umsetzung wirklich rot liefen: nur beim Lesen beurteilt, kein Lauf auf dem Commit mit den `@wip`-Szenarien.
- Ob der längere Statusvermerk bei 390 px gut umbricht (Zeile `flex items-center gap-2`): nicht angesehen. Laut Aufrufer laufen die axe-Zeilen von `draft-restored` grün, ein Prüfung auf seitliches Scrollen gibt es dort nicht.
- Die Qualität der fr/it/en-Formulierungen über die Fachreview-Vorschläge hinaus habe ich nicht mit einem Muttersprachler geprüft.
