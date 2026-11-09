# Sven, Slice 689: Übersetzungen eigener Einträge in den Listen

Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Tree. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/75de203e-d928-5671-b36f-0da18cb6e6e1/scratchpad/sven-689/`.

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Minor | Kategorien, Verteilschlüssel, Heizprofile (Liste und Detailseite) | Vordefinierte Einträge sagen nichts über Übersetzungen, obwohl z. B. «Heizung» alle drei Namen hat (im Bearbeiten-Formular: «Chauffage», «Riscaldamento», «Heating»). Neben eigenen Einträgen mit «Übersetzt: …» oder «Keine Übersetzung» höre ich bei vordefinierten nur Schweigen. Ich kann daraus schliessen, sie seien nicht übersetzt. |
| P-2 | Minor | Kategorien, Verteilschlüssel, Heizprofile | «Übersetzt: Englisch» sagt nicht, was übersetzt ist. Erst das Formular erklärt, dass es nur um den Namen geht. In der Liste kann ich glauben, auch die Beschreibung sei auf Englisch vorhanden. |

## Beobachtungen

- Der Screenreader liest Sprachnamen, keine Kürzel: Sichtbar steht «Übersetzt: EN» bzw. «Übersetzt: FR», die Kürzel sind für mich ausgeblendet, vorgelesen wird «Übersetzt: Englisch» (meine Kategorie) und «Übersetzt: Französisch» (eigener Verteilschlüssel «Nach Volumen» einer anderen Persona). Das ist gut.
- Ein eigenes Heizprofil ohne Übersetzung («Helga Winter», von einer anderen Persona) sagt «Keine Übersetzung», in der Liste und auf seiner eigenen Seite, gleich nach «Eigenes Heizprofil». Klar.
- Die Zeile hängt nicht am Link: Wenn ich mit Tab von Link zu Link gehe, höre ich nur «Sven Gartenpflege, Link». Die Übersetzungszeile höre ich erst, wenn ich im Lesemodus weiterlese. Für eine Zusatzangabe geht das, mehr nicht.
- Nach dem Speichern liegt der Fokus auf dem Link meiner neuen Kategorie, ganz oben in der Liste. So weiss ich, dass sie angelegt ist. Eine Meldung «gespeichert» höre ich nicht, die Statusbereiche bleiben leer. Ich höre nur den Seitentitel «Kategorien - Dwello».
- Auf der neuen Seite (Formular, Liste) steht der Fokus wieder am Seitenanfang («Zum Inhalt springen»). Bis zum Feld «Name» brauche ich 20 Tabs, mit dem Sprunglink weniger.
- Die Gruppe «Übersetzungen» im Formular hat einen Namen, die Felder «Französisch (optional)», «Italienisch (optional)» und «Englisch (optional)» haben eigene Beschriftungen, und der Hilfetext steht über den Feldern. Das Ausfüllen ging problemlos.
- In der Liste der Verteilschlüssel sind vordefinierte Einträge kein Link, nur Text. Dort fehlt dann auch jede Angabe zur Übersetzung (siehe P-1).
- In der Liste der Kategorien ersetzt bei meiner Kategorie ohne Beschreibung die Übersetzungszeile die Beschreibung. Bei vordefinierten Kategorien steht dort die rechtliche Begründung.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten. Für die Kategorie etwa 45 Tastendrücke: 20 Tabs bis «Name», Name tippen, 2 Tabs bis zum Radio «Umlagefähig» und Leertaste, etwa 6 Tabs bis «Englisch», tippen, 2 Tabs bis «Kategorie speichern» und Enter. Danach habe ich drei Listen und zwei Detailseiten vorlesen lassen.

## Ablauf

- Nach dem Speichern erwartet: eine Meldung wie «Kategorie gespeichert». Gesehen: keine Meldung, nur Fokus auf dem neuen Listeneintrag (siehe Beobachtungen).
- In der Kategorienliste erwartet: bei den vordefinierten Kategorien ebenfalls eine Angabe zu den Übersetzungen. Gesehen: gar nichts (P-1). Im Bearbeiten-Formular von «Heizung» sind dann alle drei Namen ausgefüllt.
- Heizprofile: Beim ersten Blick gab es nur vordefinierte Profile, ohne Angabe. Erwartet hatte ich, dass ein eigenes Profil bald auftaucht. Etwas später war «Helga Winter» da, mit «Keine Übersetzung».

## Vorschläge

- **P-1:** Einstellungen → Kategorien öffnen und den Eintrag «Heizung» vorlesen lassen: «Von Dwello Umlagefähig», kein Wort zu Übersetzungen. Dann «Heizung» öffnen: Unter «Übersetzungen» stehen alle drei Namen. Dasselbe in den Listen Verteilschlüssel und Heizprofile und auf der Seite «Heizung + Warmwasser». Hilfreich wäre die gleiche Zeile auch bei vordefinierten Einträgen (z. B. «Übersetzt: Französisch, Italienisch, Englisch»), oder im Hinweis über der Liste ein Satz, dass Dwello die vordefinierten Einträge in allen Sprachen mitliefert.
- **P-2:** In der Kategorienliste den Eintrag «Sven Gartenpflege» vorlesen lassen: «Übersetzt: Englisch». Hilfreich wäre «Name übersetzt: Englisch» oder «Name auf Englisch», bzw. «Kein übersetzter Name» statt «Keine Übersetzung».

## Nicht geprüft

- Eine eigene Kategorie oder einen eigenen Verteilschlüssel ohne jede Übersetzung habe ich nicht gesehen. Die Aufgabe erlaubte mir nur eine Kategorie, und die fremden Einträge habe ich nicht verändert. «Keine Übersetzung» habe ich nur beim Heizprofil von Helga gehört.
- Einträge mit zwei oder drei Übersetzungen (Reihenfolge, Trennzeichen beim Vorlesen) habe ich nicht gesehen, weil keine solchen eigenen Einträge da waren.
- Die eigene Seite eines Verteilschlüssels gibt es nicht als Ansicht, der Link führt direkt ins Bearbeiten-Formular. Das habe ich nicht geöffnet, weil der Eintrag einer anderen Persona gehört.
- Die Seite in den anderen Sprachen der Oberfläche habe ich nicht angesehen, weil die Sprache am Konto gespeichert ist und andere Personas gleichzeitig arbeiten.
