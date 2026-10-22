# Persona-Review #459 Slice B: Dr. Weber, «Mieter anonymisieren» und Datenschutzerklärung

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus, Deutsch. Nur angesehen, nichts gespeichert, Anonymisieren nicht bestätigt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/weber-459B/`.

| ID | Schwere | Bildschirm | Befund |
|----|---------|------------|--------|
| P-1 | Minor | Mieter Sarah Meier, Box «Mieter anonymisieren»; Datenschutz «Aufbewahrung» | Die 10-Jahres-Frist zählt nur Vertragsende, versendete Abrechnung und Mahnung, nicht den Zahlungseingang. Bei Sarah Meier: Abrechnung 2024 «Versendet 01.03.2015», «Bezahlt am 05.05.2025». Trotzdem bietet Dwello das Anonymisieren an («Seit dem Ende des Jahres 2015 sind 10 Jahre vergangen»). Der Zahlungseingang ist ein Buchungsbeleg des Jahres 2025 (Art. 958f OR: aufbewahren bis Ende 2035). |
| P-2 | Minor | Bestätigungsdialog; Datenschutz «Aufbewahrung» | Was bleibt, ist unvollständig beschrieben: Genannt ist nur «Die Beträge der Abrechnungen bleiben». Nicht genannt sind Mietverträge (Wohnung, Mietdauer, Miete), Mahnungen, Zahlungen, Abrechnungsnummern und der Entwurf, den es bei Sarah Meier noch gibt. Über Wohnung und Mietdauer kann der Vermieter die Person weiter erkennen. «Anonymisieren» verspricht also mehr, als im Sinn des DSG geschieht. |
| P-3 | Minor | Mieter Sarah Meier, Hilfetext der Box | «Damals endete der letzte Mietvertrag oder ging die letzte Abrechnung oder Mahnung an Sarah Meier» nennt nicht, welches Ereignis massgeblich war. Ihr Vertrag endete aber 2014, nicht 2015. Als Vermieter kann ich die Frist so nicht nachprüfen. |
| P-4 | Nit | Datenschutz «Aufbewahrung» | Der neue Satz ist sehr lang und verschachtelt: «Ist ein Mieter ehemalig» ist holprig, und «das Letzte davon» bezieht sich grammatisch auf die Aufzählung im Satz davor (Abrechnungen, Mahnungen, Mieter, Mietverträge). Erst die Klammer klärt das. |
| P-5 | Nit | Mieter Sarah Meier, Box | Die Box nennt die Folge (was entfernt wird, endgültig) erst im Dialog, nicht im Hilfetext. Ein Hinweis, vorher «Daten exportieren» zu nutzen, fehlt. |

## Beobachtungen

- Hans Müller (laufender Mietvertrag seit 01.03.2021): Es gibt weder eine Box noch einen Knopf noch irgendeinen Text mit «anonymis…». Das ist richtig so.
- Der Dialog «Sarah Meier anonymisieren?» sagt «endgültig entfernt». Die Unumkehrbarkeit ist also klar. Die Knöpfe heissen «Abbrechen» und «Mieter anonymisieren». «Abbrechen» schliesst den Dialog, und die Seite bleibt unverändert.
- Der Hinweis «Läuft noch eine Betreibung oder ein Verfahren, warten Sie damit.» ist gut und juristisch richtig. In der Datenschutzerklärung fehlt er, für die Information der Mieter braucht es ihn dort aber nicht.
- Die Frist ist für alle Vermieter gleich 10 Jahre. Ein Privatvermieter, der nicht buchführungspflichtig ist, könnte nach Art. 6 Abs. 4 DSG unter Umständen früher anonymisieren müssen. Für 10 Jahre sprechen aber die Nachsteuerfrist (Art. 152 DBG) und die 10-jährige Verjährung (Art. 127 OR). Das ist vertretbar und eine Produktentscheidung, kein Befund.
- Die Daten von Sarah Meier sind in sich widersprüchlich: Vertrag bis 30.06.2014, aber eine bezahlte Abrechnung für die Periode 2024, versendet am 01.03.2015 (also vor der Periode), und ein Entwurf für 01.01.–30.06.2025. Das kommt vermutlich von der Testvorbereitung und zählt nicht als Befund. P-1 zeigt sich aber gerade an diesen Daten.
- Die Datenschutzerklärung sagt nicht, ob Sicherungskopien des Betreibers oder versendete E-Mails (beim Mail-Anbieter) vom Anonymisieren erfasst sind. Dwello kann das nicht leisten. Ein Satz wie «In Sicherungskopien des Betreibers bleiben die Daten, bis diese überschrieben werden» würde der Informationspflicht (Art. 19 DSG) genügen.
- Der Satz «Nicht einzeln löschen lassen sich versendete Abrechnungen, alle Mahnungen sowie Mieter und Mietverträge, zu denen es Abrechnungen gibt.» ist verständlich und, soweit ich sehe, richtig.

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 5 Durchläufe. Schritt 2 war nach etwa 2 Minuten erledigt.

## Ablauf

1. Mieterliste geöffnet. Erwartet: Sarah Meier als ehemalige Mieterin. Gesehen: «Sarah Meier … Keine laufende Miete», alle anderen «Aktiv».
2. Sarah Meier geöffnet. Erwartet: eine Box mit Begründung der Frist. Gesehen: «Mieter anonymisieren» mit dem Text «Seit dem Ende des Jahres 2015 sind 10 Jahre vergangen: Damals endete der letzte Mietvertrag oder ging die letzte Abrechnung oder Mahnung an Sarah Meier. Läuft noch eine Betreibung oder ein Verfahren, warten Sie damit.» und dem Knopf «Mieter anonymisieren». Der Mietvertrag A2 ist «Beendet 01.08.2008 – 30.06.2014». Ich hätte erwartet, dass das massgebliche Ereignis genannt wird (P-3).
3. Knopf gedrückt. Erwartet: eine Bestätigung mit der realen Folge. Gesehen: Dialog «Sarah Meier anonymisieren?» mit dem Text «Name, Kontaktdaten und Dokumente von Sarah Meier werden endgültig entfernt. Die Beträge der Abrechnungen bleiben.» Was sonst bleibt, fehlt (P-2). Danach «Abbrechen» gedrückt: Der Dialog ist zu, nichts hat sich geändert.
4. Zur Kontrolle die Abrechnungen von Sarah Meier gesucht. Gefunden: NK-22222222-2024-0002, Bezahlt, versendet 01.03.2015, bezahlt am 05.05.2025, und NK-22222222-2025-0002 als Entwurf. Der Zahlungseingang 2025 liegt innerhalb der Aufbewahrungsfrist (P-1).
5. Hans Müller geöffnet. Erwartet: keine Anonymisierung. Gesehen: keine (richtig).
6. /privacy, Abschnitt «Aufbewahrung». Gesehen: «Ausser in der öffentlichen Demo löscht Dwello keine gespeicherten Daten von selbst. […] Ist ein Mieter ehemalig und sind seit dem Ende des Jahres, in dem das Letzte davon geschah (sein letzter Mietvertrag endete, die letzte Abrechnung oder Mahnung ging an ihn), 10 Jahre vergangen, können Sie ihn anonymisieren: Dwello entfernt dann Name, Kontaktdaten und Dokumente; die Beträge der Abrechnungen bleiben.» Danach folgt der Absatz zu Art. 958f OR. Inhaltlich deckt sich das mit Box und Dialog. Es hat dieselbe Lücke bei Zahlungen (P-1) und bei dem, was bleibt (P-2), und ist schwer lesbar (P-4).

## Verwirrung

- «anonymisieren»: Juristisch heisst das, dass niemand die Person mehr erkennen kann. Hier bleiben Wohnung und Mietdauer, also ist es eher eine Pseudonymisierung.
- «das Letzte davon»: Worauf sich das bezieht, wird erst durch die Klammer klar.
- «Damals endete der letzte Mietvertrag oder …»: Das «oder» lässt offen, was 2015 tatsächlich geschah.
- «Beträge der Abrechnungen»: Gehören Zahlungen und Mahnbeträge dazu? Und der Entwurf?

## Fehlerrisiken

- Ein buchführungspflichtiger Vermieter anonymisiert, solange ein Zahlungseingang noch aufbewahrungspflichtig ist (P-1).
- Ein Vermieter sagt einem ehemaligen Mieter auf Grund der Datenschutzerklärung zu, seine Daten seien «anonym». Wohnung, Mietdauer und Beträge bleiben aber zuordenbar (P-2).
- Ein Entwurf (bei Sarah Meier für 2025) bleibt vielleicht ohne Namen stehen. Was mit Entwürfen geschieht, sagt Dwello nicht.

## Vorschläge

- **P-1:** Sarah Meier öffnen, die Box zeigt 2015. Dann unter Abrechnungen NK-22222222-2024-0002 öffnen: «Bezahlt am 05.05.2025». Hilfreich wäre, das Zahlungsdatum (und das Datum einer zurückgesetzten Zahlung) in das «letzte Ereignis» aufzunehmen, auch in der Datenschutzerklärung: «… die letzte Abrechnung oder Mahnung an ihn ging oder er zuletzt bezahlte …».
- **P-2:** Im Dialog bei Sarah Meier «Mieter anonymisieren» drücken. Hilfreich wäre die Ergänzung: «Mietverträge, Abrechnungen, Mahnungen und Zahlungen bleiben mit Wohnung, Zeitraum und Beträgen, aber ohne Namen.» In der Datenschutzerklärung dasselbe, dazu ein Satz zu Sicherungskopien und Entwürfen.
- **P-3:** Sarah Meier öffnen. Hilfreich wäre, das tatsächliche Ereignis mit Datum zu nennen, etwa «Am 01.03.2015 ging die letzte Abrechnung an Sarah Meier. Seit Ende 2015 sind 10 Jahre vergangen.»
- **P-4:** /privacy, «Aufbewahrung». Den Satz teilen, etwa: «Ehemalige Mieter können Sie anonymisieren, wenn seit dem Ende des Jahres 10 Jahre vergangen sind, in dem ihr letzter Mietvertrag endete oder die letzte Abrechnung oder Mahnung an sie ging. Dwello entfernt dann …»
- **P-5:** Sarah Meier öffnen. Den Hilfetext ergänzen, etwa: «Dwello entfernt dabei Name, Kontaktdaten und Dokumente endgültig. Exportieren Sie die Daten vorher, wenn Sie sie noch brauchen.»

## Nicht geprüft

- Das Ergebnis des Anonymisierens (Liste, Abrechnungen, PDF, Protokoll danach): Laut Auftrag nicht bestätigt, das prüft eine andere Persona.
- Ob gespeicherte oder erzeugte Abrechnungs-PDFs nach dem Anonymisieren den Namen noch enthalten: aus demselben Grund nicht geprüft.
- Einen ehemaligen Mieter, dessen letztes Ereignis weniger als 10 Jahre zurückliegt: Die Demodaten enthalten keinen solchen Mieter.
- fr/it/en: nicht Teil des Auftrags.
