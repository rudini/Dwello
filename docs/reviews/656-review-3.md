# Code-Review Slice 656, Runde 3 (Delta 97e17e6..393140c)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Der Test «steht nach dem Wechsel wieder auf der Sprachwahl und nennt die Sprache» (`src/__tests__/language-switcher.dom.test.ts:64-79`) prüft, was sein Titel sagt. Der Wechsel läuft noch auf `de` (`choose('fr')` schreibt den sessionStorage-Eintrag). Danach liefert `overwriteGetLocale(() => 'fr')` über die Attrappe `getLocale: () => real.getLocale()` bei der neuen Montage `current = 'fr'`, ebenso `m.language_prefix()`. Erwartet wird «Langue : Français», das passt Byte für Byte zu `messages/fr.json:201` (U+00A0 = 302 240). Würde die Komponente die alte Sprache nennen oder `current` falsch lesen, wäre der Test rot. Die Attrappe gilt nur für diese Datei (`vi.mock` wirkt pro Datei). Das `finally` setzt `overwriteGetLocale(() => baseLocale)` zurück, so wie es `backend-error.test.ts`, `tenants-i18n.test.ts` und `privacy-i18n.dom.test.ts` auch machen. `sessionStorage.clear()` am Anfang schliesst Einträge früherer Tests aus. Der neue Test «öffnet das Benutzermenü mit der Pfeiltaste nach oben beim letzten Eintrag» (`src/__tests__/shell.dom.test.ts:104-110`) deckt den Pfad `!menuOpen` von `move()` in `src/lib/ui/Header.svelte:23-31` ab, zusammen mit `moveInMenu` (ArrowUp von ausserhalb führt auf `last`). Ohne #656 bliebe der Fokus auf dem Knopf, der Test wäre also rot. Das Delta enthält nur Tests und nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bun run lint` sauber, `bun run check` sauber, `bunx vitest run src/__tests__/language-switcher.dom.test.ts src/__tests__/shell.dom.test.ts` 33 bestanden: vom Aufrufer gemeldet.
- Rotlauf des französischen Tests mit «Sprache: Deutsch» vor der Korrektur der Attrappe: vom Aufrufer gemeldet; beim Lesen plausibel, weil der Originalexport `getLocale` am Override vorbei nicht neu gelesen wurde.
