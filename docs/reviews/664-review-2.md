# Code-Review #664, Schlussrunde (Runde 2)

Gegenstand: `git diff 2eba8d5 62614c7 -- . ':!docs/design/personas' ':!docs/reviews'` (Worktree `review-664-cr2`, 62614c7; Commits ec9af40, 62614c7).

Geschlossen: C-1, C-2, C-3, C-4, C-5.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Minor | tests/contracts/contract.json:27 | Das Muster für `GET /contracts/:id` gibt dem Mietvertrag von Anna Keller (`tenant`, Zeile 28) einen `moveOut` mit `"tenantName": "Sarah Meier"`. Das Backend nennt dort immer den Mieter dieses Mietvertrags (`moveOutOf`, statement-run.service.ts:153). Das Muster sagt also etwas Falsches über die Antwort. `drift` (api-contracts.pg.test.ts:43) überspringt `moveOut`, weil der Mietvertrag der Vertragsprüfung läuft und darum `null` liefert. Deshalb fällt das nicht auf. |
| C-7 | Minor | backend/src/services/statement-run.service.ts:147 | ponytail: Die neue Bedingung `!terminated && !movedOut && endDate && !laterContract(…)` übernimmt die Regel A-6 aus `fixedTermCheck` (contract.service.ts:292–293) und lässt nur `end >= swissToday()` weg. Sie ist eine Kopie eines bestehenden Helfers. Ändert sich A-6, etwa durch einen weiteren Grund, aus dem der Mieter auszieht, muss die Änderung an zwei Stellen nachgezogen werden. Sonst gehen Vertragsseite (Frage nach dem befristeten Ende) und Auszug auseinander. |

Keine Blocker, keine Major.

Die Persona-Befunde, die als Minor geführt werden, bleiben Minor:
- Sven 664-2 P-4 (die Meldung nennt «NK-… (Entwurf)»): Punkt 4 der Entscheidung verlangt, dass der abgelehnte Entwurf mit Mieter und Periode benannt wird und dass der Link bleibt. Beides erfüllen Link und Folgetext. Der Ursprungsbefund (Sven M3) wandte sich dagegen, dass der Entwurf *nur* mit seiner Nummer benannt war. Dass die Nummer in der Meldung bleibt, widerspricht der Entscheidung nicht.
- Sven 664-2 P-1 (Ergebnis zweimal angesagt): Punkt 3 der Entscheidung schreibt beides vor, die Statusmeldung und den Fokus auf eine Überschrift, die das Ergebnis nennt. Eine der beiden wegzunehmen, bräuchte eine Entscheidung. Für einen Major reicht der Befund nicht.
- Helga 664-2 P-1 (Dialogtitel «… beenden?»): Punkt 1 der Entscheidung legt nur die Beschriftung der Schaltfläche fest und dass sie weiter nur die Erfassung des Enddatums öffnet. Den Dialog regelt er nicht. Die Bedienung funktioniert, es fehlt nur die einheitliche Benennung.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint, check, Backend-Type-Check, vitest 4138/4138, statement-run.pg 21/21 (Rot für C-1, C-2 und den Fall «outside» der Load-Funktion), die ganze Backend-Suite 2008/2008 mit 97.0 % (auf 2eba8d5, nicht auf 62614c7), E2E contract-detail, apartments und building-detail 97/97, axe- und Sprachzeilen 14/14, fallow audit, Prettier.
- Gegen die echte API ist das neue Feld `moveOut.tenantName` nur in statement-run.pg.test.ts geprüft. Die Vertragsprüfung (api-contracts.pg.test.ts:473, :693) sieht `moveOut` nie gefüllt (`drift` bei `null`). Diese Lücke bestand schon in Runde 1.
- Wie die übersetzten Texte mit Namen in fr/it/en klingen («Départ de {name} le …»): Ich habe nur geprüft, dass sie vorhanden und vollständig sind, nicht ob die Formulierung fachlich stimmt.

Geprüft: «Decided (product owner)» 1–4 (Issue über REST gelesen); die Korrekturen für C-1 bis C-5 im Code und in den Tests, mit der Rot-Phase nach dem Lesen beurteilt (C-1 liefert auf der Basis «pending»; der Test aus C-5 ist entfernt, der Parameter ist jetzt `MoveOut`); P-2 mit dem Namen in allen vier `messages/*.json` und mit `tenantName` in Backend-Typ, Spezifikation und beiden Mustern; ec9af40 ändert das Verhalten nicht (`withWizard`); die geänderten Szenariozeilen fehlen auf `origin/main` (3cddafc) und gelten damit nicht als Spec-Änderung; Steps nutzen nur Questions und die Fixtures `names` und `seed.withNames`; keine neuen Bildschirme, keine Änderung an Auth oder XSRF.
