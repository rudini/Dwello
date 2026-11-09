# Code-Review 1409-6: Re-Review der Fixes zu 1409-5 (cebe0f0f..c239c9ab)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine offenen und keine neuen Befunde |

Geschlossen: C-1, C-2, C-3

Geprüft:
- Die zwei neuen Szenarien verwenden nur Daten aus ihrer Grundlage oder Kategorien mit dem Seed-Suffix (Isolation). Sie beschreiben, was der Liegenschaftsverwalter will, ohne UI-Wörter.
- Die Schritte rufen nur Seed, Task und Question auf. Der neue Then-Schritt stellt eine Frage nach dem Wert «Position Betrag».
- Beim Lesen sind beide Szenarien ohne die Fixes rot:
  - Ben Kellers Vertrag beginnt am 16.03.2025, «Abgerechnet bis» 2026-01-31 liegt nach dem Periodenende, also gibt es auf der Basis keinen Hinweis;
  - ohne die Formel-Sicherung findet `csvAmountsOf` keine Position mit «'», die Antwort ist «(missing)».
- Der pg-Test «nennt keinen Mietvertrag ohne Tage in der Periode» ist rot ohne die Bedingung zum Vertragsende (ein Vertrag, der 2024 endet, mit «Abgerechnet bis» 2025-03-31). Er ist auch rot ohne die Bedingung zum Vertragsbeginn (Beginn 2026-02-01, «Abgerechnet bis» 2026-03-31). Die Testdaten räumt er in `finally` weg.
- Der Doc-Kommentar von `billedOutside` stimmt jetzt.
- Keine neuen Texte, keine neuen Bildschirme, kein geänderter Kontrakt.

## Nicht bestätigt

- analytics.feature mit 7 bestandenen Szenarien, die Rot-Läufe der zwei Szenarien und des pg-Tests, die 16 bestandenen pg-Tests, lint, type-check, fitness --structure: vom Aufrufer gemeldet.
- Gelesen habe ich die Git-Objekte von c239c9ab (`git show`/`git grep` im Review-Worktree), nicht den Arbeitsbaum /home/user/Dwello.
