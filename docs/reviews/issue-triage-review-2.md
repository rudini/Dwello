# Review issue-triage, Runde 2 (Delta)

Commit: `f7e0650` (`git diff a1043b7..f7e0650`), Worktree `review-triage-code-reviewer`.
Gelesen: `.claude/skills/issue-triage/SKILL.md` (ganz, neue Fassung), `implementation_plan.md` (Diff), `docs/reviews/issue-triage-review-1.md` (identisch mit meinem Bericht aus Runde 1), `docs/reviews/issue-triage-guide-review-1.md` (Befunde G-7, G-10, G-13 und die Zusammenfassung).

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| C-1 | Major | behoben | `SKILL.md:35` nennt nur noch die Überschrift `## Proposed (confirm before starting)`; die Regel zu «Options» ist entfernt. |
| C-2 | Minor | behoben | `SKILL.md:12` `issue_write` mit `method: "update"`; `SKILL.md:51`: Issue vor dem Schreiben neu lesen, danach prüfen und bei fehlendem Label abbrechen. |
| C-3 | Minor | behoben | `SKILL.md:34` definiert die Themen-Labels im Skill selbst und schreibt sie nicht mehr `CLAUDE.md` zu. |
| C-4 | Minor | behoben | `SKILL.md:8` sagt nicht mehr «say so in the comment»; Zweifel regelt nur noch `SKILL.md:39`. |
| C-5 | Minor | behoben | `SKILL.md:31` «for step 4». |
| C-6 | Minor | offen (Plan-Punkt) | `implementation_plan.md:13`; den ersten Lauf startet der Owner von Hand. |
| C-7 | Nit | behoben | `SKILL.md:34` «the app does something other than what was decided or crashes». |
| C-8 | Nit | behoben (siehe C-11) | `SKILL.md:35`. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-9 | Minor | `SKILL.md:32`, `:51` | Regression durch die neue Reihenfolge: Labels werden erst in Schritt 6 geschrieben, also nach dem Kommentar. Bricht ein Lauf zwischen Schritt 5 und 6 ab (genau das, was «When to stop» bei einem fehlgeschlagenen Schreiben oder Limit vorsieht), steht im Kommentar «Labels added: `produkt` …», das Label ist aber nicht gesetzt. In der nächsten Nacht springt Schritt 2 direkt zu Schritt 6 und übergeht Schritt 3, so dass «plus those from step 3» leer ist: Das Issue bekommt `triaged` ohne die angekündigten Labels und wird nie wieder geprüft (Lücke aus Entscheid (2) bleibt dauerhaft, Kommentar falsch). Lösung: Schritt 2 auf «go to step 3, then step 6 (skip 4 and 5)» ändern. |
| C-10 | Minor | `SKILL.md:34`, `:40` | Laut der neuen Regel für nicht-funktionale Punkte soll «the comment» sagen, dass der Punkt in `offene-punkte.md` gehört. Die Bedingung für einen Kommentar in Schritt 5 nennt diesen Fall aber nicht (nur Label hinzugefügt, Thema unklar, Duplikat oder verwandt), und die Kommentarvorlage `:42-49` hat keine Zeile dafür. Ein wörtlich lesendes kleines Modell schreibt dann keinen Kommentar oder erfindet eine Zeile. Beides ergänzen. |
| C-11 | Nit | `SKILL.md:35` | Wörtlich `## Proposed …`; CI (`check-issues.mjs`) akzeptiert jede Überschriftenebene (`^#+ *Proposed`). «a heading (any level) `Proposed (confirm before starting)`» trifft auch `###`. |
| C-12 | Minor | `implementation_plan.md:22` | G-13 (Nit) ist nur als «noted» vermerkt. Laut `CLAUDE.md` Workflow 7 wird ein nicht behobener Minor oder Nit zu offener Arbeit (Issue oder Zeile in `offene-punkte.md`), und die Plan-Zeile nennt ihn als «open» mit Verweis darauf. |
| C-13 | Nit | `SKILL.md:16`, `:55` | Laut «Done means» tragen die 20 ältesten Issues `triaged`, «When to stop» lässt aber zu, dass weniger fertig werden. «… or the run stopped as in "When to stop"» würde das Ziel des Laufs eindeutig machen. |
| C-14 | Nit | `SKILL.md:34` | «(security, operations, performance, accessibility)» liest sich wie eine abschliessende Liste; `CLAUDE.md` "Open work" nennt zusätzlich Zuverlässigkeit, Usability und Wartbarkeit. «e.g.» ergänzen oder auf `CLAUDE.md` verweisen. |

Keiner der neuen Befunde ist Blocker oder Major: Kein Pfad schliesst, ändert oder entfernt etwas oder schreibt doppelt. Ein zweiter Kommentar ist durch `SKILL.md:32` und `:55` ausgeschlossen, ein verlorenes Label stoppt den Lauf (`:51`).

## Nicht bestätigt

- Keine Testsuite neu ausgeführt (kein Code geändert); Commit-Hooks laut Aufrufer bestanden.
- Weiterhin offen aus Runde 1: ob `list_issues` (MCP) Pull Requests liefert, ob `issue_write` die Label-Liste ersetzt, wie `SKILL.md:51` annimmt, und ob ein fehlendes Label `triaged` angelegt wird (C-6). Ein MCP-Tool stand mir nicht zur Verfügung.
- G-1 bis G-12 des Guide-Reviews habe ich nur geprüft, soweit sie in diesem Delta im Skill-Text stehen; ob sie den Bericht des Guide-Reviews ganz erfüllen, beurteilt dessen eigene Runde 2.
- Einen echten Haiku-Lauf konnte ich nicht durchführen.
