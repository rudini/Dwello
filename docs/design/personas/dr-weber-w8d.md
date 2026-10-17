# Persona-Review Dr. Weber: Nebenkostenabrechnung per E-Mail senden (w8d)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 (Persona-Stack, Deutsch). Nur angesehen, nichts gespeichert, den Versanddialog nicht bestätigt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/a03dd604-a526-53bc-afb7-d81a674ad4a0/scratchpad/persona-weber/`

Aufgabe: Bevor ich die neue Funktion «Per E-Mail senden» nutze, will ich genau wissen, was passiert und ob ich mich rechtlich darauf verlassen kann. Ich lese den Versanddialog der Abrechnung 2025 von Pierre Dubois (Musterhaus Zentrum), die Hilfe, die Datenschutzerklärung und die Dokumentenliste.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Versanddialog, Abrechnung bearbeiten, Hilfe | Der Dialog sagt «rechnet die Zahlungsfrist ab diesem Tag», nennt aber weder die Länge der Frist noch das Datum, das herauskommt. Gleichzeitig kann ich unter «Frist und Bemerkungen bearbeiten» ein festes Datum eintragen, und die Hilfe sagt «Zahlungsfrist und Bemerkung können Sie anpassen». Ob Dwello ein von mir gesetztes Datum beim Versand überschreibt, steht nirgends. |
| P-2 | Major | Hilfe, «Nebenkostenabrechnungen erstellen» | Beim Brief soll ich laut Hilfe «das PDF selbst zustellen und danach «Als versendet markieren»». Für Mahnungen und in «Dokumente» gilt genau das Umgekehrte: erst markieren, dann drucken, weil Dwello erst dann das Datum einsetzt. Die Vorschau datiert das PDF auf heute. Drucke ich heute und markiere morgen, stehen auf dem Papier ein anderes Abrechnungsdatum und eine andere Zahlungsfrist als in Dwello. |
| P-3 | Major | Dokumente, Verlauf der Abrechnung | Als Nachweis taugt der Eintrag wenig. «Dokumente» zeigt «An Anna Schmidt, erstellt am 17.10.2026, per E-Mail · Versendet»: kein Versanddatum mit Uhrzeit, keine Empfängeradresse. Der Verlauf der Abrechnung zeigt nur «Versendet 17.10.2026», ohne Kanal, Adresse und Link zum Dokument. Ändert der Mieter später seine E-Mail-Adresse, kann ich nicht mehr belegen, wohin die Abrechnung ging. |
| P-4 | Major | Datenschutz, «Weitergabe an Dritte» | «über den vom Betreiber eingerichteten Mailversand (eigener SMTP-Server oder Resend)»: Ich erfahre nicht, welcher der beiden Wege bei mir gilt. Bei Resend gehen Daten bis zur IBAN möglicherweise ins Ausland. Weder das Land noch die Rechtsgrundlage für die Übermittlung werden genannt. |
| P-5 | Minor | Versanddialog | Der Dialog sagt nicht, in welcher Sprache die Abrechnung geht. Die PDF-Vorschau für Pierre Dubois ist französisch («Décompte des charges»), weil beim Mieter «Sprache für Abrechnung und Mahnungen: Französisch» eingetragen ist. Auch Betreff und Text der E-Mail selbst bekomme ich nicht zu sehen. |
| P-6 | Minor | Versanddialog, Hilfe | Mit «Zahlungsfrist» ist an einer Stelle ein Datum gemeint, an einer anderen ein Zeitraum. Die Begriffserklärung in der Hilfe sagt «Das Datum, bis zu dem …», der Dialog «rechnet die Zahlungsfrist ab diesem Tag», die Hilfe «Ab dem Tag des Versands läuft die Zahlungsfrist». Ausserdem zählt der Text den Tag des Versands und nicht den Tag, an dem die Abrechnung beim Mieter ankommt. Ob das rechtlich genügt, wird nicht erklärt. |
| P-7 | Minor | Datenschutz, «Welche Daten Dwello speichert» | Die abgelegte Kopie der versendeten Abrechnung und den Versandeintrag (Empfänger, Kanal, Datum) erwähnt die Liste nicht. Dort stehen nur «Dokumente, die Sie zu Mietern hochladen» und «die erstellten Abrechnungen». |
| P-8 | Nit | Dokumente, Einleitung | «Mahnungen und andere Schreiben an Mieter sowie Dokumente, die Sie … hochgeladen haben»: Dass versendete Nebenkostenabrechnungen hier liegen, steht nicht da. Die Anleitung im zweiten Satz betrifft nur Briefe. |

## Beobachtungen

- Positiv: Der Versanddialog ist kurz und eindeutig. Er nennt den Empfänger («Pierre Dubois»), den Korrespondenzkanal mit Adresse («Per E-Mail, pierre.dubois@example.ch»), die Ablage unter «Dokumente» und die Regel zur Datierung. Mit «PDF ansehen (öffnet in neuem Tab)» kann ich vor dem Versand prüfen. «Abbrechen» und «Per E-Mail senden» sind klar getrennt.
- Der Entwurf zeigt schon «Zahlungsfrist 16.11.2026» und «Abrechnungsdatum 17.10.2026» (heute). Daraus schliesse ich, dass die Frist 30 Tage beträgt. Gesagt wird mir das nirgends.
- Die abgelegte PDF von Anna Schmidt (von einer anderen Persona versendet) trägt «Abrechnungsdatum 17.10.2026» und «Wir überweisen Ihnen den Betrag bis 16.11.2026». Das passt zum Verlauf «Versendet 17.10.2026».
- Die Abrechnung von Hans Müller (Demodaten) zeigt im Verlauf «Erstellt 17.10.2026, 03:21» nach «Versendet 28.09.2026». Chronologisch ist das unmöglich, es kommt wohl aus den Demodaten. Unter «Dokumente» erscheint sie nicht.
- Auf dem Entwurf von Dubois gibt es nur «Per E-Mail senden» und kein «Als versendet markieren». Bei Kanal E-Mail ist das folgerichtig. Ob ich die Abrechnung trotzdem per Einschreiben schicken kann, wenn ich einen Nachweis will, bleibt offen.
- Die Hilfe zu Mahnungen ist rechtlich sauber formuliert, besonders die Abgrenzung zu Art. 257d OR. Gerade daran gemessen fallen die ungenauen Fristformulierungen beim Versand auf.
- Die Datenschutzerklärung zählt die übermittelten Inhalte genau auf: Name, E-Mail-Adresse, Korrespondenzadresse, Wohnung, Mietdauer, Kosten und ihre Verteilung, Saldo, IBAN, Zahlungsreferenz. Das finde ich gut.
- Der ganzseitige Screenshot des Dialogs (`04-send-dialog.png`) dunkelt nur den sichtbaren Bereich ab. Das liegt am Screenshot, nicht an der App.

## Aufgabe geschafft: ja

Alle vier Texte habe ich gefunden und gelesen. Beantwortet sind meine Fragen aber nur teilweise (siehe P-1 bis P-4).

## Aufwand

Etwa 25 Minuten, rund 20 Schritte: Übersicht, Abrechnungsliste, Abrechnung Dubois, Dialog, PDF-Vorschau, «Frist und Bemerkungen bearbeiten» (nur angesehen), versendete Abrechnungen Müller und Schmidt, Hilfe, Datenschutz, Dokumente, Mieterseite Dubois.

## Ablauf

1. **Übersicht** (`01-dashboard.png`). Erwartet: ein Weg zu den Abrechnungen. Gesehen: «Abrechnungen prüfen und versenden: 7 Nebenkostenabrechnungen sind noch im Entwurf … stellen Sie sie den Mietern zu.» Passt.
2. **Nebenkostenabrechnungen** (`02-statements.png`). Pierre Dubois, NK-11111111-2025-0003, Wohnung 2.01, Nachzahlung CHF 142.35, Entwurf. Problemlos gefunden.
3. **Abrechnung Dubois** (`03-dubois.png`). Erwartet: Datum und Frist. Gesehen: «Zahlungsfrist 16.11.2026», «Abrechnungsdatum 17.10.2026», Hauptaktion «Per E-Mail senden». Dass dieses Datum beim Versand neu gesetzt wird, steht hier noch nicht.
4. **Versanddialog** (`04-send-dialog.png`, `04b-send-dialog-only.png`). Erwartet: was passiert, an wen, welches Datum, welche Frist. Gesehen: «Dwello sendet die Abrechnung als PDF per E-Mail an den Mieter und legt sie unter «Dokumente» ab. Dwello datiert die Abrechnung auf den Tag des Versands und rechnet die Zahlungsfrist ab diesem Tag.» Was passiert und wohin es geht, ist klar. Wie lange die Frist ist und welches Datum herauskommt, fehlt, ebenso, was mit einer von mir gesetzten Frist geschieht (P-1). Die Sprache des PDFs wird nicht genannt (P-5). Ich habe «Abbrechen» bzw. nichts gewählt, nicht gesendet.
5. **PDF-Vorschau** (`dubois-preview.pdf`). Erwartet: deutsche Abrechnung. Gesehen: französisch, «Date du décompte 17.10.2026», «Veuillez payer le montant jusqu'au 16.11.2026». Erst auf der Mieterseite fand ich den Grund: «Sprache für Abrechnung und Mahnungen: Französisch».
6. **Frist und Bemerkungen bearbeiten** (`05-frist-edit.png`, nur angesehen). Gesehen: Feld «Zahlungsfrist» mit «Bis zu diesem Datum bezahlt der Mieter die Nachzahlung», frei änderbar. Kein Hinweis, dass Dwello dieses Datum beim Versand neu berechnet (P-1).
7. **Versendete Abrechnungen** Müller (`06-mueller-sent.png`) und Schmidt (`10-schmidt-sent.png`). Erwartet: ein Versandnachweis im Verlauf. Gesehen: nur «Versendet 17.10.2026», ohne Kanal, Adresse und Uhrzeit (P-3).
8. **Hilfe** (`07-help.png`). Erwartet: der Weg einer Abrechnung zum Mieter. Gesehen: «Wünscht der Mieter Korrespondenz per E-Mail, sendet Dwello die Abrechnung mit «Per E-Mail senden» als PDF und legt sie unter «Dokumente» ab. Für einen Brief stellen Sie dem Mieter das PDF selbst zu und wählen danach «Als versendet markieren». Ab dem Tag des Versands läuft die Zahlungsfrist.» Die Reihenfolge beim Brief widerspricht der Regel für Mahnungen («Markieren Sie einen Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet, und drucken Sie ihn danach aus: Erst dann trägt er das Datum dieses Tages») (P-2).
9. **Datenschutz** (`08-privacy.png`). Erwartet: welche Daten an wen gehen. Gesehen: «Nebenkostenabrechnungen, Zahlungserinnerungen und Mahnungen per E-Mail werden über den vom Betreiber eingerichteten Mailversand zugestellt (eigener SMTP-Server oder Resend). Dabei werden Name und E-Mail-Adresse des Mieters sowie der Inhalt der Nachricht mit dem PDF im Anhang übermittelt; …» Was übermittelt wird, ist genau beschrieben. Den Empfänger nennt der Text nur als Entweder-oder, und es fehlt jeder Hinweis aufs Ausland (P-4).
10. **Dokumente** (`09-documents.png`). Erwartet: die abgelegte Abrechnung als Nachweis. Gesehen: «Nebenkostenabrechnung · NK-11111111-2025-0002, An Anna Schmidt, erstellt am 17.10.2026, per E-Mail, Versendet», mit «PDF herunterladen». Die PDF-Datei trägt das richtige Datum. Der Eintrag nennt aber «erstellt am» statt «versendet am» und keine Adresse (P-3). Eine Detailseite gibt es nicht: «Diese Seite gibt es nicht.»

## Verwirrung

- «Zahlungsfrist»: mal ein Datum, mal ein Zeitraum, der «läuft» (P-6). «Rückerstattung bis» auf der Abrechnung, im Dialog aber «Zahlungsfrist». Wie der Dialog bei einer Rückerstattung lautet, konnte ich nicht sehen.
- «Tag des Versands»: Ist das der Tag, an dem ich klicke, oder der Tag, an dem der Mailserver die Nachricht annimmt? Und rechtlich zählt doch der Zugang beim Mieter?
- «erstellt am» in «Dokumente» bei einem Eintrag mit dem Status «Versendet»: Welches Datum ist gemeint?
- «Betreiber»: Bin ich das selbst, oder ist das jemand anderes? Die Datenschutzerklärung sagt «des Betreibers dieser Dwello-Installation». Als Vermieter weiss ich nicht, ob ich SMTP oder Resend nutze.

## Fehlerrisiken

- Ich setze bewusst eine längere Frist (z. B. 31.12.2026) und sende per E-Mail. Überschreibt Dwello sie stillschweigend mit 30 Tagen, stimmen meine Absprache und die verschickte Abrechnung nicht überein (P-1).
- Beim Brief drucke ich nach der Hilfe zuerst und markiere später. Dann steht auf dem Papier ein anderes Datum und eine andere Frist als in Dwello, und Mahnungen richten sich nach der Frist in Dwello (P-2).
- Im Streit über den Zugang habe ich nur «Versendet 17.10.2026» ohne Adresse als Nachweis (P-3).
- Ein Mieter fragt nach, wohin seine Daten gegangen sind, und ich kann es nicht sagen (P-4).

## Vorschläge

- **P-1:** Abrechnung Dubois öffnen, «Per E-Mail senden» wählen, Dialog lesen. Danach «Frist und Bemerkungen bearbeiten» öffnen: Das Datum ist frei änderbar, ohne Hinweis. Hilfreich: Der Dialog nennt das konkrete Ergebnis, z. B. «Abrechnungsdatum: heute, 17.10.2026. Zahlungsfrist: 16.11.2026 (30 Tage).» Das Bearbeitungsformular und die Hilfe sagen klar, ob eine selbst gesetzte Frist beim Versand erhalten bleibt oder neu berechnet wird.
- **P-2:** Hilfe, Abschnitt «Nebenkostenabrechnungen erstellen», mit «Zahlungen und Mahnungen» und der Einleitung von «Dokumente» vergleichen. Hilfreich: für Abrechnungen per Brief dieselbe Reihenfolge wie bei Mahnungen («am Tag der Post als versendet markieren, danach drucken»), oder Dwello datiert das PDF erst beim Markieren und sagt das.
- **P-3:** «Dokumente» öffnen, Eintrag NK-11111111-2025-0002 lesen; Abrechnung Schmidt öffnen, Verlauf lesen. Hilfreich: «Versendet am 17.10.2026, 10:15, per E-Mail an anna.schmidt@example.ch» in «Dokumente» und im Verlauf, mit Link vom Verlauf zum abgelegten Dokument. Dazu ein Satz in der Hilfe, was das belegt (Versand, nicht Zugang).
- **P-4:** Datenschutz, «Weitergabe an Dritte» lesen. Hilfreich: den tatsächlich eingerichteten Mailversand nennen, und bei Resend Sitz und Land (Ausland) samt Grundlage der Übermittlung.
- **P-5:** Dialog bei Pierre Dubois öffnen, «PDF ansehen» wählen: Die Abrechnung ist französisch. Hilfreich: «Sprache: Französisch» unter «Korrespondenzkanal» im Dialog, dazu Betreff und Text der E-Mail.
- **P-6:** Hilfe, «Begriffe kurz erklärt», «Zahlungsfrist», mit dem Dialogtext vergleichen. Hilfreich: «Dwello setzt die Zahlungsfrist auf 30 Tage nach dem Versand» statt «rechnet die Frist ab diesem Tag», dazu ein Satz zum Zugang einer E-Mail.
- **P-7:** Datenschutz, «Welche Daten Dwello speichert» lesen. Hilfreich: «versendete Abrechnungen samt Versanddatum, Kanal und Empfängeradresse» ergänzen.
- **P-8:** «Dokumente» öffnen, Einleitung lesen. Hilfreich: «Versendete Nebenkostenabrechnungen, Mahnungen und andere Schreiben …».

## Nicht geprüft

- Den eigentlichen Versand: Laut Auftrag nichts bestätigt. Ob nach dem Klick eine Erfolgsmeldung kommt und welche, ob die Frist eines selbst gesetzten Datums überschrieben wird und was bei einem Fehler des Mailversands geschieht, habe ich nicht gesehen.
- Den Dialog bei einer Rückerstattung: Anna Schmidt war schon versendet, und andere Rückerstattungen liegen nicht in «Musterhaus Zentrum».
- Den Weg «Als versendet markieren» für einen Mieter mit Brief: Markieren wäre gespeichert worden.
- Die E-Mail selbst (Betreff, Text, Absender): In der App nicht sichtbar.
- Den Inhalt der Nutzungsbedingungen.
