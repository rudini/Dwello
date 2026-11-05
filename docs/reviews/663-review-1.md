# Code-Review #663, Runde 1 (Slice 663, b449bdc)

Geprüfter Bereich: `git diff 2603f03 b449bdc` (Merge-Base mit origin/main bis b449bdc, ohne `docs/design/personas`). Der genannte Bereich `origin/main..b449bdc` enthält zusätzlich die Umkehrung von Commits, die nach der Abzweigung auf `main` kamen (Header/Footer-Menü, LanguageSwitcher, navigation.feature, Reviews 656 …). Diese Änderungen stammen nicht aus dem Branch; sie verschwinden beim Merge von `main` vor dem Push.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | tests/e2e/steps/contract-detail.steps.ts:234-240 | Der geänderte Schritt prüft nicht mehr, welcher Entwurf geöffnet wird: Statt der genauen Adresse `statementPath(seed, tenant, year)` prüft er nur, ob «Anna Keller» und «2025» irgendwo im HTML stehen. Das trifft auch auf die Detailseite des Mietvertrags selbst zu. |
| C-2 | Major | src/lib/ui/Stepper.svelte:52-57 | Laut Entscheid zeigen erledigte Schritte ihren Wert sichtbar unter dem Häkchen. Umgesetzt ist das erst ab `xl` (1280 px). Auf Tablet und auf Laptops unter 1280 px sieht man weiterhin nur Häkchen. |
| C-3 | Minor | tests/e2e/steps/contract-detail.steps.ts:243-245 | «steht im Dialog zum Beenden noch der letzte Tag» besteht auch ohne die Änderung: `OpenInNewTab` klickt nicht, der Dialog wird also nie gefährdet. Was der Schritt behauptet, sichert in Wahrheit nur `target="_blank"` aus dem Schritt davor. |
| C-4 | Minor | tests/e2e/screenplay/questions.ts:336-337 | `OpenedPage` steht zwischen dem Doc-Kommentar von `OpenedFile` und `OpenedFile`. Über `OpenedPage` stehen damit zwei Doc-Kommentare, einer davon falsch («The file … its name and bytes»), und `OpenedFile` hat keinen mehr. |
| C-5 | Minor | src/__tests__/statement-wizard.dom.test.ts:602-603, tests/e2e/features/statement-generate.feature:878 | Den Wert der Verwaltungspauschale und den Namen des Heizprofils in der Zusammenfassung prüft kein Test. Der DOM-Test prüft nur die Begriffe, das Szenario nimmt «3 %» zwar in «Angenommen» auf, prüft es aber nicht. Ein falscher Prozentsatz bliebe grün. |
| C-6 | Minor | src/routes/statements/generate/StatementWizard.svelte:287 | Schritt 3 heisst «Heizprofil und Verwaltungspauschale», als Wert nennt er aber nur das Heizprofil. Die gewählte Pauschale fehlt im Wert und im zugänglichen Namen. Sven 663 P-2 hatte sie ausdrücklich erwartet. |
| C-7 | Minor | src/routes/statements/generate/StatementWizard.svelte:120-123 | `profileName` wiederholt die Suche nach dem Heizprofil, die `StatementStep.svelte:43-45` schon hat (`find` + `localName`). `buildingNames` wird dagegen weitergereicht; `profileName` liesse sich genauso übergeben. |

## C-1 (Blocker): der Schritt prüft das Ziel weniger streng als vorher

`tests/e2e/CLAUDE.md`, «Rules», specification: Das Szenario «Abgelehnter Entwurf ist verlinkt» läuft auf `main` ohne `@wip`. Sein Dann-Schritt prüfte bisher `pageAddressInApp` gegen `statementPath(seed, "Anna Keller", 2025)` (`statements.steps.ts:116-119`), also genau diesen Entwurf. Der neue Schritt prüft nur `openedPageText` mit `toContain(tenant)` und `toContain("2025")` auf dem ganzen HTML, das der Server schickt.

#663 entscheidet: «der Entwurf öffnet in einem neuen Tab». Erlaubt ist damit der Wechsel auf den neuen Tab, nicht der Verzicht auf die Prüfung, *welcher* Entwurf aufgeht. Diese Lockerung deckt der Entscheid nicht.

So zeigt man, dass der Schritt zu wenig fängt: In `RefusedStatements.svelte:30` `href="/contracts/{…}"` setzen oder auf einen anderen Entwurf desselben Mieters zeigen lassen. Die Detailseite des Mietvertrags enthält «Anna Keller» und «NK-2025-…», der Schritt bleibt also grün.

Dazu kommt: Die Frage antwortet mit dem ganzen HTML, ein Fehlschlag zeigt also kein lesbares Ergebnis. Vorschlag: `OpenInNewTab` merkt sich die aufgelöste URL, eine Frage antwortet mit dem Pfad, und der Schritt vergleicht ihn mit `statementPath(seed, tenant, year)`.

## C-2 (Major): Werte erst ab 1280 px sichtbar

#663 «Decided»: «finished steps show their value under the check mark and in their accessible name». Der Wert hat `sr-only … xl:not-sr-only` (`Stepper.svelte:54`), der Test legt das fest (`ui-navigation-parts.dom.test.ts:50`).

Unter `xl` sieht man nur Häkchen. Genau das bemängelt P-2 in Sven 663 («sichtbar sieht man nur ein Häkchen»). Die Zusammenfassung in Schritt 5 deckt die Schritte 2 bis 4 nicht ab.

Für den zugänglichen Namen ist die Vorgabe erfüllt, für die Anzeige nur ab einer Breite. Entweder unter `xl` sichtbar machen (z. B. unter dem Schrittnamen erst ab `md`, oder als Zeile unter dem Fortschritt) oder diese Einschränkung vom Product Owner in #663 bestätigen lassen («Blocked on me»).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `bunx vitest run` (4113 passed), E2E chromium contract-detail.feature (54 passed, geändertes Szenario vorher rot), statement-generate.feature (95 passed), accessibility- und sprachen-bildschirme-Zeilen für statement-generate und contract-detail (92 passed).
- Neues Szenario zum Assistenten nach den DOM-Tests geschrieben (b449bdc): Laut Commit wurde es mit herausgenommenem Code rot gesehen. Ob es wirklich an `run-summary` scheitert und nicht an einem fehlenden Schritt, kann ich nur aus dem Code schliessen; nach dem Code scheitert es an `run-summary`. Die Reihenfolge weicht von Workflow 1 ab, hat aber keinen Fehler zur Folge; eine Notiz im Plan genügt.
- Abstand zwischen Schrittname und Wert im zugänglichen Namen: nur aus dem Svelte-Whitespace geschlossen. Der DOM-Test prüft nur `stringContaining`.
- `screens.json`: Die Zusammenfassung erscheint im bestehenden Zustand `statement-generate`/`every-wizard-step` (accessibility.feature:178, sprachen-bildschirme), die Werte der Schritte ebenfalls. Eine eigene Zeile braucht es nach dem Code nicht; den axe-Lauf habe ich nicht gesehen.

Geprüft: alle vier Sprachdateien (nur bestehende Schlüssel), Tokens (`rounded-panel`, `bg-sunken`, `text-ink-muted`), `rel="noopener noreferrer"`, Rot ohne Änderung bei den DOM-Tests zu Link, Stepper und Zusammenfassung, Screenplay-Schichten der neuen Schritte, Begriffe aus UBIQUITOUS_LANGUAGE.
