# Code-Review #741, Runde 1 (75b78a9..0e046f6)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/__tests__/contract-detail-page.dom.test.ts:321 | Der Kommentar «short labels side by side, each with its verb» stimmt nach der Änderung nicht mehr: Die Knöpfe stehen jetzt untereinander über die volle Breite (#741). Die Komponente hat ihren Kommentar angepasst (MissingStatement.svelte:27), der Test nicht. |
| C-2 | Minor | tests/e2e/features/contract-detail.feature:299 | Der Schritt «reichen die Knöpfe der fehlenden Abrechnung 2024 …» benutzt ein UI-Wort («Knöpfe»). tests/e2e/CLAUDE.md:36 schliesst solche Wörter in Features aus («Button»). Kein anderer Schritt in tests/e2e/features tut das. Die Prüfung ist richtig, nur die Formulierung nicht, z. B. «reichen Abrechnen und Rechnungen der fehlenden Abrechnung 2024 über die volle Breite der Warnung». |

Keine Blocker, keine Major.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: bun run lint, bun run check, bun run fitness, backend type-check, bunx vitest run --changed origin/main (605), i18n.test.ts, contract-detail-page.dom.test.ts (rot vor der Änderung), E2E «Fehlende Abrechnungen auf dem Handy» (rot als @wip, dann grün), contract-detail.feature (67 bestanden), Zeilen contract-detail/missing-statements in accessibility.feature und sprachen-bildschirme.feature (2 bestanden), Prettier auf den neuen Dateien, die Höhen 804 → 684 px und 936 → 816 px.
- Persona-Lauf auf einem Mietvertrag mit einer fehlenden Periode (Done means, Punkt 4): läuft laut Aufrufer getrennt, keinen Bericht im Worktree gefunden.
- Ob das Szenario an Kalenderjahr-Perioden hängt: Der Schritt nimmt `${year}-01-01` an. Die Grundlage (Mietbeginn 2024-04-01, Gebäude ohne eigene Abrechnungsperiode) liefert 2024 und 2025 als fehlende Kalenderjahre und damit den Mehrperiodentext. Das habe ich aus feature:8–12 abgeleitet, nicht im Lauf gesehen.

Geprüft: Die Texte in allen vier messages/*.json stimmen wörtlich mit dem Wortlaut der Fachreview 741-1 überein (V-1 bis V-5). Kein Text nennt mehr ein Bedienelement. Die Labels fr/it haben ihr Objekt. Vom entfernten Schlüssel contracts_statements_missing_billed_elsewhere bleibt keine Verwendung (Paraglide-Messages, src, tests). `full` gibt es in Button. Der Fall «nur ausserhalb abzurechnen» bleibt in der Spalte richtig, ohne `w-full`. Der Width-Vergleich mit null passt, weil `single` bei keinem Element null liefert. Die Schritte rufen nur Questions auf. Das Szenario und die DOM-Tests schlagen ohne die Änderung fehl: alter Text, alte Labels, flex-wrap ohne `full`. Kein bestehender Schritt prüft weniger. Es gibt keinen neuen Bildschirmzustand, keine Änderung an API oder Contracts und keinen Diff ausserhalb der Anforderung. Ponytail-Review: kein ungenutzter Code, keine Kopie eines bestehenden Helfers.
