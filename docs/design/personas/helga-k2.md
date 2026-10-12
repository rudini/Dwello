<!-- Persona run K2 on 0e3db29; screenshots stayed in the session's scratchpad -->
# Persona-Test K2: Helga – Kündigung und Nachmieter im Alpenblick

## Setup

- Persona: Helga, 68, hat ein kleines Haus geerbt, wenig Computererfahrung, liest jedes Wort, hat Angst, etwas kaputtzumachen
- Gerät: Desktop 1440 × 900, Browser-Zoom 150 % (effektiv 960 × 600 CSS-Pixel), Chromium, Sprache de-CH
- Datum: Montag, 12.10.2026
- Gebäude: nur «Alpenblick» (Bergstrasse 8, 3800 Interlaken); andere Testerinnen arbeiten gleichzeitig in den anderen Gebäuden
- App: http://localhost:3300 mit Demodaten, angemeldet als «Vera Verwalter»

## Aufgaben

1. «Kevin Fischer (Alpenblick) hat mir geschrieben: Er kündigt auf Ende Januar 2027. Tragen Sie das ein.»
2. «Ich habe schon einen Nachmieter: Laura Brunner zieht am 1. Februar 2027 in dieselbe Wohnung ein, Miete wie bisher. Tragen Sie sie ein.»
3. «Was muss ich jetzt noch tun? Schauen Sie in der Übersicht, auf der Wohnung und auf dem Mietvertrag von Kevin Fischer nach. Stimmt, was dort steht?»

## Geänderte Daten

- Mietvertrag von Kevin Fischer, Wohnung OG1, Alpenblick (`/contracts/b0000003-0003-0003-0003-000000000002`): mit «Beenden» gekündigt auf den **31.01.2027** (Anzeige danach «Unbefristet, gekündigt auf den 31.01.2027»).
- Neuer Mieter **Laura Brunner** (id `93a2cd4a-927f-4633-9a46-70ad3c2c97a5`): Korrespondenzkanal «Per Brief», Sprache Deutsch, Adresse Bergstrasse 8, 3800 Interlaken, keine E-Mail, kein Telefon.
- Neuer Mietvertrag von Laura Brunner (`/contracts/247aa4d5-428f-4f4b-a538-2510979a45d0`): Wohnung OG1, Alpenblick, ab **01.02.2027**, unbefristet, Nettomiete CHF 1’800.00, Akonto CHF 250.00, Zusatzmiete CHF 120.00 (total CHF 2’170.00).
- Sonst nichts. Ein Probedurchlauf des Assistenten mit vorgewählter Wohnung (bis Schritt 4) wurde nicht gespeichert.

## Aufgabe geschafft

| Aufgabe | Ergebnis | Begründung |
|---|---|---|
| 1 Kündigung eintragen | ja | Über Übersicht → Alpenblick → Wohnung OG1 → Mietvertrag → «Beenden». Der Dialog erklärt «Vertragsende» gut und zeigt den Wochentag («Sonntag, 31. Januar 2027»). Unsicherheit wegen des Worts «Beenden» (siehe M1). |
| 2 Nachmieterin eintragen | ja | Mit «Nachmieter erfassen» und «Neuen Mieter erfassen». Nach dem Umweg über «Neuer Mieter» war die Wohnung nicht mehr vorgewählt (M2), die Miete «wie bisher» musste Helga selbst abschreiben (M3). |
| 3 Was ist noch zu tun? | teilweise | Mietvertrag und Übersicht reagieren sinnvoll auf den Nachmieter. Die Wohnung zeigt danach nur noch «Vermietet – Ein Mietvertrag läuft», ohne Hinweis auf Auszug und Nachmieterin; die Kennzahl «Wiedervermietet» bleibt 0; unter «Fristen» fehlt das Vertragsende. Helga weiss nicht sicher, ob alles erledigt ist. |

## Aufwand

- Aufgabe 1: 5 Schritte (Alpenblick → Wohnung OG1 → Mietvertrag von Kevin Fischer → «Beenden» → Datum tippen → «Mietvertrag beenden»), etwa 6 Klicks, 1 Eingabe.
- Aufgabe 2: etwa 14 Schritte: «Nachmieter erfassen» → «Neuen Mieter erfassen» → 5 Felder → «Mieter erfassen» → «Weiter» → Wohnung erneut wählen → «Weiter» → Vertragsbeginn prüfen (war vorausgefüllt) → «Weiter» → 3 Beträge abschreiben → «Weiter» → «Mietvertrag speichern». Dazu ein Wechsel zurück zu Kevins Mietvertrag, um die Beträge nachzuschauen.
- Aufgabe 3: 4 Seiten (Übersicht, Gebäude, Wohnung OG1, beide Mietverträge), nur lesen.

## Laut gedacht

- Mietvertrag von Kevin: «Da steht ‹Beenden› und daneben rot ‹Löschen›. Kündigen steht nirgends. Wenn ich ‹Beenden› drücke, ist dann der Vertrag heute schon fertig? Kevin wohnt ja noch bis Januar.»
- Im Dialog: «Ah, ‹Der letzte Tag des Mietverhältnisses, also der Kündigungstermin›. Gut, Ende Januar ist der 31.01.2027. Schön, dass darunter ‹Sonntag, 31. Januar 2027› steht, dann habe ich mich nicht vertippt.»
- Hinweis zur Kündigungsfrist: «3 Monate – heute ist der 12. Oktober, bis Ende Januar sind es mehr als 3 Monate, also ist das in Ordnung. Aber was ist ein ‹nächster Kündigungstermin›? Gilt bei mir Ende Januar überhaupt?»
- Nach dem Speichern: «Die grüne Meldung sagt, wo die nächsten Schritte stehen. Sehr gut. ‹Nachmieter erfassen› – genau das will ich.»
- Mieterauswahl: «Laura Brunner ist nicht in der Liste, aber eine Nina Brunner. Nicht verwechseln! Ich nehme ‹Neuen Mieter erfassen›.»
- Formular Neuer Mieter: «Welche Adresse soll ich nehmen? Die, wo sie jetzt wohnt, oder die neue bei mir? Ich nehme die Bergstrasse 8.»
- Zurück im Mietvertrag: «Laura Brunner ist gewählt, schön. Aber bei der Wohnung muss ich wieder suchen – ich bin doch extra von der Wohnung OG1 gekommen.» … «‹verfügbar ab 01.02.2027›, das passt.»
- Schritt Miete: «Wie bisher – wie viel war das? Ich muss nochmals zurück zu Kevins Vertrag schauen. Hoffentlich ist der Entwurf dann nicht weg.» («Entwurf gespeichert, 19:37» beruhigt erst, als sie es liest – aber ist der Vertrag damit schon gespeichert?)
- Nach dem Speichern landet sie in der Liste «Mietverträge»: «Da steht Kevin Fischer zweimal! Einmal Musterhaus Zentrum, beendet 2021. Ist das ein anderer Kevin?»
- Übersicht: «Die Aufgabe ‹Nachmieter für Wohnung OG1 suchen› ist weg. Gut. Aber unter Fristen steht nichts vom 31. Januar. Muss ich mir das selbst aufschreiben?»
- Wohnung OG1: «Vorher stand ‹Vermietet bis 31.01.2027›, jetzt nur ‹Vermietet›. Und ‹Aktueller Mieter: Kevin Fischer› – dass er auszieht und Frau Brunner kommt, sehe ich erst ganz unten in der Liste.»
- Kevins Mietvertrag: «‹Der Nachmieter ist erfasst› – gut. ‹Für die Schlussabrechnung braucht es die neue Adresse› – die kenne ich noch nicht. Was ist eine Schlussabrechnung? Und gleich darunter ‹Abrechnung 2025 fehlt›, gelb. Habe ich etwas falsch gemacht?»

## Verwirrung inkl. Begriffe

- **«Beenden»** als Button für eine Kündigung: klingt nach «sofort aufhören». Das Wort «Kündigung» erscheint erst im Dialog.
- **«Unbefristet, gekündigt auf den 31.01.2027»** und Badge **«Laufend»**: «unbefristet» und gleichzeitig ein Enddatum wirkt widersprüchlich.
- **«Kündigungstermin», «nächster Kündigungstermin»**: Helga weiss nicht, welche Termine bei ihr gelten.
- **«Schlussabrechnung»**: nicht erklärt; Helga kennt nur «Nebenkostenabrechnung».
- **«Mietstage»** (Hinweis «Abrechnung 2025 fehlt»): Helga stolpert, sie kennt «Miettage». Und **«im Assistenten»**: welcher Assistent?
- **«Akonto»**, **«Zusatzmiete»**: im Assistenten gut erklärt, auf Wohnung und Mietvertrag ohne Erklärung.
- **«Korrespondenzkanal»**: verständlich dank Hilfetext, aber ein schweres Wort.
- **«Entwurf gespeichert, 19:37»**: Helga fragt sich, ob der Mietvertrag damit schon gilt.
- **«Wiedervermietet»** (Übersicht, Legende im Gebäude): laut Legende «Ein künftiger Mietvertrag ist abgeschlossen». Genau das trifft auf OG1 zu, trotzdem zeigt die Übersicht «0 Wiedervermietet» und die Wohnung «Vermietet».
- **Fortschritt im Assistenten**: in Schritt 5 stehen nur Häkchen ohne Beschriftung, Helga weiss nicht, welches Häkchen zu welchem Schritt gehört.

## Fehlerrisiken

- **Falsche Person wählen:** In der Mieterauswahl stehen «Nina Brunner» und «Laura Keller, Interlaken» – eine Verwechslung mit «Laura Brunner» liegt nahe. In der Liste «Mietverträge» erscheint «Kevin Fischer» zweimal (Alpenblick laufend, Musterhaus Zentrum beendet); wer über die Liste statt über das Gebäude geht, kann den falschen Vertrag öffnen.
- **Falsche Wohnung:** Nach dem Umweg über «Neuen Mieter erfassen» ist die Wohnung nicht mehr vorgewählt; in der Auswahl steht «Wohnung A1 – Seepark Residenz (verfügbar ab 01.02.2027)» mit demselben Datum wie OG1.
- **Falsche Miete:** Die Beträge des Vorgängers werden nicht übernommen; Helga muss sie abschreiben und kann sich vertippen.
- **«Beenden» neben «Löschen»:** Die zwei Buttons stehen direkt nebeneinander; wer vor «Beenden» Angst hat, probiert vielleicht «Bearbeiten» und ändert das Vertragsende von Hand, oder drückt aus Versehen «Löschen».
- **Vertragsende vergessen:** Weil der 31.01.2027 nicht unter «Fristen» erscheint und die Wohnung nur «Vermietet» zeigt, erinnert nichts in der Übersicht an Auszug, Wohnungsabnahme und neue Adresse von Kevin Fischer.
- **Adresse des neuen Mieters:** Ohne Hinweis trägt Helga die Mietadresse ein; ob das richtig ist (aktuelle Wohnadresse vor dem Einzug?), bleibt offen.

## Vorschläge

### Major

- **M1 – «Beenden» klingt nach sofort.** Wo: Mietvertrag von Kevin Fischer, Buttons «Bearbeiten | Beenden | Löschen». Gezeigt: Button «Beenden», Dialogtitel «Mietvertrag von Kevin Fischer, Wohnung OG1, beenden?», Button «Mietvertrag beenden». Vorschlag: Button «Kündigung eintragen» (oder «Kündigen»), im Dialog ein Satz «Der Mietvertrag läuft bis zu diesem Tag weiter. Es wird nichts gelöscht.»
- **M2 – Wohnung geht beim Umweg «Neuen Mieter erfassen» verloren.** Wo: Kevins Mietvertrag → «Nachmieter erfassen» (`/contracts/new?apartment=…OG1`) → «Neuen Mieter erfassen» → «Mieter erfassen». Gezeigt: Zurück im Assistenten ist «Laura Brunner ist gespeichert und für diesen Mietvertrag gewählt», in Schritt 2 aber «Wohnung wählen» statt Wohnung OG1. Vorschlag: die vorgewählte Wohnung durch den Umweg mitnehmen (auch «Abbrechen» im Mieterformular führt auf `/contracts/new` ohne Wohnung).
- **M3 – Nachmieter: Miete wird nicht übernommen.** Wo: Assistent «Neuer Mietvertrag», Schritt 4 «Miete», gestartet über «Nachmieter erfassen». Gezeigt: leere Felder, «Monatlich total CHF 0.00». Vorschlag: Beträge des bisherigen Mietvertrags der Wohnung vorausfüllen mit Hinweis «Wie bisher bei Kevin Fischer – passen Sie die Beträge an, falls sie sich ändern.»
- **M4 – Wohnung verliert nach dem Nachmieter jede Auszugs-Information.** Wo: Wohnung OG1, «Angaben zur Wohnung» und «Aktueller Mieter». Gezeigt nach der Kündigung: «Vermietet bis 31.01.2027»; nach dem Nachmieter nur «Vermietet – Ein Mietvertrag läuft» und «Kevin Fischer, Mietvertrag seit 01.05.2021». Vorschlag: z. B. «Vermietet – Kevin Fischer bis 31.01.2027, danach Laura Brunner ab 01.02.2027» oder einen Block «Nächster Mieter».
- **M5 – Vertragsende fehlt unter «Fristen».** Wo: Übersicht, Abschnitt «Fristen». Gezeigt: nur «28.10.2026 Zahlungsfrist · Hans Müller». Das Vertragsende von Kevin Fischer (31.01.2027) erscheint weder vor noch nach dem Erfassen des Nachmieters. Vorschlag: Vertragsende als Frist zeigen (mindestens ab dem Zeitpunkt der Kündigung oder in den letzten 3 Monaten), mit Link auf den Mietvertrag.

### Minor

- **m1 – «Wiedervermietet» widerspricht der Legende.** Wo: Übersicht «Gebäude und Wohnungen» («0 Wiedervermietet») und Gebäude Alpenblick, «Was bedeutet der Mietstatus?» («Wiedervermietet: Ein künftiger Mietvertrag ist abgeschlossen; …»). OG1 hat einen künftigen Mietvertrag, zählt aber als «Vermietet». Entweder die Legende präzisieren («… und die Wohnung ist bis dahin leer») oder OG1 entsprechend zählen.
- **m2 – «Unbefristet, gekündigt auf den 31.01.2027».** Wo: Kevins Mietvertrag, «Vertragsdauer» → «Vertragsende». Vorschlag: «31.01.2027 (gekündigt)» – «Unbefristet» weglassen, sobald ein Vertragsende feststeht.
- **m3 – «Nächste Schritte» nennt die Nachmieterin nicht.** Wo: Kevins Mietvertrag nach dem Nachmieter. Gezeigt: «Der Mietvertrag ist gekündigt, der Nachmieter ist erfasst.» Vorschlag: «… Laura Brunner übernimmt ab 01.02.2027» mit Link auf ihren Mietvertrag; «der Nachmieter» ist zudem bei einer Frau unpassend.
- **m4 – «Schlussabrechnung» unerklärt.** Wo: Kevins Mietvertrag, «Nächste Schritte»: «Für die Schlussabrechnung braucht es die neue Adresse des Mieters.» Vorschlag: kurz erklären («die letzte Nebenkostenabrechnung nach dem Auszug») und sagen, dass das erst nach dem Auszug nötig ist.
- **m5 – «Mietstage» und «im Assistenten».** Wo: Kevins Mietvertrag, gelber Hinweis «Abrechnung 2025 fehlt». Gezeigt: «Der Mietvertrag hat Mietstage in dieser Abrechnungsperiode … Erstellen Sie sie im Assistenten.» Vorschlag: «Miettage» bzw. «Der Mieter hat 2025 hier gewohnt», «Erstellen Sie sie mit ‹Abrechnungen erstellen›.» Der gelbe Kasten wirkt nach der Kündigung wie ein Fehler, den Helga verursacht hat.
- **m6 – Doppelte Namen ohne Unterscheidung.** Wo: Liste «Mietverträge» (zweimal «Kevin Fischer») und Mieterauswahl im Assistenten («Laura Brunner, Interlaken», «Nina Brunner, Luzern», «Laura Keller, Interlaken»). Vorschlag: in der Auswahl zusätzlich Wohnung oder Geburtsjahr zeigen; in der Liste beendete Verträge standardmässig ausblenden oder ans Ende stellen.
- **m7 – Nach dem Speichern in der Liste statt beim neuen Vertrag.** Wo: «Mietvertrag speichern» → `/contracts`. Gezeigt: Meldung «Mietvertrag von Laura Brunner gespeichert», danach eine lange Liste mit allen Gebäuden. Vorschlag: auf den neuen Mietvertrag oder zurück zur Wohnung OG1 führen.
- **m8 – Adresse beim neuen Mieter unklar.** Wo: «Neuer Mieter», Gruppe «Adresse». Gezeigt: nur Beispiele («Musterstrasse 12»). Vorschlag: Hilfetext «Postadresse des Mieters. Zieht er erst ein, tragen Sie seine heutige Adresse ein» (fachlich prüfen).
- **m9 – Fortschritt in Schritt 5 ohne Beschriftung.** Wo: Assistent «Neuer Mietvertrag», Schritt 5 bei 150 % Zoom. Gezeigt: vier grüne Häkchen und «5», ohne die Namen der Schritte. Vorschlag: Schrittnamen auch bei erledigten Schritten zeigen.
- **m10 – «Entwurf gespeichert» verunsichert.** Wo: Assistent, unter jedem Schritt. Gezeigt: «Entwurf gespeichert, 19:37». Vorschlag: «Ihre Eingaben sind zwischengespeichert. Der Mietvertrag gilt erst nach ‹Mietvertrag speichern›.»

Kein Blocker: Alle Aufgaben liessen sich ohne Hilfe erledigen.
