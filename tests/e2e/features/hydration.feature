# language: de
@hydration
Funktionalität: Bedienung während die Seite lädt
  Als Liegenschaftsverwalter
  möchte ich auswählen können, bevor eine Seite fertig geladen ist
  damit bei einer langsamen Verbindung keine Eingabe verloren geht

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Beat Huber" existiert
    Und "Beat Huber" mietet die Wohnung "2.02" seit "2014-01-01" für "950" Franken mit "150" Franken Akonto
    Und für "Beat Huber" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnung 2024
    Und der Mieter "Anna Keller" existiert

  Szenario: Gebäude in der Wohnungsliste wählen, bevor die Liste fertig geladen ist
    Angenommen der Liegenschaftsverwalter ist auf der Wohnungsliste
    Wenn der Liegenschaftsverwalter das Gebäude "Ahornhof" wählt, bevor die Wohnungsliste fertig geladen ist, und sucht
    Dann die Wohnungsliste enthält genau 2 Wohnungen

  Szenario: Gebäude in der Abrechnungsliste wählen, bevor die Liste fertig geladen ist
    Angenommen der Liegenschaftsverwalter ist auf der Abrechnungsliste
    Wenn der Liegenschaftsverwalter das Gebäude "Ahornhof" wählt, bevor die Abrechnungsliste fertig geladen ist, und sucht
    Dann sieht der Liegenschaftsverwalter die Abrechnung von "Beat Huber" mit dem Status "Entwurf"

  Szenario: Mieter im neuen Mietvertrag wählen, bevor die Seite fertig geladen ist
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt, bevor die Seite fertig geladen ist
    Und der Liegenschaftsverwalter die Wohnung "2.01" ab "2027-01-01" für "950" Franken vermietet
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Und der Mietvertrag von "Anna Keller" ist in der Liste auffindbar
