# Persona-Review Anna – #580 «Einstellungen» › «KI» (/config/ki)

Anna, 29, vermietet zum ersten Mal und kommt nach Monaten zurück. Desktop 1440 × 900, Maus; die KI-Seite zusätzlich auf dem Handy (390 × 844). Persona-Stack mit Demodaten auf http://localhost:3300. Nur geschaut: «KI speichern» und «KI-Modell herunterladen» habe ich nicht gedrückt, «Verbindung prüfen» schon (das speichert nichts).

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-580/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | KI, Hinweis unter «KI speichern» | «Die lokale KI antwortet nicht. Läuft Dwello mit Docker, startet der Betreiber sie mit der Installationsanleitung; sonst wählen Sie einen Anbieter oder keine KI.» Ich weiss nicht, ob ich der «Betreiber» bin, was Docker ist oder wo die «Installationsanleitung» liegt (es gibt keinen Link). Der Hinweis sagt nicht, was das für meine Rechnungen heisst (geht «Rechnungen hochladen» jetzt noch?). Daneben steht der Knopf «KI-Modell herunterladen». Ich verstehe nicht, warum ich etwas herunterladen soll, wenn die KI gar nicht antwortet, und ob der Knopf das Problem löst. |
| P-2 | Minor | KI | Nirgends steht, welche KI *jetzt* aktiv ist. Ich schliesse es nur daraus, dass «Lokale KI auf diesem Server» vorausgewählt ist. Wenn ich auf eine andere Option klicke, sieht die Seite gleich aus wie eine gespeicherte Wahl. Ein Satz wie «Zurzeit verwendet Dwello: …» fehlt. |
| P-3 | Minor | KI, «Keine KI» bzw. «KI eines Anbieters» ausgewählt | Der gelbe Hinweis «Die lokale KI antwortet nicht …» bleibt stehen, auch wenn ich «Keine KI» oder «KI eines Anbieters» wähle (Screenshots 05, 06). Er steht ausserdem unter dem Hauptknopf und nicht bei der Option «Lokale KI». Ich habe ihn darum erst nach dem Knopf gelesen. |
| P-4 | Minor | Weg dorthin (Rechnungen, «Rechnungen hochladen», Hilfe, Seitenleiste) | Ich habe zuerst bei «Rechnungen» gesucht. Weder die Liste noch der Dialog «Rechnungen hochladen» («Die KI liest die Angaben aus …») noch die Hilfe verlinken die KI-Einstellung. Die Seitenleiste zeigt unter «Einstellungen und Hilfe» Kategorien, Verteilschlüssel und Heizprofile, aber nicht «KI». Der Einleitungssatz von «Einstellungen» erwähnt die KI nicht. Gefunden habe ich sie erst über die Kachel «KI» auf der Seite Einstellungen. |
| P-5 | Minor | KI eines Anbieters, «Verbindung prüfen» ohne Adresse | Mit leerem Feld «Adresse der KI» meldet die Seite «Unter dieser Adresse antwortet keine KI. Prüfen Sie die Adresse und ob der Server das Internet erreicht.» Ich habe aber gar keine Adresse eingegeben. Die Seite sollte sagen, dass die Adresse fehlt. |
| P-6 | Minor | KI eines Anbieters, Checkliste und «Verbindung prüfen» | Wozu «Verbindung prüfen» dient und wann ich es brauche, steht nirgends. Ebenso unklar ist, ob das Häkchen «Ich habe diese drei Punkte … geprüft.» für «Verbindung prüfen» oder für «KI speichern» gilt. Die Prüfung läuft auch ohne Häkchen. Ob ich vor dem Speichern prüfen muss, sagt die Seite nicht. |
| P-7 | Nit | KI | Zweimal die Überschrift «KI» direkt untereinander (Seitentitel und Kartentitel). |

## Beobachtungen

- Die drei Optionen sagen klar, wohin meine Daten gehen: «verlassen den Server nicht» und «gehen an den Anbieter, auch Namen und Adressen darin». Das hat mir die Wahl am meisten erleichtert.
- «Keine KI – Sie erfassen Rechnungen von Hand.» Ob «Rechnungen hochladen» dann ganz wegfällt oder ob ich die Dateien trotzdem hochladen kann, steht nicht da.
- Bei «Lokale KI» steht «braucht rund 16 GB Arbeitsspeicher». Ich weiss nicht, wie viel Arbeitsspeicher mein Server hat, und auch nicht, wo ich das nachsehen könnte.
- Fachwörter, die ich nicht kenne: «OpenAI-kompatible Schnittstelle», «Modell» (das Feld will einen Namen, aber welchen?), «API-Schlüssel», «Betreiber», «Docker». Die Checkliste nennt «Art. 9 DSG», «Art. 16 Abs. 1 DSG» und das «Swiss-U.S. Data Privacy Framework». Der Satz «Das ist eine Checkliste, keine Rechtsberatung.» ist ehrlich, aber allein kann ich die drei Punkte nicht prüfen.
- Mit der Adresse des Stand-ins (`http://localhost:2528/v1`) und leerem «API-Schlüssel (optional)» kam «Der Anbieter lehnt den API-Schlüssel ab. Prüfen Sie den Schlüssel in Ihrem Konto beim Anbieter und geben Sie ihn erneut ein.» Das ist die Antwort des Stand-ins. Trotzdem wirkt es seltsam, dass ein *optionaler* leerer Schlüssel «erneut eingegeben» werden soll.
- Mobile 390 px: kein seitliches Scrollen (scrollWidth 390). Die Optionen sind gut lesbar, der Hinweis liegt auch hier unter dem Knopf.
- Die Seite stellt beim Laden keine Anfrage an andere Server; «Verbindung prüfen» schickt ein POST an `/config/ki?/check`.

## Aufgabe geschafft: teilweise

Die Seite habe ich gefunden, und die drei Optionen verstehe ich. Welche KI jetzt aktiv ist und was ich gegen «Die lokale KI antwortet nicht» tun soll, verstehe ich nicht.

## Aufwand

Etwa 4 Minuten und 5 Schritte bis zur Seite: Übersicht → Rechnungen (Sackgasse) → Seitenleiste «Einstellungen» → lange Seite überfliegen → Kachel «KI». Für das Lesen und Ausprobieren auf der Seite brauchte ich weitere 6 Minuten.

## Ablauf

1. **Übersicht.** Erwartet: einen Hinweis auf die KI, falls sie nicht läuft. Gesehen: «Als Nächstes zu tun» spricht nur von Abrechnungen, zur KI steht nichts.
2. **Rechnungen** (mein erster Versuch, weil «die KI Rechnungen liest»). Erwartet: einen Link oder Satz zur KI. Gesehen: Filter und Liste, bei den Rechnungen «Manuell», nichts zur KI. Der Dialog «Rechnungen hochladen» sagt «Die KI liest die Angaben aus», verlinkt aber nicht die Einstellung.
3. **Seitenleiste.** Erwartet: einen Punkt «KI» neben Kategorien, Verteilschlüssel und Heizprofile. Gesehen: keinen. Ich habe «Einstellungen» gewählt.
4. **Einstellungen.** Oben stehen die Kacheln Kategorien, Verteilschlüssel, Heizprofile, «KI – Lokale KI, KI eines Anbieters oder keine KI» und Protokoll. Gefunden.
5. **KI** (Screenshot 04). Erwartet: «Zurzeit aktiv: …» und ob alles läuft. Gesehen: «Lokale KI auf diesem Server» ist ausgewählt. Unter «KI speichern» steht der gelbe Hinweis «Die lokale KI antwortet nicht …» mit dem Knopf «KI-Modell herunterladen». Daraus verstehe ich nur, dass etwas nicht geht, aber nicht, was ich tun soll.
6. **«KI eines Anbieters» angeklickt** (Screenshot 05). Erwartet: Felder für den Anbieter. Gesehen: Adresse, API-Schlüssel (optional), Modell, Name und Land des Anbieters, die Checkliste «Bevor Sie einen Anbieter wählen» mit drei Punkten, das Häkchen und «Verbindung prüfen». Der Hinweis zur lokalen KI steht immer noch da.
7. **«Verbindung prüfen» ohne Eingaben** (07). Erwartet: «Geben Sie die Adresse ein». Gesehen: «Unter dieser Adresse antwortet keine KI …».
8. **Mit falscher Adresse, mit und ohne Häkchen** (08). Beide Male kam dieselbe Meldung. Das Häkchen ändert an der Prüfung nichts.
9. **«Keine KI» angeklickt** (06). Die Anbieter-Felder verschwinden, der Hinweis «Die lokale KI antwortet nicht» bleibt.
10. **Handy** (10, 11). Die Seite ist nur über das Menü erreichbar, die KI-Seite passt in die Breite.

## Verwirrung

- «Betreiber»: Bin das ich? Ich habe Dwello ja selbst eingerichtet, oder hat das jemand für mich gemacht?
- «Installationsanleitung»: Wo finde ich sie? Die Seite verlinkt sie nicht.
- «KI-Modell herunterladen» neben «antwortet nicht»: Löst der Download das Problem? 6 GB, wie lange dauert das, und kann ich währenddessen weiterarbeiten?
- «Verbindung prüfen»: Prüft das meine Eingaben oder schon den Datenschutz? Muss ich das vor dem Speichern tun?
- «Modell»: Was trage ich da ein? Der Hilfetext sagt nur, dass es «Bilder liest».
- Welche KI ist jetzt aktiv: Ist die Vorauswahl der gespeicherte Zustand oder eine Empfehlung?

## Fehlerrisiken

- Ich drücke «KI-Modell herunterladen», obwohl die lokale KI gar nicht läuft, und warte vergeblich. Oder ich wähle in Panik einen Anbieter und schicke Mieternamen ins Ausland, nur weil der gelbe Hinweis bei jeder Wahl stehen bleibt.
- Ich setze das Häkchen bei der Checkliste, ohne die drei Punkte wirklich prüfen zu können, weil ich die Begriffe nicht verstehe.
- Ich klicke eine Option an, verlasse die Seite ohne zu speichern und glaube, die KI sei umgestellt. Die Seite unterscheidet «gewählt» nicht von «gespeichert».

## Vorschläge

- **P-1:** /config/ki öffnen, während die lokale KI nicht antwortet. Der Hinweis sollte sagen, was das für Rechnungen heisst (zum Beispiel «Hochgeladene Rechnungen werden nicht ausgelesen»). Er sollte die Installationsanleitung verlinken oder den Begriff «Betreiber» erklären. Zum Knopf «KI-Modell herunterladen» gehört ein Satz, wann er hilft (zum Beispiel «wenn die lokale KI läuft, aber das Modell fehlt»). Hilft er in diesem Zustand nicht, sollte er hier nicht erscheinen.
- **P-2:** /config/ki öffnen. Über den Optionen einen Satz wie «Zurzeit verwendet Dwello: Lokale KI auf diesem Server» anzeigen und nach dem Speichern aktualisieren. Zeigen, wenn eine Wahl noch nicht gespeichert ist.
- **P-3:** /config/ki öffnen und «Keine KI» anklicken: Der Hinweis zur lokalen KI bleibt. Ihn nur zeigen, solange «Lokale KI» gewählt ist, und ihn direkt unter diese Option setzen, vor «KI speichern».
- **P-4:** Übersicht → Rechnungen → «Rechnungen hochladen»: kein Weg zur KI. Im Upload-Dialog und in der Hilfe auf «Einstellungen › KI» verlinken und «KI» in der Seitenleiste neben den anderen Einstellungsseiten aufführen. Den Einleitungssatz von «Einstellungen» um die KI ergänzen.
- **P-5:** /config/ki → «KI eines Anbieters» → «Verbindung prüfen» mit leerer Adresse. Statt der Antwortmeldung «Geben Sie die Adresse der KI ein.» am Feld zeigen.
- **P-6:** /config/ki → «KI eines Anbieters». Beim Knopf einen Satz wie «Prüft, ob Dwello mit Adresse, Schlüssel und Modell eine Antwort bekommt. Speichert nichts.» Zur Checkliste sagen, dass das Häkchen für «KI speichern» nötig ist (falls es so ist).
- **P-7:** Den Kartentitel «KI» weglassen oder in «Welche KI» umbenennen.

## Nicht geprüft

- «KI speichern»: Laut Auftrag nicht gedrückt, weil eine andere Persona auf dieser Seite speichert. Darum weiss ich nicht, ob Speichern ohne Häkchen abgelehnt wird oder ob nach dem Speichern «aktiv» angezeigt wird.
- «KI-Modell herunterladen»: Nicht gedrückt, weil der Download den geteilten Server verändert. Wie die Seite den Zustand während und nach dem Download zeigt, ist offen.
- Eine erfolgreiche «Verbindung prüfen»: Der Stand-in lehnte den leeren Schlüssel ab, eine echte Anbieter-Adresse habe ich nicht verwendet (externer Dienst).
- Ob das Hochladen von Rechnungen mit der aktuellen Einstellung tatsächlich funktioniert: nicht ausprobiert, weil ich auf keinem Gebäude speichern sollte.

## Zweiter Durchgang

Nur der Bildschirm von P-1: «Einstellungen» › «KI» (/config/ki). Neu gebauter Persona-Stack, die lokale KI antwortet nicht. Desktop 1440 × 900 mit Maus, kurz auch auf dem Handy (390 × 844). «KI speichern» habe ich nicht gedrückt. Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-580-r2/`.

**Status P-1: geschlossen.** Der neue Hinweis lautet wörtlich: «Die lokale KI antwortet nicht. Bis sie antwortet, erfassen Sie Rechnungen von Hand. Betreiben Sie Dwello selbst, starten Sie die lokale KI, wie die Installationsanleitung beschreibt; sonst wenden Sie sich an den Betreiber oder wählen oben einen Anbieter oder keine KI.» Jetzt weiss ich, was das für meine Rechnungen heisst: Ich erfasse sie von Hand, bis die KI wieder antwortet. Ich weiss auch, wer etwas tun kann. Habe ich Dwello selbst eingerichtet, starte ich die KI. Hat das jemand anderes gemacht, frage ich diese Person. Oder ich wähle oben eine andere Option. Mit «Betreiben Sie Dwello selbst» kann ich die Frage «Bin ich der Betreiber?» selbst beantworten. Der Knopf «KI-Modell herunterladen» steht in diesem Zustand nicht mehr da, damit ist auch meine Verwirrung um den Download weg. Offen bleibt nur, wo die Installationsanleitung liegt (P-8). Das ist eine kleinere Lücke, denn der Weg über den Betreiber oder über eine andere Option bleibt mir.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-8 | Minor | KI, Hinweis «Die lokale KI antwortet nicht.» | «… starten Sie die lokale KI, wie die Installationsanleitung beschreibt …»: Die Seite verlinkt die Anleitung nicht und sagt auch nicht, wo sie liegt. Im Hauptbereich gibt es keinen einzigen Link. Wer Dwello selbst betreibt und nach Monaten zurückkommt, weiss nicht, wo er die Anleitung suchen soll. |
| P-9 | Nit | KI eines Anbieters, Feld «Land, in dem der Anbieter die Daten bearbeitet» | Der Hilfetext sagt, was das Feld will: «Das Land, in dem die Rechenzentren des Anbieters stehen.» Wo ich das erfahre, sagt er nicht, zum Beispiel «steht im Vertrag oder auf der Datenschutzseite des Anbieters». Beim Feld «Name des Anbieters» ist das gelöst («wie er im Vertrag mit ihr steht»). |

### Ablauf

1. **/config/ki öffnen** (Screenshot 01-ki-lokal.png). Erwartet: ein Hinweis, der sagt, was mit meinen Rechnungen passiert und was ich tun kann. Gesehen: «Lokale KI auf diesem Server» ist ausgewählt. Unter «KI speichern» steht ein gelber Kasten mit Warndreieck und dem Text oben. Kein Download-Knopf, kein Link. Den Hinweis verstehe ich beim ersten Lesen.
2. **«Keine KI» angeklickt, ohne zu speichern** (02-keine.png). Erwartet: Der Hinweis verschwindet. Gesehen: Er verschwindet, unter «KI speichern» steht nichts mehr.
3. **«KI eines Anbieters» angeklickt** (03-anbieter.png). Erwartet: kein Hinweis zur lokalen KI und verständliche Hilfetexte. Gesehen: kein Hinweis. Die Hilfetexte der beiden Felder:
   - «Name des Anbieters»: «Der Name der Firma, wie er im Vertrag mit ihr steht. Die Datenschutzerklärung nennt ihn. Bearbeiten mehrere Firmen die Daten, nennen Sie alle, mit Komma getrennt.» Das ist klar. Ich schreibe den Firmennamen aus dem Vertrag hinein und weiss jetzt auch, wozu er dient.
   - «Land, in dem der Anbieter die Daten bearbeitet»: «Das Land, in dem die Rechenzentren des Anbieters stehen. Die Datenschutzerklärung nennt es. Bearbeiten Rechenzentren in mehreren Ländern die Daten, nennen Sie alle, mit Komma getrennt.» Was das Feld will, ist jetzt klar. Wo ich die Angabe finde, steht nicht da (P-9).
4. **Zurück auf «Lokale KI auf diesem Server»** (04-zurueck-lokal.png). Erwartet: Der Hinweis kommt wieder. Gesehen: Er kommt wieder, mit demselben Text.
5. **Handy 390 × 844** (05-mobile.png). Kein seitliches Scrollen (scrollWidth 390).

### Beobachtungen

- P-3 aus dem ersten Durchgang ist zum Teil erledigt: Der Hinweis erscheint nur noch, solange «Lokale KI» gewählt ist. Er steht aber weiterhin unter «KI speichern» und nicht bei der Option. Ich lese ihn erst nach dem Knopf.
- «wählen oben einen Anbieter oder keine KI»: Das «oben» hilft, weil der Hinweis unter dem Knopf steht. Stünde er bei der Option, bräuchte es das «oben» nicht.
- P-2 bleibt unverändert: Ob «Lokale KI» die gespeicherte Wahl ist, sagt die Seite weiterhin nicht. Der Hinweis «antwortet nicht» lässt mich das nur vermuten.
- P-6 (wozu «Verbindung prüfen» dient) und P-7 (zweimal «KI» als Überschrift) sind unverändert. Sie gehörten nicht zu diesem Auftrag.

### Aufgabe geschafft: ja

Den Hinweis verstehe ich: Meine Rechnungen erfasse ich vorerst von Hand. Wer Dwello betreibt, startet die KI; ich kann auch eine andere Option wählen. Beim Wechsel der Option verschwindet der Hinweis, und die beiden Hilfetexte sagen, was die Felder wollen.

### Aufwand

Etwa 2 Minuten, 5 Schritte (öffnen, drei Optionen anklicken, Handy).

### Verwirrung

- «Installationsanleitung»: Wo finde ich sie? (P-8)
- «Rechenzentren»: Ich verstehe das Wort. Wo ich nachlese, in welchem Land sie stehen, weiss ich nicht. (P-9)

### Fehlerrisiken

- Wer Dwello selbst betreibt, findet die Anleitung nicht. Dann wählt er vielleicht aus Bequemlichkeit «KI eines Anbieters» und schickt Mieterdaten an einen Anbieter, obwohl die lokale KI mit der Anleitung zu starten wäre.
- Ich trage beim Land den Firmensitz ein (etwa «USA», weil die Firma dort sitzt) statt des Orts der Rechenzentren, weil ich nicht weiss, wo diese Angabe steht.

### Vorschläge

- **P-8:** /config/ki öffnen, während die lokale KI nicht antwortet. Im Hinweis «Installationsanleitung» als Link setzen oder sagen, wo sie liegt (zum Beispiel «in der Hilfe unter …»).
- **P-9:** /config/ki → «KI eines Anbieters». Den Hilfetext beim Land um die Quelle ergänzen, etwa «Sie finden es im Vertrag oder in der Datenschutzerklärung des Anbieters.»

### Nicht geprüft

- «KI speichern»: laut Auftrag nicht gedrückt.
- Ob das Hochladen von Rechnungen in diesem Zustand wirklich zur Erfassung von Hand führt: nicht ausprobiert, weil ich kein Gebäude zum Speichern bekommen habe.
- Den Hinweis in fr/it/en habe ich nicht angesehen, weil die Sprache am Konto gespeichert ist und andere Personas gleichzeitig laufen.
