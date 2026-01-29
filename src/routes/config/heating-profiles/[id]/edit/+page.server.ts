import { error, redirect } from '@sveltejs/kit';
import type { HeatingProfile } from '$lib/types';
import type { Actions } from './$types';

export interface HeatingProfileEditData {
	profile: HeatingProfile;
}

// Mock profiles data - same as detail page
const mockProfiles: HeatingProfile[] = [
	{
		id: 'hp-standard',
		name: 'Standard',
		type: 'predefined',
		description: 'Gleichmässige Verteilung über Heizperiode (Okt-Apr)',
		isActive: true,
		monthlyPercentages: {
			january: 18, february: 15, march: 12, april: 5, may: 0, june: 0,
			july: 0, august: 0, september: 2, october: 10, november: 18, december: 20
		}
	},
	{
		id: 'hp-mittelland',
		name: 'Mittelland',
		type: 'predefined',
		description: 'Optimiert für Schweizer Mittelland',
		isActive: true,
		monthlyPercentages: {
			january: 20, february: 17, march: 13, april: 5, may: 0, june: 0,
			july: 0, august: 0, september: 0, october: 10, november: 15, december: 20
		}
	},
	{
		id: 'hp-mountain',
		name: 'Bergregion',
		type: 'predefined',
		description: 'Für höher gelegene Regionen mit längerer Heizperiode',
		isActive: true,
		monthlyPercentages: {
			january: 16, february: 14, march: 12, april: 8, may: 3, june: 0,
			july: 0, august: 0, september: 3, october: 10, november: 14, december: 15
		}
	},
	{
		id: 'hp-tessin',
		name: 'Tessin',
		type: 'predefined',
		description: 'Für das milde Klima im Tessin',
		isActive: true,
		monthlyPercentages: {
			january: 22, february: 18, march: 12, april: 3, may: 0, june: 0,
			july: 0, august: 0, september: 0, october: 7, november: 15, december: 23
		}
	},
	{
		id: 'hp-custom-1',
		name: 'Eigenes Profil 1',
		type: 'custom',
		description: 'Benutzerdefiniertes Heizprofil (unvollständig)',
		isActive: true,
		monthlyPercentages: {
			january: 17, february: 14, march: 11, april: 6, may: 1, june: 0,
			july: 0, august: 0, september: 1, october: 9, november: 13, december: 16
		}
	}
];

export const load = async ({ params }: { params: { id: string } }): Promise<HeatingProfileEditData> => {
	const profileId = params.id;
	const profile = mockProfiles.find((p) => p.id === profileId);

	if (!profile) {
		throw error(404, 'Heating profile not found');
	}

	// Only custom profiles can be edited
	if (profile.type === 'predefined') {
		throw error(403, 'Predefined profiles cannot be edited');
	}

	return { profile };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const profileId = params.id;
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		// Get monthly percentages
		const monthlyPercentages = {
			january: parseInt(formData.get('january') as string) || 0,
			february: parseInt(formData.get('february') as string) || 0,
			march: parseInt(formData.get('march') as string) || 0,
			april: parseInt(formData.get('april') as string) || 0,
			may: parseInt(formData.get('may') as string) || 0,
			june: parseInt(formData.get('june') as string) || 0,
			july: parseInt(formData.get('july') as string) || 0,
			august: parseInt(formData.get('august') as string) || 0,
			september: parseInt(formData.get('september') as string) || 0,
			october: parseInt(formData.get('october') as string) || 0,
			november: parseInt(formData.get('november') as string) || 0,
			december: parseInt(formData.get('december') as string) || 0
		};

		// Validate
		const errors: Record<string, string> = {};
		if (!name?.trim()) {
			errors.name = 'Name ist erforderlich';
		}

		const total = Object.values(monthlyPercentages).reduce((sum, val) => sum + val, 0);
		if (total < 95 || total > 105) {
			errors.total = `Die Summe sollte nahe bei 100% liegen (aktuell: ${total}%)`;
		}

		if (Object.keys(errors).length > 0) {
			return { success: false, errors };
		}

		// Find and update the profile
		const profileIndex = mockProfiles.findIndex((p) => p.id === profileId);
		if (profileIndex === -1) {
			throw error(404, 'Heating profile not found');
		}

		mockProfiles[profileIndex] = {
			...mockProfiles[profileIndex],
			name,
			description,
			monthlyPercentages
		};

		throw redirect(303, `/config/heating-profiles/${profileId}`);
	}
};
