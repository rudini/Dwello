# Code-Review #1456, Runde 2 (Delta 5653390..49c55f8)

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-4 | Minor | src/__tests__/settings-overview.test.ts:131 | Die neue Prüfung des Zwecksatzes («Ihre Angaben, Vorgaben für die Abrechnung, Daten und Sicherheit.», Persona Anna P-3) steht im Test «zeigt die Sicherung und den Schalter nur, wo es sie gibt, und kein Feld des Formulars». Der Titel sagt nicht, was diese Zeile prüft. Fällt sie rot, zeigt der Titel auf den Schalter und nicht auf den Zwecksatz. Die Prüfung gehört in einen eigenen Test mit eigenem Titel. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (21 Dateien, 1039 Tests, vor der letzten Änderung an der Feature-Datei), E2E chromium (axe- und Sprachzeilen von `config`: 10 bestanden; settings.feature + datenexport.feature: 24 gelaufen, 1 rot vor der Zeile «Updates»; danach `-g "drei Gruppen|speichert beim Umschalten|tägliche Suche|melden e"`: 5 bestanden). Auf diesem Commit nicht gelaufen: fitness, die ganze vitest-Suite und settings-sender.feature.
- Ob die neuen Tests ohne die Änderung rot sind, habe ich nur durch Lesen beurteilt. `'>Updates</h3>'`, die Zuordnung über `aria-describedby` und der neue Zwecksatz fehlen auf 5653390, also wären diese Tests dort rot. Der DOM-Test zu C-2 prüft Verhalten aus Runde 1. Er wird rot, wenn `error` am Checkbox fehlt. Ausgeführt habe ich nichts.
- Dass `'>Updates</h3>'` im SSR-Text ohne Leerraum um den Text steht, habe ich nicht selbst ausgeführt. Ich stütze mich auf den Lauf des Aufrufers und auf das gleich gebaute h3 des Exports.

Geprüft: Alle neun geänderten Dateien. Überschrift «Updates»: Sie steht in allen vier Sprachen gleich wie im Pfad von `privacy_third_github` (Updates / Mises à jour / Aggiornamenti / Updates). Sie ist ein h3 unter dem h2 der Gruppe, und die E2E-Frage findet sie über `settings-entry-name`. Die IDs in `aria-describedby` sind pro Link-Key eindeutig, und ConfigLinks wird nur auf `/config` verwendet. Szenario ohne `@frische-installation`: Es folgt demselben Muster wie aktualisierung.feature:92 (`frisch` nimmt die Sperre einmal, `cleanUp` schaltet die Suche wieder ein). Beide geänderten Szenarien sind auf der Basis 6370675 neu, brauchen also keine Spec-Freigabe. Zu den Texten: `settings_purpose` und die neun Schlüssel aus Runde 1 stimmen in fr/it/en mit docs/design/i18n-begriffe.md überein (décompte/conteggio/statement, expéditeur/mittente/sender, titulaire du compte, adresse de l’entreprise, réglage wie bei «réglage de l’IA»). Der neue Zwecksatz nennt die drei Gruppen und kein «Stammdaten» mehr.
