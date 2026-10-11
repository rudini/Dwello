import { describe, expect, it, vi } from 'vitest';

// enhance as SvelteKit wires it: the test plays the server's answer to the last submit
const server = vi.hoisted(() => ({
	submit: null as null | ((input: unknown) => unknown),
	form: null as HTMLFormElement | null
}));
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit?: (input: unknown) => unknown) => {
		if (submit) Object.assign(server, { submit, form });
		return { destroy() {} };
	}
}));
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
async function refuse() {
	const after = server.submit!({ formData: new FormData(server.form!) }) as (
		input: unknown
	) => Promise<void>;
	await after({ update: async () => {}, result: { type: 'failure' }, formElement: server.form });
	await settle();
}

import { focusFirstError } from '$lib/ui/focus-error';
import TenantForm from '../routes/tenants/TenantForm.svelte';
import NewCategoryPage from '../routes/config/categories/new/+page.svelte';
import NewInvoicePage from '../routes/invoices/new/+page.svelte';
import { byTestId, settle, show, submit } from './helpers/dom';

function form(html: string) {
	document.body.innerHTML = `<form>${html}</form>`;
	return document.querySelector('form')!;
}

describe('Fokus nach einem abgelehnten Speichern', () => {
	// Mit Enter im fehlerhaften Feld gesendet: der Fokus stand schon dort und der Screenreader blieb stumm
	it('setzt den Fokus neu, auch wenn das fehlerhafte Feld ihn schon hat, damit der Fehler vorgelesen wird', async () => {
		const element = form(
			`<input id="a" aria-invalid="true" aria-describedby="a-error" /><p id="a-error">Das Ende liegt vor dem Beginn.</p>`
		);
		const field = element.querySelector('input')!;
		field.focus();
		const focused = vi.fn();
		field.addEventListener('focus', focused);

		await focusFirstError(element);

		expect(focused).toHaveBeenCalledTimes(1);
		expect(document.activeElement).toBe(field);
	});

	it('springt zum ersten ungültigen Feld, damit sein Fehler vorgelesen wird', async () => {
		const element = form(`
			<div role="alert" tabindex="-1">Nicht gespeichert</div>
			<input id="a" />
			<select id="b" aria-invalid="true"></select>
			<textarea id="c" aria-invalid="true"></textarea>`);

		await focusFirstError(element);

		expect(document.activeElement!.id).toBe('b');
	});

	it('springt zur Fehlermeldung des Formulars, wenn kein Feld ungültig ist', async () => {
		const element = form(
			`<input id="a" /><div id="m" role="alert" tabindex="-1">Name vergeben</div>`
		);

		await focusFirstError(element);

		expect(document.activeElement!.id).toBe('m');
	});

	it('lässt den Fokus, wo er ist, wenn nichts falsch ist', async () => {
		const element = form(`<input id="a" /><button id="s">Speichern</button>`);
		document.getElementById('s')!.focus();

		await focusFirstError(element);

		expect(document.activeElement!.id).toBe('s');
	});
});

describe('Formulare nach einem abgelehnten Speichern', () => {
	it('Mieter: der Fokus steht auf dem ersten Feld mit Fehler', async () => {
		show(TenantForm, {
			errors: { firstName: 'Vorname ist erforderlich', email: 'E-Mail ist erforderlich' },
			cancelHref: '/tenants',
			submitLabel: 'Mieter speichern',
			submitIcon: 'save'
		});

		await refuse();

		expect(document.activeElement!.id).toBe('firstName');
	});

	it('Kategorie: ohne Feldfehler steht der Fokus auf der Meldung', async () => {
		show(NewCategoryPage, {
			form: { errors: { form: 'Kategorie konnte nicht gespeichert werden.' } }
		} as never);

		await refuse();

		expect(document.activeElement).toBe(byTestId('form-error'));
	});

	it('Rechnung: die Prüfung im Browser setzt den Fokus auf das erste Feld mit Fehler', async () => {
		show(NewInvoicePage, {
			data: {
				buildings: [],
				categories: [],
				distributionKeys: [],
				llmAvailable: false,
				defaultDistributionKeyId: '',
				buildingId: '',
				returnTo: null
			}
		} as never);

		submit('submit-button');
		await settle();

		expect(document.activeElement!.getAttribute('aria-invalid')).toBe('true');
	});
});
