# Fachreview W9c-2: Datenschutzerklärung (#82) und Dokumente ehemaliger Mieter (#178), umgesetzte Texte

Gegenstand: Commit `16247b1` (Worktree `review-w9c-fach2`), Diff `e11a135..16247b1` über `messages/*`, `src/routes/{privacy,terms,login,tenants}`, `src/lib/overview.ts`, `src/lib/former-tenant-documents.ts`, `src/routes/dashboard/+page.server.ts` (Datenquelle der Aufgabe) und `tests/e2e/features`. Geprüft gegen den Bericht der Runde 1 (`docs/reviews/w9c-fachreview-1.md`), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, den Code und Fedlex: DSG DE (Cache, Stand 1.9.2023), DSG FR und IT (neu geladen, Stand 1.9.2023), OR FR und IT (neu geladen, Stand 1.1.2025).

R-1 und V-1 sind wie entschieden umgesetzt, mit Markern (#330, #331). Ich erhebe sie nicht neu: Die Umsetzung ist nicht schlechter als entschieden.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-5 | Rechtstexte | Major (bestand schon vorher) | Resend: «erfahren Sie beim Betreiber» erfüllt Art. 19 Abs. 4 DSG nicht. Die Garantie muss mitgeteilt werden, und der Betreiber ist nach #82 selbst der Verfasser dieser Erklärung |
| R-20 | Rechtstexte | Major | IT: «Responsabile del trattamento» bedeutet in der LPD den **Auftragsbearbeiter**. Der Verantwortliche heisst «titolare del trattamento» |
| R-21 | Rechtstexte | Minor | «übernimmt nur Name und E-Mail-Adresse» widerspricht dem Protokoll-Absatz: Auch die Kennung des Kontos (`sub`) wird übernommen und protokolliert |
| R-22 | Rechtstexte | Minor | «Versendete … Mahnungen lassen sich nicht löschen»: Keine Mahnung lässt sich löschen, auch eine noch nicht versendete nicht |
| R-23 | Rechtstexte | Nit | IT `privacy_retention_2` weicht vom Wortlaut von Art. 958f CO ab |
| R-24 | Rechtstexte | Nit | Cookies gelten auch ab der Anmeldung, nicht nur «ab der letzten Verlängerung» |
| R-25 | Rechtstexte | Nit | «Garantien nach Art. 16 DSG»: Garantien regelt nur Abs. 2 |
| R-26 | Rechtstexte | Nit | FR und EN: grosser Anfangsbuchstabe des Links mitten im Satz auf der Anmeldeseite |
| R-27 | Rechtstexte | Nit | IT: «cancellare» statt «eliminare» (i18n-begriffe Z. 94) |
| V-5 | Verwalter | Minor | Mieterseite: «diese Dokumente» auch bei einem einzigen Dokument |
| V-6 | Verwalter | Nit | Titel «Dokumente aus der Mietzeit prüfen» nennt auch Dokumente von vor dem Mietbeginn |
| V-7 | Verwalter | Nit | Mietzinsdepot wird «freigegeben», nicht «zurückgegeben» |
| V-8 | Verwalter | Nit | demo.feature: «alle Besucher» gegenüber dem Text «Alle, die sich anmelden» |

---

## Befunde

### R-5 (Major, bestand schon vorher): Resend ohne mitgeteilte Garantie

**Frage des Auftraggebers:** Genügt «Auf welche Garantien nach Art. 16 DSG sich diese Bekanntgabe stützt, erfahren Sie beim Betreiber.» den Anforderungen von Art. 19 Abs. 4 DSG? **Nein.**

**Beleg.**
- Art. 19 Abs. 4 DSG (Fedlex, Stand 1.9.2023): «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.»
- Art. 19 Abs. 1 DSG: «Der Verantwortliche informiert die betroffene Person angemessen über die Beschaffung von Personendaten …»
- `messages/de.json`, `privacy_mail_resend`. Nach #82 und `privacy_controller_1` ist der Betreiber der Verantwortliche.

**Warum falsch.** Das Gesetz verlangt, dass die Garantie *mitgeteilt* wird. Ein Verweis auf eine Stelle, bei der man nachfragen kann, ist keine Mitteilung. Hinzu kommt: Die Erklärung nennt den Betreiber selbst als Verantwortlichen. Der Verantwortliche verweist also auf sich selbst. Staat (USA) und Empfänger sind jetzt richtig genannt, es fehlt nur die Garantie.

Zur Einordnung: Die Fassung auf dem Basis-Commit nannte für Resend weder Land noch Garantie («eigener SMTP-Server oder Resend»). Die Lücke bestand also schon vorher und ist jetzt kleiner. Nach CLAUDE.md («existed before») darf sie deshalb unter «Blocked on me» bzw. in #333 offen bleiben, wenn sie nicht vor dem Merge geschlossen werden kann.

**Was ich gefunden habe.** Laut Suchtreffer zu `https://resend.com/legal/dpa` (Datum 31.12.2025, nicht geöffnet, Proxy 403) sagt Ziff. 6.5 des DPA von Resend: «The parties agree that transfers from Switzerland are made pursuant to the EU SCCs with the following modifications: 6.5.1. …». Dazu der Treffer zum Changelog von Resend (13.3.2025): «Resend is now certified under the EU-US Data Privacy Framework (DPF).» Eine Swiss-U.S.-Zertifizierung wird dort nicht erwähnt. Daraus folgt: Grundlage ist Art. 16 Abs. 2 Bst. d DSG («Standarddatenschutzklauseln, die der EDÖB vorgängig genehmigt, ausgestellt oder anerkannt hat»).

**Lösung.** Erst den DPA im Original prüfen (Ziff. 6.5). Bestätigt er den Treffer, den letzten Satz ersetzen:

> DE: «Die Bekanntgabe stützt sich auf die Standardvertragsklauseln der EU-Kommission mit den Anpassungen für die Schweiz, die Teil des Auftragsbearbeitungsvertrags von Resend sind (Art. 16 Abs. 2 Bst. d DSG).»
> FR: «La communication repose sur les clauses contractuelles types de la Commission européenne, avec les adaptations pour la Suisse, qui font partie du contrat de sous-traitance de Resend (art. 16, al. 2, let. d, LPD).»
> IT: «La comunicazione si basa sulle clausole contrattuali tipo della Commissione europea, con gli adeguamenti per la Svizzera, che fanno parte del contratto di trattamento dei dati di Resend (art. 16 cpv. 2 lett. d LPD).»
> EN: «The disclosure relies on the European Commission’s standard contractual clauses with the adjustments for Switzerland, which are part of Resend’s data processing addendum (Art. 16(2)(d) FADP).»

Dass der EDÖB die EU-Standardvertragsklauseln anerkannt hat (Stellungnahme vom 27.8.2021), ist **unsicher**: Es steht nicht auf Fedlex, und ich habe es nicht geprüft.

Lässt sich der DPA nicht bestätigen, gibt es zwei Wege:
- den Text belassen und den Punkt in #333 aufnehmen, als optionale Konfiguration `MAIL_TRANSFER_SAFEGUARD`;
- als bestehenden Major unter «Blocked on me» führen.

### R-20 (Major): Italienisch «Responsabile» bezeichnet den Auftragsbearbeiter

**Beleg.**
- LPD (IT, Fedlex, Stand 1.9.2023), Art. 5:
  - «j. titolare del trattamento: il privato o l’organo federale che, singolarmente o insieme ad altri, determina lo scopo e i mezzi del trattamento;»
  - «k. responsabile del trattamento: il privato o l’organo federale che tratta dati personali per conto del titolare del trattamento.»
- Art. 25 cpv. 1 LPD: «Chiunque può domandare al titolare del trattamento se dati personali che lo concernono sono oggetto di trattamento.»
- `messages/it.json`:
  - `privacy_controller_title`: «Responsabile»
  - `privacy_controller_1`: «Responsabile del trattamento dei dati in questa installazione di Dwello è il suo gestore: {operator}.»
  - `privacy_controller_none`: gleich.

**Warum falsch.** Im italienischen Text sagt die Erklärung damit, der Betreiber sei der Auftragsbearbeiter. Das ist das Gegenteil der deutschen Fassung und des Entscheids in #82. FR ist richtig: «responsable du traitement» = Art. 5 let. j LPD (FR, Fedlex), der Auftragsbearbeiter heisst dort «sous-traitant». EN «controller» ist richtig.

**Lösung (IT).**
- `privacy_controller_title`: «Titolare del trattamento»
- `privacy_controller_1`: «Titolare del trattamento dei dati in questa installazione di Dwello è il suo gestore: {operator}.»
- `privacy_controller_none`: «Titolare del trattamento dei dati in questa installazione di Dwello è il suo gestore. Non ha ancora indicato il suo nome e il suo indirizzo. …» (Rest unverändert)

Den Begriff in `docs/design/i18n-begriffe.md` aufnehmen: Verantwortlicher (DSG) | responsable du traitement | titolare del trattamento | controller.

### R-21 (Minor): Auch die Kennung des Kontos wird übernommen

**Beleg.**
- `src/lib/server/oauth.ts:186,194`: `sub: profile.id`
- `src/lib/server/auth.ts:15,40`: `sub` im JWT
- `src/routes/auth/callback/+server.ts:48`: `userId: user.sub` im Protokoll
- `privacy_login_1`: «übernimmt dabei vom angemeldeten Konto nur Name und E-Mail-Adresse»
- `privacy_login_log`: «mit der Kennung des Kontos beim Anbieter»

**Warum falsch.** Das Wort «nur» schliesst die Kennung aus, die der nächste Absatz nennt. Der Leser findet einen Widerspruch auf derselben Seite. Das Profilbild wird korrekt nicht mehr übernommen: `picture` kommt in `src/lib/server` und `src/routes/auth` nicht mehr vor.

**Lösung.**
> DE: «Dwello übernimmt dabei vom angemeldeten Konto nur Name, E-Mail-Adresse und die Kennung des Kontos beim Anbieter und verwendet sie, um die Sitzung zu führen und den Namen in der Kopfzeile anzuzeigen.»
> FR: «… ne reprend du compte connecté que le nom, l’adresse e-mail et l’identifiant du compte auprès du fournisseur et les utilise …»
> IT: «… riprende dall’account solo nome, indirizzo e-mail e l’identificativo dell’account presso il fornitore e li usa …»
> EN: «… takes over only the name, email address and the account’s identifier at the provider and uses them …»

### R-22 (Minor): Keine Mahnung lässt sich löschen

**Beleg.**
- `backend/src/services/document.service.ts:122-129`: Löscht nur `type = 'upload'`, sonst `DOCUMENT_NOT_DELETABLE` («Payment reminders cannot be deleted»). Das gilt auch für eine Mahnung im Status «Zu versenden».
- `privacy_retention_1`: «Versendete Abrechnungen und Mahnungen lassen sich nicht löschen».

**Warum falsch.** Ein Leser versteht, eine noch nicht versendete Mahnung lasse sich löschen. Das stimmt nicht.

Der Rest ist bestätigt:
- Abrechnungen lassen sich nur als Entwurf löschen (Runde 1).
- Mieter: `tenant.service.ts:282-295` weist jeden Mieter mit Mietvertrag ab. Ein Mietvertrag ohne Abrechnung lässt sich aber zuerst löschen, danach der Mieter. «Mieter …, zu denen es Abrechnungen gibt» stimmt im Ergebnis.

**Lösung.**
> DE: «Abrechnungen lassen sich nach dem Versand nicht mehr löschen, Mahnungen gar nicht, ebenso Mieter und Mietverträge, zu denen es Abrechnungen gibt.»
> FR: «Les décomptes ne peuvent plus être supprimés une fois envoyés, les rappels jamais, pas plus que les locataires et les contrats de bail pour lesquels il existe des décomptes.»
> IT: «I conteggi non possono più essere eliminati dopo l’invio, i solleciti mai, come pure gli inquilini e i contratti di locazione per cui esistono conteggi.»
> EN: «Statements can no longer be deleted once sent, reminders never, nor can tenants and rental contracts that have statements.»

### R-23 (Nit): IT Art. 958f CO

**Beleg.** Art. 958f cpv. 1 CO (IT, Fedlex, Stand 1.1.2025): «I libri di commercio, i documenti contabili, la relazione sulla gestione e la relazione di revisione sono conservati per dieci anni. Il termine di conservazione decorre dalla fine dell’esercizio.» Die App schreibt dagegen «i libri contabili e i documenti giustificativi».

**Lösung.** «… deve conservare i libri di commercio e i documenti contabili, per esempio fatture e conteggi, per 10 anni dalla fine dell’esercizio (art. 958f CO).»

FR ist bestätigt. Art. 958f al. 1 CO (FR): «Les livres et les pièces comptables … sont conservés pendant dix ans. Ce délai court à partir de la fin de l’exercice.»

### R-24 (Nit): Gültigkeit ab der Anmeldung

**Beleg.** `privacy_cookies_2`: «Beide gelten {lifetime} ab der letzten Verlängerung der Sitzung.» Beim ersten Mal gelten sie ab der Anmeldung (`auth.ts:86,104`).

**Lösung.**
> DE: «… ab der Anmeldung oder der letzten Verlängerung der Sitzung.»
> FR: «… à compter de la connexion ou de la dernière prolongation de la session.»
> IT: «… dall’accesso o dall’ultimo prolungamento della sessione.»
> EN: «… from sign-in or the last extension of the session.»

Die Anzeige habe ich nachgerechnet (Intl, Node): 604800 s ergibt «7 Tage | 7 jours | 7 giorni | 7 days», 86400 s «1 Tag», 43200 s «12 Stunden», 5400 s «90 Minuten», 1800 s «30 Minuten». Bestätigt.

### R-25 (Nit): «Garantien nach Art. 16 DSG»

Art. 16 Abs. 1 DSG regelt die Angemessenheit, Abs. 2 die Garantien («Liegt kein Entscheid des Bundesrates nach Absatz 1 vor, so dürfen … wenn ein geeigneter Datenschutz gewährleistet wird durch: …»). Bleibt der Satz (siehe R-5), dann «nach Art. 16 Abs. 2 DSG» (FR «art. 16, al. 2, LPD», IT «art. 16 cpv. 2 LPD», EN «Art. 16(2) FADP»).

### R-26 (Nit): Grossbuchstabe mitten im Satz

`src/routes/login/+page.svelte:55-60` setzt `privacy_record` als Linktext hinter `login_privacy_before`:
- EN: «… is set out in the Privacy notice.»
- FR: «… figure dans la Déclaration de protection des données.»

DE und IT sind korrekt. Für IT ist der Doppelpunkt, für DE das Substantiv richtig. Wenn gewünscht, einen eigenen Schlüssel für den Linktext in Kleinschreibung anlegen (EN «privacy notice», FR «déclaration de protection des données»). Sonst so belassen.

### R-27 (Nit): IT «cancellare»

Laut `docs/design/i18n-begriffe.md:94` heisst «löschen» auf Italienisch «eliminare». `privacy_retention_1` («non cancella … finché non lo cancella … non possono essere cancellati») und `privacy_retention_3` («affinché Lei cancelli») weichen davon ab. `tenants_former_documents_text` verwendet richtig «Elimini». Vorschlag: «eliminare» in beiden Schlüsseln (bei R-22 schon berücksichtigt).

### V-5 (Minor): Mieterseite bei einem einzigen Dokument

**Beleg.** `tenants_former_documents_text`: «Vor diesem Tag haben Sie diese Dokumente hochgeladen: {titles}.» Bei einem Dokument steht dort: «… diese Dokumente hochgeladen: Betreibungsauszug.» Die Übersicht hat Einzahl und Mehrzahl (V-2 umgesetzt), die Mieterseite nicht.

**Lösung (ohne Zählform):**
> DE: «Vor diesem Tag haben Sie hochgeladen: {titles}.»
> FR: «Avant ce jour, vous avez téléversé : {titles}.» (mit geschütztem Leerzeichen vor dem Doppelpunkt)
> IT: «Prima di quel giorno ha caricato: {titles}.»
> EN: «Before that day you uploaded: {titles}.»

### V-6 (Nit): Titel auf der Mieterseite

«Dokumente aus der Mietzeit prüfen» passt nicht ganz. Genannt wird alles, was vor dem Vertragsende hochgeladen wurde, auch der Betreibungsauszug aus der Bewerbung vor dem Mietbeginn. Vorschlag:
- DE: «Hochgeladene Dokumente prüfen»
- FR: «Vérifier les documents téléversés»
- IT: «Verificare i documenti caricati»
- EN: «Check uploaded documents»

### V-7 (Nit): «zurückgegeben» oder «freigegeben»

Art. 257e Abs. 3 OR (FR: «La banque ne peut restituer les sûretés qu’avec l’accord des deux parties ou sur la base d’un commandement de payer non frappé d’opposition ou d’un jugement exécutoire»; IT: «La banca può devolvere la garanzia soltanto con il consenso di entrambe le parti …»): Die Bank gibt das Depot heraus. In der Praxis spricht man von der «Freigabe des Mietzinsdepots». Vorschlag, zusammen mit #334:
- DE: «… bis das Mietzinsdepot freigegeben ist.»
- FR: «… jusqu’à la libération de la garantie de loyer.»
- IT: «… finché il deposito di garanzia non è svincolato.»
- EN: «… until the rent deposit has been released.»

Inhaltlich ist der Satz bestätigt (M-1 umgesetzt).

### V-8 (Nit): Szenario-Wortlaut Demo

`tests/e2e/features/demo.feature` (neu): «dass alle Besucher dieselben Daten sehen». `terms_demo_1` sagt richtig «Alle, die sich anmelden» (R-19). Vorschlag: «dass alle, die sich anmelden, dieselben Daten sehen …».

---

## Bestätigt (mit Quelle)

- **R-2, R-3, R-4, R-6 bis R-19, M-1, V-2 und V-4** sind wie vorgeschlagen umgesetzt, Abweichungen siehe oben. Im Einzelnen:
  - R-4 ohne Hostname: Das ist sachgerecht, weil der Satz jetzt nichts behauptet, was nicht stimmt. Art. 19 Abs. 2 Bst. c verlangt nur «Kategorien von Empfängerinnen und Empfängern», das ist erfüllt. Land offen: #333.
  - R-15: eigener Satz auf der Anmeldeseite, ohne «akzeptieren».
  - `access_type=offline` und `prompt=consent` sind aus dem Code entfernt (`grep` in `src/lib/server`, `src/routes/auth`).
- **FR-Typografie:** In allen neuen und geänderten FR-Schlüsseln steht vor «:», «;» und innerhalb von «» ein geschütztes Leerzeichen (36 × U+00A0, kein normales Leerzeichen vor diesen Zeichen; maschinell geprüft).
- **Begriffe nach `i18n-begriffe.md`:**
  - Liegenschaftsverwalter: gérant d’immeubles / amministratore di immobili / property manager
  - Mietvertrag: contrat de bail / contratto di locazione / rental contract
  - Mahnung und Zahlungserinnerung: rappel / rappel de paiement, sollecito / promemoria di pagamento, reminder / payment reminder
  - hochladen: téléverser / caricare / upload
  - Übergabeprotokoll: procès-verbal de remise / verbale di consegna / handover report
  - Assistenten-Namen «Mietvertrag erfassen» und «Abrechnungen erstellen»; «Abmelden» = `header_logout` in allen vier Sprachen
- **FR LPD:** Art. 5 let. j LPD (FR, Fedlex): «responsable du traitement: la personne privée ou l’organe fédéral qui, seul ou conjointement avec d’autres, détermine les finalités et les moyens du traitement …». Art. 25 al. 6: «Le responsable du traitement fournit gratuitement les renseignements demandés.» Das deckt «gratuitement» in `privacy_controller_3`. Die Abkürzungen LPD (FR/IT), FADP (EN) und CO sind richtig.
- **#178, Regel nachgerechnet** (`src/lib/former-tenant-documents.ts`; Schweizer Tag mit Node geprüft). Mietvertrag 1.4.2020–31.3.2026:
  - `createdAt` 2026-03-30T23:30Z ergibt den Schweizer Tag 2026-03-31. Nicht kleiner als das Ende, also nicht genannt. Richtig: Endtag.
  - 2026-03-30T21:59Z ergibt 2026-03-30: genannt.
  - 2020-04-01T08:00Z (Übergabeprotokoll): genannt, mit dem Hinweis zum Behalten.
  - Heute = 31.3.2026: Der Vertrag zählt bis und mit dem Endtag als laufend (`contractStatusOn`), also kein Hinweis.
  - Ohne Mietvertrag: kein Hinweis.
  - Mit einem künftigen oder laufenden zweiten Vertrag: kein Hinweis.
  - Bei zwei beendeten Verträgen zählt das späteste Ende (String-Sortierung YYYY-MM-DD).
  - Nur `type = 'upload'`: Mahnungen werden nicht genannt.
  - Übersicht und Mieterseite nutzen dieselbe Funktion (`dashboard/+page.server.ts:106-118`). `documents` wird ohne Limit geladen (`document.service.ts`), die Verträge mit `limit=1000`: Bei unter 50 Wohnungen reicht das.
- **`privacy_retention_3`** beschreibt, was der Code tut (Mieterseite und Übersicht).
- **Ablehnen von Cookies** (Art. 45c Bst. b FMG): `privacy_cookies_5` und `privacy_draft_notice` decken jetzt Cookies und Entwurf ab.

## Fehlende Begriffe

Zum Glossar-Issue #334 ergänzen (Labels `fachlich`, `entscheiden`), sofern nicht schon drin:

| Begriff | Vorschlag |
|---|---|
| **Verantwortlicher (DSG)** in `i18n-begriffe.md` | DE Verantwortlicher, FR responsable du traitement, IT **titolare del trattamento**, EN controller (Art. 5 Bst. j DSG). Auftragsbearbeiter: FR sous-traitant, IT responsabile del trattamento, EN processor (Bst. k). Siehe R-20. |
| **Freigabe des Mietzinsdepots** | Herausgabe der Sicherheit durch die Bank mit Zustimmung beider Parteien, aufgrund eines rechtskräftigen Zahlungsbefehls oder Urteils, oder auf Verlangen des Mieters, wenn der Vermieter innert eines Jahres nach Ende des Mietverhältnisses keinen Anspruch geltend gemacht hat (Art. 257e Abs. 3 OR). Siehe V-7. |

## Nicht bestätigt

- **Resend:** Den DPA (`https://resend.com/legal/dpa`, Ziff. 6.5 «transfers from Switzerland … pursuant to the EU SCCs») kenne ich nur aus einem Suchtreffer von `mmx search`. resend.com ist gesperrt (Proxy 403 / ENOTFOUND). Eine Swiss-U.S.-DPF-Zertifizierung fand ich nicht. Der Changelog vom 13.3.2025 nennt nur das EU-U.S. DPF. Die Anerkennung der EU-Standardvertragsklauseln durch den EDÖB ist **unsicher**, weil sie nicht auf Fedlex steht.
- **Google / Microsoft:** Weiterhin nur aus Suchergebnissen (siehe Runde 1). Dazu gehören:
  - der Swiss-U.S.-DPF-Status von Google LLC und Microsoft Corporation;
  - die Rolle von Microsoft Ireland Operations Limited als Vertretung für die Schweiz;
  - die Erreichbarkeit von `policies.google.com/privacy`, `privacy.microsoft.com/privacystatement` und `legal.stueber.de/privacy.php`.
- **OpenPLZ:** Die Firmierung «STÜBER SYSTEMS GmbH, Deutschland» ist nur aus Suchtreffern bekannt (Runde 1).
- **Zeitzone von `created_at`:** Die Spalte ist `timestamp` ohne Zeitzone (`backend/src/db/schema*.ts`, `defaultNow()`). Die Umrechnung nach Europe/Zurich stimmt nur, wenn die Datenbank in UTC läuft und Drizzle den Wert als UTC ausgibt. Das habe ich nicht an einer laufenden Datenbank geprüft.
- **EN-Übersetzung des OR:** Für «accounting records and vouchers» (Art. 958f CO) gibt es keine amtliche englische Fassung. Ich habe sie nicht geprüft.
- **Art. 19 DSV (Ausnahmen von der kostenlosen Auskunft):** nicht geprüft. «kostenlos» entspricht der Regel von Art. 25 Abs. 6 DSG.
- **Szenarien für #178 und den Fall ohne Betreiber (V-3):** Ob «No scenario» begründet ist und ob tiefere Tests bestehen, habe ich nicht geprüft. Diese Pfade lagen ausserhalb des genannten Diffs.
