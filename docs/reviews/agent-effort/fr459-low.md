# Fachreview #459 Slice B (Szenarien @wip, 35db6f79)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Die Frist berücksichtigt nur das Vertragsende. Abrechnungen und Mahnungen nach dem Auszug, die das Plan- und Datenschutzkonzept nennt, kommen in keinem Szenario vor. |
| M-1 | Mietrecht | Minor | Die Bestätigung erwähnt nicht, dass ein laufender Streit (Schlichtung, Betreibung, Kaution) die Aufbewahrung verlängern kann. Fix: In der Bestätigung einen Satz «Nur anonymisieren, wenn keine Forderung oder kein Verfahren mehr offen ist» ergänzen. |
| R-1 | Rechtstexte | Minor | Im Satz der Datenschutzerklärung steht «können Sie … anonymisieren». Nach Art. 6 Abs. 4 DSG müssen nicht mehr benötigte Daten vernichtet oder anonymisiert werden, es ist also keine Option. Fix: «… sollten Sie ihn anonymisieren». |
| V-2 | Verwalter | Minor | Der Begriff «anonymisieren» fehlt im Glossar. Dafür ist #623 schon offen. Vorschlag: «Mieter anonymisieren: Name, Kontaktdaten und Dokumente eines ehemaligen Mieters endgültig entfernen; Beträge bleiben.» |

## V-1
Belege: tenant-detail.feature, neue Szenarien. Beide Szenarien leiten die Frist nur aus dem Vertragsende ab. Die Datenschutzerklärung (privacy.feature) nennt aber auch «die letzte Abrechnung oder Mahnung». Die Nebenkostenabrechnung für 2019 wird typischerweise erst 2020 erstellt. Dann gilt die Frist ab dem 01.01.2031 und nicht ab dem 01.01.2030.
Warum das falsch ist: Die Regel, die am meisten Fehler verursacht, ist nicht festgehalten. Wenn sie falsch umgesetzt wird, löscht das Anonymisieren zu früh, und das lässt sich nicht rückgängig machen.
Fix: Eine Examples-Zeile ergänzen: Vertrag bis 2019-12-31, Abrechnung erstellt am 2020-03-15, Erwartung «ab dem 01.01.2031». Ebenso eine Zeile für eine Mahnung.

Nachgerechnet (nur Vertragsende): Ende 2014-12-31 → Jahresende 2014 + 10 Jahre = 01.01.2025, heute (2026) also zulässig. Ende 2019-12-31 → 01.01.2030. Beide Szenarien sind in sich stimmig.

Geprüft: dass die Bestätigung die echte Folge nennt, «Ehemaliger Mieter» als Anzeigename, die Suche nach dem Mieter, die Daten im Datenschutzsatz und der Plan für Slice B.

## Nicht bestätigt
- Den Wortlaut von Art. 958f Abs. 1 OR, Art. 127 OR und Art. 6 Abs. 4 DSG habe ich nicht von Fedlex geholt. Diese Bezüge sind deshalb **unsicher**. Ebenfalls offen: Gilt Art. 958f überhaupt für private Vermieter ohne Buchführungspflicht? Mietzinsforderungen verjähren nach Art. 128 Ziff. 1 OR schon nach 5 Jahren, 10 Jahre sind also eher vorsichtig.
- Ob die Demo- oder E2E-Daten für «Lea Frei» Abrechnungen oder Mahnungen enthalten, die die Frist verschieben würden. Die Seed-Daten habe ich nicht angesehen.
