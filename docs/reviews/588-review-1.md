# Code-Review #588, Runde 1 (10d12ed..689e360)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/server/statement-generation.ts:380 | Geänderte Zeile ohne Test: Das Laden der Heizprofile in `invoicesInPeriod` ist auf `limit=1000` gestellt, aber kein Test zeigt, dass ein Heizprofil jenseits der ersten 100 gefunden wird. |

## C-1 (Minor): kein Test für die Heizprofile in invoicesInPeriod

Belege: Die Heizprofile von dort gehen in `nameOf` / `editedSince` (statement-generation.ts:268–290). Ein Entwurf, dessen Heizprofil nach Platz 100 kommt, verlöre ohne den Fix den Hinweis «Heizprofil seither geändert» (`profileEdited` bliebe `null`) oder den Namen des verwendeten Profils (`profile.used` leer). Ein Nutzer sieht das. Darum gilt CLAUDE.md, Workflow 2: Jeder Bugfix bekommt einen Test, der ihn reproduziert.

Ein Test dafür kostet wenig. In `src/__tests__/statement-generation.test.ts:647–665` gibt es schon `fetchWith(..., known = profiles)`. Mit 150 Profilen, einem Fake, der `limit` beachtet (wie in `master-data-lists.test.ts`), und einem Entwurf auf `hp120` mit `updatedAt` nach dem Entwurf erwartet der Test `profileEdited: 'Eintrag 120'`. Auf 10d12ed ist er rot. Die Begründung des Aufrufers («gleiche Ein-Wort-Änderung») ersetzt diesen Test nicht. Weil die Zeile aber genau dem Muster der getesteten Zeilen folgt, blockiert der Befund den Merge nicht.

## Antworten auf die Fragen des Aufrufers

- **Bleibt irgendwo `limit=100` für diese Listen?** Nein. In `src` fragt kein Ladevorgang für Verteilschlüssel oder Heizprofile mehr ohne `limit=1000`. Geprüft per grep über `src`, ohne `__tests__`. `src/lib/server/statement.ts:169` (`namesById`) nutzt schon `limit=1000` (#585). Die BFF-Route `src/routes/api/distribution-keys/+server.ts` reicht nur die Parameter des Clients weiter, und kein Client-Code ruft die Liste auf (grep nach `api/distribution-keys`). Eine BFF-Route für Heizprofile gibt es nicht. Die übrigen `limit=100` (Verträge, Wohnungen, Abrechnungen im Dashboard) liegen ausserhalb von #588.
- **Nimmt das Backend `limit=1000` an, ohne eigene Obergrenze?** Ja. `backend/src/routes/heating-profiles.ts:27` und `distribution-keys.ts:28` reichen `parseInt(query.limit)` unverändert weiter. Das Schema ist nur `t.Optional(t.String())`. Die Services (`heating-profile.service.ts:53`, `distribution-key.service.ts:36`) setzen nur den Standardwert 100 und kappen nicht.
- **Ist der fehlende Test für invoicesInPeriod vertretbar?** Siehe C-1. Er ist leicht zu schreiben und sollte nachgezogen werden, blockiert aber nicht.

Geprüft: Alle sieben Ladevorgänge aus dem Issue sind umgestellt; die Rechnungsseiten (Liste, Neu, Detail, Bearbeiten) laufen alle über `invoiceChoices`. Die neuen Tests in `master-data-lists.test.ts` wären auf der Basis rot (der Fake liefert ohne bzw. mit `limit=100` nur 100 Einträge). Der Test in `heating-profiles.test.ts` ist nachgeführt. Der neue Vertrag `distribution-keys.json` wird in `api-contracts.pg.test.ts` gegen die echte API geprüft. Die Begründung «No scenario» folgt dem Muster von #583/#585. Der Diff enthält nichts, was nicht zur Anforderung gehört, keine UI-Texte und keine ungenutzten Reste.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet; ich habe sie nicht selbst wiederholt: `master-data-lists.test.ts` vorher rot, nachher grün; `bunx vitest run --changed origin/main` (321 grün); lint; check; Backend-Type-Check; `api-contracts.pg.test.ts` gegen die echte API.
- Ob die Backend-Liste `description` und `invoiceCount` liefert, die `toDistributionKey` liest: Der neue Vertrag führt diese Felder nicht, und kein neuer Test liest sie. Ich habe es nicht gegen die API geprüft.
