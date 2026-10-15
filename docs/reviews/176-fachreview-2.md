# Fachreview #176, Runde 2 (Datenschutztext, Hilfetext, LEGAL_BASIS, Zitierweise)

Geprüfter Stand: Commit `679089a` (Worktree `review-176-fach2`), Datum 2026-10-15. Vergleichsbasis Runde 1: `4556b71`.
Gegenstand: vorgeschlagene Texte `privacy_llm_external` / `privacy_llm_local` (noch nicht in `messages/*.json`), `privacy.feature` «KI auf dem Server des Betreibers» (@wip), `categories_allocable_help` de/fr/it/en (`messages/*.json:1087`), Vorschlag C-8, `LEGAL_BASIS` und Prompts in `backend/src/config/llm.ts:47-185`, `backend/scripts/llm-stub.ts`, `backend/scripts/llm-eval.ts`, Seed `backend/migrations/0002_stammdaten.sql`, Status F-1 bis F-11.
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, Issue #176 mit Kommentaren, Merkblatt Mieterverband (`review-176-fach-merkblatt.txt`, Online-Fassung 2026), Fedlex (Fundstellen im Abschnitt «Gesetzestexte»). Die DOM-Tests `src/__tests__/privacy-page.dom.test.ts` liegen nur im Arbeitsbaum des Aufrufers und wurden nicht gelesen; die erwarteten Teilstrings stammen aus dem Auftrag.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| F-12 | Rechtstexte | Major | Seit `49d395e` gehen bei **jeder** Rechnungskategorisierung Name und Beschreibung **aller** Kategorien (auch eigener, Freitext) an den KI-Anbieter; der vorgeschlagene Text `privacy_llm_external` nennt das nicht und zählt die übermittelten Daten abschliessend auf |
| F-13 | Rechtstexte | Minor | Vorgeschlagener Zusatz nennt für die Kategorie-Prüfung keinen Zweck (Art. 19 Abs. 2 lit. b DSG) und nicht, dass ein Name in Name/Beschreibung der Kategorie mitgeht |
| F-14 | Rechtstexte | Minor (vorbestehend) | Bei Übermittlung ins Ausland fehlen Garantie bzw. Grundlage (Art. 19 Abs. 4 DSG); für die USA gilt die Angemessenheit nur für Data-Privacy-Framework-zertifizierte Anbieter (DSV Anhang 1) |
| F-15 | Rechtstexte | Nit (vorbestehend) | Bei `LLM_ENABLED=false` zeigt die Seite den «lokalen» Text, der eine KI-Verarbeitung behauptet, die nicht stattfindet; der neue lokale Text verstärkt das («prüft auch neue Kategorien») |
| F-16 | Mietrecht | Minor | fr «entretien» und en «maintenance» im Hilfetext bedeuten im Gesetzestext *Unterhalt/Erhaltung* (Art. 256 Abs. 1 OR), also gerade das, was der Vermieter trägt; Fedlex-Begriff für «Wartung» ist fr «maintenance» |
| F-17 | Mietrecht | Nit | Zitierweise: fr nach Fedlex «art. 257a, al. 2, CO» (mit Kommas); de Hilfetext «Absatz», KI-Begründung «Abs.» auf demselben Bildschirm |
| F-18 | Mietrecht | Minor | Prompt-Anweisung «für andere Kosten begründe mit Art. 257a Abs. 1 oder Art. 257b Abs. 1 OR» schliesst die Artikel aus, die die Antwort tatsächlich tragen (Art. 256 Abs. 1, 256b OR, Art. 6a–6c VMWG) |
| F-19 | Verwalter | Minor | Art. 4 Abs. 3 VMWG im Prompt ohne Hinweis auf die Verwaltungspauschale: die KI schlägt eine Kategorie «Honorar Nebenkostenabrechnung» als umlagefähig vor, die neben der Verwaltungspauschale doppelt verrechnet würde |
| F-20 | Mietrecht | Nit | `LEGAL_BASIS` zitiert eine Auswahl aus Art. 4–6c VMWG; Doku (`nebenkostenabrechnung-anforderungen.md:29`) und Entscheid im Issue sagen «Art. 4–6c VMWG wörtlich». Auswahl ist fachlich ausreichend (D-10), aber so zu dokumentieren |

## Antworten auf die Fragen des Auftrags

### 1. Datenschutztext (Rechtstexte)

Ergebnis: Der vorgeschlagene Zusatz ist richtig, aber unvollständig (F-12, F-13). Der lokale Text ist inhaltlich richtig, «prüfen» ohne Gegenstand ist unklar.

Vorgeschlagener Wortlaut (de), mit den Teilstrings, die DOM-Test und Step prüfen («Name und Beschreibung der Kategorie», «neue Kategorien», «verlassen dafür den Server nicht»):

- `privacy_llm_external`:
  «Rechnungen werden von {provider} ({country}) mit einem Sprachmodell kategorisiert. Dafür werden Rechnungssteller (auch Einzelpersonen), Beschreibung und Betrag der Rechnung sowie Name und Beschreibung aller Kategorien übermittelt. Lassen Sie eine neue Kategorie von der KI prüfen, werden Name und Beschreibung der Kategorie übermittelt, damit die KI vorschlägt, ob ihre Kosten umlagefähig sind. Steht in diesen Angaben ein Name, wird auch er übermittelt.»
- `privacy_llm_local`:
  «Rechnungen werden mit einem Sprachmodell kategorisiert; auf Wunsch prüft es auch neue Kategorien darauf, ob ihre Kosten umlagefähig sind. Das Sprachmodell läuft auf dem Server des Betreibers; die Daten verlassen dafür den Server nicht.»

fr/it/en folgen im selben Change sinngemäss (Begriffe nach `docs/design/i18n-begriffe.md`: imputable / addebitabile / allocable).

Bestätigt: Empfänger und Staat werden genannt ({provider}, {country}; Art. 19 Abs. 2 lit. c und Abs. 4 DSG); Zweck für Rechnungen genannt («kategorisiert»); der Abschnitt «Weitergabe an Dritte» mit `privacy_third_5` («Ausser den hier … genannten Diensten erhält niemand Daten») bleibt nur wahr, wenn F-12 behoben ist. Die Sprache der Begründung (`language`) wird ebenfalls übermittelt, ist aber kein Personendatum und muss nicht genannt werden. Cookies (Art. 45c FMG) und Nutzungsbedingungen sind von der Änderung nicht berührt.

### 2. C-8, Wasser und Abwasser im Hilfetext (Verwalter, Mietrecht)

Ergebnis: Inhaltlich vertretbar und nicht zu absolut. Die beiden Ausschlüsse sind genau die Positionen, die das Merkblatt unter «Unzulässig» führt (S. 2: «Gebühr für Regenwasser (= Meteorabwasser)», «Grundgebühren, die unabhängig vom Verbrauch anfallen und an den Wert der Liegenschaft gekoppelt sind»), nicht die «umstrittenen» (S. 2: «Kanalreinigungen, periodische Reinigung der Fallstränge, Grundgebühren»). Sie stimmen mit den vom Product Owner entschiedenen Seed-Beschreibungen überein (`0002_stammdaten.sql:17-18`). Für die wertabhängige Grundgebühr trägt Fedlex den Ausschluss: Art. 257b Abs. 1 OR erfasst nur «öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben», Art. 256b OR lässt «die mit der Sache verbundenen Lasten und öffentlichen Abgaben» beim Vermieter. Für die Regenwassergebühr gibt es nur das Merkblatt (siehe «Nicht bestätigt»).

Form: Die angehängte Ellipse «bei Wasser und Abwasser keine Grundgebühren …» an «zählen nur Betrieb und Wartung» ist für unerfahrene Nutzer schwer lesbar. Vorschlag als eigener Satz nach «… zählen nur Betrieb und Wartung.»:

- de: «Bei Wasser und Abwasser zählen Grundgebühren, die vom Wert der Liegenschaft abhängen, und die Gebühr für Regenwasser nicht.»
- fr: «Pour l’eau et les eaux usées, les taxes de base qui dépendent de la valeur de l’immeuble et la taxe pour les eaux pluviales ne comptent pas.»
- it: «Per l’acqua e le acque reflue non contano le tasse di base che dipendono dal valore dell’immobile né la tassa per le acque meteoriche.»
- en: «For water and waste water, base fees that depend on the value of the property and the rainwater fee do not count.»

Nicht schreiben: «nur Gebühren nach Verbrauch» (zu absolut: verbrauchsunabhängige, nicht wertabhängige Grundgebühren sind laut Merkblatt nur umstritten).

### 3. D-10, Auswahl in LEGAL_BASIS (Mietrecht)

Ergebnis: Ausreichend für die Frage «umlagefähig ja/nein» einer Kategorie. Alle 23 zitierten Absätze/Buchstaben sind mit der Fedlex-HTML-Fassung wörtlich abgeglichen (Skript, Leerraum normalisiert; einzige Abweichung: Art. 6b «16a und 16b», in Fedlex kursive Buchstaben, Text identisch).

- Art. 5 Abs. 3 VMWG («Die Kosten für die Wartung und die Verwaltung dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.») regelt die **Höhe**, nicht die Umlagefähigkeit. Weglassen ist richtig.
- Art. 4 Abs. 1–2 VMWG (Abrechnungsrhythmus, Pauschale) betreffen die Abrechnung, nicht die Kategorie. Weglassen ist richtig.
- Art. 6c Abs. 3 VMWG trägt die Aussage «als Nebenkosten». Abs. 2 lit. c und d («der Ersatz von Anlagen, Installationen und Leuchtmitteln», «die Verbesserung der Gebäudehülle») würden die KI eher verleiten, eine Fassadenrenovation oder einen Heizungsersatz als umlagefähig einzustufen; nicht aufnehmen. Abs. 4–6 (Obergrenze Einsparung, Witterung, Förderbeiträge) betreffen die Höhe. Optional Abs. 1 (Definition), nicht nötig.
- Art. 7 VMWG (Heizkosten leerer Wohnungen) betrifft die Verteilung, nicht die Kategorie.
- Offen bleiben F-18 (Anweisung zum Zitieren) und F-19 (Art. 4 Abs. 3 ohne Verwaltungspauschale); F-20 nur Dokumentation.

### 4. Zitierweise (Mietrecht)

| Sprache | App | Fedlex | Ergebnis |
|---|---|---|---|
| de | Hilfetext «Art. 257a Absatz 2 OR»; KI «Art. 257a Abs. 1 OR» | VMWG: «(Art. 257b Abs. 1 OR)» | «Abs.» ist Fedlex-Stil; Hilfetext uneinheitlich (F-17, Nit) |
| fr | «art. 257a al. 1 CO», «art. 257a al. 2 CO» | OBLF fr: «(art. 257b, al. 1, CO)», «(art. 269a, let. a, CO)» | Fedlex mit Kommas; ohne Kommas ist Gerichtsstil und verständlich (F-17, Nit) |
| it | «art. 257a cpv. 1 CO», «cpv. 2 CO» | OLAL it: «(art. 257b cpv. 1 CO)» | bestätigt |
| en | «Art. 257a para. 1 CO», «para. 2 CO» | OR en (Fedlex, Stand 1.1.2026): «Art. 257f para. 3 and 4», Abkürzung CO | bestätigt (englische Fassung ohne Rechtskraft) |

Inhaltlich: Stub-Begründungen fr/it/en geben die deutschen Aussagen richtig wieder. Begriff «Wartung» in fr/en siehe F-16.

### 5. Status der Befunde aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| F-1 | behoben | `UBIQUITOUS_LANGUAGE.md:76,80`: beide Kategorien unter «Nicht umlagefähig» (einmalige Erlaubnis des Product Owners, Issue-Kommentar 2026-10-14) |
| F-2 | offen, als #180 Open Work | Glossar Z. 181 unverändert; `LEGAL_BASIS` übernimmt die Zusammenfassung nicht (geprüft) |
| F-3 | behoben | `llm.ts:47-72`, Wortlaut gegen Fedlex geprüft; Fernwärme und ZEV in `llm-eval.ts:17-18`; Restpunkte F-18, F-20 |
| F-4 | behoben | `categories.feature`: Übersteuern mit «Fassadenreinigung» Richtung «nicht umlagefähig» |
| F-5 | behoben | `messages/*.json:1087` nennt Art. 257a Abs. 2 OR in allen vier Sprachen |
| F-6 | behoben | Szenario «Ohne sichere Antwort der KI …» (Stub «Bewachung», Konfidenz 0.5); `category-allocability.pg.test.ts:66-88` (0.7 ja, 0.69 nein, nicht erreichbar, unbrauchbar) |
| F-7 | offen, als Kommentar zu #75 | «Umlagefähigkeit», «Vorschlag der KI» weiter nicht im Glossar; «Umlagefähigkeit» steht bereits vorbestehend in `invoices_allocability` |
| F-8 | behoben | `llm-stub.ts:19,37` mit Absatz; Prompt «Zitiere Artikel mit Absatz» |
| F-9 | behoben | `0002_stammdaten.sql:17-18` |
| F-10 | behoben | `0002_stammdaten.sql:37-39`, Block «not allowed», Zusatz «(trägt der Vermieter)» |
| F-11 | behoben im Gegenstand | `de.json:1087` «Gebäudeversicherung». Vorbestehend und ausserhalb des Gegenstands gleich absolut: `de.json:731` «(z. B. Reparaturen, Versicherungen)», `de.json:768` «Reparaturen, Versicherungen, Steuern» (und fr/it/en): als Open Work aufnehmen |

## Befunde

### F-12 (Major, Rechtstexte): Kategorien gehen bei jeder Rechnung an den Anbieter

- Beleg: `backend/src/services/llm.service.ts:21-25` `buildCategorizationPrompt(invoice, (await listCategories({ limit: 1000 })).categories)`; `backend/src/config/llm.ts:82-90` schreibt pro Kategorie `name`, `nameDE` und `description` in den Prompt (eingeführt in `49d395e feat(invoices): legal basis and own categories`, Teil dieses Issues). Die Beschreibung ist Freitext des Liegenschaftsverwalters (z. B. «Hauswart Herr Muster, Reinigung»). Vorgeschlagener Text: «Dafür werden Rechnungssteller (auch Einzelpersonen), Beschreibung und Betrag der Rechnung übermittelt … Lassen Sie eine neue Kategorie von der KI prüfen, werden Name und Beschreibung der Kategorie übermittelt.»
- Fedlex: Art. 19 Abs. 1 DSG: «Der Verantwortliche informiert die betroffene Person angemessen über die Beschaffung von Personendaten …»; Abs. 2: «… diejenigen Informationen …, die erforderlich sind, damit sie ihre Rechte nach diesem Gesetz geltend machen kann und eine transparente Datenbearbeitung gewährleistet ist; er teilt ihr mindestens mit: … c. gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden.»
- Warum falsch: Der Text zählt die übermittelten Daten auf und erweckt den Eindruck, Kategorien gingen nur beim Klick auf «Von der KI prüfen lassen» weg. Tatsächlich geht jede Kategorie mit jeder Rechnung an den Anbieter im Ausland. Die Erklärung ist damit für diesen Datenfluss nicht transparent; zusammen mit `privacy_third_5` («Ausser den hier … genannten Diensten erhält niemand Daten») wird sie irreführend.
- Behebung: Wortlaut unter «Antworten», Frage 1 («… sowie Name und Beschreibung aller Kategorien übermittelt …»). DOM-Test zusätzlich auf «Name und Beschreibung aller Kategorien» prüfen (failing test first, Workflow 6).

### F-13 (Minor, Rechtstexte): Zweck und Namen bei der Kategorie-Prüfung

- Beleg: Vorschlag «Lassen Sie eine neue Kategorie von der KI prüfen, werden Name und Beschreibung der Kategorie übermittelt.» Art. 19 Abs. 2 DSG: «… b. den Bearbeitungszweck».
- Warum: «prüfen» sagt nicht, worauf. Für Rechnungen nennt der bestehende Satz ausdrücklich, dass ein Name in der Beschreibung mitgeht; für Kategorien fehlt das, obwohl die Beschreibung genauso Freitext ist.
- Behebung: «…, damit die KI vorschlägt, ob ihre Kosten umlagefähig sind. Steht in diesen Angaben ein Name, wird auch er übermittelt.» (ersetzt den bisherigen Halbsatz zum Namen und gilt für Rechnung und Kategorie).

### F-14 (Minor, Rechtstexte, vorbestehend): Garantie bei Übermittlung ins Ausland

- Beleg: `privacy_llm_external` nennt Anbieter und Land, nichts zur Grundlage. `llm.ts:13-15` kennt nur `LLM_PROVIDER` und `LLM_PROVIDER_COUNTRY`.
- Fedlex: Art. 19 Abs. 4 DSG: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.» DSV Anhang 1 (Stand 1.12.2025), Ziff. 44 «Vereinigte Staaten***»: «Für Personendaten, die von Organisationen bearbeitet werden, die gemäss den Grundsätzen des Datenschutzrahmens zwischen der Schweiz und den USA zertifiziert sind, gilt ein angemessenes Schutzniveau als gewährleistet …».
- Warum: Bei einem nicht zertifizierten US-Anbieter oder einem Staat ohne Angemessenheitsentscheid muss die Erklärung die Garantie (z. B. Standarddatenschutzklauseln, Art. 16 Abs. 2 lit. d) nennen. Die App kann das heute nicht ausdrücken. Bestand schon vor #176 (gleicher Text für Rechnungen); die Änderung erweitert nur die übermittelten Daten.
- Behebung (Open Work, Issue `fachlich`, `entscheiden`): Konfiguration `LLM_PROVIDER_SAFEGUARD` (Freitext) und Satz «Die Übermittlung stützt sich auf {safeguard}.»; ohne Angabe Start verweigern wie bei fehlendem Anbieter, ausser das Land steht in DSV Anhang 1.

### F-15 (Nit, Rechtstexte, vorbestehend): Lokaler Text bei abgeschalteter KI

- Beleg: `llm.ts:35-37` `if (!config.enabled || …) return null;` → `src/routes/privacy/+page.svelte:11-13` zeigt `privacy_llm_local`.
- Warum: Die Erklärung behauptet eine Bearbeitung, die nicht stattfindet; harmlos (zu viel statt zu wenig), aber unrichtig. Der neue lokale Satz nennt zusätzlich die Kategorie-Prüfung.
- Behebung (Open Work): bei `enabled=false` eigener Satz, z. B. «Rechnungen und Kategorien werden nicht von einem Sprachmodell bearbeitet.»

### F-16 (Minor, Mietrecht): «entretien» / «maintenance» statt «Wartung»

- Beleg: `fr.json:1087` «pour l’ascenseur et la conciergerie, seuls l’exploitation et l’entretien comptent»; `en.json:1087` «only operation and maintenance count».
- Fedlex fr: Art. 256 al. 1 CO «Le bailleur est tenu de délivrer la chose … et de l’entretenir en cet état.»; Art. 5 al. 2 let. g OBLF «la maintenance». Fedlex en: Art. 256 para. 1 CO «… and to maintain it in that condition.»
- Warum: Im Gesetzestext ist «entretien» (fr) bzw. «maintain» (en) die Erhaltungspflicht des Vermieters, also das Nicht-Umlagefähige. Der Satz sagt so auf Französisch das Gegenteil des deutschen. it «manutenzione» entspricht Art. 5 cpv. 2 lett. g OLAL und ist richtig.
- Gleiches Wort, gegenteilige Bedeutung auf demselben Bildschirm: Die Stub-Begründung fr (`llm-stub.ts:20`) verwendet «L’entretien et la rénovation du bâtiment» richtig für das Nicht-Umlagefähige; it (`llm-stub.ts:21`) «La manutenzione e il rinnovo dell’edificio» ebenfalls für das Nicht-Umlagefähige, während der it-Hilfetext «manutenzione» für die umlagefähige Wartung braucht.
- Behebung: fr Hilfetext «seuls l’exploitation et la maintenance comptent»; en «only operation and servicing count»; it Stub «Il mantenimento e il rinnovo dell’edificio non sono legati al suo uso (art. 257a cpv. 1 CO).» Hilfetext it bleibt (Wortlaut von Art. 256 cpv. 1 CO it nicht geprüft, siehe «Nicht bestätigt»). Die Begriffe in `docs/design/i18n-begriffe.md` ergänzen.

### F-17 (Nit, Mietrecht): Zitierweise

- Beleg und Fedlex: siehe Tabelle unter Frage 4.
- Behebung: de Hilfetext «(Art. 257a Abs. 2 OR)», wie die KI-Begründung und Fedlex. fr nach Fedlex «art. 257a, al. 2, CO» (Hilfetext und Stub); wer den Gerichtsstil ohne Kommas will, bleibt einheitlich dabei. Szenario prüft nur «Art. 257a», bleibt stabil.

### F-18 (Minor, Mietrecht): Anweisung zum Zitieren widerspricht der Rechtsgrundlage

- Beleg: `llm.ts:72` «Art. 5 und 6 VMWG gelten nur für Heizungs- und Warmwasserkosten; für andere Kosten begründe mit Art. 257a Abs. 1 oder Art. 257b Abs. 1 OR.»
- Warum: Für Gebäudeversicherung und Liegenschaftssteuer trägt Art. 256b OR («Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»), für Reparaturen und Dach Art. 256 Abs. 1 OR, für ZEV-Strom Art. 6b VMWG (kein Heizungs-/Warmwasserartikel). Die Anweisung verbietet der KI gerade diese Zitate; sie muss den Ausschluss dann mit Art. 257a Abs. 1 umschreiben oder zitiert ZEV unter 257b. Mein Vorschlag aus Runde 1 (F-3) war zu eng, als die Basis noch ohne 256/256b/6a–6c gedacht war.
- Behebung: «Art. 5 und 6 VMWG gelten nur für Heizungs- und Warmwasserkosten. Zitiere den Artikel aus der Rechtsgrundlage, der deine Antwort trägt, mit Absatz.» Test in `llm-prompt.test.ts` auf den neuen Satz.

### F-19 (Minor, Verwalter): Art. 4 Abs. 3 VMWG und die Verwaltungspauschale

- Beleg: `llm.ts:53` zitiert «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen … angerechnet werden.»; Glossar Z. 80: «Der Verwaltungsaufwand für die Nebenkosten wird nicht als Rechnung, sondern über die **Verwaltungspauschale** abgerechnet.»; Z. 133 Verwaltungspauschale (Art. 4 Abs. 3 VMWG). `llm-eval.ts` prüft nur «Gebühren für die Verwaltungsapp».
- Warum: Erfasst der Liegenschaftsverwalter eine Kategorie «Honorar Nebenkostenabrechnung», schlägt die KI mit Art. 4 Abs. 3 VMWG zu Recht «umlagefähig» vor. In Dwello führt das, zusammen mit der Verwaltungspauschale im Abrechnungslauf, zur doppelten Verrechnung desselben Aufwands.
- Behebung: Im `ALLOCABILITY_PROMPT` (nicht in `LEGAL_BASIS`, gilt nur für neue Kategorien): «Den Aufwand für die Erstellung der Nebenkostenabrechnung (Art. 4 Abs. 3 VMWG) rechnet Dwello über die Verwaltungspauschale ab; eine Kategorie dafür ist nicht umlagefähig.» Testfall `['Honorar für die Nebenkostenabrechnung', false]` in `llm-eval.ts`.

### F-20 (Nit, Mietrecht): Auswahl dokumentieren

- Beleg: `docs/nebenkostenabrechnung-anforderungen.md:29` «zitiert … Art. 4–6c VMWG wörtlich nach Fedlex»; Issue #176, Entscheid «Art. 4–6c VMWG». `LEGAL_BASIS` zitiert Art. 4 Abs. 3, 5 Abs. 1–2, 6, 6a, 6b, 6c Abs. 3.
- Warum: Die Auswahl ist fachlich richtig (Frage 3), aber Doku und Entscheid beschreiben mehr, als der Prompt enthält.
- Behebung: Doku-Zeile auf die tatsächlichen Absätze ändern und im Issue als Umsetzungsnotiz festhalten («Art. 4 Abs. 1–2, 5 Abs. 3, 6c Abs. 1–2 und 4–6 weggelassen: Höhe oder Ablauf, nicht Umlagefähigkeit; 6c Abs. 2 könnte zu Fehleinstufung von Renovationen führen»).

## Fehlende Begriffe

Keine neuen. «Umlagefähigkeit» und «Vorschlag der KI» bleiben offen (F-7, Kommentar zu #75). Der vorgeschlagene Datenschutztext verwendet nur Glossarwörter (Kategorie, umlagefähig, Rechnungssteller, KI).

## Gesetzestexte (Fedlex, wörtlich)

Abgerufen am 2026-10-15 über den Fedlex-SPARQL-Endpunkt und den Filestore (HTML). Absatznummern als vorangestellte Ziffer.

- **DSG, SR 235.1, Stand am 7. Juli 2025** (neueste Fassung laut SPARQL), https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2022/491/20250707/de/html/fedlex-data-admin-ch-eli-cc-2022-491-20250707-de-html-1.html
  - Art. 19 Abs. 1, 2 lit. b–c und 4: zitiert unter F-12, F-13, F-14.
  - Art. 16 Abs. 1: «Personendaten dürfen ins Ausland bekanntgegeben werden, wenn der Bundesrat festgestellt hat, dass die Gesetzgebung des betreffenden Staates oder das internationale Organ einen angemessenen Schutz gewährleistet.»
  - Art. 16 Abs. 2 lit. d: «Standarddatenschutzklauseln, die der EDÖB vorgängig genehmigt, ausgestellt oder anerkannt hat; oder»
- **DSV, SR 235.11, Stand am 1. Dezember 2025**, Anhang 1 Ziff. 44, https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2022/568/20251201/de/html/fedlex-data-admin-ch-eli-cc-2022-568-20251201-de-html-2.html (Wortlaut unter F-14).
- **OR, SR 220, Stand am 1. Oktober 2026** (de wie Runde 1; fr https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20261001/fr/html/fedlex-data-admin-ch-eli-cc-27-317_321_377-20261001-fr-html-3.html): Art. 256 al. 1 und Art. 257a fr unter F-16. en (Stand 1.1.2026, «English is not an official language of the Swiss Confederation. This translation is provided for information purposes only and has no legal force.»): Art. 256 para. 1 «… and to maintain it in that condition.»
- **VMWG, SR 221.213.11, Stand am 1. Oktober 2025**: de wie Runde 1, zusätzlich Art. 5 Abs. 3, Art. 6c Abs. 1–6 (Wortlaut in `scratchpad/fedlex/vmwg.txt:118-138`). fr/it: https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1990/835_835_835/20251001/fr/html/fedlex-data-admin-ch-eli-cc-1990-835_835_835-20251001-fr-html.html und …/it/html/…-it-html.html; Art. 5 al. 2 let. g fr «la maintenance», it «la manutenzione»; Sachüberschrift fr «(art. 257b, al. 1, CO)», it «(art. 257b cpv. 1 CO)».

## Nicht bestätigt

- **Regenwasser-/Meteorabwassergebühr:** nur Merkblatt Mieterverband (S. 2, «Unzulässige Abwasserkosten»). Keine Fedlex-Norm nennt sie; der Ausschluss folgt allenfalls aus Art. 257b Abs. 1 OR («aus dem Gebrauch der Sache») als Auslegung. `mmx search "Meteorwassergebühr Nebenkosten Mieter überwälzen zulässig Schweiz"` brachte keine Vermieter- oder Gerichtsquelle (nur Ratgeber, Merkblatt). Der Product Owner hat den Ausschluss für den Seed bereits entschieden; der Hilfetext folgt diesem Entscheid.
- **Swiss-US Data Privacy Framework:** ob ein konkreter Anbieter zertifiziert ist, hängt von der Installation ab; nicht prüfbar.
- **DOM-Tests `privacy-page.dom.test.ts`:** liegen nur im Arbeitsbaum des Aufrufers (nicht im geprüften Commit), nicht gelesen; die erwarteten Teilstrings aus dem Auftrag übernommen.
- **Englische VMWG:** Fedlex führt keine englische Fassung (SPARQL ohne Treffer); «servicing» für «Wartung» ist daher nicht fedlex-belegt, nur die Mehrdeutigkeit von «maintain» in Art. 256 CO en.
- **fr Zitierweise ohne Kommas:** als Gerichtsstil verbreitet (Bundesgericht), nicht auf Fedlex nachgeschlagen; Fedlex-Erlasse verwenden Kommas (belegt).
- **Art. 256 CO it:** italienische Fassung nicht abgerufen; der Vorschlag «mantenimento» für den Stub ist sprachlich, nicht fedlex-belegt.
- **Rolle des KI-Anbieters als Auftragsbearbeiter (Art. 9 DSG)** und Verantwortlicher (Betreiber vs. Liegenschaftsverwalter): nicht Gegenstand, nicht geprüft.
