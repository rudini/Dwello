# Review W14, Runde 2 (Abschlussrunde): #80 Juli-Anteil «Heizung Bergregion», Delta 2e3df574..426fcb84

Worktree: `/tmp/claude-0/-home-user-Dwello/20114ddf-872a-586c-a859-0b820039965a/scratchpad/review-w14-code2`. Gelesen habe ich alle vier geänderten Dateien des Deltas: `backend/src/__tests__/heating-profiles.pg.test.ts`, `docs/archive/implementation-plan-verlauf.md` (neuer Abschnitt und die Überschriftenfolge der ganzen Datei), `docs/reviews/w14-review-1.md` (per `diff` identisch mit dem Bericht der Runde 1 im Scratchpad) und `implementation_plan.md` (`cat -A`). Dazu `backend/migrations/0002_stammdaten.sql` Z. 80–92 und den Issue-Kommentar 6232504741 (`gh api`). Commit: `docs(tests): archive plan of Bergregion check`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Minor | backend/src/__tests__/heating-profiles.pg.test.ts:35 | Der Fix zu C-2 sagt als Tatsache, die Mieterverband-Tabelle sei «the Mieterverband's print of the table the migration names». Belegt ist das nicht. Der eigene Issue-Kommentar 6232504741 sagt nur, ein Suchausschnitt aus dem mietrecht.ch-PDF «suggests both print the same tables». Die Tabelle «Mieterwechsel: So werden die Heizkosten verteilt» (`0002_stammdaten.sql:87`) hat niemand gesehen. Vorschlag: «presumably the Mieterverband's print of …» oder «matches the values of the table the migration names». |
| C-5 | Nit | docs/archive/implementation-plan-verlauf.md:1364-1365 | C-3 ist nur verschoben: Vor `## Session W14` stehen im Archiv jetzt zwei Leerzeilen. Alle anderen Sessions trennt eine einzige. In `implementation_plan.md` ist die doppelte Leerzeile weg, die Datei endet sauber. |
| C-6 | Nit | docs/archive/implementation-plan-verlauf.md:1371,1374 | «Archive the session and open the pull request» ist abgehakt, der Pull Request ist aber noch nicht offen. Die Abschlussrunde (diese Runde 2) fehlt in der Liste, und unter «Files:» fehlen `implementation_plan.md` und das Archiv. Das ist Buchhaltung und blockiert nichts. |

Keine Blocker und keine Majors.

Prüfung des Deltas gegen Runde 1:
- **C-1 behoben:** Kommentar und Archiv schreiben jetzt «(PDF dated 2023-09-09)». Der Issue-Kommentar ergänzt «the document itself prints no year».
- **C-2 behoben**, mit der Einschränkung C-4: Der Kommentar verbindet die beiden Tabellennamen und erklärt, dass «Bergebieten» in der Quelle so geschrieben ist.
- **C-3:** In `implementation_plan.md` behoben, im Archiv nicht (C-5).
- **Offener Punkt aus Runde 1, «Quelle in Issue #80 notieren»:** erledigt. Kommentar 6232504741 nennt URL, Tabelle, Seite, Zeile und Werte. Er vermerkt auch, dass mietrecht.ch und HEV nicht erreichbar waren.
- **Archivierung:** Die Session ist vollständig aus `implementation_plan.md` ins Archiv verschoben, und dort sind alle Punkte abgehakt. Der Plan hat danach keine offene Session mehr, so wie `open-work.test.ts` es erwartet.
- **Berichtskopie:** `docs/reviews/w14-review-1.md` ist byte-gleich mit dem Bericht der Runde 1.
- **Verhalten und Tests:** Es ändern sich nur ein Kommentar und Markdown. Kein Test ist neu, also muss keiner rot gewesen sein. Ein Szenario ist nicht nötig («No scenario» wie in Runde 1).
- **Commit-Betreff:** 45 Zeichen, Typ und Scope sind erlaubt. Der Diff enthält nichts, was nicht zur Anforderung gehört.
- **Ponytail:** Lean already. Ship. (net: -1 Zeile möglich, C-5)

## Nicht bestätigt

- **Gleichheit mit der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt»:** Diese Quelle (mietrecht.ch/HEV) hat niemand geprüft, siehe C-4 und Runde 1. Ob sie vom Mieterverband abweicht, bleibt offen. Das wäre der Fall «sources disagree» aus «Stop and ask» in #80.
- **Checks, vom Aufrufer gemeldet, nicht wiederholt:** `cd backend && bun test src/__tests__/heating-profiles.pg.test.ts` und `bunx vitest run src/__tests__/open-work.test.ts` auf 426fcb84; lint, check und type-check auf 2e3df574. Das Delta ändert nur einen Kommentar und Markdown, deshalb habe ich sie nicht angezweifelt.
- **Pull Request:** Er ist noch nicht offen, im Archiv aber schon abgehakt (C-6).
