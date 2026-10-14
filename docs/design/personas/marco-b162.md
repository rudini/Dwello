# Persona-Lauf: Marco, Slice b162 (Hinweis «Öffentliche Demo» auf dem Handy)

Marco, 38, angestellt, meist am Smartphone, wenig Zeit. Gerät: 390 × 844, Touch, Zoom 100 %. App: öffentliche Demo auf http://localhost:3300 (persona-stack, DEMO=on). Nur angeschaut, nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Übersicht (/dashboard) | Der Demo-Hinweis braucht oben rund 240 px (28 % des Bildschirms). Dadurch rutscht «Abrechnungen erstellen», die Hauptaktion der ersten Aufgabe, unter den sichtbaren Bereich (Oberkante 900 px bei 844 px Höhe). |
| P-2 | Minor | alle Seiten nach der Anmeldung | Auf jeder Seite steht derselbe fünfzeilige Hinweis in voller Länge. Man kann ihn weder schliessen noch einklappen. Ab der zweiten Seite lese ich ihn nicht mehr, scrolle aber jedes Mal daran vorbei. |
| P-3 | Minor | Anmelden (/login) | In der Demo werde ich nur aufgefordert, mich «mit Google anzumelden». Ob andere Besucher dann meinen Namen oder meine E-Mail-Adresse sehen, steht nirgends. Der Hinweis spricht von geteilten Daten, und genau deshalb zögere ich. |
| P-4 | Nit | Anmelden (/login) | Der gelbe Warnhinweis steht noch vor dem Namen «Dwello» und dem Haus-Bild. Bevor ich weiss, wo ich bin, lese ich zuerst eine Warnung. |
| P-5 | Nit | alle Seiten | «Jede Nacht» nennt keine Uhrzeit. Wenn ich abends um 23 Uhr etwas ausprobiere, weiss ich nicht, ob es gleich gelöscht wird. |

**Aufgabe geschafft:** ja

**Aufwand:** etwa 5 Minuten, 4 Seiten (Anmelden, Übersicht, Mieter, Neuer Mieter), dazu Menü und dunkle Darstellung angeschaut. Nichts gespeichert.

## Ablauf

1. **Anmeldeseite (/login), nicht angemeldet.**
   Erwartet: Dwello-Logo, Knopf zum Anmelden und irgendwo ein Hinweis, dass dies eine Demo ist.
   Gesehen: Oben «Hilfe» und «Deutsch», darunter gleich ein gelber Kasten mit Warndreieck: «Öffentliche Demo. Alle Besucher sehen und ändern dieselben Daten. Jede Nacht werden alle Änderungen gelöscht und die Beispieldaten neu geladen. Geben Sie keine echten Namen, Adressen oder Beträge ein.» Darunter die Karte mit Haus, «Dwello», «Anmelden» und «Mit Google anmelden». Der Knopf ist ohne Scrollen sichtbar (Oberkante 721 px), der Satz zu den Nutzungsbedingungen liegt genau am unteren Rand. Kein seitliches Scrollen (Seitenbreite 390 px). Der Text ist gut lesbar (16 px, dunkle Schrift auf hellem Beige). Die Botschaft ist klar: geteilte Daten, nächtliches Zurücksetzen, keine echten Daten eingeben. Offen bleibt für mich, was mit meinem Google-Konto passiert (P-3), und die Warnung kommt noch vor dem Produktnamen (P-4).

2. **Übersicht (/dashboard), angemeldet.**
   Erwartet: «Was ist zu tun» gleich oben, mit einem Knopf, auf den ich tippen kann.
   Gesehen: Kopfzeile (Menü, Dwello, Sprache, Benutzer), darunter derselbe gelbe Hinweis von 97 px bis etwa 305 px. «Übersicht» beginnt erst bei 337 px. Auf dem ersten Bildschirm sehe ich den Hinweis, die Überschrift und den Text der ersten Aufgabe «Nebenkostenabrechnungen erstellen», aber keinen der beiden Knöpfe dazu: «Rechnungen 2025 ansehen» liegt bei 836 px (unterster Rand), «Abrechnungen erstellen» bei 900 px, also erst nach dem Scrollen. Ohne Hinweis lägen beide gut im sichtbaren Bereich (P-1). Nichts abgeschnitten, kein seitliches Scrollen.

3. **Mieterliste (/tenants).**
   Erwartet: Liste und «Mieter erfassen» oben.
   Gesehen: Wieder der volle Hinweis, dann «Mieter», ein Satz Erklärung und der Knopf «Mieter erfassen» (483 px), ohne Scrollen sichtbar. Darunter das Suchfeld. Der erste Mieter (Marco Bernasconi) kommt erst bei etwa 980 px, also nach dem Scrollen. Das liegt aber mehr an der grossen Suchkarte als am Hinweis. In der dunklen Darstellung ist der Hinweis braun mit heller Schrift, ebenfalls gut lesbar.

4. **Formular «Neuer Mieter» (/tenants/new), nicht gespeichert.**
   Erwartet: Formularfelder sofort sichtbar.
   Gesehen: Hinweis, Brotkrümel «Mieter > Neuer Mieter», Titel «Neuer Mieter», Erklärung, dann «Vorname» und «Nachname» noch auf dem ersten Bildschirm. «Mieter erfassen» und «Abbrechen» stehen ganz unten (etwa 1980 px), wie bei einem langen Formular zu erwarten. Der Hinweis «Geben Sie keine echten Namen … ein» passt hier besonders gut, weil ich gerade einen Namen eingeben will. Nach dem dritten Mal überlese ich ihn aber (P-2).

5. **Menü (☰) auf der Übersicht.**
   Gesehen: Die Seitenleiste deckt die Seite ab, der Hinweis stört dort nicht. Im Menü gibt es keinen eigenen Demo-Hinweis, und es braucht auch keinen.

## Verwirrung

- «Mit Google anmelden» in einer öffentlichen Demo: Ich frage mich, ob die anderen Besucher, mit denen ich laut Hinweis die Daten teile, meinen Google-Namen sehen (P-3).
- «Jede Nacht»: wann genau? (P-5)
- Begriffe im Hinweis selbst sind klar, kein Fachwort.

## Fehlerrisiken

- Auf der Übersicht sehe ich ohne Scrollen keinen Knopf. Wer in Eile ist, hält den ersten Bildschirm leicht für reinen Text und sucht die Aktion im Menü (P-1).
- Weil der Hinweis immer gleich aussieht und überall steht, wird er schnell zu «Bannerblindheit». Wer später doch echte Daten eintippt, hat ihn gesehen, aber nicht mehr gelesen (P-2).

## Vorschläge

- **P-1:** Am Handy (390 × 844) öffentliche Demo öffnen, anmelden, /dashboard aufrufen, nicht scrollen: «Abrechnungen erstellen» ist nicht zu sehen (Oberkante 900 px). Hilfreich wäre ein kürzerer Hinweis am Handy, etwa eine Zeile «Öffentliche Demo: Daten sind für alle sichtbar und werden nachts gelöscht.» mit «Mehr erfahren» oder einklappbarem Rest.
- **P-2:** /dashboard, dann /tenants, dann /tenants/new öffnen: Auf jeder Seite stehen dieselben fünf Zeilen. Hilfreich wäre, den vollen Text nur auf der Anmeldeseite und beim ersten Aufruf zu zeigen und danach eine einzeilige Fassung, die sichtbar bleibt (sie muss nicht ganz verschwinden).
- **P-3:** /login ohne Sitzung öffnen und den Text unter dem Hinweis und der Anmeldekarte lesen: Es steht nichts dazu, ob mein Konto oder mein Name für andere sichtbar ist. Hilfreich wäre ein Satz bei «Mit Google anmelden», zum Beispiel «In der Demo sehen andere Besucher Ihren Namen und Ihre E-Mail-Adresse nicht.», falls das so stimmt.
- **P-4:** /login öffnen: Der Hinweis steht über dem Logo. Den Hinweis unter «Anmelden» setzen, über den Knopf, oder auf der Anmeldeseite ruhiger als Information statt als Warnung zeigen.
- **P-5:** Im Hinweis eine Uhrzeit nennen («jede Nacht um 3 Uhr»), falls sie feststeht.

## Nicht geprüft

- Speichern und was danach passiert (Auftrag: nur anschauen).
- Das tatsächliche Zurücksetzen über Nacht.
- Andere Sprachen als Deutsch. Bei Französisch oder Italienisch kann der längere Text noch mehr Platz brauchen.
- Querformat und kleinere Handys (zum Beispiel 360 px): Dort braucht der Hinweis vermutlich noch mehr Zeilen.
- Der echte Google-Anmeldeweg (die Sitzung wurde wie im Persona-Ablauf über das Cookie gesetzt).
