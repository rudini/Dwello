/**
 * KI stand-in for the acceptance tests: an OpenAI-compatible /chat/completions that answers only the check of a
 * new category's allocability, by its name. Everything else (invoice categorization, /models) fails, so the
 * invoice scenarios still see an unreachable KI.
 *
 *   bun run llm-stub      http://127.0.0.1:2527/v1
 */

const PORT = Number(process.env.LLM_STUB_PORT ?? 2527);

const answers = [
	{
		match: /sanierung|reparatur/i,
		answer: {
			isAllowedUtilityCost: false,
			confidence: 0.9,
			reasoning: 'Erhalt und Erneuerung des Gebäudes hängen nicht mit dem Gebrauch zusammen (Art. 257a OR).'
		}
	},
	{
		match: /./,
		answer: {
			isAllowedUtilityCost: true,
			confidence: 0.9,
			reasoning: 'Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b OR).'
		}
	}
];

Bun.serve({
	port: PORT,
	hostname: '127.0.0.1',
	async fetch(request) {
		if (!new URL(request.url).pathname.endsWith('/chat/completions')) return new Response(null, { status: 503 });
		const { messages } = (await request.json()) as { messages: { content: string }[] };
		const name = messages[0]?.content.match(/^Kategorie: (.*)$/m)?.[1];
		if (!name) return new Response(null, { status: 503 });
		const { answer } = answers.find(({ match }) => match.test(name))!;
		return Response.json({ choices: [{ message: { content: JSON.stringify(answer) } }] });
	}
});
