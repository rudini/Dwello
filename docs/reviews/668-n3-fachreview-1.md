# Fach-Review 668-n3, Runde 1 (Schritt 1): Rückfrage beim Verlassen von «Mietvertrag bearbeiten»

Gegenstand: @wip-Szenarien ab «Abbrechen mit ungespeicherten Änderungen fragt nach» in `tests/e2e/features/contract-edit.feature` (Worktree `review-668-n3-fach`, 3b1476c, Diff gegen dfb15f9), #668 «Decided (product owner)» Punkt 2.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Der Pfad (Breadcrumb) «Mietverträge › Mietvertrag von {name}» und der Link «Neuen Mietvertrag für {name} erfassen» verlassen das Formular ebenfalls; dafür fehlen Szenario und Regel |
| V-2 | Verwalter | Minor | Dass Dwello nach «Änderungen verwerfen» dorthin geht, wo geklickt wurde, prüft nur das Abbrechen-Szenario, dessen Ziel ohnehin die Detailseite ist. Fix: im Hauptnavigations-Szenario `Und der Liegenschaftsverwalter verwirft die Änderungen` / `Dann ist der Liegenschaftsverwalter auf der Liste der Mietverträge` ergänzen (bestehenden Listen-Schritt verwenden) |
| V-3 | Verwalter | Minor | Vorschlag `contracts_leave_text` «Sie haben diesen Mietvertrag geändert …»: Der Mietvertrag ist gerade *nicht* geändert, und der Text sagt nicht, was bleibt. Bei einem roten Danger-Button kann ein unerfahrener Vermieter meinen, der Mietvertrag selbst gehe verloren. Fix: Text aus der Tabelle unten |

## V-1 (Major): Nicht alle Wege aus dem Formular sind abgedeckt

- Beleg: `src/routes/contracts/[id]/edit/+page.svelte:24-30`. `PageHeader` hat `trail` mit Links auf `/contracts` und `/contracts/{id}`. `src/routes/contracts/ContractForm.svelte:302-306`: Link `contract-parties-new` (nur bei erfasstem Vertragsende) auf `/contracts/new?...`. Die Szenarien decken «Abbrechen», `contract-parties-link`, den Link im Hinweis und die Hauptnavigation ab, aber keinen dieser beiden Links.
- Warum falsch: Der PO hat in #668 Punkt 2 entschieden: «leaving the edit form after something was changed asks first». Die Liste danach («This covers …») nennt die damals bekannten Wege. Ein Klick auf den Pfad verliert die eingetragene Nettomiete aber genauso ohne Rückfrage wie vor dem Fix (Persona Sven N-3). Das ist genau der Fehler, den N-3 beheben soll. Nach dem «Neuen Mietvertrag erfassen» ist der Verlust sogar schlimmer: Der Verwalter meint, er habe das Vertragsende geändert, und erfasst den Nachfolgevertrag auf ein falsches Datum.
- Fix: Die Rückfrage für jede Navigation innerhalb der App aus dem Formular auslösen, nicht pro Link (z. B. eine Prüfung vor jeder Navigation, die nach dem Speichern nicht greift), und ein Szenario für den Pfad ergänzen:
  `Szenario: Der Pfad fragt bei ungespeicherten Änderungen nach` / `Wenn der Liegenschaftsverwalter die Nettomiete "980" einträgt` / `Und der Liegenschaftsverwalter im Pfad "Mietverträge" wählt` / `Dann fragt Dwello vor dem Verlassen "Änderungen verwerfen?"`.
  Der Link `contract-parties-new` braucht keinen eigenen Seed: Ein Test auf tieferer Ebene oder dieselbe allgemeine Prüfung genügt. Wer die Liste des PO als abschliessend liest, braucht dafür eine Entscheidung im Issue (`needs-decision`). Ich lese den Satz davor als die Regel.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_leave_title | Änderungen verwerfen? | `"Abandonner les modifications ?"` (wie `ui_draft_discard_title`, U+00A0 vor «?») | Scartare le modifiche? | Discard changes? |
| contracts_leave_text | Ihre Änderungen sind noch nicht gespeichert und gehen verloren. Der Mietvertrag bleibt, wie er zuletzt gespeichert wurde. | `"Vos modifications ne sont pas encore enregistrées et seront perdues. Le contrat de bail reste tel qu’il a été enregistré la dernière fois."` | Le modifiche non sono ancora salvate e andranno perse. Il contratto di locazione resta com’era salvato l’ultima volta. | Your changes are not saved yet and will be lost. The rental contract stays as it was last saved. |
| contracts_leave_confirm | Änderungen verwerfen | `"Abandonner les modifications"` | Scartare le modifiche | Discard changes |
| contracts_leave_cancel | Weiter bearbeiten | `"Continuer à modifier"` | Continuare a modificare | Keep editing |

Passung zu den bestehenden Texten: Das Verb «verwerfen» und der Aufbau (Titel als Frage, Button wiederholt das Verb) entsprechen `ui_draft_discard_title`/`ui_draft_discard`. «Änderungen» statt «Angaben» passt, weil der Mietvertrag schon besteht. Der Assistent spricht von «Angaben», weil es noch keinen Datensatz gibt. «gehen verloren» statt «werden gelöscht» passt, weil hier kein Entwurf im Browser gelöscht wird, sondern ungespeicherte Eingaben verfallen, wie in `invoices_upload_discard_text`. Im fr steht «Abandonner» statt «Supprimer». Es folgt `invoices_upload_discard_confirm_created` («Abandonner les autres fichiers»), weil «Supprimer les modifications» wie das Löschen gespeicherter Änderungen klingt. «Weiter bearbeiten», «Continuer à modifier», «Continuare a modificare» und «Keep editing» folgen `invoices_upload_keep_going` und `i18n-begriffe.md` («bearbeiten | modifier | modificare | edit», «Mietvertrag | contrat de bail | contratto di locazione | rental contract»). Italienisch steht ohne Anredepronomen, deshalb stellt sich die Frage nach der Gross- oder Kleinschreibung von «suoi» nicht.

Szenariozeilen mit zitiertem Text (endgültig, unverändert): `Dann fragt Dwello vor dem Verlassen "Änderungen verwerfen?"` (Szenarien «Abbrechen mit ungespeicherten Änderungen fragt nach», «Der Link zum Mietvertrag …», «Der Hinweis unter «Befristet» …», «Die Hauptnavigation …»). Die übrigen neuen Zeilen zitieren keinen UI-Text, nur Werte (`"980"`, `"CHF 950.00"`, `"Anna Keller"`, `"Mietverträge"`).

Grep auf `origin/main` (ed4f826), `tests/e2e/features/*.feature`, ohne Treffer: «Änderungen verwerfen», «Weiter bearbeiten», «geändert und noch nicht gespeichert», «gehen Ihre Änderungen verloren». «Angaben verwerfen» kommt in `contract-new.feature:191`, `help.feature:24` und `statement-generate.feature:436/439` vor. Diese Texte bleiben unverändert (`ui_draft_*` nicht im Diff), keine Szenarioänderung nötig.

## Nicht bestätigt

- Zurück-Taste des Browsers (popstate) im selben Tab: Der PO nennt nur das Schliessen des Tabs (Browser-eigene Rückfrage). Ob «Zurück» die Dwello-Rückfrage oder die des Browsers zeigen soll, steht weder in #668 noch in `docs/PRD-Dwello.md` (nicht gesucht über die Issue-Entscheidung hinaus). Sollte mit V-1 entschieden werden.
- Eine Änderung, die wieder auf den gespeicherten Wert zurückgesetzt wird (980, dann wieder 950): Ob «geändert» gegen den gespeicherten Stand oder gegen «etwas getippt» gilt, steht nicht in der Entscheidung. Fachlich richtig ist der Vergleich mit dem gespeicherten Stand.
- Keine Mietrechts- oder Datenschutzregel betroffen: Es verlassen keine Daten den Server, und die Rückfrage betrifft weder Beträge noch Fristen. Deshalb kein Fedlex-Zitat.

Geprüft: «Saving never asks» ist durch das bestehende Szenario «Mietzins anpassen» gesichert, «nur wenn geändert» durch «Bearbeitung abbrechen» (beide nicht @wip). Begriffe Nettomiete, Mietvertrag, Liegenschaftsverwalter und Befristet entsprechen `UBIQUITOUS_LANGUAGE.md`. Dass der Hinweis-Link nach dem Verwerfen auf die Detailseite führt, ist fachlich richtig, weil das angekreuzte «Befristet» genau die Eingabe ist, vor der der Hinweis warnt.
