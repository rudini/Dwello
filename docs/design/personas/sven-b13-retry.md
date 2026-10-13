# Sven – B13 «Erneut versuchen» bei fehlenden Mietverträgen einer Wohnung

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt über den Accessibility-Tree (`readOut`), Fokus nach jedem Tastendruck protokolliert, Live-Regionen mit einem MutationObserver mitgeschrieben.
Simulierter Fehler: `GET /api/contracts?apartmentId=aaaa3333-3333-3333-3333-333333333333` (Wohnung OG2 – Alpenblick) antwortet mit 500, bis «jetzt geht es wieder» (`page.unrouteAll()`).
Skripte und Screenshots: `/tmp/claude-0/persona-sven-2/` (nicht im Repository).

## Aufgabe geschafft: ja

Beide Teilaufgaben konnte ich ganz mit der Tastatur erledigen. Der Hinweis wird angesagt, er sagt, was fehlt und was ich tun soll, und «Erneut versuchen» erreiche ich mit Tab. Was nach dem erfolgreichen Versuch passiert, höre ich aber nicht: Der Fokus landet im Nichts, und es kommt keine Bestätigung.

## Aufwand

- Teil 1 (Assistent): 19 Tabs bis «Mieter» (ohne Sprunglink; mit «Zum Inhalt springen» weniger), 2 Pfeiltasten, 3 Tabs bis «Weiter», 1 Tab bis «Wohnung», 1 Pfeiltaste, 1 Tab bis «Erneut versuchen», 2× drücken (einmal noch mit Fehler, einmal, als es wieder ging). Etwa 30 Tastendrücke, gut 3 Minuten.
- Teil 2 (Bearbeiten): 30 Tabs in der Liste bis «Mietvertrag von Laura Keller bearbeiten», dann 25 Tabs bis «Nettomiete pro Monat», Shift+Tab zurück zur Wohnung, 1 Pfeiltaste, Vertragsbeginn geändert, zurück zu «Erneut versuchen», Enter. Etwa 75 Tastendrücke, gut 4 Minuten.

## Ablauf

### Teil 1 – Neuer Mietvertrag (/contracts/new)

1. **Mieter wählen.**
   Erwartet: Ich höre ein beschriftetes Auswahlfeld mit Hilfetext.
   Gehört: «Mieter, Kombinationsfeld», beschrieben durch «Die Person, die die Wohnung mietet …». Mit ArrowDown habe ich «Nina Brunner, Luzern» gewählt, dann «Weiter». Der Fokus springt auf die Überschrift «Schritt 2 von 5: Wohnung», und «Entwurf gespeichert, 20:37» wird angesagt. Gut.

2. **Wohnung OG2 – Alpenblick wählen (die mit dem Fehler).**
   Erwartet: Die Wohnung ist wählbar, und ich bekomme gesagt, dass etwas nicht geprüft werden konnte.
   Gehört: Die Wohnung steht als freie Wohnung in der Liste, ohne Zusatz. Gleich nach der Auswahl sagt die Statusregion an (polite):
   ```
   - status:
     - paragraph: Überschneidung noch nicht geprüft
     - paragraph: Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten. Beim Speichern prüft Dwello in jedem Fall, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet.
     - button "Erneut versuchen"
   ```
   Der Text sagt, was nicht geprüft ist (Überschneidung mit anderen Mietverträgen), was ich tun soll (Erneut versuchen) und dass meine Eingaben bleiben. Das beruhigt mich. Mitgelesen wird allerdings auch das Wort «Erneut versuchen» des Buttons am Schluss, weil der Button in der Statusregion steckt. Das ist hörbar, aber nicht schlimm.
   Mit dem Feld ist der Hinweis nicht verknüpft: Das Feld «Wohnung» hat nur `aria-describedby="apartment-help"`. Wer später zurück auf das Feld tabbt, hört den Hinweis nicht mehr.

3. **Button erreichen.**
   Erwartet: Der nächste Tab nach der Wohnung führt zum Button.
   Gehört: Tab ergibt «Erneut versuchen, Schaltfläche», danach «Zurück» und «Weiter». Die Reihenfolge ist logisch.

4. **Drücken, solange es noch nicht geht (Leertaste).**
   Erwartet: Eine Rückmeldung wie «Wird geladen …» oder «Hat wieder nicht geklappt».
   Gehört: nichts. Der Request lief (wieder 500), der Fokus bleibt auf dem Button, die Live-Region wurde nicht geändert (`live []`), der Text ist identisch. Ich weiss nicht, ob mein Tastendruck überhaupt etwas ausgelöst hat.

5. **Jetzt geht es wieder: Enter auf «Erneut versuchen».**
   Erwartet: Der Hinweis verschwindet, eine kurze Bestätigung (z. B. «Mietverträge geladen, keine Überschneidung») wird angesagt, der Fokus geht auf etwas Sinnvolles (Feld «Wohnung» oder «Weiter»).
   Gehört:
   - Der Hinweis ist weg, die Statusregion ist jetzt leer (`- status` ohne Inhalt). Angesagt wird **nichts** (der Observer sah nur das Leeren: `status: ''`).
   - Der Fokus liegt danach auf `body`, der Button wurde unter dem Fokus entfernt. Ein Screenreader sagt dann meist nichts oder springt an den Dokumentanfang. Immerhin geht der nächste Tab zu «Zurück», danach «Weiter»; der Browser hat sich die Stelle gemerkt. Ich als Sven merke davon aber nichts, bis ich Tab drücke.
   - Die Wahl «Wohnung OG2 - Alpenblick» [selected] ist erhalten.
6. **Weiter zu Schritt 3:** Der Fokus geht auf «Schritt 3 von 5: Vertragsdauer», es gibt keinen Hinweis mehr. In Ordnung.

Zusatz (gleicher Fehler, ohne Erneut versuchen direkt zu Schritt 3): Unter «Vertragsbeginn» steht der volle Hinweis noch einmal, als gewöhnliche Absätze mit einem Button «Erneut versuchen» (genau einer auf der Seite). Das Feld «Vertragsbeginn» hat nur `describedby="startDate-help"`, der Hinweis gehört also nicht zum Feld.

### Teil 2 – Mietvertrag bearbeiten (Laura Keller, Wohnung EG – Alpenblick)

1. **Bearbeiten öffnen.** Ich habe in der Liste mit Tab bis zum Link «Mietvertrag von Laura Keller bearbeiten» navigiert, gut benannt, und Enter gedrückt. Danach liegt der Fokus auf `body`, nicht auf der Überschrift «Mietvertrag bearbeiten». Das ist ausserhalb dieser Aufgabe, ich notiere es nur.
2. **Eine Eingabe ändern**, um später zu prüfen, ob sie bleibt: «Nettomiete pro Monat» von 1350.00 auf 1400.00.
3. **Wohnung wechseln** auf «Wohnung OG2 - Alpenblick» (Shift+Tab zurück, ArrowDown).
   Erwartet: Derselbe Hinweis wie im Assistenten, und genau ein Button.
   Gehört: Dieselbe Ansage in der Statusregion unter «Wohnung» («Überschneidung noch nicht geprüft. Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen» …»). Die Zählung `getByRole('button', { name: 'Erneut versuchen' })` ergibt **1**. Gut, kein doppelter Button.
4. **Hinweis bei «Vertragsbeginn».**
   Gehört (Tree):
   ```
   - textbox "Vertragsbeginn": 01.11.2022
   - button "Kalender für Vertragsbeginn öffnen"
   - paragraph: Dienstag, 1. November 2022
   - paragraph
   - paragraph: Überschneidung noch nicht geprüft
   - paragraph: Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.
   - status
   ```
   Der Text ist kurz und verweist auf den Button oben, statt einen zweiten anzubieten. Das verstehe ich. Wenn ich aber mit Tab auf das Feld gehe, höre ich nur «Vertragsbeginn, Erster Tag des Mietverhältnisses … Donnerstag, 1. Dezember 2022» (`aria-describedby="startDate-help startDate-words"`). Den Hinweis «Überschneidung noch nicht geprüft» finde ich nur im Lesemodus. Nachdem ich das Datum auf 01.12.2022 geändert habe, wurde nur «Donnerstag, 1. Dezember 2022» angesagt.
   «siehe oben bei der Wohnung» ist für mich verständlich (ich kann mit Shift+Tab zurück), aber nicht direkt anspringbar.
5. **Jetzt geht es wieder: Shift+Tab bis «Erneut versuchen», Enter.**
   Gehört: Wie im Assistenten: Der Hinweis oben und der Hinweis bei «Vertragsbeginn» verschwinden, die Statusregion wird leer, es wird **nichts angesagt**, und der Fokus fällt auf `body`. Der nächste Tab führt zu «Vertragsbeginn».
   **Eingaben erhalten:** Wohnung «OG2 - Alpenblick» [selected], Vertragsbeginn «01.12.2022», Nettomiete «1400.00», Akonto «190.00», Zusatzmiete «50.00», «Monatlich total CHF 1’640.00». Alles ist noch da.

## Verwirrung

- Nach «Erneut versuchen» herrscht Stille. Ich weiss nicht, ob es geklappt hat, ob die Prüfung keine Überschneidung fand oder ob die Seite neu geladen wurde. Erst wenn ich den Lesemodus durchsuche, merke ich, dass der Hinweis weg ist.
- Wenn es noch nicht geht, gibt es ebenfalls keine Rückmeldung. Zwei Mal Stille bedeutet einmal «geklappt» und einmal «nicht geklappt».
- «Überschneidung noch nicht geprüft»: Der zweite Satz erklärt, was gemeint ist, das ist gut. Allein als Überschrift wäre «Überschneidung» unklar (womit?).
- Im Bearbeiten-Formular verweist der Hinweis bei «Vertragsbeginn» mit «siehe oben» auf eine Stelle, die ich nur rückwärts mit Tab finde.

## Fehlerrisiken

- Wenn der Fokus auf `body` fällt, verliere ich unter Umständen die Orientierung. Manche Screenreader springen an den Seitenanfang, dann drücke ich über 20 Mal Tab bis zurück zum Formular.
- Da der Hinweis bei «Vertragsbeginn» nicht am Feld hängt, kann ich ein Datum eintragen, ohne zu hören, dass die Überschneidung noch offen ist. Weil Dwello laut Hinweis beim Speichern trotzdem prüft, ist das Risiko gering.
- Ohne Rückmeldung bei einem erneuten Fehler drücke ich womöglich mehrfach oder gebe auf.

## Vorschläge

1. **Major – Fokus geht nach erfolgreichem «Erneut versuchen» verloren.**
   Bildschirm: /contracts/new Schritt 2 und /contracts/{id}/edit.
   Reproduktion: Wohnung OG2 – Alpenblick wählen, während `/api/contracts?apartmentId=aaaa3333-…-333333333333` 500 liefert. Dann Tab auf «Erneut versuchen», Fehler aufheben, Enter.
   Beleg: danach `focus after body name="Zum Inhalt springen Dwello …"` (in beiden Formularen).
   Vorschlag: Den Fokus nach Erfolg auf das Feld «Wohnung» (oder auf die Bestätigung) setzen.
2. **Major – Keine Ansage nach erfolgreichem Laden.**
   Bildschirm und Reproduktion wie oben.
   Beleg: Die Statusregion wechselt von voll auf leer (`- status` ohne Inhalt), der Observer zeigt nur `status: ''`.
   Vorschlag: Kurz in der Statusregion ansagen, z. B. «Mietverträge geladen. Keine Überschneidung gefunden.» (bzw. die Überschneidungsmeldung, falls es eine gibt).
3. **Minor – Keine Rückmeldung, wenn «Erneut versuchen» wieder scheitert.**
   Reproduktion: wie oben, aber Leertaste drücken, solange der Fehler noch aktiv ist.
   Beleg: Der Request liefert erneut 500, `live []`, der Text bleibt unverändert, der Fokus bleibt auf dem Button.
   Vorschlag: Während des Ladens «Wird geladen …» ansagen und danach «Hat wieder nicht geklappt. Versuchen Sie es später noch einmal.»
4. **Minor – Hinweis bei «Vertragsbeginn» hängt nicht am Feld.**
   Bildschirm: /contracts/{id}/edit (und Assistent Schritt 3).
   Reproduktion: Wohnung OG2 mit Fehler wählen, Tab auf «Vertragsbeginn».
   Beleg: `describedby="startDate-help startDate-words"` (Bearbeiten) bzw. `describedby="startDate-help"` (Assistent). Der Hinweis «Überschneidung noch nicht geprüft / Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.» steht nur als `paragraph`.
   Vorschlag: Die Hinweis-ID in `aria-describedby` des Feldes aufnehmen, solange der Hinweis sichtbar ist. Dasselbe gilt für das Feld «Wohnung» (nur `apartment-help`).
5. **Nit – Button-Beschriftung wird in der Ansage mitgelesen.**
   Da der Button in der `status`-Region steckt, endet die Ansage mit «… überschneidet. Erneut versuchen».
   Vorschlag: Den Button ausserhalb der Live-Region platzieren und nur die zwei Sätze als Status ansagen.
6. **Nit (ausserhalb der Aufgabe) – Fokus nach Seitenwechsel auf `body`.**
   Reproduktion: In der Liste «Mietvertrag von Laura Keller bearbeiten» mit Enter öffnen.
   Beleg: `focus after nav body`.
   Vorschlag: Den Fokus auf die Überschrift «Mietvertrag bearbeiten» setzen.

## Nicht geprüft

- Echte Sprachausgabe von NVDA, JAWS oder VoiceOver: Ich habe nur den Accessibility-Tree, den Fokus und die Änderungen an Live-Regionen gelesen. Ob ein Screenreader beim Fokusverlust etwas sagt, hängt vom Screenreader ab.
- Speichern mit noch fehlenden Mietverträgen (die serverseitige Prüfung, die der Hinweis verspricht): Das gehörte nicht zur Aufgabe, ich habe nichts gespeichert.
- Den Fall, dass nach dem erfolgreichen Laden eine echte Überschneidung gefunden wird: Die Demo-Wohnung OG2 ist frei, das ergab sich hier nicht.
- Langsame Verbindung (Ladezustand während des Requests): Simuliert war nur der Fehler 500.
