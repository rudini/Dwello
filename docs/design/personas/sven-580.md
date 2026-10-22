# Sven – Einstellungen › KI (#580)

Persona: Sven, 45, blind, Screenreader und nur Tastatur; Desktop 1440 × 900. Beurteilt wird, was der Barrierefreiheitsbaum ansagt (Chromium-Accessibility-Tree über CDP: Rolle, Name, Beschreibung, Zustände des fokussierten Elements). App: Persona-Stack http://localhost:3300 mit Demodaten. Ich habe keinen Anbieter gespeichert. Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/sven-580/`.

Hinweis: Eine andere Persona hat während meines Laufs auf derselben Seite gespeichert (einmal war «KI eines Anbieters» mit «Muster KI AG», «Deutschland» gespeichert, später wieder «Lokale KI»). Meine Skripte wählen die Option darum per Pfeiltaste, bis die gewünschte angesagt wird.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Einstellungen › KI, «Verbindung prüfen» | Nach «Verbindung prüfen» springt der Fokus vom Knopf auf `main` (Name leer). Der nächste Tab landet wieder oben auf der Radiogruppe. Das Ergebnis steht zwar in einer Statusregion, aber ich verliere meine Stelle und muss mich zu den Feldern zurückarbeiten. |
| P-2 | Minor | Einstellungen › KI, Radiogruppe | Jede Option hat den ganzen Hilfetext im Namen **und** dazu noch als Beschreibung. Der Screenreader liest ihn darum zweimal vor, z. B. bei «Lokale KI auf diesem Server …» (36 Wörter doppelt). Im Lesemodus folgt derselbe Text ein drittes Mal als eigener Textknoten. |
| P-3 | Minor | Einstellungen › KI, Checkliste | Das Kontrollkästchen «Ich habe diese drei Punkte für diesen Anbieter geprüft.» hat keine Beschreibung, die auf die Liste zeigt. Mit Tab springe ich vom Feld «Land …» direkt zum Kontrollkästchen und höre die drei Punkte nie. |
| P-4 | Minor | Einstellungen › KI, «Verbindung prüfen» | Prüfe ich mit leerer «Adresse der KI», meldet die Seite «Unter dieser Adresse antwortet keine KI. Prüfen Sie die Adresse und ob der Server das Internet erreicht.» Dabei gibt es gar keine Adresse. Das Feld wird nicht als ungültig markiert (`aria-invalid` fehlt). |
| P-5 | Minor | Einstellungen › KI, Bereich KI-Modell | Der Hinweis «Die lokale KI antwortet nicht. …» und der Knopf «KI-Modell herunterladen» haben keine Überschrift. Mit der Überschriftennavigation finde ich sie nicht. Der Hinweis ist nicht mit dem Knopf verbunden: Mit Tab höre ich nur «KI-Modell herunterladen, Schalter». Knopf und Hinweis bleiben auch dann, wenn «Keine KI» oder «KI eines Anbieters» gewählt ist. |
| P-6 | Minor | Seitenleiste | Unter «Einstellungen» stehen «Kategorien», «Verteilschlüssel» und «Heizprofile», aber nicht «KI». Zur KI komme ich nur über die Seite «Einstellungen» (Tab 4 nach dem Sprunglink). |
| P-7 | Nit | Einstellungen › KI | Die Überschriften lauten h1 «KI» und gleich danach h2 «KI». In der Überschriftenliste stehen zwei gleichlautende Einträge. |
| P-8 | Nit | Einstellungen › KI, Fehler nach «KI speichern» | Die Fehlermeldung kommt in der Beschreibung erst nach dem Hilfetext, z. B. bei «Name des Anbieters»: zuerst «Bearbeiten mehrere Firmen …», dann «Geben Sie den Namen des Anbieters an. …». Das Kontrollkästchen ist nicht als Pflichtfeld angesagt (kein `required`), obwohl Speichern ohne Häkchen abgelehnt wird. |

## Beobachtungen

- Nach «Einstellungen» (Enter in der Seitenleiste) ist kein Element fokussiert, auch nicht nach Enter auf «KI»; der Titel wechselt korrekt auf «Einstellungen - Dwello» bzw. «KI - Dwello». Die anderen Seiten verhalten sich wohl gleich.
- Enter in einem Textfeld (z. B. «Modell») löst «Verbindung prüfen» aus, nicht «KI speichern». Für mich ist das eher sicher, aber unerwartet.
- Die Statusregion leert sich vor jedem Ergebnis und füllt sich dann neu. Dasselbe Ergebnis wird also auch beim zweiten Prüfen angesagt. Das ist gut so.
- «API-Schlüssel (optional)» ist ein Passwortfeld. Ist ein Schlüssel gespeichert, sagt die Beschreibung «Ein API-Schlüssel ist gespeichert. Lassen Sie das Feld leer, um ihn zu behalten.» Das ist klar.
- Während die andere Persona speicherte, hat ein «Verbindung prüfen» meine eingetippten Werte in «Adresse der KI» und «Modell» durch die neu geladenen leeren Werte ersetzt. Die Auswahl «KI eines Anbieters» blieb. Allein (s10) blieben die Werte nach dem Prüfen erhalten. Das kommt wohl nur vor, wenn zwei Personen gleichzeitig arbeiten.
- Der Hinweis «Die lokale KI antwortet nicht …» steht neben dem Angebot «KI-Modell herunterladen». Für mich ist unklar, ob der Download etwas nützt, solange die lokale KI nicht antwortet.

## Aufgabe geschafft: ja

Alle vier Punkte habe ich per Tastatur erreicht und geprüft. Gespeichert habe ich nichts; das leere «KI speichern» wurde wie erwartet abgelehnt.

## Aufwand

Etwa 25 Minuten, 11 Skriptläufe. Von der Übersicht zur KI-Seite: 13 × Tab bis «Einstellungen», Enter, Sprunglink, 4 × Tab bis «KI», Enter.

## Ablauf

1. **Zur KI-Seite.** Erwartet: «KI» in der Seitenleiste unter Einstellungen. Gesehen: Dort fehlt «KI» (P-6). Auf der Seite «Einstellungen» steht eine h2 «KI» mit dem Link «KI» und dem Text «Lokale KI, KI eines Anbieters oder keine KI». Der Link ist gut gefunden.
2. **Radiogruppe.** Erwartet: Gruppenname, dann kurze Optionen. Gesehen: radiogroup «Welche KI soll Dwello verwenden?». Die erste Option kommt mit Tab, die Pfeiltasten wählen und zeigen sofort den Anbieterbereich. Jede Option liest ihren langen Text doppelt (P-2).
3. **Anbieterfelder.** Tab-Reihenfolge: «Adresse der KI» (Pflicht, Beschreibung «Die Adresse, die Ihnen der Anbieter für eine OpenAI-kompatible Schnittstelle nennt.»), «API-Schlüssel (optional)», «Modell» (Pflicht, «Ein Modell, das Bilder liest …»), «Name des Anbieters» und «Land, in dem der Anbieter die Daten bearbeitet» (beide Pflicht, gleiche Beschreibung «Bearbeiten mehrere Firmen oder Länder …»), dann das Kontrollkästchen, «Verbindung prüfen», «KI speichern», «KI-Modell herunterladen». Die Reihenfolge ist logisch, Namen und Pflicht werden angesagt.
4. **Checkliste.** h2 «Bevor Sie einen Anbieter wählen» mit einer Liste aus drei Punkten und «Das ist eine Checkliste, keine Rechtsberatung.» Im Lesemodus ist das gut. Mit Tab überspringe ich es, und das Kontrollkästchen erklärt nicht, welche Punkte gemeint sind (P-3).
5. **Leer speichern.** Erwartet: Fokus auf dem ersten Fehler, Fehler am Feld. Gesehen: Fokus auf «Adresse der KI» [invalid, required], Beschreibung «… nennt. Geben Sie die Adresse der KI an, die Ihnen der Anbieter nennt, zum Beispiel https://api.anbieter.ch/v1.» Auch «Modell», «Name des Anbieters», «Land …» und das Kontrollkästchen («Bestätigen Sie, dass Sie die drei Punkte zum Datenschutz geprüft haben.») sind invalid und haben ihre Meldung per Beschreibung. Das Feld «API-Schlüssel» hat zu Recht keinen Fehler. Sehr gut, nur Kleinigkeiten (P-8).
6. **Verbindung prüfen mit «falsch».** Erwartet: Das Ergebnis wird angesagt, und der Fokus bleibt auf dem Knopf. Gesehen: Die Statusregion (role=status) direkt nach dem Knopf füllt sich mit «Der Anbieter lehnt den API-Schlüssel ab. Prüfen Sie den Schlüssel in Ihrem Konto beim Anbieter und geben Sie ihn erneut ein.» Der Fokus springt aber auf `main`, und der nächste Tab geht zur Radiogruppe (P-1). Das Schlüsselfeld wird nicht als ungültig markiert. Mit leerer Adresse kommt eine irreführende Meldung (P-4).
7. **KI-Modell bei «Lokale KI».** Erwartet: ein benannter Bereich mit Hinweis und Knopf. Gesehen: Nach «KI speichern» kommt mit Tab der Knopf «KI-Modell herunterladen». Der Hinweis davor ist ein gewöhnlicher Absatz ohne Überschrift und ohne Verbindung zum Knopf (P-5). Den Knopf habe ich nicht gedrückt.

## Verwirrung

- «KI-Modell» und «lokale KI»: Der Hinweis sagt, die lokale KI antworte nicht und der Betreiber solle sie starten. Gleich daneben steht der Download. Was hilft mir zuerst?
- «OpenAI-kompatible Schnittstelle» ist für Laien ein Fachbegriff; die Hilfe sagt aber, dass der Anbieter die Adresse nennt. Das reicht.
- «diese drei Punkte» am Kontrollkästchen ohne Bezug (P-3).

## Fehlerrisiken

- Nach dem Prüfen ist der Fokus oben auf der Radiogruppe. Mit einer Pfeiltaste wechselt man dort versehentlich die KI-Art (P-1).
- Hake ich das Kontrollkästchen ab, ohne die Punkte gehört zu haben, bestätige ich Datenschutzpflichten unbesehen (P-3).
- Eine leere Adresse führt zu einer Meldung über Server und Internet. Man sucht den Fehler dann am falschen Ort (P-4).

## Vorschläge

- **P-1:** Seite öffnen, «KI eines Anbieters» wählen, Adresse `http://127.0.0.1:2528/v1`, Schlüssel «falsch», Modell «bild-modell» eingeben, mit Tab zu «Verbindung prüfen», Enter. Der fokussierte Knoten ist danach `main` ohne Namen. Hilfe: Fokus auf dem Knopf lassen und das Ergebnis nur über die Statusregion ansagen.
- **P-2:** Mit Tab auf die erste Option. Angesagt wird Name = Titel + Hilfetext und dazu derselbe Hilfetext als Beschreibung. Hilfe: Als Namen nur den Titel nehmen («Lokale KI auf diesem Server»), den Hilfetext nur als Beschreibung.
- **P-3:** «KI eines Anbieters» wählen und von «Land …» weiter mit Tab: Das Kontrollkästchen hat keine Beschreibung. Hilfe: Die Liste per `aria-describedby` an das Kontrollkästchen hängen oder die Liste mit Kontrollkästchen in eine Gruppe mit der Überschrift als Namen stellen.
- **P-4:** «KI eines Anbieters» wählen, Adresse leeren, «Verbindung prüfen». Die Statusregion meldet «Unter dieser Adresse antwortet keine KI …». Hilfe: Bei leerer Adresse dieselbe Feldmeldung wie beim Speichern («Geben Sie die Adresse der KI an …») mit `aria-invalid` am Feld und Fokus dorthin. Bei abgelehntem Schlüssel das Schlüsselfeld markieren.
- **P-5:** «Lokale KI» (gespeichert), mit Tab nach «KI speichern» zu «KI-Modell herunterladen». Der Hinweis wird nicht vorgelesen. Hilfe: eine h2 «KI-Modell» über den Bereich, den Hinweis per `aria-describedby` an den Knopf. Den Bereich nur zeigen, wenn «Lokale KI» gewählt ist.
- **P-6:** Seitenleiste per Tab durchgehen: «Einstellungen», «Kategorien», «Verteilschlüssel», «Heizprofile», «Hilfe». Hilfe: «KI» als Unterpunkt ergänzen, oder bewusst weglassen (wie «Protokoll") und dann so lassen.
- **P-7:** Überschriftenliste: «KI», «KI». Hilfe: die h2 z. B. «KI-Art» oder «Welche KI» nennen.
- **P-8:** Leer speichern, mit Tab auf «Name des Anbieters». Die Fehlermeldung kommt nach dem Hilfetext. Hilfe: Bei `aria-describedby` die Fehler-ID zuerst nennen und das Kontrollkästchen als `required` kennzeichnen.

## Nicht geprüft

- Erfolgreiches Prüfen mit dem Schlüssel «gueltig» und erfolgreiches Speichern: Ich sollte keinen Anbieter speichern. Wohin der Fokus nach einem erfolgreichen Speichern geht, ist darum offen.
- «KI-Modell herunterladen» habe ich nicht gedrückt. Das würde einen Download auf dem gemeinsamen Server anstossen. Fortschritts- und Fehlermeldungen des Downloads sind darum ungeprüft.
- Einen echten Screenreader (NVDA, VoiceOver) hatte ich nicht. Beurteilt habe ich den Accessibility-Tree von Chromium; ob `main` beim Fokussieren die polite Statusmeldung tatsächlich unterbricht, hängt vom Screenreader ab.
- Andere Sprachen als Deutsch, Mobil-Ansicht.
