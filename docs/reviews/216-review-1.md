# Code-Review #216 Runde 1

Gegenstand: `cc56c43..f50d112` (ein Commit `f50d112`, Worktree `review-216-code`), dazu die fr/it-Korrektur K-2 aus `docs/reviews/185-review-1.md`.

Anforderung (#216, Entscheid B zu #184):
1. Bei abgeschalteter KI (`LLM_ENABLED=false`) sagt die Datenschutzerklärung «Rechnungen und Kategorien werden nicht von einem Sprachmodell bearbeitet.» statt des Textes zur lokalen KI; die Texte zur lokalen und externen KI bleiben.
2. README «External LLM provider»: nur Anbieter in der Schweiz oder in einem Land mit angemessenem Schutz (Art. 16 Abs. 1 DSG, DSV Anhang 1; USA nur DPF), keine Standardvertragsklauseln mehr (Wortlaut H-2/H-18 aus `docs/reviews/186-fachreview-1.md`).
3. No scenario: E2E-Stack läuft mit eingeschalteter KI; `GET /api/v1/invoices/llm-recipient` liefert neu `enabled`, Vertrag `tests/contracts/llm-recipient.json`.

Ergebnis: kein Blocker, kein Major.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| L-1 | Minor | `implementation_plan.md:18` | #216 ist abgehakt, obwohl «Done means» von #216 verlangt, dass der neue Text der Datenschutzerklärung (Rechtstext, vier Sprachen) vom `fach-reviewer` geprüft wird. Im Plan steht keine Runde des `fach-reviewer` zu `privacy_llm_off`. Die Runde 1 (`186-fachreview-1.md`) hat nur den README-Entwurf gesehen. Entweder offen lassen, bis die Feature-Review gelaufen ist, oder die offene Fachreview im Punkt nennen. |
| L-2 | Minor | `messages/fr.json:739,776`, `messages/it.json:739,776` (K-2) | Die Korrektur K-2 ändert Texte, die der Benutzer sieht. Laut Workflow 6 braucht sie zuerst einen roten Test. Es gibt keinen: Ein grep nach «assurance bâtiment» / «assicurazione edificio» findet in `src` und `tests` keinen Treffer. Im Plan fehlt auch eine `Test red`-Zeile für K-2. |
| L-3 | Nit | `src/routes/privacy/+page.server.ts:14`, `src/routes/privacy/+page.svelte:12` | `enabled?: boolean` ist optional, obwohl das Backend das Feld immer sendet (`backend/src/app.ts:69`, Vertrag). Wegen des optionalen Typs muss die Seite `=== false` prüfen. Fehlt das Feld, erscheint stillschweigend der Text zur lokalen KI. Mit `enabled: boolean` (die Tests nutzen ohnehin `as never`) wäre der Typ so eng wie der Vertrag. |
| L-4 | Nit | `messages/fr.json:1102`, `messages/it.json:1102` (`categories_allocable_help`) | Hier steht weiter «assurance du bâtiment» / «assicurazione dell’edificio». Nach K-2 nennen also zwei Texte die Kategorie wörtlich, einer nicht. Das liegt ausserhalb dieses Slices, denn der Hilfetext gehört zu #186 Slice B. Es ist nur als Hinweis für dort gedacht. |

## Bestätigt durch Code und Test

- Anforderung 1: `+page.svelte:11-17` zeigt bei `enabled === false` `m.privacy_llm_off()`, sonst wie bisher den externen oder den lokalen Text. Diese beiden Texte sind unverändert. Der DOM-Test `privacy-page.dom.test.ts` («sagt bei abgeschalteter KI …») prüft den ganzen deutschen Satz, wortgleich mit der Anforderung. Die bestehenden Tests zu lokal/extern bleiben unverändert. Der neue Schlüssel steht in allen vier `messages/*.json` und hat keinen deutschen Rest in fr/it/en. Die Anrede ist neutral (Passiv).
- Backend: `app.ts:69` liefert `enabled: llmConfig.enabled`. `llmRecipient()` gibt bei abgeschalteter KI schon `null` zurück (`config/llm.ts:37`), extern und aus kann also nicht gleichzeitig vorkommen. `invoice-categorization.pg.test.ts` («sagt, wenn die KI abgeschaltet ist») setzt `enabled` im `finally` zurück. Drei bestehende Erwartungen sind um `enabled: true` ergänzt. Die Route ist weiter öffentlich und liefert nur Anbieter, Land und einen Wahrheitswert (Test «nie den API-Key»), es fliessen also keine Daten ab.
- Vertrag: `tests/contracts/llm-recipient.json` ist neu. `api-contracts.pg.test.ts` prüft ihn mit `drift` gegen die echte API (externer Anbieter, Konfiguration im `finally` wiederhergestellt). `privacy.test.ts` liest die Antwort aus dem Vertrag statt aus einem erfundenen Body. `docs/api-specification.md:117` ist nachgeführt.
- Anforderung 2: README Z. 297 entspricht wörtlich der Korrektur H-2 aus `186-fachreview-1.md:76` (Schweiz, Art. 16 Abs. 1 DSG, DSV Anhang 1, «within the limits noted there», DPF, Art. 19 Abs. 4, Art. 16 Abs. 2, Art. 17), ergänzt um «(#184)». Damit sind auch die Punkte aus H-18 abgedeckt. Standardvertragsklauseln werden nicht mehr als Alternative angeboten. Z. 292 erwähnt den Text bei abgeschalteter KI.
- Anforderung 3: #216 erlaubt in «Done means» ausdrücklich `No scenario: <reason>` plus DOM-Test, wenn der E2E-Stack nicht mit abgeschalteter KI läuft. Begründung und DOM-Test sind vorhanden (`implementation_plan.md:18`, mit `Test red` und `Skills: tdd, ponytail, ponytail-review`).
- K-2: fr/it nennen jetzt die Kategorienamen aus `backend/migrations/0002_stammdaten.sql:31` («Assurance bâtiment», «Assicurazione edificio»).
- Einfachheit: Im Diff steht nichts ausserhalb der Anforderung. `docs/reviews/185-review-1.md` ist die Ablage des vorigen Berichts, die Planzeilen gehören zu den Reviews.

## Nicht bestätigt

- Von mir erneut ausgeführt und grün: `bunx vitest run src/__tests__/privacy-page.dom.test.ts src/__tests__/privacy.test.ts src/__tests__/privacy-i18n.dom.test.ts` (23 Tests).
- «vom Aufrufer gemeldet», nicht erneut ausgeführt: `bun run lint`, `bun run check`, Rot des neuen DOM-Tests vor der Änderung, Backend `invoice-categorization.pg.test.ts` und `api-contracts.pg.test.ts` (grün, vorher rot), `bun run type-check`, `deepcheck:audit`.
- Bildschirmzustand: Der Zustand «KI abgeschaltet» der Datenschutzerklärung steht nicht in `tests/a11y/screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature`. Ich werte das nicht als neuen UI-Zustand, denn es ändert sich nur der Text eines bestehenden Absatzes (`llm-recipient`), ohne neue Elemente. Ausserdem erreicht der E2E-Stack diesen Zustand nicht (KI eingeschaltet). «Kein Deutsch in fr/it/en» habe ich nur durch Lesen der drei Übersetzungen geprüft, kein Test zeigt es.
- Die fachliche und rechtliche Richtigkeit von `privacy_llm_off` in fr/it/en («traitées», «trattate» für «bearbeitet» im Sinn des DSG) habe ich nicht geprüft. Dafür ist der `fach-reviewer` zuständig (siehe L-1). `docs/design/i18n-begriffe.md` führt «bearbeiten» (Datenschutz) nicht.
- Ob ein Deployment mit einer älteren Backend-Version (ohne `enabled`) vorkommen kann, in dem L-3 sichtbar würde: Dazu habe ich nichts gefunden. BFF und Backend werden laut README gemeinsam ausgeliefert.
