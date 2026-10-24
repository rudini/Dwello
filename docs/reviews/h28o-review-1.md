# Review h28o-1: Akonto-Tag im Backend (e4cdc63e4, `origin/main..HEAD`)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/routes/contracts.ts:270-271, src/routes/contracts/[id]/+page.server.ts:358 | Die neue Ablehnung `{ error: 'validFrom must be a real day' }` hat keinen Code. `backendMessage()` zeigt bei fehlendem Code den eigenen Text des Backends (`body.error`), nicht den Fallback. Bei einem POST mit `validFrom=2024-02-30` (Form stimmt, Tag gibt es nicht) sieht der Verwalter im Dialog also den englischen Text «validFrom must be a real day», nicht «Beim Speichern ist ein Fehler aufgetreten…». Die Aussage im Auftrag («unverändert: der Fallback-Text») stimmt nicht. Vorher erschien an dieser Stelle der Text der Datenbank, die Lücke bestand also schon. Über die Oberfläche ist der Fall nicht erreichbar, denn das versteckte Feld enthält nur gespeicherte Tage. Er verstösst aber gegen die Regel in CLAUDE.md: «backend refusal … carries a code … never the backend's own text». Behebung: ein Code (z. B. `ADVANCE_DAY_INVALID` mit `backend_advance_day_invalid` in allen vier `messages/*.json`) oder eine BFF-Antwort, die bei 400 ohne Code den Fallback zeigt. Ein BFF-Test mit `validFrom: '2024-02-30'` und einer Antwort ohne Code zeigt den heutigen Text. |

Kein Blocker, kein Major.

## Urteil zur Umklassierung (Frage des Aufrufers)

Die Umklassierung ist ehrlich. Gründe:

- Die Regex trifft keine fachliche Entscheidung mehr. Sie ist strikt schwächer als die Regel: `2024-02-30` und `2024-13-45` kommen durch, und nur das Backend (`isRealDate`) entscheidet, ob es den Tag gibt. Im BFF bleibt nur die Form eines Pfadsegments, wie bei der UUID-Prüfung in `buildings/[id]/+page.server.ts:20`. Diese steht mit dem gleichen Grund («a form posts, checked before it goes into a backend URL») schon in `technical`.
- Eine Prüfung im BFF ist für den Pfadschutz nötig. `encodeURIComponent` hilft nicht: Nach dem WHATWG-URL-Standard gelten auch `%2e` und `%2E` als Punktsegment, also normalisiert auch `…/advance-payments/%2e%2e` zu `/contracts/c1`. Solange der Tag im Pfad steht, braucht der BFF eine Prüfung des Segments. Eine Allowlist der Form ist dafür die engste und zugleich einfachste.
- Der Warntext in `tools/fitness/fitness.ts:101` nennt «form input» als Fall fürs Backend. Gemeint ist eine fachliche Prüfung von Eingaben. Ein Pfadsegment, das der Formularwert nur transportiert, fällt nicht darunter, wie der UUID-Eintrag zeigt.
- Ganz ohne BFF-Regel ginge es nur über eine Änderung der API, etwa `DELETE /contracts/:id/advance-payments?validFrom=…`. Dann genügt `URLSearchParams`, und Punktsegmente sind kein Thema mehr. Das bedeutet aber einen neuen Vertrag, eine neue Route und einen geänderten BFF-Test und bringt nichts, was die Umklassierung nicht schon leistet. Ich würde es nicht verlangen.

Geprüft: Diff aller sechs Dateien gelesen. Der neue Backend-Test schlägt ohne die Änderung fehl, weil PostgreSQL für `kein-datum` und `2024-02-30` eigene Fehlertexte liefert, die `errorBody` weitergibt. Der BFF-Test «sendet kein Löschen für etwas anderes als einen Tag» (`src/__tests__/contract-actions.test.ts:578`) deckt den verbleibenden Pfadschutz ab. Die Einträge in `ratchet.json` stimmen zeichengenau mit Zeile 352 überein. Die Texte in baseline/utility-tree sind als «gelesen» markiert. Der Diff enthält nichts, was nicht zum Auftrag gehört. Ohne sichtbare Verhaltensänderung braucht es kein Szenario. Vor C-1 fehlte der Code ebenfalls.

## Nicht bestätigt

- `contract-advance.pg.test.ts` und `api-contracts.pg.test.ts` (93 pass), der erste Lauf rot: vom Aufrufer gemeldet, Backend-Tests nach Auftrag nicht ausgeführt.
- `contract-actions.test.ts` und `tools/fitness` vitest (64 pass): vom Aufrufer gemeldet.
- `bun run fitness -- --base origin/main` (grün, Warnung `technical`), `bun run lint`, `bun run check`, Backend-Type-Check: vom Aufrufer gemeldet.
- Ä4 = 0 nicht nachgemessen, nur am Diff der Ratchet gelesen (`exceptions.bffDecisions` ist jetzt leer).
