# Review C, Runde 1 – Schweizer Datumsfeld TT.MM.JJJJ

Unabhängiges Code-Review (CC) von f3ad329, af22a6b und den Merges bis adcd484, mit Playwright in den Browsersprachen en-US (Zeitzone New York) und de-DE. Alle Datumsfelder zeigen TT.MM.JJJJ, unmögliche Daten werden abgelehnt, das Formular sendet JJJJ-MM-TT, 390 px ohne seitliches Scrollen, axe ohne Verstösse. Jede Behandlung mit einem Test, der vorher scheiterte.

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CC-1 | kritisch | Wer die Punkte selbst tippt, erhält «31..12.2024» und eine Fehlermeldung | doppelte Punkte werden zusammengefasst (DOM-Test mit der Eingabefolge) |
| CC-2 | hoch | Szenario und `typeDate` prüften die Maske nicht (`fill`, «30.02.» scheiterte am Doppelpunkt) | `typeDate` tippt Taste für Taste; Szenario tippt «15.01.2026» mit Punkten und «30022025» |
| CC-3 | hoch | Nach `form.reset()` (Tankbestand gespeichert) sendete das versteckte Feld das alte Datum, die Worte blieben | `reset` des Formulars leert Text, Wert und Worte (DOM-Test) |
| CC-4 | mittel | Nach einer Fehlermeldung beim Speichern blieb «gibt es nicht» beim Verlassen verborgen | eigene Meldung nur beim Verlassen oder Senden (auch per Enter); Test |
| CC-5 | mittel | «31.12.24» und eingefügtes «2024-12-31» galten als unmögliches Datum | beide werden gelesen; «,» und «/» nicht mehr (CC-8) |
| CC-6 | mittel | Datum in Worten nicht in `aria-describedby`, Live-Region entstand erst mit dem Inhalt; Fehler beim Verlassen nicht angesagt | Worte immer vorhanden und mit dem Feld verbunden; Fehler beim Verlassen in einer Live-Region (`assertive`) |
| CC-7 | niedrig | Zahlungsfrist: Enter mit unmöglichem Datum sendet, Seitenmeldung ohne Grund | offen: das Feld zeigt den Grund; die Seitenmeldung stammt vom Backend |
| CC-8 | niedrig | `max` ungenutzt, Trennzeichen «,» «/», eigener Beispieltext | entfernt; Hilfe «Format TT.MM.JJJJ.» mit `example` wie andere Felder |
| CC-9 | niedrig | `testid` optional («undefined-words»), Picker-Bedienbarkeit offen | `testid` Pflicht; Picker offener Punkt |
| CC-10 | niedrig | offene-punkte veraltet, Entscheid fehlt | nachgeführt (`offene-punkte.md`, `design-decisions.md`) |
| (vorher) | niedrig | «heute» in UTC (Rechnungsdatum, bezahlt am) | `localToday()` |
