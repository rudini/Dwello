<!-- Persona rerun F2 on bebb4cd; screenshots stayed in the session's scratchpad -->

# Persona-Test F2: Sven, 45, blind (Screenreader, nur Tastatur), zweiter Lauf

Aufgabe: Im Assistenten «Abrechnungen erstellen» mit der Tastatur bis zur Vorschau gehen (Periode 2025, Gebäude «Seepark Residenz», keine Entwürfe erstellen). In Schritt 3 die Verwaltungspauschale mit «2,5», «4.5», «4,5», leer, «-1» und «abc» prüfen, den Hinweis über 3 % anhören, die Vorschau auf Heizprofil und Pauschale prüfen und einmal von der Vorschau zu Schritt 3 zurückgehen.

Vorgehen: Chromium, Desktop, nur Tastatur. Was ein Screenreader ansagt, habe ich aus dem Accessibility-Tree, dem fokussierten Element (Rolle, Name, Beschreibung über `aria-describedby`, Zustand, Wert) und den Änderungen in den Live-Regionen (`role="status"`) abgeleitet. Jeden Wert habe ich in einem frischen Durchgang geprüft, dazu einen langen Durchgang mit mehreren Werten nacheinander. Screenshots liegen nur im Scratchpad der Sitzung (`personas-f/sven2/*.png`).

## Aufgabe geschafft

**Ja.** Ich bin mit der Tastatur bis zur Vorschau gekommen. Alle sechs Werte verhalten sich jetzt nachvollziehbar: Dezimalzahlen bleiben so stehen, wie ich sie tippe, ungültige Eingaben werden bei «Weiter» als Fehler gemeldet, der Hinweis über 3 % wird angesagt, und die Vorschau nennt Heizprofil und Pauschale. Nach «Zurück» steht mein Satz noch im Feld, allerdings mit Punkt statt Komma.

## Aufwand (Tastendrücke)

| Strecke | Tasten |
|---|---|
| Übersicht → «Abrechnungen erstellen» (Link) | 19 (18× Tab, Enter) |
| Schritt 1 → Schritt 2 | 24 (23× Tab, Enter) |
| Schritt 2: Seepark wählen → Schritt 3 | 8 (3× Tab, Leertaste, 3× Tab, Enter) |
| Schritt 3 → Vorschau, Pauschale ändern | 4× Tab bzw. 2× Tab ins Feld, Ctrl+A, Wert, 2× Tab, Enter |
| Vorschau → «Zurück» → Schritt 3 | 3 (2× Tab, Enter) |

Unverändert gegenüber dem letzten Lauf. Bei jedem Schritt landet der Fokus auf der Schritt-Überschrift, von dort sind es nur wenige Tabs. Gut.

## Laut gedacht

1. **Schritt 1 und 2** wie beim letzten Mal: «Beginn, Eingabe, Pflichtfeld, 01.01.2025, Format TT.MM.JJJJ … Mittwoch, 1. Januar 2025». «Weiter». «Überschrift Ebene 2, Schritt 2 von 5: Gebäude». Drei Tabs, «Seepark Residenz, Seeweg 15, 6003 Luzern, 15 Rechnungen in der Abrechnungsperiode, 4 Wohnungen, Kontrollkästchen, nicht aktiviert», Leertaste, «1 von 3 gewählt». «Weiter».
2. **Schritt 3.** «Überschrift Ebene 2, Schritt 3 von 5: Heizprofil und Verwaltungspauschale». Tab: «Heizprofil, Auswahlliste, Pflichtfeld, Heizung + Warmwasser (100%)», danach wieder der lange Hilfetext von rund 110 Wörtern. Mit Pfeil nach unten wechsle ich auf «Heizung Tessin (100%)»; die Monatsliste darunter ändert sich (Januar 21.5 %), ohne Ansage, aber ich kann sie nachlesen.
3. Tab: **«Verwaltungspauschale in %, Eingabe, Pflichtfeld, 3»**. Das ist jetzt ein normales Textfeld, kein Drehfeld mehr. Die Beschreibung ist ähnlich wie beim letzten Mal; neu ist der Satz «Hat ein Mietvertrag einen anderen Satz, löschen Sie danach seinen Entwurf und erstellen Sie ihn mit diesem Satz neu.»
4. **«2,5»:** Ctrl+A, Backspace: Das Feld ist **leer**, nicht mehr 0. Ich tippe 2, Komma, 5: Jedes Zeichen bleibt, wo ich es tippe, der Cursor springt nicht. Im Feld steht «2,5». «Weiter» → Fokus auf «Schritt 4 von 5: Vorschau». Dort höre ich: «Heizprofil: Heizung + Warmwasser», **«Verwaltungspauschale: 2.5 % der eigenen Nebenkosten jedes Mieters»**. Genau das wollte ich hören. Dass aus meinem Komma ein Punkt wird, merke ich, stört aber nicht.
5. **«4.5»:** Schon beim Tippen der «4» höre ich höflich: **«Über dem üblichen Richtwert. Die Verwaltungspauschale ist höher als der übliche Richtwert von 3 %. Prüfen Sie, ob der Mehraufwand begründet ist.»** Einmal, nicht bei jeder Taste. Im Feld steht «4.5». «Weiter» lässt mich durch, die Vorschau sagt «4.5 % der eigenen Nebenkosten jedes Mieters». Eine Rückfrage gibt es nicht, aber ich habe den Hinweis gehört und sehe den Satz in der Vorschau.
6. **«4,5»:** Gleich wie «4.5»: Hinweis angesagt, Feld «4,5», Vorschau «4.5 %».
7. **Leer:** Feld leer, «Weiter». Der Fokus springt zurück ins Feld: «Verwaltungspauschale in %, Eingabe, Pflichtfeld, **ungültig**, leer», dann die ganze Beschreibung (rund 60 Wörter) und erst danach **«Bitte geben Sie einen Prozentsatz ab 0 ein, zum Beispiel 3.»** Ich bleibe in Schritt 3. Richtig, aber die Fehlermeldung kommt spät.
8. **«-1»:** Das Minus bleibt stehen, im Feld steht «-1». Kein Hinweis beim Tippen. «Weiter» → Fokus zurück ins Feld, «ungültig, -1», gleiche Fehlermeldung am Ende der Beschreibung.
9. **«abc»:** Wird angenommen und angezeigt. «Weiter» → «ungültig, abc», gleiche Fehlermeldung. Gut, dass nichts still umgeschrieben wird.
10. **Weitere Versuche** (aus Neugier): «2,5 %», «2.5.1», «1 000» und «1'000» werden als ungültig gemeldet. « 2,5 » mit Leerzeichen, «3,» und «,5» werden zu 2.5, 3 und 0.5 gelesen, das ist freundlich. **«1e1» wird zu 10 %** ohne Rückfrage. **«100»** geht mit dem Hinweis über 3 % bis in die Vorschau («100 % der eigenen Nebenkosten jedes Mieters»).
11. **Zurück zu Schritt 3.** Aus der Vorschau: 2× Tab («Abrechnungen von Seepark Residenz ansehen», «Zurück»), Enter. Fokus auf «Schritt 3 von 5: Heizprofil und Verwaltungspauschale». Das Heizprofil steht noch auf «Heizung Tessin». Das Feld sagt **«4.5»**, nicht mehr «4,5» wie getippt. Mein Satz ist also noch da, nur umgeschrieben. Dasselbe über den Fortschritts-Knopf «Heizprofil und Verwaltungspauschale (erledigt)». Der Hinweis «Über dem üblichen Richtwert» erscheint wieder, aber er wird mit der ganzen Seite neu eingefügt; ein Screenreader sagt so eingefügte Statusmeldungen meist nicht an. Wenn ich zurück ins Feld tabbe, höre ich ihn ebenfalls nicht, weil er nicht in der Beschreibung des Felds steht.
12. **Statusmeldung «Entwurf gespeichert, 19:10»** kommt weiterhin beim Schrittwechsel, auch wenn der Wert ungültig ist («abc»). Pro Tastendruck wird sie nicht wiederholt, das ist gut.

## Gegenüber dem letzten Lauf

| Befund aus Lauf F | Schwere damals | Jetzt |
|---|---|---|
| Dezimalwerte verfälscht (2,5 → 25, 4.5 → 54) | Blocker | **Behoben.** Komma und Punkt werden angenommen, der Cursor springt nicht, die Vorschau zeigt 2.5 % bzw. 4.5 %. |
| Hinweis über 3 % nicht angesagt | Major | **Behoben** beim Tippen (Live-Region, einmal angesagt). **Offen:** nicht in `aria-describedby`, nach «Zurück» vermutlich nicht angesagt, keine Rückfrage bei «Weiter» (Minor). |
| Vorschau nennt Heizprofil und Pauschale nicht | Major | **Behoben.** «Heizprofil: Heizung Tessin», «Verwaltungspauschale: 4.5 % der eigenen Nebenkosten jedes Mieters». |
| Geleertes Feld wird stillschweigend 0 | Major | **Behoben.** Feld bleibt leer, «Weiter» meldet den Fehler und setzt den Fokus ins Feld. |
| Getipptes Minus verschluckt | Major | **Behoben.** «-1» bleibt stehen und wird bei «Weiter» als ungültig gemeldet. |
| Fehlermeldung steht hinter dem langen Hilfetext | Minor | **Offen.** Weiterhin erst nach rund 60 Wörtern. |
| Heizprofil-Hilfetext rund 110 Wörter | Minor | **Offen.** |
| «Entwurf gespeichert» doppeldeutig, auch bei ungültigem Wert | Minor | **Offen.** |
| «eigene Nebenkosten» (Assistent) vs. «Zwischensumme» (Abrechnung) | Minor | Nicht erneut geprüft (nicht Teil dieses Laufs). |

## Neue Befunde

- **Minor**: **Komma wird zu Punkt.** Ich tippe «4,5», nach «Zurück» steht «4.5» im Feld, die Vorschau sagt «4.5 %». Der Wert stimmt, aber was ich eingegeben habe, steht nicht mehr da. Eine Sprachausgabe liest «4.5» je nach Einstellung als «vier Punkt fünf» oder als Datum.
- **Minor**: **Warnung bei Rückkehr nicht hörbar.** Nach «Zurück» aus der Vorschau wird der Hinweis über 3 % mit dem Schritt neu eingefügt, statt sich in einer bestehenden Live-Region zu ändern. Er steht nicht in der Feldbeschreibung, also höre ich ihn auch beim Fokus aufs Feld nicht.
- **Minor**: **Unplausible Werte ohne Rückfrage.** 100 % gehen mit dem höflichen Hinweis bis in die Vorschau; «1e1» wird still zu 10 % gelesen.
- **Minor**: Die Statusmeldung «Vorschau wird berechnet …» steht nur rund 35 ms in der Live-Region und wird danach geleert. Sie wird wahrscheinlich nie vorgelesen. Da der Fokus danach auf der Vorschau-Überschrift landet, fehlt mir nichts; die Meldung ist aber nutzlos.

## Vorschläge

- **Minor**: Den Hinweis über 3 % zusätzlich in `aria-describedby` des Felds aufnehmen (vor dem Hilfetext), damit er beim Fokus und nach «Zurück» gehört wird.
- **Minor**: Bei Werten über 3 % (oder ab einer klar unplausiblen Grenze, etwa über 10 %) bei «Weiter» einmal nachfragen: «Sie haben 4,5 % eingegeben. Üblich sind bis 3 %. Trotzdem weiter?» «1e1» als ungültig melden.
- **Minor**: Den Wert so anzeigen, wie er getippt wurde, oder einheitlich mit Komma («4,5 %») in Feld und Vorschau.
- **Minor**: Fehlermeldung in `aria-describedby` **vor** den Hilfetext stellen.
- **Minor**: Heizprofil-Hilfetext auf zwei Sätze kürzen, den Rest ausklappbar anbieten.
- **Minor**: Statusmeldung «Eingaben gespeichert» statt «Entwurf gespeichert», und nur gültige Eingaben als gespeichert melden.
- **Minor**: «Vorschau wird berechnet …» nur setzen, wenn die Berechnung spürbar dauert, oder ganz weglassen.
