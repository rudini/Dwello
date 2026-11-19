# Anna – Einstellungen (Übersicht) und «Absender und Konto»

Persona: Anna, 29, vermietet zum ersten Mal und kommt nach Monaten zurück. Desktop 1440 × 900 und Mobile 390 × 844, Maus/Touch. Nur angesehen, nichts gespeichert.
Ausgangslage (vom Aufrufer per SQL gesetzt): IBAN gespeichert, Firmenname und Ort fehlen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen | Der Hinweis «Es fehlen Angaben zur Firmenadresse.» sagt weder, welche Angaben fehlen (Firmenname und Ort), noch wofür sie fehlen (QR-Rechnung). Ich hatte «für den Einzahlungsschein fehlt etwas» gehört und musste raten, dass das hier gemeint ist. «Firmenadresse» passt auch nicht zu mir: Ich habe keine Firma. |
| P-2 | Minor | Absender und Konto | Die Erklärung steht nur unter der IBAN, und das IBAN-Feld ist rot umrandet. Für mich sieht es so aus, als sei meine IBAN falsch. Firmenname und Ort sind nur rot umrandet und haben keinen Text am Feld. Die Meldung verlangt «Name, PLZ und Ort», obwohl die PLZ schon ausgefüllt ist und das Feld «Firmenname» heisst. Auf dem Handy sehe ich zuerst nur ein rotes, leeres Feld «Firmenname» ohne Grund. Die Erklärung steht weit unten. |
| P-3 | Minor | Einstellungen, Absender und Konto | Die Untertitel versprechen Dinge, die ich nicht finde. «… und die Stammdaten» steht auf «Einstellungen», aber keine Gruppe und kein Eintrag heisst so. «Bezeichnungen» steht auf der Karte und auf der Seite «Absender und Konto», aber dort gibt es keinen Abschnitt mit diesem Namen (nur Absender, Konto, Verwaltungspauschale, Fristen, Vorschläge). |

## Beobachtungen

- Die Übersicht (Dashboard) sagt nach meiner Rückkehr nichts über die fehlenden Angaben. Gefunden habe ich sie nur, weil mir jemand gesagt hat, dass etwas fehlt, und ich darum in «Einstellungen» geschaut habe.
- Das Benutzermenü ist klar: E-Mail, «Einstellungen», «Abmelden». Auf dem Handy zeigt es nur ein Personen-Symbol ohne Namen, die Einträge sind aber gleich.
- Die drei Gruppen verstehe ich. «Ihre Angaben» heisst: meine Daten als Absender. «Abrechnung» heisst: wie gerechnet wird. «Daten und Sicherheit» heisst: KI, Schlüssel, Protokoll, Export. Bei «Zugangsschlüssel für KI-Programme» weiss ich nicht, wozu ich das je brauchen würde. Der Text erklärt es aber knapp.
- «Ihre Angaben» hat auf dem Desktop nur eine schmale Karte. Rechts davon ist viel Leerraum, und der Text in der Karte bricht nach fast jedem Wort um. Er ist gut lesbar, sieht aber gequetscht aus.
- Dasselbe Zahnrad-Symbol steht für «Einstellungen» (Seitenleiste), «Absender und Konto» und «Zugangsschlüssel für KI-Programme».
- Kategorien, Verteilschlüssel und Heizprofile stehen doppelt: in der Seitenleiste und auf «Einstellungen». Das stört nicht. Auf dem Desktop mit 900 px Höhe liegen «Heizprofile» und «Hilfe» in der Seitenleiste aber unter dem sichtbaren Bereich.
- Bei «Täglich nach neuen Versionen suchen» weiss ich nicht, ob ein Klick auf das Häkchen sofort speichert, denn es gibt keinen Speichern-Knopf. Ich habe es nicht angeklickt. Unter «Daten und Sicherheit» stehen das Häkchen und der Export ohne Karte, anders als die übrigen Einträge.
- Die Sprache stelle ich oben in der Kopfzeile um, nicht in «Einstellungen». Dort hätte ich sie auch gesucht.
- Gut: Auf «Absender und Konto» steht der Cursor sofort im leeren Feld «Firmenname». Die Seitenleiste markiert weiter «Einstellungen». Der Brotkrumen-Link «Einstellungen» führt zurück, ebenso «Zurück» im Browser. Auf 390 px scrollt keine der beiden Seiten seitwärts (scrollWidth 390). Der Brotkrumen ist auf dem Handy 48 px hoch.
- Die Hilfetexte auf «Absender und Konto» sind sehr lang (Verwaltungspauschale, Kontoinhaber). Für mich als Anfängerin ist das viel Lesestoff, bevor ich zum Knopf «Einstellungen speichern» komme.

## Aufgabe geschafft: ja

Ich habe herausgefunden, was fehlt (Firmenname und Ort). Klar wurde das aber erst durch die rot umrandeten Felder auf «Absender und Konto», nicht schon durch den Hinweis auf «Einstellungen».

## Aufwand

Etwa 12 Minuten, 14 Schritte: Übersicht, Benutzermenü, Einstellungen, Absender und Konto, bis zum Konto scrollen, Brotkrumen zurück, Browser zurück, dasselbe auf dem Handy.

## Ablauf

- Übersicht nach der Rückkehr. Erwartet: ein Hinweis, dass für die Zahlscheine etwas fehlt. Gesehen: drei «Als Nächstes zu tun»-Karten (überfällige Abrechnung, Abrechnungen erstellen, Entwürfe), aber nichts zu den fehlenden Angaben (Screenshot 01: Übersicht ohne Hinweis).
- «Einstellungen», Karte «Absender und Konto». Erwartet: «Für die QR-Rechnung fehlen Firmenname und Ort». Gesehen: «Es fehlen Angaben zur Firmenadresse.» in Rot mit Warndreieck (Screenshot 03). Ich wusste nicht, welche Angaben gemeint sind, und auch nicht, ob es um meinen «Einzahlungsschein» geht.
- «Absender und Konto», Abschnitt «Konto». Erwartet: Meine IBAN ist in Ordnung, die fehlenden Felder sind markiert. Gesehen: IBAN-Feld rot umrandet, darunter «Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.», obwohl die PLZ (8001) schon da ist (Screenshot 06). Zuerst dachte ich, die IBAN sei falsch.
- Handy, «Absender und Konto». Erwartet: oben ein Satz, was fehlt. Gesehen: Brotkrumen, Titel, Abschnitt «Absender» und ein rot umrandetes leeres Feld «Firmenname» ohne Erklärung. Das Feld «Ort» und die Meldung stehen erst weiter unten (Screenshot 13).

## Vorschläge

- **P-1:** Benutzermenü, «Einstellungen», Karte «Absender und Konto». Hilfreich wäre ein Hinweis, der die fehlenden Felder und den Zweck nennt, zum Beispiel: «Für die QR-Rechnung fehlen noch: Name, Ort.» Statt «Firmenadresse» ein Wort, das auch für Privatvermieter passt (Absender, Name).
- **P-2:** Benutzermenü, «Einstellungen», «Absender und Konto», bis «Konto» scrollen. Hilfreich wäre eine Meldung an jedem fehlenden Feld («Ort fehlt – nötig für die QR-Rechnung») statt nur unter der IBAN. Die IBAN nicht als fehlerhaft markieren, wenn sie selbst korrekt ist. Nur die Felder nennen, die wirklich fehlen. Auf dem Handy oben ein kurzer Satz, was fehlt.
- **P-3:** «Einstellungen» und «Absender und Konto» öffnen und die Untertitel lesen. Hilfreich wäre, «Stammdaten» und «Bezeichnungen» aus den Untertiteln zu streichen oder durch Namen zu ersetzen, die als Gruppe oder Abschnitt auch wirklich vorkommen.

## Nicht geprüft

- Speichern von Firmenname und Ort und ob der Hinweis danach verschwindet: Die Aufgabe war nur Ansehen.
- Ob das Häkchen «Täglich nach neuen Versionen suchen» beim Anklicken sofort speichert: nicht angeklickt, weil das eine globale Einstellung ist.
- Die Seiten hinter KI, Zugangsschlüssel, Protokoll, Kategorien, Verteilschlüssel und Heizprofile: Sie gehören nicht zum Weg der Aufgabe.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/48924d67-1049-5133-b716-46d184d677e3/scratchpad/anna-settings-overview/
