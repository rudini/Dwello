# Fachreview #126, Runde 2 (Delta)

Geprüfter Stand: Worktree `review-126-fach-2`, detached auf `21828c2` (Delta `9698846..21828c2`, nur Texte in `messages/{de,fr,it,en}.json` und die beiden angepassten Tests).
Gegenstand: `backend_mail_delivery_failed` und `statements_reminder_undelivered`, zusammengesetzt in `src/routes/statements/[id]/ReminderFeedback.svelte:16`.

Status Runde 1: V-1, V-2 behoben (laut Auftrag); V-3 nach #193 verschoben; Mindestabstand zwischen Mahnstufen ist #107. Diese Punkte sind hier nicht erneut geprüft.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-4 | Verwalter (Sprache) | Minor | `{title}` steht ohne Artikel als Satzsubjekt; in fr/it/en ist es heute ein deutsches Wort mitten im Satz, mit übersetzten Titeln nach `i18n-begriffe.md` wird der Satz ungrammatisch (vorbestehendes Muster, durch das Delta übernommen) |
| V-5 | Verwalter (Sprache) | Nit | it: im selben Hinweis «tra i documenti» und «in «Documenti»» für denselben Ort |

Keine Blocker, keine Major. Keine Mietrecht- oder Rechtstexte-Befunde: das Delta stellt keine rechtliche Behauptung auf.

## V-4 (Minor): Titel ohne Artikel als Satzsubjekt

**Beleg**
- `messages/de.json:913` `"{title} liegt in den Dokumenten zum Versand bereit. {reason}"`, fr/it/en `:913` gleich gebaut (`{title} est prêt…`, `{title} è pronto…`, `{title} is ready…`).
- `{title}` ist `document.title` (`ReminderFeedback.svelte:16`) und kommt aus dem Backend, immer deutsch: `backend/src/services/reminder-letter.ts:17` `const TITLES = ['Zahlungserinnerung', '2. Mahnung', '3. Mahnung'];`.
- Damit lautet der Satz heute:
  - de: «Zahlungserinnerung liegt in den Dokumenten zum Versand bereit.» / «2. Mahnung liegt …» (Telegrammstil, Artikel fehlt).
  - fr: «Zahlungserinnerung est prêt à l’envoi sous « Documents ». L’e-mail n’a pas …» (deutsches Wort im französischen Satz).
  - it: «Zahlungserinnerung è pronto per l’invio …».
  - en: «Zahlungserinnerung is ready to send …».
- Die Annahme des Auftrags (Titel «rappel de paiement», «sollecito») trifft in diesem Commit nicht zu. Sobald #106 die Titel übersetzt (`docs/design/i18n-begriffe.md:63`: «rappel de paiement», «promemoria di pagamento», «payment reminder», Kleinschreibung), entsteht «rappel de paiement est prêt …», «promemoria di pagamento è pronto …», «payment reminder is ready …»: kleingeschriebener Satzanfang ohne Artikel, in allen drei Sprachen falsch.

**Warum falsch:** Der Satz behandelt den Datensatznamen wie ein Nomen mit Artikel. Das trägt weder auf Deutsch noch in den Zielsprachen. Für Helga (wenig Erfahrung) liest sich «Zahlungserinnerung liegt …» als Fehler. Das Muster gab es schon vorher (`statements_reminder_letter`, `statements_reminder_emailed`, `:914–915`, in fr/it als «{title} : …» umgangen). Das Delta macht `{title}` aber neu zum Satzsubjekt in fr/it/en, wo vorher «{title} : {reason}» stand.

**Korrektur (Vorschlag):** Den Titel als genannten Datensatz in Guillemets setzen, mit einem Nomen, das in jeder Sprache Genus und Artikel trägt. Das funktioniert mit deutschen und mit übersetzten Titeln:
- de: «Das Dokument «{title}» liegt in den Dokumenten zum Versand bereit. {reason}», kürzer: ««{title}» liegt unter «Dokumente» zum Versand bereit. {reason}»
- fr: «Le document « {title} » est prêt à l’envoi sous « Documents ». {reason}»
- it: «Il documento «{title}» è pronto per l’invio in «Documenti». {reason}»
- en: «The document «{title}» is ready to send under «Documents». {reason}»

Gleiches gilt bei Gelegenheit für `statements_reminder_letter` und `statements_reminder_emailed` (vorbestehend). In #106 sollte ein Satz ergänzt werden: «UI-Sätze mit `{title}` müssen mit übersetzten, kleingeschriebenen Titeln grammatisch bleiben.» Ein neuer Fachbegriff ist nicht nötig.

## V-5 (Nit): it, zwei Bezeichnungen für denselben Ort

**Beleg:** `messages/it.json:913` «è pronto per l’invio tra i documenti» und direkt danach `:444` «lo segni come inviato in «Documenti»». fr und en verwenden in beiden Sätzen « Documents » bzw. «Documents».
**Warum:** Im selben Hinweis wird derselbe Menüpunkt (`nav_documents` = «Documenti», `messages/it.json:14`) einmal als Menüname und einmal als Gattungswort genannt. Leser fragen sich, ob das zwei Orte sind.
**Korrektur:** it `:913` «… è pronto per l’invio in «Documenti». {reason}» (siehe V-4).

## Bestätigt

- **Mahnung als Oberbegriff:** Die Zahlungserinnerung darf im Grundtext «Mahnung» heissen. `UBIQUITOUS_LANGUAGE.md:156–157` definiert Mahnung als Zahlungsaufforderung und Mahnstufe als «Zahlungserinnerung (1. Stufe), 2. Mahnung, 3. Mahnung». «Drucken Sie die Mahnung aus» passt also auch zur Zahlungserinnerung. Das deckt sich mit `glossary_reminder_text` (`messages/de.json:107`).
- **«Dokumente»:** entspricht dem Menüpunkt `nav_documents` in allen vier Sprachen (`:14`: Dokumente, Documents, Documenti, Documents) und dem Glossar (`UBIQUITOUS_LANGUAGE.md:159`, «Dokument»). Der Verweis «unter «Dokumente»» stimmt an allen drei Stellen, an denen `deliveryErrorText` erscheint: Abrechnungsdetail (`ReminderFeedback.svelte`), Mieterdetail (`TenantDocumentRow.svelte:35`, dort gibt es keinen Knopf «Als versendet markieren», der Verweis ist also nötig) und Liste «Dokumente» (`DocumentItem.svelte:53`, dort ist er redundant, aber nicht falsch).
- **«als versendet markieren»:** entspricht dem Knopf `documents_mark_sent` (de «Als versendet markieren», fr «Marquer comme envoyé», it «Segnare come inviato», en «Mark as sent», `:805`).
- **Begriffe fr/it/en nach `docs/design/i18n-begriffe.md:63,65`:** rappel / sollecito / reminder, document / documento / document, locataire / inquilino / tenant. Alle stimmen.
- **Grammatik der Grundtexte:** fr «L’e-mail n’a pas été distribué» (e-mail m.) und «marquez-le» (rappel m.) sind korrekt. it «L’e-mail non è stata recapitata» (f.), «lo spedisca», «lo segni come inviato» (sollecito m.) ebenso. de «Drucken Sie die Mahnung aus, schicken Sie sie …, markieren Sie sie danach …» (Mahnung f.) ebenso. Genus der Prädikate im zusammengesetzten Satz: fr «prêt» passt zu rappel (m.), it «pronto» zu sollecito und promemoria (beide m.); nur der fehlende Artikel stört (V-4).
- **Reihenfolge:** Erst das Ergebnis (liegt zum Versand bereit), dann Ursache und Handlung. Unter dem Alert-Titel «E-Mail nicht zugestellt» (`statements_email_not_delivered`) liest sich das schlüssig. «Die E-Mail» im zweiten Satz ist durch den Titel eindeutig.
- **Tests:** `src/__tests__/backend-error.test.ts:127` und `statement-pages.dom.test.ts:848` erwarten die neuen deutschen Texte wörtlich.

## Nicht bestätigt

- **Rechtsgrundlage des Postversands:** Das Delta behauptet nichts Rechtliches. Es sagt nur, die Mahnung per Post zu schicken. Ob eine Mahnung formfrei ist (Art. 102 OR), habe ich nicht auf Fedlex nachgeschlagen, weil der Text keine solche Aussage macht. Ein Hinweis auf Art. 257d OR fehlt weiterhin; das ist #59 und nicht Teil des Deltas.
- **Text nach dem Versand:** Nach «Als versendet markieren» zeigt die Dokumentzeile weiter «Drucken Sie die Mahnung aus … markieren Sie sie danach … als versendet» (`DocumentItem.svelte:53`, `TenantDocumentRow.svelte:34–36`; die Bedingung ist nur `document.deliveryError`). Das sieht nach einer veralteten Aufforderung aus. Es ist vorbestehend und gehört thematisch zu #194 («per E-Mail · Versendet» nach Postversand). Im laufenden App-Zustand habe ich es nicht geprüft.
- **Übersetzte Titel:** Ob #106 die Titel in der Sprache des Mieters oder in der UI-Sprache liefern wird, ist offen («Proposed», nicht entschieden). V-4 gilt für beide Varianten.
- **Duplikatsuche bei Issues:** Ich konnte nur die offenen Issues über `repos/rudini/Dwello/issues` auflisten, die Suche ist in dieser Sitzung gesperrt. Ein eigenes Issue zur Satzgrammatik mit `{title}` fand ich nicht. Am nächsten liegt #106.
