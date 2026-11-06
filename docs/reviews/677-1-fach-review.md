# Fach-Review #677, Runde 1 (vor der Umsetzung)

Gegenstand: `@wip`-Szenarien in 9670954 (`tests/e2e/features/documents.feature`, `tests/e2e/features/tenant-documents.feature`) und die vorgeschlagenen Texte aus `w677-handback1.md`, gegen die Entscheide im Issue #677 (2026-11-06).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | `documents_upload_where` hat zwei Sätze, Entscheid 5 verlangt einen. Der zweite («Dorthin führt der Name des Mieters in der Liste.») stimmt nicht, wenn die Liste leer ist oder nur «Zu versenden» ohne Treffer zeigt: Der Satz steht im Zweck der Seite und damit auch dort (`src/routes/documents/+page.svelte:52`). Fix: nur der erste Satz (Tabelle unten), Szenario «Die Seite sagt, wo Dokumente hochgeladen werden» (`documents.feature`) entsprechend anpassen (`@wip`, frei). Den Link zeigt bereits das Szenario «Vom Dokument zum Mieter». |
| V-2 | Verwalter | Minor | `tenants_document_file_duplicate` nennt ein Datum und einen Titel. Bei zwei oder mehr früheren Uploads mit demselben Dateinamen ist nicht festgelegt, welcher gemeint ist. Fix: den neuesten nennen, mit einem DOM-Test für drei Uploads mit demselben Namen. |
| V-3 | Verwalter | Minor | Drei Entscheide hält kein Szenario fest: 1 (nur die Uploads **dieses** Mieters zählen: Hat ein anderer Mieter eine Datei mit demselben Namen, erscheint kein Hinweis), 3 (Datei und Uhrzeit auch auf «Dokumente», bisher nur auf der Mieterseite geprüft), 6 («Alle» / «Zu versenden» behalten den Mieter). Fix: je ein Schritt oder ein Szenario (`@wip`, frei), sonst ein Test auf der tiefsten Schicht. |
| V-4 | Verwalter | Minor | Im Vorschlag stehen in fr normale Leerzeichen innerhalb von « ». Das bestehende fr nutzt U+00A0, z. B. `tenants_document_uploaded_toast` (`messages/fr.json:2027`). Fix: U+00A0 wie in der Tabelle unten. |

Geprüft: Glossar (Dokument, Hochgeladenes Dokument, Mieter, Liegenschaftsverwalter; `UBIQUITOUS_LANGUAGE.md:230-234`), «Seite des Mieters» wie in `UBIQUITOUS_LANGUAGE.md:271`, Schweizer Schreibweise in den Szenarien. Die Szenarien passen zu den Entscheiden 1 bis 3, 5 bis 7, und der Hinweis blockiert den Upload nicht (Entscheid 2). Das Format «Zu/Pour/Per/For {name}» passt zu `documents_pdf_before_change_made_to`. Die Abschnittsnamen stimmen mit `tenants_document_upload_heading` in allen vier Sprachen überein. Die Uhrzeit nutzt `formatTime` mit Europe/Zurich (`src/lib/utils/format.ts:69`). Die Begriffe stimmen mit `docs/design/i18n-begriffe.md:26,122` überein. Filter mit `contracts_tenant` / `tenants_all`. Datenschutz: Keine Daten verlassen den Server neu. Dateiname und früherer Titel erscheinen nur auf Seiten, die das Dokument schon zeigen, und `tenants_document_demo` deckt die Dateien in der Demo ab. Zum doppelten Upload einer Ausweiskopie: Art. 6 Abs. 4 DSG (Stand 7. Juli 2025) lautet «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.» Das deckt die bestehende Hilfe am selben Feld ab (`tenants_document_file_help`), darum braucht der neue Hinweis keinen eigenen Satz dazu.

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| documents_uploaded | Hochgeladen am {date} um {time}, Datei «{file}» | Téléversé le {date} à {time}, fichier « {file} » | Caricato il {date} alle {time}, file «{file}» | Uploaded on {date} at {time}, file «{file}» |
| documents_uploaded_to | Zu {name}, hochgeladen am {date} um {time}, Datei «{file}» | Pour {name}, téléversé le {date} à {time}, fichier « {file} » | Per {name}, caricato il {date} alle {time}, file «{file}» | For {name}, uploaded on {date} at {time}, file «{file}» |
| tenants_document_file_duplicate | Eine Datei «{file}» haben Sie schon am {date} hochgeladen, als Dokument «{title}». Laden Sie sie nur hoch, wenn es eine neue Fassung ist. | Vous avez déjà téléversé un fichier « {file} » le {date}, comme document « {title} ». Ne le téléversez que s’il s’agit d’une nouvelle version. | Ha già caricato un file «{file}» il {date}, come documento «{title}». Lo carichi solo se è una nuova versione. | You already uploaded a file «{file}» on {date}, as document «{title}». Upload it only if it is a new version. |
| documents_upload_where | Ein Dokument laden Sie auf der Seite des Mieters unter «Dokument hochladen» hoch. | Vous téléversez un document sur la page du locataire, sous « Téléverser un document ». | Un documento si carica sulla pagina dell’inquilino, sotto «Caricare un documento». | You upload a document on the tenant’s page, under «Upload a document». |

Der Step zu «Die Seite sagt, wo …» (`app-frame.steps.ts:340`) prüft mit `toContain`. Er bleibt mit dem kürzeren Text gültig, sobald die Szenariozeile angepasst ist. Der Step zum Hinweis (`tenant-documents.steps.ts:168-174`) pinnt den de-Text wörtlich, und dieser bleibt unverändert.

## Nicht bestätigt

- Ob «alle {time}» im Italienischen in jedem Fall passt: Bei 24-Stunden-Ziffern aus `formatTime` (de-CH, z. B. «01:05») ist das üblich. Eine Quelle zum Schweizer Behördenstil habe ich nicht gesucht.
- Fehlende Begriffe: keine.
