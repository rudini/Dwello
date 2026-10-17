# Persona-Review Dr. Weber, Runde w7b: Kündigung der Mieterin erfassen

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300 (Demodaten). Gespeichert nur im Gebäude «Alpenblick», Mietvertrag von Laura Keller (Wohnung EG).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/640c8f31-17d0-5940-b4e2-fb65765985e8/scratchpad/weber-w7b/`.

Aufgabe: Laura Keller kündigt schriftlich, Brief eingegangen am 02.11.2026, gewünschtes Ende 31.01.2027. Im Mietvertrag das Vertragsende und das Eingangsdatum erfassen, die Hinweise zu Kündigungsfrist und Form prüfen, entscheiden, ob ich 31.01.2027 speichere, danach die Vertragsseite und die Option «Kündigung aufheben» unter «Bearbeiten» prüfen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Mietvertrag … beenden?» | Die Warnung «weniger als 3 Monate … gilt wohl erst auf den nächsten Kündigungstermin» nennt diesen nächsten Termin nicht. Der Dialog schickt mich in den Mietvertrag, aber Dwello zeigt nirgends die vereinbarten Fristen und Termine. Dass es der 30.04.2027 ist, musste ich selbst herleiten. |
| P-2 | Minor | Dialog «Mietvertrag … beenden?» | Liegt das Eingangsdatum nach dem Vertragsende (Eingang 15.02.2027, Ende 31.01.2027; ebenso Eingang 02.11.2026, Ende 01.11.2026), erscheint dieselbe Meldung «weniger als 3 Monate». Einen Hinweis auf einen wahrscheinlichen Tippfehler gibt es nicht. |
| P-3 | Minor | Mietvertrag bearbeiten, Option «Kündigung aufheben» | «Das geht nur, wenn Mieter und Vermieter die Kündigung gemeinsam zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt.» Der Fall einer nichtigen Kündigung fehlt, also einer Kündigung ohne Schriftform oder ohne Zustimmung des Ehegatten bei einer Familienwohnung (Art. 266l/266m/266o OR). Genau diese Formvorschriften nennt der Dialog selbst. Eine nichtige Kündigung muss niemand für ungültig erklären, nach diesem Text dürfte ich sie aber nicht aufheben. |
| P-4 | Minor | Mietvertrag bearbeiten | Das Feld «Kündigung erhalten am» gibt es beim Bearbeiten nicht. Ein falsch erfasstes Eingangsdatum kann ich nach dem Speichern offenbar nicht mehr korrigieren, ausser über «Kündigung aufheben» und neu beenden (nicht ausprobiert). |
| P-5 | Nit | Dialog «Mietvertrag … beenden?» | Die Warnung steht zwischen dem Eingabefeld «Kündigung erhalten am» und der Datumsanzeige «Montag, 2. November 2026». Feld und Bestätigung des Datums werden dadurch getrennt. |
| P-6 | Nit | Dialog «Mietvertrag … beenden?» | «Ausnahme: Ein Ersatzmieter übernimmt den Mietvertrag» vereinfacht Art. 264 OR. Der Ersatzmieter muss zumutbar und zahlungsfähig sein und bereit, den Vertrag zu gleichen Bedingungen zu übernehmen. Ich muss ihn nicht nehmen, der Mieter ist aber frei, wenn ich einen zumutbaren ablehne. |

## Beobachtungen

- Die Prüfung der Frist stimmt an der Grenze: Bei Eingang 31.10.2026 und Ende 31.01.2027 kommt keine Warnung, bei Eingang 01.11.2026 kommt sie. Das entspricht der Empfangstheorie: Die Kündigung muss vor Beginn der dreimonatigen Frist ankommen.
- Die Warnung blockiert das Speichern nicht und ist mit «wohl» vorsichtig formuliert. Für Ausnahmen wie einen Ersatzmieter oder eine Vereinbarung ist das richtig.
- Geprüft wird nur die Frist, nicht der Termin: Bei Ende 28.02.2027 kommt keine Warnung, obwohl offen ist, ob der 28.02. ein Kündigungstermin ist. Der allgemeine Hinweis «Prüfen Sie Frist und Termin im Mietvertrag» deckt das ab.
- Ein Eingangsdatum in der Zukunft (02.11.2026, Systemdatum laut Umgebung 16.10.2026) wurde ohne Hinweis angenommen. Für meine Aufgabe ist «heute» der 02.11.2026, darum werte ich das nicht als Fehler. Ein Tippfehler im Jahr fiele so aber nicht auf.
- Vertragsseite: «3 Abrechnungen fehlen … hat **Mietstage** in diesen Abrechnungsperioden»: Tippfehler, gemeint ist «Miettage».
- Unter «Nächste Schritte» steht neben «Nachmieter erfassen» die Schaltfläche «Neuen Mietvertrag für Laura Keller erfassen». Als Vermieter einer Mieterin, die auszieht, verstehe ich nicht, wozu ich ihr einen neuen Vertrag erfassen sollte (vermutlich für einen Wohnungswechsel im selben Bestand). Ohne Erklärung irritiert das.
- Die Vertragsseite zeigt nicht, wer gekündigt hat, Mieterin oder Vermieter. Für meine Akten wäre das nützlich.
- Der Status bleibt «Laufend» (grün). Das ist korrekt bis zum 30.04.2027. Dass gekündigt ist, sehe ich nur in der Zeile «Vertragsende» und im Kasten «Nächste Schritte».
- Bearbeiten: «Bei Mietanpassungen sollten Sie die gesetzlichen Kündigungsfristen beachten» ist ungenau. Für eine Mietzinserhöhung gilt das amtliche Formular, mitgeteilt mindestens 10 Tage vor Beginn der Kündigungsfrist (Art. 269d OR).
- Bearbeiten: Beim gekündigten unbefristeten Vertrag wird auch «Befristet: Der Mietvertrag endet an einem festen Tag, ohne Kündigung» angeboten. Ein Wechsel auf «Befristet» würde die Kündigung rechtlich falsch abbilden.
- Eine Erstreckung durch die Schlichtungsbehörde (Art. 272 OR) wird nicht erwähnt. Gemeint ist sie vermutlich mit «Hat sich der Kündigungstermin verschoben, ändern Sie das Vertragsende», streng genommen ist eine Erstreckung aber keine Verschiebung des Kündigungstermins.

## Aufgabe geschafft: ja

Gespeichert habe ich bewusst nicht den 31.01.2027, sondern den 30.04.2027, mit Eingang 02.11.2026 (Begründung im Ablauf, Schritt 5).

## Aufwand

Etwa 10 Minuten, rund 12 Schritte: Gebäude, Wohnung, Mietvertrag, Dialog, Daten eingeben, Varianten prüfen, Speichern, Vertragsseite, Bearbeiten, Option ansehen.

## Ablauf

1. **Gebäude → Alpenblick → Wohnung EG.** Erwartet: die Mieterin und ein Link zum Vertrag. Gesehen: «Aktueller Mieter Laura Keller, Mietvertrag seit 01.11.2022» und unten «Mietvertrag von Laura Keller, seit 01.11.2022, unbefristet, Laufend» als Link. Gut.
2. **Vertragsseite.** Erwartet: eine Aktion zum Beenden. Gesehen: «Bearbeiten», «Beenden», «Löschen»; Vertragsende «Unbefristet». Was Kündigungsfrist und -termine sind, zeigt die Seite nicht.
3. **«Beenden».** Der Dialog «Mietvertrag von Laura Keller, Wohnung EG, beenden?» hat zwei Felder mit Hilfetexten:
   - Vertragsende: «Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht.» Fachlich richtig.
   - Kündigung erhalten am (optional): «Die Kündigung des Mieters muss schriftlich sein. Bei einer Familienwohnung braucht es die ausdrückliche Zustimmung des Ehegatten oder eingetragenen Partners.» Richtig (Art. 266l, 266m OR).
   - Darunter: «Für Wohnungen gilt eine Kündigungsfrist von mindestens 3 Monaten. Ist die Kündigung zu spät, gilt sie erst auf den nächsten Kündigungstermin. Ein neuer Mietvertrag kann am Tag danach beginnen.» Richtig (Art. 266c, 266a Abs. 2 OR).
   - Ein Hinweis zum Tod des Mieters (Übergang auf die Erben). Ebenfalls richtig, für diesen Fall aber nicht nötig.
4. **31.01.2027 und 02.11.2026 eingegeben.** Erwartet: ein Hinweis, dass die Frist verpasst ist. Gesehen: eine Warnung mit Dreieck-Symbol: «Zwischen Eingang und Vertragsende liegen weniger als 3 Monate. Dann gilt die Kündigung wohl erst auf den nächsten Kündigungstermin. Ausnahme: Ein Ersatzmieter übernimmt den Mietvertrag, oder Sie haben das Ende mit dem Mieter vereinbart.» Unter den Feldern stehen die Daten ausgeschrieben («Sonntag, 31. Januar 2027», «Montag, 2. November 2026»). Meine Rechnung ergibt dasselbe: Für ein Ende am 31.01.2027 hätte der Brief spätestens am 31.10.2026 da sein müssen. Er ist zu spät.
5. **Entscheid.** Es gibt weder einen Ersatzmieter noch eine Vereinbarung. Der nächste Termin: Bei Mietbeginn 01.11.2022 enden die dreimonatigen Mietdauern am 31.01., 30.04., 31.07. und 31.10. Auch die im Kanton Bern verbreiteten Termine Ende April und Ende Oktober führen auf den 30.04.2027. Ich habe deshalb 30.04.2027 eingetragen, die Warnung verschwand. Die Gegenproben: 28.02.2027 ergibt keine Warnung (Frist eingehalten, Termin ungeprüft); Eingang nach dem Ende ergibt dieselbe Meldung wie zu kurze Frist (P-2).
6. **«Mietvertrag beenden» mit 30.04.2027 / 02.11.2026.** Erwartet: Bestätigung und geänderte Vertragsseite. Gesehen: die Meldung «Der Mietvertrag von Laura Keller endet am 30.04.2027. Die nächsten Schritte sehen Sie oben auf der Seite.» Dazu ein neuer Kasten «Nächste Schritte» («Der Mietvertrag ist gekündigt. Erfassen Sie den Mietvertrag des Nachmieters … Für die Schlussabrechnung braucht es die neue Adresse des Mieters.») mit drei Schaltflächen. Unter Vertragsdauer: «Vertragsende: Unbefristet, gekündigt auf den 30.04.2027» und «Kündigung erhalten am: 02.11.2026». Die Schaltfläche «Beenden» ist weg. Das entspricht meinen Erwartungen.
7. **«Bearbeiten».** Ganz oben ein Hinweis «Laufender Mietvertrag». Unter «Mieter und Wohnung» steht «Bei einem Mieterwechsel erfassen Sie einen neuen Mietvertrag, frühestens ab 01.05.2027», was richtig ist. Die Gruppe «Vertragsdauer» hat drei Optionen: «Unbefristet, gekündigt auf den 30.04.2027» (gewählt), «Kündigung aufheben», «Befristet». Ein Feld für das Eingangsdatum fehlt (P-4).
8. **«Kündigung aufheben» gelesen und angeklickt, nicht gespeichert.** Text: «Der Mietvertrag läuft dann ohne Ende weiter. Das geht nur, wenn Mieter und Vermieter die Kündigung gemeinsam zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt. Ist eine Kündigung angekommen, kann sie weder der Mieter noch der Vermieter allein zurücknehmen.» Nach dem Anklicken verschwindet das Feld «Vertragsende». **Weiss ich daraus, wann ich eine Kündigung zurücknehmen darf?** Im Wesentlichen ja: nach dem Eingang nur gemeinsam oder durch Behörde oder Gericht. Das ist korrekt, denn die Kündigung ist ein Gestaltungsrecht und nach Zugang unwiderruflich. Implizit folgt, dass ich vor dem Eingang allein widerrufen kann (Widerruf trifft spätestens gleichzeitig ein, Art. 9 OR). Das steht nicht ausdrücklich da, für eine Kündigung des Mieters ist es aber unerheblich. Es fehlt die nichtige Kündigung (P-3). Ich habe die Seite ohne Speichern verlassen.

## Verwirrung

- «Kündigungstermin» und «Vertragsende» werden im Dialog gleichgesetzt («also der Kündigungstermin»). Bei einem vereinbarten Ende (Aufhebungsvereinbarung) ist das Vertragsende aber kein Kündigungstermin. Für Laien kann das verwirren, wenn sie gerade die Ausnahme «Ende mit dem Mieter vereinbart» nutzen.
- «Neuen Mietvertrag für Laura Keller erfassen» auf der Seite eines gekündigten Vertrags: unklar, wofür.
- «Mietstage» habe ich zweimal gelesen, bis ich «Miettage» verstand.
- «Befristet … ohne Kündigung» neben einem bereits gekündigten Vertrag: Wann sollte ich das hier wählen?

## Fehlerrisiken

- Wer die Warnung als Hinweis überliest und 31.01.2027 speichert, rechnet die Nebenkosten und die Wiedervermietung drei Monate zu früh ab. Er verliert Miete, die ihm zusteht, und erfasst womöglich einen Nachmieter ab 01.02.2027, obwohl Frau Keller bis 30.04.2027 Mieterin bleibt. Ohne Angabe des nächsten Termins (P-1) bleibt die Korrektur am Laien hängen.
- Ein Tippfehler im Eingangsdatum (falsches Jahr) wird nicht als solcher erkannt (P-2) und lässt sich danach nicht mehr korrigieren (P-4).
- Ein Laie könnte eine formnichtige Kündigung, etwa ohne Zustimmung des Ehegatten, als gültig stehen lassen, weil «Kündigung aufheben» diesen Fall ausschliesst (P-3).

## Vorschläge

- **P-1:** Mietvertrag Laura Keller → «Beenden» → Vertragsende 31.01.2027, Eingang 02.11.2026 → Warnung ohne Datum. Hilfreich: In der Warnung einen Vorschlag nennen, etwa «Nächster möglicher Termin bei 3 Monaten Mietdauer ab Vertragsbeginn: 30.04.2027; massgebend sind die Termine im Mietvertrag oder der Ortsgebrauch». Oder wenigstens die im Vertrag vereinbarten Kündigungstermine in Dwello erfassbar und hier sichtbar machen.
- **P-2:** Gleicher Dialog, Vertragsende 31.01.2027, Eingang 15.02.2027 → Meldung «weniger als 3 Monate». Hilfreich: eine eigene Meldung «Die Kündigung ist nach dem Vertragsende eingegangen. Prüfen Sie die Daten.»
- **P-3:** Gespeicherten Vertrag → «Bearbeiten» → Option «Kündigung aufheben» lesen. Hilfreich: ergänzen um «oder die Kündigung war von Anfang an ungültig, zum Beispiel nicht schriftlich oder bei einer Familienwohnung ohne Zustimmung des Ehegatten».
- **P-4:** Gekündigten Vertrag → «Bearbeiten»: kein Feld «Kündigung erhalten am». Hilfreich: das Feld in der Option «Unbefristet, gekündigt auf …» anbieten.
- **P-5:** Dialog, Eingang 02.11.2026 bei Ende 31.01.2027 → die Warnung steht zwischen Feld und «Montag, 2. November 2026». Hilfreich: die Datumsanzeige direkt unter das Feld, die Warnung darunter.
- **P-6:** Dialog, Warnung lesen. Hilfreich: «Ausnahme: Der Mieter schlägt einen zumutbaren Ersatzmieter vor, der den Mietvertrag zu gleichen Bedingungen übernimmt, oder Sie haben …»

## Nicht geprüft

- Speichern mit 31.01.2027 trotz Warnung: Ich habe mich fachlich für den 30.04.2027 entschieden und nur einmal gespeichert, um den gemeinsamen Datenbestand nicht mehrfach umzuschreiben. Ob der Server ein Ende mit zu kurzer Frist annimmt, ist daher offen. Die Oberfläche blockierte den Knopf jedenfalls nicht.
- «Kündigung aufheben» habe ich nicht gespeichert, die Kündigung bleibt erfasst. Ob danach erneut «Beenden» mit anderem Eingangsdatum möglich ist (Weg zur Korrektur, P-4), ist ungeprüft.
- Dunkelmodus, Mobile, andere Sprachen: nicht Teil der Aufgabe.
