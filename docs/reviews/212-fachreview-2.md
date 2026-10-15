# Fachreview #212, Runde 2: Delta und offene Befunde (zugleich Feature-Review)

Gegenstand: Worktree `review-212-fach2`, Commit af32a73, Bereich e445b1e..af32a73. Geprüft: `ALLOCABILITY_PROMPT` als Ganzes (`backend/src/config/llm.ts:138-168`, mit `LEGAL_BASIS` Z. 46-72), die Stub-Antworten (`backend/scripts/llm-stub.ts:34-56`), der neue Test (`backend/src/__tests__/category-allocability.pg.test.ts:81-97`) und das Szenario (`tests/e2e/features/categories.feature:62-66`). Rechtsgrundlage: Fedlex-Downloads im Scratchpad (`fedlex/or.html`, `or_fr.html`, `or_it.html`, `vmwg.html`).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-4 | Verwalter | Minor | Regel 1 nennt «Ersatz» und «Anschaffung» ohne Gegenstand. Ein kleines Modell kann damit auch den Einkauf von Brennstoff oder Verbrauchsmaterial und die «kleine Instandhaltung» des Hauswarts als «trägt immer der Vermieter» einstufen. Der Fehler steckt schon in meinem Wortlaut aus Runde 1 |
| M-7 | Mietrecht | Nit | Regel 1 stützt «Anschaffung und wertvermehrende Investitionen» nur auf Art. 256 Abs. 1 OR. Das ist der Rest von M-3, der auch in meinem eigenen Wortlaut aus Runde 1 steckt |
| V-5 | Verwalter | Nit | Das Szenario prüft «Art. 256». Das passt auch auf «Art. 256b», also auf die falsche Stütze für eine Dachsanierung |

Status der Befunde aus Runde 1: M-1, M-2, M-3, M-4, M-5, V-1, V-2 und M-6 sind behoben (Nachweis unter «Bestätigt»). V-3 ist mit Begründung abgelehnt. Die Ablehnung trage ich mit: Kopiert ein Modell `<true oder false>` wörtlich, liefert `parseAllocabilityResponse` `null`, und Dwello macht keinen Vorschlag. Das ist der sichere Ausgang. Kein Blocker und kein Major ist offen.

## Befunde

### V-4 (Minor): «Ersatz» und «Anschaffung» ohne Gegenstand

**Beleg:** `llm.ts:154`: «1. Reparatur, Ersatz, Erneuerung, Renovation, Anschaffung und wertvermehrende Investitionen trägt immer der Vermieter, auch wenn sie eine umlagefähige Kategorie betreffen …». Die Regel gilt «der Reihe nach» vor Regel 2. Damit schlägt sie auch die vordefinierte Einstufung.

**Warum falsch:**
- Die Brennstoffe sind umlagefähig. Art. 5 Abs. 2 VMWG: «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden». Eine neue Kategorie wie «Heizöleinkauf» oder «Anschaffung Pellets» ist dem Wort nach eine «Anschaffung» für die Heizung. Regel 1 gibt dem kleinen Modell für genau diesen Fall «immer der Vermieter» vor. Der Eval-Fall «Heizöl» (`backend/scripts/llm-eval.ts:14`) erwartet `true`.
- Der Hauswart umfasst laut vordefinierter Beschreibung auch «kleine Instandhaltung» (`backend/migrations/0002_stammdaten.sql:21`). Eine Kategorie wie «Ersatz von Leuchtmitteln im Treppenhaus» fällt nach Regel 1 ohne Ausnahme an den Vermieter. Ob solches Kleinmaterial umlagefähig ist, habe ich nicht belegt (siehe «Nicht bestätigt»). Regel 1 nimmt dem Modell diese Abwägung aber ganz ab.
- In der Praxis heisst die Grenze «Ersatz von Anlagen». Ein Ratgeber schreibt: «Instandhaltung, Reparaturen und Ersatz von Anlagen sind Sache des Eigentümers» (mietzinssenker.ch, gesehen nur als Suchtreffer). Art. 6 lit. a VMWG nennt für die Heizung ebenfalls «die Reparatur und Erneuerung der Anlagen».

**Lösung:** Den Gegenstand nennen und die Brennstoffe ausnehmen, etwa so: «1. Reparatur, Renovation, Erneuerung, Ersatz und Anschaffung von Anlagen, Geräten und Bauteilen sowie wertvermehrende Investitionen trägt immer der Vermieter, … Brennstoffe und Energie, die verbraucht werden, sind keine Anschaffung (Art. 5 Abs. 2 lit. a VMWG).» Der Test in `category-allocability.pg.test.ts:88-90` prüft den Wortlaut von Regel 1 wörtlich und muss mitgeändert werden. Prüfen soll das danach `llm:eval` mit qwen2.5:3b, mit den Fällen «Heizöl», «Ersatz der Waschmaschine», «Anschaffung Rasenmäher» und «Ersatzteile Lift».

### M-7 (Nit): Stütze für Anschaffung und Wertvermehrung

**Beleg:** `llm.ts:154` schreibt «(Art. 256 Abs. 1 OR; für Heizung und Warmwasser Art. 6 VMWG)» für die ganze Aufzählung. Art. 256 Abs. 1 OR regelt nur «übergeben und in demselben zu erhalten». In Runde 1 (M-3) hatte ich vorgeschlagen, alles, was über den Erhalt hinausgeht, auf Art. 257b Abs. 1 OR zu stützen. Mein eigener Wortlaut hat das dann aber nicht umgesetzt.

**Folge:** Das Ergebnis ist richtig (nicht umlagefähig). Für «Anschaffung Rasenmäher» zitiert das Modell aber womöglich eine schwache Stütze.

**Lösung (optional):** Zur Aufzählung «(Erhalt: Art. 256 Abs. 1 OR; der Rest ist keine Leistung, die mit dem Gebrauch zusammenhängt: Art. 257b Abs. 1 OR; …)» ergänzen. Das lässt sich mit V-4 zusammen erledigen.

### V-5 (Nit): Szenario-Erwartung «Art. 256»

**Beleg:** `categories.feature:66`: «Und begründet die KI ihren Vorschlag mit "Art. 256"». Die Prüfung sucht einen Teilstring. Sie wäre also auch mit «Art. 256b OR» grün. Das ist die Stütze für Lasten und Abgaben, nicht für den Erhalt.

**Lösung:** «Art. 256 Abs. 1» prüfen. Der Stub liefert diesen Text schon (`llm-stub.ts:36`).

## Bestätigt

**Regel 1 (ohne V-4/M-7):**
- Den Vorrang von Reparatur und Erneuerung vor der Einstufung der Kategorie trägt Art. 256 Abs. 1 OR: «Der Vermieter ist verpflichtet, die Sache … in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.»
- Für Heizung und Warmwasser gilt Art. 6 VMWG: «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.»
- Liegenschaftssteuer nach Art. 256b OR: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.» Die Liegenschaftssteuer ist eine öffentliche Abgabe, die an die Liegenschaft anknüpft. Glossar und Stammdaten führen sie als nicht umlagefähig (`0002_stammdaten.sql:30`). Dass «Gebäudeversicherung» weggelassen wurde, ist richtig. Sie bleibt über die vordefinierte Liste nicht umlagefähig.
- M-1 ist damit behoben.

**Regel 2:**
- «Leistung derselben Art» und der Verweis auf «ohne» passen zu den Beschreibungen in `0002_stammdaten.sql`. Beim Lift heisst es: «ohne Reparaturen, Ersatzteile und Serviceabos mit Reparaturen». Beim Hauswart: «ohne Verwaltung, Wohnungsübergaben und Reparaturen».
- Das Beispiel und das Gegenbeispiel zur Waschküche sind in der Sache richtig (Art. 257b Abs. 1 OR, «ähnliche Betriebskosten»).
- Wartung von Brandschutzeinrichtungen und Bekämpfung von Ungeziefer folgen den vordefinierten Kategorien in `0002_stammdaten.sql:36-37`.
- V-1, V-2 und M-4 sind behoben: «Pflege» ist weg, und der Satz lautet «Die vordefinierten Kategorien sind nicht vollständig».

**Regel 3:** Die Sachüberschriften von Art. 5 und 6 VMWG beschränken beide Artikel auf Heizungs- und Warmwasserkosten. Die Regel stimmt.

**Regel 4:**
- Wortlaut Art. 257b Abs. 1 OR: «… für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Wortlaut Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- Die Abgrenzung zu den Abgaben, die vom Wert der Liegenschaft abhängen (Art. 256b OR), entspricht den Beschreibungen von Kaltwasser und Abwasser (`0002_stammdaten.sql:17-18`).
- M-2 und M-5 sind behoben.

**JSON-Beispiel:** Das Beispiel enthält keine Antwortwerte und keinen vorgegebenen Artikel mehr. Damit fällt die Vorlage weg, die das Modell zur Ablehnung mit Art. 257a Abs. 1 OR gebracht hat. Gegen `LEGAL_BASIS` geprüft: Alle Artikel, die in den Regeln vorkommen (Art. 256 Abs. 1, 256b, 257a Abs. 2 und 257b Abs. 1 OR sowie Art. 5, 6 und Abs. 2 lit. a VMWG), stehen dort wörtlich. Das Modell kann also aus der Rechtsgrundlage zitieren, wie Z. 72 es verlangt.

**Stub (M-6):**
- DE: «Erhalt und Erneuerung des Gebäudes trägt der Vermieter (Art. 256 Abs. 1 OR).» Das stimmt in der Sache und im Zitat.
- FR: «L’entretien … sont à la charge du bailleur (art. 256, al. 1, CO)». Fedlex FR, Art. 256 Abs. 1: «Le bailleur est tenu de délivrer la chose … et de l’entretenir en cet état.» «Entretien» ist hier richtig, weil es um den Unterhalt nach Art. 256 OR geht. `i18n-begriffe.md:42` verbietet «entretien» nur für die Wartung. «Bailleur» entspricht `i18n-begriffe.md:23`.
- IT: «… a carico del locatore (art. 256 cpv. 1 CO)». Fedlex IT: «Il locatore deve consegnare la cosa … e mantenerla tale per la durata della locazione.» «Mantenimento» und «locatore» stimmen.
- EN: «… borne by the landlord (Art. 256 para. 1 CO)». «Landlord» entspricht dem Glossar.
- Die Zitierform entspricht der in `messages/{fr,it,en}.json` («art. 257a, al. 2, CO», «art. 257a cpv. 2 CO», «Art. 257a para. 2 CO»).
- Die Bedingung `when` des Stubs prüft den neuen Satz aus V-1.
- Die zweite Treppenhaus-Antwort mit Art. 257a Abs. 1 OR bildet absichtlich die falsche Antwort des kleinen Modells nach. Sie ist richtig so.

**Fachbegriffe:** Vermieter, Mieter, Mietvertrag, Kategorie, umlagefähig, Liegenschaftssteuer, Hauswart, Feuerlöscher-Wartung und Schädlingsbekämpfung stehen im Glossar (`UBIQUITOUS_LANGUAGE.md`, Prüfung in Runde 1). Im Delta ist kein neuer Fachbegriff dazugekommen. «Vordefinierte Kategorie» steht nur im Prompt, siehe Runde 1. Ein Issue ist nicht nötig.

## Nicht bestätigt

- Ob Kleinmaterial wie Leuchtmittel in Allgemeinräumen umlagefähig ist (V-4): Fedlex regelt das nicht. Ich habe nur Suchtreffer gesehen (mietzinssenker.ch «Ersatz von Anlagen», Merkblatt des Mieterverbands 2026), keinen davon geöffnet. **unsicher**. V-4 stützt sich deshalb vor allem auf das Beispiel Brennstoffe (Art. 5 Abs. 2 lit. a VMWG, Wortlaut belegt).
- Wie qwen2.5:3b auf die Regeln reagiert: nicht gemessen, weil kein Modell verfügbar war. `llm:eval` steht im Plan beim Product Owner.
- Gebäudeversicherung als Last nach Art. 256b OR: weiterhin **unsicher** (siehe Runde 1). Sie steht nicht mehr im Prompt-Text.
- Schädlingsbekämpfung und Feuerlöscher-Wartung als nicht umlagefähig: weiterhin nur nach Glossar und Stammdaten, Fedlex regelt das nicht ausdrücklich (siehe Runde 1). Diese Einstufung bestand schon vorher.
