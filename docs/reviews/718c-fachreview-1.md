# Fachreview 718c, Runde 1 (Schritt 1): neuer Wiederherstellungscode

Gegenstand: die @wip-Szenarien ab `tests/e2e/features/sicherung.feature:110` (Commit 4352ad613), ihre Texte und Regeln.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Nach der Bestätigung gibt es bis zum nächsten Lauf um 03:00 keine Sicherung, die der neue Code öffnet. Genau im Hauptfall (Notfallblatt verloren, A8) ist der Liegenschaftsverwalter dann bis zu einem Tag ungeschützt, obwohl die Bestätigung «gilt ab jetzt» sagt. |
| V-2 | Verwalter | Major | Stellt der Betreiber eine Sicherung von vor dem Wechsel wieder her, kommt die Tabelle `backup_codes` mit ihr zurück. Dwello sichert danach wieder mit dem alten Code, das neue Notfallblatt öffnet die neuen Sicherungen nicht. Wer das alte Blatt nach den 12 Monaten wegwirft, verliert alles. |
| V-3 | Verwalter | Minor | «noch 12 Monate» stimmt als Obergrenze für den Ordner auf dem Server (nachgerechnet, siehe unten). Für die Kopie auf dem anderen Gerät gilt sie nicht (vgl. `privacy_retention_backup`), und der Text sagt nicht, dass auch Dritte mit dem alten Blatt diese Sicherungen weiter lesen können. Neuer Text: Tabelle, Key `backup_new_intro`. |
| V-4 | Verwalter | Minor | «den Code ändern» (Passwort- und Google-Text) klingt, als würden die alten Sicherungen umgeschlüsselt. Das Glossar (`UBIQUITOUS_LANGUAGE.md:257`) sagt «Ein neuer Code gilt für Sicherungen ab dann». Fix: «einen neuen Code erstellen». Statt «wer Ihr Google-Konto hat» besser «wer Zugang zu Ihrem Google-Konto hat». Texte: Tabelle. |
| V-5 | Verwalter | Minor | Nach dem Wechsel gibt es zwei Notfallblätter, und beide sagen «stellt den Stand der letzten Sicherung wieder her». Das alte Blatt stimmt damit nicht mehr. Fix: Das neue Blatt nennt, ab welchem Datum es gilt, und die Seite sagt, dass im Notfall beide Blätter an die betreuende Person gehen. Text: Tabelle, Key `backup_sheet_valid_from`. |

### V-1
- Beleg: `backend/src/services/backup.service.ts:233-238`. `backupDue` ist fällig, wenn seit einem Tag keine Sicherung gelang oder seit 03:00 noch keine lief. Eine Sicherung vom selben Tag mit dem alten Code gilt als Erfolg, also folgt die erste Sicherung mit dem neuen Code erst am nächsten Morgen. Das Szenario «Den neuen Wiederherstellungscode bestätigen» bestätigt «Der neue Wiederherstellungscode gilt ab jetzt. Dwello sichert Ihre Daten ab jetzt mit ihm.»
- Warum falsch: Ein neuer Code soll laut A8 (`docs/architecture/utility-tree.md:206`) gerade den Verlust des alten auffangen. Wer ihn aus diesem Grund erstellt, hat bis zur nächsten Nacht keine lesbare Sicherung. Ein Defekt in dieser Zeit (etwa beim nächsten Update) kostet dann alle Daten. Die Bestätigung erweckt den gegenteiligen Eindruck.
- Fix (bevorzugt): Gleich nach der Bestätigung erstellt Dwello eine Sicherung mit dem neuen Code. Dazu ein Szenario-Schritt «Und hat Dwello eine Sicherung mit dem neuen Wiederherstellungscode erstellt» und die Bestätigung `backup_new_confirmed` aus der Tabelle. Falls das nicht geht: Die Bestätigung sagt, dass die erste Sicherung mit dem neuen Code in der kommenden Nacht entsteht (Alternativtext in der Tabelle).

### V-2
- Beleg: `confirmedCode` liest den Code aus der Datenbanktabelle `backup_codes` (`backup.service.ts:51-62`). Die Sicherung ist ein `pg_dump` der ganzen Datenbank (`:107-112`). `restoreBackup` ersetzt die Datenbank (`UBIQUITOUS_LANGUAGE.md:259`: «Ersetzt Daten und Schlüssel»). Eine Sicherung von vor dem Wechsel enthält den neuen Code also nicht.
- Warum falsch: Die Regel «Ein neuer Code gilt für Sicherungen ab dann» bricht still. Gleichzeitig rät der neue Text, das alte Blatt nach 12 Monaten nicht mehr aufzubewahren. Gerade danach wäre es aber wieder das einzige gültige.
- Fix: Nach einer Wiederherstellung meldet der Befehl dem Betreiber, mit welchem Code Dwello ab jetzt sichert (mit dem Datum des Notfallblatts, das er eingegeben hat). Ausserdem sagt die Installationsanleitung, dass dieses Blatt wieder gilt oder der Liegenschaftsverwalter einen neuen Code erstellen soll. Alternativ ein Szenario oder ein `*.pg.test.ts`: Eine Wiederherstellung einer älteren Sicherung behält einen neueren bestätigten Code, sofern die bisherige Datenbank noch erreichbar ist. Welche Variante gilt, entscheidet der Product Owner: Issue mit `domain`, `needs-decision` vorschlagen.

### Nachrechnung «12 Monate» (V-3)
`kept`, `backup.service.ts:72-88`: Eine Monatssicherung des Monats M bleibt, solange `oldest <= M` gilt, also bis einschliesslich Monat M+11. Sie wird beim ersten Lauf in M+12 gelöscht.
- Wechsel am 15.10.2026: Die Sicherungen im Oktober nach dem Wechsel tragen den neuen Code und verdrängen die alten des Monats; die täglichen alten fallen nach 7 Tagen weg. Die letzte alte Sicherung ist die vom 30.09.2026. Sie wird am 01.09.2027 gelöscht, rund 10,5 Monate nach dem Wechsel.
- Grenzfall: Wechsel am 01.11.2026 nach dem Lauf um 03:00, und danach gelingt im November keine Sicherung mehr. Die neueste Novembersicherung ist dann die alte vom 01.11.2026, gelöscht am 01.11.2027: genau 12 Monate.

«noch 12 Monate» ist für den Server also eine richtige Obergrenze. Die Kopie des Betreibers kann länger reichen.

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| backup_new_intro | Die Sicherungen von vorher lassen sich weiterhin nur mit dem alten Code lesen. Dwello löscht sie nach und nach, die letzte nach höchstens 12 Monaten. Bewahren Sie das alte Notfallblatt bis dahin auf; fragen Sie die Person, die Dwello betreut, ob ihre Kopie Sicherungen länger behält. Wer das alte Notfallblatt hat, kann diese Sicherungen bis dahin ebenfalls lesen. | bei der Umsetzung | bei der Umsetzung | bei der Umsetzung |
| backup_new_password_intro | Geben Sie Ihr Passwort erneut ein. So kann nur, wer das Passwort kennt, einen neuen Code erstellen. | bei der Umsetzung | bei der Umsetzung | bei der Umsetzung |
| backup_new_google_intro | Melden Sie sich erneut mit Google an. So kann nur, wer Zugang zu Ihrem Google-Konto hat, einen neuen Code erstellen. | bei der Umsetzung | bei der Umsetzung | bei der Umsetzung |
| backup_new_confirmed | Der neue Wiederherstellungscode gilt ab jetzt. Dwello hat Ihre Daten soeben mit ihm gesichert und sichert sie ab jetzt jeden Tag mit ihm. | bei der Umsetzung | bei der Umsetzung | bei der Umsetzung |
| backup_new_confirmed (Alternative zu V-1) | Der neue Wiederherstellungscode gilt ab jetzt. Die erste Sicherung mit ihm erstellt Dwello in der kommenden Nacht; bis dahin öffnet nur das alte Notfallblatt eine Sicherung. | bei der Umsetzung | bei der Umsetzung | bei der Umsetzung |
| backup_sheet_valid_from | Dieser Code gilt für die Sicherungen ab {date}. Ältere Sicherungen öffnet das Notfallblatt von vorher; geben Sie im Notfall beide Blätter weiter. | bei der Umsetzung | bei der Umsetzung | bei der Umsetzung |

Begriffsrisiko fr/it/en:
- «Sicherungen von vorher»: im Italienischen Mehrzahl «copie di sicurezza» (`docs/design/i18n-begriffe.md:126`), nicht «backup».
- «einen neuen Code erstellen»: fr «créer un nouveau code de restauration», nicht «modifier».
- «Zugang zu Ihrem Google-Konto»: en «access to your Google account».

Der Hinweis zum falschen Passwort («Das Passwort stimmt nicht. Geben Sie das Passwort ein, mit dem Sie sich anmelden.»), der neue Text zum Aufbewahren des Blatts und die 10 Minuten für Google bleiben unverändert.

## Fehlende Begriffe
Keine. «Neuer Wiederherstellungscode» deckt das Glossar ab (`UBIQUITOUS_LANGUAGE.md:257`, «Ein neuer Code …»).

## Nicht bestätigt
- Ob die Bestätigung eine Sicherung sofort auslösen kann, ohne dass sie mit dem Lauf um 03:00 kollidiert: nur `backupDue`/`backupIfDue` gelesen, den Scheduler nicht.
- Wortlaut von #718 («Decided (product owner)», «New code»): `gh issue view` ist hier gesperrt (GraphQL 403). Ich habe mich auf den Wortlaut im Auftrag und auf A8 in `docs/architecture/utility-tree.md:206` gestützt.
- Ob die erneute Anmeldung mit Google ein neues Cookie setzt (etwa für die Rückkehradresse oder die Anmeldezeit). Falls ja, muss es in `privacy_cookies_*` stehen (Art. 45c FMG). Das zeigt sich erst bei der Umsetzung.

Geprüft:
- Datenschutzerklärung, Art. 19 Abs. 2 und 4 DSG (Stand 7. Juli 2025): «mindestens mit: a. die Identität und die Kontaktdaten des Verantwortlichen; b. den Bearbeitungszweck; c. gegebenenfalls die Empfängerinnen und Empfänger …» sowie Abs. 4 zum Ausland. Ein neuer Code bringt keinen neuen Empfänger, keinen neuen Zweck und kein neues Land. Die erneute Anmeldung bei Google deckt `privacy_login_google` («bei jeder Anmeldung») ab. «Lesen kann die Sicherungen nur, wer den Wiederherstellungscode kennt» bleibt richtig. Es ist keine Änderung nötig, ausser einem neuen Cookie (siehe «Nicht bestätigt»).
- Seitentitel «Neuer Wiederherstellungscode», Zugang über «Einstellungen».
- Kein Code vor der erneuten Anmeldung.
- Bestätigung durch erneutes Eingeben, Hinweis bei falscher Eingabe.
- Szenario zum Notfallblatt.
- Mietrecht: nicht berührt.

## Triage

- V-1 (Major): fixed. The confirmation of a new code backs up right away (the Sicherungen of one process run one after the other); the confirmation text says so («Dwello erstellt gleich eine erste Sicherung mit ihm …», close to the proposed text, which said «soeben gesichert» before the run has finished).
- V-2 (Major): a product decision; #953 (`domain`, `needs-decision`).
- V-3, V-4, V-5: wording of the table adopted (V-5 as a line on the new sheet; the date the code applies from is the confirmation, which the sheet made before it cannot name).
