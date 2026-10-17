# Sven, Runde w7e-2: Protokoll per Tastatur und Screenreader (Nachprüfung)

Persona: Sven, 45, blind; Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Tree.
Aufgabe: Unter «Einstellungen» das Protokoll per Tastatur öffnen. Mit Tab durch die Löschen-Knöpfe der zwei Einträge «Anmeldung mit Google» gehen: Sind sie unterscheidbar? Die Bestätigung des älteren Eintrags öffnen: Nennt sie Eintrag, Datum und was Löschen bedeutet? Den Eintrag löschen und sagen, wo der Fokus landet.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/sven-w7e-2/` (s1.mjs, s2.mjs, 01-protokoll.png, 02-bestaetigung.png, 03-nach-loeschen.png).

Gelöscht habe ich genau einen Eintrag: «Anmeldung mit Google» vom 07.09.2026, 04:26. Andere Einträge habe ich nicht angerührt.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Protokoll nach dem Löschen | Nach dem Löschen steht der Fokus wieder auf der Überschrift «Protokoll» oben (wie in Runde 1, dort P-3). Meine Stelle in der Liste ist weg, der nächste Tab geht zum neuesten Eintrag ganz oben. |

Die Befunde P-1 und P-2 aus Runde 1 sind behoben: Die Knöpfe nennen jetzt Datum und Uhrzeit, der Dialog nennt Datum, Uhrzeit und Text des Eintrags und sagt in einem allgemeinen Satz, was Löschen bedeutet.

## Beobachtungen

- Die Knöpfe heissen jetzt «Eintrag vom 27.09.2026, 04:26 löschen: Anmeldung mit Google» und «Eintrag vom 07.09.2026, 04:26 löschen: Anmeldung mit Google». Das Datum steht vorne, ich höre es also sofort und kann abbrechen, sobald ich genug weiss. Bei Änderungen an Kategorien sind die Namen sehr lang (der ganze Text des Eintrags), weil auch der Text vollständig im Namen steckt. Dank Datum am Anfang stört mich das wenig.
- Der Weg zum Protokoll ist kürzer geworden: Auf «Einstellungen» erreiche ich den Link «Protokoll» nach 21 Tabs statt 33 wie in Runde 1.
- Die Einleitung sagt jetzt «… mit Datum und Uhrzeit. Die Einträge bleiben, bis Sie sie löschen.». Dass die Liste mit dem neuesten Eintrag beginnt, steht weiterhin nirgends; ich habe es am Datum gemerkt.
- Die Bestätigung ist ein `role="dialog"` mit `aria-modal="true"`, Name «Eintrag löschen?», beschrieben durch: «Der Eintrag vom 07.09.2026, 04:26 wird endgültig aus dem Protokoll gelöscht: Anmeldung mit Google. Gelöscht wird nur der Eintrag, nicht was er festhält. Das lässt sich nicht rückgängig machen.» Der Fokus beginnt auf «Abbrechen», Tab wechselt nur zwischen «Abbrechen» und «Löschen», Escape schliesst den Dialog und bringt den Fokus zurück auf den richtigen Knopf (07.09.2026).
- Der Satz «Gelöscht wird nur der Eintrag, nicht was er festhält.» passt jetzt für Anmeldungen wie für Änderungen. Er ist etwas abstrakt: Bei einer Anmeldung habe ich kurz überlegt, was eine Anmeldung «festhält». Verstanden habe ich ihn trotzdem: Mein Konto bleibt, wie es ist.
- Nach dem Löschen: Die Statusregion meldet «Der Eintrag ist gelöscht.», gleichzeitig steht in der dringenden (assertive) Region «Protokoll - Dwello», wie in Runde 1 (dort P-4). Der Seitentitel kann die Bestätigung überlagern.
- Die Liste hat danach 4 Einträge; der vom 07.09.2026 fehlt, der vom 27.09.2026 ist noch da. Ich habe also den richtigen gelöscht.
- Visuell (03-nach-loeschen.png): Die Überschrift «Protokoll» hat einen sichtbaren Fokusrahmen, die Meldung «Der Eintrag ist gelöscht.» erscheint unten rechts. Der Screenshot des Dialogs (02-bestaetigung.png) zeigt den Dialog mittig über der abgedunkelten Liste, «Abbrechen» mit Fokusrahmen, «Löschen» rot.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 50 Tastendrücke: 13 Tabs bis «Einstellungen» und Enter, 21 Tabs bis «Protokoll» und Enter, «Zum Inhalt springen», 5 Tabs durch die Knöpfe, Enter, Tab und Enter zum Löschen. Diesmal musste ich die Einträge nicht mit dem Lesecursor nachlesen.

## Ablauf

1. **Übersicht → Einstellungen.** Erwartet: «Einstellungen» im Menü per Tab. Gesehen: Tab 13 ist der Link, Enter, «Einstellungen - Dwello» wird angesagt.
2. **Einstellungen → Protokoll.** Erwartet: ein Link «Protokoll». Gesehen: nach 21 Tabs, Enter, «Protokoll - Dwello» wird angesagt, URL /config/audit-log.
3. **Knöpfe durchgehen.** Erwartet: Jeder Knopf sagt, zu welchem Eintrag er gehört, auch mit Datum. Gesehen: Nach «Zum Inhalt springen» und dem Brotkrümel-Link «Einstellungen» kommen fünf Knöpfe, jeder mit Datum, Uhrzeit und Text. Die zwei Anmeldungen klingen verschieden: «Eintrag vom 27.09.2026, 04:26 löschen …» und «Eintrag vom 07.09.2026, 04:26 löschen …». Danach kommt «Datenschutz».
4. **Bestätigung des älteren Eintrags.** Erwartet: Dialog nennt Eintrag mit Datum und die Folge. Gesehen: «Eintrag löschen?, Dialog», dann der Text mit «07.09.2026, 04:26», «Anmeldung mit Google», «Gelöscht wird nur der Eintrag, nicht was er festhält» und «nicht rückgängig». Fokus auf «Abbrechen». Escape bringt mich zurück auf den Knopf vom 07.09.2026.
5. **Löschen.** Dialog erneut geöffnet, Tab auf «Löschen», Enter. Erwartet: Bestätigung angesagt, Fokus bleibt in der Liste (beim nächsten oder vorherigen Eintrag). Gesehen: «Der Eintrag ist gelöscht.» in der Statusregion, «Protokoll - Dwello» in der dringenden Region; der Fokus steht auf der Überschrift «Protokoll» (Ebene 1), auch nach 1,2 Sekunden noch (P-1). Der nächste Tab geht zum ersten Knopf (27.09.2026, 04:35).

## Verwirrung

- «nicht was er festhält» bei einer Anmeldung: verständlich, aber ich musste kurz nachdenken.
- Die Sortierung (neueste zuerst) wird nicht genannt.
- Sonst keine unklaren Begriffe.

## Fehlerrisiken

- Die Verwechslung der zwei Anmeldungen ist durch das Datum im Knopfnamen und im Dialog gebannt.
- Wer mehrere Einträge nacheinander löschen will, landet nach jedem Löschen oben und muss neu zählen; beim schnellen Weitertabben trifft man leicht den neuesten statt des nächsten Eintrags (P-1).
- Überlagert die Seitentitel-Ansage die Bestätigung, bleibt unklar, ob das Löschen geklappt hat (siehe Beobachtungen).

## Vorschläge

- **P-1:** Reproduktion: /config/audit-log öffnen, «Zum Inhalt springen», mit Tab zum Knopf «Eintrag vom 07.09.2026, 04:26 löschen: Anmeldung mit Google», Enter, Tab, Enter. Der Fokus steht auf der Überschrift «Protokoll». Hilfe: Den Fokus auf den Knopf des nächsten Eintrags setzen, beim letzten Eintrag auf den vorherigen, bei leerer Liste auf die Überschrift oder den Leer-Hinweis. Dabei die Seitentitel-Ansage weglassen, damit nur «Der Eintrag ist gelöscht.» zu hören ist.

## Nicht geprüft

- Was ein echter Screenreader (NVDA, VoiceOver) bei den zwei gleichzeitigen Live-Regionen vorliest: Ich habe nur deren Inhalt gelesen.
- Eine leere Liste und ein fehlgeschlagenes Löschen: nicht Teil der Aufgabe, ich durfte nur einen Eintrag löschen.
