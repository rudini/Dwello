# Persona-Review Dr. Weber, Runde 461: französische Oberfläche, gelesen wie vom Mieterverband

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300 (Demodaten). Sprache in der Kopfzeile zuerst auf «Français», am Ende wieder auf «Deutsch» gestellt. Nichts gespeichert: Im Dialog «Terminer» habe ich nur Daten eingetippt und mit «Annuler» geschlossen; auf allen Seiten ging kein POST/PUT/DELETE an den Server (mitgeschnitten).

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-461/` (PDF und gerenderte Seiten unter `pdf/`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Aide, «Les termes en bref», «Frais d’administration» | Definiert die Verwaltungspauschale als «rémunération de votre travail de gestion», also der Verwaltung allgemein. Die eigene Kategorie «Administration» sagt das Gegenteil: «L’administration générale est couverte par le loyer», abrechenbar ist nur der Aufwand für die Nebenkostenabrechnung (art. 4, al. 3, OBLF). Zusammen mit «un taux plus élevé doit correspondre à votre travail effectif» begründet ein Vermieter einen höheren Satz womöglich mit seiner allgemeinen Verwaltungsarbeit. Genau dort setzt ein Mieterverband an. |
| P-2 | Minor | PDF, Seite 2, «Remarques» | «Seuls les frais accessoires convenus dans le contrat de bail sont décomptés : Ascenseur, …, Ramonage.» Auf Seite 1 stehen aber zusätzlich «Frais d’administration : 3 % …» (CHF 98.52). Sie fehlen in dieser Liste, und eine Rechtsgrundlage nennt das PDF nicht. Ein Mieter liest daraus: Die Pauschale ist nicht vereinbart, also ist sie nicht geschuldet. |
| P-3 | Minor | Dialog «Terminer le contrat de bail», Feld «Fin du contrat» | «Le dernier jour du bail, c’est-à-dire le terme de congé»: Das setzt das Vertragsende dem Kündigungstermin gleich. Dieselbe Warnung im Dialog nennt aber selbst die Ausnahmen, bei denen das nicht gilt (Ende im Einvernehmen, Ersatzmieter). Bei Tod des Mieters (Hinweis im selben Dialog) gilt es auch nicht. Der Text widerspricht sich. |
| P-4 | Minor | Dialog «Terminer le contrat de bail», Feld «Résiliation reçue le» | Nur die Form der Mieterkündigung wird genannt («La résiliation du locataire doit être donnée par écrit», Zustimmung des Ehegatten). Kündigt der Vermieter, steht nichts zu seiner Pflicht: amtliches Formular (art. 266l, al. 2, CO), bei Familienwohnung separat an beide Ehegatten (art. 266n CO), sonst ist die Kündigung nichtig (art. 266o CO). Der Dialog fragt nicht, wer gekündigt hat. |
| P-5 | Minor | Aide, «Terme de congé» | «… ou, s’il n’en fixe aucun, un terme usuel du lieu»: Es fehlt der gesetzliche Ersatz, wenn es keinen Ortsgebrauch gibt: «à défaut, la fin d’un trimestre de bail» (art. 266c CO). |
| P-6 | Nit | Aide, «Délai de congé», und Warnung im Dialog «Terminer» | «un locataire de remplacement que vous ne pouvez raisonnablement refuser»: Es fehlt «solvable» (art. 264, al. 1, CO). Es fehlt auch, dass er den Vertrag zu den gleichen Bedingungen übernehmen muss. |
| P-7 | Nit | Contrat de bail (Detail), «Frais d’administration» | Wert «Convenus, taux de l’établissement des décomptes»: Das ist schwer lesbar und klingt wie «der Satz der Einrichtung». Gemeint ist: vereinbart, Satz wird beim Erstellen der Abrechnungen gewählt. |
| P-8 | Nit | Décompte (Detail) und PDF, Clés de répartition | Die Begriffe wechseln zwischen «logement» und «appartement»: Schlüssel «Par logement», «1 / 6 logements», «Part du logement», aber «Appartement 2.01», in der Schlüssel-Hilfe «à parts égales par appartement», «{units} 1 pour chaque appartement». Ein Mieter fragt, ob das zwei verschiedene Bezugsgrössen sind. |
| P-9 | Nit | PDF, Seite 1 | Die Zeile «Montant à payer avant arrondi» bricht in der Bezeichnungsspalte um («Montant à payer avant» / «arrondi»), obwohl rechts genug Platz ist. |

## Beobachtungen

- **Bezeichnung der Verwaltungspauschale:** UI und PDF schreiben einheitlich «Frais d’administration». Die OBLF sagt in art. 4, al. 3 «frais administratifs». «Frais d’administration» ist in der Romandie gebräuchlich und nicht falsch. Dass die Basis offengelegt wird («3 % du sous-total de CHF 3'283.86»), ist gut nachvollziehbar.
- **«Répercutable»:** Der Hilfetext ist sachlich richtig und nennt die Voraussetzung, dass jede Kostenart im Vertrag einzeln genannt ist (die Kategorienseite zitiert dazu art. 257a, al. 2, CO). Gesetzlich ist das Wort nicht, das Gesetz spricht von «frais accessoires». Als Praxiswort ist es verständlich.
- **«Délai de congé»:** Die Hilfe stimmt mit art. 266a, al. 2 und art. 266c CO überein (3 Monate, zu spät gilt auf den nächsten Termin). Die Warnung im Dialog erschien bei Eingang 19.10.2026 und Ende 19.11.2026 korrekt: «Il y a moins de 3 mois entre la réception et la fin du contrat. La résiliation ne vaut alors probablement que pour le terme de congé suivant. …». Das «probablement» ist vorsichtig, das finde ich angemessen. Bei Ende 31.01.2027 verschwand die Warnung. Ob der 31.01. ein Kündigungstermin ist, prüft Dwello nicht. Der statische Text sagt aber, man solle Frist und Termin im Vertrag prüfen.
- **Kategorienbegründungen:** Die Zitate stimmen, soweit ich sie kenne: art. 5, al. 2, let. d OBLF (Ramonage), let. e (Entkalken), let. h (Versicherung Heizung), let. i (Verwaltungsarbeit Heizung), art. 4, al. 3 OBLF (Administration), art. 256b CO (Versicherung, Steuern). «Conciergerie» grenzt Verwaltung und Reparaturen richtig ab. Uneinheitlich, aber vertretbar: Manche Kategorien begründen mit art. 257a, al. 1 CO, andere (Eau froide, Eaux usées, Ordures) mit art. 257b, al. 1 CO.
- «Lutte antiparasitaire» und «Maintenance des extincteurs» verweisen auf das Merkblatt des Deutschschweizer Mieterinnen- und Mieterverbands («en allemand»). Ein Romand würde bei der ASLOCA nachsehen. Fachlich ist das kein Fehler.
- **Demodaten, kein Textfehler:** Die Rechnungen «Wasser und Abwasser Q1–Q4 2025» stehen unter «Eau froide», obwohl es eine eigene Kategorie «Eaux usées» gibt. Deren Begründung nimmt die Regenwassergebühr aus. Ein Mieter könnte fragen, ob darin Regenwasser steckt. Die Rechnungstexte sind deutsch, weil die Demodaten deutsch sind.
- Die Abrechnungsnummer heisst auch auf Französisch «NK-11111111-2025-0003» (NK = Nebenkosten). Romands verstehen die Abkürzung nicht, sie stört aber nicht.
- Die PDF-Bemerkungen zu art. 257b, al. 2 CO (Belegeinsicht) und art. 8, al. 1 und 2 OBLF (detaillierte Heizkostenabrechnung, Auskunft über Anfangs- und Endbestand) sind korrekt und vollständig. Die Bestandesrechnung des Heizöls auf Seite 2 ist sauber.
- Das PDF kam auf Französisch, auch nachdem ich die Oberfläche wieder auf Deutsch gestellt hatte. Es folgt offenbar der Sprache des Mieters, das ist richtig so.
- Die Sprache steht in einem Cookie (`PARAGLIDE_LOCALE=fr`). Ein neues Browserfenster öffnete wieder auf Deutsch, obwohl ich vorher «Français» gewählt hatte. Die Persona-Anleitung sagt, die Sprache sei am Konto gespeichert. Das habe ich nicht weiter geprüft.
- «Vos frais accessoires» im Abrechnungsdetail der Vermieteransicht: Gemeint ist der Anteil des Mieters, die Vermieterin liest aber «Ihre». Im Deutschen heisst es ebenso «Ihre Nebenkosten». Auf dem PDF passt die Anrede, in der Oberfläche ist sie leicht irreführend.

## Aufgabe geschafft: ja

## Aufwand

Etwa 30 Minuten, 17 Skripte. Ein Umweg: Der Sprachwechsel galt nur für die jeweilige Browsersitzung, also stellte ich ihn in jedem Skript neu ein. Der Button heisst «Terminer», nicht «Résilier», das kostete einen Suchschritt.

## Ablauf

1. **Sprache umstellen.** Erwartet: Sprachwahl in der Kopfzeile. Gesehen: Knopf «Sprache: Deutsch», Menü mit «Français». Nach der Wahl war die ganze Oberfläche französisch (Screenshot `03-dashboard-fr.png`).
2. **Abrechnungsliste.** Erwartet: Abrechnung Pierre Dubois 2025 als Entwurf. Gesehen: «Pierre Dubois, NK-11111111-2025-0003, Musterhaus Zentrum, Appartement 2.01, Montant à payer CHF 142.35, Brouillon» (`04-statements.png`).
3. **Detail der Abrechnung.** Erwartet: Kategorien, Schlüssel und Pauschale auf Französisch. Gesehen: Kategorien Ascenseur, Conciergerie, Eau froide, Électricité des parties communes, Entretien du jardin, Enlèvement des ordures, Chauffage, Ramonage. Schlüssel «Par logement», «Par surface (m²)», «Chauffage (surface 70 % / logement 30 %)». Dann «Sous-total CHF 3’283.86 · Frais d’administration 3 % du sous-total CHF 98.52 · Vos frais accessoires CHF 3’382.38 · Acomptes − CHF 3’240.00 · Arrondi à 5 centimes − CHF 0.03 · Solde : Montant à payer CHF 142.35». Der Hinweis zum Heizprofil ist verständlich: «Chauffage Plateau (non appliqué : contrat de bail sur toute la période)» (`05-dubois-detail.png`).
4. **PDF.** Erwartet: dieselben Begriffe wie in der Oberfläche, auf Französisch. Gesehen: Sie stimmen überein, mit der Herleitung je Zeile («1 / 6 logements», «85.00 / 492.50 m²», «70 % × … + 30 % × …»). Auf Seite 2 stehen die Erläuterung der Spalten, die Bestandesrechnung des Heizöls, die «Remarques» (dazu P-2) und der QR-Einzahlungsschein «Section paiement» (`pdf/p-1.png`, `pdf/p-2.png`).
5. **Hilfe, «Les termes en bref».** Erwartet: Erklärungen zu répercutable, frais d’administration, délai de congé. Gesehen: Alle drei sind vorhanden. «Frais d’administration» siehe P-1, «Terme de congé» siehe P-5, «Délai de congé» siehe P-6 (`06-help.png`).
6. **Kategorien.** Erwartet: Begründung der Umlagefähigkeit pro Kategorie. Gesehen: Liste mit Begründung und Gesetzesartikel. Das Bearbeitungsformular von «Conciergerie» und «Administration» zeigt dieselbe Begründung unter der Wahl «Répercutable / Non répercutable» (`07-categories.png`, `08-cat-conciergerie.png`, `09-cat-administration.png`). Nichts gespeichert.
7. **Verteilschlüssel.** Gesehen: «Par logement», «Par surface (m²)», «Par pièce», «Chauffage (surface 70 % / logement 30 %)», mit Formelhilfe (`10-keys.png`). Zu den Begriffen siehe P-8.
8. **Mietvertrag Pierre Dubois.** Erwartet: Knopf «Résilier». Gesehen: «Terminer». Der Vertrag zeigt «Frais d’administration : Convenus, taux de l’établissement des décomptes» (P-7) und die vereinbarten Nebenkosten (`11-contract-dubois.png`).
9. **Dialog «Terminer».** Eingang 19.10.2026 (heute) und Ende 19.11.2026 eingetippt. Erwartet: Warnung zur Kündigungsfrist. Gesehen: die Warnung (siehe Beobachtungen) mit Warnsymbol und Text, nicht nur farbig (`13-end-dialog-filled.png`). Bei Ende 31.01.2027 verschwindet sie (`14-end-dialog-3m.png`). Dann «Annuler», kein Request gesendet.
10. **Sprache zurück.** Über die Kopfzeile «Deutsch» gewählt, die Oberfläche ist wieder deutsch (`15-back-de.png`). Zum Vergleich gelesen: Die deutsche Hilfe sagt bei «Verwaltungspauschale» «Die Abgeltung Ihres Verwaltungsaufwands». P-1 besteht also auch auf Deutsch, im Französischen wiegt es mit «travail de gestion» (= Liegenschaftsverwaltung) schwerer.

## Verwirrung

- «Terminer» statt «Résilier»: Wer eine Kündigung erhalten hat, sucht «Résilier». «Terminer» passt zwar auch für befristete Verträge und das Ende im Einvernehmen. Der Dialog spricht danach aber von «terme de congé».
- «Convenus, taux de l’établissement des décomptes» (P-7).
- «Vos frais accessoires» in der Vermieteransicht.
- «logement» und «appartement» nebeneinander (P-8).
- «Administration» (Kategorie, non répercutable) neben «Frais d’administration» (wird verrechnet): Die Begründung der Kategorie erklärt den Unterschied gut. Die Hilfe sagt aber etwas anderes (P-1).

## Fehlerrisiken

- **Verwaltungspauschale auf der Zwischensumme samt Heizung:** Die Kategorie «Administration» sagt selbst, die Verwaltungsarbeit der Heizung gehöre in die Heizkosten (art. 5, al. 2, let. i, OBLF). Die 3 % werden aber auch auf die Heizkosten gerechnet. Enthält die Heizrechnung schon Verwaltungsaufwand, kann ein Mieterverband eine doppelte Verrechnung rügen. Das ist eine Frage der Praxis, kein Textfehler, aber ein Angriffspunkt.
- P-1 kann einen Vermieter dazu bringen, einen höheren Satz mit der allgemeinen Verwaltung zu begründen. Das ist anfechtbar.
- P-4: Ein Vermieter, der selbst kündigt und den Dialog als Anleitung liest, erfährt nichts vom amtlichen Formular. Ohne Formular ist die Kündigung nichtig.
- P-2: Der Mieter bestreitet die CHF 98.52 mit dem eigenen Satz des PDFs.

## Vorschläge

- **P-1:** Hilfe → «Les termes en bref» → «Frais d’administration». Vorschlag: «Le dédommagement du travail lié à l’établissement du décompte des charges (art. 4, al. 3, OBLF) : un pourcentage … L’administration générale de l’immeuble est couverte par le loyer.» Ebenso im Deutschen: «Abgeltung des Aufwands für die Nebenkostenabrechnung».
- **P-2:** Décomptes → Pierre Dubois NK-11111111-2025-0003 → «Télécharger le PDF», Seite 2 «Remarques». Vorschlag: einen Satz ergänzen, etwa «Les frais d’administration sont convenus dans le contrat de bail (art. 4, al. 3, OBLF).», oder in der Zeile auf Seite 1 «convenus dans le contrat de bail» nennen. Nur drucken, wenn der Vertrag die Pauschale vereinbart.
- **P-3:** Contrats de bail → Pierre Dubois → «Terminer», Hilfe zu «Fin du contrat». Vorschlag: «Le dernier jour du bail : en règle générale le terme de congé, ou la date convenue avec le locataire.»
- **P-4:** Gleicher Dialog, Feld «Résiliation reçue le». Vorschlag: ein Satz für die Vermieterkündigung, etwa «Si vous résiliez vous-même : formule officielle obligatoire, pour le logement de la famille envoyée séparément aux deux conjoints (art. 266l à 266o CO).»
- **P-5:** Hilfe → «Terme de congé». Ergänzen: «… à défaut d’usage local, la fin d’un trimestre de bail (art. 266c CO).»
- **P-6:** Hilfe → «Délai de congé» und die Warnung im Dialog «Terminer» (Eingang 19.10.2026, Ende 19.11.2026): «un locataire de remplacement solvable, disposé à reprendre le bail aux mêmes conditions, que vous ne pouvez raisonnablement refuser».
- **P-7:** Contrats de bail → Pierre Dubois. Vorschlag: «Convenus ; taux choisi lors de l’établissement des décomptes».
- **P-8:** Abrechnung und PDF Pierre Dubois sowie Clés de répartition. Ein Wort durchziehen. In der OBLF und der Romandie ist «logement» üblich, die Wohnungsbezeichnung «Appartement 2.01» kann bleiben. Die Formelhilfe sollte dann «par logement» sagen.
- **P-9:** PDF Seite 1. Die Bezeichnungsspalte der Summenzeilen breiter machen, damit «Montant à payer avant arrondi» auf eine Zeile passt.

## Nicht geprüft

- Italienisch und Englisch: nicht Teil der Aufgabe.
- Ob «Remarques» die Verwaltungspauschale nennt, wenn ein Vertrag sie nicht vereinbart: Dafür hätte ich Daten ändern müssen, Speichern war nicht erlaubt.
- Den Versand per E-Mail und das Mahnwesen habe ich nicht ausgelöst (Speichern bzw. Senden war nicht Teil der Aufgabe).
- Beträge und Rundung habe ich nur überschlagen (85 / 492.50 = 17.26 %, 1/6 = 16.67 %, 3 % von 3’283.86 = 98.52). Die Prüfung der Beträge ist Sache des Daten-Prüfers.
- Die Kategorieübersetzungen im Formular (Felder «Français (facultatif)» usw.) habe ich nicht geöffnet. Ihre Werte stehen nicht im sichtbaren Text, und Speichern war nicht erlaubt.
