# Fachreview #429, Runde 1: Nebenkostenpauschale pro Monat

Gegenstand: die @wip-Szenarien und ihre Steps in `git diff 4e59e224 11194778` (Worktree `review-429-fach`, detached bei 11194778) sowie die vorgeschlagenen Texte aus dem Auftrag: Feld, Hilfe, Zeilenlabel, Einschub in `contracts_no_advance_text` und die Glossarzeilen «Nebenkostenpauschale» und «Monatlich total». Massgebend ist der Abschnitt «Decided (product owner)» in #429.

Fedlex-Quellen (PDF-A aus dem Fedlex-Filestore, mit `pdftotext` gelesen):
- Art. 257a Abs. 2 OR (Fassung 1.10.2026): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»
- Art. 4 VMWG (Fassung 1.10.2025): «1 Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen. 2 Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.»
- Art. 4 al. 2 OBLF: «S’il les perçoit de manière forfaitaire, il doit se fonder sur la moyenne calculée sur …»; Art. 4 cpv. 2 OLAL: «In caso di computo forfettario, deve fondarsi sui valori medi calcolati su un periodo …»
- Art. 269d Abs. 3 OR: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.»

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Mit dem Einschub in `contracts_no_advance_text` bezieht sich das folgende «Sonst entfernen Sie … alle Häkchen» auf die Pauschale. Gelesen wird dann: «Wer eine Pauschale einträgt, lässt die Häkchen.» Weil ein neuer Mietvertrag mit allen Häkchen beginnt, rechnet Dwello dann pauschal bezahlte Nebenkosten zusätzlich ab. |
| M-1 | Mietrecht | Major (Produktentscheid) | Dwello kennt die Pauschale jetzt und rechnet trotzdem ohne jeden Hinweis alle angekreuzten Kategorien ab. Bei «Pauschale > 0, kein Akonto, alle Häkchen» (der Standard eines neuen Mietvertrags) zahlt der Mieter die Pauschale und dazu die ganze Abrechnung. Das widerspricht Art. 4 Abs. 2 VMWG. Es fehlt ein Plausibilitätshinweis, für den es einen Entscheid braucht. |
| V-2 | Verwalter | Major | Übernahme aus dem letzten Mietvertrag (#144): `lastRent`/`RENT` (`src/lib/contract-wizard.ts:220–244`) übernimmt nur Nettomiete, Zusatzmiete und Akonto. Die Pauschale bleibt leer, obwohl `contracts_rent_taken_over_text` sagt: «Die Beträge stammen aus dem letzten Mietvertrag … War ein Betrag dort 0.00, bleibt sein Feld leer.» Für die Pauschale ist das dann falsch, und das Monatlich total fällt zu tief aus. Ein Szenario dazu fehlt. |
| V-3 | Verwalter | Minor | Das Szenario `statement-generate.feature` «Die Nebenkostenpauschale zählt nicht in der Abrechnung» zeigt als erwartetes Verhalten genau den Fall aus M-1: Pauschale 100, kein Akonto, Hauswart angekreuzt, Nachzahlung 504.70. Besser ist der Mischfall aus #429: «der Mietvertrag von "Marc Huber" hat "50" Franken Akonto», dann Saldo «Nachzahlung CHF 104.70», und im Kommentar steht, welche Nebenkosten die Pauschale deckt. |
| V-4 | Verwalter | Minor | Der Einschub in den Akonto-Hinweis (offener Punkt von #429) wird von keinem Szenario geprüft. Fix: im Szenario #66 in `contract-new.feature:172 ff.` einen Step «…, dass er eine Nebenkostenpauschale bei «Nebenkostenpauschale pro Monat» einträgt» ergänzen. |
| V-5 | Verwalter | Minor | Laut Entscheid erscheint der Betrag überall, wo das Akonto steht. Die Szenarien prüfen nur Prüfung, Vertragsseite und das Total der Wohnung. Nicht geprüft sind die Zeile in `MonthlyCostsCard.svelte`, das laufende Total in `RentStep.svelte:28` (`contract-monthly-total`), die Mietvertragsliste, die Mieterseite und die Vertragshistorie. Die Summe wird an fünf Stellen gerechnet: `contract-wizard.ts:106`, `RentStep.svelte:28`, `contracts/+page.server.ts:53`, `contracts/[id]/+page.server.ts:194` und `contract-history.ts:11`. Mindestens Unit-Tests pro Stelle. |
| V-6 | Verwalter | Minor | `contract-edit.feature`, neues Szenario: Der Step «sieht … den monatlichen Mietzins "CHF 1’070.00"» prüft das Monatlich total. Laut Glossar ist «Mietzins» aber die Nettomiete (`UBIQUITOUS_LANGUAGE.md:48`). Mit Pauschale liest sich das Szenario darum falsch: Der Mietzins ist 950. Fix: ein Step «… beträgt das Monatlich total "CHF 1’070.00"». Der Step bestand schon vorher, hier wird er aber erst irreführend. |
| V-7 | Verwalter | Minor | Hilfe `contracts_flat_rate_help`: «Nebenkosten, die die Pauschale abdeckt, erhalten unten … kein Häkchen» beschreibt nur einen Zustand. Dwello setzt aber alle Häkchen voraus, also muss der Vermieter handeln. Fix: «Entfernen Sie unten bei «Vereinbarte Nebenkosten» das Häkchen bei den Nebenkosten, die die Pauschale abdeckt.» |
| V-8 | Verwalter | Minor | `contract-new.feature`: Das Szenario endet in der Prüfung. Dass die Pauschale beim Erstellen gespeichert wird (anderer Weg als beim Bearbeiten), prüft kein Szenario. Fix: mit «vermietet» speichern und auf der Vertragsseite «zeigt der Mietvertrag die Nebenkostenpauschale» prüfen. |
| V-9 | Verwalter | Minor | Dass das PDF der Abrechnung die Pauschale nicht nennt (Entscheid 2026-10-17), hat keinen Test. Fix: ein Test auf der unteren Ebene (`pdf.service`), dass «Nebenkostenpauschale» bei einem Mietvertrag mit Pauschale nicht im Text steht. |
| M-2 | Mietrecht | Minor | Eine Erhöhung der Pauschale oder ein Wechsel von Pauschale zu Akonto in einem laufenden Mietvertrag ist eine einseitige Vertragsänderung (Art. 269d Abs. 3 OR). `contracts_running_text` spricht nur von «Mietzinserhöhung», und ein Laie zählt die Pauschale womöglich nicht dazu. Vorschlag: «Eine Erhöhung von Mietzins, Akonto oder Nebenkostenpauschale gilt frühestens …». Ob die Erhöhung einer Pauschale unter Abs. 1 oder Abs. 3 fällt, ist **unsicher**. |
| V-10 | Verwalter | Nit | In der Glossarzeile «Nebenkostenpauschale» steht «abgerechnet wird sie nicht» doppelt («Sie wird nicht abgerechnet» weiter vorne). Fix: im neuen Teil «… und zählt im Monatlich total.» |
| V-11 | Verwalter | Nit | Hilfe: «Fester Betrag» → «Fester monatlicher Betrag», passend zu «pro Monat». Ein Hinweis auf die Höhe (Art. 4 Abs. 2 VMWG, Durchschnitt dreier Jahre) wäre hilfreich, ist aber nicht nötig. |
| V-12 | Verwalter | Nit | `contracts_agreed_costs_none_text` («Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.») könnte jetzt auf das Feld verweisen: «… und tragen sie bei «Nebenkostenpauschale pro Monat» ein». |

## V-1 (Major): «Sonst» nach dem Einschub

**Beleg.** Heute (`messages/de.json:666`): «… Steht im unterschriebenen Mietvertrag ein Akonto, tragen Sie es ein. Sonst entfernen Sie unten bei «Vereinbarte Nebenkosten» alle Häkchen: …». Mit dem Einschub: «… tragen Sie es ein. Eine Nebenkostenpauschale tragen Sie bei «Nebenkostenpauschale pro Monat» ein. Sonst entfernen Sie … alle Häkchen».

**Warum falsch.** Bisher hiess «Sonst»: «kein Akonto». Das deckte die Pauschale und die Bruttomiete ab, beide ohne Häkchen. Nach dem Einschub heisst «Sonst»: «keine Pauschale». Wer eine Pauschale einträgt, liest also, dass er die Häkchen nicht entfernen muss. Alle Häkchen sind aber vorausgewählt (`nebenkostenabrechnung-anforderungen.md`, Regel 12: «Ein neuer Mietvertrag beginnt mit allen angekreuzt»). Die Folge: Dwello rechnet die pauschal bezahlten Nebenkosten zusätzlich ab, gegen Art. 4 Abs. 2 VMWG.

**Behebung.** Die beschlossenen Sätze bleiben unverändert, nur der Einschub kommt an eine andere Stelle, nämlich nach «Dann rechnet Dwello diesem Mieter keine Nebenkosten ab.»: «Eine Nebenkostenpauschale tragen Sie zusätzlich bei «Nebenkostenpauschale pro Monat» ein.» Danach folgt wie beschlossen «Sind Nebenkosten ohne Akonto vereinbart, …». fr, it und en entsprechend. Die Stelle des Einschubs hat #429 offen gelassen, ein neuer Entscheid ist also nicht nötig. Der Product Owner bestätigt den Wortlaut.

## M-1 (Major, braucht einen Produktentscheid): keine Warnung bei Pauschale und Häkchen

**Beleg.** Die Szenarien und die Hilfe verlassen sich darauf, dass der Vermieter die Häkchen selbst entfernt. In `statement-generate.feature` (neues Szenario) wird ein Mietvertrag mit Pauschale 100, ohne Akonto und mit angekreuztem Hauswart voll abgerechnet: «Nachzahlung CHF 504.70».

**Warum ein Problem.** Art. 4 Abs. 2 VMWG: «Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.» Pauschal erhobene Nebenkosten werden nicht abgerechnet. Ob eine angekreuzte Kategorie pauschal bezahlt ist, weiss Dwello nicht. Dass bei einem Mietvertrag mit Pauschale alle Häkchen gesetzt sind und kein Akonto eingetragen ist, ist aber fast immer ein Erfassungsfehler, und Dwello kann diesen Fall jetzt erkennen. Die Folge wäre eine unberechtigte Nachzahlung.

**Behebung (Vorschlag für ein Issue mit den Labels `fachlich`, `entscheiden`).** Im Schritt «Miete» und im Abrechnungsassistenten erscheint ein Hinweis, wenn eine Pauschale eingetragen ist, das Akonto 0 ist und Häkchen gesetzt sind: «Dieser Mieter bezahlt eine Nebenkostenpauschale. Dwello rechnet ihm trotzdem alle angekreuzten Nebenkosten ab. Entfernen Sie das Häkchen bei den Nebenkosten, die die Pauschale abdeckt.» Bis zum Entscheid bleibt V-1 der Schutz.

## V-2 (Major): Übernahme aus dem letzten Mietvertrag (#144)

**Beleg.** `src/lib/contract-wizard.ts:220`: `const RENT = ['baseRent', 'additionalRent', 'advancePayment'] as const;`. `lastRent` (`:229–244`) und `rentTakenOver` übernehmen und vergleichen nur diese drei Beträge. In `messages/de.json:783` steht: «Die Beträge stammen aus dem letzten Mietvertrag dieser Wohnung ({period}). War ein Betrag dort 0.00, bleibt sein Feld leer.»

**Warum falsch.** Das neue Feld steht im selben Schritt zwischen den übernommenen Beträgen. Hatte der Vormieter eine Pauschale von 120, bleibt das Feld leer. Der Hinweis sagt dann, der Betrag sei dort 0.00 gewesen. Beim Nachmieter fehlt die Pauschale also, und Monatlich total und Prüfung zeigen 120 zu wenig. In der Praxis übernimmt der Nachmieter die Nebenkostenregelung meist unverändert. Der Entscheid «shown everywhere the Akonto is shown» spricht auch dafür, die Pauschale wie das Akonto zu übernehmen.

**Behebung.** Die Pauschale in `RENT`, `lastRent` (`kept(last.flatRateUtilityCharge)`) und `ListedContract` aufnehmen und dazu ein Szenario «Nachmieter erfassen» mit Pauschale schreiben. Bestätigt der Product Owner das nicht (#144 nennt nur drei Beträge), muss der Übernahmetext die Beträge aufzählen. Das wäre eine Textänderung, die der Product Owner entscheidet.

## Rechenprüfung

- Wohnung 3.01: 800 + 150 Akonto + 100 Pauschale = 1’050.00 ✓. Mit Pauschale 0 ergibt sich 950.00 wie im bestehenden Szenario ✓.
- Neuer Mietvertrag: 950 + 120 = 1’070.00 ✓. Bearbeiten: 950 + 120 = 1’070.00 ✓.
- Abrechnung Marc Huber: 01.05.–31.12.2024 sind 245 Tage, 2024 hat 366 Tage. 732 / 366 = 2.00 pro Tag, × 245 = 490.00, + 3 % = 504.70 ✓. Saldo ohne Akonto: 504.70, gerundet auf 5 Rappen 504.70 ✓. Gegenprobe: Würde die Pauschale wie ein Akonto zählen, gälte 8 × 100 = 800 und damit «Rückerstattung CHF 295.30». Das Szenario unterscheidet die beiden Fälle also ✓.
- Mischfall (Vorschlag V-3): Akonto 50 für 8 volle Monate (`calculateTotalAdvancePayments`, `calculation.service.ts:290`) ergibt 400.00, Saldo 504.70 − 400.00 = Nachzahlung 104.70 ✓.
- Randfall Mieterwechsel: Eva Frei vom 01.01. bis 31.03.2024 hat 91 Tage, also 182.00 + 3 % = 187.46. Eine Pauschale ändert daran nichts, denn die Abrechnung liest das Feld nicht.

## Bestätigt

- Feld und Hilfe: «Dwello rechnet ihn nicht ab: keine Nachzahlung und keine Rückerstattung» folgt aus Art. 4 Abs. 1 und 2 VMWG, wo Abrechnung und Pauschale zwei getrennte Wege sind. «für im Mietvertrag vereinbarte Nebenkosten» entspricht Art. 257a Abs. 2 OR.
- Platz nach «Akonto pro Monat» und vor «Zusatzmiete»: Der Akonto-Hinweis steht direkt darüber (`RentStep.svelte:72–74`) und verweist so auf das nächste Feld. Das passt.
- Glossarzeile «Monatlich total»: Mit der Pauschale stimmt «der Betrag, den der Mieter laut Mietvertrag jeden Monat bezahlt» jetzt. Damit ist 66b-fachreview-1 V-2 erledigt. Der Satz zum Unterschied zwischen Akonto und Pauschale ist richtig.
- Glossarzeile «Nebenkostenpauschale» (neuer Teil): Sie ist richtig und widerspruchsfrei zum ersten Teil (Art. 257a Abs. 2 OR, Art. 4 Abs. 2 VMWG). Der Code `flat_rate_utility_charge` folgt dem Muster `monthly_advance_payment`. Bis zur Migration gehört «geplant (#429)» dazu, wie bei «Abgerechnet bis».
- Übersetzungen: Label und Zeile entsprechen `docs/design/i18n-begriffe.md:66` (forfait de frais accessoires / forfait per le spese accessorie / flat-rate utility charge). «par mois / al mese / per month» folgt `contracts_advance_label` (Acompte par mois / Acconto al mese / Advance payment per month).
- Szenarien: Die Wortwahl folgt dem Glossar (Nebenkostenpauschale, Monatlich total, Prüfung). Der Entscheid «nie abgerechnet» ist mit `@api` abgedeckt (siehe Rechenprüfung). Der Seed setzt die Pauschale per PUT wie das Akonto.
- Abrechnungsassistent: Nach dem Entscheid bleibt die Abrechnung wie heute. «Geleistete Akontobeiträge» und «Kosten über dem Akonto» betreffen nur das Akonto. Das ist richtig, denn die Pauschale wird nicht verrechnet.

## Fehlende Begriffe

Keine neuen. «Nebenkostenpauschale» und «Monatlich total» stehen schon im Glossar. Ihre neuen Wortlaute bestätigt laut #429 der Product Owner, dafür braucht es kein neues Issue. Neues Issue nur für M-1 (Labels `fachlich`, `entscheiden`).

## Nicht bestätigt

- Die Hilfe in fr, it und en: Der Auftrag nennt sie nicht («fr, it and en follow»), sie ist nicht geprüft.
- Fedlex hat für fr und it kein Nomen, nur «de manière forfaitaire» (OBLF Art. 4 al. 2) und «In caso di computo forfettario» (OLAL Art. 4 cpv. 2). Das ❓ bleibt, bis #342 geklärt ist. Ob in der Westschweiz «forfait de charges» üblicher ist als «forfait de frais accessoires», ist **unsicher** (Praxiswissen, keine Quelle geprüft).
- M-2: Ob die Erhöhung einer Nebenkostenpauschale unter Art. 269d Abs. 1 OR (Mietzinserhöhung) oder Abs. 3 (einseitige Vertragsänderung) fällt, ist **unsicher**. Das Formular ist in beiden Fällen nötig, der Normtext nennt die Pauschale aber nicht ausdrücklich.
- Ob die Mischform (Heizung mit Akonto, übrige Nebenkosten pauschal) in der Praxis üblich ist, ist **unsicher**, unverändert seit 66b-fachreview-1. Fedlex schliesst sie nicht aus.
- Bestehende Mietverträge, bei denen der Vermieter die Pauschale bisher als Akonto oder Zusatzmiete erfasst hat (66b, Helga P-1), werden nicht umgestellt. Ob dafür ein Hinweis nötig ist, habe ich nicht geprüft. Das ist kein Gegenstand dieses Diffs.
