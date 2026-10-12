<!-- Persona run K2 on 0e3db29; screenshots stayed in the session's scratchpad -->

# Persona-Test K2: Sven, 45, blind, Screenreader und Tastatur (Kündigung über «Bearbeiten», vergessener Auszug, Übersicht)

## Setup und Methode

Datum des Laufs: Montag, 12.10.2026. Laufende App (Frontend http://localhost:3300, Backend 3301) mit Demodaten, angemeldet als «Vera Verwalter». Desktop (1440 × 900), **nur Tastatur**: Tab, Shift+Tab, Pfeiltasten, Leertaste, Enter, Tippen über `page.keyboard`; kein Mausklick, kein `page.click`. Einzige Adresse, die ich direkt aufgerufen habe: die Startseite `/` (wie Sven, der Dwello aus seinen Lesezeichen öffnet).

Was «angesagt» wird, leite ich ab aus:
- dem Element mit Fokus (`document.activeElement`): Rolle, Name, Beschreibung über `aria-describedby`, `aria-invalid`, `aria-errormessage`;
- einem MutationObserver auf allen Live-Regionen (`aria-live`, `role="status"`, `role="alert"`), der bei jedem Seitenladen und vor jedem Schritt installiert wird;
- dem Accessibility-Tree (`ariaSnapshot`) für das, was Sven im Lesemodus mit den Pfeiltasten hören würde.

**Kein echter Screenreader** (kein NVDA, JAWS oder VoiceOver). Wie ein echter Screenreader Doppelansagen, das Einfügen gefüllter Live-Regionen oder lange Beschreibungen behandelt, ist geschätzt, nicht gehört.

Gearbeitet nur in der **Seepark Residenz**. Vor jeder Änderung habe ich den Namen geprüft: auf der Detailseite die Überschrift «Mietvertrag von Thomas Weber» bzw. «Mietvertrag von Marco Bernasconi», im Dialog den Titel «Mietvertrag von Thomas Weber, Wohnung A1, beenden?» bzw. «Mietvertrag von Marco Bernasconi, Wohnung B2, beenden?».

Ausgangslage Übersicht vor dem Lauf: «Seepark Residenz 3/4 vermietet 75.0 %», «9 Vermietet», «4 Leer», «7 Entwurf».

## Die Aufgaben

1. «Thomas Weber (Seepark Residenz) hat gekündigt, auf Ende Januar 2027. Ich öffne seinen Mietvertrag und ändere ihn unter «Bearbeiten».» (absichtlich über «Bearbeiten» begonnen)
2. «Marco Bernasconi (Wohnung B2, Seepark Residenz) ist am 30.09.2025 ausgezogen, das habe ich vergessen. Tragen Sie es ein und sorgen Sie dafür, dass die Abrechnung 2025 stimmt.»
3. «Was steht jetzt in der Übersicht für die Seepark Residenz?»

### Aufgabe 1: Kündigung Thomas Weber über «Bearbeiten»

1. Übersicht → Tab ×9 zu «Mietverträge», Enter. Angesagt (Routenansage, assertive): «Mietverträge - Dwello». Fokus auf `body`.
2. Sprunglink «Zum Inhalt springen», Tab ×2 ins Suchfeld. Angesagt: «Suche», Beschreibung «Name des Mieters, Wohnungsnummer oder Gebäude». «Weber» getippt, Enter. **Fokus springt auf die Ergebnisüberschrift «1 Mietvertrag»**: sehr gut, ich weiss sofort, dass es genau einen Treffer gibt.
3. Tab: «Thomas Weber, Link»; Tab: «Mietvertrag von Thomas Weber bearbeiten, Link». Enter. Angesagt: «Mietvertrag bearbeiten - Dwello».
4. Im Formular Tab durch alle Felder: Brotkrümel, «Mieter» (Beschreibung «Die Person, die die Wohnung mietet.»), «Wohnung», «Vertragsbeginn» (Beschreibung inkl. «Freitag, 1. April 2022»), Kalenderknopf, Radio «Unbefristet» (Beschreibung «Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird.»), «Nettomiete pro Monat», «Akonto …». **Kein Wort über Kündigung oder «Beenden»**, solange «Unbefristet» gewählt ist. Der Absatz «Laufender Mietvertrag – Änderungen an einem laufenden Mietvertrag gelten sofort. Bei Mietanpassungen …» ist nur im Lesemodus hörbar und hilft hier nicht.
5. Ich denke: «Gekündigt heisst, er hat jetzt ein Ende» und wähle mit Pfeil runter **«Befristet»**. Angesagt: «Befristet, Optionsfeld, ausgewählt, Der Mietvertrag endet an einem festen Tag, ohne Kündigung.» Erst jetzt erscheinen das Feld «Vertragsende» und darunter der Hinweis «Hat der Mieter gekündigt? Dann tragen Sie das Vertragsende auf der Seite des Mietvertrags mit «Beenden» ein. So bleibt er unbefristet, und Dwello nennt die nächsten Schritte.» mit dem Link «Zum Mietvertrag». **Der Hinweis wird beim Erscheinen nicht angesagt** (keine Live-Region feuert).
6. Tab: «Vertragsende», Beschreibung nur «Letzter Tag des Mietverhältnisses. Format TT.MM.JJJJ. Beispiel: 31.12.2026» (der Hinweis ist **nicht** Teil der Beschreibung). Tab: «Kalender für Vertragsende öffnen». Tab: **«Zum Mietvertrag, Link»**, ohne Beschreibung. Mit Tab allein höre ich nur diesen Linknamen; was er mit meiner Kündigung zu tun hat, erfahre ich nur, wenn ich im Lesemodus eine Zeile zurückgehe. Ich habe den Hinweis im Lesemodus gelesen und bin ihm gefolgt.
7. Enter auf «Zum Mietvertrag»: **der Link funktioniert**, Detailseite «Mietvertrag - Thomas Weber - Dwello». Die nicht gespeicherte Auswahl «Befristet» wird stillschweigend verworfen (gewollt, aber ohne Rückmeldung).
8. Sprunglink, Tab ×3: «Beenden, Schalter». Enter. Dialog «Mietvertrag von Thomas Weber, Wohnung A1, beenden?» (`role="dialog"`, `aria-modal="true"`, beschrieben durch den ganzen Dialoginhalt). **Fokus startet auf «Abbrechen»**: sicher, aber ich muss mit Shift+Tab ×2 zurück ins Feld.
9. «Vertragsende», Beschreibung: «Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht. …». «31.01.2027» getippt. Live (polite): «Sonntag, 31. Januar 2027».
10. Tab ×3 zu «Mietvertrag beenden», Enter. Fokus auf `main`. Live (`role="status"`): **«Der Mietvertrag von Thomas Weber endet am 31.01.2027. Die nächsten Schritte sehen Sie oben auf der Seite.»** Oben steht «Nächste Schritte» mit «Nachmieter erfassen» und «Neue Adresse eintragen». Vertragsende: «Unbefristet, gekündigt auf den 31.01.2027».

**Wie die Kündigung schliesslich eingetragen wurde:** nicht unter «Bearbeiten», sondern über den Hinweis, der erst nach der Wahl von «Befristet» erscheint, dann «Zum Mietvertrag» → «Beenden». Ergebnis korrekt: unbefristet, gekündigt.

### Aufgabe 2: Vergessener Auszug Marco Bernasconi

1. Brotkrümel «Mietverträge», Sprunglink, Tab ×2 ins Suchfeld, «Bernasconi», Enter, Fokus auf «1 Mietvertrag», Tab, Enter. Angesagt: «Mietvertrag - Marco Bernasconi - Dwello».
2. Sprunglink, Tab ×3 zu «Beenden», Enter. Dialog «Mietvertrag von Marco Bernasconi, Wohnung B2, beenden?», Fokus auf «Abbrechen». Shift+Tab ×2 ins Feld, «30.09.2025» getippt, Tab.
3. Live (polite) direkt nacheinander: «Dienstag, 30. September 2025» und **«Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr. Bestätigen Sie das Vertragsende mit dem Kästchen.»** Neu erscheint das Kästchen «Der Mietvertrag endete am 30.09.2025.» mit der Beschreibung «Seit dem 01.10.2025 gilt die Wohnung als nicht vermietet, wenn kein neuer Mietvertrag begonnen hat. Die Nebenkosten dieser Zeit trägt der Vermieter, das Akonto des Mieters zählt nur bis zum Vertragsende.» Gut: die Folge wird genannt. Leertaste, Tab ×2, Enter auf «Mietvertrag beenden».
4. **Ablehnung:** Der Fokus springt auf die Meldung (`role="alert"`, mit `tabindex`), angesagt: «Das hat nicht geklappt. Die Nebenkostenabrechnung NK-22222222-2025-0004 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.» **Die Ablehnung nimmt den Fokus: ja.** Die Abrechnungsnummer wird Ziffer für Ziffer vorgelesen («N K Strich 2 2 2 2 2 2 2 2 Strich 2025 …») und sagt mir nicht, wessen Abrechnung es ist; der Dialogtitel nennt aber Marco Bernasconi.
5. Darunter neu: Link «Nebenkostenabrechnung NK-22222222-2025-0004 öffnen», Absatz «Der Entwurf NK-22222222-2025-0004 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» und Schalter «Entwurf löschen und Mietvertrag beenden». Der alte Schalter «Mietvertrag beenden» bleibt daneben aktiv.
6. **Tastaturfalle:** Von der Meldung aus führt Tab nicht weiter nach unten, sondern zurück an den Anfang des Dialogs («Vertragsende»). Weiter mit Tab: Kalender, Kästchen, Link «Nebenkostenabrechnung NK-22222222-2025-0004 öffnen» … und dort **bleibt der Fokus stehen**. Tab ×4 hintereinander: jedes Mal wieder «Nebenkostenabrechnung NK-22222222-2025-0004 öffnen». Mit Tab allein komme ich nie zu «Entwurf löschen und Mietvertrag beenden», «Abbrechen» oder «Mietvertrag beenden». Erst Shift+Tab rückwärts über den Dialoganfang hinaus (Vertragsende → «Mietvertrag beenden» → «Abbrechen» → «Entwurf löschen …») führt zum Ziel. Das findet Sven nur durch Zufall oder Ausprobieren.
7. Fokus auf «Entwurf löschen und Mietvertrag beenden, Schalter», **Beschreibung: «Der Entwurf NK-22222222-2025-0004 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.»** Die Folge wird also über `aria-describedby` genannt. Enter.
8. Neue Seite «Abrechnungen erstellen - Dwello» (assertive), **Fokus auf der Überschrift h1 «Abrechnungen erstellen»**. Gleichzeitig Live (`role="status"`): «Entwurf NK-22222222-2025-0004 gelöscht. Der Mietvertrag von Marco Bernasconi endet am 30.09.2025. Erstellen Sie jetzt die Nebenkostenabrechnung neu.» (Toast angesagt; ob die polite-Meldung nach der assertive-Routenansage und der Fokusansage wirklich vorgelesen wird, ist mit einem echten Screenreader zu prüfen.)
9. **Assistent:** Er steht bei «Schritt 3 von 5: Heizprofil und Verwaltungspauschale». Im Lesemodus von der h1 nach unten: Einleitung, «Schritt 3 von 5: Heizprofil und Verwaltungspauschale», Fortschritt «Abrechnungsperiode (erledigt)», «Gebäude (erledigt)», dann **«Gewählt: Seepark Residenz, Abrechnungsperiode 01.01.2025 – 31.12.2025»** und «Heizprofil und Verwaltungspauschale sind wie die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode eingestellt. Prüfen Sie sie und gehen Sie weiter zur Vorschau.» **Ich höre, was übernommen wurde, ohne zurückzugehen: ja** (im Lesemodus; mit Tab allein nicht, die Zeile «Gewählt» hängt an keinem Feld). Mit Tab: «Heizprofil, Auswahl, Heizung + Warmwasser (100%)», Beschreibung rund 700 Zeichen lang (Mieterwechsel, Zählerstände, Heizkostenverteiler …); «Verwaltungspauschale in %», Wert 3, ebenfalls lange Beschreibung.
10. «Weiter»: Fokus auf «Schritt 4 von 5: Vorschau», Live «Vorschau wird berechnet …». Das Ergebnis selbst wird nicht angesagt; im Lesemodus: «Anzahl Abrechnungen 1», «Kosten aller Abrechnungen CHF 2’301.36», «Heizprofil Heizung + Warmwasser», «Verwaltungspauschale 3 % …», «Es gibt schon Abrechnungen … schon 3 Nebenkostenabrechnungen», Kästchen «Die Abrechnungen trotzdem erstellen», «Marco Bernasconi Wohnung B2 Kosten CHF 2’301.36 Rückerstattung CHF 38.65».
11. «Weiter» ohne Kästchen: Fokus springt auf das Kästchen, `aria-invalid="true"`, Beschreibung beginnt mit «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Gut gelöst. Aber «trotzdem» irritiert: Dwello hat mich gerade selbst hierher geschickt. Leertaste, Tab ×2, Enter.
12. «Schritt 5 von 5: Erstellen», Fokus auf der Schrittüberschrift. Live: **«Entwurf gespeichert, 19:39»**. Ich denke: «Ist die Abrechnung schon erstellt?» Nein, das ist das Zwischenspeichern des Assistenten. Text: «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt.» Tab ×2 zu «Entwürfe erstellen», Enter.
13. Live: «Entwürfe werden erstellt …». Dann erscheint «1 Nebenkostenabrechnung ist als Entwurf erstellt.» in einem neu eingefügten `role="status"`; mein Observer hat dafür **keine Änderung einer bestehenden Live-Region** gesehen, und der Fokus bleibt auf derselben Überschrift «Schritt 5 von 5: Erstellen», die deshalb nicht neu angesagt wird. Ob Sven den Erfolg hört, ist unsicher.
14. Kontrolle: «Entwürfe ansehen» → Liste, Filter «7 Entwurf» mit `aria-current`. Erster Eintrag «Marco Bernasconi NK-22222222-2025-0004», «Seepark Residenz, Wohnung B2 01.01.2025 – 31.12.2025», «Rückerstattung CHF 38.65». Detailseite: «Mietstage in der Abrechnungsperiode: 273 Mietstage» (01.01.–30.09.2025 stimmt), «Geleistete Akontobeiträge − CHF 2’340.00» (9 Monate), «Saldo: Rückerstattung CHF 38.65». Verlauf: «Erstellt 12.10.2026, 21:39», die Meldung im Assistenten sagte «19:39».

### Aufgabe 3: Übersicht für die Seepark Residenz

Tab ×5 zu «Übersicht», Enter. Fokus auf `body`, angesagt «Übersicht - Dwello». Im Lesemodus:
- «Als Nächstes zu tun»: «Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Alpenblick.» (Seepark Residenz gilt als abgerechnet), «Abrechnungen prüfen und versenden: 7 Nebenkostenabrechnungen sind noch im Entwurf.», «Nachmieter für Wohnung 1.02 suchen» (Anna Schmidt, nicht von mir), **«Nachmieter für Wohnung B2 suchen. Der Mietvertrag von Marco Bernasconi endet am 30.09.2025. …»** und **«Nachmieter für Wohnung A1 suchen. Der Mietvertrag von Thomas Weber endet am 31.01.2027. …»**, jeweils mit Link «Mietvertrag erfassen».
- «Vermietete Wohnungen pro Gebäude»: **«Seepark Residenz 2/4 vermietet 50.0 %»** (vorher 3/4, 75.0 %). Gesamt «7 Vermietet», «6 Leer» (auch durch andere Tester verändert).

Was fehlt: Die Aufgaben nennen nur «Wohnung B2» und «Wohnung A1», nicht das Gebäude; dass beide in der Seepark Residenz liegen, muss ich mir merken. Für Thomas Weber fehlt der Schritt «Neue Adresse eintragen», den die Vertragsseite noch nannte. Der Link «Mietvertrag erfassen» kommt viermal mit genau diesem Namen vor (drei Aufgaben und «Häufige Arbeiten»); in der Linkliste des Screenreaders sind sie nicht zu unterscheiden. Bis zum Link «Seepark Residenz» sind es mit Tab 24 Tabstopps im Inhalt.

## Geänderte Daten

- **Thomas Weber, Wohnung A1, Seepark Residenz:** mit «Beenden» gekündigt auf den **31.01.2027**. Jetzt «Laufend, Vertragsende: Unbefristet, gekündigt auf den 31.01.2027». (Unter «Bearbeiten» kurz «Befristet» gewählt, **nicht gespeichert**.)
- **Marco Bernasconi, Wohnung B2, Seepark Residenz:** mit «Beenden» Vertragsende **30.09.2025**, Kästchen «Der Mietvertrag endete am 30.09.2025.» bestätigt, «Entwurf löschen und Mietvertrag beenden».
- **Gelöscht:** Entwurf NK-22222222-2025-0004 (Marco Bernasconi, 2025, alte Berechnung über das ganze Jahr).
- **Neu erstellt:** Entwurf NK-22222222-2025-0004 (gleiche Nummer, neue Abrechnung) für Marco Bernasconi, Seepark Residenz, Abrechnungsperiode 01.01.2025 – 31.12.2025, 273 Mietstage, Gesamtkosten CHF 2’301.36, Rückerstattung CHF 38.65, Heizprofil «Heizung + Warmwasser», Verwaltungspauschale 3 %. Kästchen «Die Abrechnungen trotzdem erstellen» dafür bestätigt; die übrigen 3 Abrechnungen der Seepark Residenz blieben unverändert.
- **Ausserhalb der Seepark Residenz nichts geändert.** Gesehen, aber nicht von mir: Aufgabe «Nachmieter für Wohnung 1.02 suchen» (Anna Schmidt, Musterhaus Zentrum).

## Aufgabe geschafft

1. **Kündigung Thomas Weber: teilweise.** Das Ergebnis stimmt (unbefristet, gekündigt auf den 31.01.2027, nächste Schritte angesagt). Unter «Bearbeiten» gibt es aber keinen Weg dorthin, solange «Unbefristet» gewählt ist; der Hinweis auf «Beenden» erscheint erst, nachdem ich das Falsche gewählt habe («Befristet»), wird dabei nicht angesagt und ist mit Tab nur als «Zum Mietvertrag, Link» hörbar (M1). Wer den Hinweis überhört, speichert einen befristeten Vertrag.
2. **Auszug Marco Bernasconi und Abrechnung 2025: ja, aber nur mit Glück.** Vergangenheitswarnung, Ablehnung mit Fokus, Folge an «Entwurf löschen …» und die Übernahme im Assistenten funktionieren. Die Tastaturfalle am Link «Nebenkostenabrechnung … öffnen» (B1) hätte Sven ohne Shift+Tab-Ausprobieren gestoppt; der Erfolg am Ende wird kaum angesagt (M2).
3. **Übersicht: ja.** Beide Änderungen sind sichtbar (zwei Aufgaben «Nachmieter suchen», «Seepark Residenz 2/4 vermietet 50.0 %»), aber ohne Gebäudenamen in den Aufgaben und mit vier gleichnamigen Links (m4, m5).

## Aufwand (Tastendrücke)

Gemessen (inkl. Erkundung und Fehlversuche): Aufgabe 1 **63**, Aufgabe 2 **107** (davon rund 30 für das Austesten der Tastaturfalle, Herumhören im Assistenten und Kontrolle), Aufgabe 3 **6** plus Lesen. Das Lesen im Lesemodus (Pfeiltasten) ist nicht mitgezählt. Getippte Zeichen zählen je als eine Taste.

| Schritt | Tasten |
|---|---|
| Übersicht → «Mietverträge» (Tab ×9, Enter) | 10 |
| Sprunglink, Tab ×2 ins Suchfeld, «Weber», Enter | 10 |
| Tab ×2 zu «… bearbeiten», Enter | 3 |
| Formular: Sprunglink, Tab ×9 durch alle Felder | 11 |
| Shift+Tab ×2 zur Vertragsdauer, Pfeil runter «Befristet» | 3 |
| Tab ×3 zu «Zum Mietvertrag», Enter | 4 |
| Detailseite: Sprunglink, Tab ×3 zu «Beenden», Enter | 6 |
| Dialog: Shift+Tab ×2 ins Feld, «31.01.2027», Tab ×3, Enter | 16 |
| **Total Aufgabe 1** | **63** |
| Brotkrümel → Liste, Suche «Bernasconi», Tab, Enter | 19 |
| Sprunglink, Tab ×3 zu «Beenden», Enter | 6 |
| Shift+Tab ×2, «30.09.2025», Tab ×3 (zu weit), Shift+Tab zum Kästchen, Leertaste, Tab ×2, Enter | 20 |
| Nach der Ablehnung: kürzester Weg zu «Entwurf löschen …» (Tab, Shift+Tab ×3), Enter | 5 |
| (Mit Tab allein: nicht erreichbar, Fokus bleibt am Link hängen) | ∞ |
| Assistent Schritt 3: Tab ×6 zu «Weiter», Enter | 7 |
| Schritt 4: Tab ×3 … «Weiter» ohne Kästchen (Fehler), Leertaste, Tab ×2, Enter | 10 |
| Schritt 5: Tab ×2, Enter | 3 |
| **Kürzester Weg Aufgabe 2 (ohne Kontrolle)** | **≈ 70** |
| Kontrolle: «Entwürfe ansehen», Sprunglink, Tab ×10, Enter | 15 |
| Aufgabe 3: Tab ×5 zu «Übersicht», Enter | 6 |
| Übersicht: Tab bis zum Link «Seepark Residenz» (statt Lesemodus) | 26 |

## Laut gedacht

- «Suche ‹Weber›, Enter, ‹1 Mietvertrag›. Schön, ich bin gleich beim Ergebnis.»
- «Bearbeiten … Mieter, Wohnung, Vertragsbeginn, unbefristet, ‹läuft, bis er gekündigt wird›. Ja, er ist ja gekündigt. Wo trage ich das ein? Dann muss ich wohl ‹Befristet› nehmen.»
- «Befristet, ‹endet an einem festen Tag, ohne Kündigung›. Hm, ohne Kündigung? Er hat doch gekündigt. Tab: Vertragsende. Tab: Kalender. Tab: ‹Zum Mietvertrag, Link›. Was soll ich dort? Ich gehe eine Zeile zurück … ach so, ‹Hat der Mieter gekündigt? … mit Beenden›. Das hätte mir Dwello vorher sagen können.»
- «Beenden, Dialog, ‹Abbrechen›. Warum stehe ich auf Abbrechen? Zurück ins Feld.»
- «‹Sonntag, 31. Januar 2027›, gut, das Datum stimmt.» – «‹Der Mietvertrag von Thomas Weber endet am 31.01.2027. Die nächsten Schritte sehen Sie oben auf der Seite.› Klar.»
- «30.09.2025 … ‹über ein Jahr zurück. Prüfen Sie das Jahr.› Ja, ich weiss, ich habe es vergessen. Kästchen an.»
- «‹Das hat nicht geklappt. Die Nebenkostenabrechnung N K Strich 2 2 2 2 2 2 2 2 …›. Welche Abrechnung? Ah, Entwurf, mit den alten Daten. Ich soll ihn löschen. Wo ist der Knopf?»
- «Tab, Tab, Tab … ‹Nebenkostenabrechnung … öffnen›, ‹… öffnen›, ‹… öffnen›. Ich komme nicht weiter. Ist die Seite abgestürzt? Escape würde alles schliessen. Ich versuche Shift+Tab … ‹Mietvertrag beenden›, ‹Abbrechen›, ‹Entwurf löschen und Mietvertrag beenden – Der Entwurf … wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.› Endlich.»
- «‹Abrechnungen erstellen›. Bin ich jetzt bei Schritt 1? Ich lese weiter: Schritt 3, ‹Gewählt: Seepark Residenz, 01.01.2025 – 31.12.2025›. Gut, das passt.»
- «Heizprofil … (lange Pause) … ich habe nach dem dritten Satz aufgehört zuzuhören.»
- «‹Die Abrechnungen trotzdem erstellen›? Trotzdem? Ich mache doch genau das, was Dwello gesagt hat.»
- «‹Entwurf gespeichert, 19:39›. Fertig? Nein, es gibt noch Schritt 5 … Und jetzt ‹Entwürfe werden erstellt …› und dann? Stille. Hat es geklappt?»
- «Übersicht: ‹Nachmieter für Wohnung B2 suchen›, ‹Nachmieter für Wohnung A1 suchen›. Welche Häuser waren das nochmal? Und ‹Seepark Residenz 2/4 vermietet›. Das stimmt.»

## Verwirrung inkl. Begriffe

- **«Befristet» vs. «gekündigt»:** Die Beschreibung von «Unbefristet» («läuft, bis er gekündigt wird») legt nahe, dass eine Kündigung im Formular eingetragen wird. Unter «Bearbeiten» ist «Befristet» die einzige Stelle mit einem Vertragsende.
- **«Zum Mietvertrag»:** Als Linkname allein sagt er nicht, dass dort «Beenden» wartet; ich bin ja schon «beim Mietvertrag».
- **«Entwurf» doppelt belegt:** «Entwurf gespeichert, 19:39» (Zwischenstand des Assistenten) und «Entwurf» als Status der Nebenkostenabrechnung. Kurz vor «Entwürfe erstellen» verwechselbar.
- **«trotzdem»** im Kästchen «Die Abrechnungen trotzdem erstellen», obwohl Dwello mich nach dem Löschen genau dorthin geführt hat.
- **Abrechnungsnummer «NK-22222222-2025-0004»:** Für einen Screenreader eine lange Ziffernfolge; Mieter und Wohnung fehlen in der Ablehnung, im Link und in der Beschreibung des Schalters. Die neue Abrechnung bekommt wieder dieselbe Nummer; ob das die alte oder die neue ist, kann ich nicht unterscheiden.
- **«Das hat nicht geklappt»:** Allgemeiner Titel; erst der zweite Satz sagt, was los ist.
- **Uhrzeit:** Assistent «Entwurf gespeichert, 19:39», Abrechnung «Erstellt 12.10.2026, 21:39». Zwei Stunden Unterschied für denselben Vorgang.
- **Abrechnungsperiode der Abrechnung:** Kopf und Liste sagen «01.01.2025 – 31.12.2025», erst ganz unten steht «273 Mietstage». Dass nur bis 30.09.2025 abgerechnet ist, höre ich spät.

## Fehlerrisiken

- **Befristung statt Kündigung:** Wer den Hinweis unter «Befristet» überhört (er wird nicht angesagt und hängt an keinem Feld), gibt 31.01.2027 ein und speichert einen befristeten Mietvertrag. Folgen laut Dwello selbst: keine «nächsten Schritte», falsche Vertragsart.
- **Abbruch in der Falle:** In der Tastaturfalle drückt Sven sehr wahrscheinlich Escape oder lädt neu. Dann ist der Mietvertrag nicht beendet, die Abrechnung 2025 mit 365 statt 273 Tagen bleibt bestehen und wird womöglich so versendet.
- **Alter Schalter aktiv:** Nach der Ablehnung bleibt «Mietvertrag beenden» aktiv; ein zweites Enter darauf führt nur wieder zur gleichen Ablehnung.
- **Erfolg unklar:** Weil «1 Nebenkostenabrechnung ist als Entwurf erstellt.» kaum angesagt wird, startet Sven den Assistenten eventuell nochmals oder sucht lange.
- **Lange Beschreibungen:** Bei «Heizprofil» (rund 700 Zeichen) und «Verwaltungspauschale» hört Sven nicht bis zum Ende zu; die wichtigen Sätze (Zähler abgelesen → ausserhalb von Dwello abrechnen) gehen verloren.

## Vorschläge

### Blocker

- **B1 – Tastaturfalle im Dialog «Beenden» nach der Ablehnung.** Wo: Dialog «Mietvertrag von Marco Bernasconi, Wohnung B2, beenden?», nach «Das hat nicht geklappt …». Was angesagt wurde: Tab ab der Meldung springt zurück zu «Vertragsende»; nach «Kalender …» und dem Kästchen landet der Fokus auf «Nebenkostenabrechnung NK-22222222-2025-0004 öffnen, Link» und bleibt dort bei jedem weiteren Tab (4 × gleiche Ansage). «Entwurf löschen und Mietvertrag beenden», «Abbrechen» und «Mietvertrag beenden» sind nur rückwärts über Shift+Tab erreichbar. Vorschlag: Die Fokusfalle des Dialogs muss die nach dem Öffnen eingefügten Elemente (Link, neuer Schalter) kennen; Tab ab der Meldung soll zum Link und dann zu «Entwurf löschen …» gehen. Am besten den Fokus nach der Ablehnung direkt auf die Meldung setzen und «Entwurf löschen …» als nächsten Tabstopp anbieten.

### Major

- **M1 – Unter «Bearbeiten» fehlt der Weg zu «Beenden», solange «Unbefristet» gewählt ist; der Hinweis erscheint erst nach der falschen Wahl und wird nicht angesagt.** Wo: «Mietvertrag bearbeiten», Thomas Weber. Was angesagt wurde: «Unbefristet … Er läuft, bis er gekündigt wird.»; nach Pfeil runter «Befristet … ohne Kündigung», dann nichts zum neuen Hinweis; Tab: «Vertragsende» (Beschreibung ohne Hinweis), «Kalender …», «Zum Mietvertrag, Link». Vorschlag: Hinweis «Hat der Mieter gekündigt? … «Beenden»» immer zeigen (z. B. bei der Vertragsdauer) und per `aria-describedby` an die Radiogruppe bzw. an «Befristet» hängen; Link sprechend benennen, z. B. «Kündigung mit «Beenden» eintragen».
- **M2 – Erfolg im Assistenten kaum angesagt.** Wo: «Abrechnungen erstellen», Schritt 5 nach «Entwürfe erstellen». Was angesagt wurde: «Entwürfe werden erstellt …», danach nichts; «1 Nebenkostenabrechnung ist als Entwurf erstellt.» steht in einem neu eingefügten `role="status"`, der Fokus bleibt auf «Schritt 5 von 5: Erstellen» (nicht neu angesagt). Vorschlag: Ergebnis in die bestehende Live-Region schreiben, die schon «Entwürfe werden erstellt …» angesagt hat, oder den Fokus auf die Erfolgsmeldung setzen.
- **M3 – Ablehnung und Löschangebot nennen nur die Nummer, nicht Mieter und Wohnung.** Wo: Dialog «… beenden?», Meldung, Link und Beschreibung von «Entwurf löschen …». Was angesagt wurde: «Die Nebenkostenabrechnung NK-22222222-2025-0004 (Entwurf) …», «Der Entwurf NK-22222222-2025-0004 wird gelöscht. …». Vorschlag: «Der Entwurf der Abrechnung 2025 von Marco Bernasconi, Wohnung B2 (NK-…) wird gelöscht.» Bei einer Löschung muss Sven hören, was verschwindet, ohne eine Ziffernfolge zu entschlüsseln.

### Minor

- **m1 – Fokus im Dialog «Beenden» startet auf «Abbrechen».** Wo: beide Dialoge. Angesagt: Dialogtitel, dann «Abbrechen, Schalter». Das einzige Feld liegt zwei Shift+Tab zurück. Vorschlag: Fokus ins Feld «Vertragsende» (die Bestätigung ist ja erst der Schalter «Mietvertrag beenden»).
- **m2 – «Die Abrechnungen trotzdem erstellen» nach dem geführten Löschen.** Wo: Assistent, Schritt 4. Angesagt: «Für Seepark Residenz gibt es … schon 3 Nebenkostenabrechnungen …», bei «Weiter» Fehler «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Vorschlag: Wenn der Assistent aus «Entwurf löschen …» kommt, den Satz anpassen, z. B. «Für 3 Mietverträge gibt es schon Abrechnungen; erstellt wird nur die fehlende für Marco Bernasconi.»
- **m3 – «Entwurf gespeichert, 19:39» im Assistenten.** Wo: Schritt 5, Live-Region. Verwechselbar mit dem Status «Entwurf» der Abrechnung; Uhrzeit weicht zwei Stunden von «Erstellt 12.10.2026, 21:39» ab (Zeitzone). Vorschlag: «Eingaben gespeichert» und Ortszeit.
- **m4 – Aufgaben in der Übersicht ohne Gebäudenamen.** Wo: «Als Nächstes zu tun». Angesagt: «Nachmieter für Wohnung B2 suchen», «Nachmieter für Wohnung A1 suchen». Vorschlag: «Wohnung B2, Seepark Residenz».
- **m5 – Vier gleichnamige Links «Mietvertrag erfassen».** Wo: Übersicht (drei Aufgaben, «Häufige Arbeiten»). In der Linkliste ununterscheidbar. Vorschlag: «Nachmieter für Wohnung B2 erfassen» o. ä.
- **m6 – Sehr lange Feldbeschreibungen im Assistenten.** Wo: Schritt 3, «Heizprofil» (rund 700 Zeichen) und «Verwaltungspauschale». Wird bei jedem Fokus komplett vorgelesen. Vorschlag: Beschreibung auf einen Satz kürzen, Rest als Text unter dem Feld (im Lesemodus erreichbar).
- **m7 – «Neue Adresse eintragen» fehlt in der Übersicht.** Wo: Übersicht nach der Kündigung von Thomas Weber; die Vertragsseite nannte es noch als nächsten Schritt. Vorschlag: Als Aufgabe übernehmen, solange die Adresse fehlt.
- **m8 – Abrechnungsperiode der neuen Abrechnung.** Wo: Liste und Kopf der Abrechnung Marco Bernasconi: «01.01.2025 – 31.12.2025»; die Mietdauer bis 30.09.2025 erst unten als «273 Mietstage». Vorschlag: Im Kopf «Mietvertrag bis 30.09.2025» ergänzen.

## Was gut funktioniert

- Suche setzt den Fokus auf die Ergebnisüberschrift («1 Mietvertrag»).
- Datumsfelder sagen den Wochentag an («Sonntag, 31. Januar 2027»).
- Vergangenheitswarnung mit Kästchen und Folge in der Beschreibung.
- Ablehnung nimmt den Fokus (`role="alert"`).
- «Entwurf löschen und Mietvertrag beenden» nennt seine Folge über `aria-describedby`.
- Der Assistent springt zu Schritt 3 und sagt im Lesemodus «Gewählt: Seepark Residenz, Abrechnungsperiode 01.01.2025 – 31.12.2025».
- Pflichtkästchen in Schritt 4: Fokus, `aria-invalid`, Fehler in der Beschreibung.
- Toast nach «Beenden» nennt Ergebnis und wo die nächsten Schritte stehen.
