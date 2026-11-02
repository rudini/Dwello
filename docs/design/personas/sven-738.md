# Sven, Slice 738: Gebäude wählen im Assistenten «Abrechnungen erstellen»

Persona: Sven, 45, blind, Screenreader und Tastatur, Desktop 1440 × 900, beurteilt über den Accessibility-Baum. Persona-App auf http://localhost:3300 (Demodaten), nichts gespeichert. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/sven-738/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Schritt 2 «Gebäude», Fehlerzustand (Rechnungen und Abrechnungsstand nicht geladen) | Die Fehlermeldung ist nur ein Absatz: keine Live-Region, keine Rolle «alert», an kein Kontrollkästchen und nicht an die Gruppe «Gebäude» angehängt. Mit Tab höre ich nur «Alpenblick … 3 Wohnungen» und erfahre nicht, dass die Rechnungen und der Abrechnungsstand fehlen. Ich kann alle drei Gebäude wählen und weitergehen, ohne zu wissen, dass zwei davon schon abgerechnet sind. |
| P-2 | Minor | Schritt 2 «Gebäude» | «Alle Gebäude» wird als «aktiviert» angesagt, sobald ich nur Alpenblick ankreuze, während daneben «1 von 3 gewählt» steht. Die Erklärung («lässt 2 Gebäude aus, deren Mietverträge … schon eine Abrechnung haben») ist nicht als Beschreibung am Kontrollkästchen angehängt; beim Tabben höre ich sie nicht. |
| P-3 | Minor | Schritt 2 «Gebäude» | Die Beschreibung jedes Gebäudes wird ohne Trennzeichen vorgelesen: «6 Rechnungen in der Abrechnungsperiode 3 Wohnungen». Das klingt wie «Abrechnungsperiode 3», die Zahl der Wohnungen geht dabei fast unter. |
| P-4 | Minor | Schritt 2 «Gebäude» | Bei Seepark Residenz und Musterhaus Zentrum hängt an der Beschreibung ein Hinweis aus sechs Sätzen. Er wird bei jedem Tab auf diese Kontrollkästchen ganz vorgelesen, und die wichtigste Aussage («Für dieses Gebäude entsteht keine neue Abrechnung») kommt erst nach «Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung für diese Abrechnungsperiode.» |

## Beobachtungen

- Die Namen der Kontrollkästchen sind gut: Name und Adresse des Gebäudes («Alpenblick Bergstrasse 8, 3800 Interlaken»). Ich weiss, was ich ankreuze. Die Zahl der Rechnungen und Wohnungen kommt als Beschreibung direkt danach. Damit ist der Kern meiner Frage beantwortet.
- Nach «Weiter» in Schritt 1 und nach dem Neuladen liegt der Fokus auf der Überschrift «Schritt 2 von 5: Gebäude». Das ist gut. Der nächste Tab führt auf «Alle Gebäude».
- Nach dem Neuladen steht vor dem Fortschritt der Hinweis «Angaben wiederhergestellt … nur in diesem Browser aufbewahrt und noch nicht gespeichert» mit «Angaben verwerfen» und «Meldung schliessen». Er wird nicht angesagt, weil der Fokus erst danach auf der Überschrift liegt und der Hinweis in keiner Live-Region steht. Nur wenn ich von der Überschrift aus rückwärts lese, finde ich ihn. Meine Auswahl (Alpenblick angekreuzt) war wiederhergestellt.
- «1 von 3 gewählt» steht in einer höflichen Live-Region und wird beim Ankreuzen angesagt. Gut.
- Im Fehlerzustand sagt die Meldung zweimal «Laden Sie die Seite neu». Ob Neuladen hilft, wenn der Server weiter ausfällt, sagt sie nicht.
- Im Fehlerzustand kreuzt «Alle Gebäude» alle drei Gebäude an («3 von 3 gewählt»), auch die zwei, die im Normalfall ausgelassen werden. Die Erklärung dazu fehlt dann. Weiter zu Schritt 3 kam ich trotzdem.
- Die sichtbare Überschrift lautet nur «Gebäude», ihr zugänglicher Name aber «Schritt 2 von 5: Gebäude». Für mich passt das, für sehende Helfer am selben Bildschirm ist es leicht anders.
- In Schritt 1 haben die Datumsfelder einen Namen («Beginn», «Ende») und als Beschreibung das Format und den Wochentag. Gut.

## Aufgabe geschafft: teilweise

Schritt 1 und 2 der Aufgabe ja. Den Fehlerzustand (Teil 3) erreiche ich mit Tab nicht: die Meldung gibt es, aber ich höre sie nur, wenn ich den Inhalt Zeile für Zeile lese.

## Aufwand

Etwa 20 Minuten, 6 Durchgänge per Skript. Zum Gebäudeschritt: 24 Tabs bis «Weiter» in Schritt 1, dann Enter. Im Gebäudeschritt 1 bis 4 Tabs pro Gebäude.

## Ablauf

- Gebäude mit Tab durchgehen. Erwartet: Name, Adresse und die zwei Zahlen gut getrennt. Gesehen: Name und Adresse klar, die Zahlen ohne Trennung («… Abrechnungsperiode 3 Wohnungen»), bei zwei Gebäuden gefolgt von sechs Sätzen Hinweis (P-3, P-4).
- Alpenblick mit Leertaste ankreuzen, mit Umschalt+Tab zurück auf «Alle Gebäude». Erwartet: «Alle Gebäude, nicht aktiviert» oder «teilweise», denn 1 von 3. Gesehen: «Alle Gebäude, aktiviert» (P-2).
- Neu laden. Erwartet: Ansage, dass meine Angaben wiederhergestellt wurden. Gesehen: Fokus auf der Schrittüberschrift, der Hinweis wird nicht angesagt (Beobachtung).
- Fehlerzustand: GET `/api/invoices?…isValidUtilityCost=true…` und GET `/api/statements/billed?…` mit 500 beantwortet, dann aus Schritt 1 mit «Weiter» hinein. Erwartet: eine Ansage oder eine Beschreibung an den Kontrollkästchen, dass Angaben fehlen. Gesehen: Fokus auf der Überschrift, mit Tab «Alle Gebäude» ohne Beschreibung, dann «Alpenblick … 3 Wohnungen» usw. Die Meldung («Die Anzahl Rechnungen je Gebäude konnte nicht geladen werden. Laden Sie die Seite neu. Ob Mietverträge … schon eine Abrechnung haben, konnte nicht geladen werden. Laden Sie die Seite neu.») steht nur als Absatz zwischen «Alle Gebäude» und dem ersten Gebäude (P-1). Das Bildschirmfoto zeigt sie sichtbar in brauner Schrift unter «Alle Gebäude».

## Vorschläge

- **P-1:** Requests oben mit 500 beantworten, `/statements/generate` öffnen, Tab bis «Weiter», Enter, dann mit Tab die Gebäude durchgehen. Hilfreich: die Meldung in eine Live-Region (`role="alert"` oder `status`) legen und sie zusätzlich über `aria-describedby` an die Gruppe «Gebäude» oder an jedes Kontrollkästchen hängen, z. B. «3 Wohnungen. Rechnungen und Abrechnungsstand konnten nicht geladen werden.»
- **P-2:** Normalzustand, im Gebäudeschritt nur Alpenblick ankreuzen, Umschalt+Tab auf «Alle Gebäude». Hilfreich: den Hinweis «lässt 2 Gebäude aus …» als Beschreibung an «Alle Gebäude» hängen, oder den Namen anpassen, z. B. «Alle Gebäude ohne Abrechnung», damit «aktiviert» und «1 von 3 gewählt» zusammenpassen.
- **P-3:** Im Gebäudeschritt Tab auf ein Gebäude. Hilfreich: ein Trennzeichen zwischen den Teilen der Beschreibung (z. B. «6 Rechnungen in der Abrechnungsperiode, 3 Wohnungen»).
- **P-4:** Im Gebäudeschritt Tab auf Seepark Residenz. Hilfreich: die Beschreibung mit der Folge beginnen («Schon abgerechnet: Für dieses Gebäude entsteht keine neue Abrechnung.») und den Rest (Neu berechnen, Versendete) nur einmal sichtbar unter der Liste lesen lassen statt bei jedem Gebäude.

## Nicht geprüft

- Echter Screenreader (NVDA, VoiceOver): beurteilt habe ich den Accessibility-Baum und die berechneten Namen und Beschreibungen über Chromium. Ob ein Screenreader beim Betreten der Gruppe «Gebäude» etwas zusätzlich ansagt, konnte ich nicht hören.
- Nur einer der beiden Requests fehlgeschlagen: nicht gefragt, nicht versucht.
- Schritte 3 bis 5 und das Erstellen: kein Speichern erlaubt. Ich kam im Fehlerzustand bis Schritt 3, der Fokus lag dort auf «Schritt 3 von 5: Heizprofil und Verwaltungspauschale».
