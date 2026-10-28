# Fach-Review #718 Teil 2: `@wip`-Szenarien (773a92a06), Runde 2

Geschlossen: V-1, V-2, V-3, V-4, V-5, R-1, R-2, R-3, R-4

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-6 | Verwalter | Minor | Datumszeile des Notfallblatts (Vorschlag des Aufrufers, kein Szenariotext): «Code erstellt am {date}. Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn bestätigen.» Gelesen wird das Blatt erst im Notfall. Dann klingt «bestätigen» wie eine Aufgabe, die noch offen ist. Fix: «… ab dem Tag, an dem Sie ihn in Dwello bestätigt haben.» (`backup_sheet_date`, Tabelle unten). |

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| backup_sheet_date | Code erstellt am {date}. Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben. | Code créé le {date}. Il vaut pour les sauvegardes à partir du jour où vous l’avez confirmé dans Dwello. | Codice creato il {date}. Vale per le copie di sicurezza a partire dal giorno in cui lo ha confermato in Dwello. | Code created on {date}. It applies to backups from the day you confirmed it in Dwello. |

## Nicht bestätigt

- R-3: Das Szenario hält nur fest, dass die Seite nach der Bestätigung zur Übersicht führt. Ob der Klartext des Codes bei der Bestätigung gelöscht wird und ob der Download des Notfallblatts danach ins Leere läuft, zeigt erst der angekündigte `*.pg.test.ts`. Im geprüften Commit gibt es ihn noch nicht.
- R-4: Der Aufrufer sagt, die Texte der Sicherung erschienen nur, wenn die Installation einen Ordner für die Sicherung hat. Mit Ordner, aber vor der Bestätigung, sichert Dwello noch nichts (Glossar Wiederherstellungscode, UBIQUITOUS_LANGUAGE.md:255). Die Datenschutzerklärung nennt die Sicherung dann schon. Weil die Sicherung bei der Einrichtung Pflicht ist und Dwello dorthin weiterleitet, ist dieses Zeitfenster kurz. Die Umsetzung fehlt noch, darum nicht geprüft.
- Ob das Notfallblatt in fr/it/en die entschiedenen Inhalte zeigt: Laut Aufrufer prüft das ein Backend-Test für das PDF. Er ist im geprüften Commit nicht enthalten.
- Die rechtlichen Punkte, die in Runde 1 **unsicher** blieben, sind unverändert: ein Cloud-Anbieter als Empfänger nach Art. 19 Abs. 2 Bst. c und Abs. 4 DSG, und Sicherungen nach Art. 6 Abs. 4 DSG.

Geprüft: Die Texte `backup_setup_location`, `backup_setup_keep_sheet`, `backup_sheet_keep`, `backup_sheet_emergency`, `backup_code_mismatch`, `privacy_stored_backup` und `privacy_retention_backup` stehen in den Szenarien so wie in Runde 1 vorgeschlagen, je unter dem richtigen Abschnitt. Der Satz für Selbstbetreuer steht auf der Seite und auf dem Notfallblatt, auf der Seite mit Prüfung des Links. Das Notfallblatt prüft Datum, Webadresse und Ort der Sicherungen; die Webadresse ist ausgeschrieben und braucht darum keinen neuen Begriff. Für R-4 gibt es ein Gegenszenario: Die heutigen Texte unter «Aufbewahrung» (`privacy_retention_1`–`_3`) enthalten das Wort «Sicherung» nicht, die Prüfung mit «nicht» trägt also. «Betreiber» in der Datenschutzerklärung und «die Person, die Dwello betreut» auf der Seite entsprechen dem Glossar (Zeile 246).
