# Fachreview 521-2: Brief zur Zustimmung zu einer neuen Abrechnungsperiode (Umsetzung)

Gegenstand: `git diff c9b8e27 45d9cdc` im Worktree `/tmp/scratchpad/review-521-fach-reviewer`; Vorbericht `docs/reviews/521-fachreview-1.md`.
Fedlex: OR (SR 220) Stand 1. Oktober 2026, VMWG (SR 221.213.11) Stand 1. Oktober 2025, beide heute noch in Kraft (SPARQL, 01.11.2026). Die Zitate aus 521-1 gelten weiter.

Geschlossen: V-1, V-2, V-3, V-4, V-5, V-6, M-1, M-2

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-7 | Verwalter | Minor | `backend_consent_letter_none` erscheint nie. `src/routes/contracts/[id]/consent-letter/+server.ts:8-9` reicht die 409 über `proxyFile` (`file-proxy.ts:9`, `attachment`) als Download weiter. Der Vermieter erhält eine Datei mit dem englischen Backend-Text. Fix: Bei `!response.ok` die Meldung mit `backendMessage()` als Seite zeigen (eigener Zustand in `screens.json`), dazu ein DOM- oder E2E-Test. |
| V-8 | Verwalter | Minor | Der Text von `backend_consent_letter_none` ist im einzigen erreichbaren Fall falsch. Der Link erscheint nur bei `consent` (`statement-run.service.ts`, `missingOfContract`). Die Ablehnung kommt also nur bei einer veralteten Seite, meist weil die kurze Abrechnungsperiode inzwischen abgerechnet ist (`open` false, `accounting-period.ts:172`). Dann stimmt «hat … nicht gewechselt» nicht. «Seite des Mietvertrags» ist falsch, wenn der Link im Assistenten stand. Fix: Wortlaut unten. |
| V-9 | Verwalter | Minor | Der Dateiname `Zustimmung-Abrechnungsperiode-<Wohnung>.pdf` (`consent-letter.service.ts:39`) nennt nur die Wohnung. Bei einem Mieterwechsel in der kurzen Abrechnungsperiode bietet Schritt 2 zwei Briefe mit demselben Namen an. Die Mahnung benennt ihre Datei nach dem Titel in der Sprache des Briefs (`reminder.service.ts:151`). Fix: `${letter.title} ${Wohnung} ${Nachname}.pdf`, über `file-response.ts` (ASCII- und UTF-8-Name). |
| V-10 | Verwalter | Minor | Den Brief gibt es erst, wenn die kurze Abrechnungsperiode zu Ende ist. Er hängt an den fehlenden Abrechnungen (`missingWays`, nur beendete Perioden). Im Szenario kommt er am 01.11.2026 für die Periode 2026, die fast vorbei ist. In der Praxis holt man die Zustimmung vor Beginn der neuen Periode ein. Der Entscheid #521 legt den Link an den Hinweistext, deshalb kein Fix in diesem PR. Fix: ein Issue (`domain`, `needs-decision`) für den Brief beim Wechsel der Einstellung «Abrechnungsperiode». |

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| backend_consent_letter_none | Für diesen Mietvertrag gibt es keinen Brief zur Zustimmung mehr: Er hat keine kurze Abrechnungsperiode nach einem Wechsel der Abrechnungsperiode, die noch abzurechnen ist. Laden Sie die Seite neu. | Il n’existe plus de lettre d’accord pour ce contrat de bail : il n’a aucune période de décompte courte à décompter après un changement de la période de décompte. Rechargez la page. | Per questo contratto di locazione non esiste più una lettera di consenso: non ha alcun periodo di conteggio breve da conteggiare dopo un cambiamento del periodo di conteggio. Ricarichi la pagina. | There is no longer an agreement letter for this rental contract: it has no short billing period left to bill after a change of the billing period. Reload the page. |

## Fehlende Begriffe

Der Begriff «Brief zur Zustimmung (Abrechnungsperiode)» fehlt weiter im Glossar. Den Vorschlag dazu enthält 521-1, Abschnitt 5. Er liegt in #1035 beim Product Owner. Die Linktexte tragen zu Recht `TODO(fachlich prüfen, #1035)`.

## Nicht bestätigt

- Weiter **unsicher** aus 521-1 (Fedlex sagt nichts dazu): ob der Wechsel eine Änderung «zu Lasten des Mieters» nach Art. 269d Abs. 3 OR ist; ob alle Mitmieter auch ohne Formvorbehalt zustimmen müssen; ob Brief und unterschriebene Antwort die vorbehaltene Schriftform erfüllen; ob eine Zustimmung für eine schon abgelaufene kurze Periode wirkt (V-10 macht diesen Fall zum Regelfall). Gesucht: Fedlex OR Art. 1, 6, 13, 16, 269d (Stand 1.10.2026). Lehre und Rechtsprechung sind nicht geprüft.
- Antwortfrist 30 Tage: Praxis, ohne Quelle.
- Das PDF selbst (Umbruch, Platz für die Unterschriften) ist nicht angesehen. Geprüft sind nur der Text (`consent-letter.ts`) und die Reihenfolge in `renderReminderPdf` (`reminder-pdf.ts:43-52`).

Geprüft: Wortlaut de/fr/it/en in `consent-letter.ts:28-117`, Wort für Wort gleich wie die Tabelle in 521-1 Abschnitt 2. Unterschriftsplatz des Vermieters über dem Firmennamen. «Ort, Datum» im Kopf (Ort der Firmenadresse). Antwortfrist: Datum des Briefs plus 30 Tage (01.11.2026 ergibt 01.12.2026). Erste neue Periode nachgerechnet: 01.07.–31.12.2025 ergibt 01.01.–31.12.2026; 01.01.–30.06.2025 ergibt 01.07.2025–30.06.2026; 01.11.–31.12.2024 ergibt 01.01.–31.12.2025. Randfälle: Vertragsende 30.09.2025 (`clauseEnding`), Vertragsbeginn 01.10.2025 (kurze Periode des Gebäudes), kein früherer Typ (null), gespeicherter Wechsel (01.01.–30.06.2026). `consentPeriod` mit Beginn am Tag `switched`; Links in `MissingStatement` und `OverlapWays` nur bei der kurzen Periode, ohne Mieter ohne Mietstage (Eva Frei 01.01.–31.03.2024). Linktexte in vier Sprachen. Beide Szenarien gegen 521-1 Abschnitt 4.
