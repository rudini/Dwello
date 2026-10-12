<!-- Persona run I3 on 7324c57; screenshots stayed in the session's scratchpad -->

# Persona-Test I3: Sven, 45, blind, Screenreader und Tastatur (Vertragsende in der Vergangenheit)

Datum des Laufs: Montag, 12.10.2026. Desktop, nur Tastatur (Tab, Shift+Tab, Leertaste, Enter, Tippen), Seite gelesen über den Accessibility-Tree (Rolle, Name, Beschreibung über `aria-describedby`, `aria-invalid`, Live-Regionen, `document.activeElement`). Kein echter Screenreader; was «angesagt» wird, leite ich aus Fokus, Beschreibung und Live-Regionen ab.
Gewählter Mietvertrag: **Nina Brunner, Wohnung A2, Seepark Residenz** (laufend seit 01.07.2025, unbefristet). Sie ist die einzige Mieterin mit laufendem, unbefristetem Vertrag in der Seepark Residenz.
Ziel-Vertragsende: **31.08.2026** (liegt in der Vergangenheit).

## Aufgabe geschafft: **ja**

1. **Vertragsende nachgetragen:** ja. Die Detailseite zeigt jetzt «Vertragsdauer: Beendet, Vertragsbeginn 01.07.2025, Vertragsende 31.08.2026», der Schalter «Beenden» ist weg. In der Liste steht «Wohnung A2 · Seepark Residenz Beendet 01.07.2025 – 31.08.2026». Das neue Kontrollkästchen «Der Mietvertrag ist seit dem 01.09.2026 beendet.» ist da (der Build ist aktuell).
2. **Löschdialog des beendeten Vertrags:** geöffnet, verstanden, mit Escape geschlossen. Löschen ist dort nicht möglich.
3. **Künftiger Mietvertrag in der Seepark Residenz:** **keiner vorhanden.** Filter «Gebäude: Seepark Residenz» und «Vertragsstatus: Künftige Mietverträge» ergibt «Keine Mietverträge gefunden». Die Seepark Residenz hat vier Mietverträge (Nina Brunner, Marco Bernasconi, Thomas Weber, Sarah Meier), keiner davon künftig. Ich habe keinen angelegt und nichts gelöscht.

Nebenbei habe ich bei Marco Bernasconi (Seepark, B2) den Dialog «Beenden» nur geöffnet, Fehlerfälle geprüft (leer, «12.13.2026», gestern, heute) und mit Escape abgebrochen; sein Vertrag ist weiterhin unbefristet.

## Aufwand (Tastendrücke)

| Schritt | Tasten |
|---|---|
| Liste «Mietverträge»: Sprunglink (Tab, Enter), Tab ×6 zu «Nina Brunner», Enter | 9 |
| Detailseite → «Beenden» (Tab ×19 vom Seitenanfang, Enter) | 20 |
| Dialog: Tab ×2 ins Feld, «31.08.2026» tippen, Enter (Fehler: Kästchen nicht bestätigt) | 13 |
| Leertaste (Kästchen ankreuzen), Tab ×2 zu «Mietvertrag beenden», Enter | 4 |
| **Total für Aufgabe 1 mit einem Fehlversuch** | **46** |
| Kürzester Weg im Dialog ohne Fehlversuch (Tab ×2, Datum, Tab ×2, Leertaste, Enter) | 16 |
| Löschdialog: Tab ×3 von der Überschrift (nach dem Speichern), Enter, Escape | 5 |
| Filter Seepark + Künftige: Sprunglink, Tab ×3, Pfeil ×2, Tab, Pfeil ×2, Tab, Enter | 12 |

Auf der Detailseite brauche ich vom Seitenanfang weiterhin 19 Tabs bis «Beenden» (oder Sprunglink plus 3 Tabs).

## Ablauf (was angesagt wurde)

1. **Liste → Detailseite:** Seitentitel «Mietvertrag - Nina Brunner - Dwello». Der Fokus liegt danach auf dem Dokument (Seitenanfang), nicht auf der Überschrift. Hauptbereich: Brotkrümel «Mietverträge», «Mietvertrag von Nina Brunner, Überschrift Ebene 1», «Wohnung A2 · Seepark Residenz», «Bearbeiten», «Beenden», «Löschen», unter «Vertragsdauer» «Laufend», «Vertragsende: Unbefristet».
2. **Dialog öffnen:** «Mietvertrag beenden?, Dialog», dann als Dialogbeschreibung der **ganze Dialoginhalt**: «Vertragsende. Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht. Format TT.MM.JJJJ. Beispiel: 31.12.2026. Prüfen Sie Frist und Termin im Mietvertrag: Für Wohnungen gilt eine Kündigungsfrist von mindestens 3 Monaten. Ist die Kündigung zu spät, gilt sie erst auf den nächsten Kündigungstermin. Ein neuer Mietvertrag kann am Tag danach beginnen.» Das sind rund **63 Wörter** (in I2 waren es 26). Fokus: **«Abbrechen, Schalter»**. Tab-Reihenfolge vor dem Tippen: Abbrechen → Mietvertrag beenden → Vertragsende → Kalender für Vertragsende öffnen → Abbrechen.
3. **Feld:** «Vertragsende, Eingabefeld, leer. Der letzte Tag des Mietverhältnisses … Beispiel: 31.12.2026» (27 Wörter). Das Beispiel liegt jetzt in der Zukunft und stimmt mit dem Beispiel in den Fehlermeldungen überein.
4. **«31.08.2026» tippen:** Die Live-Region sagt höflich «Montag, 31. August 2026». **Sonst nichts.** Dass gleichzeitig unter dem Feld ein neues Kontrollkästchen erscheint, wird nicht angesagt, und nichts sagt mir, dass das Datum in der Vergangenheit liegt.
5. **Tab-Reihenfolge nach dem Tippen:** Vertragsende → Kalender öffnen → **«Der Mietvertrag ist seit dem 01.09.2026 beendet., Kontrollkästchen, nicht aktiviert. Ab diesem Tag gilt die Wohnung als leer, wenn kein neuer Mietvertrag beginnt. Das Akonto des Mieters zählt nur bis zum Vertragsende.»** → Abbrechen → Mietvertrag beenden → Vertragsende. Rückwärts mit Shift+Tab genau umgekehrt. Die Reihenfolge ist sinnvoll: Das Kästchen kommt direkt nach dem Feld, zu dem es gehört, und vor den Schaltern. Die Hilfe wird als Beschreibung vorgelesen (22 Wörter).
6. **Bestätigen ohne Kästchen, Variante A (Enter im Feld):** Nichts wird gespeichert, der Dialog bleibt offen. Der **Fokus springt aufs Kästchen**: «Der Mietvertrag ist seit dem 01.09.2026 beendet., Kontrollkästchen, nicht aktiviert, **ungültig**. Ab diesem Tag gilt die Wohnung als leer … zählt nur bis zum Vertragsende. **Bitte bestätigen Sie, dass der Mietvertrag seit dem 01.09.2026 beendet ist.**» Der Fehler kommt nach dem Namen (7 Wörter) und 22 Wörtern Hilfe. Keine Live-Region, kein `role="alert"`, kein `aria-errormessage`; die Ansage hängt am Fokuswechsel. Was zu tun ist, verstehe ich: ankreuzen.
7. **Bestätigen ohne Kästchen, Variante B (Schalter «Mietvertrag beenden»):** gleiches Verhalten, Fokus vom Schalter aufs Kästchen, gleiche Ansage.
8. **Enter auf dem nicht angekreuzten Kästchen:** löst wieder das Absenden aus, der Fokus bleibt auf dem Kästchen (kurz verlassen und neu gesetzt), gleiche Ansage. Nichts gespeichert.
9. **Leertaste:** «aktiviert». Aber das Kästchen bleibt **«ungültig»**, und die Beschreibung endet weiterhin mit «Bitte bestätigen Sie, dass der Mietvertrag seit dem 01.09.2026 beendet ist.» Auch sichtbar bleibt die rote Meldung stehen. Ich höre also «aktiviert, ungültig, … Bitte bestätigen Sie …» und frage mich, ob das Ankreuzen gezählt hat.
10. **Speichern (Tab ×2, Enter auf «Mietvertrag beenden»):** Der Dialog schliesst, die Seite lädt neu. Assertiv kommt der Seitentitel **«Mietvertrag - Nina Brunner - Dwello»**, dann landet der **Fokus auf der Überschrift** «Mietvertrag von Nina Brunner, Ebene 1», und höflich (Status) **«Der Mietvertrag von Nina Brunner ist seit dem 01.09.2026 beendet»**. Unter «Vertragsdauer» steht jetzt **«Beendet»**, Vertragsende 31.08.2026. Der Schalter «Beenden» ist weg.
11. **Löschdialog (beendeter Vertrag):** «Mietvertrag löschen?, Dialog. Ein Mietvertrag, der begonnen hat, kann nicht gelöscht werden: Die Nebenkostenabrechnung braucht seine Mietstage. Ist er falsch erfasst, korrigieren Sie ihn unter «Bearbeiten».» Fokus auf «Abbrechen». Tab und Shift+Tab bleiben auf «Abbrechen», denn «Mietvertrag löschen» ist nativ deaktiviert und nicht fokussierbar. Den deaktivierten Schalter höre ich nur im Lesemodus («Mietvertrag löschen, Schalter, nicht verfügbar»); er hat keine eigene Beschreibung, der Grund steht nur in der Dialogbeschreibung. Escape schliesst, der Fokus kehrt auf «Löschen» zurück.
12. **Filter künftige Verträge:** Nach «Suchen» liegt der Fokus auf «Keine Mietverträge gefunden, Überschrift Ebene 2», darunter «Kein Mietvertrag passt zur Suche und zu den Filtern.» Klar und schnell. Gleichzeitig kommt assertiv der Seitentitel «Mietverträge - Dwello».

Weitere Prüfungen bei Marco Bernasconi (nur geöffnet, abgebrochen): Leeres Feld + Enter → Fokus im Feld, «ungültig», Fehler «Bitte geben Sie das Vertragsende ein, zum Beispiel 31.12.2026.» nach 27 Wörtern Hilfe. «12.13.2026» → «Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein, zum Beispiel 31.12.2026.» Gestern (11.10.2026) → Kästchen «seit dem 12.10.2026 beendet» erscheint. Heute (12.10.2026) → kein Kästchen. Der Wochentag hängt bei einem Fehler nicht mehr hinter der Fehlermeldung.

## Befunde

### Blocker

- Keine.

### Major

- **Das neue Kontrollkästchen erscheint stumm (WCAG 4.1.3 Statusmeldungen, 3.3.2 Beschriftungen oder Anweisungen).** Nach dem Tippen eines vergangenen Datums höre ich nur den Wochentag. Dass ein Pflicht-Kästchen dazugekommen ist und warum (das Datum liegt in der Vergangenheit), erfahre ich erst durch einen Fehlversuch oder durch Zufall beim Weitertabben. Wer wie ich in I2 gelernt hat, mit Enter im Feld abzuschicken, läuft garantiert in den Fehler. Der Fehler ist danach gut lösbar, deshalb kein Blocker.
  **Vorschlag:** Die bestehende Live-Region ergänzen: «Montag, 31. August 2026. Dieses Datum liegt in der Vergangenheit. Bestätigen Sie unten, dass der Mietvertrag beendet ist.» Alternativ das Kästchen mit `aria-describedby` am Feld ankündigen.

### Minor

- **Nach dem Ankreuzen bleibt das Kästchen «ungültig» und die Fehlermeldung bleibt stehen (WCAG 4.1.2 Name, Rolle, Wert; 3.3.1 Fehlererkennung).** Ich höre «aktiviert, ungültig, … Bitte bestätigen Sie …», obwohl ich bestätigt habe. Das verunsichert, ob die Leertaste gewirkt hat. **Vorschlag:** Beim Ankreuzen `aria-invalid` entfernen und die Meldung ausblenden, wie es das Datumsfeld beim Weitertippen schon tut.
- **Dialogbeschreibung beim Öffnen ist wieder lang (63 statt 26 Wörter).** `aria-describedby` des Dialogs zeigt auf den ganzen Inhalt, also Feldhilfe plus den neuen Rechtshinweis zur Kündigungsfrist. Die Feldhilfe höre ich beim Tab ins Feld ein zweites Mal. **Vorschlag:** Die Dialogbeschreibung auf den Rechtshinweis beschränken (oder ganz weglassen) und die Feldhilfe nur am Feld lassen.
- **Fehlermeldung steht hinter der Hilfe, ohne `aria-errormessage` (WCAG 3.3.1).** Am Kästchen kommt der Fehler nach 22 Wörtern Hilfe, am Datumsfeld nach 27. Die Ansage hängt allein am Fokuswechsel. Kürzer als in I2, darum nur noch Minor. **Vorschlag:** Fehler zuerst in `aria-describedby` (`…-error …-help`) oder über `aria-errormessage` verbinden.
- **Zwei Daten für dieselbe Sache.** Ich tippe 31.08.2026, das Kästchen und die Bestätigung nach dem Speichern sagen «seit dem 01.09.2026 beendet», die Detailseite «Vertragsende 31.08.2026». Fachlich stimmt es (letzter Tag vs. erster Tag ohne Vertrag), aber ohne Mietrecht-Kenntnis muss ich kurz rechnen. **Vorschlag:** «Der Mietvertrag endete am 31.08.2026 und ist seit dem 01.09.2026 beendet.» oder nur ein Datum verwenden.
- **Die Hilfe am Kästchen erklärt die Folgen, aber nicht den Grund.** «Ab diesem Tag gilt die Wohnung als leer …» sagt nicht, dass das Kästchen nur erscheint, weil das Datum vorbei ist. **Vorschlag:** Ersten Satz voranstellen: «Das Vertragsende liegt in der Vergangenheit.»
- **Assertiver Seitentitel ist zurück (Regression gegenüber I2).** Nach dem Speichern und nach «Suchen» kommt der Seitentitel assertiv, gleichzeitig mit Fokus auf der Überschrift und der höflichen Bestätigung. Je nach Screenreader unterbricht oder verdrängt das die Bestätigung. **Vorschlag:** Bei Formularrückkehr auf dieselbe Seite die Titel-Ansage unterdrücken, wie in I2.
- **Löschdialog: deaktivierter Schalter ohne Grund am Schalter (WCAG 4.1.2, Best Practice).** Im Tab-Kreis existiert «Mietvertrag löschen» nicht; im Lesemodus heisst er nur «nicht verfügbar». Der Grund steht in der Dialogbeschreibung und ist verständlich. **Vorschlag:** Den Schalter bei begonnenen Verträgen ganz weglassen und den Dialog «Mietvertrag kann nicht gelöscht werden» nennen (Schalter «Schliessen»), oder `aria-disabled="true"` plus `aria-describedby` auf den Grund.
- **«Mietstage» (geblieben).** Im Löschdialog weiterhin «Mietstage»; vorgelesen klingt das falsch. Wohl «Miettage» (`TODO(fachlich prüfen)`).
- **Fokus startet auf «Abbrechen», Schalter vor dem Feld (geblieben).** Bis ins einzige Feld brauche ich zwei Tabs über «Mietvertrag beenden». **Vorschlag:** Fokus beim Öffnen ins Feld «Vertragsende».
- **Detailseite: Fokus nach dem Seitenwechsel am Seitenanfang (geblieben).** 19 Tabs bis «Beenden»; nach dem Speichern liegt der Fokus dagegen auf der Überschrift.
- **Listenlink nur mit Mieternamen (geblieben).** «Nina Brunner» ohne Wohnung, Gebäude und Status; «Kevin Fischer» kommt zweimal vor.

## Was gut ist

- Das Kontrollkästchen ist da, korrekt beschriftet (`<label>`), seine Hilfe ist per `aria-describedby` verbunden und es steht in der Tab-Reihenfolge direkt nach dem Feld, vor den Schaltern.
- Ohne Bestätigung wird **nichts gespeichert**, egal ob über Enter im Feld, Enter auf dem Kästchen oder den Schalter. Der Fokus springt jedes Mal aufs Kästchen, das als «ungültig» markiert ist, und die Meldung sagt klar, was zu tun ist.
- Heute als Vertragsende braucht keine Bestätigung, gestern schon: die Grenze stimmt.
- Nach dem Speichern: Fokus auf der Überschrift, klare Statusmeldung mit Name und Datum, und die Detailseite sagt jetzt **«Beendet»** statt «Laufend» (Minor aus I2 behoben). Die Liste zeigt «Beendet 01.07.2025 – 31.08.2026».
- Das Beispiel in der Hilfe (31.12.2026) liegt in der Zukunft und stimmt mit den Fehlermeldungen überein (Minor aus I2 behoben). Der Wochentag hängt nicht mehr hinter Fehlermeldungen (Minor aus I2 behoben).
- Der Löschdialog nennt den Grund verständlich und zeigt den Ausweg («korrigieren Sie ihn unter «Bearbeiten»»). Escape bringt den Fokus zurück auf «Löschen».
- Die Filter der Mietvertragsliste sind native Auswahllisten, mit Pfeiltasten bedienbar; das leere Ergebnis bekommt den Fokus und ist eindeutig.
