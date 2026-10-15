# Persona Dr. Weber – Dokumente zu Mietern (upload174)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, 100 %, Maus.
App: http://localhost:3300 (Persona-Stack, Demodaten). Nur angesehen: nichts gespeichert, hochgeladen oder gelöscht; Löschdialoge nur geöffnet und mit «Abbrechen» bzw. Escape geschlossen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ef0e447-cbd4-5868-810d-381376519773/scratchpad/weber-upload174/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mieter (ehemalig), Dialog «… löschen?» | Ein ehemaliger Mieter (Sarah Meier, Vertrag beendet 30.06.2025) lässt sich nie löschen («Mieter löschen» ist gesperrt). Der Dialog sagt nicht, dass seine hochgeladenen Dateien (z. B. eine Ausweiskopie) damit unbefristet bleiben und dass ich sie selbst einzeln löschen muss. Gerade bei ehemaligen Mietern ist das der Fall, in dem Ausweiskopien und Betreibungsauszüge nicht mehr gebraucht werden. |
| P-2 | Minor | Mieter, Karte «Dokumente» (Hinweis beim Hochladen); Hilfe | «Löschen Sie Ausweiskopien und Betreibungsauszüge, sobald Sie sie nicht mehr brauchen.» ist rechtlich zu unbestimmt: Es sagt nicht, wann das ist (z. B. nach Abschluss des Mietvertrags beim Betreibungsauszug; bei Mietende) und nicht, warum (Datenschutz). Ein Laie lässt die Dateien liegen. |
| P-3 | Minor | Dokumente, Filter «Zu versenden», leerer Zustand | Text «Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.» steht unter «Keine Briefe zu versenden». Das ist falsch bzw. irreführend: Hochgeladene Dokumente müssen nicht versendet werden und erscheinen in diesem Filter gerade nicht. Man könnte meinen, eine Ausweiskopie sei an den Mieter zu schicken. |
| P-4 | Minor | Dokumente (Liste) | Die Zeile eines hochgeladenen Dokuments sagt, was sie ist («Zu Marco Bernasconi, hochgeladen am 30.06.2023»), aber nicht ausdrücklich, dass nichts zu tun ist; der Mietername ist kein Link. Wer in der Liste aufräumen will (Ausweiskopien löschen), kommt von hier weder zum Mieter noch zum Löschen. |
| P-5 | Minor | Datenschutz | Die Erklärung nennt jetzt hochgeladene Dokumente inkl. Ausweiskopien und Betreibungsauszügen, sagt aber nicht, wo die Dateien liegen (nur «PostgreSQL-Datenbank» für «die Daten»), wie lange sie aufbewahrt werden, ob «endgültig gelöscht» auch Sicherungskopien betrifft, und dass ich als Vermieter gegenüber dem Mieter für diese Daten verantwortlich bin. |
| P-6 | Minor | Mieter, Karte «Dokumente» | Der Link zur Datei heisst «PDF», obwohl auch JPG und PNG erlaubt sind; in der Liste «Dokumente» heisst derselbe Link «Datei herunterladen». Für ein Bild wäre «PDF» falsch (mit JPG nicht geprüft, da kein Hochladen erlaubt). |
| P-7 | Nit | Mieter, Dialog «… löschen?» | «weil Abrechnungen und Dokumente auf sie verweisen» lässt offen, was mit hochgeladenen Dokumenten eines Mieters *ohne* Mietvertrag beim Löschen passiert (mitgelöscht?). |

## Beobachtungen

- Das Dateifeld zeigt im Test-Browser «Choose File / No file chosen» (englisch). Das stammt vom Browser, nicht von Dwello; in einem deutschsprachigen Browser vermutlich deutsch.
- Die Zeile in der Liste «Dokumente» ist nicht als Ganzes ein Link (Titel ist reiner Text, daneben die Schaltfläche «Datei herunterladen").
- Auf der Mieterseite steht der Kopfbutton «Löschen» (Mieter) und in der Dokumentkarte «Löschen» (Dokument) im gleichen Rot; der Dokument-Button ist für Screenreader sauber benannt («Löschen: Übergabeprotokoll Wohnung B2»), sichtbar aber nur «Löschen».
- Der leere Zustand im Filter «Zu versenden» verlinkt «Zu den Nebenkostenabrechnungen»; plausibel für Mahnungen.
- Datenschutz, Abschnitt «Weitergabe an Dritte»: Hochgeladene Dokumente werden dort nicht erwähnt; ich schliesse daraus, dass sie nicht weitergegeben werden. Ein Satz dazu würde beruhigen.

## Aufgabe geschafft: ja

Alle genannten Stellen gelesen, beide Löschdialoge geöffnet und geschlossen.

## Aufwand

Etwa 15 Minuten, 5 Durchgänge mit rund 20 Schritten (Übersicht, Mieterliste, Marco Bernasconi, Dokument-Löschdialog, Mieter-Löschdialog, Liste «Dokumente» mit beiden Filtern, Hilfe, Datenschutz, Sarah Meier mit Löschdialog).

## Ablauf

1. **Übersicht → Menü.** Erwartet: einen Eintrag für Dokumente. Gesehen: «Dokumente» unter «Nebenkosten». Etwas überraschend, weil Ausweiskopien nichts mit Nebenkosten zu tun haben, aber auffindbar.
2. **Mieter → Marco Bernasconi.** Erwartet: eine Dokumentkarte mit Hinweisen zu heiklen Dateien. Gesehen (Screenshot 02): Karte «Dokumente» mit «Übergabeprotokoll Wohnung B2, Hochgeladen am 30.06.2023», Link «PDF», Schaltfläche «Löschen»; darunter «Dokument hochladen» mit Feld «Datei» und Hilfetext «PDF, JPG oder PNG, höchstens 10 MB. Löschen Sie Ausweiskopien und Betreibungsauszüge, sobald Sie sie nicht mehr brauchen.», Feld «Titel (optional)» mit «Ohne Titel heisst das Dokument wie die Datei.», Schaltfläche «Dokument hochladen». Der Hinweis ist gut platziert, aber ohne Zeitpunkt (P-2).
3. **Dokument löschen (Dialog).** Erwartet: Nennung des Dokuments und Endgültigkeit. Gesehen (Screenshot 04): «Dokument löschen? – Übergabeprotokoll Wohnung B2 wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.» mit «Abbrechen» und «Dokument löschen». Klar und korrekt. Mit «Abbrechen» geschlossen.
4. **Mieter löschen (Dialog) bei Marco Bernasconi.** Erwartet: Auskunft, was mit seinen Dokumenten geschieht. Gesehen (Screenshot 05): «Marco Bernasconi löschen? – Mieter mit Mietverträgen bleiben erhalten, weil Abrechnungen und Dokumente auf sie verweisen.», «Mieter löschen» gesperrt. Für einen laufenden Mieter in Ordnung. Mit «Abbrechen» geschlossen.
5. **Ehemaliger Mieter Sarah Meier, Mieter löschen.** Erwartet: einen Hinweis, dass ich wenigstens heikle Dateien löschen soll, wenn der Mieter selbst bleiben muss. Gesehen (Screenshot 10): derselbe Text, gesperrte Schaltfläche, kein Wort zu hochgeladenen Dateien (P-1, P-7). Mit Escape geschlossen; funktioniert.
6. **Liste «Dokumente», Filter «Alle».** Erwartet: pro Zeile Art des Dokuments und ob etwas zu tun ist. Gesehen (Screenshot 03): Einleitung «Mahnungen und andere Schreiben an Mieter sowie Dokumente, die Sie zu Mietern hochgeladen haben. Drucken Sie Briefe, die noch zu versenden sind …», eine Zeile «Übergabeprotokoll Wohnung B2 / Zu Marco Bernasconi, hochgeladen am 30.06.2023» mit «Datei herunterladen». Durch «hochgeladen» erkenne ich, dass es eine Ablage ist; dass nichts zu tun ist, muss ich ableiten (P-4). Briefe/Mahnungen gibt es in den Demodaten nicht, also konnte ich den Unterschied zu einer Brief-Zeile nicht sehen.
7. **Filter «Zu versenden».** Erwartet: leer, mit Erklärung, dass hier nur Briefe stehen. Gesehen (Screenshot 06): «Keine Briefe zu versenden – Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.» Widerspruch: das hochgeladene Übergabeprotokoll erscheint hier eben nicht (P-3).
8. **Hilfe.** Erwartet: Abschnitt zu Dokumenten mit Aufbewahrung. Gesehen (Screenshot 07): unter «Mieter und Mietverträge verwalten» ein Punkt «Unter «Dokumente» auf der Seite eines Mieters laden Sie Dateien hoch, etwa ein Übergabeprotokoll (PDF, JPG oder PNG, höchstens 10 MB). Löschen Sie Ausweiskopien und Betreibungsauszüge, sobald Sie sie nicht mehr brauchen.» Gleicher Wortlaut wie im Formular, kein Mehr an Erklärung (P-2). Kein Wort dazu, was bei ehemaligen Mietern gilt.
9. **Datenschutz (Fusszeile).** Erwartet: Dokumente erwähnt, mit Speicherort und Dauer. Gesehen (Screenshot 08): im Abschnitt «Welche Daten Dwello speichert» genannt («Dokumente, die Sie zu Mietern hochladen (etwa Übergabeprotokolle, Ausweiskopien oder Betreibungsauszüge)»); dazu nur «Die Daten liegen in der PostgreSQL-Datenbank des Betreibers». Keine Aufbewahrungsdauer, nichts zu Sicherungskopien, nichts zur Rolle des Vermieters (P-5).

## Verwirrung

- «Dokumente» im Menü unter «Nebenkosten»: Ablage von Ausweiskopien gehört nicht zu den Nebenkosten.
- «… sobald Sie sie nicht mehr brauchen»: Wann brauche ich einen Betreibungsauszug nicht mehr? Nach Vertragsabschluss? Nach Mietende?
- «weil Abrechnungen und Dokumente auf sie verweisen»: Sind damit meine hochgeladenen Dateien gemeint oder die Mahnbriefe? Würden hochgeladene Dateien bei einem Mieter ohne Vertrag mitgelöscht?
- «PDF» als Linkname für eine Datei, die auch ein Bild sein kann.
- «endgültig gelöscht»: auch aus Sicherungen?

## Fehlerrisiken

- Ausweiskopien und Betreibungsauszüge ehemaliger Mieter bleiben jahrelang liegen, weil weder der Löschdialog noch die Liste daran erinnert (P-1, P-4).
- Ein Laie liest den leeren Zustand «Zu versenden» so, dass hochgeladene Dokumente an den Mieter zu versenden sind (P-3).
- Vermieter informiert seine Mieter nicht über die Ablage, weil die Datenschutzerklärung ihn nicht auf seine eigene Verantwortung hinweist (P-5).

## Vorschläge

- **P-1:** Mieter → Sarah Meier → «Löschen». Im Dialog, wenn der Mieter Dokumente hat: «Hochgeladene Dokumente dieses Mieters bleiben gespeichert. Löschen Sie Ausweiskopien und Betreibungsauszüge einzeln in der Karte «Dokumente».» Ideal zusätzlich ein Hinweis in der Karte «Dokumente» ehemaliger Mieter.
- **P-2:** Mieter → Marco Bernasconi → Karte «Dokumente», Hilfetext beim Feld «Datei»; Hilfe, Abschnitt «Mieter und Mietverträge verwalten». Konkreter Zeitpunkt, fachlich prüfen lassen, z. B. «Den Betreibungsauszug brauchen Sie nur für die Auswahl; löschen Sie ihn nach Vertragsabschluss. Löschen Sie Ausweiskopien spätestens nach Mietende.»
- **P-3:** Menü «Dokumente» → «Zu versenden» (ohne offene Briefe). Text ändern zu etwa «Mahnungen per Brief erscheinen hier, bis Sie sie als versendet markieren. Hochgeladene Dokumente müssen nicht versendet werden.»
- **P-4:** Menü «Dokumente» → Zeile «Übergabeprotokoll Wohnung B2». Art als Text nennen («Hochgeladen, nichts zu tun» bzw. bei Briefen «Zu versenden») und den Mieternamen auf die Mieterseite verlinken, wo man löschen kann.
- **P-5:** Fusszeile → «Datenschutz», Abschnitt «Welche Daten Dwello speichert». Ergänzen: wo Dateien liegen, dass sie bis zum Löschen bleiben, ob Sicherungen sie enthalten, und ein Satz «Für die Daten Ihrer Mieter sind Sie verantwortlich; informieren Sie Ihre Mieter darüber.» (fachlich prüfen).
- **P-6:** Mieter → Marco Bernasconi → Karte «Dokumente», Link «PDF». Gleich wie in der Liste «Datei herunterladen» oder nach Dateityp benennen.
- **P-7:** Mieter → Marco Bernasconi → «Löschen». Satz ergänzen, was mit hochgeladenen Dokumenten passiert, wenn das Löschen möglich ist.

## Nicht geprüft

- Hochladen (Erfolg, Fehler bei zu grosser Datei oder falschem Typ, Linkname bei JPG/PNG): Aufgabe verbot Speichern und Hochladen.
- Tatsächliches Löschen eines Dokuments und eines Mieters: nur Dialoge geöffnet.
- Löschdialog eines Mieters ohne Mietvertrag: In den Demodaten hat jeder Mieter einen Vertrag.
- Brief-/Mahnungszeilen in der Liste «Dokumente» und die Aktion «als versendet markieren»: keine solchen Dokumente in den Demodaten.
- Andere Sprachen als Deutsch und andere Viewports (nicht meine Persona).
