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

export async function loadModel(config: { baseUrl: string; model: string; local: boolean }) {
	current = { state: 'unknown' };
	if (!config.local) return;
	const ollama = ollamaOf(config.baseUrl);
	try {
		const { models } = (await (await fetch(`${ollama}/api/tags`)).json()) as { models: { name: string }[] };
		if (models.some((model) => model.name === config.model)) {
			current = { state: 'ready' };
			return;
		}
		const pull = await fetch(`${ollama}/api/pull`, { method: 'POST', body: JSON.stringify({ model: config.model, stream: true }) });
		await follow(pull.body!);
	} catch (error) {
		// no answer from the local KI: say nothing; once it answers, the next start tries again
		if (current.state === 'unknown') return;
		console.warn('[ki] KI-Modell konnte nicht geladen werden', { model: config.model, error: String(error) });
		current = { state: 'failed' };
	}
}

// Ollama's pull stream: one JSON object per line, with the bytes done of the layer being loaded
async function follow(stream: ReadableStream<Uint8Array>) {
	current = { state: 'loading', percent: 0 };
	let rest = '';
	for await (const chunk of stream.pipeThrough(new TextDecoderStream())) {
		const lines = (rest + chunk).split('\n');
		rest = lines.pop()!;
		for (const line of lines.filter(Boolean)) progress(JSON.parse(line));
	}
}

function progress(line: { status?: string; total?: number; completed?: number; error?: string }) {
	if (line.error) throw new Error(line.error);
	if (line.status === 'success') current = { state: 'ready' };
	else if (line.total) current = { state: 'loading', percent: Math.floor(((line.completed ?? 0) / line.total) * 100) };
}
