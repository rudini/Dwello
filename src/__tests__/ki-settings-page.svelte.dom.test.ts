import { describe, it, expect, vi } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';

// enhance as SvelteKit wires it: the test plays the server's answer to the last submit
const server = vi.hoisted(() => ({
	submit: null as null | ((input: unknown) => unknown),
	form: null as HTMLFormElement | null
}));
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit?: (input: unknown) => unknown) => {
		if (submit && form.getAttribute('action') === '?/save') Object.assign(server, { submit, form });
		return { destroy() {} };
	}
}));

import KiPage from '../routes/config/ki/+page.svelte';
import { byTestId, click, fireEvent, show } from './helpers/dom';
import settings from '../../tests/contracts/ki-settings.json';

const text = () => document.body.textContent!.replace(/\s+/g, ' ');
const page = (ki: object, model: object = { state: 'unknown' }) =>
	show(KiPage, { data: { ki: { ...settings, ...ki }, model }, form: null } as never);

describe('Seite KI', () => {
	// #580: die Seite sagt, wenn das KI-Modell der lokalen KI bereit ist; die Szenarien erreichen das nicht
	it('sagt, wenn das KI-Modell geladen ist', () => {
		page({ mode: 'local' }, { state: 'ready' });

		expect(text()).toContain('Das KI-Modell ist geladen.');
		expect(byTestId('ki-model-download-button')).toBeNull();
	});

	// Fachreview 580 F-2: die drei Punkte gelten für einen bestimmten Anbieter, auch einen gespeicherten
	it('lässt die Bestätigung beim gespeicherten Anbieter leer', () => {
		page({ mode: 'provider' });

		expect((byTestId('ki-privacy-confirm') as HTMLInputElement).checked).toBe(false);
	});

	it('zeigt die Felder eines Anbieters erst, wenn er gewählt ist', async () => {
		page({ mode: 'local' }, { state: 'ready' });
		expect(byTestId('ki-base-url-input')).toBeNull();

		await click(byTestId('ki-mode-provider')!);

		expect(byTestId('ki-base-url-input')).not.toBeNull();
	});

	// Fachreview 580 F-26: hat der Betreiber die KI abgeschaltet (LLM_ENABLED=false), gibt es keine Adresse zu zeigen
	it('zeigt bei einer vom Betreiber abgeschalteten KI keine Adresse und kein Modell', () => {
		page({ mode: 'none', byOperator: true });

		expect(text()).toContain('Keine KI');
		expect(byTestId('ki-base-url-input')).toBeNull();
		expect(byTestId('ki-model-input')).toBeNull();
	});

	// Persona Marco und Dr. Weber 580 P-1: nach «Verbindung prüfen» bleibt, was eingetippt ist, auch wenn die Seite ihre
	// Daten neu lädt; sonst speichert das nächste «KI speichern» den alten Anbieter
	it('behält eingetippte Angaben, wenn die Seite ihre Daten neu lädt', async () => {
		const props = $state({
			data: { ki: { ...settings }, model: { state: 'unknown' } },
			form: null as unknown
		});
		const app = mount(KiPage, { target: document.body, props: props as never });
		flushSync();
		const country = byTestId<HTMLInputElement>('ki-country-input')!;
		await fireEvent(country, 'input', 'Österreich');

		props.data = { ki: { ...settings }, model: { state: 'unknown' } };
		flushSync();

		expect(byTestId<HTMLInputElement>('ki-country-input')!.value).toBe('Österreich');
		unmount(app);
	});

	// Persona Sven 580 P-1: nach der Prüfung bleibt der Fokus beim Knopf, nicht oben auf der Seite
	it('lässt den Fokus nach «Verbindung prüfen» auf dem Knopf', async () => {
		page({ mode: 'provider' });
		const button = byTestId('ki-check-button')!;
		button.focus();

		const after = server.submit!({
			formData: new FormData(server.form!),
			action: new URL('http://localhost/config/ki?/check'),
			submitter: button
		}) as (input: unknown) => Promise<void>;
		document.body.focus();
		const update = vi.fn(async () => {});
		await after({ update, formElement: server.form, result: { type: 'success' } });
		await tick();
		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(update).toHaveBeenCalledWith({ reset: false, invalidateAll: false });
		expect(document.activeElement).toBe(button);
	});

	// Persona Anna 580 P-1: antwortet die lokale KI nicht, hilft kein Download; der Hinweis sagt, was das für die
	// Rechnungen heisst und wer etwas tun kann
	it('sagt ohne Download-Knopf, was zu tun ist, wenn die lokale KI nicht antwortet', () => {
		page({ mode: 'local' }, { state: 'unknown' });

		expect(text()).toContain(
			'Die lokale KI antwortet nicht. Bis sie antwortet, erfassen Sie Rechnungen von Hand. Betreiben Sie Dwello selbst, starten Sie die lokale KI, wie die Installationsanleitung beschreibt; sonst wenden Sie sich an den Betreiber oder wählen oben einen Anbieter oder keine KI.'
		);
		expect(byTestId('ki-model-download-button')).toBeNull();
	});

	// Personas Anna P-3, Marco P-2, Dr. Weber P-3, Sven P-5: der Hinweis zum KI-Modell gehört zur lokalen KI
	it('zeigt das KI-Modell nur, solange die lokale KI gewählt ist', async () => {
		page({ mode: 'local' }, { state: 'failed' });
		expect(byTestId('ki-model-state')).not.toBeNull();

		await click(byTestId('ki-mode-provider')!);

		expect(byTestId('ki-model-state')).toBeNull();
	});

	// Personas Marco P-3, Dr. Weber P-4, Helga P-6: Name und Land haben je ihren eigenen Hilfetext
	it('erklärt den Namen des Anbieters anders als das Land', () => {
		page({ mode: 'provider' });

		expect(text()).toContain(
			'Der Name der Firma, wie er im Vertrag mit ihr steht. Läuft die KI auf einem Server, den Sie selbst betreiben, schreiben Sie «eigener Server».'
		);
		expect(text()).toContain(
			// Fachreview 580-5 F-27: auch Länder, aus denen nur zugegriffen wird, und die der beigezogenen Firmen
			'Die Länder, in denen der Anbieter und die Firmen, die er beizieht, die Daten bearbeiten, auch wenn sie nur darauf zugreifen. Sie stehen meist im Vertrag oder in der Liste der Unterauftragnehmer.'
		);
	});
});
