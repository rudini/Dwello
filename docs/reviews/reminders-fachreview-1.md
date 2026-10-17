# Fachreview 1: Mahnungen mit Zahlungsfrist (#107, #193, #194)

Geprüft: Worktree `review-reminders-fach`, Commit b1b4025. Gegenstand: die zwei `@wip`-Szenarien am Ende von `tests/e2e/features/statement-reminder.feature`, ihre Steps (`tests/e2e/steps/documents.steps.ts:92-123`) und die vom Aufrufer beschriebene geplante Umsetzung und Texte. Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, Issues #107, #193, #194, #64, Code im Worktree, Fedlex (Art. 102 OR).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Blocker | Die Texte sagen «erst drucken und verschicken, dann markieren». Mit #193 wird der Brief erst beim Markieren neu erstellt. Der Mieter erhält also den alten Brief, und das abgelegte PDF und die gespeicherte Frist weichen vom verschickten Brief ab. Damit ist die «Done means» von #193 im beschriebenen Ablauf nicht erfüllt. |
| V-2 | Verwalter | Major | Eine Mahnung im Status «Zu versenden» gibt nach Ablauf ihrer vorläufigen Frist die nächste Mahnstufe frei. So entsteht eine «2. Mahnung … trotz unserer Zahlungserinnerung», obwohl die Zahlungserinnerung nie verschickt wurde. Braucht einen Entscheid. |
| V-3 | Verwalter | Major | Die Regel für die Übersicht («zählt nur, wenn die nächste Mahnung heute möglich ist») würfe überfällige Rückerstattungen und Abrechnungen mit drei Mahnungen aus der Aufgabe. |
| V-4 | Verwalter | Major | «Nächste Mahnung ab …» und «Nächste Mahnung möglich ab …» dürfen nach der 3. Mahnung nicht erscheinen. Der Plan schliesst das nicht aus. |
| V-5 | Verwalter | Minor | «Als versendet markieren» ändert jetzt Briefdatum und Zahlungsfrist, ohne dass eine Bestätigung diese Folge nennt. |
| V-6 | Verwalter | Minor | Für bestehende Mahnungen ist keine Rückfüllung der Frist geplant. Sie muss vom Schweizer Kalendertag der Erstellung ausgehen, nicht vom UTC-Datum. |
| V-7 | Verwalter | Minor | Die Zahl in der Übersicht und die verlinkte Liste «Überfällige ansehen» weichen voneinander ab. Die Regel von #64 (Mahnfrist vor der ersten Mahnung) muss darin Platz haben. |
| V-8 | Verwalter | Minor | Das Szenario prüft die Übersicht nicht, obwohl die «Done means» von #107 es für Übersicht und Liste verlangt. |
| V-9 | Verwalter | Minor | Begriffslücke: «Zahlungsfrist» an einer Mahnung ist im Glossar nicht definiert. Neben dem Status «Überfällig» wirkt sie widersprüchlich. |
| V-10 | Verwalter | Nit | Uneinheitliche Wörter: «Nächste Mahnung möglich ab» auf der Detailseite, «Nächste Mahnung ab» in der Liste. |
| V-11 | Verwalter | Nit | In einem Szenario steht ein Satz mit Nebensatz-Stellung zwischen Angenommen-Sätzen mit Hauptsatz-Stellung. |
| V-12 | Verwalter | Nit | Nach dem Neuerstellen zeigt die Zeile in «Dokumente» weiter «Erstellt am <Erstellungstag>». Der Mieter sieht im Brief ein anderes Datum. |

Mietrecht: Ich habe keinen Befund. Die Regel ist zulässig, siehe «Bestätigt».

---

## V-1 (Blocker): Reihenfolge «drucken, verschicken, dann markieren» verträgt sich nicht mit #193

**Belege**
- `messages/de.json:876` `documents_purpose`: «Drucken Sie Briefe, die noch zu versenden sind, schicken Sie sie per Post und markieren Sie sie dann als versendet.»
- Dieselbe Reihenfolge steht an vier weiteren Stellen:
  - `messages/de.json:235-236` `dashboard_task_letters_text_*`: «Drucken Sie sie aus, schicken Sie sie per Post und markieren Sie sie danach als versendet.»
  - `messages/de.json:446` `backend_mail_delivery_failed`: «Drucken Sie die Mahnung aus, schicken Sie sie per Post und markieren Sie sie danach unter «Dokumente» als versendet.»
  - `messages/de.json:83` `help_payments_4`: «… markieren Sie sie nach dem Versand als versendet.»
  - `messages/de.json:990` `statements_reminder_by_letter`: «Drucken Sie den Brief aus und schicken Sie ihn per Post.»
- `src/routes/documents/DocumentItem.svelte:66-74`: «PDF herunterladen» steht für einen Brief im Status «Zu versenden» schon vor dem Markieren bereit. Das PDF trägt dann noch Datum und Frist des Erstellungstags (`reminder.service.ts:85-98`).
- #193, «Done means»: «A reminder posted later than its creation day still gives the tenant the full 10 days from the letter date the tenant sees.»
- #193, Entscheid: «remade … when it is marked as sent (and the PDF offered for printing then carries that date)».

**Warum falsch**

Der Entscheid setzt voraus, dass gedruckt wird, nachdem markiert wurde. Die Texte verlangen das Gegenteil. Ein Beispiel:

| Schritt | Datum | Folge |
|---------|-------|-------|
| Mahnung erstellt | 15.10. | Frist 25.10. |
| Brief gedruckt und verschickt | 22.10. | Der Brief nennt «bis 25.10.»: 3 Tage ab Versand statt 10 |
| Danach markiert | 22.10. | Dwello erstellt das PDF neu (Datum 22.10., Frist 01.11.) und speichert Frist 01.11. |

Die Folgen:
1. Der Mieter hat nicht die vollen 10 Tage. Die «Done means» ist verfehlt.
2. Das abgelegte PDF ist nicht der Brief, den der Mieter erhielt. Als Beleg der Mahnung, etwa für eine Betreibung oder die Schlichtungsbehörde, stimmt es dann nicht.
3. Die nächste Mahnstufe richtet sich nach einer Frist, die der Mieter nie gesehen hat.

**Behebung ohne den Entscheid zu übergehen**

Der Entscheid sieht ausdrücklich vor, dass nach dem Markieren das neu erstellte PDF zum Drucken angeboten wird. Also:

1. Reihenfolge umkehren, in allen fünf Texten und allen vier Sprachen. Vorschlag für `documents_purpose`: «Mahnungen und andere Schreiben an Mieter sowie Dokumente, die Sie zu Mietern hochgeladen haben. Markieren Sie einen Brief am Tag, an dem Sie ihn zur Post bringen, als versendet: Dwello setzt dann das heutige Datum und eine neue Zahlungsfrist ein. Drucken Sie den Brief danach aus und schicken Sie ihn noch am selben Tag.» Die anderen Texte sinngemäss gleich, etwa `backend_mail_delivery_failed`: «… Markieren Sie die Mahnung unter «Dokumente» als versendet, drucken Sie sie danach aus und schicken Sie sie am selben Tag per Post. …».
2. Nach dem Markieren bietet die Zeile oder die Erfolgsmeldung direkt «PDF herunterladen» mit dem neuen PDF an.
3. Optional, mit Rückfrage beim Product Owner, weil es über den Entscheid hinausgeht: Für einen Brief im Status «Zu versenden» das PDF beim Herunterladen mit dem heutigen Datum erzeugen. Bei Abrechnungsentwürfen macht Dwello das schon so (`statement-pdf.service.ts:273` `datedToday`; Hinweis `statements_send_text_2`: «Dwello datiert die Abrechnung auf den Tag, an dem Sie sie als versendet markieren. Stellen Sie das PDF deshalb am selben Tag zu.»). Dann stimmen auch «am selben Tag drucken, dann markieren» und der Brief überein.

Ein Hinweis «am selben Tag» zusätzlich zur Neuerstellung ist kein «noch heute»-Hinweis *statt* der Neuerstellung. Der Entscheid schliesst ihn nicht aus.

## V-2 (Major): Mahnung im Status «Zu versenden» gibt die nächste Mahnstufe frei

**Belege**
- `backend/src/services/document.service.ts:131-137` `countReminders` zählt jede Mahnung, auch eine im Status «Zu versenden».
- `reminder-letter.ts:37`, Text der 2. Mahnung: «Trotz unserer Zahlungserinnerung ist die … noch nicht bezahlt.»
- #193: «The deadline stored per reminder follows the remade letter.» Die vor dem Versand gespeicherte Frist ist also nur vorläufig.

**Warum falsch**

Ein Beispiel: Zahlungserinnerung erstellt am 15.10. (Frist 25.10.), nicht verschickt. Ab 26.10. lässt Dwello die 2. Mahnung zu. Wird die Zahlungserinnerung erst am 27.10. markiert, hat sie die Frist 06.11., und die 2. Mahnung mit dem Satz «Trotz unserer Zahlungserinnerung …» existiert schon. Die Mahnstufen stehen dann in falscher Reihenfolge, und die 2. Mahnung behauptet etwas Falsches. Ein Verwalter verschickt die nächste Stufe nie vor der vorigen.

Ausserdem zeigt die geplante Zeile «Nächste Mahnung möglich ab <Datum>» bei einem Brief im Status «Zu versenden» ein Datum, das sich beim Markieren noch verschiebt.

**Behebung (braucht einen Entscheid; Issue mit Labels `fachlich`, `entscheiden`)**

Vorschlag: Die nächste Mahnstufe ist erst möglich, wenn die vorige Mahnung versendet ist *und* ihre Frist abgelaufen ist.
- Solange die vorige im Status «Zu versenden» ist: eigener Code, z.B. `REMINDER_PREVIOUS_NOT_SENT`, mit dem Text «Versenden Sie zuerst die {title}: Sie liegt unter «Dokumente» zum Versand bereit.»
- Statt eines Datums zeigt die Zahlungsbox «Nächste Mahnung möglich: nach dem Versand der {title}».

## V-3 (Major): Die Übersicht würde Rückerstattungen und Abrechnungen mit drei Mahnungen verlieren

**Belege**
- Geplant: «counts only overdue statements whose next Mahnung is possible today».
- `messages/de.json:231-232`: Die Aufgabe deckt ausdrücklich Rückerstattungen ab («Bei einer Rückerstattung überweisen Sie den Betrag …»).
- `reminder.service.ts:51-53`: Eine Rückerstattung wird nie gemahnt, und nach der 3. Mahnung gibt es keine weitere.

**Warum falsch**

Nimmt man die Regel wörtlich, ist bei einer Rückerstattung und nach der 3. Mahnung nie eine nächste Mahnung «möglich». Beide verschwinden aus der Aufgabe «Überfällige Abrechnungen prüfen», obwohl der Vermieter gerade dann handeln muss: zurückerstatten, oder nach der 3. Mahnung weitere Schritte prüfen.

**Behebung**

Die Regel als Ausnahme formulieren und so umsetzen: gezählt wird jede überfällige Abrechnung, *ausser* die Frist ihrer letzten Mahnung läuft noch (letzte Frist ≥ heute). In diesem Sinn steht es auch in der Klammer des Plans. pg-Test oder Unit-Test mit drei Fällen: Rückerstattung, 3. Mahnung mit abgelaufener Frist, Frist läuft.

## V-4 (Major): «Nächste Mahnung ab» nach der 3. Mahnung

**Belege**
- Geplant für die Liste: «under «Gemahnt am <date>» the line «Nächste Mahnung ab <date>» while that date lies ahead».
- `reminder.service.ts:53`: nach Stufe 3 gilt `REMINDER_LIMIT`.

**Warum falsch**

Nach der 3. Mahnung kündigt die Zeile eine Mahnung an, die Dwello dann mit «Es wurden bereits 3 Mahnungen versendet.» ablehnt. Für den unerfahrenen Vermieter ist das eine falsche Anleitung.

**Behebung**

Liste und Detailseite zeigen die Zeile nur, wenn die Mahnstufe kleiner als 3 ist und der Saldo eine Nachzahlung ist. Ein Test für den Fall nach der 3. Mahnung.

## V-5 (Minor): Markieren ohne Bestätigung der neuen Folge

**Beleg**: `src/routes/documents/MarkSentButton.svelte:13-33` sendet direkt ab. Die Design-Regel in `CLAUDE.md` verlangt: «Irreversible actions confirm with their real consequence.»

**Warum**: Mit #193 überschreibt das Markieren das PDF, setzt eine neue Zahlungsfrist und das Datum «Letzte Mahnung». Rückgängig machen lässt sich das nicht.

**Behebung**: Eine Bestätigung bei Mahnungen, z.B. «Mahnung als versendet markieren? Dwello datiert den Brief auf heute und setzt die Zahlungsfrist auf den {deadline}. Drucken Sie den Brief danach aus und schicken Sie ihn heute.» Das passt zu V-1.

## V-6 (Minor): Frist für bestehende Mahnungen

**Beleg**: `documents.created_at` ist ein Zeitstempel (`schema.ts:494`). Die gedruckte Frist war `daysAfter(swissToday(), 10)` (`reminder.service.ts:85-90`).

**Warum**: Bestehende Mahnungen haben keine gespeicherte Frist. Ohne Rückfüllung fehlt «Zahlungsfrist <Datum>» in der Zeile, und die Sperre greift nicht. Eine Rückfüllung aus dem UTC-Datum liegt bei Mahnungen, die zwischen 00:00 und 01:00/02:00 Schweizer Zeit erstellt wurden, einen Tag daneben.

**Behebung**: In der Migration `payment_deadline = (created_at AT TIME ZONE 'Europe/Zurich')::date + 10` für `type = 'reminder'`, mit pg-Test.

## V-7 (Minor): Zahl und Liste der Aufgabe weichen ab; Verträglichkeit mit #64

**Belege**: `src/lib/overview.ts:98-110`. Der Text lautet «{count} Nebenkostenabrechnungen sind über der Zahlungsfrist», die Aktion «Überfällige ansehen» führt auf `/statements?status=overdue`. Dort erscheinen auch die Abrechnungen, deren Mahnfrist noch läuft. Laut #64 (entschieden, Option B) soll die Aufgabe erst nach «Zahlungsfrist + `reminder_after_days`» erscheinen. Das ist noch offen (`TODO(fachlich prüfen, #64)` in `overview.ts:102`).

**Warum**: Die Übersicht meldet z.B. «1 Abrechnung», die Liste zeigt 2. Wird #64 später umgesetzt, braucht die Zählregel beide Bedingungen: vor der ersten Mahnung Zahlungsfrist + Mahnfrist, danach die Frist der letzten Mahnung ohne Mahnfrist (#107: «the Mahnfrist plays no part for the next Mahnstufe (it decides only when the overview first proposes a Mahnung, #64)»).

**Behebung**: Die Zählregel als eine Funktion bauen, in die #64 die Mahnfrist einsetzen kann. Den Text anpassen, etwa «{count} Nebenkostenabrechnung ist zu prüfen …», oder die Liste im Link gleich filtern. Den Marker #64 stehen lassen, das Issue nicht schliessen.

## V-8 (Minor): Das Szenario prüft die Übersicht nicht

**Beleg**: #107, «Done means»: «The overview and the statement list do not propose a Mahnung before that date; scenario in `tests/e2e/features/statement-reminder.feature`.» Das Szenario `statement-reminder.feature:39-48` prüft die Detailseite und die Liste, aber nicht die Übersicht.

**Behebung**: Einen Schritt ergänzen, z.B. «Und schlägt die Übersicht keine Mahnung vor». Der Stand mit einer Rückerstattung oder Abrechnung ohne Mahnung (V-3) gehört in einen Unit-Test von `overview.ts`.

## V-9 (Minor): Begriff «Zahlungsfrist» an der Mahnung

**Belege**
- `UBIQUITOUS_LANGUAGE.md:181`: «**Zahlungsfrist**: Datum, bis zu dem die Abrechnung bezahlt sein muss.» (Feld `payment_deadline` der Abrechnung)
- `UBIQUITOUS_LANGUAGE.md:172`: «**Überfällig**: Versendet und Zahlungsfrist überschritten.»
- Geplant: Mahnungszeile «Zahlungsfrist <Datum>», Status bleibt «Überfällig».

**Warum**: Auf der Detailseite steht dann «Überfällig» neben «Zahlungsfrist 26.10.2026», einem Datum in der Zukunft. Nach dem Glossar ist das ein Widerspruch. Die Frist der Mahnung ist eine zweite Bedeutung des Worts, die das Glossar nicht kennt. Fachlich ist es richtig, dass der Status «Überfällig» bleibt: Die Zahlungsfrist der Abrechnung bleibt überschritten.

**Vorschlag (Issue mit Labels `fachlich`, `entscheiden`)**: Glossar-Eintrag «**Zahlungsfrist einer Mahnung**: Datum, bis zu dem der Mieter nach einer Mahnung bezahlen soll; 10 Tage ab dem Datum des Briefs. Die Zahlungsfrist der Abrechnung bleibt unverändert, die Abrechnung bleibt «Überfällig». Die nächste Mahnstufe ist ab dem Tag danach möglich. (`documents.payment_deadline`)» Bis zum Entscheid an den Zeilen `TODO(fachlich prüfen, #<issue>)`. Der Text `REMINDER_TOO_EARLY` («Die Zahlungsfrist der letzten Mahnung läuft bis …») passt schon zu diesem Begriff.

## V-10 (Nit): «möglich ab» oder «ab»

Detailseite «Nächste Mahnung möglich ab», Liste «Nächste Mahnung ab»: Für dieselbe Aussage überall dieselben Wörter verwenden. Ich empfehle «Nächste Mahnung möglich ab» auch in der Liste und dann auch im Step `documents.steps.ts:113`.

## V-11 (Nit): Satzstellung im Szenario

`statement-reminder.feature:55`: «Und der Liegenschaftsverwalter eine Mahnung sendet» steht zwischen Angenommen-Sätzen in Hauptsatz-Stellung («Und der Liegenschaftsverwalter ist …»). Vorschlag: «Und der Liegenschaftsverwalter hat eine Mahnung gesendet» als eigener Given-Step, oder den Satz als «Wenn» vor den Wechsel zu «Dokumente» stellen. Der Titel nach #194 gehört laut «Done means» nach `documents.feature`. In `statement-reminder.feature` ist er aber auch vertretbar.

## V-12 (Nit): «Erstellt am» nach dem Neuerstellen

`DocumentItem.svelte:23-31` zeigt `createdAt`. Nach #193 trägt der Brief das Datum des Markierens. Wer den Brief des Mieters mit der Zeile vergleicht, findet zwei Daten. Vorschlag: Bei versendeten Briefen «Versendet am <sentAt>» zeigen, oder neben der Zahlungsfrist das Briefdatum.

---

## Bestätigt

- **Fristrechnung** (Brief am Tag T, Frist T+10, nächste Mahnung ab T+11, dieselbe Regel wie `paymentDeadline < today` in `statement.service.ts:76,178-180`):
  - 16.10.2026: Frist 26.10.2026, ab 27.10.2026 möglich (am 27.10. gilt 26.10. < 27.10.).
  - Monatsende 25.10.2026: Frist 04.11.2026, ab 05.11.2026.
  - Jahreswechsel 25.12.2026: Frist 04.01.2027, ab 05.01.2027.
  - #193, erstellt 15.10., markiert 22.10.: Frist 01.11., ab 02.11.
  - Szenario: «Zahlungsfrist in 10 Tagen» und «ab dem Tag in 11 Tagen» stimmen damit überein. `inDays` rechnet mit Schweizer Kalendertagen (`tests/e2e/fixtures/dates.ts`).
- **Rechtslage**: Das Gesetz verlangt für eine Mahnung keine Mindestfrist und keine Frist zwischen den Mahnstufen. Art. 102 Abs. 1 OR (Fedlex, SR 220): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Die Sperre bis nach Ablauf der Frist und 10 Tage pro Stufe sind Praxis und kein Rechtszwang. Sie sind zulässig und mieterfreundlich. Dass der Status während der Frist «Überfällig» bleibt, ist weder rechtlich noch nach Glossar falsch, da die Zahlungsfrist der Abrechnung überschritten ist.
- **Begriffe**: «Mahnung» als Oberbegriff, der die Zahlungserinnerung einschliesst (`UBIQUITOUS_LANGUAGE.md:182-183`), passt zu «Nächste Mahnung» und «der letzten Mahnung». Dass die Mahnfrist (`:184`) für die nächste Stufe keine Rolle spielt, entspricht #107. Die Pläne verwenden «Mahnfrist» nirgends, das ist richtig. «Brief» und «Versendet» stimmen mit Versandstatus und Korrespondenzweg überein.
- **#194**: Der Kanal «Brief» beim Markieren eines Briefs nach gescheiterter E-Mail entspricht dem Entscheid. Das Szenario `statement-reminder.feature:50-58` mit dem Step `documents.steps.ts:118-123` (`/per Brief.*Versendet/`) prüft genau das.
- **REMINDER_TOO_EARLY**, «Die nächste Mahnung ist erst ab {date} möglich: Die Zahlungsfrist der letzten Mahnung läuft bis {deadline}.»: Der Text sagt, was geschah und ab wann es geht. Schweizer Schreibweise, Grossschreibung nach dem Doppelpunkt korrekt (ganzer Satz). Passt.
- **«No scenario» für #193 und die erlaubte 2. Mahnung**: Der Grund hält. Die Seeds gehen über die API (`tests/e2e/fixtures/backend.ts:205-228`), und keine API setzt die Frist einer Mahnung oder ihr Erstellungsdatum.

## Nicht bestätigt

- **Art. 102 Abs. 2 OR**: Den vollen Wortlaut und die Frage, ob eine einseitig gesetzte Zahlungsfrist der Abrechnung ein «Verfalltag» ist, konnte ich nicht klären. Fedlex lädt ohne JavaScript nicht (WebFetch auf `fedlex.admin.ch/eli/cc/27/317_321_377/de` leer). Der Suchtreffer mit Fedlex-Snippet zeigt nur «Wurde für die Erfüllung ein bestimmter Verfalltag verabredet, oder ergibt …». **unsicher**. Für die geprüften Regeln spielt das keine Rolle.
- **Ob eine Mahnung erst mit dem Empfang wirkt**, und damit, ob 10 Tage ab Briefdatum bei B-Post genügen: nicht auf Fedlex belegt, **unsicher**. Praxis: 10 Tage pro Stufe sind üblich. Eine Quelle dafür habe ich nicht nachgeschlagen.
- **Art. 257d OR** (Zahlungsrückstand, Frist mindestens 30 Tage mit Kündigungsandrohung): Die 3. Mahnung droht nur «weitere Schritte» an und ist keine Kündigungsandrohung. Nicht Teil dieses Gegenstands, siehe #59 laut `docs/reviews/issue-126-fachreview-2.md`. Nicht auf Fedlex nachgelesen.
- **Texte fr/it/en**: Sie lagen nicht vor und sind nicht geprüft.
- **Umsetzung von «Letzte Mahnung = heute» beim Markieren**: Der Plan nennt sie. Wie die Liste («Gemahnt am») reagiert, wenn eine noch nicht markierte Mahnung existiert, habe ich nur am Code der Basis gesehen (`reminder.service.ts:111` setzt schon beim Erstellen). Eine Prüfung am fertigen Code steht aus.
