# Persona-Lauf: Sven, Slice b13 (Hinweis «Mietverträge der Wohnung konnten nicht geladen werden»)

Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt am Accessibility-Tree (`readOut`), Fokus nach jedem Tastendruck mitgelesen, Live-Regionen mit einem Beobachter mitprotokolliert.

Simulierter Fehler: Die Anfrage `GET /api/contracts?apartmentId=aaaa1111-1111-1111-1111-444444444444` (Wohnung 2.02 - Musterhaus Zentrum, frei) antwortet mit Status 500, schon vor dem Öffnen der Seite. Alle anderen Anfragen laufen normal.

## Aufgabe geschafft: ja

Beide Teilaufgaben liessen sich vollständig mit der Tastatur erledigen. Der Hinweis wird an der Wohnungswahl angesagt und steht an der richtigen Stelle. Schwächen gibt es beim Vertragsbeginn, im Schritt «Prüfen» und bei einer doppelten Ansage im Bearbeiten-Formular.

## Aufwand

- Assistent bis Schritt 3: etwa 25 Tasten (rund 20 Tab-Drücke bis zum Feld «Mieter», 1 Pfeil, 3 Tab, Enter, 1 Tab, 2 Pfeile, 2 Tab, Enter). Ich habe keine Sprunglinks oder Landmarken benutzt, nur Tab.
- Bearbeiten: Liste → Mietvertrag → «Bearbeiten» → Wohnung wechseln: etwa 45 Tasten. Nach jedem Seitenwechsel steht der Fokus wieder ganz oben, deshalb führen jedes Mal 19 Tab-Drücke durch die Navigation.
- Insgesamt 9 Durchläufe, etwa 20 Minuten.

## Ablauf

### Teil 1: Assistent «Neuer Mietvertrag» (/contracts/new)

| Schritt | Erwartet | Gehört / gesehen |
|---|---|---|
| 1. Seite öffnen, mit Tab zum Mieter | Feld mit Namen und Hilfetext | `combobox "Mieter"`, Beschreibung: «Die Person, die die Wohnung mietet. Steht sie noch nicht in der Liste, erfassen Sie sie zuerst.» Gut. |
| 2. Pfeil nach unten, «Marco Bernasconi, Luzern», mit Tab zu «Weiter», Enter | Wechsel zu Schritt 2 mit Ansage | Der Fokus springt auf die Überschrift `heading "Schritt 2 von 5: Wohnung"`. Ich weiss sofort, wo ich bin. Gut. |
| 3. Mit Tab zur Wohnung | Wohnungsliste, freie zuoberst | `combobox "Wohnung"` mit dem Hilfetext «Freie Wohnungen stehen zuoberst. Vermietete Wohnungen sind mit «nicht verfügbar» markiert …». Wohnung 2.02 steht ohne Markierung bei den freien Wohnungen. |
| 4. Pfeil: OG2 | Keine Meldung | Keine Live-Ansage. Richtig. |
| 5. Pfeil: Wohnung 2.02 (Fehler-Wohnung) | Hinweis wird angesagt | Die Live-Region `status` (direkt nach der Combobox) erhält den Text «Die Mietverträge der Wohnung konnten nicht geladen werden. Laden Sie die Seite neu und versuchen Sie es erneut.» Höflich angesagt. **Erfüllt.** |
| 6. Pfeil: 3.02 | Hinweis verschwindet | Die Status-Region wird geleert, es gibt keine neue Ansage. Richtig. |
| 7. Zurück auf 2.02 | Hinweis erneut | Er wird erneut angesagt. Gut. |
| 8. Lesereihenfolge an der Wohnung | Hinweis nahe an der Wahl | Baum: `combobox "Wohnung"` → `status: paragraph: Die Mietverträge der Wohnung konnten nicht geladen werden …` → danach erst `button "Zurück"`. Der Hinweis steht direkt nach dem Feld. **Erfüllt.** Er ist aber nicht mit dem Feld verknüpft: Komme ich mit Shift+Tab zurück auf die Combobox, höre ich nur `describedby=apartment-help` (den allgemeinen Hilfetext), nicht den Hinweis. |
| 9. «Weiter» zu Schritt 3 | Fokus auf der Überschrift; Hinweis beim Vertragsbeginn | Der Fokus liegt auf `heading "Schritt 3 von 5: Vertragsdauer"`. Der Hinweis steht im Baum: `textbox "Vertragsbeginn"` → `button "Kalender für Vertragsbeginn öffnen"` → leerer `paragraph` → `status: … konnten nicht geladen werden …` → `radiogroup "Vertragsdauer"`. **Angesagt wird er beim Erscheinen nicht**, denn die Region kommt schon gefüllt zusammen mit dem ganzen Schritt (der Beobachter hat keine Ansage protokolliert). |
| 10. Mit Tab ins Feld «Vertragsbeginn» | Hinweis beim Feld | Gehört: «Vertragsbeginn, Erster Tag des Mietverhältnisses. Format TT.MM.JJJJ …» (`describedby=startDate-help`, nach der Eingabe zusätzlich `startDate-words`). **Der Hinweis gehört nicht zur Beschreibung des Felds.** Mit Tab höre ich ihn nie. Nur wer mit dem virtuellen Cursor weiterliest, stösst nach dem Kalender-Knopf darauf. |
| 11. Datum 01.11.2026 eingeben, Tab | Bestätigung | Live-Ansage «Sonntag, 1. November 2026». Gut. |
| 12. Weiter zu Schritt 4, Nettomiete 1500.00, Weiter zu Schritt 5 «Prüfen» | Erinnerung, dass nicht auf Überschneidungen geprüft werden konnte | Schritt 5 zeigt Mieter, Wohnung 2.02, Beginn, Miete und den Knopf «Mietvertrag speichern». **Kein Hinweis mehr.** Gespeichert habe ich nicht. |
| 13. Seite neu laden, wie der Hinweis sagt | Angaben bleiben erhalten | Nach dem Neuladen fokussiert die Seite die Meldung «Entwurf wiederhergestellt. Ihre Angaben, zuletzt am 13.10.2026 um 19:04 bearbeitet, sind wieder da.» Danach beginnt der Assistent wieder bei Schritt 1, Mieter schon gewählt. Der Rat im Hinweis kostet also keine Daten. Gut. Weil der Fehler weiter simuliert war, kam der Hinweis wieder. |

### Teil 2: Bestehenden Mietvertrag bearbeiten

| Schritt | Erwartet | Gehört / gesehen |
|---|---|---|
| 1. /contracts, mit Tab zu «Nina Brunner», Enter | Detailseite, Fokus auf dem Titel | Die Detailseite «Mietvertrag von Nina Brunner» lädt. Der Fokus liegt auf `BODY`, ich muss wieder von oben tabben. |
| 2. Mit Tab zu «Bearbeiten», Enter | Formular | Fokus wieder auf `BODY`. Nach 19 Tab-Drücken komme ich zu `combobox "Mieter"` (Nina Brunner) und dann zu `combobox "Wohnung"` (Wohnung A2, gewählt). |
| 3. Pfeil hoch: 3.02 | Keine Meldung | Keine Ansage. Richtig. |
| 4. Pfeil hoch: 2.02 (Fehler-Wohnung) | Hinweis wird angesagt | Angesagt, **aber zweimal**: Der Beobachter protokolliert zwei verschiedene Live-Regionen (Index #0 unter der Wohnung und #3 beim Vertragsbeginn), die gleichzeitig denselben Text bekommen: «Die Mietverträge der Wohnung konnten nicht geladen werden. Laden Sie die Seite neu und versuchen Sie es erneut.» Ein Screenreader liest das zweimal hintereinander vor. |
| 5. Lesereihenfolge | Hinweis bei der Wohnung und beim Vertragsbeginn | Baum: `combobox "Wohnung"` → `status: … konnten nicht geladen werden …` → `heading "Vertragsdauer"` → `textbox "Vertragsbeginn": 01.07.2025` → Kalender-Knopf → `paragraph: Dienstag, 1. Juli 2025` → leerer `paragraph` → `status: … konnten nicht geladen werden …`. Beide Stellen sind vorhanden. **Erfüllt.** |
| 6. Mit Tab ins Feld «Vertragsbeginn» | Hinweis in der Feldbeschreibung | Gehört: «Vertragsbeginn, 01.07.2025, Erster Tag des Mietverhältnisses … Dienstag, 1. Juli 2025». Der Hinweis gehört **nicht** zur Feldbeschreibung, wie im Assistenten. |
| 7. Datum auf 01.11.2026 ändern, mit Tab weiter | Prüfung oder erneuter Hinweis | Angesagt wird nur «Sonntag, 1. November 2026». Ich komme bis «Änderungen speichern». Gespeichert habe ich nicht. |

## Verwirrung

- «Laden Sie die Seite neu und versuchen Sie es erneut»: Ich weiss nicht, was ich «erneut versuchen» soll und was passiert, wenn ich trotzdem weitermache. Darf ich speichern? Prüft Dwello dann trotzdem auf Überschneidungen? Der Hinweis sagt, was passiert ist, aber nicht, was es für mich bedeutet: dass Dwello nicht prüfen kann, ob sich der neue Mietvertrag mit einem bestehenden überschneidet.
- In der Liste steht Wohnung 2.02 bei den freien Wohnungen, obwohl Dwello ihre Mietverträge nicht laden konnte. Ich frage mich, wie sicher «frei» dann ist.
- Im Bearbeiten-Formular nennen die Wohnungsoptionen nur Nummer und Gebäude (`Wohnung 2.02 - Musterhaus Zentrum`), im Assistenten auch Zimmer und Fläche. Das ist uneinheitlich, aber kein Hindernis.

## Fehlerrisiken

- Im Assistenten kann ich mit Tab durch Schritt 3 gehen, ohne den Hinweis je zu hören. In Schritt 5 «Prüfen» fehlt er ganz. Ein Screenreader-Nutzer kann so einen Mietvertrag für eine Wohnung speichern, deren bestehende Mietverträge Dwello nicht kennt. Ob das Backend eine Überschneidung trotzdem ablehnt, habe ich nicht geprüft (nicht gespeichert).
- Doppelte Ansage im Bearbeiten-Formular: Ich frage mich, ob zwei Fehler aufgetreten sind.

## Vorschläge

1. **Minor**: Hinweis beim Vertragsbeginn mit dem Feld verknüpfen.
   Bildschirm: Assistent, Schritt 3 «Vertragsdauer»; Bearbeiten-Formular, Feld «Vertragsbeginn».
   Reproduktion: Fehler simulieren, Wohnung 2.02 wählen, zu Schritt 3 gehen, mit Tab ins Feld «Vertragsbeginn». Gehört wird nur `describedby=startDate-help startDate-words`. Der `status`-Absatz steht erst nach dem Kalender-Knopf und gehört nicht dazu. Vorschlag: die ID des Hinweises in `aria-describedby` des Felds aufnehmen. Dasselbe gilt für die Combobox «Wohnung» (`describedby=apartment-help` ohne Hinweis).
2. **Minor**: Beim Betreten von Schritt 3 wird der Hinweis nicht angesagt.
   Bildschirm: Assistent, Schritt 3.
   Reproduktion: wie 1, «Weiter» auf Schritt 2. Der Fokus geht auf die Überschrift, die Live-Region kommt schon gefüllt dazu, es gibt keine Ansage. Mit Vorschlag 1 wäre das ausreichend gelöst. Sonst den Hinweis vor das Feld setzen, damit er beim Lesen ab der Überschrift vor dem Feld kommt.
3. **Minor**: Doppelte Ansage im Bearbeiten-Formular.
   Bildschirm: /contracts/{id}/edit.
   Reproduktion: Fehler simulieren, «Bearbeiten» bei Nina Brunner, Combobox «Wohnung», zweimal Pfeil hoch auf 2.02. Zwei `status`-Regionen (unter der Wohnung und beim Vertragsbeginn) bekommen gleichzeitig denselben Text. Vorschlag: nur die Region bei der Wohnung live machen. Den Text beim Vertragsbeginn als normalen Text lassen, der über `aria-describedby` mit dem Feld verknüpft ist.
4. **Minor**: Hinweis in Schritt 5 «Prüfen» wiederholen.
   Bildschirm: Assistent, Schritt 5.
   Reproduktion: wie oben bis Schritt 5. Unter «Wohnung: Wohnung 2.02 - Musterhaus Zentrum» steht kein Hinweis. Vorschlag: dort derselbe Hinweis, direkt vor «Mietvertrag speichern».
5. **Minor**: Folge im Hinweis nennen.
   Bildschirm: Wohnung (Assistent und Bearbeiten).
   Vorschlag: zum Beispiel «Dwello kann deshalb nicht prüfen, ob sich der Mietvertrag mit einem bestehenden überschneidet. Laden Sie die Seite neu, bevor Sie speichern.» Der Wortlaut ist fachlich zu prüfen.
6. **Nit**: Fokus nach dem Seitenwechsel.
   Bildschirm: Mietvertrag-Detail und Bearbeiten.
   Reproduktion: Enter auf «Nina Brunner» oder «Bearbeiten». Der Fokus liegt auf `BODY`, 19 Tab-Drücke durch die Navigation bis zum ersten Feld. Mit «Zum Inhalt springen» geht es kürzer, das liegt aber ausserhalb dieses Slices.
7. **Nit**: Wohnungsoptionen im Bearbeiten-Formular ohne Zimmer und Fläche, anders als im Assistenten.

## Nicht geprüft

- Speichern (Assistent «Mietvertrag speichern», Bearbeiten «Änderungen speichern») mit der Fehler-Wohnung: Ich wollte keine Daten anlegen und wusste nicht, ob das Backend eine Überschneidung ablehnt.
- Echte Screenreader-Ausgabe (NVDA, JAWS, VoiceOver): Beurteilt habe ich nur den Accessibility-Tree, Fokus und `aria-describedby` sowie die Änderungen an den Live-Regionen. Ob ein Screenreader die Ansage bei einem `select` während der Pfeilnavigation unterbricht, kann ich so nicht feststellen.
- Neuladen mit F5 über die Tastatur hat im automatisierten Browser nicht ausgelöst. Neu geladen habe ich durch erneutes Aufrufen der Adresse.
- Eine vermietete Wohnung mit fehlschlagender Anfrage: Gewählt wurde nur eine freie Wohnung (2.02), wie vorgegeben, eine Fehler-Wohnung.
