# Code-Review W9d, Runde 2 (abschliessend, 3eee2a6..4fded38)

Worktree: `review-w9d-closing` (detached, 4fded38). Gelesen: `git diff 3eee2a6 4fded38` für alle Dateien mit Bezug zum Branch (`backend/src/services/pdf.service.ts`, `backend/src/__tests__/statement-pdf-render.test.ts`, `backend/src/services/reminder-letter.ts`, `docs/design/i18n-begriffe.md`, `docs/design/offene-punkte.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `implementation_plan.md`, `docs/reviews/w9d-review-1.md`, `docs/design/personas/dr-weber-w9d.md`), dazu `docs/reviews/w9d-fachreview-1.md` (V-1), `.claude/skills/slice-review/SKILL.md` (Triage) und `.claude/skills/ponytail-review/SKILL.md`. Die übrigen Dateien des Merge (w4d-Reviews, w4d-Persona, `messages/*.json`, `src/__tests__/i18n.test.ts`, `statements-i18n.test.ts`, Archiv) stammen unverändert aus `origin/main` (PR #355) und gehören nicht zu diesem Branch; nur auf Widersprüche zum Branch geprüft.

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-3 | Minor | backend/src/services/pdf.service.ts:171, :248 | Neuer fr/it-Wortlaut «la part de votre logement aux coûts de l’immeuble» / «la quota del suo appartamento ai costi dell’immobile» ist sinngemäss richtig (P-1 behoben), aber nicht idiomatisch («part … aux coûts», «quota … ai costi»); üblicher wäre etwa «la part des coûts de l’immeuble qui revient à votre logement» / «la quota dei costi dell’immobile a carico del suo appartamento». V-1 gab ihn ausdrücklich als «sinngemäss» vor, eine Muttersprachen-Prüfung (wie `w4d-native-fr/it.md`) hat ihn nicht gesehen. Kein Merge-Hindernis; bei der nächsten Native-Runde mitnehmen. |
| C-4 | Nit | backend/src/__tests__/statement-pdf-render.test.ts:288-298 | Der geänderte fr/it-Satz ist von keinem Test festgehalten (de schon, `:285`). Nach Triage-Ausnahme (Wortlaut eines Reviewers) nicht verlangt; eine Zeile `toContain('Part du logement : la part de votre logement')` bzw. it im vorhandenen `it.each` würde einen Rückfall verhindern. |

Ponytail-Review: Lean already. Ship. (4fded38 ändert zwei Strings; 12ec34d nur Docs; der Merge bringt keinen Code des Branches mit.)

## Bestätigt

- **Merge 48414b9 widerspricht dem Branch nicht:** Die Hunks von `main` in `pdf.service.ts` betreffen nur fr/it/en (NBSP vor «:»/«;», `balanced`, Zahlungs- und Rückerstattungssätze, `FLOORS` fr «1er sous-sol»); der deutsche Block mit `building: 'Gebäude'` (`:39`), `totalAmount: 'Kosten des Gebäudes'` (`:42`), `sharesNote` (`:94`) und `sharesNoteFuel` (`:99`) bleibt wie im Branch. «Liegenschaft» steht in keinem PDF-Text. Die fr/it/en-Spalten- und Gebäudewörter («Immeuble/Coûts de l’immeuble», «Immobile/Costi immobile», «Building/Building costs») hat `main` nicht geändert, die Tests «sagt auf %s die Worte der App» (`statement-pdf-render.test.ts:288`) gelten weiter. `main` fügt im Render-Test nur die Stockwerk-Fälle und «Arrotondamento a 5 centesimi» hinzu, passend zu seinen Strings. `i18n-begriffe.md:62` «Kosten des Gebäudes» blieb erhalten. `statement-pdf.pg.test.ts` ist im Merge unverändert.
- **en-Satz:** `main` setzte «Apartment share: your apartment’s part of the building costs under the distribution key» (`:325`); das entspricht V-1 und dem de-Satz, damit sagen jetzt alle vier Sprachen «Anteil an».
- **4fded38 (P-1):** fr/it-Satz wörtlich nach V-1 (`w9d-fachreview-1.md:22`) und Persona-Vorschlag; NBSP vor «:» (Stil von #84) beibehalten. Kein Test nötig nach `slice-review` Triage («A wording fix of a translation that a reviewer named and checked needs none, also when it answers a persona finding»); kein neuer Text in `messages/*.json` (PDF-Text im Backend), keine neue Ansicht, kein API-Vertrag betroffen.
- **12ec34d:** C-1 der Runde 1 behoben (`nebenkostenabrechnung-anforderungen.md:60` jetzt «Einheiten des Gebäudes … Einheiten total des Gebäudes»), C-2 behoben (Planzeile sagt «seen red by changing those words for a moment»); Review-Bericht unter `docs/reviews/w9d-review-1.md` abgelegt.
- **Persona-Befunde P-2 bis P-4:** bestehen laut Bericht schon vor der Änderung (App/PDF-Titel, «Anteil», it «Costi immobile»); P-4 entspricht V-6 der Fachrunde. Nicht Gegenstand dieses Deltas.
- **Nichts Fachfremdes** aus dem Branch im Delta; die w4d-Dateien kommen mit `main`.

## Nicht bestätigt

- Render-Test und `statement-pdf.pg.test.ts` nach dem Merge (92 pass) und Render-Test nach 4fded38 (48 pass): vom Aufrufer gemeldet, nicht wiederholt (Backend-Tests laut Auftrag nicht gestartet). Nach Lesen: kein Test prüft den geänderten fr/it-Satz, also kann 4fded38 keinen bestehenden Test brechen.
- Lint, check, type-check, volle Suites und E2E: laut Aufrufer vor dem Push geplant, nicht gesehen.
- Ob der neue fr/it-Wortlaut im gerenderten PDF gut umbricht: nicht gerendert; Fliesstext, `heightOfString` rechnet die Höhe.
- Feature-Review: `implementation_plan.md:12` lässt «daten-pruefer (PDF)» offen (Punkt nicht abgehakt). CLAUDE.md, Workflow 5, verlangt ihn, weil sich ein PDF geändert hat; ob er gelaufen ist oder begründet entfällt, konnte ich nicht sehen.
- Idiomatik von C-3: eigene Einschätzung, keine Muttersprachen-Prüfung.
