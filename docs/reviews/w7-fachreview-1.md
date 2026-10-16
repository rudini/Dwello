# Fachreview W7, Runde 1: #116 (A-7) und #141 (A-10c)

Gegenstand: `@wip`-Szenarien in `tests/e2e/features/contract-detail.feature` (Commit a75a8a2, Worktree `review-w7-fach`) und die sieben geplanten Texte aus dem Auftrag.
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/anforderungen-vertragsende.md` (A-7, A-8), `docs/nebenkostenabrechnung-anforderungen.md`, Issues #116, #117, #141, `messages/de.json`, Fedlex.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Löschdialog eines begonnenen Vertrags nennt keine Alternative für ein echtes Mietverhältnis und verschweigt, dass danach die Erinnerung an fehlende Abrechnungen verschwindet |
| V-2 | Verwalter | Minor | Szenario «Irrtümlich erfassten Mietvertrag löschen» nimmt einen beendeten Vertrag von 2024, also den Historienfall aus A-8, nicht das Beispiel aus A-7; die Folge (Leerstand) wird nicht geprüft |
| V-3 | Verwalter | Minor | Text 4 (CONTRACT_HAS_STATEMENTS): Einzahl, keine Nummer und kein Link; bei einer versendeten oder bezahlten Abrechnung sagt er nicht, was zu tun ist |
| V-4 | Verwalter | Minor | Der Dialog verlangt die Bestätigung «irrtümlich erfasst», obwohl die Seite schon weiss, dass eine Abrechnung das Löschen sperrt |
| V-5 | Verwalter | Minor | Text 5 (CONTRACT_STARTED) sagt nicht, was zu tun ist |
| V-6 | Verwalter | Minor | Text 6 (`contracts_parties_fixed_mistake`) nennt keinen Weg, wenn ein Entwurf den Vertrag sperrt |
| V-7 | Verwalter | Minor | «Leerstand» fehlt im Glossar (Begriffsvorschlag) |
| V-8 | Verwalter | Nit | Szenario «Mietvertrag mit Abrechnung kann nicht gelöscht werden» prüft nicht, dass der Vertrag noch da ist |
| V-9 | Verwalter | Nit | Text 1 «hat schon begonnen» wirkt bei einem beendeten Vertrag seltsam; das Datum würde beim Erkennen helfen |
| V-10 | Verwalter | Nit | Der Schlüssel heisst in #116 `contracts_parties_fixed_help`, im Code `contracts_parties_fixed_mistake` |

Keine Befunde in den Rollen Mietrecht und Rechtstexte (siehe «Bestätigt»).

## Befunde

### V-1 (Major): Löschdialog ohne Alternative und ohne Folge für eine fehlende Abrechnung

**Beleg.** Geplanter Text 1: «Der Mietvertrag von {name} hat schon begonnen. Löschen Sie ihn nur, wenn er irrtümlich erfasst wurde, zum Beispiel für die falsche Wohnung oder den falschen Mieter. Ist nur ein Wert falsch, korrigieren Sie ihn unter «Bearbeiten».» `docs/anforderungen-vertragsende.md:246` (A-8): «Anna (I2) hielt einen beendeten Mietvertrag von 2018–2021 in derselben Wohnung für ein Duplikat.» Der Hinweis «Abrechnung … fehlt» wird aus den Mietverträgen berechnet (`src/routes/contracts/[id]/+page.server.ts:68-83`, `missingStatements`). Das Löschen eines Mietvertrags ohne Abrechnung lässt ihn darum verschwinden. Art. 4 Abs. 1 VMWG (Fedlex, SR 221.213.11): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»

**Warum falsch.** Bis jetzt liess sich ein begonnener Vertrag nicht löschen. Mit #116 lässt sich jeder begonnene oder beendete Vertrag ohne Abrechnung in Dwello löschen. Das trifft vor allem zwei echte Mietverhältnisse:
- frühere Verträge, die vor Dwello abgerechnet wurden: der A-8-Fall, der mit #117 noch offen ist;
- laufende oder eben beendete Verträge, deren Abrechnung noch fehlt.

Ein Laie, der «aufräumt», kreuzt «irrtümlich erfasst» an, weil der Dialog keinen anderen Weg nennt. Danach erinnert Dwello nicht mehr an die fehlende Abrechnung. Der Mieter erhält keine Abrechnung über sein Akonto, obwohl der Vermieter nach Art. 4 Abs. 1 VMWG abrechnen muss. Die Bestätigung nennt nur die Folge für den Leerstand, nicht diese.

**Fix** (Wortlaut im Dialog, kein Eingriff in den Entscheid «jederzeit nach Bestätigung»). Text 1 bekommt einen Satz für das echte Mietverhältnis:
«Hatte {name} die Wohnung wirklich gemietet, löschen Sie den Mietvertrag nicht: Zieht der Mieter aus, wählen Sie «Beenden». Ein beendeter Mietvertrag bleibt als Historie der Wohnung erhalten.»
Fehlt eine Abrechnung (`missingStatements` nicht leer), steht zusätzlich: «Für diesen Mietvertrag fehlt noch die Nebenkostenabrechnung {period}. Nach dem Löschen erinnert Dwello nicht mehr daran.»
Dazu ein Szenario oder ein DOM-Test für diesen Zustand.

### V-2 (Minor): Das Erfolgsszenario zeigt den falschen Fall

**Beleg.** `contract-detail.feature`, Szenario «Irrtümlich erfassten Mietvertrag löschen»: «"Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2024-12-31"». Das Akzeptanzkriterium in A-7 (`docs/anforderungen-vertragsende.md:233-238`) lautet: «"Anna Keller" mietet irrtümlich auch die Wohnung "2.02" seit "2024-04-01"».

**Warum falsch.** Ein beendeter befristeter Vertrag eines anderen Mieters ist das Bild der Historie aus A-8, nicht eines Irrtums. Das Szenario dokumentiert so genau das Löschen, vor dem V-1 warnt. Die bestätigte Folge «zählen danach als Leerstand» wird nicht gezeigt.

**Fix.** Das Beispiel aus A-7 nehmen: Anna Keller mietet irrtümlich auch die Wohnung 2.02 seit 2024-04-01, ein laufender Vertrag. Am Ende prüfen: «Und die Wohnung "2.02" hat den Mietstatus "Leer"» (Mietstatus «Leer» nach Glossar Z. 22).

### V-3 (Minor): Text 4 ohne Nummer und ohne Weg bei versendeten Abrechnungen

**Beleg.** Text 4: «… weil eine Nebenkostenabrechnung ihn verwendet. Ist sie noch ein Entwurf, löschen Sie zuerst die Abrechnung.» Zum Vergleich die bestehenden Ablehnungen beim Vertragsende: `contracts_billed_draft_one/_many` und `contracts_billed_locked_rest` (`messages/de.json`) nennen die Nummern und den Weg für versendete Abrechnungen («klären Sie die Korrektur der Abrechnung direkt mit dem Mieter»), und `contracts_refused_open` verlinkt sie. #117 verlangt für den Löschdialog ebenfalls: «says whether statements exist for it and links each of them».

**Warum falsch.**
- Bei mehreren Abrechnungen passt die Einzahl nicht.
- Der Laie weiss nicht, welche Abrechnung gemeint ist.
- Bei einer versendeten oder bezahlten Abrechnung bleibt er ohne Handlung. Das widerspricht der Design-Regel «errors say what happened and what to do».

**Fix (Vorschlag).** «Dieser Mietvertrag kann nicht gelöscht werden: Die Nebenkostenabrechnung {numbers} rechnet seine Mietstage ab. Löschen Sie zuerst die Entwürfe, dann lässt sich der Mietvertrag löschen. Ist eine Abrechnung versendet oder bezahlt, bleibt der Mietvertrag erhalten. Klären Sie die Korrektur direkt mit dem Mieter.» Dazu je Abrechnung der Link `contracts_refused_open`. Den Code CONTRACT_HAS_STATEMENTS mit der Liste der Abrechnungen beantworten, wie beim Vertragsende (409 mit `statements`).

### V-4 (Minor): Erst bestätigen, dann abgelehnt werden

**Beleg.** Das Szenario «Mietvertrag mit Abrechnung kann nicht gelöscht werden» verlangt «löscht und bestätigt, dass er irrtümlich erfasst wurde». Erst danach kommt die Ablehnung. Die Seite lädt die Abrechnungen des Vertrags aber schon (`+page.server.ts:77`, `statements?contractId=`).

**Warum falsch.** Der Landlord muss einen Irrtum bestätigen und erfährt erst danach, dass das Löschen gar nicht geht. Das ist eine unnötige Bestätigung. Der heutige Dialog zeigt die Sperre gleich beim Öffnen (`contracts_started_not_deletable`, Bestätigen deaktiviert).

**Fix.** Gibt es Abrechnungen, zeigt der Dialog gleich Text 4 (V-3) mit den Links, ohne Kästchen und mit deaktiviertem «Mietvertrag löschen». Die Ablehnung CONTRACT_HAS_STATEMENTS aus dem Backend bleibt für eine veraltete Seite. Das Szenario dazu: «Wenn der Liegenschaftsverwalter den Mietvertrag löschen will / Dann nennt der Dialog …».

### V-5 (Minor): Text 5 nennt keine Handlung

**Beleg.** Text 5: «Ein Mietvertrag, der begonnen hat, wird nur gelöscht, wenn Sie bestätigen, dass er irrtümlich erfasst wurde.» Laut Auftrag erreicht ihn nur eine veraltete Seite: Der Dialog wurde ohne Kästchen geöffnet, als der Vertrag noch künftig war.

**Warum falsch.** Im offenen Dialog gibt es kein Kästchen, das der Landlord ankreuzen könnte. Der Text sagt nicht, wie er es bekommt.

**Fix.** «Der Mietvertrag hat inzwischen begonnen. Laden Sie die Seite neu und bestätigen Sie beim Löschen, dass er irrtümlich erfasst wurde.»

### V-6 (Minor): Text 6 ohne Weg, wenn eine Abrechnung den Vertrag sperrt

**Beleg.** Text 6: «… löschen Sie den Mietvertrag auf seiner Seite und erfassen ihn neu. Das geht, solange keine Nebenkostenabrechnung ihn verwendet.»

**Warum falsch.** Den häufigsten Sperrfall, einen Entwurf aus dem Abrechnungslauf, kann der Landlord selbst lösen. Der Text lässt ihn aber ohne Weg stehen.

**Fix.** «Haben Sie den falschen Mieter oder die falsche Wohnung gewählt, löschen Sie den Mietvertrag auf seiner Seite und erfassen Sie ihn neu. Gibt es dazu schon einen Entwurf einer Nebenkostenabrechnung, löschen Sie zuerst den Entwurf.» Die Reihenfolge erst löschen, dann neu erfassen ist richtig: Eine Überschneidung in derselben Wohnung lehnt Dwello ab (Regel 1, `docs/anforderungen-vertragsende.md:31`).

### V-7 (Minor): Begriff «Leerstand» fehlt im Glossar

**Beleg.** Der entschiedene Bestätigungstext (#116) verwendet «Leerstand», ebenso `help_statements_2` und `docs/design/i18n-begriffe.md:64`. Fachlich beschrieben ist er in `docs/nebenkostenabrechnung-anforderungen.md:144` («Den Anteil leerer Wohnungen und leerer Tage trägt immer der Vermieter»). `UBIQUITOUS_LANGUAGE.md` führt nur den Mietstatus «Leer».

**Vorschlag für den Glossareintrag** (Issue, Labels `fachlich`, `entscheiden`): «**Leerstand**: Zeit, in der eine Wohnung keinen Mietvertrag hat. Ihren Anteil an den Nebenkosten trägt der Vermieter; Dwello rechnet ihn keinem Mieter an.»
Eine Ergänzung zum Dialogtext, nicht zum entschiedenen Bestätigungstext: «Die Nebenkosten dieser Tage trägt dann der Vermieter.» Das entspricht `contracts_end_confirm_help`.

### V-8 (Nit): Das Sperr-Szenario prüft nicht, dass der Vertrag bleibt

**Beleg.** «Mietvertrag mit Abrechnung kann nicht gelöscht werden» endet mit «Dann meldet der Dialog …».
**Fix.** «Und ist der Mietvertrag unbefristet» ergänzen, wie im ersten `@wip`-Szenario.

### V-9 (Nit): «hat schon begonnen» bei einem beendeten Vertrag

**Beleg.** Text 1 gilt auch für den Status «Beendet».
**Fix.** «Der Mietvertrag von {name} hat am {start} begonnen.» Das Datum hilft beim Erkennen des Irrtums und passt zu jedem Status.

### V-10 (Nit): Schlüsselname

**Beleg.** Abschnitt «Decided» in #116 nennt `contracts_parties_fixed_help`. Den Text enthält aber `contracts_parties_fixed_mistake` (`messages/de.json:626`, `ContractForm.svelte:222`).
**Fix.** Dem Code folgen und es im Pull Request erwähnen (CLAUDE.md, «Coding guidelines»).

## Bestätigt

- **#141-Szenario «Abgelehntes Vertragsende behält den Entwurf».** Die Fachlogik stimmt. Nachgerechnet mit Vertragsbeginn 2024-04-01:
  - Der Entwurf 2024 hat 275 Mietstage (30+31+30+31+31+30+31+30+31). Mit dem Ende am 2024-06-30 wären es 91; er stimmt also nicht mehr.
  - Der Entwurf 2025 hat 365 Mietstage, mit dem Ende 2024-06-30 wären es 0.
  - Beide Entwürfe sperren das Ende. Die Mehrzahl in `contracts_billed_draft_many` («Löschen Sie zuerst die Entwürfe …») ist richtig, und dass der Entwurf 2024 erhalten bleibt, entspricht dem Entscheid in #141 (eine Transaktion).
- **Text 2.** Er entspricht wörtlich dem Entscheid in #116, aufgeteilt in Label und Hilfe am Feld.
- **Text 3.** Er folgt dem Muster von `contracts_end_past_confirm`.
- **Text 7.** Unverändert, in Ordnung.
- **Begriffe** Mietvertrag, Nebenkostenabrechnung, Abrechnung, Entwurf, Mietstage, «Bearbeiten», «Beenden»: entsprechen dem Glossar (Z. 35, 148, 162, 169).
- **Formel «Mietstage zählen als Leerstand», nachgerechnet.** Die Verteilschlüssel rechnen nur mit Wohnungsdaten (Glossar Z. 117–124, Anforderungen Z. 143). Das Löschen ändert darum die Anteile anderer Verträge nicht.
  - Ganzes Jahr: 1200 CHF, zwei gleiche Wohnungen, Irrtum in 2.02 für das ganze Jahr: 2.02 trägt 600 CHF. Nach dem Löschen trägt der Vermieter die 600 CHF, 2.01 bleibt bei 600 CHF.
  - Randfall Mieterwechsel mitten in der Periode (2024, 366 Tage): Irrtum vom 01.07. bis 31.12. (184 Tage), Anteil 600 × 184/366 = 301.64 CHF. Nach dem Löschen trägt der Vermieter die ganzen 600 CHF, 2.01 bleibt bei 600 CHF.
  - Andere Entwürfe des Gebäudes müssen deshalb nicht neu erstellt werden.
- **«wenn kein anderer Mietvertrag die Zeit abdeckt».** Wegen Regel 1 (keine Überschneidung) betrifft das nur einen später neu erfassten Vertrag. Der Satz ist korrekt.
- **Mietrecht.** Das Löschen betrifft nur den Datensatz. «irrtümlich erfasst» sagt richtig, dass der Vertrag nie bestand, und täuscht keine Auflösung eines echten Mietverhältnisses vor. Art. 253 OR (Fedlex): «Durch den Mietvertrag verpflichtet sich der Vermieter, dem Mieter eine Sache zum Gebrauch zu überlassen, und der Mieter, dem Vermieter dafür einen Mietzins zu leisten.» Ein echtes Mietverhältnis endet durch Ablauf oder Kündigung, nicht durch Löschen. Die Lücke dazu im Dialog: V-1.
- **Sperre bei jeder Abrechnung** (Entwurf, versendet, bezahlt): fachlich richtig, denn die Abrechnung braucht die Mietstage (A-7 Punkt 2).

## Nicht bestätigt

- **Art. 7 VMWG** (Leerstand bei Heizkosten) und die Praxis «Leerstand trägt der Vermieter» bei übrigen Nebenkosten: nicht neu auf Fedlex geprüft. `docs/nebenkostenabrechnung-anforderungen.md:60,70` führt sie als unsicher-A/-B. Für die Texte hier genügt der Dwello-Entscheid #188.
- **Form der Kündigung (Art. 266l OR):** nicht zitiert. Für die Befunde nicht nötig, darum nicht gesucht.
- **Aufbewahrungspflicht** für Mietvertragsdaten eines privaten Vermieters: nicht geprüft. V-1 stützt sich nur auf Art. 4 Abs. 1 VMWG und A-8.
- **Fehlerpfade der Testbereinigung:** ob `tests/e2e/fixtures/backend.ts` mit dem neuen Flag aufräumt, ist Umsetzung, nicht Fachinhalt. Nicht geprüft.
- **Fedlex-Wortlaut:** Art. 4 Abs. 1 VMWG und Art. 253 OR stammen aus den Fedlex-Snippets der mmx-Suche (fedlex.admin.ch/eli/cc/1990/835_835_835/de, fedlex.admin.ch/eli/cc/27/317_321_377/de), nicht aus der Volltextseite.
