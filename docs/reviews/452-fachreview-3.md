# Fachreview #452, Runde 3 (Delta 2578a5d3..770e9ec0)

Worktree: `review-452-fach3` (detached, 770e9ec0). Geprüft: `backend/src/config/llm.ts` (zwei Sätze im `ALLOCABILITY_PROMPT`), `messages/fr.json` (vier Schlüssel), dazu `backend/scripts/llm-eval.ts` als Massstab. Der Aufrufer hat keinen früheren Bericht genannt; hier steht deshalb nur der Befund zum Delta.

Fedlex-Wortlaut, Art. 5 VMWG (SR 221.213.11, Fassung 1.10.2025, Filestore-HTML `.../eli/cc/1990/835_835_835/20251001/de/html/...`):

> 1 Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.
> 2 Darunter fallen insbesondere die Aufwendungen für: […] e. die periodische Revision der Heizungsanlage einschliesslich des Öltanks sowie das Entkalken der Warmwasseranlage, der Boiler und des Leitungsnetzes; f. die Verbrauchserfassung und den Abrechnungsservice für die verbrauchsabhängige Heizkostenabrechnung sowie den Unterhalt der nötigen Apparate; g. die Wartung; […] i. die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt.
> 3 Die Kosten für die Wartung und die Verwaltung dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.

Art. 4 Abs. 3 VMWG: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»
Art. 6 VMWG: «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.»

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | `llm.ts:149` stuft «ein Honorar für die Heizkostenabrechnung» pauschal als nicht umlagefähig ein. Das widerspricht Art. 5 Abs. 2 Bst. f VMWG, der im selben Prompt wörtlich steht (`llm.ts:65`), sobald ein Dritter die verbrauchsabhängige Heizkostenabrechnung macht. Der Eval-Fall `llm-eval.ts:58` ist mehrdeutig. |
| V-2 | Verwalter | Nit | `llm.ts:160`: Regel 3 trifft (Bst. g, Reparatur nach Regel 1 bzw. Art. 6 Bst. a). Besser wäre «Bst. e und g» und «Heizungs- oder Warmwasseranlage». |
| V-3 | Verwalter | Minor | `fr.json:105–106`: Der Glossarbegriff heisst jetzt «Répercutable», sein Text sagt aber noch dreimal «imputable». Lösung: diese drei Wörter durch «répercutable» ersetzen (entschieden in #405, 1a). |
| V-4 | Verwalter | Minor | Auf denselben Bildschirmen stehen jetzt beide Wörter, z.B. im Kategorieformular «répercutable» in Legende, Optionen und Hilfe, aber «imputables» in `categories_error_allocable_required`, `backend_ki_proposal_unsure` und `categories_contract_note`, in der Rechnungsliste der Chip «Répercutable» neben «Coûts imputables» (`invoices_group_allocable`). Ein Übergangszustand bis #461 (offen); dort die rund 58 Stellen nachziehen. |

## V-1 (Major): Honorar für die Heizkostenabrechnung

**Belege**
- `backend/src/config/llm.ts:149`: «… eine Kategorie dafür, auch ein Honorar für die Heizkostenabrechnung, ist nicht umlagefähig.»
- `backend/src/config/llm.ts:65` (LEGAL_BASIS im selben Prompt): «f. die Verbrauchserfassung und den Abrechnungsservice für die verbrauchsabhängige Heizkostenabrechnung …»
- `backend/scripts/llm-eval.ts:20`: «Ablesung der Wärmezähler» = true; `:58`: «Honorar für die Heizkostenabrechnung» = false.

**Warum falsch**
- Bst. f nennt den Abrechnungsservice für die verbrauchsabhängige Heizkostenabrechnung ausdrücklich als anrechenbare Heizkosten.
- In der Praxis ist das die Rechnung des Messdienstes (Ablesen und Verteilen der Heizkosten nach Wärmezählern oder Heizkostenverteilern). In einer Heizkostenabrechnung ist sie eine übliche eigene Position, neben Brennstoff, Service und Kaminfeger. In Neubauten mit mehreren Nutzeinheiten verlangt das kantonale Energierecht oft eine verbrauchsabhängige Heizkostenabrechnung (`docs/nebenkostenabrechnung-anforderungen.md:62`, unsicher-B). Private Vermieter mit kleinen Mehrfamilienhäusern bekommen solche Rechnungen also tatsächlich.
- Der neue Einschub sagt ohne Ausnahme «nicht umlagefähig». Die KI erhält damit zwei Anweisungen, die sich widersprechen. Kategorien wie «Heizkostenabrechnung Messdienst» oder «Abrechnungsservice Heizkosten» schlägt sie dann voraussichtlich als nicht umlagefähig vor. Die Begründung, die der Vermieter sieht, nennt dabei womöglich einen Artikel, der das Gegenteil sagt.
- Mietrecht: Für den Mieter ist das nicht rechtswidrig. Ein falsches «nicht umlagefähig» geht zulasten des Vermieters, der Mieter zahlt weniger. Es gibt deshalb keinen M-Befund. Fachlich ist der Satz aber falsch und der Begründungstext irreführend.
- Der Teil, der stimmt: Den eigenen Aufwand des Vermieters (oder eines Treuhänders) für das *Erstellen* der Abrechnung verrechnet Dwello über die Verwaltungspauschale (Art. 4 Abs. 3 VMWG). Eine zusätzliche Kategorie dafür wäre eine Doppelverrechnung. Diese Produktregel ist zulässig, und `llm.ts:149` stellt sie richtig als Dwello-Regel dar, nicht als Rechtssatz. Bst. f gilt zudem nur für die *verbrauchsabhängige* Heizkostenabrechnung. Die Gebühr eines Dritten für eine Heizkostenabrechnung nach Fläche fällt unter Art. 4 Abs. 3 und damit unter die Pauschale.

**Korrektur** (Wortlaut für `llm.ts:149`):

> Den Aufwand für die Erstellung der Nebenkostenabrechnung (Art. 4 Abs. 3 VMWG) rechnet Dwello über die Verwaltungspauschale ab; eine Kategorie dafür ist nicht umlagefähig, auch nicht ein Honorar der Verwaltung für die Heizkostenabrechnung. Umlagefähig sind dagegen die Verbrauchserfassung und der Abrechnungsservice eines Dritten für die verbrauchsabhängige Heizkostenabrechnung, z.B. Ablesung und Abrechnung der Wärmezähler durch einen Messdienst (Art. 5 Abs. 2 Bst. f VMWG).

**Eval-Fall:** «Honorar für die Heizkostenabrechnung» = false ist so nicht eindeutig richtig. Gemeint als Messdienst nach Bst. f wäre er true, gemeint als Verwaltungshonorar wäre er nach der Dwello-Regel false. Vorschlag für `llm-eval.ts:58`: in «Honorar der Verwaltung für die Heizkostenabrechnung» (false) umbenennen und einen Fall «Abrechnungsservice für die verbrauchsabhängige Heizkostenabrechnung» (true) hinzufügen. Dann prüft der Eval beide Seiten der Grenze. Vor und nach der Änderung `bun run llm:eval` laufen lassen (`backend/CLAUDE.md`).

**Eindeutig:** ja, die Ausnahme für den Dritten steht im Wortlaut von Bst. f. Nicht eindeutig ist nur die Formulierung der Eval-Namen; das ist eine Wortwahl, keine Rechtsfrage.

## Punkt 2: Brennerservice (`llm.ts:160`): bestätigt

«Wartung und Service der Heizungsanlage, z.B. der Brennerservice, sind umlagefähig (Art. 5 Abs. 2 Bst. g VMWG); ihre Reparatur nicht (Regel 1).»
- Bst. g «die Wartung» trägt den Satz. Der Brennerservice ist in der Praxis Wartung oder periodische Revision (Reinigen, Einstellen, Abgasmessung, Düsenwechsel). Das deckt auch Bst. e.
- Den Ausschluss der Reparatur trägt Art. 6 Bst. a «die Reparatur und Erneuerung der Anlagen». Regel 1 nennt Art. 6 VMWG für Heizung und Warmwasser.
- Eval `llm-eval.ts:15` «Brennerservice» = true: richtig.
- Nur Nit V-2 (Formulierung offen): «Bst. e und g» und «Heizungs- oder Warmwasseranlage», weil Abs. 1 beide Anlagen umfasst.
- **Eindeutig:** ja (Satz richtig; V-2 ist optional).

## Punkt 3: fr-Labels

- `glossary_allocable_term` «Répercutable», `invoices_not_allocable` «Non répercutable», `categories_allocable` «Frais accessoires répercutables», `categories_allocable_help` «Sont répercutables … les frais répercutables»: Wortwahl, Grammatik und Angleichung stimmen. Das Paar der Radiogruppe ist jetzt einheitlich; vorher stand «Imputable» neben «Non répercutable».
- Die Wahl deckt sich mit dem PO-Entscheid #405, 1a (2026-10-19): «répercutable» ersetzt «imputable».
- Fedlex stützt sie: Im Mietrecht bedeutet «imputable» «vom Mieter zu verantworten», Art. 259a al. 1 CO: «Lorsque apparaissent des défauts de la chose qui ne sont pas imputables au locataire …».
- Die Hilfe stimmt inhaltlich mit Art. 257a al. 1 CO überein: «Les frais accessoires sont dus pour les prestations fournies par le bailleur ou un tiers en rapport avec l’usage de la chose.»
- Offen bleiben V-3 (Glossartext, trivial) und V-4 (übrige Texte, #461).
- **Eindeutig:** ja (entschieden in #405).

## Fehlende Begriffe

Keine neuen Begriffe für das Glossar. «Messdienst» und «verbrauchsabhängige Heizkostenabrechnung» stehen nur im Prompt, nicht in der Oberfläche; «VHKA» führt `docs/nebenkostenabrechnung-anforderungen.md:136` bereits als fehlenden Begriff.

## Nicht bestätigt

- Wie oft Messdienst-Rechnungen bei kleinen Mehrfamilienhäusern vorkommen und ab wann die kantonale Pflicht greift: nur `docs/nebenkostenabrechnung-anforderungen.md:62` (unsicher-B), nicht auf Fedlex geprüft.
- Wie die KI auf die neue Formulierung von V-1 reagiert: nicht geprüft, weil kein `llm:eval`-Lauf möglich war (Review ohne Ausführung).
- Ob «Verwaltung des Heizbetriebs» = true (`llm-eval.ts:35`, Bst. i) neben der Verwaltungspauschale eine Doppelverrechnung ist: bekannt offen (Frage 9, `docs/nebenkostenabrechnung-anforderungen.md:165`), nicht Teil dieses Deltas.
- Romand-Praxis «répercutable» vs. «imputable»: keine Fedlex-Quelle für das Adjektiv; entschieden in #405.
