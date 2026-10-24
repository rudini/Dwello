# Code-Review noindex, Runde 1 (53cda08, d7e699e..HEAD)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `/login` ohne Sitzung läuft `handle` → `paraglideMiddleware` → `session` → `isPublic` → innerer `resolve`-Wrapper (`src/hooks.server.ts:46`, `:59-67`), der Header kommt also auf der echten Anmeldeseite an; der Test geht genau diesen Weg (kein Cookie, `/login`) und wäre ohne Zeile 66 rot (`null`). Mit Sitzung leitet `/login` per 303 ohne Header weiter, dort ist nichts zu indexieren. `/health`, API-Antworten, PDF/ZIP-Routen und Fehlerseiten bekommen den Header ebenfalls, was sie nicht verändert (Crawler lesen ihn nur). Die `+server.ts`-Routen, die das Backend aufrufen, geben neue `Response`-Objekte zurück (veränderbare Header); `Vary` wurde dort schon vorher mit `append` gesetzt, `set` bringt kein neues Risiko. Statische Dateien (`static/favicon.svg`) laufen am Hook vorbei, das ist unschädlich. Es gibt keine `robots.txt` mit `Disallow`, Crawler können den Header also lesen. `nofollow` passt: die Anmeldeseite verlinkt nur `/help`, `/privacy` und `/terms`, und die tragen selbst `noindex`. Commit-Betreff (50 Zeichen, Scope `middleware`) und `No scenario:` sind vorhanden. Es gibt keine UI-Texte, also nichts für `messages/*.json` oder a11y.

## Nicht bestätigt

- Umfang des PO-Entscheids: Die Anfrage nennt die Login-Seite, der Aufrufer meldet die Zustimmung für «die App selbst». Damit sind auch die öffentlichen Seiten `/help`, `/privacy`, `/terms` und `/setup` (`src/hooks.server.ts:13`) `noindex`. Die Annahme des Aufrufers, alle anderen Seiten lägen hinter der Anmeldung, stimmt für diese vier nicht. Ich habe keinen schriftlichen Entscheid gefunden (keine Issue genannt; `docs/PRD-Dwello.md` und `docs/architecture/` erwähnen weder noindex noch Suchmaschinen). Das ist eine Frage an den PO, kein Code-Defekt.
- `bunx vitest run src/__tests__/hooks.server.test.ts`: von mir erneut ausgeführt, 10 passed.
- Rot vor der Änderung, `bun run lint` und Prettier: vom Aufrufer gemeldet. Das Rot ist durch Lesen plausibel (ohne Zeile 66 ist der Header `null`).
- Verhalten hinter dem Reverse-Proxy von demo.dwello.ch (ob der Proxy Header entfernt): nicht prüfbar. Ich habe nur `src/hooks.server.ts` und die Routen gelesen.
