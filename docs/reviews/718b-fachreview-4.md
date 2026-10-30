# Fach-Review #718 Teil 2 (Schritt 5, Runde 2): Delta 925f407b4..8d92c1374

Geschlossen: V-1, R-1, V-2, V-3, V-4, R-2

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-5 | Verwalter | Minor | `backup_keep_sheet` (alle Sprachen): Der neue erste Satz spricht von «Bestätigung». Auf der Seite heisst dieser Schritt aber «Wiederherstellungscode erneut eingeben» und «Sicherung starten» (`backup_confirm_label`, `backup_submit`). Ausserdem sagt der Satz nur, dass der Code verschwindet. Das Notfallblatt gibt es danach aber auch nicht mehr: backup.service.ts:327 setzt `pending_code = NULL`, und :342 lehnt das Blatt dann mit `BACKUP_NO_CODE` ab. Genau das hat Helga verpasst (P-1). en «Once you have confirmed it» bezieht «it» auf den Code, der erst später im Satz kommt. Fix: Tabelle unten. Die Szenariozeile sicherung.feature:31 ist neu in diesem Diff und darf mitgeändert werden. |
| R-3 | Rechtstexte | Minor | docs/installation.md:68: Das empfohlene `rsync -a --delete backups/ <target>/` (mein Vorschlag aus Runde 1) spiegelt auch einen Verlust. Ist der Ordner auf dem Server leer oder beschädigt (versehentlich gelöscht, leere Platte eingehängt) und läuft die Kopie weiter, löscht sie auch die Kopie auf dem anderen Gerät, also genau die Kopie, die den Defekt überstehen soll. Fix: `--max-delete=5` anfügen. Dwello selbst löscht pro Tag höchstens 2 Dateien (eine tägliche, am Monatswechsel eine monatliche), backup.service.ts:71–86. Dann bricht rsync bei einem Massenverlust ab, und die 12-Monats-Zusage (R-1) gilt trotzdem. |

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| backup_keep_sheet | Sobald Sie die Sicherung starten, zeigt Dwello den Code nicht mehr an, und das Notfallblatt lässt sich nicht mehr herunterladen. Drucken Sie das Notfallblatt aus und bewahren Sie es getrennt von diesem Computer an einem sicheren Ort auf, etwa bei Ihren Mietverträgen. | Dès que vous démarrez la sauvegarde, Dwello n’affiche plus le code et la fiche d’urgence ne peut plus être téléchargée. Imprimez la fiche d’urgence et conservez-la en lieu sûr, à l’écart de cet ordinateur, par exemple avec vos baux. | Appena avvia la copia di sicurezza, Dwello non mostra più il codice e la scheda di emergenza non si può più scaricare. Stampi la scheda di emergenza e la conservi in un luogo sicuro, lontano da questo computer, ad esempio insieme ai Suoi contratti di locazione. | Once you start the backup, Dwello no longer shows the code and the emergency sheet can no longer be downloaded. Print the emergency sheet and keep it in a safe place away from this computer, for example with your tenancy agreements. |

## Nicht bestätigt

- Gleich wie in Runde 1 (Fach-Review 3): Ist ein Cloud-Anbieter, der nur verschlüsselte Sicherungen erhält, ein Empfänger nach Art. 19 DSG, und braucht der Betreiber dafür die Genehmigung nach Art. 9 Abs. 3 DSG? Ist das Behalten in Sicherungen bis 12 Monate mit Art. 6 Abs. 4 DSG vereinbar? Beides **unsicher**, weil das Gesetz weder verschlüsselte Daten noch Sicherungen nennt.
- Ob pdfkit die geänderten Zeilen des Notfallblatts (fr mit geschützten Leerzeichen, längerer `location`-Text) ohne Überlauf setzt: Ich habe kein PDF erzeugt.

Geprüft: Der Satz «Nach der Bestätigung zeigt Dwello den Code nicht mehr an» stimmt in allen vier Sprachen mit backup.service.ts:323–343 überein (er ist nur unvollständig, siehe V-5). Die Wortlaute aus Runde 1 für V-1, V-2, V-3, V-4, R-1 und R-2 sind in messages/*.json, emergency-sheet.ts, installation.md und sicherung.feature unverändert übernommen.

## Triage

- V-5, R-3: wording adopted (scenario line of `backup_keep_sheet` changed first, seen red).
