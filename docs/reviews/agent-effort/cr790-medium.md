# Code-Review #790 Teil a (ddce6ae..56635d3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/routes/invoices.ts:198-200 | Seit dem strengen `format: 'date'` des Plugins lehnt das Schema einen Tag, den es nicht gibt, schon mit 422 ab. Die `isRealDate`-Prüfungen von `periodStart`/`periodEnd` sind damit toter Code, und der 400-Text «must be existing dates» nennt einen Fall, der nicht mehr eintritt. Übrig bleibt nur `periodEnd < periodStart`. |
| C-2 | Minor | docs/api-specification.md:278, :135 | Die Spezifikation sagt bei `PUT /statements/:id` noch «400 date that does not exist». Ab diesem Commit antwortet das Schema mit 422 `VALIDATION_ERROR`, und zwar für alle `t.String({ format: 'date' })`-Felder, z. B. `paymentDeadline`, `startDate` und `periodStart`. Bei `/completeness` fehlt der neue 422-Fall für Tage, die es nicht gibt. Der Text ist jetzt falsch. |
| C-3 | Minor | backend/package.json:31 | Formatänderung ohne Bezug zur Anforderung (`"e2e-purge-statements":"…"` → mit Leerzeichen). Sie stammt vermutlich vom package.json-Writer von bun. Sie ändert nichts, gehört aber nicht zur Abhängigkeitsänderung. |

Keine Blocker oder Major.

Geprüft: Plugin-Wechsel in app.ts (`exclude: { paths }`, Pfad `/swagger` und `/swagger/json` unverändert, ohne Anmeldung); api-docs.test.ts hält bestehendes Verhalten fest, und die Commit-Message sagt das (Workflow 2). Die Erwartung 400→422 in invoice-completeness.pg.test.ts passt zum neuen Schema. Der einzige Frontend-Aufrufer (`src/lib/server/statement-generation.ts:297`) fängt jeden Fehler ab, daher sieht der Benutzer keine Änderung, und es braucht kein Szenario. Die anderen Tests mit Tagen, die es nicht gibt (`run-defaults`, `paidDate`, `readingDate`, Akonto-`validFrom`), laufen über Felder ohne `format: 'date'` und behalten ihre codierten 400. zod-4-Nutzung (`z.string().email()`, `z.object`, `safeParse`) in auth.ts und local-account.service.ts ist API-kompatibel. tech-stack.md ist nachgeführt. Keine weiteren Verweise auf `@elysiajs/swagger`. Das Backend-Docker-Image installiert inklusive devDependencies, die Peer-Abhängigkeit `typescript` des Plugins ist also vorhanden. Keine UI-Texte, Contracts oder E2E-Dateien betroffen.

## Nicht bestätigt

- Lint, Backend-Type-Check und die betroffenen Backend-Tests auf 56635d3: vom Aufrufer gemeldet, nicht erneut ausgeführt (Backend-Tests laufen über `bun test` mit PostgreSQL, nicht über vitest).
- Ob wirklich `@elysiajs/openapi` das strenge `date`-Format registriert und dabei `uuid`, `email` und andere Formate von Elysia nicht lockerer überschreibt: `node_modules` ist auf einen Checkout ausserhalb des Worktrees verlinkt, und der Lesezugriff wurde verweigert. Belegt ist es nur durch die gemeldete grüne Ausführung von invoice-completeness.pg.test.ts.
- Frontend nach den Überschreibungen `cookie` 0.6→0.7.2 (Laufzeit von SvelteKit, Session-Cookies der BFF) und `postcss-selector-parser` 6→7 (eslint-plugin-svelte) sowie nach vite 6.4.5: kein Lauf von vitest, `bun run check` oder E2E gemeldet. Ein eigener vitest-Lauf wäre nicht aussagekräftig, weil die verlinkten node_modules nicht diesem Lockfile entsprechen.
- fallow 2→3.35 (Major-Sprung, Commit-Hook und CI): Kompatibilität der fallow-Konfiguration nicht geprüft, kein Lauf gemeldet.
- Prettier auf der neuen Datei `backend/src/__tests__/api-docs.test.ts`: nicht ausgeführt.
