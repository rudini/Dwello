/**
 * Root Layout Server Load
 * The signed-in user, verified from the session cookie in hooks.server.ts
 */

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => ({ user: locals.user ?? null });
