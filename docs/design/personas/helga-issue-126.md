# Persona-Lauf: Helga, Issue #126 (Meldung bei nicht zugestellter Mahnung)

Persona: Helga, 68, wenig Computererfahrung, braucht grosse Schrift, unsicher bei Fachbegriffen.
Ansicht: Desktop 1280 px Fensterbreite bei 150 % Zoom (853 × 600 CSS-Pixel), Maus, Deutsch; einmal Französisch über das Sprachmenü.
App: Persona-Stack (http://localhost:3300, Datenbank `dwello_persona`), vom Aufrufer gestartet.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-126/`.

Bewertet wird nur die neue Meldung «Die E-Mail wurde nicht zugestellt. …» und wo sie erscheint.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dokumente, Mieter Hans Müller (Karte «Dokumente») | Die Meldung sagt «senden Sie die Mahnung erneut», aber an diesen beiden Orten gibt es keinen Knopf dafür und keinen Link zur Abrechnung. Ich weiss nicht, wo ich «erneut senden» kann. |
| P-2 | Minor | Dokumente | «Prüfen Sie die E-Mail-Adresse des Mieters»: In der Liste steht «An Hans Müller» nur als Text, ohne Link zum Mieter. Ich müsste selbst über das Menü zu «Mieter» und dort Hans Müller suchen. |
| P-3 | Nit | Dokumente, Mieter, Abrechnung | Die Meldung nennt nicht, an welche Adresse die E-Mail ging. Zum «Prüfen» müsste ich sie vergleichen können (z. B. «an hans.mueller@example.ch»). |

## Beobachtungen

- Die Meldung erscheint an drei Orten gleich: in der Liste «Dokumente», in der Karte «Dokumente» auf der Mieterseite und im Abschnitt «Mahnungen» auf der Abrechnung. Sie steht in brauner Schrift direkt unter dem Status «Zu versenden» (Warnsymbol). Der Text selbst trägt die Bedeutung, nicht nur die Farbe.
- Kein englischer Text des Mailservers mehr zu sehen, weder auf Deutsch noch auf Französisch.
- Die Übersicht (Dashboard) zeigt unter «Briefe verschicken» nur «1 Brief ist zum Versand bereit», ohne Hinweis, dass eine E-Mail nicht ankam. Wer nur die Übersicht anschaut, merkt den Fehler nicht.
- Übersicht: «1 Brief ist zum Versand bereit. Drucken Sie sie aus, schicken Sie sie per Post …»: «sie» (Mehrzahl) passt nicht zu einem einzigen Brief.
- Nachdem ich die Zahlungsfrist geändert hatte, war auf der Abrechnung «PDF herunterladen» weg und dafür «PDF erstellen» da; im Verlauf fehlte die Zeile «PDF erstellt». Es gab keinen Hinweis, warum.
- Der Dialog heisst «Mahnung senden», der Knopf darin «Zahlungserinnerung senden». Zwei Wörter für dieselbe Sache haben mich kurz unsicher gemacht.
- Der Dialog «Mahnung senden» sagt «Drucken Sie den Brief aus und schicken Sie ihn per Post», der Knopf heisst aber «… senden». Ich dachte erst, Dwello verschickt etwas.
- Auf der Mieterseite steht beim Hochladen «Choose File» / «No file chosen» auf Englisch.
- Bei der simulierten Mahnung steht «per Brief» direkt neben «Die E-Mail wurde nicht zugestellt». Das ist widersprüchlich, kommt aber von der Simulation: Hans Müller hat den Korrespondenzkanal «Per Brief», und die SQL-Änderung hat nur Status und Fehler gesetzt (siehe «Nicht geprüft»).

## Aufgabe geschafft: ja

Ich habe die Meldung an allen drei Orten gefunden und verstanden, was passiert ist. Was ich danach tun soll, verstehe ich im Prinzip; wo ich «erneut senden» kann, musste ich aber selbst suchen (P-1).

## Aufwand

Etwa 15 Minuten, 12 Schritte: Übersicht, Abrechnung, Frist ändern und speichern, Mahnung senden (2 Klicks), Fehler per SQL setzen, Übersicht, Menü → Dokumente, Mieterseite, Abrechnung, Sprachmenü → Français, drei Seiten auf Französisch.

## Ablauf

1. **Übersicht.** Erwartet: die überfällige Abrechnung 2025 von Hans Müller. Gesehen: unter «Fristen» «28.10.2026 Zahlungsfrist · Hans Müller in 13 Tagen»; «0 Überfällig». Die Abrechnung ist versendet, aber **nicht überfällig** (heute ist der 15.10.2026).
2. **Abrechnung NK-11111111-2025-0001.** Erwartet: «Mahnung senden». Gesehen: Status «Versendet», nur «PDF herunterladen» und «Als bezahlt markieren», kein «Mahnung senden». Keine andere Abrechnung ist überfällig (0 Überfällig, 1 Versendet).
3. **Frist ändern.** Damit ich überhaupt mahnen kann, habe ich über «Frist und Bemerkungen bearbeiten» die Zahlungsfrist auf 30.09.2026 gesetzt und «Änderungen speichern» geklickt (Gebäude Musterhaus Zentrum, Hans Müller). Gesehen: Status «Überfällig», Knopf «Mahnung senden».
4. **Mahnung senden.** Erwartet: Dwello schickt eine E-Mail. Gesehen: Dialog «Mahnung senden», Text: Dwello erstellt die Zahlungserinnerung als PDF, ich soll sie ausdrucken und per Post schicken; «Hans Müller schuldet noch CHF 215.80». Nach «Zahlungserinnerung senden» kam «Mahnung erstellt. Zahlungserinnerung liegt als Brief zum Ausdrucken in den Dokumenten bereit.» und ein Abschnitt «Mahnungen» mit «Zu versenden».
5. **Fehler simulieren.** Per SQL beim Dokument meiner Mahnung (id `421220b9-…`, das neueste Dokument, von mir erstellt) Status `to_send`, `sent_at` leer und `delivery_error = 'Can't send mail - all recipients were rejected: 550 5.1.1 User unknown'` gesetzt. Ich habe die id genommen statt «das neueste», damit ich sicher nichts anderes treffe.
6. **Übersicht.** Erwartet: ein Hinweis, dass etwas schiefging. Gesehen: «Briefe verschicken: 1 Brief ist zum Versand bereit …», kein Wort zur E-Mail (siehe Beobachtungen).
7. **Menü → Dokumente** (Bild `09-dokumente.png`). Erwartet: die englische Servermeldung sollte nicht mehr erscheinen. Gesehen: Zeile «Zahlungserinnerung · NK-11111111-2025-0001», «An Hans Müller, erstellt am 15.10.2026, per Brief», gelbes Etikett mit Warnsymbol «Zu versenden», darunter in brauner Schrift: «Die E-Mail wurde nicht zugestellt. Prüfen Sie die E-Mail-Adresse des Mieters und senden Sie die Mahnung erneut, oder drucken Sie den Brief aus.» Rechts «Als versendet markieren» und «PDF herunterladen». Kein englischer Text. Gut lesbar, auch bei 150 %. Aber: kein Weg zum erneuten Senden und kein Link zu Hans Müller (P-1, P-2).
8. **Mieterseite Hans Müller** (Bild `10-mieter.png`). Erwartet: dieselbe Meldung bei den Dokumenten. Gesehen: Karte «Dokumente», «15.10.2026 · per Brief · Zu versenden», dieselbe Meldung in brauner Schrift, «PDF herunterladen». Oben in «Kontaktdaten» steht die E-Mail-Adresse hans.mueller@example.ch und es gibt «Bearbeiten». Hier kann ich die Adresse prüfen und ändern. «Erneut senden» gibt es hier nicht (P-1).
9. **Abrechnung** (Bild `11-statement-after.png`). Im Abschnitt «Mahnungen» dieselbe Meldung. Hier gibt es oben auch den Knopf «Mahnung senden»: Das ist der einzige Ort, an dem ich «erneut senden» tatsächlich kann.
10. **Französisch über das Sprachmenü** (Bilder `12-documents-fr.png`, `13-tenant-fr.png`). Gesehen: «L’e-mail n’a pas été distribué. Vérifiez l’adresse e-mail du locataire, puis renvoyez le rappel ou imprimez la lettre.» an allen drei Orten (Documents, Mieterseite, «Rappels» auf der Abrechnung). Kein Deutsch, kein Englisch in der Meldung. Danach zurück auf Deutsch gestellt.

## Verwirrung

- «senden Sie die Mahnung erneut»: Wo? Auf der Seite, auf der ich gerade bin, gibt es nur «Als versendet markieren» und «PDF herunterladen». Den Knopf «Mahnung senden» findet man nur auf der Abrechnung, und die ist von «Dokumente» aus nicht verlinkt.
- «Die E-Mail wurde nicht zugestellt»: verstanden. Ich weiss, dass die Mahnung nicht angekommen ist und dass Hans Müller sie also nicht hat. Das ist viel besser als ein englischer Fachtext.
- «Mahnung» und «Zahlungserinnerung» stehen nebeneinander (Titel der Zeile: «Zahlungserinnerung», Meldung: «Mahnung»). Ich nehme an, das ist dasselbe, sicher bin ich nicht.
- «oder drucken Sie den Brief aus»: verstanden; danach muss ich wohl «Als versendet markieren» klicken. Das steht oben im Einleitungstext der Seite «Dokumente», auf der Mieterseite aber nicht.

## Fehlerrisiken

- Ich drucke den Brief aus und vergesse «Als versendet markieren»; dann bleibt die Meldung stehen. (Auf der Mieterseite gibt es diesen Knopf gar nicht.)
- Ich sende die Mahnung auf der Abrechnung erneut, ohne vorher die Adresse beim Mieter zu korrigieren, weil die Meldung nicht zeigt, welche Adresse falsch war (P-3).
- Wer nur die Übersicht anschaut, sieht nicht, dass die E-Mail nicht ankam (Beobachtung).

## Vorschläge

- **P-1** Reproduktion: überfällige Abrechnung mahnen, beim Dokument einen Zustellfehler speichern, «Dokumente» oder Mieterseite öffnen. Die Meldung sagt «senden Sie die Mahnung erneut», es gibt dort aber keinen Knopf oder Link dafür. Hilfreich: ein Link «Zur Abrechnung» bei der Mahnung (oder die Abrechnungsnummer als Link), oder die Meldung sagt, wo: «… und senden Sie die Mahnung auf der Abrechnung erneut …».
- **P-2** Reproduktion: wie P-1, Seite «Dokumente». «An Hans Müller» ist kein Link. Hilfreich: Mietername als Link zur Mieterseite, wo E-Mail-Adresse und «Bearbeiten» stehen.
- **P-3** Reproduktion: wie P-1. Die Meldung nennt die verwendete Adresse nicht. Hilfreich: «Die E-Mail an hans.mueller@example.ch wurde nicht zugestellt.»

## Nicht geprüft

- Ein echter Zustellfehler durch einen Mailserver: Die Persona-App kann keinen Mailserver ablehnen lassen. Simuliert per SQL, wie vom Aufrufer vorgegeben.
- Die Mahnung in ihrem richtigen Zustand «per E-Mail»: Die demo-Abrechnung 2025 von Hans Müller war **nicht überfällig** (Zahlungsfrist 28.10.2026), und Hans Müller hat den Korrespondenzkanal «Per Brief». Ich habe die Frist auf 30.09.2026 gesetzt, damit «Mahnung senden» erscheint. Die Mahnung wurde dann als Brief erstellt; deshalb steht «per Brief» neben der E-Mail-Meldung. Wie die Zeile bei einer echten E-Mail-Mahnung aussieht (Kanal, Knöpfe), konnte ich nicht sehen.
- Italienisch und Englisch, andere Zoomstufen (200 %), Mobilansicht: nicht verlangt.
- Was nach «Als versendet markieren» mit der Meldung passiert: nicht geklickt, um den simulierten Zustand für andere Prüfungen nicht zu verändern.
