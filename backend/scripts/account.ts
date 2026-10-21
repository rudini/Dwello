/**
 * Konto mit Passwort (#576): creates the account, or sets a new password and lifts a Sperre; old sessions end.
 * In the container: docker exec -it dwello-backend bun run account [email]
 */

import { MIN_PASSWORD_LENGTH, setLocalAccount } from '../src/services/local-account.service';

const email = (process.argv[2] ?? prompt('E-Mail-Adresse:') ?? '').trim();
if (!email.includes('@')) {
	console.error('Bitte geben Sie eine E-Mail-Adresse an.');
	process.exit(1);
}
const password = prompt(`Neues Passwort (mindestens ${MIN_PASSWORD_LENGTH} Zeichen):`) ?? '';
if (password !== (prompt('Passwort wiederholen:') ?? '')) {
	console.error('Die beiden Passwörter stimmen nicht überein. Nichts wurde geändert.');
	process.exit(1);
}
try {
	await setLocalAccount(email, password);
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
console.log(`Das Konto mit Passwort für ${email} ist gespeichert. Eine Sperre ist aufgehoben, frühere Sitzungen sind beendet.`);
process.exit(0);
