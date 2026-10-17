# Helga – Kündigung von Thomas Weber erfassen (w7b)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % (Dialog auch bei 200 %), Maus. App: Persona-Stack auf http://localhost:3300, Demodaten. Gespeichert nur im Gebäude «Seepark Residenz», Mietvertrag von Thomas Weber, Wohnung A1.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/640c8f31-17d0-5940-b4e2-fb65765985e8/scratchpad/helga-w7b/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Mietvertrag … beenden?» | Der Dialog öffnet bei 150 % und 200 % ganz nach unten gescrollt (Fokus auf «Abbrechen»). Ich sehe zuerst nur die Hinweise und die blaue Schaltfläche «Mietvertrag beenden»; Titel, «Vertragsende» und «Kündigung erhalten am» sind oben aus dem Bild. |
| P-2 | Minor | Dialog, Feld «Kündigung erhalten am» | Dwello nimmt ein Empfangsdatum in der Zukunft (15.12.2026, heute ist der 16.10.2026) ohne jeden Hinweis an. Bei einem Tippfehler im Jahr würde ich das nicht merken. |
| P-3 | Minor | «Mietvertrag bearbeiten» | Das Datum «Kündigung erhalten am» erscheint beim Bearbeiten nirgends. Hätte ich es falsch eingetippt, wüsste ich nicht, wo ich es korrigiere; und bei «Kündigung aufheben» sagt mir die Seite nicht, was mit diesem Datum geschieht. |

## Beobachtungen

- Nach dem Speichern liegt die grüne Meldung «Der Mietvertrag von Thomas Weber endet am 31.03.2027. Die nächsten Schritte sehen Sie oben auf der Seite.» rechts über dem Kasten «Nächste Schritte» und verdeckt dessen rechten Teil, bis ich sie schliesse.
- Im Kasten «Nächste Schritte» steht «Neuen Mietvertrag für Thomas Weber erfassen». Das hat mich irritiert: Er zieht doch aus. Ich vermute, das ist für den Fall, dass er in eine andere meiner Wohnungen zieht, aber das steht nicht dabei.
- «Vertragsdauer» zeigt nach dem Speichern weiterhin das grüne Schild «Laufend». Das stimmt (er wohnt ja bis Ende März), war aber kurz ein Schreck: Hat es nicht gespeichert? Gleich darunter steht dann «Unbefristet, gekündigt auf den 31.03.2027», das hat mich beruhigt.
- Beim Leerabschicken erscheint die Fehlermeldung sichtbar einmal, im Vorlesebaum aber zweimal hintereinander («Bitte geben Sie das Vertragsende ein, zum Beispiel 31.12.2026.»).
- Die Bearbeiten-Seite ist sehr textlastig: Vor dem eigentlichen Formular stehen vier Absätze (Mieterwechsel, falscher Mieter, Tod des Mieters, Eintritt eines Dritten). Ich musste lange lesen, bis ich bei «Vertragsdauer» war.
- Die Wochentag-Anzeige unter den Datumsfeldern («Dienstag, 15. Dezember 2026») finde ich sehr hilfreich, so sehe ich, dass ich mich nicht vertippt habe.

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, 9 Schritte: Übersicht → Seepark Residenz → Wohnung A1 → Mietvertrag von Thomas Weber → «Beenden» → zwei Daten eintragen → «Mietvertrag beenden» → Vertragsseite prüfen → «Bearbeiten» lesen. Ein Fehlversuch (leer abgeschickt).

## Ablauf

1. **Übersicht.** Erwartet: irgendwo «Kündigung» oder «Mieter kündigt». Gesehen: nichts dergleichen; unter «Vermietete Wohnungen pro Gebäude» fand ich «Seepark Residenz». Bin über das Gebäude gegangen.
2. **Gebäude Seepark Residenz.** Erwartet: die Wohnungen. Gesehen: «Wohnung A1 – 3 Zimmer 68 m² Vermietet». Gut.
3. **Wohnung A1.** Gesehen: «Aktueller Mieter Thomas Weber, Mietvertrag seit 01.04.2022» und unten «Mietvertrag von Thomas Weber». Draufgeklickt.
4. **Vertragsseite.** Erwartet: eine Schaltfläche für die Kündigung. Gesehen: «Bearbeiten», «Beenden», «Löschen». «Beenden» passt, auch wenn ich «Kündigung erfassen» gesucht hätte. «Löschen» habe ich bewusst nicht angefasst.
5. **Dialog öffnen (Screenshot 05/08).** Erwartet: oben die Frage und die Felder. Gesehen: Der Dialog war ganz nach unten gescrollt; ich sah die zwei Hinweisabsätze (Kündigungsfrist, verstorbener Mieter) und darunter «Abbrechen» und «Mietvertrag beenden». Bei 200 % sah ich überhaupt kein Eingabefeld (P-1). Ich habe zuerst einfach auf «Mietvertrag beenden» geklickt.
6. **Leer abgeschickt (Screenshot 09).** Gesehen: Der Dialog sprang nach oben, das Feld «Vertragsende» rot umrandet, «Bitte geben Sie das Vertragsende ein, zum Beispiel 31.12.2026.» Verständlich, nichts gespeichert. Erst jetzt sah ich den Titel «Mietvertrag von Thomas Weber, Wohnung A1, beenden?».
7. **Felder lesen (Screenshot 06).** «Vertragsende: Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht.» Klar: 31.03.2027. «Kündigung erhalten am (optional): Der Tag, an dem das Kündigungsschreiben angekommen ist.» Klar: 15.12.2026, der Tag, an dem der Brief bei mir ankam, nicht das Datum oben auf dem Brief. Der Satz «Die Kündigung des Mieters muss schriftlich sein» hat mich bestätigt: Ich habe ja einen Brief. Der Satz zur Familienwohnung und zur «ausdrücklichen Zustimmung des Ehegatten oder eingetragenen Partners» hat mich verunsichert: Thomas Weber hat allein unterschrieben. Ist A1 eine Familienwohnung? Ich weiss nicht, ob er verheiratet ist. Dwello sagt nicht, was ich tun soll, wenn die Zustimmung fehlt.
8. **Daten eintragen (Screenshot 07).** 31.03.2027 und 15.12.2026 getippt. Darunter erschien «Mittwoch, 31. März 2027» und «Dienstag, 15. Dezember 2026». Keine Warnung, obwohl der 15.12.2026 nach heute liegt (P-2). Der Hinweis «mindestens 3 Monate» passt: 15.12. bis 31.03. sind mehr als drei Monate.
9. **Gespeichert (Screenshot 10).** Erwartet: Bestätigung und Vertragsende auf der Seite. Gesehen: Meldung «Der Mietvertrag von Thomas Weber endet am 31.03.2027. Die nächsten Schritte sehen Sie oben auf der Seite.», neuer Kasten «Nächste Schritte» («Der Mietvertrag ist gekündigt. Erfassen Sie den Mietvertrag des Nachmieters, sobald er unterschrieben ist. Für die Schlussabrechnung braucht es die neue Adresse des Mieters.» mit «Nachmieter erfassen», «Neuen Mietvertrag für Thomas Weber erfassen», «Neue Adresse eintragen»). Unter «Vertragsdauer»: «Vertragsende: Unbefristet, gekündigt auf den 31.03.2027» und «Kündigung erhalten am: 15.12.2026». Die Schaltfläche «Beenden» ist weg. Alles wie erwartet.
10. **Thomas Weber ruft an: «Bearbeiten» (Screenshot 11, 13).** Erwartet: eine Möglichkeit, die Kündigung zurückzunehmen, mit Erklärung. Gesehen: Unter «Vertragsdauer» drei Wahlkästen: «Unbefristet, gekündigt auf den 31.03.2027» (gewählt), «Kündigung aufheben» und «Befristet». Bei «Kündigung aufheben» steht: «Der Mietvertrag läuft dann ohne Ende weiter. Das geht nur, wenn Mieter und Vermieter die Kündigung gemeinsam zurücknehmen oder die Schlichtungsbehörde oder ein Gericht sie für ungültig erklärt. Ist eine Kündigung angekommen, kann sie weder der Mieter noch der Vermieter allein zurücknehmen.» Als ich es angeklickt habe, verschwand das Feld «Vertragsende». Nicht gespeichert.
    **Meine Entscheidung:** Ich darf die Kündigung nicht einfach allein zurücknehmen, und Thomas Weber auch nicht allein mit seinem Anruf. Nur wenn wir beide einverstanden sind, darf ich «Kündigung aufheben» wählen. Will ich ihn behalten, ist es also möglich, aber gemeinsam. Ich würde mir das von ihm schriftlich geben lassen; dazu sagt Dwello allerdings nichts.

## Verwirrung

- «Beenden» statt «Kündigung erfassen»: Ich habe es gefunden, aber «beenden» klingt, als ob der Vertrag sofort aufhört. Der Dialog erklärt es dann.
- «Kündigungstermin» im Hilfetext von «Vertragsende»: Das Wort kenne ich, aber «Termin» denke ich als Datum beim Arzt. «also der letzte Tag» hat es gerettet.
- «Familienwohnung» und «eingetragener Partner»: unklar, ob das bei mir zutrifft und was ich tun muss, wenn die Unterschrift des Ehegatten fehlt.
- «Schlichtungsbehörde»: Kenne ich nicht genau, hat mich aber nicht gestört, weil es für meinen Fall nicht gilt.
- Der Hinweis zum verstorbenen Mieter im Kündigungsdialog hat mich kurz erschreckt («Ist der Mieter gestorben …»), obwohl er für Thomas Weber nicht gilt.
- Auf der Bearbeiten-Seite: Was passiert mit «Kündigung erhalten am», wenn ich die Kündigung aufhebe? Bleibt das stehen?

## Fehlerrisiken

- Wer den Dialog bei grosser Schrift öffnet, sieht zuerst «Mietvertrag beenden» und nicht die Felder (P-1). Dwello fängt das leere Absenden ab, gut, aber man fühlt sich überrumpelt.
- Ein Tippfehler im Jahr beim Empfangsdatum (z. B. 2027 statt 2026) wird angenommen (P-2) und lässt sich nachher nicht sichtbar korrigieren (P-3).
- Jemand könnte die beiden Daten vertauschen (Brief-Datum ins Vertragsende). Die Hilfetexte stehen direkt über den Feldern, das senkt das Risiko.
- «Kündigung aufheben» ist ein einfacher Wahlknopf; ein Vermieter, der nicht liest, könnte eine Kündigung «wegklicken», ohne dass der Mieter zugestimmt hat. Der Text warnt klar, aber es gibt keine Rückfrage.

## Vorschläge

- **P-1:** Mietvertrag von Thomas Weber öffnen, «Beenden» klicken, bei 150 % oder 200 % Zoom. Der Dialog steht unten, Fokus auf «Abbrechen». Hilfreich: Dialog oben öffnen (Titel sichtbar), Fokus auf das Feld «Vertragsende» oder auf den Titel.
- **P-2:** Im Dialog «Kündigung erhalten am» ein Datum nach heute eintippen (z. B. 15.12.2026 am 16.10.2026), speichern: kein Hinweis. Hilfreich: ein Hinweis unter dem Feld wie «Dieses Datum liegt in der Zukunft. Prüfen Sie das Jahr.» (ohne das Speichern zu verhindern).
- **P-3:** Nach dem Speichern «Bearbeiten» öffnen: «Kündigung erhalten am» fehlt. Hilfreich: das Datum dort zeigen und änderbar machen, und bei «Kündigung aufheben» sagen, dass das Empfangsdatum dann entfällt (oder bleibt).

## Nicht geprüft

- «Kündigung aufheben» gespeichert habe ich nicht: Die Aufgabe war, nur zu entscheiden; ausserdem bleibt der Vertrag so gekündigt, wie Thomas Weber es geschrieben hat.
- Ob Dwello warnt, wenn die Kündigungsfrist zu kurz ist (z. B. Empfang 15.02.2027 auf 31.03.2027): Dafür hätte ich ein falsches Vertragsende speichern müssen.
- Den Kalender-Knopf neben den Datumsfeldern habe ich nicht benutzt, ich habe getippt.
- Mobile Ansicht und andere Sprachen: nicht Teil von Helgas Aufgabe.
