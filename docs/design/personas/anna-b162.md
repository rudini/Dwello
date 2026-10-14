# Persona-Lauf: Anna, öffentliche Demo (b162)

Persona: Anna, 29, vermietet zum ersten Mal und kennt Dwello nicht. Eine Freundin hat mir den Link zur Demo geschickt.
Aufgabe: Was verstehe ich vor der Anmeldung auf der Anmeldeseite und aus dem Demo-Hinweis? Danach angemeldet ein paar Minuten herumschauen (Übersicht, Gebäude, ein Mieter). Verstehe ich, dass ich die Daten mit anderen teile und dass sie jede Nacht zurückgesetzt werden? Weiss ich, was ich ausprobieren darf?
Umgebung: http://localhost:3300 (DEMO=on), Desktop 1440 × 900, einzelne Seiten auf Mobile 390 × 844, Maus. Angemeldet mit dem Sitzungs-Cookie aus dem Persona-Kit (es zeigt «Vera Verwalter»). Ich habe nichts gespeichert. Beim Gebäude habe ich einmal «Löschen» angeklickt, um den Dialog zu sehen, und ihn mit «Abbrechen» geschlossen.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Anmeldung | Für die Demo brauche ich mein echtes Google-Konto, aber der Hinweis sagt «keine echten Namen». Ob andere Besucher meinen Namen oder meine E-Mail-Adresse sehen, steht nicht auf der Anmeldeseite, nur weiter unten im Datenschutz. |
| P-2 | Minor | Demo-Hinweis (alle Seiten) | Der Hinweis sagt, was ich nicht eingeben soll, aber nicht, was ich ausprobieren darf: Darf ich löschen, Abrechnungen erstellen, «Als versendet markieren»? |
| P-3 | Minor | Demo-Hinweis | «Beispieldaten» erklärt nicht, woher sie kommen. Sind Hans Müller und die anderen Mieter echte Personen? Dass die Adressen auf example.ch enden, merke ich nur, weil ich zufällig darauf achte. |
| P-4 | Minor | Demo-Hinweis, Abrechnung, Datenschutz | Ob die Demo wirklich E-Mails verschickt (Zahlungserinnerung, Mahnung), steht nirgends. Der Datenschutz beschreibt den Mailversand an Mieter so, als ob er auch hier läuft. |
| P-5 | Minor | Datenschutz | Der Text passt nicht zu dem, was ich sehe: Er nennt «Google oder Microsoft», die Anmeldung zeigt nur Google. Und er schreibt, dass Schriften von Google Fonts geladen werden, beim Laden der Übersicht ging aber keine Anfrage an einen fremden Server. |
| P-6 | Nit | Alle Seiten, besonders Mobile | Der gelbe Hinweis mit Warnsymbol steht auf jeder Seite über dem Seitentitel und lässt sich nicht schliessen. Auf dem Handy belegt er etwa 200 px, bevor «Mieter» kommt. |
| P-7 | Nit | Gebäude löschen (Dialog) | Steht im Dialog «Löschen nicht möglich», ist die Schaltfläche «Gebäude löschen» trotzdem sichtbar (blass). Ich habe kurz gezögert, ob ich sie anklicken kann. |

**Aufgabe geschafft:** ja. Die zwei Kernaussagen (gemeinsame Daten, jede Nacht zurückgesetzt) habe ich sofort verstanden. Was ich ausprobieren darf und was mit meinem Konto passiert, blieb offen.

**Aufwand:** etwa 8 Minuten, 12 Schritte (Anmeldeseite, Hilfe, Nutzungsbedingungen, Datenschutz, Übersicht, Benutzermenü, Gebäude, Gebäude «Musterhaus Zentrum», Löschen-Dialog, Mieter, Mieter «Hans Müller», Abrechnung von Hans Müller, Mieterliste auf dem Handy).

## Ablauf

1. **Link öffnen** (`/`, nicht angemeldet). Erwartet: eine Seite, die mir sagt, was Dwello ist und dass dies eine Demo ist. Gesehen: Weiterleitung auf «Anmelden». Ganz oben ein gelber Kasten «Öffentliche Demo»: «Alle Besucher sehen und ändern dieselben Daten. Jede Nacht werden alle Änderungen gelöscht und die Beispieldaten neu geladen. Geben Sie keine echten Namen, Adressen oder Beträge ein.» Darunter ein Haus-Symbol, «Dwello», «Anmelden» und «Mit Google anmelden». Den Hinweis verstehe ich: Andere sehen, was ich eingebe, und morgen ist alles weg. Was Dwello überhaupt macht, steht auf der Anmeldeseite nicht, erst in den Nutzungsbedingungen («unterstützt Liegenschaftsverwalter …»). Mit dem Link meiner Freundin geht das, ein Fremder wüsste es nicht.
2. **«Mit Google anmelden»** (nur angeschaut, nicht geklickt). Erwartet: ein Demo-Zugang ohne Konto. Gesehen: nur Google, «Melden Sie sich mit Ihrem bestehenden Konto an». Hier stutze ich: Ich soll keine echten Namen eingeben, muss mich aber mit meinem echten Google-Konto anmelden. Sehen andere Besucher dann meinen Namen? (P-1)
3. **Hilfe, Nutzungsbedingungen, Datenschutz** (ohne Anmeldung). Der Demo-Hinweis steht auch dort. Erst im Datenschutz unter «Öffentliche Demo» steht, dass meine Anmeldung mit der E-Mail-Adresse im Serverprotokoll festgehalten wird. Ob andere meinen Namen sehen, steht auch dort nicht ausdrücklich. Im Datenschutz steht «Google oder Microsoft», angeboten ist nur Google; ausserdem werden dort Google Fonts und der Mailversand an Mieter genannt (P-4, P-5).
4. **Angemeldet, Übersicht.** Erwartet: ein Einstieg, der mir sagt, wo ich bin. Gesehen: wieder der gelbe Hinweis, dann «Übersicht», «Als Nächstes zu tun» mit «Nebenkostenabrechnungen erstellen» (für Alpenblick), «7 Nebenkostenabrechnungen sind noch im Entwurf», bei den Fristen Hans Müller, «Häufige Arbeiten», Zahlen zu den Gebäuden. Die Seite ist gut lesbar, aber ich weiss nicht, ob ich auf «Abrechnungen erstellen» klicken darf, ohne anderen Besuchern etwas kaputtzumachen (P-2). Oben rechts steht mein Name («Vera Verwalter»); im Menü gibt es nur «Abmelden».
5. **Gebäude.** Drei Gebäude (Alpenblick Interlaken, Seepark Residenz Luzern, Musterhaus Zentrum Zürich). Die Adressen klingen echt (Bahnhofstrasse 42, 8001 Zürich). Gibt es dieses Haus wirklich? «Beispieldaten» sagt mir nicht, dass sie erfunden sind (P-3).
6. **Musterhaus Zentrum.** Angaben, Wohnungen nach Stockwerk, die Erklärung «Was bedeutet der Mietstatus?» und der Abschnitt «Brennstoff im Tank oder Lager» mit drei Einträgen und je einem «Löschen». Die Mietstatus-Erklärung hilft mir sehr. Neben «Bearbeiten» steht «Löschen». Ich habe es angeklickt: Der Dialog «Gebäude löschen?» meldet «Löschen nicht möglich … enthält noch Wohnungen», trotzdem steht daneben «Gebäude löschen» (blass) (P-7). Mit «Abbrechen» geschlossen.
7. **Mieter.** Zehn Mieter mit E-Mail-Adressen auf example.ch und Telefonnummern. Erst hier merke ich, dass die Daten vermutlich erfunden sind. Ein Satz im Hinweis hätte mir das Rätseln erspart (P-3).
8. **Hans Müller.** Kontaktdaten, «Korrespondenzkanal: Per Brief», aktuelle Miete CHF 1’790.00, Mietvertrag seit 01.03.2021. Gut verständlich.
9. **Abrechnung von Hans Müller** (über die Frist in der Übersicht). Status «Versendet», «Als bezahlt markieren», Zahlungsfrist 28.10.2026. Ich frage mich, ob bei einer Mahnung wirklich eine E-Mail rausgeht und wer sie bekommt (P-4). Ich habe nichts angeklickt.
10. **Mobile 390 × 844, Mieter.** Der Hinweis belegt den ganzen ersten Bildschirmteil bis knapp vor «Mieter» (P-6). Die Liste lässt sich gut lesen, nichts scrollt seitlich.

## Verwirrung

- **«Beispieldaten»:** Woher? Erfunden oder anonymisierte echte Fälle? Gehören sie dem Freund, der mir den Link geschickt hat?
- **«Alle Besucher … ändern dieselben Daten»:** klar. Offen ist aber, ob ich etwas «kaputt» machen darf und ob es dann bis zur Nacht für alle kaputt ist.
- **«Jede Nacht»:** Wann genau, und in welcher Zeitzone? Wenn ich abends um 23:50 Uhr etwas erfasse, ist es dann gleich wieder weg?
- **Echtes Google-Konto und «keine echten Namen»:** Das passt für mich nicht zusammen.
- **«Liegenschaftsverwalter»** (Nutzungsbedingungen): Bin ich das als private Vermieterin?

## Fehlerrisiken

- Ich könnte in die Demo versehentlich echte Daten meiner Mieter eintippen, weil Dwello sich wie eine richtige App anfühlt. Der Hinweis warnt zwar davor, aber nur einmal pro Seite in einem Kasten, den man nach dem ersten Mal überliest.
- Ich könnte eine Mahnung auslösen und denken, Hans Müller bekommt wirklich eine E-Mail (oder umgekehrt meinen, ich könne die Demo für echten Versand nutzen).
- Ein anderer Besucher löscht oder ändert Daten, während ich sie anschaue, und ich halte das für einen Fehler in Dwello. Der Hinweis sagt das zwar, aber nicht, dass es plötzlich passieren kann.

## Vorschläge

- **P-1 (Minor).** Nachstellen: abgemeldet http://localhost:3300/ öffnen und den Text bei «Mit Google anmelden» lesen. Hilfreich wäre ein Satz bei der Anmeldung, zum Beispiel «Andere Besucher sehen Ihren Namen und Ihre E-Mail-Adresse nicht. Dwello hält Ihre Anmeldung nur im Serverprotokoll fest.» (falls das so stimmt), mit Link auf den Datenschutz.
- **P-2 (Minor).** Nachstellen: angemeldet die Übersicht öffnen und den Demo-Hinweis lesen. Hilfreich wäre ein Satz, was erlaubt ist: «Probieren Sie alles aus, auch Löschen und Abrechnungen erstellen. Ihre Änderungen sehen alle Besucher bis zum Zurücksetzen.»
- **P-3 (Minor).** Nachstellen: den Demo-Hinweis lesen, dann unter «Mieter» die Namen und Adressen ansehen. Hilfreich wäre «erfundene Beispieldaten» statt «Beispieldaten», etwa «… und die erfundenen Beispieldaten (Gebäude, Mieter, Rechnungen) neu geladen».
- **P-4 (Minor).** Nachstellen: die Abrechnung von Hans Müller öffnen (über die Frist in der Übersicht), danach den Datenschutz unter «Weitergabe an Dritte» lesen. Hilfreich wäre ein Satz im Hinweis oder bei «Mahnung senden», ob die Demo E-Mails verschickt («In der Demo verschickt Dwello keine E-Mails.»), und derselbe Satz im Demo-Abschnitt des Datenschutzes.
- **P-5 (Minor).** Nachstellen: den Datenschutz öffnen und «Anmeldung» sowie «Weitergabe an Dritte» mit der Anmeldeseite vergleichen (nur Google). Beim Laden der Übersicht ging keine Anfrage an einen fremden Server. Hilfreich: den Text an diese Installation anpassen. Ob die Google-Fonts-Angabe überhaupt stimmt, sollte jemand prüfen, der die App kennt.
- **P-6 (Nit).** Nachstellen: Mobile 390 × 844, `/tenants`: Der Hinweis belegt etwa 200 px über dem Titel, auf jeder Seite. Hilfreich wäre, ihn nach der Anmeldung kürzer zu zeigen (eine Zeile «Öffentliche Demo: Daten werden jede Nacht zurückgesetzt» mit einem Link «Mehr erfahren»), ausführlich nur auf der Anmeldeseite.
- **P-7 (Nit).** Nachstellen: Gebäude «Musterhaus Zentrum» öffnen, «Löschen» anklicken: Der Dialog meldet «Löschen nicht möglich» und zeigt trotzdem «Gebäude löschen». Hilfreich wäre, in diesem Fall nur «Schliessen» anzubieten. Das gehört nicht zur Demo-Änderung; ob es schon vorher so war, habe ich nicht geprüft.

## Nicht geprüft

- Die echte Google-Anmeldung: Im Persona-Kit melde ich mich über einen Sitzungs-Cookie an, deshalb habe ich nicht gesehen, was nach Google kommt und welchen Namen andere Besucher allenfalls sehen.
- Speichern, Löschen und Mahnungen: Laut Auftrag nur schauen. Deshalb weiss ich nicht, ob die Demo Aktionen sperrt oder E-Mails tatsächlich verschickt.
- Das nächtliche Zurücksetzen selbst: In einem Lauf von wenigen Minuten nicht beobachtbar.
- Die Sprachen fr/it/en des Hinweises.
