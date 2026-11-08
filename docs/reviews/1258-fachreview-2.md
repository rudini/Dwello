# Fachreview #1258, Runde 2 (Fix-Slice nach Personas, Commit 9fc09bd)

Geschlossen: V-1, V-2, V-3, V-5

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-4 | Verwalter | Minor | Bleibt offen (schon auf `main`): Eine erledigte Abrechnung (`settled`) steht in der Liste als «versendet» (`DeleteContract.svelte:36-40`). Fix: `settled` in `labels` aufnehmen. |
| V-6 | Verwalter | Major | Sven P-1: Die Beschreibung des Mietvertrag-Dialogs («Seine Mietstage sind abgerechnet in:») ist ohne die Liste kein Satz. Vorgelesen wird nur sie, der Grund fehlt. |
| V-7 | Verwalter | Minor | Sven P-2 / Anna: Nur der Titel beim Mieter nennt den Datensatz. Fix: alle drei Titel mit `{name}`, Wortlaut unten. Beim Gebäude wird dafür «Es enthält …» zu «Das Gebäude enthält …», denn «Es» passt nicht zu einem Namen wie «Birkenhof» (der Birkenhof). |
| V-8 | Verwalter | Minor | Anna P-2 / Sven P-4: Steht neben einer versendeten oder bezahlten Abrechnung auch ein Entwurf in der Liste, erklärt der Text den Entwurf nicht. Fix: `contracts_delete_billed_locked_drafts` unten. |

## V-6 (Major): Beschreibung ist ohne Liste kein vollständiger Satz

- Beleg: `src/lib/ui/Dialog.svelte:75-90`: Den Dialog beschreibt nur der erste Absatz `p`. `DeleteContract.svelte`: Der erste Absatz ist `contracts_delete_billed`, die `ul` folgt danach.
- Warum falsch: Wer einen Screenreader nutzt, hört «Seine Mietstage sind abgerechnet in:», aber nicht, worin. Der Grund für die Absage bleibt offen.
- Fix: `contracts_delete_billed` wird zu `contracts_delete_billed_one` / `_many` mit `{count}` = Länge von `billedBy`. ICU-Plural nutzen die Dateien bisher nicht, das Muster ist `_one`/`_many` wie bei `statements_status_shown_*`. Der Satz steht für sich, nennt die Abrechnungen und erklärt «Mietstage» gleich im Satz. So hilft er auch bei Anna P-1 und Sven P-5, ohne den Begriff umzubenennen. Die Liste braucht keine eigene Einleitung: «unten» verweist auf sie. Die Nummern hört man mit den Links, wenn man den Dialog durchgeht.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_delete_billed_one (neu, ersetzt contracts_delete_billed) | Die Nebenkostenabrechnung unten rechnet die Mietstage dieses Mietvertrags ab, also die Tage, an denen er in der Abrechnungsperiode lief. | Le décompte des charges ci-dessous inclut les jours de location de ce contrat de bail, c’est-à-dire les jours où il courait pendant la période de décompte. | Il conteggio spese accessorie qui sotto comprende i giorni di locazione di questo contratto di locazione, cioè i giorni in cui era in corso nel periodo di conteggio. | The utility cost statement below bills the days rented of this rental contract, that is the days it ran in the billing period. |
| contracts_delete_billed_many (neu) | Die {count} Nebenkostenabrechnungen unten rechnen die Mietstage dieses Mietvertrags ab, also die Tage, an denen er in der Abrechnungsperiode lief. | Les {count} décomptes des charges ci-dessous incluent les jours de location de ce contrat de bail, c’est-à-dire les jours où il courait pendant la période de décompte. | I {count} conteggi spese accessorie qui sotto comprendono i giorni di locazione di questo contratto di locazione, cioè i giorni in cui era in corso nel periodo di conteggio. | The {count} utility cost statements below bill the days rented of this rental contract, that is the days it ran in the billing period. |
| buildings_delete_refused_title (geändert) | {name} kann nicht gelöscht werden | L’immeuble {name} ne peut pas être supprimé | L’immobile {name} non può essere eliminato | {name} cannot be deleted |
| buildings_delete_has_apartments (geändert) | Das Gebäude enthält noch Wohnungen. | L’immeuble contient encore des appartements. | L’immobile contiene ancora appartamenti. | The building still contains apartments. |
| tenants_delete_refused_title (unverändert) | {name} kann nicht gelöscht werden | Le locataire {name} ne peut pas être supprimé | L’inquilino {name} non può essere eliminato | {name} cannot be deleted |
| contracts_delete_refused_title (geändert) | Mietvertrag von {name} kann nicht gelöscht werden | Le contrat de bail de {name} ne peut pas être supprimé | Il contratto di locazione di {name} non può essere eliminato | The rental contract of {name} cannot be deleted |
| contracts_delete_billed_locked_drafts (neu; ein eigener Absatz direkt nach contracts_delete_billed_locked, nur wenn `locked` und mindestens ein Eintrag in `billedBy` den Status `draft` hat) | Einen Entwurf aus der Liste zu löschen, hilft hier nicht: Der Mietvertrag bleibt wegen der versendeten oder bezahlten Abrechnung erhalten. | Supprimer un brouillon de la liste n’y change rien : le contrat de bail est conservé à cause du décompte envoyé ou payé. | Eliminare una bozza della lista non serve: il contratto di locazione resta a causa del conteggio inviato o pagato. | Deleting a draft from the list does not help: the rental contract stays because of the sent or paid statement. |

`contracts_delete_billed` entfällt. `{name}` ist beim Gebäude dessen Name, beim Mietvertrag der Name des Mieters (wie in `contracts_delete_future_text`).

Szenariozeilen:
- `contract-detail.feature:112`: `Dann heisst der Dialog "Mietvertrag von Anna Keller kann nicht gelöscht werden"`
- `contract-detail.feature:113`: `Und nennt der Dialog "Die Nebenkostenabrechnung unten rechnet die Mietstage dieses Mietvertrags ab, also die Tage, an denen er in der Abrechnungsperiode lief."`
- `contract-detail.feature:421` (Szenario ohne `@wip`, braucht `Spec change approved: #1258`): `Dann nennt der Dialog "Die Nebenkostenabrechnung unten rechnet die Mietstage dieses Mietvertrags ab, also die Tage, an denen er in der Abrechnungsperiode lief."`
- `building-detail.feature:34`: `Dann heisst der Dialog "Birkenhof kann nicht gelöscht werden"`
- `building-detail.feature:35`: `Und nennt der Dialog "Das Gebäude enthält noch Wohnungen."`
- `tenant-detail.feature`: unverändert.

Geprüft: Mietstage (`UBIQUITOUS_LANGUAGE.md`, «Tage ohne Abrechnung»; Mietstage = Tage einer Abrechnungsperiode, an denen der Mietvertrag lief) und Begriffe fr/it/en nach `docs/design/i18n-begriffe.md:85,88,116`. Der Fall «gesperrt und Entwurf» deckt auch ersetzte Abrechnungen ab (sie wurden versendet).

## Nicht bestätigt

- Die übrigen Persona-Befunde (Sven P-3: der Rat wird nicht vorgelesen; Anna P-3: «Enddatum erfassen» als Alternative; Anna P-4: laufender Mietvertrag beim Mieter; Anna P-5: Reihenfolge beim Gebäude mit vermieteten Wohnungen) waren nicht Teil dieses Auftrags. Ich habe sie nicht bewertet.
