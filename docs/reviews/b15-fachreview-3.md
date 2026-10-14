# Fachreview B-15 (#152), Runde 3

Gegenstand: nur das Delta 8545bed..5f97d8b (Commit 5f97d8b «fix(contracts): guide to the next step on edit») und die offenen Befunde aus `docs/reviews/b15-fachreview-2.md`. Geprüft: die Schlüssel `contracts_parties_fixed_open`, `_ended`, `_mistake`, `_link`, `contracts_edit_purpose` und `backend_contract_parties_fixed` in `messages/{de,fr,it,en}.json` (Zeilen 606-609, 630, 1253), ihre Anzeige in `src/routes/contracts/ContractForm.svelte:190-198` und die Änderung in `backend/src/services/contract.service.ts:353-356`.

Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/anforderungen-vertragsende.md`, `docs/design/i18n-begriffe.md`. Das Zitat von Art. 264 Abs. 1 OR stammt wörtlich aus Runde 1 (Fedlex-Filestore, OR-Fassung vom 01.10.2026). `mmx search` liefert denselben Wortlaut (Treffer hev-sz.ch, gerichte.lu.ch). Neu im Fedlex nachgeschlagen habe ich es nicht.

## Ergebnis

V-6 ist behoben. Kein Blocker, kein Major. Die neuen Texte sind richtig, wenn ein Mieterwechsel am erfassten Vertragsende stattfindet, egal ob dieses Ende in der Zukunft oder in der Vergangenheit liegt. Zwei Fälle führt der Text `_ended` aber falsch: wenn der Mietvertrag früher endet als erfasst, und beim Wechsel der Wohnung (V-7, V-8). Dazu kommen zwei Nits.

| ID | Rolle | Schwere | Befund | Status |
|---|---|---|---|---|
| V-6 | Verwalter | Minor | de «Mieter … falsch erfasst» mehrdeutig | **behoben** |
| M-1 | Mietrecht | Minor | Fälle, in denen der Mietvertrag rechtlich weiterläuft | offene Arbeit (#155), unverändert |
| V-7 | Verwalter / Mietrecht | Minor | `_ended` sagt nicht, was zu tun ist, wenn der Mietvertrag vor dem erfassten Vertragsende endet (Ersatzmieter nach Art. 264 OR, Aufhebung, befristeter Vertrag) | neu, offen |
| V-8 | Verwalter | Minor | «ab dem Tag nach dem Vertragsende» klingt wie ein festes Datum und passt nicht zum Wechsel der Wohnung | neu, offen |
| V-9 | Verwalter | Nit | `backend_contract_parties_fixed` lässt den Schritt «Vertragsende» weg | neu, offen |
| V-10 | Verwalter | Nit | fr `_open`: Guillemets ohne geschütztes Leerzeichen | neu, offen |

## Befunde aus Runde 2

### V-6 (Minor): behoben

**Beleg.** `messages/de.json:608`: «Haben Sie den falschen Mieter oder die falsche Wohnung gewählt und hat der Mietvertrag noch nicht begonnen, löschen Sie ihn auf seiner Seite und erfassen ihn neu.» Das ist der Wortlaut aus Runde 2. Der Zusatz «auf seiner Seite» stimmt, denn «Löschen» steht nur auf der Detailseite. Diese ist jetzt verlinkt (`ContractForm.svelte:195-197`, `href={back}` = `/contracts/{id}`). fr, it und en sind gleich gebaut und bleiben eindeutig («choisi le mauvais locataire», «scelto l’inquilino … sbagliato», «chose the wrong tenant»). Das Szenario prüft weiterhin «Bei einem Mieterwechsel» (`contract-edit.feature:75`). Beide Varianten (`_open`, `_ended`) enthalten den Satz, der Schritt bleibt also grün.

### M-1: unverändert offene Arbeit (#155)

Das Delta berührt den Fall nicht.

## Neue Befunde

### V-7 (Minor): Der Mietvertrag endet früher als erfasst

**Beleg.**
- `messages/de.json:607` (`contracts_parties_fixed_ended`): «Bei einem Mieterwechsel oder einem Wechsel der Wohnung erfassen Sie ab dem Tag nach dem Vertragsende einen neuen Mietvertrag.» Dieser Text erscheint, sobald der gespeicherte Vertrag ein Vertragsende hat (`ContractForm.svelte:192`, `contract.endDate`). Das gilt für befristete und gekündigte Verträge, für ein Ende in der Zukunft wie in der Vergangenheit.
- `UBIQUITOUS_LANGUAGE.md:36`: «**Vertragsende**: Letzter Tag des Mietverhältnisses. Bei einem befristeten Vertrag das vereinbarte Ende, bei einem gekündigten unbefristeten Vertrag der Kündigungstermin …». «Ab dem Tag nach dem Vertragsende» ist also der früheste Tag ohne Lücke und ohne Überschneidung. Das passt zu `anforderungen-vertragsende.md:127` («… sobald für die Wohnung ein Mietvertrag ab dem Tag danach erfasst ist»).
- `anforderungen-vertragsende.md:215`: «Zwei Mietverträge derselben Wohnung im selben Zeitraum lässt das Backend nicht zu (Überschneidung)». Dazu `messages/de.json:420`, `backend_contract_overlap`.
- Art. 264 Abs. 1 OR (Fedlex, Zitat aus Runde 1): «Gibt der Mieter die Sache zurück, ohne Kündigungsfrist oder -termin einzuhalten, so ist er von seinen Verpflichtungen gegenüber dem Vermieter nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; dieser muss zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen.»

**Prüfung der Frage des Auftrags.**
- *Vertragsende in der Vergangenheit:* Der Text stimmt. Der neue Mietvertrag kann am Tag danach beginnen oder später (dann Leerstand, siehe V-8).
- *Vertragsende in der Zukunft, Mieterwechsel genau auf diesen Tag* (Normalfall bei Kündigung auf den Kündigungstermin oder bei Ablauf einer Befristung): Der Text stimmt.
- *Vertragsende in der Zukunft, Mieterwechsel früher:* Der Text stimmt nicht. Das ist der häufigste Fall einer vorzeitigen Rückgabe mit Ersatzmieter (Art. 264 OR): Ein gekündigter Mieter oder ein Mieter mit befristetem Vertrag stellt einen Nachfolger, der früher einzieht. Ebenso bei einer Aufhebung im Einvernehmen. Der Vermieter folgt dem Text und erfasst den neuen Vertrag ab dem Tag nach dem erfassten Ende. Dann fehlen dem neuen Mieter Mietstage, und der bisherige Mieter trägt in der Nebenkostenabrechnung Mietstage, für die er nach Art. 264 OR befreit ist. Gibt der Vermieter stattdessen das echte Einzugsdatum ein, lehnt das Backend die Überschneidung ab (`backend_contract_overlap`). Die Hilfe nennt den nötigen Schritt nicht, obwohl er genau auf diesem Formular liegt (Panel «Vertragsdauer», `ContractForm.svelte:201`).

**Warum nur Minor.** Ein stiller Fehler entsteht nur, wenn der Vermieter ein Datum einträgt, von dem er weiss, dass es falsch ist. Sonst stoppt ihn die Überschneidung. Er findet dann aber keinen Hinweis auf den Weg.

**Korrektur.** `_ended` um einen Satz ergänzen. Vorschlag de:
«Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel erfassen Sie einen neuen Mietvertrag, frühestens ab dem Tag nach dem Vertragsende. Endet dieser Mietvertrag früher als hier erfasst, ändern Sie zuerst unten unter «Vertragsdauer» das Vertragsende.»
fr: «… saisissez un nouveau contrat de bail, au plus tôt à partir du lendemain de la fin du contrat. Si ce contrat de bail prend fin plus tôt que saisi ici, modifiez d’abord la fin du contrat ci-dessous sous « Durée du contrat ».» (mit geschütztem Leerzeichen)
it: «… registri un nuovo contratto di locazione, al più presto a partire dal giorno dopo la fine del contratto. Se questo contratto di locazione termina prima di quanto registrato qui, modifichi prima la fine del contratto qui sotto in «Durata del contratto».»
en: «… add a new rental contract starting no earlier than the day after the contract end. If this rental contract ends earlier than entered here, first change the contract end below under «Contract term».»
Alle Begriffe stehen in `i18n-begriffe.md:26, 80` und `messages/*.json:580` («Vertragsdauer» / «Durée du contrat» / «Durata del contratto» / «Contract term»). Optional: eine Zeile im Szenario, die bei einem gekündigten Vertrag «Vertragsende» im Hinweis prüft.

### V-8 (Minor): «ab dem Tag nach dem Vertragsende» und der Wechsel der Wohnung

**Beleg.** `messages/de.json:607`, wie bei V-7.

**Warum falsch.**
1. «erfassen Sie ab dem Tag nach dem Vertragsende einen neuen Mietvertrag» liest ein unerfahrener Vermieter als Vorgabe für den Vertragsbeginn. Richtig ist «frühestens»: Zieht der Nachmieter später ein, ist die Zeit dazwischen Leerstand (`anforderungen-vertragsende.md:123`). Ein zu früh erfasster Vertragsbeginn lässt den neuen Mieter in der Nebenkostenabrechnung Mietstage tragen, an denen er die Wohnung noch nicht hatte.
2. Beim Wechsel der Wohnung bezieht sich der neue Mietvertrag auf eine *andere* Wohnung. Für ihn gilt das Ende des alten Vertrags nicht, sondern nur, ob die neue Wohnung frei ist. Die Prüfung auf Überschneidung gilt pro Wohnung (`messages/de.json:650`: «Pro Wohnung darf sich kein Mietvertrag mit einem anderen überschneiden.»). Bei einem Umzug im selben Haus überschneiden sich die beiden Verträge oft um einige Tage. Der Text schreibt etwas vor, was die App nicht verlangt.

**Korrektur.** Wie bei V-7 «frühestens» einfügen und den Wechsel der Wohnung aus der Datumsregel nehmen, z. B. als eigenen Satz: «Bei einem Wechsel der Wohnung erfassen Sie einen neuen Mietvertrag für die andere Wohnung.» Den gleichen Satz kann auch `_open` brauchen. Dort ist er aber nicht falsch, weil `_open` kein Datum nennt.

### V-9 (Nit): Die Backend-Ablehnung nennt das Vertragsende nicht mehr

**Beleg.** `messages/de.json:1253`: «… Erfassen Sie für einen anderen Mieter oder eine andere Wohnung einen neuen Mietvertrag.» Vorher stand dort: «Beenden Sie den Mietvertrag und erfassen Sie einen neuen.»

**Warum.** Bei einem Mieterwechsel in derselben Wohnung scheitert der neue Mietvertrag an der Überschneidung, solange der alte kein Vertragsende hat. Für den Wechsel der Wohnung ist der neue Text dagegen besser (siehe V-8). Der Text erscheint nur bei einer veralteten Seite oder einem direkten API-Aufruf (Runde 1), darum Nit.

**Korrektur.** z. B. «… Geben Sie diesem Mietvertrag ein Vertragsende und erfassen Sie einen neuen Mietvertrag.» In fr, it und en entsprechend.

### V-10 (Nit): fr-Guillemets ohne geschütztes Leerzeichen

**Beleg.** `messages/fr.json:606` «avec « Terminer », puis»: Zwischen den Guillemets und dem Wort steht ein gewöhnliches Leerzeichen (Bytes geprüft). `i18n-begriffe.md:5`: «French guillemets with a non-breaking space inside (« Immeubles »)». In `fr.json` haben 45 Stellen das geschützte Leerzeichen. Mit gewöhnlichem Leerzeichen stehen nur diese Zeile und zwei ältere (`fr.json:1276-1277`).

**Korrektur.** U+00A0 innen einsetzen. Die älteren Zeilen gehören nicht zu B-15.

## Bestätigt (Delta)

- **`_open`** (`de.json:606`): «… beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden» und erfassen danach einen neuen.» Der Text wird nur ohne Vertragsende gezeigt (`ContractForm.svelte:192`), und genau dann zeigt die Detailseite «Beenden» (Runde 1, V-2: `[id]/+page.svelte:117-121`). Der Text auf der Schaltfläche stimmt in allen Sprachen mit `contracts_end_action` überein (`*.json:614`: «Beenden», «Terminer», «Terminare», «End contract»). «Beenden» setzt *gekündigt* (`anforderungen-vertragsende.md:37`). Für den Mieterwechsel ist das richtig (Einschränkungen in M-1, #155). Die Lücke aus V-2, Runde 1, ist damit sauber geschlossen.
- **`_mistake`**: Die Bedingung «noch nicht begonnen» stimmt mit der Löschregel überein (Runde 2, `+page.server.ts:232-244`). Der Satz erscheint auch bei begonnenen Verträgen. Er nennt seine Bedingung aber selbst, darum kein Befund. Der Weg für begonnene Verträge bleibt in #116.
- **`_link`**: «Zur Seite des Mietvertrags» ist ein reiner Navigationstext. Glossarbegriff «Mietvertrag». fr «contrat de bail», it «contratto di locazione», en «rental contract» stimmen mit `i18n-begriffe.md:84`.
- **`contracts_edit_purpose`**: «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» entspricht den zwei bearbeitbaren Panels «Vertragsdauer» und «Miete» (`ContractForm.svelte:201, 222`; `de.json:580-581`). Der Widerspruch zur Regel (vorher «Ändern Sie Mieter, Wohnung, …») ist beseitigt. fr, it und en sind gleich.
- **`_ended` bei Vertragsende = Tag des Mieterwechsels**, in der Zukunft wie in der Vergangenheit: richtig (Glossar `:36`, `anforderungen-vertragsende.md:127`). fr «à partir du lendemain de la fin du contrat», it «a partire dal giorno dopo la fine del contratto», en «from the day after the contract end» haben denselben Inhalt und verwenden die Begriffe aus `i18n-begriffe.md:26`.
- **Backend** (`contract.service.ts:353-356`): Das ist nur ein Refactoring (`moved`), die Regel bleibt gleich.
- **Formeln:** Das Delta berechnet keine Beträge. `computeAvailability` verliert nur den Parameter `excludeContractId`. Den brauchte die alte Auswahl der Wohnung im Bearbeiten-Formular, und die gibt es nicht mehr.

## Fehlende Begriffe

Keine neuen. «Mieterwechsel» und «Nachmieter» stehen in #140. Die Vorschläge zu V-7 und V-8 kommen ohne neue Begriffe aus.

## Nicht bestätigt

- **Art. 264 OR in der aktuellen Fedlex-Fassung:** Der Wortlaut stammt aus Runde 1. `mmx search` zeigt ihn nur in Sekundärquellen gleich. In dieser Runde habe ich nicht neu im Fedlex nachgeschlagen.
- **Ob das Formular ein früheres Vertragsende bei einem gekündigten Vertrag ohne Hürde annimmt** (V-7, Korrektur): Laut `anforderungen-vertragsende.md:29` bietet «Bearbeiten» bei einem gekündigten Vertrag die Vertragsdauer an. Gespeichert habe ich nicht, und ich habe keine laufende App gesehen. Ebenso offen: ob `PastEndConfirm` oder eine Abrechnung im Entwurf dazwischenkommt.
- **Praxis beim Umzug im selben Haus** (V-8, Überschneidung um einige Tage): Das ist Praxiswissen, keine Fedlex-Quelle. **unsicher**, ändert aber nichts an der Korrektur, weil die App solche Überschneidungen über zwei Wohnungen ohnehin zulässt.
