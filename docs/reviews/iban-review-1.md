# Slice-Review «iban» (1. Runde): #191, Commit 7da8157

Gegenstand: `git diff 7da8157~1 7da8157` im Worktree `review-iban-code` (detached, 7da8157). Kontext: d03ec92 (@wip-Szenarien).

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | src/__tests__/settings.test.ts:147, src/__tests__/config-pages.test.ts:82 | Eigene geänderte Zeilen nicht Prettier-formatiert (`bunx prettier <file> \| diff` zeigt genau diese Zeilen; über 100 Zeichen) |
| C-2 | Nit | src/__tests__/settings.test.ts:162-169 | «lehnt eine IBAN aus Liechtenstein mit falscher Prüfziffer ab» ist schon ohne die Änderung grün (alte Regex weist jedes LI ab) und prüft weder `calls` leer noch die Meldung; schützt nur gegen eine zu lockere Umsetzung. `expect(calls).toEqual([])` wie im CH-Test ergänzen |
| C-3 | Nit | backend/src/services/qr-bill.service.ts:91, backend/src/services/config.service.ts:12 | Kommentare sagen noch «Swiss IBAN», obwohl die Regel jetzt überall CH oder LI ist (Datei in «Where» von #191; Diff fasst sie nicht an) |
| C-4 | Nit | src/lib/server/settings.ts:45 | Die Form-Regel (`(CH\|LI)\d{7}[A-Z0-9]{12}`, Bankclearing nur Ziffern) ist strenger als `validateIBAN` im Backend (`[A-Z]{2}\d{2}[A-Z0-9]{17}`). Nach IBAN-Register (`2!n5!n12!c`) ist die Form-Regel die richtige; die Abweichung ist harmlos (Form strenger), aber es sind weiterhin zwei Regeln für dieselbe Prüfung |
| C-5 | Nit | src/lib/server/settings.ts:45 | Verhaltensänderung nebenbei: CH-IBANs mit Buchstaben im Kontofeld werden jetzt angenommen (korrekt nach Register, vom fach-reviewer in V-5 verlangt), ohne eigenen CH-Testfall; die Buchstabenumrechnung deckt nur der LI-Test ab |

## Blocker/Major

Keine.

## Geprüft und bestätigt

- **Korrektheit:** `ibanChecksumValid` rechnet nun allgemein nach ISO 13616 (Länderkürzel und Prüfziffer ans Ende, A=10 … Z=35, mod 97 = 1); die Regex lässt nur `[A-Z0-9]` durch, `BigInt` kann also nicht werfen. `compact` macht Gross­schreibung, Kleinbuchstaben in der Eingabe gehen. `DE89 …` hat eine gültige Prüfziffer und wird wegen des Landes abgewiesen (Länderregel wirklich geprüft). `groupIban` gruppiert die LI-IBAN korrekt (E2E-Schritt «hinterlegt» zeigt `LI21 0881 0000 2324 013A A`). Das Backend (`config.service.ts:68-71` -> `validateIBAN`) nahm CH und LI schon an; die BFF war die einzige Sperre.
- **Texte:** `settings_error_iban` in allen vier `messages/*.json` geändert, nennt beide Länder; kein weiterer Text mit «Schweizer IBAN»/«Swiss IBAN»/«IBAN suisse»/«IBAN svizzero» in `messages`, `src`, `tests`, `docs` (ausser Archiv/Reviews).
- **PRD:** 5.10 (Z. 711, 714) und Tab 7 (Z. 1104) beschreiben eine Regel; `docs/api-specification.md:182` und `docs/data-model.md:384` sagten schon «CH or LI».
- **Tests (rot ohne Änderung, durch Lesen):** «nimmt eine IBAN aus Liechtenstein an» (alte Regex `^CH\d{19}$` weist ab); Szenario «IBAN aus Liechtenstein hinterlegen» (gleicher Grund); Szenario «Ungültige IBAN» und die angepassten Unit-Tests (alter Text). Beide Szenarien ohne `@wip`, Schritte bestehen schon (`tests/e2e/steps/settings.steps.ts`), keine neue E2E-Schicht-Logik.
- **Neue Bildschirme/Zustände:** keine (bestehender Fehlerzustand mit neuem Text); `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature` brauchen nichts.
- **Unbezogenes:** `docs/reviews/w3c-fachreview-1.md` ist der Bericht des fach-reviewer (Ablage nach skill `slice-review`), `implementation_plan.md` hakt Punkte ab; beides gehört zum Ablauf.
- **Sicherheit/Contracts:** keine API-Antwort geändert, keine Auth-Pfade berührt.

## Ponytail-Review

- `src/lib/server/settings.ts:L24-27`: Die Prüfziffer dupliziert `validateIBANChecksum` aus `backend/src/services/qr-bill.service.ts`; die BFF kann Backend-Code nicht importieren, und ohne eigene Prüfung gäbe es nur die allgemeine Meldung `settings_save_failed` statt der Feldmeldung. Bleibt.

Lean already. Ship.

## Nicht bestätigt

- `bunx vitest run src/__tests__/settings.test.ts src/__tests__/config-pages.test.ts`: von mir neu ausgeführt, 26 bestanden.
- E2E `bun run test:e2e -- --project=chromium -g "IBAN"` (2 bestanden): vom Aufrufer gemeldet, nicht neu ausgeführt (E2E verboten).
- `bun run lint`, `bun run check`: vom Aufrufer gemeldet, nicht neu ausgeführt.
- CH-Format `5!n12!c` (alphanumerisches Kontofeld): nicht an der Quelle (SWIFT-IBAN-Register) abgerufen; entspricht meinem Wissen und dem LI-Beleg im Szenario.
- Übersetzungsstil fr/it/en gegen `docs/design/i18n-begriffe.md`: nur grob gelesen («valable» wie im alten fr-Text).
