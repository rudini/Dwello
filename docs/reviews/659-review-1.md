# Code-Review #659, Runde 1 (45177b9..0af7831)

Hinweis zum Bereich: `git diff origin/main 0af7831` zeigt im Worktree auch Änderungen, die nach dem Abzweig auf `main` kamen (Dialog.svelte, personas, statement-send.feature …). Geprüft wurde der Bereich `0a73289..0af7831` (Merge-Base, die zwei Commits der Slice).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | tests/e2e/features/statement-generate.feature:871 | Das Szenario «Die Wahl des Heizprofils passt auf Italienisch aufs Telefon» (#1089, ohne `@wip` auf `main`) verliert seinen Schritt «Und scrollt die Seite nicht seitwärts»: das neue Szenario wurde vor dieser Zeile eingefügt, nicht danach. |
| C-2 | Minor | src/__tests__/statement-wizard.dom.test.ts:379, tests/e2e/steps/statement-generate.steps.ts:767 | Kein Test hält V-1 fest, also dass die Warnung direkt unter der Wahl steht, vor der Beschreibung des eigenen Profils und vor dem Diagramm: `DOCUMENT_POSITION_FOLLOWING` gegenüber dem Select gilt auch hinter dem Diagramm, und `ShareInViewport > 0` ist schon bei einem Pixel der Warnung erfüllt. Abhilfe: im DOM-Test auch die Reihenfolge vor `HeatingProfileChart`/`ownDescription` prüfen oder im Szenario die ganze Warnung im Fenster verlangen (Anteil 1, wie `contract-detail.ts:43`). |

## C-1 (Blocker)

Auf dem Basis-Commit (`git show 0a73289:tests/e2e/features/statement-generate.feature`, Zeilen 865–871) endet das #1089-Szenario so:

```
    Dann zeigt die Wahl des Heizprofils den Namen des gewählten Profils ganz
    Und scrollt die Seite nicht seitwärts
```

In 45177b9 wurden der neue Block und die Leerzeile zwischen diesen beiden Zeilen eingefügt. Darum gehört «Und scrollt die Seite nicht seitwärts» jetzt zum neuen Szenario #659 (Zeile 881), und das Szenario #1089 endet bei Zeile 871 ohne diesen Schritt. Damit prüft ein Szenario, das auf `main` ohne `@wip` steht, weniger als vorher, und ein `Spec change approved` gibt es dafür nicht (CLAUDE.md, Workflow 1, «Scenarios are the specification»). So lässt es sich zeigen: `git diff 0a73289 0af7831 -- tests/e2e/features/statement-generate.feature` zeigt die Zeile 872 «Und scrollt die Seite nicht seitwärts» als Kontext hinter den neuen Zeilen. Wenn die italienische Seite bei 390 px seitwärts scrollt, bleibt #1089 trotzdem grün. Behebung: im Szenario #1089 «Und scrollt die Seite nicht seitwärts» wieder anfügen und den Schritt im neuen Szenario behalten.

## Zur gefragten Lesart («ohne über die Hilfe hinaus zu scrollen»)

Die Lesart hält. In `Field.svelte` stehen das Label und die Hilfe über dem Select. Wer bis zur Wahl gescrollt hat, ist also schon an der Hilfe vorbei. Auf dem Basis-Commit standen die Sätze zu den Zählern in dieser Hilfe über der Wahl, sie lagen also nach `Scroll.toTop` ausserhalb des Fensters. Dass die Warnung jetzt im Fenster steht, zeigt genau die verlangte Verbesserung, und die Hilfe ist kurz (Zeile 880, `toBe`). Schwach ist nur der Grenzwert `> 0` (C-2).

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`; `bunx vitest run src/__tests__/statement-wizard.dom.test.ts` (103 bestanden, neuer Test zuerst rot); E2E chromium statement-generate.feature (95 bestanden); accessibility.feature und sprachen-bildschirme.feature, Zeilen für statement-generate (54 bestanden).
- Noch nicht gelaufen (vom Aufrufer genannt): `bun run check`, `bunx vitest run --changed origin/main`.
- Das Rot des Szenarios habe ich nur aus dem Code beurteilt: Vor 0af7831 gibt es kein `heating-meter-warning`, also scheitert es dort. Ob die Warnung bei 390 × 844 nach `Scroll.toTop` ganz im Fenster steht, habe ich nicht gemessen; das Diagramm und die Höhe der Warnung habe ich nicht ausgemessen.

Geprüft: In allen vier Sprachen ergeben Hilfe und Warnung zusammen wörtlich den alten Text; die Titel stehen in allen vier `messages/*.json`; `Alert` aus `src/lib/ui` ohne eigene Klassen; `data-testid` `heating-meter-warning`; Screenplay-Schichten (Steps rufen nur Tasks und Questions, Target in `targets/`); kein neuer Bildschirmzustand, die Warnung steht immer im Schritt Einstellungen; der bestehende DOM-Test für den ganzen Text (Zeilen 390–398) gilt weiter; #1130 für die Glossar-Begriffe.
