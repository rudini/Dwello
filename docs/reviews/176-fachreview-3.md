# Fachreview #176, Runde 3 (Delta zu Runde 2, Feature-Review)

Geprüfter Stand: Commit `194a28a` (Worktree `review-176-fach3`), Vergleichsbasis Runde 2: `679089a`. Datum 2026-10-15.
Gegenstand: `privacy_llm_external` / `privacy_llm_local` de/fr/it/en (`messages/*.json:132-133`), `categories_allocable_help` de/fr/it/en (`messages/*.json:1089`), `backend/src/config/llm.ts:46-152` (LEGAL_BASIS, CATEGORIZATION_PROMPT, ALLOCABILITY_PROMPT), `backend/scripts/llm-stub.ts`, `backend/scripts/llm-eval.ts`, `docs/design/i18n-begriffe.md:42`, `README.md` (Abschnitt «External LLM provider»), `docs/nebenkostenabrechnung-anforderungen.md:29`, `docs/api-specification.md:103`, `tests/e2e/features/privacy.feature` (ohne `@wip`), `src/__tests__/privacy-page.dom.test.ts`, Issues #184 und #185, Ablehnung F-17 (de).
Laufende App (http://localhost:3300, nur gelesen, nichts gespeichert): `/privacy` und `/config/categories/new` (de) zeigen genau die Texte aus `messages/de.json:133` und `:1089`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| F-21 | Rechtstexte | Nit | fr `privacy_llm_external`: «pour que l’IA propose si ses frais sont imputables» ist kein idiomatisches Französisch («proposer si»); Inhalt richtig |

Keine Blocker, keine Major, keine Minor.

## Status F-12 bis F-20

| ID | Status | Beleg |
|---|---|---|
| F-12 (Major) | behoben | `de.json:132` «… sowie Name und Beschreibung aller Kategorien übermittelt»; fr/it/en `:132` gleicher Inhalt («le nom et la description de toutes les catégories», «il nome e la descrizione di tutte le categorie», «the name and description of all categories»). Deckt den Datenfluss in `llm.ts:83-92` (`name`, `nameDE`, `description` jeder Kategorie) ab. DOM-Test `privacy-page.dom.test.ts` prüft «Name und Beschreibung aller Kategorien». README LLM-Absatz nennt denselben Umfang. Damit ist auch `privacy_third_5` («Ausser den hier … genannten Diensten erhält niemand Daten») wieder wahr. |
| F-13 (Minor) | behoben | Zweck «damit die KI vorschlägt, ob ihre Kosten umlagefähig sind» (Art. 19 Abs. 2 lit. b DSG) und «Steht in diesen Angaben ein Name, wird auch er übermittelt» in allen vier Sprachen. |
| F-14 (Minor, vorbestehend) | Open Work, #184 (`fachlich`, `entscheiden`) | Issue zitiert Art. 19 Abs. 4 DSG wörtlich und DSV Anhang 1 Ziff. 44; Optionen A/B richtig dargestellt. |
| F-15 (Nit, vorbestehend) | Open Work, #184 | Punkt 2 des Issues. In der laufenden App (lokaler Stand-in) zeigt `/privacy` den lokalen Text; das ist für diese Installation richtig. |
| F-16 (Minor) | behoben | fr `:1089` «seuls l’exploitation et la maintenance comptent», en «only operation and servicing count»; it-Stand-in «Il mantenimento e il rinnovo dell’edificio …» (`llm-stub.ts:21`). Neu belegt: Art. 256 cpv. 1 CO it (Fedlex, Stand 1.10.2026) «… mantenerla tale per la durata della locazione» – «mantenimento» entspricht der Erhaltungspflicht, «manutenzione» (Art. 5 cpv. 2 lett. g OLAL) der Wartung; die Unterscheidung im it-Text ist damit fedlex-gestützt. Begriffszeile `i18n-begriffe.md:42` richtig. |
| F-17 (Nit) | fr behoben, de abgelehnt – Ablehnung hält | fr Hilfetext «(art. 257a, al. 2, CO)», Stand-ins «(art. 257a, al. 1, CO)», «(art. 257b, al. 1, CO)» = Fedlex-Stil. de: `no-german-in-code.test.ts:7-19` nimmt jedes Wort ab 3 Buchstaben aus `de.json`, das in `en.json` fehlt, als deutsches Wort; «Abs.» in `de.json` machte `abs` dazu und träfe `Math.abs`. «Absatz» ist zudem für die Zielgruppe verständlicher und rechtlich gleichwertig. Die Uneinheitlichkeit mit der KI-Begründung («Abs.») bleibt ein Stilunterschied ohne Folgen. |
| F-18 (Minor) | behoben | `llm.ts:72` «Art. 5 und 6 VMWG gelten nur für Heizungs- und Warmwasserkosten. Zitiere den Artikel aus der Rechtsgrundlage, der deine Antwort trägt, mit Absatz.» Art. 256 Abs. 1, 256b OR und 6a–6c VMWG sind wieder zitierbar. Test `llm-prompt.test.ts:50-52`. |
| F-19 (Minor) | behoben | `llm.ts:143` nur im `ALLOCABILITY_PROMPT`: «Den Aufwand für die Erstellung der Nebenkostenabrechnung (Art. 4 Abs. 3 VMWG) rechnet Dwello über die Verwaltungspauschale ab; eine Kategorie dafür ist nicht umlagefähig.» Stimmt mit Glossar (`UBIQUITOUS_LANGUAGE.md:80`, `:133`) überein. Eval-Fall `llm-eval.ts:50` «Honorar für die Nebenkostenabrechnung» → false. Für die Rechnungskategorisierung bleibt die Seed-Kategorie «Verwaltung» nicht umlagefähig (`0002_stammdaten.sql:34`), eine nicht umlagefähige Kategorie macht ihre Rechnungen nicht umlagefähig; keine Doppelverrechnung über diesen Weg. |
| F-20 (Nit) | behoben | `nebenkostenabrechnung-anforderungen.md:29` und `api-specification.md:103` nennen genau die zitierten Absätze (Art. 256 Abs. 1, 256b, 257a, 257b OR; Art. 4 Abs. 3, 5 Abs. 1–2, 6, 6a, 6b, 6c Abs. 3 VMWG) und die weggelassenen mit Grund; deckt sich mit `llm.ts:47-70`. |

Weitere Punkte aus Runde 2: C-8 (Wasser/Abwasser) behoben, siehe unten. F-11-Rest: Open Work #185 (`fachlich`, Entscheid festgehalten, «Done means» richtig).

## Geprüft und bestätigt

### Datenschutztexte (Rechtstexte)

- **de** `:132-133`: wörtlich mein Vorschlag aus Runde 2. Art. 19 Abs. 2 lit. b–c und Abs. 4 DSG (Zweck, Empfänger, Staat) erfüllt; Garantie nach Abs. 4 offen in #184.
- **fr/it/en** `:132-133`: inhaltlich deckungsgleich mit de (Rechnungssteller inkl. Einzelpersonen, Beschreibung, Betrag, Name und Beschreibung aller Kategorien; Kategorie-Prüfung mit Zweck; Namenshinweis; lokal: Server des Betreibers, Daten verlassen ihn nicht). Begriffe nach `i18n-begriffe.md`: Rechnungssteller «émetteur de la facture» / «emittente della fattura» / «invoice issuer» (Z. 36), KI «IA» / «IA» / «AI» (Z. 44), Umlagefähig «imputable» / «addebitabile» / «allocable» (Z. 41); Betreiber «exploitant» / «gestore» / «operator» wie in den übrigen Datenschutztexten derselben Dateien. Anrede: fr «vous», it «Lei» («Se fa verificare»), en neutral.
- **Szenario** `privacy.feature` «KI auf dem Server des Betreibers»: Satz «Rechnungen und neue Kategorien … verlassen den Server nicht» entspricht `privacy_llm_local`.
- Cookies (Art. 45c FMG) und Nutzungsbedingungen: von der Änderung nicht berührt.

### Hilfetext Wasser/Abwasser (C-8)

- de `:1089` eigener Satz wie vorgeschlagen; fr/it/en wörtlich die Vorschläge aus Runde 2. In der laufenden App (de) so angezeigt.
- Rechtsgrundlage für die wertabhängige Grundgebühr: Art. 257b Abs. 1 OR «öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben», Art. 256b OR «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.» (Fedlex de, Stand 1.10.2026). it-Fassung Art. 256b CO: «Il locatore sottostà ai tributi pubblici e agli oneri che gravano sulla cosa locata.»; Art. 257a cpv. 1–2 CO it: «Le spese accessorie sono la remunerazione dovuta per le prestazioni fornite dal locatore o da un terzo in relazione all’uso della cosa.» / «Sono a carico del conduttore soltanto se specialmente pattuito.» – bestätigt «spese accessorie» im it-Hilfetext.
- Regenwassergebühr: weiter nur Merkblatt, siehe «Nicht bestätigt».

### Stand-in und Eval

- `llm-stub.ts:19-21, 37-39`: Begründungen fr mit Kommas, it «mantenimento», de/en unverändert; inhaltlich richtig.
- `llm-eval.ts:50` neuer Fall richtig (F-19).

## Befund

### F-21 (Nit, Rechtstexte): fr «propose si»

- Beleg: `messages/fr.json:132` «… son nom et sa description sont transmis pour que l’IA propose si ses frais sont imputables.»
- Warum: «proposer» verlangt ein Objekt oder «de + Infinitiv»; «proposer si» liest sich als Übersetzungsfehler. Der rechtliche Inhalt (Zweck nach Art. 19 Abs. 2 lit. b DSG) ist trotzdem erkennbar, daher nur Nit.
- Behebung: «… pour que l’IA indique si ses frais sont imputables.» (it «affinché l’IA proponga se …» ist im Italienischen tragbar; en «so that the AI can suggest whether …» richtig.)

## Fehlende Begriffe

Keine neuen. «Wartung» ist jetzt in `i18n-begriffe.md:42` mit fr/it/en geführt (kein Glossarbegriff in `UBIQUITOUS_LANGUAGE.md`, dort nicht nötig, da kein Domänenobjekt). F-7 («Umlagefähigkeit», «Vorschlag der KI», #75) und F-2 (#180) bleiben Open Work.

## Gesetzestexte (Fedlex, wörtlich, neu in Runde 3)

- **OR it, SR 220, Stand 1.10.2026**, https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20261001/it/html/fedlex-data-admin-ch-eli-cc-27-317_321_377-20261001-it-html-3.html (abgerufen 2026-10-15, `scratchpad/fedlex-it3/or-it.html`):
  - Art. 256 cpv. 1: «Il locatore deve consegnare la cosa nel momento pattuito, in stato idoneo all’uso cui è destinata e mantenerla tale per la durata della locazione.»
  - Art. 256b: «Il locatore sottostà ai tributi pubblici e agli oneri che gravano sulla cosa locata.»
  - Art. 257a cpv. 1 und 2: zitiert oben.
- Übrige Zitate (DSG Art. 19, DSV Anhang 1, OR de/fr/en, VMWG de/fr/it) wie in `docs/reviews/176-fachreview-2.md`, Abschnitt «Gesetzestexte».

## Nicht bestätigt

- **Regenwasser-/Meteorabwassergebühr** im Hilfetext: weiterhin nur Merkblatt Mieterverband; keine Fedlex-Norm nennt sie (siehe Runde 2). Folgt dem Entscheid des Product Owners für den Seed.
- **fr/it/en-Hilfetexte und Datenschutztexte in der laufenden App:** `/fr/…`, `/it/…`, `/en/…` gibt es nicht (404); die Sprache wird anders gewählt. Nicht im Browser umgestellt (nichts speichern); geprüft nur in `messages/{fr,it,en}.json`, deren Schlüssel die Seite verwendet.
- **Wirkung der Prompt-Änderungen auf ein echtes Modell:** nicht gemessen; der Stand-in antwortet nach Namensmuster. `llm-eval.ts` nicht gegen ein echtes Modell laufen lassen.
- **Ob die KI bei der Rechnungskategorisierung ein Honorar für die Nebenkostenabrechnung zuverlässig der Kategorie «Verwaltung» zuordnet** (deren Beschreibung «ohne Verwaltungspauschale» lautet): nicht prüfbar ohne echtes Modell; kein Befund, weil die Kategorie nicht umlagefähig ist und ein Fehlgriff nur bei einer umlagefähigen Kategorie schaden würde.
- **en «servicing»:** Fedlex führt keine englische VMWG; Wortwahl sprachlich, nicht fedlex-belegt (wie Runde 2).
