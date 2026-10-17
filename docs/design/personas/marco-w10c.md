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

## Nachprüfung P-1

Marco, Handy 390 × 844, Touch, frische Demodaten. Skripte `n1.mjs` bis `n5.mjs` und Screenshots `n*.png` in `/tmp/claude-0/-home-user-Dwello/e60c0fa6-2a4d-5c91-b5be-bcf2af1f206b/scratchpad/marco-w10c/`. Gespeichert nur bei Anna Schmidt (Musterhaus Zentrum); der neue Vertrag für 3.02 wurde nicht gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | behoben (früher Major) | Mietvertrag bearbeiten, Assistent Schritt 4 | Sobald kein Häkchen mehr gesetzt ist, steht direkt unter der Liste ein gelber Hinweiskasten mit Warndreieck: «Keine Nebenkosten vereinbart. Ohne Häkchen rechnet Dwello diesem Mieter keine Nebenkosten ab. Stehen im unterschriebenen Mietvertrag Nebenkosten, kreuzen Sie sie an.» Das gilt beim Bearbeiten und im Assistenten. Den Fall «alle vergessen» würde ich jetzt bemerken. |
| P-5 | Minor | Assistent Schritt 5 «Prüfen», Vertragsseite | Auf der Prüfseite und nach dem Speichern auf der Vertragsseite steht nur «Vereinbarte Nebenkosten: Keine», ohne Hinweis, obwohl ein Akonto von CHF 150.00 (bzw. CHF 300.00 bei Anna) bleibt. Wer in Schritt 4 nicht ganz nach unten gescrollt hat, sieht den gelben Kasten nie. |

### Ablauf

1. **Anna Schmidt → Mietvertrag bearbeiten.** In den frischen Demodaten sind alle 12 Kategorien angekreuzt (Treppenhausreinigung steht nicht mehr in der Liste). Kein Hinweis zu sehen, wie erwartet.
2. **Alle 12 Häkchen weg.** Erwartet: ein Hinweis. Gesehen: Nach dem letzten Tippen (Kaminfeger, ganz unten im Bild) liegt der Kasten knapp unter dem Bildschirmrand, bei y ≈ 868 auf einem 844 px hohen Bildschirm (Screenshot `n1-untick-viewport.png`: nur leere Kästchen zu sehen). Sobald ich zum Speichern-Knopf weiterscrolle, sehe ich ihn zwischen «Kaminfeger» und «Monatlich total», direkt über «Änderungen speichern» (Screenshot `n2-at-save.png`). Weil ich zum Speichern sowieso dort vorbei muss, übersehe ich ihn nicht. Der Kasten wird auch vorgelesen (er steht in einem Statusbereich).
3. **Ein Häkchen wieder gesetzt (Heizung).** Der Kasten verschwindet sofort, nach dem erneuten Abwählen ist er wieder da. Gut.
4. **Trotzdem «Änderungen speichern».** Erwartet: ein Hinweis oder eine Rückfrage. Gesehen: Dwello speichert ohne Rückfrage, die Vertragsseite zeigt «Vereinbarte Nebenkosten: Keine» und weiter «Akonto CHF 300.00». Das finde ich in Ordnung: Ein Vertrag ohne Nebenkosten kann ja stimmen, und gewarnt wurde ich vorher.
5. **Neuer Mietvertrag: Pierre Dubois, Wohnung 3.02, Beginn 01.01.2027, 1400 / 150 Akonto, Verwaltungspauschale Satz des Abrechnungslaufs, alle Häkchen weg.** Derselbe gelbe Kasten unter der Liste, direkt über «Weiter» (Screenshot `n4-wiz-at-weiter.png`). Gleicher Text wie beim Bearbeiten.
6. **«Weiter» zu Schritt 5.** Erwartet: Der Hinweis wird hier noch einmal gezeigt. Gesehen: nur «Vereinbarte Nebenkosten: Keine» mit «Ändern», keine Farbe, kein Hinweis (Screenshot `n4-wiz-step5.png`) (P-5). Nicht gespeichert, abgebrochen.
7. **Anna wiederhergestellt.** Beim erneuten Öffnen von «Bearbeiten» stand der gelbe Kasten schon beim Laden da. Gut: So sehe ich auch später, dass etwas fehlt. Alle 12 wieder angekreuzt, gespeichert. Die Vertragsseite zeigt wieder alle 12 Kategorien, Gartenpflege eingeschlossen. Das ist der Stand der frischen Demodaten.

### Urteil

- **Alle vergessen:** Das würde ich jetzt merken. Der Kasten steht da, wo ich hinschaue, wenn ich speichern will. Der Text ist kurz, sagt, was passiert («rechnet keine Nebenkosten ab»), und was ich tun soll («kreuzen Sie sie an»).
- **Zu viele entfernt (aber nicht alle):** Dazu sagt Dwello weiterhin nichts. Wenn noch ein Häkchen gesetzt ist, verschwindet der Kasten. Das kann Dwello auch nicht wissen; dafür bleibt nur der Vergleich mit dem Papiervertrag (siehe P-2).
- Der Hinweis erwähnt das Akonto nicht. Bei CHF 300.00 Akonto und «keine Nebenkosten» hätte ich gern gelesen, dass das ganze Akonto zurückgeht. So muss ich es mir selbst zusammenreimen.

### Beobachtungen

- Im Assistenten steht «Entwurf gespeichert, 03:12». Ob dieser Entwurf von Pierre Dubois / 3.02 jetzt irgendwo liegen bleibt, habe ich nicht geprüft.
- Die Einleitung «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» ist unverändert (P-4).

### Vorschläge

- **P-5:** Assistent bis Schritt 4, alle Häkchen weg, «Weiter». Hilfreich wäre derselbe gelbe Hinweis auf der Prüfseite neben «Vereinbarte Nebenkosten: Keine», und auf der Vertragsseite ein kurzer Satz, wenn Akonto vereinbart ist und keine Nebenkosten. Wenn Akonto > 0: im Hinweis ergänzen «Das Akonto von CHF … geht mit der Abrechnung ganz an den Mieter zurück.»

### Nicht geprüft

- Ob eine Abrechnung bei einem Vertrag ohne Nebenkosten das ganze Akonto zurückgibt: keine Abrechnung erstellt.
- Ob der Entwurf des Assistenten auf dem Server gespeichert wird und für andere sichtbar ist.
- Querformat und andere Sprachen.
