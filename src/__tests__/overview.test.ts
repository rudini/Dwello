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
type Counts = OverviewInput['statementCounts'];
const input = (
	overrides: Partial<Omit<OverviewInput, 'statementCounts'>> & {
		statementCounts?: Omit<Counts, 'toSend'> & Partial<Counts>;
	} = {}
): OverviewInput => ({
	today: '2026-10-10',
	portfolio,
	dueStatements: [],
	lettersToSend: 0,
	endingContracts: [],
	noticedContracts: [],
	oldAddresses: [],
	paymentDeadlineDays: 30,
	reminderAfterDays: 14,
	expiredContracts: [],
	...overrides,
	// as the backend counts them (H-28, #717): without outdated drafts every draft is to send, unless a test says
	statementCounts: {
		draft: 0,
		sent: 0,
		paid: 0,
		overdue: 0,
		toSend: overrides.statementCounts?.draft ?? 0,
		...overrides.statementCounts
	}
});

describe('Aufgaben der Übersicht', () => {
	// #178: a former tenant's uploads from before the last Vertragsende, to look at and delete; the end-day
	// sentence (#459, Fachreview V-1)
	it('nennt für jeden ehemaligen Mieter die Dokumente von vor dem Vertragsende', () => {
		const tasks = overviewTasks(
			input({
				formerTenants: [
					{ tenantId: 't1', tenantName: 'Ida Alt', endDate: '2026-03-31', count: 1 },
					{ tenantId: 't2', tenantName: 'Ugo Vecchio', endDate: '2026-05-31', count: 2 }
				]
			})
		);
		expect(tasks).toContainEqual(
			expect.objectContaining({
				id: 'former-documents-t1',
				title: 'Dokumente von Ida Alt prüfen',
				text: 'Der letzte Mietvertrag endete am 31.03.2026. 1 hochgeladenes Dokument stammt aus der Zeit davor. Löschen Sie, was Sie nicht mehr brauchen; behalten Sie Übergabeprotokolle, bis das Mietzinsdepot freigegeben ist. Dokumente, die Sie am Tag des Vertragsendes oder danach hochgeladen haben, etwa das Übergabeprotokoll vom Auszug, nennt Dwello hier nicht.',
				href: '/tenants/t1',
				action: 'Dokumente ansehen'
			})
		);
		expect(tasks).toContainEqual(
			expect.objectContaining({ id: 'former-documents-t2', text: expect.stringContaining('2 hochgeladene Dokumente stammen') })
		);
	});

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

	// A-5 (#114): solange ein Entwurf an die verlassene Wohnung ginge
	it('nennt die neue Adresse eines ausgezogenen Mieters, dessen Adresse noch die der Wohnung ist', () => {
		const tasks = overviewTasks(input({ oldAddresses: [{ tenantId: 't1', tenantName: 'Eva Frei' }] }));

		expect(tasks).toContainEqual(
			expect.objectContaining({
				id: 'old-address-t1',
				title: 'Neue Adresse eintragen',
				text: 'Eva Frei ist ausgezogen. Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.',
				href: '/tenants/t1/edit'
			})
		);
	});

	// A-6 (#115): ein abgelaufener befristeter Mietvertrag läuft unbefristet weiter, wenn der Mieter geblieben ist
	it('fragt nach jedem abgelaufenen befristeten Mietvertrag, ob der Mieter noch in der Wohnung wohnt', () => {
		const tasks = overviewTasks(
			input({
				expiredContracts: [
					{ id: 'c2', tenantName: 'Bruno Meier', endDate: '2025-12-31' },
					{ id: 'c1', tenantName: 'Eva Frei', endDate: '2024-03-31' }
				]
			})
		);
		expect(tasks).toEqual([
			expect.objectContaining({
				id: 'fixed-term-c1',
				title: 'Befristeten Mietvertrag prüfen',
				text: 'Der befristete Mietvertrag von Eva Frei ist am 31.03.2024 abgelaufen. Wohnt Eva Frei noch in der Wohnung und sind Sie damit einverstanden, zum Beispiel weil Sie den Mietzins weiter annehmen? Dann läuft der Mietvertrag unbefristet weiter.',
				href: '/contracts/c1',
				action: 'Mietvertrag öffnen'
			}),
			expect.objectContaining({ id: 'fixed-term-c2' })
		]);
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
				missingStatements: [
					{ building: 'Seeblick', buildingId: 'b1', periods: [{ start: '2025-01-01', end: '2025-12-31' }] }
				]
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
		expect(tasks[1].text).toContain('Noch nicht abgerechnet: Seeblick (2025).');
		// the invoices come first, so the task leads to them as well
		// #454: the invoices a statement of the period takes
		expect(tasks[1].link).toEqual({
			href: '/invoices?building=b1&periodStart=2025-01-01&periodEnd=2025-12-31',
			label: 'Rechnungen 2025 ansehen'
		});
	});

	// #211: every ended period since the Vertragsbeginn, by building; only the days without a statement (#199)
	it('nennt jedes Gebäude mit seinen Perioden ohne Abrechnung', () => {
		const tasks = overviewTasks(
			input({
				missingStatements: [
					{
						building: 'Ahornhof',
						buildingId: 'b2',
						periods: [
							{ start: '2025-01-01', end: '2025-12-31' },
							{ start: '2024-07-01', end: '2024-12-31' }
						]
					},
					{ building: 'Seeblick', buildingId: 'b1', periods: [{ start: '2023-01-01', end: '2023-12-31' }] }
				]
			})
		);
		const task = tasks.find((one) => one.id === 'missing-period')!;
		expect(task.text).toContain(
			'Noch nicht abgerechnet: Ahornhof (2025, 01.07.2024 – 31.12.2024), Seeblick (2023).'
		);
		// the invoices of the newest period come first, of its building (Fachreview 454-1 V-10), named when the text
		// names several (Fachreview 454-2 V-22)
		expect(task.link).toEqual({
			href: '/invoices?building=b2&periodStart=2025-01-01&periodEnd=2025-12-31',
			label: 'Rechnungen von Ahornhof für 2025 ansehen'
		});
	});

	it('erinnert nicht, wenn jeder Mietvertrag abgerechnet ist', () => {
		const tasks = overviewTasks(input({ missingStatements: [] }));
		expect(tasks.map((task) => task.id)).not.toContain('missing-period');
	});

	// #454 (#408 point 1): also across the turn of the year, by the period's days
	it('führt bei einer Abrechnungsperiode über den Jahreswechsel zu ihren Rechnungen', () => {
		const tasks = overviewTasks(
			input({
				missingStatements: [
					{ building: 'Seeblick', buildingId: 'b1', periods: [{ start: '2024-07-01', end: '2025-06-30' }] }
				]
			})
		);
		expect(tasks.find((task) => task.id === 'missing-period')!.link).toEqual({
			href: '/invoices?building=b1&periodStart=2024-07-01&periodEnd=2025-06-30',
			label: 'Rechnungen für 01.07.2024 – 30.06.2025 ansehen'
		});
	});

	// #454 (#408 point 7, #386): drafts that miss what changed since are no drafts to send
	describe('Abrechnungen, die nicht aktuell sind', () => {
		// what changed since: the count of invoices, and whether the Tankbestand did (#307)
		const outdated = (
			id: string,
			status: string,
			buildingId: string,
			building: string,
			start: string,
			end: string,
			changed = { invoices: 1, fuelStock: false }
		) => ({
			id,
			statementNumber: `NK-${id}`,
			tenantName: `Mieter ${id}`,
			status,
			buildingId,
			building,
			periodStart: start,
			periodEnd: end,
			...changed
		});
		const outdatedStatements = [
			outdated('s1', 'draft', 'b1', 'Seeblick', '2025-01-01', '2025-12-31'),
			outdated('s2', 'draft', 'b1', 'Seeblick', '2025-01-01', '2025-12-31'),
			outdated('s3', 'draft', 'b2', 'Ahornhof', '2024-07-01', '2025-06-30'),
			outdated('s4', 'sent', 'b1', 'Seeblick', '2024-01-01', '2024-12-31')
		];

		it('nennt die nicht aktuellen Entwürfe vor den Entwürfen, mit einem Weg je Gebäude und Periode', () => {
			const tasks = overviewTasks(
				input({ statementCounts: { draft: 4, sent: 1, paid: 0, overdue: 0 }, outdatedStatements })
			);
			const task = tasks.find((one) => one.id === 'outdated-drafts')!;
			expect(task.title).toBe('3 Entwürfe sind nicht aktuell');
			expect(task.text).toBe(
				'Seit dem Erstellen wurden Rechnungen ihrer Abrechnungsperiode erfasst, geändert oder gelöscht, oder der Tankbestand wurde geändert. Berechnen Sie diese Entwürfe neu, bevor Sie sie zustellen.'
			);
			expect(task.links).toEqual([
				{
					href: '/statements?building=b1&periodStart=2025-01-01&periodEnd=2025-12-31&status=draft',
					label: 'Seeblick, 2025'
				},
				{
					href: '/statements?building=b2&periodStart=2024-07-01&periodEnd=2025-06-30&status=draft',
					label: 'Ahornhof, 01.07.2024 – 30.06.2025'
				}
			]);
			const ids = tasks.map((one) => one.id);
			expect(ids.indexOf('outdated-drafts')).toBeLessThan(ids.indexOf('drafts'));
		});

		it('zählt bei den Entwürfen zum Zustellen nur die aktuellen', () => {
			const tasks = overviewTasks(
				input({
					statementCounts: { draft: 4, toSend: 1, sent: 1, paid: 0, overdue: 0 },
					outdatedStatements
				})
			);
			expect(tasks.find((one) => one.id === 'drafts')!.text).toContain('1 Nebenkostenabrechnung ist');
		});

		// H-28 (#717): the backend counts the current drafts in one place (#602 had two reads to reconcile)
		it('nimmt die Zahl der zu versendenden Entwürfe vom Backend', () => {
			const tasks = overviewTasks(
				input({
					statementCounts: { draft: 4, toSend: 2, sent: 1, paid: 0, overdue: 0 },
					outdatedStatements
				})
			);
			expect(tasks.find((one) => one.id === 'drafts')!.text).toContain('2 Nebenkostenabrechnungen sind');
		});

		it('nennt keine Entwürfe zum Zustellen, wenn keiner aktuell ist', () => {
			const tasks = overviewTasks(
				input({
					statementCounts: { draft: 3, toSend: 0, sent: 1, paid: 0, overdue: 0 },
					outdatedStatements
				})
			);
			expect(tasks.map((one) => one.id)).not.toContain('drafts');
		});

		it('nennt einen einzelnen nicht aktuellen Entwurf in der Einzahl', () => {
			const tasks = overviewTasks(
				input({
					statementCounts: { draft: 1, sent: 0, paid: 0, overdue: 0 },
					outdatedStatements: outdatedStatements.slice(0, 1)
				})
			);
			expect(tasks.find((one) => one.id === 'outdated-drafts')!.title).toBe('1 Entwurf ist nicht aktuell');
		});

		it('nennt eine versendete Abrechnung mit demselben Hinweis als «Abrechnung berichtigen»', () => {
			const tasks = overviewTasks(
				input({ statementCounts: { draft: 3, sent: 1, paid: 0, overdue: 0 }, outdatedStatements })
			);
			const task = tasks.find((one) => one.id === 'correct-s4')!;
			expect(task).toMatchObject({ title: 'Abrechnung berichtigen', href: '/statements/s4' });
			// PO 2026-10-20 (Fachreview 454-1 E-4)
			expect(task.text).toBe(
				'Seit dem Erstellen der Abrechnung NK-s4 von Mieter s4 wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht. Berichtigen Sie die Abrechnung mit «Abrechnung berichtigen». Die berichtigte Abrechnung rechnet an, was schon bezahlt ist.'
			);
		});

		const correctText = (changed: { invoices: number; fuelStock: boolean }, end = '2024-12-31') =>
			overviewTasks(
				input({
					statementCounts: { draft: 0, sent: 1, paid: 0, overdue: 0 },
					outdatedStatements: [outdated('s5', 'paid', 'b1', 'Seeblick', `${end.slice(0, 4)}-01-01`, end, changed)]
				})
			).find((one) => one.id === 'correct-s5')!.text;

		it('nennt einen geänderten Tankbestand', () => {
			expect(correctText({ invoices: 0, fuelStock: true })).toContain(
				'von Mieter s5 wurde der Tankbestand der Abrechnungsperiode geändert. Berichtigen Sie'
			);
		});

		// Fachreview 454-1 V-8
		it('nennt Rechnungen und Tankbestand in einem Satz', () => {
			expect(correctText({ invoices: 2, fuelStock: true })).toContain(
				'von Mieter s5 wurden 2 Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht, und der Tankbestand wurde geändert. Berichtigen Sie'
			);
		});

		// PO 2026-10-20 (Fachreview 454-1 E-5): also after five years, with the sentence on the Verjährung
		it('weist bei einer Abrechnungsperiode, die vor mehr als fünf Jahren endete, auf die Verjährung hin', () => {
			const old = 'Diese Abrechnungsperiode endete vor mehr als fünf Jahren. Lassen Sie sich beraten, ob die Forderung verjährt ist.';
			expect(correctText({ invoices: 1, fuelStock: false }, '2021-10-09')).toMatch(new RegExp(`${old}$`));
			expect(correctText({ invoices: 1, fuelStock: false }, '2021-10-10')).not.toContain(old);
		});

		// Fachreview 454-2 V-27: five calendar years back from the Swiss day, the 29th of February to the 28th
		it('rechnet die fünf Jahre nach dem Kalender', () => {
			const text = (end: string) =>
				overviewTasks({
					...input({
						statementCounts: { draft: 0, sent: 1, paid: 0, overdue: 0 },
						outdatedStatements: [outdated('s6', 'sent', 'b1', 'Seeblick', '2022-03-01', end)]
					}),
					today: '2028-02-29'
				}).find((one) => one.id === 'correct-s6')!.text;
			expect(text('2023-02-27')).toContain('vor mehr als fünf Jahren');
			expect(text('2023-02-28')).not.toContain('vor mehr als fünf Jahren');
		});

		// Fachreview 454-2 V-23: also an erledigte Abrechnung (#448) is corrected
		it('nennt auch eine erledigte Abrechnung als «Abrechnung berichtigen»', () => {
			const tasks = overviewTasks(
				input({ outdatedStatements: [outdated('s8', 'settled', 'b1', 'Seeblick', '2024-01-01', '2024-12-31')] })
			);
			expect(tasks.find((one) => one.id === 'correct-s8')!.title).toBe('Abrechnung berichtigen');
		});

		// Fachreview 454-1 V-12: a Mahnung of a statement that needs correcting comes after the correction
		it('nennt das Berichtigen vor den überfälligen Abrechnungen', () => {
			const ids = overviewTasks(
				input({ statementCounts: { draft: 3, sent: 1, paid: 0, overdue: 1 }, outdatedStatements })
			).map((one) => one.id);
			expect(ids).toContain('correct-s4');
			expect(ids.indexOf('correct-s4')).toBeLessThan(ids.indexOf('overdue'));
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
			paymentDeadline: '2026-09-20',
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

	// #449 (Fachreview V-1): die vorige Mahnung liegt noch «Zu versenden»; die nächste Mahnstufe ist dann nicht möglich,
	// auch wenn die Zahlungsfrist dieser Mahnung abgelaufen ist
	it('zählt keine Abrechnung, deren letzte Mahnung noch zu versenden ist', () => {
		const titles = (reminderToSend: boolean) =>
			overviewTasks(
				input({
					statementCounts: { draft: 0, sent: 0, paid: 0, overdue: 1 },
					dueStatements: [
						{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-09-20', nextReminderFrom: '2026-10-01', reminderToSend }
					]
				})
			).map((task) => task.title);

		expect(titles(true)).not.toContain('Überfällige Abrechnungen prüfen');
		expect(titles(false)).toContain('Überfällige Abrechnungen prüfen');
	});

	// #64: «Überfällig» ab dem Tag nach der Zahlungsfrist, eine Mahnung schlägt die Übersicht erst nach der Mahnfrist vor
	it('schlägt eine Mahnung erst nach der Mahnfrist vor', () => {
		const titles = (paymentDeadline: string, reminderAfterDays: number) =>
			overviewTasks(
				input({
					statementCounts: { draft: 0, sent: 0, paid: 0, overdue: 1 },
					dueStatements: [{ id: 's1', tenantName: 'Anna Keller', paymentDeadline }],
					reminderAfterDays
				})
			).map((task) => task.title);

		expect(titles('2026-09-26', 14)).not.toContain('Überfällige Abrechnungen prüfen');
		expect(titles('2026-09-25', 14)).toContain('Überfällige Abrechnungen prüfen');
		expect(titles('2026-09-26', 7)).toContain('Überfällige Abrechnungen prüfen');
	});

	// #64, Fachreview V-1: eine Rückerstattung wird nie gemahnt, der Vermieter schuldet sie ab dem Tag nach der Zahlungsfrist
	it('nennt eine überfällige Rückerstattung ohne Mahnfrist', () => {
		const tasks = overviewTasks(
			input({
				statementCounts: { draft: 0, sent: 0, paid: 0, overdue: 1 },
				dueStatements: [
					{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-10-09', refund: true }
				]
			})
		);
		expect(tasks.map((task) => task.title)).toContain('Überfällige Abrechnungen prüfen');
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
						paymentDeadline: '2026-09-20',
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

	// Die Zahlungsfrist beträgt hier 30 Tage: eine eben versendete Abrechnung steht gleich in den Fristen
	it('lässt ferne Termine weg: Zahlungsfrist nach den eingestellten 30, Vertragsende nach 60 Tagen', () => {
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

	// #87: eine eben versendete Abrechnung steht mit jeder eingestellten Zahlungsfrist gleich in den Fristen
	it('zeigt jede offene Zahlungsfrist innerhalb der eingestellten Tage', () => {
		const deadlines = overviewDeadlines(
			input({
				paymentDeadlineDays: 60,
				dueStatements: [
					{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-12-10' },
					{ id: 's2', tenantName: 'Hans Müller', paymentDeadline: '2026-12-09' }
				]
			})
		);
		expect(deadlines.map((d) => d.name)).toEqual(['Hans Müller']);
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
