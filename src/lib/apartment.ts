import type { ApartmentStatus } from './types';
import { formatDate } from './utils/format';

export const floorLabel = (floor: number) => (floor < 0 ? 'UG' : floor === 0 ? 'EG' : `${floor}. OG`);

export const floorOptions = [-1, 0, 1, 2, 3, 4, 5, 6].map((floor) => ({
	value: String(floor),
	label: floorLabel(floor)
}));

export const roomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5'];

export const statusLabels: Record<ApartmentStatus, string> = {
	occupied: 'Vermietet',
	relet: 'Wiedervermietet',
	vacant: 'Leer',
	reserved: 'Gesperrt'
};

export const statusVariants = {
	occupied: 'success',
	relet: 'info',
	vacant: 'warning',
	reserved: 'danger'
} as const satisfies Record<ApartmentStatus, string>;

/** Status with the day a relet apartment's next tenant moves in */
export const statusText = (a: { status: ApartmentStatus; nextContractStart?: string | null }) =>
	a.status === 'relet' && a.nextContractStart
		? `Vermietet ab ${formatDate(a.nextContractStart)}`
		: statusLabels[a.status];
