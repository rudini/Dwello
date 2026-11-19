# Fachreview #1457 «Sicherung vor jedem Update», Runde 1 (Schritt 1, Commit cbb3173)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Die Sicherung läuft im POST, der BFF bricht nach 30 s ab: Der Liegenschaftsverwalter liest einen Fehler, das Update startet trotzdem |
| V-2 | Verwalter | Major | Szenario 1 legt die Regel «zuerst sichern, dann herunterladen» nicht fest und kann auf dem Basis-Commit grün sein |
| V-3 | Verwalter | Minor | Läuft schon ein Update (oder ein zweiter Tab startet eines), sichert `startUpdate` zuerst und lehnt erst danach mit `UPDATE_RUNNING` ab. Behebung: `GET {UPDATER_URL}/status` vor `createBackup` fragen; ist der Zustand nicht `idle`/`done`/`failed`, gleich `UPDATE_RUNNING` (`backend/src/updater/updater.ts:144`) |
| V-4 | Verwalter | Minor | Öffnet das Fenster vor der Antwort, landen auch `backend_update_running`, `_backup_missing` und `_unavailable` unter «Das Update hat nicht geklappt», obwohl kein Update gescheitert ist («Ein Update läuft bereits»). Behebung: Nur `UPDATE_BACKUP_FAILED` erscheint im Fenster; bei den übrigen schliesst sich das Fenster, und die Ablehnung steht wie heute in der Zeile des Hinweises (`src/lib/ui/UpdateNotice.svelte:36`) |
| V-5 | Verwalter | Minor | `update_confirm_text` nennt die Schritte in der alten Reihenfolge («lädt … herunter, sichert … und startet neu»), das Fenster zeigt dann «Sichern» zuerst. Kein Szenario zitiert den Text. Behebung: Text unten |
| V-6 | Verwalter | Minor | `docs/installation.md:92` («before every update that changes the database», «the update stops …: the backend restarts», «at most two a day») und `:96` («The new backend backs up …») stimmen nicht mehr. Behebung: Sätze unten |
| V-7 | Verwalter | Minor | `UBIQUITOUS_LANGUAGE.md:297` (Update: «Schritte: Herunterladen, Sichern, Neu starten») und `:290` (Sicherung: «jeden Tag») widersprechen dem neuen Ablauf. Behebung: Wortlaut unter «Fehlende Begriffe» |
| V-8 | Verwalter | Minor | Der Zustand `update-running` (`tests/a11y/screens.json:190`) sagt «the stand-in holds it at «Sichern»». Mit `backend` → «Neu starten» stimmt das nicht mehr. Behebung: «… holds it at «Neu starten»» |

## V-1 (Major): Zeitlimit des BFF während der Sicherung

- Beleg: `src/lib/server/api-proxy.ts:43–44` (`BACKEND_API_TIMEOUT` vorgegeben `30000`) und `:119–121` (nur KI-Pfade bekommen mehr). `POST /api/update` geht über `forwardRequest` (`src/routes/api/update/+server.ts:19`). Die Sicherung umfasst die ganze Datenbank mit Belegen und Dokumenten als Base64 (`backend/src/db/schema.ts:355`; `createBackup` = `pg_dump` + Verschlüsselung, `backend/src/services/backup.service.ts:98–165`). Bei einer echten Installation dauert das gut länger als 30 s.
- Warum falsch: Nach 30 s bekommt der Browser `GATEWAY_TIMEOUT`, und das Fenster meldet einen Fehler. Das Backend sichert aber weiter, ruft danach den Update-Dienst auf, und das Update startet. Damit bricht die Regel des Issues: Der Liegenschaftsverwalter erfährt «gescheitert», während Dwello aktualisiert und neu startet. Umgekehrt kann ein Abbruch nach einer gescheiterten Sicherung den Grund (`backend_update_backup_failed`) verdecken.
- Behebung: `POST /update` bekommt im BFF ein eigenes Zeitlimit, das zur Seite passt (die Seite nennt eine Stunde: `update_overlay_slow`), z. B. 60 Minuten wie `KI_PATH`/`KI_TIMEOUT`. Dazu ein Test im BFF. Das Fenster fragt `GET /api/update` erst nach der Antwort 202 ab: Der Update-Dienst behält `done`/`failed` vom letzten Lauf (`updater.ts:125, 136`; der Stand-in auch, `backend/scripts/update-stub.ts:20`). Eine frühere Abfrage würde mitten in der Sicherung neu laden oder ein altes Scheitern zeigen. Schritte: «Sichern» bis zur Antwort, dann `pulling` → «Herunterladen», `backend` und `frontend` → «Neu starten». Durchgerechnet: POST offen → Schritt 1 von 3; `pulling` → 2 von 3; `backend` → 3 von 3; `frontend` → 3 von 3; `done` → neu laden. Grenzfall: Abfrage vor 202 bei altem `done` → falsches Neuladen. Darum erst nach 202 abfragen.

## V-2 (Major): Szenario 1 legt die Reihenfolge nicht fest

- Beleg: `tests/e2e/features/aktualisierung.feature:110` «Und hat Dwello vor dem Update eine Sicherung erstellt». Die Regel «bevor es etwas herunterlädt» steht nur im Kommentar (`:100–101`). Die Sicherung der eingerichteten frischen Installation entsteht schon beim Einrichten oder beim 15-Minuten-Takt (`backupIfDue`, `backup.service.ts:263–276`).
- Warum falsch: Prüft der Schritt nur, dass eine Sicherung existiert oder dass eine nach der Bestätigung entstand, dann ist er grün:
  - auf dem Basis-Commit, falls der Takt in die Zeit fällt;
  - bei einer Sicherung parallel zum Herunterladen oder danach.

  Der Kern des Issues («Before the update service pulls anything») wäre also nicht festgelegt. Ebenso fehlt «auch ohne Änderung der Datenbank» (der Stand-in migriert nicht, das Szenario sagt es aber nicht).
- Behebung: Titel «Vor jedem Update erstellt Dwello zuerst eine Sicherung, auch wenn die neue Version die Datenbank nicht ändert». Schritt «Und hat Dwello eine Sicherung erstellt, bevor das Update etwas heruntergeladen hat». Prüfung: Eine erfolgreiche Sicherung (`backup_runs.finished_at`, ohne `error`) liegt nach der Bestätigung und vor der Zeit, zu der der Stand-in `POST /update` erhielt. Der Stand-in merkt sich diese Zeit. Sieht man den Schritt rot, ohne die neue Sicherung in `startUpdate`, ist der Fall des Takts ausgeschlossen.
- Zu Szenario 2: Meldungen gemäss Tabelle unten. Zitieren Sie zwei Zeilen:
  - «Dwello konnte vor dem Update keine Sicherung erstellen und hat das Update darum nicht gestartet. Es hat sich nichts geändert; Dwello läuft weiter in der bisherigen Version.»
  - «Melden Sie sich bei der Person, die Dwello betreut; sie kann es dort nachlesen.»

  Das Fenster zeigt nur `backend_update_backup_failed`, nicht zusätzlich `update_failed_log`, denn der Satz zum Protokoll steht schon darin. «Version 1.4.0» aus dem Entwurf entfällt, weil das Backend die Version des Frontends nicht kennt. Die Vorbedingung «konnte aber seit 2 Tagen keine Sicherung erstellen» passt: Ihr Code kann nicht verschlüsseln, die Sicherung scheitert also (`tests/e2e/tasks/accessibility.ts:1053`). «Und hat Dwello nichts heruntergeladen» passt zu «nichts geändert».

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| backend_update_backup_failed | Dwello konnte vor dem Update keine Sicherung erstellen und hat das Update darum nicht gestartet. Es hat sich nichts geändert; Dwello läuft weiter in der bisherigen Version. Die Ursache steht im Protokoll des Servers. Melden Sie sich bei der Person, die Dwello betreut; sie kann es dort nachlesen. Sobald Dwello wieder eine Sicherung erstellen kann, können Sie das Update starten. | Dwello n’a pas pu créer de sauvegarde avant la mise à jour ; c’est pourquoi la mise à jour n’a pas été lancée. Rien n’a changé ; Dwello continue de fonctionner dans la version précédente. La cause figure dans le journal du serveur. Contactez la personne qui s’occupe de Dwello ; elle peut l’y consulter. Dès que Dwello pourra de nouveau créer une sauvegarde, vous pourrez lancer la mise à jour. | Prima dell’aggiornamento Dwello non è riuscito a creare una copia di sicurezza, perciò non ha avviato l’aggiornamento. Non è cambiato nulla; Dwello continua a funzionare nella versione precedente. La causa figura nel registro del server. Si rivolga alla persona che si occupa di Dwello; può consultarla lì. Appena Dwello riuscirà di nuovo a creare una copia di sicurezza, potrà avviare l’aggiornamento. | Dwello could not make a backup before the update, so it did not start the update. Nothing has changed; Dwello keeps running in the previous version. The cause is in the server log. Contact the person who looks after Dwello; they can look it up there. As soon as Dwello can make a backup again, you can start the update. |
| update_confirm_text | Dwello sichert Ihre Daten, lädt Version {latest} herunter und startet neu. Das dauert einige Minuten; so lange können Sie Dwello nicht nutzen. | Dwello sauvegarde vos données, télécharge la version {latest} et redémarre. Cela prend quelques minutes ; pendant ce temps, vous ne pouvez pas utiliser Dwello. | Dwello crea una copia di sicurezza dei Suoi dati, scarica la versione {latest} e si riavvia. Ci vogliono alcuni minuti; nel frattempo non può usare Dwello. | Dwello backs up your data, downloads version {latest} and restarts. This takes a few minutes; during that time you cannot use Dwello. |

Im Französischen steht vor «;» ein geschütztes Leerzeichen U+00A0, wie in `messages/fr.json`.

Unverändert und weiter wahr (kein Szenario muss sich ändern):
- `update_notice_backup_needed`: durch die Änderung erst ganz wahr (V-10 aus `docs/reviews/update-feature-fachreview-1.md`); zitiert in `aktualisierung.feature:66`.
- `backend_update_backup_missing`, `update_step_download`/`_backup`/`_restart`, `update_step_status` («von 3»), `update_overlay_title`, `update_overlay_text`, `update_overlay_slow`, `update_failed`, `update_failed_log`.
- `update_failed_restore` («die Sicherung von vor dem Update», «Ihre Daten vom Beginn des Updates»): Jetzt gibt es diese Sicherung auch ohne Migration, das schliesst den offenen Punkt der Runde 2 zum Update. Bringt die neue Version eine Migration, ersetzt deren Sicherung die vom Beginn noch am selben Tag (`kept`, `backup.service.ts:76–92`, die jüngste pro Tag). Auch sie liegt vor jeder Änderung.
- Schritt «Herunterladen» in `aktualisierung.feature:50` bleibt erfüllt: Der Stand-in bleibt 2 s in `pulling`.

## docs/installation.md (Abschnitt 5)

- `:96`, «Update», den Satz «The new backend backs up the database before it changes it; when that backup fails or a new container does not start, the previous containers run again, and `docker logs dwello-updater` names the cause.» ersetzen durch: «Before the updater pulls anything, the backend makes a backup; when that backup fails, no update starts and nothing changes: Dwello tells the landlord, and `docker logs dwello-backend` names the cause. The new backend backs up the database once more before it changes it; when that backup fails or a new container does not start, the previous containers run again, and `docker logs dwello-updater` names the cause.»
- `:92`, «Sicherung (backup)»:
  - «and before every update that changes the database» ersetzen durch «before every update from the browser, and again before an update changes the database».
  - «When the backup before an update fails, the update stops without changing the database: the backend restarts, and the log names the cause.» ersetzen durch «When the backup before an update fails, no update starts and nothing changes: Dwello tells the landlord, and the log names the cause.»
  - «(at most two a day)» ersetzen durch «(at most two a day, two more on a day with an update)». Jede Sicherung eines Tages ersetzt die frühere desselben Tages.
  - `--max-delete=5` reicht für ein Update pro Tag. Erst ein zweites Update am selben Tag liesse den Spiegel anhalten, und er hält dann sicher an.

## Fehlende Begriffe (Vorschlag; Issue mit `domain`, `needs-decision`, sofern #1457 die Zeilen nicht entscheidet)

- **Update** (`UBIQUITOUS_LANGUAGE.md:297`): «… Schritte: Sichern, Herunterladen, Neu starten. Dwello sichert vor jedem Update; gelingt die Sicherung nicht, startet das Update nicht, und es ändert sich nichts. Schlägt es danach fehl, …» (Rest unverändert)
- **Sicherung** (`:290`): «… die Dwello jeden Tag und vor jedem Update im Ordner `backups` … anlegt. Dwello behält die jüngste jedes Tages der letzten 7 Tage und je eine pro Monat während 12 Monaten. …»

## Nicht bestätigt

- Wie lange `createBackup` auf einer echten Installation dauert, habe ich nicht gemessen. V-1 beruht auf der Grösse (Belege als Base64 in der Datenbank) und dem festen Limit von 30 s. Die Umgebung kann `BACKEND_API_TIMEOUT` setzen; in `compose.yaml` und `.env.example` habe ich nicht nachgesehen.
- Wo die Ursache landet, wenn die Sicherung des neuen Backends vor der Migration scheitert (`dwello-backend` oder `dwello-updater`): `installation.md:92` und `:96` sagen Verschiedenes. Ich habe das bestehende Wort übernommen und es nicht im Code verfolgt.

Geprüft:
- Datenschutzerklärung (`privacy_stored_backup`, `privacy_retention_backup` in de/fr/it/en): bleibt wahr. Gleicher Zweck (nennt schon «ein missglücktes Update»), gleicher Ort, keine neuen Empfänger, kein neues Land, höchstens 12 Monate (`kept`). «jeden Tag» schliesst eine weitere Sicherung nicht aus. Art. 19 Abs. 2 DSG (Stand 7. Juli 2025) verlangt «mindestens … a. die Identität und die Kontaktdaten des Verantwortlichen; b. den Bearbeitungszweck; c. gegebenenfalls die Empfängerinnen und Empfänger …»; davon ändert sich nichts.
- Mietrecht nicht betroffen.
