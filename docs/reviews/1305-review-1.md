# Code-Review Slice 1305, Runde 1

Commit: a0eae0f (`git diff origin/main HEAD`, 2 Dateien)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/distribution-key.service.ts:124 | Das Escapen von `\` ist ungetestet: Nimmt man `\\` aus der Zeichenklasse, bleiben alle Tests grün. Dabei ändert es Verhalten: Ein Name mit `\` (z. B. «A\B») passte vorher auch auf «AB». Jetzt passt er nur noch auf den gleichen Namen. Ohne `\\` in der Klasse würde ein Name wie «70\%» wieder als Platzhalter gelesen. Es fehlt ein pg-Test, etwa: «A B» ist vergeben, «A\ B» wird angenommen. |

Keine Blocker oder Major.

Geprüft: Der Fix macht, was die Anforderung verlangt. Mit `standard_conforming_strings` gilt in PostgreSQL bei `ILIKE` der Backslash als Escape-Zeichen; der Wert geht als Parameter an die Datenbank. Der einzige Aufrufer ist `ensureNameIsFree` (Zeile 138), und zwar beim Anlegen und beim Umbenennen, für `name` und `nameDE`. Die beiden neuen Tests in `distribution-key-admin.pg.test.ts:46-61` wären ohne den Fix rot, weil die Muster «70% Fläche <token>» und «Haus_A <token>» auf die vorher angelegten Namen passen. Die Tests sind über `token` vom Rest isoliert. Den Fall «Kein Szenario» deckt das Issue ab. Es gibt kein bestehendes Escape-Hilfsmittel, das man hätte nutzen können (`grep -rni escape backend/src`), also auch keine Kopie. Ponytail: Der Diff ist minimal und lässt nichts Unbenutztes zurück. Commit-Betreff: 46 Zeichen, Conventional Commit. Der Diff enthält nichts, was nicht zur Anforderung gehört. Texte, UI, Verträge und E2E sind nicht betroffen.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun test src/__tests__/distribution-key-admin.pg.test.ts` (16 bestanden, die zwei neuen Tests vor dem Fix rot mit 409), `bun run type-check` (sauber), ESLint und Prettier auf beiden geänderten Dateien (sauber). Ich habe nichts davon selbst ausgeführt.
- Ob ein Name weiterhin ohne Rücksicht auf Gross- und Kleinschreibung verglichen wird («wie bisher»), zeigt kein Test. In `backend/src/__tests__/distribution-key*.ts` gibt es keinen Test, der die Schreibweise variiert. Der Code ändert an diesem Verhalten nichts, weil weiterhin `ilike` vergleicht.
