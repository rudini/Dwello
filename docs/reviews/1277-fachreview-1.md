# Fachreview #1277, Runde 1 (Commit c8bf427, Diff 370f9c6..c8bf427)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Minor | `contracts_end_kind_agreement_help` (messages/*.json:2403) verlangt noch für jeden Fall «unterschrieben von Ihnen und allen Mietern». Den Eintritt eines Dritten (Art. 263 OR, Art. 121 ZGB) nennt der Text nicht. Das widerspricht `contracts_parties_fixed_transfer` (:805), wo die Zustimmung oder das Urteil genügt. Der Product Owner hat das schon entschieden. Behebung: den Wortlaut unten übernehmen. Darin steht die Schriftform neu ausdrücklich nur als Beweis («als Beweis»). |

Keine Blocker, keine Major.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_end_kind_required | Wählen Sie, wie der Mietvertrag endet: mit einer Kündigung oder einer Aufhebungsvereinbarung. | Choisissez comment le contrat de bail prend fin : par une résiliation ou par une convention de fin de bail. | Scelga come termina il contratto di locazione: con una disdetta o con un accordo di scioglimento. | Choose how the rental contract ends: with a notice of termination or a termination agreement. |
| contracts_end_kind_agreement_help | Mieter und Vermieter beenden den Mietvertrag im Einvernehmen auf einen vereinbarten Tag, ohne Kündigung und ohne Kündigungsfrist, z.B. beim Wechsel in eine andere Ihrer Wohnungen. Halten Sie die Vereinbarung als Beweis schriftlich fest, unterschrieben von Ihnen und allen Mietern. Bei einer Familienwohnung braucht es die ausdrückliche Zustimmung des Ehegatten oder eingetragenen Partners. Tritt jemand anders in den Mietvertrag ein, etwa mit Ihrer schriftlichen Zustimmung bei Geschäftsräumen oder durch ein Urteil bei der Scheidung, braucht es keine unterschriebene Vereinbarung: Es genügen Ihre Zustimmung oder das Urteil. | Le locataire et le bailleur mettent fin au contrat de bail d’un commun accord à une date convenue, sans résiliation ni délai de congé, par exemple lorsque le locataire passe dans un autre de vos appartements. Consignez la convention par écrit comme preuve, signée par vous et par tous les locataires. Pour un logement de la famille, il faut le consentement exprès du conjoint ou du partenaire enregistré. Si une autre personne reprend le contrat de bail, par exemple avec votre consentement écrit pour des locaux commerciaux ou par un jugement lors du divorce, aucune convention signée n’est nécessaire : votre consentement ou le jugement suffit. | Inquilino e locatore sciolgono il contratto di locazione di comune accordo a una data concordata, senza disdetta né termine di preavviso, per esempio quando l’inquilino passa a un altro dei Suoi appartamenti. Metta l’accordo per scritto come prova, firmato da Lei e da tutti gli inquilini. Per un’abitazione familiare serve il consenso espresso del coniuge o del partner registrato. Se un’altra persona subentra nel contratto di locazione, per esempio con il Suo consenso scritto per locali commerciali o con una sentenza di divorzio, non serve un accordo firmato: bastano il Suo consenso o la sentenza. | Tenant and landlord end the rental contract by mutual agreement on an agreed day, without notice of termination and without a notice period, for example when the tenant moves to another of your apartments. Put the agreement in writing as evidence, signed by you and all tenants. For a family home, the express consent of the spouse or registered partner is needed. If someone else takes over the rental contract, for example with your written consent for business premises or by a divorce judgment, no signed agreement is needed: your consent or the judgment is enough. |

Hinweise: Im fr steht vor «:» ein U+00A0, wie in `contracts_end_kind_required` heute. `contracts_end_kind_required` wird in allen vier Sprachen so bestätigt, wie es geschrieben ist.

Belege Fedlex, OR Stand 1. Oktober 2026:
- Art. 263 Abs. 1: «Der Mieter von Geschäftsräumen kann das Mietverhältnis mit schriftlicher Zustimmung des Vermieters auf einen Dritten übertragen.»
- Art. 263 Abs. 3: «Stimmt der Vermieter zu, so tritt der Dritte anstelle des Mieters in das Mietverhältnis ein.»
- Art. 266m Abs. 1: «… kann ein Ehegatte den Mietvertrag nur mit der ausdrücklichen Zustimmung des anderen kündigen.»

Belege Fedlex, ZGB Stand 1. Juli 2026:
- Art. 121 Abs. 1: «… so kann das Gericht ihm die Rechte und Pflichten aus dem Mietvertrag allein übertragen …»
- Art. 169 Abs. 1: «Ein Ehegatte kann nur mit der ausdrücklichen Zustimmung des andern … durch andere Rechtsgeschäfte die Rechte an den Wohnräumen der Familie beschränken.»

Dass die Schriftform nur als Beweis dient, folgt aus Art. 11 Abs. 1 OR (zitiert in 1148-fachreview-1).

## Nicht bestätigt

- Gilt Art. 121 ZGB auch, wenn eine eingetragene Partnerschaft aufgelöst wird (Art. 32 PartG)? Das habe ich nicht abgerufen (**unsicher**). Der Text nennt deshalb nur die Scheidung, wie `contracts_parties_fixed_transfer`.
- Ob die schriftliche Zustimmung nach Art. 263 Abs. 1 OR eine Gültigkeitsform ist oder nur dem Beweis dient, steht nicht im Gesetzestext und ist nicht an Lehre oder Rechtsprechung geprüft. Der Text sagt deshalb «mit Ihrer schriftlichen Zustimmung», wie das Gesetz.

Geprüft: Das Ende wird ohne Art nicht gespeichert, und der Fehler steht bei der Wahl (`+page.svelte:96-98`, `:285`, Szenario `contract-detail.feature:215-219`). «Kündigung erhalten am» und der Hinweis zur Kündigungsfrist erscheinen erst nach der Wahl «Kündigung» (`:292-303`). Das ist fachlich richtig: Bei einer Aufhebungsvereinbarung gibt es keinen Eingang und keine Kündigungsfrist. Ein Datum, das vor dem Wechsel auf «Aufhebungsvereinbarung» eingetippt wurde, verwirft das Backend (`contract.service.ts:548`). Der Hinweis zum Tod des Mieters bleibt immer sichtbar. Die Glossarbegriffe in den neuen Texten und im Szenario stimmen.
