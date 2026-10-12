<!-- Persona run I5 on fa6f5df; screenshots stayed in the session's scratchpad -->

# Persona-Test I5: Sven, 45, blind, Screenreader und Tastatur (Vertragsende in der Vergangenheit, Dialog und «Bearbeiten»)

Datum des Laufs: Montag, 12.10.2026. Desktop, nur Tastatur (Tab, Shift+Tab, Pfeiltasten, Leertaste, Enter, Pos1, Entf, Ctrl+A, Tippen), Seite gelesen über den Accessibility-Tree (Rolle, Name, Beschreibung über `aria-describedby`, `aria-invalid`, `aria-errormessage`, `document.activeElement`) und einen MutationObserver auf allen Live-Regionen (`aria-live`, `role="status"`, `role="alert"`), der ab dem Laden jeder Seite mitläuft. Kein echter Screenreader; was «angesagt» wird, leite ich aus Fokus, Beschreibung und Live-Regionen ab. Wo eine Live-Region kein `aria-atomic` hat, nehme ich an, dass ein Screenreader nur den neu eingefügten Text vorliest.

Gewählte Mietverträge (Demodaten frisch, alle in der Seepark Residenz):
- Aufgabe 1: **Nina Brunner, Wohnung A2** (laufend seit 01.07.2025, unbefristet).
- Aufgabe 2: **Marco Bernasconi, Wohnung B2** (laufend seit 01.07.2023, unbefristet).
- Nur geöffnet und mit Escape abgebrochen, nichts gespeichert: Dialog «Beenden» bei **Thomas Weber, Wohnung A1** (Prüfung der Fehlermeldung «vor dem Vertragsbeginn»).

**Geänderte Daten:** Nina Brunner, Wohnung A2: Vertragsende 31.08.2026 (bleibt so, beendet). Marco Bernasconi, Wohnung B2: zwischenzeitlich befristet bis 31.07.2026, danach wieder unbefristet gespeichert (Endzustand wie vorher: «Laufend seit 01.07.2023, unbefristet»). Sonst nichts.

## Aufgabe geschafft: **ja**

1. **Vertragsende 31.08.2026 nachgetragen:** ja. Detailseite: «Vertragsdauer: Beendet, Vertragsbeginn 01.07.2025, Vertragsende 31.08.2026», der Schalter «Beenden» ist weg. Liste: «Wohnung A2 · Seepark Residenz Beendet 01.07.2025 – 31.08.2026».
2. **«Bearbeiten» mit vergangenem Vertragsende:** ja. Befristet, 31.07.2026, ohne Kästchen gespeichert (abgewiesen, Fokus aufs Kästchen), angekreuzt, gespeichert: «Beendet, Vertragsende 31.07.2026». Danach wieder «Unbefristet» gespeichert: «Laufend, Vertragsende Unbefristet».
3. Im Dialog geprüft und abgebrochen: 31.08.2026 → 30.08.2026, Datum ändern bei angekreuztem Kästchen, Datum vor dem Vertragsbeginn, heute, gestern, ein Jahr zurück.

## Aufwand (Tastendrücke)

| Schritt | Tasten |
|---|---|
| Liste «Mietverträge»: Sprunglink (Tab, Enter), Tab ×6 zu «Nina Brunner», Enter | 9 |
| Detailseite → «Beenden» mit Sprunglink (Tab, Enter, Tab ×3, Enter); ohne Sprunglink Tab ×19, Enter | 6 (20) |
| Dialog: Tab ×2 ins Feld, «31.08.2026» tippen, Enter (Fehler: Kästchen nicht bestätigt) | 13 |
| Leertaste, Tab ×2 zu «Mietvertrag beenden», Enter | 4 |
| **Total Aufgabe 1 mit einem Fehlversuch** | **32** (ohne Sprunglink 46) |
| Kürzester Weg im Dialog ohne Fehlversuch (Tab ×2, Datum, Tab ×2, Leertaste, Tab ×2, Enter) | 18 |
| Detailseite → «Bearbeiten» (Sprunglink, Tab ×2, Enter) | 4 |
| Formular: Sprunglink, Tab ×7 zur Vertragsdauer, Pfeil runter, Tab, Datum, Tab ×7 zu «Änderungen speichern», Enter (Fehler) | 29 |
| Leertaste, Tab ×5, Enter | 7 |
| **Total Aufgabe 2 mit einem Fehlversuch** | **40** |
| Zurück auf «Unbefristet» (Sprunglink, Tab ×7, Pfeil hoch, Tab ×5, Enter) | 16 |

Gleich wie in I4. (Den «kürzesten Weg» hatte ich in I4 mit 16 zu knapp gezählt; vom Kästchen sind es zwei Tabs bis «Mietvertrag beenden».)

## Ablauf (was angesagt wurde)

### Aufgabe 1: Dialog «Beenden»

1. **Liste → Detailseite:** Assertiv «Mietverträge - Dwello», dann «Mietvertrag - Nina Brunner - Dwello». Fokus am Seitenanfang (Dokument). «Vertragsdauer: Laufend, Vertragsende: Unbefristet».
2. **Dialog öffnen:** «Mietvertrag beenden?, Dialog», Beschreibung wie in I4 der ganze Dialoginhalt (**63 Wörter**: Feldhilfe plus Fristhinweis). Fokus auf **«Abbrechen, Schalter»**, Tab-Reihenfolge Abbrechen → Mietvertrag beenden → Vertragsende → Kalender → Abbrechen.
3. **Feld:** «Vertragsende, Eingabefeld, leer. Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht. Format TT.MM.JJJJ. Beispiel: 31.12.2026» (26 Wörter). Der neue Satz «also der Kündigungstermin … auch wenn der Mieter früher auszieht» beantwortet genau meine Frage: Auszug Ende August, Kündigung auf den 31.08. → ich trage 31.08.2026 ein.
4. **«31.08.2026» tippen:** Neun Zeichen lang still. **Beim letzten Zeichen genau einmal** zwei höfliche Ansagen:
   - «Montag, 31. August 2026»,
   - **«Das Vertragsende liegt in der Vergangenheit. Bestätigen Sie das Vertragsende mit dem Kästchen.»** (14 Wörter, statt 42 in I4).
   Das ist die neue Kurzansage. Sie sagt, warum und was zu tun ist; der irreführende Satz «Der Mietvertrag endete am …» kommt nicht mehr über die Live-Region.
5. **Tab-Reihenfolge:** Vertragsende → Kalender → **«Der Mietvertrag endete am 31.08.2026., Kontrollkästchen, nicht aktiviert. Seit dem 01.09.2026 gilt die Wohnung als nicht vermietet, wenn kein neuer Mietvertrag begonnen hat. Die Nebenkosten dieser Zeit trägt der Vermieter, das Akonto des Mieters zählt nur bis zum Vertragsende.»** (Hilfe 31 Wörter, in I4 37) → Abbrechen → Mietvertrag beenden.
6. **31.08.2026 → 30.08.2026** (Pos1, Pfeil rechts, Entf, «0»): Nach Entf steht «3.08.2026» im Feld, und die Wochentag-Region sagt **«Montag, 3. August 2026»**, ein Zwischenstand, den ich nie wollte. Nach der «0» «Sonntag, 30. August 2026». **Die Kurzansage wiederholt sich nicht** (ihr Text bleibt gleich). Das Kästchen heisst jetzt «Der Mietvertrag endete am 30.08.2026.», die Hilfe «Seit dem 31.08.2026 …». Richtig, und angenehm leise.
7. **Enter im Feld, ohne Kästchen:** Nichts gespeichert, Dialog bleibt offen, Fokus springt aufs Kästchen: «Der Mietvertrag endete am 30.08.2026., Kontrollkästchen, nicht aktiviert, ungültig. Seit dem 31.08.2026 … (31 Wörter Hilfe) … **Bitte bestätigen Sie, dass der Mietvertrag am 30.08.2026 endete, oder korrigieren Sie das Vertragsende.**» **Keine Live-Region meldet sich dazu.** Der Fehler kommt **nur einmal**, über den Fokus. Ein zweites Enter (aus dem Feld) verhält sich gleich, wieder ohne Doppelansage.
8. **Leertaste:** «aktiviert», `aria-invalid` weg, Fehlermeldung weg.
9. **Vor dem Vertragsbeginn (30.06.2025, Beginn 01.07.2025):** Beim Tippen nur «Montag, 30. Juni 2025». **Kein Kästchen, keine Kurzansage**, die Live-Region der Kurzansage ist leer. Enter: assertiv «Das Vertragsende kann nicht vor dem Vertragsbeginn am 01.07.2025 liegen.», Fokus bleibt im Feld, «ungültig», Fehler in der Beschreibung. Sichtbar steht die Meldung rot unter dem Feld.
   **Danach ein gültiges Datum getippt:** Das Feld ist nicht mehr ungültig, die sichtbare Meldung verschwindet. **Aber die versteckte assertive Region behält den Text «Das Vertragsende kann nicht vor dem Vertragsbeginn … liegen.»** Lese ich den Dialog im Lesemodus durch, höre ich den alten Fehler unter dem neuen Datum (auch bei Thomas Weber nachgeprüft).
10. **Heute (12.10.2026):** nur «Montag, 12. Oktober 2026», kein Kästchen. **Gestern (11.10.2026):** Wochentag plus Kurzansage. **31.08.2025:** «Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr. Bestätigen Sie das Vertragsende mit dem Kästchen.» Gut.
11. **Kästchen angekreuzt, dann Datum geändert (31.08. → 30.08.):** Das Kästchen ist danach wieder **nicht aktiviert**, richtig so. **Angesagt wird nur der neue Wochentag**; dass meine Bestätigung zurückgesetzt wurde, erfahre ich erst beim Absenden (dann Fehler, Fokus aufs Kästchen). In I4 kam hier noch der ganze neue Kästchentext.
12. **Speichern (Sprunglink-Weg, Tab ×2 vom Kästchen, Enter auf «Mietvertrag beenden»):** Dialog schliesst. **Kein assertiver Seitentitel mehr**, nur höflich (Status) **«Der Mietvertrag von Nina Brunner endete am 31.08.2026»**. Der Fokus lag danach aber **auf dem Hauptbereich (`main`), nicht auf der Überschrift** wie in I4. Vermutlich, weil die Adresse seit dem Sprunglink auf `#main-content` endet; mit dem Weg über 19 Tabs konnte ich es nicht mehr nachprüfen, ohne einen weiteren Vertrag zu beenden.

### Aufgabe 2: «Bearbeiten»

1. **Detailseite → «Bearbeiten»:** Assertiv nur noch die Seitentitel («Mietvertrag - Marco Bernasconi - Dwello», dann «Mietvertrag bearbeiten - Dwello»). **Kein Wochentag und kein «Es wird geprüft, welche Wohnungen frei sind …» mehr beim Laden** (Minor aus I4 behoben). Fokus am Seitenanfang; mit Sprunglink 7 Tabs bis zur Vertragsdauer.
2. **Optionsgruppe «Vertragsdauer»:** «Unbefristet Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird., Optionsfeld, ausgewählt. Der Mietvertrag hat kein Vertragsende …» Die Erklärung kommt weiterhin doppelt (Name und Beschreibung).
3. **Pfeil runter → «Befristet»**, Tab ins neue Feld «Vertragsende, Eingabefeld, leer. Letzter Tag des Mietverhältnisses. Format TT.MM.JJJJ. Beispiel: 31.12.2026». (Kürzer als im Dialog; der Hinweis «auch wenn der Mieter früher auszieht» fehlt hier.)
4. **«31.07.2026» tippen:** beim letzten Zeichen einmal «Freitag, 31. Juli 2026» und **«Das Vertragsende liegt in der Vergangenheit. Bestätigen Sie das Vertragsende mit dem Kästchen.»** **Ja, die Kurzansage kommt auch im Formular**, gleich wie im Dialog.
5. **Tab-Reihenfolge:** Vertragsende → Kalender → Kästchen «Der Mietvertrag endete am 31.07.2026.» → Nettomiete → Akonto → Zusatzmiete → Abbrechen → Änderungen speichern.
6. **«Änderungen speichern» ohne Kästchen:** Nichts gespeichert. Fokus springt sieben Halte zurück aufs Kästchen: «… nicht aktiviert, ungültig. Seit dem 01.08.2026 … Bitte bestätigen Sie, dass der Mietvertrag am 31.07.2026 endete, oder korrigieren Sie das Vertragsende.» **Einmal, ohne zusätzliche Live-Ansage.**
7. **Leertaste, Tab ×5, Enter:** Assertiv «Mietvertrag - Marco Bernasconi - Dwello», Fokus auf **«Mietvertrag von Marco Bernasconi, Überschrift Ebene 1»**, Status «Mietvertrag von Marco Bernasconi gespeichert». Das Vertragsende nennt die Meldung nicht; «Vertragsdauer: Beendet, Vertragsende 31.07.2026».
8. **Zurück auf «Unbefristet»:** Beim Laden des Formulars wieder keine Wochentag-Ansagen. Kein Kästchen (Vertragsende unverändert). Pfeil hoch auf «Unbefristet», das Feld verschwindet ohne Ansage, nächster Tab-Halt ist «Nettomiete». Speichern: assertiver Titel, Fokus auf Überschrift, «Mietvertrag von Marco Bernasconi gespeichert», «Laufend, Vertragsende Unbefristet». Ein Hinweis, dass der beendete Vertrag jetzt wieder läuft, kommt weiterhin nicht.

## Befunde

### Blocker

- Keine.

### Major

- Keine.

### Minor

- **Veralteter Fehler in der versteckten assertiven Region (WCAG 3.3.1 Fehlererkennung, 4.1.3 Statusmeldungen; neu beobachtet).** Nach «Das Vertragsende kann nicht vor dem Vertragsbeginn am … liegen.» und einer Korrektur ist das Feld gültig und die sichtbare Meldung weg, der Text bleibt aber in der `sr-only`-Region mit `aria-live="assertive"` stehen. Im Lesemodus höre ich einen Fehler, den es nicht mehr gibt. **Vorschlag:** Die assertive Region leeren, sobald der Fehler verschwindet (gleiche Bedingung wie für `aria-invalid`).
- **Zurückgesetzte Bestätigung wird nicht gesagt (WCAG 4.1.3; schlechter als I4).** Kästchen angekreuzt, dann Datum geändert: Das Kästchen ist zu Recht wieder leer, angesagt wird aber nur der Wochentag, weil die Kurzansage denselben Text hat und deshalb schweigt. **Vorschlag:** Nur wenn das Kästchen angekreuzt war und durch die Datumsänderung zurückgesetzt wird, die Kurzansage erneut setzen, z. B. «Das Vertragsende hat sich geändert. Bestätigen Sie es erneut mit dem Kästchen.»
- **Fehlermeldung am Kästchen erst nach 31 Wörtern Hilfe, ohne `aria-errormessage` (WCAG 3.3.1; geblieben, kürzer geworden).** **Vorschlag:** Fehler zuerst in `aria-describedby` (`…-error …-help`) oder `aria-errormessage` setzen.
- **Fokus nach «Mietvertrag beenden» auf dem Hauptbereich statt auf der Überschrift (WCAG 2.4.3 Fokusreihenfolge; neu, Ursache unsicher).** Beobachtet, nachdem ich auf der Detailseite den Sprunglink benutzt hatte (Adresse `…#main-content`). Je nach Screenreader liest er beim Fokus auf `main` den ganzen Inhalt oder nur «Hauptbereich». Im Formular «Bearbeiten» landet der Fokus korrekt auf der Überschrift. **Vorschlag:** Nach dem Schliessen des Dialogs den Fokus ausdrücklich auf die Überschrift setzen, unabhängig vom Anker in der Adresse.
- **Wochentag-Ansage für Zwischenstände beim Korrigieren (Best Practice, neu beobachtet).** Wer «31» zu «30» korrigiert, hört «Montag, 3. August 2026», weil «3.08.2026» als gültiges Datum gilt. **Vorschlag:** Den Wochentag erst bei zweistelligem Tag und Monat (Format TT.MM.JJJJ vollständig) ansagen.
- **Dialogbeschreibung beim Öffnen 63 Wörter (geblieben).** **Vorschlag:** Dialogbeschreibung auf den Fristhinweis beschränken; die Feldhilfe höre ich beim Tab ins Feld ohnehin.
- **Fokus startet im Dialog auf «Abbrechen», Schalter vor dem Feld (geblieben).** **Vorschlag:** Fokus beim Öffnen ins Feld «Vertragsende».
- **Assertiver Seitentitel nach «Änderungen speichern» (geblieben, WCAG 4.1.3).** Im Dialogweg ist er weg, im Formularweg nicht. **Vorschlag:** Bei Rückkehr nach einem Formular die Titelansage unterdrücken.
- **Optionsfelder «Unbefristet» und «Befristet» sagen die Erklärung doppelt (WCAG 4.1.2; geblieben).** **Vorschlag:** Name nur «Unbefristet» bzw. «Befristet», Erklärung nur als Beschreibung.
- **Bestätigung nach «Bearbeiten» nennt das Vertragsende nicht (geblieben).** **Vorschlag:** Bei geändertem Vertragsende «Der Mietvertrag von Marco Bernasconi endete am 31.07.2026» wie im Dialog.
- **Feldhilfe «Vertragsende» im Formular kürzer als im Dialog (Konsistenz, WCAG 3.2.4).** Der hilfreiche Satz «Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht.» fehlt im Formular. **Vorschlag:** Dieselbe Hilfe an beiden Orten.
- **Beendeten Vertrag wieder auf «Unbefristet» stellen geht ohne Hinweis (geblieben).** **Vorschlag:** Hilfe unter «Unbefristet» bei beendeten Verträgen: «Der Mietvertrag läuft dann wieder, die Wohnung gilt als vermietet.»
- **Detailseite und Formular: Fokus nach dem Seitenwechsel am Seitenanfang (geblieben).** 19 Tabs bis «Beenden» (mit Sprunglink 4).
- **Listenlink nur mit Mieternamen, zweiter Link pro Zeile (geblieben).** «Nina Brunner» ohne Wohnung und Status; je Zeile zusätzlich «Mietvertrag von … bearbeiten» (11 Verträge = 22 Halte). **Vorschlag:** Wohnung und Status in den Namen des Zeilenlinks.

## Was gut ist

- **Die neue Kurzansage** «Das Vertragsende liegt in der Vergangenheit. Bestätigen Sie das Vertragsende mit dem Kästchen.» kommt einmal, erst beim vollständigen Datum, im Dialog und im Formular. Sie sagt Grund und Handlung in 14 Wörtern. Der Minor aus I4 (Ansage klingt nach Erfolg, keine Aufforderung) ist behoben.
- **Keine Wiederholung** beim Wechsel von 31.08. auf 30.08.; die Ansage bleibt bei einem anderen Datum in der Vergangenheit still.
- **Der Kästchenfehler kommt nur einmal**, über den Fokus; die Live-Region verdoppelt ihn nicht mehr.
- **Datum vor dem Vertragsbeginn:** kein Kästchen, keine Bestätigungsansage; beim Absenden die klare assertive Meldung mit dem Vertragsbeginn.
- Die Hilfe am Kästchen ist kürzer (31 statt 37 Wörter) und beginnt mit der Folge für die Wohnung.
- Beim Öffnen von «Bearbeiten» keine Ansagen ohne Zutun mehr (kein Wochentag, kein «Es wird geprüft …»).
- Nach «Mietvertrag beenden» kein assertiver Seitentitel mehr, nur die Statusmeldung mit Namen und Datum.
- Die Feldhilfe im Dialog erklärt jetzt, dass das Vertragsende der Kündigungstermin ist, auch bei früherem Auszug. Für diese Aufgabe genau die richtige Information.
- Weiterhin gut: Heute ohne, gestern mit Bestätigung; «Prüfen Sie das Jahr.» bei über einem Jahr; Ankreuzen löscht den Fehler sofort; die Bestätigung gilt nur für das angezeigte Datum.

## Vergleich zu I4

| Befund aus I4 | I5 |
|---|---|
| Minor: Kästchen-Ansage sagt nicht, dass etwas zu tun ist | **Behoben** (Kurzansage mit Aufforderung). |
| Minor: Fehler doppelt angesagt (Fokus und Live-Region) | **Behoben.** |
| Minor: Fehler nach 37 Wörtern Hilfe, ohne `aria-errormessage` | Teilweise: Hilfe 31 Wörter, `aria-errormessage` fehlt weiterhin. |
| Minor: Dialogbeschreibung 63 Wörter | Unverändert. |
| Minor: Fokus startet auf «Abbrechen» | Unverändert. |
| Minor: assertiver Seitentitel nach dem Speichern | **Im Dialog behoben**, nach «Änderungen speichern» unverändert. |
| Minor: Ansagen beim Laden von «Bearbeiten» | **Behoben.** |
| Minor: Kästchen-Ansage bei Datum vor Vertragsbeginn | **Behoben.** |
| Minor: Optionsfelder doppelt | Unverändert. |
| Minor: Bestätigung nach «Bearbeiten» ohne Vertragsende | Unverändert. |
| Minor: «Unbefristet» ohne Hinweis | Unverändert. |
| Minor: Detailseite, Fokus am Seitenanfang | Unverändert. |
| Minor: Listenlink nur mit Namen, zweiter Link | Unverändert. |
| Minor: Löschdialog, deaktivierter Schalter | In I5 nicht geprüft. |

**Schlechter geworden seit I4:**
- Ein angekreuztes Kästchen, das durch eine Datumsänderung zurückgesetzt wird, wird nicht mehr angesagt (in I4 kam der neue Kästchentext über die Live-Region). Die Kehrseite der gewollten Ruhe; der Fehler beim Absenden fängt es auf.
- Nach «Mietvertrag beenden» lag der Fokus auf dem Hauptbereich statt auf der Überschrift (beobachtet nach Sprunglink-Benutzung; Ursache nicht gesichert).
- Neu beobachtet, wahrscheinlich nicht neu: veralteter Fehlertext in der versteckten assertiven Region und Wochentag-Ansage für Zwischenstände beim Korrigieren.

Insgesamt besser als I4: Die Hauptkritik (Ansage ohne Aufforderung, doppelter Fehler, Bestätigungsansage bei Datum vor Beginn, Ansagen beim Laden) ist behoben. Beide Wege sind ohne Blocker oder Major bedienbar.
