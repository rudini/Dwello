# Code-Review W7b, Runde 2 (Schlussreview der Korrekturen)

Gegenstand: `git diff 4b1a50f bc4e49a` im Worktree `review-w7b-code2` (11ca7f6 fr/it-Wortlaut nach Fachreview 2; bc4e49a Korrekturen C-6, C-10, Plan, Review- und Persona-Berichte). Alle zwölf geänderten Dateien gelesen.

Ergebnis: keine Blocker, keine Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | Nit | `src/routes/contracts/new/PeriodStep.svelte:45`, `tests/e2e/targets/contract-form.ts:53`, `tests/e2e/steps/contract-form.steps.ts:353`, `tests/e2e/features/contract-edit.feature:79` | Der Verweis heisst jetzt nur noch «F-7». Diese ID ist im Repo mehrdeutig (`statement-detail.feature:248,329`, `statement-mapping.test.ts:17` meinen mit F-7 einen Befund aus #229/#232); ohne Issue-Nummer führt sie nur über `docs/reviews/w7b-fachreview-1.md:3` («#52 (F-7)») zurück. Für die Grep-Bedingung von #52 ist das in Ordnung; «Kündigung aufheben» als Anker würde reichen. |

## Bestätigt

- **C-6:** Der Kommentar über `endOn` (`src/routes/contracts/[id]/+page.server.ts:200-202`) ist auf höchstens 120 Zeichen umbrochen, der Wortlaut ist unverändert.
- **C-10:** `grep -rn "#52" src backend tests messages` findet nichts mehr. Die vier Verweise sind nur Kommentare bzw. ein Gherkin-Kommentar, das Verhalten ändert sich nicht.
- **C-9 abgelehnt** (Plan): Die Begründung (beide Aufrufer haben das Formular, das Feld wird einmal gelesen) trifft zu; es ist ein Nit, Ablehnung zulässig.
- **M-6:** it «consenso espresso» (`messages/it.json:1391`), wie Art. 266m cpv. 1 CO.
- **M-7:** fr «doit être donnée par écrit» (`messages/fr.json:1391`), it «deve essere data per scritto» (`messages/it.json:1391`), wie Art. 266l. Grammatisch korrekt (Femininum, passend zu «résiliation» / «disdetta»).
- **V-4:** it «un nuovo inquilino riprende il contratto di locazione» (`messages/it.json:1392`). Den optionalen Zusatz «alle stesse condizioni» hat der Fix nicht übernommen; fr (`fr.json:1392`) hat ihn auch nicht, die Sprachen bleiben also gleich.
- Keine anderen Schlüssel geändert, de/en unverändert (die Fixe betreffen nur fr/it, also keine Lücke in den vier Dateien). Alle vier `messages/*.json` sind gültiges JSON. Die alten Formulierungen («subentrante», «écrite», «esplicito», «scritta») kommen in `src`, `tests`, `backend` und `docs` (ausser den Berichten) nicht mehr vor; kein Test prüft die fr/it-Wortlaute direkt (Sprachszenarien prüfen nur «kein Deutsch»).
- Plan: Punkte für Code-Review 1, Fachreview 2 und Personas sind abgehakt und stimmen mit den Berichten überein; der Punkt für den Abschluss ist noch offen. Persona-Berichte melden nur Minor (z.B. Helga P-1 bis P-3), keine Blocker oder Major.
- Nichts im Delta hat mit der Anforderung nichts zu tun; nur Kommentare, Übersetzungen und Dokumente.

## Nicht bestätigt

- `bun run lint`, `bun run check` auf bc4e49a: vom Aufrufer gemeldet. Vitest, Backend-Tests und E2E contract-detail/contract-edit samt axe- und Sprachzeilen auf 4b1a50f: vom Aufrufer gemeldet, nicht auf bc4e49a neu gelaufen. Das Delta ändert nur Kommentare und fr/it-Texte, deshalb ist kein Ausgang zu erwarten, der vom gemeldeten abweicht; die Sprachszenarien («kein Deutsch» in fr/it) habe ich nur durch Lesen geprüft.
- Die fachliche Richtigkeit der neuen fr/it-Formeln habe ich nur gegen die Zitate in `docs/reviews/w7b-fachreview-2.md:75-97` geprüft, nicht gegen Fedlex.
