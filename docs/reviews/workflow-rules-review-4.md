# Review: Instruktionen und Skills nach dem Lauf #99 (P-9b, Kategorie «vordefiniert»)

Lauf: Session 2026-10-14, dritter Bug des Serienauftrags. Slice #99, Commits 6a944f9, 8815e93. Eine Runde `code-reviewer`, eine Runde Persona Helga.
Geprüft: was im Lauf an `CLAUDE.md`, `backend/CLAUDE.md`, `tests/e2e/CLAUDE.md`, `tests/contracts/README.md`, den Skills `tdd`, `ponytail`, `ponytail-review` und an den Hooks gehakt hat oder unklar war. Nur Befunde, keine Umsetzung. Befunde aus `workflow-rules-review-2.md` und `-3.md` werden nur genannt, wenn der Lauf sie bestätigt.

## Major

- **W-17 (Major) `CLAUDE.md:66` (Schritt 7) – Personas liefern bei jedem Lauf vorbestehende Majors.** In drei von drei Läufen meldete die Persona Majors, die es schon vor der Änderung gab und die eine Produktentscheidung brauchen (#159/#160, #82, jetzt #166). Die Regel lässt den Abschluss zu, aber jeder Lauf erzeugt so ein neues `entscheiden`-Issue, und die Liste der offenen Entscheidungen wächst schneller als die der Bugs. Vorschlag: im Persona-Auftrag (Schritt 5) die Aufgabe auf die Änderung begrenzen und Befunde ausserhalb der Änderung gesammelt als «Beobachtungen» statt als Severity melden lassen, oder Ihnen pro Serienauftrag eine Sammelliste vorlegen statt je ein Issue.
- **W-2 bestätigt (Major).** Wieder keine UI-Logik geändert (nur eine `data-testid` und der Mapper), aber sichtbares Verhalten. Ich habe Helga laufen lassen; sie bestätigte die Änderung und fand nur Vorbestehendes.

## Minor

- **W-18 (Minor) `tests/contracts/README.md` – Zahlen aus `COUNT(*)` kommen als String.** Der neue Vertrag `category.json` hatte `invoiceCount` als Zahl; die API liefert einen String (Postgres-`COUNT` über Drizzle `sql<number>`). Der Vertragstest fand es, das Frontend wandelt mit `Number()`. Ein Satz im README («Zählungen aus SQL kommen als String») spart die Runde.
- **W-19 (Minor) `backend/CLAUDE.md` «Tests» – Drizzle-Builder sind kein Promise.** `expect(db.insert(...)).rejects` scheitert, weil der Builder nur thenable ist; erst `.execute()` macht ein Promise daraus. Ein Hinweis bei den pg-Tests spart die Fehlersuche.
- **W-20 (Minor) `CLAUDE.md` «Formatting» – Prettier auf geänderten Dateien bricht fremde Zeilen um.** `bunx prettier --write` auf `categories.test.ts` (nur ein Test entfernt) brach einen unveränderten Aufruf um (Code-Review C-3). Die Regel erlaubt Prettier auf geänderten Dateien und verbietet zugleich Änderungen ausserhalb der Aufgabe. Vorschlag: «Prettier only on files you create; in files you change, keep the formatting of lines you do not touch» oder `prettier --check` statt `--write` bei bestehenden Dateien.
- **W-14 bestätigt (Minor).** Hier keine zweite Persona-Runde nötig, weil die Fixes keinen neuen Text brachten; die Regel griff richtig.
- **W-7 bestätigt (Minor) Stop-Hook.** Sechs Aufforderungen in diesem Lauf.

## Nit

- **W-21 (Nit) `.github/ISSUE_TEMPLATE/task.md` – «Done means» nennt Tests, aber nicht den ersetzten Test.** #99 verlangte neue Tests; dass ein bestehender Test die alte Namensregel festschrieb und weg muss, stand nicht darin. Der Code-Review musste prüfen, dass nichts verloren geht. Ein Punkt «tests that pin the old behaviour: name them» im Template machte das sichtbar.

## Hat getragen (keine Änderung nötig)

- `backend/CLAUDE.md`: «until the first installation, changes go into `0001_schema.sql`» war eindeutig; keine neue Migration nötig.
- Der Vertragstest (`api-contracts.pg.test.ts`) fand die fehlende Spalte und den String-Typ sofort.
- Die E2E-Isolation mit `unique()` zwang zu einer sauberen Seed-Funktion, statt einen zweiten Namen zu erfinden.

## Nicht bestätigt

- Ob Sie W-17 so sehen: die vorbestehenden Funde sind real, nur ihre Menge ist das Problem.
