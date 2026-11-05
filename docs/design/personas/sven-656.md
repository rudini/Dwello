# Sven: Benutzermenü, Sprachwahl, Fusszeile (#656)

Persona: Sven, 45, blind, Screenreader und nur Tastatur, Desktop 1440 × 900, beurteilt am Accessibility-Baum. App: Persona-Stack auf http://localhost:3300, Demodaten. Ich habe nichts gespeichert ausser dem Sprachwechsel, und am Ende steht die Sprache wieder auf Deutsch.

| ID  | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Minor | Kopfzeile, Sprachwahl (angemeldet und abgemeldet) | Wenn ich in der offenen Sprachliste Enter auf der Sprache drücke, die schon aktiv ist («Deutsch», als aktuell markiert), passiert nichts. Die Liste bleibt offen (`aria-expanded="true"`), der Fokus bleibt auf «Deutsch», und es wird nichts angesagt. Ich weiss dann nicht, ob meine Wahl angekommen ist. Beim Weitertabben bin ich noch in der Liste und lande auf «Français». |

## Beobachtungen

- Benutzermenü: Die Schaltfläche heisst «Vera Verwalter Benutzermenü» und meldet zugeklappt bzw. aufgeklappt. Pfeil nach unten öffnet das Menü und setzt den Fokus auf «Einstellungen», Pfeil nach oben öffnet es und setzt ihn auf «Abmelden». Pfeil nach unten und oben laufen im Kreis, Pos1 und Ende springen an den Anfang bzw. ans Ende, Escape schliesst das Menü und bringt den Fokus zurück auf die Schaltfläche. Tab aus dem offenen Menü schliesst es und geht zu «Übersicht» (aktuelle Seite). Enter und Leertaste öffnen das Menü auch, der Fokus bleibt dann auf der Schaltfläche. So habe ich es erwartet.
- Das Benutzermenü hat keine eigene Rolle (kein `menu`, keine Gruppe mit Namen). Mit dem Pfeil höre ich nur «Link Einstellungen» bzw. «Schaltfläche Abmelden», ohne «Menü» und ohne «1 von 2». Die E-Mail-Adresse `verwalter@example.com` steht als Absatz im Menü. Mit dem Fokus höre ich sie nie, nur mit dem virtuellen Cursor. Mich hat das nicht aufgehalten, weil die Einträge im Lesefluss direkt nach der Schaltfläche kommen.
- Der Name «Vera Verwalter Benutzermenü» wird ohne Pause gelesen, so als hiesse die Person «Verwalter Benutzermenü». Mit einem Komma oder «Benutzermenü von Vera Verwalter» wäre das klarer.
- Sprachwahl: Die Schaltfläche «Sprache: Deutsch» öffnet eine Liste mit vier Schaltflächen. Jede hat das richtige `lang`, und «Deutsch» ist mit `aria-current` markiert. Pfeile, Pos1, Ende und Escape funktionieren wie im Benutzermenü.
- Nach der Wahl von «Français» lädt die Seite neu (`GET /dashboard`). Der Fokus steht danach auf der Schaltfläche «Langue : Français», `<html lang="fr">`, Titel «Vue d’ensemble - Dwello». Ich höre also sofort in der neuen Sprache, wo ich bin und welche Sprache gilt. Mit Tab geht es weiter zu «Vera Verwalter Menu utilisateur» und zu «Vue d’ensemble». Der Wechsel zurück zu Deutsch geht genauso. Abgemeldet auf /privacy geht es gleich: Danach heisst die Seite «Protection des données - Dwello», der Fokus steht auf «Langue : Français», und zurück zu Deutsch geht ebenso.
- Speicherung der Sprache: Beim Wechsel sah ich im Netzwerk nur den Seitenaufruf `GET /dashboard`, keine Anfrage, die etwas speichert, und das Cookie `PARAGLIDE_LOCALE` wechselte auf `fr`. Eine neue, ebenfalls angemeldete Browsersitzung (neues Persona-Kit-Cookie, ohne `PARAGLIDE_LOCALE`) begann trotzdem auf Deutsch. Ob die Sprache im Konto steht und nur bei einer echten Anmeldung übernommen wird, konnte ich so nicht feststellen.
- Kurz nach dem Laden der Seite, bevor die Seite fertig geladen war, öffnete Pfeil nach unten auf der Benutzermenü-Schaltfläche nichts (`aria-expanded` blieb `false`). Wartete ich, bis die Seite fertig geladen war, ging es.
- Fusszeile: Sie ist als Landmarke «contentinfo» da, darin die Navigation «Rechtliches» mit «Datenschutz» und «Nutzungsbedingungen». Auf /privacy hat «Datenschutz» `aria-current="page"`, auf /terms hat es «Nutzungsbedingungen». Das gilt nach dem Klick in der Fusszeile und auch beim direkten Aufruf. Nach dem Wechsel sagt die Live-Region den Titel an («Datenschutz - Dwello»), und der Fokus steht am Seitenanfang, sodass Tab wieder bei «Zum Inhalt springen» beginnt. Die Fusszeile sagt also, welche Seite offen ist. Bis zum Fusszeilen-Link waren es von der Übersicht aus 42 Tabs. Mit der Landmarken-Navigation geht es schneller.
- Abgemeldet: Auf /privacy enthält die Landmarke «banner» die Links «Anmelden» und «Hilfe» und die Navigation «Sprachwahl». Auf /help stehen im Banner nur «Anmelden» und die Sprachwahl, der Link «Hilfe» fehlt dort, weil ich auf der Hilfe bin. Angemeldet ist «Hilfe» dagegen auch auf /help in der Hauptnavigation da und als aktuelle Seite markiert. Abgemeldet erkenne ich die Seite an Titel und Überschrift «Hilfe». «Anmelden» und «Hilfe» stehen direkt im Banner, nicht in einer eigenen Navigation. Über die Landmarke «Banner» finde ich sie trotzdem gleich.
- Die Sprachwahl ist abgemeldet in eine Navigation «Sprachwahl» verpackt, angemeldet steht die Schaltfläche direkt im Banner. Das ist uneinheitlich, hat mich aber nicht gestört.
- Auf /privacy und /help gibt es abgemeldet eine leere Landmarke bzw. Rolle «status».

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, 13 Skripte. Benutzermenü 4 Tabs ab Seitenanfang und dann 9 Tasten. Sprachwechsel hin und zurück je 3 Tabs, 2 bis 3 Pfeiltasten und Enter. Fusszeile 42 bzw. 21 Tabs.

## Ablauf

- Sprachwahl, «Deutsch» wählen, während Deutsch schon aktiv war. Erwartet: Die Liste schliesst sich, der Fokus geht zurück auf «Sprache: Deutsch». Gesehen: Nichts geschieht, die Liste bleibt offen, der Fokus bleibt auf «Deutsch» (P-1). Bei meinem nächsten Versuch (Pfeil nach unten, Enter) habe ich deshalb aus Versehen Französisch gewählt und musste zurückwechseln.
- Neue angemeldete Sitzung nach dem Wechsel auf Französisch. Erwartet: Dwello startet auf Französisch, weil die Sprache im Konto steht. Gesehen: Dwello startet auf Deutsch, und es ging keine Anfrage hinaus, die etwas speichert (siehe Beobachtungen).
- Benutzermenü direkt nach dem Laden. Erwartet: Pfeil nach unten öffnet das Menü. Gesehen: Nichts geschah, solange die Seite noch nicht fertig geladen war.

Screenshots: `02-menu-open.png` zeigt das offene Benutzermenü mit E-Mail, «Einstellungen» und «Abmelden». `03-lang-open.png` zeigt die offene Sprachliste mit vier Sprachen. `04-after-fr.png` zeigt die Übersicht auf Französisch. `05-privacy.png` und `06-terms.png` zeigen die Rechtstexte mit der Fusszeile. `07-signedout-privacy.png` und `07-signedout-help.png` zeigen die Kopfzeile abgemeldet mit «Anmelden» (und «Hilfe» auf /privacy). Alle liegen in `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/sven-656/`.

## Vorschläge

- P-1: Anmelden, Übersicht, 3 × Tab bis «Sprache: Deutsch», Pfeil nach unten (Fokus auf «Deutsch», aktuell), Enter. Die Liste bleibt offen, der Fokus bleibt in der Liste, nichts wird angesagt. Abgemeldet auf /privacy ist es gleich. Es würde helfen, wenn die Wahl der aktiven Sprache die Liste schliesst und den Fokus auf «Sprache: Deutsch» zurückgibt, wie Escape.

## Nicht geprüft

- Ob die Sprache im Konto steht und bei einer echten Anmeldung übernommen wird: Das Persona-Kit meldet mich ohne OAuth-Anmeldung an. In einer neuen Sitzung sah ich Deutsch, und im Netzwerk sah ich keine Anfrage, die etwas speichert. Mehr kann ich als Nutzer nicht sehen.
- Wie ein echter Screenreader im Lesemodus (NVDA, VoiceOver) die Pfeiltasten auf der Schaltfläche behandelt: Ich habe am Accessibility-Baum und mit echten Tastendrücken im Browser geprüft, ohne Screenreader. Das Playwright-Snapshot zeigt `aria-current` nicht an, darum habe ich es am Attribut des fokussierten Elements abgelesen.
- Italiano und English habe ich nicht gewählt, nur in der Liste angesteuert.
