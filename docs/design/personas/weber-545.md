# Dr. Weber – Mahnung per Brief (#545)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Persona-App http://localhost:3300 (Demodaten), Stichtag 31.10.2026 (ein Samstag).
Aufgabe: Hans Müller (Musterhaus Zentrum, NK-11111111-2025-0001, Zahlungsfrist 28.10.2026, will Briefe per Post) von der Seite der Abrechnung aus mahnen; vor dem Versand prüfen, was Abrechnungsseite (Kasten «Zahlung») und Liste sagen; den Brief in «Dokumente» versenden; danach «Letzte Mahnung» / «Gemahnt am» und «Nächste Mahnung möglich ab» beurteilen, auch rechtlich.
Skripte und Screenshots: `/tmp/claude/weber-545/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-11111111-2025-0001, Abschnitt «Mahnungen» (vor dem Versand), ebenso «Dokumente» | Vor dem Versand zeigt die Seite «Zahlungsfrist der Mahnung: 10.11.2026», ohne zu sagen, dass das Datum nur vorläufig ist. Direkt darüber steht aber: «Erst dann trägt sie das Datum dieses Tages, und ihre Zahlungsfrist beginnt.» Bringe ich den Brief erst in drei Tagen zur Post, stimmt der 10.11.2026 nicht mehr. Ich lese das Datum als fest und notiere es mir womöglich als Frist. |
| P-2 | Minor | Abrechnung, Abschnitt «Mahnungen», Link «PDF herunterladen» (vor dem Versand), ebenso «Dokumente» | Den Brief kann man schon vor «Als versendet markieren» herunterladen. Das PDF trägt dann «Zürich, 31.10.2026» und «Bitte überweisen Sie den Betrag bis 10.11.2026», ohne Vermerk «Entwurf». Wer es gleich ausdruckt (das ist naheliegend) und erst später zur Post bringt, verschickt einen Brief mit falschem Datum und zu kurzer Frist. Die Reihenfolge steht zwar im Text, aber der Link widerspricht ihr. |
| P-3 | Minor | «Dokumente», Knopf «Als versendet markieren: Zahlungserinnerung an Hans Müller» | Der Klick speichert sofort: keine Rückfrage, und danach gibt es keinen Weg zurück (die Zeile zeigt nur noch «Versendet», es gibt keinen Knopf zum Rückgängigmachen). Gleichzeitig verlangt die App, dass man vor dem Gang zur Post markiert. Komme ich an diesem Tag doch nicht zur Post, sind Briefdatum und Frist falsch, und ich kann sie nicht korrigieren. Die Bestätigung sollte die Folge nennen: «Datum heute, Frist bis …». |
| P-4 | Minor | Abrechnung: Knopf «Mahnung senden», Dialog «Mahnung senden» mit Knopf «Zahlungserinnerung senden», Meldung «Mahnung erstellt», Dokument «Zahlungserinnerung» | Für dieselbe Sache gibt es zwei Begriffe (Mahnung / Zahlungserinnerung). Zudem heisst der Knopf «… senden», obwohl nichts versendet wird: Es wird nur ein PDF erstellt. Gleich neben dem Mieter steht seine E-Mail-Adresse (hans.mueller@example.ch), und ein Laie kann meinen, die Erinnerung sei schon per E-Mail weg. |
| P-5 | Minor | Abrechnung, Kasten «Zahlung»: «Letzte Mahnung 31.10.2026»; Liste: «Gemahnt am 31.10.2026» | Hier heisst dasselbe Datum zweimal verschieden. Ausserdem bedeutet «Letzte Mahnung» im Geschäftsverkehr üblicherweise die *letzte* Mahnung vor der Betreibung. Neben «Nächste Mahnung möglich ab» lese ich darin einen Widerspruch. «Gemahnt am» (wie in der Liste) wäre eindeutig. |

## Beobachtungen

- Die Reihenfolge der Schritte war in allen Texten gleich und für mich nachvollziehbar: markieren am Tag des Postgangs, dann drucken, dann am selben Tag verschicken. Der Dialog gibt aber keinen Grund dafür an, warum man vor dem Drucken markiert. Den Grund erfährt man erst im Kasten «Zahlung» («Erst dann trägt sie das Datum dieses Tages …») und in «Dokumente» («Dwello setzt dann das heutige Datum und eine neue Zahlungsfrist ein»). Ohne Grund wirkt «als versendet markieren, bevor man versendet hat» zuerst verkehrt.
- Die Liste vor dem Versand zeigt «Überfällig Mahnung noch zu versenden». Das ist klar, und es nennt kein Datum, das falsch werden könnte. Gut.
- Nach dem Versand ist «Mahnung senden» auf der Abrechnung verschwunden, und «Nächste Mahnung möglich ab 11.11.2026» erklärt den Grund. Vor dem Versand war der Knopf noch da, obwohl eine Mahnung «Zu versenden» bereitlag. Ob ein zweiter Klick eine zweite Mahnung erzeugt, habe ich nicht ausprobiert.
- Rechtlich (OR 102 ff.): Die Zahlungsfrist in der Abrechnung hat der Vermieter einseitig gesetzt. Ob sie ein Verfalltag im Sinne von OR 102 Abs. 2 ist, ist zweifelhaft, also kommt der Mieter wohl erst durch die Mahnung in Verzug, mit deren Zugang. Die App behauptet nirgends «Verzug», sondern sagt «Überfällig» und «Zahlungsfrist … abgelaufen». Das ist sachlich vertretbar. Der Brief verlangt die Zahlung unmissverständlich mit Betrag und Datum («Bitte überweisen Sie den Betrag bis 10.11.2026») und genügt damit als Mahnung, auch wenn er «Zahlungserinnerung» heisst und freundlich formuliert ist («Möglicherweise haben Sie die Zahlung übersehen»). Er erwähnt keinen Verzugszins (OR 104). Für eine erste Erinnerung ist das in Ordnung.
- Die Frist von 10 Tagen ab Briefdatum ist plausibel. Mit B-Post (Postgang am Samstag, 31.10.) hat der Mieter real etwa 6 bis 8 Tage. Mit «Nächste Mahnung möglich ab 11.11.2026», einen Tag nach Fristende, kann sich eine zweite Mahnung mit einer Zahlung vom 10.11. kreuzen, die erst am 11. oder 12.11. gutgeschrieben wird. Ein paar Tage Puffer wären vorsichtiger.
- Kasten «Zahlung»: Der Satz «Der Mieter bezahlt die Nachzahlung von CHF 215.80.» klingt bei einer überfälligen Forderung, als hätte er schon bezahlt. «Der Mieter schuldet …» wäre genauer (der Dialog sagt richtig: «Hans Müller schuldet noch CHF 215.80.»).
- Die Übersicht («Fristen») zeigt nach dem Versand weiter nur «28.10.2026 Zahlungsfrist · Hans Müller seit 3 Tagen abgelaufen». Die neue Mahnfrist 10.11.2026 erscheint dort nicht.
- Der «Verlauf» der Abrechnung führt die Mahnung nicht auf. Zudem steht dort «Erstellt 31.10.2026, 09:14» vor «Versendet 28.09.2026». Das liegt vermutlich an den Demodaten, wirkt aber unlogisch.
- Die Mahnungszeile in «Dokumente» nennt nach dem Versand nur «erstellt am 31.10.2026» und «Versendet», aber kein Versanddatum.
- Brief-PDF: Absender, Empfänger, Betrag CHF 215.80, IBAN, QR-Referenz und Zahlteil passen zur Abrechnung. Das Feld «Zusätzliche Informationen» nennt die Abrechnungsnummer.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 11 Schritte: Übersicht, Liste, Abrechnung, Dialog, Erstellen, Liste, Dokumente, PDF ansehen, Markieren, PDF erneut, Abrechnung, Liste und Übersicht prüfen.

## Ablauf

- Abrechnung, Knopf «Mahnung senden». Erwartet: ein Dialog «Mahnung senden» mit Knopf «Mahnung senden». Gesehen: Der Dialogknopf heisst «Zahlungserinnerung senden» und versendet nichts, sondern legt ein PDF unter «Dokumente» ab (P-4).
- Abrechnung nach dem Erstellen. Erwartet: kein Fristdatum, solange der Brief nicht versendet ist (so steht es im Text darüber). Gesehen: «Zahlungsfrist der Mahnung: 10.11.2026» und ein PDF-Link (P-1, P-2).
- PDF vor dem Markieren. Erwartet: ein Entwurf ohne Datum oder mit einem Vermerk. Gesehen: ein fertiger Brief mit «Zürich, 31.10.2026» und der Frist 10.11.2026 (P-2).
- «Dokumente», «Als versendet markieren». Erwartet: eine Rückfrage mit dem Datum, das eingesetzt wird. Gesehen: sofort gespeichert, die Zeile zeigt «Versendet», kein Rückgängig (P-3).
- Abrechnung nach dem Versand. Erwartet: «Gemahnt am» wie in der Liste. Gesehen: «Letzte Mahnung 31.10.2026» (P-5). «Nächste Mahnung möglich ab 11.11.2026» entsprach der Erwartung.

## Vorschläge

- **P-1:** Abrechnung NK-11111111-2025-0001 → «Mahnung senden» → «Zahlungserinnerung senden». Im Abschnitt «Mahnungen» steht dann «Zahlungsfrist der Mahnung: 10.11.2026». Vorschlag: vor dem Versand kein festes Datum zeigen, sondern z. B. «Zahlungsfrist: 10 Tage ab Versanddatum» oder «bei Versand heute: 10.11.2026». Dasselbe gilt in «Dokumente».
- **P-2:** Gleicher Weg, dann «PDF herunterladen» beim Eintrag «Zu versenden». Vorschlag: das PDF erst nach «Als versendet markieren» anbieten, oder vorher als «Entwurf – nicht versenden» kennzeichnen.
- **P-3:** «Dokumente» → «Als versendet markieren: Zahlungserinnerung an Hans Müller». Vorschlag: eine Bestätigung mit der echten Folge («Der Brief erhält das Datum 31.10.2026 und die Zahlungsfrist 10.11.2026. Bringen Sie ihn heute zur Post.») oder ein Rückgängig am selben Tag.
- **P-4:** Abrechnung → «Mahnung senden». Vorschlag: einen Begriff durchgehend verwenden und das Verb ehrlich wählen, z. B. «Mahnung erstellen» bzw. «Zahlungserinnerung als Brief erstellen».
- **P-5:** Abrechnung nach dem Versand, Kasten «Zahlung». Vorschlag: «Gemahnt am» wie in der Liste, nicht «Letzte Mahnung».

## Nicht geprüft

- Ob sich Briefdatum und Frist tatsächlich verschieben, wenn man erst Tage nach dem Erstellen markiert: Erstellen und Markieren fielen auf denselben Tag (31.10.2026), und die Uhr der App kann ich nicht verstellen. Das PDF vor und nach dem Markieren trägt dieselben Daten (31.10./10.11.).
- Ob «Letzte Mahnung» das Erstell- oder das Versanddatum zeigt: Beide sind hier gleich.
- Eine zweite Mahnung vor dem 11.11.2026 und ein zweiter Klick auf «Mahnung senden», solange eine Mahnung «Zu versenden» bereitliegt: nicht versucht, um keine weiteren Datensätze anzulegen.
- Woher die App «per Brief» weiss (Einstellung beim Mieter): die Mieterseite nicht geöffnet.
