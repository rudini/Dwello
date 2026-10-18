# Slice-Review Runde 3 (Abschluss vor Push): Abrechnungsliste, Mietstage und fehlendes PDF (#248, #253)

Geprüft: Worktree `review-list-code3` (detached, 360d71e), nur das noch nicht geprüfte Delta:
(a) `git diff c359371 ca4a9d7` (7 Dateien, alle gelesen), (b) Merge 360d71e (`git show 360d71e --cc`, `git diff ca4a9d7 360d71e -- src/lib/server/statement.ts tests/contracts/statement.json`), dazu zur Gegenprobe `git diff 86c8233 360d71e --stat` (Branch gegen main nach dem Merge).

## Stand der Befunde aus Runde 2

| ID | Stand | Beleg |
|---|---|---|
| C-6 | geschlossen | PartiesPanel.svelte zeigt wieder nur `m.statements_rental_days(...)`; `git diff 86c8233 360d71e` enthält PartiesPanel.svelte nicht mehr, die Detailseite ist wie auf main. Die Detaildaten bleiben bei #104. |
| C-7 | geschlossen | Ohne die Detailänderung keine sichtbare Verhaltensänderung der Detailseite mehr; der DOM-Fall ist entfernt. |
| C-8 | erledigt | Die Zeile ist entfernt; ungenutzter Import `formatDate` ebenfalls. |
| C-9 | geschlossen | Die Session ist archiviert; die Zeile «Files» nennt jetzt «maps the stored `rentalStart`/`rentalEnd`» (docs/archive/implementation-plan-verlauf.md, Session #248/#253). |

## Merge 360d71e

- `src/__tests__/statement-mapping.test.ts`: beide Fälle bleiben erhalten (#247 «nennt das Heizprofil … als nicht angewendet» und #248 «übernimmt die abgerechneten Tage»), keine Duplikate, keine Konfliktmarker.
- `docs/archive/implementation-plan-verlauf.md`: die Sessions O-34, W4 und #248/#253 stehen hintereinander, je mit Leerzeile getrennt.
- `src/lib/server/statement.ts`: `profileName` von main (#247, `heatingShare.byDays`/`reason`) und `rentalStart`/`rentalEnd` aus diesem Branch stehen unabhängig nebeneinander in `toStatement`. Die Liste nutzt `toStatement` ebenfalls; `statements.json` hat weder `heatingShare` noch `heatingProfile`, `profileName` liefert dort `''` und die Zeile zeigt das Heizprofil nicht – kein Konflikt.
- `tests/contracts/statement.json`: durch den Merge nicht geändert (gegen main nur `rentalStart`/`rentalEnd`); `heatingShare: null` passt zu beiden Seiten.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-10 | Nit | docs/archive/implementation-plan-verlauf.md (Session #248/#253, Punkt «Persona re-run») | «P-1 resolved in the list» passt nicht ganz zum Bericht: dr-weber-list-3.md führt P-1 weiterhin als Minor («reicht das jetzt, eine Verwechslung ist aber nicht ganz ausgeschlossen»). Zutreffender: «P-1 Minor, stays in its report». |
| C-11 | Nit | docs/design/personas/dr-weber-list-3.md:11 | Der Persona-Lauf sah noch die Detaildaten, die ca4a9d7 wieder entfernt; P-2 (Reihenfolge Liste/Detail) ist damit gegenstandslos. Ein Satz im Bericht oder im Plan dazu würde Leser nicht in die Irre führen. |

Ponytail-Review des Deltas: das Delta entfernt nur Code (Detaildaten, Import, DOM-Fall, Planzeilen); nichts Ungenutztes bleibt zurück (`rentalStart`/`rentalEnd` in `StatementWithDetails` nutzt weiterhin `StatementRow.svelte`). Keine Befunde.

Keine Blocker, keine Majors.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (2627 pass), Backend-Type-Check, `api-contracts.pg.test.ts` (27 pass), `open-work.test.ts` (5 pass) auf 360d71e: vom Aufrufer gemeldet. Ein eigener Lauf von `bunx vitest run` für statement-mapping, statement-pages.dom und statement-list-load war im Worktree nicht möglich (Zugriff auf `node_modules` durch eine Berechtigungsregel gesperrt); die Merge-Auflösung ist nur durch Lesen bestätigt.
- E2E (chromium+api, Abrechnungs- und a11y-Zeilen, 152 pass) auf ca4a9d7: vom Aufrufer gemeldet; E2E auf dem Merge lief beim Review noch, Ergebnis nicht gesehen. Im Archiv ist «Before marking complete: … E2E» bereits abgehakt.
- Die Persona- und Review-Berichte (dr-weber-list-3.md, list-review-2.md) nur auf Ablage und Befundstand gelesen.
