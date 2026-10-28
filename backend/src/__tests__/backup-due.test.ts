import { describe, expect, it } from 'bun:test';
import { backupDue } from '../services/backup.service';

// Zurich is UTC+1 in winter: 03:00 Swiss time is 02:00 UTC
describe('Wann eine Sicherung fällig ist', () => {
	it('ist fällig, solange keine gelungen ist', () => {
		expect(backupDue(undefined, new Date('2026-11-10T12:00:00Z'))).toBe(true);
	});

	it('ist um 03:00 Schweizer Zeit fällig, wenn die letzte vom Vortag ist', () => {
		expect(backupDue(new Date('2026-11-09T02:00:30Z'), new Date('2026-11-10T02:00:00Z'))).toBe(
			true
		);
	});

	it('ist vor 03:00 Schweizer Zeit nicht fällig, wenn die letzte keinen Tag alt ist', () => {
		expect(backupDue(new Date('2026-11-09T10:00:00Z'), new Date('2026-11-10T01:30:00Z'))).toBe(
			false
		);
	});

	it('ist nach 03:00 nicht mehr fällig, wenn heute schon eine gelang', () => {
		expect(backupDue(new Date('2026-11-10T02:00:30Z'), new Date('2026-11-10T09:00:00Z'))).toBe(
			false
		);
	});

	it('ist beim Start fällig, wenn die letzte älter als ein Tag ist, auch vor 03:00', () => {
		expect(backupDue(new Date('2026-11-08T23:00:00Z'), new Date('2026-11-10T00:30:00Z'))).toBe(
			true
		);
	});
});
