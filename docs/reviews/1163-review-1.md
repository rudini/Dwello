# Code-Review #1163, Runde 1 (67c42ed79)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `tests/e2e/tasks/contracts.ts` (einzige geänderte Datei). `findContract` fragt `Visibility.of(contractRow(…))` sofort ab (`isVisible`, wartet nicht) und sucht nur dann mit dem bestehenden `searchContracts`. Dieses wartet auf `?search=`, danach wartet `Click` auf die Zeile. Das gleiche Muster gibt es schon in `tasks/accessibility.ts:265` und `tasks/invoice-upload.ts:93`, die Screenplay-Schichten sind eingehalten. Alle drei Aufrufer gehen von der Liste aus: contracts.feature Grundlage über `Navigate.to` + hydrated; contract-edit.feature:494; contract-new.feature:45 nach `pageAddress /contracts$`. Ob die Zeile nach dem Speichern schon gerendert ist, kann dort kurz offen sein. Im ungünstigen Fall sucht der Schritt unnötig, findet den Vertrag aber trotzdem, und danach prüft kein Schritt die Adresse. Der Schritt ist ein Wann-Schritt und keine Prüfung. Er klickt weiterhin die Zeile der Liste, die Prüfung «Detailseite …» ist unverändert. Damit ist weder eine Prüfung gelockert noch umgeleitet, und es braucht kein `Spec change approved`. Die Strict-Mode-Lage ist bei mehreren Treffern gleich wie vorher beim `Click`. Die Commit-Nachricht nennt `No scenario: a test-only fix`. Für eine reine Teständerung ohne App-Verhalten ist das zulässig. Nichts im Diff ist fremd zur Anforderung.

## Nicht bestätigt

- E2E chromium + api für contracts.feature, contract-new.feature und contract-edit.feature, 139 bestanden: vom Aufrufer gemeldet.
- Red-Lauf mit einer vorübergehenden Vorbedingung von 13 späteren Verträgen (TimeoutError bei «… ansieht»), grün mit dem Fix, Vorbedingung wieder entfernt: vom Aufrufer gemeldet. Der Commit enthält die Vorbedingung nicht mehr (Diff gelesen). Den Red-Lauf selbst kann ich nur aus dem Code ableiten: Vorher klickte der Task ohne Suche, eine Zeile auf Seite 2 lief also in den Timeout.
- `bun run lint`, `bun run check`: vom Aufrufer gemeldet.
- Anforderung «der Scenario besteht in einem vollen parallelen Lauf»: Es ist kein vollständiger paralleler E2E-Lauf gemeldet, nur die drei Features. Nicht bestätigt.
- Dass die Listensuche den Mieternamen mit Suffix eindeutig trifft: gestützt auf das bestehende Szenario «Mietverträge nach Mieter suchen» (contracts.feature:18), nicht selbst ausgeführt.
