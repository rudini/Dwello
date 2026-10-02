import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import BuildingForm from '$lib/components/BuildingForm.svelte';

describe('BuildingForm', () => {
	it('renders the create form with address search and create button', () => {
		const { body } = render(BuildingForm, {
			props: { mode: 'create', errors: {}, cancelHref: '/buildings' }
		});

		expect(body).toContain('Adresse suchen');
		expect(body).toContain('Strasse und Hausnummer');
		expect(body).toContain('Gebäude erstellen');
		expect(body).toContain('href="/buildings"');
	});

	it('renders the edit form prefilled without address search', () => {
		const { body } = render(BuildingForm, {
			props: {
				mode: 'edit',
				initial: {
					name: 'Musterhaus',
					address: 'Bahnhofstrasse 1',
					postalCode: '8001',
					city: 'Zürich',
					canton: 'ZH',
					yearBuilt: 1985
				},
				errors: {},
				cancelHref: '/buildings/42'
			}
		});

		expect(body).not.toContain('Adresse suchen');
		expect(body).toContain('value="Bahnhofstrasse 1"');
		expect(body).toContain('value="1985"');
		expect(body).toContain('Änderungen speichern');
		expect(body).toContain('href="/buildings/42"');
	});

	it('renders field and form errors', () => {
		const { body } = render(BuildingForm, {
			props: {
				mode: 'edit',
				errors: {
					name: 'Gebäudename ist erforderlich',
					postalCode: 'PLZ muss 4 Ziffern haben',
					canton: 'Kanton ist erforderlich',
					form: 'Fehler beim Speichern'
				},
				cancelHref: '/buildings/42'
			}
		});

		expect(body).toContain('Gebäudename ist erforderlich');
		expect(body).toContain('PLZ muss 4 Ziffern haben');
		expect(body).toContain('Kanton ist erforderlich');
		expect(body).toContain('Fehler beim Speichern');
		expect(body.match(/data-testid="form-error"/g)).toHaveLength(4);
	});
});
