# Sven – #654: Kalender-Knopf, Optionen mit Erklärung, Fehler an der Checkbox

Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Baum (Chromium headless, Persona-Stack :3300, Demodaten). Nichts gespeichert, nichts gelöscht: Im Löschdialog habe ich jede Schreib-Anfrage (alles ausser GET) vorsorglich abgefangen; es ging keine einzige hinaus.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag → «Löschen» → Dialog «Mietvertrag löschen?» | Nach dem ersten Fehler setze ich das Häkchen und nehme es wieder weg. Danach drücke ich «Mietvertrag löschen» wieder ohne Häkchen: Es passiert nichts. Keine Fehlermeldung, kein «ungültig», der Fokus bleibt auf dem Knopf. Ich höre also gar nichts und weiss nicht, warum nicht gelöscht wird. Der Fehler kommt erst wieder, wenn ich den Dialog schliesse und neu öffne. |

## Beobachtungen

**1. Datumsfeld mit Kalender (Neue Rechnung, Rechnungsdatum)**
- Der Knopf hat einen Namen: «Kalender für Rechnungsdatum öffnen» (dasselbe bei «… für Beginn öffnen», «… für Ende öffnen» und beim Tankbestand des Gebäudes «Kalender für Stichtag öffnen»). In der Tab-Reihenfolge kommt er direkt nach dem Textfeld.
- Das versteckte Datumsfeld hinter dem Knopf ist `aria-hidden` und hat `tabindex=-1`. Ich stolpere also nicht über ein zweites, namenloses Feld.
- Enter und Leertaste auf dem Knopf öffnen den Datumswähler des Browsers (`showPicker` wird aufgerufen, ohne Fehler). Headless zeichnet den Wähler nicht, aber er nimmt die Tasten an. Mit den Pfeiltasten wandert das Datum: Pfeil rechts ergibt 29.10.2026, Pfeil runter springt eine Woche weiter. Das Textfeld übernimmt jeden Schritt sofort. Die Zeile darunter («Donnerstag, 1. Januar 2026») ist eine höfliche Live-Region und steht in der Beschreibung des Feldes. Den gewählten Tag höre ich also als Wochentag und Datum ausgeschrieben, das ist gut.
- Enter übernimmt den Tag und schliesst den Wähler. Escape nach einer Änderung setzt zuerst auf das alte Datum zurück, ein zweites Escape schliesst. Ohne Änderung schliesst ein Escape. Tab bleibt im offenen Wähler (dort sind wohl Monat und Jahr).
- `document.activeElement` bleibt die ganze Zeit der Kalender-Knopf. Nach dem Schliessen bringt mich Shift+Tab zum Feld zurück, und das Feld nennt das neue Datum samt Wochentag. Der Wähler öffnet beim Datum, das im Feld steht: Nach 31.12.2025 und einmal Pfeil rechts stand 01.01.2026 im Feld.
- Tippen geht ohne den Wähler. «5.4.2026» wird beim Verlassen zu 05.04.2026, «15.3.26» zu 15.03.2026, «15032026» zu 15.03.2026. «31.02.2026» ergibt `invalid=true` mit der Beschreibung «Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein …». Auch «abc» meldet einen Fehler. Die Fehlermeldung steht zusätzlich in einer assertiven Live-Region, ich höre sie also, obwohl der Fokus schon beim Kalender-Knopf ist.
- Wer «2026-03-15» tippt, sieht während des Tippens automatisch eingefügte Punkte. Daraus wurde «20.26.-03-15», mit der Meldung «Bitte geben Sie das Datum in Ziffern als TT.MM.JJJJ ein». Die Meldung ist richtig, die Punkte, die Dwello mitten ins Getippte setzt, verwirren aber beim Mithören.
- Die Hilfe des Rechnungsdatums ist lang. Sie wird bei jedem Fokus auf dem Feld ganz vorgelesen, zusammen mit dem Wochentag.
- Nach dem Seitenwechsel (Enter auf «Rechnung erfassen», «Kategorie erfassen») liegt der Fokus auf `body`. Der erste Tab landet bei «Zum Inhalt springen». Das ist bekannt und störte nicht.

**2. Neue Kategorie, Umlagefähige Nebenkosten**
- Die Gruppe heisst «Umlagefähige Nebenkosten» (radiogroup). Ihre lange Rechtserklärung (Art. 257a–257b OR …) ist die Beschreibung der Gruppe, nicht die einer Option.
- Jede Option nennt ihren Namen einmal und ihre Erklärung einmal: radio «Umlagefähig», Beschreibung «Die Kosten fliessen in die Nebenkostenabrechnung.»; radio «Nicht umlagefähig», Beschreibung «Die Kosten trägt der Vermieter.». Der Name kommt über `aria-labelledby` nur aus dem Wort selbst, nichts doppelt.
- Am Anfang ist keine Option gewählt. Tab landet auf der ersten Option, die Leertaste wählt sie, die Pfeiltasten wechseln und wählen. Tab verlässt die Gruppe zu «Von der KI prüfen lassen».
- Der Knopf auf der Liste heisst «Kategorie erfassen», die Seite danach «Neue Kategorie». Ich habe ihn trotzdem gefunden.

**3. Löschdialog**
- Kein laufender Mietvertrag der Demodaten bietet die Checkbox an. Bei allen 9 laufenden Verträgen sagt der Dialog «Dieser Mietvertrag kann nicht gelöscht werden. Seine Mietstage sind abgerechnet in: …», und «Mietvertrag löschen» ist deaktiviert. Ich habe deshalb den beendeten Vertrag von Kevin Fischer (01.06.2018 – 28.02.2021) genommen, den einzigen mit Checkbox.
- Der Dialog ist modal, sein Name ist «Mietvertrag löschen?», und sein ganzer Text ist als Beschreibung verbunden. Der Fokus startet auf «Abbrechen», das ist sicher. Tab kreist im Dialog: Abbrechen → Mietvertrag löschen → Checkbox → Abbrechen.
- Der erste Druck auf «Mietvertrag löschen» ohne Häkchen setzt den Fokus auf die Checkbox, mit `invalid=true` und der Beschreibung «Bitte bestätigen Sie, dass dieser Mietvertrag irrtümlich erfasst wurde, oder brechen Sie ab. Seine Mietstage zählen danach …». Das ist gut: Ich höre die Meldung sofort am richtigen Ort.
- Setze ich das Häkchen, verschwindet die Meldung, und die Checkbox ist nicht mehr ungültig (`invalid=false`, die Beschreibung ist nur noch die Hilfe). Das ist so, wie es sein soll.
- Nehme ich das Häkchen wieder weg, kommt die Meldung nicht von selbst zurück. Das fände ich in Ordnung. Aber auch der nächste Druck auf Löschen zeigt sie nicht, siehe P-1.
- «Abbrechen» schliesst den Dialog, der Fokus kehrt auf «Löschen» zurück. Escape tut dasselbe.
- In den Dialogen der laufenden Verträge ist «Mietvertrag löschen» deaktiviert und darum nicht per Tab erreichbar. Der Grund steht im Dialogtext, und der wird als Beschreibung vorgelesen.

## Aufgabe geschafft: teilweise

Teil 1 und Teil 2 sind ganz geprüft. Teil 3 habe ich an einem beendeten statt an einem laufenden Vertrag geprüft, und die erneute Fehlermeldung bleibt aus (P-1).

## Aufwand

Etwa 40 Minuten, rund 25 Skripte mit je 5 bis 40 Tastendrücken. Ein Mensch mit Screenreader bräuchte für Teil 3 rund 15 Tastendrücke.

## Ablauf

- Mietverträge → «Nina Brunner» (laufend) → «Löschen». Erwartet: ein Dialog mit Checkbox. Gesehen: «kann nicht gelöscht werden», kein Häkchen, der Löschknopf deaktiviert. So war es bei allen laufenden Verträgen, deshalb habe ich den beendeten Vertrag von Kevin Fischer genommen.
- Kalender-Knopf → Enter. Erwartet: der Fokus geht in einen Wähler im Accessibility-Baum. Gesehen: Im Seitenbaum gibt es keinen Wähler, der Fokus bleibt auf dem Knopf, aber die Pfeiltasten ändern das Datum im Feld (Wähler des Browsers, headless unsichtbar).
- Escape im Wähler nach einer Änderung. Erwartet: der Wähler schliesst. Gesehen: Das Datum springt zurück, der Wähler bleibt offen, und erst das zweite Escape schliesst ihn.
- «2026-03-15» ins Rechnungsdatum getippt. Erwartet: Das Getippte bleibt stehen, dann folgt eine Fehlermeldung. Gesehen: «20.26.-03-15», Dwello hat beim Tippen Punkte eingefügt.
- Löschdialog: Fehler, Häkchen setzen, Häkchen weg, dann «Mietvertrag löschen». Erwartet: Die Fehlermeldung kommt wieder, der Fokus geht auf die Checkbox. Gesehen: Es passiert nichts, auch nicht beim zweiten und dritten Druck (P-1).

## Vorschläge

**P-1**
1. Mietvertrag von Kevin Fischer (beendet, `/contracts/b0000001-0001-0001-0001-000000000099`) öffnen und «Löschen» drücken.
2. Tab bis «Mietvertrag löschen», Enter. Die Fehlermeldung erscheint, der Fokus liegt auf der Checkbox.
3. Leertaste (Häkchen), Leertaste (Häkchen weg).
4. Shift+Tab auf «Mietvertrag löschen», Enter. Es gibt keine Meldung, kein «ungültig», der Fokus bleibt auf dem Knopf, und es geht keine Anfrage hinaus.

Was helfen würde: Jeder Druck auf «Mietvertrag löschen» ohne Häkchen sollte dasselbe tun wie der erste, also die Meldung zeigen, die Checkbox ungültig setzen und den Fokus auf sie legen, egal ob die Meldung vorher schon einmal da war.

## Nicht geprüft

- **Was ein Screenreader im Datumswähler des Browsers ansagt** (Monat, Wochentag, «ausgewählt»): Headless Chromium zeichnet den Wähler nicht, und sein Inhalt steht nicht im Accessibility-Baum der Seite. Prüfen konnte ich nur, was die Tasten im Feld bewirken. Ob NVDA oder VoiceOver den Fokus im Wähler mitbekommen, lässt sich so nicht beurteilen.
- **Die Checkbox an einem laufenden Mietvertrag:** Alle laufenden Verträge der Demodaten sind in Abrechnungen enthalten und darum nicht löschbar. Versucht habe ich alle 9 laufenden Verträge.
- **Die Kalender bei Beginn und Ende sowie beim Tankbestand:** Ihre Namen habe ich geprüft, die Bedienung nur beim Rechnungsdatum. Gespeichert habe ich nichts, wie verlangt.
