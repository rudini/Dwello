# Anna – Dwellos neues Zeichen (#730): Tab-Icon, Lesezeichen, Home-Bildschirm

Ich bin Anna, 29, vermiete seit Kurzem eine Wohnung und öffne Dwello nur ein paar Mal im Jahr. Diesmal komme ich nach Monaten zurück und habe zwanzig Tabs und eine volle Lesezeichenleiste offen. Ich will Dwello an seinem Bildchen wiederfinden.

Vorgehen: Headless Chromium zeichnet keine Tab-Leiste. Deshalb habe ich mit Playwright selbst Leisten nachgebaut (Skripte und Bilder in `/tmp/claude-0/-home-user-Dwello/a4b0cfef-0ed3-5587-ad4f-4b883cd068fa/scratchpad/anna-730/`). Darin steht `favicon.svg` neben zehn selbst gezeichneten, typischen Favicons: Mail, SBB, ein pinkes Immobilienportal mit Haus, ein dunkelblaues «ImmoPortal» mit Haus, LinkedIn, E-Banking, Kalender, eine Weltkugel ohne eigenes Icon und Drive. Je eine Reihe zeigt Tabs mit Titel, angeheftete Tabs (nur Icon) und eine Lesezeichenleiste. Die Leisten gibt es hell (#F1F3F4 / #FFFFFF) und dunkel (#202124 / #35363A), mit dem Icon in 16 px bei 1x und 2x sowie in 32 px. Die App-Icons `apple-touch-icon.png`, `icon-192.png` und `icon-512.png` habe ich mit 60 px auf einen nachgebauten Home-Bildschirm gesetzt, mit iOS-Rundung (13 px) und ohne Rundung. Die Hintergründe waren hell (#E8E4DC), schwarz und ein petrolfarbenes Hintergrundbild (#3A6B7E). Daneben standen sieben farbige Fremd-Apps.

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Minor | Tab-Leiste / angeheftete Tabs, 16 px, hell und dunkel | Das Zeichen ist ein weisses Haus im dunklen Quadrat. Bei 16 px sieht es fast gleich aus wie das Haus-Icon des dunkelblauen Immobilienportals, das ich daneben gezeichnet habe. Bei angehefteten Tabs ohne Titel musste ich zweimal hinschauen und habe mich am etwas helleren Petrol orientiert, nicht an der Form. Eine Vermieterin hat Immobilienportale oft offen. Ich kann den falschen Tab erwischen. Das ist harmlos, kostet aber Suchzeit. |

## Beobachtungen

- Im hellen Tab ist das Icon gut zu sehen. Das satte Petrol-Quadrat hebt sich klar von #F1F3F4 und #FFFFFF ab. Unter den bunten Icons (Rot, Pink, Grün, Gelb) gehört es zu den ruhigsten, fällt aber durch die geschlossene, dunkle Fläche auf.
- Im dunklen Tab (#202124 / #35363A) ist das Quadrat gegen das Grau schwächer. Dafür leuchtet das weisse Haus, und darauf springt mein Auge. Ich habe es gefunden.
- In der Pixel-Vergrösserung (`zoom-16.png`) zerfliesst die Tür bei 16 px und 1x zu grauen Halbpixel-Strichen, und auch der Hausumriss ist eher grau als weiss. Als «Haus» erkenne ich es trotzdem. Bei 2x und bei 32 px ist es sauber, die Tür eingeschlossen.
- Mit Titel daneben («Dwello») finde ich den Tab sofort. In schmalen Tabs (48 px, Titel abgeschnitten) bleibt nur das Icon, und dann gilt P-1.
- Home-Bildschirm mit 60 px (`home-light-rund.png`, `home-dark-rund.png`, `home-wallpaper-*.png`): Das grosse, dick gezeichnete weisse Haus auf Petrol ist eindeutig und gut lesbar. Unter den farbigen Apps sieht es ruhig und seriös aus. Auf Schwarz und auf Hell wirkt es gleich gut. Nur auf dem petrolfarbenen Hintergrundbild verschwimmt der Rand des Quadrats etwas, das Haus bleibt klar.
- Die drei PNGs reichen bis an den Rand, ohne eingebaute Rundung und ohne Transparenz. Jedes Eckpixel hat die Farbe (27, 88, 115) = #1B5873. Rundet iOS die Ecken, bleiben also keine hellen Ecken stehen. apple-touch-icon, icon-192 und icon-512 sehen bei 60 px gleich aus.
- Das Haus füllt etwa 60 % der Fläche (512er: weisse Pixel von 103 bis 408). Die Manifest-Icons sind nicht als `maskable` markiert, deshalb schneidet Android nichts ab. Würden sie später maskable, lägen die unteren Hausecken knapp ausserhalb des sicheren Kreises von 80 %.
- Im Manifest ist `background_color` #1B5873, passend zum Icon.
- Das Zeichen selbst ist ein sehr gewöhnliches Haus-Symbol, wie es viele Immobilien- und Smart-Home-Dienste nutzen. Unverwechselbar macht es nur die Petrol-Farbe.

## Aufgabe geschafft: ja

Ich finde Dwello in Tab-Leiste, Lesezeichenleiste und auf dem Home-Bildschirm wieder. Neben einem anderen dunklen Haus-Icon ohne Titel brauche ich einen zweiten Blick (P-1).

## Aufwand

Etwa 12 Minuten, 6 Schritte: Assets kopieren, Leisten und Home-Bildschirme rendern, Bilder ansehen, Pixel-Zoom, Eckpixel und Glyph-Grösse messen, Manifest ansehen.

## Ablauf

- Angeheftete Tabs bei 16 px. Erwartet: Ich erkenne Dwello sofort am Zeichen. Gesehen: Das weisse Haus im dunklen Quadrat sieht dem dunkelblauen Haus-Icon des Portals daneben sehr ähnlich. Unterschieden habe ich sie nur am Farbton (P-1).
- 16 px bei 1x, vergrössert. Erwartet: weisses, scharfes Haus. Gesehen: graue, weiche Linien, die Tür als verschwommener Fleck.
- Erster Versuch, die Roh-PNGs gross zu zeigen (`raw.png`). Die Seite lief über `setContent` und konnte keine `file://`-Bilder laden. Das war ein Fehler in meinem Skript, nicht in Dwello. Danach habe ich die Pixel direkt gemessen.

## Vorschläge

- **P-1:** Die Leiste mit angehefteten Tabs aus `bar-16-1x.html` öffnen (hell und dunkel). Dwello steht neben einem dunkelblauen Quadrat mit weissem Hausumriss. Bei 16 px lassen sich die beiden nur am Farbton unterscheiden. Helfen würde ein eigenes Merkmal, das auch bei 16 px trägt, zum Beispiel ein ausgefülltes statt eines umrissenen Hauses, eine Kontrastfarbe für Tür oder Fenster oder eine unverwechselbare Form statt des Standard-Haus-Symbols. Weniger aufwendig wäre eine eigene 16-px-Fassung mit dickeren, aufs Pixelraster gesetzten Strichen und ohne Tür. Dann bliebe das Haus weiss und scharf statt grau.

## Nicht geprüft

- Echte Browser-Tab-Leisten (Chrome, Safari, Firefox) und echte Favicons fremder Seiten: Headless Chromium zeichnet keine. Ich habe sie mit einfachen Formen nachgebaut.
- Das Hinzufügen zum echten iOS- oder Android-Home-Bildschirm und den Firefox-Lesezeichen-Manager: kein Gerät verfügbar. Die iOS-Rundung habe ich mit CSS nachgeahmt.
- Den Tab-Titel: Er gehörte nicht zur Aufgabe, und die App war für diese Prüfung nicht nötig.
