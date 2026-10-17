# Dr. Weber, Runde 78: Zahlteil ohne Adresse des Mieters

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Gebäude: «Musterhaus Zentrum». Persona-App http://localhost:3300 (Demo-Daten), 17.10.2026.

Verwendete Abrechnungen:

- **NK-11111111-2025-0003**, Pierre Dubois, Wohnung 2.01, Entwurf, Nachzahlung CHF 142.35, Sprache Französisch. Bei ihm habe ich die Korrespondenzadresse entfernt.
- **NK-11111111-2025-0004**, Maria Rossi, Wohnung 3.01, Entwurf, Nachzahlung CHF 238.10, Sprache Italienisch. Adresse Bahnhofstrasse 42, 8001 Zürich bleibt; sie ist der Vergleich.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/944a679c-a383-5496-9d09-90f0e164b810/scratchpad/persona-weber/dr-weber-78/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Zum geprüften Zahlteil habe ich keinen Befund. Ohne Adresse heisst das Feld im Empfangsschein und im Zahlteil «Payable par (nom/adresse)» und darunter steht ein leeres Feld mit Eckmarken. Betrag, Konto, Referenz und Abrechnungsnummer stimmen mit dem Brief überein. |

## Beobachtungen

- **Adressfeld im Brief (Seite 1):** Ohne Adresse steht im Brieffenster nur «Pierre Dubois». Bei einem Versand in einem Fensterkuvert käme der Brief nicht an. Hier ist das vertretbar: Herr Dubois erhält seine Post laut Mieterseite «Per E-Mail». Ein Hinweis in der App, dass das PDF keine Postadresse enthält, fehlt aber. Weder auf der Seite der Abrechnung noch beim Speichern erscheint einer.
- **Land bleibt stehen:** Nach dem Leeren von Strasse, PLZ und Ort steht im Formular unter «Land (optional)» weiterhin «Schweiz» (Wert CH). Die Mieterseite meldet trotzdem «Keine Adresse erfasst», und das PDF druckt kein Land. Die Daten sind also stimmig, aber ein «Land» ohne Adresse irritiert mich.
- **Keine Bestätigung beim Speichern:** Nach «Änderungen speichern» springt die App zurück auf die Mieterseite. Eine Meldung wie «Gespeichert» erscheint nicht, auch nicht sofort nach dem Klick (Screenshot `11-resave-sofort.png`). Dass gespeichert wurde, sehe ich erst an «Keine Adresse erfasst».
- **Mieterangaben auf der Abrechnungsseite:** Unter «Mieter und Wohnung» stehen beim Mieter nur Name und E-Mail. Unter der Wohnung steht die Adresse des Gebäudes (Bahnhofstrasse 42). Dass beim Mieter keine Postadresse vorhanden ist, zeigt diese Seite nicht.
- **Verlauf:** Der Verlauf der Abrechnung zeigt nur «PDF erstellt 17.10.2026, 12:15» aus der Erstellung der Abrechnung. Ob er auch meine beiden späteren Downloads verbucht, habe ich nicht nachgeprüft.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten in 12 Schritten: Übersicht, Entwürfe, Abrechnung 0003, PDF vorher, Mieter, Bearbeiten und Speichern, Abrechnung erneut, PDF nachher, Abrechnung 0004, Mieterin Rossi, PDF 0004, Vergleich.

## Ablauf

1. **Übersicht → «Entwürfe ansehen».** Erwartet: die Entwürfe 2025. Gesehen: 7 Entwürfe. Im Musterhaus Zentrum haben zwei eine Nachzahlung: Maria Rossi (0004, CHF 238.10) und Pierre Dubois (0003, CHF 142.35). Anna Schmidt (0002) hat eine Rückerstattung.
2. **Abrechnung NK-11111111-2025-0003 öffnen.** Gesehen: Saldo «Nachzahlung CHF 142.35», Zahlungsfrist 16.11.2026. Die Rechnung habe ich nachgerechnet: Nebenkosten 3’382.38 − Akonto 3’240.00 = 142.38, gerundet auf 5 Rappen 142.35. Das stimmt.
3. **Vorher-PDF heruntergeladen** (`dubois-vorher.pdf`), damit ich vergleichen kann. Im Zahlteil stand «Payable par Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich».
4. **Mieter Pierre Dubois → «Bearbeiten».** Erwartet: ein Abschnitt Adresse. Gesehen: «Korrespondenzadresse» mit dem Hilfetext «Hierhin gehen Abrechnungen und Mahnungen…». Strasse, PLZ und Ort sind als optional markiert. Der Hilfetext beim Korrespondenzkanal sagt klar, dass der Versand per Brief eine vollständige Adresse braucht. Herr Dubois steht auf «Per E-Mail».
5. **Strasse, PLZ und Ort geleert, «Änderungen speichern».** Erwartet: eine Bestätigung. Gesehen: zurück auf der Mieterseite mit «Korrespondenzadresse: Keine Adresse erfasst», ohne Meldung (siehe Beobachtungen). Das Land blieb auf «Schweiz».
6. **Abrechnung 0003 erneut geöffnet.** Erwartet: vielleicht ein Hinweis «Mieter ohne Postadresse». Gesehen: kein Hinweis, die Seite ist unverändert.
7. **«PDF herunterladen»** → `NK-11111111-2025-0003.pdf`. Das PDF ist neu erstellt (Entwurf), die Beträge sind unverändert. Der Textvergleich mit dem Vorher-PDF zeigt nur zwei Unterschiede: das Brieffenster (jetzt nur der Name) und das Feld des Zahlungspflichtigen im Zahlteil.
8. **Zahlteil von 0003 beurteilt** (Seite 2 als Bild gerendert, `dubois-nachher-s2-2.png`):
   - Empfangsschein «Récépissé»: Konto CH44 3199 9123 0008 8901 2, Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich. Referenz 00 59239 70623 16066 59970 76811. Danach «Payable par (nom/adresse)» mit einem leeren Feld mit vier Eckmarken, «Monnaie CHF, Montant 142.35» und «Point de dépôt».
   - Zahlteil «Section paiement»: QR-Code, CHF 142.35, gleiches Konto und gleiche Referenz. «Informations supplémentaires: Décompte des charges NK-11111111-2025-0003». Danach «Payable par (nom/adresse)» mit einem grösseren leeren Feld mit Eckmarken.
   - Urteil: Damit kann der Mieter bezahlen. Konto, Betrag und Referenz sind vollständig. Die Überschrift «(nom/adresse)» und das Feld mit den Eckmarken zeigen ihm, wo Name und Adresse hingehören. Ein eigener Satz dazu im Brief fehlt, ist aber nach meinem Verständnis des Standards auch nicht vorgesehen.
   - Übereinstimmung mit dem Brief: Betrag 142.35 wie «Montant à payer». Die Abrechnungsnummer ist dieselbe wie im Kopf. Der Brief verweist mit «au moyen de la section paiement» auf den Zahlteil. Auch die Sprache passt: Zahlteil wie Brief auf Französisch. Die Referenz ist vorher und nachher dieselbe, die Entfernung der Adresse ändert sie also nicht.
9. **Vergleich: NK-11111111-2025-0004 (Maria Rossi).** Ihre Mieterseite zeigt die Korrespondenzadresse Bahnhofstrasse 42, 8001 Zürich, Kanal «Per Brief». PDF heruntergeladen (`rossi.pdf`, Seite 2 `rossi-s2-2.png`).
   - Brieffenster: Maria Rossi, Bahnhofstrasse 42, 8001 Zürich.
   - Zahlteil (Italienisch): «Pagabile da» ohne Zusatz, darunter gedruckt «Maria Rossi / Bahnhofstrasse 42 / 8001 Zürich». Das steht so im Empfangsschein und im Zahlteil, ohne Eckmarken. CHF 238.10, Referenz 00 39441 46848 68329 42256 33970, «Conteggio spese accessorie NK-11111111-2025-0004».
   - Unterschied zu 0003: Nur das Feld des Zahlungspflichtigen und die Überschrift unterscheiden sich, nämlich gedruckte Adresse und «Pagabile da» gegenüber leerem Feld mit Eckmarken und «Payable par (nom/adresse)». Layout, Konto, Gläubiger, Währung und «Punkt der Annahme» sind gleich. Beide Zahlteile sind in sich und mit ihrem Brief stimmig.

## Verwirrung

- Ein «Land» ohne Adresse: Ich bin nicht sicher, ob «Schweiz» noch irgendwo gespeichert ist und gedruckt würde, sobald jemand nur den Ort wieder einträgt.
- Ohne Bestätigung nach dem Speichern war ich einen Moment unsicher, ob das Leeren der Felder überhaupt übernommen wurde.
- Die Begriffe «Korrespondenzadresse» und «Korrespondenzkanal» sind mit ihrem Hilfetext verständlich.

## Fehlerrisiken

- Wer die Abrechnung von Herrn Dubois ausdruckt und per Post verschickt, hat im Brieffenster nur einen Namen. Die App warnt an keiner Stelle davor, dass der Brief ohne Postadresse ist (Kanal E-Mail, deshalb kein Befund in diesem Auftrag).
- Wechselt jemand den Kanal später auf «Per Brief», sollte die App die fehlende Adresse verlangen. Das sagt der Hilfetext, geprüft habe ich es nicht (siehe Nicht geprüft).

## Vorschläge

Keine Tabellen-ID. Freiwillige Anregungen zu den Beobachtungen:

- Nach «Änderungen speichern» kurz «Änderungen gespeichert» anzeigen.
- Auf der Abrechnungsseite bei «Mieter» anzeigen, wenn keine Postadresse erfasst ist, zum Beispiel «Keine Postadresse: Der Zahlteil lässt das Feld für Name und Adresse leer».
- Das Land beim Leeren der Adresse ebenfalls leeren oder als Teil der Adresse erkennbar machen.

## Nicht geprüft

- **Inhalt des QR-Codes:** Es stand kein QR-Lesegerät zur Verfügung (kein `zbarimg`, kein `cv2`). Ob im QR-Code der Debitor tatsächlich leer ist und Betrag und Referenz mit dem Druck übereinstimmen, habe ich nur am gedruckten Text gesehen, nicht am Code selbst.
- **Masse der Eckmarken-Felder** (Standard: 52 × 20 mm im Empfangsschein, 65 × 25 mm im Zahlteil): nur nach Augenmass geprüft. Die Proportionen wirken richtig.
- **Kanal «Per Brief» ohne Adresse speichern:** nicht versucht, weil die Aufgabe nur das Entfernen der Adresse verlangt.
- **Versand per E-Mail** der Abrechnung 0003: nicht ausgelöst, damit der Entwurf ein Entwurf bleibt.
- **Daten-Prüfung der Beträge:** nur Saldo und Rundung nachgerechnet, nicht die einzelnen Anteile (Aufgabe von `daten-pruefer`).
