# Helga – Akonto ab einem Datum ändern (#464)

Persona: Helga, 68, Desktop 1440 × 900 mit 150 % Zoom (ein Versuch mit 200 %), Maus. App: Persona-Stack http://localhost:3300, Deutsch. Gespeichert habe ich nur in «Seepark Residenz» (Thomas Weber, A1; ein Speicherversuch ohne Änderung bei Nina Brunner, A2). Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-464/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Mietvertrag bearbeiten | Ich kann gar nichts speichern. Bei jedem Klick auf «Änderungen speichern» kommt «Der Mietvertrag wurde nicht gespeichert – Beim Speichern ist ein Fehler aufgetreten. Versuchen Sie es später erneut.» Das passiert mit Akonto 220, mit 220.00, bei 200 % Zoom und sogar, wenn ich gar nichts geändert habe, bei Thomas Weber und bei Nina Brunner. Im Netzwerk antwortet `PUT /api/contracts/<id>` mit 400 und `{"error":"undefined is not an object (evaluating '[...sorted].reverse().find((entry, i) => i === sorted.length - 1 || entry.validFrom <= day).amount')"}`. In der Anfrage steht nur `monthlyAdvancePayment`, kein Datum und keine Liste von Akontobeträgen. |
| P-2 | Blocker | Mietvertrag bearbeiten | Es gibt kein Feld «Gültig ab». Die Hilfe beim Akonto sagt zweimal «Ein neues Akonto gilt ab dem Tag bei «Gültig ab»» und «Tragen Sie bei «Gültig ab» den Tag nach dem Kündigungstermin ein», und der Kasten oben sagt «Ein neues Akonto gilt ab dem Tag, den Sie dazu eintragen». Auch nachdem ich 220 eingetippt und das Feld mit Tab verlassen habe, erscheint kein Datumsfeld: weder im Bild noch im Barrierefreiheits-Baum noch unter den Eingabefeldern der Seite. So kann ich den 1. Januar 2026 nirgends eintragen. |
| P-3 | Major | Mietvertrag ansehen | Auf der Seite des Mietvertrags steht nur «Akonto CHF 200.00». Ich finde keinen Hinweis darauf, ab wann ein Akonto gilt, keine Liste früherer oder späterer Akontobeträge und keinen Knopf, um ein Akonto zu ändern oder zu entfernen. Weil Speichern nicht ging, konnte ich nicht sehen, ob nach dem Speichern mehr angezeigt würde. |
| P-4 | Major | Mietvertrag bearbeiten | Die Fehlermeldung sagt nicht, was passiert ist, und «Versuchen Sie es später erneut» hilft nicht: Es scheitert jedes Mal. Ich wüsste nicht, ob ich etwas falsch gemacht habe oder ob Dwello defekt ist. |

## Beobachtungen

- Beim ersten Versuch habe ich sehr schnell nach dem Öffnen der Seite gespeichert. Danach stand in der Adresszeile `…/edit?duration=unlimited&managementFee=run`, die Seite lud neu, mein Wert war weg, und es kam keine Meldung. Es wurde nichts gespeichert, und Dwello hat nichts dazu gesagt (das Formular wurde offenbar abgeschickt, bevor die Seite fertig geladen war).
- Die Hilfe beim Akonto ist sehr lang (elf Zeilen bei 150 %). «Kündigungstermin», «amtliches Formular» und «nichtig» machen mir Angst, ob ich das Akonto überhaupt erhöhen darf. Dass Thomas Weber einverstanden ist, kommt im Text nicht vor: Muss ich trotzdem ein Formular schicken?
- «Monatlich total» wird beim Tippen sofort auf CHF 1’420.00 nachgerechnet. Das ist schön, sagt aber nicht, ab wann das gilt. Ich würde denken, er zahlt jetzt schon 1’420.
- Der Kasten oben auf der Bearbeiten-Seite ist voll mit Texten zu Todesfall, Scheidung und Geschäftsräumen. Den Akonto-Teil musste ich lange suchen.
- Auf der Mietvertragsseite steht «2 Abrechnungen fehlen» (2023, 2022). Das hat nichts mit meiner Aufgabe zu tun, hat mich aber verunsichert.
- Das Hauptmenü ist bei 150 % hinter dem Knopf mit den drei Strichen («Menü öffnen») versteckt. Gefunden habe ich es, aber nicht sofort.

## Aufgabe geschafft: nein

Gescheitert ist Schritt 1, «Akonto CHF 220 ab 1. Januar 2026 eintragen und speichern». Ich habe es dreimal ohne Erfolg versucht: 220 bei 150 %, 220.00 bei 200 % und Speichern ganz ohne Änderung. Ein Datum konnte ich nie eingeben. Die Schritte 2 (was zeigt die Vertragsseite), 3 (tieferes Akonto ab 1. Juli 2025) und 4 (CHF 220 wieder entfernen) waren deshalb nicht möglich. Auf der Vertragsseite steht weiterhin Akonto CHF 200.00, gespeichert wurde nichts.

## Aufwand

Etwa 25 Minuten und 15 Durchgänge (Übersicht, Menü, Mietverträge, Vertrag, Bearbeiten, Eingeben, Speichern, mehrmals). Am meisten Zeit hat die Suche nach «Gültig ab» gekostet.

## Ablauf

1. **Übersicht → Mietverträge.** Erwartet: ein Menüpunkt «Mietverträge». Gesehen: Das Menü ist hinter «Menü öffnen» versteckt, darin steht «Mietverträge». In Ordnung.
2. **Liste der Mietverträge.** Erwartet: Thomas Weber finden. Gesehen: Eine Zeile «Thomas Weber, Wohnung A1 · Seepark Residenz, Laufend, seit 01.04.2022», Nettomiete CHF 1’200.00, Monatlich total CHF 1’400.00, dazu «Bearbeiten». Gut verständlich.
3. **Seite des Mietvertrags.** Erwartet: das Akonto und vielleicht einen Knopf «Akonto ändern». Gesehen: «Akonto CHF 200.00» unter «Miete pro Monat». Oben die Knöpfe «Bearbeiten», «Beenden», «Löschen». Ich habe «Bearbeiten» genommen.
4. **Mietvertrag bearbeiten, Feld «Akonto pro Monat (optional)».** Erwartet: neben oder unter dem Betrag ein Feld «Gültig ab». Gesehen: nur das Betragsfeld (200.00). Die Hilfe darüber spricht von «Gültig ab», aber ein solches Feld gibt es auf der ganzen Seite nicht. Auch nach dem Eintippen von 220 und Tab kam keines dazu (Screenshot 06/10: Akonto-Feld mit 220, darunter gleich «Nebenkostenpauschale»). Hier war ich verwirrt: Habe ich etwas übersehen?
5. **«Änderungen speichern» (Versuch 1, schnell).** Erwartet: gespeichert, zurück zur Vertragsseite. Gesehen: Die Seite lud neu, mit seltsamer Adresse, mein Wert war weg, keine Meldung.
6. **«Änderungen speichern» (Versuch 2, Seite fertig geladen).** Erwartet: gespeichert, oder eine Frage nach dem Datum. Gesehen: roter Kasten «Der Mietvertrag wurde nicht gespeichert. Beim Speichern ist ein Fehler aufgetreten. Versuchen Sie es später erneut.» (Screenshot 13: roter Kasten über «Abbrechen» und «Änderungen speichern».)
7. **Versuch 3: «220.00» bei 200 % Zoom.** Gleiche Meldung.
8. **Gegenprobe: ohne Änderung speichern** (Thomas Weber, dann Nina Brunner). Erwartet: geht problemlos. Gesehen: dieselbe Fehlermeldung. Speichern geht also überhaupt nicht.
9. **Zurück auf die Vertragsseite.** Es steht weiterhin «Akonto CHF 200.00».

## Verwirrung

- **«Gültig ab»:** Die Hilfe verweist auf ein Feld, das es nicht gibt. Das ist für mich das Schlimmste: Ich denke, ich sei zu dumm, es zu finden.
- **«Kündigungstermin», «amtliches Formular», «nichtig»:** Ich weiss nicht, wann der nächste Kündigungstermin von Thomas Weber ist. Dwello könnte mir das Datum ausrechnen oder zeigen. Ob es auch bei einer freiwilligen Erhöhung ein Formular braucht, verstehe ich nicht.
- **«Akonto» und «Nebenkostenpauschale»:** Der Unterschied ist erklärt, aber erst nach langem Lesen.
- **«Monatlich total»:** Dass der Betrag sofort auf 1’420 springt, lässt mich glauben, die Erhöhung gelte ab heute.
- **Fehlermeldung:** «Versuchen Sie es später erneut». Wann ist «später»? Und was mache ich, wenn es dann auch nicht geht?

## Fehlerrisiken

- Wenn Speichern ginge, aber ohne Datumsfeld, würde ich eine Erhöhung womöglich rückwirkend für den ganzen Vertrag eintragen, und die Abrechnungen 2022/2023 zögen dann das falsche Akonto ab.
- Ein Klick auf Speichern, bevor die Seite fertig geladen ist, verwirft meine Eingabe stillschweigend. Ich würde glauben, es sei gespeichert.
- Wegen «Versuchen Sie es später erneut» würde ich es tagelang wieder versuchen, statt Hilfe zu holen.

## Vorschläge

- **P-1:** Mietvertrag Thomas Weber öffnen → «Bearbeiten» → ohne Änderung oder mit Akonto 220 auf «Änderungen speichern». Es kommt die Fehlermeldung, die Antwort ist 400 mit dem Fehlertext oben. Speichern muss wieder gehen, für Verträge mit und ohne Akonto ab einem Datum.
- **P-2:** «Bearbeiten» → beim Akonto einen anderen Betrag eintippen. Es erscheint kein «Gültig ab». Ein Datumsfeld «Gültig ab» direkt unter dem Akonto, mit Hilfetext und Beispiel (zum Beispiel 01.01.2026). Ideal wäre der nächste Kündigungstermin als Vorschlag.
- **P-3:** Vertragsseite Thomas Weber → nur «Akonto CHF 200.00». Zeigen, ab wann das Akonto gilt, ein künftiges Akonto als «ab 01.01.2026: CHF 220.00» darunter, und einen klar benannten Weg, ein falsch eingetragenes Akonto wieder zu entfernen.
- **P-4:** Die Meldung soll sagen, was nicht ging und was ich tun kann (etwa: Eingaben prüfen, oder wenn es wieder passiert, den Support informieren), nicht nur «später erneut».

## Nicht geprüft

- Was die Vertragsseite nach einem gespeicherten Akonto ab 01.01.2026 zeigt (Schritt 2): Speichern ging nicht (P-1), und es gab kein Datumsfeld (P-2).
- Die Meldung zu einem tieferen Akonto ab 01.07.2025 (Schritt 3): kein Datumsfeld, kein Speichern.
- Das Entfernen des Akontos von CHF 220 (Schritt 4): Es wurde nie gespeichert.
- Ob der Persona-Build vielleicht nicht zum Backend passt: Das kann ich als Nutzerin nicht beurteilen. Der Build in `/tmp/persona-app` ist von 18:22, das Backend auf 3301 meldet «ok».
