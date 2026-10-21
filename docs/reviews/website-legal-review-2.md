# Fachreview 2 (Re-Review): Impressum und Datenschutzerklärung der Marketing-Website

Gegenstand: Commit `1dcbc15c` (Branch `claude/dwello-marketing-page-s6uece`), `marketing/impressum.html`, `marketing/datenschutz.html` und die erstmals geprüften Übersetzungen `marketing/{fr,it,en}/impressum.html`, `marketing/{fr,it,en}/datenschutz.html` (erzeugt von `marketing/i18n/build.py` aus `marketing/i18n/*.json`). Vorbericht: `legal-fachreview-1.md` (R-1..R-9, M-1, V-1..V-3).
Gelesen wurde ausschliesslich der Stand des Commits über `git show 1dcbc15c:<pfad>` (Git-Objekte, unabhängig vom Arbeitsbaum des Aufrufers); ein eigener Worktree wurde nicht genannt.
Entscheid des Product Owners (gegeben): Betreiber «Roger Rudin, Schweiz», E-Mail info@dwello.ch, bewusst ohne Postadresse.
Fedlex: DSG (SR 235.1) italienisch und französisch Stand 7.7.2025, englisch (nicht amtlich) Stand 1.9.2023, über den Fedlex-Filestore.

Ergebnis: Alle Befunde aus Review 1 sind im deutschen Text richtig umgesetzt. Neu: ein Major in der italienischen Fassung (falscher Rechtsbegriff für den Verantwortlichen), sonst nur Minor und Nit.

## Status der Befunde aus Review 1

| ID | Status | Beleg |
|---|---|---|
| R-1 | erledigt | datenschutz.html:74 «Wir speichern alle Daten in der Schweiz und geben keine ins Ausland weiter.»; :91 Hinweis zur Antwort an den E-Mail-Anbieter |
| R-2 | erledigt | impressum.html:84 «Die Rechte … liegen beim Betreiber oder bei den Personen, die sie geschaffen haben …», AGPL-Hinweis |
| R-3 | erledigt | impressum.html:85 Copyright-Zeilen und Links auf die Lizenztexte von Inter und Lucide (Link statt abgedrucktem Text: übliche Praxis) |
| M-1 | erledigt | impressum.html:77 «nach dem Mietrecht (Obligationenrecht und Verordnung über die Miete) … Massgebend ist, was Ihr Mietvertrag als Nebenkosten vereinbart.» |
| V-1 | erledigt | impressum.html:81 «Die Adressen sind frei gewählt; die Gebäude an diesen Adressen haben mit Dwello nichts zu tun.» |
| R-4 | erledigt | datenschutz.html:91 «ausser das Gesetz verpflichtet uns dazu» |
| R-5 | erledigt | datenschutz.html:101 «jederzeit», EDÖB-Adresse, Zivilgericht |
| R-6 | erledigt | datenschutz.html:100 «kostenlos … innert 30 Tagen» |
| R-7 | erledigt | datenschutz.html:94 Kriterium «so lange …, wie es für Betrieb und Sicherheit nötig ist» (Dauer weiter nicht bestätigt, siehe unten) |
| R-8 | erledigt | datenschutz.html:86 «Wir veröffentlichen Ihre Nachricht nicht, auch nicht auf GitHub, ausser Sie sind einverstanden.» |
| R-9 | erledigt | impressum.html:76 «soweit das Gesetz es zulässt» |
| V-2 | erledigt | datenschutz.html:67 Lead in vier kurze Sätze geteilt; Footer «© 2026 Roger Rudin» (impressum.html:89, datenschutz.html:109, index.html) |
| V-3 | geprüft | Übersetzungen nehmen alle Änderungen mit; Befunde R-10, R-12, V-4 bis V-9 |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-10 | Rechtstexte | Major | it/datenschutz.html:77 Überschrift «Responsabile»: Im LPD bedeutet «responsabile del trattamento» den Auftragsbearbeiter (Art. 5 lett. k); der Verantwortliche heisst «titolare del trattamento» (Art. 5 lett. j, Art. 19 cpv. 2 lett. a). Ersetzen durch «Titolare del trattamento». |
| R-11 | Rechtstexte | Minor | Restrisiko des PO-Entscheids: ohne Postadresse nur Name, Land und E-Mail (impressum.html:69–70, datenschutz.html:78–79, alle Sprachen). Art. 19 Abs. 2 lit. a DSG verlangt «Identität und Kontaktdaten»; ob E-Mail allein genügt und ob Art. 3 Abs. 1 lit. s UWG greift, ist **unsicher**. Hinnehmen; bei einem Angebot gegen Entgelt neu prüfen. |
| V-4 | Verwalter | Minor | it/datenschutz.html:71 «non misura ciò che fa»: ohne Subjekt liest es sich als «misst nicht, was sie (die Website) tut». Fix: «non misura ciò che Lei fa». |
| R-12 | Rechtstexte | Nit | Auftragsbearbeitung: fr/datenschutz.html:91 «sur notre mandat», it/datenschutz.html:91 «su nostro incarico». Das Gesetz sagt «pour le compte du responsable du traitement» bzw. «per conto del titolare del trattamento» (Art. 5 let./lett. k). Fix: «pour notre compte» bzw. «per nostro conto». |
| V-5 | Verwalter | Nit | fr/impressum.html:76 «Vous trouvez le code source», en/impressum.html:76 «You find the source code»: unidiomatisch. Fix: «Vous trouverez …» bzw. «The source code is on GitHub.» |
| V-6 | Verwalter | Nit | fr/datenschutz.html:86 «pas non plus sur GitHub» holpert. Fix: «Nous ne publions votre message nulle part, ni sur GitHub, sauf si vous êtes d’accord.»; :105 «État : 21 octobre 2026» in der Schweiz üblich «État au 21 octobre 2026». |
| V-7 | Verwalter | Nit | Französisch: Doppelpunkte mit normalem Leerzeichen (fr/impressum.html:70, fr/datenschutz.html:79, :83, :101, :105), in fr/index.html sonst geschütztes Leerzeichen. Fix: U+00A0 vor «:» in fr.json. |
| V-8 | Verwalter | Nit | Englisch: en/impressum.html:77 «what your rental contract agrees as utility costs» → «what your rental contract sets out as utility costs»; en/datenschutz.html:100 «The information is free» → «Access is free of charge». |
| V-9 | Verwalter | Nit | Ausserhalb der Rollen, aber sachlich falsch: In allen sechs übersetzten Seiten zeigt `hreflang="de-CH"` auf die Seite selbst (fr/impressum.html:10 `href="impressum.html"` statt `../impressum.html`; ebenso it/en und datenschutz). build.py:73 schreibt nur Links mit `hreflang="de"` hinter `href` um. Besteht schon in {fr,it,en}/index.html:11 im Basis-Commit; die Änderung trägt den Fehler auf sechs neue Seiten. |
| R-13 | Rechtstexte | Nit | Das «wir» in beiden Texten (z. B. datenschutz.html:84, :86) bei einem einzelnen privaten Betreiber: zulässig, kann aber ein Team vortäuschen (schon in Review 1 erwähnt). Optional «ich» oder so lassen. |

## Einzelheiten

### R-10 (Major): «Responsabile» in der italienischen Datenschutzerklärung
- Beleg: it/datenschutz.html:77 `<h2>Responsabile</h2>` gefolgt von «Roger Rudin, Svizzera» (:78). Quelle in `marketing/i18n/it.json` (Schlüssel zur deutschen Überschrift «Verantwortlich»).
- Fedlex, LPD Art. 5: «j. titolare del trattamento: il privato o l’organo federale che, singolarmente o insieme ad altri, determina lo scopo e i mezzi del trattamento; k. responsabile del trattamento: il privato o l’organo federale che tratta dati personali per conto del titolare del trattamento.» Art. 19 cpv. 2: «… fornisce almeno le informazioni seguenti: a. l’identità e i dati di contatto del titolare del trattamento; …»
- Warum: Die Überschrift nennt den Betreiber mit dem Gesetzesbegriff für den Auftragsbearbeiter. Eine italienischsprachige Leserin muss annehmen, Roger Rudin bearbeite nur im Auftrag eines anderen, dessen Identität fehlt. Damit ist die Pflichtangabe nach Art. 19 cpv. 2 lett. a in dieser Fassung irreführend. (Im Französischen ist «Responsable» richtig: Art. 5 let. j «responsable du traitement»; im Englischen «Controller» ebenfalls: nicht amtliche Übersetzung «j. controller means a private person who … determines the purpose and the means of processing personal data».)
- Fix: «Titolare del trattamento» in it.json, Seite neu erzeugen. Weil im Absatz :91 Infomaniak tatsächlich «responsabile del trattamento» ist, könnte man dort zur Klarheit «Infomaniak tratta … per nostro conto, in qualità di responsabile del trattamento» schreiben (optional).

## Bestätigt

- **Deutsch, Copy-Regeln:** formelles «Sie», durchgehend «ss» (kein «ß»), kurze Sätze; Fachbegriffe nur die gesetzlichen (EDÖB, Auftrag). «Verordnung über die Miete» ist eine Kurzform des amtlichen Titels, als Erklärung für Laien vertretbar.
- **Inhalt Deutsch:** Art. 19 Abs. 2 lit. a–c DSG abgedeckt (siehe Review 1); «Kurz gesagt» (:74) und der Hinweis zur Antwort an einen ausländischen Anbieter (:91) widersprechen sich nicht: Die Antwort geht an die betroffene Person selbst über den von ihr gewählten Anbieter, der Betreiber gibt keine Daten an Dritte im Ausland bekannt.
- **Treue der Übersetzungen:** Alle drei Sprachen geben jeden deutschen Satz beider Seiten inhaltlich wieder, einschliesslich der Änderungen aus Review 1 (R-1, R-2, R-3, R-4 bis R-9, M-1, V-1, V-2). Kein deutscher Rest im sichtbaren Text oder in `aria-label`, Titel und Beschreibung (Ausnahmen: Eigennamen, Adresse «Feldeggweg 1», Dateinamen).
- **Anrede:** vous (fr), Lei mit grossem Anfangsbuchstaben bei Sua/Suoi/Le (it, wie in it/index.html), you (en); einheitlich in beiden Seiten.
- **Rechtsbegriffe Französisch:** «responsable» (Art. 5 let. j LPD), «Préposé fédéral à la protection des données et à la transparence (PFPDT)» (Fedlex, Titel vor Art. 43 LPD: «Préposé fédéral à la protection des données et à la transparence»), «droit d’accès»-Inhalt «Le renseignement est gratuit» entspricht Art. 25 al. 6 LPD «Le responsable du traitement fournit gratuitement les renseignements demandés.», «droit du bail», «Code des obligations», «ordonnance sur le bail à loyer» (Kurzform der OBLF), «frais accessoires», «contrat de bail», «décompte» (i18n-begriffe.md:29, :72–74).
- **Rechtsbegriffe Italienisch** (ausser R-10): «Incaricato federale della protezione dei dati e della trasparenza (IFPDT)» (Fedlex: «L’Incaricato federale della protezione dei dati e della trasparenza …»), «L’informazione è gratuita» entspricht Art. 25 cpv. 6 LPD «Il titolare del trattamento fornisce gratuitamente le informazioni.», «Codice delle obbligazioni», «ordinanza sulla locazione» (Kurzform der OLAL), «spese accessorie», «contratto di locazione», «conteggio», «Fa stato» (Schweizer Rechtssprache).
- **Rechtsbegriffe Englisch:** «Controller» und «Federal Data Protection and Information Commissioner (FDPIC)» wie in der nicht amtlichen Fedlex-Übersetzung («The Federal Data Protection and Information Commissioner (FDPIC) supervises …»); «utility costs», «rental contract», «statements», «landlord» wie i18n-begriffe.md:27, :29, :72, :74; britische Schreibweise einheitlich (licence, analyse, centres).
- **Konsistenz mit der Website:** «Mentions légales», «Déclaration de protection des données», «Note legali», «Informativa sulla protezione dei dati», «Legal notice», «Privacy statement» in Header, Footer und index.html gleich; «e-mail» (fr/it) und «email» (en) wie i18n-begriffe.md:26.
- **Footer und Copyright:** «© 2026 Roger Rudin» in allen Seiten und Sprachen, deckt sich mit Impressum und Verantwortlichem.

## Begriffe

Keine fehlenden Domänenbegriffe; die Seiten verwenden nur Nebenkosten, Mietvertrag, Abrechnung und Mieterinnen und Mieter aus `UBIQUITOUS_LANGUAGE.md` bzw. ihre Entsprechungen aus i18n-begriffe.md. Kein Issue nötig.

## Nicht bestätigt

- **Postadresse/Kontaktdaten (R-11):** Ob eine E-Mail-Adresse allein «Kontaktdaten» nach Art. 19 Abs. 2 lit. a DSG und «Kontaktadresse» nach Art. 3 Abs. 1 lit. s UWG erfüllt, entscheidet der Fedlex-Wortlaut nicht; Lehrmeinungen nicht geprüft. **unsicher**.
- **Infomaniak:** Firmenname und Sitz «Infomaniak Network SA, Genf» und die Log-Dauer nicht geprüft (Infomaniak-Website und Handelsregister aus dieser Umgebung in Review 1 nicht erreichbar; hier nicht erneut versucht).
- **Amtliche Kurztitel der VMWG in fr/it:** nicht auf Fedlex nachgeschlagen; die Kurzformen folgen i18n-begriffe.md:85 (OBLF, OLAL).
- **Englische DSG-Fassung:** für den Stand 7.7.2025 im Filestore nicht vorhanden; geprüft gegen die Fassung vom 1.9.2023 (nicht amtlich).
- **Lucide-Lizenz:** ob der Hausumriss im Logo aus einem Feather-Icon (MIT) stammt, für das Lucides LICENSE einen eigenen Hinweis vorsieht, nicht geprüft.

## Round 2b (Commit 1c4bc2ec)

Gelesen über `git show 1c4bc2ec:<pfad>`.

| ID | Status | Beleg |
|---|---|---|
| R-10 | erledigt | it/datenschutz.html:77 «Titolare del trattamento» (LPD Art. 5 lett. j) |
| V-4 | erledigt | it/datenschutz.html:71 «non misura ciò che Lei fa» |
| R-12 | erledigt | fr/datenschutz.html:91 «pour notre compte», it/datenschutz.html:91 «per nostro conto» (Art. 5 let./lett. k) |
| V-5 | erledigt | fr/impressum.html:76 «Vous trouverez …», en/impressum.html:76 «The source code is on GitHub.» |
| V-6 | erledigt | fr/datenschutz.html:86 «… nulle part, ni sur GitHub ni ailleurs, sans votre accord», :105 «État au 21 octobre 2026» |
| V-7 | erledigt | Alle Doppelpunkte im Text beider französischen Rechtsseiten mit U+00A0 (impressum 1, datenschutz 4 inkl. meta description), kein normales Leerzeichen vor «:» mehr |
| V-8 | erledigt | en/impressum.html:77 «sets out as utility costs», en/datenschutz.html:100 «Access is free of charge, and you receive the information within 30 days» |
| V-9 | erledigt | build.py: neue Regel für `hreflang="de-CH"`; alle neun übersetzten Seiten (index, impressum, datenschutz × fr/it/en) zeigen auf `../<seite>.html` |
| R-11 | offen, vom PO akzeptiert | unverändert, Minor |
| R-13 | offen, optional | unverändert, Nit |

Neu: nichts ausser einer Kleinigkeit. fr/datenschutz.html:86 «nulle part, ni sur GitHub ni ailleurs» sagt dasselbe zweimal; «Nous ne publions votre message nulle part, pas même sur GitHub, sans votre accord.» wäre knapper. Optional, keine ID. Die Fixes bleiben treu zum deutschen Text; keine neuen deutschen Reste.

Offene Blocker/Major: keine.
