# Abschlussrunde PR #504, Runde 3: Zustand `server-error` über eine fehlschlagende Ladeanfrage

Geprüft: `git diff be1022bd cff0a4ea -- . ':!docs/archive'` im Worktree `review-504-code3` (detached, cff0a4ea). Geänderte Dateien: `tests/e2e/tasks/accessibility.ts`, `tests/e2e/targets/accessibility.ts`. Beide habe ich ganz gelesen. Die Merge-Angaben (be1022bd) habe ich nicht nachgeprüft (siehe «Nicht bestätigt»).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `tests/a11y/screens.json:128-133` (dazu `accessibility.feature:26`, `sprachen-bildschirme.feature:27`) | Der Pfad des Bildschirms `error-server` ist `/buildings/kein-gebaeude`. Mit diesem PR liefert er die Seite 404. Darum zeigt der Zustand `default` von `error-server` jetzt die Seite 404 und nicht mehr die Fehlerseite des Servers. Die Zeile `error-server | default` prüft also dasselbe wie `error-404` und ist falsch benannt. Den Fehler des Servers zeigt nur noch der Zustand `server-error`. Abhilfe: `default` aus den Zuständen von `error-server` streichen (der Pfad muss bleiben, weil `server-error` auf der Seite 404 beginnt) oder die Bedeutung angleichen. Dieser Delta-Commit hat die Datei nicht angefasst. Sichtbar wird es aber erst durch ihn, weil sein Kommentar «from the 404 page» festhält, dass dieser Pfad die Seite 404 ist. |

Keine Blocker, keine Majors.

## Zu den Fragen des Aufrufers

- **Zeigt der Zustand die echte Fehlerseite des Servers?** Ja. Es ist dieselbe Komponente `src/routes/+error.svelte`. Der Hinweis `error_hint_retry` erscheint bei jedem Status ausser 404 (Zeile 14), also auch bei 500. Das Ziel `on.text('Versuchen Sie es später erneut.')` findet also wie vorher den Hinweis der Fehlerseite. Die Seite 404 hat einen anderen Hinweis (`error_hint_404`). `Wait.until` kann darum nicht schon vor dem Klick erfüllt sein.
  Zur Überschrift: Es gibt keinen `handleError`-Hook (`src/hooks.client.ts` fehlt, in `src/hooks.server.ts` gibt es keinen). Nach meinem Wissen über den SvelteKit-Client macht er aus einer HTTP-500-Antwort ohne JSON einen `HttpError(500, 'Internal Error')`. Bei einem Fehler beim Server-Rendering setzt der Server ohne Hook ebenfalls `{ message: 'Internal Error' }`. Auch der echte Fall, in dem eine Server-Ladefunktion bei einer Navigation scheitert, liefert diese Meldung. Damit sieht die Überschrift gleich aus wie vorher beim Weg über das Server-Rendering. Den Quelltext von SvelteKit konnte ich nicht lesen (siehe «Nicht bestätigt»).
- **Wie robust ist `x-sveltekit-invalidated=11`?** Der Parameter ist ein internes Detail von SvelteKit. Das Ziel hängt aber an einer Eigenschaft der App selbst: `src/routes/+layout.server.ts:11` liest `url.pathname` absichtlich bei jeder Navigation. Darum ist der Wert für das Root-Layout bei einer Navigation `1`, der volle Wert also `11`. Ändert SvelteKit die Kodierung oder liest das Layout `url` nicht mehr, dann greift die Route nicht mehr. Das Dashboard lädt dann normal, und `Wait.until` läuft in den Timeout. Der Fehler wird also laut rot und nicht still grün. Das reicht als Absicherung.
- **Gibt es einen einfacheren Weg in den Screenplay-Schichten?** Ich sehe keinen. Alle Anfragen an `/dashboard/__data.json` scheitern zu lassen geht nicht: Dann scheitert auch die eigene Anfrage der Fehlerseite (`1`), SvelteKit lädt die Seite per Server-Rendering neu, und die Seite lädt fehlerfrei. Die Backend-Anfragen der Ladefunktion laufen auf dem Server und lassen sich mit Playwright nicht abfangen. Einen seitenweiten Link-Target-Helfer gibt es bisher nicht (`grep getByRole('link'` in `tests/e2e/targets`). `link(name)` ist also keine Kopie eines bestehenden Helfers.
  Die Schichten stimmen: Der Step ruft den Zustand auf, der Zustand ruft nur Interaktionen (`FailRequests`, `Click`, `Wait`) und Targets auf. Den Namen des Links findet `getByRole` per Teilstring ohne Gross- und Kleinschreibung. Er trifft in keiner Sprache den Navigationslink (de «Übersicht», fr «Vue d’ensemble», it «Panoramica», en «Overview» enthalten den längeren Text von `error_to_overview` nicht). Für Chromium meldet der Aufrufer, dass der Strict Mode grün ist.
- `lookAt` (`tests/e2e/tasks/accessibility.ts:591-609`) öffnet für jede Variante den Pfad neu und ruft dann den Zustand auf. Weil `page.route` sich dabei ansammelt, ist derselbe Handler mehrfach registriert. Das ist harmlos: Jeder Handler antwortet gleich mit 500.
- Kein Test ist abgeschaltet, kein Szenario gestrichen, die Strenge ist gleich geblieben. Neue UI-Texte gibt es nicht. Nichts im Diff hat mit der Anforderung nichts zu tun.

## Nicht bestätigt

- Das Verhalten des SvelteKit-Clients (`load_data` bei `!res.ok` ergibt `HttpError(500, 'Internal Error')`, `load_root_error_page` lädt mit `[true]` und navigiert sonst nativ) habe ich aus dem Gedächtnis beurteilt. `node_modules` (Symlink nach `/home/user/Dwello/node_modules`) ist durch eine Deny-Regel gesperrt. Auch die Version von `@sveltejs/kit` konnte ich nicht lesen.
- Grüne Läufe von E2E in Chromium (21) und Firefox/WebKit (laufen noch), lint, check, type-check, Backend-Tests `.pg` und die Vitest-Dateien: vom Aufrufer gemeldet. Ich habe sie nicht wiederholt, E2E nach Vorgabe nicht gestartet.
- Merge be1022bd ohne Konflikt und ohne Änderungen gegenüber c02b75ee: vom Aufrufer gemeldet, nicht nachgeprüft.
- Beobachtung ausserhalb des Deltas, nicht als Befund gezählt: `+error.svelte:11-13` zieht `$page.error.message` dem Text `m.error_unexpected()` vor. Bei einem Fehler 500 lautet die Überschrift darum vermutlich in allen Sprachen «Internal Error». Das war auf der Basis genauso (Weg über das Server-Rendering).

## Triage (W11)

- C-1 rejected: `tests/unit/a11y-screens.test.ts` («beginnt jeden Bildschirm mit seinem Grundzustand») requires `default` as the first state of every screen, so `error-server` keeps it. The row checks the 404 page reached through a malformed id, the path the state starts from: a duplicate of `error-404`, not a wrong check. Stays a Minor in this report.
- «Internal Error» heading: confirmed in the SvelteKit source (`handle_error_and_jsonify` without a `handleError` hook; client `load_data`). Before this branch the state showed the load's own `m.buildings_load_failed()`; now it shows «Internal Error». The cause existed before for every unexpected failure: issue #519.
