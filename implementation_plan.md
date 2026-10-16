# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: open points of «Rechnungen hochladen» (#233)

Branch `feat/upload-followups-233`. Issue #233 "Decided (product owner)" and "Done means" plus `CLAUDE.md`, "Workflow". Each point is fixed as its finding suggests; where it offers two ways, the simpler one.

Upload dialog (`src/lib/invoice-upload.ts`, `src/routes/invoices/*Upload*`):
- [ ] Count on the button (Helga P-1): counts rows without errors, adds «(1 unvollständig)»
- [ ] Notes of a row: title «Hinweise zu {Datei}» (Sven P-1, Helga P-4 round 2); required Kategorie first, «Prüfen Sie» only for unsure fields, «Ergänzen Sie, falls auf der Rechnung» for fields not found, none on a Sammelscan (Anna P-5, Helga P-4); a field filled in by hand is neither unsure nor missing (C-42)
- [ ] Sammelscan names a way forward (Anna P-3); Gutschrift says to create no invoice and to lower the invoice it belongs to (Weber P-3)
- [ ] «Dwello speichert die Datei jeder erstellten Rechnung als Beleg» (Weber P-4)
- [ ] After a partial create the result names the files still open (Anna P-2); the cancel question says created invoices stay (Anna P-4); `oncreated` after discarding tested (C-39)
- [ ] Links of created invoices named with their date (C-27)
- [ ] KI answers nothing readable: own code `EXTRACTION_UNREADABLE`, text and «Erneut versuchen» (V-14)
- [ ] Prompt: `nonAllocableItems` only besides operating costs (V-13)
- [ ] Screen reader: dialog described by its first sentence (Sven P-2), removing a file announced (Sven P-3), result of reading announced (Sven P-4), KI note first in the field description (Sven P-5); date error once in the accessibility tree (Anna P-9)
- [ ] Kategorie list there at once (Anna P-10)
- [ ] Preview opens large in a new tab (Helga P-3, Marco P-10)
- [ ] Comment of `valuesOf` above it (C-41)

Invoice pages:
- [ ] Hints of the upload kept with the Beleg and shown on the invoice page (Anna P-8): deducted Akonto, costs not allocable
- [ ] Rechnungsnummer in «Rechnung bearbeiten» (Helga P-4)
- [ ] Help of «Umlagefähig» follows the checkbox, also on «Neue Rechnung» (Marco P-6)
- [ ] «Beleg anzeigen (öffnet in neuem Tab)» visible (Helga P-5); help «Wählen Sie die Datei und klicken Sie dann auf …» (Helga P-6)
- [ ] Delete confirmation of a billed invoice with a Beleg: «Laden Sie den Beleg vorher herunter, wenn Sie ihn für die Belegeinsicht brauchen.» (M-6)

Elsewhere:
- [ ] «Rechnungen hochladen» in «Häufige Arbeiten» and in the Hilfe (Anna P-7)
- [ ] «KI» instead of «Sprachmodell» on the privacy page (Weber P-7)

Finish:
- [ ] `@wip` scenarios, red; `fach-reviewer` on them (legal text, KI prompt, domain hints)
  Scenario red (chromium, before the code): «Mehrere Rechnungen …» – created links without date; «Eine Datei mit mehreren Rechnungen» – old Sammelscan text; «Eine Gutschrift …» – old text; «Unsichere und nicht gefundene Angaben …» – received «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.»; «Nur vollständige Rechnungen …» – no «Wählen Sie eine Kategorie.» (category among «Prüfen Sie»); «Die KI antwortet nichts Lesbares» – received «Die KI ist nicht verfügbar …»; «Der Hinweis auf abgezogene Akontozahlungen …» – `invoice-document-hints` null; dashboard «Rechnungen von der Übersicht aus hochladen» – no quick action; help – section without the sentence; privacy – «KI» missing (says «Sprachmodell»); «Rechnungsnummer korrigieren» – `invoice-number-input` missing; «Nicht umlagefähige Kategorie wählen» – help testid null; «Beleg ersetzen» – help testid null; «Abgerechnete Rechnung mit Beleg löschen» – `invoice-delete-billed-document-note` null
  No scenario: the visible «(öffnet in neuem Tab)» (Helga P-5): Playwright reads a screen-reader-only text like a visible one, DOM test instead; screen-reader announcements and descriptions (Sven P-1..P-5, Anna P-9): DOM tests; the preview opened from an unsaved file (blob URL, Helga P-3, Marco P-10): DOM test; the Kategorie list at once (Anna P-10): DOM test
- [ ] Slice reviews (`code-reviewer`), feature review (personas, `fach-reviewer`)
- [ ] Before marking complete: all checks in `CLAUDE.md`
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-233.md`
