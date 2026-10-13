# Persona-Lauf: Marco – Mietverträge einer Wohnung laden nicht (B13, «Erneut versuchen»)

Persona: Marco, 38, angestellt, macht alles auf dem Handy zwischendurch. Gerät: Mobile 390 × 844, Touch. App: http://localhost:3300 mit Demodaten.
Simulierter Fehler: Die Anfrage `GET /api/contracts?apartmentId=<id>` antwortet für eine Wohnung mit Status 500, bis «jetzt geht es wieder» (`page.unrouteAll()`).
- Aufgabe 1 (neuer Mietvertrag): Wohnung 3.02 – Musterhaus Zentrum (`aaaa1111-1111-1111-1111-666666666666`)
- Aufgabe 2 (Mietvertrag bearbeiten, Nina Brunner, Wohnung A2): Wechsel auf Wohnung 2.02 – Musterhaus Zentrum (`aaaa1111-1111-1111-1111-444444444444`)

Skripte und Screenshots: `/tmp/claude-0/persona-marco/` (nicht im Repository).

## Aufgabe geschafft: ja

- Aufgabe 1: ja. Der Mietvertrag Laura Keller, Wohnung 3.02, ab 01.11.2026, Nettomiete CHF 1'200.00 und Akonto CHF 150.00 ist gespeichert. Die Meldung «Mietvertrag von Laura Keller gespeichert» ist erschienen.
- Aufgabe 2: ja. Nach «Erneut versuchen» waren alle meine Eingaben noch da. Gespeichert habe ich bewusst nicht, weil ich den Demo-Mietvertrag von Nina Brunner für die anderen Personas nicht verändern wollte.

## Aufwand

| | Zeit (geschätzt, als Mensch) | Taps | Scrollen |
|---|---|---|---|
| Aufgabe 1 | ca. 3 Minuten | 12 (Mieter, Weiter, Wohnung, Weiter, Datum, Weiter, Nettomiete, Akonto, Weiter, Erneut versuchen, Mietvertrag speichern, dazu 1 Tap auf «Erneut versuchen», solange es noch nicht ging) | Bei Schritt 2, 3 und 5 musste ich jedes Mal am Hinweis vorbei nach unten zu «Weiter» oder «Mietvertrag speichern» scrollen. Bei Schritt 5 liegt «Erneut versuchen» knapp unter dem Bildschirmrand (Oberkante y = 855 bei 844 px Höhe). |
| Aufgabe 2 | ca. 1,5 Minuten | 6 (Bearbeiten, Wohnung, Vertragsbeginn, Nettomiete, Erneut versuchen, dazu 1 Tap ins Datumsfeld) | Vom Feld Nettomiete zurück zum Knopf «Erneut versuchen» waren es rund 1'100 px nach oben, also gut eine Bildschirmhöhe. |

## Ablauf: erwartet und gesehen

### Aufgabe 1: Neuer Mietvertrag

1. **Übersicht → «Mietvertrag erfassen»** (unter «Häufige Arbeiten»).
   Erwartet: Assistent für einen neuen Mietvertrag. Gesehen: «Neuer Mietvertrag», «Schritt 1 von 5: Mieter», Auswahlliste «Mieter». Passt.
2. **Mieter «Laura Keller, Interlaken» wählen, «Weiter».**
   Erwartet: Wohnungsauswahl. Gesehen: «Schritt 2 von 5: Wohnung». Freie Wohnungen stehen oben, vermietete sind mit «(nicht verfügbar)» markiert und lassen sich nicht wählen. Unten steht «Entwurf gespeichert, 20:39». Das beruhigt mich.
3. **Wohnung 3.02 wählen (die Mietverträge dieser Wohnung lassen sich nicht laden).**
   Erwartet: Wenn etwas schiefgeht, eine kurze Meldung und ein Knopf. Gesehen (Screenshot `11b-viewport.png`): Direkt unter der Auswahl erscheint ein gelb-brauner Kasten mit Warndreieck. Titel «Überschneidung noch nicht geprüft», darunter der Text «Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten. Beim Speichern prüft Dwello in jedem Fall, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet.» Darunter ein umrandeter Knopf «Erneut versuchen» mit Pfeil-Symbol.
   - Ohne seitliches Scrollen lesbar: ja (Seitenbreite 390 = Fensterbreite).
   - Knopf gut treffbar: ja, 217 × 48 px, mittig, gut mit dem Daumen erreichbar.
   - Text kurz genug: nein. Der Text hat 9 Zeilen. Zwischen zwei Terminen lese ich nur den Titel und den Knopf. Der wichtigste Satz für mich («beim Speichern wird trotzdem geprüft, Sie können weitermachen») kommt ganz am Schluss.
   - «Weiter» liegt jetzt unter dem Bildschirmrand, ich muss scrollen.
4. **«Erneut versuchen» tippen, solange es noch nicht geht.**
   Erwartet: Eine Rückmeldung wie «Wird geladen …» und danach «Hat wieder nicht geklappt». Gesehen: Nichts ändert sich. Bei einer langsamen Antwort (2,5 s) wird der Knopf nur leicht hellblau hinterlegt, ohne Text und ohne Drehsymbol (Screenshot `18-retry-slow.png`). Nach der erneuten 500-Antwort steht genau derselbe Kasten da. Ich weiss nicht, ob mein Tippen überhaupt angekommen ist, und würde noch zwei-, dreimal tippen.
5. **«Weiter» → Schritt 3 «Vertragsdauer».**
   Erwartet: Datumsfeld. Gesehen (`12b-step3-vp.png`): «Vertragsbeginn» mit Hilfe zum Format und Kalender-Knopf. Direkt unter dem Datumsfeld steht derselbe Kasten mit demselben langen Text und nochmals «Erneut versuchen». Die Auswahl «Unbefristet / Befristet» und «Weiter» rutschen dadurch nach unten.
   Wirkung: Beim zweiten Mal lese ich den Text nicht mehr, er stört eher. Gut ist, dass er hier beim Datum steht, denn um das Datum geht es bei einer Überschneidung.
6. **Datum 01.11.2026 eintippen.**
   Gesehen: Darunter erscheint «Sonntag, 1. November 2026», sehr hilfreich. Der Kasten bleibt.
7. **«Weiter» → Schritt 4 «Miete»; Nettomiete 1200, Akonto 150.**
   Hier kein Hinweis. «Monatlich total» rechnet mit. Gut.
8. **«Weiter» → Schritt 5 «Prüfen».**
   Erwartet: Zusammenfassung. Gesehen (`15b-step5-vp.png`): Zuerst «Prüfen Sie die Angaben. Mit «Mietvertrag speichern» wird der Mietvertrag erstellt.», dann wieder der ganze Kasten, erst darunter die Zusammenfassung mit den «Ändern»-Links. Der Knopf «Erneut versuchen» liegt knapp unter dem Bildschirmrand.
   Wirkung: Hier hilft die Wiederholung. Kurz vor dem Speichern will ich wissen, dass noch nicht geprüft wurde. Die Zusammenfassung, die ich eigentlich prüfen soll, rutscht aber ganz nach unten.
9. **«Jetzt geht es wieder»: «Erneut versuchen» tippen.**
   Erwartet: Eine kurze Bestätigung wie «Geprüft: keine Überschneidung». Gesehen (`16b-vp.png`): Der Kasten verschwindet einfach, und die Zusammenfassung rutscht hoch an seine Stelle. Es gibt keine positive Meldung, und der Fokus liegt danach auf der Seite selbst, nicht mehr auf einem Element. Weil der Kasten weg ist, schliesse ich, dass es geklappt hat. Sicher bin ich mir nicht.
   Meine Eingaben sind alle noch da (Laura Keller, 3.02, 1. November 2026, CHF 1'200.00 / 150.00, total CHF 1'350.00).
10. **«Mietvertrag speichern».**
    Gesehen (`19b-vp.png`): Ich lande wieder auf «Mietverträge», unten erscheint die Meldung «Mietvertrag von Laura Keller gespeichert». In der Liste steht der neue Mietvertrag «Wohnung 3.02 · Musterhaus Zentrum Künftig ab 01.11.2026, unbefristet». Erledigt.

### Aufgabe 2: Bestehenden Mietvertrag bearbeiten

1. **«Mietverträge» → bei Nina Brunner «Bearbeiten».**
   Gesehen: «Mietvertrag bearbeiten», Hinweis «Laufender Mietvertrag … gelten sofort». Darunter alles auf einer langen Seite: «Mieter und Wohnung», «Vertragsdauer», «Miete», ganz unten «Änderungen speichern».
2. **Etwas hinunterscrollen und die Wohnung auf 2.02 wechseln (die Mietverträge dieser Wohnung lassen sich nicht laden).**
   Erwartet: Hinweis beim Feld, das ich gerade bediene. Gesehen (`21-edit-after-select-vp.png`): Der Kasten erscheint direkt unter der Auswahl «Wohnung», mit demselben langen Text wie im Assistenten. Auswahl, Kasten und Knopf passen gerade zusammen auf den Bildschirm; der Knopf liegt am unteren Rand. Die Seite springt nicht. Gut so.
3. **Weiter zum «Vertragsbeginn» scrollen, Datum auf 01.12.2026 ändern.**
   Gesehen (`22-edit-startdate-vp.png`): Unter dem Datumsfeld steht ein zweiter, kurzer Kasten: «Überschneidung noch nicht geprüft – Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.» Hier gibt es keinen Knopf. Der Knopf «Erneut versuchen» liegt knapp über dem sichtbaren Bereich, ich muss also hochscrollen.
   Verwirrung: «fehlen noch» habe ich zuerst so verstanden, dass ich für diese Wohnung noch Mietverträge erfassen muss. Gemeint ist: Sie konnten nicht geladen werden.
   Gut: Die kurze Fassung hier ist viel angenehmer als die volle Wiederholung im Assistenten.
4. **Weiter zur Nettomiete, auf 1650 ändern.** Funktioniert, «Monatlich total» rechnet mit.
5. **«Jetzt geht es wieder»: zurück zum Knopf scrollen und «Erneut versuchen» tippen.**
   Ich musste von der Nettomiete rund 1'100 px (gut eine Bildschirmhöhe) nach oben scrollen. Nach dem Tippen (`23-edit-after-retry-vp.png`) verschwinden beide Kästen, und weil der obere Kasten wegfällt, rutscht die Seite um mehrere hundert Pixel nach oben: Wo eben mein Daumen auf «Erneut versuchen» lag, sehe ich jetzt plötzlich die Karte «Vertragsdauer». Es gibt keine Bestätigung, und der Fokus liegt danach auf der Seite selbst.
   **Sind meine Eingaben noch da?** Ja: Wohnung 2.02, Vertragsbeginn 01.12.2026 («Dienstag, 1. Dezember 2026»), Nettomiete 1650.
6. Nicht gespeichert (siehe oben).

## Verwirrung (auch Begriffe)

- **«Überschneidung noch nicht geprüft»** als Titel: Zuerst denke ich «welche Überschneidung?». Erst der dritte Satz erklärt, dass es um den Zeitraum mit einem anderen Mietvertrag geht. Der Titel sagt, was Dwello nicht getan hat, aber nicht, was ich tun soll oder ob ich weitermachen darf.
- **«Die Mietverträge dieser Wohnung fehlen noch»** (Bearbeiten, beim Vertragsbeginn): klingt so, als müsste ich Mietverträge erfassen. Gemeint ist «konnten nicht geladen werden».
- **«Wählen Sie «Erneut versuchen»»**: Auf dem Handy wähle ich nicht, ich tippe. Das ist aber nur eine Kleinigkeit.
- **Nach «Erneut versuchen» kommt keine Rückmeldung**, weder beim Laden noch bei einem weiteren Fehlschlag noch bei Erfolg. Ich muss aus dem Verschwinden des Kastens schliessen, dass es geklappt hat.

## Fehlerrisiken

- Ich tippe «Erneut versuchen» mehrmals, weil ich keine Rückmeldung sehe (Schritt 1.4). Das richtet keinen Schaden an, kostet aber Zeit und Nerven. Bei schlechtem Handy-Netz ist das genau der Moment, in dem ich aufgebe.
- Im Bearbeiten-Formular verschiebt sich die Seite nach dem erfolgreichen Laden stark nach oben (Schritt 2.5). Tippe ich danach sofort nochmals an dieselbe Stelle, treffe ich etwas anderes, zum Beispiel die Auswahl «Unbefristet / Befristet» oder den Kalender-Knopf.
- Der lange Text verdeckt im Assistenten (Schritt 3 und 5) die eigentliche Arbeit. Auf Schritt 5 schaue ich die Zusammenfassung vielleicht weniger genau an, weil sie erst nach dem Kasten kommt.
- Gering: Dass beim Speichern trotzdem geprüft wird, steht drin, nur am Schluss. Wer nur den Titel liest, fürchtet vielleicht, er könne jetzt nicht speichern, und bricht ab.

## Vorschläge

1. **Minor – Keine Rückmeldung beim erneuten Laden und bei erneutem Fehlschlag.**
   Bildschirm: Neuer Mietvertrag, Schritt 2 (gilt auch für Schritt 3 und 5 sowie für Bearbeiten).
   Reproduktion: Wohnung 3.02 wählen, während `GET /api/contracts?apartmentId=…666666666666` mit 500 antwortet. «Erneut versuchen» tippen (Antwort verzögert 2,5 s, dann wieder 500).
   Gesehen: Während des Ladens ist der Knopf nur leicht hellblau hinterlegt, ohne Text und ohne Drehsymbol (`18-retry-slow.png`). Danach steht derselbe Kasten unverändert da (`17b-retry-failed-again.png`).
   Vorschlag: Beim Laden «Wird geladen …» auf dem Knopf zeigen und ihn sperren. Bei erneutem Fehlschlag sichtbar machen, dass es wieder nicht geklappt hat, zum Beispiel mit «Wieder nicht geklappt, 20:41».
2. **Minor – Keine Bestätigung nach erfolgreichem Laden; die Seite springt.**
   Bildschirm: Mietvertrag bearbeiten (Nina Brunner), ebenso Neuer Mietvertrag, Schritt 5.
   Reproduktion: Auf 2.02 wechseln (500), dann Fehler aufheben und «Erneut versuchen» tippen.
   Gesehen: Beide Kästen verschwinden ohne Meldung. Der Bildausschnitt zeigt danach statt der Wohnung die Karte «Vertragsdauer» (`23-edit-after-retry-vp.png`). Der Fokus liegt danach auf der Seite selbst, nicht mehr auf einem Element.
   Vorschlag: Kurz eine Erfolgsmeldung an derselben Stelle zeigen («Mietverträge geladen, keine Überschneidung» oder bei einer Überschneidung direkt diese Warnung). Den Fokus auf die Auswahl «Wohnung» setzen, damit nichts springt.
3. **Minor – Der Hinweistext ist für das Handy zu lang und stellt das Wichtigste ans Ende.**
   Bildschirm: Neuer Mietvertrag, Schritt 2, 3 und 5; Bearbeiten unter «Wohnung».
   Reproduktion: Schritt 1.3 oben.
   Gesehen: 3 Sätze, 9 Zeilen bei 390 px (`11b-viewport.png`). «Weiter» wandert unter den Bildschirmrand.
   Vorschlag: Etwa «Die Mietverträge dieser Wohnung konnten nicht geladen werden. Sie können weitermachen; Dwello prüft beim Speichern auf Überschneidungen.» und dazu den Knopf. Den Satz «Ihre Eingaben bleiben erhalten» kann man in den Knopfbereich verschieben oder weglassen.
4. **Minor – Im Assistenten wird in Schritt 3 der volle Text wiederholt.**
   Bildschirm: Neuer Mietvertrag, Schritt 3 «Vertragsdauer» (`12b-step3-vp.png`).
   Gesehen: Wörtlich derselbe lange Kasten mit Knopf wie in Schritt 2. Im Bearbeiten-Formular gibt es dafür eine Kurzfassung.
   Vorschlag: In Schritt 3 eine Kurzfassung mit Knopf (der Knopf ist hier richtig, weil Schritt 2 nicht mehr sichtbar ist). In Schritt 5 den Kasten behalten, aber kürzer und eventuell unter die Zusammenfassung direkt über «Mietvertrag speichern» setzen.
5. **Minor – «fehlen noch» ist missverständlich, und beim Vertragsbeginn fehlt der Knopf.**
   Bildschirm: Mietvertrag bearbeiten, Feld «Vertragsbeginn» (`22-edit-startdate-vp.png`).
   Reproduktion: Auf 2.02 wechseln (500), zum Vertragsbeginn scrollen.
   Gesehen: «Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.», ohne Knopf. Von der Nettomiete aus muss ich rund 1'100 px hochscrollen, um «Erneut versuchen» zu finden.
   Vorschlag: «… konnten nicht geladen werden» statt «fehlen noch». Den Knopf «Erneut versuchen» auch hier anbieten oder «siehe oben» als Sprunglink zum Knopf gestalten.
6. **Nit – «Wählen Sie «Erneut versuchen»»** passt auf Touch nicht ganz. Ein neutraleres «Mit «Erneut versuchen» laden Sie sie nochmals» wäre besser. Bildschirm: alle Kästen.

Keine Blocker oder Major-Befunde: Ich bin in beiden Aufgaben ans Ziel gekommen, nichts ist verloren gegangen, und der Knopf ist gross genug.

## Nicht geprüft

- **Speichern, während die Mietverträge noch nicht geladen sind** (sowohl neu als auch bearbeiten): Das würde die Demodaten verändern und ist nicht Teil der Aufgabe. Ob die versprochene Prüfung beim Speichern greift, habe ich deshalb nicht gesehen.
- **Speichern im Bearbeiten-Formular nach erfolgreichem Laden:** bewusst nicht gemacht, um den gemeinsamen Demo-Mietvertrag von Nina Brunner nicht zu verändern.
- **Der Fall, dass nach erfolgreichem Laden tatsächlich eine Überschneidung besteht:** Die gewählten Wohnungen waren frei, deshalb habe ich nicht gesehen, wie die Warnung dann aussieht.
- **Dunkler Modus, Querformat, Bildschirmleser:** nicht Teil von Marcos Profil.
- Technische Beobachtung am Rand, für mich als Nutzer unsichtbar: Beim erfolgreichen «Erneut versuchen» im Bearbeiten-Formular wurde die Anfrage zweimal abgeschickt (zwei Antworten mit Status 200). Ob das gewollt ist, kann ich nicht beurteilen.
