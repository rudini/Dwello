import { afterEach } from 'vitest';
import { flushSync, mount, unmount, type Component } from 'svelte';

const mounted: ReturnType<typeof mount>[] = [];
const realFetch = globalThis.fetch;
afterEach(() => {
	while (mounted.length) unmount(mounted.pop()!);
	document.body.innerHTML = '';
	globalThis.fetch = realFetch; // fakeBff replaces it per test
});

/** Mounts a component into the document, removed again after the test */
export function show<P extends Record<string, unknown>>(component: Component<P>, props: P) {
	mounted.push(mount(component, { target: document.body, props }));
	flushSync();
}

export const byTestId = <E extends HTMLElement = HTMLElement>(testid: string) =>
	document.querySelector<E>(`[data-testid="${testid}"]`);
export const allByTestId = (testid: string) => [...document.querySelectorAll<HTMLElement>(`[data-testid="${testid}"]`)];

export function click(target: string | HTMLElement) {
	(typeof target === 'string' ? byTestId(target)! : target).click();
	flushSync();
}

/** Types a value into a field the way a user does, so `oninput` and `bind:value` see it */
export function fireEvent(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, type: 'input' | 'change', value: string) {
	field.value = value;
	field.dispatchEvent(new Event(type, { bubbles: true }));
	flushSync();
}

export type ApiCall = { method: string; path: string; body?: unknown };

/**
 * Answers the browser's calls to the BFF (`/api/...`), the way the backend would, and records them.
 * `answer` gets each call and returns [status, body].
 */
export function fakeBff(answer: (call: ApiCall) => [number, unknown?] = () => [200, {}]) {
	const calls: ApiCall[] = [];
	globalThis.fetch = (async (url: string, init?: RequestInit) => {
		const call = {
			method: init?.method ?? 'GET',
			path: String(url).replace(/^\/api/, ''),
			body: init?.body ? JSON.parse(String(init.body)) : undefined
		};
		calls.push(call);
		const [status, body] = answer(call);
		return new Response(status === 204 ? null : JSON.stringify(body ?? {}), { status });
	}) as typeof fetch;
	return calls;
}

/** Waits until pending promises (e.g. an API call after a click) have settled and the DOM is updated */
export async function settle() {
	for (let i = 0; i < 5; i++) await new Promise((resolve) => setTimeout(resolve, 0));
	flushSync();
}

/** Submits the form around a submit button, as pressing it does in a browser (jsdom does not) */
export function submit(testid: string) {
	byTestId(testid)!.closest('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
	flushSync();
}
