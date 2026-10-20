# Dr. Weber, Runde 447: Verwaltungspauschale und Saldo

Desktop 1440 × 900, Maus, Persona-Stack mit Demodaten (http://localhost:3300). Ich habe nur gelesen und nichts gespeichert: Der Mietvertrag kam bis «Prüfen», «Mietvertrag speichern» habe ich nicht gedrückt. Den Dialog «Abrechnung berichtigen» habe ich mit «Abbrechen» geschlossen; dabei ging keine schreibende Anfrage hinaus (im Netzwerk mitgeprüft).

Meine Massstäbe:
- Art. 257a Abs. 2 OR: Nebenkosten muss der Mieter nur bezahlen, wenn er das mit dem Vermieter besonders vereinbart hat.
- Art. 4 Abs. 3 VMWG: Die Kosten der Verwaltung darf der Vermieter nach Aufwand oder im Rahmen der üblichen Ansätze anrechnen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag erfassen, Schritt «Miete», «Eigener Satz in %» | Gebe ich 11 ein, sagt die Meldung nur «0,01 bis 10». Sie sagt nicht, warum Dwello bei 10 % aufhört, und nicht, was ich tun soll, wenn im unterschriebenen Mietvertrag mehr steht. Das Feld hat auch vorher keinen Hilfetext (üblich bis 3 %, höchstens 10 %); nur die Einstellungen nennen die Obergrenze. |
| P-2 | Minor | Hilfe, «Saldo» | Der Text erklärt, wie Dwello bei einer berichtigten Abrechnung rechnet. Er erklärt aber nicht, was eine berichtigte Abrechnung ist. Die Hilfe hat keinen Begriff «Berichtigte Abrechnung». Im Abschnitt «Nebenkostenabrechnungen erstellen» steht nur «falsche Kosten korrigieren Sie, indem Sie die Abrechnungen neu erstellen»; das gilt für Entwürfe. Eine versendete Abrechnung zu berichtigen, kommt in der Hilfe nicht vor. |
| P-3 | Minor | Einstellungen, Hilfe bei «Verwaltungspauschale in %» | Hier fehlt der Satz, dass ein eigener Satz im Mietvertrag Vorrang hat. Die Hilfe sagt es: «ausser der Mietvertrag nennt einen eigenen». In den Einstellungen klingt «Vorschlag … für jeden Lauf anpassbar» so, als gälte der Satz für alle Mieter mit vereinbarter Pauschale. |
| P-4 | Nit | Hilfe gegenüber Einstellungen | Der Gegenstand der Pauschale heisst einmal «Aufwand für die Nebenkostenabrechnung» (Hilfe) und einmal «Aufwand für die Nebenkosten» (Einstellungen). Art. 4 Abs. 3 VMWG spricht von der Verwaltung; das ist mehr als das Erstellen der Abrechnung. Die Einstellungen liegen näher am Gesetz. |
| P-5 | Nit | Schritt «Miete» und «Prüfen» | Die Fehlermeldung nennt als Beispiel «2,5» mit Komma, «Prüfen» zeigt «Vereinbart, 2.5 %» mit Punkt. Beides wird angenommen (ich habe 2,5 und 2.5 eingegeben), aber die Schreibweise ist nicht einheitlich. |
| P-6 | Minor | Einstellungen, «Protokoll» | Laut Leerzustand verzeichnet das Protokoll «Änderungen der vorgeschlagenen Verwaltungspauschale». Den eigenen Satz eines Mietvertrags und den Satz, der bei einem Abrechnungslauf gewählt wurde, nennt es nicht. Gerade diese Sätze bestimmen den Betrag auf der Abrechnung. Für eine Prüfung im Streitfall ist ein Protokoll nur des Vorschlags wenig wert. |

## Beobachtungen

- **Inhaltlich stimmen die Texte überein.** Hilfe, Einstellungen und Schritt «Miete» sagen dasselbe:
  - ein Prozentsatz der eigenen Nebenkosten des Mieters;
  - nur, wenn im Mietvertrag vereinbart;
  - üblich bis 3 %, ein höherer Satz muss dem tatsächlichen Aufwand entsprechen.

  Die Abrechnung NK-11111111-2025-0001 (Hans Müller) zeigt «Verwaltungspauschale 3 % der Zwischensumme CHF 90.17». Das passt: 3 % von CHF 3'005.65 sind CHF 90.17.
- **Art. 4 Abs. 3 VMWG** ist sinngemäss richtig wiedergegeben. «Üblicher Ansatz» und «tatsächlicher Aufwand» sind die zwei Wege, die die Verordnung offenlässt. «Üblich sind bis 3 %» ist eine eher vorsichtige Angabe zur Praxis; in der Literatur und an Schlichtungsstellen liest man auch 3 bis 5 %. Für einen Vermieter ist das vorsichtige Mass die sichere Seite. Dass die VMWG selbst keine Prozentgrenze nennt, sagt der Text richtig nicht.
- **Art. 257a Abs. 2 OR** wird nirgends als Artikel genannt. Er ist aber inhaltlich richtig umgesetzt:
  - «Nur zulässig, wenn im Mietvertrag vereinbart»;
  - im Assistenten «Wählen Sie, was im unterschriebenen Mietvertrag steht … Steht nichts dazu, wählen Sie «Nein»»;
  - bei «Umlagefähig»: «jede dieser Kostenarten einzeln».

  Dass eine Vereinbarung «Verwaltungskosten werden verrechnet» ohne Prozentsatz genügt und der Satz sich dann nach VMWG richtet, ist vertretbar. Der Assistent bildet genau das mit «Ja, zum Satz des Abrechnungslaufs» ab.
- **Art. 269d OR** im Schritt «Miete» stimmt: amtliches Formular, Begründung, zehn Tage vor Beginn der Kündigungsfrist, frühestens auf den nächsten Kündigungstermin. Bei einem neuen Vertrag ist der Hinweis vorausschauend, aber nicht falsch.
- **Meldung bei 0:** «Ein eigener Satz von 0 % heisst: keine Verwaltungspauschale. Wählen Sie dann «Nein».» Die Meldung ist klar, sachlich richtig und sagt, was zu tun ist. Sie passt zur Meldung bei 11, deren Bereich ab 0,01 beginnt. Der Fokus blieb nach «Weiter» beide Male im Feld, das Feld war als ungültig markiert, und der Assistent blieb bei Schritt 4.
- **10,5 wird ebenfalls abgelehnt**, mit derselben Meldung. Das ist folgerichtig.
- **Die Rechenlogik des Saldo-Texts stimmt.** Kostenanteil samt Pauschale, minus Akonto, minus schon Bezahltes auf die ersetzten Abrechnungen, plus schon Zurückerstattetes. Ich habe beide Fälle nachgerechnet:
  - Die bezahlte Nachzahlung wird abgezogen.
  - Eine schon ausbezahlte Rückerstattung wird wieder hinzugerechnet. Bleiben die Kosten gleich, ergibt sich Saldo 0.

  Die Rundung «nur zugunsten des Mieters» stimmt mit der Abrechnung von Hans Müller überein: CHF 215.82 wurden auf CHF 215.80 abgerundet.
- Der Dialog «Abrechnung berichtigen» sagt: «Hat der Mieter schon bezahlt, markieren Sie sie zuerst als bezahlt.» Das passt zum Saldo-Text. Wie ich eine schon ausbezahlte **Rückerstattung** vermerke, die der Saldo-Text ja einrechnet, sagen weder der Dialog noch die Hilfe.
- Der Dialog nennt Art. 128 Ziff. 1 OR (fünf Jahre). Bei einer Forderung aus der Nebenkostenabrechnung als periodischer Leistung ist das vertretbar, und der Text sagt selbst, dass der Fristbeginn nicht einheitlich geklärt ist. Der Hinweis ist vorsichtig formuliert, gut.
- Im Protokoll heisst es «Die Einträge bleiben, bis Sie sie löschen». Für einen Nachweis ist das eine eher schwache Zusage, aber ehrlich.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, 10 Skriptläufe. Zwei Läufe brauchte ich, weil die Mieterauswahl eine Klappliste ist.

## Ablauf

1. **Hilfe, «Begriffe kurz erklärt».**
   - Erwartet: Erklärungen zu Verwaltungspauschale und Saldo mit Rechtsgrundlage.
   - Gesehen: «Verwaltungspauschale» mit Art. 4 Absatz 3 VMWG, Vereinbarungspflicht, «üblich bis 3 %» und Vorrang des Vertragssatzes. «Saldo» mit der Formel, dem Fall der berichtigten Abrechnung und der Rundung. Ein eigener Begriff «Berichtigte Abrechnung» fehlt (P-2).
2. **Einstellungen.**
   - Erwartet: dieselbe Aussage wie in der Hilfe.
   - Gesehen: dieselbe Aussage, zusätzlich «Dwello nimmt höchstens 10 % an». Es fehlt aber der Vorrang des Vertragssatzes (P-3), und der Gegenstand heisst «Nebenkosten» statt «Nebenkostenabrechnung» (P-4).
3. **Einstellungen, «Protokoll».**
   - Erwartet: eine klare Liste dessen, was verzeichnet wird.
   - Gesehen: Leerzustand «Noch keine Einträge». Verzeichnet werden laut Text Anmeldungen, Änderungen der vorgeschlagenen Verwaltungspauschale, der Umlagefähigkeit von Kategorien und Rechnungen, zurückgesetzte Zahlungen und berichtigte Abrechnungen. Der Vertragssatz fehlt (P-6).
4. **Mietvertrag erfassen**, bis Schritt «Miete»: Anna Schmidt, Wohnung OG2 Alpenblick, ab 01.12.2026, unbefristet, Nettomiete 1500.00, Akonto 180.00.
   - Gesehen: Der Hinweis, dass Anna Schmidt schon einen Mietvertrag ohne Vertragsende hat, kam wie erwartet.
5. **«Ja, mit eigenem Satz»** gewählt.
   - Erwartet: ein Feld mit Hilfetext.
   - Gesehen: das Feld «Eigener Satz in %» ohne Hilfetext und ohne Beispiel (P-1).
6. **0 eingegeben, «Weiter».**
   - Erwartet: Ablehnung mit dem Hinweis auf «Nein».
   - Gesehen: genau das. Der Assistent blieb bei Schritt 4, das Feld war als ungültig markiert und hatte den Fokus.
7. **11 eingegeben, «Weiter».**
   - Erwartet: Ablehnung mit Begründung.
   - Gesehen: «Bitte geben Sie einen Prozentsatz von 0,01 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.» Die Meldung hat keine Begründung und sagt nicht, was bei einem höheren vereinbarten Satz zu tun ist (P-1).
8. **Gegenprobe mit 10,5, 2.5 und 2,5.**
   - Gesehen: 10,5 wird abgelehnt. 2.5 und 2,5 führen zu «Prüfen» mit «Vereinbart, 2.5 %» (P-5). Ich bin zurückgegangen und habe nicht gespeichert.
9. **Abrechnung NK-11111111-2025-0001 und Dialog «Abrechnung berichtigen».**
   - Gelesen und nachgerechnet; den Dialog habe ich abgebrochen.

## Verwirrung

- «Berichtigte Abrechnung» und «ersetzte Abrechnungen» im Saldo-Text: Begriffe ohne Erklärung in der Hilfe. Die Erklärung steht erst im Dialog, und den sieht man erst, wenn man berichtigen will.
- «Satz des Abrechnungslaufs»: Dass ein «Lauf» das Erstellen der Abrechnungen in einem Durchgang ist, erschliesst sich nur aus dem Zusammenhang.
- Woher die Grenze von 10 % kommt, bleibt offen: aus dem Gesetz, aus der Praxis oder als Vorgabe von Dwello. Nur die Einstellungen sagen «Dwello nimmt höchstens 10 % an», ohne Grund.

## Fehlerrisiken

- Steht im unterschriebenen Mietvertrag ein Satz über 10 %, kann der Vermieter ihn nicht erfassen. Vielleicht wählt er dann «Ja, zum Satz des Abrechnungslaufs» und verrechnet einen anderen Satz, als vereinbart ist. Rechtlich wäre ein so hoher Satz ohne Nachweis des Aufwands ohnehin angreifbar; das sagt die Meldung aber nicht.
- Wer nur die Einstellungen liest, kann meinen, sein Vorschlag gelte für alle Mieter, und übersieht einen abweichenden Vertragssatz (P-3).
- Wurde die Rückerstattung einer ersetzten Abrechnung schon ausbezahlt, Dwello weiss das aber nicht, fällt der Saldo der berichtigten Abrechnung zulasten des Vermieters falsch aus. Wie man die Auszahlung vermerkt, steht nirgends.

## Vorschläge

- **P-1:**
  - Reproduktion: «Mietvertrag erfassen», Schritte 1 bis 3 ausfüllen, in «Miete» «Ja, mit eigenem Satz» wählen, 11 eingeben, «Weiter».
  - Hilfreich wäre ein Hilfetext am Feld, etwa: «Der Satz aus dem Mietvertrag. Üblich sind bis 3 %; Dwello nimmt höchstens 10 % an.» Dazu eine Meldung, die den Grund nennt und einen Weg zeigt, etwa: «Dwello nimmt höchstens 10 % an. Ein höherer Satz muss Ihrem tatsächlichen Aufwand entsprechen (Art. 4 Absatz 3 VMWG); lassen Sie sich beraten.»
- **P-2:**
  - Reproduktion: Hilfe, «Begriffe kurz erklärt», «Saldo» lesen und dann den Begriff «Berichtigte Abrechnung» suchen.
  - Hilfreich wäre ein Begriff «Berichtigte Abrechnung»: Er ersetzt eine versendete Abrechnung, die bisherige bleibt erhalten. Dazu ein Satz im Abschnitt «Nebenkostenabrechnungen erstellen», dass man eine versendete Abrechnung mit «Abrechnung berichtigen» korrigiert.
- **P-3:**
  - Reproduktion: Einstellungen, Hilfetext bei «Verwaltungspauschale in %».
  - Hilfreich wäre der Satz der Hilfe: «Nennt der Mietvertrag einen eigenen Satz, gilt dieser.»
- **P-4:**
  - Reproduktion: Hilfe «Verwaltungspauschale» und Einstellungen nebeneinander lesen.
  - Hilfreich wäre eine einheitliche Formulierung, nahe am Gesetz: «Aufwand für die Verwaltung der Nebenkosten».
- **P-5:**
  - Reproduktion: Schritt «Miete», 11 eingeben (die Meldung nennt «2,5»), dann 2,5 eingeben und «Prüfen» ansehen («2.5 %»).
  - Hilfreich wäre eine einzige Schreibweise des Dezimalzeichens in Beispiel und Anzeige.
- **P-6:**
  - Reproduktion: Einstellungen, «Protokoll», Leerzustand lesen.
  - Hilfreich wäre, auch den Satz der Verwaltungspauschale zu verzeichnen, der für einen Mietvertrag erfasst oder geändert und der für einen Abrechnungslauf gewählt wurde. Falls das bewusst nicht vorgesehen ist, sollte der Text sagen, wo man diese Sätze später nachvollzieht (in der Abrechnung selbst: «3 % der Zwischensumme»).

## Nicht geprüft

- Was das Protokoll bei einer tatsächlichen Änderung wirklich einträgt: Ich durfte nicht speichern, und es enthielt noch keine Einträge.
- Ob die Einstellungen 11 % ablehnen und mit welcher Meldung: Das zeigt erst das Speichern.
- Den Schritt «Heizprofil und Verwaltungspauschale» beim Erstellen der Abrechnungen: Er war nicht Teil der Aufgabe.
- Das PDF einer berichtigten Abrechnung, und ob es den Saldo mit den bezahlten Beträgen der ersetzten Abrechnung aufschlüsselt: Dafür hätte ich berichtigen und speichern müssen.
- Andere Sprachen als Deutsch.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-447/`. Darin unter anderem:
- `02-help.png`, `03-config.png`, `04-protokoll.png`;
- `10-satz-0.png` und `10-satz-11.png`: jeweils das rot markierte Feld mit der Meldung darunter;
- `11-pruefen-2.5.png`;
- `12-statement.png` und `13-berichtigen-dialog.png`.
