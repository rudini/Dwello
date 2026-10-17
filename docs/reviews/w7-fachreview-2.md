# Fachreview W7, Runde 2: #116 (A-7) und #141

Gegenstand: Delta auf Commit b466c69 (Worktree `review-w7-fach2`). Geprüft wurden:
- die Texte in `messages/{de,fr,it,en}.json`;
- `src/routes/contracts/[id]/DeleteContract.svelte` und die Daten dazu (`+page.server.ts:148-152`, `+page.svelte:117-121, 229-235`);
- `tests/e2e/features/contract-detail.feature`;
- `docs/anforderungen-vertragsende.md` A-7;
- die DOM-Tests in `src/__tests__/contract-detail-page.dom.test.ts:578-604`.

Offen aus Runde 1 waren V-1 und V-3.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | erledigt | Weg für eine echte Miete und Hinweis auf fehlende Abrechnungen sind umgesetzt und mit einem DOM-Test belegt |
| V-3 | Verwalter | Minor (bleibt offen, teilweise erledigt) | `contracts_delete_billed` nennt die Nummern ohne Status, steht immer in der Mehrzahl und sagt bei einer versendeten oder bezahlten Abrechnung nicht, was zu tun ist |
| V-11 | Verwalter | Minor | `contracts_delete_real_tenancy` schickt den Landlord zu «Beenden», auch wenn die Seite den Knopf gar nicht zeigt (befristeter oder beendeter Mietvertrag) |
| V-12 | Verwalter | Nit | «Hatte {name} … gemietet» passt nicht zu einem laufenden Mietvertrag |
| V-13 | Verwalter | Nit | `backend_contract_has_statements` und `contracts_delete_missing_statements`: Zahl und Randfall «Abrechnungen nicht lesbar» |

Keine Befunde in den Rollen Mietrecht und Rechtstexte.

## Befunde

### V-1: erledigt

**Beleg.** `contracts_delete_real_tenancy` entspricht wörtlich dem Vorschlag aus Runde 1. `contracts_delete_missing_statements` erscheint nur, wenn `missingStatements` nicht leer ist (`DeleteContract.svelte:68-70`, `+page.svelte:235`). Die Periode wird nicht genannt. Das genügt, denn die Seite listet die fehlenden Perioden schon über `MissingStatement` (`+page.svelte:138`). Der DOM-Test «nennt bei einem begonnenen Mietvertrag den Weg für eine echte Miete und die fehlende Abrechnung» (`contract-detail-page.dom.test.ts:581-590`) belegt den Zustand. Die Folge für die Pflicht nach Art. 4 Abs. 1 VMWG (Zitat in Runde 1) ist damit sichtbar, bevor der Landlord bestätigt.

Neue Einwände zum Wortlaut stehen unter V-11 und V-12. Sie hängen nicht an V-1.

### V-3 (Minor, bleibt offen): Sperrtext ohne Status und ohne Weg bei versendeten Abrechnungen

**Beleg.** `messages/de.json:1373`: «Dieser Mietvertrag kann nicht gelöscht werden, weil Nebenkostenabrechnungen seine Mietstage abrechnen: {numbers}. Löschen Sie zuerst die Entwürfe davon. Ist eine Abrechnung versendet oder bezahlt, bleibt der Mietvertrag erhalten.»
- `+page.server.ts:152` gibt nur `statementNumber` weiter, obwohl die Zeilen `status` enthalten (`tests/contracts/statement.json:15`).
- Das Szenario «Mietvertrag mit Abrechnung kann nicht gelöscht werden» hat genau eine Abrechnung (2025), der Text steht aber in der Mehrzahl.

Erledigt aus Runde 1:
- Die Sperre zeigt sich beim Öffnen (V-4).
- Die Nummern werden genannt.
- Für Entwürfe gibt es einen Weg.

**Warum falsch.**
1. **Status fehlt.** Der Landlord sieht nur Nummern wie «NK-2024-0001, NK-2025-0002». Welche davon Entwürfe sind, weiss er nicht. Sind alle versendet, ist «Löschen Sie zuerst die Entwürfe» sogar irreführend.
2. **Keine Handlung bei versendet oder bezahlt.** Der Satz «bleibt der Mietvertrag erhalten» nennt eine Folge, aber keine Handlung. Ist der Mietvertrag wirklich irrtümlich erfasst und eine Abrechnung dazu versendet, hat jemand eine falsche Abrechnung erhalten. Das muss der Landlord ausserhalb von Dwello korrigieren. Die bestehende Ablehnung beim Vertragsende sagt das: «klären Sie die Korrektur der Abrechnung direkt mit dem Mieter» (`contracts_billed_locked_rest`, `de.json:1356`). Design-Regel: «errors say what happened and what to do».
3. **Einzahl fehlt.** Bei einer Abrechnung, dem Fall im Szenario, liest sich die Mehrzahl falsch.

**Fix (Vorschlag).** Die Nummern nach Status aufteilen, wie bei `contracts_billed_draft_one/_many`, und zwei Sätze anzeigen, je nur wenn sie zutreffen:
- Grundsatz: «Dieser Mietvertrag kann nicht gelöscht werden, weil eine Nebenkostenabrechnung seine Mietstage abrechnet.» Bei mehreren Abrechnungen in der Mehrzahl.
- Entwürfe: «Löschen Sie zuerst den Entwurf {numbers}.» Bei mehreren: «Löschen Sie zuerst die Entwürfe {numbers}.»
- Versendet oder bezahlt: «Die Nebenkostenabrechnung {numbers} ist versendet. Der Mietvertrag bleibt darum erhalten. War er irrtümlich erfasst, klären Sie die Korrektur der Abrechnung direkt mit dem Empfänger.»

Dazu ein DOM-Test mit gemischtem Status. Links bleiben Sache von #117.

### V-11 (Minor): «wählen Sie «Beenden»», wo es keinen Knopf «Beenden» gibt

**Beleg.**
- `de.json:1368`: «… Zieht der Mieter aus, wählen Sie «Beenden». Ein beendeter Mietvertrag bleibt als Historie der Wohnung erhalten.»
- `+page.svelte:118`: `{#if !contract.endDate}` zeigt den Knopf `contracts_end_action` («Beenden») nur bei unbefristeten Mietverträgen.
- `DeleteContract.svelte:63-67` zeigt den Satz aber für jeden begonnenen Mietvertrag, auch für befristete und beendete. Der DOM-Test `:543-556` deckt diese Fälle ab (Ende 2027-03-31, 2024-12-31).

**Warum falsch.** Genau der A-8-Fall, ein beendeter früherer Mietvertrag (`docs/anforderungen-vertragsende.md:246`, Anna I2), bekommt einen Hinweis auf einen Knopf, den die Seite nicht hat. Dasselbe gilt für einen befristeten laufenden Mietvertrag. Der Laie sucht «Beenden», findet ihn nicht und sieht nur noch das Löschen als Ausweg. Das schwächt den Schutz aus V-1 gerade dort, wo er gebraucht wird.

**Fix.** Den Satz nach dem Vertragsende wählen:
- Ohne Vertragsende: Text wie heute.
- Mit Vertragsende: «Hat {name} die Wohnung wirklich gemietet, löschen Sie den Mietvertrag nicht. Er endet am {end} und bleibt danach als Historie der Wohnung erhalten.» Bei einem beendeten Mietvertrag: «Er endete am {end} …»

Dazu ein DOM-Test für den beendeten Mietvertrag.

### V-12 (Nit): Zeitform

**Beleg.** `de.json:1368`: «Hatte {name} die Wohnung wirklich gemietet». Der Satz gilt auch für einen laufenden Mietvertrag.
**Fix.** «Hat {name} die Wohnung wirklich gemietet, …» Das passt für laufend und beendet. In fr, it und en ist die Zeitform schon neutral.

### V-13 (Nit): Zahl und Randfall der Hinweise

**Beleg.**
- `de.json:1374`: «… weil eine Nebenkostenabrechnung …». Das Backend kann mehrere meinen.
- `de.json:1369`: «fehlen noch Nebenkostenabrechnungen», auch wenn nur eine Periode fehlt.
- `+page.server.ts:48, 75, 152`: Können die Abrechnungen nicht gelesen werden, sind `billedBy` und `missingStatements` leer. Der Dialog zeigt dann das Kästchen ohne Hinweis. Erst das Backend lehnt ab, mit «Laden Sie die Seite neu, um sie zu sehen.» Scheitert das Lesen weiter, zeigt das Neuladen die Abrechnung nicht.

**Fix.** Für den Backend-Text «mindestens eine Nebenkostenabrechnung». Für den fehlenden Abrechnungen-Hinweis Einzahl und Mehrzahl, oder neutral: «Für diesen Mietvertrag fehlt noch eine Nebenkostenabrechnung oder mehrere.» Der Lesefehler ist nicht fachlich. Wenn er nicht behoben wird, gehört er als Zeile in `docs/design/offene-punkte.md`.

## Bestätigt

- **`contracts_delete_started_text`.** Mit dem Datum (V-9) und «Bearbeiten», das `buildings_edit` entspricht (`de.json:314`), ist der Text in Ordnung. Ebenso in fr («Modifier»), it («Modificare») und en («Edit»).
- **`contracts_delete_mistake_label`, `_help`, `_unconfirmed`.** Unverändert gegenüber Runde 1 und in Ordnung. «Leerstand», «vacance», «sfitto» und «vacancy» entsprechen `docs/design/i18n-begriffe.md:64`. Der Glossareintrag ist in #279 offen. Der Hilfetext ist der in #116 entschiedene, darum braucht er keinen Marker.
- **`backend_contract_started`.** Wörtlich wie der Fix V-5.
- **`contracts_parties_fixed_mistake`.** Wörtlich wie der Fix V-6, in allen vier Sprachen sinngleich.
- **Szenarien.**
  - Das Erfolgsszenario hat jetzt einen laufenden Mietvertrag seit 2024-04-01 (V-2).
  - Das Sperrszenario prüft die Sperre beim Öffnen, das deaktivierte Bestätigen und dass der Vertrag bleibt (V-4, V-8).
  - Der fehlende Check auf den Mietstatus «Leer» ist laut Auftrag bewusst weggelassen. Die Fachlogik dazu ist in Runde 1 nachgerechnet und ändert sich nicht.
- **A-7 in `docs/anforderungen-vertragsende.md`.** Der Abschnitt «Umgesetzt» gibt Entscheid, Dialog und Backend-Regeln richtig wieder. Mit V-3 und V-11 bleibt der Satz «nennt die Abrechnungen» wahr.
- **Übersetzungen fr, it, en.** Die Begriffe Mietvertrag, Nebenkostenabrechnung, Entwurf, versendet, bezahlt, Mietstage und «Terminer», «Terminare», «End contract» entsprechen `i18n-begriffe.md:63-65` und `contracts_end_action` (`*.json:633`). Inhaltlich sind sie gleich wie de, mit denselben Befunden V-3, V-11 und V-13.
- **#141.** Das Szenario «Abgelehntes Vertragsende behält den Entwurf» ist unverändert bis auf das entfernte `@wip`. Die Fachlogik ist in Runde 1 bestätigt.

## Nicht bestätigt

- Neue Rechtsfragen gibt es im Delta nicht. Art. 4 Abs. 1 VMWG und Art. 253 OR habe ich nicht neu auf Fedlex abgerufen. Ich stütze mich auf die Zitate aus Runde 1 (`docs/reviews/w7-fachreview-1.md`).
- Ob die Backend-Liste der Abrechnungen für `contractId` alle Status liefert (Entwurf, versendet, bezahlt, überfällig): Ich habe nur den Vertrag `tests/contracts/statement.json` gesehen, nicht den Service-Filter. Davon hängt ab, ob der Dialog jede sperrende Abrechnung nennt.
- Die E2E-Läufe habe ich nicht ausgeführt. Die Szenarien habe ich nur fachlich gelesen.
