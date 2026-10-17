# Code-Review W9c, Runde 2 (Abschlussrunde vor dem Push)

Gegenstand: `git diff 16247b1 4d912b2` im Worktree `review-w9c-code2` (detached auf 4d912b2), Commits ec927db, 7b54b18, 4d912b2. Anforderung: #82 und #178 wie in Runde 1; das Delta setzt die Wortlaut-Befunde aus `docs/reviews/w9c-fachreview-2.md` (R-5, R-20..R-25, R-27, V-5..V-7) und Dr. Weber P-5 um, passt E2E-Schritte an und ergänzt die Namensliste der Sprachprüfung.

Gelesen: alle 14 geänderten Dateien (Berichte nur so weit, wie sie das Delta begründen). Gegengeprüft am Code: `backend/src/services/document.service.ts:122` (nur `upload` löschbar, also keine Mahnung, auch keine unversendete), `tenant.service.ts:284-300` (Mieter mit Mietvertrag nicht löschbar), `backend/src/db/schema.ts:493` (Mahnungen hängen an Abrechnung und Mieter, `restrict`), `UBIQUITOUS_LANGUAGE.md:182-183` (Mahnung umfasst die Zahlungserinnerung als 1. Mahnstufe). Neu ausgeführt: `bunx vitest run privacy-page.dom privacy-i18n.dom tenant-detail-page.dom overview` → 76/76 grün.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | implementation_plan.md:21 | «P-5 fixed»: behoben ist nur die Mehrdeutigkeit des Satzes. Der zweite Teil von P-5 (`dr-weber-w9c.md:16,77`: für nicht löschbare Daten steht kein Ende der Aufbewahrung) ist weder umgesetzt noch einem Issue zugeordnet. Entweder ablehnen mit Grund (unter «Found») oder an #332 (Aufbewahrung) anhängen. |
| C-2 | Nit | tests/e2e/features/privacy.feature:33, tests/e2e/steps/app-frame.steps.ts:93 | Der Schritttext «jede Anmeldung und jede Verlängerung der Sitzung mit der E-Mail-Adresse protokolliert wird» prüft jetzt auch die Abmeldung ohne E-Mail-Adresse; der Name sagt das nicht. |
| C-3 | Nit | implementation_plan.md:20-21 | Befunde mit Status (R-20 … fixed, P-1 → #330 …) stehen im Plan; `slice-review` Schritt 3: «the findings and their status stay out of the plan», sie gehören unter «Found». |

ponytail-review: Das Delta besteht aus Textänderungen, angepassten Erwartungen und einem Listeneintrag. Nichts zu streichen. Lean already. Ship. (`net: -0 lines possible.`)

Keine Blocker, keine Major.

## Bestätigt

- Jeder geänderte Text ist in allen vier `messages/*.json` geändert (de/en/fr: `privacy_login_1`, `privacy_cookies_2`, `privacy_retention_1`, `privacy_mail_resend`, `tenants_former_documents_title/_text`, `dashboard_task_former_documents_text_one/_many`; it zusätzlich `privacy_controller_*` (R-20), `privacy_retention_2/3` (R-23, R-27)).
- R-22/P-5: «Nicht löschen lassen sich versendete Abrechnungen, alle Mahnungen sowie Mieter und Mietverträge, zu denen es Abrechnungen gibt» stimmt mit dem Code überein (siehe oben).
- R-21: Die Kennung des Kontos wird im Protokoll-Absatz bereits genannt; der Satz unter «Anmeldung» widerspricht ihm nicht mehr.
- Rote Tests: Die geänderten Erwartungen in `privacy-page.dom.test.ts:249,259,287,313,318`, `tenant-detail-page.dom.test.ts:300-305` und `overview.test.ts:39` enthalten die neuen Wörter und scheitern auf 16247b1. Die IT-Wortlautkorrekturen (R-20, R-23, R-27) haben keinen Test; nach `slice-review` («Triage», Übersetzungs-Wortlaut, den ein Reviewer benannt und geprüft hat) ist keiner nötig.
- E2E: `privacy.feature:79` und die zwei Schritte in `app-frame.steps.ts` lagen schon auf 16247b1 hinter den Texten (die Texte zu Protokoll und Entwurf ändert dieses Delta nicht); die neuen Erwartungen sind gleich streng oder strenger. `STÜBER SYSTEMS GmbH` in `language.ts:48` ist ein Firmenname, der in allen vier Sprachen gleich steht (`privacy_third_3`), sonst würde das «Ü» als deutsches Wort zählen. Schritte rufen nur Fragen auf (Screenplay eingehalten).
- Keine neuen Bildschirme oder Zustände, also keine Änderung an `screens.json` und den a11y-/Sprach-Features nötig. Nichts im Delta hat mit der Anforderung nichts zu tun.

## Nicht bestätigt

- R-5: Ob die Bekanntgabe an Resend tatsächlich auf die EU-SCC mit Schweizer Anpassungen im DPA von Resend gestützt ist, habe ich nicht geprüft (keine Primärquelle im Repo; laut Plan in #333 vermerkt). Das ist eine Rechtsaussage, die die App fest für jede Installation mit Resend macht.
- `bun run lint`, `bun run check` (auf ec927db), E2E -g «Datenschutz|privacy|Nutzungsbedingungen|terms» 51/51 und der volle E2E-Lauf auf ec927db: vom Aufrufer gemeldet, nicht von mir wiederholt (E2E darf ich nicht starten).
- Sprachprüfung mit `STÜBER SYSTEMS GmbH`: nur gelesen; ob `sprachen-bildschirme.feature` für `/privacy` in fr/it/en jetzt grün ist, zeigt erst der volle E2E-Lauf.
- Persona- und Fachberichte (`helga-w9c.md`, `dr-weber-w9c.md`, `w9c-fachreview-2.md`): nur so weit gelesen, wie sie das Delta begründen; ihre Triage (Helga P-1/P-2 → #331, offen als Produktentscheidung) habe ich in #331 nachgelesen, aber nicht bewertet.
