# Dr. Weber – Slice 512: Abrechnungsperiode auf «Juli – Juni» umstellen

Desktop 1440 × 900, Maus. Persona-App http://localhost:3300 (Demodaten). Heute laut App: 28.10.2026.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/weber-512/`.

Ich habe bisher alle Gebäude nach Kalenderjahr abgerechnet. In Dwello liegen für Seepark Residenz die Abrechnungen 2024 (bezahlt) und 2025 (Entwurf) vor, beide 01.01.–31.12. Für Alpenblick liegt 2024 vor, 2025 fehlt noch. Am 28.10.2026 stelle ich die Einstellung «Abrechnungsperiode» auf «Juli – Juni» um und gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Übersicht, Mietvertrag Laura Keller (Alpenblick) | Dwello teilt nach der Umstellung auch das Jahr 2025 neu ein, das am Tag der Umstellung längst abgelaufen war und das ich nach Kalenderjahr abgerechnet hätte: Statt «2025» stehen jetzt «01.01.2025 – 30.06.2025» (kurze Periode) und «01.07.2025 – 30.06.2026». 2022 und 2023 bleiben dagegen Kalenderjahre. Ob ein vergangenes Jahr als Kalenderjahr bleibt, hängt also nur davon ab, ob davor oder danach schon eine Abrechnung in Dwello liegt, nicht vom Datum meiner Umstellung. Das führt zu einer rückwirkenden Umstellung, die laut Dwellos eigenem Hinweis (Art. 269d OR) nicht zulässig ist. |
| P-2 | Minor | Mietvertrag Thomas Weber | Die einzige Schaltfläche zum Übergang ist «Kurze Abrechnungsperiode 01.01.2026 – 30.06.2026 abrechnen». Diese Periode ist am Tag der Umstellung (28.10.2026) schon vorbei. Der Hinweis darunter sagt aber, die Änderung gelte frühestens ab dem nächstmöglichen Kündigungstermin und bis dahin rechne ich nach dem Mietvertrag ab, also nach Kalenderjahr: 2026 wäre dann noch gar nicht fällig. Schaltfläche und Hinweis widersprechen sich. Wer nur die Schaltfläche liest, rechnet eine nicht vereinbarte kurze Periode ab. |
| P-3 | Minor | Mietvertrag Thomas Weber | Der Rechtshinweis (Art. 269d OR) steht zwischen der Schaltfläche für die kurze Periode und den Schaltflächen «2023 abrechnen» / «2022 abrechnen». Er liest sich wie eine Einleitung zu 2023 und 2022, obwohl er nur den Übergang betrifft. |
| P-4 | Minor | Mietvertrag Thomas Weber | Vor der Umstellung stand im Hinweis «Haben Sie eine dieser Perioden ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein.» Nach der Umstellung fehlt dieser Satz, obwohl 2022 und 2023 weiterhin fehlen und genau für diese alten Jahre die Frage am meisten zählt. |
| P-5 | Minor | Mietvertrag Thomas Weber, Mietvertrag Laura Keller | «Eine bestehende Abrechnung deckt nur einen Teil der Abrechnungsperiode ab» nennt weder die Abrechnung (2025, 01.01.–31.12.2025) noch die Periode, die sie anschneidet (01.07.2025 – 30.06.2026). Ich musste in der Abrechnungsliste nachsehen, um den Satz nachzuvollziehen. |

## Beobachtungen

- Speichern in den Einstellungen klappte. Die Meldung «Einstellungen gespeichert – Absender, Verwaltungspauschale, Fristen und Vorschläge gespeichert.» erschien, nach dem Neuladen war «Juli – Juni» gewählt. Beim Speichern weist Dwello nicht darauf hin, dass sich damit die fehlenden Abrechnungen aller Gebäude neu einteilen, und auch nicht auf Art. 269d OR. Den Hinweis sehe ich erst auf dem Mietvertrag.
- Die Hilfe zur Einstellung sagt «Vorgeschlagen wird jeweils die letzte abgelaufene Periode». Dass die Einstellung auch die Liste «Noch nicht abgerechnet» auf der Übersicht und auf jedem Mietvertrag ändert, steht dort nicht.
- Übersicht, Seepark Residenz: Vorher «2023, 2022, 2021», nachher «01.01.2026 – 30.06.2026, 2023, 2022, 2021». 2022 und 2023 bleiben Kalenderjahre (01.01.–31.12., Links prüften `start=2022-01-01&end=2022-12-31`). So habe ich sie abgerechnet. Die Übersicht nennt die kurze Periode nicht «kurz» und hat keinen Rechtshinweis.
- Die Übersicht mischt Jahreszahlen («2023») und Datumsbereiche («01.01.2026 – 30.06.2026») in einer Liste. Das verstehe ich, aber es fällt auf.
- Die Schaltfläche «Rechnungen von … ansehen» auf der Übersicht zeigte vorher Alpenblick 2025, nachher Musterhaus Zentrum 01.01.2026 – 30.06.2026.
- Der Rechtshinweis selbst ist inhaltlich stimmig: Zustimmung der Mieter oder amtliches Formular, zehn Tage vor Beginn der Kündigungsfrist, frühestens auf den nächsten Kündigungstermin. Er ist gut lesbar.
- Thomas Weber: Vertragsbeginn 01.04.2022, die Schaltfläche «2022 abrechnen» öffnet aber den 01.01.–31.12.2022. Der Hinweis erklärt, dass der Assistent für alle Mietverträge des Gebäudes gilt. Das ist für mich nachvollziehbar.
- Der Assistent über «Kurze Abrechnungsperiode … abrechnen» springt direkt zu Schritt 3 («Gewählt: Seepark Residenz, Abrechnungsperiode 01.01.2026 – 30.06.2026»). Auch dort steht kein Hinweis, dass es eine kurze Periode für den Übergang ist. Ich habe nichts erstellt.
- Für Alpenblick listet der Mietvertrag Laura Keller zuerst «01.07.2025 – 30.06.2026», dann «Kurze Abrechnungsperiode 01.01.2025 – 30.06.2025»: absteigend wie 2023, 2022, aber die kurze Periode muss zeitlich zuerst kommen.

## Aufgabe geschafft: ja

Die Einstellung ist auf «Juli – Juni» umgestellt. Übersicht und Mietvertrag habe ich vorher und nachher geprüft. Ich habe keine Abrechnung erstellt.

## Aufwand

Etwa 15 Minuten, 8 Skriptläufe: Übersicht und Mietvertrag vorher, Einstellungen ansehen, Speichern, Übersicht und Mietvertrag nachher, Assistent ansehen, Gegenprobe Laura Keller.

## Ablauf

- Einstellungen, «Abrechnungsperiode». Erwartet: drei Optionsfelder. Gesehen: eine Auswahlliste. Das ging problemlos.
- Übersicht nach der Umstellung. Erwartet: Bei Seepark kommen nach den Jahren 2022 und 2023 neue Perioden ab meiner Umstellung dazu, und bereits abgelaufene Jahre bleiben Kalenderjahre. Gesehen: Bei Seepark ist das so, mit der kurzen Periode 01.01.2026 – 30.06.2026. Bei Alpenblick ist dagegen das schon abgelaufene Jahr 2025 in zwei Stücke geteilt (P-1).
- Mietvertrag Thomas Weber nach der Umstellung. Erwartet: derselbe Hinweis wie vorher, dazu eine Erklärung zum Übergang. Gesehen: Eine Erklärung und ein Rechtshinweis kommen dazu, aber der Satz zu «Abgerechnet bis» ist verschwunden (P-4). Der Rechtshinweis steht über 2023 und 2022 (P-3) und widerspricht der Schaltfläche für die kurze Periode (P-2).

## Vorschläge

- **P-1:** Einstellungen → «Abrechnungsperiode» auf «Juli – Juni» → speichern → Übersicht. Bei Alpenblick steht «01.07.2025 – 30.06.2026, 01.01.2025 – 30.06.2025, 2023, …». Mietvertrag Laura Keller zeigt dasselbe. Was helfen würde: Perioden, die vor dem Tag der Umstellung geendet haben (hier 2025), in der bisherigen Periode (Kalenderjahr) anzeigen. Oder beim Speichern fragen, ab wann die neue Periode gilt.
- **P-2:** Mietvertrag Thomas Weber nach der Umstellung → Schaltfläche «Kurze Abrechnungsperiode 01.01.2026 – 30.06.2026 abrechnen» mit dem Absatz darunter vergleichen. Was helfen würde: den Rechtshinweis vor die Schaltfläche stellen und sagen, dass die kurze Periode nur gilt, wenn die Mieter zugestimmt haben oder die Änderung schon wirksam ist. Sonst wäre nach dem Mietvertrag abzurechnen.
- **P-3:** Gleicher Bildschirm. Was helfen würde: Erklärung, Rechtshinweis und Schaltflächen der Übergangsperiode als eigenen Block, getrennt von den alten Jahren 2023 und 2022.
- **P-4:** Mietvertrag Thomas Weber vor und nach der Umstellung vergleichen. Was helfen würde: den Satz zu «Abgerechnet bis» weiterhin zeigen, solange alte Perioden fehlen.
- **P-5:** Gleicher Bildschirm. Was helfen würde: die Abrechnung und die angeschnittene Periode nennen, zum Beispiel «Die Abrechnung 01.01.2025 – 31.12.2025 deckt die Hälfte der Periode 01.07.2025 – 30.06.2026 ab. Für 01.01.2026 – 30.06.2026 fehlt noch eine Abrechnung.»

## Nicht geprüft

- Ich habe keine Abrechnung erstellt (laut Aufgabe). Ob der Assistent die kurze Periode korrekt berechnet, Akonto anteilig und Heizprofil über 6 Monate, ist offen.
- «November – Oktober» und das Zurückstellen auf «Kalenderjahr» habe ich nicht getestet. Die Einstellung bleibt auf «Juli – Juni».
- Musterhaus Zentrum habe ich nur auf der Übersicht gesehen, keinen Mietvertrag dort geöffnet.
