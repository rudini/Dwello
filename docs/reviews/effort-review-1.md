# Code-Review: Effort medium gegen high (a65244ab, `git diff HEAD~1 HEAD`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docs/reviews/agent-effort-benchmark.md:70 | Zeile A, Spalte medium: «C-11 and C-12 partly (C-2, C-3)» liest sich so, als habe medium C-12 nur teilweise gefunden. Die Referenz C-12 (`233-review-3.md`, `git show c893731c^:docs/reviews/233-review-3.md`, Z. 10) hat zwei Teile: das Flake-Risiko von `Wait.until` am `<button>`-Platzhalter und die nie freigegebene Object-URL. Medium nennt beide, C-3 und C-2 in `cr233-medium.md`. Die high-Zeile zählt dieselbe Abdeckung (high C-5) als «C-12» ohne Einschränkung. Die Zeile stellt medium also schlechter dar, als der Lauf war. Am Entscheid ändert das nichts. Richtig wäre: «C-11 partly (C-2), C-12 (C-2, C-3)». |

Keine Blocker oder Major.

## Nicht bestätigt

- Die Token-Zahlen in E (A 115k → 108k, B 91k → 70k, C 118k → 91k, D 108k → 76k) stammen laut Dokument aus den Nutzungszeilen des Agent-Tools und stehen in keinem Bericht. Die high-Werte stimmen mit den Abschnitten A–D überein. Die Prozentangaben habe ich nachgerechnet: 6, 23, 23 und 30 %, also «6 to 30 %» bzw. «6 to 23 %». Die medium-Werte selbst konnte ich nicht prüfen.
- Gleiche Prompts und gleiche Fälle: Die Agent-Texte sind seit 294f77f6 unverändert (`git diff 294f77f6 HEAD~1 -- .claude/agents` ist leer). Ob die medium-Läufe denselben Prompt und dieselben alten Commits bekamen, sehe ich nur an den Kopfzeilen der Berichte (1d9d3019..a09ae7f6, ddce6ae..56635d3, 35db6f79, Marco mit denselben drei Dateien). Den Prompt selbst konnte ich nicht einsehen.
- Dass der fr459-medium-Lauf #459 auf GitHub las: Der Bericht nennt nur «Stand dieses Commits». Die Einschränkung in E habe ich nicht nachgeprüft.
- `bunx vitest run src/__tests__/open-work.test.ts` und Prettier auf den neuen Dateien: vom Aufrufer gemeldet. Ich habe sie nicht erneut ausgeführt, weil der Lesezugriff auf `node_modules` (Link nach `/home/user/Dwello`) verweigert wurde.

Geprüft: alle Zeilen von E gegen `*-medium.md` und `git show 294f77f6:docs/reviews/agent-effort/*-high.md` sowie gegen die Referenzbefunde (C-15 = Lösch-Dialog `invoice-delete-billed-document-note` in medium C-1, R-2 = `documents.recipient` in medium R-1, P-6/P-7 als Beobachtungen); Entscheidtabelle passend zu E; `effort: medium` in code-reviewer, fach-reviewer und persona; daten-pruefer bleibt `high`; keine weiteren Stellen nennen `effort: high`; die Session ist archiviert und aus `implementation_plan.md` entfernt; keine Änderung ohne Bezug zur Anforderung.
