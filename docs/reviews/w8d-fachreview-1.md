# Fachreview #86 «Abrechnung per E-Mail senden», Runde 1

Gegenstand: Worktree `review-w8d-fach` (Commit 02a3e46), `tests/e2e/features/statement-send.feature`, `tests/e2e/steps/statement-send.steps.ts` sowie die vorgeschlagenen Texte (Dialog, Fehlermeldungen, E-Mail, Dokument, `privacy_third_1`).

Gesamturteil: Kein Blocker. Die Entscheidung (Option 2) ist mietrechtlich zulässig und fachlich üblich. Zwei Major: Die Zahlungsfrist ab dem Versand wird in keinem Szenario geprüft (V-1), und in der Datenschutzerklärung fehlt der Staat des Mailversand-Anbieters Resend (R-1, bestand schon vorher, betrifft durch diese Änderung aber deutlich mehr Daten).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die entschiedene Regel «Zahlungsfrist ab dem erfolgreichen Versand» prüft kein Szenario. |
| V-2 | Verwalter | Minor | Dialogtext: «Sie trägt …» ist mehrdeutig, und «die Zahlungsfrist beginnt» passt nicht zum Glossar (dort ist die Zahlungsfrist ein Datum). Das konkrete Datum fehlt. |
| V-3 | Verwalter | Minor | Der E-Mail-Text nennt «Saldo» und «Zahlungsfrist». Beide Wörter stehen nicht im PDF, und bei einer Rückerstattung oder einem Saldo von 0 stimmt der Satz nicht. |
| V-4 | Verwalter | Minor | Eine fehlende E-Mail-Adresse zeigt der Dialog schon vor dem Senden an. Trotzdem lässt er «Per E-Mail senden» zu, das sicher scheitert. |
| V-5 | Verwalter | Minor | Bei einem Mieter mit Kanal E-Mail gibt es den Brief nur nach einem Fehler, etwa nicht für eine eingeschriebene Zustellung. Das braucht einen Entscheid. |
| V-6 | Verwalter | Minor | Eine E-Mail, die der Mailserver annimmt und erst später zurückweist, macht die Abrechnung «Versendet», ohne dass der Verwalter davon erfährt. |
| V-7 | Verwalter | Minor | Lücken in den Szenarien: «nicht eingerichtet», Titel und Schaltfläche der Meldung, Sprache des Mieters, erneutes Senden. |
| V-8 | Verwalter | Minor | Die bestehenden Meldungen `backend_mail_*` sind auf Mahnungen zugeschnitten und für die Abrechnung nicht verwendbar. |
| V-9 | Verwalter | Nit | Beim Senden zeigt der Dialog «Wird gespeichert …» (`ui_saving`) statt eines Sende-Hinweises. |
| M-1 | Mietrecht | Minor | Den Zugang muss der Vermieter beweisen. Verlauf und Dokument sollen Adresse, Zeitpunkt und das gesendete PDF unverändert festhalten. |
| R-1 | Rechtstexte | Major | In `privacy_third_1` fehlt der Staat von Resend (Art. 19 Abs. 4 DSG). Mit der Abrechnung gehen jetzt auch Finanzdaten dorthin. |
| R-2 | Rechtstexte | Minor | Die Aufzählung, was eine Abrechnung enthält, ist unvollständig: Adresse, Wohnung, Mietdauer, Verbrauch und IBAN/Referenz fehlen. |
| R-3 | Rechtstexte | Minor | «eigener SMTP-Server» trifft nicht zu, wenn der Betreiber einen SMTP-Anbieter wie Microsoft 365 oder Infomaniak nutzt (bestand schon vorher). |

## Bestätigt (mit Quelle)

- **E-Mail als Zustellweg ist zulässig.** Art. 257a und 257b OR schreiben für die Abrechnung keine Form und keinen Zustellweg vor. Fedlex SR 220, Art. 257a Abs. 1: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.» Art. 257b Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Den Wunsch des Mieters nach E-Mail hält das Glossar fest («Korrespondenzkanal: Wie der Mieter Post erhält: Brief (`letter`) oder E-Mail (`email`)», UBIQUITOUS_LANGUAGE.md:25). Dass das Gesetz keine Form verlangt, ist ein Schluss aus dem Fehlen einer Regel, siehe «Nicht bestätigt».
- **Die Hinweise nach Art. 8 VMWG stehen im angehängten PDF** (`backend/src/services/pdf.service.ts:106-108`). Fedlex SR 221.213.11, Art. 8 Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» Die E-Mail muss diese Hinweise nicht wiederholen.
- **Zahlungsfrist = Versanddatum + `payment_deadline_days`, nie früher als eine schon gesetzte Frist.** Quellen: `docs/nebenkostenabrechnung-anforderungen.md:45,151` und `datedToday`, `backend/src/services/statement.service.ts:449-453`. Nachgerechnet:
  - Versand am 17.10.2026 mit 30 Tagen: Frist 16.11.2026 (14 Tage bis 31.10., dann 16 Tage).
  - Vorher von Hand auf den 31.12.2026 verlängert: die Frist bleibt 31.12.2026.
  - E-Mail scheitert am 17.10., Brief am 20.10.2026: Frist 19.11.2026. Massgebend ist der Tag des Briefs, der Fehlversuch zählt nicht.
  - Rückerstattung: dasselbe Datum, angezeigt als «Rückerstattung bis» (Glossar Zeile 181).
  - Saldo 0: die Abrechnung wird beim Versand sofort «Bezahlt» (`statement.service.ts:485-486`), eine Frist spielt keine Rolle.
- **Die Testdaten treffen den richtigen Fall.** Heizkosten 4000 Franken für die einzige Wohnung, Akonto 12 × 150 = 1800 Franken. Das ergibt eine Nachzahlung von mindestens 2200 Franken, also mit QR-Rechnung und mit dem Status «Versendet» statt «Bezahlt».
- **Die Begriffe stimmen mit dem Glossar überein.** «Dokument» deckt ausdrücklich «Brief oder E-Mail an einen Mieter (z.B. Mahnung) mit PDF» ab (Zeile 185). Ebenso stimmen «Versandstatus Versendet» (Zeile 187), «Entwurf» und «Versendet» (Zeilen 169-170) sowie «Korrespondenzkanal». Ein neuer Begriff ist nicht nötig.
- **Das Dokument der Abrechnung zählt nicht als Mahnung.** Die Mahnstufe zählt nur `documents.type = 'reminder'` (`statement.service.ts:47-50`, `document.service.ts:136`). Der Typ `statement` kommt also nicht in die Zählung. Gelöscht werden nur `upload`-Dokumente (`tenant.service.ts:300`).
- **Übersetzung des Betreffs** gemäss `docs/design/i18n-begriffe.md:55` (décompte des charges / conteggio spese accessorie / utility cost statement). Anrede und Gruss in den vier Sprachen wie in `backend/src/services/reminder-letter.ts:40-91`.
- **Kein Dokument bei einem Fehler** ist für Abrechnungen folgerichtig (nichts wurde zugestellt). Bei Mahnungen entsteht dagegen ein Dokument «Zu versenden» (`reminder.service.ts:102-120`). Der Unterschied ist gewollt, denn die Abrechnung selbst bleibt «Entwurf».

## Befunde

### V-1 (Major): Zahlungsfrist ab dem erfolgreichen Versand ist ungeprüft

- **Beleg:** Der dritte Punkt der Entscheidung in #86 lautet «The Zahlungsfrist counts from the successful sending». In `statement-send.feature:26-33` prüft das Szenario Status, Verlauf, E-Mail und Dokument, aber nicht die Frist. Das Szenario Z. 17-23 prüft nur, ob der Dialog den Satz enthält. Z. 53-60 (Brief nach Fehler) prüft die Frist ebenfalls nicht.
- **Warum es falsch ist:** Die Frist bestimmt, wann die Abrechnung «Überfällig» wird und wann eine Mahnung möglich ist. Ein typischer Fehler wäre, dass die Implementierung die Frist schon beim Erstellen des PDFs setzt, oder auch beim gescheiterten Versuch. Das bliebe unentdeckt.
- **Lösung:** Im Szenario «Abrechnung per E-Mail senden» einen Schritt ergänzen, etwa «Und ist die Zahlungsfrist der Abrechnung in 30 Tagen» (sichtbar auf der Detailseite oder im Dokument/PDF). Im Szenario «Nach gescheiterter E-Mail per Brief zustellen» denselben Schritt. Zusätzlich ein `*.pg.test.ts`: Nach einem gescheiterten Versand bleiben `statementDate` und `paymentDeadline` unverändert.

### V-2 (Minor): Dialogtext mehrdeutig und ohne Datum

- **Beleg:** Vorschlag «… Sie trägt das Datum des Versands, und die Zahlungsfrist beginnt an diesem Tag.» Im Glossar Zeile 181 ist die Zahlungsfrist ein «Datum, bis zu dem die Abrechnung bezahlt sein muss».
- **Warum es falsch ist:**
  - Ein Satz, der mit «Sie» beginnt, liest sich in einem Text mit «Sie»-Anrede als Anrede des Verwalters («Sie tragen …»).
  - Ein Datum «beginnt» nicht.
  - Unerfahrene Verwalter sehen nicht, welche Frist der Mieter bekommt. Hat der Verwalter die Frist vorher verlängert, beginnt auch nichts «an diesem Tag».
  - Bei einer Rückerstattung zahlt der Vermieter. Bei Saldo 0 gibt es keine Frist.
- **Lösung:** «Dwello sendet die Abrechnung als PDF per E-Mail an den Mieter und legt sie unter «Dokumente» ab. Die Abrechnung trägt das heutige Datum; zahlbar ist sie bis {Datum}.» Bei einer Rückerstattung: «… Sie überweisen den Betrag bis {Datum}.» Bei Saldo 0: «… Der Mieter muss nichts bezahlen.» Der Testschritt in `statement-send.steps.ts:35` prüft heute nur den Teilsatz «die Zahlungsfrist beginnt an diesem Tag» und müsste angepasst werden.

### V-3 (Minor): E-Mail-Text verwendet Wörter, die nicht im PDF stehen, und stimmt nicht für alle Fälle

- **Beleg:** Vorschlag «Den Saldo und die Zahlungsfrist finden Sie im PDF.» Das PDF verwendet «Nachzahlung», «Rückerstattung», «Ausgeglichen», «Bitte bezahlen Sie den Betrag bis {date} mit dem Zahlteil.», «Wir überweisen Ihnen den Betrag bis {date}.» und «Sie müssen nichts bezahlen.» (`pdf.service.ts:50-52, 82-92`).
- **Warum es falsch ist:**
  - «Saldo» ist ein internes Fachwort. Der Mieter findet es im PDF nicht.
  - Bei einer Rückerstattung hat der Mieter keine Zahlungsfrist. Bei «Ausgeglichen» gibt es weder Betrag noch Frist.
  - In der Praxis nennt ein Begleitschreiben den Betrag und das Datum direkt.
- **Lösung:** Den zweiten Satz nach Fall wählen und dafür die Texte des PDFs wiederverwenden:
  - Nachzahlung: «Ihre Nachzahlung beträgt CHF {Betrag}. Bitte bezahlen Sie den Betrag bis {Datum} mit dem Zahlteil im PDF.»
  - Rückerstattung: «Sie erhalten CHF {Betrag} zurück. Wir überweisen Ihnen den Betrag bis {Datum}.» Dazu der Satz `refundAccount`.
  - Ausgeglichen: «Sie müssen nichts bezahlen und erhalten nichts zurück.»
  - fr/it/en mit denselben Schlüsseln aus `pdf.service.ts`.

### V-4 (Minor): Fehlende E-Mail-Adresse erst nach dem Senden gemeldet

- **Beleg:** `src/routes/statements/[id]/SendDialog.svelte:57-59` zeigt bereits «keine E-Mail-Adresse erfasst» (`statements_no_email`). Das Szenario `statement-send.feature:37-42` lässt trotzdem senden und meldet den Fehler erst danach.
- **Warum es falsch ist:** Die Design-Regeln verlangen Führung statt Fehler. Der Verwalter bestätigt eine Aktion, von der Dwello schon weiss, dass sie scheitert.
- **Lösung:** Fehlt die Adresse, sagt der Dialog dies vor dem Senden und bietet «Per Brief zustellen» (bzw. einen Link zum Mieter) statt «Per E-Mail senden» an. Die serverseitige Meldung bleibt für den Fall, dass die Adresse zwischen Laden und Senden gelöscht wird. Die Entscheidung von #86 ist damit erfüllt, denn auch so sieht der Verwalter, was fehlt und was er tun kann.

### V-5 (Minor, braucht Entscheid): Brief für einen E-Mail-Mieter nur nach einem Fehler

- **Beleg:** Laut Vorschlag erscheint «Per Brief zustellen» nur in der Fehlermeldung. Laut Entscheidung bleibt der Brief «as today» nur für den Kanal Brief.
- **Warum es fachlich fehlt:** Bei einer strittigen Nachzahlung, oder wenn der Mieter ausnahmsweise Papier will, stellen Verwalter oft eingeschrieben zu. Dafür muss der Verwalter heute den Korrespondenzkanal des Mieters umstellen und danach zurückstellen.
- **Lösung (Vorschlag für ein Issue, Labels `fachlich`, `entscheiden`):** «Im Sendedialog eines Mieters mit Korrespondenzkanal E-Mail gibt es den Link „Stattdessen per Brief zustellen“. Er öffnet den heutigen Briefdialog, ohne den Korrespondenzkanal des Mieters zu ändern.» Bis zum Entscheid kein Handlungsbedarf in #86.

### V-6 (Minor): Spätere Rückweisung bleibt unbemerkt

- **Beleg:** `reminder.service.ts:108-114` setzt das Dokument auf «Versendet», sobald der Mailserver die E-Mail annimmt. Die Abrechnung soll es genauso machen.
- **Warum es fachlich fehlt:** Eine Rückweisung durch den Empfangsserver (Postfach voll, Adresse veraltet) kommt erst später als Bounce an `MAIL_FROM`. Die Abrechnung steht dann auf «Versendet», die Frist läuft, und der Mieter hat nichts erhalten. Das gilt schon heute für Mahnungen.
- **Lösung:** Mindestens ein Satz im Dialog oder in der Hilfe: «Erhalten Sie eine Rückmeldung, dass die E-Mail nicht ankam, stellen Sie die Abrechnung per Brief zu.» Bounces auszuwerten wäre eine neue Funktion (eigenes Issue, nicht in #86).

### V-7 (Minor): Lücken in den Szenarien

- **Beleg:** `statement-send.feature`.
- **Was fehlt:**
  - «E-Mail-Versand nicht eingerichtet» hat kein Szenario. Der E2E-Stack richtet den Mailversand ein, deshalb braucht es einen Test auf tieferer Ebene und `No scenario: <Grund>` (tests/e2e/CLAUDE.md, «No scenario»).
  - Der Titel «Abrechnung nicht versendet» und die Schaltfläche «Per Brief zustellen» werden nicht geprüft. Der Schritt «meldet die Abrechnung» liest nur den Text (`documents.steps.ts:65-67`).
  - Der Fall «ohne E-Mail-Adresse» (Z. 37-42) prüft nicht, dass kein Dokument entsteht. Das prüft nur Z. 51.
  - Niemand prüft, dass eine E-Mail in der Sprache des Mieters (z. B. Französisch) den französischen Betreff trägt. Ein Unit-Test der Textfunktion genügt.
  - Erneutes Senden nach dem Erfassen der Adresse ist nicht abgedeckt (optional).
- Bereits abgedeckt sind: Kanal Brief bleibt manuell (`statement-detail.feature:53-65`), Erfolg, Fehler ohne Adresse, Abweisung durch den Mailserver und Brief nach einem Fehler.

### V-8 (Minor): Fehlermeldungen der Mahnung sind nicht übertragbar

- **Beleg:** `messages/de.json:464` `backend_mail_delivery_failed`: «Die E-Mail wurde nicht zugestellt. Markieren Sie die Mahnung unter «Dokumente» …». Die Codes `TENANT_NO_EMAIL`, `MAIL_NOT_CONFIGURED` und `MAIL_DELIVERY_FAILED` teilen sich Mahnung und Abrechnung (`document.service.ts:39-43`).
- **Warum es falsch ist:** Übernimmt die Abrechnung den Code, liest der Verwalter eine Anleitung für eine Mahnung. Ausserdem weichen die Formulierungen ab: Die Mahnung sagt «wurde nicht zugestellt», der Vorschlag «konnte nicht zugestellt werden».
- **Lösung:** Eigene Meldungen für die Abrechnung, mit den vorgeschlagenen drei Texten, und eine einheitliche Formulierung (Vorschlag: «Die E-Mail wurde nicht zugestellt.»). Inhaltlich sind die drei Vorschläge in Ordnung: Sie sagen, was geschah und was zu tun ist.

### V-9 (Nit): Hinweis während des Sendens

- **Beleg:** `SendDialog.svelte:43` `busyLabel={m.ui_saving()}`.
- **Lösung:** Beim Senden per E-Mail «Wird gesendet …» anzeigen.

### M-1 (Minor): Beweis des Zugangs

- **Beleg:** Fedlex SR 210, Art. 8 ZGB: «Wo das Gesetz es nicht anders bestimmt, hat derjenige das Vorhandensein einer behaupteten Tatsache zu beweisen, der aus ihr Rechte ableitet.» Der Vermieter leitet aus der zugestellten Abrechnung die Nachzahlung und den Ablauf der Frist ab. Laut `statement-send.feature:31` nennt der Verlauf nur «Versendet».
- **Warum es fehlt:** Bei einem Streit über den Zugang muss der Vermieter zeigen können, was er wann an welche Adresse geschickt hat. Dass eine E-Mail mit der Annahme durch den Server als zugegangen gilt, ist im Gesetz nicht geregelt (siehe «Nicht bestätigt»).
- **Lösung:**
  - Das Dokument speichert das PDF genau so, wie es gesendet wurde. Ein später neu erstelltes PDF der Abrechnung (z. B. nach «Zahlung zurücksetzen», `statement.service.ts:508-509`) darf es nicht überschreiben.
  - Das Dokument speichert ausserdem Empfängeradresse und Zeitpunkt.
  - Der Verlauf lautet etwa «Versendet per E-Mail an nora@… am {Datum}».

### R-1 (Major): Staat des Mailversand-Anbieters fehlt

- **Beleg:** Fedlex SR 235.1, Art. 19 Abs. 4 DSG: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.» `privacy_third_1` nennt «Resend» ohne Staat. Der Transport `backend/src/mail/resend.ts:9` sendet an `https://api.resend.com`.
- **Warum es falsch ist:** Resend ist nach den verfügbaren Angaben ein US-Anbieter (Firmensitz nicht verifiziert, siehe «Nicht bestätigt»). Bisher gingen nur Mahnungen dorthin. Mit #86 geht jede Abrechnung eines E-Mail-Mieters dorthin, mit Adresse, Kosten, Saldo und IBAN. Die Änderung macht die Lücke also deutlich grösser. Sie zählt damit nicht als nur vorbestehend.
- **Lösung:** «… (eigener SMTP-Server oder Resend, USA; …)». Dazu die Garantie nach Art. 16 Abs. 2 bzw. die Ausnahme nach Art. 17, z. B. Standarddatenschutzklauseln nach Art. 16 Abs. 2 Bst. d DSG, falls Resend sie anbietet. Das ist mit der parallelen Session abzustimmen, die die Datenschutzseite neu schreibt.

### R-2 (Minor): Inhalt der Abrechnung unvollständig aufgezählt

- **Beleg:** Vorschlag «(bei einer Nebenkostenabrechnung die Kosten, der Saldo und die Zahlungsangaben)». Das PDF enthält ausserdem: Korrespondenzadresse, Wohnung, Mietverhältnis in der Periode mit Mietstagen (`pdf.service.ts:80`), Heizmaterialverbrauch, IBAN und QR-Referenz.
- **Warum es falsch ist:** Art. 19 Abs. 2 DSG verlangt eine «transparente Datenbearbeitung». Eine zu knappe Aufzählung verschweigt die Adress- und Mietdaten.
- **Lösung:** «… sowie der Inhalt der Nachricht mit dem PDF im Anhang übermittelt (bei einer Nebenkostenabrechnung Korrespondenzadresse, Wohnung und Mietdauer, die Kosten und ihre Verteilung, der Saldo sowie IBAN und Zahlungsreferenz; bei einer Mahnung der offene Betrag und die Zahlungsangaben).»

### R-3 (Minor, bestand schon vorher): «eigener SMTP-Server»

- **Beleg:** `backend/src/mail/smtp.ts:5` nennt als SMTP-Server ausdrücklich auch Anbieter wie «Infomaniak, Microsoft 365».
- **Warum es falsch ist:** Der Text verspricht einen eigenen Server. Möglicherweise ist es aber ein Dritter, je nach Anbieter auch im Ausland (Art. 19 Abs. 2 Bst. c und Abs. 4 DSG).
- **Lösung:** «über den SMTP-Server des Betreibers oder eines von ihm beauftragten Anbieters (dessen Name und Staat nennt der Betreiber) oder über Resend (USA)». Alternativ den Anbieter aus der Konfiguration einsetzen, wie es `privacy_llm_external` mit `{provider} ({country})` schon tut.

## Fehlende Begriffe

Keine. Dokument, Korrespondenzkanal, Versandstatus, Entwurf, Versendet und Zahlungsfrist decken den Vorschlag ab. Der Issue-Vorschlag unter V-5 ist ein Funktionsentscheid, kein neuer Begriff.

## Nicht bestätigt

- **Keine Formvorschrift für die Zustellung der Abrechnung.** Art. 257a, 257b und 257c OR sowie Art. 8 VMWG wurden auf Fedlex gelesen und enthalten keine Regel dazu. Ob ein Mietvertrag mit vereinbarter Schriftform E-Mail ausschliesst, ist nicht geprüft (**unsicher**). Gesucht wurde in `docs/nebenkostenabrechnung-anforderungen.md` (Zustellfrist Z. 44, «unsicher-C»).
- **Ab wann eine E-Mail als zugegangen gilt** (Eingang im Postfach oder Kenntnisnahme): Keine Fedlex-Norm gefunden (**unsicher**).
- **Verzug ohne Mahnung.** Fedlex OR Art. 102 Abs. 2: «Wurde für die Erfüllung ein bestimmter Verfalltag verabredet, … so kommt der Schuldner schon mit Ablauf dieses Tages in Verzug.» Eine einseitig gesetzte Zahlungsfrist ist wohl kein «verabredeter» Verfalltag. Das betrifft den Status «Überfällig» und Verzugsfolgen, nicht #86, und wurde nicht weiter geprüft (**unsicher**).
- **Sitz und Datenstandort von Resend sowie Garantien (DPF/SCC):** resend.com war aus der Umgebung nicht erreichbar (DNS-Fehler). Die Suchtreffer nennen nur «GDPR compliant» (resend.com/security).
- **Wer Mieter nach Art. 19 DSG informieren muss:** Für Mieterdaten ist der Vermieter der Verantwortliche, die Datenschutzerklärung von Dwello richtet sich an den Nutzer. Ob Dwello dem Vermieter einen Hinweistext für seine Mieter geben sollte, ist nicht Gegenstand von #86.
- **Ob der E2E-Stack einen «nicht eingerichteten» Mailversand erzeugen kann:** In `tests/e2e` wurde kein Schalter dafür gefunden (Suche nach `MAIL_TRANSPORT` und «nicht eingerichtet» ohne Treffer in den Features).
- **Gesetzestexte** wurden über den Fedlex-Filestore abgerufen (OR Stand 1.10.2026, VMWG 1.10.2025, DSG 7.7.2025, ZGB 1.7.2026). Die Fundstellen kamen über `fedlex.data.admin.ch/sparqlendpoint`, nicht über `mmx search`, weil die Suche nur Sekundärquellen lieferte.
