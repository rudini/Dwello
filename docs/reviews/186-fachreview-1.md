# Fachreview #180, #185, #186, #216 – Runde 1

Gegenstand: Commit `d1cf3a0` (Worktree `review-186-fach`): `@wip`-Szenarien in `tests/e2e/features/categories.feature` (Z. 62–70, 91–102) und Entwurfstexte `draft-texts-186.md` (nicht committet, im Worktree).
Rollen: Verwalter, Mietrecht, Rechtstexte (für #216).

Quellen (Fedlex, heruntergeladen am 2026-10-15 über den SPARQL-Endpunkt, Wortlaut der HTML-Fassung):
- OR, SR 220, Stand 1. Oktober 2026 (`eli/cc/27/317_321_377/20261001`)
- VMWG, SR 221.213.11, Stand 1. Oktober 2025 (`eli/cc/1990/835_835_835/20251001`)
- DSG, SR 235.1, Stand 7. Juli 2025 (`eli/cc/2022/491/20250707`)
- DSV, SR 235.11, Stand 1. Dezember 2025 (`eli/cc/2022/568/20251201`)
- Merkblatt Mieterverband «Zulässige und unzulässige Nebenkosten» 2026, https://www.mieterverband.ch/upd_fm_media/2026_merkblatt_unzulaessige_nebenkosten.pdf/ (im Folgenden «MV-Merkblatt»)

Formeln: Der Gegenstand enthält keine Formel (keine Beträge, kein Verteilschlüssel). Nachgerechnet wurde deshalb nichts.

## Wortlaut der zitierten Normen

- **Art. 253 OR:** «Durch den Mietvertrag verpflichtet sich der Vermieter, dem Mieter eine Sache zum Gebrauch zu überlassen, und der Mieter, dem Vermieter dafür einen Mietzins zu leisten.»
- **Art. 256 Abs. 1 OR:** «Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.»
- **Art. 256b OR:** «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»
- **Art. 257 OR:** «Der Mietzins ist das Entgelt, das der Mieter dem Vermieter für die Überlassung der Sache schuldet.»
- **Art. 257a Abs. 1 OR:** «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.»
- **Art. 257a Abs. 2 OR:** «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- **Art. 257b Abs. 1 OR:** «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- **Art. 269a Bst. b OR:** Mietzinse sind in der Regel nicht missbräuchlich, wenn sie «durch Kostensteigerungen oder Mehrleistungen des Vermieters begründet sind;»
- **Art. 4 Abs. 3 VMWG:** «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»
- **Art. 5 Abs. 1 VMWG:** «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.»
- **Art. 5 Abs. 2 VMWG** (Auszug): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden; […] d. die Reinigung der Heizungsanlage und des Kamins, das Auskratzen, Ausbrennen und Einölen der Heizkessel sowie die Abfall- und Schlackenbeseitigung; […] g. die Wartung; h. die Versicherungsprämien, soweit sie sich ausschliesslich auf die Heizungsanlage beziehen; i. die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt.»
- **Art. 6 VMWG:** «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.»
- **Art. 6a, 6b, 6c Abs. 3 VMWG:** geprüft (ausgelagerte Zentrale, ZEV, Energiespar-Contracting); keine der 21 Begründungen stützt sich darauf, keine widerspricht ihnen.
- **Art. 14 Abs. 1 VMWG:** «Als Mehrleistungen im Sinne von Artikel 269a Buchstabe b OR gelten Investitionen für wertvermehrende Verbesserungen, die Vergrösserung der Mietsache sowie zusätzliche Nebenleistungen. […]»
- **Art. 16 Abs. 1 DSG:** «Personendaten dürfen ins Ausland bekanntgegeben werden, wenn der Bundesrat festgestellt hat, dass die Gesetzgebung des betreffenden Staates oder das internationale Organ einen angemessenen Schutz gewährleistet.»
- **Art. 16 Abs. 2 DSG** (Einleitung): «Liegt kein Entscheid des Bundesrates nach Absatz 1 vor, so dürfen Personendaten ins Ausland bekanntgegeben werden, wenn ein geeigneter Datenschutz gewährleistet wird durch: […] d. Standarddatenschutzklauseln, die der EDÖB vorgängig genehmigt, ausgestellt oder anerkannt hat; […]»
- **Art. 19 Abs. 2 Bst. c DSG:** «gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden.»
- **Art. 19 Abs. 4 DSG:** «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.»
- **Art. 8 Abs. 1 DSV:** «Die Staaten, Gebiete, spezifischen Sektoren in einem Staat und internationalen Organe mit einem angemessenen Datenschutz werden in Anhang 1 aufgeführt.»
- **DSV Anhang 1, Ziff. 44 «Vereinigte Staaten»:** «Für Personendaten, die von Organisationen bearbeitet werden, die gemäss den Grundsätzen des Datenschutzrahmens zwischen der Schweiz und den USA zertifiziert sind, gilt ein angemessenes Schutzniveau als gewährleistet, […]». Ziff. 7 «Kanada» ist ebenfalls nur bedingt aufgeführt («Ein angemessener Datenschutz gilt als gewährleistet, wenn das kanadische Bundesgesetz […] im privaten Bereich […]»). Die Schweiz selbst steht nicht in Anhang 1.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| H-1 | Verwalter / Mietrecht | Major | Begründung «TV/Kabelanschluss»: «Gebühr für den Anschluss» liest sich als Installationsgebühr, die unzulässig ist |
| H-2 | Rechtstexte | Major | README-Entwurf (#216) schliesst Anbieter in der Schweiz aus (die Schweiz steht nicht in DSV Anhang 1) |
| H-3 | Verwalter | Major | `backend_ki_unavailable` / Code `KI_UNAVAILABLE` gibt es schon für das Neu-Kategorisieren von Rechnungen; der neue Text würde dort «ob die Kosten umlagefähig sind» sagen |
| H-4 | Verwalter | Major | Regel «Grund nur, solange die vordefinierte Umlagefähigkeit gilt» hat kein Szenario |
| H-5 | Mietrecht | Minor | Begründung «Reparaturen»: «hängen nicht mit dem Gebrauch zusammen» trifft nicht den rechtlichen Grund; «Art. 256 OR» ohne Absatz |
| H-6 | Mietrecht | Minor | Begründung «Renovation»: Art. 256 Abs. 1 OR spricht von «erhalten», nicht von «erneuern» |
| H-7 | Mietrecht | Minor | Begründung «Verwaltung»: «nur der Aufwand für die Abrechnung» übergeht Art. 5 Abs. 2 Bst. i VMWG und die Vereinbarung; Satzbau |
| H-8 | Verwalter | Minor | Begründung «Kehricht»: «Gebühren nach Menge» enger als Praxis; Grundgebühr pro Wohnung ist zulässig |
| H-9 | Mietrecht | Minor | Begründungen «Heizung» und «Warmwasser»: Art. 6 VMWG sagt «nicht anrechenbar», nicht «hängt nicht mit dem Gebrauch zusammen»; Verzinsung/Abschreibung fehlt; bei Warmwasser fehlt Art. 6 |
| H-10 | Verwalter | Minor | KI-Hinweis «nicht erreichbar … später nochmals» auch bei ausgeschalteter KI (`LLM_ENABLED=false`): Erneut versuchen hilft nie |
| H-11 | Mietrecht | Minor | `invoices_legal_text` erscheint bei jeder nicht umlagefähigen Rechnung und nennt dann das Gesetz als Grund, auch wenn der Verwalter sie nur ausgeschlossen hat; «Steuern» zu allgemein (besteht schon auf Basis) |
| H-12 | Verwalter | Minor | Fehlende Glossarbegriffe: «vordefinierte Kategorie», «eigene Kategorie», «Grund der Umlagefähigkeit» |
| H-13 | Verwalter | Minor | Szenario «KI ist nicht erreichbar» versteckt die Vorbedingung im Kategorienamen «Ausfall» |
| H-14 | Mietrecht | Minor | Begründungen umlagefähiger Kategorien in der Liste ohne Hinweis auf Art. 257a Abs. 2 OR |
| H-15 | Mietrecht | Nit | Zitiergenauigkeit: Absätze/Buchstaben, «Absatz» vs. «Abs.», Art. 257b Abs. 1 OR bei Gebühren |
| H-16 | Verwalter | Nit | Hilfetext: Satz mit doppeltem «nicht» schwer lesbar |
| H-17 | Verwalter | Nit | Begründung «Wertvermehrende Investitionen»: Hinweis auf Mietzinserhöhung (Art. 269a Bst. b OR, Art. 14 VMWG) wäre hilfreich |
| H-18 | Rechtstexte | Nit | README-Entwurf: Art. 19 Abs. 4 DSG als Grund nennen; Bedingungen in Anhang 1 nicht nur für die USA; Art. 17 DSG |
| H-19 | Verwalter | Nit | #185: «übertragen» statt Glossarwort «umgelegt» |
| H-20 | Verwalter | Nit | Szenario «KI ist sich nicht sicher» doppelt das bestehende Szenario Z. 85–89 mit gleicher Eingabe |
| H-21 | Verwalter | Nit | Kleine Ergänzungen bei Lift, Schneeräumung, Allgemeinstrom laut MV-Merkblatt |

## Befunde

### H-1 (Major) TV/Kabelanschluss: «Gebühr für den Anschluss»

- Beleg: `draft-texts-186.md`, Zeile «TV/Cable»: «Die Gebühr für den Anschluss hängt mit dem Gebrauch zusammen.» MV-Merkblatt S. 3, «TV-Gebühren»: zulässig «Grundnutzungsgebühren von UPC oder anderen Kabelnetzbetreibern»; unzulässig «Installationsgebühren für Anschluss ans Netz», «Versiegelungs- und Plombierungskosten».
- Warum falsch: Ein unerfahrener Vermieter liest «Gebühr für den Anschluss» als die einmalige Anschluss-/Installationsrechnung des Kabelnetzbetreibers und bucht sie auf diese umlagefähige Kategorie. Genau diese Gebühr ist unzulässig (Investition, nicht Gebrauch, Art. 257a Abs. 1 OR). Die Seed-Beschreibung «Gebühren für den Kabelanschluss» (`0002_stammdaten.sql:25`) ist gleich mehrdeutig (nicht Teil dieses Gegenstands; als offene Arbeit vermerken).
- Korrektur: «Die laufende Grundgebühr des Kabelnetzes hängt mit dem Gebrauch zusammen; die Installation des Anschlusses nicht. Radio- und TV-Abgabe (Serafe) und eigene Abos bezahlt der Mieter selbst.» (Der letzte Satz ist optional, siehe MV-Merkblatt «Achtung».)

### H-2 (Major) README-Entwurf schliesst Schweizer Anbieter aus

- Beleg: `draft-texts-186.md`, #216, Entwurf: «only a provider in a country the Federal Council lists with adequate data protection (DSV Anhang 1, Art. 16 Abs. 1 DSG)». DSV Anhang 1 führt die Schweiz nicht auf (Liste Ziff. 1–44, siehe oben); Art. 16 DSG gilt nur für die Bekanntgabe «ins Ausland». Das README selbst nennt im Absatz davor einen eigenen Server mit `LLM_PROVIDER_COUNTRY=Schweiz` (`README.md:292`).
- Warum falsch: Wörtlich gelesen erlaubt die Regel keinen Anbieter in der Schweiz und keinen eigenen Server des Betreibers ausserhalb von `localhost`, obwohl dafür Art. 16 DSG gar nicht gilt. Das widerspricht dem eigenen Beispiel und dem Entscheid #184 B (Ziel: nur Garantien nach Art. 16 Abs. 2 auszuschliessen).
- Korrektur: «only a provider in Switzerland or in a country the Federal Council lists with adequate data protection (Art. 16 Abs. 1 DSG, DSV Anhang 1), within the limits noted there (in the USA only providers certified under the Swiss-U.S. Data Privacy Framework). The privacy statement names only the provider and its country (Art. 19 Abs. 4 DSG); it cannot name safeguards under Art. 16 Abs. 2 DSG (e.g. standard contractual clauses) or an exception under Art. 17 DSG, so such providers are not supported;»

### H-3 (Major) `KI_UNAVAILABLE` ist schon vergeben

- Beleg: `messages/de.json:437` `"backend_ki_unavailable": "Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert."`; `backend/src/services/invoice.service.ts:319,347` (Neu-Kategorisieren einer Rechnung antwortet mit Code `KI_UNAVAILABLE`); `src/__tests__/invoice-pages.dom.test.ts:331–339` erwartet diesen Text auf der Rechnungsseite. Der Entwurf setzt `backend_ki_unavailable` neu auf «Die KI ist nicht erreichbar. Versuchen Sie es später nochmals oder wählen Sie selbst, ob die Kosten umlagefähig sind.»
- Warum falsch: Die Rechnungsseite zeigte dann beim Neu-Kategorisieren «wählen Sie selbst, ob die Kosten umlagefähig sind», obwohl dort eine Kategorie gewählt wird; und der Fall «keine passende Kategorie geliefert» (die KI ist erreichbar) bekäme den Text «nicht erreichbar». Fachlich falsche Aussage auf einem zweiten Bildschirm.
- Korrektur: Für die Kategorie-Prüfung eigene Codes und Meldungen (z. B. `KI_PROPOSAL_UNAVAILABLE` → `backend_ki_proposal_unavailable`, `KI_PROPOSAL_UNSURE` → `backend_ki_proposal_unsure`), oder `KI_UNAVAILABLE` behalten und die Kategorieseite zeigt ihren eigenen Text. `backend_ki_unavailable` für Rechnungen unverändert lassen.

### H-4 (Major) Regel «nur solange vordefinierte Umlagefähigkeit» ohne Szenario

- Beleg: `draft-texts-186.md` #186 Punkt 1: «Shown only while the category still has its predefined allocability (a landlord who flips it no longer sees the fixed reason).» `categories.feature:62–70` prüft nur das Anzeigen bei «Feuerlöscher-Wartung», nicht das Ausblenden.
- Warum falsch: Fehlt das Ausblenden, steht neben einer auf «umlagefähig» umgestellten «Feuerlöscher-Wartung» der Satz «… hängt nicht mit dem Gebrauch zusammen» – ein Widerspruch auf demselben Bildschirm. Die Regel ist sichtbares Verhalten und braucht nach Workflow 1 ein Szenario.
- Korrektur: Szenario ergänzen, z. B.
  ```
  Szenario: Geänderte vordefinierte Kategorie nennt keinen festen Grund
    Angenommen die vordefinierte Kategorie "Schneeräumung" ist als nicht umlagefähig gespeichert
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann nennt die vordefinierte Kategorie "Schneeräumung" keinen Grund ihrer Umlagefähigkeit
  ```
  Zusätzlich ein Beispiel einer umlagefähigen vordefinierten Kategorie (z. B. «Lift», Text enthält «Reparaturen»), damit nicht nur der «nein»-Zweig geprüft ist.

### H-5 (Minor) Reparaturen

- Beleg: Entwurf «Der Vermieter muss die Liegenschaft in gebrauchstauglichem Zustand erhalten (Art. 256 OR); Reparaturen hängen nicht mit dem Gebrauch zusammen.» Art. 256 Abs. 1 OR und Art. 257 OR (Wortlaut oben); MV-Merkblatt S. 1: «Unterhalts-, Reparatur- und Verwaltungskosten muss die Vermieterschaft zwingend über­nehmen als Gegen­leistung zum Mietzins.»
- Warum falsch: Viele Reparaturen entstehen gerade durch Abnützung beim Gebrauch; ein Verwalter widerspricht dem zweiten Halbsatz. Der rechtliche Grund ist die Erhaltungspflicht, die der Mietzins abgilt. «Art. 256 OR» ohne Absatz; Abs. 2 regelt anderes.
- Korrektur: «Der Vermieter muss die Liegenschaft in gebrauchstauglichem Zustand erhalten (Art. 256 Abs. 1 OR). Reparaturen sind mit dem Mietzins abgegolten, nicht mit den Nebenkosten.»

### H-6 (Minor) Renovation

- Beleg: Entwurf «Renovationen erhalten und erneuern das Gebäude (Art. 256 OR); …». Art. 256 Abs. 1 OR nennt nur «erhalten».
- Korrektur: «Renovationen erhalten das Gebäude in gebrauchstauglichem Zustand; das ist Pflicht des Vermieters (Art. 256 Abs. 1 OR) und mit dem Mietzins abgegolten. Der wertvermehrende Teil kann eine Mietzinserhöhung begründen, nicht Nebenkosten.» (Zweiter Satz: siehe H-17; optional.)

### H-7 (Minor) Verwaltung

- Beleg: Entwurf «Die allgemeine Verwaltung ist im Mietzins enthalten; nur der Aufwand für die Abrechnung zählt, über die Verwaltungspauschale (Art. 4 Abs. 3 VMWG).» Art. 5 Abs. 2 Bst. i VMWG (Verwaltungsarbeit für den Heizbetrieb ist Heizkosten); MV-Merkblatt S. 4 «Für den Betrieb der Heizungsanlage und die Warm­wasseraufbereitung können sämtliche Verwaltungs­kosten in Rechnung gestellt werden»; Glossar `UBIQUITOUS_LANGUAGE.md:133` «Nur zulässig, wenn im Mietvertrag vereinbart.»
- Warum: «nur» ist zu absolut; die Bedingung der Vereinbarung fehlt; der Satz «zählt, über die …» ist holprig.
- Korrektur: «Die allgemeine Verwaltung ist mit dem Mietzins abgegolten. Den Aufwand für die Nebenkostenabrechnung rechnen Sie über die Verwaltungspauschale ab, wenn der Mietvertrag sie vorsieht (Art. 4 Abs. 3 VMWG); Verwaltungsarbeit für den Heizbetrieb gehört zur Heizung (Art. 5 Abs. 2 VMWG).»

### H-8 (Minor) Kehricht

- Beleg: Entwurf «Die Gebühren nach Menge hängen mit dem Gebrauch zusammen; Grundgebühren, die vom Wert der Liegenschaft abhängen, nicht.» MV-Merkblatt S. 2: zulässig «Jährliche Kehrichtgrundgebühr – sofern die Gebühr vom Verbrauch abhängig ist»; unzulässig «Kosten für von der Vermieterschaft organisierte Entsorgungen von Grümpel» und wertabhängige Grundgebühren; «Kostenverteilung pro Wohnung nach örtlicher Gebühren­ordnung ist am plausibelsten». Art. 257b Abs. 1 OR («öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»).
- Warum: «nach Menge» lässt den Vermieter glauben, eine Grundgebühr pro Wohnung oder Haushalt sei nicht umlagefähig; die Sackgebühr bezahlt der Mieter meist selbst.
- Korrektur: «Kehrichtgebühren, die sich aus dem Gebrauch ergeben (z. B. Grundgebühr pro Wohnung, Container nach Gewicht), sind umlagefähig (Art. 257b Abs. 1 OR); Grundgebühren, die vom Wert der Liegenschaft abhängen, und Räumungen, die der Vermieter bestellt, nicht.»

### H-9 (Minor) Heizung und Warmwasser

- Beleg: Entwurf Heizung «…; Reparatur und Erneuerung der Anlage nicht (Art. 6 VMWG).» liest sich als «hängt nicht mit dem Gebrauch zusammen»; Art. 6 VMWG sagt «nicht … anrechenbar» und nennt zusätzlich «Verzinsung und Abschreibung». Warmwasser nennt Art. 6 gar nicht, obwohl er auch für Warmwasser gilt.
- Korrektur Heizung: «Brennstoff, Energie, Wartung und Betrieb der Heizung sind anrechenbar (Art. 5 VMWG); Reparatur, Erneuerung, Verzinsung und Abschreibung der Anlage nicht (Art. 6 VMWG).»
- Korrektur Warmwasser: «Energie und Betrieb der zentralen Warmwasseraufbereitung sind anrechenbar (Art. 5 VMWG); Reparatur und Erneuerung der Anlage nicht (Art. 6 VMWG).»

### H-10 (Minor) KI ausgeschaltet: «später nochmals versuchen»

- Beleg: `backend/src/services/llm.service.ts:206–211` (ohne KI gibt `proposeAllocability` `null` zurück, Kommentar «no KI»); der Knopf «Von der KI prüfen lassen» erscheint unabhängig davon (`src/routes/config/categories/CategoryForm.svelte:120–128`). Entwurf `backend_ki_unavailable`: «… Versuchen Sie es später nochmals …».
- Warum: Mit `LLM_ENABLED=false` (#216) ist die KI absichtlich aus; ein erneuter Versuch hilft nie. Der Hinweis führt den Vermieter in eine Schleife.
- Korrektur: Bei ausgeschalteter KI den Knopf nicht zeigen (dann bleibt der Text richtig), oder Text ohne Versprechen: «Die KI ist nicht verfügbar. Wählen Sie selbst, ob die Kosten umlagefähig sind.» Weil #186 «no KI» ausdrücklich zu `KI_UNAVAILABLE` zählt, braucht die Wahl eventuell einen Produktentscheid (Issue `fachlich`, `entscheiden`).

### H-11 (Minor, besteht auf Basis) `invoices_legal_text`

- Beleg: `src/routes/invoices/[id]/+page.svelte:108–111` zeigt den Text bei jedem `!invoice.isValidUtilityCost`, auch wenn die Kategorie umlagefähig ist und der Verwalter die Rechnung nur ausgeschlossen hat (z. B. Lift-Reparatur in Kategorie «Lift»). Text: «Diese Kosten sind gemäss Art. 257a–257b OR nicht auf Mieter umlegbar.» Auf der Basis `1bc2a8d` gleich vorhanden. MV-Merkblatt S. 5: Mehrwertsteuer auf Drittleistungen ist überwälzbar, also nicht «Steuern» allgemein.
- Korrektur (#185 kann das mitnehmen, sonst offene Arbeit): «Diese Rechnung fliesst nicht in die Nebenkostenabrechnung ein. Typische nicht umlagefähige Kosten: Reparaturen, Gebäudeversicherung, Liegenschaftssteuer, Hypothekarzinsen (Art. 256 Abs. 1, 256b, 257a OR).»

### H-12 (Minor) Fehlende Glossarbegriffe

- Beleg: «vordefinierte Kategorie» (`categories.feature:57–70`, Entwurf), «eigene Kategorie» (`categories.feature:52`, Glossar Z. 76 nur im Fliesstext), «Grund der Umlagefähigkeit» (Target `tests/e2e/targets/categories.ts`, Entwurf) stehen nicht in `UBIQUITOUS_LANGUAGE.md`. «Grund der Änderung» (Z. 92) ist etwas anderes; Verwechslungsgefahr.
- Vorschlag (Issue mit `fachlich`, `entscheiden`):
  - **Vordefinierte Kategorie:** Mit Dwello gelieferte Kategorie mit vorgegebener Umlagefähigkeit und Grund; der Liegenschaftsverwalter kann die Umlagefähigkeit ändern, aber die Kategorie nicht löschen. `type = 'predefined'`
  - **Eigene Kategorie:** Vom Liegenschaftsverwalter erfasste Kategorie. `type = 'custom'`
  - **Grund der Umlagefähigkeit:** Fester Satz bei einer vordefinierten Kategorie, warum ihre Kosten umlagefähig sind oder nicht, mit Gesetzesartikel; entfällt, sobald der Liegenschaftsverwalter die Umlagefähigkeit ändert. Berechnung / Übersetzung

  (Ob vordefinierte Kategorien gelöscht werden können, habe ich nicht geprüft; Formulierung vor dem Eintrag anpassen.)

### H-13 (Minor) Szenario «KI ist nicht erreichbar»

- Beleg: `categories.feature:100` «… ob die Kategorie "Ausfall" umlagefähig ist»; der Stub wertet den Namen aus (`backend/scripts/llm-stub.ts:94–95`).
- Warum: Die Vorbedingung (KI fällt aus) steht nicht im Szenario, und «Ausfall» ist im Mietwesen ein Fachwort (Mietzinsausfall); Leser halten es für eine Kostenart.
- Korrektur: «Angenommen die KI ist nicht erreichbar» als eigener Schritt (der Stub darf intern weiter am Namen hängen, z. B. «KI-Ausfall-Test») und ein neutraler Kategoriename.

### H-14 (Minor) Art. 257a Abs. 2 OR in der Liste

- Beleg: Die Begründungen der 12 umlagefähigen Kategorien sagen nur «hängt mit dem Gebrauch zusammen». Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Der Hinweis steht nur im Hilfetext der Bearbeitungsseite. MV-Merkblatt S. 3 «Schneeräumung muss gesondert erwähnt werden im Mietvertrag.»
- Korrektur: Auf der Kategorienliste einmal sichtbar (nicht pro Zeile): «Der Mieter bezahlt umlagefähige Kosten nur, wenn der Mietvertrag sie als Nebenkosten nennt (Art. 257a Abs. 2 OR).»

### H-15 (Nit) Zitiergenauigkeit

- «Art. 5 VMWG» bei Kaminfeger genauer: «Art. 5 Abs. 2 Bst. d VMWG»; bei Warmwasser «Art. 5 Abs. 1 VMWG». Hilfetext «Art. 257a Absatz 2 OR», Begründungen «Art. 4 Abs. 3 VMWG»: einheitlich «Abs.». Kaltwasser, Abwasser und Kehricht können «(Art. 257b Abs. 1 OR)» tragen («öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»). Art. 256b OR hat keine Absätze, die Zitate sind korrekt.

### H-16 (Nit) Hilfetext

- Entwurf: «Bei Wasser, Abwasser und Kehricht zählen Grundgebühren, die vom Wert der Liegenschaft abhängen, nicht, beim Abwasser auch die Gebühr für Regenwasser nicht.»
- Vorschlag: «Bei Wasser, Abwasser und Kehricht zählen Grundgebühren nicht, die vom Wert der Liegenschaft abhängen; beim Abwasser auch nicht die Gebühr für Regenwasser.» Inhalt sonst bestätigt (MV-Merkblatt S. 2: Regenwasser und wertabhängige Grundgebühren unzulässig; Art. 5–6 VMWG für Heizung; Lift: «Serviceabos für reine Wartung», «Reparaturen, Ersatzteile, Erneuerungen» unzulässig).

### H-17 (Nit) Wertvermehrende Investitionen

- Entwurf ist richtig. Für Vermieter mit wenig Erfahrung hilfreich: «… und keine Nebenkosten. Sie können eine Mietzinserhöhung begründen (Art. 269a Bst. b OR, Art. 14 VMWG).» Wortlaut oben.

### H-18 (Nit) README-Entwurf, Ergänzungen

- Grund für den Ausschluss ist Art. 19 Abs. 4 DSG (Pflicht, die Garantien zu nennen), nicht Art. 16 Abs. 2 allein; im Text nennen (in H-2 enthalten).
- Anhang 1 setzt nicht nur für die USA Bedingungen (Ziff. 7 Kanada: nur privater Bereich); «within the limits noted there» deckt beides.
- Ausnahmen nach Art. 17 DSG (z. B. Einwilligung) sind ebenso nicht unterstützt, weil die Datenschutzerklärung sie nicht nennt.

### H-19 (Nit) #185 Wortwahl

- `invoices_category_not_allocable_text`: «können nicht auf Mieter übertragen werden»; Glossar Z. 71: «ob Kosten auf Mieter umgelegt werden dürfen». Vorschlag: «… können nicht auf Mieter umgelegt werden.» Der Austausch «Versicherungen» → «Gebäudeversicherung» ist richtig (MV-Merkblatt S. 5: Versicherung der Heizungsanlage ist zulässig, Art. 5 Abs. 2 Bst. h VMWG; «Versicherungen» allgemein war falsch).

### H-20 (Nit) Doppeltes Szenario

- `categories.feature:85–89` und `:91–95` lassen beide «Bewachung» prüfen. Vorschlag: die neue Erwartung als «Und» ins bestehende Szenario aufnehmen. (MV-Merkblatt S. 5 hält Bewachung für «grundsätzlich nebenkostenfähig»; als Testfall für «KI unsicher» ist das unschädlich, weil die Antwort aus dem Stub kommt.)

### H-21 (Nit) Kleine Ergänzungen laut MV-Merkblatt

- Lift: «…; Reparaturen, Ersatzteile und Serviceabos mit Reparaturen trägt der Vermieter.» (wie Seed `0002_stammdaten.sql:20`)
- Schneeräumung: «…; die Anschaffung von Geräten nicht.»
- Allgemeinstrom: unverändert möglich; optional «Strassenbeleuchtung nicht».

## Begründungen je vordefinierter Kategorie

| Kategorie | Umlagefähig (Seed) | Urteil | Korrigierte Fassung |
|---|---|---|---|
| Heizung | ja | korrigieren (H-9) | Brennstoff, Energie, Wartung und Betrieb der Heizung sind anrechenbar (Art. 5 VMWG); Reparatur, Erneuerung, Verzinsung und Abschreibung der Anlage nicht (Art. 6 VMWG). |
| Warmwasser | ja | korrigieren (H-9) | Energie und Betrieb der zentralen Warmwasseraufbereitung sind anrechenbar (Art. 5 VMWG); Reparatur und Erneuerung der Anlage nicht (Art. 6 VMWG). |
| Kaltwasser | ja | ok (optional «(Art. 257b Abs. 1 OR)», H-15) | – |
| Abwasser | ja | ok (optional Zitat, H-15) | – |
| Allgemeinstrom | ja | ok | – |
| Lift | ja | ok (optional H-21) | – |
| Hauswart | ja | ok | – |
| Gartenpflege | ja | ok | – |
| Schneeräumung | ja | ok (optional H-21) | – |
| Kehricht | ja | korrigieren (H-8) | Kehrichtgebühren, die sich aus dem Gebrauch ergeben (z. B. Grundgebühr pro Wohnung, Container nach Gewicht), sind umlagefähig (Art. 257b Abs. 1 OR); Grundgebühren, die vom Wert der Liegenschaft abhängen, und Räumungen, die der Vermieter bestellt, nicht. |
| TV/Kabelanschluss | ja | korrigieren (H-1) | Die laufende Grundgebühr des Kabelnetzes hängt mit dem Gebrauch zusammen; die Installation des Anschlusses nicht. |
| Kaminfeger | ja | ok (Zitat genauer: Art. 5 Abs. 2 Bst. d VMWG, H-15) | – |
| Reparaturen | nein | korrigieren (H-5) | Der Vermieter muss die Liegenschaft in gebrauchstauglichem Zustand erhalten (Art. 256 Abs. 1 OR). Reparaturen sind mit dem Mietzins abgegolten, nicht mit den Nebenkosten. |
| Gebäudeversicherung | nein | ok | – |
| Liegenschaftssteuer | nein | ok | – |
| Hypothekarzinsen | nein | ok (Nit: «sie ist mit dem Mietzins abgegolten» statt «im Mietzins enthalten») | – |
| Verwaltung | nein | korrigieren (H-7) | Die allgemeine Verwaltung ist mit dem Mietzins abgegolten. Den Aufwand für die Nebenkostenabrechnung rechnen Sie über die Verwaltungspauschale ab, wenn der Mietvertrag sie vorsieht (Art. 4 Abs. 3 VMWG); Verwaltungsarbeit für den Heizbetrieb gehört zur Heizung (Art. 5 Abs. 2 VMWG). |
| Renovation | nein | korrigieren (H-6) | Renovationen erhalten das Gebäude in gebrauchstauglichem Zustand; das ist Pflicht des Vermieters (Art. 256 Abs. 1 OR) und mit dem Mietzins abgegolten. |
| Wertvermehrende Investitionen | nein | ok (optional H-17) | – |
| Schädlingsbekämpfung | nein | ok (entspricht #176 und MV-Merkblatt S. 4 «Schädlingsbekämpfung» unter unzulässigen Gartenpflegekosten) | – |
| Feuerlöscher-Wartung | nein | ok (entspricht #176 und MV-Merkblatt S. 5 «Brandschutzkosten»: «ob die betreffen­de Massnahme auch nötig wäre, wenn das Gebäude leer steht») | – |

Alle Begründungen, auch die korrigierten, enthalten bei den nicht umlagefähigen Kategorien entweder «nicht mit dem Gebrauch zusammen» oder nicht. Achtung: Die Szenario-Erwartung `toContain('nicht mit dem Gebrauch zusammen')` gilt nur für «Feuerlöscher-Wartung»; deren Text bleibt unverändert, das Szenario bleibt gültig.

## Weitere Prüfpunkte (bestätigt)

- **Hilfetext `categories_allocable_help`:** Kehricht ergänzt (Entscheid #186, MV-Merkblatt S. 2); «Wartung» nur noch bei Heizung und Lift (Art. 5 Abs. 2 Bst. g VMWG; MV-Merkblatt S. 3 Lift «Serviceabos für reine Wartung und Reinigung» nach «weitverbreiteter Praxis», Serviceabos sonst «umstritten»). Art. 257a–257b OR und Art. 257a Abs. 2 OR korrekt zitiert. Nur Satzbau (H-16).
- **KI-Hinweis `KI_UNSURE`:** «Die KI ist sich nicht sicher. Wählen Sie selbst, ob die Kosten umlagefähig sind.» ok.
- **#216 Datenschutzsatz** «Rechnungen und Kategorien werden nicht von einem Sprachmodell bearbeitet.»: stimmt mit dem Code überein (`llm.service.ts:108, 137, 211`: ohne KI kein Aufruf). Ersetzt den heute falschen Satz `privacy_llm_local` («Rechnungen werden mit einem Sprachmodell kategorisiert …»), der bei `LLM_ENABLED=false` erscheint (`llm.ts:37`, `+page.svelte:11–13`). Art. 19 DSG verlangt diesen Satz nicht, er ist aber zutreffend und ok. Hinweis zur Umsetzung: `/api/v1/invoices/llm-recipient` liefert heute in beiden Fällen `null` (`llm.ts:37`); die Seite kann «aus» und «lokal» noch nicht unterscheiden.
- **#180 Glossar:** Entfernen der Zeilen «Art. 257a OR», «Art. 257b OR», «Art. 4 Abs. 3 VMWG» bestätigt; die Zeile «Art. 257b OR» war zudem inhaltlich falsch (Art. 257b Abs. 1 OR nennt Reparaturen, Erneuerungen und Steuern nicht; das folgt aus Art. 256 Abs. 1 und 256b OR). «Art. 4 Abs. 3 VMWG» doppelt die Zeile «Verwaltungspauschale» (Z. 133). Zeile «Obligationenrecht (OR)» hält im Kern; genauer (Nit): «Bundesgesetz (SR 220); regelt unter anderem die Miete (Art. 253–273c OR), die Nebenkosten in Art. 257a–257b OR.» (Art. 253 und 273c auf Fedlex vorhanden, Achter Titel «Die Miete».) «Umlagefähige Nebenkosten» und «Datenschutzgesetz (DSG)» sind Begriffe und dürfen bleiben; weitere Gesetzesparaphrasen in diesem Abschnitt gibt es nach dem Entfernen nicht.
- **Szenarien Z. 62–70:** Begriffe «Liegenschaftsverwalter», «Kategorie», «umlagefähig», «Kosten», «Gebrauch» stimmen mit dem Glossar überein (ausser H-12).

## Nicht bestätigt

- **Issue-Texte #180, #184, #185, #186, #216:** im Worktree nicht vorhanden; ich habe die Entscheide nur aus dem Auftrag und `implementation_plan.md` (Session 37) übernommen, nicht aus den Issues selbst.
- **Schwelle Konfidenz 0,7 für `KI_UNSURE`** (`llm.service.ts:216`): Produktparameter, keine Quelle in den Anforderungsdokumenten oder im Glossar (Glossar Z. 90 nennt nur 0–1); Rechnungen nutzen 0,85 (`invoice.service.ts`). Weder bestätigt noch Befund.
- **Meteorabwasser (Regenwasser) als nicht umlagefähig:** nur MV-Merkblatt S. 2 (Mieterseite); Vermieterverbände sehen das teils anders. Keine Fedlex-Norm entscheidet es ausdrücklich; Gerichtspraxis nicht geprüft. **unsicher**, aber entspricht dem geltenden Hilfetext.
- **Lift-Wartung als umlagefähig:** MV-Merkblatt S. 3 nennt sie «gemäss weitverbreiteter Praxis» zulässig, hält Liftkosten «von der Logik her» aber für keine Nebenkosten; Art. 5 VMWG nennt Wartung nur für die Heizung. **unsicher** (Praxis, nicht Gesetz).
- **Gebäudeversicherung als «Last» nach Art. 256b OR:** Wortlaut nennt Versicherungen nicht ausdrücklich; Einordnung nach MV-Merkblatt S. 5 («Unzulässige Versicherungskosten: Gebäudeversicherung») und Lehre. Die Begründung ist vertretbar; Lehre/BGE nicht nachgeschlagen.
- **Ob vordefinierte Kategorien löschbar sind** (für den Glossarvorschlag H-12): nicht geprüft.
- **Übersetzungen fr/it/en:** nicht Teil dieser Runde.
- Gesucht und gelesen: Fedlex SPARQL + Filestore (OR, VMWG, DSG, DSV), MV-Merkblatt 2026, `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md` (Thema 1–3), `backend/migrations/0002_stammdaten.sql`, `messages/de.json`, `backend/src/config/llm.ts`, `backend/src/services/llm.service.ts`, `backend/src/services/invoice.service.ts`, `backend/src/routes/categories.ts`, `src/routes/privacy/+page.svelte`, `src/routes/config/categories/CategoryForm.svelte`, `src/routes/invoices/[id]/+page.svelte`, `README.md:290–300`. `docs/anforderungen-vertragsende.md` betrifft den Gegenstand nicht (Vertragsende), nur auf Bezüge geprüft.
