import { loadOperator } from '$lib/server/operator';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ operator: loadOperator() });
