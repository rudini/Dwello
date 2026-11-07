# Dr. Weber – Prüfung #690 (Warnungen zur fehlenden Adresse des Zahlungsempfängers)

Desktop 1440 × 900, Maus, Persona-App auf :3300 (Branch w-690). Ich habe keine Einstellungen gespeichert: Der Auftrag nennt mir kein Gebäude, und die Einstellungen gelten für die ganze App, die Helga gleichzeitig benutzt. Ich habe die Einstellungen über rund 25 Minuten wiederholt gelesen (15:48 bis 16:03 Uhr und davor). Sie blieben immer vollständig: Firmenname «Muster Immobilien AG», Bahnhofstrasse 1, 8001 Zürich, IBAN CH44 3199 9123 0008 8901 2, «Kontoinhaber ist der Absender» angehakt. Die Warnungen, um die es in #690 geht, erscheinen nur, wenn eine Adresse fehlt. Diesen Zustand habe ich deshalb nie gesehen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde zu den Änderungen. Was die Änderungen zeigen, braucht unvollständige Einstellungen; diese habe ich nicht angetroffen und durfte sie nicht selbst speichern (siehe «Nicht geprüft»). |

## Beobachtungen

- **Keine falschen Warnungen bei vollständigen Einstellungen.** Ich habe diese Detailseiten geöffnet: offene, überfällige Nachzahlung (Hans Müller, NK-11111111-2025-0001), Rückerstattung im Entwurf (Thomas Weber, NK-22222222-2025-0001), bezahlte Rückerstattung (Laura Keller, NK-33333333-2024-0001), bezahlte Nachzahlung (Marco Bernasconi, NK-22222222-2024-0003) und Nachzahlung im Entwurf (Marco Bernasconi, NK-22222222-2025-0004). Keine dieser Seiten zeigt einen Hinweis auf eine fehlende Adresse oder einen Link «Zu den Einstellungen». Das stimmt mit den Einstellungen überein.
- **Welche PDFs einen Zahlteil haben.** Das ist die Grundlage dafür, dass eine Warnung stimmen kann:
  - Offene Nachzahlung (Hans Müller): Seite 3 trägt «Empfangsschein» und «Zahlteil», unter «Konto / Zahlbar an» stehen IBAN, «Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich». Das sind die Angaben aus «Absender», wie es der Hilfetext zu «Kontoinhaber ist der Absender» verspricht.
  - Bezahlte Nachzahlung (Marco Bernasconi 2024, italienisches PDF): Sie trägt den Zahlteil ebenfalls («Ricevuta» / «Sezione pagamento», CHF 26.20). Bei einer bezahlten Nachzahlung müsste die Warnung also ebenfalls erscheinen, wenn die Adresse fehlt.
  - Rückerstattungen (Thomas Weber, Laura Keller): Sie haben keinen Zahlteil. Das PDF sagt «Wir überweisen Ihnen den Betrag bis …» und bittet um die IBAN des Mieters. Bei einer Rückerstattung dürfte die Warnung also nicht erscheinen.
- **Begriffe:** «Absender» (Kopf und Gruss) und «Kontoinhaber» («Konto / Zahlbar an» auf der QR-Rechnung) werden in den Hilfetexten sauber getrennt, und das PDF hält sich daran. Das PDF schreibt «Zahlteil» und «Empfangsschein», die Einstellungen sprechen nur von «QR-Rechnung». Das Wort «Zahlteil» kommt in den Einstellungen nicht vor. Falls die neue Warnung «Zahlteil» sagt, findet man das Wort in den Einstellungen nicht wieder.
- **Was nicht zusammenpasst:** Unter «IBAN» heisst es ohne Einschränkung «Mit einer IBAN braucht es Firmenname, PLZ und Ort». Der Text zum Kontoinhaber sagt, ohne Häkchen brauche es «Name, PLZ und Ort des Kontoinhabers». Ob mit einem eigenen, vollständigen Kontoinhaber auch Firmenname, PLZ und Ort des Absenders noch nötig sind, lässt sich so nicht entscheiden. Laut #690 genügt dann der Kontoinhaber für den Zahlteil.
- Die Strasse wird nirgends verlangt, steht aber im Zahlteil. Was ohne Strasse gedruckt wird, sagt kein Hilfetext.
- **Speichern bei leerer PLZ** (die Anfrage habe ich abgefangen, nichts wurde gespeichert): Nach dem Leeren von «PLZ» bei gesetzter IBAN schickt die Seite das Formular ohne Markierung oder Hinweis ab. Die Prüfung geschieht also erst auf dem Server. Seine Antwort habe ich nicht gesehen.
- **Speichern bei Serverfehler** (simuliert, Antwort 500):
  - Mit leerer Antwort ersetzt eine Fehlerseite die ganze Seite mit dem Text «Unexpected end of JSON input / Versuchen Sie es später erneut.». Das ist eine englische Programmmeldung (Bildschirmfoto `05-save-500.png`).
  - Mit einer üblichen Fehlerantwort lautet der Text «Ein unerwarteter Fehler ist aufgetreten. Versuchen Sie es später erneut.» (`05b-save-500json.png`).
  - In beiden Fällen sind die Eingaben weg, und die Seite sagt nicht, ob gespeichert wurde. Das ist keine fachliche Ablehnung im Sinne von #690, aber ich wüsste danach nicht, ob die Einstellungen gelten.
- Ohne Häkchen bei «Kontoinhaber ist der Absender» erscheint die Gruppe «Kontoinhaber» mit leeren Feldern. Bei gesetzter IBAN sind sie nicht als fehlend markiert, solange nicht gespeichert wird; laut #690 erfolgt die Markierung erst beim Laden.
  - Die Felder heissen gleich wie beim Absender («Strasse und Hausnummer», «PLZ», «Ort»), nur die Gruppe heisst «Kontoinhaber».
  - Anders als beim Absender gibt es hier keine Beispiele unter den Feldern.
- Der Dialog «Mahnung senden» (abgebrochen, nichts gesendet) sagt nichts über einen Zahlteil oder die Adresse. Das passt bei vollständigen Einstellungen.
- Der Link «Einstellungen» in der Navigation führt nach `/config`. `/einstellungen` ergibt «Diese Seite gibt es nicht.».

## Aufgabe geschafft: teilweise

Ich habe geprüft, dass bei vollständigen Einstellungen keine Warnung erscheint und welche PDFs einen Zahlteil tragen. Die Warnungen selbst, die Markierung beim Laden, die Meldung bei einer Ablehnung, den eigenen Kontoinhaber und die Ablehnungsseite des PDFs habe ich nicht gesehen.

## Aufwand

Rund 35 Minuten, davon gut 20 Minuten Warten darauf, dass sich die Einstellungen ändern. Rund 15 Schritte: Einstellungen lesen, 5 Detailseiten, 4 PDFs, 2 abgefangene Speicherversuche, Mahnungsdialog.

## Ablauf

- `/einstellungen` direkt aufgerufen. Erwartet: die Einstellungen. Gesehen: «Diese Seite gibt es nicht.». Über die Navigation gefunden: `/config`.
- Einstellungen nach Helgas möglicher Änderung gelesen. Erwartet: irgendwann eine fehlende PLZ, ein fehlender Ort oder ein Kontoinhaber, damit ich die Warnungen sehen kann. Gesehen: 25 Minuten lang immer vollständige Einstellungen.
- PLZ geleert und gespeichert (abgefangen). Erwartet: eine Markierung oder ein Hinweis vor dem Absenden. Gesehen: Die Seite schickt das Formular ohne Hinweis ab.
- Speichern mit Serverfehler. Erwartet: ein Satz wie «Nichts wurde gespeichert», die Eingaben bleiben stehen. Gesehen: eine Fehlerseite statt der Einstellungen, einmal mit «Unexpected end of JSON input».
- PDF der bezahlten Nachzahlung Bernasconi 2024. Erwartet: deutsches PDF. Gesehen: italienisches PDF (Sprache des Mieters), mit Zahlteil.

## Vorschläge

Keine Tabellen-IDs. Damit eine Persona die Änderung von #690 tatsächlich prüfen kann: Der Aufrufer setzt vor dem Start per SQL in `dwello_persona` unvollständige Einstellungen, oder er gibt genau einer Persona den Auftrag, die Einstellungen zu speichern, und nennt die Reihenfolge:

1. PLZ leer bei gesetzter IBAN;
2. Häkchen weg, Kontoinhaber vollständig, Absender ohne PLZ;
3. Häkchen weg, Kontoinhaber ohne Ort.

## Nicht geprüft

- **Markierung fehlender Felder beim Laden der Einstellungen:** Die Einstellungen waren immer vollständig. Selbst speichern durfte ich nicht (kein Gebäude zugeteilt, globale Einstellung, Helga gleichzeitig). Versucht: 25 Minuten lang Einstellungen alle 30 Sekunden gelesen.
- **Meldung «nichts gespeichert» bei einer Ablehnung:** Eine echte Ablehnung hätte ein echtes Speichern verlangt. Versucht: Speicheranfrage abgefangen; damit sieht man nur den Serverfehler, nicht die Ablehnung.
- **Warnung auf den Detailseiten** (offene, bezahlte Nachzahlung, Rückerstattung) mit «Zu den Einstellungen»: Dazu braucht es eine fehlende Adresse; die Seiten werden auf dem Server erstellt, ich kann den Zustand im Browser nicht herbeiführen.
- **Eigener vollständiger Kontoinhaber ohne Warnung:** Dazu hätte ich die Einstellungen speichern müssen.
- **Ablehnungsseite des PDFs mit Link zu den Einstellungen:** Sie erscheint nur bei fehlender Adresse; alle vier PDFs wurden erzeugt.
- **Wortlaut der neuen Warnungen gegen das PDF:** Ich habe keine Warnung zu Gesicht bekommen; verglichen habe ich nur die bestehenden Hilfetexte mit dem PDF (siehe Beobachtungen).

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/weber-690/`.

## Runde 2

Desktop 1440 × 900, Maus, Persona-App auf :3300 (Branch w-690), 16:05 bis 16:20 Uhr. Den jeweiligen Zustand habe ich vorher per SQL in `dwello_persona` (Tabelle `configuration`) hergestellt. Ursprünglich gab es keine Schlüssel für den Kontoinhaber, «Kontoinhaber ist der Absender» war angehakt. Die Schlüsselnamen (`account_holder_name`, `_address`, `_postal_code`, `_city`) kannte ich erst, nachdem ich einmal über die Oberfläche einen eigenen Kontoinhaber gespeichert hatte. Am Schluss habe ich die vier Zeilen gelöscht und die PLZ wieder auf 8001 gesetzt. Die Schlüssel und Werte stimmen jetzt wieder mit dem Ausgangszustand überein (mit `diff` geprüft), die Einstellungen zeigen keine Markierung mehr, und die Detailseiten zeigen keine Warnung.

Geprüfte Zustände:
1. Absender ohne PLZ, IBAN gesetzt, Häkchen gesetzt.
2. Eigener, vollständiger Kontoinhaber (Weber Treuhand GmbH, Löwenstrasse 10, 8002 Zürich), Absender ohne PLZ.
3. Eigener Kontoinhaber ohne Ort, Absender wieder vollständig.

Abrechnungen: offene, überfällige Nachzahlung Hans Müller (NK-11111111-2025-0001), Nachzahlungen im Entwurf (Bernasconi NK-22222222-2025-0004, Sarah Meier, Maria Rossi, Pierre Dubois), bezahlte Nachzahlungen (Bernasconi NK-22222222-2024-0003, Kevin Fischer), Rückerstattungen (Thomas Weber im Entwurf, Nina Brunner im Entwurf, Laura Keller bezahlt, Anna Schmidt im Entwurf).

### Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| W-1 | Major | Abrechnungsdetail, Hinweis beim PDF, Seite «PDF nicht verfügbar» | Fehlt beim eigenen Kontoinhaber der Ort (Zustand 3), sagen alle drei Stellen: «Für den Zahlteil fehlt die Firmenadresse. Ergänzen Sie Name, PLZ und Ort unter «Einstellungen».» Die Firmenadresse ist aber vollständig. Was fehlt, ist der Ort des Kontoinhabers. Der Text schickt mich zu den falschen Feldern. |
| W-2 | Major | Einstellungen | Zustand 2: Die Einstellungen markieren beim Laden «PLZ» des Absenders und «IBAN» als fehlerhaft («Mit einer IBAN braucht es die Firmenadresse. …»). Beim Speichern lehnen sie ab: «Die Einstellungen wurden nicht gespeichert. Keine Änderung wurde gespeichert, auch nicht in den anderen Feldern.» Gleichzeitig zeigt keine Detailseite eine Warnung, und das PDF der Nachzahlung wird korrekt erstellt, mit Weber Treuhand GmbH, Löwenstrasse 10, 8002 Zürich unter «Pagabile a». Die Einstellungen widersprechen also Detailseite und PDF, und ich kann keine andere Einstellung speichern, ohne eine PLZ einzutragen, die der Zahlteil gar nicht braucht. |
| W-3 | Minor | Einstellungen (nach «Zu den Einstellungen») | Der Link auf der Detailseite und auf «PDF nicht verfügbar» öffnet `/config` ganz oben. Der erste Bildschirm zeigt nur Stammdaten, KI und Zugangsschlüssel. Das markierte Feld liegt rund 1800 px weiter unten (Absender), der Kontoinhaber noch tiefer. Oben deutet nichts auf ein Problem hin, der Fokus liegt auf der Seite. |
| W-4 | Minor | Einstellungen | Die Meldung steht nicht beim leeren Feld, und ein richtiges Feld ist als fehlerhaft markiert. Zustand 1: Die PLZ hat nur einen roten Rahmen ohne sichtbaren Text, die Meldung steht unter der korrekten IBAN, und auch diese ist rot. Zustand 3: Die Meldung hängt am ausgefüllten «Name des Kontoinhabers», und auch dieser ist als fehlerhaft markiert. Nach der Ablehnung beim Speichern springt der Fokus auf die leere PLZ, die erklärende Meldung liegt aber unten bei «Konto» ausserhalb des Bildschirms. |
| W-5 | Minor | Abrechnungsdetail Hans Müller (überfällig) | In den Zuständen 1 und 3 steht hier «Für den Zahlteil fehlt …». «PDF herunterladen» liefert aber das bereits erstellte PDF mit vollständigem Zahlteil (Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, erstellt 15:44). Für welches Dokument die Warnung gilt (vermutlich die nächste Mahnung), sagt sie nicht. Der Dialog «Mahnung senden» erwähnt die fehlende Adresse nicht. |
| W-6 | Minor | Detail, Hinweis beim PDF, «PDF nicht verfügbar», Einstellungen | Wortlaut: Das Wort «Firmenadresse» kommt in den Einstellungen nicht vor (Abschnitt «Absender», Feld «Firmenname»). «Name» meint «Firmenname». Ein privater Vermieter hat oft keine Firma. «Zahlteil» steht in der Warnung, die Einstellungen sprechen nur von «QR-Rechnung». Wo man «Name, PLZ und Ort» ergänzen soll, muss man selbst suchen. Die Meldung beim Kontoinhaber ist dagegen genau und richtig: «Mit einer IBAN braucht es den Kontoinhaber. Erfassen Sie Name, PLZ und Ort des Kontoinhabers oder setzen Sie das Häkchen …». |

### Beobachtungen

- **Wo die Warnung erscheint, stimmt in allen drei Zuständen.** Sie steht bei den Nachzahlungen im Entwurf und bei der überfälligen Nachzahlung. Bei bezahlten Nachzahlungen und bei allen Rückerstattungen fehlt sie. In Zustand 2 erscheint nirgends eine Warnung. Das entspricht dem, was das PDF tut: Die Nachzahlungen im Entwurf werden abgelehnt, die Rückerstattung im Entwurf (Nina Brunner) wird erstellt, die bezahlte Nachzahlung liefert ihr früheres PDF.
- **Ablehnung beim PDF:**
  - Der Link «PDF herunterladen» einer Nachzahlung im Entwurf führt zur Seite «PDF nicht verfügbar» mit der Meldung, «Zu den Einstellungen» (`/config`) und «Zurück» zur Abrechnung.
  - Die Schaltfläche «PDF erstellen» zeigt unten rechts eine Meldung: «PDF konnte nicht erstellt werden: Für den Zahlteil fehlt …».
  - Beides funktioniert, nur der Wortlaut ist in Zustand 3 falsch (W-1).
- **Nach einer Ablehnung ist das frühere PDF eines Entwurfs weg.** Bernasconi NK-22222222-2025-0004 und Sarah Meier hatten «PDF herunterladen». Nach der Ablehnung zeigen sie «PDF erstellen». Das korrekte PDF aus Zustand 2 war in Zustand 3 nicht mehr zu bekommen. Bei einem Entwurf ist das vertretbar, ich erwähne es nur, weil diese Demo-Entwürfe jetzt kein PDF mehr haben.
- **Rückerstattung ohne PLZ** (Zustand 1, Nina Brunner): Der Kopf zeigt beim Absender nur «Muster Immobilien AG / Bahnhofstrasse 1», die Zeile mit PLZ und Ort fehlt ganz. Dazu gibt es keine Warnung. Das ist folgerichtig, weil kein Zahlteil entsteht, aber das Schreiben trägt so eine unvollständige Absenderadresse.
- Das bereits versandte PDF von Hans Müller nennt auch in Zustand 3 «Muster Immobilien AG» als Zahlungsempfänger, obwohl ein anderer Kontoinhaber eingestellt war. Das ist bei einem eingefrorenen Dokument richtig, zeigt aber, dass die Warnung auf der Detailseite nicht das herunterladbare PDF meint (W-5).
- Der Hilfetext unter «IBAN» sagt weiter ohne Einschränkung «Mit einer IBAN braucht es Firmenname, PLZ und Ort» (schon in Runde 1). Er passt zu W-2, aber nicht zu Detailseite und PDF.

### Aufgabe geschafft: ja

Alle drei Zustände sind geprüft: Einstellungen beim Öffnen, Detailseiten offen, bezahlt und Rückerstattung, PDF der Nachzahlung. Die Einstellungen sind wiederhergestellt.

### Aufwand

Rund 15 Minuten, rund 30 Schritte: drei Zustände mit je Einstellungen, 11 Detailseiten und 1 bis 3 PDF-Versuchen, dazu ein Speichern über die Oberfläche (um die Schlüssel zu finden), ein abgelehntes Speichern in Zustand 2 und das Öffnen des Mahnungsdialogs (abgebrochen).

### Ablauf

- Zustand 1, Einstellungen öffnen. Erwartet: PLZ markiert, mit einer Meldung daneben. Gesehen: PLZ rot ohne Text, die Meldung und eine rote Markierung bei der richtigen IBAN. Beides liegt weit unter dem ersten Bildschirm (W-3, W-4).
- Zustand 1, PDF Hans Müller (überfällig). Erwartet: Ablehnungsseite. Gesehen: das gespeicherte PDF mit vollständigem Zahlteil, obwohl die Seite warnt (W-5).
- Zustand 2, Einstellungen. Erwartet: keine Markierung. Gesehen: PLZ und IBAN markiert, und das Speichern wird abgelehnt (W-2).
- Zustand 3, Detailseite und Ablehnungsseite. Erwartet: ein Hinweis auf den Ort des Kontoinhabers. Gesehen: «Für den Zahlteil fehlt die Firmenadresse» (W-1).
- Zustand 3, Einstellungen. Erwartet: «Ort» des Kontoinhabers markiert, mit Meldung. Gesehen: «Ort» markiert, die Meldung und eine rote Markierung aber beim ausgefüllten Namen (W-4).

### Vorschläge

- **W-1:**
  - Nachstellen: IBAN gesetzt, Häkchen weg, Kontoinhaber mit Name, Strasse und PLZ, ohne Ort. Dann eine Nachzahlung im Entwurf öffnen und «PDF herunterladen» wählen.
  - Hilfreich: zwei Texte, je nachdem, wessen Adresse fehlt, zum Beispiel «Für den Zahlteil fehlt der Ort des Kontoinhabers. Ergänzen Sie ihn unter «Einstellungen» › «Konto».».
- **W-2:**
  - Nachstellen: Häkchen weg, Kontoinhaber vollständig, Absender ohne PLZ. Dann «Einstellungen» öffnen und «Einstellungen speichern» wählen.
  - Hilfreich: Mit eigenem, vollständigem Kontoinhaber verlangen die Einstellungen beim Absender keine PLZ wegen der IBAN, wie Detailseite und PDF. Falls der Absender trotzdem eine vollständige Adresse braucht (für den Kopf des Schreibens), sollte die Meldung das sagen und nicht die IBAN anführen.
- **W-3:**
  - Nachstellen: Zustand 1 oder 3, auf der Detailseite «Zu den Einstellungen» wählen.
  - Hilfreich: Der Link springt zum betroffenen Abschnitt («Absender» oder «Kontoinhaber») und setzt den Fokus auf das leere Feld, oder oben steht ein Hinweis mit Sprunglink.
- **W-4:**
  - Nachstellen: Zustand 1 oder 3, «Einstellungen» öffnen.
  - Hilfreich: nur die leeren Felder markieren und die Meldung unter das erste leere Feld setzen. IBAN und Name nicht als fehlerhaft markieren, wenn sie stimmen.
- **W-5:**
  - Nachstellen: Zustand 1, Hans Müller öffnen, «PDF herunterladen» wählen.
  - Hilfreich: bei versandten Abrechnungen sagen, wofür der Zahlteil fehlt, zum Beispiel «Für den Zahlteil einer Mahnung fehlt …». Der Mahnungsdialog sollte dieselbe Warnung zeigen.
- **W-6:**
  - Nachstellen: die Texte aus Zustand 1 mit den Überschriften der Einstellungen vergleichen.
  - Hilfreich: die Wörter der Einstellungen verwenden: «Für die QR-Rechnung (Zahlteil) fehlt beim Absender die PLZ …», mit dem Abschnittsnamen statt «Firmenadresse».

### Nicht geprüft

- **Ob eine Mahnung in diesen Zuständen abgelehnt wird oder einen Zahlteil trägt:** Die Mahnung hätte ich senden müssen, ohne dass mir ein Gebäude zugeteilt war. Ich habe den Dialog nur geöffnet und abgebrochen.
- **Ob die Ablehnung beim Speichern in Zustand 2 (W-2) schon vor #690 bestand:** Einen Vergleich mit dem Basis-Commit konnte ich nicht ziehen. Die Markierung beim Laden ist neu.
- **Ein neu erzeugtes PDF einer bezahlten Nachzahlung:** Es wurde immer das gespeicherte PDF geliefert.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/weber-690-2/`, unter anderem:
- `s1-config.png`: Einstellungen, ganze Seite, Zustand 1;
- `s1-gen-click.png`: Detailseite mit Warnung und Meldung unten rechts;
- `s1-refused.png`: Seite «PDF nicht verfügbar»;
- `s2-save.png`: Fokus auf der leeren PLZ nach der Ablehnung.
