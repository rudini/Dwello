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

  Szenario: Vordefinierte Kategorien nennen den Grund ihrer Umlagefähigkeit
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann nennt die vordefinierte Kategorie "Feuerlöscher-Wartung" als Grund "nicht mit dem Gebrauch zusammen"
    Und nennt die vordefinierte Kategorie "Lift" als Grund "Reparaturen, Ersatzteile und Serviceabos mit Reparaturen trägt der Vermieter"
    Und erfährt der Liegenschaftsverwalter, dass der Mieter umlagefähige Kosten nur bezahlt, wenn der Mietvertrag sie nennt

  Szenario: Grund der Umlagefähigkeit beim Bearbeiten einer vordefinierten Kategorie
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Feuerlöscher-Wartung"
    Dann nennt die Kategorie als Grund "nicht mit dem Gebrauch zusammen"

  # Die Beschreibung nennt, was nicht dazugehört («ohne …», #204); die längste ist die der Heizung
  Szenario: Ganze Beschreibung einer vordefinierten Kategorie auf dem Telefon
    Angenommen der Liegenschaftsverwalter benutzt ein Telefon
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie "Heizung"
    Dann zeigt das Feld «Beschreibung» seinen ganzen Text

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
