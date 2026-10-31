# Sven, 718c, zweiter Durchgang: Fokus nach «Neuen Code erstellen» und «Neuen Code bestätigen»

App: http://localhost:3310, abgemeldet gestartet ohne Persona-Kit-Cookie, angemeldet als `sven@dwello.test`. Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Tree. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/sven-718c-2/`.

Geprüft habe ich nur die zwei Momente aus der Aufgabe. Beide sind gegenüber dem ersten Durchgang behoben: Der Fokus fällt nicht mehr auf den Seitenkörper, sondern auf den neuen Inhalt.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Wiederherstellungscode, nach «Neuen Code erstellen» | Der Fokus liegt auf dem Absatz mit dem Code allein (`XE95-ASMQ-F3JR-B8H4-4GBP-2H93`). Die Überschrift «Ihr Wiederherstellungscode» steht in einem eigenen Absatz davor und gehört nicht zum fokussierten Element. Ich höre also nur eine Zeichenfolge ohne Namen. Ein Screenreader liest sie zudem als Wörter («XE95» wie «ex-e-fünfundneunzig»). Dass das der neue Code ist, schliesse ich nur aus meinem letzten Tastendruck. |

## Beobachtungen

- Nach «Neuen Code erstellen» springt der Fokus kurz auf den Seitenkörper (ein `focusin` auf `body`) und landet nach weniger als 500 ms auf dem Code-Absatz. Am Ende zählt nur das Ziel, und das stimmt.
- Nach «Neuen Code bestätigen» liegt der Fokus auf der grünen Erfolgsmeldung. Ich höre: «Der neue Wiederherstellungscode gilt ab jetzt. Dwello erstellt gleich eine erste Sicherung mit ihm und sichert Ihre Daten ab jetzt jeden Tag mit ihm.» Das ist klar. Die URL wechselt auf `?confirmed`, der Seitentitel bleibt gleich, und eine Live-Region meldet nichts. Die Meldung erreicht mich also nur über den Fokus, das genügt aber.
- Die Erfolgsmeldung besteht aus zwei verschachtelten `div` mit `tabindex="-1"`. Fokussiert wird das äussere. Mich hat das nicht gestört.
- Mit Tab nach dem Code komme ich direkt zu «Notfallblatt herunterladen (PDF)» und dann ins Feld «Wiederherstellungscode erneut eingeben». Mit Tab nach der Erfolgsmeldung komme ich ins Feld «Passwort». Beide Reihenfolgen sind logisch.
- Den 30-Minuten-Hinweis höre ich nur, wenn ich nach dem Code weiterlese. Er steht im Tree direkt unter dem Code.
- Wer die Seite neu öffnet, während ein Code noch nicht bestätigt ist, sieht den Code mit dem Bestätigungsfeld wieder. Der Fokus liegt dann wie bei jedem Seitenwechsel auf dem Seitenkörper. Das gehört nicht zu dieser Prüfung.
- Den Code konnte ich aus dem Accessibility-Tree ablesen und eintippen, mit Bindestrichen. Er wurde angenommen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 7 Skriptläufe. Pro Durchgang: 13 Tabs bis «Einstellungen», 22 Tabs bis «Neuer Wiederherstellungscode», 18 Tabs bis «Passwort», 1 Tab bis zum Knopf. Danach 19 Tabs vom Seitenanfang bis «Wiederherstellungscode erneut eingeben», wenn ich die Seite neu öffne.

## Ablauf

- Nach «Neuen Code erstellen»: Erwartet hatte ich, dass der Fokus auf dem Code samt seiner Beschriftung landet. Er landet auf dem Code-Absatz allein, ohne den Namen «Ihr Wiederherstellungscode» (P-1). Bildschirmfoto `05-code-erstellt.png`: Code gross und fett, darunter der 30-Minuten-Hinweis, der Link zum Notfallblatt und das Bestätigungsfeld.
- Mein zweiter Skriptlauf erwartete wieder das Passwortfeld, fand aber den noch offenen Code mit dem Bestätigungsfeld vor. Das war richtig so, denn der Code war ja noch nicht bestätigt. Ich habe von dort aus bestätigt.

## Vorschläge

- **P-1:** Anmelden, Tab bis «Einstellungen» und Enter, Tab bis «Neuer Wiederherstellungscode» und Enter, Tab ins Feld «Passwort», das Passwort tippen, Tab und Enter auf «Neuen Code erstellen». Der Fokus liegt auf `<p tabindex="-1" data-testid="backup-code">` ohne Namen. Was helfen würde: Den Fokus auf einen Behälter legen, der die Beschriftung «Ihr Wiederherstellungscode» und den Code enthält. Oder den Code-Absatz mit `aria-labelledby` an die Beschriftung binden. Dann höre ich «Ihr Wiederherstellungscode, XE95-…».

## Nicht geprüft

- Was ein echter Screenreader (NVDA, VoiceOver) beim Fokus auf ein `p` oder `div` ohne Rolle tatsächlich vorliest. Beurteilt habe ich am Accessibility-Tree, am fokussierten Element und an den Live-Regionen (mit einem MutationObserver mitgeschrieben). Ein Screenreader stand mir nicht zur Verfügung.
- Fehlerfälle (falsches Passwort, falscher Code, abgelaufener Code). Sie waren nicht Teil der Aufgabe.
- Das Notfallblatt-PDF habe ich nicht heruntergeladen.

## Triage (caller)

- Closes sven-718c P-1 and P-2: the focus is on the code and on the confirmation.
- P-1 (Minor): stays (the code paragraph has no accessible name of its own).
