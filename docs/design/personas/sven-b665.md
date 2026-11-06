# Sven – Feature-Review #665, Runde 1

Persona: Sven, 45, blind, nur Tastatur und Screenreader, Desktop 1440 × 900. Was ich «höre», habe ich aus dem Accessibility-Tree gelesen: Name und Beschreibung (aria-describedby) des Elements mit dem Fokus und die Live-Regionen (`status`, `alert`, `aria-live`), deren Inhalt sich ändert, während der Fokus woanders bleibt. Den Request `GET /api/contracts?apartmentId=…` habe ich im Browser mit Status 500 beantworten lassen (Route-Interception).

| ID | Schweregrad | Bildschirm | Befund |
|----|-------------|------------|--------|
| P-1 | Minor | Neuer Mietvertrag, Schritt 3 «Vertragsdauer» | Schlägt «Erneut versuchen» noch einmal fehl, wird die Meldung «Die Mietverträge der Wohnung konnten wieder nicht geladen werden …» (role=alert) gut vorgelesen. Klappt der nächste Versuch, bleibt diese Fehlermeldung aber im Baum stehen (nach 15 s noch da), während «Die Mietverträge der Wohnung sind geladen.» nach etwa 10 s verschwindet. Wer die Seite später mit dem Screenreader durchgeht, findet nur noch den Fehler und meint, die Prüfung fehle immer noch. |
| P-2 | Minor | Einstellungen (/config) | «Einstellungen gespeichert. Absender, Verwaltungspauschale, Fristen und Vorschläge gespeichert.» wird angesagt (die Status-Region steht schon vorher leer da und bekommt dann den Text). Aber der Fokus fällt nach dem Speichern auf den Seitenanfang (body): Der nächste Tab landet auf «Zum Inhalt springen», nicht in der Nähe von «Einstellungen speichern». Gleichzeitig sagt die Seite «Einstellungen - Dwello» assertiv an, wie bei einem Seitenwechsel; das klingt, als sei die Seite neu geladen worden, und kann die höfliche Speichermeldung überdecken. |

## Beobachtungen

- Schritt «Wohnung», Fehler von Anfang an: Solange ich noch keine Wohnung gewählt habe, sagt das Feld «Wohnung» nur den Hilfetext. Die Optionen heissen dann alle «… (nicht geprüft)», ohne dass erklärt wird, was nicht geprüft ist. Erst nach der Wahl von 2.02 kommt die Erklärung. Hat mich nicht aufgehalten.
- Schritt «Wohnung», nach der Wahl von 2.02: Die Status-Region unter dem Feld (vorher leer) bekommt «Überschneidung noch nicht geprüft. Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen» …» – das wird angesagt, ohne dass der Fokus sich bewegt. Das Feld «Wohnung» hat den Hinweis zusätzlich in seiner Beschreibung, vor dem Hilfetext. Gut.
- Schritt 3 heisst in der App «Vertragsdauer», nicht «Zeitraum». Fokus landet nach «Weiter» auf der Überschrift «Schritt 3 von 5: Vertragsdauer». Das Feld «Vertragsbeginn» sagt als Beschreibung zuerst den ganzen Hinweis (rund 40 Wörter), dann «Erster Tag des Mietverhältnisses. Format TT.MM.JJJJ …». Lang, aber vollständig; das Format kommt erst am Schluss.
- «Erneut versuchen» erfolgreich: Im Assistenten geht der Fokus auf die Überschrift des Schritts, in «Mietvertrag bearbeiten» auf das Feld «Vertragsbeginn». Beides ist ein sinnvoller Ort, nur verschieden. «Die Mietverträge der Wohnung sind geladen.» wird jeweils angesagt. Auf Schritt «Wohnung» kommt danach zusätzlich der Hinweis, dass Marco Bernasconi schon einen Mietvertrag ohne Vertragsende hat; der war während des Fehlers nicht da.
- «Erneut versuchen» lädt im Assistenten die Mietverträge aller 13 Wohnungen neu, nicht nur die von 2.02 (aus den Netzwerk-Requests gesehen).
- «Mietvertrag bearbeiten» (Anna Schmidt, 1.02): Der volle Hinweis mit «Erneut versuchen» steht einmal bei «Wohnung 1.02 · Musterhaus Zentrum» (Status-Region, beim Laden befüllt und damit angesagt). «Vertragsbeginn» hat als Beschreibung nur «Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.» Das ist kurz und genügt mir; «oben» ist eine optische Richtung, aber «Erneut versuchen» liegt beim Tabben wirklich vor dem Feld (Tab-Stopp 21, Feld 22). Die Überschrift «Überschneidung noch nicht geprüft» beim Feld ist nur ein Absatz, nicht Teil der Beschreibung.
- In der Fehler-Situation überdeckt die rote Meldung unten rechts optisch die Schaltfläche «Weiter» (Screenshot); für mich ohne Folgen, für Sehende vielleicht schon.
- Die Meldung «Noch nicht gespeichert: Dwello bewahrt Ihre Angaben nur in diesem Browser auf. Stand: …» wird bei jeder Eingabe im Assistenten neu angesagt (Status-Region); das ist häufig, aber kurz.

## Aufgabe geschafft: ja

(Teil «Fehler erst nach Weiter auf Schritt Wohnung» nur teilweise, siehe Ablauf und Nicht geprüft.)

## Aufwand

Etwa 30 Minuten, 15 Skriptläufe; pro Durchgang durch den Assistenten etwa 10 Tastendrücke bis Schritt 3, in «Mietvertrag bearbeiten» 21 Tabs bis «Erneut versuchen».

## Ablauf

- Variante «Fehler erst nach Weiter auf Schritt Wohnung»: Erwartet, dass der Hinweis auf Schritt «Vertragsdauer» erscheint. Gesehen: Dwello lädt die Mietverträge aller Wohnungen schon beim Öffnen des Assistenten; nach «Weiter» auf Schritt «Wohnung» geht kein Request mehr raus, also gibt es nichts, was fehlschlagen kann. Schritt 3 zeigt keinen Hinweis, «Vertragsbeginn» hat nur den Format-Hilfetext. Das ist richtig, weil die Prüfung ja geklappt hat.
- Ersatzweise habe ich den Hinweis auf Schritt 3 durch «Erneut versuchen» bei weiter bestehendem Fehler «neu erscheinen» lassen: Erwartet, dass ich höre, dass es wieder nicht ging. Gesehen: eine neue `alert`-Meldung «… konnten wieder nicht geladen werden. Versuchen Sie es später erneut; Ihre Eingaben bleiben erhalten.», Fokus bleibt auf «Erneut versuchen». Gut. Beim nächsten, erfolgreichen Versuch bleibt diese Meldung stehen (P-1).
- Seite auf Schritt 3 neu geladen (mit Fehler): Erwartet, auf Schritt 3 mit dem Hinweis zu landen. Gesehen: Dwello startet wieder bei Schritt 1, mit «Angaben wiederhergestellt …» und «Angaben verwerfen» im Fokus. Dort habe ich abgebrochen.
- Einstellungen speichern: Erwartet, dass der Fokus auf oder bei «Einstellungen speichern» bleibt. Gesehen: Fokus auf body, nächster Tab «Zum Inhalt springen» (P-2).
- Wenn ein Request im Assistenten noch hängt (ich habe ihn testweise zurückgehalten), steht auf Schritt «Wohnung» nur «Es wird geprüft, welche Wohnungen frei sind …» und «Bitte warten …» (deaktiviert); das Feld «Wohnung» ist dann nicht da. Der Fokus springt von der Überschrift direkt zu «Zurück».

## Vorschläge

- P-1: Neuer Mietvertrag, Mieter wählen, Wohnung 2.02, Request schlägt fehl, auf Schritt «Vertragsdauer» «Erneut versuchen» (schlägt wieder fehl), Request wieder zulassen, nochmals «Erneut versuchen». Die alert-Meldung «… wieder nicht geladen …» bleibt im Baum und auf dem Bildschirm. Hilfreich: Fehlermeldung entfernen, sobald das Laden klappt (oder durch die Erfolgsmeldung ersetzen).
- P-2: /config öffnen, zu «Einstellungen speichern» tabben, Enter. Meldung kommt, Fokus ist auf body, nächster Tab «Zum Inhalt springen». Hilfreich: Fokus auf «Einstellungen speichern» lassen (oder auf die Meldung setzen) und beim Speichern keinen Seitentitel ansagen.

## Nicht geprüft

- Echte Sprachausgabe (NVDA, JAWS, VoiceOver): ich habe nur den Accessibility-Tree und die Änderungen der Live-Regionen gelesen. Ob die höfliche Meldung nach «Einstellungen gespeichert» neben der assertiven Titelansage wirklich gesprochen wird, kann ich so nicht sagen.
- Hinweis, der auf Schritt «Vertragsdauer» zum ersten Mal erscheint: geht nicht, weil nach «Weiter» kein Request mehr kommt. Versucht: Fehler erst nach «Weiter» (kein Request), Request zurückhalten bis nach «Weiter» (der Assistent wartet dann auf Schritt «Wohnung» mit «Bitte warten …»), Seite auf Schritt 3 neu laden (startet bei Schritt 1).
- Hinweis: Die Einstellungen habe ich zweimal unverändert gespeichert (der zweite Lauf, um den Fokus nach dem Speichern zu prüfen); den Mietvertrag von Anna Schmidt habe ich nicht gespeichert, im Assistenten keinen Mietvertrag angelegt.

## Triage (w-665)

- P-1: → #669 (the contracts-retry toasts); stays open there.
- P-2: on the base commit too (focus and title after saving /config); stays in this report.
- The case «request fails after «Weiter»» cannot happen since #468 (code review b665 C-1).
