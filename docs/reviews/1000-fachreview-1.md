# Fachreview #1000, Runde 1 (Commit 449b572)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | fr/it Stufe 2 mit Teilzahlung: «Malgré notre rappel» / «Nonostante il nostro promemoria» (`backend/src/services/reminder-letter.ts:71`, `:99`). Der Text ohne Teilzahlung (`:66`, `:90`), der Brieftitel der Stufe 1 (`titles`) und `docs/design/i18n-begriffe.md:115` sagen «rappel de paiement» / «promemoria di pagamento». Der Fehler stammt schon aus der Vorlage in 959-fachreview-1.md:113. Im fr-Brief «2e rappel» kann «notre rappel» auch die Mahnung selbst meinen. Abhilfe: Text unten übernehmen und die zwei Testzeilen in `reminder-letter.test.ts` anpassen (die Wortwahl kommt aus dem Review, Triage nach Skill `slice-review`). |

Keine Blocker, keine Major.

## Wortlaut

| key | de | fr | it | en |
|-----|----|----|----|----|
| reminder-letter `partOpenings[0]` | Trotz unserer Zahlungserinnerung ist die ${s} noch nicht vollständig bezahlt. | Malgré notre rappel de paiement, le ${s} n’a toujours pas été entièrement réglé. | Nonostante il nostro promemoria di pagamento, il ${s} non risulta ancora interamente pagato. | Despite our payment reminder, the ${s} has still not been paid in full. |

(`partOpenings[1]` bleibt in allen vier Sprachen, wie es ist.)

## Nicht bestätigt

- Keine neue Rechtsfrage, darum kein neuer Fedlex-Abruf. Die Grundlage, dass nur der offene Betrag gefordert wird (Art. 85 Abs. 1 OR), stammt aus 959-fachreview-1.md:36 (Stand 1.10.2026). Für diese Änderung habe ich sie nicht neu abgerufen.

Geprüft: Die Texte in allen 4 Sprachen stimmen wörtlich mit 959-fachreview-1.md:113-114 überein (`reminder-letter.ts:42-45, 70-74, 98-102, 126-130`). Sie passen zu den Zeilen «Betrag der Abrechnung / Bereits bezahlt / Offener Betrag» und zur Fristzeile. Dass «der Betrag» in Stufe 3 den offenen Betrag meint, ist klar, weil die Zeile «Offener Betrag» direkt darunter steht. Begriffe nach UBIQUITOUS_LANGUAGE.md:186-187 (Teilzahlung, Offener Betrag) und i18n-begriffe.md:101/115. Die Auswahl in `reminder-letter.ts:162` (`paid` > 0 und Stufe > 1) nutzt dieselbe Bedingung wie die Betragszeilen. Rückerstattungen lässt `reminder.service.ts:67` nicht zu, eine bezahlte Abrechnung `:178`. Nach «Zahlung zurücksetzen» bis 0 gilt wieder der Text ohne Teilzahlung. Stufe 1 bleibt unverändert («noch offen» stimmt auch nach einer Teilzahlung). Der Ton der 2. und 3. Mahnung entspricht der Praxis. «Weitere Schritte einleiten» droht nichts Bestimmtes an, also nichts rechtlich Falsches (keine Kündigung nach Art. 257d OR, keine Betreibung, kein Verzugszins).
