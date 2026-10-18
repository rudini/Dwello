# Code-Review #419, Runde 1 (fe09f93c..c9a2dabb)

Worktree: `/tmp/claude-0/-home-user-Dwello/33eb7cd0-d0c6-546d-8855-dc41f9efd6d8/scratchpad/review-419-code` (detached, c9a2dabb). Alle 10 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | README.md:305 | «Done means» verlangt, dass `git grep -n "qwen2.5vl"` ausserhalb von Reviews und Archiv nichts findet. Der neue Upgrade-Hinweis nennt `qwen2.5vl:7b` zweimal. Der Hinweis ist sinnvoll: Er sagt bestehenden Installationen, wie sie das alte Modell behalten. Er weicht aber vom Wortlaut des Issues ab. Die Abweichung gehört mit Begründung in die PR (CLAUDE.md, «Coding guidelines»). |
| C-2 | Minor | README.md:305 (mit :303) | Der Upgrade-Hinweis für Installationen, die sich auf das alte Standardmodell verlassen, sagt nur «Pull it (command above)». Ollama 0.12.7+ steht nur im Absatz darüber, und der richtet sich an die Umstellung von `OLLAMA_*`. Eine Installation mit einem älteren, lokal gecachten `ollama/ollama:latest` scheitert beim Pull. Vorschlag: im Hinweis zuerst das Ollama-Image aktualisieren lassen (z. B. `docker compose -f docker-compose.prod.yml pull ollama`, danach `up -d`). |
| C-3 | Nit | implementation_plan.md:4-5 | Vor `## Session …` stehen zwei Leerzeilen statt einer. |

Keine Blocker oder Majors.

### Ponytail-Review

Lean already. Ship. (Reine Wertersetzung an den genannten Stellen. Der eine neue README-Absatz ist der einzige Zusatz. Er deckt die Zeile «an installation that sets `LLM_MODEL` keeps its model» für bestehende Betreiber ab und ist keine Spekulation.) net: -0 lines possible.

## Abgleich mit «Done means»

- **Standard ohne `LLM_MODEL` / gesetztes `LLM_MODEL` bleibt:** `backend/src/config/llm.ts:21` (`process.env.LLM_MODEL || 'qwen3-vl:8b-instruct'`) und `docker-compose.prod.yml:65` (`${LLM_MODEL:-qwen3-vl:8b-instruct}`) erfüllen das. Ein eigener Test für eine Konstante wäre wertlos. Bestätigt durch Lesen.
- **Alle Nennungen:** `.env.example:63`, `docker-compose.prod.yml:65/114`, `docker-compose.dev.yml:45`, `README.md:33/301/303`, `deploy/demo/README.md:74`, `docs/tech-stack.md:16/78/269/272/274/332/526`, `docs/PRD-Dwello.md:76/1476`. Ausnahme: C-1. Der Diagrammkasten in `tech-stack.md` bleibt bündig (alle Zeilen 57 Zeichen). `backend/CLAUDE.md:51` nennt nur `<model>` und ist damit korrekt. Das OpenRouter-Beispiel nennt `qwen/qwen3-vl-8b-instruct` «(the default model)». Die ID gibt es in der Modellliste von `openrouter.ai/api/v1/models`.
- **`backend/CLAUDE.md:18`:** OpenRouter-Lauf mit `LLM_BASE_URL`/`LLM_MODEL` wie verlangt; der Schlüssel kommt vom Proxy. Der Lauf zählt als der des Standardmodells. `Refs` statt `Fixes` gilt nur noch ohne OpenRouter-Zugang. Konsistent mit `CLAUDE.md:94` und `.claude/skills/pull-request/SKILL.md:24` («KI case»). `llm-eval.ts` ruft `llmRecipient()` nicht auf, der Lauf braucht also kein `LLM_PROVIDER`. `scripts/migrate.ts` existiert.
- **llm:eval 43/47:** In #415 belegt (Kommentar vom 2026-10-17 11:05Z: `qwen/qwen3-vl-8b-instruct` via Parasail, 43/47, vier Fehler). `llm-eval.ts` hat 47 Fälle. Nach dem Lauf änderte sich bis fe09f93c in `backend/src` nichts mehr; der letzte Merge vor fe09f93c (919e299f, 10:48Z) war früher und betraf nur Tests. Diese Slice ändert keinen Prompt, die Wiederverwendung ist also zulässig.
- **Ollama-Mindestversion:** `README.md:303` nennt «Ollama 0.12.7 or later». Zur Platzierung siehe C-2.
- **Szenario:** keines. Die Slice ändert nur Konfiguration und Doku; das Verhalten der App bleibt gleich, solange das Modell vorhanden ist. Das passt zum Issue.
- **README-Satz «until one of them is done, the KI suggests nothing»:** Passt zum Code. Bei einem unbekannten Modell wirft `callLlm` (`llm.service.ts:94`) bei `!response.ok`, und die App macht keinen Vorschlag.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die drei Backend-Tests (17 pass) und die vier Regel-Tests (40 pass): vom Aufrufer gemeldet, nicht erneut ausgeführt. Der Diff ändert keinen Code, den diese Tests prüfen, ausser einer String-Konstante.
- Dass der Ollama-Tag `qwen3-vl:8b-instruct` existiert und dass Qwen3-VL Ollama 0.12.7+ braucht: `registry.ollama.ai` antwortete über den Proxy mit 403. Nur aus dem Issue bzw. der Produktentscheidung übernommen.
- Manuelle Prüfung beim Einlesen von zwei Belegen: nur im Plan (`implementation_plan.md:12`) beschrieben, nicht nachvollziehbar.
- Ob die PR den Score 43/47, `No scenario: <reason>` und die Abweichung aus C-1 nennt: Es gibt noch keine PR.
- Ob `qwen3-vl:8b-instruct` auf CPU-Hardware (Demo: Oracle A1, 2 OCPU) mit `LLM_TIMEOUT=30000` rechtzeitig antwortet: nicht messbar, kein Modell lokal. Das galt schon für das alte Modell.
