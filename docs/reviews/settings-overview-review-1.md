# Code-Review #1456, Runde 1 (6370675..5653390)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | messages/de.json:2574 (`privacy_third_github`, auch fr/it/en) | Die Datenschutzerklärung schickt den Liegenschaftsverwalter zum Ausschalten der Suche «unter «Einstellungen» › «Updates»». Den Abschnitt «Updates» gibt es nach dem Diff nicht mehr (Schlüssel `settings_updates_title` entfernt, der Schalter steht jetzt in «Daten und Sicherheit»). |
| C-2 | Minor | src/routes/config/+page.svelte:97-101 | Was die Übersicht zeigt, wenn das Speichern des Schalters abgelehnt wird, ist von keinem Test abgedeckt: Der Schalter springt auf den gespeicherten Wert zurück, und `form.error` erscheint am Schalter. settings-overview.test.ts prüft nur, dass die Action 502 liefert, und settings-overview.dom.test.ts nur das Absenden. |
| C-3 | Minor | tests/e2e/features/settings.feature:98 | Der Kommentar sagt «Beide Sätze zusammen prüft config-pages.test.ts». Geprüft wird das aber in settings-overview.test.ts («sagt beim Link zu «Absender und Konto» beide Sätze …»). |

## C-1 (Major): Die Datenschutzerklärung verweist auf einen Abschnitt, den es nicht mehr gibt

Auf dem Basis-Commit hiess der Panel mit dem Schalter «Updates» (`settings_updates_title`, in 6370675 in `src/routes/config/+page.svelte:315`). Der Diff entfernt den Panel und den Schlüssel, und der Schalter steht ohne eigene Überschrift in der Gruppe «Daten und Sicherheit». Der Text `privacy_third_github` bleibt in allen vier Sprachen unverändert: «Unter «Einstellungen» › «Updates» können Sie die Suche ausschalten; dann geht keine Anfrage mehr an GitHub.» (fr «Paramètres» › «Mises à jour», it «Impostazioni» › «Aggiornamenti», en «Settings» › «Updates»). Damit sagt die Datenschutzerklärung etwas Falsches über den Ort, an dem der Liegenschaftsverwalter die Übermittlung an GitHub (USA) abschaltet. Auf dem Basis-Commit war die Angabe richtig. Der Fehler entsteht also durch diese Änderung.

Der Entscheid vom 19.11. («Texte, die «unter «Einstellungen»» schicken, bleiben») deckt diesen Fall nicht. Dieser Text nennt einen Unterabschnitt, und den entfernt die Änderung.

So zeigt man den Fehler: `/privacy` öffnen, dem Pfad «Einstellungen» › «Updates» folgen. Auf `/config` gibt es keine Überschrift und keinen Eintrag «Updates» (`grep -n settings_updates_title src` findet nichts).

Für die Behebung gibt es zwei Wege:
- Der Schalter bekommt wieder eine sichtbare Überschrift «Updates».
- Der Rechtstext wird geändert. Das braucht `fach-reviewer` und einen Entscheid des Product Owners (Rechtstext, «Stand»-Datum), also einen Eintrag unter «Blocked on me».

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (241 Dateien, 5032 Tests), `bun run fitness -- --base origin/main --structure`, Prettier auf neuen Dateien, E2E chromium (settings, settings-sender, datenexport, aktualisierung, breadcrumb, zugangsschluessel, ki-einstellungen; ohne Abschlusszeile, weil der Lauf beim Teardown hing) sowie der `-g`-Lauf (23 bestanden), Commit-Hooks.
- Ob die neuen Szenarien und Tests ohne die Änderung rot sind, habe ich nur durch Lesen beurteilt: Die neuen Einträge, Hinweise, die Bestätigung und der Link fehlen auf der Basis. Ausgeführt habe ich nichts.
- Lauf ohne JavaScript (`<noscript>`-Knopf, Absenden ohne `enhance`): nur im Code gelesen, von keinem Test abgedeckt.

Geprüft: Alle 35 geänderten Dateien, darunter `sender/+page.svelte` als Diff gegen das alte Formular (nur Kopf, Breadcrumb und Titel neu). Die verschobenen Szenarien stehen Zeile für Zeile in settings-sender.feature, einzige Ausnahme ist die Startseite im Szenario zur Verwaltungspauschale (durch #1456 genehmigt). Die umgeleiteten Schritte nutzt kein anderes Feature. `/config/sender#{section}` in CreditorAddressWarning und der Knopf auf der PDF-Ablehnungsseite (weiter `/config`) sind geprüft, ebenso die Reihenfolge der Gruppen, die Sicherung nur mit `backup !== 'off'` und die neun neuen Texte in allen vier Sprachen. Die drei entfernten Schlüssel werden nirgends mehr verwendet. Geprüft sind auch die Einträge in screens.json, accessibility.feature und sprachen-bildschirme.feature, die Sperre `installation` für den Look `update-check-saved`, die Screenplay-Schichten und die Navigationsszenarien (Breadcrumb und Link).
