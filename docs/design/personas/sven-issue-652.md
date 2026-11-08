# Sven – Issue 652: Wem gehört welche Aktion?

Persona: Sven, 45, blind, Screenreader und nur Tastatur, Desktop 1440 × 900. Beurteilt wurde, was der Barrierefreiheitsbaum ansagt (Name, Rolle, Beschreibung des fokussierten Elements). Nichts gespeichert, gelöscht oder beendet; Dialoge nur geöffnet und mit Escape abgebrochen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| S-1 | Minor | Mietverträge (Liste) | Jede Zeile ist ein Link, der nur den Mieter nennt. Kevin Fischer hat zwei Mietverträge, also höre ich zweimal «Link Kevin Fischer» mit zwei verschiedenen Zielen. In der Linkliste des Screenreaders kann ich die beiden nicht auseinanderhalten; Wohnung, Gebäude und Status stehen nur im Text nach dem Link. |
| S-2 | Minor | Mieter Kevin Fischer, Abschnitt «Mietverträge» | Zwei Links mit genau demselben Namen «Mietvertrag Wohnung 1.01» führen zu zwei verschiedenen Mietverträgen (Alpenblick laufend, Musterhaus Zentrum beendet). Das Gebäude fehlt im Namen; erst der Text danach («Laufend seit …», «Beendet …») unterscheidet sie. |
| S-3 | Minor | Mietvertrag von Kevin Fischer (beendet), Löschdialog | Beide Mietverträge von Kevin Fischer sagen dieselben Aktionen an: «Bearbeiten: Mietvertrag von Kevin Fischer», «Löschen: Mietvertrag von Kevin Fischer». Der Löschdialog heisst dann nur «Mietvertrag löschen?», ohne Mieter, Wohnung oder Gebäude; seine Beschreibung nennt Kevin Fischer und den Beginn 01.06.2018, aber nicht die Wohnung. Die anderen Dialoge nennen den Vertrag im Titel («Mietvertrag von Hans Müller, Wohnung 1.01, beenden?», «Mietvertrag von Hans Müller kann nicht gelöscht werden»). Gerade bei der folgenschwersten Aktion höre ich also am wenigsten, welcher Vertrag es ist. |
| S-4 | Minor | Wohnung 1.01 (Alpenblick) und Wohnung 1.01 (Musterhaus Zentrum) | Die Aktionen heissen auf beiden Seiten gleich: «Bearbeiten: Wohnung 1.01», «Löschen: Wohnung 1.01»; der Löschdialog heisst «Wohnung 1.01 kann nicht gelöscht werden». Das Gebäude steht weder im Namen der Aktion noch in der Überschrift, nur in der Brotkrümelnavigation; unter der Überschrift steht bloss die Adresse. |
| S-5 | Minor | Gebäude Musterhaus Zentrum; Mieter Kevin Fischer | Nicht alle Aktionen oben nennen ihren Datensatz: «Rechnungen ansehen» (Gebäude) und «Mietvertrag erfassen» (Mieter) stehen ohne Namen neben «Bearbeiten: Musterhaus Zentrum» bzw. «Bearbeiten: Kevin Fischer». Wer mit Tab durch die Aktionen geht, hört bei diesen beiden nicht, für welches Gebäude bzw. welchen Mieter sie gelten, und das Muster wirkt uneinheitlich. Französisch genau gleich («Voir les factures», «Saisir un contrat de bail»). |

## Was der Screenreader ansagt

Mietverträge (Liste), Zeilen mit Tab: «Link Nina Brunner», «Link Marco Bernasconi», «Link Pierre Dubois», «Link Laura Keller», «Link Anna Schmidt» … bis «Link Kevin Fischer» (zweimal, siehe S-1). Danach im Lesemodus pro Zeile: «Wohnung A2 · Seepark Residenz Laufend seit 01.07.2025, unbefristet», Nettomiete und Monatlich total als Begriff/Definition. Die Liste ist eine Region «11 Mietverträge» mit gleichnamiger Überschrift.

Aktionen oben auf den Detailseiten (Tab-Reihenfolge):

| Seite | Ansage |
|---|---|
| Mietvertrag von Hans Müller (laufend) | Link «Bearbeiten: Mietvertrag von Hans Müller»; Schalter «Enddatum erfassen: Mietvertrag von Hans Müller»; Schalter «Löschen: Mietvertrag von Hans Müller» |
| Mietvertrag von Kevin Fischer (beendet, Musterhaus) | Link «Bearbeiten: Mietvertrag von Kevin Fischer»; Schalter «Löschen: Mietvertrag von Kevin Fischer» (kein «Enddatum erfassen», passt) |
| Gebäude Musterhaus Zentrum | Link «Rechnungen ansehen»; Link «Bearbeiten: Musterhaus Zentrum»; Schalter «Löschen: Musterhaus Zentrum» |
| Wohnung 1.02 / Wohnung 1.01 | Link «Bearbeiten: Wohnung 1.02»; Schalter «Löschen: Wohnung 1.02» (1.01 analog) |
| Mieter Kevin Fischer | Link «Bearbeiten: Kevin Fischer»; Link «Mietvertrag erfassen»; Schalter «Löschen: Kevin Fischer» |
| Heizprofile | Kein eigenes Heizprofil in den Demodaten, nur vier vordefinierte. Das vordefinierte «Heizung Mittelland» hat keine Aktionen («Folgt der üblichen Praxis und lässt sich nicht ändern.»). Übersprungen. |

Dialoge (alle: Fokus im Dialog, Escape schliesst, Fokus kehrt auf den auslösenden Schalter zurück):

- «Enddatum erfassen» bei Hans Müller: Dialog «Mietvertrag von Hans Müller, Wohnung 1.01, beenden?», Fokus im Feld «Vertragsende» mit Beschreibung. Gut.
- «Löschen» bei Hans Müller: Dialog «Mietvertrag von Hans Müller kann nicht gelöscht werden», Fokus auf «Schliessen», Links «NK-11111111-2025-0001 (versendet)» und «NK-11111111-2024-0001 (bezahlt)». Gut.
- «Löschen» bei Kevin Fischer (beendet): Dialog «Mietvertrag löschen?», Fokus auf dem Dialog selbst, Beschreibung wird vorgelesen (S-3).
- «Löschen» bei Musterhaus Zentrum: «Musterhaus Zentrum kann nicht gelöscht werden». Gut.
- «Löschen» bei Wohnung 1.02: «Wohnung 1.02 kann nicht gelöscht werden» (S-4 bei 1.01).
- «Löschen» bei Kevin Fischer (Mieter): «Kevin Fischer kann nicht gelöscht werden». Gut.

Französisch (Mietvertrag Hans Müller, danach Kevin Fischer, Liste, Gebäude, Wohnung, Mieter): «Modifier : Contrat de bail de Hans Müller», «Saisir la date de fin : Contrat de bail de Hans Müller», «Supprimer : Contrat de bail de Hans Müller»; Gebäude «Modifier : Musterhaus Zentrum», «Supprimer : Musterhaus Zentrum», dazu «Voir les factures»; Wohnung «Modifier : Appartement 1.01»; Mieter «Modifier : Kevin Fischer», «Saisir un contrat de bail», «Supprimer : Kevin Fischer». Der Löschdialog heisst auch hier nur «Supprimer le contrat de bail ?». Kein Deutsch gehört. Dieselben Befunde wie auf Deutsch.

## Beobachtungen

- Muster «Verb: Datensatz» gefällt mir: Das sichtbare Wort steht am Anfang des Namens, Sprachsteuerung mit «Bearbeiten» würde also auch funktionieren. Im Lesemodus höre ich den Datensatz direkt nach der Überschrift dreimal hintereinander («Mietvertrag von Hans Müller» als Überschrift, dann bei Bearbeiten, Enddatum erfassen, Löschen). Das ist etwas lang, aber für mich in Ordnung: Mit Tab oder in der Schalterliste brauche ich genau diesen Namen.
- Nach jeder Seitennavigation liegt der Fokus auf keinem Element (Dokument); eine Statusmeldung mit dem Seitentitel («Mietverträge - Dwello») ist im Baum vorhanden. Mit dem nächsten Tab lande ich bei «Zum Inhalt springen» bzw. oben in der Kopfzeile, also muss ich jedes Mal durch die ganze Hauptnavigation (17 Links), wenn ich den Sprunglink nicht nutze.
- Auf der Mietvertragsseite stehen die Links «2021 abrechnen», «Rechnungen 2021 ansehen» usw. ohne Gebäudenamen; im Zusammenhang der Seite verständlich.
- Hans Müller zeigt «3 Abrechnungen fehlen» (2021–2023), obwohl es Abrechnungen 2024 und 2025 gibt (laut Löschdialog). Nicht Teil der Aufgabe, nur notiert.
- Die Sprachwahl ist ein Schalter «Sprache: Deutsch» mit [expanded]; darin Schalter «Deutsch», «Français» ohne Ansage, welche Sprache gerade gilt.
- Die Gebäudeliste nennt zusätzliche Links «Route planen zu Alpenblick (öffnet in neuem Tab)», gut benannt.

## Aufgabe geschafft: ja

(Heizprofil übersprungen: kein eigenes vorhanden.)

## Aufwand

Etwa 25 Minuten, 9 Durchläufe mit Tastatur (Tab, Enter, Escape, Pfeiltasten), rund 200 Tastendrücke.

## Ablauf

- Mietvertragsliste: erwartet, dass ich jede Zeile am Linknamen eindeutig erkenne; gehört: zweimal «Kevin Fischer» (S-1).
- Löschen beim beendeten Vertrag von Kevin Fischer: erwartet einen Dialogtitel mit Mieter und Wohnung wie beim Beenden-Dialog; gehört: «Mietvertrag löschen?» (S-3).
- Wohnung 1.01 in Alpenblick: erwartet, dass das Gebäude in der Aktion vorkommt; gehört: «Löschen: Wohnung 1.01», genau wie in Musterhaus Zentrum (S-4).
- Gebäudeseite, erster Tab-Halt: erwartet «Bearbeiten: Musterhaus Zentrum»; gehört zuerst «Rechnungen ansehen» ohne Namen (S-5).
- Mieterseite, Mietverträge: erwartet zwei unterscheidbare Links; gehört zweimal «Mietvertrag Wohnung 1.01» (S-2).
- Heizprofile: erwartet ein eigenes Profil; nur vordefinierte vorhanden.
- Nach jeder Navigation: erwartet Fokus auf der Überschrift oder im Inhalt; Fokus lag auf keinem Element.

## Vorschläge

- **S-1:** Mietverträge öffnen, mit Tab durch die Zeilen bis zum zweiten «Kevin Fischer». Hilfreich: Den Linknamen um Wohnung und Gebäude ergänzen («Kevin Fischer, Wohnung 1.01, Musterhaus Zentrum») oder den Zeilentext per Beschreibung an den Link hängen.
- **S-2:** Mieter › Kevin Fischer öffnen, im Abschnitt «Mietverträge» mit Tab durch beide Links. Hilfreich: Gebäude in den Namen («Mietvertrag Wohnung 1.01, Alpenblick»).
- **S-3:** Mietverträge › zweites «Kevin Fischer» › Tab zu «Löschen: Mietvertrag von Kevin Fischer» › Enter. Hilfreich: Dialogtitel wie beim Beenden-Dialog («Mietvertrag von Kevin Fischer, Wohnung 1.01, löschen?»); für Mieter mit mehreren Verträgen ausserdem Wohnung (und Gebäude) im Aktionsnamen.
- **S-4:** Gebäude › Alpenblick › Wohnung 1.01 öffnen, Tab zu den Aktionen; dann dasselbe in Musterhaus Zentrum. Hilfreich: Gebäude in den Aktionsnamen («Löschen: Wohnung 1.01, Alpenblick») oder zumindest in die Unterzeile unter der Überschrift.
- **S-5:** Gebäude › Musterhaus Zentrum, Tab zum ersten Halt im Inhalt; Mieter › Kevin Fischer, Tab zu «Mietvertrag erfassen». Hilfreich: «Rechnungen ansehen: Musterhaus Zentrum», «Mietvertrag erfassen: Kevin Fischer», gleiches Muster in allen Sprachen.

## Nicht geprüft

- Eigenes Heizprofil: In den Demodaten gibt es keines, und anlegen durfte ich nichts. Ich habe die Heizprofilliste und das vordefinierte «Heizung Mittelland» angesehen; dort gibt es keine Aktionen.
- Echte Ausgabe von NVDA/JAWS/VoiceOver: geprüft wurde nur der Barrierefreiheitsbaum (Name, Rolle, aria-describedby). Wie ein Screenreader «Modifier : …» mit Leerzeichen vor dem Doppelpunkt betont, konnte ich nicht hören.
- Italienisch und Englisch: nicht verlangt, nicht geprüft.
- Die Sprache ist am Konto gespeichert: Ich habe für die Französisch-Prüfung kurz auf Français gewechselt und sofort wieder auf Deutsch («Sprache: Deutsch» bestätigt). Andere Personas, die gleichzeitig liefen, könnten in diesem Moment Französisch gesehen haben.
- Hinweis zur Fairness: Ich habe zu Beginn versehentlich `docs/design/personas/demo-records.md` gesehen (gedacht für den Aufrufer). Es hat nur die Wahl der Seiten erleichtert (welcher Mieter zwei Verträge hat); alle Befunde stammen aus dem, was die App ansagt.
