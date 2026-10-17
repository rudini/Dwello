# Code-Review #77 (Fedlex-Prüfung), Runde 1 (Abschluss)

Worktree: `review-fedlex77-code` auf 196b27ef. Diff `git diff 1373aee1~1 196b27ef`, 8 Dateien, alle gelesen: `docs/nebenkostenabrechnung-anforderungen.md`, `docs/reviews/fedlex77-fachreview-1.md`, `implementation_plan.md`, `messages/{de,fr,it,en}.json`, `src/__tests__/contract-wizard.dom.test.ts`. Gelesen zum Vergleich: `pdf.service.ts:119–121, 208–210, 297–299, 386–388`, alle Texte in `messages/de.json` mit Artikelzitat, `src/__tests__/i18n.test.ts:57–72`, `docs/design/i18n-begriffe.md:31–32`, `tests/e2e/CLAUDE.md` («No scenario»), `tests/e2e/features/contract-edit.feature:131–136`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `implementation_plan.md:174`, `tests/e2e/features/` | Sichtbare Korrektur eines falschen Hilfetexts ohne Szenario; der Grund «No scenario» gehört zu keinem Fall der Liste in `tests/e2e/CLAUDE.md` |
| C-2 | Minor | `messages/de.json:757` (fr/it/en gleiche Zeile) | `contracts_agreed_costs_help_edit` sagt zu Art. 269d OR (neue Nebenkosten) dasselbe wie der alte Text, den M-1 bemängelt: ohne Begründung, ohne Zehn-Tage-Vorlauf. Er nennt den Artikel nicht, fällt also wörtlich nicht unter #77. Nach dem Fix ist er aber uneinheitlich mit `contracts_fee_help` (Folge-Issue oder mitziehen mit rotem Test) |
| C-3 | Nit | `messages/de.json:743` vs. `:757`, `:1065`, `:1076` | `contracts_fee_help` sagt jetzt «nächstmöglichen Kündigungstermin», die drei anderen Texte zu Art. 269d sagen «frühestens auf den nächsten». Beides ist richtig, die Wortwahl ist aber nicht einheitlich |
| C-4 | Nit | `implementation_plan.md:171` | «Glossary deviations listed in #77» ist offen, obwohl der Fach-Review sie als schon behoben bestätigt (`fedlex77-fachreview-1.md:122`). Abhaken mit Verweis oder als Issue-Kommentar festhalten |
| C-5 | Nit | `docs/reviews/fedlex77-fachreview-1.md` (M-4, M-5, M-6) | Die drei Nits des Fach-Reviews (Zitat bevollmächtigte Person, «Bst. i», Boiler) sind weder umgesetzt noch im Plan abgelehnt. Sie bleiben laut Workflow im Report; ein Satz im Plan oder im PR würde zeigen, dass das bewusst ist |

Ponytail-Review: Der Diff ist minimal (ein Schlüssel in vier Sprachen, eine Assertion, Dokumentation). Nichts Unbenutztes, keine fremden Formatierungen, nichts ohne Bezug zur Anforderung. Keine Befunde.

## C-1 (Major): kein Szenario für die sichtbare Korrektur

**Warum falsch.** 196b27ef korrigiert einen Hilfetext, der dem Vermieter eine falsche Rechtsauskunft gab: Zehn-Tage-Vorlauf und Begründungspflicht fehlten, dazu stand «nächsten» statt «nächstmöglichen». Der Fach-Review begründet M-1 mit genau diesem Schaden: Der Vermieter wählt «einen Termin, der nicht hält». Das ist ein Fehler, den der Benutzer sieht, und laut `CLAUDE.md` Workflow 1 braucht er ein Szenario. Der Plan nennt stattdessen «No scenario: a help text gains detail; no scenario asserts it, the DOM test covers it». `tests/e2e/CLAUDE.md`, «No scenario», lässt das nur für Zustände zu, die der E2E-Stack nicht erzeugen kann. Diesen Hilfetext erreicht der Stack aber (Mietvertrag-Assistent, Schritt Miete). Hilfetexte als «erfährt der Liegenschaftsverwalter, dass …» sind im Repo übliche Szenarien (`contract-edit.feature:143–144`, `:146–148`). Die Verwaltungspauschale hat dort schon ein Szenario (`contract-edit.feature:133`, Kommentar Art. 269d Abs. 3 OR).

**Wie zeigen.** `grep -rn "zehn Tage\|nächstmöglichen" tests/e2e` findet nichts. Kein Szenario in `tests/e2e/features` schlägt fehl, wenn `contracts_fee_help` wieder auf den alten Wortlaut gesetzt wird.

**Abhilfe.** Ein Szenario, z. B. in `contract-create.feature` oder `contract-edit.feature`: «Dann erfährt der Liegenschaftsverwalter, dass er eine neue Verwaltungspauschale begründet und mindestens zehn Tage vor Beginn der Kündigungsfrist mit dem amtlichen Formular mitteilt». Die Frage soll den Text liefern. Gegenargument für die Triage: Derselbe Text wurde früher (#89, Fach-Review M-3) nur mit einem DOM-Test korrigiert. Lehnt der Aufrufer C-1 ab, braucht der PR ein «No scenario» mit einem Grund, der in `tests/e2e/CLAUDE.md` steht, oder einen Eintrag «Workflow note», dass reine Textkorrekturen ausgenommen sind.

## Bestätigt

- **Richtigkeit `contracts_fee_help`:** Alle vier Sprachen nennen jetzt Formular, Begründung, «mindestens zehn Tage vor Beginn der Kündigungsfrist» und «nächstmöglichen» Termin. Das entspricht dem Fedlex-Zitat von Art. 269d Abs. 1 OR im Fach-Review (`fedlex77-fachreview-1.md:32`) und seinem Korrekturvorschlag M-1. fr bleibt bei «délai/terme de congé»: Das verlangen `i18n-begriffe.md:31–32` und `i18n.test.ts:58–64`. Der Verzicht auf M-7 ist damit belegt. it «termine di preavviso» und «scadenza di disdetta» passen zu `i18n.test.ts:66–72`.
- **Roter Test:** Die Assertion in `contract-wizard.dom.test.ts:195–197` verlangt den neuen de-Wortlaut. Mit dem alten Text («mitteilen; sie gilt erst ab dem nächsten …») schlägt sie fehl. Das habe ich durch Lesen geprüft.
- **PDF-Hinweise:** `noteReceipts`, `noteHeating`, `noteStock` (de/fr/it/en) zitieren Art. 257b Abs. 2 OR und Art. 8 Abs. 1/2 VMWG und stimmen mit den Zitaten im Fach-Review überein. Die Schlussfolgerung «keine Änderung» hält.
- **Anforderungsdokument:** Jede geänderte Zeile nennt einen Fedlex-ELI-Link mit Fassung und als Sicherheit «Fedlex geprüft» oder eine begründete Mischstufe. Die Fach-Befunde M-2, M-3, V-1 bis V-5 sind umgesetzt (Diff-Zeilen +16, +10, +127, +118, +73, +72, +92).
- **Konventionen:** Text in allen vier `messages/*.json`; Commits im Format Conventional Commits, höchstens 50 Zeichen. Kein neuer Bildschirm, kein E2E-Code, keine API-Änderung.

## Nicht bestätigt

- Fedlex-Wortlaut selbst: nicht gelesen. Ich stütze mich auf die Zitate im Fach-Review und im Dokument. Die Fedlex-Texte im Scratchpad des Aufrufers habe ich nicht geöffnet, weil sie ausserhalb des Worktrees liegen.
- Selbst erneut ausgeführt auf 196b27ef: `bunx vitest run src/__tests__/contract-wizard.dom.test.ts src/__tests__/i18n.test.ts`, 64/64 grün.
- Vom Aufrufer gemeldet: `bun run lint`, `no-german-in-code.test.ts`, `backend-codes`, `contract-detail-page.dom`, `help-page.dom`, `open-work` (grün); `bun run check` und Backend-`type-check` (auf 1373aee1).
- Ob `contracts_agreed_costs_help_edit` (C-2) unter #77 fällt: Das hängt davon ab, ob «cite» auch Texte ohne Artikelnummer meint. Das Issue habe ich nicht gelesen.
