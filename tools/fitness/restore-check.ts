/**
 * R1 fitness function (docs/architecture/fitness-functions.md, #718): a Sicherung of the previous release's data is unreadable
 * without its Wiederherstellungscode and restores with this checkout into an empty database: same rows per table, same
 * statement amounts, the keys back, within 5 minutes. Run by tools/fitness/upgrade-check.sh on its database:
 *   bun tools/fitness/restore-check.ts backup <backend dir>   before the migration, with that backend's Sicherung
 *   bun tools/fitness/restore-check.ts restore                after it, with this checkout's Wiederherstellung
 * RESTORE_CHECK_DIR holds the Sicherung and the code between both; DATABASE_URL is the database of the upgrade check.
 */

import { mkdtemp, readdir, readFile, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { createRequire } from 'module';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { fileContains } from './file-contains';

const repo = fileURLToPath(new URL('../..', import.meta.url));

// pg is a dependency of the backend only
type Client = {
	connect(): Promise<void>;
	query(sql: string, values?: unknown[]): Promise<{ rows: Record<string, string>[] }>;
	end(): Promise<void>;
};
const pg = createRequire(join(repo, 'backend/package.json'))('pg') as {
	Client: new (options: { connectionString: string }) => Client;
};

const [phase, backend] = process.argv.slice(2);
const url = process.env.DATABASE_URL!;
const dir = process.env.RESTORE_CHECK_DIR!;
const secrets = { encryption_key: 'restore-check-key', jwt_secret: 'restore-check-jwt' };

async function query(connection: string, sql: string, values: unknown[] = []) {
	const client = new pg.Client({ connectionString: connection });
	await client.connect();
	try {
		return (await client.query(sql, values)).rows;
	} finally {
		await client.end();
	}
}

// rows per table and sum per amount column of the statement tables, as in upgrade-check.sh
async function snapshot(connection: string) {
	const tables = await query(
		connection,
		`SELECT table_name AS t FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY 1`
	);
	const columns = await query(
		connection,
		`SELECT table_name AS t, column_name AS c FROM information_schema.columns WHERE table_schema = 'public' AND data_type = 'numeric' AND table_name LIKE 'utility_statement%' ORDER BY 1, 2`
	);
	const lines: string[] = [];
	for (const { t } of tables)
		lines.push(`${t} ${(await query(connection, `SELECT count(*) AS n FROM public."${t}"`))[0].n}`);
	for (const { t, c } of columns)
		lines.push(
			`${t}.${c} ${Number((await query(connection, `SELECT coalesce(sum("${c}"), 0) AS s FROM public."${t}"`))[0].s)}`
		);
	return lines;
}

const fail = (message: string) => {
	console.log(`::error title=Fitness restore::R1/AP3 «Kein Update ohne Rückweg»: ${message}`);
	process.exit(1);
};

if (phase === 'backup') {
	const { generateCode, recipientOf } = await import(
		resolve(backend, 'src/services/backup-crypto.ts')
	);
	const { createBackup } = await import(
		resolve(backend, 'src/services/backup.service.ts')
	);
	const code = generateCode();
	const { publicKey, salt } = await recipientOf(code);
	await query(
		url,
		'INSERT INTO backup_codes (public_key, salt, confirmed_at) VALUES ($1, $2, now())',
		[publicKey.toString('base64'), salt.toString('base64')]
	);
	await writeFile(join(dir, 'code'), code);
	await createBackup(url, dir, secrets);
	const tenant = (await query(url, 'SELECT last_name FROM tenants ORDER BY last_name LIMIT 1'))[0]
		?.last_name;
	const file = (await readdir(dir)).find((name) => name.endsWith('.backup'))!;
	if (await fileContains(join(dir, file), ['CREATE TABLE', ...(tenant ? [tenant] : [])]))
		fail(
			`the Sicherung ${file} is readable without the Wiederherstellungscode (it contains CREATE TABLE or the tenant ${tenant}). Fix: encrypt the whole file.`
		);
} else if (phase === 'restore') {
	const { restoreBackup } = await import('../../backend/src/services/backup.service');
	const file = join(
		dir,
		(await readdir(dir)).find((name) => name.endsWith('.backup'))!
	);
	const empty = 'dwello_restore';
	const server = new URL(url);
	server.pathname = '/postgres';
	await query(server.href, `DROP DATABASE IF EXISTS ${empty} WITH (FORCE)`);
	await query(server.href, `CREATE DATABASE ${empty}`);
	server.pathname = `/${empty}`;
	const keys = await mkdtemp(join(tmpdir(), 'restore-check-keys-'));
	const start = Date.now();
	await restoreBackup(
		file,
		await readFile(join(dir, 'code'), 'utf8'),
		server.href,
		keys,
		join(repo, 'backend/migrations')
	);
	const seconds = Math.round((Date.now() - start) / 1000);
	const [before, after] = [await snapshot(url), await snapshot(server.href)];
	const differs = before.filter((line, i) => after[i] !== line);
	if (differs.length || before.length !== after.length)
		fail(
			`the restored database differs from the backed-up one (source line, restored line): ${differs.map((line) => `${line} -> ${after[before.indexOf(line)] ?? 'missing'}`).join('; ')}. Fix: back up and restore every table.`
		);
	if ((await readFile(join(keys, 'encryption_key'), 'utf8')) !== secrets.encryption_key)
		fail('the restore did not bring back the key of the installation (encryption_key).');
	if (seconds > 300) fail(`the restore took ${seconds} s, more than 5 minutes.`);
	console.log(
		`Fitness: Sicherung unreadable without the code, restored with HEAD: ${before.length} tables and sums equal, keys back, ${seconds} s`
	);
} else {
	console.error('Usage: bun tools/fitness/restore-check.ts backup <backend dir> | restore');
	process.exit(1);
}
