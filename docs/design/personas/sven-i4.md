<!-- Persona run I4 on d4667dc; screenshots stayed in the session's scratchpad -->

# Persona-Test I4: Sven, 45, blind, Screenreader und Tastatur (Vertragsende in der Vergangenheit, Dialog und «Bearbeiten»)

Datum des Laufs: Montag, 12.10.2026. Desktop, nur Tastatur (Tab, Shift+Tab, Pfeiltasten, Leertaste, Enter, Tippen), Seite gelesen über den Accessibility-Tree (Rolle, Name, Beschreibung über `aria-describedby`, `aria-invalid`, `document.activeElement`) und einen MutationObserver auf allen Live-Regionen (`aria-live`, `role="status"`). Kein echter Screenreader; was «angesagt» wird, leite ich aus Fokus, Beschreibung und Live-Regionen ab. Wo eine Live-Region kein `aria-atomic` hat, nehme ich an, dass ein Screenreader nur den neu eingefügten Text vorliest.

Gewählte Mietverträge (Demodaten frisch, alle in der Seepark Residenz):
- Aufgabe 1: **Nina Brunner, Wohnung A2** (laufend seit 01.07.2025, unbefristet). Sie war in diesem Datenbestand noch nicht beendet.
- Aufgabe 2: **Marco Bernasconi, Wohnung B2** (laufend seit 01.07.2023, unbefristet).

## Aufgabe geschafft: **ja**

1. **Vertragsende 31.08.2026 nachgetragen:** ja. Detailseite: «Vertragsdauer: Beendet, Vertragsbeginn 01.07.2025, Vertragsende 31.08.2026», der Schalter «Beenden» ist weg. Liste: «Wohnung A2 · Seepark Residenz Beendet 01.07.2025 – 31.08.2026».
2. **«Bearbeiten» mit vergangenem Vertragsende:** ja. Befristet, 31.07.2026, erst ohne Kästchen gespeichert (abgewiesen, Fokus aufs Kästchen), dann angekreuzt und gespeichert: «Beendet, Vertragsende 31.07.2026». Danach wieder auf «Unbefristet» gestellt und gespeichert: Detailseite und Liste zeigen «Laufend seit 01.07.2023, unbefristet» wie vorher.
3. Nebenbei im Dialog geprüft und abgebrochen: Datum korrigieren bei angekreuztem Kästchen, heute, gestern, ein Datum vor Vertragsbeginn; Löschdialog des beendeten Vertrags nur geöffnet und mit Escape geschlossen.

## Aufwand (Tastendrücke)

| Schritt | Tasten |
|---|---|
| Liste «Mietverträge»: Sprunglink (Tab, Enter), Tab ×6 zu «Nina Brunner», Enter | 9 |
| Detailseite → «Beenden»: Tab ×19 vom Seitenanfang, Enter (mit Sprunglink: Tab, Enter, Tab ×3, Enter = 6) | 20 |
| Dialog: Tab ×2 ins Feld, «31.08.2026» tippen, Enter (Fehler: Kästchen nicht bestätigt) | 13 |
| Leertaste (Kästchen ankreuzen), Tab ×2 zu «Mietvertrag beenden», Enter | 4 |
| **Total Aufgabe 1 mit einem Fehlversuch** | **46** (mit Sprunglink 32) |
| Kürzester Weg im Dialog ohne Fehlversuch (Tab ×2, Datum, Tab ×2, Leertaste, Enter) | 16 |
| Detailseite → «Bearbeiten» (Sprunglink, Tab ×2, Enter) | 5 |
| Formular: Sprunglink, Tab ×7 zur Vertragsdauer, Pfeil runter, Tab, Datum, Tab ×7 zu «Änderungen speichern», Enter (Fehler) | 29 |
| Leertaste, Tab ×5, Enter | 7 |
| **Total Aufgabe 2 mit einem Fehlversuch** | **41** |
| Zurück auf «Unbefristet» (Sprunglink, Tab ×7, Pfeil hoch, Tab ×5, Enter) | 16 |

Die Zahlen für Aufgabe 1 sind gleich wie in I3.

## Ablauf (was angesagt wurde)

### Aufgabe 1: Dialog «Beenden»

1. **Liste → Detailseite:** Assertiv der Seitentitel «Mietvertrag - Nina Brunner - Dwello». Fokus danach am Seitenanfang (Dokument), nicht auf der Überschrift. Unter «Vertragsdauer» «Laufend», «Vertragsende: Unbefristet».
2. **Dialog öffnen:** «Mietvertrag beenden?, Dialog», als Beschreibung wieder der **ganze Dialoginhalt mit 63 Wörtern** (Feldhilfe plus Hinweis zur Kündigungsfrist). Fokus auf **«Abbrechen, Schalter»**. Tab-Reihenfolge: Abbrechen → Mietvertrag beenden → Vertragsende → Kalender für Vertragsende öffnen → Abbrechen.
3. **Feld:** «Vertragsende, Eingabefeld, leer. Der letzte Tag des Mietverhältnisses … Format TT.MM.JJJJ. Beispiel: 31.12.2026».
4. **«31.08.2026» tippen:** Bei den ersten neun Zeichen sagt keine Live-Region etwas. **Erst beim letzten Zeichen, genau einmal,** kommen zwei höfliche Ansagen:
   - «Montag, 31. August 2026» (Wochentag, wie bisher),
   - **«Der Mietvertrag endete am 31.08.2026. Das Vertragsende liegt in der Vergangenheit. Seit dem 01.09.2026 gilt die Wohnung als nicht vermietet, wenn kein neuer Mietvertrag begonnen hat. Die Nebenkosten dieser Zeit trägt der Vermieter. Das Akonto des Mieters zählt nur bis zum Vertragsende.»** (42 Wörter; das ist Beschriftung plus Hilfe des neuen Kästchens).
   Ich erfahre jetzt also, dass das Datum in der Vergangenheit liegt. **Nicht gesagt wird, dass ein Kontrollkästchen erschienen ist und dass ich es ankreuzen muss.** Der erste Satz «Der Mietvertrag endete am 31.08.2026.» klingt wie eine Bestätigung, dass schon gespeichert wurde.
5. **Tab-Reihenfolge nach dem Tippen:** Vertragsende → Kalender öffnen → **«Der Mietvertrag endete am 31.08.2026., Kontrollkästchen, nicht aktiviert. Das Vertragsende liegt in der Vergangenheit. Seit dem 01.09.2026 … zählt nur bis zum Vertragsende.»** → Abbrechen → Mietvertrag beenden → Vertragsende. Shift+Tab genau umgekehrt. **Die Beschriftung ist das Datum, das ich getippt habe.** Die Hilfe beginnt jetzt mit dem Grund.
6. **Enter im Feld, ohne Kästchen:** Nichts gespeichert, Dialog bleibt offen, **Fokus springt aufs Kästchen**: «Der Mietvertrag endete am 31.08.2026., Kontrollkästchen, nicht aktiviert, ungültig. Das Vertragsende liegt in der Vergangenheit … (37 Wörter Hilfe) … **Bitte bestätigen Sie, dass der Mietvertrag am 31.08.2026 endete, oder korrigieren Sie das Vertragsende.**» Gleichzeitig fügt die höfliche Live-Region um das Kästchen die Fehlermeldung ein; ich höre den Fehler also voraussichtlich **zweimal** (einmal über den Fokus, einmal über die Live-Region). Die Meldung ist klar und nennt beide Auswege.
7. **Leertaste:** «aktiviert». **`aria-invalid` ist weg, die Fehlermeldung ist weg**, die Beschreibung endet wieder mit der Hilfe. Das war in I3 ein Minor und ist behoben. Erneut abwählen bringt keinen Fehler zurück, bevor ich wieder absende; erneut ankreuzen geht ohne Ansage über die Live-Region hinaus.
8. **Speichern (Tab ×2, Enter auf «Mietvertrag beenden»):** Dialog schliesst. Assertiv **der Seitentitel «Mietvertrag - Nina Brunner - Dwello»**, Fokus auf der **Überschrift «Mietvertrag von Nina Brunner, Ebene 1»**, höflich (Status) **«Der Mietvertrag von Nina Brunner endete am 31.08.2026»**. Ein einziges Datum, das, das ich getippt habe. «Vertragsdauer: Beendet, Vertragsende 31.08.2026».

Weitere Prüfungen im Dialog (abgebrochen):
- **Datum ändern, während das Kästchen angekreuzt ist** (31.08.2026 → 31.08.2025): Das Kästchen ist danach wieder **nicht aktiviert** und heisst «Der Mietvertrag endete am 31.08.2025.»; die Live-Region sagt einmal «Sonntag, 31. August 2025» und den neuen Text, jetzt mit «Das ist über ein Jahr her. Prüfen Sie das Jahr.» Gut: die Bestätigung gilt nur für das angesagte Datum, und der Jahres-Tippfehler wird angesprochen.
- **Heute (12.10.2026):** nur «Montag, 12. Oktober 2026», kein Kästchen. **Gestern (11.10.2026):** Kästchen erscheint. Grenze stimmt.
- **30.06.2025 (vor dem Vertragsbeginn 01.07.2025):** Beim Tippen kommt trotzdem die ganze Kästchen-Ansage («… über ein Jahr her …»). Erst Enter bringt assertiv «Das Vertragsende kann nicht vor dem Vertragsbeginn am 01.07.2025 liegen.», Fokus im Feld, «ungültig».
- **Löschdialog (beendeter Vertrag):** «Mietvertrag löschen?, Dialog. Ein Mietvertrag, der begonnen hat, kann nicht gelöscht werden: Die Nebenkostenabrechnung braucht seine Mietstage, also die Tage, an denen er gilt. Ist er falsch erfasst, korrigieren Sie ihn unter «Bearbeiten».» Fokus auf «Abbrechen», der Löschschalter ist weiterhin nativ deaktiviert. Escape bringt den Fokus zurück auf «Löschen».

### Aufgabe 2: «Bearbeiten»

1. **Detailseite → «Bearbeiten»:** Beim Laden kommen drei Ansagen fast gleichzeitig: Status «Es wird geprüft, welche Wohnungen frei sind …», höflich **«Samstag, 1. Juli 2023»** (Wochentag des vorbefüllten Vertragsbeginns, ohne dass ich etwas getan habe) und assertiv «Mietvertrag bearbeiten - Dwello». Fokus am Seitenanfang; 18 Tabs bis zum ersten Feld, mit Sprunglink 4.
2. **Felder:** «Mieter, Auswahlliste», «Wohnung, Auswahlliste», «Vertragsbeginn, Eingabefeld, 01.07.2023 … Samstag, 1. Juli 2023», Kalenderschalter, dann die Optionsgruppe **«Vertragsdauer»**: «Unbefristet Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird., Optionsfeld, ausgewählt. Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird.» Die Erklärung steckt im Namen **und** in der Beschreibung, ich höre sie zweimal.
3. **Pfeil runter → «Befristet»:** «Befristet Der Mietvertrag endet an einem festen Tag, ohne Kündigung., Optionsfeld, ausgewählt» (wieder doppelt). Dass darunter ein neues Feld «Vertragsende» erscheint, wird nicht angesagt; es ist aber der nächste Tab-Halt, ich finde es sofort.
4. **Feld «Vertragsende»:** «Vertragsende, Eingabefeld, leer. Letzter Tag des Mietverhältnisses. Format TT.MM.JJJJ. Beispiel: 31.12.2026». **«31.07.2026» tippen:** beim letzten Zeichen einmal «Freitag, 31. Juli 2026» und «Der Mietvertrag endete am 31.07.2026. Das Vertragsende liegt in der Vergangenheit. Seit dem 01.08.2026 gilt die Wohnung als nicht vermietet … zählt nur bis zum Vertragsende.» Gleiches Verhalten wie im Dialog.
5. **Tab-Reihenfolge:** Vertragsende → Kalender → **Kästchen «Der Mietvertrag endete am 31.07.2026.»** → Nettomiete → Akonto → Zusatzmiete → Abbrechen → Änderungen speichern. Das Kästchen steht direkt nach dem Feld.
6. **«Änderungen speichern» ohne Kästchen:** Die Seite bleibt, nichts gespeichert. **Fokus springt vom Schalter zurück aufs Kästchen** (7 Felder weiter oben): «Der Mietvertrag endete am 31.07.2026., Kontrollkästchen, nicht aktiviert, ungültig. Das Vertragsende liegt in der Vergangenheit … Bitte bestätigen Sie, dass der Mietvertrag am 31.07.2026 endete, oder korrigieren Sie das Vertragsende.» Plus dieselbe Meldung über die Live-Region. Ich weiss sofort, wo ich bin und was zu tun ist. Es gibt keine Fehlerübersicht oben auf der Seite, bei einem einzigen Fehler brauche ich sie auch nicht.
7. **Leertaste:** «aktiviert», nicht mehr ungültig, Meldung weg. Tab ×5, Enter auf «Änderungen speichern».
8. **Gespeichert:** Assertiv «Mietvertrag - Marco Bernasconi - Dwello», Fokus auf der Überschrift «Mietvertrag von Marco Bernasconi, Ebene 1», Status **«Mietvertrag von Marco Bernasconi gespeichert»**. Das Vertragsende wird in der Meldung nicht genannt (im Dialog schon); unter «Vertragsdauer» steht «Beendet, Vertragsende 31.07.2026».
9. **Zurück auf «Unbefristet»:** Formular des beendeten Vertrags: beim Laden höflich «Samstag, 1. Juli 2023» **und** «Freitag, 31. Juli 2026». Kein Kästchen, weil das Vertragsende nicht geändert ist. Pfeil hoch auf «Unbefristet», das Feld «Vertragsende» verschwindet ohne Ansage. Speichern: Status «Mietvertrag von Marco Bernasconi gespeichert», «Laufend, Vertragsende Unbefristet». Dass ich einen beendeten Vertrag wieder laufen lasse und die Wohnung B2 damit wieder vermietet ist, sagt mir niemand; hier war es gewollt.

## Befunde

### Blocker

- Keine.

### Major

- Keine.

### Minor

- **Die Kästchen-Ansage sagt nicht, dass etwas zu tun ist (WCAG 3.3.2 Beschriftungen oder Anweisungen, 4.1.3 Statusmeldungen).** Was in I3 stumm war, wird jetzt angesagt, einmal und erst beim vollständigen Datum. Aber die Ansage beginnt mit «Der Mietvertrag endete am 31.08.2026.», klingt wie eine Erfolgsmeldung und enthält weder «Kontrollkästchen» noch «bestätigen». Wer mit Enter im Feld abschickt, läuft weiterhin in den Fehler; der ist danach gut lösbar. Darum von Major auf Minor.
  **Vorschlag:** Die Live-Region nicht den Inhalt des Kästchens spiegeln lassen, sondern eine kurze eigene Ansage: «Das Vertragsende liegt in der Vergangenheit. Bestätigen Sie es unten im Kontrollkästchen.» Die lange Hilfe bleibt am Kästchen (`aria-describedby`).
- **Fehler wird doppelt angesagt (WCAG 4.1.3, Best Practice).** Beim Absenden ohne Kästchen landet der Fokus mit Fehler in der Beschreibung auf dem Kästchen, und gleichzeitig fügt die höfliche Live-Region um das Kästchen dieselbe Meldung ein. **Vorschlag:** Die Fehlermeldung ausserhalb der Live-Region platzieren (der Fokuswechsel reicht) oder die Live-Region nur um die Kurzansage aus dem vorherigen Punkt legen.
- **Fehlermeldung kommt erst nach 37 Wörtern Hilfe, ohne `aria-errormessage` (WCAG 3.3.1 Fehlererkennung, geblieben, länger geworden).** Am Kästchen höre ich Name, Zustand, «ungültig», dann die ganze Hilfe (in I3 22 Wörter, jetzt 37), erst dann «Bitte bestätigen Sie …». **Vorschlag:** Fehler zuerst in `aria-describedby` (`…-error …-help`) oder über `aria-errormessage`; die Hilfe am Kästchen auf die zwei wichtigsten Sätze kürzen (Grund und «Die Nebenkosten dieser Zeit trägt der Vermieter.»).
- **Dialogbeschreibung beim Öffnen 63 Wörter (geblieben).** `aria-describedby` des Dialogs umfasst Feldhilfe und Fristhinweis; die Feldhilfe höre ich beim Tab ins Feld ein zweites Mal. **Vorschlag:** Dialogbeschreibung auf den Fristhinweis beschränken oder weglassen.
- **Fokus startet auf «Abbrechen», Schalter vor dem Feld (geblieben).** Zwei Tabs über «Mietvertrag beenden» bis ins einzige Feld. **Vorschlag:** Fokus beim Öffnen ins Feld «Vertragsende».
- **Assertiver Seitentitel nach dem Speichern (geblieben, WCAG 4.1.3).** Nach «Mietvertrag beenden» und «Änderungen speichern» kommt assertiv der Seitentitel, gleichzeitig mit Fokus auf der Überschrift und der höflichen Bestätigung. Je nach Screenreader verdrängt das die Bestätigung. **Vorschlag:** Bei Rückkehr nach einem Formular die Titelansage unterdrücken, wie in I2.
- **Ansagen beim Laden des Formulars «Bearbeiten» (neu beobachtet).** Ohne mein Zutun kommen der Wochentag des Vertragsbeginns (und bei einem befristeten Vertrag auch des Vertragsendes), «Es wird geprüft, welche Wohnungen frei sind …» und der Seitentitel fast gleichzeitig. **Vorschlag:** Die Wochentag-Regionen erst nach einer Eingabe befüllen (oder beim ersten Rendern leer lassen).
- **Kästchen-Ansage auch bei einem Datum vor dem Vertragsbeginn.** Bei 30.06.2025 höre ich die ganze Bestätigungs-Ansage («… über ein Jahr her …»), obwohl das Datum ohnehin ungültig ist; der eigentliche Fehler kommt erst beim Absenden. **Vorschlag:** Vor dem Vertragsbeginn sofort die Meldung «Das Vertragsende kann nicht vor dem Vertragsbeginn am 01.07.2025 liegen.» statt des Kästchens.
- **Optionsfelder «Unbefristet» und «Befristet» sagen die Erklärung doppelt (WCAG 4.1.2 Name, Rolle, Wert).** Die Erklärung steckt im zugänglichen Namen (ganzes `<label>`) und nochmals in `aria-describedby`. **Vorschlag:** Name nur «Unbefristet» bzw. «Befristet», Erklärung nur als Beschreibung.
- **Bestätigung nach «Bearbeiten» nennt das Vertragsende nicht.** Der Dialog sagt «Der Mietvertrag von Nina Brunner endete am 31.08.2026», das Formular nur «Mietvertrag von Marco Bernasconi gespeichert». Wer per Formular ein Vertragsende nachträgt, hört nicht, dass der Vertrag jetzt beendet ist. **Vorschlag:** Bei geändertem Vertragsende dieselbe Meldung wie im Dialog.
- **Beendeten Vertrag wieder auf «Unbefristet» stellen geht ohne Hinweis.** Die Wohnung gilt danach wieder als vermietet. Hier gewollt, aber für Sven nicht angekündigt. **Vorschlag:** Hilfe unter «Unbefristet» bei beendeten Verträgen: «Der Mietvertrag läuft dann wieder, die Wohnung gilt als vermietet.»
- **Detailseite: Fokus nach dem Seitenwechsel am Seitenanfang (geblieben).** 19 Tabs bis «Beenden» (mit Sprunglink 4); im Formular «Bearbeiten» 18 Tabs bis zum ersten Feld.
- **Listenlink nur mit Mieternamen (geblieben), dazu ein zusätzlicher Tab-Halt pro Zeile.** «Nina Brunner» ohne Wohnung und Status; neu folgt pro Zeile ein Link «Mietvertrag von Nina Brunner bearbeiten». Der ist gut benannt, verdoppelt aber die Tab-Halte in der Liste (11 Verträge = 22 Halte). **Vorschlag:** Wohnung und Status in den Namen des Zeilenlinks aufnehmen; ob der zweite Link nötig ist, prüfen.
- **Löschdialog: deaktivierter Schalter ohne eigenen Grund (geblieben).** «Mietvertrag löschen» ist nativ deaktiviert und nicht im Tab-Kreis. «Mietstage» wird jetzt erklärt («also die Tage, an denen er gilt»), das hilft.

## Was gut ist

- **Die Kästchen-Ansage kommt genau einmal**, erst wenn das Datum vollständig ist, nicht bei jedem Tastendruck. Teilweise getippte Daten bleiben still.
- **Die Beschriftung ist das getippte Datum** («Der Mietvertrag endete am 31.08.2026.»), die Statusmeldung nach dem Speichern verwendet dasselbe Datum. Das Rechnen zwischen 31.08. und 01.09. aus I3 fällt weg.
- **Ankreuzen löscht den Fehler sofort** (`aria-invalid` weg, Meldung weg). Minor aus I3 behoben.
- Die Hilfe am Kästchen beginnt mit dem Grund («Das Vertragsende liegt in der Vergangenheit.»), und bei einem Datum über ein Jahr zurück kommt «Prüfen Sie das Jahr.» Minor aus I3 behoben.
- Die Bestätigung gilt nur für das angesagte Datum: Ändere ich das Datum, ist das Kästchen wieder leer und trägt das neue Datum.
- Die Fehlermeldung nennt beide Auswege: bestätigen oder Vertragsende korrigieren.
- Im Formular «Bearbeiten» verhält sich alles wie im Dialog: Kästchen direkt nach dem Feld, Absenden ohne Bestätigung speichert nichts, Fokus springt aufs Kästchen, auch von «Änderungen speichern» aus sieben Felder zurück.
- Nach dem Speichern liegt der Fokus auf der Überschrift, es kommt eine Statusmeldung mit dem Namen.
- Heute braucht keine Bestätigung, gestern schon. Ein Datum vor dem Vertragsbeginn wird beim Absenden assertiv und klar abgewiesen.

## Vergleich zu I3

| Befund aus I3 | I4 |
|---|---|
| Major: Kästchen erscheint stumm | **Teilweise behoben:** Angesagt, einmal, mit Grund. Es fehlt die Aufforderung, das Kästchen anzukreuzen, und der erste Satz klingt wie eine Erfolgsmeldung. Jetzt Minor. |
| Minor: Kästchen bleibt nach dem Ankreuzen «ungültig» | **Behoben.** |
| Minor: Dialogbeschreibung 63 Wörter | Unverändert. |
| Minor: Fehler hinter der Hilfe, ohne `aria-errormessage` | Unverändert, **länger geworden** (Hilfe am Kästchen 37 statt 22 Wörter). |
| Minor: zwei Daten (31.08. und 01.09.) | **Behoben** in Beschriftung und Statusmeldung; 01.09. steht nur noch erklärend in der Hilfe. |
| Minor: Hilfe nennt den Grund nicht | **Behoben.** |
| Minor: assertiver Seitentitel | Unverändert. |
| Minor: Löschdialog, deaktivierter Schalter | Unverändert; «Mietstage» wird jetzt erklärt. |
| Minor: Fokus startet auf «Abbrechen» | Unverändert. |
| Minor: Detailseite, Fokus am Seitenanfang | Unverändert. |
| Minor: Listenlink nur mit Namen | Unverändert. |

**Schlechter geworden seit I3:**
- Die Hilfe am Kästchen ist von 22 auf 37 Wörter gewachsen; die Fehlermeldung steht dahinter und kommt entsprechend später.
- Die neue Live-Region um das Kästchen sagt beim Absenden ohne Bestätigung die Fehlermeldung zusätzlich zur Fokus-Ansage an (doppelt).
- Die neue Ansage beginnt mit «Der Mietvertrag endete am …», was ohne Kontext nach «schon gespeichert» klingt.
- Die Liste hat pro Zeile einen zweiten Link «… bearbeiten»; doppelt so viele Tab-Halte.
- Im Formular «Bearbeiten» (in I3 nicht getestet) kommen beim Laden Wochentag-Ansagen ohne Eingabe.

Insgesamt besser als I3: beide Wege (Dialog und Formular) sind ohne Blocker oder Major bedienbar, der Fehler ist auffindbar und verschwindet nach dem Ankreuzen.
