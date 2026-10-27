# Review i655, Fix-Slice Runde 1 (Delta 1da11ad6..bc7d4103)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/features/heating-profiles.feature:41-44 | Die sichtbare Fehlerbehebung P-1 (der deutsche Name eines vordefinierten Heizprofils wird jetzt abgelehnt) hat kein Szenario ohne `@wip` und kein `No scenario: <Grund>` |
| C-2 | Minor | backend/src/__tests__/heating-profile-admin.pg.test.ts:50-56 | Der Bearbeitungspfad (`updateHeatingProfile`, Zeile 207) lehnt jetzt auch den deutschen Namen eines vordefinierten Profils ab, aber kein Test deckt das ab; nur POST ist abgedeckt |

## C-1 (Major)

Mit bc7d4103 ändert sich das Verhalten, das der Liegenschaftsverwalter sieht: Auf «Neues Heizprofil» (und beim Bearbeiten) wird der Name «Heizung Mittelland» oder «Heizung + Warmwasser» jetzt beim Namen abgelehnt, statt dass das Profil gespeichert wird. Der Fehler war schon auf der Basis vorhanden; nach `CLAUDE.md`, Workflow 1 («a bug fix a user can see») braucht seine Behebung trotzdem ein Szenario. Das Szenario des Haupt-Slices (`heating-profiles.feature:41-44`) erfasst «Bergtal» zweimal, also einen eigenen Namen in der Spalte `name`. Es läuft auch ohne den Fix grün und zeigt P-1 daher nicht. Weder der Commit noch `implementation_plan.md` nennen `No scenario`.

So lässt sich die Lücke zeigen: Setzt man `getHeatingProfileByName` auf `ilike(heatingProfiles.name, name)` zurück, bleibt die ganze E2E-Suite grün. Abhilfe ist ein Szenario wie «Angenommen … auf der Seite "Neues Heizprofil" / Wenn … das Heizprofil "Heizung Mittelland" erfasst / Dann erfährt … beim Namen, dass es das Heizprofil "Heizung Mittelland" schon gibt». Nach Workflow 2 braucht es keinen eigenen Rot-Lauf, weil der pg-Test rot gesehen wurde.

Geschlossen: keine (Runde 1 des Haupt-Slices hatte keine Befunde).

Geprüft: Diff der beiden Code-Dateien, der Plan und die Berichte. `or(ilike(name), ilike(nameDE))` entspricht `getDistributionKeyByName`. Zum neuen pg-Test: Er ist ohne Fix rot (201), weil `name` des Seeds «Heating + Hot Water» ist (`0002_stammdaten.sql:64`). In Neuanlagen vom Formular bleibt `nameDE` null (`nameTranslations` schickt nur fr/it/en). Bearbeiten: Ein vordefiniertes Profil, das unter seinem deutschen Namen gespeichert wird, findet sich selbst (`duplicate.id === id`) und wird nicht abgelehnt. Ein eigenes Profil, das auf den deutschen Namen eines vordefinierten umbenannt wird, erhält 409. Demo-Daten (`demo-data.ts:25-30,67`): Sie suchen mit englischen Namen, und kein `name_de` kollidiert mit diesen, also bleibt das Ergebnis gleich.

## Nicht bestätigt

- `cd backend && bun run type-check` und `bun test` von heating-profile-admin, heating-profiles, heating-distribution, api-contracts (128 bestanden) sowie invoice-completeness, statement-pdf, prorating, service-period, demo-data (113 bestanden): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rot-Lauf des neuen pg-Tests (201 statt 409): vom Aufrufer gemeldet; durch Lesen als plausibel beurteilt (siehe oben).
- Ob bestehende Datenbanken schon ein eigenes Profil enthalten, das vor dem Fix unter einem deutschen Namen gespeichert wurde (dann liefert `limit(1)` womöglich nur einen der beiden Treffer): nicht geprüft, betrifft keine Testdaten.
