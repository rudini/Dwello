# Fachreview W6b (#63, #105, #106), Runde 1

Gegenstand: `@wip`-Szenarien aus Commit `e5e87a5` (Worktree `review-w6b-fach`) und die vorgeschlagenen Texte in `scratchpad/w6b-texts.md`. Grundlage: die Abschnitte «Decided (product owner)» der Issues #63, #105 und #106 (per `gh api` gelesen) sowie der Kommentar zu #106 (V-4 aus #126).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | it: «consideri questa lettera come nulla» heisst «betrachten Sie dieses Schreiben als nichtig», nicht «als gegenstandslos» |
| V-2 | Verwalter | Minor | it: die Anrede «Buongiorno {Nome Cognome},» ist für einen förmlichen Mahnbrief unüblich |
| V-3 | Verwalter | Minor | it: «intraprendere ulteriori passi» ist ein Germanismus |
| V-4 | Verwalter | Minor | Der Name des Anhangs wird bei der 2./3. Mahnung auf Italienisch zu «2_ sollecito …pdf» |
| V-5 | Verwalter | Minor | Der Dialog «Mahnung senden» nennt die Sprache des Briefs nicht. Bei Briefversand druckt der Vermieter einen Brief, den er vielleicht nicht lesen kann |
| V-6 | Verwalter | Minor | Das Szenario «Zahlungserinnerung in der Sprache des Mieters» prüft nicht, dass die Oberfläche des Vermieters bei «Zahlungserinnerung» bleibt |
| V-7 | Verwalter | Nit | fr/it/en: einige Wendungen im Brief sind wörtlich übersetzt und klingen nicht idiomatisch |
| V-8 | Verwalter | Nit | fr: «jusqu’au {date}» und fehlende geschützte Leerzeichen (vor «:» und in « … ») |
| V-9 | Verwalter | Nit | `statements_reminder_letter`: de «in den Dokumenten» und it «tra i documenti» weichen von «unter «Dokumente»» bzw. «in «Documenti»» ab |
| V-10 | Verwalter | Nit | Stufe 3 sagt «umgehend» und setzt danach eine Frist «bis {date}» (bestand schon vorher, die Übersetzungen übernehmen es) |
| V-11 | Verwalter | Nit | Rätoromanisch steht noch in `docs/nebenkostenabrechnung-anforderungen.md:87` und in «Done means» von #106 |

Keine Blocker. Keinen Befund in der Rolle Mietrecht (siehe «Bestätigt»). Die Rolle Rechtstexte ist nicht betroffen.

## Befunde

### V-1 (Major): it «come nulla»

- Beleg: `w6b-texts.md`, Zeile «Already paid», it: «Se ha già effettuato il pagamento, consideri questa lettera come nulla.»
- Warum falsch: «nullo/nulla» ist im Italienischen der Rechtsbegriff für «nichtig» (vgl. «nullità» im CO/OR). Der deutsche Satz meint «gegenstandslos», also «nicht beachten, falls schon bezahlt». Dieser Brief geht an den Mieter und kann ihn in Verzug setzen (Art. 102 Abs. 1 OR, it: «il debitore è costituito in mora mediante l’interpellazione del creditore»). Ein Mieter könnte daraus lesen, die Mahnung sei nichtig. Bei «questa lettera» kommt hinzu, dass derselbe Text auch als E-Mail verschickt wird.
- Lösung: «Se ha già effettuato il pagamento, non tenga conto della presente.» (alternativ: «… consideri la presente priva di oggetto.»)

### V-2 (Minor): it Anrede

- Beleg: `w6b-texts.md`, «Salutation», it «Buongiorno {Nome Cognome},». `reminder-pdf.ts:33` hängt das Komma an.
- Warum: In der Geschäftskorrespondenz der italienischen Schweiz ist «Gentile {Nome Cognome}» die übliche geschlechtsneutrale Anrede. Das Datenmodell kennt kein Geschlecht und keine Anrede (`schema.ts` hat kein entsprechendes Feld). «Buongiorno» wirkt in einem Mahnbrief zu salopp. Das deutsche «Guten Tag Vorname Name» ist dagegen in der Schweiz als neutrale Briefanrede eingeführt.
- Lösung: «Gentile {Nome Cognome},». fr: «Bonjour {Prénom Nom},» ist in der Romandie in E-Mails verbreitet und vertretbar. Förmlicher wäre «Madame, Monsieur,» (Nit, freie Wahl). en «Dear {First Last},» ist korrekt.

### V-3 (Minor): it «ulteriori passi»

- Beleg: Stufe 3, it «… altrimenti dovremo intraprendere ulteriori passi.»
- Warum: Das ist die wörtliche Übersetzung von «weitere Schritte einleiten». Im Italienischen sagt man «provvedimenti» bzw. «misure».
- Lösung: «… in caso contrario saremo costretti ad avviare ulteriori provvedimenti.» fr «entreprendre d’autres démarches» ist korrekt; «engager d’autres démarches» wäre etwas üblicher (Nit). en ist korrekt.

### V-4 (Minor): Dateiname des Anhangs auf Italienisch

- Beleg: `backend/src/services/reminder.service.ts:129` `fileName: \`${letter.title} ${statement.statementNumber}.pdf\`.replace(/[^\w. -]/g, '_')`. Das `\w` erfasst «°» nicht. Aus «2° sollecito» wird «2_ sollecito NK-….pdf». Der Name geht als Anhang an den Mieter (`reminder.service.ts:105`) und landet in den Dokumenten.
- Warum: Der Mieter sieht einen beschädigten Dateinamen. fr «2e rappel» und en «2nd reminder» sind nicht betroffen.
- Lösung: «°» im Dateinamen zulassen oder es vorher ersetzen (z. B. «2o sollecito» bzw. «Sollecito 2»). Dazu ein Unit-Test für den Dateinamen der Stufe 2 auf Italienisch.

### V-5 (Minor): Der Vermieter erfährt die Sprache der Mahnung nicht

- Beleg: `messages/de.json` `statements_reminder_by_letter` («Dwello erstellt die {next} als PDF und legt sie unter «Dokumente» bereit. … Drucken Sie ihn danach aus …») und `statements_reminder_by_email`. `w6b-texts.md`: «The landlord's UI keeps naming a reminder by its level in the UI language». #105 setzt den Hinweis «PDF auf {Sprache}» nur bei der Abrechnung.
- Warum: Ab #106 ist die Mahnung französisch, die Oberfläche sagt aber «Zahlungserinnerung». Bei Briefversand druckt der unerfahrene Vermieter einen Brief in einer Sprache, mit der er nicht rechnet, und schickt ihn ab. Die Design-Regeln verlangen, dass Bestätigungen die tatsächliche Folge nennen.
- Lösung (Produktentscheid, nicht Teil der Entscheide in #105/#106): den Satz im Mahn-Dialog ergänzen, etwa «Dwello erstellt die {next} auf {Sprache} als PDF …» (fr «… en {langue} …», it «… in {lingua} …», en «… in {language} …»). Der Aufrufer eröffnet dazu ein Issue (Labels `fachlich`, `entscheiden`). Für W6b kein Blocker.

### V-6 (Minor): Das Szenario sichert die Oberfläche des Vermieters nicht ab

- Beleg: `statement-reminder.feature`, neues Szenario «Zahlungserinnerung in der Sprache des Mieters». Es prüft nur den E-Mail-Betreff «Rappel de paiement». Nach #106 speichert das Backend den Titel in der Sprache des Mieters (`reminder.service.ts:128` `title: letter.title`). Die Oberfläche bleibt nur deshalb deutsch, weil `localTitle` den Titel über die Mahnstufe ersetzt (`src/lib/server/documents.ts:10-13`, `statement-actions.ts:47-50`).
- Warum: Die Hauptgefahr von #106 aus Sicht des Vermieters ist eine Meldung wie «Das Dokument «Rappel de paiement» wurde per E-Mail versendet.» in der deutschen Oberfläche. Das Szenario würde das nicht bemerken.
- Lösung: das Szenario um zwei Schritte ergänzen: `Und die Abrechnung führt die "Zahlungserinnerung" als "Versendet"` und `Und meldet die Abrechnung "Das Dokument «Zahlungserinnerung» wurde per E-Mail versendet."`. Nebenbei (Code, Nit): die Kommentare «the backend stores the German title» in `documents.ts:9` und `statement-actions.ts:46` stimmen danach nicht mehr.

### V-7 (Nit): Idiomatik

- fr Stufe 1: «Selon nos documents, … Vous avez peut-être oublié le paiement.» Besser: «Sauf erreur de notre part, le {s} n’a pas encore été réglé. Ce paiement vous a peut-être échappé.» («oublié» klingt vorwurfsvoller als «übersehen».)
- it Stufe 1: «Secondo i nostri documenti, … Forse ha dimenticato il pagamento.» Besser: «Secondo la nostra contabilità, il {s} non è ancora stato pagato. Forse il pagamento le è sfuggito.»
- en Zahlung: «(please state it with your payment)». Besser: «(please quote it with your payment)».
- Sonst korrekt: Genus und Artikel («le décompte», «il conteggio»), Höflichkeitsform (vous/Lei, «La preghiamo», «consideri»), Grussformeln («Meilleures salutations», «Cordiali saluti», «Kind regards»).

### V-8 (Nit): Französische Typografie und Frist

- «Veuillez virer le montant jusqu’au {date}»: In der Romandie ist «jusqu’au» verständlich, eindeutig als Frist ist aber «au plus tard le {date}».
- `docs/design/i18n-begriffe.md`, Zeile 5: «French guillemets with a non-breaking space inside». In `w6b-texts.md` stehen normale Leerzeichen (0 Treffer für U+00A0), auch vor «:» («Montant dû : CHF», «compte suivant :»). Im PDF U+00A0 verwenden, wie es `pdf.service.ts` tut (` `), nicht U+202F, das die Standardschrift Helvetica (WinAnsi) nicht kennt.

### V-9 (Nit): Uneinheitlicher Verweis auf die Dokumente

- Beleg: Vorschlag de «… liegt als Brief zum Ausdrucken in den Dokumenten bereit.», it «… tra i documenti.». Daneben `statements_reminder_undelivered` de «unter «Dokumente»», it «in «Documenti»». Die Vorschläge für fr und en sagen schon «sous « Documents »» bzw. «under «Documents»».
- Lösung: de «Das Dokument «{title}» liegt als Brief zum Ausdrucken unter «Dokumente» bereit.», it «Il documento «{title}» è pronto da stampare come lettera in «Documenti».» Den Text im Szenario «Mahnung per Brief» entsprechend anpassen, solange es noch `@wip` ist.

### V-10 (Nit, bestand schon vorher): «umgehend» und Frist

- Beleg: `reminder-letter.ts:34` «Begleichen Sie den Betrag bitte umgehend …» und `:43` «… bis {deadline}». Die Vorschläge übernehmen das (fr «immédiatement», it «immediatamente», en «immediately»).
- Warum: Seit #107 setzt jede Mahnung eine neue Zahlungsfrist. «Umgehend» und ein Datum in der Zukunft widersprechen sich leicht. Nicht durch W6b verursacht. Lösung bei Gelegenheit: «… bitte bis zum unten genannten Datum».

### V-11 (Nit): Reste von Rätoromanisch

- `docs/nebenkostenabrechnung-anforderungen.md:87` sagt noch «PDF in der Sprache des Mieters (de, fr, it, rm, en; Glossar) … Bei Rätoromanisch Zahlteil auf Deutsch (offener Punkt)». Der Plan nennt das Dokument, es muss also mitgeändert werden.
- #106, «Done means»: «rm uses German as the statement PDF does». Durch #63 ist das überholt. Im Pull Request vermerken (CLAUDE.md, «Coding guidelines»).

## Bestätigt

- **Begriffe:** Die Titel der Mahnstufen «Rappel de paiement / 2e rappel», «Promemoria di pagamento / 2° sollecito» und «Payment reminder / 2nd reminder» entsprechen `docs/design/i18n-begriffe.md:67`. Die 3. Stufe («3e rappel», «3° sollecito», «3rd reminder») folgt demselben Muster und steht schon in `messages/*.json` (`documents_reminder_3`). Sie ist nicht mit ❓ markiert, ein Issue nach #106 «Done means» ist also nicht nötig. «Décompte des charges», «conteggio spese accessorie» und «utility cost statement» entsprechen `i18n-begriffe.md:52`. Das Glossar führt den Begriff «Sprache» (`UBIQUITOUS_LANGUAGE.md:227`) und kennt nur noch de/fr/it/en (`:229-234`). Damit passt das Szenario «bietet das Formular die Sprachen "Deutsch, Französisch, Italienisch, Englisch" an».
- **Label (#105):** «Sprache für Abrechnung und Mahnungen» entspricht dem Entscheid. «Langue du décompte et des rappels», «Lingua del conteggio e dei solleciti» und «Language of statements and reminders» sind korrekt. Der Schlüssel `tenants_language` wird auch auf der Mieterseite verwendet (`TenantContactCard.svelte:40`). Das Label ändert sich dort also mit, was einheitlich und erwünscht ist.
- **Hilfetext (#63, #106):** Die vier Vorschläge nennen Abrechnung und Mahnungen, der Satz zu Rätoromanisch fällt weg. Das entspricht beiden Entscheiden.
- **«PDF auf {Sprache}»:** Für jede Sprache gibt es eine eigene Meldung. Die Sprachnamen in fr/it sind klein geschrieben («PDF en français», «PDF in francese»), das ist richtig. Es braucht eigene Schlüssel, weil `tenants_language_fr` («Français») gross geschrieben ist und auch im Kategorieformular dient. Das PDF der Abrechnung datiert in allen Sprachen mit `formatSwissDate` (`pdf.service.ts:431`). Dass die Mahnung TT.MM.JJJJ verwendet, ist damit einheitlich.
- **`statements_reminder_emailed/_letter` (#106, Kommentar zu #126):** Der Titel steht in Anführungszeichen nach «Das Dokument / Le document / Il documento / The document», wie bei `statements_reminder_undelivered`. Das entspricht dem Entscheid.
- **Betrag:** Gemahnt wird nur ein positiver Saldo (`reminder.service.ts:60`, `REMINDER_REFUND`). Der Randfall Rückerstattung kann also keinen Mahnbrief in irgendeiner Sprache erzeugen. Der Betrag erscheint unverändert als `CHF ${amount.toFixed(2)}` (z. B. 1234.5 → «CHF 1234.50», 0.05 → «CHF 0.05»). Die Sprache ändert keinen Betrag, es gibt keine Formel nachzurechnen.
- **Mietrecht:** Eine Mahnung setzt in Verzug: Art. 102 Abs. 1 OR (Fedlex, SR 220): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Eine Formvorschrift oder Sprachvorgabe für die Mahnung enthält der Artikel nicht. Die 3. Mahnung ist keine Fristansetzung nach Art. 257d Abs. 1 OR: «Ist der Mieter nach der Übernahme der Sache mit der Zahlung fälliger Mietzinse oder Nebenkosten im Rückstand, so kann ihm der Vermieter schriftlich eine Zahlungsfrist setzen und ihm androhen, dass bei unbenütztem Ablauf der Frist das Mietverhältnis gekündigt werde. Diese Frist beträgt mindestens zehn Tage, bei Wohn- und Geschäftsräumen mindestens 30 Tage.» Die Vorschläge für fr/it/en drohen, wie der deutsche Text, keine Kündigung an («d’autres démarches», «further steps»). Sie täuschen also keine Wirkung nach Art. 257d vor. So muss es bleiben: Eine Übersetzung darf «weitere Schritte» nicht als «résiliation/disdetta/termination» wiedergeben.
- **Szenarien:** Schritte und Fachwörter folgen dem Glossar. Das Szenario «Abrechnung nennt die Sprache ihres PDFs» prüft den Hinweis vor dem Erstellen. Das passt zur Aussage in `w6b-texts.md`, dass ein schon erstelltes PDF seine Sprache behält.

## Fehlende Begriffe

Keine. «Offener Betrag / Montant dû / Importo dovuto / Amount outstanding» ist kein Glossarbegriff und bestand schon vorher. Er widerspricht dem Glossar nicht. «Montant dû» liegt nahe bei «montant à payer» (Nachzahlung, `i18n-begriffe.md:59`), ist aber im Brief eindeutig. Für V-5 ist ein Produktentscheid nötig, kein neuer Begriff.

## Nicht bestätigt

- **Gesetzliche Vorgabe zur Sprache einer Mahnung oder Nebenkostenabrechnung:** keine gefunden. Gesucht habe ich in OR Art. 102, 257a–257d (Fedlex-Filestore, Fassung 20250101, de/fr/it), in `docs/nebenkostenabrechnung-anforderungen.md:87` und `:166` («keine Vorgabe gefunden») und mit `mmx search`. Ob ein Brief in der Sprache des Mieters statt der Amtssprache am Ort der Liegenschaft rechtlich etwas bewirkt (z. B. für den Zugang einer Mahnung oder einer späteren Fristansetzung nach Art. 257d), ist **unsicher**. Für eine reine Zahlungserinnerung ist das vermutlich unerheblich.
- **Stand der Fedlex-Fassung:** Die Fedlex-Webseite liefert ohne JavaScript nichts. Zitiert habe ich aus der Filestore-HTML-Fassung vom 01.01.2025. Eine spätere Änderung der Art. 102 und 257d OR habe ich nicht geprüft.
- **Anrede und Grussformel (V-2, V-7):** Das ist Branchenpraxis aus Sicht eines Verwalters, ohne schriftliche Quelle.
- **Darstellung im PDF:** Ob pdfkit/Helvetica «’», «°», ««»» und U+00A0 richtig darstellt, habe ich nicht durch Rendern geprüft. Nach der WinAnsi-Kodierung sind die Zeichen enthalten, U+202F dagegen nicht. Das gehört zu `daten-pruefer` im Feature-Review.
