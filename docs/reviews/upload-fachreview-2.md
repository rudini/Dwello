# Fachreview 2: Umsetzung «Dokumente eines Mieters hochladen» (#174)

Geprüft: Commit `0ffdd30` (Worktree `review-upload-fach`), Diff `61dbb43..0ffdd30`. Grundlage: Runde 1 (`docs/reviews/upload-scenarios-fachreview-1.md`, F-1 bis F-12), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md`, DSG (SR 235.1, Fedlex-Fassung 01.09.2023, `eli/cc/2022/491/20230901`) und OR (SR 220, Fedlex-Fassung 01.01.2026, `eli/cc/27/317_321_377/20260101`), beide in dieser Runde neu von Fedlex geladen.

Geprüfte Texte in `messages/{de,fr,it,en}.json`: `privacy_stored_1`, `help_tenants_5`, alle `tenants_document_*`, `tenants_delete_text_with_documents`, `documents_uploaded`, `documents_uploaded_to`, `documents_download_file(_aria)`, `documents_purpose`, `documents_empty_text`, `backend_document_*`. Dazu `docs/api-specification.md`, `docs/data-model.md`, Backend-Regeln in `backend/src/services/document.service.ts` und `tenant.service.ts`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-1 | Verwalter | Major (offen, Product Owner) | Glossar unverändert: «Dokument» definiert nur Brief/E-Mail; «Hochgeladenes Dokument» fehlt, steht aber jetzt auch in `api-specification.md` und `data-model.md` |
| F2-1 | Verwalter | Nit | `data-model.md` sagt «up to 10 MB» ohne Definition, `api-specification.md` sagt 10 × 1024 × 1024 Byte |
| F2-2 | Verwalter | Nit | Ohne JavaScript bekommt eine Datei über rund 11 MB statt der Meldung «grösser als 10 MB» eine allgemeine Fehlerseite |
| F2-3 | Verwalter | Nit | Hilfetext «Ohne Titel heisst das Dokument wie die Datei.» verschweigt, dass die Endung wegfällt |
| F2-4 | Verwalter | Nit | Löschbestätigung nennt den Titel ohne «», die Meldungen danach mit «» |
| F2-5 | Verwalter | Nit | «hochladen», «Übergabeprotokoll», «Betreibungsauszug», «Ausweiskopie» fehlen in `docs/design/i18n-begriffe.md`; die Übersetzungen selbst stimmen |

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| F-1 | **offen** (Major, beim Product Owner) | `UBIQUITOUS_LANGUAGE.md` ist nicht im Diff; Zeile 159 weiterhin «Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF.» Neu verwenden auch `docs/api-specification.md:224` («(Hochgeladenes Dokument)») und `demo-data.sql` den Begriff. Plan-Annahme (`implementation_plan.md`, Session 35) ist berichtigt. Bleibt unter «Blocked on me» bis zum Glossareintrag. |
| F-2 | behoben | `privacy_stored_1` nennt in allen vier Sprachen «Dokumente, die Sie zu Mietern hochladen (etwa Übergabeprotokolle, Ausweiskopien oder Betreibungsauszüge)». Das stimmt mit dem überein, was die App speichert (`documents.content`, PostgreSQL des Betreibers, also `privacy_stored_2` weiterhin richtig). Uploads gehen an keinen Dritten (kein Mailversand, kein LLM), `privacy_third_5` bleibt richtig. Art. 19 Abs. 3 DSG: «Werden die Daten nicht bei der betroffenen Person beschafft, so teilt er ihr zudem die Kategorien der bearbeiteten Personendaten mit.» Die Kategorien sind jetzt genannt. Szenario `privacy.feature` «Hochgeladene Dokumente der Mieter» ohne `@wip`. |
| F-3 | behoben | `tenant-documents.feature`, Szenario «löscht ein hochgeladenes Dokument»: «Dann sagt die Bestätigung "Ausweiskopie wird endgültig gelöscht. Das lässt sich nicht rückgängig machen."» Text in vier Sprachen vorhanden (Anführungszeichen siehe F2-4). |
| F-4 | behoben | `tenants_document_upload_failed`: «Das Dokument wurde nicht gespeichert. Laden Sie die Datei erneut hoch.» Passt zu Serverfehler und Verbindungsfehler; fr/it/en sinngleich. |
| F-5 | behoben | Szenario «Ein Foto als Dokument hochladen» (JPG, öffnet die JPG-Datei); PNG über Backend-Test. Erkennung nach ersten Bytes (`document.service.ts`: `%PDF-`, `FF D8 FF`, `89 50 4E 47 0D 0A 1A 0A`), richtig. Link auf der Mieterseite zeigt «PDF»/«JPG»/«PNG» je nach Typ (`TenantDocumentRow.svelte`), auf `/documents` «Datei herunterladen» für Uploads. |
| F-6 | behoben | `tenants_document_file_help` sichtbar am Feld (`Field help=…` in `TenantDocumentUpload.svelte`): «PDF, JPG oder PNG, höchstens 10 MB. …» |
| F-7 | behoben (Hinweis), Frist als #178 offen | Hilfetext am Feld und `help_tenants_5`: «Löschen Sie Ausweiskopien und Betreibungsauszüge, sobald Sie sie nicht mehr brauchen.» Deckt Art. 6 Abs. 4 DSG: «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.» Issue #178 «Decide how long uploaded tenant documents are kept» ist offen mit `fachlich`, `entscheiden`. |
| F-8 | behoben | `tenants_document_demo` unter dem Titel «Öffentliche Demo» nur in der Demo (`{#if demo}`): «Alle Besucher sehen die Dateien, die Sie hier hochladen. Laden Sie nur erfundene Dokumente hoch.» Passt zu `privacy_demo_1` und `demo_notice_text`. Demo-Datensatz ist ein erfundenes Übergabeprotokoll. |
| F-9 | behoben | Grenze 10 × 1024 × 1024 Byte, «grösser als» streng (`file.length > MAX_MEGABYTES * 1024 * 1024`). Nachgerechnet: 10'485'760 Byte nicht grösser, angenommen; 10'485'761 Byte abgelehnt (Tests laut Plan an genau diesen Werten); Szenario 11 × 1'048'576 + Kopf = 11'534'345 Byte abgelehnt. Windows zeigt 10'485'761 Byte als «10,0 MB» (gerundet), die Meldung «grösser als 10 MB» ist dort knapp, aber nicht falsch. Base64 von 10 MiB = 13'981'016 Zeichen; das Backend (Bun) setzt kein kleineres Limit im Code. BFF-Limit siehe F2-2. |
| F-10 | behoben | `documents_uploaded_to` «Zu {name}, hochgeladen am {date}», `documents_empty_text` «Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.», `documents_purpose` ergänzt; kein Versandstatus-Badge für Uploads (`DocumentItem.svelte`); `status`-Filter listet Uploads nie (`status` ist NULL). |
| F-11 | Ablehnung bestätigt | `src/lib/utils/format.ts:50` formatiert einen Zeitpunkt in `Europe/Zurich`. Voraussetzung: `created_at` (TIMESTAMP ohne Zeitzone) wird in UTC geschrieben, Drizzle hängt beim Lesen `+0000` an. Datenbank `dwello_persona`: `show timezone` = `Etc/UTC`. Nachrechnung: 14.10.2026 00:30 MESZ = 13.10. 22:30 UTC gespeichert → angezeigt 14.10.2026, richtig. Siehe «Nicht bestätigt» zur Zeitzone in Produktion. |
| F-12 | behoben | Erzählung: «etwa das Übergabeprotokoll oder einen Betreibungsauszug». |

## Befunde

### F2-1 (Verwalter, Nit): 10 MB in `data-model.md` nicht definiert

Beleg: `docs/data-model.md` (Abschnitt `documents`): «PDF, JPEG or PNG up to 10 MB»; `docs/api-specification.md:224`: «at most 10 × 1024 × 1024 bytes»; Kommentar `document.service.ts`: «10 × 1024 × 1024 bytes, as Windows counts a megabyte».

Warum: Die in F-9 entschiedene Regel steht in zwei Dokumenten verschieden genau. Wer nur das Datenmodell liest, kann 10'000'000 Byte annehmen.

Korrektur: In `data-model.md` «up to 10 MB (10 × 1024 × 1024 bytes)».

### F2-2 (Verwalter, Nit): Grosse Datei ohne JavaScript

Beleg: `TenantDocumentUpload.svelte` prüft die Grösse nur in `use:enhance` (Kommentar: «a file over the limit would only reach the server to be refused, or not at all (BODY_SIZE_LIMIT)»); `Dockerfile`: `BODY_SIZE_LIMIT=11M`. Plan, Annahmen: «works without JavaScript».

Nachrechnung (11M als 11 × 1024 × 1024 = 11'534'336 Byte, **unsicher**, siehe unten):
1. Datei 10'600'000 Byte ohne JavaScript: Formular rund 10'600'500 Byte < 11'534'336, Backend lehnt mit `DOCUMENT_TOO_LARGE` ab, Meldung erscheint am Feld. Richtig.
2. Datei 12'000'000 Byte (ein typischer Farbscan) ohne JavaScript: über dem Limit, adapter-node antwortet 413; der Vermieter sieht eine allgemeine Fehlerseite, der Titel ist verloren. Mit JavaScript erscheint die richtige Meldung.

Warum: Nur ohne JavaScript, darum Nit. Die Regel «errors say what happened and what to do» gilt aber auch dort.

Korrektur: Hinnehmen und als offene Arbeit erfassen, oder ein Fehlerseiten-Text für 413 («Die Datei ist grösser als 10 MB. …»). Gehört eher in die Code-Review als in die Fachreview.

### F2-3 (Verwalter, Nit): Hilfetext zum Titel ungenau

Beleg: `tenants_document_title_help` «Ohne Titel heisst das Dokument wie die Datei.»; `document.service.ts`: `upload.fileName.replace(/\.[^.]*$/, '')`; Szenario: «Uebergabeprotokoll.pdf» → «Uebergabeprotokoll».

Warum: Kleiner Unterschied, aber ein Vermieter, der «Uebergabeprotokoll.pdf» erwartet, sucht danach. Entscheid in #174 ist «Dateiname ohne Endung».

Korrektur: «Ohne Titel heisst das Dokument wie die Datei, ohne Endung.» fr «Sans titre, le document porte le nom du fichier, sans l’extension.» it «Senza titolo, il documento porta il nome del file, senza estensione.» en «Without a title, the document is named after the file, without its extension.»

### F2-4 (Verwalter, Nit): Titel in der Bestätigung ohne «»

Beleg: `tenants_document_delete_text` «{title} wird endgültig gelöscht. …» gegenüber `tenants_document_deleted_toast` «Dokument «{title}» gelöscht» und `tenants_document_uploaded_toast` «Dokument «{title}» hochgeladen». Runde 1 (F-3) schlug ««Ausweiskopie» wird endgültig gelöscht.» vor.

Warum: Ein frei gewählter Titel kann ein Satzteil sein («Kopie vom Ausweis wird endgültig gelöscht» liest sich, «notizen wird endgültig gelöscht» nicht); beim Mieternamen (`tenants_delete_text`) braucht es keine Anführungszeichen, beim Titel schon. Innerhalb des Features uneinheitlich.

Korrektur: «Dokument «{title}» wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.» (fr « Le document « {title} » sera définitivement supprimé. … », it «Il documento «{title}» verrà eliminato definitivamente. …», en «The document «{title}» will be deleted permanently. …»); Szenario und Schritt mitziehen. Ebenso löst «Dokument …» das Genus-Problem in fr/it («{title} sera définitivement supprimé» passt nicht zu einem weiblichen Titel wie «Attestation»).

### F2-5 (Verwalter, Nit): Begriffe fehlen in `i18n-begriffe.md`

Beleg: `docs/design/i18n-begriffe.md` kennt nur «Dokument / Versandstatus / Zu versenden» (Zeile 64); die neuen Texte verwenden ausserdem:

| de | fr | it | en | Quelle für die Schweizer Praxis |
|----|----|----|----|----|
| hochladen | téléverser | caricare | upload | admin.ch: SEFRI «Téléverser les documents requis», BAZL «Téléverser des documents» |
| Übergabeprotokoll | procès-verbal de remise | verbale di consegna | handover report | fr: homegate.ch, lex4you.ch, mobiliere.ch «procès-verbal de remise»; it: ti.ch (Repertorio locazione, Art. 267a CO) «verbale di consegna dell’ente locato» |
| Betreibungsauszug | extrait du registre des poursuites | estratto del registro delle esecuzioni | debt collection register extract | gebräuchlich (nicht über Fedlex belegt) |
| Ausweiskopie | copie de pièce d’identité | copia di un documento d’identità | copy of an ID document | gebräuchlich |

Die Übersetzungen in den Texten entsprechen dieser Tabelle; nur die Liste fehlt. CLAUDE.md: «terms per language in `docs/design/i18n-begriffe.md`».

Korrektur: Die vier Zeilen in `i18n-begriffe.md` ergänzen (das ist nicht das Glossar und darf geändert werden). Kein Issue nötig, wenn sie mit der Änderung kommen; sonst Issue mit Labels `fachlich`, `entscheiden`. Ob «Übergabeprotokoll», «Betreibungsauszug», «Ausweiskopie» ins Glossar gehören: Vorschlag nein, sie sind Beispiele, keine Begriffe des Modells; das entscheidet der Product Owner zusammen mit F-1.

## Bestätigt

- **Mahnung nicht löschbar**, `backend_document_not_deletable` «Mahnungen bleiben erhalten, weil sie belegen, dass der Mieter gemahnt wurde.»: Art. 102 Abs. 1 OR (Fedlex, Fassung 01.01.2026): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Die Mahnung ist Beweismittel; die Regel ist im Backend durchgesetzt (`deleteDocument` löscht nur `type = 'upload'`, sonst 409). Glossar: Zahlungserinnerung ist Mahnstufe 1 einer Mahnung, «Mahnungen» schliesst sie ein. fr «rappels … relancé», it «solleciti … sollecitato», en «reminders … reminded» gemäss `i18n-begriffe.md:62`.
- **Mieter löschen mit Uploads**: nur ohne Mietvertrag (`deleteTenant`, jeder Vertrag, laufend oder beendet), Uploads in derselben Transaktion gelöscht. `tenants_delete_text_with_documents` nennt die Folge vollständig; ohne Mietvertrag gibt es keine Mahnung (setzt Abrechnung und damit Mietvertrag voraus), also sind alle Dokumente Uploads (`+page.svelte`, `hasDocuments`). fr/it «Le locataire {name}» / «L’inquilino {name}» wie der bestehende `tenants_delete_text`. Das Entfernen der eigenen Prüfung auf laufende Verträge ändert das Ergebnis nicht, weil die Prüfung auf jeden Vertrag sie einschliesst.
- **`backend_document_too_large`**, **`backend_document_type_not_allowed`**: sagen, was passiert ist und was zu tun ist; «grösser» mit «ss»; fr «Mo», it/en «MB»; Wortlaut wie im Szenario.
- **`documents_purpose`**, **`documents_empty_text`**, **`documents_uploaded(_to)`**, **`documents_download_file(_aria)`**: in allen vier Sprachen sinngleich, «Sie»/«vous»/«Lei» (it «Le servono», «carica»), Verben auf Buttons («Dokument hochladen», «Téléverser le document», «Caricare il documento», «Upload document»).
- **`help_tenants_5`**: stimmt mit der Oberfläche (Karte «Dokumente» auf der Mieterseite, Typen, Grösse, Hinweis zum Löschen).
- **`privacy_stored_1`** fr/it/en: «extraits du registre des poursuites», «estratti del registro delle esecuzioni» sind die Schweizer Bezeichnungen; «procès-verbaux de remise», «verbali di consegna» siehe F2-5.
- **API-Dokumentation**: `POST /tenants/:id/documents` (Titel leer → Dateiname ohne Endung, Typ nach ersten Bytes, 10 × 1024 × 1024), `DELETE /documents/:id` (409 für Mahnung), `status`-Filter ohne Uploads, Löschen des Mieters nimmt Uploads mit: alles entspricht Code und #174.
- **Mietrechtliche Regeln (OR 253 ff., VMWG)**: Die Änderung berührt weder Nebenkosten, Mietzins noch Vertragsende; `nebenkostenabrechnung-anforderungen.md` und `anforderungen-vertragsende.md` enthalten nichts zu hochgeladenen Unterlagen. Kein Widerspruch.

## Nicht bestätigt

- **Zeitzone der Datenbank in Produktion** (F-11): lokal und in `dwello_persona` `Etc/UTC` (`postgres:16-alpine` ist standardmässig UTC). Eine Datenbank mit `timezone = 'Europe/Zurich'` würde `NOW()` als Ortszeit speichern und Drizzle sie als UTC lesen: ein Upload um 23:30 MESZ zeigte den Folgetag. Gilt für alle Zeitstempel der App, nicht neu durch diese Änderung; nicht weiter geprüft.
- **`BODY_SIZE_LIMIT=11M` = 11 × 1024 × 1024 Byte** (F2-2): `node_modules/@sveltejs/adapter-node/files/utils.js` durfte ich nicht lesen (Zugriff verweigert); die Faktoren 1024 sind aus der SvelteKit-Dokumentation erinnert, **unsicher**. Ein optionaler nginx-Proxy (auskommentiert in `docker-compose.prod.yml:119–132`, keine `nginx.conf` im Repo) hätte standardmässig 1 MB Body-Limit; Caddy (`deploy/demo/Caddyfile`) setzt keines. Betrieb, keine Fachfrage.
- **Laufende App** (http://localhost:3300) nicht angesehen; Platzierung von Hilfetext und Demo-Hinweis aus `TenantDocumentUpload.svelte` und den DOM-Tests im Plan abgeleitet.
- **Betreibungsauszug/Ausweiskopie in fr/it/en**: Schweizer Bezeichnungen aus Praxis-Quellen, keine Fedlex-Stelle gesucht.
- **Einordnung der Betreibungsdaten** (nicht besonders schützenswert, Art. 5 lit. c DSG) und **EDÖB-Merkblatt**: wie in Runde 1 **unsicher**, nicht erneut geprüft.
