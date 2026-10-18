# Fachreview #429, Runde 2: Nebenkostenpauschale pro Monat (Feature-Review)

Gegenstand: `git diff 4e1cb9c7 fa9cc056` im Worktree `review-429-fach` (bei fa9cc056). Geprüft wurden die neuen und geänderten Texte in `messages/{de,fr,it,en}.json`, die Glossarzeilen in `UBIQUITOUS_LANGUAGE.md`, der Schritt «Miete» und die Prüfung (`RentStep.svelte`, `contract-wizard.ts`), die Vertragsseite (`ContractTerms.svelte`, `contracts/[id]/+page.server.ts`), die monatlichen Kosten der Wohnung (`MonthlyCostsCard.svelte`, `server/apartment.ts`) und die Mietvertragsliste. Vorheriger Bericht: `docs/reviews/429-fachreview-1.md`. Er nennt die Fedlex-Wortlaute (Art. 257a Abs. 2, 257b Abs. 1 und 269d Abs. 3 OR, Art. 4 VMWG). Den Wortlaut von Art. 4 Abs. 2 VMWG («Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.») habe ich mit `mmx search` noch einmal geprüft. Er stimmt.

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | erledigt | Der Satz zur Nebenkostenpauschale steht jetzt am Ende von `contracts_no_advance_text`. Damit bezieht sich «Sonst» wieder auf «kein Akonto». Zum neuen Wortlaut siehe V-13. |
| M-1 | Mietrecht | erledigt | Die Warnung wurde nach dem Entscheid umgesetzt: `flatRateNotice` (`contract-wizard.ts:90`) erscheint in RentStep, also im Schritt «Miete» und im Bearbeitungsformular (`ContractForm.svelte:312`). Der Text entspricht wörtlich dem Entscheid. Die Bedingung lautet: Pauschale > 0, Akonto 0, mindestens ein Häkchen. Ist noch nichts gewählt, gelten alle Häkchen als gesetzt (Regel 12). Die Warnung blockiert nicht. |
| V-2 | Verwalter | erledigt | Die Pauschale ist in `RENT`, `lastRent`, `rentOf` und `ListedContract` aufgenommen, dazu gibt es das Szenario `contract-new.feature:187` und einen Unit-Test. |
| V-3 | Verwalter | erledigt | Das Szenario verwendet den Mischfall (Akonto 50): Nachzahlung CHF 104.70. |
| V-4 | Verwalter | erledigt | `contract-new.feature:200`: «erfährt …, wo er eine Nebenkostenpauschale einträgt». |
| V-5 | Verwalter | Minor (offen, kleiner) | Liste, Vertragsseite und Historie rechnen jetzt alle mit `monthlyTotal`. Ohne Test mit Pauschale bleiben das laufende Total in `RentStep.svelte:27` und `monthlyTotal` selbst (`contract-history.ts:10`), das die Liste und die Mieterseite nutzen. Fix: ein Unit-Test für `monthlyTotal` mit `flatRateUtilityCharge`. |
| V-6 | Verwalter | erledigt | `contract-edit.feature:193`: «zeigt der Mietvertrag das Monatlich total». |
| V-7 | Verwalter | erledigt | Die Hilfe fordert jetzt zum Handeln auf: «Entfernen Sie unten bei «Vereinbarte Nebenkosten» das Häkchen …». |
| V-8 | Verwalter | Minor (offen) | Dass die Pauschale beim Erstellen gespeichert wird, prüft weiterhin kein Szenario. `contract-new.feature:181` endet in der Prüfung. |
| V-9 | Verwalter | Minor (offen) | Für das PDF ohne Pauschale gibt es keinen Test. Laut grep liest kein Service ausser `contract.service.ts:42` das Feld, darum heute ohne Risiko. |
| V-10 | Verwalter | Nit (offen) | Glossar «Nebenkostenpauschale»: «Sie wird nicht abgerechnet» und «rechnet sie aber nie ab» stehen in derselben Zeile. |
| V-11 | Verwalter | erledigt | «Fester Betrag pro Monat». |
| V-12 | Verwalter | Nit (offen) | `contracts_agreed_costs_none_text` (`de.json:765`) verweist noch nicht auf das neue Feld. |
| M-2 | Mietrecht | Minor (offen) | `contracts_running_text` (`de.json:692`) nennt nur die «Mietzinserhöhung», die Pauschale nicht. Ob dafür Art. 269d Abs. 1 oder Abs. 3 OR gilt, ist weiterhin **unsicher**. |
| V-13 | Verwalter | Minor (neu) | Der angehängte Satz liest sich in fr, it und en als Aufforderung, immer eine Pauschale zu erfassen: «Saisissez en plus un forfait …», «Inserisca inoltre un forfait …», «Enter a flat-rate utility charge as well …». Auch im Deutschen hängt «zusätzlich» direkt an «bezahlt sie ganz mit der Nebenkostenabrechnung». Fix (Bedingung statt «zusätzlich»): de «Bezahlt der Mieter eine Nebenkostenpauschale, tragen Sie sie bei «Nebenkostenpauschale pro Monat» ein.», fr «Si le locataire paie un forfait de frais accessoires, saisissez-le sous « Forfait de frais accessoires par mois ».», it «Se l’inquilino paga un forfait per le spese accessorie, lo inserisca in «Forfait per le spese accessorie al mese».», en «If the tenant pays a flat-rate utility charge, enter it under «Flat-rate utility charge per month».» Der Product Owner bestätigt den Wortlaut, denn #429 legt nur fest, dass ein Satz angehängt wird. |
| V-14 | Verwalter | Minor (neu) | Der Titel `contracts_flat_rate_warning_title` «Pauschale und angekreuzte Nebenkosten» steht im selben Schritt wie die Auswahl «Verwaltungspauschale» (`RentStep.svelte:106`). «Pauschale» allein ist dort mehrdeutig, im Glossar steht «Nicht zu verwechseln mit der Verwaltungspauschale». Fix: «Nebenkostenpauschale und angekreuzte Nebenkosten» (fr «Forfait de frais accessoires et frais accessoires cochés», it «Forfait per le spese accessorie e spese accessorie selezionate», en «Flat-rate utility charge and ticked utility costs»). Der Warntext selbst ist entschieden und bleibt. |
| V-15 | Verwalter | Nit (neu) | en `contracts_flat_rate_warning_text`: «Dwello still bills them all ticked utility costs» ist ungrammatisch. Fix: «Dwello still bills them for all ticked utility costs.» |

Es gibt keinen offenen Blocker oder Major.

## Rechenprüfung

- Prüfung im Assistenten (`contractSummary`): 950 + 0 Akonto + 120 Pauschale + 0 Zusatzmiete ergibt 1’070.00 ✓. Mit leerer Pauschale (`amount('')` = 0) bleibt es bei 950.00 ✓.
- Laufendes Total in RentStep: Die Eingabe «1'070» wird normalisiert, dann wird summiert. 950 + 120 = 1’070.00 ✓.
- Wohnung 3.01: 800 + 150 + 100 = 1’050.00 ✓. Ohne Pauschale wird die Zeile in `MonthlyCostsCard` ausgeblendet (wie beim Akonto), das Total bleibt 950.00 ✓.
- Abrechnung Marc Huber: 245/366 × 732 = 490.00, + 3 % = 504.70. Akonto 8 × 50 = 400.00, Saldo Nachzahlung 104.70 ✓. Randfall Rückerstattung: Akonto 100 statt 50 ergibt 504.70 − 800.00 = Rückerstattung 295.30. Die Pauschale ändert daran nichts, denn `calculation.service.ts` liest `flatRateUtilityCharge` nicht (grep) ✓.
- Übernahme: `kept('0.00')` ergibt '' (eine Null bleibt leer, wie im Übernahmetext), `kept('80.00')` ergibt '80.00' ✓. Mieterwechsel: Bruno Meier (bis 2025-12-31, Pauschale 80) wird bei Anna Keller ab 2027-01-01 vorgeschlagen ✓.
- Warnung, Randfälle: Akonto «0.00» oder leer und Pauschale «0.50» ergibt die Warnung. Akonto «50» ergibt keine (Mischfall, wie entschieden). Keine Kategorien vorhanden und `agreedCategoryIds` undefiniert ergibt keine (Unit-Test) ✓.
- Migration: `DEFAULT 0 NOT NULL`. Bestehende Mietverträge erhalten 0, ihr Monatlich total ändert sich nicht ✓.

## Bestätigt

- **Nie abgerechnet, nicht auf dem PDF:** Laut grep liest im Backend nur `contract.service.ts:42` das Feld, die Abrechnung und das PDF lesen es nicht. Das entspricht Art. 4 Abs. 1 und 2 VMWG, wo Abrechnung und Pauschale zwei getrennte Wege sind.
- **Überall, wo das Akonto steht:** Das Feld steht in der Prüfung (`contract-wizard.ts:166`), auf der Vertragsseite (`ContractTerms.svelte:41`, wie das Akonto auch bei 0) und in den monatlichen Kosten der Wohnung (wie das Akonto nur bei > 0). Sonst zeigt die App das Akonto nirgends: grep über `src/routes` und `src/lib` (die Galerie ausgenommen).
- **Monatlich total überall:** Prüfung, RentStep, Vertragsseite, Liste (`totalRent: monthlyTotal(c)`), Historie und Mieterseite (`monthlyTotal`) sowie die Wohnung zählen die Pauschale mit.
- **Glossar:** «Monatlich total» = Nettomiete + Zusatzmiete + Akonto + Nebenkostenpauschale ist richtig. Der Satz «die Nebenkostenpauschale rechnet sie nicht ab» entspricht Art. 4 Abs. 2 VMWG. Die Zeile «Nebenkostenpauschale» mit `flat_rate_utility_charge` stimmt mit dem Schema überein. Beide Änderungen hat der Product Owner erlaubt.
- **Hilfe** (`contracts_flat_rate_help`, alle vier Sprachen): Der Inhalt ist richtig. Die Verweise auf «Vereinbarte Nebenkosten», «Frais accessoires convenus», «Spese accessorie pattuite» und «Agreed utility costs» entsprechen `contracts_agreed_costs_label`, und die Liste steht tatsächlich weiter unten (`RentStep.svelte:139`).
- **Übersetzungen:** Die Begriffe entsprechen `docs/design/i18n-begriffe.md:66` (forfait de frais accessoires / forfait per le spese accessorie / flat-rate utility charge) und `:67` (montant à payer / importo dovuto / amount due; remboursement / rimborso / refund). «décompter à» und «tolga la selezione» folgen den bestehenden Texten.
- **Warntext:** Er entspricht wörtlich dem Entscheid in #429, fr und it sind sinngleich.

## Fehlende Begriffe

Keine. Für V-13 und V-14 braucht es kein neues Issue, weil es Wortlaute innerhalb von #429 sind. Der Product Owner bestätigt sie im Issue.

## Nicht bestätigt

- **M-2:** Ob die Erhöhung einer Nebenkostenpauschale unter Art. 269d Abs. 1 oder Abs. 3 OR fällt, ist **unsicher**. Ich habe nur den Normtext gelesen (Runde 1), keine Rechtsprechung.
- **«forfait de frais accessoires»:** Ob in der Westschweiz «forfait de charges» üblicher ist, ist **unsicher**. Das ❓ in `i18n-begriffe.md:66` bleibt bis #342.
- **Laufzeit:** Ich habe weder die Bildschirme in fr, it und en angesehen noch E2E oder Unit-Tests ausgeführt, nur Code und Texte gelesen. Auch wie die beiden Hinweise wirken, wenn Akonto-Hinweis und Pauschale-Warnung untereinander stehen, habe ich nicht im Browser geprüft.
- **Demo-Daten:** `backend/demo/demo-data.sql` setzt keine Pauschale. Ob die Demo eine zeigen sollte, ist kein Gegenstand dieses Reviews.
