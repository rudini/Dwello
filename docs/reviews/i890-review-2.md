# Code-Review #890, Runde 2 (62dc942c..783df3c0, Abschlussrunde)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | src/lib/server/statement-generation.ts:360 | Wie in Runde 1 offen: Antwortet `distribution-keys` nicht, steht im Text «nach «» verteilt», weil es keinen Rückfall auf einen Namen gibt. Der Aufrufer belässt es bewusst als Minor. |
| C-4 | Minor | tests/contracts/invoice-completeness.json | Wie in Runde 1 offen: Der Vertrag zeigt weder `kind: 'keys'` noch `keyId`. Der Aufrufer belässt es bewusst als Minor, den Feldnamen halten die pg-Tests fest. |

Geschlossen: C-1, C-2, C-5, C-6

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet, ich habe sie nicht wiederholt: `bun run lint`, `statement-wizard.dom.test.ts` (95), `fuel-stock.pg.test.ts` (42), E2E chromium für die beiden Szenarien mit dem zusammengeführten Schritt (2), Prettier, dazu die roten Läufe des DOM-Tests (fcc9b4d9) und des pg-Tests ohne Schlüssel (783df3c0). Auf 62dc942c außerdem check, type-check und die vollen Suiten.
- Beim Lesen sind beide neuen Tests rot ohne die Änderung. Der DOM-Test erwartet «Tankbestände prüfen», vorher stand dort der Vergleichstitel. Der pg-Test kommt ohne `null`-Schlüssel auf nur einen Schlüssel und damit auf keinen Befund `keys`. Ausgeführt habe ich keinen der beiden.

Geprüft: `compared` nimmt `keys` aus (CategoryCheck.svelte:30). Der DOM-Test deckt den Fall «Vorjahr vorhanden, nur Schlüsselhinweis» ab, mit Titel und ohne Vergleichseinleitung. Der pg-Test zählt eine Lieferung ohne Schlüssel als eigenen Schlüssel und räumt danach auf. Der Schritt mit `(danach )` hat denselben Rumpf, prüft also nicht weniger. Er kollidiert nicht mit dem Schritt in Zeile 121, weil Cucumber-Ausdrücke ganz verankert sind, und er deckt statement-generate.feature:311-312 und statement-detail.feature:1115 ab. Die Commit-Nachrichten nennen das festgehaltene Verhalten (C-6). Keine sachfremden Änderungen.
