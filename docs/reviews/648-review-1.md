# Code-Review #648, Runde 1 (origin/main..ae450427)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `tools/open-work/check-issues.mjs:87-89` | CI prüft ab diesem Commit `needs-decision`, auf GitHub heisst das Label noch `entscheiden`: fünf offene Issues mit «Proposed (confirm before starting)» lassen den CI-Schritt rot werden, bis das Label umbenannt ist. |
| C-2 | Minor | `.claude/skills/issue-triage/SKILL.md:33` | Der Zeilenumbruch vor dem Punkt `needs-decision` ist verloren gegangen: Die Regel «`needs-decision` ergänzen» steht jetzt am Ende des Punkts «Topic label» (`… in the comment.    - **`needs-decision`:** …`) und ist kein eigener Schritt mehr. |
| C-3 | Minor | `.claude/skills/issue-triage/SKILL.md:64` | «Blocked on me» nennt weiterhin «non-functional points». Seit #648 ist ein nicht-funktionaler Punkt ein normales Issue (`nfr`) und wartet nicht auf den Eigentümer. Der Eintrag stammt aus der entfernten Regel «gehört nach offene-punkte.md». |
| C-4 | Minor | `CLAUDE.md:89`, `.github/ISSUE_TEMPLATE/nfr.md:7` | Beide Stellen nennen `nfr:compatibility`, auf GitHub gibt es dieses Label nicht, und kein Issue braucht es. Laut Issue gibt es Kategorien nur, wenn ein Punkt sie braucht («others only if a point needs one»). Der Triage-Skill verlangt Labels, die «exactly» so geschrieben sind wie dort. |
| C-5 | Minor | `.github/ISSUE_TEMPLATE/decision.md:3,7` | `about:` spricht weiterhin von «A functional point», der neue Kommentar erlaubt aber auch `nfr` mit Kategorie. Dazu schreibt `nfr.md:16` für nicht-funktionale Punkte mit offener Entscheidung vor, das Label in `nfr.md` zu setzen. Die beiden Vorlagen widersprechen sich also, welche Vorlage gilt. |
| C-6 | Minor | `docs/archive/offene-punkte.md` (Zeile O-11, Spalte «Issue» = done) | Der Kopf erklärt O-11 mit `tests/contracts/categories.json` für erledigt. `src/__tests__/categories.test.ts:45-58` antwortet aber weiterhin mit einem selbst gebauten Objekt (`invoiceCount: '3'`). Damit gilt der Befund der Zeile («answers with its own fake») noch zum Teil. Erledigt ist nur «Decide / do». |

## C-1 (Major): CI wird rot, bis das Label umbenannt ist

`ci.yml:128` führt `check-issues.mjs` bei jedem Lauf aus. Das Skript geht alle offenen Issues durch und meldet einen Fehler, wenn ein Issue «Proposed (confirm before starting)» enthält, aber nicht das Label `needs-decision` trägt (`check-issues.mjs:78-90`). Abfrage am 23.10.2026 (`gh api repos/rudini/Dwello/issues?state=open`): Diese offenen Issues haben einen solchen Abschnitt und nur das Label `entscheiden`:

- #521
- #528
- #535
- #545
- #546

Die Liste der Labels enthält weder `needs-decision` noch `domain` oder `product`. So zeigt man den Fehler: `GITHUB_TOKEN=… node tools/open-work/check-issues.mjs` auf ae450427 meldet fünfmal `has "Proposed (confirm before starting)" but not the label needs-decision` und endet mit Exit 1. Der Pull Request lässt sich dann nicht auf grünem CI mergen. Bei einem Merge vor der Umbenennung wäre auch `main` rot, und damit jeder andere Pull Request.

Behebung, eine der beiden:
- Die Umbenennung durch den Product Owner (`gh label edit entscheiden --name needs-decision` usw., dazu `betrieb` löschen) kommt als Voraussetzung vor den Push unter «Blocked on me». Der Pull Request wartet als Entwurf darauf.
- `check-issues.mjs` akzeptiert übergangsweise beide Namen. Das braucht einen Test und später einen Schritt, der den alten Namen wieder entfernt.

Für die Issues #650–#754 gilt dasselbe: Sie tragen `entscheiden` und sind erst nach der Umbenennung korrekt. Die Umbenennung hängt also ohnehin am Product Owner.

## Nicht bestätigt

- `bun run lint` und `bunx vitest run src/__tests__/open-work.test.ts tools/open-work tools/claude-hooks/commit-msg-gate.test.ts tools/deepcheck/test/readme.test.ts` (42 bestanden): vom Aufrufer gemeldet. Ich konnte sie nicht erneut ausführen, weil der Zugriff auf `node_modules` von der Sandbox gesperrt ist.
- Rote Läufe der beiden Label-Tests in `check-issues.test.ts` und des neuen Tests in `open-work.test.ts`: vom Aufrufer gemeldet. Beim Lesen bestätigt: Auf der Basis existiert `docs/design/offene-punkte.md`, und `check-issues.mjs` prüft dort `entscheiden`. Beide Tests schlagen dort also fehl.
- Ob die Kategorien inhaltlich stimmen (z. B. instabile Tests O-10, O-26, O-43, O-45, O-47 unter `nfr:maintainability` statt `nfr:reliability`): Das ist eine Ermessensfrage, die ich nicht beurteilt habe.
- Ob die 105 Issues inhaltlich noch zutreffen: Gelesen habe ich nur #705 und dort die Abweichung bestätigt (Marker heute in `statement-run.service.ts:90`).
- Die Umbenennung der Labels auf GitHub und das Entfernen von `betrieb` stehen noch aus (Labelliste geprüft). Laut Issue ist das Sache des Product Owners.

Geprüft:
- Die Spalte «Issue» aller 107 Zeilen stimmt mit Titel und Labels von #650–#754 überein (105 Issues, alle offen, je `nfr` und genau ein `nfr:*`). O-11 und O-13 sind «done». Ausser dem Kopf und der neuen Spalte ist der archivierte Text unverändert.
- Nachgeführte Verweise:
  - `docs/PRD-Dwello.md`: O-3/O-6 → #719/#722
  - `docs/anforderungen-vertragsende.md`: U-3 → #653
  - `docs/architecture/baseline.md`: H-28 → #717
  - `docs/migration-mva.md`: O-8 → #723
  - `docs/test-pyramid.md`: H-10 → #700
- Ausserhalb von `docs/archive`, `docs/reviews`, Persona-Berichten und dem generierten `tools/arch-baseline/out` nennt keine Datei mehr `offene-punkte.md` oder ein deutsches Label.
- Die Regel «Open work» in `CLAUDE.md` passt zu `issue-work`, `grill-me`, `slice-review`, `pull-request` und `fach-reviewer`.
- Prettier auf `nfr.md` und auf der Archivdatei läuft durch.
- Commit-Subjects sind konform. Kein Teil des Diffs gehört nicht zur Anforderung. Nach ponytail-review ist nichts überflüssig.
