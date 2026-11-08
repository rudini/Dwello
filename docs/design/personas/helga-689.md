# Helga – Slice 689: Übersetzte Namen bei Verteilschlüsseln und Heizprofilen

Persona: Helga, 68, Desktop 1440 × 900, 150 % Zoom (Stichprobe 200 %), Maus. App: http://localhost:3300 (Persona-Stack, Demo-Daten, Deutsch).
Gespeichert habe ich nur Stammdaten: den Verteilschlüssel «Nach Volumen» (Formel `{volume}`, Französisch «Selon le volume») und das Heizprofil «Helga Winter» (ohne Übersetzungen).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Verteilschlüssel (Liste) | Unter meinem Schlüssel steht «Übersetzt: FR». «FR» ist eine Abkürzung; im Formular hiess dasselbe Feld noch «Französisch». Ich habe es erraten, aber sicher war ich nicht. Ein Screenreader liest übrigens «Übersetzt: Französisch» vor, ich sehe nur «FR». |
| P-2 | Minor | Heizprofile (Liste und eigene Seite) | «Keine Übersetzung» sagt mir nicht, was das für mich heisst. Muss ich etwas nachholen? Was bekommt mein französischsprachiger Mieter zu sehen? Im Formular stand noch «Fehlt er, steht der deutsche Name», hier steht davon nichts mehr. Ich hatte kurz Angst, ich hätte etwas falsch gemacht. |
| P-3 | Minor | Verteilschlüssel (Liste) | Die beiden Listen sagen es verschieden: bei den Schlüsseln «Übersetzt: FR» (was vorhanden ist), bei den Heizprofilen «Keine Übersetzung» (was fehlt). Ob bei einem Schlüssel ohne Übersetzung auch «Keine Übersetzung» stünde, kann ich aus der Liste nicht ablesen, weil ich keinen solchen habe. |
| P-4 | Minor | Verteilschlüssel und Heizprofile (vordefinierte Einträge) | Bei den vordefinierten Einträgen («Pro Fläche (m²)», «Heizung Mittelland» …) steht keine Zeile zur Sprache, weder in der Liste noch auf der Seite von «Heizung Mittelland». Ich frage mich: Sieht mein französischer Mieter dort «Pro Fläche» auf Deutsch? Muss ich da auch etwas übersetzen? Ich kann es nicht, weil sie sich nicht ändern lassen. |
| P-5 | Minor | Verteilschlüssel (Liste), 150 % | Meine eigene Zeile ist bei 150 % sehr schmal: «Nach / Volumen», «Übersetzt: / FR» und die Formel «{volume / }» werden mitten im Wort umgebrochen, rechts ist viel leerer Platz neben «Eigener Verteilschlüssel», «0 Rechnungen» und «Löschen». Bei 200 % ist alles sauber untereinander. Die vordefinierten Zeilen sind bei 150 % nicht betroffen. |

## Beobachtungen

- Das Erfassen ging gut. Unter «Übersetzungen» steht ein klarer Hilfetext («Ihn zeigt die Nebenkostenabrechnung eines Mieters mit dieser Sprache … Fehlt er, steht der deutsche Name»). Mit «(optional)» bei jedem Feld wusste ich, dass ich das Heizprofil ohne Übersetzung speichern darf.
- Der Knopf «{volume} Raumvolumen in m³» hat die Formel richtig eingefügt. Das vorausgefüllte `{area}` musste ich zuerst selbst löschen, sonst hätte ich «{area}{volume}» bekommen.
- «Formel testen» zeigt vier Beispielwohnungen nur mit m² und Zimmern, ohne m³. Bei einer Volumen-Formel kann ich nicht nachvollziehen, woher die Prozente kommen (14.49 %, 21.74 % …).
- Nach dem Speichern komme ich beim Verteilschlüssel zurück zur Liste, beim Heizprofil aber auf die Seite des Profils. Beide Male gibt es eine grüne Meldung «… gespeichert». Das ist in Ordnung, aber nicht gleich.
- Die Summe beim Heizprofil («Summe: 100 % – stimmt») ist sehr hilfreich.
- Beim Verteilschlüssel führt der Name in der Liste direkt ins Bearbeitungsformular, eine eigene Seite zum Anschauen gibt es nicht. Für die Frage nach den Sprachen bleibt mir deshalb nur die Liste.
- Die vordefinierte Heizprofil-Seite sagt «Folgt der üblichen Praxis und lässt sich nicht ändern.», das verstehe ich. Bei meinem eigenen Profil steht neben «Eigenes Heizprofil» nur «Keine Übersetzung».

## Aufgabe geschafft: ja

Beide Einträge sind gespeichert. Aus den Listen und der Profilseite konnte ich ablesen: «Nach Volumen» hat einen französischen Namen, «Helga Winter» hat keine Übersetzung. Welche Folgen das hat, steht dort aber nicht (P-2), und bei den vordefinierten Einträgen bleibt die Frage offen (P-4).

## Aufwand

Etwa 12 Minuten, rund 30 Schritte: Navigation, zwei Formulare mit 12 Monatswerten, zwei Listen, zwei Detailseiten.

## Ablauf

- Liste der Verteilschlüssel nach dem Speichern. Erwartet: ein Hinweis «Französisch: Selon le volume» oder wenigstens «Französisch». Gesehen: «Übersetzt: FR». Den französischen Namen selbst sehe ich nicht, und mitten im Wort umgebrochen ist es auch (P-1, P-5).
- Liste und Seite von «Helga Winter». Erwartet: ein Satz wie «Nur Deutsch – Mieter in anderen Sprachen sehen den deutschen Namen». Gesehen: nur «Keine Übersetzung», grau (P-2).
- Vordefinierte Einträge. Erwartet: ein Hinweis, ob sie in anderen Sprachen erscheinen. Gesehen: nichts zur Sprache (P-4).

## Vorschläge

- **P-1:** Einstellungen → Verteilschlüssel → «Verteilschlüssel erfassen», Name «Nach Volumen», Formel `{volume}`, Französisch «Selon le volume», speichern. In der Liste steht «Übersetzt: FR». Hilfreich wäre der Sprachname ausgeschrieben («Übersetzt: Französisch»), wie im Formular, oder gleich der Name («Französisch: Selon le volume»).
- **P-2:** Einstellungen → Heizprofile → «Heizprofil erfassen», «Helga Winter», Monatswerte mit Summe 100 %, ohne Übersetzung speichern. Auf der Profilseite und in der Liste steht «Keine Übersetzung». Hilfreich wäre die Folge, z. B. «Keine Übersetzung – in anderen Sprachen steht der deutsche Name».
- **P-3:** Beide Listen nebeneinander ansehen. Hilfreich wäre ein Wortlaut in beiden Listen, für «hat Übersetzungen» und für «keine Übersetzung» gleich aufgebaut.
- **P-4:** Verteilschlüssel- und Heizprofil-Liste sowie die Seite «Heizung Mittelland» öffnen: kein Wort zur Sprache. Hilfreich wäre ein kurzer Satz bei den vordefinierten Einträgen, z. B. «In allen Sprachen vorhanden», sofern das zutrifft.
- **P-5:** Bei 150 % Zoom (Fenster 1440 × 900) die Verteilschlüssel-Liste mit einem eigenen Schlüssel öffnen. Die linke Spalte der eigenen Zeile ist so schmal, dass Name, «Übersetzt: FR» und Formel mitten im Wort umbrechen. Hilfreich wäre es, der linken Spalte mehr Platz zu geben oder die Knöpfe früher unter den Text zu setzen, wie bei 200 %.

## Nicht geprüft

- Wie die Verteilschlüssel-Liste einen eigenen Schlüssel ohne Übersetzung beschreibt: Ich habe nur einen mit Französisch angelegt und wollte keinen zweiten Datensatz anlegen.
- Ob der Mieter oder Dwello auf Französisch wirklich «Selon le volume» zeigt: Die Sprache ist am Konto gespeichert, und andere Personas arbeiten gleichzeitig. Deshalb habe ich die Sprache nicht umgestellt.
- Ob die vordefinierten Einträge Übersetzungen haben: Das ist aus der Oberfläche auf Deutsch nicht abzulesen (P-4).

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/75de203e-d928-5671-b36f-0da18cb6e6e1/scratchpad/helga-689/ (05-after-save.png Liste nach dem Speichern, 06-key-row.png Zeile bei 150 %, 07-key-row-200.png Zeile bei 200 %, 11-profile-row.png, 12-profile-detail.png).
