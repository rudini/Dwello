# Review #1275, Runde 1 (aff89c4b..d3e0bdcc)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | .github/workflows/fallback-review.yml:146-149 (mit :105-106) | Der Prüfbericht wird ohne Warten und ohne Abgleich mit dem Head gelesen. «Pull request comments» und «Fallback review» starten beide auf dasselbe `workflow_run: CI completed` und laufen ohne feste Reihenfolge. Im Hauptfall bekommt MiniMax deshalb «(no reviewer report)» oder den Bericht eines älteren Commits. |

## C-1 (Major): Prüfbericht fehlt im Hauptfall oder ist veraltet

**Warum falsch:** Beide Workflows reagieren auf `workflow_run: [CI] completed` (fallback-review.yml:12-14, pr-comments.yml:9-12) und haben keine Abhängigkeit voneinander. Die Schleife in fallback-review.yml:104-107 bricht nach dem ersten `sleep 60` ab, sobald Copilot nicht mehr angefragt ist. Das ist genau der Fall, für den der Fallback gebaut ist: Copilot hat schon vor dem Ende von CI mit einem Fehler oder Rate-Limit geantwortet und steht danach nicht mehr in `requested_reviewers`. MiniMax liest den Kommentar also etwa 60 s nach dem Ende von CI.

«Pull request comments» braucht bis zum Kommentar mehrere Schritte: Checkout mit `fetch-depth: 0`, `setup-bun`, `bun install --frozen-lockfile`, den Gate-Check und das Herunterladen des Artefakts (pr-comments.yml:36-84). Diese Schritte dauern in der Regel länger als 60 s.

- Bei der ersten CI eines Pull Requests, der nicht als Entwurf geöffnet wurde, gibt es noch keinen Bericht. Der Fallback reviewt aber nur einmal pro Pull Request, also meist genau bei dieser ersten CI. Damit läuft Zeile 149 auf «(no reviewer report)», und die Anforderung von #1275 («also gets the reviewer report») wirkt im Hauptpfad nicht.
- Lief CI schon früher, etwa bei einem Entwurf oder einem früheren Push, ist der Sticky-Kommentar noch der alte. Er trägt keinen Head-SHA (report.ts:171-186), und Zeile 148 prüft nichts dergleichen. MiniMax vergleicht dann einen Bericht eines anderen Commits mit dem Diff von `$sha`. Daraus entstehen Scheinbefunde der neuen Art «Erklärung nennt die Änderung nicht», oder fehlende Befunde.
- Beim `workflow_dispatch` gibt es überhaupt kein Warten (Zeile 101).

Der Test (fallback-review.test.ts:25) liefert den Bericht immer sofort und kann das deshalb nicht zeigen.

**Wie zeigen:** Die Zeitstempel eines echten Pull Requests ansehen, bei dem Copilot vor dem Ende von CI scheiterte: Der Fallback-Lauf liest `issues/$PR/comments` ungefähr bei CI-Ende + 60 s. Der Kommentar `<!-- review-report -->` wird erst am Ende des Laufs von «Pull request comments» erstellt oder aktualisiert. Alternativ lässt sich ein Test bauen, in dem der Mock für `issues/7/comments` beim ersten Aufruf leer antwortet: Der Request enthält dann «(no reviewer report)», ohne erneuten Versuch.

**Mögliche Behebung:** Den Bericht für genau diesen Head abwarten, zum Beispiel in der vorhandenen Warteschleife oder durch einen Trigger auf `workflow_run: [Pull request comments]` statt auf CI. Dafür müsste der Bericht seinen Head-SHA tragen, oder man vergleicht `updated_at` mit dem Ende von CI. Nach einer Frist geht es weiter mit «(no reviewer report)».

## Nicht bestätigt

- `bunx vitest run tools/ci/fallback-review.test.ts` (6 bestanden), eslint und prettier auf der Testdatei, `bun run check`: vom Aufrufer gemeldet. Ich habe keine Tests ausgeführt.
- Rotlauf der beiden neuen Tests (Bericht, Anweisung): vom Aufrufer gemeldet. Nach dem Lesen würden beide auf aff89c4b fehlschlagen: Die Basis lädt keinen Bericht in `messages[1]`, und der System-Prompt der Basis enthält keinen Satz «change the explanation does not name». Der Abschnitts-Test hält bestehendes Verhalten fest: `pr.md` enthielt schon auf der Basis den ganzen PR-Text (fallback-review.yml:131). Die Commit-Nachricht sagt das.
- `.github/workflows/fallback-review.yml` ist eine Gate-Datei: Der Pull-Request-Text braucht `Gate change approved: #1275`. Den PR-Text konnte ich nicht sehen.
- Lesezugriff des `GITHUB_TOKEN` auf `issues/$PR/comments` mit nur `pull-requests: write` (ohne `issues:`): nach GitHub-Doku zulässig (Kommentare zu Pull Requests über Pull-Request-Rechte), nicht auf GitHub ausprobiert.

Geprüft: Prompt-Text und jq-Aufbau des Requests, Fallback bei fehlendem Bericht, Filter auf Bot und Marker, Umbau des Tests von `statuses` zu `run` (nichts Unbenutztes, ponytail-review ohne Befund), kein Bezug zu App, `messages`, E2E oder a11y (No scenario passt, da nur CI).
