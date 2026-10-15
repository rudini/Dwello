# Persona-Lauf: Helga, Issue #126, Runde 3 (Meldung bei nicht zugestellter Mahnung: «unter «Dokumente»»)

Persona: Helga, 68, wenig Computererfahrung, braucht grosse Schrift, unsicher bei Fachbegriffen.
Ansicht: Desktop 1280 px Fensterbreite bei 150 % Zoom (853 × 600 CSS-Pixel), Maus, Deutsch.
App: Persona-Stack (http://localhost:3300, frische Datenbank `dwello_persona`), vom Aufrufer gestartet.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-126-3/`.

Bewertet wird nur die geänderte Meldung «Die E-Mail wurde nicht zugestellt. Drucken Sie die Mahnung aus, schicken Sie sie per Post und markieren Sie sie danach unter «Dokumente» als versendet. Prüfen Sie für die nächste Mahnung die E-Mail-Adresse des Mieters.» und ob ich ihre Schritte von der Mieterseite und der Abrechnung aus erledigen kann.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieter Hans Müller, Karte «Dokumente» | Die Meldung steht in einer Karte, die selbst «Dokumente» heisst. «markieren Sie sie danach unter «Dokumente» als versendet» lese ich als «hier, in dieser Karte», aber hier gibt es nur «PDF herunterladen». Dass eine andere Seite «Dokumente» im Menü gemeint ist, sagt die Meldung nicht, und «Dokumente» ist kein Link. |
| P-2 | Nit | Abrechnung, Abschnitt «Mahnungen» | Hier ist die Angabe «unter «Dokumente»» eindeutig und hilft: Im Menü (☰) steht unter «Nebenkosten» der Eintrag «Dokumente», ich habe ihn gefunden. Ein Link direkt bei der Meldung würde mir den Umweg über das Menü ersparen; ohne ihn muss ich wissen, dass sich hinter den drei Strichen oben links das Menü versteckt. |
| P-3 | Nit | Dokumente | Auf der Seite «Dokumente» selbst sagt die Meldung immer noch «markieren Sie sie danach unter «Dokumente» als versendet», obwohl ich schon dort bin und der Knopf «Als versendet markieren» direkt daneben steht. Ich habe mich kurz gefragt, ob es noch ein anderes «Dokumente» gibt. |

## Beobachtungen

- Gegenüber Runde 2 ist die Meldung besser: Sie sagt jetzt, wo ich markieren muss. Von der Abrechnung aus bin ich ohne Suchen ans Ziel gekommen (Menü → Dokumente → «Als versendet markieren»).
- Nach «Als versendet markieren» steht überall «per E-Mail · Versendet», obwohl ich per Post verschickt habe; der Hinweis auf die nicht zugestellte E-Mail ist danach weg. Schon in Runde 2 gesehen (dort P-2).
- «Als versendet markieren» wirkt sofort, ohne Bestätigung; nur das Etikett wechselt auf «Versendet». Schon in Runde 2 gesehen.
- Auch vor der Simulation (Brief «Zu versenden», kein Zustellfehler) gibt es im Abschnitt «Mahnungen» der Abrechnung kein «Als versendet markieren» und keinen Hinweis, wo das geht. Nach dem Senden stand dort nur «Mahnung erstellt. Zahlungserinnerung liegt als Brief zum Ausdrucken in den Dokumenten bereit.»; «Dokumenten» ist kein Link.
- «Mahnung» in der Meldung, «Zahlungserinnerung» im Titel derselben Zeile; Dialog «Mahnung senden», Knopf «Zahlungserinnerung senden». Schon in Runde 1 und 2 gesehen.
- Mieterseite: Datei-Auswahl auf Englisch «Choose File» / «No file chosen». Schon gesehen.
- Nach dem Ändern der Zahlungsfrist zeigt die Abrechnung «PDF erstellen» statt «PDF herunterladen», ohne Erklärung. Schon gesehen.
- Mieterseite «Korrespondenzkanal: Per Brief» neben einer Mahnung «per E-Mail»: kommt von der Simulation per SQL.

## Aufgabe geschafft: ja

Von der Abrechnung aus konnte ich der Meldung folgen. Von der Mieterseite aus nur, weil ich die Seite «Dokumente» aus Runde 2 kannte; beim ersten Mal hätte ich in der Karte «Dokumente» gesucht (P-1).

## Aufwand

Etwa 8 Minuten, 11 Schritte: Übersicht, Frist-Link zur Abrechnung, «Weitere Aktionen» → «Frist und Bemerkungen bearbeiten», Frist 30.09.2026 speichern, «Mahnung senden» → «Zahlungserinnerung senden», Zustellfehler per SQL, Abrechnung ansehen, Mieterseite ansehen, Menü → Dokumente, «Als versendet markieren», Abrechnung und Mieterseite noch einmal.

## Ablauf

1. **Übersicht** (`01-dashboard.png`). Erwartet: Hans Müller unter den Fristen. Gesehen: «28.10.2026 Zahlungsfrist · Hans Müller in 13 Tagen», «0 Überfällig».
2. **Abrechnung NK-11111111-2025-0001** über den Frist-Link (`02-statement.png`). Status «Versendet», nur «PDF herunterladen» und «Als bezahlt markieren».
3. **Frist ändern** (`03-edit.png`, `04-after-save.png`). «Frist und Bemerkungen bearbeiten» steht unten unter «Weitere Aktionen». Zahlungsfrist 30.09.2026 eingetippt, «Änderungen speichern». Gesehen: «Status: Überfällig», Knöpfe «PDF erstellen», «Mahnung senden», «Als bezahlt markieren».
4. **Mahnung senden** (`05-dialog.png`, `06-after-send.png`). Dialog: «Dwello erstellt die Zahlungserinnerung als PDF und legt sie unter «Dokumente» bereit. …», «Hans Müller schuldet noch CHF 215.80.» Nach «Zahlungserinnerung senden»: «Mahnung erstellt. Zahlungserinnerung liegt als Brief zum Ausdrucken in den Dokumenten bereit.» Im Abschnitt «Mahnungen» «per Brief · Zu versenden», nur «PDF herunterladen». Dokument-ID `a660b3e1-2282-44f7-9236-5ee0c2b50a45`.
5. **Zustellfehler simulieren** per SQL nur auf diesem Dokument (Status `to_send`, `sent_at` leer, Kanal `email`, Fehlertext 550 User unknown).
6. **Abrechnung, Abschnitt «Mahnungen»** (`07-statement.png`). Erwartet: Meldung mit Ort zum Markieren. Gesehen: Etikett «Zu versenden» mit Warnsymbol, darunter in brauner Schrift die neue Meldung mit «unter «Dokumente»», rechts nur «PDF herunterladen». Kein Link zu «Dokumente» im Inhalt der Seite. Verstanden: Ich muss woanders hin.
7. **Mieterseite Hans Müller** über den Link «Hans Müller» (`08-mieter.png`). Erwartet: dasselbe. Gesehen: Karte mit Überschrift «Dokumente», darin die Zahlungserinnerung «15.10.2026 · per E-Mail · Zu versenden», dieselbe Meldung «… unter «Dokumente» als versendet …», darunter nur «PDF herunterladen» und das Formular «Dokument hochladen». Hier bin ich doch «unter Dokumente»? Wo ist der Knopf? (P-1)
8. **Menü** (`09-menu.png`). Drei Striche oben links geöffnet: unter «Nebenkosten» steht «Dokumente» mit Ordnersymbol. Gut sichtbar, ohne Scrollen.
9. **Seite Dokumente** (`10-dokumente.png`). Zeile «Zahlungserinnerung · NK-11111111-2025-0001», «An Hans Müller, erstellt am 15.10.2026, per E-Mail», «Zu versenden», dieselbe Meldung, rechts «Als versendet markieren» und «PDF herunterladen». Hier passt die Meldung zu den Knöpfen; nur «unter «Dokumente»» wirkt hier doppelt (P-3).
10. **«Als versendet markieren»** (`11-dok-nachher.png`). Sofort «Versendet», Meldung und Knopf weg, keine Bestätigung.
11. **Abrechnung und Mieterseite nachher** (`12-abr-nachher.png`, `13-mieter-nachher.png`). Beide zeigen «per E-Mail · Versendet», keine Meldung mehr.

## Verwirrung

- Mieterseite: «unter «Dokumente»» – die Karte, in der ich lese, heisst ja «Dokumente». Ich habe zuerst dort nach dem Knopf gesucht.
- Seite Dokumente: «unter «Dokumente»», obwohl ich schon da bin.
- «Mahnung» und «Zahlungserinnerung» für dasselbe Schreiben (schon bekannt).
- Die anderen Teile der Meldung («Drucken Sie … aus», «per Post», «für die nächste Mahnung») sind klar.

## Fehlerrisiken

- Auf der Mieterseite finde ich in der Karte «Dokumente» keinen Knopf, gebe auf und lasse die Mahnung auf «Zu versenden». Die Übersicht fordert mich dann weiter auf, einen Brief zu verschicken, und ich schicke ihn vielleicht ein zweites Mal (P-1).
- Ich suche den Knopf im Formular «Dokument hochladen» darunter und lade aus Versehen etwas hoch (P-1).
- Wer das Menü (☰) nicht kennt, kommt von der Abrechnung nicht nach «Dokumente» (P-2).

## Vorschläge

- **P-1** Reproduktion: Abrechnung 2025 von Hans Müller überfällig machen (Frist 30.09.2026), «Mahnung senden» → «Zahlungserinnerung senden», beim Dokument einen Zustellfehler mit Kanal E-Mail speichern, Mieterseite Hans Müller öffnen. Die Meldung steht in der Karte «Dokumente», die keinen Knopf zum Markieren hat. Hilfreich: «Als versendet markieren» direkt in dieser Karte anbieten; oder die Meldung sagt «im Menü unter «Dokumente»» und «Dokumente» ist ein Link auf die Seite Dokumente.
- **P-2** Reproduktion: wie P-1, aber die Abrechnung öffnen, Abschnitt «Mahnungen». Hilfreich: «Dokumente» in der Meldung als Link, oder ein Knopf «Zu den Dokumenten» neben «PDF herunterladen» (oder «Als versendet markieren» direkt hier).
- **P-3** Reproduktion: wie P-1, Seite «Dokumente» öffnen. Hilfreich: auf dieser Seite den Ort weglassen («… und markieren Sie sie danach als versendet.»), da der Knopf daneben steht.

## Nicht geprüft

- Die Rückmeldung direkt nach dem Senden bei einem echten Zustellfehler («Zahlungserinnerung liegt in den Dokumenten zum Versand bereit.» plus Grund): Sie erscheint laut Aufrufer nur bei einer wirklich gescheiterten E-Mail; Hans Müller hat Korrespondenzkanal «Per Brief», und ich habe weder seine Daten geändert noch einen Mailserver-Fehler auslösen können. Ich habe nur die Meldung nach dem Simulieren per SQL beurteilt.
- Übersicht nach der Simulation: nicht erneut angesehen, war nicht Teil der Aufgabe.
- Andere Sprachen, 200 % Zoom und Mobilansicht: nicht verlangt.
