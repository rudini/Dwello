import type { HeatingProfileRow } from '$lib/server/heating-profile';

/** A backend heating profile as the BFF receives it, with only the fields a test needs */
export const profileRow = (r: object) => r as HeatingProfileRow;
