import type { ApartmentStatus } from './types';

export const floorLabel = (floor: number) => (floor < 0 ? 'UG' : floor === 0 ? 'EG' : `${floor}. OG`);

export const floorOptions = [-1, 0, 1, 2, 3, 4, 5, 6].map((floor) => ({
	value: String(floor),
	label: floorLabel(floor)
}));

export const roomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5'];

export const statusLabels: Record<ApartmentStatus, string> = {
	occupied: 'Vermietet',
	vacant: 'Leer',
	reserved: 'Gesperrt'
};
