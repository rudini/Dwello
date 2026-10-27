# language: de
@heating-profiles
Funktionalität: Heizprofile
  Als Liegenschaftsverwalter
  möchte ich festlegen, wie sich die Heizkosten auf die Monate verteilen
  damit Mieter bei einem Wechsel nur die Heizkosten ihrer Mietdauer tragen

  Grundlage:
    Angenommen das Heizprofil "Bergtal" verteilt die Heizkosten so:
      | Monat     | Anteil |
      | Januar    | 20     |
      | Februar   | 16     |
      | März      | 12     |
      | April     | 6      |
      | Mai       | 2      |
      | Juni      | 0      |
      | Juli      | 0      |
      | August    | 0      |
      | September | 2      |
      | Oktober   | 8      |
      | November  | 14     |
      | Dezember  | 20     |

  Szenario: Heizprofil ansehen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Heizprofils "Bergtal"
    Dann trägt der Januar im Heizprofil "20 %" der Heizkosten
    Und ergeben die Monatsanteile zusammen "100 %"

  Szenario: Heizprofil erfassen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neues Heizprofil"
    Wenn der Liegenschaftsverwalter das Heizprofil "Seeufer" mit "16.4" % im Januar und je "7.6" % in den übrigen Monaten erfasst
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Seeufer"
    Und trägt der Januar im Heizprofil "16.4 %" der Heizkosten

  Szenario: Monatsanteile ergeben nicht 100 %
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neues Heizprofil"
    Wenn der Liegenschaftsverwalter das Heizprofil "Seeufer" mit "6.4" % im Januar und je "7.6" % in den übrigen Monaten erfasst
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Monatsanteile müssen zusammen 100 % ergeben (aktuell 90 %)."

  # #655: die Ablehnung steht am Feld Name, wie bei den Kategorien
  Szenario: Name ist schon vergeben
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neues Heizprofil"
    Wenn der Liegenschaftsverwalter das Heizprofil "Bergtal" noch einmal erfasst
    Dann erfährt der Liegenschaftsverwalter beim Namen, dass es das Heizprofil "Bergtal" schon gibt

  Szenario: Name eines vordefinierten Heizprofils ist schon vergeben
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neues Heizprofil"
    Wenn der Liegenschaftsverwalter ein Heizprofil unter dem Namen "Heizung + Warmwasser" erfasst
    Dann erfährt der Liegenschaftsverwalter beim Namen, dass es das Heizprofil "Heizung + Warmwasser" schon gibt

  Szenario: Heizprofil anpassen
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Heizprofils "Bergtal"
    Wenn der Liegenschaftsverwalter den Januar auf "18" % und den Dezember auf "22" % ändert
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Bergtal"
    Und trägt der Januar im Heizprofil "18 %" der Heizkosten

  # #230: eine Abrechnung behält die Anteile, mit denen sie erstellt wurde; eine Änderung wirkt erst auf neue
  Szenario: Bearbeitung eines Heizprofils sagt, dass bestehende Abrechnungen ihre Anteile behalten
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Heizprofils "Bergtal"
    Dann erklärt die Bearbeitungsseite bei den Monatsanteilen "Bestehende Abrechnungen behalten die Monatsanteile, mit denen sie erstellt wurden. Um Entwürfe neu zu berechnen, wählen Sie auf jedem Entwurf aller Mietverträge der betroffenen Wohnungen in der betroffenen Abrechnungsperiode «Neu berechnen». Versendete Abrechnungen lassen sich nicht neu berechnen."

  Szenario: Heizprofil löschen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Heizprofils "Bergtal"
    Wenn der Liegenschaftsverwalter das Heizprofil löscht
    Dann ist der Liegenschaftsverwalter auf der Seite "Heizprofile"
    Und fehlt das Heizprofil "Bergtal" in der Liste

  Szenario: Vordefinierte Heizprofile bleiben unverändert
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Heizprofile"
    Wenn der Liegenschaftsverwalter das Heizprofil "Heizung Bergregion" öffnet
    Dann kann der Liegenschaftsverwalter das Heizprofil weder bearbeiten noch löschen

  Szenario: Bearbeitung abbrechen
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Heizprofils "Bergtal"
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Bergtal"
