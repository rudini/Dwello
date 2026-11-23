# Fach-Review «texte», Runde 1 (Commit 34d5095, vor der Umsetzung)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | it, Vorschlag aus `docs/reviews/switch-help-fachreview-1.md`: «spunta la casella o toglie la spunta» weicht von der App ab. Dort steht «metta la spunta» / «tolga la spunta» (it.json:1743, 1747, 1844). Dazu ist «spuntare» doppeldeutig (auch «Häkchen entfernen»). Fix: «mette la spunta nella casella o la toglie», siehe Tabelle. |
| V-2 | Verwalter | Minor | en, Entwurf «keeps the newest backup of each day for the last 7 days»: «for the last 7 days» lässt sich als Dauer lesen («behält 7 Tage lang»), neben «for 12 months» erst recht. Fix: «from each of the last 7 days», siehe Tabelle. |

| key | de | fr | it | en |
|---|---|---|---|---|
| settings_updates_check_help (Schlusssatz, ersetzt den bisherigen; Rest unverändert) | Dwello speichert, sobald Sie das Kästchen ankreuzen oder das Kreuz entfernen. | Dwello enregistre dès que vous cochez ou décochez la case. | Dwello salva non appena Lei mette la spunta nella casella o la toglie. | Dwello saves as soon as you tick or untick the box. |
| backup_location (zweiter Satz, ersetzt den bisherigen; Rest unverändert) | Dwello behält die jüngste jedes Tages der letzten 7 Tage und je eine pro Monat während 12 Monaten. | Dwello conserve la plus récente de chacun des 7 derniers jours et une par mois pendant 12 mois. | Dwello conserva la più recente di ciascuno degli ultimi 7 giorni e una al mese per 12 mesi. | Dwello keeps the newest backup from each of the last 7 days and one per month for 12 months. |

## Nicht bestätigt

- Die Texte der Entscheide in #1456 und #1457 habe ich nicht selbst gelesen. Grundlage sind der Auftrag und die angepassten Szenarien (`tests/e2e/features/settings.feature`, `sicherung.feature` in 34d5095).
- Der entschiedene deutsche Satz sagt «der letzten 7 Tage». `kept()` behält die jüngste Sicherung der letzten 7 Tage, **an denen gesichert wurde** (`backend/src/services/backup.service.ts:87`, `newestPer(day).slice(0, 7)`). Bei einer Lücke behält der Code also mehr als der Text sagt (schon V-2 in `docs/reviews/switch-help-fachreview-1.md`). Der Product Owner hat den Satz entschieden. Die Übersetzungen geben ihn getreu wieder und gehen nicht darüber hinaus.

Geprüft: Bedienelement `Checkbox` (`src/routes/config/+page.svelte:113–121`). App-Wortlaut fr «cocher/décocher la case» (fr.json:1743, 1854), en «tick/untick the box» (en.json, z. B. buildings_no_tank_help), it «casella», «mettere/togliere la spunta». Begriffe «Sicherung» = sauvegarde / copia di sicurezza / backup (i18n-begriffe.md:152). Bezug von «la plus récente»/«la più recente» auf «Les sauvegardes»/«Le copie di sicurezza» im ersten Satz von `backup_location` (feminin). Monatsteil gegen `kept()` Z. 84–90 (jüngste je Monat, 12 Monate einschliesslich des laufenden). Anrede vous/Lei, Apostroph ’. Entwürfe fr/it zu `backup_location` inhaltlich richtig; die Tabelle nimmt «chacun/ciascuno», damit «jour/giorno» nicht doppelt steht.
