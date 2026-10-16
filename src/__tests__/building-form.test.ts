import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import BuildingForm from '../routes/buildings/BuildingForm.svelte';

describe('BuildingForm', () => {
	it('renders the create form with address search and create button', () => {
		const { body } = render(BuildingForm, {
			props: { mode: 'create', errors: {}, cancelHref: '/buildings' }
		});

		expect(body).toContain('Adresse suchen');
		expect(body).toContain('Strasse und Hausnummer');
		expect(body).toContain('Gebäude erfassen');
		expect(body).toContain('href="/buildings"');
	});

	it('benennt die Felder wie das Glossar und erklärt sie', () => {
		const { body } = render(BuildingForm, {
			props: { mode: 'create', errors: {}, cancelHref: '/buildings' }
		});
		const labels = [...body.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)].map(([, label]) =>
			label
				.replace(/<[^>]+>/g, '')
				.replace(/\s+/g, ' ')
				.trim()
		);
		expect(labels).toEqual([
			'Gebäudename',
			'Adresse suchen (optional)',
			'Strasse und Hausnummer',
			'PLZ',
			'Ort',
			'Kanton',
			'Gebäudetyp (optional)',
			'Baujahr (optional)',
			'Kein Tank oder Tank stillgelegt'
		]);
		expect(body).toContain('Mehrfamilienhaus, Einfamilienhaus');
		expect(body).not.toMatch(/text-gray|bg-blue|text-sm/);
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

describe('Kein Tank oder Tank stillgelegt (#72)', () => {
	it('zeigt beim Bearbeiten, was festgehalten ist', () => {
		const form = (noTank: boolean) =>
			render(BuildingForm, {
				props: {
					mode: 'edit',
					initial: {
						name: 'A',
						address: 'B 1',
						postalCode: '8001',
						city: 'Z',
						canton: 'ZH',
						noTank
					},
					errors: {},
					cancelHref: '/buildings/42'
				}
			}).body;
		expect(form(true)).toMatch(/name="noTank"[^>]*checked/);
		expect(form(false)).not.toMatch(/name="noTank"[^>]*checked/);
		expect(form(false)).toContain('fragt Dwello dann nicht mehr nach dem Tankbestand');
	});
});
