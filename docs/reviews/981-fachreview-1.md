# Fachreview #981, Schritt 1, Runde 1

Gegenstand: Commit 5bbf759 (Worktree /tmp/claude/review-981-fach): @wip-Szenario «Ein Entwurf mit geändertem Übertrag ist nicht aktuell» (tests/e2e/features/dashboard.feature:135-150), pg-Test backend/src/__tests__/statement-carry-over.pg.test.ts:121-132, Regel A (`outdatedStatements` zählt einen Entwurf mit `carryChanged`), Aufgabentext `dashboard_task_outdated_drafts_text`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Der Aufgabentext nennt den geänderten Übertrag nicht; mit Regel A erscheint ein Entwurf, für den keiner der beiden genannten Gründe zutrifft. Neuer Text unten; dashboard.feature:132 muss seine Zeile ändern. |
| V-2 | Verwalter | Minor | Bestand schon vorher, ausserhalb von #981: Der Hinweis des Erstell-Assistenten auf beibehaltene nicht aktuelle Entwürfe (`statement-run.service.ts:268-285`, `draftOutdated` ohne `carryChanged`) übergeht einen Entwurf mit geändertem Übertrag. Laut UBIQUITOUS_LANGUAGE.md:196 ist er aber «nicht aktuell». Abhilfe: dort `carryChanged` mitzählen, oder ein eigenes Issue eröffnen. |

## V-1 (Major): Aufgabentext ohne dritten Grund

- Beleg: messages/de.json:284 nennt nur Rechnungen und Tankbestand. Mit Regel A (`statement-invoices.service.ts:170ff.`) erscheint der Entwurf «Rosenhof» 2025 (dashboard.feature:138-150) in der Aufgabe, obwohl seit dem Erstellen keine Rechnung seiner Periode und kein Tankbestand geändert wurde. Geändert hat sich nur, welchen Übertrag er verrechnet: 2024 hat 12 × 100.00 = 1'200.00 Akonto und 1'203.00 Heizkosten, also eine Nachzahlung von 3.00 unter dem Mindestbetrag von CHF 5.00. Diese 3.00 werden mit dem Versand von 2024 übertragen. Der Glossareintrag «Nicht aktuelle Abrechnung» (UBIQUITOUS_LANGUAGE.md:196) nennt diesen Grund bereits.
- Warum falsch: Der Vermieter sucht dann eine geänderte Rechnung, die es nicht gibt. Der Text sagt etwas Falsches über genau den Entwurf, den die Aufgabe nennt.
- Abhilfe: der Text in der Tabelle unten. Er übernimmt den bisherigen Wortlaut (#454 E-4 / V-33) und hängt den dritten Grund in der Form von `statements_send_outdated_carry` (messages/*.json:441) an, im Plural.
- Szenario dashboard.feature:132: Die Zeile muss geändert werden. Die neue Fassung enthält den alten Text nicht mehr als zusammenhängende Teilzeichenkette («…, oder der Tankbestand wurde geändert. Berechnen …» wird zu «…, der Tankbestand wurde geändert, oder es hat sich geändert, …»). Darum schlägt `toContain` fehl. Wenn man den neuen Grund vor oder nach dem alten Text als eigenen Satz einfügt, hält :132 zwar, aber die Aussage wird falsch («auch» oder ein Grund nach der Handlungsanweisung). Also braucht es die neue Zeile mit dem deutschen Text unten und `Spec change approved: #981`. Zusätzlich muss die Unit-Erwartung src/__tests__/overview.test.ts:297 nachgezogen werden (kein Szenario, keine Freigabe nötig).

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| dashboard_task_outdated_drafts_text | Seit dem Erstellen wurden Rechnungen ihrer Abrechnungsperiode erfasst, geändert oder gelöscht, der Tankbestand wurde geändert, oder es hat sich geändert, welchen Übertrag aus einer früheren Abrechnung sie verrechnen. Berechnen Sie diese Entwürfe neu, bevor Sie sie zustellen. | Depuis leur création, des factures de leur période de décompte ont été saisies, modifiées ou supprimées, le stock de combustible a été modifié, ou le report d’un décompte précédent qu’ils doivent compenser a changé. Recalculez ces brouillons avant de les remettre. | Dalla loro creazione sono state registrate, modificate o eliminate fatture del loro periodo di conteggio, è stata modificata la scorta di combustibile, oppure è cambiato il riporto da un conteggio precedente che devono compensare. Ricalcoli queste bozze prima di recapitarle. | Since they were created, invoices of their billing period have been added, changed or deleted, the fuel stock has been changed, or the amount carried over from an earlier statement that they must offset has changed. Recalculate these drafts before you deliver them. |

Hinweise zum Wortlaut: Die Begriffe stammen aus docs/design/i18n-begriffe.md:102, 108 und 120 (report/riporto/carried over, brouillon/bozza/draft, stock de combustible/scorta di combustibile/fuel stock). Die Wendung ist dieselbe wie in `statements_send_outdated_carry`. Im fr steht der typografische Apostroph U+2019 wie im bestehenden Text. Der Text hat weder Guillemets noch «:» oder «;», darum braucht er kein geschütztes Leerzeichen (NBSP). «ils» bezieht sich auf «brouillons» (m.), «devono» auf «bozze».

## Nicht bestätigt

- Ich habe nicht geprüft, ob `changesOf` für einen Entwurf, der nur wegen `carryChanged` erscheint, `null` liefern kann. In diesem Fall würde `changes!.invoiceIds` in `outdatedStatements` (statement-invoices.service.ts:190) fehlschlagen. Das ist eine Frage für die Implementierung und den code-reviewer, keine fachliche.
- Die Gegenrichtung von `carryChanged` habe ich weder im Szenario noch im pg-Test geprüft: Ein Entwurf verrechnet einen Übertrag, den er jetzt nicht mehr verrechnen würde, etwa weil der Übertrag von Hand ausgeglichen oder die frühere Abrechnung berichtigt wurde. carry-over.ts:90 deckt diesen Fall mit `is distinct from` ab; kein Test zeigt ihn für die Übersicht.

Geprüft: Regel A stimmt mit UBIQUITOUS_LANGUAGE.md:196 und docs/nebenkostenabrechnung-anforderungen.md:152/188 überein. Die Zahl 1'203.00 − 1'200.00 = 3.00 < 5.00 ergibt einen Übertrag (Erledigt). Der pg-Test prüft denselben Fall: 3.00 mit dem Versand von 2024, wobei 2025 vorher erstellt wurde. Der Entwurf wird weiterhin nicht in «Abrechnungen prüfen und versenden» gezählt (`draftsToSend` :165), es gibt also keine Doppelzählung. Die Regel stellt keine mietrechtliche Frage: Sie betrifft nur den internen Hinweis an den Vermieter, nicht, was der Mieter erhält.
