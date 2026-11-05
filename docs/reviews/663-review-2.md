# Code-Review #663, Runde 2 (Slice 663, b449bdc..bd580af)

Geprüfter Bereich: `git diff b449bdc bd580af -- . ':!docs'` (Worktree review-663b-code auf bd580af).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Minor | src/routes/statements/generate/StatementWizard.svelte:287 | Unverändert offen: Der Wert von Schritt 3 nennt nur das Heizprofil, die Verwaltungspauschale fehlt im Wert und im zugänglichen Namen. Sie steht nur in der Zusammenfassung von Schritt 5. |
| C-8 | Minor | src/lib/ui/Stepper.svelte:29 | Der Kommentar «Up to xl only the numbers» stimmt nicht mehr. Seit C-2 zeigen erledigte Schritte schon ab `md` ihren Wert, nur die Namen bleiben bis `xl` verborgen. |

Geschlossen: C-1, C-2, C-3, C-4, C-5, C-7

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (4113 passed), E2E chromium contract-detail.feature und statement-generate.feature (149 passed), Zeilen in accessibility und sprachen-bildschirme für statement-generate (54 passed).
- Darstellung der Werte zwischen `md` und `xl` (fünf Schritte neben der Seitenleiste, Zeitraum und Gebäudenamen umbrechend): Ich habe nur das Markup gelesen (`min-w-0`, `break-words`, kein seitliches Scrollen zu erwarten). Einen Screenshot habe ich nicht gesehen, und der axe-Lauf auf Tablet ist nur vom Aufrufer gemeldet.
- Rot von C-1 im E2E-Schritt: nur aus dem Code geschlossen. Zeigt der Link auf eine andere Adresse, weicht der Pfad von `statementPath(seed, tenant, year)` ab, der Schritt schlägt dann fehl.

Geprüft: Zu C-1 ist der Pfadvergleich so streng wie der Schritt auf `main` (`pageAddressInApp` gegen `statementPath`); `OpenInNewTab` setzt `url` nur im Zweig ohne `blob:`, und `OpenedPage` wird nur von den Fragen in contract-detail benutzt. Zu C-3 war die entfernte Zeile auf der Merge-Base nicht im Szenario. Keine verwaisten Importe (`Value`, `localName`, `endDateTyped`); der Stepper-Test war mit `sr-only` rot.
