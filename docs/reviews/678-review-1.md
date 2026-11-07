# Code-Review #678, Runde 1 (aa77ed0..7c24245)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/routes/config/SaveForm.svelte:89 | Wenn man während des Speicherns Enter drückt, geht das Formular ein zweites Mal ab: `requestSubmit()` ohne Submitter umgeht die Sperre des besetzten Buttons (#677). |
| C-2 | Major | src/routes/config/SaveForm.svelte:87 | Enter auf einem Radio oder einer Checkbox fällt auf das native implizite Absenden zurück. In Chromium klickt das den ersten Submit-Button, im Kategorie-Formular also «Von der KI prüfen lassen». Das widerspricht der Entscheidung vom 2026-11-04. Kein Test deckt die Ausnahmen ab. |
| C-3 | Major | src/routes/config/SaveForm.svelte:65 | Die Bestätigung nennt den Namen jetzt in der Sprache der Oberfläche. Das ist eine sichtbare Korrektur, aber ohne Szenario in `tests/e2e/features` und ohne `No scenario: <Grund>` (es gibt nur einen DOM-Test). |
| C-4 | Minor | src/routes/config/SaveForm.svelte:86 | `event.isComposing` wird nicht geprüft: Ein Enter, das eine IME-Eingabe abschliesst, speichert. Das native implizite Absenden tut das nicht. |

## C-1 (Major): Enter speichert ein zweites Mal, während gespeichert wird

`Button.svelte:69-72` verhindert den zweiten Submit nur über den Klick: `press()` ruft `preventDefault()` auf, solange der Button `busy` ist. Vor der Änderung löste Enter in einem Feld das native implizite Absenden aus. Das ist ein synthetischer Klick auf den ersten Submit-Button, und den fing `press()` ab. Bei Heizprofilen ist dieser Button «Speichern», bei Kategorien und Verteilschlüsseln der Prüf-Button, der während der Prüfung ebenfalls `busy` ist. `form.requestSubmit()` löst dagegen keinen Klick aus und geht an `press()` vorbei. `submitted` prüft `saving` nicht. Ein Enter während einer laufenden Speicherung schickt den POST also ein zweites Mal ab.

Folgen: Bei «Neu» kommen zwei Create-Requests. Der zweite trifft im besten Fall auf «Name vergeben». Bei Heizprofilen prüft der Service den Namen zuerst und fügt dann ein (`heating-profile.service.ts:166-169`), zwei gleichzeitige Requests können also beide durchkommen. Zudem laufen eine Weiterleitung und eine Ablehnung gegeneinander. #677 hat genau das ausgeschlossen («also no second submit of its form»).

So lässt es sich zeigen: Ein DOM-Test auf HeatingProfileForm oder NewCategoryPage lässt die erste Antwort offen und drückt dann Enter im Namen. `submit` von enhance bzw. `fetch` wird zweimal aufgerufen; vor 7c24245 nur einmal.

Behebung: zum Beispiel `if (!saving) form?.requestSubmit();`.

## C-2 (Major): Enter auf Radio oder Checkbox startet die KI-Prüfung

`saveOnEnter` kehrt bei `checkbox` und `radio` ohne `preventDefault()` zurück. Dann greift das Verhalten des Browsers. In Blink überschreibt `BaseCheckableInputType` die Methode `ShouldSubmitImplicitly` nicht, also löst Enter (Keypress `\r`) auch auf Checkbox und Radio das implizite Absenden aus. Das klickt den ersten Submit-Button im Formular. Im Kategorie-Formular kommt `category-propose-button` (`CategoryForm.svelte:181-186`) vor `category-submit`. Enter auf «Umlagefähig» oder «Nicht umlagefähig», auf «Heizkosten nach dem Heizprofil verteilen» oder auf «Brennstoff» startet also weiterhin die KI. Entschieden ist aber: Enter sendet das Formular ab, «die zweite Aktion läuft nur über ihren Button».

So lässt es sich zeigen (Playwright, Chromium): Auf «Neue Kategorie» mit eingeschalteter KI einen Namen eingeben, «Nicht umlagefähig» fokussieren und Enter drücken. Danach erscheint «Die KI prüft die Kategorie …» bzw. ein Vorschlag, statt dass gespeichert oder die Ablehnung gezeigt wird.

Behebung: Enter auch dort abfangen, also speichern wie im Textfeld oder bewusst nichts tun, und das als Szenario oder DOM-Test festhalten. Heute prüft keine Testebene `saveOnEnter` unterhalb von E2E, und zu den Ausnahmen (Radio, Checkbox, Textarea) gibt es überhaupt keinen Test.

## C-3 (Major): Toast in der Sprache der Oberfläche ohne Szenario

Die Bestätigung nennt den Datensatz jetzt über `localName`. Das hatte Marco als bestehenden Fehler gemeldet, der Koordinator hat es am 2026-11-06 entschieden, und es gilt für Kategorien, Verteilschlüssel und Heizprofile. Das ist eine Verhaltensänderung, die der Benutzer sieht. Abgedeckt ist sie nur durch den DOM-Test `bestätigt das Speichern mit dem Namen in der Sprache der Oberfläche`. Weder ein Szenario ohne `@wip` noch ein `No scenario: <Grund>` in der Commit-Nachricht 7c24245 deckt sie ab. E2E kann den Fall darstellen, zum Beispiel: Oberfläche auf Englisch, Kategorie mit englischem Namen speichern, die Bestätigung nennt den englischen Namen.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, check, backend type-check, volle vitest-Suite (4295), testcheck sauber; Chromium categories, categories-ki, distribution-keys und heating-profiles 72 grün; a11y- und Sprachzeilen dieser Bildschirme 139 grün plus 1 Umgebungsfehler, beim zweiten Lauf grün; fitness exit 0; fallow sauber; alle neuen Tests rot gesehen (einer durch Entfernen von Code).
- C-2 habe ich nicht ausgeführt. Der Befund stützt sich auf das Blink-Verhalten (implizites Absenden bei Enter auf Checkbox und Radio). Firefox und WebKit habe ich nicht nachgesehen.
- Ob `on.formProblem` (Zustand `ki-name-missing`) den Feldfehler am Namen erfasst, habe ich nicht gelesen. Gestützt ist das nur auf den gemeldeten grünen a11y-Lauf.

Geprüft: Texte in allen vier Sprachen gleich wie die Tabelle der Fachreview 678-1 (M-1, V-1, V-3 inkl. U+00A0/U+2060), je drei `\n`-Absätze; V-2 umgesetzt; `kiEnabled` nur bei fehlender Wahl beim Erfassen (ein GET mehr nur bei Ablehnung, Fehler zählt als ein); `unsure` nur bei `KI_PROPOSAL_UNSURE`; Hinweis «geändert» mit allen drei Varianten; Textarea, Buttons und Links nativ; Ablauf mit `ask` (AllocabilityQuestion) über `requestSubmit`; neue a11y-Zustände in screens.json und in beiden Features; neue Szenarien und Tests ohne die Änderung rot; geänderte alte Tests prüfen nicht weniger als nötig (`calls` nur noch POST wegen des neuen GET); keine Schrittdefinition eines Szenarios ohne `@wip` geändert; Screenplay-Schichten eingehalten; Tokens; ponytail ohne Befund.

# Runde 2 (7c24245..2cf3607, Worktree /home/user/w-672)

Geschlossen: C-1, C-2, C-3, C-4

Keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, check, volle vitest-Suite (4301), Chromium categories, categories-ki, distribution-keys und heating-profiles 74 grün, a11y- und Sprachzeilen category- 44 grün, fitness exit 0, fallow sauber; die neuen Tests und Szenarien rot gegen 7c24245 bzw. 7c24245~1 gesehen.
- Dass `names.get('Selon le volume')` den mit `seed.unique` erzeugten französischen Namen liefert, habe ich nicht bis in die Fixture verfolgt. Gestützt ist das nur auf den gemeldeten grünen Lauf.

Geprüft: Bei laufendem `saving` setzt die Sperre trotzdem `preventDefault`. Enter auf Radio und Checkbox speichert jetzt, ein Enter mit `isComposing` wird ignoriert. Die drei DOM-Tests wären gegen 7c24245 rot. Das Szenario «Die Bestätigung nennt den Verteilschlüssel …» nennt den Namen in der Sprache der Oberfläche; die Frage `confirmedNames` liegt in der Fragen-Schicht und gibt die Werte selbst zurück. H-2: U+00A0 in «z. B.», «p. ex.», «p. es.» je zweimal in de, fr und it, mit einem Test pro Sprache.
