# Review F, Runde 3 – Nachbesserung der Verwaltungspauschale (bebb4cd)

Unabhängige Prüfung von `git diff 1625225 bebb4cd` (`fix(statements): keep older fee basis, fix fee input`) und des Stands bei bebb4cd für dieses Feature. Grundlage: `docs/reviews/F-review-1.md` (Code, Runde 2), `docs/reviews/F-fachreview-1.md` (Verwalter, Mietrecht, Datenprüfer), `docs/design/personas/marco-f.md`, `weber-f.md`, `sven-f.md`.

Ausgeführt:
- Frontend: `bunx vitest run` für `statement-wizard.dom`, `statement-pages.dom`, `statement-mapping`, `help-page.dom` und `config-pages` (123 grün). `bun run check`: 0 Fehler, 0 Warnungen. `bun run lint`: sauber.
- Backend: `bun test --preload ./scripts/test-db.ts` für `statement-pdf.pg`, `statement-pdf-data`, `statement-pdf-render`, `api-contracts.pg` und `migrations.pg` (60 grün).
- Eine eigene Probe als DOM-Test ausserhalb des Repos, mit eigener Vitest-Konfiguration im Scratchpad. Sie montiert die echte Seite `/statements/generate` und prüft Eingaben, Hin- und Zurückgehen und einen wiederhergestellten Entwurf.
- In der laufenden App (http://localhost:3300) nur gelesen, mit Chromium in der Sprache de-CH: Schritt 3 des Assistenten mit der Eingabe «4,5» und das Feld in den Einstellungen getippt, aber nicht gespeichert. Dazu der Accessibility-Tree. Es wurde nichts erstellt, gespeichert oder versendet.
- E2E und `bun run build` wurden wie vorgegeben nicht ausgeführt.

**Kein Finding ist kritisch oder hoch.** Mittel sind vier Punkte:
- Ein wiederhergestellter Entwurf mit leerem Feld rechnet still mit 0 %.
- Das Feld in den Einstellungen macht aus «2,5» weiterhin 25.
- Wird ein Schlüssel gelöscht, verliert eine ältere Abrechnung ihre Grundlage (F-5). Das ist weder behoben noch festgehalten.
- Die Aussage zu den 3 % lautet an drei Stellen verschieden.

## 1. Abgleich der Findings aus Runde 1/2 und den Personas

| Quelle, ID | Stufe | Stand bei bebb4cd |
|---|---|---|
| F-review F-1 / Fach V-1 / Weber Major (2×) / Marco Major (Grundlage) | hoch | **behoben.** Glossar (`help/Glossary.svelte:33`), Einstellungen (`config/help.ts:9`) und Assistent sagen «eigene Nebenkosten jedes Mieters». Den Verteilschlüssel nennt keiner mehr. `TODO(fachlich prüfen)` ist gesetzt. Die Tests schliessen den alten Text aus. |
| F-2 / D-1 (Overflow der Migration) | hoch | **behoben**: Migration 0012 ist zurückgezogen. Sie war nie auf `main`, die Dev-DB steht auf 0011. |
| M-1 (Satz versandter Abrechnungen umgeschrieben) | hoch | **behoben.** Die Spalte bleibt. PDF (`feeBasis`, `feeKeyOf`) und Detail (`CostTable.svelte:74-79`) sind wieder auf dem Stand vor 1625225 (Diff `1625225^..bebb4cd` ohne inhaltliche Änderung). Ausnahme: der gelöschte Schlüssel, siehe R3-3. |
| V-2 (andere Grundlage oder anderer Satz im Vertrag) | hoch | **teilweise behoben, Rest festgehalten.** Der Hilfetext ist ausführbar: «löschen Sie danach seinen Entwurf …». Andere Grundlage und fester Betrag stehen in `offene-punkte.md`, «Session 12», 1. Punkt, mit `TODO(fachlich prüfen)`. Den vorgeschlagenen Satz «Geben Sie 0 ein und klären Sie die Pauschale ausserhalb von Dwello» gibt es im Assistenten nicht (siehe R3-10). |
| F-3 / D-2 (Satz nicht nachrechenbar) | mittel | **behoben** durch den Rückzug von 0012. |
| F-4 / D-3 («Infinity %») | mittel | **behoben**: Der Ersatzsatz im PDF ist auf `subtotal > 0` geschützt und gerundet (`statement-pdf.service.ts:127`). Nur der Schutz ist ungetestet (R3-9). |
| F-5, 1. Teil (Schlüssel gelöscht, `ON DELETE SET NULL`) | mittel | **weder behoben noch festgehalten**, siehe R3-3. |
| F-5, 2. Teil / V-3 (Entwürfe mit Schlüssel) | mittel | **festgehalten**: `offene-punkte.md:240` (löschen und neu erstellen). |
| F-6 (Test der Migration) | mittel | entfällt mit 0012. |
| M-2 (Heizungsverwaltung) | mittel | **festgehalten**: `offene-punkte.md:239`. Der vorgeschlagene Hilfetext «Buchen Sie dafür keine eigene Rechnung» fehlt, ebenfalls nur festgehalten. |
| Sven Blocker (Dezimalwerte verfälscht) | Blocker | **behoben**: Textfeld mit `inputmode="decimal"`, «4,5» bleibt «4,5» und geht als 4.5 an den Server (live geprüft). |
| Sven Major (Hinweis über 3 % nicht angesagt) | Major | **behoben**: Der Hinweis steht in `role="status"`. Live ist der Accessibility-Tree «status: Über dem üblichen Richtwert …». Rest siehe R3-8. |
| Sven Major / Weber Minor / Marco Minor (Vorschau ohne Pauschale und Heizprofil) | Major | **behoben** (`PreviewStep.svelte:59-70`). |
| Sven Major (leeres Feld wird 0) | Major | **behoben im direkten Weg; im wiederhergestellten Entwurf nicht**, siehe R3-1. |
| Sven Major (Minus verschluckt) | Major | **behoben**: «-1» bleibt stehen, bei «Weiter» kommt die Fehlermeldung. |
| Sven Vorschlag (Rückfrage bei Weiter über 3 %) | Blocker-Vorschlag | nicht umgesetzt und nicht festgehalten. Durch Hinweis und Vorschau gemildert, siehe R3-10. |
| Marco Major (Widerspruch «bis 3 %» / «keine Obergrenze») | Major | **weder behoben noch festgehalten**, siehe R3-4. |
| Marco Major (keine Vertragsgrundlage für die Pauschale) | Major | **festgehalten**: `offene-punkte.md:239`, «persona Marco F». |

**Vorbestehend, ohne Bezug zur Pauschale.** Weder behoben noch in «Session 12» festgehalten; zum Teil stehen sie in `offene-punkte.md:230` (Lauf Session 11):
- «Anteil» auf der Detailseite rundet anders als das PDF (28.23/28.24 %, 24.36 %). Marco Major, Weber Minor; in `offene-punkte.md:230` erwähnt.
- «Als versendet markieren» ist der gefüllte Hauptknopf im Entwurf (Marco Major). Die Aktion öffnet seit D17 einen Bestätigungsdialog, das Risiko ist also gemildert.
- Die Fehlermeldung steht in `aria-describedby` hinter dem langen Hilfetext (Sven Minor).
- Weitere Minor-Punkte:
  - der Heizprofil-Text ist lang;
  - «Entwurf gespeichert» meint den Zwischenstand, nicht einen Entwurf;
  - die Statuszahlen der Liste ignorieren den Gebäudefilter;
  - nach dem Sprunglink liegt der Fokus auf `main`;
  - Schritt 2 sagt nicht, dass ein Gebäude schon abgerechnet ist;
  - die Zeitzone im Verlauf;
  - die Silbentrennung im Stepper;
  - die Vorauswahl des Heizprofils.

## 2. Findings

| # | Schwere | Ort | Fehler | Behebung |
|---|---|---|---|---|
| R3-1 | mittel | `src/lib/statement-wizard.ts:34`, `src/routes/statements/generate/SettingsStep.svelte:42-46`, `StatementWizard.svelte:194`, `+page.server.ts:47` | **Ein leeres Feld wird über den Entwurf wieder zu 0 %.** `typeFee('')` setzt `NaN`. Der Entwurf speichert `JSON.stringify(NaN)` = `null`; in der Probe gespeichert: `"managementFeePercent":null`. Nach dem Neuladen oder nach einer Rückkehr zum Assistenten stellt `restoredSelection` `null` wieder her. Die Prüfung `!(null >= 0)` ist `false`, weil `null >= 0` `true` ist. «Weiter» geht also ohne Fehlermeldung zum Server («Vorschau wird berechnet …»). Das verborgene Feld schickt `""`, `Number("")` = **0**. Vorschau und Entwürfe rechnen still ohne Pauschale. Die Vorschau zeigt dann « % der eigenen Nebenkosten jedes Mieters», ohne Zahl. Das ist Svens Major «geleertes Feld wird stillschweigend 0» auf einem Umweg. Ebenso nach «abc» oder «Infinity» im gespeicherten Entwurf. | In `settingErrors` auf `typeof p === 'number' && Number.isFinite(p) && p >= 0` prüfen. Das deckt `null`, `NaN` und `Infinity` ab. Zuerst ein DOM-Test: Entwurf mit `managementFeePercent: null` schreiben, bis Schritt 3, «Weiter» zeigt «Bitte geben Sie einen Prozentsatz ab 0 ein …». Optional verwirft `generationRequest` ein leeres Feld (400) statt 0 daraus zu machen. |
| R3-2 | mittel | `src/routes/config/+page.svelte:93` (`type="number"`) | **Die Einstellungen haben noch den Fehler, den bebb4cd im Assistenten behoben hat.** Live in Chromium (de-CH): Im Feld «Verwaltungspauschale in %» wird aus «2,5» der Wert **«25»**. Gespeichert wird 25, und der Assistent schlägt danach in jedem Lauf 25 % vor. Hinweis und Vorschau zeigen das zwar, aber der Fehler entsteht ohne Rückmeldung. Er sitzt an der Stelle, von der der Vorschlag kommt. Assistent und Einstellungen verhalten sich bei derselben Eingabe verschieden. | Das Feld wie im Assistenten als Text mit `inputmode="decimal"`. `settingsErrors` (`src/lib/server/settings.ts:43`) liest dann `replace(',', '.')` und meldet Unlesbares. Test in `config-pages.test.ts`: «2,5» wird als 2.5 gespeichert. |
| R3-3 | mittel | `backend/src/services/distribution-key.service.ts:276-290`; Folge in `statement-pdf.service.ts:195` und `src/lib/server/statement.ts:48` | **Der 1. Teil von F-5 ist weiter offen und nicht festgehalten.** Wird ein eigener Schlüssel gelöscht, der nur für die Pauschale angelegt war (0 Rechnungen, also löschbar), setzt `ON DELETE SET NULL` den Bezug der Abrechnung auf NULL. Danach druckt das PDF «3 % der Zwischensumme von CHF y», und das Detail zeigt «3 % der Zwischensumme». Der Betrag stammt aber aus dem Schlüssel: 3 % × y ≠ Pauschale, und bei einer versandten Abrechnung ändert sich die gedruckte Grundlage. Das widerspricht M-1, dem Grund für den Rückzug von 0012. Seit der Schlüssel für die Pauschale nicht mehr wählbar ist, wirkt ein solcher Schlüssel in den Einstellungen unbenutzt und wird eher gelöscht. `offene-punkte.md:23/240` behauptet: «keep their basis». Das stimmt in diesem Fall nicht. | `deleteDistributionKey` verweigert das Löschen, solange eine Abrechnung den Schlüssel als `management_fee_distribution_key_id` nennt (Meldung wie bei Rechnungen: «… ist die Grundlage der Verwaltungspauschale von N Abrechnungen»). Zuerst ein pg-Test. Oder bewusst offen lassen und in «Session 12» festhalten. |
| R3-4 | mittel | `src/routes/config/help.ts:9`, `src/routes/help/Glossary.svelte:33`, `SettingsStep.svelte:89` | **Drei Aussagen zu den 3 %.** Einstellungen: «3 % ist der übliche Richtwert, keine Obergrenze». Glossar: «üblich sind 3 %». Assistent: «Üblich sind bis 3 %». Marco (Major) und Weber (Minor) haben gerade das bemängelt: «Ist 3 % nun eine Obergrenze oder nicht?» bebb4cd hat in denselben Sätzen nur die Grundlage angepasst. In `offene-punkte.md` steht nichts dazu. | Eine Formulierung an allen drei Stellen, z. B. «Üblich sind bis 3 %; ein höherer Satz muss im Mietvertrag vereinbart und begründet sein» (fachlich prüfen, Merkblatt: «Mehr als 2 bis 3 % brauchen Mieter nicht zu akzeptieren»). Ein Test, der den gleichen Satz in Hilfe, Einstellungen und Assistent prüft. Oder als offen festhalten. |
| R3-5 | niedrig | `SettingsStep.svelte:45` (`Number(text.replace(',', '.'))`) | `Number()` liest mehr als Dezimalzahlen. In der Probe: «1e2» → 100, «0x1F» → 31, «Infinity» → Infinity. Diese Werte gelten als gültig, und der Hinweis über 3 % erscheint. Infinity besteht die Prüfung im Browser; der Server lehnt den Wert ab (JSON `null`, `t.Number`), und der Nutzer sieht eine allgemeine Fehlermeldung. «3 %» (mit dem Zeichen aus dem Label) und «1'000» sind NaN und werden richtig als Fehler gemeldet. Die Meldung sagt aber nicht, dass «%» nicht dazugehört. | Mit `/^\s*\d+(?:[.,]\d+)?\s*$/` lesen, sonst NaN. Damit fallen auch R3-1 (Infinity) und R3-6 weg, wenn höchstens 2 Nachkommastellen erlaubt sind. Ein «%» am Ende darf man abschneiden. |
| R3-6 | niedrig | `SettingsStep.svelte:45`, `backend/src/services/statement.service.ts:308` | D-4 aus der Fachreview ist nicht behoben und nicht festgehalten. Im Textfeld tippt man jetzt leichter mehr Stellen. Bei «2,555» schickt das verborgene Feld 2.555, und die Vorschau zeigt «2.555 %». Gerechnet wird mit 2.555, gespeichert und gedruckt 2.56 % (DECIMAL(5,2)). Das PDF lässt sich dann nicht nachrechnen. | Im Assistenten höchstens 2 Nachkommastellen zulassen (siehe R3-5), oder im Backend vor der Rechnung auf 2 Stellen runden. |
| R3-7 | niedrig | `SettingsStep.svelte:42` | Getippt «2,5», dann «Zurück» und wieder «Weiter»: Im Feld steht jetzt «2.5». Der Text wird beim neuen Montieren aus der Zahl gebildet. Der Wert bleibt richtig (Probe: verborgenes Feld `2.5`); nur die Schreibweise wechselt. | Hinnehmbar. Oder beim Zurückkehren mit Komma schreiben (`String(x).replace('.', ',')`), wenn man das Komma als Schweizer Schreibweise will. Dann aber auch Vorschau und Detail angleichen, die überall «2.5 %» zeigen. |
| R3-8 | niedrig | `SettingsStep.svelte:95-104` | Die Live-Region ist in Ordnung. Ein immer vorhandenes, leeres `role="status"` beanstandet axe nicht. `status` ist implizit `aria-atomic`, angesagt werden Titel und Text der Alert. `Alert` mit `tone="caution"` hat keine eigene Rolle, also keine verschachtelte Live-Region. Live geprüft: Der Tree zeigt `status` mit beiden Absätzen. Lücke: Steht der Satz schon beim Öffnen von Schritt 3 über 3 % (Vorschlag aus den Einstellungen, z. B. 25 % nach R3-2, oder nach Zurück/Weiter), entstehen Region und Inhalt zugleich. Die meisten Screenreader sagen dann nichts an. Das Feld verweist nicht per `aria-describedby` auf den Hinweis. | Die id des Hinweises in die Beschreibung des Felds aufnehmen. `TextInput` bzw. `Field` brauchen dafür eine zusätzliche `describedBy`. Oder es in Kauf nehmen, weil die Vorschau den Satz jetzt nennt. |
| R3-9 | niedrig | Tests | Die Tests prüfen Verhalten und scheitern ohne den Fix, mit vier Lücken: (a) `statement-wizard.dom.test.ts:227` setzt den Satz über `defaultManagementFeePercent`. Eine Vorschau, die fälschlich den Vorschlag statt der Eingabe aus Schritt 3 zeigte, bliebe grün. Den echten Weg deckt nur das E2E-Szenario ab. (b) `statement-pdf.pg.test.ts:236` akzeptiert mit `[\d'.]+` jeden Betrag. Dass die Grundlage die Summe der Positionen ist, prüft der Test nicht, obwohl er es im Namen sagt. (c) Den Schutz `subtotal > 0` (früher «Infinity») prüft kein Test. (d) Den Entwurf mit leerem Feld (R3-1) prüft kein Test. | (a) In Schritt 3 «2,5» tippen, die Antwort des Servers spielen, dann `preview-fee` prüfen. (b) Den erwarteten Betrag aus `lineItems` rechnen. (c) Ein Unit-Test in `statement-pdf-data.test.ts` mit `managementFeePercent: null` und Zwischensumme 0. (d) siehe R3-1. |
| R3-10 | niedrig | `SettingsStep.svelte:89`, `PreviewStep.svelte:68`, `CostTable.svelte:78` | Begriffe. «eigene Nebenkosten jedes Mieters» steht in Assistent, Vorschau, Hilfe und Einstellungen. «Zwischensumme» steht in Detail und PDF. Die Brücke aus V-4 und den Minor-Punkten von Weber und Sven fehlt: «(Zwischensumme seiner Abrechnung)». Ebenso fehlen der Satz für Verträge mit anderer Grundlage («Geben Sie 0 ein …», V-2) und der Hinweis zur Heizungsverwaltung (M-2). Beides steht nur in `offene-punkte.md`. Svens Vorschlag, bei «Weiter» über 3 % nachzufragen, ist weder umgesetzt noch festgehalten. | Im Hilfetext des Felds «… der eigenen Nebenkosten jedes Mieters (Zwischensumme seiner Abrechnung) …». Die beiden Sätze aus der Fachreview aufnehmen oder in «Session 12» begründen, warum nicht. Die Rückfrage als bewusst nicht umgesetzt festhalten, weil die Vorschau den Satz nennt. |
| R3-11 | niedrig, vorbestehend | `CostTable.svelte:75-76` | Ältere Abrechnung mit Schlüssel. Das Detail sagt «3 % der Nebenkosten der Liegenschaft, verteilt nach dem Verteilschlüssel, Anteil dieser Wohnung für 366 Mietstage». Das PDF sagt «3 % von CHF X, verteilt nach Pro Fläche (m²)», mit den Tagen nur bei einem Teiljahr. Die Aussage ist dieselbe; das Detail nennt aber weder den Betrag der Grundlage noch den Namen des Schlüssels. Der Text ist unverändert wie vor 1625225, also gleich wie zur Zeit des Versands. | Hinnehmbar. Wer es angleichen will: Den Namen des Schlüssels und die Summe der Positionen auch im Detail zeigen. |

## 3. Geprüft ohne Befund

- **Bindung in Svelte 5:**
  - `bind:value={() => feeText, typeFee}` reicht über die `$bindable`-Prop von `TextInput` durch; `svelte-check` meldet nichts.
  - `$state` wird aus der Prop nur beim Montieren gelesen. Das ist hier richtig, weil `SettingsStep` nur in Schritt 3 montiert ist (`StatementStep.svelte`, `{#if step === 3}`).
  - Ein Entwurf wird in `onMount` wiederhergestellt, bevor Schritt 3 erscheint; auch beim Rücksprung mit `?schritt=3` setzt `onMount` zuerst `selection`, dann `step`.
  - «Entwurf verwerfen» führt zu Schritt 1 und montiert das Feld ab.
- **Verborgenes Feld:** In der Probe:
  - «2,5», «2,50» → `2.5`;
  - «3.», « 3 » → `3`;
  - «3,5,1» → `NaN` → Fehlermeldung;
  - «-1» → Fehlermeldung «ab 0»;
  - «1000» → gültig, Hinweis; am Server dann der bekannte Overflow (F-11, festgehalten).
- **Vorschau:** «4.5 % der eigenen Nebenkosten jedes Mieters» mit dem Dezimalpunkt. So schreibt Dwello Prozente überall (Detail, PDF, «Anteil»). Das ist stimmig, auch wenn das Komma getippt wurde. Das Heizprofil wird mit dem deutschen Namen genannt (`germanName`).
- **Ältere Abrechnungen mit Schlüssel:**
  - `feeBasis`, die Übersetzungen `feeBase`, `feeKey` und `feeDays` (de/fr/it/en) sowie `managementFeeBase` (Summe der Positionen) sind wörtlich wie vor 1625225. Ein neu erzeugtes PDF zeigt also, was versandt wurde.
  - Neue Abrechnungen setzen die Spalte nie (`schema.ts:345` ohne Schreibstelle in `statement.service.ts`).
  - Der API-Contract enthält `managementFeeDistributionKeyId`, `api-contracts.pg` ist grün.
- **Ersatzsatz:** Frontend (`statement.ts:22-25`) und PDF (`statement-pdf.service.ts:125-129`) runden gleich auf 2 Stellen und schützen gleich gegen eine Zwischensumme ≤ 0.
- **Tests:**
  - Der DOM-Test «verlangt einen Satz …» scheitert auf dem alten `type="number"`: Dort wird «» zu 0 und «2,5» zu leer.
  - Das E2E-Szenario «Pauschale mit Dezimalstellen eintippen» tippt Zeichen für Zeichen und scheitert auf dem alten Stand: «4,5» → 45, «4.5» → 54.
  - `announcedFeeHint` verlangt, dass der Hinweis in einem `status` steht.
  - Der Test «druckt den Satz älterer Abrechnungen auf zwei Stellen gerundet» scheitert ohne die Rundung (93.99 / 2'943.86 = 3.1928… %).
  - Der pg-Test der früheren Abrechnung scheitert ohne `feeKeyOf`.
  - `toHaveAccessibleName('Heizprofil')` schliesst einen Teil von F-7.
- **Migration:** 0012 ist entfernt. `migrate.ts` verlangt `db:reset` nur für Datenbanken, auf denen 1625225 lief. Der Commit war nur auf `claude/relaxed-ride-tciycq`, die Dev-DB `dwello` steht auf 0011.
- **Dokumentation:** `data-model.md`, `seed-daten-aenderungen.md` (P8) und `offene-punkte.md` («Session 12», Zeile 23) beschreiben den neuen Stand. Ausnahme ist die Aussage «keep their basis» (R3-3).
