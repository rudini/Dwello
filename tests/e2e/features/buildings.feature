# language: de
@buildings
Funktionalität: Gebäudeliste
  Als Liegenschaftsverwalter
  möchte ich alle meine Gebäude überblicken
  damit ich schnell das richtige Gebäude finde

  Grundlage:
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und der Liegenschaftsverwalter ist auf der Gebäudeliste

  Szenario: Gebäude wird in der Liste angezeigt
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste

  # F-4 (#58): dieselben Worte wie Übersicht und Wohnungsseiten
  Szenario: Künftig vermietete Wohnung auf der Gebäudekarte
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Carla Rossi" existiert
    Und "Carla Rossi" mietet die Wohnung "1.01" seit "2099-11-01" für "900" Franken
    Wenn der Liegenschaftsverwalter nach "Lindenhof" sucht
    Dann nennt die Karte des Gebäudes "Lindenhof" "1 vermietet ab 01.11.2099"

  Szenario: Gebäude nach Namen suchen
    Wenn der Liegenschaftsverwalter nach "Lindenhof" sucht
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste
    Und die Liste enthält genau 1 Gebäude

  Szenario: Suche ohne Treffer
    Wenn der Liegenschaftsverwalter nach "Gibt es nicht" sucht
    Dann sieht der Liegenschaftsverwalter den Hinweis "Keine Gebäude gefunden"

  # #682 (Sven): ohne Treffer bietet nur der Hinweis an, die Filter zurückzusetzen
  Szenario: Eine Suche ohne Treffer bietet nur einmal an, die Filter zurückzusetzen
    Wenn der Liegenschaftsverwalter nach "Gibt es nicht" sucht
    Dann sieht der Liegenschaftsverwalter den Hinweis "Keine Gebäude gefunden"
    Und bietet die Seite nur einmal an, die Filter zurückzusetzen

  # #682 (Sven): die Hilfe steht sichtbar am Feld, nicht als Platzhalter; ein Filter heisst ohne «(optional)»
  Szenario: Die Gebäudesuche erklärt, wonach sie sucht
    Dann erklärt die Gebäudesuche "Suchen Sie nach Name oder Adresse des Gebäudes."
    Und heisst die Gebäudesuche "Suche"
    Und heisst der Ortsfilter "Ort"

  # #160, #373: jedes Wort muss zum Namen, zur Strasse oder zum Ort passen
  Szenario: Gebäude wortweise nach Name und Ort suchen
    Wenn der Liegenschaftsverwalter nach "Lindenhof Winterthur" sucht
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste
    Und die Liste enthält genau 1 Gebäude
    Wenn der Liegenschaftsverwalter nach "Lindenhof Uster" sucht
    Dann sieht der Liegenschaftsverwalter den Hinweis "Keine Gebäude gefunden"

  # #1193 (Marco): die Adresse, wie die Karte sie zeigt, und die Postleitzahl allein finden das Gebäude
  Szenario: Gebäude nach der ganzen Adresse suchen
    Angenommen das Gebäude "Seeblick" an der "Seeweg 15" in "6003 Luzern" existiert
    Wenn der Liegenschaftsverwalter nach "Seeweg 15, 6003 Luzern" sucht
    Dann sieht der Liegenschaftsverwalter das Gebäude "Seeblick" in der Liste
    Und die Liste enthält genau 1 Gebäude

  Szenario: Gebäude nach der Postleitzahl suchen
    Angenommen das Gebäude "Seeblick" an der "Seeweg 15" in "6003 Luzern" existiert
    Wenn der Liegenschaftsverwalter nach "6003" sucht
    Dann sieht der Liegenschaftsverwalter das Gebäude "Seeblick" in der Liste

  # #1193: der Ort einer Schweizer Adresse steht mit der Postleitzahl
  Szenario: Gebäude im Ort nach der Postleitzahl filtern
    Angenommen das Gebäude "Seeblick" an der "Seeweg 15" in "6003 Luzern" existiert
    Wenn der Liegenschaftsverwalter die Gebäude nach dem Ort "6003 Luzern" filtert
    Dann sieht der Liegenschaftsverwalter das Gebäude "Seeblick" in der Liste

  Szenario: Gebäude nach Ort filtern
    Wenn der Liegenschaftsverwalter die Gebäude nach dem Ort "Winterthur" filtert
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste

  Szenario: Zur Erfassung eines neuen Gebäudes wechseln
    Wenn der Liegenschaftsverwalter ein neues Gebäude erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neues Gebäude"

  Szenario: Gebäude öffnen
    Wenn der Liegenschaftsverwalter das Gebäude "Lindenhof" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lindenhof"

  Szenario: Route zum Gebäude planen
    Dann führt die Route in Google Maps von der Liste zu "Lindenhof" an "Testweg 1, 8400 Winterthur"

  # #680: die Suche zeigt immer genau, wonach die Liste gefiltert ist; ein nicht gesuchter Text fällt weg
  Szenario: Ein nicht gesuchter Text fällt weg, wenn die Gebäudeliste über die Hauptnavigation wieder geöffnet wird
    Wenn der Liegenschaftsverwalter "Gibt es nicht" in die Suche eingibt
    Und der Liegenschaftsverwalter in der Hauptnavigation "Gebäude" wählt
    Dann zeigt die Suche ""

  Szenario: Ein nicht gesuchter Text fällt weg, wenn der Browser die Gebäudeliste wieder zeigt
    Wenn der Liegenschaftsverwalter nach "Lindenhof" sucht
    Und der Liegenschaftsverwalter "Gibt es nicht" in die Suche eingibt
    Und der Liegenschaftsverwalter über die Adresszeile eine andere Seite öffnet
    Und der Liegenschaftsverwalter im Browser zurückgeht
    Dann zeigt die Suche "Lindenhof"
