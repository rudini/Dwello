# language: de
@categories
Funktionalität: Kostenkategorien
  Als Liegenschaftsverwalter
  möchte ich die Kostenkategorien pflegen
  damit Rechnungen richtig eingeordnet und nur umlagefähige Kosten abgerechnet werden

  Grundlage:
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"

  Szenario: Nur umlagefähige Kategorien anzeigen
    Angenommen es gibt die nicht umlagefähige Kategorie "Dachsanierung"
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter nur die umlagefähigen Kategorien anzeigt
    Dann sieht der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung"
    Aber nicht die Kategorie "Dachsanierung"

  Szenario: Kategorie erfassen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die nicht umlagefähige Kategorie "Fassadenreinigung" erfasst
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Fassadenreinigung" nicht umlagefähig

  Szenario: Name ist schon vergeben
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die umlagefähige Kategorie "Treppenhausreinigung" erfasst
    Dann erfährt der Liegenschaftsverwalter, dass es die Kategorie "Treppenhausreinigung" schon gibt

  Szenario: Kategorie bearbeiten
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" als nicht umlagefähig speichert
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Treppenhausreinigung" nicht umlagefähig

  Szenario: Bearbeitung abbrechen
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Kategorie "Treppenhausreinigung"
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"

  Szenario: Kategorie löschen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" löscht
    Dann sieht der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" nicht mehr

  Szenario: Kategorien mit Rechnungen bleiben erhalten
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und eine Rechnung des Gebäudes "Seeblick" ist der Kategorie "Treppenhausreinigung" zugeordnet
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann wird die Kategorie "Treppenhausreinigung" von 1 Rechnung verwendet
    Und kann der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" nicht löschen

  Szenario: Eigene Kategorie mit gleichem englischem Namen zeigt ihre Beschreibung
    Angenommen es gibt die eigene Kategorie "Internet" mit gleichem englischem Namen und der Beschreibung "Glasfaseranschluss im Keller"
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann sieht der Liegenschaftsverwalter bei der Kategorie "Internet" die Beschreibung "Glasfaseranschluss im Keller"

  Szenario: Vordefinierte Kategorien, deren Kosten der Vermieter trägt
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann ist die vordefinierte Kategorie "Schädlingsbekämpfung" nicht umlagefähig
    Und ist die vordefinierte Kategorie "Feuerlöscher-Wartung" nicht umlagefähig

  # Jeder Grund endet mit seiner Folgerung und schreibt OR und VMWG aus (#292)
  Szenario: Vordefinierte Kategorien nennen den Grund ihrer Umlagefähigkeit
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann nennt die vordefinierte Kategorie "Feuerlöscher-Wartung" als Grund "umstritten"
    Und nennt die vordefinierte Kategorie "Schädlingsbekämpfung" als Grund "umstritten"
    Und nennt die vordefinierte Kategorie "Lift" als Grund "Vollservicevertrag"
    Und nennt die vordefinierte Kategorie "Lift" als Grund "also umlagefähig."
    Und nennt die vordefinierte Kategorie "Gebäudeversicherung" als Grund "nur die Heizungsanlage"
    Und nennt die vordefinierte Kategorie "Liegenschaftssteuer" als Grund "Obligationenrecht, OR"
    Und nennt die vordefinierte Kategorie "Liegenschaftssteuer" als Grund "also nicht umlagefähig."
    Und erfährt der Liegenschaftsverwalter, dass der Mieter umlagefähige Kosten nur bezahlt, wenn der Mietvertrag jede dieser Kostenarten einzeln nennt

  # Der Hinweis sagt, wo der Liegenschaftsverwalter nachsieht, was der Mietvertrag nennt (#1028)
  Szenario: Der Hinweis zum Mietvertrag sagt, wo die vereinbarten Nebenkosten stehen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann erfährt der Liegenschaftsverwalter, dass er im unterschriebenen Mietvertrag nachsieht, welche Nebenkosten er nennt
    Und erfährt der Liegenschaftsverwalter, dass er sie in Dwello bei jedem Mietvertrag unter "Vereinbarte Nebenkosten" festhält

  Szenario: Grund der Umlagefähigkeit beim Bearbeiten einer vordefinierten Kategorie
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Feuerlöscher-Wartung"
    Dann nennt die Kategorie als Grund "umstritten"

  # Der Grund steht unter einer eigenen Bezeichnung und gehört zur Frage, nicht zur zweiten Wahl (#683)
  Szenario: Begründung der Umlagefähigkeit beim Bearbeiten einer vordefinierten Kategorie
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Feuerlöscher-Wartung"
    Dann steht der Grund der Kategorie unter der Bezeichnung "Begründung"
    Und nennt die Frage der Umlagefähigkeit den Grund "umstritten"

  # Weicht die Wahl von Dwellos Voreinstellung ab, verschwindet der Grund; die Folgen gehören weiter zur Frage (#1029)
  Szenario: Folgen des Umstellens einer vordefinierten Kategorie gehören zur Frage
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Feuerlöscher-Wartung"
    Wenn der Liegenschaftsverwalter die Kategorie als umlagefähig wählt
    Dann nennt die Frage der Umlagefähigkeit die Folge "schuldet der Mieter Kosten, die das Gesetz dem Vermieter zuweist, trotzdem nicht"

  # Die Beschreibung nennt, was nicht dazugehört («ohne …», #204); die längste ist die der Heizung
  Szenario: Ganze Beschreibung einer vordefinierten Kategorie auf dem Telefon
    Angenommen der Liegenschaftsverwalter benutzt ein Telefon
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Heizung"
    Dann zeigt Dwello bei «Beschreibung» den ganzen Text

  Szenario: Geänderte vordefinierte Kategorie nennt keinen festen Grund
    Angenommen die vordefinierte Kategorie "Schneeräumung" ist als nicht umlagefähig gespeichert
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann ist die vordefinierte Kategorie "Schneeräumung" nicht umlagefähig
    Und nennt die vordefinierte Kategorie "Schneeräumung" keinen Grund ihrer Umlagefähigkeit

  Szenario: KI schlägt vor, ob eine neue Kategorie umlagefähig ist
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die KI prüfen lässt, ob die Kategorie "Dachsanierung" umlagefähig ist
    Dann schlägt die KI vor, die Kategorie als nicht umlagefähig zu erfassen
    Und begründet die KI ihren Vorschlag mit "Art. 256 Abs. 1"

  Szenario: Liegenschaftsverwalter übersteuert den Vorschlag der KI
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Und die KI hat geprüft, ob die Kategorie "Fassadenreinigung" umlagefähig ist
    Wenn der Liegenschaftsverwalter die Kategorie trotzdem als nicht umlagefähig speichert
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Fassadenreinigung" nicht umlagefähig

  Szenario: Ohne sichere Antwort der KI wählt der Liegenschaftsverwalter selbst
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die KI prüfen lässt, ob die Kategorie "Bewachung" umlagefähig ist
    Dann erfährt der Liegenschaftsverwalter, dass die KI sich nicht sicher ist
    Und erfährt der Liegenschaftsverwalter, dass er selbst wählen muss, ob die Kosten umlagefähig sind
    Und erfährt der Liegenschaftsverwalter, dass Kosten im Zweifel nicht umlagefähig sind
    Und ist weder umlagefähig noch nicht umlagefähig gewählt

  Szenario: KI ist nicht erreichbar
    Angenommen die KI ist nicht erreichbar
    Und der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die KI prüfen lässt, ob die Kategorie "Fensterreinigung" umlagefähig ist
    Dann erfährt der Liegenschaftsverwalter, dass die KI nicht erreichbar ist und er es später nochmals versuchen kann
    Und ist weder umlagefähig noch nicht umlagefähig gewählt

  Szenario: Neue Kategorie ohne Wahl der Umlagefähigkeit
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die Kategorie "Fassadenreinigung" speichert, ohne zu wählen, ob sie umlagefähig ist
    Dann erfährt der Liegenschaftsverwalter, dass er wählen muss, ob die Kosten umlagefähig sind

  # #678 (Sven P-5, entschieden): die Eingabetaste speichert, die KI prüft nur auf Wunsch
  Szenario: Die Eingabetaste speichert die neue Kategorie
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die nicht umlagefähige Kategorie "Fassadenreinigung" mit der Eingabetaste speichert
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Fassadenreinigung" nicht umlagefähig

  Szenario: Die Eingabetaste auf der Wahl der Umlagefähigkeit speichert, ohne die KI zu fragen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die Kategorie "Fassadenreinigung" mit der Eingabetaste auf «Nicht umlagefähig» speichert
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Fassadenreinigung" nicht umlagefähig

  Szenario: Die Eingabetaste ohne Wahl der Umlagefähigkeit fragt die KI nicht
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die Kategorie "Gartenpflege" mit der Eingabetaste speichert, ohne zu wählen, ob sie umlagefähig ist
    Dann erfährt der Liegenschaftsverwalter, dass er wählen muss, ob die Kosten umlagefähig sind
    Und ist weder umlagefähig noch nicht umlagefähig gewählt

  # #678 (Marco P-3, Helga P-4): kurz, mit dem Wort der App, und was die KI tut
  Szenario: Die Frage der Umlagefähigkeit erklärt die Regeln und die Rolle der KI
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Dann erklärt die Frage der Umlagefähigkeit "Umlagefähig sind Kosten aus dem Gebrauch des Gebäudes"
    Und erklärt die Frage der Umlagefähigkeit "Mit «Von der KI prüfen lassen» prüft die KI Name und Beschreibung und schlägt mit Begründung vor, ob die Kosten umlagefähig sind. Ist sie sich nicht sicher, schlägt sie nichts vor. Haben Sie noch nicht gewählt, wählt Dwello den Vorschlag vor. Die Wahl treffen Sie."
    Aber die Frage der Umlagefähigkeit nennt nicht "Liegenschaft"

  # #678 (Helga P-5)
  Szenario: Ohne Namen sagt Dwello, was die KI zum Prüfen braucht
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die KI prüfen lässt, ohne einen Namen einzugeben
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Geben Sie zuerst den Namen ein. Die KI prüft die Kategorie nach Name und Beschreibung."

  # #678 (Helga P-6)
  Szenario: Ohne Wahl der Umlagefähigkeit weist Dwello auf die KI hin
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die Kategorie "Fassadenreinigung" speichert, ohne zu wählen, ob sie umlagefähig ist
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Wählen Sie, ob die Kosten umlagefähig sind. Sind Sie unsicher, wählen Sie «Von der KI prüfen lassen»."

  # #678 (Helga P-9, P-8): sagt, ob die KI es anders sieht
  Szenario: Die KI sieht es anders als der Liegenschaftsverwalter
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Und der Liegenschaftsverwalter hat die Kategorie als nicht umlagefähig gewählt
    Wenn der Liegenschaftsverwalter die KI prüfen lässt, ob die Kategorie "Gartenpflege" umlagefähig ist
    Dann sagt Dwello zur Prüfung durch die KI "Die KI sieht es anders als Sie. Ihre Wahl bleibt: «Nicht umlagefähig»."
    Und ist im Formular der Kategorie "Nicht umlagefähig" gewählt

  # #678 (Helga P-10)
  Szenario: Ist die KI unsicher, bleibt die eigene Wahl
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Und der Liegenschaftsverwalter hat die Kategorie als umlagefähig gewählt
    Wenn der Liegenschaftsverwalter die KI prüfen lässt, ob die Kategorie "Bewachung" umlagefähig ist
    Dann sagt Dwello zur Prüfung durch die KI "Die KI ist sich nicht sicher. Ihre Wahl bleibt: «Umlagefähig»."
    Aber sagt Dwello zur Prüfung durch die KI nicht "Wählen Sie selbst"

  # #678 (Sven P-11, Helga P-7, Code-Review G-8): ein Vorschlag gilt nur für den geprüften Namen, und das wird gesagt
  Szenario: Nach dem Umbenennen bittet Dwello, die KI nochmals prüfen zu lassen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Und die KI hat geprüft, ob die Kategorie "Gartenpflege" umlagefähig ist
    Wenn der Liegenschaftsverwalter die Kategorie in "Gartenunterhalt" umbenennt
    Dann sagt Dwello zur Prüfung durch die KI "Name oder Beschreibung haben sich seit der Prüfung geändert. Dwello hat die Wahl der KI zurückgenommen. Wählen Sie selbst oder lassen Sie die KI nochmals prüfen."
    Und ist weder umlagefähig noch nicht umlagefähig gewählt

  Szenario: Vordefinierte und eigene Kategorien sind gekennzeichnet
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann ist die vordefinierte Kategorie "Liegenschaftssteuer" als "Von Dwello" gekennzeichnet
    Und ist die eigene Kategorie "Treppenhausreinigung" als "Eigene" gekennzeichnet

  Szenario: Vordefinierte Kategorien lassen sich nicht löschen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann kann der Liegenschaftsverwalter die vordefinierte Kategorie "Liegenschaftssteuer" nicht löschen
    Und erfährt der Liegenschaftsverwalter, dass sich die vordefinierte Kategorie "Liegenschaftssteuer" nicht löschen lässt, weil Dwello sie mitliefert

  Szenario: Bearbeiten einer vordefinierten Kategorie
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Liegenschaftssteuer"
    Dann erfährt der Liegenschaftsverwalter, dass Dwello die Kategorie mitliefert
    Und erfährt der Liegenschaftsverwalter, dass der Mieter Kosten des Vermieters nicht schuldet, auch wenn er die Kategorie auf umlagefähig stellt
    Und erfährt der Liegenschaftsverwalter, dass die KI womöglich eine andere Kategorie vorschlägt, wenn er den Namen oder die Beschreibung ändert

  # Ein eigener Brennstoff wie Stückholz hat einen Tankbestand (#100)
  Szenario: Eigene Kategorie für Brennstoff erfassen
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
    Und der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die umlagefähige Heizkosten-Kategorie "Stückholz" als Brennstoff erfasst
    Dann bietet der Tankbestand des Gebäudes "Birkenhof" die Kategorie "Stückholz" an

  # Ohne Brennstoff liesse sich der nächste Endbestand nicht erfassen, die Abrechnung nähme den Einkauf (#100)
  Szenario: Eine Kategorie mit Tankbestand bleibt Brennstoff
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
    Und das Gebäude "Birkenhof" hat einen Tankbestand in der Kategorie für Brennstoff "Stückholz"
    Wenn der Liegenschaftsverwalter die Kategorie "Stückholz" nicht mehr als Brennstoff speichert
    Dann erfährt der Liegenschaftsverwalter, dass die Kategorie wegen ihrer Tankbestände Brennstoff bleibt

  # #452 Punkt 1 (#302): bei Dwellos Kategorien entscheidet «Heizkosten», wie Dwello beim Mieterwechsel verteilt
  Szenario: Bei einer vordefinierten Kategorie ist «Heizkosten» fest
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Kaminfeger"
    Dann lässt sich nicht ändern, ob die Kategorie zu den Heizkosten zählt
    Und ist die Kategorie als Heizkosten markiert
    Und erklärt das Kategorieformular "Heizung und Kaminfeger verteilt Dwello beim Mieterwechsel nach dem Heizprofil, alle anderen Kategorien nach Tagen. Brauchen Sie eine andere Verteilung, erfassen Sie eine eigene Kategorie."

  # #452 Punkt 2 (#309): Zurückstellen holt die Rechnungen nicht zurück
  Szenario: Vor dem Umstellen auf nicht umlagefähig nennt Dwello die Rechnungen, die es betrifft
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und eine umlagefähige Rechnung des Gebäudes "Seeblick" ist der Kategorie "Treppenhausreinigung" zugeordnet
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" als nicht umlagefähig speichert
    Dann fragt Dwello "Kategorie «Treppenhausreinigung» auf nicht umlagefähig stellen?"
    Und erklärt die Rückfrage "1 erfasste Rechnung dieser Kategorie fliesst dann nicht mehr in neue Nebenkostenabrechnungen."
    Und erklärt die Rückfrage "Stellen Sie die Kategorie später zurück, bleibt diese Rechnung nicht umlagefähig: Sie müssen sie wieder auf «Umlagefähig» stellen."
    Wenn der Liegenschaftsverwalter das Umstellen bestätigt
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Treppenhausreinigung" nicht umlagefähig

  Szenario: Umstellen auf nicht umlagefähig abbrechen
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und eine umlagefähige Rechnung des Gebäudes "Seeblick" ist der Kategorie "Treppenhausreinigung" zugeordnet
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" als nicht umlagefähig speichert
    Und der Liegenschaftsverwalter das Umstellen abbricht
    Und der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist die Kategorie "Treppenhausreinigung" umlagefähig

  # #452 Punkt 2 (#309): Kosten, die das Gesetz dem Vermieter zuweist (Art. 256b OR); bestätigt wird im DOM-Test, weil
  # die vordefinierte Kategorie allen Szenarien gehört
  Szenario: Vor dem Umstellen einer vordefinierten Kategorie auf umlagefähig fragt Dwello
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die vordefinierte Kategorie "Liegenschaftssteuer" als umlagefähig speichert
    Dann fragt Dwello "Kategorie «Liegenschaftssteuer» auf umlagefähig stellen?"
    Und erklärt die Rückfrage "Kosten, die das Gesetz dem Vermieter zuweist, schuldet der Mieter auch dann nicht, wenn Sie die Kategorie umstellen."
    Und erklärt die Rückfrage "Die Wahl gilt für Rechnungen, die Sie dieser Kategorie ab jetzt zuordnen; schon erfasste bleiben nicht umlagefähig."
    Wenn der Liegenschaftsverwalter das Umstellen abbricht
    # Persona Dr. Weber P-3 (#452): das Formular zeigt wieder die gespeicherte Wahl
    Dann ist im Formular der Kategorie "Nicht umlagefähig" gewählt
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist die vordefinierte Kategorie "Liegenschaftssteuer" nicht umlagefähig

  # #1081 (Code-Review 1081 C-1): ein Dialog, der sich öffnet, während die Meldung noch steht, sitzt auf dem Telefon unten
  Szenario: Die Erfolgsmeldung verdeckt einen danach geöffneten Dialog nicht
    Angenommen das Browserfenster ist 390 auf 844 Pixel gross
    Und es gibt die umlagefähige Kategorie "Gartenpflege"
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" löscht
    Und der Liegenschaftsverwalter beginnt, die Kategorie "Gartenpflege" zu löschen
    Dann verdeckt die Erfolgsmeldung nicht, was den Fokus hat

  # #1096 (Helga P-3 in #1081): zwei Meldungen übereinander deckten bei 200 % die halbe Seite ab
  Szenario: Eine neue Erfolgsmeldung ersetzt die ältere
    Angenommen es gibt die umlagefähige Kategorie "Gartenpflege"
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" löscht
    Und der Liegenschaftsverwalter die Kategorie "Gartenpflege" löscht
    Dann bestätigt Dwello nur das Löschen der Kategorie "Gartenpflege"

  # #1096 (Helga P-3 in #1081): nach dem Löschen sprang die Seite nach oben zum Seitentitel
  Szenario: Nach dem Löschen steht der Fokus auf der nächsten Kategorie
    Angenommen es gibt die umlagefähige Kategorie "Heckenschnitt"
    Und es gibt die umlagefähige Kategorie "Heckenschnitt Ost", die in der Liste gleich auf "Heckenschnitt" folgt
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Und der Liegenschaftsverwalter ist in der Liste bei der Kategorie "Heckenschnitt"
    Wenn der Liegenschaftsverwalter die Kategorie "Heckenschnitt" löscht
    Dann steht der Fokus auf der Kategorie "Heckenschnitt Ost"
    Und bleibt die Seite an ihrer Stelle, bis die Erfolgsmeldung wieder geht

  # #1113 (Marco P-1 in #1096): auf dem Telefon lag die Meldung nach dem Löschen über «Löschen» der nächsten Kategorie
  Szenario: Die Erfolgsmeldung verdeckt die Kategorie mit dem Fokus nicht
    Angenommen das Browserfenster ist 390 auf 844 Pixel gross
    Und es gibt die umlagefähige Kategorie "Hagelschutz"
    Und es gibt die umlagefähige Kategorie "Hagelschutz Nord"
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Und die Kategorie "Hagelschutz" steht am unteren Rand des Fensters
    Wenn der Liegenschaftsverwalter die Kategorie "Hagelschutz" löscht
    Dann verdeckt die Erfolgsmeldung die Kategorie nicht, die den Fokus hat

  # #1124 (Helga P-3 in #1113): nach dem Speichern stand der Fokus auf dem Seitentitel, und die Meldung lag über «Löschen»
  # der gespeicherten Kategorie
  Szenario: Nach dem Speichern steht der Fokus auf der gespeicherten Kategorie
    Angenommen das Browserfenster ist 720 auf 450 Pixel gross
    Und es gibt die umlagefähige Kategorie "Hangsicherung"
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Hangsicherung" als nicht umlagefähig speichert
    Dann steht der Fokus auf der Kategorie "Hangsicherung"
    Und verdeckt die Erfolgsmeldung die Kategorie nicht, die den Fokus hat

  # #1128 (Helga, Sven P-2 in #1124): nach dem Erfassen stand der Fokus auf der Überschrift der Liste, und die Meldung lag
  # über «Löschen» der neuen Kategorie
  Szenario: Nach dem Erfassen steht der Fokus auf der neuen Kategorie
    Angenommen das Browserfenster ist 720 auf 450 Pixel gross
    Und der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die umlagefähige Kategorie "Hangsicherung" erfasst
    Dann steht der Fokus auf der Kategorie "Hangsicherung"
    Und verdeckt die Erfolgsmeldung die Kategorie nicht, die den Fokus hat

  # #672 (Helga P-3, P-5): die Hilfe bei der Beschreibung sagt, wofür sie dient
  Szenario: Die Beschreibung einer eigenen Kategorie sagt, wofür sie dient
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Dann erklärt Dwello bei «Beschreibung» "Beschreiben Sie, welche Kosten zu dieser Kategorie gehören. Die KI liest die Beschreibung, wenn Sie «Von der KI prüfen lassen» wählen und wenn sie für eine Rechnung eine Kategorie vorschlägt. Die Liste der Kategorien zeigt die Beschreibung unter dem Namen. Auf der Nebenkostenabrechnung steht sie nicht."

  Szenario: Die Beschreibung einer vordefinierten Kategorie sagt, wofür sie dient
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Heizung"
    Dann erklärt Dwello bei «Beschreibung» "Die Beschreibung sagt, welche Kosten zu dieser Kategorie gehören. Die KI liest die Beschreibung, wenn sie für eine Rechnung eine Kategorie vorschlägt. Auf der Nebenkostenabrechnung steht sie nicht."

  # #672 (Helga P-6): die Rückfrage nennt die Folgen des Löschens, auch dass es endgültig ist
  Szenario: Die Rückfrage vor dem Löschen einer Kategorie nennt die Folgen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter beginnt, die Kategorie "Treppenhausreinigung" zu löschen
    Dann erklärt die Rückfrage zum Löschen "Die Kategorie verschwindet aus der Auswahl beim Erfassen von Rechnungen. Bei den Mietverträgen löscht Dwello die Angaben, ob und ab wann diese Kategorie vereinbart ist. Was im unterschriebenen Mietvertrag steht, gilt weiter. Das lässt sich nicht rückgängig machen."

  # #672 (Helga P-9): ohne Zahl steht eine Kategorie ganz oben
  Szenario: Die Reihenfolge sagt, wo eine Kategorie ohne Zahl steht
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Dann erklärt Dwello bei «Reihenfolge» "Position in den Auswahllisten und in der Liste der Kategorien: kleinere Zahlen stehen weiter oben. Ohne Zahl steht die Kategorie ganz oben, wie mit der Zahl 0."

  Szenario: Eine Kategorie ohne Reihenfolge steht ganz oben
    Angenommen es gibt die umlagefähige Kategorie "Zaunpflege" mit der Reihenfolge 90
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Kategorie "Zaunpflege"
    Wenn der Liegenschaftsverwalter die Kategorie ohne Reihenfolge speichert
    Dann steht die Kategorie "Zaunpflege" in der Liste vor der vordefinierten Kategorie "Heizung"

  # #1160: eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat; ohne ihre Kategorie stünde eine Abrechnungsposition im neu erstellten PDF anders da
  Szenario: Kategorien in einer Abrechnung bleiben erhalten
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und im Gebäude "Seeblick" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "450.00" Franken vom "2025-03-31"
    Und für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Seeblick"
    Und die Rechnung "Treppenhausreinigung 2025-03-31" ist danach gelöscht
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" löscht
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Kategorie steht in einer Abrechnung und kann nicht gelöscht werden. Eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat, mit ihren Kategorien. Steht die Kategorie nur in Entwürfen, berechnen Sie diese mit «Neu berechnen» auf ihrer Seite neu oder löschen Sie sie. Danach lässt sich die Kategorie löschen."
    Und sieht der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung"

  # #1201: der Name einer Kategorie hat höchstens 100 Zeichen, wie in der Datenbank
  Szenario: Bei einem zu langen Namen einer Kategorie sagt Dwello, was zu tun ist
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Kategorie "Treppenhausreinigung"
    Wenn der Liegenschaftsverwalter bei "Name" einen Text von 101 Zeichen speichert
    Dann steht bei "Name" die Fehlermeldung "Höchstens 100 Zeichen. Kürzen Sie den Text."
    Und steht bei "Name" noch der Text von 101 Zeichen

  # #1304: der vergebene Name sagt auch, was zu tun ist, wie beim Verteilschlüssel (#1200)
  Szenario: Bei einem vergebenen Namen einer Kategorie sagt Dwello, was zu tun ist
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die umlagefähige Kategorie "Treppenhausreinigung" erfasst
    Dann steht bei "Name" die Fehlermeldung "Eine Kategorie mit dem Namen «Treppenhausreinigung» existiert bereits. Wählen Sie einen anderen Namen."

  # #1306: auch die Prüfung durch die KI lehnt einen zu langen Namen beim Namen ab, ohne die KI zu fragen
  Szenario: Bei einem zu langen Namen für die Prüfung durch die KI sagt Dwello, was zu tun ist
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter einen Namen von 101 Zeichen von der KI prüfen lässt
    Dann steht bei "Name" die Fehlermeldung "Höchstens 100 Zeichen. Kürzen Sie den Text."
    Aber sagt Dwello zur Prüfung durch die KI nicht "nicht erreichbar"
    Und steht bei "Name" noch der Text von 101 Zeichen
