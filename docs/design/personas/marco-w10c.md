# Persona-Review Marco, Runde w10c: Vereinbarte Nebenkosten im Mietvertrag

Marco, 38, auf dem Handy (390 × 844, Touch). Gespeichert nur im Gebäude «Musterhaus Zentrum». Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/e60c0fa6-2a4d-5c91-b5be-bcf2af1f206b/scratchpad/marco-w10c/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag bearbeiten (auch Assistent Schritt 4) | Alle Häkchen weg, Akonto CHF 300.00 bleibt: Dwello speichert ohne Warnung und ohne Rückfrage. Auf der Vertragsseite steht dann «Vereinbarte Nebenkosten: Keine». Hätte ich Häkchen vergessen oder zu viele entfernt, hätte ich es nicht gemerkt. |
| P-2 | Minor | Assistent Schritt 5 «Prüfen», Vertragsseite | Es steht nur, was angekreuzt ist (11 Begriffe als Fliesstext). Was *nicht* vereinbart ist (Lift, TV/Kabelanschluss, bei Anna Gartenpflege), steht nirgends. Ob es stimmt, sehe ich nur, wenn ich die Liste Wort für Wort mit meinem Papiervertrag vergleiche. |
| P-3 | Minor | Assistent Schritt 5 → «Vereinbarte Nebenkosten ändern» | «Ändern» springt an den Anfang von Schritt 4 (Fokus auf die Überschrift «Miete», scrollY 0). Die Liste mit den Häkchen kommt erst rund 1000 px weiter unten, nach Nettomiete, Akonto, Zusatzmiete und dem langen Text zur Verwaltungspauschale. |
| P-4 | Nit | Mietvertrag bearbeiten | Der Einleitungstext sagt «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» Dass man hier auch die vereinbarten Nebenkosten ändert, steht dort nicht. Ich habe es trotzdem gefunden, weil es sonst keinen Ort dafür gibt. |

## Beobachtungen

- Die Zeilen der Liste sind 48 px hoch und über die ganze Breite antippbar (Label 308 × 48). Auf dem Handy treffe ich sie gut. Ein abgewähltes Feld ist ein leeres Kästchen neben vielen blauen Häkchen, im Screenshot `10-anna-untick-viewport.png` sieht man es klar.
- Der Hilfetext über der Liste ist gut: «Dwello hat alle umlagefähigen Kategorien angekreuzt. Entfernen Sie das Häkchen bei jeder, die im unterschriebenen Mietvertrag nicht steht. Nur angekreuzte Nebenkosten rechnet Dwello dem Mieter ab.» Damit ist klar, was ein Häkchen bedeutet. Beim Scrollen durch die 13 Zeilen ist der Text aber schon oben aus dem Bild verschwunden.
- Auf der Vertragsseite stehen die «Vereinbarte Nebenkosten» im Kasten «Vertragsdauer», nicht bei «Miete pro Monat», wo das Akonto steht. Dort hätte ich sie zuerst gesucht.
- Die Erfolgsmeldung «Mietvertrag von Anna Schmidt gespeichert» schwebt auf dem Handy über dem gelben Kasten «2 Abrechnungen fehlen» und verdeckt dessen Schaltflächen «2023 abrechnen» / «2022 abrechnen», bis sie verschwindet (Screenshot `11-anna-after.png`).
- Beim Bearbeiten steht: «Bestehende Abrechnungen ändern sich dadurch nicht.» Ich habe mich gefragt, ob damit auch die Entwürfe gemeint sind (Dashboard: 7 Entwürfe). Geprüft habe ich das nicht.
- Im Assistenten steht laufend «Entwurf gespeichert, 02:37». Das beruhigt.
- Nach «Neuen Mieter erfassen» kam ich direkt in den Assistenten zurück, Luca Test war schon gewählt. Sehr angenehm.

## Aufgabe geschafft: ja

Beides gespeichert und geprüft. Wegen eines Tests (siehe Ablauf 11) hatte Anna Schmidt kurz keine Nebenkosten. Danach habe ich ihren Vertrag wiederhergestellt: alle wie vorher, ohne Gartenpflege (Treppenhausreinigung war schon in den Demodaten nicht angekreuzt).

## Aufwand

Etwa 10 Minuten. Teil 1: Mieter erfassen (1 Formular), dann 5 Schritte im Assistenten, 2 Häkchen entfernen, speichern. Teil 2: Vertrag öffnen, Bearbeiten, 1 Häkchen entfernen, speichern.

## Ablauf

1. **Dashboard → «Mietvertrag erfassen».** Erwartet: Assistent. Gesehen: «Schritt 1 von 5: Mieter», Luca Test fehlt in der Liste.
2. **«Neuen Mieter erfassen».** Erwartet: kurzes Formular. Gesehen: Vorname, Nachname, Korrespondenzkanal, Adresse. Nach «Mieter erfassen» zurück im Assistenten mit der Meldung «Luca Test ist gespeichert und für diesen Mietvertrag gewählt.» Wie erwartet.
3. **Schritt 2 Wohnung.** Gesehen: Freie Wohnungen stehen oben, «Wohnung 3.02 - Musterhaus Zentrum, 2 Zimmer, 55 m²» ist wählbar. Gut.
4. **Schritt 3 Vertragsdauer.** 01.01.2027 eingegeben, «Unbefristet» war vorgewählt. Gut.
5. **Schritt 4 Miete.** Eingegeben: 1400 Nettomiete, 150 Akonto, «Ja, zum Satz des Abrechnungslaufs». Erwartet: irgendwo eine Liste der Nebenkosten. Gesehen: «Vereinbarte Nebenkosten» mit 13 Häkchen, alle angekreuzt, darüber der Hilfetext. «Lift» und «TV/Kabelanschluss» abgewählt. «Monatlich total CHF 1’550.00» stimmt.
6. **Schritt 5 Prüfen.** Erwartet: dass ich sehe, dass Lift und Kabel-TV draussen sind. Gesehen: «Vereinbarte Nebenkosten: Treppenhausreinigung, Heizung, Warmwasser, Kaltwasser, Abwasser, Allgemeinstrom, Hauswart, Gartenpflege, Schneeräumung, Kehricht, Kaminfeger». Dass Lift und TV fehlen, musste ich selbst durch Vergleichen herausfinden (P-2).
7. **«Ändern» bei Vereinbarte Nebenkosten.** Erwartet: Ich lande bei der Liste. Gesehen: Ich lande oben bei «Miete» und muss weit scrollen (P-3). Meine Häkchen waren noch so, wie ich sie gesetzt hatte. Mit «Weiter» zurück zum Prüfen.
8. **«Mietvertrag speichern».** Gesehen: Liste der Mietverträge mit der Meldung «Mietvertrag von Luca Test gespeichert», Eintrag «Künftig ab 01.01.2027». Die Vertragsseite zeigt dieselbe Nebenkostenliste wie Schritt 5 und «Verwaltungspauschale: Vereinbart, Satz des Abrechnungslaufs».
9. **Anna Schmidt: Vertragsseite → «Bearbeiten».** Erwartet: Ich kann die Nebenkosten ändern. Gesehen: Die Einleitung nennt nur Vertragsdauer und Miete (P-4). Weiter unten steht die Liste, Gartenpflege ist angekreuzt.
10. **Gartenpflege abgewählt, «Änderungen speichern».** Gesehen: zurück auf der Vertragsseite mit der Meldung «gespeichert». Die Liste enthält Gartenpflege nicht mehr. Dass sie *nicht* vereinbart ist, steht nirgends ausdrücklich. Man sieht es nur daran, dass das Wort fehlt (P-2).
11. **Test «vergessen»: alle Häkchen weg, speichern.** Erwartet: ein Hinweis wie «Keine Nebenkosten angekreuzt, das Akonto von CHF 300.00 geht dann ganz zurück. Stimmt das?». Gesehen: sofort gespeichert, auf der Vertragsseite steht «Vereinbarte Nebenkosten: Keine» und weiterhin «Akonto CHF 300.00» (P-1, Screenshot `12-none-ticked.png`). Danach wiederhergestellt (Screenshot-Prüfung per Vorlesetext: Liste ohne Gartenpflege).

## Verwirrung

- Unklar ist nicht, was das Häkchen bedeutet: Der Hilfetext erklärt es klar. Unklar ist, was der Mieter am Ende bezahlt, wenn die Liste leer oder fast leer ist und trotzdem Akonto vereinbart ist.
- «Heizkosten-Kategorien»: Welche Kategorien das ausser Heizung und Kaminfeger sind (Warmwasser?), sagt der Text nicht.
- «Satz des Abrechnungslaufs»: Der Text erklärt den Begriff. Ein Beispiel mit Prozentzahl würde mir trotzdem helfen.

## Fehlerrisiken

- Alle Kategorien sind vorab angekreuzt. Wer auf dem Handy schnell durchtippt und nichts abwählt, verrechnet dem Mieter Lift und Kabel-TV, die nicht im Vertrag stehen. Auf der Prüfseite fällt das nur auf, wenn man den Fliesstext genau liest.
- Eine leere Liste mit Akonto wird ohne Rückfrage gespeichert (P-1).
- Nach «Ändern» im Prüfschritt landet man weit weg von der Liste. Wer die Liste nicht findet, gibt leicht auf (P-3).

## Vorschläge

- **P-1:** Mietvertrag Anna Schmidt → Bearbeiten → alle 13 Häkchen entfernen → «Änderungen speichern». Das wird ohne Hinweis gespeichert. Hilfreich wäre ein Hinweis direkt unter der Liste, wenn keine Kategorie (oder bei Akonto > 0 keine) angekreuzt ist, zum Beispiel: «Keine Nebenkosten angekreuzt. Dwello rechnet Anna Schmidt keine Nebenkosten ab und zahlt das ganze Akonto zurück.» Oder eine Rückfrage vor dem Speichern.
- **P-2:** Assistent bis Schritt 5, zwei Kategorien abgewählt, oder die Vertragsseite nach einer Änderung. Hilfreich wäre eine zweite Zeile «Nicht vereinbart: Lift, TV/Kabelanschluss» auf der Prüfseite und auf der Vertragsseite, oder eine Zählung «11 von 13 vereinbart».
- **P-3:** Im Assistenten Schritt 5 auf «Ändern» bei «Vereinbarte Nebenkosten» tippen. Hilfreich wäre, wenn der Bildschirm direkt zur Gruppe «Vereinbarte Nebenkosten» scrollt und dort den Fokus setzt.
- **P-4:** Mietvertrag bearbeiten öffnen, die Einleitung lesen. Hilfreich wäre ein Satz wie «Ändern Sie Vertragsdauer, Miete oder vereinbarte Nebenkosten dieses Mietvertrags.»

## Nicht geprüft

- Ob eine neue Abrechnung für Luca Test (2027) Lift und Kabel-TV wirklich weglässt: Die Periode 2027 liegt in der Zukunft, und eine Abrechnung zu erstellen war nicht Teil der Aufgabe.
- Ob der bestehende Abrechnungsentwurf von Anna Schmidt sich durch das Abwählen von Gartenpflege ändert: Abrechnungen habe ich nicht geöffnet.
- «Ja, mit eigenem Satz» habe ich nicht ausprobiert, weil die Aufgabe den Satz des Abrechnungslaufs verlangte.
- Den Querformat-Modus und andere Sprachen habe ich nicht angeschaut.
