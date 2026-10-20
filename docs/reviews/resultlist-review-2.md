# Code-Review ResultList (#455), Runde 2 (Schlussrunde)

Bereich: `git diff 91b98543 045fa1a3 -- . ':!docs/reviews' ':!docs/archive'` (ein Commit `045fa1a3 chore(components): use the list section for flats`), Worktree `review-resultlist-code-2`. Vorheriger Bericht: `docs/reviews/resultlist-review-1.md`.

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | erledigt | `docs/design/token-referenz.md:66` nennt `ResultList` unter «Lists», mit einer zutreffenden Beschreibung (Überschrift mit Anzahl, Liste, `Pagination`; vgl. `src/lib/ui/ResultList.svelte:27-33`). |
| C-2 | erledigt | `src/routes/apartments/+page.svelte:65-79` nutzt jetzt `ResultList`. Laut Aufrufer hat der Product Owner das über den Koordinator entschieden. Damit ist die Rückfrage aus Runde 1 beantwortet. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | keine |

Keine Blocker, keine Majors, keine Minors.

## Geprüft und bestätigt

- **Keine Verhaltensänderung auf der Wohnungsliste:** Ich habe das alte Markup mit dem von `ResultList` verglichen.
  - Die Section hat weiterhin `aria-labelledby="apartments-count"` und die Klasse `flex flex-col gap-4`.
  - Die h2 behält `id`, `tabindex="-1"`, `data-results` und `text-xl font-bold text-ink`.
  - Der Überschriftentext ist derselbe `m.apartments_count_*`-Aufruf.
  - Die `ul` hat dieselbe Grid-Klasse, explizit als `listClass` übergeben.
  - `Pagination` steht weiterhin ausserhalb der Section, mit denselben vier Props.
  - `StatusLegend` folgt wie bisher nach der `Pagination`.
  - Der Import von `Pagination` ist entfernt und wird nicht mehr gebraucht. Es bleibt kein ungenutzter Code zurück.
- **Tests:** Die bestehenden Tests decken die Struktur weiter ab: `src/__tests__/apartments-pages.dom.test.ts:51,58` (`[data-results]`, Fokus und Anzahltext) und `:173` (`pagination-next`). Ein reiner Umbau ohne Verhaltensänderung braucht keinen neuen roten Test. Ein E2E-Szenario ist auch nicht nötig.
- **Konventionen:** Es gibt keine neuen UI-Texte, also keine Änderung in `messages/*.json` und keinen neuen a11y-Bildschirm. Der Delta bringt keine neuen Klassen, nur bestehende Token-Klassen. `tests/e2e`, API-Verträge und Backend sind nicht berührt. Das Commit-Subjekt hält das Format ein und hat unter 50 Zeichen. Es gibt keine unbeteiligten Änderungen.
- **Ponytail-Review:** Der Delta ersetzt eine Kopie durch die bestehende Komponente. Ich habe nichts zum Streichen gefunden.

## Nicht bestätigt

- eslint der geänderten Dateien, prettier auf den geänderten Zeilen und `bunx vitest run` der Wohnungstests plus design-guard (439 grün): vom Aufrufer gemeldet, nicht wiederholt.
- `bun run check` (svelte-check) für das neue Props-Objekt in `apartments/+page.svelte`: nicht gelaufen. Ich habe die Typen durch Lesen gegen `ResultList.svelte:14-23` abgeglichen: alle Pflicht-Props sind gesetzt.
- E2E und axe der Wohnungsliste: nicht gelaufen (Vorgabe des Koordinators).
- Den Entscheid des Product Owners zu C-2 habe ich nicht in #455 nachgelesen. Ich stütze mich auf die Angabe des Aufrufers.
