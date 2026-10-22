# Code-Review 597-1 (562443c..4874c0f)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tests/e2e/features/sprachen.feature:24 (fehlt) | Sichtbare Verhaltensänderung (Bildschirm: Stockwerk −2 heisst auf de/fr/it neu «2. UG» / «2e sous-sol» / «2° piano interrato» statt «UG»; PDF: −1 heisst «UG» statt «1. UG», «Wohnung UG» auf −1 einmal) ohne Szenario. Die Begründung «No scenario: a name in PDF and on screens, render and unit tests show it» gehört zu keinem Fall in `tests/e2e/CLAUDE.md`, «No scenario». |

## C-1 (Major): Kein Szenario für eine sichtbare Änderung

`CLAUDE.md`, Workflow 1, verlangt für jede Verhaltensänderung, die ein Benutzer sieht, ein Szenario ohne `@wip`. `No scenario` gilt nur für Zustände, die der E2E-Stack nicht herstellen kann (`tests/e2e/CLAUDE.md:65-74`). Diese hier kann er herstellen:
- Bildschirm: `sprachen.feature:25-30` legt mit vorhandenen Steps schon eine Wohnung «im Stockwerk -2» an und fragt «nennt die Wohnung das Stockwerk "…"» (heute nur auf Englisch). Ein deutsches (oder französisches) Gegenstück mit «2. UG» schlägt auf 562443c fehl («UG»).
- PDF: «steht im PDF "…"» gibt es schon (`statement-agreed-costs.feature:127`, `statement-detail.feature:271`). Ein Szenario mit einer Wohnung «UG» im Stockwerk −1 und «steht im PDF "Wohnung UG, …"» und «steht im PDF nicht "1. UG"» schlägt auf 562443c fehl.
Ändern: ein Szenario (Bildschirm −2 auf Deutsch, dazu wenn möglich die PDF-Zeile für −1) ohne `@wip` ergänzen, oder eine Begründung nennen, die zu `tests/e2e/CLAUDE.md`, «No scenario», passt.

## Nicht bestätigt

- Render-Tests (145), statement-pdf pg (59), `vitest --changed` (333), lint, check, backend type-check: vom Aufrufer gemeldet, nicht wiederholt.
- Neu ausgeführt: `bunx vitest run` für apartment, buildings-i18n und building-register (69 grün).
- Rot vor der Änderung nur durch Lesen geprüft: die −1-Zeilen in PDF und UI, «UG» auf −1 und −2 in der UI schlagen auf 562443c fehl. Die −2-PDF-Zeilen nennt ffbde89 als festgehaltenes Verhalten. Die V-2-Zeilen («1. UG», «1er sous-sol» auf −1) sind auf der Basis schon grün und in der Commit-Nachricht nicht als festgehalten genannt. Ohne den Zweig `counted` in `namedByFloor` würden sie aber fehlschlagen, sie belegen also neuen Code.

Geprüft: `formatFloor` und `namedByFloor` (Widerspruch auf Stockwerk 1 bleibt über `counted(1)` = «1. UG»; «1. UG» auf −2 bleibt ein Widerspruch). Weitere Nutzer von `floorLabel`: `floorOptions` (Auswahl −1…6 plus aktuelles Stockwerk), ApartmentFacts, ApartmentCard und ApartmentsByFloor zeigen jetzt «2. UG». Der Vorschlag für die Wohnungsnummer aus dem Gebäuderegister (`src/lib/server/building-register.ts:81`) heisst auf −2 jetzt «2. UG» statt «UG 2»; ein eigener Test fehlt, `floorLabel` ist im Unit-Test abgedeckt. Kein «1. UG» für −1 mehr in Code, Texten oder Szenarien (nur in den V-2-Testzeilen und in Kommentaren). `apartments_floor_lower` und `apartments_floor_basement` sind in allen vier `messages/*.json` vorhanden, es gibt keine neuen Texte. Die Zeile «Stockwerk» in UBIQUITOUS_LANGUAGE.md steht wortgleich wie in Punkt 4. Die Tabelle in i18n-begriffe.md stimmt mit Punkt 1 überein. Keine neuen Bildschirme. Ponytail: kein Befund.
