# Re-Review Runde 2: Merge-Slice W9c, Fix von C-1 (9dc4299)

Geprüft: `git diff 0c2eb3f 9dc4299` (5 Dateien, alle gelesen), dazu `src/routes/dashboard/+page.server.ts` (`expired`, `formerTenants`), `src/routes/tenants/[id]/+page.server.ts:38-55`, `src/routes/contracts/[id]/+page.server.ts:60-85` (`successorAfter`, `fixedTermCheckDue`), `FixedTermCheck.svelte`, `docs/anforderungen-vertragsende.md` A-6, `tests/contracts/contracts.json` (enthält `terminated`/`movedOut`), `implementation_plan.md` (#178: «No scenario: …»).

C-1 ist für den gemeldeten Fall behoben: Ein abgelaufener, nicht gekündigter Mietvertrag ohne «Mieter ist ausgezogen» und ohne späteren Mietvertrag erzeugt keine Aufgabe «Dokumente von … prüfen» und keinen Hinweis auf der Mieterseite mehr; die Übersicht zeigt dann nur «Befristeten Mietvertrag prüfen». Der neue Unit-Test (`fixedTerm(false)` → `null`) wäre vor dem Fix rot gewesen (alle Verträge «ended» → Objekt). Die Rohdaten der Aufrufer (Dashboard: `allContracts`, Mieterseite: `contracts` aus `/contracts?tenantId=`) tragen `terminated` und `movedOut`, die Prüfung greift also zur Laufzeit.

Die Regel geht aber weiter als A-6. Das ergibt den neuen Befund C-3.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | – | src/lib/former-tenant-documents.ts:29-31 | Behoben (siehe oben). |
| C-2 | Nit | src/lib/overview.ts:228 | Bleibt wie gemeldet (vom Aufrufer bewusst so gelassen). |
| C-3 | Major | src/lib/former-tenant-documents.ts:31 | Der Fix lässt den späteren Mietvertrag der Wohnung ausser Acht, den A-6 als Teil der offenen Bedingung nennt. Ein befristeter Mietvertrag, der regulär endet und auf den ein neuer Mieter folgt, zeigt den Hinweis zu #178 deshalb nie. Der Verwalter kann ihn auch nicht herbeiführen: «Mieter ist ausgezogen» bietet die Vertragsseite nur ohne späteren Mietvertrag an (`fixedTermCheckDue`). |
| C-4 | Nit | src/routes/dashboard/+page.server.ts:130 | Der Cast `as { startDate: string; endDate: string \| null }[]` nennt `terminated`/`movedOut` nicht, obwohl das Ergebnis jetzt von ihnen abhängt. Wer hier später auf diese Form mappt, verliert die Flags still und blendet alle Hinweise aus. |
| C-5 | Nit | src/lib/former-tenant-documents.ts:24-27, src/__tests__/former-tenant-documents.test.ts:30-63 | Prettier hat unveränderte Zeilen umformatiert. Das ist zulässig, weil die Dateien auf diesem Branch entstanden sind, macht den Fix-Diff aber unruhig. |

## C-3 (Major)

**Warum falsch:** A-6 (`docs/anforderungen-vertragsende.md`, Anforderung 1, und `expired()` in `dashboard/+page.server.ts:108-118`) nennt den Zustand nur dann offen, wenn das vereinbarte Ende vorbei ist, nicht gekündigt wurde, kein «Mieter ist ausgezogen» vorliegt **und die Wohnung keinen späteren Mietvertrag hat**. Gibt es einen späteren Mietvertrag, ist für A-6 der Auszug belegt: Die Übersicht stellt keine Frage, und die Vertragsseite zeigt `FixedTermCheck` nicht (`fixedTermCheckDue` → `successorAfter` → `false`). `formerTenantDocuments` verlangt jetzt aber in jedem Fall `terminated || movedOut`. Damit fällt der häufigste Fall aus #178 heraus: Ein befristeter Mietvertrag läuft ab, und der nächste Mieter zieht ein. Für diesen Mieter erscheint nie ein Hinweis auf seine alten Dokumente, weder in der Übersicht noch auf der Mieterseite. Der Verwalter hat keinen Weg, das zu ändern. Die Schaltfläche «Mieter ist ausgezogen» ist ausgeblendet. Den Vertrag als gekündigt zu markieren, wäre falsch, denn ein befristeter Vertrag endet ohne Kündigung. Das widerspricht dem Zweck von #178 (Datenminimierung) für Daten, die A-6 als abgeschlossen behandelt. Die Begründung «Löschen ist irreversibel» trägt hier nicht: Der Hinweis löscht nichts. Er nennt nur Dokumente, und das Löschen bestätigt der Verwalter selbst. Bei einem späteren Mietvertrag gibt es auch keine offene A-6-Frage, die der Hinweis widersprechen könnte.

**Nachweis:** Unit-Test in `former-tenant-documents.test.ts` mit dem Vertrag `contract('2025-04-01', '2026-03-31', { terminated: false, movedOut: false })` und einem Upload vom 2025-03-10, dazu ein Mietvertrag eines anderen Mieters an derselben Wohnung ab 2026-04-01. Erwartet (A-6: Auszug belegt) ist `{ endDate: '2026-03-31', documents }`, geliefert wird `null`. Die Funktion kennt den Folgevertrag gar nicht. Ebenso in `dashboard.test.ts`: `former` mit `terminated: false` plus ein späterer Vertrag `k10` an derselben `apartmentId`. Dann fehlen `fixed-term-k9` **und** `former-documents-t9`.

**Vorschlag:** Für die Ausnahme dieselbe Bedingung wie A-6 verwenden. Im Dashboard reicht es, die Mieter aus `expired(allContracts, today)` auszunehmen statt der Flag-Prüfung in der Funktion (`later()` ist dort vorhanden). Die Mieterseite braucht die Verträge der Wohnung des letzten Vertrags (wie `successorAfter`) oder einen Parameter `stayed: boolean` für `formerTenantDocuments`. Will der Product Owner bewusst die strengere Regel (kein Hinweis ohne Kündigung oder Auszug, auch mit Nachmieter), gehört das unter «Blocked on me» und braucht einen Weg, «Mieter ist ausgezogen» auch mit Nachmieter zu setzen.

## Nicht bestätigt

- `bunx vitest run` für former-tenant-documents, tenant-detail, dashboard und overview auf 9dc4299: selbst wiederholt, 4 Dateien und 53 Tests grün.
- `bun run lint` und `bun run check` auf 9dc4299: vom Aufrufer gemeldet.
- E2E: #178 hat «No scenario» (Upload-Zeitstempel lässt sich nicht seeden, `implementation_plan.md:18`). Der Fix ändert daran nichts, und es gibt kein E2E dazu.
- Ob bestehende Daten (Verträge, die vor A-6 ohne `terminated` endeten) betroffen sind: In den Demodaten haben beide beendeten Verträge `terminated: true` (`backend/src/__tests__/demo-data.pg.test.ts:144-147`, nur gelesen). Produktivdaten habe ich nicht geprüft.
- Fachliche Sicht, ob ein Nachmieter als Beleg des Auszugs genügt: Das sagt A-6 so. Ein `fach-reviewer` wurde nicht befragt.
