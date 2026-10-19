# Fach-Review #432, Runde 1 (vor der Umsetzung)

Gegenstand: @wip-Szenario «Mit Akonto und Nebenkostenpauschale warnt das Formular vor angekreuzten Nebenkosten» (`tests/e2e/features/contract-new.feature:204-211`, Commit a0c0bf90) und der vorgeschlagene Text `contracts_flat_rate_warning_text_advance`. Worktree: `review-432-fach` (Scratchpad).

## Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Der 2. Satz der Variante sagt als Tatsache «Dwello rechnet ihm … auch die Nebenkosten ab, die die Pauschale abdeckt». Im Fall mit Akonto erscheint die Warnung aber auch bei jedem richtig ausgefüllten Mietvertrag. Dort stimmt der Satz nicht und verleitet dazu, auch Häkchen von Akonto-Nebenkosten zu entfernen. |
| V-2 | Verwalter | Minor | Die Folge fehlt: Der Text sagt nicht, was passiert, wenn das Häkchen bleibt («Sonst bezahlt er … doppelt»). Weber 429 («Verwirrung»): «was passiert, wenn nicht?». Mit einem Satz ergänzen, siehe Empfehlung. |
| V-3 | Verwalter | Nit | «bezahlt Akonto und eine Nebenkostenpauschale»: Das Formular und die Szenarien sagen «ein Akonto» (Schritt «ein Akonto von … einträgt»). Schreiben Sie «bezahlt ein Akonto und eine Nebenkostenpauschale». |
| M-1 | Mietrecht | Nit | Das Recht unterscheidet «aufgrund einer Abrechnung» und «pauschal» (Art. 4 Abs. 1/2 VMWG), nicht Akonto und Pauschale. Wer Nebenkosten nach Abrechnung ohne eigenes Akonto vereinbart hat, liest «für die der Mieter Akonto bezahlt» zu eng. In der Praxis (Vertragsformulare mit den Spalten «akonto» und «pauschal») passt der Satz. Er kann bleiben. Mit Satz 2 der Empfehlung («mit der Nebenkostenabrechnung») ist der Bezug klar. |
| V-4 | Verwalter | Minor | Weber 429 P-1 trat in «Mietvertrag bearbeiten» auf. Das Szenario prüft nur «Neuer Mietvertrag». Der Schritt `RentStep.svelte` ist gemeinsam (`ContractForm.svelte:312`), deshalb genügt ein Szenario für «Done means» von #432. Empfohlen: zusätzlich ein Unit-Test von `flatRateNotice` mit Akonto > 0, oder ein Szenario in `contract-edit.feature` (Anna Keller, Akonto setzen, Pauschale setzen). |
| V-5 | Verwalter | Nit | Das Szenario setzt voraus, dass alle Häkchen gesetzt sind (Glossar: «Ein neuer Mietvertrag beginnt mit allen umlagefähigen Kategorien angekreuzt»), sagt es aber nicht. Wie das Szenario #429 nebenan ist das vertretbar. Optional: «Und alle Nebenkosten sind angekreuzt». |

Keine Blocker.

### V-1 (Major)

- **Beleg:** vorgeschlagener Text, Satz 2: «Dwello rechnet ihm alle angekreuzten Nebenkosten ab, auch die Nebenkosten, die die Pauschale abdeckt.» Entscheid #432 (2026-10-18): Die Warnung erscheint, «whenever a Nebenkostenpauschale is entered and at least one Nebenkosten box is ticked, with or without an Akonto». Die Issue nennt die Folge selbst: «the warning also shows on correctly filled mixed contracts». `src/lib/contract-wizard.ts:89-95` zählt nur, *ob* Häkchen gesetzt sind, nicht welche.
- **Warum falsch:** Bei einem gemischten Mietvertrag *müssen* Häkchen gesetzt sein, nämlich die Kategorien nach Abrechnung (Art. 257a Abs. 2 OR, nur vereinbarte Nebenkosten; Art. 4 Abs. 1 VMWG, Abrechnung). Die Warnung steht also auch bei richtigen Eingaben dauernd da, im Formular für neue Mietverträge und beim Bearbeiten. Dann behauptet Satz 2 etwas Falsches: Keine angekreuzte Kategorie ist von der Pauschale gedeckt. Ein unerfahrener Verwalter (Zielgruppe) entfernt dann vielleicht auch die Häkchen der Akonto-Kategorien. Dann verliert er berechtigte Nebenkosten, die er nach Art. 257b Abs. 1 OR abrechnen dürfte. Oder er hält die Abrechnung für fehlerhaft. Persona Weber 429 P-4 hat dasselbe schon beim Text ohne Akonto bemängelt («klingt nach einem Fehler, obwohl die Eingabe korrekt ist»). Beim Text ohne Akonto stimmt die Warnung meist. Im Fall mit Akonto ist sie bei richtigen Eingaben die Regel.
- **Fix:** Satz 2 neutral formulieren. Er beschreibt die Regel, ohne einen Fehler zu unterstellen: «Dwello rechnet ihm alle angekreuzten Nebenkosten mit der Nebenkostenabrechnung ab, die Pauschale nicht.» Die mögliche Doppelbelastung kommt als Bedingung in einen eigenen Satz (V-2).

## Empfohlener Wortlaut

Titel unverändert: `contracts_flat_rate_warning_title` «Nebenkostenpauschale und angekreuzte Nebenkosten» (passt für beide Fälle, bestätigt).

`contracts_flat_rate_warning_text_advance`:

- **de:** «Dieser Mieter bezahlt ein Akonto und eine Nebenkostenpauschale. Dwello rechnet ihm alle angekreuzten Nebenkosten mit der Nebenkostenabrechnung ab, die Pauschale nicht. Lassen Sie nur die Nebenkosten angekreuzt, für die der Mieter Akonto bezahlt. Sonst bezahlt er die Nebenkosten, die die Pauschale abdeckt, doppelt.»
- **fr:** «Ce locataire paie un acompte et un forfait de frais accessoires. Dwello lui décompte tous les frais accessoires cochés dans le décompte des charges, mais pas le forfait. Ne laissez cochés que les frais accessoires pour lesquels le locataire paie un acompte. Sinon, il paie deux fois les frais accessoires que le forfait couvre.»
- **it:** «Questo inquilino paga un acconto e un forfait per le spese accessorie. Dwello gli conteggia tutte le spese accessorie selezionate nel conteggio spese accessorie, ma non il forfait. Lasci selezionate solo le spese accessorie per le quali l’inquilino paga un acconto. Altrimenti paga due volte le spese accessorie che il forfait copre.»
- **en:** «This tenant pays an advance payment and a flat-rate utility charge. Dwello bills them for all ticked utility costs in the utility cost statement, but not for the flat rate. Leave ticked only the utility costs the tenant pays an advance payment for. Otherwise they pay twice for the utility costs the flat rate covers.»

Die Begriffe folgen `docs/design/i18n-begriffe.md:37` (Akonto: acompte / acconto / advance payment) und `:77` (Nebenkostenpauschale: forfait de frais accessoires ❓ / forfait per le spese accessorie ❓ / flat-rate utility charge; das ❓ besteht schon, kein neues Issue). «Vereinbarte Nebenkosten», «décompte des charges», «conteggio spese accessorie», «utility cost statement», cocher / selezionare / tick sind übernommen aus `contracts_flat_rate_*`, `contracts_no_advance_text` und `contracts_agreed_costs_help`.

Das Szenario prüft Satz 3 («Lassen Sie nur die Nebenkosten angekreuzt, für die der Mieter Akonto bezahlt.»). Er bleibt wörtlich gleich, das Szenario braucht keine Änderung. Der Produktverantwortliche bestätigt den Wortlaut noch (Entscheid #432).

## Bestätigt

- **Regel «nur angekreuzte Nebenkosten abrechnen», Pauschale nie abrechnen:** Art. 257a Abs. 2 OR (Fedlex, Fassung 1.10.2026): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …». Art. 4 VMWG (Fedlex, Fassung 1.10.2025), Abs. 1: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Abs. 2: «Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.» Akonto und Pauschale nebeneinander sind also zulässig: Eine Kategorie wird entweder nach Abrechnung oder pauschal erhoben. Eine gedeckte Kategorie zusätzlich abzurechnen belastet den Mieter doppelt. Das deckt sich mit dem Glossar «Nebenkostenpauschale» («Nebenkosten, die der Mieter pauschal bezahlt, erhalten bei «Vereinbarte Nebenkosten» kein Häkchen»).
- **Begriffe** Akonto, Nebenkostenpauschale, Vereinbarte Nebenkosten (Glossar Z. 51, 52, 55): im Szenario und im Text richtig verwendet. «Monatlich total» ist nicht betroffen.
- **Hilfe des Feldes** `contracts_flat_rate_help` («Entfernen Sie … das Häkchen bei den Nebenkosten, die die Pauschale abdeckt»): passt für beide Fälle und braucht keine Änderung.
- **Text ohne Akonto** `contracts_flat_rate_warning_text`: bleibt wie entschieden. Kein Widerspruch zur Variante.
- **Rechenbeispiel (keine neue Formel, Monatlich total und Fallunterscheidung nachgerechnet):**
  - Szenariowerte: 950 + 0 Zusatzmiete + 200 Akonto + 50 Pauschale = CHF 1’200.00. Weber 429: 1’200 + 0 + 200 + 50 = CHF 1’450.00 (deckt sich mit `weber-429.md:16`).
  - Doppelbelastung: Pauschale CHF 50 pro Monat für Hauswart und Kehricht. Bleiben beide angekreuzt, bezahlt der Mieter pro Jahr 600 Pauschale plus seinen Anteil an den tatsächlichen Kosten über die Abrechnung, zum Beispiel 480. Das sind 1’080 statt 600 (oder 480).
  - Grenzfälle: Akonto «0» oder «0.00» ergibt `amount` = 0, also den Text ohne Akonto. Akonto 200 ohne Häkchen ergibt keine Warnung (wie Szenario Helga 429 P-1). Pauschale 0 ergibt keine Warnung.
- **Kein Widerspruch zu** `contract-edit.feature:169-172` («Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.»).

## Fehlende Begriffe

Keine. Alle verwendeten Begriffe stehen im Glossar.

## Nicht bestätigt

- **Wie verbreitet eine Kategorie nach Abrechnung ohne eigenes Akonto in einem gemischten Mietvertrag ist (M-1):** nicht recherchiert. Die Aussage zu den Vertragsformularen mit den Spalten «akonto» und «pauschal» beruht auf Praxiswissen. Die Formulare (HEV, SVIT) habe ich nicht im Wortlaut eingesehen: **unsicher**.
- **Rückforderung doppelt bezahlter Nebenkosten durch den Mieter** (Weber 429 «Risiken»): Rechtsgrundlage (Bereicherungsrecht, Art. 62 ff. OR) nicht auf Fedlex geprüft: **unsicher**. Der empfohlene Text stützt sich nicht darauf.
- Ausserhalb des Gegenstands, nicht geprüft: Weber 429 P-2 (Hinweis «Kein Akonto»), P-3 (VMWG Art. 4 Abs. 2 und Art. 269d OR in der Hilfe der Pauschale) und P-4 (das «trotzdem» im Text ohne Akonto).
- Gesucht: `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/design/i18n-begriffe.md`, `messages/*.json`, `src/lib/contract-wizard.ts`, `docs/design/personas/weber-429.md`, Issue #432 (GitHub API). Fedlex-Texte über die Fedlex-Filestore-HTML (OR Fassung 20261001, VMWG Fassung 20251001), gefunden über den Fedlex-SPARQL-Endpunkt und `mmx search`.
