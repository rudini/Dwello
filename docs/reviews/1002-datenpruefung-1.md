# Datenprüfung #1002 (paidThisMonth), Runde 1

Geprüfter Stand: Worktree review-1002-daten, 10fd6f2 (Commit 1498f90). Heute (Schweizer Zeit) 2026-11-02, Monatsbeginn 2026-11-01.

## Ergebnis

Keine Findings (kein Blocker, Major oder Minor). `GET /api/v1/dashboard` → `financial.paidThisMonth` stimmt in allen acht Szenarien auf den Rappen mit der unabhängigen Neuberechnung überein.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| – | – | keine Findings | – | – |

Geprüft: Demo-Abrechnungen NK-11111111-2024-0001, -0002, -0004, NK-11111111-2025-0001, NK-22222222-2024-0002, -0003 (je mit eingefügten Teilzahlungen, danach zurückgesetzt) und die unveränderte Demo-Ausgangslage (alle 17 Abrechnungen, Wert 0).

## Methode

- Neuberechnung: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/d1002-check.py` (Python, liest `utility_statements` per psql, `Decimal`, kein Dwello-Code). Regel aus Docs/Issue: nur Saldo > 0; Zahlungsliste nicht leer → Summe der `amount` mit `date >= Monatsbeginn`; Liste leer → `paid_amount`, wenn `paid_date >= Monatsbeginn`. Monatsbeginn aus Europe/Zurich.
- API-Aufruf mit selbst signiertem HS256-Token (Secret aus `docs/design/tools/persona-stack.sh`).
- Szenarien: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/d1002-scen.sh` (kumulativ, jeder Schritt vergleicht API und Erwartung).

## Ausgangslage

Demo-Daten: 17 Abrechnungen, alle bezahlten mit Zahlung am 2025-05-05, also keine im aktuellen Monat. API 0, erwartet 0.

## Szenarien (API = Erwartung, jeweils kumulativ)

| # | Eingefügt | API | Erwartet |
|---|-----------|-----|----------|
| S1 | 2024-0001 (Saldo 72.55): Zahlungen 30.00 am 2026-10-15, 20.10 am 2026-11-01, 22.45 am 2026-11-02 (Monatsgrenze 1.11. zählt, Oktober nicht) | 42.55 | 42.55 |
| S2 | 2024-0004 (35.65): leere Liste, paid_date 2026-11-02, paid_amount 35.65 | 78.20 | 78.20 |
| S3 | 11111111-2024-0002 (Rückerstattung -171.70) mit Zahlung -171.70 am 2026-11-02: darf nicht zählen | 78.20 | 78.20 |
| S4 | 2025-0001 (sent, 215.80): Teilzahlung 100.05 am 2026-11-02, noch offen | 178.25 | 178.25 |
| S5 | 22222222-2024-0002: leere Liste, paid_date 2026-10-31 (Vormonat) | 178.25 | 178.25 |
| S6 | 22222222-2024-0003 (26.20): Status `replaced`, Zahlung am 2026-11-02 | 204.45 | 204.45 |
| S7 | 22222222-2024-0002: Zahlung 121.05 am 2026-10-31, aber paid_date 2026-11-02 (Liste hat Vorrang, zählt nicht) | 204.45 | 204.45 |
| S8 | 2024-0001 Dezimalfall: 0.10 + 0.10 + 0.20 am 2026-11-02 plus 72.15 am 2026-10-30 (nur 0.40 zählt) | 162.30 | 162.30 |

S8-Summe: 0.40 + 35.65 + 100.05 + 26.20 = 162.30.

## Zusatzbeobachtungen (kein Finding)

- Verhalten gegenüber früher: Der Status-Filter (`paid` oder `replaced`) entfällt. Teilzahlungen auf offenen Abrechnungen (S4) zählen jetzt, das ist die gewollte Änderung. Eine Abrechnung mit Status `settled` zählt nur, wenn sie `paid_amount` und `paid_date` im Monat hat (Weg `settled` → `paid` bei Bagatellsaldo, `recordPayment` mit `waived`); das ergibt denselben Betrag wie vorher, weil der Status dann `paid` ist.
- Es gibt keine Obergrenze des Datums: Eine Zahlung mit künftigem Datum (z. B. Folgemonat) würde mitgezählt. Der Schreibpfad lässt es zu (`checkPaidDate` prüft nur gegen das Periodenende, nicht gegen heute). Ich habe es nicht als Finding gewertet, weil es nicht Teil des Issues ist und bisher (`gte` ohne Obergrenze) genauso war.
- Keine Seite zeigt den Wert (BFF typisiert ihn nur: `src/routes/dashboard/+page.server.ts`, `tests/contracts/dashboard.json` mit 0), daher kein Abgleich mit Webseite oder PDF; keine QR-Rechnung betroffen.

## Wiederherstellung

Die Spalten `status, paid_amount, paid_date, payments, payment_recorded_at` aller 17 Abrechnungen wurden aus einer vorher angelegten Sicherungstabelle (inzwischen gelöscht) zurückgeschrieben; Ausgangswert 0 bestätigt. Einzige Abweichung: `updated_at` aller 17 Abrechnungen steht jetzt auf 2026-11-02 09:36:30 (Wiederherstellungs-UPDATE); inhaltlich unerheblich.

## Nicht bestätigt

- Webseite/PDF/QR: nicht betroffen (kein Anzeigeort für `paidThisMonth`).
- Grenzfall um Mitternacht (UTC vs. Schweizer Zeit): nur durch Codelesen bestätigt (`swissToday()` für den Monatsbeginn), nicht durch Laufzeittest mit verstellter Uhr, weil die Systemuhr nicht verändert werden darf.
- Zahlungen über den Dienst (UI/API `PATCH` auf `paid`) habe ich nicht ausgelöst, um die Demo-Daten nicht zu verändern; Zahlungslisten wurden direkt in die Datenbank geschrieben, im Format von `recordPayment` (`{date, amount, recordedAt}`).
