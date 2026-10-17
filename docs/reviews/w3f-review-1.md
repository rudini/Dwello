# Code-Review W3f-1: #76 (befristeter Mietvertrag) und #119 (verschieden eingestellte Abrechnungen)

Gegenstand: `git diff 8b2c710 c08599e` im Worktree `/tmp/claude-0/-home-user-Dwello/b764c1fc-ad3b-5410-ae08-ee39473408c9/scratchpad/review-w3f-code` (c46a112 Szenarien, c08599e Umsetzung). Alle 23 geänderten Dateien gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `messages/{de,fr,it,en}.json:1529` | Reine Formatänderung an einer nicht betroffenen Zeile: bei `statements_preset_from_settings` fehlt nach dem Doppelpunkt das Leerzeichen (`"…_from_settings":"…"`), in allen vier Dateien |
| C-2 | Major | `src/routes/statements/generate/+page.server.ts:50` | Anforderung «Abrechnungen ohne Heizprofil werden übergangen» (#119, fach-review V-5) hat keinen Test |
| C-3 | Major | `messages/de.json:1000` (und fr/it/en `statements_akonto_raise_fixed_term`) | Der Akonto-Hinweis beim befristeten Mietvertrag geht über den in #76 beschlossenen Text hinaus («Teilen Sie eine Erhöhung begründet …»). Ein Entscheid des Product Owners dazu ist weder in #76 noch in einem Issue festgehalten |
| C-4 | Minor | `src/routes/statements/generate/+page.server.ts:50-54`, `PresetNotice.svelte:33-39` | Haben alle übrigen Abrechnungen kein Heizprofil (gelöschtes Profil, `onDelete: 'set null'`) und gibt es eine Abrechnung zum Satz des Laufs, dann wird die Verwaltungspauschale aus der Abrechnung übernommen (`runRate`), aber der Hinweis sagt «Heizprofil und Verwaltungspauschale kommen aus den Einstellungen» (`fromStatements: false`). Vorher war der Hinweis ebenfalls falsch, nur andersherum («beides wie die übrigen»), weil `others[0]` ohne Profil als Vorlage galt |
| C-5 | Minor | `tests/e2e/features/statement-generate.feature:386-393` | Szenario #119: Die beiden Prüfungen «… "Winter"/"Sommer" nicht vor» aus c46a112 sind gestrichen, ohne dass eine positive Prüfung kommt, z. B. «schlägt der Assistent das Heizprofil <Standard> vor» (fach-review V-2). Dass die Vorgaben aus den Einstellungen bleiben, prüft jetzt nur noch der Unit-Test |
| C-6 | Minor | `src/__tests__/statement-generate-actions.test.ts:39-52` | «pro Gebäude» ist nicht gezeigt: Der Test hat nur ein Gebäude. `preview.some((row) => row.fixedTerm)` ohne Gebäudefilter bliebe grün. Ein zweites Gebäude ohne befristeten Mietvertrag, das `false` erwartet, würde das zeigen |
| C-7 | Minor | `tests/a11y/screens.json:29` (`link-preset`) | Der neue Text `statements_preset_differing` wird in `sprachen-bildschirme.feature` und `accessibility.feature` nicht gezeigt. Der Zustand `link-preset` zeigt nur eine Variante. Das entspricht dem Vorgehen bei #89 (`statements_preset_profile_from_statements` hat auch keinen eigenen Zustand), aber fr/it/en des neuen Texts prüft kein Bildschirmtest |
| C-8 | Nit | `tests/e2e/steps/contracts.steps.ts:36` | Der zusammengelegte Step passt auch auf «mietet … von … bis» ohne «befristet» und auf «mietete … befristet» und legt in beiden Fällen dasselbe an. Das ist lose, aber harmlos |
| C-9 | Nit | `src/lib/statement-wizard.ts:152,178-183`, `CategoryFindingItem.svelte:9` | ponytail: `yagni:` Der Default `fixedTerm = false` steht zweimal (`findingText`, Prop), obwohl der einzige Aufrufer immer einen Boolean übergibt. `newCostsText` hat nur einen Aufrufer und kann in `findingBody` inline stehen. net: -4 lines possible |

---

## C-1 (Major): Formatänderung an einer nicht betroffenen Zeile

**Warum falsch.** Der Diff darf nichts enthalten, was nicht zur Anforderung gehört (Formatierung eingeschlossen). `statements_preset_from_settings` bleibt inhaltlich gleich. Die Zeile steht nur im Diff, weil beim Einfügen von `statements_preset_differing` das Leerzeichen nach `":"` verloren ging. Auf der Basis lautet sie `"statements_preset_from_settings": "…"` (`git show 8b2c710:messages/de.json`, Z. 1526).

**Nachweis.** `git -C <worktree> diff 8b2c710 c08599e -- messages/de.json` zeigt die Zeile als `-`/`+`, und der einzige Unterschied ist das Leerzeichen. Dasselbe gilt in en/fr/it.

**Behebung.** Das Leerzeichen in allen vier Dateien wieder einsetzen.

## C-2 (Major): «Abrechnung ohne Heizprofil wird übergangen» ist nicht getestet

**Warum falsch.** Die Anforderung (#119 mit fach-review V-5) legt fest, dass eine Abrechnung ohne Heizprofil weder als «verschieden» zählt noch als Vorlage dient. Der Code macht das (`const profiles = others.filter((s) => s.heatingProfileId)`, Z. 50), aber kein Test zeigt es. Der `statement()`-Helfer in `statement-generate-actions.test.ts:122` setzt immer ein Profil (`'hp9'` als Vorgabe), und in keinem Test steht `heatingProfileId: null` (grep).

**Nachweis.** Ersetzt man in Z. 50 bis 54 `profiles` durch `others`, kommen beide Abweichungen durch, und alle 118 Tests der vier betroffenen Dateien bleiben grün:
- `null` und `hp9` gelten dann als verschieden;
- eine neueste Abrechnung ohne Profil wird zur Vorlage.

**Behebung.** Ein Test in `statement-generate-actions.test.ts`: `openWith([statement('lauf', '4.50', null), statement('lauf2', '4.50', 'hp9')])` erwartet `defaultHeatingProfileId: 'hp9'` und `preset.differing: false`.

## C-3 (Major): Der Akonto-Text beim befristeten Mietvertrag weicht vom beschlossenen Text ab

**Beleg.** #76, «Decided (product owner)»: Die Hinweise sagen «Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor.» Umgesetzt ist in `statements_akonto_raise_fixed_term` zusätzlich «Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.» (de Z. 1000, in fr/it/en entsprechend). Das Szenario prüft diesen Zusatz (`statement-generate.feature:180`), ebenso der Unit-Test `statement-wizard.test.ts:419-424`.

**Warum falsch.** Der fach-reviewer hält in `docs/reviews/w3f-fachreview-1.md:44` selbst fest: «Der Zusatz ist ein neuer Text und braucht deshalb den Entscheid des Product Owners; der Aufrufer eröffnet ein Issue mit den Labels `fachlich` und `entscheiden`. Lehnt der Product Owner das ab, gehört M-1 unter «Blocked on me».» Laut CLAUDE.md («Coding guidelines») entscheidet über jede andere Änderung an einem beschlossenen Text der Product Owner. #76 hat keinen Kommentar (`gh api repos/rudini/Dwello/issues/76/comments` ist leer). Unter den zuletzt eröffneten Issues mit `entscheiden` gibt es eines zu V-1 (#387), aber keines zu M-1.

**Behebung.** Den Entscheid des Product Owners in #76 festhalten oder ein `entscheiden`-Issue eröffnen und M-1 bis dahin unter «Blocked on me» führen. Wenn der Zusatz schon beschlossen ist, an einer Stelle, die ich nicht sehe, gilt der Befund mit dem Eintrag in #76 als erledigt.

---

## Bestätigt

- #76 Akonto: `akontoHint` nimmt bei `fixedTerm` den neuen Text (`statement-wizard.ts:226-227`). `fixedTerm` steht in `statement-generation.ts:117` (Vertragsende gesetzt, nicht gekündigt, weder vor dem Periodenende noch vor heute erreicht, also Stichtag heute wie in M-2). Getestet in `statement-generation.test.ts:155-173` (befristet / gekündigt / unbefristet / beendet) und `statement-wizard.test.ts:419-424`. `PreviewStep.svelte:103` gibt die ganze Zeile weiter, deshalb kommt `fixedTerm` an. Unbefristete behalten ihren Text (bestehende Tests, Szenario Z. 181).
- #76 neue Nebenkosten: Der Satz steht hinter «nichtig.» und vor «Waren die Kosten …» (V-4), in allen vier Sprachen über den Platzhalter `{fixedTerm}`. Getestet in `statement-wizard.test.ts:182-190` (Position, ohne Flag, andere Befundart) und im DOM-Test `statement-wizard.dom.test.ts:412-430`. Der Wert gilt pro Gebäude über `buildingId` (`+page.server.ts:113-117`; Testlücke siehe C-6).
- Die Schwellen F-10b sind unverändert (`statement-wizard.ts:198-199`). Der Marker `TODO(fachlich prüfen, #76)` ist weg (grep ohne Treffer ausserhalb von docs/plan).
- #119: `differing` vergleicht die Profile (ohne `null`) und die Sätze nur der Abrechnungen zum Satz des Laufs (#89). Bei Abweichung gelten die Vorgaben der Einstellungen, und `PresetNotice` zeigt den neuen Text. Getestet in `statement-generate-actions.test.ts:147-170` (verschiedene Profile, verschiedene Sätze, gleich) und im DOM-Test `:172-190`.
- Texte: alle neuen Texte stehen in allen vier `messages/*.json`. Die Begriffe stimmen mit `UBIQUITOUS_LANGUAGE.md:36-38` und `docs/design/i18n-begriffe.md:28,30,31,35` überein.
- API-Vertrag: `terminated` liefert das Backend aus (`contract.service.ts:32`, `routes/contracts.ts:61`), und `tests/contracts/building-contracts.json` ist ergänzt.
- E2E (Screenplay): Die Steps rufen nur Questions auf (`akontoHintOf` → Target `previewAkontoHint` → `data-testid="preview-akonto-hint"`, `PreviewStep.svelte:122`). Die Question gibt den Text zurück. Beide Szenarien sind ohne `@wip` und würden ohne die Änderung rot, weil die Texte neu sind. Das Vertragsende 2099 behebt V-6.
- Rote Tests: Alle neuen Unit- und DOM-Tests würden ohne die Änderung fehlschlagen, denn `fixedTerm`, `differing` und die neuen Texte fehlen dann. Zu `toEqual` mit `fixedTerm: false`: Die erweiterten Erwartungen würden ebenfalls fehlschlagen. Ausnahme: C-2, C-6.
- Sicherheit: Es gibt keine neuen Endpunkte. `buildingId` und `fixedTerm` in der Antwort der Vorschau sind keine schützenswerten Daten.
- Design: Es gibt kein neues Markup, nur Text im bestehenden `Alert` bzw. `<li>`.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (alle 2841), `cd backend && bun test src/__tests__/api-contracts.pg.test.ts`, E2E chromium (7 Szenarien) und die Commit-Hooks: vom Aufrufer gemeldet. Selbst wiederholt habe ich nur `bunx vitest run` für `statement-generate-actions.test.ts`, `statement-generation.test.ts`, `statement-wizard.test.ts` und `statement-wizard.dom.test.ts` (118 Tests, grün).
- fach-review V-1 (Major, Heizprofil beim Mieterwechsel): Das gehört nicht zu diesem Code-Review. #387 (`fachlich`, `entscheiden`) ist offen. Ob es unter «Blocked on me» steht und ob `+page.server.ts` dazu einen Marker braucht, habe ich nicht geprüft.
- Ob der Zusatz aus M-1 (C-3) mündlich oder anderswo beschlossen ist: Gesucht habe ich in den Kommentaren von #76 und in den zuletzt eröffneten Issues (`repos/rudini/Dwello/issues?labels=entscheiden`, `?sort=created`). Die Suche über `search/issues` ist in dieser Sitzung gesperrt.
- Die Wortwahl der fr/it/en-Übersetzungen habe ich nur gegen `i18n-begriffe.md` geprüft, nicht muttersprachlich.
- Ob in der Vorschau eines Gebäudes, dessen befristeter Mietvertrag schon abgerechnet ist (also nicht im Lauf), der Satz bei neuen Nebenkosten fehlen soll: Der Code folgt V-4 («wenn das Gebäude … abrechnet»). Fachlich bestätigt ist das nicht.
