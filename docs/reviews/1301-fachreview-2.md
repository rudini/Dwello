# Fachreview #1301, Runde 2 (Feature-Review, Schritt 5)

Gegenstand: Commit 83ecc9e, Worktree `review-1301-fach2`. Geprüft wurden die drei Punkte des Aufrufers: Weber P-2, Weber P-3 und Code-Review C-1.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | `segmentLineProfile` nennt «{profileShare} % der Heizkosten nach Heizprofil». Gerechnet wird aber je Rechnung nach ihrem Leistungszeitraum. Nur eine Rechnung, die auch andere Tage betrifft, wird nach den Monaten des Heizprofils geteilt. Weber P-2 bestätigt. Neuer Text unten. |
| M-1 | Mietrecht | Major | Letzter Satz von `apartments_form_size_from_help` (Runde 1, M-1 «unsicher»): Die Erhöhung von Nettomiete oder Akonto ohne amtliches Formular fehlt, nach Art. 269d Abs. 2 OR ist sie dann nichtig. Ausserdem fehlt der Tag des Mieters. Weber P-3 bestätigt bis auf «schriftlich nötig» (siehe unten). Neuer Text unten. |
| V-2 | Verwalter | Minor | Fallen alle Monate im Leistungszeitraum einer Heizrechnung auf 0 % im Heizprofil, teilt `groupIn` die Rechnung nach Tagen (`prorating.service.ts:352`, `whole > 0 ? … : dayCount`). Das sagen weder V-1 noch `heatingNoteParts`/`heatingNoteOwn`. Fix: in `heatingNoteOwn`/`heatingNoteParts` anhängen «Haben diese Monate im Heizprofil zusammen 0 %, wird die Rechnung nach Tagen geteilt.» |

Kein Befund zu C-1: Im Kopf steht die Fläche des ersten abgerechneten Tages. Das ist richtig (Begründung unten).

## V-1: Die Zeile Heizung nennt eine Grundlage, nach der nicht gerechnet ist

**Beleg.** `backend/src/services/pdf-texts/de.ts:84` sagt «{profileShare} % der Heizkosten nach Heizprofil». `prorating.service.ts:347-356` (`groupIn`) setzt jede Rechnung mit ihren Tagen im Zeitraum an. Mit Heizprofil ist das ihr Gewicht `weight(start, end) / weight(invoice.start, invoice.end)`, also ihr eigener Leistungszeitraum. `profileShare` = Kosten des Zeitraums / Kosten der Gruppe (`:395`).

**Nachgerechnet:**
- Weber (Fernwärme Q1–Q4, Schnitt 01.07.): Q1 und Q2 liegen ganz im ersten Zeitraum, also 100 % dorthin. CHF 2'310.00 / 4'115.00 = 56.14 %. Das Heizprofil Januar–Juni gäbe 55.8 %, also CHF 2'296.17. Wer mit dem Profil nachrechnet, kommt nicht auf den gedruckten Betrag.
- Eine Jahresrechnung CHF 4'115.00 ohne Leistungszeitraum (Tage = Abrechnungsperiode) wird nach dem Profil geteilt: 55.8 % = CHF 2'296.17. Hier stimmt «nach Heizprofil».
- Grenzfall: Eine Rechnung vom 01.06. bis 31.08. wird nach Juni zu Juli+August im Profil geteilt. Haben diese Monate 0 %, wird nach Tagen geteilt: 30/92 (siehe V-2).

**Warum falsch.** Der Mieter darf die Belege einsehen und nachrechnen. Art. 257b Abs. 2 OR (Stand 1. Oktober 2026): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Für Heizkosten gibt es zudem das Recht auf die detaillierte Abrechnung und auf die Originalunterlagen. Art. 8 Abs. 1 und 2 VMWG (Stand 1. Oktober 2025): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann. Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen […]». Nach der heutigen Zeile rechnet der Mieter mit den Belegen und dem Profil und bekommt einen anderen Betrag. Das ist die Lage eines Einwands, den ein Mieter bei der Schlichtungsbehörde erhebt.

Die Rechnung selbst ist richtig und bleibt. Eine Rechnung, die nur Tage eines Zeitraums betrifft, gehört diesem Zeitraum. Nur der Text ändert sich. Mit dem neuen Text widerspricht die Zeile auch der Detailseite nicht mehr («Heizprofil … nicht angewendet»). Der zweite Teil «Anteil nach Heizprofil {percent} %» ist der Anteil des Mieters im Zeitraum und bleibt. Seine Darstellung bei 100 % ist Weber P-7 (Minor) und nicht Gegenstand dieser Runde.

## M-1: Hilfetext «Neue Fläche und Zimmeranzahl gelten ab»

**Beleg.** `messages/de.json:230`, letzter Satz «Den Mietvertrag ändert Dwello dadurch nicht: Ist die Wohnung vermietet, passen Sie Nettomiete und Akonto dort an.»

**Warum falsch.** Ein Anfänger liest «passen Sie … an» als einfache Eingabe. Art. 269d OR (Stand 1. Oktober 2026), Abs. 1: «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen. Er muss dem Mieter die Mietzinserhöhung mindestens zehn Tage vor Beginn der Kündigungsfrist auf einem vom Kanton genehmigten Formular mitteilen und begründen.» Abs. 2: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; […]». Abs. 3: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.» Abs. 3 deckt auch eine Verkleinerung ab.

Das Akonto behandelt Dwello schon so: `contracts_advance_change_help` sagt «mit dem amtlichen Formular … Ohne Formular oder Begründung ist sie nichtig». Der neue Text verweist deshalb nur kurz darauf.

**Weber nur zum Teil bestätigt.** Eine Schriftform verlangt das Gesetz für die Vertragsänderung nicht. Art. 11 Abs. 1 OR (Stand 1. Oktober 2026): «Verträge bedürfen zu ihrer Gültigkeit nur dann einer besonderen Form, wenn das Gesetz eine solche vorschreibt.» Für den Mietvertrag schreibt das OR keine vor, und Art. 12 OR gilt nur für eine gesetzlich vorgeschriebene Schriftform. Schriftlich ist der Rat aus der Praxis, als Beweis. Der Text sagt deshalb «am besten schriftlich».

Webers zweiter Punkt stimmt aus Sicht der Praxis. Bei einer vermieteten Wohnung ist der Tag der Tag, ab dem die Änderung mit dem Mieter gilt. Erst ab diesem Tag trägt der Mieter den grösseren Anteil. Der Text sagt das jetzt.

Die ersten Sätze bleiben gleich wie in Runde 1. Neu ist nur das Ende (ab «Ist die Wohnung vermietet»).

## C-1: Welche Fläche im Kopf des PDFs steht

**Entscheid:** Die Fläche des ersten abgerechneten Tages des Mieters (`key_values.area[0]`) ist richtig. Der Text des Kopfs bleibt.

**Begründung:**
- Im Kopf steht, welche Wohnung abgerechnet wird. Die Werte, mit denen gerechnet ist, stehen in den Zeilen je Zeitraum. Teilt eine Änderung die Tage, nennt die Einleitung über den Kosten beide Werte (`sizeChangeIntro`: «Wohnung B2 hat ab 01.07.2025 170.00 m² und …, bis zum 30.06.2025 95.00 m² …»). «Wohnung B2, …, 95.00 m²» passt dazu und zur ersten Zeile «95.00 / 320.00 m²». Ein Widerspruch wie bei C-1 (140 m² im Kopf neben 70/210 ohne Erklärung) entsteht nicht mehr.
- Der Wert des letzten Tages wäre nicht richtiger, nur anders. Er stünde neben der ersten Zeile, und die Einleitung bräuchte es ebenfalls.
- Beide Werte im Kopf hätten keinen Nutzen und doppeln die Einleitung. Bei mehreren Änderungen würde der Kopf zudem unbegrenzt lang.
- Grenzfälle nachgeprüft:
  - Einzug am 01.08.2025, nach der Änderung: Im Kopf stehen 170 m², keine Einleitung zu B2 nötig.
  - Auszug am 31.05.2025: Im Kopf stehen 95 m².
  - Mit «Abgerechnet bis»: Der erste abgerechnete Tag ist der Tag danach, also der Wert dieses Tages.

  In allen drei Fällen ist das die Fläche, mit der gerechnet wurde.

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| segmentLineProfile (`backend/src/services/pdf-texts/*.ts`) | {start} – {end}, {count} Wohnungen, {profileShare} % der Heizkosten (Rechnungen für diese Tage; eine Rechnung, die auch andere Tage betrifft, nach den Monaten des Heizprofils geteilt){colon}{keyShare} × CHF {costs} = CHF {apartment} × Anteil nach Heizprofil {percent} % = CHF {share} | {start} – {end}, {count} appartements, {profileShare} % des frais de chauffage (factures pour ces jours ; une facture qui concerne aussi d’autres jours, répartie selon les mois du profil de chauffage){colon}{keyShare} × CHF {costs} = CHF {apartment} × part selon le profil de chauffage {percent} % = CHF {share} | {start} – {end}, {count} appartamenti, {profileShare} % delle spese di riscaldamento (fatture per questi giorni; una fattura che riguarda anche altri giorni, ripartita secondo i mesi del profilo di riscaldamento){colon}{keyShare} × CHF {costs} = CHF {apartment} × quota secondo il profilo di riscaldamento {percent} % = CHF {share} | {start} – {end}, {count} apartments, {profileShare} % of the heating costs (invoices for these days; an invoice that also covers other days, split by the months of the heating profile){colon}{keyShare} × CHF {costs} = CHF {apartment} × share under the heating profile {percent} % = CHF {share} |
| apartments_form_size_from_help | Nur ausfüllen, wenn die Wohnung nach einem Umbau ab diesem Tag eine andere Fläche oder Zimmeranzahl hat, zum Beispiel nach einer Zusammenlegung. Bis zum Tag davor rechnen die Abrechnungen mit den bisherigen Werten, ab diesem Tag mit den neuen. Wollen Sie nur einen Fehler korrigieren, lassen Sie das Feld leer: Die Werte gelten dann für alle Abrechnungen, und wenn schon ein Tag erfasst ist, ab diesem Tag. Entwürfe, die Sie schon erstellt haben, berechnen Sie danach neu. Versendete Abrechnungen bleiben unverändert; eine berichtigte Abrechnung rechnet mit den Werten, die Sie hier speichern. Ist die Wohnung vermietet, vereinbaren Sie die Änderung mit dem Mieter, am besten schriftlich, und tragen Sie hier den Tag ein, ab dem sie gilt. Nettomiete und Akonto ändert Dwello nicht. Eine höhere Nettomiete oder ein höheres Akonto teilen Sie mit dem amtlichen Formular mit (Art. 269d OR), sonst ist die Erhöhung nichtig. Erfassen Sie die neuen Beträge danach im Mietvertrag. | Ne remplissez ce champ que si l’appartement a, dès ce jour, une autre surface ou un autre nombre de pièces après une transformation, par exemple après sa réunion avec un autre appartement. Jusqu’à la veille, les décomptes sont calculés avec les valeurs précédentes, dès ce jour avec les nouvelles. Si vous voulez seulement corriger une erreur, laissez ce champ vide : les valeurs valent alors pour tous les décomptes et, si un jour est déjà saisi, dès ce jour. Recalculez ensuite les brouillons que vous avez déjà établis. Les décomptes envoyés restent inchangés ; un décompte rectificatif est calculé avec les valeurs que vous enregistrez ici. Si l’appartement est loué, convenez de la modification avec le locataire, de préférence par écrit, et saisissez ici le jour dès lequel elle s’applique. Dwello ne modifie ni le loyer net ni l’acompte. Notifiez une hausse du loyer net ou de l’acompte au moyen de la formule officielle (art. 269d CO), sinon la hausse est nulle. Saisissez ensuite les nouveaux montants dans le contrat de bail. | Compili questo campo solo se dopo una ristrutturazione l’appartamento ha da questo giorno un’altra superficie o un altro numero di locali, per esempio dopo l’unione con un altro appartamento. Fino al giorno prima i conteggi sono calcolati con i valori precedenti, da questo giorno con quelli nuovi. Se vuole solo correggere un errore, lasci vuoto questo campo: i valori valgono allora per tutti i conteggi e, se è già registrato un giorno, da questo giorno. Ricalcoli poi le bozze che ha già allestito. I conteggi inviati restano invariati; un conteggio rettificato è calcolato con i valori che salva qui. Se l’appartamento è locato, concordi la modifica con l’inquilino, preferibilmente per scritto, e registri qui il giorno dal quale vale. Dwello non modifica né la pigione netta né l’acconto. Comunichi un aumento della pigione netta o dell’acconto con il modulo ufficiale (art. 269d CO), altrimenti l’aumento è nullo. Registri poi i nuovi importi nel contratto di locazione. | Fill this in only if, after a renovation, the apartment has a different area or number of rooms from this day, for example after it was merged with another apartment. Up to the day before, the statements are calculated with the previous values, from this day with the new ones. If you only want to correct a mistake, leave this field empty: the values then apply to all statements and, if a day is already recorded, from that day. Then recalculate the drafts you have already created. Sent statements stay unchanged; a corrected statement is calculated with the values you save here. If the apartment is rented, agree the change with the tenant, preferably in writing, and enter here the day from which it applies. Dwello does not change the net rent or the advance payment. Give notice of a higher net rent or advance payment on the official form (Art. 269d CO), otherwise the increase is void. Then enter the new amounts in the rental contract. |

(` ` steht für das geschützte Leerzeichen U+00A0; in `messages/fr.json` als Zeichen, in `pdf-texts/*.ts` als Escape wie bisher.)

## Nicht bestätigt

- **Formular für eine Erhöhung des Akontos:** Art. 269d Abs. 1–3 OR nennen den Mietzins und «neue Nebenkosten», das Akonto nicht ausdrücklich. Dass eine Erhöhung des Akontos das Formular braucht, steht so schon in `contracts_advance_change_help` (in der App entschieden). Fedlex gibt es nicht wörtlich her: **unsicher**. Der Rat, das Formular zu verwenden, schadet in keinem Fall. Gelesen habe ich Art. 257a, 257b, 269d OR.
- **Erhöhung mit Zustimmung des Mieters während der Mietdauer:** Ob eine Erhöhung, der der Mieter zustimmt, ohne Formular gültig ist, regelt kein Artikel. Das wäre Rechtsprechung des Bundesgerichts, die ich nicht gesucht habe. Der Text verlangt deshalb das Formular ohne Ausnahme.
- **Grösserer Anteil an den Nebenkosten ohne Vertragsänderung:** Ob der Mieter ab dem Tag der Fläche den grösseren Anteil schuldet, auch wenn die Vertragsänderung fehlt, steht in keinem Artikel (Art. 257a Abs. 2 OR verlangt die Vereinbarung der Nebenkosten, nicht die des Schlüssels). Der Text umgeht die Frage mit dem Tag der Vereinbarung.

Geprüft: `groupIn`/`partShare` (`prorating.service.ts:347-397`), `segmentLine`/`segmentIntros` (`pdf-segments.ts`), Kopf in `pdf.service.ts:225`, `sizeChangeIntro` in allen vier Sprachen, Webers Beträge 2'310.00 / 4'115.00 = 56.14 %.
