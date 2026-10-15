# Code-Review #185 Runde 1 und Delta-Review #186 Slice A Runde 2

Gegenstand: `b98b5ba..cc56c43` (ein Commit `cc56c43`, Worktree `review-185-code`).
Anforderung:
1. #185: Die Hinweise `invoices_category_not_allocable_text` und `invoices_legal_text` nennen die Gebäudeversicherung statt «Versicherungen». «umgelegt» ersetzt «übertragen» (H-19). Der Rechtshinweis im Rechnungsdetail sagt, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst, statt das Gesetz als Grund zu nennen (H-11).
2. Delta zu `docs/reviews/186a-review-1.md`: J-2 (Test für abgeschaltete KI), J-4, J-5, J-7 behoben; J-1 (Test nutzt jetzt den Vertrag), J-3, J-6 mit Begründung abgelehnt.

Ergebnis: kein Blocker, kein Major.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| K-1 | Nit | `src/routes/invoices/[id]/+page.svelte:110`, `messages/de.json:774` (`invoices_legal_title`) | Der Titel «Schweizer Mietrecht» bleibt über dem Hinweis. Er rahmt den Text weiter als rechtliche Begründung, auch für eine Rechnung, die der Liegenschaftsverwalter selbst ausgeschlossen hat. Genau das wollte H-11 vermeiden. Der Text selbst ist korrigiert. Der Titel war nicht Teil des Vorschlags von H-11; sinnvoll wäre eine Rückfrage beim `fach-reviewer` in der Feature-Review. |
| K-2 | Nit | `messages/fr.json:738,775`, `messages/it.json:738,775` gegenüber `backend/migrations/0002_stammdaten.sql:31` | Der Text sagt «assurance du bâtiment» bzw. «assicurazione dell’edificio». Die vordefinierte Kategorie heisst aber «Assurance bâtiment» bzw. «Assicurazione edificio». Das ist sprachlich korrekt, nennt aber nicht wörtlich die Kategorie, die der Liegenschaftsverwalter in der Liste sieht. Bei «impôt foncier» / «imposta immobiliare» und im Englischen stimmt es überein. |

## Bestätigt durch Code und Test

- #185, Text bei der Kategorie: Gebäudeversicherung und «umgelegt» stehen in allen vier Sprachen. Der DOM-Test `invoice-pages.dom.test.ts` («sperrt „Umlagefähig“ …») prüft den ganzen deutschen Satz bei `invoice-category-warning`. Der Schritt in `invoice-form.steps.ts:101` folgt «umgelegt».
- #185, H-11 und H-19: `invoices_legal_text` sagt in allen vier Sprachen «fliesst nicht in die Nebenkostenabrechnung ein». Statt «Steuern» steht «Liegenschaftssteuer», die Artikel stehen in Klammern, wie in H-11 vorgeschlagen. Die Begriffe passen zu `UBIQUITOUS_LANGUAGE.md` (Z. 63, 80). Die Bedingung `!invoice.isValidUtilityCost` (`+page.svelte:108`) gilt unverändert für jeden Grund des Ausschlusses, also auch für eine selbst ausgeschlossene Rechnung. Dafür gibt es den neuen DOM-Test «erklärt, dass eine nicht umlagefähige Rechnung nicht abgerechnet wird». Das Szenario «Nicht umlagefähige Rechnung» (`invoice-detail.feature:22`) ist neu formuliert, ohne `@wip`, und sagt, was der Verwalter erfährt. Die Question liefert den Text selbst (`sees(tenancyLawNote).toContain(…)`). Im Plan stehen «Scenario red», «Test red» und «Skills» (`implementation_plan.md:17`).
- Keine alten Texte mehr in `src`, `tests` oder `messages`: Per grep nach «übertragen», «umlegbar» und `ki-no-proposal` finden sich nur der Plan und der ältere Persona-Bericht `docs/design/personas/weber-7.md:48` (Verlauf, gehört nicht zum Diff).
- J-2: `category-allocability.pg.test.ts` startet einen Anbieter, der sicher antwortet, und setzt `llmConfig.enabled = false`. Der Test erwartet 503 `KI_PROPOSAL_UNAVAILABLE` und `llm.prompts` leer. Ohne die Zeile `llm.service.ts:216` kämen 200 und ein Prompt zurück, der Test würde also rot. `enabled` wird im `finally` aus `configured` zurückgesetzt (Standard `LLM_ENABLED !== 'false'`, `config/llm.ts:24`).
- J-1: Der Test nutzt `tests/contracts/validation-refused.json` (`{ error, code: 'VALIDATION_ERROR', params }`) statt eines erfundenen Bodys. Die Ablehnung des Verhaltens selbst ist begründet und als Minor zulässig.
- J-3: Der Hinweis steht an der Fixture (`tests/e2e/fixtures/backend.ts:271-272`). «Schneeräumung» kommt in `tests/e2e/features` nur in `categories.feature` vor, und keine Rechnung der E2E-Fixtures nutzt sie. Die Ablehnung hält.
- J-4, J-5: Plan-Zeilen 20 und 21/22 sind korrigiert bzw. aufgeteilt.
- J-6: `accessibility.ts:72` hat ein eigenes `askKi`. Der Präfix steht nur dort und in `tasks/categories.ts:44`. Die Ablehnung ist vertretbar.
- J-7: `ki-unsure` ersetzt `ki-no-proposal` in `screens.json` (Beschreibung und Zeile), `accessibility.feature:136`, `sprachen-bildschirme.feature:137` und `tasks/accessibility.ts:186`. Es bleibt kein Rest.
- Plan-Zeilen der Reviews: H-11 und H-19 sind bei fach-reviewer Runde 1 von «open work»/«open» zu «fixed» verschoben. Die Zeile code-reviewer Runde 1 nennt alle J-IDs.
- Im Diff steht nichts ausserhalb der Anforderung. `docs/reviews/186a-review-1.md` ist die Ablage des Berichts aus Runde 1.

## Nicht bestätigt

- Von mir erneut ausgeführt und grün: `bunx vitest run src/__tests__/invoice-pages.dom.test.ts src/__tests__/categories.test.ts src/__tests__/open-work.test.ts` (70 Tests).
- «vom Aufrufer gemeldet», nicht erneut ausgeführt: `bun run lint`; Backend-Test `category-allocability.pg.test.ts` samt Rot durch Herausnehmen der `enabled`-Prüfung; `deepcheck:audit`; E2E «Nicht umlagefähige Rechnung» (rot mit alten, grün mit neuen Texten); Bildschirmzeilen invoice-new/invoice-detail; «… nicht umlagefähige Kategorie wählen».
- Ob die Übersetzungen der Artikelangaben («Art. 256 al. 1», «cpv. 1», «para. 1») und «impôt foncier»/«imposta immobiliare» den Begriffen in `docs/design/i18n-begriffe.md` folgen: Die Liste führt diese Begriffe nicht. Abgeglichen habe ich nur mit den Kategorienamen der Migration `0002_stammdaten.sql` (siehe K-2).
- Die rechtliche Richtigkeit der Artikelangaben habe ich nicht geprüft. Sie stammt aus dem Vorschlag in H-11 (`docs/reviews/186-fachreview-1.md:135`) und wird wörtlich übernommen.
