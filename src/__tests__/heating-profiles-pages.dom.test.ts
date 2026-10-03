import { describe, it, expect } from 'vitest';
import ProfilesPage from '../routes/config/heating-profiles/+page.svelte';
import ProfilePage from '../routes/config/heating-profiles/[id]/+page.svelte';
import NewProfilePage from '../routes/config/heating-profiles/new/+page.svelte';
import EditProfilePage from '../routes/config/heating-profiles/[id]/edit/+page.svelte';
import { allByTestId, byTestId, click, fireEvent, show } from './helpers/dom';

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
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

describe('Heizprofile', () => {
	it('zeigt eigene und vordefinierte Profile', () => {
		show(ProfilesPage, { data: { profiles: [profile('predefined'), { ...profile('custom'), id: 'hp2', name: 'Berg' }] } } as never);

		const cards = allByTestId('heating-profile-card');
		expect(cards.map((card) => card.textContent)).toEqual([
			expect.stringContaining('Vordefiniert'),
			expect.stringContaining('Eigenes Profil')
		]);
		expect(cards[1].getAttribute('href')).toBe('/config/heating-profiles/hp2');
	});
});

describe('Heizprofil', () => {
	it('zeigt die Monatsanteile und ihre Summe', () => {
		show(ProfilePage, { data: { profile: profile('predefined') }, form: null } as never);

		expect(byTestId('heating-profile-share-december')!.textContent).toBe('26 %');
		expect(byTestId('heating-profile-total')!.textContent).toBe('100 %');
	});

	it('lässt vordefinierte Profile unverändert', () => {
		show(ProfilePage, { data: { profile: profile('predefined') }, form: null } as never);

		expect(byTestId('heating-profile-edit-button')).toBeNull();
		expect(byTestId('heating-profile-delete-button')).toBeNull();
	});

	it('fragt vor dem Löschen eines eigenen Profils nach', () => {
		show(ProfilePage, { data: { profile: profile('custom') }, form: null } as never);

		click('heating-profile-delete-button');
		expect(document.body.textContent).toContain('Heizprofil «Winter» löschen?');
	});

	it('zeigt einen Fehler beim Löschen direkt in der Nachfrage', () => {
		show(ProfilePage, { data: { profile: profile('custom') }, form: { error: 'Heizprofil wird noch verwendet' } } as never);

		expect(document.body.textContent).toContain('Heizprofil wird noch verwendet');
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
		expect(document.body.textContent).toContain('Die Monatsanteile müssen zusammen 100 % ergeben');
	});
});
