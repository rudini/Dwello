import { afterEach, describe, expect, it, vi } from 'vitest';
import Alert from '$lib/ui/Alert.svelte';
import Badge from '$lib/ui/Badge.svelte';
import EmptyState from '$lib/ui/EmptyState.svelte';
import SaveStatus from '$lib/ui/SaveStatus.svelte';
import DraftNotice from '$lib/ui/DraftNotice.svelte';
import ProgressBar from '$lib/ui/ProgressBar.svelte';
import { tick } from 'svelte';
import { byTestId, show } from './helpers/dom';
import { markup } from './helpers/snippet';

// #252: the browser may run in UTC; the wizard names the time in Switzerland like the rest of the app
const zone = process.env.TZ;
const inUtc = () => (process.env.TZ = 'UTC');
afterEach(() => {
	if (zone === undefined) delete process.env.TZ;
	else process.env.TZ = zone;
});

describe('Hinweis', () => {
	it('trägt Titel, Text und ein Symbol, damit die Farbe nicht allein spricht', () => {
		show(Alert, {
			tone: 'caution',
			title: 'Keine Rechnungen erfasst',
			children: markup('<p>Erfassen Sie zuerst die Rechnungen.</p>'),
			testid: 'no-invoices'
		});
		const alert = byTestId('no-invoices')!;
		expect(alert.textContent).toContain('Keine Rechnungen erfasst');
		expect(alert.querySelector('svg')).not.toBeNull();
	});

	it('wird bei Fehlern sofort vorgelesen', () => {
		show(Alert, { tone: 'critical', title: 'Speichern fehlgeschlagen', testid: 'err' });
		expect(byTestId('err')!.getAttribute('role')).toBe('alert');
	});

	it('drängt sich bei Informationen nicht auf', () => {
		show(Alert, { tone: 'info', title: 'Gut zu wissen', testid: 'info' });
		expect(byTestId('info')!.getAttribute('role')).toBeNull();
	});
});

describe('Statusmarke', () => {
	it('zeigt den Status als Wort', () => {
		show(Badge, { tone: 'critical', label: 'Überfällig' });
		expect(document.body.textContent).toContain('Überfällig');
	});
});

describe('Leerer Zustand', () => {
	it('erklärt, was fehlt, und bietet den nächsten Schritt an', () => {
		show(EmptyState, {
			title: 'Noch keine Mieter',
			text: 'Erfassen Sie Ihren ersten Mieter.',
			actionLabel: 'Mieter erfassen',
			actionHref: '/tenants/new',
			illustration: 'contract',
			testid: 'tenants-empty'
		});
		const empty = byTestId('tenants-empty')!;
		expect(empty.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
		expect(empty.querySelector('h2')!.textContent).toBe('Noch keine Mieter');
		expect(empty.querySelector('a')!.getAttribute('href')).toBe('/tenants/new');
	});

	it('gibt dem nächsten Schritt eine Test-ID', () => {
		show(EmptyState, {
			title: 'Noch keine Wohnungen',
			text: 'Erfassen Sie die erste Wohnung.',
			actionLabel: 'Wohnung erfassen',
			actionHref: '/apartments/new',
			actionTestid: 'apartment-first-create-button'
		});
		expect(byTestId('apartment-first-create-button')!.getAttribute('href')).toBe('/apartments/new');
	});
});

describe('Speicherstatus', () => {
	it('sagt, wann der Entwurf gespeichert wurde, in Schweizer Zeit, und wird vorgelesen', () => {
		inUtc();
		show(SaveStatus, { savedAt: new Date('2026-10-09T12:32:00Z') });
		const status = document.querySelector('[role=status]')!;
		expect(status.textContent).toContain('Entwurf gespeichert, 14:32');
		expect(status.getAttribute('data-testid')).toBe('save-status');
	});

	it('schweigt, solange nichts gespeichert ist', () => {
		show(SaveStatus, { savedAt: null });
		expect(document.querySelector('[role=status]')!.textContent!.trim()).toBe('');
	});
});

describe('Fortschrittsbalken', () => {
	it('nennt den Fortschritt als Wert und in Worten', () => {
		show(ProgressBar, { value: 2, max: 5, label: 'Schritt 2 von 5' });
		const bar = document.querySelector('[role=progressbar]')!;
		expect(bar.getAttribute('aria-valuenow')).toBe('2');
		expect(bar.getAttribute('aria-valuemax')).toBe('5');
		expect(bar.getAttribute('aria-label')).toBe('Schritt 2 von 5');
	});
});

describe('Wiederhergestellter Entwurf', () => {
	it('sagt, wann der Entwurf zuletzt bearbeitet wurde, in Schweizer Zeit', () => {
		inUtc();
		show(DraftNotice, { savedAt: new Date('2026-10-09T22:32:00Z'), ondiscard: vi.fn() });
		expect(byTestId('draft-restored')!.textContent).toContain(
			'zuletzt am 10.10.2026 um 00:32 bearbeitet'
		);
	});

	// #201: verworfen wird erst nach der Rückfrage
	it('fragt vor dem Verwerfen, was es löscht', async () => {
		const ondiscard = vi.fn();
		show(DraftNotice, { savedAt: new Date('2026-10-09T14:32:00Z'), ondiscard });
		byTestId('draft-discard')!.click();
		await tick();
		expect(ondiscard).not.toHaveBeenCalled();
		expect(byTestId('draft-discard-message')!.textContent).toBe('Ihre Angaben werden gelöscht.');
		byTestId('draft-discard-confirm')!.click();
		expect(ondiscard).toHaveBeenCalled();
	});

	it('lässt sich schliessen, ohne die Angaben zu verwerfen', async () => {
		const ondiscard = vi.fn();
		show(DraftNotice, { savedAt: new Date('2026-10-09T14:32:00Z'), ondiscard });
		byTestId('draft-close')!.click();
		await tick();
		expect(byTestId('draft-restored')).toBeNull();
		expect(ondiscard).not.toHaveBeenCalled();
	});
});
