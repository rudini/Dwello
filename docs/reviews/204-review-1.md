# Code-Review #204 / #220, Runde 1

Gegenstand: `git diff 87dda97 7f838ea` (b06e4d4 Tests/Eval, 7f838ea Migration/Doku), Worktree `review-204-code`. Gelesen: alle 8 Dateien des Diffs, dazu `0002_stammdaten.sql`, `src/db/migrate.ts`, `backend/CLAUDE.md` (Stammdaten-Regel), `category.service.ts`, `CategoryForm.svelte`, die Issues #204 und #220 (`gh api`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/__tests__/migrations.pg.test.ts:79 | Der Test ändert vorher nur Gartenpflege; dass die Migration eine geänderte Beschreibung stehen lässt, ist damit nur für 1 von 6 `WHERE`-Bedingungen belegt. Bei TV/Kabelanschluss oder Kehricht (verlangt von #220, Done means 1) könnte das `AND description = …` fehlen, ohne dass ein Test rot wird. Lesend sind alle sechs Bedingungen richtig (Texte gleich wie in `0002_stammdaten.sql:15,22,24,25,31,34`). Abhilfe: im selben `UPDATE` vorher alle sechs Zeilen bis auf eine ändern, oder mindestens noch TV/Cable und Waste Disposal. |
| C-2 | Minor | src/routes/config/categories/CategoryForm.svelte:104-110 (nicht im Diff) | Die neuen Beschreibungen haben rund 75 bis 220 Zeichen und stehen auf der Bearbeitungsseite in einem einzeiligen `TextInput`; die «ohne …»-Klausel ist bei 390 px abgeschnitten. Das gab es schon vorher (Lift), die Änderung macht es aber deutlicher. Es ändert sich also, was ein Bildschirm zeigt: Persona-Review nach Workflow 5 nötig. |
| C-3 | Nit | implementation_plan.md:9 | Die Eval-Fälle im Plan («Heizungsversicherung, Verwaltung der Heizung, Anschluss ans Kabelnetz») passen nicht mehr zum Code (nach V-4/V-7: «Installation des Kabelanschlusses», «Versicherung der Heizungsanlage», «Verwaltung des Heizbetriebs», «Rasensanierung», «Benzin für den Rasenmäher», «Kehrichtgrundgebühr …», «Honorar für die Heizkostenabrechnung»). |
| C-4 | Nit | backend/migrations/0007_category_descriptions.sql:9-24 | `WHERE` prüft `name` und `description`, aber nicht `type = 'predefined'`. Ein Vermieter könnte eine vordefinierte Kategorie umbenennen und eine eigene Kategorie mit Namen «Heating» und genau dem gelieferten Text anlegen; diese würde dann ebenfalls geändert. Praktisch ausgeschlossen, deshalb nur ein Nit. |

Kein Blocker, kein Major.

## Geprüft und bestätigt

- **#204/#220 Migration:** Neue Datei `0007_…`, kein bestehender Migrationsfile geändert. Sechs `UPDATE`s, jeweils mit `WHERE name = … AND description = <gelieferter Text>`. Die gelieferten Texte stimmen Zeichen für Zeichen mit `0002_stammdaten.sql` überein (geprüft per grep). Das erfüllt die Regel in `backend/CLAUDE.md:27`.
- **Wortlaut:** TV/Kabelanschluss und Kehricht wörtlich wie in #220 entschieden. Heizung, Gartenpflege, Gebäudeversicherung und Verwaltung wörtlich nach den Behebungen V-1, V-2, V-3 und V-6 in `docs/reviews/204-fachreview-1.md`. M-1 bleibt bewusst offen (Text in #220 entschieden).
- **Tests:**
  - `migrations.pg.test.ts` wendet 0001–0006 aus einer Kopie ohne 0007 an, ändert Gartenpflege und wendet danach alle Migrationen an. Ohne 0007 bleibt Heizung beim alten Text, der Test wäre also rot. Lift dient als Kontrollzeile.
  - `invoice-categorization.pg.test.ts` pinnt die Prompt-Zeilen von Gartenpflege, TV/Kabelanschluss und Kehricht (#220 Done means 2). Weil die Beschreibungen in der Datenbank liegen, ist das die tiefste Schicht, die das zeigen kann; die Abweichung vom in #220 genannten `llm-prompt.test.ts` ist begründet.
  - `heating-profiles.pg.test.ts` wurde an den neuen Heizungstext angepasst.
  - Alle drei Tests wären ohne die Migration rot.
- **llm-eval.ts:** Fälle für die neuen Ausschlüsse sind da: Baumfällung, Rasensanierung, Räumung des Estrichs (Räumung), Installation des Kabelanschlusses (Kabelinstallation), «Honorar für die Heizkostenabrechnung». Dazu die Gegenfälle Versicherung der Heizungsanlage, Verwaltung des Heizbetriebs, Benzin für den Rasenmäher und «Kehrichtgrundgebühr nach Gebäudeversicherungswert». Die erwarteten Werte belegt das Fachreview (V-3, V-7, «Bestätigt mit Quelle»).
- **docs/data-model.md:** Ergänzt, wie `backend/CLAUDE.md` es für Stammdatenänderungen verlangt. `schema.ts` muss nicht angepasst werden (keine Schemaänderung).
- **Konventionen:**
  - Keine UI-Texte in `messages/*.json` betroffen; die Beschreibungen sind Datenbankdaten.
  - Keine API-Antwort in ihrer Form geändert; kein Vertrag in `tests/contracts` nennt die alten Texte (grep).
  - Kein E2E-Test und keine Persona-Datei mit Ablauf liest die alten Texte (grep über das Repo).
  - Testnamen deutsch; neue Zeilen Prettier-sauber (`bunx prettier | diff`, ohne Ausgabe).
  - Commit-Betreffe ≤ 50 Zeichen.
- **Szenario:** «No scenario» ist in beiden Issues so entschieden (Stammdatentext); die Prüfung auf tieferer Schicht ist vorhanden.
- **Unbeteiligte Änderungen:** keine.
- **Ponytail-Review:** Lean already. Ship. (Die Lift-Kontrollzeile im Migrationstest ist die Gegenprobe, kein Ballast.)

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:**
  - `bun run lint`
  - `bun run check`
  - `cd backend && bun run type-check`
  - `bun test migrations/invoice-categorization/heating-profiles.pg.test.ts` (25 pass)
  - `bunx vitest run src/__tests__/open-work.test.ts`
  - `bun run llm:eval` mit MiniMax-M2.5: 42/47 vorher, 45/47 nachher

  Die Backend-pg-Tests habe ich nicht erneut laufen lassen: Sie setzen `dwello_test` neu auf und hätten die parallel laufende volle Suite des Aufrufers gestört.
- **llm:eval mit dem Standardmodell** (Ollama `qwen2.5:3b`): nicht gelaufen. Nur MiniMax-M2.5 wurde gemeldet; ob die Texte dem kleinen Standardmodell helfen, ist offen.
- **Volle Backend-Suite:** läuft laut Aufrufer separat; Ergebnis nicht gesehen.
- **Darstellung der langen Beschreibung auf der Bearbeitungsseite** (C-2): nicht im Browser angesehen. Gelesen nur `CategoryForm.svelte:104-110` (einzeiliges `TextInput`).
- **Fachreview M-2** (Grund der Gebäudeversicherung ohne Heizungsausnahme): laut Plan offen und #221 zugeordnet, ausserhalb dieses Slices; nicht geprüft, ob es in #221 eingetragen ist.
