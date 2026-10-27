# Code-Review #890, Runde 1 (70df82a1..62dc942c)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/statements/generate/CategoryCheck.svelte:27-36 | Ein Befund `keys` zählt als Vergleich mit dem Vorjahr: Steht er allein in der Liste und hat das Gebäude ein Vorjahr, lauten Titel und Einleitung «Kosten im Vergleich zum Vorjahr» / «Dwello vergleicht jede Kategorie mit dem gleichen Zeitraum im Vorjahr …». Das ist falsch, und kein Test deckt diesen Fall ab. |
| C-2 | Minor | backend/src/__tests__/fuel-stock.pg.test.ts:281-307 | V-2 (eine Rechnung ohne Verteilschlüssel zählt als eigener Schlüssel) ist ungetestet. Würde `keysFinding` `null` herausfiltern, bliebe jeder Test grün. |
| C-3 | Minor | src/lib/server/statement-generation.ts:360 | Antwortet `distribution-keys` nicht, verschluckt `namesById` den Fehler. Dann steht im Text «… wird nach «» verteilt», denn anders als beim Kategorienamen gibt es keinen Rückfall auf den Namen aus dem Backend. |
| C-4 | Minor | tests/contracts/invoice-completeness.json | Die Antwort der Prüfung hat jetzt die Art `kind: 'keys'` und das Feld `keyId`, der Vertrag ist aber unverändert. `statements-i18n.test.ts:154` erfindet `keyId` neben dem Vertrag. Den Feldnamen hält nur der pg-Test fest. Gotchas, «API contracts»: «Changing an API response means updating its contract». Ein eigener Vertrag mit Tankbestand im Vertragstest würde den Befund abdecken. |
| C-5 | Minor | tests/e2e/steps/statement-detail.steps.ts:127-132 | Der neue Given ist eine Kopie des Schritts mit «danach» direkt darunter, mit demselben Rumpf. Ein Schritt mit optionalem Text `(danach )` deckt beide Fälle ab. |
| C-6 | Minor | Commit 62dc942c | Der pg-Test «meldet keine verschiedenen Verteilschlüssel, wenn die Lieferungen einen haben» hält bestehendes Verhalten fest und hat keinen roten Lauf. Die Commit-Nachricht sagt das nicht, wie Workflow 2 es verlangt. Der Test selbst ist in Ordnung: Auf der Basis zeigt sich das Verhalten ebenso, und es ist kein Bugfix. |

## C-1 (Major): ein Befund `keys` ändert Titel und Einleitung zu «Vergleich zum Vorjahr»

`compared` (CategoryCheck.svelte:27-32) gilt, sobald `comparedWith` gesetzt ist (`hasComparison`, statement-wizard.ts:301) und ein Befund weder `stock` noch `consumption` ist. Der neue Befund `keys` fällt darunter. Das ist der übliche Fall bei einem Verwalter, der schon im Vorjahr Rechnungen erfasst hat und ohne Abweichung abrechnet: Die Prüfung zeigt dann nur den Hinweis auf die Verteilschlüssel. Darüber stehen aber der Titel «Kosten im Vergleich zum Vorjahr» und die Einleitung «Dwello vergleicht jede Kategorie … Vielleicht kommt die Rechnung später, oder der Rechnungssteller rechnet anders ab.» Beides sagt etwas Falsches über den Hinweis.

Das Szenario sieht das nicht: Es hat kein Vorjahr, also ist `comparedWith` null, und der Titel lautet «Tankbestände prüfen».

So lässt es sich zeigen: Ein DOM-Test von `CategoryCheck` mit `checked = [{ …, findings: [finding('keys')] }]`, `comparedWith` gesetzt und `confirm=false` zeigt den Titel «Kosten im Vergleich zum Vorjahr». Alternativ dasselbe Szenario mit einer Heizungsrechnung 2023 und ohne Abweichung.

Fix: `keys` wie `stock`/`consumption` aus `compared` ausnehmen. Ein Tankbefund ist kein Vergleich.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet, ich habe sie nicht wiederholt: lint, check, Backend-type-check, `test:coverage` (3712 Tests), Backend-Tests (1659, 96.5 %), E2E `statement-generate.feature` (chromium + api, 106), Prettier, sowie die roten Läufe von Szenario, pg-Test, Wortlaut-Test und i18n-Test.
- Ob die Basis 70df82a1 für den gewählten Titel ohne Vorjahr («Tankbestände prüfen» bei einem reinen Schlüsselhinweis) einen eigenen Text braucht: Das ist eine Frage des Wortlauts, nicht entschieden in #890. Nachgesehen habe ich nur in CategoryCheck.svelte und `messages/de.json:1467-1474`.

Geprüft: `keysFinding` übernimmt den Schlüssel aus `fuelStockChange`/`keyFor` und die Lieferungen aus `getInvoicesForStatement` (V-1) und zählt `null` als eigenen Schlüssel (V-2, Code). Der Befund steht neben `stockFinding`. `needsConfirmation` ist unverändert (Hinweis ohne Bestätigung). Wortlaut in de/fr/it/en wie im Fachreview, fr mit geschützten Leerzeichen. Die Begriffe stimmen mit `UBIQUITOUS_LANGUAGE.md` überein. Das Szenario nennt beide Schlüssel und verlangt keine Bestätigung, ohne UI-Wörter. Die Steps rufen nur `seed` und die vorhandenen Fragen auf. Kein neuer Bildschirmzustand und kein neues Bedienelement (ich teile die Einschätzung des Aufrufers zu a11y/Sprachen). Keine Tokens oder Design-Elemente betroffen. Keine sachfremden Änderungen.
