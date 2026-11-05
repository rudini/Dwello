# Fach-Review Schritt 1, Runde 1: #666 Hinweis «Mietverträge nicht geladen» (cf5a09b)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Wird nur der Text (`_unknown_text`) zur Screenreader-Beschreibung von «Wohnung» und «Vertragsbeginn» (#665), fehlt dort das Wichtigste, nämlich dass Dwello beim Speichern prüft. Das steht nach dem neuen Aufbau nur im Titel. |
| V-2 | Verwalter | Minor | Der Entwurf «Mehr dazu oben bei der Wohnung.» (`_see_apartment`, contract-edit.feature:95) sagt nicht, was oben zu tun ist. Ersatz: «Erneut versuchen» steht oben bei der Wohnung (Tabelle unten). |
| V-3 | Verwalter | Minor | `contracts_delete_draft_contracts_unknown` (ContractForm.svelte:231, derselbe Zustand) behält «Überschneidung» und «Wählen Sie «Erneut versuchen»». Damit klingt er anders als der neue Hinweis. Fix: in einem Folge-Issue mit «frei» und ohne «Wählen Sie» neu formulieren. Der Schlüssel gehört nicht zu #666. |

## V-1 (Major)

- **Beleg:** In `src/routes/contracts/new/ContractsUnknown.svelte:28-38` stehen Titel (`_unknown`) und Text (`_unknown_text` / `_see_apartment`) getrennt. Laut Auftrag wird nur der Text zur Beschreibung (#665). Die @wip-Szenarien contract-new.feature:123 und :130 sowie contract-edit.feature:86 prüfen nur einen Satz aus dem Text.
- **Warum falsch:** #666 verlangt «das Wichtigste zuerst». Neu ist der Titel die Aussage «Dwello prüft beim Speichern, ob die Wohnung frei ist», und der Text nennt nur die Ursache. Wer das Feld mit dem Screenreader erreicht, hört dann nur «Die anderen Mietverträge … liessen sich nicht laden …». Er erfährt nicht, dass er trotzdem speichern kann. Am Vertragsbeginn der Bearbeitung wäre die Beschreibung nur der Verweis auf die Wohnung, ganz ohne Zusammenhang. Die Alternative wäre, die Prüf-Aussage auch in den Text zu schreiben. Dann steht sie sichtbar zweimal da, und der Hinweis wird wieder lang.
- **Fix:** `aria-describedby` des Felds zeigt auf Titel **und** Text des Hinweises (zwei IDs, Titel zuerst). Die Screenreader-Szenarien zitieren den Titel (Ersatz unten). Der Wortlaut unten geht davon aus, dass beides zusammen gelesen wird. Beschreibung von «Wohnung» (Schritt 2): «Dwello prüft beim Speichern, ob die Wohnung frei ist. Die anderen Mietverträge dieser Wohnung liessen sich nicht laden. Ihre Eingaben bleiben erhalten.»

## Wortlaut

Unverändert bleiben `contracts_apartment_contracts_retry`, `_loaded`, `_retry_failed` und `_loading`: Sie sind kurz, stellen keine Anweisung zum Klicken oder Tippen und verwenden nicht «Überschneidung». Im Französischen ist jedes Leerzeichen innerhalb von « » ein U+00A0, der Apostroph ist U+2019 wie in den bestehenden Schlüsseln.

| key | de | fr | it | en |
|-----|----|----|----|----|
| contracts_apartment_contracts_unknown | Dwello prüft beim Speichern, ob die Wohnung frei ist | Dwello vérifie à l’enregistrement si l’appartement est libre | Dwello verifica al salvataggio se l’appartamento è libero | Dwello checks on saving whether the apartment is free |
| contracts_apartment_contracts_unknown_text | Die anderen Mietverträge dieser Wohnung liessen sich nicht laden. Ihre Eingaben bleiben erhalten. | Les autres contrats de bail de cet appartement n’ont pas pu être chargés. Vos saisies sont conservées. | Non è stato possibile caricare gli altri contratti di locazione di questo appartamento. I dati inseriti restano invariati. | The other rental contracts for this apartment could not be loaded. Your entries are kept. |
| contracts_apartment_contracts_see_apartment | «Erneut versuchen» steht oben bei der Wohnung. | « Réessayer » se trouve plus haut, dans la partie Appartement. | «Riprovare» si trova sopra, al campo dell’appartamento. | «Try again» is above, at the apartment. |

### Alt und neu je Schlüssel und Sprache

| key | Sprache | alt | neu |
|-----|---------|-----|-----|
| _unknown | de | Überschneidung noch nicht geprüft | Dwello prüft beim Speichern, ob die Wohnung frei ist |
| _unknown | fr | Chevauchement pas encore vérifié | Dwello vérifie à l’enregistrement si l’appartement est libre |
| _unknown | it | Sovrapposizione non ancora verificata | Dwello verifica al salvataggio se l’appartamento è libero |
| _unknown | en | Overlap not checked yet | Dwello checks on saving whether the apartment is free |
| _unknown_text | de | Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten. Beim Speichern prüft Dwello in jedem Fall, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet. | Die anderen Mietverträge dieser Wohnung liessen sich nicht laden. Ihre Eingaben bleiben erhalten. |
| _unknown_text | fr | Dwello n’a pas pu charger les contrats de bail de cet appartement. Choisissez « Réessayer » ; vos saisies sont conservées. Lors de l’enregistrement, Dwello vérifie dans tous les cas si la période chevauche un autre contrat de bail de cet appartement. | Les autres contrats de bail de cet appartement n’ont pas pu être chargés. Vos saisies sont conservées. |
| _unknown_text | it | Dwello non ha potuto caricare i contratti di locazione di questo appartamento. Scelga «Riprovare»; i dati inseriti restano invariati. Al salvataggio Dwello verifica in ogni caso se il periodo si sovrappone a un altro contratto di locazione di questo appartamento. | Non è stato possibile caricare gli altri contratti di locazione di questo appartamento. I dati inseriti restano invariati. |
| _unknown_text | en | Dwello could not load the rental contracts for this apartment. Choose «Try again»; your entries are kept. When you save, Dwello always checks whether the period overlaps with another rental contract for this apartment. | The other rental contracts for this apartment could not be loaded. Your entries are kept. |
| _see_apartment | de | Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung. | «Erneut versuchen» steht oben bei der Wohnung. |
| _see_apartment | fr | Les contrats de bail de cet appartement manquent encore, voir plus haut, dans la partie Appartement. | « Réessayer » se trouve plus haut, dans la partie Appartement. |
| _see_apartment | it | Mancano ancora i contratti di locazione di questo appartamento: veda sopra, al campo dell’appartamento. | «Riprovare» si trova sopra, al campo dell’appartamento. |
| _see_apartment | en | The rental contracts for this apartment are still missing, see the apartment above. | «Try again» is above, at the apartment. |

Länge (de): Titel und Text zusammen 150 Zeichen statt 263. Schritt 3 und die Prüfung des Assistenten zeigen damit nur noch zwei kurze Sätze und den Knopf.

## Ersatz der Szenariozeilen

Alle Zeilen prüfen mit `toContain` (contract-form.steps.ts:286-296 und die neuen Screenreader-Schritte). Bei den Zeilen auf `main` ohne `@wip` braucht es die Freigabe des Product Owners (`Spec change approved`).

| Datei:Zeile | Szenario | alt | neu |
|-------------|----------|-----|-----|
| contract-new.feature:108 | Mietverträge der Wohnung lassen sich nicht laden (main) | `Dann sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "Überschneidung noch nicht geprüft"` | `Dann sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist"` |
| contract-new.feature:114 | Die Prüfung nennt die nicht geladenen Mietverträge (main) | `Dann sieht der Liegenschaftsverwalter in der Prüfung den Hinweis "Überschneidung noch nicht geprüft"` | `Dann sieht der Liegenschaftsverwalter in der Prüfung den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist"` |
| contract-edit.feature:78 | Mietverträge der Wohnung lassen sich nicht laden (main) | `Dann sieht der Liegenschaftsverwalter bei der Wohnung den Hinweis "Überschneidung noch nicht geprüft"` | `Dann sieht der Liegenschaftsverwalter bei der Wohnung den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist"` |
| contract-edit.feature:79 | dito (main) | `Und sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung."` | `Und sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "«Erneut versuchen» steht oben bei der Wohnung."` |
| contract-edit.feature:112 | … auch beim zweiten Mal nicht laden (main) | `Dann meldet Dwello den Fehler "Die Mietverträge der Wohnung konnten wieder nicht geladen werden."` | unverändert (`_retry_failed` bleibt) |
| contract-edit.feature:93 | #666 @wip | `Dann sieht … bei der Wohnung den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist"` | unverändert |
| contract-edit.feature:94 | #666 @wip | `Und sieht … bei der Wohnung den Hinweis "Die anderen Mietverträge dieser Wohnung liessen sich nicht laden. Ihre Eingaben bleiben erhalten."` | unverändert |
| contract-edit.feature:95 | #666 @wip | `Und sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "Mehr dazu oben bei der Wohnung."` | `Und sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "«Erneut versuchen» steht oben bei der Wohnung."` |
| contract-new.feature:123 | #665 @wip, Wohnungsauswahl | `… den Hinweis "Dwello konnte die Mietverträge dieser Wohnung nicht laden." vor` | `Dann liest ein Screenreader bei der Wohnungsauswahl den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist. Die anderen Mietverträge dieser Wohnung liessen sich nicht laden." vor` (V-1) |
| contract-new.feature:130 | #665 @wip, Vertragsbeginn | `… den Hinweis "Dwello konnte die Mietverträge dieser Wohnung nicht laden." vor` | `Dann liest ein Screenreader beim Vertragsbeginn den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist. Die anderen Mietverträge dieser Wohnung liessen sich nicht laden." vor` (V-1) |
| contract-edit.feature:86 | #665 @wip, Vertragsbeginn | `… den Hinweis "Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung." vor` | `Dann liest ein Screenreader beim Vertragsbeginn den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist. «Erneut versuchen» steht oben bei der Wohnung." vor` (V-1) |

Mit grep über `tests/e2e/features` nach jedem alten Text gesucht: keine weiteren Zeilen. Auch die DOM-Tests zitieren die alten Texte: `src/__tests__/contract-edit.dom.test.ts:501,507` und `src/__tests__/contract-wizard.dom.test.ts:70`. Der Kommentar contract-edit.feature:76 («… eine Überschneidung nicht auszuschliessen») ist kein Zitat und darf so bleiben.

## Fehlender Begriff

«frei» (für Wohnung oder Zeitraum) fehlt in `UBIQUITOUS_LANGUAGE.md`, ebenso «Überschneidung». Die App verwendet «frei» aber schon im selben Ablauf (`contracts_checking_apartments`, `contracts_free_later`; fr libre, it libero, en free). Vorschlag für eine Zeile (Issue mit `domain`, `needs-decision`): **frei (Wohnung)**: Für den Zeitraum eines Mietvertrags hat die Wohnung keinen anderen Mietvertrag. Nicht dasselbe wie der Mietstatus «Leer»: Eine vermietete Wohnung ist ab dem Tag nach dem Vertragsende frei.

## Nicht bestätigt

- Marco 3-6 im Bericht `marco-b13-retry.md`: Die Datei liegt nicht im Worktree und ist auch in keinem Commit (`git log --all -- 'docs/design/personas/marco*b13*'`) zu finden. Bestätigt sind die Punkte nur über den Text von #666 und `docs/archive/offene-punkte.md:26`. Helga H3/H12 habe ich in `git show c893731^:docs/design/personas/helga-b13-retry.md` gelesen.
- Wie #665 `aria-describedby` umsetzt (nur Text, oder Titel und Text): Im Commit gibt es dazu noch keinen Code, deshalb V-1.

Geprüft: Die Rückweisung beim Speichern gibt es tatsächlich, beim Erfassen (`backend/src/services/contract.service.ts:361`) und beim Bearbeiten (:438, `CONTRACT_OVERLAP`). Der Assistent lässt mit nicht geladenen Mietverträgen bis zur Prüfung weitergehen, die Aussage des Titels stimmt also. Mit «anderen» trifft «frei» auch beim Bearbeiten zu. Die Texte machen keine Aussage über Mietrecht: Das OR verbietet zwei Mietverträge für dieselbe Wohnung nicht, es ist eine Regel des Produkts. Darum war kein Fedlex-Zitat nötig. Die Begriffe Mietvertrag, Wohnung und Vertragsbeginn sowie die Übersetzungen kommen aus `UBIQUITOUS_LANGUAGE.md` und `docs/design/i18n-begriffe.md:15,35-36`. Die Texte stellen keine Anweisung zum Klicken oder Tippen.
