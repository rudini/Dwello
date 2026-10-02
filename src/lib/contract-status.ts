import type { ContractHistory } from './types';

/** Badge of a contract in a contract history */
export const contractBadges = {
	active: { status: 'AKTIV', variant: 'success' },
	future: { status: 'Künftig', variant: 'info' },
	ended: { status: 'Beendet', variant: 'gray' }
} as const satisfies Record<ContractHistory['status'], { status: string; variant: string }>;
