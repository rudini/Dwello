import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { writeProject } from './helpers.ts';

/** New modules shaped like the ones agents add to this repo; only the forwarding facade may be flagged. */
const MODULES: Record<string, string> = {
	'src/lib/server/meter.ts': `import { fail, redirect } from '@sveltejs/kit';
const API = \`\${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/meters\`;
export interface Meter { id: string; number: string; unit: string }
export async function fetchMeters(fetch: typeof globalThis.fetch): Promise<Meter[]> {
	const res = await fetch(API);
	if (!res.ok) throw new Error(\`Zähler konnten nicht geladen werden (\${res.status})\`);
	return (await res.json()).data;
}
export async function saveMeter(fetch: typeof globalThis.fetch, request: Request, id?: string) {
	const form = await request.formData();
	const number = String(form.get('number') ?? '').trim();
	if (!number) return fail(400, { error: 'Bitte geben Sie die Zählernummer ein.' });
	const res = await fetch(id ? \`\${API}/\${id}\` : API, { method: id ? 'PUT' : 'POST', body: JSON.stringify({ number }) });
	if (!res.ok) return fail(res.status, { error: 'Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.' });
	redirect(303, '/config/meters');
}
`,
	'src/lib/meter-types.ts': `export type Unit = 'kWh' | 'm3';
export interface Reading { date: string; value: number; unit: Unit }
export interface MeterSummary { total: number; unit: Unit }
export const unitLabel = (unit: Unit) => (unit === 'kWh' ? 'Kilowattstunden' : 'Kubikmeter');
export function summarize(readings: Reading[]): MeterSummary {
	return { total: readings.reduce((sum, r) => sum + r.value, 0), unit: readings[0]?.unit ?? 'kWh' };
}
`,
	'backend/src/services/meter.service.ts': `import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { meters } from '../db/schema';
export const listMeters = () => db.select().from(meters);
export const getMeter = (id: string) => db.select().from(meters).where(eq(meters.id, id));
export const createMeter = (number: string) => db.insert(meters).values({ number }).returning();
export const deleteMeter = (id: string) => db.delete(meters).where(eq(meters.id, id));
`,
	'src/lib/meter-store.ts': `import { writable } from 'svelte/store';
export const selectedMeter = writable<string | null>(null);
export const meterFilter = writable('');
export function resetMeters() {
	selectedMeter.set(null);
	meterFilter.set('');
}
`,
	'src/lib/copy/meter-copy.ts': `type Hint = { title: string; help: string };
export const METER_NUMBER: Hint = { title: 'Zählernummer', help: 'Steht auf dem Zähler.' };
export const METER_READING: Hint = { title: 'Zählerstand', help: 'Ohne Nachkommastellen.' };
export const METER_DATE: Hint = { title: 'Ablesedatum', help: 'Tag der Ablesung.' };
export const METER_UNIT: Hint = { title: 'Einheit', help: 'kWh oder m³.' };
`,
	'src/lib/server/meter-facade.ts': `import { fetchMeters, saveMeter } from './meter';
export function loadMeters(fetch: typeof globalThis.fetch) {
	return fetchMeters(fetch);
}
export function storeMeter(fetch: typeof globalThis.fetch, request: Request, id?: string) {
	return saveMeter(fetch, request, id);
}
`
};

describe('realistic new modules (Phase 4 adversarial check)', () => {
	const report = analyze({ root: writeProject(MODULES), fallow: 'off' });

	it('flags only the forwarding facade', () => {
		expect(report.modules.filter((m) => m.flagged).map((m) => m.path)).toEqual(['src/lib/server/meter-facade.ts']);
	});
});
