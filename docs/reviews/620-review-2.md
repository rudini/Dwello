# Code-Review #620, Runde 2 (Schlussrunde vor dem Push)

Bereich: `git diff 1e0f8b8 6440c9b -- . ':!docs/reviews' ':!docs/design/personas'` (946809d, 6440c9b), Worktree `review-620-close` (6440c9b).

## Status der offenen IDs aus `docs/reviews/620-review-1.md`

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | erledigt | `backend/src/__tests__/setup.pg.test.ts:165-167` prüft jetzt `created.status` 201. Ohne `&& !llmConfig.byOperator` (`backend/src/services/setup.service.ts:50`) würde `saveKiSettings` die Antwort ändern, damit ist die Prüfung rot. |
| C-2 | erledigt | Der Hinweis lautet jetzt «Es ist «Keine KI» gewählt. Sie erfassen Rechnungen von Hand. Eine KI wählen Sie unter «Einstellungen» › «KI».» (`messages/de.json:2053-2055`). Das stimmt nach «Später entscheiden» und nach «Keine KI» und nennt die Option mit dem Wortlaut von `ki_settings_none` (`messages/de.json:2008`). Abgedeckt durch `src/__tests__/dashboard-page.test.ts:83-90` und `tests/e2e/features/einrichtung.feature:91`. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine |

Geprüft:
- Übersetzungen: `ki_none_*` und `setup_ki_later_help` in fr, it und en nennen die Option wie `ki_settings_none` derselben Sprache («Pas d’IA», «Nessuna IA», «No AI») und die Seite wie `nav_settings` › `ki_settings_title`.
- Stil nach `docs/design/i18n-begriffe.md:5`: fr mit Guillemets und geschütztem Leerzeichen innen (U+00A0 an allen 6 Stellen geprüft), it und de ohne Leerzeichen; Sie, vous und Lei; Begriff IA/AI nach Zeile 69.
- Rote Tests (durch Lesen): Die geänderten Erwartungen in `dashboard-page.test.ts` und der neue Test in `src/__tests__/setup-ki.dom.test.ts:18-24` («Dwello speichert «Keine KI».», kein «Anbieter») schlagen mit den alten Texten fehl.
- Die alten Texte stehen nirgends mehr in `src` und `tests`. Ausnahme ist der Testname in `src/__tests__/dashboard.test.ts:304`, der nicht zum Delta gehört.
- Keine neuen Screens oder Zustände, keine fachfremden Änderungen.

## Nicht bestätigt

- bun run lint, bun run check, bunx vitest run (komplett), backend `setup.pg.test.ts` (15 grün) und E2E-grep «Einrichtung|einricht|KI» (92 bestanden): vom Aufrufer gemeldet, nicht neu ausgeführt.
- Dass die Operator-Prüfung ohne `&& !llmConfig.byOperator` rot wird: vom Aufrufer gemeldet. Ich habe es nur durch Lesen plausibel gemacht. Wie `saveKiSettings` bei einer Konfiguration durch den Betreiber antwortet, habe ich nicht nachgelesen.
