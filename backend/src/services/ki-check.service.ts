/** «Verbindung prüfen» on the page «KI» (#580): one request to the entered provider, nothing saved */

import { llmConfig } from '../config/llm';
import { checkAddress, keyFor, locked, trimmed, type KiInput } from './ki-settings.service';

// «Verbindung prüfen» sends only this text and this image (a 1×1 PNG), never recorded data (domain review 580 F-3)
const CHECK_TEXT = 'Verbindungstest von Dwello: Antworten Sie nur mit OK.';
const CHECK_IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// The check's one request: the fixed text and image to the entered address; null when nobody answers
const sendCheck = (baseUrl: string, model: string, apiKey: string) =>
	fetch(new URL('chat/completions', `${baseUrl}/`), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...(apiKey && { Authorization: `Bearer ${apiKey}` }) },
		body: JSON.stringify({
			model,
			messages: [{ role: 'user', content: [{ type: 'text', text: CHECK_TEXT }, { type: 'image_url', image_url: { url: CHECK_IMAGE } }] }]
		}),
		signal: AbortSignal.timeout(llmConfig.timeout),
		redirect: 'error'
	}).catch(() => null);

/** Whether the entered provider answers, accepts the key and reads images; nothing is saved */
export async function checkKiConnection(
	input: KiInput
): Promise<{ result: 'ok' | 'wrong-key' | 'unreachable' | 'no-images' }> {
	if (llmConfig.byOperator) throw locked();
	const { baseUrl, model, apiKey: entered } = trimmed(input);
	checkAddress(baseUrl);
	const response = await sendCheck(baseUrl, model, await keyFor(baseUrl, entered));
	if (!response) return { result: 'unreachable' };
	if (response.status === 401 || response.status === 403) return { result: 'wrong-key' };
	if (response.ok) return { result: 'ok' };
	// only a refused request is about the image; a wrong address or model (404), no credit or too many requests, or a
	// server error say nothing about it (code review 580 C-7, domain review 580 F-24)
	return { result: response.status === 400 ? 'no-images' : 'unreachable' };
}
