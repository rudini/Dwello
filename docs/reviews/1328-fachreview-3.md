# Fachreview #1328, Schritt 5, Runde 1 (Commit 59f129e)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Ein Akonto allein markiert den Entwurf entgegen dem Entscheid und mit falschem Grund, sobald nach dem Erstellen irgendein Feld einer Wohnung des Gebäudes oder das Gebäude selbst bearbeitet wurde, auch Nummer, Stockwerk, Status oder Name, oder sobald der Entwurf nach einer echten Wohnungsänderung schon neu berechnet ist. Beleg: `statement-invoices.service.ts:144–145` vergleicht `valuesChangedAt` mit `createdAt`. `recalculateStatement` setzt `createdAt` nicht neu (`statement.service.ts:612`), und `updateApartment` setzt `updatedAt` bei jedem Feld (`apartment.service.ts:272`). `check.changes` vergleicht den Saldo samt Akonto (`statement.service.ts:559–581`). Beispiel: Status von 3.02 auf «reserviert» gesetzt, danach das Akonto 2024 von Eva von 200 auf 210 korrigiert: Der Saldo sinkt um 120.00, und der Hinweis sagt «eine Wohnung … so geändert». «Neu berechnen» gibt trotzdem das richtige Ergebnis. Fix: den Vergleichszeitpunkt beim Erstellen und bei «Neu berechnen» setzen (eigene Spalte statt `createdAt`). Zusätzlich das Gebäude nur bei Änderungen von Fläche, Zimmeranzahl, Raumvolumen, Aufgehoben ab, früheren Werten oder beim Löschen berühren, statt das `updated_at` jedes Felds zu nehmen. |

## Nicht bestätigt

- Ob «Neu berechnen» den neuen Hinweis beseitigt (Runde-1-V-9): Das sieht nach dem Code so aus, weil `check.changes` danach falsch ist. Ein Szenario dafür habe ich im Diff nicht gefunden (gesucht in `tests/e2e/features/statement-detail.feature`). `backend/src/__tests__/statement-outdated-values.pg.test.ts` habe ich nicht gelesen.
- Ob die Kostenabstimmung Entwürfe mit geändertem Übertrag nennt: Sie nennt sie nicht, denn `notUpToDate` (`statement-invoices.service.ts:198–206`) prüft `carryChanged` nicht. Das ist eine bestehende Lücke und passt zur Notiz, die den Übertrag nicht nennt. Es ist kein Befund dieser Änderung.

Geprüft: Die Glossarzeile «Nicht aktuelle Abrechnung» entspricht wörtlich dem Entscheid. Alle 17 neuen oder geänderten Texte in de/fr/it/en stimmen wörtlich mit `1328-fachreview-1.md` und `-2.md` überein, mit U+00A0 im Französischen; `statements_recalculated` bleibt wie entschieden. Die Regel im Code stimmt mit A' überein:
- nur Entwürfe, nur ohne geänderte Rechnungen, Tankbestand oder Übertrag;
- es zählen nur die Schlüssel der eigenen Positionen;
- kein neuer Grund, wenn die Neuberechnung `null` liefert;
- versendete Abrechnungen unverändert, `correctionOf` gleichwertig;
- das Löschen einer Wohnung berührt das Gebäude;
- ein Verteilschlüssel in Positionen lässt sich nicht löschen, und die Bausteine sind nur Werte der Wohnung.

Was die Bildschirme sagen (Detailhinweis und Titel, Versandbestätigung, Assistent und leere Vorschau, Übersicht samt Anzahl zum Zustellen, Kostenabstimmung, Hilfe «Neue Fläche und Zimmeranzahl gelten ab», Text und Hinweis zu «Neu berechnen»), trifft für die umgesetzte Regel zu. Die Beispielzahlen der Szenarien stimmen: korrigierte Fläche 215.00 → 143.33, gelöschte Wohnung 215.00 → 430.00, Fläche ab 1.7.2025 unverändert.
