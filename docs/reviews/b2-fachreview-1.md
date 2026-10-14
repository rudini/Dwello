# Fachreview #121 (B-2), Runde 1: Filter der Abrechnungsliste

Geprüft: Commit `c539568` im Worktree `review-b2-fach`, Szenarien
- `tests/e2e/features/contract-detail.feature:184-195` «Abrechnungen eines Mietvertrags anzeigen»
- `tests/e2e/features/statement-generate.feature:155-165` «Nur die Entwürfe des Abrechnungslaufs anzeigen»

sowie die geplanten Texte aus dem Auftrag. Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md`, Issue #121, die Step-Definitionen und `tests/e2e/fixtures/backend.ts` (wie die Abrechnungen entstehen). Die Änderung filtert eine Liste und berührt keine Regel des Mietrechts und keine Formel; Fedlex war deshalb nicht nötig (siehe «Nicht bestätigt»).

## Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | Der Szenarioname «Nur die Entwürfe des Abrechnungslaufs» verspricht mehr, als der Filter liefert (Periode + Status + allenfalls Gebäude) |
| V-2 | Verwalter | Nit | Die geplanten Sätze sind Satzfragmente ohne Verb; Vorschlag mit «Sie sehen …» |
| V-3 | Verwalter | Nit | Zwei Mietverträge desselben Mieters in derselben Wohnung ergeben denselben Satz |

Keine Blocker, keine Major, keine Befunde der Rolle Mietrecht.

### V-1 (Minor): Szenarioname behauptet «des Abrechnungslaufs»

**Beleg:** `statement-generate.feature:156` «Nur die Entwürfe des Abrechnungslaufs anzeigen». Issue #121, Done means: «Entwürfe ansehen» verlinkt `status=draft` plus `periodStart`/`periodEnd`, plus `building` nur bei genau einem Gebäude. Glossar: «**Abrechnungslauf** | Erstellt die Abrechnungen einer Periode für ausgewählte Gebäude …»; `statement-generate.feature:41` «Erneut erstellen ergänzt nur: ein Mietvertrag mit einer Abrechnung dieser Periode erhält keine zweite».

**Warum falsch:** Die Liste zeigt alle Entwürfe der Abrechnungsperiode (im Gebäude, wenn der Lauf nur eines hatte), nicht die des Laufs:
- Entwürfe derselben Periode und desselben Gebäudes aus einem früheren Lauf erscheinen mit (gerade beim «Ergänzen» ist das der Normalfall);
- bei einem Lauf über mehrere Gebäude fehlt der Gebäudefilter, und Entwürfe derselben Periode aus Gebäuden, die nicht im Lauf waren, erscheinen auch.

Fachlich ist das Verhalten richtig und sogar erwünscht: Der Verwalter will vor dem Versand alle Entwürfe der Periode prüfen, nicht nur die eben ergänzten. Falsch ist nur das Versprechen im Namen. Das Szenario selbst prüft korrekt nur die Periode (Lea Graf 2023 ist ein Entwurf im selben Gebäude, `fixtures/backend.ts:148-156` legt ihn über `statements/generate` an, also als Entwurf; ausgeschlossen wird er nur durch die Periode).

**Fix:** Szenario umbenennen, z.B. «Nach dem Erstellen die Entwürfe der Abrechnungsperiode anzeigen». Die UI-Texte versprechen nichts über den Lauf und bleiben so. Kein Verhaltenswechsel nötig.

### V-2 (Nit): Satzfragmente statt kurzer Sätze

**Beleg:** geplante Texte «Abrechnungen des Mietvertrags von {Mieter}, Wohnung {Nummer} ({Gebäude}).» und «Abrechnungen der Abrechnungsperiode {Beginn} – {Ende}.»; CLAUDE.md, Design-Regeln: «short sentences», Zielgruppe mit wenig Erfahrung. Das Issue verlangt, dass die Seite «says … which statements it shows».

**Warum:** Ein Fragment mit Punkt liest sich wie ein Titel; ob die Liste gefiltert ist, sagt es nur indirekt.

**Fix (Vorschlag):**
- «Sie sehen die Abrechnungen des Mietvertrags von {name}, Wohnung {apartment} ({building}).»
- «Sie sehen die Abrechnungen der Abrechnungsperiode {start} – {end}.»
- Link «Alle Abrechnungen anzeigen» bleibt (Verb, eindeutig).

Die Begriffe stimmen mit dem Glossar und dem bestehenden Wortlaut überein: «Mietvertrag von {name}, Wohnung {apartment}» wie `contracts_end_title` (`messages/de.json:624`), «Abrechnungsperiode {start} – {end}» wie `invoices_billed_period` (`messages/de.json:730`) und `dashboard_task_missing_period_text` (`:231`). Ohne «Sie sehen …» sind die Texte auch annehmbar.

### V-3 (Nit): Gleicher Satz für zwei Verträge

**Beleg:** Glossar «**Mietvertrag** | … Pro Wohnung darf sich kein Vertrag mit einem anderen überschneiden.» Nacheinander sind zwei Verträge desselben Mieters in derselben Wohnung also möglich (z.B. neuer Vertrag nach Auszug und Wiedereinzug).

**Warum:** Der Satz «… Mietvertrag von Anna Keller, Wohnung 2.01 (Ahornhof)» unterscheidet die beiden nicht. Selten, und der Verwalter kommt von der Detailseite genau eines Vertrags, deshalb nur Nit.

**Fix:** Optional den Mietbeginn ergänzen («… Wohnung 2.01 (Ahornhof), ab 01.04.2024»), oder als bekannt hinnehmen.

## Bestätigt

- **Begriffe:** «Abrechnung» als Kurzform von Nebenkostenabrechnung entspricht dem Glossar («Bei Mieterwechsel erhält jeder Mietvertrag eine eigene Abrechnung») und den bestehenden Steps («für … gibt es die Nebenkostenabrechnung {int}» bzw. «die Abrechnung {int} im Gebäude»). «Entwurf» = Status `draft` (Glossar, Abrechnungsstatus), «Abrechnungsperiode», «Abrechnungslauf», «Mietvertrag», «Wohnung», «Gebäude» richtig verwendet. «Liste» ist kein Fachbegriff, nur Bildschirmsprache, unproblematisch.
- **Filter pro Mietvertrag** ist fachlich der richtige Schnitt: Glossar «Nebenkostenabrechnung | Jährliche Abrechnung … pro Mietvertrag». Ein Filter nach Mieter oder Wohnung wäre bei Mieterwechsel bzw. Umzug falsch.
- **Setup contract-detail:** Anna Keller (2.01) und Ben Meier (2.02) ab 01.04.2024, je eine Abrechnung 2025 (01.01.–31.12.2025, `fixtures/backend.ts:152-153`): beide Verträge laufen die ganze Periode, eine Abrechnung je Vertrag; realistisch. Zwei Mieter im gleichen Gebäude und gleicher Periode zeigen, dass nach Vertrag und nicht nach Gebäude oder Periode gefiltert wird.
- **Setup statement-generate:** Lea Graf in 3.02 vom 01.01. bis 31.12.2023 mit Abrechnung 2023 (Entwurf); der Lauf 2024 für Lindenhof erstellt Eva Frei und Marc Huber, Lea Graf nicht (Vertrag endete vor der Periode). Marc Huber sichtbar, Lea Graf 2023 nicht: prüft genau den Periodenfilter, im selben Gebäude und Status. Realistisch (Vorjahresentwurf noch nicht versendet ist in der Praxis häufig). Es prüft keine Anzahl, wie das Issue für parallele Szenarien verlangt.
- **Datumsformat** «01.01.2024 – 31.12.2024» entspricht dem Issue und den bestehenden Texten (Halbgeviertstrich mit Leerzeichen).
- **Gebäude im Satz:** Die Wohnungsnummer ist nur pro Gebäude eindeutig (Glossar «Wohnungsnummer … pro Gebäude eindeutig»), daher ist «({Gebäude})» im Vertragssatz nötig und richtig. Im Periodensatz fehlt das Gebäude; das genügt, weil Gebäude und Status auf der Seite als sichtbare Filter erscheinen (`src/routes/statements/+page.svelte:27-29, 97-101`: Status-Tabs und `StatementSearch` mit `building`).

## Fehlende Begriffe

Keine. Alle Begriffe der Szenarien und Texte stehen im Glossar.

## Nicht bestätigt

- **Recht:** Keine Rechtsfrage berührt (Liste filtern, keine Beträge, Fristen oder Inhalte der Abrechnung); Fedlex nicht abgefragt. Am Rand: Die Grundlage von `contract-detail.feature` legt Verträge ohne Akonto an (`fixtures/backend.ts:141` `monthlyAdvancePayment: '0'`). Eine Nebenkostenabrechnung setzt voraus, dass Nebenkosten besonders vereinbart sind (Art. 257a Abs. 2 OR, **unsicher**, Wortlaut nicht auf Fedlex nachgesehen); Akonto 0 schliesst das nicht aus. Für diesen Filter ohne Belang und vor der Änderung schon so.
- **Anzeige der Statuszähler unter Filter:** ob die Zähler der Status-Tabs den Vertrags- oder Periodenfilter berücksichtigen, habe ich nicht geprüft (Code, nicht Gegenstand dieses Reviews; gesucht in `src/routes/statements/+page.svelte`). Zeigen sie die ungefilterten Zahlen, widerspricht das dem Satz über der Liste: bitte im Code-Review prüfen.
- **Abrechnungsperiode nicht Kalenderjahr** (Juli–Juni, November–Oktober, Glossar Konfiguration): Die Szenarien prüfen nur das Kalenderjahr. Ob «Entwürfe ansehen» die tatsächlichen Daten des Laufs übergibt, gehört in den DOM-Test des Links (Done means), nicht ins Szenario.
