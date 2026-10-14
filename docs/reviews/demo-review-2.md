# Code-Review Slice «demo», Runde 2

Delta `f25f635..ec3a822` (ein Commit, `ec3a822 chore(docker): apply demo review round 1`), gelesen im Worktree `review-demo-code-reviewer-2`. Ich habe alle sieben geänderten Dateien gelesen: `deploy/demo/.env.example`, `Caddyfile`, `README.md`, `docker-compose.yml`, `reset-demo.sh`, `docs/reviews/demo-review-1.md` und `implementation_plan.md`. Zum Abgleich habe ich zusätzlich `docker-compose.prod.yml` und `src/lib/server/jwt-config.ts` gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major (offen, Produktentscheid) | `deploy/demo/README.md:5` | Unverändert: Die Besucher erfahren nicht, dass die Daten geteilt und nachts gelöscht werden. Daraus wurde Issue #162 (offen, Labels `produkt` und `entscheiden`, geprüft über `gh api`). Nach Workflow 7 darf der Task damit enden, wenn C-1 unter «Blocked on me» steht. Weiterhin gilt: Ohne den Hinweis sollte die Demo nicht öffentlich gehen. |
| C-6 | Minor (teilweise behoben) | `implementation_plan.md:23` | ponytail-review lief und ist notiert. `tdd` und `ponytail` wurden mit Begründung nicht geladen; die Regel verlangt alle drei, wenn ein Slice Code ändert. Die Begründung ist plausibel: Der Fix am Dockerfile ist rot/grün belegt. Ob die Abweichung akzeptiert wird, entscheidet die Triage. |
| C-12 | Nit | `implementation_plan.md:22` | In der Zeile «Files:» fehlt `docs/reviews/demo-review-1.md`, das mit diesem Commit dazukam. |

## Status der Befunde aus Runde 1

| ID | Status | Nachweis |
|---|---|---|
| C-1 | offen, Issue #162 | siehe oben |
| C-2 | behoben | `README.md:23`: «Pay As You Go» ist jetzt Schritt 6, mit dem Kriterium «95. Perzentil unter 20 %». |
| C-3 | behoben | `README.md:70`: beschreibt, woran man einen fehlgeschlagenen Reset erkennt, und dass man das Skript von Hand erneut startet. |
| C-4 | behoben | `docker-compose.yml:6-11`: Anker `x-logging` mit `json-file`, 10m × 3. Er gilt für alle fünf Dienste (Zeilen 17, 21, 25, 32, 38). Der Kommentar «30 MB per container» stimmt. |
| C-5 | behoben | `docker-compose.yml:26-28`: `${POSTGRES_PASSWORD:?…}`. Compose interpoliert die ganze Datei, deshalb bricht auch jeder `compose`-Aufruf in `reset-demo.sh` bei leerem Passwort ab, bevor etwas gelöscht wird. Das Mapping im Overlay überschreibt den Schlüssel des Mappings in `docker-compose.prod.yml:86`. `DATABASE_URL` (`prod.yml:58`) nimmt dieselbe Variable aus `--env-file`. |
| C-6 | teilweise behoben | siehe oben |
| C-7 | behoben | `Caddyfile:4`: HSTS mit `max-age=31536000`, ohne `includeSubDomains`. Für eine Subdomain ist das richtig. |
| C-8 | behoben | `README.md:12`: Die Formulierung beschreibt jetzt die Docker-Weiterleitung richtig. |
| C-9 | behoben | `reset-demo.sh:11`: `trap 'exit 1' INT TERM`. Mit dash nachgeprüft (Testskript im Scratchpad): Nach SIGTERM läuft der EXIT-Trap und der Exit-Code ist 1. Das gilt, sobald der laufende Vordergrundprozess endet, also wird `compose start backend` auch nach einem Abbruch ausgeführt. |
| C-10 | behoben | `README.md:58`: `docker image prune -f`. `README.md:70`: Hinweis zur Grösse des Logs. |
| C-11 | abgelehnt, Begründung trägt | `implementation_plan.md:25`: Browser fallen still auf TCP zurück, und ein zusätzlicher Port samt Oracle-Regel bringt nichts Sichtbares. Ich nehme die Ablehnung an. |

Die Änderungen aus ponytail-review halten:
- `COOKIE_SECURE` fehlt in `.env.example`. `docker-compose.prod.yml:32` setzt `${COOKIE_SECURE:-true}`, und `jwt-config.ts:71` liest `'true'`. Die Cookies bleiben also `Secure`.
- `caddy_config` ist entfernt. `/config` enthält nur Caddys `autosave.json`. Mit einem Caddyfile wird es beim Start neu geschrieben, die Zertifikate liegen in `caddy_data`. Es geht also nichts verloren.
- Das Self-Hosting bleibt unberührt: `docker-compose.prod.yml` kommt im Delta nicht vor.

Es gibt keine neuen Blocker oder Majors.

## Nicht bestätigt

- `docker compose … config` mit leerem und mit gesetztem `POSTGRES_PASSWORD`, `docker compose -f docker-compose.prod.yml config` allein und `caddy validate` auf dem Caddyfile: vom Aufrufer gemeldet, nicht erneut ausgeführt (Docker ist mir untersagt). Die Logik habe ich aus den Dateien nachvollzogen.
- `sh -n reset-demo.sh`: selbst nochmals ausgeführt, ok.
- lint, test:coverage, check, Backend-Test und type-check auf `f25f635`: vom Aufrufer gemeldet. Das Delta ändert kein TypeScript (geprüft mit `git diff --stat`), deshalb habe ich sie nicht erneut ausgeführt. Der Plan hat den Punkt «Before marking complete» noch offen.
- Die Punkte aus «Nicht bestätigt» von Runde 1 bleiben offen: Build und Betrieb auf aarch64, Ollama auf 2 OCPU, die Compose-Mindestversion für `!reset`, die Felder im DNS-Formular von Infomaniak und HTTP-01 auf einer Oracle-VM.
- Wie das Upgrade auf Pay As You Go in der Oracle-Konsole heisst («Billing, Upgrade»): nicht geprüft, kein Zugang.
