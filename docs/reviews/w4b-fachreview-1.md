# Fachreview W4b (Runde 1): Zahlung einer Abrechnung (#138, #93, #92)

Gegenstand: Commit `b5ecd9d` (Worktree `review-w4b-fach`), @wip-Szenarien in `tests/e2e/features/statement-detail.feature`, geplante Texte und Codes laut Auftrag, geplantes «No scenario» für #93.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Ein PDF, das während «Bezahlt» erstellt wurde («Bezahlt am … Vielen Dank.», ohne Zahlteil), bleibt nach dem Zurücksetzen gespeichert |
| V-2 | Verwalter | Minor | Fehlertext vor dem Abrechnungsdatum sagt bei einer Rückerstattung «an dem das Geld eingegangen ist» |
| V-3 | Verwalter | Minor | Ist das Geld wirklich vor dem Abrechnungsdatum eingegangen, sagt der Fehlertext nicht, was zu tun ist (entscheiden) |
| V-4 | Verwalter | Minor | Bestätigung «Zahlung zurücksetzen» nennt beide Status statt des Status, der tatsächlich gilt; die Folge «wieder offen, Mahnung möglich» fehlt |
| V-5 | Verwalter | Minor | «Zahlung zurücksetzen» auch bei Saldo 0.00: dann ist eine Abrechnung ohne Zahlung «nicht bezahlt», später «Überfällig» (entscheiden) |
| V-6 | Verwalter | Minor | Szenarien unterscheiden eingegebenes Zahlungsdatum, Tag des Erfassens und Tag des Zurücksetzens nicht: alle sind heute |
| V-7 | Verwalter | Minor | Kein Szenario für den eigentlichen Zweck von #92: zurücksetzen und mit dem richtigen Datum neu als bezahlt markieren |
| V-8 | Verwalter | Minor | PRD sagt noch «Bezahlt … final, cannot be reverted» / «No undo» |
| V-9 | Verwalter | Minor | Begriffe «Abrechnungsdatum» und «Zahlung zurücksetzen» fehlen im Glossar |
| V-10 | Verwalter | Nit | «Danach können Sie keine Mahnung mehr senden.» im Dialog «Als bezahlt markieren» stimmt mit #92 nicht mehr ganz; die Hilfe nennt das Zurücksetzen nicht |
| V-11 | Verwalter | Nit | Verlauf: Reihenfolge und Schlüssel der Zeilen bei mehrfachem Zurücksetzen |
| V-12 | Verwalter | Nit | «Zahlungseingang» in Szenariotiteln: nicht im Glossar, bei einer Rückerstattung falsch |
| V-13 | Verwalter | Nit | Testdaten «Zahlungsfrist abgelaufen»: Zahlungsfrist 2 Tage vor dem Abrechnungsdatum |

Keine Befunde der Rolle Mietrecht (M) und keine der Rolle Rechtstexte (R): die Änderung berührt weder Datenschutzerklärung noch Nutzungsbedingungen. Was bestätigt ist, steht unter «Bestätigt».

---

## V-1 (Major): PDF mit «Bezahlt am» bleibt nach dem Zurücksetzen

**Beleg.**
- `backend/src/services/pdf.service.ts:550`: `if (data.paidDate) return fill(data.balance < 0 ? t.refundPaidOn : t.paidOn, …)`, Text `:87` «Bezahlt am {date}. Vielen Dank.» bzw. `:88` «Überwiesen am {date}.»; `:909`: kein Zahlteil, wenn `paidDate` gesetzt ist.
- `backend/src/services/statement-pdf.service.ts:136`: `paidDate: (statement.status === 'paid' && statement.paidDate) || undefined`: ein PDF, das erstellt wird, während die Abrechnung bezahlt ist, druckt die Zahlung und lässt den Zahlteil weg.
- `backend/src/services/statement.service.ts:411-419`: das gespeicherte PDF wird nur bei geänderter Zahlungsfrist oder geändertem Abrechnungsdatum verworfen; `statement-pdf.service.ts:303`: `getStatementPdf` liefert das gespeicherte PDF, solange eines da ist.
- Geplant (#92): Status zurück, Zahlungsdatum und Betrag gelöscht. Vom PDF ist nicht die Rede.

**Warum falsch.** Erstellt der Verwalter das PDF neu, während die Abrechnung bezahlt ist (z. B. für die eigenen Unterlagen oder weil der Mieter eine Kopie will), und setzt er danach die Zahlung zurück, liefert Dwello weiter ein Dokument «Bezahlt am 05.01.2026. Vielen Dank.» ohne Zahlteil. Schickt er es dem Mieter (z. B. zusammen mit einer Mahnung), bestätigt er schriftlich eine Zahlung, die er gerade zurückgenommen hat. Der Mieter kann sich darauf berufen; ob dieser Satz rechtlich als Quittung im Sinn von Art. 88 Abs. 1 OR gilt («Der Schuldner, der eine Zahlung leistet, ist berechtigt, eine Quittung … zu fordern»), ist **unsicher**. In der Praxis ist es ein Widerspruch zwischen Dokument und Status. Dasselbe gilt umgekehrt: ein PDF mit dem alten Zahlungsdatum bleibt auch nach erneutem «Als bezahlt markieren» mit einem anderen Datum stehen.

**Behebung.** Das Zurücksetzen verwirft das gespeicherte PDF (`pdfBlob`, `pdfGeneratedAt` auf `null`), wenigstens wenn es während «Bezahlt» erstellt wurde. Das nächste PDF wird wieder wie versendet erstellt: Abrechnungsdatum und Zahlungsfrist bleiben, die QR-Referenz hängt nur an der ID (`statement-pdf.service.ts:264`), der Zahlteil ist wieder da. Ein pg-Test: bezahlt, PDF erstellt, zurückgesetzt, PDF enthält «Bezahlt am» nicht mehr. Die Bestätigung (V-4) kann es nennen, wenn ein solches PDF existierte. Nachtrag für den Verlauf: die Zeile «PDF erstellt» verschwindet dann, das ist richtig.

## V-2 (Minor): Fehlertext bei einer Rückerstattung

**Beleg.** Geplant: «Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom {date}. Geben Sie den Tag ein, an dem das Geld eingegangen ist.» Die Hilfe des Feldes bei einer Rückerstattung: `messages/de.json` `statements_paid_help_refund` «Der Tag, an dem Sie den Betrag überwiesen haben.» Glossar `UBIQUITOUS_LANGUAGE.md:156`: «negativ = Rückerstattung»; `:181` Zahlungsfrist «Bei einer Rückerstattung das Datum, bis zu dem der Vermieter zurückerstattet».

**Warum falsch.** Bei einer Rückerstattung zahlt der Vermieter; bei ihm «geht» kein Geld «ein». Hilfe und Fehler widersprechen sich im selben Feld. Der bestehende Zukunftsfehler (`statements_paid_date_future`) hat denselben Fehler; er bestand schon vor der Änderung, der neue Text übernimmt ihn.

**Behebung.** Den zweiten Satz nach dem Saldo wählen wie die Hilfe: bei einer Rückerstattung «Geben Sie den Tag ein, an dem Sie den Betrag überwiesen haben.», für beide Fehler (vor dem Abrechnungsdatum, in der Zukunft). Unit-Test für `paidDateError` mit negativem Saldo.

## V-3 (Minor, entscheiden): Geld wirklich vor dem Abrechnungsdatum eingegangen

**Beleg.** Das Abrechnungsdatum ist der Tag, an dem der Verwalter in Dwello «Als versendet markieren» wählt (`statement.service.ts:437-441`, `datedToday`), nicht der Tag, an dem der Mieter das PDF bekommt. `messages/de.json` `statements_send_text_1`: «Stellen Sie dem Mieter das PDF zu und markieren Sie die Abrechnung danach als versendet.»; `statements_send_text_2`: «… Stellen Sie das PDF deshalb am selben Tag zu.»

**Warum fraglich.** Wer das PDF am Montag per E-Mail schickt und erst am Mittwoch «Als versendet markieren» wählt, hat ein Abrechnungsdatum Mittwoch. Zahlt der Mieter am Dienstag, lehnt Dwello das wahre Zahlungsdatum ab. Der Fehlertext sagt dann «Geben Sie den Tag ein, an dem das Geld eingegangen ist» – genau das hat der Verwalter getan; er erfährt nicht, was er tun soll. Der Product Owner hat die Untergrenze bewusst ohne Bestätigung für frühere Daten entschieden (#138); der Befund stellt die Untergrenze nicht in Frage, nur den Ausweg im Text (Design-Regel: «errors say what happened and what to do»).

**Behebung (zum Entscheiden).** Zweiter Satz z. B.: «Ist das Geld vor diesem Tag eingegangen, geben Sie das Abrechnungsdatum ein.» Alternative: Text so lassen, dann bleibt der Fall ohne Ausweg. Issue mit Labels `fachlich`, `entscheiden`.

## V-4 (Minor): Bestätigung nennt die Folge nicht genau

**Beleg.** Geplant: «Die Abrechnung {number} gilt dann wieder als nicht bezahlt. Ihr Status wird «Versendet», nach Ablauf der Zahlungsfrist «Überfällig». Das Zahlungsdatum {date} wird gelöscht. Der Verlauf hält das Zurücksetzen fest.» Glossar `:172` Überfällig «Versendet und Zahlungsfrist überschritten». CLAUDE.md Design-Regeln: «Irreversible actions confirm with their real consequence.»

**Warum ungenau.** Die Seite kennt die Zahlungsfrist. Der Satz liest sich so, als würde die Abrechnung zuerst «Versendet» und erst später «Überfällig»; ist die Frist schon abgelaufen (Szenario «Zahlung einer Abrechnung mit abgelaufener Zahlungsfrist zurücksetzen»), ist sie sofort «Überfällig». Für den unerfahrenen Vermieter ist zudem die praktische Folge wichtiger als der Statusname: die Abrechnung zählt wieder als offen, und nach der Zahlungsfrist kann er (bei einer Nachzahlung) wieder mahnen.

**Behebung.** Den Satz nach der Frist wählen:
- Frist abgelaufen: «Ihr Status wird «Überfällig», weil die Zahlungsfrist am {deadline} abgelaufen ist.»
- Frist läuft: «Ihr Status wird «Versendet»; nach dem {deadline} ist sie überfällig.»
Bei einer Nachzahlung ergänzen: «Danach können Sie wieder eine Mahnung senden.» (nur nach Ablauf der Frist). Szenario «Vor dem Zurücksetzen der Zahlung die Folge bestätigen» prüft dann den Status, der gilt.

## V-5 (Minor, entscheiden): Zurücksetzen bei Saldo 0.00

**Beleg.** Glossar `:156`: «Saldo 0.00: keine Zahlung, kein Zahlteil.» `statement.service.ts:472-473`: Saldo 0 ist beim Versand sofort bezahlt (Zahlungsdatum = Abrechnungsdatum). #92 entschieden: «a paid statement offers «Zahlung zurücksetzen»», ohne Ausnahme.

**Warum fraglich.** Bei Saldo 0 gab es keine Zahlung, die falsch erfasst sein könnte. Nach dem Zurücksetzen steht eine Abrechnung über CHF 0.00 auf «Versendet», nach der Frist auf «Überfällig», zählt in der Übersicht als offen, und der Verlauf sagt «Zahlung vom … zurückgesetzt», obwohl nie gezahlt wurde. Der Text «gilt dann wieder als nicht bezahlt» widerspricht dem Glossar («keine Zahlung»).

**Behebung (zum Entscheiden).** «Zahlung zurücksetzen» nur anbieten, wenn der Saldo nicht 0.00 ist (Backend lehnt sonst mit Code ab). Weicht von der Formulierung in #92 ab, darum Product Owner; Issue `fachlich`, `entscheiden`.

## V-6 (Minor): Szenarien prüfen das Datum nicht mehr

**Beleg.**
- «Zahlungseingang mit Datum festhalten» (`statement-detail.feature:74-83`): Kommentar «Festgehalten wird der eingegebene Tag des Eingangs»; markiert wird «am Tag des Versands» = `inDays(0)` (`statement-detail.steps.ts:258-260`) = heute = Tag des Erfassens. Vorher prüfte das Szenario mit 2026-01-05 gerade, dass nicht der Tag des Erfassens gespeichert wird (alter Kommentar: «festgehalten wird der Tag des Eingangs, nicht der Tag des Erfassens»).
- «Zahlung zurücksetzen» (`:106-114`): Zahlungsdatum `inDays(0)` (`fixtures/backend.ts:239-242`) und Tag des Zurücksetzens sind beide heute; der Schritt prüft «Zahlung vom {heute} zurückgesetzt {heute}» (`statement-detail.steps.ts:281-283`). Vertauschte Daten (Label mit Tag des Zurücksetzens, Wert mit Zahlungsdatum) bestehen den Test.

**Warum ein Problem.** Die Regel «gespeichert wird der eingegebene Tag, nicht der Tag des Erfassens» ist für die Praxis zentral (Fristen, Mahnung) und wird nach der Änderung von keinem Szenario mehr gezeigt. Mit der Untergrenze (#138) und einem Versand am Testtag ist im E2E kein anderes Datum möglich; die Route nimmt `statementDate` nicht an (`backend/src/routes/statements.ts:182`, nur `paymentDeadline`).

**Behebung.** Auf tieferer Ebene sichern: pg-Test im Service (Abrechnungsdatum direkt auf 2026-01-02 gesetzt, bezahlt am 2026-01-05, gespeichert 2026-01-05; zurückgesetzt, gespeicherte Zeile mit Zahlungsdatum 2026-01-05 und Tag des Zurücksetzens = heute) und DOM-Test der Verlaufskarte mit zwei verschiedenen Daten. Im Szenario den Kommentar auf das ehrlich Gezeigte kürzen (z. B. «Das Zahlungsdatum darf das Abrechnungsdatum sein»), oder einen Seed «versendet am {Datum}» einführen, falls das E2E-Setup ihn zulässt.

## V-7 (Minor): Neu als bezahlt markieren nach dem Zurücksetzen

**Beleg.** #92, Problem: «A payment recorded on the wrong statement or with a wrong date stays.» Kommentar im Szenario `:103-104`: «eine Zahlung … mit falschem Datum lässt sich zurücksetzen». Keines der @wip-Szenarien markiert nach dem Zurücksetzen erneut.

**Warum ein Problem.** Der Hauptfall in der Praxis ist die Korrektur: zurücksetzen, dann mit dem richtigen Datum als bezahlt markieren. Ob «Als bezahlt markieren» danach wieder erscheint und der Verlauf beides zeigt («Bezahlt» mit dem neuen Datum, «Zahlung vom … zurückgesetzt»), prüft niemand.

**Behebung.** Szenario «Zahlung mit falschem Datum korrigieren»: bezahlt, zurückgesetzt, erneut als bezahlt markiert; Status «Bezahlt», Verlauf nennt beide Zeilen. (Mit dem Datum gilt V-6: Unterschied auf tieferer Ebene prüfen.)

## V-8 (Minor): PRD widerspricht #92

**Beleg.** `docs/PRD-Dwello.md:621` «**Bezahlt** (`paid`) - Settled; final, cannot be reverted»; `:1201` «No undo: Bezahlt (paid) is final»; `:1211` «Mark as paid (final, no undo)».

**Warum falsch.** Nach #92 ist «Bezahlt» nicht mehr endgültig. Wer das PRD liest, baut oder prüft gegen die alte Regel. #92, Done means verlangt, Doku und Hilfe anzupassen, wenn die Entscheidung Wortlaut betrifft.

**Behebung.** Die drei Stellen auf «Bezahlt; mit «Zahlung zurücksetzen» zurück auf Versendet bzw. Überfällig, der Verlauf hält das fest» ändern; Plan-Eintrag ergänzen.

## V-9 (Minor): fehlende Begriffe

**Beleg.** `UBIQUITOUS_LANGUAGE.md` enthält weder «Abrechnungsdatum» noch «Zahlung zurücksetzen» (grep). «Abrechnungsdatum» steht schon in der Oberfläche (`messages/de.json` `statements_statement_date`) und ist jetzt die Untergrenze einer Regel. «Zahlungsdatum» ist nur unter «Rechnungswesen» (`:67`) definiert; für Abrechnungen nutzt es das Glossar bei «Ersetzt» (`:173`), das deckt die Verwendung.

**Vorschläge (Issue, Labels `fachlich`, `entscheiden`):**
- **Abrechnungsdatum**: «Datum der Nebenkostenabrechnung. Dwello setzt es auf den Tag, an dem die Abrechnung als versendet markiert wird; ab ihm läuft die Zahlungsfrist. Ein Zahlungsdatum davor nimmt Dwello nicht an.» (`statement_date`)
- **Zahlung zurücksetzen**: «Nimmt eine falsch erfasste Zahlung einer Abrechnung zurück: Zahlungsdatum und bezahlter Betrag werden gelöscht, der Status wird wieder Versendet bzw. Überfällig. Der Verlauf hält das Zurücksetzen mit dem Datum der zurückgesetzten Zahlung fest.» (Tabelle der Zurücksetzungen, geplant #92)
- Ergänzung **Bezahlt** (`:171`): «… Lässt sich mit «Zahlung zurücksetzen» zurücknehmen.»

## V-10 (Nit): Texte, die «endgültig» voraussetzen

**Beleg.** Dialog «Als bezahlt markieren», `src/routes/statements/[id]/+page.svelte:208`, `statements_no_reminder_after` «Danach können Sie keine Mahnung mehr senden.»; Hilfe `help_payments_2` nennt nur «Als bezahlt markieren».

**Behebung.** «Solange sie als bezahlt gilt, können Sie keine Mahnung senden.» und in der Hilfe ein Satz: «Haben Sie eine Zahlung falsch erfasst, wählen Sie in der Abrechnung «Zahlung zurücksetzen».»

## V-11 (Nit): Verlauf bei mehrfachem Zurücksetzen

**Beleg.** `src/routes/statements/[id]/MetadataCard.svelte:19-29, 35`: feste Reihenfolge Erstellt, PDF, Versendet, Bezahlt; `{#each dates as row (row.label)}`.

**Warum.** Nach Zurücksetzen und neuer Zahlung steht «Bezahlt» vor der Zeile des Zurücksetzens, obwohl es später geschah. Wird dieselbe Zahlung (gleiches Datum) zweimal zurückgesetzt, ist das Label doppelt und der `each`-Schlüssel nicht eindeutig. Für den Verwalter zählt die zeitliche Reihenfolge.

**Behebung.** Zeilen des Zurücksetzens nach Datum einordnen und mit eigener ID als Schlüssel.

## V-12 (Nit): «Zahlungseingang»

**Beleg.** Szenariotitel «Zahlungseingang mit Datum festhalten», «Kein Zahlungseingang vor dem Abrechnungsdatum»; nicht im Glossar. Bei einer Rückerstattung zahlt der Vermieter aus.

**Behebung.** Neue Titel mit Glossarbegriff, z. B. «Kein Zahlungsdatum vor dem Abrechnungsdatum».

## V-13 (Nit): Testdaten mit Zahlungsfrist vor dem Abrechnungsdatum

**Beleg.** `tests/e2e/steps/documents.steps.ts:75-77` setzt die Zahlungsfrist auf `inDays(-2)`; Versand und Zahlung sind heute. Die Zahlungsfrist liegt damit vor dem Abrechnungsdatum, was es in Wirklichkeit nicht gibt (`docs/nebenkostenabrechnung-anforderungen.md:151`: «Versanddatum plus die Anzahl Tage …»). Für den Test des Status reicht es; bestehender Schritt.

---

## Bestätigt

- **Untergrenze und Obergrenze des Zahlungsdatums (#138).** Ein Zahlungsdatum vor dem Abrechnungsdatum ist fachlich nicht möglich (der Mieter kennt den Betrag erst mit der Abrechnung); eine Verrechnung einer Rückerstattung mit dem Mietzins (Art. 120 Abs. 1 OR: «Wenn zwei Personen einander Geldsummen … schulden, so kann jede ihre Schuld, insofern beide Forderungen fällig sind, mit ihrer Forderung verrechnen.»; in `docs/nebenkostenabrechnung-anforderungen.md:45` genannt) fällt ebenfalls nach der Abrechnung. Keine Zahlung in der Zukunft: richtig. Für den Ausnahmefall siehe V-3.
- **«Tag, an dem das Geld eingegangen ist»** für eine Nachzahlung passt zum Erfüllungsort bei Geldschulden, Art. 74 Abs. 2 Ziff. 1 OR: «Geldschulden sind an dem Orte zu zahlen, wo der Gläubiger zur Zeit der Erfüllung seinen Wohnsitz hat». Für eine Rückerstattung ist der Vermieter Schuldner; «der Tag, an dem Sie den Betrag überwiesen haben» weicht davon um die Laufzeit der Überweisung ab, ist als Buchungsdatum aber praxisüblich und für Dwello ausreichend.
- **Überfällig nach dem Zurücksetzen (#92)** folgt aus der Glossardefinition (`:172`) und der Berechnung (`statement.service.ts:265-271`); kein eigener gespeicherter Status. Rechtlich ist «Überfällig» nur eine Anzeige; ob der Mieter mit Ablauf der Zahlungsfrist in Verzug ist (Art. 102 Abs. 2 OR: «Wurde für die Erfüllung ein bestimmter Verfalltag verabredet …, so kommt der Schuldner schon mit Ablauf dieses Tages in Verzug.») oder erst mit einer Mahnung (Abs. 1), behauptet weder ein Szenario noch ein geplanter Text.
- **Verlauf hält das Zurücksetzen fest:** für den Nachweis gegenüber dem Mieter richtig, dass Datum der zurückgesetzten Zahlung und Tag des Zurücksetzens gespeichert bleiben. Wortlaut «Zahlung vom {paidDate} zurückgesetzt» mit dem Tag als Wert: verständlich, auch bei einer Rückerstattung.
- **Toast** «Die Zahlung der Abrechnung {number} ist zurückgesetzt.», **Button und Titel** «Zahlung zurücksetzen», **Refusal** STATEMENT_NOT_PAID «Die Abrechnung ist nicht als bezahlt erfasst. Laden Sie die Seite neu.»: Glossarbegriffe (Abrechnung, bezahlt), sagen, was geschah und was zu tun ist.
- **Ungültiges Datum** (2025-02-30) mit dem bestehenden «Bitte geben Sie das Zahlungsdatum als TT.MM.JJJJ ein.»: passend.
- **Bestehende Abrechnungen** mit einem Zahlungsdatum vor dem Abrechnungsdatum unverändert lassen: richtig (keine stillschweigende Änderung erfasster Zahlungen).
- **#93, Formel `paid_amount` = Saldo, `paidThisMonth` nur Nachzahlungen.** Nachgerechnet mit Oktober 2026 (Monatsbeginn 2026-10-01):
  1. Nachzahlung 230.00 bezahlt am 05.10. → `paid_amount` 230.00; Rückerstattung −120.35 überwiesen am 07.10. → −120.35; Saldo 0.00 (z. B. +0.02 vor Rundung) beim Versand am 10.10. → 0.00, bezahlt am 10.10.; Nachzahlung 80.00 bezahlt am 30.09. → `paidThisMonth` = 230.00 (Rückerstattung und Saldo 0 nicht gezählt, September nicht).
  2. Mieterwechsel in der Periode: zwei Abrechnungen derselben Wohnung, Nachzahlungen 41.60 (bezahlt 02.10.) und 112.25 (bezahlt 12.10.) → 153.85; je Abrechnung ihr eigener Saldo.
  3. Zurücksetzen der Zahlung von 230.00 aus Beispiel 1 → `paid_amount` und Zahlungsdatum gelöscht, Status nicht mehr `paid` → `paidThisMonth` = 0.00. Das Zurücksetzen (#92) und #93 passen also zusammen, solange das Zurücksetzen `paid_amount` löscht (entschieden).
  Der Saldo als bezahlter Betrag entspricht dem Betrag auf dem Zahlteil (Saldo auf 5 Rappen gerundet, `docs/nebenkostenabrechnung-anforderungen.md:94`); Teilzahlungen sind nicht entschieden (#93, «Stop and ask»).
- **«No scenario» für #93:** hält. `paidThisMonth` wird im BFF nur typisiert (`src/routes/dashboard/+page.server.ts:21`), auf keinem Bildschirm gezeigt; `paidAmount` erscheint in `src/` nirgends; die PDFs lesen nur `paidDate` (`statement-pdf.service.ts:136`), nicht `paid_amount`.
- **Szenario «Kein Zahlungseingang vor dem Abrechnungsdatum»:** 2026-01-05 liegt vor jedem Versandtag ab heute (2026-10-16); prüft Feldfehler und unveränderten Status «Versendet»: entspricht #138.
- **Szenario «Vor dem Zurücksetzen der Zahlung die Folge bestätigen»:** prüft, dass vor der Bestätigung nichts geändert ist (Status bleibt «Bezahlt»): entspricht der Design-Regel.

## Nicht bestätigt

- **Art. 88 OR als Grundlage für V-1:** ob die PDF-Zeile «Bezahlt am … Vielen Dank.» rechtlich eine Quittung ist, habe ich nicht belegt (nur Wortlaut von Art. 88 Abs. 1 OR aus Fedlex, SR 220, Fassung 2026-10-01). Der Befund V-1 hält praktisch auch ohne diese Einordnung. **unsicher**.
- **Verzug ab Zahlungsfrist** (Art. 102 Abs. 2 OR): ob die einseitig gesetzte Zahlungsfrist ein «verabredeter Verfalltag» ist, nicht geprüft; für die Änderung ohne Belang, da kein Text Verzug behauptet.
- **fr/it/en der neuen Texte:** nicht Gegenstand (folgen); gegen `docs/design/i18n-begriffe.md` nicht geprüft.
- **Refusal STATEMENT_NOT_PAID** (veralteter Tab): ob dafür ein Szenario oder «No scenario» nötig ist (`tests/e2e/CLAUDE.md`, Fehlerzustände), ist eine Prozessfrage; nicht geprüft.
- **Mahnungen nach dem Zurücksetzen:** ob bestehende Mahnungen und die nächste Mahnstufe nach einem Zurücksetzen richtig weiterlaufen (`ReminderModal`, `sentReminders`), nicht im Code geprüft; fachlich sollte die Mahnstufe weiterzählen.
- **Quellen gelesen:** `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md` (keine Regel zum Zahlungsdatum oder Zurücksetzen), `docs/PRD-Dwello.md`, Issues #138, #93, #92 (via `gh api`), Fedlex OR (SR 220) Art. 74, 88, 102, 120, 257b über die Fedlex-Filestore-HTML-Fassung vom 2026-10-01 (die Fedlex-Seite selbst lädt ohne JavaScript nicht). Kein Artikel des OR oder der VMWG regelt Zahlungsdatum, bezahlten Betrag oder das Zurücknehmen einer erfassten Zahlung ausdrücklich.
