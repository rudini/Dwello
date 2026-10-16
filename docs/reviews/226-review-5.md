# Code-Review 226, Runde 5: Flaky «Beleg ersetzen» (Commit 53712686)

Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-226-flaky` (detached, 53712686). Diff: `git show 53712686` (3 Dateien, alle gelesen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-14 | Nit | tests/e2e/steps/invoice-upload.steps.ts:117 | Der Kommentar verweist auf «(O-31)», diese Zeile löscht der gleiche Commit aus `docs/design/offene-punkte.md`. Der Verweis zeigt also ins Leere. Besser ohne Verweis oder mit «#226». |
| C-15 | Nit | tests/e2e/steps/invoice-upload.steps.ts:115-118 | Nach `tests/e2e/CLAUDE.md` warten Tasks auf den Zustand, zu dem sie führen. Hier wartet der Step und nicht `replaceBeleg` (tasks/invoice-upload.ts:89). Das ist zulässig und entspricht dem bestehenden Muster (`contract-form.steps.ts:149`, `tenants.steps.ts:91`). Hätte `replaceBeleg` selbst mit `Wait.until(successToast)` gewartet, wäre das sauberer gewesen, denn dann nutzt jeder künftige Aufrufer die Wartelogik. Kein Merge-Hindernis. |

Keine Blocker, keine Major.

## Bewertung

- **Schliesst der Fix das Race?** Ja. `InvoiceBeleg.svelte:39-50` ruft `addToast('success', m.invoices_beleg_saved(...))` erst auf, nachdem `await api.put(...)` ohne Fehler zurückgekommen ist. Die BFF-Route (`src/routes/api/invoices/[id]/document/+server.ts`) leitet die Antwort des Backends synchron weiter. Das Backend (`backend/src/routes/invoices.ts:210-224`) antwortet erst nach `await setBeleg(...)`. Sobald der Toast erscheint, ist die neue Datei also gespeichert. Die Rechnungsseite lädt nichts neu, und der Link bleibt `/invoices/{id}/document`. Deshalb holt `OpenInNewTab` (`screenplay/interactions.ts:126-132`, ein Request auf die href) nach dem Toast die neue Datei. Ohne Fix gab es beim Ersetzen ein Fenster: Der Link stand von Anfang an da, und `getAttribute`/`request.get` liefen sofort. Das deckt sich mit «Received "huber-q1.pdf"».
- **Pollt das Warten?** Ja. `actor.sees` ist `expect.poll` (`screenplay/actor.ts:47-48`). Der Erfolgs-Toast bleibt 8 s stehen (`src/lib/stores.ts:39`), das reicht für das Polling. Der Text «Beleg {name} gespeichert.» (`messages/de.json:840`) passt per `toContain` auf `Beleg huber-q1.jpg gespeichert`. Die Feature-Datei läuft in Deutsch.
- **Szenarien, die den Step nutzen:** Nur zwei Szenarien verwenden ihn, nicht drei: «Beleg ersetzen» (invoice-detail.feature:47-51) und «Beleg zu einer erfassten Rechnung hinzufügen» (:53-56). «Warnung beim Ersetzen des Belegs einer abgerechneten Rechnung» (:58-65) enthält keinen Wenn-Schritt. Das Szenario prüft nur die Warnung auf der Seite, der Fix berührt es nicht. Beim Hinzufügen gab es das Race nicht: Den Link gibt es erst nach `invalidateAll`, also nach dem PUT, und `getAttribute` wartet auf ihn. Dort kostet das zusätzliche Warten nichts und schadet nicht. Das Feature ist nicht `@api`, nur der UI-Pfad ist betroffen.
- **Schichten (tests/e2e/CLAUDE.md:29):** Der Step ruft nur einen Task (`replaceBeleg`) und eine Question (`confirmation` aus `questions/contract-form.ts`) über den Actor auf. Er hat weder `page` noch Locator noch `expect`. Questions aus `contract-form` werden schon in `tenants.steps.ts:3` wiederverwendet. Die Question liefert den Text selbst, nicht ja/nein.
- **Einfacher oder richtiger?** Die Alternative wäre, in `replaceBeleg` zu warten (C-15). Gleich kurz, nicht richtiger. Ein Retry in `OpenedFile` ginge nicht, weil die Question eine gemerkte Antwort liest. Der gewählte Fix ist minimal.
- **Formatierung:** `bunx prettier tests/e2e/steps/invoice-upload.steps.ts | diff …` zeigt keinen Unterschied.
- **Doku:** Die Zeile O-31 ist korrekt entfernt. Der Archiv-Eintrag beschreibt Ursache, Fix und Rot-Nachweis («1 failed … Received "huber-q1.pdf"»). Für einen Fix, der nur Tests ändert, reicht das. `implementation_plan.md` enthält keine offene Session, also passt der Eintrag ins Archiv.

## Nicht bestätigt

- lint sauber, check mit 0 Fehlern: vom Aufrufer gemeldet.
- «Rechnungsdetail» 312/312 mit `--repeat-each=8 --workers=6`: vom Aufrufer gemeldet. Ich habe kein E2E gestartet, das ist nicht erlaubt.
- Zwei volle E2E-Läufe mit dem Fix: laut Aufrufer noch nicht fertig, Ergebnis unbekannt.
- Ob CI auf #242 genau an diesem Szenario rot war: Laut Archiv-Eintrag sind Log und Report nicht lesbar. Belegt ist nur der lokale Fehlschlag. Ein anderer Grund für das rote CI ist damit nicht ausgeschlossen.
