# language: de
@invoices
Funktionalität: Rechnungsdetail
  Als Liegenschaftsverwalter
  möchte ich eine Rechnung im Detail sehen
  damit ich prüfen kann, wie sie in der Nebenkostenabrechnung verteilt wird

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und "Hauswart Huber" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung Q1" in der Kategorie "Hauswart" in Rechnung
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"

  Szenario: Rechnungsdetails anzeigen
    Dann sieht der Liegenschaftsverwalter den Betrag "CHF 450.00"
    Und sieht der Liegenschaftsverwalter die Kategorie "Hauswart" und den Verteilschlüssel "Pro Fläche (m²)"
    Und ist die Rechnung umlagefähig

  Szenario: Umlagefähige Rechnung nennt den Grund ihrer Kategorie
    Dann ist die Rechnung umlagefähig
    Und nennt die Rechnung als Grund der Umlagefähigkeit ihrer Kategorie "Die Hauswartung ist also umlagefähig."

  Szenario: Nicht umlagefähige Rechnung nennt den Grund ihrer Kategorie
    Angenommen "Dachdecker Meier" stellt dem Gebäude "Seeblick" "3200.00" Franken für "Dachreparatur" in der Kategorie "Reparaturen" in Rechnung
    Und die Rechnung von "Dachdecker Meier" hat keinen Verteilschlüssel
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Dachdecker Meier"
    Dann ist die Rechnung nicht umlagefähig
    Und nennt die Rechnung als Grund der Umlagefähigkeit ihrer Kategorie "Reparaturen sind mit dem Mietzins abgegolten, also nicht umlagefähig."
    Und erklärt kein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst
    Und sagt die Rechnung ohne Verteilschlüssel nicht, wie sie verteilt würde

  # Die Rechnung weicht von ihrer Kategorie ab: kein Grund, der ihr widerspricht (Fachreview 292 V-3)
  Szenario: Ausgeschlossene Rechnung einer umlagefähigen Kategorie nennt keinen Grund
    Angenommen die Rechnung von "Hauswart Huber" ist inzwischen als nicht umlagefähig markiert
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann ist die Rechnung nicht umlagefähig
    Und erklärt ein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst
    Und nennt die Rechnung keinen Grund der Umlagefähigkeit

  # Eine eigene Kategorie hat keinen festen Grund: der allgemeine Hinweis bleibt (#292)
  Szenario: Nicht umlagefähige Rechnung einer eigenen Kategorie
    Angenommen es gibt die nicht umlagefähige Kategorie "Dachsanierung"
    Und "Dachdecker Meier" stellt dem Gebäude "Seeblick" "3200.00" Franken für "Dach Nord" in der Kategorie "Dachsanierung" in Rechnung
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Dachdecker Meier"
    Dann erklärt ein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst
    Und nennt die Rechnung keinen Grund der Umlagefähigkeit

  Szenario: Neu kategorisieren ohne laufende KI
    Wenn der Liegenschaftsverwalter die Rechnung neu kategorisieren lässt
    Dann erfährt der Liegenschaftsverwalter, dass die KI nicht erreichbar ist oder keine passende Kategorie geliefert hat
    Und sieht der Liegenschaftsverwalter die Kategorie "Hauswart" und den Verteilschlüssel "Pro Fläche (m²)"

  Szenario: Rechnung löschen
    Wenn der Liegenschaftsverwalter die Rechnung löscht
    Dann ist der Liegenschaftsverwalter auf der Rechnungsliste
    Und die Rechnung von "Hauswart Huber" ist nicht mehr auffindbar

  Szenario: Rechnung bearbeiten
    Wenn der Liegenschaftsverwalter die Rechnung bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnung bearbeiten"

  Szenario: Zum Gebäude wechseln
    Wenn der Liegenschaftsverwalter das Gebäude der Rechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Seeblick"

  Szenario: Beleg einer Rechnung anzeigen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann öffnet der Beleg die PDF-Datei "huber-q1.pdf"

  Szenario: Beleg ersetzen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann erklärt der Beleg "Wählen Sie die neue Datei und dann «Beleg ersetzen»."
    Wenn der Liegenschaftsverwalter den Beleg durch das Foto "huber-q1.jpg" ersetzt
    Dann öffnet der Beleg die JPG-Datei "huber-q1.jpg"

  Szenario: Beleg zu einer erfassten Rechnung hinzufügen
    Wenn der Liegenschaftsverwalter das Foto "huber-q1.jpg" als Beleg hinzufügt
    Dann öffnet der Beleg die JPG-Datei "huber-q1.jpg"
    Und erinnert Dwello daran, die Originalrechnung aufzubewahren

  Szenario: Warnung beim Ersetzen des Belegs einer abgerechneten Rechnung
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann warnt der Beleg "Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen."

  # #96: eine abgerechnete Rechnung, die danach geändert wurde, steht in den Abrechnungen mit ihrem früheren Stand
  Szenario: Warnung bei einer nach der Abrechnung geänderten Rechnung
    Angenommen im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und die Rechnung von "Hauswart Huber" kostet danach "480.00" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann warnt die Rechnung "gibt es schon Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon"

  # #378: von der Warnung zu den Abrechnungen, die neu zu erstellen oder zu berichtigen sind
  Szenario: Von der Warnung zu den Abrechnungen der Periode
    Angenommen im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und die Rechnung von "Hauswart Huber" kostet danach "480.00" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Abrechnungen ohne diese Rechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"
    Und erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen der Abrechnungsperiode des laufenden Jahres zeigt

  Szenario: Rechnung mit Beleg löschen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Rechnung löschen will
    Dann sagt die Bestätigung zum Löschen der Rechnung "Der Beleg wird ebenfalls gelöscht."

  Szenario: Abgerechnete Rechnung mit Beleg löschen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Rechnung löschen will
    Dann rät die Bestätigung zum Löschen der Rechnung "Laden Sie den Beleg vorher herunter, wenn Sie ihn für die Belegeinsicht brauchen."

  # #455 (#268): der Hinweis steht beim Betrag, nicht beim Beleg; die Regel als Hilfetext darunter
  @wip
  Szenario: Abgezogene Akontorechnungen beim Betrag
    Angenommen "Werke Luzern" stellt dem Gebäude "Seeblick" "1250.00" Franken für "Allgemeinstrom Q1" in der Kategorie "Allgemeinstrom" in Rechnung, auf dem Beleg sind Akontorechnungen von "1000.00" Franken abgezogen
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Werke Luzern"
    Dann steht beim Betrag der Rechnung "Auf dem Beleg sind Akontorechnungen von CHF 1’000.00 abgezogen. Der Betrag ist das Total vor dem Abzug, weniger die Akontorechnungen, die schon abgerechnet sind."
    Und erklärt der Hinweis beim Betrag der Rechnung "Prüfen Sie, dass sie nur einmal zählen: Die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, ihr Betrag ist vom Total abgezogen, und der Leistungszeitraum beginnt erst nach der Abrechnungsperiode, in der sie abgerechnet ist. Ergibt das Total weniger diese Akontorechnungen 0, löschen Sie diese Rechnung mit «Rechnung löschen». Ergibt es weniger als 0, löschen Sie sie auch: Verringern Sie den Betrag der abgerechneten Akontorechnungen um den Unterschied, und berichtigen Sie die Abrechnungen mit ihnen."

  # #455 (#263): abgerechnet heisst in einer Nebenkostenabrechnung enthalten, gleich welchen Status sie hat
  @wip
  Szenario: Die Rechnung nennt die Abrechnungen, in denen sie enthalten ist
    Angenommen im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann nennt die Rechnung als enthalten in die Abrechnung des laufenden Jahres von "Anna Keller" im Status "Entwurf"

  @wip
  Szenario: Eine Rechnung, die in keiner Abrechnung enthalten ist
    Dann nennt die Rechnung als enthalten in "Keine"

  @wip
  Szenario: Von der Rechnung zur Abrechnung, in der sie enthalten ist
    Angenommen im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Abrechnung des laufenden Jahres von "Anna Keller" öffnet, in der die Rechnung enthalten ist
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung des laufenden Jahres von "Anna Keller"
