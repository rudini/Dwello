# Code-Review #241 (mit #239), Runde 2 (nur Delta)

Geprüft wurde der Worktree `review-241-code2`, Delta `git diff 3ae2b1d6 9cade5b6` (Commit 9cade5b6). Gelesen habe ich alle 13 geänderten Dateien: den Code, die Tests und das Feature vollständig, die Plan- und `offene-punkte.md`-Zeilen ebenfalls. Bei den neuen Berichten (`241-review-1.md`, `241-fachreview-2.md`, `241-datenpruefung-1.md`, `dr-weber-241.md`) habe ich nur den geprüften Commit und die Zeilen gelesen, die der Plan aus ihnen übernimmt. Grundlage: die Befunde C-1 bis C-7 aus Runde 1 und die Anforderung von #239, wie sie im Auftrag steht.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-8 | Minor | `implementation_plan.md:28-34` | Mit #239 kommen neue Texte im PDF in vier Sprachen dazu, mit einem Fachbegriff («Veränderung Tankbestand»). Der Plan nennt dafür keine Feature-Review: Fachprüfung, Dr. Weber und Datenprüfung haben 3ae2b1d6 geprüft, also den Stand ohne `partStock`. Die Zeile zum Pull Request sagt nur `Fixes #241`, nicht auch `Fixes #239`. |

## Status der Befunde aus Runde 1

- **C-1 (Major): behoben.**
  - Die Kette ist vollständig: `fuelStockChange` setzt `fuelStock: true` (`fuel-stock.service.ts:98`). Über `...invoice.inPeriod` landet die Markierung in der Gruppe (`calculation.service.ts:119`). Der Typ `InvoiceGroup` lässt sie zu (`:88`), und `daysOf` übernimmt sie in `invoice_parts` (`:163`).
  - `partText` prüft `fuelStock` als Erstes (`pdf.service.ts:676`).
  - Der pg-Test «nennt die Veränderung des Tankbestands unter einer Heizposition nach Tagen als solche» zeigt den Text. Er prüft auch, dass die Zeile nicht mehr «Leistungszeitraum 01.01.2025 – 31.12.2025» heisst.
  - Der Render-Test prüft alle vier Sprachen.
  - Das Szenario steht ohne `@wip`. Seine Schritte gibt es schon (`statement-detail.steps.ts:58, 212`).
  - Die Begriffe stimmen: «Veränderung Tankbestand» (`UBIQUITOUS_LANGUAGE.md:135`) und fr/it/en «stock de combustible / scorta di combustibile / fuel stock» (`i18n-begriffe.md:75`). Kein Text nennt die Veränderung «Verbrauch».
- **C-2: behoben.** pg-Test `statement-pdf.pg.test.ts:199-201`. Der Plan meldet den Test als rot, wenn man den Code herausnimmt.
- **C-3: abgelehnt, mit Begründung.** Ich nehme die Ablehnung an. «Done means» verlangt nur das eine Szenario, und die tieferen Tests zeigen jede Beschriftung.
- **C-4: abgelehnt, mit Begründung.** Ich nehme die Ablehnung an. Der Mangel bestand schon vorher und steht unter U-26 und U-37.
- **C-5: behoben.** U-37 ist nachgeführt.
- **C-6: als O-33 erfasst.**
- **C-7: behoben.**

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht selbst wiederholt:**
  - Backend-Test: 680 pass, 0 fail.
  - type-check, lint, check.
  - test:coverage: 2606 passed.
  - fallow und deepcheck.
  - Das neue Szenario: rot ohne `partStock`, grün mit `partStock`.
  - Den pg-Test habe ich nicht selbst laufen lassen, also auch nicht, dass er ohne `fuelStock` rot ist (Plan Zeile 26).
- **Selbst wiederholt:** `bun test src/__tests__/statement-pdf-render.test.ts` in `backend/`: 40 pass, 0 fail. Darin enthalten sind die vier neuen Fälle in vier Sprachen und die angepasste Testvorlage (0.7338 / 512.08).
- **Begriffe in fr/it/en:** «Variation du» und «Variazione della» als Wort für «Veränderung» stehen nicht in `i18n-begriffe.md`. Ein Fachreviewer hat sie nicht gesehen (siehe C-8).
- **Ohne Befund:**
  - `invoiceParts` steht in keiner API-Antwort, die das Frontend liest (`grep` in `src` und `tests/contracts` leer). Kein Vertrag ist betroffen.
  - Keine UI-Texte, also nichts in `messages/*.json` oder `screens.json`.
  - Kein E2E-Code ausser der Feature-Datei.
