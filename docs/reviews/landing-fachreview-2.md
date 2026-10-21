# Fachreview Landing Page, Runde 2 (Delta)

Gegenstand: `git diff 9d79191 43e4b9b -- marketing/index.html marketing/i18n docs/installation.md` (Worktree `review-landing-fach2`, detached bei 43e4b9b). Vorheriger Bericht: `docs/reviews/landing-fachreview-1.md`.

## Status der IDs aus Runde 1

| ID | Status |
|---|---|
| R-1 | Produktentscheid (Repository wird später öffentlich); bleibt offen bis dahin, nicht Teil dieses Deltas |
| R-2 | Erledigt: `marketing/i18n/{fr,it,en}.json` tragen die neuen Texte |
| R-3 | Erledigt: «Was dann nach aussen geht, steht unter Datenschutz» |
| R-4 | Erledigt: `installation.md:50` |
| R-5 | Erledigt: Hero «…oder, wenn Sie es so einrichten, bei einem Anbieter Ihrer Wahl», Tabelle «lokal oder bei Ihrem Anbieter» |
| R-6 | Erledigt: `installation.md:50` (Art. 9 DSG) |
| R-7 | Erledigt: `installation.md:59` |
| V-1 | Erledigt: Hero, Installieren und FAQ nennen «Updates und regelmässige Datensicherungen» durch die Hilfsperson |
| V-2 | Erledigt: `installation.md:39,48` |
| V-3 | Erledigt |
| M-1 | Erledigt: «Die Schlussabrechnung nach dem Auszug gleicht jeden Betrag aus.» (alle vier Sprachen) |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-2 | Mietrecht | Minor | `index.html:863` FAQ «…und automatische Tests prüfen, dass es diese Regeln einhält»: «diese Regeln» sind das ganze OR und die ganze VMWG; die Tests prüfen nur die Regeln, die Dwello umsetzt (bewusst nicht z.B. Art. 7 Abs. 2 VMWG, `UBIQUITOUS_LANGUAGE.md:190`). Fix: «Dwello rechnet nach dem Obligationenrecht und der Verordnung über die Miete (VMWG), und automatische Tests prüfen die Regeln daraus, die Dwello umsetzt.» (fr/it/en entsprechend) |
| V-4 | Verwalter | Minor | IT nennt das Gebäude neu viermal «edificio» (`marketing/i18n/it.json:290,299,301,319`), sonst «immobile»; Glossar `docs/design/i18n-begriffe.md:9`: Gebäude = «immobile». Fix: «Dall’immobile al conteggio, fino all’inquilina», «i costi dell’immobile» (2×), «registri il Suo immobile» |
| V-5 | Verwalter | Minor | `index.html:478` Schrittlabel «Im Frühling» bei «Abrechnungen erstellen»: gilt nur für das Kalenderjahr; Dwello kennt auch Juli–Juni und November–Oktober (`UBIQUITOUS_LANGUAGE.md:168`), dann wird im Herbst bzw. Winter abgerechnet. Fix: «Nach Periodenende» (fr «Après la fin de la période», it «Dopo la fine del periodo», en «After the period ends»); dieselbe Annahme steht schon vor dem Delta im Schlussaufruf `:875` «Im Frühling ist die Abrechnung schnell gemacht» → «Ist die Abrechnungsperiode vorbei, ist die Abrechnung schnell gemacht.» |

Keine Blocker, keine Major.

Geprüft: Schritte «…Mietverträge mit den vereinbarten Nebenkosten und dem Akonto erfassen» und «Dwello zieht das vereinbarte Akonto ab; fehlende Zahlungen regeln Sie ausserhalb der Abrechnung» (`index.html:476,478`) stimmen wörtlich mit `UBIQUITOUS_LANGUAGE.md:177` («Akontobeiträge») und `:52`, `:56` überein; fr «acompte/acomptes», «frais accessoires convenus», it «acconto/acconti», «spese accessorie pattuite», en «advance payment(s)», «agreed utility costs» nach `i18n-begriffe.md:39-41`. Lift-Beispiel (`index.html:541`): Rechnung MZ-2025-001 CHF 1'690.00, Schlüssel «Per Unit», sechs Wohnungen (`backend/demo/demo-data.sql:19-26,131`); 1'690.00 / 6 = 281.666… → CHF 281.67, gleich wie das PDF (`tests/ui-screenshots/statement-pdf.ts:53`); 6 × 281.67 = 1'690.02 ist übliche Rappenrundung pro Anteil, nicht irreführend; dass 2.02 und 3.02 leer stehen, ändert ihren Anteil nicht (den trägt der Vermieter, `UBIQUITOUS_LANGUAGE.md:190`, so auch `index.html` «Die Nebenkosten einer leeren Wohnung trägt der Vermieter»). Hans Müller 2025: Vertrag ab 01.03.2021, Akonto 240.00 → Akontobeiträge 2'880.00; Kostenanteil 3'095.82 − 2'880.00 = 215.82 → 215.80 (auf 5 Rappen zugunsten des Mieters, `statement-pdf.ts:93`, Persona-Läufe `marco-b1.md:31`); «zahlt nach» = Nachzahlung, fr/it/en korrekt. «Verordnung über die Miete (VMWG)» / OBLF / OLAL / «Tenancy Ordinance (VMWG)» nach `i18n-begriffe.md:62`. «bis 50 Wohnungen» ist Zielgruppe (FAQ «bis zu 50»), keine technische Grenze, passt zu «keine Limite pro Wohnung». «0 Daten gehen an uns»: keine Telemetrie, kein Aufruf an dwello.ch in `src/` und `backend/src/`. Hero «einfacher gemacht»: nicht überprüfbare Werbeaussage ohne Tatsachenbehauptung, keine Irreführung. Heizprofil «Im Januar … mehr als im Sommer»: Mittelland Januar 17.5 %, Juni bis August 0 % (`backend/migrations/0002_stammdaten.sql:74-76`). `installation.md` Sicherung/Wiederherstellung mit `--clean --if-exists` und Hinweis «replaces the data» korrekt.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- UWG-Anwendbarkeit auf ein kostenloses Open-Source-Angebot (für «einfacher gemacht», «0 Daten gehen an uns», FAQ): **unsicher**, wie in Runde 1. `mmx search` lieferte keine Fedlex-Fundstelle, `WebFetch` auf `fedlex.admin.ch/eli/cc/1988/223_223_223/de` lädt nur die Startseite; Wortlaut von Art. 3 Abs. 1 lit. b UWG daher nur aus Runde 1 übernommen.
- Ob das Bild `shots/statement-light.webp` in fr/it/en dieselbe Abrechnung (Hans Müller, CHF 215.80) zeigt wie der Text: Bilder nicht geöffnet; die Alt-Texte der Abrechnung nennen in allen Sprachen Hans Müller.
