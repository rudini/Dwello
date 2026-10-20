# Fach-Review #405: italienisches Wort für «Ersatzmieter»

Der ursprüngliche Bericht zum Entscheid vom 2026-10-19 (#405, «Ersatzmieter it») lag nicht im Repository. Der fach-reviewer hat ihn in der Runde 1 von #461 neu geschrieben (`461-fachreview-1.md`, Abschnitt «Domain-Review»); hier steht er für sich.

**Frage** (#405, Kommentar vom 2026-10-18; g3-glossary-review-2, C-4): Im Italienischen heisst «Ersatzmieter» (Art. 264 Abs. 1 OR) heute «nuovo inquilino» (`contracts_notice_period_short`, `glossary_notice_period_text`), also gleich wie «Nachmieter». fr «locataire de remplacement» und en «replacement tenant» unterscheiden die beiden. Gesucht ist ein it-Wort, nach dem Wunsch des PO das Fedlex-Wort, wenn es eindeutig ist.

**Begriffe** (UBIQUITOUS_LANGUAGE.md):
- UL:44 **Nachmieter**: «Mieter, dessen Mietvertrag für dieselbe Wohnung nach dem Vertragsende eines gekündigten oder befristeten Mietvertrags beginnt.»
- UL:45 **Ersatzmieter**: «Zumutbarer, zahlungsfähiger neuer Mieter, den der Mieter bei vorzeitiger Rückgabe vorschlägt und der bereit ist, den Mietvertrag zu den gleichen Bedingungen zu übernehmen (Art. 264 Abs. 1 OR).»
Der Unterschied ist rechtlich erheblich. Der Ersatzmieter befreit den bisherigen Mieter vor dem Kündigungstermin; der Nachmieter folgt erst nach dem Vertragsende.

**Fedlex** (OR, Stand 1.10.2026):
- Art. 264 Abs. 1 OR (de): «Gibt der Mieter die Sache zurück, ohne Kündigungsfrist oder -termin einzuhalten, so ist er von seinen Verpflichtungen gegenüber dem Vermieter nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; dieser muss zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen.»
- Art. 264 cpv. 1 CO (it): «Il conduttore che restituisce la cosa senza osservare i termini di preavviso o le scadenze è liberato dai suoi obblighi verso il locatore soltanto se gli propone un nuovo conduttore solvibile che non possa essere ragionevolmente rifiutato dal locatore; il nuovo conduttore deve essere disposto a riprendere il contratto alle medesime condizioni.»
- Art. 264 al. 1 CO (fr): «… il n’est libéré de ses obligations envers le bailleur que s’il lui présente un nouveau locataire qui soit solvable et que le bailleur ne puisse raisonnablement refuser; le nouveau locataire doit en outre être disposé à reprendre le bail aux mêmes conditions.»
- Art. 256a cpv. 1 CO (it), für den gewöhnlichen neuen Mieter: «Se alla fine della locazione precedente è stato steso un processo verbale sullo stato della cosa, il locatore deve darne visione al nuovo conduttore, a sua domanda, al momento della consegna della cosa.» (de: «dem neuen Mieter», fr: «au nouveau locataire».)

**Ergebnis aus Fedlex:** Das Gesetz hat in keiner Sprache ein eigenes Wort für den Ersatzmieter. Es sagt «neuer Mieter» / «nouveau locataire» / «nuovo conduttore», in Art. 264 genauso wie in Art. 256a für den gewöhnlichen neuen Mieter. Auch «Ersatzmieter» selbst ist ein Wort der Praxis und der Rechtsprechung. Mit dem Fedlex-Wort lassen sich die beiden Begriffe also nicht trennen; im Italienischen wäre «nuovo conduttore» sogar dasselbe wie heute, nur mit «conduttore» statt «inquilino».

**Rechtsprechung:** Das Regesto italiano von BGE 117 II 156 lautet: «Il locatore può rifiutare un conduttore sostitutivo che sia disposto a pagare solo una pigione considerevolmente inferiore a quella attuale.» (Quelle: bger.ch, Dokument `atf://117-II-156:it:regeste`, gefunden über `mmx search`, zwei Treffer mit demselben Wortlaut. Den direkten Abruf von bger.ch hat der Proxy hier gesperrt: **unsicher**, bis jemand den Wortlaut auf bger.ch abgleicht.) Das Bundesgericht verwendet also für den Ersatzmieter von Art. 264 ein eigenes Wort, «conduttore sostitutivo».

**Praxis Tessin** (Websuche, nicht amtlich): newhome.ch (it) schreibt «se viene proposto un inquilino sostitutivo» zu Art. 264 CO. Daneben ist «subentrante» / «subentro» verbreitet (mobiliare.ch «Fornire un subentrante in caso di disdetta anticipata», tisubentro.ch). «Subentrare» sagt die App aber schon für den Vertragseintritt (`contracts_parties_fixed_transfer`, it.json:708), und im Alltag heisst so auch der gewöhnliche Nachmieter. Es trennt die Begriffe deshalb nicht sicher.

**Empfehlung:** «inquilino sostitutivo». Begründung:
1. Es trennt den Ersatzmieter vom Nachmieter («nuovo inquilino», gestützt auf Art. 256a «nuovo conduttore»), wie fr und en.
2. Es ist das Wort des Bundesgerichts (BGE 117 II 156, «conduttore sostitutivo»), mit «inquilino» statt «conduttore» nach dem Entscheid 2a (#343: «inquilino» bleibt überall).
3. In der Tessiner Praxis kommt es vor, und es ist nicht doppeldeutig wie «subentrante».
Eindeutig: ja. Diese Empfehlung hat der PO am 2026-10-19 übernommen (#405).

**Texte** (`messages/it.json`):
- `contracts_notice_period_short`: «… Eccezione: un inquilino sostitutivo riprende il contratto di locazione, oppure Lei ha concordato la fine con l’inquilino.»
- `glossary_notice_period_text`, letzter Satz: «Il contratto di locazione termina prima solo se Lei concorda la fine con l’inquilino o se un inquilino sostitutivo lo riprende.» (Zum Inhalt siehe M-1: «se Le propone un inquilino sostitutivo che Lei non può ragionevolmente rifiutare» gibt Art. 264 cpv. 1 genauer wieder.)
- `docs/design/i18n-begriffe.md:32`: «Ersatzmieter | locataire de remplacement | inquilino sostitutivo | replacement tenant», ohne ❓.
- Nicht ändern: «nuovo inquilino» in it.json:639, 799, 807, 1637, 1638, 1644, 1645, 1674 (Nachmieter oder neu erfasster Mieter).
