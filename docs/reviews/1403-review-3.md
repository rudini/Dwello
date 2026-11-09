# Code-Review 1403, Runde 3 (Delta 70ff7679..540d2513)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine offenen oder neuen Befunde |

Geschlossen: C-4

## Nicht bestätigt

- Das neue Szenario (statement-minimum-balance.feature:252) läuft in chromium grün (1 passed): vom Aufrufer gemeldet.
- Der Lauf von statement-minimum-balance.feature, dashboard.feature und statement-reminder.feature auf 70ff7679 (chromium + api, 101 passed): vom Aufrufer gemeldet.
- Der pg-Test von 70ff7679 war zuerst rot (Expected 103.00, Received 100.00): vom Aufrufer gemeldet. Deshalb braucht das Szenario keinen eigenen Rotlauf (Workflow 2, die Commit-Nachricht sagt das). Nur gelesen: Ohne die Korrektur nennt die Warnung 150.00 statt 153.00, und der Schritt prüft mit `toBe` den ganzen Text (documents.steps.ts:196). Das Szenario würde also rot.

Geprüft: Das Delta betrifft nur das Feature. Es verwendet nur bestehende Schritte, keine Formulierung «klickt»/«Button». Die Reihenfolge ist richtig: 2025 wird versendet, bevor 2024 erledigt ist, danach kommt die geänderte Rechnung. Die Rechnung im Kommentar stimmt (1'350.00 – 1'200.00 + 3.00 = 153.00). Die Grundlage liefert 100.00 Akonto pro Monat und keine Verwaltungspauschale.
