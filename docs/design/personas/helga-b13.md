# Persona-Lauf: Helga, Runde b13 (Mietverträge einer Wohnung lassen sich nicht laden)

- Persona: Helga, 68, hat eine Wohnung geerbt, wenig Computererfahrung, braucht grosse Schrift, ist bei Fachbegriffen unsicher.
- Gerät: Desktop 1440 × 900, Zoom 150 %, Maus.
- Simulierter Fehler: Die Browser-Anfrage `GET /api/contracts?apartmentId=aaaa3333-3333-3333-3333-333333333333` (Wohnung OG2 - Alpenblick) wurde mit Status 500 beantwortet, ohne Inhalt. Alle anderen Anfragen liefen normal gegen die Demo-Daten.
- Screenshots und Skripte: `/tmp/claude-0/persona-helga/` (nicht im Repository).

## Aufgabe geschafft: teilweise

Ich bin in beiden Formularen bis zum Speichern-Knopf gekommen. Gespeichert habe ich nicht, weil ich nicht wusste, ob das jetzt gut geht. Die gelbe Meldung habe ich gesehen. Was sie für meinen Mietvertrag bedeutet, habe ich nicht verstanden. Beim Bearbeiten habe ich den Rat «Seite neu laden» befolgt, und danach waren meine Änderungen weg, ohne jeden Hinweis.

## Aufwand

- Aufgabe 1 (Neuer Mietvertrag bis Vertragsbeginn und weiter bis «Prüfen»): 6 Klicks/Eingaben, etwa 3 Minuten mit Lesen.
- Aufgabe 2 (Mietvertrag bearbeiten, Wohnung wechseln, neu laden): 5 Klicks/Eingaben, etwa 3 Minuten.

## Ablauf

### Aufgabe 1: Neuer Mietvertrag

| Schritt | Erwartet | Gesehen |
|---|---|---|
| 1. `/contracts/new` öffnen | Ein Formular, das mir sagt, was ich tun soll. | «Neuer Mietvertrag», «Schritt 1 von 5: Mieter», eine Auswahlliste «Mieter» mit Hilfetext. Gut lesbar bei 150 %. (`10-new-step1.png`) |
| 2. Mieter «Nina Brunner, Luzern» wählen, «Weiter» | Nächster Schritt. | «Schritt 2 von 5: Wohnung». Hilfetext: «Freie Wohnungen stehen zuoberst. Vermietete Wohnungen sind mit «nicht verfügbar» markiert». Zuoberst steht «Wohnung OG2 - Alpenblick, 3.5 Zimmer, 85 m²» **ohne** Vermerk, also für mich: frei. (`11-step2.png`) |
| 3. «Wohnung OG2 - Alpenblick» wählen | Die Wohnung ist frei, alles gut. | Unter der Liste erscheint ein gelber Kasten mit Warndreieck: «Die Mietverträge der Wohnung konnten nicht geladen werden. Laden Sie die Seite neu und versuchen Sie es erneut.» Der Knopf «Weiter» bleibt aktiv. (`12-step2-chosen.png`) |
| 4. «Weiter» | Entweder hält mich das Programm auf, oder die Meldung ist weg. | «Schritt 3 von 5: Vertragsdauer». Dieselbe gelbe Meldung steht jetzt unter dem leeren Feld «Vertragsbeginn». (`13-step3.png`) |
| 5. Vertragsbeginn «01.11.2026» eingeben | Eine Prüfung, ob die Wohnung ab dann frei ist. | Darunter steht «Sonntag, 1. November 2026», die gelbe Meldung bleibt. Ob die Wohnung ab dann frei ist, sagt mir niemand. (`14-step3-date.png`) |
| 6. «Weiter», Nettomiete 1500, «Weiter» | Auf der Seite «Prüfen» ein Hinweis, dass etwas nicht geprüft werden konnte. | «Schritt 5 von 5: Prüfen» mit allen Angaben und dem Knopf «Mietvertrag speichern». **Die gelbe Meldung ist hier verschwunden.** Nichts erinnert mich daran, dass vorher etwas nicht geklappt hat. (`17-step5.png`) |
| 7. Wie geraten: Seite neu laden (gemacht in einem zweiten Durchgang ab Schritt 4) | Ich lande wieder dort, wo ich war. | Hinweis «Entwurf wiederhergestellt. Ihre Angaben, zuletzt am 13.10.2026 um 19:03 bearbeitet, sind wieder da.» Ich stehe aber wieder bei «Schritt 1 von 5: Mieter». Nina Brunner ist gewählt, ich muss mich wieder durchklicken. (`16-after-reload.png`) |

Was ich verstehe: Etwas mit «Mietverträgen» hat nicht geklappt. Ich lege aber doch gerade erst einen Mietvertrag an. Welche Mietverträge sind gemeint? Ist die Wohnung jetzt frei oder nicht? Darf ich weitermachen?

Was ich tun würde: Weil «Weiter» geht und die Wohnung ohne «nicht verfügbar» dasteht, würde ich weitermachen. Auf der Seite «Prüfen» sehe ich keinen Hinweis mehr und würde «Mietvertrag speichern» drücken. Wie man «die Seite neu lädt», wüsste ich ohne meinen Enkel nicht. Einen Knopf dafür gibt es nicht.

### Aufgabe 2: Mietvertrag bearbeiten

| Schritt | Erwartet | Gesehen |
|---|---|---|
| 1. `/contracts` öffnen, auf «Pierre Dubois» klicken | Der Mietvertrag. | «Mietvertrag von Pierre Dubois», «Wohnung 2.01 · Musterhaus Zentrum», Knöpfe «Bearbeiten», «Beenden», «Löschen». (`21-detail.png`) |
| 2. «Bearbeiten» | Ein Formular mit den heutigen Angaben. | «Mietvertrag bearbeiten», gelber Hinweis «Laufender Mietvertrag – Änderungen an einem laufenden Mietvertrag gelten sofort.» Alle Felder sind auf einer Seite. (`22-edit.png`) |
| 3. Wohnung auf «Wohnung OG2 - Alpenblick» wechseln | Die Wohnung ist frei (kein «nicht verfügbar»). | Die gelbe Meldung «Die Mietverträge der Wohnung konnten nicht geladen werden. Laden Sie die Seite neu …» erscheint **zweimal**: unter «Wohnung» und noch einmal unter «Vertragsbeginn» (01.01.2023). (`23-edit-fail-apt.png`) |
| 4. Vertragsbeginn auf 01.11.2026 ändern | Eine Prüfung. | Beide Meldungen bleiben stehen. «Änderungen speichern» ist aktiv. (`24-edit-date.png`) |
| 5. Wie geraten: Seite neu laden (Wohnung OG2 gewählt, Nettomiete auf 1700 geändert) | Meine Änderungen bleiben, oder ich werde gewarnt, dass sie verloren gehen. | Keine Warnung vor dem Neuladen. Danach steht wieder «Wohnung 2.01 - Musterhaus Zentrum» und Nettomiete 1650.00 da, die gelbe Meldung ist weg. Kein Hinweis «Entwurf wiederhergestellt» wie beim neuen Mietvertrag. (`26-edit-after-reload.png`) |

Was ich verstehe: Wieder dasselbe, nur doppelt. Zwei gleiche gelbe Kästen haben mich erschreckt, als wären es zwei verschiedene Fehler.

Was ich tun würde: Ich lade neu, wie verlangt. Danach ist die Meldung weg, und ich glaube, jetzt hat es geklappt. Dass die Wohnung wieder auf 2.01 steht, sehe ich vielleicht nicht, weil ich nach der Meldung schaue und nicht nach der Wohnung. Dann drücke ich «Änderungen speichern» und speichere den alten Stand.

## Verwirrung (auch Begriffe)

- «Die Mietverträge der Wohnung»: Ich lege doch einen neuen Mietvertrag an. Dass das Programm die **anderen, schon vorhandenen** Mietverträge dieser Wohnung braucht, um zu prüfen, ob sie frei ist, steht nirgends.
- Die Meldung sagt nicht, was jetzt fehlt (die Prüfung, ob die Wohnung ab diesem Datum frei ist) und ob ich trotzdem weitermachen darf.
- «Laden Sie die Seite neu»: Ich kenne das Wort, weiss aber nicht, wo ich klicken soll. Es gibt keinen Knopf «Erneut versuchen».
- Die Wohnung steht ohne «nicht verfügbar» in der Liste, obwohl das Programm ihre Mietverträge gar nicht kennt. Für mich heisst das: frei.
- Beim Bearbeiten fehlen in der Wohnungsliste Zimmer und m², beim neuen Mietvertrag stehen sie da. Ich war kurz unsicher, ob es dieselben Wohnungen sind.
- Nach dem Neuladen im neuen Mietvertrag bin ich wieder bei Schritt 1, obwohl «Ihre Angaben … sind wieder da». Ich dachte erst, es sei alles weg.

## Fehlerrisiken

1. **Gespeichert ohne Prüfung auf Überschneidung:** Ich kann einen Mietvertrag für eine Wohnung speichern, deren bestehende Mietverträge nicht bekannt sind. Auf «Prüfen» fehlt jeder Hinweis. Ob der Server eine Überschneidung beim Speichern ablehnt, habe ich nicht geprüft (siehe «Nicht geprüft»).
2. **Änderungen verloren nach dem empfohlenen Neuladen (Bearbeiten):** Wer dem Rat folgt, verliert ohne Warnung alle Änderungen. Die Meldung ist danach weg, das sieht aus wie «erledigt».
3. **Falsches «frei»:** Die Liste zeigt die Wohnung als frei an, obwohl das nicht bekannt ist.
4. **Doppelte Meldung** beim Bearbeiten: Bildschirmleser lesen zwei Statusmeldungen vor. Für mich sah es nach zwei Fehlern aus.

## Vorschläge

| ID | Schwere | Bildschirm | Vorschlag | Reproduktion / Beleg |
|---|---|---|---|---|
| H1 | Major | Neuer Mietvertrag, Schritt 5 «Prüfen» | Auf «Prüfen» bleibt ein deutlicher Hinweis stehen, dass nicht geprüft werden konnte, ob die Wohnung ab dem Vertragsbeginn frei ist. Oder das Speichern wartet, bis die Mietverträge geladen sind. | Anfrage `/api/contracts?apartmentId=<OG2>` mit 500 beantworten → Mieter wählen → OG2 → Weiter → Datum 01.11.2026 → Miete 1500 → Weiter: keine Meldung, «Mietvertrag speichern» aktiv (`17-step5.png`). |
| H2 | Major | Mietvertrag bearbeiten | Der Rat «Seite neu laden» darf keine Eingaben vernichten. Besser ein Knopf «Erneut versuchen», der nur die Mietverträge neu lädt. Sonst vor dem Verlassen warnen oder den Stand wie beim neuen Mietvertrag als Entwurf behalten. | Gleiche Anfrage mit 500 → `/contracts/<Pierre Dubois>/edit` → Wohnung OG2, Nettomiete 1700 → Seite neu laden: keine Warnung, Wohnung 2.01 und 1650.00 sind zurück, die Meldung ist weg (`26-edit-after-reload.png`). |
| H3 | Major | Beide, Meldung unter «Wohnung» | In Alltagssprache sagen, was fehlt und was ich tun kann, z. B.: «Wir konnten nicht prüfen, ob diese Wohnung ab dem gewählten Datum frei ist. Versuchen Sie es erneut.» Dazu ein Knopf «Erneut versuchen» statt «Laden Sie die Seite neu». | Schritt 2 nach Wahl von OG2 (`12-step2-chosen.png`), Bearbeiten (`23-edit-fail-apt.png`). |
| H4 | Minor | Wohnungsliste (beide) | Eine Wohnung, deren Mietverträge nicht geladen werden konnten, nicht als frei zeigen, sondern z. B. mit «(Belegung unbekannt)» markieren. | Schritt 2: OG2 steht zuoberst ohne Vermerk (`11-step2.png`). |
| H5 | Minor | Mietvertrag bearbeiten | Die Meldung nur einmal zeigen, nicht zusätzlich unter «Vertragsbeginn». | `23-edit-fail-apt.png`: zwei gleiche gelbe Kästen, im Accessibility-Baum zwei `status`. |
| H6 | Minor | Neuer Mietvertrag nach Neuladen | Nach «Entwurf wiederhergestellt» beim zuletzt offenen Schritt weitermachen, nicht bei Schritt 1. | Bis Schritt 4, neu laden → «Schritt 1 von 5: Mieter» (`16-after-reload.png`). |
| H7 | Nit | Mietvertrag bearbeiten | Die Wohnungsliste wie beim neuen Mietvertrag mit Zimmern und m² zeigen. | `22-edit.png` («Wohnung OG2 - Alpenblick») gegenüber `11-step2.png` («…, 3.5 Zimmer, 85 m²»). |
| H8 | Nit | Neuer Mietvertrag | «Entwurf gespeichert, 19:03» blieb auf 19:03 stehen, obwohl ich danach Datum und Miete eingegeben habe; erst bei Schritt 5 kam 19:04. Unsicher, ob die letzten Eingaben gesichert sind. | Schritte 3 bis 4 im Ablauf von Aufgabe 1. |

## Nicht geprüft

- «Mietvertrag speichern» und «Änderungen speichern» habe ich **nicht** gedrückt. Die Datenbank wird gleichzeitig von anderen Prüfern benutzt, und ein gespeicherter Mietvertrag hätte ihre Demo-Daten verändert. Ob der Server eine überschneidende Belegung beim Speichern ablehnt (und mit welcher Meldung), ist darum offen.
- Ein Neuladen, nach dem die Anfrage wieder klappt: Der Fehler war für die ganze Sitzung fest eingestellt. Ob die Meldung nach erfolgreichem Neuladen verschwindet und die Wohnung richtig markiert wird, habe ich nicht gesehen.
- Zoom 200 % und dunkle Darstellung habe ich nicht ausprobiert.
- Hinweis: In den ganzseitigen Screenshots `12-…`, `13-…` überdeckt die Kopfzeile ein Stück des Inhalts. Das kommt vom ganzseitigen Screenshot mit fixierter Kopfzeile und ist kein Befund.
