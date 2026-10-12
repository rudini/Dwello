<!-- Persona run K1 on fc88fcf; screenshots stayed in the session's scratchpad -->

# Persona-Test K1: Sven, 45, blind, Screenreader und Tastatur (Auszug mit Entwurf, Kündigung und Folgen)

Datum des Laufs: Montag, 12.10.2026. Desktop, nur Tastatur (Tab, Shift+Tab, Pfeiltasten, Leertaste, Enter, Tippen), Seite gelesen über den Accessibility-Tree (Rolle, Name, Beschreibung über `aria-describedby`, `aria-invalid`, `aria-errormessage`, `document.activeElement`) und einen MutationObserver auf allen Live-Regionen (`aria-live`, `role="status"`, `role="alert"`), der ab dem Laden jeder Seite mitläuft. Kein echter Screenreader; was «angesagt» wird, leite ich aus Fokus, Beschreibung und Live-Regionen ab. Live-Regionen, die bei einem Seitenwechsel schon gefüllt eingefügt werden, sind als solche markiert (von den meisten Screenreadern nicht angesagt; Ausnahme `role="alert"`, das beim Einfügen ein Alert-Ereignis auslöst).

Gearbeitet nur in der **Seepark Residenz**. Vor jeder Änderung habe ich den Mieternamen geprüft: auf der Detailseite die Überschrift «Mietvertrag von …», im Formular die Brotkrümelnavigation «Mietvertrag von Marco Bernasconi», im Dialog den Titel «Mietvertrag von Thomas Weber, Wohnung A1, beenden?». Meine Skripte brechen ab, wenn der Name nicht stimmt.

**Geänderte Daten:**
- **Marco Bernasconi, Wohnung B2:** unter «Bearbeiten» Vertragsdauer «Befristet», Vertragsende 30.09.2025, Kästchen «Der Mietvertrag endete am 30.09.2025.» bestätigt, danach «Entwurf löschen und Mietvertrag speichern». Vorher «Laufend, Unbefristet», jetzt **«Beendet, Vertragsende: Befristet bis 30.09.2025»**.
- **Nebenkostenabrechnung NK-22222222-2025-0004 (Entwurf, Marco Bernasconi, 2025) gelöscht.** Im Assistenten bin ich nur bis zur Vorschau gegangen und habe **nichts erstellt**. Die Abrechnung 2025 von Marco Bernasconi fehlt jetzt; die Detailseite meldet «Abrechnung 2025 fehlt», die Übersicht «Noch nicht abgerechnet: Seepark Residenz».
- **Thomas Weber, Wohnung A1:** mit «Beenden» gekündigt auf den 31.01.2027. Jetzt «Laufend, Vertragsende: Unbefristet, gekündigt auf den 31.01.2027».
- **Ausserhalb der Seepark Residenz habe ich nichts geändert.** Gesehen, aber nicht von mir: Kevin Fischer (Alpenblick, OG1) ist ebenfalls auf den 31.01.2027 gekündigt, und in Alpenblick und Musterhaus Zentrum sind neue Entwürfe 2025 entstanden (andere Tester).

## Aufgabe geschafft

1. **Vertragsende Marco Bernasconi: ja**, genau wie in der Produkterwartung: Speichern abgelehnt, Link «Nebenkostenabrechnung NK-22222222-2025-0004 öffnen», Folge «Der Entwurf NK-22222222-2025-0004 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.», Schalter «Entwurf löschen und Mietvertrag speichern». Danach öffnet der Assistent bei «Schritt 3 von 5: Heizprofil und Verwaltungspauschale», mit Seepark Residenz und 01.01.2025 – 31.12.2025 vorausgewählt. **Aber:** Um das zu hören, musste ich in Schritt 1 und 2 zurückgehen (M2), und gespeichert ist ein «befristeter» Mietvertrag, obwohl Marco Bernasconi gekündigt hat (M1).
2. **Kündigung Thomas Weber: ja.** Übersicht: Aufgabe «Nachmieter für Wohnung A1 suchen» mit «Der Mietvertrag von Thomas Weber endet am 31.01.2027. …». Wohnungsliste und Seite Wohnung A1: «Vermietet bis 31.01.2027». Mietvertrag: Abschnitt «Nächste Schritte» mit «Nachmieter erfassen» und «Neue Adresse eintragen». Alles da; mit Tab allein höre ich aber in Übersicht und Wohnungsliste weder Wohnung noch Status (m8, m9).

## Aufwand (Tastendrücke)

| Schritt | Tasten |
|---|---|
| Liste «Mietverträge»: Sprunglink (Tab, Enter), Tab ×8 zu «Marco Bernasconi», Enter | 11 |
| Detailseite → «Bearbeiten» (Sprunglink, Tab ×2, Enter) | 5 |
| Formular: Sprunglink, Tab ×7 zur «Vertragsdauer» | 9 |
| Pfeil runter «Befristet», Tab ins Vertragsende, «30.09.2025» tippen | 12 |
| Tab ×2 zum Kästchen, Leertaste | 3 |
| Tab ×5 zu «Änderungen speichern», Enter (abgelehnt) | 6 |
| Tab ×2 zu «Entwurf löschen und Mietvertrag speichern», Enter | 3 |
| **Total Aufgabe 1 bis Assistent** | **49** |
| Nachprüfen im Assistenten: zurück zu Schritt 1 (Sprunglink, Tab ×2, Enter), Weiter zu Schritt 2 (Tab ×6, Enter), Gebäude durchhören (Tab ×6, Enter) | 17 |
| Liste: Sprunglink, Tab ×16 zu «Thomas Weber», Enter | 19 |
| Detailseite → «Beenden» (Sprunglink, Tab ×3, Enter) | 6 |
| Dialog: Tab ×2 ins Feld, «31.01.2027» tippen, Tab ×3 zu «Mietvertrag beenden», Enter | 16 |
| **Total Aufgabe 2, Kündigung** | **41** |
| Detailseite → Übersicht (Tab ×5, Enter), Sprunglink, Tab ×4 bis zur ersten Aufgabe mit «Mietvertrag erfassen» | 12 |
| Übersicht → Wohnungen (Tab ×7, Enter), Sprunglink, Tab ×15 zu «Wohnung A1», Enter | 26 |

Das Lesen der Seiten im Lesemodus (Pfeiltasten) ist nicht mitgezählt.

## Ablauf (was angesagt wurde)

### Aufgabe 1: Marco Bernasconi, Vertragsende 30.09.2025

1. **Liste:** assertiv «Mietverträge - Dwello». Sprunglink, Tab ×8: «Marco Bernasconi, Link». Enter.
2. **Detailseite:** assertiv «Mietvertrag - Marco Bernasconi - Dwello», Überschrift «Mietvertrag von Marco Bernasconi», «Wohnung B2 · Seepark Residenz». Name geprüft. Sprunglink, Tab ×2 «Bearbeiten, Link», Enter.
3. **Formular:** assertiv «Mietvertrag bearbeiten - Dwello». Schon gefüllt eingefügt (vermutlich still): «Es wird geprüft, welche Wohnungen frei sind …», «Samstag, 1. Juli 2023». Brotkrümel «Mietverträge › Mietvertrag von Marco Bernasconi › Mietvertrag bearbeiten»: Name geprüft. Die Überschrift selbst heisst nur «Mietvertrag bearbeiten».
4. **Vertragsdauer:** «Unbefristet Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird., Optionsfeld, ausgewählt» (Erklärung wieder doppelt, J1 m2). Pfeil runter: «**Befristet Der Mietvertrag endet an einem festen Tag, ohne Kündigung.**, Optionsfeld, ausgewählt». Hier habe ich gezögert: Marco Bernasconi hat gekündigt, eine dritte Option gibt es nicht (M1).
5. **Vertragsende:** «Vertragsende, Eingabefeld, leer. Letzter Tag des Mietverhältnisses. Format TT.MM.JJJJ. Beispiel: 31.12.2026». «30.09.2025» getippt, beim fünften Zeichen der Jahreszahl höflich «Dienstag, 30. September 2025» und «Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr. Bestätigen Sie das Vertragsende mit dem Kästchen.»
6. **Kästchen:** «Der Mietvertrag endete am 30.09.2025., Kästchen, nicht aktiviert. Seit dem 01.10.2025 gilt die Wohnung als nicht vermietet, wenn kein neuer Mietvertrag begonnen hat. Die Nebenkosten dieser Zeit trägt der Vermieter, das Akonto des Mieters zählt nur bis zum Vertragsende.» Leertaste: aktiviert. Klar.
7. **«Änderungen speichern», Enter:** Fokus springt auf die Fehlermeldung (`role="alert"`, `tabindex="-1"`, **Name leer**). Das Alert wird gefüllt eingefügt, also angesagt:
   «**Der Mietvertrag wurde nicht gespeichert.** Die Nebenkostenabrechnung NK-22222222-2025-0004 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.»
   Gut: Ich weiss sofort, dass nichts gespeichert ist und warum. Die Nummer höre ich als «N K Bindestrich 22 Millionen 222 Tausend …» (m3). Dass es unten einen Schalter gibt, der das für mich erledigt, sagt die Meldung nicht.
8. **Tab 1:** «**Nebenkostenabrechnung NK-22222222-2025-0004 öffnen, Link**». Kein Mietername, kein Jahr.
9. **Tab 2:** «**Entwurf löschen und Mietvertrag speichern, Schalter**». Keine Beschreibung. Den Satz «Der Entwurf NK-22222222-2025-0004 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» steht zwischen Link und Schalter und wird mit Tab **übersprungen** (m2). Ich habe ihn nur im Lesemodus gefunden. Die Folge ist damit nicht verloren (die Alert-Meldung sagt Ähnliches), aber der Schalter löscht ohne weitere Rückfrage.
10. **Enter:** assertiv «Abrechnungen erstellen - Dwello», höflich (atomar) «**Mietvertrag von Marco Bernasconi gespeichert**». Fokus auf «**Abrechnungen erstellen, Überschrift Ebene 1**». Adresse `/statements/generate?building=…&start=2025-01-01&end=2025-12-31`.
11. **Assistent lesen:** «Schritt 3 von 5: Heizprofil und Verwaltungspauschale», Fortschritt mit «Abrechnungsperiode (erledigt), Schalter», «Gebäude (erledigt), Schalter». Danach Heizprofil (Beschreibung 120 Wörter) und Verwaltungspauschale «3». **Nirgends höre ich «Seepark Residenz» oder «2025»**, und niemand sagt, dass der Entwurf gelöscht ist und warum ich hier bin (M2).
12. **Nachprüfen:** «Abrechnungsperiode (erledigt)», Enter: Fokus auf «Schritt 1 von 5: Abrechnungsperiode, Überschrift Ebene 2», Beginn «01.01.2025», Ende «31.12.2025». Weiter: Fokus auf «Schritt 2 von 5: Gebäude», Kästchen «Seepark Residenz Seeweg 15, 6003 Luzern 15 Rechnungen in der Abrechnungsperiode 4 Wohnungen, aktiviert», die anderen nicht. Stimmt. Weiter zu Schritt 3, Weiter zur Vorschau: Fokus diesmal auf **`main` ohne Namen**, höflich «Vorschau wird berechnet …» (m4). Vorschau: «Anzahl Abrechnungen 1», «Abrechnungen pro Mietvertrag: Marco Bernasconi Wohnung B2 … Rückerstattung CHF 38.65», dazu «Es gibt schon Abrechnungen … 3 Nebenkostenabrechnungen» und das Kästchen «Die Abrechnungen trotzdem erstellen» (m5). Hier habe ich aufgehört, nichts erstellt.
13. **Detailseite danach (Lesemodus):** «Abrechnung 2025 fehlt. Der Mietvertrag hat Mietstage in dieser Abrechnungsperiode, aber noch keine Nebenkostenabrechnung. Erstellen Sie sie im Assistenten. Abrechnungen erstellen, Link». «Vertragsdauer: Beendet, Vertragsende **Befristet bis 30.09.2025**». Kein Abschnitt «Nächste Schritte».

### Aufgabe 2: Thomas Weber, Kündigung auf den 31.01.2027

1. **Liste:** Sprunglink, Tab ×16 «Thomas Weber, Link», Enter. Assertiv «Mietvertrag - Thomas Weber - Dwello», Überschrift «Mietvertrag von Thomas Weber». Name geprüft.
2. **«Beenden»:** Sprunglink, Tab ×3, Enter. «**Mietvertrag von Thomas Weber, Wohnung A1, beenden?, Dialog**». Das ist neu und genau, was ich in J1 vermisst habe. Beschreibung (`aria-describedby` auf den ganzen Inhalt): «Vertragsende Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. … Prüfen Sie Frist und Termin im Mietvertrag: Für Wohnungen gilt eine Kündigungsfrist von mindestens 3 Monaten. …», rund 60 Wörter. Fokus auf **«Abbrechen»**; Tab: «Mietvertrag beenden», dann erst das Feld (m6).
3. **Feld:** «Vertragsende, Eingabefeld, leer. Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. …». «31.01.2027» getippt, höflich «Sonntag, 31. Januar 2027». Tab ×3 zu «Mietvertrag beenden», Enter.
4. **Danach:** höflich (atomar) «**Der Mietvertrag von Thomas Weber endet am 31.01.2027**». Fokus auf **`main`** ohne Namen (J1 m7, unverändert).
5. **Detailseite:** «Vertragsende: Unbefristet, gekündigt auf den 31.01.2027». Neu: «**Nächste Schritte, Überschrift Ebene 2.** Der Mietvertrag ist gekündigt. Erfassen Sie den Mietvertrag des Nachmieters, sobald er unterschrieben ist. Für die Schlussabrechnung braucht es die neue Adresse des Mieters. Nachmieter erfassen, Link. Neue Adresse eintragen, Link.» Verständlich.
6. **Übersicht:** assertiv «Übersicht - Dwello». Im Lesemodus unter «Als Nächstes zu tun»: «**Nachmieter für Wohnung A1 suchen**, Überschrift Ebene 3. Der Mietvertrag von Thomas Weber endet am 31.01.2027. Suchen Sie einen Nachmieter und erfassen Sie seinen Mietvertrag. Mietvertrag erfassen, Link.» Daneben dieselbe Aufgabe für Wohnung OG1 (Kevin Fischer). **Mit Tab höre ich nur zweimal «Mietvertrag erfassen, Link»** und unter «Häufige Arbeiten» ein drittes Mal (m8). Ebenfalls da: «Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Seepark Residenz» (Folge von Aufgabe 1, passt).
7. **Wohnungsliste:** assertiv «Wohnungen - Dwello». Tab: «Wohnung EG, Link», «Wohnung OG1, Link», …, «Wohnung A1, Link» (15. Halt). **Status höre ich mit Tab nicht**; im Lesemodus: «Wohnung A1, Überschrift Ebene 2, Link. Vermietet bis 31.01.2027. Seepark Residenz. EG, 3 Zimmer, 68 m²». Wohnung B2 steht auf Seite 2: «Leer».
8. **Wohnung A1:** assertiv «Wohnung A1, Seepark Residenz - Dwello». «Mietstatus: **Vermietet bis 31.01.2027** Ein Mietvertrag läuft.» «Aktueller Mieter: Thomas Weber, Mietvertrag seit 01.04.2022» (ohne Kündigung, m10). «Mietverträge der Wohnung: Mietvertrag von Thomas Weber, Link, 01.04.2022 – 31.01.2027, gekündigt, CHF 1’400.00 monatlich total, Laufend».

## Befunde

### Major

- **M1: «Bearbeiten» kennt für einen unbefristeten Mietvertrag kein Ende nach Kündigung; der Auszug wird als «Befristet» gespeichert (WCAG 3.3.2 Beschriftungen und Anweisungen; Verständlichkeit).** Bildschirm: Mietvertrag bearbeiten, Optionsgruppe «Vertragsdauer». Zur Wahl stehen nur «Unbefristet Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird.» und «Befristet Der Mietvertrag endet an einem festen Tag, **ohne Kündigung**.». Marco Bernasconi hat gekündigt; ich musste eine Option wählen, deren Erklärung meiner Lage widerspricht. Ergebnis auf der Detailseite «Vertragsende: Befristet bis 30.09.2025», in der Liste vermutlich «…, befristet»; der Abschnitt «Nächste Schritte» fehlt, weil der Vertrag nicht als gekündigt gilt. Über «Beenden» wäre es richtig «Unbefristet, gekündigt auf den 30.09.2025» geworden (der Dialog kennt laut Code dieselbe Ablehnung mit «Entwurf löschen und Mietvertrag beenden»); das sagt mir im Formular aber niemand. **Vorschlag:** Bei einem unbefristeten Vertrag im Formular die dritte Option «Unbefristet, gekündigt» mit Feld «Vertragsende» anbieten (wie nach einer Kündigung schon vorhanden), oder unter der Optionsgruppe den Satz «Hat der Mieter gekündigt? Tragen Sie das Vertragsende mit «Beenden» auf der Seite des Mietvertrags ein.»
- **M2: Assistent nach «Entwurf löschen und Mietvertrag speichern» sagt nicht, für welches Gebäude und welche Periode, und nicht, warum er offen ist (WCAG 3.3.2, 2.4.6; Designregel «Führung statt Tempo»).** Bildschirm: Abrechnungen erstellen, Schritt 3. Angesagt werden nur «Abrechnungen erstellen - Dwello», «Mietvertrag von Marco Bernasconi gespeichert» und die Überschrift «Abrechnungen erstellen». Auf Schritt 3 kommen «Seepark Residenz» und «2025» nicht vor; die Schalter im Fortschritt heissen nur «Abrechnungsperiode (erledigt)» und «Gebäude (erledigt)». Dass der Entwurf gelöscht ist, sagt die Meldung nicht. Ich brauchte 17 zusätzliche Tasten (zurück zu Schritt 1, dann 2), um zu prüfen, dass ich die richtige Abrechnung neu erstelle. **Vorschlag:** Statusmeldung «Mietvertrag von Marco Bernasconi gespeichert. Der Entwurf NK-… ist gelöscht. Erstellen Sie die Abrechnung 2025 für die Seepark Residenz neu.»; Schalter im Fortschritt mit Wert («Abrechnungsperiode 01.01.2025 – 31.12.2025, erledigt», «Gebäude Seepark Residenz, erledigt») oder eine kurze Zusammenfassung über Schritt 3; Fokus auf die Schritt-Überschrift «Schritt 3 von 5: …» statt auf die Seitenüberschrift.

### Minor

- **m1: Fehlermeldung im Fokus ohne Namen, Schalter nicht erwähnt (WCAG 4.1.2, 3.3.3).** Bildschirm: Mietvertrag bearbeiten nach «Änderungen speichern». Fokus auf `role="alert"` mit leerem Namen; der Inhalt kommt über das Alert-Ereignis, ein Screenreader, der nur den Fokus liest, sagt «Warnung». Der Text sagt «Löschen Sie zuerst den Entwurf …», aber nicht, dass gleich darunter ein Schalter das erledigt. **Vorschlag:** `aria-labelledby` auf «Der Mietvertrag wurde nicht gespeichert»; Satz ergänzen «Mit dem Schalter unten löschen Sie den Entwurf und speichern den Mietvertrag.»
- **m2: Folge des Schalters nicht mit dem Schalter verbunden (WCAG 1.3.1, 3.3.4).** Bildschirm: wie m1. «Entwurf löschen und Mietvertrag speichern, Schalter» hat keine Beschreibung; der Satz «Der Entwurf NK-22222222-2025-0004 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» wird mit Tab übersprungen. **Vorschlag:** `aria-describedby` des Schalters auf diesen Satz.
- **m3: Abrechnung nur mit Nummer benannt (WCAG 2.4.4, Verständlichkeit).** Link «Nebenkostenabrechnung NK-22222222-2025-0004 öffnen», Folge «Der Entwurf NK-22222222-2025-0004 wird gelöscht …». Die Nummer wird als lange Zahl vorgelesen; Mieter und Jahr fehlen. **Vorschlag:** «Nebenkostenabrechnung 2025 von Marco Bernasconi öffnen (Entwurf NK-22222222-2025-0004)».
- **m4: Fokus nach «Weiter» zur Vorschau auf `main` ohne Namen (WCAG 2.4.3).** Bildschirm: Abrechnungen erstellen, Schritt 4. Bei Schritt 1–3 landet der Fokus auf der Schritt-Überschrift, bei der Vorschau (wird erst berechnet) auf `main`. **Vorschlag:** nach dem Berechnen den Fokus auf «Schritt 4 von 5: Vorschau» setzen.
- **m5: Vorschau: unklar, ob das Kästchen «Die Abrechnungen trotzdem erstellen» nötig ist.** Bildschirm: Schritt 4. «Es gibt schon Abrechnungen. Für Seepark Residenz gibt es in dieser Abrechnungsperiode schon 3 Nebenkostenabrechnungen. … Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue.» Ich will genau die eine fehlende erstellen; ob ich dafür das Kästchen aktivieren muss, sagt der Text nicht (nicht weiter geprüft, ich habe nichts erstellt). **Vorschlag:** «Erstellt wird nur die fehlende Abrechnung von Marco Bernasconi. Aktivieren Sie dazu das Kästchen.» oder das Kästchen weglassen, wenn nur fehlende entstehen.
- **m6: Dialog «Beenden»: Fokus auf «Abbrechen», Beschreibung ist der ganze Inhalt (geblieben, J1 m8).** Der Titel ist jetzt gut. Beim Öffnen hört man rund 60 Wörter Beschreibung, und die Feldhilfe danach nochmals. **Vorschlag:** Fokus ins Feld «Vertragsende»; `aria-describedby` des Dialogs nur auf den Fristhinweis.
- **m7: Fokus nach «Mietvertrag beenden» auf `main` (geblieben, J1 m7, WCAG 2.4.3).** **Vorschlag:** Fokus auf die Überschrift «Mietvertrag von Thomas Weber» oder auf «Nächste Schritte».
- **m8: Übersicht: dreimal «Mietvertrag erfassen» (WCAG 2.4.4/2.4.9).** Bildschirm: Übersicht, «Als Nächstes zu tun». Die Links der Aufgaben «Nachmieter für Wohnung A1 suchen» und «… OG1 suchen» heissen beide «Mietvertrag erfassen», ebenso der Link unter «Häufige Arbeiten». Mit Tab kann ich sie nicht unterscheiden; mit der Überschriften-Navigation geht es. **Vorschlag:** «Mietvertrag für Wohnung A1 erfassen» (oder `aria-describedby` auf die Aufgabenüberschrift).
- **m9: Wohnungsliste: Link nur mit Wohnungsnummer, Überschriften gleich tief wie die Listenüberschrift (WCAG 1.3.1, 2.4.6).** Bildschirm: Wohnungen. Tab: «Wohnung A1, Link»; Gebäude und «Vermietet bis 31.01.2027» nur im Lesemodus. Jede Zeile ist «Überschrift Ebene 2» unter «13 Wohnungen, Überschrift Ebene 2». **Vorschlag:** Linkname «Wohnung A1, Seepark Residenz, vermietet bis 31.01.2027» oder Status per `aria-describedby`; Zeilenüberschriften Ebene 3.
- **m10: Wohnung A1: «Aktueller Mieter» ohne Kündigung.** «Thomas Weber, Mietvertrag seit 01.04.2022». Der Mietstatus darüber sagt «Vermietet bis 31.01.2027 Ein Mietvertrag läuft.», die Mieterkarte nicht. **Vorschlag:** «Mietvertrag seit 01.04.2022, gekündigt auf den 31.01.2027».
- **m11: «Nächste Schritte»: Links ohne Bezug (WCAG 2.4.9).** «Nachmieter erfassen», «Neue Adresse eintragen»: im Abschnitt verständlich, in der Linkliste nicht. **Vorschlag:** «Nachmieter für Wohnung A1 erfassen», «Neue Adresse von Thomas Weber eintragen».
- **m12: Live-Regionen beim Laden schon gefüllt (geblieben, J1 m11).** «Es wird geprüft, welche Wohnungen frei sind …», «Samstag, 1. Juli 2023» (Bearbeiten), «Mittwoch, 1. Januar 2025», «Mittwoch, 31. Dezember 2025» (Assistent, Schritt 1). **Vorschlag:** leer rendern, erst bei Eingabe füllen.

## Was gut ist

- **Die Ablehnung ist klar:** Fokus springt auf die Meldung, «Der Mietvertrag wurde nicht gespeichert» kommt zuerst, der Grund danach. Link und Schalter folgen direkt mit Tab 1 und 2.
- **Der Schalter «Entwurf löschen und Mietvertrag speichern»** sagt mit Verb, was passiert, und die Eingaben bleiben erhalten; ich musste nichts neu tippen.
- **Der Assistent öffnet richtig vorbereitet** (Seepark Residenz, 01.01.2025 – 31.12.2025), die Vorschau zeigt genau eine Abrechnung für Marco Bernasconi.
- **Der Dialog «Beenden» nennt jetzt Mieter und Wohnung** im Titel: «Mietvertrag von Thomas Weber, Wohnung A1, beenden?» (J1 M1 behoben). Ich hätte mich in J1 damit nicht vertan.
- Vergangenes Datum: Kurzansage und Kästchen mit Folge («Die Nebenkosten dieser Zeit trägt der Vermieter …»), dazu «über ein Jahr zurück. Prüfen Sie das Jahr.»
- «Nächste Schritte» auf dem Mietvertrag, Aufgabe «Nachmieter für Wohnung A1 suchen» in der Übersicht, «Vermietet bis 31.01.2027» in Liste und Wohnungsseite: alles stimmt überein.
- Detailseite Marco Bernasconi meldet «Abrechnung 2025 fehlt» mit Weg in den Assistenten.

## Vergleich zu J1

| Befund aus J1 | K1 |
|---|---|
| M1: Dialog nennt nicht, wessen Mietvertrag | **Behoben:** «Mietvertrag von Thomas Weber, Wohnung A1, beenden?» |
| m2: Optionsfelder sagen die Erklärung doppelt | Unverändert (bei «Unbefristet» und «Befristet» gehört). |
| m6: Listenlink nur mit Mieternamen | Unverändert; diesmal kein Verzählen, weil ich den Namen vor jedem Enter geprüft habe. |
| m7: Fokus nach «Mietvertrag beenden» auf `main` | Unverändert (m7). |
| m8: Fokus im Dialog auf «Abbrechen» | Unverändert (m6). |
| m9: assertiver Seitentitel nach Speichern | Nach «Entwurf löschen und Mietvertrag speichern» wieder assertiv «Abrechnungen erstellen - Dwello» vor der Statusmeldung. |
| m11: Live-Regionen beim Laden gefüllt | Unverändert (m12), jetzt auch im Assistenten. |
| m1, m3, m4, m5, m10 | In K1 nicht erneut geprüft. |

**Neu:** M1 (Auszug nur als «Befristet» speicherbar), M2 (Assistent ohne Kontext), m1–m5, m8–m11.

Insgesamt: Die neue Ablehnung mit Link, Folge und Schalter ist mit Tastatur gut bedienbar, und der Assistent öffnet am richtigen Ort. Für mich fehlt danach die Bestätigung, wo ich bin, und das Formular «Bearbeiten» zwingt mich bei einem gekündigten unbefristeten Vertrag zu «Befristet». Die Kündigung von Thomas Weber und ihre Folgen in Übersicht, Wohnung und Mietvertrag sind vollständig und stimmen überein; mit Tab allein höre ich sie aber nur über Überschriften, nicht über die Links.

Screenshots (Scratchpad `sven-k1/`): k1-01-ablehnung.png, k1-02-assistent.png, k1-03-gebaeude.png, k1-04-vorschau.png, k1-05-dialog.png, k1-06-detail-gekuendigt.png, k1-07-uebersicht.png, k1-08-wohnungen.png, k1-09-wohnung-a1.png, k1-10-marco-detail.png (letzteres zeigt die Entwurfsliste, die Detailseite steht im Text).
