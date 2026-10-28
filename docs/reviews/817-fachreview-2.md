# Fachreview #817 (Runde 2, Feature-Review): Zugangsschlüssel für KI-Programme

Gegenstand: Commit ea476e3 (Worktree review-817-fach2), `messages/{de,fr,it,en}.json` (Schlüssel `privacy_ai_keys_*`, `ai_keys_*`, `audit_ai_key_*`, `backend_access_key_*`, `privacy_third_5`, `audit_privacy`, `terms_responsibility_3`), `backend/src/routes/mcp.ts`, `backend/src/services/access-key.service.ts`, `src/routes/config/access-keys/`, `UBIQUITOUS_LANGUAGE.md:262`, `docs/design/i18n-begriffe.md:132`. Vorbericht: `docs/reviews/817-fachreview-1.md`. Gesetz: DSG (SR 235.1), Stand 7. Juli 2025 (Fedlex, Fassung ab 2025-07-07, weiterhin die geltende).

Geschlossen: R-1, R-2, R-3, R-4, R-5, R-6, R-7, V-1, V-2, V-3, V-4, V-5

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-6 | Verwalter | Major | Die Listen der MCP-Werkzeuge sind abgeschnitten: Gebäude, Rechnungen und Abrechnungen nach 20, Wohnungen, Mieter und Mietverträge nach 50 Einträgen. Das Werkzeug kann nicht weiterblättern, und die Beschreibung verspricht «alle» |
| V-7 | Verwalter | Minor | `mcp.ts:61` «mit Miete, Akonto und Pauschale»: «Pauschale» kann die Nebenkostenpauschale oder die Verwaltungspauschale sein (das Glossar Z. 54 trennt sie: «Nicht zu verwechseln»). Fix: «mit Nettomiete, Akonto und Nebenkostenpauschale» |
| V-8 | Verwalter | Minor | `mcp.ts:80` «Status: draft, sent, paid oder overdue» lässt `settled` (Erledigt) und `replaced` (Ersetzt) weg (Glossar «Abrechnungsstatus», Z. 199–206). Fix: «Status: draft (Entwurf), sent (Versendet), paid (Bezahlt), settled (Erledigt), overdue (Überfällig) oder replaced (Ersetzt)» |
| V-9 | Verwalter | Minor | `mcp.ts:84` legt alle Dokumente der Abrechnung unter `reminders` ab, also auch den E-Mail-Versand der Abrechnung selbst (`type: 'statement'`, `schema.ts:598`). Das KI-Programm zählt ihn sonst als Mahnung. Fix: nur `type === 'reminder'` unter `reminders` ausgeben, oder den Schlüssel `documents` nennen und die Beschreibung «mit ihrem Versand und ihren Mahnungen mit Mahnstufe» verwenden |
| V-10 | Verwalter | Minor | Die Liste zeigt «Abgelaufen am {expiresOn}» (`AccessKeyRow.svelte:16`, Test `access-keys-page.dom.test.ts:57`). Das ist der letzte gültige Tag: Der Schlüssel funktioniert an diesem Tag noch (`keyOf`: `expiresOn < swissToday()`), und das Protokoll datiert den Ablauf auf den Folgetag 00:00 (`recordExpiries`). Beispiele: erstellt 28.10.2026 → Läuft ab am 26.01.2027, gültig bis 26.01. 23:59, Protokoll 27.01.2027 00:00, Liste «Abgelaufen am 26.01.2027»; erstellt 01.03.2027 23:30 → 30.05.2027, Protokoll 31.05.2027 00:00 (Sommerzeit ändert nichts, `daysAfter` rechnet in UTC-Tagen). Fix: Wortlaut `ai_keys_expired` unten |
| V-11 | Verwalter | Minor | Am MCP-Server bekommen auch ein falsch kopierter Schlüssel und eine Anfrage ohne Schlüssel `ACCESS_KEY_INVALID` mit dem Satz «… ist widerrufen oder abgelaufen» (`access-key.service.ts` `keyOf`, `mcp.ts:124`). Für einen Tippfehler ist das falsch. Da das Widerrufen die Zeile löscht, sind «widerrufen» und «unbekannt» nicht zu trennen. Fix: «ungültig, widerrufen oder abgelaufen», Wortlaut unten (auch im deutschen Satz in `mcp.ts`) |
| R-8 | Rechtstexte | Minor | it `ai_keys_created_secret` endet mit «la revochi», gegen `i18n-begriffe.md:132` («disattivare», nicht «revocare») und die übrigen it-Texte. Die Regel `/\brevoca/i` in `src/__tests__/i18n.test.ts:112` fängt «revochi» nicht. Fix: «la disattivi»; die Regel z. B. auf `/\brevoc/i` erweitern |
| R-9 | Rechtstexte | Minor | Der «Stand» bleibt 20. Oktober 2026 (`src/routes/LegalHeader.svelte:12`), obwohl beide Texte jetzt einen neuen Abschnitt bzw. Satz haben. Zur Frage 4 siehe unten. Fix: Datum des Releases, mit `needs-decision`-Issue für `privacy.feature:121-122` und `terms.feature:41-42` |
| R-10 | Rechtstexte | Minor | Demo: `audit_privacy_demo` (de.json:1952) sagt nur, dass alle Besucher die Anmeldungen ohne Namen sehen. Die Routen `access-keys.ts` sperren die Demo nicht. Deshalb sehen alle Besucher Liste und Protokoll mit den frei gewählten Namen der Schlüssel und den Abrufen der anderen, und jeder kann fremde Schlüssel widerrufen. Fix: Satz unten anhängen |
| R-11 | Rechtstexte / Verwalter | Minor | Das Werkzeug `contracts` gibt die ganze Antwort von `/contracts` weiter, mit `contractPdf` («Base64 or URL», `schema.ts:156`) und `notes` (`contract.service.ts:54-55`). Die Oberfläche schreibt keines der beiden Felder (kein Treffer in `src`), die API nimmt sie aber an (`contracts.ts:70-71`). Ein so gespeichertes Vertrags-PDF ginge an das KI-Programm, gegen `privacy_ai_keys_1` «Dokumente, Belege und PDFs erhält es nicht» und den Entscheid «no PDFs». Fix: beide Felder in `callTool` für `contracts` entfernen |

## V-6 (Major): Listen ohne alle Einträge

Beleg: Die Werkzeuge rufen die Listen ohne `limit`/`offset` auf (`mcp.ts:27-31` `one()`, `query()` nur mit den genannten Filtern). Die Services setzen dann ihre Vorgabe:
- `building.service.ts:28` `limit = 20`
- `invoice.service.ts:102` `limit = 20`
- `statement.service.ts:139` `limit = 20`
- `apartment.service.ts:105`, `tenant.service.ts:80`, `contract.service.ts:105` `limit = 50`

`inputSchema` hat `additionalProperties: false` und keine Eigenschaft `limit`/`offset` (`mcp.ts:95-103`). Das KI-Programm kann also nicht weiterblättern. Die Beschreibungen versprechen das Gegenteil: «die Liste aller Gebäude» (`mcp.ts:43`), «alle Wohnungen» (`:49`), «Rechnungen nach Gebäude und Abrechnungsperiode» (`:67`).

Warum falsch: Ein Gebäude mit 6 Wohnungen hat im Jahr leicht 30 bis 40 Rechnungen (Heizöl, Strom, Wasser, Hauswart, Versicherung, Akontorechnungen). Gerechnet:
- 35 Rechnungen der Periode: Das Werkzeug liefert 20. Fragt der Vermieter «Wie viel umlagefähige Nebenkosten hat das Gebäude 2026?», summiert das Programm 20 von 35 Rechnungen und nennt eine zu tiefe Zahl, ohne Warnung.
- Abrechnungen: Bei 25 Wohnungen gibt es nach einem Jahr 25 Abrechnungen. «Welche Abrechnungen sind überfällig?» prüft dann nur 20 davon (Statusfilter ohne `status`), und es fehlen Mahnfälle.
- Randfall 0 Rechnungen: Die leere Liste ist richtig.

Entscheid #817: «the same results … as the UI». Die Oberfläche blättert, das Werkzeug nicht.

Fix: Das Werkzeug holt alle Einträge, z. B. `limit` gross genug für das MVP (unter 50 Wohnungen) setzen oder in `callTool` bis `total` nachladen. Einen Test pro Liste mit mehr Einträgen als der Vorgabe, z. B. 21 Rechnungen einer Periode → 21 im Werkzeug. Die Alternative, `limit`/`offset` als Eigenschaften mit dem Satz «liefert höchstens N; mit «offset» die nächsten», verlässt sich darauf, dass das Programm weiterblättert, und ist schwächer.

## Frage 4: «Stand» 20.10.2026 bis zur Freigabe

DSG Art. 19 Abs. 1 (Stand 7.7.2025): «Der Verantwortliche informiert die betroffene Person angemessen über die Beschaffung von Personendaten …». Abs. 2: «… diejenigen Informationen mit, die erforderlich sind, damit sie ihre Rechte nach diesem Gesetz geltend machen kann und eine transparente Datenbearbeitung gewährleistet ist …».

- **Gesetz:** Weder das DSG noch das OR schreiben ein Datum der Datenschutzerklärung oder der Nutzungsbedingungen vor. Rechtswidrig ist das alte Datum also nicht.
- **Richtigkeit:** Falsch ist die Angabe trotzdem. Der Text mit dem Abschnitt «KI-Programme mit Zugangsschlüssel» bestand am 20.10.2026 nicht, und der Vermieter erkennt an «Stand» nicht, dass er seinen Mietern einen neuen Abschnitt geben kann. Das wiegt leicht, weil `ai_keys_before` auf der Seite der Schlüssel zum Abschnitt führt.
- **Nutzungsbedingungen:** Sie haben keine Zustimmung und keine Änderungsklausel (keine Fundstelle in de.json). Das Datum bestimmt also keine Vertragsfassung.
- **Ergebnis:** Für den Merge darf das Datum bleiben (Minor R-9). Vor dem Release sollte der Product Owner die Änderung der beiden Szenarien freigeben. Besser fragen die Szenarien das Datum nicht wörtlich ab, sondern prüfen, dass ein Stand genannt ist, sonst braucht jede Textänderung eine Freigabe.

## Beurteilung der bewussten Abweichungen

1. **`audit_privacy` / `terms_responsibility_3`:** Der zusätzliche Satz sagt in allen vier Sprachen dasselbe wie der Wortlaut aus Runde 1, und die Szenarien `privacy.feature:43`, `terms.feature:30` stimmen weiter. In fr/it/en ist `terms_responsibility_3` in der Satzform aus Runde 1 geblieben (ein Satz mit «et, si vous donnez …»). Der Inhalt ist gleich, das ist kein Befund. Dass die Einträge nach dem Widerrufen bleiben, entspricht dem Code (`revokeAccessKey` löscht den Schlüssel, die Einträge im Protokoll bleiben).
2. **it «disattivare»:** richtig und überall durchgezogen, ausser bei R-8.
3. **Neue Texte:** `ai_keys_address`, `ai_keys_link`, `ai_keys_revoke_label`, `ai_keys_not_created`, `ai_keys_not_revoked`, `backend_access_key_name_missing` sind in allen vier Sprachen richtig. Die Adresse ist die der Web-App + `/mcp` (`+page.server.ts:23`), wie entschieden (ADR 0007). Derselbe Satz für alle Ablehnungen am MCP-Server ist richtig, weil das Backend widerrufen und unbekannt nicht trennen kann, aber nur mit «ungültig» (V-11). Deutsch im Backend ist für einen Text, den das KI-Programm liest und dem Vermieter in dessen Sprache wiedergibt, vertretbar, wie in Runde 1 zu den Werkzeugen.
5. **Werkzeuge:** Siehe V-6 bis V-9 und R-11. Die übrigen Begriffe stimmen mit dem Glossar (Abrechnungsperiode, Kategorie, Umlagefähigkeit, Saldo, Zahlungsfrist, Mahnstufe, Beleg).
6. **Glossar:** Die Zeile `UBIQUITOUS_LANGUAGE.md:262` stimmt mit dem Code (Hash, gültig bis zum Kalendertag 90 Tage nach dem Erstellen, Widerrufen, Protokoll), ebenso `i18n-begriffe.md:132`. Die fehlende Zeile «KI-Programm» und die Ergänzung von «Protokoll» (Z. 280 nennt die Schlüssel noch nicht) stehen schon in #942 (offen, `domain`), deshalb kein neues Issue.

## Wortlaut

Im Französischen sind die Leerzeichen in « » und vor : bereits geschützt (U+00A0), wie in `messages/fr.json`.

| key | de | fr | it | en |
|---|---|---|---|---|
| ai_keys_expired | Abgelaufen, galt bis {date} | Expirée, valable jusqu’au {date} | Scaduta, valida fino al {date} | Expired, valid until {date} |
| backend_access_key_invalid | Dieser Zugangsschlüssel ist ungültig, widerrufen oder abgelaufen. Erstellen Sie in Dwello unter «Einstellungen» › «Zugangsschlüssel für KI-Programme» einen neuen. | Cette clé d’accès n’est pas valable, a été révoquée ou a expiré. Créez-en une nouvelle dans Dwello sous « Paramètres » › « Clés d’accès pour programmes d’IA ». | Questa chiave di accesso non è valida, è stata disattivata o è scaduta. Ne crei una nuova in Dwello in «Impostazioni» › «Chiavi di accesso per programmi di IA». | This access key is invalid, has been revoked or has expired. Create a new one in Dwello under «Settings» › «Access keys for AI programs». |
| ai_keys_created_secret (nur it) | – | – | Chi possiede la chiave può leggere i Suoi dati. La inserisca nelle impostazioni del programma di IA, non in un messaggio al programma o ad altre persone. Se è finita in mani sbagliate, la disattivi. | – |
| audit_privacy_demo (angehängter Satz) | Auch die Zugangsschlüssel für KI-Programme der anderen sehen alle Besucher mit ihrem Namen, und alle können sie widerrufen. Geben Sie einem Schlüssel deshalb keinen Personennamen. | Tous les visiteurs voient aussi les clés d’accès pour programmes d’IA des autres avec leur nom, et tous peuvent les révoquer. Ne donnez donc pas de nom de personne à une clé. | Tutti i visitatori vedono anche le chiavi di accesso per programmi di IA degli altri con il loro nome, e tutti possono disattivarle. Non dia quindi a una chiave il nome di una persona. | All visitors also see the others’ access keys for AI programs with their names, and anyone can revoke them. So do not give a key a person’s name. |

Werkzeugbeschreibungen (`mcp.ts`, nur deutsch):
- contracts: «Mietverträge: die Liste der Mietverträge, oder mit «id» ein Mietvertrag mit Nettomiete, Akonto und Nebenkostenpauschale.» (V-7)
- statements `status`: «Status: draft (Entwurf), sent (Versendet), paid (Bezahlt), settled (Erledigt), overdue (Überfällig) oder replaced (Ersetzt)» (V-8)

## Nicht bestätigt

- **Gespeicherte Vertrags-PDFs (R-11):** Ob eine bestehende Installation `contract_pdf` oder `notes` gefüllt hat, etwa über eine frühere Version oder einen direkten API-Aufruf. In `src` fand ich keinen Schreibzugriff (`git log -S contractPdf -- src`: nur Typen), in den Demo- und Seed-Daten keine Treffer. Die Datenbanken der Betreiber kann ich nicht prüfen. Ist das Feld irgendwo gefüllt, wird R-11 zum Blocker.
- **Protokoll des Servers:** Ob das Protokoll des Servers oder ein Proxy vor der Web-App die Anfragen an `/mcp` mit dem Header `Authorization` aufzeichnet. Die Web-App leitet `/mcp` unverändert weiter (Entscheid, ADR 0007). Einen Logger für Anfragen fand ich im Backend wie in Runde 1 nicht, den Proxy des Betreibers kann ich nicht prüfen.
- **Mieter neu informieren:** Ob der Vermieter Mieter, die er schon informiert hat, vor dem ersten Schlüssel neu informieren muss. Unverändert **unsicher** (Art. 19 DSG regelt die Information «bei der Beschaffung», für einen späteren neuen Empfänger fand ich keinen Wortlaut).

Geprüft: Wortlaut aus Runde 1 in allen vier Sprachen übernommen (`privacy_ai_keys_1` bis `_4`, `privacy_third_5`, `ai_keys_*`, `audit_ai_key_*`, die sieben Arten passen zu den sieben Werkzeugen, ohne eigenes «Mahnungen»); Ablauf als Kalendertag in Europe/Zurich und einmaliger Eintrag im Protokoll auch ohne Abruf (`recordExpiries`); eigener Bestätigungstext für einen abgelaufenen Schlüssel; Fedlex DSG Art. 6, 8, 19 Stand 7.7.2025.
