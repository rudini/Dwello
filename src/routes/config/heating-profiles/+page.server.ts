import type { HeatingProfile } from '$lib/types';

interface HeatingProfilesData {
	profiles: HeatingProfile[];
	total: number;
}

export const load = async (): Promise<HeatingProfilesData> => {
	const mockProfiles: HeatingProfile[] = [
		{
			id: 'hp-standard',
			name: 'Standard',
			type: 'predefined',
			description: 'Gleichmässige Verteilung über Heizperiode (Okt-Apr)',
			isActive: true,
			monthlyPercentages: {
				january: 18,
				february: 15,
				march: 12,
				april: 5,
				may: 0,
				june: 0,
				july: 0,
				august: 0,
				september: 2,
				october: 10,
				november: 18,
				december: 20
			}
		},
		{
			id: 'hp-mittelland',
			name: 'Mittelland',
			type: 'predefined',
			description: 'Optimiert für Schweizer Mittelland',
			isActive: true,
			monthlyPercentages: {
				january: 20,
				february: 17,
				march: 13,
				april: 5,
				may: 0,
				june: 0,
				july: 0,
				august: 0,
				september: 0,
				october: 10,
				november: 15,
				december: 20
			}
		},
		{
			id: 'hp-mountain',
			name: 'Bergregion',
			type: 'predefined',
			description: 'Für höher gelegene Regionen mit längerer Heizperiode',
			isActive: true,
			monthlyPercentages: {
				january: 16,
				february: 14,
				march: 12,
				april: 8,
				may: 3,
				june: 0,
				july: 0,
				august: 0,
				september: 3,
				october: 10,
				november: 14,
				december: 15
			}
		},
		{
			id: 'hp-tessin',
			name: 'Tessin',
			type: 'predefined',
			description: 'Für das milde Klima im Tessin',
			isActive: true,
			monthlyPercentages: {
				january: 22,
				february: 18,
				march: 12,
				april: 3,
				may: 0,
				june: 0,
				july: 0,
				august: 0,
				september: 0,
				october: 7,
				november: 15,
				december: 23
			}
		},
		{
			id: 'hp-custom-1',
			name: 'Eigenes Profil 1',
			type: 'custom',
			description: 'Benutzerdefiniertes Heizprofil (unvollständig)',
			isActive: true,
			monthlyPercentages: {
				january: 17,
				february: 14,
				march: 11,
				april: 6,
				may: 1,
				june: 0,
				july: 0,
				august: 0,
				september: 1,
				october: 9,
				november: 13,
				december: 16
			}
		}
	];

	return {
		profiles: mockProfiles,
		total: mockProfiles.length
	};
};
