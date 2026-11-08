# Fachreview #1295, Schritt 1, Runde 1 (Commit 602ab1a)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|

Keine Befunde.

Geprüft: Die Szenarien sind fachlich richtig. Im neuen Szenario (contract-new.feature:281-288) überschneidet sich der Mietvertrag von Bruno Meier (01.04.2024–31.03.2027) mit einem Vertragsbeginn am 01.01.2027. Der Link-Text folgt «Zum Mietvertrag von {Mieter} für {Wohnung}» und ist mit `toBe` genau festgelegt; auf dem Basis-Commit ist er rot («… von Bruno Meier» ohne Wohnung). Die geänderte Zeile 227 nennt die Wohnung, deren Wahl aufgehoben wurde. Dort stammt `{apartment}` aus dem aufgehobenen Mietvertrag (`cleared.contract`), nicht aus der aktuellen Wahl, denn die ist leer. Die Begriffe sind dieselben wie in UBIQUITOUS_LANGUAGE.md und i18n-begriffe.md: Mietvertrag / contrat de bail / contratto di locazione / rental contract; Anonymisierter Mieter / locataire anonymisé / inquilino anonimizzato / anonymised tenant. Der Plan, `contracts_open_contract_link` durch denselben Schlüssel `contracts_overlap_link` zu ersetzen, ist fachlich richtig: Beide Links führen zu einem anderen Mietvertrag und nennen Mieter und Wohnung. Für den Satz braucht es keine Gesetzesquelle.

## Wortlaut

| key | de | fr | it | en |
|-----|----|----|----|----|
| contracts_overlap_link | Zum Mietvertrag von {tenant} für {apartment} | Vers le contrat de bail de {tenant} pour {apartment} | Al contratto di locazione di {tenant} per {apartment} | Go to the rental contract of {tenant} for {apartment} |
| contracts_overlap_link_anonymised | Zum Mietvertrag des anonymisierten Mieters für {apartment} | Vers le contrat de bail du locataire anonymisé pour {apartment} | Al contratto di locazione dell’inquilino anonimizzato per {apartment} | Go to the rental contract of the anonymised tenant for {apartment} |

`{apartment}` = `apartmentName(unit, building)`, also «Wohnung 2.01 · Ahornhof» / «Appartement 2.01 · Ahornhof» / «Appartamento 2.01 · Ahornhof» / «Apartment 2.01 · Ahornhof». Im Französischen braucht keiner der Texte ein U+00A0, denn keiner enthält « » ; : ! ?. `ui_opens_new_tab` bleibt im Bearbeitungsformular wie bisher mit Leerzeichen angehängt.

## Nicht bestätigt

- Ob man in Verwaltungen der Romandie und des Tessins den Artikel vor dem Wohnungsnamen weglässt («pour Appartement 2.01 · Ahornhof», «per Appartamento 2.01 · Ahornhof»). Die Form folgt den bestehenden Texten `contracts_apartment_cleared_title` und `contracts_open_contract_link` (wie schon in 1288-fachreview-1). Nach einer Quelle für den Sprachgebrauch habe ich nicht gesucht.
