# Review #840 (axe in vier Shards), Runde 1

Bereich: `git diff origin/main be6fa94a` (ein Commit), Worktree `review-i840-cr`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | implementation_plan.md:3 | Die Überschrift `## Session: #840 …` hängt am abgeschnittenen Kopfsatz (`… allows one \`## Session: #840 …`) statt auf eigener Zeile. Damit ist sie keine Überschrift: `open-work.test.ts:44` (`/^## Session/gm`) zählt 0 Sessions, und das Archivieren (Schritt 8) findet keinen Session-Block. Der Kopf selbst wurde schon auf `main` in 809ff3de auf 124 Bytes gekürzt (vorher u. a. «… allows one `## Session`.» und die Regeln Start/während/Ende/parallele Sessions); da der Slice die Datei ändert, wäre der Kopf aus b8e5dcc0 wiederherzustellen und die Session darunter mit Leerzeile zu beginnen. |

Keine Blocker, keine Major.

Geprüft: Matrix der Changes-Jobs per jq für Pull Request (9 Einträge) und `main` (16) nachgerechnet, axe 1/4 bis 4/4 mit `--shard=n/4`; `shards` liefert 4 für «Accessibility (axe)», `e2e-results` (ci.yml:290–304) vergleicht mit diesem Wert und zählt Jobs per Präfix «Accessibility (axe) (», die erforderlichen Checks bleiben die aggregierten Namen; `per_page=100` reicht für 16 Shard-Jobs; keine weitere Stelle in `.github/`, `tools/ci/`, `docs/test-pyramid.md` nimmt drei axe-Shards an (`docs/architecture/risks-and-tradeoffs.md:86` «11–16 min in drei Shards» ist die Messung von Run 868 und bleibt als solche wahr); Doku-Texte in `test-pyramid.md:103` und `utility-tree.md:139` stimmen mit dem Code überein; ponytail-review: kürzeste Änderung, nichts Ungenutztes (die doppelte 4 in `shards` und Matrix bestand schon mit 3). Kein Szenario nötig (nur CI-Konfiguration).

## Nicht bestätigt

- Langsamster axe-Shard unter 11 min: erst nach dem Merge messbar (Lauf auf `main`).
- `bunx playwright test --list --project=chromium --grep @a11y --shard=n/4` mit 68/68/68/67 = 271: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Die Changes-Skript-Ausführung mit yaml-Extraktion für beide Events: vom Aufrufer gemeldet; selbst nur den jq-Teil der Matrix nachgerechnet.
- Verhalten von `e2e-results` im echten Lauf (Zählung über die Actions-API): nur gelesen, ci.yml:283–304.
