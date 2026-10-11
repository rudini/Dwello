<!-- Persona run follow-up F (fee always of the tenant's own costs) on 1625225; screenshots stayed in the session's scratchpad -->

# Persona-Test F: Sven, 45, blind (Screenreader, nur Tastatur)

Aufgabe: Im Assistenten «Abrechnungen erstellen» mit der Tastatur bis zur Vorschau gehen (Periode 2025, Gebäude «Seepark Residenz», keine Entwürfe erstellen), das Feld «Verwaltungspauschale» mit gültigen und ungültigen Werten prüfen und danach in einer bestehenden Seepark-Abrechnung die Zeile «Verwaltungspauschale» anhören.

Vorgehen: Chromium, Desktop, nur Tastatur. Was ein Screenreader ansagt, habe ich aus dem Accessibility-Tree und dem fokussierten Element (Rolle, Name, Beschreibung über `aria-describedby`, Zustand) abgeleitet. Screenshots liegen nur im Scratchpad der Sitzung (`personas-f/sven/*.png`).

## Aufgabe geschafft

**Teilweise.** Die Vorschau habe ich erreicht, und die bestehende Abrechnung liess sich gut vorlesen. Bei der Verwaltungspauschale bin ich aber ohne jede Warnung mit 25 % und 45 % bis zur Vorschau gekommen, obwohl ich «2,5» und «4,5» getippt hatte. Ein leeres Feld lässt sich gar nicht herstellen.

## Aufwand (Tastendrücke)

| Strecke | Tasten |
|---|---|
| Übersicht → «Abrechnungen erstellen» (Link) | 19 (18× Tab, Enter) |
| Schritt 1 → Schritt 4 Vorschau, ohne Sprunglink | 37 (Schritt 1: 23× Tab + Enter; Schritt 2: 3× Tab, Leertaste, 3× Tab, Enter; Schritt 3: 4× Tab, Enter) |
| Dasselbe mit «Zum Inhalt springen» | 23 |
| Vorschau → Liste «Abrechnungen von Seepark Residenz» | 6 |
| Liste → Abrechnung Thomas Weber 2025 öffnen (mit Sprunglink) | 19 |

Bei jedem Wechsel des Schritts muss ich mich wieder ganz nach vorne tabben, weil der Fokus richtig auf der Schritt-Überschrift landet. Das ist in Ordnung.

## Laut gedacht

1. **Übersicht.** «Als Nächstes zu tun … Noch nicht abgerechnet: Alpenblick.» Aha, Seepark ist also schon abgerechnet. Link «Abrechnungen erstellen», Enter.
2. **Schritt 1.** Der Seitentitel «Abrechnungen erstellen - Dwello» wird angesagt, der Fokus liegt auf dem Body. Mit dem Sprunglink lande ich auf dem Brotkrümel-Link. Danach «Beginn, Eingabe, Pflichtfeld, 01.01.2025, Format TT.MM.JJJJ. Beispiel: 31.12.2025, Mittwoch, 1. Januar 2025». Das ist sehr gut, der Wochentag bestätigt mir das Datum. «Ende» genauso. Mit «Weiter» geht es weiter.
3. **Schritt 2.** Der Fokus liegt auf «Überschrift Ebene 2, Schritt 2 von 5: Gebäude». Gut. Kontrollkästchen «Seepark Residenz Seeweg 15, 6003 Luzern 15 Rechnungen in der Abrechnungsperiode 4 Wohnungen, nicht aktiviert». Ich drücke die Leertaste, dann «Weiter». Ein Hinweis, dass Seepark für 2025 schon Abrechnungen hat, kommt hier nicht. Den höre ich erst in der Vorschau.
4. **Schritt 3.** Der Fokus liegt auf «Überschrift Ebene 2, Schritt 3 von 5: Heizprofil und Verwaltungspauschale». Gleichzeitig kommt die Statusmeldung «Entwurf gespeichert, 18:42». Moment: Entwurf? Ich sollte doch keine Entwürfe erstellen. Gemeint ist wohl der Zwischenstand des Assistenten.
   - Tab: «Heizprofil, Auswahlliste, Pflichtfeld, Heizung + Warmwasser (100%)». Danach liest der Screenreader eine Beschreibung von rund 110 Wörtern vor, über Zählerstände, Mieterwechsel, Heizkostenverteiler und Entwürfe löschen. Bis sie fertig ist, habe ich die Frage vergessen. Die Monatsanteile stehen nur als Liste im Text («Januar 13.6 %») und sind nicht mit der Auswahl verknüpft.
   - Tab: **«Verwaltungspauschale in %, Drehfeld, Pflichtfeld, 3»**, Beschreibung: «Prozentsatz der eigenen Nebenkosten jedes Mieters, gilt für alle Abrechnungen dieses Laufs. Üblich sind bis 3 %. Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist. Sonst geben Sie 0 ein. Haben Mietverträge verschiedene Sätze, erstellen Sie die Abrechnungen getrennt.»
     - Name, Rolle und Pflichtfeld werden sauber angesagt. Der Bezug «eigene Nebenkosten jedes Mieters» ist verständlich: Die Pauschale wird auf meinen Anteil gerechnet, nicht auf die Gebäudekosten. Das «%» im Namen hilft.
     - Ein Minimum, Maximum oder eine Schrittweite wird nicht angesagt (das Feld hat weder `min` noch `max` noch `step`).
5. **Ungültige Werte:**
   - **Leer:** Ich markiere mit Ctrl+A und drücke Backspace. Das Feld wird sofort zu **«0»**, ohne Ansage. Ein leeres Feld lässt sich nicht herstellen, also gibt es auch keine Fehlermeldung «Pflichtfeld». Wer das Feld leert, um neu zu tippen, hat unbemerkt 0 % stehen.
   - **Negativ, getippt:** Das «-» wird kommentarlos verschluckt. Aus «-1» wird «1», und das Feld gilt als gültig.
   - **Negativ mit Pfeil nach unten:** Von 0 aus ergibt das −1, −2, −3, und noch kommt kein Hinweis. Erst «Weiter» stoppt mich. Der Fokus springt zurück ins Feld, und ich höre «Verwaltungspauschale in %, Drehfeld, Pflichtfeld, **ungültig**, −3», dann die ganze lange Beschreibung und erst **am Schluss** «Bitte geben Sie einen Prozentsatz ab 0 ein, zum Beispiel 3.» Das funktioniert, aber die Fehlermeldung kommt nach rund 50 Wörtern Hilfetext. Gleichzeitig meldet der Status «Entwurf gespeichert», obwohl der Wert ungültig ist.
   - **«4,5» (Schweizer Dezimalkomma):** Das Komma wird verschluckt. Das Feld zeigt **«45»**.
   - **«4.5» und «3.5»:** Nach der «4» springt der Cursor offenbar an den Anfang, der Punkt wird verschluckt, die «5» landet vorne. Das Feld zeigt **«54»** bzw. **«53»**. Mit «2,5» entsteht «25». Nur wenn ich «25» tippe, einmal Pfeil nach links drücke und dann «.» tippe, entsteht 2.5. Darauf kommt niemand.
   - **Über 3 % (45, 53, 54):** Sichtbar erscheint unter dem Feld «Über dem üblichen Richtwert. Die Verwaltungspauschale ist höher als der übliche Richtwert von 3 %. Prüfen Sie, ob der Mehraufwand begründet ist.» Der **Screenreader sagt davon nichts**: Der Text steht weder in einer Live-Region noch in der Beschreibung des Felds. Ich würde ihn nur finden, wenn ich nach dem Feld weiterlese. «Weiter» lässt 45 % ohne Rückfrage durch.
6. **Schritt 4, Vorschau.** Der Fokus liegt auf «Schritt 4 von 5: Vorschau». Wenn ich vorher einmal «Zum Inhalt springen» benutzt habe (die Adresse endet dann auf `#main-content`), liegt er auf `main`. Dann liest der Screenreader wieder ab Brotkrümel, H1 und Einleitung. Ich höre «Anzahl Abrechnungen 0, Kosten aller Abrechnungen CHF 0.00 … Alle Mietverträge haben in dieser Periode schon eine Abrechnung». Das ist klar formuliert. **Die Vorschau nennt weder das Heizprofil noch die Verwaltungspauschale.** Ob ich gerade mit 3 % oder 45 % weitergehe, erfahre ich hier nicht mehr.
7. **Bestehende Abrechnung.** Über den Link «Abrechnungen von Seepark Residenz ansehen» komme ich in die Liste, der Fokus liegt auf dem Body. Die Statusfilter sagen «7 Entwurf, 9 Bezahlt», obwohl nach Seepark gefiltert ist und die Liste nur «7 Abrechnungen» hat, davon 4 Entwürfe. Ich öffne den Link «Thomas Weber NK-22222222-2025-0001». Die Tabelle «Abrechnungspositionen» hat saubere Spaltenköpfe («Hauswart, Pro Fläche (m²), CHF 3’060.00, 21.25 %, CHF 650.25»). Danach kommt eine Beschreibungsliste:
   - «Zwischensumme: CHF 2’296.54»
   - **«Verwaltungspauschale 3 % der Zwischensumme: CHF 68.90»**
   - «Gesamtkosten: CHF 2’365.44», «Geleistete Akontobeiträge: minus CHF 2’400.00», «Saldo: Rückerstattung: CHF 34.56»

   Das ist gut vorlesbar, und die Rechnung stimmt (3 % von 2’296.54 = 68.90). Bei Nina Brunner (184 Mietstage) heisst es ebenso «3 % der Zwischensumme: CHF 39.21», ebenso bei Thomas Weber 2024. Nur heisst die Bezugsgrösse im Assistenten «eigene Nebenkosten jedes Mieters» und hier «Zwischensumme». Dass beides dasselbe ist, muss ich selbst erschliessen.

## Was verwirrte

- **Major**: Die Warnung «Über dem üblichen Richtwert» wird nicht angesagt. Für mich gibt es sie nicht.
- **Major**: In der Vorschau fehlen Pauschale und Heizprofil. Was ich in Schritt 3 eingegeben habe, kann ich vor dem Erstellen nicht kontrollieren.
- **Minor**: «Entwurf gespeichert» im Assistenten, während «Entwurf» sonst die Abrechnungsentwürfe meint. Die Meldung kommt auch bei einem ungültigen Wert.
- **Minor**: «eigene Nebenkosten jedes Mieters» (Assistent) und «der Zwischensumme» (Abrechnung) sind zwei Wörter für dieselbe Grösse.
- **Minor**: Der Hilfetext zum Heizprofil (rund 110 Wörter) wird bei jedem Fokus komplett vorgelesen.
- **Minor**: In Schritt 2 fehlt der Hinweis, dass Seepark für 2025 schon Abrechnungen hat. Ich erfahre es erst in der Vorschau.
- **Minor**: Die Statuszahlen in der Abrechnungsliste ignorieren den Gebäudefilter.

## Fehlerrisiken

- **Blocker**: **Dezimalwerte werden verfälscht.** «2,5» wird zu 25, «4,5» zu 45, «4.5» zu 54. Für den Screenreader ändert sich nichts Hörbares, die Warnung über 3 % wird nicht angesagt, «Weiter» lässt es durch, und die Vorschau zeigt den Satz nicht. Ein blinder Verwalter erstellt so ohne jeden Hinweis Abrechnungen mit 10- bis 20-fach überhöhter Pauschale.
- **Major**: **Ein geleertes Feld wird stillschweigend zu 0.** Wer korrigieren will und dann abbricht oder falsch tippt, verlangt keine Pauschale, obwohl der Mietvertrag eine vorsieht. Die Pflichtfeld-Prüfung kann nie greifen.
- **Major**: **Das Minus wird beim Tippen verschluckt.** Aus «-1» wird 1, ohne Ansage. Mit den Pfeiltasten sind negative Werte möglich und werden erst bei «Weiter» abgefangen.
- **Minor**: Die Fehlermeldung bei negativem Wert steht in der Beschreibung hinter dem langen Hilfetext und wird erst nach rund 50 Wörtern vorgelesen.
- **Minor**: Nach Benutzung des Sprunglinks landet der Fokus in Schritt 4 auf `main` statt auf der Schritt-Überschrift.

## Vorschläge

- **Blocker**: Die Eingabe soll Komma und Punkt als Dezimaltrennzeichen annehmen und den Cursor nicht versetzen. Am einfachsten geht das als Textfeld mit `inputmode="decimal"`, das «2,5» als 2.5 liest. Was nicht als Zahl lesbar ist, wird als Fehler gemeldet statt still umgeschrieben.
- **Blocker**: Werte über 3 % bei «Weiter» mit einer bestätigungspflichtigen, angesagten Rückfrage stoppen, z. B. «Sie haben 45 % eingegeben. Üblich sind bis 3 %.» Die Warnung in `aria-describedby` aufnehmen und als `role="status"` ankündigen.
- **Major**: In der Vorschau Heizprofil und Verwaltungspauschale nennen, z. B. «Verwaltungspauschale: 3 % der eigenen Nebenkosten jedes Mieters».
- **Major**: Ein geleertes Feld leer lassen und bei «Weiter» die Pflichtfeld-Meldung zeigen, statt stillschweigend 0 einzusetzen. Das Minus nicht verschlucken, sondern den Wert als ungültig melden. `min="0"` setzen, damit der Pfeil nach unten bei 0 stoppt.
- **Minor**: Die Fehlermeldung in `aria-describedby` **vor** den Hilfetext stellen.
- **Minor**: Den Heizprofil-Hilfetext auf zwei Sätze kürzen und den Rest als Link oder ausklappbaren Abschnitt anbieten.
- **Minor**: In der Abrechnung dieselbe Bezugsgrösse wie im Assistenten verwenden, oder im Assistenten sagen: «… der eigenen Nebenkosten (Zwischensumme) jedes Mieters».
- **Minor**: Die Statusmeldung im Assistenten anders formulieren («Eingaben gespeichert») und nur gültige Eingaben speichern.
- **Minor**: In Schritt 2 beim Gebäude ansagen, wenn die Periode bereits abgerechnet ist.
- **Minor**: In Schritt 4 auch nach dem Sprunglink auf die Schritt-Überschrift fokussieren.
