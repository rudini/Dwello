import { writeDraft } from '../../../src/lib/wizard-draft';
import { inDays } from '../fixtures/dates';
import { type Example, type Viewport, variants, viewports } from '../fixtures/screens';
import { accessibilityViolations } from '../questions/accessibility';
import { inPageLanguage, languageFindings, pageLanguage } from '../questions/language';
import { pageAddress } from '../questions/navigation';
import type { Activity, Actor, Question } from '../screenplay/actor';
import {
	Browser,
	Check,
	Click,
	Cookies,
	Enter,
	EnterDate,
	FailRequests,
	Navigate,
	PostFormAction,
	Press,
	Select,
	Wait
} from '../screenplay/interactions';
import { randomUUID } from 'crypto';
import {
	belegDetailsToggle,
	belegMessage,
	belegUnsure,
	cancelUploadButton,
	createInvoicesButton,
	discardMessage,
	uploadResult
} from '../targets/invoice-upload';
import { invoicePdf, uploadBelege } from './invoice-upload';
import { Visibility } from '../screenplay/questions';
import { nameInput, proposal, proposeButton } from '../targets/categories';
import type { Target } from '../screenplay/target';
import * as on from '../targets/accessibility';
import { userMenuButton } from '../targets/app-frame';
import {
	confirmDeleteContractButton,
	confirmEndContractButton,
	contractEndInput,
	contractEndPastConfirm,
	noticeReceivedInput,
	deleteContractButton,
	endContractButton
} from '../targets/contract-detail';
import {
	apartmentContractsUnknown,
	apartmentSelect,
	baseRentInput,
	contractSubmitButton,
	durationChoice,
	endDateInput,
	retryContractsButton,
	reviewContractsUnknown,
	startDateInput,
	tenantSelect
} from '../targets/contract-form';
import { errorToast } from '../targets/form';
import { languageButton } from '../targets/language';
import { demoNotice } from '../targets/demo';
import { draftRestored, nextButton, saveStatus } from '../targets/wizard';
import { DEMO_INSTANCE } from './demo';
import { uploadDocument, wordFile } from './tenant-documents';
import { deleteDocumentButton } from '../targets/documents';
import { UPLOADED } from '../fixtures/screens';

// How the axe check and the language check bring each screen of tests/a11y/screens.json into its state

const FINDINGS = 'findings';

/** Adds what the actor finds on the page now to the findings of the check (`findings` in questions/accessibility.ts) */
const note =
	(look: Question<string[]>, prefix: string): Activity =>
	async (actor) =>
		actor.remember(FINDINGS, [
			...(actor.recall<string[]>(FINDINGS) ?? []),
			...(await actor.answer(look)).map((finding) => `${prefix}${finding}`)
		]);

// What the page shows in its own language
const say = (actor: Actor, text: string) => actor.answer(inPageLanguage(text));
const clickOnShown = async (actor: Actor, text: string, place: (shown: string) => Target) =>
	actor.attemptsTo(Click.on(place(await say(actor, text))));
const openDialog = (button: Target): Activity => (actor) => actor.attemptsTo(Click.on(button), Wait.until(on.dialogConfirm));
const askKi = (name: string): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(name).into(nameInput),
		Click.on(proposeButton),
		Wait.until(proposal)
	);

// The statement wizard's preview of a calendar year for this example's building (and others), heating profile and fee
// as proposed
const previewOf =
	(year: string, shown: string) =>
	(example: Example, ...others: string[]): Activity =>
	async (actor) => {
		await actor.attemptsTo(
			EnterDate.of(`${year}-01-01`).into(on.periodStartInput),
			EnterDate.of(`${year}-12-31`).into(on.periodEndInput),
			Click.on(nextButton)
		);
		for (const building of [example.building, ...others]) await actor.attemptsTo(Check.the(on.generateBuilding(building)));
		await actor.attemptsTo(Click.on(nextButton), Click.on(nextButton), Wait.until(on.shown(shown)));
	};

// The first input of each wizard, which starts its draft
const startDraft: Record<string, Activity> = {
	'/contracts/new': Select.option({ index: 1 }).from(tenantSelect),
	'/statements/generate': (actor) => actor.attemptsTo(Click.on(nextButton), Check.the(on.firstGenerateBuilding))
};

const endWithPastDate: Activity = async (actor) => {
	if ((await actor.answer(pageAddress)).endsWith('/edit')) {
		await clickOnShown(actor, 'Befristet', durationChoice);
		await actor.attemptsTo(EnterDate.of(inDays(-30)).into(endDateInput), Click.on(contractSubmitButton));
	} else {
		await actor.attemptsTo(
			openDialog(endContractButton),
			EnterDate.of(inDays(-30)).into(contractEndInput),
			Click.on(confirmEndContractButton)
		);
	}
	await actor.attemptsTo(Wait.until(on.invalidPastEndConfirm));
};

// Two files, one created: the result with the file still open. Files go into the example's own building: the first
// in the list may be a parallel scenario's, deleted by its cleanUp while the files are read
const createPartly = (building: string): Activity => (actor) => {
	const complete = `Elektro Blitz ${randomUUID()}.pdf`;
	const open = `Werke ${randomUUID()}.pdf`;
	return actor.attemptsTo(
		uploadBelege(building, [invoicePdf(complete), invoicePdf(open)]),
		Wait.until(belegDetailsToggle(complete)),
		Wait.until(belegDetailsToggle(open)),
		Click.on(createInvoicesButton),
		Wait.until(uploadResult)
	);
};

// What a user does to reach each state
const states: Record<string, (example: Example, viewport: Viewport) => Activity> = {
	default: () => async () => {},
	'filtered-empty': () => Wait.until(on.emptyHint),
	empty: () => Wait.until(on.emptyHint),
	'first-use': () => async (actor) => actor.attemptsTo(Wait.until(on.text(await say(actor, 'Erstes Gebäude erfassen')))),
	'login-error': () => Wait.until(on.loginError),
	demo: () => Wait.until(demoNotice),
	'submit-empty': () => (actor) => actor.attemptsTo(Click.on(on.saveButton), Wait.until(on.formProblem)),
	'submit-cleared': () => (actor) =>
		actor.attemptsTo(Enter.theValue('').intoEach(on.requiredFields), Click.on(on.saveButton), Wait.until(on.formProblem)),
	// saved as loaded
	'saved-toast': () => (actor) => actor.attemptsTo(Click.on(on.saveButton), Wait.until(on.savedToast)),
	'server-error': () => async (actor) =>
		actor.attemptsTo(Wait.until(on.text(await say(actor, 'Versuchen Sie es später erneut.')))),
	// French chosen with the language selection (the page reloads); later viewports start in French already
	'other-language': () => async (actor) => {
		if ((await actor.answer(pageLanguage)) !== 'fr')
			await actor.attemptsTo(Click.on(languageButton), Click.toReload(on.frenchOption));
		await actor.attemptsTo(Wait.until(on.frenchPage));
	},
	'delete-dialog': () => openDialog(on.firstDeleteButton),
	// the tenant's uploaded document (fixtures/screens.ts)
	'document-delete-dialog': () => openDialog(deleteDocumentButton(UPLOADED)),
	// a file Dwello does not take: the refusal at the file field
	'upload-refused': () => (actor) =>
		actor.attemptsTo(uploadDocument(wordFile('notizen.docx'), ''), Wait.until(on.formProblem)),
	'fuel-stock-dialog': () => openDialog(on.firstFuelStockDelete),
	'upload-dialog': (example) => (actor) => {
		// the stand-in finds deducted amounts and costs that are not allocable in a file so named; the UUID marks it user data
		const read = `Werke Schlussrechnung Reparatur ${randomUUID()}.pdf`;
		return actor.attemptsTo(
			uploadBelege(example.building, [invoicePdf(read), wordFile('notes.docx')]),
			Click.on(belegDetailsToggle(read)),
			Wait.until(belegUnsure(read, 'invoiceDate'))
		);
	},
	// one invoice created, the other kept with what it lacks (no Kategorie: the stand-in categorizes only «Elektro Blitz»)
	'upload-partial': (example) => (actor) => actor.attemptsTo(createPartly(example.building)),
	'upload-discard-created': (example) => (actor) =>
		actor.attemptsTo(createPartly(example.building), Click.on(cancelUploadButton), Wait.until(discardMessage)),
	// the stand-in answers no JSON for a file so named
	'upload-unreadable': (example) => (actor) => {
		const read = `Elektro ${randomUUID()} unlesbar.pdf`;
		return actor.attemptsTo(uploadBelege(example.building, [invoicePdf(read)]), Wait.until(belegMessage(read)));
	},
	'upload-discard-dialog': (example) => (actor) => {
		const read = `Elektro ${randomUUID()}.pdf`;
		return actor.attemptsTo(
			uploadBelege(example.building, [invoicePdf(read)]),
			Wait.until(belegDetailsToggle(read)),
			Click.on(cancelUploadButton),
			Wait.until(discardMessage)
		);
	},
	// by keyboard: the gallery's toasts cover the page
	'dialog-open': () => (actor) => actor.attemptsTo(Press.theKey('Enter').on(on.galleryDialogButton), Wait.until(on.dialog)),
	'busy-dialog-open': () => (actor) =>
		actor.attemptsTo(Press.theKey('Enter').on(on.galleryBusyDialogButton), Wait.until(on.labelledDialog)),
	'end-dialog': () => openDialog(endContractButton),
	// a started contract without statements: the mistake not confirmed (#116)
	'delete-unconfirmed': () => (actor) =>
		actor.attemptsTo(openDialog(deleteContractButton), Click.on(confirmDeleteContractButton), Wait.until(on.dialogError)),
	'end-dialog-error': () => (actor) =>
		actor.attemptsTo(openDialog(endContractButton), Click.on(confirmEndContractButton), Wait.until(on.dialogError)),
	// the end dialog on the contract page, the contract form on its edit page
	'past-end-error': () => endWithPastDate,
	// the seeded contract runs since 2015 with statements only for 2024 and 2025: several periods are missing (#142)
	'missing-statements': () => Wait.until(on.shown('contract-missing-statement')),
	// the 2025 draft already bills rent days after 31.03.2025: the dialog links it and offers to delete it (A-10)
	'end-dialog-refused': () => (actor) =>
		actor.attemptsTo(
			openDialog(endContractButton),
			EnterDate.of('2025-03-31').into(contractEndInput),
			Check.the(contractEndPastConfirm),
			Click.on(confirmEndContractButton),
			Wait.until(on.refusedStatements)
		),
	// A-3 (#112): the notice arrived six weeks before the Vertragsende: the hint at the field, saving still possible
	'end-dialog-notice-hint': () => (actor) =>
		actor.attemptsTo(
			openDialog(endContractButton),
			EnterDate.of('2099-03-31').into(contractEndInput),
			EnterDate.of('2099-02-15').into(noticeReceivedInput),
			Wait.until(on.shown('contract-notice-period-hint'))
		),
	// the same refusal from the contract form: the 2025 draft bills rent days after 31.03.2025 (A-10)
	'edit-refused': () => async (actor) => {
		await clickOnShown(actor, 'Befristet', durationChoice);
		await actor.attemptsTo(
			EnterDate.of('2025-03-31').into(endDateInput),
			Check.the(contractEndPastConfirm),
			Click.on(contractSubmitButton),
			Wait.until(on.refusedStatements)
		);
	},
	// the link opens the wizard at the settings step with the building and period it names
	'link-preset': () => Wait.until(on.wizardPreset),
	'list-scoped': () => Wait.until(on.listScope),
	'pdf-missing': () => Wait.until(on.shown('statement-pdf-missing')),
	'send-dialog': () => openDialog(on.sendButton),
	// As from a tab that still shows the draft: deleting the sent statement is refused by the server
	'action-error': () => (actor) => actor.attemptsTo(PostFormAction('?/delete'), Wait.until(on.formProblem)),
	'reminder-dialog': () => openDialog(on.reminderButton),
	// the seeded reminder, named in the screen's query; marking it again keeps it as it is, so each viewport can
	'marked-sent': (example) => (actor) =>
		actor.attemptsTo(
			PostFormAction('?/markSent', { id: new URL(example.path, 'http://x').searchParams.get('letter')! }),
			Wait.until(on.shown('document-marked-sent'))
		),
	'mark-paid-dialog': () => openDialog(on.markPaidButton),
	'reset-payment-dialog': () => openDialog(on.resetPaymentButton),
	'formula-tested': () => (actor) =>
		actor.attemptsTo(
			Enter.theValue('{area}').into(on.formulaInput),
			Click.on(on.formulaTestButton),
			Wait.until(on.formulaTestOutcome)
		),
	// The KI stand-in (backend/scripts/llm-stub.ts) is sure about a renovation, not about guarding the building
	'ki-proposal': () => askKi('Dachsanierung'),
	'ki-unsure': () => askKi('Bewachung'),
	// The KI stand-in fails for a name starting with «KI-Ausfall»
	'ki-unavailable': () => askKi('KI-Ausfall Fensterreinigung'),
	// the stand-in answers names with «langsam» after 25 s: the check is still running
	'ki-checking': () => (actor) =>
		actor.attemptsTo(
			Enter.theValue('Langsame Prüfung').into(nameInput),
			Click.on(proposeButton),
			Wait.until(on.proposalChecking)
		),
	// chosen first: the stand-in finds stairwell cleaning umlagefähig, the own choice stays
	'ki-proposal-kept': () => (actor) =>
		actor.attemptsTo(Check.the(on.notAllowedOption), askKi('Treppenhausreinigung')),
	'profile-sum-invalid': () => (actor) =>
		actor.attemptsTo(Enter.theValue('50').into(on.januaryShare), Wait.until(on.invalidProfileTotal)),
	'mobile-menu-open': (_, viewport) => async (actor) => {
		if (viewport === 'desktop') return; // the sidebar is always open from 1024 px
		await actor.attemptsTo(Click.on(on.mobileMenuButton));
		await actor.attemptsTo(Wait.until(on.mainNavigationDialog(await say(actor, 'Hauptnavigation'))));
	},
	'language-menu-open': () => (actor) => actor.attemptsTo(Click.on(languageButton), Wait.until(on.languageOptions)),
	'user-menu-open': () => (actor) => actor.attemptsTo(Click.on(userMenuButton), Wait.until(on.userMenuSettings)),
	'overlap-warning': () => (actor) =>
		actor.attemptsTo(
			Click.on(nextButton), // tenant and apartment come from the address
			Click.on(nextButton),
			Wait.forValue(startDateInput, '01.01.2100'), // the suggestion arrived, it cannot land in the typed date
			EnterDate.of('2020-01-01').into(startDateInput), // the apartment is rented until 2099
			Wait.until(on.overlapWarning)
		),
	// the apartments' rental contracts cannot be loaded (#143); the wizard shows it from the step "Wohnung"
	'contracts-unknown': () => async (actor) => {
		await actor.attemptsTo(FailRequests.to('/api/contracts', {}), Navigate.reload);
		if ((await actor.answer(pageAddress)).includes('/contracts/new')) await actor.attemptsTo(Click.on(nextButton));
		// once more, still failing: the message that says so is checked too (#151, review R2-3)
		await actor.attemptsTo(Wait.until(apartmentContractsUnknown), Click.on(retryContractsButton), Wait.until(errorToast));
	},
	// the same, at the step before saving: tenant and apartment come from the address
	'contracts-unknown-review': () => (actor) =>
		actor.attemptsTo(
			FailRequests.to('/api/contracts', {}),
			Navigate.reload,
			Click.on(nextButton),
			Wait.until(apartmentContractsUnknown),
			Click.on(nextButton),
			EnterDate.of('2030-01-01').into(startDateInput),
			Click.on(nextButton),
			Enter.theValue('1500').into(baseRentInput),
			Click.on(nextButton),
			Wait.until(reviewContractsUnknown)
		),
	'draft-restored': () => async (actor) => {
		await actor.attemptsTo(startDraft[new URL(await actor.answer(pageAddress)).pathname]); // a draft starts with an input
		await actor.attemptsTo(Wait.until(saveStatus(await say(actor, 'Entwurf gespeichert'))), Navigate.reload, Wait.until(draftRestored));
	},
	// 2026 against 2025: the heating invoice of 2025 has no successor yet
	'category-check': (example) => previewOf('2026', 'category-check')(example),
	'preview-empty': (example) => previewOf('2000', 'preview-empty')(example),
	'preview-all-billed': (example) => previewOf('2024', 'preview-all-billed')(example),
	// 2025 with a second building that has heating costs but never had a Tankbestand
	'tank-question': (example) => previewOf('2025', 'tank-question')(example, example.tankBuilding),
	// a draft from an earlier visit whose building and heating profile were deleted since
	'draft-dropped': () => (actor) =>
		actor.attemptsTo(
			Browser.keepInLocalStorage(
				draftOf('statements', { periodStart: '2025-01-01', periodEnd: '2025-12-31', heatingProfileId: 'geloescht', managementFeePercent: 3, buildingIds: ['geloescht'] })
			),
			Navigate.reload,
			Wait.until(on.shown('draft-note'))
		),
	// 2025, not the suggested period, which moves with today: Anna and Bruno have their statements, Carla not
	'buildings-billed': (example) => (actor) =>
		actor.attemptsTo(
			EnterDate.of('2025-01-01').into(on.periodStartInput),
			EnterDate.of('2025-12-31').into(on.periodEndInput),
			Click.on(nextButton),
			Wait.until(on.shown(`generate-building-billed-${example.building}`))
		),
	'period-not-over': () => (actor) =>
		actor.attemptsTo(EnterDate.of('2099-12-31').into(on.periodEndInput), Wait.until(on.periodFutureWarning))
};

// Rental contract wizard, tenant and a free apartment from the address: every step up to "Prüfen"
const contractWizardSteps = (look: Activity): Activity => async (actor) => {
	const nextStep = (shown: Target) => actor.attemptsTo(Click.on(nextButton), Wait.until(shown));
	await actor.attemptsTo(look); // "Mieter"
	await nextStep(apartmentSelect); // "Wohnung", once the apartments are checked
	await actor.attemptsTo(look);
	await nextStep(startDateInput); // "Vertragsdauer", limited: end date and both dates in words
	await clickOnShown(actor, 'Befristet', durationChoice);
	await actor.attemptsTo(EnterDate.of('2030-01-01').into(startDateInput), EnterDate.of('2031-12-31').into(endDateInput), look);
	await nextStep(baseRentInput); // "Miete"
	await actor.attemptsTo(Enter.theValue('1500').into(baseRentInput), look);
	await nextStep(on.shown('contract-review-item')); // "Prüfen"
	await actor.attemptsTo(look);
};

// Statement wizard: period, buildings, preview; every step is checked before going on
const statementWizardSteps =
	(look: Activity, example: Example): Activity =>
	async (actor) => {
		const nextStep = (shown: string) => actor.attemptsTo(Click.on(nextButton), Wait.until(on.shown(shown)), look);
		await actor.attemptsTo(look); // "Abrechnungsperiode"
		await nextStep('generate-all-buildings'); // "Gebäude"
		// this example's building: another example's may still be seeding, without a contract to preview
		await actor.attemptsTo(Check.the(on.generateBuilding(example.building)));
		await nextStep('heating-profile-select'); // "Heizprofil und Verwaltungspauschale"
		await nextStep('preview-count'); // "Vorschau", calculated on the server
		// a building without invoices must be confirmed
		if (await actor.answer(Visibility.of(on.confirmMissingInvoices))) await actor.attemptsTo(Check.the(on.confirmMissingInvoices));
		await nextStep('generate-drafts-note'); // "Erstellen"
	};

// A wizard draft as the app keeps it in the browser, written by the app's own code (code review C-7)
function draftOf(name: string, values: object) {
	const kept: Record<string, string> = {};
	writeDraft({ setItem: (key: string, value: string) => void (kept[key] = value) } as unknown as Storage, name, values, new Date());
	return kept;
}

// 'empty' and 'first-use' need a database without records: the empty instance of the stack (playwright.config.ts);
// 'demo' the instance with DEMO=on. Both start only for the features playwright.config.ts names in `usesExtraInstances`
const EMPTY_INSTANCE = 'http://localhost:3102';
const instanceOf = (state: string) =>
	['empty', 'first-use'].includes(state) ? EMPTY_INSTANCE : state === 'demo' ? DEMO_INSTANCE : '';

/** Public screens are looked at without a session */
const leaveSessionFor =
	(example: Example): Activity =>
	async (actor) => {
		if (example.public) await actor.attemptsTo(Cookies.clear);
	};

/** The language the app and its empty instance show (the cookie the language selection sets) */
const useLanguage = (language: string) =>
	Cookies.add(
		['http://localhost:3100', 'http://localhost:3102'].map((url) => ({ name: 'PARAGLIDE_LOCALE', value: language, url }))
	);

/** Opens the example's screen in its state for one viewport and colour scheme and notes what `look` finds there,
 * at every step of a wizard for 'every-wizard-step' */
const lookAt =
	(example: Example, viewport: Viewport, scheme: 'light' | 'dark', look: Question<string[]>, prefix = ''): Activity =>
	async (actor) => {
		await actor.attemptsTo(
			Browser.resizeTo(viewports[viewport]),
			Browser.useColorScheme(scheme),
			Browser.clearLocalStorage, // no draft from the previous viewport
			Navigate.to(instanceOf(example.state) + example.path)
		);
		const noted = note(look, prefix);
		if (example.state !== 'every-wizard-step') {
			const reachState = states[example.state]; // a lookup, then a call: lint refuses calls by computed name
			return actor.attemptsTo(reachState(example, viewport), noted);
		}
		const wizard = new URL(example.path, 'http://x').pathname;
		await actor.attemptsTo(
			wizard === '/contracts/new' ? contractWizardSteps(noted) : statementWizardSteps(noted, example)
		);
	};

/** axe on the example in every viewport and colour scheme */
export const checkAccessibilityOf = (example: Example): Activity => async (actor) => {
	await actor.attemptsTo(leaveSessionFor(example));
	for (const { viewport, scheme } of variants)
		await actor.attemptsTo(lookAt(example, viewport, scheme, accessibilityViolations, `${viewport}, ${scheme}: `));
};

/** The example on a phone in French, Italian and English: German left and text that does not fit; scenario records
 * (`userData`) are no UI text */
export const checkLanguagesOf = (example: Example, userData: string[]): Activity => async (actor) => {
	await actor.attemptsTo(leaveSessionFor(example));
	// 'other-language' chooses French itself
	for (const language of example.state === 'other-language' ? ['fr'] : ['fr', 'it', 'en'])
		await actor.attemptsTo(useLanguage(language), lookAt(example, 'mobile', 'light', languageFindings(language, userData)));
};
