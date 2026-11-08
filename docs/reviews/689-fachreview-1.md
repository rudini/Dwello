# Fach-Review #689, Schritt 1, Runde 1 (Commit baec460)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Kein Szenario hält fest, dass vordefinierte Datensätze keine Markierung tragen |
| V-2 | Verwalter | Minor | Der geplante Text «Tradotto»/«Traduit» passt im Geschlecht nicht zu categoria/chiave di riparto bzw. catégorie/clé de répartition (i18n-begriffe.md:75, :80, :86 zeigen die Übereinstimmung). Lösung: «Nome tradotto» / «Nom traduit», siehe Texte |
| V-3 | Verwalter | Minor | Regel fehlt, wann eine Sprache als «gespeichert» gilt. `localName` (src/lib/names.ts:18) und das PDF (backend/src/services/statement-pdf.service.ts:67) nehmen einen leeren Namen mit `\|\|` als nicht vorhanden. Die Markierung muss dieselbe Prüfung nutzen (nicht leer, sonst nicht aufführen), sonst steht «Übersetzt: FR» und Dwello zeigt doch den deutschen Namen. Ein Unit-Test mit `nameFR: ''` reicht |

## V-1 (Major): vordefinierte Datensätze ohne Markierung sind nicht festgehalten

- Beleg: Der Entscheid in #689 sagt, dass die Markierung nur für eigene Verteilschlüssel, Heizprofile und Kategorien gilt. Die drei neuen Szenarien (categories.feature +19–24, distribution-keys.feature +38–43, heating-profiles.feature +30–44) prüfen aber nur eigene Datensätze. UBIQUITOUS_LANGUAGE.md:103 (Vordefinierte Kategorie), :138–141 (vordefinierte Verteilschlüssel) und :163 (Vordefinierte Heizprofile) nennen das Gegenstück.
- Warum falsch: Eine Umsetzung, die alle Zeilen markiert, besteht die Szenarien. Ein vordefinierter Datensatz hat aber seine Namen in allen vier Sprachen von Dwello (i18n-begriffe.md:160). Würde er markiert, stünde dort entweder etwas Überflüssiges oder, wenn die Spalten `name_fr` … leer sind und Dwello die Namen anderswo hernimmt, das falsche «Keine Übersetzung». Das verunsichert den Verwalter, der mit diesem Hinweis gerade fehlende Übersetzungen finden soll. Die Szenarien sind die Spezifikation: Ein entschiedener Teil der Regel ohne Szenario kann später brechen, ohne dass ein Test es merkt.
- Lösung: In jedem der drei Szenarien einen Schritt anhängen, der für einen vordefinierten Datensatz keine Markierung zeigt. Er läuft nach dem positiven Schritt derselben Seite, damit die Liste sicher geladen ist (Negativprüfung nach tests/e2e/CLAUDE.md, «Rules»). Vorschlag:
  - categories.feature: `Und steht bei der Kategorie "Hauswart" nichts zur Übersetzung`
  - distribution-keys.feature: `Und steht beim Verteilschlüssel "Pro Fläche (m²)" nichts zur Übersetzung`
  - heating-profiles.feature (Szenario «… übersetzt ist», vor dem Öffnen): `Und steht beim Heizprofil "Heizung Mittelland" nichts zur Übersetzung`; auf der Detailseite eines vordefinierten Heizprofils ebenso: `Wenn der Liegenschaftsverwalter das Heizprofil "Heizung Mittelland" öffnet` / `Dann steht auf der Detailseite des Heizprofils nichts zur Übersetzung`
  - Der Schritt zählt die `*-translations`-Elemente der Zeile und erwartet 0.

## Entscheide zu den Fragen des Aufrufers

- **Sprachkürzel:** In allen vier Oberflächensprachen bleiben es FR, IT, EN (ISO 639-1, sprachunabhängig, in der Schweiz auf Bundes- und Kantonsseiten in jeder Sprache üblich). Also it «Nome tradotto: FR, IT, EN», fr «Nom traduit : FR, IT, EN». Die Reihenfolge bleibt fest FR, IT, EN. Das prüfen die Szenarien schon, weil «FR, EN» und «FR, IT, EN» eine andere Reihenfolge nicht durchliessen.
- **Bildschirmleser:** Ja, ganze Sprachnamen. Einem unerfahrenen Nutzer werden «F R, I T, E N» buchstabiert, und «EN» liest eine deutsche oder französische Stimme womöglich als Wort. Kein neuer Text nötig: dieselbe Meldung `config_translated` mit `languages` = `tenants_language_fr/it/en`, verbunden mit «, ». Die Grossschreibung von «Francese» mitten im Satz hört man nicht. Umsetzung: kein `aria-label` auf `<p>`/`<span>` ohne Rolle (ARIA 1.2 verbietet es dort, axe `aria-prohibited-attr`). Stattdessen die sichtbaren Kürzel in einem `aria-hidden="true"`-Element und die Langfassung in einem `sr-only`-Element daneben. Das `data-testid` gehört an das sichtbare Element, sonst liest `Text.of` beide Texte und `toBe("Übersetzt: FR, IT, EN")` schlägt fehl. «Keine Übersetzung» braucht keine Langfassung.

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| config_translated | Übersetzt: {languages} | Nom traduit : {languages} | Nome tradotto: {languages} | Translated: {languages} |
| config_not_translated | Keine Übersetzung | Aucune traduction | Nessuna traduzione | No translation |

## Fehlender Begriff

«Übersetzung (eines Namens)» steht nicht in UBIQUITOUS_LANGUAGE.md. Die Oberfläche nutzt ihn schon (`categories_translations` «Übersetzungen»). Vorschlag für die Zeile: «**Übersetzung (eines Namens)**: Name einer eigenen Kategorie, eines eigenen Verteilschlüssels oder eines eigenen Heizprofils auf Französisch, Italienisch oder Englisch. Fehlt er, zeigen Dwello und die Nebenkostenabrechnung den deutschen Namen. Listen zeigen «Übersetzt: FR, IT, EN» mit den gespeicherten Sprachen oder «Keine Übersetzung» (#689). | `name_fr`, `name_it`, `name_en`». Issue mit `domain`, `needs-decision`.

## Nicht bestätigt

- Ob die vordefinierten Datensätze `name_fr`/`name_it`/`name_en` in der Datenbank gefüllt haben. Das ist für V-1 ohne Belang, weil sie unabhängig davon keine Markierung tragen. Geprüft habe ich nur i18n-begriffe.md:160, nicht die Seeds.
- Ob `field()` in src/lib/server/save-form.ts reine Leerzeichen wegschneidet. Gesehen habe ich nur `field('nameFR') || null` (Zeile 78); daher V-3.

Geprüft: Begriffe der Szenarien gegen UBIQUITOUS_LANGUAGE.md (eigene Kategorie/eigener Verteilschlüssel/eigenes Heizprofil, umlagefähige Kategorie, Detailseite) stimmen; Szenarien decken Liste und Heizprofil-Detail wie entschieden ab; kein mietrechtlicher Bezug (die Markierung ändert weder Abrechnung noch PDF), daher keine Fedlex-Prüfung nötig.
