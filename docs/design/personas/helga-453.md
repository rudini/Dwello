# Helga – «Abgerechnet bis» im Assistenten «Neuer Mietvertrag» (Runde 453)

Persona: Helga, 68, Desktop 1440 × 900 mit 150 % Zoom (kurz auch 200 %), Maus.
Aufgabe: Mieterin «Rosa Lang» erfassen, Mietvertrag für Wohnung 2.02 in «Musterhaus Zentrum» ab 01.01.2024 (Nettomiete CHF 1’200, Akonto CHF 150) erfassen und eintragen, dass der frühere Eigentümer die Nebenkosten bis 31.12.2024 abgerechnet hat. Einmal ein falsches Datum versuchen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-453/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Schritt 3 «Vertragsdauer», Feld «Abgerechnet bis» | Der Hilfetext ist ein Block aus sechs Sätzen. Die ersten zwei verstehe ich, ab «Reicht eine Abrechnungsperiode darüber hinaus, zählen Mietstage …» verliere ich den Faden. Das Wort «Mietstage» kenne ich nicht, ich hätte «Miettage» erwartet. |
| P-2 | Minor | Schritt 3, falsches «Abgerechnet bis» bei Vertragsbeginn in der Vergangenheit | Nach «Weiter» springt die Seite zum Vertragsbeginn mit dem roten Satz «… klicken Sie nochmals auf «Weiter»». Die eigentliche Fehlermeldung bei «Abgerechnet bis» liegt ausserhalb des Bildschirms. Ich sehe sie erst nach dem zweiten Klick. |
| P-3 | Minor | Schritt 3, Vertragsbeginn 01.01.2024 | Der Hinweis «liegt in der Vergangenheit» steht nach «Weiter» zweimal gleichzeitig da: einmal rot mit Fehlerzeichen unter dem Feld und einmal im gelben Kasten «Vertragsbeginn prüfen». Wegen dem Rot meine ich, ich hätte etwas falsch gemacht, obwohl das Datum stimmt. |
| P-4 | Nit | Schritt 5 «Prüfen» | Die Zeile «Abgerechnet bis: Dienstag, 31. Dezember 2024» zeigt nur das Datum. Ein kurzer Satz wie «Dwello rechnet ab 01.01.2025 ab» würde mir bestätigen, dass ich es richtig verstanden habe. |

## Beobachtungen

- Im Prüfschritt stehen «Nebenkostenpauschale» und «Verwaltungspauschale» direkt am Wert, ohne Abstand («NebenkostenpauschaleCHF 0.00»). Das betrifft nicht die Änderung.
- In der Mietvertragsliste steht bei Rosa Lang nach dem Speichern «Abrechnung fehlt». Zuerst habe ich erschrocken gedacht, mein «Abgerechnet bis» sei nicht angekommen. Erst in der Vertragsansicht steht «Abrechnung 2025 fehlt». Das stimmt: 2025 ist noch nicht abgerechnet. Die Liste nennt das Jahr aber nicht.
- In der Übersicht steht bei Musterhaus Zentrum jetzt «2025, 2023, 2022 …», aber nicht 2024. Das Jahr, das der frühere Eigentümer abgerechnet hat, verlangt Dwello also richtigerweise nicht.
- Die Vertragsansicht zeigt «Abgerechnet bis 31.12.2024». Der Hinweis «Haben Sie diese Periode ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein.» ist klar.
- Der Wizard geht über die Mieter-Seite auf, die Adresse im Browser bleibt dabei `/tenants/…`. Rosa war schon vorausgewählt, das hat mir geholfen.
- Bei 200 % Zoom erscheint im Schritt 3 keine seitliche Bildlaufleiste (Seitenbreite 720 = Fensterbreite).
- Nach dem Speichern meldet ein grüner Kasten «Mietvertrag von Rosa Lang gespeichert».

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten. Mieterin erfassen: 6 Eingaben und 1 Klick. Mietvertrag: 5 Schritte mit etwa 14 Eingaben und Klicks, dazu ein zweiter Klick auf «Weiter» wegen des Vertragsbeginns in der Vergangenheit. Die beiden Fehlversuche kosteten je 2 Klicks mehr.

## Ablauf

1. **Übersicht.** Erwartet: einen Weg, um einen Mieter anzulegen. Gesehen: «Häufige Arbeiten» mit «Mieter erfassen». Gut.
2. **Neuer Mieter.** Erwartet: ein einfaches Formular. Gesehen: Vorname, Nachname, Korrespondenzkanal, Sprache und Adresse, jedes Feld mit Beispiel. Ich habe «Rosa», «Lang» und «Bahnhofstrasse 10, 8400 Winterthur» eingetragen und «Mieter erfassen» geklickt. Die Mieterseite ging auf, oben stand «Mietvertrag erfassen».
3. **Mietvertrag erfassen, Schritt 1 Mieter.** Die Überschrift heisst «Neuer Mietvertrag», wie in meiner Aufgabe. Rosa Lang war schon gewählt. Weiter.
4. **Schritt 2 Wohnung.** Erwartet: 2.02 auswählen. Gesehen: Freie Wohnungen stehen oben, darunter «Wohnung 2.02 - Musterhaus Zentrum, 2.5 Zimmer, 65 m²». Gewählt, Weiter.
5. **Schritt 3 Vertragsdauer.** Ich habe beim Vertragsbeginn 01.01.2024 eingetippt. Darunter stand gleich «Montag, 1. Januar 2024» und ein gelber Kasten «Vertragsbeginn prüfen … liegt in der Vergangenheit. Stimmt das Datum? Sind die Nebenkosten schon ausserhalb von Dwello abgerechnet, tragen Sie unten «Abgerechnet bis» ein.» Dabei ist ein neues Feld «Abgerechnet bis (optional)» aufgetaucht. **Gefunden habe ich es also sofort, weil der gelbe Kasten mich hinschickt.** Den Hilfetext habe ich so verstanden: hier das Datum der letzten Abrechnung des früheren Eigentümers eintragen, also 31.12.2024. Den Rest des Textes (Perioden, die darüber hinausreichen, «Mietstage») habe ich nicht verstanden (P-1).
6. **Falsches Datum, Zukunft.** Bei «Abgerechnet bis» 31.12.2027 eingetragen, dann Weiter. Erwartet: eine Meldung beim Feld. Gesehen: Die Seite sprang nach oben zum Vertragsbeginn mit dem roten Satz «Der Vertragsbeginn … liegt in der Vergangenheit. Stimmt das Datum? Wenn es stimmt, klicken Sie nochmals auf «Weiter».» (Screenshot `12-viewport-nach-weiter.png`: oben nur das rote Feld «Vertragsbeginn» und der gelbe Kasten). Nach dem zweiten Klick sprang sie zu «Abgerechnet bis» mit «Abgerechnet bis kann nicht in der Zukunft liegen. Tragen Sie den letzten Tag der letzten Abrechnung ein, die ausserhalb von Dwello erstellt wurde.» (`14-viewport-nach-2x-weiter.png`). Diese Meldung ist klar und sagt mir, was ich tun soll. Der Weg dahin hat mich verwirrt (P-2).
7. **Falsches Datum, vor dem Vertragsbeginn.** 31.12.2023 eingetragen, dann Weiter. Gesehen: «Abgerechnet bis liegt vor dem Vertragsbeginn 01.01.2024. Lassen Sie das Feld leer, wenn für diesen Mietvertrag noch nichts ausserhalb von Dwello abgerechnet ist.» Diese Meldung ist ebenfalls verständlich und gibt einen Ausweg. Diesmal kam sie schon nach einem Klick, weil ich den Vertragsbeginn vorher bestätigt hatte.
8. **Richtiges Datum.** 31.12.2024 eingetragen. Der erste Klick auf Weiter zeigte wieder die rote Vergangenheits-Meldung (P-3), der zweite führte zu Schritt 4.
9. **Schritt 4 Miete.** Nettomiete 1200 und Akonto 150 eingetragen, Verwaltungspauschale «Nein». Die Häkchen bei «Vereinbarte Nebenkosten» habe ich gelassen. Weiter.
10. **Schritt 5 Prüfen.** Erwartet: alles auf einen Blick. Gesehen: Mieter Rosa Lang, Wohnung 2.02 - Musterhaus Zentrum, Vertragsbeginn Montag, 1. Januar 2024, Vertragsende Unbefristet, **Abgerechnet bis Dienstag, 31. Dezember 2024**, Nettomiete CHF 1’200.00, Akonto CHF 150.00, Nebenkostenpauschale CHF 0.00, Zusatzmiete CHF 0.00, Verwaltungspauschale Nicht vereinbart, alle zwölf Nebenkosten, «Monatlich total CHF 1’350.00». Jede Zeile hat «Ändern». Das Datum ist da, eine Erklärung zur Wirkung fehlt (P-4).
11. **Mietvertrag speichern.** Gesehen: die Liste «Mietverträge» mit dem grünen Kasten «Mietvertrag von Rosa Lang gespeichert». Rosa steht als «Laufend, seit 01.01.2024, unbefristet, Abrechnung fehlt».
12. **Kontrolle.** In der Vertragsansicht stehen «Abgerechnet bis 31.12.2024» und «Abrechnung 2025 fehlt». In der Übersicht ist 2024 bei Musterhaus Zentrum nicht als offen aufgeführt.

## Verwirrung

- «Mietstage»: dieses Wort kenne ich nicht. Ist «Miettage» gemeint?
- «Abrechnungsperiode … reicht darüber hinaus», «zählen … geleistete Akontobeiträge erst ab dem Tag danach»: Das verstehe ich nicht ohne Beispiel mit meinen Zahlen.
- Rot heisst für mich «falsch». Beim Vertragsbeginn ist es aber nur eine Rückfrage, im gelben Kasten steht dasselbe noch einmal.
- «Abrechnung fehlt» in der Liste direkt nach dem Eintrag von «Abgerechnet bis»: Welches Jahr ist gemeint?

## Fehlerrisiken

- Wer bei falschem «Abgerechnet bis» nur den oberen roten Satz sieht, bestätigt nochmals und meint, damit sei alles erledigt. Die Meldung beim zweiten Feld bemerkt man dann leicht zu spät (P-2). Gespeichert wird der Fehler aber nicht: Dwello hält mich auf.
- Wer den langen Hilfetext nicht versteht, könnte das Datum der Abrechnungsstellung eintragen (zum Beispiel den Tag, an dem der Brief des früheren Eigentümers kam) statt dem letzten Tag der Periode. Der erste Satz mit «letzten Tag der letzten solchen Abrechnung» und dem Beispiel hilft dagegen. Hervorgehoben wäre er sicherer.

## Vorschläge

- **P-1:** Schritt 3, Vertragsbeginn 01.01.2024 eintragen, Hilfetext bei «Abgerechnet bis» lesen. Hilfreich wären die ersten zwei Sätze sichtbar und der Rest kürzer, zum Beispiel: «Dwello rechnet ab dem Tag danach ab.» «Mietstage» durch «Miettage» ersetzen, falls das gemeint ist.
- **P-2:** Schritt 3, Vertragsbeginn 01.01.2024, «Abgerechnet bis» 31.12.2027, dann Weiter. Die Seite zeigt nur den Hinweis zum Vertragsbeginn. Hilfreich wäre, wenn bei einem echten Fehler zuerst dieser Fehler gezeigt würde, oder beide in einer Liste oben auf der Seite.
- **P-3:** Schritt 3, Vertragsbeginn 01.01.2024, dann Weiter. Die rote Meldung unter dem Feld und der gelbe Kasten sagen dasselbe. Hilfreich wäre nur der gelbe Kasten mit dem Satz «Wenn es stimmt, klicken Sie nochmals auf «Weiter»», ohne Rot.
- **P-4:** Schritt 5 mit «Abgerechnet bis» 31.12.2024. Hilfreich wäre ein Zusatz in der Zeile, etwa «Dwello rechnet ab 01.01.2025 ab».

## Nicht geprüft

- Das Nachtragen von «Abgerechnet bis» über «Bearbeiten» eines bestehenden Mietvertrags: Meine Aufgabe war der neue Mietvertrag, und andere Verträge wollte ich nicht ändern.
- Eine Abrechnung 2025 für Musterhaus Zentrum, um zu sehen, ob Rosas Akonto erst ab 01.01.2025 zählt: Das ist nicht Teil der Aufgabe und würde Abrechnungsdaten im Gebäude anlegen.
- Ein befristeter Vertrag mit «Abgerechnet bis» nach dem Vertragsende: nicht versucht.
- Die Kalenderschaltfläche neben den Datumsfeldern: Ich habe die Daten eingetippt.
- Bei 200 % Zoom habe ich nur Schritt 3 angesehen (ohne Speichern, mit Wohnung 3.02), nicht den ganzen Ablauf.
