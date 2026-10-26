# Review i837c4d, Runde 1 (4ba36ee1..d60e160a)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/lib/types.ts:25-28, src/routes/tenants/+page.server.ts:3, docs/architecture/adr/0005-api-typen-im-eigenen-modul.md:185, :204 | Neuer Frontend-Import von `TenantWithOccupancy` aus `backend/src/services/tenant.service.ts`. Das widerspricht dem Entscheid in #837 und ADR 0005; das ADR erklärt #837 trotzdem für geschlossen. |
| C-2 | Minor | src/lib/types.ts:380 | Der Kommentar «what it allows, decided by the backend (#788) …» steht jetzt allein über `offsetWith`. Die Felder, die er beschrieb, sind nach oben in `Required<Pick<…>>` gewandert, also beschreibt er jetzt das falsche Feld. |
| C-3 | Minor | docs/architecture/adr/0005-api-typen-im-eigenen-modul.md:187; src/lib/types.ts:159 | Das ADR sagt, «Done means» von #837 sei erfüllt. Geprüft ist aber nur die erste Zeile. Die zweite verlangt: «list and form shapes that differ are named after their use (as `TenantListItem`)». `ApartmentWithBuilding` heisst weiter nach seinem Inhalt, obwohl der Diff es selbst als «A row of GET /apartments as the list shows it» beschreibt. |
| C-4 | Minor | docs/architecture/adr/0005-api-typen-im-eigenen-modul.md:204; src/routes/buildings/[id]/+page.server.ts:94 | Das ADR sagt «Nächste Zyklen: Keine». Dieselbe Antwort `GET /apartments`, die der Diff in `apartments/+page.server.ts` typisiert, liest `buildings/[id]/+page.server.ts` aber weiter als `Record<string, unknown>`, mit einer zweiten, kopierten Feldliste. Das verstösst gegen «The BFF mapper takes the type as its input» (#837, Entscheid) und gegen CLAUDE.md «One mapper per response». Die Stelle bestand schon vorher. Falsch ist die Aussage, es bleibe nichts zu tun. |

## C-1 (Major): Der Typ der Mieterliste kommt aus einem Service

**Warum falsch:** Der Entscheid in #837 vom 26.10.2026 sagt: «The response type of an entity lives in its own backend module … It does not live in the service» und «The frontend imports only the type module». ADR 0005, Zeile 26, sagt dasselbe: «Das Frontend importiert nur das Modul unter `backend/src/api/`, nie einen Service.» Der Diff fügt zwei neue `import type` aus `backend/src/services/tenant.service.ts` hinzu:

- in `src/lib/types.ts:27` (`TenantWithOccupancy`);
- in `src/routes/tenants/+page.server.ts:3`.

Das ADR, Zeile 185, nennt den Verstoss und schiebt die Verschiebung nach `backend/src/api/tenant.ts` auf später. Zeile 204 erklärt dann aber, dass Zyklus 4d #837 schliesst. Damit bleibt kein Zyklus, der das nachholt, und der Entscheid gilt für die Mieter nie.

`fitness` sieht den Import nicht. `crossesBoundary` (tools/fitness/fitness.ts:273-276) meldet einen Import ins Backend nur, wenn er kein reiner Typ-Import ist (`type_only === 'no'`). Darum steht «boundary imports 0» im Bericht des Aufrufers, obwohl die Regel verletzt ist.

**Nachweis:** `grep -rn "backend/src/services" src --include=*.ts` zeigt auf d60e160a zwei Treffer:

- `types.ts`, mit `TenantResponse` (bestand schon) und `TenantWithOccupancy` (neu);
- `tenants/+page.server.ts` (neu).

Auf 4ba36ee1 gibt es nur einen Treffer.

**Behebung:**

- `TenantWithOccupancy` erweitert nur `Tenant` aus `schema.ts`. Es lässt sich ohne Weiteres nach `backend/src/api/tenant.ts` verschieben; der Service importiert es dann von dort.
- `TenantResponse` ist ein `ReturnType<typeof getTenant>` und bestand schon vorher. Für ihn gibt es zwei Wege:
  - Er wandert in diesem PR als benannter Typ mit.
  - #837 bleibt offen, oder ein Folge-Issue bekommt ihn. Dann darf das ADR nicht «Keine» schreiben.

## Nicht bestätigt

- Die Prüfungen des Aufrufers auf d60e160a, alle **vom Aufrufer gemeldet**: `bun run check` (0 Fehler, 29 s), `bun run lint`, `bunx vitest run` (3696 Tests) und `bun tools/fitness/fitness.ts --base origin/main` (4/12/36, Spiegel 45, Wertelisten 10, Kanten 0). Den Versuch, `apartments-pages.dom.test.ts`, `building-lists-load.test.ts`, `tenants-i18n.test.ts` und `apartment.test.ts` selbst laufen zu lassen, blockiert eine Deny-Regel: `node_modules` im Worktree zeigt auf `/home/user/Dwello/node_modules`.
- Ob eine Verschiebung von `TenantWithOccupancy` (C-1) `svelte-check` sauber lässt, habe ich nur durch Lesen eingeschätzt. Gelaufen ist dazu nichts.

Geprüft:

- **Diff:** Alle fünf geänderten Dateien sind gelesen.
- **`buildingAddress` und `buildingCity`:** `listApartments` wählt sie nicht aus (`apartmentFields`, backend/src/services/apartment.service.ts:71-87), und keine Komponente liest sie. Das Weglassen ändert also keinen angezeigten Wert.
- **Mapper der Abrechnung:** `src/lib/server/statement.ts:136-148` setzt die fünf Erlaubnisse mit `=== true`. Das passt zu `Required<Pick<…>>`.
- **`TenantListItem`:** `isActive` und `isFuture` kommen jetzt aus dem Backend-Typ.
- **Behauptung im ADR, Zeile 187** (erste Zeile von «Done means», gegen alle `backend/src/api/*.ts` und `TenantWithOccupancy`): Kein Feld bleibt von Hand deklariert, das der Mapper unverändert weitergibt. Alles Übrige wird umbenannt, zusammengesetzt, in eine Zahl umgewandelt oder mit einem Ersatzwert gefüllt (ADR 0005, Regel 3). Beispiele:
  - `allocableInvoiceCount`, `sortOrder`;
  - `lastReminderDate` (aus `reminderSentDate`);
  - `paymentResets` und `correctionDeclined` als Teilmengen.

  Grenzfall sind `Apartment.area` und `rooms` (`string | number`, types.ts:98-99). `fetchApartment` gibt sie unverändert weiter, die Listen-Mapper füllen `'0'` ein. Nach Regel 3 ist das zulässig.
- **Sonst:** Kein Szenario nötig (reine Typänderung). Kein neuer Test, also keine Rot-Pflicht. Keine Texte, keine UI, kein API-Vertrag betroffen. Nichts im Diff gehört nicht zur Anforderung. Ponytail-review: kein ungenutzter Code, keine Kopie eines bestehenden Helfers.
