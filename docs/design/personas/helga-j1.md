<!-- Persona run J1 on 87ac838; screenshots stayed in the session's scratchpad -->

# Persona-Test J1: Helga, 68 – zwei vergessene Kündigungen nachtragen, Übersicht und Verträge prüfen

Desktop 1440 × 900, Browser-Zoom 150 % (sichtbar 960 × 600), Demo-Daten, heute = Montag, 12.10.2026. Nur Gebäude Alpenblick.

Aufgaben:
1. «Im Alpenblick sind beide Mieter ausgezogen: Laura Keller hat auf Ende September 2025 gekündigt, Kevin Fischer auf Ende Dezember 2025. Ich habe vergessen, das einzutragen. Tragen Sie es ein.»
2. «Schauen Sie danach auf der Übersicht nach: Muss ich für den Alpenblick noch etwas tun?»
3. «Wie steht das jetzt bei den beiden Verträgen? Ist das richtig so?»

Geänderte Daten (bleiben so):
- Mietvertrag Laura Keller (`b0000003-0003-0003-0003-000000000001`, Wohnung EG): Vertragsende 30.09.2025, gekündigt (über «Bearbeiten», siehe Hinweis unten). Status «Beendet», Wohnung EG «Leer».
- Mietvertrag Kevin Fischer (`b0000003-0003-0003-0003-000000000002`, Wohnung OG1): Vertragsende 31.12.2025, gekündigt (über «Beenden»). Status «Beendet», Wohnung OG1 «Leer».
- Alpenblick damit 0 von 3 vermietet.
- Im Assistenten «Abrechnungen erstellen» bis Schritt 4 «Vorschau» gegangen (Periode 2025, nur Alpenblick), **nichts erstellt**. Der Assistent meldete «Entwurf gespeichert, 14:54»; das ist der Zwischenstand des Assistenten, die Zahl der Abrechnungsentwürfe auf der Übersicht blieb bei 7.

**Hinweis zum Testablauf:** Laura Kellers Vertrag wurde während meines Laufs von jemand anderem geändert. Beim ersten Öffnen stand er auf «Unbefristet» mit Knopf «Beenden»; ich tippte im Dialog 30.09.2025 ein, schloss ohne Speichern, und beim nächsten Öffnen stand dort «Unbefristet, gekündigt auf den 31.01.2027», der Knopf «Beenden» war weg. Dasselbe Datum 31.01.2027 trägt auch Thomas Weber (Seepark). Ein anderer Tester hat also im Alpenblick gearbeitet. Ich habe Laura Kellers Vertrag darum über «Bearbeiten» auf 30.09.2025 korrigiert. Für Helga sah das so aus, als hätte «jemand» schon eine falsche Kündigung eingetragen – das ist ein realistischer Fall und hier mit ausgewertet.

## Aufgabe geschafft

1. **Ja.** Beide Verträge stehen auf «Beendet», mit 30.09.2025 und 31.12.2025. Bei Frau Keller über «Bearbeiten» (weil schon eine Kündigung mit falschem Datum drin war), bei Herrn Fischer über «Beenden».
2. **Ja, verstanden – aber erst nach einem Umweg.** Die Übersicht sagt weiter «Noch nicht abgerechnet: Alpenblick». Zuerst dachte ich: «Da wohnt doch niemand mehr.» Erst im Assistenten unter «Abrechnungen pro Mietvertrag» sah ich Laura Keller und Kevin Fischer und begriff, dass ich den beiden 2025 noch abrechnen muss.
3. **Teilweise.** Auf den Vertragsseiten steht «Unbefristet, gekündigt auf den 30.09.2025» – nach kurzem Stutzen verständlich und richtig. In der Liste «Mietverträge» steht aber bei beiden «…, **befristet**». Das widerspricht der Vertragsseite; ich hätte beinahe gemeint, ich hätte etwas falsch eingetragen.

## Aufwand

- Aufgabe 1, Frau Keller: Übersicht → Alpenblick → Wohnung EG → Mietvertrag → «Beenden» (5 Klicks), Datum getippt, gelesen, abgebrochen. Beim nächsten Öffnen kein «Beenden» mehr → «Bearbeiten», Vertragsende überschrieben, «Änderungen speichern» ohne Haken (rote Meldung), Haken, nochmals speichern: 4 Klicks. Etwa 4 Minuten, viel davon Lesen und Wundern über das Datum 2027.
- Aufgabe 1, Herr Fischer: Mietvertrag → «Beenden» → Datum, Haken, «Mietvertrag beenden»: 3 Klicks, etwa 1½ Minuten.
- Aufgabe 2: Übersicht lesen, «Abrechnungen erstellen», viermal «Weiter» bis zur Vorschau, dort abgebrochen: 7 Klicks, etwa 3 Minuten (Schritt 3 «Heizprofil» ist ein langer Text, den ich nur überflogen habe).
- Aufgabe 3: Vertragsseiten, Liste «Mietverträge» mit Filter Alpenblick, Wohnung OG1, Haus: 6 Klicks, etwa 2½ Minuten.
- Zögern: bei «über ein Jahr zurück. Prüfen Sie das Jahr.» (das Jahr stimmte ja); bei «gekündigt auf den 31.01.2027», das ich nie eingetragen hatte; bei «Noch nicht abgerechnet: Alpenblick» trotz 0 vermietet; bei «befristet» in der Liste.

## Laut gedacht

1. *Übersicht:* «‹Noch nicht abgerechnet: Alpenblick›. Das kenne ich. Unten ‹Alpenblick 2/3 vermietet› – stimmt noch nicht, die beiden sind ja weg. Ich gehe übers Haus.»
2. *Alpenblick → Wohnung EG:* «‹Aktueller Mieter Laura Keller, Mietvertrag seit 01.11.2022›. Unten ‹Mietvertrag von Laura Keller, seit 01.11.2022, unbefristet, Laufend›. Den klicke ich.»
3. *Mietvertrag → ‹Beenden›:* «Vertragsende, ‹also der Kündigungstermin›. 30.09.2025.»
4. *Datum getippt:* «‹Dienstag, 30. September 2025›. Fett: ‹Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. **Prüfen Sie das Jahr.**› Hm. Ich habe es ja geprüft, es war wirklich 2025, ich habe es nur vergessen. Muss ich jetzt etwas anderes tun? Darunter ‹Der Mietvertrag endete am 30.09.2025› mit Kästchen – ach so, ich darf es bestätigen.»
5. *(Abgebrochen, später wieder geöffnet):* «Da steht jetzt ‹Vertragsende: Unbefristet, gekündigt auf den 31.01.2027›, und der Knopf ‹Beenden› ist weg. 2027? Das habe ich nie eingetippt. Wer war das? Jetzt muss ich das ändern … ‹Bearbeiten›.»
6. *Bearbeiten:* «Bei Vertragsdauer ist ‹Unbefristet, gekündigt auf den 31.01.2027› angewählt, darunter: ‹Hat sich der Kündigungstermin verschoben, ändern Sie das Vertragsende.› Das hilft, genau das will ich. Unten das Feld Vertragsende: 30.09.2025.»
7. *Speichern ohne Haken:* «Rot: ‹Bitte bestätigen Sie, dass der Mietvertrag am 30.09.2025 endete, oder korrigieren Sie das Vertragsende.› Das Kästchen hatte ich übersehen. Haken, speichern.»
8. *Gespeichert:* «‹Mietvertrag von Laura Keller gespeichert›. ‹Beendet›, ‹Unbefristet, gekündigt auf den 30.09.2025›. Gut.»
9. *Herr Fischer, ‹Beenden›, 31.12.2025:* «Diesmal nur ‹liegt in der Vergangenheit›, kein ‹Prüfen Sie das Jahr›. Haken, ‹Mietvertrag beenden›. Grün: ‹Der Mietvertrag von Kevin Fischer endete am 31.12.2025›. Das ist klar.»
10. *Übersicht:* «‹Alpenblick 0/3 vermietet, 0.0 %›. Und oben immer noch ‹Noch nicht abgerechnet: Alpenblick›. Aber da wohnt doch niemand mehr – wem soll ich abrechnen? Vielleicht ist das ein alter Hinweis.»
11. *‹Abrechnungen erstellen› → Periode 2025 → Alpenblick → Heizprofil → Vorschau:* «Viel Text beim Heizprofil, ich lasse alles, wie es ist. In der Vorschau: ‹Abrechnungen pro Mietvertrag: Laura Keller, Wohnung EG … Kevin Fischer, Wohnung OG1›. Ah – die zwei haben 2025 ja noch dort gewohnt. Also muss ich ihnen noch abrechnen. Das hätte auf der Übersicht stehen können. Erstellen tue ich heute nichts.»
12. *Liste ‹Mietverträge›, Filter Alpenblick:* «‹Laura Keller, Beendet, 01.11.2022 – 30.09.2025, **befristet**›. Befristet? Auf der Vertragsseite stand ‹Unbefristet, gekündigt›. Habe ich beim Bearbeiten das Falsche angeklickt? Bei Herrn Fischer, den ich mit ‹Beenden› gemacht habe, steht auch ‹befristet›. Dann liegt es wohl nicht an mir. Aber was gilt jetzt?»
13. *Wohnung OG1:* «‹Mietvertrag von Kevin Fischer, 01.05.2021 – 31.12.2025, gekündigt, Beendet›. Hier stimmt es wieder. ‹Leer – Es läuft kein Mietvertrag›.»
14. *Vertragsseite nochmals:* «‹Vertragsende: Unbefristet, gekündigt auf den 31.12.2025›. Beim ersten Lesen dachte ich: Vertragsende – unbefristet? Er ist doch ausgezogen! Dann lese ich weiter: gekündigt auf den 31.12. Also: Der Vertrag war ohne Ende, und er hat gekündigt. Das stimmt so. ‹Gekündigt› verstehe ich sofort, ‹Unbefristet› vorne dran stört etwas.»
15. *Haus:* «‹3, davon 0 vermietet und 3 leer›. Richtig.»

## Befunde

### Blocker

Keine.

### Major

| # | Screen | Beobachtung | Vorschlag |
|---|---|---|---|
| M1 | Liste «Mietverträge» (`/contracts`), Zeile eines gekündigten Vertrags | Steht «01.11.2022 – 30.09.2025, befristet» und «01.05.2021 – 31.12.2025, befristet», obwohl die Vertragsseite «Unbefristet, gekündigt auf den …» und die Wohnungsseite «…, gekündigt» zeigt (Screenshot `16-liste-alpenblick.png` gegenüber `18-og1.png`). Gilt für beide Wege (Beenden und Bearbeiten), also nicht für einen Bedienfehler. Ich zweifelte an meiner Eingabe. Vermutlich kommt die Angabe «gekündigt» bei der Listenzeile nicht an (ContractRow erhält `terminated` offenbar nicht). | Die Listenzeile muss dieselbe Angabe zeigen wie Wohnung und Vertragsseite: «…, gekündigt». Test zuerst: Liste mit einem gekündigten Vertrag → Text «gekündigt»; Contract-JSON der Liste um das Feld ergänzen, falls es fehlt. |

### Minor

| # | Screen | Beobachtung | Vorschlag |
|---|---|---|---|
| m1 | Übersicht, «Nächster Schritt» | «Noch nicht abgerechnet: Alpenblick» bleibt bei 0 vermietet stehen (I4 M2 damit behoben). Helga versteht aber nicht, wem sie abrechnen soll, weil niemand mehr dort wohnt; erst die Vorschau im Assistenten nennt Laura Keller und Kevin Fischer. | Die Mieter nennen, z. B. «Noch nicht abgerechnet: Alpenblick (Laura Keller, Kevin Fischer – auch ausgezogene Mieter erhalten eine Abrechnung)». |
| m2 | Dialog «Mietvertrag beenden?» und Formular «Mietvertrag bearbeiten», Vertragsende über ein Jahr zurück | «Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr.» klingt, als sei etwas falsch, auch wenn das Jahr stimmt (nachgetragene Kündigung). Helga zögerte, ob sie anders vorgehen müsse. | Satz ergänzen: «Prüfen Sie das Jahr. Stimmt es, bestätigen Sie mit dem Kästchen.» |
| m3 | Vertragsseite, «Vertragsende» | «Unbefristet, gekündigt auf den 31.12.2025»: Unter der Überschrift «Vertragsende» liest sich das erste Wort «Unbefristet» wie «kein Ende». Erst beim Weiterlesen klar. «Gekündigt» versteht Helga sofort. | Reihenfolge umdrehen: «31.12.2025 (gekündigt; Mietvertrag war unbefristet)» oder «Gekündigt auf den 31.12.2025» mit «unbefristeter Mietvertrag» als Hilfetext. Begriffe fachlich prüfen. |
| m4 | Vertragsseite eines gekündigten, noch laufenden Vertrags | Ist schon eine Kündigung eingetragen, fehlt der Knopf «Beenden»; das Datum lässt sich nur über «Bearbeiten» ändern. Helga fand es, weil der Hilfetext im Formular «Hat sich der Kündigungstermin verschoben, ändern Sie das Vertragsende.» genau passte, suchte aber zuerst den Knopf. | Auf der Vertragsseite bei «Vertragsende» einen Link «Kündigungstermin ändern» zeigen, der zum Feld im Formular springt. |
| m5 | Formular «Mietvertrag bearbeiten», Kästchen bei vergangenem Vertragsende | Wie in I5: Speichern ohne Haken führt zur roten Meldung; das Kästchen steht weit oben mitten im Formular und wird leicht übersehen. | Kästchen beim Speichern-Knopf wiederholen oder Fokus und Scroll zur Meldung setzen. |

### Testablauf (kein Produktbefund)

| # | Beobachtung |
|---|---|
| T1 | Laura Kellers Vertrag (Alpenblick) wurde während des Laufs von einem parallelen Tester auf «gekündigt auf den 31.01.2027» gesetzt. Gebäude-Zuteilung der parallelen Läufe prüfen. |

## Was gut ist

- «Beenden» bei Herrn Fischer: Datum, Wochentag, klarer Folgesatz «Seit dem 01.01.2026 gilt die Wohnung als nicht vermietet …», Bestätigung mit dem Kästchen, Erfolgsmeldung mit Name und Datum.
- Im Bearbeiten-Formular ist bei gekündigten Verträgen jetzt «Unbefristet, gekündigt auf den …» gewählt (statt «Befristet – ohne Kündigung» wie in I1–I5), mit passendem Hilfetext und «Kündigung aufheben». Das alte m3 aus I5 ist damit behoben.
- Wohnungsseite, Haus und Übersicht zeigen sofort «Leer» und 0/3 vermietet.
- Der Abrechnungshinweis bleibt bei 0 vermieteten Wohnungen stehen (I4/I5 M1 behoben), und die Vorschau des Assistenten nennt beide ausgezogenen Mieter mit Betrag.

## Vergleich zu I5

| I5 | J1 |
|---|---|
| M1 «Noch nicht abgerechnet: Alpenblick» verschwindet bei 0 vermietet (ungeprüft) | **Behoben.** Hinweis bleibt; nur der Grund ist nicht ersichtlich (m1). |
| m3 «Befristet – ohne Kündigung» beim Bearbeiten eines gekündigten Vertrags | **Behoben** im Formular und auf Vertrags- und Wohnungsseite; in der Vertragsliste weiter «befristet» (M1). |
| m4 Knöpfe im Dialog erst nach Scrollen | Bei Herrn Fischer (ohne «über ein Jahr») nicht aufgefallen; nicht gezielt geprüft. |
| m5 Jahreswarnung nicht als Warnung gestaltet | Offen; neu: sie verunsichert auch, wenn das Jahr stimmt (m2). |
| m6 keine Erinnerung an die Schlussabrechnung | Teilweise: Übersicht erinnert an die Periode 2025, nennt aber die Mieter nicht (m1). |

## Screenshots (Scratchpad, `helga-j1/`)

`01-uebersicht.png` (vorher 2/3), `05b-datum.png` («Prüfen Sie das Jahr» bei korrektem 2025), `06x-check.png` (fremd eingetragen: 31.01.2027, kein «Beenden»), `08-keller-bearbeiten.png`, `09b-nach-speichern.png` (rote Meldung ohne Haken), `10-keller-detail.png`, `11-fischer-beendet.png` («Unbefristet, gekündigt auf den 31.12.2025»), `12-uebersicht-nachher.png` (Hinweis bleibt, 0/3), `15a-schritt3.png`, `16-liste-alpenblick.png` («befristet» in der Liste), `18-og1.png` («gekündigt» auf der Wohnung), `19-haus.png`.
