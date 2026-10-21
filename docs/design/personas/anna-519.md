# Anna – #519: Überschrift der Fehlerseite nach einem unerwarteten Fehler

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück. Desktop 1440 × 900, Maus, Zoom 100 %.
App: Persona-Stack http://localhost:3300 (Demo-Daten), nur angeschaut, nichts gespeichert (ausser der Anzeigesprache, am Schluss wieder auf Deutsch).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/anna-519/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Fehlerseite nach unerwartetem Fehler (`/dashboard`, Daten 500), alle Sprachen | Der Hinweis «Versuchen Sie es später erneut.» sagt nicht, was nicht geklappt hat (die Übersicht konnte nicht geladen werden) und ob meine Daten sicher sind. «Später» schickt mich weg, obwohl ein erneuter Klick auf «Zur Übersicht» sofort hilft. |

Kein Blocker, kein Major. Der Kern der Änderung stimmt: Die Überschrift ist in allen vier Sprachen ein ganzer Satz in der Sprache der Seite, nirgends «Internal Error».

| Sprache | Überschrift (h1) | Hinweis | Knöpfe | Tab-Titel |
|---|---|---|---|---|
| Deutsch | Ein unerwarteter Fehler ist aufgetreten. | Versuchen Sie es später erneut. | Zurück / Zur Übersicht | Fehler - Dwello |
| Français | Une erreur inattendue s’est produite. | Réessayez plus tard. | Retour / Aller à la vue d’ensemble | Erreur - Dwello |
| English | An unexpected error occurred. | Try again later. | Back / Go to overview | Error - Dwello |
| Italiano (zusätzlich) | Si è verificato un errore imprevisto. | Riprovi più tardi. | Indietro / Andare alla panoramica | Errore - Dwello |

Seite einer Adresse, die es nicht gibt (`/gibt-es-nicht`):

| Sprache | Überschrift | Hinweis |
|---|---|---|
| Deutsch | Diese Seite gibt es nicht. | Prüfen Sie die Adresse oder gehen Sie zur Übersicht. |
| Français | Cette page n’existe pas. | Vérifiez l’adresse ou allez à la vue d’ensemble. |
| English | This page does not exist. | Check the address or go to the overview. |
| Italiano | Questa pagina non esiste. | Verifichi l’indirizzo o vada alla panoramica. |

`<html lang>` folgt jeweils der Sprache (de/fr/en/it). Im Accessibility-Baum ist die Überschrift `heading level=1` mit dem Satz, darunter ein Absatz, «Zurück» als Knopf, «Zur Übersicht» als Link.

## Beobachtungen

- Auf der Fehlerseite ist in der Seitenleiste «Übersicht» als aktiv markiert, und die Adresse lautet `/dashboard`. Ich «bin» also auf der Übersicht, sehe sie aber nicht. Das hat mich kurz verwirrt.
- «Zurück» führt mich auf «Diese Seite gibt es nicht.» zurück (dort kam ich ja her). Technisch richtig, aber für mich eine Schleife: Der einzige Ausweg ist «Zur Übersicht» (oder die Seitenleiste).
- «Zur Übersicht» auf der Fehlerseite lädt die Übersicht neu. Als der Server wieder antwortete, kam die Übersicht sofort. Der Knopf ist damit faktisch «Erneut versuchen», er heisst aber nicht so.
- Tab-Titel ist bei 404 und beim unerwarteten Fehler gleich («Fehler - Dwello»). Mit mehreren Tabs sehe ich den Unterschied nicht.
- Die Seite fordert nach dem fehlgeschlagenen `/dashboard/__data.json?x-sveltekit-invalidated=11` noch `…?x-sveltekit-invalidated=1` an (Netzwerk-Mitschnitt). Das ist mir nur im Netzwerk aufgefallen, auf dem Bildschirm sehe ich davon nichts.
- Französisch und Italienisch: Der Link steht im Infinitiv («Aller à la vue d’ensemble», «Andare alla panoramica»), der Hinweis darüber in der Höflichkeitsform («allez», «vada»). Ich lese das als Stil, nicht als Fehler.
- Unten steht «Version unbekannt» (alle Sprachen übersetzt). Für mich als Nutzerin bedeutungslos, aber nicht störend.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 5 Skriptläufe: deutsch 404 und Fehler, Französisch, Englisch, zusätzlich Italienisch, dann zurück auf Deutsch mit den Wegen hinaus (erneut «Zur Übersicht», «Zurück»). Pro Sprache 3 Klicks (Sprache wählen, falsche Adresse, «Zur Übersicht»).

## Ablauf

1. **Alte Adresse `/gibt-es-nicht` öffnen.** Erwartet: eine Seite, die sagt, dass es die Seite nicht gibt. Gesehen (`01-404-de.png`): Haus-mit-Warndreieck-Bild, «Diese Seite gibt es nicht.», darunter «Prüfen Sie die Adresse oder gehen Sie zur Übersicht.», Knöpfe «Zurück» und «Zur Übersicht». Kopfzeile und Seitenleiste bleiben, ich fühle mich nicht verloren.
2. **Daten der Übersicht scheitern lassen (500, ohne Inhalt), dann «Zur Übersicht» klicken.** Erwartet: eine Meldung in normalem Deutsch, kein Englisch. Gesehen (`02-500-de.png`): gleiches Bild, Überschrift «Ein unerwarteter Fehler ist aufgetreten.», darunter «Versuchen Sie es später erneut.», Knöpfe «Zurück» und «Zur Übersicht». Kein «Internal Error». Ich verstehe: Es ist etwas schiefgegangen, und zwar nicht wegen mir. Was genau, und ob etwas verloren ist, weiss ich nicht (P-1).
3. **Sprache auf Français (Kopfzeile, «Sprache: Deutsch» > Français).** Erwartet: dieselben Seiten auf Französisch. Gesehen (`10-404-fr.png`, `11-500-fr.png`): «Cette page n’existe pas.» und danach «Une erreur inattendue s’est produite.» / «Réessayez plus tard.», Menü und Fuss auch französisch. Kein deutsches oder englisches Wort.
4. **Sprache auf English.** Erwartet: englische Sätze, kein «Internal Error». Gesehen (`10-404-en.png`, `11-500-en.png`): «This page does not exist.» und «An unexpected error occurred.» / «Try again later.».
5. **Zusätzlich Italiano.** Gesehen (`10-404-it.png`, `11-500-it.png`): «Questa pagina non esiste.» und «Si è verificato un errore imprevisto.» / «Riprovi più tardi.».
6. **Zurück auf Deutsch, Wege hinaus.** Sprache auf Deutsch gestellt, Übersicht zeigt «Übersicht». Fehler erneut erzeugt. Dann Server wieder normal und «Zur Übersicht» geklickt: die Übersicht erscheint sofort. Beim nächsten Versuch «Zurück» geklickt: ich lande wieder auf «Diese Seite gibt es nicht.».

## Verwirrung

- «Später»: Wie viel später? Eine Minute, ein Tag? Es ging sofort wieder.
- Seitenleiste zeigt «Übersicht» als aktiv, obwohl statt der Übersicht ein Fehler da ist.
- Unbekannte Begriffe gab es auf diesen Seiten keine.

## Fehlerrisiken

- Ich könnte denken, meine Daten seien weg, und deshalb Dinge neu erfassen wollen, weil der Hinweis das nicht ausschliesst.
- Ich könnte die App für Stunden liegen lassen («später»), obwohl ein einziger Klick gereicht hätte.

## Vorschläge

**P-1** (Minor)
Reproduktion: Desktop, `/gibt-es-nicht` öffnen; `page.route('**/dashboard/__data.json?x-sveltekit-invalidated=11', r => r.fulfill({ status: 500 }))`; «Zur Übersicht» klicken. Hinweis lautet «Versuchen Sie es später erneut.» (fr «Réessayez plus tard.», en «Try again later.», it «Riprovi più tardi.»).
Was helfen würde: ein Hinweis, der sagt, was passiert ist und was ich tun kann, zum Beispiel «Die Seite konnte nicht geladen werden. Ihre Daten sind nicht verloren. Versuchen Sie es in einem Moment noch einmal.» Das Versprechen «nicht verloren» gehört nur hinein, wenn es fachlich stimmt. Und der Hauptknopf könnte hier «Erneut versuchen» heissen, weil er genau das tut.

## Nicht geprüft

- Mobile 390 × 844 und Dunkelmodus der Fehlerseite: nicht Teil des Auftrags.
- Fehler beim ersten Laden (voller Seitenaufruf statt Klick in der App): der Auftrag nannte nur den Klick mit `x-sveltekit-invalidated=11`.
- Andere Fehlercodes (z. B. 403, 503) und Fehler auf anderen Seiten als der Übersicht: nicht verlangt.
- Ob der Inhalt der Übersetzungen fachlich ideal ist: das beurteile ich nur als Leserin.
