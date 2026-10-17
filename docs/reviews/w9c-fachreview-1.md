# Fachreview W9c-1: Datenschutzerklärung (#82) und Dokumente ehemaliger Mieter (#178)

Gegenstand: Commit `abb842c` (Worktree `review-w9c-fach`): `@wip`-Szenarien in `privacy.feature`, `authentication.feature`, `sprachen.feature`, `demo.feature`, dazu die im Auftrag genannten geplanten deutschen Texte und die Regel für #178. Geprüft gegen `UBIQUITOUS_LANGUAGE.md`, den Code im Worktree, Fedlex (DSG Stand 1.9.2023, DSV Stand 15.9.2024, OR Stand 1.1.2025, FMG Stand 1.6.2026) und, soweit erreichbar, die Seiten der Anbieter.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte | Major | «Verantwortlich ist der Betreiber» stimmt nur, wenn der Vermieter Dwello selbst betreibt; bei einem Anbieter ist dieser für Mieterdaten Auftragsbearbeiter, Auskunft geben müsste der Vermieter. Widerspricht `terms_responsibility_2`. **Weicht von der Entscheidung in #82 ab: Produktentscheid nötig** |
| R-2 | Rechtstexte | Major | «bleiben gespeichert, bis Sie sie in Dwello löschen» ist falsch: versendete Abrechnungen, Mahnungen, Mieter mit Mietvertrag und Mietverträge mit Abrechnung lassen sich nie löschen |
| R-3 | Rechtstexte | Major | Art. 958f OR gilt nur für Buchführungspflichtige (Art. 957 OR). Das pauschale «müssen 10 Jahre aufbewahrt werden» ist für einen privaten Vermieter irreführend; die Frist beginnt erst mit dem Ende des Geschäftsjahres |
| R-4 | Rechtstexte | Major | «über den Mailserver des Betreibers»: Bei SMTP kann `SMTP_HOST` ein fremder Anbieter sein, auch im Ausland. Der Satz verschweigt dann einen Empfänger und das Land |
| R-5 | Rechtstexte | Major | Resend: Es fehlt die Grundlage der Bekanntgabe in die USA (Art. 19 Abs. 4 DSG). Ob Resend unter dem Swiss-U.S. DPF zertifiziert ist, ist nicht bestätigt |
| R-6 | Rechtstexte | Minor | «Dwello erhält Name und E-Mail-Adresse»: Mit dem Scope `profile` liefert Google auch das Profilbild, Microsoft Graph `/me` weitere Felder. Richtig wäre «übernimmt davon nur» |
| R-7 | Rechtstexte | Minor | Google Maps «(Google, wie unter «Anmeldung»)» läuft ins Leere, wenn nur Microsoft eingerichtet ist |
| R-8 | Rechtstexte | Minor | Das Protokoll enthält auch die Kontokennung (`sub`), und auch die Abmeldung wird protokolliert |
| R-9 | Rechtstexte | Minor | Antwort auf die Frage: Der Hinweis zum Ablehnen gehört hinein (Art. 45c Bst. b FMG). Er muss aber auch den Entwurf im `localStorage` und die Cookies der Anmeldung abdecken |
| R-10 | Rechtstexte | Minor | `privacy_draft_notice`: Ein Entwurf bleibt auch nach Ablauf der Sitzung im Browser, solange niemand sich abmeldet. Ein Hinweis zum Ablehnen fehlt |
| R-11 | Rechtstexte | Minor | Text ohne `OPERATOR_NAME` lässt den Leser ohne Kontakt (Art. 19 Abs. 2 Bst. a DSG) und ohne nächsten Schritt |
| R-12 | Rechtstexte | Minor | Das Land des Servers und der Datenbank wird nie genannt (Art. 19 Abs. 4 DSG). Bestand schon vorher |
| R-13 | Rechtstexte | Minor | «Dwello löscht keine Daten von selbst» widerspricht der Demo (jede Nacht zurückgesetzt) und dem Löschen der Entwürfe beim Abmelden |
| R-14 | Rechtstexte | Nit | Der Mail-Inhalt umfasst auch die Mahnung als PDF (Adresse, Betrag, IBAN des Vermieters) |
| R-15 | Rechtstexte | Nit | Link auf der Anmeldeseite: Die Datenschutzerklärung wird nicht «akzeptiert» |
| R-16 | Rechtstexte | Nit | Microsoft: Verantwortlich ist Microsoft Corporation (USA); Microsoft Ireland Operations Limited ist nur ihre Vertretung für EWR und Schweiz (nicht aus Primärquelle bestätigt) |
| R-17 | Rechtstexte | Nit | Die Gültigkeit aus `JWT_EXPIRY` kann auch in Stunden oder Minuten angegeben sein, nicht nur in Tagen |
| R-18 | Rechtstexte | Nit | FR `privacy_third_1`: Formulierung für Zahlungserinnerung und Mahnung |
| R-19 | Rechtstexte | Nit | Nutzungsbedingungen: «Liegenschaftsverwalter» ist bestätigt. In der Demo «Alle Besucher» und in der Datenschutzerklärung «Alle, die sich anmelden» angleichen |
| M-1 | Mietrecht | Major | #178: Der Hinweis fordert zum Löschen auf, sagt aber nicht, was zu behalten ist: Übergabeprotokolle für das Mietzinsdepot (Art. 257e Abs. 3 OR, ein Jahr), die Mängelrüge (Art. 267a OR) und die Einsicht des Nachmieters (Art. 256a OR) |
| V-1 | Verwalter | Major | #178: Die Aufgabe in der Übersicht lässt sich nicht erledigen, wenn der Vermieter ein Dokument zu Recht behält. Sie bleibt dann für immer stehen. **Produktentscheid nötig** |
| V-2 | Verwalter | Minor | #178: Einzahl bei `{count}` = 1, «vorher» präzisieren, Schweizer Tag aus UTC berechnen, bestehende Statusregel wiederverwenden |
| V-3 | Verwalter | Minor | Szenarien: Die neuen Abschnitte fehlen im Szenariogrundriss, der Fall ohne Betreiber hat kein Szenario, «No scenario» für #178 begründen |
| V-4 | Verwalter | Nit | Szenario-Wortlaut (Anmeldung über «überfällige Abrechnungen»; Wortlaut «Belege») |

---

## Befunde

### R-1 (Major): Der Betreiber ist nicht immer der Verantwortliche

**Beleg.** Geplanter Text: «Verantwortlich für die Bearbeitung der Daten in dieser Dwello-Installation ist ihr Betreiber … Jede Person …, auch jeder Mieter, kann beim Betreiber Auskunft … verlangen (Art. 25 DSG).» Dazu der geplante Text «Betreiber ist … ein Anbieter, der Dwello für Sie betreibt.»

Art. 5 DSG (Fedlex, Stand 1.9.2023): «j. Verantwortlicher: private Person oder Bundesorgan, die oder das allein oder zusammen mit anderen über den Zweck und die Mittel der Bearbeitung entscheidet; k. Auftragsbearbeiter: private Person oder Bundesorgan, die oder das im Auftrag des Verantwortlichen Personendaten bearbeitet.»

Art. 25 Abs. 1 DSG: «Jede Person kann vom Verantwortlichen Auskunft darüber verlangen, ob Personendaten über sie bearbeitet werden.» Abs. 4: «Lässt der Verantwortliche Personendaten von einem Auftragsbearbeiter bearbeiten, so bleibt er auskunftspflichtig.»

`messages/de.json:164` (`terms_responsibility_2`, geplant: «Der Liegenschaftsverwalter ist dafür verantwortlich, die Mieter über die Bearbeitung ihrer Daten zu informieren.»). Diese Informationspflicht trifft nach Art. 19 Abs. 1 DSG den Verantwortlichen.

**Warum falsch.** Über Zweck und Mittel der Bearbeitung von Mieterdaten (Mietverträge, Abrechnungen, Ausweiskopien) entscheidet der Vermieter. Betreibt ein Anbieter Dwello für ihn, bearbeitet dieser die Daten in seinem Auftrag (Art. 9 DSG) und ist Auftragsbearbeiter. Auskunftspflichtig bleibt dann der Vermieter (Art. 25 Abs. 4). Der geplante Satz schickt Mieter zum falschen Ansprechpartner. Er widerspricht ausserdem den Nutzungsbedingungen, die den Liegenschaftsverwalter zur Information verpflichten. Nur wenn der Vermieter Dwello selbst betreibt (und in der Demo), sind Betreiber und Verantwortlicher dieselbe Person. Für die eigenen Anmeldedaten des Liegenschaftsverwalters (Protokoll, Cookies, Wahl der Anmeldeanbieter) ist der Betreiber verantwortlich.

**Lösung (Produktentscheid, widerspricht #82 «controller = operator»).** Die Verantwortung aufteilen:

> «Für die Daten, die Sie in Dwello erfassen, auch die Ihrer Mieter, sind Sie als Vermieter verantwortlich. Dwello wird von {name, address} betrieben (Kontakt: {contact}). Betreibt ein Anbieter Dwello für Sie, bearbeitet er diese Daten nur in Ihrem Auftrag. Für die Anmeldung, das Protokoll des Servers und die Cookies ist der Betreiber verantwortlich.»
>
> «Ihre Mieter können bei Ihnen Auskunft verlangen, ob und welche Daten über sie bearbeitet werden; Sie selbst beim Betreiber. Die Auskunft ist kostenlos (Art. 25 DSG).»

Belegt durch Art. 25 Abs. 6 DSG: «Der Verantwortliche muss kostenlos Auskunft erteilen.»

Das Szenario «Auskunft über die eigenen Daten» (privacy.feature, neu) ist entsprechend anzupassen: «… dass Mieter beim Liegenschaftsverwalter Auskunft über ihre Daten verlangen können».

Nit dazu: «über die Dwello Daten bearbeitet» stimmt rechtlich nicht, denn eine Software bearbeitet nicht. Besser: «über die in Dwello Daten bearbeitet werden».

### R-2 (Major): Nicht alles lässt sich in Dwello löschen

**Beleg.**
- `backend/src/services/statement.service.ts:538` löscht nur Entwürfe: «Only a draft may be deleted; once sent, the statement stays».
- `backend/src/services/tenant.service.ts:284-296` weist das Löschen jedes Mieters mit Mietvertrag ab.
- `backend/src/services/contract.service.ts:413-414` weist das Löschen jedes Mietvertrags mit Abrechnung ab (`CONTRACT_HAS_STATEMENTS`).
- Mahnungen (`documents.type` ≠ `upload`) gehören zu einem solchen Mieter.

Geplanter Text: «Sie bleiben gespeichert, bis Sie sie in Dwello löschen.»

**Warum falsch.** Die Erklärung muss beschreiben, was die App tut. Name, Kontaktdaten, Abrechnungen und Mahnungen jedes Mieters mit Abrechnung bleiben aber für immer gespeichert, und der Vermieter kann daran nichts ändern. Art. 6 Abs. 4 DSG (zitiert in #178): «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.» Nach Ablauf der Aufbewahrungsfrist gibt es in Dwello keinen Weg dazu.

**Lösung.** Text:

> «Dwello löscht keine Daten von selbst. Was Sie erfassen, bleibt gespeichert, bis Sie es löschen. Versendete Abrechnungen und Mahnungen lassen sich nicht löschen, ebenso Mieter und Mietverträge, zu denen es Abrechnungen gibt.»

Ausserdem ein neues Issue (Labels `fachlich`, `entscheiden`): «Daten ehemaliger Mieter nach Ablauf der Aufbewahrungsfrist löschen oder anonymisieren (Art. 6 Abs. 4 DSG)».

### R-3 (Major): Die 10-Jahres-Pflicht trifft nur Buchführungspflichtige

**Beleg.**
- Art. 957 Abs. 1 OR (Fedlex, Stand 1.1.2025): «Der Pflicht zur Buchführung und Rechnungslegung gemäss den nachfolgenden Bestimmungen unterliegen: 1. Einzelunternehmen und Personengesellschaften, die einen Umsatzerlös von mindestens 500 000 Franken im letzten Geschäftsjahr erzielt haben; 2. juristische Personen.» Abs. 2 nennt die vereinfachte Buchführung für kleinere Einzelunternehmen.
- Art. 958f Abs. 1 OR: «Die Geschäftsbücher und die Buchungsbelege sowie der Geschäftsbericht und der Revisionsbericht sind während zehn Jahren aufzubewahren. Die Aufbewahrungsfrist beginnt mit dem Ablauf des Geschäftsjahres.»

**Warum falsch.** Die Zielgruppe sind private Vermieter, also natürliche Personen, die ihr eigenes Vermögen verwalten und meist kein Unternehmen führen. Für sie gilt Art. 958f OR nicht. «müssen» behauptet eine Pflicht, die oft nicht besteht. Zudem läuft die Frist ab dem Ende des Geschäftsjahres, nicht ab dem Datum des Belegs. Dass #82 Art. 958f nennt, ist entschieden. Hier geht es nur um die bedingte Formulierung.

**Lösung.**

> «Wer zur Buchführung verpflichtet ist, etwa eine Verwaltungsfirma, muss Geschäftsbücher und Buchungsbelege, etwa Rechnungen und Abrechnungen, 10 Jahre ab Ende des Geschäftsjahres aufbewahren (Art. 958f OR).»

Das Szenario «Wie lange Dwello Daten aufbewahrt» lautet dann: «… dass Dwello nichts von selbst löscht und wer zur Buchführung verpflichtet ist, Geschäftsbücher und Buchungsbelege 10 Jahre aufbewahrt».

### R-4 (Major): «Mailserver des Betreibers» stimmt nicht immer

**Beleg.** `backend/src/mail/smtp.ts:6-18`: Jeder Server unter `SMTP_HOST` ist möglich, auch Microsoft 365, Gmail oder Infomaniak. Szenario «E-Mails über den Mailserver des Betreibers» (privacy.feature, neu): `"Mailserver des Betreibers"`.

**Warum falsch.** Art. 19 Abs. 2 Bst. c DSG verlangt «gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern», Abs. 4 bei einer Bekanntgabe ins Ausland den Staat. Ein vom Betreiber eingerichteter SMTP-Anbieter ist ein Empfänger, möglicherweise im Ausland. «des Betreibers» suggeriert, dass die Daten beim Betreiber bleiben.

**Lösung.**

> «Zahlungserinnerungen und Mahnungen per E-Mail werden über den Mailserver zugestellt, den der Betreiber eingerichtet hat ({SMTP_HOST}). Gehört er einem Anbieter, erhält dieser Name und E-Mail-Adresse des Mieters sowie die Nachricht mit der Mahnung als PDF. Bei welchem Anbieter und in welchem Land der Mailserver steht, erfahren Sie beim Betreiber.»

Besser wäre eine optionale Konfiguration (z.B. `MAIL_PROVIDER_NAME`, `MAIL_PROVIDER_COUNTRY`) wie bei der KI. Das Szenario prüft dann «Mailserver, den der Betreiber eingerichtet hat».

### R-5 (Major, bis zur Prüfung): Resend ohne Grundlage der Bekanntgabe

**Beleg.**
- Art. 19 Abs. 4 DSG: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.»
- DSV Anhang 1 Ziff. 44 (Stand 15.9.2024): «Vereinigte Staaten*** Für Personendaten, die von Organisationen bearbeitet werden, die gemäss den Grundsätzen des Datenschutzrahmens zwischen der Schweiz und den USA zertifiziert sind».
- Geplant: «… die Daten gehen damit in die USA.» Ohne Grundlage, während der Google-Satz das DPF nennt.

**Warum falsch.** Ist Resend unter dem Swiss-U.S. DPF zertifiziert, gilt Art. 16 Abs. 1 DSG. Der Text sollte das dann wie bei Google sagen (Konsistenz). Ist Resend nicht zertifiziert, braucht es Garantien nach Art. 16 Abs. 2 (z.B. Standarddatenschutzklauseln, Bst. d), und diese müssen genannt werden. Eine Suche fand einen Eintrag «Resend» auf dataprivacyframework.gov (participant/8907). Ob der Swiss-U.S.-Teil aktiv ist und ob die Rechtsform «Resend, Inc.» stimmt, konnte ich nicht öffnen (Proxy blockiert resend.com und dataprivacyframework.gov).

**Lösung.** Vor der Umsetzung prüfen und dann einen der beiden Texte verwenden:

> «… werden über Resend (Resend, Inc., USA) zugestellt. Dabei erhält Resend Name und E-Mail-Adresse des Mieters sowie die Nachricht mit der Mahnung als PDF; die Daten gehen damit in die USA. Resend ist nach dem Swiss-U.S. Data Privacy Framework zertifiziert, das der Bundesrat als angemessenen Datenschutz anerkennt.»

Sonst statt des letzten Satzes: «Den Schutz der Daten sichern Standarddatenschutzklauseln, die der EDÖB anerkannt hat.»

### R-6 (Minor): «erhält» ist zu eng

**Beleg.**
- `src/lib/server/oauth.ts:47`: Scopes `openid email profile`.
- `:46`: Google `oauth2/v2/userinfo` liefert `picture`.
- `:193`: übernimmt `profile.picture`.
- `src/routes/auth/refresh/+server.ts:50`: kopiert `picture` in das neue JWT.
- `:59`: Microsoft Graph `/me` liefert auch Telefon, Funktion und Büro.

**Warum falsch.** Der Name kommt nur mit dem Scope `profile`, und mit ihm liefert Google immer auch die Adresse des Profilbilds. Dwello «erhält» das Bild also weiterhin, übernimmt es nach #82 aber nicht. #82 will, dass das Profilbild nicht erwähnt wird, also braucht es ein Verb, das trotzdem stimmt. Bei der Umsetzung muss `picture` auch aus dem JWT und aus `refresh` verschwinden.

**Lösung.**

> «Dwello übernimmt dabei vom angemeldeten Konto nur Name und E-Mail-Adresse und verwendet sie, um die Sitzung zu führen und den Namen in der Kopfzeile anzuzeigen. Passwörter sieht Dwello nie.»

### R-7 (Minor): Google Maps verweist auf einen Abschnitt, den es nicht immer gibt

**Beleg.** Geplant: «öffnet Google Maps (Google, wie unter «Anmeldung») …». Der Google-Absatz unter «Anmeldung» steht nur da, wenn Google eingerichtet ist. «Route planen» gibt es dagegen immer (`src/routes/buildings/BuildingCard.svelte:14`).

**Lösung.**

> ««Route planen» in der Gebäudeliste öffnet Google Maps (Google Ireland Limited, Irland, und Google LLC, USA) mit der Adresse des Gebäudes. Google erhält die Adresse und die IP-Adresse des Browsers erst, wenn Sie den Link wählen; die Daten können dabei in die USA gelangen.»

Dazu der Link. Den DPF-Satz kann man wiederholen oder in einen gemeinsamen Satz auslagern.

### R-8 (Minor): Was das Protokoll enthält

**Beleg.**
- `src/routes/auth/callback/+server.ts:48`: `login_complete` mit `userId: user.sub, email`.
- `src/routes/auth/refresh/+server.ts:59-62`: `userId`, `email`.
- `src/routes/auth/logout/+server.ts:41-44`: `userId`.

**Lösung.**

> «Jede Anmeldung, jede Verlängerung der Sitzung (etwa alle 50 Minuten, solange Dwello offen ist) und jede Abmeldung wird im Protokoll des Servers festgehalten, mit der Kennung des Kontos beim Anbieter und, ausser bei der Abmeldung, der E-Mail-Adresse.»

Zweck, Leser und Aufbewahrung wie geplant. Diese sind bestätigt: Die 50 Minuten stehen in `src/routes/+layout.svelte:48`.

### R-9 (Minor): Hinweis zum Ablehnen. Ja, aber vollständig

**Antwort auf die Frage.** Ja, der Hinweis gehört hinein.

Art. 45c FMG (Fedlex, Stand 1.6.2026): «Das Bearbeiten von Daten auf fremden Geräten durch fernmeldetechnische Übertragung ist nur erlaubt: a. für die Fernmeldedienste und ihre Abrechnung; oder b. wenn die Benutzerinnen und Benutzer über die Bearbeitung und ihren Zweck informiert und darauf hingewiesen werden, dass sie die Bearbeitung ablehnen können.»

Dwello ist kein Fernmeldedienst, Bst. a trägt also nicht. Ob technisch notwendige Cookies anders zu behandeln sind, ist **unsicher**, da Fedlex das nicht sagt. Der Hinweis kostet nichts.

**Warum der geplante Satz nicht reicht.** Art. 45c erfasst jede Speicherung auf dem Gerät, also auch den Entwurf im `localStorage` (`src/lib/wizard-draft.ts`). Ausserdem braucht die Anmeldung auch `dwello_oauth_state` und `dwello_login`, nicht nur `dwello_session` und `dwello_xsrf`.

**Lösung.**

> «Sie können Cookies und andere Websitedaten in den Einstellungen Ihres Browsers ablehnen oder löschen. Ohne die Cookies «dwello_session», «dwello_xsrf», «dwello_oauth_state» und «dwello_login» können Sie sich aber nicht anmelden.»

Das Szenario «Cookies im Browser ablehnen» ist so passend.

### R-10 (Minor): Hinweis auf den Entwurf im Browser

**Beleg.** `messages/de.json:152`. `clearAllDrafts` läuft nur beim Klick auf «Abmelden» (`src/lib/ui/Header.svelte:24`). Läuft die Sitzung ab (`JWT_EXPIRY`), bleibt der Entwurf. Bei gesperrten Websitedaten arbeitet der Assistent ohne Entwurf (`src/lib/wizard-draft.ts:6-12`).

**Warum.** «bis Sie … sich abmelden» klingt, als verschwinde der Entwurf spätestens mit dem Ende der Sitzung. Auf einem geteilten Computer stimmt das nicht. Dazu fehlt der Hinweis zum Ablehnen (R-9). Die Namen der Assistenten sind bestätigt: «Mietvertrag erfassen» und «Abrechnungen erstellen» sind die Knöpfe (`messages/de.json:201,203`).

**Lösung.**

> «Ungespeicherte Eingaben in «Mietvertrag erfassen» und «Abrechnungen erstellen» bewahrt Dwello als Entwurf in diesem Browser auf, bis Sie sie speichern, verwerfen oder sich mit «Abmelden» abmelden. Läuft die Anmeldung nur ab, bleibt der Entwurf. Ein Entwurf kann Namen und Beträge enthalten; er bleibt auf dem Gerät, auf dem Sie arbeiten. Lässt Ihr Browser keine Websitedaten zu, arbeitet Dwello ohne Entwurf.»

Mit diesem Wortlaut kann `TODO(fachlich prüfen, #82)` entfallen.

### R-11 (Minor): Ohne `OPERATOR_NAME`

**Beleg.** Geplant: «… Er hat seinen Namen und seine Adresse noch nicht hinterlegt.» Art. 19 Abs. 2 Bst. a DSG verlangt «die Identität und die Kontaktdaten des Verantwortlichen».

**Warum.** Der Satz beschreibt nur einen Mangel. Der Leser, der Dwello selbst betreibt, weiss nicht, dass er selbst gemeint ist und was er tun soll. Eine Fehlermeldung soll sagen, was zu tun ist (CLAUDE.md, Design-Regeln).

**Lösung.**

> «Der Betreiber dieser Installation hat seinen Namen und seine Adresse noch nicht hinterlegt. Betreiben Sie Dwello selbst, tragen Sie sie bei der Einrichtung ein (siehe Anleitung); sonst fragen Sie Ihren Anbieter danach.»

Fehlt nur `OPERATOR_CONTACT`, entfällt der Satz «Kontakt: …». Die Adresse genügt dann als Kontaktangabe.

### R-12 (Minor, bestand schon vorher): Land des Servers

**Beleg.** `messages/de.json:139`: «Die Daten liegen in der PostgreSQL-Datenbank des Betreibers dieser Dwello-Installation.» Ein Land wird nicht genannt. Art. 19 Abs. 4 DSG verlangt es, wenn der Server im Ausland steht, zum Beispiel bei einem Cloud-Anbieter. #82 verlangt Länder für die Dritten. Für den Speicherort, das Rechenzentrum eines Anbieters, verlangt es keine.

**Lösung.** Neues Issue (`fachlich`, `entscheiden`): optional `OPERATOR_SERVER_COUNTRY`, mit dem Text

> «Der Server steht in {country}.»

### R-13 (Minor): «löscht keine Daten von selbst»

**Beleg.** `privacy_demo_1` sagt: «jede Nacht werden alle Änderungen gelöscht». Dazu kommen `clearAllDrafts` beim Abmelden, das Ersetzen eines Belegs und das Ablaufen der Cookies.

**Lösung.**

> «Ausser in der Demo (siehe «Öffentliche Demo») löscht Dwello keine gespeicherten Daten von selbst.»

### R-14 (Nit): Inhalt der E-Mail

`backend/src/services/reminder.service.ts:103-107`: Die Mahnung wird als PDF angehängt, mit Adresse des Mieters, offenem Betrag, Name und IBAN des Vermieters. Statt «sowie der Inhalt der Nachricht»:

> «sowie die Nachricht mit der Mahnung als PDF (Adresse, offener Betrag)»

### R-15 (Nit): Link auf der Anmeldeseite

`messages/de.json:120`: «Mit der Anmeldung akzeptieren Sie die» passt zu den Nutzungsbedingungen, nicht zur Datenschutzerklärung. Die Information nach Art. 19 DSG ist keine Einwilligung. Vorschlag für einen eigenen Satz:

> «Wie Dwello Ihre Daten bearbeitet, steht in der Datenschutzerklärung.»

### R-16 (Nit): Microsoft

Laut Suchergebnissen aus den Microsoft-DPA-Texten ist «Microsoft Ireland Operations Limited … Microsoft's data protection representative for the European Economic Area and Switzerland». Verantwortlich ist Microsoft Corporation. Vorschlag:

> «Microsoft (Microsoft Corporation, USA; Vertretung für die Schweiz: Microsoft Ireland Operations Limited, Irland) erfährt …»

Dazu der DPF-Satz für Microsoft Corporation. Nicht aus Primärquelle bestätigt, siehe unten.

### R-17 (Nit): Gültigkeit der Cookies

Bestätigt ist: Beide Cookies erhalten `maxAge: jwtConfig.expirySeconds` (`src/lib/server/auth.ts:86,104`), und die Verlängerung setzt beide neu (`refresh/+server.ts:53-56`). `parseExpiry` erlaubt aber auch `s`, `m` und `h` (`jwt-config.ts:40-50`). Die Anzeige muss aus `expirySeconds` «12 Stunden» oder «30 Minuten» machen können, nicht nur Tage. Mit `7d` ergibt das «7 Tage». Bei ungültigem Wert fällt die App auf 7 Tage zurück, und die Anzeige stimmt dann ebenfalls, solange sie dieselbe Funktion nutzt.

### R-18 (Nit): FR «rappels»

Laut `docs/design/i18n-begriffe.md:68` ist Mahnung «rappel» und Zahlungserinnerung «rappel de paiement». Da «Mahnung» im Glossar alle Mahnstufen umfasst (`UBIQUITOUS_LANGUAGE.md:182-183`), ist «rappels» allein nicht falsch, nennt aber die erste Stufe nicht. Vorschlag FR:

> «Les rappels de paiement et les rappels envoyés par e-mail …»

### R-19 (Nit): Nutzungsbedingungen

«Liegenschaftsverwalter» statt «die Verwaltung» in `terms_purpose` und `terms_responsibility_2` ist bestätigt (Glossar Z. 27, Primärer Benutzer). FR entsprechend «le gérant d’immeubles» statt «la gérance».

Im Demo-Absatz der Nutzungsbedingungen «Alle Besucher sehen und ändern» an `privacy_demo_1` angleichen («Alle, die sich anmelden, sehen und ändern dieselben Daten»). Inhaltlich ist der Absatz bestätigt; er deckt sich mit `demo_notice_text`.

Art. 8 UWG ist nicht berührt, weil keine Klausel zu Haftung oder Leistung geändert wird.

### M-1 (Major): #178. Was der Vermieter noch braucht

**Beleg.**
- Art. 257e Abs. 3 OR: «… Hat der Vermieter innert einem Jahr nach Beendigung des Mietverhältnisses keinen Anspruch gegenüber dem Mieter rechtlich geltend gemacht, so kann dieser von der Bank die Rückerstattung der Sicherheit verlangen.»
- Art. 267a Abs. 1 OR: «Bei der Rückgabe muss der Vermieter den Zustand der Sache prüfen und Mängel, für die der Mieter einzustehen hat, diesem sofort melden.»
- Art. 256a Abs. 1 OR: «Ist bei Beendigung des vorangegangenen Mietverhältnisses ein Rückgabeprotokoll erstellt worden, so muss der Vermieter es dem neuen Mieter auf dessen Verlangen bei der Übergabe der Sache zur Einsicht vorlegen.»
- Geplanter Text: «Löschen Sie, was Sie nicht mehr brauchen, etwa Ausweiskopien und Betreibungsauszüge.»

**Warum.** Der Hinweis erscheint schon am Tag nach dem Vertragsende. Das Übergabeprotokoll vom Einzug liegt immer vor dem Vertragsende. Es ist das Beweismittel, um Mängel bei der Rückgabe dem Mieter zuzurechnen, und der Vermieter braucht es, solange um das Mietzinsdepot gestritten werden kann (mindestens ein Jahr). Ein Laie, der «Löschen Sie, was Sie nicht mehr brauchen» liest, löscht es womöglich, und das ist irreversibel. Die Beispiele Ausweiskopie und Betreibungsauszug sind richtig gewählt.

**Ausnahme des Endtags (Frage).** Ja, Dokumente, die am Tag des Vertragsendes oder später hochgeladen wurden, ausschliessen, wie geplant («vor dem Schweizer Tag des Vertragsendes»). Das Glossar definiert das Vertragsende als «Letzter Tag des Mietverhältnisses» (`UBIQUITOUS_LANGUAGE.md:37`). Das Rückgabeprotokoll entsteht an oder nach diesem Tag und muss für den Nachmieter bleiben (Art. 256a OR). Das reicht aber nicht, weil das Einzugsprotokoll trotzdem erfasst ist. Der Text muss deshalb sagen, was zu behalten ist.

**Lösung (Mieterseite).**

> «Der letzte Mietvertrag von {name} endete am {date}. Vor diesem Tag haben Sie diese Dokumente hochgeladen: {titles}. Löschen Sie, was Sie nicht mehr brauchen, etwa Ausweiskopien und Betreibungsauszüge. Behalten Sie Übergabeprotokolle, bis das Mietzinsdepot zurückgegeben ist.»

Für die Übersicht:

> «Der letzte Mietvertrag endete am {date}. {count} hochgeladene Dokumente stammen aus der Zeit davor. Löschen Sie, was Sie nicht mehr brauchen; behalten Sie Übergabeprotokolle, bis das Mietzinsdepot zurückgegeben ist.»

«Mietzinsdepot» fehlt im Glossar (siehe «Fehlende Begriffe»). Bis zum Entscheid trägt der Begriff `TODO(fachlich prüfen, #<issue>)`. Der Satz in der Datenschutzerklärung («… damit Sie löschen, was Sie nicht mehr brauchen.») ist bestätigt.

### V-1 (Major): #178. Die Aufgabe in der Übersicht endet nie

**Beleg.** Geplant: «eine Aufgabe je solchem Mieter», solange es hochgeladene Dokumente vor dem Vertragsende gibt. Einen Weg, ein Dokument als geprüft zu markieren, gibt es nicht. #178 entscheidet nur: «the tenant page and the overview name the uploaded documents … and offer to delete them».

**Warum.** Behält der Vermieter das Übergabeprotokoll zu Recht (M-1) oder einen Mietvertrag als Scan, steht «Dokumente von {name} prüfen» für immer in der Übersicht, für jeden ehemaligen Mieter. Bei 50 Wohnungen und einigen Jahren werden die Aufgaben zur Dauerliste. Die Übersicht verliert so ihren Wert als Liste dessen, was zu tun ist. Ein Vermieter, der die Aufgabe loswerden will, löscht womöglich Dokumente, die er braucht.

**Lösung (Produktentscheid; neues Issue `fachlich`, `entscheiden`).** Optionen:
- (a) Knopf «Geprüft» auf der Mieterseite. Die Aufgabe verschwindet, bis ein weiteres Dokument von vor dem Vertragsende auftaucht.
- (b) Die Aufgabe erscheint erst ein Jahr nach dem Vertragsende (Art. 257e Abs. 3 OR). Die Mieterseite zeigt den Hinweis sofort.
- (c) Nur die Mieterseite zeigt den Hinweis, ohne Aufgabe in der Übersicht. Das widerspricht #178.

Empfehlung: (a).

### V-2 (Minor): #178. Regel und Text im Detail

Nachgerechnet mit den Beispielen (heute 16.10.2026, Mietvertrag 1.4.2020–31.3.2026):

| Hochgeladen (Schweizer Zeit) | Ergebnis | Begründung |
|---|---|---|
| Betreibungsauszug 2.3.2020 | genannt | |
| Übergabeprotokoll 1.4.2020 | genannt | siehe M-1 |
| Rückgabeprotokoll 31.3.2026 | nicht genannt | Endtag |
| Scan 3.4.2026 | nicht genannt | |
| `created_at` 30.3.2026 23:30 UTC = 31.3.2026 01:30 Schweizer Zeit | nicht genannt | Die Umrechnung nach Europe/Zurich ist nötig, sonst wird es als 30.3. fälschlich genannt |
| Ende 16.10.2026 (heute) | nichts | Vertrag läuft noch; ab 17.10. wird er genannt |
| Zweiter Vertrag des Mieters läuft oder ist künftig | nichts | nicht ehemalig |
| Mahnung vom 2025 | nicht genannt | Typ ≠ `upload` |
| Zwei beendete Verträge (bis 31.3.2022 und bis 31.3.2026) | massgebend ist der 31.3.2026 | |

Die Regel ist so bestätigt. Sie entspricht dem Glossar «ehemalig, wenn alle seine Mietverträge beendet sind» (Z. 23) und der bestehenden Bedingung `inactive` (`backend/src/services/tenant.service.ts:47-51`). Diese sollte wiederverwendet werden statt eine zweite Definition zu schreiben.

Text:
- `{count}` = 1 braucht die Einzahl: «1 hochgeladenes Dokument stammt aus der Zeit davor.»
- «vorher» durch «Vor diesem Tag» ersetzen, wie in M-1. Das macht die Ausnahme des Endtags sichtbar.

### V-3 (Minor): Szenarien

- Der Szenariogrundriss «Auskunft zur Datenbearbeitung» (privacy.feature:11-19) nennt die neuen Abschnitte «Verantwortlich» und «Aufbewahrung» nicht.
- Für den Fall ohne `OPERATOR_NAME` (R-11) gibt es kein Szenario, auch keine tiefere Ebene.
- Die Fälle Resend und kein Mailversand brauchen mindestens einen Unit- oder DOM-Test.
- #178 «No scenario: needs a document uploaded before a past date»: Prüfen, ob das Seed des E2E-Stacks `created_at` und ein vergangenes Vertragsende setzen kann (Mietvertrag mit Ende gestern, Dokument mit `created_at` letztes Jahr). Der Hinweis ist sichtbares Verhalten.

### V-4 (Nit): Wortlaut der Szenarien

- `authentication.feature` (neu): «Angenommen ein Besucher hat die überfälligen Abrechnungen aufgerufen» übernimmt den bestehenden Schritt. Das ist fachlich unpassend, aber zulässig. Klarer wäre «Angenommen ein Besucher hat die Anmeldeseite geöffnet» (Schritt existiert in `sprachen.feature`).
- «Geschäftsbücher und Belege»: Das Gesetz sagt «Buchungsbelege», und «Beleg» ist im Glossar die hochgeladene Rechnungsdatei (Z. 73). Im Szenario also «Buchungsbelege».
- Schweizer Schreibweise, kein «ß», Sie-Form: bestätigt. Glossarbegriffe Liegenschaftsverwalter, Mieter, Mietvertrag, Mahnung, Zahlungserinnerung, Dokument: bestätigt.

---

## Bestätigt (mit Quelle)

- Google ohne `access_type=offline` / `prompt=consent`: Heute stehen beide Parameter noch in `src/lib/server/oauth.ts:114-115`. Das Szenario beschreibt das Ziel richtig.
- Sitzung wird etwa alle 50 Minuten verlängert (`src/routes/+layout.svelte:48`). Die Anmeldung wird mit E-Mail-Adresse protokolliert (R-8).
- Cookie-Lebensdauer aus `JWT_EXPIRY` mit 7 Tagen als Vorgabe (`jwt-config.ts:59`, `auth.ts:86,104`).
- OpenPLZ wird direkt aus dem Browser abgefragt (`src/lib/services/openplz.ts:8`; nicht über den BFF weitergeleitet, `hooks.server.test.ts:27`). Betreiber laut Fusszeile der OpenPLZ-Seiten (Suchergebnis): «© 2025 STÜBER SYSTEMS GmbH». Gehostet bei STRATO in Deutschland (FAQ, Suchergebnis). Deutschland steht in DSV Anhang 1 Ziff. 1, eine Garantie ist also nicht nötig.
- Irland steht in DSV Anhang 1 Ziff. 21, die USA mit DPF-Zertifizierung in Ziff. 44. Der Satz «das der Bundesrat als angemessenen Datenschutz anerkennt» stimmt damit (DSV Art. 8 Abs. 1, Anhang 1).
- Art. 45c FMG (R-9), Art. 25 DSG (R-1), Art. 958f OR (R-3).
- Mail nur für Mahnungen (einziger Aufruf `reminder.service.ts:103`). Bei «kein Mailversand» lehnt das Backend mit `MailConfigError` ab (`backend/src/mail/index.ts:24`). Der geplante Satz «Dwello versendet keine E-Mails, weil …» stimmt.
- Ende des Mietvertrags und Status «ehemalig»: siehe V-2.

## Fehlende Begriffe (Issue mit Labels `fachlich`, `entscheiden`)

| Begriff | Vorschlag |
|---|---|
| **Betreiber** | Person oder Firma, die eine Dwello-Installation auf einem Server einrichtet und betreibt: der Liegenschaftsverwalter selbst oder ein Anbieter in seinem Auftrag. Name, Adresse und Kontakt aus `OPERATOR_NAME`, `OPERATOR_ADDRESS`, `OPERATOR_CONTACT`. Nicht zu verwechseln mit dem Verantwortlichen nach DSG für die Daten der Mieter (siehe R-1). |
| **Verantwortlicher (DSG)** | Wer über Zweck und Mittel der Bearbeitung von Personendaten entscheidet (Art. 5 Bst. j DSG). Für die Daten der Mieter der Vermieter; für die Anmeldung und das Protokoll des Servers der Betreiber. |
| **Mietzinsdepot** | Sicherheit in Geld, die der Mieter leistet und die der Vermieter bei einer Bank auf einem Sparkonto oder Depot auf den Namen des Mieters hinterlegt; bei Wohnräumen höchstens drei Monatszinse (Art. 257e OR). Wird bereits in `docs/anforderungen-vertragsende.md:137` verwendet. |
| **Protokoll des Servers** | Aufzeichnung des Servers über Anmeldungen, Verlängerungen der Sitzung, Abmeldungen und Fehler; nur der Betreiber liest es, er bestimmt die Aufbewahrung. (Schon in `privacy_login_1` und `privacy_demo_1` verwendet.) |
| **Ausweiskopie** | Kopie eines amtlichen Ausweises des Mieters, als hochgeladenes Dokument abgelegt. (Schon in `privacy_stored_1` verwendet; das Glossar nennt nur Übergabeprotokoll und Betreibungsauszug.) |

## Nicht bestätigt

- **Google:** Dass Google Ireland Limited für Nutzer in der Schweiz verantwortlich ist und Google LLC unter dem Swiss-U.S. DPF zertifiziert ist, belegen nur Drittseiten in Suchergebnissen. `policies.google.com` war gesperrt (Proxy 403, WebFetch ENOTFOUND). Ob der Link `https://policies.google.com/privacy` erreichbar ist, ist ebenfalls offen.
- **Microsoft:** Microsoft Corporation als Verantwortliche, Microsoft Ireland Operations Limited als Vertretung und die DPF-Zertifizierung stammen nur aus Suchergebnissen (Microsoft-DPA-PDFs Dritter). `privacy.microsoft.com` wurde nicht abgerufen.
- **Resend:** Rechtsform «Resend, Inc.», Sitz, Swiss-U.S.-DPF-Status (Eintrag participant/8907 nur als Suchtreffer) und der Link `https://resend.com/legal/privacy-policy`. resend.com und dataprivacyframework.gov sind gesperrt (Proxy 403). Ob eine gewählte EU-Senderegion etwas an der Bekanntgabe in die USA ändert, ist nicht geprüft. Laut einer Drittseite bleiben Konto- und Protokolldaten in den USA.
- **OpenPLZ:** Der Link `https://legal.stueber.de/privacy.php` (gesperrt) und die genaue Firmierung «STÜBER SYSTEMS GmbH» sind nur aus Fusszeilen-Snippets bekannt.
- **Fedlex-Fassungen:** Für das DSG ist im Cache nur die Fassung vom 1.9.2023 echt (die Dateien 20240301 bis 20260101 sind leere SPA-Hüllen), für die DSV die Fassung vom 15.9.2024. Ob es neuere Fassungen mit geändertem Wortlaut gibt, ist nicht geprüft.
- **Art. 45c Bst. a FMG:** Ob er technisch notwendige Cookies einer Web-App abdeckt, ist **unsicher**, da Fedlex keinen Wortlaut dazu liefert. Daher die Empfehlung, den Hinweis aufzunehmen.
- **Pflichten privater Vermieter:** Aufbewahrungspflichten nach Steuerrecht (z.B. DBG für Selbständigerwerbende) habe ich nicht geprüft. R-3 stützt sich nur auf Art. 957/958f OR.
- **Art. 8 UWG:** Ob der Liegenschaftsverwalter als Konsument gilt, nicht geprüft, da keine Klausel zu Haftung oder Leistung geändert wird.
- **Logs des Betreibers:** Ob ein Reverse-Proxy oder Container-Log zusätzlich IP-Adressen festhält, hängt von der Installation ab. Im Code von Dwello selbst werden keine IP-Adressen protokolliert (`grep` in `src/lib/server`, `src/routes/auth`).
