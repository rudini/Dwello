import { loadOperator } from '$lib/server/operator';
import type { PageServerLoad } from './$types';

// the contact for one's own installation in the section of the public demo (#675 F3)
export const load: PageServerLoad = () => ({ contact: loadOperator()?.contact || null });
