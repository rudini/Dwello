# Code-Review #66, Runde 2 (a65a2c03..cb6ce6e2)

Worktree: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/review-66-code2` (detached cb6ce6e2). Alle 11 geänderten Dateien gelesen (`git diff a65a2c03 cb6ce6e2`).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `messages/de.json:683-684` (ebenso fr/it/en:683-684) | Die zwei neuen Sätze sind eine neue fachliche Anleitung («Dwello übernimmt Änderungen sofort, auch für die Zeit, die noch nicht abgerechnet ist» und «Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt»). Kein Fach-Review hat sie gesehen. `docs/reviews/66-fachreview-2.md` prüft a65a2c03, also den Stand vor dem Fix. Beim Akonto führt die Anleitung zu einer falschen Abrechnung (siehe unten). |
| C-2 | Nit | `implementation_plan.md:16` | Der Punkt «Fach review round 2, feature review (personas …)» ist offen, obwohl die Berichte `66-fachreview-2.md`, `weber-66.md` und `helga-66.md` im Commit liegen. Laut Skill `slice-review`, «Triage» 3, braucht jede Review-Runde einen eigenen Punkt, der ihren Bericht nennt. Auch der P-1-Fix fehlt im Plan. |
| C-3 | Nit | `src/__tests__/contract-edit.dom.test.ts:154` | Der Testname «…dass Änderungen sofort gelten» passt nicht mehr ganz zum neuen Text «Dwello übernimmt Änderungen sofort». Der Test besteht trotzdem, weil er nur «Laufender Mietvertrag» prüft. |

Rundenbefunde aus Runde 1:
- C-4 ist behoben: `contract-new.feature:157` endet jetzt mit einem Zeilenumbruch.
- C-5 ist behoben: Im Plan steht jetzt «Refs #66».

Ponytail-Review: Schlank, ausliefern. Der Fix ändert nur zwei Schlüssel pro Sprache und fügt zwei Assertions in einen bestehenden `it.each` ein. Kein neuer Code, keine neue Struktur. net: -0 lines possible.

## C-1 (Major): Neue fachliche Anleitung ohne Fach-Review, beim Akonto irreführend

**Warum falsch.** `CLAUDE.md`, Workflow 5, verlangt `fach-reviewer`, wenn sich nach dem Review von Schritt 1 Fachregeln oder Rechtstexte ändern. Die neuen Sätze sagen dem Liegenschaftsverwalter, wann er eine Mietzinserhöhung in Dwello eintragen soll und wie Dwello rechnet. Das ist eine Fachregel und keine Übersetzungskorrektur. Die Ausnahme in `slice-review`, «Triage» 2, gilt nur für «a wording fix of a translation that a reviewer named and checked». Der letzte Fach-Review (`docs/reviews/66-fachreview-2.md:1`, «Commit a65a2c03») ist älter als dieser Text.

Inhaltlich ist die Anleitung beim Akonto falsch:
- `backend/src/services/calculation.service.ts:408-413` und `:231-249` rechnen für die ganze Überlappung von Mietvertrag und Abrechnungsperiode mit **einem** Betrag `monthlyAdvancePayment`, nämlich dem heute gespeicherten.
- Weber P-3 (`docs/design/personas/weber-66.md:96`) und Fach-Review Runde 1 (V-1, #90) zählen eine Akontoerhöhung zur einseitigen Vertragsänderung nach Art. 269d OR. Für den Liegenschaftsverwalter fällt sie also unter «Mietzinserhöhung».
- Folgt er der Anleitung und trägt das höhere Akonto erst «wenn sie gilt» ein, etwa am 1.7., dann rechnet Dwello in der nächsten Abrechnung die Monate Januar bis Juni trotzdem mit dem neuen Betrag. Der Mieter bekommt dann ein zu hohes Akonto gutgeschrieben, und der Saldo ist zu tief.
- Der erste Satz sagt zwar ehrlich «auch für die Zeit, die noch nicht abgerechnet ist». Der Schlusssatz verspricht aber, dass der richtige Zeitpunkt reicht. Die Lücke aus #90 (Option 3, «Betrag ab {Datum}», noch nicht umgesetzt) bestand schon. Der neue Text macht sie aber sichtbarer und gibt eine Handlungsanweisung, die in sie hineinführt.

**Wie zeigen.**
1. Einen unbefristeten Mietvertrag mit Akonto 200 ab 1.1. anlegen.
2. Am 1.7. auf der Bearbeitungsseite das Akonto auf 300 setzen, so wie es der Hinweis rät.
3. Die Abrechnung für 1.1.–31.12. erstellen: `totalAdvancePayments` ist 3600 statt 3000.

Lösung: Den Text `fach-reviewer` vorlegen. Der Schlusssatz sollte sich entweder auf die Nettomiete beschränken oder für das Akonto auf #90 verweisen bzw. einen Marker `TODO(fachlich prüfen, #90)` bekommen. Danach erst pushen.

## Bestätigt

- **P-1-Fix, Inhalt:** In beiden Varianten (`contracts_running_text`, `contracts_running_text_fixed_term`) stehen der neue erste und der neue letzte Satz in de, fr, it und en. Die Regel zu Art. 269d OR bzw. #76 in der Mitte ist unverändert, deshalb gilt die Prüfung aus `66-fachreview-2.md` für diesen Teil weiter. Die Begriffe stimmen mit `docs/design/i18n-begriffe.md:59,61` überein (décompte/décompter, conteggio/conteggiato, billed). Die Anrede ist «Sie» bzw. «Saisissez», «Inserisca».
- **Aussage «auch für die Zeit, die noch nicht abgerechnet ist»:** Sie stimmt mit dem Code überein. Gespeicherte Abrechnungen halten ihre Beträge fest (`statement.service.ts:413`, `:492` protectedFields; `statement-pdf.service.ts:136` liest den gespeicherten Wert). Offene Perioden rechnen mit dem aktuellen Betrag (`calculation.service.ts:408`).
- **Test:** `contract-edit.dom.test.ts:173-175` prüft beide neuen Sätze in allen drei Fällen (unbefristet, gekündigt, befristet). Ohne die Textänderung schlägt der Test fehl, denn die Strings gab es vorher nicht (siehe Grep: Sie kommen nur in `messages/de.json:683-684` und im Test vor). Den Test habe ich erneut ausgeführt: `bunx vitest run src/__tests__/contract-edit.dom.test.ts`, 46 bestanden.
- **E2E:** Die Steps `contract-form.steps.ts:442-453` prüfen Teilstrings der unveränderten Mitte («frühestens auf den nächsten Kündigungstermin», «mit dem amtlichen Formular», «erst nach dem Vertragsende möglich»). Sie bleiben also gültig. Der neue Wortlaut ist nur eine Verfeinerung eines schon abgedeckten Hinweises. Nach `slice-review`, «Triage» 2, genügt dafür der Test auf der tieferen Schicht.
- **a11y/Sprachen:** Es gibt keinen neuen Bildschirm und keinen neuen Zustand, nur einen anderen Text im bestehenden `Alert` (`contract-edit`). Alle vier Sprachen sind gepflegt.
- **Berichte:** `docs/reviews/66-review-1.md`, `66-fachreview-2.md` und `docs/design/personas/{weber,helga}-66.md` liegen an den Orten, die die Skill `slice-review` verlangt. Es gibt keine Änderungen, die nicht zur Aufgabe gehören.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht wiederholt:
  - `bunx vitest run` für i18n und contracts-i18n
  - Commit-Hooks (fallow, deepcheck, commit subject)
  - `bun run lint`, `bun run check` und E2E auf a65a2c03
  
  Nur contract-edit.dom habe ich selbst ausgeführt.
- Ob ein Persona-Durchgang für den neuen Text nötig ist, habe ich nicht geprüft. Laut `slice-review`, «Triage» 2, braucht ein neuer Text einen Durchgang der Personas Weber und Helga. Dazu gibt es im Diff keinen Bericht.
- Die Triage der übrigen Persona-Befunde (Weber P-2 bis P-6, Helga P-2 bis P-5) habe ich nicht bewertet. Sie gehört dem Aufrufer.
- Ob die Nettomiete in Dwello irgendwo zeitabhängig verrechnet wird: Ich habe nur `calculation.service.ts` und die Statement-Services gelesen. Dort kommt die Nettomiete in der Abrechnung nicht vor.
