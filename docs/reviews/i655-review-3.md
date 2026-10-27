# Review i655, Fix-Slice Runde 2 und Abschlussrunde (Delta bc7d4103..4348afeb)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-1, C-2

Geprüft: Ich habe alle sechs geänderten Dateien gelesen. Zu C-1: Das neue Szenario `heating-profiles.feature:46-49` erfasst «Heizung + Warmwasser». Das ist der `name_de` des Seeds (`0002_stammdaten.sql:64`), dessen `name` «Heating + Hot Water» lautet. Ohne bc7d4103 würde das Profil gespeichert, die Meldung am Namen bliebe aus, und das Szenario wäre rot. Der When-Schritt ruft nur die Aufgabe `createHeatingProfile` auf. Der Name ohne Token ist gewollt und kommentiert, denn das Szenario soll nichts speichern. Die Isolation hält auch bei paralleler Ausführung. Der Rückfall `names.get(profile) ?? profile` lässt das bestehende Szenario «Bergtal» unverändert, weil sein Name weiterhin aus `names` kommt. Die Formulierung des Features ist fachlich und nennt keine UI-Elemente. Der UI-Zustand (Meldung am Namen) stammt aus dem Haupt-Slice und ist dort schon in a11y und Sprachen erfasst. Der neue Schritt bringt keine neuen Texte. Zu C-2: Der PUT-Test benennt ein eigenes Profil in den deutschen Namen eines vordefinierten um und erwartet 409 mit `HEATING_PROFILE_NAME_TAKEN`. «Talboden» wird im `afterAll` aufgeräumt. Durch Lesen beurteilt ist der Test ohne den Fix rot, sofern die Testdatenbank kein Profil ohne Token unter diesem Namen enthält. Plan und Berichte geben den Stand richtig wieder.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun test src/__tests__/heating-profile-admin.pg.test.ts` (10 bestanden) und E2E `heating-profiles.feature` auf chromium (10 bestanden): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rot-Lauf des PUT-Tests ohne bc7d4103 (200 statt 409, im Einzellauf): vom Aufrufer gemeldet. Durch Lesen halte ich ihn für plausibel. Im Lauf der ganzen Datei ohne Fix hängt er vom POST-Test ab, der dann ein Profil ohne Token unter «Heizung + Warmwasser» hinterlässt. Mit dem Fix spielt das keine Rolle, weil beide Pfade dieselbe Funktion `getHeatingProfileByName` nutzen.
