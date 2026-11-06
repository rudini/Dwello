# #675 Demo-Hinweis – Fach-Review 1 (vor der Umsetzung)

Gegenstand: `@wip`-Szenarien in b2e6d6b (`tests/e2e/features/demo.feature`), Plan und Texte in `w675-handback1.md`, Entscheide F1–F5 in #675.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte | Major | Die Demo legt Sicherungen an, die das nächtliche Zurücksetzen überleben (bis 12 Monate). «Probieren Sie alles aus» lädt dazu ein, «Jede Nacht werden alle Änderungen gelöscht» stimmt dann nicht mehr. |
| R-2 | Rechtstexte | Major | F3 braucht `OPERATOR_CONTACT`, aber die Demo startet auch ohne `OPERATOR_*`. Dann fehlt der Kontakt im Hinweis und der Verantwortliche in der Datenschutzerklärung (Art. 19 Abs. 2 lit. a DSG). |
| V-1 | Verwalter | Major | Kein Szenario prüft F3: Weder die Anmeldeseite noch die Hilfe muss den Kontakt des Betreibers zeigen. |
| V-2 | Verwalter | Minor | F1 zitiert «Jede Nacht wird alles gelöscht.». Das ist nicht der heutige Satz und stimmt auch nicht (die Beispieldaten werden neu geladen). Besser «Jede Nacht werden alle Änderungen gelöscht.» wie in `demo_notice_text`, `terms_demo_1` und `privacy_demo_1`. Der Step `SHARED_AND_RESET` bleibt grün. |
| V-3 | Rechtstexte | Minor | «Probieren Sie alles aus» schliesst auch einen eigenen API-Schlüssel unter «Einstellungen» › «KI» ein. Der Schlüssel bleibt gespeichert (`ki_settings_api_key_stored`) und wird bis zum Zurücksetzen für die Rechnungen aller Besucher genutzt, also mit Kosten und Daten auf dem Konto dieses Besuchers. Behebung: Satz `demo_notice_key`. |
| V-4 | Rechtstexte | Minor | Beim Hochladen von Rechnungen warnt die Demo nicht (nur bei Mieterdokumenten: `tenants_document_demo`). Wer die KI ausprobiert, lädt schnell eine echte Rechnung hoch. Behebung: zweiter Satz in `demo_notice_try`. |
| V-5 | Verwalter | Minor | F4 (die Zeile auf `/help`, `/privacy` und `/terms` ohne Sitzung) steht in keinem Szenario, Szenario 2 deckt nur die Übersicht ab. Behebung: Szenariogrundriss über die drei Seiten oder Verweis auf den DOM-Test «warnt auch auf %s». |

## R-1 Sicherungen überleben das Zurücksetzen

- Belege:
  - `docker-compose.prod.yml:101` setzt `BACKUP_DIR=/backups` mit dem Host-Ordner `./backups`. `deploy/demo/docker-compose.yml` überschreibt das nicht.
  - `deploy/demo/reset-demo.sh` legt nur die Datenbank neu an (`e2e-db.ts`, `demo-data.ts`); `./backups` bleibt.
  - `backend/src/services/backup.service.ts:264-280` erstellt ab einem bestätigten Wiederherstellungscode alle 15 Minuten eine fällige Sicherung. Die Aufbewahrung `kept()` behält 7 tägliche und 12 monatliche Sicherungen. Laut `UBIQUITOUS_LANGUAGE.md:268` enthalten sie auch Belege und Dokumente.
  - Jeder Besucher kann «Sicherung einrichten» (`/config/backup`) aufrufen.
- Warum falsch:
  - Wenn ein Besucher einen Code bestätigt, bleiben die Daten aller Besucher bis zum Zurücksetzen auf dem Server. Diese Daten sind verschlüsselt, aber bis zu 12 Monate gespeichert.
  - `privacy_demo_1` und `terms_demo_1` versprechen trotzdem «jede Nacht werden alle Änderungen gelöscht».
  - DSG Art. 6 Abs. 2 und 4 (Stand 7. Juli 2025): «Die Bearbeitung muss nach Treu und Glauben erfolgen und verhältnismässig sein.» und «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.»
  - Der Fehler zeigt sich schon auf dem Basis-Commit. Der neue Satz «Probieren Sie alles aus» macht ihn aber sichtbarer.
- Behebung (eine Zeile, keine Textänderung): In `deploy/demo/docker-compose.yml` beim `backend` `environment: - BACKUP_DIR=` setzen. `startBackups` und `backupBeforeMigration` kehren bei leerem `dir` zurück, und `backupState` kennt den Zustand `off` (Z. 231). Wenn das nicht in #675 passt: ein eigenes Issue (`nfr:security`). Bis dahin braucht der Hinweis einen Ausnahmesatz.

## R-2 Kontakt des Betreibers in der Demo nicht erzwungen

- Belege:
  - In `deploy/demo/.env.example:21-23` sind `OPERATOR_NAME`, `OPERATOR_ADDRESS` und `OPERATOR_CONTACT` leer.
  - `src/lib/server/operator.ts:6` gibt ohne Namen `null` zurück. Nichts verweigert den Start, anders als bei `POSTGRES_PASSWORD:?`.
- Warum falsch:
  - Ohne diese Werte zeigt `demo_notice_own` keinen Kontakt, und /terms zeigt auch keinen. F3 läuft dann ins Leere.
  - Die Datenschutzerklärung der Demo sagt «In der Demo ist der Betreiber für alle Daten verantwortlich», nennt ihn aber nicht.
  - DSG Art. 19 Abs. 2 (Stand 7. Juli 2025): «er teilt ihr mindestens mit: a. die Identität und die Kontaktdaten des Verantwortlichen».
- Behebung:
  - In `deploy/demo/docker-compose.yml` beim `frontend` `- OPERATOR_NAME=${OPERATOR_NAME:?set OPERATOR_NAME in deploy/demo/.env}` und `- OPERATOR_CONTACT=${OPERATOR_CONTACT:?…}` setzen.
  - Den Text `demo_notice_own` mit `{contact}` aus `loadOperator()` füllen. Die Hilfe und die Anmeldeseite laden ihn dazu wie `/terms`.
  - Ohne Kontakt (Dev) den Satz weglassen, statt einen Platzhalter zu zeigen.

## V-1 F3 nicht im Szenario

- Beleg: `demo.feature` (b2e6d6b). Szenario 1 und Szenario 4 prüfen nur «eigene Installation».
- Behebung: in beiden einen Step ergänzen, etwa `Und nennt der Demo-Hinweis für eine eigene Installation den Kontakt "betrieb@muster-hosting.ch"`. Der Wert ist `OPERATOR_CONTACT` aus `playwright.config.ts:66`, und die Demo-Instanz erbt `frontendEnv`.

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| demo_line_text | Öffentliche Demo: Alle Besucher sehen und ändern dieselben Daten. Jede Nacht werden alle Änderungen gelöscht. | Démo publique : tous les visiteurs voient et modifient les mêmes données. Chaque nuit, toutes les modifications sont supprimées. | Demo pubblica: tutti i visitatori vedono e modificano gli stessi dati. Ogni notte tutte le modifiche vengono cancellate. | Public demo: all visitors see and change the same data. Every night, all changes are deleted. |
| demo_line_link | Mehr zur Demo | En savoir plus sur la démo | Maggiori informazioni sulla demo | More about the demo |
| demo_notice_try | Probieren Sie alles aus, auch Löschen, Nebenkostenabrechnungen erstellen und «Als versendet markieren»: Am nächsten Morgen sind die Beispieldaten wieder da. Laden Sie nur erfundene Rechnungen und Dokumente hoch. | Essayez tout, y compris supprimer, créer des décomptes des charges et « Marquer comme envoyé » : le lendemain matin, les données d’exemple sont de retour. Ne téléversez que des factures et des documents fictifs. | Provi pure tutto, anche eliminare, creare conteggi spese accessorie e «Segnare come inviato»: il mattino dopo i dati di esempio sono di nuovo lì. Carichi solo fatture e documenti fittizi. | Try everything, including deleting, creating utility cost statements and «Mark as sent»: the next morning the sample data is back. Upload only made-up invoices and documents. |
| demo_notice_key | Geben Sie unter «Einstellungen» › «KI» keinen eigenen API-Schlüssel ein: Alle Besucher würden ihn nutzen. | Ne saisissez pas votre propre clé API sous « Paramètres » › « IA » : tous les visiteurs l’utiliseraient. | Non inserisca una Sua chiave API in «Impostazioni» › «IA»: tutti i visitatori la userebbero. | Do not enter your own API key under «Settings» › «AI»: every visitor would use it. |
| demo_notice_own | Für Ihre echten Daten brauchen Sie eine eigene Installation von Dwello. Fragen Sie dafür den Betreiber dieser Demo: {contact}. | Pour vos vraies données, il vous faut votre propre installation de Dwello. Adressez-vous pour cela à l’exploitant de cette démo : {contact}. | Per i Suoi dati reali Le serve una propria installazione di Dwello. Si rivolga a tal fine al gestore di questa demo: {contact}. | For your real data you need your own installation of Dwello. Ask the operator of this demo: {contact}. |

Zeichen und Begriffe:
- Im fr steht vor «:» und innerhalb von « » ein U+00A0.
- «Betreiber», «exploitant», «gestore» und «operator» stammen aus `i18n-begriffe.md:135` und `UBIQUITOUS_LANGUAGE.md:260`. «Die Person, die Dwello betreut» gilt nur für die Texte der Sicherung.
- Falls R-1 nicht in #675 behoben wird, kommt dieser Satz dazu:

| key | de | fr | it | en |
|---|---|---|---|---|
| demo_notice_backup | Richten Sie keine Sicherung ein: Sicherungen bleiben bis zu 12 Monate auf dem Server, auch nach dem nächtlichen Zurücksetzen. | Ne configurez pas de sauvegarde : les sauvegardes restent jusqu’à 12 mois sur le serveur, même après la réinitialisation nocturne. | Non configuri una copia di sicurezza: le copie di sicurezza restano sul server fino a 12 mesi, anche dopo il ripristino notturno. | Do not set up a backup: backups stay on the server for up to 12 months, even after the nightly reset. |

Geprüft:
- «Als versendet markieren» und das Erstellen von Abrechnungen schaden in der Demo nicht. Die Demo-`.env` setzt kein `MAIL_TRANSPORT` (`docker-compose.prod.yml:112`), also geht keine E-Mail hinaus. Die Beispieldaten haben Abrechnungen.
- Hochgeladene Dateien (Belege, Dokumente) liegen als Base64 in der Datenbank (`schema.ts:351`) und werden mit ihr zurückgesetzt.
- Die KI läuft lokal (Ollama), solange kein Besucher einen Anbieter einträgt. Die Datenschutzerklärung nennt den Empfänger dynamisch.
- F1 und F2 sowie F4 und F5 sind im Plan richtig umgesetzt.
- Ein `demo_notice_text` ohne Änderung genügt dem Hinweis «andere sehen, was man eingibt» («Alle Besucher sehen und ändern dieselben Daten»).

## Nicht bestätigt

- Was `/config/backup` und die Datenschutzerklärung im Zustand `off` (leeres `BACKUP_DIR`) in der Demo zeigen: nicht gelesen (`backup.service.ts:231`, `src/routes/config/backup/+page.server.ts`).
- Ob der Betreiber der echten Demo `MAIL_TRANSPORT` gesetzt hat: Ich kenne nur `.env.example`. Sonst würde «Per E-Mail senden» echte E-Mails an eingegebene Adressen schicken.
- Ob das Zurücksetzen jede Nacht gelingt: Laut README §6 muss man es von Hand neu starten, wenn es scheitert. «Am nächsten Morgen» setzt einen Erfolg voraus.
