/**
 * The KI-Modell of the local KI (#577): on start the backend asks Ollama whether the model is there and downloads it
 * when it is not (about 6 GB), so no command is needed; the overview shows how far it is. Ollama learns only the
 * model's name (fach review 577 R-2). An external provider is not asked.
 */

type State = { state: 'ready' } | { state: 'loading'; percent: number } | { state: 'failed' } | { state: 'unknown' };

let current: State = { state: 'unknown' };

export const modelState = (): State => current;

/** Ollama's own API: the OpenAI-compatible address without its /v1 */
const ollamaOf = (baseUrl: string) => baseUrl.replace(/\/v1\/?$/, '');

// the running download; a new one (another start from the page «KI», #580) ends it
let running = new AbortController();
// settles once the running load knows its first state, so the page «KI» shows it right after a save (#580); a silent
// Ollama is waited for 5 s at most
let started: Promise<void> = Promise.resolve();
export const modelStarted = () => Promise.race([started, Bun.sleep(5000)]);

export async function loadModel(config: { baseUrl: string; model: string; local: boolean }) {
	running.abort();
	const own = (running = new AbortController());
	// this load's own resolver: an aborted one cannot settle the next (code review 580 C-6)
	let known = () => {};
	started = new Promise((resolve) => (known = resolve));
	current = { state: 'unknown' };
	try {
		await load(config, own, known);
	} finally {
		known();
	}
}

async function load(config: { baseUrl: string; model: string; local: boolean }, own: AbortController, known: () => void) {
	if (!config.local) return;
	const ollama = ollamaOf(config.baseUrl);
	try {
		const { models } = (await (await fetch(`${ollama}/api/tags`, { signal: own.signal })).json()) as { models: { name: string }[] };
		if (models.some((model) => model.name === config.model)) {
			current = { state: 'ready' };
			return;
		}
		// without a time limit: Bun's fetch ends a response after 6 minutes without data, and Ollama can be silent that long
		// (verifying a layer of the 6 GB model; main run 825)
		const pull = await fetch(`${ollama}/api/pull`, {
			method: 'POST',
			body: JSON.stringify({ model: config.model, stream: true }),
			timeout: false,
			signal: own.signal
		});
		await follow(pull.body!, known);
	} catch (error) {
		if (own.signal.aborted) return;
		// no answer from the local KI: say nothing; once it answers, the next start tries again
		if (current.state === 'unknown') return;
		console.warn('[ki] KI-Modell konnte nicht geladen werden', { model: config.model, error: String(error) });
		current = { state: 'failed' };
	}
}

type Line = { status?: string; digest?: string; total?: number; completed?: number; error?: string };

// Ollama's pull stream: one JSON object per line, with the bytes done of the layer (digest) being loaded; the notice
// counts the whole model (fach review 577 V-8)
async function follow(stream: ReadableStream<ArrayBuffer | ArrayBufferView>, known: () => void) {
	current = { state: 'loading', percent: 0 };
	const layers = new Map<string, { total: number; completed: number }>();
	let rest = '';
	for await (const chunk of stream.pipeThrough(new TextDecoderStream())) {
		const lines = (rest + chunk).split('\n');
		rest = lines.pop()!;
		for (const line of lines.filter(Boolean)) progress(JSON.parse(line), layers);
		known();
	}
	if (rest.trim()) progress(JSON.parse(rest), layers);
}

function progress(line: Line, layers: Map<string, { total: number; completed: number }>) {
	if (line.error) throw new Error(line.error);
	if (line.status === 'success') current = { state: 'ready' };
	else if (line.total) {
		layers.set(line.digest ?? line.status ?? '', { total: line.total, completed: line.completed ?? 0 });
		const sum = (key: 'total' | 'completed') => [...layers.values()].reduce((all, layer) => all + layer[key], 0);
		// at most 99: Ollama names the next layer only when it starts on it, and «success» says the model is there
		current = { state: 'loading', percent: Math.min(99, Math.floor((sum('completed') / sum('total')) * 100)) };
	}
}
