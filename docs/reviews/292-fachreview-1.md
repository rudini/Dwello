# Fachreview #292, Runde 1: Gründe vordefinierter Kategorien, Vertragshinweis, KI-Hinweis, Grund auf der Rechnung

Gegenstand:
1. Entwurfstexte `draft-texts-292.md` (de, fr, it, en) mit den offenen Fragen darin.
2. `@wip`-Szenarien, Commit `9c512ef` im Worktree `review-292-fach` (`tests/e2e/features/categories.feature`, `tests/e2e/features/invoice-detail.feature`, Schritte und Fixtures).
3. Geplantes Verhalten auf der Rechnungsdetailseite (Auftrag).

Rollen: Verwalter, Mietrecht. (Rechtstexte: nicht betroffen, keine Datenschutzerklärung und keine Nutzungsbedingungen im Gegenstand.)

Quellen:
- Fedlex, über den SPARQL-Endpunkt gefunden und als HTML geladen (2026-10-17):
  - OR, SR 220, Stand 1. Oktober 2026, de/fr/it (`eli/cc/27/317_321_377/20261001`)
  - VMWG, SR 221.213.11, Stand 1. Oktober 2025, de/fr/it (`eli/cc/1990/835_835_835/20251001`); eine englische Fassung gibt es auf Fedlex nicht (SPARQL liefert keine `en/html`-Fassung).
- Mieterinnen- und Mieterverband, Merkblatt «Zulässige und unzulässige Nebenkosten» (8 Seiten, erstellt 21.01.2026), https://www.mieterverband.ch/upd_fm_media/2026_merkblatt_unzulaessige_nebenkosten.pdf/ (im Folgenden «MV-Merkblatt», Seitenzahlen nach der Fusszeile).
- `UBIQUITOUS_LANGUAGE.md`, `docs/PRD-Dwello.md` (Abschnitt «Allowed Costs», Z. 737–772), `docs/data-model.md` (`contract_categories`), `docs/nebenkostenabrechnung-anforderungen.md` (Z. 26, 101, 152), `docs/design/i18n-begriffe.md`, `docs/reviews/186-fachreview-1.md`, `docs/reviews/204-fachreview-1.md`, Issues #292 und #221.
- Code: `src/routes/config/categories/CategoryReason.svelte`, `src/routes/invoices/[id]/+page.svelte:108–113`, `src/routes/config/categories/CategoryForm.svelte:121–148`, `backend/migrations/0002_stammdaten.sql:20,30`, `backend/demo/demo-data.sql:107,126`, `messages/*.json`.

Formeln: Der Gegenstand enthält keine Formel (keine Beträge, kein Verteilschlüssel). Nachgerechnet wurde deshalb nichts.

## Wortlaut der Normen (Fedlex)

- **Art. 256 Abs. 1 OR:** «Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.» (fr: «… dans un état approprié à l’usage pour lequel elle a été louée, et de l’entretenir en cet état.»; it: «… in stato idoneo all’uso cui è destinata e mantenerla tale per la durata della locazione.»)
- **Art. 256b OR:** «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.» (fr: «Le bailleur supporte les contributions publiques et les charges qui grèvent la chose louée.»; it: «Il locatore sottostà ai tributi pubblici e agli oneri che gravano sulla cosa locata.»)
- **Art. 257a Abs. 1 OR:** «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.» (fr: «… en rapport avec l’usage de la chose.»; it: «… in relazione all’uso della cosa.»)
- **Art. 257a Abs. 2 OR:** «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» (fr: «Ils ne sont à la charge du locataire que si cela a été convenu spécialement.»; it: «Sono a carico del conduttore soltanto se specialmente pattuito.»)
- **Art. 257b Abs. 1 OR:** «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» (fr: «… ainsi que les contributions publiques qui résultent de l’utilisation de la chose.»; it: «… come pure per tributi pubblici risultanti dall’uso della cosa.»)
- **Art. 269a Bst. b OR:** Mietzinse sind in der Regel nicht missbräuchlich, wenn sie insbesondere «b. durch Kostensteigerungen oder Mehrleistungen des Vermieters begründet sind;»
- **Titel VMWG:** «Verordnung über die Miete und Pacht von Wohn- und Geschäftsräumen (VMWG)»; fr «Ordonnance sur le bail à loyer et le bail à ferme d’habitations et de locaux commerciaux (OBLF)»; it «Ordinanza concernente la locazione e l’affitto di locali d’abitazione o commerciali (OLAL)». Ein amtlicher Kurztitel wie «Mietverordnung» existiert nicht.
- **Art. 4 Abs. 3 VMWG:** «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»
- **Art. 5 Abs. 1 VMWG:** «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.» (it: «Sono computabili …»; fr: «Entrent en ligne de compte …»)
- **Art. 5 Abs. 2 VMWG** (Auszug): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden; […] d. die Reinigung der Heizungsanlage und des Kamins, das Auskratzen, Ausbrennen und Einölen der Heizkessel sowie die Abfall- und Schlackenbeseitigung; […] g. die Wartung; h. die Versicherungsprämien, soweit sie sich ausschliesslich auf die Heizungsanlage beziehen; i. die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt.»
- **Art. 6 VMWG:** «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.»
- **Art. 14 Abs. 1 VMWG:** «Als Mehrleistungen im Sinne von Artikel 269a Buchstabe b OR gelten Investitionen für wertvermehrende Verbesserungen, die Vergrösserung der Mietsache sowie zusätzliche Nebenleistungen. Die Kosten umfassender Überholungen gelten in der Regel zu 50–70 Prozent als wertvermehrende Investitionen.»

## Wortlaut MV-Merkblatt (für diese Runde massgeblich)

- S. 1, «Wichtig»: «Bei einigen Nebenkosten ist die Abgrenzung schwierig und die Zulässigkeit umstritten.»
- S. 3, Lift: «Als Liftkosten zulässig sind: − Strom − Gemäss weitverbreiteter Praxis: Serviceabos für reine Wartung und Reinigung − Lifttelefonanschlussgebühr»; «Unzulässige Kosten sind: − Reparaturen, Ersatzteile, Erneuerungen − Serviceabos für Reparaturen − Amortisation».
- S. 4, «Unzulässige Gartenpflegekosten: − Anschaffungskosten für Werkzeuge und Maschinen − Sanierung von Rasen, etc. − Schädlingsbekämpfung − …»
- S. 4, Serviceabos: «Umstritten: − Serviceabos für Kontrolle und Wartung diverser Anlagen im Gebäude»; «Unzulässige Kosten: − Abos, soweit damit Leistungen für Unterhalt und Reparaturen enthalten sind, sind eindeutig unzulässig.»; «Es ist rechtlich umstritten, ob Serviceabos für Kontrolle und Wartung als Nebenkosten überwälzbar sind. Solche Abos gibt es für alle technischen, baulichen Einrichtungen, so zum Beispiel für Klimaanlagen, Feuerlöschgeräte und Brandmeldeanlagen, …»
- S. 5, Brandschutzkosten: «Beim Brandschutz kommt es darauf an, ob die betreffende Massnahme auch nötig wäre, wenn das Gebäude leer steht. Ist dies der Fall, dürften die betreffenden Leistungen nicht nebenkostenfähig sein. […] Anders sieht es wohl aus, wenn gewisse Brandschutzmassnahmen nur wegen der Nutzung durch eine spezielle Mieterschaft nötig sind, etwa bei einem Club oder Theater. Dann hängt die betreffende Leistung mit dem «Gebrauch der Sache» zusammen und ist nebenkostenfähig.»
- S. 5, Versicherungen: «Zulässig sind Versicherungen für: − Heizungsanlage […]»; «Unzulässige Versicherungskosten: − Gebäudeversicherung etc.»

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Feuerlöscher-Wartung: «der Mieterverband zählt Brandschutz zu den Kosten des Vermieters» gibt das Merkblatt falsch wieder; dort ist die Wartung von Feuerlöschgeräten ausdrücklich «rechtlich umstritten», Brandschutz nur bedingt nicht nebenkostenfähig |
| M-2 | Mietrecht | Major | Lift: Satz zum Vollservicevertrag ist mehrdeutig («gilt das») und sagt nicht, dass nur der Wartungsanteil erfasst werden darf; so wird der Reparaturanteil umgelegt |
| V-1 | Verwalter | Major | Neuer Lift-Grund widerspricht der Beschreibung der Kategorie Lift («ohne … Serviceabos mit Reparaturen»), die auf derselben Bearbeitungsseite steht und im KI-Prompt steht |
| V-2 | Verwalter | Major | Szenario `categories.feature` erwartet «Obligationenrecht (OR)», die Entwürfe schreiben «Obligationenrecht, OR»; Szenario und Text passen nicht zusammen |
| V-3 | Verwalter | Major | Kein Szenario für eine ausgeschlossene Rechnung einer umlagefähigen vordefinierten Kategorie: ohne es kann «… also umlagefähig» neben «nicht umlagefähig» stehen |
| M-3 | Mietrecht | Minor | Schädlingsbekämpfung: Merkblatt nennt sie unzulässig (bei der Gartenpflege), nicht umstritten; «umstritten» bleibt ohne Quelle; «Sie ist …» nach Doppelpunkt liest sich als Anrede |
| M-4 | Mietrecht | Minor | Hilfetext `categories_allocable_help`, auf den der KI-Hinweis neu verweist, hat noch die alte, weiche Vertragsregel und «OR» unerklärt |
| V-4 | Verwalter | Minor | fr/it: erfundener französischer/italienischer Merkblatt-Titel und «Association des locataires»/«Associazione inquilini» bezeichnen andere Verbände; das Merkblatt ist deutsch und vom Mieterinnen- und Mieterverband |
| V-5 | Verwalter | Minor | «Mietverordnung» ist kein amtlicher Titel; Antwort auf die Frage im Entwurf; fehlender Glossarbegriff |
| V-6 | Verwalter | Minor | Szenario «Nicht umlagefähige Rechnung nennt den Grund ihrer Kategorie» prüft nicht mehr, dass der allgemeine Hinweis wegfällt (Entscheid B «instead of») |
| V-7 | Verwalter | Minor | Fehlender Glossarbegriff «Vollservicevertrag» |
| V-8 | Verwalter | Nit | Kehricht: «Kehrichtgebühren, die sich aus dem Gebrauch ergeben, … sind öffentliche Abgaben aus dem Gebrauch» ist doppelt gemoppelt |
| V-9 | Verwalter | Nit | de: «Absatz» ausgeschrieben, «Bst.» abgekürzt; Verwaltung zitiert «Art. 5 Absatz 2» ohne Buchstabe i |
| V-10 | Verwalter | Nit | `invoices_legal_text` behalten (Antwort auf die Frage), aber OR ausschreiben, weil die Rechnungsseite ihn allein zeigt |
| V-11 | Verwalter | Nit | fr «contrat d’entretien complet», it «contratto di servizio completo»: Fachwort laut `i18n-begriffe.md` ist «maintenance»/«manutenzione» |
| V-12 | Verwalter | Nit | Szenariowortlaut «Grund ihrer Kategorie» statt Glossarbegriff «Grund der Umlagefähigkeit» |
| V-13 | Verwalter | Nit | it: «ordinanza sulla locazione» weicht vom amtlichen Titelanfang «Ordinanza concernente la locazione» ab; Kopfzeile des Entwurfs «obligazioni» (Tippfehler, Tabelle richtig) |

Kein Blocker.

## Befunde

### M-1 (Major): Feuerlöscher-Wartung gibt das Merkblatt falsch wieder

**Beleg.** Entwurf `categories_reason_fire_extinguisher` (de): «Ob die Wartung von Feuerlöschern mit dem Gebrauch zusammenhängt, ist umstritten; der Mieterverband zählt Brandschutz zu den Kosten des Vermieters (Merkblatt «Zulässige und unzulässige Nebenkosten»). Dwello folgt dem Merkblatt: …». MV-Merkblatt S. 4: «Es ist rechtlich umstritten, ob Serviceabos für Kontrolle und Wartung als Nebenkosten überwälzbar sind. Solche Abos gibt es … für … Feuerlöschgeräte …»; S. 5: «Beim Brandschutz kommt es darauf an, ob die betreffende Massnahme auch nötig wäre, wenn das Gebäude leer steht. Ist dies der Fall, dürften die betreffenden Leistungen nicht nebenkostenfähig sein. […] Dann hängt die betreffende Leistung mit dem «Gebrauch der Sache» zusammen und ist nebenkostenfähig.»

**Warum falsch.** Das Merkblatt zählt Brandschutz nicht pauschal zu den Kosten des Vermieters: Es unterscheidet (leeres Gebäude oder besondere Nutzung) und sagt vorsichtig «dürften». Für Feuerlöschgeräte nennt es die Frage selbst «rechtlich umstritten». Der Entwurf macht die Quelle damit sicherer, als sie ist; genau das hat #221 am alten Text bemängelt (Dr. Weber P-1). Ein Vermieter, der das Merkblatt nachliest, findet den zitierten Satz nicht.

**Behebung.** Quelle für «umstritten» ist das Merkblatt selbst; die Folgerung Dwellos stützt sich auf das Kriterium des Merkblatts:
- de: «Ob die Wartung von Feuerlöschern mit dem Gebrauch zusammenhängt (Art. 257a Absatz 1 Obligationenrecht, OR), ist umstritten (Mieterinnen- und Mieterverband, Merkblatt «Zulässige und unzulässige Nebenkosten»). Nach dem Merkblatt gehört Brandschutz, der auch bei leerem Gebäude nötig ist, nicht zu den Nebenkosten. Dwello folgt dem Merkblatt: Die Wartung ist also nicht umlagefähig.»
- fr: «La question de savoir si la maintenance des extincteurs est en rapport avec l’usage (art. 257a, al. 1, du Code des obligations, CO) est controversée (association alémanique des locataires, Mieterinnen- und Mieterverband, fiche « Zulässige und unzulässige Nebenkosten », en allemand). Selon cette fiche, la protection incendie nécessaire même lorsque le bâtiment est vide ne fait pas partie des frais accessoires. Dwello suit cette fiche : la maintenance n’est donc pas imputable.»
- it: «Se la manutenzione degli estintori sia in relazione all’uso (art. 257a cpv. 1 del Codice delle obbligazioni, CO) è controverso (associazione degli inquilini della Svizzera tedesca, Mieterinnen- und Mieterverband, scheda «Zulässige und unzulässige Nebenkosten», in tedesco). Secondo la scheda, la protezione antincendio necessaria anche quando l’edificio è vuoto non fa parte delle spese accessorie. Dwello segue la scheda: la manutenzione non è quindi addebitabile.»
- en: «Whether servicing fire extinguishers is linked to the use (Art. 257a para. 1 Code of Obligations, CO) is disputed (Swiss-German tenants’ association Mieterinnen- und Mieterverband, leaflet «Zulässige und unzulässige Nebenkosten»). According to the leaflet, fire protection that is needed even when the building stands empty is not a utility cost. Dwello follows the leaflet: the servicing is therefore not allocable.»

Die Szenarien bleiben gültig («umstritten» kommt vor).

### M-2 (Major): Lift mit Vollservicevertrag

**Beleg.** Entwurf `categories_reason_elevator` (de): «… Reparaturen und Ersatzteile trägt der Vermieter. Bei einem Vollservicevertrag gilt das für den Anteil der Wartung: Diese Kosten sind also umlagefähig.» MV-Merkblatt S. 3 (zulässig «Serviceabos für reine Wartung und Reinigung», unzulässig «Serviceabos für Reparaturen»), S. 4: «Abos, soweit damit Leistungen für Unterhalt und Reparaturen enthalten sind, sind eindeutig unzulässig.» Art. 256 Abs. 1 OR (Erhaltungspflicht, oben). Demo: `backend/demo/demo-data.sql:107,126` («Serviceabonnement Lift 2024/2025», je umlagefähig, ganze CHF 1650.00 / 1690.00).

**Warum falsch.** (a) «gilt das» bezieht sich grammatisch auf den Satz davor («Reparaturen … trägt der Vermieter») und kann so gelesen werden, dass der Vermieter auch den Wartungsanteil trägt; «Diese Kosten» bleibt offen. (b) Der Text sagt nicht, was der Vermieter tun muss: Eine Vollservice-Rechnung in der Kategorie «Lift» ist ganz umlagefähig; ohne Hinweis erfasst er den ganzen Betrag und legt den Reparaturanteil um. Das Merkblatt nennt genau das «eindeutig unzulässig», und Reparaturen gehören zur Erhaltungspflicht (Art. 256 Abs. 1 OR). Der Entscheid erlaubt nur den Wartungsanteil.

**Behebung.**
- de: «Strom, Notruftelefon und Wartung des Lifts hängen mit dem Gebrauch zusammen (Art. 257a Absatz 1 Obligationenrecht, OR); Reparaturen und Ersatzteile trägt der Vermieter. Deckt ein Vollservicevertrag auch Reparaturen, ist nur sein Anteil für die Wartung umlagefähig: Erfassen Sie unter «Lift» nur diesen Anteil. Strom, Notruftelefon und Wartung sind also umlagefähig.»
- fr: «L’électricité, le téléphone d’urgence et la maintenance de l’ascenseur sont liés à l’usage (art. 257a, al. 1, du Code des obligations, CO) ; les réparations et les pièces de rechange sont à la charge du bailleur. Si un contrat de maintenance complet couvre aussi les réparations, seule sa part de maintenance est imputable : saisissez sous « Ascenseur » uniquement cette part. L’électricité, le téléphone d’urgence et la maintenance sont donc imputables.»
- it: «Elettricità, telefono d’emergenza e manutenzione dell’ascensore sono legati all’uso (art. 257a cpv. 1 del Codice delle obbligazioni, CO); riparazioni e pezzi di ricambio sono a carico del locatore. Se un contratto di manutenzione completo copre anche le riparazioni, è addebitabile solo la sua quota di manutenzione: registri sotto «Ascensore» solo questa quota. Elettricità, telefono d’emergenza e manutenzione sono quindi addebitabili.»
- en: «Electricity, emergency phone and servicing of the lift are linked to the use (Art. 257a para. 1 Code of Obligations, CO); repairs and spare parts are borne by the landlord. If a full-service contract also covers repairs, only its servicing share is allocable: add only that share under «Elevator». Electricity, emergency phone and servicing are therefore allocable.»

(Kategorienamen nach `0002_stammdaten.sql:20`: Lift / Ascenseur / Ascensore / Elevator.) Szenario-Erwartungen «Vollservicevertrag» und «also umlagefähig.» bleiben erfüllt.

**Demo (Frage im Entwurf).** Umbenennen ist richtig: «Wartungsabonnement Lift 2024» und «Wartungsabonnement Lift 2025» (umlagefähig, Kategorie Lift). Das entspricht «Serviceabos für reine Wartung und Reinigung» (MV-Merkblatt S. 3). Die Beträge (CHF 1650 / 1690 pro Jahr) sind für reine Wartung eines kleinen Lifts plausibel.

### V-1 (Major): Lift-Grund widerspricht der Lift-Beschreibung

**Beleg.** `backend/migrations/0002_stammdaten.sql:20` (gepinnt in `backend/src/__tests__/migrations.pg.test.ts:99`): Beschreibung «Strom, Notruftelefon und reine Wartung des Lifts; ohne Reparaturen, Ersatzteile und Serviceabos mit Reparaturen». Die Bearbeitungsseite zeigt Beschreibung und Grund untereinander (`CategoryForm.svelte:121–127`); die Beschreibung geht auch in den Kategorisierungs-Prompt der KI (204-fachreview-1, «Rechtsgrundlage im Prompt», `llm.ts` `categoryLines`).

**Warum falsch.** Bis jetzt sagten Beschreibung und Grund dasselbe («Serviceabos mit Reparaturen» trägt der Vermieter). Neu sagt der Grund, der Wartungsanteil eines Vollservicevertrags sei umlagefähig, die Beschreibung schliesst solche Verträge ganz aus. Der Vermieter liest auf derselben Seite zwei Regeln; die KI ordnet eine Vollservice-Rechnung weiter ganz den Reparaturen zu.

**Behebung.** Beschreibung (nur de, Spalte `description`) in derselben Änderung per Migration anpassen, wie bei #220 nur, wenn der Vermieter sie nicht geändert hat: «Strom, Notruftelefon und Wartung des Lifts, bei einem Vollservicevertrag nur der Anteil der Wartung; ohne Reparaturen und Ersatzteile». Gehört das nicht in #292 (die Issue nennt `backend/demo/`, keine Migration): Issue `fachlich` öffnen und unter «Blocked on me» führen, weil der Widerspruch mit dieser Änderung entsteht.

### V-2 (Major): Szenario und Texte schreiben OR verschieden aus

**Beleg.** `categories.feature` (Commit `9c512ef`): «Und nennt die vordefinierte Kategorie "Liegenschaftssteuer" als Grund "Obligationenrecht (OR)"». Entwurf, Kopf: «each text writes the law out at its first mention: «Obligationenrecht (OR)», «Mietverordnung (VMWG)»»; Tabelle: «Steuern auf die Liegenschaft trägt der Vermieter (Art. 256b Obligationenrecht, OR); …».

**Warum falsch.** Die Zeichenfolge «Obligationenrecht (OR)» kommt in keinem Entwurfstext vor; das Szenario kann mit diesen Texten nicht grün werden, und Kopf und Tabelle des Entwurfs widersprechen sich. In einer Klammer lässt sich «(OR)» nicht verschachteln, die Tabellenform ist daher richtig.

**Behebung (empfohlen).** Texte wie in der Tabelle lassen («Art. 256b Obligationenrecht, OR»; fr «du Code des obligations, CO»; it «del Codice delle obbligazioni, CO»; en «Code of Obligations, CO») und den Schritt ändern: «Und nennt die vordefinierte Kategorie "Liegenschaftssteuer" als Grund "Obligationenrecht, OR"». Die Lesart «einmal ausgeschrieben» = einmal pro Text (jeder Grund steht auf der Rechnungsseite allein) bestätige ich: Jeder der 21 Entwürfe schreibt OR bzw. VMWG bei der ersten Nennung aus und kürzt danach ab.

### V-3 (Major): Ausgeschlossene Rechnung einer umlagefähigen vordefinierten Kategorie ohne Szenario

**Beleg.** Geplantes Verhalten (Auftrag): Grund nur, wenn die Umlagefähigkeit der Rechnung der der Kategorie gleicht; sonst bei nicht umlagefähiger Rechnung der bisherige Hinweis. PRD Z. 768: «An invoice of an allocable category can be excluded from statements». Szenarien `invoice-detail.feature`: nur umlagefähige Rechnung (Hauswart), nicht umlagefähige Kategorie (Reparaturen), eigene Kategorie (Dachsanierung). Der Schritt «die Rechnung von "…" ist inzwischen als nicht umlagefähig markiert» existiert (`settings.feature:83`).

**Warum falsch.** Fehlt die Bedingung, steht bei einer ausgeschlossenen Hauswart-Rechnung «Die Hauswartung ist also umlagefähig.» neben dem Status «nicht umlagefähig», ein Widerspruch auf demselben Bildschirm (wie H-4 in 186-fachreview-1 für die Kategorienseite). Die Regel ist sichtbares Verhalten und braucht ein Szenario (Workflow Schritt 1). Den umgekehrten Fall (Rechnung umlagefähig, Kategorie nicht) gibt es nicht: «an invoice of a non-allocable category is never allocable» (PRD Z. 769).

**Behebung.**
```
  Szenario: Ausgeschlossene Rechnung einer umlagefähigen Kategorie nennt keinen Grund
    Angenommen die Rechnung von "Hauswart Huber" ist inzwischen als nicht umlagefähig markiert
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann ist die Rechnung nicht umlagefähig
    Und erklärt ein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst
    Und nennt die Rechnung keinen Grund ihrer Kategorie
```

### M-3 (Minor): Schädlingsbekämpfung

**Beleg.** Entwurf (de): «Ob Schädlingsbekämpfung mit dem Gebrauch zusammenhängt, ist umstritten; der Mieterverband zählt sie zu den Kosten des Vermieters (Merkblatt …). Dwello folgt dem Merkblatt: Sie ist also nicht umlagefähig.» MV-Merkblatt S. 4: «Unzulässige Gartenpflegekosten: […] − Schädlingsbekämpfung». Das Wort «umstritten» steht beim Lift-, Abwasser-, Kehricht- und Serviceabo-Abschnitt, nicht bei der Schädlingsbekämpfung.

**Warum.** (a) «umstritten» ist entschieden (#221), hat aber keine Quelle: das Merkblatt nennt Schädlingsbekämpfung unzulässig, nicht umstritten. Der Entwurf schreibt «umstritten» Dwello zu und dem Merkblatt nur die Einordnung; das ist vertretbar, die Einordnung sollte aber so heissen wie im Merkblatt («unzulässig»). (b) «Dwello folgt dem Merkblatt: Sie ist …» liest sich nach dem Doppelpunkt als Anrede («Sie» = der Vermieter).

**Behebung.**
- de: «Ob Schädlingsbekämpfung mit dem Gebrauch zusammenhängt (Art. 257a Absatz 1 Obligationenrecht, OR), ist umstritten; der Mieterinnen- und Mieterverband zählt sie zu den unzulässigen Nebenkosten (Merkblatt «Zulässige und unzulässige Nebenkosten»). Dwello folgt dem Merkblatt: Die Schädlingsbekämpfung ist also nicht umlagefähig.»
- fr: «La question de savoir si la lutte contre les nuisibles est en rapport avec l’usage (art. 257a, al. 1, du Code des obligations, CO) est controversée ; l’association alémanique des locataires (Mieterinnen- und Mieterverband) la compte parmi les frais accessoires non admissibles (fiche « Zulässige und unzulässige Nebenkosten », en allemand). Dwello suit cette fiche : la lutte contre les nuisibles n’est donc pas imputable.»
- it: «Se la lotta contro i parassiti sia in relazione all’uso (art. 257a cpv. 1 del Codice delle obbligazioni, CO) è controverso; l’associazione degli inquilini della Svizzera tedesca (Mieterinnen- und Mieterverband) la conta tra le spese accessorie non ammissibili (scheda «Zulässige und unzulässige Nebenkosten», in tedesco). Dwello segue la scheda: la lotta contro i parassiti non è quindi addebitabile.»
- en: «Whether pest control is linked to the use (Art. 257a para. 1 Code of Obligations, CO) is disputed; the Swiss-German tenants’ association Mieterinnen- und Mieterverband counts it among the non-permissible utility costs (leaflet «Zulässige und unzulässige Nebenkosten»). Dwello follows the leaflet: pest control is therefore not allocable.»

Der Hinweis im Auftrag für den Produktverantwortlichen: Das Merkblatt stützt «umstritten» hier nicht; siehe «Nicht bestätigt».

### M-4 (Minor): Hilfetext mit alter Vertragsregel

**Beleg.** `messages/de.json:1378` `categories_allocable_help`: «… Der Mieter bezahlt umlagefähige Kosten nur, wenn der Mietvertrag sie als Nebenkosten nennt (Art. 257a Absatz 2 OR).»; erste Nennung «(Art. 257a–257b OR)». Neuer KI-Hinweis: «… die Regeln stehen im Hilfetext oben.» (Hilfetext steht über dem Vorschlag, `CategoryForm.svelte:121` vor `:140`.) Art. 257a Abs. 2 OR: «besonders vereinbart».

**Warum.** Der KI-Hinweis schickt den Vermieter zu einem Text, der die Regel weicher sagt als der neue Vertragshinweis auf der Liste (#221 P-2) und OR nicht erklärt. Zwei Fassungen derselben Regel in der App.

**Behebung** (erste Nennung ausschreiben, letzter Satz wie der Vertragshinweis):
- de: «… (Art. 257a–257b Obligationenrecht, OR) …» und «Der Mieter bezahlt umlagefähige Kosten nur, wenn der Mietvertrag jede dieser Kostenarten einzeln nennt (Art. 257a Absatz 2 OR).»
- fr: «… (art. 257a–257b du Code des obligations, CO) …» und «Le locataire ne paie les frais imputables que si le contrat de bail mentionne chacun de ces types de frais séparément (art. 257a, al. 2, CO).»
- it: «… (art. 257a–257b del Codice delle obbligazioni, CO) …» und «L’inquilino paga i costi addebitabili solo se il contratto di locazione indica singolarmente ciascuno di questi tipi di costi (art. 257a cpv. 2 CO).»
- en: «… (Art. 257a–257b Code of Obligations, CO) …» und «The tenant pays allocable costs only if the rental contract names each of these cost types separately (Art. 257a para. 2 CO).»

### V-4 (Minor): Quelle in fr/it/en falsch benannt

**Beleg.** Entwurf fr: «l’Association des locataires … (fiche « Frais accessoires admissibles et non admissibles »)»; it: «l’Associazione inquilini … (scheda «Spese accessorie ammissibili e non ammissibili»)»; en: «the tenants’ association … (leaflet «Zulässige und unzulässige Nebenkosten»)». Das Merkblatt ist deutsch, Absender «Mieterinnen- und Mieterverband» (Kopf S. 1).

**Warum.** Ein Dokument mit dem französischen oder italienischen Titel gibt es nach meiner Suche nicht; der Vermieter findet die Quelle nicht. «Association des locataires» (ASLOCA) und «Associazione Svizzera Inquilini» (ASI) sind die Verbände der Romandie bzw. des Tessins, nicht der Absender.

**Behebung.** Originaltitel mit Sprachhinweis und Absender wie in M-1 und M-3 (fr «association alémanique des locataires (Mieterinnen- und Mieterverband) … « Zulässige und unzulässige Nebenkosten », en allemand»; it «associazione degli inquilini della Svizzera tedesca (Mieterinnen- und Mieterverband) … «Zulässige und unzulässige Nebenkosten», in tedesco»; en «Swiss-German tenants’ association Mieterinnen- und Mieterverband»).

### V-5 (Minor): «Mietverordnung (VMWG)» (Frage im Entwurf)

**Beleg.** Amtlicher Titel (Fedlex): «Verordnung über die Miete und Pacht von Wohn- und Geschäftsräumen (VMWG)»; kein amtlicher Kurztitel. MV-Merkblatt S. 4 sagt «Verordnung zum Mietrecht». `UBIQUITOUS_LANGUAGE.md:207` führt «Obligationenrecht (OR)», die VMWG nicht. fr «ordonnance sur le bail (OBLF)» ist der Anfang des amtlichen Titels.

**Antwort.** «Mietverordnung» ist verständlich, aber ein inoffizieller Name, unter dem der Vermieter auf Fedlex nichts findet. Besser der Anfang des amtlichen Titels, parallel zum Französischen: «Verordnung über die Miete (VMWG)», in der Klammer «(Art. 5 Verordnung über die Miete, VMWG)». Den vollen Titel braucht es nicht; die Abkürzung VMWG führt zum Erlass. en «Tenancy Ordinance (VMWG)» ist mangels amtlicher englischer Fassung in Ordnung (VMWG bleibt suchbar).

**Fehlender Begriff** (Issue `fachlich`, `entscheiden`): Zeile im Abschnitt Recht des Glossars: «**Verordnung über die Miete (VMWG)** | Bundesratsverordnung (SR 221.213.11, amtlich «Verordnung über die Miete und Pacht von Wohn- und Geschäftsräumen»); regelt unter anderem Nebenkostenabrechnung, Verwaltungskosten und Heizkosten (Art. 4–8 VMWG).» Bis zum Entscheid im Code `TODO(fachlich prüfen, #<issue>)`.

### V-6 (Minor): Wegfall des allgemeinen Hinweises nicht geprüft

**Beleg.** Alte Fassung des Szenarios: «Und erklärt ein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst»; neue Fassung prüft nur den Grund. Entscheid B: «An invoice shows the reason of its own category … instead of the general list».

**Warum.** Bleibt der Hinweis (`invoice-legal-note`) zusätzlich stehen, ist das Szenario grün, der Entscheid aber nicht umgesetzt: Rechnung «Reparaturen» zeigte Grund und Warnliste.

**Behebung.** Im Szenario «Nicht umlagefähige Rechnung nennt den Grund ihrer Kategorie» ergänzen: «Und erklärt kein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst» (neuer Schritt, Anzahl `invoice-legal-note` = 0).

### V-7 (Minor): Fehlender Begriff «Vollservicevertrag»

**Beleg.** Neuer Lift-Grund und Szenario «nennt die vordefinierte Kategorie "Lift" als Grund "Vollservicevertrag"»; nicht in `UBIQUITOUS_LANGUAGE.md`. In der Praxis auch «Vollwartungsvertrag».

**Vorschlag** (Issue `fachlich`, `entscheiden`): «**Vollservicevertrag (Lift)** | Vertrag mit dem Lifthersteller, der neben der Wartung auch Reparaturen und Ersatzteile deckt. Umlagefähig ist nur der Anteil der Wartung; den Rest trägt der Vermieter (Art. 256 Abs. 1 OR).» fr «contrat de maintenance complet», it «contratto di manutenzione completo», en «full-service contract».

### V-8 (Nit): Kehricht doppelt gemoppelt

**Behebung.**
- de: «Kehrichtgebühren nach Gebrauch (z. B. Grundgebühr pro Wohnung, Container nach Gewicht) sind öffentliche Abgaben, die sich aus dem Gebrauch ergeben (Art. 257b Absatz 1 Obligationenrecht, OR); Grundgebühren, die vom Wert der Liegenschaft abhängen, und Räumungen, die der Vermieter bestellt, nicht. Diese Kehrichtgebühren sind also umlagefähig.»
- fr: «Les taxes sur les ordures liées à l’usage (p. ex. taxe de base par logement, conteneur au poids) sont des contributions publiques qui résultent de l’utilisation de la chose (art. 257b, al. 1, du Code des obligations, CO) ; les taxes de base qui dépendent de la valeur de l’immeuble et les débarras commandés par le bailleur ne le sont pas. Ces taxes sur les ordures sont donc imputables.»
- it: «Le tasse sui rifiuti legate all’uso (p. es. tassa di base per appartamento, contenitore a peso) sono tributi pubblici risultanti dall’uso della cosa (art. 257b cpv. 1 del Codice delle obbligazioni, CO); le tasse di base che dipendono dal valore dell’immobile e gli sgomberi ordinati dal locatore no. Queste tasse sui rifiuti sono quindi addebitabili.»
- en: «Waste fees based on use (e.g. a base fee per apartment, a container by weight) are public charges arising from the use of the property (Art. 257b para. 1 Code of Obligations, CO); base fees that depend on the value of the property and clearances the landlord orders are not. These waste fees are therefore allocable.»

### V-9 (Nit): «Bst.» und fehlender Buchstabe

**Beleg.** de-Entwürfe schreiben «Absatz» aus, kürzen aber «Bst.» ab (Kaminfeger «Art. 5 Absatz 2 Bst. d», Gebäudeversicherung «Bst. h», Investitionen «Art. 269a Bst. b»). Verwaltung: «Verwaltungsarbeit für den Heizbetrieb gehört zur Heizung (Art. 5 Absatz 2 VMWG)»; die Stelle ist Bst. i.

**Behebung.** de «Buchstabe» statt «Bst.»; Verwaltung «(Art. 5 Absatz 2 Buchstabe i VMWG)», fr «(art. 5, al. 2, let. i, OBLF)», it «(art. 5 cpv. 2 lett. i OLAL)», en «(Art. 5 para. 2 let. i VMWG)». fr/it/en kürzen durchgehend ab und bleiben so.

### V-10 (Nit): `invoices_legal_text` (Frage im Entwurf)

**Antwort.** Behalten für die beiden Fälle ohne festen Grund (eigene nicht umlagefähige Kategorie; ausgeschlossene Rechnung einer umlagefähigen Kategorie). Der Satz «Diese Rechnung fliesst nicht in die Nebenkostenabrechnung ein» stimmt in beiden Fällen, und die Beispiele helfen gerade bei der ausgeschlossenen Rechnung (z. B. Lift-Reparatur in «Lift»). Inhalt bestätigt mit Art. 256 Abs. 1, 256b, 257a OR (oben). Weil die Rechnungsseite ihn allein zeigt, OR ausschreiben:
- de: «… (Art. 256 Absatz 1, 256b und 257a Obligationenrecht, OR).»
- fr: «… (art. 256, al. 1, 256b et 257a du Code des obligations, CO).»
- it: «… (art. 256 cpv. 1, 256b e 257a del Codice delle obbligazioni, CO).»
- en: «… (Art. 256 para. 1, 256b and 257a Code of Obligations, CO).»

### V-11 (Nit): fr/it Fachwort für den Vollservicevertrag

`docs/design/i18n-begriffe.md:48`: Wartung = fr «maintenance (nicht «entretien»)», it «manutenzione». Entwurf fr «contrat d’entretien complet», it «contratto di servizio completo». In M-2 ersetzt durch «contrat de maintenance complet» / «contratto di manutenzione completo».

### V-12 (Nit): Szenariowortlaut

`invoice-detail.feature`: «nennt die Rechnung als Grund ihrer Kategorie …», «nennt die Rechnung keinen Grund ihrer Kategorie». Glossar `UBIQUITOUS_LANGUAGE.md:87` und `categories.feature:90` sagen «Grund der Umlagefähigkeit». Vorschlag: «nennt die Rechnung als Grund der Umlagefähigkeit ihrer Kategorie …» / «nennt die Rechnung keinen Grund der Umlagefähigkeit».

### V-13 (Nit): Italienischer Titel

Amtlich «Ordinanza concernente la locazione e l’affitto di locali d’abitazione o commerciali (OLAL)»; Vorschlag «ordinanza concernente la locazione (OLAL)» statt «ordinanza sulla locazione (OLAL)». Kopf des Entwurfs «Codice delle obligazioni» ist ein Tippfehler; die Tabelle schreibt richtig «obbligazioni» (Fedlex: «Diritto delle obbligazioni»).

## Bestätigt mit Quelle

- **Folgerung am Ende:** Alle 21 Gründe enden in allen vier Sprachen mit «also (nicht) umlagefähig» bzw. «donc (pas) imputable(s)», «quindi (non) addebitabile/i», «therefore (not) allocable» (Entscheid #221). Wörter wie `i18n-begriffe.md:47` (imputable, addebitabile, allocable); «anrechenbar» in den VMWG-Sätzen entspricht dem Gesetz (it «computabili» wie OLAL Art. 5).
- **Heizung, Warmwasser, Kaminfeger:** VMWG Art. 5 Abs. 1, Abs. 2 Bst. a, d, g; Art. 6 Bst. a, b (Wortlaut oben).
- **Kaltwasser, Abwasser:** Art. 257b Abs. 1 OR («öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben»); wertabhängige Grundgebühren und Regenwasser unzulässig nach MV-Merkblatt S. 2.
- **Allgemeinstrom, Hauswart, Gartenpflege, Schneeräumung, TV/Kabelanschluss:** Art. 257a Abs. 1 OR; Inhalt nach MV-Merkblatt S. 2–4 (wie in 186/204 bestätigt).
- **Reparaturen, Renovation:** Art. 256 Abs. 1 OR; Mehrwert als Mietzinserhöhung Art. 269a Bst. b OR, Art. 14 Abs. 1 VMWG. Szenario-Erwartung «Reparaturen sind mit dem Mietzins abgegolten, also nicht umlagefähig.» steht wörtlich im Entwurf.
- **Gebäudeversicherung (204 M-2):** Art. 256b OR; Ausnahme Art. 5 Abs. 2 Bst. h VMWG («soweit sie sich ausschliesslich auf die Heizungsanlage beziehen» = «nur die Heizungsanlage»); MV-Merkblatt S. 5. Szenario-Erwartung «nur die Heizungsanlage» erfüllt, in allen vier Sprachen gleichbedeutend.
- **Liegenschaftssteuer, Hypothekarzinsen:** Art. 256b OR bzw. Art. 257a Abs. 1 OR; MV-Merkblatt S. 5 («Weitere Steuern gehören nicht in die Nebenkostenabrechnung»).
- **Verwaltung:** Art. 4 Abs. 3 VMWG, Art. 257a Abs. 2 OR, Art. 5 Abs. 2 Bst. i VMWG (nur Zitiergenauigkeit V-9).
- **Wertvermehrende Investitionen:** Art. 269a Bst. b OR, Art. 14 Abs. 1 VMWG wörtlich.
- **Vertragshinweis** «… wenn der Mietvertrag jede dieser Kostenarten einzeln nennt (Art. 257a Absatz 2 …)»: entspricht dem Entscheid und Art. 257a Abs. 2 OR («besonders vereinbart»); passt zu den vereinbarten Nebenkosten pro Mietvertrag (`docs/data-model.md:144–153`, Anforderungen Regel 12). fr/it/en gleichbedeutend.
- **KI-Hinweis** «Im Zweifel: nicht umlagefähig.»: Entscheid #221; vereinbar mit Art. 257a Abs. 2 OR (ohne besondere Vereinbarung sind Nebenkosten mit dem Mietzins abgegolten), die vorsichtige Wahl schadet dem Mieter nie. fr «En cas de doute : non imputable.», it «Nel dubbio: non addebitabile.», en «If in doubt: not allocable.» richtig. «Hilfetext oben» stimmt mit dem Aufbau der Seite (`CategoryForm.svelte:121` vor `:140`); Inhalt des Hilfetexts siehe M-4.
- **Geplantes Verhalten Rechnungsdetail:** Grund nur bei vordefinierter Kategorie mit unveränderter Umlagefähigkeit und gleicher Umlagefähigkeit der Rechnung; sonst bei nicht umlagefähiger Rechnung `invoices_legal_text`. Entspricht Glossar Z. 87 («Entfällt, sobald der Liegenschaftsverwalter die Umlagefähigkeit ändert») und PRD Z. 765 («Validation reason shown to user»), Z. 768–769. Szenario für den Ausschluss fehlt (V-3).
- **Szenario-Begriffe:** Liegenschaftsverwalter, Kategorie, vordefinierte/eigene Kategorie, umlagefähig, Nebenkostenabrechnung, Rechnung wie Glossar Z. 26–87 (ausser V-12, V-7).
- **Kategorie «Dachsanierung» als eigene nicht umlagefähige Kategorie:** fachlich stimmig (Art. 256 Abs. 1 OR; vgl. vordefinierte «Renovation»).

## Fehlende Begriffe (Issue mit `fachlich`, `entscheiden`)

1. **Verordnung über die Miete (VMWG)**, siehe V-5.
2. **Vollservicevertrag (Lift)**, siehe V-7.

«Mieterinnen- und Mieterverband» und «Merkblatt» sind Eigennamen bzw. Alltagswörter und brauchen keinen Glossareintrag.

## Nicht bestätigt

- **«Umstritten» bei der Schädlingsbekämpfung:** Das MV-Merkblatt nennt sie bei der Gartenpflege unzulässig (S. 4), nicht umstritten; eine Schweizer Quelle für «umstritten» habe ich nicht gefunden (`mmx search "Schädlingsbekämpfung Nebenkosten Mieter überwälzbar Schweiz umstritten"`: nur deutsche Quellen zur BetrKV und Herstellerseiten). Entscheid des Produktverantwortlichen (#221), **unsicher**.
- **Lift-Wartung als umlagefähig:** nur Praxis (MV-Merkblatt S. 3 «Gemäss weitverbreiteter Praxis»; S. 3 «Daher sind die Liftkosten eigentlich von der Logik her keine Nebenkosten»); Art. 5 Abs. 2 Bst. g VMWG nennt Wartung nur für Heizung und Warmwasser. **unsicher**, wie in 186-fachreview-1.
- **Wie der Wartungsanteil eines Vollservicevertrags bestimmt wird** (Ausweis des Herstellers, Pauschalsatz): keine Fedlex-Stelle und keine Angabe im Merkblatt gefunden; die Behebung M-2 setzt nur voraus, dass der Vermieter den Anteil kennt.
- **«einzeln nennt» als Rechtsregel:** Fedlex sagt «besonders vereinbart»; dass jede Kostenart einzeln genannt sein muss, folgt aus der Rechtsprechung (in `docs/nebenkostenabrechnung-anforderungen.md:26` mit BGE 135 III 591 E. 4.3.1, dort als unsicher-A geführt); BGE nicht selbst nachgeschlagen. **unsicher**, aber entschieden (#221).
- **«Im Zweifel: nicht umlagefähig»** ist eine Empfehlung, keine Norm; auf Fedlex gibt es dazu keinen Wortlaut.
- **Gebäudeversicherung als «Last» nach Art. 256b OR:** Wortlaut nennt Versicherungen nicht; Einordnung nach MV-Merkblatt S. 5. **unsicher** (wie 186).
- **Regenwasser als nicht umlagefähig:** nur MV-Merkblatt S. 2. **unsicher** (wie 186).
- **Französische/italienische Merkblätter von ASLOCA/ASI:** nicht gesucht; ob es ein gleichwertiges fr/it-Dokument gibt, das die fr/it-Texte zitieren könnten, ist offen.
- **Englische Bezeichnungen** «Code of Obligations (CO)», «Tenancy Ordinance»: Für den Stand 2026-10-01 liefert Fedlex keine englische Fassung des OR und für die VMWG gar keine; nicht amtlich bestätigt.
- **Verbreitung von «Mietverordnung»** im Sprachgebrauch: nicht untersucht; die Empfehlung V-5 stützt sich nur auf den amtlichen Titel.
- **Wirkung der geänderten Lift-Beschreibung (V-1) auf die KI:** `bun run llm:eval` nicht gelaufen (Review ohne Modell).
- Gelesen ohne Bezug zum Gegenstand: `docs/anforderungen-vertragsende.md` (Vertragsende) nur auf Bezüge geprüft, keiner.
