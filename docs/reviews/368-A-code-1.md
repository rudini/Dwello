# Code-Review #368, Slice A (Folgevertrag übernimmt vereinbarte Nebenkosten), Runde 1

Bereich: `git diff 00d95ad2 c46c71e5 -- . ':!docs/reviews' ':!implementation_plan.md'`, Worktree `review-368-A-1` (c46c71e5).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/contracts/new/ContractWizard.svelte:71-78, 128-141 (`restoreDraft`), src/lib/contract-wizard.ts:242-243 | Ein gespeicherter Entwurf überschreibt die übernommenen Häkchen: `restoreDraft` setzt `values = startValues(...)` = `{...initialContractValues(...), ...draft}` ohne `agreed`. Ein Entwurf ohne `agreedCategoryIds` hakt wieder alle umlagefähigen Kategorien an, einer mit eigener Liste setzt dessen Häkchen. In beiden Fällen sagt die Hilfe trotzdem «Dwello hat die vereinbarten Nebenkosten … übernommen». |
| C-2 | Major | src/routes/contracts/[id]/NextSteps.svelte:38-40 | Die gleichlautende Aktion «Neuen Mietvertrag für {name} erfassen» auf der Detailseite des gekündigten Mietvertrags verlinkt weiter auf `/contracts/new?tenant={tenantId}` ohne `from`. Damit beginnt der Folgevertrag desselben Mieters wieder mit allen angekreuzt, also gegen den Entscheid (a) und gegen Regel 12 in der neuen Fassung. |
| C-3 | Major | tests/a11y/screens.json:325-345, accessibility.feature, sprachen-bildschirme.feature | Der neue Zustand (Schritt «Miete» des Assistenten als Folgevertrag mit `contracts_agreed_costs_help_follow_up`) fehlt. Für die gleichartige Variante dieses Schritts gibt es mit `rent-taken-over` einen eigenen Zustand. Deshalb prüft kein Test, dass fr/it/en hier kein Deutsch zeigen. |
| C-4 | Minor | UBIQUITOUS_LANGUAGE.md:56 | Die Glossarzeile «Vereinbarte Nebenkosten» sagt weiter «Ein neuer Mietvertrag beginnt mit allen umlagefähigen Kategorien angekreuzt». Regel 12 nennt jetzt die Ausnahme, das Glossar widerspricht ihr (Fachreview V-4 verlangt beide). Wenn die Zeile nach CLAUDE.md nicht geändert werden darf, weil der Entscheid sie nicht nennt, gehört das als Hinweis in den PR. |

## C-1 (Major): Ein Entwurf hebt die Übernahme auf

- Warum falsch: Ein Entwurf bleibt in `localStorage`, bis der Vertrag gespeichert oder der Entwurf verworfen wird. `restoreDraft` läuft in `onMount` immer, auch wenn die Adresse `tenant`/`start`/`from` nennt; aus der Adresse übernimmt es nur Mieter, Wohnung und Beginn. Wer früher einen Mietvertrag angefangen und nicht beendet hat, bekommt beim Folgevertrag deshalb wieder alle Kategorien angehakt (`ticked(undefined, …)` = alle). Das ist genau der Fehler, den #368 (a) beheben soll: Ausgeschlossene Nebenkosten kommen zurück. Die Hilfe sagt dazu fälschlich, Dwello habe die Liste übernommen. Ein Verwalter, der der Hilfe glaubt, prüft die Häkchen nicht. Bei einem Entwurf mit eigener `agreedCategoryIds` gelten die Häkchen eines anderen Vertrags.
- Nachweis (DOM-Test, wie `contract-wizard.dom.test.ts:786`): `writeDraft(localStorage, 'contract', { tenantId: 't1' }, new Date())`, dann `show(NewContractPage, { data: { ...data, categories, agreed: ['k1'] } })`, bis Schritt 4 gehen. Ergebnis: `contract-category-k2` ist `checked === true`, `#agreed-costs-help` zeigt den Folgevertrags-Text.
- Richtung: `agreed` auch beim Wiederherstellen anwenden, mindestens wenn der Entwurf keine `agreedCategoryIds` hat. Ob ein Entwurf mit eigener Liste vorgeht, ist offen: Er kann aus diesem Folgevertrag stammen oder aus einem fremden Versuch. Der Test oben fehlt.

## C-2 (Major): Der zweite Weg zum Folgevertrag übernimmt nichts

- Warum falsch: Nach einer Kündigung zeigt die Detailseite unter «Nächste Schritte» den Button `m.contracts_new_for_tenant({ name })`. Es ist derselbe Text wie beim Link in `ContractForm.svelte:303-307`, und auch dieser Weg erfasst einen neuen Mietvertrag desselben Mieters aus dem bisherigen. Regel 12 (neu) sagt: «ausser einer, den der Liegenschaftsverwalter aus dem bisherigen Mietvertrag desselben Mieters erfasst: Er übernimmt dessen vereinbarte Kategorien». Für denselben Text verhält sich die App also je nach Ort verschieden, und über die Detailseite kommen ausgeschlossene Nebenkosten zurück.
- Nachweis: Den Mietvertrag von «Anna Keller» kündigen, «Lift» nicht vereinbart, die Detailseite öffnen, in «Nächste Schritte» «Neuen Mietvertrag für Anna Keller erfassen» wählen und bis «Prüfen» gehen. «Vereinbarte Nebenkosten» nennt «Lift». Die Adresse enthält kein `from` (`NextSteps.svelte:39`).
- Richtung: `&from={contractId}` auch dort anhängen (der Button steht auf der Seite dieses Vertrags), mit DOM-Test für den href. Wenn der Aufrufer diesen Weg bewusst ausnimmt, braucht das eine Begründung im PR, und Regel 12 muss enger formuliert werden.

## C-3 (Major): Neuer Zustand fehlt in den a11y- und Sprachprüfungen

- Warum falsch: CLAUDE.md, «Process»: Jeder neue Zustand gehört in `screens.json` (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`. Der Schritt «Miete» mit übernommener Liste und eigenem Hilfetext ist ein solcher Zustand, gleichartig wie `rent-taken-over` (`screens.json:76`, Abfrage `:354`). Ohne ihn prüft keine Sprachprüfung, ob die neuen Texte in fr/it/en ankommen.
- Nachweis: `grep -n "from=\|follow" tests/a11y/screens.json` findet nichts. Die Liste `contract-new` (`screens.json:327-342`) hat keinen solchen Zustand.
- Richtung: Einen Zustand (z. B. `agreed-costs-follow-up`) mit Abfrage `?tenant=…&start=…&from={contract}` und Bedeutung eintragen, dazu je eine Zeile in beiden Features.

## Nicht bestätigt

- `bun run lint`, `bun run check`, die ganze vitest-Suite (3656) und das Szenario «Der neue Mietvertrag übernimmt die vereinbarten Nebenkosten» in Chromium: vom Aufrufer gemeldet. Selbst nachgeprüft habe ich nur `contract-new-load.test.ts`, `contract-wizard.dom.test.ts` und `contract-edit.dom.test.ts` (112 bestanden).
- Ob die neuen Tests und das Szenario ohne die Änderung rot sind, habe ich nur durch Lesen beurteilt: Ohne `agreed` ist `k2` angehakt, `load` liefert kein `agreed`, der href enthält kein `from`, und die Prüfung nennt «Lift». Alle wären rot. Laufen lassen habe ich sie nicht.
- Fachreview V-5 (offene Kategorien des alten Vertrags werden beim Folgevertrag stillschweigend «Nicht vereinbart», `agreed-category.service.ts:44-56`) bleibt laut Aufrufer Minor. Ich habe es nicht erneut bewertet.

Geprüft: Ein `from` mit unbekannter Id oder Fehlerantwort ergibt `agreed: null` und damit das bisherige Verhalten (alle angekreuzt). Eine leere Liste `[]` ergibt keine Häkchen und die Folgevertrags-Hilfe, wie es Entscheid (a) will. Ein `from` eines anderen Mieters ist nur über eine von Hand gebaute Adresse erreichbar (Einzelbenutzer, Backend mit eigenem JWT, kein Datenleck). Nicht mehr umlagefähige Kategorien filtert `agreedCategoryIds` im Backend heraus. Die vier `messages/*.json` sind vollständig. Das Szenario folgt den Screenplay-Schichten (nur vorhandene Steps). Der Contract `tests/contracts/contract.json` wird verwendet. Der Diff enthält nichts, was nicht zur Anforderung gehört.
