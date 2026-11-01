# Persona-Review Runde 546: Dr. Weber

Desktop 1440 × 900, Maus. Gebäude «Alpenblick», Abrechnungsperiode 2025. Skripte und Screenshots: `/tmp/weber-546/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung (versendet), Hinweis «Rechnungen seit der Abrechnung geändert» und Dialog «Abrechnung berichtigen» | Nur der Weg «Nicht berichtigen» nennt den Unterschied in Franken («Den Unterschied von CHF 139.60 tragen Sie selbst.»). Der Hinweis zeigt nur «Rückerstattung von CHF 9.60 statt CHF 149.20», der Dialog «Abrechnung berichtigen» gar keinen Betrag. Dass die Mieterin bei einer Berichtigung CHF 139.60 weniger zurückbekommt, musste ich selbst ausrechnen. |
| P-2 | Minor | Abrechnung (versendet), Hinweis | «1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht». Welche Rechnung es ist und was sich geändert hat, steht nicht da, und es gibt keinen Link dorthin. Wer mehrere Rechnungen nachträgt, kann nicht prüfen, ob die CHF 9.60 auf der richtigen Grundlage stehen. |

## Beobachtungen

- In «Alpenblick» gab es für 2025 noch keine Abrechnung, nur für 2024 (beide bezahlt). Ich habe zuerst mit «Abrechnungen erstellen» die zwei Entwürfe erstellt (Laura Keller EG, Kevin Fischer OG1) und danach den von Laura Keller per E-Mail versendet.
- Assistent «Abrechnungen erstellen»: Mit «Weiter» in Schritt 1 sprang die Anzeige direkt auf «Schritt 4 von 5: Vorschau», mit 0 Abrechnungen und CHF 0.00, ohne dass ich ein Gebäude gewählt hatte. Erst mit zweimal «Zurück» kam ich zur Gebäudewahl. Das hat mich irritiert.
- Rundung: Auf der Abrechnung steht «Rückerstattung vor Rundung CHF 149.17 / Rundung auf 5 Rappen + CHF 0.03 / CHF 149.20». Kaufmännisch gerundet wäre das CHF 149.15. Auch der neu berechnete Wert ist aufgerundet: Ich komme auf CHF 9.57, Dwello zeigt CHF 9.60. Offenbar rundet Dwello eine Rückerstattung zugunsten der Mieterin auf. Das ist vertretbar, aber nirgends erklärt.
- «Neue Rechnung», Kategorie Hauswart: Das Feld «Verteilschlüssel» blieb auf «Verteilschlüssel auswählen». Laut Hilfetext schlägt Dwello sonst den Schlüssel aus den Einstellungen vor. Ich habe «Pro Fläche (m²)» selbst gewählt.
- Gut: Die Rechnungsseite sagt gleich nach dem Speichern «Abrechnungen nicht aktuell» und erklärt den Unterschied zwischen «Neu berechnen» (Entwurf) und «Abrechnung berichtigen» (versendet). Die Übersicht zeigt danach als nächsten Schritt «Abrechnung berichtigen» für NK-33333333-2025-0001 und für den Entwurf von Kevin Fischer «1 Entwurf ist nicht aktuell».
- Der Hinweis auf der Abrechnung sagt «Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung». Ich bin schon auf der Abrechnung, der Zusatz ist hier überflüssig.
- Der Hinweis auf die Verjährung (Art. 128 Ziff. 1 OR, «ab wann die Frist läuft, ist nicht einheitlich geklärt») ist vorsichtig und korrekt formuliert. Er steht dreimal fast gleich da: Rechnungsseite, Hinweis, Dialog.

## Aufgabe geschafft: ja

Ich habe den Hinweis gesehen, die Folgen in Franken gelesen und den Dialog vor «Nicht berichtigen» geöffnet, aber nicht bestätigt. Meine Entscheidung im echten Leben: Ich berichtige. Die Rückerstattung ist noch nicht überwiesen, und die Hauswartung ist umlagefähig. Ohne Berichtigung trage ich CHF 139.60 selbst. Mit Berichtigung bekommt Frau Keller CHF 9.60 statt CHF 149.20, also CHF 139.60 weniger. Diese Zahl hat mir Dwello aber nur im Dialog «Nicht berichtigen» genannt (P-1).

Kosten der beiden Wege nachgerechnet: Anteil Wohnung EG etwa 28.235 % (aus 132.71 / 470.00). CHF 480.00 × 28.235 % = CHF 135.53. Dazu 3 % Verwaltungspauschale = CHF 4.07, zusammen CHF 139.60. Rückerstattung neu: 149.17 − 139.60 = CHF 9.57, gerundet CHF 9.60. Unterschied 149.20 − 9.60 = CHF 139.60. Die Beträge sind plausibel und stimmen untereinander.

## Aufwand

Etwa 15 Minuten, rund 25 Bedienschritte. Der grösste Teil ging auf den Assistenten, weil zuerst eine Abrechnung erstellt werden musste.

## Ablauf

- Abrechnungen von Alpenblick: Ich erwartete Abrechnungen für 2025 im Entwurf, gefunden habe ich nur die von 2024. Ich habe sie erstellt (siehe Beobachtungen).
- Assistent Schritt 1, «Weiter»: Ich erwartete Schritt 2 «Gebäude», es kam Schritt 4 «Vorschau» mit 0 Abrechnungen (gen-2.png).
- Neue Rechnung, Kategorie Hauswart: Ich erwartete einen vorgeschlagenen Verteilschlüssel, das Feld blieb leer.
- Versendete Abrechnung erneut geöffnet (14-sent-affected.png): Ich erwartete, dass die Rechnung genannt wird und was beide Wege kosten. Ich sah einen gelben Hinweis mit «1 Rechnung … erfasst, geändert oder gelöscht» und «Neu berechnet ergibt sich für Laura Keller eine Rückerstattung von CHF 9.60 statt CHF 149.20», ohne Rechnung und ohne Differenz.
- Dialog «Abrechnung berichtigen» (16-berichtigen.png): Ich erwartete den neuen Saldo oder die Differenz, es steht kein Betrag da, nur das Feld «Bereits zurückerstattet».

## Vorschläge

- **P-1:** Alpenblick 2025 versenden, eine Hauswart-Rechnung über CHF 480.00 (01.01.–30.06.2025) erfassen und die versendete Abrechnung öffnen. Hilfreich wäre, im Hinweis beide Folgen nebeneinander zu nennen: «Berichtigen Sie: Laura Keller erhält CHF 139.60 weniger zurück (CHF 9.60 statt CHF 149.20). Berichtigen Sie nicht: Die CHF 139.60 tragen Sie selbst.» Dazu den neuen Saldo auch im Dialog «Abrechnung berichtigen» nennen.
- **P-2:** Gleiche Schritte. Im Hinweis die Rechnung(en) mit Rechnungssteller, Datum und Betrag nennen und verlinken, z. B. «Neu: Hauswartdienst Jungfrau GmbH, 30.06.2025, CHF 480.00».

## Nicht geprüft

- «Nicht berichtigen» und «Abrechnung berichtigen» habe ich nicht bestätigt (Auftrag). Was danach im Verlauf und auf der Übersicht steht, habe ich darum nicht gesehen.
- Das PDF der versendeten Abrechnung habe ich nicht geöffnet. Es war nicht Teil des Auftrags, und an den Beträgen hat sich nichts geändert.
- Den Fall, dass die Rückerstattung schon überwiesen ist (Feld «Bereits zurückerstattet»), habe ich nicht durchgespielt.
