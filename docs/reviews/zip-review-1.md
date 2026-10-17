# Review #356 ZIP eines Abrechnungslaufs (611c1a1..ee2fa53)

Worktree: `/tmp/claude-0/-home-user-Dwello/94414f17-b1bd-53cb-a045-3212fe00129f/scratchpad/review-zip-code` (ee2fa53). Gelesen: alle 25 Dateien des Diffs, dazu `src/routes/statements/[id]/pdf/+server.ts`, `src/lib/server/statement.ts` (`pdfFileName`, `pdfRefusal`), `src/hooks.server.ts` (`handleFetch`), `GenerationStep.svelte` vollständig, `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `tests/e2e/screenplay/interactions.ts` (`DownloadFrom`), die wiederverwendeten Steps in `statement-detail.steps.ts`/`statements.steps.ts`, `backend/src/__tests__/api-contracts.pg.test.ts`, `Dockerfile`, Issues #356 und #111.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | `tests/a11y/screens.json` (fehlt), `tests/e2e/features/accessibility.feature`, `sprachen-bildschirme.feature` | Die Ergebnisseite «… Abrechnungen erstellt» mit dem neuen Knopf ist kein a11y-/Sprachen-Zustand; #356 «Done means» verlangt ihn ausdrücklich, «if the result step changes» – er ändert sich. |
| C-2 | Major | `src/routes/statements/zip/+server.ts:14` / `tests/a11y/screens.json` | Die Ablehnungsseite, die die neue Route `/statements/zip` antwortet, ist nicht in `screens.json` und den beiden Features (CLAUDE.md, Design-Regeln «Process»: «a page a `+server.ts` route answers … once per place it appears»). |
| C-3 | Minor | `src/__tests__/statement-generation.test.ts:53`, `src/lib/server/statement-generation.ts:130` | `generateStatements` liest jetzt `id` aus der Antwort von `POST /statements/generate`; der Test nimmt sie handgeschrieben (`{ id: 's-…' }`), nicht aus `tests/contracts/*.json`, und `api-contracts.pg.test.ts` prüft diese Antwort nicht (Gotcha «API contracts»). Das Feld existiert (Backend gibt `statement` zurück, E2E nutzt es). |
| C-4 | Minor | `docs/PRD-Dwello.md:1265` | Audit-Log-Liste lässt «Storno» weg: #111 entschied «a correction or Storno of a sent statement (#120)», PRD sagt nur «a correction of a sent statement». |
| C-5 | Minor | `src/routes/statements/zip/+server.ts:11-13` | `ids` aus der Query ungeprüft in den Backend-Pfad (`statements/${id}/pdf`); `../` wird durch URL-Normalisierung aufgelöst, so dass beliebige Backend-GETs auf `…/pdf` erreichbar sind (nur mit eigenem JWT, `handleFetch` beschränkt auf Backend-Origin, daher kein Rechteausbau). `encodeURIComponent(id)` schliesst es ohne Mehrzeilen. |
| C-6 | Nit | `src/__tests__/statement-endpoints.test.ts:217` | Eigene neue Zeile nicht Prettier-sauber (`bunx prettier … \| diff` zeigt den Umbruch); laut Aufrufer nach ee2fa53 korrigiert, im geprüften Commit noch nicht. |
| C-7 | Nit | `src/routes/statements/zip/+server.ts:17-19` | `catch`-Zweig (Netzwerkfehler -> 500-Ablehnungsseite) hat keinen Unit-Test; die Einzel-PDF-Route hat dasselbe Verhalten. |
| C-8 | Nit | `src/routes/statements/zip/+server.ts:11` | Leere `ids` (Lauf mit 0 erstellten Abrechnungen, falls erreichbar) liefern eine leere ZIP statt einer Meldung; fehlende `periodStart`/`periodEnd` ergeben `NK-null-null.zip`. |
| C-9 | Nit | `docs/PRD-Dwello.md:1262` | «vision, not planned» klein/englisch, sonst überall «Vision, nicht geplant». |
| C-10 | Nit | `src/routes/statements/zip/+server.ts:5,13-15` | ponytail `reuse:` Konstante `BACKEND_URL`, Fetch und `pdfRefusal`-Aufruf sind aus `src/routes/statements/[id]/pdf/+server.ts:5,14-18` kopiert; ein `backendPdf(fetch, id)` in `src/lib/server/statement.ts` würde beide Routen tragen (net ca. -4 Zeilen). Sonst schlank: `fflate` begründet (Node 20 ohne Zip-Writer, adapter-node bündelt devDependencies, Dockerfile bestätigt). |

## Blocker/Major

### C-1 Ergebnisschritt fehlt in den a11y- und Sprachen-Prüfungen

#356, «Done means»: «the new state in `tests/a11y/screens.json`, `accessibility.feature` and `sprachen-bildschirme.feature` if the result step changes». Der Diff fügt dem Ergebnisschritt (`GenerationStep.svelte:57-59`) einen Knopf mit neuem Text hinzu, also ändert er sich. `statement-generate` in `screens.json:406-421` hat nur Zustände bis vor dem Speichern (`every-wizard-step`: «up to the step before saving»). Folge: Weder axe (hell/dunkel, drei Viewports) noch die Prüfung «fr/it/en zeigen kein Deutsch» sehen `statements_download_zip` oder den Ergebnisschritt überhaupt; z.B. ein fehlender Schlüssel in `fr.json` (Paraglide fällt auf Deutsch zurück) würde keine Prüfung rot machen. Nachweis: `grep -n "generated\|result" tests/a11y/screens.json` findet keinen Ergebniszustand. Die Begründung des Aufrufers («never was an axe state») ist ein Altbestand, aber das Issue macht ihn für diese Änderung zur Abnahmebedingung. Lösung: Zustand (z.B. `generation-result`) mit `stateMeanings`, der einen Lauf erstellt, in allen drei Dateien; ist das im a11y-Stack nicht herstellbar, gehört es als Entscheid unter «Blocked on me».

### C-2 Ablehnungsseite der ZIP-Route fehlt in den a11y- und Sprachen-Prüfungen

CLAUDE.md, Design-Regeln «Process»: ein neuer Bildschirm «(also a page a `+server.ts` route answers, e.g. a refusal opened in a tab)» kommt in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`, «once per place it appears». Die neue Route `/statements/zip` antwortet mit `pdfRefusal(...)` eine eigene Seite unter neuer Adresse; geprüft ist nur `statement-pdf-refused` (`/statements/0000…/pdf`, `screens.json:475`). Der Inhalt kommt aus derselben Funktion, das Risiko ist klein, die Regel aber ausdrücklich und die Abhilfe billig: Eintrag `statement-zip-refused` mit `path` `/statements/zip?ids=00000000-0000-4000-8000-000000000000&periodStart=2024-01-01&periodEnd=2024-12-31`, Zustand `default`, in beiden Features. Nachweis: `grep -n zip tests/a11y/screens.json` ist leer.

## Anforderung gegen Code und Test

- ZIP mit dem PDF jeder Abrechnung dieses Laufs, benannt nach Abrechnungsnummer: bestätigt durch `zip/+server.ts`, `generateStatements` gibt IDs zurück, Unit-Test «packt die PDFs …», DOM-Test Link, E2E-Szenario «Alle Abrechnungen eines Laufs als ZIP herunterladen» (Name gleich `statementNumber` + `.pdf`).
- Frühere Abrechnungen nicht enthalten: bestätigt, das Szenario legt eine frühere Abrechnung von «Eva Frei» an und erwartet mit `toEqual` nur die von «Marc Huber»; eine Implementierung «alle Entwürfe der Periode» würde rot.
- Ablehnung zeigt dieselbe Seite wie Einzel-PDF: bestätigt durch `pdfRefusal`, Unit-Test 404 und Szenario «ZIP eines Laufs mit einer inzwischen gelöschten Abrechnung anfordern» (Satz und Rückweg).
- Texte in vier Sprachen: `statements_download_zip` in allen vier Dateien; Sprachprüfung im Bildschirm fehlt (C-1).
- fflate als devDependency: begründet, `bun.lock` nur um die Zeile im Root-Workspace ergänzt.
- PRD für #111: ZIP -> #356, Audit-Log -> #357, automatische Mahnungen und Swiss eID «Vision, nicht geplant», DB-SSL/Feldverschlüsselung Vision mit O-3/O-6: bestätigt durch den geänderten Text; Abweichungen C-4, C-9.
- Rote Tests (nach Lesen): Endpoint-Tests scheitern ohne Route (Import), DOM-Test ohne Knopf, `statement-generation`-Test bei Rückgabe einer Zahl, beide Szenarien am fehlenden Knopf bzw. an einer ZIP statt der Ablehnungsseite.
- Screenplay: Steps rufen nur Tasks/Questions; `filesInDownloadedZip` antwortet mit Werten (Name und erste Bytes); `DownloadFrom` wartet auf das Download-Ereignis; neue Szenarien ohne `@api`, `throughUiOrApi` daher nicht betroffen; Feature-Sprache ohne «klickt/Button».
- Design: `Button` aus `src/lib/ui`, Variante nicht primär (eine Hauptaktion bleibt), Icon `document-download` existiert, keine Rohwerte.
- Sicherheit: GET ohne XSRF wie die Einzel-PDF-Route; JWT nur an Backend-Origin; C-5.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-Type-Check, gesamtes `bunx vitest run`, E2E `--project=chromium --project=api -g "Nebenkostenabrechnungen erstellen"` (51 passed): vom Aufrufer gemeldet.
- Selbst nachgeführt: `bunx vitest run` auf `statement-endpoints`, `statement-generation`, `statement-wizard.dom`, `generation-step`: 4 Dateien, 89 Tests grün.
- Ob ein Lauf mit 0 erstellten Abrechnungen den Ergebnisschritt erreicht (C-8): nicht geprüft, der Assistent sperrt vermutlich vorher.
- Dass `node build` im Docker-Image fflate tatsächlich gebündelt hat: nur aus adapter-node-Verhalten und `Dockerfile` (prod-deps ohne devDependencies) geschlossen, kein Build ausgeführt.
