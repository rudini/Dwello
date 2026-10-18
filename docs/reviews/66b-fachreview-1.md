# Fach-Review 66b, Runde 1 (Commit ac890cc0, vor der Umsetzung)

Gegenstand: die @wip-Szenarien in `git diff aa882117 ac890cc0` (`contract-new.feature:172–179`, `contract-edit.feature:176–185`, `statement-generate.feature:253–264`, Steps `tests/e2e/steps/contract-form.steps.ts:477–498`, Target `tests/e2e/targets/contract-form.ts:42`). Dazu die vorgeschlagenen Texte: (1) `contracts_no_advance_text` in vier Sprachen, (2) der Formsatz von #388 in `contracts_running_text_fixed_term` und `statements_akonto_raise_fixed_term`, (3) die Glossarzeile «Nebenkostenpauschale» und die Zeile in `docs/design/i18n-begriffe.md`.

Entscheide: #66 und #388 (über `gh api` gelesen, Stand 2026-10-17, beide «Decided (product owner)»). Den deutschen Wortlaut von #66 prüfe ich nur auf Rechtsfehler.

Gesetzestexte von Fedlex (Filestore, heruntergeladen und wörtlich gelesen): OR Fassung 1.1.2026 (`eli/cc/27/317_321_377/20260101/de`), VMWG Fassung 1.10.2025 (`eli/cc/1990/835_835_835/20251001/{de,fr,it}`).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Glossarzeile: «ein Mietvertrag mit Nebenkostenpauschale hat … keine vereinbarten Nebenkosten» ist rechtlich falsch, denn auch eine Pauschale muss vereinbart sein (Art. 257a Abs. 2 OR). Die Zeile schliesst ausserdem den üblichen Mischfall aus (Heizung mit Akonto, Übriges pauschal). |
| M-2 | Mietrecht | Minor | #388-Satz in `contracts_running_text_fixed_term`: «… sonst ist sie nichtig» stimmt nicht für die Staffelmiete. Gerade sie ist ein Fall von «ausser der Mietvertrag sieht sie vor», und für sie genügt seit 1.10.2025 die Schriftform (Art. 269d Abs. 5 OR). Der Fehler geht zugunsten des Mieters. |
| M-3 | Mietrecht | Minor | Glossarzeile: «muss den Durchschnittswerten dreier Jahre entsprechen» ist enger als das Gesetz. Art. 4 Abs. 2 VMWG sagt «auf Durchschnittswerte dreier Jahre abstellen». |
| V-1 | Verwalter | Minor (bestand vorher, wird sichtbarer) | «Dann rechnet Dwello diesem Mieter keine Nebenkosten ab» und «Er wird nicht abgerechnet» stimmen in Dwello nicht ganz. Eine umlagefähige Rechnung ohne Kategorie wird trotzdem verrechnet. Ausserdem erstellt der Abrechnungslauf auch für diesen Mietvertrag eine Nebenkostenabrechnung. |
| V-2 | Verwalter | Minor (bestand vorher) | Laut Glossar ist «Monatlich total» der Betrag, «den der Mieter laut Mietvertrag jeden Monat bezahlt». Die neue Zeile sagt aber «Dwello erfasst sie nicht». Bei einem Mieter mit Nebenkostenpauschale ist das Total also zu tief. |
| V-3 | Verwalter | Minor | Das Szenario #66 prüft den Satz nicht, der die Abrechnung ohne Akonto erlaubt («Sind Nebenkosten ohne Akonto vereinbart …»). Dieser Satz behebt den Rechtsfehler aus 66 M-1. |
| V-4 | Verwalter | Nit | Szenario #66: Der Titel sagt «fragt», das Formular gibt aber nur einen Hinweis. Der Step «ohne vereinbarte Nebenkosten alle Häkchen» passt nicht zum Fall Nebenkostenpauschale. |
| V-5 | Verwalter | Nit | fr «ne facture … aucuns frais accessoires» und it «non fattura»: Der PDF-Text sagt für «abrechnen» aber «décomptés» bzw. «conteggiate». |
| V-6 | Verwalter | Nit | en «the rental contract agrees no utility costs» ist ungewohnt. Besser: «provides for no utility costs». |
| V-7 | Verwalter | Nit | i18n-Zeile: Fedlex hat für fr/it kein Nomen, nur «de manière forfaitaire» bzw. «computo forfettario». Nach der Regel von `i18n-begriffe.md` gehört dazu ein ❓ (#342) oder ein Beleg. Ausserdem: im fr-Text geschützte Leerzeichen in « … » und vor « : ». |
| M-4 | Mietrecht | Nit | Der #388-Satz nennt nicht die Nichtigkeit bei Kündigungsandrohung (Art. 269d Abs. 2 lit. c OR). Das ist wie in `statements_akonto_raise` und war schon 66 M-6. Nur angleichen, wenn alle drei Texte geändert werden. |

---

## Bestätigt (mit Quelle)

- **Text 1, Kern (#66):** Der Text ist rechtlich richtig. Er behebt 66 M-1, weil er Nebenkosten ohne Akonto nicht mehr ausschliesst.
  - Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Der Fall «im Mietvertrag sind keine Nebenkosten vereinbart» deckt auch die Bruttomiete ab: Die Kosten sind dann im Mietzins enthalten.
  - Art. 4 VMWG: «1 Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen. 2 Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.» Daraus folgt: Eine Pauschale wird nicht abgerechnet. Alle Häkchen zu entfernen ist für Pauschale und für «keine vereinbart» richtig.
  - Art. 257c OR: «Der Mieter muss den Mietzins und allenfalls die Nebenkosten am Ende jedes Monats, spätestens aber am Ende der Mietzeit bezahlen, wenn kein anderer Zeitpunkt vereinbart oder ortsüblich ist.» Der letzte Satz («… bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung») ist deshalb zulässig.
  - «meist» ist als Einschränkung richtig.
- **Text 1, App:** Die Angaben im Text stimmen mit der App überein.
  - «unten bei «Vereinbarte Nebenkosten»» stimmt: `AgreedCategories` steht in `src/routes/contracts/new/RentStep.svelte:114–118` unter dem Hinweis (Z. 72–74).
  - Das Label `contracts_agreed_costs_label` lautet de «Vereinbarte Nebenkosten», fr «Frais accessoires convenus», it «Spese accessorie pattuite», en «Agreed utility costs» (`messages/*.json:756`). Das passt wörtlich zu allen vier Fassungen.
  - Der Titel bleibt «Kein Akonto» / «Pas d’acompte» / «Nessun acconto» / «No advance payment» (Z. 780).
  - Der Hinweis erscheint bei 0 und bei leerem Feld (`src/lib/contract-wizard.ts:77`: `parseFloat(values.advancePayment) > 0 ? null : …`) und blockiert nichts. Das entspricht #66.
  - Ohne angekreuzte Kategorie verrechnet `calculation.service.ts:378–379` keine Rechnung mit Kategorie. Zur Ausnahme siehe V-1.
- **Text 2 (#388) in `statements_akonto_raise_fixed_term`:**
  - Art. 269d Abs. 2 OR: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet; …»
  - Abs. 3: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.»
  - Die Ausnahme von Abs. 5 betrifft nur Mietzinserhöhungen nach Art. 269c OR. Für das Akonto bleibt das Formular also immer nötig. Der Satz ist hier ohne Einschränkung richtig, ausser bei M-4.
  - Dass die Akonto-Erhöhung unter Abs. 3 fällt, ist weiter unsicher (siehe «Nicht bestätigt»).
- **Text 2 in `contracts_running_text_fixed_term` für die Indexmiete:**
  - Art. 19 Abs. 2 VMWG: «Die Absätze 1 und 1bis gelten ferner sinngemäss, wenn der Vermieter den Mietzins einem vereinbarten Index anpasst.»
  - Formular und Begründung (Art. 19 Abs. 1 lit. a Ziff. 4 VMWG: «die klare Begründung der Erhöhung») sind also auch bei einer Indexmiete nötig. Ebenso nach stillschweigender Fortsetzung (Art. 266 Abs. 2 OR, dann gilt Art. 269d Abs. 1 OR).
  - Die Stelle des Satzes ist richtig. Er steht vor «Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.», und «eine Erhöhung» umfasst im Bearbeitungsformular auch das Akonto. Das deckt 66 M-3 für befristete Verträge ab.
- **fr/it/en von Text 2:** Die Fassungen stimmen mit `docs/reviews/w3f-fachreview-2.md:31–36` überein.
  - fr Art. 269d al. 2 «nulles … formule officielle … motifs»
  - it «nullo», «motiva»
  - Anrede vous/Lei
- **Glossarzeile, übrige Teile:**
  - «Er wird nicht abgerechnet: keine Nachzahlung und keine Rückerstattung» folgt aus Art. 4 Abs. 1/2 VMWG (zwei getrennte Wege).
  - «Nicht zu verwechseln mit der Verwaltungspauschale» behebt 66 V-2. Die Verwaltungspauschale ist Glossar Z. 154 und nach Art. 4 Abs. 3 VMWG etwas anderes.
  - «Dwello erfasst sie nicht» stimmt. RentStep hat nur Nettomiete, Akonto und Zusatzmiete.
- **i18n-Zeile, Begriffe:**
  - «frais accessoires», «spese accessorie» und «utility costs» passen zu `i18n-begriffe.md` (Nebenkosten).
  - «flat-rate utility charge» ist klar von «management fee» getrennt.
  - «forfait» und «forfettario» stützen sich auf Art. 4 al. 2 OBLF («S’il les perçoit de manière forfaitaire …») und Art. 4 cpv. 2 OLAL («In caso di computo forfettario …»). Siehe V-7.
- **Szenarien und Steps:**
  - Die Teiltexte, auf die die Steps prüfen, stehen wörtlich in den Vorschlägen: «meist eine Nebenkostenpauschale», «bei «Vereinbarte Nebenkosten» alle Häkchen», «begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig».
  - Der Satz in `statement-generate.feature:262` ist genau `statements_akonto_raise_fixed_term` mit dem #388-Satz.
  - Die Testid `advance-payment-notice` gibt es (`RentStep.svelte:73`).
  - Der Mietvertrag «befristet von 2024-01-01 bis 2099-12-31» ist laufend und befristet, also gilt `contracts_running_text_fixed_term`.
  - Die anderen Steps gab es schon (66-fachreview-1, «Steps»).

---

## M-1 (Major, Mietrecht/Verwalter): «hat … keine vereinbarten Nebenkosten»

**Beleg.** Vorgeschlagene Glossarzeile, letzter Satz: «Dwello erfasst sie nicht; ein Mietvertrag mit Nebenkostenpauschale hat kein Akonto und keine vereinbarten Nebenkosten.»

**Warum falsch.**
1. Rechtlich gilt Art. 257a Abs. 2 OR («nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat») auch für die Pauschale. Ein Mieter mit Pauschale hat also vereinbarte Nebenkosten, nur erhebt sie der Vermieter pauschal (Art. 4 Abs. 2 VMWG). Der Satz widerspricht auch dem Vorschlag in #369 («Vereinbarte Nebenkosten: Die Kategorien, die der Mietvertrag dem Mieter als Nebenkosten auferlegt (Art. 257a Abs. 2 OR)»). In der Zeile heisst «vereinbarte Nebenkosten» in Wahrheit «Häkchen in Dwello».
2. Aus Verwaltersicht ist der Mischfall üblich: Heiz- und Warmwasserkosten mit Akonto, andere Positionen (z.B. Kabel-TV, Hauswartung) pauschal. In Dwello trägt man dann das Akonto ein und setzt nur bei den abgerechneten Kategorien ein Häkchen. Die Zeile sagt dagegen, ein solcher Mietvertrag habe «kein Akonto». Ein Entwickler oder Laie, der sich auf das Glossar stützt, hält den Mischfall dann für unmöglich. Die Quelle für die Praxis ist unsicher, siehe «Nicht bestätigt».

**Behebung** (Wortlaut der Zeile, Rest unverändert):
> «… Nicht zu verwechseln mit der Verwaltungspauschale. Dwello erfasst sie nicht: Nebenkosten, die der Mieter pauschal bezahlt, erhalten bei «Vereinbarte Nebenkosten» kein Häkchen. Zahlt der Mieter alle Nebenkosten pauschal, hat sein Mietvertrag in Dwello kein Akonto und kein Häkchen; sind einzelne Nebenkosten pauschal und die übrigen mit Akonto vereinbart, erhalten nur die übrigen ein Häkchen.»

Der Hinweistext von #66 bleibt davon unberührt. Er erscheint nur ohne Akonto, und dort ist «alle Häkchen» richtig.

## M-2 (Minor, Mietrecht): Staffelmiete und der Formsatz im Hinweis zum befristeten Mietvertrag

**Beleg.** In `contracts_running_text_fixed_term` steht «Bei einem befristeten Mietvertrag ist eine Mietzinserhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.» Der Kommentar in `contract-edit.feature:176–177` sagt: «auch eine vorgesehene Erhöhung braucht das amtliche Formular».

Art. 269d Abs. 5 OR (Fedlex, in Kraft seit 1. Okt. 2025): «Für die Mitteilung von Mietzinserhöhungen, die in einer Vereinbarung nach Artikel 269c vorgesehen sind, genügt die schriftliche Form.» Auch Art. 19 Abs. 2 VMWG (Fassung 1.10.2025) nennt nur noch den Index, nicht die Staffel.

**Warum falsch.** Eine vertraglich «vorgesehene» Erhöhung ist eine Index- oder eine Staffelmiete (Art. 269b, 269c OR). Für die Staffelmiete stimmt «sonst ist sie nichtig» nicht. Der Fehler schadet niemandem: Wer das Formular benutzt, handelt gültig. Der Satz behauptet aber eine Nichtigkeit, die das Gesetz nicht vorsieht. Der Wortlaut ist vom Product Owner beschlossen. Gemeldet wird nur der Rechtsfehler.

**Behebung** (Entscheid nötig, am besten in #410 Punkt 2, wo Index- und Staffelmiete schon offen sind):
> «Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig. Für eine im Mietvertrag festgelegte Staffelmiete genügt ein Brief.»

Dafür bräuchte es den Glossarbegriff «Staffelmiete» (66-fachreview-1, «Fehlende Begriffe» 2). Den Kommentar im Szenario auf «die Indexmiete» einschränken oder «meist» schreiben. In `statements_akonto_raise_fixed_term` (Akonto) ist keine Änderung nötig.

## M-3 (Minor, Mietrecht): «entsprechen» statt «abstellen»

**Beleg.** Glossarzeile: «Er muss den Durchschnittswerten dreier Jahre entsprechen (Art. 4 Abs. 2 VMWG).» Fedlex: «Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.»

**Warum ungenau.** «Abstellen auf» heisst «sich stützen auf» und betrifft die Festlegung der Pauschale. «Entsprechen» klingt nach einer Pflicht, die Pauschale laufend gleich hoch wie den Durchschnitt zu halten. Bei einem Neubau ohne drei Jahre Kostenzahlen wäre das gar nicht erfüllbar.

**Behebung.** «Er muss auf den Durchschnittswerten dreier Jahre beruhen (Art. 4 Abs. 2 VMWG).» So stand es schon im Vorschlag 66-fachreview-1 V-2.

## V-1 (Minor, Verwalter; bestand vorher, der Text macht es sichtbarer): «rechnet keine Nebenkosten ab»

**Beleg.**
- `backend/src/services/calculation.service.ts:376–379`: «An invoice without a Kategorie has nothing to agree and is billed», mit dem Filter `!group.categoryId || agreed.includes(group.categoryId)`.
- `backend/src/db/schema.ts:274`: `is_valid_utility_cost … default(true)`.
- Eine Rechnung ohne Kategorie, zum Beispiel erfasst, während die KI nicht lief (`invoice-categorization.pg.test.ts:66`), fliesst also in die Abrechnung jedes Mietvertrags ein, auch in eine ohne Häkchen. Im Wizard habe ich keine Sperre dafür gefunden (Suche in `src/routes/statements/generate` und `src/lib/server/statement-generation.ts`).
- Ausserdem erstellt `contractsInPeriod` (`statement-generation.ts:98–102`) für jeden Mietvertrag mit Mietstagen eine Nebenkostenabrechnung, auch für einen Mieter mit Nebenkostenpauschale. Die Anforderung lautet: «Verträge mit Pauschale erhalten keine Abrechnung (oder nur informativ)» (`docs/nebenkostenabrechnung-anforderungen.md:38`).

**Nachgerechnet.**
- Normalfall: Gebäude mit 4 gleichen Wohnungen, Rechnung Kaltwasser 2'000 mit Kategorie, Mietvertrag ohne Häkchen. Die Position fällt weg, Eigene Nebenkosten 0, Verwaltungspauschale 3 % von 0 = 0, Akonto 0, Saldo 0.00. Es entsteht eine Abrechnung ohne Zahlteil. Das stimmt mit dem Text überein, ausser dass es überhaupt eine Abrechnung gibt.
- Randfall: zusätzlich eine Rechnung über 400 ohne Kategorie, Verteilschlüssel nach Wohnung. Der Anteil ist 100, der Saldo 100.00 Nachzahlung. Ein Mieter mit Pauschale würde dann zusätzlich zur Pauschale abgerechnet. Das widerspricht Art. 4 Abs. 2 VMWG und dem Text.

**Warum ein Problem.** Der neue Hinweis und die Glossarzeile versprechen ohne Ausnahme, dass keine Nebenkosten abgerechnet werden. Der Randfall braucht eine nicht kategorisierte Rechnung in der Periode. Die Rechnungsliste zeigt sie mit «Nicht kategorisiert – bitte Kategorie wählen» an. Deshalb ist das Minor.

**Behebung.** Entweder ein Mietvertrag ohne Häkchen erhält keine Rechnung ohne Kategorie, oder der Abrechnungslauf hält bei einer Rechnung ohne Kategorie an. Ob Mietverträge ohne vereinbarte Nebenkosten im Lauf eine leere Abrechnung erhalten, gehört als Frage in #407 («Decide categories and agreed Nebenkosten») oder #369. Den Text braucht es dafür nicht zu ändern.

## V-2 (Minor, Verwalter; bestand vorher): «Monatlich total» ohne Nebenkostenpauschale

**Beleg.** `UBIQUITOUS_LANGUAGE.md:51`: «Nettomiete + Zusatzmiete + Akonto: der Betrag, den der Mieter laut Mietvertrag jeden Monat bezahlt.» Die neue Zeile sagt «Dwello erfasst sie nicht». `RentStep.svelte:29` zählt nur Nettomiete, Akonto und Zusatzmiete zusammen.

**Rechenbeispiel.** Nettomiete 1'500, Nebenkostenpauschale 180. Der Mieter bezahlt 1'680, Dwello zeigt 1'500. Mit Zusatzmiete Parkplatz 120 bezahlt er 1'800, Dwello zeigt 1'620.

**Warum ein Problem.** Die beiden Glossarzeilen widersprechen sich jetzt. Der Laie trägt die Pauschale womöglich als Zusatzmiete ein. Das wäre im Total richtig, aber laut Glossar Z. 49 ist die Zusatzmiete für «Garage, Parkplatz, Keller» gedacht.

**Behebung.** In die Zeile «Monatlich total» den Satz «Eine Nebenkostenpauschale erfasst Dwello nicht; sie fehlt im Total.» aufnehmen. Oder in #66 bzw. #402 entscheiden, wo die Pauschale hingehört. Das ist der offene Teil von 66-fachreview-1 V-2 («ob und wo Dwello die Nebenkostenpauschale erfasst»).

## V-3 (Minor, Verwalter): Das Szenario prüft den Kernsatz zu 66 M-1 nicht

**Beleg.** `contract-new.feature:178–179` prüft nur «meist eine Nebenkostenpauschale» und «alle Häkchen». Der Satz «Sind Nebenkosten ohne Akonto vereinbart, bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung» bleibt ungeprüft. Gerade er behebt den Rechtsfehler des früheren Entscheids. Fällt er bei der Umsetzung weg, bleibt das Szenario grün.

**Behebung.**
> «Und erfährt der Liegenschaftsverwalter, dass vereinbarte Nebenkosten ohne Akonto ganz mit der Nebenkostenabrechnung bezahlt werden»

Dazu ein Step mit `toContain('ganz mit der Nebenkostenabrechnung')`.

## V-4 (Nit, Verwalter): Titel und Step-Wortlaut im Szenario #66

- Titel «Ohne Akonto fragt das Formular nach Nebenkostenpauschale oder Vereinbarung»: Das Formular stellt keine Frage, es zeigt einen Hinweis. Vorschlag: «Ohne Akonto nennt der Hinweis Nebenkostenpauschale und fehlende Vereinbarung».
- Step «dass er ohne vereinbarte Nebenkosten alle Häkchen entfernt»: Nach M-1 hat ein Mieter mit Pauschale vereinbarte Nebenkosten, trotzdem gilt «alle Häkchen» für ihn. Vorschlag: «dass er bei einer Nebenkostenpauschale oder ohne vereinbarte Nebenkosten alle Häkchen entfernt».

## V-5 (Nit, Verwalter): fr/it «facturer» statt «décompter»

**Beleg.** Vorschlag fr «Dwello ne facture alors aucuns frais accessoires à ce locataire», it «Dwello non fattura allora spese accessorie a questo inquilino». Der PDF-Text sagt für dieselbe Sache fr «Seuls les frais accessoires convenus … sont décomptés», it «Sono conteggiate solo le spese accessorie pattuite …» (`backend/src/services/pdf.service.ts:218, 312`). Auch `i18n-begriffe.md` übersetzt «abgerechnet» mit «décompté» bzw. «conteggiato».

**Behebung.** fr «Dwello ne décompte alors aucuns frais accessoires à ce locataire.», it «Dwello non conteggia allora spese accessorie a questo inquilino.» Grammatisch richtig ist beides: «aucuns frais» steht korrekt im Plural.

## V-6 (Nit, Verwalter): en «agrees no utility costs»

**Behebung.** «… or the rental contract provides for no utility costs.» Das Verb «provides for» steht schon in `contracts_running_text_fixed_term` (en).

## V-7 (Nit, Verwalter): i18n-Zeile und Typografie

- Fedlex hat für fr und it kein Nomen, nur «de manière forfaitaire» (OBLF Art. 4 al. 2) und «In caso di computo forfettario» (OLAL Art. 4 cpv. 2). Nach `i18n-begriffe.md` («Terms marked with ❓ have no Fedlex word») gehört zu «forfait de frais accessoires» und «forfait per le spese accessorie» ein ❓ mit Verweis auf #342. Alternativ in der Zeile auf die Fedlex-Adjektive verweisen. Inhaltlich halte ich beide Wörter für richtig (siehe «Nicht bestätigt»).
- fr: Der Stil verlangt ein geschütztes Leerzeichen innerhalb von « … » (`i18n-begriffe.md`, «Style»). Ebenso vor « : » in «… convenus » : Dwello …». Ob der Vorschlag U+00A0 enthält, sieht man im Auftrag nicht. Das muss die Umsetzung prüfen.

## M-4 (Nit, Mietrecht): Art. 269d Abs. 2 lit. c

Fedlex: «c. mit der Mitteilung die Kündigung androht oder ausspricht.» Der #388-Satz nennt nur Formular und Begründung, ebenso das beschlossene `statements_akonto_raise`. Der Punkt war schon 66 M-6. Er gilt unverändert und gehört nicht in dieses Slice.

---

## Fehlende Begriffe

- **Nebenkostenpauschale:** vom Product Owner beschlossen (#66). Den Wortlaut der Zeile bitte nach M-1 und M-3 anpassen. Das braucht kein neues Issue, weil der Begriff in #66 entschieden ist. Der korrigierte Wortlaut muss aber vom Product Owner bestätigt werden, weil er den beschlossenen Text ändert.
- **Staffelmiete / Indexmiete** (für M-2): Diese Begriffe sind offen in #410 Punkt 2 (dort steht: «‹ausser der Mietvertrag sieht sie vor› means only Index- or Staffelmiete»). Ich schlage vor, den Befund M-2 dort anzufügen und kein neues Issue zu eröffnen. Wortlaut wie in 66-fachreview-1, «Fehlende Begriffe» 2.
- **Vereinbarte Nebenkosten:** offen in #369. M-1 hängt am Wortlaut dort und ist mit dem dortigen Vorschlag vereinbar.

## Hinweis ohne Befund (beschlossener deutscher Wortlaut von #66)

Im Hinweis steht «Sonst entfernen Sie … alle Häkchen» vor dem Satz «Sind Nebenkosten ohne Akonto vereinbart, bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung». Wörtlich genommen gilt «Sonst» auch für den dritten Fall, in dem die Häkchen bleiben müssen. Das ist eine Frage der Verständlichkeit, kein Rechtsfehler. Der Wortlaut stammt aus meinem eigenen Vorschlag (66-fachreview-1 M-1) und ist vom Product Owner beschlossen. Ich führe es deshalb nicht als Befund. Wenn die Personas darüber stolpern, wäre ein möglicher Wortlaut: «Sonst, bei einer Nebenkostenpauschale oder ohne vereinbarte Nebenkosten, entfernen Sie …»

## Nicht bestätigt

- **unsicher:** Dass Mischformen (einzelne Nebenkosten pauschal, andere mit Akonto) in der Schweizer Praxis üblich sind (M-1, Teil 2). Das ist Praxiswissen. Die Seiten von HEV Schweiz und WEKA waren aus der Sandbox nicht erreichbar (DNS-Fehler). Die Seite des Mieterverbands (WebFetch) nennt Akonto und Pauschale nur getrennt und sagt zu Mischformen nichts. Fedlex verbietet sie nicht: Art. 4 VMWG regelt beide Wege, ohne sie auszuschliessen. Der rechtliche Teil von M-1 (Art. 257a Abs. 2 OR) hängt nicht davon ab.
- **unsicher:** Dass eine Akonto-Erhöhung eine einseitige Vertragsänderung nach Art. 269d Abs. 3 OR ist. Fedlex nennt nur «Leistungen zu vermindern oder neue Nebenkosten einzuführen». Das ist unverändert seit 66-fachreview-1.
- **unsicher:** Ob ein befristeter Mietvertrag eine Akonto-Erhöhung während seiner festen Dauer wirksam vorbehalten kann. Fedlex nennt Ausnahmen nur für den Mietzins (Art. 269b, 269c OR). Auch das ist unverändert.
- Die fr/it-Begriffe «forfait de frais accessoires» und «forfait per le spese accessorie» bestätigt Fedlex nur als Adjektiv bzw. Umschreibung. Ob die Romandie und das Tessin eher «forfait pour frais accessoires» bzw. «spese accessorie forfettarie» sagen, konnte ich nicht belegen (keine erreichbare Quelle mit Mustervertrag). Das gehört in #342.
- V-1: Ob nicht kategorisierte Rechnungen den Abrechnungslauf irgendwo doch sperren, habe ich nur mit Grep geprüft (`src/routes/statements/generate`, `statement-generation.ts`, `calculation.service.ts`). Laufen lassen habe ich nichts. Die Rechnung im Randfall ist von Hand nachgerechnet, nicht in der App.
- Die englische Fassung lässt sich nicht an einem amtlichen Text messen. Geprüft sind nur Sinn und Begriffe nach `i18n-begriffe.md`.
- Szenarien und Tests habe ich nicht ausgeführt (read-only Review). Die Teiltexte der Steps habe ich nur gegen die vorgeschlagenen Texte geprüft.
