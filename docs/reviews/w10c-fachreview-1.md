# Fachreview W10c, Runde 1: Vereinbarte Nebenkosten pro Mietvertrag (#91)

Gegenstand: Commit 3b3bd68 (Worktree `review-w10c-fach`), `tests/e2e/features/statement-agreed-costs.feature` (ganz), neue `@wip`-Szenarien am Ende von `contract-new.feature` (Z. 140–153) und `contract-edit.feature` (Z. 124–129), dazu der geplante Entwurf (Punkte 1–9 des Auftrags).

Rechtsquellen: Fedlex-Filestore, OR Fassung 1.10.2026 (`fedlex.data.admin.ch/eli/cc/27/317_321_377/20261001`), VMWG Fassung 1.10.2025 (`.../eli/cc/1990/835_835_835/20251001`, laut SPARQL die neueste), abgerufen am 17.10.2026.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | Ja/Nein pro Mietvertrag ohne Datum: neu eingeführte (Art. 269d Abs. 3 OR) oder geänderte Nebenkosten gelten dann für die ganze Abrechnungsperiode, also auch rückwirkend |
| V-1 | Verwalter | Major | Lesart A (alle umlagefähigen beim Erfassen) verliert den Auslöser aus Entscheid 3: eine vordefinierte Kategorie, die für das Gebäude neu ist (z. B. Lift), wird nicht mehr nachgefragt; der Hinweis «Neu» muss weiter auf die Mietverträge zeigen |
| V-2 | Verwalter | Major | `changedInvoices`/`invoiceStatements` melden jede Rechnung einer nicht vereinbarten Kategorie als «seit dem Erstellen geändert» |
| V-3 | Verwalter | Major | Heizkosten nicht vereinbart, mit Heizprofil oder Tank: PDF zeigt trotzdem Heizprofil, Tankrechnung (mit falschen Beträgen) und Hinweise nach Art. 8 VMWG; Szenario fehlt |
| M-2 | Mietrecht | Minor | PDF-Zeile mit allen vereinbarten Kategorien: bei der Vorgabe «alle angekreuzt» behauptet sie Vereinbarungen, die im Mietvertrag vielleicht nicht stehen |
| V-4 | Verwalter | Minor | Übernahme bestehender Mietverträge: Regel ergänzen (spät erfasste Rechnungen, einmaliger Prüfhinweis) |
| M-3 | Mietrecht | Minor | Umlagefähige Rechnungen ohne Kategorie werden allen ohne Prüfung der Vereinbarung abgerechnet (schon vorher so) |
| V-5 | Verwalter | Minor | Schritt 3 heisst «Heizprofil und Verwaltungspauschale»; die Fragen zu den Nebenkosten passen nicht zu diesem Namen |
| V-6 | Verwalter | Minor | Hilfetext beim Mietvertrag: Vorgabe «alle angekreuzt», Sammelklausel und Kaminfeger (gehört zu den Heizkosten) sind nicht erklärt |
| V-7 | Verwalter | Minor | Fehlende Szenarien: Mieterwechsel in der Periode, Liste nach dem Entwurf geändert, gespeicherte Abrechnung behält ihre Liste, leere Liste |
| V-8 | Verwalter | Minor | Glossar: «Umlagefähige Nebenkosten (abschliessende Liste im Mietvertrag)» überschneidet sich mit dem neuen Begriff |
| V-9 | Verwalter | Minor | PDF-Liste als Abbild in allen vier Sprachen speichern (Sprache des Mieters, umbenannte oder gelöschte eigene Kategorie) |
| V-10 | Verwalter | Minor | Folgevertrag («aus dem Mietvertrag einen neuen erfassen») sollte die Liste übernehmen, nicht alle Kategorien vorgeben |
| V-11 | Verwalter | Minor | `docs/nebenkostenabrechnung-anforderungen.md` Z. 26, 101, 135 widersprechen dem Entwurf oder sind veraltet |
| V-12 | Verwalter | Minor | Wortlaut des Hinweises «Nicht vereinbarte Nebenkosten» und der Frage (Vorschläge unten) |
| V-13 | Verwalter | Nit | Kommentar Z. 29: «beim Abschluss des Mietvertrags» heisst «beim Erfassen» |
| V-14 | Verwalter | Nit | «Dachreinigung» ist als Beispiel einer umlagefähigen Kategorie umstritten (Dach = Unterhalt) |
| V-15 | Verwalter | Nit | Die Frage auch bei einer Gutschrift stellen (Summe ≠ 0, nicht > 0) und nur bei Mietstagen in der Position |

Bestätigt ohne Befund: die Beträge aller Szenarien, Punkt 6 (Anteil trägt der Vermieter), Datenmodell (Punkt 1) mit den Ergänzungen unten, Lesart A (Punkt 2) unter den Bedingungen von V-1, Begründung im Feature (Art. 257a Abs. 2 OR).

## Gesetzestext (Fedlex, wörtlich)

- **Art. 257a OR** Abs. 1: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.» Abs. 2: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- **Art. 257b OR** Abs. 1: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- **Art. 269d OR** Abs. 1: «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen. Er muss dem Mieter die Mietzinserhöhung mindestens zehn Tage vor Beginn der Kündigungsfrist auf einem vom Kanton genehmigten Formular mitteilen und begründen.» Abs. 2: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet; c. mit der Mitteilung die Kündigung androht oder ausspricht.» Abs. 3: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.»
- **Art. 4 VMWG** Abs. 1: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Abs. 3: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»
- **Art. 5 Abs. 2 VMWG** (Auszug): «Darunter fallen insbesondere die Aufwendungen für: … d. die Reinigung der Heizungsanlage und des Kamins …»
- **Art. 7 Abs. 1 VMWG**: «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.»

Der bestehende Text `statements_finding_new` zu neuen Nebenkosten (nächster Kündigungstermin, amtliches Formular, 10 Tage, Begründung, nichtig) stimmt mit Art. 269d Abs. 1–3 OR überein.

## Nachgerechnet

Verteilschlüssel der Seeds: «Per Area (m²)» (`tests/e2e/fixtures/backend.ts:78`), Fläche 50 + 150 = 200 m², beide Mietverträge über das ganze Jahr 2024 (366 Tage), 0 % Verwaltungspauschale, kein Akonto im Szenario (der Schritt prüft die Kosten, nicht den Saldo: `statement-generate.steps.ts:248`).

| Fall | Anna Keller (1.01, 25 %) | Beat Huber (1.02, 75 %) | Szenario |
|------|-----------|-----------|---------|
| Heizung 1000 | 250.00 | 750.00 | – |
| Lift 400 | 100.00 | 300.00 | – |
| Lift bei Anna nicht vereinbart | 250.00 | 1050.00 | Z. 26–27 bestätigt |
| + Dachreinigung 200, Anna ja, Beat nein | 250 + 100 + 50 = 400.00 | 750 + 300 = 1050.00 | Z. 54–55 bestätigt |

Der Anteil von Beat an der Dachreinigung (150) geht nicht an Anna: Anna bleibt bei 50, nicht 200. Damit belegt Z. 47–55 auch Punkt 6.

Randfall Mieterwechsel (für V-7): Anna zieht am 30.06.2024 aus (182 Mietstage), Clara Meier zieht am 01.07.2024 in die Wohnung 1.01 ein (184 Mietstage). Dachreinigung 200, Rechnung vom 31.05.2024 ohne Leistungszeitraum, also abgerechnete Tage = Abrechnungsperiode. Wohnungsanteil 50. Anna 50 × 182/366 = 24.86, Clara 50 × 184/366 = 25.14 (zusammen 50.00). Bei Anna nicht vereinbart, bei Clara vereinbart: Clara 25.14; die 24.86 von Anna trägt der Vermieter, Beat bleibt bei 150.00.

Randfall Verwaltungspauschale: Sie rechnet mit den eigenen Nebenkosten nach dem Ausschluss (`calculation.service.ts:399–400`). Anna mit 3 % und ohne Lift: 250 × 3 % = 7.50, nicht 350 × 3 % = 10.50. Das ist richtig: Grundlage sind nach Glossar die eigenen Nebenkosten.

## Befunde

### M-1 (Major): Vereinbarung ohne Datum

**Beleg.** Entwurf Punkt 1: `contract_categories(contract_id, category_id, agreed boolean)`; `contract-edit.feature:125` ändert die Liste ohne Datum. Art. 269d Abs. 1 und 3 OR (oben): Neue Nebenkosten gelten erst «auf den nächstmöglichen Kündigungstermin», nach einer Mitteilung auf dem amtlichen Formular.

**Warum falsch.** Ein Vermieter führt «Lift» mit Formular auf den 01.10.2024 ein. Die Frage in Schritt 3 lässt nur «Vereinbart» oder «Nicht vereinbart» zu. Mit «Vereinbart» rechnet Dwello die Liftkosten für Januar bis September mit ab, ohne Rechtsgrund (Art. 257a Abs. 2 OR). Mit «Nicht vereinbart» fallen Oktober bis Dezember weg. Gleiches gilt für ein Häkchen, das unter «Bearbeiten» gesetzt oder entfernt wird: Es wirkt für jede künftige Abrechnung, auch für vergangene Perioden.

**Behebung.** Entweder ein Datum «vereinbart ab» (ohne Angabe: ab Vertragsbeginn), das der Zeitanteil der Position berücksichtigt, wie die Mietstage. Oder, wenn das nicht in diesen Schritt gehört: ein Issue (`fachlich`, `entscheiden`) und bis dahin ein sichtbarer Hilfetext bei der Frage und beim Feld im Mietvertrag, zum Beispiel: «Gilt die Vereinbarung erst seit einem Datum in dieser Abrechnungsperiode, zum Beispiel weil Sie diese Nebenkosten mit dem amtlichen Formular neu eingeführt haben, dürfen Sie sie erst ab diesem Datum abrechnen. Das kann Dwello noch nicht; wählen Sie dann «Nicht vereinbart» und rechnen Sie den Rest selbst ab.» Die Frage gehört dem Product Owner, weil Entscheid 1 nur eine Liste nennt.

### V-1 (Major): Lesart A verliert die Nachfrage, wenn eine Kategorie für das Gebäude neu ist

**Beleg.** Issue #91, Entscheid 3: «A category that is new to the building is not agreed for existing contracts: the statement wizard asks». Entwurf Punkt 2: «new» heisst bei Ihnen «nach dem Mietvertrag erfasst oder später umlagefähig geworden».

**Antwort auf Frage 2.** Ich stütze Lesart A. Kategorien sind in Dwello für alle Gebäude gleich (`categories` ohne `building_id`), und Lesart B gäbe Mietverträgen, die vor der ersten Rechnung erfasst sind (die übliche Reihenfolge), eine leere Liste. Der Liegenschaftsverwalter sieht bei A die angekreuzte Liste im Assistenten und bestätigt sie bei der Prüfung; das ist eine Angabe von ihm, keine stille Annahme. Weil A vom Wortlaut «of the building» abweicht, erwähnen Sie die Lesart im Pull Request (oder lassen Sie sie im Issue bestätigen).

**Was bei A verloren geht.** Ein Gebäude bekommt 2025 erstmals einen Lift. Für jeden Mietvertrag, der nach dem Start dieser Funktion mit der Vorgabe erfasst wurde, ist «Lift» angekreuzt, und Dwello fragt nicht nach. Gerade das ist der Fall von Art. 269d Abs. 3 OR («neue Nebenkosten einzuführen»). Wenn Sie aus dem Hinweis «Neu» in Schritt 4 die Frage streichen (Punkt 4), warnt Dwello nicht mehr.

**Behebung.** Der Hinweis «Neu» (`invoice-completeness.service.ts:140`) bleibt und zeigt auf die Mietverträge statt auf die Rechnungen. Vorschlag für `statements_finding_new`:

> Neu: {amount}, im Vorjahr keine Kosten. Dwello rechnet diese Kosten nur bei Mietverträgen ab, die sie vereinbaren (Angabe beim Mietvertrag). Prüfen Sie, ob sie in den unterschriebenen Mietverträgen stehen. Neue Nebenkosten führen Sie nur für die Zukunft ein, frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist die Änderung nichtig. Waren die Kosten bisher in der Nettomiete enthalten, senken Sie diese entsprechend.

Den Satz «Wenn nicht, markieren Sie die Rechnungen als nicht umlagefähig» zu streichen ist richtig: Ob vereinbart, entscheidet jetzt der Mietvertrag, und «nicht umlagefähig» nähme die Kosten allen Mietern weg. fr/it/en entsprechend (Begriffe siehe unten).

### V-2 (Major): Falsche Meldung «Rechnung geändert»

**Beleg.** `backend/src/services/statement-invoices.service.ts:35–45`: `changedInvoices` nimmt alle umlagefähigen Rechnungen des Gebäudes (`getInvoicesForStatement`) und meldet jede, die keine Position abrechnet (`billedAsIs`). `invoiceStatements` (Z. 52 ff.) rechnet `missedIn` auf dieselbe Art.

**Warum falsch.** Nach #91 rechnet keine Position von Anna die Liftrechnung ab. Jede Abrechnung von Anna meldet sie darum als «seit dem Erstellen erfasst oder geändert» (#96), und die Rechnung zeigt Annas Periode als «fehlt». Der Liegenschaftsverwalter löscht dann den Entwurf und erstellt ihn neu, ohne dass sich etwas ändert.

**Behebung.** Beide Funktionen nehmen nur die Rechnungen der Kategorien, die der Mietvertrag der Abrechnung vereinbart (oder, besser, die Kategorien, die beim Erstellen vereinbart waren und mit der Abrechnung gespeichert sind, siehe V-9). Test in `*.pg.test.ts`: Abrechnung von Anna ohne Lift, `changedInvoices` liefert eine leere Liste.

### V-3 (Major): Heizkosten nicht vereinbart, mit Heizprofil oder Tank

**Beleg.** `calculation.service.ts:327` und `:443`: `heatingOfRun` prüft `groups.some((group) => group.isHeatingCost)` über alle Gruppen des Gebäudes. `statement.service.ts:346` speichert `fuelStock` für jede Abrechnung des Gebäudes. `statement-pdf.service.ts:153–170` (`fuelOf`) rechnet `invoices = total − opening + closing` aus den Positionen der Kategorie; ohne Position ist `total` 0. `pdf.service.ts:762` druckt den Heizteil, sobald `data.heating` oder `data.fuel` gesetzt ist.

**Warum falsch.** Ein Mieter ohne vereinbarte Heizkosten bekommt ein PDF mit Heizprofil, Monatsanteilen und dem Hinweis zum Tankbestand (Art. 8 Abs. 2 VMWG), bei einem Tank auch eine Brennstoffrechnung mit negativem Betrag für die Rechnungen (Beispiel: Anfangsbestand 3000, Endbestand 2000, keine Position → «Rechnungen» = 0 − 3000 + 2000 = −1000; Total 0). Das PDF ist dann nicht nachvollziehbar.

**Behebung.** Erst die nicht vereinbarten Gruppen entfernen, dann `heatingOfRun` mit den übrigen Gruppen aufrufen; `heating_share` und `fuel_stock` nur speichern, wenn die Kategorie des Tanks vereinbart ist. Szenario oder pg-Test: «Heizkosten sind im Mietvertrag nicht vereinbart» mit Heizprofil «Heizung Mittelland» → kein Heizteil im PDF; dazu ein Fall mit Tankbestand.

### M-2 (Minor): Welche Kategorien das PDF nennt

**Beleg.** Entwurf Punkt 7; Issue #91 Entscheid 1 («the PDF names them»); `docs/nebenkostenabrechnung-anforderungen.md:116`: «Kostenaufstellung je vereinbarter Kategorie».

**Antwort auf Frage 7.** Eine Liste aller vereinbarten Kategorien führt bei der Vorgabe «alle umlagefähigen angekreuzt» in die Irre. Ein Mieter, dessen Mietvertrag nur Heizung, Wasser und Hauswart nennt, liest auf dem PDF «Im Mietvertrag vereinbarte Nebenkosten: …, Gartenpflege, Schneeräumung, TV/Kabelanschluss». Abgerechnet ist davon nichts, aber der Vermieter behauptet schriftlich eine Vereinbarung, die es nicht gibt. Das lädt zum Streit ein. Bei Mietverträgen, die aus dem Bestand übernommen wurden (V-4), hat der Liegenschaftsverwalter die Liste nie gesehen.

**Behebung.** Das PDF nennt nur die vereinbarten Kategorien, die in dieser Abrechnung eine Position haben, mit dem Satz: «Abgerechnet sind nur Nebenkosten, die im Mietvertrag vereinbart sind.» Hält der Product Owner an der ganzen Liste fest, dann nur, wenn der Liegenschaftsverwalter sie bestätigt hat (beim Erfassen oder in einem einmaligen Schritt für übernommene Mietverträge). Das PDF-Szenario Z. 89–96 besteht mit beiden Lesarten.

### V-4 (Minor): Übernahme bestehender Mietverträge (Frage 3)

**Beleg.** Entwurf Punkt 3.

**Bewertung.** Gespeicherte Abrechnungen nicht anzurühren ist richtig: Sie wurden so erstellt und versendet. Eine Korrektur ist eine berichtigte Abrechnung (#120). Was nach Art. 257a Abs. 2 OR zu viel abgerechnet wurde, kann Dwello nicht rückgängig machen. Dass eine Kategorie früher abgerechnet wurde, beweist keine Vereinbarung, denn Dwello hat bisher alles abgerechnet. Als Vorgabe passt es zu Entscheid 3: was das Gebäude schon hatte, ist nicht «neu».

**Ergänzungen.**
1. Ja, ein Mietvertrag mit Abrechnungen soll auch die Kategorien bekommen, die er hätte abrechnen können: Kategorien umlagefähiger Rechnungen des Gebäudes, deren abgerechnete Tage in der Laufzeit des Mietvertrags liegen, auch wenn sie erst nach dem Entwurf erfasst wurden. Sonst fragt der Assistent bei einer spät erfassten Rechnung der Periode 2024 nach, während der Entwurf 2024 sie nicht enthält.
2. Ein Mietvertrag ohne Abrechnung wie ein neuer (alle umlagefähigen): Das ist der heutige Stand, kein Betrag ändert sich. Der Liegenschaftsverwalter hat diese Liste aber nie gesehen. Schritt 3 sollte deshalb einmal sagen, dass die Listen übernommen wurden, und auf die Mietverträge verweisen. Vorschlag: «Dwello hat die vereinbarten Nebenkosten dieser Mietverträge aus dem bisherigen Stand übernommen. Prüfen Sie sie mit dem unterschriebenen Mietvertrag.» Das braucht ein Merkmal «übernommen, nicht bestätigt», das ein Speichern im Mietvertrag löscht.
3. Kategorien ohne `category_id` (Positionen «Nicht kategorisiert») und Kategorien, die heute nicht umlagefähig sind, bekommen keine Zeile. Ist eine solche Kategorie wieder umlagefähig, fragt der Assistent nach.

### M-3 (Minor, schon vorher so): Rechnungen ohne Kategorie

**Beleg.** `backend/src/db/schema.ts:250,255`: `category_id` darf leer sein, `is_valid_utility_cost` ist standardmässig `true`. `invoice.service.ts:526–538` nimmt sie in die Abrechnung; `calculation.service.ts:105` nennt sie «Nicht kategorisiert». Entwurf Punkt 1: «Invoices without a Kategorie stay billed as today».

**Warum falsch.** Eine Position «Nicht kategorisiert» kann der Mieter nicht mit seinem Mietvertrag vergleichen. Nach BGE 135 III 591 müssen die Nebenkosten im Mietvertrag «klar und bestimmt umschrieben» sein (Regeste; nicht Fedlex, **unsicher** im Wortlaut). Die Prüfung, die #91 einführt, lässt sich so umgehen.

**Behebung.** Nicht in diesem Schritt, aber als Issue (`fachlich`): Eine umlagefähige Rechnung ohne Kategorie sperrt den Abrechnungslauf oder fehlt in der Abrechnung, mit einem Hinweis in Schritt 4. Vorher in den offenen Issues suchen (Kategorisierung, «pending»).

### V-5 (Minor): Name von Schritt 3

**Beleg.** `messages/de.json:955`: `statements_step_settings` = «Heizprofil und Verwaltungspauschale»; Szenario Z. 44: «bleibt der Assistent beim Schritt mit der Verwaltungspauschale».

**Behebung.** Den Schritt nennen, was er jetzt enthält, zum Beispiel «Einstellungen» oder «Heizprofil, Pauschale und Nebenkosten» (alle vier Sprachen). Prüfen, ob `stateMeanings` in `tests/a11y/screens.json` den Schritt beim Namen nennt.

### V-6 (Minor): Hilfetext beim Feld im Mietvertrag

**Beleg.** Entwurf Punkt 9: «Kreuzen Sie die Nebenkosten an, die im Mietvertrag aufgeführt sind. Nur diese dürfen Sie dem Mieter abrechnen.» Art. 5 Abs. 2 lit. d VMWG (oben): Kaminreinigung gehört zu den Heizkosten; Glossar Z. 82: «Heizkosten (Kategorie) … (z.B. Heizung, Kaminfeger)».

**Warum unvollständig.** Erstens sind alle Kästchen schon angekreuzt; wer «Kreuzen Sie an» liest, nimmt an, er müsse nichts tun. Zweitens nennen Mietverträge oft «Heizung und Warmwasser» und nicht «Kaminfeger»; ein Laie entfernt dann das Häkchen bei Kaminfeger, obwohl Kaminfeger unter die Heizkosten fällt. Drittens genügt eine Sammelklausel nicht (BGE 135 III 591, **unsicher** im Wortlaut).

**Vorschlag:**

> Dwello hat alle umlagefähigen Kategorien angekreuzt. Entfernen Sie das Häkchen bei jeder, die im unterschriebenen Mietvertrag nicht steht. Nur angekreuzte Nebenkosten rechnet Dwello dem Mieter ab. Ein allgemeiner Satz wie «übrige Nebenkosten» genügt nicht. Steht im Mietvertrag «Heizkosten», gehören Kaminfeger und die anderen Heizkosten-Kategorien dazu.

Unter «Bearbeiten» dazu: «Bestehende Abrechnungen ändern sich dadurch nicht.» (wie `invoices_edit_purpose`, `messages/de.json:809`) und der Hinweis auf Neueinführungen aus M-1.

### V-7 (Minor): Fehlende Szenarien

Geprüft in allen drei Feature-Dateien; es fehlen:
1. **Mieterwechsel in der Periode** (Beträge oben): «Die Antwort gilt je Mietvertrag»: Anna nicht vereinbart, Clara vereinbart → Dachreinigung bei Clara CHF 25.14, bei Anna 0, bei Beat (vereinbart) CHF 150.00. Für ein E2E-Szenario genügt, dass der Assistent je Mietvertrag fragt; die Beträge passen in einen Unit-Test der Berechnung.
2. **Liste nach dem Entwurf geändert:** Der Entwurf bleibt unverändert (gleiche Kosten), und es gibt keine falsche Meldung «Rechnung geändert» (V-2). Ob der Entwurf einen Hinweis bekommt («Die vereinbarten Nebenkosten des Mietvertrags haben sich seit dem Erstellen geändert»), entscheidet der Product Owner; ich empfehle ihn, analog zu #96.
3. **Gespeicherte Abrechnung behält ihre Liste:** PDF erstellen, «Lift» danach als vereinbart eintragen, PDF erneut erstellen → weiterhin ohne «Lift» (Entwurf Punkt 7).
4. **Mietvertrag ohne vereinbarte Nebenkosten** (alle Häkchen entfernt, z. B. Nebenkosten im Mietzins inbegriffen): Was erstellt der Lauf? Empfehlung: keine Abrechnung und ein Hinweis in Schritt 3. Sonst entstünde eine Abrechnung ohne Position, deren Saldo die ganzen Akontobeiträge zurückerstattet. Ob das richtig ist, entscheidet der Product Owner.
5. **Heizkosten nicht vereinbart, mit Heizprofil und Tank** (V-3), als pg-Test.
6. **Kategorie nicht mehr umlagefähig:** Ihre Rechnungen werden nicht umlagefähig (`invoice.service.ts:231`), der Assistent fragt nicht nach; die Seite des Mietvertrags sollte sie nicht mehr unter «Vereinbarte Nebenkosten» zeigen (oder mit «nicht umlagefähig»). Unit- oder pg-Test genügt.
7. **Neuer Mietvertrag mit einer eigenen umlagefähigen Kategorie:** Sie ist angekreuzt; eine eigene nicht umlagefähige erscheint nicht (`contract-new.feature` prüft nur vordefinierte).

### V-8 (Minor): Glossar

**Beleg.** `UBIQUITOUS_LANGUAGE.md:208`: «**Umlagefähige Nebenkosten** | Kosten, die der Vermieter dem Mieter in Rechnung stellen darf (abschliessende Liste im Mietvertrag).»; Z. 86 «Umlagefähigkeit … bezahlen muss der Mieter sie nur, wenn der Mietvertrag sie vorsieht (Art. 257a Abs. 2 OR)».

**Warum.** Das Glossar nennt die Liste im Mietvertrag heute «umlagefähige Nebenkosten», in der App heisst «umlagefähig» aber eine Eigenschaft der Kategorie. Mit «Vereinbarte Nebenkosten» bekäme dieselbe Liste zwei Namen. Der Product Owner sollte bei Z. 208 entscheiden (siehe Begriffe unten).

### V-9 (Minor): Was mit der Abrechnung gespeichert wird

**Beleg.** Entwurf Punkt 7 («stored with the statement at creation»); Vorbild `calculation.service.ts:452–454`: Das Heizprofil wird mit seinen Namen in allen Sprachen gespeichert (#247).

**Behebung.** Ids und Namen der vereinbarten Kategorien in allen vier Sprachen (`name_de` … `name_en`) mit der Abrechnung speichern. Das PDF erscheint in der Sprache des Mieters, die sich ändern kann, und eine eigene Kategorie kann umbenannt oder (ohne Rechnungen) gelöscht werden. `contract_categories` braucht `ON DELETE CASCADE` für Mietvertrag und Kategorie sowie einen eindeutigen Schlüssel `(contract_id, category_id)`.

### V-10 (Minor): Folgevertrag

**Beleg.** `contract-edit.feature:118–122`: «aus dem Mietvertrag einen neuen Mietvertrag erfassen» übernimmt den Mieter und schlägt den Vertragsbeginn vor. Entscheid 2: Ein neuer Mietvertrag beginnt mit allen umlagefähigen Kategorien.

**Warum.** Ein Folgevertrag desselben Mieters übernimmt in der Praxis die Nebenkosten-Abrede. Gibt Dwello wieder alle Kategorien vor, kommen Kategorien zurück, die der Liegenschaftsverwalter im alten Vertrag ausgeschlossen hat. Ein Folgevertrag ist auch der saubere Weg für M-1, wenn sich die Nebenkosten ab einem Datum ändern.

**Behebung.** Den Product Owner fragen (Issue `entscheiden`). Vorschlag: Der Folgevertrag übernimmt die Liste des alten Vertrags.

### V-11 (Minor): Anforderungsdokument

**Beleg.** `docs/nebenkostenabrechnung-anforderungen.md:26` («… oder den Export blockieren»), `:101` («Kategorie nicht im Vertrag vereinbart → Fehler … in Dwello noch nicht vorhanden; TODO fachlich prüfen»), `:135` («vereinbarte Nebenkosten pro Vertrag» als offener Begriff).

**Behebung.** Im selben Pull Request nachführen. Umgesetzt ist: ausschliessen, im Hinweis nennen, Frage bei «neu». Die Zeilen sollen #91 und das Begriffs-Issue nennen.

### V-12 (Minor): Wortlaut der Texte (Punkt 9)

- **Frage** (Punkt 4): «Ist «Dachreinigung» im Mietvertrag von Anna Keller vereinbart?» Die Wohnung ergänzen, weil ein Mieter mehrere Mietverträge haben kann: «Ist «Dachreinigung» im Mietvertrag von Anna Keller (Wohnung 1.01) vereinbart?» Hilfe darunter: «Vereinbart ist sie, wenn sie im unterschriebenen Mietvertrag steht. Nicht vereinbarte Kosten tragen Sie selbst.» (dazu der Satz aus M-1). Die Antworten «Vereinbart» / «Nicht vereinbart» sind richtig.
- **Fehler** «Bitte wählen Sie, ob diese Nebenkosten im Mietvertrag vereinbart sind.»: in Ordnung; kürzer und ohne «Bitte» wie andere Fehler: «Wählen Sie, ob diese Nebenkosten im Mietvertrag vereinbart sind.» Prüfen Sie, wie die übrigen Pflichtwahlen im Assistenten formuliert sind, und übernehmen Sie deren Form. Das Szenario Z. 43 folgt dem Text.
- **Speicherfehler** «Ihre Antwort wurde nicht gespeichert. Bitte versuchen Sie es nochmals.»: in Ordnung (sagt, was geschah und was zu tun ist).
- **Hinweis** «Nicht vereinbarte Nebenkosten»: Titel in Ordnung. Im Text ist «ändern Sie es dort» unklar («es»), und «Dwello rechnet ab» weicht vom Vorbild `statements_fee_not_agreed_text` ab. Vorschlag parallel dazu:
  > Bei diesen Mietverträgen sind die genannten Nebenkosten nicht vereinbart (Angabe beim Mietvertrag). Ihre Abrechnungen enthalten sie nicht; den Anteil dieser Wohnungen tragen Sie selbst. Steht eine davon im unterschriebenen Mietvertrag, tragen Sie sie dort nach.
  
  Eintrag: «{tenant}, Wohnung {apartment}: {categories}».
- **Feldgruppe** «Vereinbarte Nebenkosten»: in Ordnung; Hilfe siehe V-6.

### V-13 (Nit): Kommentar im Feature

**Beleg.** `statement-agreed-costs.feature:29`: «Eine Kategorie, die es beim Abschluss des Mietvertrags noch nicht gab». Der Mietvertrag läuft seit 2020; gemeint ist der Zeitpunkt, an dem er in Dwello erfasst wurde. **Behebung:** «beim Erfassen des Mietvertrags».

### V-14 (Nit): Beispiel «Dachreinigung»

**Beleg.** Z. 32 ff. Reinigung und Pflege des Dachs gelten in Merkblättern oft als Unterhalt, nicht als Betriebskosten (Art. 257b Abs. 1 OR: «Betriebskosten»); belegt habe ich das nur aus Sekundärquellen (**unsicher**). Ein Laie, der die Szenarien liest, könnte das für eine Regel halten. **Behebung:** ein eindeutigeres Beispiel, etwa «Treppenhausreinigung» (schon in `categories.feature:9` als umlagefähige eigene Kategorie). Die Beträge bleiben gleich.

### V-15 (Nit): Wann der Assistent fragt

**Beleg.** Entwurf Punkt 1 «when the category has costs in the period»; Vorbild `invoice-completeness.service.ts:140` (`current.total > 0`). Eine Gutschrift (negative Rechnung) einer neuen Kategorie ändert den Betrag ebenfalls. **Behebung:** fragen, wenn der Mietvertrag in den abgerechneten Tagen der Rechnungen Mietstage hat und die Summe nicht 0 ist.

## Antworten auf die Fragen

1. **Datenmodell:** einverstanden (drei Zustände: vereinbart, nicht vereinbart, unbeantwortet). Ergänzungen: V-9 (Schlüssel, Cascade), V-4 (Merkmal «übernommen»), M-1 (Datum oder Issue). Unbeantwortet = nicht abgerechnet ist rechtlich die sichere Seite (Art. 257a Abs. 2 OR). Rechnungen ohne Kategorie: M-3.
2. **Lesart:** A, siehe V-1, mit dem Hinweis «Neu» als Ersatz für die Nachfrage bei vordefinierten Kategorien.
3. **Bestehende Mietverträge:** im Grundsatz ja, mit den Ergänzungen in V-4. Gespeicherte Abrechnungen bleiben unverändert: richtig.
4. **Frage in Schritt 3:** richtig platziert (vor der Vorschau, Antwort sofort beim Mietvertrag). Neuer Text für «Neu»: V-1; Frage und Hilfe: V-12, M-1; Name des Schritts: V-5.
5. **Hinweis in Schritt 3:** richtig, Wortlaut V-12.
6. **Anteil der Wohnung ohne Vereinbarung trägt der Vermieter:** bestätigt. Art. 257b Abs. 1 OR beschränkt die Nebenkosten auf «die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen». Was über den Verteilschlüssel auf eine andere Wohnung fällt, hängt nicht mit dem Gebrauch der übrigen Mieter zusammen. Gleich geregelt ist der Leerstand (Art. 7 Abs. 1 VMWG; Entscheid #188, `docs/nebenkostenabrechnung-anforderungen.md:144`). Die Übertragung auf eine fehlende Vereinbarung ist eine Analogie ohne eigenen Normtext (**unsicher** im Sinne von «nicht wörtlich belegt», in der Praxis unbestritten). Durch Z. 54–55 belegt.
7. **PDF:** M-2 (nur Kategorien mit Position) und V-9 (Abbild in allen Sprachen). Abrechnungen von vorher ohne Zeile: richtig.
8. **Begriffe:** unten.
9. **Texte:** V-6, V-12.

## Fehlende Begriffe (Issue mit den Labels `fachlich`, `entscheiden`)

**Vereinbarte Nebenkosten** (Abschnitt «Mieter und Mietverträge» oder «Nebenkostenkategorien»):

> Die Kategorien, die der Mietvertrag dem Mieter als Nebenkosten auferlegt (Art. 257a Abs. 2 OR). Nur sie fliessen in seine Nebenkostenabrechnung; den Anteil seiner Wohnung an den übrigen trägt der Vermieter. Ein neuer Mietvertrag beginnt mit allen umlagefähigen Kategorien; eine Kategorie, die danach umlagefähig wird oder für das Gebäude neu ist, ist nicht vereinbart, bis der Liegenschaftsverwalter es angibt. | `contract_categories` (`agreed`)

**Nicht vereinbart** (Zustand): «Der Liegenschaftsverwalter hat angegeben, dass der Mietvertrag die Kategorie nicht vorsieht; Dwello fragt nicht mehr nach.» | `agreed = false`

Dazu der Vorschlag, Z. 208 anzupassen: «**Umlagefähige Nebenkosten** | Kosten einer umlagefähigen Kategorie. Bezahlen muss der Mieter sie nur, wenn sie zu den vereinbarten Nebenkosten seines Mietvertrags gehören.»

Übersetzungen (nach `docs/design/i18n-begriffe.md:54`, Nebenkosten = frais accessoires / spese accessorie / utility costs; «vereinbart» wie bei der Verwaltungspauschale: `messages/fr.json:712` «convenus», `it.json:712` «pattuite», `en.json:712` «agreed»):

| de | fr | it | en |
|----|----|----|----|
| Vereinbarte Nebenkosten | Frais accessoires convenus | Spese accessorie pattuite | Agreed utility costs |
| Nicht vereinbart | Non convenus | Non pattuite | Not agreed |
| Im Mietvertrag vereinbarte Nebenkosten: (PDF) | Frais accessoires convenus dans le contrat de bail : | Spese accessorie pattuite nel contratto di locazione: | Utility costs agreed in the rental contract: |

fr mit geschütztem Leerzeichen vor dem Doppelpunkt.

## Nicht bestätigt

- **BGE 135 III 591** («klar und bestimmt umschrieben», Sammelklausel): nur Regeste und Treffer aus `mmx search` (bger.ch, servat.unibe.ch, publikationen.sg.ch); Urteil nicht im Volltext gelesen. Betrifft M-3 und V-6.
- **Dach- oder Dachrinnenreinigung als Unterhalt** (V-14): keine Norm, kein Urteil geprüft; nur die Einordnung nach Art. 257b Abs. 1 OR («Betriebskosten») gegenüber Unterhalt.
- **Rückforderung zu viel bezahlter Nebenkosten** aus versendeten Abrechnungen (V-4): Rechtsgrund und Frist nicht geprüft; Dwello ändert gespeicherte Abrechnungen ohnehin nicht (#120).
- **Pauschale Nebenkosten** (Art. 4 Abs. 2 VMWG): nicht geprüft, ob Dwello Pauschalen kennt; ohne das Modell offen, ob die Liste bei einer Pauschale gilt.
- **Formulierung der übrigen Pflichtfehler im Assistenten** (V-12, «Bitte» oder nicht): `messages/de.json` nicht vollständig durchgesehen.
- **`tests/a11y/screens.json` und `sprachen-bildschirme.feature`**: nicht geprüft, ob die neuen Zustände (Frage, Fehler, Speicherfehler, Hinweis, Feldgruppe, PDF-Zeile) dort geplant sind; der Plan nennt sie nur allgemein («a11y screens and languages»).
- **Step-Definitionen** der neuen Schritte: noch nicht geschrieben; geprüft habe ich nur die vorhandenen Seeds (Fläche als Verteilschlüssel, `predefinedCategory` über `nameDE`).
