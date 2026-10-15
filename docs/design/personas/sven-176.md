# Sven – Issue #176: Kategorie erfassen mit KI-Prüfung (nur Tastatur, Screenreader)

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt über den Accessibility-Baum (`ariaSnapshot`), den Fokus (`document.activeElement` mit Label und `aria-describedby`) und die Live-Regionen (Mitschnitt jeder Textänderung in `role=status`, `role=alert`, `aria-live`).
App: http://localhost:3300 (Persona-Stack, Demo-Daten). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/sven-176/` (`s1.mjs` bis `s11.mjs`, `*.png`).

## Befunde (nur was die Änderung betrifft)

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neue Kategorie, Prüfung läuft | Während der KI-Prüfung wird der Knopf gesperrt («Bitte warten …»), dadurch fällt der Fokus auf den Seitenkörper (`BODY`). Der Screenreader sagt nichts: weder «Bitte warten» noch «Die KI prüft»; die Statusregion bleibt leer, bis das Ergebnis da ist. Mit einer langsamen KI höre ich sekundenlang Stille und weiss nicht, ob mein Enter etwas ausgelöst hat. |
| P-2 | Major | Neue Kategorie, nach der Prüfung | Die KI überschreibt eine Auswahl, die ich selbst getroffen habe, ohne es zu sagen: «Nicht umlagefähig» gewählt, dann «Von der KI prüfen lassen», danach ist «Umlagefähig» ausgewählt. Angesagt wird nur «Vorschlag der KI: Umlagefähig …»; dass meine Auswahl geändert wurde, sagt niemand. Der Fokus bleibt auf dem Knopf, ich müsste zurück in die Gruppe, um es zu merken. Risiko: Kosten landen falsch in der Nebenkostenabrechnung. |
| P-3 | Minor | Neue Kategorie, nach der Prüfung | Auch ohne vorherige Auswahl ist nach dem Vorschlag die Option schon angekreuzt. Die Ansage «Vorschlag der KI: Umlagefähig» lässt offen, ob das nur ein Vorschlag ist oder bereits übernommen wurde. |
| P-4 | Minor | Neue Kategorie, Prüfung läuft | Wenn ich während der Prüfung weiter mit Tab gehe (z. B. ins Feld «Reihenfolge»), reisst mir die App beim Eintreffen des Ergebnisses den Fokus zurück auf «Von der KI prüfen lassen». Tippe ich gerade, landen Leertaste oder Enter auf dem Knopf und lösen eine neue Prüfung aus. |
| P-5 | Minor | Neue Kategorie | Enter im Feld «Name» (und auf einem Optionsfeld) speichert nicht, sondern startet die KI-Prüfung und setzt die Auswahl. Ich erwarte bei Enter im Formular «Kategorie speichern» oder nichts. |
| P-6 | Minor | Neue Kategorie, Speichern abgelehnt | Nach dem abgelehnten Speichern landet der Fokus richtig auf «Umlagefähig», die Fehlermeldung «Wählen Sie, ob die Kosten umlagefähig sind.» kommt aber erst ganz am Schluss: Gruppenname, dann die Hilfe der Gruppe (fünf lange Sätze mit OR-Artikeln), dann der Name der Option, ihre Beschreibung doppelt, erst dann der Fehler. Eine Ansage über eine Live-Region gibt es nicht. |
| P-7 | Minor | Neue Kategorie | Bei jeder Option wird die Beschreibung zweimal gelesen: Sie steckt im Namen («Umlagefähig Die Kosten fliessen in die Nebenkostenabrechnung.») und nochmals als Beschreibung (`aria-describedby`). |
| P-8 | Nit | Neue Kategorie, KI unsicher | «Die KI ist nicht erreichbar oder ist sich nicht sicher.»: Ich erfahre nicht, welcher der beiden Fälle vorliegt, also ob ein erneuter Versuch etwas bringt. |
| P-9 | Nit | Neue Kategorie, Speichern abgelehnt | Nachdem ich eine Option gewählt habe, bleibt die Gruppe als «ungültig» markiert und die Fehlermeldung hängt weiter an jeder Option, bis ich speichere. |

## Beobachtungen (ohne Schwere)

- Nach jedem Seitenwechsel (Liste → «Neue Kategorie», Speichern → Liste) beginnt der Fokus entweder auf dem Seitenkörper oder auf der Überschrift `h1`; der Seitentitel wird über die Live-Region angesagt. Nach dem Speichern steht der Fokus auf «Kategorien» (h1) und «Kategorie «… Sven» gespeichert» wird angesagt: das ist gut.
- Bis zum Feld «Name» muss ich 20 Mal Tab drücken (Navigation mit 13 Einträgen plus Brotkrümel); der Link «Zum Inhalt springen» hilft.
- Prüfung mit leerem Namen: Der Fokus geht auf «Name», ungültig, «Name ist erforderlich»: verständlich.
- Hilfetext beim Häkchen «Heizkosten nach dem Heizprofil verteilen» ist sehr lang (vier Sätze) und wird bei jedem Fokus vorgelesen.
- Der Hilfetext der Gruppe nennt «Liegenschaft», sonst ist im Formular von «Gebäude» nicht die Rede; mir als Sven nicht wichtig, nur bemerkt.
- In der Liste der Kategorien sind Löschknöpfe für benutzte Kategorien gesperrt, aber erreichbar über den Accessibility-Baum; der Grund steht als Absatz über der Liste.

## Aufgabe geschafft: ja

Gespeichert (alle drei von mir angelegt):
- «Gartenpflege Sven»: KI schlug «Umlagefähig» vor, ich habe auf «Nicht umlagefähig» gewechselt und gespeichert; in der Liste steht «Nicht umlagefähig».
- «Lift Sven»: zuerst ohne Auswahl gespeichert (abgelehnt), dann «Umlagefähig» gewählt und gespeichert.
- «Bewachung Sven»: KI ohne Vorschlag, zuerst ohne Auswahl gespeichert (abgelehnt), dann «Nicht umlagefähig» gewählt und gespeichert.

Nicht gespeichert (nur angefangen, Seite verlassen): «Gartenpflege Sven Test», «Hauswart Sven Test».

## Aufwand

Rund 25 Minuten, 11 Durchläufe (Skripte). Pro Kategorie etwa 20 Tab bis zum Namen, 3 Tab bis zum Prüfknopf, 7 bis 10 Tab bis «Kategorie speichern».

## Ablauf (erwartet / gesehen)

1. **Übersicht → Kategorien.** Erwartet: Link in der Navigation. Gesehen: Tab 14 «Kategorien», Enter. Liste mit 21 Kategorien, Link «Kategorie erfassen» bei Tab 19 (Screenshot `02-kategorien.png`).
2. **«Kategorie erfassen».** Erwartet: Formular, Fokus am Anfang. Gesehen: Überschrift «Neue Kategorie», Fokus auf dem Seitenkörper; Tab 20 = «Name» mit Beschreibung «Beispiel: Treppenhausreinigung». Danach «Beschreibung (optional)», dann die Gruppe «Umlagefähige Nebenkosten» (Rolle radiogroup, beschrieben durch den langen Hilfetext), keine Option vorgewählt, dann der Knopf «Von der KI prüfen lassen», dann eine leere Statusregion (`03-neu-leer.png`).
3. **Name «Gartenpflege Sven», Tab zum Prüfknopf, Enter.** Erwartet: Ansage «KI prüft …», Fokus bleibt auf dem Knopf. Gesehen: Knopf wird zu «Bitte warten …», gesperrt, aria-busy; der Fokus fällt auf `BODY` (mit künstlich 4 s Verzögerung nachgestellt, `06-busy.png`). Nichts wird angesagt (P-1). Nach dem Ergebnis steht der Fokus wieder auf dem Knopf.
4. **Was schlägt die KI vor und warum?** Erwartet: Ansage mit Vorschlag und Grund. Gesehen: Statusregion (höflich) sagt «Vorschlag der KI: Umlagefähig / Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b Abs. 1 OR).» Das kam an. «Umlagefähig» ist aber schon angekreuzt, ohne dass es gesagt wird (P-3, `05-garten-ergebnis.png`).
5. **Auswahl ändern.** Erwartet: Shift+Tab in die Gruppe, Pfeil. Gesehen: Shift+Tab landet auf «Umlagefähig» (ausgewählt), Pfeil runter wählt «Nicht umlagefähig». Die Statusmeldung der KI bleibt stehen, das ist für mich in Ordnung (`07-geaendert.png`).
6. **Speichern.** 8 Tab bis «Kategorie speichern», Enter. Gesehen: Liste, Fokus auf h1 «Kategorien», Ansage «Kategorie «Gartenpflege Sven» gespeichert», Eintrag mit «Nicht umlagefähig» (`07-gespeichert.png`).
7. **«Lift Sven» ohne Auswahl speichern.** Erwartet: Fehler, Fokus auf die Gruppe, Fehler vorgelesen. Gesehen: Seite bleibt, Fokus auf «Umlagefähig», Gruppe «ungültig», Option beschrieben mit «Die Kosten fliessen in die Nebenkostenabrechnung. | Wählen Sie, ob die Kosten umlagefähig sind.» Keine Live-Ansage; der Fehler kommt nur über den Fokus und erst nach dem langen Hilfetext (P-6, P-7, `08-lift-abgelehnt.png`). Name «Lift Sven» blieb erhalten. Pfeil wählt eine Option; Fehler bleibt stehen (P-9, `08-lift-gewaehlt.png`). Gespeichert mit «Umlagefähig».
8. **«Bewachung Sven» prüfen.** Erwartet: Hinweis, dass die KI unsicher ist. Gesehen: Statusregion «Kein Vorschlag der KI / Die KI ist nicht erreichbar oder ist sich nicht sicher. Wählen Sie selbst, ob die Kosten umlagefähig sind.»; keine Option gewählt, Fokus auf dem Knopf (`09-bewachung.png`). Ein zweiter Druck auf den Knopf sagt die Meldung erneut an (die Region wird geleert und neu gefüllt): gut. Ohne Auswahl speichern: wie bei Schritt 7 (`09-bewachung-abgelehnt.png`). Dann «Nicht umlagefähig» gewählt, gespeichert, Ansage «Kategorie «Bewachung Sven» gespeichert».
9. **Zusatzprüfungen.** Manuelle Auswahl «Nicht umlagefähig», dann KI prüfen: Auswahl wird stumm auf «Umlagefähig» gesetzt (P-2, `10-manuell-dann-ki.png`). Enter im Feld «Name»: startet die Prüfung statt zu speichern, Fokus springt auf den Prüfknopf (P-5). Tab während laufender Prüfung bis «Reihenfolge»: Fokus wird beim Ergebnis zurück auf den Knopf gezogen (P-4). Prüfung mit leerem Namen: Fokus auf «Name», «Name ist erforderlich» (`10-leerer-name.png`).

## Verwirrung, auch Begriffe

- «Vorschlag der KI: Umlagefähig»: Ist das übernommen oder nur empfohlen? Ich musste zurück in die Gruppe, um es herauszufinden.
- «nicht erreichbar oder nicht sicher»: zwei verschiedene Dinge in einem Satz.
- Der Gruppenhilfetext mit «Art. 257a–257b OR», «Art. 257a Absatz 2 OR» wird bei jedem Betreten der Gruppe ganz vorgelesen; die Kurzbeschreibungen der Optionen («fliessen in die Nebenkostenabrechnung», «trägt der Vermieter») haben mir mehr geholfen.
- Der Grund der KI zitiert «Art. 257b Abs. 1 OR», der Hilfetext schreibt «Absatz»: zwei Schreibweisen.

## Fehlerrisiken

- P-2: Wer zuerst selbst wählt und danach «zur Kontrolle» die KI fragt, speichert ohne es zu merken die KI-Auswahl. Bei «Umlagefähig» landen Kosten des Vermieters in der Abrechnung der Mieter.
- P-5: Enter im Namen wählt per KI eine Option; wer danach direkt speichert, hat die Frage nie bewusst beantwortet.
- P-4: Zurückgezogener Fokus während der Eingabe: Tastendrücke landen auf dem Prüfknopf und lösen erneute Prüfungen aus, die wiederum die Auswahl überschreiben können.

## Vorschläge

- **P-1:** Reproduktion: Neue Kategorie, Name eingeben, Tab zu «Von der KI prüfen lassen», Enter, bei langsamer Antwort (nachgestellt mit 4 s Verzögerung auf die Anfrage `?/propose`) den Fokus prüfen: `BODY`, Statusregion leer. Hilfe: Knopf nicht mit `disabled` sperren, sondern `aria-disabled="true"` (Fokus bleibt), und sofort in die Statusregion «Die KI prüft die Kategorie …» schreiben.
- **P-2:** Reproduktion: Name «Gartenpflege …», in der Gruppe «Nicht umlagefähig» wählen, Tab, Enter auf «Von der KI prüfen lassen»: «Umlagefähig» ist danach gewählt, angesagt nur der Vorschlag. Hilfe: Eine bestehende Auswahl nicht überschreiben (Vorschlag nur anzeigen, mit Knopf «Vorschlag übernehmen»), oder wenigstens ansagen «Ihre Auswahl wurde auf Umlagefähig geändert».
- **P-3:** Reproduktion: wie Schritt 3/4. Hilfe: Ansage ergänzen, z. B. «Vorschlag der KI: Umlagefähig. Die Auswahl ist gesetzt; Sie können sie ändern.»
- **P-4:** Reproduktion: Prüfung starten (langsame Antwort), zweimal Tab bis «Reihenfolge», Ergebnis abwarten: Fokus wieder auf dem Prüfknopf. Hilfe: Fokus nur zurücksetzen, wenn er noch auf dem Knopf bzw. auf dem Seitenkörper steht.
- **P-5:** Reproduktion: «Name» fokussieren, Text tippen, Enter: Prüfung statt Speichern. Hilfe: «Kategorie speichern» zur Standardaktion machen (z. B. den Prüfknopf als `type="button"` oder den Speicherknopf als ersten Absendeknopf im Formular).
- **P-6:** Reproduktion: Name «Lift …», ohne Auswahl Tab bis «Kategorie speichern», Enter: Fokus auf «Umlagefähig», Fehler zuletzt. Hilfe: Fehlermeldung zusätzlich in eine Live-Region oder zuerst in die Beschreibung der Gruppe (vor dem Hilfetext); Hilfetext kürzen oder hinter einen Link «Was ist umlagefähig?» legen.
- **P-7:** Reproduktion: Tab auf eine Option, Name und Beschreibung lesen. Hilfe: Beschreibung entweder nur über `aria-describedby` oder nur im Label, nicht beides.
- **P-8:** Reproduktion: «Bewachung …», Prüfen. Hilfe: zwei Meldungen: «Die KI ist nicht erreichbar. Versuchen Sie es später.» und «Die KI ist sich nicht sicher. Wählen Sie selbst.»
- **P-9:** Reproduktion: wie P-6, dann Pfeil auf eine Option: Gruppe weiter «ungültig». Hilfe: Fehler beim Wählen einer Option entfernen.

## Nicht geprüft

- Echter Screenreader (NVDA/VoiceOver): beurteilt über Accessibility-Baum, Fokus und Live-Regionen; wie laut und in welcher Reihenfolge ein echter Screenreader Statusregion und Fokuswechsel kombiniert, ist abgeleitet.
- Eine wirklich fehlschlagende KI-Anfrage (z. B. Status 500 auf `?/propose`): nicht verlangt; der Fall «nicht erreichbar» sieht nach der Meldung gleich aus wie «unsicher».
- Der Busy-Zustand mit der echten KI dauerte nur rund 0.3 s; die Beobachtungen zum Busy-Zustand stammen aus der künstlich verzögerten Anfrage (4–5 s).
- Bearbeiten einer bestehenden Kategorie und andere Sprachen (fr/it/en).
