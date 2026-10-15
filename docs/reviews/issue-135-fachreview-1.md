# Fachreview #135, Runde 1: Szenarien vor der Umsetzung

Gegenstand: Commit `43c63ad` (Worktree `review-135-fach`), `tests/e2e/features/statement-generate.feature:150–163`, die zwei `@wip`-Szenarien «Ein Gebäude aus dem Entwurf gibt es nicht mehr» und «Schon abgerechnete Mietverträge zeigen sich bei der Wahl der Gebäude», dazu die vom Aufrufer genannten geplanten Texte und die Zählregel aus `contractsInPeriod` (`src/lib/server/statement-generation.ts:46–68`).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter / Mietrecht | Major | «hat für diese Periode schon eine Abrechnung» stimmt bei der Überschneidungsregel nicht immer, und die Übersicht zählt mit einer anderen Regel. Nach einem Wechsel der Abrechnungsperiode widersprechen sich Schritt 2 und «Noch nicht abgerechnet». |
| V-2 | Verwalter | Minor | «Entwurf» heisst im Glossar nur der Abrechnungsstatus. Im selben Assistenten heisst die letzte Aktion «Entwürfe erstellen», darum ist «Gebäude aus dem Entwurf» doppeldeutig. |
| V-3 | Verwalter | Minor | «Wählen Sie die Gebäude neu» klingt, als sei die ganze Auswahl weg. Die übrigen Gebäude bleiben aber gewählt (`restoredSelection`). |
| V-4 | Verwalter | Minor | Zahl und Verb fehlen für «2 von 3 …» (Plural) und für den Fall 0 Mietverträge. |
| V-5 | Verwalter | Minor | Die Zähler müssen verschiedene Mietverträge zählen und nicht Abrechnungen. Der vorhandene Zähler `existing` zählt Abrechnungen. |
| V-6 | Verwalter | Nit | Schritt 2 sagt sonst «Abrechnungsperiode», die neuen Texte sagen «Periode». |
| V-7 | Verwalter | Nit | Ein neuer Angenommen-Schritt «"Marc Huber" hat die Abrechnung 2024» doppelt einen vorhandenen. Nach dem Glossar gehört die Abrechnung zum Mietvertrag. |

## Befunde

### V-1 (Major): «für diese Periode» stimmt nicht mit der Zählregel und widerspricht der Übersicht

**Beleg.**
- Zählregel in Schritt 2 laut Aufrufer (= Vorschau), `src/lib/server/statement-generation.ts:56–63`: Ein Mietvertrag gilt als abgerechnet, sobald sich die Periode **einer** seiner Abrechnungen mit der gewählten Periode **überschneidet** (`s.periodStart <= periodEnd && s.periodEnd >= periodStart`).
- Die Übersicht «Noch nicht abgerechnet» (A-9, `docs/anforderungen-vertragsende.md:266–275`) zählt anders, nämlich nur Abrechnungen, die **ganz in** der Periode liegen: `src/routes/dashboard/+page.server.ts:62` mit `backend/src/services/statement.service.ts:104–105` (`gte(periodStart)`, `lte(periodEnd)`).
- Geplanter Text: «1 von 2 Mietverträgen hat **für diese Periode** schon eine Abrechnung.» und «Für dieses Gebäude entsteht keine neue.»
- Glossar `UBIQUITOUS_LANGUAGE.md:129`, «Abrechnungsperiode»: «z.B. 01.01.-31.12., 01.07.-30.06., 01.11.-31.10.». Die Einstellung lässt einen Wechsel zu (`:193`). `docs/nebenkostenabrechnung-anforderungen.md:31` sieht dafür eine «Rumpfperiode beim Wechsel» vor.
- Art. 4 Abs. 1 VMWG (SR 221.213.11). Wortlaut aus dem Fedlex-Suchtreffer https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Die Fedlex-Seite selbst lädt nur per JavaScript, siehe «Nicht bestätigt».

**Nachgerechnet.**

| Fall | Abrechnungen | Regel Schritt 2 (Überschneidung) | Regel Übersicht (ganz in der Periode) |
|---|---|---|---|
| A: Szenario, Periode 2024 | Marc 01.01.–31.12.2024 | Eva: nicht abgerechnet. Marc: abgerechnet. Ergebnis «1 von 2», **stimmt** | Marc erledigt, Eva fehlt, gleiches Ergebnis |
| B: Wechsel von Juli–Juni auf Kalenderjahr, Periode 2024 | Marc 01.07.2023–30.06.2024 (Vertrag ab 01.05.2024) | 2023-07-01 ≤ 2024-12-31 und 2024-06-30 ≥ 2024-01-01 ergibt «abgerechnet». Ergebnis «1 von 2 … hat für diese Periode schon eine Abrechnung», der Lauf erstellt **keine** für Marc | 2023-07-01 ≥ 2024-01-01 ist falsch, also «Noch nicht abgerechnet: Lindenhof» |
| C: wie B, alle Mietverträge so | – | «Alle 2 Mietverträge haben … Für dieses Gebäude entsteht keine neue.» | Erinnerung bleibt bestehen |

Im Fall B schickt die Übersicht den Verwalter in den Assistenten. Dort steht dann, Marc habe für 2024 schon eine Abrechnung, und der Lauf erstellt keine. Die Monate 01.07.–31.12.2024 rechnet keine Periode je ab: Die nächste Periode 2025 überschneidet sich nicht mit ihnen. Marcs Akonto aus diesen Monaten bleibt ohne Abrechnung, obwohl Art. 4 Abs. 1 VMWG verlangt, «jährlich mindestens einmal» abzurechnen.

**Warum das ein Befund dieses Slices ist.** Die Überschneidungsregel der Vorschau gab es schon vorher, und `statements_existing_note` sagt Ähnliches erst nach dem Schritt «Einstellungen». Neu ist zweierlei: Der Text behauptet ausdrücklich «für diese Periode», und er steht in Schritt 2, also direkt dort, wohin die Übersicht führt. Damit wird der Widerspruch sichtbarer (CLAUDE.md, Workflow 7).

**Was es behebt.**
1. Im Slice: einen Text wählen, der nur sagt, was die Regel prüft, zum Beispiel «1 von 2 Mietverträgen hat schon eine Abrechnung, die in diese Abrechnungsperiode fällt.» und «Alle {n} Mietverträge haben schon eine Abrechnung, die in diese Abrechnungsperiode fällt. Für dieses Gebäude entsteht keine neue.» Ein `@api`- oder Unit-Test mit Fall B hält das Verhalten fest.
2. Die Regel selbst (Überschneidung oder «ganz in der Periode», Rumpfperiode nach dem Wechsel der Abrechnungsperiode, eine Regel für Vorschau, Lauf und Übersicht) braucht einen Entscheid. Vorschlag: ein Issue mit den Labels `fachlich` und `entscheiden`, Titel «Wann gilt ein Mietvertrag für eine Periode als abgerechnet?», mit den Fällen A bis C oben. Bis zum Entscheid ist der Befund offene Arbeit nach Workflow 7, Art 1 (braucht einen Produktentscheid).

### V-2 (Minor): «Entwurf» ist im Abrechnungsassistenten doppeldeutig

**Beleg.**
- Glossar `UBIQUITOUS_LANGUAGE.md:144`: «**Entwurf** | Abrechnung erstellt, noch nicht versendet. (`draft`)». Eine Bedeutung «gespeicherte Eingaben im Browser» führt das Glossar nicht.
- Im selben Assistenten: `messages/de.json:964` «Entwürfe erstellen», `:1022` «Entwürfe ansehen», `:998` «Um einen Entwurf neu zu berechnen, löschen Sie ihn …».
- Geplant: «Ein Gebäude aus dem Entwurf gibt es nicht mehr.» und «Das Heizprofil aus dem Entwurf gibt es nicht mehr.»

**Warum.** Ein Vermieter, der den Assistenten ein paar Mal im Jahr nutzt, kann «Gebäude aus dem Entwurf» als das Gebäude einer erstellten Abrechnung im Status Entwurf lesen. Dann fürchtet er, eine Abrechnung sei betroffen. Den Titel «Entwurf wiederhergestellt» (`ui_draft_restored`, gemeinsame Komponente `DraftNotice`) und den Datenschutztext gab es schon vorher. Die zwei neuen Sätze verdoppeln den Gebrauch aber genau in dem Assistenten, der Entwürfe im Sinne des Glossars erstellt.

**Was es behebt.** Die Wortwahl des vorhandenen Folgesatzes übernehmen (`ui_draft_back`: «Ihre Angaben … sind wieder da»): «Ein Gebäude aus Ihren Angaben gibt es nicht mehr.» und «Das Heizprofil aus Ihren Angaben gibt es nicht mehr. Wählen Sie ein Heizprofil.»

**Fehlender Begriff** (der Aufrufer eröffnet das Issue, Labels `fachlich`, `entscheiden`): «Gespeicherte Angaben (Assistent)», definiert als «Eingaben in einem Assistenten, die Dwello in diesem Browser aufbewahrt, bis der Liegenschaftsverwalter speichert, verwirft oder sich abmeldet. Nicht dasselbe wie der Abrechnungsstatus Entwurf.» Zu entscheiden ist, ob der UI-Titel «Entwurf wiederhergestellt» bleiben soll.

### V-3 (Minor): «Wählen Sie die Gebäude neu» sagt mehr, als passiert

**Beleg.** `src/lib/statement-wizard.ts:252–262`, `restoredSelection` filtert nur die gelöschten Gebäude heraus (`draft.buildingIds.filter(...)`). Die übrigen bleiben gewählt.

**Warum.** «neu wählen» klingt, als wäre die Auswahl leer. Der Verwalter wählt dann womöglich alles nochmals ab und an oder sucht nach einem Fehler. Fachlich geht dabei nichts verloren: Ein Gebäude mit Wohnungen lässt sich gar nicht löschen (`backend/src/services/building.service.ts:195–212`), also hatte das verschwundene Gebäude keine Mietverträge und hätte keine Abrechnung ergeben.

**Was es behebt.** «Ein Gebäude aus Ihren Angaben gibt es nicht mehr. Prüfen Sie die gewählten Gebäude.» Bei mehreren: «{n} Gebäude aus Ihren Angaben gibt es nicht mehr. Prüfen Sie die gewählten Gebäude.» «{n} Gebäude … gibt es nicht mehr» ist grammatisch richtig, denn «es gibt» bleibt auch im Plural im Singular. Waren alle gewählten Gebäude gelöscht, passt «Wählen Sie die Gebäude neu.» weiterhin.

### V-4 (Minor): Formen für den Plural und den Fall 0 fehlen

**Beleg.** Im Szenario steht nur der Text für 1 abgerechneten Mietvertrag von mehreren. Geplant sind dazu die Texte für «alle» und «einer von einem».

**Nachgerechnet.**
- 1 von 2 ergibt «1 von 2 Mietverträgen hat …», richtig (das Verb folgt der «1»).
- 2 von 3 ergibt mit demselben Muster «2 von 3 Mietverträgen hat …», falsch. Richtig ist «2 von 3 Mietverträgen haben …». Es braucht also eine eigene Meldung für mehrere abgerechnete Mietverträge, auch in fr/it/en.
- 0 von 2 ergibt keinen Text. Das stimmt, sollte aber festgelegt werden.
- 0 von 0 tritt zum Beispiel bei Lindenhof mit Periode 2023 auf: Eva beginnt am 01.01.2024 und Marc am 01.05.2024, beide nach dem 31.12.2023. Der Text «Alle 0 Mietverträge haben …» darf hier nicht erscheinen. Für diesen Fall gibt es schon die Meldung der Vorschau («keine Mietverträge in der Periode», Szenario `statement-generate.feature:93–95`). Schritt 2 sollte dann nichts zu Abrechnungen sagen.

**Was es behebt.** Vier Fälle festlegen und im DOM-Test prüfen: 0 abgerechnet (kein Text), 1 von mehreren, k von n mit 1 < k < n («{billed} von {total} Mietverträgen haben …»), alle (die Varianten n = 1 und n > 1 sind geplant). Für 0 Mietverträge keinen Text.

### V-5 (Minor): Mietverträge zählen, nicht Abrechnungen

**Beleg.** `src/lib/server/statement-generation.ts:153` zählt `statements: (statements as Period[]).filter(overlaps).length`, also **Abrechnungen**. Daraus wird `existing` in `src/lib/statement-wizard.ts:249`. Das liegt nahe, ist aber nicht die Regel aus `contractsInPeriod`, die **Mietverträge** zählt (`Set` der `contractId`, `:56–60`). Glossar `UBIQUITOUS_LANGUAGE.md:127`: «Abrechnung … pro Mietvertrag». `docs/nebenkostenabrechnung-anforderungen.md:147`, Regel 7: «Eine Abrechnung pro Mietvertrag und Periode».

**Nachgerechnet.** Fall B aus V-1, dazu eine Rumpfperiode 01.07.–31.12.2024 für Marc. Marc hat dann zwei Abrechnungen, die sich mit 2024 überschneiden, Eva keine.
- Mit dem Zähler `existing` (Abrechnungen): 2 bei 2 Mietverträgen ergibt «Alle 2 Mietverträge haben … Für dieses Gebäude entsteht keine neue.» Das ist **falsch**: Der Lauf erstellt eine Abrechnung für Eva.
- Nach Mietverträgen gezählt: 1 von 2, richtig.

**Was es behebt.** Zähler und Nenner aus `contractsInPeriod` ableiten (verschiedene `contractId`, die sich mit der Periode überschneiden), nicht aus `existing`. Dazu ein Unit-Test mit zwei Abrechnungen für einen Mietvertrag.

### V-6 (Nit): «Periode» statt «Abrechnungsperiode»

**Beleg.** In Schritt 2 steht sonst «Rechnungen in der Abrechnungsperiode» (`messages/de.json:972–974`), in der Vorschau «in dieser Abrechnungsperiode» (`:994`). Glossarbegriff ist «Abrechnungsperiode» (`UBIQUITOUS_LANGUAGE.md:129`).

**Was es behebt.** «in dieser Abrechnungsperiode», wie im Vorschlag zu V-1.

### V-7 (Nit): Doppelter Angenommen-Schritt

**Beleg.** `statement-generate.feature:161` «Angenommen "Marc Huber" hat die Abrechnung 2024 für das Gebäude "Lindenhof"». Der vorhandene Schritt `:43` lautet «Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024». Beide rufen dieselbe Vorbereitung auf (`seed.statement`, `tests/e2e/steps/statement-generate.steps.ts`, Diff Zeile +294).

**Warum.** Zwei Formulierungen für denselben Sachverhalt. «Mieter hat die Abrechnung» passt nicht zum Glossar, nach dem die Abrechnung zum Mietvertrag gehört.

**Was es behebt.** Den vorhandenen Schritt verwenden: «Angenommen für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024». Den neuen Schritt streichen.

## Bestätigt

- **Szenario 2, Zahl «1 von 2»:** Periode 01.01.–31.12.2024. Eva 01.01.–31.03.2024 und Marc ab 01.05.2024 überschneiden sich beide mit der Periode (`contractsInPeriod:62`). Die Abrechnung 2024 von Marc (`seed.statement`, 01.01.–31.12.2024) überschneidet sich ebenfalls. Also 1 abgerechneter von 2 Mietverträgen. Der Lauf erstellt 1, nämlich die für Eva, wie Szenario `:42–45` umgekehrt zeigt.
- **Zähleinheit Mietvertrag:** Glossar `:127` («pro Mietvertrag») und Regel 7 (`nebenkostenabrechnung-anforderungen.md:147`). Für Schritt 2 richtig gewählt, sofern V-5 beachtet wird.
- **Leerstand April 2024** zwischen Eva und Marc: Er zählt nicht als Mietvertrag. Den Anteil trägt der Vermieter (Regel 4, `:144`). Der Text muss ihn nicht nennen.
- **Glossarbegriffe** Gebäude, Mietvertrag, Abrechnung (Kurzform von Nebenkostenabrechnung, so im Glossar `:128` «Erstellt die Abrechnungen einer Periode»), Heizprofil, Liegenschaftsverwalter: korrekt verwendet. Ausnahmen sind «Entwurf» (V-2) und «Periode» (V-6).
- **Heizprofil-Text:** Im Assistenten ist ein Heizprofil Pflicht (`src/lib/statement-wizard.ts:46`, `statements_error_heating_profile`). «Wählen Sie ein Heizprofil.» ist darum die richtige Aufforderung. Vordefinierte Heizprofile lassen sich nicht löschen (Regel 6, `:146`; `heating-profile.service`, «Don't allow deleting predefined profiles»). Der Fall betrifft also nur eigene Heizprofile.
- **Szenario 1, fachlich möglich:** Löschen lässt sich nur ein Gebäude ohne Wohnungen (`building.service.ts:195–212`). «Ahornhof» hat im Szenario keine Wohnungen. Es geht dabei keine Abrechnung und kein Mietvertrag verloren.
- **«Für dieses Gebäude entsteht keine neue.»:** Das stimmt mit `contractsInPeriod` überein (alle Mietverträge gefiltert, `generateStatements` ruft nichts auf). Inhaltlich passt es zu `statements_existing_note` («erhalten keine neue»).
- **Mietrecht:** Die Texte verfügen nichts gegenüber dem Mieter. Sie verhindern eine zweite Abrechnung desselben Mietvertrags für dieselbe Periode, was zu Art. 4 Abs. 1 VMWG passt («jährlich mindestens einmal», keine doppelte Forderung). Einzige mietrechtliche Folge ist die Lücke aus V-1.

## Nicht bestätigt

- **Wortlaut Art. 4 Abs. 1 VMWG** stammt aus dem Snippet des Fedlex-Suchtreffers (`mmx search`, Treffer https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de). Die Seite selbst lädt per JavaScript, WebFetch lieferte nur die Hinweisseite. Mehrere Abschriften stimmen mit dem Snippet überein (justement.ch, Stand 1.10.2025; SVIT; Mieterverband 2026). Den Artikel auf der Fedlex-Seite selbst konnte ich nicht lesen.
- **Rumpfperiode nach einem Wechsel der Abrechnungsperiode** (V-1): Das Anforderungsdokument (`:31`) nennt sie nur als Vorschlag. Eine Norm, die die Rumpfperiode regelt, habe ich nicht gesucht (Praxis, **unsicher**).
- **fr/it/en-Fassungen** der geplanten Texte lagen nicht vor und sind nicht geprüft (Begriffe in `docs/design/i18n-begriffe.md:61`: Entwurf heisst «brouillon / bozza / draft», dort tritt dieselbe Doppeldeutigkeit wie in V-2 auf).
- **Ob ein eigenes Heizprofil, das in Abrechnungen verwendet wird, gelöscht werden kann** (also ob der Heizprofil-Text Abrechnungen betrifft): nur bis zur Sperre für vordefinierte Profile in `heating-profile.service` nachgesehen. Die Regel für eigene Profile habe ich nicht geprüft.
- `docs/anforderungen-vertragsende.md`: nur A-9 betrifft das Thema (siehe V-1). Sonst keine Regel zu den Szenarien gefunden.
