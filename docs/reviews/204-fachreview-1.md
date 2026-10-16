# Fachreview #204 / #220, Runde 1: Beschreibungen vordefinierter Kategorien

Gegenstand: Commit `b06e4d4` (Worktree `review-204-fach`), `git diff HEAD~1 HEAD`: vorgeschlagene Beschreibungen in `backend/src/__tests__/migrations.pg.test.ts:86-95` und `backend/src/__tests__/invoice-categorization.pg.test.ts:221-240`, KI-Eval-Fälle in `backend/scripts/llm-eval.ts:33-34, 52-54`; der Gartenpflege-Text aus dem Auftrag.

Quellen: Fedlex VMWG SR 221.213.11, Stand 1.10.2025 (Filestore-HTML `…/eli/cc/1990/835_835_835/20251001/de/html/…`), OR SR 220, Stand 1.10.2026 (`…/eli/cc/27/317_321_377/20261001/de/html/…`); Mieterverband, Merkblatt «Zulässige und unzulässige Nebenkosten» 2026 (`mieterverband.ch/upd_fm_media/2026_merkblatt_unzulaessige_nebenkosten.pdf`); `UBIQUITOUS_LANGUAGE.md`; `messages/de.json:1183-1204`; `docs/reviews/202-fachreview-2.md` (V-4, M-3).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Gartenpflege «ohne … Geräte» schliesst auch zulässige Gerätekosten aus (Benzin für Rasenmäher, Maschineneinsatz des Gärtners); gemeint ist die Anschaffung |
| V-2 | Verwalter | Minor | Heizung nennt Wartung, Verzinsung/Abschreibung sowie die Heizungsversicherung und -verwaltung nicht, auf die Gebäudeversicherung und Verwaltung jetzt verweisen |
| V-3 | Verwalter | Minor | Verwaltung: «Verwaltung der Heizung» deckt auch die Erstellung der Heizkostenabrechnung, die schon die Verwaltungspauschale abgilt (Doppelverrechnung) |
| V-4 | Verwalter | Minor | Eval-Fall «Anschluss ans Kabelnetz» ist mehrdeutig (klingt wie die umlagefähige Kategorie «TV/Kabelanschluss»); erwartetes `false` nicht eindeutig |
| V-5 | Verwalter | Minor | Kein Test pinnt den neuen Gartenpflege-Text (die Gartenpflege-Zeile prüft nur, dass ein geänderter Text bleibt) |
| M-1 | Mietrecht | Minor (Entscheid PO) | Kehricht (#220): die wertabhängige Grundgebühr fehlt als Ausschluss, obwohl Grund und Hilfetext sie nennen; Grümpel nur über das Wort «Räumungen» |
| M-2 | Mietrecht | Minor | Grund «Gebäudeversicherung» (`categories_reason_building_insurance`) nennt die Ausnahme für die Heizungsanlage nicht, die die neue Beschreibung jetzt nennt |
| V-6 | Verwalter | Nit | «(Heizung)» in Gebäudeversicherung/Verwaltung: knapp und in «Verwaltung der Heizung (Heizung)» doppelt; Bezug zur Kategorie unklar |
| M-3 | Mietrecht | Nit | Ausnahme in Art. 5 VMWG gilt auch für die zentrale Warmwasseraufbereitung; Verwaltung nennt nur die Heizung |
| V-7 | Verwalter | Nit | Eval: Gegenfälle fehlen (wertabhängige Kehrichtgrundgebühr `false`, Benzin für Rasenmäher `true`, Rasensanierung `false`) |
| V-8 | Verwalter | Nit (bestehend) | Warmwasser und Schneeräumung bleiben ohne «ohne …»-Klausel |

Kein Blocker, kein Major.

## Befunde

### V-1 (Minor): Gartenpflege «ohne … Geräte»

**Beleg.** Vorschlag: «Rasenmähen, Rückschnitt, Laub- und Unkrautentfernung; ohne Neubepflanzung, Baumfällung, Rasensanierung und Geräte». Merkblatt S. 3, «Gartenpflege – Zulässig sind Kosten für: − Periodischer Rückschnitt von Sträuchern − Rasenmähen, Bewässern bei Trockenheit − Laubentfernung − Unkrautentfernung − Benzin für Rasenmäher, Unkrautvertilger»; «Unzulässige Gartenpflegekosten: − Anschaffungskosten für Werkzeuge und Maschinen − Sanierung von Rasen, etc. − Schädlingsbekämpfung − Neubepflanzung oder Fällen von Bäumen − Neubepflanzungen − Sand im Sandkasten». Grund `categories_reason_garden` (`messages/de.json:1191`): «… Neubepflanzungen und Anschaffungen nicht.»; Schneeräumung `:1192`: «die Anschaffung von Geräten nicht».

**Warum falsch.** Unzulässig ist nur die *Anschaffung* von Geräten. «ohne … Geräte» liest die KI (und der Vermieter) auch als Ausschluss von Benzin, Unterhalt eines Mähers oder dem Maschinenzuschlag auf der Gärtnerrechnung, die das Merkblatt zulässt. Ausserdem fällt «Umgebung» weg, die der alte Text und der Grund («laufende Pflege der Umgebung») nennen.

**Behebung.** «Laufende Pflege von Garten und Umgebung: Rasenmähen, Rückschnitt von Sträuchern, Laub- und Unkrautentfernung; ohne Neubepflanzung, Baumfällung, Rasensanierung und Anschaffung von Geräten»

### V-2 (Minor): Heizung ohne Wartung, Verzinsung/Abschreibung und ohne Ziel der neuen Verweise

**Beleg.** Vorschlag `migrations.pg.test.ts:88`: «Brennstoff, Energie und Betrieb der Heizung; ohne Reparatur und Erneuerung der Anlage». Fedlex VMWG Art. 5 Abs. 2: «Darunter fallen insbesondere die Aufwendungen für: … g. die Wartung; h. die Versicherungsprämien, soweit sie sich ausschliesslich auf die Heizungsanlage beziehen; i. die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt.» Art. 6: «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.» Grund `messages/de.json:1184`: «Brennstoff, Energie, Wartung und Betrieb der Heizung sind anrechenbar (Art. 5 VMWG); Reparatur, Erneuerung, Verzinsung und Abschreibung der Anlage nicht (Art. 6 VMWG).» Hilfetext `:1183`: «bei Heizung und Lift zählen nur Betrieb und Wartung der Anlage».

**Warum.** (a) Die Beschreibung steht auf der Bearbeitungsseite direkt beim Grund und weicht ohne Not davon ab (Wartung, Art. 6 Bst. b fehlen). (b) Gebäudeversicherung und Verwaltung schicken Heizungsversicherung und Heizungsverwaltung neu «(Heizung)», die Heizung selbst nennt sie aber nicht; im Kategorisierungs-Prompt fehlt der KI damit die Gegenseite des Verweises (eine Rechnung «Prämie Öltankversicherung» hat bei «Heating» kein Stichwort). (c) Eval-Fall «Amortisation der Heizungsanlage» `false` (`llm-eval.ts:41`) stützt sich nur auf die Rechtsgrundlage, nicht auf die Beschreibung.

**Behebung.** «Brennstoff, Energie, Wartung und Betrieb der Heizung, auch Versicherung nur der Heizungsanlage und Verwaltungsarbeit für den Heizbetrieb; ohne Reparatur, Erneuerung, Verzinsung und Abschreibung der Anlage»
(Folge geprüft: `is_heating_cost = true` verteilt diese Kosten mit Heizschlüssel und Heizprofil; das passt, weil Art. 5 VMWG sie als Heizungskosten anrechnet.)

### V-3 (Minor): Verwaltung der Heizung und Verwaltungspauschale überschneiden sich

**Beleg.** Vorschlag `migrations.pg.test.ts:94`: «Allgemeine Verwaltungskosten; ohne Verwaltung der Heizung (Heizung) und Verwaltungspauschale». Fedlex VMWG Art. 5 Abs. 2 Bst. i: «die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt»; Art. 4 Abs. 3: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.» Merkblatt S. 4: «Für den Betrieb der Heizungsanlage und die Warmwasseraufbereitung können sämtliche Verwaltungskosten in Rechnung gestellt werden, also z.B. auch das Bestellen der Heizenergie oder für die Kaminreinigung.» Glossar `UBIQUITOUS_LANGUAGE.md:154`: Verwaltungspauschale = «ein Prozentsatz der eigenen Nebenkosten», also auch auf den Heizkosten.

**Warum.** «Verwaltung der Heizung» liest ein Verwalter auch als Honorar für die Heizkostenabrechnung. Bucht der Vermieter ein solches Honorar unter Heizung und rechnet Dwello zusätzlich die Verwaltungspauschale auf denselben Heizkosten, bezahlt der Mieter die Erstellung der Abrechnung doppelt. Bst. i meint den *Betrieb* (Brennstoff bestellen, Kaminfeger aufbieten). Der Grund `:1200` sagt richtig «Verwaltungsarbeit für den Heizbetrieb».

**Behebung.** «Allgemeine Verwaltungskosten; ohne Verwaltungsarbeit für den Heizbetrieb, z. B. Brennstoff bestellen (gehört zur Heizung), und ohne Verwaltungspauschale». Eval-Fall `llm-eval.ts:34` «Verwaltung des Heizbetriebs» `true` ist richtig (Bst. i), sinnvoll ergänzt um «Honorar für die Heizkostenabrechnung» `false` (Art. 4 Abs. 3, über die Verwaltungspauschale), wie schon «Honorar für die Nebenkostenabrechnung».

### V-4 (Minor): Eval-Fall «Anschluss ans Kabelnetz» mehrdeutig

**Beleg.** `llm-eval.ts:54` `['Anschluss ans Kabelnetz', false]`; der Fall wird als Name einer neuen Kategorie geprüft (`proposeAllocability({ name })`, `:61`). Die vordefinierte umlagefähige Kategorie heisst «TV/Kabelanschluss» (`0002_stammdaten.sql:25`). Merkblatt S. 3: «Zulässig sind Kosten für: − Grundnutzungsgebühren von UPC oder anderen Kabelnetzbetreibern»; «Unzulässige TV Gebühren: − Installationsgebühren für Anschluss ans Netz − Versiegelungs- und Plombierungskosten».

**Warum.** Als Kategoriename (ohne Rechnungsbetrag) bezeichnet «Anschluss ans Kabelnetz» ebenso gut den laufenden Anschluss wie dessen Installation. Ein Modell, das `true` antwortet, ist nicht falsch; die Trefferquote misst dann Zufall.

**Behebung.** `['Installation des Kabelanschlusses', false]` (Wortlaut der Beschreibung aus #220). Im pg-Test (`invoice-categorization.pg.test.ts:226`) darf die Rechnung bleiben; dort wird nur der Prompt geprüft.

### V-5 (Minor): Gartenpflege-Text ungepinnt

**Beleg.** `migrations.pg.test.ts:79, 90`: die Gartenpflege-Zeile wird vor der Migration geändert und muss «Unser Gärtner Huber» bleiben. Kein anderer Test nennt den neuen Gartenpflege-Text; `invoice-categorization.pg.test.ts:231-236` prüft nur TV/Kabelanschluss und Kehricht.

**Warum.** Der Wortlaut von Gartenpflege (#204, Done means: «wording checked by fach-reviewer») kann in der Migration abweichen, ohne dass ein Test rot wird. Der Test zeigt auch nicht, dass eine *unveränderte* Gartenpflege-Zeile den neuen Text erhält.

**Behebung.** Den Prompt-Test (`invoice-categorization.pg.test.ts`) um die Zeile `- Garden Maintenance (Gartenpflege): <Text aus V-1>\n` ergänzen, so dass jeder neue Text einmal gepinnt ist (Heizung, Gebäudeversicherung, Verwaltung zeigt bereits der Migrationstest).

### M-1 (Minor, Entscheid Produktverantwortlicher): Kehricht

**Beleg.** Entschieden in #220: «Kehrichtgebühren und Grünabfuhr; ohne Räumungen, die der Vermieter bestellt». Merkblatt S. 2: «Zulässige Kehrichtkosten: − Jährliche Kehrichtgrundgebühr – sofern die Gebühr vom Verbrauch abhängig ist … − Grünabfuhr (teils umstritten)»; «Unzulässige Kehrichtkosten: − Kosten für von der Vermieterschaft organisierte Entsorgungen von Grümpel, etc. − Grundgebühren, die unabhängig vom Verbrauch anfallen und an den Wert der Liegenschaft gekoppelt sind.» Grund `messages/de.json:1193`: «… Grundgebühren, die vom Wert der Liegenschaft abhängen, und Räumungen, die der Vermieter bestellt, nicht.»; Hilfetext `:1183`: «Bei Wasser, Abwasser und Kehricht zählen Grundgebühren nicht, die vom Wert der Liegenschaft abhängen». Vorschlag V-4 aus #202: «… ohne Grümpelentsorgung und Grundgebühren, die vom Wert der Liegenschaft abhängen».

**Prüfung des Auftrags (Grümpelentsorgung, Punkt aus #204).** Gedeckt: «Räumungen, die der Vermieter bestellt» entspricht inhaltlich «von der Vermieterschaft organisierte Entsorgungen von Grümpel» und stimmt wörtlich mit dem Grund überein. Die Eval-Fälle «Entsorgung von Grümpel» und «Räumung des Estrichs» (`llm-eval.ts:51-52`, je `false`) prüfen beide Lesarten. Schwäche: Das Wort «Grümpel» fehlt; eine Rechnung «Entsorgung Sperrgut» trifft die KI über «Räumung» weniger sicher.

**Warum trotzdem ein Befund.** «Kehrichtgebühren» ohne Einschränkung umfasst auch die wertabhängige Grundgebühr, die Grund, Hilfetext, Merkblatt und die Beschreibungen von Kaltwasser und Abwasser ausschliessen. Beschreibung und Grund stehen auf derselben Seite und sagen damit Verschiedenes. Weil #220 den Text entschieden hat, nicht ohne den Produktverantwortlichen ändern.

**Vorschlag an den Produktverantwortlichen.** «Kehrichtgebühren nach Gebrauch und Grünabfuhr; ohne Grümpelräumungen, die der Vermieter bestellt, und Grundgebühren, die vom Wert der Liegenschaft abhängen». Bis zum Entscheid: unter «Blocked on me» bzw. als Kommentar in #220; die Umsetzung von #204 hängt nicht daran.

### M-2 (Minor): Grund der Gebäudeversicherung ohne Heizungsausnahme

**Beleg.** Neue Beschreibung `migrations.pg.test.ts:93`: «… ohne Prämien, die nur die Heizungsanlage betreffen (Heizung)». Grund `messages/de.json:1197`: «Die Prämien gehören zu den Lasten der Liegenschaft, die der Vermieter trägt (Art. 256b OR).» Zum Vergleich Verwaltung `:1200`: «… Verwaltungsarbeit für den Heizbetrieb gehört zur Heizung (Art. 5 Absatz 2 VMWG).» Fedlex OR Art. 256b: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.» VMWG Art. 5 Abs. 2 Bst. h (oben). Merkblatt S. 4: «Zulässig sind Versicherungen für: − Heizungsanlage»; «Unzulässige Versicherungskosten: − Gebäudeversicherung etc.»

**Warum.** Der Grund ist nicht falsch, aber er nennt die Ausnahme nicht, die die Beschreibung darüber neu einführt; bei der Verwaltung tut er es. Der Vermieter sieht eine Ausnahme ohne Rechtsgrundlage.

**Behebung.** Den Grund in allen vier Sprachen ergänzen (gehört in die Umsetzung von #221, die alle Gründe ohnehin anfasst): «Die Prämien gehören zu den Lasten der Liegenschaft, die der Vermieter trägt (Art. 256b OR); Prämien, die nur die Heizungsanlage versichern, gehören zur Heizung (Art. 5 Absatz 2 Bst. h VMWG).» Wird es nicht hier erledigt: Punkt in #221 bzw. dessen Umsetzungs-Issue aufnehmen.

### V-6 (Nit): «(Heizung)» als Verweis

**Beleg.** `migrations.pg.test.ts:93-94`. In «ohne Verwaltung der Heizung (Heizung) und Verwaltungspauschale» steht Heizung doppelt, und die Klammer kann auch auf «und Verwaltungspauschale» bezogen werden.

**Behebung.** «(gehört zur Heizung)» statt «(Heizung)»:
- Gebäudeversicherung: «Prämien der Gebäudeversicherung; ohne Prämien, die nur die Heizungsanlage versichern (gehören zur Heizung)»
- Verwaltung: siehe V-3.
Im Prompt bleibt die Kategorie erkennbar (`- Heating (Heizung): …`, `llm.ts` `categoryLines`).

### M-3 (Nit): Warmwasser bei der Verwaltungsausnahme

**Beleg.** Fedlex VMWG Art. 5 Abs. 1: «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.» Merkblatt S. 4 (oben): «Für den Betrieb der Heizungsanlage und die Warmwasseraufbereitung können sämtliche Verwaltungskosten …». Bst. h und i nennen wörtlich nur die Heizungsanlage.

**Warum.** Für die Versicherung folgt der Vorschlag dem Wortlaut von Bst. h; für die Verwaltung des Warmwasserbetriebs stützt Abs. 1 und das Merkblatt die Umlage auch. Selten relevant (Warmwasser meist mit der Heizung erzeugt), darum Nit.

**Behebung (optional).** Verwaltung: «… ohne Verwaltungsarbeit für den Betrieb von Heizung und Warmwasser (gehört zur Heizung bzw. zum Warmwasser) und ohne Verwaltungspauschale». Ohne Änderung bleibt der Text richtig, nur unvollständig.

### V-7 (Nit): Fehlende Gegenfälle im Eval

**Beleg.** `llm-eval.ts:13-56`. «Kehrichtgebühr nach Verbrauch» `true` hat kein wertabhängiges Gegenstück; die Gerätefrage (V-1) und Rasensanierung (#204: «Neubepflanzung, Baumfällung») sind nur teilweise abgedeckt.

**Behebung.** Ergänzen: `['Kehrichtgrundgebühr nach Gebäudeversicherungswert', false]`, `['Benzin für den Rasenmäher', true]`, `['Rasensanierung', false]`, `['Honorar für die Heizkostenabrechnung', false]` (V-3). Quellen je Merkblatt S. 2-4 (oben zitiert).

### V-8 (Nit, bestehend): Warmwasser und Schneeräumung ohne Ausschluss

**Beleg.** `0002_stammdaten.sql:16` Warmwasser «Kosten für die Aufbereitung von Warmwasser»; `:23` Schneeräumung «Schneeräumung und Glatteisbekämpfung». Gründe `messages/de.json:1185, 1192` nennen Reparatur/Erneuerung bzw. Anschaffung von Geräten als Ausschluss; Fedlex VMWG Art. 6 Bst. a gilt auch für Warmwasser.

**Behebung (wenn in derselben Migration gewünscht, sonst Issue `fachlich`):** Warmwasser «Energie und Betrieb der zentralen Warmwasseraufbereitung; ohne Reparatur und Erneuerung der Anlage»; Schneeräumung «Schneeräumung und Glatteisbekämpfung; ohne Anschaffung von Geräten». Nicht Teil von #204; vor dem Delta vorhanden, blockiert nicht.

## Bestätigt mit Quelle

- **TV/Kabelanschluss** (#220, `invoice-categorization.pg.test.ts:232`): «Laufende Grundgebühr des Kabelnetzes; ohne Installation des Anschlusses» deckt sich mit Merkblatt S. 3 (Grundnutzungsgebühren zulässig, «Installationsgebühren für Anschluss ans Netz» unzulässig) und wörtlich mit dem Grund `messages/de.json:1194`.
- **Heizung, Ausschluss** «ohne Reparatur und Erneuerung der Anlage»: Fedlex VMWG Art. 6 Bst. a wörtlich (oben); Einstufung umlagefähig: OR Art. 257b Abs. 1 «… wie Heizungs-, Warmwasser- und ähnliche Betriebskosten …», VMWG Art. 5 Abs. 2 Bst. a.
- **Gartenpflege, Inhalt** Rasenmähen, Rückschnitt, Laub- und Unkrautentfernung zulässig; Neubepflanzung, Baumfällung, Rasensanierung unzulässig: Merkblatt S. 3 (oben). Nur die Gerätefrage ist ein Befund (V-1).
- **Gebäudeversicherung**: nicht umlagefähig nach OR Art. 256b (oben), Merkblatt S. 4; Ausnahme nach VMWG Art. 5 Abs. 2 Bst. h; «nur» entspricht «ausschliesslich».
- **Verwaltung**: nicht umlagefähig, ausser Art. 4 Abs. 3 VMWG (Verwaltungspauschale) und Art. 5 Abs. 2 Bst. i VMWG (oben); «ohne Verwaltungspauschale» wie bisher, passend zu `UBIQUITOUS_LANGUAGE.md:95, 154`.
- **Eval-Fälle**: «Versicherung der Heizungsanlage» `true` (Bst. h; der Name sagt «ausschliesslich»), «Verwaltung des Heizbetriebs» `true` (Bst. i; Merkblatt S. 1 «Verwaltungsaufwand für Beheizung, Versicherung für Heizungsanlage» unter zulässig), «Räumung des Estrichs» `false` und «Baumfällung» `false` (Merkblatt S. 2, 3). Zu «Anschluss ans Kabelnetz» siehe V-4.
- **Begriffe**: Kategorienamen Heizung, Gartenpflege, Kehricht, TV/Kabelanschluss, Gebäudeversicherung, Verwaltung, Verwaltungspauschale wie `UBIQUITOUS_LANGUAGE.md:91, 95, 154`; «Vermieter» wie im Glossar `:95` und in den Gründen. Keine neuen Fachbegriffe; «Grünabfuhr», «Räumung», «Heizungsanlage» sind Alltagswörter bzw. Gesetzeswortlaut.
- **Unverändert-Regel**: Der Migrationstest (`migrations.pg.test.ts:70-95`) zeigt, dass eine vom Vermieter geänderte Beschreibung bleibt (#220 «A description the landlord has changed stays as it is»), und dass Lift unberührt bleibt.
- **Rechtsgrundlage im Prompt** (`llm.ts` `LEGAL_BASIS`): OR Art. 256 Abs. 1, 256b, 257b Abs. 1, VMWG Art. 4 Abs. 3, 5, 6 gegen die Fedlex-Downloads oben erneut wörtlich bestätigt.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- **Grünabfuhr als umlagefähig** (Kehricht, #220 entschieden): Merkblatt S. 2 «Grünabfuhr (teils umstritten)»; keine Fedlex-Stelle, die sie nennt. Allgemein OR Art. 257b Abs. 1 («öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben») spricht dafür, wenn die Gebühr nach Menge erhoben wird. **unsicher**; entschieden vom Produktverantwortlichen, nicht als Befund geführt.
- **Wirkung auf das Standardmodell**: `bun run llm:eval` nicht gelaufen (kein Modell im Worktree, Auftrag ohne Laufergebnis); ob die Texte die Trefferquote verbessern, zeigt erst der Lauf vor/nach der Migration.
- **Abgrenzung Abrechnungsservice (Bst. f) und Verwaltungspauschale** bei externen Heizkostenabrechnern (z. B. Ablesefirma): verbreitete Praxis, beides zu verrechnen; keine Fedlex-Stelle zur Überschneidung gefunden. Gesucht: VMWG Art. 4, 5; Merkblatt S. 1, 4. Für V-3 nur die Abgrenzung «Betrieb» vs. «Erstellung der Abrechnung» belegt.
- **Darstellung in fr/it/en**: Die Beschreibung ist nur deutsch (`categories.description`) und steht auf der Bearbeitungsseite im Feld; nicht Teil dieses Deltas, nicht geprüft.
- **Migration selbst**: noch nicht geschrieben (Schritt 1); geprüft sind nur die im Test gepinnten Texte und der Gartenpflege-Text aus dem Auftrag.
