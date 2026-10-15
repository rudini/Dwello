import { llmConfig } from '../../config/llm';

// A provider with an OpenAI-compatible API that only answers with the configured key; like OpenAI's
// reasoning models it rejects max_tokens and a temperature other than the default
export function openAiCompatible(answer: object) {
	const prompts: string[] = [];
	const server = Bun.serve({
		port: 0,
		fetch: async (request) => {
			if (request.headers.get('authorization') !== 'Bearer test-key') return new Response(null, { status: 401 });
			const path = new URL(request.url).pathname;
			if (path === '/v1/models') return Response.json({ data: [{ id: 'test-model' }] });
			if (path !== '/v1/chat/completions') return new Response(null, { status: 404 });
			const body = (await request.json()) as { messages: { content: string }[] };
			if ('max_tokens' in body || 'temperature' in body) return new Response(null, { status: 400 });
			prompts.push(body.messages[0].content);
			return Response.json({ choices: [{ message: { role: 'assistant', content: JSON.stringify(answer) } }] });
		}
	});
	Object.assign(llmConfig, { baseUrl: `http://127.0.0.1:${server.port}/v1`, apiKey: 'test-key' });
	return {
		prompts,
		stop: () => {
			server.stop();
			Object.assign(llmConfig, { baseUrl: 'http://127.0.0.1:9', apiKey: '' });
		}
	};
}
