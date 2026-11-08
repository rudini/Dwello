# Code-Review #739, Runde 1 (75b78a9..b193e29)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Die Vorauswahl bevorzugt die Einstellung (`runDefaultsOf` liest `default_heating_profile_id`, statement-run.service.ts:194; `runDefaults` gibt sie ohne Link oder ohne Abrechnungen der Periode weiter, :161/:183; +page.server.ts:72; SettingsStep.svelte:34 wählt das erste vollständige Profil nur ohne Wert). «Heizung + Warmwasser» ist vollständig (Summe 100.0, 0002_stammdaten.sql:64) und war ohne eigene Profile schon das erste (`orderBy(type, name)`, «Heating + Hot Water» sortiert vor «Heating M…»), also kein Wechsel des Ergebnisses für Szenarien ohne eigenes Profil. INSERT: `configuration.value` ist TEXT, uuid → text als Zuweisungs-Cast gültig, kein Seed-Eintrag für den Schlüssel in den Migrationen, also keine Doppelzeile. Die Umgebungsvariable steht nur am Backend 3101 (playwright.config.ts:134), nicht an 3103/3105, nicht in test-db.ts, db-reset.ts, reset-demo.sh. Kein E2E-Schritt liest oder setzt `default_heating_profile_id` (fixtures/backend.ts:340/362 schreiben nur Teilschlüssel; settings.feature speichert den Wert unverändert zurück, der Validator nimmt das vordefinierte Profil an); das Löschen eines Standardprofils wird verweigert (heating-profile.service.ts:251), betrifft aber kein eigenes Profil eines Szenarios. PresetNotice-Texte hängen nicht davon ab, ob ein Standard gesetzt ist. Die Szenarien mit «schlägt der Assistent das Heizprofil … vor» (statement-generate.feature:568/576/702/714) beziehen das Profil aus Abrechnungen der Periode, nicht aus der Einstellung. Der Look 'generation-result' wählt das Profil ausdrücklich (tasks/accessibility.ts:817). Diff minimal (ponytail-review: nichts Unbenutztes, kein kopierter Helfer); Kommentare stimmen; «No scenario» und Begründung stehen in der Commit-Nachricht; keine fremden Änderungen.

## Nicht bestätigt

- Probe ohne Änderung, statement-*.feature auf Chromium 345 grün: vom Aufrufer gemeldet.
- Wegwerf-@wip-Probe rot ohne / grün mit der Änderung: vom Aufrufer gemeldet (nicht committet, nicht lesbar).
- `E2E_DEFAULT_HEATING_PROFILE=1 bun run e2e-db` schreibt die Zeile (psql): vom Aufrufer gemeldet.
- Backend type-check, ESLint, Prettier auf eigenen Zeilen: vom Aufrufer gemeldet.
- Volle E2E-Suite chromium+api: vom Aufrufer als noch laufend gemeldet. Ob die axe- und Sprach-Looks der Vorschau (z.B. 'heating-hints', 'preview-*', tasks/accessibility.ts:830), die bisher das eigene Profil 'Standard' aus fixtures/screens.ts:126 vorausgewählt bekamen und jetzt «Heizung + Warmwasser» erhalten, unverändert durchlaufen, ist nur gelesen: kein Zustand hängt erkennbar an den Monatsanteilen des Profils.
