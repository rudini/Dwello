# Code-Review 1113, Runde 2 (Delta aafe3b366..f75939221)

Geschlossen: C-1, C-2

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Major | src/lib/focus-after-action.ts:49 | Der Fix für #1123 ändert, wohin der Fokus nach dem Löschen geht. Mit der Anforderung #1113 (wo die Erfolgsmeldung steht) hat er nichts zu tun. Er gehört in einen eigenen Slice für #1123 oder braucht eine Freigabe. Ein Szenario dafür fehlt, und #1123 bleibt dabei offen. |

## C-3 (Major): Fix für #1123 ausserhalb der Anforderung

Die Anforderung von #1113 betrifft nur, wo die Erfolgsmeldung steht. Der Diff ändert zusätzlich `refocus()`. Bisher ging der Fokus auf die Überschrift der Liste bzw. den Seitentitel, wenn die gemerkte nächste Zeile beim selben Neuladen ebenfalls verschwunden war. Neu geht er auf die Zeile, die jetzt an der Stelle `at.index` steht. Das ist eine Verhaltensänderung für ein anderes Issue. #1123 ist offen, sein «Done means» verlangt mehrere grüne Läufe auf Firefox, und laut dem eigenen Kommentar bleibt es offen. CLAUDE.md, «When to ask», verlangt vor Arbeit ausserhalb des Auftrags eine Rückfrage. Die Prüfliste dieses Reviews sagt: «Nothing in the diff is unrelated to the requirement».

Der Fix behebt zudem nicht, was der Aufrufer im E2E-Lauf sah. Der Schritt `steht der Fokus auf der Kategorie, die in der Liste auf "…" folgte` vergleicht mit der vor dem Löschen gemerkten Folgezeile. Löscht ein paralleler Lauf diese Zeile, schlägt der Schritt vor und nach dem Fix fehl. Vorher stand der Fokus auf dem Seitentitel, jetzt auf «Heckenschnitt Ost …». Der Lauf mit `--repeat-each 2` (1 von 98 rot) zeigt das. Was rot bleibt, ist ein Isolationsproblem nach `tests/e2e/CLAUDE.md`, «Rules». Es zählt als Major, und dieser PR löst es nicht.

So zeigt man es: `git diff aafe3b366 f75939221 -- src/lib/focus-after-action.ts` lesen. Die Änderung berührt weder `ToastRegion.svelte` noch, wo die Meldung steht. Das Issue #1123 (REST, Kommentar) nennt den Fix als Teil von f75939221 und lässt das Issue offen.

Ausweg: Den Fix samt dem DOM-Test in `focus-after-action.dom.test.ts` in einen eigenen Slice bzw. PR für #1123 verschieben. Alternativ die Rückfrage stellen und im PR nennen, dass er #1123 nur teilweise behebt. In beiden Fällen gehört ein Szenario dazu (oder `No scenario: <reason>`, weil der Zustand nur entsteht, wenn gleichzeitig ein anderer Tab löscht). Der Fix ist für sich korrekt. Ist die Zeile die letzte, liefert `children[index]` `undefined`, und es bleibt beim Rückfall auf die Überschrift. Der neue DOM-Test schlägt ohne den Fix fehl.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `bunx vitest run --changed origin/main` (69 bestanden), jeder neue DOM-Test rot vor seinem Fix, E2E Chromium `--grep "Erfolgsmeldung|Fokus|Zugangsschlüssel|Kostenkategorien" --repeat-each 2` (97 bestanden, 1 rot, siehe C-3) und die beiden Fokus-Szenarien mit `--repeat-each 6` (12 bestanden).
- Beim Lesen sind die neuen Tests rot ohne die Änderung. Gruppentest: Ohne `data-focus-row` liefert `closest` `null`, und der Knopf allein (unten bei 698) liegt über der Grenze 736. Test der hohen Zeile: Der alte Code misst die Zeile (bis 900) und stellt die Meldung oben hin, der neue nicht, weil `focus.top` (20) kleiner als 32 ist. Test der Zugangsschlüssel: Ohne das Attribut ist `groups[0]` `null`.
- Ob Helga P-1/P-2 aus `docs/design/personas/helga-1113.md` (Knopfreihe des neuen Schlüssels bei 150 % und 200 %) mit `data-focus-row` im Browser wirklich frei werden, hat kein E2E-Lauf gezeigt. Für die Gruppe gibt es nur DOM-Tests, und jsdom misst die Meldung mit der Höhe 0. Helga P-3 (Fokus nach «Änderungen speichern») fällt nicht unter die Regel von #1113, wie schon in Runde 1.

Geprüft: Die Bedingung `focus.top >= own.height + 32` entspricht dem oberen Platz der Meldung (`top-4`, 16 px Rand). `data-focus-row` umschliesst alle drei Knöpfe in `NewAccessKey.svelte`. Der Delta enthält keine neuen Texte, Bildschirme oder Token-Verstösse.
