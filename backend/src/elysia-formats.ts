/**
 * @elysiajs/openapi replaces Elysia's string formats with strict ones when it is imported; the ids of the demo data are
 * no RFC uuids (code review 790a C-1). app.ts imports this before the plugin and puts Elysia's formats back after it.
 */

import { FormatRegistry } from 'elysia/type-system';

const elysiaFormats = new Map(FormatRegistry.Entries());

export const restoreElysiaFormats = () =>
	elysiaFormats.forEach((check, name) => FormatRegistry.Set(name, check));
