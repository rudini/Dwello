/**
 * KI stand-in for the acceptance tests: an OpenAI-compatible /chat/completions that answers the check of a new
 * category's allocability, by its name and in the language the prompt asks for, and the reading of an uploaded
 * invoice file, by its file name (the supplier the scenario uploads). Invoice categorization answers only for the
 * suppliers of the upload scenarios; everything else (/models included) fails, so the other invoice scenarios still
 * see an unreachable KI.
 *
 *   bun run llm-stub      http://127.0.0.1:2527/v1
 *
 * With LLM_STUB_PULL=on it stands in for an Ollama that has not got the model yet (the fresh installation, #577): the
 * model list is empty and a pull reports the progress a scenario sets with POST /stub/pull {percent}, at once. With
 * LLM_STUB_PULL=fail the pull fails (the empty instance of the stack). «Verbindung prüfen» of the KI settings (#580)
 * succeeds with the key «gueltig» and a model other than «text-modell»; POST /stub/ollama {state} ends the running
 * download with an error or lets Ollama answer nothing.
 */

const PORT = Number(process.env.LLM_STUB_PORT ?? 2527);
const PULL = process.env.LLM_STUB_PULL; // 'on' or 'fail'
let pulled = 0; // percent of the model download
let offline = false; // Ollama answers nothing (#580)

type Language = 'Deutsch' | 'Französisch' | 'Italienisch' | 'Englisch';

const answers: {
	match: RegExp;
	isAllowedUtilityCost: boolean;
	confidence: number;
	reasoning: Record<Language, string>;
	delay?: number;
	// Answers only when the whole prompt also matches
	when?: (prompt: string) => boolean;
}[] = [
	// A slow KI: the screen checks see «Die KI prüft die Kategorie …» while it answers, 25 s
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
			Deutsch: 'Erhalt und Erneuerung des Gebäudes trägt der Vermieter (Art. 256 Abs. 1 OR).',
			Französisch: 'L’entretien et la rénovation du bâtiment sont à la charge du bailleur (art. 256, al. 1, CO).',
			Italienisch: 'Il mantenimento e il rinnovo dell’edificio sono a carico del locatore (art. 256 cpv. 1 CO).',
			Englisch: 'Preserving and renewing the building is borne by the landlord (Art. 256 para. 1 CO).'
		}
	},
	// «Treppenhausreinigung» judged like the predefined Hauswart when the prompt lists it as umlagefähig and says the
	// predefined Kategorien are not complete, else wrong as the default model judged it without them (#202, #212)
	{
		match: /treppenhaus/i,
		when: (prompt) =>
			/^VORDEFINIERTE UMLAGEFÄHIGE KATEGORIEN[^]*?^- Caretaker \(Hauswart\)[^]*?^VORDEFINIERTE NICHT UMLAGEFÄHIGE/m.test(prompt) &&
			prompt.includes('Die vordefinierten Kategorien sind nicht vollständig.'),
		isAllowedUtilityCost: true,
		confidence: 0.9,
		reasoning: {
			Deutsch: 'Reinigung wie beim Hauswart: laufende Betriebskosten (Art. 257b Abs. 1 OR).',
			Französisch: 'Nettoyage comme pour le Concierge: frais d’exploitation courants (art. 257b, al. 1, CO).',
			Italienisch: 'Pulizia come per il Portiere: spese d’esercizio correnti (art. 257b cpv. 1 CO).',
			Englisch: 'Cleaning as for the Caretaker: running operating costs (Art. 257b para. 1 CO).'
		}
	},
	{
		match: /treppenhaus/i,
		isAllowedUtilityCost: false,
		confidence: 0.9,
		reasoning: {
			Deutsch: 'Hängt nicht mit dem Gebrauch zusammen (Art. 257a Abs. 1 OR).',
			Französisch: 'Pas lié à l’usage (art. 257a, al. 1, CO).',
			Italienisch: 'Non legato all’uso (art. 257a cpv. 1 CO).',
			Englisch: 'Not linked to the use (Art. 257a para. 1 CO).'
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
	// «KI-Ausfall …»: the KI fails, as if it were not reachable (#186)
	if (!name || name.startsWith('KI-Ausfall')) return new Response(null, { status: 503 });
	const language = (line(prompt, 'Sprache der Begründung') ?? 'Deutsch') as Language;
	const { isAllowedUtilityCost, confidence, reasoning, delay = 0 } = answers.find(({ match, when }) => match.test(name) && (when?.(prompt) ?? true))!;
	const answer = { isAllowedUtilityCost, confidence, reasoning: reasoning[language] };
	return Bun.sleep(delay).then(() => Response.json({ choices: [{ message: { content: JSON.stringify(answer) } }] }));
}

// What the stand-in «reads» from an invoice file, by its name: «… ohne KI» fails, «… unlesbar» answers no JSON, «Sammelscan» holds two invoices,
// «Werke Schlussrechnung» deducts Akonto payments, «… Reparatur» mixes in costs that are not allocable, «… Gutschrift» is a
// credit note, «… Akontorechnung» an advance invoice
const DOCUMENT_TYPES = [
	['Gutschrift', 'credit_note'],
	['Akontorechnung', 'advance_invoice']
];
const documentTypeOf = (fileName: string) => DOCUMENT_TYPES.find(([word]) => fileName.includes(word))?.[1] ?? 'invoice';
// What the file name says about the file, as the stand-in «reads» it
const readsAs = (fileName: string) => ({
	invoiceCount: fileName.includes('Sammelscan') ? 2 : 1,
	documentType: documentTypeOf(fileName),
	deductedAmount: fileName.includes('Werke Schlussrechnung') ? 1000 : null,
	nonAllocableItems: fileName.includes('Reparatur')
});

async function read(fileName: string) {
	// a KI without a GPU: longer than the 30 s the backend and the BFF used to wait (#419)
	if (fileName.includes('Langsam')) await Bun.sleep(35_000);
	if (fileName.includes('ohne KI')) return new Response(null, { status: 503 });
	if (fileName.includes('unlesbar')) return Response.json({ choices: [{ message: { content: 'Ich kann diese Datei nicht lesen.' } }] });
	const answer = {
		...readsAs(fileName),
		billingEntityName: fileName.replace(/\.[^.]*$/, ''),
		invoiceNumber: 'R-1001',
		invoiceDate: '2026-03-31',
		totalAmount: 1250,
		servicePeriodStart: '2026-01-01',
		servicePeriodEnd: '2026-03-31',
		dueDate: null,
		description: 'Allgemeinstrom Q1',
		confidence: { billingEntityName: 0.95, invoiceNumber: 0.9, invoiceDate: 0.4, totalAmount: 0.9, servicePeriodStart: 0.9, description: 0.8 }
	};
	return Response.json({ choices: [{ message: { content: JSON.stringify(answer) } }] });
}

// The Kategorie of the upload scenarios' suppliers; any other invoice finds no KI
const supplierCategories: [RegExp, string][] = [
	[/^Elektro Blitz/, 'Electricity Common Areas'],
	[/^Gartenbau Grün/, 'Garden Maintenance']
];

function categorize(prompt: string) {
	const supplier = line(prompt, 'Rechnungssteller') ?? '';
	const category = supplierCategories.find(([match]) => match.test(supplier))?.[1];
	if (!category) return new Response(null, { status: 503 });
	const answer = { category, confidence: 0.9, isAllowedUtilityCost: true, reasoning: 'Laufende Betriebskosten.' };
	return Response.json({ choices: [{ message: { content: JSON.stringify(answer) } }] });
}

type Content = string | { type: string; text?: string }[];
const textOf = (content: Content) => (typeof content === 'string' ? content : content.map((part) => part.text ?? '').join(''));

function answer(content: Content) {
	const prompt = textOf(content);
	const file = prompt.match(/Die Bilder sind die Seiten der Datei «(.*)»/)?.[1];
	if (file) return read(file);
	if (prompt.includes('RECHNUNGSDATEN:')) return categorize(prompt);
	return reply(prompt);
}

Bun.serve({
	port: PORT,
	hostname: '127.0.0.1',
	// Bun closes an idle request after 10 s by default; the slow answer needs longer, and the model download of the
	// fresh installation streams for the whole run
	idleTimeout: PULL === 'on' ? 0 : 60,
	fetch: (request) => routes[new URL(request.url).pathname]?.(request) ?? new Response(null, { status: 503 })
});

type Route = (request: Request) => Response | Promise<Response>;
const chat: Route = async (request) => {
	const { model, messages } = (await request.json()) as { model: string; messages: { content: Content }[] };
	const content = messages[0].content;
	return textOf(content).includes('Verbindungstest') ? connectionCheck(request, model) : answer(content);
};

// «Verbindung prüfen» of the KI settings (#580): the key «gueltig» is accepted, the model «text-modell» reads no images
function connectionCheck(request: Request, model: string) {
	if (request.headers.get('Authorization') !== 'Bearer gueltig') return Response.json({ error: { message: 'Invalid API key' } }, { status: 401 });
	if (model === 'text-modell') return Response.json({ error: { message: 'This model does not support image input' } }, { status: 400 });
	return Response.json({ choices: [{ message: { content: 'OK' } }] });
}
// the OpenAI-compatible API; Ollama's own only with LLM_STUB_PULL=on
const routes: Record<string, Route> = { '/v1/chat/completions': chat, '/chat/completions': chat, ...(PULL ? ollama() : {}) };

function ollama(): Record<string, Route> {
	const down = () => new Response(null, { status: 503 });
	return {
		'/api/tags': () => (offline ? down() : Response.json({ models: [] })),
		'/api/pull': () =>
			offline ? down() : PULL === 'fail' ? Response.json({ error: 'no space left on device' }) : pullProgress(),
		'/stub/pull': async (request) => {
			pulled = ((await request.json()) as { percent: number }).percent;
			// at once, not with the next tick: the scenario opens the overview right after
			for (const send of pulls) send();
			return Response.json({ percent: pulled });
		},
		// #580: «failed» ends the running downloads with an error (a new one runs again), «offline» answers nothing
		// until «online»
		'/stub/ollama': async (request) => {
			const { state } = (await request.json()) as { state: 'failed' | 'offline' | 'online' };
			offline = state === 'offline';
			if (state === 'failed') for (const fail of failures) fail();
			return Response.json({ state });
		}
	};
}

// Ollama's pull stream (NDJSON): one line per update, bytes of the model's layer
const pulls = new Set<() => void>();
const failures = new Set<() => void>();
function pullProgress() {
	const total = 6_000_000_000;
	let send: () => void;
	let fail: () => void;
	let timer: ReturnType<typeof setInterval>;
	const end = () => {
		pulls.delete(send);
		failures.delete(fail);
		clearInterval(timer);
	};
	const body = new ReadableStream({
		start(controller) {
			send = () =>
				controller.enqueue(
					new TextEncoder().encode(`${JSON.stringify({ status: 'pulling model', total, completed: (total * pulled) / 100 })}\n`)
				);
			fail = () => {
				end();
				controller.enqueue(new TextEncoder().encode(`${JSON.stringify({ error: 'connection reset' })}\n`));
				controller.close();
			};
			pulls.add(send);
			failures.add(fail);
			send();
			// as a real Ollama does while it downloads: never silent for long (main run 825 lost a silent stream)
			timer = setInterval(send, 10_000);
		},
		cancel: end
	});
	return new Response(body, { headers: { 'content-type': 'application/x-ndjson' } });
}
