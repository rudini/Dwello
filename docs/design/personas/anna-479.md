# Anna, 29: Einfamilienhaus aus dem Gebäuderegister erfassen (#479)

Persona: Anna, 29, vermietet zum ersten Mal, kommt nach Monaten zurück und weiss nichts mehr. Desktop 1440 × 900, Maus; Suchfeld mit Warnung zusätzlich auf dem Handy 390 × 844.
Aufgabe: Ab der Übersicht herausfinden, wie ich mein Einfamilienhaus «Rautistrasse 150, 8047 Zürich» erfasse, es mit dem übernehmen, was das Register weiss, und speichern. Dazu eine Suche ohne Treffer (Tippfehler) ausprobieren.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/anna-479/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Neues Gebäude, «Adresse suchen» | Jede Suche endet mit «Das Gebäuderegister ist gerade nicht erreichbar.» Die App antwortet auf `GET /api/addresses?q=…` mit 502 `{"error":"unreachable"}`, auch beim Beispiel aus dem Hilfetext («Seebahnstrasse 155 Zürich»). Dieselbe Maschine erreicht geo.admin.ch über den Proxy (curl: 200). Der Kern der Änderung, das Gebäude samt Wohnungen aus dem Register übernehmen, liess sich darum nicht ausprobieren. Die Ursache liegt wahrscheinlich im Persona-Stack (der App-Server geht nicht über den Proxy) und nicht in der App. Das muss der Aufrufer prüfen. |
| P-2 | Minor | Neues Gebäude | Der Pflichtname «Gebäudename» steht über der Suche. Die Seite sagt «Suchen Sie die Adresse», also habe ich direkt dort angefangen und den Namen vergessen. Den Fehler «Gebäudename ist erforderlich.» sehe ich erst nach dem Klick auf «Gebäude erfassen» (immerhin landet der Fokus dann im Feld). |
| P-3 | Minor | Neues Gebäude, Kanton | Der Hilfetext zum Kanton lautet nur «Wird mit der Adresssuche ausgefüllt.» Nach der gescheiterten Suche musste ich ihn selbst wählen, und der Text sagt mir nicht, dass ich das darf oder muss. |
| P-4 | Nit | Neues Gebäude | Die Einleitung sagt «Suchen Sie die Adresse», das Feld heisst aber «Adresse suchen (optional)». Das ist nicht falsch, aber ich war kurz unsicher, ob die Suche nun der Weg ist oder nur eine Möglichkeit. |

## Beobachtungen

- Auf der Übersicht steht bei «Häufige Arbeiten» kein «Gebäude erfassen» (nur Mieter, Mietvertrag, Rechnung, Rechnungen hochladen, Abrechnungen). Den Weg fand ich über «Gebäude» in der Navigation oder über den Link «3 Gebäude». Für eine Erstvermieterin mit ihrem ersten Haus wäre das der erste Schritt.
- In der Gebäudeliste steht der Button «Gebäude erfassen» gut sichtbar oben, die Seite dahinter heisst «Neues Gebäude». Das hat gepasst.
- Die Warnung bei nicht erreichbarem Register ist gut: gelber Kasten mit Symbol, direkt unter dem Suchfeld, mit Handlungsanweisung («Erfassen Sie das Gebäude von Hand oder versuchen Sie es später.»). Auf dem Handy bricht sie sauber um, es gibt kein seitliches Scrollen (scrollWidth 390).
- Enter im Suchfeld schickt das Formular nicht ab. Das ist gut, ich hätte sonst ein halbes Gebäude gespeichert.
- Nach dem Speichern komme ich auf die Gebäudeseite mit der Meldung «Gebäude «Einfamilienhaus Rautistrasse» gespeichert», Adresse «Rautistrasse 150, 8047 Zürich (ZH)», Typ Einfamilienhaus, «Noch keine Wohnungen» und einem klaren «Wohnung erfassen». Den nächsten Schritt wusste ich sofort.
- Der lange Block «Tankbestand» erscheint auf der Gebäudeseite direkt unter den Wohnungen, auch bei meinem Haus, bei dem ich noch gar nicht weiss, wie es heizt. Das wirkt für den Anfang viel.

## Aufgabe geschafft: teilweise

Das Haus ist erfasst und gespeichert (`/buildings/e1110dac-6a28-48a0-9295-2ec2590875dd`), aber von Hand und ohne Wohnung. «Mit dem übernehmen, was das Register weiss» ging nicht: Nach drei Versuchen an der Registersuche kam jedes Mal «nicht erreichbar» (P-1). Den Fall «Suche ohne Treffer» konnte ich deshalb auch nicht sehen.

## Aufwand

Etwa 6 bis 8 Minuten. Rund 12 Schritte: Übersicht, Navigation «Gebäude», «Gebäude erfassen», drei Registersuchen, eine Suche mit Tippfehler, Adresse, PLZ, Ort, Kanton und Typ von Hand, Speichern ohne Namen (Fehler), Name nachtragen, Speichern.

## Ablauf

1. **Übersicht.** Erwartet: ein Knopf «Gebäude erfassen» oder ein Hinweis für ein neues Haus. Gesehen: «Als Nächstes zu tun» dreht sich um Abrechnungen, bei «Häufige Arbeiten» fehlt das Gebäude. Ich nahm «Gebäude» in der linken Navigation.
2. **Gebäude.** Erwartet: Liste und ein Knopf zum Hinzufügen. Gesehen: drei Demo-Gebäude und oben «Gebäude erfassen». Klar.
3. **Neues Gebäude.** Erwartet: ein Formular. Gesehen: Die Einleitung erklärt, dass Dwello Gebäude und Wohnungen aus dem Gebäuderegister übernimmt, und ohne Treffer von Hand. Das hat mir gefallen, so wusste ich, was mich erwartet. Ganz oben steht der Gebäudename, darunter «Adresse suchen (optional)» mit dem Beispiel «Seebahnstrasse 155 Zürich» (Screenshot `03-neu.png`).
4. **Suche «Rautistrasse 150 Zürich».** Erwartet: eine Trefferliste unter dem Feld. Gesehen: die Warnung «Das Gebäuderegister ist gerade nicht erreichbar. …». Netzwerk: `GET /api/addresses?q=Rautistrasse+150+Z%C3%BCrich` gibt 502 zurück.
5. **Nochmals mit «Rautistrasse 150», dem Beispiel «Seebahnstrasse 155 Zürich» und «Rautistrasse 150 8047 Zürich».** Erwartet: wenigstens beim Beispiel ein Treffer. Gesehen: immer 502 und dieselbe Warnung. Damit war die dritte Wiederholung an diesem Schritt erreicht.
6. **Tippfehler «Rautisrasse 150 Zürich».** Erwartet: «Keine Adresse gefunden» mit einem Hinweis, was ich tun soll. Gesehen: wieder «nicht erreichbar» (Screenshot `05-tippfehler.png`; Handy: `08-mobil.png`). Was ich bei der Warnung tun soll, wusste ich: von Hand weiter. Wie der echte Fall ohne Treffer aussieht, weiss ich nicht.
7. **Von Hand.** Strasse und Hausnummer, PLZ 8047, Ort Zürich, Kanton Zürich (ZH), Gebäudetyp Einfamilienhaus, dann «Gebäude erfassen». Erwartet: gespeichert. Gesehen: Ich blieb auf der Seite, der Gebäudename war rot markiert mit «Gebäudename ist erforderlich.», und der Fokus stand im Feld (`06-ohne-name.png`). Die übrigen Eingaben waren noch da.
8. **Name «Einfamilienhaus Rautistrasse» nachgetragen und gespeichert.** Erwartet: Bestätigung und ein nächster Schritt. Gesehen: die Gebäudeseite mit der Meldung «gespeichert», den richtigen Angaben, 0 Wohnungen und «Wohnung erfassen» (`07-nach-speichern.png`).

## Verwirrung

- «GWR» bzw. «eidgenössisches Gebäude- und Wohnungsregister»: Durch den Satz daneben verstehe ich es ungefähr («da steht mein Haus drin»). Woher die Daten stammen und ob sie stimmen, weiss ich nicht.
- «optional» bei der Suche gegenüber «Suchen Sie die Adresse» in der Einleitung (P-4).
- Kanton «Wird mit der Adresssuche ausgefüllt»: Darf ich ihn selbst wählen? (P-3)
- «Kein Tank oder Tank stillgelegt» auf der Seite «Neues Gebäude»: Bei einem frisch gekauften Haus weiss ich das noch nicht. Der Text ist lang, aber verständlich.

## Fehlerrisiken

- Ohne Register lege ich ein Einfamilienhaus ohne Wohnung an. Die Seite danach sagt zwar «Wohnung erfassen», aber bei einem Einfamilienhaus denke ich nicht unbedingt an eine «Wohnung». Ich hätte vermutlich direkt einen Mieter erfasst und wäre dann beim Mietvertrag hängen geblieben.
- Den Pflichtnamen vergisst man leicht, wenn man mit der Suche beginnt (P-2). Es geht nichts verloren, aber es kostet einen Umweg.
- Wenn das Register nur manchmal nicht erreichbar ist, erfasse ich von Hand und verpasse die Übernahme der Wohnungen, ohne es zu merken.

## Vorschläge

- **P-1:** Reproduktion: `/buildings/new`, «Rautistrasse 150 Zürich» oder «Seebahnstrasse 155 Zürich» in «Adresse suchen» tippen, dann erscheint die Warnung, und im Netzwerk gibt `/api/addresses` 502 `{"error":"unreachable"}` zurück. Zur Gegenprobe gibt `curl` auf `api3.geo.admin.ch/rest/services/api/SearchServer` von derselben Maschine 200 zurück. Hilfreich: prüfen, ob der Persona-Server den HTTPS-Proxy nutzt (Umgebung), und den Lauf mit erreichbarem Register wiederholen. Erst dann lassen sich Übernahme, Wohnungen und der Fall ohne Treffer beurteilen.
- **P-2:** Reproduktion: Adresse von Hand ausfüllen, Gebäudename leer lassen, «Gebäude erfassen» klicken. Hilfreich: Name unter die Adresse setzen oder bei einem Registertreffer einen Vorschlag einfüllen (z. B. die Strasse), damit die Suche wirklich der erste Schritt ist.
- **P-3:** Reproduktion: Suche scheitert, und der Kanton steht auf «Kanton wählen» mit dem Text «Wird mit der Adresssuche ausgefüllt.» Hilfreich: «Wird mit der Adresssuche ausgefüllt. Ohne Treffer wählen Sie ihn selbst.»
- **P-4:** Hilfreich: «optional» weglassen oder die Einleitung angleichen, etwa «Suchen Sie zuerst die Adresse».

## Nicht geprüft

- Trefferliste, Auswahl eines Treffers und die Übernahme von Gebäude und Wohnungen aus dem Register: Das Register war für die App nicht erreichbar (P-1).
- Die echte Meldung «keine Treffer» bei einem Tippfehler: Auch dort kam nur «nicht erreichbar».
- Wie ein übernommenes Einfamilienhaus mit seiner einen Wohnung danach aussieht und ob der Gebäudename dabei vorgeschlagen wird.
- Den ganzen Ablauf auf dem Handy: Dort habe ich nur das Suchfeld mit der Warnung angesehen.
