# Fachreview #176, Runde 1 (Szenarien und Stammdaten, vor der Umsetzung)

Geprüfter Stand: Commit `4556b71` (Worktree `review-176-fach`), Datum 2026-10-14.
Gegenstand: `tests/e2e/features/categories.feature:57-76` (@wip), `backend/scripts/llm-stub.ts`, Seed `backend/migrations/0002_stammdaten.sql:14-38`, Tabelle und Entscheide in Issue #176.
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, Fedlex (OR SR 220 Stand 1.10.2026, VMWG SR 221.213.11 Stand 1.10.2025, PDF und HTML wortgleich abgeglichen), Merkblatt Mieterverband «Zulässige und unzulässige Nebenkosten» (`review-176-fach-merkblatt.txt`).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| F-1 | Verwalter | Major | Glossar `UBIQUITOUS_LANGUAGE.md:76` führt Schädlingsbekämpfung und Feuerlöscher-Wartung weiter als umlagefähig; der Seed-Entscheid widerspricht dem Glossar, bis der Product Owner es anpasst |
| F-2 | Mietrecht | Minor | Glossar `UBIQUITOUS_LANGUAGE.md:181` schreibt Art. 257b OR einen Satz zu, der nicht im Gesetz steht; darf nicht in Prompt oder Begründung gelangen (vorbestehend) |
| F-3 | Mietrecht | Minor | Prompt-Grundlage «Art. 4–6 VMWG» allein: Art. 6 gilt nur für Heizung/Warmwasser; Art. 6a–6c (Fernwärme, ZEV, Energiespar-Contracting) und Art. 256/256b OR fehlen, die KI kann dadurch falsch einstufen |
| F-4 | Verwalter | Minor | Szenario «übersteuert» speichert «Dachsanierung» als umlagefähig: zeigt einen rechtswidrigen Ausgang als Normalfall |
| F-5 | Mietrecht | Minor | «Umlagefähig» heisst nicht «geschuldet»: Art. 257a Abs. 2 OR (besondere Vereinbarung) fehlt in Begründung/Hilfetext der neuen Wahl |
| F-6 | Verwalter | Minor | Kein Szenario/Test für «KI gefragt, keine Antwort (Fehler, Konfidenz < 0.7) → nichts vorgewählt»; Szenario 3 fragt die KI gar nicht |
| F-7 | Verwalter | Nit | Begriffe «Umlagefähigkeit» (Szenariotitel Z. 73) und «Vorschlag der KI» (Steps, Target) fehlen im Glossar |
| F-8 | Mietrecht | Nit | Zitate ohne Absatz («Art. 257a OR», «Art. 257b OR»); genauer «Art. 257a Abs. 1 OR», «Art. 257b Abs. 1 OR» |
| F-9 | Verwalter | Minor | Beschreibung Abwasser «Abwasser und Kanalisation» deckt laut Merkblatt Unzulässiges/Umstrittenes ab (Meteorabwasser, wertabhängige Grundgebühren, Kanalreinigung); vom Issue nicht entschieden |
| F-10 | Verwalter | Nit | Die zwei umgestellten Zeilen stehen im SQL weiter im Block «Allowed utility costs» (sort_order 12/13) ohne Hinweis «trägt der Vermieter» |
| F-11 | Mietrecht | Nit | Bestehender Hilfetext `messages/de.json:1087` «Versicherungen … sind nicht umlagefähig» ist zu absolut (Art. 5 Abs. 2 lit. h VMWG) |

## Befunde

### F-1 (Major, Verwalter): Glossar widerspricht dem Seed-Entscheid

- Beleg: `UBIQUITOUS_LANGUAGE.md:76` «Umlagefähig: … Kaminfeger, Schädlingsbekämpfung, Feuerlöscher-Wartung, …». Issue #176, «Decided» Punkt 4 und «Glossary and docs»: beide werden nicht umlagefähig; «The product owner updates them».
- Warum falsch: Das Glossar ist die einzige zulässige Quelle der Fachbegriffe und Zuordnungen. Wird der Seed umgestellt, ohne dass das Glossar folgt, widersprechen sich Glossar und App (und der geplante Test «seed and expected legal table agree»).
- Behebung: Der Product Owner verschiebt die beiden Kategorien in `UBIQUITOUS_LANGUAGE.md` von Z. 76 nach Z. 80 («Nicht umlagefähig»), bevor der Slice 1 gemergt wird. Bis dahin unter «Blocked on me» führen. Der Agent ändert das Glossar nicht.

### F-2 (Minor, Mietrecht, vorbestehend): Glossar-Zusammenfassung von Art. 257b OR ist kein Gesetzestext

- Beleg: `UBIQUITOUS_LANGUAGE.md:181` «Art. 257b OR | Nebenkosten sind die tatsächlichen Aufwendungen des Vermieters; Kosten für Reparaturen, Erneuerungen und Steuern gehören nicht dazu.» Fedlex Art. 257b OR enthält keinen Ausschluss von Reparaturen, Erneuerungen oder Steuern (Wortlaut unten). Reparatur und Erneuerung schliesst wörtlich nur Art. 6 lit. a VMWG aus (nur Heizungs- und Warmwasseranlagen); Steuern folgen aus Art. 256b OR («Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.») im Umkehrschluss zu Art. 257b Abs. 1 OR («öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»).
- Warum falsch: Übernimmt der Prompt oder die KI-Begründung diese Zusammenfassung, zitiert Dwello dem Liegenschaftsverwalter einen Gesetzesinhalt, den es nicht gibt.
- Behebung: Prompt und Begründungen nur mit dem Fedlex-Wortlaut (Abschnitt «Gesetzestexte»). Glossarzeile durch den Product Owner korrigieren, Vorschlag: «Art. 257b OR | Bei Wohn- und Geschäftsräumen sind Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen aus dem Gebrauch (z. B. Heizung, Warmwasser, ähnliche Betriebskosten) und für öffentliche Abgaben aus dem Gebrauch; der Mieter darf die Belege einsehen.» Issue (Labels `fachlich`, `entscheiden`).

### F-3 (Minor, Mietrecht): Rechtsgrundlage im Prompt unvollständig

- Beleg: Anforderung «Art. 257a and 257b OR and Art. 4–6 VMWG, quoted verbatim». Art. 6 VMWG lautet «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar …» (gilt nur für diese Anlagen). Art. 6a VMWG: «Bezieht der Vermieter Heizenergie oder Warmwasser aus einer nicht zur Liegenschaft gehörenden Zentrale, die nicht Teil der Anlagekosten ist, kann er die tatsächlich anfallenden Kosten in Rechnung stellen.» Art. 6c Abs. 3 VMWG: «Der Vermieter kann die im Rahmen eines Energiespar-Contractings anfallenden Kosten während höchstens 10 Jahren als Nebenkosten in Rechnung stellen.» Art. 6b VMWG (ZEV) ebenso. Merkblatt S. 1: Fernwärme-Contracting und ZEV inkl. Amortisation zulässig.
- Warum falsch: Mit Art. 6 lit. b («Verzinsung und Abschreibung») im Prompt, aber ohne Art. 6a–6c, stuft die KI eine neue Kategorie «Fernwärme» oder «ZEV-Strom» mit Amortisationsanteil eher als nicht umlagefähig ein. Umgekehrt fehlt für Nicht-Heizkosten (Lift, Dach, Fassade) die eigentliche Grundlage des Reparaturausschlusses: Art. 256 Abs. 1 OR («Der Vermieter ist verpflichtet, die Sache … in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.») und für Steuern/Gebäudeversicherung Art. 256b OR. Die KI könnte Art. 6 VMWG auf alle Kategorien ausdehnen und falsch zitieren.
- Behebung: Entscheid des Product Owners (Issue `fachlich`, `entscheiden`): Prompt um Art. 256 Abs. 1, Art. 256b OR und Art. 6a–6c VMWG ergänzen oder mindestens die Anweisung aufnehmen «Art. 5 und 6 VMWG gelten nur für Heizungs- und Warmwasserkosten; für andere Kosten begründen Sie mit Art. 257a Abs. 1 oder Art. 257b Abs. 1 OR.» Ins Auswertungsskript (Slice 4) Fernwärme und ZEV als umlagefähige Testfälle aufnehmen.

### F-4 (Minor, Verwalter): Übersteuerungs-Szenario zeigt einen rechtswidrigen Ausgang

- Beleg: `categories.feature:65-70`: KI schlägt für «Dachsanierung» «nicht umlagefähig» vor, der Liegenschaftsverwalter speichert «trotzdem als umlagefähig», erwartet «ist die Kategorie "Dachsanierung" umlagefähig». Eine Dachsanierung ist Erhalt der Sache (Art. 256 Abs. 1 OR) und nicht «mit dem Gebrauch der Sache» verbunden (Art. 257a Abs. 1 OR); Merkblatt S. 1: «Reparaturen und Unterhaltskosten gehören nicht in die Nebenkosten … Das gilt selbst wenn diese Kosten im Mietvertrag aufgeführt sind.»
- Warum falsch: Die Szenarien sind auch Dokumentation. Das einzige Übersteuerungs-Beispiel führt vor, wie eine eindeutig unzulässige Kategorie umlagefähig wird. Fachlich sinnvoll ist das Übersteuern gerade dort, wo die KI irrt.
- Behebung: Richtung umkehren, mit dem bestehenden Stub ohne Änderung: «Und die KI hat geprüft, ob die Kategorie "Fassadenreinigung" umlagefähig ist» (Stub: umlagefähig), «Wenn der Liegenschaftsverwalter die Kategorie trotzdem als nicht umlagefähig speichert», «Und ist die Kategorie "Fassadenreinigung" nicht umlagefähig». Das passt zu `categories.feature:20-22`, wo Fassadenreinigung bereits nicht umlagefähig ist. Alternativ ein umstrittener Fall (z. B. «Bewachung») statt Dachsanierung.

### F-5 (Minor, Mietrecht): Umlagefähig nur bei besonderer Vereinbarung

- Beleg: Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Glossar Z. 183: «Umlagefähige Nebenkosten | … (abschliessende Liste im Mietvertrag)». Stub-Begründung «Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b OR).» und der Fall Schneeräumung (#91) zeigen, dass die Einstufung allein nicht reicht.
- Warum: Ein unerfahrener Liegenschaftsverwalter liest «Umlagefähig» nach einer KI-Bestätigung leicht als «der Mieter schuldet es». Das ist irreführend, wenn die Kostenart im Mietvertrag nicht aufgeführt ist.
- Behebung: Hilfetext an der Wahl «Umlagefähig / Nicht umlagefähig» ergänzen: «Umlagefähige Kosten darf der Mieter nur bezahlen, wenn der Mietvertrag sie als Nebenkosten nennt (Art. 257a Abs. 2 OR).» Kein Szenario nötig; DOM-Test für den Text.

### F-6 (Minor, Verwalter): Fall «keine KI-Antwort» ohne Nachweis

- Beleg: Entscheid Punkt 2 («No KI answer means no preset … confidence below 0.7»); Issue «Done means»: Szenario «Ohne KI muss der Liegenschaftsverwalter selbst wählen». `categories.feature:72-76` klickt nie «Von der KI prüfen lassen» (`tasks/categories.ts`, `saveWithoutChoice`).
- Warum: Die Kernregel «Eine Kategorie ist nie umlagefähig, nur weil niemand hingeschaut hat» ist für den Fall «KI gefragt, aber ohne Antwort» nicht belegt; eine Umsetzung, die bei Fehler «Umlagefähig» vorwählt, bliebe grün.
- Behebung: Entweder ein Szenario, in dem die KI geprüft hat und keine Antwort kam (BFF-Aktion `propose` an der Browsergrenze mit Fehlerstatus), Ergebnis «keine Wahl vorgewählt» plus Hinweis; oder, weil der KI-Aufruf serverseitig ist, ein Test der unteren Schicht (`category-allocability.pg.test.ts`: Timeout und Konfidenz 0.69 ergeben keinen Vorschlag; Grenzwert 0.7 ergibt einen) und im Plan `No scenario: server-side failure`.

### F-7 (Nit, Verwalter): Fehlende Begriffe

- Beleg: `categories.feature:73` «Umlagefähigkeit»; Steps und Target «Vorschlag der KI», Button «Von der KI prüfen lassen». Das Glossar kennt «KI-Kategorie», «Konfidenz», «Kategorisierung» nur für Rechnungen und «Umlagefähig» nur als Adjektiv.
- Behebung: Szenariotitel ohne neues Substantiv: «Neue Kategorie speichern, ohne umlagefähig oder nicht zu wählen». Für den Rest Glossarvorschläge (unten) und Issue (`fachlich`, `entscheiden`); in Code bis dahin `TODO(fachlich prüfen, #<issue>)`.

### F-8 (Nit, Mietrecht): Zitiergenauigkeit im Stub

- Beleg: `llm-stub.ts:14-27`. Inhaltlich sind beide Zitate richtig (siehe Bestätigungen); genauer sind Absätze: «nicht mit dem Gebrauch zusammen (Art. 257a Abs. 1 OR)», «Betriebskosten aus dem Gebrauch (Art. 257b Abs. 1 OR)».
- Behebung: Stub mit Absatz; Szenario Z. 62 prüft dann «Art. 257a» (Teilstring bleibt stabil). Die echte KI sollte im Prompt angewiesen werden, mit Absatz zu zitieren.

### F-9 (Minor, Verwalter): Beschreibung Abwasser zu weit

- Beleg: Seed Z. 18 «Abwasser und Kanalisation». Merkblatt S. 2: zulässig «Verbrauchsgebühr für Abwasser»; umstritten «Kanalreinigungen, periodische Reinigung der Fallstränge, Grundgebühren»; unzulässig «Gebühr für Regenwasser (= Meteorabwasser)» und wertabhängige Grundgebühren. Ebenso Kaltwasser Z. 17 (wertabhängige Grundgebühren unzulässig). Issue-Tabelle: «OK … Help text», Anforderung: «All other seeded categories stay as they are».
- Warum: Die Einstufung «umlagefähig» bleibt richtig (Art. 257b Abs. 1 OR: «öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»), aber «Kanalisation» lädt ein, Kanalanschluss- oder Regenwassergebühren einzuordnen. Fedlex widerspricht dem Seed nicht; das Merkblatt widerspricht nur der Beschreibung.
- Behebung (nach Entscheid, Issue `fachlich`, `entscheiden`): «Verbrauchsgebühr für Abwasser (ohne Regenwassergebühr und wertabhängige Grundgebühren)»; Kaltwasser: «Wasser nach Verbrauch (ohne wertabhängige Grundgebühren)».

### F-10 (Nit, Verwalter): Lage und Beschreibung der umgestellten Zeilen

- Beleg: `0002_stammdaten.sql:12-13` Kommentar «Allowed utility costs», Zeilen 25-26 mit sort_order 12/13 zwischen umlagefähigen Kategorien; Reparaturen hat den Zusatz «(trägt der Vermieter)», die beiden nicht.
- Behebung: Zeilen in den Block «Not allowed» verschieben oder den Kommentar anpassen; Beschreibungen «Schädlingsbekämpfung (trägt der Vermieter)» und «Wartung der Feuerlöscher und Brandschutzeinrichtungen (trägt der Vermieter)». sort_order nur ändern, wenn die Listenreihenfolge in der App folgen soll.

### F-11 (Nit, Mietrecht, vorbestehend): Hilfetext zu Versicherungen

- Beleg: `messages/de.json:1087` «… Reparaturen, Versicherungen und Steuern sind nicht umlagefähig.» Art. 5 Abs. 2 lit. h VMWG: «die Versicherungsprämien, soweit sie sich ausschliesslich auf die Heizungsanlage beziehen». Merkblatt S. 5: zulässig Versicherung der Heizungsanlage.
- Behebung (im ohnehin geplanten Hilfetext-Update): «… Reparaturen, Gebäudeversicherung und Steuern sind nicht umlagefähig.»

## Bestätigungen

### Szenarien (Frage 1)

- Wortlaut und Begriffe: «Liegenschaftsverwalter», «Kategorie», «umlagefähig / nicht umlagefähig», «KI» entsprechen dem Glossar (Z. 63, 71, 74-80, 86-92). Fehlermeldung «Wählen Sie, ob die Kosten umlagefähig sind.»: Sie-Form, Verb, sagt, was zu tun ist; bestätigt.
- Stub «Dachsanierung» → nicht umlagefähig, «Erhalt und Erneuerung des Gebäudes hängen nicht mit dem Gebrauch zusammen (Art. 257a OR)»: Artikel trägt die Aussage. Art. 257a Abs. 1 OR definiert Nebenkosten als «Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen»; was nicht mit dem Gebrauch zusammenhängt, ist keine Nebenkost. Die Erhaltungspflicht selbst steht in Art. 256 Abs. 1 OR (siehe F-3, F-8). Art. 6 VMWG wäre falsch zitiert (gilt nur für Heizungs-/Warmwasseranlagen); der Stub vermeidet das zu Recht.
- Stub sonst → umlagefähig, «Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b OR)»: bestätigt; Art. 257b Abs. 1 OR nennt «Heizungs-, Warmwasser- und ähnliche Betriebskosten» für Wohn- und Geschäftsräume. Nur als Stub-Antwort korrekt: für «Fassadenreinigung» wäre sie fachlich falsch (Unterhalt), was F-4 gerade nutzbar macht.
- Entscheid «KI schlägt vor, Liegenschaftsverwalter entscheidet» und «ohne Antwort keine Vorwahl»: mit OR/VMWG vereinbar; das Gesetz verlangt keine Begründungspflicht beim Übersteuern einer Kategorie.

### Seed-Tabelle (Frage 2), Zeilen 14-38

| Kategorie | Seed | Entscheid | Ergebnis | Quelle |
|---|---|---|---|---|
| Heizung | ja / Heizkosten ja | ja | bestätigt | Art. 257b Abs. 1 OR («Heizungs-»); Art. 5 Abs. 1, Abs. 2 lit. a–i VMWG; Ausschluss Reparatur/Erneuerung/Abschreibung Art. 6 VMWG (Rechnungsebene, #74) |
| Warmwasser | ja / nein | ja | bestätigt | Art. 5 Abs. 1 VMWG «zentralen Warmwasseraufbereitungsanlage», lit. e «Entkalken der Warmwasseranlage, der Boiler»; Merkblatt S. 1 |
| Kaltwasser | ja | ja | bestätigt (Beschreibung F-9) | Art. 257b Abs. 1 OR «öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»; Merkblatt S. 1-2 |
| Abwasser | ja | ja | bestätigt für Verbrauchsgebühr (Beschreibung F-9) | wie Kaltwasser; Merkblatt S. 2 |
| Allgemeinstrom | ja | ja | bestätigt | Art. 257b Abs. 1 OR «ähnliche Betriebskosten»; Merkblatt S. 3 |
| Lift | ja | ja, ohne Reparaturen/Ersatzteile/Serviceabos mit Reparaturen | bestätigt mit Vorbehalt (siehe «Nicht bestätigt») | Merkblatt S. 3: zulässig «Strom», «Gemäss weitverbreiteter Praxis: Serviceabos für reine Wartung und Reinigung», «Lifttelefonanschlussgebühr»; unzulässig «Reparaturen, Ersatzteile, Erneuerungen», «Serviceabos für Reparaturen», «Amortisation» |
| Hauswart | ja | ja, ohne Verwaltung, Übergaben, Reparaturen | bestätigt | Art. 257a Abs. 1 OR (Gebrauch); Merkblatt S. 2 |
| Gartenpflege | ja | ja | bestätigt | Merkblatt S. 3-4 (Rückschnitt, Rasenmähen, Laub; nicht Werkzeuge, Neubepflanzung, Schädlingsbekämpfung) |
| Schneeräumung | ja | ja, im Mietvertrag zu nennen (#91) | bestätigt | Art. 257a Abs. 2 OR; Merkblatt S. 4 «Schneeräumung muss gesondert erwähnt werden im Mietvertrag» |
| Kehricht | ja | ja | bestätigt | Art. 257b Abs. 1 OR (öffentliche Abgaben aus dem Gebrauch); Merkblatt S. 2 (verbrauchsabhängige Grundgebühr) |
| TV/Kabelanschluss | ja | ja | bestätigt | Merkblatt S. 3 «Grundnutzungsgebühren … Kabelnetzbetreibern» |
| Schädlingsbekämpfung | ja → nein | nein | Entscheid vertretbar, nicht widerlegt | Fedlex nennt sie nicht. Merkblatt S. 4 führt sie unter «Unzulässige Gartenpflegekosten». Die Begründung im Issue («preservation of the building») stützt sich auf Art. 256 Abs. 1 OR, nicht auf das Merkblatt (siehe «Nicht bestätigt») |
| Feuerlöscher-Wartung | ja → nein | nein | bestätigt | Merkblatt S. 4-5: Serviceabos für «Feuerlöschgeräte und Brandmeldeanlagen» umstritten; Brandschutz, der auch bei leerem Gebäude nötig ist, «dürften … nicht nebenkostenfähig sein». Art. 257a Abs. 1 OR (Gebrauch). Keine Fedlex-Norm dafür |
| Kaminfeger | ja / Heizkosten ja | ja | bestätigt | Art. 5 Abs. 2 lit. d VMWG «die Reinigung der Heizungsanlage und des Kamins» |
| Reparaturen | nein | nein | bestätigt | Art. 256 Abs. 1 OR; Art. 6 lit. a VMWG (Heizung); Merkblatt S. 1 |
| Renovation | nein | nein | bestätigt | wie Reparaturen |
| Wertvermehrende Investitionen | nein | nein | bestätigt | Art. 269a lit. b OR («Mehrleistungen des Vermieters» wirken über den Mietzins, nicht die Nebenkosten); Art. 6 lit. b VMWG |
| Gebäudeversicherung | nein | nein | bestätigt | Art. 256b OR «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»; Art. 5 Abs. 2 lit. h VMWG nur Heizungsanlage; Merkblatt S. 5 |
| Liegenschaftssteuer | nein | nein | bestätigt | Art. 256b OR; Art. 257b Abs. 1 OR nur Abgaben «aus dem Gebrauch»; Merkblatt S. 5 «Weitere Steuern gehören nicht in die Nebenkostenabrechnung» |
| Hypothekarzinsen | nein | nein | bestätigt | Art. 6 lit. b VMWG (Verzinsung, Heizung); Kapitalkosten sind Mietzinsfaktor (Art. 269a OR) |
| Verwaltung | nein | nein, Verwaltungspauschale (#60, #89) | bestätigt | Art. 4 Abs. 3 VMWG, Art. 5 Abs. 2 lit. i und Abs. 3 VMWG; Merkblatt S. 4 |

Kein Seed-Eintrag, bei dem Fedlex oder das Merkblatt der Einstufung widerspricht und das Issue nicht entschieden hat. Abweichungen betreffen nur Beschreibungen (F-9). Demo-Daten: keine Rechnung in Schädlingsbekämpfung oder Feuerlöscher-Wartung (`grep` in `backend/demo`, nur `invoice-completeness.test.ts:177` und `llm.ts:60-61`); die «Stop and ask»-Bedingung zu Demo-Abrechnungen greift nicht.

### Beschreibungen Lift und Hauswart (Frage 3)

- Lift: «Strom, Notruftelefon und reine Wartung des Lifts; ohne Reparaturen, Ersatzteile und Serviceabos mit Reparaturen»
- Hauswart: «Lohn für Reinigung, Bedienung der Heizung und kleine Instandhaltung; ohne Verwaltung, Wohnungsübergaben und Reparaturen»

Grundlage Merkblatt S. 2-3 (Wortlaute oben). «Notruftelefon» für «Lifttelefonanschlussgebühr» ist Alltagssprache; wer es weglassen will: «Strom und reine Wartung des Lifts; ohne …».

## Fehlende Begriffe (Vorschläge für ein Issue, Labels `fachlich`, `entscheiden`)

| Begriff | Vorschlag Definition | Code |
|---|---|---|
| **Vorschlag der KI (Kategorie)** | Einstufung einer neuen Kategorie als umlagefähig oder nicht umlagefähig durch die KI, mit Begründung und Artikel. Nur beim Erfassen; ab Konfidenz 0.7; der Liegenschaftsverwalter entscheidet. | `POST /categories/propose` |
| **Umlagefähigkeit** | Ob die Kosten einer Kategorie in die Nebenkostenabrechnung fliessen dürfen (Art. 257a–257b OR, Art. 4–6 VMWG). Beim Erfassen Pflichtwahl, ohne Vorgabe. | `is_allowed_utility_cost` |

## Gesetzestexte (Fedlex, wörtlich)

Abgerufen am 2026-10-14. Wortlaut aus der Fedlex-HTML-Fassung, gegen die PDF/A-Fassung derselben Version abgeglichen (wortgleich; Silbentrennungen der PDF aufgelöst, Fussnotenzeichen weggelassen). Absatznummern sind im Original hochgestellt; hier als «1», «2» vor dem Absatz.

### Obligationenrecht (OR), SR 220, Stand am 1. Oktober 2026

URL: https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de (Version https://fedlex.data.admin.ch/eli/cc/27/317_321_377/20261001; PDF: https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20261001/de/pdf-a/fedlex-data-admin-ch-eli-cc-27-317_321_377-20261001-de-pdf-a.pdf). Die bereits publizierte künftige Fassung Stand 1. Juli 2027 enthält Art. 257a und 257b wortgleich.

Art. 257a (Randtitel: 2. Nebenkosten / a. Im Allgemeinen)
1 Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.
2 Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.

Art. 257b (Randtitel: b. Wohn- und Geschäftsräume)
1 Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.
2 Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.

Ergänzend zitiert (für F-3):
Art. 256 Abs. 1: «Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.»
Art. 256b: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»

### Verordnung über die Miete und Pacht von Wohn- und Geschäftsräumen (VMWG), SR 221.213.11, Stand am 1. Oktober 2025

URL: https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de (Version https://fedlex.data.admin.ch/eli/cc/1990/835_835_835/20251001, laut Fedlex-SPARQL die neueste; PDF: https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1990/835_835_835/20251001/de/pdf-a/fedlex-data-admin-ch-eli-cc-1990-835_835_835-20251001-de-pdf-a.pdf)

Art. 4 Nebenkosten im Allgemeinen
(Art. 257a OR)
1 Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.
2 Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.
3 Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.

Art. 5 Anrechenbare Heizungs- und Warmwasserkosten
(Art. 257b Abs. 1 OR)
1 Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.
2 Darunter fallen insbesondere die Aufwendungen für:
a. die Brennstoffe und die Energie, die verbraucht wurden;
b. die Elektrizität zum Betrieb von Brennern und Pumpen;
c. die Betriebskosten für Alternativenergien;
d. die Reinigung der Heizungsanlage und des Kamins, das Auskratzen, Ausbrennen und Einölen der Heizkessel sowie die Abfall- und Schlackenbeseitigung;
e. die periodische Revision der Heizungsanlage einschliesslich des Öltanks sowie das Entkalken der Warmwasseranlage, der Boiler und des Leitungsnetzes;
f. die Verbrauchserfassung und den Abrechnungsservice für die verbrauchsabhängige Heizkostenabrechnung sowie den Unterhalt der nötigen Apparate;
g. die Wartung;
h. die Versicherungsprämien, soweit sie sich ausschliesslich auf die Heizungsanlage beziehen;
i. die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt.
3 Die Kosten für die Wartung und die Verwaltung dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.

Art. 6 Nicht anrechenbare Heizungs- und Warmwasserkosten
(Art. 257b Abs. 1 OR)
Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für:
a. die Reparatur und Erneuerung der Anlagen;
b. die Verzinsung und Abschreibung der Anlagen.

Hinweis für die Konstante: Nicht aus dem Merkblatt abschreiben. Es weicht ab: Art. 4 Abs. 2 «auf die Durchschnittswerte» (Fedlex: «auf Durchschnittswerte»), Randtitel «Im allgemeinen» (Fedlex: «Im Allgemeinen»), Art. 6b in alter Fassung («Art. 16 EnV»; Fedlex: «Artikel 16a und 16b der Energieverordnung»).

## Nicht bestätigt

- **Lift, Serviceabo für Wartung:** Keine Fedlex-Norm nennt den Lift; «Wartung» (Art. 5 Abs. 2 lit. g VMWG) gilt wörtlich nur für die Heizung. Das Merkblatt lässt Wartungsabos nur «gemäss weitverbreiteter Praxis» zu und schreibt S. 3: «Periodische Kontrollen sind obligatorisch und daher nicht unmittelbar im Zusammenhang mit dem Gebrauch … Daher sind die Liftkosten eigentlich von der Logik her keine Nebenkosten». Das ist dieselbe Begründung, mit der Feuerlöscher-Wartung umgestellt wurde. Entscheid «Lift ja» bleibt, aber die KI kann bei Lift-Kontrollen die Feuerlöscher-Logik anwenden; Testfall im Auswertungsskript empfohlen. Gesucht: Fedlex OR/VMWG, Merkblatt; Rechtsprechung nicht gesucht.
- **Schädlingsbekämpfung im Gebäude** (nicht Garten): weder Fedlex noch Merkblatt (dort nur unter Gartenpflege) äussern sich. `mmx search "Nebenkosten Schädlingsbekämpfung Schweiz Mietrecht umlagefähig"` lieferte nur deutsche Quellen (§ 2 Nr. 9 BetrKV: in Deutschland umlagefähig). Der Entscheid «nein» ist die vorsichtige, mieterfreundliche Lösung; Risiko: ein Sprachmodell mit deutschem Wissen schlägt «umlagefähig» vor. Testfall im Auswertungsskript empfohlen.
- **Feuerlöscher-Wartung:** nur Merkblatt («umstritten», Brandschutz «dürften … nicht nebenkostenfähig sein»); keine Fedlex-Norm, kein Urteil geprüft. Begründung im Issue stützt sich auf Art. 257a Abs. 1 OR (Gebrauch); das ist eine Auslegung, kein Wortlaut.
- **Hypothekarzinsen und wertvermehrende Investitionen:** dass sie über den Mietzins (Art. 269a lit. b OR, Art. 13–14 VMWG) statt über die Nebenkosten laufen, ist aus dem Aufbau gefolgert; Art. 13–14 VMWG nicht im Wortlaut gelesen.
- **Seed-Beschreibungen in fr/it/en:** Die Spalte `description` ist nur deutsch; ob die neuen Beschreibungen in der App übersetzt angezeigt werden müssen, nicht geprüft (Sache von `code-reviewer`).
