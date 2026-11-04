# Fachreview #1088, Runde 1 von Schritt 5 (Feature-Review)

Gegenstand: `git diff origin/main d2b406d -- messages UBIQUITOUS_LANGUAGE.md docs tests/e2e/features tests/a11y` und die Bildschirme, die er ändert (Worktree review-1088-fach2, d2b406d). Gesetz: OR Stand 01.10.2026, VMWG Stand 01.10.2025 (Fedlex).

Geschlossen (aus 1088-fachreview-1): V-1, V-2, V-3, V-4, V-5 (Gleichstand in backend/src/__tests__/period-types.test.ts:25-31 festgehalten; nachgerechnet: am 03.11.2026 endete November – Oktober am 31.10.2026, nach Juli – Juni am 30.06.2026 und Kalenderjahr am 31.12.2025), V-6, V-7, V-8, V-9, M-1, M-2.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-10 | Verwalter, Mietrecht | Major | Tage einer eigenen Abrechnungsperiode, die eine ältere Abrechnung des Gebäudes nur teilweise abdeckt, kann Dwello nicht mehr abrechnen. Weder der Hinweis am Mietvertrag noch Schritt 2 des Assistenten sagt das. Der Hinweis verschwindet sogar, sobald der Teil abgerechnet ist. Die Akontobeiträge dieser Tage bleiben ohne Abrechnung. Braucht einen Entscheid. |
| V-11 | Verwalter | Minor | `buildings_period_locked` («… bleibt darum fest») gilt auch, wenn es nur Entwürfe gibt. Löscht der Vermieter sie, ist das Feld wieder frei (building.service.ts `hasStatement`, DELETE /statements/:id). Der Text verschweigt diesen einzigen Ausweg. Behebung: Satz ergänzen, siehe Tabelle (oder eine eigene Variante für den Fall «nur Entwürfe»). |
| V-12 | Verwalter | Minor | Zwei Szenarien sind entfernt: «Hinweis auf Rechnungen ohne Leistungszeitraum in einer Abrechnungsperiode unter einem Jahr» und «Von einer Rechnung ohne Leistungszeitraum zur Rechnung» (statement-generate.feature, origin/main:428 ff.). Dazu kommt #137 «Heizkosten einer Periode ohne Heizanteil». Die Prüfung `statements_whole_text` (PreviewChecks.svelte:127) bleibt aber erreichbar: Schritt 2 bietet die Periode einer älteren kurzen Abrechnung weiter an (V-1). Auch die Bedeutung von `invoice-hints` in screens.json («no periods under a year») ist falsch. Behebung: ein Szenario mit einer bestehenden Abrechnung 01.07.–31.12.2024 behalten, das die Prüfung festhält, und die Bedeutung korrigieren. |

## V-10: Tage, die Dwello stillschweigend nicht mehr abrechnet

- Beleg:
  - backend/src/services/accounting-period.ts:56-74 (`missingWays`): Überschneidet eine ältere Abrechnung des Gebäudes die fehlende Periode, gibt es nur noch den Weg «diese Abrechnungsperiode wählen» mit den Tagen darin. Für die übrigen Tage gibt es keinen Teil mehr.
  - `missingPeriods` (:44-50): Hat der Mietvertrag eine Abrechnung, die die Periode schneidet, fehlt die Periode nicht mehr.
  - contract-detail.feature, Szenario «Fehlende Tage in der Abrechnungsperiode eines anderen Mietvertrags»: Die Zeile `meldet … "01.07.2024 – 31.12.2024"` ist entfernt und durch nichts ersetzt.
  - statement-generate.feature:484: Die Wahl endet bei «Die gewählte Abrechnungsperiode überschneidet sich damit.» Das Gebäude lässt sich nicht wählen, und es gibt keinen Weg.
  - UBIQUITOUS_LANGUAGE.md:50 sagt, der Hinweis «nennt die Tage ohne Abrechnung». :175 definiert sie als alle Tage einer beendeten Periode, die keine Abrechnung des Mietvertrags abdeckt.
  - `contracts_statement_missing_partial` («Eine bestehende Abrechnung deckt nur einen Teil der Abrechnungsperiode ab; für {periods} gibt es noch keine Abrechnung.») nennt nur den Teil in der älteren Periode. Er erweckt den Eindruck, den Rest decke etwas ab.
- Nachgerechnet:
  - Beispiel 1 (das behaltene Szenario): Ahornhof im Kalenderjahr, Abrechnung von Ben 01.07.2023 – 30.06.2024, Anna Keller seit 01.04.2024. Anna hat in 2024 275 Mietstage. Der Hinweis nennt 01.04.–30.06.2024 (91 Tage). Für 01.07.–31.12.2024 (184 Tage) gibt es keinen Weg. Rechnet der Vermieter den genannten Teil ab, schneidet Annas Abrechnung die Periode 2024. Diese fehlt dann nicht mehr, und die 184 Tage verschwinden ohne Spur aus Hinweis und Erinnerung.
  - Beispiel 2 (statement-generate.feature:480-485): Lindenhof im Kalenderjahr, Eva und Marc mit 01.07.2023 – 30.06.2024. Den Lauf 2024 lehnt Schritt 2 ohne Weg ab. Je 184 Tage von Eva und Marc bleiben ohne Abrechnung.
  - Randfall ohne Lücke: Abrechnungen 01.07.2023 – 30.06.2024, 01.07.–31.12.2024 (kurz, alt) und 2025. Beide älteren Perioden bieten sich als Weg an, die Lücke ist null. Das ist richtig.
  - Wann entsteht der Zustand nach der Migration? Ein Gebäude wechselte die Einstellung. Die kurze Periode blieb liegen, die erste neue Periode ist abgerechnet. Die Migration gibt dann den neuen Typ (letzte ganze Abrechnung). Ebenso bei Abrechnungen aus #199, die eine Periode nur teilweise abdecken (z.B. 01.04.–30.09.2024).
- Warum falsch:
  - Art. 4 Abs. 1 VMWG (Stand 01.10.2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Art. 257b Abs. 1 OR (Stand 01.10.2026): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters …».
  - Die Akontobeiträge für 01.07.–31.12.2024 hat der Mieter bezahlt. Sie müssen mit den tatsächlichen Kosten verrechnet werden. Dwello macht das nicht und sagt es auch nicht.
  - Der Entscheid «keine kurzen Abrechnungsperioden» deckt ab, dass Dwello die Tage nicht abrechnet. Er deckt nicht ab, dass Dwello verschweigt, dass sie offen sind. Auch der Grundsatz «Fehler sagen, was zu tun ist» (CLAUDE.md, Copy) ist verletzt.
- Behebung (Entscheid PO, in #1088 nachtragen), eine von zwei Varianten:
  - (a) Der Hinweis am Mietvertrag und die Wahl in Schritt 2 nennen die übrigen Tage und sagen, dass Dwello sie nicht abrechnet und der Vermieter sie ausserhalb von Dwello abrechnet (Text in der Tabelle). Der Hinweis bleibt, bis «Abgerechnet bis» sie abdeckt. Die Zeilen 50 und 175 werden entsprechend angepasst.
  - (b) Eine Ausnahme für Lücken aus der Zeit vor #1088. Sie widerspricht dem Entscheid «keine kurzen Abrechnungsperioden».
  - Ohne Entscheid gehört der Punkt unter «Blocked on me».

## Texte

| key | de | fr | it | en |
|-----|----|----|----|----|
| contracts_statement_missing_uncovered (V-10, Variante a; auch für Schritt 2) | Für {periods} kann Dwello keine Abrechnung erstellen: Diese Tage liegen in keiner Abrechnungsperiode, die das Gebäude abrechnen kann. Rechnen Sie die Akontobeiträge dieser Tage ausserhalb von Dwello mit dem Mieter ab. | Dwello ne peut pas établir de décompte pour {periods} : ces jours ne tombent dans aucune période de décompte que l’immeuble peut décompter. Décomptez les acomptes de ces jours avec le locataire en dehors de Dwello. | Per {periods} Dwello non può allestire alcun conteggio: questi giorni non rientrano in nessun periodo di conteggio che l’immobile può conteggiare. Conteggi gli acconti di questi giorni con l’inquilino al di fuori di Dwello. | Dwello cannot create a statement for {periods}: these days lie in no billing period the building can bill. Settle the advance payments for these days with the tenant outside Dwello. |
| buildings_period_locked (V-11) | Für {building} gibt es schon Abrechnungen. Die Abrechnungsperiode bleibt darum fest. Solange es nur Entwürfe sind, können Sie diese löschen und die Abrechnungsperiode danach ändern. | Il existe déjà des décomptes pour {building}. La période de décompte ne peut donc plus être modifiée. Tant qu’il ne s’agit que de projets, vous pouvez les supprimer et modifier ensuite la période de décompte. | Per {building} esistono già dei conteggi. Il periodo di conteggio non può quindi più essere modificato. Finché si tratta solo di bozze, può eliminarle e poi modificare il periodo di conteggio. | There are already statements for {building}. The billing period therefore cannot be changed. As long as they are only drafts, you can delete them and then change the billing period. |

(Die Begriffe für Entwurf in fr/it/en habe ich nicht gegen docs/design/i18n-begriffe.md geprüft: vor der Übernahme abgleichen.)

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- Wie oft der Zustand von V-10 in bestehenden Installationen vorkommt (liegen gebliebene kurze Periode, Teilabrechnungen aus #199): nur in den Daten zu sehen. Nicht geprüft habe ich auch, ob die Erinnerung auf der Übersicht im Beispiel 2 für Lindenhof 2024 schweigt. Gelesen habe ich nur `missingPeriods`, nicht den Code der Übersicht.
- Die Übersetzung von «Entwurf» in der Tabelle (V-11) ist nicht mit i18n-begriffe.md abgeglichen.
- Ob für migrierte Gebäude, deren Periode jetzt von den Mietverträgen abweicht, ein Hinweis nach Art. 269d OR nötig bleibt: Das Feld ist gesperrt, und den Hilfetext aus M-2 sehen sie nie. Der Rat aus #486 wurde beim Wechsel gezeigt, also beurteile ich das Restrisiko als gering. Rechtlich offen wie in Runde 1 (**unsicher**, Art. 269d Abs. 3 OR ohne Wortlaut zum Periodenwechsel).

Geprüft: alle neuen und geänderten Texte in de/fr/it/en (buildings_period_locked, backend_building_period_locked, statements_period_proposed, help_invoices_3 mit «Verwaltungspauschale» = frais d’administration / spese amministrative / management fee, buildings_help_accounting_period, statements_building_other_period_*, glossary_period_text, buildings_period_*). Dazu die Glossarzeilen 50 (bis auf V-10) und 174, die Zeile in i18n-begriffe, die Migrationsregel in data-model.md, PRD und api-specification. Entfernte Szenarien für #199, #408, #486, #512, #521 und die Erinnerungen der Übersicht sind vom Entscheid gedeckt, ausser V-12. Geänderte Zeilen «Laufende Periode verlangt keinen Endbestand» und «Alle Gebäude lässt … aus» behalten ihr Verhalten. Gesperrte Wahl in Schritt 2 (`otherPeriod`) und Sperre bei jeder Abrechnung inkl. Entwurf (V-9) entsprechen dem Entscheid.
