# Dr. Weber – Runde w10c: Nicht vereinbarte Nebenkosten (Alpenblick, 2025)

Persona: Dr. Weber, 52, rechtlich vorsichtig. Desktop 1440 × 900, Maus. Persona-App auf http://localhost:3300 mit Demodaten; gespeichert nur im Gebäude «Alpenblick».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/e60c0fa6-2a4d-5c91-b5be-bcf2af1f206b/scratchpad/weber-w10c/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung (Detailseite, Vermieter-Sicht) | Die Seite zeigt nur die abgerechneten Kategorien. Dass bei Kevin Fischer Treppenhausreinigung (CHF 960.00) und Schneeräumung (CHF 1’300.00) im Gebäude angefallen, aber nicht verrechnet sind, und warum, steht nirgends. Vor dem Versand kann ich das nur mit der Rechnungsliste des Gebäudes selbst abgleichen. |
| P-2 | Minor | Assistent Schritt 3 und Vorschau | Eine Antwort «Vereinbart» wird sofort beim Mietvertrag gespeichert («Beim Mietvertrag gespeichert.») und ist danach im Assistenten nicht mehr zu sehen. Aufgelistet werden nur noch die *nicht* vereinbarten. Einen Fehlklick, der einem Mieter nicht vereinbarte Kosten verrechnet, sehe ich im Assistenten nicht mehr. |
| P-3 | Minor | Assistent Schritt 3, Hinweis «Sind diese Nebenkosten vereinbart?» | «Wählen Sie dann «Nicht vereinbart» und rechnen Sie den Rest selbst ab»: Unklar ist, was «der Rest» ist (der Teil ab dem Datum der Einführung?). Die Antwort bleibt ausserdem beim Mietvertrag gespeichert. Nächstes Jahr fragt Dwello nicht mehr und verrechnet die inzwischen gültig eingeführte Kategorie stillschweigend nicht. Ein Hinweis zum Nachtragen fehlt. |
| P-4 | Nit | PDF, Seite 2 «Hinweise» | «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Kaltwasser, Allgemeinstrom, Heizung.» Das liest sich wie die vollständige Liste der vereinbarten Nebenkosten. Kevin Fischers Vertrag nennt aber 11 Kategorien. Ein Mieter, der seinen Vertrag daneben legt, stutzt. |
| P-5 | Nit | Mietvertrag bearbeiten | Der Einleitungssatz «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» nennt die vereinbarten Nebenkosten nicht, obwohl man sie genau hier ändert. Gleich darunter steht «Änderungen an einem laufenden Mietvertrag gelten sofort», was beim Feld «Vereinbarte Nebenkosten» der Rechtslage widerspricht (neue Nebenkosten frühestens auf den nächsten Kündigungstermin). |
| P-6 | Nit | Mietvertrag bearbeiten, Feld «Vereinbarte Nebenkosten» | «Bestehende Abrechnungen ändern sich dadurch nicht.» Offen bleibt, ob das auch für Entwürfe gilt. Wenn ich mich bei Kevin vertan hätte: Muss ich den 2025-Entwurf löschen und neu erstellen? |

## Beobachtungen

- Die Rechtstexte in der Vorschau (Hinweis «Treppenhausreinigung: Neu …») stimmen inhaltlich mit Art. 269d OR überein: nur für die Zukunft, frühestens auf den nächsten Kündigungstermin, begründet, mit amtlichem Formular, mindestens 10 Tage vor Beginn der Kündigungsfrist beim Mieter, sonst nichtig. Sinnvoll ist auch der Satz zur Senkung der Nettomiete, wenn die Kosten bisher darin enthalten waren. Klar und mit Handlungsanweisung.
- Der Hilfetext beim Feld «Vereinbarte Nebenkosten» ist rechtlich korrekt und hilfreich. Gemeint sind die Sätze «übrige Nebenkosten genügt nicht» und «Heizkosten umfasst Kaminfeger».
- Nachgerechnet: Kevins Anteil an der Treppenhausreinigung wird nicht auf Laura Keller umgelegt. Sie trägt 72/255 m² = 28.24 %, also CHF 271.06 von CHF 960.00. Den Rest trage ich als Vermieter. So ist es richtig.
- Das PDF nennt Belegeinsicht (Art. 257b Abs. 2 OR) und Art. 8 VMWG. Gut.
- Der Assistent zeigt «Entwurf gespeichert, 02:38». Der Verlauf der erstellten Abrechnung zeigt «Erstellt 17.10.2026, 04:38». Zwei Stunden Unterschied: Eine der beiden Zeiten ist offenbar nicht in Schweizer Zeit.
- «Entwurf gespeichert» im Assistenten lässt sich mit dem «Entwurf» einer Abrechnung verwechseln. Gemeint ist offenbar nur der Stand des Assistenten.
- In der Schrittanzeige werden Wörter mitten im Wort umgebrochen: «Abrechnun / gsperiode», «Verwaltung / spauschale» (Screenshot 07-preview.png).
- Auf der Detailseite der Abrechnung (Vermieter-Sicht) steht «Ihre Nebenkosten» und «Ihr Mietverhältnis in dieser Periode». Das ist die Anrede an den Mieter und auf meiner Seite irritierend.
- Auf Kevins Mietvertrag steht «3 Abrechnungen fehlen» für 2021–2023 mit Knöpfen «abrechnen». Nachforderungen für 2021 wären heute heikel. Ein Hinweis auf Fristen oder Verjährung fehlt (Demodaten, nicht Teil der Aufgabe).
- In der Bearbeitungsmaske steht «Treppenhausreinigung» als erste Checkbox vor «Heizung». Die Reihenfolge weicht von der Liste auf der Vertragsseite ab.
- Die Vorschau warnt «Kaminfeger: Keine Rechnung … Im Vorjahr CHF 290.00» und «Kaltwasser: Rechnung für das 2. Halbjahr fehlt». Ich habe trotzdem erstellt (Aufgabe). Diese Warnungen sind klar formuliert.

## Aufgabe geschafft: ja

Zwei Entwürfe erstellt: NK-33333333-2025-0001 (Laura Keller, Nachzahlung CHF 130.00) und NK-33333333-2025-0002 (Kevin Fischer, Rückerstattung CHF 683.80). Das PDF von Kevin Fischer ist erstellt und geprüft. Der Mietvertrag von Kevin Fischer ist angesehen, aber nicht geändert.

## Aufwand

Rund 15 Minuten. Assistent: 5 Schritte, dazu 2 Fragen beantwortet und 1 Bestätigung angekreuzt, etwa 9 Klicks. Danach: Entwurfsliste, 2 Abrechnungen, PDF erstellen und herunterladen, Vertragsseite, Bearbeitungsseite.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis, dass 2025 abzurechnen ist. Gesehen: «Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Alpenblick» mit Knopf «Abrechnungen erstellen». Gut.
2. **Schritt 1 Abrechnungsperiode.** Erwartet: 2025 vorgeschlagen. Gesehen: 01.01.2025 – 31.12.2025 mit Wochentag. Weiter.
3. **Schritt 2 Gebäude.** Alpenblick angekreuzt («7 Rechnungen in der Abrechnungsperiode, 3 Wohnungen»). Weiter.
4. **Schritt 3 Heizprofil und Verwaltungspauschale.** Erwartet: eine Frage zur neuen Treppenhausreinigung. Gesehen: der gelbe Hinweis «Sind diese Nebenkosten vereinbart?» mit je einer Frage für Laura Keller und Kevin Fischer, «Vereinbart» / «Nicht vereinbart». Darunter ein blauer Hinweis: Kevin Fischer, Schneeräumung bereits nicht vereinbart. Der Erklärtext ist korrekt: Vereinbart ist nur, was im unterschriebenen Mietvertrag steht, nicht Vereinbartes trage ich selbst. Er ist aber lang (Screenshot 04-step3.png).
   - «Weiter» ohne Antwort: Beide Fragen werden rot markiert mit «Bitte wählen Sie, ob diese Nebenkosten im Mietvertrag vereinbart sind.» Gut, ich komme nicht ohne Antwort durch.
   - Laura: «Vereinbart», Kevin: «Nicht vereinbart». Je Antwort erscheint «Beim Mietvertrag gespeichert.». Erwartet hatte ich, dass erst am Schluss gespeichert wird. Das sofortige Speichern ist mir als vorsichtigem Vermieter etwas zu schnell.
   - Beim zweiten Durchlauf ist die Frage weg. Im blauen Hinweis steht nun «Kevin Fischer, Wohnung OG1: Schneeräumung, Treppenhausreinigung». Lauras «Vereinbart» ist nirgends mehr zu sehen (P-2).
5. **Schritt 4 Vorschau.** 2 Abrechnungen, Kosten CHF 4’726.25, dazu «Den Anteil leerer Wohnungen trägt der Vermieter». Im gelben Hinweis «Möglicherweise fehlen Rechnungen» steht die rechtliche Erklärung zur Treppenhausreinigung (siehe Beobachtungen). Sie sagt aber erneut «Prüfen Sie, ob sie in den unterschriebenen Mietverträgen stehen», obwohl ich das eben beantwortet habe. Meine Antworten pro Vertrag werden hier nicht wiederholt. «Weiter» ohne Häkchen bei «Die Abrechnungen trotzdem erstellen» bringt die Fehlermeldung «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Ich setze das Häkchen.
6. **Schritt 5 Erstellen.** «Es werden 2 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt.» Beruhigend. «Entwürfe erstellen» ergibt «2 Nebenkostenabrechnungen sind als Entwurf erstellt.» mit dem Link «Entwürfe ansehen».
7. **Entwurfsliste.** Beide Entwürfe mit Saldo, gefiltert auf Alpenblick 2025.
8. **Abrechnung Kevin Fischer.** Erwartet: ein Vermerk, dass Treppenhausreinigung und Schneeräumung nicht verrechnet sind. Gesehen: nur Kaltwasser, Allgemeinstrom und Heizung, kein Wort zu den übrigen Kosten (P-1, Screenshot 13-kevin.png). Bei Laura Keller steht die Treppenhausreinigung (CHF 271.06) neben Schneeräumung, Kaltwasser, Allgemeinstrom und Heizung, dazu die Verwaltungspauschale 3 %.
9. **PDF Kevin Fischer.** «PDF erstellen» wird zu «PDF herunterladen». Seite 1: Saldo, Kostenübersicht mit Verteilschlüssel 98.00 / 255.00 m² und Heizkosten nach Verbrauch. Seite 2: «Hinweise» mit «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Kaltwasser, Allgemeinstrom, Heizung.», dazu Belegeinsicht und Art. 8 VMWG. Für den Mieter ist das ausreichend. Die Formulierung wirkt aber wie eine vollständige Liste (P-4).
10. **Mietvertrag Kevin Fischer.** Erwartet: was vereinbart ist. Gesehen: «Vereinbarte Nebenkosten: Heizung, Warmwasser, Kaltwasser, Abwasser, Allgemeinstrom, Lift, Hauswart, Gartenpflege, Kehricht, TV/Kabelanschluss, Kaminfeger». Treppenhausreinigung und Schneeräumung fehlen, das ist richtig. Dass sie ausdrücklich *nicht* vereinbart sind, sehe ich nur an ihrer Abwesenheit. Wie ich es ändere, sagt die Seite nicht. Ich vermute «Bearbeiten».
11. **Mietvertrag bearbeiten (nur angesehen).** Hier gibt es die Gruppe «Vereinbarte Nebenkosten» mit Checkboxen und einem guten Hilfetext. Die Einleitung der Seite nennt das aber nicht und sagt «gelten sofort» (P-5, P-6). Nicht gespeichert.

## Verwirrung

- «den Rest selbst abrechnen» (Schritt 3): welcher Rest, und wo?
- «Entwurf gespeichert, 02:38» im Assistenten: welcher Entwurf? Und warum 2 Stunden vor der Zeit im Verlauf?
- «Bestehende Abrechnungen ändern sich dadurch nicht»: Zählen Entwürfe dazu?
- «Ihre Nebenkosten» auf meiner Vermieter-Seite.
- Spalten «Wohnungsanteil» (Betrag in CHF) und «Anteil» (Prozent) auf der Detailseite. Nach Begriff ist das umgekehrt zu erwarten; das PDF erklärt es in einer Fussnote, die Webseite nicht.

## Fehlerrisiken

- Ein Fehlklick auf «Vereinbart» wird sofort beim Mietvertrag gespeichert und verschwindet aus dem Assistenten. Der Mieter erhält dann eine Abrechnung mit nicht vereinbarten Kosten. Das ist nach Art. 257a OR unzulässig und angreifbar. Ich müsste jede Abrechnung Zeile für Zeile mit dem Vertrag vergleichen (P-2, P-1).
- Wer eine Kategorie per amtlichem Formular ab Mitte Jahr einführt und nach Anleitung «Nicht vereinbart» wählt, verliert sie auch für die Folgejahre. Dwello fragt nicht mehr, und die Abrechnung verrechnet sie stillschweigend nicht (P-3).
- Wer «Änderungen … gelten sofort» liest, könnte eine neue Kategorie beim laufenden Vertrag ankreuzen, ohne das amtliche Formular zu verwenden (P-5). Der Hilfetext darunter warnt zwar, aber erst weiter unten.

## Vorschläge

- **P-1:** Assistent für Alpenblick 2025 durchlaufen, Kevin Fischer «Nicht vereinbart», Entwurf öffnen. Hilfreich wäre unter der Kostenaufstellung ein Abschnitt «Nicht abgerechnet (nicht im Mietvertrag vereinbart)» mit Kategorie und Gebäudekosten, dazu ein Satz wie «Diesen Anteil tragen Sie als Vermieter.» und ein Link zum Mietvertrag.
- **P-2:** In Schritt 3 «Vereinbart» bei Laura Keller wählen, dann «Zurück» und erneut «Weiter»: Die Frage ist weg, und nichts zeigt die Antwort. Hilfreich wäre, beantwortete Fragen bis zum Ende des Assistenten mit der gewählten Antwort stehen zu lassen. Oder in der Vorschau eine Liste «Vereinbart (Angabe beim Mietvertrag): Laura Keller: Treppenhausreinigung», analog zur Liste der nicht vereinbarten. Im Treppenhaus-Hinweis der Vorschau dann die Antworten pro Mietvertrag nennen statt «Prüfen Sie, ob …».
- **P-3:** Hinweistext in Schritt 3 lesen. Besser wäre etwa: «… wählen Sie «Nicht vereinbart», rechnen Sie die Kosten ab dem Einführungsdatum ausserhalb von Dwello ab und kreuzen Sie die Kategorie nach dieser Abrechnung beim Mietvertrag unter «Vereinbarte Nebenkosten» an.»
- **P-4:** PDF von NK-33333333-2025-0002, Seite 2. Vorschlag: «Abgerechnet sind nur Nebenkosten, die im Mietvertrag vereinbart sind. In dieser Periode sind das: Kaltwasser, Allgemeinstrom, Heizung.»
- **P-5:** /contracts/…/edit von Kevin Fischer öffnen. Die Einleitung sollte die vereinbarten Nebenkosten nennen («Ändern Sie Vertragsdauer, Miete oder die vereinbarten Nebenkosten»). «gelten sofort» sollte ersetzt werden, etwa durch «Dwello übernimmt Änderungen sofort; rechtlich gelten neue Nebenkosten oder Mieterhöhungen erst nach amtlicher Mitteilung (Art. 269d OR).» Auf der Vertragsseite wäre ein Hinweis bei «Vereinbarte Nebenkosten» hilfreich: «Ändern unter «Bearbeiten»».
- **P-6:** Hilfetext beim Feld: «Bereits erstellte Abrechnungen und Entwürfe ändern sich nicht; löschen Sie einen Entwurf und erstellen Sie ihn neu, damit die Änderung gilt.» Vorausgesetzt, das ist das Verhalten.

## Nicht geprüft

- Ob ein Entwurf sich nach einer Änderung der vereinbarten Nebenkosten beim Mietvertrag ändert: Dafür hätte ich Kevins Vertrag ändern müssen, das war nicht Teil der Aufgabe.
- PDF von Laura Keller: nicht erstellt, die Aufgabe verlangte eine Abrechnung.
- Die Beträge im Einzelnen (Heizkosten, Akonto, Verwaltungspauschale): Sache von daten-pruefer. Nachgerechnet habe ich nur die Aufteilung der Treppenhausreinigung.
- Versand («Als versendet markieren»): bewusst nicht ausgelöst, die Aufgabe lautete «bevor Sie etwas versenden».
- Andere Sprachen und Mobilansicht: nicht Teil der Persona.
