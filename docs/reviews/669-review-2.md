# Code-Review #669, Runde 2 (Delta 5b569bc..5af99a9, ohne docs/reviews und docs/design/personas)

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Minor | tests/e2e/tasks/accessibility.ts:215-217 | `toReviewWithoutContracts` steht jetzt zwischen dem Kommentar von `createPartly` («Two files, one created …») und `createPartly`. Der Kommentar steht damit über der falschen Funktion und beschreibt den Weg zu «Prüfen» falsch. |
| C-5 | Minor | messages/*.json `contracts_delete_draft_contracts_unknown`, src/__tests__/contract-edit.dom.test.ts:839-842 | Die korrigierte Ablehnung («Wählen Sie oben auf der Seite «Erneut versuchen» …») hält nur ein DOM-Test fest. Kein Szenario und kein `No scenario: <reason>` in den Commit-Nachrichten deckt sie ab. Die Steps sind vorhanden: die Mietverträge lassen sich nicht laden, dann «den Entwurf löscht und den Mietvertrag speichert», `contract-edit.feature:224-227`. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint 0; check 0 Fehler/0 Warnungen; Backend-Type-Check 0; `bunx vitest run --changed origin/main` 1709 grün, dazu die Tests für i18n, design-guard, tokens, ui-dialog und Layout; E2E Chromium contract-edit + contract-new 107 grün; a11y- und Sprachzeilen von contract-new, contract-edit und mobile-menu-open 72 grün; fitness Exit 0; fallow sauber; Prettier auf neuen Dateien grün.
- Durch Lesen plausibel rot auf 5b569bc:
  - Die Fehlermeldung liegt über dem offenen Menü (bei 390 px liegt die Mitte der Meldung bei x 195, unter der Schublade, die bis x 320 reicht).
  - Die Erfolgsmeldung bleibt 10 s stehen (Lesezeit 8 s).
  - Die vier neuen DOM-Fälle für den Assistenten und das Bearbeiten: Warnung statt Erfolg, ohne Vertragsbeginn, aufgehobene Wahl, Kasten in «Prüfen».
  - Die zwei DOM-Tests zur Lesezeit.
- `ToastRegion`, Haltezeit: Entfernt «Meldung schliessen» per Tastatur die eigene Meldung, verschwindet das fokussierte Element. Ob der Browser dann `focusout` auslöst, habe ich nicht geprüft. Wenn nicht, bleibt eine gleichzeitig stehende zweite Bestätigung (z. B. Warnung neben Erfolg) in `expired` liegen, bis Fokus oder Zeiger die Region wieder verlassen. Ich habe es nur gelesen, nicht im Browser gesehen.
- Ob `contractSteps[1].label` im Assistenten genau `m.tenants_apartment()` ist, wie `contracts_overlap_review_where` voraussetzt: nur durch das Szenario («im Schritt 2 «Wohnung»») belegt.
- `retryContracts` wartet jetzt auf Erfolg oder Warnung (`loadedToast`). Das Szenario auf `main` «Mietverträge der Wohnung erneut laden» prüft dasselbe wie zuvor. Seine Daten (Anna Keller allein auf 2.01) ergeben weiterhin eine Erfolgsmeldung. Die Wartebedingung synchronisiert nur und ist keine Prüfung des Szenarios. Darum keine Spec-Änderung.

Geprüft: Fix von C-1 (`<MobileNav />` im Rahmen vor `<ToastRegion />`; `makeInert` deckt den Rahmen Teil für Teil ab, die Tab-Reihenfolge von P-4 bleibt, neues Szenario mit `OnTop`), C-2 (Texte in allen vier Sprachen gleich der fach-review Runde 2), C-3 (`values.startDate ? overlap : undefined`, DOM-Test und Szenario), `loaded()`/`retried()` (Schritt 2 nennt den Schritt, sonst den Kasten; die Warnung ersetzt die vorige Meldung), die aufgehobene Wahl in Schritt 2 (`hasOngoingContract` = «nicht verfügbar», fach-review V-5), `OverlapWarning` in «Prüfen» (nicht bei `refusedWith`), der neue Zustand `overlap-review` in screens.json, accessibility.feature und sprachen-bildschirme.feature, `openContractsOf` ohne Verhaltensänderung, Screenplay-Schichten der neuen Steps, ponytail-review (nichts Ungenutztes, kein kopierter Helfer).
