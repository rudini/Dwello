# Fach-Review #547, Runde 1 (fc52082 gegen 8e8b832)

Gegenstand: Warnung im Versanddialog eines nicht aktuellen Entwurfs (`statements_send_outdated_title`, `statements_send_outdated`), Knopf «Neu berechnen» im Dialog, Szenario `statement-detail.feature:781-791`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | it: «zustellen» heisst im selben Dialog zweimal anders: `statements_send_text_1` «il giorno in cui lo **recapita**», neu `statements_send_outdated` «prima di **consegnarla**» (messages/it.json:1260). «consegna» ist im Glossar schon für die Übergabe vergeben (i18n-begriffe.md:109 «verbale di consegna»). Fix: «La ricalcoli prima di recapitarla.»; dasselbe in `dashboard_task_outdated_drafts_text` (it.json:284, «prima di consegnarle», aus #454) nachziehen. |

Kein Blocker, kein Major.

## Entscheid «Versenden bleibt möglich» (Mietrecht)

Der Entscheid ist vertretbar und wird bestätigt.
- Art. 257b Abs. 1 OR (Fedlex, Fassung 1.10.2026, wie in `docs/nebenkostenabrechnung-anforderungen.md:29` zitiert): Nebenkosten sind «die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen […]». Die Norm verlangt eine richtige Abrechnung. Den Versand einer möglicherweise falschen Abrechnung verbietet sie nicht und erklärt eine solche Abrechnung auch nicht für nichtig.
- Dwello kennt nur «Rechnungen der Abrechnungsperiode geändert». Ob sich dadurch Saldo oder Position dieses Mieters ändern, weiss Dwello beim Entwurf nicht (z. B. eine nicht vereinbarte Kategorie oder eine nicht umlagefähige Rechnung). Eine harte Sperre würde auch richtige Abrechnungen aufhalten. Eine Warnung mit «Neu berechnen» als erster Handlung ist das passende Mittel.
- Wird der Entwurf trotzdem versendet, zeigt die Abrechnung danach den Hinweis «Abrechnung berichtigen» (`statements_later_sent`). Der Weg zur Berichtigung bleibt also offen.
- Beim Versand per Brief führt der Dialog richtig: Erst als versendet markieren, dann drucken (`statements_send_text_1`/`_2`). Ein Neu berechnen vor dem Markieren verwirft deshalb kein PDF, das der Mieter schon hat.

Geprüft: de/fr/en-Wortlaut gegen das Glossar («Entwurf/brouillon/bozza/draft», «nicht aktuell» wie in `dashboard_task_outdated_drafts_*`, «Neu berechnen» wie in `statements_recalculate`; fr «remettre» und en «deliver» stimmen mit `statements_send_text_1` überein). Gelesen habe ich {later} in allen vier Sprachen mit allen drei Varianten aus `laterText` (`statements_later_one/many`, `_fuel_stock`, `_and_fuel_stock`). Der Satzrahmen ist derselbe wie in `statements_later_draft`, und Kongruenz und Wortstellung stimmen (fr «Recalculez-le» für den männlichen «brouillon», it «La ricalcoli … -la» für die weibliche «bozza»). Auch das Szenario verwendet nur Begriffe aus dem Glossar.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- Den Wortlaut von Art. 257b OR habe ich nicht selbst auf Fedlex gelesen: Die Fedlex-Seite liefert über WebFetch nur den Startbildschirm. Ich stütze mich auf das Zitat mit dem Vermerk «Fedlex geprüft» in `docs/nebenkostenabrechnung-anforderungen.md:7,29`, Prüfung vom 17.10.2026 (#77). `mmx search` liefert denselben Wortlaut (help.ch, justement.ch).
- Dass ein zu viel bezahlter Saldo aus einer versendeten falschen Abrechnung zurückgefordert werden kann (Bereicherungsrecht, Art. 62 ff. OR), ist **unsicher**. Ich habe es nicht auf Fedlex nachgelesen. Für den Entscheid spielt es keine Rolle, weil Dwello den Weg über «Abrechnung berichtigen» bietet.
