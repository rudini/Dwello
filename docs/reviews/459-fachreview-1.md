# Fachreview #459 Teil A, Runde 1 (vor der Umsetzung)

Gegenstand: rote Tests aus `git show 8b502c5` (Worktree `review-459-fach`, detached bei 8b502c5) und der Plan des Aufrufers (Markierung am letzten Mietvertrag als `documents_checked_on`, gesetzt über das Update des Mietvertrags, vergessen bei geändertem Vertragsende; Hinweis auf der Mieterseite mit Satz zum Endtag, Knopf «Als geprüft markieren», danach «Geprüft am {date}»; die Aufgabe in der Übersicht endet). Entscheid: #459 «Decided», Punkt 2 und 5; Kommentar #411 (issuecomment-6249574737), «Punkt 2» und «Punkt 5».

Keine Blocker, keine Majors.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Kein roter Test verlangt den Satz zum Endtag in der Aufgabe der Übersicht, obwohl «Done means» ihn für «Tenant page and task» fordert. Nur `tenant-detail-page.dom.test.ts:356-358` prüft ihn. Fix: in `dashboard.test.ts` (oder einem Test von `overview.ts`) den Text der Aufgabe `former-documents-…` auf den Satz prüfen. |
| V-2 | Verwalter | Minor | «Pro letztem Mietvertrag» ist nicht festgehalten. `former-tenant-documents.test.ts:29-45` arbeitet nur mit einem einzigen Mietvertrag. Eine Umsetzung, die `documentsCheckedOn` irgendeines Mietvertrags nimmt, bestünde den Test, obwohl die Aufgabe bei einem späteren Mietvertrag ohne Prüfung wiederkommen muss (#411 Punkt 2: «Sie kommt erst wieder, wenn sich das Vertragsende des letzten Mietvertrags ändert, zum Beispiel weil der Mieter einen neuen Mietvertrag erhält, der später endet»). Fix: einen Fall mit früherem, geprüftem und späterem, ungeprüftem Mietvertrag ergänzen; erwartet wird `checkedOn: null` und die `contractId` des späteren. |
| V-3 | Verwalter | Minor | Es fehlt ein Test, dass ein Update mit **unverändertem** Vertragsende die Prüfung behält. Das Formular des Mietvertrags kann `endDate` bei jeder Änderung mitsenden, etwa wenn nur die Akontozahlung geändert wird. Vergisst eine Umsetzung die Prüfung schon dann, kommt die Aufgabe ohne neues Vertragsende zurück. Das widerspricht dem Entscheid. Vorbild: `contract.service.ts:471`, `data.endDate !== current.endDate` bei `movedOut`. Fix: in `contract-documents-checked.pg.test.ts` ein `PUT` mit demselben `endDate` ergänzen; `documentsCheckedOn` bleibt dabei. |
| V-4 | Verwalter | Minor | Fachbegriff fehlt im Glossar: Der gespeicherte Zustand «Dokumente geprüft» hat keine Zeile, sein Gegenstück «Auszug bestätigt» schon (`UBIQUITOUS_LANGUAGE.md:40`). Vorschlag unter «Fehlende Begriffe». Da der Product Owner den Knopftext in #459 entschieden hat, braucht der Code keinen Marker. |
| V-5 | Verwalter | Minor | Nach der Prüfung steht über «Geprüft am {date}» weiter der auffordernde Titel «Hochgeladene Dokumente prüfen», im Ton `caution` (`TenantDocumentsCard.svelte:39`). Wer wenig Erfahrung hat, liest das als offene Aufgabe. Fix: Text und Titel bleiben (so entschieden), nach der Prüfung aber neutraler Ton statt `caution`. |

## Belege und Rechtsgrundlagen (geprüft)

- **Glossar und bestehende Texte (Marker #334):** `tenants_former_documents_text` und `dashboard_task_former_documents_text_one/_many` in `messages/de.json:694, 1794-1795` schreiben «bis das Mietzinsdepot freigegeben ist». Das ist wörtlich die UI-Form der Zeile «Freigabe des Mietzinsdepots» (`UBIQUITOUS_LANGUAGE.md:62`: «In der Oberfläche «bis das Mietzinsdepot freigegeben ist»»). fr «jusqu’à la libération de la garantie de loyer», it «finché il deposito di garanzia non è svincolato» und en «until the rent deposit has been released» entsprechen `docs/design/i18n-begriffe.md:126` und den UI-Formen im Kommentar zu #411 (Punkt 5). Auch «Übergabeprotokoll» (`i18n-begriffe.md:109`), «Betreibungsauszug» (`:110`), «Ausweiskopie» und «hochgeladen» (`:108`) stimmen in allen vier Sprachen. **Die Marker `TODO(fachlich prüfen, #334)` in `src/lib/overview.ts:324` und `src/routes/tenants/[id]/TenantDocumentsCard.svelte:40` können weg.** Den Marker `#331` (`overview.ts:323`) löst die Umsetzung dieses Teils.
- **Art. 257e Abs. 3 OR** (Fedlex, SR 220, Stand 1.1.2025): «Die Bank darf die Sicherheit nur mit Zustimmung beider Parteien oder gestützt auf einen rechtskräftigen Zahlungsbefehl oder auf ein rechtskräftiges Gerichtsurteil herausgeben. Hat der Vermieter innert einem Jahr nach Beendigung des Mietverhältnisses keinen Anspruch gegenüber dem Mieter rechtlich geltend gemacht, so kann dieser von der Bank die Rückerstattung der Sicherheit verlangen.» Die Glossarzeile gibt das richtig wieder.
- **Art. 267a OR:** «¹ Bei der Rückgabe muss der Vermieter den Zustand der Sache prüfen und Mängel, für die der Mieter einzustehen hat, diesem sofort melden. ² Versäumt dies der Vermieter, so verliert er seine Ansprüche, soweit es sich nicht um Mängel handelt, die bei übungsgemässer Untersuchung nicht erkennbar waren.» Für Ansprüche aus Mängeln braucht der Vermieter das Übergabeprotokoll vom Einzug als Vergleich. Der Rat, Übergabeprotokolle bis zur Freigabe des Mietzinsdepots zu behalten, entspricht der Praxis. Das Übergabeprotokoll vom Auszug zeigt die Liste meist ohnehin nicht. Art. 256a Abs. 1 OR («… so muss der Vermieter es dem neuen Mieter auf dessen Verlangen bei der Übergabe der Sache zur Einsicht vorlegen.») spricht ebenfalls dafür, das Übergabeprotokoll vom Auszug zu behalten.
- **Art. 6 Abs. 4 DSG** (SR 235.1, Stand 1.9.2023): «Sie werden vernichtet oder anonymisiert, sobald sie zum Zweck der Bearbeitung nicht mehr erforderlich sind.» Der Hinweis («Löschen Sie, was Sie nicht mehr brauchen, etwa Ausweiskopien und Betreibungsauszüge») und das Ende der Aufgabe erst nach einer bewussten Prüfung passen dazu. Was nach der Prüfung bleibt, entfernt Teil B nach der Aufbewahrungsfrist.
- **Satz zum Endtag:** `former-tenant-documents.ts:41` nennt nur Uploads mit Schweizer Tag `< endDate`. Der Satz «am Tag des Vertragsendes oder danach hochgeladen» beschreibt diese Regel genau: Massgebend ist der Tag des Hochladens, nicht das Datum des Dokuments.
- **Speicherort und Zurücksetzen:** Die Markierung am letzten Mietvertrag, gelöscht bei geändertem Vertragsende, wirkt gleich wie der Vorschlag im Kommentar zu #411 («pro Mieter das Vertragsende, auf das sich die Markierung bezieht»). Das gilt auch, wenn ein neuer späterer Mietvertrag hinzukommt oder die Kündigung aufgehoben wird (Vertragsende `null`, damit kein ehemaliger Mieter mehr). Die Reihenfolge der Liste ist eindeutig (`contract.service.ts:156`, `desc(startDate), desc(id)`), Mieterseite und Übersicht wählen also bei gleichem Vertragsende denselben Mietvertrag. Den Tag speichert die App als Schweizer Tag (`swissToday()`), angezeigt als «20.10.2026».

## Endgültige Texte

Satz zum Endtag (de entschieden, unverändert; **in der Aufgabe der Übersicht derselbe Satz mit «hier»**: «hier» meint dort die gezählten Dokumente; ein anderer Wortlaut wäre eine Änderung am entschiedenen Text und damit Sache des Product Owners):

- de: «Dokumente, die Sie am Tag des Vertragsendes oder danach hochgeladen haben, etwa das Übergabeprotokoll vom Auszug, nennt Dwello hier nicht.»
- fr: «Dwello ne mentionne pas ici les documents que vous avez téléversés le jour de la fin du contrat ou après, par exemple le procès-verbal de remise lors du déménagement.» («déménagement» wie in `contracts_moved_out_title`/`_confirm` für «Auszug»; «départ» kommt in der App sonst nicht vor.)
- it: «Dwello non indica qui i documenti che ha caricato il giorno della fine del contratto o dopo, per esempio il verbale di consegna al trasloco.» («trasloco» wie in `contracts_moved_out_*`; «indica» passt auch in der Aufgabe, die nur zählt.)
- en: «Dwello does not list documents here that you uploaded on the day the contract ended or later, such as the handover report at move-out.»

Knopf (wie `documents_mark_sent`, `statements_mark_paid`):

- de «Als geprüft markieren», fr «Marquer comme vérifié», it «Segnare come verificato», en «Mark as checked»: so übernehmen.

Tag der Prüfung (wie `statements_paid_on`, «Payé le» / «Pagato il» / «Paid on»):

- de «Geprüft am {date}», fr «Vérifié le {date}», it «Verificato il {date}», en «Checked on {date}»: so übernehmen.

Bestehende Texte `tenants_former_documents_text`, `dashboard_task_former_documents_text_one/_many`: in allen vier Sprachen unverändert lassen; den neuen Satz am Ende anhängen (oder als eigener Schlüssel gleich danach).

## Fehlende Begriffe (Issue mit Labels `fachlich`, `entscheiden`)

| Begriff | Definition (Vorschlag) | Code |
|---|---|---|
| **Dokumente geprüft** | Der Vermieter hat die hochgeladenen Dokumente eines ehemaligen Mieters, die vor dem Vertragsende seines letzten Mietvertrags hochgeladen wurden, durchgesehen und gelöscht, was er nicht mehr braucht. Dwello speichert den Tag am letzten Mietvertrag und nennt die Aufgabe in der Übersicht nicht mehr. Ändert sich das Vertragsende, fällt die Prüfung weg. | `documents_checked_on` Feld |

i18n: documents vérifiés / documenti verificati / documents checked.

## Nicht bestätigt

- Nicht im Code geprüft, ob das Formular des Mietvertrags bei jeder Änderung `endDate` mitsendet (Grund für V-3). Angesehen: nur `backend/src/services/contract.service.ts:448-480`.
- Ob Mängelansprüche nach der Freigabe des Mietzinsdepots noch durchsetzbar sind (Verjährung nach Art. 127 oder Art. 128 OR), habe ich nicht geprüft. Der Rat «bis das Mietzinsdepot freigegeben ist» gilt hier als Untergrenze aus der Praxis, nicht als gesetzliche Frist. Quelle zum Wortlaut von Art. 127/128: Fedlex SR 220.
- Kantonale Ergänzungen zu Art. 257e Abs. 4 OR habe ich nicht geprüft.

Geprüft: Art. 257e Abs. 3, 256a, 267a, 127, 128 OR und Art. 6 Abs. 4 DSG im Wortlaut von Fedlex; Glossar- und i18n-Zeilen der Begriffe Mietzinsdepot, Freigabe, Übergabeprotokoll, Ausweiskopie, Betreibungsauszug, Vertragsende und hochgeladen; die Erwartungen der vier roten Tests.
