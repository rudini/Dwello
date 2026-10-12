# Review H – Schlussreview PR #43 (claude/relaxed-ride-tciycq)

Ich habe den ganzen PR unabhängig geprüft: `git diff origin/main...HEAD` (7 Commits, 53afc51..b0ecf5e). Der Code steht auf b0ecf5e.

Inhalt des PR:
1. Die Verwaltungspauschale ist immer ein Prozentsatz der eigenen Nebenkosten des Mieters. Der Schlüssel für die Pauschale ist überall entfernt.
2. `parsePercent` liest den Satz in Assistent und Einstellungen. Der Hinweis über 3 % ist eine Live-Region, und die Vorschau nennt Heizprofil und Pauschale.
3. Die Migrationen 0001–0011 sind in zwei Dateien zusammengeführt.
4. Der Saldo wird auf 5 Rappen gerundet, mit einer Zeile «Rundung».
5. Die Doku ist nachgeführt.

## Was ich geprüft habe

**Migrationen.** Ich habe die alte Kette (11 Dateien aus `origin/main`) und die neue Kette (2 Dateien) je auf eine Wegwerf-Datenbank angewendet: `dwello_final_old` und `dwello_final_new`. Beide habe ich danach wieder gelöscht. Danach habe ich `pg_dump -s` und die Stammdaten verglichen.
- **Schema:** gleich bis auf die gewollt entfernte Spalte `management_fee_distribution_key_id` mit ihrem FK. Sonst unterscheidet sich nur die Reihenfolge der Spalten. Betroffen sind `categories.is_heating_cost`, `fuel_stocks.category_id`, die Spalten von `utility_statements` und `apartment_share`/`period_share`. Constraints, CHECKs, Indizes und FKs samt `ON DELETE` sind identisch.
- **Stammdaten:** gleich. Ich habe Kategorien (inkl. `is_heating_cost` und Beschreibungen), Verteilschlüssel (inkl. Formel 70/30) und Heizprofile Zeile für Zeile verglichen. In beiden Datenbanken gibt es 29 INSERTs, `configuration` ist in beiden leer.
- Die Datenbank `dwello_final_fach` stammt nicht von mir. Ich habe sie nicht angefasst.

**`schema.ts` gegen die Migrationen.** Ich habe Spalte für Spalte verglichen: Typen, Länge, Präzision, `NOT NULL`, Defaults und FKs mit `onDelete`. Es gibt keine Abweichung, die der PR verursacht. Drizzle kennt die CHECK-Constraints nicht. `defaultRandom()` steht gegen `uuid_generate_v4()` und `uniqueIndex` gegen `UNIQUE` bei `fuel_stocks`. Das alles bestand schon vorher und wirkt sich zur Laufzeit nicht aus.

**Reste des Schlüssels.** Ich habe mit `grep` nach `managementFeeDistribution`, `management_fee_distribution`, `managementFeeKey`, `feeKey`, `managementFeeBase`, `buildingFeeShare` und `management-fee-key` gesucht. In Code und Tests gibt es keine Treffer mehr. Treffer stehen nur noch in historischer Doku, siehe H-1.

**Rundung.** Alle Stellen, die den Saldo verwenden, lesen den gespeicherten `balance`: QR-Rechnung, Mahnung, Liste, Detail und Vorschau. `roundTo5Rappen` rundet symmetrisch, `+ 0` vermeidet −0, und NaN bleibt NaN. Die Funde G-1, G-2, G-3, G-5, G-6 und G-9 aus Review G sind behoben. G-4 ist zum grössten Teil behoben, G-7 und G-8 nur teilweise (siehe H-7, H-8).

**Review F, Runde 3.** R3-1 (Entwurf mit `null`), R3-2 (Komma in den Einstellungen), R3-4 (dreimal «Üblich sind bis 3 %»), R3-5 und R3-6 (`parsePercent`) sind behoben. R3-3 ist mit dem Entfernen der Spalte gegenstandslos. R3-9 a/b sind weiter offen (H-8).

**Tests.** Die Frontend-Tests habe ich mit `bunx vitest run` laufen lassen: `statement-wizard.dom`, `statement-pages.dom`, `settings`, `format`, `statement-wizard` und `design-guard`, zusammen 499 grün. Im Backend liefen `statement-pdf-render`, `statement-pdf-data`, `management-fee.pg`, `statement-generation.pg`, `statement-pdf.pg` und `api-contracts.pg`, zusammen 71 grün. `bunx fallow audit` meldet keine Funde. E2E und `bun run build` habe ich wie vorgegeben nicht ausgeführt.

## Ergebnis

**Kritisch: keine. Hoch: keine.**

- Mittel ist ein Punkt: Doku, die entferntes Verhalten als aktuell beschreibt.
- Der Rest ist niedrig: tote Zweige und Hilfsfunktionen, Testlücken, Kommentare, ein Commit-Betreff über 50 Zeichen.

Ich habe keinen Korrektheitsfehler in Rechnung, Rundung, PDF, Assistent oder Einstellungen gefunden.

### Mittel

**H-1 (mittel) `docs/archive/seed-daten-aenderungen.md` beschreibt den entfernten Schlüssel als gültig**
- **Stellen:**
  - `docs/archive/seed-daten-aenderungen.md:54` (P8)
  - `:56` (P10)
  - `:3`
- **Fehler:**
  - Zu P8 hat bebb4cd geschrieben: «den Text mit Schlüssel drucken nur noch ältere Abrechnungen». Das stimmt seit 80db93d nicht mehr. Die Spalte ist weg, `feeKeyOf` und die Texte `feeBase`, `feeKey` und `feeDays` sind gelöscht. Keine Abrechnung druckt diesen Text noch.
  - P10 nennt als Lösung «Migration 0004: `heating_profile_id`, `management_fee_distribution_key_id`», ohne zu sagen, dass die Spalte entfernt und 0004 aufgelöst ist.
  - Zeile 3 verweist auf `0003_stammdaten_korrektur.sql`. Diese Datei gibt es nicht mehr.
- **Folge:** Wer diese Datei als Stand der Stammdaten und des PDF liest, erwartet ein Verhalten, das der Code nicht mehr hat.
- **Fix:**
  - P8: «Seit Session 12 immer der eigenen Nebenkosten («x % der Zwischensumme von CHF y»); den Schlüssel gibt es nicht mehr.»
  - P10: «… (seit Session 12 nur noch `heating_profile_id`; der Schlüssel der Pauschale ist entfernt, Migrationen in 0001/0002 zusammengeführt).»
  - Zeile 3: «korrigiert durch 0003» ersetzen durch «(seit Session 12 in `0002_stammdaten.sql` zusammengeführt)».

### Niedrig

**H-2 (niedrig) Toter Ersatzsatz für «ältere Abrechnungen ohne gespeicherten Satz», mit neuem Test**
- **Stellen:**
  - `backend/src/services/statement-pdf.service.ts:119-124`
  - `src/lib/server/statement.ts:22-25, 45-47`
  - Test `backend/src/__tests__/statement-pdf-data.test.ts:63-67`
- **Fehler:** `generateStatement` schreibt `managementFeePercent` immer (`statement.service.ts:308`), und die Spalte steht seit der Baseline in `0001_schema.sql`. Nach dem Zusammenführen und `db:reset` gibt es keine Abrechnung mehr ohne Satz. Die Zweige `fee / subtotal` und `feePercent(totalCosts, fee)` werden also nie erreicht. bebb4cd hat für den PDF-Zweig sogar einen neuen Test angelegt.
- Das widerspricht der Regel in CLAUDE.md, zu entfernen, was die eigene Änderung unbenutzt macht. Die Begründung «no installation exists» gilt hier genauso wie für die Spalte.
- **Fix:**
  - `managementFeePercent: parseFloat(statement.managementFeePercent ?? '0')` bzw. `Number(data.managementFeePercent ?? 0)`.
  - `feePercent` und den Test löschen.
  - Alternativ die Spalte `NOT NULL` machen. Das ist vor der ersten Installation erlaubt, braucht dann aber auch `schema.ts` und `data-model.md`.

**H-3 (niedrig) `prorateCosts` wird nur noch von Tests verwendet**
- **Stelle:** `backend/src/services/prorating.service.ts:113`
- Der einzige Aufrufer im Produktivcode war `buildingFeeShare`, und den hat dieser PR entfernt.
- `offene-punkte.md:241` hält bewusst fest: «left as it is, fallow does not flag it». CLAUDE.md verlangt aber, Code zu entfernen, den die eigene Änderung unbenutzt macht. Dass fallow schweigt, liegt nur daran, dass die Tests die Funktion importieren.
- **Fix:** `prorateCosts` mit dem Typ `ProratedCost`, falls er sonst unbenutzt ist, und die Tests in `prorating.service.test.ts:10-50` löschen. Oder die Ausnahme im Code begründen.

**H-4 (niedrig) Commit-Betreff über 50 Zeichen**
- **Commit:** bebb4cd `fix(statements): keep older fee basis, fix fee input` hat 52 Zeichen. CLAUDE.md erlaubt höchstens 50.
- Der Betreff beschreibt ausserdem ein Verhalten («keep older fee basis»), das 80db93d wieder entfernt hat.
- **Fix:** beim Squash-Merge einen eigenen Betreff setzen, z. B. `feat(statements): fee of tenant's own costs` (43 Zeichen). Ein Force-Push ist nicht nötig.

**H-5 (niedrig) Weitere veraltete Doku und Kommentare**
- `docs/design/offene-punkte.md:193`:
  - Fehler: Dort steht «contracts with different rates need separate runs (help text)». Der Hilfetext sagt seit bebb4cd: «löschen Sie danach seinen Entwurf und erstellen Sie ihn mit diesem Satz neu».
  - Fix: den Satz an den Hilfetext angleichen.
- `docs/PRD-Dwello.md:468`:
  - Fehler: «Five flat profiles» ist falsch. Es sind vier, und sie sind nicht flach.
  - Fehler: Die PRD erwähnt die Rundung des Saldos auf 5 Rappen nirgends, auch nicht bei Step 4/PDF (`:567`) und Statement Details. Die PRD soll laut CLAUDE.md die Anforderungen aller Features beschreiben.
  - Fix: «Four profiles …» schreiben und unter «Balance» einen Satz zur Rundung mit der Zeile «Rundung auf 5 Rappen» ergänzen.
- `backend/src/db/schema.ts:169`:
  - Fehler: Der Kommentar sagt «Heating and hot water costs (Art. 5 VMWG)». Laut Migration (`0001_schema.sql:105`, `0002_stammdaten.sql:13`) wird eine eigene Warmwasser-Rechnung aber nach Tagen verteilt, und `Hot Water` ist `false`.
  - Fix: «Heating costs (Art. 5 VMWG) …», wie in der Migration.
- `backend/src/services/heating-profile.service.ts:5`:
  - Fehler: Der Kommentar nennt noch das Profil «Warmwasser». Er bestand schon vorher, verweist aber auf die neu zusammengeführte `0002_stammdaten.sql`, in der es dieses Profil nicht gibt.
  - Fix: «(Heizung + Warmwasser, Mittelland, Bergregion, Tessin)».

**H-6 (niedrig) Die Fehlermeldung bei mehr als zwei Nachkommastellen sagt nicht, was falsch ist**
- **Stellen:** `src/lib/server/settings.ts:45` und `src/lib/statement-wizard.ts:36`
- **Fehler:** Auf «2,555» antworten beide mit «Bitte geben Sie einen Prozentsatz ab 0 ein, zum Beispiel 3 oder 2,5.» Der Wert ist aber ab 0. Der Grund (höchstens zwei Nachkommastellen) fehlt. Nach den Design-Regeln soll eine Fehlermeldung sagen, was passiert ist und was zu tun ist.
- **Fix:** «Bitte geben Sie einen Prozentsatz ab 0 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.» Dazu die Texte in den Tests anpassen: `settings.test.ts`, `statement-wizard*.test.ts`.

**H-7 (niedrig) Rest von G-4 und G-7: Begriff ohne TODO, Testlücken bei der Rundung**
- **Begriff ohne TODO:**
  - Stellen: `backend/src/services/pdf.service.ts:47` und `src/routes/statements/[id]/CostTable.svelte:93`
  - Fehler: «Rundung auf 5 Rappen» steht nicht in `UBIQUITOUS_LANGUAGE.md`. Es fehlt `TODO(fachlich prüfen)` an der Bezeichnung, und `offene-punkte.md:246` nennt den Begriff nicht. Erfasst ist nur der Glossarvorschlag zu «Saldo».
  - Fix: TODO-Kommentar an beiden Stellen setzen und den Begriff in «Session 12 – Saldo» aufnehmen.
- **Testname passt nicht:**
  - Stelle: `backend/src/__tests__/statement-pdf-data.test.ts:97`
  - Fehler: Der Name «auch knapp unter der Grenze als Fliesskommazahl» passt weiterhin nicht zu den Werten (G-8). Es fehlen −0.025 → −0.05 und −0.01 → 0. Damit prüft kein Test, dass `+ 0` aus −0 eine 0 macht. Ohne `+ 0` bliebe die Suite grün, weil `toBe(0)` −0 von 0 unterscheidet, der Fall aber nicht vorkommt.
  - Fix: `expect(Object.is(roundTo5Rappen(-0.01), 0)).toBe(true)` und `expect(roundTo5Rappen(-0.025)).toBe(-0.05)` ergänzen und den Namen anpassen.
- **Kein Minus im Web getestet:**
  - Stelle: `src/__tests__/statement-pages.dom.test.ts:492-499`
  - Fehler: Die Webansicht prüft nur «+ CHF 0.02», nicht den Zweig «−» und nicht den Saldo 0 nach der Rundung.
  - Fix: ein Fall `totalCosts: 1000.02, totalAdvancePayments: 1000, balance: 0`, erwartet «Rundung auf 5 Rappen − CHF 0.02».

**H-8 (niedrig, aus F-3 offen) Zwei Tests würden einen Fehler nicht finden**
- **Vorschau-Test:**
  - Stelle: `src/__tests__/statement-wizard.dom.test.ts:229-235` (R3-9 a)
  - Fehler: Der Test setzt den Satz über `defaultManagementFeePercent`. Zeigte die Vorschau fälschlich den Vorschlag statt der Eingabe aus Schritt 3, bliebe er grün. Nur das E2E-Szenario «Die Vorschau nennt die Verwaltungspauschale» deckt den echten Weg ab.
  - Fix: Im DOM-Test in Schritt 3 «2,5» tippen, die Server-Antwort spielen und dann `preview-fee` prüfen.
- **PDF-Test:**
  - Stelle: `backend/src/__tests__/statement-pdf.pg.test.ts:214` (R3-9 b)
  - Fehler: Das Muster `CHF [\d'.]+` akzeptiert jeden Betrag. Die Grundlage prüft genau nur der Render-Test (`statement-pdf-render.test.ts:122`).
  - Fix: den erwarteten Betrag aus `subtotal` der gespeicherten Abrechnung bilden.
- **Pauschale aus der Liegenschaft nicht unterscheidbar:**
  - Stellen: `management-fee.pg.test.ts:65-71` und Szenario `statement-management-fee.feature:21-24`
  - Fehler: Bei einer einzigen Rechnung nach Fläche ergibt die alte Pauschale aus der Liegenschaft genau dieselben Beträge (11.31 bzw. 257.50/772.50). Weil die API das Feld nicht mehr kennt, ist das heute kein Risiko. Als Spezifikation der Regel «eigene Nebenkosten» unterscheiden die Tests die beiden Varianten aber nicht.
  - Fix, optional: zwei Rechnungen mit verschiedenen Schlüsseln.

**H-9 (niedrig, vorbestehend) Vertragsbeispiel mit unmöglichem Saldo**
- **Stelle:** `tests/contracts/statement-preview.json:2-4`
- **Fehler:** Das Beispiel hat `balance: 1045` bei Kosten 1045 und Akonto 1800. Seit der Rundung ist der Saldo ein zentraler Wert, und das Beispiel sollte stimmen. Schon in G-8 genannt, weder behoben noch festgehalten.
- **Fix:** `"balance": -755`.

## Geprüft ohne Befund

- **Rechnung:** `calculateStatementForContract` hat keinen Schlüsselpfad mehr. Die Pauschale ist `subtotal × Satz`, gerundet auf den Rappen. Der Saldo ist `roundTo5Rappen(totalCosts − Akonto)`. Positionen, Zwischensumme, Pauschale und «Ihre Nebenkosten» bleiben auf den Rappen genau.
- **PDF:**
  - Die Rundung ist im Kasten und in der Tabelle gleich: «+ Rundung auf 5 Rappen CHF 0.02» bzw. «Rundung auf 5 Rappen + 0.02».
  - Bei Saldo 0 nach der Rundung erscheint der Text `balancedRounded` in allen vier Sprachen.
  - Die Platzreserve rechnet mit 5 Zeilen, der italienische Text hat eine Zeile.
  - Abrechnungen mit einem ungerundeten Saldo zeigen keine Rundungszeile. Die Schwelle ist dieselbe wie im Web.
- **Assistent:**
  - `feeText` behält die Eingabe, auch eine halbe wie «4,».
  - `parsePercent` lehnt `1e2`, `Infinity`, `0x1F`, «2,555» und Negatives ab.
  - Ein leeres Feld oder `null` aus dem Entwurf wird mit `Number.isFinite` abgelehnt.
  - Das verborgene Feld schickt «2.5».
  - Der Hinweis über 3 % steht in einem dauerhaft vorhandenen `role="status"`. `Alert` mit `caution` hat keine eigene Rolle, es gibt also keine verschachtelte Live-Region.
- **Einstellungen:**
  - Das Feld ist ein Textfeld mit `inputmode="decimal"`.
  - «2,5» wird als «2.5» gespeichert.
  - Ein leeres Feld löscht den Wert wie bisher, danach gilt der Standard 3.
  - Das Backend prüft `v >= 0`.
- **API-Vertrag:** `statement.json` ist ohne den Schlüssel. Der Vertragstest ist grün.
- **Konventionen:**
  - UI-Texte sind deutsch mit «ss», Code und Kommentare englisch.
  - Es gibt neue `data-testid` in kebab-case: `preview-fee`, `preview-heating-profile`, `statement-rounding`.
  - Nur Token-Klassen: `rounded-panel`, `bg-sunken`, `text-ink-muted`. `design-guard` ist grün.
  - Die übrigen sechs Commit-Betreffe haben höchstens 50 Zeichen.
- **`migrate.ts`:** Eine Datenbank aus der alten Kette (Einträge 0003–0011 in `schema_migrations`) wird mit dem Hinweis auf `bun run db:reset` abgelehnt. README, `backend/CLAUDE.md` und `data-model.md` beschreiben das gleich.
