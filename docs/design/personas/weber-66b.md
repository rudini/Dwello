# Dr. Weber – Runde 66b: Hinweise «Kein Akonto» und «Laufender Mietvertrag»

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300, Deutsch, frische Demodaten. Gespeichert nur im Gebäude Alpenblick (Mietvertrag Laura Keller, Wohnung EG). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/persona-weber/weber-66b/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag, Schritt 4 «Miete», Hinweis «Kein Akonto» | Reihenfolge der Sätze führt zuerst zur falschen Handlung: «Sonst entfernen Sie … alle Häkchen» steht vor der Ausnahme «Sind Nebenkosten ohne Akonto vereinbart, bezahlt der Mieter sie ganz mit der Nebenkostenabrechnung». Wer der ersten Anweisung folgt, obwohl im Vertrag Nebenkosten ohne Akonto vereinbart sind, nimmt sich den Anspruch auf die Abrechnung in Dwello. |
| P-2 | Nit | Schritt 4 «Miete», Hinweis «Kein Akonto» | Bei einer Nebenkostenpauschale sagt der Hinweis richtig, dass alle Häkchen weg müssen, aber nicht, wo die Pauschale selbst hingehört. Sie fehlt dann in «Monatlich total». |
| P-3 | Minor | Mietvertrag bearbeiten (befristet), Hinweis «Laufender Mietvertrag» | «Mietzinserhöhung erst nach dem Vertragsende möglich» ist schief: Nach dem Vertragsende gibt es entweder einen neuen Mietvertrag (neuer Anfangsmietzins, Art. 270 OR) oder der Vertrag läuft stillschweigend weiter und gilt dann als unbefristet (Art. 266 Abs. 2 OR); dann gilt wieder Art. 269d OR mit Kündigungstermin und 10-Tage-Frist. Das sagt der Text nicht. |
| P-4 | Minor | Mietvertrag bearbeiten (befristet), Hinweis «Laufender Mietvertrag» | «ausser der Mietvertrag sieht sie vor» ist für Laien zu offen: Gemeint sind gestaffelte Mietzinse (Art. 269c OR) und indexierte Mietzinse (Art. 269b OR, nur bei mindestens fünf Jahren fest). Für diese Fälle fehlt jede Angabe zur Frist der Mitteilung; der Satz zur 10-Tage-Frist aus dem unbefristeten Hinweis fällt einfach weg. |
| P-5 | Minor | Mietvertrag bearbeiten, Hinweis «Laufender Mietvertrag» | Der Hinweis folgt dem gespeicherten Stand, nicht der Auswahl im Formular: Nach dem Wechsel auf «Befristet» (noch nicht gespeichert) stand oben weiter die Regel für unbefristete Verträge («frühestens auf den nächsten Kündigungstermin …»). Wer im selben Zug befristet und Miete ändert, liest die falsche Regel. |
| P-6 | Nit | Mietvertrag bearbeiten, Hinweis «Laufender Mietvertrag» (beide Fassungen) | Unter den Nichtigkeitsgründen fehlt die Erhöhung mit Kündigungsandrohung (Art. 269d Abs. 2 lit. c OR). «Ohne Formular oder Begründung ist sie nichtig» ist richtig, aber nicht vollständig. |

## Beobachtungen

- Schritt 4 des Assistenten hat keinen Knopf «Abbrechen» (nur in Schritt 1). Ich habe über die Brotkrümelnavigation «Mietverträge» verlassen; es kam keine Rückfrage. Der Entwurf bleibt laut Hinweis im Browser gespeichert («Noch nicht gespeichert: Dwello bewahrt Ihre Angaben nur in diesem Browser auf»).
- Der Hinweis «Kein Akonto» erscheint bei leerem Feld und bei 0, und verschwindet bei 180. Das ist folgerichtig.
- Inhaltlich ist «Kein Akonto» rechtlich in Ordnung: Nebenkosten schuldet der Mieter nur, wenn sie besonders vereinbart sind (Art. 257a Abs. 2 OR); eine Pauschale wird nicht abgerechnet (Art. 4 VMWG), also richtig, dass Dwello dann nichts abrechnen darf. Nebenkosten ohne Akonto, ganz über die Abrechnung, sind zulässig.
- Die unbefristete Fassung von «Laufender Mietvertrag» (vor dem Speichern gelesen) ist korrekt: nächster Kündigungstermin, amtliches Formular, Begründung, 10 Tage vor Beginn der Kündigungsfrist (Art. 269d OR).
- Auf derselben Seite sagen die Hilfetexte zu «Verwaltungspauschale» und «Vereinbarte Nebenkosten» bei einem befristeten Vertrag weiter «frühestens ab dem nächstmöglichen Kündigungstermin». Bei einem fest befristeten Vertrag gibt es keinen ordentlichen Kündigungstermin; das widerspricht dem neuen Hinweis oben.
- Dwello speicherte die Umwandlung eines seit 2022 laufenden unbefristeten Mietvertrags in einen befristeten ohne jede Rückfrage. Eine Befristung nachträglich geht nur als Vertragsänderung mit der Mieterin; ein Satz dazu fehlt.
- Nach dem Speichern als befristet fehlt auf der Vertragsseite der Knopf «Beenden». Vorzeitige Beendigung (Zahlungsverzug Art. 257d, Ersatzmieter Art. 264, wichtige Gründe Art. 266g OR) gibt es auch bei befristeten Verträgen; das Formular verweist dafür auf das Ändern des Vertragsendes, was funktioniert, aber die Kündigungsschritte nicht nennt.
- «Bei einem Mieterwechsel erfassen Sie einen neuen Mietvertrag, frühestens ab 01.01.2100» wirkt bei einem Enddatum 2099 merkwürdig, ist aber logisch.

## Aufgabe geschafft: ja

## Aufwand

Rund 15 Minuten, 9 Schritte (Assistent 4 Schritte, Abbruch, Vertrag öffnen, bearbeiten, befristen und speichern, erneut öffnen).

## Ablauf

1. **Neuer Mietvertrag öffnen** (Übersicht, «Mietvertrag erfassen»). Erwartet: Assistent. Gesehen: 5 Schritte Mieter, Wohnung, Vertragsdauer, Miete, Prüfen.
2. **Mieter Kevin Fischer**, Weiter. Erwartet: Wohnungswahl. Gesehen: Wohnungswahl plus Hinweis, dass Kevin Fischer schon einen unbefristeten Vertrag für OG1 hat. Gut.
3. **Wohnung B1 (Seepark Residenz)**, Weiter. Erwartet: Datum. Gesehen: Vertragsbeginn und Vertragsdauer Unbefristet/Befristet.
4. **Vertragsbeginn 01.04.2027**, Weiter. Erwartet: Miete-Felder. Gesehen: Nettomiete, Akonto (optional), darunter blauer Infokasten «Kein Akonto» (Screenshot 06: Kasten mit Info-Symbol direkt unter dem leeren Akonto-Feld).
5. **Akonto 180 / 0 / leer** getestet. Erwartet: Hinweis nur ohne Akonto. Gesehen: so.
6. **Abbrechen.** Erwartet: Knopf «Abbrechen». Gesehen: keiner in Schritt 4; über Brotkrümel «Mietverträge» verlassen, ohne Rückfrage, nichts gespeichert.
7. **Mietvertrag Laura Keller** öffnen, «Bearbeiten». Gesehen: gelber Warnkasten «Laufender Mietvertrag» mit der Regel für unbefristete Verträge.
8. **Befristet, Vertragsende 31.12.2099**. Erwartet: Hinweis oben passt sich an. Gesehen: Er bleibt bei der unbefristeten Regel (P-5). Unter dem Datum erscheint «Hat der Mieter gekündigt? … mit «Beenden»» – sinnvoll.
9. **Änderungen speichern.** Erwartet: Rückfrage oder Bestätigung. Gesehen: direkt zur Vertragsseite, «Vertragsende: Befristet bis 31.12.2099», Knopf «Beenden» verschwunden.
10. **Erneut bearbeiten.** Gesehen (Screenshot 14: gelber Kasten mit Warndreieck oben): «Dwello übernimmt Änderungen sofort, auch für die Zeit, die noch nicht abgerechnet ist. Bei einem befristeten Mietvertrag ist eine Mietzinserhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig. Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.»

## Verwirrung

- «Sonst» in «Kein Akonto»: Worauf bezieht es sich? Auf «kein Akonto im Vertrag» – dann wäre die Anweisung für den dritten Fall falsch, der erst im letzten Satz kommt.
- «nach dem Vertragsende»: Ein beendeter Vertrag kann keine Erhöhung mehr haben. Gemeint ist wohl ein Folgevertrag oder die stillschweigende Fortsetzung.
- «sieht sie vor»: Reicht ein allgemeiner Vorbehalt «Mietzinsanpassungen bleiben vorbehalten»? Der Text lässt das offen.
- «Laufender Mietvertrag» als Überschrift für einen Hinweis, der vor allem von Mietzinserhöhungen handelt.

## Fehlerrisiken

- P-1: Vermieter mit Nebenkosten ohne Akonto entfernt alle Häkchen; Dwello rechnet nichts ab, der Ausfall fällt erst Monate später auf.
- P-3: Vermieter erhöht nach Ablauf bei stillschweigender Fortsetzung ohne Formular oder ohne Frist; die Erhöhung ist nichtig.
- P-4: Vermieter hält einen allgemeinen Vorbehalt für ausreichend oder verpasst die Mitteilungsfrist bei Staffel- oder Indexmiete.
- P-5: Wer gleichzeitig befristet und die Miete anpasst, folgt der Regel für unbefristete Verträge.

## Vorschläge

- **P-1:** Reproduktion: Neuer Mietvertrag, beliebiger Mieter und Wohnung, Beginn 01.04.2027, Schritt «Miete», Akonto leer lassen. Hilfe: drei Fälle als Liste in der Reihenfolge des Vertrags: «Akonto im Vertrag: eintragen. Nebenkosten ohne Akonto vereinbart: Feld leer lassen, Häkchen lassen; der Mieter bezahlt alles mit der Abrechnung. Pauschale oder keine Nebenkosten vereinbart: alle Häkchen entfernen.»
- **P-2:** Wie P-1. Hilfe: ein Halbsatz, wo die Pauschale erfasst wird (oder dass Dwello sie nicht führt).
- **P-3:** Mietvertrag Laura Keller bearbeiten, Befristet bis 31.12.2099, speichern, erneut bearbeiten. Hilfe: «Während der festen Dauer ist eine Erhöhung nur möglich, wenn der Mietvertrag sie vorsieht. Läuft der Vertrag nach dem Vertragsende stillschweigend weiter, gilt er als unbefristet; dann gelten die Regeln für unbefristete Mietverträge.»
- **P-4:** Wie P-3. Hilfe: «… sieht sie vor, etwa mit gestaffelten oder indexierten Mietzinsen», und die Mitteilungsfrist nennen oder auf die Hilfe verweisen.
- **P-5:** Mietvertrag Laura Keller (unbefristet) bearbeiten, «Befristet» wählen, nicht speichern, oben lesen. Hilfe: Hinweis nach der Auswahl im Formular richten, oder sagen, dass er für den gespeicherten Stand gilt.
- **P-6:** Wie P-3. Hilfe: «… sonst oder mit Androhung einer Kündigung ist sie nichtig.»

## Nicht geprüft

- Schritt 5 «Prüfen» des Assistenten: Die Aufgabe verlangte Abbruch in «Miete».
- Andere Sprachen (fr/it/en): die Sprache hängt am Konto, Lauf auf Deutsch.
- Ob die Hinweise in einer Nebenkostenabrechnung oder einem PDF wieder auftauchen.
- Den Vertrag Laura Keller habe ich nicht auf unbefristet zurückgesetzt; die Datenbank wird je Lauf neu erstellt.
