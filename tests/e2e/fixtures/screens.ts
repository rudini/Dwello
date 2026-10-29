import { readFileSync } from 'fs';
import type { TestData } from './backend';

// The screens the axe check and the language check visit (tests/a11y/screens.json), and the records they need
const screenList: typeof import('../../a11y/screens.json') = JSON.parse(
	readFileSync('tests/a11y/screens.json', 'utf8')
);
export type Viewport = keyof typeof screenList.viewports;
export const viewports = screenList.viewports;
export const variants = Object.keys(screenList.viewports).flatMap((viewport) =>
	screenList.colorSchemes.map((scheme) => ({ viewport: viewport as Viewport, scheme: scheme as 'light' | 'dark' }))
);

// Query strings that put a screen into a state before it loads; a screen may override them in screens.json
const query: Record<string, string> = {
	'filtered-empty': '?search=xq-a11y-0', // no German word: the apartment list repeats the term (#160)
	'login-error': '?error=failed',
	'login-not-allowed': '?error=not_allowed'
};

/** Path and query string of a screen in a state, ids still as {placeholders} */
const address = (screen: { path: string; queries?: object }, state: string) =>
	screen.path + ((screen.queries as Record<string, string> | undefined)?.[state] ?? query[state] ?? '');

// #454 (code review 454-1 C-6): sent statements of 2025 with an invoice for October to December recorded after them:
// Mia, moved out on 30.06., bears none of it; Nora's Saldo rises, and she was told «Nicht berichtigen»
async function correctionStates(seed: TestData) {
	await seed.building('Rebhof', 'Winterthur');
	await seed.apartment('Rebhof', '5.01', 'vacant');
	await seed.apartment('Rebhof', '5.02', 'vacant');
	await seed.tenant('Mia');
	await seed.tenant('Nora');
	await seed.contract('Mia', '5.01', { startDate: '2025-01-01', endDate: '2025-06-30', baseRent: '1200.00' });
	await seed.notice('Mia', '2025-06-30');
	await seed.contract('Nora', '5.02', { startDate: '2025-01-01', baseRent: '1200.00' });
	for (const tenant of ['Mia', 'Nora']) {
		await seed.statement(tenant, 'Rebhof', 2025, 'Standard');
		await seed.sendStatement(tenant, 2025);
	}
	await seed.invoiceOn('Rebhof', 'Hauswart', '300.00', '2025-12-15', ['2025-10-01', '2025-12-31']);
	await seed.declineCorrection('Nora', 2025);
	// a billed invoice deleted afterwards: Olga's Saldo would fall, so «Nicht berichtigen» is missing (code review 454-2 C-9)
	await seed.building('Ried', 'Winterthur');
	await seed.apartment('Ried', '6.01', 'vacant');
	await seed.tenant('Olga');
	await seed.contract('Olga', '6.01', { startDate: '2025-01-01', baseRent: '1200.00' });
	await seed.invoiceOn('Ried', 'Hauswart', '600.00', '2025-03-15');
	await seed.statement('Olga', 'Ried', 2025, 'Standard');
	await seed.sendStatement('Olga', 2025);
	await seed.deleteInvoice('Rechnung Hauswart 2025-03-15');
}

/** The example's address with its ids filled in, and the buildings the statement wizard checks */
export type Example = {
	path: string;
	state: string;
	public: boolean;
	building: string;
	tankBuilding: string;
	heatingProfile: string;
	accessKey?: string; // the name of a Zugangsschlüssel the key states create or revoke (#817)
	account?: { email: string; password: string }; // a Konto mit Passwort for the login states (#576)
};

/** A screen in a state, with the records it needs */
export async function exampleOf(seed: TestData, name: string, state: string): Promise<Example> {
	const screen = screenList.screens.find((candidate) => candidate.name === name)!;
	const example = { state, public: 'public' in screen && !!screen.public, ...(await seedFor(seed, address(screen, state), state)) };
	// #817: a key to revoke, and the name of the one the state creates (removed with the scenario's records)
	if (state === 'key-revoke-dialog') await seed.accessKey('Claude Desktop');
	if (state.startsWith('key-')) return { ...example, accessKey: seed.unique('Claude Desktop') };
	if (!state.startsWith('login-password') && state !== 'login-locked') return example;
	await seed.localAccount();
	return { ...example, account: { email: seed.names.get('E-Mail Konto')!, password: seed.names.get('Passwort Konto')! } };
}

/** Title of the document uploaded to the tenant Anna: a file name, not a German word the language check would flag */
export const UPLOADED = 'IMG_0412';

/** Records every screen with an id in its address needs */
async function seedFor(seed: TestData, path: string, state: string) {
	if (!path.includes('{') && !['delete-dialog', 'mark-paid-dialog', 'category-check', 'invoice-hints', 'preview-empty', 'fuel-stock-dialog', 'tank-question', 'every-wizard-step', 'preview-all-billed', 'preview-outdated', 'buildings-billed', 'buildings-overlap', 'generation-result', 'upload-dialog', 'upload-discard-dialog', 'upload-partial', 'upload-discard-created', 'upload-unreadable', 'old-address-task', 'old-address-preview', 'preview-skipped', 'heating-hints', 'draft-restored', 'draft-discard-dialog', 'uncategorized-invoices'].includes(state)) return { path, building: '', tankBuilding: '', heatingProfile: '' };
	await seed.building('Seeblick', 'Winterthur');
	await seed.apartment('Seeblick', '1.01', 'vacant');
	await seed.apartment('Seeblick', '1.02', 'vacant');
	await seed.apartment('Seeblick', '1.03', 'vacant'); // free: never rented
	await seed.apartment('Seeblick', '1.04', 'vacant'); // free only from 2099
	await seed.tenant('Anna');
	await seed.tenant('Bruno');
	await seed.tenant('Carla');
	await seed.upload('Anna', UPLOADED);
	await seed.contract('Anna', '1.01', { startDate: '2015-01-01', baseRent: '1800.00', monthlyAdvancePayment: '200.00' });
	// a later Akonto her 2025 draft counts: her page lists both, deleting it is refused (#464)
	await seed.advancePayment('Anna', '220.00', '2025-07-01');
	await seed.advancePayment('Anna', '240.00', '2099-01-01'); // an end before it is refused (#464)
	await seed.contract('Bruno', '1.02', { startDate: '2015-01-01', baseRent: '1500.00', monthlyAdvancePayment: '150.00' });
	await seed.contract('Carla', '1.04', { startDate: '2015-01-01', endDate: '2098-12-31', baseRent: '1400.00' });
	await seed.managementFee('Carla', false); // step «Einstellungen» of the statement wizard names her contract (#89)
	await seed.heatingProfile('Standard', [18, 16, 13, 8, 4, 1, 0, 0, 3, 9, 13, 15]);
	await seed.heatingInvoice('Seeblick', '9000.00', 2025); // Bruno pays more than his Akonto: a reminder can be sent
	await seed.fuelStock('Seeblick', '2025-12-31', '800.00'); // a Tankbestand to list and to delete
	// 2025 recorded from its start: a year to compare 2026 with; the 2025 statements take it
	const billedInvoice = await seed.invoiceOn('Seeblick', 'Hauswart', '300.00', '2025-01-31');
	await seed.belegFor(billedInvoice, '2025-01.pdf'); // its delete dialog advises to keep the Beleg first
	// the detail page shows its Beleg with what the KI saw on it, the delete dialog names it
	await seed.supplierInvoice('Hauswart Huber', 'Seeblick', '450.00', 'Treppenhausreinigung Q1', 'Hauswart', {
		fileName: 'huber-q1.pdf',
		deductedAmount: '1000.00',
		nonAllocableItems: true
	});
	await seed.statement('Anna', 'Seeblick', 2025, 'Standard');
	// wants e-mail with an address: her send dialog is the e-mail one, with «Stattdessen per Brief zustellen» (#449)
	await seed.correspondence('Anna', 'email');
	await seed.statement('Bruno', 'Seeblick', 2025, 'Standard');
	await seed.sendStatement('Bruno', 2025);
	await seed.paymentDeadline('Bruno', 2025, '2026-01-31'); // overdue: only then a reminder can be sent
	await seed.statement('Carla', 'Seeblick', 2023, 'Standard'); // no invoices in 2023: no positions
	// wants e-mail without an address: the send dialog offers only the letter; sending it by e-mail is refused (#86, #449)
	await seed.correspondence('Carla', 'email');
	await seed.noEmail('Carla');
	await seed.heatingInvoice('Seeblick', '9000.00', 2024); // Bruno owes for 2024 too
	// #382: an allocable invoice without Kategorie holds the preview of 2015; a description alike in every language
	await seed.invoiceWithoutCategory('Seeblick', '120.00', '2015-06-30', 'FTTH');
	// #379: recorded before the Verteilschlüssel was required; its edit form says so
	const keylessInvoice = await seed.invoiceOn('Seeblick', 'Hauswart', '200.00', '2014-03-31');
	await seed.invoiceWithoutKey('Hauswart 2014-03-31');
	for (const tenant of ['Anna', 'Bruno', 'Carla']) await seed.statement(tenant, 'Seeblick', 2024, 'Standard'); // 2024 all billed
	await seed.sendStatement('Anna', 2024);
	await seed.markPaid('Anna', 2024); // paid: its payment can be reset (#92)
	// #120: Carla's 2024 statement paid, replaced and corrected; her 2022 one replaced, its correction not created yet
	// (2022: a replaced statement of a whole year would count as billed for the shorter periods of 2025 the wizard shows)
	await seed.sendStatement('Carla', 2024);
	await seed.markPaid('Carla', 2024);
	await seed.replaceStatement('Carla', 2024);
	// #464: an Akonto entered after the replacement: the berichtigte Abrechnung warns that it counts another one
	await seed.advancePayment('Carla', '50.00', '2024-01-01');
	await seed.correctStatement('Carla', 2024);
	// no invoices and no Akonto in 2021: a Saldo of 0.00, «Erledigt» once sent (#448)
	await seed.statement('Carla', 'Seeblick', 2021, 'Standard');
	await seed.sendStatement('Carla', 2021);
	await seed.statement('Carla', 'Seeblick', 2022, 'Standard');
	await seed.sendStatement('Carla', 2022);
	await seed.replaceStatement('Carla', 2022);
	// reminded today: the Zahlungsfrist of the Mahnung runs, the next one is possible only later (#107)
	await seed.sendStatement('Bruno', 2024);
	await seed.paymentDeadline('Bruno', 2024, '2025-01-31');
	await seed.remind('Bruno', 2024);
	const lateInvoice = await seed.invoiceOn('Seeblick', 'Lift', '200.00', '2025-06-30'); // recorded after the 2025 statements
	// #448: a Saldo of 3.00 carried over («Erledigt»), the next statement with its Übertrag; in a second building the
	// carried statement corrected after the next one was sent: «Bereits verrechnet mit»
	for (const [building, tenant, number] of [['Uferweg', 'Jana', 'U1'], ['Hafenblick', 'Kai', 'H1']]) {
		await seed.building(building, 'Winterthur');
		await seed.apartment(building, number, 'vacant');
		await seed.tenant(tenant);
		await seed.contract(tenant, number, { startDate: '2023-01-01', baseRent: '1200.00' });
		await seed.managementFee(tenant, false);
		await seed.invoiceOn(building, 'Hauswart', '3.00', '2023-06-30');
		await seed.invoiceOn(building, 'Hauswart', '100.00', '2024-06-30');
		await seed.statement(tenant, building, 2023);
		await seed.sendStatement(tenant, 2023);
		await seed.statement(tenant, building, 2024);
	}
	await seed.sendStatement('Kai', 2024);
	await seed.replaceStatement('Kai', 2023, true);
	// #506: a Saldo of 3.00 carried over, then the contract ends in that period: no statement counts it, it is open
	await seed.building('Lindenweg', 'Winterthur');
	await seed.apartment('Lindenweg', 'L1', 'vacant');
	await seed.tenant('Lea');
	await seed.contract('Lea', 'L1', { startDate: '2023-01-01', baseRent: '1200.00' });
	await seed.managementFee('Lea', false);
	await seed.invoiceOn('Lindenweg', 'Hauswart', '3.00', '2023-06-30');
	await seed.statement('Lea', 'Lindenweg', 2023);
	await seed.sendStatement('Lea', 2023);
	await seed.contractEnd('Lea', '2023-12-31');
	// January to May 2026 without a statement of Seeblick (a shorter period of 2025 overlaps its statements, #199): an
	// invoice without Leistungszeitraum in it and one shortly after it
	await seed.invoiceOn('Seeblick', 'Hauswart', '300.00', '2026-01-31');
	await seed.invoiceOn('Seeblick', 'Lift', '200.00', '2026-06-30');
	// heating costs without any Tankbestand: the wizard asks about a tank; rented, so its preview has a row too
	await seed.building('Bergsicht', 'Winterthur');
	await seed.apartment('Bergsicht', '2.01', 'vacant');
	await seed.tenant('Dora');
	await seed.contract('Dora', '2.01', { startDate: '2015-01-01', baseRent: '1600.00', additionalRent: '80.00' }); // a parking space: the wizard's note after her contract names it (#144)
	await seed.notice('Dora', '2099-03-31'); // open-ended and ended by notice: the form offers to withdraw it
	await seed.billedUntil('Dora', '2015-12-31'); // «Abgerechnet bis» on her page and in the form (#133)
	await seed.heatingInvoice('Bergsicht', '1200.00', 2025);
	// moved in during 2025, invoices over different days and the change of the Tankbestand: the statement lists them
	// with their days and the calculation (#104, #240)
	await seed.building('Talblick', 'Winterthur');
	await seed.apartment('Talblick', '3.01', 'vacant');
	await seed.tenant('Greta');
	await seed.contract('Greta', '3.01', { startDate: '2025-08-15', baseRent: '1300.00' });
	await seed.invoiceOn('Talblick', 'Hauswart', '600.00', '2025-07-05', ['2025-04-01', '2025-06-30']);
	await seed.invoiceOn('Talblick', 'Hauswart', '1200.00', '2025-10-05', ['2025-07-01', '2025-09-30']);
	await seed.invoiceOn('Talblick', 'Heizung', '900.00', '2025-10-05', ['2025-07-01', '2025-09-30']);
	await seed.fuelStock('Talblick', '2024-12-31', '600.00');
	await seed.fuelStock('Talblick', '2025-12-31', '100.00');
	await seed.statement('Greta', 'Talblick', 2025);
	// empty since a tenancy ended long before any statement: «Leer seit», «Frühere Mietverträge» (#145, #117)
	await seed.apartment('Bergsicht', '2.02', 'vacant');
	await seed.tenant('Emil');
	await seed.contract('Emil', '2.02', { startDate: '2010-01-01', endDate: '2014-12-31', baseRent: '1500.00' });
	await seed.billedUntil('Emil', '2014-12-31'); // the wizard's preview of 2014 passes him over (#453)
	// a tenant who has not moved in yet: «Vermietet ab», Mieter «Künftig» (#58)
	await seed.apartment('Bergsicht', '2.03', 'vacant');
	await seed.tenant('Fritz');
	await seed.contract('Fritz', '2.03', { startDate: '2100-01-01', baseRent: '1500.00' });
	// A-5 (#114): moved out in 2024, still at the building's address: Ida with a draft (send dialog, overview task, the
	// next steps of her ended contract), Kurt without one (the wizard's preview of 2024)
	for (const [tenant, apartment] of [['Ida', '2.04'], ['Kurt', '2.05']]) {
		await seed.apartment('Bergsicht', apartment, 'vacant');
		await seed.tenant(tenant);
		await seed.contract(tenant, apartment, { startDate: '2024-01-01', endDate: '2024-06-30', baseRent: '1200.00' });
		await seed.notice(tenant, '2024-06-30');
		await seed.buildingAddress(tenant, 'Bergsicht');
	}
	await seed.statement('Ida', 'Bergsicht', 2024, 'Standard');
	// #339: 2024 heating invoices with and without a Leistungszeitraum at the move-outs: the wizard names the one without
	await seed.invoiceOn('Bergsicht', 'Heizung', '800.00', '2024-03-31');
	await seed.invoiceOn('Bergsicht', 'Heizung', '700.00', '2025-01-10', ['2024-10-01', '2024-12-31']);
	// #199, #408 point 2: Felsblick's only statement covers 2024 up to 30.06. (one Abrechnungsperiode per day and
	// building): the contract page offers a short period for the rest of Lea's 2024; its own building, so the runs of
	// 2024 in Bergsicht stay possible
	await seed.building('Felsblick', 'Winterthur');
	await seed.apartment('Felsblick', '2.06', 'vacant');
	await seed.tenant('Lea');
	await seed.contract('Lea', '2.06', { startDate: '2024-01-01', baseRent: '1200.00' });
	await seed.statement('Lea', 'Felsblick', 2024, 'Standard', ['2024-01-01', '2024-06-30']);
	// A-6 (#115): an agreed end in the past, the 2025 statement bills the time after it as Leerstand
	await seed.building('Talblick', 'Winterthur');
	await seed.apartment('Talblick', '3.01', 'vacant');
	await seed.tenant('Gina');
	await seed.contract('Gina', '3.01', { startDate: '2024-01-01', endDate: '2025-06-30', baseRent: '1300.00' });
	await seed.heatingInvoice('Talblick', '1200.00', 2025);
	await seed.statement('Gina', 'Talblick', 2025, 'Standard');
	await seed.category('Gartenpflege', true);
	// #100: a fuel category with a Tankbestand stays Brennstoff; «Pellets» reads alike in every language
	await seed.building('Holzhof', 'Winterthur');
	await seed.fuelCategoryWithStock('Holzhof', 'Pellets');
	// #91: own categories created after the contracts, with costs in 2025: the wizard asks for Hanna's, names Ines' as not
	// agreed; names alike in every language, so the language check sees only the wizard's texts
	await seed.building('Waldblick', 'Winterthur');
	await seed.apartment('Waldblick', '4.01', 'vacant');
	await seed.apartment('Waldblick', '4.02', 'vacant');
	await seed.tenant('Hanna');
	await seed.tenant('Ines');
	await seed.contract('Hanna', '4.01', { startDate: '2015-01-01', baseRent: '1500.00' });
	await seed.contract('Ines', '4.02', { startDate: '2015-01-01', baseRent: '1500.00' });
	for (const [category, date] of [['Internet', '2025-03-31'], ['Video', '2025-09-30']]) {
		await seed.categoryNamedAlikeInEnglish(category, 'FTTH');
		await seed.invoiceInOwnCategory('Waldblick', category, '240.00', date);
	}
	await seed.agreement('Ines', 'Internet', false);
	await seed.agreement('Ines', 'Video', true);
	// a change the Protokoll lists and whose entry can be deleted (#357)
	await seed.category('Rasenpflege', true);
	await correctionStates(seed);
	await seed.categoryAllowance('Rasenpflege', false);
	await seed.distributionKey('Nach Wohnungen', '{units}');
	// the stand-in reads «Elektro Blitz» as Allgemeinstrom: this invoice's key is proposed, so the file can be created (#452)
	if (['upload-partial', 'upload-discard-created'].includes(state)) await seed.invoiceOn('Seeblick', 'Allgemeinstrom', '300.00', '2025-03-31');
	const ids: Record<string, string | undefined> = {
		building: seed.idOf('Seeblick'),
		apartment: seed.idOf('1.01'),
		tenant: seed.idOf('Anna'), // rents 1.01 without an end: the contract wizard's step «Wohnung» names it (#156)
		contract: seed.idOf('Mietvertrag Anna'),
		noticedContract: seed.idOf('Mietvertrag Dora'),
		vacantApartment: seed.idOf('2.02'),
		endedContract: seed.idOf('Mietvertrag Emil'),
		endedTenant: seed.idOf('Emil'), // ended 2014: «Mieter anonymisieren» is offered (#459)
		expiredTenant: seed.idOf('Gina'), // ended 2025: the page names the first day (#459)
		expiredContract: seed.idOf('Mietvertrag Gina'),
		movedOutContract: seed.idOf('Mietvertrag Ida'),
		partlyBilledContract: seed.idOf('Mietvertrag Lea'),
		oldAddressStatement: seed.idOf('Abrechnung Ida 2024'),
		invoice: seed.idOf('Rechnung Hauswart Huber'),
		billedInvoice,
		lateInvoice,
		statement: seed.idOf('Abrechnung Anna 2025'),
		sentStatement: seed.idOf('Abrechnung Bruno 2025'),
		emptyStatement: seed.idOf('Abrechnung Carla 2023'),
		partsStatement: seed.idOf('Abrechnung Greta 2025'),
		paidStatement: seed.idOf('Abrechnung Anna 2024'),
		remindedStatement: seed.idOf('Abrechnung Bruno 2024'),
		replacedStatement: seed.idOf('Abrechnung Carla 2022'),
		settledStatement: seed.idOf('Abrechnung Carla 2021'),
		unaffectedStatement: seed.idOf('Abrechnung Mia 2025'),
		declinedStatement: seed.idOf('Abrechnung Nora 2025'),
		loweredStatement: seed.idOf('Abrechnung Olga 2025'),
		carriedStatement: seed.idOf('Abrechnung Jana 2023'),
		carryStatement: seed.idOf('Abrechnung Jana 2024'),
		openCarryStatement: seed.idOf('Abrechnung Lea 2023'),
		offsetStatement: seed.idOf('Berichtigte Abrechnung Kai 2023'),
		correctedStatement: seed.idOf('Abrechnung Carla 2024'),
		correctionStatement: seed.idOf('Berichtigte Abrechnung Carla 2024'),
		remindedLetter: seed.idOf('Mahnung Bruno 2024'),
		freeApartment: seed.idOf('1.03'),
		limitedApartment: seed.idOf('1.04'),
		noticedApartment: seed.idOf('2.01'), // free from 01.04.2099, after Dora's contract
		heatingProfile: seed.idOf('Standard'),
		category: seed.idOf('Gartenpflege'),
		fuelCategory: seed.idOf('Pellets'),
		// with an allocable invoice in Waldblick: saving it as not allocable asks first (#309)
		usedCategory: seed.idOf('Internet'),
		keylessInvoice,
		// a predefined category shows the reason of its allocability (#186)
		predefinedCategory: await seed.predefinedCategoryId('Feuerlöscher-Wartung'),
		distributionKey: seed.idOf('Nach Wohnungen'),
		agreedBuilding: seed.idOf('Waldblick')
	};
	return {
		path: path.replace(/\{(\w+)\}/g, (_, key: string) => ids[key]!),
		building: ids.building!,
		tankBuilding: seed.idOf('Bergsicht')!,
		heatingProfile: ids.heatingProfile!
	};
}

