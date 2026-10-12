<!-- Persona run J1 on 87ac838; screenshots stayed in the session's scratchpad -->

# Persona-Test J1: Sven, 45, blind, Screenreader und Tastatur (Kündigung eintragen, aufheben, Liste)

Datum des Laufs: Montag, 12.10.2026. Desktop, nur Tastatur (Tab, Shift+Tab, Pfeiltasten, Leertaste, Enter, Ctrl+A, Rücktaste, Tippen), Seite gelesen über den Accessibility-Tree (Rolle, Name, Beschreibung über `aria-describedby`, `aria-invalid`, `aria-errormessage`, `document.activeElement`) und einen MutationObserver auf allen Live-Regionen (`aria-live`, `role="status"`, `role="alert"`), der ab dem Laden jeder Seite mitläuft. Kein echter Screenreader; was «angesagt» wird, leite ich aus Fokus, Beschreibung und Live-Regionen ab. Neu gegenüber I5: Der Observer unterscheidet zwischen Live-Regionen, deren Text sich ändert (wird angesagt), und Live-Regionen, die bei einem Seitenwechsel schon gefüllt eingefügt werden (von den meisten Screenreadern nicht angesagt).

Gearbeitet nur in der **Seepark Residenz**, Mietvertrag **Thomas Weber, Wohnung A1** (laufend seit 01.04.2022, unbefristet).

**Geänderte Daten:**
- **Thomas Weber, Wohnung A1:** Kündigung auf den 31.01.2027 eingetragen (Dialog «Beenden»), danach unter «Bearbeiten» mit «Kündigung aufheben» zurückgenommen. Endzustand wie vorher: «Laufend, Vertragsende Unbefristet». Dazwischen im Formular verschiedene Daten getippt (28.02.2027, 30.09.2026, leer), jeweils **ohne Speichern** verlassen.
- **Versehentlich, ausserhalb der Seepark Residenz: Laura Keller, Wohnung EG, Alpenblick.** Mein erster Durchgang von Aufgabe 1 hat sich bei den Tab-Halten in der Liste verzählt (pro Zeile zwei Links, siehe m6) und den Vertrag von Laura Keller mit «Beenden» auf den 31.01.2027 gekündigt. Ein Zurücksetzen über «Kündigung aufheben» wurde mir in dieser Sitzung nicht erlaubt. Beim Lesen der Liste später stand bei Laura Keller bereits «Beendet 01.11.2022 – 30.09.2025, befristet», d. h. jemand anders hat diesen Vertrag inzwischen erneut geändert. **Bitte den Zustand von Laura Keller mit der Person abgleichen, die Alpenblick testet.**

## Aufgabe geschafft: **ja**

1. **Kündigung eintragen:** ja. Detailseite danach: «Vertragsdauer: Laufend, Vertragsbeginn 01.04.2022, Vertragsende: **Unbefristet, gekündigt auf den 31.01.2027**». Der Schalter «Beenden» ist weg. Statusmeldung «Der Mietvertrag von Thomas Weber endet am 31.01.2027».
2. **Kündigung aufheben:** ja. Optionsgruppe «Vertragsdauer» mit drei Optionen gehört, Pfeiltasten funktionieren, die Folge «Der Mietvertrag läuft dann ohne Ende weiter.» wird als Beschreibung vorgelesen. Gespeichert: «Vertragsende Unbefristet», «Beenden» ist wieder da.
3. **Liste Seepark Residenz:** ja, mit Einschränkung. Gehört: drei Zeilen «…, unbefristet» und Sarah Meier «Beendet 01.08.2021 – 30.06.2025, befristet». **«, gekündigt» konnte ich in der Seepark Residenz nicht hören**, weil nach Aufgabe 2 kein Vertrag dort mehr gekündigt ist (Reihenfolge der Aufgaben). Laut Code (`contractPeriod`) hiesse die Zeile von Thomas Weber zwischen Aufgabe 1 und 2 «Laufend 01.04.2022 – 31.01.2027, gekündigt».

## Aufwand (Tastendrücke)

| Schritt | Tasten |
|---|---|
| Liste «Mietverträge»: Sprunglink (Tab, Enter), Tab ×16 zu «Thomas Weber», Enter | 19 |
| Detailseite → «Beenden» (Sprunglink, Tab ×3, Enter) | 6 |
| Dialog: Tab ×2 ins Feld, «31.01.2027» tippen, Tab ×3 zu «Mietvertrag beenden», Enter | 16 |
| **Total Aufgabe 1** | **41** |
| Detailseite → «Bearbeiten» (Sprunglink, Tab ×2, Enter) | 5 |
| Formular: Sprunglink, Tab ×7 zur «Vertragsdauer» | 9 |
| Tab ins Vertragsende und zurück (nachhören, welches Datum gilt) | 2 |
| Pfeil runter auf «Kündigung aufheben» | 1 |
| Tab ×5 zu «Änderungen speichern», Enter | 6 |
| **Total Aufgabe 2** | **23** (kürzester Weg 21) |
| Liste: Sprunglink, Tab ×3 zu «Gebäude», Pfeil runter ×2, Tab ×2, Enter | 10 |
| Durch die vier Zeilen (zwei Halte je Zeile) | 8 |
| **Total Aufgabe 3** | **18** |

Nicht mitgezählt: der verunglückte erste Durchgang (12 statt 16 Tabs in der Liste) und die Prüfschritte im Formular ohne Speichern.

## Ablauf (was angesagt wurde)

### Aufgabe 1: Kündigung eintragen

1. **Liste:** Sprunglink, Fokus auf `main`. Jede Zeile hat zwei Tab-Halte: «Nina Brunner, Link», «Mietvertrag von Nina Brunner bearbeiten, Link» usw. Thomas Weber ist der 16. Halt nach dem Sprunglink. Im ersten Durchgang habe ich nach 12 Halten Enter gedrückt und war bei «Laura Keller» (Alpenblick).
2. **Detailseite:** assertiv «Mietvertrag - Thomas Weber - Dwello», Fokus am Seitenanfang (Dokument). «Vertragsende: Unbefristet».
3. **«Beenden»:** «Mietvertrag beenden?, Dialog». Fokus auf **«Abbrechen»**, Tab-Reihenfolge Abbrechen → Mietvertrag beenden → Vertragsende → Kalender. **Der Dialog nennt weder Mieter noch Wohnung.**
4. **Feld:** «Vertragsende, Eingabefeld, leer. Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht. Format TT.MM.JJJJ. Beispiel: 31.12.2026». Passt genau zur Aufgabe.
5. **«31.01.2027» tippen:** Neun Zeichen still, beim letzten einmal höflich «Sonntag, 31. Januar 2027». Kein Kästchen (Datum in der Zukunft).
6. **Tab ×3, Enter auf «Mietvertrag beenden»:** Dialog schliesst. Höflich (atomar) **«Der Mietvertrag von Thomas Weber endet am 31.01.2027»**. Kein assertiver Seitentitel. **Fokus auf `main`** (Adresse endet auf `#main-content`, wie in I5).
7. **Detailseite lesen:** «Vertragsdauer, Überschrift Ebene 2. Laufend. Vertragsbeginn 01.04.2022. Vertragsende **Unbefristet, gekündigt auf den 31.01.2027**.» Richtig. Ich höre zuerst «Vertragsende: Unbefristet» und erst danach das Datum; beim schnellen Durchhören klingt das kurz widersprüchlich.

### Aufgabe 2: «Bearbeiten», Kündigung aufheben

1. **Detailseite → «Bearbeiten»:** assertiv «Mietvertrag bearbeiten - Dwello». Die Live-Regionen «Es wird geprüft, welche Wohnungen frei sind …», «Freitag, 1. April 2022» und «Sonntag, 31. Januar 2027» werden beim Seitenwechsel **schon gefüllt eingefügt**, ihr Text ändert sich danach nicht. Die meisten Screenreader sagen das nicht an; ganz sicher ist es nicht.
2. **Optionsgruppe:** «Vertragsdauer, Gruppe». Erste Option:
   «**Unbefristet, gekündigt auf den 31.01.2027** Der Mietvertrag endet mit der Kündigung. Hat sich der Kündigungstermin verschoben, ändern Sie das Vertragsende., Optionsfeld, ausgewählt. Der Mietvertrag endet mit der Kündigung. Hat sich der Kündigungstermin verschoben, ändern Sie das Vertragsende.»
   Name 21 Wörter, die Erklärung kommt doppelt (Name und Beschreibung), wie schon bei «Unbefristet» und «Befristet» in I5.
3. **Pfeil runter:** «**Kündigung aufheben** Der Mietvertrag läuft dann ohne Ende weiter., Optionsfeld, ausgewählt. **Der Mietvertrag läuft dann ohne Ende weiter.**» Die Folge wird gesagt (sogar zweimal). Das Feld «Vertragsende» verschwindet ohne Ansage; nächster Tab-Halt ist «Nettomiete pro Monat». Das passt zur Beschreibung.
4. **Pfeil runter:** «Befristet Der Mietvertrag endet an einem festen Tag, ohne Kündigung., Optionsfeld, ausgewählt …». Das Feld kommt zurück, mit dem alten Datum; höflich «Sonntag, 31. Januar 2027». **Pfeil runter springt zurück** auf die erste Option, Pfeil hoch rückwärts. Das ist das normale Verhalten von Optionsfeldern; jede Pfeiltaste wählt sofort aus.
5. **Vertragsende ändern (nur geprüft, nicht gespeichert):** In der ersten Option Tab ins Feld «Vertragsende, 31.01.2027, Letzter Tag des Mietverhältnisses. Format TT.MM.JJJJ … Sonntag, 31. Januar 2027». Ctrl+A, «28.02.2027» getippt:
   - Während des Tippens heisst die Option sichtbar nur «Unbefristet, gekündigt» (ohne Datum), beim letzten Zeichen «Unbefristet, gekündigt auf den 28.02.2027».
   - **Angesagt wird nur «Sonntag, 28. Februar 2027».** Dass sich der Name der Option geändert hat, höre ich erst, wenn ich mit Shift+Tab zurückgehe: «Unbefristet, gekündigt auf den 28.02.2027 …, ausgewählt».
   - Feld geleert: Option heisst «Unbefristet, gekündigt» ohne Datum, wieder ohne Ansage.
   - Vergangenes Datum 30.09.2026: Option «Unbefristet, gekündigt auf den 30.09.2026», höflich «Mittwoch, 30. September 2026» und «Das Vertragsende liegt in der Vergangenheit. Bestätigen Sie das Vertragsende mit dem Kästchen.», Kästchen «Der Mietvertrag endete am 30.09.2026.». Gleich wie in I5.
6. **Echter Durchgang:** Erste Option, Tab ins Feld (31.01.2027 bestätigt), Shift+Tab, Pfeil runter auf «Kündigung aufheben», Tab ×5, Enter auf «Änderungen speichern».
7. **Nach dem Speichern:** assertiv «Mietvertrag - Thomas Weber - Dwello», Fokus auf **«Mietvertrag von Thomas Weber, Überschrift Ebene 1»**, höflich «**Mietvertrag von Thomas Weber gespeichert**». Detailseite: «Laufend, Vertragsende Unbefristet», «Beenden» ist wieder da. Dass die Kündigung aufgehoben wurde, sagt die Meldung nicht.

### Aufgabe 3: Liste der Seepark Residenz

1. **Filter:** «Gebäude, Ausklappliste», Pfeil runter ×2 auf «Seepark Residenz», Tab ×2 zu «Suchen», Enter. Fokus danach auf **«4 Mietverträge, Überschrift Ebene 2»**. Gut, ich weiss sofort, wie viele es sind.
2. **Mit Tab:** «Nina Brunner, Link», «Mietvertrag von Nina Brunner bearbeiten, Link», «Marco Bernasconi, Link», …, «Sarah Meier, Link». **Mit Tab höre ich nur Namen, nie Wohnung oder Status.**
3. **Im Lesemodus** je Zeile:
   - «Nina Brunner, Wohnung A2 · Seepark Residenz, Laufend, seit 01.07.2025, unbefristet, Nettomiete CHF 1’620.00, Monatlich total CHF 1’940.00, Bearbeiten»
   - «Marco Bernasconi, Wohnung B2 …, Laufend, seit 01.07.2023, unbefristet …»
   - «Thomas Weber, Wohnung A1 …, Laufend, seit 01.04.2022, unbefristet …»
   - «Sarah Meier, Wohnung A2 …, Beendet, 01.08.2021 – 30.06.2025, **befristet** …»
   Die neue Endung «, befristet» ist klar. «, gekündigt» kam in der Seepark Residenz nicht mehr vor (siehe oben).
4. **Wohnung A1 (Gegenprobe):** «Mietverträge der Wohnung: Mietvertrag von Thomas Weber, Link, seit 01.04.2022, unbefristet, CHF 1’400.00 monatlich total, Laufend». Stimmt.

## Befunde

### Major

- **M1: Dialog «Mietvertrag beenden?» nennt nicht, wessen Mietvertrag (WCAG 3.3.4 Fehlervermeidung, 2.4.6; Designregel «Irreversible Aktionen bestätigen mit der echten Folge»).** Bildschirm: Detailseite → Dialog. Name «Mietvertrag beenden?», Beschreibung: Feldhilfe und Fristhinweis, **kein Mietername, keine Wohnung**. Die Statusmeldung danach nennt den Namen («Der Mietvertrag von Laura Keller endet am 31.01.2027»), aber erst, wenn es gespeichert ist. In diesem Lauf hat das zu falschen Daten bei Laura Keller (Alpenblick) geführt. Ehrlich gesagt: Der Hauptgrund war mein Verzählen in der Liste, und der Seitentitel «Mietvertrag - Laura Keller» wurde assertiv angesagt; der Dialog hätte den Fehler aber abfangen können. **Vorschlag:** Titel «Mietvertrag von Laura Keller beenden?» oder ein erster Satz «Wohnung EG, Alpenblick, Mieterin Laura Keller.»; der Schalter «Mietvertrag von Laura Keller beenden».

### Minor

- **m1: Namensänderung der ersten Option wird nicht angesagt (WCAG 4.1.3, Best Practice).** Bildschirm: Mietvertrag bearbeiten, Optionsgruppe «Vertragsdauer». Wer im Feld «Vertragsende» das Datum ändert, hört nur den Wochentag («Sonntag, 28. Februar 2027»); dass die Option jetzt «Unbefristet, gekündigt auf den 28.02.2027» heisst, höre ich erst beim Zurückgehen. Bei leerem Feld heisst sie «Unbefristet, gekündigt» ohne Datum. Für mich nicht schlimm, weil das Feld die Quelle ist; eine zusätzliche Ansage wäre eher Lärm. **Vorschlag:** so lassen, aber in der Beschreibung der ersten Option ausdrücklich auf das Feld verweisen: «… ändern Sie unten das Vertragsende.»
- **m2: Optionsfelder sagen die Erklärung doppelt (WCAG 4.1.2; geblieben, jetzt drei Optionen).** Name «Unbefristet, gekündigt auf den 31.01.2027 Der Mietvertrag endet mit der Kündigung. Hat sich der Kündigungstermin verschoben, ändern Sie das Vertragsende.» und dieselben 14 Wörter nochmals als Beschreibung; ebenso «Kündigung aufheben Der Mietvertrag läuft dann ohne Ende weiter.» und «Befristet Der Mietvertrag endet an einem festen Tag, ohne Kündigung.». Ursache: Die Beschreibung steht innerhalb des `<label>`. **Vorschlag:** Beschreibung ausserhalb des `<label>` (oder Name per `aria-labelledby` nur auf den Titel-Span), Erklärung nur über `aria-describedby`.
- **m3: Detailseite liest «Vertragsende: Unbefristet, gekündigt auf den 31.01.2027» (Verständlichkeit).** Bildschirm: Mietvertrag Thomas Weber, Abschnitt «Vertragsdauer». Das erste Wort nach «Vertragsende» ist «Unbefristet», das Datum kommt zuletzt. Gemäss Aufgabe gewollt, beim Durchhören aber kurz irritierend. In der Liste hiesse derselbe Vertrag «Laufend 01.04.2022 – 31.01.2027, gekündigt» (zwei verschiedene Formulierungen). **Vorschlag:** prüfen, ob «Vertragsende: 31.01.2027 (gekündigt, unbefristeter Mietvertrag)» oder in der Liste «…, gekündigt auf den 31.01.2027» einheitlicher ist; als `TODO(fachlich prüfen)`.
- **m4: Bestätigung nach «Kündigung aufheben» sagt nur «gespeichert» (geblieben, WCAG 4.1.3).** Bildschirm: Detailseite nach «Änderungen speichern». Text «Mietvertrag von Thomas Weber gespeichert». **Vorschlag:** «Die Kündigung von Thomas Weber ist aufgehoben. Der Mietvertrag läuft ohne Ende weiter.»
- **m5: Kündigung lässt sich auf der Detailseite nicht direkt aufheben (Auffindbarkeit).** Nach der Kündigung verschwindet «Beenden», und nichts auf der Detailseite sagt, dass man die Kündigung unter «Bearbeiten» aufheben kann. Ich wusste es nur aus der Aufgabe. **Vorschlag:** Unter «Vertragsende» ein Satz «Zieht der Mieter die Kündigung zurück, wählen Sie unter «Bearbeiten» «Kündigung aufheben».»
- **m6: Listenzeile: Link nur mit Mieternamen, zweiter Link pro Zeile (geblieben).** Bildschirm: Mietverträge. «Thomas Weber, Link», dann «Mietvertrag von Thomas Weber bearbeiten, Link»; 11 Verträge = 22 Halte. Die neue Endung «, befristet»/«, gekündigt» höre ich nur im Lesemodus, nicht mit Tab. Diese Struktur hat in diesem Lauf zum Verzählen geführt (M1). **Vorschlag:** Name des Zeilenlinks «Thomas Weber, Wohnung A1, Seepark Residenz, laufend, gekündigt auf den 31.01.2027» (oder `aria-describedby` auf den Statustext).
- **m7: Fokus nach «Mietvertrag beenden» auf dem Hauptbereich statt auf der Überschrift (geblieben, WCAG 2.4.3; jetzt zweimal bestätigt).** Nach Sprunglink-Benutzung (Adresse `…#main-content`) landet der Fokus auf `main` ohne Namen. **Vorschlag:** nach dem Schliessen des Dialogs den Fokus ausdrücklich auf die Überschrift setzen.
- **m8: Fokus startet im Dialog auf «Abbrechen», Schalter vor dem Feld (geblieben).** **Vorschlag:** Fokus beim Öffnen ins Feld «Vertragsende».
- **m9: Assertiver Seitentitel nach «Änderungen speichern» (geblieben, WCAG 4.1.3).** «Mietvertrag - Thomas Weber - Dwello» assertiv, danach die Statusmeldung. **Vorschlag:** bei Rückkehr nach einem Formular die Titelansage unterdrücken.
- **m10: Feldhilfe «Vertragsende» im Formular ohne «Kündigungstermin» (geblieben, WCAG 3.2.4).** Im Dialog: «Der letzte Tag des Mietverhältnisses, also der Kündigungstermin …», im Formular nur «Letzter Tag des Mietverhältnisses.», obwohl die Option darüber vom Kündigungstermin spricht. **Vorschlag:** dieselbe Hilfe an beiden Orten.
- **m11: Live-Regionen beim Laden von «Bearbeiten» schon gefüllt eingefügt (unsicher).** «Es wird geprüft, welche Wohnungen frei sind …», «Freitag, 1. April 2022», «Sonntag, 31. Januar 2027» kommen mit dem Seitenwechsel bereits gefüllt. NVDA und JAWS sagen das in der Regel nicht an, VoiceOver gelegentlich. **Vorschlag:** Live-Regionen leer rendern und erst bei einer Änderung durch den Benutzer füllen.

## Was gut ist

- **Die drei Optionen sind klar benannt** und unterscheiden sich am Anfang: «Unbefristet, gekündigt auf den 31.01.2027», «Kündigung aufheben», «Befristet». Das Datum steht im Namen, ich muss nicht ins Feld.
- **Die Folge «Der Mietvertrag läuft dann ohne Ende weiter.» wird beim Fokus vorgelesen**, und das Feld «Vertragsende» verschwindet passend dazu.
- **«Befristet … ohne Kündigung»** grenzt die beiden Arten von Vertragsende sauber ab.
- Pfeiltasten verhalten sich wie bei jeder Optionsgruppe (runter, hoch, Umlauf); das Datum bleibt beim Hin- und Herwechseln erhalten.
- Vergangenes Datum in der ersten Option: dieselbe Kurzansage und dasselbe Kästchen wie im Dialog.
- Nach «Beenden» die Statusmeldung mit Name und Datum, kein assertiver Seitentitel.
- Detailseite «Unbefristet, gekündigt auf den 31.01.2027» entspricht der Erwartung; «Beenden» verschwindet bei gekündigten und kommt nach dem Aufheben zurück.
- Liste: Fokus nach «Suchen» auf «4 Mietverträge»; «, befristet» am Zeilenende ist eindeutig.

## Vergleich zu I5

| Befund aus I5 | J1 |
|---|---|
| Minor: Optionsfelder doppelt | Unverändert, jetzt bei drei Optionen (m2). |
| Minor: Bestätigung nach «Bearbeiten» ohne Inhalt | Unverändert, jetzt auch beim Aufheben der Kündigung (m4). |
| Minor: «Unbefristet» bei beendetem Vertrag ohne Hinweis | **Für gekündigte Verträge behoben:** «Kündigung aufheben» mit Folge «Der Mietvertrag läuft dann ohne Ende weiter.» Für befristet beendete Verträge nicht geprüft. |
| Minor: Fokus nach «Mietvertrag beenden» auf `main` | Unverändert, bestätigt (m7). |
| Minor: Fokus startet im Dialog auf «Abbrechen» | Unverändert (m8). |
| Minor: assertiver Seitentitel nach «Änderungen speichern» | Unverändert (m9). |
| Minor: Feldhilfe «Vertragsende» im Formular kürzer | Unverändert (m10). |
| Minor: Listenlink nur mit Namen, zweiter Link | Unverändert (m6), hat in J1 zu falschen Daten beigetragen. |
| Minor: veralteter Fehler in assertiver Region, zurückgesetzte Bestätigung, Wochentag-Zwischenstände, Dialogbeschreibung 63 Wörter | In J1 nicht erneut geprüft. |

**Neu:** M1 (Dialog nennt den Mietvertrag nicht), m1, m3, m5.

Insgesamt: Die neue Unterscheidung Kündigung/Befristung ist für mich hörbar und verständlich, und «Kündigung aufheben» ist mit Tastatur in 21 Tasten machbar. Die Optionsgruppe ist korrekt aufgebaut; störend ist nur die doppelte Erklärung. Der einzige Major betrifft den bestehenden Dialog «Beenden», der nicht sagt, wessen Mietvertrag beendet wird.
