# Fachreview #499, Runde 1: «Abgerechnet bis» über eine versendete Dwello-Abrechnung

Gegenstand: Worktree `w1-review-499-fach` (80df615e): die @wip-Szenarien in `tests/e2e/features/contract-edit.feature:160-175`, der pg-Test in `backend/src/__tests__/billed-until.pg.test.ts:191-201`, die geplante Regel und die Texte in `scratchpad/w1-499-texte.md`. Gelesen habe ich ausserdem `backend/src/services/contract.service.ts:298-420`, `statement.service.ts:360-380, 658-728`, `src/lib/contract-form.ts:167-191`, `src/lib/accounting-period.ts:72`, `messages/*.json` (Zeilen 453-469, 1647), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md` und die Issues #499, #120, #141, #199, #358, #405, #448.

| ID | Rolle | Schwere | Befund | Entscheid |
|---|---|---|---|---|
| V-1 | Verwalter | Major | Die Sackgasse bleibt über eine andere Reihenfolge erreichbar: Zuerst «Abrechnung berichtigen» (dann ist die Abrechnung `replaced`, zählt also nicht mehr), danach «Abgerechnet bis» speichern, dann scheitert «Berichtigte Abrechnung erstellen» mit `STATEMENT_NO_RENTAL_DAYS_*`. Das geht auch mit einem Entwurf der berichtigten Abrechnung: #141 löscht ihn. | PO-Entscheid |
| V-2 | Verwalter | Major | Liegt der Vertragsbeginn in der Periode, dann ist das genannte Datum (Tag vor dem ersten abgerechneten Tag) der Tag vor dem Vertragsbeginn. Dwello lehnt genau diesen Tag mit `BILLED_UNTIL_BEFORE_START` ab, die Meldung schickt den Verwalter also zu einem abgelehnten Wert. | PO-Entscheid (Textvariante) |
| V-3 | Verwalter | Minor | Die Reihenfolge der Prüfungen fehlt in der Regel: Die neue Prüfung muss vor `statementsChanged`/#141 laufen, sonst kommt bei Entwurf plus versendeter Abrechnung wieder die 409 mit dem Weg über das Berichtigen. Die Reihenfolge in der Regel festhalten und mit einem pg-Fall (Entwurf 2025, versendet 2024) festnageln. | eindeutig |
| V-4 | Verwalter | Minor | Die Grenze ist im Plan `rentalStart` (richtig). Done means in #499 sagt dagegen «the day before that statement's period is accepted»: Im pg-Fall wird der 31.12.2023 mit 409 abgelehnt (#120). Im Pull Request als Detailabweichung vom Issue nennen (CLAUDE.md, «Coding guidelines»). | eindeutig |
| V-5 | Verwalter | Nit | «höchstens {date}»: Liegt das gespeicherte «Abgerechnet bis» schon in der Periode (pg-Fall: 30.04.2024), dann ist nur genau dieses Datum ohne Berichtigung möglich, ein früheres Datum führt zur 409 (#120). Der Text ist vertretbar, weil dieser Weg funktioniert (die berichtigte Abrechnung hat mehr Mietstage). | keine Änderung |
| V-6 | Verwalter | Minor | Lücken in den Tests: (a) Der bestehende Test `billed-until.pg.test.ts:203` erwartet für `2024-06-30` eine 409; er widerspricht dem neuen Test und muss ein anderes Datum nehmen (z.B. `2024-03-31`). (b) Kein Fall mit bezahlter Abrechnung. (c) Kein Fall mit einer Periode, die kein Kalenderjahr ist ({period} = «01.07.2024 – 30.06.2025»). (d) Das Szenario prüft nicht, dass die Meldung beim Feld «Abgerechnet bis» steht (Done means: «at the field»). | eindeutig |
| V-7 | Verwalter | Minor | fr/it «Pour {period}, …» bzw. «Per {period} …» lesen sich bei Datumsbereichen holprig («Pour 01.07.2024 – 30.06.2025»). Vorschlag: fr «Le décompte {number} ({period}) existe déjà dans Dwello.», it «Il conteggio {number} ({period}) esiste già in Dwello.», so wie `contracts_rent_taken_over_text`. | eindeutig (nur der deutsche Text ist entschieden) |
| V-8 | Verwalter | Nit | en «Enter at most the day before …» und it «al massimo» passen nicht zu einem Datum. Vorschlag: en «Enter no later than the day before this statement begins: {date}.», it «al più tardi» (fr hat schon «au plus tard»). | eindeutig |
| V-9 | Verwalter | Nit | Im fr-Entwurf stehen normale Leerzeichen in « Décompté jusqu’au » und vor « : ». `messages/fr.json` verwendet dort U+00A0 (Stil in `i18n-begriffe.md:5`). | eindeutig |
| V-10 | Verwalter | Nit | Die bestehenden deutschen Meldungen schreiben «Abgerechnet bis» ohne Guillemets (`messages/de.json:453-454`), der neue Text mit. Der neue Text folgt dem entschiedenen Wortlaut; keine Änderung, nur zur Kenntnis. | keine Änderung |
| M-1 | Mietrecht | Minor | Den echten Fall, dass dieselben Tage doppelt abgerechnet wurden (in Dwello und ausserhalb), kann der Verwalter in Dwello nicht mehr abbilden: Die Abrechnung lässt sich nicht stornieren, und was der Mieter zu viel bezahlt hat, wird nirgends festgehalten. Rückforderung nach Art. 62 OR **unsicher** (Wortlaut nicht von Fedlex). Das hat #499 bewusst so entschieden; ein Folge-Issue ist erst nötig, wenn der PO bei V-1 den Weg «Storno ohne Mietstage» behalten will. | PO-Entscheid (ausserhalb #499) |

## V-1 (Major): Sackgasse über eine ersetzte Abrechnung

**Beleg.**
- Regel im Plan (`w1-499-texte.md:6`): «Replaced statements (`replaced`) do not count».
- `statement.service.ts:663-668`: `replaceStatement` setzt den Status `replaced` als eigene Aktion.
- `statement.service.ts:702-727`: `correctStatement` ist eine zweite, spätere Aktion. Sie wirft `STATEMENT_NO_RENTAL_DAYS_PAID/REFUNDED/SENT`, wenn `CONTRACT_NOT_IN_PERIOD` eintritt.
- `contract.service.ts:362`: `statementsChanged` übergeht ersetzte Abrechnungen.

**Ablauf.**
1. NK-2024 ist bezahlt.
2. Der Verwalter wählt auf der Abrechnung «Abrechnung berichtigen». NK-2024 ist jetzt `replaced`, eine berichtigte Abrechnung gibt es noch nicht.
3. Er speichert «Abgerechnet bis» 30.06.2025. Die neue Regel greift nicht (ersetzt), #120 greift nicht (ersetzt).
4. «Berichtigte Abrechnung erstellen» scheitert mit `backend_statement_no_rental_days_refunded`. Das ist genau die Sackgasse aus P-1 bis P-3.

Gibt es schon einen Entwurf der berichtigten Abrechnung, dann bietet #141 an, ihn zu löschen. Danach ist es dieselbe Lage.

**Warum falsch.** Done means von #499 verlangt, dass die Sackgasse verschwindet. Bisher lag sie hinter einer Meldung, jetzt liegt sie hinter einer Reihenfolge, die die Abrechnungsseite frei anbietet.

**Korrektur (der PO wählt).**
- (a) Eine ersetzte Abrechnung zählt wie eine versendete, solange ihre berichtigte Abrechnung fehlt oder ein Entwurf ist (Ende der Kette, wie `openReplaced`, `statement.service.ts:364-379`). Die Meldung nennt dann die ersetzte Nummer. Damit ist die Sackgasse zu, aber der Weg «Storno ohne Mietstage» (`STATEMENT_NO_RENTAL_DAYS_*`, siehe M-1) ist ganz weg.
- (b) Die Regel bleibt wie entschieden. Für das Ergebnis von `STATEMENT_NO_RENTAL_DAYS_*` (Betrag, der dem Mieter zurückgeht, Status bleibt «Ersetzt») entsteht ein eigenes Issue.

Beides ändert, was #499 entschieden hat («sent or paid»), deshalb braucht es einen PO-Entscheid. Empfehlung: (a).

## V-2 (Major): Das vorgeschlagene Datum liegt vor dem Vertragsbeginn

**Beleg.**
- Die Regel `w1-499-texte.md:4` nennt `date` = Tag vor `rentalStart`, und `rentalStart` = das Spätere von Periodenbeginn, Vertragsbeginn und dem Tag nach dem früheren «Abgerechnet bis».
- `contract.service.ts:301-302`: `billedUntil < startDate` ergibt `BILLED_UNTIL_BEFORE_START`. Dasselbe gilt im Formular (`contract-form.ts:170-171`).

**Nachgerechnet** mit der Grundlage von `contract-edit.feature` (Anna Keller seit 01.04.2024):

| Fall | Abrechnung | `rentalStart` | `date` | Ergebnis |
|---|---|---|---|---|
| 1 | versendet 2024 | 01.04.2024 | 31.03.2024 | Eingabe abgelehnt: «liegt vor dem Vertragsbeginn 01.04.2024» |
| 2 | versendet 2025 (Szenario) | 01.01.2025 | 31.12.2024 | angenommen, korrekt |
| 3 (pg) | Vertragsbeginn 2020, gespeichertes «Abgerechnet bis» 30.04.2024 | 01.05.2024 | 30.04.2024 | angenommen, unverändert |

**Warum falsch.** In Fall 1 schickt die Meldung den Verwalter zu einem Datum, das Dwello ablehnt. Erst die zweite Meldung sagt, was richtig ist: das Feld leer lassen. Für die Zielgruppe (Design-Regeln: «errors say what happened and what to do») ist das ein unnötiger Fehlversuch.

**Korrektur.** Ist `date < startDate`, dann eine Variante, z.B.:

> Für {period} gibt es schon die Abrechnung {number} in Dwello. «Abgerechnet bis» kann nur Tage ohne Dwello-Abrechnung decken. Dwello rechnet diesen Mietvertrag ab Vertragsbeginn ab: Lassen Sie das Feld leer.

Dazu ein Szenario mit «versendete Abrechnung 2024» für Anna Keller. Weil es ein neuer Wortlaut neben dem entschiedenen ist, braucht es einen PO-Entscheid (Issue mit Labels `fachlich`, `entscheiden`, falls nicht in #499 nachgetragen).

## Wechselwirkungen #199 / #448 / ersetzte und berichtigte Abrechnungen

- **#199 (PR #525):**
  - Bei alten, sich überlappenden Perioden (z.B. Juli–Juni 2023/24 und Kalenderjahr 2024, beide versendet) nennt die Regel die früheste nach `rentalStart`. Das Datum ist dann der Tag vor deren erstem abgerechnetem Tag. Das ist richtig, denn das Datum deckt keine Abrechnung.
  - Eine Kurzperiode aus dem #199-Angebot (z.B. 01.07.–31.12.2024) heisst über `periodName` mit Daten. Das ist korrekt (siehe V-6c).
  - Den Hinweis auf fehlende Abrechnungen rechnet #199 ab dem Tag nach «Abgerechnet bis»; dazu gibt es keinen Konflikt.
- **Berichtigte Abrechnung (#358):** Ist die berichtigte Abrechnung versendet, dann zählt sie und die Meldung nennt ihre Nummer. Die ersetzte zählt nicht. Das ist korrekt. Offen bleibt der Fall ohne versendete berichtigte Abrechnung, siehe V-1.
- **#448 (Übertrag unter CHF 5, noch nicht gemergt):** #499 berührt den Übertrag nicht direkt. Eine bestehende Wechselwirkung gibt es aber: Übernimmt «Abgerechnet bis» später eine ganze Periode ausserhalb von Dwello, dann wartet der Übertrag auf die nächste Dwello-Abrechnung. Die «nächste Abrechnung» war aber die ausserhalb von Dwello. Das gehört zu #448, nicht zu #499 (siehe «Nicht bestätigt»).

## Bestätigt

- Welche Abrechnungen zählen: Gespeichert sind nur `draft/sent/paid/replaced`; «überfällig» ist ein versendeter Status, der berechnet wird (`schema.ts:461`). «sent or paid» deckt also auch gemahnte Abrechnungen.
- Entwürfe verhalten sich wie bisher (#141): Liegt ein Datum vor einer versendeten Abrechnung, aber über einem Entwurf, dann bietet Dwello an, den Entwurf zu löschen. Das ist korrekt, vorausgesetzt die Reihenfolge stimmt (V-3).
- Zwei versendete Abrechnungen (2024 und 2025), Eingabe 30.06.2025: Die Meldung nennt 2024, Datum 31.12.2023 (bei Vertragsbeginn vor 2024). Das ist richtig, denn das Datum deckt auch 2024.
- Periode Juli–Juni, versendet 01.07.2024–30.06.2025, Eingabe 31.03.2025: abgelehnt, {period} «01.07.2024 – 30.06.2025», Datum 30.06.2024 (`periodName`, `accounting-period.ts:72`).
- Ein unverändert gespeicherter Wert löst keine Ablehnung aus. Das ist nötig, weil das Formular «Abgerechnet bis» bei jedem Speichern mitschickt (`contract-form.ts:191`).
- Nach den bestehenden Regeln kann ein gespeicherter Wert über einer versendeten Abrechnung nur über eine ersetzte Abrechnung entstehen (`statementsChanged` und die Erstellung ab `billingStart`).
- pg-Test: `date: '2024-04-30'` prüft genau die `rentalStart`-Grenze (eine Grenze am Periodenbeginn gäbe 2023-12-31). Ein Datum davor bekommt weiter 409 (#120), und das ist richtig, weil die berichtigte Abrechnung dann funktioniert.
- Szenarien: Das Datum 31.12.2024 im ersten Szenario stimmt (Anna Keller seit 01.04.2024, versendet 2025). Das zweite Szenario nimmt den 31.12.2024 an (keine Abrechnung 2024 vorhanden).
- Begriffe:
  - «Abgerechnet bis» entspricht `UBIQUITOUS_LANGUAGE.md:49`. fr «Décompté jusqu’au», it «Conteggiato fino al», en «Billed until» entsprechen `i18n-begriffe.md:92`.
  - «Abrechnung» heisst fr «décompte», it «conteggio», en «statement», wie in den bestehenden Texten (`i18n-begriffe.md:72`).
  - «Dwello-Abrechnung» ist im Glossar kein Begriff, steht aber im entschiedenen Text von #499 und braucht deshalb keine Markierung.
  - Die #405-Regeln sind nicht berührt (kein Wort aus Punkt 1–3).
- Der deutsche Text entspricht dem Entscheid. Dass das Datum ans Ende kommt, ist eine Ergänzung, die dem Entscheid nicht widerspricht («so the landlord need not look it up»).

## Nicht bestätigt

- **Art. 62 OR** (Rückforderung bei doppelter Abrechnung, M-1): Den Wortlaut habe ich nur aus Sekundärquellen (zh.ch, glossagens.ch über `mmx search`), nicht von Fedlex. Deshalb **unsicher**.
- **Wie die Meldung beim Feld erscheint:** `ContractForm.svelte` mit der neuen Fehlerzuordnung ist noch nicht gebaut. Ich habe nur `contract-form.ts` gelesen.
- **#448:** Wie ein Übertrag aus einer ersetzten Abrechnung ohne Mietstage behandelt wird, kann ich nicht beurteilen. Der Code ist nicht auf `main` und nicht in diesem Worktree; ich habe nur den Issue-Text gelesen.
- **Bestehende Daten** im Zustand der Sackgasse (z.B. Laura Keller: «Abgerechnet bis» 30.06.2025, NK-2024 «Ersetzt» ohne berichtigte Abrechnung): Die neue Regel ändert daran nichts. Ob es in Produktivdaten solche Fälle gibt, habe ich nicht geprüft (keine Datenbank angefasst).
