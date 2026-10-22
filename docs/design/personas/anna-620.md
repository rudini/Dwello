# Persona-Review: Anna, Einrichtung mit «Später entscheiden» (KI)

Persona: Anna, 29, vermietet zum ersten Mal. Desktop 1440 × 900, Maus; Einrichtungsseite und Übersicht auch auf dem Handy 390 × 844.
Umgebung: frische Installation auf http://localhost:3300, ohne Konto und ohne Demodaten, abgemeldet gestartet. Einrichtungscode ANNA-2620, E-Mail anna@dwello.test.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-620/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen › KI | Bei der Einrichtung habe ich «Später entscheiden» gewählt, und die Übersicht sagt «Sie haben noch keine KI gewählt». Auf der KI-Seite ist aber «Keine KI» ausgewählt. Für mich klingt das wie ein Entscheid gegen die KI, den ich nie getroffen habe. «Später entscheiden» gibt es dort nicht. |
| P-2 | Minor | Einrichtung | «Lokale KI auf diesem Server» ist schon ausgewählt. Wer unsicher ist und einfach weiterklickt, wählt also die lokale KI. Ob mein Server «rund 16 GB Arbeitsspeicher» hat, weiss ich nicht, und der Hilfetext sagt nicht, was passiert, wenn er weniger hat. |
| P-3 | Nit | Einrichtung | Der Hilfetext zu «Später entscheiden» endet mit «Dort wählen Sie auch eine KI eines Anbieters». Hier wird eine dritte Möglichkeit nur nebenbei erwähnt, ohne zu sagen, was sie bedeutet: dass Rechnungen an den Anbieter gehen. Erst auf der KI-Seite steht das. |
| P-4 | Nit | Datenschutz | Dort steht nur der heutige Stand: «Rechnungen und Kategorien werden nicht von einer KI bearbeitet.» Dass sich das ändert, wenn ich später eine KI wähle, und dass bei der lokalen KI nichts den Server verlässt, steht dort nicht. Ich muss es mir aus der KI-Seite zusammenreimen. |

## Beobachtungen

- Der Dialog «Rechnungen hochladen» (erreichbar über «Häufige Arbeiten» auf der Übersicht) sagt «Die KI liest die Angaben aus; Sie prüfen sie …», obwohl ich keine KI gewählt habe. Die Übersicht sagt dagegen «Bis dahin erfassen Sie Rechnungen von Hand». Das widerspricht sich. Ich habe nichts hochgeladen, darum weiss ich nicht, was beim Hochladen ohne KI passiert. Dieser Bildschirm gehörte nicht zu meiner Aufgabe, darum hat der Punkt keine Schwere.
- Die KI-Seite hat keinen Weg zurück zu «Einstellungen» (keinen Zurück-Link, keinen Pfad). In der Seitenleiste ist «Einstellungen» hervorgehoben, das reicht knapp.
- «API-Schlüssel» bei «KI eines Anbieters» ist für mich ein Fachwort ohne Erklärung.
- In der Seitenleiste gibt es keinen eigenen Eintrag «KI». Der Weg geht über «Einstellungen» und dann die Kachel «KI» im Abschnitt «KI». Den direkten Link im Hinweis auf der Übersicht habe ich aber sofort gefunden.
- Nach dem Einrichten bin ich direkt auf der Übersicht, angemeldet, ohne ausdrückliche Bestätigung wie «Dwello ist eingerichtet». Der Hinweiskasten und «Nächster Schritt: Erstes Gebäude erfassen» zeigen aber klar, dass es geklappt hat.
- Datenschutz: «Der Betreiber dieser Dwello-Installation hat seinen Namen und seine Adresse noch nicht hinterlegt … tragen Sie sie in der Einstellungsdatei ein». Als Anfängerin weiss ich nicht, was die «Einstellungsdatei» ist. Das gehörte nicht zur Aufgabe.
- Einrichtungscode: Der Hilfetext verlangt den Befehl `docker logs dwello-backend`. Den Code hatte ich schon, darum habe ich es nicht geprüft.
- Handy 390 px: Einrichtungsseite, Übersicht und KI-Seite lassen sich nicht seitwärts scrollen (scrollWidth 390). Die Auswahlkarten und der Hinweiskasten sind gut lesbar.
- Cookies nach dem Einrichten: `dwello_session` (HttpOnly), `dwello_xsrf`, `PARAGLIDE_LOCALE`. Das passt zum Text im Datenschutz.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, 9 Schritte: Startseite öffnen, Felder ausfüllen, «Später entscheiden», «Dwello einrichten», Übersicht lesen, Link «Wählen Sie die KI …» (1 Klick bis zur KI-Seite), zweiter Weg über «Einstellungen» › «KI» (2 Klicks), «Datenschutz», Handy-Ansichten.

## Ablauf

1. **http://localhost:3300 öffnen.** Erwartet: eine Anmeldung oder eine Begrüssung. Gesehen: Weiterleitung auf /setup, «Dwello einrichten» mit einem klaren Satz, was passiert («Legen Sie das Konto mit Passwort an … Danach sind Sie angemeldet»). Gut.
2. **Felder ausfüllen.** Erwartet: Code, E-Mail, Passwort. Gesehen: genau das, mit Hilfetexten über den Feldern. Die Passwortregel (mindestens 8 Zeichen) steht vor dem Tippen da.
3. **Frage «Welche KI soll Rechnungen lesen?».** Erwartet: eine Erklärung, wozu die KI dient. Gesehen: zwei Karten. «Lokale KI auf diesem Server» ist vorausgewählt und hat einen Hilfetext zu Datenschutz und Arbeitsspeicher. «Später entscheiden» hat den Hilfetext «Bis Sie unter «Einstellungen» › «KI» eine KI wählen, erfassen Sie Rechnungen von Hand». Was «Später entscheiden» für mich bedeutet (alles von Hand) und wo ich es später ändere, verstehe ich. Bei der vorausgewählten lokalen KI bin ich unsicher (P-2), und die nebenbei erwähnte «KI eines Anbieters» irritiert mich (P-3).
4. **«Später entscheiden» wählen, «Dwello einrichten».** Erwartet: Bestätigung, dann die Startseite. Gesehen: direkt die Übersicht, angemeldet als anna@dwello.test.
5. **Übersicht lesen.** Erwartet: ein Hinweis, dass noch keine KI gewählt ist. Gesehen: ein blauer Hinweiskasten ganz oben: «Sie haben noch keine KI gewählt. Bis dahin erfassen Sie Rechnungen von Hand. Wählen Sie die KI unter «Einstellungen» › «KI».» (der letzte Satz ist ein Link). Er sagt klar, was passiert ist und was ich tun kann. Darunter folgt «Nächster Schritt: Erstes Gebäude erfassen».
6. **Dem Link folgen.** Erwartet: die Seite zur Wahl der KI. Gesehen: /config/ki, «KI», drei Karten (Lokale KI, KI eines Anbieters, Keine KI), «Keine KI» ausgewählt, Knopf «KI speichern». Nichts gespeichert. Dass «Keine KI» statt «noch nicht entschieden» ausgewählt ist, verwirrt mich (P-1).
7. **Zweiter Weg über die Seitenleiste.** Erwartet: unter «Einstellungen» etwas zur KI. Gesehen: Auf der Einstellungsseite steht nach «Stammdaten» ein Abschnitt «KI» mit der Kachel «KI – Lokale KI, KI eines Anbieters oder keine KI». Ein Klick führt auf dieselbe Seite. Gut zu finden.
8. **«Datenschutz» in der Fusszeile.** Erwartet: was mit Rechnungen und KI passiert. Gesehen: unter «Weitergabe an Dritte» «Rechnungen und Kategorien werden nicht von einer KI bearbeitet.» Unter «Protokoll» steht, dass jeder Wechsel der KI mit Anbieter und Land festgehalten wird. Abgemeldet zeigt die Seite denselben Text. Was eine spätere Wahl ändern würde, steht dort nicht (P-4).
9. **Handy 390 × 844.** Einrichtungsseite: alles untereinander, Karten gut lesbar, kein seitliches Scrollen. Übersicht: Der Hinweiskasten steht ganz oben, der Link ist auf zwei Zeilen umbrochen, aber gut antippbar. Die KI-Seite ist ebenso in Ordnung.

## Verwirrung

- «Später entscheiden» bei der Einrichtung, «Sie haben noch keine KI gewählt» auf der Übersicht und «Keine KI» auf der KI-Seite: drei Worte für denselben Zustand (P-1).
- «KI eines Anbieters»: welcher Anbieter? Erst auf der KI-Seite erfahre ich, dass meine Rechnungen dorthin gehen, mit Namen und Adressen.
- «16 GB Arbeitsspeicher», «KI-Modell, rund 6 GB»: Ich weiss nicht, ob mein Server das kann.
- «API-Schlüssel», «Einstellungsdatei»: Fachwörter ohne Erklärung.

## Fehlerrisiken

- Wer unsicher ist und nichts anklickt, richtet Dwello mit der lokalen KI ein, auch auf einem zu kleinen Server (P-2).
- Wer auf der KI-Seite «Keine KI» sieht, denkt vielleicht, er habe bewusst abgelehnt, und kommt nicht mehr darauf zurück (P-1).
- Wer über «Rechnungen hochladen» geht, liest «Die KI liest die Angaben aus» und erwartet eine KI, die es nicht gibt (siehe Beobachtungen).

## Vorschläge

- **P-1:** Einrichten mit «Später entscheiden», auf der Übersicht dem Link «Wählen Sie die KI unter «Einstellungen» › «KI».» folgen: «Keine KI» ist ausgewählt. Hilfreich wäre, solange nichts gewählt ist, keine Karte auszuwählen und darüber den Satz «Sie haben noch keine KI gewählt» zu zeigen. Oder die Karte nennt denselben Zustand mit denselben Worten wie die Übersicht («Noch keine KI: Sie erfassen Rechnungen von Hand»).
- **P-2:** /setup frisch öffnen: «Lokale KI auf diesem Server» ist vorausgewählt. Hilfreich wäre, keine Vorauswahl zu treffen (Pflichtwahl). Oder ein Satz, was bei zu wenig Arbeitsspeicher passiert und wie man nachsieht, wie viel Arbeitsspeicher der Server hat.
- **P-3:** /setup, Hilfetext von «Später entscheiden» lesen. Hilfreich wäre ein kurzer Zusatz, etwa «… auch eine KI eines Anbieters; dann gehen Rechnungen an diesen Anbieter». Oder den Satz weglassen und nur auf «Einstellungen» › «KI» verweisen.
- **P-4:** Fusszeile «Datenschutz», Abschnitt «Weitergabe an Dritte». Hilfreich wäre ein Satz wie «Wählen Sie unter «Einstellungen» › «KI» eine KI eines Anbieters, steht hier, welche Daten an ihn gehen; eine lokale KI gibt nichts weiter.»

## Nicht geprüft

- Speichern auf der KI-Seite: Die Aufgabe verlangte, dort nichts zu speichern.
- Ob «Lokale KI» bei der Einrichtung wirklich ein Modell herunterlädt und wie sich ein zu kleiner Server verhält: Ich habe «Später entscheiden» gewählt, und das KI-Modell lässt sich in dieser Umgebung nicht laden.
- Hochladen von Rechnungen ohne KI: Es gibt kein Gebäude, und die Aufgabe verlangte kein Speichern ausser der Einrichtung.
- Fehlerfälle der Einrichtung (falscher Code, kurzes Passwort): nicht Teil der Aufgabe, und die Installation ist nach dem Einrichten nicht wiederholbar.
- Dunkler Modus und andere Sprachen.
