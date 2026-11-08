# Code-Review #1158, Runde 1 (5af16a0..a9a51fe)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/__tests__/ui-layout-parts.dom.test.ts:326-333 | Der Test «auf den Seitentitel, wenn es keinen Schritt gibt» prüft `document.activeElement!.textContent` statt des Elements. Ohne die Änderung landet der Fokus nach dem Schliessen auf `body`. Die Meldung ist dann entfernt, und im Body steht nur noch das eingefügte `<h1>Mieter</h1>` und die leere ToastRegion. `body.textContent` kann dann ebenfalls `'Mieter'` sein. Ob der Test ohne den Fallback auf `h1[tabindex="-1"]` rot wird, hängt also davon ab, ob Svelte einen Leerzeichen-Knoten in die Region rendert. Ein Vergleich `toBe(document.querySelector('h1'))` würde den Fallback eindeutig festhalten. Der Test daneben («auf den Schritt …») ist eindeutig rot, weil der Body dort «Neuer MietvertragWohnung» enthält. |

Geprüft: Alle drei Punkte der Entscheidung vom 2026-11-08 im Issue gelesen (per REST).
- Punkt 1: ToastRegion merkt sich den Fokus, bei Bestätigungen nach `refocus()` und 500 ms, bei Fehlern sofort. Ist das Element weg, geht der Fokus an `#step-heading` oder das `h1` von PageHeader. Abgedeckt durch DOM-Tests für success, error und warning sowie das neue Szenario.
- Punkt 2: Der Wortlaut in allen vier `messages/*.json` entspricht wörtlich 1158-fachreview-1, fr mit U+00A0 vor «;». Er ist in i18n.test.ts und im DOM-Test festgehalten. Der geänderte Schritt in contract-new.feature:155 ist durch Punkt 2 freigegeben.
- Punkt 3: Die Bedingung im `$derived` greift. Der neue DOM-Test ist ohne die Änderung rot. Die Schritte in den beiden Szenarien (feature:93, 101) hat Punkt 3 der Entscheidung wörtlich freigegeben; sonst ändert sich in diesen Szenarien nichts. `Grundlage` gelesen: «2.01» ist frei, Anna Keller existiert.
- E2E-Schichten: Die Schritte rufen nur Tasks und Questions auf. Die Count-Question liefert eine Zahl. Die negative Prüfung folgt auf eine positive Prüfung des Zustands im Schritt. Die Task mit der Tastatur wartet, bis die Meldung weg ist. Beide neuen Szenarien sind ohne die Änderung rot.
- Keine Änderung an screens.json nötig: Es gibt keinen neuen Zustand und keine neuen Bedienelemente. «apartment-cleared» existiert, und sein `endedTenant` hat keinen Mietvertrag ohne Vertragsende.
- Keine fachfremden Änderungen im Diff. Keine Tokens oder neuen Texte ausser dem einen Schlüssel.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness` und backend `type-check`. Ebenso `bunx vitest run --changed origin/main` (731 Tests), dazu open-work.test.ts und contract-wizard.dom.test.ts. Ausserdem E2E contract-new.feature (58 bestanden, auf dem Stand vor dem letzten Refactoring) und die 7 Szenarien nach der Änderung an ToastRegion.
- Ob C-1 ohne die Änderung tatsächlich grün bleibt: Ich habe keinen Test laufen lassen. Die Aussage stützt sich auf die Markup-Struktur von ToastRegion.svelte:135-148 und auf den Body-Reset in src/__tests__/helpers/dom.ts:16-19.
- Ob die Pull-Request-Beschreibung `Spec change approved: #1158` enthält: Es gibt noch keinen Pull Request.
- Der Ausdruck `/^Schritt 2 von \d: Wohnung$/` in contracts-retry.steps.ts:101 hängt vom Text in `contracts_step_of` und von den Leerzeichen in der `<h2>` ab. Ich habe nur nachgesehen, dass der Aufrufer das Szenario als bestanden meldet.
