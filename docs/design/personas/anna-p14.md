# Anna, Runde p14: Sprache aus dem Browser (fr-CH, es-ES)

Persona: Anna, 29, vermietet zum ersten Mal und kommt nach Monaten zurück. Desktop 1440 × 900, Maus. Ich habe nur geschaut, nichts gespeichert. Die Sprachwahl in Schritt 3 gehört zur Aufgabe.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/74573eec-a8c7-5a4e-9962-dac8343cddae/scratchpad/anna-p14/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Nit | Anmelden (es-ES) | Ein Browser auf Spanisch, der sonst keine Sprache nennt, bekommt Deutsch. Für eine Schweizer App ist das vertretbar. Eine Spanierin würde aber eher Englisch erwarten. Nennt der Browser Englisch als zweite Sprache, kommt Englisch: Das ist gut. |
| P-2 | Nit | alle (erster Besuch) | Beim ersten Besuch merkt sich Dwello die erkannte Sprache für ein Jahr im Cookie `PARAGLIDE_LOCALE`, auch wenn ich nie eine Sprache gewählt habe. Stelle ich später die Sprache des Computers um, bleibt Dwello bei der alten. |

## Beobachtungen

- Die erste Seite auf Französisch ist ganz französisch: `<html lang="fr">`, Titel «Se connecter», Fusszeile und Link zur Hilfe auch. Ich habe kein deutsches Wort gefunden.
- Die Sprachwahl oben rechts zeigt ein Sprach-Symbol und «Français». Für den Screenreader heisst sie «Langue : Français». Geöffnet zeigt sie jede Sprache in ihrer eigenen Schreibweise (Deutsch, Français, Italiano, English). Die gewählte Sprache ist fett und hat ein Häkchen, die Farbe allein trägt die Information also nicht.
- Auf der französischen Übersicht stehen Mengen mit Bezeichnungen in der Einzahl: «9 Loué», «4 Vacant», «0 Bloqué», «7 Brouillon», «9 Payé». Richtig wäre «9 loués» usw. Das hat mit der Spracherkennung nichts zu tun.
- Der Sprachwechsel macht keinen Aufruf an den Server, der etwas speichert (kein POST). Er setzt das Cookie und lädt die Seite neu. Im README steht dagegen, die Sprache werde am Konto gespeichert. Mit dem Session-Cookie allein (ohne das Sprach-Cookie) kam ich nach dem Wechsel auf Deutsch wieder auf Französisch, also nach dem Browser. Am Konto war Deutsch also nicht gespeichert.
- Nennt der Browser `es-ES, fr-CH, de`, wählt der Server Französisch. Bei `es-ES, en` wählt er Englisch: Dwello nimmt also die erste Sprache, die es kann.
- Ein abgemeldeter französischer Browser, der nur das Cookie `PARAGLIDE_LOCALE=de` hat, zeigt die Anmeldung auf Deutsch. Das ist konsequent.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 7 kleine Skripte. Als Nutzerin: Anmeldeseite ansehen, Sprachwahl öffnen, anmelden, Übersicht lesen, auf Deutsch umstellen, neu laden, neuen Browser öffnen, Browser auf Spanisch öffnen: rund 8 Schritte.

## Ablauf

1. **Anmeldeseite, frischer Browser auf fr-CH, ohne Cookies** (`/` leitet weiter auf `/login?redirectTo=%2F`).
   Erwartet: Französisch, weil mein Computer Französisch ist.
   Gesehen: Alles auf Französisch («Se connecter», «Se connecter avec Google», «Conditions d’utilisation»), dazu oben rechts «Français» mit Sprach-Symbol (Screenshot 01). Klickt man darauf, öffnet sich eine Liste mit vier Sprachen, Français hat ein Häkchen (Screenshot 02). Wie man die Sprache ändert, war mir sofort klar. Das Cookie `PARAGLIDE_LOCALE=fr` war danach schon gesetzt.
2. **Angemeldet (Session aus dem Persona-Kit in einem fr-CH-Browser), Übersicht.**
   Erwartet: weiter Französisch, und die Übersicht sagt mir, was ich tun soll.
   Gesehen: `/dashboard` auf Französisch, «Vue d’ensemble» (Screenshot 03). Die Karte «Prochaine étape – Établir les décomptes des charges» nennt die abgelaufene Periode 01.01.2025 – 31.12.2025 und das Gebäude Alpenblick ohne Abrechnung. Sie sagt, ich soll zuerst alle Rechnungen erfassen, und hat einen Hauptknopf «Établir les décomptes». Darunter steht «Vérifier et envoyer les décomptes» (7 Entwürfe). Was als Nächstes kommt, war klar: erst die Rechnungen 2025 prüfen, dann die Abrechnungen erstellen.
3. **Auf Deutsch umstellen, neu laden, neuer Browser (fr-CH) mit den behaltenen Cookies.**
   Erwartet: Nach dem Wechsel Deutsch, und auch im neuen Browser Deutsch, weil ich Deutsch ausdrücklich gewählt habe. Das soll vor der Sprache des Browsers gelten.
   Gesehen: Nach dem Klick auf «Deutsch» steht sofort «Übersicht» da (Screenshot 04), nach dem Neuladen auch (Screenshot 05). Das Cookie `PARAGLIDE_LOCALE=de` gilt ein Jahr. Der neue französische Browser mit denselben Cookies zeigt die Übersicht auf Deutsch, oben rechts steht «Deutsch» (Screenshot 06). So habe ich es erwartet.
4. **Frischer Browser auf es-ES.**
   Erwartet: Spanisch gibt es nicht. Ich hätte Deutsch oder Englisch erwartet.
   Gesehen: Anmeldung auf Deutsch («Anmelden», «Sprache: Deutsch») (Screenshot 08), das Cookie `PARAGLIDE_LOCALE=de` ist gesetzt. Für mich als Schweizerin passt das. Eine Spanierin würde wohl eher Englisch erwarten (P-1). Wer im Browser Englisch als zweite Sprache hat, bekommt Englisch. Das habe ich mit `curl` geprüft.

## Verwirrung

- Keine. Die Sprachwahl ist beschriftet und zeigt die Sprachnamen in der eigenen Sprache.
- Nur die französischen Zahlen mit Einzahl-Wörtern («9 Loué») lesen sich holprig (siehe Beobachtungen).

## Fehlerrisiken

- P-2: Wer einmal mit einem Computer auf einer anderen Sprache vorbeikommt, zum Beispiel einem geliehenen Laptop, und später den eigenen Browser umstellt, bleibt ein Jahr bei der zuerst erkannten Sprache. Er muss sie selbst ändern. Die Sprachwahl ist aber gut sichtbar, das Risiko ist also klein.

## Vorschläge

- **P-1** Schritte: neuer Browser mit Sprache `es-ES`, `http://localhost:3300/` öffnen. Die Anmeldung ist auf Deutsch. Hilfreich wäre: Englisch als Ausweichsprache, wenn der Browser keine der vier Sprachen nennt. Oder Deutsch lassen, wenn das bewusst so entschieden ist, weil die App für die Schweiz gemacht ist. Dann ist der Befund hinfällig.
- **P-2** Schritte: neuer Browser auf fr-CH, `/login` öffnen. Das Cookie `PARAGLIDE_LOCALE=fr` gilt ein Jahr. Danach den Browser auf de-CH umstellen und dasselbe Cookie behalten: Dwello bleibt auf Französisch. Hilfreich wäre: das Cookie erst bei einer bewussten Wahl im Umschalter setzen und sonst bei jedem Besuch nach dem Browser gehen.

## Nicht geprüft

- Mobile 390 × 844: Die Aufgabe nannte den Desktop.
- Ob ein echter Browser auf es-ES mit Englisch als zweiter Sprache auch nach dem Laden der Seite Englisch zeigt. Playwright schickt pro Browser nur eine Sprache. Als ich die Kopfzeile von Hand geändert habe, lieferte der Server Englisch («Sign in», `lang="en"`). Die Seite im Browser schaltete danach aber auf deutsche Texte, `lang` blieb auf «en». Wahrscheinlich liegt das daran, dass `navigator.languages` des Browsers in diesem Versuch nur `es-ES` meldete und nicht zur Kopfzeile passte. Bei einem echten Browser passt beides zusammen. Ich zähle das deshalb nicht als Befund.
- Ob das Schliessen eines echten Browsers die Session-Cookies löscht: Wie verlangt habe ich die Cookies aus Schritt 3 von Hand in den neuen Browser übernommen.
- Die echte Google-Anmeldung: Die Session kam aus dem Persona-Kit.
