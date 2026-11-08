# Code-Review 1288-closing, Runde 1

Bereich: `git diff d79bca2 d3379ae -- . ':!docs/reviews' ':!docs/design/personas'`, danach der Merge bc187e4 (origin/main, ohne Konflikt). Worktree: review-1288-code2.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/contracts/new/ApartmentStep.svelte:54-56 (dazu messages/*.json:821) | Zwei Änderungen, die der Benutzer bemerkt, ohne Szenario und ohne `No scenario: <reason>`: Die leere Wohnungsauswahl wird jetzt durch den Hinweis zur aufgehobenen Wahl beschrieben (Sven P-2), und der Hinweistext zum eigenen Mietvertrag lautet neu «Ist dieser Mietvertrag gekündigt» (Helga P-3). Beides ist nur in DOM- bzw. i18n-Tests festgehalten. |
| C-2 | Minor | tests/e2e/tasks/contract-form.ts:234-235 | Ein verwaister Kommentar ist stehen geblieben: «the warning after «Erneut versuchen» closed; the hint in the step stays / waits until it is gone …» beschrieb das entfernte `closeWarning`. Jetzt steht er über `openClearedApartmentContract` und beschreibt etwas Falsches. |

## C-1 (Major)

**Warum falsch:** `CLAUDE.md` (Workflow 1, «Done means») und die Review-Vorgaben verlangen: Jede Verhaltensänderung, die ein Benutzer bemerkt, hat ein Szenario ohne `@wip`. Fehlt es, braucht es `No scenario: <reason>`.

- **Sven P-2:** Die neue Beschreibung (`aria-describedby` → `apartment-cleared-title apartment-cleared-text`) ändert, was ein Screenreader bei der Wohnungsauswahl vorliest. Für den Fall «unknown» gibt es dafür schon einen Schritt: `contract-new.feature:140-141`, «Dann liest ein Screenreader bei der Wohnungsauswahl den Hinweis "…" vor».
- **Fehlender Test:** Kein Szenario prüft die neue Beschreibung. Das Szenario «Nach dem Aufheben der Wahl nennt der Schritt die Wohnung und ihren Mietvertrag» (`contract-new.feature:192-204`) prüft nur den Titel, die Erklärung und den Link des Hinweises. Mit einem Revert von ApartmentStep.svelte:54-56 bleibt es grün.
- **Helga P-3:** Kein Szenario prüft den geänderten Text von `contracts_open_contract_text`. Das Szenario `contract-new.feature:103-110` prüft nur den Wohnungsnamen und den Link.

**Wie zeigen:** ApartmentStep.svelte:54-56 auf `: undefined` zurücksetzen und `contract-new.feature` laufen lassen. Alle Szenarien bleiben grün.

**Behebung:** In das Szenario (oder ein neues) eine Zeile mit dem bestehenden Schritt aufnehmen: «Und liest ein Screenreader bei der Wohnungsauswahl den Hinweis "Wohnung 2.01 · Ahornhof ist nicht verfügbar" vor». Für die Textänderung braucht es entweder eine Zeile, die den Satz prüft, oder `No scenario: <reason>` im Pull-Request-Text, z. B. «nur Wortlaut, in `contracts-i18n.test.ts` in vier Sprachen festgehalten».

## Nicht bestätigt

- lint, check, fitness sowie die Vitest-Tests `contract-wizard.dom` und `contracts-i18n` auf d3379ae: «vom Aufrufer gemeldet».
- Rote Läufe der beiden neuen Tests: «vom Aufrufer gemeldet». Beim Lesen wären beide ohne die Änderung rot: Die Beschreibung enthielte nur den Hilfetext, und der alte Satz lautete «Ist er gekündigt».
- E2E contract-new und contract-edit (139 bestanden) nach c50ccaa: «vom Aufrufer gemeldet». Dass der Fokus schon auf dem Basis-Commit nach dem Laden auf der Schrittüberschrift lag (das umbenannte Szenario hält bestehendes Verhalten fest, ohne roten Lauf), habe ich nur aus der Commit-Nachricht und dem gemeldeten Lauf. Selbst ausgeführt habe ich nichts.
- Prüfungen nach dem Merge bc187e4: laufen laut Aufrufer noch. Nicht bestätigt.

Geprüft: Die Szenario-Änderungen von c50ccaa entsprechen wörtlich «Also approved (2026-11-08)» in #1289 (über die REST-API gelesen), und die Commit-Nachricht nennt `Spec change approved: #1289`. Die entfernten Schritte, Tasks und das Target `warningToastClose` werden nirgends mehr verwendet; `warningToast` braucht `questions/contract-form.ts:98` weiterhin. Der neue Wortlaut von `contracts_open_contract_text` übernimmt in allen vier Sprachen genau die Formulierung des geprüften `contracts_apartment_cleared_text`. `Alert` hat die Prop `titleId`, und die ids gibt es nur, solange `cleared` gilt (`describedby` hängt am selben Zustand). Die Umformatierung in OpenContracts.svelte betrifft eine Zeile, die dieser Branch selbst eingeführt hat (d79bca2). Der Merge bc187e4 ist sauber.
