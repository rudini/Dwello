# Fachreview #435 «Daten eines Mieters exportieren», Runde 2

Gegenstand: Commit bd423e0e (Worktree `review-435-1`, detached, nur gelesen), Umsetzung nach Runde 1 (`docs/reviews/435-fachreview-1.md`). Geprüft: `backend/src/services/tenant-export.service.ts`, `backend/src/__tests__/tenant-export.pg.test.ts`, das Szenario `tests/e2e/features/tenants.feature:59-75` mit `tests/e2e/steps/tenant-export.steps.ts`, `TenantExportCard.svelte`, die BFF-Route `src/routes/tenants/[id]/export/+server.ts`, `messages/{de,fr,it,en}.json:607-609`, `docs/api-specification.md:72`. Zum Vergleich gelesen: `statement.service.ts`, `statement-pdf.service.ts`, `statement-send.service.ts`, `reminder.service.ts`, `db/schema.ts`, `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, Issue #435 (Entscheid F-12 vom 2026-10-19).

Bindend: Entscheid in #435 (2026-10-19): Mahnungsbriefe und E-Mail-Kopien der Abrechnungen als Dateien, Entwurf nur im JSON ohne PDF, keine Glossarzeile für «Daten exportieren».

## Status der Befunde aus Runde 1

| ID | Schwere (R1) | Status | Beleg |
|----|--------------|--------|-------|
| F-1 | Major | behoben | Szenario Z. 66-68 (Frist seit 10 Tagen abgelaufen, Zahlungserinnerung) und Z. 73-74. Der Schritt prüft die Abrechnungsnummer der Mahnung im JSON (`exportedReminderStatements`) und ihre Datei (`exportedReminderFiles`). |
| F-2 | Major | behoben | Szenario Z. 70-71 und 75: zweiter Mieter mit eigenem Dokument, geprüft auf Nachname und Titel in Daten und Dateinamen. Den stärkeren Fall deckt `tenant-export.pg.test.ts:56-76, 110-116` ab: Vormieter in derselben Wohnung mit eigener versendeter Abrechnung und eigenem Dokument. Geprüft sind Name, Abrechnungsnummer, Dokumenttitel und der Inhalt aller Dateien. Der Filter läuft über `tenant_id` (`tenant-export.service.ts:45, 73, 82`), nicht über Wohnung oder Gebäude. |
| F-3 | Major | behoben | `messages/*.json:609` übernimmt den vorgeschlagenen Text wörtlich in allen vier Sprachen. Er steht sichtbar am Knopf und ist mit `aria-describedby` verbunden (`TenantExportCard.svelte:13-22`). Rechtsgrundlage wie in Runde 1: Art. 22 DSV mit Art. 16 Abs. 5 und Art. 18 Abs. 1 DSV. |
| F-4 | Major | behoben | Reihenfolge: E-Mail-Kopie, sonst `pdfBlob`, sonst keine Datei (`tenant-export.service.ts:76, 89, 121`). Ein Entwurf bekommt `null`. Es gibt keinen Aufruf von `getStatementPdf`/`generateStatementPdf`. Die E-Mail-Kopie liegt nur unter `abrechnungen/` (`ofType('statement')` kommt nicht in `documents`). Tests: `pg.test.ts:118-141` (Entwurf ohne PDF, `utility_statements` unverändert) und `:143-167` (E-Mail-Kopie vor gespeicherter PDF, genau einmal). |
| F-5 | Minor | behoben (Code) | Das JSON hat keine früheren Adressen (`service:138-149`), die API-Spezifikation nennt keine. Nur der Vorschlagstext im Plan (`implementation_plan.md:136`) nennt sie noch, siehe F-21. |
| F-6 | Minor | behoben | Keine `id`, `tenantId`, `categoryId` und keine Kennung des Heizprofils im JSON. `replaces` ist die Abrechnungsnummer (`:115`), `agreedCategories` sind Namen (`:68`), die Mahnung verweist über die Abrechnungsnummer (`:153`). Base64 steht nur in `files`, nicht in `data`. |
| F-7 | Minor | behoben | Zusatzmiete, Referenzindex, `movedOut`, `noticeReceivedOn`, Akonto und Nebenkostenpauschale stehen nebeneinander, dazu Wohnungsnummer, Stockwerk, Fläche und Zimmer (`service:48-69`). |
| F-8 | Minor | behoben | `getStatement` liefert den berechneten Status `overdue` (`statement.service.ts:291-302`), der Export übernimmt ihn (`service:92`). Kein Test prüft `overdue` im Export (Nit, siehe F-20). |
| F-9 | Minor | behoben (Wortlaut) | Szenario Z. 73: «Name und Kontaktdaten». Der Schritt prüft nur den Namen (`steps:37`), siehe F-20. |
| F-10 | Minor | behoben | Die Hilfe nennt Art. 28 DSG und behauptet nicht, damit sei eine Auskunft nach Art. 25 erteilt. Der optionale Satz zu Art. 25 fehlt zu Recht, solange #458 offen ist. |
| F-11 | Minor | behoben | Ungültige Zeichen werden ersetzt (`service:16`), doppelte Namen bekommen einen Zähler (`:33`), die Endung kommt vom MIME-Typ (`:129`), das Datum steht vorne. Der ZIP-Name hat `filename*` (UTF-8) und einen ASCII-Ersatz (`+server.ts:29-37`). Tests: `pg.test.ts:169-190`. Das Datum im Namen ist UTC, nicht der Schweizer Tag: siehe F-17. |
| F-12 | Minor | entschieden und umgesetzt | PO-Entscheid vom 2026-10-19 in #435. Mahnungsbriefe liegen unter `dokumente/` (`service:152-161`), E-Mail-Kopien unter `abrechnungen/` (`:76, 89`). |
| F-13 | Nit | behoben | `Button` ohne `variant` ist `secondary` (`src/lib/ui/Button.svelte:11`). |
| F-14 | Nit | behoben | `status: 'to_send'` geht unverändert ins JSON (`service:158`), Test `pg.test.ts:150, 160`. |

Offene Punkte aus Runde 1: Entwürfe nur als Daten ist umgesetzt. Kein Eintrag im Protokoll: umgesetzt, der Export schreibt nichts. Ordner- und ZIP-Namen in der Sprache des Mieters: umgesetzt (`service:8-13, 27`, Test `:192-202`). Bei den Kategorienamen fehlt die Sprache des Mieters noch: F-15.

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-15 | Verwalter | Minor | Kategorienamen stehen nicht in der Sprache des Mieters. Die Positionen nehmen `item.description` (`service:102`), die vereinbarten Nebenkosten `categories.name` (`:170`). Die PDF der Abrechnung nennt dieselbe Position mit `localName(…, tenant.language)` (`statement-pdf.service.ts:53-54, 87`). Ein französischsprachiger Mieter findet im JSON also andere Namen als auf seiner PDF. Korrektur: `nameFR/IT/EN/DE` laden und wie `localName` wählen, `description` nur als Ersatz. |
| F-16 | Verwalter | Minor | Zu den Positionen fehlen Angaben, die die PDF zeigt: der Verteilschlüssel (`distributionKeyId` → Name in der Sprache des Mieters, vgl. `statement-pdf.service.ts:88`), `sharePercentage`, die Tage `positionRentalDays`/`billedDays` und der Name des Heizprofils bei einem Mieterwechsel (Art. 5 VMWG). Runde 1, «Weitere Hinweise»: «Positionen so, wie die PDF sie zeigt». Ohne den Schlüssel kann der Mieter den Anteil im JSON nicht nachvollziehen. Korrektur: Namen von Schlüssel und Heizprofil statt ihrer IDs ins JSON aufnehmen, dazu die Tage. |
| F-17 | Verwalter | Minor | Daten in UTC statt Schweizer Tag. Dokumentdatum `document.createdAt.toISOString().slice(0, 10)` (`service:126`) und `exportedOn` (`:137`). Ein Dokument von 00:30 Uhr Schweizer Zeit bekommt im Dateinamen den Vortag. Das E2E rechnet mit `inDays(0)` in Europe/Zurich (`tests/e2e/fixtures/dates.ts:2-5`) und schlägt zwischen 00:00 und 02:00 Uhr fehl. Korrektur: `toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' })` bzw. `swissToday()` (`backend/src/services/today.ts:4`). |
| F-18 | Rechtstexte (DSG) | Minor | Die PDF des Mietvertrags (`rental_contracts.contract_pdf`) fehlt im Export. Bekannte Lücke, beurteilt unten. |
| F-19 | Rechtstexte | Minor | Die API-Spezifikation führt den Endpunkt im falschen Abschnitt. Die Zeile steht unter «4. Apartments `/api/v1/apartments`» (`docs/api-specification.md:72`, Abschnitt ab Z. 63), dokumentiert also `GET /api/v1/apartments/:id/export`, den es nicht gibt. Korrektur: unter «5. Tenants» (ab Z. 77) verschieben. Der Inhalt der Zeile stimmt mit dem Code überein. |
| F-20 | Verwalter | Nit | Die Schritte prüfen weniger, als das Szenario sagt: «Kontaktdaten» prüft nur den Namen (`steps:37`), der Status `overdue` (F-8) ist nirgends geprüft. Den Schritt um E-Mail bzw. Korrespondenzadresse und `status: 'overdue'` ergänzen oder im `pg.test.ts` prüfen. |
| F-21 | Verwalter | Nit | Der Vorschlag im Plan (`implementation_plan.md:135-138`) ist veraltet: «earlier addresses», «Akonto or Pauschale», «values as stored», «the uploaded contract PDF». An die Umsetzung angleichen, bevor die Session ins Archiv kommt, sonst widerspricht das Archiv dem Code (besonders bei F-18). |
| F-22 | Rechtstexte | Nit | en `tenants_export_help`: «Give the file only to the tenant in person» heisst auch «persönlich übergeben» und schliesst den Versand per E-Mail scheinbar aus. Das stand schon in meinem Vorschlag aus Runde 1. Besser: «Give the file only to the tenant themselves.» |
| F-23 | Verwalter | Nit | Panel-Titel «Daten des Mieters» / «Données du locataire» / «Dati dell’inquilino» / «Tenant’s data»: richtig und glossarkonform, sagt aber nicht, wozu das Panel dient. Neben «Kontakt» und «Miete» könnte ein Laie dort die Daten selbst erwarten. Wahlweise «Daten herausgeben» / «Remise des données» / «Consegna dei dati» / «Hand over data» (nach dem amtlichen Titel von Art. 28 DSG, vgl. Runde 1). Kein Muss. |
| F-24 | Verwalter | Nit | Zwei Mahnungen gleicher Stufe am selben Tag (zwei Abrechnungen) heissen `… Zahlungserinnerung.pdf` und `… Zahlungserinnerung (2).pdf`. Welche Datei zu welcher Abrechnung gehört, steht nur im JSON. Die Abrechnungsnummer in den Namen nehmen, wie `documents.fileName` es schon tut (`reminder.service.ts:137`). |
| F-25 | Verwalter | Nit | Ein versendeter Brief ohne gespeicherte PDF fehlt im ZIP ohne Hinweis (`file: null`). Das ist richtig nach F-4. Ein Vermieter merkt es aber nur im JSON. Möglich: in der Hilfe oder einer Zeile im JSON sagen, dass die Abrechnung nicht als Datei vorliegt. |

### F-18 (Minor): PDF des Mietvertrags fehlt (bekannte Lücke)
- Beleg: `schema.ts:138` `contractPdf: text('contract_pdf'), // Base64 or URL`. Die API nimmt das Feld an (`backend/src/routes/contracts.ts:57, 78`) und gibt es aus (`contract.service.ts:46`). Der Export liest es nicht (`tenant-export.service.ts:47-70`). Laut Plan (`implementation_plan.md:136`) war es vorgesehen.
- Beurteilung:
  - In der Sache gehört der Vertrag in den Export. Art. 28 Abs. 1 DSG erfasst Daten, die die Person «bekanntgegeben hat» und die «in unmittelbarem Zusammenhang mit dem Abschluss oder der Abwicklung eines Vertrags … bearbeitet werden» (Zitat aus Runde 1). Der unterschriebene Mietvertrag ist genau das. «Done means» in #435 verlangt «all data Dwello holds about them», und die Hilfe sagt «alles, was Dwello … speichert».
  - Major ist es trotzdem nicht. Keine Oberfläche füllt das Feld: Im Frontend kommt `contractPdf` nur in `src/lib/types.ts:93` vor, in Seeds und Formularen gar nicht. Ein Vermieter kann über Dwello keine Vertrags-PDF hochladen. Die Spalte ist im Betrieb leer, der Export lässt heute also nichts weg.
- Korrektur (eine von beiden): (a) `contractPdf` in den Export nehmen, wenn es gesetzt und Base64 ist: `dokumente/<Beginn> Mietvertrag <Wohnung>.pdf`, Feld `file` am Vertrag (wenige Zeilen). Oder (b) ein Issue «Vertrags-PDF im Mieter-Export», das an das Issue gebunden ist, mit dem eine Oberfläche das Feld füllt. (a) ist robuster: Eine spätere Upload-Funktion vergisst den Export sonst leicht. Eine URL statt Base64 nur als Text im JSON, nicht abrufen.

## Bestätigt (neu in Runde 2)

- Begriffe der Texte: «Mieter», «Mietvertrag», «Abrechnung», «Mahnung» (Glossar Z. 208: Oberbegriff, Mahnstufen in Z. 209), «Dokument» (Z. 211) und «Kontaktdaten» (Glossar «Mieter», Z. 23). fr/it/en folgen `i18n-begriffe.md` Z. 20, 89, 91 (locataire/inquilino/tenant, rappel/sollecito/reminder, document/documento). «coordonnées» und «dati di contatto» passen zu `tenants_detail_purpose`. Knöpfe im Infinitiv wie «Supprimer le locataire» / «Eliminare l’inquilino». Schweizer «ss» und «innert» sind eingehalten.
- Die Hilfe sagt «Mahnungen» als Oberbegriff, das ist richtig, auch wenn im Szenario nur eine Zahlungserinnerung vorkommt.
- Daten anderer Personen: Abrechnungen, Mahnungen und Dokumente filtert der Export über `tenant_id`, Verträge über `rental_contracts.tenant_id`. Wohnung und Gebäude nimmt er nur über den eigenen Vertrag dazu. Eine Abrechnung des Vormieters derselben Wohnung kann deshalb nicht in den Export gelangen (Test `pg.test.ts:110-116`).
- Nur lesend: Der Export ruft kein Erzeugen auf. Der Test vergleicht alle Zeilen von `utility_statements` des Vertrags vorher und nachher (`pg.test.ts:129-137`).
- Die BFF-Route reicht die Sitzung als `Authorization` ans Backend weiter (`src/hooks.server.ts:69-75`), und der Export ist nur über die Anmeldung erreichbar. Das gehört zur Datensicherheit (Art. 8 DSG); die Technik prüft `code-reviewer`.
- API-Spezifikation (Inhalt): Felder, Reihenfolge der PDFs, «Reads only» und die Sprache der Namen stimmen mit dem Code überein, nur der Abschnitt ist falsch (F-19).
- Formeln: Der Export rechnet nichts. Er übernimmt gespeicherte Beträge und den berechneten Status «Überfällig» (`paymentDeadline < swissToday()` bei `sent`). Nachgerechnet:
  - Frist gestern, Status `sent` ergibt `overdue`.
  - Frist heute ergibt `sent` (nicht `<`).
  - Status `paid` mit abgelaufener Frist bleibt `paid`.
  - Entwurf: `draft`, `file: null`.
  - Ersetzt: `replaced`, mit PDF und `replaces` bei der neuen Abrechnung.

  Das stimmt mit der Glossarzeile «Zahlungsfrist einer Mahnung» überein (Z. 207: «die Abrechnung bleibt ‹Überfällig›»).

## Fehlende Begriffe

Keine. «Daten exportieren» braucht nach dem Entscheid in #435 keine Glossarzeile.

## Nicht bestätigt

- Ob `fflate.zipSync` bei Namen mit Umlaut oder Akzent («Übergabeprotokoll», «décomptes/», «données.json») das UTF-8-Flag (Bit 11) setzt. Im Worktree gibt es kein `node_modules`. In `/home/user/Dwello/node_modules/fflate/esm/index.mjs:2091` setzt `zip` es abhängig von der Namenslänge. Den Pfad von `zipSync` habe ich im Worktree nicht geprüft. Ohne das Flag zeigt der Windows-Explorer die Namen falsch an. Prüfung: ZIP mit `unzip -Z` ansehen.
- Ob die gespeicherte `pdfBlob` einer bezahlten Abrechnung die Bestätigung der Zahlung trägt (`statement.service.ts:630-633`: eine PDF nach der Zahlung «confirms it»). Dann wäre sie nicht genau das, was der Mieter per Brief erhielt. Gelesen habe ich nur die Kommentare, nicht die Vorlage. Für den Export ist das zulässig, weil es Daten sind, die Dwello hält, aber «as the tenant received it» in der API-Spezifikation wäre dann nur fast richtig.
- Ob die Beschreibungen der Rechnungen in den Positionen (`service:107`) Namen anderer Mieter enthalten können, z.B. «Reparatur Whg 2.01 Keller». Das ist Freitext aus Rechnungen, die eine KI kategorisiert. Der Mieter darf die Belege ohnehin einsehen (Art. 257b Abs. 2 OR). Den Wortlaut habe ich in dieser Runde nicht auf Fedlex geprüft, deshalb **unsicher**. Der Hinweis «Prüfen Sie vorher, ob Dokumente oder Notizen …» nennt Rechnungstexte nicht.
- Die Rechtszitate (Art. 26, 28, 29 DSG; Art. 16, 18, 20-22 DSV) stammen aus Runde 1 (Fedlex-Filestore, Fassungen 20250707/20251201). In dieser Runde habe ich sie nicht neu abgerufen. Hinzugekommen ist keine neue Rechtsaussage ausser F-18, und die stützt sich auf das Zitat von Art. 28 Abs. 1 aus Runde 1.
- Die E2E- und pg-Tests habe ich nicht ausgeführt (nur gelesen, Worktree ohne Abhängigkeiten).
