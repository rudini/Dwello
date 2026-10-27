# Sven – #655: Doppelter Name bei Heizprofil und Verteilschlüssel

Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Baum. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/ad862b70-2b73-562f-beb6-23e157e4abea/scratchpad/sven-i655/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neues Heizprofil | Der Name «Heizung + Warmwasser» des vordefinierten Heizprofils wird nicht abgelehnt: «Heizprofil speichern» speichert ein zweites Heizprofil mit genau diesem Namen. Die Liste «Heizprofile» hat danach zwei gleichlautende Überschriften «Heizung + Warmwasser», die ich nur am Zusatz «Vordefiniert» oder «Eigenes Heizprofil» auseinanderhalte. Abgelehnt wird der Name erst, wenn bereits ein eigenes Heizprofil so heisst. Beim Verteilschlüssel wird der Name des vordefinierten Schlüssels «Pro Fläche (m²)» dagegen abgelehnt. |

## Beobachtungen

- Wenn Dwello ablehnt (Verteilschlüssel immer, Heizprofil bei einem schon vorhandenen eigenen Namen), ist es für mich gut gelöst: Der Fokus springt auf das Feld «Name». Das Feld hat `aria-invalid="true"` und als Beschreibung «Beispiel: … | Ein Heizprofil mit dem Namen «Heizung + Warmwasser» existiert bereits.» bzw. «Ein Verteilschlüssel mit dem Namen «Pro Fläche (m²)» existiert bereits.». Der Screenreader liest also Feldname, Wert, «ungültig» und die Meldung. Eine zusätzliche Live-Ansage gibt es nicht; die brauche ich auch nicht, weil der Fokus die Meldung mitbringt.
- Die übrigen Eingaben bleiben stehen (Monatsanteile, Formel). Sobald ich den Namen ändere, verschwinden `aria-invalid` und die Fehlerbeschreibung sofort. Gespeichert habe ich den korrigierten Namen nicht.
- Die Schaltflächen heissen «Heizprofil erfassen» und «Verteilschlüssel erfassen», nicht «Neues …» wie in meinem Auftrag. Die Seiten selbst heissen «Neues Heizprofil» und «Neuer Verteilschlüssel». Ich habe sie trotzdem gefunden.
- Nach jedem Seitenwechsel steht der Fokus auf `body`, angesagt wird der Seitentitel (assertive Region, z. B. «Neues Heizprofil - Dwello»). Mit «Zum Inhalt springen» komme ich gleich zum Hauptinhalt.
- Die Summe der Monatsanteile wird beim Tippen über eine Statusregion angesagt («Summe: 50 % – es fehlen noch 50 %», «Summe: 100 % – stimmt»). Das hilft.
- Das Feld «Formel» ist beim Öffnen schon mit `{area}` ausgefüllt. Das wird nicht angesagt, ich höre es nur am Wert des Felds.
- In der Liste «Verteilschlüssel» sind die Zeilen keine Links (nur Text). Bei den Heizprofilen ist der Name ein Link in einer Überschrift.
- Nach dem Speichern eines Heizprofils (P-1) liegt der Fokus auf der Überschrift der Detailseite, und die Statusmeldung «Heizprofil «Heizung + Warmwasser» gespeichert» wird angesagt. Auch nach dem Löschen sagt eine Statusmeldung an, was geschehen ist.

## Aufgabe geschafft: teilweise

Beim Verteilschlüssel lief alles wie erwartet. Beim Heizprofil hat Dwello den vorhandenen Namen nicht abgelehnt und gespeichert (P-1). Diesen Datensatz habe ich danach selbst wieder gelöscht.

## Aufwand

Etwa 25 Minuten, 9 Skriptläufe. Pro Formular etwa 20 Tastendrücke bis zum Speichern.

## Ablauf

1. Neues Heizprofil, Name «Heizung + Warmwasser», Januar 50 %, Dezember 50 %, «Heizprofil speichern».
   Erwartet: Dwello lehnt ab, der Fokus geht zum Feld «Name», die Meldung hängt am Feld.
   Gesehen: Gespeichert (POST auf `/config/heating-profiles/new`, weiter zur Detailseite `/config/heating-profiles/45d9e260-…`). Angesagt wurde «Heizprofil «Heizung + Warmwasser» gespeichert». Die Liste zeigte zwei «Heizung + Warmwasser» (Bild `03-heizprofile-liste-doppelt.png`: oben «Eigenes Heizprofil», darunter «Vordefiniert»).
2. Gleicher Versuch noch einmal, jetzt gab es bereits ein eigenes Heizprofil mit dem Namen.
   Erwartet: wie in Schritt 1.
   Gesehen: abgelehnt. Fokus, `aria-invalid` und Beschreibung wie oben unter Beobachtungen; die Monatsanteile blieben stehen (Bilder `04-…` und `08-heizprofil-abgelehnt.png`: rote Meldung unter dem Feld «Name»).
3. Mein Heizprofil aus Schritt 1 über «Löschen» und den Bestätigungsdialog gelöscht. Der Fokus lag im Dialog zuerst auf «Abbrechen», danach auf der Überschrift «Heizprofile». Danach war wieder nur das vordefinierte «Heizung + Warmwasser» in der Liste.

Beim Verteilschlüssel entsprach alles meinen Erwartungen.

## Vorschläge

- **P-1:** Einstellungen → Heizprofile → «Heizprofil erfassen» → Name «Heizung + Warmwasser» (vordefiniert), Monatsanteile mit 100 % Summe → «Heizprofil speichern»: Das Heizprofil wird gespeichert. Hilfreich wäre, wenn die Prüfung auf den gleichen Namen auch die vordefinierten Heizprofile einschliesst, wie beim Verteilschlüssel. Dann käme dieselbe Meldung am Feld «Name».

## Nicht geprüft

- Ob die Auswahl «Standard-Heizprofil» unter Einstellungen zwei gleichlautende Einträge «Heizung + Warmwasser (100%)» zeigt, solange es das doppelte Heizprofil gab. Ich habe es vor dem Löschen nicht angesehen, und neu anlegen wollte ich es nicht, weil in dieser Aufgabe nichts gespeichert werden soll.
- Gross-/Kleinschreibung oder Leerzeichen am Ende des Namens habe ich nicht ausprobiert, das stand nicht in der Aufgabe.
- Ein echter Screenreader (NVDA, VoiceOver) war nicht verfügbar. Ich habe den Accessibility-Baum, den Fokus, `aria-invalid`/`aria-describedby` und die Änderungen in den Live-Regionen gelesen.
