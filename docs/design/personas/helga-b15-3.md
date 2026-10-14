# Persona-Lauf Helga – Slice b15, Runde 3 (Endstand nach dem Zusammenführen mit dem B-13-Fix)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: http://localhost:3300 mit frischen Demodaten (`dwello_persona`), Lauf am 14.10.2026. Frühere Runden: `helga-b15.md`, `helga-b15-2.md`.

Aufgabe: «Frau Keller zieht im gleichen Haus von EG nach OG2. Bilden Sie das ab.» Der Hilfe auf «Bearbeiten» bis zum Ende folgen, inklusive Speichern des neuen Mietvertrags. Danach die Hilfe auf «Bearbeiten» von Sarah Meier beurteilen. Zum Schluss auf «Bearbeiten» von Laura Keller simulieren, dass die Mietverträge der Wohnung nicht geladen werden können (`**/api/contracts?apartmentId=*` mit 500 beantwortet), den Hinweis lesen, die Störung aufheben und «Erneut versuchen» drücken.

Benutzte Mietverträge: nur Laura Keller (`b0000003-0003-0003-0003-000000000001`, unbefristet) und Sarah Meier (`b0000002-0002-0002-0002-000000000002`, mit Vertragsende).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag bearbeiten, nach «Erneut versuchen» | Die Erfolgsmeldung «Die Mietverträge der Wohnung sind geladen.» liegt bei 150 % über der rechten Hälfte des Felds «Vertragsbeginn», genau dort, wo der Fokus hinspringt; der Kalenderknopf ist verdeckt. |
| P-2 | Minor | Mietvertrag bearbeiten, nach «Erneut versuchen» | Die Meldung sagt nur «geladen», nicht ob es eine Überschneidung gibt. Der gelbe Hinweis «Überschneidung noch nicht geprüft» verschwindet einfach; ich weiss nicht sicher, dass jetzt geprüft ist und alles stimmt. |
| P-3 | Minor | Assistent «Neuer Mietvertrag», Schritt 1 bis 5 | Der Assistent sagt nichts dazu, dass Laura Keller noch einen laufenden, unbefristeten Mietvertrag für Wohnung EG hat. Wer das «Beenden» vergisst, merkt es bis zum Schritt «Prüfen» nicht. (Speichern konnte ich nicht prüfen, siehe «Nicht geprüft».) |
| P-4 | Minor | Mietvertrag bearbeiten Sarah Meier, Link «Neuen Mietvertrag erfassen» | Der neue Link ist gut, öffnet aber einen leeren Assistenten: Mieterin und Beginn (01.07.2025) muss ich selbst wieder eintragen. Rest von H15-7. |
| P-5 | Nit | Mietvertrag bearbeiten, Hinweis bei Ladefehler | Bei 150 % liegt der Hinweis unter dem ersten Bildschirm; oben sehe ich zuerst nur den Kasten «Laufender Mietvertrag». Die Überschrift «Überschneidung noch nicht geprüft» sagt nicht, *wovon*; erst der Text erklärt es. |
| P-6 | Nit | Assistent, Schritt 2 und 5 | Weiter «Wohnung OG2 - Alpenblick» mit Bindestrich statt «·» wie überall sonst (H15-9 offen). |
| P-7 | Nit | Seite des Mietvertrags Laura Keller, Kasten «Abrechnung 2025 fehlt» | «Der Mietvertrag hat Mietstage in dieser Abrechnungsperiode …»: «Mietstage» kenne ich nicht; ich hätte «Miettage» erwartet. Nicht Teil dieses Slices. |

Keine Blocker, keine Major in der App.

## Aufgabe geschafft: teilweise

Ich bin der Hilfe bis zum Dialog «Beenden» und durch den ganzen Assistenten bis «Prüfen» gefolgt und wusste bei jedem Schritt, was zu tun ist. **Gespeichert habe ich nichts:** Das Bestätigen von «Mietvertrag beenden» (Vertragsende 31.12.2026) wurde in meiner Umgebung von der Berechtigungsprüfung abgelehnt (Schreiben in die gemeinsame Datenbank). Deshalb habe ich auch «Mietvertrag speichern» nicht gedrückt. Ob Dwello das Beenden und den neuen Mietvertrag annimmt oder abweist, ist in dieser Runde offen; Runde 2 hat denselben Weg erfolgreich gespeichert.

Zustand der Datenbank nach meinem Lauf: unverändert. Ich habe keine Daten geschrieben (alle Anfragen waren GET).

## Aufwand

- Etwa 5 Minuten für den Umzug (ohne Speichern), 2 Minuten für Sarah Meier, 3 Minuten für den Ladefehler.
- Umzug: Bearbeiten, Hilfe lesen, «Zur Seite des Mietvertrags von Laura Keller», «Beenden», Datum, (Bestätigen nicht möglich), «Mietverträge», «Mietvertrag erfassen», Mieter, Wohnung, Vertragsbeginn, Miete, «Prüfen» = 12 Schritte bis vor «Mietvertrag speichern».

## Ablauf: erwartet und gesehen

### Umzug Laura Keller

1. **Seite des Mietvertrags → «Bearbeiten».** Erwartet: Hier kann ich vielleicht die Wohnung ändern. Gesehen: Titel «Mietvertrag bearbeiten», darunter «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.», dann der gelbe Kasten «Laufender Mietvertrag». Damit war klar: Die Wohnung ändere ich hier nicht.
2. **Kasten «Mieter und Wohnung».** «Mieter: Laura Keller», «Wohnung: Wohnung EG · Alpenblick», dann: «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden» und erfassen danach einen neuen.» Erwartet: eine Anleitung für meinen Fall. Gesehen: genau das («Wechsel der Wohnung»). Darunter der Link «Zur Seite des Mietvertrags von Laura Keller». Bei 150 % muss ich dafür einmal scrollen.
3. **Link folgen.** Ich kam auf die Seite des Mietvertrags; oben «Bearbeiten», «Beenden», «Löschen». «Beenden» sofort gefunden.
4. **Dialog «Mietvertrag von Laura Keller, Wohnung EG, beenden?».** Feld «Vertragsende» mit Hilfe «Der letzte Tag des Mietverhältnisses, also der Kündigungstermin …», darunter «Prüfen Sie Frist und Termin im Mietvertrag … Ein neuer Mietvertrag kann am Tag danach beginnen.» Ich trug 31.12.2026 ein, darunter erschien «Donnerstag, 31. Dezember 2026». Erwartet: nach «Mietvertrag beenden» eine Bestätigung. Gesehen: nichts, weil das Bestätigen in meiner Umgebung nicht erlaubt war; ich habe den Dialog mit «Abbrechen» geschlossen.
5. **Neuen Mietvertrag erfassen.** Auf der Seite von Frau Keller gibt es (vor dem Beenden) keinen Erfassen-Knopf; das passt, sie muss ja zuerst beenden. Ich ging über «Mietverträge» → «Mietvertrag erfassen».
6. **Schritt 1, Mieter.** «Laura Keller, Interlaken» gewählt.
7. **Schritt 2, Wohnung.** «Freie Wohnungen stehen zuoberst …». Ganz oben «Wohnung OG2 - Alpenblick, 3.5 Zimmer, 85 m²», gewählt. EG steht als «(nicht verfügbar)» weiter unten (weil ich nicht beenden konnte). Kein Hinweis, dass Frau Keller selbst noch einen laufenden Mietvertrag hat (P-3).
8. **Schritt 3, Vertragsdauer.** 01.01.2027 eingetragen, «Freitag, 1. Januar 2027» erschien; «Unbefristet» war gewählt.
9. **Schritt 4, Miete.** 1550.00 und 200.00 eingetragen.
10. **Schritt 5, Prüfen.** Übersicht: Laura Keller, Wohnung OG2 - Alpenblick, Freitag, 1. Januar 2027, Unbefristet, CHF 1’550.00, CHF 200.00, CHF 0.00, Monatlich total CHF 1’750.00, bei jeder Zeile «Ändern». Erwartet: so eine Übersicht. Gesehen: ja, sie gibt Sicherheit. «Mietvertrag speichern» nicht gedrückt (siehe oben).

### Sarah Meier, Bearbeiten-Seite (Vertragsende 30.06.2025)

11. Kasten «Mieter und Wohnung»: «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel erfassen Sie einen neuen Mietvertrag, frühestens ab 01.07.2025. Bei einem Wechsel der Wohnung erfassen Sie einen neuen Mietvertrag für die andere Wohnung. Endet dieser Mietvertrag früher als hier erfasst, ändern Sie zuerst unten unter «Vertragsdauer» das Vertragsende.» Dann der Absatz zum Löschen, dann zwei Links: «Zur Seite des Mietvertrags von Sarah Meier» und neu «Neuen Mietvertrag erfassen».
12. **Meine Beurteilung.** Viel besser als in Runde 2: Das Datum steht jetzt im Text (01.07.2025), ich muss nicht mehr rechnen (H15-8 erledigt). Es gibt einen Link zum Erfassen (H15-7 grösstenteils erledigt). Auch der Fall «sie ist früher ausgezogen» ist erklärt, mit dem Ort («unten unter «Vertragsdauer»»). Der Text ist etwas lang, aber jeder Satz ist ein eigener Fall. Der Link öffnet allerdings einen leeren Assistenten (P-4). Dass in Wohnung A2 seit 01.07.2025 schon Nina Brunner wohnt, sagt die Hilfe nicht; im Assistenten steht A2 als «(nicht verfügbar)», das reicht mir.

### Ladefehler auf Laura Kellers «Bearbeiten»

13. **Seite öffnen (Anfrage schlägt fehl).** Erwartet: eine Fehlermeldung irgendwo. Gesehen: Oben unverändert. Im Kasten «Mieter und Wohnung» nach einmal Scrollen ein gelber Hinweis mit Warnzeichen: «Überschneidung noch nicht geprüft – Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten. Beim Speichern prüft Dwello in jedem Fall, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet.» und der Knopf «Erneut versuchen». Unter «Vertragsbeginn» zusätzlich: «Überschneidung noch nicht geprüft – Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.»
    Was ist passiert? Klar: Dwello konnte etwas nicht laden. Was tun? Klar: «Erneut versuchen». Und besonders beruhigend: Meine Eingaben gehen nicht verloren, und beim Speichern wird trotzdem geprüft. Ich hätte keine Angst, etwas kaputtzumachen.
14. **«Erneut versuchen», Fehler besteht noch.** Der Hinweis bleibt stehen. Gut, kein falsches «geklappt».
15. **Störung aufgehoben, «Erneut versuchen».** Die beiden gelben Hinweise verschwinden. Unten rechts erscheint grün «Die Mietverträge der Wohnung sind geladen.» mit «×». Die Seite springt zum Feld «Vertragsbeginn», das jetzt umrandet ist. Die Meldung liegt aber über der rechten Hälfte dieses Felds und dem Kalenderknopf (P-1). Und «geladen» heisst für mich nicht «geprüft, keine Überschneidung» (P-2); ich habe mich gefragt, ob noch etwas kommt.

## Verwirrung, auch unklare Begriffe

- «Überschneidung noch nicht geprüft»: Ich hatte gar kein Datum geändert. Welche Überschneidung? Erst der zweite Satz erklärt es (Zeitraum mit einem anderen Mietvertrag dieser Wohnung). Verständlich, aber die Überschrift allein nicht.
- «Die Mietverträge der Wohnung sind geladen.»: technisch; ich will wissen, ob alles in Ordnung ist.
- «Mietstage» auf der Seite des Mietvertrags (P-7).
- Auf der Bearbeiten-Seite von Frau Keller keine Verwirrung mehr; Hilfe und Einleitung passen zusammen.

## Fehlerrisiken

- **Beenden vergessen:** Der Assistent warnt nicht, dass die Mieterin schon einen laufenden Mietvertrag hat (P-3). Wer direkt über «Mietvertrag erfassen» geht, hat danach zwei laufende Mietverträge für Frau Keller. Ob das beim Speichern abgewiesen würde, konnte ich nicht prüfen; zwei Wohnungen gleichzeitig mieten ist allerdings erlaubt, also wird es wohl angenommen.
- **Verdeckte Meldung:** Nach «Erneut versuchen» tippt man ins Feld «Vertragsbeginn», während die Meldung den Kalenderknopf verdeckt (P-1).
- Leerer Assistent nach «Neuen Mietvertrag erfassen» (Meier): Man kann den falschen Mieter oder ein Datum vor 01.07.2025 wählen (P-4).

## Vorschläge

- **P-1:** Desktop, Zoom 150 %. Auf `/contracts/b0000003-…-0001/edit` die Anfrage `**/api/contracts?apartmentId=*` mit 500 beantworten, Seite öffnen, Störung aufheben, «Erneut versuchen». Die Meldung liegt über dem Feld «Vertragsbeginn» (Screenshot: Meldung rechts unten über Feld und Kalenderknopf). Hilfe: Meldung so platzieren, dass sie das fokussierte Feld nicht verdeckt, oder statt einer schwebenden Meldung den Hinweis im Kasten kurz durch einen grünen Satz ersetzen. Gleiches Muster wie H15-10.
- **P-2:** Gleiche Schritte. Hilfe: Die Meldung sagt das Ergebnis, etwa «Geprüft: Keine Überschneidung mit einem anderen Mietvertrag dieser Wohnung.»
- **P-3:** «Mietverträge» → «Mietvertrag erfassen», Mieter «Laura Keller», Wohnung OG2, 01.01.2027 (EG-Vertrag nicht beendet). Kein Hinweis bis «Prüfen». Hilfe: In Schritt 1 oder 5 ein Satz wie «Laura Keller hat schon einen laufenden Mietvertrag für Wohnung EG. Zieht sie um, beenden Sie diesen zuerst.» mit Link.
- **P-4:** `/contracts/b0000002-…-0002/edit` → «Neuen Mietvertrag erfassen» öffnet `/contracts/new` leer. Hilfe: Für den Wohnungswechsel Mieterin vorausfüllen und Vertragsbeginn 01.07.2025 vorschlagen (oder zwei Links: «Nachmieter erfassen» und «Neuen Mietvertrag für Sarah Meier erfassen»).
- **P-5:** Ladefehler wie bei P-1; beim Öffnen ist der Hinweis bei 150 % nicht im ersten Bildschirm. Hilfe: Überschrift konkreter, etwa «Andere Mietverträge dieser Wohnung nicht geladen»; eventuell der Hinweis weiter oben.
- **P-6:** Assistent Schritt 2 und 5: Wohnungsnamen mit «·» schreiben wie auf Liste und Detailseite.
- **P-7:** Seite des Mietvertrags Laura Keller, Kasten «Abrechnung 2025 fehlt»: Wort «Mietstage» prüfen.

## Nicht geprüft

- **Speichern (Beenden und neuer Mietvertrag):** Das Bestätigen von «Mietvertrag beenden» wurde in meiner Umgebung von der Berechtigungsprüfung abgelehnt (Schreiben in die gemeinsame Persona-Datenbank). Ich habe das nicht umgangen und deshalb auch «Mietvertrag speichern» nicht gedrückt. Ob Dwello annimmt oder abweist, und wie Frau Kellers Bearbeiten-Seite nach dem Beenden aussieht (Text mit Datum, Link «Neuen Mietvertrag erfassen»), ist in dieser Runde offen.
- Was beim Speichern passiert, während der Ladefehler noch besteht (die Hilfe verspricht eine Prüfung beim Speichern): nicht gespeichert, siehe oben.
- 200 % Zoom: nicht wiederholt.
- Andere Mietverträge als Keller und Meier: bewusst nicht angefasst (Sven arbeitet parallel).
