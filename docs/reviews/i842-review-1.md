# Review #842 (T1 ab erstem Job), Runde 1

Bereich: `git diff origin/main 5482d68b` (ein Commit), Worktree `review-i842-cr`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `.github/workflows/ci.yml:363` | Bei «Re-run failed jobs» nimmt `min` das `started_at` eines aus Versuch 1 übernommenen Jobs. T1 umfasst dann die Zeit zwischen den Versuchen, die Warnung kommt fälschlich und `waited` wird negativ (vor der Änderung kam ab `run_started_at` des Versuchs der richtige Wert). |

## C-1 (Minor, Beleg)

Echte Daten, Run 40239565626 (push, `main`, `run_attempt` 2): `run_started_at` 23:06:26Z. Der Job «Changes» wird mit `run_attempt` 2 gelistet, hat aber `started_at` 22:18:26Z aus Versuch 1. «CI duration» startet um 23:19:59Z. Damit:
- `started` = 22:18:26Z, `minutes` ≈ 61 und damit die Warnung über 15 min;
- `waited` ≈ −48 min;
- richtig wären etwa 13 min.

Run 40211818908 zeigt dasselbe (Changes 16:28:17Z gegen `run_started_at` 20:01:38Z). Das Feld `run_attempt` der Jobs trennt die übernommenen Jobs nicht, ein Filter darauf hilft also nicht.

Möglicher Fix: nur Startzeiten ab dem Start des Versuchs nehmen, z. B. `--jq "[.jobs[].started_at | select(. != null and . >= \"$created\")] | min"`.

Geprüft:
- Übersprungene Jobs (Dependency review, Deep modules, UI screenshots) tragen in Run 40303722784 ein `started_at` 1 s vor dem ersten echten Job. Das ist unerheblich.
- Der Job «CI duration» selbst startet zuletzt.
- `min` über ISO-Zeitstempel im gleichen `Z`-Format ist korrekt, und `select(.)` filtert `null` aus.
- 28 Jobs bleiben unter `per_page=100`.
- Wenn die API nicht antwortet: Unter `bash -e` bricht die Zuweisung `started=$(…)` ab, und `continue-on-error` hält den Lauf grün. Ein leeres Array ergibt `null`, dann schlägt `date -d` fehl, ebenfalls mit Abbruch.
- Die Warnung hängt weiter an `$minutes`.
- Die Doku stimmt mit dem Code überein: `utility-tree.md:132` und `fitness-functions.md:25` passen zum Code. Die «Beweis»-Zeile `fitness-functions.md:65` ist allgemein genug und bleibt richtig.
- Die Einträge in `implementation_plan.md` sind zutreffend.
- Ponytail: nichts Unbenutztes und keine Kopie gefunden.

## Nicht bestätigt

- Die Rechnung gegen Run 40303722784 (17 min Wartezeit) hat der Aufrufer von Hand gemacht und gemeldet. Die Job-Startzeiten (frühestes 10:16:08Z) habe ich per `gh api` nachgesehen, die Rechnung selbst nicht wiederholt.
- Der Job ist in CI mit dem neuen Code noch nicht gelaufen (nur von Hand nachgestellt).
