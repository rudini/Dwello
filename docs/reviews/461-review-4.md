# Code-Review #461 / PR #514, Runde 4 (CI-Fix axe)

Delta: `git diff d5fb6b83 a079600f` (ein Commit `a079600f fix(tests): let the page settle before axe`, nur `tests/e2e/screenplay/questions.ts:197-205`). Worktree: review-461-code4.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde im Delta. |

Kein Blocker, kein Major.

## Ursache: stimmt

- Vor 6ecb2d75 (`git show 6ecb2d75^:src/lib/ui/focus-error.ts`) fokussierte `focusFirstError` direkt nach `await tick()`, also in derselben Microtask-Kette, in der der Fehler im DOM erscheint. Wenn `Wait.until(on.invalidPastEndConfirm)` (`tests/e2e/tasks/accessibility.ts:153`) den Fehler sah, war der Fokus schon gesetzt.
- Seit 6ecb2d75 (`src/lib/ui/focus-error.ts:9-11`) kommt dazwischen ein `setTimeout`. `aria-invalid` (das Ziel der Wartebedingung) steht schon im DOM, bevor der Timer läuft. Playwrights `scrollTo(0,0)` (eine CDP-Auswertung, also ein eigener Task) kann deshalb vor dem Timer laufen. Danach scrollt `focus()` die Seite zur Checkbox `contract-end-past-confirm`, und das Datumsfeld darüber (`start-date-input-calendar`, `src/lib/ui/DateInput.svelte:150-155`) liegt teilweise unter der Sticky-Kopfzeile (`src/lib/ui/Header.svelte:41`). Das passt genau zum CI-Befund (target-size an diesem Knopf, Tablet).

## Ist der Fix zuverlässig? Ja, und er hängt nicht von der Last ab

- Der neue `setTimeout(…)` in `questions.ts:202-204` wird erst nach der Wartebedingung eingereiht. Zu diesem Zeitpunkt steht der 0-ms-Timer von `focusFirstError` schon in der Warteschlange: `tick()` endet mit dem DOM-Update, und die Fortsetzung reiht den Timer noch in derselben Microtask-Phase ein, also bevor Playwright den Fehler sehen kann. Laut HTML-Spezifikation laufen Timer mit gleicher oder kleinerer Verzögerung, die früher gestartet wurden, zuerst. Die Reihenfolge ist also garantiert, auch unter Last. Es ist eine Reihenfolge-Garantie, keine geschätzte Wartezeit.
- `focus()` scrollt in Chromium synchron. Es gibt kein `scroll-behavior: smooth` (nur `auto` unter `prefers-reduced-motion`, `src/styles/tokens.css:80`). Die zwei `requestAnimationFrame` sind nur Reserve für das Layout. Sie schaden nicht und kosten pro axe-Prüfung zwei Frames.
- Einschränkung (kein Befund): Die Garantie gilt für Fehler, die mit einem einzigen Timer fokussiert werden. Würde `focusFirstError` später mehrere Timer verschachteln oder eine echte Verzögerung bekommen, reicht der eine Timer der Frage nicht mehr. Der Kommentar in `questions.ts:200-202` nennt `focus-error.ts` als Grund, die Kopplung ist also sichtbar.

## Koordinator Punkt 1: auf einen Zustand warten statt auf einen Timer

- Ein Warten auf `document.activeElement` passt nur in Zustände, die einen Fokus-Fehler haben. Im State-Task `endWithPastDate` (`tests/e2e/tasks/accessibility.ts:142-154`) ginge das, zum Beispiel mit «warten, bis `contract-end-past-confirm` fokussiert ist». Das deckt aber nur diesen einen Zustand ab. Dasselbe Rennen gibt es in allen Bildschirmzuständen, deren Fehler über `focusFirstError` kommen: `BuildingForm.svelte:61`, `ApartmentForm.svelte:73`, `ContractForm.svelte:203/216/227`, `ContractWizard.svelte:214`, `invoices/new/+page.svelte:97`, `invoices/[id]/edit/+page.svelte:83/93`, `config/SaveForm.svelte:57` und weitere. Jeder State-Task müsste das einzeln nachziehen.
- Die Frage selbst kann nicht allgemein auf einen Fokus warten, weil viele Bildschirme keinen Fehler haben.
- Weil der eine Timer nach der Reihenfolge-Garantie oben deterministisch ist, halte ich die Stelle in der Frage für die bessere: Sie gilt für alle Bildschirme. Ein Fokus-Warten in `endWithPastDate` würde nur diesen einen Fall robuster machen, ohne zusätzliche Sicherheit. Ich würde es nicht verlangen.

## Koordinator Punkt 2: ein echtes Problem für Benutzer?

- Es gibt kein `scroll-padding-top` und kein `scroll-mt` an Feldern (gesucht in `src`: nur `src/lib/ui/Panel.svelte:14-17` mit `scroll-mt-24` für Anker).
- Im CI-Fall lag nicht das fokussierte Feld unter der Kopfzeile, sondern das Datumsfeld darüber. Chromium scrollt bei `focus()` ein nicht sichtbares Element in die Mitte (center-if-needed), das fokussierte Element selbst bleibt also sichtbar. Ein Element weiter oben, das teilweise unter der Sticky-Kopfzeile liegt, ist eine normale Scrollposition, kein Fehler: Der Benutzer sieht es beim Scrollen. Für Chromium sehe ich kein Benutzerproblem.
- Firefox und Safari könnten bei `focus()` an der Oberkante ausrichten und das fokussierte Feld unter die 64 px hohe Kopfzeile legen. Das habe ich nicht geprüft (siehe unten).
- Falls das zutrifft, bestand es schon vor #479: Das Fokussieren gab es schon vor 6ecb2d75, #479 hat nur den Zeitpunkt verschoben. Es gehört nicht in diesen PR. Am ehesten passt eine Zeile in `docs/design/offene-punkte.md` (Usability/Accessibility, «fokussiertes Feld unter der Sticky-Kopfzeile in Firefox/Safari prüfen; `scroll-pt-*` am `html`»), nicht als Befund dieses Reviews. Einen passenden Eintrag gibt es noch nicht (gesucht nach «sticky/header/scroll»: nur U-3, U-6, U-7, keiner davon trifft es).

## Weitere Prüfpunkte

- Konventionen: Nur Test-Code, die Screenplay-Schichten bleiben unverändert (die Frage nutzt `pageOf(actor)` wie bisher). Keine UI-Texte, keine Verträge, kein Feature betroffen.
- Rot-Test: Es ist ein Fix für einen sporadischen CI-Fehler. Ein deterministisches Rot lässt sich lokal nicht erzwingen. Die Begründung oben (Rennen zwischen CDP-Task und Timer) ist schlüssig.
- Ponytail: Ein Ausdruck, nichts Unbenutztes, keine Kopie eines bestehenden Helfers.
- Nichts Fremdes im Delta.

## Nicht bestätigt

- `bunx eslint tests/e2e/screenplay/questions.ts` grün: vom Aufrufer gemeldet.
- Lokal die 22 `contract-edit`-Zeilen dreimal grün: vom Aufrufer gemeldet (kein E2E gestartet, wie vorgegeben).
- Dass der CI-Job 118488770583 mit dem Fix grün wird: nicht geprüft, nur aus Code und Timer-Reihenfolge abgeleitet.
- Wie Firefox und Safari bei `focus()` unter einer Sticky-Kopfzeile scrollen: nicht geprüft, kein Browser gestartet. Gesucht wurde nur in `src` nach `scroll-padding`/`scroll-mt`/`scroll-pt`.
