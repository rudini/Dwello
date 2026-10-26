# Review i837c4a, Runde 1 (43f8274d gegen origin/main 4dcd0d89)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/types.ts:193 | `export type { MasterDataType };` wird nirgends aus `$lib/types` importiert (einzige Nutzung ist `type: MasterDataType` in `types.ts` selbst, Zeilen 223 und 284, die den Import aus dem Backend-Modul brauchen, nicht den Re-Export). Ungenutzter Export, ersatzlos streichen. |
| C-2 | Minor | src/__tests__/heating-profiles-pages.dom.test.ts:51, src/__tests__/statement-wizard.dom.test.ts:54, src/__tests__/form-selects.dom.test.ts:32 | Der Diff entfernt `isActive` aus `HeatingProfile` und aus `toHeatingProfile`. Diese drei Fixtures für Seitendaten liefern aber weiter `isActive: true`, also ein Feld, das der Mapper nicht mehr erzeugt. Die Fixtures beschreiben damit eine Form, die die Seite nie bekommt. In `invoice-pages.dom.test.ts` wurde dasselbe für Kategorien nachgezogen, hier nicht. |

Keine Blocker, keine Major.

Geprüft: Alle 33 Dateien des Diffs gelesen.
- `invoiceCount: string` stimmt mit `tests/contracts/category.json` («"2"») und den pg-Tests (`category-admin.pg.test.ts:110`, `distribution-key-admin.pg.test.ts:79`) überein.
- `allocableInvoiceCount` bleibt `number`, wegen `COUNT(*)::int`.
- `isActive` hat keine Spalte in `schema.ts` und wird in keiner Komponente gelesen.
- Die Mapper bleiben für gültige Werte gleich:
  - `name`/`key`: `notNull`, das wegfallende `|| ''` ändert nichts.
  - `type`: in Kategorie, Verteilschlüssel und Heizprofil nur `predefined`/`custom`.
  - `||` → `??` bei `monthlyPercentages` ändert nichts.
- `CategoryRow` deckt beide Aufrufer von `toCategory` ab: die Liste und die Kategorie bzw. KI-Kategorie, die eine Rechnung nennt (`invoice.ts:104/109`). Dasselbe gilt für `DistributionKeyRow`.
- `predefined` bleibt für die KI-Kategorie `false` wie bisher.
- `MonthlyPercentages` als Typalias passt zu `profileTotal`, `HeatingProfileChart` und `HeatingProfileForm` (`Record<string, number>`).
- Das `satisfies HeatingProfileDetails` in der Route folgt dem Muster aus Zyklus 2 (`contracts.ts:158`).
- #857: Die Kategorie-Komponenten importieren nichts mehr aus `$lib/server/category`, der Mapper bleibt dort.
- Weder Texte noch UI noch API-Antworten ändern sich. Deshalb braucht es weder Szenario, `messages`, a11y noch einen Vertrag; «No scenario» steht in der Commit-Message.
- Ratchet: `custom|predefined` und der Pfad `src/lib/distribution-key.ts` sind entfernt; das Literal kommt nur noch in Testdateien vor.
- Ponytail: abgesehen von C-1 nichts zu streichen. `profileRow` folgt dem Muster von `invoiceRow` für einen anderen Typ und ist keine Kopie.

## Nicht bestätigt

- Alle Prüfungen des Aufrufers, «vom Aufrufer gemeldet»: `bun run lint`, `bun run check` (0 Fehler), `cd backend && bun run type-check`, `bun run test:coverage` (3694 Tests), `cd backend && bun run test` (1644), `bunx vitest run --changed origin/main` (426), `bun tools/fitness/fitness.ts --base origin/main` (Wertelisten 11→10, Entity-Spiegel 47→46).
- Ein eigener Lauf von `bunx vitest run` für `heating-profile.test.ts`, `config-i18n.test.ts`, `invoice-pages.dom.test.ts`, `categories.test.ts` und `master-data-lists.test.ts` ging nicht: `node_modules` im Worktree verweist auf `/home/user/Dwello/node_modules`, und eine Deny-Regel sperrt den Zugriff darauf.
- Dass `fallow` den ungenutzten Re-Export aus C-1 nicht meldet, habe ich nicht nachgeprüft.
