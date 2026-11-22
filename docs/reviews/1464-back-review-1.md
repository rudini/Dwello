# Code-Review #1464 Nachtrag (Rückweg zum Abrechnungslauf), Runde 1

Bereich: `git diff 8f30570 64417b1` (6b36006, 64417b1), Worktree `review-1464-back-code`.

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | src/routes/invoices/[id]/+page.svelte:92 | «Bearbeiten» auf der Detailseite gibt `returnTo` nicht weiter (`href="/invoices/{invoice.id}/edit"`). Wer die Rechnung aus der Kostenabstimmung der Vorschau öffnet, bearbeitet und speichert, landet über `edit/+page.svelte:61` (`data.returnTo ?? /invoices/{id}`) auf der Detailseite ohne `returnTo`. Die Brotkrumen zeigen dann wieder «Rechnungen», der Weg zurück zum Abrechnungslauf ist weg. Dabei sagt der Lauf nach der Rückkehr gerade «berechnet … neu, mit den Rechnungen, wie sie jetzt sind» (`statements_resume_invoice`), rechnet also mit einer Änderung. Die Anforderung nennt nur den Link zurück, deshalb Minor. Behebung: `returnTo` auch an den Bearbeiten-Link anhängen. |

Keine Blocker, keine Major.

Geprüft: Weitergabe von `back` in allen drei Stellen der Kostenabstimmung (mobile Liste, Tabelle, Extras); «Berichte» ohne `back`, also unveränderte Links; `localPath` gegen fremde Adressen (wie bei new/edit) und im Load getestet; Reload hält den Rückweg, weil `returnTo` in der Adresse steht und serverseitig gelesen wird; Label `m.dashboard_create_statements()` ist der Seitentitel des Assistenten und steht in allen vier Sprachen, kein neuer Text; keine neue Zeile in `tests/a11y/screens.json` vertretbar, weil dasselbe Steuerelement nur mit anderem Ziel und einem schon übersetzten Text erscheint (keine Variante mit eigenen Steuerelementen); Spec-Änderung am Schritt «auf der Detailseite der Rechnung» betrifft nur den Pfadvergleich, wie in #1464 entschieden, und die Szenariotexte bleiben gleich; neues Szenario ohne `@wip`, Schritt ruft nur den Task `chooseBreadcrumb`; der Schritt «im Schritt "Heizprofil und Verwaltungspauschale"» setzt über `restoredStep` eine vollständig wiederhergestellte Auswahl voraus und deckt damit «mit allen Eingaben» ab. Rot ohne Änderung: die neuen DOM-Tests und der Load-Test (ohne Änderung `undefined` statt Pfad bzw. `null`); «führt sonst … zur Rechnungsliste» hält Verhalten fest, das der Basis-Commit schon zeigt (so im Commit vermerkt). Die `url`-Ergänzungen in `invoices.test.ts`/`invoices-i18n.test.ts` sind nötig, weil der Load jetzt `url` liest. ponytail-review: kein ungenutzter Code, keine Kopie eines Helpers.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (6 Dateien, 315 Tests), `bun run fitness -- --base origin/main --structure`, `cd backend && bun run type-check`, E2E chromium auf statement-cost-reconciliation.feature, reports.feature und statement-detail.feature (198 bestanden), Commit-Hooks.
- Den Rot-Lauf des neuen Szenarios an den fehlenden Brotkrumen habe ich nur durch Lesen beurteilt: ohne die Änderung fehlt der Link «Abrechnungen erstellen», und `chooseBreadcrumb` schlägt fehl.
