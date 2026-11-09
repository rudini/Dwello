/**
 * Wiederherstellung (#718): replaces the database in DATABASE_URL and the keys in SECRETS_DIR with a Sicherung, after asking
 * for its Wiederherstellungscode; then applies the migrations the Sicherung does not have yet.
 * bun scripts/restore.ts <file> (on a server: docs/installation.md, «Wiederherstellung»)
 */

import { join } from 'path';
import { restoreBackup } from '../src/services/backup.service';
import { typedConfirmation } from '../src/services/restore-confirmation';

const file = process.argv[2];
if (!file) {
	console.error(
		'Geben Sie die Datei der Sicherung an, z. B. bun scripts/restore.ts /backups/dwello-2026-10-28T02-00-00Z.backup'
	);
	process.exit(1);
}
// without the keys the restored data's encrypted settings stay unreadable: refuse before anything is replaced (PR #940)
if (!process.env.SECRETS_DIR) {
	console.error('SECRETS_DIR fehlt: Geben Sie den Ordner der Schlüssel an (im Container /run/dwello, docs/installation.md).');
	process.exit(1);
}
const code = prompt('Wiederherstellungscode (vom Notfallblatt):') ?? '';
const url = process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello';
console.log('Dwello stellt die Sicherung wieder her. Die Daten der Installation werden ersetzt.');
await restoreBackup(
	file,
	code,
	url,
	process.env.SECRETS_DIR,
	join(import.meta.dir, '..', 'migrations'),
	// a Sicherung of a code confirmed before #1373 carries no signature (Decided (product owner) #1373)
	typedConfirmation()
);
console.log('Die Sicherung ist wiederhergestellt. Starten Sie Dwello neu.');
