# Fach-Review #447, Runde 1 (vor der Umsetzung)

Gegenstand: Commit 0dcdbcea (Worktree `review-447-fach`, detached), @wip-Szenarien und Tests; Textentwurf `447-texts-draft.md`, Abschnitte 1 bis 6.
Quellen: `UBIQUITOUS_LANGUAGE.md` (Zeilen 55, 56, 59, 162, 170, 172, 173, 175, 176, 183, 254), `docs/design/i18n-begriffe.md`, Entscheid #402 (Kommentar 6249582760), Fedlex.

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | `statements_correct_paid_chain` sagt «bezahlt wurden», auch wenn in der Kette netto der Vermieter zurückerstattet hat. Widerspricht der Zeile «Bereits zurückerstattet» (Einspruch gegen Abschnitt 6). |
| V-2 | Verwalter | Major | Im Mietvertragsformular nennt ein anderer ungültiger eigener Satz weiter «von 0 bis 10» (`statements_error_fee`). Das widerspricht der Zeile «Eigener Satz» («Grösser als 0 bis 10 %»). Antwort auf Frage 2: eigener Text «von 0,01 bis 10». |
| M-1 | Mietrecht | Minor | `glossary_fee_text` (de/fr/it/en :102) beginnt «Abgeltung Ihres Verwaltungsaufwands». Art. 4 Abs. 3 VMWG und die Glossarzeile meinen nur den Aufwand «für die Erstellung der Abrechnung». Der Satz wird ohnehin geändert: «Die Abgeltung Ihres Aufwands für die Nebenkostenabrechnung: …» (fr «… de votre travail pour le décompte des charges», it «… per il conteggio spese accessorie», en «… for the utility cost statement»). |
| V-3 | Verwalter | Minor | Entwurf it Saldo: «quanto lei gli ha già rimborsato». Die Höflichkeitsform schreibt it.json gross («Lei» 35-mal, «lei» einmal; `i18n-begriffe.md:5` «Lei»). Lösung: «Lei». |
| V-4 | Verwalter | Minor | Entwurf fr Feldfehler «« Non »» mit normalen Leerzeichen. `i18n-begriffe.md:5` und `contracts_fee_help` (fr) verlangen ein geschütztes Leerzeichen (U+00A0) innerhalb der Guillemets. |
| V-5 | Mietrecht | Minor | fr «votre travail effectif» / it «suo onere effettivo». Fedlex sagt «dépenses effectives» bzw. «dispendio effettivo» (Art. 4 Abs. 3 OBLF/OLAL), und `i18n-begriffe.md:3` verlangt das Fedlex-Wort. Lösung: fr «doit correspondre à vos dépenses effectives», it «deve corrispondere al Suo dispendio effettivo». |
| V-6 | Verwalter | Minor | `statement-pdf-render.test.ts:362` prüft nur den Spaltenkopf. Bleiben `sharesNote` / `sharesNoteFuel` bei «Costi immobile:», bleibt der Test grün. Lösung: zusätzlich `not.toContain('Costi immobile')` (die Gross-/Kleinschreibung zählt). |
| V-7 | Verwalter | Minor | Fehlende Begriffszeilen in `i18n-begriffe.md` für «Eigener Satz» und «Satz des Abrechnungslaufs» (der neue Feldfehler führt «taux propre» / «aliquota propria» / «own rate» ein). Vorschlag siehe unten. |
| V-8 | Verwalter | Nit | it «Di solito fino al 3 %» (Glossar) und «È usuale fino al 3 %» (Einstellungen): einheitlich «Di solito fino al 3 %» wie `statements_fee_help`. |
| V-9 | Verwalter | Nit | Veraltete Testnamen und Kommentare «von 0 bis 10»: `contract-form.test.ts:132-133`, `backend/src/routes/contracts.ts:35`. Lösung: «grösser als 0 bis 10». |
| V-10 | Verwalter | Nit | Kommentar `contract-new.feature` «nimmt Dwello ihn nicht an»: Es bleibt offen, ob der Satz oder der Mietvertrag gemeint ist. Lösung: «nimmt Dwello den Satz 0 % nicht an». |
| V-11 | Verwalter | Nit | `nebenkostenabrechnung-anforderungen.md:60`, Entwurf «keine Obergrenze»: neben «höchstens 10 %» besser «keine gesetzliche Obergrenze». |
| V-12 | Verwalter | Nit | `audit_empty_text`: «Änderungen der Verwaltungspauschale». Protokolliert wird nur die vorgeschlagene (`audit_fee`, `config.service.ts:205`), nicht die beim Mietvertrag. Bestand schon vorher. Lösung: «der vorgeschlagenen Verwaltungspauschale» (in allen vier Sprachen). |

## Blocker/Major im Einzelnen

### V-1: Hinweis «berichtigen» bei einer Kette mit Rückerstattung
- Beleg: `messages/de.json:1037` «Die berichtigte Abrechnung rechnet die {amount} an, die auf diese und die ersetzten Abrechnungen bezahlt wurden.» `src/routes/statements/[id]/Correction.svelte:23-31`: `offset = paidAmount + priorPayments`, Betrag `Math.abs(offset)`. Bei `priorPayments ≠ 0` erscheint immer dieser Text, das Vorzeichen spielt keine Rolle.
- Nachgerechnet: Abrechnung A mit Kosten 900 und Akonto 1’000 ergibt −100, der Vermieter erstattet 100 zurück (`paidAmount −100`). B berichtigt A mit Kosten 950: 950 − (1’000 − 100) = 50, der Mieter zahlt 50. Wer B berichtigt, erhält offset = 50 + (−100) = −50. Der Hinweis lautet dann «rechnet die CHF 50.00 an, die … bezahlt wurden». Tatsächlich hat der Vermieter netto 50 zurückerstattet. Das PDF der neuen Abrechnung C zeigt richtig «Bereits zurückerstattet … + CHF 50.00» (`pdf.service.ts:672-674`), der Hinweis widerspricht ihm also. Randfall: Ist offset positiv, stimmt der Text. Ist offset 0, gilt `statements_correct_settled`, und das ist richtig.
- Warum falsch: Glossarzeile «Bereits bezahlt / Bereits zurückerstattet» (`UBIQUITOUS_LANGUAGE.md:176`). Das «Done means» von #447 verlangt, dass die Texte zu diesem Begriff der Zeile entsprechen. Der Fehler bestand schon vor der Änderung, das Issue nimmt ihn aber in seinen Umfang auf.
- Lösung: Bei `offset < 0` ein neuer Text `statements_correct_refunded_chain`:
  - de «… Die berichtigte Abrechnung rechnet die {amount} an, die Sie auf diese und die ersetzten Abrechnungen insgesamt zurückerstattet haben.»
  - fr «… Le décompte rectificatif prend en compte les {amount} que vous avez remboursés au total sur celui-ci et sur les décomptes remplacés.»
  - it «… Il conteggio rettificato computa i {amount} che Lei ha rimborsato in totale su questo e sui conteggi sostituiti.»
  - en «… The corrected statement offsets the {amount} you refunded in total on it and on the statements it replaced.»
  - Bei `paid_chain` ergänzt «insgesamt» den Nettobetrag. Ein DOM-Test mit der Kette von oben.

### V-2: Bereichstext im Mietvertragsformular (Frage 2)
- Beleg: `src/lib/contract-form.ts:122-124` zeigt für jeden ungültigen eigenen Satz `m.statements_error_fee()`, `messages/de.json:1068` «Prozentsatz von 0 bis 10». Ab #447 lehnt dasselbe Feld 0 ab. Glossarzeile `UBIQUITOUS_LANGUAGE.md:59`: «Grösser als 0 bis 10 %». Für den Satz des Abrechnungslaufs (`:173`, «0 bis 10 %») bleibt `statements_error_fee` richtig.
- Warum falsch: Wer «11» eingibt, liest «von 0 bis 10», gibt 0 ein und bekommt den nächsten Fehler. Der Text nennt eine Regel, die das Feld nicht anwendet (Design-Regel «errors say … what to do»; «Done means»: Eigener Satz wie die Glossarzeile).
- Lösung: Neuer Schlüssel nur für den eigenen Satz. Zwei Nachkommastellen machen 0,01 zum genauen und klaren Minimum, klarer als «grösser als 0 bis 10»:
  - de «Bitte geben Sie einen Prozentsatz von 0,01 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.»
  - fr «Veuillez saisir un pourcentage de 0,01 à 10 avec au plus deux décimales, par exemple 3 ou 2,5.»
  - it «Inserisca una percentuale da 0,01 a 10 con al massimo due decimali, per esempio 3 o 2,5.»
  - en «Please enter a percentage from 0.01 to 10 with at most two decimal places, for example 3 or 2.5.»
  - Der Unit-Test `contract-form.test.ts:137-145` übernimmt den neuen Text, 0 behält `contracts_error_fee_rate_zero`.

## Antworten auf die offenen Fragen
1. **VMWG-Verweis im Satz «bis 3 %»:** ja, so belassen. Der Wortlaut ist entschieden (#402: «… entsprechen (Art. 4 Abs. 3 VMWG).»). Die Schreibweise «Art. 4 Absatz 3 VMWG» / «art. 4, al. 3, OBLF» / «art. 4 cpv. 3 OLAL» / «Art. 4 para. 3 VMWG» entspricht der App (`categories_reason_administration`, `Art. 5 Absatz 2 Buchstabe i VMWG`). Fedlex trägt den zweiten Satzteil. Die Zahl 3 % steht nicht in der Verordnung, und so wie der Satz gebaut ist (der Verweis steht nach dem Strichpunkt), behauptet er das auch nicht.
2. **Andere ungültige eigene Sätze:** ja, ein eigener Text, siehe V-2.

## Bestätigt

- **Feldfehler 0 % (Abschnitt 1):** de wörtlich wie entschieden. fr/it/en nehmen die Beschriftungen der App auf: «Taux propre» / «Aliquota propria» / «Own rate» (`contracts_fee_rate_label`), «Non» / «No» / «No» (`contracts_fee_none`). «frais de gestion» / «spese di gestione» wie heute in `i18n-begriffe.md:75`. Ausnahme V-4.
- **«bis 3 %» (Abschnitt 2):** entspricht der Glossarzeile `:172`. «Ihrem» statt «dem» passt zur direkten Anrede. Ausnahmen V-5, V-8.
- **Costi dell’immobile (Abschnitt 3):** entspricht Entscheid #402 Punkt 9, `i18n-begriffe.md` «Gebäude = immobile». fr/en bleiben. In `statement-pages.dom.test.ts` steht kein «Costi immobile» mehr (grep). Der Punkt im «Done means» ist damit gegenstandslos.
- **Saldo (Abschnitt 4):** de entspricht `UBIQUITOUS_LANGUAGE.md:175` Wort für Wort, in direkter Anrede. Die Begriffe fr/it/en stimmen mit `i18n-begriffe.md:38, 78, 79, 80` überein. Nachgerechnet mit `statement.service.ts:353-360` und `calculateBalance`:
  - (a) Kosten 1’200, Akonto 1’000, bezahlt 200; berichtigt 1’150: 1’150 − (1’000 + 200) = −50, Rückerstattung 50.
  - (b) Rückerstattung: Kosten 900, Akonto 1’000, zurückerstattet 100 (−100); berichtigt 950: 950 − (1’000 − 100) = +50, Nachzahlung 50. Das entspricht «plus, was Sie ihm schon zurückerstattet haben».
  - (c) Null: ersetzte Abrechnung nicht bezahlt, `paidAmount` null, Saldo wie ohne Berichtigung.
  - Kette: `paidSoFar` addiert `priorPayments` der ersetzten Abrechnung, deshalb der Plural.
  - Rundung `roundTo5Rappen` (floor): 200.03 wird 200.00, −50.03 wird −50.05, das ist zugunsten des Mieters.
  - Ausnahme V-3.
- **Protokoll (Abschnitt 5):** entspricht der Zeile `:254`. «berichtigte Abrechnungen» wird tatsächlich protokolliert (`audit-log.service.ts:28`, `statement_corrected`). fr «paiements retirés» / it «pagamenti rimossi» wie `i18n-begriffe.md:76`.
- **Abschnitt 6:**
  - Abrechnungsnummer: Die App erklärt sie nirgends, nur `statements_search_help`. Das Entfernen der Marker ist richtig.
  - Vereinbarte Nebenkosten / Nicht vereinbart: `statements_agreements_text` nennt die unbeantwortete Kategorie «noch nicht angegeben», fr «Non convenue», it «Non pattuita». Das entspricht `:55-56` und #402 Punkt 7.
  - Bereits bezahlt: `statements_prior_paid` / `_refunded` und PDF `priorPaid` / `priorRefunded` stimmen, ausser V-1.
  - Protokoll: `audit_purpose` und `audit_privacy` stimmen.
  - Eigener Satz / Satz des Abrechnungslaufs: `contracts_fee_help`, `statements_fee_help` (`{max}` = `USUAL_MAXIMUM` = 3) und `statements_fee_of_own` stimmen, ausser V-2.
- **Szenarien:**
  - «Eigener Satz von 0 % wird abgelehnt» (`contract-new.feature`) und «… beim Bearbeiten abgelehnt» (`contract-edit.feature`) beschreiben die Entscheidung. Sie verwenden «Liegenschaftsverwalter», «eigener Satz», «Verwaltungspauschale» aus dem Glossar.
  - «Die Hilfe erklärt …» (`help.feature`) prüft «bis 3 %» und den Saldo der berichtigten Abrechnung.
  - Die Unit- und pg-Tests prüfen 0 / 0,00 / 0.0 als abgelehnt und 0.01 / 2,5 / 10 als angenommen. Der Satz des Abrechnungslaufs bleibt unberührt (`isFeeRate` unverändert).
- **Recht:** Art. 257a Abs. 2 OR trägt «ohne Vereinbarung keine Pauschale». Die Ablehnung von 0 % ist eine Regel der Bedienung, kein Rechtssatz, und widerspricht dem Gesetz nicht.

## Fedlex-Zitate
- Art. 4 Abs. 3 VMWG (SR 221.213.11, https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de): «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»
  - it (…/it): «3 Le spese amministrative per la stesura del conteggio possono essere computate secondo il dispendio effettivo o nell'ambito delle aliquote usuali.»
  - fr (Ausschnitt): «3 Les frais d'administration découlant de l'établissement du décompte peuvent être calculés en fonction des dépenses effectives ou portés en compte jusqu'à …»
- Art. 257a Abs. 2 OR (https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»

## Fehlende Begriffe (Issue, Labels `fachlich`, `entscheiden`)
Zeilen für `i18n-begriffe.md` (V-7), wie die App die Begriffe heute schreibt:
- «Eigener Satz | taux propre | aliquota propria | own rate»
- «Satz des Abrechnungslaufs | taux de l’établissement des décomptes | aliquota dell’allestimento dei conteggi | rate of the statement run»

## Nicht bestätigt
- **«Üblich sind bis 3 %» als Praxiswert:** Fedlex nennt keinen Satz. Der Wert stützt sich nur auf das Merkblatt des Mieterverbands, das in `nebenkostenabrechnung-anforderungen.md:60` und #402 zitiert ist. Ich habe es nicht erneut abgerufen. WEKA nennt 3 bis 5 % (mmx-Suchtreffer). Der Wert ist entschieden. **unsicher** als Rechtsaussage.
- **Fedlex-Seite:** Sie lädt nur mit JavaScript (WebFetch lieferte die Startseite). Den Wortlaut habe ich aus den Fedlex-Ausschnitten der mmx-Suche und aus justement.ch (Abs. 3) übernommen. Die vollständige französische Fassung von Abs. 3 habe ich nicht gesehen.
- **«Costi dell’immobile»:** Fedlex hat dafür kein Wort, es ist eine sprachliche Entscheidung (#402). Ein Muttersprachler hat sie nicht geprüft (#342/#405).
