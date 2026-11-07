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
