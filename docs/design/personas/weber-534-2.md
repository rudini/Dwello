# Persona-Bericht: Dr. Weber, Runde 534-2 (Nachprüfung P-1, P-2, P-3, P-7)

Desktop 1440 × 900, Maus. App http://localhost:3300, frische Demodaten, gespeichert nur in «Musterhaus Zentrum» (NK-11111111-2025-0004, Maria Rossi). Skripte und Screenshots: `/tmp/weber-534-2/`.

Stand der Befunde aus `weber-534.md`:

- **P-1 behoben.** Unter «Dokumente» (Alle und Zu versenden) steht bei keinem Brief der Abrechnung mehr «Zahlungsfrist der Mahnung». Das gilt für den ersten Brief, das neue PDF und die erneute Zustellung.
- **P-2 behoben.** «Als versendet markieren» öffnet jetzt eine Bestätigung mit «Abbrechen». Danach kommt eine Meldung, die genau sagt, was gilt. P-4 ist damit ebenfalls behoben (Einleitungstext und Dialog unterscheiden Mahnung und neues PDF).
- **P-3 nicht behoben (teilweise).** Die Reihenfolge der Versände stimmt jetzt. Aber «PDF erstellt 31.10.2026, 16:01» verschwindet wieder aus dem Verlauf, sobald ich die Bemerkung speichere. Ein Eintrag für das neue PDF erscheint nicht. Der Verlauf wird also immer noch nachträglich geändert (P-1 unten).
- **P-7 behoben.** Der Verlauf sagt «Erneut versendet per Brief».

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-…-0004, Verlauf | (Rest von P-3 aus Runde 534.) Nach dem Versand per Brief stand im Verlauf «PDF erstellt 31.10.2026, 16:01». Nach dem Speichern der Bemerkung ist dieser Eintrag weg, und für das neue PDF kommt keiner hinzu. Am Schluss steht nur noch: Erstellt 16:00, Versendet per Brief, Neues PDF versendet per Brief, Erneut versendet per Brief. Der Verlauf gibt also nicht mehr wieder, was ich vorher auf dem Bildschirm gesehen habe. Ein Protokoll, das Einträge verliert, kann ich im Streit nicht vorlegen. |
| P-2 | Minor | Dokumente (Alle / Zu versenden) nach «Erneut per Brief zustellen» | Zwei Einträge heissen gleich: «Nebenkostenabrechnung · NK-11111111-2025-0004, An Maria Rossi, erstellt am 31.10.2026, per Brief, Versendet». Der obere (erneute Zustellung) enthält die Bemerkung «Ratenzahlung …», der untere (erster Brief) nicht. Unterscheiden kann ich sie nur an der Position in der Liste. Ein Versanddatum steht bei keinem Eintrag. Wer den falschen ausdruckt, schickt der Mieterin das PDF ohne die vereinbarte Ratenzahlung. |

## Beobachtungen

- Die Bestätigung in «Dokumente» nennt beide Fälle («Eine Mahnung trägt danach …; das neue PDF einer Abrechnung behält …»), obwohl Dwello weiss, dass es um eine Abrechnung geht. Die Meldung danach ist dagegen genau und klar: «Das neue PDF bleibt, wie es ist: Abrechnungsdatum und Zahlungsfrist ändern sich nicht. Drucken Sie es jetzt aus …», mit Link «PDF herunterladen». Sehr gut.
- Die Bestätigung «Erneut per Brief zustellen» hat weiterhin keinen Link zum PDF (P-6 aus Runde 534). Die Meldung danach sagt aber jetzt, wo es liegt: «(«Versendetes PDF herunterladen» im Verlauf)». Das heruntergeladene PDF enthält die Bemerkung und ist byte-gleich mit dem obersten Eintrag unter «Dokumente».
- Im Verlauf stehen alle Brief-Versände nur mit Datum, ohne Uhrzeit. «Erstellt» hat eine Uhrzeit. Die Reihenfolge am selben Tag kann ich so nur aus der Position ablesen.
- Nach dem Speichern der Bemerkung stehen oben weiterhin «PDF erstellen» und «PDF auf Italienisch» neben dem Hauptknopf «Als bezahlt markieren» (P-5 aus Runde 534, nicht Teil dieser Prüfung).
- Der Dateiname des neuen PDF lautet weiterhin «Conteggio spese accessorie, nuovo PDF NK-….pdf».
- Abrechnungsdatum 31.10.2026 und Zahlungsfrist 30.11.2026 blieben bei allen Schritten gleich, wie angekündigt (alles am selben Tag).

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 9 Skripte, rund 10 Klicks in der App.

## Ablauf

- Rossi nach dem Speichern der Bemerkung: Ich erwartete, dass «PDF erstellt 16:01» im Verlauf bleibt und ein zweiter Eintrag für das neue PDF dazukommt. Ich sah nur «Erstellt 16:00» und «Versendet per Brief 31.10.2026» (P-1).
- Verlauf nach dem Markieren des neuen PDF: Ich erwartete «PDF erstellt 16:01, Versendet per Brief, PDF erstellt (neu), Neues PDF versendet per Brief». Ich sah «Erstellt, Versendet per Brief, Neues PDF versendet per Brief», ohne einen Eintrag «PDF erstellt» (P-1). Die Reihenfolge selbst stimmt.
- «Dokumente» nach der erneuten Zustellung: Ich erwartete einen Eintrag, der als erneute Zustellung erkennbar ist. Ich sah zwei gleich lautende Einträge «Nebenkostenabrechnung · NK-11111111-2025-0004» (P-2).

## Vorschläge

- **P-1:** NK-11111111-2025-0004 per Brief versenden. Im Verlauf steht «PDF erstellt …». Dann «Frist und Bemerkungen bearbeiten», eine Bemerkung speichern: der Eintrag fehlt. Den Verlauf nur ergänzen: den Eintrag des ersten PDF stehen lassen und für das neue PDF einen eigenen Eintrag («Neues PDF erstellt», mit Uhrzeit) anfügen.
- **P-2:** Wie oben, neues PDF unter «Dokumente» als versendet markieren, dann auf der Abrechnung «Erneut per Brief zustellen» bestätigen, «Dokumente» öffnen. Den Eintrag der erneuten Zustellung benennen («Nebenkostenabrechnung, erneut zugestellt» oder ähnlich) und bei jedem versendeten Eintrag das Versanddatum zeigen.

## Nicht geprüft

- **Erneute Zustellung an einem späteren Tag:** Die Uhr des Servers kann ich nicht verstellen. Ob das Abrechnungsdatum und die Zahlungsfrist dann neu gesetzt werden, bleibt offen. Am selben Tag blieben sie (31.10.2026 / 30.11.2026).
- **Knopf «Neues PDF als versendet markieren» auf der Abrechnung:** Ich bin wie verlangt über «Dokumente» gegangen. Danach war der Knopf weg.
- **Meldung nach dem ersten Versand per Brief (P-8 aus Runde 534):** Mein Skript hat sie nicht erfasst. Sie war nicht Teil dieser Prüfung.
