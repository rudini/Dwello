# Helga – doppelter Name bei Heizprofil und Verteilschlüssel (#655)

Persona: Helga, 68. Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-Stack http://localhost:3300 mit Demodaten, Version 0.92.0+365-g1da11ad6.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/ad862b70-2b73-562f-beb6-23e157e4abea/scratchpad/helga-i655/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Neues Heizprofil | Der Name «Heizung + Warmwasser» des vordefinierten Heizprofils wird ohne Meldung angenommen: Dwello speichert mein Heizprofil und zeigt danach zwei Heizprofile mit genau demselben Namen in der Liste (und in der Auswahl «Standard-Heizprofil» zweimal «Heizung + Warmwasser (100%)»). Ich merke nicht, dass etwas falsch war. Beim Verteilschlüssel wird der Name eines vordefinierten Schlüssels dagegen abgelehnt. Abgelehnt wird beim Heizprofil nur ein Name, den schon ein *eigenes* Heizprofil trägt. |
| P-2 | Minor | Neues Heizprofil, Neuer Verteilschlüssel | Die Meldung sagt nur, was passiert ist («Ein Heizprofil mit dem Namen «Heizung + Warmwasser» existiert bereits.»), aber nicht, was ich tun soll. Ich habe es mir gedacht (anderen Namen eingeben), aber ein Satz wie «Geben Sie einen anderen Namen ein.» würde mir die Unsicherheit nehmen, ob ich das bestehende Profil stattdessen ändern muss. |

## Beobachtungen

- Die Meldung selbst ist gut gemacht: rot, mit Ausrufezeichen-Symbol, direkt unter dem Feld «Name», das rot umrandet ist. Die Seite scrollt so, dass Titel, Feld und Meldung oben im Bild stehen, und der Cursor steht im Feld «Name». Bei 150 % Zoom gut lesbar. Meine Monatsanteile (100 %) bzw. meine Formel blieben erhalten, ich musste nichts neu eintippen.
- Die Meldung ist mit dem Feld verbunden (der Screenreader liest beim Feld «Beispiel: … | Ein … existiert bereits.»), das Feld ist als ungültig markiert.
- Die Meldung bleibt stehen, wenn ich nur in ein anderes Feld klicke, und verschwindet beim ersten Tastendruck im Feld «Name» (auch die rote Umrandung). Tippe ich danach wieder genau den alten Namen, kommt sie erst beim nächsten Speichern wieder; das finde ich in Ordnung.
- Der Knopf auf der Liste heisst «Heizprofil erfassen» bzw. «Verteilschlüssel erfassen», nicht «Neues …»; die Seite danach heisst dann «Neues Heizprofil». Ich habe ihn trotzdem gefunden.
- Bei 150 % Zoom ist das Hauptmenü eingeklappt; «Einstellungen» finde ich erst nach «Menü öffnen» unter «Einstellungen und Hilfe».
- Beim neuen Verteilschlüssel steht der Knopf «Verteilschlüssel speichern» erst ganz unten nach der langen Erklärung «So funktioniert eine Formel»; ich muss weit scrollen.
- Zu Beginn stand in der Heizprofil-Liste bereits ein eigenes «Heizung + Warmwasser» (Januar 50 %, Dezember 50 %), das nicht von mir war; kurz danach war es weg. Es stammt wohl von einer anderen Persona und ist kein Befund von mir.

## Aufgabe geschafft: teilweise

Verteilschlüssel: ja (abgelehnt, Meldung verstanden, verschwindet beim Korrigieren). Heizprofil: nein, der doppelte Name wurde gespeichert statt abgelehnt (P-1).

## Aufwand

Etwa 20 Minuten, rund 12 Schritte pro Formular (Einstellungen, Liste, Erfassen, Name, 12 Monatsanteile bzw. Formel, Speichern, Korrigieren, Abbrechen).

## Ablauf

1. Heizprofil, Name «Heizung + Warmwasser», Monatsanteile 15/14/12/9/5/3/2/2/3/9/12/14 (Anzeige «Summe: 100 % – stimmt»), «Heizprofil speichern».
   Erwartet: Meldung, dass es den Namen schon gibt. Gesehen: Weiterleitung auf die Detailseite meines neuen Heizprofils «Heizung + Warmwasser» mit «Eigenes Heizprofil», keinerlei Hinweis. In der Liste standen danach zwei «Heizung + Warmwasser» (Bild `08-liste-nach-speichern.png`).
2. Gleich nochmals gespeichert, während mein eigenes «Heizung + Warmwasser» existierte.
   Erwartet: gleiches Verhalten wie in Schritt 1. Gesehen: jetzt wurde abgelehnt, mit der Meldung unter dem Namen (Bild `09-nach-speichern-viewport.png`).
3. Mein eigenes Profil gelöscht (Dialog «Heizprofil «Heizung + Warmwasser» löschen?»), dann mit nur dem vordefinierten Profil nochmals gespeichert.
   Erwartet: Ablehnung. Gesehen: wieder gespeichert (neue Detailseite). Damit ist klar: ein vordefinierter Name wird beim Heizprofil nicht geprüft. Auch dieses Profil habe ich danach wieder gelöscht.
4. Verteilschlüssel «Pro Fläche (m²)», Formel «{area}», speichern: ging wie erwartet (Ablehnung, Bild `23-vs-nach-speichern-viewport.png`).

Am Ende sind beide Listen wieder wie am Anfang: nur die vordefinierten Heizprofile und Verteilschlüssel. Die beiden versehentlich gespeicherten Heizprofile waren meine und sind gelöscht.

## Vorschläge

- **P-1:** Einstellungen → Heizprofile → «Heizprofil erfassen», Name «Heizung + Warmwasser», Monatsanteile mit Summe 100 %, «Heizprofil speichern» (es darf kein eigenes Profil mit diesem Namen geben). Ergebnis: gespeichert, zwei gleich benannte Profile in Liste und Auswahl «Standard-Heizprofil». Hilfreich: den Namen auch gegen die vordefinierten Heizprofile prüfen, wie es der Verteilschlüssel schon tut, und dieselbe Meldung am Feld «Name» zeigen.
- **P-2:** In beiden Formularen einen vorhandenen Namen speichern. Hilfreich: der Meldung den nächsten Schritt anhängen, z. B. «Ein Heizprofil mit dem Namen «…» existiert bereits. Geben Sie einen anderen Namen ein.»

## Nicht geprüft

- 200 % Zoom: nicht versucht; bei 150 % war die Meldung ohne Scrollen sichtbar.
- Ein Name, der sich nur in Gross-/Kleinschreibung oder Leerzeichen unterscheidet («heizung + warmwasser»): nicht Teil der Aufgabe, nicht versucht.
- Bearbeiten eines bestehenden eigenen Profils auf einen vorhandenen Namen: nicht Teil der Aufgabe.
