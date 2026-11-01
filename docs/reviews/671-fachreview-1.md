# Fachreview #671 Teil 2 (Runde 1): Zahlungserinnerung/Mahnung in der französischen Datenschutzerklärung

Gegenstand: Worktree /tmp/w-scratch/review-671-fach (w-671-wip, 9fd003367), @wip-Szenario tests/e2e/features/privacy.feature:113-116, vorgeschlagener Text für privacy_mail_smtp, privacy_mail_resend, privacy_mail_smtp_provider (fr).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | «les rappels de paiement et les rappels» / «pour un rappel de paiement ou un rappel» liest sich auf Französisch doppelt: «rappel» ist der Oberbegriff (Glossar Z. 110: Mahnung = rappel; UBIQUITOUS_LANGUAGE.md Z. 223/225: die Mahnung ist die Zahlungsaufforderung, die Mahnstufen sind Zahlungserinnerung, 2. und 3. Mahnung; fr glossary_reminder_text Z. 114: «d’abord un rappel de paiement, puis au plus un 2e et un 3e rappel»). Fix: «les rappels de paiement et les rappels suivants» / «pour un rappel de paiement ou un rappel suivant», wie en «payment reminders and further reminders»; Szenariozeilen 115-116 entsprechend anpassen (@wip, frei). Wortlaut unten. |
| V-2 | Verwalter | Minor | en hat dieselbe Lücke im zweiten Satz: messages/en.json Z. 180, 181, 2003 «for a reminder, the address and the amount due», de dagegen «bei einer Zahlungserinnerung oder Mahnung». Fix: «for a payment reminder or further reminder, …». Wortlaut unten. |

Wortlaut (nur die geänderten Teilsätze; der Rest jedes Schlüssels bleibt; de und it bleiben unverändert):

| key | de | fr | it | en |
|-----|----|----|----|----|
| privacy_mail_smtp, privacy_mail_resend, privacy_mail_smtp_provider (1. Satz, Anfang) | Nebenkostenabrechnungen, Zahlungserinnerungen und Mahnungen per E-Mail werden über … zugestellt | Les décomptes des charges, les rappels de paiement et les rappels suivants envoyés par e-mail passent par … | I conteggi spese accessorie, i promemoria di pagamento e i solleciti per e-mail sono recapitati tramite … | Utility cost statements, payment reminders and further reminders sent by email are delivered through … |
| privacy_mail_smtp, privacy_mail_resend, privacy_mail_smtp_provider (Aufzählung) | bei einer Zahlungserinnerung oder Mahnung Adresse und offener Betrag | pour un rappel de paiement ou un rappel suivant, l’adresse et le montant dû | per un promemoria o un sollecito indirizzo e importo dovuto | for a payment reminder or further reminder, the address and the amount due |

«sommation» statt «rappel»: nein. In der Westschweizer Praxis bezeichnet «sommation» eher die letzte, förmliche Aufforderung (oft mit Androhung von Betreibung oder Kündigung); das Glossar legt «rappel» / «2e rappel» fest, und die französische Oberfläche verwendet durchgehend «Rappel de paiement», «2e rappel», «3e rappel» (fr.json Z. 1149-1151, 86, 113-114). Ein drittes Wort nur in der Datenschutzerklärung würde dem widersprechen.

Stand (Szenario «Stand der Datenschutzerklärung», 29. Oktober 2026): bleibt. Art. 19 DSG (SR 235.1, Stand 7. Juli 2025) verlangt in Abs. 2 Bst. c «gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden», und in Abs. 4 den Staat und die Garantien. Empfänger, Land, Datenkategorien und Garantie ändern sich nicht. Schon das bisherige fr «rappels» deckte als Oberbegriff alle Mahnstufen ab; die Korrektur macht den Text nur genauer und gleicht ihn der deutschen Grundfassung an. Ein neues Datum bräuchte ausserdem ein Issue mit «Decided (product owner)» (CLAUDE.md, Workflow 1). privacy_stored_1, privacy_retention_1 und privacy_ai_keys_1 sagen in de nur «Mahnungen», also bleibt dort «rappels» richtig.

Geprüft: Glossar Z. 110 (fr/it/en), UBIQUITOUS_LANGUAGE.md Z. 223-225, fr/it/en documents_reminder_1-3, help_payments_3, glossary_reminder_text; it nennt in allen drei Schlüsseln beide (promemoria di pagamento / solleciti, im zweiten Satz die kurze Form «promemoria»), keine Lücke; Art. 19 DSG auf Fedlex.

## Nicht bestätigt
- Ob «rappel suivant» in der Westschweizer Verwaltungspraxis üblich ist, habe ich nicht mit einer Quelle belegt. Es ist eine beschreibende Wendung und kein Glossarbegriff; sie folgt der Reihenfolge in fr help_payments_3 («un rappel de paiement, puis … un 2e ou un 3e rappel»). Wer ganz ohne neue Wendung auskommen will, schreibt «les rappels de paiement ainsi que les 2es et 3es rappels»; das ist aber schwerfälliger.
