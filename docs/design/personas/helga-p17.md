# Helga – Runde p17: Kündigung erfassen und Nachmieterin mit übernommenen Beträgen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-App auf http://localhost:3300, frische Demodaten. Gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/4a7c6673-41aa-588f-b826-4de1712d5e24/scratchpad/helga-p17/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag, Schritt 4 «Miete» | Der Hinweis sagt «Mietet der neue Mieter zum Beispiel den Parkplatz nicht, leeren Sie die Zusatzmiete», aber das Feld Zusatzmiete ist schon leer (bei Herrn Weber 0.00). Ich weiss danach nicht, ob der Parkplatz von Herrn Weber irgendwo anders steckt (in der Nettomiete?) und ob ich noch etwas abziehen muss. |
| P-2 | Nit | Neuer Mietvertrag, Schritt 4 «Miete» | Der Satz «Ein leeres Feld war dort 0.00.» ist holprig; ich musste ihn zweimal lesen, bis ich verstand, dass ein leeres Feld hier «war beim alten Vertrag null» heisst. |
| P-3 | Nit | Neuer Mietvertrag, Schritt 4 «Miete» | Der Hinweis nennt den alten Vertrag nur mit Daten («01.04.2022 – 31.03.2027, gekündigt»), nicht mit dem Namen «Thomas Weber». Erst beim zweiten Lesen war mir klar, dass das sein Vertrag ist. |
| P-4 | Nit | Neuer Mietvertrag, Schritt 3 «Vertragsdauer» | Der Vertragsbeginn 01.04.2027 steht schon drin, aber dieser Schritt sagt nicht, woher das Datum kommt (das stand nur in Schritt 2 bei «Wohnung wird später frei»). |

## Beobachtungen

- Der Weg von der Kündigung zur Nachmieterin ist sehr gut: Nach «Mietvertrag beenden» erscheint oben «Nächste Schritte» mit «Nachmieter erfassen», und die Meldung sagt «Die nächsten Schritte sehen Sie oben auf der Seite». So musste ich nichts suchen.
- Nach «Neuen Mieter erfassen» kam ich zurück in den Assistenten, Frau Huber war schon gewählt («Lea Huber ist gespeichert und für diesen Mietvertrag gewählt»), Wohnung A1 war schon gewählt mit «verfügbar ab 01.04.2027». Ich musste weder die Wohnung noch die Beträge noch einmal nachschauen.
- «Korrespondenzkanal» stand schon auf «Per Brief»; das Wort selbst ist mir fremd, aber der Hilfetext darunter erklärt es.
- Im Formular «Neuer Mieter» war ich unsicher, welche Adresse hingehört: die jetzige in Winterthur oder die künftige am Seeweg. Ich habe die Winterthurer Adresse eingetragen, wie mir gesagt wurde. Ein Satz wie «die Adresse, an die die Post geht» würde helfen.
- Im Fortschritt des Assistenten sehe ich bei 150 % nur Häkchen und Zahlen, nicht die Namen der Schritte (Screenshot `14-schritt4.png`); über dem Balken steht aber «Schritt 4 von 5: Miete», das reicht mir.
- Nach dem Speichern lande ich in der Liste aller Mietverträge statt beim neuen Vertrag; die Meldung «Mietvertrag von Lea Huber gespeichert» und die oberste Zeile «Lea Huber · Künftig ab 01.04.2027» zeigen aber, dass es geklappt hat.
- Wohnung A1 zeigt danach weiter «Vermietet» und unter «Aktueller Mieter» Thomas Weber «Mietvertrag seit 01.04.2022», ohne «gekündigt auf 31.03.2027». Die Übersicht zählt «0 Wiedervermietet». Laut Erklärung im Gebäude heisst «Wiedervermietet»: «Ein künftiger Mietvertrag ist abgeschlossen». Ich war kurz unsicher, ob A1 jetzt nicht «Wiedervermietet» heissen müsste; der Nachsatz «auch wenn sie bis dahin leer ist» deutet an, dass es nur für leere Wohnungen gilt.
- Herr Weber hat laut Dwello gar keine Zusatzmiete (0.00). Die Aufgabe sagt, er miete einen Parkplatz. Für Dwello gibt es also nichts wegzulassen; das hat mich bei P-1 verunsichert.

## Aufgabe geschafft: ja

Kündigung auf 31.03.2027 gespeichert, Mieterin Lea Huber erfasst, Mietvertrag ab 01.04.2027 (Nettomiete 1’200.00, Akonto 200.00, Zusatzmiete 0.00, total 1’400.00) gespeichert.

## Aufwand

Etwa 10 Minuten, 15 Schritte: Übersicht → Gebäude Seepark Residenz → Wohnung A1 → Mietvertrag von Thomas Weber → «Beenden» → Datum → «Mietvertrag beenden» → «Nachmieter erfassen» → «Neuen Mieter erfassen» → Formular → «Mieter erfassen» → 4 × «Weiter» → «Mietvertrag speichern».

## Ablauf

1. Übersicht. Erwartet: irgendwo das Gebäude. Gesehen: «Seepark Residenz 3/4 vermietet» unter «Vermietete Wohnungen pro Gebäude», angeklickt.
2. Gebäude. Erwartet: Liste der Wohnungen. Gesehen: «Wohnung A1, 3 Zimmer 68 m², Vermietet». Gut.
3. Wohnung A1. Erwartet: den Mieter und den Vertrag. Gesehen: «Aktueller Mieter Thomas Weber», Miete 1’200 / 200 / 1’400 und Link «Mietvertrag von Thomas Weber».
4. Mietvertrag Weber. Erwartet: einen Knopf «Kündigen». Gesehen: «Bearbeiten», «Beenden», «Löschen». «Beenden» passt, auch wenn ich «Kündigen» gesucht hätte.
5. Dialog «Mietvertrag von Thomas Weber, Wohnung A1, beenden?». Erwartet: Datum eingeben. Gesehen: Feld «Vertragsende» mit Erklärung «also der Kündigungstermin», Hinweis zur Kündigungsfrist. 31.03.2027 eingetippt, «Mietvertrag beenden». Klar und beruhigend.
6. Danach. Erwartet: Bestätigung. Gesehen: Meldung «endet am 31.03.2027», oben «Nächste Schritte» mit «Nachmieter erfassen». Vertragsende jetzt «Unbefristet, gekündigt auf den 31.03.2027» (Screenshot `07-nach-beenden.png`).
7. «Nachmieter erfassen». Erwartet: Formular für die neue Person. Gesehen: Assistent «Neuer Mietvertrag, Schritt 1 von 5: Mieter» mit Auswahlliste; Frau Huber fehlt, darunter «Neuen Mieter erfassen». Der Hilfetext sagt genau das. Gut.
8. «Neuer Mieter». Vorname, Nachname, Adresse eingetragen, «Per Brief» war schon gewählt. «Mieter erfassen».
9. Zurück im Assistenten, Frau Huber gewählt (Hinweis «Mieter erfasst»). «Weiter».
10. Schritt 2 Wohnung: A1 schon gewählt, «verfügbar ab 01.04.2027». «Weiter».
11. Schritt 3 Vertragsdauer: Beginn schon 01.04.2027 mit «Donnerstag, 1. April 2027», unbefristet. Erwartet hätte ich ein leeres Feld; passt aber (P-4). «Weiter».
12. Schritt 4 Miete. Erwartet: die Beträge selber suchen zu müssen. Gesehen: blauer Kasten «Beträge aus dem letzten Mietvertrag», Nettomiete 1200.00, Akonto 200.00, Zusatzmiete leer, total 1’400.00. Woher die Zahlen kommen, ist klar. Unklar: der Parkplatz (P-1, P-2, P-3). Ich habe nichts geändert.
13. Schritt 5 Prüfen: alles aufgelistet mit «Ändern» je Zeile, Zusatzmiete CHF 0.00. «Mietvertrag speichern».
14. Liste der Mietverträge mit Meldung «Mietvertrag von Lea Huber gespeichert», Lea Huber «Künftig ab 01.04.2027», Thomas Weber «Laufend 01.04.2022 – 31.03.2027, gekündigt».

## Verwirrung

- «Beenden» statt «Kündigen»: kurz gezögert, der Dialog erklärt es dann.
- «Korrespondenzkanal»: Fachwort, aber mit Hilfetext.
- «Zusatzmiete» und der Parkplatz: siehe P-1.
- «Ein leeres Feld war dort 0.00»: siehe P-2.
- «Akonto»: der Hilfetext erklärt es («Vorschuss für Nebenkosten»).
- Welche Adresse beim neuen Mieter (alte oder neue Wohnung)?
- «Vermietet» vs. «Wiedervermietet» bei A1 nach dem Speichern.

## Fehlerrisiken

- Wer wie ich einen Parkplatz im Kopf hat, sucht ihn nach dem Hinweis womöglich in der Nettomiete und zieht dort etwas ab, obwohl der alte Vertrag gar keine Zusatzmiete hatte.
- Die übernommenen Beträge werden leicht ungeprüft übernommen; der Hinweis «Prüfen Sie die Beträge» hilft, aber im Schritt «Prüfen» steht nicht mehr, dass sie aus dem alten Vertrag stammen.
- Beim neuen Mieter könnte jemand die Adresse der gemieteten Wohnung statt der Postadresse eintragen.

## Vorschläge

- **P-1:** Mietvertrag Thomas Weber beenden (31.03.2027) → «Nachmieter erfassen» → neuen Mieter erfassen → bis Schritt 4. Hilfreich: den Satz zum Parkplatz nur zeigen, wenn der alte Vertrag eine Zusatzmiete hatte; sonst z. B. «Im letzten Mietvertrag gab es keine Zusatzmiete.»
- **P-2:** gleicher Weg. Hilfreich: «Was im letzten Mietvertrag 0.00 war, bleibt hier leer.»
- **P-3:** gleicher Weg. Hilfreich: «aus dem Mietvertrag von Thomas Weber (01.04.2022 – 31.03.2027, gekündigt)».
- **P-4:** gleicher Weg bis Schritt 3. Hilfreich: ein Satz unter dem Feld wie «Der Tag nach dem Vertragsende des letzten Mietvertrags. Passen Sie ihn an, wenn der neue Mietvertrag später beginnt.»

## Nicht geprüft

- 200 % Zoom: nach dem Speichern hat A1 einen künftigen Vertrag, ein zweiter Durchgang auf A1 wäre nicht mehr derselbe Fall; in anderen Gebäuden darf ich nicht speichern.
- Was passiert, wenn ich die übernommenen Beträge ändere oder die Zusatzmiete bei einem Vertrag mit Parkplatz leere: Herr Weber hatte keine Zusatzmiete.
- Fehlerfälle (Speichern scheitert): nicht verlangt.
