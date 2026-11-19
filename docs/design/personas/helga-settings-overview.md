# Helga – Einstellungen: Übersicht und fehlende Angaben

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus.
Aufgabe: Über das Benutzermenü «Einstellungen» öffnen, herausfinden, ob etwas fehlt, es ergänzen und speichern, zurück zu «Einstellungen» und prüfen, ob die Meldung weg ist; dann die Zahlungsfrist auf 45 Tage setzen und wieder speichern.
Ausgangslage (vom Aufrufer per SQL gesetzt): IBAN gespeichert, Firmenname und Ort fehlen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen (150 %) | Die Kacheln stehen in drei schmalen Spalten. Wörter werden mitten im Wort getrennt («Bezeichnung / en», «Abrechnung / en», «Verteilschlüs / sel», «Zugangsschl / üssel», «Anmeldunge / n»), und die rote Meldung «Es fehlen Angaben zur Firmenadresse.» ragt rechts über den Rand der Kachel hinaus. Ich musste mehrmals lesen, bis ich verstand, was dort steht. |
| P-2 | Minor | Einstellungen, Kachel «Absender und Konto» | Die Meldung sagt «Es fehlen Angaben zur Firmenadresse.», aber nicht, welche fehlen (bei mir Name und Ort) und auch nicht, wozu sie fehlen (für den Einzahlungsschein). Ich habe keine Firma, ich bin eine Privatperson. Erst auf der Unterseite, unter der IBAN, stand «Erfassen Sie Name, PLZ und Ort». |
| P-3 | Minor | Einstellungen, Kachel «Absender und Konto» | In der Beschreibung steht «Absender, Konto, Fristen, **Bezeichnungen** und Vorschläge». Auf der Seite dahinter finde ich keine Gruppe, die «Bezeichnungen» heisst (es gibt Absender, Konto, Verwaltungspauschale, Fristen, Vorschläge). Ich habe deshalb gesucht, was gemeint ist, und die Verwaltungspauschale steht dafür nicht in der Beschreibung. |

## Beobachtungen

- Der Weg über das Benutzermenü war leicht: Klick auf meinen Namen oben rechts, dann «Einstellungen». Bei 200 % ist es nur noch ein Personen-Symbol ohne Namen; das habe ich trotzdem gefunden.
- Die drei Gruppen «Ihre Angaben», «Abrechnung», «Daten und Sicherheit» verstehe ich. Bei 200 % stehen die Kacheln untereinander, das liest sich viel besser als bei 150 %.
- «Absender und Konto» hat dasselbe Zahnrad-Symbol wie «Zugangsschlüssel für KI-Programme». Das sieht aus, als wäre es dasselbe.
- «Updates» und «Alle Daten exportieren» stehen ohne eigene Kachel unten im Kasten «Daten und Sicherheit»; sie sehen anders aus als die Kacheln darüber.
- «Täglich nach neuen Versionen suchen»: Was es tut, verstehe ich dank des Textes (Dwello fragt bei GitHub nach, ob es eine neue Version gibt). Wann eine Änderung gespeichert würde, verstehe ich nicht: Es gibt keinen Knopf «Speichern» daneben. Ich habe das Häkchen nicht angefasst.
- Auf der Seite «Absender und Konto» waren die Felder Firmenname und Ort rot umrandet, aber der Hinweis stand erst weiter unten unter der IBAN. Bei Firmenname steht als Beispiel «Muster Immobilien AG»; ob ich als Privatperson einfach meinen Namen eintragen darf, steht nicht da. Ich habe es getan («Helga Brunner», Ort «Zürich»), und es wurde angenommen.
- Die Hilfetexte auf «Absender und Konto» sind sehr lang (Verwaltungspauschale, Kontoinhaber). Bei 150 % muss ich viel scrollen, bis der Knopf «Einstellungen speichern» kommt.
- Nach dem Speichern erschien direkt über dem Knopf eine grüne Meldung «Einstellungen gespeichert – Absender, Konto mit Kontoinhaber, Verwaltungspauschale, Fristen und Vorschläge gespeichert.» Gut sichtbar. Sie zählt aber alles auf, auch das, was ich nicht geändert habe.
- Zurück kam ich über den Link «Einstellungen» ganz oben («Einstellungen > Absender und Konto»). Dafür musste ich von der grünen Meldung ganz nach oben scrollen; unten gibt es keinen Weg zurück.
- Bei 150 % zeigt die linke Leiste nur bis «Dokumente»; «Einstellungen und Hilfe» kommt erst, wenn man in der Leiste selbst scrollt. Gebraucht habe ich das nicht.
- In der Fusszeile steht «Version unbekannt».
- Kein seitliches Scrollen bei 200 %.

## Aufgabe geschafft: ja

- Fehlende Angaben gefunden, Name und Ort eingetragen, gespeichert.
- Zurück auf «Einstellungen» war die rote Meldung verschwunden.
- Zahlungsfrist auf 45 gesetzt, gespeichert; nach dem Neuladen stand 45 da, Name und Ort waren noch da.

## Aufwand

Etwa 10 Minuten, rund 14 Schritte (Menü, Einstellungen, Kachel, 2 Felder, Speichern, zurück, Kachel, Frist, Speichern, Neuladen; dasselbe bei 200 % ohne Änderung nochmals gespeichert).

## Ablauf

- Einstellungen bei 150 %: Erwartet: eine gut lesbare Liste. Gesehen: schmale Kacheln mit getrennten Wörtern, rote Meldung ragt aus der Kachel (P-1).
- Meldung «Es fehlen Angaben zur Firmenadresse.»: Erwartet: welche Angaben fehlen. Gesehen: nur «Firmenadresse», ohne Felder; ich habe keine Firma (P-2).
- Kachelbeschreibung: Erwartet: auf der Seite eine Gruppe «Bezeichnungen». Gesehen: keine (P-3).
- Nach dem Speichern: Erwartet: ein Weg zurück zu den Einstellungen bei der Meldung. Gesehen: nur der Link ganz oben (Beobachtung).

## Vorschläge

- **P-1:** 1440 × 900 bei 150 % öffnen, Benutzermenü > Einstellungen. Die Kacheln stehen in drei Spalten von etwa 110 px Textbreite; die Meldung ragt über den Rand (Screenshot 03-config.png, Ausschnitt 03-crop.png). Hilfreich: bei dieser Breite zwei Spalten oder eine, so wie bei 200 %; keine Trennung mitten im Wort; die Meldung innerhalb der Kachel umbrechen.
- **P-2:** Mit gespeicherter IBAN und ohne Firmenname und Ort die Einstellungen öffnen. Hilfreich: sagen, was fehlt und wozu, z. B. «Für den Einzahlungsschein fehlen noch Ihr Name und Ihr Ort.»; ein Wort statt «Firmenadresse», das auch für Privatpersonen passt, oder ein Hinweis beim Feld «Firmenname», dass auch der eigene Name geht.
- **P-3:** Einstellungen öffnen, Beschreibung der Kachel «Absender und Konto» lesen, dann die Seite öffnen. Hilfreich: die Beschreibung nennt genau die Gruppen der Seite (Absender, Konto, Verwaltungspauschale, Fristen, Vorschläge).

## Nicht geprüft

- Die rote Meldung auf «Einstellungen» bei 200 %: Ich hatte die Angaben bei 150 % schon ergänzt, und ohne Speichern eines ungültigen Zustands kommt sie nicht zurück. Bei 200 % sah ich die Seite nur ohne Meldung.
- «Alle Daten exportieren» und «Täglich nach neuen Versionen suchen» nicht benutzt (Auftrag).
- Dunkelmodus und andere Sprachen nicht angesehen.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/48924d67-1049-5133-b716-46d184d677e3/scratchpad/helga-settings-overview/
