# Code-Review 1372, Runde 3 (Abschlussrunde vor Push), Commit 994e9758

Bereich: `git diff 66699b13 994e9758 -- . ':!docs/reviews' ':!docs/design/personas'`

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | messages/de.json:2322 (ebenso fr/it/en:2322) | `backend_ki_address_invalid` sagt jetzt «Die Adresse beginnt nicht mit https:// oder http://». `KI_ADDRESS_INVALID` kommt aber auch, wenn `URL.parse` eine Adresse **mit** Schema verwirft (`ki-settings.service.ts:147`). Das passiert etwa bei einem Tippfehler in der IP im eigenen Netz (`http://192.168.1.300:11434/v1`: das letzte Label ist numerisch, also wird es als IPv4 gelesen, und 300 > 255 macht das Parsen ungültig), bei einem Port über 65535 oder bei einem Leerzeichen im Host (`https://api anbieter.ch/v1`). Dann sagt der Text etwas Falsches über die Adresse. |
| C-2 | Minor | messages/de.json:2324 (ebenso fr/it/en:2324) | `backend_ki_address_credentials` sagt «Löschen Sie alles nach «https://» bis und mit «@»». Anmeldedaten werden aber vor der Frage http/https geprüft (`ki-settings.service.ts:149`), also trifft der Text auch auf `http://nutzer:geheim@192.168.1.10:11434/v1` zu, eine im eigenen Netz erlaubte http-Adresse. Dort steht kein «https://», und der Text nennt eine Stelle, die es nicht gibt. |
| C-3 | Minor | messages/it.json:2324 | «La chiave API si trova nel Suo conto presso il fornitore»: «conto» ist in der App das Bankkonto (`i18n-begriffe.md:124`, Kontoinhaber → «titolare del conto»). Für das Benutzerkonto verwenden die Glossarzeile 146 (#576, «account con password») und `login_intro`/`login_error_not_allowed` «account». Mit «conto presso il fornitore» liest man ein Bankkonto beim Anbieter. |

Keine Blocker/Major.

Geprüft: Ich habe `OWN_NETWORK` gegen die WHATWG-Normalisierung von `url.hostname` geprüft:
- IPv4 kommt immer als Vierer-Dezimalform an (`0xa.1`, `167772161` → `10.0.0.1`, also abgedeckt).
- Namen mit nicht numerischem letztem Label bleiben Domänen und gelten nach der Verankerung nicht mehr als eigenes Netz.
- IPv6 kommt komprimiert und klein geschrieben an. Ein Hextett aus fc00::/7 hat immer vier Ziffern, also passt `f[cd][\da-f]{2}:` genau, und `[fc::1]` wird zu Recht abgelehnt.
- IPv4-mapped (`[::ffff:a00:1]`), `fe80::`, `169.254.x` und Namen mit Punkt am Ende werden konservativ abgelehnt.

Die drei neuen Ablehnungszeilen schlagen gegen die Präfix-Regex der Basis fehl. Das gilt auch für `[fc::1]`, weil die alte Regex `\[f[cd]` darauf passte. Die beiden Frontend-Texttests schlagen gegen die alten Texte fehl.

Französische Typografie: In beiden geänderten Texten stehen Guillemets und « ; » mit geschütztem Leerzeichen (U+00A0), wie in `backend_ki_address_suffix` und nach `i18n-begriffe.md:5`.

Die geänderte Beispielzeile in `ki-einstellungen.feature` gehört zu einem Szenario, das auf `origin/main` fehlt, ist also neu in diesem PR und frei. Der Vertrag `ki-settings-address-invalid.json` bleibt gültig, weil der Backend-Text unverändert ist. ponytail-review: kein Befund.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - lint, check, backend type-check, fitness `--base origin/main`
  - `vitest --changed origin/main` (663)
  - backend `ki-settings.pg` (35), `api-contracts.pg` + `compose-prod` (137)
  - E2E `-g "KI in den Einstellungen"` chromium (29 passed)
  - Rotlauf der drei Backend-Zeilen und der zwei Frontend-Texte. Ich habe nur durch Lesen beurteilt, dass sie ohne die Änderung fehlschlagen.
- Dass Bun mit `URL.parse` dieselbe Hostnamen-Normalisierung liefert wie WHATWG (IPv4-Kurzformen, IPv6-Kompression): Ich habe sie nach der Spezifikation beurteilt, nicht ausgeführt.
