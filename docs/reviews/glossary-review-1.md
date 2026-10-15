# Code-Review Slice «glossary» (#188), Runde 1

Geprüft: Worktree `review-glossary-code` (detached, 2562751), Bereich `18be333..2562751` (be50dc0 Plan, 2562751 Änderung). Geänderte Dateien, alle gelesen: `UBIQUITOUS_LANGUAGE.md`, `docs/PRD-Dwello.md`, `docs/anforderungen-vertragsende.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `implementation_plan.md`. Kein App-Code, keine Tests, keine `messages/*.json` geändert (`git diff --stat -- src backend tests messages` leer).

Anforderung: #188 samt Entscheidkommentar (15.10.2026) und Regelliste in #187 (Gruppen 1–5).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| GR-1 | Minor | `docs/nebenkostenabrechnung-anforderungen.md:146` | «zusammen genau 100 %»: Backend (`heating-profile.service.ts:142-144`) und BFF (`src/lib/server/heating-profile.ts:38`) lassen ±0,1 % zu. Die alte Glossarzeile sagte nur «Summe = 100%»; «genau» ist eine neue Aussage, die vom Code abweicht (Entscheid #188, Punkt 2: Doku beschreibt den Code). |
| GR-2 | Minor | `docs/nebenkostenabrechnung-anforderungen.md:145` | «bei einem Mieterwechsel nach dem Heizprofil»: `calculation.service.ts:301-311` wendet das Heizprofil auf jeden Mietvertrag an, der nur einen Teil der Periode läuft (auch Ein-/Auszug mit Leerstand ohne Nachfolger), nicht nur beim Mieterwechsel. Wortlaut aus dem alten Glossar übernommen; genauer wäre «bei unterjährigem Ein- oder Auszug» (wie PRD 5.7 «tenants who moved mid-year»). |
| GR-3 | Minor | `docs/anforderungen-vertragsende.md:31` | Verweis «Szenarien in … `contract-edit.feature`»: dort zeigt kein Szenario die Ablehnung einer Überschneidung (nur «Überschneidung noch nicht geprüft», Z. 55-77). Die Ablehnung belegen `contract-new.feature:47` (Wohnung nicht wählbar) und `backend/src/__tests__/contract-overlap.pg.test.ts`. |
| GR-4 | Minor | `docs/PRD-Dwello.md:1060` | Tab 4 sagt weiter «X days from statement date», während 5.9 (`:515`) neu «days after the statement is sent» sagt. Gleiche Regel, zwei Fassungen im selben Dokument; Code: `statement.service.ts:434-437` (beim Versand neu gesetzt). |
| GR-5 | Minor | `UBIQUITOUS_LANGUAGE.md:25` | «Vermieter … Trägt die Kosten des Leerstands.» bleibt als Regel im Glossar, während dieselbe Regel bei «Proration» und «Gleichmässig pro Wohnung» entfernt wurde. Steht nicht in der Liste von #187, widerspricht aber Option A («nur Definitionen»); entweder entfernen oder im PR begründen. |
| GR-6 | Nit | `docs/nebenkostenabrechnung-anforderungen.md:144` | Regel 4 verweist für die Ausnahme Art. 7 Abs. 2 VMWG auf «Thema 4»; die Ausnahme steht in Thema 3 (Z. 60) und Thema 7. |
| GR-7 | Nit | `docs/anforderungen-vertragsende.md:42`, `:51`, `:94` | Entfernte *(Glossar fehlt)*-Marker und «Leistungszeitraum», «Anfangs- und Endbestand» aus der Liste «Nicht im Glossar» (NK-Doku Z. 135) waren schon auf der Basis veraltet (Begriffe standen im Glossar). Sachlich richtig und nah am Thema, aber eine Aufräumarbeit über die Regelverschiebung hinaus; im PR erwähnen. Der Satz «Ausserdem passt die Definition im Glossar … nicht mehr» (Z. 42) bleibt stehen und ist ebenfalls veraltet. |
| GR-8 | Nit | `implementation_plan.md:12-15` | Kein Plan-Punkt für zwei «Done means» aus #188: die Liste «Regel → neuer Ort» im Pull Request und die Nennung von Hilfetexten, die das Glossar zitieren (z. B. `glossary_*` in `messages/de.json`). |

Keine Blocker oder Major.

## Bestätigt (Regel → neuer Ort → Code/Szenario)

Gruppe 1:
- Mietstatus (von Hand nur Leer/Gesperrt; Gesperrt nur ohne laufenden/künftigen Vertrag): PRD:184; `apartment.service.ts:35-49`, `apartments.ts` (`manualStatus`), `apartment-edit.feature:19-26`.
- Korrespondenzkanal (Brief Standard, E-Mail verlangt Adresse): PRD Mieterformular; `schema.ts:96` (default `letter`), `src/lib/server/tenant-form.ts:39-40`. PRD-Zeile «Email (required)» korrekt an den Code angepasst (Entscheid Punkt 1).
- Keine Überschneidung: vertragsende Regel 1; `contract.service.ts:290, 338` (`CONTRACT_OVERLAP`). Verweis siehe GR-3.
- Kündigungstermin als Vertragsende: vertragsende Regel 2; Glossar «Vertragsende» sagt es weiterhin als Definition.
- Kündigungsfrist (Dwello prüft nicht): vertragsende Regel 3; #112 offen, «A-3: Hint on the Kündigungsfrist», Label-Status Proposed → «geplant» passt.
- Umlagefähige Rechnung: NK Regel 2, PRD 5.11; `invoice.service.ts:201, 211-216, 354`; `invoice-edit.feature:27`, `invoice-detail.feature:18`.
- Grund der Änderung (Formular Pflicht, API optional): PRD 5.5 Use Case 3 und 6.4; `routes/invoices.ts:49` (Optional), `invoices/[id]/edit/+page.svelte:57, 65`; `invoice-edit.feature:37`.
- Vordefinierte Heizprofile (Anteile nicht änderbar, nicht löschbar, Name änderbar): PRD 5.7, NK Regel 6; `heating-profile.service.ts:212-213, 257-259`.
- Mahnstufe (max. 3), Mahnung (PDF in Dokumenten, Kanal): PRD 5.9 «Reminders»; `reminder.service.ts:19, 52-53, 99-112`; `statement-reminder.feature`, `reminders.pg.test.ts`.
- IBAN CH/LI: stand schon in PRD:714; `qr-bill.service.ts:99`.
- Zahlungsfrist (Tage nach Versand, nie früher als gesetzte Frist): NK Thema 2, Regel 11, PRD:515; `statement.service.ts:434-437`, `config.service.ts:74-78` (Standard 30).
- Mahnfrist (Standard 14, nicht angewendet): PRD:516, 5.9, 6.5 Tab 4; `reminder_after_days` wird ausserhalb von `config.service.ts`/Route nirgends gelesen, `reminder.service.ts:50` prüft nur `overdue` (Entscheid Punkt 2).

Gruppe 2:
- Rechnungsdatum/Leistungszeitraum: NK Regel 1, PRD 5.5; `invoice.service.ts:436-457` (`getInvoicesForStatement` existiert, Name stimmt).
- Heizkosten-Kategorie, Heizprofil: NK Regel 5, 6; PRD 5.7 (pro Lauf, nicht pro Gebäude; Gebäude-Tab «Heating profile selection» entfernt: `schema.ts` hat kein Heizprofil am Gebäude, nur `utility_statements.heating_profile_id`). Einschränkungen GR-1, GR-2.
- Verteilschlüssel / gleichmässig / Leerstand / Wohnungsanteil × Mietstage: NK Regel 3–5, PRD 5.6 und Proration; Entscheid Punkt 4 (Art. 7 Abs. 2 nicht angewendet) in NK Thema 3, Thema 7 und PRD «Vacancy».
- Tankbestand/Stichtag (CHF, FIFO durch Vermieter, jeder Tag, Anfang = Vortag des Periodenbeginns, Ende = letzter Tag): NK Thema 3, Regel 10; `fuel-stock.service.ts:28-41`.
- Eine Abrechnung pro Mietvertrag: NK Thema 2, Regel 7, PRD Step 4; `statement.service.ts` (`contractId` je Abrechnung).
- Saldo/Rundung: NK Regel 8; `calculation.service.ts:220-223`, `pdf-format.ts:19-20`; `statement-rounding.feature`.
- Verwaltungspauschale (pro Lauf, für alle Verträge, Vereinbarung nicht geprüft, ohne Schlüssel): NK Thema 3, Regel 9, PRD 5.8; `routes/statements.ts:28`, `statement.service.ts` `StatementInput`. PRD-Hilfetext Tab 2 entspricht `settings_fee_suggestion` (`messages/de.json:1041`).

Gruppe 3: Ollama steht in `docs/tech-stack.md:16, 79`; «overdue computed» in `schema.ts` (Kommentar zu `status`). Gruppe 4: Einstellungseintrag «Verwaltungspauschale» auf die Einstellung reduziert. Gruppe 5: Befristet/Unbefristet, Kündigung aufheben, Art.-4-Abs.-3-Teil der Verwaltungspauschale unverändert; bei «Kündigungsfrist» nur der Dwello-Satz entfernt (in #187 auch Gruppe 1), der Rechtsteil ist unverändert. Code-Spalte: «Standard 14» und «Standard» (Korrespondenzkanal) entfernt.

Plan (`implementation_plan.md`): eine Session (38), Ziel, Checkliste, Dateien; «Skills»/«Test red» entfallen, da kein Code geändert; Workflow-Review zu Recht als nicht nötig vermerkt (Workflow 7: keine App-Änderung). Kein Szenario nötig (Dokumentation).

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts`: von mir erneut ausgeführt, grün (4 passed).
- Commit-Gates (fallow, deepcheck, commit-msg): vom Aufrufer gemeldet.
- Rechtliche Richtigkeit der verschobenen Regeln und ob eine Definition ihre Bedeutung geändert hat (z. B. «Stichtag»: «zu Beginn der Abrechnungsperiode» vs. Code «Vortag des Periodenbeginns»): Aufgabe des `fach-reviewer`, Plan-Punkt offen.
- Ob in-App-Hilfetexte (`glossary_*` in `messages/*.json`) eine nun entfernte Glossarregel zitieren: nicht systematisch geprüft (nur `glossary_balance_text` gelesen, stimmt mit Regel 8 überein).
- «um höchstens 2 Rappen» (Regel 8): folgt daraus, dass der Saldo auf Rappen genau ist; `roundTo5Rappen` selbst rundet halbe Schritte (2,5 Rp.) weg von null, das tritt bei Rappenbeträgen nicht auf. Nicht durch einen Test belegt.
