<!-- Persona run I (end a contract on a chosen day) on 7b9971a; screenshots stayed in the session's scratchpad -->

# Persona-Test I: Sven, 45, blind, Screenreader und Tastatur

Datum des Laufs: Sonntag, 11.10.2026. Desktop, nur Tastatur, Seite gelesen über den Accessibility-Tree.
Gewählter Mietvertrag: **Marco Bernasconi, Wohnung B2, Seepark Residenz** (laufend seit 01.07.2023, unbefristet).
Ziel-Vertragsende: letzter Tag des übernächsten Monats = **31.12.2026**.

## Aufgabe geschafft: **ja**

Der Mietvertrag endet jetzt am 31.12.2026 (Detailseite und Liste zeigen «Laufend 01.07.2023 – 31.12.2026»). Der Löschdialog wurde geöffnet und mit Escape geschlossen, nichts gelöscht.

## Aufwand (Tastendrücke)

| Schritt | Tasten |
|---|---|
| Übersicht → «Mietverträge» (Tab ×8, Enter) | 9 |
| Liste → «Marco Bernasconi» (Tab ×24, Enter; ohne Sprunglink) | 25 |
| Detailseite → «Beenden» (Tab ×19, Enter) | 20 |
| Im Dialog zum Datumsfeld (Tab ×2) | 2 |
| Falsches Datum: Ctrl+A, «30.09.2026», Tab ×3 zu «Mietvertrag beenden», Enter | 15 |
| Richtiges Datum: Ctrl+A, «31.12.2026», Enter im Feld | 12 |
| **Total bis gespeichert** | **ca. 83** |
| Löschdialog: Tab ×19, Enter, Escape | 21 |

Auf jeder Seite muss ich durch die ganze Hauptnavigation (16 Tab-Stopps), wenn ich den Sprunglink «Zum Inhalt springen» nicht nutze. Der Sprunglink ist da und kommt als Erstes, gut.

## Laut gedacht (was angesagt wurde)

1. **Liste «Mietverträge»:** Nach dem Seitenwechsel sagt der Screenreader «Mietverträge - Dwello». Der Fokus liegt auf dem Seitenanfang. In der Liste höre ich pro Eintrag nur den Link «Marco Bernasconi»; dass es Wohnung B2 in der Seepark Residenz ist und «Laufend seit 01.07.2023, unbefristet», steht erst im Text danach. Im Tab-Modus höre ich also nur Namen. Ich habe trotzdem gefunden, was ich suchte, weil ich die Liste vorher im Lesemodus gelesen hatte.
2. **Detailseite:** «Mietvertrag von Marco Bernasconi, Überschrift Ebene 1», danach «Wohnung B2 · Seepark Residenz», die Schalter «Bearbeiten», «Beenden», «Löschen». Unter «Vertragsdauer» steht «Laufend, Vertragsende: Unbefristet». Klar.
3. **Dialog öffnen («Beenden»):** «Mietvertrag beenden?, Dialog». Dann liest er die ganze Dialogbeschreibung vor: «Vertragsende. Der letzte Tag des Mietverhältnisses von Marco Bernasconi, zum Beispiel der Tag, auf den der Mietvertrag gekündigt ist. Bis und mit diesem Tag läuft der Mietvertrag; danach gilt er als beendet. Ändern können Sie das Vertragsende später unter «Bearbeiten». Format TT.MM.JJJJ. Beispiel: 31.12.2025. Sonntag, 11. Oktober 2026». Gleichzeitig meldet eine höfliche Live-Region noch einmal «Sonntag, 11. Oktober 2026». Der Fokus liegt auf **«Abbrechen, Schalter»**.
   - Das sind über 60 Wörter, bevor ich überhaupt etwas tun kann. Inhaltlich ist es gut: «bis und mit diesem Tag», Hinweis auf «Bearbeiten», Format.
4. **Weg zum Datumsfeld:** Tab → «Mietvertrag beenden, Schalter», Tab → «Vertragsende, Eingabefeld, 11.10.2026», danach wieder dieselbe lange Beschreibung und «Sonntag, 11. Oktober 2026». Der **vorgeschlagene Wert ist heute (11.10.2026)**. Das Feld hat ein sichtbares Label «Vertragsende», die Hilfe ist über `aria-describedby` verbunden. Nach dem Feld kommt «Kalender für Vertragsende öffnen, Schalter». Den Kalender brauche ich nicht, Tippen geht.
5. **Beim Tippen:** Sobald das Datum vollständig ist, sagt die Live-Region den Wochentag an («Mittwoch, 30. September 2026», später «Donnerstag, 31. Dezember 2026»). Das hilft mir sehr, Tippfehler zu bemerken.
6. **Datum in der Vergangenheit (30.09.2026):**
   - **Über den Schalter «Mietvertrag beenden»** (Tab ×3, Enter): Der Dialog bleibt offen, der Fokus springt zurück ins Feld: «Vertragsende, Eingabefeld, ungültig, 30.09.2026». Dann zuerst wieder die ganze lange Hilfe und erst **ganz am Schluss**: «Das Vertragsende kann nicht vor heute liegen. Ein früheres Vertragsende tragen Sie unter «Bearbeiten» ein. Mittwoch, 30. September 2026». Der Text ist gut, aber ich muss ungefähr 60 Wörter abwarten, bis ich ihn höre.
   - **Mit Enter direkt im Feld** (das mache ich als Tastaturnutzer normalerweise): Der Fokus bleibt im Feld. Weil er sich nicht bewegt, sagt der Screenreader **die Fehlermeldung nicht an**. Es gibt keine `role="alert"` und keine assertive Meldung. Das Einzige, was ich höre, ist die Live-Region mit dem Wochentag, die neu gezeichnet wird: «Mittwoch, 30. September 2026». **Das klingt wie eine Bestätigung.** Dass etwas falsch ist, merke ich erst, wenn ich das Feld neu ansteuere oder den Dialog im Lesemodus durchlese.
7. **Richtiges Datum (31.12.2026), Enter im Feld:** Der Dialog schliesst sich, die Seite lädt neu. Angesagt werden der Seitentitel assertiv («Mietvertrag - Marco Bernasconi - Dwello») und die Statusmeldung höflich («Der Mietvertrag von Marco Bernasconi endet am 31.12.2026»; sie hat einen Schalter «Meldung schliessen»). Der **Fokus landet auf der Überschrift** «Mietvertrag von Marco Bernasconi, Ebene 1». Auf der Seite steht jetzt «Vertragsende: 31.12.2026», der Schalter «Beenden» ist weg.
8. **Löschdialog:** «Mietvertrag löschen?, Dialog. Der Mietvertrag läuft bis am 31.12.2026. Danach können Sie ihn löschen.» Der Fokus liegt auf «Abbrechen». Tab bleibt auf «Abbrechen», weil «Mietvertrag löschen» deaktiviert und deshalb nicht erreichbar ist (im Lesemodus: «Mietvertrag löschen, Schalter, nicht verfügbar»). Mit Escape geht der Dialog zu, der Fokus kommt zurück auf «Löschen». Die Falle ist sauber, die Begründung ist klar.

## Was verwirrte

- **Major:** Mit Enter im Feld wird der Fehler zum vergangenen Datum nicht angesagt. Stattdessen höre ich den Wochentag noch einmal, und das klingt nach «passt» (siehe Punkt 6).
- **Major:** Die Fehlermeldung steht in der Beschreibung des Feldes ganz hinten, nach der rund 60 Wörter langen Hilfe. Ich höre sie also erst, wenn ich nicht vorher weitertabbe oder die Ansage unterbreche.
- **Minor:** Beim Öffnen liest der Dialog seine ganze Beschreibung (Label, Hilfe, Wochentag) vor, und die Live-Region sagt den Wochentag ein zweites Mal. Beim Feld höre ich dasselbe dann ein drittes Mal.
- **Minor:** «Beispiel: 31.12.2025» liegt in der Vergangenheit. Wenn ich das Beispiel abtippe, gibt es sofort den Fehler «kann nicht vor heute liegen».
- **Minor:** Der Löschdialog heisst «Mietvertrag löschen?», obwohl Löschen gar nicht möglich ist. Die Frage verspricht eine Wahl, die es nicht gibt.
- **Minor:** Nach dem Speichern sagt die Detailseite weiterhin «Laufend». Das stimmt, aber ein Hinweis wie «gekündigt auf 31.12.2026» würde mir die Bestätigung beim Wiederfinden erleichtern.
- **Minor:** In der Mietvertragsliste heisst der Link nur wie der Mieter («Marco Bernasconi»). Wohnung und Gebäude fehlen im Linknamen, deshalb ist die Liste mit Tab allein mehrdeutig. «Kevin Fischer» kommt zweimal vor (laufend und beendet).

## Fehlerrisiken

- **Major:** Als Vorschlag steht heute (11.10.2026, ein Sonntag) im Feld, und in der Tab-Reihenfolge kommt «Mietvertrag beenden» *vor* dem Datumsfeld (Fokus auf «Abbrechen» → Tab → «Mietvertrag beenden»). Wer nach dem Öffnen einmal Tab und Enter drückt, ohne das Feld zu besuchen, beendet den Mietvertrag auf heute statt auf den gekündigten Termin. Das heutige Datum ist für eine Kündigung auf einen späteren Termin fast nie richtig.
- **Major:** Weil der Fehler nach Enter stumm bleibt (siehe oben), versucht ein blinder Nutzer vielleicht mehrmals zu speichern oder schliesst den Dialog im Glauben, es habe geklappt.
- **Minor:** Nach dem Speichern konkurrieren drei Ansagen: der assertive Seitentitel, der Fokuswechsel auf die H1 und die höfliche Statusmeldung. Bei NVDA oder JAWS kann ein Fokuswechsel höfliche Meldungen verschlucken; dann höre ich die eigentliche Bestätigung «endet am 31.12.2026» nicht. Ich habe das nur im Accessibility-Tree gesehen, nicht mit einem echten Screenreader geprüft.
- **Minor:** Der Wert «Bis und mit diesem Tag» ist gut erklärt. Trotzdem könnte jemand den ersten Tag nach dem Auszug eintragen (01.01.2027). Eine Ansage wie «letzter Tag: Donnerstag, 31. Dezember 2026» statt nur des Wochentags würde das bestätigen.

## Vorschläge

- **Major:** Den Fehler nach einem fehlgeschlagenen Absenden aktiv ansagen, auch wenn der Fokus schon im Feld ist: als `role="alert"`, mit `aria-errormessage` oder indem der Fokus kurz auf die Meldung und dann zurück ins Feld geht. Die Wochentag-Live-Region sollte sich beim Absenden nicht neu melden.
- **Major:** In `aria-describedby` die Fehlermeldung an den **Anfang** stellen (Fehler zuerst, dann die Hilfe), oder die lange Hilfe kürzen.
- **Major:** Beim Öffnen den Fokus ins Feld «Vertragsende» setzen (es ist die einzige Eingabe) oder das Feld in der Tab-Reihenfolge vor die Schalter stellen. Und kein «heute» vorschlagen: das Feld leer lassen oder einen typischen Kündigungstermin (Monatsende) vorschlagen, damit ein versehentliches Enter nicht auf heute beendet.
- **Minor:** Dem Dialog nur Titel und einen kurzen Satz als Beschreibung geben (z. B. «Wählen Sie den letzten Tag des Mietverhältnisses von Marco Bernasconi.»); die Feldhilfe gehört nur zum Feld.
- **Minor:** Ein Beispiel-Datum wählen, das in der Zukunft liegt, oder das Beispiel vom heutigen Datum ableiten.
- **Minor:** Den Löschdialog bei laufenden Verträgen anders betiteln («Mietvertrag kann noch nicht gelöscht werden») oder den Schalter «Löschen» auf der Detailseite gar nicht anbieten, solange der Vertrag läuft.
- **Minor:** In der Mietvertragsliste den Linknamen um Wohnung und Gebäude ergänzen (z. B. «Marco Bernasconi, Wohnung B2, Seepark Residenz»).
- **Minor:** Nach dem Speichern auf den Seitentitel-Announcer verzichten, wenn dieselbe Seite neu geladen wird, damit die Statusmeldung sicher gehört wird.

## Was gut war

- Das Feld hat ein echtes Label, eine verbundene Hilfe, `aria-invalid` und einen verständlichen Fehlertext, der sagt, was zu tun ist («… tragen Sie unter «Bearbeiten» ein»).
- Die Wochentag-Ansage beim Tippen ist für blinde Nutzer eine starke Kontrolle.
- Enter im Feld sendet ab, Escape schliesst den Dialog, und der Fokus kehrt zum auslösenden Schalter zurück.
- Der Löschdialog schützt einen laufenden Vertrag und sagt, ab wann Löschen geht.
