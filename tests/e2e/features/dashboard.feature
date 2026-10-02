# language: de
@dashboard
Funktionalität: Dashboard
  Als Liegenschaftsverwalter
  möchte ich auf einen Blick sehen, wie es um meine Liegenschaften steht
  damit ich weiss, wo ich handeln muss

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.02"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken

  Szenario: Belegung pro Gebäude
    Wenn der Liegenschaftsverwalter das Dashboard öffnet
    Dann ist das Gebäude "Seeblick" zu "50.0%" belegt
    Und sind im Gebäude "Seeblick" "1/2" Wohnungen vermietet

  Szenario: Gebäude aus der Belegung öffnen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter in der Belegung das Gebäude "Seeblick" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Seeblick"

  Szenario: Leere Wohnungen ansehen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter die Kennzahl "Leer" öffnet
    Dann sieht der Liegenschaftsverwalter die leeren Wohnungen

  Szenario: Überfällige Abrechnungen ansehen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter die überfälligen Abrechnungen öffnet
    Dann sieht der Liegenschaftsverwalter die überfälligen Abrechnungen

  Szenario: Abrechnungen über die Schnellaktion erstellen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter die Schnellaktion "Abrechnungen erstellen" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Abrechnungen erstellen"
