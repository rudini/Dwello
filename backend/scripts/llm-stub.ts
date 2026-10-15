/**
 * KI stand-in for the acceptance tests: an OpenAI-compatible /chat/completions that answers only the check of a
 * new category's allocability, by its name and in the language the prompt asks for. Everything else (invoice
 * categorization, /models) fails, so the invoice scenarios still see an unreachable KI.
 *
 *   bun run llm-stub      http://127.0.0.1:2527/v1
 */

const PORT = Number(process.env.LLM_STUB_PORT ?? 2527);

type Language = 'Deutsch' | 'Französisch' | 'Italienisch' | 'Englisch';

const answers: {
	match: RegExp;
	isAllowedUtilityCost: boolean;
	confidence: number;
	reasoning: Record<Language, string>;
	delay?: number;
}[] = [
	// A slow KI: the screen checks see «Die KI prüft die Kategorie …» while it answers, 25 s, below the
	// backend's LLM_TIMEOUT of 30 s
	{
		match: /langsam/i,
		isAllowedUtilityCost: true,
		confidence: 0.9,
		delay: 25_000,
		reasoning: { Deutsch: 'Betrieb.', Französisch: 'Exploitation.', Italienisch: 'Esercizio.', Englisch: 'Operation.' }
	},
	{
		match: /sanierung|reparatur/i,
		isAllowedUtilityCost: false,
		confidence: 0.9,
		reasoning: {
			Deutsch: 'Erhalt und Erneuerung des Gebäudes hängen nicht mit dem Gebrauch zusammen (Art. 257a Abs. 1 OR).',
			Französisch: 'L’entretien et la rénovation du bâtiment ne sont pas liés à son usage (art. 257a, al. 1, CO).',
			Italienisch: 'Il mantenimento e il rinnovo dell’edificio non sono legati al suo uso (art. 257a cpv. 1 CO).',
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
			Französisch: 'Frais d’exploitation courants liés à l’usage de la chose louée (art. 257b, al. 1, CO).',
			Italienisch: 'Costi d’esercizio correnti legati all’uso della cosa locata (art. 257b cpv. 1 CO).',
			Englisch: 'Running operating costs from the use of the rented property (Art. 257b para. 1 CO).'
		}
	}
];

// The value of a line «label: value» of the prompt
const line = (prompt: string, label: string) => prompt.match(new RegExp(`^${label}: (.*)$`, 'm'))?.[1];

function reply(prompt: string) {
	const name = line(prompt, 'Kategorie');
	if (!name) return new Response(null, { status: 503 });
	const language = (line(prompt, 'Sprache der Begründung') ?? 'Deutsch') as Language;
	const { isAllowedUtilityCost, confidence, reasoning, delay = 0 } = answers.find(({ match }) => match.test(name))!;
	const answer = { isAllowedUtilityCost, confidence, reasoning: reasoning[language] };
	return Bun.sleep(delay).then(() => Response.json({ choices: [{ message: { content: JSON.stringify(answer) } }] }));
}

Bun.serve({
	port: PORT,
	hostname: '127.0.0.1',
	// Bun closes an idle request after 10 s by default; the slow answer needs longer
	idleTimeout: 60,
	fetch: async (request) =>
		new URL(request.url).pathname.endsWith('/chat/completions')
			? reply(((await request.json()) as { messages: { content: string }[] }).messages[0].content)
			: new Response(null, { status: 503 })
});
