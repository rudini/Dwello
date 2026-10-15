# Fachreview #135, Runde 2: endgültige Texte

Gegenstand: Commit `4931f65` (Worktree `review-135-fach2`). Geprüft sind die Schlüssel `statements_draft_dropped_*` und `statements_building_billed_*` in `messages/{de,fr,it,en}.json:964–970`, die Szenarien `tests/e2e/features/statement-generate.feature:150–161` sowie der Code dahinter: `contractsOf` (`src/lib/server/statement-generation.ts:46–83`), `restoredSelection` und `droppedNotes` (`src/lib/statement-wizard.ts:252–283`) und `BuildingChoice.svelte:31–42`.

Bereits offen und hier nicht nochmals erhoben: die Zählregel (#199), der Begriff «Entwurf» (#200) und was der Assistent sonst mit einem ganz abgerechneten Gebäude tun soll (#201).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-8 | Verwalter | Minor | «Alle Mietverträge dieses Gebäudes …», «Der Mietvertrag …» und «{billed} von {total} Mietverträgen» sagen nicht, dass nur die Mietverträge **dieser Abrechnungsperiode** gezählt werden. Hat ein Gebäude frühere oder spätere Mietverträge, stimmt «Alle Mietverträge dieses Gebäudes» wörtlich nicht. |
| V-9 | Verwalter | Nit | Kein Test hält den Fall fest, für den der Text geändert wurde: eine Abrechnung, die die Periode nur **teilweise** abdeckt (Fall Helga). |

## Befunde

### V-8 (Minor): Die Texte nennen nicht, welche Mietverträge gezählt werden

**Beleg.**
- `src/lib/server/statement-generation.ts:60–62`: `inPeriod` enthält nur Mietverträge, die sich mit der Periode überschneiden (`c.startDate <= periodEnd && (!c.endDate || c.endDate >= periodStart)`). `total` ist `inPeriod.length` (`:80`).
- `messages/de.json:970`: «Alle Mietverträge dieses Gebäudes haben schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt.» `:969`: «Der Mietvertrag hat schon …». `:967–968`: «{billed} von {total} Mietverträgen hat/haben …». In fr, it und en steht dasselbe («Tous les contrats de bail de cet immeuble», «Tutti i contratti di locazione di questo immobile», «All rental contracts of this building»).
- Neben dem Text zeigt die Karte die Zahl der Wohnungen (`BuildingChoice.svelte:79–82`), nicht die Zahl der Mietverträge.

**Nachgerechnet.**
- Fall 1 (Daten wie in `statement-generate.feature:169–172`): Lindenhof hat Lea Graf 2023 mit Abrechnung 2023, dazu Eva Frei und Marc Huber 2024, beide mit Abrechnung 2024. Die Periode ist 2024. `inPeriod` umfasst Eva und Marc, also `total` 2 und `billed` 2. Der Text lautet: «Alle Mietverträge dieses Gebäudes haben schon eine Abrechnung, die diese Abrechnungsperiode … abdeckt.» Leas Mietvertrag gehört aber zu diesem Gebäude, und seine Abrechnung 2023 deckt 2024 nicht ab. Wörtlich ist der Satz also falsch. Die Folge «keine neue Abrechnung» stimmt trotzdem.
- Fall 2: Marc hat eine Abrechnung 2024. Eva ist am 31.12.2023 ausgezogen, ein Nachmieter beginnt am 01.01.2025. Dann gilt `total` 1 und `billed` 1. Der Text sagt «Der Mietvertrag hat schon eine Abrechnung …». Der Verwalter kennt in diesem Gebäude drei Mietverträge und weiss nicht, welcher gemeint ist.
- Fall 3: Das Gebäude hat 3 Wohnungen, eine davon stand 2024 leer, und es gab einen Mieterwechsel. Dann `total` 3, `billed` 1, und der Text lautet «1 von 3 Mietverträgen hat …». Die Rechnung stimmt. Woher die 3 kommt, sieht der Verwalter aber nicht: Zufällig gleich der Zahl der Wohnungen, gezählt sind jedoch andere Dinge.

**Warum.** Der Text in Schritt 2 soll erklären, warum für ein Gebäude keine oder weniger Abrechnungen entstehen. Wenn er «alle Mietverträge dieses Gebäudes» sagt, prüft ein unerfahrener Vermieter womöglich frühere Mietverträge oder glaubt, ein künftiger Mietvertrag sei schon abgerechnet. Die Zählregel steht in #199, nicht aber die Bezugsmenge (welche Mietverträge der Nenner zählt). Die ist neu in diesem Slice.

**Was es behebt** (Vorschlag; damit sich «sie» nicht doppelt beziehen lässt, steht «diesen Zeitraum»):
- k < n: «Von {total} Mietverträgen in dieser Abrechnungsperiode hat {billed} schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt.» und «… haben {billed} schon …». Alternativ bleibt die heutige Form und bekommt einen Zusatz: «{billed} von {total} Mietverträgen in dieser Abrechnungsperiode hat schon eine Abrechnung, die sie ganz oder teilweise abdeckt.»
- alle, n > 1: «Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen.»
- alle, n = 1: «Der einzige Mietvertrag in dieser Abrechnungsperiode hat schon …».
- Entsprechend fr «contrats de bail de cette période de décompte», it «contratti di locazione di questo periodo di conteggio», en «rental contracts in this billing period». Das Szenario `:161` und der DOM-Test ändern sich mit.

### V-9 (Nit): Der Fall der teilweisen Abdeckung hat keinen Test

**Beleg.** `src/__tests__/statement-generation.test.ts:61–72` prüft nur Abrechnungen, die ganz in der Periode liegen (`2024-05-01–2024-12-31`, `2024-01-01–2024-12-31`), und eine ganz ausserhalb (`2023`). Der Text wurde wegen einer Abrechnung geändert, die die Periode nur teilweise abdeckt (Persona Helga: Abrechnung 2024, Periode 10/2024–09/2025).

**Nachgerechnet.** Abrechnung 01.01.–31.12.2024, Periode 01.10.2024–30.09.2025: `2024-01-01 <= 2025-09-30` und `2024-12-31 >= 2024-10-01` ergeben «abgerechnet». Der Text «ganz oder teilweise abdeckt» stimmt also. Der Grenzfall dazu, eine Abrechnung bis 30.09.2024 bei derselben Periode: `2024-09-30 >= 2024-10-01` ist falsch, also «nicht abgerechnet», ebenfalls richtig.

**Was es behebt.** Im Test `:61` eine Abrechnung ergänzen, die über den Periodenbeginn hinausragt, und eine, die am Tag davor endet. Ändert #199 die Regel, zeigt der Test dann, dass der Text mitgehen muss.

## Status der Befunde aus Runde 1

| ID | Status in 4931f65 | Beleg |
|---|---|---|
| V-1 | Text behoben («ganz oder teilweise abdeckt» beschreibt die Überschneidungsregel genau), Regel offen in #199 | `de.json:967–970`, Marker `statement-generation.ts:47` |
| V-2 | Text behoben («aus Ihren Angaben», wie `ui_draft_back`), Begriff offen in #200 | `de.json:964–966`, `:39` |
| V-3 | behoben: «Dwello hat es aus der Auswahl entfernt. Prüfen Sie die Gebäude …» entspricht `restoredSelection` (es wird nur das gelöschte Gebäude herausgefiltert) | `statement-wizard.ts:257` |
| V-4 | behoben: `_one` und `_many` für k < n, `_all_one` und `_all_many`; bei 0 abgerechneten erscheint kein Text | `BuildingChoice.svelte:33–41` |
| V-5 | behoben: gezählt werden verschiedene Mietverträge (`Set` der `contractId`, Schnitt mit `inPeriod`); getestet mit zwei Abrechnungen für einen Mietvertrag | `statement-generation.ts:55–63`, Test `:61–72` |
| V-6 | behoben: «Abrechnungsperiode» | `de.json:967–970` |
| V-7 | behoben: der vorhandene Angenommen-Schritt wird verwendet | `statement-generate.feature:159` |

## Bestätigt

- **«… die diese Abrechnungsperiode ganz oder teilweise abdeckt»** gibt die Regel in `contractsOf:57` (`s.periodStart <= periodEnd && s.periodEnd >= periodStart`) genau wieder. Eine Überschneidung heisst, dass die Abrechnung mindestens einen Tag der Periode abdeckt, und «ganz» schliesst den Fall ein, dass ihre Periode die gewählte umfasst. Nachgerechnet am Szenario (Marc 2024, Periode 2024: ganz) und am Fall Helga (teilweise, siehe V-9).
- **Szenario `:158–161`, «1 von 2»:** Eva (01.01.–31.03.2024) und Marc (ab 01.05.2024) liegen beide in `inPeriod`, die Abrechnung von Marc überschneidet sich. Also `billed` 1 und `total` 2, damit `count < total` und `count === 1`, also `statements_building_billed_one`. Der Text im Szenario stimmt Wort für Wort mit `de.json:967` überein.
- **Zahl und Verb:** 1 von n ergibt «hat» (fr «a», it «ha», en «has»), k von n mit k > 1 ergibt «haben» (fr «ont», it «hanno», en «have»). Bei 0 abgerechneten erscheint kein Text (`BuildingChoice.svelte:33`). `billed > total` ist nicht möglich, weil `billed` eine Teilmenge von `inPeriod` ist (`:63`).
- **«Für dieses Gebäude entsteht keine neue Abrechnung.»** Wenn `billed === total`, filtert `contractsInPeriod` (`:71–73`) alle Mietverträge des Gebäudes heraus. Vorschau und Lauf rufen für dieses Gebäude also nichts auf. Der Satz stimmt. «Sie müssen es nicht wählen» stimmt ebenfalls. Was beim Wählen sonst geschieht, ist #201.
- **Wegfall von Gebäuden:** `restoredSelection` (`statement-wizard.ts:253–268`) behält die übrigen gewählten Gebäude und zählt nur die gelöschten (`dropped.buildings`). `droppedNotes` (`:271–283`) wählt die Form `_one` bei 1 und sonst `_many`. «{count} Gebäude … gibt es nicht mehr» ist richtig, denn «es gibt» bleibt auch im Plural im Singular. «Dwello hat es/sie aus der Auswahl entfernt» stimmt, weil das Gebäude nur im Entwurf stand, wenn es gewählt war (`draft.buildingIds`). Der Schrittname kommt aus `statements_step_buildings`, und dieser ist in `statement-wizard.ts:24–28` Schritt 2.
- **Wegfall des Heizprofils:** Die Meldung erscheint nur, wenn ein gewähltes Heizprofil fehlt. War keines gewählt (`''`), bleibt `heatingProfileId` gleich und `dropped.heatingProfile` falsch (Test `statement-wizard.test.ts:370`). «Wählen Sie … ein anderes» ist immer möglich, weil sich vordefinierte Heizprofile nicht löschen lassen (Runde 1). Schritt 3 heisst «Heizprofil und Verwaltungspauschale» (`de.json:820`) und ist der dritte Schritt.
- **Glossar und i18n-Begriffe:** Gebäude/immeuble/immobile/building, Mietvertrag/contrat de bail/contratto di locazione/rental contract, Abrechnung/décompte/conteggio/statement, Abrechnungsperiode/période de décompte/periodo di conteggio/billing period und Heizprofil/profil de chauffage/profilo di riscaldamento/heating profile entsprechen `UBIQUITOUS_LANGUAGE.md:127–129` und `docs/design/i18n-begriffe.md:9, 25, 49, 52, 54`. Die Schrittnamen in fr, it und en entsprechen `messages/*.json:819–820`.
- **Stil:** Die Anrede ist förmlich (Sie, vous, Lei), und es steht «ss» statt «ß». In fr stehen französische Guillemets mit geschütztem Leerzeichen innen (geprüft per `od -c`: `« {step} »` mit U+00A0), in de, it und en Guillemets ohne Leerzeichen, wie es `i18n-begriffe.md:5` und die übrigen en-Texte verlangen. «de vos saisies», «dei suoi dati» und «from your entries» passen zu `ui_draft_back` in der jeweiligen Sprache (`messages/*.json:39`).
- **Mietrecht:** Die Texte verfügen nichts gegenüber dem Mieter und sagen nichts zur Rechtslage. Sie erklären nur, für welche Mietverträge der Lauf keine weitere Abrechnung erstellt. Eine neue mietrechtliche Aussage, die eine Fedlex-Stelle bräuchte, gibt es nicht. Die mietrechtliche Lücke nach einem Wechsel der Abrechnungsperiode (Runde 1, V-1, Art. 4 Abs. 1 VMWG) gehört zu #199.
- `docs/nebenkostenabrechnung-anforderungen.md` (Regel 7, «Eine Abrechnung pro Mietvertrag und Periode») und `docs/anforderungen-vertragsende.md` (A-9) enthalten nichts, das den neuen Texten widerspricht, ausser der Zählregel, die zu #199 gehört.

## Nicht bestätigt

- **Eigene Heizprofile, die in Abrechnungen verwendet werden:** Ob sie sich löschen lassen, habe ich wie in Runde 1 nicht geprüft. Für den Text ist das ohne Belang, denn er spricht nur von der Auswahl im Assistenten.
- **Wortlaut Art. 4 Abs. 1 VMWG:** Er wurde in dieser Runde nicht erneut auf Fedlex nachgelesen, weil keine neue Rechtsaussage zu prüfen war. Der Stand aus Runde 1 gilt weiter (Snippet aus der Suche, **unsicher**).
- **`statements_existing_note`** (`de.json:1005`, «Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue.»): Dieser vorhandene Text beschreibt dieselbe Überschneidungsregel noch mit «in dieser Periode», also anders als die neuen Texte. Er wurde im Slice nicht geändert. Ich zähle ihn zum Umfang von #199 und erhebe ihn nicht als Befund. Ob er in #199 erwähnt ist, habe ich nicht nachgesehen.
- **Darstellung im Browser:** Ich habe nur Code und Texte gelesen, die App selbst habe ich nicht angesehen.
