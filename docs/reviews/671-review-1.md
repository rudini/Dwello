# Code-Review #671, Runde 1 (Abschlussrunde), 683661b80..c8b5c6a6e

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | messages/fr.json:180-181, messages/en.json:180-181 | `privacy_mail_smtp` und `privacy_mail_resend` sind in fr/en geändert, aber kein Test zeigt sie: Das neue Szenario läuft nur mit der Variante `privacy_mail_smtp_provider` (MAIL_PROVIDER_NAME in playwright.config.ts, vgl. privacy.feature:105). `src/__tests__/privacy-i18n.dom.test.ts` rendert die Seite schon pro Sprache mit `recipient`/`mail` aus `data` und könnte die beiden anderen Varianten (`mail: 'smtp'` ohne Anbieter, Resend) auf der niedrigsten Ebene abdecken. |
| C-2 | Minor | tests/e2e/features/privacy.feature:112 | Der Titel «nennt in jeder Sprache Zahlungserinnerungen und Mahnungen» stimmt nicht mit den Beispielen überein: Es gibt nur Zeilen für fr und en, de und it fehlen. Entweder kommen Zeilen für de/it dazu (diese zeigen Verhalten, das schon besteht, und brauchen keinen Rot-Lauf), oder der Titel nennt nur die Sprachen, die geprüft werden. |

Keine Blocker, keine Major.

Geprüft: Button.svelte:88 setzt `noopener noreferrer` für jeden Link mit `target`. Damit ist auch «Route planen» abgedeckt (BuildingCard.svelte:52); die übrigen `target="_blank"`-Links sind ebenfalls `Button` und zeigen auf dieselbe Origin, für sie ist das unschädlich. Der DOM-Test (ui-button.dom.test.ts:46) schlägt ohne die Änderung fehl. Die Wortlaute in fr/en entsprechen genau Fachreview 671-1, V-1 und V-2, und dem Glossar (i18n-begriffe.md:110). Das neue Szenario schlägt mit den alten Texten fehl und nutzt den bestehenden Schritt (app-frame.steps.ts:92); es gibt keine Änderung an Schritten. de und it sind unverändert. Es gibt keinen neuen Bildschirm und keine neue Datei (Prettier entfällt). Der Diff enthält nichts, was nicht zur Anforderung gehört, und ponytail-review ergibt keinen Befund.

## Nicht bestätigt

- ui-button.dom.test.ts rot, dann grün: vom Aufrufer gemeldet.
- Das neue Szenario mit @wip rot, ohne @wip grün, und privacy.feature mit 37 passed in Chromium: vom Aufrufer gemeldet.
- vitest auf den privacy-Tests (148 passed): vom Aufrufer gemeldet.
- `bun run lint`: vom Aufrufer gemeldet, und nur vor der Änderung der Texte. Seither sind nur JSON- und .feature-Dateien geändert, die ESLint nicht prüft (nicht nachgeprüft).
- Ob der Browser bei «Route planen» tatsächlich keinen Referer sendet: Das habe ich nur am Attribut gelesen, nicht im Netzwerk beobachtet.
