# Fachreview 521-1: Brief «Zustimmung zu einer neuen Abrechnungsperiode» (@wip-Szenario, vor der Umsetzung)

Gegenstand: `tests/e2e/features/contract-detail.feature:331-345` (Commit 4e77ba5, Worktree `/tmp/scratchpad/review-521-fach-reviewer`), Entscheid #521, Hinweistext `statements_short_period_help` (`MissingStatement.svelte:78-83`, `OverlapWays.svelte:39-44`).
Fedlex: OR (SR 220) Stand 1. Oktober 2026, DE/FR/IT; VMWG (SR 221.213.11) Stand 1. Oktober 2025, DE.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Den Hinweis zur kurzen Abrechnungsperiode zeigt Dwello auch ohne frühere Abrechnungsperiode (Lücke in derselben Periode). Dann hat der Brief keine bisherige Periode. |
| V-2 | Verwalter | Major | Der Hinweis steht auch im Abrechnungsassistenten (`OverlapWays`); dort fehlen Link und Szenario. |
| M-1 | Mietrecht | Major | Eine einzige Unterschriftszeile für den Mieter genügt nicht: Es fehlen alle Mieter des Mietvertrags und die Unterschrift des Vermieters. |
| M-2 | Mietrecht | Major | Freiwilligkeit fehlt im Plan und im Szenario; Schweigen darf nicht als Zustimmung gelten, auch nicht mit Antwortfrist. |
| V-3 | Verwalter | Minor | Endet der Mietvertrag spätestens am letzten Tag der kurzen Periode, gibt es für ihn keine erste neue Periode. Fix: Absatz und Satzteil «erstmals …» weglassen (Unit-Test). |
| V-4 | Verwalter | Minor | Der Brief nennt den Mietvertrag nicht (Wohnungsnummer, Adresse); im Szenario nur der Name. Fix: Zeile «Mietvertrag für die Wohnung 2.01, …» und Szenariozeile. |
| V-5 | Verwalter | Minor | Begriff uneinheitlich: Schritte und Ziel sagen «Vorlage», das PDF ist ein Brief. Fix: «Brief zur Zustimmung» in Schritten, Ziel und Szenariotitel (contract-detail.steps.ts:547-554, targets:66-69). |
| V-6 | Verwalter | Minor | `steht im PDF "Unterschrift"` trifft auch den Satz «Ohne Ihre Unterschrift …» und prüft so keine Unterschriftszeile. Fix: «Ort, Datum» und «Unterschrift weiterer Mieter» prüfen (Abschnitt 4). |

## V-1 (Major): kein Brief ohne frühere Abrechnungsperiode

**Beleg:** Das Szenario «Teilweise abgerechnete Periode am Mietvertrag» (contract-detail.feature:280-287) hat die Abrechnung 01.04.2024–30.09.2024 und die kurze Periode 01.10.2024–31.12.2024. Der Rat (#486) erscheint dort auch. Die Einstellung «Abrechnungsperiode» hat nie gewechselt, also hat `earlierType()` (`backend/src/services/accounting-period.ts:79-86`) keinen früheren Typ: 01.04.–30.09. ist keine ganze Periode.
**Warum falsch:** Der Entscheid verlangt die bisherige und die neue Abrechnungsperiode. Hier gibt es keine bisherige. Ein Brief «bisher vom 1. Januar bis 31. Dezember, neu vom 1. Januar bis 31. Dezember» oder einer mit erfundener alter Periode ist für den Mieter irreführend.
**Fix:** Der Link erscheint nur, wenn Dwello einen früheren Typ kennt, der von der Einstellung abweicht: `earlierType(...)` ist nicht null und sein `type` ist nicht die Einstellung. Der Typ kommt aus dem gespeicherten Wechsel oder aus der letzten ganzen Abrechnung des Gebäudes nach einem anderen Typ (#512). Zugleich beginnt die kurze Periode am Tag `switched`. Das Backend lehnt die anderen Fälle mit einem Code ab (`coded-error.ts`). Dazu ein Unit-Test sowie ein neues Szenario «Ohne Wechsel der Abrechnungsperiode bietet der Mietvertrag keinen Brief zur Zustimmung an» mit dem Aufbau von Zeile 281. Ein neues Szenario ist frei; eine Zeile im bestehenden wäre eine Spezifikationsänderung.

## V-2 (Major): auch im Abrechnungsassistenten

**Beleg:** `OverlapWays.svelte:39-44` zeigt `statements_short_period_help` pro Gebäude. Der Entscheid lautet «reachable from the help text at the short period», Done means «for each Mietvertrag of the building».
**Warum:** Im Assistenten rechnet der Vermieter die kurze Periode ab. Die Zustimmung gehört vor diese Abrechnung. Wer vom Assistenten zu jedem Mietvertrag wechseln muss, um den Brief zu holen, findet ihn dort nicht.
**Fix:** In `OverlapWays` unter dem Hinweistext je ein Ghost-Link pro Mietvertrag des Gebäudes mit Mietstagen in der kurzen Periode, ohne Mietverträge, deren «Abgerechnet bis» bis zum Ende der kurzen Periode reicht. Benannt nach Mieter und Wohnungsnummer (Text unten). Die Regel von V-1 gilt auch hier. Dazu ein `@wip`-Szenario in `statement-generate.feature` und ein Eintrag pro neuem Zustand in `screens.json`.

## M-1 (Major): Unterschriften aller Mieter und des Vermieters

**Beleg:** Art. 16 OR (Stand 1.10.2026): «Ist für einen Vertrag, der vom Gesetze an keine Form gebunden ist, die Anwendung einer solchen vorbehalten worden, so wird vermutet, dass die Parteien vor Erfüllung der Form nicht verpflichtet sein wollen. Geht eine solche Abrede auf schriftliche Form ohne nähere Bezeichnung, so gelten für deren Erfüllung die Erfordernisse der gesetzlich vorgeschriebenen Schriftlichkeit.» Art. 13 Abs. 1 OR: «Ein Vertrag, für den die schriftliche Form gesetzlich vorgeschrieben ist, muss die Unterschriften aller Personen tragen, die durch ihn verpflichtet werden sollen.» Art. 1 Abs. 1 OR: «Zum Abschlusse eines Vertrages ist die übereinstimmende gegenseitige Willensäusserung der Parteien erforderlich.»
**Warum:** Mietverträge in der Schweiz behalten Änderungen fast immer der Schriftform vor. Dann bindet die Änderung erst mit den Unterschriften aller Verpflichteten. Das sind alle Mieter des Mietvertrags (Dwello führt nur einen Mieter pro Mietvertrag, `rental_contracts.tenant_id`) und der Vermieter. Der Mahnungsbrief (`reminder-pdf.ts:44`) setzt den Firmennamen direkt unter «Freundliche Grüsse», ohne Platz für eine Unterschrift.
**Fix:** Über dem Firmennamen Platz für die handschriftliche Unterschrift des Vermieters. Im Abschnitt «Zustimmung» Zeilen für «Ort, Datum», «Unterschrift {Mieter}» und «Unterschrift weiterer Mieter», dazu der Satz, dass alle Mieter unterschreiben (Texte unten).

## M-2 (Major): Zustimmung freiwillig, Schweigen ist keine Zustimmung

**Beleg:** Art. 6 OR: «Ist wegen der besonderen Natur des Geschäftes oder nach den Umständen eine ausdrückliche Annahme nicht zu erwarten, so gilt der Vertrag als abgeschlossen, wenn der Antrag nicht binnen angemessener Frist abgelehnt wird.» Hier ist eine ausdrückliche Annahme (Unterschrift) zu erwarten. Art. 271a Abs. 1 lit. b OR: Die Kündigung ist anfechtbar, wenn sie ausgesprochen wird, «weil der Vermieter eine einseitige Vertragsänderung zu Lasten des Mieters oder eine Mietzinsanpassung durchsetzen will». Art. 269d Abs. 2 lit. c OR: nichtig, wenn der Vermieter «mit der Mitteilung die Kündigung androht oder ausspricht».
**Warum:** Ein Brief mit Antwortfrist liest sich leicht wie «ohne Antwort gilt Ihre Zustimmung». Das wäre unwirksam, und es setzt den Mieter unter Druck.
**Fix:** Der Brief sagt, dass die Zustimmung freiwillig ist und dass er ohne Unterschrift nichts am Mietvertrag ändert. Er erwähnt weder das amtliche Formular noch eine Kündigung: Das wäre Druck. Dieser Weg steht für den Vermieter im Hinweistext. Szenariozeile in Abschnitt 4.

## 1. Inhalt des Briefs

- **Absender:** Firmenadresse (`company_name`, `company_address`, `company_postal_code`, `company_city`), wie bei der Mahnung (`reminder.service.ts:50-56`).
- **Empfänger:** der Mieter des Mietvertrags mit Korrespondenzadresse im Fenster rechts, wie bei der Mahnung (`renderReminderPdf`). Sprache: die Sprache des Mieters.
- **Ort, Datum:** Ort der Firmenadresse und Tag des Herunterladens.
- **Betreff:** «Zustimmung zu einer neuen Abrechnungsperiode». Darunter: «Mietvertrag für die Wohnung {Wohnungsnummer}, {Adresse des Gebäudes}, {PLZ} {Ort}» (V-4).
- **Bisherige Abrechnungsperiode:** der frühere Typ aus `earlierType()` (#512), also aus dem gespeicherten Wechsel oder aus der letzten ganzen Abrechnung des Gebäudes nach einem anderen Typ. Als Tag und Monat ohne Jahr, z.B. «1. Juli bis 30. Juni». Der Brief sagt «bisher haben wir … abgerechnet», nicht «Ihr Mietvertrag sieht vor»: Den Vertragstext kennt Dwello nicht.
- **Neue Abrechnungsperiode:** die Einstellung «Abrechnungsperiode», gleich formatiert, z.B. «1. Januar bis 31. Dezember». Als Grund nennt der Brief, dass sie für alle Mietverträge des Gebäudes gilt (Glossar «Kurze Abrechnungsperiode»).
- **Kurze Abrechnungsperiode:** der Weg `short` des Mietvertrags (`missingWays`), bei dem der Hinweis steht (`firstShort`), als «01.07.2025 – 31.12.2025». Abgerechnet wird sie in einer eigenen Nebenkostenabrechnung mit den Kosten dieser Tage. Die Akontobeiträge dieser Monate werden verrechnet (Glossar «Gültig ab (Akonto)»: «zählt jeden Betrag für seine Monate»). VMWG Art. 4 Abs. 1: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Eine kürzere Periode hält das ein.
- **Erste neue Periode:** die Periode der Einstellung ab dem Tag nach dem Ende der kurzen Periode, als «01.01.2026 – 31.12.2026». Sie entfällt, wenn der Mietvertrag spätestens am Ende der kurzen Periode endet (V-3).
- **Wozu der Mieter zustimmt:** dass die Nebenkosten seines Mietvertrags nach der kurzen Periode jeweils nach der neuen Periode abgerechnet werden, erstmals für die erste neue Periode. Alle übrigen Bestimmungen bleiben unverändert, ausdrücklich auch die Akontobeiträge.
- **Antwortfrist:** «bis {Datum}», Datum des Briefs plus 30 Tage (Praxis, keine gesetzliche Frist). Ohne Antwort gilt nichts als vereinbart (M-2).
- **Mehrere Mieter:** Alle Mieter des Mietvertrags unterschreiben (M-1). Dwello kennt nur einen; dazu eine zweite Zeile «Unterschrift weiterer Mieter».
- **Freiwilligkeit:** Satz im Brief (M-2). Den Weg ohne Zustimmung (amtliches Formular, Art. 269d Abs. 1 und 3 OR) nennt nur der Hinweistext. Der heutige Text erfüllt den Entscheid «the help text names it»: Er spricht vom amtlichen Formular (FR «formule officielle», IT «modulo prescritto», wie Art. 269d Abs. 2 lit. a OR); keine Änderung nötig.
- **Unterschriften:** Platz für die Unterschrift des Vermieters über dem Firmennamen. Darunter der Abschnitt «Zustimmung» mit Erklärung, «Ort, Datum», «Unterschrift {Mieter}», «Unterschrift weiterer Mieter».
- **Rückwirkung:** In der Ausgangslage ist die kurze Periode schon vorbei (Stand 1.11.2026). Der Text ist deshalb zeitneutral («erhalten Sie eine Nebenkostenabrechnung über …»), ohne «ab sofort».

Formeln, nachgerechnet:
- Juli–Juni nach Kalenderjahr: letzte Abrechnung 01.07.2024–30.06.2025, kurze Periode 01.07.2025–31.12.2025, erste neue 01.01.2026–31.12.2026 (Szenario).
- Kalenderjahr nach Juli–Juni: letzte Abrechnung 01.01.2024–31.12.2024, kurze Periode 01.01.2025–30.06.2025, erste neue 01.07.2025–30.06.2026; bisher «1. Januar bis 31. Dezember», neu «1. Juli bis 30. Juni».
- November–Oktober nach Kalenderjahr: letzte Abrechnung 01.11.2023–31.10.2024, kurze Periode 01.11.2024–31.12.2024 (zwei Monate), erste neue 01.01.2025–31.12.2025.
- Randfall Vertragsende 30.09.2025 im ersten Fall: Brief ohne erste neue Periode (V-3).
- Randfall Vertragsbeginn 01.10.2025: kurze Periode bleibt die des Gebäudes (01.07.–31.12.2025), die Mietstage zählen erst ab 01.10.
- Randfall ohne Wechsel (Zeile 281): kein Brief (V-1).

## 2. Wortlaut

Platzhalter: {old}/{new} sind Tag und Monat nach Typ, {short}/{first} sind Datumsbereiche «dd.mm.yyyy – dd.mm.yyyy» in allen Sprachen, {reply} ist ein Datum dd.mm.yyyy, {apartment} die Wohnungsnummer, {address} «Adresse, PLZ Ort» des Gebäudes, {tenant} Vor- und Nachname. Gruss und Schluss aus `greetingWords()`. Französisch: geschütztes Leerzeichen vor «:».

| key | de | fr | it | en |
|---|---|---|---|---|
| consent.calendar | 1. Januar bis 31. Dezember | 1er janvier au 31 décembre | 1° gennaio al 31 dicembre | 1 January to 31 December |
| consent.july-june | 1. Juli bis 30. Juni | 1er juillet au 30 juin | 1° luglio al 30 giugno | 1 July to 30 June |
| consent.november-october | 1. November bis 31. Oktober | 1er novembre au 31 octobre | 1° novembre al 31 ottobre | 1 November to 31 October |
| consent.title | Zustimmung zu einer neuen Abrechnungsperiode | Accord sur une nouvelle période de décompte | Consenso a un nuovo periodo di conteggio | Agreement to a new billing period |
| consent.contract | Mietvertrag für die Wohnung {apartment}, {address} | Contrat de bail pour l’appartement {apartment}, {address} | Contratto di locazione per l’appartamento {apartment}, {address} | Rental contract for apartment {apartment}, {address} |
| consent.change | bisher haben wir die Nebenkosten jeweils vom {old} abgerechnet. Für alle Mietverträge im Gebäude rechnen wir sie neu jeweils vom {new} ab. | Jusqu’ici, nous avons établi le décompte des frais accessoires chaque année du {old}. Désormais, nous l’établissons pour tous les contrats de bail de l’immeuble chaque année du {new}. | Finora abbiamo allestito il conteggio delle spese accessorie ogni anno dal {old}. Ora lo allestiamo per tutti i contratti di locazione dell’immobile ogni anno dal {new}. | So far, we have billed the utility costs each year from {old}. We now bill them for all rental contracts in the building each year from {new}. |
| consent.short | Für die Tage dazwischen erhalten Sie eine Nebenkostenabrechnung über die kurze Abrechnungsperiode {short}. Darin verrechnen wir die Akontobeiträge dieser Monate. | Pour la période intermédiaire, vous recevrez un décompte des charges pour la période de décompte courte {short}. Les acomptes de ces mois y sont imputés. | Per il periodo intermedio riceverà un conteggio spese accessorie per il periodo di conteggio breve {short}, nel quale compensiamo gli acconti di questi mesi. | For the days in between, you will receive a utility cost statement for the short billing period {short}. It sets off the advance payments for those months. |
| consent.first | Die erste neue Abrechnungsperiode ist {first}. | La première nouvelle période de décompte couvre {first}. | Il primo nuovo periodo di conteggio è {first}. | The first new billing period is {first}. |
| consent.voluntary | Alle übrigen Bestimmungen Ihres Mietvertrags bleiben gleich, auch die Akontobeiträge. Ihre Zustimmung ist freiwillig. Ohne Ihre Unterschrift ändert dieses Schreiben an Ihrem Mietvertrag nichts. | Toutes les autres clauses de votre contrat de bail restent inchangées, y compris les acomptes. Votre accord est facultatif. Sans votre signature, la présente lettre ne modifie en rien votre contrat de bail. | Tutte le altre disposizioni del suo contratto di locazione restano invariate, compresi gli acconti. Il suo consenso è facoltativo. Senza la sua firma, la presente lettera non modifica il suo contratto di locazione. | All other terms of your rental contract stay the same, including the advance payments. Your agreement is voluntary. Without your signature, this letter does not change your rental contract. |
| consent.reply | Sind Sie einverstanden, unterschreiben Sie bitte unten und senden Sie uns dieses Schreiben bis {reply} zurück. Haben mehrere Personen den Mietvertrag als Mieter unterschrieben, unterschreiben bitte alle. Behalten Sie eine Kopie für Ihre Unterlagen. | Si vous êtes d’accord, veuillez signer ci-dessous et nous retourner la présente lettre au plus tard le {reply}. Si plusieurs personnes ont signé le contrat de bail en tant que locataires, toutes doivent signer. Conservez une copie pour vos dossiers. | Se è d’accordo, firmi qui sotto e ci rispedisca la presente lettera entro il {reply}. Se più persone hanno firmato il contratto di locazione come inquilini, devono firmare tutte. Conservi una copia per i suoi documenti. | If you agree, please sign below and return this letter to us by {reply}. If several people signed the rental contract as tenants, all of them must sign. Keep a copy for your records. |
| consent.heading | Zustimmung | Accord | Consenso | Agreement |
| consent.clause | Mit ihrer Unterschrift stimmen die Mieter zu, dass die Nebenkosten des Mietvertrags für die Wohnung {apartment}, {address}, nach der kurzen Abrechnungsperiode {short} jeweils vom {new} abgerechnet werden, erstmals für {first}. Alle übrigen Bestimmungen des Mietvertrags bleiben unverändert. | Par leur signature, les locataires acceptent que le décompte des frais accessoires du contrat de bail pour l’appartement {apartment}, {address}, soit établi, après la période de décompte courte {short}, chaque année du {new}, la première fois pour {first}. Toutes les autres clauses du contrat de bail restent inchangées. | Con la loro firma gli inquilini accettano che il conteggio delle spese accessorie del contratto di locazione per l’appartamento {apartment}, {address}, sia allestito, dopo il periodo di conteggio breve {short}, ogni anno dal {new}, la prima volta per {first}. Tutte le altre disposizioni del contratto di locazione restano invariate. | By signing, the tenants agree that, after the short billing period {short}, the utility costs of the rental contract for apartment {apartment}, {address}, are billed each year from {new}, for the first time for {first}. All other terms of the rental contract remain unchanged. |
| consent.clauseEnding (V-3) | Mit ihrer Unterschrift stimmen die Mieter zu, dass die Nebenkosten des Mietvertrags für die Wohnung {apartment}, {address}, für die kurze Abrechnungsperiode {short} abgerechnet werden. Alle übrigen Bestimmungen des Mietvertrags bleiben unverändert. | Par leur signature, les locataires acceptent que le décompte des frais accessoires du contrat de bail pour l’appartement {apartment}, {address}, soit établi pour la période de décompte courte {short}. Toutes les autres clauses du contrat de bail restent inchangées. | Con la loro firma gli inquilini accettano che il conteggio delle spese accessorie del contratto di locazione per l’appartamento {apartment}, {address}, sia allestito per il periodo di conteggio breve {short}. Tutte le altre disposizioni del contratto di locazione restano invariate. | By signing, the tenants agree that the utility costs of the rental contract for apartment {apartment}, {address}, are billed for the short billing period {short}. All other terms of the rental contract remain unchanged. |
| consent.placeDate | Ort, Datum | Lieu, date | Luogo, data | Place, date |
| consent.signature | Unterschrift {tenant} | Signature {tenant} | Firma {tenant} | Signature {tenant} |
| consent.signatureOther | Unterschrift weiterer Mieter | Signature d’autres locataires | Firma di altri inquilini | Signature of other tenants |
| contracts_consent_letter_download | Brief zur Zustimmung herunterladen | Télécharger la lettre d’accord | Scaricare la lettera di consenso | Download the agreement letter |
| statements_consent_letter_download_of | Brief zur Zustimmung herunterladen: {tenant}, Wohnung {apartment} | Télécharger la lettre d’accord : {tenant}, appartement {apartment} | Scaricare la lettera di consenso: {tenant}, appartamento {apartment} | Download the agreement letter: {tenant}, apartment {apartment} |

## 3. Wo der Link erscheint

- **MissingStatement:** ein Link `contract-missing-statement-consent-letter` direkt unter `contract-missing-statement-short-help`, im selben `{#if period === firstShort}`, also nur bei der kurzen Abrechnungsperiode und nur bei der ersten (#512, Fachreview 512-1 V-2), mit der Bedingung aus V-1. Nicht bei «wählen», nicht bei einer ganzen Periode.
- **OverlapWays:** ja, pro Mietvertrag des Gebäudes mit Mietstagen in der kurzen Periode, unter `generate-building-short-help-{buildingId}`, mit der Bedingung aus V-1 (V-2).
- Der Brief wird nicht als Dokument abgelegt: Er ist eine Vorlage zum Ausdrucken, kein Versand. Die unterschriebene Antwort kann der Vermieter als hochgeladenes Dokument beim Mieter ablegen.

## 4. Szenario und weitere Fälle

Szenario (ersetzt die Zeilen 335-345; der Schritt «richtet sich der Brief an» statt «die Vorlage», V-5):

```gherkin
  Szenario: Brief für die Zustimmung des Mieters zu einer neuen Abrechnungsperiode
    Angenommen für "Anna Keller" gibt es die Abrechnung vom "2024-07-01" bis "2025-06-30" im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Brief für die Zustimmung zur neuen Abrechnungsperiode herunterlädt
    Dann steht im PDF "Zustimmung zu einer neuen Abrechnungsperiode"
    Und richtet sich der Brief an "Anna Keller"
    Und steht im PDF "Mietvertrag für die Wohnung 2.01"
    Und steht im PDF "bisher haben wir die Nebenkosten jeweils vom 1. Juli bis 30. Juni abgerechnet"
    Und steht im PDF "neu jeweils vom 1. Januar bis 31. Dezember ab"
    Und steht im PDF "kurze Abrechnungsperiode 01.07.2025 – 31.12.2025"
    Und steht im PDF "Die erste neue Abrechnungsperiode ist 01.01.2026 – 31.12.2026"
    Und steht im PDF "Ohne Ihre Unterschrift ändert dieses Schreiben an Ihrem Mietvertrag nichts"
    Und steht im PDF "Ort, Datum"
    Und steht im PDF "Unterschrift weiterer Mieter"
```

Weitere Fälle:
- Neues E2E-Szenario (V-1): Aufbau wie Zeile 281 (Abrechnung 01.04.2024–30.09.2024), Erwartung «bietet der Mietvertrag keinen Brief zur Zustimmung an».
- Neues `@wip`-Szenario in `statement-generate.feature` (V-2): Schritt 2 mit Überschneidung bietet den Brief für «Anna Keller, Wohnung 2.01» an.
- Unit-Tests für den Wortlaut (wie die Tests von `reminder-letter.ts`): (a) Kalenderjahr nach Juli–Juni und November–Oktober nach Kalenderjahr mit den Daten aus Abschnitt 1; (b) Vertragsende 30.09.2025: kein «erste neue Abrechnungsperiode», Satz `clauseEnding`; (c) Sprache fr/it/en: «1er juillet au 30 juin», «1° luglio al 30 giugno», «1 July to 30 June»; (d) Antwortfrist: Briefdatum 01.11.2026 ergibt «bis 01.12.2026»; (e) kein Satz der Art «gilt als Zustimmung» (M-2).
- `*.pg.test.ts` für die Route: Ablehnung mit Code, wenn kein früherer Typ bekannt ist oder der Mietvertrag keine kurze Periode hat (V-1).

## 5. Fehlende Begriffe

Vorschlag für `UBIQUITOUS_LANGUAGE.md` (Issue mit `domain`, `needs-decision`):

| **Brief zur Zustimmung (Abrechnungsperiode)** | Brief an den Mieter eines Mietvertrags mit der bisherigen und der neuen Abrechnungsperiode, der kurzen Abrechnungsperiode dazwischen und der ersten neuen Periode, mit Zeilen für die Unterschriften aller Mieter. Die Zustimmung ist freiwillig; ohne sie teilt der Vermieter die Änderung mit dem amtlichen Formular mit (Art. 269d OR). Dwello legt den Brief nicht als Dokument ab. | geplant (#521) |

Dazu in `docs/design/i18n-begriffe.md`: Zustimmung (Abrechnungsperiode) | accord | consenso | agreement.

## Nicht bestätigt

- Ob der Wechsel der Abrechnungsperiode eine Änderung «zu Lasten des Mieters» nach Art. 269d Abs. 3 OR ist (sonst keine einseitige Änderung möglich). Fedlex nennt nur «namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen». Die Aussage steht im bestehenden Hinweistext (#486); Lehre und Rechtsprechung nicht gefunden. **unsicher**.
- Dass alle Mitmieter zustimmen müssen: Fedlex belegt das nur über Art. 16 Abs. 2 mit Art. 13 Abs. 1 OR bei vorbehaltener Schriftform. Ohne Formvorbehalt beruht es auf der Lehre zur gemeinsamen Miete; nicht auf Fedlex. **unsicher**.
- Ob der vom Vermieter unterschriebene Brief mit der unterschriebenen Antwort die vorbehaltene Schriftform erfüllt: Art. 13 Abs. 2 OR (Brief) ist aufgehoben (Fedlex: «Aufgehoben durch Anhang Ziff. 2 des BG vom 19. Dez. 2003 über die elektronische Signatur»). Die heutige Praxis zum Briefwechsel ist nicht auf Fedlex geregelt. **unsicher**.
- Rückwirkende Vereinbarung für eine schon abgelaufene kurze Periode: Vertragsfreiheit (Art. 1, 11 Abs. 1 OR); Rechtsprechung dazu nicht geprüft.
- Antwortfrist 30 Tage: Praxis, keine Quelle.
- Gesucht in: Fedlex OR Art. 1, 6, 11, 13, 16, 257a, 257b, 269d, 271a (DE, FR, IT, Stand 1.10.2026); VMWG Art. 4, 19, 20 (Stand 1.10.2025); `docs/nebenkostenabrechnung-anforderungen.md`; Glossar. `docs/reviews/199-fachreview-2.md` und `docs/design/personas/helga-199.md` (Quelle des Issues) gibt es im Worktree nicht.

Geprüft: Hinweistext und Art. 269d Abs. 1–3 OR (amtliches Formular, zehn Tage, nächstmöglicher Kündigungstermin), VMWG Art. 4 Abs. 1 für die kurze Periode, die Daten des Szenarios (01.07.2025 – 31.12.2025, 01.01.2026 – 31.12.2026), die Begriffe Abrechnungsperiode, kurze Abrechnungsperiode, Akontobeiträge, Firmenadresse, Korrespondenzadresse, Wohnungsnummer.
