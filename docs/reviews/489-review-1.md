# Review #489, Runde 1 (5fa3f20..c547714)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/tenants/[id]/TenantDocumentUpload.svelte:47 | `chosenName = ''` nach erfolgreichem Hochladen hat keinen Test: «meldet ein hochgeladenes Dokument» (tenant-detail-page.dom.test.ts:250) wählt vorher keine Datei und prüft `tenant-document-file-chosen` danach nicht. Ohne die Zeile stünde nach dem Hochladen weiter der alte Dateiname neben dem Knopf, obwohl `uploadForm.reset()` das Feld geleert hat; kein Test würde rot. |

Keine Blocker, keine Major.

Geprüft: FileInput mit `name="file"` (FormData der Form und `submit` lesen `file` weiter); optionales `name` in FileInput ändert die zwei Rechnungs-Verwendungen nicht; Texte in allen vier `messages/*.json`; Fokus nach dem Hochladen landet auf dem sr-only-Input (Test Zeile 257 grün), dessen Fokusring über `peer-focus-visible` am Label sichtbar ist; eigene Schlüssel `tenants_document_file_*` statt der Rechnungs-Schlüssel sind vertretbar (Bereichstrennung, keine Kopie eines Helpers); neuer DOM-Test wäre auf der Basis rot (`tenant-document-file-choose` fehlt); `notes.docx` im a11y-Zustand `upload-refused` entspricht dem Rechnungs-Zustand (accessibility.ts:262), Feature `tenant-documents.feature` bleibt unverändert; kein neuer Bildschirm oder Zustand; «No scenario» mit Begründung (Sprachzeilen von tenant-detail prüfen den Knopftext) trägt.

## Nicht bestätigt

- tenant-detail DOM-Tests (26): selbst erneut ausgeführt, grün.
- lint, check, vitest --changed (656), Message-Tests (514), tenant-documents.feature chromium + api (8), axe- und Sprachzeilen von tenant-detail in chromium (10): vom Aufrufer gemeldet.
- Dass die fr/it/en-Sprachzeilen von tenant-detail den Knopftext tatsächlich erfassen (sichtbarer Text im Zustand ohne Datei): nur gelesen, nicht ausgeführt.
