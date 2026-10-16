# Fachreview #217 «Rechnungen aus hochgeladenen Belegen» – Runde 1 (vor Umsetzung)

Gegenstand: Worktree `review-upload-fach`, Commit ec7ebeb. Geprüft: 8 `@wip`-Szenarien `tests/e2e/features/invoices.feature:53-113`, 4 `@wip`-Szenarien `tests/e2e/features/invoice-detail.feature:42-65`, Glossarzeile «Beleg» (`UBIQUITOUS_LANGUAGE.md:64`, Commit 6adf5a6), Entwurf KI-Prompt «Beleg lesen» (aus dem Auftrag), Entwürfe `privacy_llm_external` / `privacy_llm_local`, Datenschutzseite (`src/routes/privacy/+page.svelte`, `messages/de.json:130-154`), Issues #216 und #178. Entscheide des Product Owners in #217 sind Vorgabe und nur dann Befund, wenn sie gegen Recht verstossen.

Rechtsgrundlage (Fedlex, wörtlich, abgerufen 2026-10-15, Kopien in `/tmp/claude-0/-home-user/42225c72-2497-5110-b437-fe1c26488178/scratchpad/fedlex217/`):
- OR, SR 220, Stand 1.10.2026 (`or.txt`): Art. 257b Abs. 1 «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2 «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- VMWG, SR 221.213.11, Stand 1.10.2025 (`vmwg.txt`): Art. 8 Abs. 2 «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
- MWSTG, SR 641.20, Stand 1.1.2025 (`mwstg.txt`): Art. 21 Abs. 2 Ziff. 21 ausgenommen ist «die Überlassung von Grundstücken und Grundstücksteilen zum Gebrauch oder zur Nutzung; …»; Art. 22 Abs. 2 «Die Option ist ausgeschlossen für: … b. Leistungen nach Artikel 21 Absatz 2 Ziffern 20 und 21, wenn der Gegenstand vom Empfänger oder von der Empfängerin ausschliesslich für Wohnzwecke genutzt wird oder genutzt werden soll.»; Art. 29 Abs. 1 «Kein Anspruch auf Vorsteuerabzug besteht bei Leistungen …, die für die Erbringung von Leistungen, die von der Steuer ausgenommen sind und für deren Versteuerung nicht optiert wurde, verwendet werden.»
- DSG, SR 235.1, Stand 7.7.2025 (`dsg.txt`): Art. 6 Abs. 2 «Die Bearbeitung muss nach Treu und Glauben erfolgen und verhältnismässig sein.», Abs. 3 «Personendaten dürfen nur zu einem bestimmten und für die betroffene Person erkennbaren Zweck beschafft werden …», Abs. 4 «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.»; Art. 19 Abs. 2 «… er teilt ihr mindestens mit: a. die Identität und die Kontaktdaten des Verantwortlichen; b. den Bearbeitungszweck; c. gegebenenfalls die Empfängerinnen und Empfänger …», Abs. 3 «Werden die Daten nicht bei der betroffenen Person beschafft, so teilt er ihr zudem die Kategorien der bearbeiteten Personendaten mit.», Abs. 4 «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat …».

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | «zu bezahlender Gesamtbetrag» ist nicht immer die tatsächliche Aufwendung: abgezogene Akonto-/Teilzahlungen, Mahngebühren, Gutschriften |
| V-2 | Verwalter | Major | Gemischte Rechnungen (Wartung + Reparatur): «Beschreibung in wenigen Worten» verliert die Positionen, die Kategorie wird umlagefähig vorgeschlagen |
| V-3 | Verwalter | Minor | Rechnungsdatum und Leistungszeitraum bestimmen die Periode (Regel 1); Szenario erstellt mit unsicherem Datum ungeprüft, fehlender Leistungszeitraum ist nicht markiert |
| V-4 | Verwalter | Minor | Fehlertext nennt die Schaltfläche «Rechnung erstellen», die es im Dialog nicht gibt («{n} Rechnungen erstellen») |
| V-5 | Verwalter | Nit | Fälligkeitsdatum bei «zahlbar innert 30 Tagen»: Prompt widerspricht sich («erfinde nichts») |
| V-6 | Verwalter | Nit | Duplikatprüfung: Namensvarianten, Rechnungen ohne Nummer, falsches Gebäude |
| V-7 | Verwalter | Nit | Prompt «Rechnung eines Dienstleisters»: Gebühren von Gemeinde/Werken, Sprache der Beschreibung, Leistungsdatum (ein Tag) |
| V-8 | Verwalter | Nit | «inkl. MWST» ist für Wohnräume richtig (bestätigt); bei optierten Geschäftsräumen (Mischnutzung) wäre es netto |
| M-1 | Mietrecht | Major | Rechnung ohne Kategorie wird als umlagefähig erstellt (Szenario «ohne KI», KI-Konfidenz < 0.7) und erscheint als «Nicht kategorisiert» in der Abrechnung |
| M-2 | Mietrecht | Major | Glossar «Originaldatei … Dient der Belegeinsicht»: ein Foto ist kein Original; Art. 8 Abs. 2 VMWG gibt Einsicht in Originalunterlagen – Papier aufbewahren |
| M-3 | Mietrecht | Minor | Beleg ersetzen und Rechnung löschen auch nach versandter Abrechnung möglich; Beleg geht verloren, Belegeinsicht ist unbefristet |
| M-4 | Mietrecht | Minor | Begriffe: Glossar definiert «Rechnung» als «Beleg»; Szenarien nennen auch eine Word-Datei und ungespeicherte Dateien «Beleg» |
| R-1 | Rechtstexte | Minor | `privacy_stored_1` nennt die gespeicherten Belege (Inhalt, Zweck, Dauer) nicht |
| R-2 | Rechtstexte | Minor | Lokaler Entwurf verschärft #216 (KI aus: Text behauptet Lesen von Belegen); #216 sagt «Texte bleiben wie sie sind» – Konflikt |
| R-3 | Rechtstexte | Minor | Externer Entwurf: «Laden Sie Belege hoch, wird jede Datei … übermittelt» gilt auch für «Beleg ersetzen» / Beleg zu erfasster Rechnung? «gelesen» auch für getippte Rechnungen; Übermittlung schon vor «Erstellen» |
| R-4 | Rechtstexte | Nit | Dateiname an die KI ohne Zweck (Verhältnismässigkeit), Dateinamen enthalten oft Mieternamen |
| R-5 | Rechtstexte | Nit | PDF-Seiten im Browser rendern: Bibliothek nicht von einem CDN laden, sonst wird `privacy_third_5` falsch |

## Befunde

### V-1 (Verwalter, Major) – Betrag: «zu bezahlender Gesamtbetrag»

- Beleg: Prompt-Entwurf «amount: zu bezahlender Gesamtbetrag in CHF inkl. MWST». Art. 257b Abs. 1 OR: Nebenkosten sind «die tatsächlichen Aufwendungen des Vermieters». `utility-validation.service.ts:78-80` lässt nur Beträge > 0 zu.
- Warum falsch: Auf Schweizer Schlussrechnungen (Strom, Gas, Wasser, Fernwärme, oft auch Heizöl- und Serviceverträge) steht «Total Leistungen», dann «abzüglich Akontozahlungen/Teilrechnungen», dann «zu bezahlen». Auf Mahnungen ist der zu zahlende Betrag inkl. Mahngebühr und Verzugszins; beides ist keine Leistung «die mit dem Gebrauch zusammenhängt». Gutschriften haben keinen zu zahlenden Betrag.
  Nachrechnung (Regel 1, `invoice.service.ts:420-430`, Periode 1.7.2025–30.6.2026, Leistungszeitraum Kalenderjahr 2025, 184 von 365 Tagen):
  - Allgemeinstrom 2025: Total CHF 1'200, abzüglich 4 Akonto à 250 (als Rechnungen erfasst, je Quartal), zu bezahlen 200. KI nimmt 200: Schlussrechnung 200 × 184/365 = 100.82 + Akonto Q3+Q4 500 = 600.82 – nahe am richtigen 1'200 × 184/365 = 604.93. Richtig nur, *weil* die Akonto-Rechnungen erfasst sind.
  - Sind die Akonto-Rechnungen nicht erfasst (häufig: Lastschrift ohne Rechnung), bleiben 100.82 statt 604.93: der Vermieter verliert 504.11.
  - Nimmt die KI das Total 1'200 und die Akonto-Rechnungen sind erfasst: 604.93 + 500 = 1'104.93; der Mieter zahlt 500 zu viel – unzulässig nach Art. 257b Abs. 1 OR.
  - Randfall Gutschrift (Rückvergütung Netzbetreiber −80): «zu bezahlen» = null oder negativ; negativ wird bei der Abrechnung abgelehnt (`> 0`), der Mieter verliert die Rückvergütung, die die tatsächlichen Aufwendungen senkt.
- Behebung: Prompt liest getrennt `totalAmount` (Total der Leistungen inkl. MWST, ohne Mahngebühren und Verzugszinsen) und `deductedAmount` (abgezogene Akonto-, Anzahlungs- oder Teilbeträge, sonst null) sowie `documentType` (`invoice` / `reminder` / `credit_note`). Die Zeile im Dialog zeigt bei `deductedAmount` den Hinweis (Vorschlag) «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF {x}). Erfassen Sie den Betrag so, dass jede Leistung nur einmal zählt.», bei einer Mahnung «Das ist eine Mahnung. Mahngebühren und Verzugszinsen sind keine Nebenkosten; erfassen Sie die ursprüngliche Rechnung.», bei einer Gutschrift einen Hinweis, dass Dwello Gutschriften noch nicht abbildet. Welcher Betrag vorgeschlagen wird (Total oder Rest), entscheidet der Product Owner: Issue (`fachlich`, `entscheiden`) «Betrag bei Schlussrechnungen mit abgezogenen Akontozahlungen». Unit-Tests mit festen KI-Antworten für die drei Fälle.

### V-2 (Verwalter, Major) – gemischte Rechnungen

- Beleg: Prompt «description: die erbrachte Leistung in wenigen Worten»; die Kategorie kommt aus `CATEGORIZATION_PROMPT` (`backend/src/config/llm.ts:92-115`) nur aus Rechnungssteller, Beschreibung, Betrag; eine Datei = eine Rechnung = eine Kategorie (#217). `ALLOCABILITY_PROMPT` Regel 1 (`llm.ts:154`): Reparaturen trägt der Vermieter (Art. 256 Abs. 1 OR).
- Warum falsch: Hauswart-, Lift- und Heizungsrechnungen enthalten häufig Wartung (umlagefähig) und Reparatur/Ersatzteile (nicht umlagefähig) auf einer Rechnung. Beim Abtippen sieht der Verwalter die Positionen; im Stapel liest die KI eine Kurzbeschreibung «Liftservice», die Kategorisierung schlägt «Lift» umlagefähig vor, und mit «{n} Rechnungen erstellen» wird die Reparatur auf die Mieter verteilt (gegen Art. 257b Abs. 1 OR).
- Behebung: Prompt ergänzen: `description` nennt alle Positionen kurz (nicht nur die Hauptleistung), zusätzlich `mixedCosts: true/false` («enthält die Rechnung neben Betrieb/Wartung auch Reparatur, Ersatz, Anschaffung oder Material?»). Bei `true` Hinweis in der Zeile, z.B. «Die Rechnung enthält auch Reparaturen oder Anschaffungen. Diese dürfen nicht auf die Mieter umgelegt werden. Erfassen Sie den umlagefähigen Teil als eigene Rechnung.» Wie Dwello eine Rechnung aufteilt (gleicher Beleg für zwei Rechnungen?), entscheidet der Product Owner (Issue `fachlich`, `entscheiden`).

### V-3 (Verwalter, Minor) – Periode hängt an unsicheren Feldern

- Beleg: `invoices.feature:57-59` «Und ist beim Beleg von "Elektro Blitz" das Rechnungsdatum als unsicher markiert / Wenn der Liegenschaftsverwalter die Rechnungen erstellt / Dann sagt Dwello "2 Rechnungen erstellt"». Regel 1 in `docs/nebenkostenabrechnung-anforderungen.md:141`: ohne Leistungszeitraum zählt die Rechnung in der Periode ihres Rechnungsdatums. Prompt: «servicePeriodStart, servicePeriodEnd: … nur wenn die Rechnung ihn nennt»; null bedeutet damit sowohl «nennt keinen» als auch «nicht gefunden».
- Warum: Nachrechnung Hauswart Q4 2025, CHF 1'200, Leistungszeitraum 1.10.–31.12.2025 (92 Tage), Rechnungsdatum 10.1.2026, Periode = Kalenderjahr. Mit Leistungszeitraum: 1'200 in 2025; Mieterwechsel am 15.11.2025: A trägt 46/92, B 46/92. Übersieht die KI den Leistungszeitraum (null, also nicht «unsicher» markiert): 0 in 2025, 1'200 in 2026; A zahlt nichts, B die ganze Rechnung in einer falschen Periode. Gleiches bei falsch gelesenem Datum (31.12. statt 3.1.). Das Szenario zeigt als Normalfall, dass der Verwalter mit einem unsicheren Datum ungeprüft erstellt.
- Behebung: (a) Szenario so ändern, dass der Verwalter das unsichere Rechnungsdatum prüft/korrigiert, bevor er erstellt (Schritt gibt es schon: «erfasst beim Beleg … das Rechnungsdatum»). (b) Prompt: Konfidenz auch für null-Werte verlangen; ist `servicePeriodStart` null, Hinweis in der Zeile «Kein Leistungszeitraum gefunden. Nennt die Rechnung einen, tragen Sie ihn ein: er bestimmt die Abrechnungsperiode.» (c) Ob unsichere Werte bei Rechnungsdatum, Betrag und Leistungszeitraum das Erstellen sperren, bis der Verwalter sie bestätigt, ist Produktentscheid (Issue `fachlich`, `entscheiden`).

### V-4 (Verwalter, Minor) – Fehlertext nennt falsche Schaltfläche

- Beleg: `invoices.feature:113` «Wählen Sie noch einmal «Rechnung erstellen».»; #217: «one primary button «{n} Rechnungen erstellen»».
- Warum: Der Verwalter sucht eine Schaltfläche, die es nicht gibt.
- Behebung: «Die Rechnung wurde nicht erstellt, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «{n} Rechnungen erstellen».» oder neutral «Versuchen Sie es noch einmal.».

### V-5 (Verwalter, Nit) – Fälligkeitsdatum

- Beleg: Prompt «dueDate: Fälligkeitsdatum» und «erfinde nichts». Schweizer Rechnungen nennen oft nur «zahlbar innert 30 Tagen».
- Behebung: festlegen: «Nennt die Rechnung nur eine Frist in Tagen, rechne Rechnungsdatum + Frist» oder null. Ohne Festlegung antworten Modelle uneinheitlich.

### V-6 (Verwalter, Nit) – Duplikate

- Beleg: #217 «same Rechnungssteller and Rechnungsnummer in the Gebäude»; `invoices.feature:76-80`.
- Warum: Die KI liest «Hauswart Huber GmbH», erfasst ist «Hauswart Huber»; Rechnungen ohne Nummer (Privatpersonen) werden nie erkannt; dieselbe Rechnung im falschen Gebäude ebenfalls nicht.
- Behebung: Namen normalisiert vergleichen (Gross/Klein, Rechtsform); ohne Nummer zusätzlich Rechnungssteller + Betrag + Rechnungsdatum als «möglicherweise schon erfasst». Umfang ist Produktentscheid.

### V-7 (Verwalter, Nit) – Prompt-Wortlaut

- «Rechnung eines Dienstleisters»: Wasser-, Abwasser- und Kehrichtgebühren kommen von Gemeinde oder Werken (öffentliche Abgaben, Art. 257b Abs. 1 OR). Vorschlag: «Rechnung eines Dienstleisters, Lieferanten oder einer Behörde (z.B. Gemeinde, Werke)».
- `description`: Sprache festlegen («in der Sprache der Rechnung» oder Sprache der Oberfläche); fr/it-Rechnungen sind in der Romandie/im Tessin die Regel.
- Ein einzelnes Leistungsdatum («Einsatz vom 12.3.2026»): als Leistungszeitraum Beginn = Ende lesen oder nicht? Festlegen; nach Regel 1 wäre es genauer als das Rechnungsdatum.
- Schweizer Zahlformat «1'250.00» ausdrücklich nennen, damit «1.250,00» (DE) nicht als 1.25 gelesen wird.

### V-8 (Verwalter, Nit) – MWST

- Bestätigt: Für Wohnräume ist «inkl. MWST» richtig. Die Vermietung ist ausgenommen (Art. 21 Abs. 2 Ziff. 21 MWSTG), die Option für Wohnzwecke ausgeschlossen (Art. 22 Abs. 2 lit. b MWSTG), daher kein Vorsteuerabzug (Art. 29 Abs. 1 MWSTG); die MWST ist Teil der «tatsächlichen Aufwendungen» (Art. 257b Abs. 1 OR).
- Rest: Gebäudetyp «Geschäftshaus»/«Mischnutzung» (`UBIQUITOUS_LANGUAGE.md:15`). Hat der Vermieter für Geschäftsräume optiert, kann er die Vorsteuer abziehen; dann wäre netto die tatsächliche Aufwendung. Für Dwello (private Vermieter, Wohnungen) kein Handlungsbedarf; ggf. Hilfetext. Die Schlussfolgerung «optiert → netto» ist aus Art. 29 MWSTG abgeleitet, Praxis **unsicher**.

### M-1 (Mietrecht, Major) – Rechnung ohne Kategorie wird umgelegt

- Beleg: `invoices.feature:70-75` erstellt die Rechnung ohne KI nur mit Rechnungssteller, Beschreibung, Betrag, Rechnungsdatum – ohne Kategorie. `backend/src/routes/invoices.ts:44` `categoryId` optional; `backend/src/db/schema.ts:249` `is_valid_utility_cost … default(true)`; `src/routes/invoices/new/+page.svelte:55` `isValidUtilityCost = $state(true)`; `getInvoicesForStatement` nimmt alle mit `isValidUtilityCost = true` (`invoice.service.ts:437-447`); `calculation.service.ts:99` gruppiert sie als «Nicht kategorisiert». `llm.service.ts:206-216`: unter Konfidenz 0.7 wird keine Kategorie vorbelegt – also auch mit laufender KI.
- Warum falsch: Eine Rechnung, deren Kostenart niemand bestimmt hat, landet umlagefähig in der Abrechnung (Art. 257a Abs. 2, 257b Abs. 1 OR: nur vereinbarte, tatsächliche Betriebskosten). Eine Abrechnungsposition «Nicht kategorisiert» kann der Mieter nicht prüfen. Das bestand schon bei `/invoices/new`, der Stapel macht es zum Normalfall (KI aus oder unsicher, 20 Dateien, ein Klick).
- Behebung: Im Dialog ist die Kategorie Pflichtfeld (Zeile bleibt mit Grund «Bitte wählen Sie eine Kategorie.»), oder ohne Kategorie wird `isValidUtilityCost = false` gespeichert. Szenario «Rechnung ohne KI aus einem Beleg erfassen» um die Kategorie ergänzen. Das Grundproblem in `/invoices/new` als eigenes Issue (`fachlich`, `entscheiden`).

### M-2 (Mietrecht, Major) – Beleg ist nicht immer das Original

- Beleg: `UBIQUITOUS_LANGUAGE.md:64` «Hochgeladene Originaldatei einer Rechnung (PDF, JPEG oder PNG) … Dient der Belegeinsicht des Mieters (Art. 257b Abs. 2 OR).»; Szenario «Foto der Rechnung» (`invoices.feature:55`). Art. 8 Abs. 2 VMWG: «… die sachdienlichen Originalunterlagen einzusehen …». `docs/nebenkostenabrechnung-anforderungen.md:58` (Satz im PDF «Originalbelege … einsehen»).
- Warum: Ein Handyfoto einer Papierrechnung ist eine Kopie. Der Glossartext und «Dient der Belegeinsicht» legen dem Vermieter nahe, das Papier nach dem Hochladen wegzuwerfen. Für Heizungs- und Warmwasserkosten kann der Mieter die Originalunterlagen verlangen; das PDF der Abrechnung verspricht ihm «Originalbelege». Nur bei elektronisch zugestellten Rechnungen (PDF) ist die Datei das Original.
- Behebung (Vorschlag Glossar, der Product Owner ändert): «**Beleg** | Hochgeladene Datei einer Rechnung (PDF, JPEG oder PNG): die elektronisch erhaltene Rechnung oder ein Scan/Foto der Papierrechnung, höchstens eine pro Rechnung. Wird mit der Rechnung gelöscht. Erleichtert die Belegeinsicht (Art. 257b Abs. 2 OR); Papierrechnungen bleiben das Original, das der Mieter bei Heiz- und Warmwasserkosten einsehen darf (Art. 8 Abs. 2 VMWG).» Dazu Hilfetext an der Ablagezone: «Bewahren Sie Rechnungen auf Papier auch nach dem Hochladen auf: Mieter dürfen die Originale einsehen.» Issue `fachlich`, `entscheiden`.

### M-3 (Mietrecht, Minor) – Beleg geht nach versandter Abrechnung verloren

- Beleg: `invoice-detail.feature:48-52` «Beleg ersetzen», `:60-65` «Rechnung mit Beleg löschen»; `invoice.service.ts:302-316` prüft nicht, ob die Rechnung in einer Abrechnung steckt («Note: This would require a link …»). Art. 257b Abs. 2 OR (Einsicht ohne Frist); `docs/nebenkostenabrechnung-anforderungen.md:78` «Daten und Belege mindestens 5 Jahre (besser 10 Jahre …) aufbewahren».
- Warum: Ersetzen überschreibt den Beleg, den der Mieter vielleicht schon eingesehen hat; Löschen entfernt Rechnung und Beleg einer versandten Abrechnung. Der Vermieter trägt die Beweislast (`anforderungen.md:43`).
- Behebung: Die Bestätigung nennt zusätzlich, wenn die Rechnung in einer Abrechnung steht: «Diese Rechnung ist Teil der Abrechnung {Periode}. Mieter können die Belege bis zur Verjährung einsehen.» Beim Ersetzen mindestens dieselbe Warnung. Sperren oder Versionieren ist Produktentscheid (Issue `fachlich`, `entscheiden`); Aufbewahrung der Belege in #178 aufnehmen oder eigenes Issue (#178 betrifft nur Mieterdokumente).

### M-4 (Mietrecht, Minor) – Begriff «Beleg» doppelt belegt

- Beleg: `UBIQUITOUS_LANGUAGE.md:54` «**Rechnung** | Beleg eines Dienstleisters für erbrachte Leistungen am Gebäude»; `:64` Beleg = Datei. Szenarien: «sagt der Beleg "notizen.docx"» (`invoices.feature:65`) – eine Word-Datei ist nach Glossar kein Beleg; «Hochladen abbrechen verwirft die Belege» (`:96`) – ungespeicherte Dateien gehören zu keiner Rechnung. In Art. 257b Abs. 2 OR meint «Belege» alle Unterlagen (auch Verträge, Zählerstände).
- Behebung: Glossar «Rechnung» (Vorschlag): «Forderung eines Dienstleisters, Lieferanten oder einer Behörde für Leistungen oder Abgaben am Gebäude (z.B. Hauswartung, Heizöl, Wassergebühren). Ihre hochgeladene Datei ist der Beleg.» In den Szenarien für den Dialog «Datei» verwenden («sagt die Datei "notizen.docx" …», «Hochladen abbrechen verwirft die Dateien»), «Beleg» erst ab der gespeicherten Rechnung, wie die UI-Texte «Beleg anzeigen», «Beleg ersetzen». Issue `fachlich`, `entscheiden`.

### R-1 (Rechtstexte, Minor) – Speicherung der Belege fehlt

- Beleg: `messages/de.json:136` `privacy_stored_1` zählt «Rechnungen, Dokumente, die Sie zu Mietern hochladen (…)» auf; Belege sind neu. Art. 19 Abs. 2 lit. b DSG (Zweck), Abs. 3 (Kategorien der Daten, wenn nicht bei der Person beschafft: Rechnungssteller, auf Rechnungen genannte Mieter); Art. 6 Abs. 4 DSG (Dauer).
- Warum: Der Text beschreibt nicht, dass Originaldateien mit Namen, Adressen und Bankverbindungen dritter Personen gespeichert werden, wozu und wie lange.
- Behebung (Vorschlag, in `privacy_stored_1` nach «Rechnungen»): «Rechnungen mit ihren Belegen (die hochgeladenen Dateien; sie enthalten alles, was auf der Rechnung steht, etwa Namen, Adressen und Bankverbindungen von Rechnungsstellern und manchmal Mietern). Belege dienen der Belegeinsicht der Mieter und bleiben gespeichert, bis Sie die Rechnung löschen.» Wie bei #174 liegen sie in derselben PostgreSQL-Datenbank (`privacy_stored_2` stimmt dann).

### R-2 (Rechtstexte, Minor) – lokaler Text und #216

- Beleg: Entwurf local «Rechnungen und hochgeladene Belege werden mit einem Sprachmodell gelesen und kategorisiert …»; #216 Problem 1: bei `LLM_ENABLED=false` zeigt die Seite den lokalen Text, obwohl kein Modell läuft; #216 «Done means»: «The texts for a local and an external KI stay as they are.»
- Warum: Mit #217 werden Belege auch bei abgeschalteter KI hochgeladen (#217 «KI switched off … files can still be uploaded»); der lokale Text behauptet dann zusätzlich ein Lesen der Belege, das nicht stattfindet (Art. 19 Abs. 2 DSG: transparente Bearbeitung). #216 und #217 ändern dieselben Schlüssel.
- Behebung: In #216 vermerken, dass #217 die Texte ändert und der neue Text für «KI aus» die Belege einschliesst (Vorschlag: «Dwello verwendet kein Sprachmodell. Rechnungen, Belege und Kategorien werden nicht automatisch gelesen oder kategorisiert.»). Reihenfolge der beiden Issues festlegen.

### R-3 (Rechtstexte, Minor) – Umfang der Übermittlung im externen Text

- Beleg: Entwurf external «Rechnungen werden von {provider} ({country}) mit einem Sprachmodell gelesen und kategorisiert. Laden Sie Belege hoch, wird jede Datei mit ihrem Dateinamen übermittelt …». Szenario `invoice-detail.feature:48-58` (Beleg ersetzen / zu erfasster Rechnung hochladen) – ob dort ausgelesen wird, steht nirgends. #217: Auslesen «starts per file as soon as it is added», auch wenn danach abgebrochen wird.
- Warum: Die Erklärung muss sagen, was tatsächlich übermittelt wird (Art. 19 Abs. 2 lit. c, Abs. 4 DSG). Wird beim Ersetzen nicht ausgelesen, ist «Laden Sie Belege hoch» zu weit; «gelesen» passt nicht zu getippten Rechnungen; dass die Datei schon beim Hinzufügen und auch bei Abbruch weggeht, erwartet der Verwalter nicht.
- Behebung (Vorschlag): «Rechnungen werden von {provider} ({country}) mit einem Sprachmodell kategorisiert. Laden Sie unter «Rechnungen hochladen» Dateien hoch, wird jede Datei mit ihrem Dateinamen sofort übermittelt, damit das Sprachmodell sie liest (PDF-Seiten als Bilder), auch wenn Sie danach abbrechen; sie enthält alles, was darauf zu sehen ist, auch Namen, Adressen und Bankverbindungen. Für die Kategorie …» (Rest unverändert). Falls «Beleg ersetzen» auch ausliest: Satz entsprechend erweitern. Gleich in fr/it/en.

### R-4 (Rechtstexte, Nit) – Dateiname an die KI

- Beleg: Prompt «Die Bilder sind die Seiten der Datei «{fileName}».»; Art. 6 Abs. 2 DSG («verhältnismässig»).
- Warum: Für das Auslesen ist der Dateiname nicht nötig; Dateinamen wie «Reparatur Whg Müller.pdf» enthalten Mieternamen. Der KI-Stand-in braucht ihn (`invoice-upload.steps.ts:34-35`), das ist kein Grund für die echte KI.
- Behebung: Dateinamen nicht senden (Stand-in über einen anderen Weg steuern) und den Hinweis «mit ihrem Dateinamen» streichen; oder Zweck nennen.

### R-5 (Rechtstexte, Nit) – PDF-Rendering

- Beleg: `implementation_plan.md` «PDF pages rendered in the browser for the KI»; `messages/de.json:145` «Ausser den hier … genannten Diensten erhält niemand Daten von Dwello.»
- Behebung: Bibliothek und Worker (z.B. pdf.js) aus dem eigenen Bundle laden, nicht von einem CDN; sonst Dienst in «Weitergabe an Dritte» nennen.

## Fehlende Begriffe (Vorschläge für Issues, Labels `fachlich`, `entscheiden`)

1. **Konfidenz** erweitern: «Vertrauenswert der KI für einen Vorschlag (Kategorie oder ausgelesene Angabe), 0–1. Unter 0.7 zeigt Dwello den Wert als unsicher.» (heute nur Kategorie, `UBIQUITOUS_LANGUAGE.md:91`).
2. **Auslesen (eines Belegs)**: «Die KI liest Rechnungssteller, Rechnungsnummer, Rechnungsdatum, Betrag, Leistungszeitraum, Fälligkeitsdatum und Beschreibung aus einer hochgeladenen Datei; Vorschlag, gespeichert wird erst mit «Rechnungen erstellen».» (Szenario `invoices.feature:104` «das Auslesen von Belegen»).
3. **Beleg hochladen** (UI): Für eine Rechnung ohne Beleg heisst die Aktion nicht «Beleg ersetzen» (`invoice-detail.feature:55-58` nutzt den Ersetzen-Schritt). Vorschlag «Beleg hinzufügen».
4. **Rechnung** neu fassen (siehe M-4), **Beleg** (siehe M-2).
5. Entscheide: Betrag bei Schlussrechnungen (V-1), gemischte Rechnungen (V-2), Sperren bei unsicheren Feldern (V-3), Kategorie Pflicht im Dialog (M-1), Belege nach Abrechnung (M-3).

## Bestätigt

- «inkl. MWST» für Wohnräume (V-8, MWSTG Art. 21, 22, 29; OR Art. 257b Abs. 1).
- Nichts wird vor «{n} Rechnungen erstellen» gespeichert; der Abbruch fragt nach (`invoices.feature:95-101`) – passt zu #217.
- Leistungszeitraum «nur wenn die Rechnung ihn nennt» und «erfinde nichts» entspricht Regel 1 (keine erfundenen Zeiträume).
- Fremdwährung → null: richtig, Dwello rechnet in CHF.
- «Eine Datei = eine Rechnung», Duplikat-Hinweis nicht vorausgewählt, aber erstellbar: Produktentscheid, rechtlich unbedenklich.
- Belegeinsicht pro Rechnung (anzeigen, herunterladen, ersetzen) erfüllt Art. 257b Abs. 2 OR nicht allein, verletzt es aber nicht (Einsicht kann auch vor Ort/auf Papier erfolgen).
- Löschbestätigung «Der Beleg wird ebenfalls gelöscht.» (`invoice-detail.feature:65`) entspricht #217.
- Fehlertext Dateityp ist derselbe wie bei Mieterdokumenten (`messages/de.json:1337`) – einheitlich. Glossar sagt «JPEG», die UI «JPG»: Nit, kein Befund.
- Externer Entwurf nennt Anbieter und Staat (Art. 19 Abs. 4 DSG); Garantien nach #216 (Option B) bewusst nicht. Kategorietext unverändert gegenüber Runde #212 (bestätigt dort).
- Cookies (Art. 45c FMG) und Nutzungsbedingungen sind nicht berührt.

## Nicht bestätigt

- Ob Belegeinsicht in eine Kopie/Datei für andere Nebenkosten als Heizung genügt: Art. 257b Abs. 2 OR sagt nur «Belege»; HEV laut `anforderungen.md:76` «Keine Pflicht, Originale herauszugeben» (nicht geöffnet). **unsicher**.
- Ob Schweizer Verwalter Akonto-Rechnungen von Werken als eigene Rechnungen erfassen oder nur die Schlussrechnung mit Total: Praxis, keine Fedlex-Norm (V-1). **unsicher**.
- Aufbewahrungsfrist für Belege: 5 Jahre aus `anforderungen.md:78` (Art. 128 OR, nur Sekundärquelle dort); Art. 958f OR (10 Jahre Buchführung) nicht nachgeschlagen, gilt ohnehin nur für Buchführungspflichtige. **unsicher**.
- Zusammenspiel hochgeladener Heizöl-Rechnungen mit dem Heizöl-Bestand (Art. 5 Abs. 2 lit. a VMWG «verbraucht»): nicht geprüft, vorbestehend.
- Ob «Beleg ersetzen» oder «Beleg hinzufügen» die KI aufruft: weder Issue noch Szenario sagen es (R-3).
- Belegeinsicht bei Rechnungen mit Namen anderer Mieter (Datenschutz gegenüber Mitmietern): nicht Gegenstand, keine Fedlex-Prüfung.
- Qualität echter Antworten von `qwen2.5vl:7b` (Konfidenzwerte selbstberichtet): nicht prüfbar, laut #217 `llm:eval`.
