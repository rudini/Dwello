/**
 * KI stand-in for the acceptance tests: an OpenAI-compatible /chat/completions that answers only the check of a
 * new category's allocability, by its name and in the language the prompt asks for. Everything else (invoice
 * categorization, /models) fails, so the invoice scenarios still see an unreachable KI.
 *
 *   bun run llm-stub      http://127.0.0.1:2527/v1
 */

const PORT = Number(process.env.LLM_STUB_PORT ?? 2527);

type Language = 'Deutsch' | 'Französisch' | 'Italienisch' | 'Englisch';

const answers: { match: RegExp; isAllowedUtilityCost: boolean; confidence: number; reasoning: Record<Language, string> }[] = [
	{
		match: /sanierung|reparatur/i,
		isAllowedUtilityCost: false,
		confidence: 0.9,
		reasoning: {
			Deutsch: 'Erhalt und Erneuerung des Gebäudes hängen nicht mit dem Gebrauch zusammen (Art. 257a Abs. 1 OR).',
			Französisch: 'L’entretien et la rénovation du bâtiment ne sont pas liés à son usage (art. 257a al. 1 CO).',
			Italienisch: 'La manutenzione e il rinnovo dell’edificio non sono legati al suo uso (art. 257a cpv. 1 CO).',
			Englisch: 'Preserving and renewing the building is not linked to its use (Art. 257a para. 1 CO).'
		}
	},
	// Contested in practice (leaflet of the Mieterverband): the KI is not sure, so it proposes nothing
	{
		match: /bewachung/i,
		isAllowedUtilityCost: true,
		confidence: 0.5,
		reasoning: { Deutsch: 'Umstritten.', Französisch: 'Contesté.', Italienisch: 'Controverso.', Englisch: 'Contested.' }
	},
	{
		match: /./,
		isAllowedUtilityCost: true,
		confidence: 0.9,
		reasoning: {
			Deutsch: 'Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b Abs. 1 OR).',
			Französisch: 'Frais d’exploitation courants liés à l’usage de la chose louée (art. 257b al. 1 CO).',
			Italienisch: 'Costi d’esercizio correnti legati all’uso della cosa locata (art. 257b cpv. 1 CO).',
			Englisch: 'Running operating costs from the use of the rented property (Art. 257b para. 1 CO).'
		}
	}
];

Bun.serve({
	port: PORT,
	hostname: '127.0.0.1',
	async fetch(request) {
		if (!new URL(request.url).pathname.endsWith('/chat/completions')) return new Response(null, { status: 503 });
		const { messages } = (await request.json()) as { messages: { content: string }[] };
		const prompt = messages[0]?.content ?? '';
		const name = prompt.match(/^Kategorie: (.*)$/m)?.[1];
		if (!name) return new Response(null, { status: 503 });
		const language = (prompt.match(/^Sprache der Begründung: (.*)$/m)?.[1] ?? 'Deutsch') as Language;
		const { isAllowedUtilityCost, confidence, reasoning } = answers.find(({ match }) => match.test(name))!;
		const answer = { isAllowedUtilityCost, confidence, reasoning: reasoning[language] };
		return Response.json({ choices: [{ message: { content: JSON.stringify(answer) } }] });
	}
});
