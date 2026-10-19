# Helga – Akonto und Nebenkostenpauschale im selben Mietvertrag (Runde 432)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: Persona-Stack auf http://localhost:3300, Deutsch. Nur angeschaut, nichts gespeichert.

Aufgabe: Neuen Mietvertrag für die leere Wohnung 2.02 (Musterhaus Zentrum) erfassen. Mein Mieter bezahlt CHF 150 Akonto für Heizung und Wasser und CHF 40 im Monat als feste Nebenkostenpauschale für die Hauswartung. Im Schritt «Miete» beide Beträge eintragen, die Warnung verstehen und die Kästchen unter «Vereinbarte Nebenkosten» richtig setzen.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neuer Mietvertrag, Schritt 4 «Miete» | Die gelbe Warnung «Nebenkostenpauschale und angekreuzte Nebenkosten» bleibt stehen, auch wenn ich alles richtig gemacht habe (nur noch Heizung, Warmwasser, Kaltwasser, Abwasser angekreuzt, Hauswart weg). Sie verschwindet erst, wenn ich **alle** Häkchen entferne, und das wäre bei meinem Vertrag falsch. So lerne ich: «Warnung weg = richtig», und das führt mich zum falschen Zustand. |
| P-2 | Major | Schritt 4 «Miete» und Schritt 5 «Prüfen» | Mit Akonto CHF 150 und **keinem** Häkchen warnt das Formular gar nicht mehr wegen des Akontos. Im Schritt 4 steht nur «Keine Nebenkosten vereinbart … Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.», im Schritt «Prüfen» steht «Vereinbarte Nebenkosten: Keine» neben «Akonto CHF 150.00» ohne jeden Hinweis. Ich hätte den Vertrag so speichern können. |
| P-3 | Minor | Schritt 4 «Miete» | Die Warnung steht unter dem Feld «Nebenkostenpauschale», die Kästchen stehen etwa 1000 Pixel weiter unten (nach Zusatzmiete und dem langen Text zur Verwaltungspauschale). Bei 150 % sehe ich nie beide gleichzeitig; ob meine Häkchen die Warnung beruhigen, merke ich nur, wenn ich wieder hochscrolle. |
| P-4 | Minor | Schritt 4 «Miete» | Der Warnungstext ist immer derselbe, egal was angekreuzt ist. Er sagt nicht, *welche* Häkchen noch stören, und auch nicht «Jetzt stimmt es». |

## Beobachtungen

- Die vollständige Bildschirmaufnahme zeigt die obere Leiste (Dwello, Deutsch, Vera Verwalter) mitten im Bild. Das liegt an der Aufnahme der ganzen Seite mit fester Kopfzeile, nicht an der App; im normalen Fenster sitzt die Leiste oben.
- Alle zehn Mieter in der Liste haben schon einen Mietvertrag ohne Vertragsende. Im Schritt «Wohnung» kam deshalb der Hinweis «Nina Brunner hat einen Mietvertrag ohne Vertragsende …». Der Hinweis ist verständlich, hat mich aber kurz verunsichert, weil ich ja einen neuen Mieter im Kopf hatte.
- Die Hilfetexte bei «Akonto pro Monat» und «Nebenkostenpauschale pro Monat» sind gut. Besonders der Satz «Entfernen Sie unten bei «Vereinbarte Nebenkosten» das Häkchen bei den Nebenkosten, die die Pauschale abdeckt» sagt mir genau, was zu tun ist.
- «Monatlich total CHF 1’590.00» (1400 + 150 + 40) stimmt; ich habe nachgerechnet.
- Die Kästchen lassen sich auch über den Namen daneben anklicken. Das ist für mich mit der Maus angenehm.

## Aufgabe geschafft: teilweise

Ich habe die Kästchen am Ende richtig gesetzt (Heizung, Warmwasser, Kaltwasser angekreuzt, alles andere leer) und bin bis «Prüfen» gekommen. Aber die Warnung blieb stehen, und ich war nicht sicher, ob ich es richtig gemacht habe. Nach dem Spielen mit den Häkchen hätte ich beinahe alle entfernt, weil dann die gelbe Warnung weg war.

## Aufwand

Etwa 12 Minuten, rund 25 Schritte (Mieter wählen, Wohnung wählen, Datum, drei Beträge, zwölf Kästchen mehrmals an- und abklicken, Verwaltungspauschale «Nein», Weiter, Prüfen). Am meisten Zeit hat das Hoch- und Runterscrollen zwischen Warnung und Kästchen gekostet.

## Ablauf

1. **Übersicht → «Mietvertrag erfassen».** Erwartet: ein Formular. Gesehen: «Neuer Mietvertrag», «Schritt 1 von 5: Mieter». Gut.
2. **Mieter wählen.** Erwartet: meinen Mieter auswählen. Gesehen: Liste mit zehn Personen; ich nahm Nina Brunner. Weiter.
3. **Wohnung.** Erwartet: 2.02 auswählen. Gesehen: Hinweis, dass Nina Brunner schon die Wohnung A2 mietet; freie Wohnungen zuoberst, 2.02 wählbar. Weiter.
4. **Vertragsdauer.** 01.11.2026 eingetragen, «Unbefristet» war schon gewählt. Weiter.
5. **Miete, leer.** Gesehen: alle zwölf Kästchen sind schon angekreuzt, Text darüber: «Dwello hat alle umlagefähigen Kategorien angekreuzt. Entfernen Sie das Häkchen bei jeder, die im unterschriebenen Mietvertrag nicht steht.»
6. **Nettomiete 1400, Akonto 150, Nebenkostenpauschale 40.** Erwartet: vielleicht eine Frage, ob beides zusammen geht. Gesehen: gelbe Warnung mit Dreieck «Nebenkostenpauschale und angekreuzte Nebenkosten: Dieser Mieter bezahlt ein Akonto und eine Nebenkostenpauschale. Dwello rechnet ihm alle angekreuzten Nebenkosten mit der Nebenkostenabrechnung ab, die Pauschale nicht. Lassen Sie nur die Nebenkosten angekreuzt, für die der Mieter Akonto bezahlt. Sonst bezahlt er die Nebenkosten, die die Pauschale abdeckt, doppelt.» Den Text habe ich verstanden: Hauswart muss weg, weil er mit den CHF 40 schon bezahlt ist. Gut erklärt.
7. **Nur «Hauswart» abgewählt.** Erwartet: Warnung verschwindet oder wird grün. Gesehen: Warnung unverändert (musste dafür hochscrollen). Ich dachte, ich habe noch etwas falsch.
8. **Alles abgewählt ausser Heizung, Warmwasser, Kaltwasser, Abwasser** (der Text oben sagt ja: was nicht im Vertrag steht, Häkchen weg). Erwartet: jetzt ist die Warnung weg. Gesehen: Warnung immer noch da (Aufnahme 08: gelber Kasten oben, unten nur noch vier Häkchen).
9. **Auch Abwasser weg** (ich war unsicher, ob «Wasser» im Vertrag das Abwasser meint). Warnung bleibt.
10. **Aus Ratlosigkeit auch Heizung, Warmwasser, Kaltwasser weg.** Gesehen: die gelbe Warnung ist weg, unten bei den Kästchen steht jetzt «Keine Nebenkosten vereinbart … Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.» Das passt nicht zu meinem Vertrag, aber das Formular ist «ruhig». Hier hätte ich mich beinahe zufrieden gegeben.
11. **Heizung, Warmwasser, Kaltwasser wieder angekreuzt, Verwaltungspauschale «Nein», Weiter.** Die Warnung ist wieder da, «Weiter» geht trotzdem. Prüfen zeigt «Akonto CHF 150.00», «Nebenkostenpauschale CHF 40.00», «Vereinbarte Nebenkosten: Heizung, Warmwasser, Kaltwasser». Das ist, was ich wollte. Keine Warnung mehr im Prüfschritt. Nicht gespeichert.
12. **Gegenprobe: alle Häkchen leer, Weiter.** Prüfen zeigt «Akonto CHF 150.00» und «Vereinbarte Nebenkosten: Keine», ohne Warnung. Mit «Mietvertrag speichern» wäre das durchgegangen (nicht geklickt).

## Verwirrung

- **Die Warnung, die nie weggeht:** Ich bin es gewohnt, dass eine Warnung verschwindet, wenn ich das Problem behoben habe. Hier bleibt sie, solange irgendein Häkchen gesetzt ist. Ich weiss nicht, ob das heisst «Sie haben noch etwas falsch» oder «nur zur Erinnerung».
- **«Wasser»:** Mein Vertrag sagt «Heizung und Wasser». In der Liste gibt es Warmwasser, Kaltwasser und Abwasser. Welche gehören dazu? Der Text erklärt das nur für «Heizkosten» (Kaminfeger gehört dazu).
- **Kaminfeger:** Der Text sagt, bei «Heizkosten» gehört Kaminfeger dazu. Mein Vertrag sagt «Heizung». Muss Kaminfeger also angekreuzt bleiben? Ich habe ihn weggenommen und bin nicht sicher.
- **«Hauswartung» und «Hauswart»:** Im Vertrag steht Hauswartung, im Kästchen Hauswart. Ich habe angenommen, das ist dasselbe.
- **«umlagefähigen Kategorien»:** Das Wort «umlagefähig» kenne ich nicht richtig.

## Fehlerrisiken

- Wer wie ich die Warnung «weg haben will», entfernt alle Häkchen. Dann rechnet Dwello dem Mieter trotz Akonto keine Nebenkosten ab; ich verliere Heizung und Wasser (P-1, P-2).
- Wer die Warnung übersieht (sie steht weit oben, die Kästchen weit unten), lässt alles angekreuzt; dann bezahlt der Mieter die Hauswartung doppelt (P-3).
- Unsicherheit bei Abwasser und Kaminfeger: zu viel oder zu wenig abgerechnet.

## Vorschläge

- **P-1:** Schritte: Neuer Mietvertrag → Nina Brunner → Wohnung 2.02 → 01.11.2026 → Miete: Nettomiete 1400, Akonto 150, Nebenkostenpauschale 40 → bei «Vereinbarte Nebenkosten» alles ausser Heizung, Warmwasser, Kaltwasser abwählen → Warnung bleibt; erst ohne Häkchen ist sie weg. Was helfen würde: Die Warnung nicht als «Fehler» zeigen, wenn ich die Häkchen schon angepasst habe, oder sie in eine ruhige Bestätigung umschreiben («Angekreuzt bleiben nur Nebenkosten mit Akonto: Heizung, Warmwasser, Kaltwasser. Prüfen Sie, dass die Pauschale keine davon abdeckt.»). Auf keinen Fall darf sie genau dann verschwinden, wenn gar nichts angekreuzt ist.
- **P-2:** Schritte wie P-1, aber alle Häkchen entfernen → Weiter → Prüfen. Was helfen würde: Bei Akonto über 0 und keinem Häkchen ein Hinweis bei den Kästchen und im Prüfschritt: «Der Mieter bezahlt ein Akonto, aber es sind keine Nebenkosten angekreuzt. Kreuzen Sie an, wofür er Akonto bezahlt.»
- **P-3:** Schritte wie P-1, Bildschirm 1440 × 900 bei 150 %. Was helfen würde: Die Warnung (oder eine Wiederholung) direkt über den Kästchen «Vereinbarte Nebenkosten» zeigen, dort wo ich die Häkchen setze.
- **P-4:** Was helfen würde: Im Text die noch angekreuzten Nebenkosten aufzählen, damit ich vergleichen kann: «Angekreuzt: Heizung, Warmwasser, Kaltwasser. Deckt die Pauschale eine davon ab, entfernen Sie dort das Häkchen.»

## Nicht geprüft

- 200 % Zoom: nur 150 % geprüft, aus Zeitgründen.
- Speichern: Auftrag war nur schauen. Ob Dwello den Vertrag mit Akonto und ohne Häkchen beim Speichern ablehnt, weiss ich deshalb nicht.
- Einen Mieter ohne bestehenden Vertrag: In der Liste hatte jeder schon einen; einen neuen Mieter hätte ich speichern müssen.
- Ob sich die Warnung anders verhält, wenn ich zuerst die Pauschale und dann das Akonto eintrage, oder nach «Zurück» aus dem Prüfschritt.

Aufnahmen und Skripte: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-432/` (06-beide-betraege.png: Warnung mit allen Häkchen; 08-nur-heizung-wasser.png: Warnung bleibt trotz vier Häkchen; 09-alle-weg.png: Warnung weg, Hinweis «Keine Nebenkosten vereinbart»; 10-pruefen.png und 12-pruefen-alle-weg.png: Prüfschritt ohne Warnung).
