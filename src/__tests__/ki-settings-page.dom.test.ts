import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import KiPage from '../routes/config/ki/+page.svelte';
import { byTestId, click, show } from './helpers/dom';
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
});
