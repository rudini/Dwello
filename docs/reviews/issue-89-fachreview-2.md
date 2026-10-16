# Fachreview 2: Umsetzung #89/#124/#60 (Verwaltungspauschale je Mietvertrag)

Gegenstand: `git diff 6d844dc 0c7a596` im Worktree `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-89-fach2` (Commit 0c7a596). Geprüft habe ich die Texte in `messages/{de,fr,it,en}.json` (`contracts_fee_*`, `contracts_error_fee_choice`, `statements_fee_*`, `glossary_fee_text`, `config_help_management_fee`, `statements_error_fee`), `RentStep.svelte`, `FeeNotAgreed.svelte`, `statements/generate/+page.server.ts`, `calculation.service.ts`, die Migration `0007_contract_management_fee.sql`, die Demo-Daten und die nachgeführten Fachdokumente. Rollen: Verwalter und Mietrecht. Rechtstexte sind nicht betroffen. Der Bericht nennt nur neue oder noch offene Punkte.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-3 | Mietrecht | Minor | Der Hilfetext zu Art. 269d OR sagt nicht, ab wann eine neu eingeführte Pauschale gilt (nächster Kündigungstermin). Dwello rechnet sie aber für die ganze Abrechnungsperiode |
| M-4 | Mietrecht | Minor | `config_help_management_fee`: «Üblich sind bis 3 %, höchstens 10 %» liest sich wie ein zulässiger Höchstsatz |
| V-5 | Verwalter | Minor | (noch offen) PRD 5.8 «Features» und «Use Cases» widersprechen der neuen Übersicht im selben Abschnitt |
| V-11 | Verwalter | Minor | Hinweis «Heizprofil und Verwaltungspauschale kommen aus den Einstellungen» ist falsch, wenn das Heizprofil aus einer Abrechnung kommt, die keinen Satz des Laufs hat |
| V-12 | Verwalter | Minor | Ändert der Vermieter die Vereinbarung an einem Mietvertrag mit Entwurf, bleibt der Entwurf beim alten Satz. Es gibt keinen Hinweis; bei «Ja» → «Nein» bleibt eine nicht vereinbarte Pauschale im Entwurf |
| V-13 | Verwalter | Minor | fr/it `glossary_fee_text` und fr `statements_fee_not_agreed_text` sagen «im (Papier-)Mietvertrag angeben/ergänzen» statt «in Dwello beim Mietvertrag eintragen» |
| V-14 | Verwalter | Nit | Der Satz des Laufs kann aus einem veralteten Entwurf kommen (Mietvertrag nach dem Erstellen von «Nein» auf «Ja, zum Satz des Abrechnungslaufs» geändert) |
| V-15 | Verwalter | Nit | `statements_fee_not_agreed_text` sagt «keine eingetragen», der Titel «ohne vereinbarte»; bei bewusst gewähltem «Nein» passt «eingetragen» nicht |
| V-16 | Verwalter | Nit | `contracts_fee_shown_own` zeigt in fr/it «2.5 %» statt «2,5 %» (gleiches Muster wie die bestehende Vorschau) |

Runde-1-Befunde: M-1, M-2, V-1, V-2, V-6, V-7 sind behoben (siehe «Bestätigt»). V-5 ist nur teilweise behoben (siehe unten). V-3 und V-4: Die Ablehnung kann ich nachvollziehen. Die Grenzen 10 / 10,01 decken `management-fee.pg.test.ts:92-138` und `:199` ab. V-8 ist in #286, V-9 und V-10 bleiben Nits. Dazu nehme ich nichts mehr auf.

## Bestätigt

- **M-1 behoben.** `contracts_fee_help` (`messages/de.json:676`) erscheint im Assistenten und im Bearbeitungsformular, denn `ContractForm.svelte:257` verwendet `RentStep`. Der Text beginnt mit «Wählen Sie, was im unterschriebenen Mietvertrag steht» und endet mit dem Hinweis auf das amtliche Formular. Das Szenario heisst jetzt «Vereinbarte Verwaltungspauschale nachtragen» (`contract-edit.feature:101-107`). Art. 269d Abs. 3 OR (Fedlex, SR 220, Filestore-Fassung «Stand am 1. Januar 2026»): «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.» «Amtliches Formular» ist für das Gesetzeswort «vom Kanton genehmigten Formular» (Abs. 1) gängig und verständlich. Die Übersetzungen fr «formule officielle (art. 269d CO)», it «modulo ufficiale (art. 269d CO)» und en «official form (Art. 269d CO)» stimmen.
- **V-7 behoben.** Derselbe Hilfetext ordnet die drei Optionen dem Vertragstext zu: Prozentsatz, nur «Verwaltungskosten werden verrechnet», nichts. Das entspricht der Praxis.
- **M-2 behoben.** `RentStep.svelte:88-94` zeigt `statements_fee_above_*` ab einem eigenen Satz über 3 %. Grundlage: Art. 4 Abs. 3 VMWG (Fedlex, SR 221.213.11, zitiert in Runde 1): «… im Rahmen der üblichen Ansätze angerechnet werden.»
- **V-1 behoben.** `statements/generate/+page.server.ts:41-47` nimmt den Satz nur aus einer Abrechnung, deren Mietvertrag «Ja, zum Satz des Abrechnungslaufs» hat. Sonst nimmt es die Einstellungen. Unit-Test `statement-generate-actions.test.ts:101-150`, Szenario `statement-management-fee.feature` «Neue Abrechnung übernimmt den Satz des Abrechnungslaufs». Restfall: V-14.
- **V-2 behoben.** Die Texte stimmen in allen vier Sprachen mit der Regel in `calculation.service.ts:256-264` überein: «Nein» = 0, eigener Satz vor dem Satz des Laufs, sonst Satz des Laufs bzw. Einstellung. Das gilt für `statements_fee_help`, `statements_fee_of_own`, `glossary_fee_text` (de/en; fr/it siehe V-13) und `config_help_management_fee` (siehe M-4). Der Hinweis «löschen Sie seinen Entwurf» ist zu Recht entfallen.
- **V-6 behoben.** Die Migration setzt `management_fee_agreed BOOLEAN NOT NULL DEFAULT FALSE` mit `CHECK (management_fee_percent BETWEEN 0 AND 10)`. Der Test «ohne Angabe ist keine vereinbart» steht in `management-fee.pg.test.ts:174`. Die Demo-Daten (`demo-data.sql:89-92`) haben je einen Fall pro Wahl, und `demo-data.pg.test.ts` prüft, dass die Abrechnungen der Wahl folgen (Kevin 0, Marco 2.5).
- **V-5 teilweise.** `nebenkostenabrechnung-anforderungen.md:59` und Regel 9 (`:149`) stimmen jetzt mit #89/#124 überein. Ebenso PRD 5.8 «Overview» (`docs/PRD-Dwello.md:472`), `data-model.md` und `backend/CLAUDE.md`. Den Rest siehe V-5 unten.
- **Fehlermeldungen.** `contracts_error_fee_choice` «Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist.» ist klar, sagt was zu tun ist und nennt keine Vorgabe (#89). `statements_error_fee` «von 0 bis 10» entspricht #124. Er wird auch für den eigenen Satz verwendet (`contract-form.ts:108-112`), passend zur Grenze im Backend (`routes/contracts.ts:34`, Regex `^(10(\.0{1,2})?|\d(\.\d{1,2})?)$`: 10 und 10.00 werden angenommen, 10.01 abgewiesen). fr/it/en sind sinngleich.
- **Begriffe (i18n).** Die Übersetzungen entsprechen `docs/design/i18n-begriffe.md`: Verwaltungspauschale = frais de gestion / spese di gestione / management fee (`:61`), Mietvertrag = contrat de bail / contratto di locazione / rental contract (`:25`), Abrechnungslauf = établissement des décomptes / allestimento dei conteggi / statement run (`:56`, ❓ wie im Glossar markiert; «Satz des Abrechnungslaufs» und «eigener Satz» sind in #286 offen, mit Marker in `RentStep.svelte:25`). Die französischen Guillemets haben ein geschütztes Leerzeichen (geprüft mit `od -c`).
- **API ohne Angabe** (aus Runde 1 «Nicht bestätigt»): Fehlt `managementFeeAgreed`, gilt «Nein» (`routes/contracts.ts:33` optional, Spalte `DEFAULT FALSE`). Die Pflichtwahl verlangt nur die UI. Fachlich ist das die sichere Seite (Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»). In Ordnung.
- **Liste im Schritt «Einstellungen».** `statement-generation.ts:84-89` nennt nur Mietverträge ohne Vereinbarung, die in der Periode noch keine Abrechnung haben. Das entspricht Regel 9. Die Links führen zur Detailseite des Mietvertrags (Szenario «Mietvertrag ohne vereinbarte Verwaltungspauschale öffnen»).

### Nachrechnung

`calculateManagementFee` rundet auf den Rappen (`roundToRappen`, `pdf-format.ts:17`), nur der Saldo wird auf 5 Rappen gerundet (`roundTo5Rappen`).

| Fall | Rechnung | Ergebnis |
|------|----------|----------|
| Eigener Satz 2,5 % (Marco), Zwischensumme 1234.56 | 1234.56 × 2.5 % = 30.864 → 30.86 | Kosten 1265.42 |
| Satz des Laufs 10 % (Grenze), Zwischensumme 250.00 | 25.00 | 275.00; 10.01 wird in UI, API und Einstellung abgewiesen |
| «Nein», Rückerstattung: Zwischensumme 2400.00, Akonto 12 × 250 = 3000.00 | Pauschale 0 | Saldo −600.00 (Rückerstattung) |
| Eigener Satz 0 % | 0.00, keine PDF-Zeile | Anzeige «Vereinbart, 0 %» (V-8, #286) |
| Mieterwechsel 2024, 250.00 Jahreskosten: Vormieter «Nein» bis 30.06., Nachmieter «Ja» 3 % ab 01.07. | 250 × 182/366 = 124.32; 250 × 184/366 = 125.68, Pauschale 3.77 | 124.32 bzw. 129.45, Saldo je auf 5 Rappen |
| Scenario #89 (Anna «Nein», Beat 2 %, Lauf 3 %) | 250 + 0; 750 + 15 | 250.00 / 765.00 (`statement-management-fee.feature`) |

Korrektur zu Runde 1: Dort hatte ich die Kostenanteile auf 5 Rappen gerundet (125.70, 3.75). Richtig sind 125.68 und 3.77, nur der Saldo wird auf 5 Rappen gerundet. Das ändert keinen Befund.

## Befunde

### M-3 (Mietrecht, Minor): Ab wann gilt eine neu eingeführte Pauschale?

- Beleg: `contracts_fee_help` (`messages/de.json:676`): «Eine neue Verwaltungspauschale während der Mietdauer müssen Sie dem Mieter mit dem amtlichen Formular mitteilen (Art. 269d OR).» Art. 269d Abs. 1 OR (Fedlex, Stand 1.1.2026): «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen. Er muss dem Mieter die Mietzinserhöhung mindestens zehn Tage vor Beginn der Kündigungsfrist auf einem vom Kanton genehmigten Formular mitteilen und begründen.» Nach Abs. 3 gilt das auch für neue Nebenkosten. `calculation.service.ts:390` rechnet die Pauschale auf die eigenen Nebenkosten der ganzen Abrechnungsperiode. Am Mietvertrag gibt es kein Datum, ab dem sie gilt.
- Warum falsch: Der Text erweckt den Eindruck, mit dem Formular sei die Sache erledigt. Ein Vermieter, der im Februar das Formular schickt (wirksam z.B. per 30.09.) und sofort «Ja» einträgt, rechnet die Pauschale für die ganze Periode ab, also auch für die Monate vor dem Termin. Für diese Monate ist sie nicht geschuldet.
- Behebung: Text ergänzen, z.B. de: «… mit dem amtlichen Formular mitteilen (Art. 269d OR). Sie gilt erst ab dem nächsten Kündigungstermin. Tragen Sie sie darum erst ein, wenn die erste Abrechnungsperiode nach diesem Termin beginnt.» (fr/it/en sinngleich; fr «prochain terme de résiliation», it «prossimo termine di disdetta», en «next termination date»). Die Alternative wäre ein Gültig-ab-Datum am Mietvertrag. Das ist eine Produktentscheidung, nicht nötig fürs MVP.

### M-4 (Mietrecht, Minor): «höchstens 10 %» in der Hilfe der Einstellungen

- Beleg: `config_help_management_fee` (`messages/de.json`, Diff `:1138`): «Üblich sind bis 3 %, höchstens 10 %.» fr «10 % au plus», it «al massimo 10 %», en «10 % at most». Glossar `UBIQUITOUS_LANGUAGE.md:154`: «Ein höherer Satz muss dem tatsächlichen Aufwand entsprechen (Art. 4 Abs. 3 VMWG).» Anforderungen `:59`: «höchstens 10 % (#124, Plausibilitätsgrenze gegen Tippfehler, kein Rechtssatz)».
- Warum falsch: Direkt nach «üblich» liest der unerfahrene Vermieter «höchstens 10 %» als erlaubten Rahmen. Die Grenze ist aber nur eine Tippfehlersperre. Was über 3 % liegt, muss nach Art. 4 Abs. 3 VMWG dem Aufwand entsprechen.
- Behebung: z.B. de «Üblich sind bis 3 %; ein höherer Satz muss Ihrem tatsächlichen Aufwand entsprechen. Dwello nimmt höchstens 10 % an.» (fr «Dwello accepte au plus 10 %», it «Dwello accetta al massimo il 10 %», en «Dwello accepts at most 10 %»). Oder den Teil mit 10 % weglassen: Die Fehlermeldung nennt die Grenze ohnehin.

### V-5 (Verwalter, Minor, noch offen): PRD 5.8 widerspricht sich

- Beleg: `docs/PRD-Dwello.md:472` (neu) sagt «applies only where the rental contract agrees one (#89)». Im selben Abschnitt `:475` steht aber «Global management cost percentage (0% or more; …)», `:476` «The rate of a statement run applies to every rental contract in it; Dwello does not check whether the fee is agreed in the rental contract», `:496` «Validation: the percentage may not be negative». Dazu kommt `:1854` «up to 3% of total costs», ein älterer Fehler: Grundlage sind die eigenen Nebenkosten.
- Behebung: `:475` «0–10 %», `:476` durch die Regel je Mietvertrag ersetzen (oder streichen, die Übersicht sagt es schon), `:496` «from 0 to 10 % (#124)», `:1854` «of the tenant's own utility costs».

### V-11 (Verwalter, Minor): Herkunftshinweis falsch, wenn kein Satz des Laufs gefunden wird

- Beleg: `statements/generate/+page.server.ts:70-72` nimmt das Heizprofil weiterhin aus `others[0]` (irgendeine Abrechnung der Periode). `:79` setzt `fromStatements: !!pick.runRate`. `PresetNotice.svelte:25-28` zeigt dann `statements_preset_from_settings`: «Heizprofil und Verwaltungspauschale kommen aus den Einstellungen.» Der Unit-Test `statement-generate-actions.test.ts:146-149` verlangt genau diesen Fall: Abrechnungen nur von «Nein» und eigenem Satz, Ergebnis `fromStatements: false`.
- Warum falsch: Das Heizprofil kommt in diesem Fall aus den bestehenden Abrechnungen, nicht aus den Einstellungen. Der Hinweis soll gerade sagen, dass der Lauf gleich eingestellt ist wie die übrigen Abrechnungen. Ein anderes Heizprofil für den Nachzügler verteilt die Heizkosten anders als bei den übrigen Mietern. Liest der Vermieter «aus den Einstellungen», hält er das Profil für eine blosse Vorgabe und ändert es eher.
- Behebung: Herkunft getrennt angeben, z.B. `fromStatements: !!pick.other` für das Heizprofil, und für diesen Fall ein dritter Text: «Das Heizprofil ist wie bei den übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode eingestellt, die Verwaltungspauschale kommt aus den Einstellungen. Prüfen Sie sie und gehen Sie weiter zur Vorschau.» (vier Sprachen). Unit-Test im bestehenden Fall ergänzen.

### V-12 (Verwalter, Minor): Geänderte Vereinbarung und bestehender Entwurf

- Beleg: `contract.service.ts:333-344` weist nur geänderte Daten ab, die Mietstage einer gespeicherten Abrechnung ändern würden (`BilledDaysError`, Hinweis `contracts_billed_draft_one`). Ändert sich `managementFeeAgreed` oder `managementFeePercent`, wird ohne Hinweis gespeichert. Der Entwurf behält `utility_statements.management_fee_percent` und `management_fee`; Neuberechnung ist geschützt (`statement.service.ts:403`). Die Liste im Assistenten (`statement-generation.ts:87`) blendet abgerechnete Mietverträge aus und kann darum auch nicht helfen.
- Warum: Der typische Ablauf nach der Migration ist: Lauf erstellen, Liste «Ohne vereinbarte Verwaltungspauschale» sehen, Mietvertrag korrigieren. Wer den Lauf schon erstellt hat und dann korrigiert, verschickt den Entwurf mit dem alten Satz. Schlimm ist die Richtung «Ja» → «Nein». Wer den Mietvertrag nachliest und die Pauschale entfernt, verschickt trotzdem eine nicht vereinbarte Pauschale (Art. 257a Abs. 2 OR). Beim Akonto gibt es dasselbe Muster schon vorher. Bei der Pauschale ist es aber eine Rechtsfrage, und der neue Hinweis lädt genau zu dieser Korrektur ein.
- Behebung: Nach dem Speichern einer geänderten Vereinbarung die Entwürfe des Mietvertrags nennen, mit demselben Ablauf wie `contracts_billed_draft_one` (z.B. «Die Nebenkostenabrechnung {number} (Entwurf) wurde mit der bisherigen Verwaltungspauschale berechnet. Löschen Sie den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.»). Versendete Abrechnungen bleiben unverändert. Gehört das nicht mehr in diesen Change: Issue `fachlich` mit dem Fall «Ja → Nein bei Entwurf».

### V-13 (Verwalter, Minor): fr/it sagen «im Mietvertrag angeben» statt «in Dwello eintragen»

- Beleg:
  - de `glossary_fee_text`: «Nur zulässig, wenn im Mietvertrag vereinbart; das tragen Sie beim Mietvertrag ein.»
  - fr: «… ; vous l’indiquez dans le contrat de bail.»
  - it: «… ; lo indica nel contratto di locazione.»
  - fr `statements_fee_not_agreed_text`: «Si le contrat de bail en prévoit, complétez-le.»
  - en ist richtig: «you record that with the rental contract», «record it there».
- Warum falsch: «indiquer dans le contrat de bail» bzw. «indicare nel contratto» heisst, es in den (Papier-)Vertrag zu schreiben. «complétez-le» bezieht sich auf «le contrat de bail», also: den Vertrag ergänzen. Gerade das wäre eine einseitige Vertragsänderung (M-1). Gemeint ist: in Dwello beim Mietvertrag eintragen.
- Behebung: fr glossaire «… ; vous l’enregistrez avec le contrat de bail dans Dwello.», fr notice «Si le contrat de bail en prévoit, saisissez-les dans le contrat de bail dans Dwello.» bzw. «… enregistrez-les pour ce contrat de bail.». it glossario «… ; lo registra presso il contratto di locazione.»

### V-14 (Verwalter, Nit): Satz des Laufs aus veraltetem Entwurf

- Beleg: `+page.server.ts:43-47` prüft die heutige Vereinbarung des Mietvertrags, nicht die beim Erstellen. Fall: Anna war «Nein», ihr Entwurf hat 0.00. Danach wird Anna auf «Ja, zum Satz des Abrechnungslaufs» korrigiert, der Entwurf aber nicht gelöscht (V-12). `find` kann nun Annas 0.00 als Satz des Laufs nehmen.
- Behebung: Mit V-12 erledigt, wenn der Entwurf nach der Korrektur gelöscht wird. Sonst den Satz des Laufs getrennt an der Abrechnung speichern (Runde 1, V-1, erste Variante).

### V-15 (Verwalter, Nit): «eingetragen» und «vereinbart»

- Beleg: Titel `statements_fee_not_agreed_title` «Ohne vereinbarte Verwaltungspauschale», Text «Bei diesen Mietverträgen ist keine Verwaltungspauschale eingetragen.»
- Behebung: «Bei diesen Mietverträgen ist keine Verwaltungspauschale vereinbart (Angabe beim Mietvertrag).» So stimmt der Text auch bei einem bewusst gewählten «Nein». fr/it/en entsprechend («convenus», «pattuite», «agreed»).

### V-16 (Verwalter, Nit): Dezimalzeichen in fr/it

- Beleg: `contract-form.ts:33` setzt `String(parsePercent(ownRate))` ein. Ergebnis «Convenus, 2.5 %» / «Pattuite, 2.5 %». Die Fehlermeldungen in fr/it zeigen «2,5». Die Vorschau (`PreviewStep.svelte:68`) hat dasselbe Muster schon vorher.
- Behebung: Prozentsatz nach Sprache formatieren (fr/it Komma), zusammen mit der Vorschau. Kein Muss für diesen Change.

## Fehlende Begriffe

Nichts Neues. «Vereinbarte Verwaltungspauschale», «Eigener Satz», «Satz des Abrechnungslaufs» sind in #286 (`fachlich`, `entscheiden`) und als Marker in `RentStep.svelte:25` erfasst. Neu bekommt «Satz des Abrechnungslaufs» eine fr/it/en-Fassung («taux de l’établissement des décomptes», «aliquota dell’allestimento dei conteggi», «rate of the statement run»). Sie hängt am ❓-Begriff «Abrechnungslauf» (`i18n-begriffe.md:56`, #83). Vorschlag für #286: diese drei Fassungen dort mit aufnehmen.

## Nicht bestätigt

- **Fristen nach Art. 269d Abs. 1 OR im Einzelfall** (Kündigungstermine nach Ortsgebrauch, Zugang zehn Tage vor Beginn der Kündigungsfrist): Den Gesetzeswortlaut habe ich aus dem Fedlex-Filestore (OR, Stand 1.1.2026) zitiert. Wie Dwello den Termin bestimmen könnte, habe ich nicht geprüft; M-3 schlägt deshalb nur einen Hinweis vor.
- **Art. 269d Abs. 4 OR** (neu seit 1.10.2025, AS 2025 197): «Für die Mitteilung einer Mietzinserhöhung und anderer einseitiger Vertragsänderungen genügt eine auf mechanischem Weg nachgebildete Unterschrift auf dem vorgeschriebenen Formular.» Für den Hilfetext unerheblich; erwähnt, weil die Fassung neuer ist als die Quellen in `nebenkostenabrechnung-anforderungen.md`.
- **Akonto-Änderung bei bestehendem Entwurf** (V-12, «gleiches Muster schon vorher»): Abgeleitet aus `contract.service.ts:333-344` (nur Datumsprüfung). Ob die Bearbeitungsseite nach einer Akonto-Änderung irgendwo auf Entwürfe hinweist, habe ich in der UI nicht geprüft.
- **Verhalten der UI**: Szenarien und E2E-Läufe habe ich nicht ausgeführt. Das betrifft Fokus, die Rückkehr vom Mietvertrag in den Assistenten, a11y und die Darstellung bei 390 px. Geprüft habe ich nur Code und Texte. Die Rückkehr in den Assistenten nach dem Korrigieren über einen Link aus `FeeNotAgreed` ist Sache des Persona-Reviews.
- **Glossar `:154` «Üblich sind etwa 3 %» und UI «bis 3 %»**: unverändert aus Runde 1, Sache des Product Owners.
