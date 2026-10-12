<!-- Persona run I4 on fa6f5df; screenshots stayed in the session's scratchpad -->

# Persona-Test I4: Anna, 29 – Vertragsbeginn korrigieren, Vertragsende prüfen, Nettomiete eines früheren Mieters ändern

**Persona:** Anna, 29, vermietet zum ersten Mal, öffnet Dwello nach Monaten wieder, ordnungsliebend. Fenster 1024 × 768 (Kit mit `viewport: 'desktop'` geöffnet, danach mit `page.setViewportSize` auf 1024 × 768 gesetzt). Heute: Montag, 12.10.2026.

**Aufgaben:**

1. «Bei einem Mieter im Musterhaus Zentrum habe ich den Vertragsbeginn falsch erfasst: Er ist erst am 01.05.2025 eingezogen. Korrigieren Sie das.» (über «Bearbeiten»)
2. «Derselbe Mieter sagt, er sei schon Ende März 2025 ausgezogen.» («Beenden» auf 31.03.2025, Ablehnung lesen, abbrechen)
3. «Bei einem früheren Mieter war die Nettomiete falsch.» (Nettomiete eines beendeten Vertrags über «Bearbeiten» ändern und zurücksetzen)

**Gewählter Vertrag für 1 und 2:** Pierre Dubois, Wohnung 2.01, laufend seit 01.01.2023, unbefristet. Abrechnungen: NK-11111111-2024-0003 (Bezahlt) und NK-11111111-2025-0003 (Entwurf, 365 Mietstage).
**Gewählter Vertrag für 3:** Kevin Fischer, Wohnung 1.01, beendet (01.06.2018 – 28.02.2021). Im Musterhaus Zentrum ist das der einzige beendete Mietvertrag, und er hat **keine** Nebenkostenabrechnung (die Liste hat nur Abrechnungen 2024 und 2025). Ein beendeter Vertrag *mit* Abrechnung existiert nur in der Seepark Residenz (Sarah Meier) und war für diesen Test tabu. Die eigentliche Frage von Aufgabe 3 (speichert ein beendeter Vertrag mit Schlussabrechnung wieder?) liess sich deshalb nicht prüfen.

**Geänderte Daten:**

- Mietvertrag Kevin Fischer (Wohnung 1.01, Musterhaus Zentrum, beendet): Nettomiete CHF 1’350.00 → CHF 1’400.00 gespeichert, danach wieder auf CHF 1’350.00 gesetzt. Endzustand wie vorher (nur der Änderungszeitpunkt ist neu).
- Mietvertrag Pierre Dubois: **unverändert** (beide Versuche wurden abgelehnt bzw. abgebrochen; nach dem Neuladen weiterhin 01.01.2023, unbefristet, CHF 1’650.00).
- Keine Nebenkostenabrechnung gelöscht, erstellt oder geändert.

## Aufgabe geschafft

- **Aufgabe 1: Nein.** Dwello lehnt den neuen Vertragsbeginn ab, weil die Abrechnung 2024 schon versendet ist. Das ist richtig (wenn Pierre erst 2025 eingezogen ist, war die Abrechnung 2024 falsch), aber die Meldung sagt nur «Prüfen Sie das Datum». Ich bin sicher, dass das Datum stimmt, und weiss danach nicht, was ich tun soll. Den Entwurf 2025 erwähnt die Meldung gar nicht.
- **Aufgabe 2: Ablehnung verstanden, abgebrochen (wie verlangt).** Grund und Weg sind klar, der Entwurf ist jetzt als «(Entwurf)» gekennzeichnet. Lesen konnte ich die Meldung erst nach Scrollen im Dialog.
- **Aufgabe 3: Ja, aber nur ohne Abrechnung geprüft.** Speichern klappt sofort mit «Mietvertrag von Kevin Fischer gespeichert», kein Kästchen, keine Ablehnung.

## Aufwand

- Vertrag finden: «Mietverträge» → Liste lesen → Pierre Dubois. 2 Klicks. Vorher in «Nebenkostenabrechnungen» nachgesehen, wer 2025 eine Abrechnung hat: 1 Klick plus «Nächste Seite».
- Aufgabe 1: «Bearbeiten» → Vertragsbeginn überschreiben → «Änderungen speichern» → Ablehnung. 3 Aktionen; die Seite springt zur Meldung, kein Scrollen nötig. Danach ratlos: rund 2 Minuten Nachdenken, ohne Lösung.
- Aufgabe 2: «Beenden» → Datum tippen → Kästchen → «Mietvertrag beenden» → im Dialog scrollen → lesen → «Abbrechen». 6 Aktionen.
- Aufgabe 3: «Mietverträge» → Kevin Fischer (beendet) → «Bearbeiten» → Nettomiete → speichern; dasselbe zum Zurücksetzen. 2 × 4 Aktionen.
- Gesamt rund 20 Aktionen und etwa 6 Minuten, davon die Hälfte Rätseln bei Aufgabe 1.

## Laut gedacht

1. *Mietverträge.* Elf Verträge, Pierre Dubois, Wohnung 2.01, «seit 01.01.2023». Stimmt nicht, er kam im Mai 2025. Hat er Abrechnungen? In «Nebenkostenabrechnungen» sehe ich auf Seite 1 NK-11111111-2025-0003 (Entwurf), auf Seite 2 NK-11111111-2024-0003 (Bezahlt). Huch, 2024 hat er bezahlt? Na ja, vielleicht habe ich das damals auch falsch gemacht.
2. *«Bearbeiten».* Oben gelber Kasten «Laufender Mietvertrag: Änderungen … gelten sofort». Ich überschreibe den Vertragsbeginn mit 01.05.2025, darunter steht «Donnerstag, 1. Mai 2025». Kein Kästchen, keine Warnung, dass ich damit über zwei Jahre Mietzeit wegnehme. «Änderungen speichern».
3. *Ablehnung.* Die Seite springt nach unten zur roten Box: «Der Mietvertrag wurde nicht gespeichert. Die Nebenkostenabrechnung NK-11111111-2024-0003 ist schon versendet und rechnet Mietstage ab, die mit diesem Datum wegfallen. Dwello ändert eine versendete Abrechnung nicht. Prüfen Sie das Datum.»
   Ich verstehe: 2024 wurde schon abgerechnet, und zwar so, als hätte er dort gewohnt. Aber: In der Liste stand «Bezahlt», hier «versendet». Ist das dieselbe? Und «Prüfen Sie das Datum» – das habe ich geprüft, er ist im Mai 2025 eingezogen. Was jetzt? Muss ich Pierre Geld zurückgeben? Kann ich die Abrechnung 2024 stornieren? Die Meldung sagt es nicht, und auf der Abrechnung finde ich (aus I3) nur «Löschen» bei Entwürfen.
   Und was ist mit dem Entwurf 2025? Der rechnet ja auch Januar bis April ab. Den erwähnt die Meldung nicht. Wenn ich das 2024-Problem irgendwie löse, kommt dann die nächste Ablehnung?
   Passt die Meldung zu einem geänderten Vertragsbeginn? Halb: «Mietstage, die mit diesem Datum wegfallen» stimmt, aber sie klingt, als hätte ich mich vertippt. Bei einem echten Erfassungsfehler lässt sie mich allein.
4. *Ich breche ab.* Vertrag bleibt 01.01.2023. Ehrlich gesagt: Dass Pierre 2024 eine Abrechnung bezahlt hat, macht mich unsicher, ob er nicht doch 2023 kam. Hätte mir die Meldung das so gesagt («Pierre Dubois hat die Abrechnung 2024 schon bezahlt. Stimmt der Vertragsbeginn wirklich?»), hätte ich es schneller gemerkt.
5. *Aufgabe 2, «Beenden».* Der Dialog erklärt: «Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht.» Aha, Auszug ist nicht gleich Vertragsende. Gut zu wissen, das hatte ich nicht auf dem Schirm.
6. Ich tippe 31.03.2025. Fettgedruckt: «Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr. Bestätigen Sie das Vertragsende mit dem Kästchen.» Dann das Kästchen «Der Mietvertrag endete am 31.03.2025.» und darunter neu: «Seit dem 01.04.2025 gilt die Wohnung als nicht vermietet … Die Nebenkosten dieser Zeit trägt der Vermieter, das Akonto des Mieters zählt nur bis zum Vertragsende.» Das ist hilfreich, jetzt weiss ich, was das Kästchen bedeutet.
   Aber schon jetzt sind die Knöpfe unten nur halb zu sehen, der Dialog stösst an den Fensterrand.
7. *«Mietvertrag beenden».* Nichts sichtbar passiert. Ich sehe ganz unten den Rand einer roten Box mit «Das hat nicht geklappt», der Rest ist abgeschnitten. Ich scrolle im Dialog: «Die Nebenkostenabrechnung NK-11111111-2025-0003 (Entwurf) rechnet Mietstage ab, die mit diesem Datum wegfallen. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.» Klar, das kenne ich vom letzten Mal. «(Entwurf)» hilft: Ich weiss sofort, dass ich die löschen darf. Die Nummer ist aber immer noch kein Link. Diesmal soll ich nicht löschen, also «Abbrechen». Vertrag unverändert.
   Komisch: Im Formular hiess die Überschrift «Der Mietvertrag wurde nicht gespeichert», hier «Das hat nicht geklappt».
8. *Aufgabe 3.* Früherer Mieter im Musterhaus: Kevin Fischer, Wohnung 1.01, 2018 bis 2021, «Beendet». Abrechnungen von ihm? Im Vertrag «Dazu gehört → Nebenkostenabrechnungen»: wieder alle 17 Abrechnungen, keine von Kevin im Musterhaus. Also hat er keine.
9. *«Bearbeiten».* Kein gelber Kasten, gut. Bei «Wohnung» steht seine eigene Wohnung als «Wohnung 1.01 - Musterhaus Zentrum (nicht verfügbar)». Hä? Das ist doch seine Wohnung. Ah, Hans Müller wohnt jetzt dort. Trotzdem erschreckt mich das, ich fürchte, das Formular lässt mich nicht speichern.
10. Nettomiete 1400.00, «Änderungen speichern»: zurück auf der Vertragsseite, «Mietvertrag von Kevin Fischer gespeichert», Nettomiete CHF 1’400.00. Dann wieder 1350.00, gleiches Ergebnis. Einfach.

**Versteht Anna die Ablehnungen?**
- Vertragsbeginn: Den Grund ja, den Ausweg nein. «Prüfen Sie das Datum» passt nicht, wenn das Datum stimmt; die Abrechnung 2024 heisst «versendet», obwohl sie «Bezahlt» ist; der Entwurf 2025 fehlt in der Meldung.
- Vertragsende: Ja, Grund und Weg sind klar; nur die Lage der Meldung (unter dem Fensterrand) stört.

## Befunde

### Blocker

Keine. (Aufgabe 1 scheitert, aber mit Absicht: Dwello schützt eine bezahlte Abrechnung. Das Problem ist die fehlende Anleitung, siehe M1.)

### Major

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| M1 | Formular «Mietvertrag bearbeiten», Ablehnung nach späterem Vertragsbeginn | «Die Nebenkostenabrechnung NK-11111111-2024-0003 ist schon versendet und rechnet Mietstage ab, die mit diesem Datum wegfallen. Dwello ändert eine versendete Abrechnung nicht. Prüfen Sie das Datum.» Anna ist sicher, dass das Datum stimmt. Die Meldung sagt nicht, was sie dann tun kann, und lässt offen, ob die Abrechnung 2024 falsch war. Sackgasse. | Zwei Fälle ansprechen: «Pierre Dubois hat für 2024 schon eine Abrechnung erhalten und bezahlt. Ist er wirklich erst am 01.05.2025 eingezogen? Dann war die Abrechnung 2024 falsch: Klären Sie das direkt mit ihm (z. B. Rückzahlung); Dwello kann eine versendete Abrechnung nicht ändern. Sonst korrigieren Sie das Datum.» Abrechnung als Link. Den Weg in `offene-punkte.md` fachlich klären lassen (Storno/Gutschrift?). |
| M2 | Formular «Mietvertrag bearbeiten», Ablehnung | Nennt nur die erste blockierende Abrechnung (2024). Der Entwurf NK-11111111-2025-0003, der ebenfalls Mietstage ab Januar 2025 enthält, fehlt. Anna würde nach dem Lösen des ersten Problems in die nächste Ablehnung laufen. | Alle betroffenen Abrechnungen auflisten, getrennt nach «versendet/bezahlt (lässt sich nicht ändern)» und «Entwurf (zuerst löschen, danach neu erstellen)». |

### Minor

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| m1 | Dialog «Mietvertrag beenden?» bei 1024 × 768 | Schon vor der Ablehnung sind die Knöpfe unten angeschnitten (Dialog 736 px hoch, Inhalt höher). Nach der Ablehnung ist von der roten Box nur die Überschrift sichtbar (Box bei 696–880 px, Knöpfe bei 904 px); der Fokus geht auf den Dialog, nicht auf die Meldung, es wird nicht zur Meldung gescrollt. Unverändert seit I2. | Meldung direkt unter dem Datumsfeld zeigen oder beim Fehler dorthin scrollen und fokussieren; Kündigungsfrist-Absatz einklappbar machen; Knopfzeile fix am Dialogende. |
| m2 | Ablehnung Vertragsbeginn | «schon versendet», in der Liste steht die Abrechnung als «Bezahlt». Anna fragt sich, ob es dieselbe ist. | Den echten Status nennen: «ist schon bezahlt». |
| m3 | Formular «Mietvertrag bearbeiten», Vertragsbeginn | Beim Vorverlegen des Vertragsbeginns um über zwei Jahre gibt es keinen Hinweis vor dem Speichern (anders als beim Vertragsende mit Kästchen und Erklärung). | Bei geändertem Vertragsbeginn kurz zeigen, was wegfällt: «Damit fallen 01.01.2023 – 30.04.2025 weg (28 Monate).» |
| m4 | Mietvertrag → «Dazu gehört → Nebenkostenabrechnungen» | `/statements?contract=…` zeigt weiter alle 17 Abrechnungen (bei Kevin Fischer, der keine hat, besonders verwirrend). Unverändert seit I2. | Nach Vertrag filtern; bei keiner: «Für diesen Mietvertrag gibt es keine Nebenkostenabrechnung.» |
| m5 | Dialog «Mietvertrag beenden?» und Formular | Fehlerüberschrift einmal «Das hat nicht geklappt», einmal «Der Mietvertrag wurde nicht gespeichert». | Beide: «Der Mietvertrag wurde nicht beendet» bzw. «… nicht gespeichert». |
| m6 | Dialog, Ablehnung Vertragsende | Entwurfsnummer weiterhin kein Link (I3 M1 nur teilweise behoben: «(Entwurf)» ergänzt). | Link «Entwurf öffnen» bzw. Knopf «Entwurf löschen und Mietvertrag beenden». |
| m7 | Formular «Mietvertrag bearbeiten» eines beendeten Vertrags (Kevin Fischer) | Die eigene Wohnung steht als «Wohnung 1.01 - Musterhaus Zentrum (nicht verfügbar)» im Feld; Anna befürchtet, nicht speichern zu können. Gleichzeitig steht «Wohnung OG1 - Alpenblick» bei den freien Wohnungen, obwohl Kevin Fischer sie laut Liste laufend mietet. | Die eigene Wohnung des Vertrags nie als «nicht verfügbar» kennzeichnen; Verfügbarkeit für den Zeitraum dieses Vertrags berechnen. |
| m8 | Kästchen bei vergangenem Vertragsende | «Prüfen Sie das Jahr.» erschreckt weiterhin, wenn das Jahr stimmt (I3 m9). | «Stimmt das Jahr 2025?» |

## Was gut ist

- Die Ablehnungen kommen, bevor etwas kaputtgeht: Weder ein falscher Vertragsbeginn noch ein falsches Vertragsende verändert eine versendete Abrechnung oder einen Entwurf. Pierres Vertrag blieb in beiden Fällen unverändert.
- Die Ablehnung beim Vertragsbeginn erklärt den Grund in Annas Sprache («rechnet Mietstage ab, die mit diesem Datum wegfallen»), und die Seite springt mit Fokus zur Meldung.
- Im Beenden-Dialog ist der Entwurf jetzt als «(Entwurf)» gekennzeichnet, so dass Anna weiss, dass sie ihn löschen darf.
- Neu im Dialog: der Absatz unter dem Kästchen («Seit dem 01.04.2025 gilt die Wohnung als nicht vermietet … das Akonto des Mieters zählt nur bis zum Vertragsende») erklärt die Folge der Bestätigung.
- Die Hilfe zum Vertragsende («auch wenn der Mieter früher auszieht») korrigiert Annas Vorstellung, dass der Auszugstag das Vertragsende ist.
- Ein beendeter Vertrag ohne Abrechnung lässt sich ohne Hürden bearbeiten, mit klarer Erfolgsmeldung; kein überflüssiger «Laufender Mietvertrag»-Kasten.

## Vergleich zu I3

| I3 | Jetzt (I4) |
|---|---|
| M1: Entwurfsnummer in der Ablehnung ohne Link | **Teilweise.** «(Entwurf)» steht jetzt dabei, Link fehlt weiter (m6). |
| m1: Dialog bei 768 px mit Ablehnung zu hoch | **Unverändert/schlechter.** Durch den neuen Erklärungsabsatz sind die Knöpfe schon vor der Ablehnung angeschnitten (m1). |
| m2: Link «Nebenkostenabrechnungen» im Vertrag filtert nicht | **Unverändert** (m4). |
| m9: «Prüfen Sie das Jahr.» erschreckt | **Unverändert** (m8). Neu ist der Text zusammengefasst und fett, mit dem Absatz zur Folge unter dem Kästchen. |
| m7: Früheres Vertragsende nur über «Befristet» im Formular | Nicht erneut geprüft. |
| M2 (keine Erinnerung nach dem Beenden), M3 (Heizprofil beim Neu-Erstellen) | Nicht geprüft; in dieser Runde wurde nichts beendet oder neu erstellt. |
| – | **Neu geprüft:** späterer Vertragsbeginn. Wird zuverlässig abgelehnt, aber ohne Ausweg (M1), ohne den Entwurf 2025 (M2), mit falschem Status «versendet» statt «Bezahlt» (m2). |
| – | **Neu geprüft:** Bearbeiten eines beendeten Vertrags. Speichert ohne Hürde (nur ohne Abrechnung prüfbar); verwirrende «nicht verfügbar»-Markierung der eigenen Wohnung (m7). |
