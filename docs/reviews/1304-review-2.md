# Code-Review #1304 / #1306, Runde 2 (Abschlussrunde, 6a1bfb6..f28c286)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1

Keine Blocker, keine Major.

Geprüft: C-1-Fix (src/__tests__/setup-page.test.ts:235): der Kommentar «code review 577 C-4 …» steht wieder direkt über dem Sperr-Test, der neue Test zur zu langen E-Mail-Adresse davor mit seinem eigenen #1306-Kommentar; sonst ändert der Diff nichts. Merge f28c286 (`--remerge-diff`): der Konflikt betraf nur die Zeilen 532–534 in messages/{de,en,fr,it}.json; alle drei Schlüssel `backend_category_name_taken`, `backend_distribution_key_name_taken`, `backend_heating_profile_name_taken` tragen in jeder Sprache den Satz des nächsten Schritts («Wählen Sie einen anderen Namen.» / «Choose another name.» / «Choisissez un autre nom.» / «Scelga un altro nome.»), der Diff gegen jeden Elternteil zeigt genau die Änderungen der anderen Seite (gegen ^1 die Formeltexte, `backend_formula_missing_*` und `keys_insert_total` aus #1200; gegen ^2 die beiden Texte dieses Branchs), nichts fehlt; die Leerzeichen in « » sind im Französischen weiter U+00A0 (C2 A0); alle vier Dateien sind gültiges JSON. Schritte: #1200 legt keinen zweiten Schritt `steht bei {string} die Fehlermeldung {string}` an; sein neuer Schritt `erfährt der Liegenschaftsverwalter beim Namen {string}` (distribution-keys.steps.ts:212) nutzt selbst `seed.withNames`, passt also zum geänderten gemeinsamen Schritt (common.steps.ts:86); main bringt keine neue Verwendung des gemeinsamen Schritts (die einzige in distribution-keys.feature:137 bestand schon). Die übrigen Treffer von «existiert bereits.» ohne den neuen Satz in src/__tests__ (backend-error.test.ts:13/86, categories-page.dom.test.ts:240/372) sind der eigene Text des Backends bzw. durchgereichte Props, keine Paraglide-Meldungen.

## Nicht bestätigt

- Vom Aufrufer gemeldet (auf f28c286): `bun run lint`, `bun run check`, `bun run fitness`, Backend-Type-Check, `bunx vitest run --changed origin/main` (986), E2E chromium von categories, heating-profiles, einrichtung, distribution-keys, apartment-edit, building-edit, tenant-edit (128 passed). Vor dem Merge: Backend `bun run test` (2116 pass, Coverage 97.3 %), axe-/Sprachzeilen von setup, category-new, heating-profile-new (32 passed).
- Weiter offen aus Runde 1: der gemeinsame Schritt `steht bei {string} die Fehlermeldung {string}` mit `seed.withNames` in den nicht gelaufenen Features ist erst mit einem vollen E2E-Lauf (CI) bestätigt. Die Prettier-Prüfung der neuen Dateien hat der Aufrufer nicht gemeldet.
