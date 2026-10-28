// P2 (docs/architecture/utility-tree.md, #781): API response time of the list and overview routes with the data of
// 50 apartments over five years, measured once (product owner, 28.10.2026: no CI gate while A4 is open).
// Recreates the database dwello_bench, fills it through the backend's services and calls each route 100 times
// in-process (app.handle, with a session as the BFF sends it): the time includes the database, not the network.
// Usage: bun run fitness:p2   (PostgreSQL on localhost:5432, user and password dwello)
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const server = 'postgresql://dwello:dwello@localhost:5432';
process.env.DATABASE_URL = `${server}/dwello_bench`;

const backend = fileURLToPath(new URL('../../backend', import.meta.url));
execFileSync('psql', [`${server}/postgres`, '-qc', 'DROP DATABASE IF EXISTS dwello_bench WITH (FORCE)', '-c', 'CREATE DATABASE dwello_bench']);

const { migrate } = await import(join(backend, 'src/db/migrate.ts'));
await migrate(process.env.DATABASE_URL, join(backend, 'migrations'));

const { db, pool } = await import(join(backend, 'src/db/connection.ts'));
const { categories, distributionKeys, invoices } = await import(join(backend, 'src/db/schema.ts'));
const { createBuilding } = await import(join(backend, 'src/services/building.service.ts'));
const { createApartment } = await import(join(backend, 'src/services/apartment.service.ts'));
const { createTenant } = await import(join(backend, 'src/services/tenant.service.ts'));
const { createContract } = await import(join(backend, 'src/services/contract.service.ts'));
const { generateStatement, updateStatementStatus } = await import(join(backend, 'src/services/statement.service.ts'));
const { callApi } = await import(join(backend, 'src/__tests__/helpers/auth.ts'));

const YEARS = [2021, 2022, 2023, 2024, 2025];
const allocable = ['Cold Water', 'Wastewater', 'Electricity Common Areas', 'Elevator', 'Caretaker', 'Garden Maintenance'];

const [perArea] = await db.select().from(distributionKeys);
const kinds = (await db.select().from(categories)).filter((c: { name: string }) => allocable.includes(c.name));

/** One apartment: a tenant from 2021, half of them replaced by a new tenant in July 2023 */
async function rentOut(buildingId: string, b: number, a: number) {
	const apartment = await createApartment({ buildingId, number: `${a + 1}.01`, floor: a, area: String(60 + a * 5), rooms: '3.5' });
	const terms = { apartmentId: apartment.id, baseRent: '1500', monthlyAdvancePayment: '200' };
	const first = await createTenant({ firstName: 'Mieter', lastName: `${b}-${a}` });
	const moves = a % 2 === 0;
	const contracts = [await createContract({ ...terms, tenantId: first.id, startDate: '2021-01-01', ...(moves && { endDate: '2023-06-30' }) })];
	if (moves) {
		const next = await createTenant({ firstName: 'Nachmieter', lastName: `${b}-${a}` });
		contracts.push(await createContract({ ...terms, tenantId: next.id, startDate: '2023-07-01' }));
	}
	return contracts;
}

/** A building with ten apartments, its invoices of five years and the statements of 2021 to 2024, sent and paid */
async function building(b: number) {
	const { id } = await createBuilding({ name: `Benchmark ${b + 1}`, address: `Testweg ${b + 1}`, postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
	const contracts = (await Promise.all(Array.from({ length: 10 }, (_, a) => rentOut(id, b, a)))).flat();
	await db.insert(invoices).values(
		YEARS.flatMap((year) =>
			kinds.flatMap((kind: { id: string; name: string }, k: number) =>
				[3, 9].map((month) => ({
					buildingId: id,
					categoryId: kind.id,
					distributionKeyId: perArea.id,
					billingEntityName: 'Benchmark AG',
					description: `${kind.name} ${year}`,
					amount: String(300 + k * 50),
					invoiceDate: `${year}-${String(month).padStart(2, '0')}-15`,
					isValidUtilityCost: true
				}))
			)
		)
	);
	for (const year of YEARS.slice(0, -1)) for (const contract of contracts) await settle(contract, id, year);
}

/** The statement of a year the contract runs in, sent and paid */
async function settle(contract: { id: string; startDate: string; endDate: string | null }, buildingId: string, year: number) {
	if (contract.startDate > `${year}-12-31` || (contract.endDate ?? '9999-12-31') < `${year}-01-01`) return;
	const statement = await generateStatement({ contractId: contract.id, buildingId, periodStart: `${year}-01-01`, periodEnd: `${year}-12-31` });
	await updateStatementStatus(statement.id, 'sent');
	await updateStatementStatus(statement.id, 'paid', { paidDate: `${year + 1}-05-31` });
}

const filled = Date.now();
for (let b = 0; b < 5; b++) await building(b);
const count = async (table: string) => (await pool.query(`SELECT count(*) FROM ${table}`)).rows[0].count;
console.log(
	`Data: ${await count('apartments')} apartments, ${await count('rental_contracts')} contracts, ${await count('invoices')} invoices, ${await count('utility_statements')} statements (${Math.round((Date.now() - filled) / 1000)} s)`
);

const routes = [
	'/api/v1/dashboard',
	'/api/v1/buildings',
	'/api/v1/apartments',
	'/api/v1/tenants',
	'/api/v1/contracts',
	'/api/v1/contracts/missing-statements',
	'/api/v1/invoices',
	'/api/v1/statements',
	'/api/v1/statements/outdated',
	'/api/v1/documents',
	'/api/v1/categories',
	'/api/v1/distribution-keys',
	'/api/v1/heating-profiles',
	'/api/v1/audit-log'
];

const p95 = (times: number[]) => [...times].sort((x, y) => x - y)[Math.ceil(times.length * 0.95) - 1];
console.log('| Route | p95 (ms) | Median (ms) |\n|---|---|---|');
for (const route of routes) {
	const times: number[] = [];
	for (let i = 0; i < 100; i++) {
		const start = performance.now();
		const response = await callApi(route);
		await response.arrayBuffer();
		if (!response.ok) throw new Error(`${route}: ${response.status}`);
		times.push(performance.now() - start);
	}
	const median = [...times].sort((x, y) => x - y)[49];
	console.log(`| \`${route}\` | ${p95(times).toFixed(0)} | ${median.toFixed(0)} |`);
}
await pool.end();
