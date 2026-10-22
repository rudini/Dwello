# Fachreview #580, Runde 3 (letzte): Re-Review F-27 bis F-30

Gegenstand: Worktree `review-580-fach6`, Commit e957391, Delta `git diff 22d231d e957391 -- messages docs/installation.md backend/src/config/llm.ts`. Vorbericht: `docs/reviews/580-fachreview-5.md`.

## Status der offenen IDs

| ID | Rolle | Schwere | Status |
|----|-------|---------|--------|
| F-27 | Rechtstexte | Major | **Behoben.** `ki_settings_country_help` (de) übernimmt den vorgeschlagenen Wortlaut wörtlich. Die Länder des Anbieters und der beigezogenen Firmen sind genannt, auch beim blossen Zugriff, und der Text verweist auf Vertrag und Liste der Unterauftragnehmer. fr/it/en machen dieselbe Aussage: «même s’ils ne font qu’y accéder» / «anche se vi accedono soltanto» / «even if they only access it». «sous-traitants» entspricht dem Begriff in Art. 9 DSG (fr), «subprocessors» dem üblichen Begriff in Anbieterlisten. Das italienische «subappaltatori» ist kein DSG-Begriff (dort «responsabili del trattamento»). Als Hinweis, wo die Liste steht, ist es aber nicht falsch. |
| F-28 | Verwalter | Minor | **Behoben.** `llm.ts:59` nennt zuerst den nötigen Schritt (localhost oder den Compose-Dienst `ollama`, beide in `OPERATOR_HOSTS`, `llm.ts:51`), dann «remove it and choose a provider … after the start». Der Test `llm-recipient.test.ts:108` ist nachgezogen. |
| F-29 | Verwalter | Minor | **Behoben.** `docs/installation.md` Abschnitt 5 nennt `docker compose -f docker-compose.prod.yml up -d ollama` und den Container `dwello-ollama`. Beides stimmt mit `docker-compose.prod.yml:158–160` überein. `ki_settings_model_offline` verweist damit auf eine Stelle, die es gibt. |
| F-30 | Rechtstexte | Minor | **Behoben**, in allen vier Sprachen gleichlautend («eigener Server» / « serveur propre » mit geschütztem Leerzeichen / «server proprio» / «own server»). Folgefehler siehe F-31. |

## Neue Befunde im Delta

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-31 | Rechtstexte | Minor | Der in F-30 vorgeschlagene Eintrag «eigener Server» landet unverändert in `privacy_llm_external` (`src/routes/privacy/+page.svelte:29`). Der Mieter liest dann: «Rechnungen werden von eigener Server (Schweiz) mit einer KI kategorisiert». Der Satz ist ungrammatisch, und offen bleibt, wessen Server gemeint ist. Die Datenschutzerklärung spricht sonst vom «Betreiber» (`privacy_controller_2`). Fix in `ki_settings_provider_name_help` (alle vier Sprachen): «… schreiben Sie Ihren Namen und «eigener Server»» (gerendert: «von Hans Muster, eigener Server (Schweiz)»). Das ist grammatisch und nennt den Empfänger. Dabei den Satz «Die Datenschutzerklärung nennt ihn» vor den Satz zum eigenen Server stellen. Sonst bezieht sich «ihn» auf «Server». |

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- Ob «subappaltatori» der Begriff ist, den die gängigen Anbieter in ihren italienischen Listen verwenden. Nicht geprüft, weil der Text nur den Fundort beschreibt und dieselbe Aussage macht wie die anderen Sprachen.
