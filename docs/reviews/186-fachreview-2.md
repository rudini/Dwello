# Fachreview #180, #185, #186, #216 – Runde 2

Gegenstand: Commit `80c804a` (Worktree `review-186-fach2`), Delta seit Runde 1 (`d1cf3a0`) bis `80c804a` und die offenen Befunde aus `docs/reviews/186-fachreview-1.md`. Geprüft wurden:
- `messages/{de,fr,it,en}.json`: `categories_reason_*` (21), `categories_contract_note`, `categories_allocable_help`, `backend_ki_proposal_unavailable`, `backend_ki_proposal_unsure`, `invoices_category_not_allocable_text`, `invoices_legal_title`, `invoices_legal_text`, `privacy_llm_off` (dazu zum Vergleich `privacy_llm_local`, `privacy_llm_external`, `backend_ki_unavailable`)
- `README.md:290–300` («External LLM provider»)
- `tests/e2e/features/categories.feature:57–103`, `tests/e2e/features/invoice-detail.feature:18–22` mit Steps, Tasks und Fixtures
- Code, soweit er bestimmt, wann ein Text erscheint: `src/routes/config/categories/CategoryReason.svelte`, `CategoryRow.svelte`, `CategoryForm.svelte`, `+page.svelte`, `src/lib/server/category.ts`, `backend/src/services/llm.service.ts`, `backend/src/routes/categories.ts`, `backend/src/app.ts:69`, `backend/src/config/llm.ts`, `src/routes/privacy/+page.svelte`, `src/routes/invoices/[id]/+page.svelte:107–113`, `backend/migrations/0002_stammdaten.sql:14–39`

Rollen: Verwalter, Mietrecht, Rechtstexte (README, `privacy_llm_off`).

Quellen (Fedlex, heruntergeladen am 2026-10-15; Fassungen über den SPARQL-Endpunkt ermittelt):
- OR / CO / CO (fr, it), SR 220, Stand 1. Oktober 2026 (`eli/cc/27/317_321_377/20261001`); englische Übersetzung Stand 1. Januar 2026 (`…/20260101/en`, neueste englische Fassung auf Fedlex)
- VMWG / OBLF / OLAL, SR 221.213.11, Stand 1. Oktober 2025 (`eli/cc/1990/835_835_835/20251001`, de, fr, it; eine englische Fassung gibt es auf Fedlex nicht)
- DSG, SR 235.1, Stand 7. Juli 2025 (Wortlaut aus Runde 1, erneut abgeglichen)
- MV-Merkblatt «Zulässige und unzulässige Nebenkosten» 2026 (wie Runde 1, erneut heruntergeladen)
- `docs/design/i18n-begriffe.md`, `UBIQUITOUS_LANGUAGE.md`

Formeln: keine im Gegenstand (keine Beträge, kein Verteilschlüssel); nichts nachzurechnen.

Vorgabe des Auftrags: Die deutschen Texte schreiben «Absatz» statt «Abs.» (Guard `no-german-in-code.test.ts`). Das ist inhaltlich richtig und kein Befund. Die Mischung «Absatz 2 Bst. d» ist ungewohnt, aber korrekt.

## Wortlaut der neu zitierten Normen (fr, it, en)

- **Art. 256 al. 1 CO:** «Le bailleur est tenu de délivrer la chose à la date convenue, dans un état approprié à l’usage pour lequel elle a été louée, et de l’entretenir en cet état.»
- **Art. 256 cpv. 1 CO:** «Il locatore deve consegnare la cosa nel momento pattuito, in stato idoneo all’uso cui è destinata e mantenerla tale per la durata della locazione.»
- **Art. 256 para. 1 CO (en):** «The landlord or lessor is required to make the object available on the agreed date in a condition fit for its designated use and to maintain it in that condition.»
- **Art. 256b CO:** fr «Le bailleur supporte les contributions publiques et les charges qui grèvent la chose louée.»; it «Il locatore sottostà ai tributi pubblici e agli oneri che gravano sulla cosa locata.»; en «The landlord or lessor bears all taxes and charges in connection with the leased object.»
- **Art. 257a al. 2 CO:** «Ils ne sont à la charge du locataire que si cela a été convenu spécialement.»; it cpv. 2: «Sono a carico del conduttore soltanto se specialmente pattuito.»; en para. 2: «They are payable by the tenant or lessee only where this has been specifically agreed with the landlord or lessor.»
- **Art. 257b al. 1 CO (fr):** «… ainsi que les contributions publiques qui résultent de l’utilisation de la chose.»; it cpv. 1: «… come pure per tributi pubblici risultanti dall’uso della cosa.»; en para. 1: «… as well as public taxes arising from the use of the property.»
- **Art. 269a let. b CO:** fr «sont justifiés par des hausses de coûts ou par des prestations supplémentaires du bailleur;»; it lett. b «sono giustificate dal rincaro dei costi o da prestazioni suppletive del locatore;»
- **Art. 4 al. 3 OBLF:** «Les frais d’administration découlant de l’établissement du décompte peuvent être calculés en fonction des dépenses effectives ou portés en compte jusqu’à concurrence des taux usuels.»; **Art. 4 cpv. 3 OLAL:** «Le spese amministrative per la stesura del conteggio possono essere computate secondo il dispendio effettivo o nell’ambito delle aliquote usuali.»
- **Art. 5 al. 1 OBLF:** «Entrent en ligne de compte comme frais de chauffage et de préparation d’eau chaude les dépenses effectives directement en rapport avec l’utilisation de l’installation de chauffage ou de l’installation générale de préparation d’eau chaude.»; **Art. 5 cpv. 1 OLAL:** «Sono computabili quali spese di riscaldamento e d’acqua calda i costi effettivi direttamente connessi con il funzionamento dell’impianto di riscaldamento o dell’impianto centrale di produzione dell’acqua calda.»
- **Art. 5 al. 2 let. d / i OBLF:** «d. le nettoyage de l’installation de chauffage et de la cheminée, le grattage, le brûlage et l’huilage de la chaudière, ainsi que l’enlèvement des déchets et des scories;» «i. le travail administratif qu’occasionne l’exploitation de l’installation de chauffage.»; OLAL lett. d «la pulizia dell’impianto di riscaldamento e del camino, …», lett. i «il lavoro amministrativo causato dall’esercizio dell’impianto di riscaldamento.»
- **Art. 6 OBLF:** «N’entrent pas en ligne de compte comme frais de chauffage et de préparation d’eau chaude les dépenses pour: a. la réparation et la réfection des installations; b. le service de l’intérêt et l’amortissement des installations.»; **Art. 6 OLAL:** «Non sono computabili … i costi per: a. la riparazione e il rinnovo degli impianti; b. il pagamento degli interessi e l’ammortamento degli impianti.»
- **Art. 14 al. 1 OBLF / cpv. 1 OLAL** (Auszug): «Sont réputés prestations supplémentaires du bailleur au sens de l’art. 269a, let. b, CO les investissements qui aboutissent à des améliorations créant des plus-values, …»; «Sono prestazioni suppletive del locatore ai sensi dell’articolo 269a lett. b CO gli investimenti per migliorie di valorizzazione, …»
- **Art. 19 Abs. 4 DSG:** «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.»
- **Art. 16 Abs. 1 DSG:** «Personendaten dürfen ins Ausland bekanntgegeben werden, wenn der Bundesrat festgestellt hat, dass die Gesetzgebung des betreffenden Staates oder das internationale Organ einen angemessenen Schutz gewährleistet.»
- **MV-Merkblatt S. 1/2, Hauswartung:** zulässig «Kleinere Instandhaltungen wie Ersatz von Glühlampen, Ölen von Schlössern (solange keine Spezialkenntnisse nötig)»; unzulässig «Reparaturen und Erneuerungen in Haus und Umgebung». **S. 2, TV-Gebühren:** zulässig «Grundnutzungsgebühren von UPC oder anderen Kabelnetzbetreibern»; unzulässig «Installationsgebühren für Anschluss ans Netz». **Kehricht:** unzulässig «Kosten für von der Vermieterschaft organisierte Entsorgungen von Grümpel, etc.»

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| H-22 | Rechtstexte | Minor | README: «provider is in Switzerland» knüpft an den Sitz des Anbieters an; Art. 16/19 Abs. 4 DSG knüpfen an den Staat an, in den die Daten gehen (Rechenzentrum, Unterauftragnehmer) |
| H-23 | Verwalter / Mietrecht | Minor | Titel «Schweizer Mietrecht» über dem Rechnungshinweis rahmt jeden Ausschluss weiter als gesetzlichen Grund (K-1) |
| H-24 | Verwalter | Minor | Seed-Beschreibungen «Gebühren für den Kabelanschluss» und «Kehrichtabfuhr und Entsorgung» widersprechen den neuen Begründungen und gehen in jeden KI-Prompt: braucht ein Issue |
| H-25 | Verwalter (it) | Nit | `categories_reason_pest_control` (it): «necessaria» passt nicht zur Kategorie «Controllo dei parassiti» (maskulin) |
| H-26 | Verwalter (fr, it) | Nit | Hilfetext nennt «assurance du bâtiment» / «assicurazione dell’edificio», die Kategorie heisst «Assurance bâtiment» / «Assicurazione edificio» (wie K-2) |
| H-27 | Verwalter (it) | Nit | Hauswart (it): «piccola manutenzione» für «kleine Instandhaltung»; «manutenzione» ist laut i18n-Begriffen das Wort für «Wartung» |
| H-28 | Verwalter (fr, en) | Nit | Kleinigkeiten: Zitierweise fr uneinheitlich; fr/it Satzbau bei Verwaltung; en «Choose yourself» |

Keine Blocker, keine Major.

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| H-1 | Major | behoben (Begründung); Seed-Beschreibung offen, siehe H-24 | `messages/de.json:1113` «Die laufende Grundgebühr des Kabelnetzes hängt mit dem Gebrauch zusammen; die Installation des Anschlusses nicht.» = Vorschlag; fr/it/en sinngleich. MV-Merkblatt S. 2 bestätigt. |
| H-2 | Major | behoben | `README.md:297` nennt jetzt die Schweiz und Anhang-1-Staaten «within the limits noted there», Art. 16 Abs. 1, Art. 19 Abs. 4, Art. 16 Abs. 2, Art. 17 DSG. Wortlaut wie Vorschlag. Rest siehe H-22 (neu, anderer Punkt). |
| H-3 | Major | behoben | Eigene Codes `KI_PROPOSAL_UNAVAILABLE`/`KI_PROPOSAL_UNSURE` (`llm.service.ts:205–224`, `routes/categories.ts:72–77`), Meldungen `backend_ki_proposal_*` (`de.json:1364–1365`); `backend_ki_unavailable` in allen vier Sprachen unverändert (`de.json:438`). |
| H-4 | Major | behoben | `categories.feature:73–77` (Schneeräumung als nicht umlagefähig gespeichert → kein Grund) und `:65` (Lift, «ja»-Zweig). `CategoryReason.svelte:35–38` zeigt den Grund nur, wenn die gespeicherte Umlagefähigkeit der vordefinierten entspricht. Die booleschen Werte in `REASONS` stimmen mit `0002_stammdaten.sql:15–39` überein (12 × true, 9 × false), die Schlüssel mit den `name`-Werten. |
| H-5 | Minor | behoben | `de.json:1115` = Vorschlag. |
| H-6 | Minor | behoben | `de.json:1120` = Vorschlag inkl. Satz zur Mietzinserhöhung. |
| H-7 | Minor | behoben | `de.json:1119` = Vorschlag. |
| H-8 | Minor | behoben | `de.json:1112` = Vorschlag. |
| H-9 | Minor | behoben | `de.json:1103–1104` = Vorschlag, Warmwasser mit Art. 5 Absatz 1 VMWG. |
| H-10 | Minor | offen, als offene Arbeit erfasst | Issue #219 (offen, `fachlich`, `entscheiden`) beschreibt das Problem und drei Optionen richtig. Der Text `backend_ki_proposal_unavailable` und das Szenario `categories.feature:98–103` folgen dem Entscheid #186. |
| H-11 | Minor | behoben (Text); Titel siehe H-23 | `de.json:776` = Vorschlag (mit «Absatz»). |
| H-12 | Minor | offen, als offene Arbeit erfasst | Kommentar auf #75 vom 2026-10-15 enthält alle drei Begriffe. Die dort offene Frage ist jetzt geklärt: Vordefinierte Kategorien lassen sich löschen, solange keine Rechnung und kein Tankbestand sie verwenden (`backend/src/services/category.service.ts:197–222` prüft den Typ nicht); die Formulierung im Kommentar behauptet nichts anderes und kann so bleiben. |
| H-13 | Minor | behoben | `categories.feature:99` «Angenommen die KI ist nicht erreichbar», neutraler Name «Fensterreinigung»; der Stub hängt intern am Präfix «KI-Ausfall» (`tasks/categories.ts:39–46`, `llm-stub.ts:94–95`). |
| H-14 | Minor | behoben | `categories_contract_note` einmal auf der Liste (`config/categories/+page.svelte:71`), Szenario `categories.feature:66`. Wortlaut entspricht Art. 257a Abs. 2 OR. |
| H-15 | Nit | behoben | Kaminfeger «Art. 5 Absatz 2 Bst. d VMWG», Warmwasser «Art. 5 Absatz 1 VMWG», Art. 257b Absatz 1 OR bei Kalt-, Abwasser und Kehricht; «Absatz» durchgehend (Vorgabe des Auftrags). |
| H-16 | Nit | behoben | `de.json:1102` = Vorschlag. |
| H-17 | Nit | behoben | `de.json:1121`. |
| H-18 | Nit | behoben | in `README.md:297` enthalten. |
| H-19 | Nit | behoben | `de.json:739` «umgelegt»; fr «répercutés», it «addebitati», en «passed on». |
| H-20 | Nit | behoben | Ein Szenario «Bewachung» (`categories.feature:91–96`), erweitert um «KI ist sich nicht sicher». |
| H-21 | Nit | behoben | Lift `de.json:1108`, Schneeräumung `:1111`; Allgemeinstrom unverändert (war optional). |

## Befunde

### H-22 (Minor) README: Sitz des Anbieters statt Staat der Bekanntgabe

- Beleg: `README.md:297` «the provider is in Switzerland or in a country the Federal Council lists with adequate data protection (Art. 16 Abs. 1 DSG, DSV Anhang 1) …». `README.md:292` «The privacy statement then names the provider and its country from … `LLM_PROVIDER_COUNTRY`». `README.md:298` «prefer providers with … data centers in Switzerland or the EU». `privacy_llm_external` (`de.json:133`): «Rechnungen werden von {provider} ({country}) … kategorisiert.» Art. 16 Abs. 1 und Art. 19 Abs. 4 DSG (Wortlaut oben) knüpfen an die Bekanntgabe «ins Ausland» und an «den Staat» an, in den die Daten gehen.
- Warum falsch: Ein Anbieter mit Sitz in der Schweiz, der das Modell in einem Rechenzentrum in den USA (oder über einen Unterauftragnehmer dort) betreibt, erfüllt wörtlich «the provider is in Switzerland»; die Datenschutzerklärung nennt dann «Schweiz», obwohl die Daten in die USA gehen und Art. 19 Abs. 4 DSG die USA verlangt. Der dritte Punkt («data centers in Switzerland or the EU» nur als Empfehlung) zeigt, dass README selbst Sitz und Rechenzentrum trennt. Der Satz «names the provider and its country» bestand schon auf der Basis; die neue Regel in Z. 297 macht den Sitz aber zur Bedingung.
- Korrektur: In Z. 297 «the provider is in Switzerland …» ersetzen durch «the data is processed only in Switzerland or in a country the Federal Council lists … (including the provider’s data centers and subprocessors)», und in Z. 292 «its country» durch «the country where the data is processed (`LLM_PROVIDER_COUNTRY`)»; bei mehreren Staaten alle nennen. Kein App-Code nötig, nur README (und optional der Kommentar in `.env.example:60–64`).

### H-23 (Minor) Titel «Schweizer Mietrecht» über dem Rechnungshinweis (K-1)

- Beleg: `src/routes/invoices/[id]/+page.svelte:108–111` zeigt `<Alert tone="caution" title={m.invoices_legal_title()}>` bei jedem `!invoice.isValidUtilityCost`; `de.json:775` «Schweizer Mietrecht», fr «Droit suisse du bail», it «Diritto svizzero di locazione», en «Swiss tenancy law». Der Text darunter (`de.json:776`) sagt jetzt zuerst eine Tatsache über diese Rechnung («fliesst nicht in die Nebenkostenabrechnung ein») und nennt dann typische Beispiele mit Artikeln. `docs/reviews/185-review-1.md:14` (K-1).
- Warum falsch: H-11 wollte vermeiden, dass das Gesetz als Grund erscheint, wenn der Liegenschaftsverwalter eine Rechnung einer umlagefähigen Kategorie selbst ausgeschlossen hat (z. B. Lift-Reparatur in «Lift», oder eine Hauswart-Rechnung, die er nicht weiterverrechnen will). Der Titel liest sich als Überschrift «das sagt das Gesetz über diese Rechnung» und hebt die neutrale Wirkung des ersten Satzes wieder auf. Für den Vermieter mit wenig Erfahrung entsteht der Eindruck, er dürfe die Rechnung gar nicht umlegen. Der Titel passt nur noch zum zweiten Satz.
- Korrektur: Titel, der den Zustand der Rechnung nennt, z. B. de «Nicht in der Nebenkostenabrechnung», fr «Pas dans le décompte des charges», it «Non nel conteggio spese accessorie», en «Not in the utility cost statement» (Begriffe laut `i18n-begriffe.md`). Alternativ den bestehenden Schlüssel `invoices_not_allocable` («Nicht umlagefähig») verwenden. Der Gesetzesbezug bleibt in den Klammern des Textes. Das Szenario `invoice-detail.feature:22` prüft nur den Text und bleibt gültig; der neue Titel braucht einen roten Test (DOM-Test der Rechnungsseite).

### H-24 (Minor) Seed-Beschreibungen widersprechen den Begründungen: Issue nötig

- Beleg: `backend/migrations/0002_stammdaten.sql:25` `'TV/Cable' … 'Gebühren für den Kabelanschluss'`; `:24` `'Waste Disposal' … 'Kehrichtabfuhr und Entsorgung'`. Die Beschreibung geht in jeden Kategorisierungs-Prompt (`backend/src/config/llm.ts:83–88`: «- TV/Cable (TV/Kabelanschluss): Gebühren für den Kabelanschluss») und steht auf der Bearbeitungsseite der vordefinierten Kategorie im Feld «Beschreibung» (`CategoryForm.svelte:102–106`), direkt über dem neuen Grund. Begründungen: `de.json:1113` «die Installation des Anschlusses nicht», `de.json:1112` «Räumungen, die der Vermieter bestellt, nicht». MV-Merkblatt S. 2: unzulässig «Installationsgebühren für Anschluss ans Netz», «von der Vermieterschaft organisierte Entsorgungen von Grümpel».
- Warum: Die KI ordnet eine Rechnung «Anschluss ans Kabelnetz» oder «Entsorgung Grümpel Keller» nach dieser Beschreibung den umlagefähigen Kategorien zu; die Rechnung wird damit umlagefähig vorgeschlagen und landet ohne Korrektur in der Nebenkostenabrechnung – genau der Fall, vor dem die neue Begründung warnt. Auf der Bearbeitungsseite stehen Beschreibung und Grund nebeneinander und widersprechen sich halb. Die Begründung in der UI behebt das nicht, weil der Prompt nur die Beschreibung kennt.
- Korrektur: Ja, das braucht ein Issue (Label `fachlich`; `entscheiden` nur, wenn der Product Owner die Formulierung bestätigen soll), im Stil der Lift- und Hauswart-Beschreibungen: «Laufende Grundgebühr des Kabelnetzes; ohne Installation des Anschlusses» und «Kehrichtgebühren und Grünabfuhr; ohne Räumungen, die der Vermieter bestellt». Umsetzung über eine Migration, die nur unveränderte Beschreibungen ersetzt (der Liegenschaftsverwalter kann sie bearbeiten). Mit einem KI-Eval-Fall «Anschluss ans Kabelnetz» → nicht umlagefähig prüfen.

### H-25 (Nit) Italienisch: Geschlecht bei Schädlingsbekämpfung

- Beleg: `it.json:1122` «Preserva l’edificio ed è necessaria anche quando è vuoto; i suoi costi …». Die Kategorie heisst italienisch «Controllo dei parassiti» (`0002_stammdaten.sql:38`), maskulin. (fr «Lutte antiparasitaire» ist feminin, «Elle … nécessaire» stimmt; en «It» stimmt.)
- Korrektur: «Preserva l’edificio ed è necessario anche quando è vuoto; i suoi costi non sono legati all’uso.»

### H-26 (Nit) fr/it: Name der Gebäudeversicherung im Hilfetext

- Beleg: `fr.json:1102` «l’assurance du bâtiment», `it.json:1102` «assicurazione dell’edificio»; die Kategorie heisst «Assurance bâtiment» / «Assicurazione edificio» (`0002_stammdaten.sql:31`). In `invoices_category_not_allocable_text` und `invoices_legal_text` ist das schon angeglichen (K-2 behoben).
- Korrektur: «l’assurance bâtiment» / «l’assicurazione edificio», damit der Liegenschaftsverwalter die Kategorie der Liste wiedererkennt.

### H-27 (Nit) Italienisch: «manutenzione» für Instandhaltung beim Hauswart

- Beleg: `it.json:1109` «Pulizia, conduzione del riscaldamento e piccola manutenzione sono legate all’uso; amministrazione e riparazioni no.» `i18n-begriffe.md`: «Wartung (umlagefähig, Art. 5 Abs. 2 lit. g VMWG; nicht «Unterhalt» nach Art. 256 OR)» → it «manutenzione». Deutsch sagt «kleine Instandhaltung» (MV-Merkblatt: «Kleinere Instandhaltungen wie Ersatz von Glühlampen, Ölen von Schlössern»); fr «petits travaux d’entretien» und en «minor upkeep» treffen das.
- Warum: Im Italienischen verschwimmt so die Grenze zwischen «Wartung» (umlagefähig) und Unterhalt (trägt der Vermieter), die die Begriffsliste ausdrücklich zieht. Inhaltlich ist der Satz nicht falsch, «piccola manutenzione» ist im Tessin üblich.
- Korrektur: «piccoli lavori di manutenzione ordinaria (p. es. sostituire lampadine)» oder «piccoli interventi di cura dell’edificio»; mit dem Tessiner Sprachgebrauch abstimmen.

### H-28 (Nit) Kleinigkeiten in den Übersetzungen

- fr Zitierweise: `fr.json:776` «(art. 256 al. 1, 256b et 257a CO)» ohne Kommas, sonst «art. 256, al. 1, CO» (`:1115`) und «art. 5 OBLF» (`:1103`). Fedlex fr schreibt «art. 269a, let. b, CO» (Art. 14 OBLF). Vorschlag: «(art. 256, al. 1, 256b et 257a CO)».
- fr/it Verwaltung: `fr.json:1119` «Vous facturez le travail du décompte des charges par les frais de gestion» → «Le travail lié au décompte des charges se facture via les frais de gestion, si le contrat de bail le prévoit (art. 4, al. 3, OBLF)»; `it.json:1119` «Il lavoro per il conteggio spese accessorie lo fattura con le spese di gestione» → «Il lavoro per il conteggio spese accessorie si fattura con le spese di gestione, se il contratto di locazione le prevede (art. 4 cpv. 3 OLAL)». Inhalt richtig (Art. 4 al. 3 OBLF / cpv. 3 OLAL).
- en `backend_ki_proposal_unavailable`/`_unsure` (`en.json:1364–1365`): «Choose yourself whether the costs are allocable.» → «Decide yourself whether the costs are allocable.»

## Weitere Prüfpunkte (bestätigt)

- **21 Begründungen de:** alle wie in Runde 1 bestätigt oder korrigiert; Gesetzeszitate gegen Fedlex geprüft (Art. 256 Abs. 1, 256b, 257a Abs. 2, 257b Abs. 1, 269a Bst. b OR; Art. 4 Abs. 3, 5 Abs. 1, 5 Abs. 2 Bst. d und i, 6, 14 VMWG). Hauswart «kleine Instandhaltung» deckt sich mit dem MV-Merkblatt S. 1/2 (zulässig «Kleinere Instandhaltungen …»; unzulässig «Reparaturen und Erneuerungen in Haus und Umgebung»).
- **Übersetzungen fr/it/en:** Begriffe gemäss `i18n-begriffe.md` geprüft: Mieter locataire/inquilino/tenant, Vermieter bailleur/locatore/landlord, Mietvertrag contrat de bail/contratto di locazione/rental contract, Nebenkosten frais accessoires/spese accessorie/utility costs, Nebenkostenabrechnung décompte des charges/conteggio spese accessorie/utility cost statement, Verwaltungspauschale frais de gestion/spese di gestione/management fee, Wartung maintenance/manutenzione/servicing (en nie «maintenance»), Mietzins loyer/pigione/rent, umlagefähig imputable/addebitabile/allocable (alle drei in der Liste noch mit ❓, #83). Abkürzungen OR→CO, VMWG→OBLF (fr), OLAL (it); en verwendet «CO» und «VMWG» (eine englische Fassung der VMWG gibt es auf Fedlex nicht; die deutsche Abkürzung ist daher vertretbar). Der Inhalt jeder fr/it/en-Begründung entspricht dem deutschen Satz; Begriffe aus dem Gesetz passen zum Fedlex-Wortlaut (fr «état approprié à l’usage», «entretenir», «charges»; it «stato idoneo all’uso», «oneri», «computabili»/«addebitabili»; en «fit for use»). Ausnahmen: H-25 bis H-28.
- **`categories_contract_note`, Hilfetext Art. 257a Abs. 2 OR:** de/fr/it/en entsprechen Art. 257a Abs. 2 OR («besonders vereinbart» / «convenu spécialement» / «specialmente pattuito» / «specifically agreed»); «als Nebenkosten nennt» ist die praxisnahe Umschreibung (MV-Merkblatt S. 3: Schneeräumung «muss gesondert erwähnt werden im Mietvertrag»).
- **`backend_ki_proposal_unsure`:** auch bei unbrauchbarer KI-Antwort (`llm.service.ts:222–223`); «nicht sicher» ist dafür vertretbar, ein erneuter Versuch wird nicht versprochen.
- **`privacy_llm_off` (#216):** erscheint nur bei `enabled === false` (`privacy/+page.svelte:11–16`), das Backend liefert `enabled` aus `llmConfig.enabled` (`app.ts:69`). Die Aussage stimmt mit dem Code: ohne KI wirft `proposeAllocability` vor jedem Aufruf (`llm.service.ts:215`), die Rechnungs-Kategorisierung ruft nicht auf (Runde 1). Die Unterscheidung «aus» / «lokal» (Hinweis aus Runde 1) ist umgesetzt. fr/it/en sinngleich. Art. 19 DSG verlangt den Satz nicht; zutreffend und ok.
- **Szenarien:** `categories.feature:62–103` und `invoice-detail.feature:18–22` verwenden Glossarbegriffe (Liegenschaftsverwalter, vordefinierte Kategorie – H-12 –, umlagefähig, Mietvertrag, Mieter, Nebenkostenabrechnung, KI). «erklärt ein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst» entspricht Glossar Z. 63 («Umlagefähige Rechnung: Die Rechnung fliesst in die Nebenkostenabrechnung ein»). Die erwarteten Teiltexte («nicht mit dem Gebrauch zusammen», «Reparaturen, Ersatzteile und Serviceabos mit Reparaturen trägt der Vermieter», «nur, wenn der Mietvertrag sie als Nebenkosten nennt», «Die KI ist sich nicht sicher.», «Die KI ist nicht erreichbar. Versuchen Sie es später nochmals») stehen wörtlich in `de.json`. Das Wiederherstellen der Schneeräumung in `fixtures/backend.ts` ist fachlich unkritisch, weil das Szenario keine Rechnung dieser Kategorie anlegt (Kommentar dort).
- **Bearbeitungsseite:** Der Grund richtet sich nach der gespeicherten, nicht nach der gerade gewählten Umlagefähigkeit (`CategoryForm.svelte:120` übergibt `category`). Wer «Feuerlöscher-Wartung» auf «umlagefähig» umstellt, sieht den Grund bis zum Speichern weiter. Das ist fachlich eher hilfreich (der Vermieter sieht vor dem Speichern, warum die Vorgabe anders ist) und kein Befund.
- **README (H-2, H-18):** abgesehen von H-22 bestätigt; der Satz zu `LLM_ENABLED=false` passt zu `privacy_llm_off`.

## Fehlende Begriffe

Keine neuen. Die drei Begriffe aus H-12 stehen im Kommentar auf #75.

## Nicht bestätigt

- **Englische Gesetzesabkürzung der VMWG:** Fedlex hat keine englische Fassung von SR 221.213.11 (SPARQL-Abfrage nach `ENG` ohne Treffer). Ob in englischen Texten «VMWG» oder eine Übersetzung üblich ist, habe ich nicht weiter geprüft; nicht als Befund geführt.
- **Englische OR-Fassung:** die neueste englische Fassung auf Fedlex ist vom 1. Januar 2026, nicht vom 1. Oktober 2026 wie de/fr/it. Ob sich die Artikel 256–257b zwischen den beiden Fassungen geändert haben, habe ich nicht verglichen; verbindlich ist die englische Übersetzung ohnehin nicht, sie diente nur zum Abgleich der Wortwahl.
- **«piccola manutenzione» im Tessiner Sprachgebrauch (H-27):** nicht an einer Tessiner Quelle (z. B. ASI-Merkblatt) geprüft.
- **Grundgebühr Kehricht pro Wohnung:** MV-Merkblatt S. 2 lässt die Grundgebühr nur zu, «sofern die Gebühr vom Verbrauch abhängig ist»; ob jede kommunale Grundgebühr pro Haushalt darunter fällt, regelt kein Fedlex-Text ausdrücklich (Art. 257b Abs. 1 OR: «öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»). Wie in Runde 1 vertretbar, aber **unsicher**.
- **Meteorabwasser, Lift-Wartung, Gebäudeversicherung als Last:** unverändert wie Runde 1 «Nicht bestätigt» (Praxis bzw. Lehre, keine ausdrückliche Norm).
- **Laufende App (http://localhost:3300):** nicht angesehen; die Prüfung stützt sich auf Code, Messages und Szenarien im Worktree.
- Gelesen: Dateien oben unter «Gegenstand», `docs/reviews/186-fachreview-1.md`, `docs/reviews/185-review-1.md`, `docs/design/i18n-begriffe.md`, `UBIQUITOUS_LANGUAGE.md`, `backend/src/services/category.service.ts:197–222`, Issue #219 und die Kommentare auf #75 (über `gh api`). `docs/nebenkostenabrechnung-anforderungen.md` und `docs/anforderungen-vertragsende.md` wurden in Runde 1 geprüft und sind vom Delta nicht berührt.
