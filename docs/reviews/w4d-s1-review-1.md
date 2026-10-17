# Code-Review Slice 1, #83 (F-20a, Option B): Kündigungsfrist / Kündigungstermin fr/it

Worktree: `review-s1-code` (detached, c200811). Bereich: `git diff 8ded4b1 c200811`.
Gelesene Dateien (alle im Diff): `docs/design/i18n-begriffe.md`, `docs/reviews/w4d-terms-fachreview-1.md`, `implementation_plan.md`, `messages/fr.json`, `messages/it.json`, `src/__tests__/i18n.test.ts`. Dazu Issue #342 (gh api), `backend/src` und `src/` per grep.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | messages/it.json:1472 | `contracts_notice_period_short` sagt weiter «Tra la ricezione e la fine del contratto». Gemeint ist der Empfang der Kündigung, also derselbe Begriff, für den der Slice Art. 273 OR «ricevimento della disdetta» festlegt (Fachreview M-5) und den das Glossar jetzt so nennt (it.json:119). Der Test fängt nur «ricezione della disdetta» und sieht diese Stelle deshalb nicht. Vorschlag: «Tra il ricevimento della disdetta e la fine del contratto …», und die Regex auf `\bricezione\b` erweitern. |
| C-2 | Nit | messages/fr.json:119 | «la réception du congé» (Fedlex, M-5) steht im selben Text wie «Si la résiliation arrive trop tard». Laut `i18n-begriffe.md` heisst Kündigung auf Französisch «résiliation». Das ist durch Fedlex und die Fachreview gedeckt, aber nicht mit dem Glossar abgestimmt (fr.json:1472 sagt nur «la réception»). Allenfalls in #342 vermerken. |
| C-3 | Nit | src/__tests__/i18n.test.ts:52 | Die eigene Zeile ist nicht Prettier-sauber: `bunx prettier` bricht sie nach `([, text]) =>` um. |
| C-4 | Nit | src/__tests__/i18n.test.ts:40-55 | ponytail `shrink:` Das ist die dritte und vierte Kopie desselben Musters (Datei lesen, filtern, `toEqual([])`) nach Z. 23 und 31. Ein `it.each([['fr', /…/], ['it', /…/]])`, das ein Wort pro Sprache verbietet, deckt die Tests von Z. 31 bis 55 ab. net: etwa -8 Zeilen möglich. |
| C-5 | Nit | docs/design/i18n-begriffe.md:69 | Das ❓ am Zellenende gilt auch für «rappel de paiement» / «promemoria di pagamento» (Zahlungserinnerung). Die Fachreview (V-1, Ergebnistabelle) belässt diese ausserhalb von #83. Issue #342 nimmt sie dagegen in die Mahnungs-Familie auf. Das ist konsistent mit dem Issue, für Leser aber mehrdeutig. |

Keine Blocker und keine Majors.

## Geprüft und bestätigt

- **fr Kündigungsfrist «délai de congé» / Kündigungstermin «terme de congé»:** Alle 15 geänderten fr-Stellen sind gelesen. Genus und Artikel stimmen: «les délais de congé légaux», «sans délai de congé», «le prochain terme de congé», «le terme de congé suivant», «du début du délai de congé», «c’est-à-dire le terme de congé». In `messages/fr.json` steht kein «délai(s)/terme(s) de résiliation» mehr (grep über das Repo ohne `docs/archive` und ältere Reviews).
- **it Kündigungsfrist «termine di preavviso»:** Alle 7 geänderten it-Stellen sind gelesen. Grammatik stimmt («i termini di preavviso legali», «senza termine di preavviso», «dell’inizio del termine di preavviso», «un termine di preavviso di almeno 3 mesi»). Wo das alte «prossimo termine di disdetta» den Kündigungstermin meinte (finding_new, akonto_raise), steht jetzt richtig «la prossima scadenza di disdetta», Genus angepasst. In it.json ist kein «termin[ei] di disdetta» übrig. «ricevimento della disdetta» steht in it.json:119, Rest siehe C-1.
- **it Kündigungstermin «scadenza di disdetta»:** unverändert, wie gefordert.
- **PDF- und Brieftexte:** In `backend/src` kommen «résili», «congé», «disdett» und «preavviso» nicht vor. Es war also nichts zu ersetzen.
- **de/en:** unverändert. Laut Requirement bleibt en bei den Klartext-Wörtern.
- **Glossar `i18n-begriffe.md`:**
  - Die Zeile Kündigungsfrist ist neu (M-4).
  - Kündigungstermin fr ist auf «terme de congé» umgestellt.
  - Das ❓ ist entfernt bei it «addebitabile» (M-1), bei en Umlagefähig, en Abrechnungslauf und en Kündigung aufheben.
  - Das ❓ bleibt bei fr «imputable» (M-2), bei Abrechnungslauf fr/it und bei Kündigung aufheben fr/it.
  - Das ❓ ist neu bei der Mahnung-Familie inkl. Button (V-1).
  - Der Einleitungssatz verweist auf #342. Das Issue ist offen und hat die Labels `fachlich,entscheiden`.
- **Glossar und messages:** Die geänderten Glossarschlüssel `glossary_notice_period_term` und `glossary_termination_date_term` sagen genau die Wörter aus der Glossarzeile. Die Hilfetexte, die sie zitieren, sind in derselben Änderung angepasst.
- **Tests rot ohne Änderung (gelesen):** Auf 8ded4b1 enthielt fr.json «délais de résiliation légaux» (contracts_running_text), it.json «termini di disdetta legali». Beide neuen Tests wären also rot gewesen. Rerun `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/open-work.test.ts`: 2 Dateien, 25 Tests grün.
- **No scenario:** Der Grund ist plausibel, denn es ändert sich nur der Wortlaut bestehender Texte, ohne neuen Zustand und ohne neuen Bildschirm. `sprachen-bildschirme.feature` deckt die Sprachen der Bildschirme schon ab.
- **Nichts Fremdes im Diff:** Die Plan-Häkchen und der Fachreview-Bericht gehören zum Workflow.

## Nicht bestätigt

- `bun run lint` und `bunx vitest run` (alle 157 Dateien, 2779 Tests): vom Aufrufer gemeldet. Selbst ausgeführt habe ich nur `i18n.test.ts` und `open-work.test.ts`.
- Den Fedlex-Wortlaut (Art. 266a–266c, 269d, 273 OR fr/it) habe ich nicht selbst gegen Fedlex gelesen. Ich stütze mich auf die Zitate in `docs/reviews/w4d-terms-fachreview-1.md`.
- Ob die fr/it-Bildschirme mit den neuen Wörtern ohne Überlauf rendern (390 px), habe ich nicht geprüft: kein E2E und kein Build erlaubt. Die Texte sind nur um wenige Zeichen länger.
- `bun run check` und `cd backend && bun run type-check` wurden nicht gemeldet und nicht ausgeführt. Der Diff berührt keinen Code ausser einer Testdatei.
