# Fachreview #741, Runde 1 (Schritt 1, vor der Umsetzung)

Worktree: review-741-fach, Commit 5b2b844.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | «mit welcher Periode Sie beginnen, spielt keine Rolle» (contracts_statements_missing_text, alle vier Sprachen) stimmt beim Übertrag nicht. Neuer Text: «Beginnen Sie mit der ältesten Periode». |
| V-2 | Verwalter | Minor | Der Hinweis für mehrere Perioden «Haben Sie eine dieser Perioden ausserhalb von Dwello abgerechnet?» verleitet dazu, «Abgerechnet bis» für eine jüngere Periode einzutragen. Das Datum gilt aber für alles bis zu diesem Tag, eine ältere offene Periode verschwindet dann aus der Warnung (UBIQUITOUS_LANGUAGE.md:51). Fix: neutral fragen, ohne «eine dieser Perioden» (Texte unten). |
| V-3 | Verwalter | Minor | it «Allestire il conteggio {period}» steht in der Einzahl. Der Abrechnungslauf erstellt die Abrechnungen aller Mietverträge des Gebäudes, darum gehört die Mehrzahl nach i18n-begriffe.md:166 hin: «Allestire i conteggi {period}». Auch fr «Établir {period}» hat kein Objekt (C-14): «Établir les décomptes {period}». |
| V-4 | Verwalter | Minor | «für alle Mietverträge des Gebäudes» sagt mehr als der Lauf tut: Er rechnet nur Mietverträge ab, die in der Periode noch keine Abrechnung haben (backend/src/services/statement-run.service.ts:3 «which of them have a statement there already (a run bills those no more)»). Fix: «…, die noch keine Abrechnung haben» (Texte unten). |
| V-5 | Verwalter | Minor | contracts_statements_missing_text nennt ein Bedienelement: «Jede Schaltfläche mit «abrechnen»» (de), «Chaque bouton» (fr), «Ogni pulsante» (it), «Each «Bill» button» (en). Das widerspricht Vorgabe 2 (Persona Helga P-8). Fix: die Texte unten, sie nennen kein Bedienelement. |

## V-1 (Major)

**Beleg:** messages/de.json:1991 «mit welcher Periode Sie beginnen, spielt keine Rolle». Ebenso in fr («vous pouvez commencer par n’importe quelle période»), it und en.

- Ein Übertrag (Saldo unter CHF 5, UBIQUITOUS_LANGUAGE.md:191) geht nur in eine *spätere* Abrechnung desselben Mietvertrags: backend/src/services/carry-over.ts:69–80, `prev.period_end < ${start}`.
- Ist die jüngere Abrechnung (2025) schon versendet, wenn die ältere (2024) mit einem Übertrag erledigt wird, kann keine Abrechnung ihn mehr verrechnen: carry-over.ts:33–39 `later.period_start > period_end and later.carried_from_id is distinct from id`. Der Übertrag wird zum offenen Übertrag, den der Liegenschaftsverwalter von Hand ausgleicht (UBIQUITOUS_LANGUAGE.md:192).
- Ist die jüngere Abrechnung noch ein Entwurf, wird sie «nicht aktuell» (`carryChanged`, carry-over.ts:90) und muss neu berechnet werden.

**Nachgerechnet:**
- (a) Erst 2024 abrechnen: Saldo 2024 CHF −3.00, erledigt. Danach 2025 abrechnen: Saldo CHF 120.00 + Übertrag −3.00 = CHF 117.00. Kein Handgriff nötig.
- (b) Erst 2025 abrechnen und versenden: CHF 120.00. Danach 2024: CHF −3.00, erledigt. Der Übertrag ist offen, und der Vermieter muss CHF 3.00 von Hand auszahlen.
- (c) Randfall Saldo 2024 = CHF 0.00 (oder über CHF 5): Die Reihenfolge ist egal.

Die Reihenfolge spielt also eine Rolle. In der Praxis rechnet man ohnehin chronologisch ab.

**Fix:** Den Satz durch «Beginnen Sie mit der ältesten Periode» ersetzen (Texte unten). Hat der Product Owner «Reihenfolge egal» in #142 ausdrücklich entschieden, geht V-1 als `needs-decision` an ihn. Die Warnung listet die Perioden mit der neuesten zuerst (MissingStatement.svelte:9). Das widerspricht der Empfehlung nicht, die Reihenfolge der Liste zu ändern bleibt aber eine Option für den Product Owner.

## Entscheid zu Vorgabe 1 (was bleiben muss)

- **Weg:** «Der Mietvertrag hat Mietstage … aber noch keine Nebenkostenabrechnung». Das sagt der Titel schon («Abrechnung {period} fehlt», «{count} Abrechnungen fehlen»).
- **Bleibt:**
  - erst die Rechnungen der Periode erfassen;
  - abgerechnet werden alle Mietverträge des Gebäudes ohne Abrechnung, damit der Verwalter weiss, dass auch andere Mieter betroffen sind (#142);
  - bei mehreren Perioden: die älteste zuerst (statt «egal», V-1);
  - «Abgerechnet bis» beim Bearbeiten des Mietvertrags.
- **Zusammenlegen:** Text und Hinweis dürfen als ein Absatz erscheinen. Die Schlüssel sollen aber getrennt bleiben, denn der Text fehlt, wenn keine Periode zum Assistenten führt (MissingStatement.svelte:20–26), der Hinweis nicht.
- **Hinweis:** Einzahl und Mehrzahl haben jetzt denselben Wortlaut. Einer der beiden Schlüssel darf darum entfallen.
- **Knöpfe:**
  - de «{period} abrechnen» bleibt.
  - en «Bill {period}» bleibt (passt zu «Billed until»).
  - Einzelne Periode: dashboard_create_statements («Abrechnungen erstellen | Établir les décomptes | Allestire i conteggi | Create statements») ist richtig, weil der Lauf alle Mietverträge des Gebäudes betrifft.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_statement_missing_text | Erfassen Sie zuerst die Rechnungen der Periode. Abgerechnet werden alle Mietverträge des Gebäudes, die noch keine Abrechnung haben. | Saisissez d’abord les factures de la période. Les décomptes sont établis pour tous les contrats de bail de l’immeuble qui n’en ont pas encore. | Registri prima le fatture del periodo. I conteggi vengono allestiti per tutti i contratti di locazione dell’immobile che non ne hanno ancora uno. | Enter the invoices of the period first. Statements are created for all rental contracts of the building that do not have one yet. |
| contracts_statements_missing_text | Beginnen Sie mit der ältesten Periode und erfassen Sie zuerst ihre Rechnungen. Abgerechnet werden alle Mietverträge des Gebäudes, die noch keine Abrechnung haben. | Commencez par la période la plus ancienne et saisissez d’abord ses factures. Les décomptes sont établis pour tous les contrats de bail de l’immeuble qui n’en ont pas encore. | Cominci dal periodo meno recente e ne registri prima le fatture. I conteggi vengono allestiti per tutti i contratti di locazione dell’immobile che non ne hanno ancora uno. | Start with the oldest period and enter its invoices first. Statements are created for all rental contracts of the building that do not have one yet. |
| contracts_statement_missing_billed_elsewhere | Schon ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein. | Déjà décompté en dehors de Dwello ? Indiquez « Décompté jusqu’au » en modifiant le contrat de bail. | Già conteggiato al di fuori di Dwello? Inserisca «Conteggiato fino al» modificando il contratto di locazione. | Already billed outside Dwello? Enter «Billed until» when you edit the rental contract. |
| contracts_statements_missing_billed_elsewhere | Schon ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein. | Déjà décompté en dehors de Dwello ? Indiquez « Décompté jusqu’au » en modifiant le contrat de bail. | Già conteggiato al di fuori di Dwello? Inserisca «Conteggiato fino al» modificando il contratto di locazione. | Already billed outside Dwello? Enter «Billed until» when you edit the rental contract. |
| contracts_statement_create | {period} abrechnen | Établir les décomptes {period} | Allestire i conteggi {period} | Bill {period} |

In fr gilt dieselbe Leerstelle vor «?» und in « » wie in den bestehenden fr-Texten (dort ein gewöhnliches Leerzeichen).

Text für den Szenarioschritt (contract-detail.feature:301), statt TEXT_FROM_FACH_REVIEW:

`Beginnen Sie mit der ältesten Periode und erfassen Sie zuerst ihre Rechnungen. Abgerechnet werden alle Mietverträge des Gebäudes, die noch keine Abrechnung haben.`

## Nicht bestätigt

- Die Zeilenzahl der neuen Texte bei 390 px habe ich nicht gemessen, nur die Zeichen gezählt:
  - Mehrperiodentext de: rund 330 auf 160 Zeichen.
  - Hinweis de: rund 135 auf 105 Zeichen.

  Ob fr «Établir les décomptes 01.07.2023 – 30.06.2024» auf voller Breite einzeilig bleibt, zeigt erst das Szenario oder die Persona.
- Ob der Product Owner «Reihenfolge egal» in #142 entschieden hat: Das Issue habe ich nicht gelesen. Gesucht habe ich in docs/nebenkostenabrechnung-anforderungen.md und docs/anforderungen-vertragsende.md («Reihenfolge», «beliebig»), ohne Treffer.
- Fedlex habe ich nicht abgefragt: Die Texte machen keine Rechtsaussage. Übertrag und «Abgerechnet bis» sind Regeln von Dwello, keine des OR oder der VMWG.

Geprüft: Titel (Einzahl/Mehrzahl), Begriffe der neuen Texte gegen UBIQUITOUS_LANGUAGE.md und i18n-begriffe.md (Abrechnungsperiode, Abgerechnet bis / décompté jusqu’au / conteggiato fino al / billed until, erfassen / saisir / registrare / enter, Abrechnungen erstellen); keine Mietrechtsfrage im Gegenstand.
