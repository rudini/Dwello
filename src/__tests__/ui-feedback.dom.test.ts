import { describe, expect, it } from 'vitest';
import Alert from '$lib/ui/Alert.svelte';
import Badge from '$lib/ui/Badge.svelte';
import EmptyState from '$lib/ui/EmptyState.svelte';
import SaveStatus from '$lib/ui/SaveStatus.svelte';
import ProgressBar from '$lib/ui/ProgressBar.svelte';
import { byTestId, show } from './helpers/dom';
import { markup } from './helpers/snippet';

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
			testid: 'tenants-empty'
		});
		const empty = byTestId('tenants-empty')!;
		expect(empty.querySelector('h2')!.textContent).toBe('Noch keine Mieter');
		expect(empty.querySelector('a')!.getAttribute('href')).toBe('/tenants/new');
	});
});

describe('Speicherstatus', () => {
	it('sagt, wann der Entwurf gespeichert wurde, und wird vorgelesen', () => {
		show(SaveStatus, { savedAt: new Date('2026-10-09T14:32:00') });
		const status = document.querySelector('[role=status]')!;
		expect(status.textContent).toContain('Entwurf gespeichert, 14:32');
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
