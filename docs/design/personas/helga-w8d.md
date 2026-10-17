# Helga – Abrechnungen versenden (w8d)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Stichprobe bei 200 %), Maus. App: http://localhost:3300, Demodaten, Deutsch. Gespeichert nur in «Musterhaus Zentrum» (Anna Schmidt) und «Seepark Residenz» (Thomas Weber).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/a03dd604-a526-53bc-afb7-d81a674ad4a0/scratchpad/persona-helga/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Dialog «Abrechnung als versendet markieren» (nach «Per Brief zustellen») | Ich habe «Per Brief zustellen» gewählt, aber der Dialog zeigt «Korrespondenzkanal: Per E-Mail, thomas.weber@abgewiesen.dwello.test». Keine Postadresse, an die ich den Brief schicken soll. Ich weiss nicht, ob Dwello jetzt doch wieder eine E-Mail schickt. |
| P-2 | Major | Mieter Thomas Weber, «Dokumente»; Abrechnung, «Verlauf» | Nach der Zustellung per Brief steht bei Thomas Weber «Noch keine Dokumente». Bei Anna Schmidt steht die Abrechnung dort, mit «per E-Mail · Versendet». Im Verlauf steht nur «Versendet 17.10.2026», ohne «per Brief». Ich kann nirgends sehen, wie Thomas seine Abrechnung bekommen hat. |
| P-3 | Minor | Abrechnung Thomas Weber nach dem Neuladen | Die Warnung «Abrechnung nicht versendet» ist nach dem Neuladen weg. Der Verlauf zeigt keinen Fehlversuch, nur «PDF erstellt» hat eine neue Uhrzeit. Wenn ich die Seite schliesse, weiss ich später nicht mehr, dass die E-Mail nicht angekommen ist. |
| P-4 | Minor | Übersicht, «Fristen»; Dialog «Abrechnung per E-Mail senden» | Bei einer Rückerstattung steht «16.11.2026 Zahlungsfrist · Anna Schmidt». Der Dialog spricht auch von «Zahlungsfrist». Für mich klingt das, als müsse Anna zahlen. Dabei schulde ich ihr CHF 6.50. Nur auf der Abrechnung steht richtig «Rückerstattung bis». |
| P-5 | Minor | Knopf «Per Brief zustellen», danach Dialog «Abrechnung als versendet markieren» | Der Knopf verspricht, dass Dwello den Brief zustellt. Erst im Dialog steht «Dwello verschickt die Abrechnung nicht selbst». Es fehlt der Hinweis, das PDF auszudrucken und an die Adresse des Mieters zu schicken. |
| P-6 | Nit | Dialoge «Abrechnung per E-Mail senden» und «… als versendet markieren» | Dort steht, dass Dwello «die Zahlungsfrist ab diesem Tag» rechnet. Das Datum (16.11.2026) oder die Anzahl Tage steht nicht dabei. Ich muss nach dem Senden nachschauen. |
| P-7 | Nit | Abrechnung, «Verlauf» | «Versendet 17.10.2026» steht ohne Uhrzeit. «Erstellt» und «PDF erstellt» haben eine Uhrzeit. |

## Beobachtungen

- Bei 150 % ist in der Tabelle «Kostenaufstellung» die Spalte «Betrag» abgeschnitten. Die Tabelle lässt sich nur seitlich verschieben (Screenshot `03-anna-detail.png`, rechter Rand). Bei 200 % hat die Seite selbst keinen seitlichen Bildlauf (scrollWidth 720 = Fensterbreite).
- Unter «Mietstage in der Abrechnungsperiode» steht «Ihr Mietverhältnis in dieser Periode». Ich bin aber die Vermieterin, nicht die Mieterin. Das «Ihr» verwirrt mich.
- Bei Rückerstattungen zeigt die Seite «Als bezahlt markieren» als Hauptknopf. Ich verstehe nicht, ob damit «ich habe zurückbezahlt» gemeint ist.
- Die Warnung nach der abgewiesenen E-Mail rät: «Prüfen Sie die E-Mail-Adresse beim Mieter». Nach der Zustellung per Brief bleibt bei Thomas aber «Korrespondenzkanal: Per E-Mail» mit der abgewiesenen Adresse stehen. Nächstes Jahr geht es wohl wieder schief. Dwello erinnert mich nicht daran.
- Auf der Abrechnung liegen zwei leere Statusbereiche (im Barrierefreiheitsbaum `status` ohne Inhalt). Auf dem Bildschirm sieht man nichts davon.
- Beim Markieren als versendet hat die Seite zweimal an `?/send` gesendet: einmal den gewollten neuen E-Mail-Versuch, einmal das Markieren. Beide Male kam 200 zurück.
- In der Liste «Versendet» stehen weder das Versanddatum noch die Frist. Dafür muss ich jede Abrechnung öffnen.

## Aufgabe geschafft: ja

Beide Abrechnungen haben jetzt den Status «Versendet». Anna per E-Mail, Thomas nach der abgewiesenen E-Mail per Brief (als versendet markiert). Ob Thomas den Brief wirklich bekommt, liegt bei mir. Die App kann das nicht wissen und sagt das auch.

## Aufwand

Etwa 10 Minuten. Anna: Übersicht → «Entwürfe ansehen» → Anna Schmidt → «Per E-Mail senden» → bestätigen (4 Klicks), dann zum Nachschauen Mieterseite (1 Klick). Thomas: Abrechnung öffnen → «Per E-Mail senden» → bestätigen → Warnung → «Per Brief zustellen» → «PDF ansehen» → «Als versendet markieren» (6 Klicks). Dazu habe ich die Mieterseite, die Liste «Versendet» und die Übersicht angeschaut.

## Ablauf

1. **Übersicht** (`01-dashboard.png`). Erwartet: einen Hinweis auf die Abrechnungen. Gesehen: «Abrechnungen prüfen und versenden – 7 Nebenkostenabrechnungen sind noch im Entwurf» mit «Entwürfe ansehen». Gut, so finde ich den Weg.
2. **Liste Entwurf** (`02-entwuerfe.png`). Anna Schmidt, NK-11111111-2025-0002, «Rückerstattung CHF 6.50». Aha: Anna muss gar nichts zahlen, ich zahle ihr zurück. Dann ist die Frage «bis wann muss sie zahlen» eigentlich falsch gestellt.
3. **Abrechnung Anna** (`03-anna-detail.png`). Oben «Per E-Mail senden», Status «Entwurf». Unter «Zahlung» steht: «Sie erstatten dem Mieter CHF 6.50 zurück. Rückerstattung bis 16.11.2026.» Das ist klar. Die lange Tabelle ist bei meiner Schriftgrösse rechts abgeschnitten.
4. **Dialog «Abrechnung per E-Mail senden»** (`04-anna-send-a.png`). Erwartet: eine Rückfrage. Gesehen: Empfänger, E-Mail-Adresse, «PDF ansehen» und die Erklärung, dass die Abrechnung unter «Dokumente» abgelegt wird und die Frist ab heute läuft. Gut verständlich. Ich hätte gern das neue Fristdatum gleich hier gesehen (P-6). Wo «Dokumente» ist, weiss ich noch nicht.
5. **Bestätigt** (`05-anna-sent-b.png`). Meldung «Abrechnung per E-Mail versendet», Status «Versendet», im Verlauf «Versendet 17.10.2026». Frist weiterhin «Rückerstattung bis 16.11.2026». Beruhigend. Der Hauptknopf heisst jetzt «Als bezahlt markieren», das passt für mich nicht zu einer Rückerstattung.
6. **Wo sehe ich, dass es raus ist?** Auf der Abrechnung (Status, Verlauf), in der Liste «Versendet» und auf der Mieterseite unter «Dokumente» (`07-anna-mieterin.png`): «Nebenkostenabrechnung · NK-11111111-2025-0002 – 17.10.2026 · per E-Mail · Versendet». Das ist gut, dort steht sogar der Weg. Auf der Übersicht steht unter Fristen «16.11.2026 Zahlungsfrist · Anna Schmidt in 30 Tagen». Da erschrecke ich kurz, als ob Anna zahlen müsste (P-4).
7. **Abrechnung Thomas**, «Per E-Mail senden» (`08-thomas-send-a.png`). Der Dialog zeigt thomas.weber@abgewiesen.dwello.test. Als Laie merke ich an der Adresse nichts. Ich bestätige.
8. **Fehler** (`09-thomas-sent-b.png`). Gelbe Warnung «Abrechnung nicht versendet. Die E-Mail wurde nicht zugestellt. Prüfen Sie die E-Mail-Adresse beim Mieter und senden Sie die Abrechnung erneut, oder stellen Sie sie per Brief zu.» und der Knopf «Per Brief zustellen». Klar und nicht beängstigend: Ich weiss, was passiert ist und was ich tun kann. Status bleibt «Entwurf». Eine richtige Adresse kenne ich nicht, also wähle ich den Brief.
9. **Zwischendurch neu geladen** (`10-thomas-reload.png`). Die Warnung ist weg, der Verlauf zeigt keinen Fehlversuch (P-3).
10. **Wieder senden, Fehler, dann «Per Brief zustellen»** (`11-thomas-brief-a-top.png`). Erwartet: Dwello druckt oder schickt einen Brief, oder sagt mir, an welche Adresse. Gesehen: Titel «Abrechnung als versendet markieren», «Dwello verschickt die Abrechnung nicht selbst …», darunter «Korrespondenzkanal: Per E-Mail, thomas.weber@abgewiesen…». Das widerspricht sich (P-1). Die Postadresse fehlt, ich müsste sie auf der Mieterseite suchen. «PDF ansehen» öffnet das PDF (inline, 200). Den Hinweis «Stellen Sie das PDF deshalb am selben Tag zu» verstehe ich: heute zur Post.
11. **«Als versendet markieren»** (`12-thomas-markiert-b.png`). Meldung «Abrechnung als versendet markiert», Status «Versendet», «Rückerstattung bis 16.11.2026», im Verlauf «Versendet 17.10.2026». Dass es ein Brief war, steht nirgends.
12. **Mieterseite Thomas** (`13-thomas-mieter.png`). Erwartet: die Abrechnung unter «Dokumente» wie bei Anna. Gesehen: «Noch keine Dokumente.» Und weiterhin «Korrespondenzkanal: Per E-Mail» (P-2).
13. **Liste Versendet** (`14-versendet.png`) und **Übersicht** (`15-dashboard-danach.png`): Beide stehen dort, die Fristen 16.11.2026 für Thomas und Anna als «Zahlungsfrist».
14. **200 %** (`16-thomas-200.png`): Kopf, Knöpfe und Status gut lesbar, kein seitlicher Bildlauf.

## Verwirrung

- «Zahlungsfrist» bei einer Rückerstattung: Wer zahlt wem? (P-4)
- «Per Brief zustellen» gegenüber «Als versendet markieren»: Macht Dwello etwas oder ich? (P-5)
- «Korrespondenzkanal» ist für mich ein schwieriges Wort. Im Brief-Dialog steht dort sogar «Per E-Mail» (P-1).
- «Dokumente»: Der E-Mail-Dialog nennt den Ort, sagt aber nicht, dass er auf der Seite des Mieters ist.
- «Als bezahlt markieren» bei einer Rückerstattung.
- «Ihr Mietverhältnis in dieser Periode» auf meiner Vermieterseite.

## Fehlerrisiken

- Ich markiere als versendet und vergesse den Brief: Dwello rechnet die Frist trotzdem ab heute. Der Dialog warnt immerhin «am selben Tag».
- Ich schicke den Brief an die falsche Adresse, weil der Dialog keine Postadresse zeigt.
- Nächstes Jahr schlägt die E-Mail an Thomas wieder fehl, weil die falsche Adresse und der Kanal «Per E-Mail» stehen bleiben.
- Lade ich die Seite nach dem Fehler neu, ist der Hinweis weg. Ich könnte meinen, es sei nichts passiert, oder es einfach vergessen.
- Später (z. B. bei Streit) kann ich nicht belegen, dass und wie Thomas die Abrechnung bekommen hat: kein Dokument, kein Weg im Verlauf.

## Vorschläge

- **P-1:** Abrechnung Thomas Weber (Seepark Residenz) → «Per E-Mail senden» → bestätigen → «Per Brief zustellen». Der Dialog zeigt «Korrespondenzkanal: Per E-Mail, …». Hilfreich wäre: «Zustellung: per Brief an Thomas Weber, Seeweg 15, 6003 Luzern», ohne E-Mail-Adresse.
- **P-2:** Nach P-1 «Als versendet markieren» → Mieterseite Thomas Weber → «Dokumente: Noch keine Dokumente». Hilfreich wäre: die Abrechnung auch hier mit «per Brief · Versendet» ablegen, und im Verlauf «Versendet per Brief, 17.10.2026» (bzw. «per E-Mail an …»).
- **P-3:** E-Mail-Versand an die abgewiesene Adresse → Seite neu laden → Warnung weg. Hilfreich wäre: einen Eintrag «E-Mail nicht zugestellt, 17.10.2026» im Verlauf und den Hinweis mit «Per Brief zustellen» behalten, solange die Abrechnung im Entwurf ist.
- **P-4:** Anna Schmidt senden → Übersicht → «Fristen». Dort steht «Zahlungsfrist · Anna Schmidt». Hilfreich wäre bei einer Rückerstattung «Rückerstattung an Anna Schmidt bis 16.11.2026», auch im Dialogtext.
- **P-5:** Knopf «Per Brief zustellen» in der Warnung. Hilfreich wäre ein Dialogtext in dieser Reihenfolge: «1. PDF ausdrucken. 2. Per Post an … schicken. 3. Hier als versendet markieren.» Oder den Knopf «Per Brief zustellen (selbst)» nennen.
- **P-6:** Im Sende-Dialog: «Frist: 16.11.2026 (30 Tage ab heute)».
- **P-7:** Im Verlauf bei «Versendet» die Uhrzeit wie bei den anderen Einträgen zeigen.

## Nicht geprüft

- Den Inhalt der PDFs (Datum, Frist, Adresse auf dem PDF) habe ich nicht gelesen. Ich habe nur geprüft, dass «PDF ansehen» ein PDF liefert. Das ist Sache von Dr. Weber und vom Daten-Prüfer.
- Ob die E-Mail an Anna wirklich ankommt: Ich sehe nur die Meldung von Dwello, ein Postfach habe ich nicht.
- Die E-Mail-Adresse bei Thomas korrigieren und neu senden: Die Aufgabe sagt, ich soll tun, was die App sagt. Eine richtige Adresse kenne ich nicht. Deshalb habe ich den Brief gewählt.
- Die Warnung bei 200 % Zoom: Thomas war schon versendet, und ich wollte keinen weiteren Datensatz verändern.
- «Als bezahlt markieren» habe ich nicht gedrückt, das war nicht Teil der Aufgabe.
