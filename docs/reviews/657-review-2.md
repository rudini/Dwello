# Code-Review #657, Runde 2 (Delta 32d569e..cc63d67)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1 (Entscheid Option A vom 2026-11-08, gesichert durch das neue Szenario in authentication.feature:138), C-2, C-3, C-4, C-5.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, vitest shell.dom, language-switcher.dom, app-frame.dom, open-work, feature-wording und e2e-screenplay-lint (108). Ebenso E2E chromium navigation/sprachen/authentication (108) und der Rot-Lauf der zwei neuen shell.dom-Tests vor der Änderung an MobileNav. Beim Lesen schlagen beide ohne die Änderung fehl: Ohne die Prüfung auf `#language-menu` schliesst Escape den Dialog. Ohne `:not([tabindex="-1"])` geht Tab vom Sprachknopf auf die Fläche mit `aria-hidden`, die im DOM als nächste kommt.
- Ob «Anmelden» mit Konto mit Passwort auf dem Basis-Commit schon bei 390 × 844 im Bild war: Das sagt nur die Commit-Nachricht. Das neue Szenario hält gemäss Workflow 2 bisheriges Verhalten fest und braucht keinen Rot-Lauf. Gemessen habe ich nichts.
- Die Lock-Erneuerung (`utimesSync` alle 20 s) habe ich nur gelesen. Der Fall mit einem Szenario über 60 s ist nicht nachgestellt.

Geprüft: Reihenfolge der Fenster-Handler (MobileNav wird vor dem LanguageSwitcher im Menü eingehängt, der Kommentar stimmt), `passwordSignInShownShare` (Frage nach dem Wert, Ziel `passwordSubmitButton`), Schritt mit `seed.localAccount()` und Sperre, Gherkin-Wortlaut, `stateMeanings` gegen MobileNav und LanguageSwitcher, keine neuen Texte oder Zustände, Persona-Berichte nur in docs.
