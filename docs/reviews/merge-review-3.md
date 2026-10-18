# Re-Review Slice «merge-2», Runde 2 (Fix 9b56c86)

Worktree `review-merge-3`, detached auf `9b56c86`. Delta `git diff 926da71 9b56c86` vollständig gelesen (7 Dateien). Ausserdem gelesen: `docs/reviews/merge-review-2.md`, `backend/src/db/schema.ts:122-124`, `src/routes/dashboard/+page.server.ts:104-127` (A-6 `expired`), `src/routes/contracts/[id]/+page.server.ts:60-88` (`nextStepsDue`, `fixedTermCheckDue`, `successorAfter`), die Grundlagen von `statement-detail.feature:26-29` und `statement-generate.feature:8-15`, `tests/e2e/steps/contract-form.steps.ts:217-222` und `docs/anforderungen-vertragsende.md:173, 202`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | erledigt, aber siehe C-4 | `backend/src/services/old-address.ts:18` | Der Widerspruch zu A-6 bei einem abgelaufenen befristeten Vertrag **ohne** späteren Mietvertrag ist behoben. Belegt durch den neuen pg-Test und das neue Szenario in `dashboard.feature:180-188` |
| C-2 | Nit | `docs/archive/implementation-plan-verlauf.md:889-890` | Bleibt offen (Leerzeile), wie in Runde 1 |
| C-3 | Nit | `backend/migrations/0015_tenant_country.sql` | Bleibt offen (Hinweis im PR), wie in Runde 1 |
| C-4 | Major | `backend/src/services/old-address.ts:18`, `tests/e2e/features/statement-detail.feature:61`, `statement-generate.feature:123` | Die neue Bedingung ist enger als A-6. Ein befristeter Vertrag, nach dem die Wohnung schon einen Nachmieter hat, gilt jetzt nie mehr als «ausgezogen». A-6 sieht in diesem Fall dagegen keinen offenen Verbleib und bietet «Mieter ist ausgezogen» gar nicht an. Damit fällt A-5 für den häufigsten Fall weg: befristeter Vertrag, Nachmieter, alte Adresse. Die beiden #114-Szenarien zeigen genau diesen Fall. Sie wurden mit einer Kündigung als Voraussetzung grün gemacht, statt die Warnung zu behalten |
| C-5 | Minor | `docs/anforderungen-vertragsende.md:173` | «Ausgezogen heisst: der Mietvertrag endete vor heute, und kein Mietvertrag des Mieters läuft heute» beschreibt die umgesetzte Regel und nennt `old-address.ts`. Die neue Bedingung (Kündigung oder «Mieter ist ausgezogen») fehlt dort. Der entschiedene Text von #114 kann bleiben, aber im «Umgesetzt»-Absatz gehört ein Satz zur Abgrenzung von A-6 dazu |

ponytail-review: Die Änderung am Service ist eine einzige Bedingung. Der neue Schritt `nennt die Übersicht keine Aufgabe …` wird verwendet und ruft nur die bestehende Question auf. Es bleibt nichts Ungenutztes zurück. Lean already, bis auf die fehlende Bedingung aus C-4.

## C-4 (Major): Nach einem befristeten Vertrag mit Nachmieter warnt A-5 nicht mehr

**Warum falsch.** Für A-6 ist ein vereinbartes Ende nur dann offen, wenn drei Dinge zutreffen: Es gibt keine Kündigung, keinen späteren Mietvertrag der Wohnung und kein `movedOut`. So steht es in `expired` (`dashboard/+page.server.ts:113-122`, `!later(contracts, c)`) und in `fixedTermCheckDue` (`contracts/[id]/+page.server.ts:83-87`, `successorAfter(...) === false`). Hat die Wohnung einen Nachmieter, steht der Auszug also fest. A-6 fragt dann nicht, und die Detailseite zeigt `FixedTermCheck` nicht. Damit gibt es auch die Aktion «Mieter ist ausgezogen» nicht (`+page.svelte:151`, `shown={data.fixedTermCheck}`). `oldAddress` verlangt jetzt aber `c.terminated or c.moved_out`. Für einen befristeten Vertrag mit Nachmieter ist keines davon wahr, und der Verwalter kann es in der App auch nicht setzen. Die Warnung von #114 erscheint deshalb nicht mehr: nicht in der Vorschau, nicht auf der Detailseite, nicht im Versanddialog und nicht als Aufgabe in der Übersicht. Die Abrechnung geht dann ohne Hinweis an die Wohnung, die jetzt der Nachmieter bewohnt. Genau das soll #114 verhindern. Die Begründung des Fixes («seit #115 kann ein befristeter Vertrag nach seinem Ende weiterlaufen») trifft nur ohne späteren Mietvertrag zu. Mit Nachmieter kann der Vertrag nicht weiterlaufen.

**Wie man es zeigt.**
- `statement-generate.feature:8-15` und `statement-detail.feature:26-29`: In der Grundlage endet Eva Frei am 2024-03-31 ohne Kündigung, und Marc Huber mietet 3.01 seit 2024-05-01. Das ist der Fall oben. Auf `926da71` waren beide #114-Szenarien ohne Kündigung grün. Laut Aufrufer hat der Fix sie rot gemacht, denn sonst hätte er die neue Zeile `Angenommen der Mietvertrag von "Eva Frei" ist auf den "2024-03-31" gekündigt` nicht gebraucht. Nimmt man diese Zeile wieder heraus, ist das Szenario auf `9b56c86` rot. Das habe ich durch Lesen erschlossen, nicht ausgeführt. Die Regel «gleiche Szenarien und gleiche Strenge wie vorher, ausser die Anforderung ändert sie» ist damit verletzt. #115 ändert #114 nur für Verträge ohne Nachmieter.
- Ein pg-Test, der den Fehler zeigt: In `old-address.pg.test.ts` `terminated: false` setzen und einen Vertrag eines anderen Mieters in der gleichen Wohnung mit Beginn nach 2024-03-31 anlegen. Dann `expect(await oldAddress()).toBe(true)` erwarten. Auf `9b56c86` ergibt das `false`.

**Lösung (Vorschlag).** Die Bedingung soll das Gegenteil von A-6 sein:
`and (c.terminated or c.moved_out or exists (select 1 from rental_contracts n where n.apartment_id = c.apartment_id and n.start_date > c.end_date))`.
Dazu gehören der pg-Test oben, als Fall «mit Nachmieter» im neuen Test, und die beiden #114-Szenarien wieder ohne die Zeile mit der Kündigung, denn ihre Grundlage enthält den Nachmieter schon. Das Szenario in `dashboard.feature:170-177` darf die Kündigung behalten, denn Bruno Meier hat dort keinen Nachmieter. Das neue Szenario in `:180-188` bleibt.

## Bestätigt

- `old-address.ts`: `terminated` und `moved_out` sind `notNull` mit Default `false` (`schema.ts:122-124`), `or` gibt also nie `null`. Der Kommentar beschreibt die neue Regel.
- Neuer pg-Test «warnt … erst, wenn der Auszug bestätigt ist»: Ohne den Fix scheitert schon das erste `toBe(false)`, der Test ist also rot ohne die Änderung. Am Ende setzt er `terminated: true, movedOut: false` zurück, sodass der folgende Test «warnt nicht, solange der Mietvertrag läuft» weiter mit `true` beginnt. Das `beforeAll` setzt `terminated: true` vor dem Erstellen der Abrechnung, die übrigen Tests behalten also ihre Bedeutung.
- Neues Szenario `dashboard.feature:180-188`: Der positive Anker ist die A-6-Aufgabe aus derselben Ladung der Übersicht, danach folgt die negative Prüfung. Ohne den Fix wird es an `keine Aufgabe "Neue Adresse eintragen"` rot. Die Feature-Sprache beschreibt fachliche Vorgänge. Der neue Schritt (`dashboard.steps.ts:161-166`) ruft nur `verwalter.sees(overviewTaskShownFor(...))` auf, die Screenplay-Schichten bleiben also gewahrt. Die Ja/Nein-Frage passt, denn es geht um einen echten Zustand (angezeigt oder nicht).
- Der Schritt `der Mietvertrag von {string} ist auf den {string} gekündigt` existiert (`contract-form.steps.ts:217-222`, `seed.notice`).
- Kein neuer UI-Text, kein neuer Bildschirm und kein geänderter API-Vertrag (das Feld `oldAddress` bleibt, nur sein Wert ändert sich). a11y: Ida und Kurt in `screens.ts` sind gekündigt (Runde 1) und behalten deshalb ihre Warnung.
- Andere Stellen, die `oldAddress` lesen (`contract.service.ts:50`, `statement.service.ts:53`, `contracts/[id]/+page.server.ts:76`, `dashboard/+page.server.ts:108`, Vorschau): Sie übernehmen den Wert unverändert. `nextStepsDue` setzt `terminated` ohnehin schon voraus und ist von C-4 deshalb nicht betroffen.
- `docs/reviews/merge-review-2.md` ist der Bericht aus Runde 1 und gehört nicht zur App.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht neu ausgeführt: Backend `old-address.pg.test.ts` (6 bestanden), `bun run lint`, E2E chromium+api `statement-detail`, `statement-generate`, `dashboard`, `contract-detail` (177 bestanden), a11y- und Sprachzeilen `old-address|moved-out` (12 bestanden), der volle E2E-Lauf auf `926da71` (912). `bun run check` und Backend `type-check` auf `9b56c86` meldet der Aufrufer nicht.
- C-4 habe ich nur durch Lesen belegt (Grundlagen der Features, `expired`, `fixedTermCheckDue`, `old-address.ts`), nicht mit einem Lauf. Dass die #114-Szenarien ohne die Zeile mit der Kündigung auf `9b56c86` rot sind, schliesse ich aus dem SQL.
- Ob #114 oder #115 den Fall «befristet mit Nachmieter» ausdrücklich entschieden hat, habe ich nicht geprüft (Issues nicht gelesen). `docs/anforderungen-vertragsende.md:173` nennt keine Kündigung als Voraussetzung.
