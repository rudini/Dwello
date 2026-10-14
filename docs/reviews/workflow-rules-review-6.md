# Review 6: Umsetzung der Befunde aus workflow-rules-review-2 bis -5

Geprüft im Worktree `scratchpad/review-rules-code-reviewer` (origin/main bf9c7bd plus uncommittete Änderung, 8 Dateien). Alle 8 geänderten Dateien gelesen, dazu die Reviews 2 bis 5, `docs/design/arbeitsregeln.md` («Persona runs: how»), `docs/design/i18n-begriffe.md`, `.claude/settings.json` (Hooks), Backend-Services mit `count(*)` und `opus-guidance.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `CLAUDE.md:98` | «`prettier --check` shows them» ist falsch: `--check` nennt nur Dateien, keine Zeilen, und rät zu `--write` |
| C-2 | Minor | `CLAUDE.md:66` | Neuer W-24-Satz widerspricht dem Stopp-Satz direkt davor im selben Satz |
| C-3 | Minor | `CLAUDE.md:60`, `:84`; `.claude/agents/persona.md:19` | Was mit «Beobachtungen» geschieht, steht nirgends; nach «Open work» (`:84`) wird trotzdem jede zum Issue, das eigentliche Ziel von W-17 (weniger neue Issues pro Lauf) wird damit nicht erreicht |
| C-4 | Minor | `docs/design/arbeitsregeln.md:81` | Die Persona liest diesen Abschnitt (`persona.md:7`): «suggestions marked Blocker/Major/Minor», ohne Einschränkung auf die Änderung und ohne «Beobachtungen» |
| C-5 | Minor | `.claude/agents/fach-reviewer.md:10`; `CLAUDE.md:54` | Für Cookies gilt Art. 45c FMG (SR 784.10), nicht das DSG; die Nutzungsbedingungen (`src/routes/terms`) schickt `CLAUDE.md:54` an den `fach-reviewer`, aber keine seiner Rollen prüft sie |
| C-6 | Minor | `tests/contracts/README.md:10` | Zu allgemein: `building.json` hat Zählungen als Zahl, weil `building.service.ts:89,142` sie mit `Number()` wandelt; Drizzles `count()` (`document.service.ts:83`) liefert ebenfalls eine Zahl |
| C-7 | Minor | `implementation_plan.md:5–16` | Es fehlt `Skills: tdd, ponytail, ponytail-review` (die Änderung betrifft Code: Test und `fr.json`); die rote Phase des Italienisch-Tests steht nicht im Format `Test red: <test> – <message>` |
| C-8 | Nit | `.claude/agents/fach-reviewer.md:7`, `:22` | «in two roles», es folgen aber drei; im Format der Tabelle gibt es kein ID-Präfix für Datenschutz (nur `V-n`, `M-n`) |
| C-9 | Nit | `CLAUDE.md:61` | «Domain rules, terms or legal texts»: «terms» heisst hier Fachbegriffe, zwei Zeilen weiter oben (`:54`) heisst es Nutzungsbedingungen («legal texts (privacy statement, terms)»); besser «domain terms» |
| C-10 | Nit | `src/__tests__/i18n.test.ts:34` | `/\bstabil[ei]\b/i` schlägt auch beim Adjektiv an («connessione stabile» → true, nachgeprüft). Heute gibt es 0 Treffer in `it.json`; erst ein künftiger Fehlalarm würde es zeigen |
| C-11 | Nit | `backend/src/services/pdf.service.ts:132`, `:157` | Die französischen PDF-Texte haben Guillemets mit normalem Leerzeichen (« {profile} »), und der neue Test prüft nur `messages/fr.json`. Das gab es schon vorher; es gehört zu den offenen Arbeiten, nicht in diese Änderung |

## C-1 (Major): Die Formatierungsregel verweist auf ein Werkzeug, das die Zeilen nicht zeigt

Neuer Text, `CLAUDE.md:98`:

> In a file you change, format only your own lines (`prettier --check` shows them); leave the lines you did not touch as they are.

**Warum falsch:** `prettier --check` nennt nur Dateinamen. Bei einer Datei, die schon vorher nicht Prettier-sauber war, rät es ausdrücklich zu `--write`. Genau das hat W-20/W-23 ausgelöst. Für die Dateien, für die die Regel gedacht ist (viele bestehende Dateien sind nicht sauber), kann der Agent die Regel so nicht befolgen. Der Hinweis führt ihn zurück zu dem Fehler, den W-23 (Major, drei verlorene Review-Runden) beheben sollte.

**Wie es scheitert (nachgeprüft):**
```
$ bunx prettier --check src/__tests__/categories.test.ts
Checking formatting...
[warn] src/__tests__/categories.test.ts
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
```
Die Zeilen zeigt dagegen `bunx prettier src/__tests__/categories.test.ts | diff src/__tests__/categories.test.ts -` (`82c82,85`: dieselbe fremde Zeile wie in #99 C-3).

**Fix:** «(`bunx prettier <file> | diff <file> -` shows them)». Damit entspricht der Satz auch der Vorgabe der Anleitung, konkrete Muster statt allgemeiner Hinweise zu nennen.

## Weitere Notizen zu Minor-Befunden (Formulierungsvorschläge)

- C-2: Zitat `CLAUDE.md:66`: «if the same reviewer still reports an open Blocker/Major on the same slice after its 3rd round, stop, list the open findings under "Blocked on me", ask me; a Blocker/Major of its 3rd round that you fixed with a test shown red and green needs no 4th round». Ein Major aus Runde 3 ist «after its 3rd round» offen, solange er nicht behoben ist. Die erste Hälfte verlangt also Stopp und Rückfrage, die zweite die Behebung ohne Rückfrage. Vorschlag: «… after its 3rd round and you cannot fix it with a test shown red and green, stop …; one you fixed that way needs no 4th round (say so in its plan line)».
- C-3: Vorschlag für Schritt 6: «Beobachtungen of a persona: check each on the base commit; one the change made more visible or contradictory becomes a finding of the slice; the rest go once per task as one collected issue or `offene-punkte.md` row». Das gibt der Persona-Ausgabe ein klares Ziel.
- C-5: In `fach-reviewer.md` in der Rolle Datenschutz ergänzen: «cookies: FMG Art. 45c», und für die Nutzungsbedingungen das massgebende Recht nennen (OR, AGB-Kontrolle über Art. 8 UWG) oder «terms» aus `CLAUDE.md:54` streichen.

## Bestätigt (Code und, wo es geht, Nachprüfung)

- W-2: `CLAUDE.md:60` und `persona.md:3` nennen «what a screen shows changed (also through a backend change)».
- W-5/W-17: Persona bewertet nur, was die Aufgabe als geändert nennt (`persona.md:18`); Schritt 7 hat die Ausnahme «not when the change makes it more visible or contradictory». Siehe aber C-3 und C-4.
- W-11: Schritte 1 und 5 sowie `fach-reviewer.md` sind erweitert. Die Artikel sind nachgeprüft: DSG (SR 235.1, Fedlex eli/cc/2022/491) Art. 16 «Grundsätze» der Bekanntgabe ins Ausland, Art. 19 Informationspflicht. Siehe aber C-5.
- W-22: Die Hooks sind `PreToolUse` auf `Bash` (`.claude/settings.json:101–118`) und blockieren damit den ganzen Befehl; der neue Satz `CLAUDE.md:92` stimmt.
- W-24: umgesetzt, aber mit Widerspruch (C-2).
- W-26: `persona.md:11,16`. `persona-kit.mjs` lädt seine Module über `createRequire` und läuft laut seinem Kopfkommentar «from any directory», also auch aus einem Unterordner.
- W-12: Der Test besteht im Worktree (`bunx vitest run src/__tests__/i18n.test.ts`: 13/13). Die 4 Texte haben jetzt U+00A0 (`od -c`: `302 240`). Die rote Phase ist nachgeprüft: `fr.json` von bf9c7bd ergibt mit der Test-Regex 4 Treffer. Prüfungen der Regex: `«A»`, `« A »` (U+202F) und `x » y` werden erkannt.
- W-6, W-19: `backend/CLAUDE.md:32–33`. Dass Bun bei `.rejects` ein echtes Promise verlangt, habe ich mit einem Thenable im Scratchpad gezeigt (`bun test`: «thenable» scheitert, das Promise besteht). `category-type.pg.test.ts:37` nutzt schon `.execute()`.
- W-18: `tests/contracts/category.json:13` hat `"invoiceCount": "2"` (String), und `src/lib/server/category.ts:23` wandelt mit `Number()`. Siehe aber C-6.
- Guidance: Die neuen Regeln sind konkret, enthalten kein «think carefully» und haben klare Stopp-Regeln. Ausnahmen sind C-2 (Widerspruch beim Stoppen) und C-3 (offen, wann die Beobachtungen erledigt sind).
- Kein fremder Diff: `fr.json` ändert nur die 4 Guillemets-Texte.

## Nicht bestätigt

- `bun run test:coverage`, `bun run lint`, `bun run check`, `prettier --check` auf `i18n.test.ts`: vom Aufrufer gemeldet, nicht wiederholt (nur `i18n.test.ts` neu laufen lassen). Ebenso vom Aufrufer gemeldet: der einmalige, nicht reproduzierte Fehler beim ersten Coverage-Lauf; seine Ursache ist unbekannt.
- Backend-Tests sind nicht gelaufen (geändert hat sich dort nur Text).
- Dass Drizzles `.execute()` ein echtes Promise liefert: `node_modules/drizzle-orm` konnte ich nicht lesen (Deny-Regel). Gestützt wird es nur durch den bestehenden grünen Test `category-type.pg.test.ts:37` und durch den Versuch mit dem Thenable.
- DSG Art. 17 und 20: Die Titel (Ausnahmen bei der Bekanntgabe ins Ausland bzw. bei der Informationspflicht) habe ich nicht im Fedlex-Wortlaut gesehen. Die Suchtreffer bestätigten nur Art. 16 und 19. Art. 45c FMG ist über einen Fedlex-Treffer (SR 784.10) bestätigt.
- Rote Phase des Italienisch-Tests: nicht selbst gezeigt. Nachgeprüft ist nur, dass die Regex «lo stabile» erkennt.
- Szenario: Die NBSP-Korrektur in `fr.json` ändert nur den Zeilenumbruch. Ich werte sie nicht als Verhaltensänderung, die ein Szenario braucht. Ein Vermerk `No scenario: <reason>` fehlt im Plan aber.
