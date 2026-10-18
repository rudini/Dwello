# Fachreview #222, Runde 4 (Delta): Hinweise nach dem Persona-Review

Gegenstand: Worktree `review-222-fach4`, Commit `271c95df`. Geprüft wurden die zwei `@wip`-Szenarien `tests/e2e/features/invoices.feature:106-109` und `:163-169`, die am 2026-10-16 entschiedenen Texte `invoices_upload_deducted` und `invoices_beleg_deducted` (Issue #222, «Decided (product owner)») und die vorgeschlagenen Strings in `scratchpad/222-msgs-proposed.json`. Sie stehen noch nicht in `messages/*.json`. Anlass: Helga P-1 (`docs/design/personas/helga-222.md:12`) und Dr. Weber P-1 (`docs/design/personas/weber-222.md:12`, entspricht V-7 aus Runde 3). V-8 (#261), V-10 (#263) und die Persona-Minors prüfe ich hier nicht noch einmal.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-7 | Verwalter | erledigt | Der Leistungszeitraum beginnt jetzt nach der abgerechneten Periode. Nachgerechnet: Die Mieter tragen wieder die tatsächlichen Aufwendungen. |
| V-9 | Verwalter | erledigt | fr `invoices_beleg_deducted`: vor «:» steht jetzt U+00A0. |
| V-12 | Verwalter | Minor | «nach der abgerechneten Periode» (fr «la période décomptée», it «il periodo conteggiato», en «the period already in a statement») ist kein Glossarbegriff. Man kann es als Leistungszeitraum der Akontorechnung oder als «Abrechnungsperiode» auf der Rechnung der Werke lesen. Beide Lesarten führen zu falschen Nebenkosten. |
| V-13 | Verwalter | Nit | «entfernen Sie diese Dateien» nennt den Knopf «Datei entfernen» nicht. Löschen nennt seinen Knopf, Entfernen nicht. |

## Delta-Prüfung

### 1. Szenarien gegen die entschiedenen de-Texte

- `invoices.feature:109` (`@wip` auf `:106`): Mit `{amount}` = «CHF 1’000.00» Wort für Wort gleich wie der entschiedene de-Text von `invoices_upload_deducted` (Issue #222 und `222-msgs-proposed.json`, per Skript als Teilstring der Datei geprüft). Bestätigt.
- `invoices.feature:169` (`@wip` auf `:163`): Wort für Wort gleich wie der entschiedene de-Text von `invoices_beleg_deducted` (gleich geprüft). Bestätigt.
- Beide Szenarien sind zu Recht `@wip`. In `messages/de.json:817,856` stehen noch die Texte aus Runde 3.

### 2. fr/it/en (geprüft gegen `222-msgs-proposed.json`, per Skript Zeichen gezählt)

- **Anrede:** fr vous («supprimez-les», «retirez», «ne la supprimez pas, mais déduisez», «faites commencer», «Vérifiez»), it Lei («le elimini», «rimuova», «non la elimini, ma deduca», «faccia iniziare», «Verifichi»), en Imperativ. Bestätigt.
- **Knopfnamen:** `invoices_delete` heisst «Rechnung löschen» / «Supprimer la facture» / «Eliminare la fattura» / «Delete invoice» (`messages/{de,fr,it,en}.json:781`). Die Hinweise zitieren genau diese Namen. Bestätigt.
- **Anführungszeichen** (`docs/design/i18n-begriffe.md:5`): fr «« Supprimer la facture »» mit U+00A0 innen (2 U+00A0, keine gewöhnlichen Leerzeichen nach « oder vor »); it «Eliminare la fattura» ohne Leerzeichen; en “Delete invoice” mit U+201C/U+201D, wie die bestehenden en-Texte (`messages/en.json:816`). Kein U+0022 in den Texten. Bestätigt.
- **Apostroph:** nur U+2019, kein U+0027 (fr Upload 3, fr Beleg 5, it je 2). Bestätigt.
- **U+00A0 vor «:»:** fr Beleg-Text 1 U+00A0, kein gewöhnliches Leerzeichen vor «:», «;», «?», «!» oder «»». V-9 ist damit erledigt.
- **Begriffe** (`docs/design/i18n-begriffe.md:36,38,62`): Leistungszeitraum ist période de prestation / periodo di prestazione / service period, Akontorechnung ist facture d’acompte / fattura d’acconto / advance invoice, Beleg ist pièce justificative / giustificativo / supporting document. In allen Texten bestätigt. Abrechnungsperiode heisst laut `:60` période de décompte / periodo di conteggio / billing period. Die Texte sagen dafür «période décomptée» / «periodo conteggiato» / «period already in a statement», siehe V-12.
- **Grammatik:** fr «Si leurs fichiers sont sélectionnés ici, retirez ces fichiers. Sinon, elles comptent deux fois.» («elles» bezieht sich auf die factures d’acompte) ist korrekt. it «Se i loro file sono selezionati qui, rimuova questi file. Altrimenti contano due volte.» ist korrekt. en «do not delete it; deduct its amount from the total instead and let the service period start after …» ist korrekt. Bestätigt.

### 3. Fachlich, nachgerechnet

Massstab ist Art. 257b Abs. 1 OR, zitiert nach Fedlex in Runde 3 (`docs/reviews/222-fachreview-3.md`): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …».

**Helga P-1 (Ort des Löschens):** Der Text trennt jetzt zwei Sätze. «… löschen Sie sie auf ihrer Seite mit «Rechnung löschen».» gilt für erfasste Akontorechnungen. «Sind ihre Dateien hier ausgewählt, entfernen Sie diese Dateien.» gilt für Akontorechnungen im selben Hochladen. «diese Dateien» bezieht sich auf die Dateien der Akontorechnungen, nicht auf die Schlussrechnung. Der Fehlgriff aus `helga-222.md:62` ist damit sprachlich ausgeschlossen. Den Löschdialog als Sicherung gibt es weiter (`messages/de.json:783`, «Löschen Sie nur falsch erfasste Rechnungen»). Er hilft, wenn jemand eine abgerechnete Akontorechnung löscht, bevor er den letzten Satz gelesen hat. Erledigt; Rest siehe V-13.

**Weber P-1 / V-7 (Leistungszeitraum), Text richtig befolgt:**

- a) Beispiel aus Runde 3 und `weber-222.md:56`: Abrechnungsperiode Kalenderjahr, Ableseperiode der Werke 1.10.2024–30.9.2025, T = 1’250.00, Akonto 4 × 250.00, Q4 2024 mit der Abrechnung 2024 versendet. Q1–Q3 2025 gelöscht; Betrag 1’250.00 − 250.00 = 1’000.00; Leistungszeitraum 1.1.–30.9.2025 (273 Tage, alle in 2025). Ergebnis 2025 = 1’000.00, Summe 250.00 + 1’000.00 = **1’250.00** ✓. Mit dem alten Text waren es 997.95.
- b) Einstellung «Juli – Juni», Abrechnung 2024/25 (1.7.2024–30.6.2025) mit den Akontorechnungen vom 15.11.2024, 15.2. und 15.5.2025 (750.00) versendet. Die Akontorechnung vom 15.8.2025 wird gelöscht; Betrag 1’250.00 − 750.00 = 500.00; Leistungszeitraum 1.7.–30.9.2025. Ergebnis 2025/26 = 500.00, Summe **1’250.00** ✓.
- c) Mieterwechsel in 2025 (Fall a): A bis 30.4.2025 (120 Tage im Leistungszeitraum), B ab 1.5.2025 (153 Tage). Wohnungsanteil 100 %: A 1’000.00 × 120/273 = 439.56, B 1’000.00 × 153/273 = 560.44, Summe 1’000.00 ✓. Folge aus Variante A, kein Befund (bereits in Runde 2 und 3 entschieden): Auf die Tage 1.10.–31.12.2024 entfallen 1’250.00 × 92/365 = 315.07. Die Mieter 2024 haben über die Akontorechnung aber nur 250.00 getragen. Die Differenz von 65.07 tragen die Mieter 2025, nach Tagen auf A und B verteilt. Die Summe stimmt. Genau richtig verteilt wäre es nur mit einer berichtigten Abrechnung 2024.
- d) Randfall ohne Leistungszeitraum: Der Satz verlangt nichts. Die Rechnung fällt mit ihrem Rechnungsdatum 15.10.2025 in die Periode 2025 (Kalenderjahr) bzw. 2025/26 (Juli – Juni). Beide Male ist das Ergebnis 1’250.00 ✓.
- e) Keine Akontorechnung abgerechnet: Der letzte Satz gilt nicht. Alle vier werden gelöscht oder entfernt, 1’250.00 ✓ (wie Runde 3, b).

Wer den Text befolgt, rechnet also richtig ab. Er muss «abgerechnete Periode» allerdings als Abrechnungsperiode der Abrechnung mit der Akontorechnung lesen, siehe V-12.

## Befunde

### V-12 (Minor): «nach der abgerechneten Periode» ist nicht eindeutig

- **Belege:** Der entschiedene de-Text sagt «lassen Sie den Leistungszeitraum erst nach der abgerechneten Periode beginnen» (Upload) und «der Leistungszeitraum beginnt erst nach der abgerechneten Periode» (Beleg). Im Glossar gibt es «Abrechnungsperiode» (`UBIQUITOUS_LANGUAGE.md:150`), aber keine «abgerechnete Periode». Die bestehenden Texte sagen immer «Abrechnungsperiode» (`messages/de.json:719,721,725,744,863`). Die Akontorechnungen in der Persona-Demo haben eigene Zeiträume («ewz Allgemeinstrom Q1–Q4 2025», `weber-222.md:16`, «Q4 2024», `:56`). Abrechnungen der Werke tragen selbst die Überschrift «Abrechnungsperiode» (Praxis, Verwalterrolle). fr/it/en übersetzen den Ausdruck wörtlich, nicht mit dem Begriff aus `i18n-begriffe.md:60`.
- **Warum falsch:** Ein unerfahrener Vermieter (Zielnutzer, `CLAUDE.md` «Design-Regeln») kann «Periode» auf zwei falsche Arten lesen:
  1. *Leistungszeitraum der Akontorechnung* (Q4 2024: 1.10.–31.12.2024). Beim Kalenderjahr zufällig richtig. Bei «Juli – Juni» (Fall b) setzt er den Beginn auf 1.1.2025. Nachgerechnet: Betrag 500.00, Leistungszeitraum 1.1.–30.9.2025 (273 Tage); davon 181 Tage in 2024/25 (versendet), 92 in 2025/26. Ergebnis 2025/26 = 500.00 × 92/273 = 168.50; Summe 750.00 + 168.50 = **918.50 statt 1’250.00**. Der Vermieter verliert 331.50, der Mieter zahlt nicht zu viel.
  2. *Ableseperiode der Werke* («Abrechnungsperiode 1.10.2024–30.9.2025» auf der Schlussrechnung). Der Beginn landet am 1.10.2025, die Kosten in der Periode 2025/26 bzw. 2026. Bei einem Mieterwechsel trägt sie dann der falsche Mieter. Mit einem Fedlex-Wortlaut zur periodengerechten Zuordnung kann ich das nicht belegen (**unsicher**). Nach Art. 257b Abs. 1 OR zählen die tatsächlichen Aufwendungen für die Leistungen; die gehören hier zu 2024/25.
- **Korrektur** (Entscheid des Produktverantwortlichen, der Text ist entschieden; ändern lässt er sich leicht, weil er noch nicht in `messages/*.json` steht): den Glossarbegriff verwenden und die Periode benennen.
  - Upload de: «… ziehen Sie ihren Betrag vom Total ab und lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen, in der sie abgerechnet ist.»
  - Upload fr: «… mais déduisez son montant du total et faites commencer la période de prestation après la période de décompte dans laquelle elle est décomptée.»
  - Upload it: «… ma deduca il suo importo dal totale e faccia iniziare il periodo di prestazione dopo il periodo di conteggio in cui è stata conteggiata.»
  - Upload en: «… deduct its amount from the total instead and let the service period start after the billing period of that statement.»
  - Beleg de: «… ihr Betrag ist vom Total abgezogen, und der Leistungszeitraum beginnt erst nach der Abrechnungsperiode, in der sie abgerechnet ist.»
  - Beleg fr: «… son montant est déduit du total et la période de prestation commence après la période de décompte dans laquelle elle est décomptée.»
  - Beleg it: «… il suo importo è dedotto dal totale e il periodo di prestazione inizia dopo il periodo di conteggio in cui è stata conteggiata.»
  - Beleg en: «…, its amount is deducted from the total, and the service period starts after the billing period of that statement.»
  - Die Szenarien `invoices.feature:109,169` entsprechend anpassen.
- **Zur Frage des Auftrags:** Neben dem Glossarbegriff Abrechnungsperiode ist «nach der abgerechneten Periode» nicht genau genug. Der Ausdruck ist kein Glossarbegriff und hat zwei naheliegende falsche Lesarten. Mit der Korrektur oben ist er genau genug.

### V-13 (Nit): «entfernen» ohne Knopfnamen

- **Beleg:** «Sind ihre Dateien hier ausgewählt, entfernen Sie diese Dateien.» Der Knopf heisst «Datei entfernen» (`messages/de.json:836`). Der Löschsatz davor nennt «Rechnung löschen» in Anführungszeichen. Dr. Weber fragt, ob «entfernen» den Knopf oder das Häkchen «Diese Rechnung erstellen» meint (`weber-222.md:17`, P-6).
- **Warum:** Fachlich führen beide Wege zum richtigen Ergebnis. Eine nicht ausgewählte Datei wird nicht erstellt (Runde 3, d). Der Text ist also nicht falsch, nur weniger geführt als der Löschsatz.
- **Korrektur (optional):** de «… entfernen Sie diese Dateien mit «Datei entfernen».» fr «… retirez ces fichiers avec « Retirer le fichier ».» (U+00A0 innen), it «… rimuova questi file con «Rimuovere il file».», en «… remove these files with “Remove the file”.» (Namen nach `messages/{fr,it,en}.json:836`).

## Fehlende Begriffe

- Das Glossar nennt die Ausnahme für die abgerechnete Akontorechnung und ihren Leistungszeitraum noch nicht (`UBIQUITOUS_LANGUAGE.md:71`, unverändert). Laut #222 trägt der Produktverantwortliche das selbst nach. Vorschlag mit dem Begriff aus V-12: «Ist eine Akontorechnung schon abgerechnet, bleibt sie erfasst, und die Schlussrechnung wird um ihren Betrag gemindert; ihr Leistungszeitraum beginnt dann nach der Abrechnungsperiode, in der die Akontorechnung abgerechnet ist.» Kein neues Issue nötig (gehört zu #222).

## Nicht bestätigt

- Fedlex: Art. 257b Abs. 1 OR habe ich in dieser Runde nicht neu geladen. Der Wortlaut ist aus Runde 3 übernommen (Fedlex-Filestore, Fassung `20270701`). Für die periodengerechte Zuordnung (V-12, Lesart 2) habe ich keinen Fedlex-Wortlaut gesucht, daher **unsicher**.
- Wie der Szenario-Schritt das Leerzeichen in «CHF 1’000.00» behandelt (U+00A0 in der UI, gewöhnliches Leerzeichen im Szenario), habe ich nicht nachgelesen. Runde 3 hat das über die Unit- und DOM-Tests bestätigt; die Step-Definition habe ich in dieser Runde nicht geöffnet.
- Die fr/it/en-Texte sind geprüft, wie sie in `222-msgs-proposed.json` und im Issue stehen, nicht in `messages/*.json` (dort noch nicht umgesetzt).
- Dass Werke-Rechnungen ihre Ableseperiode «Abrechnungsperiode» nennen (V-12, Lesart 2), stützt sich auf Praxiserfahrung aus der Verwalterrolle. Eine Quelle im Repository gibt es dafür nicht: `docs/nebenkostenabrechnung-anforderungen.md` und `docs/anforderungen-vertragsende.md` regeln keine Rechnungen von Rechnungsstellern.
