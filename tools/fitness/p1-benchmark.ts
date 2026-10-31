// P1 (docs/architecture/utility-tree.md): the Abrechnungslauf of one building with 50 apartments, through the BFF.
// bun run fitness:p1 fills a database dwello_bench through the backend's services (as p2-benchmark.ts), starts the real
// backend and the production build of the frontend, posts the wizard's form action «generate» with a session as
// tests/e2e/fixtures/session.ts signs it, then downloads the run's PDFs as the wizard's ZIP. It prints both times
// (#934: measured by hand, no CI gate while A4 is open). PostgreSQL on localhost:5432, user and password dwello.
import { execFileSync, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout } from 'node:timers/promises';
import { unzipSync } from 'fflate';
import { E2E_JWT_SECRET, sessionToken } from '../../tests/e2e/fixtures/session';

const APARTMENTS = 50;
const [FRONTEND_PORT, BACKEND_PORT] = [3300, 3301];
const frontend = `http://localhost:${FRONTEND_PORT}`;

const server = 'postgresql://dwello:dwello@localhost:5432';
const DATABASE_URL = `${server}/dwello_bench`;
process.env.DATABASE_URL = DATABASE_URL;

const root = fileURLToPath(new URL('../..', import.meta.url));
const backend = join(root, 'backend');
execFileSync('psql', [`${server}/postgres`, '-qc', 'DROP DATABASE IF EXISTS dwello_bench WITH (FORCE)', '-c', 'CREATE DATABASE dwello_bench']);

const { migrate } = await import(join(backend, 'src/db/migrate.ts'));
await migrate(DATABASE_URL, join(backend, 'migrations'));

const { db, pool } = await import(join(backend, 'src/db/connection.ts'));
const { categories, distributionKeys, heatingProfiles, invoices } = await import(join(backend, 'src/db/schema.ts'));
const { createBuilding } = await import(join(backend, 'src/services/building.service.ts'));
const { createApartment } = await import(join(backend, 'src/services/apartment.service.ts'));
const { createTenant } = await import(join(backend, 'src/services/tenant.service.ts'));
const { createContract } = await import(join(backend, 'src/services/contract.service.ts'));
const { setMultipleConfig } = await import(join(backend, 'src/services/config.service.ts'));

// The QR-bill needs the landlord's IBAN, otherwise no PDF
await setMultipleConfig({ company_name: 'Benchmark Verwaltung', company_address: 'Testweg 1', company_postal_code: '8400', company_city: 'Winterthur', iban: 'CH9300762011623852957' });
const allocable = ['Cold Water', 'Wastewater', 'Electricity Common Areas', 'Elevator', 'Caretaker', 'Garden Maintenance'];
const [perArea] = await db.select().from(distributionKeys);
const [profile] = await db.select().from(heatingProfiles);
const kinds = (await db.select().from(categories)).filter((c: { name: string }) => allocable.includes(c.name));

const building = await createBuilding({ name: 'Benchmark', address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
for (let a = 0; a < APARTMENTS; a++) {
	const apartment = await createApartment({ buildingId: building.id, number: `${a + 1}`, floor: a % 6, area: String(60 + (a % 5) * 10), rooms: '3.5' });
	const tenant = await createTenant({ firstName: 'Mieter', lastName: `${a + 1}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur' });
	await createContract({ apartmentId: apartment.id, tenantId: tenant.id, baseRent: '1500', monthlyAdvancePayment: '200', startDate: '2024-01-01' });
}
await db.insert(invoices).values(
	kinds.flatMap((kind: { id: string; name: string }, k: number) =>
		[3, 9].map((month) => ({
			buildingId: building.id,
			categoryId: kind.id,
			distributionKeyId: perArea.id,
			billingEntityName: 'Benchmark AG',
			description: `${kind.name} 2025`,
			amount: String(3000 + k * 500),
			invoiceDate: `2025-0${month}-15`,
			isValidUtilityCost: true
		}))
	)
);
await pool.end();

// Stop the servers by their port; fuser exits 1 when nothing listens there
const free = () =>
	[FRONTEND_PORT, BACKEND_PORT].forEach((port) => {
		try {
			execFileSync('fuser', ['-k', '-s', `${port}/tcp`]);
		} catch {
			// nothing to stop
		}
	});
free();

execFileSync('node', ['tools/e2e/build-if-changed.mjs', 'bun', 'run', 'build'], { cwd: root, stdio: 'inherit' });
const env = { ...process.env, JWT_SECRET: E2E_JWT_SECRET };
spawn('bun', ['src/index.ts'], { cwd: backend, env: { ...env, PORT: String(BACKEND_PORT), DATABASE_URL }, stdio: 'ignore', detached: true }).unref();
spawn('node', ['build'], {
	cwd: root,
	env: { ...env, PORT: String(FRONTEND_PORT), ORIGIN: frontend, BACKEND_URL: `http://localhost:${BACKEND_PORT}`, ALLOWED_EMAILS: 'verwalter@example.com' },
	stdio: 'ignore',
	detached: true
}).unref();

async function up(url: string) {
	for (let i = 0; i < 300; i++) {
		if (await fetch(url).then((r) => r.ok, () => false)) return;
		await setTimeout(100);
	}
	throw new Error(`${url} does not answer`);
}

try {
	await up(`http://localhost:${BACKEND_PORT}/health`);
	await up(`${frontend}/health`);
	const xsrf = randomUUID();
	const headers = { cookie: `dwello_session=${await sessionToken()}; dwello_xsrf=${xsrf}`, 'x-xsrf-token': xsrf, origin: frontend };
	// The wizard's page first, as the landlord opens it: the servers are warm when the run starts
	if (!(await fetch(`${frontend}/statements/generate`, { headers })).ok) throw new Error('/statements/generate does not load');

	const run = { buildingIds: building.id, periodStart: '2025-01-01', periodEnd: '2025-12-31', heatingProfileId: profile.id, managementFeePercent: '3' };
	const started = performance.now();
	const response = await fetch(`${frontend}/statements/generate?/generate`, {
		method: 'POST',
		headers: { ...headers, accept: 'application/json', 'x-sveltekit-action': 'true' },
		body: new URLSearchParams(run)
	});
	const answer = await response.json();
	const runTime = performance.now() - started;
	if (answer.type !== 'success') throw new Error(`generate: ${JSON.stringify(answer)}`);
	// devalue's form of { created: [ids] }: [{ created: 1 }, [2, 3, …], id, id, …], the only strings are the ids
	const created = (JSON.parse(answer.data) as unknown[]).filter((value) => typeof value === 'string');

	const pdfStarted = performance.now();
	const zip = await fetch(`${frontend}/statements/zip?${new URLSearchParams({ ids: created.join(','), periodStart: run.periodStart, periodEnd: run.periodEnd })}`, { headers });
	const files = Object.keys(unzipSync(new Uint8Array(await zip.arrayBuffer())));
	const pdfTime = performance.now() - pdfStarted;
	if (!zip.ok || files.length !== created.length) throw new Error(`ZIP: ${zip.status}, ${files.length} of ${created.length} PDFs`);

	const s = (ms: number) => `${(ms / 1000).toFixed(1)} s`;
	console.log(`| Step | Statements | Time |\n|---|---|---|`);
	console.log(`| Run (form action «generate») | ${created.length} | ${s(runTime)} |`);
	console.log(`| PDFs (ZIP of the run) | ${files.length} | ${s(pdfTime)} |`);
	console.log(`| Together | | ${s(runTime + pdfTime)} (target P1: ≤ 30 s) |`);
} finally {
	free();
}
