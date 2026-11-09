import { toHeatingProfile } from '$lib/server/heating-profile';
import type { PageServerLoad } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/heating-profiles`;

export const load: PageServerLoad = async ({ fetch }) => {
	const { data } = await (await fetch(`${API}?limit=all`)).json(); // all of them (#588)
	return { profiles: data.map(toHeatingProfile) };
};
