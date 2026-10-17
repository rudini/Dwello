# Fachreview w4c, Runde 2 (Umsetzung `git diff a7f18d2 f471e42`, #64, #87, #55)

Gelesen im Worktree `review-w4c-fach2` (detached, f471e42). Grundlage: Runde 1 (`docs/reviews/w4c-fachreview-1.md`), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/nebenkostenabrechnung-anforderungen.md`, Fedlex SR 220.

**Ergebnis: kein Blocker, kein Major.** Der Major aus Runde 1 (V-1) ist richtig umgesetzt.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-10 | Verwalter (i18n) | Minor | FR-Hilfetext Mahnfrist sagt «aperçu» für die Übersicht; das Glossar verlangt «vue d’ensemble», und «aperçu» heisst in der App schon die Vorschau im Abrechnungslauf |
| V-11 | Verwalter (i18n) | Nit | IT-Hilfetext Zahlungsfrist: «Entro allora» weicht von der festen Formel «Entro questa data» ab (it.json:1091-1092); «da adesso», «Predefinito: 30 giorni» holprig |
| V-12 | Verwalter (i18n) | Nit | FR: «le locataire paie le montant à payer» sagt zweimal dasselbe |
| V-13 | Verwalter | Nit | Das Fenster der Fristen hängt jetzt an der Einstellung: wird die Einstellung gesenkt oder die Frist einer einzelnen Abrechnung verlängert, fehlt eine offene Zahlungsfrist eine Zeit lang in den Fristen |
| V-5 | Verwalter | Minor (bleibt) | Zahl in der Aufgabe und Liste `?status=overdue` weichen weiter voneinander ab; die Begründung für die Ablehnung trägt nur zur Hälfte |

Erledigt und bestätigt: V-1, V-2, V-4, V-6, V-8. Ablehnung angenommen: V-3, V-7, V-9. Weggelassenes Szenario: Begründung trägt (siehe unten).

---

## Wie die Befunde aus Runde 1 erledigt wurden

### V-1 (Major), erledigt
**Beleg.** `src/lib/overview.ts:117-123`:
```ts
const waiting = (s) =>
	s.nextReminderFrom
		? s.nextReminderFrom > today
		: !s.refund && daysFrom(today, s.paymentDeadline) >= -reminderAfterDays;
```
`src/routes/dashboard/+page.server.ts:155`: `refund: Number(s.balance) < 0`. Das Vorzeichen passt zum Glossar («Saldo … Positiv = Nachzahlung, negativ = Rückerstattung»); `balance` steht in der Liste (`tests/contracts/statements.json:17`, `"-40.00"`).

**Nachgerechnet** (`daysFrom(today, D) = D − heute` in Tagen, `overview.ts:209-210`; Aufgabe genau dann, wenn heute > D + M bei einer Nachzahlung ohne Mahnung):
- M = 14, heute 10.10.2026: D = 26.09. (seit 14 Tagen) → −14 ≥ −14, wartet, keine Aufgabe; D = 25.09. (seit 15 Tagen) → −15, Aufgabe. Gleich wie im Test `overview.test.ts:148-149` und im Szenario «Überfällige Abrechnung als nächste Aufgabe» (15 Tage).
- M = 7 (Untergrenze), D = 26.09.: −14 < −7, Aufgabe (`overview.test.ts:150`).
- Rückerstattung, D = 09.10. (seit 1 Tag): `!refund` ist falsch, wartet nicht, Aufgabe ab dem Tag nach der Zahlungsfrist (`overview.test.ts:154-164`).
- Tag der Zahlungsfrist selbst (D = heute): `paymentDeadline < today` ist falsch, nicht abgezogen; das Backend zählt sie auch nicht als überfällig (`statement.service.ts:186-191`, `paymentDeadline < today`). Kein Doppelabzug.
- Saldo 0: hat keinen Zahlteil, nicht als Rückerstattung markiert (`0 < 0` falsch); unverändert gegenüber vorher.
- Mit Mahnung: `nextReminderFrom > today` wartet, am Tag `nextReminderFrom` selbst Aufgabe; das ist «ab dem Tag nach der Zahlungsfrist der letzten Mahnung» (`src/lib/types.ts:306`), wie in #107. Nach der 3. Mahnung ist `nextReminderFrom` null; dann gilt wieder D + M, und die Abrechnung ist längst darüber: Aufgabe wie vor dem Change (vorher `'' > today` falsch). Kein neues Verhalten.
- Fehlende Einstellung: `Number(stored.reminder_after_days ?? 14)`; das Backend liefert ohnehin seine Vorgaben 30/14 (`config.service.ts:73-82`, `getConfig`). Kein Fall mit 0.

### V-2, V-4, V-8 (Hilfetexte), erledigt
`messages/de.json:1192` und `:1194` übernehmen die Vorschläge aus Runde 1, mit «Vorgabe: 30 Tage» bzw. «Vorgabe: 14 Tage» statt «Üblich sind 30 Tage». Das ist fachlich die bessere Wahl: «Vorgabe» ist das, was die App setzt und was ein geleertes Feld wieder annimmt (V-9); ob 30 Tage «üblich» sind, ist in den Anforderungen nur unsicher-B belegt.
- Zahlungsfrist: glossarkonform (Zahlungsfrist = Datum, Einstellung = Tage bis dahin), nennt Nachzahlung und Rückerstattung, Buttonname stimmt (`messages/de.json:1027`, `statements_edit_button`). Der Satz «Gilt für Abrechnungen, die Sie ab jetzt versenden» stimmt mit dem Code (Frist beim Versand gesetzt, Runde 1).
- Mahnfrist: «mahnen können Sie ab dann» stützt sich auf Art. 102 Abs. 1 OR (Fedlex SR 220, erneut im Suchtreffer bestätigt): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Der Satz zur nächsten Mahnung stimmt mit `nextReminderFrom` überein (siehe oben).
- Kleine Lücke ohne eigenen Befund: Der Mahnfrist-Text sagt nicht, dass eine überfällige Rückerstattung sofort in den Aufgaben steht (Vorschlag aus Runde 1, «bei Annahme von V-1»). Der Text spricht nur von der Mahnung, und eine Rückerstattung wird nie gemahnt; er ist also nicht falsch. Wer will, ergänzt: «Eine Rückerstattung zeigt die Übersicht schon ab dem Tag nach der Zahlungsfrist.»

### V-6, erledigt
`docs/nebenkostenabrechnung-anforderungen.md:45` und `:151`: «einstellbar 7–90 unter «Zahlungsfrist (Tage)»»; Punkt 11 nennt die Mahnfrist (Vorgabe 14, 7–60), die nächste Mahnstufe nach #107 und die Rückerstattung ohne Mahnfrist. Stimmt mit `config.service.ts:73-82` und `overview.ts:117-120` überein.

### V-3, Ablehnung angenommen
Die Untergrenze 7 Tage ist Produktentscheid (#87). Gesetzlich nicht belegt, dass weniger als 30 Tage unzulässig wären (Runde 1, «Nicht bestätigt»). Mit «Vorgabe: 30 Tage» sieht der Vermieter den Richtwert.

### V-5, bleibt Minor
**Beleg.** `messages/de.json:233`: «{count} Nebenkostenabrechnung ist über der Zahlungsfrist. …»; Ziel `/statements?status=overdue` (`overview.ts:127`).
**Bewertung der Ablehnung.** Richtig ist: jede gezählte Abrechnung ist über der Zahlungsfrist, der Satz ist wahr. Er ist aber nicht vollständig: Beispiel heute 10.10., Nachzahlung A mit D = 01.09. (Aufgabe), Nachzahlung B mit D = 05.10. (Mahnfrist läuft). Aufgabe: «1 Nebenkostenabrechnung ist über der Zahlungsfrist»; die Liste «Überfällige ansehen» zeigt 2, beide «Überfällig». Der Vermieter weiss nicht, welche gemeint ist. Kein Rechtsproblem und kein falsches Geld, deshalb Minor; nach den Regeln des Projekts bleibt es im Bericht. Wird es später angegangen, Vorschlag wie in Runde 1 («… seit mehr als {Mahnfrist} Tagen über der Zahlungsfrist»).

### V-7, Ablehnung angenommen
Das Backend ist im Diff unverändert (`git diff a7f18d2 f471e42 --stat -- backend/src/services` leer); «Überfällig» folgt weiter aus `paymentDeadline < today` (`statement.service.ts:186-191`) und hängt nicht an der Mahnfrist. `statement-detail.feature:144` prüft den Status nach abgelaufener Frist.

### V-9, Ablehnung angenommen
`src/lib/server/settings.ts:308-309`: `/^\d+$/` und Bereich, sonst die Bereichsmeldung; «14.5» und «14,5» erhalten «Geben Sie für die Zahlungsfrist 7 bis 90 Tage ein.» Das ist verständlich, weil «Tage» schon ganze Zahlen nahelegt. Leer setzt auf die Vorgabe zurück, und der Hilfetext nennt die Vorgabe: stimmig.

### Weggelassenes Szenario «Keine Mahnung vorgeschlagen, solange die Mahnfrist läuft»
Die Begründung trägt: Die Aufgabe zählt `statementCounts.overdue` aus `/api/v1/dashboard`, also die Abrechnungen aller parallel laufenden Szenarien in derselben Datenbank. Eine «nicht genannt»-Prüfung wäre unzuverlässig. Die Grenze 14/15 und die Untergrenze stehen in `overview.test.ts:138-151` (siehe Rechnung oben). Dasselbe gilt für ein E2E-Szenario zur Rückerstattung: eine positive Prüfung würde auch durch fremde überfällige Abrechnungen bestehen; der Unit-Test ist die richtige Ebene. Der Kommentar in `dashboard.feature:93-95` erklärt das.

### #55 (Belegung)
Spalte `occupancy-rate` und `occupancyRate` entfernt (`BuildingFigures.svelte`, `+page.server.ts`), Marker `TODO(fachlich prüfen, #55)` weg, Szenario «Belegung pro Gebäude» ohne `@wip`. Wie entschieden; kein neuer Begriff.

### Marker #64
`overview.ts:143` und `:206`: die zwei Fenster und die Aufgabe nach der Abrechnungsperiode sind jetzt als UX-Entscheid (#64) kommentiert, ohne Rechtsgrundlage; das stimmt (Runde 1 «Nicht bestätigt»: keine gesetzliche Zustellfrist, `nebenkostenabrechnung-anforderungen.md:44`, unsicher-C).

---

## V-10 (Minor): FR «aperçu» statt «vue d’ensemble»

**Beleg.** `messages/fr.json:1194` (`settings_reminder_days_help`): «… jusqu’à ce que l’aperçu propose un rappel. … L’aperçu propose le rappel suivant …». `docs/design/i18n-begriffe.md:81`: «Übersicht | vue d’ensemble | panoramica | overview». Navigation: `messages/fr.json:5` «Vue d’ensemble». «aperçu» bedeutet in der App die Vorschau des Abrechnungslaufs (`help_statements_1`, `help_statements_2`, `statements_preview_busy`, `statements_resume`).

**Warum falsch.** Ein französischsprachiger Vermieter sucht die Mahnung in der Vorschau des Abrechnungslaufs statt auf der Seite «Vue d’ensemble». IT («panoramica») und EN («overview») sind richtig.

**Behebung.** Zweimal «l’aperçu» durch «la vue d’ensemble» ersetzen: «… jusqu’à ce que la vue d’ensemble propose un rappel. … La vue d’ensemble propose le rappel suivant après le délai de paiement du dernier rappel.»

## V-11 (Nit): IT-Wortlaut

**Beleg.** `messages/it.json:1192`: «Entro allora l’inquilino paga l’importo dovuto, oppure Lei versa il rimborso. Predefinito: 30 giorni. Vale per i conteggi che invia da adesso; …». Dieselbe Aussage steht schon als «Entro questa data l’inquilino paga l’importo dovuto.» (`it.json:1092`) und «Entro questa data rimborsa l’importo all’inquilino.» (`:1091`).

**Behebung.** «Entro questa data l’inquilino paga l’importo dovuto, oppure Lei versa il rimborso. Valore predefinito: 30 giorni. Vale per i conteggi che invia d’ora in poi; …» und in `settings_reminder_days_help` entsprechend «Valore predefinito: 14 giorni.» Begriffe (termine di pagamento, termine di sollecito, sollecito, scaduto, rimborso, importo dovuto) stimmen mit `i18n-begriffe.md:63-69` überein.

## V-12 (Nit): FR «paie le montant à payer»

**Beleg.** `messages/fr.json:1192`: «D’ici là, le locataire paie le montant à payer, ou vous versez le remboursement.» Glossar: Nachzahlung = «montant à payer» (`i18n-begriffe.md:63`), also richtig gewählt, aber mit «paie» doppelt.

**Behebung.** «D’ici là, le locataire règle le montant à payer, ou vous versez le remboursement.» Übrige Begriffe (délai de paiement, délai de rappel, rappel, en retard, remboursement, « Modifier le délai et les remarques » wie `statements_edit_button`, Guillemets mit geschütztem Leerzeichen) stimmen. EN: payment deadline, reminder period, reminder, overdue, amount due, refund, «Edit deadline and notes» stimmen.

## V-13 (Nit): Fristen-Fenster an der Einstellung

**Beleg.** `src/lib/overview.ts:246`: `payments.filter((d) => d.days <= paymentDeadlineDays)` (vorher fest 30). Test `overview.test.ts:243-255`.

**Warum.** Die Absicht «eine eben versendete Abrechnung steht gleich in den Fristen» stimmt nur, solange die Frist der Abrechnung nicht länger ist als die heutige Einstellung. Beispiele: (a) Einstellung 30, eine Abrechnung mit «Frist und Bemerkungen bearbeiten» auf 60 Tage verlängert: 30 Tage lang nicht in den Fristen. (b) Einstellung von 30 auf 10 gesenkt: die schon mit 30 Tagen versendeten Abrechnungen fehlen bis 10 Tage vor ihrer Frist. Abgelaufene Fristen erscheinen immer (`days` negativ), es geht also nichts verloren; vorher bestand (a) mit fest 30 ebenso. Deshalb Nit.

**Behebung (falls gewünscht).** Alle offenen Zahlungsfristen versendeter Abrechnungen zeigen (sie sind höchstens 90 Tage entfernt), oder das Fenster als `max(paymentDeadlineDays, 30)` führen. Keine Textänderung nötig, der Hilfetext verspricht nichts mehr zum Fenster (V-8).

---

## Fehlende Begriffe

Keine. Alle verwendeten Wörter (Zahlungsfrist, Mahnfrist, Mahnung, Überfällig, Nachzahlung, Rückerstattung, Übersicht, Vorgabe als gewöhnliches Wort) stehen im Glossar oder sind Alltagssprache. «Zahlungsfrist der Mahnung» bleibt bei #277 (kein neues Issue).

## Nicht bestätigt

- **Art. 102 Abs. 2 OR** (Verfalltag durch einseitiges «zahlbar bis»): wie in Runde 1 nur Abs. 1 im Fedlex-Wortlaut gefunden (`mmx search "Art. 102 OR Verzug Mahnung Fälligkeit fedlex"`, Treffer fedlex.admin.ch/eli/cc/27/317_321_377/de). Für den Hilfetext nicht nötig: «mahnen können Sie ab dann» trägt schon Abs. 1. **unsicher** bleibt nur, ob der Mieter ohne Mahnung schon ab dem Tag nach der Zahlungsfrist in Verzug ist; der Text behauptet das nicht.
- **Übliche Mahnfrist** (Vorgabe 14, Bereich 7–60) und **Mindestfrist 30 Tage**: Produktentscheid bzw. unsicher-B in den Anforderungen; nicht erneut gesucht.
- Ob `/statements?status=overdue` mehr als 100 überfällige Abrechnungen liefert (`limit=100` in `+page.server.ts:125`): bei unter 50 Wohnungen nicht relevant, nicht geprüft.
- Wie viele Tage der Schritt «die Zahlungsfrist … ist abgelaufen» in `statement-detail.feature:140` zurückliegt: nicht nachgelesen; für V-7 nicht nötig, weil das Backend unverändert ist.
- E2E und Unit-Tests nicht selbst ausgeführt (nur gelesen und nachgerechnet).
