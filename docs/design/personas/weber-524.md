# Dr. Weber – Bemerkung und Zahlungsfrist einer versendeten Abrechnung (524)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Abrechnung NK-11111111-2025-0001 (Hans Müller, Musterhaus Zentrum, Wohnung 1.01), Status zu Beginn «Überfällig», Zahlungsfrist 28.10.2026, versendet am 28.09.2026.
Skripte und Screenshots: `/tmp/claude/weber-524/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-11111111-2025-0001 (nach dem Neuladen bzw. später) | Der Hinweis «Im versendeten PDF steht die bisherige Zahlungsfrist. Damit der Mieter die neue kennt, erstellen Sie das neue PDF und senden Sie es ihm.» steht nur, solange die Adresse `?pdf-change=…` trägt. Nach dem Neuladen zeigt die Seite nur «PDF herunterladen», Status «Versendet» und im Verlauf «PDF erstellt 31.10.2026, 11:44 / Versendet 28.09.2026». Nichts sagt mir mehr, dass Hans das neue PDF noch nicht hat. Auch in der Liste (Filter «Versendet») und unter «Dokumente → Zu versenden» steht nichts. Ich kann auch nirgends festhalten, dass ich das neue PDF versendet habe. Komme ich in zwei Wochen zurück, weiss ich nicht mehr, welche Fassung Hans hat. |
| P-2 | Major | Abrechnung NK-11111111-2025-0001, «PDF herunterladen» | Das PDF, das Hans am 28.09.2026 erhalten hat, kann ich nach dem Speichern nicht mehr herunterladen. Nach «PDF erstellen» liefert «PDF herunterladen» nur die neue Fassung (gleicher Dateiname `NK-11111111-2025-0001.pdf`). Vor dem ersten Speichern habe ich die alte Fassung zum Glück selbst gesichert; ohne diese Sicherung könnte ich bei einem Streit nicht belegen, was Hans erhalten hat. |
| P-3 | Minor | Abrechnung, Verlauf | Die Reihenfolge im Verlauf ist «Erstellt 31.10.2026, 11:41 – PDF erstellt 31.10.2026, 11:44 – Versendet 28.09.2026». Wer von oben nach unten liest, meint, das am 31.10. erstellte PDF sei versendet worden. Hans hat aber die Fassung vom 28.09. erhalten. Die Änderungen (Bemerkung, Frist von 28.10. auf 27.11.2026) erscheinen im Verlauf gar nicht. |
| P-4 | Minor | Neues PDF (Seite 1) | Das neue PDF trägt dasselbe Briefdatum «Zürich, 28.09.2026», dieselbe Abrechnungsnummer und dasselbe Abrechnungsdatum wie das alte. Nichts zeigt, dass es eine neuere Fassung ist und die vom 28.09. ersetzt. Hans hat dann zwei Briefe mit gleichem Datum und zwei verschiedenen Fristen (28.10. und 27.11.2026). Welche gilt, sieht er nicht. |
| P-5 | Minor | Abrechnung bearbeiten | Hilfetext zur Bemerkung: «Die Bemerkung steht im PDF, das der Mieter erhält.» Bei einer bereits versendeten Abrechnung stimmt das so nicht: Hans hat sein PDF schon, und dort steht die Bemerkung nicht. Erst nach dem Speichern erfahre ich, dass ein neues PDF nötig ist. Ein Hinweis schon auf der Bearbeitungsseite («Diese Abrechnung ist versendet. Was Sie ändern, steht erst im neuen PDF.») würde helfen. |
| P-6 | Minor | Abrechnung, direkt nach «PDF erstellen» | Nach dem Klick auf «PDF erstellen» steht weiterhin «… erstellen Sie das neue PDF und senden Sie es ihm.», obwohl das PDF schon erstellt ist (Screenshot 09). Ich habe mich gefragt, ob das Erstellen geklappt hat. |

## Beobachtungen

- Hinweis nach dem Speichern der Bemerkung: «Die neue Bemerkung steht nur im neuen PDF. Soll der Mieter sie lesen, erstellen Sie das neue PDF und senden Sie es ihm.» Das ist sachlich richtig und nicht überzogen. Es heisst nicht, die Abrechnung sei ungültig, und auch nicht, Hans habe etwas «erhalten».
- Hinweis nach der Fristverlängerung: «Im versendeten PDF steht die bisherige Zahlungsfrist. Damit der Mieter die neue kennt, …». Auch das ist richtig. Juristisch Falsches oder Überzogenes habe ich in keinem Hinweis gefunden.
- Nach dem Speichern wird aus «PDF herunterladen» der Knopf «PDF erstellen» (mit «PDF auf Deutsch»). Das ist folgerichtig, verstärkt aber P-2: Die alte Fassung ist danach im UI weg.
- Nach dem Verlängern der Frist wechselte der Status von «Überfällig» auf «Versendet», und «Mahnung senden» verschwand. Das ist richtig, denn die Frist läuft erst am 27.11.2026 ab.
- Vergleich der PDFs (Text mit `pdftotext`): Alt und neu unterscheiden sich genau an zwei Stellen. «Bitte bezahlen Sie den Betrag bis 28.10.2026» wurde zu «… bis 27.11.2026», und unter «Hinweise» steht neu als erste Zeile «Ratenzahlung vereinbart: Die Nachzahlung von CHF 215.80 wird in zwei Raten bezahlt.». Beträge, Positionen und Rechtshinweise sind unverändert. Das entspricht meiner Erwartung.
- Die Bemerkung steht unter der Überschrift «Hinweise», direkt vor den Rechtshinweisen (Art. 257b OR, Art. 8 VMWG). Dort gehört eine persönliche Absprache eigentlich nicht hin. Als eigener Abschnitt «Bemerkung» wäre sie besser von den Rechtshinweisen getrennt.
- Der QR-Zahlteil lautet weiter auf den ganzen Betrag von CHF 215.80. Bei Ratenzahlung muss Hans den Betrag selbst ändern. Das ist kein Fehler, aber für die vereinbarte Ratenzahlung unpraktisch.
- Der Text zur Kostenaufstellung auf der Bearbeitungsseite spricht von «Neu berechnen auf der Seite des Entwurfs» und vom Löschen des Entwurfs. Bei einer versendeten Abrechnung passt das nicht; zuständig ist hier «Abrechnung berichtigen».
- Schon vor meiner Änderung stand im Verlauf «PDF erstellt 31.10.2026, 11:41» unter «Versendet 28.09.2026». Laut Verlauf ist das PDF also nach dem Versand erstellt worden. Das stammt aus den Demodaten und war vor meiner Arbeit schon so.

## Aufgabe geschafft: teilweise

Bemerkung und Frist sind gespeichert, und das neue PDF ist erstellt und geprüft. Welche Fassung Hans hat, weiss ich nur, weil ich die alte vorher selbst gesichert habe. Nach dem Neuladen sagt Dwello mir nicht mehr, dass ich ihm das neue PDF noch senden muss (P-1, P-2).

## Aufwand

Etwa 12 Minuten, 9 Skriptläufe: Abrechnung öffnen, 2 × bearbeiten und speichern, PDF erstellen, 3 PDFs vergleichen, Liste, Dokumente und Mieterseite durchsuchen.

## Ablauf

- Erwartet: Die Bearbeitungsseite warnt, dass die Abrechnung schon versendet ist. Gesehen: nur «Die Bemerkung steht im PDF, das der Mieter erhält.» (P-5).
- Erwartet: Nach dem Speichern komme ich weiterhin an das PDF, das Hans hat. Gesehen: «PDF herunterladen» ist durch «PDF erstellen» ersetzt; die alte Fassung ist nirgends mehr (P-2).
- Erwartet: Der Hinweis zum neuen PDF bleibt, bis ich es versendet habe. Gesehen: Nach dem Neuladen ist er weg (P-1).
- Erwartet: Nach «PDF erstellen» verschwindet der Hinweis «erstellen Sie das neue PDF» oder ändert sich zu «senden Sie es». Gesehen: Er bleibt unverändert (P-6).
- Erwartet: Das neue PDF ist als neue Fassung erkennbar. Gesehen: Datum und Nummer sind gleich wie beim alten (P-4).

## Vorschläge

- **P-1:** Abrechnung NK-11111111-2025-0001 öffnen, «Frist und Bemerkungen bearbeiten», Frist ändern, speichern, «PDF erstellen», Seite neu laden: Der Hinweis fehlt. Hilfreich wäre ein dauerhafter Zustand «Neues PDF noch nicht versendet» auf der Abrechnung, in der Liste und unter «Dokumente → Zu versenden», dazu eine Aktion «Neues PDF als versendet markieren».
- **P-2:** Wie P-1, danach «PDF herunterladen»: Es kommt nur die neue Fassung. Hilfreich wäre, das versendete PDF aufzubewahren und im Verlauf herunterladbar zu machen, etwa «Versendet 28.09.2026 – PDF ansehen».
- **P-3:** Den Verlauf zeitlich ordnen und die Änderungen eintragen, z. B. «Zahlungsfrist geändert: 28.10.2026 → 27.11.2026» und «Bemerkung geändert». Bei «Versendet» sollte stehen, welche Fassung versendet wurde.
- **P-4:** Das neue PDF öffnen: Es trägt «Zürich, 28.09.2026». Hilfreich wäre das Datum der neuen Fassung oder ein Satz wie «Diese Fassung ersetzt die Abrechnung vom 28.09.2026. Neue Zahlungsfrist: 27.11.2026.»
- **P-5:** «Frist und Bemerkungen bearbeiten» bei einer versendeten Abrechnung öffnen. Hilfreich wäre ein Hinweis oben: «Diese Abrechnung ist versendet. Was Sie hier ändern, steht erst im neuen PDF; der Mieter hat die bisherige Fassung.»
- **P-6:** Nach dem Speichern «PDF erstellen» klicken. Danach sollte der Hinweis lauten: «Das neue PDF ist erstellt. Senden Sie es dem Mieter.»

## Nicht geprüft

- Wie es für einen Benutzer nach dem ersten Speichern (nur Bemerkung) weitergeht: Ich habe die PDF-Adresse direkt abgerufen, um die alte Fassung zu sichern, und damit selbst ein neues PDF erzeugt. Danach stand wieder «PDF herunterladen». Den Weg über «PDF erstellen» habe ich deshalb erst nach der zweiten Änderung über die Oberfläche gemacht.
- Versand per E-Mail: Hans ist auf «Per Brief» eingestellt. Einen Knopf «Versenden» für das neue PDF habe ich nicht gefunden.
- Den Inhalt des QR-Codes habe ich nicht dekodiert, sondern nur den Text des Zahlteils verglichen (unverändert).
- «Abrechnung berichtigen» habe ich nicht benutzt, weil es nicht zur Aufgabe gehört.
