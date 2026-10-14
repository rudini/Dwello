# Persona-Lauf Sven, Slice b15 (Mieter und Wohnung als Text, #152)

Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, 100 %. Beurteilt wird der Accessibility-Tree (`readOut`) und der Fokus nach jedem Tab (Name, Rolle, Wert, `aria-describedby`).

Aufgabe: per Tastatur bei einem Mietvertrag «Bearbeiten» öffnen, herausfinden, für welchen Mieter und welche Wohnung der Mietvertrag gilt, ob und wie sich der Mieter ändern liesse, dann die Nettomiete ändern und speichern.

Mietvertrag: Laura Keller, Wohnung EG, Alpenblick (`/contracts/b0000003-0003-0003-0003-000000000001`). Nicht der Mietvertrag von Helga.

## Aufgabe geschafft: ja

## Aufwand

- Etwa 6 Minuten.
- Von der Liste «Mietverträge» bis zum Link «Mietvertrag von Laura Keller bearbeiten»: 30 Tabs (über Kopfzeile, Navigation, Suche und vier Zeilen davor), dann Enter.
- Auf «Mietvertrag bearbeiten»: mit «Zum Inhalt springen» und 6 Tabs bin ich bei «Nettomiete pro Monat», ohne Sprunglink sind es 23 Tabs.
- Ein Fehlversuch mit Absicht («abc»), dann «1380.00» eingegeben, mit Tab zu «Änderungen speichern», Enter.

## Ablauf

| Schritt | Erwartet | Gesehen (gehört) |
|---|---|---|
| 1. Liste «Mietverträge», mit Tab zum Bearbeiten-Link | Ein Link, der sagt, welchen Mietvertrag er bearbeitet | «Mietvertrag von Laura Keller bearbeiten», eindeutig. Gut. |
| 2. Enter | Seite «Mietvertrag bearbeiten», Fokus am Seitenanfang | Titel «Mietvertrag bearbeiten - Dwello», Fokus auf `body`, der nächste Tab landet auf «Zum Inhalt springen». In Ordnung. |
| 3. Mit H durch die Überschriften | Eine Überschrift für Mieter und Wohnung | Überschriften: «Mietvertrag bearbeiten» (H1), «Mieter und Wohnung», «Vertragsdauer», «Miete» (alle H2). «Mieter und Wohnung» finde ich mit einem H-Druck. Gut. |
| 4. Unter «Mieter und Wohnung» lesen | Mieter und Wohnung als Text, nicht als Auswahlfeld | Beschreibungsliste: Begriff «Mieter», Wert «Laura Keller»; Begriff «Wohnung», Wert «Wohnung EG - Alpenblick». Der Screenreader nennt Begriff und Wert paarweise, das ist klar. |
| 5. Weiterlesen: Kann ich den Mieter ändern? | Ein Hinweis, ob und wie | Gleich danach der Absatz: «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung geben Sie diesem Mietvertrag ein Vertragsende und erfassen einen neuen. Haben Sie Mieter oder Wohnung falsch erfasst und hat der Mietvertrag noch nicht begonnen, löschen Sie ihn und erfassen ihn neu.» Inhaltlich klar. Aber schon drei Absätze vorher, direkt unter der H1, hörte ich: «Ändern Sie Mieter, Wohnung, Vertragsdauer oder Miete dieses Mietvertrags.» Das widerspricht sich (siehe S-1). |
| 6. Fokusreihenfolge im Formular (Tab) | Die zwei weggefallenen Felder hinterlassen keine Lücke, Reihenfolge wie vorgelesen | Brotkrümel «Mietverträge», «Mietvertrag von Laura Keller», dann «Vertragsbeginn» (Pflichtfeld, Hilfe und Wochentag über `aria-describedby`), «Kalender für Vertragsbeginn öffnen», Radiogruppe «Vertragsdauer» (nur die gewählte Option im Tab-Lauf, richtig), «Nettomiete pro Monat», «Akonto pro Monat (optional)», «Zusatzmiete pro Monat (optional)», «Abbrechen», «Änderungen speichern». Keine leeren oder versteckten Tab-Stopps, die Reihenfolge entspricht dem Lesefluss. Gut. |
| 7. Im Tab-Lauf: höre ich Mieter und Wohnung? | Vielleicht nicht, es sind keine Felder | Nein, die Beschreibungsliste und die Hilfe sind keine Tab-Stopps und an kein Feld gebunden. Wer nur tabbt, hört vom Mieter nur den Brotkrümel-Link «Mietvertrag von Laura Keller», die Wohnung gar nicht. Im Lesemodus ist alles da. Für mich in Ordnung, siehe S-4. |
| 8. Nettomiete «abc», Enter | Fehlermeldung am Feld, Fokus bleibt dort | Fokus bleibt auf «Nettomiete pro Monat», jetzt «ungültig», Beschreibung um «Bitte geben Sie einen gültigen Betrag ein, zum Beispiel 1450.00 oder 1'450.» ergänzt. Sehr gut. |
| 9. «1380.00» eingeben, Tab | Neues Total | Unten im Absatz steht jetzt «Monatlich total CHF 1’620.00», vorgelesen wird es nicht, ich muss es suchen (S-3). |
| 10. Tab bis «Änderungen speichern», Enter | Rückkehr zur Detailseite, Bestätigung | Seite «Mietvertrag - Laura Keller - Dwello», Fokus auf H1 «Mietvertrag von Laura Keller», Statusmeldung «Mietvertrag von Laura Keller gespeichert». Nettomiete jetzt CHF 1’380.00. Gut. |
| 11. Wo gebe ich ein «Vertragsende»? (wegen der Hilfe) | Eine Aktion mit diesem Wort | Auf der Detailseite gibt es die Schaltfläche «Beenden». Dass «Vertragsende geben» = «Beenden» bedeutet, muss ich erraten. Im Bearbeiten-Formular selbst gibt es «Befristet» mit einem Enddatum, was ich ebenfalls für den gemeinten Weg halten könnte (S-2). |

Screenshots (nur im Scratchpad): `02-edit.png` zeigt das Panel «Mieter und Wohnung» mit zwei Zeilen Begriff/Wert und dem Hilfeabsatz darunter, vor «Vertragsdauer»; `03-invalid.png` die Fehlermeldung unter «Nettomiete pro Monat»; `04-saved.png` die Detailseite mit der Erfolgsmeldung.

## Verwirrung

- Der Einleitungssatz «Ändern Sie Mieter, Wohnung, Vertragsdauer oder Miete dieses Mietvertrags.» verspricht genau das, was drei Absätze später ausgeschlossen wird. Ich höre die Einleitung zuerst und hätte das erst einmal geglaubt.
- «geben Sie diesem Mietvertrag ein Vertragsende»: auf dieser Seite gibt es das Wort «Vertragsende» nur als Feld bei «Befristet» (oder bei einem gekündigten Mietvertrag). Die Schaltfläche auf der Detailseite heisst «Beenden». Wo und wie ich das Vertragsende setze, sagt die Hilfe nicht.
- «Wohnung EG - Alpenblick» mit Bindestrich; in der Liste und auf der Detailseite steht «Wohnung EG · Alpenblick». Mein Screenreader liest den Bindestrich je nach Einstellung als «Strich» oder «minus».

## Fehlerrisiken

- Ein Mieterwechsel wird über «Befristet» und ein Enddatum im Bearbeiten-Formular gelöst statt über «Beenden» mit Kündigung, weil die Hilfe nur «Vertragsende» sagt (S-2).
- Wer der Einleitung glaubt, sucht im Tab-Lauf nach einem Mieterfeld, findet keines und ist unsicher, ob die Seite vollständig geladen ist (S-1).

## Vorschläge

| ID | Schwere | Bildschirm | Befund und Beleg | Vorschlag |
|---|---|---|---|---|
| S-1 | Major | Mietvertrag bearbeiten (`/contracts/{id}/edit`) | Einleitung unter der H1: «Ändern Sie Mieter, Wohnung, Vertragsdauer oder Miete dieses Mietvertrags.» Die Hilfe unter «Mieter und Wohnung»: «Mieter und Wohnung lassen sich nicht ändern.» Reproduktion: Liste «Mietverträge», Tab bis «Mietvertrag von Laura Keller bearbeiten», Enter, Seite linear lesen. | Einleitung an die neue Regel anpassen, z. B. «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» |
| S-2 | Minor | Mietvertrag bearbeiten, Panel «Mieter und Wohnung» | Die Hilfe sagt «geben Sie diesem Mietvertrag ein Vertragsende», nennt aber nicht den Weg. Die Aktion heisst auf der Detailseite «Beenden»; im Formular gibt es zusätzlich «Befristet» mit Enddatum. Reproduktion: wie S-1, Hilfe lesen, dann «Abbrechen» und auf der Detailseite die Schaltflächen anhören («Bearbeiten», «Beenden», «Löschen»). | Den Weg nennen, z. B. «… beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden» und erfassen einen neuen.» |
| S-3 | Minor | Mietvertrag bearbeiten, Abschnitt «Miete» | «Monatlich total CHF …» ändert sich beim Tippen, steht aber in einem gewöhnlichen Absatz, nicht in einer Live-Region; der Screenreader meldet die Änderung nicht. Reproduktion: Nettomiete auf 1380.00 ändern, Tab; es wird nur «Akonto pro Monat (optional)» angesagt. Wahrscheinlich nicht neu in diesem Slice. | Total als `status` (höflich) ausgeben oder per `aria-describedby` an die Mietfelder hängen. |
| S-4 | Nit | Mietvertrag bearbeiten | H1 und Seitentitel heissen nur «Mietvertrag bearbeiten». Im Tab-Lauf erfährt man den Mieter nur über den Brotkrümel-Link, die Wohnung gar nicht. Reproduktion: Tab-Reihenfolge aus Schritt 6. | H1 «Mietvertrag von Laura Keller bearbeiten» (wie der Link in der Liste), oder Titel mit Mietername. |
| S-5 | Nit | Mietvertrag bearbeiten, Panel «Mieter und Wohnung» | Wert «Wohnung EG - Alpenblick» mit Bindestrich, sonst überall «Wohnung EG · Alpenblick». | Gleiches Trennzeichen wie in Liste und Detailseite. |
| S-6 | Nit | Mietvertrag bearbeiten, Panel «Mieter und Wohnung» | Mieter und Wohnung sind reiner Text; auf der Detailseite sind sie Links zu Mieter und Wohnung. Wer eine Mieterangabe (z. B. Telefon) korrigieren will, muss über die Navigation suchen. | Optional als Links zur Seite des Mieters und der Wohnung. |
| S-7 | Nit | Mietvertrag bearbeiten, Vertragsdauer | Name der Radios enthält die Beschreibung bereits («Unbefristet Der Mietvertrag hat kein Vertragsende …»), und dieselbe Beschreibung kommt nochmals über `aria-describedby`: doppelt vorgelesen. Nicht neu in diesem Slice. | Nur den Titel als Namen, die Erklärung nur als Beschreibung. |

Was gut ist: Die Beschreibungsliste wird sauber als Begriff/Wert angesagt, die Überschrift «Mieter und Wohnung» macht sie per H-Taste erreichbar, die Hilfe steht direkt darunter im selben Abschnitt (mit keinem Feld verbunden, braucht sie auch nicht, weil es kein Feld mehr gibt). Ohne die zwei Auswahlfelder beginnt der Tab-Lauf direkt bei «Vertragsbeginn»; keine leeren Tab-Stopps, keine Sprünge. Fehlermeldung, Fokus nach Fehler und Erfolgsmeldung sind vorbildlich.

## Nicht geprüft

- Echter Screenreader (NVDA, VoiceOver): beurteilt habe ich den Accessibility-Tree und die zugänglichen Namen und Beschreibungen, nicht die tatsächliche Sprachausgabe.
- Ein Mietvertrag, der noch nicht begonnen hat, und der dort beschriebene Weg «löschen und neu erfassen»: nicht ausprobiert, weil Löschen die gemeinsame Datenbank verändert.
- «Beenden» selbst nicht ausgeführt, aus demselben Grund.
- Hinweis zur gemeinsamen Datenbank: Bei einem späteren Kontrollaufruf war der Mietvertrag von Laura Keller bereits «Unbefristet, gekündigt auf den 31.12.2026». Das habe ich nicht gemacht; vermutlich ein anderer Lauf parallel. Meine einzige Änderung: Nettomiete von CHF 1’350.00 auf CHF 1’380.00.
