# Code-Review 580, Runde 2 (8419e6c..403afe0, ohne docs/reviews, Plan, Personas)

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | geschlossen | `currentKi` fragt ohne Betreiber `llmRecipient` nicht mehr (`ki-settings.service.ts:87-91`); `index.ts:15` verweigert den Start mit `LLM_LOCAL_URL` ausserhalb des Servers; pg-Test «gilt ohne Einstellung die lokale KI, auch unter einer Adresse im eigenen Netz» war vorher 500. Restpunkte: C-11, C-16. |
| C-2 | geschlossen | `saveKiSettings` ruft `loadModel(local: false)` für «Keine KI» (Zeile 148) und für einen Anbieter (Zeile 171) auf; der pg-Test zeigt den Fall «Keine KI». Der Anbieter-Fall ist ungetestet (C-12). |
| C-3 | geschlossen | `saveProvider`, `saveMode` und `checkConnection` warten auf `kiSaveAnswer` bzw. `kiCheckResult` (`tasks/ki-settings.ts:54-67`). |
| C-5 | geschlossen | `ki-model-offline`, `ki-check-result` und `ki-saved` stehen in `screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature`; die Zustände laufen auf der frischen Installation unter der Sperre. Restpunkt: C-15. |

## Neue Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-11 | Minor | backend/src/config/llm.ts:57-59 | Die Startverweigerung rät «choose a provider under «Einstellungen» › «KI»». Das Backend startet in diesem Fall aber gar nicht, die Seite ist also nicht erreichbar. Zuerst muss `LLM_LOCAL_URL` entfernt oder auf den Server gelegt werden, und das sagt die Meldung nicht. |
| C-12 | Minor | backend/src/services/ki-settings.service.ts:171 | `void loadModel({ ...llmConfig, local: false })` nach dem Speichern eines Anbieters (C-2) hat keinen Test. Der neue pg-Test speichert nur `{ mode: 'none' }`; ohne die Zeile bleibt er grün. |
| C-13 | Minor | backend/src/services/ki-model.service.ts:24-33 | Die Korrektur von C-6 (Resolver pro Lauf) ist ein Bugfix ohne Test, der den Fehler zeigt: Ein zweiter `loadModel` während eines laufenden Downloads, danach `modelStarted()`. `ki-model.test.ts` ist im Delta unverändert. Der Plan (Zeile 28) nennt «tests seen red» nur für die Majors. |
| C-14 | Minor | docs/api-specification.md:239 | `/ki-settings/check` beschreibt `no-images` als «(any other refusal)». Seit 403afe0 (C-7, F-24) gilt das nur für 400; 404, 429 und 5xx ergeben `unreachable`. |
| C-15 | Minor | tests/e2e/tasks/accessibility.ts:675-678 | `localKiAnswersAgain` läuft nur, wenn `look` nicht wirft. Scheitert `Wait.until(kiModelOffline)` oder ein Schritt davor, bleibt die KI-Attrappe der frischen Installation `offline`. Die nächsten Szenarien von `frisch` beginnen dann mit einer KI, die nicht antwortet, denn `cleanUp` setzt sie erst am Ende auf `online`. Ein Fehler zieht so weitere nach sich (Regel «Isolation»). Abhilfe: in einem `try/finally` zurücksetzen. |
| C-16 | Minor | backend/src/__tests__/ki-settings.pg.test.ts:89-98; backend/src/services/ki-settings.service.ts:89 | Test und Kommentar sagen, die lokale KI gelte «auch auf einem anderen Rechner im Netz» bzw. «wherever LLM_LOCAL_URL says it runs». Damit verlangen sie, dass die Datenschutzerklärung bei einer LAN-Adresse «verlassen den Server nicht» sagt (`recipient: null`). Das widerspricht F-23 und dem README («A model on another machine is a provider»). Der Startcheck macht den Fall in Betrieb unerreichbar, der Test hält aber das Gegenteil des Entscheids fest. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun run lint`, `bun run check`, Backend `bun run type-check`, der volle `bunx vitest run` (3632), die Backend-`bun test` (ki-settings.pg, llm-recipient, ki-model, invoice-categorization.pg, invoice-extraction.pg, api-contracts.pg, compose-prod, setup.pg, local-account.pg), `bunx fallow audit`, alle E2E-Läufe (ki-einstellungen, einrichtung, privacy, axe- und Sprachzeilen) sowie `llm:eval` (47 von 48 vorher und nachher).
- Erneut ausgeführt: `bunx vitest run src/__tests__/ki-settings-page.svelte.dom.test.ts src/__tests__/ki-settings.test.ts`, 20 von 20 grün.
- Rot ohne die Änderung: nur gelesen. Plausibel für C-1, C-2 (Fall «Keine KI»), C-7 (503/404 ergaben vorher `no-images`), den Betreiber ohne Anbieternamen (`llmRecipient` warf vorher) und die BFF-Prüfung ohne Adresse. Für den DOM-Test «behält eingetippte Angaben» habe ich nicht nachgeprüft, ob Svelte den lokalen Wert eines nicht gebundenen `$bindable` bei gleichem String ohne die Momentaufnahme `start` wirklich überschreibt. Die Tests zu C-10 (`invoice-extraction.pg` «Keine KI») halten Verhalten des vorigen Slices fest. Die Commit-Nachricht 403afe0 sagt weder «seen red» noch «pins kept behaviour»; der Plan sagt «seen red» nur für Majors und Personas.
- Der Fokus nach «Verbindung prüfen» im echten SvelteKit: Der DOM-Test ersetzt `enhance` durch einen Mock. Ob SvelteKit den Fokus nach `update({ invalidateAll: false })` selbst zurücksetzt, ist nur mit dem Mock gezeigt, nicht im Browser (kein Szenario prüft den Fokus).
- C-8 (`.catch` am Start) hat keinen Test. `index.ts` läuft unter keinem Test, deshalb nur gelesen.
- Glossarzeilen (a408918) gegen den Wortlaut von «Decided» in #580: das Issue nicht gelesen, Sache des fach-reviewer.

Geprüft: Die Compose-Datei setzt keine `LLM_*`-Standardwerte mehr (Test compose-prod), `LLM_ENABLED=` leer gilt als nicht gesetzt. Persona-Stack mit `LLM_LOCAL_URL` und `ENCRYPTION_KEY`. Neue und entfernte Texte (`ki_settings_names_help` entfernt, zwei Hilfetexte und der Offline-Text neu) stehen in allen vier Sprachen. `kiSaveAnswer` folgt dem Muster von `formProblem`. Die Screenplay-Schichten sind eingehalten. `invalidateAll: false` nur bei der Prüfung, der Hinweis zum KI-Modell nur bei gewählter lokaler KI, die gesperrte Seite ohne Felder bei «Keine KI». Nichts im Delta hat mit der Anforderung nichts zu tun.
