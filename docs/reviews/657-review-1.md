# Code-Review #657, Runde 1 (88049a8..32d569e)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/login/+page.svelte:25, tests/e2e/features/authentication.feature:130 | Die Anmeldeseite passt nur ohne Konto mit Passwort in 390 × 844; mit Konto mit Passwort (der Fall jeder Installation nach der Einrichtung, #577) scrollt sie weiter. Das «Anmelden» bleibt in diesem Fall ungetestet. |
| C-2 | Minor | src/lib/ui/MobileNav.svelte:42 / src/lib/ui/LanguageSwitcher.svelte:68 | Ist die Sprachliste im Menü offen, schliesst Escape beide Fenster-Handler zugleich: die Liste und das ganze Menü, statt nur die Liste. Kein Test dafür. |
| C-3 | Minor | src/lib/ui/MobileNav.svelte:44-48 | Die Tab-Falle des Menüs sammelt `a, button`, also auch die unsichtbare Fläche der offenen Sprachliste (`fixed inset-0`, `tabindex="-1"`, `aria-hidden`). Tab vom Sprachknopf setzt den Fokus deshalb auf diese unsichtbare Fläche. Neu, weil die Sprachwahl jetzt im Menü steht. |
| C-4 | Minor | tests/a11y/screens.json:154-155 | Die `stateMeanings` stimmen für das Telefon nicht mehr: «language-menu-open» sagt «in the header», die Liste öffnet dort aber im Menü. «language-changed» sagt «focus on the language selection», der Fokus steht aber auf dem Menü-Knopf. |
| C-5 | Minor | tests/e2e/fixtures/backend.ts:752-757, tests/e2e/fixtures/settings-lock.ts:10,18 | `holdLock` hält die Sperre `local-accounts` über ein ganzes Szenario (Warten mit Polling eingeschlossen). `tryLock` übernimmt eine Sperre aber nach `STALE_MS` = 60 s, gemessen ab dem `mkdir`. Wartet oder läuft das Szenario länger, kann ein paralleles `seed.localAccount()` ein Konto anlegen. Das Release der ersten Sperre löscht dann zudem die Sperre der zweiten. |

## C-1 (Major): Anmeldeseite mit Konto mit Passwort passt nicht in 390 × 844

Laut «Decided» muss «die Anmeldeseite» bei 390 × 844 ohne Scrollen passen, mit sichtbarem Anmelden. Gekürzt werden sollten Abstände und Einleitung. Der Diff verringert nur `py-12` auf `py-4` unterhalb von `sm`; die Einleitung bleibt unverändert. Der Aufrufer bestätigt selbst: «with a local account the page is longer». Das Formular mit E-Mail-Adresse und Passwort (`PasswordForm`) liegt dabei über dem Google-Knopf.

Ein Konto mit Passwort ist kein Randfall. Die Einrichtung einer frischen Installation legt eines an (einrichtung.feature, #577). Google setzt dagegen eine eigene OAuth-Konfiguration voraus. Die meisten Liegenschaftsverwalter sehen also genau die Seite, die weiter scrollt.

Das neue Szenario schliesst diesen Fall mit `es ist kein Konto mit Passwort eingerichtet` ausdrücklich aus. Dass «Anmelden» bei 390 × 844 sichtbar ist, behauptet nur die Übergabe; kein Test prüft es.

So zeigt man es: dasselbe Szenario mit `Angenommen ein Konto mit Passwort ist eingerichtet` statt `es ist kein Konto mit Passwort eingerichtet`. Dann ist `loginPageOverflow` grösser als 0.

Lösung: die Seite auch in dieser Variante kürzen (die Einleitung, wie im Entscheid genannt) und eine Beispielzeile mit Konto mit Passwort hinzufügen (sie prüft «Anmelden» ohne Scrollen). Hält der Aufrufer die Variante für nicht entschieden, gehört die Frage in #657 (`needs-decision`).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (126) sowie tokens, feature-wording, design-guard, open-work, no-german-in-code und e2e-screenplay-lint (1086). Ebenso E2E chromium navigation/sprachen/authentication (107) und die Zeilen von accessibility und sprachen-bildschirme für Login und Dashboard (46), dazu die Rot-Läufe der neuen Szenarien und die Messungen (Kopfzeile scrollWidth 360, Login 844 hoch in de/fr/it/en).
- Ob der Schritt «sieht der Besucher die Anmeldung mit "Google", ohne zu scrollen» auf der Basis rot war: Der Aufrufer nennt nur den Überlauf von 55 px. Aus dem Code liegt der Google-Knopf über dem Rechtshinweis und war vermutlich schon sichtbar. Der Schritt ist trotzdem durch den Überlauf-Schritt davor gedeckt.
- Die Breite der Kopfzeile bei 360 px ist nur auf der Gebäudeliste und auf Deutsch geprüft. Nach dem Diff hängt die Kopfzeile unter `md` nicht mehr von der Sprache ab (kein Sprachname mehr darin). Das habe ich nur im Code gelesen (Header.svelte), nicht gemessen.

Geprüft: navigation.ts/`mobileNavGroups` (Reihenfolge und Seitenleiste unverändert, DOM-Test rot ohne Änderung), Fokuslogik in LanguageSwitcher mit DOM-Test, öffentliche Kopfzeile (eigene Sprachwahl, nicht betroffen), keine neuen Texte (`m.language_choice` besteht), Tokens, Screenplay-Schichten und Gherkin-Wortlaut der neuen Szenarien, `holdLock`/`withLock` und die Wahrung der Strenge bestehender Schritte (`shownLanguage`, `chooseLanguage`, a11y-Zustände).
