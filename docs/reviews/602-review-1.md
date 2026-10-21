# Code-Review #602, Runde 1 (354db6f..6187867)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Ursache

Die Ursache ist bestätigt. `src/lib/overview.ts:219` (Basis) zog `outdatedStatements` (aus `/statements/outdated`, das in `backend/src/services/statement-invoices.service.ts:116-139` alle Abrechnungen selbst liest und je Abrechnung `statementChanges` prüft, also langsam ist) von `figures.statements.draft` (aus `/dashboard`, `backend/src/routes/dashboard.ts:117`) ab. Beide Abfragen laufen parallel in `Promise.all` (`src/routes/dashboard/+page.server.ts:170-187`) und lesen die Datenbank zu verschiedenen Zeitpunkten. Laut `tests/e2e/CLAUDE.md:78` teilen sich parallele Szenarien dieselbe Datenbank, nur die Namen sind eindeutig. Ein paralleles Szenario kann den Wert auf zwei Arten auf ≤ 0 drücken:
- Es legt nicht aktuelle Entwürfe an, nachdem `/dashboard` gezählt hat.
- Es räumt seine nicht aktuellen Entwürfe weg, bevor `/dashboard` zählt, aber nachdem `/statements/outdated` gelesen hat.

Beide Fälle sind möglich. Der Fix deckt beide ab.

Andere Wege, auf denen die Aufgabe verschwinden könnte, wurden geprüft:
- Brunos Entwurf in «Ahornhof <hex>» kann nicht unter die nicht aktuellen fallen, weil der Gebäudename eindeutig ist und das Szenario keine Rechnung für dieses Gebäude erfasst.
- Er steht in der Entwurfsliste, solange es höchstens 1000 Entwürfe gibt (Sortierung `statementDate desc`, `backend/src/services/statement.service.ts:189`; Szenarien räumen auf).
- Die Entwurfsliste hat dieselbe Statusbedingung wie die Zählung (`statusCondition('draft')` bzw. `eq(status, 'draft')`, `statement.service.ts:127`).

Mit dem Fix gilt `listed ≥ 1` im Szenario daher unabhängig von parallelen Läufen.

## Fix und max()

`overview.ts:221-222`: Bei einem einzelnen Nutzer und einem gleichbleibenden Datenbankstand sind beide Werte gleich. Die nicht aktuellen Entwürfe sind eine Teilmenge der Entwurfsliste, die Liste umfasst alle Entwürfe, also gilt `listed = count − outdated`. Die Randfälle:
- **Mehr als 1000 Entwürfe:** Die Liste ist abgeschnitten, also gilt `listed ≤ count − outdated` und die Zählung gewinnt wie bisher.
- **`/statements/outdated` nicht erreichbar:** `outdated = []` und `listed = |Liste| ≤ count`, also wie bisher.
- **Entwurfsliste nicht erreichbar:** `listed = 0` und die Zählung gewinnt; der bestehende Test `dashboard.test.ts:361` deckt das ab.

Eine zu hohe Zahl entsteht nur, wenn Entwürfe zwischen den beiden Abfragen versendet oder gelöscht werden. Das kann nur ein gleichzeitiger zweiter Tab desselben Nutzers während eines Seitenaufbaus von wenigen hundert Millisekunden auslösen, und der nächste Aufruf korrigiert die Zahl. Das ist kein realer Fall für einen einzelnen Nutzer.

Die Erhöhung von `limit=100` auf `limit=1000` (`+page.server.ts:184`) wirkt auch auf `oldAddresses(drafts)` (A-5, #114): Diese Funktion sieht jetzt bis zu 1000 Entwürfe statt 100. Das ist für den Nutzer eine Verbesserung und kein Defekt. Der Schlüssel in `dashboard.test.ts:120` ist entsprechend angepasst.

## Tests

Der neue Test `overview.test.ts:287-298` ist ohne die Änderung rot, nach Lesen geprüft:
- Mit `draft: 3` und den nicht aktuellen Entwürfen s1 bis s3 ergibt die Zählung 0, es entsteht keine Aufgabe `drafts`, und `find(...)!.text` wirft.
- Mit der Änderung zählt s5, also 1.

Der Vorgabewert `draftIds` im Helfer (`overview.test.ts:25-26`) passt zu den IDs s1 bis s3 der Fixture, deshalb ändern sich die bestehenden Erwartungen nicht. Ein Szenario fehlt zu Recht («No scenario»): Die Wettlaufsituation lässt sich nicht gezielt herstellen, und das fehlschlagende Dashboard-Szenario bleibt der Abnahmetest.

Geprüft: Korrektheit, Ponytail (kein ungenutzter Code, kein kopierter Helfer), keine fremden Änderungen, keine neuen Texte, keine API-Antwort geändert (Vertrag unberührt).

## Nicht bestätigt

- Lint, check, die 77 Unit-Tests sowie E2E `dashboard.feature` (chromium und api, 50): vom Aufrufer gemeldet. Ein erneuter Lauf mit `bunx vitest run` war nicht möglich, weil `node_modules` im Worktree fehlt und der Zugriff auf `/home/user/Dwello/node_modules` gesperrt ist.
- Rot-Lauf des neuen Unit-Tests: vom Aufrufer gemeldet, nach Lesen plausibel (siehe oben).
- Dass genau diese Wettlaufsituation den CI-Lauf 39661158682 auslöste: Das Log wurde nicht eingesehen. Die Ursache ist aus dem Code abgeleitet und plausibel.
