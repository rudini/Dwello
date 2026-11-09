# Persona-Bericht: Dr. Weber, Runde 1395

Aufgabe: Fläche der leeren Wohnung 3.02 in «Musterhaus Zentrum» als Fehlerkorrektur um 20 m² erhöhen (55 → 75 m², Zimmeranzahl bleibt 2), danach prüfen, was das für die versendete Nebenkostenabrechnung 2025 von Hans Müller bedeutet (NK-11111111-2025-0001, Status «Überfällig»), und die Hilfe beim Bearbeiten der Formel eines eigenen Verteilschlüssels beurteilen. Desktop 1440 × 900, Maus. Ich habe nichts berichtigt, nichts gemahnt und keine Formel geändert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-11111111-2025-0001, Dialog «Mahnung senden» | Der Hinweis auf derselben Seite sagt: «Berichtigen Sie die Abrechnung, sonst verlangen Sie mehr als die tatsächlichen Kosten.» Der Knopf «Mahnung senden» steht aber weiter oben im Kopf, und sein Dialog sagt ohne jeden Vorbehalt «Hans Müller schuldet noch CHF 215.80.» Dabei hat Dwello selbst neu CHF 126.90 berechnet. Auf der Übersicht steht unter «Fristen» weiter «Zahlungsfrist · Hans Müller, seit 12 Tagen abgelaufen». So kann ich einen Betrag mahnen, von dem Dwello weiss, dass er zu hoch ist. |
| P-2 | Minor | Abrechnung, Hinweis «Wohnung oder Verteilschlüssel seit der Abrechnung geändert» | Der Hinweis sagt nicht, *was* sich geändert hat. Er spricht nur von «eine Wohnung des Gebäudes oder ein Verteilschlüssel», nennt also weder die Wohnung 3.02 noch die Fläche 55 → 75 m². Er nennt auch nur den neuen Saldo und keine Positionen. Ich konnte deshalb nur ungefähr nachrechnen: Ich komme auf CHF 126.95, Dwello auf CHF 126.90. Woher die 5 Rappen kommen, kann ich nicht klären. |
| P-3 | Minor | Abrechnung, derselbe Hinweis | Die Sätze passen nicht genau zum Fall. «Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung» steht genau auf dieser Abrechnung. «… eine tiefere Nachzahlung oder eine höhere Rückerstattung» bleibt ein «oder», obwohl der Satz davor den Fall genau nennt (tiefere Nachzahlung). Der Text liest sich wie ein Baustein und nicht wie eine Aussage zu meiner Abrechnung. |
| P-4 | Minor | Übersicht, «Als Nächstes zu tun» | Nach einer einzigen Korrektur stehen dort fünf gleichlautende Blöcke «Abrechnung berichtigen» mit je vier Sätzen: Hans Müller 2025 sowie Hans Müller, Maria Rossi, Pierre Dubois und Anna Schmidt 2024, die schon bezahlt sind. Nur die Nummer und der Name sind anders. Weder Betrag noch Richtung (zu viel oder zu wenig verlangt) stehen dabei. Was dringend ist, sehe ich erst, wenn ich jede Abrechnung einzeln öffne. |

## Beobachtungen

- Das Hilfefeld «Neue Fläche und Zimmeranzahl gelten ab (optional)» beim Bearbeiten der Wohnung beantwortet meine Frage richtig: «Wollen Sie nur einen Fehler korrigieren, lassen Sie das Feld leer … Versendete Abrechnungen bleiben unverändert; eine berichtigte Abrechnung rechnet mit den Werten, die Sie hier speichern.» Der Text ist aber sehr lang. Er hat zwölf Sätze und reicht bis zu Art. 269d OR und zur Erhöhung der Nettomiete. Den Halbsatz «und wenn schon ein Tag erfasst ist, ab diesem Tag» musste ich zweimal lesen.
- Die Fläche wird im Formular als «55.00» angezeigt, auf der Wohnungsseite als «55 m²».
- Nach «Änderungen speichern» landete ich auf der Wohnungsseite mit «75 m²». Eine Bestätigung habe ich im Text nicht gefunden. Die Wohnungsseite sagt auch nicht, dass jetzt versendete Abrechnungen betroffen sind. Das habe ich erst auf der Übersicht bzw. auf der Abrechnung gesehen.
- Die Korrektur gilt auch für 2024 (vier bezahlte Abrechnungen werden zum Berichtigen vorgeschlagen). Das stimmt mit dem Hilfetext «gelten dann für alle Abrechnungen» überein. Mir war aber nicht bewusst, dass ich damit auch Vorjahre aufmache. Plausibel sind die vier 2024-Differenzen: Pro m² der Mieterwohnung sind es je rund CHF 1.125 (Hans Müller 75.5 m²: 72.55 Nachzahlung → 12.40 Rückerstattung = −84.95; Pierre Dubois 85 m²: −95.70; Anna Schmidt 92 m²: −103.50; Maria Rossi 120 m²: −135.00).
- Meine Nachrechnung für Hans Müller 2025: Die Fläche aller Wohnungen steigt von 492.5 auf 512.5 m². Der Flächenanteil sinkt von 15.33 % auf 14.73 %. Der Heizungsanteil (70 % Fläche / 30 % Einheit) sinkt von 15.73 % auf 15.31 %. Die Flächenpositionen sinken um CHF 57.15, die Heizung um CHF 29.14, und mit 3 % Verwaltungspauschale ergibt sich ein Saldo von etwa CHF 126.93, gerundet 126.95. Dwellos CHF 126.90 ist plausibel, siehe P-2.
- Der Dialog «Abrechnung berichtigen» (geöffnet und abgebrochen, keine Anfrage abgeschickt) ist klar: Er sagt, was ersetzt wird, was mit der bisherigen Abrechnung passiert, und verlangt «Bereits bezahlt». Er nennt «Vertragsdaten und Rechnungen» zum Korrigieren, aber nicht die Wohnung, die hier der Grund ist.
- In der Liste «Nebenkostenabrechnungen» hat Hans Müllers Zeile keinen Hinweis, dass die Abrechnung nicht mehr stimmt. Dort steht nur «Überfällig» und daneben der Knopf «Als bezahlt markieren».
- Die Übersicht meldet zusätzlich: «3 Entwürfe sind nicht aktuell», Musterhaus Zentrum 2025. Das ist folgerichtig.
- Verteilschlüssel: Das Erfassen war einfach. «Formel testen» rechnet richtig: Bei {area} + {rooms} * 10 erhalten 50 m²/2 Zimmer 70 von 485 Punkten, das sind 14.43 %. Der neue Schlüssel «Weber Fläche und Zimmer» steht danach mit «0 Rechnungen» in der Liste.
- Die Hilfe an der Formel beim Bearbeiten beantwortet meine Frage klar: «Ändern Sie die Formel nur, um einen Fehler zu korrigieren. Die neue Formel gilt dann für alle Abrechnungsperioden: Entwürfe rechnen nach «Neu berechnen» mit ihr, und versendete Abrechnungen, deren Saldo oder Position sich dadurch ändert, schlägt Dwello Ihnen zum Berichtigen vor. Soll ab einer Abrechnungsperiode ein anderer Verteilschlüssel gelten, erfassen Sie einen neuen …» Anders als bei der Wohnung fehlt hier der Satz, dass versendete Abrechnungen selbst unverändert bleiben. Auch wo Dwello das Berichtigen vorschlägt (Übersicht und Abrechnung), steht nicht da. Beim neuen Schlüssel fehlt dieser Teil zu Recht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 25 Schritte. Fläche korrigieren: 4 Schritte. Abrechnung und Übersicht lesen und nachrechnen: der grösste Teil. Verteilschlüssel: 6 Schritte.

## Ablauf

- Wohnung speichern. Erwartet: ein Hinweis, dass versendete Abrechnungen betroffen sein können. Gesehen: nur die Wohnungsseite mit 75 m², kein Hinweis.
- Abrechnung Hans Müller 2025. Erwartet: welche Änderung (Wohnung 3.02, Fläche) und welche Positionen sich ändern. Gesehen: ein gelber Hinweis mit allgemeinem Text und nur dem neuen Saldo «CHF 126.90 statt CHF 215.80».
- Übersicht. Erwartet: ein Eintrag für meine Abrechnung 2025. Gesehen: fünf Einträge, davon vier für schon bezahlte Abrechnungen 2024, alle mit demselben Text und ohne Beträge.
- «Mahnung senden» (Dialog nur geöffnet, mit Escape geschlossen, keine Anfrage abgeschickt). Erwartet: eine Warnung, dass die Abrechnung zu viel verlangt. Gesehen: «Hans Müller schuldet noch CHF 215.80.» ohne Warnung.

## Vorschläge

- **P-1:** Fläche der Wohnung 3.02 als Fehlerkorrektur ändern, dann die Abrechnung NK-11111111-2025-0001 öffnen und «Mahnung senden» klicken. Der Dialog nennt CHF 215.80. Hilfreich wäre: Im Mahnungsdialog (und in der Frist auf der Übersicht) sagen, dass die Neuberechnung CHF 126.90 ergibt und dass zuerst berichtigt werden sollte. Oder das Mahnen erst nach dem Berichtigen anbieten.
- **P-2:** Gleicher Weg, dann den Hinweis auf der Abrechnung lesen. Hilfreich wäre: Nennen, was sich geändert hat («Wohnung 3.02: Fläche 55 m² → 75 m²»). Dazu die Positionen, deren Betrag sich ändert, mit altem und neuem Betrag, damit man nachrechnen kann.
- **P-3:** Gleicher Weg. Hilfreich wäre: Den Satz «Versendete Abrechnungen berichtigen Sie … auf der Abrechnung» auf der Abrechnung selbst weglassen, und nur die zutreffende Richtung nennen («eine tiefere Nachzahlung»).
- **P-4:** Gleicher Weg, dann die Übersicht öffnen. Hilfreich wäre: Die Einträge pro Gebäude zusammenfassen oder zu jedem Eintrag Betrag und Richtung nennen («verlangt CHF 88.90 zu viel»), damit man sieht, wo man zu viel verlangt hat.

## Nicht geprüft

- Berichtigen, Mahnen und Ablehnen habe ich nicht ausgeführt, weil die Aufgabe das untersagt. Die beiden Dialoge habe ich nur geöffnet, mit blockierten schreibenden Anfragen (es wurde keine abgeschickt), und wieder geschlossen.
- Das PDF der Abrechnung habe ich nicht angesehen, weil es nicht Teil der Aufgabe war.
- Ob die 5 Rappen Differenz (P-2) eine Rundungsfrage sind, konnte ich ohne Aufschlüsselung der Neuberechnung nicht klären.
- Wie sich eine gespeicherte Formeländerung auswirkt, habe ich nicht geprüft, weil die Aufgabe untersagt, sie zu speichern.
