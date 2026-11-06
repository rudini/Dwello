# Sven – Feature-Review #668 (Mietvertrag bearbeiten, Assistent «Miete»)

Persona: Sven, 45, blind, nur Tastatur und Screenreader. Desktop 1440 × 900, beurteilt nach dem Accessibility-Tree (Fokus, Name, Beschreibung, Live-Regionen). Nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/sven-668/`.

Was ich «gehört» habe, habe ich so festgestellt: Name und Beschreibung des fokussierten Elements kommen aus dem Accessibility-Tree des Browsers, die Ansagen aus den Textänderungen in den Live-Regionen (`role=status`, `aria-live`), mit Zeitstempel bei jedem Tastendruck.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag bearbeiten; Assistent «Neuer Mietvertrag», Schritt 4 «Miete» | «Monatlich total» wird bei jedem Tastendruck neu angesagt, auch mit unsinnigen Zwischenbeträgen. Wenn ich «1520.50» in die Nettomiete tippe, kommen fünf Ansagen hintereinander («CHF 341.00», «CHF 355.00», «CHF 492.00», «CHF 1’860.00», «CHF 1’860.50»), im Assistenten bei «1350» die Ansagen «CHF 1.00», «CHF 13.00», «CHF 135.00», «CHF 1’350.00». Die Ansagen kommen sich mit dem Tastenecho in die Quere, und ich höre Beträge, die nie stimmen. |
| P-2 | Minor | Mietvertrag bearbeiten, Akonto | Bei einer Eingabe mit Tippfehler sagt das Formular trotzdem ein glaubwürdiges Total an: Bei «2x0» im Akonto kommt «Monatlich total CHF 1’552.00» (gerechnet mit Akonto 2.00), bei «abc» das Total ohne Akonto. Auch nach Tab ist das Feld nicht als ungültig markiert, und es kommt kein Hinweis. Das Total macht mir vor, die Eingabe sei angekommen. |
| P-3 | Minor | Mietvertrag bearbeiten; Assistent, Schritt 4 | Bei der Verwaltungspauschale liest jede Option nur ihren Namen vor («Ja, zum Satz des Abrechnungslaufs», «Ja, mit eigenem Satz», «Nein»), ohne eigene Erklärung. Was die Optionen bedeuten, steht nur in einem rund 600 Zeichen langen Text der ganzen Gruppe, den ich höre, wenn ich in die Gruppe springe. Mit den Pfeiltasten höre ich danach nur noch die nackten Namen. Bei der Vertragsdauer ist es anders: Dort liest jede Option ihren Namen und ihre Erklärung genau einmal vor. |

## Beobachtungen

- Vertragsdauer (bearbeiten und Assistent, Schritt 3): «Unbefristet» kommt mit dem Namen «Unbefristet» und der Beschreibung «Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird.», «Befristet» mit «Der Mietvertrag endet an einem festen Tag, ohne Kündigung.», jeweils genau einmal. Im Tree steckt der Erklärungstext im Label, ist aber nicht Teil des Namens, also nicht doppelt.
- «Befristet» gewählt (Pfeil runter): Der Fokus bleibt auf der Option. Eine höfliche Live-Region sagt den Hinweis an: «Zieht der Mieter aus oder in eine andere Wohnung? Dann tragen Sie das Vertragsende auf der Seite des Mietvertrags mit «Enddatum erfassen» ein. So bleibt er unbefristet, und Dwello nennt die nächsten Schritte. Zieht der Mieter in eine andere Ihrer Wohnungen, erfassen Sie danach für diese Wohnung einen neuen Mietvertrag.» Den Umzug in eine andere Wohnung spricht er also an. Am Ende der Ansage kommt auch der Linktext «Vertragsende mit «Enddatum erfassen» eintragen» mit, ein wenig doppelt. «So bleibt er unbefristet» musste ich zweimal hören, bis klar war, dass «er» der Mietvertrag ist.
- Die Live-Region für «Monatlich total» ist `role=status` (höflich) und sagt immer den ganzen Satz «Monatlich total CHF …» an. Den Wortlaut verstehe ich gut. Ein Tausendertrennzeichen «1'200» versteht das Formular richtig.
- Wenn ich das Akonto leere, erscheint der Hinweis «Kein Akonto …», er wird aber nicht angesagt und hängt nicht als Beschreibung am Feld. Ich finde ihn nur, wenn ich weiterlese.
- Die Schaltfläche auf der Seite des Mietvertrags heisst nur «Bearbeiten», nicht «Mietvertrag bearbeiten». In der Liste heisst sie «Mietvertrag von Hans Müller bearbeiten». Auf der Seite selbst passt «Bearbeiten», der Seitentitel davor sagt genug. Bis dorthin brauchte ich 20 Tabs, weil ich nicht zu «Zum Inhalt springen» gesprungen bin.
- Nach dem Laden einer Seite steht der Fokus auf dem Dokument. Im Assistenten steht er nach «Weiter» auf der Überschrift des Schritts («Schritt 2 von 5: Wohnung» usw.), das ist gut.
- «Abbrechen» im Bearbeiten-Formular verlässt die Seite ohne Rückfrage, obwohl ich die Nettomiete auf 1600 geändert hatte. Auf der Seite des Mietvertrags steht danach wie erwartet weiter CHF 1’450.00.
- Die Wohnung heisst in der Auswahl des Assistenten «Wohnung 2.02 · Musterhaus Zentrum, 2.5 Zimmer, 65 m²», gleich aufgebaut wie anderswo («Wohnung 1.01 · Musterhaus Zentrum»). Vermietete Wohnungen enden auf «(nicht verfügbar)». Alle Optionen beginnen mit «Wohnung», darum bringt das Springen mit dem Anfangsbuchstaben nichts. Erst mit «Wohnung 2.02» in einem Zug getippt landete ich richtig.
- Im Schritt «Wohnung» kommt eine Statusmeldung, dass Anna Schmidt schon einen unbefristeten Mietvertrag für die Wohnung 1.02 hat, mit dem Hinweis auf «Enddatum erfassen» bei einem Umzug. Das ist verständlich.
- Im Assistenten ist bei der Verwaltungspauschale zuerst keine Option gewählt. Die Statuszeile «Noch nicht gespeichert: … Stand: 08:11» ist eine weitere Live-Region, und das Formular hat mehrere leere `status`-Regionen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 30 Minuten und rund 10 Durchgänge mit der Tastatur. Bis «Bearbeiten» auf der Seite des Mietvertrags brauchte ich 20 Tabs, bis zur Nettomiete im Formular 27 Tabs ab Seitenanfang, im Assistenten bis Schritt 4 drei Mal «Weiter».

## Ablauf

- Nettomiete im Bearbeiten-Formular überschrieben. Erwartet: eine Ansage des neuen Totals, wenn ich mit Tippen fertig bin. Gesehen: eine Ansage pro Tastendruck, mit falschen Zwischenbeträgen (P-1).
- Akonto «2x0» getippt. Erwartet: ein Hinweis, dass der Betrag ungültig ist, spätestens beim Verlassen des Felds. Gesehen: das Total mit Akonto 2.00, kein Hinweis, das Feld nicht als ungültig markiert (P-2).
- Mit den Pfeiltasten durch die Verwaltungspauschale. Erwartet: Name und Erklärung pro Option wie bei der Vertragsdauer. Gesehen: nur Namen (P-3).
- Akonto geleert. Erwartet: eine Ansage des Hinweises «Kein Akonto». Gesehen: keine Ansage (Beobachtung).
- «Abbrechen» nach einer Änderung. Erwartet: vielleicht eine Rückfrage wegen der ungespeicherten Änderung. Gesehen: die Seite wechselt sofort (Beobachtung).

## Vorschläge

- **P-1:** Mietvertrag von Hans Müller > «Bearbeiten» > Tab bis «Nettomiete pro Monat» > Inhalt markieren > «1520.50» zügig tippen. Ergebnis: fünf Ansagen. Im Assistenten in Schritt 4 «1350» tippen: vier Ansagen. Was helfen würde: das Total erst nach einer kurzen Tipp-Pause (etwa 500 bis 1000 ms) oder beim Verlassen des Felds ansagen, und nur, wenn sich der Betrag gegenüber der letzten Ansage geändert hat.
- **P-2:** Bearbeiten-Formular > «Akonto pro Monat» > «2x0» tippen > Tab. Ergebnis: «Monatlich total CHF 1’552.00», kein Fehler. Was helfen würde: bei einer Eingabe, die keine gültige Zahl ist, das Feld als ungültig markieren (`aria-invalid`, Fehlertext als Beschreibung) und statt eines Totals etwas wie «Monatlich total: erst mit gültigen Beträgen» ansagen.
- **P-3:** Bearbeiten-Formular oder Assistent Schritt 4 > Tab zur Verwaltungspauschale > Pfeiltasten. Ergebnis: nur die Namen der Optionen. Was helfen würde: wie bei der Vertragsdauer jeder Option eine kurze eigene Erklärung als Beschreibung geben (zum Beispiel «Im Mietvertrag steht ein Prozentsatz.») und den langen Gruppentext auf den allgemeinen Teil kürzen.

## Nicht geprüft

- Einen echten Screenreader (NVDA, JAWS, VoiceOver) konnte ich nicht nutzen. Ob eine höfliche Ansage frühere abbricht oder in die Warteschlange stellt, hängt vom Screenreader ab. Gemessen habe ich, wie oft und mit welchem Text sich die Live-Region ändert.
- Speichern und die Fehlermeldungen beim Speichern habe ich laut Auftrag nicht ausgelöst. Darum weiss ich nicht, ob «2x0» beim Speichern abgelehnt würde.
- «Befristet» im Assistenten, Schritt 3, habe ich nicht gewählt: Der Auftrag verlangte den Hinweis nur im Bearbeiten-Formular.
- Den Kalender-Dialog habe ich nicht geöffnet, das Datum habe ich getippt.
