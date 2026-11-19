# Fach-Review #1456 / #1457, Runde 1 (Commit b6a04db, vor der Umsetzung)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Der Satz nennt einen «Schalter», den man «umlegt». Auf `/config` steht aber ein gewöhnliches Kontrollkästchen (`src/routes/config/+page.svelte:113` → `Checkbox`, `src/lib/ui/Checkbox.svelte:42` `type="checkbox"`). Für dieses Element sagt die App sonst «Häkchen setzen/entfernen», «ankreuzen» (de.json:711, 953, 955), «cocher/décocher la case» (fr), «spuntare la casella» (it) und «tick/untick the box» (en). Wer wenig Erfahrung hat, sucht so einen Schalter, den es nicht gibt. Weil der deutsche Text entschieden ist, braucht die Änderung einen Entscheid des Product Owners (#1456). Wortlaut als Vorschlag in der Tabelle unten. Bleibt es bei «Schalter», sind die vorgeschlagenen Sätze in fr, it und en so richtig. |
| V-2 | Verwalter | Minor | Die neue Glossarzeile «die jüngste jedes Tages der letzten 7 Tage» weicht von `kept()` ab (`backend/src/services/backup.service.ts:75,87`). Der Code behält die jüngste Sicherung der letzten **7 Tage, an denen gesichert wurde** (`newestPer(day).slice(0, 7)`), keine 7 Kalendertage. Beispiel: heute 28.10., Sicherungen am 28., 27. und vom 15. bis 20.10. (Server vom 21. bis 26. aus). Der Code behält 28, 27, 20, 19, 18, 17, 16. Nach dem Text blieben nur 28 und 27. Ohne Lücke stimmen Code und Text überein (Test `backend/src/__tests__/backup.pg.test.ts:365`). Ebenfalls richtig sind «die jüngste» bei zwei Sicherungen am selben Tag und der Monatsteil (jüngste je Monat, 12 Monate einschliesslich des laufenden, Z. 84–90). Korrektur, falls #1457 sie zulässt: «Dwello behält die jüngste jedes Tages der letzten 7 Tage mit einer Sicherung und je eine pro Monat während 12 Monaten.» |

Wortlaut zu V-1, nur falls der Product Owner vom «Schalter» abgeht (am Ende von `settings_updates_check_help`, nach einem Leerzeichen):

| key | de | fr | it | en |
|---|---|---|---|---|
| settings_updates_check_help (Schlusssatz) | Dwello speichert, sobald Sie das Häkchen setzen oder entfernen. | Dwello enregistre dès que vous cochez ou décochez la case. | Dwello salva non appena Lei spunta la casella o toglie la spunta. | Dwello saves as soon as you tick or untick the box. |

## Nicht bestätigt

- Was in #1456 und #1457 genau entschieden wurde (z. B. ob der PO wusste, dass das Element ein Kontrollkästchen ist): `gh issue view` lieferte hier nichts, ich konnte nur die Zusammenfassung des Auftrags lesen.
- Ausserhalb des Auftrags, nur als Hinweis: Der Hilfetext `backup_location` (de.json:2480) sagt weiterhin «die letzten 7 täglichen» und weicht damit von der neuen Glossarzeile ab. Ich habe nicht geprüft, ob #1457 diesen Text mit umfasst.

Geprüft: Szenario (Schritte vorhanden: `sicherung.steps.ts:45`, `settings.steps.ts:106` mit neuem Feld `updateCheck`; Begriffe Liegenschaftsverwalter und Einstellungen). Dass das Element sofort speichert (`+page.svelte:97`, Bestätigungen «Gespeichert.» / «Enregistré.» / «Salvato.» / «Saved.»). Die Sätze in fr, it und en am Ende des jeweiligen Hilfetexts: Anrede vous/Lei (gross), Apostroph ’, keine Guillemets, «réglage» und «enregistrer»/«salvare»/«save» wie in i18n-begriffe.md:156, 172.
