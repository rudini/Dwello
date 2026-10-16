# Helga, Runde w6b: Sprache für Abrechnung und Mahnungen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (ein Bildschirm zusätzlich bei 200 %), Maus. Nur angeschaut, nichts gespeichert, kein PDF erstellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fe3bd9b5-d5c3-55d0-aa4e-428ea53d7e2c/scratchpad/helga-w6b/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung Anna Schmidt (NK-11111111-2025-0002) | Auf der Abrechnung von Frau Schmidt steht nirgends, in welcher Sprache das PDF ist. Bei Herrn Dubois steht «PDF auf Französisch», bei ihr gar nichts. Ich muss raten, dass «nichts» Deutsch heisst. Den Zustand «noch kein PDF» konnte ich nicht sehen: Laut Verlauf war das PDF schon erstellt (siehe «Nicht geprüft»). |
| P-2 | Minor | Abrechnung Pierre Dubois, Abschnitt «Mahnungen» | Unter dem Knopf «PDF erstellen» steht «PDF auf Französisch». Bei der Zahlungserinnerung im Abschnitt «Mahnungen» steht aber nur «erstellt am 16.10.2026, per Brief», ohne Sprache. Dass die Mahnung auch auf Französisch ist, sehe ich nur auf der Mieterseite. |
| P-3 | Nit | Abrechnung Pierre Dubois | «PDF auf Französisch» steht klein und grau unter dem Knopf. Ich habe kurz gestutzt: Gibt es das PDF schon, oder wird es so erstellt? Zusammen mit dem Knopf «PDF erstellen» verstehe ich es dann doch. |

## Beobachtungen

- Das Feld im Formular ist gut gemacht. Die Überschrift heisst «Sprache für Abrechnung und Mahnungen», und darunter steht als Hilfetext: «In dieser Sprache erstellt Dwello die Nebenkostenabrechnung und die Mahnungen.» Ausgewählt war «Französisch». Mit der Sprache der Bildschirme (oben rechts das Übersetzungszeichen mit «Deutsch») habe ich es nicht verwechselt: Das Feld steht mitten bei den Kontaktdaten des Mieters, und schon der Untertitel sagt «Kontaktdaten, Korrespondenzkanal und Sprache von Pierre Dubois.»
- Auf der Mieterseite steht unter «Kontaktdaten» dieselbe Bezeichnung «Sprache für Abrechnung und Mahnungen: Französisch». So muss ich nicht erst ins Formular, um es zu sehen.
- Bei Maria Rossi (Italienisch) steht auf ihrer Abrechnung ebenso «PDF auf Italienisch». Der Hinweis passt also zur Einstellung beim Mieter.
- In der Liste «Nebenkostenabrechnungen» hat fast jede Zeile einen Link «PDF», auch bei den Entwürfen, aber ohne Angabe der Sprache. Ich habe ihn nicht angeklickt.
- Die Zahlungserinnerung von Herrn Dubois ist von heute (16.10.2026, «Zu versenden»). Ich habe sie nicht erstellt. Sie stammt aus den Demodaten oder von einer anderen Persona.
- Der Screenreader liest den Hinweis mit dem Knopf vor: «PDF erstellen» ist mit dem Hinweis «PDF auf Französisch» verknüpft.
- Bei 200 % sitzt der Hinweis gut lesbar direkt unter dem Knopf (10-dubois-200.png).

## Aufgabe geschafft: teilweise

Teile 1 und 3 ja. Teil 2 nur teilweise: Die Abrechnung von Anna Schmidt hatte schon ein PDF, also gab es den Zustand «vor dem Erstellen» nicht.

## Aufwand

Etwa 10 Minuten, 6 Skriptläufe, rund 12 Schritte (Mieterliste, Mieterseite, Bearbeiten, Abbrechen, Abrechnungsliste, zwei Abrechnungen, dazu Gegenproben bei Anna Schmidt und Maria Rossi).

## Ablauf

1. **Mieterliste** (02-mieter-liste.png). Erwartet: Pierre Dubois in der Liste. Gesehen: «Pierre Dubois, Wohnung 2.01 - Musterhaus Zentrum, Aktiv». Klick auf den Namen.
2. **Mieterseite Dubois** (03-mieter-dubois.png). Erwartet: irgendwo die Sprache. Gesehen: Unter «Kontaktdaten» steht «Sprache für Abrechnung und Mahnungen: Französisch». Das ist klar.
3. **Mieter bearbeiten** (04-mieter-dubois-bearbeiten.png). Erwartet: ein Feld für die Sprache, vielleicht leicht mit der Sprache der Seite zu verwechseln. Gesehen: Auswahlfeld «Sprache für Abrechnung und Mahnungen» mit dem Hilfetext «In dieser Sprache erstellt Dwello die Nebenkostenabrechnung und die Mahnungen.» Zur Wahl stehen Deutsch, Französisch, Italienisch und Englisch, ausgewählt ist «Französisch». Oben in der Kopfzeile steht weiterhin «Deutsch» mit dem Übersetzungszeichen. Ich verwechsle das nicht, denn das Feld sagt, wofür es gilt.
4. **Abbrechen** (05-nach-abbrechen.png). Ich habe testweise «Deutsch» ausgewählt und dann «Abbrechen» geklickt. Erwartet: zurück, ohne dass etwas gespeichert wird. Gesehen: zurück auf der Mieterseite, dort steht weiterhin «Französisch».
5. **Abrechnungsliste** (06-abrechnungen-liste.png). Gesehen: Anna Schmidt NK-11111111-2025-0002 «Entwurf» mit Link «PDF». Pierre Dubois NK-11111111-2025-0003 «Überfällig», «Gemahnt am 16.10.2026», ohne PDF-Link.
6. **Abrechnung Anna Schmidt** (07-abrechnung-schmidt.png). Erwartet laut Auftrag: Entwurf ohne PDF, mit «PDF erstellen» und einem Hinweis zur Sprache. Gesehen: Status Entwurf, aber Knopf «PDF herunterladen» statt «PDF erstellen». Im Verlauf steht «PDF erstellt 16.10.2026, 23:02». Nirgends steht eine Sprache. Auf ihrer Mieterseite steht «Deutsch» (09-mieter-schmidt.png).
7. **Abrechnung Pierre Dubois** (08-abrechnung-dubois.png, 10-dubois-200.png). Erwartet: ein Hinweis «Französisch» vor dem Erstellen. Gesehen: Knopf «PDF erstellen», direkt darunter «PDF auf Französisch». Das ist gut. Im Abschnitt «Mahnungen» steht keine Sprache.

## Verwirrung

- «PDF auf Französisch»: Liest sich zuerst wie ein vorhandenes Dokument. Klarer wäre etwas wie «Wird auf Französisch erstellt».
- Dass bei deutschsprachigen Mietern gar nichts steht, hat mich unsicher gemacht: Fehlt da etwas, oder ist es einfach Deutsch?
- «Korrespondenzkanal» ist für mich ein schweres Wort. Der Hilfetext darunter («Wie der Mieter Post erhält …») hilft aber.

## Fehlerrisiken

- Ändere ich die Sprache eines Mieters, nachdem das PDF schon erstellt ist, sehe ich auf der Abrechnung nicht, in welcher Sprache das vorhandene PDF ist. So könnte ich ein deutsches PDF an einen Mieter schicken, der auf Französisch eingestellt ist.
- Die Mahnung zeigt ihre Sprache nicht an. Ob sie richtig ist, merke ich erst nach dem Öffnen des PDFs.

## Vorschläge

- **P-1:** Mieter → Anna Schmidt (Sprache Deutsch) → Nebenkostenabrechnungen → Anna Schmidt NK-11111111-2025-0002 öffnen: Keine Sprachangabe zu sehen. Hilfreich: die Sprache immer zeigen, auch bei Deutsch («PDF auf Deutsch»), und auch neben «PDF herunterladen», wenn das PDF schon existiert.
- **P-2:** Nebenkostenabrechnungen → Pierre Dubois NK-11111111-2025-0003 → Abschnitt «Mahnungen»: In der Zeile «erstellt am 16.10.2026, per Brief» fehlt die Sprache. Hilfreich: «per Brief, auf Französisch».
- **P-3:** Dieselbe Seite, Hinweis unter «PDF erstellen». Hilfreich: «Wird auf Französisch erstellt» statt «PDF auf Französisch».

## Nicht geprüft

- Wie die Abrechnung von Anna Schmidt vor dem Erstellen des PDFs aussieht: Laut Verlauf war das PDF schon erstellt, und laut der Liste haben alle Entwürfe einen PDF-Link. Einen deutschsprachigen Entwurf ohne PDF gab es nicht. Ein PDF erstellen oder löschen durfte ich nicht. Ob bei Deutsch vor dem Erstellen «PDF auf Deutsch» stünde, bleibt offen.
- Den Inhalt der PDFs (Abrechnung, Mahnung) habe ich nicht geöffnet und nichts gespeichert.
- Nur in der deutschen Oberfläche geprüft.
