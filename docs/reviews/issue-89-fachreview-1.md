# Fachreview 1: @wip-Szenarien zu #124, #89, #60 (Verwaltungspauschale)

Gegenstand: `git diff 8486d9e 6d844dc` im Worktree `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-89-fach` (Commit 6d844dc): `tests/e2e/features/statement-management-fee.feature`, `contract-new.feature`, `contract-edit.feature`, der Seed in `tests/e2e/fixtures/backend.ts`, der Kommentar in `SettingsStep.svelte` (#60) und die geplante UI aus dem Auftrag. Rollen: Verwalter, Mietrecht (keine Rechtstexte betroffen).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | «Verwaltungspauschale nachträglich vereinbaren» lädt zur einseitigen Einführung neuer Nebenkosten ein; Art. 269d Abs. 3 OR verlangt dafür das amtliche Formular |
| V-1 | Verwalter | Major | Der Vorschlag des Satzes im Abrechnungslauf kommt aus irgendeiner Abrechnung der Periode; nach #89 kann das 0 % (nicht vereinbart) oder ein eigener Satz sein |
| V-2 | Verwalter | Major | Vorschau und Glossar-Hilfe sagen «… % der eigenen Nebenkosten jedes Mieters» und «Den Satz wählen Sie beim Erstellen der Abrechnungen»; nach #89 falsch für Mietverträge mit «Nein» oder eigenem Satz; kein Szenario |
| V-3 | Verwalter | Minor | Höchstsatz-Szenario prüft «1000», nicht den von #124 genannten Tippfehler «30» und nicht die Grenze 10 / 10,01 |
| M-2 | Mietrecht | Minor | Eigener Satz im Mietvertrag über 3 %: kein Hinweis auf den üblichen Richtwert; Art. 4 Abs. 3 VMWG gilt auch für den vereinbarten Satz |
| V-4 | Verwalter | Minor | Kein Szenario für die Liste «mit eigenem Satz» und für den Fall Satz des Abrechnungslaufs 0 % bei Mietvertrag mit eigenem Satz |
| V-5 | Verwalter | Minor | Fachdokumente widersprechen der Entscheidung (Regel 9, Thema-3-Zeile, PRD 5.8); Plan nennt nur Regel 9 |
| V-6 | Verwalter | Minor | Die Migration «bestehende Mietverträge = Nein» deckt kein Test ab (der Seed setzt immer «Ja»); Demo-Daten fallen nach der Migration auf 0 % |
| V-7 | Verwalter | Nit | «Ja, zum Satz des Abrechnungslaufs» ist für den Vermieter ohne Hilfe am Feld schwer zuzuordnen (was steht im Mietvertrag?) |
| V-8 | Verwalter | Nit | «Ja, mit eigenem Satz» mit 0 % ist gleichbedeutend mit «Nein»; unklar, ob erlaubt |
| V-9 | Verwalter | Nit | Detailseite der Abrechnung zeigt bei «Nein» die Zeile «Verwaltungspauschale 0 % der Zwischensumme CHF 0.00», das PDF lässt sie weg |
| V-10 | Verwalter | Nit | Szenario «Ohne Angabe zur Verwaltungspauschale geht es nicht weiter» prüft nur die Meldung, nicht dass der Assistent beim Schritt «Mietzins» bleibt |

## Bestätigt

- **Art. 257a Abs. 2 OR** (Fedlex, SR 220, Stand 1.1.2026, `https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de`): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Die Entscheidung #89 (nur «Ja»-Mietverträge, «Nein» = 0 %, Bestand startet mit «Nein», keine Vorgabe beim Erfassen) setzt das und den Glossareintrag «Nur zulässig, wenn im Mietvertrag vereinbart» (`UBIQUITOUS_LANGUAGE.md:154`) richtig um. Kommentar im Szenario `statement-management-fee.feature` («gilt nur für Mietverträge, in denen sie vereinbart ist (Art. 257a Abs. 2 OR)») stimmt.
- **Art. 4 Abs. 3 VMWG** (Fedlex, SR 221.213.11, Filestore-Fassung Stand 1.6.2020; gleicher Wortlaut im Fedlex-Suchtreffer der aktuellen Fassung `https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de`): «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.» Kein Höchstsatz im Gesetz; der Höchstsatz 10 % (#124) ist eine technische Plausibilitätsgrenze, kein Rechtssatz. Das ist so in Ordnung, solange der Hinweis über 3 % bleibt (bleibt laut #124).
- **#60, Quelle 3 %** (`SettingsStep.svelte:27-28`): Merkblatt Mieterverband 2026 «Zulässige und unzulässige Nebenkosten», S. 4: «Gemäss mehreren kantonalen Gerichtsentscheiden (Luzern, Basel, St. Gallen), aber auch gemäss einer Mitteilung des Bundesamtes für Wohnungswesens (BWO 32 Nr. 12) sind in der Schweiz Pauschalen von höchstens 3% üblich.» Der Code-Kommentar gibt das richtig wieder. Bestätigt.
- **Fehlermeldung #124**: «Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.» entspricht dem heutigen `statements_error_fee` (`messages/de.json:909`) mit «von 0 bis 10» statt «ab 0», wie #124 verlangt. Bestätigt.
- **PDF unverändert**: `backend/src/services/pdf.service.ts:638` druckt die Zeile nur bei `managementFee > 0`, und der Satz kommt je Abrechnung aus `utility_statements.management_fee_percent` (`backend/src/db/schema.ts:378`, `statement-pdf.service.ts:124`). Ein Satz je Mietvertrag lässt sich also ohne PDF-Änderung speichern und zeigen. Bestätigt (sofern `calculation.service.ts:380` den wirksamen Satz des Mietvertrags erhält und speichert).
- **Seed** (`tests/e2e/fixtures/backend.ts`): `managementFeeAgreed: true` als Vorgabe hält die bestehenden Beträge (siehe Nachrechnung). Fachlich zulässig, weil der Seed über die API erfasst, wo die Wahl Pflicht ist; die Migration «Nein» betrifft nur den Bestand (siehe V-6).

### Nachrechnung

Grundlage: Heizkosten 1000 Franken, Fläche 50 m² und 150 m² (Summe 200 m²), ganze Periode 2024, Akonto 0.

| Fall | Anna Keller (50 m²) | Beat Huber (150 m²) |
|------|---------------------|---------------------|
| Zwischensumme | 1000 × 50/200 = 250.00 | 1000 × 150/200 = 750.00 |
| bestehend, beide «Ja», Lauf 3 % | 250.00 + 7.50 = **257.50** (Szenario: 257.50) | 750.00 + 22.50 = **772.50** (Szenario: 772.50) |
| #89: Anna «Nein», Beat eigener Satz 2 %, Lauf 3 % | 250.00 + 0 = **250.00** (Szenario: 250.00) | 750.00 + 15.00 = **765.00** (Szenario: 765.00) |
| Randfall Lauf 0 %, Beat eigener Satz 2 % | 250.00 | 765.00 (eigener Satz geht vor; siehe V-4) |
| Randfall Rückerstattung: Anna Akonto 25.–/Monat = 300.00 | «Nein»: 250.00 − 300.00 = −50.00 (Rückerstattung); «Ja» 3 %: 257.50 − 300.00 = −42.50 | – |
| Randfall Zwischensumme 0, eigener Satz 2 % | – | 0 × 2 % = 0.00, keine Zeile im PDF |

Alle Beträge im Szenario stimmen. Die Rundung (`roundToRappen`, `calculation.service.ts:220`) ändert bei diesen Werten nichts. Ein Mieterwechsel mitten in der Periode ändert an der Regel nichts: Jeder Mietvertrag hat seine eigene Abrechnung (Glossar «Mieterwechsel», `UBIQUITOUS_LANGUAGE.md:45`) und damit seinen eigenen wirksamen Satz. Beispiel nach Tagen 2024 (366 Tage), Wohnung 1.01: Anna bis 30.06. «Nein»: 250 × 182/366 = 124.32, also 124.30; Nachmieter ab 01.07. «Ja» 3 %: 250 × 184/366 = 125.68, also 125.70, plus 3.77, also 3.75 Pauschale. Dafür gibt es kein Szenario. Es braucht aber auch keins, weil die Pauschale pro Abrechnung berechnet wird.

## Befunde

### M-1 (Mietrecht, Major): «nachträglich vereinbaren» und Art. 269d Abs. 3 OR

- Beleg: `tests/e2e/features/contract-edit.feature:101-107`, Szenario «Verwaltungspauschale nachträglich vereinbaren», Schritt «Wenn der Liegenschaftsverwalter die Verwaltungspauschale zum Satz des Abrechnungslaufs vereinbart». Art. 269d Abs. 3 OR (Fedlex, SR 220, Stand 1.1.2026): «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.» Abs. 2: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet; […]».
- Warum falsch: Das Bearbeitungsformular soll nur festhalten, was im Mietvertrag *schon steht* (Nachtrag für den Bestand nach der Migration). Titel und Schritt sagen aber «vereinbaren», also etwas Neues abmachen. Ein unerfahrener Vermieter (Zielgruppe) liest das als Erlaubnis, eine Pauschale während der Mietdauer einseitig einzuführen. Ohne amtliches Formular wäre das nichtig, und Dwello würde sie trotzdem abrechnen.
- Behebung: Szenario umbenennen, z.B. «Vereinbarte Verwaltungspauschale nachtragen», Schritt «… trägt ein, dass im Mietvertrag die Verwaltungspauschale zum Satz des Abrechnungslaufs vereinbart ist». Im Bearbeitungsformular einen sichtbaren Hilfetext am Feld, z.B.: «Wählen Sie, was im unterschriebenen Mietvertrag steht. Eine neue Verwaltungspauschale während der Mietdauer müssen Sie dem Mieter mit dem amtlichen Formular mitteilen (Art. 269d OR).» Der Text gehört vor dem Umsetzen in den Fachreview (vier Sprachen).

### V-1 (Verwalter, Major): Vorschlag des Satzes aus einer beliebigen Abrechnung der Periode

- Beleg: `src/routes/statements/generate/+page.server.ts:36-40` lädt `statements?…&limit=1` (eine beliebige Abrechnung der Periode). `:58-60` übernimmt `pick?.other?.managementFeePercent` als Satz des Laufs. Der Hinweis dazu: `statements_preset_from_statements` («Heizprofil und Verwaltungspauschale sind wie die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode eingestellt», `messages/de.json:1403`).
- Warum falsch: Nach #89 speichert jede Abrechnung den *wirksamen* Satz ihres Mietvertrags (0 % bei «Nein», 2 % bei eigenem Satz). Erwischt der Vorschlag die Abrechnung von Anna («Nein»), schlägt der Assistent für die übrigen Mietverträge 0 % vor. Erwischt er Beat (2 %), schlägt er 2 % vor. Der Hinweis behauptet trotzdem «wie die übrigen eingestellt». Die Mieter mit «Ja, zum Satz des Abrechnungslaufs» bekommen dann ohne Warnung einen falschen Satz. Der Fall tritt genau beim Nachholen einzelner Abrechnungen auf (Link «fehlende Abrechnung», Nachmieter).
- Behebung: Den Satz des Abrechnungslaufs getrennt vom wirksamen Satz speichern (z.B. `run_management_fee_percent` an der Abrechnung) und den Vorschlag daraus nehmen. Oder den Vorschlag nur aus einer Abrechnung nehmen, deren Mietvertrag «Ja, zum Satz des Abrechnungslaufs» hat, und sonst aus den Einstellungen. Szenario in `statement-management-fee.feature`: Anna «Nein», Abrechnung für Anna mit 3 % erstellt, dann Abrechnung für den Nachmieter/Beat über den Link öffnen → der Assistent schlägt 3 % vor, nicht 0 %.

### V-2 (Verwalter, Major): Texte, die nach #89 falsch werden, ohne Szenario

- Beleg: Vorschau `src/routes/statements/generate/PreviewStep.svelte:66-69` zeigt `statements_fee_of_own` = «{percent} % der eigenen Nebenkosten jedes Mieters» (`messages/de.json:1076`). Bestehendes Szenario «Die Vorschau nennt die Verwaltungspauschale» (`statement-management-fee.feature:30-32`) verlangt genau «4.5 % der eigenen Nebenkosten jedes Mieters». Weiter: `glossary_fee_text` («Den Satz wählen Sie beim Erstellen der Abrechnungen», `:98`), `config_help_management_fee` (`:1125`), `statements_fee_help` («gilt für alle Abrechnungen dieses Laufs … Hat ein Mietvertrag einen anderen Satz, löschen Sie danach seinen Entwurf …», `:1067`). Der Plan (`implementation_plan.md`, Punkt «help texts») nennt nur `statements_fee_help`.
- Warum falsch: Bei Anna «Nein» und Beat 2 % sagt die Vorschau «3 % … jedes Mieters», tatsächlich 0 % und 2 %. Der Vermieter prüft in der Vorschau, was er verschickt; die Aussage ist dort sachlich falsch. Das Glossar sagt, der Satz werde nur beim Erstellen gewählt, und unterschlägt die Wahl am Mietvertrag.
- Behebung: Vorschau z.B. «3 % der eigenen Nebenkosten für Mietverträge mit vereinbarter Verwaltungspauschale; Mietverträge mit eigenem Satz und ohne Vereinbarung siehe Schritt «Einstellungen»» oder eine Zeile je abweichendem Mietvertrag. Bestehendes Szenario anpassen und eines mit «Nein» ergänzen. `glossary_fee_text`, `config_help_management_fee`, `statements_fee_help` in den Plan aufnehmen und als Wortlaut dem Fachreview vorlegen (siehe «Nicht bestätigt»).

### V-3 (Verwalter, Minor): Höchstsatz-Szenario prüft die falsche Eingabe

- Beleg: `statement-management-fee.feature:46-51` tippt «1000» ein. Kommentar: «fängt auch Tippfehler wie 1000 statt 10 ab». #124 «Decided»: «it also catches typos such as 30 for 3».
- Warum falsch: «1000» würde auch eine Grenze bei 100 abweisen. Das Szenario zeigt also nicht, dass die entschiedene Grenze 10 gilt, und nicht den Tippfehler, den der Product Owner nennt.
- Behebung: Szenariogrundriss mit «30» und «10,01» (abgewiesen) und Szenario oder Beispiel «10» (angenommen, kein Feldfehler, Hinweis über 3 % erscheint). Kommentar auf «30 statt 3» ändern.

### M-2 (Mietrecht, Minor): Eigener Satz über 3 % ohne Hinweis

- Beleg: Geplante UI «Eigener Satz» 0–10 im Mietvertragsformular. Szenario `contract-new.feature` «Verwaltungspauschale mit eigenem Satz prüfen» mit 4 % zeigt nur «Vereinbart, 4 %». Hinweis über 3 % gibt es nur im Assistenten (`SettingsStep.svelte:98`). Glossar: «Ein höherer Satz muss dem tatsächlichen Aufwand entsprechen (Art. 4 Abs. 3 VMWG)». MV-Merkblatt 2026: «Zu hohe prozentuale Ansätze muss die Mieterschaft nicht akzeptieren.»
- Warum falsch: Ein im Mietvertrag vereinbarter Satz über dem üblichen Ansatz ist nach Art. 4 Abs. 3 VMWG nur nach Aufwand haltbar. Dwello wendet den eigenen Satz still an, und der Lauf-Hinweis greift nicht, wenn der Lauf 3 % hat.
- Behebung: Denselben Hinweis (`statements_fee_above_*`) am Feld «Eigener Satz» zeigen und im Schritt «Einstellungen» bei der Liste der Mietverträge mit eigenem Satz über 3 %. Ein Unit- oder DOM-Test reicht.

### V-4 (Verwalter, Minor): Liste «mit eigenem Satz» und Lauf 0 % ohne Szenario

- Beleg: Geplante UI listet im Schritt «Einstellungen» auch die Mietverträge mit eigenem Satz. Szenario «Der Assistent nennt die Mietverträge ohne vereinbarte Verwaltungspauschale» (`statement-management-fee.feature:63-67`) prüft nur «Nein».
- Warum: Der eigene Satz geht dem Lauf vor. Wer den Lauf auf 0 % setzt («dieses Jahr keine Pauschale»), belastet Beat trotzdem 2 % (Nachrechnung oben). Nur die Liste macht das sichtbar.
- Behebung: Im Szenario einen Schritt ergänzen: «Und nennt der Assistent den Mietvertrag von "Beat Huber" mit eigenem Satz 2 %» (mit `Angenommen … von 2 % vereinbart`). API-Beispiel mit Lauf 0 %: Anna 250.00, Beat 765.00.

### V-5 (Verwalter, Minor): Fachdokumente widersprechen der Entscheidung

- Beleg: `docs/nebenkostenabrechnung-anforderungen.md:59` («Rechtlich nur, wenn im Mietvertrag vereinbart; Dwello prüft das nicht: Der Satz … gilt für alle Mietverträge des Laufs», «keine Sperre»), `:149` (Regel 9, gleiche Aussage), `docs/PRD-Dwello.md:472` («a higher agreed percentage is applied as set», jetzt höchstens 10 %), `:1854` («up to 3% of total costs»: falsche Grundlage, die Grundlage sind die eigenen Nebenkosten; Fehler bestand schon vorher). Plan: nur «requirements doc rule 9».
- Behebung: Zeile 59, Regel 9 und PRD 5.8 (Höchstsatz 10 %, Vereinbarung je Mietvertrag, eigener Satz geht vor, «Nein» = 0 %) im selben Change nachführen. `UBIQUITOUS_LANGUAGE.md` darf nur der Product Owner ändern, siehe «Fehlende Begriffe».

### V-6 (Verwalter, Minor): Migration «Nein» ungetestet, Demo-Daten

- Beleg: Seed `tests/e2e/fixtures/backend.ts` setzt immer `managementFeeAgreed: true`. Es gibt kein Szenario und keinen geplanten Test, der den Bestand nach der Migration zeigt. `backend/src/db/demo-data.ts` nennt keine Pauschale.
- Warum: Die Entscheidung «Existing contracts start with «nein»» ist die folgenreichste Regel (alle bisherigen Mieter bekommen ab dem nächsten Lauf 0 %), aber sie ist nirgends abgesichert. Die Demo (`dev:demo`, Personas) zeigt nach der Migration nur noch 0 %-Abrechnungen und damit weder die Pauschale noch den Hinweis im Assistenten realistisch.
- Behebung: `*.pg.test.ts` zur Migration (bestehender Mietvertrag → nicht vereinbart, eigener Satz leer; bestehende Abrechnungen unverändert). Demo-Daten mit je einem Mietvertrag «Ja», «Ja, eigener Satz» und «Nein».

### V-7 (Verwalter, Nit): «Satz des Abrechnungslaufs» am Mietvertrag

- Beleg: Geplante Optionen «Ja, zum Satz des Abrechnungslaufs» / «Ja, mit eigenem Satz», Anzeige «Vereinbart, Satz des Abrechnungslaufs».
- Warum: In Schweizer Mietverträgen steht meist «Verwaltungskosten / Verwaltungsaufwand Nebenkostenabrechnung» ohne Satz, oder ein fester Prozentsatz (z.B. «3 % der Nebenkosten»). Der Vermieter muss erkennen, welche Option zu welchem Vertragstext passt; «Abrechnungslauf» kennt er beim Erfassen des Mietvertrags noch nicht.
- Behebung: Hilfetext am Feld, z.B.: «Steht im Mietvertrag ein Prozentsatz, wählen Sie «Ja, mit eigenem Satz» und tragen ihn ein. Steht dort nur, dass Verwaltungskosten verrechnet werden, wählen Sie «Ja, zum Satz des Abrechnungslaufs»: Den Satz wählen Sie dann beim Erstellen der Abrechnungen. Steht nichts dazu, wählen Sie «Nein».»

### V-8 (Verwalter, Nit): Eigener Satz 0 %

- Beleg: Geplanter Bereich «Eigener Satz» 0–10.
- Warum: «Ja, mit eigenem Satz 0 %» ist fachlich «Nein». Die Liste im Assistenten würde den Mietvertrag dann aber nicht unter «ohne vereinbarte Verwaltungspauschale» nennen.
- Behebung: Eigenen Satz grösser als 0 verlangen (Feldfehler) oder 0 wie «Nein» behandeln und anzeigen. Entscheid offen: Issue mit `entscheiden`, falls der Product Owner das nicht im Review klärt.

### V-9 (Verwalter, Nit): Detailseite und PDF unterschiedlich bei 0 %

- Beleg: `src/routes/statements/[id]/CostTable.svelte:83-90` zeigt die Zeile immer. `pdf.service.ts:638` lässt sie bei 0 weg.
- Warum: Bisher war 0 % selten. Nach der Migration ist es der Normalfall für den Bestand. Der Vermieter sieht in der App «0 % der Zwischensumme CHF 0.00», der Mieter im PDF nichts. Das ist kein Fehler, besser wäre aber «Nicht vereinbart».
- Behebung: Bei Pauschale 0 auf der Detailseite «Verwaltungspauschale: im Mietvertrag nicht vereinbart» oder die Zeile wie im PDF weglassen.

### V-10 (Verwalter, Nit): Pflichtwahl-Szenario

- Beleg: `contract-new.feature:101-103`, nur «Dann sieht … die Fehlermeldung».
- Behebung: «Und bleibt der Assistent beim Schritt «Mietzins»» ergänzen, analog `statement-management-fee.feature:51`.

## Fehlende Begriffe (Issue mit Labels `fachlich`, `entscheiden`)

`UBIQUITOUS_LANGUAGE.md` hat im Abschnitt «Mietvertrag» (`:31-51`) kein Feld zur Verwaltungspauschale. «Satz des Abrechnungslaufs», «Eigener Satz» und «Höchstsatz» fehlen. Vorschlag:

| Begriff | Vorschlag Definition | Code |
|---------|----------------------|------|
| **Vereinbarte Verwaltungspauschale** (Abschnitt Mietvertrag) | Ob im Mietvertrag eine Verwaltungspauschale vereinbart ist: «Ja, zum Satz des Abrechnungslaufs», «Ja, mit eigenem Satz» oder «Nein». Beim Erfassen Pflichtwahl, ohne Vorgabe; bestehende Mietverträge «Nein», bis der Liegenschaftsverwalter einträgt, was im Mietvertrag steht. Neu einführen während der Mietdauer nur mit amtlichem Formular (Art. 269d Abs. 3 OR). | `management_fee_agreed`, `management_fee_percent` (`rental_contracts`) |
| **Eigener Satz** | Prozentsatz der Verwaltungspauschale, der im Mietvertrag steht; geht dem Satz des Abrechnungslaufs vor. 0 bis 10 %. | `rental_contracts.management_fee_percent` |
| **Satz des Abrechnungslaufs** | Satz der Verwaltungspauschale, den der Liegenschaftsverwalter im Abrechnungslauf wählt (Vorschlag aus den Einstellungen); gilt für Mietverträge mit «Ja, zum Satz des Abrechnungslaufs». 0 bis 10 %. | Wizard «Abrechnungen erstellen» |
| Ergänzung **Verwaltungspauschale** (`:154`) | «… Nur zulässig, wenn im Mietvertrag vereinbart (vereinbarte Verwaltungspauschale; sonst 0 %). Höchstens 10 % (Plausibilitätsgrenze, kein Rechtssatz).» | – |
| Ergänzung **Abrechnungslauf** (`:149`) | «… mit Heizprofil und Satz der Verwaltungspauschale (für Mietverträge mit vereinbarter Verwaltungspauschale ohne eigenen Satz).» | – |

Nebenbei: Glossar `:154` sagt «Üblich sind etwa 3 %», die UI und #60 «bis 3 %». Das bestand schon vorher, und nur der Product Owner darf es ändern; bei Gelegenheit angleichen.

## Nicht bestätigt

- **Ob die Verwaltungspauschale eigens im Mietvertrag genannt sein muss**, oder ob eine Nebenkostenabrede «nach Abrechnung» die Verwaltungskosten nach Art. 4 Abs. 3 VMWG schon einschliesst: Der Gesetzeswortlaut (Art. 257a Abs. 2 OR, Art. 4 Abs. 3 VMWG, oben zitiert) entscheidet das nicht ausdrücklich. Das Glossar und #89 verlangen die Vereinbarung, das MV-Merkblatt 2026 schweigt dazu (S. 4 nur «nach Aufwand oder nach ortsüblichen Sätzen»). **unsicher**. Für Dwello ist die strengere Lesart die sichere, die Entscheidung bleibt deshalb unberührt. Gesucht: `mmx search` zu Art. 257a/Art. 4 VMWG, Fedlex-Filestore OR und VMWG, MV-Merkblatt 2026.
- **Art. 4 Abs. 3 VMWG «nach Aufwand»**: Dwello kennt nur Prozentsätze (Entscheid #89: keine andere Basis). Abrechnung nach Aufwand (fester Betrag) bleibt unmöglich. Das ist kein Rechtsverstoss, nur eine Einschränkung. Nicht weiter geprüft.
- **VMWG-Fassung**: Den Volltext konnte ich nur als Fedlex-Filestore-Fassung «Stand am 1. Juni 2020» laden (neuere Konsolidierungsdaten liefern nur die JS-Seite). Der Wortlaut von Art. 4 Abs. 3 stimmt mit dem Fedlex-Suchtreffer der aktuellen Seite überein; eine spätere Änderung von Art. 4 ist mir nicht bekannt, aber nicht geprüft.
- **Neue Texte**: Hilfetext am Mietvertragsfeld, neuer `statements_fee_help`, Vorschautext, Liste im Schritt «Einstellungen» (fr/it/en) liegen noch nicht als Wortlaut vor. Ich habe nur die deutschen Beispiele aus dem Auftrag geprüft (Optionen, Fehlermeldung, Anzeige «Vereinbart, 4 %» / «Nicht vereinbart», Liste «Ohne vereinbarte Verwaltungspauschale (0 %): …»): fachlich in Ordnung bis auf V-7. Die Wortlaute gehören in den Feature-Review (Schritt 5).
- **API-Verhalten ohne Angabe**: Ob `POST /contracts` ohne `managementFeeAgreed` abgewiesen wird (Pflichtwahl auch auf der API) oder still eine Vorgabe setzt, geht aus den Szenarien nicht hervor. Fachlich soll keine stille Vorgabe gelten. Nicht prüfbar vor der Umsetzung.
- **Hinweis «Höchstsatz»**: Das Wort steht nur im Szenario-Titel und -Kommentar; ob die UI es zeigt, ist offen (siehe Fehlende Begriffe).
