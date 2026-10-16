import { describe, expect, it } from 'vitest';
import { overviewDeadlines, overviewTasks, type OverviewInput } from '$lib/overview';

const portfolio = {
	totalBuildings: 1,
	totalApartments: 2,
	occupiedApartments: 1,
	reletApartments: 0,
	vacantApartments: 1,
	reservedApartments: 0,
	occupancyRate: 50
};
const input = (overrides: Partial<OverviewInput> = {}): OverviewInput => ({
	today: '2026-10-10',
	portfolio,
	statementCounts: { draft: 0, sent: 0, paid: 0, overdue: 0 },
	dueStatements: [],
	lettersToSend: 0,
	endingContracts: [],
	noticedContracts: [],
	...overrides
});

describe('Aufgaben der Übersicht', () => {
	// A-4: in der Kündigungszeit einen Nachmieter suchen, ab dem Tag, an dem die Kündigung erfasst ist
	it('nennt für jede Kündigung die Suche nach einem Nachmieter', () => {
		const tasks = overviewTasks(
			input({
				noticedContracts: [
					{
						id: 'c1',
						tenantName: 'Eva Frei',
						apartmentId: 'a1',
						apartmentNumber: '2.01',
						endDate: '2099-03-31'
					}
				]
			})
		);
		expect(tasks).toContainEqual(
			expect.objectContaining({
				id: 'successor-c1',
				title: 'Nachmieter für Wohnung 2.01 suchen',
				text: 'Der Mietvertrag von Eva Frei endet am 31.03.2099. Suchen Sie einen Nachmieter und erfassen Sie seinen Mietvertrag.',
				href: '/contracts/new?apartment=a1'
			})
		);
	});

	it('beginnt ohne Gebäude mit dem ersten Gebäude', () => {
		const [first] = overviewTasks(
			input({
				portfolio: { ...portfolio, totalBuildings: 0, totalApartments: 0, occupiedApartments: 0 }
			})
		);
		expect(first).toMatchObject({ title: 'Erstes Gebäude erfassen', href: '/buildings/new' });
	});

	it('fragt nach den Wohnungen, sobald ein Gebäude da ist', () => {
		const [first] = overviewTasks(
			input({ portfolio: { ...portfolio, totalApartments: 0, occupiedApartments: 0 } })
		);
		expect(first).toMatchObject({ title: 'Wohnungen erfassen', href: '/apartments/new' });
	});

	it('führt danach zum ersten Mietvertrag', () => {
		const [first] = overviewTasks(input({ portfolio: { ...portfolio, occupiedApartments: 0 } }));
		expect(first).toMatchObject({ title: 'Ersten Mietvertrag erfassen', href: '/contracts/new' });
	});

	it('hat nichts zu tun, wenn alles eingerichtet und erledigt ist', () => {
		expect(overviewTasks(input())).toEqual([]);
	});

	it('nennt überfällige Abrechnungen zuerst, dann Briefe und Entwürfe', () => {
		const tasks = overviewTasks(
			input({ statementCounts: { draft: 2, sent: 0, paid: 0, overdue: 1 }, lettersToSend: 3 })
		);
		expect(tasks.map((task) => [task.title, task.href])).toEqual([
			['Überfällige Abrechnungen prüfen', '/statements?status=overdue'],
			['Briefe verschicken', '/documents?status=to_send'],
			['Abrechnungen prüfen und versenden', '/statements?status=draft']
		]);
	});

	it('erinnert an die Abrechnungen einer abgelaufenen Abrechnungsperiode ohne Abrechnung', () => {
		const tasks = overviewTasks(
			input({
				statementCounts: { draft: 1, sent: 0, paid: 0, overdue: 1 },
				missingPeriod: { start: '2025-01-01', end: '2025-12-31', buildings: ['Seeblick'] }
			})
		);
		expect(tasks.map((task) => task.id)).toEqual(['overdue', 'missing-period', 'drafts']);
		// auch eine Rückerstattung kann überfällig sein: dann schuldet der Vermieter, eine Mahnung wäre falsch
		expect(tasks[0].text).toContain(
			'Bei einer Rückerstattung überweisen Sie den Betrag und markieren die Abrechnung danach als bezahlt.'
		);
		expect(tasks[1]).toMatchObject({
			title: 'Nebenkostenabrechnungen erstellen',
			href: '/statements/generate'
		});
		expect(tasks[1].text).toContain('01.01.2025 – 31.12.2025');
		expect(tasks[1].text).toContain('Seeblick');
		// the invoices come first, so the task leads to them as well
		expect(tasks[1].link).toEqual({
			href: '/invoices?year=2025',
			label: 'Rechnungen 2025 ansehen'
		});
	});

	it('führt bei einer Abrechnungsperiode über den Jahreswechsel zu allen Rechnungen', () => {
		const tasks = overviewTasks(
			input({ missingPeriod: { start: '2024-07-01', end: '2025-06-30', buildings: ['Seeblick'] } })
		);
		expect(tasks.find((task) => task.id === 'missing-period')!.link).toEqual({
			href: '/invoices',
			label: 'Rechnungen ansehen'
		});
	});

	it('sagt, wie viele es sind, in der Einzahl und Mehrzahl', () => {
		const [overdue, letters, drafts] = overviewTasks(
			input({ statementCounts: { draft: 1, sent: 0, paid: 0, overdue: 2 }, lettersToSend: 1 })
		);
		expect(overdue.text).toContain('2 Nebenkostenabrechnungen sind');
		expect(letters.text).toContain('1 Brief ist');
		expect(drafts.text).toContain('1 Nebenkostenabrechnung ist');
	});

	// #107: solange die Zahlungsfrist der letzten Mahnung läuft, ist keine Mahnung zu senden
	it('zählt keine Abrechnung, deren nächste Mahnung erst später möglich ist', () => {
		const overdue = (nextReminderFrom: string | null) => ({
			id: 's1',
			tenantName: 'Anna Keller',
			paymentDeadline: '2026-09-30',
			nextReminderFrom
		});
		const titles = (nextReminderFrom: string | null) =>
			overviewTasks(
				input({
					statementCounts: { draft: 0, sent: 0, paid: 0, overdue: 1 },
					dueStatements: [overdue(nextReminderFrom)]
				})
			).map((task) => task.title);

		expect(titles('2026-10-11')).not.toContain('Überfällige Abrechnungen prüfen');
		expect(titles('2026-10-10')).toContain('Überfällige Abrechnungen prüfen');
		expect(titles(null)).toContain('Überfällige Abrechnungen prüfen');
	});

	// a statement still within its Zahlungsfrist is not among the overdue ones it counts
	it('zieht nur überfällige Abrechnungen ab', () => {
		const tasks = overviewTasks(
			input({
				statementCounts: { draft: 0, sent: 1, paid: 0, overdue: 1 },
				dueStatements: [
					{
						id: 's1',
						tenantName: 'Anna Keller',
						paymentDeadline: '2026-09-30',
						nextReminderFrom: null
					},
					{
						id: 's2',
						tenantName: 'Eva Frei',
						paymentDeadline: '2026-10-20',
						nextReminderFrom: '2026-10-25'
					}
				]
			})
		);
		expect(tasks.map((task) => task.title)).toContain('Überfällige Abrechnungen prüfen');
	});
});

describe('Fristen der Übersicht', () => {
	it('nennt Zahlungsfristen und Vertragsenden nach Datum, mit Abstand in Worten', () => {
		const deadlines = overviewDeadlines(
			input({
				dueStatements: [
					{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-10-20' },
					{ id: 's2', tenantName: 'Bruno Meier', paymentDeadline: '2026-10-05' }
				],
				endingContracts: [{ id: 'c1', tenantName: 'Eva Frei', endDate: '2026-10-11' }]
			})
		);
		expect(deadlines.map((d) => [d.kind, d.name, d.when, d.href])).toEqual([
			['Zahlungsfrist', 'Bruno Meier', 'seit 5 Tagen abgelaufen', '/statements/s2'],
			['Vertragsende', 'Eva Frei', 'morgen', '/contracts/c1'],
			['Zahlungsfrist', 'Anna Keller', 'in 10 Tagen', '/statements/s1']
		]);
	});

	// Die Zahlungsfrist beträgt 30 Tage: eine eben versendete Abrechnung steht gleich in den Fristen
	it('lässt ferne Termine weg: Zahlungsfrist nach 30, Vertragsende nach 60 Tagen', () => {
		const deadlines = overviewDeadlines(
			input({
				dueStatements: [
					{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-11-10' },
					{ id: 's2', tenantName: 'Hans Müller', paymentDeadline: '2026-11-09' }
				],
				endingContracts: [
					{ id: 'c1', tenantName: 'Eva Frei', endDate: '2026-12-10' },
					{ id: 'c2', tenantName: 'Ueli Graf', endDate: '2026-12-09' },
					{ id: 'c3', tenantName: 'Lea Roth', endDate: '2026-10-01' }
				]
			})
		);
		expect(deadlines.map((d) => d.name)).toEqual(['Hans Müller', 'Ueli Graf']);
	});

	it('sagt heute und ein Tag in der Einzahl', () => {
		const deadlines = overviewDeadlines(
			input({
				dueStatements: [
					{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-10-10' },
					{ id: 's2', tenantName: 'Bruno Meier', paymentDeadline: '2026-10-09' }
				]
			})
		);
		expect(deadlines.map((d) => d.when)).toEqual(['seit 1 Tag abgelaufen', 'heute']);
	});
});
