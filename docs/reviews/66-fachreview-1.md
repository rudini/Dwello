# Fach-Review #66, Runde 1 (Commit c5288844, vor der Umsetzung)

Gegenstand: @wip-Szenarien in `tests/e2e/features/contract-new.feature:153–165` und `tests/e2e/features/contract-edit.feature:172–184`, ihre Steps (`tests/e2e/steps/contract-form.steps.ts:433–460`) und die vorgeschlagenen Texte 1–4 (noch nicht in `messages/de.json`).

Gesetzestexte von Fedlex (Filestore): OR Fassung 1.1.2026 (`eli/cc/27/317_321_377/20260101`), VMWG Fassung 1.10.2025 (`eli/cc/1990/835_835_835/20251001`).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Text 2: «Ohne Akonto können Sie diesem Mieter keine Nebenkosten abrechnen» ist rechtlich falsch und widerspricht Dwello. Nebenkosten mit Abrechnung, aber ohne Akonto, sind zulässig, und Dwello rechnet sie ab. Die Formulierung des Entscheids braucht eine Produktentscheidung. |
| M-2 | Mietrecht | Major | Text 4 (befristet) lässt Formular, Begründung und Nichtigkeit weg (Art. 269d Abs. 2 OR, Art. 19 Abs. 2 VMWG). Das ist derselbe Befund wie W3f M-1, offen in #388. |
| V-1 | Verwalter | Major (bestand schon vorher, #90) | Texte 3 und 4: «gelten in Dwello sofort» stimmt für das Akonto nicht. Dwello rechnet ein geändertes Akonto rückwirkend für die ganze Abrechnungsperiode. |
| V-2 | Verwalter | Minor | «Pauschale» steht nicht im Glossar und ist im selben Schritt mit «Verwaltungspauschale» verwechselbar. Dwello kann den Betrag der Pauschale nirgends erfassen. |
| M-3 | Mietrecht | Minor | Text 3 nennt nur die Mietzinserhöhung. Im selben Formular ändert man auch das Akonto, und dafür gilt dieselbe Regel (Art. 269d Abs. 3 OR). |
| M-4 | Mietrecht | Minor | Text 3 erscheint auch beim gekündigten Mietvertrag. Dort ist der nächste Kündigungstermin das Vertragsende, eine Erhöhung bringt also nichts mehr. |
| M-5 | Mietrecht | Minor | Text 4: Mit «ausser der Mietvertrag sieht sie vor» genügt scheinbar jede Klausel. Gültig sind aber nur eine Index- oder Staffelmiete unter den Bedingungen von Art. 269b/269c OR. |
| V-3 | Verwalter | Minor | Szenarien: Sie prüfen nicht, welcher Satz fehlt (befristet/unbefristet). Der Fall «gekündigt» fehlt. Der Titel von «Ohne Akonto …» behauptet die bestrittene Regel. Die Anweisung zum Häkchen wird nicht geprüft. |
| V-4 | Verwalter | Minor | Text 2 erscheint schon beim leeren Feld. Die Anweisung «Entfernen Sie … alle Häkchen» steht vor «tragen Sie es ein». Ein Laie entfernt so vorschnell die Häkchen. |
| V-5 | Verwalter | Nit | Text 1: «z. B.» passt nicht zu «zum Beispiel» im Nachbarfeld (`contracts_additional_help`), und der Entscheid schreibt «z.B.». |
| M-6 | Mietrecht | Nit | Text 3: Für eine Staffelmiete genügt seit 1.10.2025 die Schriftform (Art. 269d Abs. 5 OR). Die Nichtigkeit wegen Kündigungsandrohung (Abs. 2 lit. c) fehlt. |

---

## Bestätigt (mit Quelle)

- **Text 1** stimmt. Art. 257a Abs. 2 OR (Fedlex): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Die Beispiele Heizung und Wasser decken sich mit Art. 257b Abs. 1 OR: «… wie Heizungs-, Warmwasser- und ähnliche Betriebskosten …». «Wird mit der Nebenkostenabrechnung verrechnet» übernimmt die Glossar-Definition von Akonto (`UBIQUITOUS_LANGUAGE.md:50`). Der Text setzt Option A aus dem Entscheid von #66 um.
- **Text 2, Anweisung «alle Häkchen entfernen»**: Für beide genannten Fälle ist sie richtig.
  - Keine Nebenkosten vereinbart: Dann schuldet der Mieter keine (Art. 257a Abs. 2 OR).
  - Pauschale: Art. 4 VMWG trennt die beiden Wege. Abs. 1: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Abs. 2: «Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.» Eine Pauschale wird also nicht abgerechnet, so steht es auch in `docs/nebenkostenabrechnung-anforderungen.md:38`: «Verträge mit Pauschale erhalten keine Abrechnung».
  - Der Ort stimmt: «unten bei «Vereinbarte Nebenkosten»» liegt in `RentStep.svelte` unter dem Hinweis (Z. 73–74 und 116–119). Das Label lautet `contracts_agreed_costs_label` = «Vereinbarte Nebenkosten».
- **Text 3**, Kern zu Art. 269d OR (Fedlex):
  - Abs. 1: «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen. Er muss dem Mieter die Mietzinserhöhung mindestens zehn Tage vor Beginn der Kündigungsfrist auf einem vom Kanton genehmigten Formular mitteilen und begründen.»
  - Abs. 2: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet; c. mit der Mitteilung die Kündigung androht oder ausspricht.»
  - «frühestens auf den nächsten Kündigungstermin», «begründet», «amtliches Formular», «10 Tage vor Beginn der Kündigungsfrist» und «ohne Formular oder Begründung nichtig» entsprechen Abs. 1 und Abs. 2 lit. a/b. Der Text ist wortgleich mit dem beschlossenen `statements_akonto_raise` (`messages/de.json:1076`), wie es der Entscheid verlangt.
  - «Kündigungstermin» und «Kündigungsfrist» sind im Glossar definiert (Z. 39, 41). «Mietzins» ist als Synonym der Nettomiete im Glossar (Z. 48).
- **Text 4 im Grundsatz**: Eine eigene Variante für befristete Mietverträge ist richtig und nötig. Ohne sie würde Text 3 einem befristeten Mietvertrag einen Kündigungstermin unterstellen. Das Glossar definiert Kündigungstermin nur für unbefristete Verträge (Z. 39).
  - Art. 255 Abs. 2 OR: «Befristet ist das Mietverhältnis, wenn es ohne Kündigung mit Ablauf der vereinbarten Dauer endigen soll.»
  - Art. 266 OR: «1 Haben die Parteien eine bestimmte Dauer ausdrücklich oder stillschweigend vereinbart, so endet das Mietverhältnis ohne Kündigung mit Ablauf dieser Dauer. 2 Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.»
  - Daraus folgt «erst nach dem Vertragsende» (so auch W3f-Review, `docs/reviews/w3f-fachreview-1.md:19`).
  - Text 4 liegt über dem Entscheid von #66 hinaus, der nur Art. 269d nennt. Er übernimmt aber den von #76 beschlossenen Satz, also keine neue Regel. Formular und Begründung fehlen aber (M-2).
- **«Hinweis hält nicht auf»**: Das bestehende Szenario «Unbefristeten Mietvertrag erfassen» (`contract-new.feature:13–17`) speichert einen Mietvertrag ohne Akonto. `advancePaymentNotice()` (`src/lib/contract-wizard.ts:76–78`) gibt nur einen Text zurück und blockiert nichts.
- **Steps**: «mietet die Wohnung … befristet von … bis … mit … Franken Akonto» gibt es (`tests/e2e/steps/contracts.steps.ts:36`). Ebenso «erfasst einen Mietvertrag für die Wohnung» und «bis zur Miete weitergeht» (`contract-form.steps.ts:400, 407`). Die Grundlage von `contract-edit.feature:8–12` ergibt einen laufenden unbefristeten Mietvertrag (seit 2024-04-01, ohne Ende), also `running` (`ContractForm.svelte:67–69`).

---

## M-1 (Major, Mietrecht): «Ohne Akonto können Sie … keine Nebenkosten abrechnen» stimmt weder rechtlich noch in Dwello

**Beleg.** Text 2, erster Satz. Entscheid #66: «no Nebenkosten can be billed for it (none agreed, or a Pauschale)». Laut Auftrag erstellt Dwello für einen Mietvertrag mit Akonto 0 trotzdem Abrechnungen und rechnet die angekreuzten Nebenkosten ab. `calculateTotalAdvancePayments` (`backend/src/services/calculation.service.ts:231–249`) ergibt dann 0, der Saldo ist die volle Nachzahlung. Der heutige Text sagt genau das: «Ohne Akonto bezahlt der Mieter alle Nebenkosten erst mit der Nebenkostenabrechnung.» (`messages/de.json:662`).

**Warum falsch.** Kein Gesetz macht ein Akonto zur Bedingung einer Abrechnung:
- Art. 257a Abs. 2 OR verlangt nur eine besondere Vereinbarung.
- Art. 4 Abs. 1 VMWG regelt die Erhebung «aufgrund einer Abrechnung» ohne Vorschuss.
- Art. 257c OR: «Der Mieter muss den Mietzins und allenfalls die Nebenkosten am Ende jedes Monats, spätestens aber am Ende der Mietzeit bezahlen, wenn kein anderer Zeitpunkt vereinbart oder ortsüblich ist.»

Nebenkosten «nach Aufwand, jährliche Abrechnung, ohne Akonto» sind selten, aber gültig. Ein Vermieter mit so einem Mietvertrag entfernt nach Text 2 alle Häkchen und verzichtet damit auf Nebenkosten, die ihm zustehen. Der Text sagt auch etwas, das Dwello nicht tut: Dwello «kann» abrechnen.

Der Befund widerspricht dem Wortlaut des Entscheids, gehört also unter «Blocked on me».

**Vorschlag** (behält Pauschale, «keine vereinbart» und den Hinweis ohne Sperre):

> «Ohne Akonto bezahlt der Mieter meist eine Pauschale, oder im Mietvertrag sind keine Nebenkosten vereinbart. Steht im unterschriebenen Mietvertrag ein Akonto, tragen Sie es ein. Sonst entfernen Sie unten bei «Vereinbarte Nebenkosten» alle Häkchen: Dann rechnet Dwello diesem Mieter keine Nebenkosten ab. Sind Nebenkosten ohne Akonto vereinbart, bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung.»

Der Step `contract-form.steps.ts:442` (`toContain('keine Nebenkosten abrechnen')`) passt dann nicht mehr. Er sollte auf «Pauschale» und «alle Häkchen» prüfen.

## M-2 (Major, Mietrecht): Text 4 ohne Formular, Begründung und Nichtigkeit

**Beleg.** Text 4 übernimmt `statements_akonto_raise_fixed_term` (`messages/de.json:1077`). Zu genau diesem Satz ist #388 offen («Akonto hint for a befristeter Mietvertrag: name the official form», Label entscheiden). Der Marker steht in `src/lib/statement-wizard.ts:226`: `TODO(fachlich prüfen, #388): the befristet text does not name the official form a raise still needs`.

**Warum falsch.** Auch beim befristeten Mietvertrag braucht eine Erhöhung das Formular, wenn der Mietvertrag sie erlaubt (Indexmiete) oder wenn er nach dem Ende stillschweigend weiterläuft (Art. 266 Abs. 2 OR, dann unbefristet und Art. 269d OR).
- Art. 19 Abs. 2 VMWG (Fedlex): «Die Absätze 1 und 1bis gelten ferner sinngemäss, wenn der Vermieter den Mietzins einem vereinbarten Index anpasst.»
- Art. 269d Abs. 2 OR macht eine Erhöhung ohne Formular oder Begründung nichtig.

Text 3 für den unbefristeten Vertrag nennt beides. Der Laie mit befristetem Vertrag erfährt es nicht. Der Entscheid von #66 verlangt ausdrücklich, die Regel von Art. 269d zu nennen. Das gilt für den Hinweis zum laufenden Mietvertrag allgemein, nicht nur für unbefristete Verträge.

**Vorschlag.** Den Satz von #388 Option A anfügen:

> «Änderungen an einem laufenden Mietvertrag gelten in Dwello sofort. Bei einem befristeten Mietvertrag ist eine Mietzinserhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.»

Wenn der Product Owner #388 noch offen lassen will: Text 4 mit `TODO(fachlich prüfen, #388)` markieren und in #388 vermerken, dass `contracts_running_text_fixed_term` mitentschieden wird.

## V-1 (Major, Verwalter; bestand schon vorher, #90): «gelten in Dwello sofort» stimmt für das Akonto nicht

**Beleg.** Texte 3 und 4, erster Satz. Der heutige Text sagt dasselbe («gelten sofort», `messages/de.json:683`). Die geleisteten Akontobeiträge rechnet Dwello so: `return roundToRappen(months * monthlyAdvancePayment);` (`backend/src/services/calculation.service.ts:249`). Das ist der aktuelle Betrag des Mietvertrags mal alle Monate der Periode. Laut #90 (beschlossen: Option 3, «Betrag ab {Datum}») ist das noch nicht umgesetzt.

**Nachgerechnet** (Nebenkosten des Mieters jeweils CHF 2'000, Periode Januar bis Dezember):
- **Erhöhung** 150 auf 200 ab 1. Juli: Bezahlt sind 6 × 150 + 6 × 200 = 2'100. Dwello rechnet 12 × 200 = 2'400. Saldo richtig −100 (Rückerstattung), in Dwello −400. Der Vermieter verliert 300.
- **Senkung** 200 auf 150 ab 1. Juli (einvernehmlich): Bezahlt sind 2'100, Dwello rechnet 1'800. Richtig ist eine Rückerstattung von 100, Dwello verlangt eine Nachzahlung von 200. Der Mieter bezahlt 300 zu viel, entgegen Art. 257b Abs. 1 OR («die tatsächlichen Aufwendungen»).
- **Randfall Null**: Akonto im Oktober von 150 auf 0 gesetzt. Bezahlt sind 9 × 150 = 1'350. Dwello rechnet 0 und verlangt 2'000 statt 650 Nachzahlung.
- **Randfall Mieterwechsel**: Mietvertrag A (Januar–April, 150) ergibt 600, Mietvertrag B (ab 16. Mai, 200) ergibt 16/31 × 200 + 7 × 200 = 1'503.23. Das stimmt, weil jeder Mietvertrag sein eigenes Akonto hat. Falsch wird es nur bei einer Änderung innerhalb eines Mietvertrags.

**Warum falsch.** «Sofort» heisst für den Laien «ab heute». Dwello wendet ein neues Akonto aber rückwirkend auf die ganze noch nicht abgerechnete Periode an.

**Vorschlag** (bis #90 umgesetzt ist), Satz ergänzen:

> «Ein geändertes Akonto rechnet Dwello für die ganze Abrechnungsperiode, die noch nicht abgerechnet ist. Ändern Sie es erst, nachdem Sie diese Periode abgerechnet haben.»

Oder den Befund unter #90 festhalten, weil er schon vorher bestand.

## V-2 (Minor, Verwalter): «Pauschale» fehlt im Glossar und ist nicht erfassbar

**Beleg.** Das Glossar kennt nur «Verwaltungspauschale» (`UBIQUITOUS_LANGUAGE.md:154`). Derselbe Schritt «Miete» zeigt die Wahl der Verwaltungspauschale (`RentStep.svelte:106–111`). Die Pauschale des Mieters lässt sich nirgends eintragen: Die Felder sind Nettomiete, Zusatzmiete («Garage, Parkplatz, Keller», Glossar Z. 49) und Akonto. «Monatlich total» (Glossar Z. 51) lässt sie also weg.

**Warum ein Problem.** Ein Laie liest «er bezahlt eine Pauschale» leicht als Verwaltungspauschale. Er weiss dann auch nicht, wo der Betrag hingehört, und trägt ihn vielleicht als Akonto ein. Dann erhält der Mieter mit Pauschale eine Abrechnung.

**Vorschlag.** Begriff **Nebenkostenpauschale** einführen: «Fester monatlicher Betrag des Mieters für die Nebenkosten. Wird nicht abgerechnet. Muss auf Durchschnittswerten dreier Jahre beruhen (Art. 4 Abs. 2 VMWG).» In Text 2 «eine Nebenkostenpauschale» schreiben. Issue (Labels `fachlich`, `entscheiden`): Begriff festlegen und entscheiden, ob und wo Dwello die Nebenkostenpauschale erfasst (eigenes Feld, oder als Zusatzmiete mit Hinweis). Bis dahin `TODO(fachlich prüfen, #<neu>)`.

## M-3 (Minor, Mietrecht): Text 3 lässt die Akonto-Erhöhung aus

**Beleg.** Das Bearbeitungsformular eines laufenden Mietvertrags enthält das Akonto (`ContractForm.svelte:306`, RentStep). Art. 269d Abs. 3 OR: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.» Die Anforderungen behandeln eine Akonto-Erhöhung als einseitige Vertragsänderung nach Art. 269d OR (`docs/nebenkostenabrechnung-anforderungen.md:80`), ebenso `statements_akonto_raise`. Neue Nebenkosten deckt `contracts_agreed_costs_help_edit` ab, das Akonto nicht.

**Vorschlag.** «Eine Erhöhung von Mietzins oder Akonto gilt frühestens …». Die Einordnung des Akontos unter Abs. 3 ist Praxis (unsicher-B, siehe «Nicht bestätigt»).

## M-4 (Minor, Mietrecht): Text 3 beim gekündigten Mietvertrag

**Beleg.** Der Auftrag zeigt Text 3 für «unbefristet or gekündigt». `running` umfasst jeden Vertrag mit Status `active`, auch einen gekündigten mit Ende in der Zukunft (`ContractForm.svelte:67–69`). Glossar Z. 39: Ist der Vertrag gekündigt, ist der Kündigungstermin «der Tag, auf den gekündigt wurde».

**Warum ein Problem.** Nach Art. 269d Abs. 1 OR («auf den nächstmöglichen Kündigungstermin») träte die Erhöhung frühestens am Vertragsende in Kraft, wenn das Mietverhältnis endet. Der Hinweis führt also ins Leere, ist aber nicht falsch.

**Vorschlag.** Für einen gekündigten Mietvertrag nur «Änderungen … gelten in Dwello sofort. Bis zum Vertragsende ist keine Mietzinserhöhung mehr möglich.» Oder Text 3 bewusst lassen und in der Umsetzung begründen.

## M-5 (Minor, Mietrecht): «ausser der Mietvertrag sieht sie vor» ist zu weit

**Beleg.**
- Art. 269b OR: «Die Vereinbarung, dass der Mietzins einem Index folgt, ist nur gültig, wenn der Mietvertrag für mindestens fünf Jahre abgeschlossen und als Index der Landesindex der Konsumentenpreise vorgesehen wird.»
- Art. 269c OR: «… nur gültig, wenn: a. der Mietvertrag für mindestens drei Jahre abgeschlossen wird; b. der Mietzins höchstens einmal jährlich erhöht wird; und c. der Betrag der Erhöhung in Franken festgelegt wird.»

**Warum ein Problem.** Eine Klausel «+2 % pro Jahr» in einem auf zwei Jahre befristeten Vertrag ist ungültig. Der Text lässt den Laien glauben, sie trage.

**Vorschlag.** «… ausser der Mietvertrag vereinbart eine Indexmiete (mindestens 5 Jahre) oder eine Staffelmiete (mindestens 3 Jahre).» «Indexmiete» und «Staffelmiete» fehlen im Glossar (Z. 52 nennt nur die «Mietzinsindexierung» beim Referenzindex). Das wäre ein Issue `fachlich`/`entscheiden`, am besten zusammen mit #388, weil `statements_akonto_raise_fixed_term` denselben Satz hat. Für das Akonto, also Nebenkosten, nennt Fedlex keine solche Ausnahme (siehe «Nicht bestätigt»).

## V-3 (Minor, Verwalter): Szenarien prüfen zu wenig und ein Titel behauptet die bestrittene Regel

**Beleg und Fix:**
- `contract-edit.feature:179–184` (befristet) prüft nur `toContain('erst nach dem Vertragsende möglich')` (`contract-form.steps.ts:457`). Dass der Kündigungstermin-Satz fehlt, prüft niemand. Umgekehrt prüft Z. 174–175 (unbefristet) nicht, dass der befristete Satz fehlt. Ergänzen: «Aber nennt der Hinweis keinen Kündigungstermin» bzw. umgekehrt. Dieselbe Lücke hatte W3f V-3.
- Den Fall «gekündigt» deckt kein Szenario ab, obwohl der Auftrag Text 3 ausdrücklich dafür vorsieht (siehe M-4).
- Nach M-2 prüft das befristete Szenario auch «mit dem amtlichen Formular».
- `contract-new.feature:162`: Der Titel «Ohne Akonto rechnet der Liegenschaftsverwalter keine Nebenkosten ab» formuliert die Regel aus M-1 als Tatsache, geprüft wird aber nur der Hinweis. Vorschlag: «Ohne Akonto fragt das Formular nach Pauschale oder Vereinbarung».
- Der Kommentar Z. 160 («ohne Akonto sind keine Nebenkosten vereinbart, oder der Mieter bezahlt eine Pauschale») sollte «meist» enthalten.
- Den Kern der Anweisung («alle Häkchen», «tragen Sie es ein») prüft kein Step.

## V-4 (Minor, Verwalter): Reihenfolge in Text 2

**Beleg.** `advancePaymentNotice()` zeigt den Hinweis, sobald das Feld leer ist (`parseFloat('')` ist `NaN`, also nicht `> 0`), also gleich beim Öffnen des Schritts. Das Szenario Z. 162–165 zeigt ihn, ohne dass etwas eingegeben wurde. In Text 2 steht «Entfernen Sie dann … alle Häkchen» vor «Steht im … Mietvertrag ein Akonto, tragen Sie es ein».

**Warum ein Problem.** Der Laie liest zuerst die Aufforderung zum Entfernen, bevor er das Akonto eingetragen hat. Fix: Den Satz «Steht … ein Akonto, tragen Sie es ein» an den Anfang stellen, wie im Vorschlag zu M-1.

## V-5 (Nit, Verwalter): Schreibweise «z. B.»

`messages/de.json` hat 26-mal «zum Beispiel», 7-mal «z. B.» und 2-mal «z.B.». Das Nachbarfeld `contracts_additional_help` (Z. 781) schreibt «zum Beispiel», der Entscheid «z.B.». Vorschlag: «(zum Beispiel Heizung, Wasser)» schreiben, passend zum Nachbarfeld. Das ist mit dem Entscheid vereinbar, der nur ein Beispiel gibt («e.g.»).

## M-6 (Nit, Mietrecht): Staffelmiete und Abs. 2 lit. c

- Art. 269d Abs. 5 OR (in Kraft seit 1.10.2025): «Für die Mitteilung von Mietzinserhöhungen, die in einer Vereinbarung nach Artikel 269c vorgesehen sind, genügt die schriftliche Form.» Text 3 verlangt immer das amtliche Formular. Das ist für eine Staffelmiete strenger als das Gesetz, schadet aber nicht.
- Die Nichtigkeit nach Abs. 2 lit. c («mit der Mitteilung die Kündigung androht oder ausspricht») fehlt, wie schon in `statements_akonto_raise`.

Beide Punkte nur angleichen, wenn `statements_akonto_raise` mitgeändert wird.

---

## Fehlende Begriffe (Issues mit Labels `fachlich`, `entscheiden`)

1. **Nebenkostenpauschale** (V-2): «Fester monatlicher Betrag des Mieters für die Nebenkosten. Wird nicht abgerechnet. Muss auf Durchschnittswerten dreier Jahre beruhen (Art. 4 Abs. 2 VMWG).» Dazu die Entscheidung, wo Dwello sie erfasst. Eine Suche in den offenen Issues (Seiten 1–2, Stichwort «Pauschal») fand nur #66 und #286 (Verwaltungspauschale).
2. **Indexmiete / Staffelmiete** (M-5): «Indexmiete: Der Mietzins folgt dem Landesindex der Konsumentenpreise; gültig nur bei einem Mietvertrag von mindestens fünf Jahren (Art. 269b OR).» «Staffelmiete: Der Mietzins steigt höchstens einmal jährlich um einen in Franken festgelegten Betrag; gültig nur bei einem Mietvertrag von mindestens drei Jahren (Art. 269c OR).» Am besten in #388 aufnehmen.
3. **Amtliches Formular** ist nicht im Glossar, aber schon beschlossen in `statements_akonto_raise` (#76) und `contracts_agreed_costs_help_edit`. Kein neues Issue nötig. Gesetzeswortlaut: «vom Kanton genehmigten Formular» (Art. 269d Abs. 1 OR).
4. **Vereinbarte Nebenkosten** ist noch ohne Glossar-Eintrag, das Issue #369 ist offen (`docs/nebenkostenabrechnung-anforderungen.md:135, 152`). Text 1 «im Mietvertrag vereinbarten Nebenkosten» ist dem Wortlaut nach vom Product Owner beschlossen.

## Nicht bestätigt

- **unsicher:** Dass eine Akonto-Erhöhung eine einseitige Vertragsänderung nach Art. 269d Abs. 3 OR ist (M-3). Fedlex nennt nur «neue Nebenkosten einzuführen» und «Leistungen zu vermindern». Die Einordnung des Akontos stammt aus Sekundärquellen (`docs/nebenkostenabrechnung-anforderungen.md:80`, unsicher-B; HEV-Winterthur- und ZMP-Snippets in `docs/reviews/w3f-fachreview-1.md:110`).
- **unsicher:** Ob ein befristeter Mietvertrag eine Akonto-Erhöhung wirksam vorbehalten kann (das «ausser» in Text 4 für Nebenkosten). Fedlex regelt Ausnahmen nur für den Mietzins (Art. 269b, 269c OR).
- **unsicher:** «beim Mieter … 10 Tage vor Beginn der Kündigungsfrist» als Zugang beim Mieter. Fedlex sagt nur «mitteilen». Der Zugang folgt aus der Praxis (gerichte-zh.ch, Snippet über `mmx search`: «dass das Formular der Mieterin mindestens zehn Tage vor Beginn der Kündigungsfrist zugeht»). Die Seite selbst habe ich nicht geöffnet.
- **unsicher:** Ab wann eine Index-Erhöhung wirkt (Kündigungstermin oder eigener Termin, Art. 17 VMWG). Nicht nachgelesen, betrifft Text 3 nur am Rand.
- Nicht geprüft: Ob ein Mietvertrag ohne angekreuzte Nebenkosten (Pauschale) im Abrechnungslauf trotzdem eine leere Nebenkostenabrechnung mit Saldo 0 erhält. Gesucht habe ich in `backend/src/services/statement.service.ts` und `src/lib` nach einem Ausschluss und keinen gefunden. Die Anforderungen sagen «Verträge mit Pauschale erhalten keine Abrechnung» (`docs/nebenkostenabrechnung-anforderungen.md:38`). Bei Bedarf prüft das daten-pruefer oder ein eigenes Issue.
- Nicht geprüft: fr/it/en-Fassungen (gibt es im Commit noch nicht).
- Wie die Umsetzung «befristet» von «gekündigt» unterscheidet (`terminated`), steht noch nicht im Code. Ich nehme an: Text 4 bei `endDate` gesetzt und `terminated = false`.
