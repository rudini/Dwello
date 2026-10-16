# Fachreview #209, Runde 1: gespeicherter Anteil nach dem Heizprofil im PDF

Gegenstand: `@wip`-Szenario «PDF zeigt den Heizanteil, mit dem die Abrechnung erstellt wurde» (`tests/e2e/features/statement-detail.feature:220–244`), neuer Schritt (`tests/e2e/steps/statement-detail.steps.ts:42–44`, `tests/e2e/fixtures/backend.ts:257–261`) und der Plan in `implementation_plan.md:5–19`. Worktree `review-209-fach`, Commit 25dcc583.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| F-1 | Verwalter / Mietrecht | Major | Der Name des Heizprofils muss mitgespeichert werden: Nach dem Umbenennen steht ein neuer Name über dem alten Anteil, nach dem Löschen fehlt der Hinweis ganz, und die Heizkosten-Position zeigt «43.00 %» als «Zeitanteil: Ihre Mietstage». |
| F-2 | Verwalter | Major | Auch der Entscheid «nach Mietstagen statt nach dem Heizprofil» (Monate der Periode zusammen 0 %) muss gespeichert werden. Mit `heating_share = null` lassen sich «nach Tagen gerechnet» und «ältere Abrechnung» nicht unterscheiden. |
| F-3 | Verwalter | Minor | Ältere Abrechnungen: Der Anteil liegt schon als `period_share` auf der Heizkosten-Position. Die Monatsliste nur drucken, wenn die Neuberechnung diesen Anteil ergibt, sonst weglassen. Mit dem geplanten Rückgriff auf die reine Neuberechnung bleibt der Fehler bei bestehenden Abrechnungen. |
| F-4 | Verwalter | Minor | Das Szenario prüft nur geänderte Monatsanteile. Es fehlen ein Fall mit umbenanntem oder gelöschtem Profil und ein Fall mit 0 %-Periode (F-1, F-2), ausserdem eine Prüfung, dass Betrag und Anteil zusammenpassen (CHF 430.00). |
| F-5 | Verwalter | Minor | Fehlende Begriffe: «Heizanteil» (Szenariotitel), «Zeitanteil» (PDF, Issue) und «Monatsanteil» (Regel 6, Fehlertexte) stehen nicht in `UBIQUITOUS_LANGUAGE.md`. |
| F-6 | Mietrecht / Verwalter | Minor (schon vorher vorhanden) | Ist die Periode kürzer als ein Jahr, ergeben die gedruckten Monatsanteile zusammen nicht den gedruckten Prozentsatz, und der Mieter kann ihn nicht nachrechnen. Die gespeicherten Werte sollten die Summe der Periode enthalten. |
| F-7 | Verwalter | Minor | Die Detailseite liest den Profilnamen weiterhin aus dem aktuellen Profil (`src/lib/server/statement.ts:56`). Nach F-1 nennen Seite und PDF nach einer Umbenennung verschiedene Namen. |
| F-8 | Verwalter | Nit | Beim Bearbeiten eines eigenen Heizprofils fehlt der Hinweis, dass bestehende Abrechnungen ihre Anteile behalten. Wer das Profil korrigiert, muss die Entwürfe neu erstellen. |

## Nachrechnung (Formel `handleMidYearMoves` / `calculateHeatingShare`)

Ausgangsprofil «Winter» aus der Grundlage (`statement-detail.feature:11–24`): 18, 14, 11, 5, 2, 0, 0, 0, 2, 8, 14, 26 = 100 %. Geändertes Profil: 30, 20, 10, 5, 2, 0, 0, 0, 2, 6, 10, 15 = 100 %. Es ist also gültig (Regel 6, `docs/nebenkostenabrechnung-anforderungen.md:146`, «zusammen 100 %»).

1. **Szenario** (Eva Frei, 01.01.–31.03.2024, Periode 2024): Mieteranteil 18 + 14 + 11 = 43 %, Periode 100 %, also 43 / 100 × 100 = **43.00 %**. Heizkosten CHF 1'000, nur Wohnung 3.01, Wohnungsanteil 100 %, Mieteranteil also **CHF 430.00**. Mit dem geänderten Profil ergäbe sich 30 + 20 + 10 = 60 %, also CHF 600. Die Aussage «43.00 % der Heizkosten» unterscheidet die beiden Fälle. Bestätigt, ebenso der Kommentar in Zeile 221.
2. **Teilmonat** (Einzug am 15.01.2024, Auszug am 31.03.2024): Januar 18 × 17/31 = 9.8710, dazu 14 + 11, ergibt **34.87 %**. Die Monatsliste lautet «Jan 9.87 %, Feb 14.00 %, Mär 11.00 %». Gespeichert werden sollte der ungerundete Wert, gedruckt wird er auf 2 Stellen. Das entspricht `period_share` (4 Stellen, `calculation.service.ts:352`).
3. **Periode kürzer als ein Jahr** (Periode 01.01.–30.06.2024, Mieter Januar bis März): Periode 18 + 14 + 11 + 5 + 2 + 0 = 50 %, Mieter 43 %, ergibt 43 / 50 × 100 = **86.00 %**. Die Monatsliste summiert sich aber auf 43 % (F-6).
4. **Grenzfall 0 %** (Periode 01.06.–31.08.2024 wie im Szenario «Lea Graf», Einzug am 15.07.): Mit dem Ausgangsprofil ist die Summe der Periode 0 %, also wird nach Tagen verteilt (48/92 Tage, `prorating.service.ts:214`). Setzt der Verwalter danach den Juli auf 5 %, rechnet das PDF heute mit dem Profil neu, druckt einen Heizprofil-Hinweis und zeigt die Position als Prozent statt als «48/92 Tage». Der Betrag wurde aber nach Tagen gerechnet (F-2).

## Befunde

### F-1 (Major): Profilname mitspeichern

- **Beleg.** `backend/src/db/schema.ts:345`: `heatingProfileId … references(() => heatingProfiles.id, { onDelete: 'set null' })`. Ein eigenes Heizprofil lässt sich löschen, auch wenn Abrechnungen es nutzen. Gesperrt sind nur vordefinierte Profile und das Standardprofil (`heating-profile.service.ts:257–262`). Umbenennen ist für eigene Profile in der App möglich, für vordefinierte über die API (Regel 6, `docs/nebenkostenabrechnung-anforderungen.md:146`: «nur über die API lässt sich ihr Name ändern»). `statement-pdf.service.ts:135–136` liefert ohne Profil `{}`. Damit ist `run.heating` leer, `lineItemOf(..., byProfile=false)` (`:120`), und `timeShare` (`pdf.service.ts:438–441`) druckt `formatShare(0.43)` = «43.00 %» unter dem Satz «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode» (`pdf.service.ts:87`). Der Heizprofil-Zusatz fehlt (`pdf.service.ts:627`). Der Plan liest den Namen weiterhin aus dem Profil (`implementation_plan.md:9`), also bliebe dieser Fall falsch, obwohl der Anteil gespeichert ist.
- **Warum falsch.** Der Mieter liest einen Prozentsatz, der als Mietstage erklärt wird, aber keine Mietstage sind. Nach einer Umbenennung steht ein Profilname über Anteilen, die dieses Profil nicht mehr hat. In der Praxis wird ein Verteilschlüssel mit dem Stand der Abrechnung festgehalten. Laut Anforderungen muss die Abrechnung «den Verteilschlüssel und den Anteil des Mieters nachvollziehbar ausweisen» (`docs/nebenkostenabrechnung-anforderungen.md:39`, nur Sekundärquelle, Status «unsicher»). Art. 8 Abs. 1 VMWG (Fedlex, Stand 1.10.2025): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.» Die Aufteilung, die das PDF zeigt, muss also die sein, mit der gerechnet wurde. Dass dazu der Name des Profils gehört, ist **unsicher**: Das Gesetz nennt keinen Namen, verlangt wird es nur aus der Praxis (Thema 4, «Quelle der verwendeten Tabelle … im PDF nennen», Zeile 67).
- **Lösung.** `heating_share` speichert die Namen des Profils beim Erstellen (`name`, `nameDE`, `nameFR`, `nameIT`, `nameEN`, damit `localName` in der Sprache des Mieters bleibt), dazu Anteil und Monate. Das PDF liest nur diese Werte, auch wenn `heatingProfileId` inzwischen null ist. Zusätzlich ein Test (pg): Profil umbenannt, dann gelöscht, und das PDF zeigt weiterhin «Heizkosten nach Heizprofil «Winter…»: 43.00 %».

### F-2 (Major): Entscheid «nach Tagen» mitspeichern

- **Beleg.** `prorating.service.ts:209` (Mietvertrag über die ganze Periode, unabhängig vom Profil) und `:214` (`period.percentage <= 0`, abhängig vom Profil). `statement-pdf.service.ts:146` übernimmt den Entscheid heute aus der Neuberechnung. Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:145`): «ebenso wenn die Monate der Periode im Heizprofil zusammen 0 % haben … die Abrechnung zeigt die Mietstage und keinen Heizprofil-Hinweis». Siehe Nachrechnung 4.
- **Warum falsch.** Ändert sich das Profil von 0 % auf mehr als 0 % für die Monate der Periode (oder umgekehrt), passen der Hinweis und die Art des Zeitanteils («48/92 Tage» oder Prozent) nicht mehr zum Betrag. Nach dem Plan («a statement created before keeps today's recomputation») bliebe dieser Fehler bestehen, sobald `null` sowohl «nach Tagen» als auch «vor der Migration» bedeutet.
- **Lösung.** Jede neue Abrechnung mit Heizprofil und Heizkosten-Position speichert einen Wert, z. B. `{ byDays: true }` oder `{ byDays: false, percent, months, periodPercent, profile: {…} }`. `null` bedeutet nur noch «vor der Migration erstellt». Dazu ein pg-Test: 0 %-Periode erstellt, Profil danach mit Juli 5 %, das PDF zeigt weiterhin «48/92 Tage» und keinen Heizprofil-Hinweis.

### F-3 (Minor): Was das PDF einer älteren Abrechnung zeigt

- **Beleg.** Der Anteil ist schon pro Position gespeichert: `calculation.service.ts:331` (`periodShare = heatingResult.percentage / 100`), `:352` (4 Stellen), `statement.service.ts:349`. Die Monate sind nicht gespeichert.
- **Warum.** Mit dem geplanten Rückgriff auf die reine Neuberechnung bleibt #209 für alle bestehenden Abrechnungen bestehen, deren Profil sich geändert hat.
- **Lösung.** Ohne `heating_share` den Prozentsatz aus `period_share` der Heizkosten-Position nehmen (× 100, 2 Stellen, das entspricht dem Druck). Neu berechnen und die Monatsliste nur drucken, wenn die Neuberechnung auf 4 Stellen denselben `period_share` ergibt. Sonst die Monatsliste weglassen (im Beispiel: gespeichert 0.4300, neu berechnet 0.6000, also keine Monate). Den Namen aus dem Profil nehmen, solange es existiert. Fehlt das Profil, fällt die Abrechnung unter F-1 (Altbestand, bleibt wie heute). Diesen Rest als offene Arbeit nennen.

### F-4 (Minor): Abdeckung des Szenarios

- **Beleg.** `statement-detail.feature:242–244` prüft nur «43.00 % der Heizkosten» und die Monatsliste.
- **Lösung.** `Und steht im PDF "430.00"` ergänzen (Format von `formatCHF` vorher prüfen), damit Betrag und Anteil zusammen geprüft werden. F-1 und F-2 auf der unteren Ebene (pg-Test) zeigen. Ein Szenario mit Löschen oder Umbenennen ist optional, aber der Fall, den Mieter am ehesten sehen.

### F-5 (Minor): Fehlende Begriffe

- **Beleg.** `UBIQUITOUS_LANGUAGE.md` führt «Heizprofil» (115), «Wohnungsanteil» (107) und «Mietstage» (137), aber weder «Heizanteil» noch «Zeitanteil» noch «Monatsanteil». Verwendet werden sie im Szenariotitel (`statement-detail.feature:223`), im PDF (`pdf.service.ts:87` «Zeitanteil»), in Regel 6 und in `messages/de.json:431` («Monatsanteile»).
- **Vorschlag** (für ein Issue mit den Labels `fachlich`, `entscheiden`):
  - **Monatsanteil**: Prozentsatz eines Monats im Heizprofil. Die zwölf Monatsanteile ergeben zusammen 100 %. Schema: `january_pct` … `december_pct`.
  - **Zeitanteil**: Teil des Wohnungsanteils, den der Mieter trägt: seine Mietstage von den Tagen, die die Rechnungen der Abrechnungsposition in der Periode abrechnen, oder bei Heizkosten und Mieterwechsel sein Anteil nach dem Heizprofil. Schema: `period_share`.
  - **Anteil nach Heizprofil**: Summe der Monatsanteile der Mietzeit, geteilt durch die Summe der Monatsanteile der Abrechnungsperiode. Bis zur Entscheidung den Szenariotitel ohne neuen Begriff fassen: «PDF zeigt den Anteil nach dem Heizprofil, mit dem die Abrechnung erstellt wurde».

### F-6 (Minor, schon vorher vorhanden): Monatsliste bei Periode unter einem Jahr

- **Beleg.** `pdf.service.ts:67` («Anteile der Monate Ihres Mietverhältnisses: {months}») und `:645–647`. Die Monate kommen aus `calculateHeatingShare` des Mieters (ungeteilt), der Prozentsatz aus `prorating.service.ts:215` (geteilt durch die Periode). Siehe Nachrechnung 3: 43 % gegenüber 86 %.
- **Warum.** Der Mieter kann den Prozentsatz nicht nachrechnen (`docs/nebenkostenabrechnung-anforderungen.md:39`, «nachvollziehbar», Status «unsicher»). Der Fehler zeigt sich schon auf dem Basis-Commit und gehört nicht zu #209.
- **Lösung.** Im neuen jsonb die Summe der Periode (`periodPercent`) mitspeichern, damit ein späterer Text sie drucken kann. Der Text selbst wird offene Arbeit (Issue `fachlich`).

### F-7 (Minor): Name auf der Detailseite

- **Beleg.** `src/lib/server/statement.ts:56` (`heatingProfileName: data.heatingProfile ? localName(data.heatingProfile) : ''`) und der Schritt «nennt die Abrechnung das Heizprofil» (`statement-detail.steps.ts:220`).
- **Lösung.** Mit F-1 den gespeicherten Namen auch an die Detailseite geben, oder die Abweichung bewusst als offene Arbeit festhalten.

### F-8 (Nit): Hinweis beim Bearbeiten eines eigenen Heizprofils

- **Beleg.** Die Monatsanteile eines eigenen Profils lassen sich ändern (`heating-profile.service.ts:212–214` sperrt nur vordefinierte). Bestehende Abrechnungen und Entwürfe behalten ihre Beträge, aber kein Text sagt das.
- **Lösung.** Hilfetext am Formular, z. B.: «Bestehende Abrechnungen behalten die Anteile, mit denen sie erstellt wurden. Für einen Entwurf mit den neuen Anteilen löschen Sie ihn und erstellen ihn neu.» Eine Alternative nach dem Vorbild von `docs/anforderungen-vertragsende.md:85` (das Backend lehnt Änderungen ab, die abgerechnete Tage ändern) wäre eine Sperre für Profile mit Abrechnungen. Das ist ein Produktentscheid, für #209 nicht nötig.

## Bestätigt

- Das Prinzip des Plans (Anteil und Monate beim Erstellen speichern, wie Wohnungsanteil und Zeitanteil pro Position) entspricht Regel 5 und Regel 6 und der Praxis. Eine Abrechnung bleibt mit den Grundlagen ihrer Erstellung bestehen, wie die gespeicherten Tage `rental_start`/`rental_end` (`docs/anforderungen-vertragsende.md:85`).
- Das Szenario verwendet die Glossarbegriffe Liegenschaftsverwalter, Nebenkostenabrechnung, Heizprofil und Abrechnung. Der neue Schritt «verteilt die Heizkosten danach so» ist verständlich. «Winter» ist ein eigenes Heizprofil (per POST angelegt, `backend.ts:247–255`), also darf es geändert werden (Regel 6).
- Die Formel und die Erwartung im Szenario sind nachgerechnet (siehe oben).
- OR Art. 257b (Fedlex): Abs. 1 «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2 «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Der Satz zur Belegeinsicht im PDF bleibt, die Änderung berührt ihn nicht.
- OR Art. 257a Abs. 2 (Fedlex): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Die Änderung berührt das nicht.
- VMWG Art. 4 Abs. 1 (Fedlex, Stand 1.10.2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Die Änderung berührt das nicht.
- VMWG Art. 8 Abs. 1 (Wortlaut unter F-1) und Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» Der Hinweis im PDF bleibt (`pdf.service.ts:687`, unabhängig von `run.heating`).
- VMWG Art. 5 und 7: Die Änderung berührt sie nicht.

## Nicht bestätigt

- **Nachvollziehbarkeit als Rechtspflicht** (Name und Aufteilung des Schlüssels im PDF): Auf Fedlex gibt es dazu keinen Normtext. Gesucht in OR Art. 257a–257b und VMWG Art. 4–8 (Fedlex-Filestore, VMWG Stand 20251001, OR aus derselben Quelle). Belegt ist sie nur über Sekundärquellen in `docs/nebenkostenabrechnung-anforderungen.md:39` und `:103`. Bundesgerichtspraxis nicht gesucht. Deshalb ist die rechtliche Begründung von F-1 und F-6 **unsicher**; Verwalter-Praxis und Regel 5 tragen sie.
- **Ob ein Profil nach der Abrechnung überhaupt geändert werden darf** (Sperre oder Speichern): Dazu gibt es keine Norm, es ist ein Produktentscheid (F-8).
- Das Format von CHF-Beträgen im PDF-Text («430.00» oder «CHF 430.00») für den vorgeschlagenen Schritt in F-4 ist nicht geprüft.
- Ob es für F-6 schon ein Issue gibt: offene Issues nicht durchsucht (kein GitHub-Zugriff in diesem Auftrag).
- Das Szenario selbst nicht ausgeführt. Die Notiz zum roten Szenario im Plan (60 % statt 43 %) ist nur rechnerisch bestätigt (Nachrechnung 1).
