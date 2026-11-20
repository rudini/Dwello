# Sprechtext (long)

Generiert aus `scenes-long.mjs` (`node docs/journey-video/render.mjs long --text`). Länge 15:30.

> Ende September öffne ich nach Monaten wieder meine eigene App und klicke mich durch. Sie sieht fertig aus.
>
> *At the end of September I open my own app again after months and click through it. It looks finished.*

> Ich beende einen Mietvertrag. Der Knopf zeigt eine Erfolgsmeldung.
>
> *I end a rental contract. The button shows a success message.*

> Im Code dahinter steht: 500 Millisekunden warten. Sonst nichts.
>
> *In the code behind it: wait 500 milliseconds. Nothing else.*

> In der Nebenkostenabrechnung bezahlt jeder Mieter die Kosten des ganzen Gebäudes.
>
> *In the utility cost statement every tenant pays the costs of the whole building.*

> Die Heizprofile ergeben 90 Prozent statt 100.
>
> *The heating profiles add up to 90 percent instead of 100.*

> Und die ganze Schnittstelle ist offen, ohne Anmeldung.
>
> *And the whole API is open, without a login.*

> Dabei hatte mir der Assistent acht Monate vorher gemeldet: Phase abgeschlossen. Über sechzig Häkchen gesetzt.
>
> *Yet eight months earlier the assistant had reported: phase complete. More than sixty boxes ticked.*

> Ich bin Roger. Das ist die Geschichte, wie ich gelernt habe, Code zu vertrauen, den ich nicht selbst geschrieben habe.
>
> *I am Roger. This is the story of how I learned to trust code I did not write myself.*

## 1. Der Glaube (1:00)

> Dwello ist eine Web-App für private Vermieter in der Schweiz.
>
> *Dwello is a web app for private landlords in Switzerland.*

> Wer zwei, drei Wohnungen selbst verwaltet, soll damit einmal im Jahr die Nebenkostenabrechnung machen können: Rechnungen erfassen, verteilen, ein PDF mit QR-Rechnung verschicken.
>
> *Anyone who manages two or three apartments themselves should be able to do the utility cost statement once a year: enter invoices, allocate them, send a PDF with a QR-bill.*

> Ich baue sie aus zwei Gründen. Ich vermiete selbst und will meine eigene Abrechnung damit machen. Und ich will an einem echten Fachgebiet lernen, wie weit man mit Agenten kommt.
>
> *I build it for two reasons. I rent out apartments myself and want to do my own statement with it. And I want to learn, in a real domain, how far you get with agents.*

> Im Januar starte ich so, wie man es gelernt hat: ein Anforderungsdokument, ein Datenmodell, ein Plan mit über zwanzig Phasen.
>
> *In January I start the way one was taught: a requirements document, a data model, a plan with more than twenty phases.*

> Der Assistent arbeitet Phase um Phase ab, und es geht schnell.
>
> *The assistant works through phase after phase, and it goes fast.*

> Schon am ersten Abend schreibe ich Regeln in die Datei, die der Assistent bei jeder Aufgabe liest: Jedes Häkchen muss gesetzt sein. Jede Phase braucht Tests.
>
> *On the very first evening I write rules into the file the assistant reads for every task: every box must be ticked. Every phase needs tests.*

> Der Assistent setzt die Häkchen.
>
> *The assistant ticks the boxes.*

> Was ich damals nicht sehe: Eine Regel im Text ist eine Bitte. Und ein Häkchen ist eine Behauptung.
>
> *What I do not see back then: a rule in a text is a request. And a tick is a claim.*

> Nach 93 Commits fehlt mir die Zeit, und das Projekt bleibt liegen. Bis September.
>
> *After 93 commits I run out of time, and the project lies idle. Until September.*

## 2. «Fertig» prüfbar machen (2:30)

> Nach dem Durchklicken im September ist klar: Ich kann nicht jede Zeile lesen, die ein Agent schreibt.
>
> *After clicking through in September it is clear: I cannot read every line an agent writes.*

> Also brauche ich etwas anderes, dem ich vertrauen kann.
>
> *So I need something else I can trust.*

> Das Erste ist ATDD, Acceptance Test-Driven Development. Bevor Code entsteht, steht ein Szenario da. Auf Deutsch, in der Sprache des Fachs: Angenommen, wenn, dann.
>
> *The first is ATDD, acceptance test-driven development. Before code exists, there is a scenario. In German, in the language of the domain: given, when, then.*

> Dieses Szenario ist ausführbar. Es bedient die echte App mit echter Datenbank.
>
> *This scenario is executable. It operates the real app with a real database.*

> Damit wird eine Anforderung testbar. Ich muss nicht mehr glauben, dass etwas funktioniert. Ich sehe es laufen.
>
> *That makes a requirement testable. I no longer have to believe that something works. I see it run.*

> Ein neues Szenario trägt die Markierung «wip», in Arbeit.
>
> *A new scenario carries the tag "wip", work in progress.*

> Der Agent muss es zuerst scheitern sehen, und zwar am fehlenden Verhalten.
>
> *The agent must first see it fail, at the missing behaviour.*

> Dann baut er testgetrieben, rot, grün, ein Verhalten nach dem anderen.
>
> *Then it builds test-driven, red, green, one behaviour at a time.*

> Und jetzt der wichtige Teil: Sobald ein Szenario umgesetzt ist, darf der Agent es nicht mehr selbständig ändern.
>
> *And now the important part: once a scenario is implemented, the agent may no longer change it on its own.*

> Wird es rot, wird der Code geflickt, nicht das Szenario.
>
> *If it turns red, the code gets fixed, not the scenario.*

> Eine Änderung braucht meinen Entscheid in einem Issue, und die CI prüft, ob er im Pull Request steht.
>
> *A change needs my decision in an issue, and CI checks that it is in the pull request.*

> Heute sind das rund 1’380 Szenarien. Sie sind die Spezifikation.
>
> *Today there are about 1,380 scenarios. They are the specification.*

> Dazu kommt ein Glossar. Mieter, Mietvertrag, Akonto, Nebenkostenabrechnung: Jeder Begriff ist einmal festgelegt, und Code, Tests und Bildschirm benutzen dasselbe Wort.
>
> *Then there is a glossary. Tenant, rental contract, advance payment, utility cost statement: each term is defined once, and code, tests and screen use the same word.*

> Bleibt die Frage, woher der Agent weiss, was ich will.
>
> *That leaves the question of how the agent knows what I want.*

> Meine Aufgaben beschreiben das Ziel: was der Vermieter am Ende sieht, nicht wo ein Knopf hinkommt.
>
> *My tasks describe the goal: what the landlord sees in the end, not where a button goes.*

> Und bevor die Arbeit beginnt, lasse ich mich ausfragen. Der Skill heisst «grill me».
>
> *And before the work begins, I let myself be questioned. The skill is called "grill me".*

> Der Agent liest das Issue und den Code und stellt mir Fragen, höchstens vier pro Runde, bis jede Entscheidung getroffen ist.
>
> *The agent reads the issue and the code and asks me questions, at most four per round, until every decision is made.*

> Die Antworten stehen danach im Issue.
>
> *Afterwards the answers are in the issue.*

> Das mache ich oft für einen ganzen Stapel offener Issues auf einmal. Jedes, dem noch ein Entscheid fehlt, trägt ein Etikett.
>
> *I often do this for a whole stack of open issues at once. Each one still missing a decision carries a label.*

> In einer Sitzung kläre ich die fachlichen Fragen. Danach arbeiten mehrere Agenten diese Issues parallel ab, fast ohne Rückfragen.
>
> *In one session I settle the domain questions. Then several agents work through these issues in parallel, almost without questions.*

> Meine Zeit ist der Engpass, also bündle ich sie am Anfang. An einem einzelnen Tag sind so 55 Pull Requests gemergt worden.
>
> *My time is the bottleneck, so I bundle it at the start. On a single day 55 pull requests were merged this way.*

## 3. Wer baut, prüft nicht (5:33)

> Ein Agent, der gerade etwas gebaut hat, findet es gut. Das ist bei Menschen nicht anders.
>
> *An agent that has just built something thinks it is good. People are no different.*

> Darum prüft bei mir nie der, der gebaut hat.
>
> *That is why the one who built it never checks it.*

> Nach jeder Scheibe Arbeit startet ein Code-Reviewer mit frischem Kontext. Er kennt nur die Anforderung und den Diff.
>
> *After every slice of work a code reviewer starts with fresh context. It knows only the requirement and the diff.*

> Was der bauende Agent sich dabei gedacht hat, weiss er nicht.
>
> *What the building agent was thinking, it does not know.*

> Für alles Fachliche gibt es den Fach-Reviewer. Er liest ein Szenario gegen das Glossar, gegen die Anforderungen und gegen das Schweizer Mietrecht, und zwar bevor es umgesetzt wird.
>
> *For everything in the domain there is the domain reviewer. It reads a scenario against the glossary, the requirements and Swiss tenancy law, before it is implemented.*

> Und für Beträge gibt es den Datenprüfer. Er rechnet jede Abrechnung mit einem eigenen Skript aus der Datenbank nach, auf den Rappen.
>
> *And for amounts there is the data checker. It recalculates every statement from the database with its own script, to the centime.*

> Er hat zum Beispiel gefunden, dass nach dem Zurücksetzen einer Teilzahlung das PDF 115 Franken 80 verlangte, obwohl 215 Franken 80 offen waren.
>
> *For example, it found that after a partial payment was reset, the PDF asked for 115.80 francs although 215.80 francs were open.*

> Jeder Reviewer bekommt höchstens drei Runden. Was dann noch offen ist, landet bei mir.
>
> *Each reviewer gets at most three rounds. Whatever is still open then lands with me.*

## 4. Kunden, die es noch nicht gibt (6:52)

> Tests sagen mir, ob die App tut, was im Szenario steht. Sie sagen mir nicht, ob ein Mensch damit zurechtkommt.
>
> *Tests tell me whether the app does what the scenario says. They do not tell me whether a person can cope with it.*

> Und echte Kunden habe ich noch keine.
>
> *And I do not have any real customers yet.*

> Also habe ich fünf Personas.
>
> *So I have five personas.*

> Helga ist 68, hat eine Wohnung geerbt und wenig Erfahrung am Computer.
>
> *Helga is 68, inherited an apartment and has little experience with computers.*

> Marco macht alles am Handy.
>
> *Marco does everything on his phone.*

> Doktor Weber liest jedes Wort und rechnet nach.
>
> *Dr. Weber reads every word and recalculates.*

> Sven ist blind und arbeitet nur mit Tastatur und Screenreader.
>
> *Sven is blind and works with keyboard and screen reader only.*

> Und Anna kommt nach Monaten zurück und weiss nichts mehr.
>
> *And Anna comes back after months and remembers nothing.*

> Das sind KI-Agenten. Sie bekommen eine Aufgabe, bedienen die laufende App und schreiben einen Bericht.
>
> *These are AI agents. They get a task, operate the running app and write a report.*

> Sven hat gemerkt, dass ein wichtiger Hinweis im Löschdialog nicht vorgelesen wird.
>
> *Sven noticed that an important notice in the delete dialog is not read aloud.*

> Das sieht kein Test und kein Code-Review.
>
> *No test and no code review sees that.*

> So sind 684 Persona-Berichte entstanden.
>
> *That is how 684 persona reports came about.*

> Das ersetzt echte Kunden nicht ganz. Aber es findet viel von dem, was man sonst erst im ersten Kundengespräch erfährt.
>
> *That does not fully replace real customers. But it finds much of what you would otherwise only learn in the first customer conversation.*

## 5. Architektur erst, als sie gebraucht wurde (8:17)

> Ich habe keine Architektur im Voraus entworfen.
>
> *I did not design any architecture up front.*

> Sie kam am 23. Oktober, einen Monat nach dem Neustart, und sie kam über Messungen.
>
> *It came on 23 October, a month after the restart, and it came through measurements.*

> Mein Gefühl war: Jede kleine Änderung fasst zu viele Dateien an.
>
> *My feeling was: every small change touches too many files.*

> Statt zu raten, habe ich ein Werkzeug gebaut, das die Git-Historie auswertet.
>
> *Instead of guessing, I built a tool that analyses the git history.*

> Das Ergebnis: Ein Feature ändert im Median zwölf Dateien in drei Schichten.
>
> *The result: a feature changes a median of twelve files in three layers.*

> Ein einzelnes Datenbankfeld ist in sechs weiteren Dateien noch einmal von Hand beschrieben.
>
> *A single database field is described by hand once more in six other files.*

> Kopierter Code war es nicht. Es war kopiertes Wissen.
>
> *It was not copied code. It was copied knowledge.*

> Dann die Frage: Welche Qualität zählt überhaupt? Das kommt aus Continuous Architecture.
>
> *Then the question: which quality matters at all? That comes from Continuous Architecture.*

> Ich habe einen Utility Tree gebaut: Qualitätsszenarien mit Zielwerten.
>
> *I built a utility tree: quality scenarios with target values.*

> Der teuerste Fehler für einen Vermieter ist Datenverlust.
>
> *The most expensive error for a landlord is data loss.*

> Also: ein verschlüsseltes Backup, das sich wirklich einspielen lässt. Ein Update, das keine Zeile verliert. Die CI antwortet in 15 Minuten.
>
> *So: an encrypted backup that can really be restored. An update that loses no row. CI answers within 15 minutes.*

> Architektur ist für mich seither genau das: ein Werkzeug, um solche nicht-funktionalen Anforderungen zu erreichen. Nicht mehr.
>
> *Since then, architecture is exactly that for me: a tool for reaching such non-functional requirements. Nothing more.*

> Jedes wichtige Szenario bekommt eine Fitness Function: einen automatischen Test für eine Architektureigenschaft.
>
> *Every important scenario gets a fitness function: an automatic test of an architectural property.*

> Einer lädt die Daten des letzten Release, spielt das Update ein und vergleicht jede Zeile und jede Summe.
>
> *One loads the data of the last release, applies the update and compares every row and every total.*

> Einer zählt die Datenbankabfragen pro Seite.
>
> *One counts the database queries per page.*

> Und einer ruft jede Route ohne Anmeldung auf und erwartet eine Absage. 130 Routen.
>
> *And one calls every route without login and expects a refusal. 130 routes.*

> Die offene Schnittstelle vom Anfang kann nicht mehr passieren.
>
> *The open API from the beginning can no longer happen.*

> Die Schwellen starten beim Messwert von heute und dürfen nur besser werden. Das ist der Ratchet, die Sperrklinke.
>
> *The thresholds start at today’s measurement and may only get better. That is the ratchet.*

> Am ersten Tag ist nichts rot, und trotzdem wird es mit jedem Pull Request besser.
>
> *On the first day nothing is red, and yet it gets better with every pull request.*

> Die Dateien, die das Datenmodell von Hand spiegeln, sind von 57 auf 43 gesunken.
>
> *The files that mirror the data model by hand dropped from 57 to 43.*

> Die Messwerkzeuge habe ich selbst gebaut, nach meinem Bedarf.
>
> *I built the measuring tools myself, for what I needed.*

> «deepcheck» sucht flache Module, nach John Ousterhout: Ein gutes Modul hat eine kleine Schnittstelle und viel dahinter.
>
> *"deepcheck" looks for shallow modules, after John Ousterhout: a good module has a small interface and a lot behind it.*

> «testcheck» findet Tests, die bestehen können, ohne zu prüfen, was sie behaupten.
>
> *"testcheck" finds tests that can pass without checking what they claim.*

> Das ist die Antwort auf die Häkchen vom Januar.
>
> *That is the answer to the ticks of January.*

> Und jeder Architekturentscheid steht in einem ADR, mit der Kennzahl vorher und nachher.
>
> *And every architecture decision is recorded in an ADR, with the metric before and after.*

## 6. Regeln, die sich wehren (11:32)

> Jetzt zurück zur Lektion aus dem Januar: Eine Regel im Text ist eine Bitte.
>
> *Now back to the lesson from January: a rule in a text is a request.*

> Agenten halten sich meistens daran. Meistens reicht nicht.
>
> *Agents mostly stick to it. Mostly is not enough.*

> Darum arbeite ich mit Hooks. Ein Hook ist ein Skript, das vor einem Befehl des Agenten läuft und ihn blockieren kann.
>
> *That is why I work with hooks. A hook is a script that runs before an agent’s command and can block it.*

> Bei jedem Commit laufen fünf Prüfungen: toter und doppelter Code, flache Module, schwache Tests, die Architektur-Fitness, die Form der Commit-Nachricht.
>
> *Every commit runs five checks: dead and duplicate code, shallow modules, weak tests, architecture fitness, the form of the commit message.*

> Findet eine etwas, findet der Commit nicht statt.
>
> *If one finds something, the commit does not happen.*

> Geprüft wird nur, was die Änderung neu bringt. Alte Befunde blockieren niemanden, neue kommen nicht dazu.
>
> *Only what the change brings in is checked. Old findings block nobody, new ones do not get added.*

> Und der Agent darf die Schranken nicht selbst verstellen. Hooks, Schwellen und Regeldateien sind geschützt.
>
> *And the agent may not adjust the barriers itself. Hooks, thresholds and rule files are protected.*

> Sonst repariert er irgendwann die Prüfung statt den Fehler.
>
> *Otherwise at some point it repairs the check instead of the error.*

> Vor dem Merge läuft alles noch einmal in der CI: Unit-Tests, die Szenarien in drei Browsern, Barrierefreiheit hell und dunkel auf drei Bildschirmgrössen, vier Sprachen, die Fitness Functions.
>
> *Before the merge everything runs once more in CI: unit tests, the scenarios in three browsers, accessibility light and dark on three screen sizes, four languages, the fitness functions.*

> Der Pull Request zeigt mir Bilder jeder geänderten Seite und den Bericht der Reviewer.
>
> *The pull request shows me pictures of every changed page and the reviewers’ report.*

> Der letzte Baustein: Der Prozess prüft sich selbst. Nach jeder Aufgabe notiert der Agent, wo eine Regel unklar war, einer anderen widersprach oder nur Aufwand kostete.
>
> *The last building block: the process checks itself. After every task the agent notes where a rule was unclear, contradicted another or only cost effort.*

> Diese Notizen werden gesammelt, und ich entscheide, was sich ändert.
>
> *These notes are collected, and I decide what changes.*

> Der Hook für die Architektur-Fitness ist genau so entstanden: aus einer solchen Notiz.
>
> *The hook for architecture fitness came about exactly like this: from such a note.*

> Die Regeldatei wurde 123-mal geändert. Mit jeder Runde arbeiten die Agenten strikter nach Prozess.
>
> *The rule file was changed 123 times. With every round the agents work more strictly by the process.*

## Was bleibt (13:43)

> Zurück zum Knopf vom Anfang. Heute hat er ein Szenario, einen Reviewer, eine Persona, die ihn bedient hat, und eine Schranke, die ihn schützt.
>
> *Back to the button from the beginning. Today it has a scenario, a reviewer, a persona who used it, and a barrier that protects it.*

> In zehn Monaten sind 5’620 Commits entstanden. 4’774 davon stammen von Agenten.
>
> *In ten months 5,620 commits were made. 4,774 of them come from agents.*

> Was ich mitnehme, sind fünf Sätze.
>
> *What I take away are five sentences.*

> Erstens: Mach «fertig» prüfbar. Mit ausführbaren Spezifikationen und Zielen statt Anweisungen. Zweitens: Erzwinge, statt zu bitten. Mit Hooks, die blockieren, und Schranken, die der Agent nicht verstellen kann. Drittens: Wer baut, prüft nicht. Reviewer mit frischem Kontext, Personas statt Testpersonen, ein Prüfer, der nachrechnet. Viertens: Architektur ist ein Werkzeug für nicht-funktionale Anforderungen. Bau dir die Metriken, die du brauchst, und lass Fitness Functions sie bewachen. Fünftens: Lass den Prozess mitlernen.
>
> *First: make "done" checkable. With executable specifications and goals instead of instructions. Second: enforce instead of asking. With hooks that block, and barriers the agent cannot adjust. Third: who builds does not check. Reviewers with fresh context, personas instead of test users, a checker who recalculates. Fourth: architecture is a tool for non-functional requirements. Build the metrics you need and let fitness functions guard them. Fifth: let the process learn along.*

> Was würde ich heute anders machen? Zwei Dinge. Die Szenarien kämen am ersten Tag, nicht nach acht Monaten. Und die Hooks auch: Was ich im Januar als Regel aufgeschrieben habe, würde ich heute sofort erzwingen.
>
> *What would I do differently today? Two things. The scenarios would come on the first day, not after eight months. And so would the hooks: what I wrote down as a rule in January I would enforce right away today.*

> Das alles hat Grenzen. Personas sind keine Kunden, und ein grüner Check ist kein Beweis.
>
> *All this has limits. Personas are not customers, and a green check is no proof.*

> Aber ich muss nicht mehr glauben, dass etwas fertig ist.
>
> *But I no longer have to believe that something is done.*

> Ich tippe kaum noch Code. Ich entscheide.
>
> *I hardly type code any more. I decide.*

## Dwello (15:26)
