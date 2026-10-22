# Helga – Nebenkosten ab einem Tag vereinbaren (Runde 368-b)

Persona: Helga, 68, Desktop 1440 × 900, Zoom 150 % (ein Blick bei 200 %), Maus.
Aufgabe: Bei Laura Keller (Alpenblick, Wohnung EG) eintragen, dass sie den Hauswart ab 01.01.2026 bezahlt (mit amtlichem Formular eingeführt), speichern und auf der Seite des Mietvertrags prüfen.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/helga-368-b/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag bearbeiten, Fehlermeldung | Bei einem Tag vor Vertragsbeginn sagt die Meldung unten «Dieser Tag liegt vor dem Vertragsbeginn», aber nicht, welcher der zwölf «Vereinbart ab»-Felder gemeint ist; das Feld selbst ist nicht markiert (kein roter Rahmen, kein Text am Feld). |
| P-2 | Minor | Mietvertrag bearbeiten, «Vereinbart ab»-Felder | Die Beschriftung des nächsten Feldes klebt direkt unter dem Eingabefeld darüber, der Abstand zur eigenen Hilfe ist grösser. Ich wusste beim Hauswart kurz nicht, ob das Datumsfeld zu «Hauswart» oder zu «Allgemeinstrom» gehört. |
| P-3 | Nit | Mietvertrag bearbeiten | «Nebenkosten ab einem Tag vereinbaren» sieht aus wie ein Link und ist eingerückt, nicht bündig mit den Häkchen. Ich habe es erst beim zweiten Lesen als Knopf erkannt, der etwas aufklappt. |

## Beobachtungen

- Hauswart war bei Laura Keller schon angekreuzt, wie alle zwölf Nebenkosten. Laut meiner Geschichte hätte er bisher nicht angekreuzt sein dürfen. Es gab kein freies Häkchen, also habe ich beim schon angekreuzten Hauswart nur den Tag eingetragen. Das passte trotzdem, die Hilfe sagt ja «kreuzen Sie sie dann an und tragen Sie bei ‹Vereinbart ab› den Tag ein».
- Dwello hat auch den 15.01.2026 ohne Rückfrage gespeichert (aus Versehen ausprobiert, danach wieder auf 01.01.2026 gestellt). Beim Akonto verlangt die Hilfe «der Erste eines Monats», hier nicht. Ob ein Tag mitten im Monat für neue Nebenkosten sinnvoll ist, weiss ich nicht. Dwello prüft auch nicht, ob der Tag ein Kündigungstermin ist, obwohl die Hilfe das verlangt.
- Im selben Formular steht bei «Gültig ab» (Akonto) schon «Sonntag, 1. November 2026», obwohl ich am Akonto nichts ändere. Das hat mich verunsichert («ändere ich jetzt auch das Akonto?»). Nach dem Speichern blieb das Akonto CHF 190.00.
- Die Erfolgsmeldung «Mietvertrag von Laura Keller gespeichert» erscheint oben rechts und liegt über dem gelben Kasten «3 Abrechnungen fehlen», neben den Links «Rechnungen … ansehen».
- Beim erneuten Öffnen ist der Bereich schon aufgeklappt und zeigt 01.01.2026. Gut so.
- Bei 200 % kein seitliches Scrollen.
- Der Hinweis «Bestehende Abrechnungen ändern sich dadurch nicht» hat mich beruhigt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 7 Schritte: Menü öffnen, Mietverträge, Laura Keller, Bearbeiten, «Nebenkosten ab einem Tag vereinbaren» aufklappen, Datum beim Hauswart eintragen, Änderungen speichern. Dazu kam die Kontrolle auf der Seite des Mietvertrags.

## Ablauf

1. **Übersicht.** Erwartet: ein Menüpunkt «Mietverträge». Gesehen: Bei 150 % ist das Menü hinter den drei Strichen oben links versteckt. Nach dem Aufklappen fand ich «Mietverträge» unter «Verwalten».
2. **Mietverträge.** Erwartet: Laura Keller in der Liste. Gesehen: «Laura Keller, Wohnung EG · Alpenblick, Laufend, seit 01.11.2022». Ich klicke auf die Zeile.
3. **Seite des Mietvertrags.** Erwartet: «Hauswart» fehlt bei den Nebenkosten. Gesehen: «Vereinbarte Nebenkosten: Heizung, … Lift, Hauswart, Gartenpflege, …». Der Hauswart steht schon da. Ich klicke auf «Bearbeiten».
4. **Mietvertrag bearbeiten.** Erwartet: eine Stelle für «ab wann». Gesehen: oben viel Text (Mietzinserhöhung, Erben, Scheidung), weit unten «Vereinbarte Nebenkosten» mit zwölf Häkchen, alle angekreuzt. Die Hilfe darüber erklärt genau meinen Fall: «Neue Nebenkosten führen Sie nur mit dem amtlichen Formular ein … tragen Sie bei ‹Vereinbart ab› den Tag ein». Ein Feld «Vereinbart ab» sah ich zuerst nicht, nur den blauen Text «Nebenkosten ab einem Tag vereinbaren».
5. **Aufklappen.** Erwartet: ein Datumsfeld. Gesehen: der Satz «Leer lassen, wenn die Nebenkosten seit Beginn des Mietvertrags vereinbart sind. Haben Sie sie mit dem amtlichen Formular neu eingeführt, tragen Sie den Tag ein, ab dem sie gelten.» und darunter zwölf Felder «Heizung: Vereinbart ab (optional)» usw. Das habe ich verstanden. Die vielen gleichen Felder sind aber unübersichtlich (P-2).
6. **Eintragen.** Ich tippe «01.01.2026» bei «Hauswart: Vereinbart ab». Darunter erscheint «Donnerstag, 1. Januar 2026». Gut, so sehe ich, dass Dwello das richtige Datum verstanden hat.
7. **Speichern.** Erwartet: zurück zum Vertrag, Bestätigung. Gesehen: Seite des Mietvertrags, Meldung «Mietvertrag von Laura Keller gespeichert».
8. **Kontrolle.** Erwartet: ein Hinweis auf das Datum beim Hauswart. Gesehen: «Hauswart (ab 01.01.2026)» mitten in der Liste der Nebenkosten. Genau so habe ich es gemeint.
9. **Zusatzversuch, falscher Tag.** Ich trage 01.01.2020 ein (vor Vertragsbeginn). Erwartet: eine Meldung am Feld. Gesehen: unten über den Knöpfen ein roter Kasten «Der Mietvertrag wurde nicht gespeichert. Dieser Tag liegt vor dem Vertragsbeginn. …». Am Feld selbst ist nichts markiert (P-1). Danach wieder 01.01.2026 eingetragen und gespeichert. Die Seite zeigt wieder «Hauswart (ab 01.01.2026)».

## Verwirrung

- «Vereinbart ab» bei einem Häkchen, das schon gesetzt ist: Heisst das jetzt «erst ab 2026» oder «zusätzlich ab 2026»? Die Anzeige «Hauswart (ab 01.01.2026)» spricht für «erst ab», und das wollte ich.
- Ob Dwello für 2025 den Hauswart nun bei Laura Keller weglässt und 2026 ab dem 1. Januar abrechnet, sagt mir keine Stelle ausdrücklich. Ich vertraue dem «ab 01.01.2026» auf der Vertragsseite. Ein Satz wie «Dwello rechnet Hauswart erst ab diesem Tag ab» würde mich ganz beruhigen.
- «Kündigungstermin», «amtliches Formular»: Die Wörter kenne ich vom Formular. Ob 01.01.2026 bei Laura ein Kündigungstermin ist, muss ich selbst wissen. Dwello hilft da nicht.
- Das vorausgefüllte «Gültig ab 1. November 2026» beim Akonto (siehe Beobachtungen).

## Fehlerrisiken

- Wer das Datum ins Feld daneben oder darüber einträgt (P-2), gibt einer anderen Nebenkostenart ein Startdatum, und Dwello rechnet diese dann für die Zeit davor nicht ab.
- Ein Tag mitten im Monat wird ohne Rückfrage angenommen.
- Bei einer Ablehnung muss man unter zwölf Feldern suchen, welches falsch ist (P-1).

## Vorschläge

- **P-1:** Mietverträge → Laura Keller → Bearbeiten → «Nebenkosten ab einem Tag vereinbaren» → bei «Hauswart: Vereinbart ab» 01.01.2020 → «Änderungen speichern». Die Meldung unten nennt keine Nebenkostenart, das Feld ist nicht markiert. Besser wäre die Meldung direkt am Feld, mit rotem Rahmen und dem Namen («Hauswart: Dieser Tag liegt vor dem Vertragsbeginn …»).
- **P-2:** Gleicher Weg bis zum Aufklappen. Die Beschriftung jedes Feldes steht näher am Feld darüber als an ihrem eigenen. Mehr Abstand zwischen den Feldgruppen würde helfen, oder nur das Datumsfeld der Art zeigen, die man anklickt.
- **P-3:** «Nebenkosten ab einem Tag vereinbaren» bündig unter die Häkchen setzen und als Knopf mit Pfeil (aufklappen) erkennbar machen.

## Nicht geprüft

- Ob eine Nebenkostenabrechnung 2025 oder 2026 für Alpenblick den Hauswart bei Laura Keller wirklich erst ab 01.01.2026 verteilt. Dafür hätte ich Rechnungen erfassen und eine Abrechnung erstellen müssen; das gehörte nicht zur Aufgabe.
- Ein Häkchen, das vorher nicht gesetzt war (alle zwölf waren schon angekreuzt).
- Dunkler Modus, andere Sprachen.
