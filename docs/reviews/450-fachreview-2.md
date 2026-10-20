# Fachreview #450 / #490, Runde 2

Gegenstand: Delta `16c4f10b..aef1bbbb` im Worktree `review-450-fach2`, dazu der Status der offenen IDs aus `docs/reviews/450-fachreview-1.md`. Entscheid #490 («Decided (product owner)», 2026-10-19): beide Glossarzeilen wie vorgeschlagen, dazu der Hilfetext «Mit einer IBAN braucht es Firmenname, PLZ und Ort.» in allen vier Sprachen. Die Rolle Rechtstexte entfällt, weil keine Datenschutzerklärung und keine Nutzungsbedingungen betroffen sind. Mietrecht: keine Befunde, denn das Delta ändert nur eine Feldhilfe und das Glossar.

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| V-1 | Major | behoben | `backend/src/routes/documents.ts:74-86` gibt einen `CodedError` als 400 mit Code zurück. `src/routes/documents/+page.server.ts:19-22` zeigt den Text über `backendMessage({ code }, …)`. Tests: `backend/src/__tests__/reminders.pg.test.ts:533` (400 `CREDITOR_ADDRESS_MISSING`) und `src/__tests__/documents.test.ts:58-65` (zeigt `backend_creditor_address_missing`, `messages/de.json:490`). |
| V-2 bis V-5, V-11 | Minor/Nit | behoben (laut Auftrag). Nicht erneut geprüft, weil sie nicht zum Delta gehören. | – |
| V-6 | Minor | ausgelagert in #491 (entschieden, kommt mit #449) | – |
| V-7 | Minor | behoben | `UBIQUITOUS_LANGUAGE.md:227` (Zahlungsempfänger) und `:254` (Firmenadresse) stimmen Wort für Wort mit dem Vorschlag aus Runde 1 überein, auch die Code-Spalten. |
| V-8 | Nit | behoben | `messages/de.json:1351` endet mit dem entschiedenen Satz. Pin in `src/__tests__/config-pages.test.ts:111` und im Szenario `tests/e2e/features/settings.feature:50-52`. |
| V-9 | Nit | offen, wird im PR genannt (wie empfohlen) | – |
| V-10 | Nit | offen. Der Kommentar in #450 ist geschrieben, `No scenario: <Grund>` folgt im PR. | – |

## Neue Befunde im Delta

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-12 | Verwalter | Nit | Die Hilfe sagt «Firmenname, PLZ und Ort» (`messages/de.json:1351`), die Fehlermeldungen sagen «Name, PLZ und Ort» (`messages/de.json:489-490`). Inhaltlich ist es dasselbe, denn in den Fehlermeldungen steht der Name nach «Firmenadresse». Beide Texte sind entschieden. Vorschlag: so lassen. Eine Angleichung müsste der Product Owner entscheiden. |

Keine Blocker oder Major.

## Übersetzungen (`settings_iban_help`, letzter Satz)

Alle drei bestätigt gegen `docs/design/i18n-begriffe.md`:
- fr «Avec un IBAN, le nom de l’entreprise, le NPA et la localité sont nécessaires.»: Zeile 102 «nom de l’entreprise», Zeile 12 «NPA / localité», typografischer Apostroph wie im Bestand. Es gibt keine Guillemets, deshalb ist kein U+00A0 nötig.
- it «Con un IBAN servono il nome dell’azienda, il NPA e la località.»: Zeile 102 «nome dell’azienda», Zeile 12 «NPA / località». «il NPA» wie im Bestand (Runde 1).
- en «With an IBAN, the company name, postcode and town are required.»: Zeile 102 «company name», Zeile 12 «postcode / town».
Die Bedeutung stimmt mit dem deutschen Text und mit der Regel im Glossar überein («Mit einer IBAN sind Firmenname, PLZ und Ort Pflicht.»). Die Strasse wird bewusst nicht genannt, wie entschieden.

## Fehlende Begriffe

Keine. «Zahlungsempfänger» und «Firmenadresse» stehen jetzt im Glossar.

## Nicht bestätigt

- V-2 bis V-5 und V-11: Ihre Behebung liegt vor `16c4f10b` und gehört nicht zum Delta. Sie wurde in dieser Runde nicht erneut geprüft.
- Die Punkte aus «Nicht bestätigt» in Runde 1 bleiben unverändert: Pflichtfelder nach SIX IG v2.3, der Wortlaut von Art. 257b Abs. 2 OR auf Fedlex, die PLZ von Büsingen und Campione. Gesucht wurde nicht erneut, weil das Delta sie nicht berührt.
