# Review i781, Runde 1 (Schlussrunde), `edd33dd0..7203ff63`

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | docs/architecture/fitness-functions.md:79 | «alle Listen < 20 ms» ist falsch, sobald man `contracts/missing-statements` (61 ms p95, im Utility Tree als eigener Wert genannt) zu den Listen zählt; die Zeile nennt zudem die Maschine nicht, die «Done means» für beide Dokumente verlangt (sie verweist nur auf den Utility Tree). |
| C-2 | Minor | docs/architecture/utility-tree.md:189 | Die Zeile P2 der Schwierigkeits-Tabelle sagt weiterhin «Nicht gemessen.»; nach der Messung von #781 ist das falsch (die «Heute»-Zeile 158 sagt das Gegenteil). |
| C-3 | Minor | docs/architecture/utility-tree.md:159 | «Fitness Function» beschreibt weiter einen wöchentlichen Lauf auf der Demo-VM und einen CI-Wächter; der Entscheid PO (#781) lautet «kein CI-Gate, kein Nightly», solange A4 offen ist. Die Zeile widerspricht jetzt der Zeile 158 direkt darüber. |

Geprüft: Skript (Datenaufbau ergibt 50 Wohnungen, 75 Verträge, 6×2×5×5 = 300 Rechnungen, 50+50+75+50 = 225 Abrechnungen 2021–2024; Routenliste deckt alle Listen- und Übersichtsrouten ohne Pflicht-Parameter, die die Seiten laden; Default-Limits entsprechen etwa den Seitengrössen), p95 als nearest rank (Index 94 von 100, korrekt), Body wird vor dem Zeitstopp gelesen, Fehlerstatus bricht ab; `psql`-Abhängigkeit hat Vorbild in `upgrade-check.sh`; Issue #919 offen mit `nfr:performance` und Ursache; `package.json`-Eintrag nötig als Einstieg für fallow; `prettier --check` auf der neuen Datei sauber (selbst ausgeführt); kein Szenario nötig (keine Verhaltensänderung, «No scenario» im Archiv).

Zu den Fragen des Aufrufers:
- Import von `backend/src/__tests__/helpers/auth.ts` (`callApi`) aus einem Tool: annehmbar. Das Tool liefert nichts aus, wiederverwenden statt die JWT-Signatur zu kopieren ist die kürzere Lösung, und der Helfer signiert genau wie die BFF. Die Signatur pro Aufruf (HS256, deutlich unter 1 ms) fliesst in die Zeit ein; gegenüber 500 ms belanglos.
- Messung: stimmig für das, was sie behauptet (Backend im Prozess inkl. Auth, Routing, DB und Serialisierung, ohne Netz und BFF); die Dokumente sagen das. Kein Warm-up, aber bei 100 Werten und p95 fallen bis zu fünf Kaltstart-Ausreisser heraus. Sequentiell entspricht einem Einzelnutzer. Einschränkungen, die keine Mängel des Diffs sind: alle Abrechnungen sind `paid`, also prüft die Übersicht keine offenen; die Seite «Übersicht» wartet parallel auf `dashboard` und `statements/outdated`, ihre Wartezeit ist also mindestens 1110 ms (im Utility Tree vermerkt).

## Nicht bestätigt

- `bun run check`: 0 Fehler, `bun run lint`: sauber, fallow-Gate beim Commit bestanden: vom Aufrufer gemeldet.
- Messwerte (drei Läufe, `outdated` 1102–1139 ms p95, Übersicht 227 ms, Listen < 20 ms, `missing-statements` 61 ms) und die Maschine (4 vCPU Xeon 2.8 GHz): vom Aufrufer gemeldet; nicht nachgemessen, weil das Skript eine Datenbank anlegt und füllt. Konsistent mit dem Code geprüft: die Datenmengen folgen aus dem Skript.
- Dass `DROP DATABASE dwello_bench` nach den Läufen ausgeführt wurde: vom Aufrufer gemeldet; das Skript selbst räumt die Datenbank nicht ab (legt sie beim nächsten Lauf neu an).
