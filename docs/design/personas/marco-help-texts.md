# Marco: Hilfe-Inhaltsverzeichnis und Text unter «Verteilschlüssel» (Handy)

Persona: Marco, 38, Handy 390 × 844, Touch. App: Persona-Stack mit Demo-Daten (http://localhost:3300). Ich habe nur geschaut und nichts gespeichert.
Skripte und Screenshots liegen ausserhalb des Repos unter `<scratchpad>/marco-help-texts/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hilfe, «Begriffe kurz erklärt» | Der Sprung landet sauber auf der Überschrift. «Mietstage» ist aber der 8. von 18 Begriffen, gut 1300 px weiter unten. Ich muss also doch scrollen, und einen einzelnen Begriff kann ich nicht direkt verlinken. |
| P-2 | Nit | Einstellungen → Verteilschlüssel | Der Satz «ohne ihn wird sie gleichmässig pro Wohnung verteilt» ist verständlich. Offen bleibt aber, wo ich den Verteilschlüssel einer Rechnung setze und ob «gleichmässig pro Wohnung» dasselbe ist wie der Schlüssel «Pro Einheit» weiter unten. |

## Beobachtungen

- Im Menü auf dem Handy liegt «Hilfe» knapp unter dem sichtbaren Bereich: Die Oberkante des Links liegt bei y = 844, also genau am unteren Bildrand. Unter der Gruppe «Einstellungen und Hilfe» sieht man nur «Einstellungen», «Kategorien», «Verteilschlüssel» und «Heizprofile». Erst wenn man im Menü scrollt, erscheint «Hilfe». Das wurde in dieser Änderung nicht angefasst, deshalb steht es nicht in der Tabelle.
- In der Hilfe unter «Rechnungen erfassen» steht, dass ich Verteilschlüssel «unter «Verteilschlüssel»» pflege. Im Menü stimmt das. Auf der Seite «Einstellungen» liegt derselbe Eintrag unter «Stammdaten». Beide Wege führen zum Ziel und verwirren nicht.
- Der Seitentitel bleibt «Hilfe - Dwello», auch mit `#glossary`. Ein Lesezeichen heisst also nur «Hilfe».
- Unten in der Hilfe gibt es keinen Link «Nach oben». Zurück zur Liste komme ich mit der Zurück-Taste des Browsers, und das klappt (siehe Ablauf).

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 9 Schritte: Menü öffnen, im Menü zu «Hilfe» scrollen und tippen, «Begriffe kurz erklärt» tippen, zu «Mietstage» scrollen, Zurück-Taste, «Rechnungen erfassen» tippen, Adresse direkt öffnen, Menü → «Einstellungen» → «Verteilschlüssel».

## Ablauf

1. **Hilfe finden.** Erwartet: «Hilfe» im Menü. Gesehen: Das Menü (☰) zeigt die Gruppe «Einstellungen und Hilfe», «Hilfe» selbst liegt aber knapp unter dem Bildrand (Screenshot `09-menu-viewport.png`). Nach etwas Scrollen im Menü konnte ich es antippen. Ich lande auf `/help`.
2. **Liste oben auf der Hilfeseite.** Erwartet: ein Inhaltsverzeichnis. Gesehen: Unter «Hilfe» und dem Satz «Die wichtigsten Abläufe in Dwello Schritt für Schritt.» stehen sechs unterstrichene Links untereinander, von «Gebäude und Wohnungen erfassen» bis «Begriffe kurz erklärt» (`03-help-top.png`). Jeder Link ist 48 px hoch und ganz ohne Scrollen sichtbar. Sie sind gut zu treffen. Ich habe nichts Falsches angetippt, obwohl die Zeilen direkt aneinanderstossen.
3. **«Begriffe kurz erklärt» antippen.** Erwartet: Ich lande bei den Begriffen, und die Überschrift ist sichtbar. Gesehen: Die Adresse wird `/help#glossary`. Die Kopfleiste (65 px, bleibt oben stehen) verdeckt nichts: Die Überschrift «Begriffe kurz erklärt» steht bei y = 120, also deutlich darunter, und gleich darunter folgt «Abrechnungsperiode» mit ihrer Erklärung (`04-glossary.png`). Abrechnungsperiode gefunden: «Das Jahr, über das Sie die Nebenkosten abrechnen …». Verstanden.
4. **«Mietstage» suchen.** Erwartet: in der Nähe. Gesehen: «Mietstage» ist der 8. Begriff, nach Akonto, Nettomiete, Zusatzmiete, Verteilschlüssel, Heizprofil und Verwaltungspauschale. Ich musste etwa anderthalb Bildschirmhöhen scrollen. Die Erklärung ist klar: Tage, die der Vertrag in der Periode läuft; bei Ein- oder Auszug zahlt der Mieter nur seinen Anteil; leere Tage trägt der Vermieter (`13-mietstage-scrolled.png`). → P-1
5. **Zurück-Taste des Browsers.** Erwartet: zurück zur Liste oben. Gesehen: Die Adresse ist wieder `/help`, die Seite steht ganz oben, und die Liste ist sichtbar. Gut.
6. **«Rechnungen erfassen» antippen.** Erwartet: wie bei Schritt 3. Gesehen: Die Adresse wird `/help#invoices`, und die Überschrift «Rechnungen erfassen» steht wieder bei y = 120 unter der Kopfleiste, mit allen vier Punkten auf einen Blick (`07-invoices.png`). Mit zwei weiteren Zurück-Tipps komme ich zuerst zu `/help` und dann zur «Übersicht». Der Verlauf ist sauber.
7. **Seitliches Scrollen.** Auf der Hilfeseite und auf «Verteilschlüssel» ist die Seite genau 390 px breit. Nichts lässt sich seitwärts schieben.
8. **Lesezeichen oder Link weitergeben.** Erwartet: `/help#glossary` funktioniert auch frisch geöffnet. Gesehen: In einem neuen Browser springt `http://localhost:3300/help#glossary` direkt zu «Begriffe kurz erklärt», und die Überschrift ist wieder sichtbar (`08-direct-glossary.png`). Diese Adresse kann ich speichern oder per WhatsApp schicken. Wer sie bekommt, braucht natürlich ein eigenes Konto. Einen einzelnen Begriff wie «Mietstage» kann ich nicht direkt verlinken.
9. **Menü → «Einstellungen» → «Verteilschlüssel».** Erwartet: ein kurzer Text, was ein Verteilschlüssel ist und was ohne ihn passiert. Gesehen: Oben steht die Brotkrümelnavigation «Einstellungen › Verteilschlüssel», darunter folgt der Text: «Bestimmt, wie die Kosten eines Gebäudes auf die einzelnen Wohnungen aufgeteilt werden, zum Beispiel nach Fläche, nach Zimmern oder zu gleichen Teilen. Jede umlagefähige Rechnung kann einen Verteilschlüssel haben; ohne ihn wird sie gleichmässig pro Wohnung verteilt.» (`10-keys-top.png`). Damit ist meine Frage beantwortet: Ohne Schlüssel bezahlt jede Wohnung gleich viel. Es bleiben zwei kleine Fragen. → P-2

## Verwirrung

- «gleichmässig pro Wohnung» und der vordefinierte Schlüssel «Pro Einheit» (Formel `{units}`): Ist das dasselbe? Wenn ja, warum gibt es ihn dann extra? Und ist «Einheit» dasselbe wie «Wohnung»? Weiter unten steht zwar «`{units}`: 1 für jede Wohnung», aber das liest auf dem Handy kaum jemand bis dorthin.
- «kann einen Verteilschlüssel haben»: Wo stelle ich das ein, bei der Rechnung oder bei der Kategorie? Der Text sagt es nicht.
- «Umlagefähig» kommt im Verteilschlüssel-Text vor. In der Hilfe ist das Wort erklärt, hier fehlt aber der Weg dorthin.

## Fehlerrisiken

- Wer den Satz liest, könnte denken, eine Rechnung ohne Schlüssel sei ein Fehler, der sich von selbst löst. Wenn ich bei einer Heizrechnung den Schlüssel vergesse, wird sie stillschweigend pro Wohnung verteilt. Die kleine Wohnung zahlt dann gleich viel wie die grosse. Der Text sagt zwar, was passiert, aber nicht, dass ich das vor dem Abrechnen prüfen sollte.

## Vorschläge

- **P-1:** Reproduktion: Handy 390 px, `/help` öffnen, «Begriffe kurz erklärt» antippen und «Mietstage» suchen. Es ist der 8. von 18 Begriffen, ungefähr 1300 px unter der Überschrift. Hilfreich wären Sprungmarken pro Begriff (z. B. `/help#mietstage`), die man auch aus anderen Seiten verlinken kann, oder eine kurze Buchstaben- oder Begriffsliste unter der Überschrift «Begriffe kurz erklärt».
- **P-2:** Reproduktion: Handy, Menü → «Einstellungen» → «Verteilschlüssel» und den Text unter dem Titel lesen. Hilfreich wäre ein halber Satz dazu, wo man den Schlüssel wählt (z. B. «Sie wählen ihn beim Erfassen der Rechnung»), und «gleichmässig pro Wohnung (wie «Pro Einheit»)», damit klar ist, dass das derselbe Schlüssel ist.

## Nicht geprüft

- Ob eine Rechnung ohne Verteilschlüssel in der Abrechnung wirklich gleichmässig verteilt wird: Ich sollte nur schauen und nichts speichern.
- Ob «Hilfe» im Menü bei kleineren Handys (unter 844 px Höhe) noch weiter nach unten rutscht: Ich habe nur 390 × 844 verwendet.
- Andere Sprachen und Dark Mode: nicht Teil der Aufgabe.
