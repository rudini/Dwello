# Code-Review #770, Runde 1 (0ab8f915..5082bd2f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/fuel-stock.service.ts:77, backend/src/services/invoice-completeness.service.ts:286 | Sichtbare Verhaltensänderung ohne Szenario; die Begründung «No scenario» trifft für beide Stellen nicht zu |

## C-1 (Major): Szenario fehlt, «No scenario» hält nicht

Die Änderung ist für den Liegenschaftsverwalter sichtbar: der Verteilschlüssel der Zeile für den Tankbestand in der Nebenkostenabrechnung (und damit die Beträge je Mietpartei), und die Reihenfolge der Liste «Rechnungen ohne Leistungszeitraum» bzw. der nachträglich erfassten Rechnungen in der Vorschau (`PreviewChecks.svelte`). Nach `CLAUDE.md`, «Always check» bzw. Workflow 1, braucht das ein Szenario ohne `@wip`. Die angegebene Begründung («the E2E stack cannot make PostgreSQL's stored row order differ from the order of entry») steht nicht in der Liste von `tests/e2e/CLAUDE.md`, «No scenario», und stimmt für beide Stellen nicht:

- **Tankbestand:** Hier muss die gespeicherte Reihenfolge gar nicht von der Reihenfolge der Erfassung abweichen. Der neue pg-Test erfasst die beiden Rechnungen in der natürlichen Reihenfolge (zuerst «Per Area», dann «Per Unit»), ohne UPDATE, und war laut Aufrufer vor dem Fix rot («Per Area» statt «Per Unit»). Bei `desc(invoiceDate) … limit(1)` gewinnt also ohne Fix die zuerst erfasste Rechnung. Ein Szenario, in dem zwei Heizungsrechnungen vom selben Tag mit verschiedenen Schlüsseln über die UI erfasst werden und dann der Schlüssel bzw. die Beträge der Tankbestand-Zeile geprüft werden, zeigt also denselben Fehler.
- **Liste ohne Leistungszeitraum:** Der Testkommentar sagt selbst, dass das UPDATE die Zeile hinter die andere schreibt. Das Bearbeiten einer Rechnung in der App (`updateInvoice`, `invoice.service.ts:341/371`) ist ein solches UPDATE und lässt `createdAt` stehen. Ein Szenario «Rechnung A erfassen, Rechnung B vom selben Tag erfassen, A bearbeiten, Vorschau öffnen» bekommt ohne Fix B vor A und mit Fix A vor B.

So zeigt man es: diese Szenarien mit `@wip` auf 0ab8f915 laufen lassen. Rot bei der Prüfung von Schlüssel bzw. Reihenfolge belegt den Befund. Wenn die E2E-Stacks das wider Erwarten nicht erreichen, braucht es einen der in `tests/e2e/CLAUDE.md` genannten Gründe, und den muss der Pull Request belegen.

## Nicht bestätigt

- Backend-Tests (1657 grün), `bun run type-check`, ESLint auf den vier Dateien und der Prettier-Diff der eigenen Zeilen sind vom Aufrufer gemeldet und nicht erneut ausgeführt. Ebenso die beiden Rotläufe vor der Service-Änderung. Beim Lesen: Der Test der Liste erzwingt die Abweichung mit dem UPDATE, also rot ohne Fix. Der Test zum Tankbestand hängt ohne Fix davon ab, welche gleichrangige Zeile PostgreSQL liefert. Laut gemeldetem Rotlauf war das die zuerst erfasste, und das passt zu einem Heap-Scan mit Top-N-Sortierung.
- Richtung «die zuletzt erfasste gilt» bei `keyFor`: Das Issue verlangt nur «by order of entry» und legt die Richtung nicht fest. `desc` passt zu «latest» und zu `desc(invoiceDate)`. Ob dafür ein `fach-reviewer` bzw. ein `daten-pruefer` nötig ist (der Schlüssel bestimmt Beträge), habe ich nicht entschieden. Bisher war der Gleichstand Zufall, eine bestehende Regel wird also nicht umgedreht.
- Nicht geprüft: ob eine Abrechnung den Schlüssel der Tankbestand-Zeile sichtbar nennt. Angesehen habe ich nur, dass Tankbestand in `statement-generate.feature` bzw. `statement-detail.feature` vorkommt. Die Beträge je Mietpartei hängen davon jedenfalls ab.

Geprüft: Zeile 286 ist die Abfrage, die das Issue meint (`withoutServicePeriod`; `heatingWithoutServicePeriod` läuft über `getInvoicesForStatement` und ist seit #768 schon eindeutig). Die Tie-Breaks entsprechen dem Muster in `statement.service.ts:171` und `invoice.service.ts:155`. Beide Tests räumen in `finally` auf. ponytail-review findet nichts zu kürzen. Keine UI-Texte, Verträge oder fremden Änderungen im Diff.
