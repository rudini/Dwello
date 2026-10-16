# Fachreview w3b, Runde 1: Abrechnungsnummer ohne Wiedervergabe (#97), PDF-Dateiname (#101)

Geprüft: Worktree `review-w3b-fach`, Commit `d0d4dce`, `git diff d0d4dce~1 d0d4dce`:
- `tests/e2e/features/statement-generate.feature` «Die Nummer einer gelöschten Abrechnung wird nicht wieder vergeben» (Zeilen 77–86)
- `tests/e2e/features/statement-detail.feature` «Das PDF heisst wie die Nummer der Abrechnung» (Zeilen 146–154)
- dazu die neuen Steps und Questions (`tests/e2e/steps/statement-detail.steps.ts:195-201`, `tests/e2e/questions/statements.ts:24-38`) und die geplante Umsetzung (Zähler je Gebäude und Jahr, Start beim höchsten bestehenden Wert; BFF nennt die Datei `<Abrechnungsnummer>.pdf`).

Ergebnis: kein Blocker, kein Major. Die Regel aus #97 ist mietrechtlich und buchhalterisch unbedenklich und aus Sicht der Verwaltungspraxis besser als die heutige Wiedervergabe. Die erwarteten Nummern stimmen. Offen ist vor allem der Begriff: «Nummer der Abrechnung» steht nicht im Glossar, die App sagt schon «Abrechnungsnummer».

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | «Nummer der Abrechnung» fehlt im Glossar; die App sagt schon «Abrechnungsnummer» (Suche) bzw. «Abrechnungsnr.» (PDF). Szenario-Wortlaut angleichen, Glossar-Issue und TODO-Marker nötig |
| V-2 | Verwalter | Minor | Die Löschbestätigung nennt die neue Folge nicht: Die Nummer wird nicht wieder vergeben, ein schon weitergegebenes PDF des Entwurfs ist ungültig |
| V-3 | Verwalter | Minor | Ist die höchste Nummer schon vor der Migration gelöscht worden, wird sie einmal noch vergeben. Das ist unvermeidbar, sollte aber in `docs/data-model.md` stehen |
| V-4 | Verwalter | Minor | Der Zähler muss für jeden Weg gelten, auf dem eine Abrechnung eine Nummer erhält, auch für die geplante berichtigte Abrechnung (#120), nicht nur für `generateStatement` |
| V-5 | Verwalter | Nit | Szenarioname «Nummer einer gelöschten Abrechnung»: gelöscht werden kann nur ein Entwurf. «… eines gelöschten Entwurfs» ist genauer |
| V-6 | Verwalter | Nit | «existing numbers unchanged» prüft das Szenario nicht. Eine Zeile für Eva Frei (`-2024-0001`) würde es zeigen |
| V-7 | Verwalter | Nit | Dateiname ohne Dokumentart: Bei Mahnungen heisst die Datei «Zahlungserinnerung NK-….pdf», bei der Abrechnung nur «NK-….pdf». Das ist so entschieden (#101), nur als Hinweis |
| V-8 | Verwalter | Nit | Ein Zähler je Gebäude-UUID, aber die Nummer enthält nur 8 Zeichen der UUID. Teilen zwei Gebäude diesen Präfix, schlägt der eindeutige Index an (keine Doppelvergabe, aber ein Fehler beim Erstellen) |
| M-1 | Mietrecht | – | Lücken in den Nummern: keine Vorschrift verletzt (bestätigt, siehe unten) |
| M-2 | Mietrecht | – | Jahr in der Nummer = Jahr des Periodenendes: zulässig, keine Vorschrift. Beibehalten (bestätigt, siehe unten) |

## Befunde

### V-1 (Minor): Begriff «Nummer der Abrechnung» / «Abrechnungsnummer» fehlt im Glossar

Belege:
- `UBIQUITOUS_LANGUAGE.md` hat «Wohnungsnummer» (Zeile 18), «Rechnungsnummer» (Zeile 62) und «QR-Referenz» (Zeile 198), aber keinen Eintrag für die Nummer `NK-…` der Nebenkostenabrechnung. Nur indirekt erwähnt bei «Berichtigte Abrechnung» («ersetzt NK-…»).
- Die App sagt schon «Abrechnungsnummer»: `messages/de.json:966` `"statements_search_help": "Mieter, Abrechnungsnummer oder Wohnung"`. Das PDF druckt «Abrechnungsnr.» (`backend/src/services/pdf.service.ts:64`).
- Die Szenarien sagen «Nummer der Abrechnung» (`statement-generate.feature` Zeile 79, `statement-detail.feature` Zeilen 148 und 154 sowie die Steps).
- `CLAUDE.md` «Design-Regeln»: Fehlt ein Begriff, erhält er `TODO(fachlich prüfen, #<issue>)` und ein Issue. Bei den offenen `fachlich`-Issues habe ich keines dazu gefunden (#75, #290, #120 geprüft).

Warum falsch: Die Szenarien führen einen dritten Wortlaut für dieselbe Sache ein. Das widerspricht der Konvention, nur Glossarbegriffe zu verwenden.

Fix:
- In den Szenarien und Steps «Abrechnungsnummer» statt «Nummer der Abrechnung» schreiben, z. B.:
  - «Szenario: Die Abrechnungsnummer eines gelöschten Entwurfs wird nicht wieder vergeben»
  - «Dann endet die Abrechnungsnummer von "Marc Huber" auf "-2024-0003"»
  - «Szenario: Das PDF heisst wie die Abrechnungsnummer»
  - «Dann heisst die Datei wie die Abrechnungsnummer, mit der Endung ".pdf"»
- Ein Issue eröffnen (Labels `fachlich`, `entscheiden`) und einen Kommentar `# TODO(fachlich prüfen, #<n>): «Abrechnungsnummer» fehlt im Glossar` über beide Szenarien setzen.

Vorschlag Glossareintrag (Abschnitt Nebenkostenabrechnung):

> **Abrechnungsnummer** | Nummer einer Nebenkostenabrechnung, `NK-{Gebäude}-{Jahr}-NNNN`: die ersten acht Zeichen der Gebäude-ID, das Jahr des Endes der Abrechnungsperiode und eine laufende Nummer je Gebäude und Jahr. Wird nie zweimal vergeben: Die Nummer eines gelöschten Entwurfs bleibt eine Lücke. Steht auf dem PDF («Abrechnungsnr.»), im Dateinamen und in der Mitteilung der QR-Rechnung. | `statement_number`; Zähler: siehe `docs/data-model.md`

fr/it/en wie im PDF: «N° de décompte», «N. conteggio», «Statement no.» (`pdf.service.ts:142, 219, 296`). Ob diese als Begriffe gelten, entscheidet das Issue.

### V-2 (Minor): Die Löschbestätigung verschweigt die neue Folge

Beleg: `messages/de.json:987` `"statements_delete_text": "Die Abrechnung {number} von {tenant} wird gelöscht. Das lässt sich nicht rückgängig machen."`. `CLAUDE.md` «Design-Regeln»: «Irreversible actions confirm with their real consequence.» Grund für #97 ist laut Issue: «A draft's PDF may already have been downloaded and shared».

Warum: In der Praxis ist ein weitergegebener Entwurf das eigentliche Risiko. Wer ihn löscht, muss dem Mieter sagen, dass dieses Dokument nicht gilt. Nach #97 bleibt die Nummer frei. Die Bestätigung sagt das nicht, die Lücke bleibt für den Vermieter unerklärt.

Fix (Vorschlag, braucht ein Szenario und alle vier Sprachen; der Product Owner entscheidet, ob es in diesen PR gehört): «Die Abrechnung {number} von {tenant} wird gelöscht. Die Nummer {number} wird nicht wieder vergeben. Haben Sie das PDF schon weitergegeben, teilen Sie dem Mieter mit, dass es nicht gilt.» Sonst ein Issue `fachlich`.

### V-3 (Minor): Nummern, die vor der Migration gelöscht wurden

Beleg: Heute zählt `generateStatementNumber` ab dem höchsten bestehenden Wert weiter (`backend/src/services/calculation.service.ts:445-454`). Geplant ist, den Zähler ab dem höchsten bestehenden Wert zu starten.

Nachgerechnet:
- Beispiel a: Bestehend `-0001`, `-0002`, `-0003`. `-0003` wurde vor der Migration gelöscht. Der Zähler startet bei 2, die nächste Nummer ist wieder `-0003`. Genau die Wiedervergabe, die #97 verhindern soll, aber nur einmal und nur für Altfälle.
- Beispiel b: Bestehend `-0001`, `-0003` (`-0002` gelöscht). Der Zähler startet bei 3, die nächste Nummer ist `-0004`. Korrekt.
- Beispiel c: Für ein Gebäude und Jahr gibt es noch keine Abrechnung. Der Zähler startet bei 0, die nächste Nummer ist `-0001`. Korrekt.

Warum: Ohne Protokoll der Löschungen lässt sich das nicht beheben. Es ist mit «existing numbers do not change» vereinbar.

Fix: In `docs/data-model.md` beim Zähler in einem Satz festhalten, dass er beim höchsten Wert zur Zeit der Migration beginnt und eine vorher gelöschte höchste Nummer einmal noch vergeben werden kann. Kein Code nötig.

### V-4 (Minor): Ein Zähler für alle Wege zur Nummer

Belege:
- `UBIQUITOUS_LANGUAGE.md`, «Berichtigte Abrechnung»: «Neue Nebenkostenabrechnung, die eine versendete oder bezahlte Abrechnung ersetzt («ersetzt NK-…»)», geplant #120.
- #120, «Decided (product owner)»: «a berichtigte Abrechnung marked «ersetzt NK-…»».

Warum: Erhält die berichtigte Abrechnung ihre Nummer später auf einem eigenen Weg, z. B. per Kopie oder mit eigener Logik, kann wieder eine Nummer doppelt vorkommen oder ein Zähler übersprungen werden.

Fix: Die Nummer nur an einer Stelle vergeben (die Funktion mit dem Zähler). In `docs/data-model.md` steht: «jede Abrechnung, auch eine berichtigte, erhält ihre Nummer aus diesem Zähler». Für #120 ein Satz im Issue.

### V-5 (Nit): «gelöschte Abrechnung» heisst immer «gelöschter Entwurf»

Beleg: `backend/src/services/statement.service.ts:493-496`: «Only a draft may be deleted». Glossar Zeile 169: «Entwurf: Abrechnung erstellt, noch nicht versendet.»

Fix: Szenarioname «Die Abrechnungsnummer eines gelöschten Entwurfs wird nicht wieder vergeben». Der Kommentar in Zeile 77 sagt es schon richtig («Das PDF eines Entwurfs»).

### V-6 (Nit): Unveränderte bestehende Nummer nicht geprüft

Beleg: In #97, «Done means» steht «existing numbers do not change». Das Szenario prüft nur Marc Huber.

Fix (optional): `Und endet die Abrechnungsnummer von "Eva Frei" auf "-2024-0001"`. Die Migration selbst gehört in einen `*.pg.test.ts`.

### V-7 (Nit): Dokumentart im Dateinamen

Beleg: Mahnungen heissen `${letter.title} ${statement.statementNumber}.pdf` (`backend/src/services/reminder.service.ts:106`). Das Backend liefert für die Abrechnung schon `statement-${result.statementNumber}.pdf` (`backend/src/routes/statements.ts:324`), die BFF überschreibt das mit `abrechnung-${id}.pdf` (`src/routes/statements/[id]/pdf/+server.ts:25`).

Warum nur Nit: #101 legt das Beispiel `NK-1A2B3C4D-2025-0001.pdf` fest, das «NK» kennzeichnet die Nebenkostenabrechnung. Kein Name des Mieters im Dateinamen ist datenschutzfreundlich, wenn die Datei weitergeleitet wird. Hinweis für die Umsetzung: Es sollte nur eine Quelle für den Namen geben (BFF oder Backend), damit nicht zwei Namen nebeneinander bestehen.

### V-8 (Nit): Präfix aus 8 Zeichen gegenüber einem Zähler je Gebäude

Belege:
- `calculation.service.ts:446`: `buildingId.substring(0, 8).toUpperCase()`.
- `backend/migrations/0001_schema.sql:270`: `CREATE UNIQUE INDEX statements_number_idx ON utility_statements(statement_number)`.

Warum: Heute teilen zwei Gebäude mit gleichem Präfix über `LIKE prefix%` eine Folge. Mit einem Zähler je `building_id` erhielten beide `-0001`, und der eindeutige Index lehnt den zweiten ab. Eine Doppelvergabe entsteht nicht, aber das Erstellen schlägt fehl. Bei unter 50 Wohnungen ist das praktisch ausgeschlossen (1 zu 16^8).

Fix (optional): den Zähler nach dem Präfix (8 Zeichen) und dem Jahr schlüsseln, nicht nach der UUID.

## Bestätigt

### Erwartete Nummern im Szenario (`statement-generate.feature` Zeilen 77–86)

Ablauf, nachgerechnet mit dem Code in `d0d4dce`:
- Die Grundlage legt pro Szenario ein neues Gebäude an. Die Givens erzeugen die Abrechnungen über `POST statements/generate` (`tests/e2e/fixtures/backend.ts:156-165`), also mit der echten Nummernvergabe: Eva Frei `-2024-0001`, Marc Huber `-2024-0002`.
- Das Löschen über `DELETE statements/{id}` (`backend.ts:214-216`) ist erlaubt, weil die Abrechnung ein Entwurf ist.
- Erneutes Erstellen ergänzt nur, was fehlt (Szenario «Abrechnungen erneut erstellen ergänzt nur die fehlenden», Zeilen 40–44). Also erhält nur Marc Huber eine neue Abrechnung.
- Nach #97 ist das `-2024-0003`. Heute ergibt sich `-2024-0002`, weil der höchste Wert `-0001` ist. Das Szenario scheitert also am fehlenden Verhalten, wie es sein soll.
- Das Jahr 2024 stimmt: Die Periode endet am 31.12.2024 (`backend.ts:160`), `getUTCFullYear()` auf `new Date('2024-12-31')` ergibt 2024.
- Randfall, nur ein Entwurf, gelöscht: heute `-0001` erneut, neu `-0002`.
- Randfall Rückerstattung oder Saldo 0: hat keinen Einfluss auf die Nummer.

### M-1: Lücken in der Nummernfolge

- Mietrecht: OR und VMWG verlangen keine Nummer und keine lückenlose Folge. Verlangt werden eine jährliche Abrechnung und Einsicht in die Belege:
  - Art. 4 Abs. 1 VMWG (Fedlex, SR 221.213.11, Fassung 1.10.2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
  - Art. 257b Abs. 2 OR (Fedlex, SR 220, Fassung 1.10.2026): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
  - Art. 8 Abs. 2 VMWG: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»

  Die Belege sind die Rechnungen, nicht die anderen Abrechnungen. Ein Mieter sieht nur seine eigene Nummer. Eine Lücke (z. B. `-0003` statt `-0002`) verrät ihm nichts und schadet ihm nicht. Eine wieder vergebene Nummer dagegen schon: Zwei verschiedene Dokumente mit derselben Nummer, und die Mitteilung der QR-Rechnung enthält die Nummer (`backend/src/services/qr-bill.service.ts:364`). Die Regel aus #97 schützt also den Mieter.
- Mehrwertsteuer: Die Wohnungsmiete samt Nebenkosten ist von der Steuer ausgenommen. Art. 21 Abs. 2 Ziff. 21 MWSTG (Fedlex, SR 641.20, Fassung 31.3.2025): «die Überlassung von Grundstücken und Grundstücksteilen zum Gebrauch oder zur Nutzung; steuerbar sind jedoch: a. die Vermietung von Wohn- und Schlafräumen zur Beherbergung von Gästen …». Selbst Art. 26 Abs. 2 MWSTG verlangt keine Rechnungsnummer: «Die Rechnung muss den Leistungserbringer …, den Leistungsempfänger … und die Art der Leistung eindeutig identifizieren und in der Regel folgende Elemente enthalten: a. den Namen und den Ort des Leistungserbringers … b. den Namen und den Ort des Leistungsempfängers … c. Datum oder Zeitraum der Leistungserbringung … d. Art, Gegenstand und Umfang der Leistung; e. das Entgelt für die Leistung; f. den anwendbaren Steuersatz …». Eine Nummer, ob lückenlos oder nicht, kommt nicht vor.
- Buchführung: Art. 957 Abs. 2 OR (Fedlex): «Lediglich über die Einnahmen und Ausgaben sowie über die Vermögenslage müssen Buch führen: 1. Einzelunternehmen und Personengesellschaften mit weniger als 500 000 Franken Umsatzerlös im letzten Geschäftsjahr; …». Abs. 3: «Für die Unternehmen nach Absatz 2 gelten die Grundsätze ordnungsmässiger Buchführung sinngemäss.» Eine Pflicht zu lückenlosen Belegnummern steht dort nicht.
  - Ein privater Vermieter mit unter 50 Wohnungen führt meist kein Unternehmen im Sinn von Art. 957 Abs. 1, sondern verwaltet privates Vermögen. Diese Einordnung habe ich nicht an einer Quelle belegt: **unsicher**.
  - Wenn eine Buchführung verlangt ist, dann eine vereinfachte. Wo ein Gesetz lückenlose Nummern verlangt, betrifft das Buchungsbelege der Buchhaltung, nicht ein Dokument an den Mieter, das als Entwurf nie gültig wurde.
- Praxis: Verwaltungen nummerieren Abrechnungen, damit Zahlung und Rückfragen eindeutig zuzuordnen sind. Lücken durch stornierte Entwürfe sind üblich und unproblematisch. Entscheidend ist, dass eine Nummer nie zwei Dokumente bezeichnet. Die QR-Referenz hängt nicht an der Nummer, sondern an der ID (`qr-bill.service.ts:334`, `statementQRReference(statement.id)`), Lücken stören den Zahlungsabgleich also nicht.
- Berichtigte Abrechnung nach Löschen: Eine versendete Abrechnung kann nicht gelöscht werden (`statement.service.ts:493-496`), eine Lücke entsteht also nur bei Entwürfen. Wird eine versendete Abrechnung berichtigt, erhält sie nach #120 eine neue Nummer mit «ersetzt NK-…». Das ist mit dem Zähler verträglich, siehe V-4.

### M-2: Jahr in der Nummer = Jahr des Periodenendes

- Heutiger Code: `periodEnd.getUTCFullYear()` (`calculation.service.ts:446`).
- Beispiel a: Periode Juli–Juni 01.07.2024–30.06.2025 ergibt `NK-…-2025-NNNN`.
- Beispiel b: Kalenderjahr 01.01.–31.12.2025 ergibt ebenfalls 2025. Beide Perioden teilen sich dann die Folge 2025. Doppelt wird nichts vergeben, weil der Zähler je Gebäude und Jahr läuft.
- Randfall Rumpfperiode beim Wechsel von Kalenderjahr auf Juli–Juni: 01.01.–30.06.2025 ergibt 2025, die folgende Periode 01.07.2025–30.06.2026 ergibt 2026. Eindeutig.
- Recht: Kein Gesetz schreibt das Jahr in der Nummer vor. Art. 4 Abs. 1 VMWG verlangt nur, «jährlich mindestens einmal» abzurechnen.
- Praxis: Verwaltungen bezeichnen eine Juli–Juni-Abrechnung oft «2024/25». In einer kurzen Nummer ist das Endjahr üblich und eindeutig, weil die Abrechnung erst nach dem Periodenende entstehen kann. Die Periode selbst steht mit Beginn und Ende im PDF (`docs/nebenkostenabrechnung-anforderungen.md` Zeile 31). Die Liste zeigt das Enddatum (`tests/e2e/targets/statements.ts:9`).
- Empfehlung: Endjahr beibehalten. Ein Wechsel auf das Startjahr würde dieselbe Zahl bei bestehenden und neuen Nummern unterschiedlich deuten und dem Ziel von #97 widersprechen, dass bestehende Nummern ihre Bedeutung behalten.

### PDF-Dateiname (#101)

`NK-` + 8 Zeichen `[0-9A-F]` + `-JJJJ-NNNN` besteht nur aus ASCII-Zeichen ohne Leer- oder Anführungszeichen. Der Dateiname ist damit sicher, auch im `Content-Disposition`-Header. Die Nummer entsteht nur im Backend (`statementNumber` kommt in `backend/src/routes` nicht als Eingabe vor). Die Question vergleicht mit der Nummer im Seitentitel (`statements_title`: «Abrechnung {number}»). Das PDF druckt dieselbe Nummer (`pdf.service.ts:540`), der Kommentar im Szenario («die Nummer, die auf dem PDF steht») trifft also zu.

## Hinweis ausserhalb der drei Rollen

`tests/e2e/CLAUDE.md` Zeile 77: «`@api` is for business rules and calculations that do not depend on the UI». Die Nummernregel ist so eine Regel, das Szenario liest die Nummer aber über die Liste (UI). Ob es `@api` werden soll (mit API-Pfad für die Question), entscheidet `code-reviewer`. Fachlich ist beides richtig.

## Nicht bestätigt

- **unsicher**: Ob ein privater Vermieter mit eigenem Mietobjekt unter Art. 957 OR fällt (Unternehmen oder private Vermögensverwaltung). Gesucht mit `mmx search` (Treffer: kmu.admin.ch, justement.ch, nur Sekundärquellen) und im Fedlex-Text von Art. 957 OR. Das Ergebnis M-1 hängt nicht davon ab, weil auch Art. 957 keine lückenlose Nummer verlangt.
- **unsicher**: Die Praxis «Lücken durch Entwürfe sind in Verwaltungen üblich» und «Juli–Juni-Abrechnungen werden 2024/25 bezeichnet». Das ist Erfahrungswissen, keine Quelle gefunden. Gesucht habe ich nicht weiter, weil keine Rechtsfolge daran hängt.
- Ob ein offenes Issue den Begriff «Abrechnungsnummer» schon enthält: Die Suche über `search/issues` ist in dieser Sitzung gesperrt (HTTP 403). Durchgesehen habe ich die Liste der offenen `fachlich`-Issues (`repos/rudini/Dwello/issues?labels=fachlich`) und die Texte von #75, #290 und #120, ohne Treffer.
- Fedlex-Texte habe ich über den SPARQL-Endpunkt und die Filestore-HTML-Fassungen gelesen: MWSTG Fassung 31.3.2025, OR Fassung 1.10.2026, VMWG Fassung 1.10.2025.
