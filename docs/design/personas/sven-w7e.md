# Sven, Runde w7e: Protokoll per Tastatur und Screenreader

Persona: Sven, 45, blind; Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Tree.
Aufgabe: Von «Einstellungen» zum Protokoll der Anmeldungen und Änderungen, die Einträge durchgehen, den ältesten Eintrag zu einer Anmeldung per Tastatur löschen, den Rückweg zu «Einstellungen» prüfen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/sven-w7e/` (s1–s6.mjs, 01–06*.png).

Hinweis: Andere Personas arbeiten gleichzeitig in derselben Datenbank. Die Einträge vom 17.10.2026 (Verwaltungspauschale, Zahlung zurückgesetzt) stammen nicht von mir und zählen nicht als Befund. Gelöscht habe ich genau einen Eintrag: «Anmeldung mit Google» vom 07.09.2026, 04:10.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Protokoll | Die Löschen-Knöpfe heissen nur «Eintrag löschen: <Text>», ohne Datum. Zwei Knöpfe heissen genau gleich: «Eintrag löschen: Anmeldung mit Google». Mit Tab erreiche ich nur die Knöpfe und höre deshalb nie ein Datum. Welcher Knopf zur ältesten Anmeldung gehört, kann ich nur aus der Reihenfolge erraten. |
| P-2 | Minor | Bestätigung «Eintrag löschen?» | Auch der Dialog nennt nur «Anmeldung mit Google», kein Datum. Ich kann also nicht prüfen, ob ich die richtige Anmeldung erwischt habe. Ausserdem steht bei einer Anmeldung «Die Änderung selbst bleibt bestehen.», obwohl eine Anmeldung keine Änderung ist. |
| P-3 | Minor | Protokoll nach dem Löschen | Nach dem Löschen springt der Fokus auf die Überschrift «Protokoll» oben auf der Seite. Meine Stelle in der Liste ist weg: Der nächste Tab landet beim ersten (neuesten) Eintrag. |
| P-4 | Minor | Protokoll nach dem Löschen | Gleichzeitig mit der höflichen Meldung «Der Eintrag ist gelöscht.» (role=status) füllt sich die dringende (assertive) Ansage mit «Protokoll - Dwello», als hätte ich die Seite neu geöffnet. Je nach Screenreader unterbricht das die Bestätigung, oder ich höre zuerst den Seitentitel und meine, es sei etwas schiefgegangen. |
| P-5 | Nit | Einstellungen | Der Link «Protokoll» kommt ganz am Ende, nach allen Feldern und nach «Einstellungen speichern»: 33 Tabs ab Seitenanfang. Kommt man zurück, steht der Fokus wieder am Seitenanfang. |

## Beobachtungen

- Der Weg über das Hauptmenü ist sauber: Tab 13 ist «Einstellungen». Nach Enter sagt der Screenreader den Titel «Einstellungen - Dwello» an. Die Seite hat eine eigene Überschrift «Protokoll» (Ebene 2) mit einer Liste und einem Link samt Beschreibung: «Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen, mit Datum». Das ist gut verständlich.
- Die Protokollseite hat den Titel «Protokoll - Dwello», eine Brotkrümelnavigation «Einstellungen › Protokoll», eine Überschrift der Ebene 1 und einen Einleitungssatz. Die Einträge sind eine echte Liste. Pro Eintrag gibt es zwei Absätze (Datum mit Uhrzeit, Text) und den Knopf. Lese ich mit den Pfeiltasten, höre ich also Datum, Text und Knopf in dieser Reihenfolge. Das Datum ist kein `time`-Element, wird aber als «17.10.2026, 04:13» gut vorgelesen.
- Die Liste beginnt mit dem neuesten Eintrag. Das steht nirgends. Ich habe es nur am Datum gemerkt.
- «Zum Inhalt springen» funktioniert: Danach kommen erst der Brotkrümel-Link «Einstellungen» und dann direkt die Löschen-Knöpfe.
- Die Bestätigung ist ein `role="dialog"` mit `aria-modal="true"`. Sie ist mit dem Titel «Eintrag löschen?» und dem Text verknüpft, der Screenreader liest also beides vor. Der Fokus beginnt auf «Abbrechen», das ist die sichere Wahl. Tab wechselt nur zwischen «Abbrechen» und «Löschen», der Fokus bleibt im Dialog gefangen. Escape schliesst den Dialog, und der Fokus geht zurück auf den Knopf, der ihn geöffnet hat. So soll es sein.
- Die Erfolgsmeldung «Der Eintrag ist gelöscht.» steht in einer Statusregion und wird angesagt. Visuell (Screenshot 05) erscheint sie unten rechts als Hinweis und verdeckt dort den Löschen-Knopf des Eintrags «Anmeldung mit Google» vom 27.09.2026. Für mich spielt das keine Rolle, für Sehende vielleicht schon.
- Der Fokus auf der Überschrift ist sichtbar umrandet (Screenshot 05).
- Im Hauptmenü ist «Einstellungen» auch auf der Protokollseite als aktuelle Seite markiert (aria-current). Das passt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, rund 60 Tastendrücke: 13 Tabs bis «Einstellungen» und Enter, 33 Tabs bis «Protokoll» und Enter, dann «Zum Inhalt springen», 9 Tabs durch die Einträge, Enter, Tab und Enter zum Löschen, 2 Tastendrücke für den Rückweg. Das Durchgehen dauerte länger, weil ich die Einträge zusätzlich mit dem Lesecursor lesen musste, um die Daten zu hören (P-1).

## Ablauf

1. **Übersicht → Einstellungen.** Erwartet: «Einstellungen» im Menü ist per Tab erreichbar. Gesehen: Tab 13 ist der Link «Einstellungen». Nach Enter wird «Einstellungen - Dwello» angesagt. Der Fokus steht auf dem Seitenanfang (body).
2. **Einstellungen → Protokoll.** Erwartet: ein Link zum Protokoll, nicht zu tief. Gesehen: Der Link «Protokoll» unter der Überschrift «Protokoll» kommt erst nach 33 Tabs, nach allen Formularfeldern und «Einstellungen speichern» (P-5). Nach Enter wird «Protokoll - Dwello» angesagt.
3. **Einträge durchgehen.** Erwartet: Zu jedem Eintrag höre ich Datum und Text, und jeder Knopf sagt, zu welchem Eintrag er gehört. Gesehen: Mit dem Lesecursor höre ich «17.10.2026, 04:13», danach den Text und dann «Eintrag löschen: … , Schalter». Mit Tab höre ich nur die Knöpfe, ohne Datum. Zweimal heisst es gleich «Eintrag löschen: Anmeldung mit Google» (27.09.2026 und 07.09.2026), ich kann die beiden nicht unterscheiden (P-1).
4. **Älteste Anmeldung finden.** Erwartet: Ich finde den Eintrag am Datum. Gesehen: Ich musste mir merken, dass die Liste mit dem neuesten Eintrag beginnt, und habe den letzten Knopf «Anmeldung mit Google» genommen. Erreicht habe ich ihn vom Link «Datenschutz» aus mit Umschalt+Tab.
5. **Bestätigung öffnen.** Erwartet: Der Fokus geht in den Dialog, der sagt, was gelöscht wird. Gesehen: Der Fokus steht auf «Abbrechen». Angesagt wird «Eintrag löschen?, Dialog», dann «Dieser Eintrag wird endgültig aus dem Protokoll gelöscht: Anmeldung mit Google. Die Änderung selbst bleibt bestehen. Das lässt sich nicht rückgängig machen.» Kein Datum, und der Satz über die Änderung passt nicht zu einer Anmeldung (P-2). Escape: Der Dialog schliesst, der Fokus ist wieder auf dem Knopf.
6. **Löschen bestätigen.** Ich habe den Dialog erneut geöffnet, Tab gedrückt («Löschen») und Enter. Erwartet: Der Fokus bleibt in der Liste, etwa auf dem vorherigen Eintrag, und ich höre «Der Eintrag ist gelöscht.». Gesehen: Der Eintrag vom 07.09.2026 ist weg, die Liste hat noch 7 Einträge. Der Fokus steht auf der Überschrift «Protokoll» (P-3). Die Statusregion meldet «Der Eintrag ist gelöscht.», die dringende Region gleichzeitig «Protokoll - Dwello» (P-4). Der nächste Tab geht zum ersten Eintrag oben.
7. **Rückweg zu Einstellungen.** Erwartet: ein Brotkrümel-Link oder Zurück. Gesehen: «Zum Inhalt springen», Tab, und der Fokus ist auf dem Link «Einstellungen» in der Brotkrümelnavigation. Nach Enter bin ich auf /config, «Einstellungen - Dwello» wird angesagt, der Fokus steht am Seitenanfang. Ausserdem führt der Hauptmenü-Link «Einstellungen» zurück.

## Verwirrung

- «Die Änderung selbst bleibt bestehen» bei einer Anmeldung: Welche Änderung? Ich habe kurz befürchtet, das Löschen hätte Folgen für mein Konto.
- Zwei gleichlautende Löschen-Knöpfe: Ohne Datum weiss ich nicht, welche Anmeldung ich lösche.
- Die Sortierung (neueste zuerst) wird nicht genannt.
- «Protokoll» als Wort ist klar, dank der Beschreibung auf der Einstellungsseite.

## Fehlerrisiken

- Wer nur mit Tab oder der Schalterliste des Screenreaders arbeitet, kann leicht die falsche der beiden gleichnamigen Anmeldungen löschen, und das lässt sich nicht rückgängig machen (P-1, P-2).
- Weil der Fokus nach dem Löschen nach oben springt, könnte jemand, der mehrere Einträge löschen will, beim Weitertabben den neuesten statt des nächsten Eintrags treffen (P-3).
- Wird die Bestätigung von der Seitentitel-Ansage überlagert, bleibt unklar, ob das Löschen geklappt hat (P-4).

## Vorschläge

- **P-1:** Reproduktion: /config/audit-log öffnen, «Zum Inhalt springen», mit Tab durch die Knöpfe gehen. Zweimal ist «Eintrag löschen: Anmeldung mit Google» zu hören, ohne Datum. Hilfe: Das Datum in den Namen des Knopfs aufnehmen, etwa «Eintrag vom 07.09.2026, 04:10 löschen: Anmeldung mit Google».
- **P-2:** Reproduktion: beim Eintrag «Anmeldung mit Google» Enter drücken. Der Dialog nennt kein Datum und sagt «Die Änderung selbst bleibt bestehen.». Hilfe: Datum und Uhrzeit im Dialogtext nennen. Bei Anmeldungen den Satz zur Änderung weglassen oder anpassen, etwa «Ihre Anmeldung und Ihr Konto bleiben unverändert.».
- **P-3:** Reproduktion: einen Eintrag per Tastatur löschen und danach prüfen, wo der Fokus steht: auf der Überschrift «Protokoll». Hilfe: Den Fokus auf den Knopf des nächsten Eintrags setzen, beim letzten Eintrag auf den vorherigen. Bei leerer Liste auf die Überschrift oder den Hinweis, dass keine Einträge mehr da sind.
- **P-4:** Reproduktion: einen Eintrag löschen und die Live-Regionen lesen: status «Der Eintrag ist gelöscht.», assertive «Protokoll - Dwello». Hilfe: Nach dem Löschen keine Seitentitel-Ansage auslösen, oder nur die Erfolgsmeldung ansagen.
- **P-5:** Reproduktion: /config öffnen und mit Tab bis «Protokoll» gehen: 33 Tabs. Hilfe: Den Protokoll-Link vor das Formular stellen, etwa zu den Stammdaten-Links. Oder den Weg in der Hilfe nennen. Ein Screenreader-Nutzer kann zwar mit der Überschriften-Taste springen, ein Tastaturnutzer ohne Screenreader aber nicht.

## Nicht geprüft

- Zurück mit Alt+Pfeil links: Der Browser ohne Fenster (headless) führt die Verlaufs-Tastenkürzel nicht aus. Nach Alt+Pfeil rechts blieb ich auf /config. Geprüft habe ich nur den Rückweg über die Brotkrümelnavigation und das Hauptmenü.
- Was ein echter Screenreader (NVDA, VoiceOver) bei zwei gleichzeitigen Live-Regionen tatsächlich vorliest (P-4): Ich habe nur den Inhalt der Regionen gelesen.
- Eine leere Protokoll-Liste: Ich durfte nur einen Eintrag löschen.
- Ein fehlgeschlagenes Löschen: Der Auftrag nannte keine Anfrage, die fehlschlagen soll.
