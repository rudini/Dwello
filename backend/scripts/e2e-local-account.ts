/**
 * A Konto mit Passwort on an E2E database, made and removed by the axe and language check of «Neuer
 * Wiederherstellungscode» (#718, part 3), which has no API session to make it with: `add <email> <password>`, `remove <email>`
 */

import { onE2eDatabase } from './e2e-client';
import { deleteLocalAccount, setLocalAccount } from '../src/services/local-account.service';

const [action, email, password] = process.argv.slice(2);
await onE2eDatabase(async () => {
	if (action === 'add') await setLocalAccount(email, password);
	else await deleteLocalAccount(email);
});
process.exit(0);
