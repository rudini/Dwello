# Code-Review W10-2 (Runde 2, Abschluss): #156 (B-16) und #155 (F-23)

Gegenstand: `git diff 2e135d9 552536c` im Worktree `review-w10-code2` (detached, 552536c). Alle 18 geänderten Dateien gelesen; die drei Berichte (`w10-fachreview-2.md`, `helga-b16.md`, `weber-f23.md`) nur in den Befunden, auf die der Commit antwortet (M-1, P-1, P-3, P-9). `w10-review-1.md` ist der Vorbericht, unverändert übernommen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/contracts/new/OpenContracts.svelte:15, src/routes/contracts/new/ContractWizard.svelte:248,265 | Die stets vorhandene `role="status"`-Hülle ist ohne offenen Mietvertrag leer, belegt aber in der `flex flex-col gap-6`-Section einen eigenen Platz: Im Schritt «Wohnung» steht jetzt bei jedem Mieter ohne offenen Vertrag ein zusätzlicher Abstand von 24 px zwischen Überschrift und Auswahl «Wohnung». Abhilfe zum Beispiel: Hinweis in die bestehende Status-Hülle von `ApartmentStep.svelte:47` legen, oder die Hülle mit dem Select zusammen in einen Block setzen. |
| C-2 | Nit | messages/de.json:629 (und fr/it/en) | Unter «Bearbeiten» erscheint der Text auch bei einem Vertrag, der schon ein Vertragsende hat. Dort liest sich «erfassen Sie eines erst, wenn …» schief, weil schon eines erfasst ist. Den Kern von M-1 (zweiter Punkt) behebt «Ändern Sie das Vertragsende deswegen nicht». Die Wortwahl prüft der fach-reviewer in Runde 3. |
| C-3 | Nit | messages/en.json:629,631 | «enter under «Address» of the tenant the address …» ist im Englischen holprig (etwa: «enter the address where mail for the heirs should go in the tenant’s «Address»»). |
| C-4 | Nit | src/__tests__/contract-edit.dom.test.ts:148-159 | P-9 (Hilfe in zwei Absätze geteilt) ist nur über `textContent` geprüft; ob die Teilung erhalten bleibt, zeigt kein Test. Das ist Layout ohne Verhalten, daher vertretbar. |

Keine Blocker, keine Major.

## Vorbericht W10-1: Stand

- C-1 (Kommentar im Step): erledigt. Der Kommentar verweist jetzt auf `contract-wizard.test.ts` (`tests/e2e/steps/contract-form.steps.ts:347`). Die Prüfung nur der Adresse bleibt wie im Vorbericht als Muster bestehen.
- C-2 (Live-Region): erledigt mit `OpenContracts.svelte:15`. Die Hülle entsteht beim Wechsel auf Schritt 2, vor dem Laden der Mietverträge. Erscheint der Hinweis später, wird er also angesagt. Test `contract-wizard.dom.test.ts:447-455`, rot ohne Änderung: Alert `info` hat keine Rolle (`src/lib/ui/Alert.svelte:25`), die Status-Hülle von `ApartmentStep` ist ein Geschwister und kein Vorfahre, `closest` gäbe also `null`. Folge-Befund siehe C-1.
- C-3 (Anker): erledigt, `apartment-select` ist erst nach dem Laden vorhanden (`ApartmentStep.svelte:31-44`), `contract-wizard.dom.test.ts:439`.
- C-4: erledigt (`tests/a11y/screens.json:29`).
- C-5: bleibt (Begründung im Vorbericht).
- C-6: erledigt (`implementation_plan.md:22`).

## Bestätigt

- Fachreview W10-2 M-1, Rest: Der Dialog «Beenden» (`contracts_end_death`) und die Hilfe unter «Bearbeiten» (`contracts_parties_fixed_by_law`) sagen in allen vier Sprachen: Vertragsende erst erfassen, wenn die Erben oder der Vermieter gekündigt haben. Tests: `contract-detail-page.dom.test.ts:173-181`, `contract-edit.dom.test.ts:149-150` und die E2E-Steps `contract-detail.steps.ts:199-200`. Alle prüfen den neuen Wortlaut und wären mit dem alten Text rot.
- Persona Weber P-1: Die Texte nennen die echten Felder. Abgleich mit dem Mieterformular: Legende `buildings_address` (`TenantFormFields.svelte:92`) und `tenants_email` (Z. 63). Die Bezeichnungen stimmen je Sprache überein: de «Adresse»/«E-Mail», fr «Adresse»/«E-mail», it «Indirizzo»/«E-mail», en «Address»/«Email». Abgedeckt durch `contract-edit.dom.test.ts:151-155`, `contract-detail-page.dom.test.ts:182` und den Step `contract-form.steps.ts:339`. Der Feature-Satz «… als Korrespondenzadresse einträgt» bleibt fachlich zulässig, er enthält keine UI-Wörter.
- Persona Weber P-3: «bei der Scheidung» steht in allen vier `contracts_parties_fixed_transfer`, Test `contract-edit.dom.test.ts:157`. Die Doku (`docs/anforderungen-vertragsende.md:34`) grenzt Art. 176 ZGB ab.
- P-9: Der neue Schlüssel `contracts_parties_fixed_transfer` steht in allen vier Dateien und wird in `ContractForm.svelte:225` als eigener Absatz angezeigt. Das alte Ende des Textes `contracts_parties_fixed_by_law` ist entfernt, es gibt keine Doppelung. Die Sprachprüfung deckt den Schlüssel über `contract-edit-notice` ab.
- Tokens: `flex flex-col gap-4` stammt aus der Referenz. Neue Steuerelemente gibt es keine.
- Nichts Fremdes im Diff: Doku, Plan und Berichte gehören zur Runde.

## Ponytail-Review

- `OpenContracts.svelte`: Die Hülle ist nötig (Live-Region). Siehe C-1, eine Zusammenlegung mit der Hülle in `ApartmentStep` würde Platz sparen.

net: -0 lines possible. Lean already. Ship.

## Nicht bestätigt

- `bun run lint`, `bun run check`, vitest `contract-detail-page.dom`, `contract-edit.dom`, `contract-wizard.dom`, `contracts-i18n`: vom Aufrufer gemeldet, nicht wiederholt (`node_modules` im Worktree ist im Vorbericht als nicht zugänglich vermerkt, Befehle hier verweigert).
- E2E chromium contract-detail/new/edit sowie axe- und Sprachzeilen auf 552536c: vom Aufrufer als ausstehend gemeldet. Die 110 grünen Läufe gelten für 2e135d9 und damit nicht für die neue Hülle (axe) und die geänderten Texte (Sprachprüfung, Step-Texte).
- Fachliche Richtigkeit der neuen Rechtssätze (Art. 266i OR, Art. 121/176 ZGB, eingetragene Partnerschaft nicht genannt) und die Qualität der Übersetzungen in fr/it/en: nicht selbst geprüft, das gehört zu fach-reviewer Runde 3 und zum erneuten Lauf der Persona Weber (laut `implementation_plan.md:26` offen).
