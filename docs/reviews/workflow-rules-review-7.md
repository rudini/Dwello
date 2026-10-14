# Review 7 (Runde 2, nur Delta): Arbeitsregeln aus den Reviews 2 bis 5

Geprüft im Worktree `scratchpad/review-rules-r2` (origin/main bf9c7bd mit der ganzen Änderung, nicht committet). Das Delta habe ich mit `diff rules.patch <git diff>` bestimmt. Gelesen habe ich alle 10 geänderten Dateien an den geänderten Stellen, `.claude/agents/fach-reviewer.md` ganz, dazu den Bericht der Runde 1 und `opus-guidance.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-12 | Minor | `src/__tests__/i18n.test.ts:36`; `implementation_plan.md:18` | Die eingeengte Regex übersieht genau die wahrscheinlichsten Fehler: Beschriftungen und Schaltflächen ohne Artikel. «Stabile», «Nuovo stabile», «Elimina stabile» und «il tuo stabile» ergeben jeweils `false` (nachgeprüft mit `node -e`). Die rote Phase im Plan («inserting «stabile»») gilt für die neue Regex nicht mehr: Ein blosses «stabile» bleibt grün. **Fix:** zurück zu `/\bstabil[ei]\b/i` (heute 0 Treffer in `it.json`; die einzige Fundstelle «Stabilisca» trifft wegen `\b` nicht) und erst bei einem echten Adjektiv eine Ausnahme ergänzen. Alternativ die Regex um den Wortanfang und Possessive erweitern. In beiden Fällen die rote Phase neu zeigen und im Plan nachtragen. |
| C-13 | Minor | `CLAUDE.md:60`, `:84` | «collect those you keep» lässt offen, welche Beobachtungen wegfallen dürfen und nach welchem Kriterium. Das widerspricht `:84`, wo es heisst «A point you find but do not fix becomes an issue». Ausserdem fehlt weiterhin ein Weg für eine Beobachtung, die eine Regression durch die Änderung ist (ausserhalb dessen, was die Aufgabe nennt): Sie landet still in der Sammelzeile, statt ein Befund des Slices zu werden. **Fix:** Die Regel aus dem Vorschlag der Runde 1 übernehmen, nämlich «check each on the base commit; one the change caused or made more visible becomes a finding of the slice; all others go together into one issue or `offene-punkte.md` row per task». Dazu «you keep» streichen. |
| C-14 | Nit | `CLAUDE.md:84` | Zwei Klammern hintereinander: «becomes an issue (persona "Beobachtungen": …) (or, if non-functional, a row …)». Die Persona-Klammer hängt am Issue-Zweig. Besser als eigener Satz ans Ende: «Persona "Beobachtungen" of one task go together into one issue or row.» |
| C-15 | Nit | `CLAUDE.md:66` | «you cannot fix it with a test shown red and green»: Für einen Major der 3. Runde, dessen Behebung kein Verhalten ändert (Text, Doku, Konfiguration, wie hier C-1), gibt es nach Schritt 6 keinen roten Test. Er führt deshalb immer zu Stopp und Rückfrage. Ist das so gewollt, ist es in Ordnung. Wenn nicht: «… or, for a fix that changes no behavior, show the corrected text in the plan line». |
| C-16 | Nit | `.claude/agents/fach-reviewer.md:3`; `CLAUDE.md:54` | Die `description` nennt für Rechtstexte weiterhin nur «data protection law», ohne FMG und ohne die Regeln für Nutzungsbedingungen. `CLAUDE.md:54` fasst UWG Art. 8 unter «contract law», es handelt sich aber um Lauterkeitsrecht. Zudem schützt Art. 8 UWG nur Konsumentinnen und Konsumenten (SECO: «nur gegenüber Konsumentinnen und Konsumenten»). Die Rolle sollte deshalb zuerst prüfen, ob der Liegenschaftsverwalter hier als Konsument gilt. |

Es gibt keinen Blocker und keinen Major.

## Status der Befunde aus Runde 1

| ID | Status | Nachweis |
|---|---|---|
| C-1 | behoben | `CLAUDE.md:98` nennt `bunx prettier <file> \| diff <file> -`. Im Worktree ausgeführt auf `src/__tests__/i18n.test.ts`: keine Ausgabe, Exit 0. Der Befehl funktioniert, und die neuen Testzeilen sind Prettier-sauber. |
| C-2 | behoben | Der Widerspruch ist weg: Gestoppt wird nur noch, wenn der Fehler nicht mit einem rot und grün gezeigten Test behoben werden kann. Siehe C-15 (Nit). |
| C-3 | teilweise | Ziel und Ablage stehen jetzt in `:60` und `:84`. Offen sind das Kriterium «you keep» und die Regressionen, siehe C-13 und C-14. |
| C-4 | behoben | `docs/design/arbeitsregeln.md:81` passt zu `persona.md:18–19`. |
| C-5 | behoben | Rolle «Rechtstexte» in `fach-reviewer.md:11`. Art. 45c FMG nachgeprüft («Daten auf fremden Geräten»; justement.ch und droit-bilingue.ch, SR 784.10). Art. 8 UWG nachgeprüft («Verwendung missbräuchlicher Geschäftsbedingungen», Fedlex-Treffer eli/cc/1988/223_223_223). `src/routes/terms` existiert. Siehe C-16 (Nit). |
| C-6 | behoben | `tests/contracts/README.md:10` stimmt: `building.service.ts:89,142` wandelt mit `Number()`, `building.json:13–15` enthält Zahlen, `category.json:13` hat `"2"`. |
| C-7 | teilweise | Die Zeilen `Test red`, `No scenario` und die Review-Zeile haben jetzt das richtige Format. `Skills: none loaded` (`implementation_plan.md:20`) ist ehrlich, die Regel aus `CLAUDE.md`, Workflow 3, ist damit aber nicht erfüllt. Das bleibt Minor; der Aufrufer entscheidet, ob er es als offene Arbeit führt oder die Skills nachholt. Die Italienisch-Zeile gilt nicht mehr, siehe C-12. |
| C-8 | behoben | «three roles», ID `R-n` (`fach-reviewer.md:7`, `:22`). |
| C-9 | behoben | `CLAUDE.md:54` sagt «terms of use», `:61` sagt «domain terms». |
| C-10 | behoben, aber zu weit eingeengt | «connessione stabile» ergibt jetzt `false`. Dafür gibt es neue Lücken, siehe C-12. |
| C-11 | als offene Arbeit erfasst | Zeile `offene-punkte.md:32` (U-26). Nachgeprüft: `pdf.service.ts:132` hat nach «, wie mit `od -c` gezeigt, ein normales Leerzeichen (`302 253 040`). |

## Neue Probleme durch das Delta

Nur C-12 bis C-16 oben. Ausserhalb der Befunde ändert das Delta nichts; die Änderungen in `fr.json` betreffen weiterhin nur die 4 Guillemets-Texte.

## Nicht bestätigt

- Lint und svelte-check: vom Aufrufer gemeldet, nicht wiederholt.
- `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/open-work.test.ts` habe ich im Worktree neu laufen lassen: 2 Dateien, **17** Tests grün. Der Aufrufer meldet für dieselben Dateien 381 grüne Tests. Woher der Unterschied kommt (andere Dateien im Lauf oder ein anderer Stand im Hauptbaum), konnte ich nicht klären.
- Die rote Phase des eingeengten Italienisch-Tests habe ich nicht selbst gezeigt, weil ich keine Datei ändern darf. Mit `node -e` nachgeprüft ist nur, dass «lo stabile», «gli stabili» und «dello stabile» erkannt werden.
- Art. 45c FMG ist über justement.ch und droit-bilingue.ch belegt, nicht über den Fedlex-Text selbst. Die Titel von DSG Art. 17 und 20 habe ich weiterhin nicht im Wortlaut gesehen (wie in Runde 1).
- Ob eine Pflicht zur Abarbeitung gemäss C-15 gewollt ist, ist eine Entscheidung des Product Owners und nicht nachprüfbar.
