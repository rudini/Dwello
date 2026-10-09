import {
	Building2,
	Check,
	ChevronRight,
	CircleAlert,
	CircleCheck,
	Info,
	TriangleAlert,
	X
} from '@lucide/svelte';

/** The one icon set of Dwello (Lucide); every icon the UI shows is listed here by its role */
export const icons = {
	building: Building2,
	check: Check,
	'chevron-right': ChevronRight,
	error: CircleAlert,
	info: Info,
	success: CircleCheck,
	warning: TriangleAlert,
	close: X
};

export type IconName = keyof typeof icons;
