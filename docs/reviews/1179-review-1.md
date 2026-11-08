# Code-Review 1179-1 (Runde 1)

Bereich: `git diff 75b78a9 cc77116` (a962fb5, cc77116), Worktree `review-1179-cr`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/ui/Stepper.svelte:28-29, 44-45 | Zwei Kommentare stimmen unter md nicht mehr. Z. 44-45: «with values at every width, the numbers without names». Z. 29: «with values … the names but one are hidden, so the words fit». Unter md zeigt die Liste jetzt auch mit Angaben alle Namen (`named()` setzt nur noch `md:sr-only`). Beide Sätze müssen auf «from md» eingeschränkt werden. |

Keine Blocker, keine Major.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run src/__tests__/ui-navigation-parts.dom.test.ts` (10 bestanden, der neue Test war vor der Änderung rot); E2E chromium `contract-new.feature` und `statement-generate.feature` (161 bestanden); E2E `-g "Schrittanzeige|Bildschirm ohne .*(contract-new|statement-generate)"` (109 bestanden, darin die axe- und Sprachzeilen beider Assistenten); beide neuen Szenarien in einem @wip-Lauf rot beim neuen Schritt; `bun run lint`, `bun run check`, `bun run fitness`, Backend type-check.
- Abnahmekriterium «no word broken and no sideways scrolling at 768 px» beim Mietvertrags-Assistenten: Kein Szenario prüft `contract-new` bei 768 px. «Die Schrittanzeige trennt keinen Namen eines Schritts» läuft dort nur bei 1440 (contract-new.feature:268-270). Nur der Abrechnungs-Assistent hat die Zeile 768 (statement-generate.feature:924-929). Ab md ändert sich laut Diff nichts: Die Klassen sind ab md gleich wie auf der Basis (`md:sr-only` plus `xl:not-sr-only` ersetzt `sr-only` plus `md:not-sr-only`/`xl:not-sr-only`). Darum ist es kein Befund. Ob tests/a11y bei «tablet» auch seitliches Scrollen prüft, habe ich nicht nachgesehen (tests/a11y/screens.json:1181).
- Ob Tailwind 4 die Varianten in der Reihenfolge `md:sr-only` vor `xl:not-sr-only` ausgibt, nehme ich wie üblich an (Breakpoints aufsteigend). Gebaut habe ich nichts. Die E2E-Läufe des Aufrufers bei 960/1280/1440 decken das ab.

Geprüft: Stepper unter md (`flex flex-col`, alle Namen sichtbar, der aktuelle Schritt markiert über `aria-current` und `font-bold`, Angaben der erledigten Schritte sichtbar) und ab md gleich wie die Basis, mit und ohne Angaben. Die DOM-Tests waren auf der Basis rot (`hidden`, `sr-only`, `md:sr-only` fehlte). Die Frage `ShownLines` liefert die Texte selbst, gruppiert nach Zeilen, und überspringt sr-only. Sie wäre auf der Basis rot gewesen (`ol` war `hidden`, also leer) und ebenso bei Namen in einer Reihe. Der Schritt ruft nur eine Frage auf. Die Features sagen, was der Verwalter will, ohne UI-Mechanik. Keine neuen Texte, keine neuen Zustände, keine Änderung an bestehenden Szenarien oder an ihren Schrittdefinitionen. Tokens, 48 px (`min-h-12`), nichts Unbenutztes, kein fremder Code (ponytail-review: schlank).
