# Sven – Hauptmenü, «Hilfe» und Sprachwahl (#657)

Persona: Sven, 45, blind, Screenreader und nur Tastatur; beurteilt über den Accessibility-Tree.
Fenster: 390 × 844 (Telefon mit Tastatur), zum Vergleich 1440 × 900. App: http://localhost:3300, Demodaten. Nichts gespeichert (ausser der Sprachwahl selbst, die ich wieder auf Deutsch gestellt habe).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hauptmenü (390 px), Sprachliste | Escape in der offenen Sprachliste schliesst das ganze Menü statt nur der Liste. Der Fokus landet auf «Menü öffnen» in der Kopfzeile, nicht auf «Sprache: Deutsch». Im breiten Fenster schliesst Escape nur die Liste, und der Fokus bleibt auf dem Sprachknopf. |
| P-2 | Minor | Hauptmenü, 390 px gegenüber 1440 px | «Hilfe» steht im schmalen Fenster als erster Eintrag, noch vor «Übersicht» und ohne Gruppe. Im breiten Fenster ist «Hilfe» der letzte Eintrag der Gruppe «Einstellungen und Hilfe». Im schmalen Fenster heisst die Gruppe weiterhin «Einstellungen und Hilfe», enthält aber keine Hilfe. Wer die Hilfe dort sucht (so sagt es der Name der Gruppe), findet sie nicht. |

## Beobachtungen

- Gut: «Menü öffnen» wird als «Schaltfläche, Menü öffnen, reduziert» angesagt. Nach Enter steht der Fokus im Dialog auf «Menü schliessen». Der Dialog heisst «Hauptnavigation» und ist modal (`aria-modal=true`). Tab bleibt im Menü gefangen: nach «Heizprofile» kommt wieder «Menü schliessen», Shift+Tab von «Menü schliessen» führt zu «Heizprofile».
- Reihenfolge beim Vorlesen des Menüs (390 px): Dialog «Hauptnavigation» → Text «Dwello» → «Menü schliessen» → Navigation «Sprachwahl» mit «Sprache: Deutsch» (eingeklappt) → Navigation «Hauptnavigation»: Liste mit «Hilfe», «Übersicht»; Absatz «Verwalten», Liste mit Gebäude, Wohnungen, Mieter, Mietverträge; «Nebenkosten», Liste mit Rechnungen, Nebenkostenabrechnungen, Dokumente, Berichte; «Einstellungen und Hilfe», Liste mit Einstellungen, Kategorien, Verteilschlüssel, Heizprofile. «Hilfe» hört man mit dem zweiten Tab, gleich nach der Sprache.
- Ich höre «Hauptnavigation» zweimal hintereinander: einmal als Name des Dialogs, einmal als Name der Navigation darin.
- Die Gruppennamen («Verwalten», «Nebenkosten», «Einstellungen und Hilfe») sind gewöhnliche Absätze, keine Überschriften und keine Namen ihrer Listen. Springe ich von Liste zu Liste oder von Überschrift zu Überschrift, höre ich «Liste, 4 Einträge» ohne Gruppennamen. Das gilt auch im breiten Fenster.
- Im schmalen Fenster ist die Sprachwahl ein eigener Navigationsbereich «Sprachwahl» mit nur einem Knopf darin. Im breiten Fenster ist es ein Knopf in der Kopfzeile ohne eigenen Bereich. Das ist uneinheitlich, stört aber kaum.
- Der Sprachknopf hat `aria-expanded` und `aria-controls`. Die Pfeiltasten wandern durch Deutsch, Français, Italiano, English und springen am Ende wieder an den Anfang. Jede Sprache trägt ihr eigenes `lang`, wird also richtig ausgesprochen. Ob mein Screenreader «Deutsch» als aktuelle Sprache ansagt (`aria-current` steht am Knopf), konnte ich im Accessibility-Tree nicht bestätigen. Der Tree zeigt `current` auch beim Link «Übersicht» nicht an, obwohl er `aria-current=page` hat. Ich weiss es also nicht sicher; der Sprachknopf nennt die aktuelle Sprache aber ohnehin.
- Nach dem Wechsel auf Français (390 px) lädt die Seite neu. Der Fokus steht auf «Ouvrir le menu» (Schaltfläche, reduziert), das Menü ist zu. Rund 550 ms danach sagt der Statusbereich «Langue : Français» an. Der Titel heisst jetzt «Vue d'ensemble - Dwello», `html lang=fr`. Das finde ich vernünftig: Ich weiss, dass es geklappt hat, und stehe dort, wo ich das Menü wieder öffne. Zurück auf Deutsch dasselbe: Fokus auf «Menü öffnen», Ansage «Sprache: Deutsch», `lang=de`.
- Im breiten Fenster steht der Fokus nach dem Neuladen wieder auf dem Sprachknopf («Langue : Français»), mit derselben Ansage. Beide Verhaltensweisen sind folgerichtig, nur eben verschieden.
- Ein Wählen der schon aktiven Sprache lädt nichts neu: Die Liste geht zu, der Fokus bleibt auf dem Sprachknopf.
- Escape mit dem Fokus auf «Menü schliessen» oder auf einem Link im Menü schliesst das Menü und setzt den Fokus richtig auf «Menü öffnen» zurück.
- Netzwerk und Cookies: Beim Wechsel lädt der Browser nur `GET /dashboard` neu und setzt das Cookie `PARAGLIDE_LOCALE`. Eine Anfrage, die die Sprache am Konto speichert, habe ich nicht gesehen. Ein frisch geöffneter Browser mit derselben Anmeldung zeigte nach dem Wechsel auf Français wieder Deutsch. Die Sprache gilt also offenbar nur für diesen Browser.
- Im Bildschirmfoto der offenen Sprachliste (390 px) deckt die Liste die ersten Menüeinträge zu, und das Menü ist so weit gescrollt, dass «Hilfe» und «Übersicht» nicht zu sehen sind. Für mich ohne Belang, für Sehende vielleicht verwirrend.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, 9 Skriptläufe. Menü öffnen bis «Hilfe»: 4 Tasten (Tab, Tab, Enter, Tab, Tab). Sprache wechseln: 7 Tasten (Tab, Tab, Enter, Tab, Enter, Pfeil runter ×2, Enter).

## Ablauf

- Schmal, Sprachliste offen, Fokus auf «Deutsch», Escape. Erwartet: Die Liste geht zu, der Fokus steht auf «Sprache: Deutsch», das Menü bleibt offen. Gesehen: Das ganze Menü ging zu (kein Dialog mehr), der Fokus stand auf «Menü öffnen». Ein zweites Escape bewirkte nichts mehr.
- Schmal, «Hilfe» suchen. Erwartet nach dem Gruppennamen: «Hilfe» in «Einstellungen und Hilfe». Gesehen: «Hilfe» steht zuoberst, vor «Übersicht»; die Gruppe «Einstellungen und Hilfe» enthält sie nicht. Im breiten Fenster steht sie dagegen am Ende dieser Gruppe.
- Schmal, nach dem Wechsel auf Français. Erwartet: Der Fokus steht wie im breiten Fenster wieder auf dem Sprachknopf. Gesehen: Das Menü ist zu, der Fokus auf «Ouvrir le menu». Dazu kam die Ansage «Langue : Français», das hat mir gereicht (siehe Beobachtungen).
- Mein Skript für den Rückwechsel nahm zuerst an, der Fokus stehe oben auf der Seite, und drückte zweimal Tab. Dadurch geriet ich über «Rechnungen hochladen» auf die Rechnungsseite in eine Gebäudeauswahl. Nichts wurde gespeichert. Beim zweiten Versuch (Fokus stand schon auf «Ouvrir le menu», nur Enter) ging es glatt.

## Vorschläge

- **P-1:** Fenster 390 × 844, Übersicht. Tab, Tab, Enter (Menü auf), Tab, Enter (Sprachliste auf), Pfeil runter, Escape. Das ganze Menü ist zu, der Fokus steht auf «Menü öffnen». Hilfreich: Das erste Escape schliesst nur die Sprachliste und setzt den Fokus auf «Sprache: …» zurück, wie im breiten Fenster; erst das zweite Escape schliesst das Menü.
- **P-2:** Fenster 390 × 844, Menü öffnen und die Reihenfolge lesen; danach 1440 × 900, Hauptnavigation lesen. Hilfreich: «Hilfe» an derselben Stelle wie im breiten Fenster (in «Einstellungen und Hilfe»). Soll sie im schmalen Fenster bewusst zuoberst stehen, dann die Gruppe dort nur «Einstellungen» nennen (oder beide Fenster gleich ordnen), damit Name und Inhalt der Gruppe übereinstimmen.

## Nicht geprüft

- Einen echten Screenreader (NVDA, VoiceOver) hatte ich nicht. Die Ansagen leite ich aus dem Accessibility-Tree, dem Fokus und den Live-Regionen ab (MutationObserver auf `role=status`/`aria-live`). Ob die Statusmeldung nach dem Neuladen wirklich vorgelesen wird, hängt vom Screenreader ab: Die Meldung kommt rund 0,5 s nach dem Laden in eine schon vorhandene Statusregion, das spricht dafür.
- Ob `aria-current` bei «Deutsch» angesagt wird: Der Tree über CDP zeigt diese Eigenschaft nicht an, auch nicht beim Link «Übersicht». Das bleibt offen.
- Italiano und English habe ich nicht gewählt, nur Français und zurück auf Deutsch.

Skripte und Bildschirmfotos: /tmp/claude-0/-home-user-Dwello/ba9a3a73-5b8c-5662-9110-5665ba186b50/scratchpad/sven-657/
