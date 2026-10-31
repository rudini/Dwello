# Dr. Weber – Mahnung nach Teilzahlung (#959)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Demodaten).
Aufgabe: Hans Müller (Musterhaus Zentrum) für den Rest der Abrechnung NK-11111111-2025-0001 mahnen (Abrechnung CHF 215.80, Teilzahlung CHF 50.00 erfasst, Zahlungsfrist 28.10.2026 abgelaufen), das Mahnungs-PDF juristisch prüfen.
Skripte und Screenshots: `/tmp/scratchpad/weber-959/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-11111111-2025-0001, Dialog «Mahnung senden» | Der Dialog bestätigt «Hans Müller schuldet noch **CHF 215.80**.» Das stimmt nicht: Offen sind nur noch CHF 165.80. Die Seite dahinter zeigt das richtig («Bezahlt: CHF 50.00, offen: CHF 165.80»), der Brief auch. Unmittelbar vor einem rechtlich erheblichen Schritt nennt mir die Bestätigung also einen Betrag, den ich nicht fordern darf. Ich musste erst das PDF öffnen, um zu sehen, dass der Brief richtig ist. Ein weniger misstrauischer Vermieter bricht hier ab oder glaubt, die Teilzahlung sei nicht berücksichtigt. |
| P-2 | Minor | Mahnungs-PDF, Seite 1 | «Haben Sie die Zahlung bereits geleistet, betrachten Sie dieses Schreiben als gegenstandslos.» Nach einer Teilzahlung ist das mehrdeutig. Herr Müller hat «eine Zahlung» geleistet (CHF 50.00) und könnte das Schreiben so als erledigt lesen. Richtig wäre: «Haben Sie den offenen Betrag von CHF 165.80 bereits bezahlt, …». |
| P-3 | Minor | Mahnungs-PDF, Seite 1 | Der Brief nennt drei Beträge (Abrechnung 215.80, bezahlt 50.00, offen 165.80) und dann: «Bitte überweisen Sie **den Betrag** bis 10.11.2026». Welcher Betrag gemeint ist, steht nicht da. Nur der Zahlteil klärt es (165.80). Für eine Mahnung im Sinne von Art. 102 OR sollte die Zahlungsaufforderung den geforderten Betrag selbst nennen. Ähnlich: «Möglicherweise haben Sie die Zahlung übersehen» passt nicht ganz zu einem Mieter, der schon teilweise bezahlt hat. |

## Beobachtungen

- Der Brief erfüllt inhaltlich, was ich verlange: «Betrag der Abrechnung: CHF 215.80 / Bereits bezahlt: CHF 50.00 / Offener Betrag: CHF 165.80». Der Zahlteil (Empfangsschein und Zahlteil) lautet auf CHF 165.80, mit derselben QR-Referenz `00 48083 73587 12063 18314 14928` wie die ursprüngliche Abrechnung. So lässt sich die Restzahlung derselben Forderung zuordnen.
- Zu Art. 69, 85, 88 OR: Mit der erfassten Teilzahlung hat der Vermieter sie angenommen (Art. 69). Der Brief fordert nur den Rest und bestätigt die CHF 50.00 ausdrücklich. Das kommt einer Quittung nahe (Art. 88). Da weder Verzugszins noch Mahngebühren verlangt werden, stellt sich die Anrechnungsfrage nach Art. 85 nicht: Die CHF 50.00 sind voll auf die Kapitalschuld angerechnet. Ich finde nichts rechtlich Falsches, nur die unscharfen Formulierungen in P-2 und P-3.
- Die Wörter wechseln: Der Knopf heisst «Mahnung senden», der Dialogtitel «Mahnung senden», der Bestätigungsknopf «Zahlungserinnerung senden», das Dokument «Zahlungserinnerung», die Liste «Mahnungen». Das ist kein Fehler, aber ich habe kurz überlegt, ob das zwei verschiedene Schreiben sind.
- Die Übersicht zeigt «Überfällige Beträge CHF 165.80». Das ist richtig, also nach Abzug der Teilzahlung.
- Der Text auf der Abrechnungsseite: «Der Mieter bezahlt die Nachzahlung von CHF 215.80.» Direkt darunter steht «Bezahlt: CHF 50.00, offen: CHF 165.80». Das ist zusammen verständlich.
- Das PDF lag schon vor «Als versendet markieren» mit dem heutigen Datum (31.10.2026) und der Frist 10.11.2026 vor. Nach dem Markieren war der Text unverändert, weil ich am selben Tag markiert habe. Die Abrechnungsseite zeigt danach «Letzte Mahnung 31.10.2026» und «Nächste Mahnung möglich ab 11.11.2026».
- Im Brieftext steht die IBAN ohne Leerzeichen (`CH4431999123000889012`), im Zahlteil in Vierergruppen. Das ist schlechter lesbar, aber nicht falsch.
- Der Zahlteil steht allein auf Seite 2, obwohl Seite 1 halb leer ist. Das ist zulässig, kostet aber ein zweites Blatt.

## Aufgabe geschafft: ja

Mahnung erstellt, PDF geprüft, als versendet markiert.

## Aufwand

Etwa 10 Minuten, 8 Schritte: Übersicht → Frist «Hans Müller» → Abrechnung → «Mahnung senden» → Dialog bestätigen → Dokumente → PDF herunterladen → «Als versendet markieren» mit Bestätigung.

## Ablauf

- Dialog «Mahnung senden». Erwartet: Bestätigung des offenen Betrags CHF 165.80. Gesehen: «Hans Müller schuldet noch CHF 215.80.» (Screenshot `04-mahnung-dialog.png`: Der Dialog liegt über der Seite, auf der im Kasten «Zahlung» gleichzeitig «offen: CHF 165.80» steht.)
- Mahnungs-PDF. Erwartet: eine Zahlungsaufforderung mit dem geforderten Betrag im Satz. Gesehen: «Bitte überweisen Sie den Betrag …» ohne Betrag und dazu die Gegenstandslos-Klausel, die nicht auf den Restbetrag eingeht.

## Vorschläge

- **P-1:** Abrechnung NK-11111111-2025-0001 öffnen (Teilzahlung CHF 50.00 erfasst) → «Mahnung senden». Der Dialog zeigt CHF 215.80. Er sollte den offenen Betrag nennen, wie der Brief: «Hans Müller schuldet noch CHF 165.80 (Abrechnung CHF 215.80, bezahlt CHF 50.00).»
- **P-2:** Mahnungs-PDF nach einer Teilzahlung öffnen. Die Klausel auf den Rest beziehen: «Haben Sie den offenen Betrag von CHF 165.80 inzwischen bezahlt, betrachten Sie dieses Schreiben als gegenstandslos.»
- **P-3:** Gleiches PDF. Den Betrag in die Aufforderung schreiben: «Bitte überweisen Sie den offenen Betrag von CHF 165.80 bis 10.11.2026 …». Bei einer Teilzahlung statt «Möglicherweise haben Sie die Zahlung übersehen» etwa: «Ein Teil ist noch nicht bezahlt.»

## Nicht geprüft

- Den Inhalt des QR-Codes selbst (Betrag, Referenz im Swiss Payments Code) habe ich nicht maschinell gelesen. In der Umgebung gab es keinen QR-Decoder (kein `zbarimg`, kein pyzbar oder OpenCV). Geprüft habe ich nur die gedruckten Felder des Zahlteils und des Empfangsscheins (CHF 165.80, Referenz wie in der Abrechnung). Die Beträge im Code gehören zum `daten-pruefer`.
- Ein Versand per E-Mail kam nicht in Frage, weil der Mieter Briefe erhält.
