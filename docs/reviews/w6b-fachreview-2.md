# Fachreview W6b (#63, #105, #106), Runde 2

Gegenstand: `git diff e5e87a5 758b220` im Worktree `review-w6b-fach2` (Commit 758b220). Geprüft habe ich die Briefe in `backend/src/services/reminder-letter.ts`, die Migration `0008_tenant_language_without_rm.sql`, die Meldungen in `messages/*.json`, die geänderten Szenarien und die Dokumentation. Die Briefe habe ich für fr/it/en, Stufe 1 und 3, mit den Beträgen 1234.50 und 0.05 gerendert (Skript im Scratchpad, `print-letter.ts`).

## Übersicht (nur offene oder neue Befunde)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-12 | Verwalter | Minor | `UBIQUITOUS_LANGUAGE.md:227` sagt noch «die Mahnungen ebenfalls (geplant, #106)». Mit diesem Commit ist das umgesetzt |
| V-13 | Verwalter | Nit | en: «please disregard this letter» steht auch im Text der E-Mail |
| V-14 | Verwalter | Nit | Rätoromanisch und «UI German only» stehen noch in `docs/tech-stack.md:517`. «German user interface» steht in den geänderten PRD-Zeilen |
| V-10 | Verwalter | Nit | (bestand schon vorher, bleibt) «umgehend / immédiatement / immediatamente / immediately» und danach eine Frist |

Keine Blocker und keine Major. Keinen Befund in der Rolle Mietrecht. Die Rolle Rechtstexte ist nicht betroffen.

## Prüfung der Befunde aus Runde 1

| ID R1 | Status | Beleg |
|---|---|---|
| V-1 | erledigt | `reminder-letter.ts:73` it: «Se ha già effettuato il pagamento, non tenga conto della presente.» |
| V-2 | erledigt | `:74` «Gentile», gerendert als «Gentile Anna Keller,» |
| V-3 | erledigt | `:68` «… altrimenti dovremo avviare ulteriori provvedimenti.» |
| V-4 | erledigt | `reminder.service.ts:131` ersetzt nur noch `\ / : * ? " < > \|`. Der Test `reminders.pg.test.ts:419-422` erwartet einen Anhang, der mit «2° sollecito » beginnt |
| V-5 | als Issue | #305 ist offen und hat die Labels `fachlich` und `entscheiden` |
| V-6 | erledigt | `statement-reminder.feature:46-48`. Die Kommentare in `documents.ts:9` und `statement-actions.ts:47` sind angepasst |
| V-7 | erledigt | fr `:48` «Sauf erreur de notre part … vous a peut-être échappé», it `:65` «Secondo la nostra contabilità … le è sfuggito», en `:89` «please quote it» |
| V-8 | erledigt | fr `:54` «au plus tard le». `NBSP` (`:23`) ist U+00A0 (Bytes `302 240`) und steht vor «:» (`:53`, `:54`). In `messages/fr.json` stehen innerhalb von « » ebenfalls U+00A0 (`statements_reminder_emailed/_letter`, geprüft mit `od -c`) |
| V-9 | erledigt | de «… liegt unter «Dokumente» als Brief zum Ausdrucken bereit.», it «… in «Documenti».», das Szenario `statement-reminder.feature` ist angepasst |
| V-10 | offen, bestand schon vorher | siehe unten |
| V-11 | erledigt (Dokument) | `docs/nebenkostenabrechnung-anforderungen.md:87` lautet jetzt «de, fr, it, en; … Rätoromanisch entfernt, #63». Den Hinweis zu «Done means» von #106 muss der Aufrufer im Pull Request anbringen |

## Befunde

### V-12 (Minor): Das Glossar nennt die Mahnungen in der Sprache des Mieters noch «geplant»

- Beleg: `UBIQUITOUS_LANGUAGE.md:227`: «Die Nebenkostenabrechnung (PDF) wird in dieser Sprache erstellt, die Mahnungen ebenfalls (geplant, #106).» Der Commit setzt #106 um: `reminder.service.ts:90` gibt `language: tenant.language` an `reminderLetter` weiter. In `docs/api-specification.md` steht es schon als umgesetzt.
- Warum: Das Glossar ist die erste Quelle für Fachbegriffe und Regeln. Nach dem Merge widerspricht es dem Code und der API-Spezifikation. Die Datei darf niemand ausser dem Product Owner ändern (CLAUDE.md, «Design-Regeln»).
- Lösung: Der Aufrufer eröffnet ein Issue (Labels `fachlich`, `entscheiden`) mit dieser Formulierung: «Die Nebenkostenabrechnung (PDF) und die Mahnungen (Brief, PDF und E-Mail) werden in dieser Sprache erstellt.» Das blockiert W6b nicht.

### V-13 (Nit): en «this letter» in der E-Mail

- Beleg: `reminder-letter.ts:90` «If you have already made the payment, please disregard this letter.» `text` (`:130`) ist auch der Text der E-Mail (`reminder.service.ts:106`).
- Warum: Bei Versand per E-Mail liest der Mieter «this letter» in einer E-Mail. de «dieses Schreiben», fr «ce courrier» und it «la presente» passen für beide Kanäle, en nicht ganz.
- Lösung: «… please disregard this reminder.» (der Test in `reminder-letter.test.ts` ist entsprechend anzupassen).

### V-14 (Nit): Veraltete Sprachangaben in der Dokumentation

- `docs/tech-stack.md:517`: «Further UI languages (fr, it, rm, en); the UI is German only». Die Zeile nennt rm, und die Oberfläche gibt es schon auf de/fr/it/en (`UBIQUITOUS_LANGUAGE.md:227`, `messages/*.json`).
- `docs/PRD-Dwello.md:46` «German user interface; …» und `:1521` «UI in German; …». Der Commit ändert diese Zeilen, lässt die falsche Aussage zur Oberfläche aber stehen.
- Lösung: tech-stack: rm streichen und die Zeile auf weitere Sprachen über die vier vorhandenen hinaus beschränken oder ganz entfernen. PRD: «User interface in German, French, Italian and English; …».

### V-10 (Nit, bestand schon vorher): «umgehend» und Frist

Unverändert gegenüber Runde 1. Gerendert: fr Stufe 3 «Veuillez régler le montant immédiatement …» und danach «… au plus tard le 15.11.2026». Gleich in it/en/de. Wird nicht durch W6b verursacht.

## Bestätigt

- **Brieftexte fr/it/en (gerendert):** Die Titel und Betreffzeilen entsprechen `docs/design/i18n-begriffe.md:67`, also «Rappel de paiement / 3e rappel – Décompte des charges …», «Promemoria di pagamento / 3° sollecito – Conteggio spese accessorie …» und «Payment reminder / 3rd reminder – Utility cost statement …». Ebenso die Bezeichnung der Abrechnung (`:52`). Die Höflichkeitsform ist durchgehend (vous / Lei / please). Kein Text ausser dem Datum ist hart auf Deutsch codiert: `reminder-pdf.ts` setzt nur Adressen, «Ort, Datum» sowie Betreff, Anrede, Absätze und Gruss aus dem Brief. Die Daten stehen in allen Sprachen als TT.MM.JJJJ, wie im PDF der Abrechnung.
- **Betrag:** `chf()` ist für alle Sprachen gleich, «CHF 1234.50» bzw. «CHF 0.05». Eine Rückerstattung wird nicht gemahnt (`REMINDER_REFUND`, Runde 1). Die Sprache ändert keinen Betrag, es gibt keine Formel nachzurechnen.
- **Mietrecht:** Die Texte der 3. Stufe drohen in keiner Sprache mit einer Kündigung: «d’autres démarches», «ulteriori provvedimenti», «further steps». Sie erwecken also keinen Anschein einer Fristansetzung nach Art. 257d Abs. 1 OR (Wortlaut in Runde 1 zitiert: «… so kann ihm der Vermieter schriftlich eine Zahlungsfrist setzen und ihm androhen, dass bei unbenütztem Ablauf der Frist das Mietverhältnis gekündigt werde. Diese Frist beträgt mindestens zehn Tage, bei Wohn- und Geschäftsräumen mindestens 30 Tage.»). Als Mahnung nach Art. 102 Abs. 1 OR («Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.») ist jeder Brief eindeutig: Er nennt Abrechnung, Betrag, Konto und Frist. it «non tenga conto della presente» stellt die Wirkung nicht mehr in Frage (Runde 1, V-1).
- **Migration 0008:** `rm` wird bei Mietern und bei `default_language` zu `de`, danach erlaubt der CHECK nur noch de/fr/it/en. Fachlich richtig: Rätoromanisch wurde ohnehin auf Deutsch ausgegeben (alter Hilfetext), am Ergebnis für den Mieter ändert sich also nichts. Bereits erstellte PDFs und Dokumente bleiben unverändert.
- **Label und Hilfetext (#105, #63):** de «Sprache für Abrechnung und Mahnungen» / «In dieser Sprache erstellt Dwello die Nebenkostenabrechnung und die Mahnungen.». fr «Langue du décompte et des rappels» / «Dwello établit …» (`i18n-begriffe.md:96` «Établir»). it «Lingua del conteggio e dei solleciti» / «Dwello allestisce …» («Allestire i conteggi»). en entsprechend. Alle Hinweise auf Rätoromanisch sind entfernt (`tenants_language_rm` gibt es nicht mehr, in `src`, `backend/src` und `messages` keine Treffer mehr ausser dem Kommentar im Szenario).
- **«PDF auf {Sprache}» (#105):** `PdfAction.svelte:21-45` zeigt den Hinweis nur vor dem Erstellen, mit `describedby` am Knopf. Die Sprache stammt von `tenantLanguage` (`statement.ts:69`). Das Backend erzeugt das PDF ohne Angabe in derselben Sprache (`statement-pdf.service.ts:257`: `language || statement.tenant?.language || 'de'`). Hinweis und Ergebnis stimmen also überein. fr/it schreiben die Sprachen klein («PDF en français», «PDF in francese»), das ist korrekt.
- **Meldungen (#106, Kommentar zu #126):** «Das Dokument «{title}» …» in allen vier Sprachen, fr mit geschützten Leerzeichen. Der Titel erscheint in der Sprache der Oberfläche (`localTitle`), das Szenario sichert das ab.
- **Szenarien:** Sie verwenden nur Glossarbegriffe (Sprache, Mieter, Zahlungserinnerung, Mahnung, Abrechnung, Dokument). Die `@wip`-Markierungen der umgesetzten Szenarien sind entfernt.
- **Dokumentation:** PRD, api-specification, data-model und nebenkostenabrechnung-anforderungen nennen de/fr/it/en und Mahnungen in der Sprache des Mieters (mit Ausnahme von V-14).

## Fehlende Begriffe

Keine neuen. V-12 betrifft eine Regel im Glossar, keinen Begriff. Vorschlag für das Issue: siehe V-12.

## Nicht bestätigt

- **Gesetzliche Vorgabe zur Sprache einer Mahnung:** wie in Runde 1 keine gefunden (OR Art. 102, 257a–257d; `nebenkostenabrechnung-anforderungen.md:87` «keine gesetzliche Vorgabe gefunden»). Die Fedlex-Zitate stammen aus Runde 1 (Filestore-Fassung 01.01.2025). In dieser Runde habe ich sie nicht neu abgerufen, ob es spätere Änderungen gibt, ist **unsicher**.
- **PDF-Darstellung:** «’», «°», «è» und U+00A0 sind in WinAnsi/Helvetica enthalten. Gerendert habe ich nur den Text (`reminderLetter`), nicht das PDF. Die visuelle Prüfung gehört zu `daten-pruefer`.
- **Dateiname mit «°» im E-Mail-Anhang:** Der Test prüft den Namen im Mail-Stub. Wie E-Mail-Programme den Namen anzeigen (RFC 2231), habe ich nicht geprüft.
- **Idiomatik von Anrede und Grussformeln:** Branchenpraxis ohne schriftliche Quelle (wie in Runde 1).
- **Betragsformat «CHF 1234.50» ohne Tausender-Apostroph:** bestand schon vorher und gilt für alle Sprachen gleich. Nicht Teil von W6b, nicht als Befund geführt.
