/**
 * Root Layout Server Load: $lib/server/layout.ts
 */

import { layoutData } from '$lib/server/layout';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = layoutData;
