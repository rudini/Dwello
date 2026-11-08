# Review 1305, Runde 2 (Abschlussrunde)

Delta: `git diff a0eae0f 42c5f8e -- . ':!docs/reviews'` (nur `backend/src/__tests__/distribution-key-admin.pg.test.ts`, +8 Zeilen).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1

Geprüft: Der neue Test (`distribution-key-admin.pg.test.ts:63-69`) legt «Ost West» an und erwartet 201 für «Ost\ West». Ohne `\\` in der Escape-Klasse (`distribution-key.service.ts:124`) wird das Muster zu `Ost\ West …`, also einem escapten Leerzeichen, das unter ILIKE auf «Ost West …» passt. Damit gibt es 409 und der Test wird rot. Er belegt also das, was C-1 verlangt. Der Titel sagt, was der Test prüft; die Commit-Nachricht nennt C-1 und `Refs #1305`. Im Delta steht nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bun test src/__tests__/distribution-key-admin.pg.test.ts` mit 17 grünen Tests, «vom Aufrufer gemeldet».
- Roter Lauf ohne `\\` in der Escape-Klasse, «vom Aufrufer gemeldet» (durch Lesen als plausibel beurteilt, siehe oben).
- ESLint und Prettier auf der Datei, «vom Aufrufer gemeldet».
- `bun run lint`, `bun run check`, `bun run fitness` und der Backend-Type-Check auf a0eae0f, «vom Aufrufer gemeldet».
