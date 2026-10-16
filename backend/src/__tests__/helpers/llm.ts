import { llmConfig } from '../../config/llm';

// A provider with an OpenAI-compatible API that only answers with the configured key; like OpenAI's
// reasoning models it rejects max_tokens and a temperature other than the default
type Content = string | ({ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } })[];

// The text of a message, also of one that carries images
const textOf = (content: Content) =>
	typeof content === 'string' ? content : content.map((part) => (part.type === 'text' ? part.text : '')).join('');

/** `answer` is the answer to every prompt, or a function of the prompt's text */
export function openAiCompatible(answer: object | ((prompt: string) => object)) {
	const prompts: string[] = [];
	const images: string[][] = []; // the image addresses of each prompt
	const server = Bun.serve({
		port: 0,
		fetch: async (request) => {
			if (request.headers.get('authorization') !== 'Bearer test-key') return new Response(null, { status: 401 });
			const path = new URL(request.url).pathname;
			if (path === '/v1/models') return Response.json({ data: [{ id: 'test-model' }] });
			if (path !== '/v1/chat/completions') return new Response(null, { status: 404 });
			const body = (await request.json()) as { messages: { content: Content }[] };
			if ('max_tokens' in body || 'temperature' in body) return new Response(null, { status: 400 });
			const { content } = body.messages[0];
			prompts.push(textOf(content));
			images.push(typeof content === 'string' ? [] : content.flatMap((part) => (part.type === 'image_url' ? [part.image_url.url] : [])));
			const reply = typeof answer === 'function' ? answer(textOf(content)) : answer;
			return Response.json({ choices: [{ message: { role: 'assistant', content: JSON.stringify(reply) } }] });
		}
	});
	Object.assign(llmConfig, { baseUrl: `http://127.0.0.1:${server.port}/v1`, apiKey: 'test-key' });
	return {
		prompts,
		images,
		stop: () => {
			server.stop();
			Object.assign(llmConfig, { baseUrl: 'http://127.0.0.1:9', apiKey: '' });
		}
	};
}
