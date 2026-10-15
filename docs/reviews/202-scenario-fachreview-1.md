# Fachreview #202, Runde 1: @wip-Szenario «KI beurteilt eine neue Kategorie wie die bestehenden»

Geprüfter Stand: Worktree `review-202-scenario-fach`, Commit `1d1f0df` (chore(tests): add @wip KI category scenario).
Gegenstand: `tests/e2e/features/categories.feature:68-73`, `tests/e2e/steps/categories.steps.ts:170-172`, `backend/scripts/llm-stub.ts:19-20, 42-66, 94`, geplante Prompt-Änderung in `backend/src/config/llm.ts` (`buildAllocabilityPrompt` soll die Blöcke «ERLAUBTE KATEGORIEN …» / «NICHT ERLAUBTE KATEGORIEN …» aus `categoryLines` erhalten).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | Geplanter Prompt stellt eigene (und geänderte) Kategorien des Vermieters unter «können auf Mieter umgelegt werden» als geprüfte Regel dar; die KI lernt Fehlentscheide und bestätigt sie mit Gesetzesartikeln |
| V-1 | Verwalter | Major | Die Grundlage legt schon eine umlagefähige Kategorie «Treppenhausreinigung» an: das Szenario prüft eine «neue» Kategorie, die es schon gibt, und belegt nicht, dass die KI wie «Hauswart» urteilt |
| V-2 | Verwalter | Minor | Stand-in antwortet für jede «…reinigung» «wie beim Hauswart, umlagefähig», auch für «Fassadenreinigung» (Unterhalt der Gebäudehülle, im selben Feature nicht umlagefähig) |
| M-2 | Mietrecht | Minor | Überschrift «können auf Mieter umgelegt werden» ohne den Vorbehalt der besonderen Vereinbarung (Art. 257a Abs. 2 OR); Begründung im Stand-in ebenso |
| V-3 | Verwalter | Nit | Italienische Begründung «costi d'esercizio correnti» weicht vom Gesetzeswortlaut «spese d'esercizio» ab |

Bestätigt (ohne Befund): Treppenhausreinigung ist umlagefähig, wenn vereinbart; die Analogie zum Hauswart trägt; Artikelzitate im Stand-in (Art. 257b Abs. 1 OR); Glossarbegriffe des Szenarios; FR/IT-Namen «Concierge»/«Portiere» wie in den Stammdaten.

## Befunde

### M-1 (Major): Eigene Kategorien als Lehrbeispiele

**Beleg.**
- `backend/src/config/llm.ts:89-97`: `categoryLines` listet alle Kategorien aus der Datenbank, ohne `type` (`predefined`/`custom`, `backend/src/db/schema.ts:172`) zu unterscheiden. Der Kategorisierungs-Prompt (`llm.ts:104-108`) überschreibt sie mit «ERLAUBTE KATEGORIEN (können auf Mieter umgelegt werden)» und «NICHT ERLAUBTE KATEGORIEN (dürfen NICHT auf Mieter umgelegt werden)».
- `backend/src/services/category.service.ts:175-191`: `updateCategory` erlaubt, die Umlagefähigkeit jeder Kategorie zu ändern, auch einer vordefinierten (keine Prüfung auf `type`).
- Glossar `UBIQUITOUS_LANGUAGE.md:76`: umlagefähig sind die vordefinierten «sowie eigene Kategorien, die als umlagefähig erfasst sind» – das ist eine Entscheidung des Vermieters, keine Rechtsaussage.
- Das E2E-Feature selbst zeigt das Problem: `categories.feature:8` legt «Treppenhausreinigung» als umlagefähig an, `categories.feature:16-17` «Dachsanierung» als nicht umlagefähig; ein Vermieter kann ebenso «Dachsanierung» als umlagefähig erfassen.
- Fedlex, OR (SR 220, Stand 1.10.2026), Art. 257a Abs. 1: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.» Art. 256b: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.» Ob eine Kostenart umlagefähig ist, folgt aus dem Gesetz, nicht aus früheren Einträgen des Vermieters.

**Warum falsch.** Für die Rechnungskategorisierung ist die Liste die Auswahl, unter der die KI wählen muss: dort ist sie richtig. Für die Prüfung einer *neuen* Kategorie dient sie als Vorbild. Hat der Vermieter einmal eine Kategorie falsch erfasst (z. B. «Fassadenunterhalt» umlagefähig, oder «Hauswart» auf nicht umlagefähig gestellt), zeigt der Prompt sie als «können auf Mieter umgelegt werden», und die KI schlägt für ähnliche Namen dasselbe vor, mit einem Artikel als Begründung. Weil Kategorien oft nach dem KI-Vorschlag gespeichert werden, verstärkt sich ein Fehler selbst. Für den Mieter heisst das: unzulässige Positionen (Unterhalt, Art. 256 Abs. 1 OR) erscheinen mit scheinbar rechtlicher Stütze in der Abrechnung.

**Behebung (eine der Varianten, Entscheid beim Product Owner, da #202 «die bestehenden Kategorien» festgelegt hat).**
1. Nur Kategorien mit `type = 'predefined'` als Beispiele zeigen, und nur in ihrem Auslieferungszustand (oder: eine vordefinierte Kategorie, deren Umlagefähigkeit geändert wurde, weglassen; dafür fehlt heute ein Merkmal).
2. Eigene Kategorien in einem eigenen Block unter einer ehrlichen Überschrift, z. B. «VOM VERMIETER ERFASSTE KATEGORIEN (nicht geprüft, nur zur Einordnung)», und im Prompt der Satz «Bei Widerspruch zur Rechtsgrundlage gilt die Rechtsgrundlage.»
Variante 1 ist die kleinere und deckt den Fall aus #202 voll ab (der Hauswart ist vordefiniert). Da #202 unter «Decided» die Liste aller bestehenden Kategorien nennt, braucht die Abweichung eine Bestätigung im Issue (Label `entscheiden`) oder einen Kommentar dort.

### V-1 (Major): Szenario prüft eine Kategorie, die es schon gibt

**Beleg.**
- `categories.feature:7-8` (Grundlage, gilt für jedes Szenario): «Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"».
- `categories.feature:68-73`: «Wenn der Liegenschaftsverwalter die KI prüfen lässt, ob die Kategorie "Treppenhausreinigung" umlagefähig ist … Und begründet die KI ihren Vorschlag mit "Hauswart"».
- `categories.feature:24-27`: «Name ist schon vergeben» – eine zweite «Treppenhausreinigung» wird abgewiesen.
- Technisch werden beide Namen mit einer UUID eindeutig gemacht (`tests/e2e/fixtures/backend.ts:14-18`), fachlich liest das Szenario aber «neue Kategorie mit einem schon vergebenen Namen». Mit dem geplanten Prompt steht die Grundlage-Kategorie «Treppenhausreinigung <uuid>» als umlagefähig im Block «ERLAUBTE KATEGORIEN». Ein echtes Modell urteilt dann nach der gleichnamigen eigenen Kategorie, nicht nach dem Hauswart; der Stand-in (`llm-stub.ts:46`) schaut nur auf die Hauswart-Zeile und verdeckt das.

**Warum falsch.** Das Szenario soll belegen, dass eine neue Kostenart nach den bestehenden vordefinierten Kategorien beurteilt wird (Done means in #202: «so «Treppenhausreinigung» is judged like «Hauswart»»). In der jetzigen Umgebung ist das Ergebnis schon durch die identische Kategorie vorgegeben, und für den Leser widerspricht es «Name ist schon vergeben». Zusammen mit M-1 belegt das Szenario damit genau das Verhalten, das fachlich heikel ist (Urteil nach einer eigenen Kategorie).

**Behebung.** Das Szenario in eine Funktionalität ohne diese Grundlage verschieben (z. B. ein eigenes Feature `categories-ki.feature` mit den KI-Szenarien) oder die Grundlage auf die Szenarien beschränken, die sie brauchen. Den Namen «Treppenhausreinigung» beibehalten (der gemeldete Fall). Optional einen Schritt ergänzen, der die Voraussetzung sichtbar macht: «Angenommen die vordefinierte Kategorie "Hauswart" ist umlagefähig».

### V-2 (Minor): Stand-in-Antwort für alle «…reinigung»

**Beleg.**
- `llm-stub.ts:44-46`: `match: /reinigung/i` mit Begründung «Reinigung wie beim Hauswart: laufende Betriebskosten (Art. 257b Abs. 1 OR).»
- `categories.feature:75-79` («Liegenschaftsverwalter übersteuert den Vorschlag der KI») und `categories.feature:19-22, 88-90` führen «Fassadenreinigung» als nicht umlagefähig. Nach der Prompt-Änderung zeigt dieses Szenario dem Nutzer «Reinigung wie beim Hauswart» für eine Fassade; vor der Änderung trifft es die zweite `/reinigung/`-Antwort (nicht umlagefähig), womit das «trotzdem» des Szenarios im roten Lauf nicht mehr stimmt.
- Mieterverband, Merkblatt «Zulässige und unzulässige Nebenkosten» 2026 (https://www.mieterverband.ch/upd_fm_media/2026_merkblatt_unzulaessige_nebenkosten.pdf), S. 2 zur Treppenhausreinigung: «Als Treppenhausreinigungskosten zulässig sind: − Reinigung des Treppenhauses / Unzulässige Kosten sind: − Weitere Tätigkeiten von Hauswartung oder Reinigungsfirma»; zum Flachdach-Serviceabo: «betreffen den werterhaltenden Unterhalt der Gebäudehülle». Fassadenreinigung ist Unterhalt der Gebäudehülle, nicht Reinigung «in und ums Haus» durch den Hauswart (Einordnung **unsicher**, Sekundärquelle, keine Fedlex-Stelle nennt die Fassade).

**Warum falsch.** Der Stand-in ist fachlich die Stimme der KI in den Szenarien und Bildschirmprüfungen; er soll keine Antwort zeigen, die ein Verwalter als falsch erkennt, und er soll die bestehenden Szenarien nicht verschieben.

**Behebung.** Beide neuen Einträge auf `/treppenhaus/i` einschränken. Dann bleiben «Fassadenreinigung»-Szenarien unverändert beim Standardeintrag.

### M-2 (Minor): Umlagefähig nur bei besonderer Vereinbarung

**Beleg.**
- Fedlex, OR Art. 257a Abs. 2: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- `llm.ts:104`: «ERLAUBTE KATEGORIEN (können auf Mieter umgelegt werden)»; `llm-stub.ts:49`: «Reinigung wie beim Hauswart: laufende Betriebskosten (Art. 257b Abs. 1 OR).»
- `docs/nebenkostenabrechnung-anforderungen.md:26` (Anforderung: nur im Mietvertrag vereinbarte Nebenkostenarten).

**Warum falsch.** Für einen unerfahrenen Vermieter klingt «umlagefähig» wie «darf immer verrechnet werden». Die Rechtsgrundlage im Prompt enthält Art. 257a Abs. 2 bereits; die Überschrift, die die KI zuerst als Vorbild sieht, aber nicht. Kein Fehler im Ergebnis (die Kategorie selbst ist richtig umlagefähig), daher Minor.

**Behebung.** Überschrift im Allocability-Prompt: «UMLAGEFÄHIGE KATEGORIEN (dürfen auf Mieter umgelegt werden, wenn im Mietvertrag vereinbart, Art. 257a Abs. 2 OR)». Die Stand-in-Begründung kann bleiben (kurz, und das Szenario prüft nur «Hauswart»); wer sie ergänzen will: «… (Art. 257b Abs. 1 OR), wenn im Mietvertrag vereinbart.» – dann in allen vier Sprachen.

### V-3 (Nit): Italienischer Gesetzesbegriff

**Beleg.** Fedlex, CO Art. 257b cpv. 1 (it): «… quali i costi di riscaldamento e di acqua calda e analoghe spese d'esercizio …». `llm-stub.ts:51`: «costi d'esercizio correnti (art. 257b cpv. 1 CO)». Französisch passt: CO Art. 257b al. 1 (fr) «… et autres frais d'exploitation …», Stand-in «frais d'exploitation courants».
**Behebung.** «spese d'esercizio correnti». Gleiches Muster steht schon im Standardeintrag (`llm-stub.ts:78`), dort bestehend.

## Bestätigt mit Quelle

- **Treppenhausreinigung umlagefähig (wenn vereinbart).** Fedlex OR Art. 257b Abs. 1: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Die Reinigung der gemeinsam genutzten Teile hängt mit dem Gebrauch zusammen (Art. 257a Abs. 1, oben zitiert). Das Gesetz nennt die Treppenhausreinigung nicht ausdrücklich; die Praxis (Mieterverband-Merkblatt 2026, S. 2, oben zitiert) führt sie als zulässige eigene Position. Die Begründung der fehlerhaften KI-Antwort aus #202 («nicht mit dem direkten Gebrauch … zusammenhängt») ist damit falsch.
- **Hauswart-Analogie.** Stammdaten `backend/migrations/0002_stammdaten.sql:21`: Hauswart umlagefähig, «Lohn für Reinigung, Bedienung der Heizung und kleine Instandhaltung; ohne Verwaltung, Wohnungsübergaben und Reparaturen». Merkblatt S. 1: «Zulässige Hauswartungskosten: − Bruttolohn … der Hauswartung für folgende Tätigkeiten: − Reinigungsarbeiten in und ums Haus». Die Analogie trägt für die Reinigung im Haus, nicht für Unterhalt der Gebäudehülle (V-2).
- **Art. 257b Abs. 1 OR als Begründung** im Stand-in: passt (Betriebskosten aus dem Gebrauch).
- **Wortlaut der Rechtsgrundlage im Prompt** (`llm.ts:47-52`): Art. 256 Abs. 1, 256b, 257a Abs. 1–2, 257b Abs. 1 OR (Fedlex, Stand 1.10.2026) und Art. 4 Abs. 3 VMWG (Fedlex, SR 221.213.11, Stand 1.10.2025: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.») stimmen wörtlich. VMWG Art. 4 Abs. 1–2 («Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» / «Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.») betreffen das Szenario nicht.
- **Glossar.** Szenario-Begriffe Liegenschaftsverwalter, Kategorie, umlagefähig / nicht umlagefähig, KI stehen in `UBIQUITOUS_LANGUAGE.md` (Abschnitte «Nebenkostenkategorien», «KI-Kategorisierung»); «Hauswart» ist die vordefinierte Kategorie (`UBIQUITOUS_LANGUAGE.md:76`). Kein fehlender Begriff.
- **Übersetzungen der Kategorie** in den Begründungen: «Concierge» (fr), «Portiere» (it), «Caretaker» (en) wie `name_fr/name_it/name_en` in `0002_stammdaten.sql:21`.
- **Stand-in-Bedingung** (`llm-stub.ts:46`): erkennt die Hauswart-Zeile nur im Block der umlagefähigen Kategorien; das bildet den Fehlerfall (Hauswart fehlt oder ist nicht umlagefähig) richtig ab.

## Fehlende Begriffe

Keine im Szenario. Für M-1 Variante 2 bräuchte der Prompt (kein UI-Text) keinen Glossarbegriff.

## Nicht bestätigt

- **Fassadenreinigung nicht umlagefähig:** keine Fedlex-Stelle; nur Analogie zum Merkblatt («werterhaltender Unterhalt der Gebäudehülle»). Gesucht: Fedlex OR/VMWG, Mieterverband-Merkblatt 2026 (Begriff «Fassade» kommt nicht vor). **unsicher**.
- **Doppelverrechnung Hauswart / Reinigungsfirma:** Das Merkblatt nennt für die Treppenhausreinigung «Unzulässige Kosten sind: − Weitere Tätigkeiten von Hauswartung oder Reinigungsfirma». Ob Dwello verhindern soll, dass dieselbe Reinigung über «Hauswart» und eine eigene «Treppenhausreinigung» zweimal abgerechnet wird, ist nicht Teil von #202 und nicht geprüft.
- **Verhalten des Standardmodells** (`qwen2.5:3b`) mit dem neuen Prompt: nicht gemessen (kein Modell im Worktree laufen lassen); #202 sieht dafür `bun run llm:eval` vor.
- **Ob vordefinierte Kategorien in Produktion geändert werden:** nur aus dem Code (`category.service.ts:175`) geschlossen, dass es möglich ist; keine Daten geprüft.
