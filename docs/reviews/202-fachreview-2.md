# Fachreview #202, Runde 2: Prompt für neue Kategorien mit den vordefinierten Kategorien

Geprüfter Stand: Worktree `review-202-fach2`, Commit `8bc5674` (Bereich `039eb29..8bc5674`).
Gegenstand (nur Delta und offene Befunde aus Runde 1): `backend/src/config/llm.ts` (`ALLOCABILITY_PROMPT`, `buildAllocabilityPrompt`), `backend/src/services/llm.service.ts` (`proposeAllocability`, Filter `type === 'predefined'`), die Beschreibungen der vordefinierten Kategorien in `backend/migrations/0002_stammdaten.sql:14-38`, `tests/e2e/features/categories-ki.feature`, `tests/e2e/steps/categories.steps.ts:170-172`, `backend/scripts/llm-stub.ts:42-66`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-4 | Verwaltung | Minor | Beschreibungen «Gartenpflege», «Kehricht» und «Heizung» nennen keine Ausschlüsse; als Vorbild im neuen Prompt lehren sie die KI, Neubepflanzung, Grümpelentsorgung oder Heizungsreparaturen als umlagefähig einzustufen (Text bestehend, Wirkung neu) |
| M-3 | Mietrecht | Nit | «Gebäudeversicherung» und «Verwaltung» als nicht umlagefähige Vorbilder ohne die Ausnahme für die Heizungsanlage (Art. 5 Abs. 2 Bst. h und i VMWG) (Text bestehend, Wirkung neu) |
| V-5 | Verwaltung | Nit | Begriff «vordefinierte Kategorie» (Szenario, Prompt) fehlt im Glossar; Vorschlag unten |

Status der Befunde aus Runde 1:

| ID | Status | Beleg |
|----|--------|-------|
| M-1 (Major) | erledigt (Entscheid Product Owner: nur vordefinierte Kategorien) | `llm.service.ts:213-215` filtert `c.type === 'predefined'`; eigene Kategorien erhalten beim Anlegen `type: 'custom'` (`category.service.ts:168`), die Stammdaten den Standardwert `'predefined'` (`schema.ts:172`, `0002_stammdaten.sql` setzt `type` nicht). Der pg-Test `category-allocability.pg.test.ts:59-79` belegt, dass eine eigene Kategorie nicht im Prompt steht. Eine vom Vermieter umgestellte vordefinierte Kategorie erscheint weiter mit seiner Einstufung; vom Product Owner akzeptiert. |
| V-1 (Major) | erledigt | `categories-ki.feature` hat keine Grundlage; es gibt dort keine zweite «Treppenhausreinigung». Wegen des Filters könnte eine gleichnamige eigene Kategorie aus anderen Szenarien das Urteil ohnehin nicht mehr beeinflussen. |
| V-2 (Minor) | erledigt | `llm-stub.ts:45, 56`: beide Einträge `match: /treppenhaus/i`; «Fassadenreinigung» fällt wieder auf den Standardeintrag. |
| M-2 (Minor) | erledigt | `llm.ts:145`: «VORDEFINIERTE UMLAGEFÄHIGE KATEGORIEN (dürfen auf Mieter umgelegt werden, wenn im Mietvertrag vereinbart, Art. 257a Abs. 2 OR)». Deckt sich mit Fedlex OR Art. 257a Abs. 2: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» |
| V-3 (Nit) | erledigt im neuen Eintrag | `llm-stub.ts:50`: «spese d’esercizio correnti (art. 257b cpv. 1 CO)». Der Standardeintrag `llm-stub.ts:86` sagt weiter «Costi d’esercizio correnti» (bestehend, ausserhalb des Deltas). |

## Befunde

### V-4 (Minor): Vorbilder ohne Ausschlüsse (Beschreibungstext bestehend, Wirkung neu)

**Beleg.**
- `0002_stammdaten.sql:22`: Gartenpflege, umlagefähig, «Pflege von Garten und Umgebung».
- `0002_stammdaten.sql:24`: Kehricht, umlagefähig, «Kehrichtabfuhr und Entsorgung».
- `0002_stammdaten.sql:15`: Heizung, umlagefähig, «Kosten für das Heizen des Gebäudes».
- Zum Vergleich nennen Kaltwasser, Abwasser, Lift und Hauswart (`:17-21`) ihre Ausschlüsse («ohne Reparaturen …», «ohne Grundgebühren, die vom Wert der Liegenschaft abhängen»).
- Mieterverband, Merkblatt «Zulässige und unzulässige Nebenkosten» 2026, S. 3: «Unzulässige Gartenpflegekosten: − Anschaffungskosten für Werkzeuge und Maschinen − Sanierung von Rasen, etc. − Schädlingsbekämpfung − Neubepflanzung oder Fällen von Bäumen − Neubepflanzungen»; S. 2: «Unzulässige Kehrichtkosten: − Kosten für von der Vermieterschaft organisierte Entsorgungen von Grümpel, etc. − Grundgebühren, die unabhängig vom Verbrauch anfallen und an den Wert der Liegenschaft gekoppelt sind.»
- Fedlex VMWG Art. 6: «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.»
- `llm.ts:144-149` (neu): die Zeilen erscheinen jetzt als Vorbild unter «VORDEFINIERTE UMLAGEFÄHIGE KATEGORIEN».

**Warum falsch.** Seit #202 dient die Beschreibung als Lehrbeispiel für neue Kostenarten. «Pflege von Garten und Umgebung» deckt dem Wortlaut nach auch «Baumfällung» oder «Neubepflanzung Umgebung», «Entsorgung» auch eine Grümpelräumung, «Kosten für das Heizen» auch eine Brennerreparatur. Ein kleines Modell (Standard `qwen2.5:3b`) folgt dem nahen Beispiel eher als dem allgemeinen Gesetzestext. Für die Heizung hilft Art. 6 VMWG in der Rechtsgrundlage des Prompts, für Garten und Kehricht steht dort nichts Konkretes. Den Mieter trifft das Ergebnis: Unterhalt (Art. 256 Abs. 1 OR) erscheint als vorgeschlagene Nebenkostenart. Kein Blocker, weil der Vermieter den Vorschlag bestätigt und die Hauptfälle des Issues stimmen.

**Behebung.** Beschreibungen mit derselben Form wie bei Hauswart/Lift ergänzen (neue Migration, nicht `0002` ändern), z. B.:
- Gartenpflege: «Rasenmähen, Rückschnitt, Laub- und Unkrautentfernung; ohne Neubepflanzung, Baumfällung, Rasensanierung und Geräte»
- Kehricht: «Kehrichtabfuhr und Grünabfuhr nach Gebührenordnung; ohne Grümpelentsorgung und Grundgebühren, die vom Wert der Liegenschaft abhängen»
- Heizung: «Brennstoff, Energie und Betrieb der Heizung; ohne Reparatur und Erneuerung der Anlage»
Fachlich eine eigene Aufgabe (Stammdaten, Rechnungs-Kategorisierung nutzt dieselben Zeilen): als Issue `fachlich` erfassen, wenn nicht in diesem Slice behoben.

### M-3 (Nit): Ausnahme für die Heizungsanlage bei Versicherung und Verwaltung (Text bestehend, Wirkung neu)

**Beleg.**
- `0002_stammdaten.sql:30, 33`: Gebäudeversicherung «Prämien der Gebäudeversicherung», Verwaltung «Allgemeine Verwaltungskosten (ohne Verwaltungspauschale)», beide nicht umlagefähig.
- Fedlex VMWG Art. 5 Abs. 2: «Darunter fallen insbesondere die Aufwendungen für: … h. die Versicherungsprämien, soweit sie sich ausschliesslich auf die Heizungsanlage beziehen; i. die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt.»
- Merkblatt S. 4: «Zulässig sind Versicherungen für: − Heizungsanlage».

**Warum.** Eine neue Kategorie «Versicherung Heizanlage» oder «Verwaltung Heizung» liegt sprachlich nahe an den nicht umlagefähigen Vorbildern. Die Rechtsgrundlage im Prompt zitiert Bst. h und i wörtlich, darum nur Nit. **Behebung:** In derselben Migration wie V-4 die Beschreibungen ergänzen: «… ohne Prämien, die nur die Heizungsanlage betreffen (Heizung)» bzw. «… ohne Verwaltung der Heizung (Heizung) und Verwaltungspauschale».

### V-5 (Nit): Fehlender Begriff «vordefinierte Kategorie»

**Beleg.** `categories-ki.feature:5, 8` («wie die vordefinierten Kategorien», «wie die vordefinierten»); `llm.ts:145, 148`. `UBIQUITOUS_LANGUAGE.md:66-80` kennt «Kategorie», «Umlagefähig» (mit «eigene Kategorien») und «Nicht umlagefähig», aber keinen Eintrag «Vordefinierte Kategorie»; nur «Vordefinierte Heizprofile» (`:118`) und «Vordefiniert» bei den Verteilschlüsseln (`:101-104`).

**Vorschlag (Issue, Labels `fachlich`, `entscheiden`):** «**Vordefinierte Kategorie** | Mit Dwello gelieferte Kategorie (Listen unter «Umlagefähig» und «Nicht umlagefähig»); Gegenstück zur eigenen Kategorie des Vermieters. | `type = 'predefined'`». Bis dahin ist das Wort analog zu den Heizprofilen verständlich; kein Hindernis für den Slice.

## Bestätigt mit Quelle

- **Liste im Prompt = Glossar.** Die 12 umlagefähigen und 9 nicht umlagefähigen Stammdaten-Kategorien (`0002_stammdaten.sql:14-38`) stimmen mit `UBIQUITOUS_LANGUAGE.md:76, 80` überein.
- **Einstufung der nicht umlagefähigen Vorbilder.** Reparaturen, Renovation, Wertvermehrende Investitionen: Fedlex OR Art. 256 Abs. 1: «Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.» Liegenschaftssteuer, Gebäudeversicherung: OR Art. 256b: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.» Verwaltung (ohne Pauschale): VMWG Art. 4 Abs. 3 erlaubt nur «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten»; Merkblatt S. 4 gleich. Schädlingsbekämpfung: Merkblatt S. 3 (unzulässig) und Entscheid #176. Feuerlöscher-Wartung: Merkblatt S. 4 «rechtlich umstritten … Serviceabos … Feuerlöschgeräte und Brandmeldeanlagen»; Dwello hat in #176 die mieterfreundliche Seite gewählt, die Beschreibung «(trägt der Vermieter)» passt dazu.
- **Einstufung der umlagefähigen Vorbilder.** Heizung, Warmwasser, Kaminfeger: OR Art. 257b Abs. 1 («… wie Heizungs-, Warmwasser- und ähnliche Betriebskosten …») und VMWG Art. 5 Abs. 2 Bst. d «die Reinigung der Heizungsanlage und des Kamins …». Kaltwasser, Abwasser (verbrauchsabhängig, ohne wertabhängige Grundgebühr), Allgemeinstrom, Lift (reine Wartung), Hauswart (ohne Verwaltung/Reparaturen), Schneeräumung, TV/Kabelanschluss: Merkblatt S. 1-3 je unter «Zulässig» bzw. «Gemäss verbreiteter Praxis: Serviceabo für den Lift»; Grundsatz OR Art. 257a Abs. 1: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.»
- **Überschrift nicht umlagefähig** (`llm.ts:148`, «dürfen NICHT auf Mieter umgelegt werden»): richtig für Lasten und Unterhalt nach OR Art. 256 Abs. 1 und 256b (zwingend für Wohnräume nach Art. 256 Abs. 2, hier nicht zitiert, da nicht nötig).
- **Rechtsgrundlage im Prompt** unverändert und wörtlich (Fedlex OR SR 220, VMWG SR 221.213.11; geprüft in Runde 1 und für Art. 256 Abs. 1, 256b, 257a Abs. 2, VMWG Art. 5 Abs. 2 Bst. h/i, Art. 6 erneut gegen die Downloads).
- **Szenario** `categories-ki.feature`: Begriffe Liegenschaftsverwalter, Kategorie, umlagefähig, KI aus dem Glossar; Ergebnis «umlagefähig, Begründung Hauswart» fachlich richtig (Runde 1, «Treppenhausreinigung umlagefähig, wenn vereinbart»; Merkblatt S. 2 «Als Treppenhausreinigungskosten zulässig sind: − Reinigung des Treppenhauses»). Die Nutzenzeile «damit ich nicht wähle, Kosten umzulegen, die der Vermieter trägt, oder umgekehrt» ist korrekt.
- **Stand-in** `llm-stub.ts:42-66`: die richtige Antwort nur, wenn «Caretaker (Hauswart)» im umlagefähigen Block steht; die falsche Antwort («Hängt nicht mit dem Gebrauch zusammen») ist bewusst die Wiedergabe des Fehlers aus #202 für den roten Lauf und erscheint mit dem neuen Prompt nicht mehr. Übersetzungen «Concierge»/«Portiere»/«Caretaker» wie `0002_stammdaten.sql:21`; «frais d’exploitation» (fr) und «spese d’esercizio» (it) wie OR Art. 257b Abs. 1 in FR/IT.

## Fehlende Begriffe

- «Vordefinierte Kategorie» (V-5), Formulierung oben.

## Nicht bestätigt

- **Wirkung auf das Standardmodell:** nicht gemessen (kein Modell im Worktree); ob V-4 in der Praxis zu Fehlurteilen führt, zeigt erst `bun run llm:eval` mit Fällen wie «Baumfällung», «Grümpelentsorgung», «Brennerreparatur». Gesucht: `backend/scripts/llm-stub.ts`, keine Eval-Fälle dafür im Delta.
- **Grünabfuhr, Gratifikationen Hauswart:** Merkblatt nennt sie «teils umstritten» bzw. «umstritten»; keine Fedlex-Stelle. Für #202 nicht nötig, nicht weiter geprüft. **unsicher**.
- **Rechnungs-Kategorisierung** (`llm.ts:104-108`, «ERLAUBTE KATEGORIEN (können auf Mieter umgelegt werden)», alle Kategorien inkl. eigene): ausserhalb des Deltas und für die Auswahl unter bestehenden Kategorien richtig; der Vorbehalt von Art. 257a Abs. 2 OR fehlt dort weiterhin (bestehend, nicht bewertet).
- **Doppelverrechnung Hauswart / Treppenhausreinigung** (Merkblatt S. 2 «Unzulässige Kosten sind: − Weitere Tätigkeiten von Hauswartung oder Reinigungsfirma»): wie in Runde 1 nicht Teil von #202, nicht geprüft.
