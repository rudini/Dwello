# Dr. Weber – Issue #450: PDF ohne Ort der Firmenadresse

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Persona-Stack auf http://localhost:3300, Demo-Daten.
Ausgangslage (vom Auftraggeber vorbereitet): In den Einstellungen sind Firmenname «Muster Immobilien AG», Strasse «Bahnhofstrasse 1», PLZ «8001» und eine IBAN hinterlegt, der Ort fehlt. Ich habe nichts gespeichert, nichts versendet und nichts als bezahlt markiert.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF Rückerstattung (Anna Schmidt), Kopfzeile und Hinweis zur Belegeinsicht | Die Adresse des Liegenschaftsverwalters endet mit der blossen PLZ: Kopfzeile «Muster Immobilien AG · Bahnhofstrasse 1 · 8001», Hinweis «Melden Sie sich dafür bei Muster Immobilien AG, Bahnhofstrasse 1, 8001 (Art. 257b Abs. 2 OR).» Kein leeres Trennzeichen, aber eine unvollständige Adresse in einem Dokument mit rechtlicher Wirkung. |
| P-2 | Minor | Ablehnung «PDF herunterladen» (Maria Rossi, Nachzahlung) | Die Ablehnung nennt nicht genau, was fehlt: «Ergänzen Sie Name, PLZ und Ort» – Name und PLZ sind vorhanden, nur der Ort fehlt. Die Seite verlinkt nur «Zu den Nebenkostenabrechnungen», nicht «Einstellungen», wo ich etwas tun muss. |

## Beobachtungen

- Kein PDF nennt «Dwello Property Management» oder «8000 Zürich». Als Absender erscheint überall der hinterlegte Firmenname «Muster Immobilien AG» – das bin ich als Liegenschaftsverwalter. Das ist richtig.
- Die Ablehnung ist eine nackte Seite ohne Navigation der App (HTTP 400, Titel «Nebenkostenabrechnungen - Dwello»). Sie öffnet im selben Tab, die Abrechnung verschwindet. Ich komme nur mit «Zurück» im Browser oder über den Link zur Liste zurück.
- Vorher warnt mich nichts: Die Seite der Abrechnung, die Übersicht und die Einstellungen zeigen keinen Hinweis, dass der Ort fehlt oder dass das PDF so nicht erstellt werden kann. In den Einstellungen steht unter IBAN nur allgemein: «Mit einer IBAN braucht es Firmenname, PLZ und Ort.» Das leere Feld «Ort» ist nicht markiert.
- Im Verlauf der Abrechnung Rossi steht «PDF erstellt 19.10.2026, 22:27», obwohl der Download abgelehnt wird. Das ist widersprüchlich.
- «Als versendet markieren» kann ich bei Rossi weiterhin klicken, obwohl es kein PDF gibt. Ich habe es nicht ausprobiert.
- Das PDF der Rückerstattung zeigt auf Seite 1 links nur den Block «Gebäude», rechts die Mieterin. Einen eigenen Absenderblock gibt es nicht, der Absender steht nur in der Kopfzeile.
- Der Link «PDF» in der Liste (`/api/statements/…/pdf`) führt bei Rossi zur gleichen Ablehnung wie der Knopf «PDF herunterladen» auf der Detailseite (`/statements/…/pdf`).
- Abgesehen von P-1 sind Kopfzeile und Hinweis vollständig: kein «· ·», kein Komma am Ende, keine leere Klammer.

## Aufgabe geschafft: ja

Das PDF Rossi wird abgelehnt (so gewollt), das PDF Schmidt habe ich heruntergeladen und gelesen. Alle drei Fragen kann ich beantworten.

## Aufwand

Etwa 10 Minuten, 8 Schritte (Liste, Detail Rossi, PDF Rossi, PDF Rossi aus der Liste, Detail Schmidt, PDF Schmidt, PDF lesen, Einstellungen nur ansehen).

## Ablauf

1. **Nebenkostenabrechnungen öffnen.** Erwartet: Liste mit den Entwürfen 2025. Gesehen: 17 Abrechnungen, Maria Rossi (NK-11111111-2025-0004, Nachzahlung CHF 238.10, Entwurf) und Anna Schmidt (NK-11111111-2025-0002, Rückerstattung CHF 6.50, Entwurf). Kein Hinweis auf fehlende Absenderdaten.
2. **Entwurf Rossi öffnen.** Erwartet: ein Hinweis, falls das PDF nicht erstellt werden kann. Gesehen: vollständige Kostenaufstellung, Knopf «PDF herunterladen», kein Hinweis. Im Verlauf steht «PDF erstellt».
3. **«PDF herunterladen» klicken.** Erwartet: entweder das PDF oder eine klare Ablehnung. Gesehen: Es kommt kein Download. Der Tab wechselt auf eine weisse Seite ohne App-Rahmen: «Für den Zahlteil fehlt die Firmenadresse. Ergänzen Sie Name, PLZ und Ort unter «Einstellungen».» Darunter steht der Link «Zu den Nebenkostenabrechnungen» (Screenshot `rossi-after.png`). Ich verstehe: Der Zahlteil (QR-Rechnung) braucht meine Adresse, und ich muss in die Einstellungen. Welches Feld fehlt, muss ich dort selbst suchen.
4. **Dasselbe über «PDF» in der Liste.** Gesehen: die gleiche Ablehnung (Screenshot `04-liste-pdf-rossi.png`).
5. **Einstellungen nur ansehen.** Gesehen: Firmenname «Muster Immobilien AG», Strasse «Bahnhofstrasse 1», PLZ «8001», Ort leer, IBAN gesetzt. Das leere Feld Ort ist nicht hervorgehoben. Ich habe nichts gespeichert.
6. **Entwurf Schmidt öffnen und «PDF herunterladen».** Erwartet: Bei einer Rückerstattung gibt es keinen Zahlteil, also ein PDF. Gesehen: Download «NK-11111111-2025-0002.pdf», 2 Seiten A4.
7. **PDF lesen.**
   - Kopfzeile auf beiden Seiten: «Muster Immobilien AG · Bahnhofstrasse 1 · 8001» rechts daneben «NK-11111111-2025-0002 · Seite 1 von 2». Kein leeres Glied, aber der Ort fehlt (P-1).
   - Die Rückerstattung CHF 6.50 ist im Kasten klar: «Wir überweisen Ihnen den Betrag bis 18.11.2026. Teilen Sie uns dafür Ihre IBAN mit …». Es gibt keinen Zahlteil, das ist richtig.
   - Hinweis zur Belegeinsicht: «Sie oder eine bevollmächtigte Person können die Belege einsehen. Melden Sie sich dafür bei Muster Immobilien AG, Bahnhofstrasse 1, 8001 (Art. 257b Abs. 2 OR).» Der Hinweis ist vollständig formuliert, nur ohne Ort (P-1).
   - «Dwello Property Management» oder «8000 Zürich» kommt nirgends vor.

## Verwirrung

- «Firmenadresse» und «Zahlteil»: Ich bin Privatvermieter und keine Firma. In den Einstellungen heisst der Abschnitt «Absender», das Feld «Firmenname». Die Ablehnung sagt «Firmenadresse». Gemeint ist offenbar dasselbe, aber drei Wörter für eine Sache verunsichern.
- «Zahlteil» kommt in der Ablehnung vor, in den Einstellungen heisst es «QR-Rechnung». Ich vermute, das ist dasselbe.
- «Name, PLZ und Ort» klingt, als fehle alles. Ich prüfe dann drei Felder statt eines.

## Fehlerrisiken

- Ein Vermieter klickt bei Rossi «Als versendet markieren», ohne dass ein PDF existiert. Die Abrechnung gilt dann als versendet, obwohl der Mieterin nichts zugestellt werden konnte.
- Die Rückerstattungs-PDFs gehen mit einer Adresse ohne Ort hinaus. Ein Mieter, der die Belege einsehen will, bekommt eine unvollständige Adresse.
- Die Ablehnung ersetzt die Seite im selben Tab. Wer das nicht merkt, glaubt vielleicht an einen Absturz der App.
- Der Verlaufseintrag «PDF erstellt» täuscht vor, es gebe ein PDF.

## Vorschläge

- **P-1** – Nachstellen: Ort in den Einstellungen leer, IBAN gesetzt. /statements/f44b29f5-d31b-4fe6-a4e8-ad35f36ba848 öffnen, «PDF herunterladen», Kopfzeile und Abschnitt «Hinweise» lesen. Hilfreich wäre eines davon: das PDF auch ohne Zahlteil erst mit vollständiger Adresse erstellen, also wie bei der Nachzahlung ablehnen; oder bei fehlendem Ort die PLZ weglassen und nur Name und Strasse drucken. Beim Hinweis zur Belegeinsicht wäre die erste Lösung die sicherere.
- **P-2** – Nachstellen: gleiche Ausgangslage, /statements/15ab0cba-eae8-47bc-9a79-efd53b5061ac öffnen, «PDF herunterladen» klicken. Hilfreich: genau das fehlende Feld nennen («Es fehlt der Ort Ihrer Adresse»), einen Link «Zu den Einstellungen» anbieten und die Begriffe angleichen («Absender» statt «Firmenadresse»). Dazu im Feld «Ort» der Einstellungen einen Hinweis zeigen, solange es mit IBAN leer ist.

## Nicht geprüft

- Den Fall mit ergänztem Ort und das PDF Rossi mit QR-Rechnung habe ich nicht geprüft, weil ich in den Einstellungen nichts speichern sollte.
- «Als versendet markieren» und «Als bezahlt markieren» habe ich nicht geprüft, weil der Auftrag es verbot.
- Die anderen Entwürfe mit Nachzahlung (Pierre Dubois, Seepark Residenz) habe ich nicht geöffnet, weil sie nicht zum Auftrag gehören.
- Die Beträge im PDF habe ich nur überflogen, nicht nachgerechnet. Das ist Sache von `daten-pruefer`.
- Andere Sprachen und Mobilansicht habe ich nicht geprüft, weil sie nicht zum Auftrag gehören.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-450/` (`rossi-after.png` Ablehnung, `04-liste-pdf-rossi.png`, `schmidt.pdf`, `schmidt-p-1.png`, `schmidt-p-2.png`, `03-einstellungen.png`).
