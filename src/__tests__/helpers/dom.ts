import { afterEach } from 'vitest';
import { flushSync, mount, unmount, type Component } from 'svelte';

const mounted: ReturnType<typeof mount>[] = [];
afterEach(() => {
	while (mounted.length) unmount(mounted.pop()!);
	document.body.innerHTML = '';
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
