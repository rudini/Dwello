# #675 Demo-Hinweis – Code-Review 3 (Schlussrunde, Runde 2)

Bereich: `git diff fdbb758 HEAD -- src` in /home/user/w-672 (f8a3ce3). Vorheriger Bericht: 675-review-2.md.

Geschlossen: C-3

Keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: login-view, help-page und public-pages-layout (46 bestanden), check 0, lint, Prettier, Demo-E2E (64 bestanden, auf fdbb758, nicht auf f8a3ce3).
- Ob der neue Testfall auf fdbb758 fehlschlägt, nur durch Lesen geprüft: Dort zeigte das `href` den ganzen Kontakt, also schlägt `toContain('href="mailto:betrieb@muster-hosting.ch"')` fehl.

Geprüft: Bei reiner Adresse, «Adresse, Telefon» und reiner Telefonnummer bleibt der Text erhalten, und der Link umfasst nur die Adresse. Ohne Adresse ist `head` der ganze Kontakt, und der Link fällt weg.
