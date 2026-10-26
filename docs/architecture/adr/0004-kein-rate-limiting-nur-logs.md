# ADR 0004: Kein zusätzliches Rate Limiting, Fehler nur im Log

- **Status:** angenommen (Product Owner, 26.10.2026, #725)
- **Szenario:** Sicherheit und Betrieb einer selbst betriebenen Installation für einen Vermieter

## Kontext

Weder die Web-App (`src/hooks.server.ts`) noch das Backend (`backend/src/app.ts`) begrenzen Anfragen. Für den Betrieb gab es kein Monitoring; `SENTRY_DSN` stand in `.env.example`, las aber nichts.

Eine Installation hat einen Vermieter (Einzelnutzer-MVP, unter 50 Wohnungen). Das Erraten von Zugangsdaten ist schon begrenzt:

- 5 falsche Passwörter sperren das Konto für 15 Minuten (`backend/src/services/local-account.service.ts`).
- 5 falsche Einrichtungscodes sperren die Einrichtung für 15 Minuten (`backend/src/services/setup.service.ts`).
- Die Anmeldung mit Google begrenzt Google selbst.
- Seit #719/#753 ist nur die Web-App von aussen erreichbar.

## Entscheidung

1. **Kein zusätzliches Rate Limiting**, weder auf den Anmelde-Routen noch auf allen Routen. Wer mehr will, drosselt im Reverse Proxy (`docs/installation.md`, Abschnitt 8).
2. **Fehler nur im Log** des Servers (`docker logs`), über `src/lib/server/error-handler.ts` und die Ausgaben des Backends. Kein Error-Tracker wie Sentry; `SENTRY_DSN` ist aus `.env.example` entfernt.

## Verworfene Optionen

- **Anmelde-Routen pro IP begrenzen:** schützt zusätzlich vor vielen Versuchen auf verschiedene Adressen. Bei einem einzigen Konto deckt die Kontosperre das schon ab. Die Begrenzung hätte Code und eine neue Meldung in vier Sprachen gebraucht.
- **Alle Routen begrenzen:** könnte die eigene Arbeit stören (viele Rechnungen hochladen), mit dem meisten Aufwand.
- **Sentry wahlweise:** Fehlermeldungen können Mieterdaten enthalten. Die Datenschutzerklärung müsste den Empfänger nennen, und der Vermieter würde ein weiteres Werkzeug kaum ansehen.
- **Strukturierte Logs (JSON):** brächte erst einem Betreiber mit eigenem Werkzeug etwas.

## Tradeoffs und verbleibende Risiken

- Viele Anfragen auf die Web-App (Überlastung) bremst Dwello selbst nicht. Dafür ist der Reverse Proxy oder der Hoster zuständig.
- Fehler im Betrieb bemerkt nur, wer `docker logs` liest. Dwello meldet sie niemandem.
- Ändert sich die Annahme «ein Vermieter pro Installation», etwa durch mehrere Konten, ist dieser Entscheid neu zu prüfen.
