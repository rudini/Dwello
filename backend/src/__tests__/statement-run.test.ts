/**
 * H-28: the rules of a run (moved from the BFF, src/lib/server/statement-generation.ts): which contracts it bills,
 * which have a statement in its period already, and when it is refused for overlapping a period of the building
 */
import { describe, expect, it } from 'bun:test';
import { planRun, runDefaults, runDifferences, runHeatingHints } from '../services/statement-run.service';

const year2024 = { start: '2024-01-01', end: '2024-12-31' };

const contract = (id: string, startDate: string, endDate: string | null, billedUntil: string | null = null) => ({
	id,
	startDate,
	endDate,
	billedUntil,
	tenantName: `Mieter ${id}`
});

const contracts = [
	contract('vorher', '2020-01-01', '2023-12-31'),
	contract('auszug', '2020-01-01', '2024-03-31'),
	contract('einzug', '2024-05-01', null),
	contract('nachher', '2025-01-01', null)
];

const statement = (contractId: string, periodStart: string, periodEnd: string, status = 'draft') => ({ contractId, periodStart, periodEnd, status });

const billedOf = (plan: ReturnType<typeof planRun>) => plan.contracts.map(({ id, billed }) => ({ id, billed }));

describe('Mietverträge eines Laufs', () => {
	it('rechnet die Mietverträge mit Mietstagen in der Periode ab, ohne die mit einer Abrechnung darin', () => {
		// a replaced statement and its berichtigte Abrechnung count once; a statement of an earlier period counts not
		const plan = planRun(year2024, contracts, [
			statement('einzug', '2024-01-01', '2024-12-31', 'replaced'),
			statement('einzug', '2024-01-01', '2024-12-31'),
			statement('auszug', '2023-01-01', '2023-12-31')
		]);

		expect(billedOf(plan)).toEqual([
			{ id: 'auszug', billed: false },
			{ id: 'einzug', billed: true }
		]);
	});

	it('rechnet einen Mietvertrag wieder ab, dessen Abrechnung dieser Periode ersetzt ist', () => {
		// the run creates the berichtigte Abrechnung (#120)
		const plan = planRun(year2024, contracts, [statement('einzug', '2024-01-01', '2024-12-31', 'replaced')]);

		expect(billedOf(plan)).toContainEqual({ id: 'einzug', billed: false });
	});

	// #453 (#327): in the period by its dates, but «Abgerechnet bis» leaves it no Mietstage there
	it('nennt einen Mietvertrag, den «Abgerechnet bis» in der Periode abdeckt, und rechnet ihn nicht ab', () => {
		const plan = planRun(year2024, [contract('aussen', '2020-01-01', null, '2024-12-31'), contract('teils', '2020-01-01', null, '2024-06-30')], []);

		expect(billedOf(plan)).toEqual([{ id: 'teils', billed: false }]);
		expect(plan.skipped).toEqual([{ id: 'aussen', tenantName: 'Mieter aussen', billedUntil: '2024-12-31' }]);
	});

	// fach review 453-1 V-2: billed outside Dwello beyond its end, the contract has no Mietstage left in the period
	it('nennt einen Mietvertrag, der über sein Vertragsende hinaus ausserhalb von Dwello abgerechnet ist', () => {
		const plan = planRun(year2024, [contract('auszug', '2020-01-01', '2024-03-31', '2024-06-30')], []);

		expect(plan.contracts).toEqual([]);
		expect(plan.skipped).toEqual([{ id: 'auszug', tenantName: 'Mieter auszug', billedUntil: '2024-06-30' }]);
	});

	// Erneut erstellen ergänzt nur: a sent or paid statement of the period bills the contract there
	it('zählt eine bezahlte Abrechnung der Periode als abgerechnet', () => {
		const plan = planRun(year2024, contracts, [statement('einzug', '2024-01-01', '2024-12-31', 'paid')]);

		expect(billedOf(plan)).toEqual([
			{ id: 'auszug', billed: false },
			{ id: 'einzug', billed: true }
		]);
	});
});

// #199, #408 point 2: one Abrechnungsperiode per day and building; a run whose period overlaps a statement period of
// the building without being equal would share an invoice out above 100 %
describe('Abrechnungsperiode, die eine bestehende des Gebäudes schneidet', () => {
	const switched = [
		statement('auszug', '2023-07-01', '2024-06-30'),
		statement('einzug', '2023-07-01', '2024-06-30'),
		statement('vorher', '2023-07-01', '2024-06-30')
	];

	it('lehnt den Lauf für das Gebäude ab und nennt die bestehende Periode und die übrigen Tage', () => {
		expect(planRun(year2024, contracts, switched).overlap).toEqual({
			periods: [{ start: '2023-07-01', end: '2024-06-30' }],
			choose: [],
			short: [{ start: '2024-07-01', end: '2024-12-31' }],
			vacant: false,
			statements: 3
		});
	});

	it('bietet die bestehende Periode an, wenn ein Mietvertrag darin noch keine Abrechnung hat', () => {
		const plan = planRun(year2024, contracts, switched.filter((s) => s.contractId !== 'vorher'));

		expect(plan.overlap?.choose).toEqual([{ start: '2023-07-01', end: '2024-06-30' }]);
	});

	it('bietet keine kurze Periode für Tage ohne Mietstage an', () => {
		// only «einzug» has days after 30.06.2024, and they are billed outside Dwello (#133)
		const plan = planRun(year2024, [contract('auszug', '2020-01-01', '2024-03-31'), contract('einzug', '2024-05-01', null, '2024-12-31')], switched);

		expect(plan.overlap?.short).toEqual([]);
		// Fachreview 199-1 V-3: step 2 says there is nothing to bill
		expect(plan.overlap?.vacant).toBe(true);
	});

	it('lässt eine ersetzte Abrechnung und eine Abrechnung genau dieser Periode zu', () => {
		const plan = planRun(year2024, contracts, [
			statement('auszug', '2023-07-01', '2024-06-30', 'replaced'),
			statement('einzug', '2024-01-01', '2024-12-31')
		]);

		expect(plan.overlap).toBeNull();
	});

	// code review 199-2 C-8: a replaced statement without its berichtigte Abrechnung still holds its period, else its
	// correction would overlap the run (#120)
	it('zählt eine ersetzte Abrechnung ohne berichtigte als Periode des Gebäudes', () => {
		const plan = planRun(year2024, contracts, [statement('auszug', '2023-07-01', '2024-06-30', 'replaced')]);

		expect(plan.overlap?.periods).toEqual([{ start: '2023-07-01', end: '2024-06-30' }]);
	});

	// code review 199-1 C-1: the period of a replaced statement is one of the building's: its berichtigte Abrechnung is
	// created there, also when another, older statement overlaps it
	it('lässt die Periode einer ersetzten Abrechnung zu, auch wenn eine andere sie schneidet', () => {
		const plan = planRun(year2024, contracts, [
			statement('auszug', '2024-01-01', '2024-12-31', 'replaced'),
			statement('einzug', '2024-07-01', '2025-06-30')
		]);

		expect(plan.overlap).toBeNull();
	});

	// Fachreview 199-1 V-2: a statement period inside the run leaves two pieces, each its own short period
	it('bietet für jedes Stück übriger Tage eine eigene kurze Periode an', () => {
		const plan = planRun(year2024, contracts, [statement('einzug', '2024-03-01', '2024-09-30')]);

		expect(plan.overlap?.short).toEqual([
			{ start: '2024-01-01', end: '2024-02-29' },
			{ start: '2024-10-01', end: '2024-12-31' }
		]);
	});

	// Fachreview 199-1 V-4: a short period only for days of an ended period, none for days still to come
	it('bietet keine kurze Periode für Tage an, die noch nicht vorbei sind', () => {
		const plan = planRun(
			{ start: '2099-01-01', end: '2099-12-31' },
			[contract('einzug', '2024-05-01', null)],
			[statement('einzug', '2099-01-01', '2099-06-30')],
			'2026-10-23'
		);

		expect(plan.overlap?.short).toEqual([]);
		expect(plan.overlap?.vacant).toBe(false);
	});

	// Fachreview 199-1 V-5: «without a statement» counts Mietstage (after «Abgerechnet bis») and no replaced statement
	it('bietet die bestehende Periode nach den Mietstagen und ohne ersetzte Abrechnungen an', () => {
		const billedOutside = planRun(
			year2024,
			[contract('auszug', '2020-01-01', '2024-03-31'), contract('einzug', '2024-05-01', null), contract('vorher', '2020-01-01', '2023-12-31', '2023-12-31')],
			switched.slice(0, 2)
		);
		const replaced = planRun(year2024, contracts, [...switched.slice(0, 2), { ...switched[2], status: 'replaced' }]);

		expect(billedOutside.overlap?.choose).toEqual([]);
		expect(replaced.overlap?.choose).toEqual([{ start: '2023-07-01', end: '2024-06-30' }]);
	});

	// Fachreview 199-1 V-1, product owner: statements made before this rule may overlap each other; a period equal to
	// one of them is allowed, only one that overlaps and equals none is refused
	it('lässt bei überschneidenden Altdaten eine Periode zu, die einer bestehenden gleicht', () => {
		const old = [statement('einzug', '2023-07-01', '2024-06-30'), statement('auszug', '2024-01-01', '2024-12-31')];

		expect(planRun(year2024, contracts, old).overlap).toBeNull();
		// «einzug» has days in 2024 but a statement that overlaps it: the run would bill him no more there
		expect(planRun({ start: '2024-07-01', end: '2025-06-30' }, contracts, old).overlap?.choose).toEqual([]);
	});

	// code review 199-3 C-12: a replaced statement and its berichtigte Abrechnung are one statement for step 2's text
	it('zählt eine ersetzte Abrechnung mit ihrer berichtigten einmal', () => {
		const plan = planRun(year2024, contracts, [
			statement('einzug', '2023-07-01', '2024-06-30', 'replaced'),
			statement('einzug', '2023-07-01', '2024-06-30')
		]);

		expect(plan.overlap?.statements).toBe(1);
	});

	// code review 199-3 C-12: days a replaced statement holds are no days for a short period
	it('bietet keine kurze Periode für Tage einer ersetzten Abrechnung an', () => {
		const plan = planRun(year2024, contracts, [
			statement('einzug', '2023-07-01', '2024-06-30'),
			statement('einzug', '2024-07-01', '2024-09-30', 'replaced')
		]);

		expect(plan.overlap?.short).toEqual([{ start: '2024-10-01', end: '2024-12-31' }]);
	});
});


// A-10: a link from the contract or from a refusal chooses building and period; Heizprofil and Verwaltungspauschale
// come from the other statements of that building in that period, otherwise from the settings
describe('Vorgaben des Abrechnungs-Assistenten', () => {
	const settings = { accountingPeriod: 'july-june' as const, managementFeePercent: 2.5, heatingProfileId: 'hp1' };

	it('nimmt ohne Link Periode, Heizprofil und Verwaltungspauschale aus den Einstellungen', () => {
		expect(runDefaults(settings, null, [], [], '2026-10-02')).toEqual({
			period: { start: '2025-07-01', end: '2026-06-30' },
			buildingId: null,
			heatingProfileId: 'hp1',
			managementFeePercent: 2.5,
			preset: null
		});
	});

	const link = { buildingId: 'b1', period: { start: '2025-01-01', end: '2025-12-31' } };
	const tenancy = (id: string, managementFeeAgreed: boolean, managementFeePercent: string | null, apartmentId = id, startDate = '2020-01-01', endDate: string | null = null) => ({
		...contract(id, startDate, endDate),
		apartmentId,
		managementFeeAgreed,
		managementFeePercent
	});
	const of2025 = (contractId: string, managementFeePercent: string, heatingProfileId: string | null = 'hp9', status = 'sent') => ({
		...statement(contractId, '2025-01-01', '2025-12-31', status),
		heatingProfileId,
		managementFeePercent
	});
	const tenancies = [tenancy('nein', false, null), tenancy('eigen', true, '2.00'), tenancy('lauf', true, null), tenancy('lauf2', true, null)];

	it('übernimmt Gebäude, Periode, Heizprofil und Verwaltungspauschale aus den übrigen Abrechnungen', () => {
		expect(runDefaults(settings, link, tenancies, [of2025('lauf', '4.50')], '2026-10-02')).toEqual({
			period: link.period,
			buildingId: 'b1',
			heatingProfileId: 'hp9',
			managementFeePercent: 4.5,
			// personas K1: the wizard says what is chosen and where Heizprofil and Pauschale come from
			preset: { fromStatements: true, feeFromSettings: false, differing: false, profileFromApartment: false }
		});
	});

	// #119: other statements set differently give no template; both come from the settings
	it('nimmt die Einstellungen, wenn die übrigen Abrechnungen verschiedene Heizprofile haben', () => {
		expect(runDefaults(settings, link, tenancies, [of2025('lauf', '4.50', 'hp8'), of2025('lauf2', '4.50', 'hp9')], '2026-10-02')).toMatchObject({
			heatingProfileId: 'hp1',
			managementFeePercent: 2.5,
			preset: { differing: true, fromStatements: false, feeFromSettings: true }
		});
	});

	// #387 (#406 point 7): at a tenant change the Heizprofil of the same apartment's statement, so both tenants carry
	// 100 % of the heating costs; the Verwaltungspauschale still from the settings
	const eva = tenancy('eva', true, null, 'a1', '2024-01-01', '2025-03-31');
	const marc = tenancy('marc', true, null, 'a1', '2025-05-01');

	it('nimmt beim Mieterwechsel das Heizprofil der Abrechnung derselben Wohnung', () => {
		const lea = tenancy('lea', true, null, 'a2');
		expect(runDefaults(settings, link, [eva, marc, lea], [of2025('eva', '4.50', 'hp8'), of2025('lea', '4.50', 'hp9')], '2026-10-02')).toMatchObject({
			heatingProfileId: 'hp8',
			managementFeePercent: 2.5,
			preset: { differing: true, profileFromApartment: true, fromStatements: true, feeFromSettings: true }
		});
	});

	// Fachreview 387-1 V-1: a replaced statement does not count as a statement of the period (glossary «Ersetzt»)
	it('übergeht eine ersetzte Abrechnung', () => {
		expect(runDefaults(settings, link, [eva, marc], [of2025('eva', '4.50', 'hp8', 'replaced'), of2025('marc', '4.50', 'hp9')], '2026-10-02')).toMatchObject({
			heatingProfileId: 'hp9',
			preset: { differing: false, fromStatements: true }
		});
	});

	// Fachreview 387-1 V-4: the apartments of the missing statements name different profiles: none fits both
	it('nimmt die Einstellungen, wenn die Wohnungen verschiedene Heizprofile haben', () => {
		const lea = tenancy('lea', true, null, 'a2', '2020-01-01', '2025-06-30');
		const tim = tenancy('tim', true, null, 'a2', '2025-07-01');
		expect(runDefaults(settings, link, [eva, marc, lea, tim], [of2025('eva', '4.50', 'hp8'), of2025('lea', '4.50', 'hp9')], '2026-10-02')).toMatchObject({
			heatingProfileId: 'hp1',
			preset: { differing: true, profileFromApartment: false }
		});
	});

	it('nimmt die Einstellungen, wenn die übrigen Abrechnungen zum Satz des Laufs verschiedene Sätze haben', () => {
		expect(runDefaults(settings, link, tenancies, [of2025('lauf', '4.50'), of2025('lauf2', '2.50')], '2026-10-02')).toMatchObject({
			heatingProfileId: 'hp1',
			managementFeePercent: 2.5,
			preset: { differing: true }
		});
	});

	// fach-review V-5: a statement whose Heizprofil was deleted has none; it differs from no other
	it('übergeht eine übrige Abrechnung ohne Heizprofil', () => {
		expect(runDefaults(settings, link, tenancies, [of2025('lauf', '4.50', null), of2025('lauf2', '4.50')], '2026-10-02')).toMatchObject({
			heatingProfileId: 'hp9',
			preset: { differing: false }
		});
	});

	it('übernimmt gleich eingestellte übrige Abrechnungen', () => {
		expect(runDefaults(settings, link, tenancies, [of2025('lauf', '4.50'), of2025('lauf2', '4.50')], '2026-10-02')).toMatchObject({
			heatingProfileId: 'hp9',
			managementFeePercent: 4.5,
			preset: { differing: false, fromStatements: true, feeFromSettings: false }
		});
	});

	// #89, fach-review V-1: a statement stores its contract's rate; only one at the run's rate tells the run's rate
	it('übernimmt den Satz nur von einer Abrechnung zum Satz des Abrechnungslaufs', () => {
		const mixed = [of2025('nein', '0.00'), of2025('eigen', '2.00'), of2025('lauf', '4.50')];
		expect(runDefaults(settings, link, tenancies, mixed, '2026-10-02')).toMatchObject({
			managementFeePercent: 4.5,
			preset: { fromStatements: true, feeFromSettings: false }
		});
		// none at the run's rate: the settings' rate; the heating profile still comes from the other statements, so a
		// recreated statement shares it (A-10, closing review C-1), and the notice says where each comes from
		expect(runDefaults(settings, link, tenancies, mixed.slice(0, 2), '2026-10-02')).toMatchObject({
			managementFeePercent: 2.5,
			heatingProfileId: 'hp9',
			preset: { fromStatements: true, feeFromSettings: true }
		});
	});

	// statements of another period of the building tell nothing about this one
	it('übergeht Abrechnungen anderer Perioden des Gebäudes', () => {
		expect(runDefaults(settings, link, tenancies, [{ ...of2025('lauf', '4.50'), periodStart: '2024-01-01', periodEnd: '2024-12-31' }], '2026-10-02')).toMatchObject({
			heatingProfileId: 'hp1',
			preset: { fromStatements: false }
		});
	});
});


// #132, H-28 pair #16: what a kept statement of the run's period does differently from the run
describe('Abweichende Einstellungen bestehender Abrechnungen', () => {
	const names = (name: string) => ({ name, nameDE: name, nameFR: null, nameIT: null, nameEN: null });
	const profile = (id: string, name: string, updatedAt = '2024-01-01T00:00:00.000Z') => ({ id, ...names(name), updatedAt: new Date(updatedAt) });
	const profiles = [profile('hp1', 'Heizung Mittelland'), profile('hp2', 'Winter')];
	const tenancy = (id: string, managementFeeAgreed = true, managementFeePercent: string | null = null) => ({ id, managementFeeAgreed, managementFeePercent });
	const tenancies = [tenancy('c1'), tenancy('eigen', true, '2.50'), tenancy('ohne', false)];
	const kept = (id: string, contractId: string, heatingProfileId: string | null, managementFeePercent: string | null, more: object = {}) => ({
		id,
		contractId,
		heatingProfileId,
		managementFeePercent,
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31',
		heatingShare: null,
		createdAt: new Date('2025-01-10T08:00:00.000Z'),
		...more
	});
	const run = { period: year2024, heatingProfileId: 'hp1', managementFeePercent: 4.5 };
	const differ = (id: string, more: object) => ({ id, profile: null, profileEdited: null, fee: null, ...more });

	it('nennt eine Abrechnung mit einem anderen Heizprofil mit beiden Namen', () => {
		expect(runDifferences(run, [kept('1', 'c1', 'hp2', '4.50'), kept('2', 'c1', 'hp1', '4.50')], tenancies, profiles)).toEqual([
			differ('1', { profile: { used: names('Winter'), run: names('Heizung Mittelland') } })
		]);
	});

	// a deleted Heizprofil is stored as none; the statement keeps its name since #209
	it('nennt ein gelöschtes Heizprofil mit dem Namen, den die Abrechnung gespeichert hat', () => {
		const share = { byDays: false, names: names('Alt') };

		expect(runDifferences(run, [kept('1', 'c1', null, '4.50', { heatingShare: share })], tenancies, profiles)).toEqual([
			differ('1', { profile: { used: names('Alt'), run: names('Heizung Mittelland') } })
		]);
	});

	it('nennt ein unbekanntes Heizprofil ohne Namen', () => {
		expect(runDifferences(run, [kept('1', 'c1', 'weg', '4.50')], tenancies, profiles)).toEqual([
			differ('1', { profile: { used: null, run: names('Heizung Mittelland') } })
		]);
	});

	// persona Dr. Weber P-2, Fachreview V-8: by days (a contract over the whole period) the Heizprofil changes nothing;
	// code review C-13: by days for want of heating months, another profile may share differently
	it('nennt kein anderes Heizprofil, wenn die Abrechnung über die ganze Periode nach Tagen verteilt hat', () => {
		const whole = kept('1', 'c1', 'hp2', '4.50', { heatingShare: { byDays: true, reason: 'wholePeriod' } });
		const noMonths = kept('2', 'c1', 'hp2', '4.50', { heatingShare: { byDays: true, reason: 'noHeatingMonths' } });

		expect(runDifferences(run, [whole, noMonths], tenancies, profiles)).toEqual([
			differ('2', { profile: { used: names('Winter'), run: names('Heizung Mittelland') } })
		]);
	});

	// Fachreview V-1: the statement keeps the Monatsanteile of its time, the run takes the profile as it is now
	it('nennt eine Abrechnung, deren Heizprofil nach dem Erstellen bearbeitet wurde', () => {
		const made = kept('1', 'c1', 'hp1', '4.50', { heatingShare: { byDays: false, names: names('Heizung Mittelland') } });
		const later = [profile('hp1', 'Heizung Mittelland', '2025-02-01T08:00:00.000Z')];

		expect(runDifferences(run, [made], tenancies, later)).toEqual([differ('1', { profileEdited: names('Heizung Mittelland') })]);
		expect(runDifferences(run, [made], tenancies, profiles)).toEqual([]); // edited before
		// by days, the profile's shares do not count
		expect(runDifferences(run, [{ ...made, heatingShare: { byDays: true } }], tenancies, later)).toEqual([]);
	});

	// Fachreview M-1: the rate the run would store for the contract: its own rate before the run's, 0 without an agreed
	// fee (#89); each case says where the rate comes from
	it('vergleicht die Verwaltungspauschale mit dem Satz, den der Lauf für den Mietvertrag speichern würde', () => {
		const statements = [
			kept('1', 'c1', 'hp1', '3.00'),
			kept('2', 'eigen', 'hp1', '2.50'),
			kept('3', 'eigen', 'hp1', '3.00'),
			kept('4', 'ohne', 'hp1', '0.00'),
			kept('5', 'ohne', 'hp1', '3.00'),
			kept('6', 'c1', 'hp1', null)
		];

		expect(runDifferences(run, statements, tenancies, profiles)).toEqual([
			differ('1', { fee: { used: 3, now: 4.5, source: 'run' } }),
			differ('3', { fee: { used: 3, now: 2.5, source: 'contract' } }),
			differ('5', { fee: { used: 3, now: 0, source: 'none' } }),
			differ('6', { fee: { used: 0, now: 4.5, source: 'run' } })
		]);
	});

	// Fachreview V-4: settings only compare within the same Abrechnungsperiode; code review C-1: a statement of an
	// unknown contract is not compared
	it('vergleicht nur Abrechnungen derselben Abrechnungsperiode mit bekanntem Mietvertrag', () => {
		const other = kept('1', 'c1', 'hp2', '1.00', { periodStart: '2023-07-01', periodEnd: '2024-06-30' });

		expect(runDifferences(run, [other, kept('2', 'fremd', 'hp2', '1.00')], tenancies, profiles)).toEqual([]);
	});
});

// H-28: which heating hints of the period's check a run shows, by the contracts it bills
describe('Hinweise zu den Heizkosten eines Laufs', () => {
	const hinted = [{ id: 'i1', billingEntityName: 'Fernwärme AG', description: null, invoiceDate: '2024-03-31', amount: '1520.00', categoryId: 'heiz' }];
	const tenancy = (id: string, apartmentId: string, startDate: string, endDate: string | null) => ({ ...contract(id, startDate, endDate), apartmentId });
	const hintsOf = (inBuilding: ReturnType<typeof tenancy>[], heatingProfileId: string | null, statements: object[] = [], oldHeatingRule: string[] = []) =>
		runHeatingHints({ period: year2024, heatingProfileId }, inBuilding, statements as Parameters<typeof runHeatingHints>[2], { heatingWithoutServicePeriod: hinted, oldHeatingRule });

	// #339 (#451, point 6): only at a move-in or move-out in the period, and with a Heizprofil, a heating invoice with a
	// Leistungszeitraum counts only its months; only then the hint on those without one
	it.each([
		['bei einem Einzug mit Heizprofil', [tenancy('einzug', 'w1', '2024-05-01', null)], 'hp1', hinted],
		['bei einem Auszug mit Heizprofil', [tenancy('auszug', 'w1', '2020-01-01', '2024-03-31')], 'hp1', hinted],
		['nicht bei einem Mietvertrag über die ganze Periode', [tenancy('ganz', 'w1', '2020-01-01', null)], 'hp1', []],
		['nicht ohne Heizprofil', [tenancy('einzug', 'w1', '2024-05-01', null)], null, []]
	] as const)('nennt Heizrechnungen ohne Leistungszeitraum neben solchen mit %s', (_, inBuilding, heatingProfileId, expected) => {
		expect(hintsOf([...inBuilding], heatingProfileId).heatingWithoutServicePeriod).toEqual([...expected]);
	});

	it('nennt sie nicht, wenn der Mietvertrag mit dem Einzug schon eine Abrechnung der Periode hat', () => {
		const billed = [{ ...statement('einzug', '2024-01-01', '2024-12-31'), id: 's1', apartmentId: 'w1' }];

		expect(hintsOf([tenancy('ganz', 'w2', '2020-01-01', null), tenancy('einzug', 'w1', '2024-05-01', null)], 'hp1', billed).heatingWithoutServicePeriod).toEqual([]);
	});

	// code review E-1: as before H-28, a contract with a statement in the period counts as billed, also one replaced there
	it('nennt sie nicht, wenn die Abrechnung des Mietvertrags mit dem Einzug in der Periode ersetzt ist', () => {
		const replaced = [{ ...statement('einzug', '2024-01-01', '2024-12-31', 'replaced'), id: 's1', apartmentId: 'w1' }];

		expect(hintsOf([tenancy('ganz', 'w2', '2020-01-01', null), tenancy('einzug', 'w1', '2024-05-01', null)], 'hp1', replaced).heatingWithoutServicePeriod).toEqual([]);
	});

	// #335 (#451, point 5): the sent statement of the previous tenant still shares the heating costs without the months in
	// the Leistungszeitraum (by the check); the preview names it when the run bills the next tenant of the same apartment
	it.each([
		['erstellt der Lauf eine Abrechnung derselben Wohnung', [], ['alt']],
		['hat der Nachmieter schon eine Abrechnung', [{ ...statement('einzug', '2024-01-01', '2024-12-31'), id: 'neu', apartmentId: 'w1' }], []]
	] as const)('nennt eine versendete Abrechnung nach der alten Regel: %s', (_, more, expected) => {
		const moved = [tenancy('auszug', 'w1', '2020-01-01', '2024-03-31'), tenancy('einzug', 'w1', '2024-05-01', null), tenancy('andere', 'w2', '2024-05-01', null)];
		const sent = { ...statement('auszug', '2024-01-01', '2024-12-31', 'sent'), id: 'alt', apartmentId: 'w1' };

		expect(hintsOf(moved, 'hp1', [sent, ...more], ['alt']).oldHeatingRule).toEqual([...expected]);
	});
});

// H-28 (#717): what the preview says about each contract of the run, decided here and not in the BFF
describe('Kennzeichen der Mietverträge eines Laufs', () => {
	const flagsOf = (inPeriod: Parameters<typeof planRun>[1], today = '2026-01-15') =>
		planRun(year2024, inPeriod, [], today).contracts.map(({ id, movedOut, fixedTerm, shortenedTo }) => ({ id, movedOut, fixedTerm, shortenedTo }));

	// a statement 2024 made in 2026 for a tenant who left in March 2025: gone by now, a higher Akonto helps nothing
	it('zählt einen Mieter, der bis heute ausgezogen ist, als ausgezogen', () => {
		expect(flagsOf([contract('spaeter', '2020-01-01', '2025-03-31'), contract('bleibt', '2020-01-01', '2099-12-31')]).map(({ id, movedOut }) => [id, movedOut])).toEqual([
			['spaeter', true],
			['bleibt', false]
		]);
	});

	// #76: a befristeter Mietvertrag runs without Kündigungstermin until its agreed end
	it('erkennt einen laufenden befristeten Mietvertrag', () => {
		const flags = flagsOf([
			contract('befristet', '2020-01-01', '2099-12-31'),
			{ ...contract('gekuendigt', '2020-01-01', '2099-12-31'), terminated: true },
			contract('unbefristet', '2020-01-01', null),
			contract('beendet', '2020-01-01', '2024-03-31')
		]);

		expect(flags.map(({ id, fixedTerm }) => [id, fixedTerm])).toEqual([
			['befristet', true],
			['gekuendigt', false],
			['unbefristet', false],
			['beendet', false]
		]);
	});

	// #453 (#327): «Abgerechnet bis» only where it shortens the Mietstage in the period
	it('nennt «Abgerechnet bis», wo es die Mietstage in der Periode kürzt', () => {
		const flags = flagsOf([contract('auszug', '2020-01-01', '2024-03-31', '2024-02-29'), contract('einzug', '2024-05-01', null, '2023-12-31')]);

		expect(flags.map(({ id, shortenedTo }) => [id, shortenedTo])).toEqual([
			['auszug', '2024-02-29'],
			['einzug', null]
		]);
	});

	// #89: the run's rate applies only where the Verwaltungspauschale is agreed; step «Einstellungen» names the others
	it('nennt die Mietverträge, die eine Abrechnung erhalten, ohne vereinbarte Pauschale', () => {
		const fee = (id: string, startDate: string, endDate: string | null, managementFeeAgreed: boolean) => ({
			...contract(id, startDate, endDate),
			apartmentNumber: '2.01',
			managementFeeAgreed
		});
		const plan = planRun(year2024, [fee('auszug', '2020-01-01', '2024-03-31', false), fee('einzug', '2024-05-01', null, false), fee('eigen', '2024-01-01', null, true)], [
			// already billed: this run makes no statement for it
			statement('einzug', '2024-01-01', '2024-12-31')
		]);

		expect(plan.withoutFee).toEqual([{ id: 'auszug', tenantName: 'Mieter auszug', apartmentNumber: '2.01' }]);
	});
});
