# Fachreview 3: Assistent «Abrechnungen erstellen», #251, #201 (nur neue Texte)

Gegenstand: `git diff b881ac0 f323923 -- messages src/routes/statements/generate/BuildingChoice.svelte tests/e2e/features`. Worktree: `/tmp/claude-0/-home-user-Dwello/987bcc32-5bc2-548b-b1db-07cf87dd37fd/scratchpad/review-wizard-fach3` (f323923). Vorbericht: `docs/reviews/wizard-fachreview-2.md`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-9 | Verwalter | erledigt | Bei offenen Tagen fehlen «Sie müssen es nicht wählen» und der Rat zum Löschen und neu Erstellen. Die Texte stimmen mit dem Code überein. |
| V-10 | Verwalter | erledigt | fr/it-Nachsatz wie vorgeschlagen. |
| V-11 | Verwalter | erledigt | fr `ui_draft_discard_title` hat jetzt U+00A0 vor «?». |
| V-12 | Verwalter | Minor | «Mietdauer» steht nicht im Glossar. Gemeint sind die «Mietstage» (Glossar Z. 162). Den Wortlaut hatte ich in Bericht 2 selbst vorgeschlagen und dabei fälschlich geschrieben, er verwende nur Begriffe aus dem Glossar. |
| V-13 | Verwalter | Minor | fr «cette exécution» und it «questa esecuzione» für «dieser Lauf» weichen von `i18n-begriffe.md:56` und von den bestehenden Texten ab. |
| V-14 | Verwalter | Nit | Im Fall mit einem einzigen Mietvertrag folgt auf «hat schon eine Abrechnung» der Satz «Mindestens eine dieser Abrechnungen …», also ein Plural ohne Bezug. |

## V-12 (Verwalter, Minor): «Mietdauer» statt «Mietstage»

**Beleg.**
- `messages/de.json:1057` `statements_building_billed_open`: «Mindestens eine dieser Abrechnungen deckt die Mietdauer in dieser Abrechnungsperiode nicht ganz ab. Für die übrigen Tage erstellt dieser Lauf keine Abrechnung.»
- `UBIQUITOUS_LANGUAGE.md:162`: «**Mietstage** | Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft.» «Mietdauer» kommt im Glossar nicht vor (grep über `UBIQUITOUS_LANGUAGE.md`, auch nicht als Synonym). Die UI verwendet «Mietstage» schon (`de.json:984-985`, «Mietstage in der Abrechnungsperiode»).
- `docs/design/i18n-begriffe.md:63`: Mietstage = «jours de location» / «giorni di locazione» / «days rented». Die Übersetzungen sagen statt dessen «durée du bail», «durata della locazione» und «tenancy».

**Warum.** CLAUDE.md, «Design-Regeln»: Fachbegriffe nur aus dem Glossar. Für genau diesen Sachverhalt gibt es einen Begriff. Inhaltlich ist der Satz richtig: `partly` zählt die Mietverträge, deren Abrechnungen nicht alle Tage von `max(Vertragsbeginn, Periodenbeginn)` bis `min(Vertragsende, Periodenende)` decken (`src/lib/server/statement-generation.ts:74-82`). Das sind genau die Mietstage.

**Lösung.**
- de: «Mindestens eine dieser Abrechnungen deckt nicht alle Mietstage in dieser Abrechnungsperiode ab. Für die übrigen Mietstage erstellt dieser Lauf keine Abrechnung.»
- fr: «Au moins un de ces décomptes ne couvre pas tous les jours de location de cette période de décompte. Pour les autres jours de location, aucun décompte n’est établi maintenant.» (siehe V-13)
- it: «Almeno uno di questi conteggi non copre tutti i giorni di locazione di questo periodo di conteggio. Per gli altri giorni di locazione questo allestimento non crea alcun conteggio.» (siehe V-13)
- en: «At least one of these statements does not cover all days rented in this billing period. This run creates no statement for the other days rented.»
- Die Erwartung im Szenario `statement-generate.feature:226` gleich anpassen.

## V-13 (Verwalter, Minor): «Lauf» in fr/it

**Beleg.**
- `messages/fr.json:1057`: «… cette exécution n’établit aucun décompte.» `messages/it.json:1057`: «… questa esecuzione non allestisce alcun conteggio.»
- `docs/design/i18n-begriffe.md:56`: «Abrechnungslauf | établissement des décomptes ❓ | allestimento dei conteggi ❓ | statement run ❓». `UBIQUITOUS_LANGUAGE.md:149` definiert den Abrechnungslauf.
- Für dasselbe «dieser Lauf» schreiben die bestehenden Texte: fr «tous les décomptes établis maintenant» (`statements_fee_help`, `fr.json:1075`), «lors de l’établissement des décomptes» (`fr.json:1142`); it «tutti i conteggi di questo allestimento» (`it.json:1075`); en «this run» (`en.json:1075`).

**Warum.** «exécution» und «esecuzione» sind technische Wörter («Ausführung eines Programms»). Sie stehen nirgends sonst in der UI und weichen von der Tabelle ab, die die Übersetzungen festlegt. Der Begriff ist dort zwar noch mit ❓ markiert (#83), aber das ist kein Grund für ein drittes Wort.

**Lösung.** Wie unter V-12: fr «aucun décompte n’est établi maintenant», it «questo allestimento non crea alcun conteggio». de «dieser Lauf» und en «this run» können bleiben, so steht es schon in `settings_fee_suggestion` bzw. `statements_fee_help`.

## V-14 (Verwalter, Nit): Plural ohne Bezug bei einem Mietvertrag

**Beleg.** `BuildingChoice.svelte:43-52` setzt `statements_building_billed_all_partly_one` («Der einzige Mietvertrag … hat schon eine Abrechnung …») vor `statements_building_billed_open` («Mindestens eine dieser Abrechnungen …»). Dasselbe gilt für `statements_building_billed_one` mit `billed = 1`. Genau so steht es im Szenario `statement-generate.feature:226`.

**Warum.** Der Leser sucht «diese Abrechnungen» und findet nur eine. Das ist verständlich, aber holprig. Der Inhalt bleibt richtig, auch wenn ein Mietvertrag zwei Abrechnungen mit einer Lücke hat.

**Lösung (wahlweise).** Ein eigener Schlüssel für `billed === 1`, zum Beispiel de «Sie deckt nicht alle Mietstage in dieser Abrechnungsperiode ab. Für die übrigen Mietstage erstellt dieser Lauf keine Abrechnung.», fr «Il ne couvre pas tous les jours de location …», it «Non copre tutti i giorni di locazione …», en «It does not cover all days rented …». Wer keinen Schlüssel mehr will, kann es lassen.

## Bestätigt

- **V-9.** Ist `partly > 0`, zeigt `BuildingChoice.svelte:43-52` weder «Sie müssen es nicht wählen …» noch `statements_building_recalculate`, sondern nur den ersten Satz und `statements_building_billed_open`. Das gilt sowohl wenn alle Verträge abgerechnet sind als auch wenn nur ein Teil abgerechnet ist (`count < total`). Beides ist richtig:
  - «Für die übrigen Tage erstellt dieser Lauf keine Abrechnung» stimmt. `partly` ist eine Teilmenge von `billed` (`statement-generation.ts:74`), und `contractsInPeriod` überspringt jeden Vertrag in `billed` (`statement-generation.ts:89-93`).
  - Dass der Rat zum Löschen wegfällt, ist richtig. Nachgerechnet am Szenariofall: Marc Huber ab 01.05.2024 hat die Abrechnung 2024. Der Lauf geht vom 01.07.2024 bis 30.06.2025. Wer den Entwurf 2024 löscht und neu erstellt, rechnet 01.07.2024–30.06.2025 ab. Die Mietstage 01.05.–30.06.2024 (61 Tage) blieben dann ohne Abrechnung. Wenn alle Tage abgedeckt sind (`partly = 0`), bleibt der Rat stehen. Das ist der Fall aus Bericht 2, V-3.
  - Fall `partly = 0`: Der Text ist unverändert, wie in Bericht 2 bestätigt.
  - Der Text stellt keine Rechtsbehauptung auf, er warnt nur. Rechtsgrundlage für die Warnung ist Art. 4 Abs. 1 VMWG (SR 221.213.11, https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de, Snippet über `mmx search`): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
- **Szenario.** `statement-generate.feature:226` prüft den ganzen Text genau (`statement-generate.steps.ts:328-330`, `toBe`). Damit ist auch geprüft, dass «Sie müssen es nicht wählen» fehlt.
- **V-10.** fr «Si vous le choisissez, aucun décompte n’est créé pour cet immeuble.» und it «Se lo sceglie, non viene allestito alcun conteggio.» stehen in beiden `_all_one/_many`-Schlüsseln, wie vorgeschlagen.
- **V-11.** `fr.json:41`: Die Bytes vor «?» sind `302 240` (U+00A0).
- **Neue Sätze `_all_partly_one/_many`.** In allen vier Sprachen stimmen sie wörtlich mit dem ersten Satz von `_all_one/_many` überein. Die Begriffe contrat de bail / contratto di locazione / rental contract und période de décompte / periodo di conteggio / billing period entsprechen `i18n-begriffe.md`. fr/it/en enthalten kein Deutsch.
- **Knopf zum Verwerfen (#57).** «Angaben verwerfen», «Supprimer les saisies», «Scartare i dati» und «Discard entries» stimmen in allen Sprachen mit dem Dialogtitel und mit `ui_draft_back` («Ihre Angaben» / «Vos saisies» / «I suoi dati» / «Your entries») überein. `ui_draft_discard_confirm` ist entfernt. Knopf und Bestätigung verwenden beide `ui_draft_discard` (`src/lib/ui/DraftNotice.svelte:52, 68`), der Text ist also derselbe. Das it-Verb im Infinitiv folgt der bisherigen Form («Scartare la bozza»).
- **M-2** bleibt wie angekündigt bei #281. Die Änderung macht die leere Vorschau weder häufiger noch widersprüchlicher. Schritt 2 warnt jetzt sogar ausdrücklich vor den offenen Tagen.

## Fehlende Begriffe

Keine. «Mietstage» steht schon im Glossar und in `i18n-begriffe.md` (V-12). «Abrechnungslauf» ist in #83 (❓) schon offen.

## Nicht bestätigt

- Die Szenarien habe ich nicht ausgeführt. Die Prüfung beruht auf dem Lesen von `BuildingChoice.svelte`, `statement-generation.ts`, `BuildingStep.svelte` und den Schritten.
- Ob fr «maintenant» bzw. it «allestimento» für den Abrechnungslauf endgültig sind: Das entscheidet #83. Ich habe nur geprüft, dass die Vorschläge den bestehenden Texten folgen (`fr.json:1075, 1142`, `it.json:1075, 1142`).
