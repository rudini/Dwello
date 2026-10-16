import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';

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
async function answer(result: { type: string; data?: unknown }) {
	const after = server.submit!({ formData: new FormData(server.form!) }) as (
		input: unknown
	) => Promise<void>;
	await after({ update: async () => {}, result });
	await settle();
}

import ProfilesPage from '../routes/config/heating-profiles/+page.svelte';
import ProfilePage from '../routes/config/heating-profiles/[id]/+page.svelte';
import NewProfilePage from '../routes/config/heating-profiles/new/+page.svelte';
import EditProfilePage from '../routes/config/heating-profiles/[id]/edit/+page.svelte';
import { toasts } from '$lib/stores';
import { allByTestId, byTestId, click, fireEvent, settle, show } from './helpers/dom';

const MONTHS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
];
const shares = (values: number[]) => Object.fromEntries(MONTHS.map((m, i) => [m, values[i]]));
const winter = shares([18, 14, 11, 5, 2, 0, 0, 0, 2, 8, 14, 26]);
const profile = (type: 'predefined' | 'custom') => ({
	id: 'hp1',
	name: 'Winter',
	type,
	description: 'Starke Heizmonate',
	isActive: true,
	monthlyPercentages: winter
});
const text = () => document.body.textContent!.replace(/\s+/g, ' ');
const toastTexts = () => get(toasts).map((toast) => toast.message);

beforeEach(() => toasts.set([]));

describe('Heizprofile', () => {
	it('zeigt eigene und vordefinierte Profile unter ihrem deutschen Namen, der Name öffnet das Profil', () => {
		show(ProfilesPage, {
			data: {
				profiles: [
					{ ...profile('predefined'), name: 'Heating Mountain', nameDE: 'Heizung Bergregion' },
					{ ...profile('custom'), id: 'hp2', name: 'Berg' }
				]
			}
		} as never);

		const cards = allByTestId('heating-profile-card');
		expect(cards.map((card) => card.textContent)).toEqual([
			expect.stringContaining('Vordefiniert'),
			expect.stringContaining('Eigenes Heizprofil')
		]);
		const links = cards.map((card) => card.querySelector('h2 a')!);
		expect(links.map((link) => link.textContent!.trim())).toEqual(['Heizung Bergregion', 'Berg']);
		expect(links[1].getAttribute('href')).toBe('/config/heating-profiles/hp2');
	});

	it('erklärt, wozu ein Heizprofil dient', () => {
		show(ProfilesPage, { data: { profiles: [] } } as never);

		expect(text()).toContain('Verteilt die Heizkosten in Prozent auf die 12 Monate');
		expect(text()).toContain('nach Monaten statt nach Tagen');
	});
});

describe('Heizprofil', () => {
	it('zeigt die Monatsanteile und ihre Summe', () => {
		show(ProfilePage, { data: { profile: profile('predefined') }, form: null } as never);

		expect(byTestId('heating-profile-share-december')!.textContent).toBe('26 %');
		expect(allByTestId('heating-profile-share-december')).toHaveLength(1);
		expect(byTestId('heating-profile-total')!.textContent).toBe('100 %');
	});

	it('nennt das Profil mit seinem deutschen Namen', () => {
		const data = { profile: { ...profile('predefined'), nameDE: 'Heizung Winter' } };
		show(ProfilePage, { data, form: null } as never);

		expect(document.querySelector('h1')!.textContent).toBe('Heizung Winter');
	});

	it('lässt vordefinierte Profile unverändert', () => {
		show(ProfilePage, { data: { profile: profile('predefined') }, form: null } as never);

		expect(byTestId('heating-profile-edit-button')).toBeNull();
		expect(byTestId('heating-profile-delete-button')).toBeNull();
	});

	it('fragt vor dem Löschen eines eigenen Profils nach und bestätigt das Löschen', async () => {
		show(ProfilePage, { data: { profile: profile('custom') }, form: null } as never);

		click('heating-profile-delete-button');
		expect(text()).toContain('Heizprofil «Winter» löschen?');

		click('heating-profile-delete-confirm');
		await answer({ type: 'redirect' });
		expect(toastTexts()).toEqual(['Heizprofil «Winter» gelöscht']);
	});

	it('zeigt einen Fehler beim Löschen direkt in der Nachfrage', () => {
		show(ProfilePage, {
			data: { profile: profile('custom') },
			form: { error: 'Heizprofil wird noch verwendet' }
		} as never);

		expect(byTestId('heating-profile-delete-confirm')).not.toBeNull();
		expect(text()).toContain('Heizprofil wird noch verwendet');
	});
});

describe('Heizprofil erfassen und bearbeiten', () => {
	it('rechnet die Summe beim Eingeben mit', () => {
		show(NewProfilePage, { form: null } as never);
		expect(byTestId('heating-profile-form-total')!.textContent).toContain('Summe: 0 %');

		fireEvent(byTestId<HTMLInputElement>('heating-profile-month-january')!, 'input', '60');
		fireEvent(byTestId<HTMLInputElement>('heating-profile-month-february')!, 'input', '40');
		expect(byTestId('heating-profile-form-total')!.textContent).toContain('Summe: 100 %');
	});

	it('übernimmt beim Bearbeiten die Anteile und meldet eine falsche Summe', () => {
		show(EditProfilePage, {
			data: { profile: profile('custom') },
			form: { errors: { total: 'Die Monatsanteile müssen zusammen 100 % ergeben' } }
		} as never);

		expect(byTestId<HTMLInputElement>('heating-profile-month-december')!.value).toBe('26');
		expect(byTestId<HTMLInputElement>('heating-profile-name-input')!.value).toBe('Winter');
		expect(byTestId('form-error')!.textContent).toContain(
			'Die Monatsanteile müssen zusammen 100 % ergeben'
		);
	});

	// #230: eine Abrechnung behält die Anteile, mit denen sie erstellt wurde; ein neues Profil hat noch keine Abrechnung
	it('sagt beim Bearbeiten, dass bestehende Abrechnungen ihre Anteile behalten', () => {
		show(EditProfilePage, { data: { profile: profile('custom') }, form: null } as never);
		expect(byTestId('heating-profile-shares-help')!.textContent).toContain(
			'Bestehende Abrechnungen behalten die Monatsanteile, mit denen sie erstellt wurden.'
		);
	});

	it('sagt beim Erfassen nichts über bestehende Abrechnungen', () => {
		show(NewProfilePage, { form: null } as never);
		expect(byTestId('heating-profile-shares-help')!.textContent).toContain('Die Monatsanteile verteilen');
		expect(byTestId('heating-profile-shares-help')!.textContent).not.toContain('Bestehende Abrechnungen');
	});

	it('bestätigt das Speichern mit dem Namen des Heizprofils', async () => {
		show(NewProfilePage, { form: null } as never);
		fireEvent(byTestId<HTMLInputElement>('heating-profile-name-input')!, 'input', 'Bergtal');

		await answer({ type: 'redirect' });
		expect(toastTexts()).toEqual(['Heizprofil «Bergtal» gespeichert']);
	});
});
